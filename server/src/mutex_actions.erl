%%% @author  <hjx>
%%% @copyright (C) 2010, 
%%% @doc
%%%     �������������Ԫ
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

%% �����������
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
%%% ����ÿ��������Ӧ��ģ��
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
%%% �Ƿ�Ϊ˲ʱ����, �����, ����¼״̬������ӵ������б�
%%%===================================================================
-spec is_immediate_action(integer()) -> boolean().
is_immediate_action(?action_type_invite) ->        %% ����
    true;
is_immediate_action(?action_type_change_scene) ->   %% ������
    true;
is_immediate_action(?action_type_be_kick) ->       %% ����
    true;
is_immediate_action(?action_type_wear) ->          %% ���·�
    true;
is_immediate_action(ActionID) when is_integer(ActionID) -> %% Ĭ�ϲ���˲ʱ����
    false.

%%%===================================================================
%%% ����handle_call
%%%===================================================================
%% ��������
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
	    %% ��������
	    call_start_action(NewActionID, Param, State);
	Other ->
	    Other
    end.

%% ��ʼĳ������
call_start_action(ActionID, Param, OldState) 
  when is_integer(ActionID) ->
    OldActions = player_data:get_actions(OldState),
    CurState = before_start_action(ActionID, OldActions, OldState),
    start_action_proc(ActionID, Param, CurState).

%% ����ĳ������
call_stop_action(ActionID, State) when is_integer(ActionID) ->
    call_stop_action(ActionID, no_param, State).
call_stop_action(ActionID, Param, State) when is_integer(ActionID) ->
    OldActions = player_data:get_actions(State),
    case lists:keyfind(ActionID, ?action_id_index, OldActions) of
	{ActionID, []} ->
	    Mod = get_action_mod(ActionID),
	    NewState = Mod:do_stop_action(Param, State),

	    %% ���б���ɾ��
	    %%
	    NewActions = lists:keydelete(ActionID, ?action_id_index, OldActions),	    
	    player_data:set_actions(NewActions, NewState);
	false ->
	    State
    end.


%% ���Կ�ʼĳ������
try_start_action(ActionID, Param, State) when is_integer(ActionID) ->    
    Account = player_data:get_account(State),
    OldActions = player_data:get_actions(State),

    %% ȡ����ǰ���ڽ����е����ж�����[1,2,3,5,7], �жϿɷ�ʼ���� 
    case try_start_new_action(OldActions, ActionID, Param, State) of
	{false, ?err_no_error} -> %% ���������
	    State;
	{false, Error} ->
	    %% ���������Ļ�������!��ֻ��ʾ��һ��!����, �˳�
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
    

%% ������ж���
clear_actions(Reason, State) ->
    ActionList = player_data:get_actions(State),
    ActionIDs = [ID || {ID, _Msgs} <- ActionList],
    data_helper:format("\nclear actions ~w\n", [ActionIDs]),
    auto_stop_actions(ActionIDs, Reason, State).

%%%===================================================================
%%% �ڲ�����
%%%===================================================================

%% ��ʼĳ������ǰ��Ҫ����һЩ����
%% ����State
before_start_action(ActionID, OldActions, State) when is_integer(ActionID), is_list(OldActions) ->
    StopActionIDs = get_stop_actions(OldActions, ActionID),
    Reason = ActionID, %% ԭ��Ϊ��ʼ �¶���
    auto_stop_actions(StopActionIDs, Reason, State).

%% ȡ����Ҫֹͣ�Ķ����б�
%% ���� list() 
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


%% �ж��ܷ�ʼĳ������
%% ������һ����Ϊtrue�ľ�ֹͣ����
%% ����true | {false, Reason}
inner_can_start_new_action([], _NewActionID) ->
    true;
inner_can_start_new_action([{OldActionID, _Msgs} | Rest], NewActionID) 
  when is_integer(NewActionID), is_integer(OldActionID) ->
    case inner_can_start_action(OldActionID, NewActionID, get_action_mutex_list(OldActionID)) of
	true -> %% �ɹ������������һ��ǰ�����Ƿ�Ҳ����ʼ�¶���
	    inner_can_start_new_action(Rest, NewActionID);	    
	Error -> 
	    Error
    end.

%% ȡ��һ�������Ķ�����ϵ�����б�
get_action_mutex_list(ActionID) when is_integer(ActionID) ->
    {_File, ActionID, _Name, MutexDesc} = tplt:get_data(mutex_actions, ActionID),
    MutexDesc.


%% �Զ�ֹͣһϵ�ж���
%% ����State
auto_stop_actions(ActionIDs, Reason, State) when is_list(ActionIDs) ->
    auto_stop_action_1(ActionIDs, Reason, State).

auto_stop_action_1([], _Reason, State) ->
    State;
auto_stop_action_1([ActionID | Rest], Reason, State) ->
    NewState = auto_stop_action(ActionID, Reason, State),
    auto_stop_action_1(Rest, Reason, NewState).

%% �жϿɷ�ʼĳ������
%% �����¾ɶ���ID �Լ����ǵĹ�ϵMark
%% ����true | {false, Reason}
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

%% �Զ�ֹͣĳ������
%% ����State
auto_stop_action(ActionID, Reason, State) ->
    Param = {auto_stop, Reason},
    call_stop_action(ActionID, Param, State).


%% ��ʼĳ������
start_action_proc(ActionID, Param, State) ->
    Mod = get_action_mod(ActionID),
    
    case Mod:do_start_action(Param, State) of
	{false, Err} -> {false, Err};
	{false, Err, Args} -> {false, Err, Args};
	NewState ->
	    case is_immediate_action(ActionID) of
		true -> %% ��ʾ˲ʱ�����������붯���б�	   
		    {true, NewState};
		false ->
		    %% ���뵽�����б���
		    %%
		    CurActions = player_data:get_actions(NewState),
		    NewActions = [{ActionID, []} | CurActions],
		    {true, player_data:set_actions(NewActions, NewState)}
	    end
    end.


%%%===================================================================
%%% ���Ժ���
%%%===================================================================
-include_lib("eunit/include/eunit.hrl").
-ifdef(TEST).

%% ���Ժ��������

inner_can_start_action_test() ->
    MutexList = [?action_allow_mark, ?action_error_mark, ?action_stop_mark],
    ?assertEqual({false, 10102}, inner_can_start_action(1, 2, MutexList)),
    ?assertEqual(true, inner_can_start_action(2, 1, MutexList)),
    ?assertEqual(true, inner_can_start_action(1, 3, MutexList)),

    ok.

-endif.
