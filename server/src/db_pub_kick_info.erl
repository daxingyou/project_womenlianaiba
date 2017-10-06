%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2013, hongjx
%%% @doc
%%%  ¾Æ°É±»ÌßµÇ¼Ç
%%% @end
%%% Created :  6 Mar 2013 by hongjx <hongjx@35info.cn>

-module(db_pub_kick_info).

-export([can_enter/2, save/2]).


-record(pub_kick_info, {pub_player, time}).



can_enter(PubID, Guest) when is_integer(PubID), is_atom(Guest) ->    
    case pub:get_owner(PubID) of
	[] ->
	    false;
	Guest -> 
	    true;
	_Owner ->
	    Now = datetime:local_time(),
	    S = datetime:datetime_to_gregorian_seconds(Now),
	    case db:dirty_read(pub_kick_info, {PubID, Guest}) of
		[#pub_kick_info{time=Time}] ->
		    S > Time + common_def:get_val(pub_kick_forbid_seconds);
		_ ->
		    true
	    end
    end.

save(PubID, Guest)  when is_integer(PubID), is_atom(Guest) ->
    Now = datetime:local_time(),
    S = datetime:datetime_to_gregorian_seconds(Now),
    db:dirty_write(#pub_kick_info{pub_player={PubID, Guest}, time=S}).





