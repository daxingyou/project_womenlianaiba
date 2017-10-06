%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2013, linyibin
%%% @doc
%%% 食物制作
%%% @end
%%% Created : 24 Jun 2013 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(player_food_product).

-include("packet_def.hrl").
-include("house_data.hrl").
-include("tplt_def.hrl").
-include("sys_msg.hrl").
-include("router.hrl"). 
-include("common_def.hrl").
-include("enum_def.hrl").
-include("resource.hrl").
-include("records.hrl").

%% API
-export([start/1, settlement/1, do_settlement/2]).
-export([handle_cast/2, imediately_complete_product/1]).

-record(product_tplt, {id,
		       copies,
		       tplt}).

-record(product, {inst_id,
		  id,
		  product_id,
		  copies,
		  diamond      %% 花费的水晶，用于后续如果取消后，水晶的补偿
		 }).

-record(products, {start_time, %% 开始时间
		   process     %% 加工
		  }).

%%%===================================================================
%%% API
%%%===================================================================
start(Account) ->
    [router:make_event_source(?msg_req_make_product, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_complete_product, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_immediately_complete_product, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_remove_product, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_products, Account, {Account, ?MODULE})
    ].

%%--------------------------------------------------------------------
%% @doc
%% @ 结算产品
%% @end
%%--------------------------------------------------------------------
settlement(Account) ->
    F = fun() ->
		PlayerFood = player_food:get(Account),
		Products = get_products(PlayerFood),
		case Products == [] of
		    true ->
			ok;
		    false ->
			NPlayerFood = do_settlement(Account, PlayerFood),
			db:write(NPlayerFood)
		end
	end,
    db:transaction(F).

do_settlement(Account, PlayerFood) ->
    Now = datetime:localtime(),
    Products = get_products(PlayerFood),
    StartTime = Products#products.start_time,
    Process = Products#products.process,
    {NStartTime, NProcess, NPlayerFood} = 
	lists:foldl(fun(#product{id=ID, 
				 inst_id=InstID,
				 product_id=ProductID, 
				 copies=Copies,
				 diamond=Diamond}, {NewStartTime, NewProcess, NewPlayerFood}) ->
			    PlayerFoodProductTplt = tplt:get_data(player_food_product_tplt, ProductID),
			    ConsumeTime = PlayerFoodProductTplt#player_food_product_tplt.consume_time,
			    DueTime = datetime:add_time(NewStartTime, ConsumeTime),
			    case datetime:diff_time(DueTime, Now) >= 0 of
				true ->
				    router:cast(Account, complete_product_event, Account),
				    NewPlayerFood1 = player_food_stock:add_value(ID, NewPlayerFood, Copies),
				    {DueTime, NewProcess, NewPlayerFood1};
				false ->
				    {NewStartTime, [#product{id=ID, 
							     inst_id=InstID,
							     product_id=ProductID, 
							     copies=Copies,
							     diamond=Diamond}|NewProcess], NewPlayerFood}
			    end
		    end, {StartTime, [], PlayerFood}, Process),
    NProducts = Products#products{start_time=NStartTime, process=lists:reverse(NProcess)},
    player_food:set_products(NPlayerFood, NProducts).

%%%===================================================================
%%% Handle cast
%%%===================================================================
handle_cast({#msg{src=Account}, #req_make_product{products=Products, start_time=StartTime}}, State) ->
    F = fun() ->
		[PlayerBasicData] = db:read(player_basic_data, Account),
		HouseId = player_basic_data:get_house_id(PlayerBasicData),
		[HouseData] = db:read(house_data, HouseId),
		PlayerFood = player_food:get(Account),
		ProductTplts = get_product_tplts(Products, PlayerFood),
		case can_make_product(ProductTplts, PlayerFood, HouseData) of
		    true ->
			make_product(ProductTplts, PlayerFood, HouseData, StartTime);
		    {false, Reason} ->
			Reason
		end
	end,
    case db:transaction(F) of
	{true, _NPlayerFood, NHouseData} ->
	    %% NProducts = player_food:get_products(NPlayerFood),
	    %% StartTime = NProducts#products.start_time,
	    house_diamond:notify(NHouseData),
	    router:cast(Account, make_product_event, Account),
	    net_helper:send2client(Account, #notify_make_product{start_time=StartTime});
	Reason ->
	    sys_msg:send(Account, Reason)
    end,
    {noreply, State};
handle_cast({#msg{src=Account}, #req_remove_product{position=Position}}, State) ->
    F = fun() ->
		%% 客户端从0开始，服务端位置从1开始
		NPosition = Position + 1,
		[PlayerBasicData] = db:read(player_basic_data, Account),
		HouseId = player_basic_data:get_house_id(PlayerBasicData),
		[HouseData] = db:read(house_data, HouseId),
		PlayerFood = player_food:get(Account),
		case can_remove_product(NPosition, PlayerFood) of
		    true ->
			remove_product(NPosition, PlayerFood, HouseData);
		    {false, Reason} ->
			Reason
		end
	end,
    case db:transaction(F) of
	{true, NPlayerFood, NHouseData} ->
	    Products = get_products(NPlayerFood),
	    StartTime = Products#products.start_time,
	    house_diamond:notify(NHouseData),
	    net_helper:send2client(Account, #notify_remove_product{start_time=StartTime});
	Reason ->
	    sys_msg:send(Account, Reason)
    end,
    {noreply, State};
handle_cast({#msg{src=Account}, #req_complete_product{}}, State) ->
    F = fun() ->
		PlayerFood = player_food:get(Account),
		case can_complete_product(PlayerFood) of
		    true ->
			complete_product(PlayerFood);
		    {false, Reason} ->
			Reason
		end
	end,
    case db:transaction(F) of
	{true, NPlayerFood} ->
	    %% Products = player_food:get_products(NPlayerFood),
	    %% StartTime = Products#products.start_time,
	    %% house_diamond:notify(NHouseData),
	    router:cast(Account, complete_product_event, Account),
	    net_helper:send2client(Account, #notify_complete_product{}),
	    player_food_stock:notify(Account, NPlayerFood);
	Reason ->
	    sys_msg:send(Account, Reason)
    end,
    {noreply, State};
handle_cast({#msg{src=Account}, #req_immediately_complete_product{}}, State) ->
    F = fun() ->
		PlayerFood = player_food:get(Account),
		Products = get_products(PlayerFood),
		Process = Products#products.process,
		LoveCoin = get_complete_product_need_love_coin(Process),
		ShipCallback = 
		    fun(#order{status=Status}=_Order)-> 			   
			    case (Status =:= ?order_payed) of
				true ->
				    NPlayerFood = imediately_complete_product(PlayerFood),
				    db:write(NPlayerFood),
				    router:cast(Account, complete_product_event, Account),
				    net_helper:send2client(Account, #notify_immediately_complete_product{}),
				    player_food_stock:notify(Account, NPlayerFood),
				    ?pay_shipped;
				_ ->
				    ?pay_error
			    end				       
		    end,

		player_love_coin:pay([{0, 1, LoveCoin}], 
				     ShipCallback, 
				     ?order_goods_meta_food_product, State)
	end,
    db:transaction(F),
    {noreply, State};
handle_cast({#msg{src=Account}, #req_products{}}, State) ->
    F = fun() ->
    		PlayerFood = player_food:get(Account),
		%% NPlayerFood = do_settlement(PlayerFood),
		%% db:write(NPlayerFood),
    		Products = player_food:get_products(PlayerFood),
		case Products == [] of
		    true ->
			{#stime{}, []};
		    false ->
			StartTime = case Products#products.start_time of
					undefined ->
					    #stime{};
					Time ->
					    Time
				    end,
			Process = Products#products.process,
			Info = 
			    lists:foldl(fun(#product{id=ID, 
						     product_id=ProductID, 
						     copies=Copies}, ProductInfo) ->
						[#product_info{id=ID, 
							       product_id=ProductID, 
							       copies=Copies}|ProductInfo]
					end, [], Process),
			{StartTime, lists:reverse(Info)}
		end
    	end,
    case db:transaction(F) of
    	{StartTime, Info} -> 
	    net_helper:send2client(Account, #notify_products{start_time=StartTime, info=Info})
    end,
    {noreply, State}.

%%%===================================================================
%%% Internal functions
%%%===================================================================
%%--------------------------------------------------------------------
%% @doc
%% @判断是否可以完成生产
%% @end
%%--------------------------------------------------------------------
can_complete_product(PlayerFood) ->
    try
	can_complete_product_by_process(PlayerFood)
	%% can_complete_product_by_time(PlayerFood)
    catch
	throw:Reason ->
	    Reason
    end.

%%--------------------------------------------------------------------
%% @doc
%% @判断是否有生产队列
%% @end
%%--------------------------------------------------------------------
can_complete_product_by_process(PlayerFood) ->
    Products = get_products(PlayerFood),
    Process = Products#products.process,
    case Process of
	[] ->
	    throw({false, ?player_food_complete_product});
	_ ->
	    true
    end.

%%--------------------------------------------------------------------
%% @doc
%% @判断该时间是否可以生产
%% @end
%%--------------------------------------------------------------------
%% can_complete_product_by_time(PlayerFood) ->
%%     Products = player_food:get_products(PlayerFood),
%%     Process = Products#products.process,
%%     Product = lists:nth(1, Process),
%%     ProductID = Product#product.product_id,
%%     PlayerFoodProductTplt = tplt:get_data(player_food_product_tplt, ProductID),
%%     StartTime = Products#products.start_time,
%%     DueTime = datetime:add_time(StartTime, PlayerFoodProductTplt#player_food_product_tplt.consume_time),
%%     Now = datetime:localtime(),
%%     case datetime:diff_time(DueTime, Now) >= 0 of
%% 	true ->
%% 	    true;
%% 	false ->
%% 	    throw({false, ?player_food_complete_product_time})
%%     end.

%%--------------------------------------------------------------------
%% @doc
%% @生产出产品，然后放入仓库
%% @end
%%--------------------------------------------------------------------
complete_product(PlayerFood) ->
    Products = get_products(PlayerFood),
    Process = Products#products.process,
    Product = lists:nth(1, Process),
    ID = Product#product.id,
    Copies = Product#product.copies,
    NProcess = lists:delete(Product, Process),
    Now=datetime:localtime(),
    NProducts = Products#products{start_time=Now, process=NProcess},
    NPlayerFood = player_food:set_products(PlayerFood, NProducts),
    %% 加库存
    CurrCopies = player_food_stock:get_value(ID, NPlayerFood),
    NNPlayerFood = 
	case CurrCopies == 0 of
	    true ->
		player_food_stock:set_dec_time(ID, Now, NPlayerFood);
	    false ->
		NPlayerFood
	end,
    NNNPlayerFood = player_food_stock:set_value(ID, NNPlayerFood, CurrCopies+Copies),
    %% 持久化
    db:write(NNNPlayerFood),
    {true, NNNPlayerFood}.

%%--------------------------------------------------------------------
%% @doc
%% @判断是否可以移除产品
%% @end
%%--------------------------------------------------------------------
can_remove_product(Position, PlayerFood) ->
    try
	can_remove_product_by_position(Position, PlayerFood)
    catch
	throw:Reason ->
	    Reason
    end.

%%--------------------------------------------------------------------
%% @doc
%% @判断移除的位置是否正确
%% @end
%%--------------------------------------------------------------------
can_remove_product_by_position(Position, PlayerFood) ->
    Products = get_products(PlayerFood),
    case Products == [] of
	true ->
	    throw({false, ?player_food_make_product_position});
	false ->
	    case Position =< length(Products#products.process) of
		true ->
		    true;
		false ->
		    throw({false, ?player_food_make_product_position})
	    end
    end.


%%--------------------------------------------------------------------
%% @doc
%% @移除产品
%% @end
%%--------------------------------------------------------------------
remove_product(Position, PlayerFood, HouseData) ->
    %% 移除产品
    Products = get_products(PlayerFood),
    Now = datetime:localtime(),
    Process = lists:nth(Position, Products#products.process),
    NProducts = 
	%% 如果移除的是第一格，那么开始日期换成当前日期
	case Position == 1 of
	    true ->
		Process1 = lists:delete(Process, Products#products.process),
		Products#products{start_time=Now, process=Process1};
	    false ->
		Process2 = lists:delete(Process, Products#products.process),
		Products#products{process=Process2}
	end,
    %% 加钱
    Diamond = Process#product.diamond,
    NHouseData = house_diamond:add_diamond(Diamond, HouseData),
    NPlayerFood = player_food:set_products(PlayerFood, NProducts),
    %% 持久化
    db:write(NPlayerFood),
    db:write(NHouseData),
    {true, NPlayerFood, NHouseData}.

%%--------------------------------------------------------------------
%% @doc
%% @判断是否可以制作商品
%% @end
%%--------------------------------------------------------------------
can_make_product(ProductTplts, PlayerFood, HouseData) ->
    try
	can_make_product_by_stock(ProductTplts, PlayerFood),
	can_make_product_by_area(ProductTplts, PlayerFood),
	can_make_product_by_diamond(ProductTplts, HouseData)
    catch
	throw:Reason ->
	    Reason
    end.

%%--------------------------------------------------------------------
%% @doc
%% @判断生产区域是否足够
%% @end
%%--------------------------------------------------------------------
can_make_product_by_area(ProductTplts, PlayerFood) ->
    %%TODO:需要加上正在制作的位置
    ProduceArea = player_food_produce:get_produce_area(PlayerFood),
    case ProduceArea >= length(ProductTplts) of
	true ->
	    true;
	false ->
	    throw({false, ?player_food_make_product_number})
    end.

%%--------------------------------------------------------------------
%% @doc
%% @判断库存是否已满
%% @end
%%--------------------------------------------------------------------
can_make_product_by_stock([], _PlayerFood) ->
    true;
can_make_product_by_stock([#product_tplt{id=ID, 
					 copies=Copies, 
					 tplt=PlayerFoodProductTplt}|ProductTplts], PlayerFood) ->
    ProductID = PlayerFoodProductTplt#player_food_product_tplt.product_id,
    MaxStockValue = player_food_stock:get_max_value(ID, ProductID, PlayerFood),
    CurrStockValue = player_food_stock:get_value(ID, PlayerFood),
    case (CurrStockValue + Copies) =< MaxStockValue of
	true ->
	    can_make_product_by_stock(ProductTplts, PlayerFood);
	false ->
	    throw({false, ?player_food_make_product_stock})
    end.

%%--------------------------------------------------------------------
%% @doc
%% @判断水晶是否足够
%% @end
%%--------------------------------------------------------------------
can_make_product_by_diamond(ProductTplts, HouseData) ->
    Diamond = house_diamond:get_lover_diamond(HouseData),
    NeedDiamond = get_make_product_need_diamond(ProductTplts),
    case Diamond >= NeedDiamond of
	true ->
	    true;
	false ->
	    throw({false, ?player_food_make_product_diamond})
    end.

%%--------------------------------------------------------------------
%% @doc
%% @获取制作产品需要的水晶
%% @end
%%--------------------------------------------------------------------
get_make_product_need_diamond(ProductTplts) ->
    lists:foldl(fun(ProductTplt, TotalDiamond) ->
			Tplt = ProductTplt#product_tplt.tplt,
			TotalDiamond + Tplt#player_food_product_tplt.diamond
		end, 0, ProductTplts).

%%--------------------------------------------------------------------
%% @doc
%% @制作商品
%% @end
%%--------------------------------------------------------------------
make_product(ProductTplts, PlayerFood, HouseData, _Now1) ->
    %% 扣水晶
    Diamond = get_make_product_need_diamond(ProductTplts),
    NHouseData = house_diamond:dec_diamond(Diamond, HouseData),
    %% %% 保存制作产品临时数据
    Now = datetime:localtime(),
    Products = get_products(PlayerFood),
    Process = Products#products.process,
    NProcess = lists:reverse(make_product_process(ProductTplts)),
    NNProcess = Process ++ NProcess,
    NNProducts = Products#products{process=NNProcess},
    NNNProducts = reset_product_start_time(Now, Process, NNProducts),
    NPlayerFood = player_food:set_products(PlayerFood, NNNProducts),
    %% 持久化
    db:write(NPlayerFood),
    db:write(NHouseData),
    {true, NPlayerFood, NHouseData}.

%%--------------------------------------------------------------------
%% @doc
%% @获取制作的食物信息
%% @end
%%--------------------------------------------------------------------
get_products(PlayerFood) ->
    Now = datetime:localtime(),
    case player_food:get_products(PlayerFood) of
	[] ->
	    #products{start_time=Now, process=[]};
	P ->
	    P
    end.

%%--------------------------------------------------------------------
%% @doc
%% @计算需要制作的食物
%% @end
%%--------------------------------------------------------------------
make_product_process(ProductTplts) ->
    lists:foldl(fun(#product_tplt{id=ID, copies=Copies, tplt=Tplt}, NewProcess) ->
			ProductID = Tplt#player_food_product_tplt.product_id,
			NeedDiamond = Tplt#player_food_product_tplt.diamond,
			case NewProcess of
			    [] ->
				[#product{inst_id=guid:make(?st_food),
					  id=ID, 
					  product_id=ProductID, 
					  copies=Copies, 
					  diamond=NeedDiamond}];
			    _ ->
				[#product{inst_id=guid:make(?st_food),
					  id=ID, 
					  product_id=ProductID, 
					  copies=Copies, 
					  diamond=NeedDiamond}|NewProcess]
			end
		end, [], ProductTplts).

%%--------------------------------------------------------------------
%% @doc
%% @重置开始时间
%% @end
%%--------------------------------------------------------------------
reset_product_start_time(Now, Process, Products) ->
    case Process of
	[] ->
	    Products#products{start_time=Now};
	_ ->
	    Products
    end.

%%--------------------------------------------------------------------
%% @doc
%% @获取当前产品Id
%% @end
%%--------------------------------------------------------------------
get_product_id(ID, PlayerFood) ->
    player_food_upgrade:get_upgrade_id(ID, PlayerFood).

%%--------------------------------------------------------------------
%% @doc
%% @获取Ids中对应的模板表数据
%% @end
%%--------------------------------------------------------------------
get_product_tplts(Products, PlayerFood) ->
    Tplts = lists:foldl(fun(#product_atom{id=ID, copies=Copies}, Tplts) ->
				ProductID = get_product_id(ID, PlayerFood),
				PlayerFoodProductTplt = tplt:get_data(player_food_product_tplt, ProductID),
				[#product_tplt{id=ID, copies=Copies, tplt=PlayerFoodProductTplt}|Tplts]
			end, [], Products),
    lists:reverse(Tplts).

%%--------------------------------------------------------------------
%% @doc
%% @获取立即完成任务需要的爱情币
%% @end
%%--------------------------------------------------------------------
get_complete_product_need_love_coin(Products) ->
    lists:foldl(fun(#product{product_id=ProductID}, TotalLoveCoin) ->
			PlayerFoodProductTplt = tplt:get_data(player_food_product_tplt, ProductID),
			TotalLoveCoin + PlayerFoodProductTplt#player_food_product_tplt.love_coin
		end, 0, Products).

imediately_complete_product(PlayerFood) ->
    Products = get_products(PlayerFood),
    Process = Products#products.process,
    lists:foldl(fun(#product{id=ID, 
			     copies=Copies}=Product, NewPlayerFood) ->
			NewProducts = get_products(NewPlayerFood),
			NewProcess = NewProducts#products.process,
			%% 去除产品
			NProcess = lists:delete(Product, NewProcess),
			Now=datetime:localtime(),
			NProducts = Products#products{start_time=Now, process=NProcess},
			NNewPlayerFood = player_food:set_products(NewPlayerFood, NProducts),
			%% 增加库存
			CurrCopies = player_food_stock:get_value(ID, NNewPlayerFood),
			NNNewPlayerFood = 
			    case CurrCopies == 0 of
				true ->
				    player_food_stock:set_dec_time(ID, Now, NNewPlayerFood);
				false ->
				    NNewPlayerFood
			    end,
			player_food_stock:set_value(ID, NNNewPlayerFood, CurrCopies+Copies)
		end, PlayerFood, Process).
