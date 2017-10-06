%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% 任务事件
%%% @end
%%% Created : 19 Apr 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(task_event).
-export([get_flags/2, listen/3, unlisten/3, get_event_name/1]).

-record(event, {              %% 事件
	  name,               %% 监听的时间名称
	  flags               %% 事件影响的标记
	 }).


%%%===================================================================
%%% API
%%%===================================================================
%% 获取事件关联的标记
%% Event:  事件
%% Events: 事件列表
%% 返回值:[flag_1, flag_2, ...].
get_flags(Event, Events) ->
    case lists:keyfind(Event, 2, Events) of
	false ->
	    [];
	#event{flags=Flags} ->
	    Flags
    end.

get_event_name(Operate) ->
    case Operate of
	{listen_grow_flag, Event, _Flag, _Count} -> %% 监听标记
	    Event;
	{listen_replace_flag, Event, _Flag, _Count} ->
	    Event;
	{listen_not_repeat_flag, Event, _Flag, _Count} ->
	    Event;
	{listen_expect_flag, Event, _Flag, _Count, _Expect} ->
	    Event
    end.

%% 监听事件
%% Event: 事件, event3
%% Flag : 事件影响的标记
%% Events : 事件列表[event1, event2]
%% 返回值 : 新的事件列表[event1, event2, event3]
listen(Event, Flag, Events) ->
    case lists:keyfind(Event, 2, Events) of
	false ->
	    [#event{name=Event, flags=[Flag]}|Events];
	#event{flags=Flags}=ListenEvent ->
	    case lists:member(Flag, Flags) of
		false ->
		    NFlags = [Flag|Flags],
		    lists:keyreplace(Event, 2, Events, ListenEvent#event{flags=NFlags});
		true ->
		    NFlags = lists:delete(Flag, Flags),
		    NNFlags = [Flag | NFlags],
		    lists:keyreplace(Event, 2, Events, ListenEvent#event{flags=NNFlags})
	    end
    end.

%% 解除监听事件
%% Event : 事件, event3
%% Flag :  标记
%% Events : 事件列表[event1, event2, event3]
%% 返回值 : 新的事件列表[event1, event2]
unlisten(Event, Flag, Events) ->
    case lists:keyfind(Event, 2, Events) of
	#event{flags=Flags}=ListenEvent->
	    NFlags = lists:delete(Flag, Flags),
	    case NFlags == [] of
		true ->
		    lists:keydelete(Event, 2, Events);
		false ->
		    lists:keyreplace(Event, 2, Events, ListenEvent#event{flags=NFlags})
	    end;
	false ->
	    Events
    end.
