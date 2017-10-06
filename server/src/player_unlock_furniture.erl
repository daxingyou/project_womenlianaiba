%%%-------------------------------------------------------------------
%%% @author linyijie <linyj@35info.cn>
%%% @copyright (C) 2013, linyijie
%%% @doc
%%% 解锁家具
%%% @end
%%% Created : 26 Mar 2013 by linyijie <linyj@35info.cn>
%%%-------------------------------------------------------------------
-module(player_unlock_furniture).


-record(player_unlock_furniture, {account,
				  unlock_list}).

%% API
-export([start/1, notify/1, handle_cast/2]).
-export([get_max_unlock_list/1, get_player_unlock_furniture/1, get_unlock_list/1]).

-include("packet_def.hrl").
-include("enum_def.hrl").
-include("router.hrl").
-include("records.hrl").
-include("tplt_def.hrl").
-include("common_def.hrl").
-include("resource.hrl").
-include("house_data.hrl").
-include("sys_msg.hrl").

%%%===================================================================
%%% API
%%%===================================================================
%% 注册事件
%% Account:玩家帐号
start(Account) ->
    [router:make_event_source(?msg_req_unlock_furniture, Account, {self(), ?MODULE})
    ].

notify(Account) ->
    PlayerUnlockFurniture = get_player_unlock_furniture(Account),
    UnLockList = get_unlock_list(PlayerUnlockFurniture),
    net_helper:send2client(Account, #notify_unlock_furniture_list{unlock_list=UnLockList}).

%%--------------------------------------------------------------------
%% @doc
%% @spec
%% @end
%%--------------------------------------------------------------------

%%%===================================================================
%%% Handle Cast
%%%===================================================================
handle_cast({#msg{src=Account}, #req_unlock_furniture{id=ID}}, State) ->
    F = fun() ->
		SysShopClassTplt = tplt:get_data(sys_shop_class_tplt, ID),
		[PlayerBasicData] = db:read(player_basic_data, Account),
		HouseId = player_basic_data:get_house_id(PlayerBasicData),
		[HouseData] = db:read(house_data, HouseId),
		PlayerUnlockFurniture = get_player_unlock_furniture(Account),
		UnlockMaterial = SysShopClassTplt#sys_shop_class_tplt.unlock_material,
		UnlockMaterialCount = SysShopClassTplt#sys_shop_class_tplt.unlock_material_count,
		Materials = util:recombine_items(UnlockMaterial, UnlockMaterialCount),
		case can_unlock(SysShopClassTplt, Materials, PlayerUnlockFurniture, HouseData) of
		    true ->
			do_unlock(SysShopClassTplt, Materials, PlayerUnlockFurniture, HouseData);
		    Reason ->
			Reason
		end
	end,
    case db:transaction(F) of
	{true, PlayerUnlockFurniture, HouseData1, Msgs} ->
	    house_pack:send_msgs(Msgs, HouseData1),
	    house_diamond:notify(HouseData1),
	    UnLockList = get_unlock_list(PlayerUnlockFurniture),
	    net_helper:send2client(Account, #notify_unlock_furniture_list{unlock_list=UnLockList}),
	    net_helper:send2client(Account, #notify_unlock_furniture{});
	{false, Reason} ->
	    sys_msg:send(Account, Reason)
    end,
    {noreply, State}.

%%%===================================================================
%%% Internal functions
%%%===================================================================
can_unlock(SysShopClassTplt, Materials, PlayerUnlockFurniture, HouseData) ->
    try
	validate_unlock(SysShopClassTplt),
	validate_type(SysShopClassTplt, PlayerUnlockFurniture),
	validate_level(SysShopClassTplt, HouseData),
	validate_diamond(SysShopClassTplt, HouseData),
	validate_material(Materials, HouseData)
    catch
	throw:Reason ->
	    Reason
    end.

validate_unlock(SysShopClassTplt) ->
    Unlock = SysShopClassTplt#sys_shop_class_tplt.unlock,
    case Unlock == 1 of
	true ->
	    true;
	false ->
	    throw({false, ?unlock_furniture_unlock_error})
    end.

validate_type(SysShopClassTplt, PlayerUnlockFurniture) ->
    Type = SysShopClassTplt#sys_shop_class_tplt.type,
    GiveMaxType = get_max_unlock_list(PlayerUnlockFurniture#player_unlock_furniture.unlock_list),
    case Type == GiveMaxType + 1 of
	true ->
	    true;
	false ->
	    throw({false, ?unlock_furniture_type_error})
    end.


validate_level(SysShopClassTplt, HouseData) ->
    PlayerLevel = house_level_exp:get_level(HouseData),
    UnlockLevel = SysShopClassTplt#sys_shop_class_tplt.unlock_level,
    case PlayerLevel >= UnlockLevel of
	true ->
	    true;
	false ->
	    throw({false, ?unlock_furniture_level_error})
    end.

validate_diamond(SysShopClassTplt, HouseData) ->
    PlayerDiamond = house_diamond:get_lover_diamond(HouseData),
    UnlockDiamond = SysShopClassTplt#sys_shop_class_tplt.unlock_money,
    case PlayerDiamond >= UnlockDiamond of
	true ->
	    true;
	false ->
	    throw({false, ?unlock_furniture_diamond_error})
    end.

validate_material([], _HouseData) ->
    true;
validate_material([{ItemId, Count}|Materials], HouseData) ->
    case house_pack:get_item_count_by_tempid([ItemId], HouseData) >= Count of
	true ->
	    validate_material(Materials, HouseData);
	false ->
	    throw({false, ?unlock_house_material_error})
    end.

do_unlock(SysShopClassTplt, Materials, PlayerUnlockFurniture, HouseData) ->
    {NHouseData, Msg} = house_pack:del_items_by_count(Materials, HouseData),
    Type = SysShopClassTplt#sys_shop_class_tplt.type,
    UnlockDiamond = SysShopClassTplt#sys_shop_class_tplt.unlock_money,
    NNHouseData = house_diamond:dec_diamond(UnlockDiamond, NHouseData),
    NUnlockList = [Type | PlayerUnlockFurniture#player_unlock_furniture.unlock_list],
    NPlayerUnlockFurniture = PlayerUnlockFurniture#player_unlock_furniture{unlock_list=NUnlockList},
    db:write(NPlayerUnlockFurniture),
    db:write(NNHouseData),
    {true, NPlayerUnlockFurniture, NNHouseData, Msg}.

get_unlock_list(PlayerUnlockFurniture) ->
    PlayerUnlockFurniture#player_unlock_furniture.unlock_list.

get_player_unlock_furniture(Account) ->
    case db:dirty_read(player_unlock_furniture, Account) of
	[] ->
	    PlayerUnlockFurniture = #player_unlock_furniture{account=Account, unlock_list=[]},
	    PlayerUnlockFurniture;
	[Furniture] ->
	    Furniture
    end.

get_max_unlock_list(UnlockList) ->
    case UnlockList == [] of
	true ->
	    0;
	false ->
	    lists:max(UnlockList)
    end.
