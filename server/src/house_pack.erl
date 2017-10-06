%%%-------------------------------------------------------------------
%%% @author lyj <lyj@35info.cn>
%%% @copyright (C) 2012, lyj
%%% @doc
%%%  房屋包裹, 对pack.erl的进一步的封装
%%% @end
%%% Created : 10 Apr 2012 by lyj <lyj@35info.cn>
%%%-------------------------------------------------------------------
-module(house_pack).

-export([read/1, save/1, get_item/2, 
	 get_item_count/2,
	 get_item_count_by_tempid/3,
	 get_item_count_by_tempid/2,
	 try_del_n_by_tempid/3,
	 send_msgs/2,
	 is_item_exist/2, 
	 add_items/2, 
	 del_item_by_tempid/2, 
	 del_items/2, 
	 del_item_by_tempid/3,
	 del_items_by_count/2]).

-export([get_item_list/1,
	 get_item/1,
	 get_count/1
	]).

-include("sys_msg.hrl").
-include("packet_def.hrl").
-include("house_data.hrl").

read(HouseID) when is_integer(HouseID) ->
    [HouseData] = db:read(house_data, HouseID),
    HouseData;
read(Account) ->
    HouseID = player_basic_data:get_house_id(Account),
    [HouseData] = db:read(house_data, HouseID),
    HouseData.

save(HouseData) when is_record(HouseData, house_data) ->
    db:write(HouseData).

%% 判断指定的物品是否存在
is_item_exist(ItemInstID, HouseData) when is_record(HouseData, house_data) ->
    Pack = house_lover_package:get_lover_package(HouseData),
    house_lover_package:is_item_exist(ItemInstID, Pack).

%% 根据模版id 删物品 
%% 返回true 或 {false, Err}
del_item_by_tempid(HouseID, Account, ItemIDList) when is_integer(HouseID) ->
    del_item_by_tempid(HouseID, Account, ItemIDList);    
del_item_by_tempid(HouseData, Account, ItemIDList) when is_record(HouseData, house_data)->
    house_lover_package:del_item_by_tempid(house:get_house_id(HouseData), Account, ItemIDList).

%% 根据模版id 删除一个物品
%% 返回 {false, Err} 或 {NewHouseData, Msgs} 
%%   Msgs 可通过 send_msgs 发送出去
del_item_by_tempid(ItemTpltID, HouseData) 
  when is_integer(ItemTpltID),
       is_record(HouseData, house_data)->
    Pack = house_lover_package:get_lover_package(HouseData),
    case house_lover_package:del_item_by_tempid([ItemTpltID], Pack) of
	{{NewPack, Msgs}, _DelItemID} ->
	    {house_lover_package:set_lover_package(NewPack, HouseData), Msgs};
	False -> False
    end;
del_item_by_tempid([], HouseData) ->
    {HouseData, []};
del_item_by_tempid(ItemTpltIDs, HouseData) when is_list(ItemTpltIDs) ->
    Pack = house_lover_package:get_lover_package(HouseData),
    case house_lover_package:del_item_by_tempid(ItemTpltIDs, Pack) of
	{{NewPack, Msgs}, _DelItemID} ->
	    {house_lover_package:set_lover_package(NewPack, HouseData), Msgs};
	False -> False
    end.    

%% 根据物品的实例ID获得物品
%% 如果物品不存在, 返回{false, ?msg_bag_no_item}
get_item(ItemInstID, HouseData) when is_record(HouseData, house_data) ->
    Pack = house_lover_package:get_lover_package(HouseData),
    house_lover_package:get_item(ItemInstID, Pack).

%% 取物品数量
%% 如果物品不存在, 返回{false, ?msg_bag_no_item}
get_item_count(ItemInstID, HouseData) when is_record(HouseData, house_data) ->
    Pack = house_lover_package:get_lover_package(HouseData),
    house_lover_package:get_item_count(ItemInstID, Pack).


get_item_count_by_tempid([], _HouseData, Total) ->
    lists:reverse(Total);
get_item_count_by_tempid([ItemTpltID | Rest], HouseData, Total) ->
    Pack = house_lover_package:get_lover_package(HouseData),
    Count = pack:get_item_count_by_tempid([ItemTpltID], Pack),
    get_item_count_by_tempid(Rest, HouseData, [Count |Total]).

get_item_count_by_tempid(TempIds, HouseData) when is_record(HouseData, house_data) ->
    Pack = house_lover_package:get_lover_package(HouseData),
    pack:get_item_count_by_tempid(TempIds, Pack).


%% 增加物品
%% ItemsList = [{TempID, ItemCount}] or [#item{}] 
%% 返回 {HouseData, Msgs}
add_items([], HouseData) ->
    {HouseData, []};
add_items(ItemList, HouseData) when is_list(ItemList) ->
    Pack = house_lover_package:get_lover_package(HouseData),
    {NPack, Msgs} = house_lover_package:add_items(ItemList, Pack),
    {house_lover_package:set_lover_package(NPack, HouseData), Msgs}.

%% 删除物品(每次删除一个数量)
%% ItemList = [ItemInstID] or [#item{}]  
%% 返回 {false, Err} 或 {NewHouseData, Msgs} 
%%   Msgs 可通过 send_msgs 发送出去
del_items(ItemList, HouseData) when is_list(ItemList) ->
    Pack = house_lover_package:get_lover_package(HouseData),
    case house_lover_package:del_items(ItemList, Pack) of
	{false, Err} -> 
	    {false, Err};
	{NPack, Msgs} ->
	    {house_lover_package:set_lover_package(NPack, HouseData), Msgs}
    end.

del_items_by_count(ItemCountList, HouseData) ->
    del_items_by_count(ItemCountList, HouseData, []).

del_items_by_count([], HouseData, Msgs) ->
    {HouseData, lists:reverse(lists:flatten(Msgs))};
del_items_by_count([{ItemID, Count} | ItemCountList], HouseData, Msgs) ->
    Pack = house_lover_package:get_lover_package(HouseData),
    {_NDel, NPack, Msgs1} = house_lover_package:try_del_n_by_tempid([ItemID], Count, Pack),
    NHouseData = house_lover_package:set_lover_package(NPack, HouseData),
    del_items_by_count(ItemCountList, NHouseData, [Msgs1 | Msgs]).

%% 能删几个算几个
%% NNeed 表示需要删除的数量
%% 返回{NDel, NewHouseData, Msgs} 
%%   Msgs 可通过 send_msgs 发送出去
try_del_n_by_tempid(TempIDList, NNeed, HouseData) when is_list(TempIDList) ->
    Pack = house_lover_package:get_lover_package(HouseData),
    {NDel, NPack, Msgs} = house_lover_package:try_del_n_by_tempid(TempIDList, NNeed, Pack),
    {NDel, house_lover_package:set_lover_package(NPack, HouseData), Msgs}.


%% 通知更新物品数量
send_msgs(Msgs, HouseData) when is_record(HouseData, house_data) ->
    house_lover_package:send_msgs(Msgs, HouseData).


%% 把包裹数据转换成list
-spec get_item_list(array())->list(#item{}).
get_item_list(Pack)->
    array:to_list(Pack).

%%--------------------------------------------------------------------
%% @doc
%% @获取物品
%% @end
%%--------------------------------------------------------------------
get_item(PackItem) ->
    PackItem#pack_grid.item_data.

%%--------------------------------------------------------------------
%% @doc
%% @获取物品数量
%% @end
%%--------------------------------------------------------------------
get_count(PackItem) ->
    PackItem#pack_grid.count.


