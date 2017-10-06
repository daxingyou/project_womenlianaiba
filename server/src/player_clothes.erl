%%%-------------------------------------------------------------------
%%% @author linyijie <linyj@35info.cn>
%%% @copyright (C) 2013, linyijie
%%% @doc
%%% 玩家衣服
%%% @end
%%% Created :  8 Aug 2013 by linyijie <linyj@35info.cn>
%%%-------------------------------------------------------------------
-module(player_clothes).

-include("tplt_def.hrl").

%% API
-export([get_clothes_from_pack/1,
	 get_clothes_from_pack_by_sex/2
	]).

%%%===================================================================
%%% API
%%%===================================================================

%%--------------------------------------------------------------------
%% @doc
%% @从包裹中获取所有的衣服
%% @end
%%--------------------------------------------------------------------
get_clothes_from_pack(Pack) ->
    PackItems = house_pack:get_item_list(Pack),
    lists:foldl(fun(PackItem, Items) ->
			Item = house_pack:get_item(PackItem),
			TempID = item:get_tempid(Item),
			case tplt:get_data(item_dress_tplt, TempID) of
			    empty ->
				Items;
			    _ItemDressTplt ->
				[Item | Items]
			end
		end, [], PackItems).

%%--------------------------------------------------------------------
%% @doc
%% @从包裹中根据性别获取所有的衣服
%% @end
%%--------------------------------------------------------------------
get_clothes_from_pack_by_sex(Pack, Sex) ->
    PackItems = house_pack:get_item_list(Pack),
    lists:foldl(fun(PackItem, Items) ->
			Item = house_pack:get_item(PackItem),
			Count = house_pack:get_count(PackItem),
			TempID = item:get_tempid(Item),
			case tplt:get_data(player_charm_tplt, TempID) of
			    empty ->
				Items;
			    ItemDressTplt ->
				data_helper:format("Item:~p, Count:~p~n", [Item, Count]),
				case (ItemDressTplt#player_charm_tplt.sex == Sex) and
				    (not item:overdue(Item)) of
				    true ->
					NItems = lists:duplicate(Count, Item),
					NItems ++ Items;
				    false ->
					Items
				end
			end
		end, [], PackItems).

%%%===================================================================
%%% Internal functions
%%%===================================================================
