%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2013, linyibin
%%% @doc
%%% 食物制造区域
%%% @end
%%% Created : 22 Jun 2013 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(player_food_produce).

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
-export([start/1, get_produce_area/1]).
-export([handle_cast/2]).

%%%===================================================================
%%% API
%%%===================================================================
start(Account) ->
    [router:make_event_source(?msg_req_produce_area, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_expand_produce_area, Account, {Account, ?MODULE})
    ].

%%--------------------------------------------------------------------
%% @doc
%% @获取当前生产区域
%% @end
%%--------------------------------------------------------------------
get_produce_area(PlayerFood) ->
    ProduceArea = player_food:get_produce_area(PlayerFood),
    case ProduceArea of
	[] ->
	    2;
	_ ->
	    ProduceArea
    end.

%%%===================================================================
%%% Handle cast
%%%===================================================================
handle_cast({#msg{src=Account}, #req_produce_area{}}, State) ->
    F = fun() ->
		PlayerFood = player_food:get(Account),
		get_produce_area(PlayerFood)
	end,
    case db:transaction(F) of
	Number ->
	    net_helper:send2client(Account, #notify_produce_area{number=Number})
    end,
    {noreply, State};
handle_cast({#msg{src=Account}, #req_expand_produce_area{grid_index=GridIndex}}, State) ->
    F = fun() ->
		[PlayerBasicData] = db:read(player_basic_data, Account),
		HouseId = player_basic_data:get_house_id(PlayerBasicData),
		[HouseData] = db:read(house_data, HouseId),
		PlayerFood = player_food:get(Account),
		Number = get_expand_produce_area(PlayerFood),
		ProduceAreaTplt = tplt:get_data(player_food_produce_area_tplt, Number),
		case can_expand_produce_area(ProduceAreaTplt, HouseData) of
		    true ->
			expand_produce_area(ProduceAreaTplt, PlayerFood, HouseData);
		    {false, Reason} ->
			Reason
		end
	end,
    case db:transaction(F) of
	{true, ExpandAreaNumber, DelItemMsgs, NHouseData} ->
	    house_pack:send_msgs(DelItemMsgs, NHouseData),
	    house_diamond:notify(NHouseData),
	    router:cast(Account, expand_produce_area_event, Account),
	    net_helper:send2client(Account, #notify_expand_produce_area{number=ExpandAreaNumber, grid_index=GridIndex});
	Reason ->
	    sys_msg:send(Account, Reason)
    end,
    {noreply, State}.
%%%===================================================================
%%% Internal functions
%%%===================================================================
%%--------------------------------------------------------------------
%% @doc
%% @获取扩大的生产区域
%% @end
%%--------------------------------------------------------------------
get_expand_produce_area(PlayerFood) ->
    Number = get_produce_area(PlayerFood),
    Number + 1.

%%--------------------------------------------------------------------
%% @doc
%% @是否可以扩大制造区域
%% @end
%%--------------------------------------------------------------------
can_expand_produce_area(ProduceAreaTplt, HouseData) ->
    try
	can_expand_by_diamond(ProduceAreaTplt, HouseData),
	can_expand_by_item(ProduceAreaTplt, HouseData)
    catch
	throw:Reason ->
	    Reason
    end.

%%--------------------------------------------------------------------
%% @doc
%% @判断水晶是否足够
%% @end
%%--------------------------------------------------------------------
can_expand_by_diamond(ProduceAreaTplt, HouseData) ->
    Diamond = house_diamond:get_lover_diamond(HouseData),
    NeedDiamond = get_expand_produce_area_need_diamond(ProduceAreaTplt),
    case Diamond >= NeedDiamond of
	true ->
	    true;
	false ->
	    throw({false, ?player_food_produce_area_diamond})
    end.

%%--------------------------------------------------------------------
%% @doc
%% @材料是否足够
%% @end
%%--------------------------------------------------------------------
can_expand_by_item(ProduceAreaTplt, HouseData) ->
    Items = get_expand_produce_area_need_items(ProduceAreaTplt),
    lists:foldl(fun({ItemID, Count}, _Result) ->
			case house_pack:get_item_count_by_tempid([ItemID], HouseData) >= Count of
			    true ->
				true;
			    false ->
				throw({false, ?player_food_produce_area_items})
			end
		end, true, Items).

%%--------------------------------------------------------------------
%% @doc
%% @获取扩充所需要的材料
%% @end
%%--------------------------------------------------------------------
get_expand_produce_area_need_items(ProduceAreaTplt) ->
    ItemIDs = ProduceAreaTplt#player_food_produce_area_tplt.item_ids,
    ItemCount = ProduceAreaTplt#player_food_produce_area_tplt.item_count,
    [{lists:nth(1, ItemIDs), lists:nth(1, ItemCount)},
     {lists:nth(2, ItemIDs), lists:nth(2, ItemCount)},
     {lists:nth(3, ItemIDs), lists:nth(3, ItemCount)},
     {lists:nth(4, ItemIDs), lists:nth(4, ItemCount)}
    ].

%%--------------------------------------------------------------------
%% @doc
%% @获取扩充所需要的水晶
%% @end
%%--------------------------------------------------------------------
get_expand_produce_area_need_diamond(ProduceAreaTplt) ->
    ProduceAreaTplt#player_food_produce_area_tplt.diamond.

%%--------------------------------------------------------------------
%% @doc
%% @扩大制造区域
%% @end
%%--------------------------------------------------------------------
expand_produce_area(ProduceAreaTplt, PlayerFood, HouseData) ->
    %% 收回材料
    Items = get_expand_produce_area_need_items(ProduceAreaTplt),
    {NHouseData, DelItemsMsgs} = house_pack:del_items_by_count(Items, HouseData),
    %% 扣除水晶
    Diamond = get_expand_produce_area_need_diamond(ProduceAreaTplt),
    NNHouseData = house_diamond:dec_diamond(Diamond, NHouseData),
    %% 扩容
    ExpandAreaNumber = get_expand_produce_area(PlayerFood),
    NPlayerFood = player_food:set_produce_area(PlayerFood, ExpandAreaNumber),
    %% 持久化
    db:write(NNHouseData),
    db:write(NPlayerFood),
    {true, ExpandAreaNumber, DelItemsMsgs, NNHouseData}.
