%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%%
%%% @end
%%% Created : 23 May 2012 by LinZhengJian <linzhj@35info.cn>

-module(player_gm_permission).

-include("records.hrl").

-export([get/1,set/2]).

get(Account)->
    case db:dirty_read(player_gm_permission, Account) of
	[] -> [];
	[Data] -> Data
    end.

-spec set(atom(), {integer(), integer()})-> ok.
set(Account, {Enable, Money, Item})->
    db:dirty_write(#player_gm_permission{account=Account, money=Money, item=Item, enable=Enable}).
