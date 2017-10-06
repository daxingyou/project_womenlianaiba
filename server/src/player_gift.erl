%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% 礼物系统
%%% @end
%%% Created :  8 Mar 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(player_gift).

-include("packet_def.hrl").
-include("router.hrl").
-include("common_def.hrl").
-include("enum_def.hrl").
-include("player_data.hrl").
-include("sys_msg.hrl").
-include("player_gift.hrl").
-include("house_data.hrl").
-include("resource.hrl").
-include("records.hrl").

-export([handle_cast/2]).
-export([init/2, start/1, merge/3, get_player_gift/1]).
%% API

%%%===================================================================
%%% API
%%%===================================================================
%% 注册需要的事件
%% Account:玩家帐号
start(Account) ->
    [router:make_event_source(?msg_req_send_gift, Account, {self(), ?MODULE}),
     router:make_event_source(?msg_req_house_gift_box_list, Account, {self(), ?MODULE}),
     router:make_event_source(?msg_req_receive_gift, Account, {self(), ?MODULE}),
     router:make_event_source(?msg_req_receive_gift_list, Account, {self(), ?MODULE}),
     router:make_event_source(?msg_req_received_gift_list, Account, {self(), ?MODULE})
    ].

%% 玩家进入房屋后，初始化玩家房屋的礼物
init(Account, HouseData) when is_record(HouseData, house_data) ->
    PlayerGift = get_player_gift(HouseData),
    Boy = house_data:get_boy(HouseData),
    Girl = house_data:get_girl(HouseData),
    BoyBoxes = player_gift_data:get_boy_receive_box_info(PlayerGift), 
    GirlBoxes = player_gift_data:get_girl_receive_box_info(PlayerGift),
    net_helper:send2client(Account, #notify_house_gift_box_list{boy=Boy, girl=Girl, boy_boxes=BoyBoxes, girl_boxes=GirlBoxes}).

%% 合并礼物数据
%% HouseId:新的房屋Id, BoyPlayerGift:男主人的礼物, GirlPlayerGift:女主人的礼物
merge(HouseId, BoyPlayerGift, GirlPlayerGift) ->
    Boy = player_gift_data:get_boy(BoyPlayerGift),
    Girl = player_gift_data:get_girl(GirlPlayerGift),
    #player_gift{house_id=HouseId, boy=Boy, girl=Girl}.

get_player_gift(HouseId) when is_integer(HouseId) ->
    case db:dirty_read(player_gift, HouseId) of
	[] ->
	    [HouseData] = db:dirty_read(house_data, HouseId),
	    Boy = house_data:get_boy(HouseData),
	    Girl = house_data:get_girl(HouseData),
	    BoyGiftList = #gift_list{account=Boy},
	    GirlGiftList = #gift_list{account=Girl},
	    #player_gift{house_id=HouseId, boy=BoyGiftList, girl=GirlGiftList};
	[PlayerGift] ->
	    PlayerGift
    end;
get_player_gift(HouseData) when is_record(HouseData, house_data) ->
    HouseId = house_data:get_house_id(HouseData),
    case db:dirty_read(player_gift, HouseId) of
	[] ->
	    Boy = house_data:get_boy(HouseData),
	    Girl = house_data:get_girl(HouseData),
	    BoyGiftList = #gift_list{account=Boy},
	    GirlGiftList = #gift_list{account=Girl},
	    #player_gift{house_id=HouseId, boy=BoyGiftList, girl=GirlGiftList};
	[PlayerGift] ->
	    PlayerGift
    end.
%%%===================================================================
%%% Handle Cast
%%%===================================================================
%% 发送礼物
handle_cast({#msg{src=Account}, #req_send_gift{gift=Gift}}, State) ->

    case player_gift_sender:is_qcoin_box(Gift) of
	true ->
	    QCoin = player_gift_sender:get_box_price(Gift),
	    GiftBox = player_gift_data:get_gift_box(Gift),
	    %% 组织回调函数
	    ShipCallback = 
		fun(#order{status=Status}=_Order) ->
			case (Status =:= ?order_payed) of
			    true ->
				F = build_send_gift(Account, Gift),
				Result = db:transaction(F),
				notify(Account, Result, State),
				?pay_shipped;
			    _ ->
				?pay_error
			end				       
		end,
	    player_love_coin:pay([{GiftBox, 1, QCoin}], ShipCallback, ?order_goods_meta_gift, State);
	false ->
	    F = build_send_gift(Account, Gift),
	    Result = db:transaction(F),
	    notify(Account, Result, State)
    end,
    {noreply, State};
handle_cast({#msg{src=Account}, #req_house_gift_box_list{account=TargetAccount}}, State) ->
    [PlayerBasicData] = db:dirty_read(player_basic_data, TargetAccount),
    HouseId = player_basic_data:get_house_id(PlayerBasicData),
    [HouseData] = db:dirty_read(house_data, HouseId),
    init(Account, HouseData),
    {noreply, State};
%% 接收礼物
handle_cast({#msg{src=Account}, #req_receive_gift{gift_ids=GiftIds}}, State) ->
    F = build_receive_gift(Account, GiftIds),   
    case db:transaction(F) of
	{Gifts, HouseId, PackMsgs} ->
	    Lover = player_data:get_lover(State),
	    SceneName = house:get_house_name(HouseId),
	    net_helper:send2client(Account, #notify_receive_gift{type=?nsgt_ok}),
	    HouseGiftInfos = player_gift_data:build_house_gift_info(Gifts, []),
	    house_lover_package:send_msgs(PackMsgs, Account, Lover),
	    router:cast(undefined, SceneName, broadcast_all_players, #notify_del_house_gift_box{account=Account, boxes=HouseGiftInfos})
    end,
    {noreply, State};
%% 请求未接收礼物列表
handle_cast({#msg{src=Account}, #req_receive_gift_list{}}, State) ->
    [PlayerBasicData] = db:dirty_read(player_basic_data, Account),
    HouseId = player_basic_data:get_house_id(PlayerBasicData),
    PlayerGift = get_player_gift(HouseId),
    ReceiveList = player_gift_data:get_receive_list(Account, PlayerGift),
    net_helper:send2client(Account, #notify_receive_gift_list{gift=ReceiveList}),
    {noreply, State};
%% 请求已接收礼物列表
handle_cast({#msg{src=Account}, #req_received_gift_list{}}, State) ->
    [PlayerBasicData] = db:dirty_read(player_basic_data, Account),
    HouseId = player_basic_data:get_house_id(PlayerBasicData),
    PlayerGift = get_player_gift(HouseId),
    ReceivedList = player_gift_data:get_received_list(Account, PlayerGift),
    net_helper:send2client(Account, #notify_received_gift_list{gift=ReceivedList}),
    {noreply, State}.
%%%===================================================================
%%% Internal functions
%%%===================================================================
build_send_gift(Account, Gift) ->
    fun() ->
	    Receiver = player_gift_data:get_receiver(Gift),
	    case db:read(player_basic_data, Receiver) of
		[] ->
		    {false, receiver_is_empty};
		[ReceiverPlayerBasicData] ->
		    ReceiverHouseId = player_basic_data:get_house_id(ReceiverPlayerBasicData),
		    [SenderPlayerBasicData] = db:read(player_basic_data, Account),
		    SenderHouseId = player_basic_data:get_house_id(SenderPlayerBasicData),
		    ReceiverPlayerGift = get_player_gift(ReceiverHouseId),
		    SenderPlayerGift = get_player_gift(SenderHouseId),
		    [SenderHouseData] = db:read(house_data, SenderHouseId),
		    [PlayerStat] = db:read(player_stat, Receiver),
		    GiftItem = player_gift_data:get_gift(Gift),
		    InstId = item:get_instid(GiftItem),
		    case house_pack:get_item(InstId, SenderHouseData) of
			{false, _Reason} ->
			    {false, not_exist_item};
			Item ->
			    NGift = player_gift_sender:create_gift(Gift, Item),
			    case player_gift_sender:can_send_gift(Account, ReceiverPlayerGift, SenderHouseData, NGift) of
				true ->
				    {NSenderHouseData, PackMsgs} = player_gift_sender:send(NGift, SenderHouseData),
				    NSenderPlayerGift = player_gift_sender:add_sender_list(SenderPlayerGift, NGift),
				    NReceiverPlayerGift = player_gift_sender:add_receive_list(ReceiverPlayerGift, NGift),
				    NPlayerStat = player_stat:add_gift(PlayerStat),
				    db:write(NSenderHouseData),
				    db:write(NSenderPlayerGift),
				    db:write(NReceiverPlayerGift),
				    db:write(NPlayerStat),
				    %% 添加亲密度		
				    player_intimate:add_player_intimate(Account, player_basic_data:get_account(ReceiverPlayerBasicData), common_def:get_val(intimate_of_gift)),
				    {NGift, NReceiverPlayerGift, NSenderHouseData, PackMsgs};
				Reason ->
				    Reason
			    end
		    end
	    end
    end.

%% 通知客户端
notify(Account, Result, _State) ->
    case Result of
	{false, not_exist_item} -> %% 物品不存在
	    sys_msg:send(Account, ?err_not_exist_item);
	{false, item_is_empty} -> %% 玩家没有选择物品
	    sys_msg:send(Account, ?err_item_is_empty);
	{false, not_enough_money} -> %% 没有足够的钱
	    sys_msg:send(Account, ?err_not_engouth_diamond);
	{false, exceed_max_receive} -> %% 超过最大接收数
	    sys_msg:send(Account, ?err_exceed_max_receive);
	{false, item_not_gift} -> %% 物品不能当礼物送
	    sys_msg:send(Account, ?err_item_not_gift);
	{false, item_overdue} -> %% 物品过期
	    sys_msg:send(Account, ?err_item_overdue);
	{false, receiver_is_empty} -> %%玩家没有创建帐号
	    sys_msg:send(Account, ?err_player_is_empty);
	{Gift, ReceiverPlayerGift, HouseData, PackMsgs} ->
	    GiftItem = player_gift_data:get_gift(Gift),
	    Sender = player_gift_data:get_sender(Gift),
	    Receiver = player_gift_data:get_receiver(Gift),
	    GiftId = player_gift_data:get_gift_id(Gift),
	    GiftBox = player_gift_data:get_gift_box(Gift),
	    Date = player_gift_data:get_date(Gift),
	    HouseGiftInfo = player_gift_data:build_house_gift_info(GiftId, GiftBox, Date),
	    ReceiverHouseId = player_gift_data:get_house_id(ReceiverPlayerGift),
	    item_money_log:log_send_gift(Sender, Receiver, GiftItem),
	    SceneName = house:get_house_name(ReceiverHouseId),
	    house:broadcast(SceneName, #notify_add_house_gift_box{account=Receiver, boxes=[HouseGiftInfo]}),
	    house_diamond:notify(HouseData),
	    house_pack:send_msgs(PackMsgs, HouseData),
	    net_helper:send2client(Account, #notify_send_gift{type=?nsgt_ok})
    end.

build_receive_gift(Account, GiftIds) ->
    fun() ->
	    [PlayerBasicData] = db:read(player_basic_data, Account),
	    HouseId = player_basic_data:get_house_id(PlayerBasicData),
	    PlayerGift = get_player_gift(HouseId),
	    [HouseData] = db:read(house_data, HouseId),
	    {Gifts, NPlayerGift, NHouseData, PackMsgs}=
		player_gift_receiver:receive_gift(Account, PlayerGift, HouseData, GiftIds),
	    db:write(NHouseData),
	    db:write(NPlayerGift),
	    {Gifts, HouseId, PackMsgs}
    end.
%%%===================================================================
%%% Test Case
%%%===================================================================
-ifdef(TEST).
-include_lib("eunit/include/eunit.hrl").

merge_test() ->
    HouseId = aaa,
    BoyPlayerGift = #player_gift{house_id=dd, boy=#gift_list{account=a,send_list=[]}, girl=#gift_list{}},
    GirlPlayerGift = #player_gift{house_id=cc, boy=#gift_list{}, girl=#gift_list{account=b,send_list=[]}},
    ?assertEqual(#player_gift{house_id=aaa, boy=#gift_list{account=a,send_list=[]}, girl=#gift_list{account=b,send_list=[]}}, merge(HouseId, BoyPlayerGift, GirlPlayerGift)).
-endif.
