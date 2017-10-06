%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% 用于计算几率
%%% @end
%%% Created : 30 May 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(rate).

-include("tplt_def.hrl").

-export([get_rate_id/1, hit/1]).

%%%===================================================================
%%% API
%%%===================================================================
%% Type:几率类型
%% 返回值: 几率Id
get_rate_id(Type) when is_integer(Type) ->
    RateData = get_data(Type),
    NRateData = lists:keysort(#rate_tplt.rate, RateData),
    TotalRate = get_total_rate(NRateData),
    RandValue = rand(TotalRate),
    do_get_rate_id(RandValue, 0, NRateData, []).

%%%===================================================================
%%% Internal Func
%%%===================================================================
%% 获取几率表数据
%% Type:几率类型
get_data(Type) ->
    RateTplt = tplt:get_all_data(rate_tplt),
    get_data(Type, RateTplt).

get_data(Type, RateTplt) when is_list(RateTplt) ->
    {RateData, _} = lists:partition(fun(#rate_tplt{type=T}) -> T == Type end, RateTplt),
    RateData.


do_get_rate_id(_RandValue, _PreRateValue, [], R) when is_record(R, rate_tplt) ->
    R#rate_tplt.id;
do_get_rate_id(RandValue, PreRateValue, [RateTplt|RateData], R) when is_list(R) ->
    TotalRateValue = PreRateValue + RateTplt#rate_tplt.rate,
    case TotalRateValue >= RandValue of
	true ->
	    do_get_rate_id(RandValue, TotalRateValue, [], RateTplt);
	false ->
	    do_get_rate_id(RandValue, TotalRateValue, RateData, R)
    end.

%% 获取总的几率数
get_total_rate(RateData) when is_list(RateData) ->
    lists:foldl(fun(#rate_tplt{rate=Rate}, TotalRate) ->
			TotalRate + Rate
		end, 0, RateData).

%% 根据总数随机
rand(TotalRate) ->
     rand:uniform(TotalRate).



hit([])->
    throw("empty list");

hit([{Item, _Rate}])->
	   Item;

hit(RateList) when is_list(RateList)->
    %% 计算总概率, 计算命中下限
    %% 命中匹配
    F = fun({Item, Rate}, {RateAcc, AdjuestRateAcc}) ->
		{RateAcc + Rate, [{Item, RateAcc}|AdjuestRateAcc]}
	end,
    
    {TotalRate, AdjuestRateList} = lists:foldl(F, {0, []}, RateList),
    
    Hit = rand(TotalRate),
    hit(AdjuestRateList, Hit).

hit([{Item, _Rate}], _Hit) ->
    Item;

hit([{Item, Rate}|RateList], Hit) ->
    if Hit > Rate ->
	    Item;
       true ->
	    hit(RateList, Hit)
    end.
%%%===================================================================
%%% Test case
%%%===================================================================
-ifdef(TEST).
-include_lib("eunit/include/eunit.hrl").
get_data_test() ->
    RateTplt = [#rate_tplt{type=1},
		#rate_tplt{type=1},
		#rate_tplt{type=1},
		#rate_tplt{type=2},
		#rate_tplt{type=2},
		#rate_tplt{type=2},
		#rate_tplt{type=2}
	       ],
    RateData = get_data(1, RateTplt),
    ?assertEqual([#rate_tplt{type=1},#rate_tplt{type=1},#rate_tplt{type=1}], RateData).

keysort_test() ->
    RateTplt = [#rate_tplt{type=1, rate=1},
		#rate_tplt{type=1, rate=3},
		#rate_tplt{type=1, rate=2},
		#rate_tplt{type=2, rate=7},
		#rate_tplt{type=2, rate=4},
		#rate_tplt{type=2, rate=5},
		#rate_tplt{type=2, rate=8}
	       ],
    RateSortData = lists:keysort(#rate_tplt.rate, RateTplt),    
    ?assertEqual([#rate_tplt{type=1, rate=1},
		  #rate_tplt{type=1, rate=2},
		  #rate_tplt{type=1, rate=3},
		  #rate_tplt{type=2, rate=4},
		  #rate_tplt{type=2, rate=5},
		  #rate_tplt{type=2, rate=7},
		  #rate_tplt{type=2, rate=8}
		 ], RateSortData).

-endif.
