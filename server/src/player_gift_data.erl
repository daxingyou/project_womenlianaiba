%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% 
%%% @end
%%% Created : 12 Mar 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(player_gift_data).

-include("player_gift.hrl").
-include("packet_def.hrl").

-define(MaxCount, 200).

%% API
-compile(export_all).

%%%===================================================================
%%% API
%%%===================================================================
get_house_id(#player_gift{house_id=HouseId}) ->
    HouseId.
set_house_id(PlayerGift, HouseId) ->
    PlayerGift#player_gift{house_id=HouseId}.

get_boy(#player_gift{boy=Boy}) ->
    Boy.
set_boy(PlayerGift, Boy) ->
    PlayerGift#player_gift{boy=Boy}.

get_girl(#player_gift{girl=Girl}) ->
    Girl.
set_girl(PlayerGift, Girl) ->
    PlayerGift#player_gift{girl=Girl}.

get_send_list(Account, #player_gift{boy=#gift_list{account=Account, send_list=SendList}}) ->
    SendList;
get_send_list(Account, #player_gift{girl=#gift_list{account=Account, send_list=SendList}}) ->
    SendList.
set_send_list(#player_gift{boy=#gift_list{account=Account}}=PlayerGift, Account, SendList) ->
    Boy = get_boy(PlayerGift),
    NBoy = Boy#gift_list{send_list=SendList},
    set_boy(PlayerGift, NBoy);
set_send_list(#player_gift{girl=#gift_list{account=Account}}=PlayerGift, Account, SendList) ->
    Girl = get_girl(PlayerGift),
    NGirl = Girl#gift_list{send_list=SendList},
    set_girl(PlayerGift, NGirl).

get_receive_list_qty(PlayerGift) ->
    BoyReceiveList = PlayerGift#player_gift.boy#gift_list.receive_list,
    GirlReceiveList = PlayerGift#player_gift.girl#gift_list.receive_list,
    length(BoyReceiveList) + length(GirlReceiveList).

get_boy_receive_box_info(PlayerGift) ->
    ReceiveList = PlayerGift#player_gift.boy#gift_list.receive_list,
    build_house_gift(ReceiveList, []).

get_girl_receive_box_info(PlayerGift) ->
    ReceiveList = PlayerGift#player_gift.girl#gift_list.receive_list,
    build_house_gift(ReceiveList, []).

build_house_gift([], HouseGiftInfos) ->
    lists:reverse(HouseGiftInfos);
build_house_gift([#gift_info{gift_id=GiftId, gift_box=GiftBox, date=Date}|GiftInfos], HouseGiftInfos) ->
    HouseGiftInfo = build_house_gift_info(GiftId, GiftBox, Date),
    build_house_gift(GiftInfos, [HouseGiftInfo|HouseGiftInfos]).

build_house_gift_info([], HouseGiftInfos) ->
    HouseGiftInfos;
build_house_gift_info([#gift_info{gift_id=GiftId, gift_box=GiftBox, date=Date}|GiftInfos], HouseGiftInfos) ->
    HouseGiftInfo = build_house_gift_info(GiftId, GiftBox, Date),
    build_house_gift_info(GiftInfos, [HouseGiftInfo|HouseGiftInfos]).

build_house_gift_info(GiftId, GiftBox, Date) ->
    #house_gift_info{gift_id=GiftId, gift_box=GiftBox, date=Date}.

get_receive_list(Account, #player_gift{boy=#gift_list{account=Account, receive_list=ReceiveList}}) ->
    ReceiveList;
get_receive_list(Account, #player_gift{girl=#gift_list{account=Account, receive_list=ReceiveList}}) ->
    ReceiveList.
set_receive_list(#player_gift{boy=#gift_list{account=Account}}=PlayerGift, Account, ReceiveList) ->
    Boy = get_boy(PlayerGift),
    NBoy = Boy#gift_list{receive_list=ReceiveList},
    set_boy(PlayerGift, NBoy);
set_receive_list(#player_gift{girl=#gift_list{account=Account}}=PlayerGift, Account, ReceiveList) ->
    Girl = get_girl(PlayerGift),
    NGirl = Girl#gift_list{receive_list=ReceiveList},
    set_girl(PlayerGift, NGirl).

get_received_list(Account, #player_gift{boy=#gift_list{account=Account, received_list=ReceivedList}}) ->
    ReceivedList;
get_received_list(Account, #player_gift{girl=#gift_list{account=Account, received_list=ReceivedList}}) ->
    ReceivedList.
set_received_list(#player_gift{boy=#gift_list{account=Account}}=PlayerGift, Account, ReceivedList) ->
    Boy = get_boy(PlayerGift),
    NBoy = Boy#gift_list{received_list=ReceivedList},
    set_boy(PlayerGift, NBoy);
set_received_list(#player_gift{girl=#gift_list{account=Account}}=PlayerGift, Account, ReceivedList) ->
    Girl = get_girl(PlayerGift),
    NGirl = Girl#gift_list{received_list=ReceivedList},
    set_girl(PlayerGift, NGirl).

get_gift_id(#gift_info{gift_id=GiftId}) ->
    GiftId.

get_date(#gift_info{date=Date}) ->
    Date.

get_receiver(#gift_info{receiver=Receiver}) ->
    case is_list(Receiver) of
	true ->
	    list_to_atom(Receiver);
	false ->
	    Receiver
    end.

get_sender(#gift_info{sender=Sender}) ->
    case is_list(Sender) of
	true ->
	    list_to_atom(Sender);
	false ->
	    Sender
    end.

get_gift_box(#gift_info{gift_box=GiftBox}) ->
    GiftBox.

get_gift(#gift_info{gift=Gift}) ->
    Gift.

set_gift_list(List, Gift) ->
    case length(List) >= ?MaxCount of
	true ->
	    [Gift|lists:sublist(List, 1, ?MaxCount -1)];
	false ->    
	    [Gift|List]
    end.
%%%===================================================================
%%% Test Case
%%%===================================================================
-ifdef(TEST).
-include_lib("eunit/include/eunit.hrl").

-endif.
