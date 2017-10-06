%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% ����-����ˮ��
%%% @end
%%% Created : 18 May 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(item_add_diamond).

-export([can_use_item/6, use_item/2]).

can_use_item(_Owner, _Targets, _HouseData, _Item, _ItemTplt, _PlayerData) ->
    true.

%% ģ�����ֻҪ��ģ�����Ͳ��������м��ɣ� ����ֻҪ��д����һ��Ԫ������Ĳ���
%% ����ˮ��
use_item({_Account, _Targets, HouseData, _Item, _ItemTplt, _PlayerData}, AddDiamond) ->
    NHouseData = house_diamond:add_diamond(AddDiamond, HouseData),
    {ok, NHouseData, [{house_diamond, notify, [NHouseData]}]}.
