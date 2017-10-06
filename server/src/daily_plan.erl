%%%-------------------------------------------------------------------
%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%
%%% @end
%%% Created : 30 May 2012 by hongjx <hongjx@35info.cn>
%%%-------------------------------------------------------------------
-module(daily_plan).

-behaviour(gen_server).

%% API
-export([start_link/0]).

%% gen_server callbacks
-export([init/1, handle_call/3, handle_cast/2, handle_info/2,
	 terminate/2, code_change/3]).

-define(SERVER, ?MODULE). 

-record(state, {}).


-export([run_at/2]).

%%%===================================================================
%%% API
%%%===================================================================
%% 在每天某个时间点 运行F函数
run_at({_H, _M, _S}=Time, F) ->
    gen_server:cast(?SERVER, {Time, F}).


%%--------------------------------------------------------------------
%% @doc
%% Starts the server
%%
%% @spec start_link() -> {ok, Pid} | ignore | {error, Error}
%% @end
%%--------------------------------------------------------------------
start_link() ->
    gen_server:start_link({local, ?SERVER}, ?MODULE, [], []).

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
    %% 更新照片交友数据
    %%photos_make_friend:update_photo_player_table(),

    %% 有什么计划，直接写在这边就可以了
    %% %% 4点 生成等级报告
    %% do_run_at({04, 30, 00}, fun()-> level_report:run() end),
    %% %% 4点30分 更新照片交友数据 
    %% do_run_at({05, 00, 00}, fun()-> photos_make_friend:update_photo_player_table() end),
    {ok, #state{}}.

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
handle_info({daily_plan, Time, F},
	    State) ->   
    F(),
    do_run_at(Time, F),
    {noreply, State#state{}};

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
terminate(_Reason, _State) ->
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
%% 按排几点几分运行任务
do_run_at(Time, F) ->
    ADaySeconds = 24 * 60 * 60,

    %% 算出多少秒后应发送公告	     
    Diff = get_seconds(Time) - get_seconds(datetime:time()),
    Seconds = 
	case Diff > 0 of
	    true -> Diff;
	    _ -> Diff + ADaySeconds
	end,
    
    %% 启动定时器
    {ok, TimerRef} = timer:send_after(Seconds * 1000, {daily_plan, Time, F}),
    TimerRef.


get_seconds({Hour, Minute, Seconds}) ->
     Hour * 60 * 60 + Minute * 60 + Seconds.

