%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% 玩家换装
%%% @end
%%% Created : 18 Feb 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(player_change_dress).

-include("packet_def.hrl"). 
-include("router.hrl").
-include("common_def.hrl").
-include("enum_def.hrl").
-include("player_data.hrl").
-include("sys_msg.hrl").
-include("resource.hrl").
-include("records.hrl").

%% API
-export([handle_cast/2, start/1, putoff_overdue_items/2]).


%%%===================================================================
%%% API
%%%===================================================================
start(Account) ->
    [router:make_event_source(?msg_req_start_change_dress, Account, {self(), ?MODULE}),
     router:make_event_source(?msg_req_change_dress, Account, {self(), ?MODULE})
    ].

putoff_overdue_items(PlayerBasicData, HouseData) ->
    Body = player_basic_data:get_body(PlayerBasicData),
    Items = player_body:get_all_items(Body),
    OverdueItems = item:overdue(Items),
    player_body:putoff(PlayerBasicData, HouseData, OverdueItems).

%% 请求开始换装
%% 1.数据库读取两个玩家的基本信息,如果为空的则为空的player_basic_data结构
%% 2.通知客户端两个玩家的基本信息
handle_cast({#msg{src=Account}, #req_start_change_dress{}}, State) ->
    Lover = player_data:get_lover(State),
    PlayerBasicData = player_basic_data:get_owner(Account),
    LoverBasicData = player_basic_data:get_lover(Lover),
    net_helper:send2client(Account, #notify_start_change_dress{owner=PlayerBasicData, lover=LoverBasicData}),
    {noreply, State};
%% 玩家请求换装
handle_cast({#msg{src=Account}, #req_change_dress{type=Type,
						  goods_list=GoodsList, 
						  lover_goods_list=LoverGoodsList, 
						  item_list=RawItemList,
						  putoff_list=PutOffList}}, State) ->
    ItemList = [InstID || #item{instance_id=InstID} <- RawItemList],
    LoginType = player_data:get_login_type(State),
    DiamondGoodsList = sysshop:get_diamond_goods(GoodsList),
    DiamondLoverGoodsList = sysshop:get_diamond_goods(LoverGoodsList),
    QCoinGoodsList = sysshop:get_love_coin_goods(GoodsList),
    QCoinLoverGoodsList = sysshop:get_love_coin_goods(LoverGoodsList),
    case (QCoinGoodsList == []) and (QCoinLoverGoodsList == []) of
	true -> %% 如果没有Q点支付
	    F = build_change_dress(Account, GoodsList, LoverGoodsList, ItemList, PutOffList, LoginType),
	    notify_change_dress(Account, F, GoodsList, LoverGoodsList, RawItemList, State);
	false ->
	    case Type of
		?mt_love_coin ->
		    love_coin_pay(Account, DiamondGoodsList, DiamondLoverGoodsList, 
				  QCoinGoodsList, QCoinLoverGoodsList, GoodsList, 
				  LoverGoodsList, ItemList, PutOffList, LoginType, 
				  RawItemList, State);
		?mt_point ->
		    point_pay(Account, DiamondGoodsList, DiamondLoverGoodsList, 
				  QCoinGoodsList, QCoinLoverGoodsList, GoodsList, 
				  LoverGoodsList, ItemList, PutOffList, LoginType, 
				  RawItemList, State)
	    end
    end,
    {noreply, State}.

%%%===================================================================
%%% Internal functions
%%%===================================================================
point_pay(Account, DiamondGoodsList, DiamondLoverGoodsList, QCoinGoodsList, QCoinLoverGoodsList,
	  GoodsList, LoverGoodsList, ItemList, PutOffList, LoginType, RawItemList, State) ->
    %% 组织回调函数
    ShipCallback = 
	fun(#order{status=Status}=_Order)-> 			   
		case (Status =:= ?order_payed) of
		    true ->
			F = build_change_dress(Account, GoodsList, LoverGoodsList, ItemList, PutOffList, LoginType),
			notify_change_dress(Account, F, GoodsList, LoverGoodsList, RawItemList, State),
			?pay_shipped;
		    _ ->
			F = build_change_dress(Account, DiamondGoodsList, DiamondLoverGoodsList, ItemList, PutOffList, LoginType),
			notify_change_dress(Account, F, DiamondGoodsList, DiamondLoverGoodsList, RawItemList, State),
			?pay_error
		end				       
	end,
    ShipItems = get_point_ship_items(QCoinGoodsList ++ QCoinLoverGoodsList),
    party_coin:pay(ShipItems, ShipCallback, ?order_goods_meta_clothes, State).

love_coin_pay(Account, DiamondGoodsList, DiamondLoverGoodsList, QCoinGoodsList, QCoinLoverGoodsList,
	      GoodsList, LoverGoodsList, ItemList, PutOffList, LoginType, RawItemList, State) ->
    %% 组织回调函数
    ShipCallback = 
	fun(#order{status=Status}=_Order)-> 			   
		case (Status =:= ?order_payed) of
		    true ->
			F = build_change_dress(Account, GoodsList, LoverGoodsList, ItemList, PutOffList, LoginType),
			notify_change_dress(Account, F, GoodsList, LoverGoodsList, RawItemList, State),
			?pay_shipped;
		    _ ->
			F = build_change_dress(Account, DiamondGoodsList, DiamondLoverGoodsList, ItemList, PutOffList, LoginType),
			notify_change_dress(Account, F, DiamondGoodsList, DiamondLoverGoodsList, RawItemList, State),
			?pay_error
		end				       
	end,
    ShipItems = get_love_coin_ship_items(QCoinGoodsList ++ QCoinLoverGoodsList, LoginType),
    player_love_coin:pay(ShipItems, ShipCallback, ?order_goods_meta_clothes, State).

get_love_coin_ship_items(GoodsList, LoginType) ->
    NShipItems = lists:foldl(fun(GoodsId, ShipItems) ->
    				     [{GoodsId, 1, 0}|ShipItems]
    			     end, [], GoodsList),
    {_, QCoin} = sysshop:calc_goods_cost(GoodsList, LoginType),
    [{0, 1, QCoin}|NShipItems].

get_point_ship_items(GoodsList) ->
    NShipItems = lists:foldl(fun(GoodsId, ShipItems) ->
    				     [{GoodsId, 1, 0}|ShipItems]
    			     end, [], GoodsList),
    Point = sysshop:calc_goods_point(GoodsList),
    [{0, 1, Point}|NShipItems].

build_change_dress(Account, GoodsList, LoverGoodsList, InstList, PutOffList, LoginType) ->
    fun() ->
	    [PlayerBasicData] = db:read(player_basic_data, Account),
	    Sex = player_basic_data:get_sex(PlayerBasicData),
	    HouseId = player_basic_data:get_house_id(PlayerBasicData),
	    [HouseData] = db:read(house_data, HouseId),
	    Pack = house_lover_package:get_lover_package(HouseData),
	    PutOffItemList = get_putoff_items(PutOffList, PlayerBasicData),
	    ItemList = [case house_lover_package:get_item(InstID, Pack) of
			    {false, _} ->
				{false, InstID};
			    Item ->
				Item
			end || InstID <- InstList],
	    case can_change_dress(Sex, GoodsList, LoverGoodsList, ItemList, PutOffItemList, HouseData, LoginType) of
		true ->
		    do_change_dress(GoodsList, LoverGoodsList, ItemList, PutOffItemList, PlayerBasicData, HouseData, LoginType);
		Reason ->
		    Reason
	    end
    end.

get_putoff_items([], _PlayerBasicData) ->
    [];
get_putoff_items(PutOffList, PlayerBasicData) ->
    Body = player_basic_data:get_body(PlayerBasicData),
    [player_body:get_item(InstId, Body) || InstId <- PutOffList].

notify_change_dress(Account, F, GoodsList, LoverGoodsList, RawItemList, State) ->
    case db:transaction(F) of
	{false, no_enought_coin} ->
	    do_not_enought_coin(Account);%% 通知客户端金币不足
	{false, not_exist_items, InstList} ->
	    NoExistItems = get_not_exist_item(InstList, RawItemList, []),
	    do_not_exist_item(Account, NoExistItems);%% 通知客户端不存在这些物品，可能已经被删除 
	{false, level_not_enough} ->
	    sys_msg:send(Account, ?level_not_enough);
	{true, PlayerBasicData, HouseData, BuyOwnerItems, BuyLoverItems, PutOffItems, ItemList} ->
	    HouseId = player_basic_data:get_house_id(PlayerBasicData),
	    PutOnItems = lists:append(BuyOwnerItems, ItemList),
	    change_dress_notify(Account, BuyOwnerItems, BuyLoverItems, ItemList, PutOffItems, PlayerBasicData, 	HouseData, State),
	    LoginType = player_data:get_login_type(State),
	    Body = player_basic_data:get_body(PlayerBasicData),
	    PlayerCharm = player_charm:get_charm_by_items(player_body:get_all_items(Body)),
	    router:cast(Account, on_player_charm_change, PlayerCharm),
	    item_money_log(Account, HouseId, GoodsList, LoverGoodsList, PutOnItems, PutOffItems, LoginType)
    end.


get_not_exist_item([], _RawItemList, NotExistItems) ->
    NotExistItems;
get_not_exist_item([InstId|InstList], RawItemList, NotExistItems) ->
    case lists:keyfind(InstId, 2, RawItemList) of
	false ->
	    get_not_exist_item(InstList, RawItemList, NotExistItems);
	Item ->
	    get_not_exist_item(InstList, RawItemList, [Item|NotExistItems])
    end.


%% 物品金钱日志
item_money_log(Account, HouseId, GoodsList, LoverGoodsList, PutOnItems, PutOffItems, LoginType) ->
    %% 购买
    sysshop:log_buy(HouseId, Account, GoodsList ++ LoverGoodsList, LoginType),
    %% 穿上
    item_money_log:log_equip_on(PutOnItems, Account, HouseId),
    %% 脱下
    item_money_log:log_equip_off(PutOffItems, Account, HouseId).

%% 判断是否可以更换服饰
%% 1.判断金币是否足够, 2.判断物品是否存在
can_change_dress(Sex, GoodsList, LoverGoodsList, ItemList, PutOffItemList, HouseData, LoginType) ->
    HouseLoverDiamond = house_diamond:get_lover_diamond(HouseData),
    PlayerLevel = house_level_exp:get_level(HouseData),
    try
	is_item_exist(ItemList, HouseData, []),
	is_exist_putoff_item(PutOffItemList),
	can_use_level_by_shop(GoodsList, PlayerLevel),
	can_use_level_by_package(ItemList, PlayerLevel),
	diamond_is_enough(GoodsList++LoverGoodsList, HouseLoverDiamond, LoginType),
	can_puton(Sex, GoodsList)
    catch
	throw:Reason ->
	    Reason
    end.

can_use_level_by_shop(GoodsList, PlayerLevel) ->
    TempIds = sysshop:get_item_id(GoodsList),
    can_use_by_level_1(TempIds, PlayerLevel).
can_use_level_by_package(ItemList, PlayerLevel) ->
    TempIds = lists:foldl(fun(#item{template_id=TempId}, TempIds) ->
				  [TempId | TempIds]
			  end, [], ItemList),
    can_use_by_level_1(TempIds, PlayerLevel).

can_use_by_level_1(TempIds, PlayerLevel) ->
    CanUse = lists:foldl(fun(TempId, IsUse) ->
				 UseLevel = item:get_use_level(TempId),
				 (PlayerLevel >= UseLevel) and IsUse
			 end, true, TempIds),
    case CanUse of
	true ->
	    true;
	false ->
	    throw({false, level_not_enough})
    end.

is_exist_putoff_item(PutOffItemList) ->
    case lists:member(false, PutOffItemList) of
	true ->
	    throw({false, not_exist_putoff_item});
	false ->
	    true
    end.


diamond_is_enough(ItemList, HouseLoverDiamond, LoginType) ->
    {NeedDiamondPrice, _} = sysshop:calc_goods_cost(ItemList, LoginType),
    case HouseLoverDiamond >= NeedDiamondPrice  of
	true ->
	    true;
	false ->
	    throw({false, no_enought_coin})
    end.

can_puton(Sex, GoodsList) ->
    TempIds = sysshop:get_item_id(GoodsList),
    case player_body:can_puton(Sex, TempIds) of
	true ->
	    true;
	Reason ->
	    throw(Reason)
    end.

is_item_exist([], _HouseData, ErrorIds) ->
    case length(ErrorIds) == 0 of
	true ->
	    true;
	false ->
	    throw({false, not_exist_items, ErrorIds})
    end;
is_item_exist([ Item | ItemList], HouseData, ErrorIds) ->
    case Item of
	#item{instance_id=InstId} ->
	    case house_pack:is_item_exist(InstId, HouseData) of
		true ->
		    is_item_exist(ItemList, HouseData, ErrorIds);
		false ->
		    is_item_exist(ItemList, HouseData, [InstId | ErrorIds])
	    end;
	{false, InstId1} ->
	    is_item_exist(ItemList, HouseData, [InstId1 | ErrorIds])
    end.

do_change_dress(GoodsList, LoverGoodsList, ItemList, PutOffItemList, PlayerBasicData, HouseData, LoginType) ->
    HouseLoverPackage = house_lover_package:get_lover_package(HouseData),
    {BuyOwnerItems, BuyLoverItems, NHouseData} = buy_goods(GoodsList, LoverGoodsList, HouseData, LoginType),
    Body = player_basic_data:get_body(PlayerBasicData),
    NBody = player_body:putoff(Body, PutOffItemList),
    {NNBody, PutOffItems} = put_on(BuyOwnerItems, ItemList, NBody),
    NPlayerBasicData = player_basic_data:set_body(NNBody, PlayerBasicData),
    {NHouseLoverPackage, _Msgs0} = house_lover_package:add_items(PutOffItems ++ BuyLoverItems ++ PutOffItemList, HouseLoverPackage),
    {NNHouseLoverPackage, _Msgs} = house_lover_package:del_items(ItemList, NHouseLoverPackage),
    NNHouseData = house_lover_package:set_lover_package(NNHouseLoverPackage, NHouseData),
    db:write(NPlayerBasicData),
    db:write(NNHouseData),
    {true, NPlayerBasicData, NHouseData, BuyOwnerItems, BuyLoverItems, PutOffItems ++ PutOffItemList, ItemList}.

change_dress_notify(Account, BuyOwnerItems, BuyLoverItems, ItemList, PutOffItems, PlayerBasicData, HouseData, State) ->
    BuyItems = BuyOwnerItems ++ BuyLoverItems,
    AddItemList = lists:append(PutOffItems, BuyLoverItems),
    DecItemList = ItemList,
    router:cast(Account, buy_goods_event, BuyItems),
    router:cast(Account, change_goods_event, ItemList),
    Lover = player_data:get_lover(State),
    SceneName = player_data:get_scene_name(State),
    Body = player_basic_data:get_body(PlayerBasicData),
    net_helper:send2client(Account, #notify_change_dress{type=?cdt_ok, body=Body}),
    router:cast(undefined, SceneName, broadcast_other_players, 
		{Account, #notify_around_change_dress{account=Account, body=Body}}),
    router:cast(undefined, SceneName, broadcast_all_players, #notify_player_info{player=PlayerBasicData}),
    house_diamond:notify(HouseData),
    Msgs = house_lover_package:build_operator_whole_item_msgs(AddItemList, DecItemList),
    house_lover_package:send_msgs(Msgs, Account, Lover).


do_not_enought_coin(Account) ->
    %%sys_msg:send(Account, ?err_not_enough_lover_diamond),
    net_helper:send2client(Account, #notify_change_dress{type=?cdt_coin_fail}).

do_not_exist_item(Account, NoExistItems) ->
    net_helper:send2client(Account, #notify_change_dress{type=?cdt_item_fail, item_list=NoExistItems}).

put_on(BuyOwnerItems, ItemList, Body) ->
    PutOnItems = lists:append(BuyOwnerItems, ItemList),
    player_body:puton(Body, PutOnItems).

%% 购买物品
buy_goods(GoodsList, LoverGoodsList, HouseData, LoginType) ->
    {NHouseData, BuyOwnerItems} = do_buy_goods(GoodsList, HouseData, LoginType),
    {NNHouseData, BuyLoverItems} = do_buy_goods(LoverGoodsList, NHouseData, LoginType),
    {BuyOwnerItems, BuyLoverItems, NNHouseData}.

do_buy_goods(GoodsList, HouseData, LoginType) ->
    case GoodsList of
	[] ->
	    {HouseData, []};
	_ ->
	    Items = sysshop:buy_goods(GoodsList),
	    {TotalCoin, _TotalQCoin} = sysshop:calc_goods_cost(GoodsList, LoginType),
	    NHouseData = house_diamond:dec_diamond(TotalCoin, HouseData),
	    {NHouseData, Items}
    end.
