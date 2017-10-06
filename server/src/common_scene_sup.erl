%%%-------------------------------------------------------------------
%%% @author  <>
%%% @copyright (C) 2010, 
%%% @doc
%%%
%%% @end
%%% Created : 14 May 2010 by  <>
%%%-------------------------------------------------------------------
-module(common_scene_sup).

-behaviour(supervisor).

%% API
-export([start/1, start_children/2, get_sup_name/1]).
-export([start_link/1]).

%% Supervisor callbacks
-export([init/1]).

-define(SERVER, ?MODULE).

%%%===================================================================
%%% API functions
%%%===================================================================
%% 启动监控树
%% 每个场景一个监控树
-spec start(integer()) -> any().
start(SceneId) when is_integer(SceneId) ->
    SceneSupName = get_sup_name(SceneId),
    ChildSpec = {SceneSupName
     		 , {?MODULE, start_link, [SceneSupName]},
     		 temporary, infinity, supervisor, []
     		},
    supervisor:start_child(scene_sup, ChildSpec).

%% 挂载场景到监控树上

start_children(SceneId, CopyID) when is_integer(SceneId) ->
    SceneSupName = get_sup_name(SceneId),
    SceneName = common_scene:id_to_scene(SceneId, CopyID),
    ChildSpec = {SceneName, 
		 {gen_scene, start, [SceneName, common_scene, [SceneId, CopyID, SceneName]]},
     		 temporary, 2000, worker, []
     		},
    supervisor:start_child(SceneSupName, ChildSpec).

%% 获取监控树名称
-spec get_sup_name(integer()) -> any().
get_sup_name(SceneId) when is_integer(SceneId) ->
    list_to_atom(atom_to_list(common_scene:id_to_scene(SceneId)) ++ "_sup").

%%--------------------------------------------------------------------
%% @doc
%% Starts the supervisor
%%
%% @spec start_link() -> {ok, Pid} | ignore | {error, Error}
%% @end
%%--------------------------------------------------------------------
start_link(SceneSupName) ->
    supervisor:start_link({local, SceneSupName}, ?MODULE, []).

%%%===================================================================
%%% Supervisor callbacks
%%%===================================================================

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Whenever a supervisor is started using supervisor:start_link/[2,3],
%% this function is called by the new process to find out about
%% restart strategy, maximum restart frequency and child
%% specifications.
%%
%% @spec init(Args) -> {ok, {SupFlags, [ChildSpec]}} |
%%                     ignore |
%%                     {error, Reason}
%% @end
%%--------------------------------------------------------------------
init([]) ->
    process_flag(trap_exit, true),
    {ok,{{one_for_one, 1, 60}, []}}.

%%%===================================================================
%%% Internal functions
%%%===================================================================

