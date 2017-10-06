%%% @author  <hjx>
%%% @copyright (C) 2010, 
%%% @doc
%%%   玩家动作表情
%%% @end
%%% Created : 2010-10-09 by  <hjx>

-module(player_action).


-include("packet_def.hrl").
-include("router.hrl").
-include("enum_def.hrl").
-include("sys_msg.hrl").
-include("common_def.hrl").
-include("player_data.hrl").
-include("mutex_actions.hrl").

-export([start/1, notify/2, get_packets/1, handle_cast/2]).

start(Account) ->
    [
     router:make_event_source(?msg_req_start_body_action, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_end_body_action, Account, {Account, ?MODULE})
    ].
%%%===================================================================
%%% 处理api
%%%===================================================================
notify(HeAccount, PlayerData) when is_record(PlayerData, player_data) ->
    Account = player_data:get_account(PlayerData),
    ActionStatus = player_data:get_action_status(PlayerData),
    ActionType = player_data:get_action_type(PlayerData),
    case (ActionStatus == "") and (ActionType == "") of
	true ->
	    ok;
	false ->
	    net_helper:send2client(HeAccount, #notify_start_body_action{account=Account, action_status=ActionStatus, action_type=ActionType})
    end.    

get_packets(PlayerData) when is_record(PlayerData, player_data) ->
    Account = player_data:get_account(PlayerData),
    ActionStatus = player_data:get_action_status(PlayerData),
    ActionType = player_data:get_action_type(PlayerData),
    case (ActionStatus == "") and (ActionType == "") of
	true ->
	    [];
	false ->
	    [#notify_start_body_action{account=Account, action_status=ActionStatus, action_type=ActionType}]
    end.    
    

%%%===================================================================
%%% handle_cast
%%%===================================================================
%% 请求开始动作
%% 1.验证该动作是否可行
%% 2.保存Action
%% 3.广播场景内的玩家播放该动作
handle_cast({_Msg,#req_start_body_action{action_status=ActionStatus, action_type=ActionType}},State) ->
    Account = player_data:get_account(State),

    %% 清除其它动作
    State0 = mutex_actions:clear_actions(?action_type_body_action, State),    

    SceneName = player_data:get_scene_name(State),
    NState = player_data:set_action_status(ActionStatus, State0),
    NNState = player_data:set_action_type(ActionType, NState),

    Packet = #notify_start_body_action{account=Account, action_status=ActionStatus, action_type=ActionType},
    net_helper:send2client(Account, Packet),
    router:cast(undefined, SceneName, broadcast_other_players, {Account, Packet}),
    {noreply, NNState};
handle_cast({_Msg,#req_end_body_action{}},State) ->
    Account = player_data:get_account(State),
    SceneName = player_data:get_scene_name(State),
    NState = player_data:set_action_status("", State),
    NNState = player_data:set_action_type("", NState),
    Packet = #notify_end_body_action{account=Account}, 
    net_helper:send2client(Account, Packet),
    router:cast(undefined, SceneName, broadcast_other_players, {Account, Packet}),
    {noreply, NNState}.

