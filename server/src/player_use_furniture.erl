%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%
%%% @end
%%% Created : 19 Apr 2012 by hongjx <hongjx@35info.cn>

-module(player_use_furniture).

-include("packet_def.hrl").
-include("mutex_actions.hrl").

-export([start/1, handle_cast/2]).

-export([do_start_action/2, do_stop_action/2]).
-behaviour(gen_action).

start(Account) ->
    [
     router:make_event_source(?msg_req_stop_use_furniture, Account, {Account, ?MODULE})
    ].

%%%===================================================================
%%% 动作相关回调函数
%%%===================================================================

%% 开始动作
%% 返回NewState || {false, Error} || {false, Error, Params} 
do_start_action({_Account, FurInstID, _FurTempID, _FunID, _LeavePos, _Status}=Param, State) ->
    SceneName = player_data:get_scene_name(State),    
    ok = router:send(SceneName, start_use_furniture, Param),
    player_data:set_use_furni_info(FurInstID, State).

%% 结束
%% 自动结束时，Param 格式为 {auto_stop, Reason}, 其它情况为call_stop_action传入的Param
%% 自动结束发生时机: 当前动作被新动作停止时，或退出游戏时
do_stop_action(_Param, State) ->
    Account = player_data:get_account(State),
    SceneName = player_data:get_scene_name(State),
    FurInstID = player_data:get_use_furni_info(State),
    router:send2(SceneName, stop_use_furniture, {Account, FurInstID}),
    player_data:set_use_furni_info(0, State).


%%%===================================================================
%%% handle_cast
%%%===================================================================


%% 停止使用家具
handle_cast({_Msg, #req_stop_use_furniture{}}, State) ->
    Account = player_data:get_account(State),
    FurInstID = player_data:get_use_furni_info(State),
    Action = ?action_type_use_furniture,
    State1 = 
	case mutex_actions:contains_action(Action, State) of
	    false ->		
		State;
	    _ ->
		mutex_actions:call_stop_action(Action,
					       {Account, FurInstID}, State)
	end,
    {noreply, State1}.








