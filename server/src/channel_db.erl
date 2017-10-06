%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2013, LinZhengJian
%%% @doc
%%%
%%% @end
%%% Created : 20 Feb 2013 by LinZhengJian <linzhj@35info.cn>

-module(channel_db).
-include("records.hrl").

-export([insert/1, all/0, select/1, delete/1]).

all()->
    Keys = db:dirty_all_keys(channel_basic_info),
    [select(Key) || Key <- Keys].

insert(Channel)->
    db:dirty_write(Channel).
		    
select(Id)->
    case db:dirty_read(channel_basic_info, Id) of
	[]->
	    empty;  
	[Channel] ->
	    Channel
    end.

delete(Id)->
    db:dirty_delete(channel_basic_info, Id),
    ok.
