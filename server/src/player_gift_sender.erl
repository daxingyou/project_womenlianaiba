%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% 玩家礼物-发送方
%%% @end
%%% Created : 12 Mar 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(player_gift_sender).

-include("common_def.hrl").
-include("packet_def.hrl").
-include("tplt_def.hrl").
-include("player_gift.hrl").
-include("enum_def.hrl").

-define(MaxReceive, 500).
%% API
-export([can_send_gift/4, create_gift/2, send/2, add_sender_list/2, add_receive_list/2]).
-export([is_qcoin_box/1, get_box_price/1]).

%%%===================================================================
%%% API
%%%===================================================================
%% 是否可以发送礼物
%% 1.判断是否可以发送礼物
%% 2.判断接收方时候超过可接收礼物， 如果超过提示客户端
%% 3.判断金币是否足够支付礼物盒， 礼物盒不允许为空
%% 4.判断礼物是否为空，如果有礼物那么礼物是否存在于包裹中
can_send_gift(Account, ReceiverPlayerGift, HouseData, Gift) ->
    Item = player_gift_data:get_gift(Gift),
    Receiver = player_gift_data:get_receiver(Gift),
    Sender = player_gift_data:get_sender(Gift),
    Account = Sender, %% 如果发送者不是自己则直接抛异常
    try
	can_receive(Receiver, ReceiverPlayerGift),
	money_is_enough(HouseData, Gift),
	item_is_empty(Item),
	item_is_bind(Item)
    catch
	throw:Error ->
	    Error
    end.

%% 创建一个礼物
create_gift(Gift, Item) ->
    GiftId = guid:make(?st_gift),
    Gift#gift_info{gift_id=GiftId, date=datetime:localtime(), gift=Item}.

%% 发送礼物
%% 1.扣除金钱， 2.扣除物品
send(Gift, HouseData) ->
    %% BoxPrice = get_box_price(Gift),
    GiftItem = player_gift_data:get_gift(Gift),
    %% NHouseData = house_diamond:dec_diamond(BoxPrice, HouseData),
    HouseLoverPackage = house_lover_package:get_lover_package(HouseData),
    {NHouseLoverPackage, PackMsgs} = house_lover_package:del_items([GiftItem], HouseLoverPackage),
    {house_lover_package:set_lover_package(NHouseLoverPackage, HouseData), PackMsgs}.

%% 增加发送者的发送列表
add_sender_list(SenderPlayerGift, Gift) ->
    Sender = player_gift_data:get_sender(Gift),
    SenderList = player_gift_data:get_send_list(Sender, SenderPlayerGift),
    NSenderList = player_gift_data:set_gift_list(SenderList, Gift),
    player_gift_data:set_send_list(SenderPlayerGift, Sender, NSenderList).

%% 增加接收者的接收列表
add_receive_list(ReceiverPlayerGift, Gift) ->
    Receiver = player_gift_data:get_receiver(Gift),
    ReceiveList = player_gift_data:get_receive_list(Receiver, ReceiverPlayerGift),
    NReceiveList = [Gift|ReceiveList],
    player_gift_data:set_receive_list(ReceiverPlayerGift, Receiver, NReceiveList).
%%%===================================================================
%%% Internal functions
%%%===================================================================

%% 判断发送方能否发送礼物
%% 1.判断身上的钱是否足以支付礼盒
money_is_enough(HouseData, Gift) ->
    BoxPrice = get_box_price(Gift),
    Money = house_diamond:get_lover_diamond(HouseData),
    case Money >= BoxPrice of
	true ->
	    true;
	false ->
	    throw({false, not_enough_money})
    end.

%% 判断该物品是否可以被发送
%% 1.判断物品是否为空，2.判断物品是否存在包裹中
item_is_empty(Item) ->
        case item:is_empty(Item) of
	true ->
	    throw({false, item_is_empty});
	false ->
	    true
    end.

item_is_bind(Item) ->
    case item:is_bind(Item) of
	true ->
	    throw({false, item_not_gift});
	_ ->
	    true
    end.


is_qcoin_box(_Gift) ->
    %% GiftBox = player_gift_data:get_gift_box(Gift),
    %% GiftBoxTplt = tplt:get_data(gift_box_tplt, GiftBox),
    true.
    %% GiftBoxTplt#gift_box_tplt.type == ?mt_love_coin. %% 如果是付费类型

%% 获取礼物盒价格
get_box_price(Gift) ->
    GiftBox = player_gift_data:get_gift_box(Gift),
    GiftBoxTplt = tplt:get_data(gift_box_tplt, GiftBox),
    GiftBoxTplt#gift_box_tplt.price.

%% 判断是否可以接收礼物
%% Receiver:接收者, PlayerGift:接收者的礼物结构
can_receive(Receiver, PlayerGift) when is_record(PlayerGift, player_gift) ->
    ReceiveList = player_gift_data:get_receive_list(Receiver, PlayerGift),
    case length(ReceiveList) =< ?MaxReceive of
	true ->
	    true;
	false ->
	    throw({false, exceed_max_receive})
    end.
%%%===================================================================
%%% Test Case
%%%===================================================================
-ifdef(TEST).
-include_lib("eunit/include/eunit.hrl").
add_receive_list_test() ->
    Gift = #gift_info{sender=a, receiver=b},
    PlayerGift = #player_gift{house_id=aaa, boy=#gift_list{account=a,receive_list=[]}, girl=#gift_list{account=b, receive_list=[]}},
    ?assertEqual(#player_gift{house_id=aaa, boy=#gift_list{account=a,receive_list=[]}, girl=#gift_list{account=b, receive_list=[#gift_info{sender=a, receiver=b}]}}, add_receive_list(PlayerGift, Gift)).

add_sender_list_test() ->
    Gift = #gift_info{sender=a, receiver=b},
    PlayerGift = #player_gift{house_id=aaa, boy=#gift_list{account=a,send_list=[]}, girl=#gift_list{account=b, send_list=[]}},
    ?assertEqual(#player_gift{house_id=aaa, boy=#gift_list{account=a,send_list=[#gift_info{sender=a, receiver=b}]}, girl=#gift_list{account=b, send_list=[]}}, add_sender_list(PlayerGift, Gift)).
-endif.
