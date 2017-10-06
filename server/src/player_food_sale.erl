%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2013, linyibin
%%% @doc
%%% ʳ������
%%% @end
%%% Created : 27 Jun 2013 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(player_food_sale).

-include("packet_def.hrl").
-include("house_data.hrl").
-include("tplt_def.hrl").
-include("sys_msg.hrl").
-include("router.hrl"). 
-include("common_def.hrl").
-include("enum_def.hrl").
-include("resource.hrl").
-include("records.hrl").

-export([sale/1, interval_sale/1]).

-define(SERVER, ?MODULE). 
-define(SALETIME, 1800000).

%%%===================================================================
%%% API
%%%===================================================================
%%--------------------------------------------------------------------
%% @doc
%% @����
%% @end
%%--------------------------------------------------------------------
sale(Account) ->
    F = fun() ->
		do_sale(Account)
	end,
    case db:transaction(F) of
	{_PlayerFood, NPlayerFood, HouseData, NHouseData} ->
	    Now = datetime:localtime(),
	    StockInfo = player_food_stock:get_stock_info(NPlayerFood),
	    NStockInfo = 
		lists:foldl(fun(#food_stock_info{id=ID}=NStockInfo, NewStockInfo) ->
				    DecTime = 
					case player_food_stock:get_dec_time(ID, NPlayerFood) of
					    undefined ->
						Now;
					    Time ->
						Time
					end,
				    Seconds = datetime:diff_time(DecTime, Now),
				    UpgradeID = player_food_upgrade:get_upgrade_id(ID, NPlayerFood),
				    PlayerFoodProductTplt = tplt:get_data(player_food_product_tplt, UpgradeID),
				    ConsumeSeconds = PlayerFoodProductTplt#player_food_product_tplt.consume_speed,
				    [NStockInfo#food_stock_info{seconds=ConsumeSeconds - Seconds}|NewStockInfo]
			    end, [], StockInfo),
	    OldDiamond = house_diamond:get_lover_diamond(HouseData),
	    NewDiamond = house_diamond:get_lover_diamond(NHouseData),
	    Diamond = NewDiamond - OldDiamond,
	    case Diamond > 0 of
		true ->
		    net_helper:send2client(Account, #notify_food_settlement_diamond{diamond=Diamond});
		false ->
		    ok
	    end,
	    net_helper:send2client(Account, #notify_food_stock_info{stock_info=lists:reverse(NStockInfo)}),
	    house_diamond:notify(NHouseData)
    end.

%%--------------------------------------------------------------------
%% @doc
%% @���ʱ������,ÿ����Сʱ����
%% @end
%%--------------------------------------------------------------------
interval_sale(Account) ->
    F = fun(State) ->
		F = fun() ->
			    do_sale(Account)
		    end,
		case db:transaction(F) of
		    {_PlayerFood, NPlayerFood, _HouseData, NHouseData} ->
			StockInfo = player_food_stock:get_stock_info(NPlayerFood),
			house_diamond:notify(NHouseData),
			net_helper:send2client(Account, #notify_food_stock_info{stock_info=StockInfo}),
			net_helper:send2client(Account, #notify_reset_temp_diamond{})
		end,
		interval_sale(Account),
		State
	end,
    erlang:send_after(?SALETIME, self(), {timer, F}).

%%--------------------------------------------------------------------
%% @doc
%% @����������
%% @end
%%--------------------------------------------------------------------
do_sale(Account) ->
    [PlayerBasicData] = db:read(player_basic_data, Account),
    HouseId = player_basic_data:get_house_id(PlayerBasicData),
    [HouseData] = db:read(house_data, HouseId),
    PlayerFood = player_food:get(Account),
    Stocks = player_food:get_stocks(PlayerFood),
    {TotalPrice, NStocks} = settle_stock(Stocks, PlayerFood, HouseData),
    NDiamond = trunc(TotalPrice),
    NHouseData = house_diamond:add_diamond(NDiamond, HouseData),
    NPlayerFood = player_food:set_stocks(PlayerFood, lists:reverse(NStocks)),
    db:write(NPlayerFood),
    db:write(NHouseData),
    {PlayerFood, NPlayerFood, HouseData, NHouseData}.

%%%===================================================================
%%% Internal functions
%%%===================================================================
%%--------------------------------------------------------------------
%% @doc
%% @������
%% @end
%%--------------------------------------------------------------------
settle_stock(Stocks, PlayerFood, HouseData) ->
    %% ��ȡ����ȼ�����ȡ���ݵȼ�
    PlayerLevel = house_level_exp:get_level(HouseData),
    HouseRightGrade = house:get_right_grade(HouseData),
    lists:foldl(fun(Stock, {TotalPrice1, Stocks1}) ->
			ID = player_food_stock:get_id(Stock),
			PlayerFoodTplt = tplt:get_data(player_food_tplt, ID),
			{TotalPrice2, Stock3} = 
			    %% �����ҵȼ��㹻�����ݵȼ��㹻����۳�ʳ��
			    case (PlayerLevel >= PlayerFoodTplt#player_food_tplt.player_level) and
				((HouseRightGrade >= PlayerFoodTplt#player_food_tplt.house_level) orelse 
				 HouseRightGrade == -1) of
				true ->
				    StockCopies = player_food_stock:get_value(Stock),
				    UpgradeID = player_food_upgrade:get_upgrade_id(ID, PlayerFood),
				    Now = datetime:localtime(),
				    DecTime = get_dec_time(Stock, Now),
				    %% ��ȡģ������ݣ����������ٶȣ��۸񣬼��ʱ��
				    PlayerFoodProductTplt = tplt:get_data(player_food_product_tplt, UpgradeID),
				    ConsumeSeconds = PlayerFoodProductTplt#player_food_product_tplt.consume_speed,
				    Price = PlayerFoodProductTplt#player_food_product_tplt.price,
				    %% ����ʱ������õļ�ֵ
				    Seconds = datetime:diff_time(DecTime, Now),
				    Modulus = get_modulus(ConsumeSeconds, Seconds),
				    Remainder = get_remainder(ConsumeSeconds, Seconds),
				    data_helper:format("Copies:~p, Seconds:~p, ConsumeSeconds:~p, Modulus:~p, Remainder:~p, Price:~p~n", [StockCopies, Seconds, ConsumeSeconds, Modulus, Remainder, Price]),
				    case (Modulus > 0) and (StockCopies > 0) of
					true ->
					    NCopies = 
						case StockCopies >= Modulus of
						    true ->
							Modulus;
						    _ ->
							StockCopies
						end,
					    TotalPrice = NCopies * Price,
					    NDecTime = datetime:dec_time(Now, Remainder),
					    Stock1 = player_food_stock:set_dec_time(Stock, NDecTime),
					    Stock2 = player_food_stock:dec_stock_value(Stock1, NCopies),
					    {TotalPrice1 + TotalPrice, Stock2};
					false ->
					    {TotalPrice1, Stock}
				    end;
				false ->
				    {TotalPrice1, Stock}
			    end,
			{TotalPrice2, [Stock3|Stocks1]}
		end, {0, []}, Stocks).

get_modulus(ConsumeSeconds, Seconds) ->
    case Seconds == 0 of
	true ->
	    0;
	false ->
	    Seconds div ConsumeSeconds
    end.

get_remainder(ConsumeSeconds, Seconds) ->
    case Seconds == 0 of
	true ->
	    0;
	false ->
	    Seconds rem ConsumeSeconds
    end.

%%--------------------------------------------------------------------
%% @doc
%% @��ȡ�۳���ʱ��
%% @end
%%--------------------------------------------------------------------
get_dec_time(Stock, Now) ->
    case player_food_stock:get_dec_time(Stock) of
	undefined ->
	    Now;
	Time ->
	    Time
    end.
