%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% 玩家礼物-接收者
%%% @end
%%% Created : 12 Mar 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(player_gift_receiver).

-include("player_gift.hrl").
-include("tplt_def.hrl").

%% API
-export([receive_gift/4]).

%%%===================================================================
%%% API
%%%===================================================================
receive_gift(Receiver, PlayerGift, HouseData, GiftIds) ->
    do_receive_gift(Receiver, PlayerGift, HouseData, GiftIds, [], []).
	
%%%===================================================================
%%% Internal functions
%%%===================================================================
do_receive_gift(_Receiver, PlayerGift, HouseData, [], Gifts, PackMsgs) ->
    {Gifts, PlayerGift, HouseData, PackMsgs};
do_receive_gift(Receiver, PlayerGift, HouseData, [GiftId|GiftIds], Gifts, PackMsgs) ->
    ReceiveList = player_gift_data:get_receive_list(Receiver, PlayerGift),
    ReceivedList = player_gift_data:get_received_list(Receiver, PlayerGift),
    Gift = lists:keyfind(GiftId, 2, ReceiveList),
    case can_receive(Gift) of
	true ->
	    NReceiveList = lists:delete(Gift, ReceiveList),
	    NReceivedList = player_gift_data:set_gift_list(ReceivedList, Gift),
	    NPlayerGift = player_gift_data:set_receive_list(PlayerGift, Receiver, NReceiveList),
	    NNPlayerGift = player_gift_data:set_received_list(NPlayerGift, Receiver, NReceivedList),
	    GiftItem = player_gift_data:get_gift(Gift),

	    ItemTempID = item:get_tempid(GiftItem),
	    #item_tplt{overlap=Overlap} = tplt:get_data2(item_tplt, ItemTempID),

	    %% 根据时效组织物品数据
	    ItemData = case Overlap == 1 of %% 如果没叠加，整物品复制
	    		   true -> GiftItem;
	    		   _ -> item:get_tempid(GiftItem)
	    	       end,
	    
	    ItemCount = 1,
	    ItemList = [{ItemData, ItemCount}],
	    {NHouseData, Msgs} = house_pack:add_items(ItemList, HouseData),
	    do_receive_gift(Receiver, NNPlayerGift, NHouseData, GiftIds, 
			    [Gift|Gifts], PackMsgs ++ Msgs);
	false ->
	    do_receive_gift(Receiver, PlayerGift, HouseData, GiftIds, Gifts, PackMsgs)
    end.

can_receive(Gift) ->
    case Gift of
	false ->
	    false;
	_ ->
	    true
    end.
