%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2013, hongjx
%%% @doc
%%%   酒吧
%%% @end
%%% Created : 21 Feb 2013 by hongjx <hongjx@35info.cn>

-module(pub).

-include("router.hrl").
-include("table_info.hrl").
-include("enum_def.hrl").
-include("common_def.hrl").
-include("sys_msg.hrl").
-include("tplt_def.hrl").
-include("packet_def.hrl").
-include("player_data.hrl").
-include("records.hrl").
-include("resource.hrl").
-include("house_data.hrl").

-export([start/1, handle_cast/2, leave/2, get_owner/1, get_pub_info/1, 
	 notify_sync_player_count/2
]).


start(Account) ->
    [
     router:make_event_source(?msg_req_pub_list, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_leave_pub_channel, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_enter_pub_channel, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_update_pub_voice_id, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_kick_channel_player, Account, {Account, ?MODULE}),
     router:make_event_source(be_kick_out_channel, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_send_yy_gift, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_chat_channel, Account, {Account, ?MODULE})
    ].

leave(Account, PubID) when is_atom(Account), is_integer(PubID) ->
    case PubID of
	0 ->
	    ok;
	_ ->
	    Message = #notify_update_pub_voice_id{pub_id=PubID, voice_id=0},
	    %% 如果是主播退出要通知大家yy_voice_id清0
	    Owner = get_owner(PubID),
	    case Owner of
		Account ->
		    channel_service:stop_announce(Account, PubID),

		    %% Log = atom_to_list(Account) ++ " host leave pub voice_id set to :" ++ integer_to_list(0),
		    %% channel_service:broadcast(PubID, [build_log(Log)], [Account]),
		    channel_service:broadcast(PubID, [Message], []);
		_ ->
		    net_helper:send2client(Account, Message)		    
	    end,
	    channel_service:go_out(Account, PubID),
	    router:cast(Account, enter_self_home, {}),
	    channel_service:broadcast(PubID, 
				      #notify_channel_del_player{channel_id=PubID, account=Account})

    end.

%% 取主播
get_owner(PubID) when is_integer(PubID) ->
    get_owner(channel_service:get_status_info(PubID));
get_owner(#channel_status_info{basic_info=Info}) ->
    #channel_basic_info{admin=Owner} = Info,
    Owner;
get_owner(_Other) ->
    [].


%%%===================================================================
%%% handle cast 
%%%===================================================================
%% 频道踢人
handle_cast({_Msg, #req_kick_channel_player{account=KickPlayer}}, PlayerData) ->
    Guest = list_to_atom(KickPlayer),
    Account = player_data:get_account(PlayerData),
    case player_data:get_pub_id(PlayerData) of
	0 -> %% 不在频道中
	    sys_msg:send(Account, ?err_not_pub_channel);
	PubID ->
	    case get_owner(PubID) of
		Account -> %% 酒吧主人才能踢	    
		    case pub_has_player(PubID, Guest) of
			false ->
			    sys_msg:send(Account, ?err_target_not_in_channel);
			_ ->
			    db_pub_kick_info:save(PubID, Guest),
			    AdminName = get_name(Account),
			    router:cast(Guest, be_kick_out_channel, {PubID, AdminName})
		    end;
		_ -> %% 无权踢人
		    sys_msg:send(Account, ?err_channel_only_host_can_kick)
	    end
    end,
    {noreply, PlayerData};

%% YY送礼
handle_cast({_Msg, #req_send_yy_gift{gift_id=GiftID, gift_count=GiftCount, 
				    recver_account=RecverAccount}}, PlayerData) ->
    Recver = list_to_atom(RecverAccount),
    Account = player_data:get_account(PlayerData),
    case Recver of
	Account ->
	    sys_msg:send(Account, ?err_yy_gift_send_self);
	_ ->
	    case player_data:get_pub_id(PlayerData) of
		0 ->
		    ok;
		PubID ->
		    case pub_has_player(PubID, Recver) of
			false ->
			    sys_msg:send(Account, ?err_target_not_in_channel);
			_ ->
			    do_send_gift(Account, GiftID, GiftCount, Recver, PubID, PlayerData)
		    end
	    end
    end,
    {noreply, PlayerData};

%% 离开频道
handle_cast({_Msg, #req_leave_pub_channel{pub_id=PubID}}, PlayerData) ->
    Account = player_data:get_account(PlayerData),
    case player_data:get_pub_id(PlayerData) of
	0 ->
	    {noreply, PlayerData};
	PubID ->
	    leave(Account, PubID),
	    notify_sync_player_count([], PubID),
	    NPlayerData = player_data:set_pub_id(0, PlayerData),
	    {noreply, NPlayerData};
	_ ->
	    {noreply, PlayerData}
    end;

%% 处理在频道中被踢
handle_cast({#msg{event=be_kick_out_channel}, {OldPubID, AdminName}}, PlayerData) ->
    Account = player_data:get_account(PlayerData),
    PubID = player_data:get_pub_id(PlayerData),
    case OldPubID of
	PubID ->
	    sys_msg:send(Account, ?msg_kick_by_pub_host, [AdminName]),
	    Account = player_data:get_account(PlayerData),
	    leave(Account, PubID),
	    %%notify_sync_player_count([], PubID),
	    NPlayerData = player_data:set_pub_id(0, PlayerData),
	    %% 广播某个人被踢
	    MyName = get_name(Account),
	    Message = #notify_sys_msg{code=?msg_channel_kick_someone, params=[AdminName, MyName]},
	    channel_service:broadcast(PubID, Message),

	    {noreply, NPlayerData};
	_ -> %% 不在频道中，或者已经离开频道了
	    {noreply, PlayerData}	    
    end;

%% 请求进入频道
handle_cast({_Msg, #req_enter_pub_channel{pub_id=PubID}}, PlayerData) ->
    Account = player_data:get_account(PlayerData),
    case player_data:get_pub_id(PlayerData) of
	0 ->
	    ok;
	PubID -> 
	    ok;
	OldPubID ->
	    leave(Account, OldPubID),
	    notify_sync_player_count([], OldPubID)	    
    end,

    {Info, Accounts, YYID} = get_pub_info(PubID),
    #pub_info{owner_info=OwnerInfo} = Info,
    #pub_account_info{account=Owner} = OwnerInfo,
    CanEnter =
	case Owner of
	    Account ->
		true;
	    _ ->
		case lists:keymember(Account, #pub_account_info.account, Accounts) of
		    true -> %% 已经在频道中了
			leave(Account, PubID),
			notify_sync_player_count([], PubID),	    
			true;
		    _ ->
			case db_pub_kick_info:can_enter(PubID, Account) of
			    true ->
				%% 判断人数是否满了
				Max2 = common_def:get_val(max_pub_channel_player),
				case length(Accounts) >= Max2 of
				    true -> %% 满了，试着踢人
					case level_kick(Account, 
							lists:keydelete(Owner, #pub_account_info.account, 
									Accounts)) of
					    false ->
						sys_msg:send(Account, ?err_channel_player_full);
					    {true, OutPlayer} ->
						sys_msg:send(OutPlayer, ?msg_kick_by_pub_guest),
						leave(OutPlayer, PubID),

						true					    
					end;
				    _ -> 
					true
				end;
			    _ -> %% 被踢进不了
				S = common_def:get_val(pub_kick_forbid_seconds),
				sys_msg:send(Account, ?err_pub_host_reject_enter, [integer_to_list(S div 60)]),
				false
			end	
		end
	end,

    NPlayerData = 
	case CanEnter of
	    true ->
		do_enter(Account, PubID, Info, Accounts, YYID),
		player_data:set_pub_id(PubID, PlayerData);
	    _ ->
		PlayerData
	end,    
    
    {noreply, NPlayerData};




%% 主播设置语音id
handle_cast({_Msg, #req_update_pub_voice_id{pub_id=PubID, voice_id=YYID}}, PlayerData) ->
    Account = player_data:get_account(PlayerData),
    Ret = 
	case YYID > 0 of
	    true ->
		channel_service:start_announce(Account, PubID, YYID);
	    _ ->
		channel_service:stop_announce(Account, PubID)
	end,
    
    Account = player_data:get_account(PlayerData),
    case Ret of
	{false, _Err} ->  %% 没权限
	    %%sys_msg:send(Account, ?err_not_permission_enter_house);
	    %% 走这里说明客户端有bug
	    ok;
	_ ->	    
	    Message = #notify_update_pub_voice_id{pub_id=PubID, voice_id=YYID},

	    %% Log = atom_to_list(Account) ++ " req_update_pub_voice_id:" ++ integer_to_list(YYID),
	    %% channel_service:broadcast(PubID, [build_log(Log)], [Account]),
	    channel_service:broadcast(PubID, [Message], [Account])
    end,
    {noreply, PlayerData};


%% 频道聊天
handle_cast({_Msg, #req_chat_channel{content=Content, channel_id=PubID}}, PlayerData) ->
    Account = player_data:get_account(PlayerData),
    UserName = get_name(Account),
    Message = #notify_chat_channel{channel_id=PubID,
				   account=atom_to_list(Account), 
				   player_name=UserName, 
				   content=Content},
    channel_service:broadcast(PubID, Message),
    {noreply, PlayerData};
%% 频道列表
handle_cast({_Msg, #req_pub_list{page=Page}}, PlayerData) ->
    Account = player_data:get_account(PlayerData),
    MyChannelID =
	case channel_service:get_channel(Account) of
	    #channel_basic_info{id=ID} ->
		ID;
	    _ ->
	    0
	end,
    {MaxPage, L} = get_pubs(Page),
    Pubs = convert_pubs(L),
    Pack = #notify_pub_list{max_page=MaxPage, 
			    my_channel_id=MyChannelID,
			    pubs=Pubs},

    net_helper:send2client(Account, Pack),
    {noreply, PlayerData}.


%% ====================================================================
%% 内部函数
%% ====================================================================
get_pubs(Page) ->
    Pubs = channel_service:get_channel_list(),
    L = sort_pubs(Pubs),
    get_pub_list(L, Page).

get_pub_list([], _Page) ->
    {1, []};
get_pub_list(Pubs, Page) ->
    Len = length(Pubs),
    PageCount = common_def:get_val(pub_count_per_page), %% 每页显示派对个数
    Start = (Page-1) * PageCount + 1,
    Count = erlang:min(PageCount, Len - Start + 1),
    MaxPage = util:ceil(Len / PageCount),
    case Count > 0 of
	true ->
	    L = lists:sublist(Pubs, Start, Count),
	    {MaxPage, L};
	false -> %% 客户端发过来的页数可能会因为服务器的数据被其他人删除, 导致页数出错, 所以做个校验
	    {MaxPage, []}
    end.

sort_pubs(Pubs) ->
    F = fun(#channel_status_info{basic_info=AInfo, audience_count=ACount}, 
	    #channel_status_info{basic_info=BInfo, audience_count=BCount}) ->
		#channel_basic_info{name=AName} = AInfo,
		#channel_basic_info{name=BName} = BInfo,
		case ACount == BCount of
		    false ->
			AName > BName;
		    true ->
			ACount > BCount
		end
	end,
    lists:sort(F, Pubs).


convert_pubs(L) when is_list(L) ->    
    [convert_pub(X) || X <- L].

convert_pub(#channel_status_info{channel_id=PubID,
				 %%live_status=LiveStatus,
				 extend_room_id=YYID,
				 audiences=Players,
				 audience_count=Count2,
				 basic_info=Info}) ->
				
    #channel_basic_info{name=PubName, admin=Owner} = Info,

    LiveStatus = case lists:member(Owner, Players) of
		     true -> 1;
		     _ -> 0
		 end,

    Max1 = common_def:get_val(max_pub_player),
    Max2 = common_def:get_val(max_pub_channel_player),
    OwnerInfo=#pub_account_info{
      account=Owner,
      level=get_level(Owner),
      name=get_name(Owner)
     },
    #pub_info{pub_id=PubID, owner_info=OwnerInfo, 
	      status=LiveStatus,%%LiveStatus,
	      person_count1=0,%get_scene_player_count(PubID),
	      person_count2=Count2,
	      max_person=Max1 + Max2,
	      admin_list=[],
	      pub_name=PubName, voice_id=YYID}.



get_pub_info(#channel_status_info{extend_room_id=YYID,
				  audiences=Accounts}=X) ->
    PubInfo = convert_pub(X),
    Players = [#pub_account_info{account=Acc, level=get_level(Acc), name=get_name(Acc)} 
     || Acc <- Accounts],
    {PubInfo, Players, YYID}; 
get_pub_info(PubID) when is_integer(PubID) ->
    get_pub_info(channel_service:get_status_info(PubID)).
%%-record(channel_basic_info, {id, name, admin, credit_level}).
%%-record(channel_status_info, {channel_id, basic_info, 
%%         extend_room_id, audiences, audience_count, live_status}).

%% 抽奖
try_win_money(Account, GiftID, GiftCount) when is_atom(Account), is_integer(GiftID) ->
    {Percent, ReturnLoveCoin} = get_gift_win_rate(GiftID),
    Total = 10000,

    %% 每个礼物触发一次
    HitList = lists:filter(fun(X) -> X =< Percent end, 
			   [rand:uniform(Total) || _Count <- lists:seq(1, GiftCount)]),
    Gain = ReturnLoveCoin * length(HitList), 

    case Gain > 0 of
	true -> %% 中奖
	    pay_back_love_coin(Account, Gain);
	_ ->
	    ok
    end.

%% 礼物id 和 物品id 一一对应
get_gift_name(GiftID) when is_integer(GiftID) ->
    item:get_item_name(GiftID).


%% 礼物售价
get_gift_price(GiftID) when is_integer(GiftID) ->
    #yy_gift_tplt{price=Price} = tplt:get_data(yy_gift_tplt, GiftID),
    Price.

%% 收礼折算金额
get_recv_price(GiftID) when is_integer(GiftID) ->
    #yy_gift_tplt{recv_price=Price} = tplt:get_data(yy_gift_tplt, GiftID),
    Price.


%% 中奖机率
get_gift_win_rate(GiftID) when is_integer(GiftID) ->
    #yy_gift_tplt{probability=Rate, back_price=BackPrice} = tplt:get_data(yy_gift_tplt, GiftID),
    {Rate, BackPrice}.

%% 增加爱币
pay_back_love_coin(_Account, 0) ->
    ok;
pay_back_love_coin(Account, N) when N >= 0 ->
    Type = ?order_goods_yy_pay_back, %% 送礼后中奖返还的
    player_love_coin:recharge(Account, Type, N),
    sys_msg:send(Account, ?msg_gain_gift_reward, [integer_to_list(N)]),
    ok.

%% 取玩家等级
get_level(Account) when is_atom(Account) ->
    [BasicData] = db:dirty_read(player_basic_data, Account),
    HouseID = player_basic_data:get_house_id(BasicData),
    [HouseData] = db:dirty_read(house_data, HouseID),
    house_level_exp:get_level(HouseData).

do_add_money(Recver, GiftID, GiftCount, Sender) ->
    Type = ?order_goods_yy_host_recv, %% 收礼

    N = get_recv_price(GiftID) * GiftCount,
    case N > 0 of
	true ->
	    player_love_coin:recharge(Recver, Type, N),
	    Name = get_name(Sender),
	    GiftName = get_gift_name(GiftID),
	    sys_msg:send(Recver, ?msg_recv_yy_gift, [Name, GiftName, integer_to_list(N)]);
	_ ->
	    ok
    end,
    ok.


get_name(Account) when is_atom(Account) ->
    [PlayerBasicData] = db:dirty_read(player_basic_data, Account),
    UserName = player_basic_data:get_username(PlayerBasicData),    
    UserName.

%% 取人数
get_person_count(PubID) when is_integer(PubID) ->
    #channel_status_info{audiences=Accounts} = channel_service:get_status_info(PubID),
    length(Accounts).

%% 通知更新玩家数
notify_sync_player_count(SceneState, PubID) ->
    Count = get_scene_player_count(SceneState, PubID),
    notify_client_player_count(PubID, Count).

notify_client_player_count(PubID, ScenePlayerCount) ->
    ChannelPersonCount = get_person_count(PubID),
    Max1 = common_def:get_val(max_pub_player),
    Max2 = common_def:get_val(max_pub_channel_player),
    Packet =  #notify_update_pub_player_count{
      person_count1= ScenePlayerCount,
      max_count1=Max1,              
      person_count2=ChannelPersonCount,           
      max_count2=Max2},
    channel_service:broadcast(PubID, Packet).
    

do_enter(Account, PubID,  #pub_info{owner_info=OwnerInfo}=Info, 
	 Accounts, YYID) when is_atom(Account),
			      is_list(Accounts),
			      is_integer(YYID) ->
    #pub_account_info{account=Owner} = OwnerInfo, 
    NInfo = 
	case Account of
	    Owner -> 
		Info#pub_info{status=1};
	    _ ->
		Info
	end,

    case (Account == Owner) and (common_def:get_val(host_direct_enter_scene)) of
    	true ->
    	    router:cast(Account, enter_pub_scene, {});
    	_ ->
	    Pack = #notify_enter_pub_channel{info=NInfo, accounts=Accounts},  
	    net_helper:send2client(Account, Pack)
    end,    


    case YYID > 0 of
	true ->
	    Message = #notify_update_pub_voice_id{pub_id=PubID, voice_id=YYID},
	    
	    %% Log = "db read pub_voice_id and notify client:" ++ integer_to_list(YYID),
	    %% net_helper:send2client(Account, build_log(Log)),

	    net_helper:send2client(Account, Message);
	_ ->
	    ok
    end,

    channel_service:enter(Account, PubID),
    AccountInfo = #pub_account_info{account=Account, level=get_level(Account), name=get_name(Account)},
    channel_service:broadcast(PubID,
			      #notify_channel_add_player{channel_id=PubID, 
							 account_info=AccountInfo}),
    notify_sync_player_count([], PubID).

%% 踢比自已等级低的人
%% 返回false 或者 {true, KickPlayer}
level_kick(_Account, []) ->
    false;
level_kick(Account, Accounts) ->
    MyLevel = get_level(Account),
    Levels = [X#pub_account_info.level || X <- Accounts],
    Min = lists:min(Levels),
    case MyLevel > Min of
	true ->
	    #pub_account_info{account=KickPlayer} = lists:keyfind(Min, #pub_account_info.level, Accounts),
	    {true, KickPlayer};
	_ ->
	    false
    end.

do_send_gift(Account, GiftID, GiftCount, Recver, PubID, PlayerData) ->
    ReqGoodsList = [{GiftID, GiftCount, get_gift_price(GiftID)}],

    ShipCallback = 
	fun(#order{status=Status}=_Order)-> 			   
		case (Status =:= ?order_payed) of
		    true ->
			%% 给对方加钱
			do_add_money(Recver, GiftID, GiftCount, Account),

			SenderInfo = #pub_account_info{
			  account=Account,
			  level=get_level(Account),
			  name=get_name(Account)
			 },

			RecverInfo = #pub_account_info{
			  account=Recver,
			  level=get_level(Recver),
			  name=get_name(Recver)
			 },
			channel_service:broadcast(PubID,
						  #broadcast_send_yy_gift{gift_id=GiftID, 
									  recver_info=RecverInfo,
									  gift_count=GiftCount, 
									  sender_info=SenderInfo}),

			%% 触发中奖
			try_win_money(Account, GiftID, GiftCount),
			?pay_shipped; %% 成功发货
		    _ ->
			?pay_error
		end				       
	end,

    Type = ?order_goods_yy_gift,
    player_love_coin:pay(ReqGoodsList, ShipCallback, Type, PlayerData).

%% 判断频道中是否存在玩家
pub_has_player(PubID, Account) when is_atom(Account) ->
    {_Info, Accounts, _YYID} = get_pub_info(PubID),
    lists:keymember(Account, #pub_account_info.account, Accounts).

get_scene_player_count(SceneState, PubID) ->
    SceneName = router:send(scene_manager, active_pub_scene, {PubID}),
    gen_scene:get_player_count(SceneName, SceneState).
    
%% build_log(Log) when is_list(Log) ->
%%     #notify_sys_msg{code=?msg_channel_log, params=[Log]}.






