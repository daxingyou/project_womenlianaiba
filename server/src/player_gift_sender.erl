%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% �������-���ͷ�
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
%% �Ƿ���Է�������
%% 1.�ж��Ƿ���Է�������
%% 2.�жϽ��շ�ʱ�򳬹��ɽ������ ���������ʾ�ͻ���
%% 3.�жϽ���Ƿ��㹻֧������У� ����в�����Ϊ��
%% 4.�ж������Ƿ�Ϊ�գ������������ô�����Ƿ�����ڰ�����
can_send_gift(Account, ReceiverPlayerGift, HouseData, Gift) ->
    Item = player_gift_data:get_gift(Gift),
    Receiver = player_gift_data:get_receiver(Gift),
    Sender = player_gift_data:get_sender(Gift),
    Account = Sender, %% ��������߲����Լ���ֱ�����쳣
    try
	can_receive(Receiver, ReceiverPlayerGift),
	money_is_enough(HouseData, Gift),
	item_is_empty(Item),
	item_is_bind(Item)
    catch
	throw:Error ->
	    Error
    end.

%% ����һ������
create_gift(Gift, Item) ->
    GiftId = guid:make(?st_gift),
    Gift#gift_info{gift_id=GiftId, date=datetime:localtime(), gift=Item}.

%% ��������
%% 1.�۳���Ǯ�� 2.�۳���Ʒ
send(Gift, HouseData) ->
    %% BoxPrice = get_box_price(Gift),
    GiftItem = player_gift_data:get_gift(Gift),
    %% NHouseData = house_diamond:dec_diamond(BoxPrice, HouseData),
    HouseLoverPackage = house_lover_package:get_lover_package(HouseData),
    {NHouseLoverPackage, PackMsgs} = house_lover_package:del_items([GiftItem], HouseLoverPackage),
    {house_lover_package:set_lover_package(NHouseLoverPackage, HouseData), PackMsgs}.

%% ���ӷ����ߵķ����б�
add_sender_list(SenderPlayerGift, Gift) ->
    Sender = player_gift_data:get_sender(Gift),
    SenderList = player_gift_data:get_send_list(Sender, SenderPlayerGift),
    NSenderList = player_gift_data:set_gift_list(SenderList, Gift),
    player_gift_data:set_send_list(SenderPlayerGift, Sender, NSenderList).

%% ���ӽ����ߵĽ����б�
add_receive_list(ReceiverPlayerGift, Gift) ->
    Receiver = player_gift_data:get_receiver(Gift),
    ReceiveList = player_gift_data:get_receive_list(Receiver, ReceiverPlayerGift),
    NReceiveList = [Gift|ReceiveList],
    player_gift_data:set_receive_list(ReceiverPlayerGift, Receiver, NReceiveList).
%%%===================================================================
%%% Internal functions
%%%===================================================================

%% �жϷ��ͷ��ܷ�������
%% 1.�ж����ϵ�Ǯ�Ƿ�����֧�����
money_is_enough(HouseData, Gift) ->
    BoxPrice = get_box_price(Gift),
    Money = house_diamond:get_lover_diamond(HouseData),
    case Money >= BoxPrice of
	true ->
	    true;
	false ->
	    throw({false, not_enough_money})
    end.

%% �жϸ���Ʒ�Ƿ���Ա�����
%% 1.�ж���Ʒ�Ƿ�Ϊ�գ�2.�ж���Ʒ�Ƿ���ڰ�����
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
    %% GiftBoxTplt#gift_box_tplt.type == ?mt_love_coin. %% ����Ǹ�������

%% ��ȡ����м۸�
get_box_price(Gift) ->
    GiftBox = player_gift_data:get_gift_box(Gift),
    GiftBoxTplt = tplt:get_data(gift_box_tplt, GiftBox),
    GiftBoxTplt#gift_box_tplt.price.

%% �ж��Ƿ���Խ�������
%% Receiver:������, PlayerGift:�����ߵ�����ṹ
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
