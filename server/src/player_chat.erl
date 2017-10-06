%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%   聊天相关
%%% @end
%%% Created : 12 Apr 2012 by hongjx <hongjx@35info.cn>

-module(player_chat).

-export([start/1]).
-export([handle_cast/2]).


-include("packet_def.hrl").
-include("sys_msg.hrl").

start(Account) ->
    [
     router:make_event_source(?msg_req_chat_world, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_chat_around, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_channel_tell, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_chat_tell, Account, {Account, ?MODULE})
    ].


%% 处理玩家在场景中说话
handle_cast({_Msg, #req_chat_world{content=Content}}, State) ->
    Account = player_data:get_account(State),
    [PlayerBasicData] = db:dirty_read(player_basic_data, Account),
    HouseID = player_basic_data:get_house_id(PlayerBasicData),
    ItemIDList = common_def:get_val(laba_item_id),
    case house_lover_package:del_item_by_tempid(HouseID, Account, ItemIDList) of
    	true ->
	    UserName = player_basic_data:get_username(PlayerBasicData),    
	    Packet = #notify_chat_world{account=atom_to_list(Account), 
					player_name=UserName, content=Content},
	    sys_broadcast:send_to_all_players(Packet),
	    router:cast(Account, chat_world_event, Content);
    	{false, _Error} ->
    	    sys_msg:send(Account, ?err_not_laba)
    end,
    
    {noreply, State};
%% 处理玩家在场景中说话
handle_cast({_Msg, #req_chat_around{content=Content}}, State) ->
    Account = player_data:get_account(State),
    SceneName = player_data:get_scene_name(State),
    [PlayerBasicData] = db:dirty_read(player_basic_data, Account),
    UserName = player_basic_data:get_username(PlayerBasicData),    
    Packet = #notify_chat_around{account=atom_to_list(Account), player_name=UserName, content=Content},
    router:cast(undefined, SceneName, broadcast_other_players, {Account, Packet}),
    {noreply, State};
%% 处理玩家对玩家说话(密聊)
handle_cast({_Msg, #req_chat_tell{target_player=TargetAccount, content=Content}}, State) ->
    Account = player_data:get_account(State),
    [PlayerBasicData] = db:dirty_read(player_basic_data, Account),
    UserName = player_basic_data:get_username(PlayerBasicData),    
    Packet = #notify_chat_tell{speaker=atom_to_list(Account), speaker_name=UserName, content=Content},
    TargetPlayer = list_to_atom(TargetAccount),   
    case util:is_process_alive(TargetPlayer) of
	false ->
	    sys_msg:send(Account, ?err_player_offline);
	_ ->
	    net_helper:send2client(TargetPlayer, Packet)
    end,
    {noreply, State};
%% 处理玩家对玩家说话(频道密聊)
handle_cast({_Msg, #req_channel_tell{target_player=TargetAccount, content=Content}}, State) ->
    Account = player_data:get_account(State),
    [PlayerBasicData] = db:dirty_read(player_basic_data, Account),
    UserName = player_basic_data:get_username(PlayerBasicData),    
    Packet = #notify_channel_tell{speaker=atom_to_list(Account), speaker_name=UserName, content=Content},
    TargetPlayer = list_to_atom(TargetAccount),   
    case util:is_process_alive(TargetPlayer) of
	false ->
	    sys_msg:send(Account, ?err_player_offline);
	_ ->
	    net_helper:send2client(TargetPlayer, Packet)
    end,
    {noreply, State}.




