
%%% @author wujd <wujd@35info.com>
%%% @copyright (C) 2013, wujd
%%% @doc
%%% 道具-增加豪华度
%%% @end
%%% Created : 26 Jul 2013 by wujd <wujd@35info.com>

-module(item_add_decoration).

-include("tplt_def.hrl").
-include("packet_def.hrl").

-export([can_use_item/6, use_item/2]).

can_use_item(_Ower, _Targets, _HouseData, _Item, _ItemTplt, _PlayerData) ->
    true.

use_item({Account, _Targets, HouseData, _Item, _ItemTplt, _PlayerData}, BuffID) ->
    player_buff:add_buff(Account, BuffID),
  
    %% 通知豪华度变更
    Decoration = house_data:get_decoration(HouseData),
    Packet = #notify_change_furnitures{decoration=Decoration},
    net_helper:send2client(Account, Packet),
    {ok, HouseData, []}.
