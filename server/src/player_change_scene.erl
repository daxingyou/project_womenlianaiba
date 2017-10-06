%%% @author  <hjx>
%%% @copyright (C) 2010, 
%%% @doc
%%%    �л�����
%%% @end
%%% Created : 31 May 2010 by  <hjx>

-module(player_change_scene).


-include("packet_def.hrl").
-include("mutex_actions.hrl").
-include("router.hrl").
-include("enum_def.hrl").
-include("sys_msg.hrl").
-include("common_def.hrl").
-include("tplt_def.hrl").
-include("house_data.hrl").

-export([do_start_action/2, do_stop_action/2]).
-export([handle_cast/2, start/1]).

-export([enter_self_home/1, enter_self_home/2, enter_other_home/5]).

start(Account) ->
    [
     router:make_event_source(?msg_req_scene_copy_list, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_enter_common_scene, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_enter_pub_scene, Account, {Account, ?MODULE}),
     router:make_event_source(enter_self_home, Account, {Account, ?MODULE}),
     router:make_event_source(enter_pub_scene, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_enter_player_house, Account, {Account, ?MODULE})
    ].


%%%===================================================================
%%% ������ػص�����
%%%===================================================================

%% ��ʼ����
%% ����NewState || {false, Error} || {false, Error, Params} 
do_start_action(_Param, State) ->
    State.

%% ��������
%% �Զ�����ʱ��Param ��ʽΪ {auto_stop, Reason}, �������Ϊcall_stop_action�����Param
%% �Զ���������ʱ��: ��ǰ�������¶���ֹͣʱ�����˳���Ϸʱ
do_stop_action(_Param, State) ->
    State.


%%%===================================================================
%%% api
%%%===================================================================
enter_self_home(PlayerData) ->
    Account = player_data:get_account(PlayerData),
    [BasicData] = db:dirty_read(player_basic_data, Account),
    HouseID = player_basic_data:get_house_id(BasicData),
    [HouseData] = db:dirty_read(house_data, HouseID),
    enter_self_home(PlayerData, HouseData).

enter_self_home(PlayerData, HouseData) ->
    Account = player_data:get_account(PlayerData),
    case try_enter_scene(Account, PlayerData, HouseData) of
	{false, Err} ->
	    Account = player_data:get_account(PlayerData),
	    sys_msg:send(Account, Err),
	    PlayerData;
	{ok, NPlayerData, _PlayerCount} ->
	    NPlayerData
    end.


%%%===================================================================
%%% ����handle_cast
%%%===================================================================
handle_cast({_Msg, 
	     #req_scene_copy_list{template_id=SceneTpltID}}, PlayerData) ->
    List = common_scene:get_copy_state_list(SceneTpltID),

    Account = player_data:get_account(PlayerData),
    
    net_helper:send2client(Account, 
			   #notify_scene_copy_list{template_id=SceneTpltID, 
						   state_list=List}),

    {noreply, PlayerData};


%% ����������
handle_cast({_Msg, 
	     #req_enter_common_scene{template_id=SceneTpltID, copy_id=DestCopyID}}, PlayerData) ->

    Account = player_data:get_account(PlayerData),

    case DestCopyID >= 0 of
	true ->
	    CopyID = DestCopyID,

	    ForceEnter = false,
	    NewPlayerData = try_enter_common_scene(SceneTpltID, CopyID, ForceEnter, Account, PlayerData),
	    
	    {noreply, NewPlayerData};
	_ -> %%CopyID = -1, ֧���Զ��г���
	    case common_scene:fetch_free_copy_id(SceneTpltID) of
		{false, Err} ->
		    sys_msg:send(Account, Err),
		    {noreply, PlayerData};
		CopyID ->
		    ForceEnter = true,
		    NewPlayerData = try_enter_common_scene(SceneTpltID, CopyID, ForceEnter, Account, PlayerData),
		    
		    {noreply, NewPlayerData}	    
	    end
    end;
    

%% ���ưɳ���
handle_cast({_Msg, 
	     #req_enter_pub_scene{}}, PlayerData) ->

    NewPlayerData = enter_pub_scene(PlayerData),

    {noreply, NewPlayerData};	    

handle_cast({#msg{event=enter_pub_scene}, {}}, PlayerData) ->
    NewPlayerData = enter_pub_scene(PlayerData),

    {noreply, NewPlayerData};	    


handle_cast({#msg{event=enter_self_home}, {}}, PlayerData) ->
    Account = player_data:get_account(PlayerData),
    [PlayerBasicData] = db:dirty_read(player_basic_data, Account),
    case player_data:is_at_home(PlayerData, PlayerBasicData) of
	true ->
	    {noreply, PlayerData};	    
	_ ->
	    PlayerData1 = enter_self_home(PlayerData),
	    {noreply, PlayerData1}
    end;

%% ������ҽ�����ҳ���������
handle_cast({_Msg, 
	     #req_enter_player_house{type=Type, account=TargetAccount}}, PlayerData) ->
    Target = list_to_atom(TargetAccount),
    Account = player_data:get_account(PlayerData),
    case Target of
	Account -> %% ���Ѽ�
	    PlayerData1 = enter_self_home(PlayerData),
	    router:cast(Account, on_enter_self_home, Account),
	    {noreply, PlayerData1};
	_ ->
	    NewPlayerData = enter_other_home(Target, Account, Type, false, PlayerData),
	    {noreply, NewPlayerData}
    end.

%%%===================================================================
%%% �ڲ�����
%%%===================================================================

%% ���Խ���
try_enter_scene(OtherAccount, PlayerData, OtherHouseData) when is_atom(OtherAccount) ->   
    Account = player_data:get_account(PlayerData),
    case can_enter_scene(OtherAccount, OtherHouseData) of
	{false, Reason} ->      
	    {false, Reason};
	true ->  
	    SceneName = router:send(scene_manager, create_house, {OtherHouseData}),
	    ForceEnter = house:is_house_owner(OtherHouseData, Account),
	    try_enter_scene_1(PlayerData, ForceEnter, SceneName, Account)	    
    end.

try_enter_scene_1(PlayerData, ForceEnter, SceneName, Account) ->
    EnterPos = born_pos,
    NewPlayerData = mutex_actions:clear_actions(?action_type_change_scene,  
						PlayerData),

    case router:send(SceneName, try_enter_scene, 
		     {Account, EnterPos, ForceEnter}) of
	{false, Err} -> 
	    {false, Err};
	{ok, Pos, PlayerCount} ->
	    OldScene = player_data:get_scene_name(PlayerData),
	    PlayerData1 = 
		case OldScene of
		    '' ->
			NewPlayerData;
		    SceneName ->
			NewPlayerData;
		    _ ->
			%% ȷ���ѽ����³������뿪�ɳ���
			router:send2(OldScene, leave_scene, Account),			
			party:on_leave_scene(NewPlayerData)
		end,

	    net_helper:send2client(Account, #notify_stop_walk{account=Account,pos=Pos}),
	    PlayerData2 = player_data:change_scene(SceneName, Pos, PlayerData1),
	    PlayerData3 = party:on_enter_scene(PlayerData2),	    

	    {ok, PlayerData3, PlayerCount}
    end.


enter_pub_scene(PlayerData) ->
    Account = player_data:get_account(PlayerData),
    case player_data:get_pub_id(PlayerData) of
	0 ->
	    sys_msg:send(Account, ?err_not_pub_channel),
	    PlayerData;
	PubID when is_integer(PubID) ->
	    ForceEnter = false,
	    SceneName = router:send(scene_manager, active_pub_scene, {PubID}),
	    case try_enter_scene_1(PlayerData, ForceEnter, SceneName, Account) of		
		{false, Err} ->
		    sys_msg:send(Account, Err),
		    PlayerData;
		{ok, NPlayerData, _PlayerCount} ->
		    pub:notify_sync_player_count([], PubID),
		    NPlayerData
	    end	    
    end.

try_enter_common_scene(SceneTpltID, CopyID, ForceEnter, Account, PlayerData) ->
    SceneName = common_scene:id_to_scene(SceneTpltID, CopyID),
    case util:is_process_alive(SceneName) of
	false ->
	    %% ��Ϊ���ϳ���
	    common_scene:sync_player_count(SceneTpltID, CopyID, -1),
	    sys_msg:send(Account, ?err_scene_not_exists),
	    PlayerData;
	_ ->
	    case try_enter_scene_1(PlayerData, ForceEnter, SceneName, Account) of		
		{false, Err} ->
		    sys_msg:send(Account, Err),
		    PlayerData;
		{ok, NPlayerData, PlayerCount} ->
		    common_scene:sync_player_count(SceneTpltID, CopyID, PlayerCount),
		    NPlayerData
	    end
    end.

can_enter_scene('', _OtherHouseData) ->   
    {false, ?err_target_is_empty}; %% �˺�Ϊ��, ���ܽ�
can_enter_scene(_OtherAccount, []) ->
    {false, ?err_player_no_love_home}; %% û����, ���ܽ�
can_enter_scene(_OtherAccount, #house_data{mateup_status=?mst_mateuping}) -> 
    {false, ?err_visit_mateuping}; %% ������Է��ӣ����ܽ�
can_enter_scene(_OtherAccount, #house_data{mateup_status=?mst_breakuping}) -> 
    {false, ?err_visit_breakuping}; %% ������鷿�ӣ����ܽ�
can_enter_scene(OtherAccount, _OtherHouseData) when is_atom(OtherAccount) ->   
    true.

enter_other_home(Target, Account, Type, HasInviteCard, PlayerData) ->
    HouseID = db_pair_player:get_house_id(Target),
    case db:dirty_read(house_data, HouseID) of
	[] -> %% û����
	    sys_msg:send(Account, ?err_account_cant_exist),
	    PlayerData;
	[TargetHouseData] ->		
	    case db_kick_info:can_enter_house(TargetHouseData, Account) of
		true ->
		    case party:in_private_party(HouseID) and (not HasInviteCard) of
			false -> 
			    case try_enter_scene(Target, PlayerData, TargetHouseData) of
				{false, Err} ->
				    sys_msg:send(Account, Err),
				    PlayerData;
				{ok, NPlayerData, _PlayerCount} ->
				    router:cast(Account, enter_house_event, {Type, HouseID}),
				    NPlayerData
			    end;					
			_ ->
			    sys_msg:send(Account, ?err_can_not_enter_private_party),
			    PlayerData
		    end;
		_ ->
		    sys_msg:send(Account, ?err_not_allow_enter),
		    PlayerData
	    end
    end.
