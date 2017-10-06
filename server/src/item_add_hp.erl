%%%-------------------------------------------------------------------
%%% @author lyj <lyj@35info.cn>
%%% @copyright (C) 2012, lyj
%%% @doc
%%%  增加体力的物品
%%% @end
%%% Created : 15 May 2012 by lyj <lyj@35info.cn>
%%%-------------------------------------------------------------------
-module(item_add_hp).

-export([can_use_item/6, use_item/2]).

can_use_item(_Owner, _Targets, _HouseData, _Item, _ItemTplt, _PlayerData) ->
    true.

%% 模板表里只要填模块名和参数这两列即可， 参数只要填写除第一个元组以外的参数
%% 比如要使用这个物品， 只要填写item_add_hp 和 10 就可以了
%% 增加体力
use_item({Account,_,_,_,_,_}, AddHp) ->
    F = fun(BasicData, HouseData) ->
    		{ok, player_hp:add_hp(AddHp, BasicData, HouseData)}
    	end,
    case player_hp:save_hp(Account, F) of
    	{false, Reason} ->
    	    {false, [{sys_msg, send, [Account, Reason]}]};
    	{ok, HouseData1, _OldBasicData, NBasicData} ->
    	    {ok, HouseData1, [{player_hp, send, [Account, NBasicData, HouseData1]},
			      {router, cast, [Account, add_hp_event, Account]}
			     ]}
    end.
