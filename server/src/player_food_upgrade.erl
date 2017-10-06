%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2013, linyibin
%%% @doc
%%% 食物升级
%%% @end
%%% Created : 24 Jun 2013 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(player_food_upgrade).

-include("packet_def.hrl").
-include("house_data.hrl").
-include("tplt_def.hrl").
-include("sys_msg.hrl").
-include("router.hrl").
-include("common_def.hrl").
-include("enum_def.hrl").
-include("resource.hrl").
-include("records.hrl").

-record(food_upgrade, {id,
		       upgrade_id}).

%% API
-export([start/1, get_upgrade_id/2]).
-export([handle_cast/2]).

%%%===================================================================
%%% API
%%%===================================================================
start(Account) ->
    [router:make_event_source(?msg_req_upgrade_food, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_food_upgrade_info, Account, {Account, ?MODULE})
    ].

%%--------------------------------------------------------------------
%% @doc
%% @获取当前升级Id
%% @end
%%--------------------------------------------------------------------
get_upgrade_id(ID, PlayerFood) ->
    Upgrades = player_food:get_upgrades(PlayerFood),
    case lists:keyfind(ID, #food_upgrade.id, Upgrades) of
	false ->
	    PlayerFoodTplt = tplt:get_data(player_food_tplt, ID),
	    PlayerFoodTplt#player_food_tplt.upgrade_id;
	FoodUpgrade ->
	    FoodUpgrade#food_upgrade.upgrade_id
    end.
%%%===================================================================
%%% Handle cast
%%%===================================================================
handle_cast({#msg{src=Account}, #req_upgrade_food{id=ID}}, State) ->
    F = fun() ->
		[PlayerBasicData] = db:read(player_basic_data, Account),
		HouseId = player_basic_data:get_house_id(PlayerBasicData),
		[HouseData] = db:read(house_data, HouseId),
		PlayerFood = player_food:get(Account),
		UpgradeID = get_upgrade_id(ID, PlayerFood),
		PlayerFoodUpgradeTplt = tplt:get_data(player_food_upgrade_tplt, UpgradeID),
		case can_upgrade(PlayerFoodUpgradeTplt, HouseData) of
		    true ->
			upgrade(ID, PlayerFoodUpgradeTplt, PlayerFood, HouseData);
		    {false, Reason} ->
			Reason
		end
	end,
    case db:transaction(F) of
	{true, NextUpgradeID, DelItemMsgs, NHouseData} ->
	    house_pack:send_msgs(DelItemMsgs, NHouseData),
	    house_diamond:notify(NHouseData),
	    router:cast(Account, upgrade_food, Account),
	    net_helper:send2client(Account, #notify_upgrade_food{id=ID, upgrade_id=NextUpgradeID});
	Reason ->
	    sys_msg:send(Account, Reason)
    end,
    {noreply, State};
handle_cast({#msg{src=Account}, #req_food_upgrade_info{}}, State) ->
    F = fun() ->
		PlayerFood = player_food:get(Account),
		Upgrades = player_food:get_upgrades(PlayerFood),
		lists:foldl(fun(#food_upgrade{id=ID, upgrade_id=UpgradeID}, Info) ->
				    [#food_upgrade_info{id=ID, 
							upgrade_id=UpgradeID}|Info]
			    end, [], Upgrades)
	end,
    case db:transaction(F) of
	UpgradeInfo ->
	    net_helper:send2client(Account, #notify_food_upgrade_info{upgrade_info=UpgradeInfo})
    end,
    {noreply, State}.

%%%===================================================================
%%% Internal functions
%%%===================================================================
%%--------------------------------------------------------------------
%% @doc
%% @是否可以升级
%% @end
%%--------------------------------------------------------------------
can_upgrade(PlayerFoodUpgradeTplt, HouseData) ->
    try
	can_upgrade_by_diamond(PlayerFoodUpgradeTplt, HouseData),
	can_upgrade_by_item(PlayerFoodUpgradeTplt, HouseData),
	can_upgrade_by_decoration(PlayerFoodUpgradeTplt, HouseData)
    catch
	throw:Reason ->
	    Reason
    end.

%%--------------------------------------------------------------------
%% @doc
%% @升级水晶是否足够
%% @end
%%--------------------------------------------------------------------
can_upgrade_by_diamond(PlayerFoodUpgradeTplt, HouseData) ->
    Diamond = house_diamond:get_lover_diamond(HouseData),
    NeedDiamond = PlayerFoodUpgradeTplt#player_food_upgrade_tplt.diamond,
    case Diamond >= NeedDiamond of
	true ->
	    true;
	false ->
	    throw({false, ?player_food_upgrade_diamond})
    end.

%%--------------------------------------------------------------------
%% @doc
%% @升级豪华度是否足够
%% @end
%%--------------------------------------------------------------------
can_upgrade_by_decoration(PlayerFoodUpgradeTplt, HouseData) ->
    Decoration = house_data:get_decoration(HouseData),
    NeedDecoration = PlayerFoodUpgradeTplt#player_food_upgrade_tplt.decoration,
    case Decoration >= NeedDecoration of
	true ->
	    true;
	false ->
	    throw({false, ?player_food_upgrade_decoration})
    end.

%%--------------------------------------------------------------------
%% @doc
%% @升级物品是否足够
%% @end
%%--------------------------------------------------------------------
can_upgrade_by_item(PlayerFoodUpgradeTplt, HouseData) ->
    Items = get_upgrade_need_items(PlayerFoodUpgradeTplt),
    lists:foldl(fun({ItemID, Count}, Result) ->
			case house_pack:get_item_count_by_tempid([ItemID], HouseData) >= Count of
			    true ->
				Result and true;
			    false ->
				data_helper:format("ItemID:~p, Count:~p~n", [ItemID, Count]),
				throw({false, ?player_food_upgrade_items})
			end
		end, true, Items).

%%--------------------------------------------------------------------
%% @doc
%% @获取升级所需要的材料
%% @end
%%--------------------------------------------------------------------
get_upgrade_need_items(PlayerFoodUpgradeTplt) ->
    ItemIDs = PlayerFoodUpgradeTplt#player_food_upgrade_tplt.item_ids,
    ItemCount = PlayerFoodUpgradeTplt#player_food_upgrade_tplt.item_count,
    [{lists:nth(1, ItemIDs), lists:nth(1, ItemCount)},
     {lists:nth(2, ItemIDs), lists:nth(2, ItemCount)},
     {lists:nth(3, ItemIDs), lists:nth(3, ItemCount)},
     {lists:nth(4, ItemIDs), lists:nth(4, ItemCount)}
    ].


%%--------------------------------------------------------------------
%% @doc
%% @升级
%% @end
%%--------------------------------------------------------------------
upgrade(ID, PlayerFoodUpgradeTplt, PlayerFood, HouseData) ->
    %% 收回材料
    Items = get_upgrade_need_items(PlayerFoodUpgradeTplt),
    {NHouseData, DelItemsMsgs} = house_pack:del_items_by_count(Items, HouseData),
    %% 扣除水晶
    Diamond = PlayerFoodUpgradeTplt#player_food_upgrade_tplt.diamond,
    NNHouseData = house_diamond:dec_diamond(Diamond, NHouseData),
    %% 设置升级Id
    Upgrades = player_food:get_upgrades(PlayerFood),
    NextUpgradeID = PlayerFoodUpgradeTplt#player_food_upgrade_tplt.next_upgrade_id,
    NUpgrades = 
	case lists:keyfind(ID, #food_upgrade.id, Upgrades) of
	    false ->
		[#food_upgrade{id=ID, upgrade_id=NextUpgradeID}|Upgrades];
	    FoodUpgrade ->
		FoodUpgrade1 = FoodUpgrade#food_upgrade{upgrade_id=NextUpgradeID},
		lists:keyreplace(ID, #food_upgrade.id, Upgrades, FoodUpgrade1)
	end,
    NPlayerFood = player_food:set_upgrades(PlayerFood, NUpgrades),
    %% 持久化
    db:write(NNHouseData),
    db:write(NPlayerFood),
    {true, NextUpgradeID, DelItemsMsgs, NNHouseData}.
