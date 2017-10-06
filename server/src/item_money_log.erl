%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%  ��Ʒ��Ǯ��¼
%%      ʱ��(time):  ��λ�� (��0�꿪ʼ)
%%      ��Ϊ(action): ����, ����
%%      �ɳ��з�(old_keeper): ����˺ţ�����id, ϵͳ(system)
%%      �³��з�(keeper): ����˺ţ�����id, ϵͳ(system)
%%      ��Ʒ����(type): ����ˮ������Ϊ1, Q��Ϊ����Ϊ2
%%      ��Ʒ����(count): һ������
%%      ������(operator): ����˺�
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
%%% ��������Ը��
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
    %% ��Ҹ�ϵͳǮ
    do_log(?tag_satisfy_wish, SenderHouseID, system, MoneyType, Price, Time, Sender),
    %% ��� �� ��� ��Ʒ
    do_log(?tag_satisfy_wish, SenderHouseID, Recver, ItemID, ItemCount, Time, Sender).


%%%===================================================================
%%% ��ԣ����ݺϲ�
%%%===================================================================
log_mateup_house(BoyHouseID, BoyFurnitures, BoyPackItems,
		 GirlHouseID, GirlFurnitures, GirlPackItems,
		 NewHouseID) 
  when is_list(BoyFurnitures),
       is_list(GirlFurnitures),
       is_list(BoyPackItems),
       is_list(GirlPackItems) ->
    Time = datetime:datetime_to_gregorian_seconds(datetime:local_time()),
    %% ���� �� ���� ��Ʒ
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
%%% ����
%%%===================================================================
log_send_gift(Sender, Recver, ItemID) when is_integer(ItemID) ->
    log_send_gift(Sender, Recver, ItemID, 1);
log_send_gift(Sender, Recver, ItemData) ->
    ItemID = item:get_tempid(ItemData),
    log_send_gift(Sender, Recver, ItemID).
log_send_gift(Sender, Recver, ItemID, ItemCount) when is_atom(Sender),
						      is_atom(Recver) -> 
    %% ��� �� ��� ��Ʒ
    log(?tag_send_gift, Sender, Recver, ItemID, ItemCount, Sender).


%%%===================================================================
%%% ��Ҵ����·�
%%%===================================================================
log_equip_on(ItemIDList, Account, HouseID) when is_list(ItemIDList) ->
    %% ���� �� ��� ��Ʒ
    [log_equip_on(ItemID, Account, HouseID) || ItemID <- ItemIDList];
log_equip_on(ItemID, Account, HouseID) when is_integer(ItemID), 
					    is_integer(HouseID),
					    is_atom(Account) ->
    %% ���� �� ��� ��Ʒ
    log(?tag_equip_on, HouseID, Account, ItemID, 1, Account);
log_equip_on(ItemData, Account, HouseID) when is_integer(HouseID),
					      is_atom(Account) ->
    ItemID = item:get_tempid(ItemData),
    log_equip_on(ItemID, Account, HouseID).
    
%%%===================================================================
%%% ��������·�
%%%===================================================================
log_equip_off(ItemIDList, Account, HouseID) when is_list(ItemIDList) ->
    %% ��� �� ���� ��Ʒ
    [log_equip_off(ItemID, Account, HouseID) || ItemID <- ItemIDList];
log_equip_off(ItemID, Account, HouseID) when is_integer(HouseID), 
					     is_integer(ItemID),
					     is_atom(Account) ->
    %% ��� �� ���� ��Ʒ
    log(?tag_equip_off, Account, HouseID, ItemID, 1, Account);
log_equip_off(ItemData, Account, HouseID) when is_integer(HouseID),
					      is_atom(Account) ->
    ItemID = item:get_tempid(ItemData),
    log_equip_off(ItemID, Account, HouseID).
    

%%%===================================================================
%%% ��һ�����Ʒ
%%%===================================================================
log_holiday_gain_item(HouseID, ItemID, ItemCount, Operator) when is_integer(HouseID) ->
    %% ϵͳ�������Ʒ
    log(?tag_holiday_gain, system, HouseID, ItemID, ItemCount, Operator).

%%%===================================================================
%%% ��һ��ð���ˮ��
%%%===================================================================
log_holiday_gain_diamond(HouseID, AddDiamond, Operator) when is_integer(HouseID) ->
    %% ϵͳ�����Ǯ
    log(?tag_holiday_gain, system, HouseID, ?mt_diamond, AddDiamond, Operator).

%%%===================================================================
%%% ���Լ��һ�ð���ˮ��
%%%===================================================================
log_enter_home_gain(HouseID, AddDiamond, Operator) when is_integer(HouseID) ->
    %% ϵͳ�����Ǯ
    log(?tag_enter_home_gain, system, HouseID, ?mt_diamond, AddDiamond, Operator).

%%%===================================================================
%%% ���˽��Լ��һ�ð���ˮ��
%%%===================================================================
log_other_enter_home_gain(HouseID, AddDiamond, Operator) when is_integer(HouseID) ->
    %% ϵͳ�����Ǯ
    log(?tag_other_enter_home_gain, system, HouseID, ?mt_diamond, AddDiamond, Operator).

%%%===================================================================
%%% ������Ʒ
%%%===================================================================
log_buy_items(HouseID, BuyInfoList, Operator) when is_list(BuyInfoList) ->
    [log_buy_item(HouseID, ItemID, ItemCount, {MoneyType, Price}, Operator) 
     || {ItemID, ItemCount, {MoneyType, Price}} <- BuyInfoList].

log_buy_item(HouseID, ItemID, ItemCount, {MoneyType, Price}, Operator) 
  when (MoneyType =:= ?mt_diamond) or (MoneyType =:= ?mt_love_coin),
       is_integer(HouseID) ->
    Time = datetime:datetime_to_gregorian_seconds(datetime:local_time()),
    %% ϵͳ�������Ʒ
    do_log(?tag_buy_item, system, HouseID, ItemID, ItemCount, Time, Operator),
    %% ��Ҹ�ϵͳǮ
    do_log(?tag_buy_item, HouseID, system, MoneyType, Price, Time, Operator).


%%%===================================================================
%%% ɾ����Ʒ
%%%===================================================================
log_delete_overtime_item(HouseID, ItemID, ItemCount) when is_integer(HouseID) ->
    log_delete_item(HouseID, ItemID, ItemCount, system).
log_delete_item(HouseID, ItemID, ItemCount, Operator) when is_integer(HouseID) ->
    Time = datetime:datetime_to_gregorian_seconds(datetime:local_time()),
    %% ��Ҹ�ϵͳ��Ʒ
    do_log(?tag_delete_item, HouseID, system, ItemID, ItemCount, Time, Operator).


%%%===================================================================
%%% ������Ʒ
%%%===================================================================
log_recycle_item(HouseID, ItemID, ItemCount, AddDiamond, Operator) when is_integer(HouseID) ->
    Time = datetime:datetime_to_gregorian_seconds(datetime:local_time()),
    %% ��Ҹ�ϵͳ��Ʒ
    do_log(?tag_recycle_item, HouseID, system, ItemID, ItemCount, Time, Operator),
    case AddDiamond > 0 of
	true ->
	    %% ϵͳ�����Ǯ
	    do_log(?tag_recycle_item, system, HouseID, ?mt_diamond, AddDiamond, Time, Operator);
	_ ->
	    ok
    end.


log(Action, OldKeeper, Keeper, Type, Count, Operator) ->
    Time = datetime:datetime_to_gregorian_seconds(datetime:local_time()),
    do_log(Action, OldKeeper, Keeper, Type, Count, Time, Operator).

%%%===================================================================
%%% ѡ��ĳ���������
%%%  ItemID ��ƷID, ����ˮ����idΪ1
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
%%% ��������ѡ���¼
%%%===================================================================
select(Condiction) ->
    mongodb_services:select(get_connection(), item_money_log, 
			    Condiction, 
			    {sort, {time, 1}}).
    

%%%===================================================================
%%% �ڲ�����
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

    %% д�����ݿ�
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


