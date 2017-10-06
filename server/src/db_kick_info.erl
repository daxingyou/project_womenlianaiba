%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%   ±»ÌßµÇ¼Ç
%%% @end
%%% Created : 29 Aug 2012 by hongjx <hongjx@35info.cn>

-module(db_kick_info).

-export([can_enter_house/2, save/2]).


-record(kick_info, {pair_player, time}).


can_enter_house(HouseData, Guest) when is_atom(Guest) ->
    case house:is_house_owner(HouseData, Guest) of
	false ->
	    HouseID = house_data:get_house_id(HouseData),
	    Now = datetime:local_time(),
	    S = datetime:datetime_to_gregorian_seconds(Now),
	    case db:dirty_read(kick_info, {HouseID, Guest}) of
		[#kick_info{time=Time}] ->
		    S > Time + common_def:get_val(kick_forbid_seconds);
		_ ->
		    true
	    end;
	_ ->
	    true
    end.

save(HouseID, Guest)  when is_integer(HouseID), is_atom(Guest) ->
    Now = datetime:local_time(),
    S = datetime:datetime_to_gregorian_seconds(Now),
    db:dirty_write(#kick_info{pair_player={HouseID, Guest}, time=S}).
    












