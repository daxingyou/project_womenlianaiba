%%%-------------------------------------------------------------------
%%% @author linyijie <linyj@35info.cn>
%%% @copyright (C) 2013, linyijie
%%% @doc
%%%  ŒÔ∆∑±¶œ‰
%%% @end
%%% Created :  7 Apr 2013 by linyijie <linyj@35info.cn>
%%%-------------------------------------------------------------------
-module(item_treasure).
-include("sys_msg.hrl").

-export([can_use_item/6, use_item/2]).

can_use_item(_Owner, _Targets, _HouseData, _Item, _ItemTplt, _PlayerData) ->
    true.

%% Items = [{ItemID, MinCount, MaxCount} | ...]
use_item({Account, _Targets, HouseData, _Item, _ItemTplt, _PlayerData}, Items) ->
    {ItemID, Count} = random_get_item(Items),
    {HouseData1, ItemMsgs} = house_pack:add_items([{ItemID, Count}], HouseData),
    ItemName = item:get_item_name(ItemID),
    {ok, HouseData1, [{sys_msg, send,[Account, ?msg_add_item, [Count, ItemName]]}, 
		      {house_pack, send_msgs, [ItemMsgs, HouseData1]}]}.

random_get_item(Items) ->
    Index = rand:uniform(length(Items)),
    {ItemID, Min, Max} = lists:nth(Index, Items),
    Count = rand:uniform(Min, Max),
    {ItemID, Count}.
