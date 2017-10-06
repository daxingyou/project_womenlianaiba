%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2013, linyibin
%%% @doc
%%% 玩家魅力值
%%% @end
%%% Created :  8 Aug 2013 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(player_charm).

-include("packet_def.hrl").
-include("tplt_def.hrl").
-include("sys_msg.hrl").
-include("router.hrl").
-include("common_def.hrl").
-include("enum_def.hrl").
-include("resource.hrl").
-include("records.hrl").

%% API
-export([start/1,
	 handle_cast/2,
	 get_charm_by_itemid/1,
	 get_charm_by_items/1,
	 get_charm_by_item/1,
	 calc_charm/1
	]).

%%%===================================================================
%%% API
%%%===================================================================
start(Account) ->
    [router:make_event_source(?msg_req_calc_player_charm, Account, {Account, ?MODULE})
    ].

%%--------------------------------------------------------------------
%% @doc
%% @获得某件物品的魅力值
%% @end
%%--------------------------------------------------------------------
get_charm_by_itemid(ItemId)->
    case tplt:get_property(tplt:get_data(item_tplt, ItemId)) of
	#item_dress_additional_properties_tplt{charm=Charm}->
	    util:eval(binary_to_list(Charm) ++ ".");
	_->
	    0
    end.

%%--------------------------------------------------------------------
%% @doc
%% 获取所有物品的魅力值
%% @end
%%--------------------------------------------------------------------
get_charm_by_items(Items) ->
    lists:foldl(
      fun(Item, CharmAcc)->
	      get_charm_by_item(Item) + CharmAcc
      end, 0, Items).

%%--------------------------------------------------------------------
%% @doc
%% 获取单个物品的魅力值
%% @end
%%--------------------------------------------------------------------
get_charm_by_item(#item{template_id=ItemId, property=Properties})->
    case Properties of
	undefined->
	    get_charm_value([], ItemId);
	[]-> 
	    get_charm_value([], ItemId);
	PropertyList when is_list(PropertyList)->
	    get_charm_value(PropertyList, ItemId);
	_->
	    get_charm_value([], ItemId)
    end.

%%--------------------------------------------------------------------
%% @doc
%% 计算魅力值
%% @end
%%--------------------------------------------------------------------
calc_charm(Account) ->
    F = fun() ->
		[PlayerBasicData] = db:read(player_basic_data, Account),
		HouseId = player_basic_data:get_house_id(PlayerBasicData),
		[HouseData] = db:read(house_data, HouseId),
		CharmFromPack = calc_charm_from_pack(PlayerBasicData, HouseData),
		CharmFromBody = calc_charm_from_body(PlayerBasicData),
		data_helper:format("PackCharm:~p, BodyCharm:~p~n", [CharmFromPack, CharmFromBody]),
		TotalCharm = CharmFromPack + CharmFromBody,
		OldTotalCharm = player_basic_data:get_charm(PlayerBasicData),
		case TotalCharm == OldTotalCharm of
		    true ->
			TotalCharm;
		    _ ->
			NPlayerBasicData = player_basic_data:set_charm(TotalCharm, PlayerBasicData),
			db:write(NPlayerBasicData),
			TotalCharm
		end

	end,
    case db:transaction(F) of
	Charm ->
	    net_helper:send2client(Account, #notify_calc_player_charm{charm=Charm})
    end.

%%%===================================================================
%%% Handle cast
%%%===================================================================

handle_cast({#msg{src=Account}, #req_calc_player_charm{}}, State) ->
    calc_charm(Account),
    {noreply, State}.

%%%===================================================================
%%% Internal functions
%%%===================================================================

%%--------------------------------------------------------------------
%% @doc
%% 获取包裹中可以穿的衣服
%% 根据性别过滤
%% @end
%%--------------------------------------------------------------------
get_items_from_pack(PlayerBasicData, HouseData) ->
    Pack = house_lover_package:get_lover_package(HouseData),
    Sex = player_basic_data:get_sex(PlayerBasicData),
    player_clothes:get_clothes_from_pack_by_sex(Pack, Sex).

%%--------------------------------------------------------------------
%% @doc
%% 计算包裹中的衣服的魅力值
%% @end
%%--------------------------------------------------------------------
calc_charm_from_pack(PlayerBasicData, HouseData) ->
    PackItems = get_items_from_pack(PlayerBasicData, HouseData),
    get_charm_by_items(PackItems).

%%--------------------------------------------------------------------
%% @doc
%% 计算身体上的衣服的魅力值
%% @end
%%--------------------------------------------------------------------
calc_charm_from_body(PlayerBasicData) ->
    Body = player_basic_data:get_body(PlayerBasicData),
    Items = player_body:get_all_items(Body),
    get_charm_by_items(Items).

%%--------------------------------------------------------------------
%% @doc
%% 获取魅力值
%% 如果没有魅力值属性的物品则从表格读取，如果有直接从属性值中获取
%% @end
%%--------------------------------------------------------------------
get_charm_value([], ItemId)->
    case get_charm_by_itemid(ItemId) of
	{_Min, _Max} ->
	    0;
	Charm when is_integer(Charm)->
	    Charm;
	_->
	    0
    end;
get_charm_value([#item_property{key=Key, value=Value}|PropertyList], ItemId)->
    case Key of
	"charm"->
	    Value;
	_ ->
	    get_charm_value(PropertyList, ItemId)
    end.
