%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2011, LinZhengJian
%%% @doc
%%% 每日的访问记录
%%% @end
%%% Created : 17 Dec 2011 by LinZhengJian <linzhj@35info.cn>

-module(daily_visit_log).

-include("records.hrl").

-export([visit/2, get_today_visited_firends/1]).

-export([access/3, is_accessed_of_today/3]).

get_today_visited_firends(Account)->
    Conn = get_connection(),
    Logs = mongodb_services:select(Conn, daily_visit_log, 
				   {guest, Account,  visit_time,{'$gt', mongodb_services:today()}}),
    case Logs of 
	[]->
	    %%mongodb_services:delete(Conn, daily_visit_log, {guest, Account}),
	    [];
	_ -> [bson:lookup(houseid, Item, 0) || Item <- Logs]
    end.

visit(Guest, HouseID)->
    VisitTime =  bson:timenow(),
    insert(Guest, HouseID, VisitTime).

insert(Guest, HostHouseID, VisitTime)->
    Conn = get_connection(),
    mongodb_services:delete(Conn, daily_visit_log, {guest, Guest, houseid, HostHouseID}),
    mongodb_services:insert(Conn, daily_visit_log, {guest, Guest, houseid, HostHouseID, visit_time, VisitTime}).

get_connection()->
    %% mongodb_services:get_connection().
    Conns = get(?MODULE),
    NConns = case Conns of 
    		 undefined->
    		     Conns1 = mongodb_services:get_connections(),
    		     put(?MODULE, Conns1),
    		     Conns1;
    		 _->
    		     Conns
    	     end,
    mongodb_services:get_connection(NConns).
    
-spec access(atom(), integer(), {calendar:datetime()}) -> ok.
access(Account, HouseId, DateTime)->
    #house_access_log{access_log_list=AccessLogList} = db_house_access_log:get(Account),
    NewAccessLogList =
	case find(AccessLogList, HouseId) of
	    null->
		[#access_log{houseid=HouseId, last_access_time=DateTime}| AccessLogList];
	    AccessLog ->
		[#access_log{houseid=HouseId, last_access_time=DateTime}|lists:delete(AccessLog, AccessLogList)]
	end,
    db_house_access_log:set(#house_access_log{account=Account, access_log_list=NewAccessLogList}).

find([], _HouseId)->
    null;
find([#access_log{houseid=HouseId}=AccessLog|_OtherAccessLogList], HouseId)->
    AccessLog;
find([_AccessLog|OtherAccessLogList], HouseId) ->
    find(OtherAccessLogList, HouseId).

-spec is_accessed_of_today(atom(), integer(), {calendar:datetime()}) -> boolean().
is_accessed_of_today(Account, HouseId, {{Year, Month, Date}, _Time})->
    #house_access_log{access_log_list=AccessLogList} =
	case db_house_access_log:get(Account) of
	    []->
		#house_access_log{account=Account, access_log_list=[]};
	    undefined->
		#house_access_log{account=Account, access_log_list=[]};
	    HouseAccessLog->
		HouseAccessLog
	end,
    case find(AccessLogList, HouseId) of
	null->
	    true;
	#access_log{last_access_time={{LYear, LMonth, LDate}, _LTime}} ->
	    Year == LYear andalso Month == LMonth andalso Date == LDate
    end.
