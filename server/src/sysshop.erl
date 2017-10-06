%%%-------------------------------------------------------------------
%%% @author  linyijie
%%% @copyright (C) 2010, 
%%% @doc
%%%  系统商城
%%% @end
%%% Created : 21 May 2010 by  <>
%%%-------------------------------------------------------------------
-module(sysshop).

-include("packet_def.hrl").
-include("router.hrl").
-include("common_def.hrl").
-include("tplt_def.hrl").
-include("enum_def.hrl").
-include("sys_msg.hrl").
-include("player_data.hrl").
-include("records.hrl").
-include("resource.hrl").

-export([start/1, handle_cast/2]).

-export([calc_goods_cost/2, calc_goods_point/1, buy_goods/1, get_item_id/1, 
	 log_buy/4, qq_buy/4]).
-export([get_diamond_goods/1, get_love_coin_goods/1, get_payment_info/1]).
%%%===================================================================
%%% API
%%%===================================================================
start(Account) ->
    [
     router:make_event_source(?msg_req_buy_sys_shop_goods, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_mutli_buy_sys_shop_goods, Account, {Account, ?MODULE})
    ].

%% 过滤出水晶购买的商品
get_diamond_goods(GoodsList) ->
    lists:foldl(fun(GoodsId, DiamondGoodsList) ->
			#sys_shop_tplt{money_type=MoneyType} = tplt:get_data(sys_shop_tplt, GoodsId),
			case MoneyType of
			    ?mt_diamond ->
				[GoodsId|DiamondGoodsList];
			    _ ->
				DiamondGoodsList
			end
		end, [], GoodsList).

%% 过滤爱情币购买的商品
get_love_coin_goods(GoodsList) ->
    lists:foldl(fun(GoodsId, QGoodsList) ->
			#sys_shop_tplt{money_type=MoneyType} = tplt:get_data(sys_shop_tplt, GoodsId),
			case MoneyType of
			    ?mt_love_coin ->
				[GoodsId|QGoodsList];
			    _ ->
				QGoodsList
			end
		end, [], GoodsList).

%% 购买商品
%% GoodList格式:[goodsId, goodsId]
%% 返回[#item{}, #item{}]
buy_goods([]) ->
    [];
buy_goods(GoodsList)->
    do_buy_goods(GoodsList, []).

%% 计算商品总价值
%% GoodsList格式:[goodsId, goodsId]
%% CostList格式:{GoodsId, ItemId, Coin, QCoin}, GoodsId:商品Id, Coin:水晶, QCoin:Q币
calc_goods_cost([], _LoginType) ->
    {0, 0};
calc_goods_cost(GoodsList, LoginType) ->
    CostList = make_cost_list(GoodsList, [], LoginType),
    calc_goods_cost(GoodsList, CostList, {0, 0}).

calc_goods_point([]) ->
    0;
calc_goods_point(GoodsList) ->
    lists:foldl(fun(GoodsId, Total) ->
			#sys_shop_tplt{point=Point} = tplt:get_data(sys_shop_tplt, GoodsId),
			Total + Point
		end, 0, GoodsList).


get_item_id(GoodsList) ->
    do_get_item_id(GoodsList, []).

%% 物品金钱记录
log_buy(HouseID, Account, GoodsList, LoginType) when is_list(GoodsList) ->
    BuyInfoList = [begin 
		       #sys_shop_tplt{item_id=ItemID, money_type=MoneyType, price=Price} = 
			   tplt:get_data(sys_shop_tplt, GoodsID),
		       ItemCount = 1,
		       Cost =
			   case MoneyType of
			       ?mt_diamond ->
				   Price;
			       ?mt_love_coin ->
				   util:get_price(Price, LoginType)
			   end,
		       {ItemID, ItemCount, {MoneyType, Cost}}
		   end || GoodsID <- GoodsList],
    item_money_log:log_buy_items(HouseID, BuyInfoList, Account).


%% ReqGoodsList = [{GoodsID, Count, Price}],
%% ShipCallback 回调函数
qq_buy(ReqGoodsList, ShipCallback, Type, PlayerData) 
  when is_list(ReqGoodsList) ->
    Account = player_data:get_account(PlayerData),

    Order = trade_context:make_order(ReqGoodsList, Type),
    
    %% 从player_data中获取payment_info的信息    
    
    PaymentInfo = get_payment_info(Account),

    data_helper:format("PaymentInfo:~p~n",[PaymentInfo]),

    accounting_context:pay(Account, PaymentInfo, Order, ShipCallback).

get_payment_info(Account) ->
    PlatformLoginInfo = db_player:get_platform_login_info(Account),

    PaymentInfo = case PlatformLoginInfo of
		      #platform_login_info{openid=OpenId, openkey=OpenKey, pf=PF, pfkey=PFKey}->
			  #qq_payment_info{open_id=OpenId, open_key=OpenKey, pf=PF, pf_key=PFKey};
		      #yy_platform_login_info{uid=UId, ch=Channel, srvid=SrvId}->
			  #yy_payment_info{uid=UId, ch=Channel, srvid=SrvId}
		  end,
    PaymentInfo.
%%%===================================================================
%%% Handle cast
%%%===================================================================

%% 购买物品
handle_cast({_Msg, #req_buy_sys_shop_goods{goods_id=GoodsID, count=Count}}, 
	    State) when Count > 0 andalso Count =< 99->
    buy([#goods_atom{goods_id=GoodsID, count=Count}], State),
    {noreply, State};
handle_cast({_Msg, #req_mutli_buy_sys_shop_goods{goods_list=Goods}}, State) ->
    buy(Goods, State),
    {noreply, State}.

buy(Goods, State) ->
    Account = player_data:get_account(State),
    LoginType = player_data:get_login_type(State),

    ReqLoveCoinGoods = get_love_coin_goods(Goods, LoginType),
    ReqBuyItems = get_buy_items(Goods),
    %% 组织回调函数
    ShipCallback = 
	fun(#order{status=Status}=_Order)-> 			   
		case (Status =:= ?order_payed) of
		    true ->
			F = fun() ->
				    [PlayerBasicData] = db:read(player_basic_data, Account),
				    HouseId = player_basic_data:get_house_id(PlayerBasicData),
				    [HouseData] = db:read(house_data, HouseId),
				    case can_buy(LoginType, Goods, HouseData) of
					true ->
					    do_buy(LoginType, Goods, ReqBuyItems, PlayerBasicData, HouseData);
					Reason ->
					    Reason
				    end
			    end,
			case db:transaction(F) of
			    {false, Reason} ->
				sys_msg:send(Account, Reason),
				?pay_error;
			    {PlayerBasicData, HouseData, Msgs} ->
				house_pack:send_msgs(Msgs, HouseData),
				house_diamond:notify(HouseData),
				net_helper:send2client(Account, #notify_buy_sys_shop_goods{}),
				ItemList = lists:foldl(fun({ItemID, Count}, Items) ->
							       [ItemID || _X <- lists:seq(1, Count)] ++ Items
						       end, [], ReqBuyItems),
				router:cast(Account, buy_goods_event, ItemList),
				broadcast(Goods, PlayerBasicData),
				?pay_shipped
			end;
		    _ ->
			?pay_error
		end				       
	end,
    player_love_coin:pay(ReqLoveCoinGoods, ShipCallback, ?order_goods_meta_props, State).

can_buy(LoginType, Goods, HouseData) ->
    try
	validate_diamond(LoginType, Goods, HouseData)
    catch
	throw:Reason ->
	    Reason
    end.

do_buy(LoginType, Goods, ReqBuyItems, PlayerBasicData, HouseData) ->
    NeedDiamond = get_diamond_goods_price(Goods, LoginType),
    NHouseData = house_diamond:dec_diamond(NeedDiamond, HouseData),
    {NNHouseData, Msgs} = house_pack:add_items(ReqBuyItems, NHouseData),
    db:write(NNHouseData),
    {PlayerBasicData, NNHouseData, Msgs}.

validate_diamond(LoginType, Goods, HouseData) ->
    TotalDiamond = house_diamond:get_lover_diamond(HouseData),
    NeedDiamond = get_diamond_goods_price(Goods, LoginType),
    case TotalDiamond >= NeedDiamond of
	true ->
	    true;
	false ->
	    throw({false, ?err_not_enough_lover_diamond})
    end.

get_love_coin_goods(Goods, LoginType) ->
    lists:foldl(fun(#goods_atom{goods_id=GoodsID, count=Count}, GoodsList) ->
			SysShopTplt = tplt:get_data(sys_shop_tplt, GoodsID),
			#sys_shop_tplt{price=Price, money_type=MoneyType} =SysShopTplt,
			case MoneyType of
			    ?mt_diamond ->
				GoodsList;
			    ?mt_love_coin ->
				[{GoodsID, Count, util:get_price(Price, LoginType)}|GoodsList]
			end
		end, [], Goods).

get_buy_items(Goods) ->
    lists:foldl(fun(#goods_atom{goods_id=GoodsID, count=Count}, Items) ->
			SysShopTplt = tplt:get_data(sys_shop_tplt, GoodsID),
			#sys_shop_tplt{item_id=ItemID} =SysShopTplt,
			[{ItemID, Count}|Items]
		end, [], Goods).


% 获取所需要的水晶
get_diamond_goods_price(Goods, LoginType) ->
    lists:foldl(fun(#goods_atom{goods_id=GoodsID, count=Count}, TotalPrice) ->
			SysShopTplt = tplt:get_data(sys_shop_tplt, GoodsID),
			#sys_shop_tplt{price=Price, money_type=MoneyType} =SysShopTplt,
			case MoneyType of
			    ?mt_diamond ->
				TotalPrice + util:get_price(Price * Count, LoginType);
			    ?mt_love_coin ->
				TotalPrice
			end
		end, 0, Goods).

%% 公告(炫耀)
broadcast([], _) ->
    ok;
broadcast([#goods_atom{goods_id=GoodsID, count=_Count}|Goods], BasicData) ->
    SysShopTplt = tplt:get_data(sys_shop_tplt, GoodsID),
    #sys_shop_tplt{broadcast_id=BroadcastID, item_id=ItemID} =SysShopTplt,
    case BroadcastID > 0 of
	true ->
	    UserName = player_basic_data:get_username(BasicData),
	    ItemName = item:get_item_name(ItemID),
	    %% 发送系统广播
	    sys_broadcast:send(BroadcastID, [UserName, ItemName]);
	_ ->
	    ok
    end,
    broadcast(Goods, BasicData).
%%%===================================================================
%%% Internal functions
%%%===================================================================
do_buy_goods([], ItemList) ->
    ItemList;
do_buy_goods([GoodsId|GoodsList], ItemList) ->
    #sys_shop_tplt{item_id=ItemId} = tplt:get_data(sys_shop_tplt, GoodsId),
    Item = item:make_item(ItemId),
    do_buy_goods(GoodsList, [Item|ItemList]).


make_cost_list([], CostList, _LoginType) ->
    CostList;
make_cost_list([GoodsId|GoodsList], CostList, LoginType) ->
    #sys_shop_tplt{item_id=ItemId, money_type=MoneyType, price=Price} = 
	tplt:get_data(sys_shop_tplt, GoodsId),
    case MoneyType of
	?mt_diamond ->
	    make_cost_list(GoodsList, [{GoodsId, ItemId, Price, 0}|CostList], LoginType);
	?mt_love_coin ->
	    make_cost_list(GoodsList, 
			   [{GoodsId, ItemId, 0, util:get_price(Price, LoginType)}|CostList]
			  , LoginType)
    end.

%% 计算商品总价值
calc_goods_cost([], _CostList, TotalCost) ->
    TotalCost;
calc_goods_cost([GoodsId|GoodsList], CostList, {TotalCoin, TotalQCoin}) ->
    {_, _ItemId, Coin, QCoin} = lists:keyfind(GoodsId, 1, CostList),
    calc_goods_cost(GoodsList, CostList, {TotalCoin+Coin, TotalQCoin+QCoin}).

do_get_item_id([], ItemIds) ->
    ItemIds;
do_get_item_id([GoodsId|GoodsList], ItemIds) ->
    #sys_shop_tplt{item_id=ItemId} = tplt:get_data(sys_shop_tplt, GoodsId),
    do_get_item_id(GoodsList, [ItemId|ItemIds]).

%%%===================================================================
%%% Test
%%%===================================================================
-include_lib("eunit/include/eunit.hrl").
-ifdef(TEST).
calc_goods_cost_test() ->
    CostList = [{1, 1, 10, 0}, {2, 2, 5, 0}, {3, 2, 1, 0}],
    ?assertEqual({15, 0}, calc_goods_cost([1, 2], CostList, {0, 0})).
-endif.
