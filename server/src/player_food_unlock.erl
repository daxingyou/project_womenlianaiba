%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2013, linyibin
%%% @doc
%%% 食物解锁
%%% @end
%%% Created : 21 Jun 2013 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(player_food_unlock).

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
-export([start/1]).
-export([handle_cast/2]).

%%%===================================================================
%%% API
%%%===================================================================
start(Account) ->
    [router:make_event_source(?msg_req_unlock_food, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_unlock_food_info, Account, {Account, ?MODULE})
    ].

%%--------------------------------------------------------------------
%% @doc
%% @spec
%% @end
%%--------------------------------------------------------------------

%%%===================================================================
%%% Handle cast
%%%===================================================================
handle_cast({#msg{src=Account}, #req_unlock_food{id=ID}}, State) ->
    F = fun() ->
		data_helper:format("ID:~p~n", [ID]),
		[PlayerBasicData] = db:read(player_basic_data, Account),
		HouseId = player_basic_data:get_house_id(PlayerBasicData),
		[HouseData] = db:read(house_data, HouseId),
		PlayerFood = player_food:get(Account),
		PlayerFoodTplt = tplt:get_data(player_food_tplt, ID),
		case can_unlock(PlayerFoodTplt, PlayerFood, HouseData) of
		    true ->
			unlock(PlayerFoodTplt, PlayerFood, HouseData);
		    {false, Reason} ->
			Reason
		end
	end,
    case db:transaction(F) of
	{true, ID, NHouseData} ->
	    house_diamond:notify(Account, NHouseData),
	    router:cast(Account, unlock_food_event, Account),
	    net_helper:send2client(Account, #notify_unlock_food{id=ID});
	Reason ->
	    sys_msg:send(Account, Reason)
    end,
    {noreply, State};
handle_cast({#msg{src=Account}, #req_unlock_food_info{}}, State) ->
    F = fun() ->
		PlayerFood = player_food:get(Account),
		player_food:get_unlocks(PlayerFood)
	end,
    case db:transaction(F) of
	Unlocks ->
	    net_helper:send2client(Account, #notify_unlock_food_info{ids=Unlocks})
    end,
    {noreply, State}.

%%%===================================================================
%%% Internal functions
%%%===================================================================

%%--------------------------------------------------------------------
%% @doc
%% @是否能够解锁食物
%% @end
%%--------------------------------------------------------------------
can_unlock(PlayerFoodTplt, PlayerFood, HouseData) ->
    try
	can_unlock_by_id(PlayerFoodTplt, PlayerFood),
	can_unlock_by_level(PlayerFoodTplt, HouseData),
	can_unlock_by_diamond(PlayerFoodTplt, HouseData)
    catch
	throw:Reason ->
	    Reason
    end.

%%--------------------------------------------------------------------
%% @doc
%% @判断id是否已经解锁过
%% @end
%%--------------------------------------------------------------------
can_unlock_by_id(PlayerFoodTplt, PlayerFood) ->
    UnlocksFood = player_food:get_unlocks(PlayerFood),
    ID = PlayerFoodTplt#player_food_tplt.id,
    case lists:member(ID, UnlocksFood) of
	false ->
	    true;
	_ ->
	    throw({false, ?player_food_unlocked_id_error})
    end.

%%--------------------------------------------------------------------
%% @doc
%% @判断等级是否可以解锁
%% @end
%%--------------------------------------------------------------------
can_unlock_by_level(PlayerFoodTplt, HouseData) ->

    Level = PlayerFoodTplt#player_food_tplt.level,
    PlayerLevel = house_level_exp:get_level(HouseData),
    data_helper:format("Level:~p, PlayerLevel:~p~n", [Level, PlayerLevel]),
     case PlayerLevel >= Level of
	true ->
	    true;
	false ->
	    throw({false, ?player_food_unlocked_level_error})
    end.

%%--------------------------------------------------------------------
%% @doc
%% @判断水晶是否足够可以解锁
%% @end
%%--------------------------------------------------------------------
can_unlock_by_diamond(PlayerFoodTplt, HouseData) ->
    UnlockDiamond = PlayerFoodTplt#player_food_tplt.unlock_diamond,
    TotalDiamond = house_diamond:get_lover_diamond(HouseData),
    case TotalDiamond >= UnlockDiamond of
	true ->
	    true;
	false ->
	    throw({false, ?player_food_make_product_diamond})
    end.

%%--------------------------------------------------------------------
%% @doc
%% @解锁食物
%% @end
%%--------------------------------------------------------------------
unlock(PlayerFoodTplt, PlayerFood, HouseData) ->
    ID = PlayerFoodTplt#player_food_tplt.id,
    UnlockDiamond = PlayerFoodTplt#player_food_tplt.unlock_diamond,
    UnlocksFood = player_food:get_unlocks(PlayerFood),
    NUnlocksFood = [ID|UnlocksFood],
    NPlayerFood = player_food:set_unlocks(PlayerFood, NUnlocksFood),   
    NHouseData = house_diamond:dec_diamond(UnlockDiamond, HouseData),
    db:write(NPlayerFood),
    db:write(NHouseData),
    {true, ID, NHouseData}.

