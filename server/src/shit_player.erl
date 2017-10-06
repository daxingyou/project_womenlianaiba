%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2013, LinZhengJian
%%% @doc
%%%
%%% @end
%%% Created :  7 Mar 2013 by LinZhengJian <linzhj@35info.cn>

-module(shit_player).

-include("records.hrl").

-export([add/1, add/2, remove/1, is_shit/1]).

add(Accounts) when is_list(Accounts)->
    [add(Account) || Account <- Accounts];
add(Account)->
    add(Account, "").

add(Account, Comment)->
    case db_shit_player:select(Account) of
	empty->
	    ShitPlayer = #shit_player{account=Account, comment=Comment, datetime=datetime:local_time()},
	    db_shit_player:insert(ShitPlayer),
	    ShitPlayer;
	ShitPlayer ->
	    ShitPlayer
    end.

remove(Account)->
    db_shit_player:delete(Account).

is_shit(Account)->
    case db_shit_player:select(Account) of
	empty->
	    false;
	_ ->
	    true
    end.
