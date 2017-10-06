%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% 行为事件
%%% @end
%%% Created : 26 Jun 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(action_event).

-include("tplt_def.hrl").

%% API
-export([do_event/3]).

%%%===================================================================
%%% API
%%%===================================================================
do_event(Account, Event, _Value) ->
    EventDatas = get_event_data(Event),
    reward(Account, EventDatas).
%%%===================================================================
%%% Internal functions
%%%===================================================================
get_event_data(Event) ->
    EventTplt = tplt:get_all_data(event_tplt),
    {EventDatas, _} = lists:partition(fun(#event_tplt{event=EventName}) ->
					     binary_to_atom(EventName, latin1) == Event
				     end, EventTplt),
    EventDatas.

reward(_Account, []) ->
    ok;
reward(Account, [EventData]) ->
    case can_reward(EventData) of
	true ->
	    do_reward(Account, EventData);
	false ->
	    ok
    end.

can_reward(#event_tplt{rate=Rate}) ->
    Rand = rand:uniform(100),
    Rate >= Rand.

do_reward(Account, EventData) ->
    #event_tplt{item_id=ItemId, diamond=Diamond, exp=Exp, hp=HP} = EventData,
    F = fun() ->
		[PlayerBasicData] = db:read(player_basic_data, Account),
		HouseId = player_basic_data:get_house_id(PlayerBasicData),
		[HouseData] = db:read(house_data, HouseId),
		{NHouseData, ShipItemMsg} = ship_item(ItemId, HouseData),
		NNHouseData = ship_diamond(Diamond, NHouseData),
		NPlayerBasicData = ship_hp(HP, PlayerBasicData, NNHouseData),
		{NNPlayerBasicData, NNNHouseData} = ship_exp(Exp, NPlayerBasicData, NNHouseData),
		db:write(NNPlayerBasicData),
		db:write(NNNHouseData),
		{NNPlayerBasicData, NNNHouseData, ShipItemMsg}
	end,
    do_reward_notify(Account, F).

do_reward_notify(Account, F) ->
    {PlayerBasicData, HouseData, ShipItemMsg} = db:transaction(F),
    Lover = house:get_lover(Account, HouseData),
    case Lover == '' of
	true ->
	    house_lover_package:send_msgs(ShipItemMsg, Account, Lover),
	    house_diamond:notify(HouseData),
	    house_level_exp:notify(Account, HouseData, PlayerBasicData);
	false ->
	    house_lover_package:send_msgs(ShipItemMsg, Account, Lover),
	    house_diamond:notify(HouseData),
	    house_level_exp:notify(Account, HouseData, PlayerBasicData),
	    case player:is_single(PlayerBasicData) of
		true ->
		    ok;
		false ->
		    [LoverPlayerBasicData] = db:dirty_read(player_basic_data, Lover),
		    house_level_exp:notify(Lover, HouseData, LoverPlayerBasicData)
	    end
    end.

ship_item(ItemId, HouseData) ->
    case ItemId > 0 of
	true ->
	    {NHouseData, AddMsg} = house_pack:add_items([{ItemId, 1}], HouseData),
	    {NHouseData, AddMsg};
	false ->
	    {HouseData, []}
    end.

ship_diamond(Diamond, HouseData) ->
    NHouseData = 
	case Diamond >= 0 of
	    true ->
		house_diamond:add_diamond(Diamond, HouseData);
	    false ->
		house_diamond:dec_diamond(abs(Diamond), HouseData)
	end,
    NHouseData.

ship_hp(HP, PlayerBasicData, HouseData) ->
    case HP >= 0 of
	true ->
	    player_hp:add_hp(HP, PlayerBasicData, HouseData);
	false ->
	    {ok, NPlayerBasicData} = player_hp:dec_hp(abs(HP), PlayerBasicData, HouseData),
	    NPlayerBasicData
    end.

ship_exp(Exp, PlayerBasicData, HouseData) ->
    case Exp >= 0 of
	true ->
	    {NPlayerBasicData, NHouseData, _} = house_level_exp:add_exp(Exp, PlayerBasicData, HouseData),
	    {NPlayerBasicData, NHouseData};
	false ->
	    {PlayerBasicData, HouseData}
    end.
