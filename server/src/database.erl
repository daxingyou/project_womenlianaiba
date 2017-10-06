%% Author: NoteBook
%% Created: 2009-9-10
%% Description: Add description to database
-module(database).

-behaviour(application).

-behaviour(gen_server).

%% API
-export([start_link/0]).

%% gen_server callbacks
-export([init/1, handle_call/3, handle_cast/2, handle_info/2,
	 terminate/2, code_change/3]).
%% Application callbacks
-export([start/2, stop/1]).
-export([start/1, stop/0, 
	 listen/0]).

-export([backup/1,         %% ����
	 restore/1,        %% ��ԭ
	 show_backup/1, 
	 copy_from/1]).

-export([add_db_node/1,    %% �������ݿ�ڵ�
	 add_table_frag/2, %% ��ĳ���ڵ���, ���ӱ�Ƭ��
	 auto_add_copies/0,  %% �Զ�Ϊ���б����Ӹ���, �����������
	 auto_add_copies/1  %% ��ָ���ڵ��ϣ�Ϊ���б����Ӹ��� 
	]).

-define(SERVER, ?MODULE). 

-record(state, {}).


%%
%% Include files
%%
%%-include("table_info.hrl").


%%%===================================================================
%%% API
%%%===================================================================
auto_add_copies(Node) ->
    Nodes = [Node],
    [auto_add_table_copy(T, Nodes) || T <- mnesia:system_info(tables), T =/= schema].

%% �Զ�׷�Ӹ�����Ϊÿ���������1������
auto_add_copies() ->
    DiscNodes = mnesia:table_info(schema, disc_copies),    
    RuningNodes = mnesia:system_info(running_db_nodes),
    Nodes = [X || X <- DiscNodes, lists:member(X, RuningNodes)],
    
    [auto_add_table_copy(T, Nodes) || T <- mnesia:system_info(tables), T =/= schema].

auto_add_table_copy(T, Nodes) when is_atom(T), is_list(Nodes) ->
    A = get_table_info(T, ram_copies),
    B = get_table_info(T, disc_copies),
    C = get_table_info(T, disc_only_copies),
    D = A ++ B ++ C,
    case length(D) >= 2 of
	true -> %% �Ѿ������������ˣ�ֱ������
	    ok;
	_ ->
	    case Nodes -- D of
		[] -> %% û�ڵ�ɷ����¸���������
		    ok;
		[ND | _] ->
		    do_add_table_copy(T, ND, A, B, C)
	    end
    end.

do_add_table_copy(T, Node, RamList, DiscList, DiscOnlyList) when is_atom(T),
							       is_atom(Node),
							       is_list(RamList),
							       is_list(DiscList),
							       is_list(DiscOnlyList)  ->
    case length(RamList) > 0 of
	true -> mnesia:add_table_copy(T, Node, ram_copies);
	_ -> ok
    end,

    case length(DiscList) > 0 of
	true -> mnesia:add_table_copy(T, Node, disc_copies);
	_ -> ok
    end,

    case length(DiscOnlyList) > 0 of
	true -> mnesia:add_table_copy(T, Node, disc_only_copies);
	_ -> ok
    end,
    ok.


%% �����·�Ƭ
add_table_frag(Tab, DBNode) when is_atom(Tab), is_atom(DBNode) ->
    mnesia:change_table_frag(Tab, {add_frag, [DBNode]}).


%% �����½ڵ�
add_db_node(NewNode) when is_atom(NewNode) ->
    %% �жϽڵ��Ƿ��Ѵ���
    DiscNodes = mnesia:table_info(schema, disc_copies),

    case lists:member(NewNode, DiscNodes) of
	true -> ok;
	false -> do_add_db_node(NewNode)
    end.

%% ����
backup(BackupFile) ->
    mnesia:backup(BackupFile).

%% ��ԭ(���ݿ�ı�����һ��, ������Ƭ��)
restore(BackupFile) ->
    A = mnesia:system_info(tables),
    B = get_backup_tables(BackupFile),
    %% ȷ��Table��һ��
    Diff = (A -- B) ++ (B -- A),
    case Diff of
	[] ->
	    mnesia:restore(BackupFile, []),
	    data_helper:format("restore success, please restart server.~n");	    
	_ ->
	    data_helper:format("restore fail, tables not find: ~p~n",[Diff])	    
    end.

copy_from(SourceDBNode) ->
    case SourceDBNode =:= node() of
	true ->	data_helper:format("copy self.~n");
	_ -> do_copy_from(SourceDBNode)
    end.
	    
do_copy_from(SourceDBNode) when is_atom(SourceDBNode) ->    
    SrcFile = "src_for_copy_db.bup",
    DestFile = "dest_for_copy_db.bup",
    %% ����
    ok = rpc:call(SourceDBNode, database, backup, [SrcFile]),
    %% ���ر����ļ�
    {ok, BinStream} = rpc:call(SourceDBNode, file, read_file, [SrcFile]),
    ok = file:write_file(DestFile, BinStream),
    database:restore(DestFile).

show_backup(BackupFile) when is_list(BackupFile) -> 
    FShow =
        fun({schema, _Tab, _Options}=Item, Acc) ->
		data_helper:format("~p~n",[Item]),
		{[Item], Acc};
           (Other, Acc) ->
                {[Other], Acc}
        end,
    Mod = mnesia_backup,
    mnesia:traverse_backup(BackupFile, Mod, dummy, read_only, FShow, 0).

%%%===================================================================
%%% Application callbacks
%%%===================================================================
start(BackupDB) ->
    ok = start_db(BackupDB).

%% %% �رձ��ݽڵ�(���ݽڵ㳤�ڿ��Ż�������ֻ���bug)
%% close_backup_db(BackupDB) ->
%%     %% ��û��������ʱ�򣬹رձ��ݽڵ�
%%     case rpc:call(BackupDB, erlang, nodes, []) of
%% 	[_MyNode] -> %% û���������
%% 	    rpc:call(BackupDB, mnesia, stop, []),
%% 	    io:format("close backup db.~n");
%% 	L when is_list(L) -> %% �����������, ���ܹ�
%% 	    io:format("some server(~p) has connect backup db.~n", [L]);
%% 	_BadRpc -> %% ���ݽڵ�û��, ����
%% 	    ok
%% 	    %%io:format("backup db not alive.~n")
%%     end.

stop() ->
    close_db().

listen() ->
    gen_server:cast(?SERVER, listen).

%%--------------------------------------------------------------------
%% @private
%% @doc
%% This function is called whenever an application is started using
%% application:start/[1,2], and should start the processes of the
%% application. If the application is structured according to the OTP
%% design principles as a supervision tree, this means starting the
%% top supervisor of the tree.
%%
%% @spec start(StartType, StartArgs) -> {ok, Pid} |
%%                                      {ok, Pid, State} |
%%                                      {error, Reason}
%%      StartType = normal | {takeover, Node} | {failover, Node}
%%      StartArgs = term()
%% @end
%%--------------------------------------------------------------------
start(_StartType, _StartArgs) ->
    case start_link() of
	{ok, Pid} ->
	    listen(),
	    {ok, Pid};
	Error ->
	    Error
		end.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% This function is called whenever an application has stopped. It
%% is intended to be the opposite of Module:start/2 and should do
%% any necessary cleaning up. The return value is ignored.
%%
%% @spec stop(State) -> void()
%% @end
%%--------------------------------------------------------------------
stop(_State) ->
    ok.


%%--------------------------------------------------------------------
%% @doc
%% Starts the server
%%
%% @spec start_link() -> {ok, Pid} | ignore | {error, Error}
%% @end
%%--------------------------------------------------------------------
start_link() ->
    Ret = gen_server:start_link({local, ?SERVER}, ?MODULE, [], []),
    Ret.

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
handle_cast(listen, State) ->
    mnesia:subscribe(system),
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
handle_info({mnesia_system_event, {mnesia_down, Node}}, State) ->
    %%data_helper:format("~n mnesia down: ~w~n", [Node]),
    %% ����нڵ�ͣ����(�����̽ڵ�)���ر��������ݿ�
    DiscNodes = mnesia:table_info(schema, disc_copies),    
    case lists:member(Node, DiscNodes) of
	true -> 
	    mnesia:unsubscribe(system),
	    close_db(),
	    {stop, shutdown, State};	
	false -> 
	    {noreply, State}	    
    end;    
handle_info(_Info, State) ->
    %%data_helper:format("~n handle info: ~w~n", [Info]),
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







%% %%
%% %% 初始化内存表
%% %%
%% init_memory_table() ->
%%     DiscNodes = [node() | nodes()],
%%     init_scene_frag_table(DiscNodes),
%%     init_online_player_frag_table(DiscNodes),
%%     mnesia:wait_for_tables([scene, online_player], 20000).

%% %%
%% %% 初始化内存分片表结构
%% %%
%% init_scene_frag_table(Nodes) ->
%% 	FragProps = [{node_pool, Nodes}, {n_fragments, 1}],
%% 	mnesia:create_table(scene, [{frag_properties, FragProps}, {attributes, record_info(fields, scene)}]).

%% init_online_player_frag_table(Nodes) ->
%%     FragProps = [{node_pool, Nodes}, {n_fragments, 1}],
%%     mnesia:create_table(online_player, [{frag_properties, FragProps}, {attributes, record_info(fields, online_player)}]).


%%
%% Local Functions
%%
do_add_db_node(NewNode) ->
    %% ����Զ�̽ڵ�
    ok = rpc:call(NewNode, mnesia, start, []),
    N = node(),
    %% ��Զ�̽ڵ���� ��ǰ���ݿ�
    {ok, [N]} = rpc:call(NewNode, mnesia, change_config, [extra_db_nodes, [N]]),
    {atomic, ok} = rpc:call(NewNode, mnesia, change_table_copy_type, [schema, NewNode, disc_copies]),

    %% %% ȡ�����б��
    %% TabList = mnesia:system_info(tables),

    %% %% ��ԭ�з�Ƭ�����Ե�table, ��NewNode ���� node_pool��, �Զ���һ����Ƭ��ȥ
    %% [begin 
    %% 	 mnesia:change_table_frag(Tab, {add_node, NewNode}),
    %% 	 mnesia:change_table_frag(Tab, {add_frag, [NewNode]})             	 
    %%  end
    %%  ||	Tab <- TabList, mnesia:table_info(Tab, frag_properties) =/= []],
	    
    ok.

start_db(BackupDB) when is_atom(BackupDB) ->
    case mnesia:system_info(is_running) of
	no ->
	    Nodes = [node()],
	    case mnesia:create_schema(Nodes) of
		ok ->
		    start_db_1(BackupDB);
		{error,{_,{already_exists,_}}}->
		    start_db_1(BackupDB);
		{error,{_,{Reason,_}}} ->
		    data_helper:format("init schema error:~p~n", [Reason]),
		    fail
	    end;
	yes ->
	    ok
    end,
    ok.


%% �ر����ݿ�
close_db() ->
    %% �ر�������ؽڵ�
    DBNodes = mnesia:system_info(db_nodes),
    {_Ret, _BadNodes} = rpc:multicall(DBNodes, mnesia, stop, []),
    ok.

start_db_1(BackupDB) ->
    %% ����������ؽڵ�
    DBNodes = mnesia:system_info(db_nodes),
    {_Ret, BadNodes} = rpc:multicall(DBNodes, mnesia, start, []),
    
    %% ȷ���ڵ��Ƿ�����������(���̽ڵ����)
    DiscNodes = mnesia:table_info(schema, disc_copies),
    [logger:log(warn, "some database node not start:~p~n", [ND]) 
     || ND <- BadNodes, lists:member(ND, DiscNodes)],

    db_update:start(DiscNodes),
    %% ���ݽڵ㴦��
    io:format("BackupDB: ~p~n", [BackupDB]),
    case BackupDB of
	undefined -> %% δ���屸�ݽڵ�
	    ok;
	_ ->
	    case lists:member(BackupDB, DiscNodes) of
		false -> %% ���ݽڵ���Ҫ�ӵ���Ⱥ��
		    case net_adm:ping(BackupDB) of
			pong ->
			    add_db_node(BackupDB);
			_ ->
			    io:format("warning:~p not start~n", [BackupDB])
		    end;
		_ ->
		    ok
	    end,

	    auto_add_copies(BackupDB)
    end,

    ok.


get_backup_tables(BackupFile) when is_list(BackupFile) -> 
    F =
        fun({schema, Tab, _Options}=Item, Acc) ->
		{[Item], [Tab | Acc]};
           (Other, Acc) ->
                {[Other], Acc}
        end,
    Mod = mnesia_backup,
    {ok, TableList} = mnesia:traverse_backup(BackupFile, Mod, dummy, read_only, F, []),
    TableList.


get_table_info(Tab, Info) ->
    do_tran(fun mnesia:table_info/2, [Tab, Info]).
%% ������
do_tran(Fun, Args) when is_list(Args) ->
    mnesia:activity(transaction, Fun, Args, mnesia_frag).
