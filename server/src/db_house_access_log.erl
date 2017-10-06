%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%%
%%% @end
%%% Created : 20 Sep 2012 by LinZhengJian <linzhj@35info.cn>

-module(db_house_access_log).
-include("records.hrl").

-export([get/1, set/1]).

get(Account)->
    case db:dirty_read(house_access_log, Account) of
	[]->
	    #house_access_log{account=Account, access_log_list=[]};
	[HouseAccessLog]->
		HouseAccessLog 
    end.

set(HouseAccessLog)->
    db:dirty_write(HouseAccessLog).
