%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%%
%%% @end
%%% Created : 17 May 2012 by LinZhengJian <linzhj@35info.cn>

-module(item_add_item).


-compile(export_all).

can_use_item(_Owner, _Targets, _HouseData, _Item, _ItemTplt, _PlayerData) ->
    true.

use_item({Account, _Targets, HouseData, _Item, _ItemTplt, _PlayerData}, Items) ->
    {HouseData1, Msgs} = house_pack:add_items(Items, HouseData),
    ItemMsgs = [{sys_msg, send, [Account, 553, [Count, item:get_item_name(ItemID)]]} || {ItemID, Count} <- Items],
    MessageList = house_lover_package:build_msgs(Msgs, HouseData1),
    {ok, HouseData1, [{net_helper, send2client ,[Target, Message]} || {Target, Message} <- MessageList] ++ ItemMsgs}.
