%%% @author  <hjx>
%%% @copyright (C) 2010, 
%%% @doc
%%%   玩家行走
%%% @end
%%% Created : 31 May 2010 by  <hjx>

-module(player_walk).


-include("packet_def.hrl").
-include("router.hrl").
-include("enum_def.hrl").
-include("player_data.hrl").
-include("mutex_actions.hrl").
-include("tplt_def.hrl").
-include("common_def.hrl").
-include("sys_msg.hrl").

-behaviour(gen_action).


-export([handle_cast/2, start/1]).
-export([do_start_action/2, do_stop_action/2]).


start(Account) ->
    [
     router:make_event_source(?msg_req_walk_for_use_furniture, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_start_walk, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_stop_walk, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_sync_position, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_sync_walk_type, Account, {Account, ?MODULE})
    ].


%%%===================================================================
%%% 动作相关回调函数
%%%===================================================================

%% 开始动作
%% 返回NewState || {false, Error} || {false, Error, Params} 
%% 玩家开始行走
do_start_action({CurrPos, DestPos, Plan}, #player_data{account=Account, scene_name=SceneName}=State) ->
    Packet = #notify_start_walk{account=Account, curr_pos=CurrPos, dest_pos=DestPos},
    net_helper:send2client(Account, Packet), 
    router:cast(undefined, SceneName, broadcast_other_players, {Account, Packet}),
    State#player_data{curr_pos=CurrPos, dest_pos=DestPos, walk_plan=Plan}.

%% 结束行走
%% 自动结束时，Param 格式为 {auto_stop, Reason}, 其它情况为call_stop_action传入的Param
%% 自动结束发生时机: 当前动作被新动作停止时，或退出游戏时
do_stop_action({auto_stop, ?action_type_walk}, #player_data{curr_pos=Pos}=State) ->
    State#player_data{curr_pos=Pos, dest_pos=Pos};
do_stop_action({auto_stop, _OtherReason}, #player_data{curr_pos=Pos}=State) ->
    do_stop_action(Pos, State);
do_stop_action(Pos, #player_data{account=Account, scene_name=SceneName}=State) ->
    Packet = #notify_stop_walk{account=Account,pos=Pos},
    net_helper:send2client(Account, Packet),
    router:cast(undefined, SceneName, broadcast_other_players, {Account, Packet}),

    State#player_data{curr_pos=Pos, dest_pos=Pos, walk_plan=[]}.
	

%%%===================================================================
%%% 处理handle_cast
%%%===================================================================

%% 收到玩家开始行走的请求
handle_cast({_Msg, #req_start_walk{curr_pos=CurrPos, dest_pos=DestPos}}, State) ->
    NewState = mutex_actions:try_start_action(?action_type_walk, {CurrPos, DestPos, []}, State),
    {noreply, NewState};

handle_cast({_Msg, #req_sync_walk_type{type=Type}}, #player_data{account=Account, 
								 scene_name=SceneName}=State) ->
    Packet = #notify_sync_walk_type{account=Account,
				    type=Type},
    router:cast(undefined, SceneName, broadcast_other_players, {Account, Packet}),
    NState = State#player_data{walk_type=Type},
    {noreply, NState};

%% 收到客户端同步位置的请求
handle_cast({_Msg,#req_sync_position{pos=Pos}},State) ->
    {noreply, State#player_data{curr_pos=Pos}};


%% 行走完后使用家具
handle_cast({_Msg, #req_walk_for_use_furniture{curr_pos=CurrPos,
					       dest_pos=DestPos, 
					       furni_temp_id=FurTempID,
					       instance_id=InstID, 
					       status=Status,
					       function_id=FunID}}, State) ->
    Account = player_data:get_account(State),
    LeavePos = DestPos,
    Param = {Account, InstID, FurTempID, FunID, LeavePos, Status},
    NewState =
	case position_equal(CurrPos, DestPos) of
	    true -> %% 坐标点一样，直接使用家具
		use_furniture(Param, State);
	    _ ->
		Plan = {use_furniture, Param},
		mutex_actions:try_start_action(?action_type_walk, {CurrPos, DestPos, Plan}, State)
	end,
    {noreply, NewState};

%% 收到玩家结束行走的请求
handle_cast({_Msg, #req_stop_walk{pos=Pos}}, 
	    #player_data{walk_plan=WalkPlan,
			 dest_pos=DestPos}= State) ->
    State1 = mutex_actions:call_stop_action(?action_type_walk, Pos, State),
    NewState = 
	case (WalkPlan =/= []) and position_equal(Pos, DestPos) of
	    true ->
		case WalkPlan of
		    {use_furniture, Param} ->
			use_furniture(Param, State1)
		end;
	    false ->
		State1
	end,
    {noreply, NewState#player_data{walk_plan=[]}}.



%%%===================================================================
%%% 内部函数
%%%===================================================================

use_furniture({Account, FurInstID, FurTempID, FunID, _LeavePos, Status}=Param, State1) ->
    case tplt:get_data(furni_tplt, FurTempID) of
	#furni_tplt{use_type=UseType} ->
	    case UseType of
		?FurnitureNormalStatus ->
		    mutex_actions:try_start_action(?action_type_use_furniture, 
						   Param, State1);
		_ ->
		    SceneName = player_data:get_scene_name(State1),
		    router:send(SceneName, change_furniture_status, {Account, FurInstID, FunID, Status}),
		    State1
	    end;
	_ ->
	    sys_msg:send(Account, ?err_cannot_use_item), 
	    State1
    end.


%% 判断坐标点是否一样
position_equal(#point{x=X1, y=Y1,z= Z1}, #point{x=X2, y=Y2, z=Z2}) ->
    (trunc(X1) =:= trunc(X2)) and
    (trunc(Y1) =:= trunc(Y2)) and
    (trunc(Z1) =:= trunc(Z2)).
