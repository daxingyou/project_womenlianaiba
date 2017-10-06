%%% @author  <hjx>
%%% @copyright (C) 2010, 
%%% @doc
%%%   被踢处理
%%$      
%%% @end
%%% Created : 17 Jun 2010 by  <hjx>

-module(player_be_kick).
-behaviour(gen_action).


-include("packet_def.hrl").
-include("mutex_actions.hrl").
-include("router.hrl").
-include("enum_def.hrl").
-include("sys_msg.hrl").
-include("common_def.hrl").


-export([handle_call/3, handle_cast/2, start/1]).
-export([do_start_action/2, do_stop_action/2]).


start(Account) ->
    [
     router:make_event_target(you_kick_me, Account, {Account, ?MODULE}),
     router:make_event_source(be_kick, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_kick_guest, Account, {Account, ?MODULE})
    ].


%%%===================================================================
%%% 动作相关回调函数
%%%===================================================================

%% 开始动作
%% 返回NewState || {false, Error} || {false, Error, Params} 
do_start_action({MasterScene, Reason}, State) 
  when is_atom(MasterScene) -> 
    MyScene = player_data:get_scene_name(State),
    case MasterScene of
	'' ->
	    %% 直接清空场景名, 不需要通知玩家离开
	    do_start_action_1(Reason, State);	    
	MyScene ->
	    do_start_action_1(Reason, State);		   
	_ -> 	    
	    {false, ?err_no_error} %% 不在同一场景，不能踢人
    end.

do_start_action_1(Reason, State) ->
    Guest = player_data:get_account(State),
    
    %% 客人回到自已家
    NewState = player_change_scene:enter_self_home(State),
    case Reason of
	undefined ->
	    ok;
	_ ->
	    %% 通知被踢原因
	    sys_msg:send(Guest, Reason)
    end,
    
    NewState.
    

%% 结束动作
%% 自动结束时，Param 格式为 {auto_stop, Reason}, 其它情况为call_stop_action传入的Param
%% 自动结束发生时机: 当前动作被新动作停止时，或退出游戏时
do_stop_action(_Param, State) ->
    State.



%%%===================================================================
%%% 处理handle_call
%%%===================================================================
%% 正常踢人的被踢处理(有处理离开场景)
handle_call({#msg{event=you_kick_me}, Param}, _From, 
	    MyState) ->

    MyNewState = mutex_actions:try_start_action(?action_type_be_kick, Param, MyState),

    {reply, ok, MyNewState}.


%%%===================================================================
%%% 处理handle_cast
%%%===================================================================
%% 其它被踢处理
handle_cast({#msg{event=be_kick}, KickReason},  
	    State) ->
    %% 直接清空场景名, 不需要通知玩家离开
    State0 = player_data:set_scene_name('', State),
    NewState = mutex_actions:try_start_action(?action_type_be_kick, {'', KickReason}, State0),
    {noreply, NewState};

%% 处理踢玩家
handle_cast({_Msg, #req_kick_guest{target_player=TargetAccount}},
	    State) ->
    Account = player_data:get_account(State),
    [PlayerBasicData] = db:dirty_read(player_basic_data, Account),
    Guest = list_to_atom(TargetAccount),

    AtHome = player_data:is_at_home(State, PlayerBasicData),
    Scene = player_data:get_scene_name(State),

    case AtHome of
	false -> %% 不在家, 不能踢人
	    sys_msg:send(Account, ?err_only_at_home_can_kick_guest);
	true ->
	    case router:send(Guest, you_kick_me, {Scene, undefined}) of
		undefined -> %%对方不在线
		    sys_msg:send(Account, ?err_player_offline);
		_ -> 
		    MyHouseID = player_basic_data:get_house_id(PlayerBasicData),
		    %% 保存被踢记录，10分钟不能再来
		    db_kick_info:save(MyHouseID, Guest),

		    %% 各种提示
		    sys_msg:send(Account, ?msg_you_kick_someone, ["@" ++ TargetAccount]),
		    sys_msg:send(Guest, ?msg_someone_kick_you, ["@" ++ atom_to_list(Account)]),

		    Packet = #notify_sys_msg{code=?msg_someone_be_kick, 
		    			     params=["@" ++ TargetAccount,
						     "@" ++ atom_to_list(Account)] 
		    				     },
		    router:cast(undefined, Scene, broadcast_other_players, 
		    		{Account, Packet}),		    
		    ok
	    end
    end,

    {noreply, State}.


%%%===================================================================
%%% 内部函数
%%%===================================================================





