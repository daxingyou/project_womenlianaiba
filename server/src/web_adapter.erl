%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%%
%%% @end
%%% Created : 29 Aug 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(web_adapter).

-compile(export_all).

add_item(Account, ItemId, ItemCount) ->
    F = fun()->
		HouseId = player_basic_data:get_house_id(Account), 
		[HouseData] = db:read(house_data, HouseId),
		{NHouseData, _MessageList} = house_pack:add_items([{ItemId, ItemCount}], HouseData),
		db:write(NHouseData)
	end,
    db:transaction(F).


