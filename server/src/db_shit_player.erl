%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2013, LinZhengJian
%%% @doc
%%%
%%% @end
%%% Created :  7 Mar 2013 by LinZhengJian <linzhj@35info.cn>

-module(db_shit_player).

-export([insert/1, select/1, delete/1]).

insert(ShitPlayer)->
    db:dirty_write(ShitPlayer).

select(Account)->
    case db:dirty_read(shit_player, Account) of
	[]->
	    empty;
	[ShipPlayer]->
	    ShipPlayer
    end.

delete(Account)->
    db:dirty_delete(shit_player, Account).

