%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2013, linyibin
%%% @doc
%%% 食物库存
%%% @end
%%% Created : 21 Jun 2013 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(player_food_stock).

-include("packet_def.hrl").
-include("house_data.hrl").
-include("tplt_def.hrl").
-include("sys_msg.hrl").
-include("router.hrl").
-include("common_def.hrl").
-include("enum_def.hrl").
-include("resource.hrl").
-include("records.hrl").

-record(stock, {id,           %% 食物Id
		size,         %% 库存大小
		value=0,      %% 食物库存值
		dec_time,     %% 每次扣库存时间
		process       %% 处理扩充库存
	       }). 

-record(expand_stock, {due_time}).

%% API
-export([start/1, notify/2, get_value/1, get_value/2, set_value/3, add_value/3, get_max_value/3]).
-export([settlement/1, do_settlement/1]).
-export([handle_cast/2]).
-export([get_id/1, get_dec_time/1, set_dec_time/3, get_dec_time/2, set_dec_time/2, dec_stock_value/2]).
-export([get_stock_info/1]).

%%%===================================================================
%%% API
%%%===================================================================
start(Account) ->
    [router:make_event_source(?msg_req_expand_food_stock, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_cancel_expand_food_stock, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_complete_expand_food_stock, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_food_stock_info, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_immediately_complete_expand_stock, Account, {Account, ?MODULE})
    ].

notify(Account, PlayerFood) ->
    StockInfo = get_stock_info(PlayerFood),
    net_helper:send2client(Account, #notify_food_stock_info{stock_info=StockInfo}).

%%--------------------------------------------------------------------
%% @doc
%% @获取库存信息
%% @end
%%--------------------------------------------------------------------
get_stock_info(PlayerFood) ->
    Stocks = player_food:get_stocks(PlayerFood),
    lists:foldl(fun(#stock{id=ID, size=Size, value=Value, process=Process}, Info) ->
			case Process of
			    [] ->
				[#food_stock_info{id=ID, 
						  size=Size, 
						  value=Value, 
						  due_time=#stime{}}|Info];
			    undefined ->
				[#food_stock_info{id=ID, 
						  size=Size, 
						  value=Value, 
						  due_time=#stime{}}|Info];
			    _ ->
				DueTime = Process#expand_stock.due_time,
				[#food_stock_info{id=ID, 
						  size=Size, 
						  value=Value, 
						  due_time=DueTime}|Info]
			end

		end, [], Stocks).

%%--------------------------------------------------------------------
%% @doc
%% @结算清点库存
%% @end
%%--------------------------------------------------------------------
settlement(Account) ->
    F = fun() ->
		PlayerFood = player_food:get(Account),
		NPlayerFood = do_settlement(PlayerFood),
		%% 持久化
		db:write(NPlayerFood)
	end,
    db:transaction(F).

do_settlement(PlayerFood) ->
    Stocks = player_food:get_stocks(PlayerFood),
    Now = datetime:localtime(),
    Account = player_food:get_account(PlayerFood),
    %% 遍历所有库存，如果库存到期，就增加库存格子
    NStocks = 
	lists:foldl(fun(#stock{id=ID, process=Process}=Stock, Stocks1) ->
			    case Process of
				[] ->
				    [Stock|Stocks1];
				undefined ->
				    [Stock|Stocks1];
				#expand_stock{due_time=DueTime} ->
				    %% 如果时间到期，那就结算
				    case datetime:diff_time(DueTime, Now) >= 0 of
					true ->
					    PlayerFoodTplt = tplt:get_data(player_food_tplt, ID),
					    UpdateSize = get_update_stock_size(PlayerFoodTplt, PlayerFood),
					    Stock1 = Stock#stock{size=UpdateSize, process=[]},
					    net_helper:send2client(Account, 
								   #notify_settlement_expand_food_stock
								     {id=ID,
								      size=UpdateSize}),
					    [Stock1|Stocks1];
					false ->
					    [Stock|Stocks1]
				    end
			    end
		    end, [], Stocks),
    player_food:set_stocks(PlayerFood, NStocks).

%%--------------------------------------------------------------------
%% @doc
%% @获取库存ID
%% @end
%%--------------------------------------------------------------------
get_id(Stock) ->
    Stock#stock.id.

%%--------------------------------------------------------------------
%% @doc
%% @获取库存扣除时间
%% @end
%%--------------------------------------------------------------------
get_dec_time(Stock) ->
    Stock#stock.dec_time.

get_dec_time(ID, PlayerFood) ->
    Stocks = player_food:get_stocks(PlayerFood),
    Stock = lists:keyfind(ID, #stock.id, Stocks),
    get_dec_time(Stock).

%%--------------------------------------------------------------------
%% @doc
%% @设置库存扣除时间
%% @end
%%--------------------------------------------------------------------
set_dec_time(Stock, DecTime) ->
    Stock#stock{dec_time=DecTime}.

set_dec_time(ID, DecTime, PlayerFood) ->
    Stocks = player_food:get_stocks(PlayerFood),
    case lists:keyfind(ID, #stock.id, Stocks) of
	false ->
	    PlayerFood;
	Stock ->
	    NStock = set_dec_time(Stock, DecTime),
	    NStocks = lists:keyreplace(ID, #stock.id, Stocks, NStock),
	    player_food:set_stocks(PlayerFood, NStocks)
    end.


%%--------------------------------------------------------------------
%% @doc
%% @扣除库存值
%% @end
%%--------------------------------------------------------------------
dec_stock_value(Stock, Copies) ->
    CurrValue = Stock#stock.value,
    case CurrValue - Copies < 0 of
	true ->
	    Stock#stock{value=0};
	false ->
	    Stock#stock{value=CurrValue-Copies}
    end.

%%--------------------------------------------------------------------
%% @doc
%% @获取库存值
%% @end
%%--------------------------------------------------------------------
get_value(ID, PlayerFood) ->
    Stocks = player_food:get_stocks(PlayerFood),
    case lists:keyfind(ID, #stock.id, Stocks) of
	false ->
	    0;
	Stock ->
	    Stock#stock.value
    end.

get_value(Stock) ->
    Stock#stock.value.

%%--------------------------------------------------------------------
%% @doc
%% @设置库存值
%% @end
%%--------------------------------------------------------------------
set_value(ID, PlayerFood, Value) ->
    PlayerFoodTplt = tplt:get_data(player_food_tplt, ID),
    Stocks = player_food:get_stocks(PlayerFood), 
    Now = datetime:localtime(),
    case lists:keyfind(ID, #stock.id, Stocks) of
	false ->
	    CurrentSize = get_current_stock_size(PlayerFoodTplt, PlayerFood),
	    NStocks = [#stock{id=ID, size=CurrentSize, value=Value, dec_time=Now, process=[]}|Stocks],
	    player_food:set_stocks(PlayerFood, NStocks);
	Stock ->
	    Stock1 = Stock#stock{value=Value},
	    NStocks1 = lists:keyreplace(ID, #stock.id, Stocks, Stock1),
	    player_food:set_stocks(PlayerFood, NStocks1)
    end.

%%--------------------------------------------------------------------
%% @doc
%% @增加库存值
%% @end
%%--------------------------------------------------------------------
add_value(ID, PlayerFood, Value) ->
    CurrValue = get_value(ID, PlayerFood),
    set_value(ID, PlayerFood, CurrValue + Value).


%%--------------------------------------------------------------------
%% @doc
%% @获取最大允许库存值
%% @end
%%--------------------------------------------------------------------
get_max_value(ID, ProductID, PlayerFood) ->
    PlayerFoodTplt = tplt:get_data(player_food_tplt, ID),
    CurrentSize = get_current_stock_size(PlayerFoodTplt, PlayerFood),
    PlayerFoodProductTplt = tplt:get_data(player_food_product_tplt, ProductID),
    CurrentSize * PlayerFoodProductTplt#player_food_product_tplt.copies.

%%%===================================================================
%%% Handle cast
%%%===================================================================
handle_cast({#msg{src=Account}, #req_expand_food_stock{id=ID}}, State) ->
    F = fun() ->
		[PlayerBasicData] = db:read(player_basic_data, Account),
		HouseId = player_basic_data:get_house_id(PlayerBasicData),
		[HouseData] = db:read(house_data, HouseId),
		PlayerFood = player_food:get(Account),
		PlayerFoodTplt = tplt:get_data(player_food_tplt, ID),
		case can_expand_stock(PlayerFoodTplt, PlayerFood, HouseData) of
		    true ->
			expand_stock(PlayerFoodTplt, PlayerFood, HouseData);
		    {false, Reason} ->
			Reason
		end
	end,
    case db:transaction(F) of
	{true, ID, DueTime, NHouseData} ->
	    house_diamond:notify(NHouseData),
	    router:cast(Account, expand_food_stock_event, Account),
	    net_helper:send2client(Account, #notify_expand_food_stock{id=ID, due_time=DueTime});
	Reason ->
	    sys_msg:send(Account, Reason)
    end,
    {noreply, State};
handle_cast({#msg{src=Account}, #req_cancel_expand_food_stock{id=ID}}, State) ->
    F = fun() ->
		PlayerFood = player_food:get(Account),
		PlayerFoodTplt = tplt:get_data(player_food_tplt, ID),
		case can_cancel_stock(PlayerFoodTplt, PlayerFood) of
		    true ->
			cancel_stock(PlayerFoodTplt, PlayerFood);
		    {false, Reason} ->
			Reason
		end
	end,
    case db:transaction(F) of
	{true, _NPlayerFood} ->
	    net_helper:send2client(Account, #notify_cancel_expand_food_stock{id=ID});
	Reason ->
	    sys_msg:send(Account, Reason)
    end,
    {noreply, State};
handle_cast({#msg{src=Account}, #req_complete_expand_food_stock{id=ID, grid_index=GridIndex}}, State) ->
    F = fun() ->
		%% [PlayerBasicData] = db:read(player_basic_data, Account),
		%% HouseId = player_basic_data:get_house_id(PlayerBasicData),
		%% [HouseData] = db:read(house_data, HouseId),
		PlayerFood = player_food:get(Account),
		PlayerFoodTplt = tplt:get_data(player_food_tplt, ID),
		case can_complete_expand_stock(PlayerFoodTplt, PlayerFood) of
		    true ->
			complete_expand_stock(PlayerFoodTplt, PlayerFood);
		    {false, Reason} ->
			Reason
		end
	end,
    case db:transaction(F) of
	{true, _NPlayerFood} ->
	    router:cast(Account, complete_expand_food_stock_event, Account),
	    net_helper:send2client(Account, #notify_complete_expand_food_stock{id=ID, grid_index=GridIndex});
	Reason ->
	    sys_msg:send(Account, Reason)
    end,
    {noreply, State};
handle_cast({#msg{src=Account}, #req_food_stock_info{}}, State) ->
    F = fun() ->
		PlayerFood = player_food:get(Account),
		NPlayerFood = do_settlement(PlayerFood),
		%% NNPlayerFood = player_food_product:do_settlement(NPlayerFood),
		db:write(NPlayerFood),
		get_stock_info(NPlayerFood)
	end,
    case db:transaction(F) of
	StockInfo ->
	    net_helper:send2client(Account, #notify_food_stock_info{stock_info=StockInfo})
    end,
    {noreply, State};
handle_cast({#msg{src=Account}, #req_immediately_complete_expand_stock{id=ID, grid_index=GridIndex}}, State) ->
    F = fun() ->
		PlayerFood = player_food:get(Account),
		PlayerFoodTplt = tplt:get_data(player_food_tplt, ID),
		LoveCoin = get_expand_stock_love_coin(PlayerFoodTplt, PlayerFood),
		ShipCallback = 
		    fun(#order{status=Status}=_Order)-> 			   
			    case (Status =:= ?order_payed) of
				true ->
				    immediately_complete_expand_stock(PlayerFoodTplt, PlayerFood),
				    router:cast(Account, complete_expand_food_stock_event, Account),
				    %% 发送消息
				    net_helper:send2client(Account, #notify_immediately_complete_expand_stock{id=ID, grid_index=GridIndex}),
				    ?pay_shipped;
				_ ->
				    ?pay_error
			    end				       
		    end,

		player_love_coin:pay([{0, 1, LoveCoin}], 
				     ShipCallback, 
				     ?order_goods_meta_food_stock, State)
	end,
    db:transaction(F),
    {noreply, State}.

%%%===================================================================
%%% Internal functions
%%%===================================================================
%%--------------------------------------------------------------------
%% @doc
%% @是否可以完成库存
%% @end
%%--------------------------------------------------------------------
can_complete_expand_stock(PlayerFoodTplt, PlayerFood) ->
    ID = PlayerFoodTplt#player_food_tplt.id,
    Stocks = player_food:get_stocks(PlayerFood),
    case lists:keyfind(ID, #stock.id, Stocks) of
	false ->
	    {false, ?player_food_complete_expand_stock};
	Stock ->
	    Process = Stock#stock.process,
	    case Process of
		[] ->
		    {false, ?player_food_complete_expand_stock};
		#expand_stock{due_time=DueTime} ->
		    Now = datetime:localtime(),
		    case datetime:diff_time(DueTime, Now) >= -5 of
			true ->
			    true;
			false ->
			    {false, ?player_food_complete_expand_stock_due_time}
		    end
	    end
    end.

%%--------------------------------------------------------------------
%% @doc
%% @完成库存
%% @end
%%--------------------------------------------------------------------
complete_expand_stock(PlayerFoodTplt, PlayerFood) ->
    %% 更新库存格子
    ID = PlayerFoodTplt#player_food_tplt.id,
    Stocks = player_food:get_stocks(PlayerFood),
    NStocks = 
    case lists:keyfind(ID, #stock.id, Stocks) of
	false ->
	    Stocks;
	Stock ->
	    UpdateSize = get_update_stock_size(PlayerFoodTplt, PlayerFood),
	    Stock1 = Stock#stock{size=UpdateSize, process=[]},
	    lists:keyreplace(ID, #stock.id, Stocks, Stock1)
    end,
    NPlayerFood = player_food:set_stocks(PlayerFood, NStocks),
    % 持久化
    db:dirty_write(NPlayerFood),
    {true, NPlayerFood}.

%%--------------------------------------------------------------------
%% @doc
%% @立即完成扩充
%% @end
%%--------------------------------------------------------------------
immediately_complete_expand_stock(PlayerFoodTplt, PlayerFood) ->
    %% 更新库存格子
    ID = PlayerFoodTplt#player_food_tplt.id,
    Stocks = player_food:get_stocks(PlayerFood),
    NStocks = 
    case lists:keyfind(ID, #stock.id, Stocks) of
	false ->
	    Stocks;
	Stock ->
	    UpdateSize = get_update_stock_size(PlayerFoodTplt, PlayerFood),
	    Stock1 = Stock#stock{size=UpdateSize, process=[]},
	    lists:keyreplace(ID, #stock.id, Stocks, Stock1)
    end,
    NPlayerFood = player_food:set_stocks(PlayerFood, NStocks),
    db:dirty_write(NPlayerFood).

can_cancel_stock(PlayerFoodTplt, PlayerFood) ->
    ID = PlayerFoodTplt#player_food_tplt.id,
    Stocks = player_food:get_stocks(PlayerFood),
    case lists:keyfind(ID, #stock.id, Stocks) of
	false ->
	    {false, ?player_food_expand_stock_due_time};
	Stock ->
	    Process = Stock#stock.process,
	    case Process == [] of
		true ->
		    {false, ?player_food_expand_stock_due_time};
		false ->
		    DueTime = Process#expand_stock.due_time,
		    Now = datetime:localtime(),
		    case datetime:diff_time(DueTime, Now) >= 0 of
			true ->
			    {false, ?player_food_expand_stock_due_time};
			false ->
			    true
		    end
	    end
    end.

cancel_stock(PlayerFoodTplt, PlayerFood) ->
    ID = PlayerFoodTplt#player_food_tplt.id,
    Stocks = player_food:get_stocks(PlayerFood),
    NStocks = 
	case lists:keyfind(ID, #stock.id, Stocks) of
	    false ->
		Stocks;
	    Stock ->
		Stock1 = Stock#stock{process=[]},
		lists:keyreplace(ID, #stock.id, Stocks, Stock1)
	end,
    NPlayerFood = player_food:set_stocks(PlayerFood, NStocks),
    %% 持久化
    db:write(NPlayerFood),
    {true, NPlayerFood}.

%%--------------------------------------------------------------------
%% @doc
%% @是否可以扩充库存
%% @end
%%--------------------------------------------------------------------
can_expand_stock(PlayerFoodTplt, PlayerFood, HouseData) ->
    try
	can_expand_by_due_time(PlayerFoodTplt, PlayerFood),
	can_expand_by_max_stock(PlayerFoodTplt, PlayerFood),
	can_expand_by_diamond(PlayerFoodTplt, PlayerFood, HouseData)
    catch
	throw:Reason ->
	    Reason
    end.

%%--------------------------------------------------------------------
%% @doc
%% @上一次扩充是否已完成
%% @end
%%--------------------------------------------------------------------
can_expand_by_due_time(PlayerFoodTplt, PlayerFood) ->
    ID = PlayerFoodTplt#player_food_tplt.id,
    Stocks = player_food:get_stocks(PlayerFood),
    case lists:keyfind(ID, #stock.id, Stocks) of
	false ->
	    true;
	Stock ->
	    Process = Stock#stock.process,
	    case Process == [] of
		true ->
		    true;
		false ->
		    DueTime = Process#expand_stock.due_time,
		    Now = datetime:localtime(),
		    case datetime:diff_time(DueTime, Now) >= 0 of
			true ->
			    true;
			false ->
			    throw({false, ?player_food_expand_stock_due_time})
		    end
	    end
    end.

%%--------------------------------------------------------------------
%% @doc
%% @是否超过最大库存量
%% @end
%%--------------------------------------------------------------------
can_expand_by_max_stock(PlayerFoodTplt, PlayerFood) ->
    MaxStock = PlayerFoodTplt#player_food_tplt.max_stock,
    UpdateStock = get_update_stock_size(PlayerFoodTplt, PlayerFood),
    case MaxStock >= UpdateStock of
	true ->
	    true;
	false ->
	    throw({false, ?player_food_expand_stock_max_stock})
    end.

%%--------------------------------------------------------------------
%% @doc
%% @是否有足够的钱扩充库存
%% @end
%%--------------------------------------------------------------------
can_expand_by_diamond(PlayerFoodTplt, PlayerFood, HouseData) ->
    Diamond = get_expand_stock_need_diamond(PlayerFoodTplt, PlayerFood),
    HouseDiamond = house_diamond:get_lover_diamond(HouseData),
    case HouseDiamond >= Diamond of
	true ->
	    true;
	false ->
	    throw({false, ?player_food_expand_stock_diamond})
    end.

%%--------------------------------------------------------------------
%% @doc
%% @获取当前库存数量
%% @end
%%--------------------------------------------------------------------
get_current_stock_size(PlayerFoodTplt, PlayerFood) ->
    ID = PlayerFoodTplt#player_food_tplt.id,
    MinStock = PlayerFoodTplt#player_food_tplt.min_stock,
    Stocks = player_food:get_stocks(PlayerFood),
    case lists:keyfind(ID, #stock.id, Stocks) of
	false ->
	    MinStock;
	Stock ->
	    Stock#stock.size
    end.

%%--------------------------------------------------------------------
%% @doc
%% @获取当前升级的库存数
%% @end
%%--------------------------------------------------------------------
get_update_stock_size(PlayerFoodTplt, PlayerFood) ->
    CurrentStockNumber = get_current_stock_size(PlayerFoodTplt, PlayerFood),
    CurrentStockNumber + 1.

%%--------------------------------------------------------------------
%% @doc
%% @获取当前扩充需要的水晶数
%% @end
%%--------------------------------------------------------------------
get_expand_stock_need_diamond(PlayerFoodTplt, PlayerFood) ->
    CurrStockNumber = get_current_stock_size(PlayerFoodTplt, PlayerFood),
    ExpandStockDiamond = PlayerFoodTplt#player_food_tplt.expand_stock_diamond,
    lists:nth(CurrStockNumber+1, ExpandStockDiamond).

%%--------------------------------------------------------------------
%% @doc
%% @获取当前扩充需要的时间
%% @以秒为单位
%% @end
%%--------------------------------------------------------------------
get_expand_stock_need_time(PlayerFoodTplt, PlayerFood) ->
    CurrStockNumber = get_current_stock_size(PlayerFoodTplt, PlayerFood),
    ExpandStockTime = PlayerFoodTplt#player_food_tplt.expand_stock_time,
    lists:nth(CurrStockNumber+1, ExpandStockTime).

%%--------------------------------------------------------------------
%% @doc
%% @获取当前扩展需要的爱情币
%% @以秒为单位
%% @end
%%--------------------------------------------------------------------
get_expand_stock_love_coin(PlayerFoodTplt, PlayerFood) ->
    CurrStockNumber = get_current_stock_size(PlayerFoodTplt, PlayerFood),
    ExpandStockLoveCoin = PlayerFoodTplt#player_food_tplt.expand_stock_love_coin,
    lists:nth(CurrStockNumber+1, ExpandStockLoveCoin).

%%--------------------------------------------------------------------
%% @doc
%% @扩充库存
%% @end
%%--------------------------------------------------------------------
expand_stock(PlayerFoodTplt, PlayerFood, HouseData) ->
    %% 扣水晶
    Diamond = get_expand_stock_need_diamond(PlayerFoodTplt, PlayerFood),
    NHouseData = house_diamond:dec_diamond(Diamond, HouseData),
    %% 扩库存
    ID = PlayerFoodTplt#player_food_tplt.id,
    Time = get_expand_stock_need_time(PlayerFoodTplt, PlayerFood),
    Now = datetime:localtime(),
    DueTime = datetime:add_time(Now, Time),
    Stocks = player_food:get_stocks(PlayerFood),
    CurrentStock = get_current_stock_size(PlayerFoodTplt, PlayerFood),
    ExpandStock = #expand_stock{due_time=DueTime},
    NStocks = 
	case lists:keyfind(ID, #stock.id, Stocks) of
	    false ->
		[#stock{id=ID, size=CurrentStock, dec_time=Now, process=ExpandStock}|Stocks];
	    Stock ->
		Stock1 = Stock#stock{size=CurrentStock, process=ExpandStock},
		lists:keyreplace(ID, #stock.id, Stocks, Stock1)
	end,
    NPlayerFood = player_food:set_stocks(PlayerFood, NStocks),
    %% 持久化
    db:write(NPlayerFood),
    db:write(NHouseData),
    {true, ID, DueTime, NHouseData}.
