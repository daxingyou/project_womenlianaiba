%% 公共场景
%%
-module(common_scene).  
-behaviour(gen_scene).

-include("gen_scene.hrl").
-include("sys_msg.hrl").
-include("tplt_def.hrl").
-include("router.hrl").

-export([init/1, register/1, handle_call/3, handle_cast/2, terminate/2,
	 try_enter_scene/2, 
	 is_editing/1,
	 on_leave_scene/2]).  


-export([id_to_scene/1, id_to_scene/2, get_copy_state_list/1]).
-export([fetch_free_copy_id/1, sync_player_count/3]).
-record(common_scene_data, {scene_id,            % 场景id    
			    copy_id
			   }).

%%%===================================================================
%%% API
%%%===================================================================
-spec id_to_scene(integer()) -> atom().
id_to_scene(ID) when is_integer(ID) ->
    list_to_atom("common_scene_" ++ integer_to_list(ID)).

id_to_scene(ID, CopyID) when is_integer(ID) ->
    list_to_atom(atom_to_list(common_scene:id_to_scene(ID)) ++ "_" ++ integer_to_list(CopyID)).


is_editing(_) ->
    false.
 
   
register([_SceneID, _CopyID, _SceneName]) ->
    [].

init([SceneID, CopyID, SceneName]) when is_integer(SceneID), is_atom(SceneName) -> 
    scene_db:insert(SceneName),
    {ok, #common_scene_data{scene_id=SceneID, copy_id=CopyID}}.


%% 判断可否进入场景
try_enter_scene({Account, EnterPos}, #scene_data{custom_data=CustomData}=State) 
  when is_atom(Account) ->
    Pos = 
	case EnterPos of
	    born_pos ->
		get_born_pos(CustomData);
	    _ ->
		EnterPos
	end,    

    #common_scene_data{scene_id=SceneID, copy_id=CopyID} = CustomData,
    net_helper:send2client(Account, 
			   #notify_enter_common_scene{template_id=SceneID, 
						      copy_id=CopyID, enter_pos=Pos}),

    {ok, State, Pos}.

on_leave_scene(_Account, #scene_data{custom_data=CustomData}=State) ->
    #common_scene_data{scene_id=SceneID, copy_id=CopyID} = CustomData,
    PlayerCount = gen_scene:get_player_count(State),
    sync_player_count(SceneID, CopyID, PlayerCount),
    {State, no_stop}.

%% 取出生点
get_born_pos(#common_scene_data{scene_id=SceneTpltID}) ->
    case tplt:get_data(common_scene, SceneTpltID) of
	#common_scene{born_id=BornId} ->
	    BornData = tplt:get_data(born, BornId),
	    [X, Y, Z] = BornData#born.pos,
	    #point{x=X, y=Y, z=Z};
	_ ->
	    #point{}
    end.

    
%%%===================================================================
%%% Handle call
%%%===================================================================
handle_call(get_data, _from, #scene_data{custom_data=CustomData}=State) ->
    SceneId = CustomData#common_scene_data.scene_id,
    CommonSceneTplt = tplt:get_data(common_scene, SceneId),
    PlayerCount = gen_scene:get_player_count(State),
    {reply, {PlayerCount, CommonSceneTplt#common_scene.name}, State};
handle_call(_Request, _From, State) ->  
    Reply = ok,  
    {reply, Reply, State}.

%%%===================================================================
%%% Handle cast
%%%===================================================================
handle_cast(stop, State) ->
    {stop, normal, State}.


%%%===================================================================
%%% terminate
%%%===================================================================
terminate(_Reason, _State) ->
    ok.


%% 取副本状态列 (-1表示分线出故障, 0表示空闲, 1 表示拥挤 2表示爆满)
get_copy_state_list(SceneTpltID) ->
    Tab = scene_copies,
    case db:dirty_read(Tab, SceneTpltID) of
	[{Tab, SceneTpltID, Array}] ->
	    L = array:to_list(Array),
	    #common_scene{max_players=MaxPlayers} = tplt:get_data(common_scene, SceneTpltID),
	    K = MaxPlayers div 3,
	    [begin 
		 case X < 0 of
		     true -> X;
		     _ ->
			X div K 
		 end	 
	     end || X <- L]
    end.


%% 取空闲副本
fetch_free_copy_id(SceneTpltID) ->
    case tplt:get_data(common_scene, SceneTpltID) of
	#common_scene{max_players=MaxPlayers} ->
	    Tab = scene_copies,
	    case db:dirty_read(Tab, SceneTpltID) of
		[{Tab, SceneTpltID, Array}] ->
		    {Idx, _PlayerCount} = calc_free_copy(Array, MaxPlayers),
		    case Idx >= 0 of
			true -> 
			    Idx;
			_ ->
			    {false, ?err_scene_not_exists}  %% 场景不存在
		    end;
		_ ->
		    {false, ?err_scene_not_exists}  %% 场景不存在
	    end;
	_ ->
	    {false, ?err_scene_not_exists}  %% 场景不存在
    end.



%% 更新玩家数量
sync_player_count(SceneTpltID, CopyID, PlayerCount) ->
    Tab = scene_copies,
    [{Tab, SceneTpltID, Array}] =  db:dirty_read(Tab, SceneTpltID),
    case CopyID < array:size(Array) of
	true ->
	    NewArray = array:set(CopyID, PlayerCount, Array),
	    NewR = {Tab, SceneTpltID, NewArray}, 
	    db:dirty_write(NewR)
    end.


calc_free_copy(Array, MaxPlayers) when is_integer(MaxPlayers) ->
    F = fun(Idx, X, {_, N}=Acc) ->
		case (N < X) and (X < MaxPlayers) of
		    true ->			
			{Idx, X};
		    _ ->
			Acc
		end
	end,
    array:foldl(F, {-1, -1}, Array).


%%%===================================================================
%%% Internal functions
%%%===================================================================

