%%%-------------------------------------------------------------------
%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%
%%% @end
%%% Created : 28 Aug 2012 by hongjx <hongjx@35info.cn>
%%%-------------------------------------------------------------------
-module(global_database).

-behaviour(gen_server).

%% API
-export([start_link/1]).

%% gen_server callbacks
-export([init/1, handle_call/3, handle_cast/2, handle_info/2,
	 terminate/2, code_change/3]).

-export([start/1]).

-define(GLOBAL_SERVER, {global, ?MODULE}). 


-record(state, {status=init}).


%%%===================================================================
%%% API
%%%===================================================================
start(BackupDB) ->
    start_link(BackupDB),
    %% 不管成功与否，都要等待数据升级完成
    case block_until_db_start() of
	ok ->
	    ok;
	_ ->
	    timer:sleep(1000),
	    block_until_db_start()
    end.


%%--------------------------------------------------------------------
%% @doc
%% Starts the server
%%
%% @spec start_link() -> {ok, Pid} | ignore | {error, Error}
%% @end
%%--------------------------------------------------------------------
start_link(BackupDB) ->
    gen_server:start_link(?GLOBAL_SERVER, ?MODULE, [BackupDB], []).

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
init([BackupDB]) ->
    start_db(BackupDB),
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
handle_call({block_until_db_start}, _From, #state{status=S}=State) ->
    Reply = case S of
		init -> %% 正在初始化
		    {error, initing};
		_ ->
		    ok
	    end,
    {reply, Reply, State};
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
handle_cast({start_db, BackupDB}, State) ->
    %% 关备份节点
    rpc:call(BackupDB, mnesia, stop, []),
    %% 启动升级程序
    database:start(BackupDB),
    {noreply, State#state{status=db_has_start}};
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
start_db(BackupDB) ->
    gen_server:cast(?GLOBAL_SERVER, {start_db, BackupDB}).

block_until_db_start() ->
    gen_server:call(?GLOBAL_SERVER, {block_until_db_start}, infinity).
