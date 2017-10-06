%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@china-channel.com>
%%% @copyright (C) 2010, linyibin
%%% @doc
%%% 房屋日志
%%% @end
%%% Created :  4 Aug 2010 by linyibin <linyb@china-channel.com>
%%%-------------------------------------------------------------------
-module(player_house_log).

-include("enum_def.hrl").
-include("packet_def.hrl").
-include("house_data.hrl").

-define(LOGSAVETIME, 3 * 24 * 60 * 60).

%% API
-export([write/6, 
	 clear/1]).

-export([compatible/1]).


%%%===================================================================
%%% API
%%%===================================================================
%% 记录访问日志
%% -spec write(atom(), atom(), tuple(), tuple()) -> tuple().
%% write(Account, Owner, DateTime, HouseData) 
%%   when is_atom(Account), is_atom(Owner), is_tuple(HouseData) ->
%%     write(Account, Owner,DateTime, HouseData).

write(Account, Boy, Girl, HouseData, Guest, AccountOpenId) 
  when is_atom(Account), is_atom(Boy), is_tuple(HouseData) ->
    case Account /= Boy andalso Account /= Girl of
	true ->
	    Log = HouseData#house_data.visit_logs,
	    %% 只保留50记录	    
	    NHouseData = HouseData#house_data{visit_logs=[#visit_log{account=Guest, openid=AccountOpenId, visit_time=datetime:localtime()}|lists:sublist(Log, 29)]},
	    {ok, NHouseData};
	_ ->
	    unchanged
    end.

%% 清空记录
clear(HouseData)
  when is_tuple(HouseData) ->
    HouseData#house_data{visit_logs=[]}.

-spec compatible(list(#visit_log{}) | []) -> list(#visit_log{}) | [].
compatible([])->
    [];
compatible(VisitLogs) when is_list(VisitLogs)->
    [compatible_one(VisitLog) || VisitLog <- VisitLogs ].

compatible_one({visit_log, Account, VisitTime})->
 #visit_log{account=Account, openid="", visit_time=VisitTime};
compatible_one(#visit_log{}=VisitLog)->
    VisitLog.





    
