%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%%
%%% @end
%%% Created : 27 Apr 2012 by LinZhengJian <linzhj@35info.cn>

-module(player_offline_notify).

-include("records.hrl").

-export([add/3,add/2, get/2, delete/2]).

add(Account, NotifyType)->   
    add(Account, NotifyType, 1).

add(Account, NotifyType, Count)->
    OfflineNotify = 
	case db:dirty_read(offline_notify, Account) of
	[]->
	    #offline_notify{account=Account, notifies=[{NotifyType, Count}]};
	[#offline_notify{notifies=Notifies}]->
	    OldCount = proplists:get_value(NotifyType, Notifies, 0),
	    NewCount = OldCount + Count,
	    NewNotifies = [{NotifyType, NewCount} | proplists:delete(NotifyType, Notifies)],
		#offline_notify{account=Account, notifies=NewNotifies}
    end,
    db:dirty_write(OfflineNotify).


get(Account, NotifyType)->
    case db:dirty_read(offline_notify, Account) of
	[]->
	    0;
	[#offline_notify{notifies=Notifies}]->
	    proplists:get_value(NotifyType, Notifies, 0)
    end.


delete(Account, NotifyType)->
    case db:dirty_read(offline_notify, Account) of
	[]->
	    ok;
	[#offline_notify{notifies=Notifies}]->
	    db:dirty_write(#offline_notify{account=Account, notifies=proplists:delete(NotifyType, Notifies)})
    end.
