%%% @author  <hjx>
%%% @copyright (C) 2010, 
%%% @doc
%%%   �������
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
%%% ������ػص�����
%%%===================================================================

%% ��ʼ����
%% ����NewState || {false, Error} || {false, Error, Params} 
%% ��ҿ�ʼ����
do_start_action({CurrPos, DestPos, Plan}, #player_data{account=Account, scene_name=SceneName}=State) ->
    Packet = #notify_start_walk{account=Account, curr_pos=CurrPos, dest_pos=DestPos},
    net_helper:send2client(Account, Packet), 
    router:cast(undefined, SceneName, broadcast_other_players, {Account, Packet}),
    State#player_data{curr_pos=CurrPos, dest_pos=DestPos, walk_plan=Plan}.

%% ��������
%% �Զ�����ʱ��Param ��ʽΪ {auto_stop, Reason}, �������Ϊcall_stop_action�����Param
%% �Զ���������ʱ��: ��ǰ�������¶���ֹͣʱ�����˳���Ϸʱ
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
%%% ����handle_cast
%%%===================================================================

%% �յ���ҿ�ʼ���ߵ�����
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

%% �յ��ͻ���ͬ��λ�õ�����
handle_cast({_Msg,#req_sync_position{pos=Pos}},State) ->
    {noreply, State#player_data{curr_pos=Pos}};


%% �������ʹ�üҾ�
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
	    true -> %% �����һ����ֱ��ʹ�üҾ�
		use_furniture(Param, State);
	    _ ->
		Plan = {use_furniture, Param},
		mutex_actions:try_start_action(?action_type_walk, {CurrPos, DestPos, Plan}, State)
	end,
    {noreply, NewState};

%% �յ���ҽ������ߵ�����
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
%%% �ڲ�����
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


%% �ж�������Ƿ�һ��
position_equal(#point{x=X1, y=Y1,z= Z1}, #point{x=X2, y=Y2, z=Z2}) ->
    (trunc(X1) =:= trunc(X2)) and
    (trunc(Y1) =:= trunc(Y2)) and
    (trunc(Z1) =:= trunc(Z2)).
