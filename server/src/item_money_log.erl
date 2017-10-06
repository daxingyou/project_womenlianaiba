%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%  物品金钱记录
%%      时间(time):  单位秒 (从0年开始)
%%      行为(action): 购买, 回收
%%      旧持有方(old_keeper): 玩家账号，房屋id, 系统(system)
%%      新持有方(keeper): 玩家账号，房屋id, 系统(system)
%%      物品类型(type): 爱情水晶类型为1, Q点为类型为2
%%      物品数量(count): 一个正数
%%      经办人(operator): 玩家账号
%%% @end
%%% Created : 15 Mar 2012 by hongjx <hongjx@35info.cn>

-module(item_money_log).

-export([log_recycle_item/5,
	 log_delete_item/4,
	 log_delete_overtime_item/3,
	 log_holiday_gain_diamond/3,
	 log_holiday_gain_item/4,
	 log_enter_home_gain/3,
	 log_other_enter_home_gain/3,
	 log_mateup_house/7,
	 log_satisfy_wish/5,
	 log_equip_on/3,
	 log_equip_off/3,
	 log_send_gift/4,
	 log_send_gift/3,
	 log_buy_items/3,
	 log_buy_item/5]).

-export([select/1, get_action/1]).

-export([select_item/2, select_item/3,        
	 select_diamond/1, select_diamond/2
	]).

-include("item_money_log.hrl").
-include("enum_def.hrl").
-include("packet_def.hrl").

get_action(?tag_holiday_gain) -> holiday_gain;
get_action(?tag_enter_home_gain) -> enter_home_gain;
get_action(?tag_other_enter_home_gain) -> other_enter_home_gain;
get_action(?tag_buy_item) -> buy_item;
get_action(?tag_recycle_item) -> recycle_item;
get_action(?tag_equip_on) -> equip_on;
get_action(?tag_equip_off) -> equip_off;
get_action(?tag_send_gift) -> send_gift;
get_action(?tag_mateup) -> mateup;
get_action(?tag_satisfy_wish) -> satisfy_wish;
get_action(?tag_delete_item) -> delete_item.

%%%===================================================================
%%% 帮人满足愿望
%%%===================================================================
log_satisfy_wish(Sender, Recver, ItemID, {MoneyType, Price}, SenderHouseID) 
  when is_integer(ItemID) ->
    log_satisfy_wish(Sender, Recver, ItemID, 1, {MoneyType, Price}, SenderHouseID);
log_satisfy_wish(Sender, Recver, ItemData, {MoneyType, Price}, SenderHouseID) ->
    ItemID = item:get_tempid(ItemData),
    log_satisfy_wish(Sender, Recver, ItemID, {MoneyType, Price}, SenderHouseID).
log_satisfy_wish(Sender, Recver, ItemID, ItemCount, {MoneyType, Price}, SenderHouseID) 
  when is_atom(Sender),
       is_atom(Recver),
       (MoneyType =:= ?mt_diamond) or (MoneyType =:= ?mt_love_coin),
       is_integer(Price),
       is_integer(SenderHouseID) -> 
    Time = datetime:datetime_to_gregorian_seconds(datetime:local_time()),
    %% 玩家给系统钱
    do_log(?tag_satisfy_wish, SenderHouseID, system, MoneyType, Price, Time, Sender),
    %% 玩家 给 玩家 物品
    do_log(?tag_satisfy_wish, SenderHouseID, Recver, ItemID, ItemCount, Time, Sender).


%%%===================================================================
%%% 配对，房屋合并
%%%===================================================================
log_mateup_house(BoyHouseID, BoyFurnitures, BoyPackItems,
		 GirlHouseID, GirlFurnitures, GirlPackItems,
		 NewHouseID) 
  when is_list(BoyFurnitures),
       is_list(GirlFurnitures),
       is_list(BoyPackItems),
       is_list(GirlPackItems) ->
    Time = datetime:datetime_to_gregorian_seconds(datetime:local_time()),
    %% 房屋 给 房屋 物品
    log_mateup_house_1(BoyHouseID, NewHouseID, BoyFurnitures, Time),
    log_mateup_house_1(BoyHouseID, NewHouseID, BoyPackItems, Time),
    log_mateup_house_1(GirlHouseID, NewHouseID, GirlFurnitures, Time),
    log_mateup_house_1(GirlHouseID, NewHouseID, GirlPackItems, Time).


log_mateup_house_1(OldHouseID, NewHouseID, ItemIDCountList, Time) 
  when is_list(ItemIDCountList),
       is_integer(OldHouseID),
       is_integer(NewHouseID) ->
    [do_log(?tag_mateup, OldHouseID, NewHouseID, get_item_id(ItemData), ItemCount, Time, system)
     || {ItemData, ItemCount} <- ItemIDCountList].

get_item_id(#item{template_id=ItemID}) ->
    ItemID;
get_item_id(ItemID) when is_integer(ItemID) ->
    ItemID.

%%%===================================================================
%%% 送礼
%%%===================================================================
log_send_gift(Sender, Recver, ItemID) when is_integer(ItemID) ->
    log_send_gift(Sender, Recver, ItemID, 1);
log_send_gift(Sender, Recver, ItemData) ->
    ItemID = item:get_tempid(ItemData),
    log_send_gift(Sender, Recver, ItemID).
log_send_gift(Sender, Recver, ItemID, ItemCount) when is_atom(Sender),
						      is_atom(Recver) -> 
    %% 玩家 给 玩家 物品
    log(?tag_send_gift, Sender, Recver, ItemID, ItemCount, Sender).


%%%===================================================================
%%% 玩家穿上衣服
%%%===================================================================
log_equip_on(ItemIDList, Account, HouseID) when is_list(ItemIDList) ->
    %% 房间 给 玩家 物品
    [log_equip_on(ItemID, Account, HouseID) || ItemID <- ItemIDList];
log_equip_on(ItemID, Account, HouseID) when is_integer(ItemID), 
					    is_integer(HouseID),
					    is_atom(Account) ->
    %% 房间 给 玩家 物品
    log(?tag_equip_on, HouseID, Account, ItemID, 1, Account);
log_equip_on(ItemData, Account, HouseID) when is_integer(HouseID),
					      is_atom(Account) ->
    ItemID = item:get_tempid(ItemData),
    log_equip_on(ItemID, Account, HouseID).
    
%%%===================================================================
%%% 玩家脱下衣服
%%%===================================================================
log_equip_off(ItemIDList, Account, HouseID) when is_list(ItemIDList) ->
    %% 玩家 给 房间 物品
    [log_equip_off(ItemID, Account, HouseID) || ItemID <- ItemIDList];
log_equip_off(ItemID, Account, HouseID) when is_integer(HouseID), 
					     is_integer(ItemID),
					     is_atom(Account) ->
    %% 玩家 给 房间 物品
    log(?tag_equip_off, Account, HouseID, ItemID, 1, Account);
log_equip_off(ItemData, Account, HouseID) when is_integer(HouseID),
					      is_atom(Account) ->
    ItemID = item:get_tempid(ItemData),
    log_equip_off(ItemID, Account, HouseID).
    

%%%===================================================================
%%% 玩家活动获得物品
%%%===================================================================
log_holiday_gain_item(HouseID, ItemID, ItemCount, Operator) when is_integer(HouseID) ->
    %% 系统给玩家物品
    log(?tag_holiday_gain, system, HouseID, ItemID, ItemCount, Operator).

%%%===================================================================
%%% 玩家活动获得爱情水晶
%%%===================================================================
log_holiday_gain_diamond(HouseID, AddDiamond, Operator) when is_integer(HouseID) ->
    %% 系统给玩家钱
    log(?tag_holiday_gain, system, HouseID, ?mt_diamond, AddDiamond, Operator).

%%%===================================================================
%%% 进自己家获得爱情水晶
%%%===================================================================
log_enter_home_gain(HouseID, AddDiamond, Operator) when is_integer(HouseID) ->
    %% 系统给玩家钱
    log(?tag_enter_home_gain, system, HouseID, ?mt_diamond, AddDiamond, Operator).

%%%===================================================================
%%% 别人进自己家获得爱情水晶
%%%===================================================================
log_other_enter_home_gain(HouseID, AddDiamond, Operator) when is_integer(HouseID) ->
    %% 系统给玩家钱
    log(?tag_other_enter_home_gain, system, HouseID, ?mt_diamond, AddDiamond, Operator).

%%%===================================================================
%%% 购买物品
%%%===================================================================
log_buy_items(HouseID, BuyInfoList, Operator) when is_list(BuyInfoList) ->
    [log_buy_item(HouseID, ItemID, ItemCount, {MoneyType, Price}, Operator) 
     || {ItemID, ItemCount, {MoneyType, Price}} <- BuyInfoList].

log_buy_item(HouseID, ItemID, ItemCount, {MoneyType, Price}, Operator) 
  when (MoneyType =:= ?mt_diamond) or (MoneyType =:= ?mt_love_coin),
       is_integer(HouseID) ->
    Time = datetime:datetime_to_gregorian_seconds(datetime:local_time()),
    %% 系统给玩家物品
    do_log(?tag_buy_item, system, HouseID, ItemID, ItemCount, Time, Operator),
    %% 玩家给系统钱
    do_log(?tag_buy_item, HouseID, system, MoneyType, Price, Time, Operator).


%%%===================================================================
%%% 删除物品
%%%===================================================================
log_delete_overtime_item(HouseID, ItemID, ItemCount) when is_integer(HouseID) ->
    log_delete_item(HouseID, ItemID, ItemCount, system).
log_delete_item(HouseID, ItemID, ItemCount, Operator) when is_integer(HouseID) ->
    Time = datetime:datetime_to_gregorian_seconds(datetime:local_time()),
    %% 玩家给系统物品
    do_log(?tag_delete_item, HouseID, system, ItemID, ItemCount, Time, Operator).


%%%===================================================================
%%% 回收物品
%%%===================================================================
log_recycle_item(HouseID, ItemID, ItemCount, AddDiamond, Operator) when is_integer(HouseID) ->
    Time = datetime:datetime_to_gregorian_seconds(datetime:local_time()),
    %% 玩家给系统物品
    do_log(?tag_recycle_item, HouseID, system, ItemID, ItemCount, Time, Operator),
    case AddDiamond > 0 of
	true ->
	    %% 系统给玩家钱
	    do_log(?tag_recycle_item, system, HouseID, ?mt_diamond, AddDiamond, Time, Operator);
	_ ->
	    ok
    end.


log(Action, OldKeeper, Keeper, Type, Count, Operator) ->
    Time = datetime:datetime_to_gregorian_seconds(datetime:local_time()),
    do_log(Action, OldKeeper, Keeper, Type, Count, Time, Operator).

%%%===================================================================
%%% 选择某个玩家数据
%%%  ItemID 物品ID, 爱情水晶的id为1
%%%===================================================================
select_diamond(Keeper) ->
    select_item(Keeper, ?mt_diamond).
select_diamond(Keeper, FromTime) ->
    select_item(Keeper, ?mt_diamond, FromTime).
select_item(Keeper, ItemID) ->
    select_item(Keeper, ItemID, {{1, 1, 1}, {0, 0, 0}}).
select_item(Keeper, ItemID, FromTime) when is_list(Keeper), is_integer(ItemID) ->
    Time = datetime:datetime_to_gregorian_seconds(FromTime),
    PlayerGain = mongodb_services:select(get_connection(), item_money_log, 
					 {time, {'$gte', Time}, 
					  keeper, Keeper, type, ItemID}, 
					 {sort, {time, 1}}),

    PlayerLost = mongodb_services:select(get_connection(), item_money_log, 
					 {time, {'$gte', Time}, 
					  old_keeper, Keeper, type, ItemID},
					 {sort, {time, 1}}),

    {gain, convert_gain(PlayerGain), lost, convert_lost(PlayerLost)}.

convert_gain(List) when is_list(List) ->
    [begin
	 Time = bson:at(time, R),
	 Count = bson:at(count, R),
	 OldKeeper = bson:at(old_keeper, R),
	 Action =  bson:at(action, R),
	 
	 DateTime = datetime:gregorian_seconds_to_datetime(Time),
	 {Count, get_action(Action), OldKeeper, DateTime} 
     end || R <- List].

convert_lost(List) when is_list(List) ->
    [begin
	 Time = bson:at(time, R),
	 Count = bson:at(count, R),
	 Keeper = bson:at(keeper, R),
	 Action =  bson:at(action, R),
	 
	 DateTime = datetime:gregorian_seconds_to_datetime(Time),
	 {Count, get_action(Action), Keeper, DateTime} 
     end || R <- List].

%%%===================================================================
%%% 根据条件选择记录
%%%===================================================================
select(Condiction) ->
    mongodb_services:select(get_connection(), item_money_log, 
			    Condiction, 
			    {sort, {time, 1}}).
    

%%%===================================================================
%%% 内部函数
%%%===================================================================
do_log(Action, OldKeeper, Keeper, Type, Count, Time, Operator) when is_integer(Time),
								    is_integer(Type),
								    is_integer(Action),
								    Count > 0 ->
    log_to_db(Action, to_str(OldKeeper), to_str(Keeper), Type, Count, Time, to_str(Operator)).

to_str(X) when is_atom(X) ->
    atom_to_list(X);
to_str(X) when is_integer(X) ->
    integer_to_list(X);
to_str(X) when is_list(X) ->
    X.

log_to_db(Action, OldKeeper, Keeper, Type, Count, Time, Operator) 
  when is_integer(Time),
       is_integer(Type),
       is_integer(Action),
       is_list(OldKeeper),
       is_list(Keeper),
       is_list(Operator),
       Count > 0 ->
    Record = {time, Time,
	      action, Action,
	      old_keeper, OldKeeper,
	      keeper, Keeper,
	      type, Type,
	      count, Count,
	      operator, Operator
	     },

    %% 写到数据库
    mongodb_services:insert(get_connection(), item_money_log, Record).


get_connection()->
    Conns = get(?MODULE),
    NConns = case Conns of 
    		 undefined->
    		     Conns1 = mongodb_services:get_connections(),
    		     put(?MODULE, Conns1),
    		     Conns1;
    		 _->
    		     Conns
    	     end,
    mongodb_services:get_connection(NConns).


