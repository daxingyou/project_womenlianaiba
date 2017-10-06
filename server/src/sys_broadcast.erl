%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2010, hongjx
%%% @doc
%%%   ϵͳ�㲥
%%% @end
%%% Created :  9 Dec 2010 by hongjx <hongjx@35info.cn>

-module(sys_broadcast).
-include("packet_def.hrl").
-include("tplt_def.hrl").
-include("enum_def.hrl").
-include("common_def.hrl").
-include_lib("stdlib/include/qlc.hrl").


-export([start_link/0]).

%% gen_server callbacks
-export([init/1, handle_call/3, handle_cast/2, handle_info/2,
	 terminate/2, code_change/3]).

-export([send/2, add/5, send/7, modify/6, gm_change_broadcast/2, req_fixed_broadcast/2, clear/1]).
-export([get_type/1, send_to_all_players/1]).
-export([reload/0]).

-behaviour(gen_server).

-define(SERVER, ?MODULE). 
-define(table_name, sys_broadcast).

-record(state, {
	  is_farm_app,        %% �Ƿ�ũ��
	  timer_list = [],    %% ��ʱ���б�
	  fix_list = []       %% �̶����棬��Ȼ���͹��ˣ���������ߺ�����Ҫ֪���Ĺ���
	 }
       ).

-record(sys_broadcast, {
	  id, 
	  type,         %% ����
	  content,      %% ����
	  start_time,   %% ��ʼʱ��
	  play_times,   %% ���Ŵ���
	  priority      %% ���ȼ�
	 }
       ).


%%%===================================================================
%%% API
%%%===================================================================
reload()->
    gen_server:cast(?SERVER, load_from_db).

get_type(#sys_broadcast{type=Type}) ->
    Type.

%% GM�޸Ĺ���֪ͨ
gm_change_broadcast(ID, Type) when is_integer(ID) ->
    %% io:format("gm_change_broadcast~n"),
    gen_server:cast(?SERVER, {gm_change_broadcast, {ID, Type}}).

-spec clear(integer())-> list().
clear(Type)->
    case db:match_object(#sys_broadcast{type=Type, _='_'}) of
	Broadcasts when is_list(Broadcasts)->
	    [begin 
		 db:dirty_delete(sys_broadcast, Broadcast#sys_broadcast.id), 
		 Broadcast#sys_broadcast.id 
	     end || Broadcast <- Broadcasts];
	_->
	    []
    end.

add(Type, Content, StartTime, PlayTimes, Priority) ->
    Id = guid:make(?st_sys_boardcast),
    SysBroadcast = #sys_broadcast{id=Id,
				  type=Type,
				  content=Content,
				  start_time=StartTime,
				  play_times=PlayTimes,
				  priority=Priority
				 },
    db:dirty_write(SysBroadcast),
    Id.

modify(Id, Type, Content, StartTime, PlayTimes, Priority) ->
    SysBroadcast = #sys_broadcast{id=Id,
				  type=Type,
				  content=Content,
				  start_time=StartTime,
				  play_times=PlayTimes,
				  priority=Priority
				 },
    db:dirty_write(SysBroadcast).

%% ���͹���
send(ID, Type, Content, PlayTimes, Priority, ShowSeconds, StartTime) ->
    Packet = #notify_sys_broadcast{id=ID, type=Type, content=Content, 
				   play_times=PlayTimes, 
				   priority=Priority,
				   start_time=datetime:make_time(StartTime),
				   show_seconds=ShowSeconds},
    send_to_all_players(Packet).


send_to_all_players(Packet) ->
    Players = db_player:get_online_players(),
    %% ֪ͨ������Ϣ
    %% io:format("Players:~p~n", [Players]),
    [net_helper:send2client(Acc, Packet) || Acc <- Players],		
    ok.
    

send(0=_BroadcastID, _Params) ->
    ok;
send(BroadcastID, Params) when is_integer(BroadcastID),
			       is_list(Params) ->
    %% ȡ��Ӧ��������
    #sys_broadcast_tplt{content=Content, show_seconds=ShowSeconds} =
	tplt:get_data(sys_broadcast_tplt, BroadcastID),

    F = fun(X, Acc) -> util:replace_str(Acc, "%s", X) end,
    NewContent = lists:foldl(F, binary_to_list(Content), Params),
    Type = ?sbt_player_behavior, %% ��ҫ������Ϣ(������Ʒ֮���)
    PlayTimes = 0,
    Priority = 0,
    send(0, Type, NewContent, PlayTimes, Priority, ShowSeconds, datetime:local_time()).

%% ����̶�����
req_fixed_broadcast(Socket, {req_fixed_broadcast, Type}) 
  when is_port(Socket) ->
    gen_server:cast(?SERVER, {req_fixed_broadcast, Type, Socket});

req_fixed_broadcast(Account, {req_fixed_broadcast, Type}) 
  when is_list(Account) ->
    gen_server:cast(?SERVER, {req_fixed_broadcast, Type, list_to_atom(Account)});

req_fixed_broadcast(Account, Type) 
  when is_atom(Account) andalso is_integer(Type) ->
    req_fixed_broadcast(Account, {req_fixed_broadcast, Type});
 
req_fixed_broadcast(Account, {req_fixed_broadcast, Type}) 
  when is_atom(Account) ->
    gen_server:cast(?SERVER, {req_fixed_broadcast, Type, Account}).

%%--------------------------------------------------------------------
%% @doc
%% Starts the server
%%
%% @spec start_link() -> {ok, Pid} | ignore | {error, Error}
%% @end
%%--------------------------------------------------------------------
start_link() ->
    {ok, Pid} = gen_server:start_link({local, ?SERVER}, ?MODULE, [], []),
    gen_server:cast(Pid, load_from_db),
    {ok, Pid}.

%%%===================================================================
%%% gen_server callbacks
%%%===================================================================

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Initializes the server
%%
%% @spec init(Args) -> {ok, State} |
%%                     {ok, State, Timeout} |
%%                     ignore |
%%                     {stop, Reason}
%% @end
%%--------------------------------------------------------------------
init([]) ->
    process_flag(trap_exit, true),
    {ok, #state{is_farm_app=false}}.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Handling call messages
%%
%% @spec handle_call(Request, From, State) ->
%%                                   {reply, Reply, State} |
%%                                   {reply, Reply, State, Timeout} |
%%                                   {noreply, State} |
%%                                   {noreply, State, Timeout} |
%%                                   {stop, Reason, Reply, State} |
%%                                   {stop, Reason, State}
%% @end
%%--------------------------------------------------------------------
handle_call(_Request, _From, State) ->
    Reply = ok,
    {reply, Reply, State}.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Handling cast messages
%%
%% @spec handle_cast(Msg, State) -> {noreply, State} |
%%                                  {noreply, State, Timeout} |
%%                                  {stop, Reason, State}
%% @end
%%--------------------------------------------------------------------
%% ����̶�����
handle_cast({req_fixed_broadcast, Type, Socket}, 
	    #state{fix_list=FixList}=State)
when is_port(Socket) ->
    [begin
	case X of
	    #sys_broadcast{id=ID,
			   type=Type, 
			   content=Content,
			   start_time=StartTime,
			  play_times=PlayTimes,
			  priority=Priority} ->

		ShowSeconds = 0,
		Packet = #notify_sys_broadcast{id=ID,
					       type=Type, 
					       content=Content, 
					       play_times=PlayTimes, 
					       priority=Priority,
					       start_time=datetime:make_time(StartTime),
					       show_seconds=ShowSeconds},		
		net_helper:send(Socket, Packet);
	    _ ->
		ok
	end
     end || X <- FixList],
    {noreply, State};   

handle_cast({req_fixed_broadcast, Type, Account}, 
	    #state{fix_list=FixList}=State) when is_atom(Account)->
    Length = length(FixList),
    Item = case Length of 
	       0->[];
	       _->
		   lists:sublist(FixList, Length, 1)
	   end,
    [begin
	case X of
	    #sys_broadcast{id=ID,
			   type=Type, 
			   content=Content,
			   start_time=StartTime,
			  play_times=PlayTimes,
			  priority=Priority} ->

		ShowSeconds = 0,
		Packet = #notify_sys_broadcast{id=ID,
					       type=Type, 
					       content=Content, 
					       play_times=PlayTimes, 
					       priority=Priority,
					       start_time=datetime:make_time(StartTime),
					       show_seconds=ShowSeconds},		
		net_helper:send2client(Account, Packet);
	    _ ->
		ok
	end
     end || X <- Item],
    {noreply, State};  
%% GM�޸Ĺ���֪ͨ
handle_cast({gm_change_broadcast, {ID, Type}}, State) ->
    data_helper:format("gm change broadcast ~n~n"),
    Packet = #notify_del_broadcast{id=ID, type=Type}, 	    
    send_to_all_players(Packet),
    %% case select_record(ID) of
    %% 	[] -> %% �Ҳ���ID˵����ɾ������, Ҫ֪ͨ���еĿͻ���
    %% 	    Packet = #notify_del_broadcast{id=ID, type=Type}, 	    
    %% 	    send_to_all_players(Packet, IsFarmApp);
    %% 	_Record ->
    %% 	    ok
    %% end,
    %% ���¼���
    NewState = load_from_db(State),
    {noreply, NewState};  
    
%% ���ع����б�
handle_cast(load_from_db, State) ->
    NewState = load_from_db(State),
    {noreply, NewState};
handle_cast(_Msg, State) ->
    {noreply, State}.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Handling all non call/cast messages
%%
%% @spec handle_info(Info, State) -> {noreply, State} |
%%                                   {noreply, State, Timeout} |
%%                                   {stop, Reason, State}
%% @end
%%--------------------------------------------------------------------
%% ���͹���
handle_info({time_to_send, #sys_broadcast{id=ID,
					  type=Type,
					  content=Content,
					  play_times=PlayTimes,
					  start_time=StartTime,
					  priority=Priority}=SysBroadcast}, 
	    #state{fix_list=FixList, 
		   timer_list=TimerList
		   }=State) ->
    %%data_helper:format("time to send ~p~n", [Content]),
    %% ɾ����Ӧ��ʱ��
    NewTimerList = lists:keydelete(ID, 1, TimerList),

    ShowSeconds = 0,
    SendType = case Type of
		   ?sbt_per_day -> ?sbt_at_time; %% ÿ�칫����ʵ���Ƕ��㹫��
		   _ -> Type
	       end,
    send(ID, SendType, Content, PlayTimes, Priority, ShowSeconds, StartTime),
    %% ����ǹ̶�������Ҫ�ŵ��б���
    case Type of
	?sbt_sys_show ->
	    NewFixList = [SysBroadcast | FixList],
	    {noreply, State#state{timer_list=NewTimerList, fix_list=NewFixList}};
	?sbt_farm ->
	    NewFixList = [SysBroadcast | FixList],
	    {noreply, State#state{timer_list=NewTimerList, fix_list=NewFixList}};
	?sbt_per_day ->
	    TimerRef = next_every_day_timer(SysBroadcast, get_one_day_seconds()),
	    
	    TimerList2 = [{ID, TimerRef} | NewTimerList],
	    {noreply, State#state{timer_list=TimerList2}};
	_ ->
	    {noreply, State#state{timer_list=NewTimerList}}
    end;

handle_info(_Info, State) ->
    {noreply, State}.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% This function is called by a gen_server when it is about to
%% terminate. It should be the opposite of Module:init/1 and do any
%% necessary cleaning up. When it returns, the gen_server terminates
%% with Reason. The return value is ignored.
%%
%% @spec terminate(Reason, State) -> void()
%% @end
%%--------------------------------------------------------------------
terminate(_Reason, State) ->
    clear_timers(State),
    ok.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Convert process state when code is changed
%%
%% @spec code_change(OldVsn, State, Extra) -> {ok, NewState}
%% @end
%%--------------------------------------------------------------------
code_change(_OldVsn, State, _Extra) ->
    {ok, State}.

%%%===================================================================
%%% Internal functions
%%%===================================================================
%% ���˼�¼
%% ȡδ��ʱ���� �� ��ʱ,��������ʾ��
filter_record(#sys_broadcast{start_time=StartTime, type=Type}, 
	      Now) ->
    (Type =:= ?sbt_sys_show) or
    (Type =:= ?sbt_at_time) or
    (Type =:= ?sbt_per_day) or
    (StartTime > Now).


%% ȡ�ù����б�
get_broadcast_list(Now) ->
    Q = qlc:q([E || E <- db:table(sys_broadcast), filter_record(E, Now)]),
    PrepareList = do_qlc(Q),
    PrepareList.

do_qlc(Q) ->
    F = fun() ->
		qlc:e(Q)
	end,    
    db:transaction(F).
    

%% �����ݿ����
%% ����NewState
load_from_db(State) ->   
    clear_timers(State),

    Now = datetime:local_time(),
    BroadcastList = get_broadcast_list(Now),
    
    %% ����ÿ�칫��    
    FEveryDay = fun(#sys_broadcast{type=Type}) -> Type =:= ?sbt_per_day end,
    {EveryDayList, OtherList} = lists:partition(FEveryDay, BroadcastList),

    %%F = fun(#sys_broadcast{start_time=StartTime}) -> StartTime > Now end,
    %% ����̶�����
    %%{PrepareList, FixList} = lists:partition(F, OtherList),
    FixList=OtherList,
    PrepareList=[],
    %%data_helper:format("FixList: ~p~n", [FixList]),
			 
    TimerList = 
	[begin 
	     #sys_broadcast{id=ID, start_time=StartTime} = X,
	     %% ����������Ӧ���͹���
	     Seconds = datetime:diff_time(Now, StartTime),
	     
	     %% ������ʱ��
	     {ok, TimerRef} = timer:send_after(Seconds * 1000, {time_to_send, X}),
	     %%data_helper:format("start a timer: ~p~n~p~n", [Seconds, X]),
	     {ID, TimerRef}	 
	 end  || X <- PrepareList],

	
    TimerEveryDay = 
	[begin 
	     #sys_broadcast{id=ID} = X,
	     
	     TimerRef = start_every_day_timer(X),
	     {ID, TimerRef}	 
	 end  || X <- EveryDayList],
    

    State#state{timer_list=(TimerList ++ TimerEveryDay), fix_list=FixList}.

%% �����ʱ��    
clear_timers(#state{timer_list=TimerList}) ->
    %% ȡ��δִ�еĶ�ʱ��
    [timer:cancel(TimerRef) || {_ID, TimerRef} <- TimerList],
    ok.

get_time(#stime{hour=H, minute=Min, second=S})->
    {H, Min, S};
get_time({_Date, Time})->
    Time.

get_seconds({Hour, Minute, Seconds}) ->
     Hour * 60 * 60 + Minute * 60 + Seconds.

get_one_day_seconds() ->
    %% 24 * 60 * 60.
    common_def:get_val(seconds_of_a_day).

start_every_day_timer(SysBroadCast) ->
    ADaySeconds = 24 * 60 * 60,
    #sys_broadcast{start_time=StartTime} = SysBroadCast,

    %% ����������Ӧ���͹���	     
    Diff = get_seconds(get_time(StartTime)) - get_seconds(datetime:time()),
    Seconds = 
	case Diff > 0 of
	    true -> Diff;
	    _ -> Diff + ADaySeconds
	end,
    
    %% ������ʱ��
    {ok, TimerRef} = timer:send_after(Seconds * 1000, {time_to_send, SysBroadCast}),
    TimerRef.

next_every_day_timer(SysBroadCast, ADaySeconds) ->
    Seconds = ADaySeconds,
    %% ������ʱ��
    {ok, TimerRef} = timer:send_after(Seconds * 1000, {time_to_send, SysBroadCast}),
    TimerRef.

