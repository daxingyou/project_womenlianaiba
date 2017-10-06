%%%-------------------------------------------------------------------
%%% @author  linyijie
%%% @copyright (C) 2010, 
%%% @doc
%%%  服装类的物品
%%% @end
%%% Created :  6 Apr 2010 by  <>
%%%-------------------------------------------------------------------
-module(item_dress).

-include("tplt_def.hrl").
-include("enum_def.hrl").
-include("packet_def.hrl").
-include("sys_msg.hrl").
-include("common_def.hrl").

%% API 
-export([get_mutli_putoff_dress/2, get_putoff_dress/2]).
-export([get_item_gender_attribute/1]).

%% 获取穿多件新装备时, 要脱下来的服装
%% 返回[#item{}].
get_mutli_putoff_dress(TempIds, BodyGrids) ->
    do_get_mutli_putoff_dress(TempIds, BodyGrids, []).

do_get_mutli_putoff_dress([], _BodyGrids, PutOffItems) ->
    PutOffItems;
do_get_mutli_putoff_dress([TempId|TempIds], BodyGrids, PutOffItems) ->
    PutOffItem = get_putoff_dress(TempId, BodyGrids),
    do_get_mutli_putoff_dress(TempIds, BodyGrids, PutOffItem ++ PutOffItems).

%% 获得穿上一件新装备时, 需要脱下来的服装
%% 返回[#item{}].
-spec get_putoff_dress(non_neg_integer(), tuple()) -> list().
get_putoff_dress(NewDressTempID, _BodyGrids) when NewDressTempID < 0 ->
    erlang:error({badarg, NewDressTempID});
get_putoff_dress(NewDressTempID, _BodyGrids) when NewDressTempID =:= 0 ->
    [];
get_putoff_dress(NewDressTempID, BodyGrids) ->
    #item_dress_tplt{equip_placeholder=Holders}	= tplt:get_dress_data(NewDressTempID),
    NewHolders = get_more_putoff_holders(BodyGrids, Holders),
    [{H, Item} || H <- NewHolders, begin Item = pack:get_item(H, BodyGrids), Item /= empty end].

%% 取得更多需要脱下的栏位
get_more_putoff_holders(BodyGrids, OldHolders) when is_list(OldHolders) ->
    F = fun(_Index, {Item, Count}, Acc) ->  
		case Count of
		    0 ->
			Acc;
		    _ ->
			ItemTempID = item:get_tempid(Item),
			#item_dress_tplt{equip_placeholder=Holders}
			    = tplt:get_dress_data(ItemTempID),
			
			%% 取交集X
			{X, B} = lists:partition(fun(E) -> lists:member(E, Acc) end, Holders),
			%% 如果有交集, 说明此栏装备也要脱下, 加入并集
			case length(X) > 0 of
			    true ->
				Acc ++ B;
			    _ ->
				Acc
			end
		end
	end,
    NewHolders = pack:foldl(F, OldHolders, BodyGrids),
    NewHolders.

%%% @spec get_item_gender_attribute(#item{})->integer().
%%% @doc 获取该物品的性别属性，返回?st_boy | ?st_girl | ?st_unknow
-spec get_item_gender_attribute(#item{}) -> ?st_boy | ?st_girl | ?st_unknow.
get_item_gender_attribute(#item{template_id=ItemId})->
    case tplt:get_data(item_tplt, ItemId) of
	#item_tplt{sub_id=SubId} ->
	    case tplt:get_data(item_dress_tplt,SubId) of
		#item_dress_tplt{sex=Sex}->
		    Sex;
		_->
		    ?st_unknow
	    end;
	_->
	    ?st_unknow
    end.
    
