%%% -------------------------------------------------------------------
%%% Author  : NoteBook
%%% Description :
%%%     负责创建和删除场景
%%% Created : 2009-10-27
%%% -------------------------------------------------------------------
-module(scene_manager).
-define(SERVER, ?MODULE).

-behaviour(gen_msgproc).

-export([start_link/0, get_all_scene/0, register/1, 
	 recreate_common_scene/0, fetch_scene_copy_id/1]).

%% gen_server callbacks
-export([init/1, handle_call/3, handle_cast/2, handle_info/2, terminate/2, code_change/3]).

-include("tplt_def.hrl").
-include("table_info.hrl").
-include("router.hrl").

-record(state, {}).

register([]) ->
    [router:make_event_target(create_house, ?SERVER, {self(), ?MODULE}),
     router:make_event_target(active_pub_scene, ?SERVER, {self(), ?MODULE})
    ].

%% ====================================================================
%% API
%% ====================================================================
%% 启动场景管理器
start_link() ->  
    data_helper:format("start scene manager~n"),
    gen_msgproc:start_link({local, ?SERVER}, ?MODULE, [], []).

recreate_common_scene() ->
    mnesia:clear_table(scene_copies),
    AList = extract_common_scene_list(tplt:get_all_data(common_scene)),
    create_common_scene_list(AList).


%% 获取所有公共场景
get_all_scene() ->
    gen_server:call(?SERVER, get_all_scene).
%% ====================================================================
%% Function: init/1
%% Description: Initiates the server
%% Returns: {ok, State}          |
%%          {ok, State, Timeout} |
%%          ignore               |
%%          {stop, Reason}
%% ====================================================================
init([]) ->    
    AList = extract_common_scene_list(tplt:get_all_data(common_scene)),
    create_common_scene_list(AList),
    {ok, #state{}}.

%% ====================================================================
%% Function: handle_call/3
%% Description: Handling call messages
%% Returns: {reply, Reply, State}          |
%%          {reply, Reply, State, Timeout} |
%%          {noreply, State}               |
%%          {noreply, State, Timeout}      |
%%          {stop, Reason, Reply, State}   | (terminate/2 is called)
%%          {stop, Reason, State}            (terminate/2 is called)
%% ====================================================================
%% 创建玩家房屋场景(家园)
handle_call({#msg{event=create_house}, {HouseData}}, _From, State) ->
    HouseInstID = house:get_house_id(HouseData),
    HouseName = house:get_house_name(HouseInstID),
    case util:is_process_alive(HouseName) of
	false ->
	    PlayerHouseMod = house,
	    M = gen_scene,
	    F = start,
	    A = [HouseName, PlayerHouseMod, [HouseName, HouseData]],
	    ChildSpec = {HouseName, {M, F, A},
			 temporary, 2000, worker, [gen_scene]},
	    supervisor:start_child(scene_sup, ChildSpec);
	_ ->
	    ok
    end,
    {reply, HouseName, State};
%% 创建玩家房屋场景(家园)
handle_call({#msg{event=active_pub_scene}, {PubID}}, _From, State) ->
    Account = pub:get_owner(PubID),
    SceneName = pub_scene:build_name(Account, PubID),

    case util:is_process_alive(SceneName) of
	false ->
	    CustomMod = pub_scene,
	    M = gen_scene,
	    F = start,
	    A = [SceneName, CustomMod, [Account, PubID]],
	    ChildSpec = {SceneName, {M, F, A},
			 temporary, 2000, worker, [gen_scene]},
	    supervisor:start_child(scene_sup, ChildSpec);
	_ ->
	    ok
    end,
    {reply, SceneName, State};
handle_call(get_all_scene, _From, State) ->
    Scenes = scene_db:select_all(),
    {reply, Scenes, State};
handle_call(_Request, _From, State) ->
    Reply = ok,
    {reply, Reply, State}.

%% ====================================================================
%% Function: handle_cast/2
%% Description: Handling cast messages
%% Returns: {noreply, State}          |
%%          {noreply, State, Timeout} |
%%          {stop, Reason, State}            (terminate/2 is called)
%% ====================================================================
handle_cast(_Msg, State) ->
    {noreply, State}.

%% ====================================================================
%% Function: handle_info/2
%% Description: Handling all non call/cast messages
%% Returns: {noreply, State}          |
%%          {noreply, State, Timeout} |
%%          {stop, Reason, State}            (terminate/2 is called)
%% ====================================================================
handle_info(_Info, State) ->
    {noreply, State}.

%% ====================================================================
%% Function: terminate/2
%% Description: Shutdown the server
%% Returns: any (ignored by gen_server)
%% ====================================================================
terminate(_Reason, _State) ->
    ok.

%% ====================================================================
%% Func: code_change/3
%% Purpose: Convert process state when code is changed
%% Returns: {ok, NewState}
%% ====================================================================
code_change(_OldVsn, State, _Extra) ->
    {ok, State}.

%% ====================================================================
%%% Internal functions
%% ====================================================================

-spec create_common_scene_list(list()) -> any().
create_common_scene_list(SceneList) when is_list(SceneList) ->
    F = fun({SceneID, CopyCount}) -> 
		mark_bad_scene(SceneID),
		[begin 
		     CopyID = fetch_scene_copy_id(SceneID),
		     create_common_scene(SceneID, CopyID) 
		 end || _X <- lists:seq(1, CopyCount)]
	end,
    lists:foreach(F, SceneList).

%% 标识故障场景
mark_bad_scene(SceneTpltID) ->
    Tab = scene_copies,
    case db:dirty_read(Tab, SceneTpltID) of
	[{Tab, SceneTpltID, Array}] ->
	    F = fun(Idx, Val, Acc) ->
			case scene_is_alive(SceneTpltID, Val) of
			    false ->
				array:set(Idx, -1, Acc);
			    _ ->
				array:set(Idx, Val, Acc)				
			end
		end,
	    NewArray = array:foldl(F, Array, Array),
	    
	    db:dirty_write({Tab, SceneTpltID, NewArray});
	_ ->
	    ok
    end.

%% 提取公共场景列表, 每个列表元素为integer
-spec extract_common_scene_list(list()) -> any().
extract_common_scene_list(DataList) when is_list(DataList) ->
    [{ID, CopyCount} || #common_scene{id=ID, copy_count=CopyCount} <- DataList].
    
%% 创建公共场景
create_common_scene(SceneTpltID, CopyID) -> 
    common_scene_sup:start(SceneTpltID),
    common_scene_sup:start_children(SceneTpltID, CopyID).

%% 取得一个序列号
fetch_scene_copy_id(SceneTpltID) ->
    Tab = scene_copies,
    F = fun() ->
		{NewR, NewSize} = 
		    case db:read(Tab, SceneTpltID) of
			[{Tab, SceneTpltID, Array}] ->
			    N = array:size(Array),
			    L = array:to_list(Array),
			    L2 = lists:takewhile(fun(X) -> X =/= -1 end, L),
			    case length(L2) of
				N ->
				    NewArray = array:set(N, 0, Array),
				    {{Tab, SceneTpltID, NewArray}, N};
				Idx ->
				    Array0 = array:set(Idx, 0, Array),
				    {{Tab, SceneTpltID, Array0}, Idx}
			    end;
			_ ->
			    Array = array:new([{default, -1}]),
			    NewArray = array:set(0, 0, Array),			    
			    {{Tab, SceneTpltID, NewArray}, 0}
		    end,

		db:write(NewR),

		{ok, NewSize}		 
	end,    
    
    {ok, CopyID} = db:transaction(F),
    CopyID.


scene_is_alive(SceneTpltID, CopyID) ->
    SceneName = common_scene:id_to_scene(SceneTpltID, CopyID),
    util:is_process_alive(SceneName).





