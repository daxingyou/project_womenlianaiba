%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% 道具-增加水晶
%%% @end
%%% Created : 18 May 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(item_add_diamond).

-export([can_use_item/6, use_item/2]).

can_use_item(_Owner, _Targets, _HouseData, _Item, _ItemTplt, _PlayerData) ->
    true.

%% 模板表里只要填模块名和参数这两列即可， 参数只要填写除第一个元组以外的参数
%% 增加水晶
use_item({_Account, _Targets, HouseData, _Item, _ItemTplt, _PlayerData}, AddDiamond) ->
    NHouseData = house_diamond:add_diamond(AddDiamond, HouseData),
    {ok, NHouseData, [{house_diamond, notify, [NHouseData]}]}.
