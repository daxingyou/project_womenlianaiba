%%% @author linyb
%%% @copyright (C) 2012, 35
%%% @doc
%%%
%%% @end
%%% Created : 

-module(item_unlock_special_house).

-include("tplt_def.hrl").

-compile(export_all).

can_use_item(_Owner, _Targets, _HouseData, _Item, _ItemTplt, _PlayerData) ->
    true.

use_item({Account, _Targets, HouseData, _Item, _ItemTplt, _PlayerData}, UnLockIDs) ->
    [unlock_house(Account, UnLockID, Count) ||{UnLockID, Count} <- UnLockIDs],
    Msgs = [{sys_msg, send, [Account, 
			     553, 
			     [Count, get_special_house_name(UnLockID)]]} || {UnLockID, Count}<-UnLockIDs],
    {ok, HouseData, Msgs}.

get_special_house_name(UnLockID) ->
    PlayerSpecialHouseTplt = tplt:get_data(player_special_house_tplt, UnLockID),
    PlayerSpecialHouseTplt#player_special_house_tplt.name.

unlock_house(_Account, _UnLockID, 0) ->
    ok;
unlock_house(Account, UnLockID, 1) ->
    F = fun() ->

		PlayerSpecialHouse = player_special_house:get_player_special_house(Account),
		NPlayerSpecialHouse = player_special_house:add_unlock(UnLockID, PlayerSpecialHouse),
		db:write(NPlayerSpecialHouse)
	end,
    db:transaction(F).
