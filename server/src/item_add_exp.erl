%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%
%%% @end
%%% Created : 17 Dec 2012 by hongjx <hongjx@35info.cn>

-module(item_add_exp).


-export([can_use_item/6, use_item/2]).

can_use_item(_Owner, _Targets, _HouseData, _Item, _ItemTplt, _PlayerData) ->
    true.

%% 模板表里只要填模块名和参数这两列即可， 参数只要填写除第一个元组以外的参数
%% 比如要使用这个物品， 只要填写item_add_hp 和 10 就可以了
%% 增加体力
use_item({Account,_, HouseData,_,_,_}, AddExp) ->
    {NHouseData, MFA} = do_add_exp(AddExp, Account, HouseData),
    {ok, NHouseData, [MFA]}.


do_add_exp(Exp, Account, HouseData) when is_atom(Account),
					 is_integer(Exp) ->    
    [BasicData] = db:read(player_basic_data, Account),

    %% 加经验
    {_NBasicData, NHouseData, ExpMsgs} = 
	house_level_exp:add_exp(Exp, BasicData, HouseData),

    MFA = {house_level_exp, send_msgs, [ExpMsgs, HouseData]},
    {NHouseData, MFA}.

