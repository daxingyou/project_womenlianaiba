%%%-------------------------------------------------------------------
%%% @author linyijie <linyj@35info.cn>
%%% @copyright (C) 2012, linyijie
%%% @doc
%%%  ����ҩ��, ���տ�
%%% @end
%%% Created : 17 Sep 2012 by linyijie <linyj@35info.cn>
%%%-------------------------------------------------------------------
-module(item_increase_fruit).

-export([can_use_item/6, use_item/2]).

can_use_item(_Owner, _Targets, _HouseData, _Item, _ItemTplt, _PlayerData) ->
    true.

%% ģ�����Ĳ�����д���ǹ�ʵ���ӵı���
use_item({Account, _Targets, HouseData, _Item, _ItemTplt, _PlayerData}, BuffID) ->
    Lover = house:get_lover(Account, HouseData),
    farm:increase_fruit(Account, Lover, BuffID),
    {ok, HouseData, []}.
