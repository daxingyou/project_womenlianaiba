-module(tcp_mm).
-author('saleyn@gmail.com').

-behaviour(gen_fsm).
-include("packet_def.hrl"). 
-include("enum_def.hrl").
-include("tcp_mm_data.hrl").

-export([start_link/0, start_link/1, set_socket/2, repeat_login_stop/1, stop/1]).

%% gen_fsm callbacks
-export([init/1, handle_event/3, send/2,
         handle_sync_event/4, handle_info/3, terminate/3, code_change/4]).

%% FSM States
-export([
	 wait_for_http_header/2,
	 'WAIT_FOR_SOCKET'/2,
	 'WAIT_FOR_DATA'/2,
	 'WAIT_FOR_AUTH'/2
]).

%% -record(state, {
%%                 socket,    	% client socket
%%                 addr,       % client address
%% 				account
%%                }).

-define(TIMEOUT, infinity).

-define(KEEPALIVE_TIME, 30 * 1000).

%%%------------------------------------------------------------------------
%%% API
%%%------------------------------------------------------------------------

%%-------------------------------------------------------------------------
%% @spec (Socket) -> {ok,Pid} | ignore | {error,Error}
%% @doc To be called by the supervisor in order to start the server.
%%      If init/1 fails with Reason, the function returns {error,Reason}.
%%      If init/1 returns {stop,Reason} or ignore, the process is
%%      terminated and the function returns {error,Reason} or ignore,
%%      respectively.
%% @end
%%-------------------------------------------------------------------------
start_link() ->
    gen_fsm:start_link(?MODULE, [], []).
start_link([]) ->
    start_link().

stop(Pid) ->
    gen_fsm:send_event(Pid, stop).

%% 因重复登陆停止
repeat_login_stop(Pid) ->
    gen_fsm:send_event(Pid, repeat_login_stop).


set_socket(Pid, Socket) when is_pid(Pid), is_port(Socket) ->
    gen_fsm:send_event(Pid, {socket_ready, Socket}).

%% 发送消息到客户端
send(MMPid, Packet) ->
    %%io:format("packet:~p~n", [Packet]),
    net_helper:send2mm(MMPid, Packet).

%%%------------------------------------------------------------------------
%%% Callback functions from gen_server
%%%------------------------------------------------------------------------

%%-------------------------------------------------------------------------
%% Func: init/1
%% Returns: {ok, StateName, StateData}          |
%%          {ok, StateName, StateData, Timeout} |
%%          ignore                              |
%%          {stop, StopReason}
%% @private
%%-------------------------------------------------------------------------
init([]) ->
    process_flag(trap_exit, true),
    data_helper:start(),
    {ok, 'WAIT_FOR_SOCKET', #tcp_mm_data{}}.

%%-------------------------------------------------------------------------
%% Func: StateName/2
%% Returns: {next_state, NextStateName, NextStateData}          |
%%          {next_state, NextStateName, NextStateData, Timeout} |
%%          {stop, Reason, NewStateData}
%% @private
%%-------------------------------------------------------------------------
'WAIT_FOR_SOCKET'({socket_ready, Socket}, State) when is_port(Socket) ->
    % Now we own the socket
    inet:setopts(Socket, [{active, once}, {packet, raw}, binary]),
    case inet:peername(Socket) of
	{ok, {IP, _Port}} ->
	    erlang:start_timer(?KEEPALIVE_TIME, self(), []),
	    {next_state, wait_for_http_header, State#tcp_mm_data{socket=Socket, addr=IP}, ?TIMEOUT};
	{error,enotconn} ->
	    {stop, normal, State}
    end;
'WAIT_FOR_SOCKET'(Other, State) ->
    error_logger:error_msg("State: 'WAIT_FOR_SOCKET'. Unexpected message: ~p\n", [Other]),
    %% Allow to receive async messages
    {next_state, 'WAIT_FOR_SOCKET', State}.

%% 该处理函数主要是为了满足腾讯的TGW网关的分布式部署的技术要求而做的添加
%% 具体请看文档: http://wiki.open.qq.com/wiki/TGW
%% wait_for_http_header({data, <<"GET / HTTP/1.1\r\n Host: app35398.qzoneapp.com:8001\r\n\r\n">>},State) ->
%%     io:format("WAIT FOR HTTP HEADER~n"),
%%     {next_state, 'WAIT_FOR_AUTH', State, ?TIMEOUT};
wait_for_http_header(_Data, #tcp_mm_data{socket=Socket}=State) ->
    inet:setopts(Socket, [{packet, 4}]),
    {next_state, 'WAIT_FOR_AUTH', State, ?TIMEOUT}.


%% 等待权限的验证
'WAIT_FOR_AUTH'({data, Binary}, #tcp_mm_data{socket=Socket, packet_count=PacketCount}=State) ->
    NPacketCount = 
	case PacketCount >= 255 of
	    true -> 0;
	    _ -> PacketCount + 1
	end,
    DecodeData = net_helper:get_data(Binary, NPacketCount),
    data_helper:format("~p~n", [DecodeData]),
    player_auth:call(Socket, State#tcp_mm_data{packet_count=NPacketCount}, ?TIMEOUT, DecodeData);
'WAIT_FOR_AUTH'(timeout, State) ->
    error_logger:error_msg("~p Client connection timeout - closing.\n", [self()]),
    {stop, normal, State};
'WAIT_FOR_AUTH'(Data, State) ->
    data_helper:format("~p Ignoring data: ~p\n", [self(), Data]),
    {next_state, 'WAIT_FOR_DATA', State, ?TIMEOUT}.

%% Notification event coming from client
'WAIT_FOR_DATA'({data, Binary}, #tcp_mm_data{account=Account, socket=_Socket, packet_count=PacketCount}=State) ->
    NPacketCount = 
	case PacketCount >= 255 of
	    true -> 0;
	    _ -> PacketCount + 1
	end,
    D = net_helper:get_data(Binary, NPacketCount),

    {Type, Data} = D,
    data_helper:format("Data:~p~n", [D]),
    %% TODO: 可能存在性能热点, 可以改成发给gamesvr中的player进程
    %% 然后那边再router转发, 这样可以提高效率, 避免mnesia操作
    %%case Type =:= ?msg_req_fixed_broadcast of
%%	true -> %% 请求系统固定公告
%%	    sys_broadcast:req_fixed_broadcast(Socket, Data);
%%	_ ->
	    router:cast(Account, Type, Data),
%%    end,
    {next_state, 'WAIT_FOR_DATA', State#tcp_mm_data{packet_count=NPacketCount}, ?TIMEOUT};

'WAIT_FOR_DATA'(timeout, #tcp_mm_data{account=Account}=State) ->
    error_logger:error_msg("Account:~p Client connection timeout - closing.\n", [Account]),
    {stop, normal, State};

'WAIT_FOR_DATA'(stop, State) ->
    {stop, normal, State};

'WAIT_FOR_DATA'(repeat_login_stop, #tcp_mm_data{socket=Socket}=State) ->
    Packet = #notify_repeat_login{},
    {Type, Binary} = protocal:encode(Packet),
    Bin = net_helper:make_net_binary(Type, Binary),    

    gen_tcp:send(Socket, Bin),
    {stop, normal, State};


'WAIT_FOR_DATA'(Data, State) ->
    data_helper:format("~p Ignoring data: ~p\n", [self(), Data]),
    {next_state, 'WAIT_FOR_DATA', State, ?TIMEOUT}.

%%-------------------------------------------------------------------------
%% Func: handle_event/3
%% Returns: {next_state, NextStateName, NextStateData}          |
%%          {next_state, NextStateName, NextStateData, Timeout} |
%%          {stop, Reason, NewStateData}
%% @private
%%-------------------------------------------------------------------------
handle_event(_Event, StateName, StateData) ->
    {next_state, StateName, StateData}.

%%-------------------------------------------------------------------------
%% Func: handle_sync_event/4
%% Returns: {next_state, NextStateName, NextStateData}            |
%%          {next_state, NextStateName, NextStateData, Timeout}   |
%%          {reply, Reply, NextStateName, NextStateData}          |
%%          {reply, Reply, NextStateName, NextStateData, Timeout} |
%%          {stop, Reason, NewStateData}                          |
%%          {stop, Reason, Reply, NewStateData}
%% @private
%%-------------------------------------------------------------------------
handle_sync_event(Event, _From, StateName, StateData) ->
    {stop, {StateName, undefined_event, Event}, StateData}.

%%-------------------------------------------------------------------------
%% Func: handle_info/3
%% Returns: {next_state, NextStateName, NextStateData}          |
%%          {next_state, NextStateName, NextStateData, Timeout} |
%%          {stop, Reason, NewStateData}
%% @private
%%-------------------------------------------------------------------------
handle_info({send2client, Bin}, StateName, #tcp_mm_data{socket=Socket} = StateData) ->
    gen_tcp:send(Socket, Bin),
    {next_state, StateName, StateData, ?TIMEOUT};
handle_info({timeout, _TimerRef, _Msg}, StateName, #tcp_mm_data{socket=Socket} = StateData) ->
    {Type, Binary} = protocal:encode(#notify_heartbeat{}),
    Bin = net_helper:make_net_binary(Type, Binary), 
    case gen_tcp:send(Socket, Bin) of
	ok ->
	    erlang:start_timer(?KEEPALIVE_TIME, self(), []),
	    {next_state, StateName, StateData, ?TIMEOUT};
	{error, Reason} ->
	    error_logger:error_msg("socket send data error, Reason: ~p\n", [Reason]),
	    {stop, normal, StateData}
    end;
handle_info({tcp, Socket, Bin}, StateName, #tcp_mm_data{socket=Socket} = StateData) ->
    % Flow control: enable forwarding of next TCP message
    inet:setopts(Socket, [{active, once}]),
    ?MODULE:StateName({data, Bin}, StateData);

handle_info({tcp_closed, _Socket}, _StateName, StateData) ->
    {stop, normal, StateData};
handle_info({tcp_error, _Socket, Error}, _StateName, StateData) ->
    logger:log(error, "tcp_error:" ++ Error),
    {stop, normal, StateData};
handle_info(Info, StateName, StateData) ->
    logger:log(error, "tcp_mm unhandle info: ~p~n", [Info]),
    {noreply, StateName, StateData}.

%%-------------------------------------------------------------------------
%% Func: terminate/3
%% Purpose: Shutdown the fsm
%% Returns: any
%% @private
%%-------------------------------------------------------------------------
terminate(_Reason, _StateName, #tcp_mm_data{account=Account, player_sup=Pid, socket=Socket}) ->
    %% 当命令行q()时，所有的appliaction会停掉, 这里会因找不到节点报错
    %% 所以写了个catch，强制不报错
    try
	db_player:delete_online_player(Account),
	shutdown(Pid, Account),
	gen_tcp:close(Socket)
    catch
    	_A: _B ->
    	    ok
    end,
	
    ok.

%%-------------------------------------------------------------------------
%% Func: code_change/4
%% Purpose: Convert process state when code is changed
%% Returns: {ok, NewState, NewStateData}
%% @private
%%-------------------------------------------------------------------------
code_change(_OldVsn, StateName, StateData, _Extra) ->
    {ok, StateName, StateData}. 

shutdown(_Pid, undefined) ->
    ok;    
shutdown(Pid, Account) ->
    case Pid =/= undefined of
	true ->
	    Node = node(Pid),
	    player_sup:stop(Node, Account);
	false -> ok
    end.



    
