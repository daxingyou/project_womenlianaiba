%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%%
%%% @end
%%% Created : 27 Jul 2012 by LinZhengJian <linzhj@35info.cn>

-module(db_player_breakup).

-include("records.hrl").

-export([select/1, delete/1]).

-spec select(atom())-> undefined | #player_breakup{}.
select(Account)->
    case db:dirty_read(player_breakup, Account) of
	[]->
	    undefined;
	[PlayerBreakup] ->
	    PlayerBreakup
    end.

-spec delete(atom())->ok.
delete(Account)->
    db:dirty_delete(player_breakup, Account).
    
