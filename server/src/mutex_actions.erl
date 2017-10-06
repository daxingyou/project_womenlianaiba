%%% @author  <hjx>
%%% @copyright (C) 2010, 
%%% @doc
%%%     动作互斥基础单元
%%% @end
%%% Created : 20 May 2010 by  <hjx>

-module(mutex_actions).


-include("packet_def.hrl").
-include("mutex_actions.hrl").
-include("router.hrl").
-include("enum_def.hrl").
-include("common_def.hrl").
-include("sys_msg.hrl").


-export([start/1, handle_call/3]).

%% 动作互斥相关
-export([try_start_action/3, 
	 call_stop_action/2, 
	 call_stop_action/3, 
	 contains_action/2
	]).

-export([clear_actions/2]).

-define(action_id_index, 1).


start(Account) ->
    [
     router:make_event_target(stop_action, Account, {Account, ?MODULE}),
     router:make_event_target(has_action, Account, {Account, ?MODULE})
    ].


%%%===================================================================
%%% 定义每个动作对应的模块
%%%===================================================================
-spec get_action_mod(integer()) -> atom().
get_action_mod(?action_type_edit_house) -> 
    player_edit_house;
get_action_mod(?action_type_invite) -> 
    player_invite;
get_action_mod(?action_type_be_invite)-> 
    player_be_invite;
get_action_mod(?action_type_walk) -> 
    player_walk;
get_action_mod(?action_type_change_scene) -> 
    player_change_scene;
get_action_mod(?action_type_trade) -> 
    player_trade;
get_action_mod(?action_type_use_furniture) -> 
    player_use_furniture;
get_action_mod(?action_type_change_looks) -> 
    player_change_looks;
get_action_mod(?action_type_body_action) -> 
    player_body_action;
get_action_mod(?action_type_be_kick) ->
    player_be_kick;
get_action_mod(?action_type_wear) ->
    player_wear;
get_action_mod(ActionID) when is_integer(ActionID) ->
    erlang:error({action_id_module_undefined, ActionID}).

%%%===================================================================
%%% 是否为瞬时动作, 如果是, 不记录状态，不添加到动作列表
%%%===================================================================
-spec is_immediate_action(integer()) -> boolean().
is_immediate_action(?action_type_invite) ->        %% 邀请
    true;
is_immediate_action(?action_type_change_scene) ->   %% 换场景
    true;
is_immediate_action(?action_type_be_kick) ->       %% 被踢
    true;
is_immediate_action(?action_type_wear) ->          %% 穿衣服
    true;
is_immediate_action(ActionID) when is_integer(ActionID) -> %% 默认不是瞬时动作
    false.

%%%===================================================================
%%% 处理handle_call
%%%===================================================================
%% 结束动作
handle_call({#msg{event=stop_action}, {ActionID, Param}}, _From, State) ->  
    %%io:format("handle call stop action ~p ~n~n~n", [{Param}]),
    NewState = call_stop_action(ActionID, Param, State),
    {reply, ok, NewState};
handle_call({#msg{event=has_action}, ActionID}, _From, State) ->  
    Actions = player_data:get_actions(State),
    Ret = 
	case lists:keyfind(ActionID, ?action_id_index, Actions) of
	    false ->
		false;
	    _ ->
		true
	end,
    {reply, Ret, State}.


%%%===================================================================
%%% API
%%%===================================================================
-spec contains_action(integer(), tuple()) -> boolean().			      
contains_action(ActionID, State) ->
    Actions = player_data:get_actions(State),
    lists:keymember(ActionID, ?action_id_index, Actions).

try_start_new_action(OldActions, NewActionID, Param, State) ->
    case inner_can_start_new_action(OldActions, NewActionID) of
	true ->
	    %% 启动动作
	    call_start_action(NewActionID, Param, State);
	Other ->
	    Other
    end.

%% 开始某个动作
call_start_action(ActionID, Param, OldState) 
  when is_integer(ActionID) ->
    OldActions = player_data:get_actions(OldState),
    CurState = before_start_action(ActionID, OldActions, OldState),
    start_action_proc(ActionID, Param, CurState).

%% 结束某个动作
call_stop_action(ActionID, State) when is_integer(ActionID) ->
    call_stop_action(ActionID, no_param, State).
call_stop_action(ActionID, Param, State) when is_integer(ActionID) ->
    OldActions = player_data:get_actions(State),
    case lists:keyfind(ActionID, ?action_id_index, OldActions) of
	{ActionID, []} ->
	    Mod = get_action_mod(ActionID),
	    NewState = Mod:do_stop_action(Param, State),

	    %% 从列表中删除
	    %%
	    NewActions = lists:keydelete(ActionID, ?action_id_index, OldActions),	    
	    player_data:set_actions(NewActions, NewState);
	false ->
	    State
    end.


%% 尝试开始某个动作
try_start_action(ActionID, Param, State) when is_integer(ActionID) ->    
    Account = player_data:get_account(State),
    OldActions = player_data:get_actions(State),

    %% 取出当前正在进行中的所有动作项[1,2,3,5,7], 判断可否开始动作 
    case try_start_new_action(OldActions, ActionID, Param, State) of
	{false, ?err_no_error} -> %% 不报告错误
	    State;
	{false, Error} ->
	    %% 如果不允许的话，且有!则只提示第一个!错误, 退出
	    sys_msg:send(Account, Error),
	    data_helper:format("can not start action, error: ~w\n", [Error]),
	    State;
	{false, Error, Params} ->
	    sys_msg:send(Account, Error, Params),
	    State;
	{true, NewState} ->
	    NewState;
	Any ->
	    erlang:error({can_start_new_action_return_val_error, Any, {ActionID, Param, State}})
    end;
try_start_action(ActionID, Param, State) ->     
    erlang:error({try_start_action_error, {ActionID, Param, State}}).
    

%% 清除所有动作
clear_actions(Reason, State) ->
    ActionList = player_data:get_actions(State),
    ActionIDs = [ID || {ID, _Msgs} <- ActionList],
    data_helper:format("\nclear actions ~w\n", [ActionIDs]),
    auto_stop_actions(ActionIDs, Reason, State).

%%%===================================================================
%%% 内部函数
%%%===================================================================

%% 开始某个动作前需要做的一些处理
%% 返回State
before_start_action(ActionID, OldActions, State) when is_integer(ActionID), is_list(OldActions) ->
    StopActionIDs = get_stop_actions(OldActions, ActionID),
    Reason = ActionID, %% 原因为开始 新动作
    auto_stop_actions(StopActionIDs, Reason, State).

%% 取得需要停止的动作列表
%% 返回 list() 
get_stop_actions(OldActions, NewActionID) 
  when is_list(OldActions), is_integer(NewActionID) ->
    F = fun({OldActionID, _Msgs}, RetList) -> 
		MutexList = get_action_mutex_list(OldActionID),
		case lists:nth(NewActionID, MutexList) of
		    ?action_stop_mark -> [OldActionID | RetList]; 
		    _  -> RetList
		end			
	end,
    
    lists:foldl(F, [], OldActions).


%% 判断能否开始某个动作
%% 遇到第一个不为true的就停止搜索
%% 返回true | {false, Reason}
inner_can_start_new_action([], _NewActionID) ->
    true;
inner_can_start_new_action([{OldActionID, _Msgs} | Rest], NewActionID) 
  when is_integer(NewActionID), is_integer(OldActionID) ->
    case inner_can_start_action(OldActionID, NewActionID, get_action_mutex_list(OldActionID)) of
	true -> %% 成功，则继续看下一当前动作是否也允许开始新动作
	    inner_can_start_new_action(Rest, NewActionID);	    
	Error -> 
	    Error
    end.

%% 取出一个动作的动作关系描述列表
get_action_mutex_list(ActionID) when is_integer(ActionID) ->
    {_File, ActionID, _Name, MutexDesc} = tplt:get_data(mutex_actions, ActionID),
    MutexDesc.


%% 自动停止一系列动作
%% 返回State
auto_stop_actions(ActionIDs, Reason, State) when is_list(ActionIDs) ->
    auto_stop_action_1(ActionIDs, Reason, State).

auto_stop_action_1([], _Reason, State) ->
    State;
auto_stop_action_1([ActionID | Rest], Reason, State) ->
    NewState = auto_stop_action(ActionID, Reason, State),
    auto_stop_action_1(Rest, Reason, NewState).

%% 判断可否开始某个动作
%% 传入新旧动作ID 以及它们的关系Mark
%% 返回true | {false, Reason}
can_start_action_result(OldActionID, NewActionID, Mark) 
  when is_integer(OldActionID), is_integer(NewActionID), is_integer(Mark) -> 
    case Mark of
	?action_allow_mark ->
	    true;
	?action_stop_mark ->
	    true;
	    %%{false, ?err_no_error};
	?action_error_mark ->
	    {false, ?err_no_error}	    
	    %% ErrorNo = (100 + OldActionID) * 100 + NewActionID,
	    %% {false, ErrorNo}
    end.

inner_can_start_action(OldActionID, NewActionID, MutexList) 
  when is_integer(OldActionID), is_integer(NewActionID), is_list(MutexList) -> 
    case (1 =< NewActionID) and (NewActionID =< length(MutexList)) of
	true ->
	    Mark = lists:nth(NewActionID, MutexList),
	    can_start_action_result(OldActionID, NewActionID, Mark);
	false ->
	    erlang:error({"mutex action id unbound.", NewActionID, MutexList, OldActionID})
    end.

%% 自动停止某个动作
%% 返回State
auto_stop_action(ActionID, Reason, State) ->
    Param = {auto_stop, Reason},
    call_stop_action(ActionID, Param, State).


%% 开始某个动作
start_action_proc(ActionID, Param, State) ->
    Mod = get_action_mod(ActionID),
    
    case Mod:do_start_action(Param, State) of
	{false, Err} -> {false, Err};
	{false, Err, Args} -> {false, Err, Args};
	NewState ->
	    case is_immediate_action(ActionID) of
		true -> %% 表示瞬时动作，不加入动作列表	   
		    {true, NewState};
		false ->
		    %% 加入到动作列表中
		    %%
		    CurActions = player_data:get_actions(NewState),
		    NewActions = [{ActionID, []} | CurActions],
		    {true, player_data:set_actions(NewActions, NewState)}
	    end
    end.


%%%===================================================================
%%% 测试函数
%%%===================================================================
-include_lib("eunit/include/eunit.hrl").
-ifdef(TEST).

%% 测试函数的入口

inner_can_start_action_test() ->
    MutexList = [?action_allow_mark, ?action_error_mark, ?action_stop_mark],
    ?assertEqual({false, 10102}, inner_can_start_action(1, 2, MutexList)),
    ?assertEqual(true, inner_can_start_action(2, 1, MutexList)),
    ?assertEqual(true, inner_can_start_action(1, 3, MutexList)),

    ok.

-endif.
