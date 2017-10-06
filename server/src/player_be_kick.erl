%%% @author  <hjx>
%%% @copyright (C) 2010, 
%%% @doc
%%%   ���ߴ���
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
%%% ������ػص�����
%%%===================================================================

%% ��ʼ����
%% ����NewState || {false, Error} || {false, Error, Params} 
do_start_action({MasterScene, Reason}, State) 
  when is_atom(MasterScene) -> 
    MyScene = player_data:get_scene_name(State),
    case MasterScene of
	'' ->
	    %% ֱ����ճ�����, ����Ҫ֪ͨ����뿪
	    do_start_action_1(Reason, State);	    
	MyScene ->
	    do_start_action_1(Reason, State);		   
	_ -> 	    
	    {false, ?err_no_error} %% ����ͬһ��������������
    end.

do_start_action_1(Reason, State) ->
    Guest = player_data:get_account(State),
    
    %% ���˻ص����Ѽ�
    NewState = player_change_scene:enter_self_home(State),
    case Reason of
	undefined ->
	    ok;
	_ ->
	    %% ֪ͨ����ԭ��
	    sys_msg:send(Guest, Reason)
    end,
    
    NewState.
    

%% ��������
%% �Զ�����ʱ��Param ��ʽΪ {auto_stop, Reason}, �������Ϊcall_stop_action�����Param
%% �Զ���������ʱ��: ��ǰ�������¶���ֹͣʱ�����˳���Ϸʱ
do_stop_action(_Param, State) ->
    State.



%%%===================================================================
%%% ����handle_call
%%%===================================================================
%% �������˵ı��ߴ���(�д����뿪����)
handle_call({#msg{event=you_kick_me}, Param}, _From, 
	    MyState) ->

    MyNewState = mutex_actions:try_start_action(?action_type_be_kick, Param, MyState),

    {reply, ok, MyNewState}.


%%%===================================================================
%%% ����handle_cast
%%%===================================================================
%% �������ߴ���
handle_cast({#msg{event=be_kick}, KickReason},  
	    State) ->
    %% ֱ����ճ�����, ����Ҫ֪ͨ����뿪
    State0 = player_data:set_scene_name('', State),
    NewState = mutex_actions:try_start_action(?action_type_be_kick, {'', KickReason}, State0),
    {noreply, NewState};

%% ���������
handle_cast({_Msg, #req_kick_guest{target_player=TargetAccount}},
	    State) ->
    Account = player_data:get_account(State),
    [PlayerBasicData] = db:dirty_read(player_basic_data, Account),
    Guest = list_to_atom(TargetAccount),

    AtHome = player_data:is_at_home(State, PlayerBasicData),
    Scene = player_data:get_scene_name(State),

    case AtHome of
	false -> %% ���ڼ�, ��������
	    sys_msg:send(Account, ?err_only_at_home_can_kick_guest);
	true ->
	    case router:send(Guest, you_kick_me, {Scene, undefined}) of
		undefined -> %%�Է�������
		    sys_msg:send(Account, ?err_player_offline);
		_ -> 
		    MyHouseID = player_basic_data:get_house_id(PlayerBasicData),
		    %% ���汻�߼�¼��10���Ӳ�������
		    db_kick_info:save(MyHouseID, Guest),

		    %% ������ʾ
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
%%% �ڲ�����
%%%===================================================================





