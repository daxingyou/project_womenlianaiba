%%%-------------------------------------------------------------------
%%% @author linyijie <linyj@35info.cn>
%%% @copyright (C) 2012, linyijie
%%% @doc
%%%  农场， 种植系统
%%% @end
%%% Created : 10 Jul 2012 by linyijie <linyj@35info.cn>
%%%-------------------------------------------------------------------
-module(farm).

-include("tplt_def.hrl").
-include("router.hrl").
-include("packet_def.hrl").
-include("sys_msg.hrl").
-include("player_buff.hrl").
-include("common_def.hrl").
-include("resource.hrl").
-include("records.hrl").

-export([start/1, handle_cast/2, get_crops/1, send_farm_data/2, reduce_all_fruit_time/4, 
	 increase_fruit/3, broadcast_farm_data/2, is_all_crop_mature/1, has_event/1]).
-compile(export_all).

-record(crop, {inst_id = 0,     %% 家具实例ID
	       crop_id = 0,     %% 物品的ID
	       time,            %% 种植时间
	       fruit_id = 0,    %% 果实的ID
	       fruit_count = 0, %% 果实的数量
	       events=[]        %% 事件列表
	      }).

-record(farm, {house_id,    %% 房屋的ID
	       crops        %% 农作物列表
	       }).

-record(farm_limit, {account,
		     date,
		     limit
	       }).

-record(farm_max_flowerpot, {account,
			     max_number
			    }).

-define(water, 1).      %% 浇水
-define(fertilize, 2).  %% 施肥
-define(plant, 3).      %% 种植

-define(pt_diamond, 1).   %% 水晶消费
-define(pt_love_coin, 2). %% 恋爱币

start(Account) ->
    [router:make_event_source(?msg_req_plant_crop, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_crop_event, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_delete_crop, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_pick_crop_fruit, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_all_crop_event, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_house_max_flowerpot, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_add_flowerpot_number, Account, {Account, ?MODULE})
    ]. 

%% 判断所有作物是否都成熟了
is_all_crop_mature(Crops) ->
    L = [is_crop_mature(Crop) || Crop <-Crops],
    case lists:member(false, L) of
	true -> false;
	false -> true
    end.

get_crops(HouseID) ->
    Farm = get_farm_data(HouseID),
    Farm#farm.crops.

%% 减少所有作物的成熟时间
reduce_all_fruit_time(Account, PlayerData, HouseData, ReduceTime) ->
    F = fun() ->
		HouseID = house:get_house_id(HouseData),
		Farm = get_farm_data(HouseID),
		case [reduce_fruit_time(Crop, ReduceTime) || Crop <- Farm#farm.crops] of
		    [] -> {error, ?msg_not_need_reduce_fruit_time};
		    Crops ->
			Farm1 = Farm#farm{crops = Crops},
			save(Farm1),
			Farm1
		end
	end,
    case db:transaction(F) of
	{error, MsgID} -> sys_msg:send(Account, MsgID); 
	Farm2 -> 
	    broadcast_farm_data(PlayerData, Farm2)
    end.

reduce_fruit_time(Crop, ReduceTime) ->
    Crop#crop{time = datetime:dec_time(Crop#crop.time, ReduceTime)}.

%% 增加产量
increase_fruit(Account, Lover, BuffID) ->
    player_buff:add_buff(Account, BuffID),
    case Lover /= '' of
	true ->
	    player_buff:add_buff(Lover, BuffID);
	false -> ok
    end.

%% 请求种作物
handle_cast({#msg{src=Account}, #req_plant_crop{seed_id=SeedID}}, PlayerData) ->
    handle_plant_crop(Account, SeedID, PlayerData),
    {noreply, PlayerData};

%% 请求处理作物的事件: 浇水, 施肥
handle_cast({#msg{src=Account}, #req_crop_event{house_id=HouseID, inst_id=InstID, 
						event_type= EType, event_id=EventID}}, PlayerData) ->
    handle_crop_event(Account, HouseID, InstID, EType, EventID, PlayerData),
    {noreply, PlayerData};

%% 请求处理作物的事件: 浇水, 施肥
handle_cast({#msg{src=Account}, #req_all_crop_event{house_id=HouseID, 
						    event_type= EType}}, PlayerData) ->
    handle_all_crop_event(Account, HouseID, EType, PlayerData),
    {noreply, PlayerData};

%% 请求采摘果实
handle_cast({#msg{src=Account}, #req_pick_crop_fruit{crop_id=CropID}}, PlayerData) ->
    handle_pick_crop_fruit(Account, CropID, PlayerData),
    {noreply, PlayerData};

%% 请求铲除作物
handle_cast({#msg{src=Account}, #req_delete_crop{crop_id=CropID}}, PlayerData) ->
    handle_delete_crop(Account, CropID, PlayerData),
    {noreply, PlayerData};

%% 请求房屋可以摆放最多的花盆数量
handle_cast({#msg{src=Account}, #req_house_max_flowerpot{}}, PlayerData) ->
    [BasicData] = db:dirty_read(player_basic_data, Account),
    HouseID = player_basic_data:get_house_id(BasicData),
    [HouseData] = db:dirty_read(house_data, HouseID),
    init_house_max_flowerpot(HouseData),
    {A1, A2} = house:get_owner(HouseData),
    Num1 = get_player_max_flowerpot(A1),
    Num2 = get_player_max_flowerpot(A2),
    Number = Num1 + Num2,
    OwnerNumber = case Account == A1 of
		      true -> Num1;
		      false -> Num2
		  end,
    Packet = #notify_house_max_flowerpot{house_id = HouseID, owner_number=OwnerNumber, max_number = Number},
    net_helper:send2client(Account, Packet),
    {noreply, PlayerData};

%% 请求增加(解锁)花盆
handle_cast({#msg{src=Account}, #req_add_flowerpot_number{}}, PlayerData) ->
    handle_add_flowerpot_number(Account),
    {noreply, PlayerData}.

can_add_flowerpot_number(Level, LoveCoin, HouseData, Tplt) ->
    #flowerpot_unlock{level=NeedLevel, coin=NeedCoin, 
		      item_id1=ItemID1, count1=Count1,
		      item_id2=ItemID2, count2=Count2,
		      item_id3=ItemID3, count3=Count3,
		      item_id4=ItemID4, count4=Count4} = Tplt,
    case Level < NeedLevel of
	true -> throw({false, ?err_not_enough_level});
	false -> ok
    end,
    case LoveCoin < NeedCoin of
	true -> throw({false, ?err_not_enough_lover_diamond});
	false -> ok
    end,
    [C1, C2, C3, C4] = house_pack:get_item_count_by_tempid([ItemID1, ItemID2, ItemID3, ItemID4], HouseData, []),
    case C1 < Count1 of
	true -> throw({false, ?err_item_count_not_enough});
	false -> ok
    end,
    case C2 < Count2 of
	true -> throw({false, ?err_item_count_not_enough});
	false -> ok
    end,
    case C3 < Count3 of
	true -> throw({false, ?err_item_count_not_enough});
	false -> ok
    end,
    case C4 < Count4 of
	true -> throw({false, ?err_item_count_not_enough});
	false -> ok
    end,
    true.

handle_add_flowerpot_number(Account) ->
    [BasicData] = db:dirty_read(player_basic_data, Account),
    HouseID = player_basic_data:get_house_id(BasicData),
    [HouseData] = db:dirty_read(house_data, HouseID),
    Level = house_level_exp:get_level(HouseData), 
    LoveCoin = house_diamond:get_lover_diamond(HouseData),
    Number = get_player_max_flowerpot(Account),
    Index = Number + 1,
    Tplt = tplt:get_data2(flowerpot_unlock, Index),
    #flowerpot_unlock{coin=NeedCoin, 
		      item_id1=ItemID1, count1=Count1,
		      item_id2=ItemID2, count2=Count2,
		      item_id3=ItemID3, count3=Count3,
		      item_id4=ItemID4, count4=Count4}= Tplt,
    try can_add_flowerpot_number(Level, LoveCoin, HouseData, Tplt) of
	true ->
	    %% 删除指定的材料
	    DelItems = [{ItemID1, Count1}, {ItemID2, Count2}, {ItemID3, Count3}, {ItemID4, Count4}],
	    {HouseData1, Msgs} = house_pack:del_items_by_count(DelItems, HouseData),

	    %% 删除所需的水晶
	    %% 保存数据库
	    HouseData2 = house_diamond:dec_diamond(NeedCoin, HouseData1),
	    db:dirty_write(HouseData2),

	    Number1 = Number + 1,
	    db:dirty_write(#farm_max_flowerpot{account=Account,max_number=Number1}),

	    %% 发送物品, 水晶的数据给客户端
	    house_diamond:notify(HouseData2),
	    house_pack:send_msgs(Msgs, HouseData2),

	    {A1, A2} = house:get_owner(HouseData),
	    PairNumber = case Account == A1 of
			      true -> get_player_max_flowerpot(A2);
			      false ->  get_player_max_flowerpot(A1)
			  end,
	    Packet = #notify_house_max_flowerpot{house_id = HouseID,owner_number=Number1, 
						 max_number = Number1 + PairNumber},
	    net_helper:send2client(Account, Packet),
	    router:cast(Account, on_unlock_flowerpot, Account)
    catch
	throw:{false, Reason} -> sys_msg:send(Account, Reason)
    end.

handle_delete_crop(Account, CropID, PlayerData) ->
    F = fun() ->
		HouseData = house_pack:read(Account),
		[BasicData] = db:read(player_basic_data, Account),
		case player_hp:dec_hp(1, BasicData, HouseData) of
		    {ok, BasicData1} ->
			HouseID = house:get_house_id(HouseData),
			Farm = get_farm_data(HouseID),
			case get_crop_data(CropID, Farm) of
			    empty -> {error, ?msg_flowerpot_not_crop}; 
			    Crop ->
				Farm1 = delete_crop(Crop, Farm),
				save(Farm1),
				player_hp:save_hp(BasicData1),
				{Crop, BasicData1, HouseData}
			end;
		    {false, MsgID} ->
			{error, MsgID}
		end
	end,
    case db:transaction(F) of
	{error, MsgID1} -> sys_msg:send(Account, MsgID1); 
	{Crop2, BasicData2, HouseData} ->
	    player_hp:send(Account, BasicData2, HouseData),
	    Packet = #notify_delete_crop{crop_id = Crop2#crop.inst_id, result = 1},
	    broadcast_data(PlayerData, Packet)
    end.

handle_pick_crop_fruit(Account, CropID, PlayerData) ->
    F = fun() ->
		%% 如果不是屋主, 不能采摘, 这里会匹配错误, 会异常
		HouseData = house_pack:read(Account),
		[BasicData] = db:read(player_basic_data, Account),
		case player_hp:dec_hp(1, BasicData, HouseData) of
		    {ok, BasicData1} ->
			HouseID = house:get_house_id(HouseData),
			Farm = get_farm_data(HouseID),
			case get_crop_data(CropID, Farm) of
			    empty -> {error, ?msg_flowerpot_not_crop};
			    Crop ->
				Fruits = give_fruits(Account, Crop),
				{HouseData1, ItemMsgs} = house_pack:add_items(Fruits, HouseData),
				Farm1 = delete_crop(Crop, Farm),
				save(Farm1),
				house_pack:save(HouseData1),
				player_hp:save_hp(BasicData1),
				{Crop, ItemMsgs, BasicData1, HouseData1, Fruits}
			end;
		    {false, MsgID} ->
			{error, MsgID}
		end
	end,
    case db:transaction(F) of
	{error, MsgID1} -> sys_msg:send(Account, MsgID1);
	{Crop2, ItemMsgs, BasicData2, HouseData2, Fruits} ->
	    player_hp:send(Account, BasicData2, HouseData2),
	    house_pack:send_msgs(ItemMsgs, HouseData2),
	    Packet = #notify_pick_crop_fruit{house_id=house:get_house_id(HouseData2), 
					     crop_id=Crop2#crop.inst_id,result=1},
	    broadcast_data(PlayerData, Packet),
	    [begin
		 send_get_fruit_msg(Account, FruitID, FruitCount),
		 router:cast(Account, on_pick_up_success, FruitCount)
	     end || {FruitID, FruitCount} <- Fruits]
    end.

give_fruits(Account, Crop) ->
    case player_buff:is_buff_expired(Account, ?hb_increase_fruit) of
	true -> 
	    case is_list(Crop#crop.fruit_id) of
		true -> Crop#crop.fruit_id;
		false -> [{Crop#crop.fruit_id, Crop#crop.fruit_count}]
	    end;
	false ->
	    Buff = player_buff:get_buff(Account, ?hb_increase_fruit),
	    Param = case Buff of
			[] -> 1;
			_ -> player_buff:get_params(Buff)
		    end,
	    case is_list(Crop#crop.fruit_id) of
		true -> 
		    Param1 = list_to_float(binary_to_list(Param)),
		    [{ID, trunc(C * Param1)} || {ID, C} <- Crop#crop.fruit_id];
		false ->
		    [{Crop#crop.fruit_id, trunc(Crop#crop.fruit_count * Param)}]
	    end
    end.

send_get_fruit_msg(Account, FruitID, FruitCount) ->
    #item_tplt{name=FruitName} = tplt:get_data2(item_tplt, FruitID),
    sys_msg:send(Account, ?msg_get_fruit_count, [FruitName, FruitCount]).

handle_all_crop_event(Account, HouseID, EventType, PlayerData) ->
    F = fun() ->
		Farm = get_farm_data(HouseID),
		case EventType of
		    ?water ->
			[case get_crop_event_id(EventType, Crop) of
			     0 -> ok;
			     EventID ->
				 handle_water_event(Account, HouseID, Crop#crop.inst_id, EventID, PlayerData)
			 end || Crop <- Farm#farm.crops];
		    ?fertilize ->
			[case get_crop_event_id(EventType, Crop) of
			     0 -> ok;
			     EventID ->
				 handle_fertilize_event(Account, HouseID, Crop#crop.inst_id, EventID, PlayerData)
			 end || Crop <- Farm#farm.crops]
		end
	end,
    db:transaction(F).

%% 处理玩家的作物事件
handle_crop_event(Account, HouseID, InstID, EventType, EventID, PlayerData) ->
    case EventType of
	?water ->
	    handle_water_event(Account, HouseID, InstID, EventID, PlayerData);
	?fertilize ->
	    handle_fertilize_event(Account, HouseID, InstID, EventID, PlayerData)
    end.

handle_water_event(Account, HouseID, InstID, EventID, PlayerData) ->
    F = fun() ->
		Farm = get_farm_data(HouseID),
		case get_crop_data(InstID, Farm) of
		    empty -> {error, ?msg_flowerpot_not_crop};
		    Crop ->
			case delete_crop_event(EventID, Crop) of
			    false -> {error, ?msg_crop_event_handled};
			    Crop1 ->
				PartyCoinFun = party_coin:tran_add(Account, 10),
				Farm1 = replace_crop(Crop1, Farm),
				Limit = get_farm_limit_data(Account),
				Limit1 = Limit#farm_limit{limit=Limit#farm_limit.limit+1},
				db:dirty_write(Limit1),
				save(Farm1),
				{Crop1, Limit1#farm_limit.limit, PartyCoinFun}
			end
		end
	end,
    case db:transaction(F) of
	{error, MsgID1} -> sys_msg:send(Account, MsgID1);
	{Crop2, WaterLimit, PartyCoinFun} ->
	    PartyCoinFun(),
	    broadcast_crop_data(PlayerData, HouseID, Crop2, WaterLimit, ?water),
	    router:cast(Account, on_water_success, Crop2#crop.crop_id),
	    player_intimate:add_house_intimate(Account, HouseID, common_def:get_val(intimate_of_wating))
    end.

handle_fertilize_event(Account, HouseID, InstID, EventID, PlayerData) ->
    F = fun() ->
		HouseData = house_pack:read(Account),
		Farm = get_farm_data(HouseID),
		case get_crop_data(InstID, Farm) of
		    empty -> {error, ?msg_flowerpot_not_crop};
		    Crop ->
			case delete_crop_event(EventID, Crop) of
			    false -> {error, ?msg_crop_event_handled};
			    Crop1 ->
				case house_pack:del_item_by_tempid(2200041, HouseData) of
				    {false, Err} -> {error, Err};
				    {HouseData1, ItemMsgs} ->
					PartyCoinFun = party_coin:tran_add(Account, 50),
					Farm1 = replace_crop(Crop1, Farm),
					save(Farm1),
					house_pack:save(HouseData1),
					{Crop1, HouseData1, ItemMsgs, PartyCoinFun}
				end
			end
		end
	end,
    case db:transaction(F) of
	{error, MsgID} -> sys_msg:send(Account, MsgID);
	{Crop2, HouseData4, ItemMsgs1, PartyCoinFun} ->
	    PartyCoinFun(),
	    house_pack:send_msgs(ItemMsgs1, HouseData4),
	    broadcast_crop_data(PlayerData, HouseID, Crop2, 0, ?fertilize),
	    router:cast(Account, on_fertilize_success, Crop2#crop.crop_id),
	    player_intimate:add_house_intimate(Account, HouseID, common_def:get_val(intimate_of_fertilize))
    end.


%% 发送农场数据给客户端
send_farm_data(Account, HouseData) ->
    HouseID = house:get_house_id(HouseData),
    Farm = get_farm_data(HouseID, dirty),
    Farm2 = case find_not_exist_flowerpot(Farm#farm.crops, HouseData) of
		[] -> 
		    data_helper:format("not exist flowerpot~n"),
		    Farm;
		Flowerpots ->
		    %% 删除已经不存在的花盆对应的作物
		    Farm1 = delete_crops(Flowerpots, Farm),
		    db:dirty_write(Farm1),
		    Farm1
	    end,
    send_data(Account, Farm2),
    case house:is_house_owner(HouseData, Account) of
	true ->
	    player_buff:notify(Account, ?hb_increase_fruit);
	false -> ok
    end.

broadcast_farm_data(PlayerData, Farm) when is_record(Farm, farm) ->
    Limit = get_farm_limit_data(player_data:get_account(PlayerData)),
    Packet = #notify_farm_data{house_id= Farm#farm.house_id, water_limit=Limit#farm_limit.limit,
			       crops = [translate_crop(Crop) || Crop <- Farm#farm.crops]},
    broadcast_data(PlayerData, Packet);
broadcast_farm_data(PlayerData, HouseData) ->
    HouseID = house:get_house_id(HouseData),
    Farm = get_farm_data(HouseID, dirty),
    Farm2 = case find_not_exist_flowerpot(Farm#farm.crops, HouseData) of
		[] -> 
		    data_helper:format("not exist flowerpot~n"),
		    Farm;
		Flowerpots ->
		    %% 删除已经不存在的花盆对应的作物
		    Farm1 = delete_crops(Flowerpots, Farm),
		    db:dirty_write(Farm1),
		    Farm1
	    end,
    broadcast_farm_data(PlayerData, Farm2).


%% 找出已经不存在的花盆
find_not_exist_flowerpot(Crops, HouseData) ->
    [Crop#crop.inst_id || Crop <- Crops,
	 furniture:is_exist(Crop#crop.inst_id, HouseData) == false].

%% 获得空的花盆列表
get_empty_flowerpots(HouseData, Farm) ->
    L = house:get_flowerpots(HouseData),
    FurIDs = [Fur#house_furniture.instance_id || Fur <- L],
    get_empty_flowerpots(FurIDs, Farm#farm.crops, []).

get_empty_flowerpots([], _Crops, Flowerpots) ->
    Flowerpots;
get_empty_flowerpots([FurID | Rest], Crops, Flowerpots) ->
    case lists:keymember(FurID, #crop.inst_id, Crops) of
	false -> get_empty_flowerpots(Rest, Crops, [FurID | Flowerpots]);
	true -> get_empty_flowerpots(Rest, Crops, Flowerpots)
    end.

is_level_enough(HouseData, #crop_tplt{level=Level}) ->
    {house_level_exp:get_level(HouseData) >= Level, Level}.

dec_money(HouseData, SeedID, Count, Tplt, Fun, PlayerData) ->
    TotalPrice = Count * Tplt#crop_tplt.price,
    Type = Tplt#crop_tplt.price_type,
    case Type of
	?pt_diamond -> %% 水晶
	    F = fun(Ret, HouseData2) ->
			case Ret of
			    true -> Fun(true, Type, HouseData2, TotalPrice);
			    false -> Fun(false, Type, HouseData2, TotalPrice)
			end
		end,
	    house_diamond:dec_diamond(TotalPrice, HouseData, F);
	?pt_love_coin -> %% 判断爱情币是否足够 
	    ShipCallback = 
		fun(#order{status=Status}=_Order)-> 			   
			case (Status =:= ?order_payed) of
			    true ->
				Fun(true, Type, HouseData, TotalPrice),
				?pay_shipped;
			    _ ->
				Fun(false, Type, HouseData, TotalPrice),
				?pay_error
			end				       
		end,
	    player_love_coin:pay([{SeedID, Count, Tplt#crop_tplt.price}], 
				 ShipCallback, ?order_goods_meta_farm, PlayerData)
    end.

can_plant_crop(HouseData, Farm, Tplt) ->
    case get_empty_flowerpots(HouseData, Farm) of
	[] -> {error, ?msg_not_empty_flowerpot};
	L ->
	    case is_level_enough(HouseData, Tplt) of
		{false, UseLevel} -> {error, ?msg_farm_level_not_enough, UseLevel};
		{true, _} -> {true, L}
	    end
    end.


plant_crop([], Farm, _SeedID, _Tplt) ->
    Farm;
plant_crop([Flowerpot | Rest], Farm, SeedID, Tplt) ->
    Crop = make_crop(Flowerpot, SeedID, Tplt),
    Farm1 = add_crop(Crop, Farm),
    plant_crop(Rest, Farm1, SeedID, Tplt).


%% 种植作物
handle_plant_crop(Account, SeedID, PlayerData) ->
    F = fun() ->
		HouseData2 = house_pack:read(Account),
		HouseID = house:get_house_id(HouseData2),
		FarmData = get_farm_data(HouseID),
		{HouseData2, FarmData}
	end,
    {HouseData, Farm} = db:transaction(F),
    Tplt = tplt:get_data2(crop_tplt, SeedID),
    case can_plant_crop(HouseData, Farm, Tplt) of
	{true, L} ->
	    Farm1 = plant_crop(L, Farm, SeedID, Tplt),
	    Fun = fun(Ret, Type, HouseData1, _TotalMoney) ->
			  case Ret of
			      true ->
				  db:transaction(fun() -> db:write(Farm1) end),
				  case Type of
				      ?pt_diamond -> house_diamond:notify(HouseData1);
				      ?pt_love_coin -> ok
				  end,
				  broadcast_farm_data(PlayerData, Farm1),
				  router:cast(Account, on_plant_crop_success, SeedID);
			      false -> 
				 case Type of 
				     ?pt_diamond -> sys_msg:send(Account, ?err_not_enough_lover_diamond);
				     ?pt_love_coin -> ok
				 end
			  end
		  end,
	    dec_money(HouseData, SeedID, length(L), Tplt, Fun, PlayerData);
	{error, MsgID} -> sys_msg:send(Account, MsgID);
	{error, MsgID, UseLevel1} -> sys_msg:send(Account, MsgID, [UseLevel1])
    end.

add_crop(Crop, Farm) ->
    Crops = lists:keydelete(Crop#crop.inst_id, #crop.inst_id, Farm#farm.crops),
    Farm#farm{crops = [Crop | Crops]}.


%% 删除指定的作物
delete_crop(CropID, Farm) when is_integer(CropID) ->
    Farm#farm{crops = lists:keydelete(CropID, #crop.inst_id, Farm#farm.crops)};
delete_crop(#crop{inst_id=InstID}, Farm) ->
    Farm#farm{crops = lists:keydelete(InstID, #crop.inst_id, Farm#farm.crops)}.


delete_crops([], Farm) ->
    Farm;
delete_crops([CropID | Rest], Farm) ->
    Farm1 = delete_crop(CropID, Farm),
    delete_crops(Rest, Farm1).

%% 替换农作物
replace_crop(#crop{inst_id=CropID}=Crop, Farm) ->
    Farm#farm{crops = lists:keyreplace(CropID, #crop.inst_id, Farm#farm.crops, Crop)}.


%% 生成一个新的作物
make_crop(InstID, CropID, Tplt) ->
    IDs = util:eval(binary_to_list(Tplt#crop_tplt.fruit_id) ++ "."),
    IdList = [{FruitID, Count} || {FruitID, Count, Ratio} <- IDs, Ratio >= rand:uniform() * 100],
    #crop{inst_id = InstID,
	  crop_id = CropID,
	  time = datetime:localtime(),
	  fruit_id = IdList,
	  fruit_count = 0,
	  events = make_events(Tplt#crop_tplt.ripe_time, Tplt#crop_tplt.event_count)
	 }.

%% 生成事件列表
%% 事件结构: {ID, 类型, 时间}
make_events(RipeTime, Count) ->
    make_events_impl(RipeTime div Count, Count, []).

make_events_impl(_DT, 0, Events) ->
    Events;
make_events_impl(DT, Count, Events) ->
    Event = {Count, rand:uniform(2), rand:uniform(DT * (Count-1), DT * Count)}, 
    make_events_impl(DT, Count-1, [Event|Events]).

%% 获得农场数据
get_farm_data(HouseID) ->
    case db:read(farm, HouseID) of
	[] -> #farm{house_id=HouseID, crops=[]};
	[Farm] -> Farm
    end.
get_farm_data(HouseID, dirty) ->
    case db:dirty_read(farm, HouseID) of
	[] -> #farm{house_id=HouseID, crops=[]};
	[Farm] -> Farm
    end.

get_farm_limit_data(Account) ->
    case db:dirty_read(farm_limit, Account) of
	[] -> #farm_limit{account=Account, date=datetime:localtime(), limit=0};
	[Limit] -> 
	    Now = datetime:localtime(),
	    WaterDate = Limit#farm_limit.date,
	    WaterDate1 = WaterDate#stime{hour=0, minute=0, second=0},
	    Now1 = Now#stime{hour=0, minute=0, second=0},
	    case datetime:diff_time(WaterDate1, Now1) > 0 of
		true -> Limit#farm_limit{date=Now, limit=0};
		false -> Limit
	    end
    end.

init_house_max_flowerpot(HouseData) ->
    {A1, A2} = house:get_owner(HouseData),
    init_player_max_flowerpot(A1, HouseData),
    init_player_max_flowerpot(A2, HouseData).

init_player_max_flowerpot('', _HouseData) ->
    ok;
init_player_max_flowerpot(Account, HouseData) ->
    case house:is_house_owner(HouseData, Account) of
	true ->
	    case db:dirty_read(farm_max_flowerpot, Account) of
		[] ->
		    HouseTpltID = house:get_tplt_id(HouseData), 
		    #house_tplt{max_flowerpot=Max} = tplt:get_data2(house_tplt, HouseTpltID),
		    D = #farm_max_flowerpot{account=Account, max_number=Max},
		    db:dirty_write(D),
		    Max;
		[#farm_max_flowerpot{max_number=Max1}] -> Max1
	    end
    end.

get_player_max_flowerpot('') ->
    0;
get_player_max_flowerpot(Account) ->
    [#farm_max_flowerpot{max_number=Number}] = db:dirty_read(farm_max_flowerpot, Account),
    Number.

%% 获得作物的数据
get_crop_data(InstID, #farm{crops=Crops}) ->
    case [Crop || Crop <- Crops, Crop#crop.inst_id == InstID] of
	[] -> empty;
	[Crop] -> Crop
    end.

%% 删除过期的事件
delete_crop_event(EventID, Crop) ->
    case lists:keyfind(EventID, 1, Crop#crop.events) of
	false -> false;
	{_ID, _Type, _EventTime} -> 
	    DT = datetime:diff_time(Crop#crop.time, datetime:localtime()),
	    Events = lists:keydelete(EventID, 1, Crop#crop.events),
	    Events1 = [E || {_Id, _Type1, Time}=E <- Events, Time >= DT],
	    Crop#crop{events=Events1}
    end.

has_event(Account) ->
    F = fun() -> 
		HouseData = house_pack:read(Account),
		HouseID = house:get_house_id(HouseData),
		Farm = get_farm_data(HouseID),
		case has_event(?water, Farm#farm.crops) of
		    false ->
			has_event(?fertilize, Farm#farm.crops);
		    true  -> true
		end
	end,
    db:transaction(F).
 
has_event(_EventType, []) ->
    false; 
has_event(EventType, [Crop | Rest]) ->
    case is_crop_mature(Crop) of
	true -> has_event(EventType, Rest);
	false ->
	    case get_crop_event_id(EventType, Crop) of
		0 -> has_event(EventType, Rest);
		_ID -> true
	    end
    end.

get_crop_event_id(EventType, Crop) ->
    case lists:keyfind(EventType, 2, Crop#crop.events) of
	false -> false;
	{ID, _Type, EventTime} -> 
	    DT = datetime:diff_time(Crop#crop.time, datetime:localtime()),
	    case EventTime - DT > 0 of
		false -> ID;
		true -> 0
		end
    end.
    

save(Farm) when is_record(Farm, farm) ->
    db:write(Farm).

%% 发送数据
send_data(Account, #farm{house_id=HouseID, crops=Crops}) ->
    Limit = get_farm_limit_data(Account),
    Packet = #notify_farm_data{house_id= HouseID, water_limit=Limit#farm_limit.limit,
			      crops = [translate_crop(Crop) || Crop <- Crops]},
    net_helper:send2client(Account, Packet).

broadcast_crop_data(PlayerData, HouseID, Crop, WaterLimit, OpType) ->
    Packet = #notify_crop_data{house_id=HouseID, op=OpType, crop = translate_crop(Crop), water_limit=WaterLimit},
    broadcast_data(PlayerData, Packet).

broadcast_data(PlayerData, Packet) ->
    SceneName = player_data:get_scene_name(PlayerData),
    net_helper:broadcast(SceneName, Packet).

%% 进行数据转换， 以满足网络接口的要求
translate_crop(Crop) ->
    Events = case Crop#crop.events of
		[] -> [{0, 0, 0}];
		Events1 -> Events1
	    end,
    %% FruitID = case is_list(Crop#crop.fruit_id) of
    %% 		  true -> [ID ||{ID, _} <- Crop#crop.fruit_id];
    %% 		  false -> [Crop#crop.fruit_id]
    %% 	      end,
    Tplt = tplt:get_data2(crop_tplt, Crop#crop.crop_id),
    DT = datetime:diff_time(Crop#crop.time, datetime:localtime()),
    RestTime = Tplt#crop_tplt.ripe_time - DT,
    #crop_data{inst_id = Crop#crop.inst_id,
	       item_id = Crop#crop.crop_id,     
	       rest_time = erlang:max(RestTime, 0),
	       fruit_id = [],%%FruitID
	       fruit_count = [], %%[Count ||{_, Count} <- Crop#crop.fruit_id],
	       evt = [translate_event(E, DT) || E <- Events]
	      }.

translate_event({ID, Type, EventTime}, DT) ->
    ET = EventTime - DT,
    #crop_event{id=ID, type = Type, time=ET}.    

%% 判断作物是否成熟了
is_crop_mature(Crop) ->
    Tplt = get_data(Crop#crop.crop_id),
    DT = datetime:diff_time(Crop#crop.time, datetime:localtime()),
    RestTime = Tplt#crop_tplt.ripe_time - DT,
    case RestTime > 0 of
	true -> false;
	false -> true
    end.

%%: 这两个ID做特殊处理, 因为是月饼的老数据, 数据表里不会再有, 但是玩家那边的数据还会保留, 因此在代码里写死, 防止出错
get_data(220004) ->
    #crop_tplt{crop_id=220004,level=1,event_count=1,fruit_id=230011,count=1,ripe_time=60};
get_data(220005) ->
    #crop_tplt{crop_id=220005,level=1,event_count=1,fruit_id=230009,count=1,ripe_time=14400};
get_data(CropID) ->
    tplt:get_data2(crop_tplt, CropID).
