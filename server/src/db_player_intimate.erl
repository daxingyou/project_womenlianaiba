%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%%
%%% @end
%%% Created : 18 Sep 2012 by LinZhengJian <linzhj@35info.cn>

-module(db_player_intimate).

-include("records.hrl").

-export([get/1,set/1]).

get(Account)->
    case db:dirty_read(player_intimate, Account) of
	undefined->
	    #player_intimate{account=Account, intimate_list=[]};
	[] ->
	    #player_intimate{account=Account, intimate_list=[]};
	[PlayerIntimate]->
	    PlayerIntimate
    end.

set(#player_intimate{}=PlayerIntimate)->
    db:dirty_write(PlayerIntimate).
