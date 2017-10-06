%%% @author linyb
%%% @copyright (C) 2012, 35
%%% @doc
%%%
%%% @end
%%% Created : 

-module(item_add_point).


-compile(export_all).

can_use_item(_Owner, _Targets, _HouseData, _Item, _ItemTplt, _PlayerData) ->
    true.

use_item({Account, _Targets, HouseData, _Item, _ItemTplt, _PlayerData}, Point) ->
    party_coin:add(Account, Point),
    {ok, HouseData, [{party_coin, send2client, [Account, Point]}]}.
