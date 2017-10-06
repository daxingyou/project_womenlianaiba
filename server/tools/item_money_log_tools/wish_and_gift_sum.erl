%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%   许愿和礼物统计
%%% @end
%%% Created :  5 Apr 2012 by hongjx <hongjx@35info.cn>

-module(wish_and_gift_sum).

-include("item_money_log.hrl").
-include("tplt_def.hrl").
-include("enum_def.hrl").


-export([select/3]).


select(StartTime, EndTime, OperatorList) ->
    [do_select(StartTime, EndTime, X) || X <- OperatorList].

%%%===================================================================
%%% 根据条件选择记录
%%%===================================================================
select_wishes({Y, M, D}, {Y2, M2, D2}, Operator) ->
    select_wishes({{Y, M, D}, {0, 0, 0}}, {{Y2, M2, D2}, {0, 0, 0}}, Operator);
select_wishes(StartTime, EndTime, Operator) ->
    StartSeconds = datetime:datetime_to_gregorian_seconds(StartTime),
    EndSeconds = datetime:datetime_to_gregorian_seconds(EndTime),
    %% 选出玩家 给 系统钱的 所有满足许愿记录
    L = mongodb_services:select(get_connection(), item_money_log, 
				{time, {'$gte', StartSeconds}, time, {'$lt', EndSeconds},
				 operator, atom_to_list(Operator),
				 keeper, "system",           
				 type, ?mt_diamond,
				 action, ?tag_satisfy_wish}),
    L.


select_gifts({Y, M, D}, {Y2, M2, D2}, Operator) ->
    select_gifts({{Y, M, D}, {0, 0, 0}}, {{Y2, M2, D2}, {0, 0, 0}}, Operator);
select_gifts(StartTime, EndTime, Operator) ->
    StartSeconds = datetime:datetime_to_gregorian_seconds(StartTime),
    EndSeconds = datetime:datetime_to_gregorian_seconds(EndTime),
    %% 取送礼记录
    L = mongodb_services:select(get_connection(), item_money_log, 
				{time, {'$gte', StartSeconds}, time, {'$lt', EndSeconds},
				 operator, atom_to_list(Operator),
				 old_keeper, atom_to_list(Operator),          
				 action, ?tag_send_gift}),
    L.



do_select(StartTime, EndTime, Operator) when is_atom(Operator) ->
    A = select_wishes(StartTime, EndTime, Operator),
    B = select_gifts(StartTime, EndTime, Operator),
    CostA = get_wishes_cost(A, Operator),
    CostB = get_gifts_cost(B, Operator),
    %%io:format("costA: ~p~n", [CostA]),
    %%io:format("costB: ~p~n", [CostB]),
    Total = CostA + CostB,
    {Operator, Total, CostA, CostB}.


get_wishes_cost(L, Operator) ->
    MoneyList = [bson:at(count, R) || R <- L, 
				      not buy_for_self(Operator, list_to_atom(bson:at(keeper, R)))
		],
    %% 把金钱加总
    lists:sum(MoneyList).

get_gifts_cost(L, Operator) ->
    MoneyList = [begin 
		     ItemID = bson:at(type, R),
		     ItemCount = bson:at(count, R),
		     get_cost_money(ItemID, ItemCount)
		 end || R <- L,
			not buy_for_self(Operator, list_to_atom(bson:at(keeper, R)))
		],
    lists:sum(MoneyList).
    
%% 算出多少钱
get_cost_money(?mt_diamond, ItemCount) ->
    ItemCount;
get_cost_money(ItemID, ItemCount) ->    
    %% 从商城表里反推价钱(这是不靠谱的做法，没办法的办法)
    L = tplt:get_all_data(sys_shop_tplt),
    case lists:keyfind(ItemID, #sys_shop_tplt.item_id, L) of
	false ->
	    0;
	#sys_shop_tplt{price=Price} ->
	    ItemCount * Price
    end.

%% 买给自已，或自已伴侣
buy_for_self(Sender, Sender) ->
    true;
buy_for_self(Sender, Recver) ->
    db_pair_player:get_lover(Sender) == Recver.

get_connection()->
    mongodb_services:get_connection().



