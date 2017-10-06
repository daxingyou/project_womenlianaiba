%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% 任务标记
%%% @end
%%% Created : 12 Apr 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(task_flag).

-include("player_task.hrl").
-include("packet_def.hrl").
%% API
-export([get_auto_unlisten_flag/1, unlisten_flag/3, update_flags/3, operate_flag/2, 
	 operate_flag/3, get_value_count/2, get_listens/2, delete_flag_info/2]).

-export([get_flag_value_count/1, get_flag_count/1, get_flag_key/1, get_flags/2]).

-record(flag, {               %% 标记结构
	  type,               %% 标记类型
	  key,                %% 标记名称
	  value,              %% 标记值
	  count,              %% 标记数量
	  is_auto_del = false,%% 是否自动销毁 1:代表自动销毁,2:代表手动销毁
	  listeners,          %% 监听者
	  expect=[]
	 }).

-define(ft_grow, 1).          %% 增长类型
-define(ft_not_repeat, 2).    %% 不重复类型
-define(ft_replace, 3).       %% 替换类型
-define(ft_expect, 4).
%%%===================================================================
%%% API
%%%===================================================================

%% 操作标记
operate_flag(Operate, InstId, PlayerTask) ->
    case Operate of
	[] ->
	    PlayerTask;
	{listen_grow_flag, Event, Flag, Count} -> %% 监听标记
	    NPlayerTask = listen_event(Event, Flag, PlayerTask),
	    listen_flag(?ft_grow, Flag, Count, InstId, true, NPlayerTask);
	{listen_replace_flag, Event, Flag, Count} ->
	    NPlayerTask = listen_event(Event, Flag, PlayerTask),
	    listen_flag(?ft_replace, Flag, Count, InstId, true, NPlayerTask);
	{listen_not_repeat_flag, Event, Flag, Count} ->
	    NPlayerTask = listen_event(Event, Flag, PlayerTask),
	    listen_flag(?ft_not_repeat, Flag, Count, InstId, true, NPlayerTask);
	{listen_expect_flag, Event, Flag, Count, Expect} ->
	    NPlayerTask = listen_event(Event, Flag, PlayerTask),
	    listen_flag(?ft_expect, Flag, Count, InstId, true, Expect, NPlayerTask);
	{unlisten_flag, Event, Flag} -> %% 解除监听标记
	    NPlayerTask = unlisten_event(Event, Flag, PlayerTask),
	    unlisten_flag(Flag, InstId, NPlayerTask);
	_ ->
	    operate_flag(Operate, PlayerTask)
    end.
operate_flag(Operate, PlayerTask) ->
    case Operate of
	{replace_flag, K, V} ->
	    replace_flag(K, V, PlayerTask);
	{update_flag, K, V} ->
	    update_flag(K, V, PlayerTask);
	{dec_flag, K} ->
	    dec_flag(K, PlayerTask);
	{create_flag, Type, K, V, Count} ->
	    create_flag(Type, K, V, Count, [], [], PlayerTask);
	{create_not_repeat_flag, K, Count} ->
	    create_flag(?ft_not_repeat, K, Count, [], false, [], PlayerTask);
	{create_grow_flag, K} ->
	    create_flag(?ft_grow, K, 0, [], false, [], PlayerTask);
	{create_replace_flag, K} ->
	    create_flag(?ft_replace, K, 0, [], false, [], PlayerTask);
	_ ->
	    PlayerTask
    end.

get_flag_value_count(#flag{value=Value}) when is_integer(Value) ->
    Value;
get_flag_value_count(#flag{value=Value}) when is_list(Value) ->
    length(Value).

get_flag_key(#flag{key=Key}) ->
    Key.

get_flag_count(#flag{count=Count}) ->
    Count.
    

%% 获取标记值的数量
get_value_count(Key, Flags) ->
    case lists:keyfind(Key, 3, Flags) of
	false ->
	    0;
	#flag{value=Value} when is_integer(Value) ->
	    Value;
	#flag{value=Value} when is_list(Value) ->
	    length(Value)
    end.

get_flags(Listens, PlayerTask) ->
    do_get_flags(Listens, PlayerTask, []).

update_flags(Event, Value, PlayerTask) ->
    Events = PlayerTask#player_task.events,
    Flags = task_event:get_flags(Event, Events),
    do_update_flags(Flags, Value, PlayerTask).

%% 获取监听者(根据事件获取监听者, 1对多的关系)
get_listens(Events, PlayerTask) when is_list(Events) ->
    lists:foldl(fun(Event, Listens) ->
			Listen = get_listens(Event, PlayerTask),
			Listen ++ Listens
		   end, [], Events);
get_listens(Event, PlayerTask) when is_record(PlayerTask, player_task) ->
    Events = PlayerTask#player_task.events,
    Flags = task_event:get_flags(Event, Events),
    do_get_listens(Flags, PlayerTask, []).

get_auto_unlisten_flag(Listens) ->
    do_get_auto_unlisten_flag(Listens, []).

%%%===================================================================
%%% Internal functions
%%%===================================================================
do_get_listens([], _PlayerTask, Listeners) ->
    Listeners;
do_get_listens([EventFlag|EventFlags], PlayerTask, Listeners) ->
    Flags = PlayerTask#player_task.flags,
    case lists:keyfind(EventFlag, 3, Flags) of
	false ->
	    do_get_listens(EventFlags, PlayerTask, Listeners);
	#flag{listeners=L} ->
	    do_get_listens(EventFlags, PlayerTask, L ++ Listeners)
    end.

do_update_flags([], _Value, PlayerTask) ->
    PlayerTask;
do_update_flags([Flag|Flags], Value, PlayerTask) ->
    NPlayerTask = operate_flag({update_flag, Flag, Value}, PlayerTask),
    do_update_flags(Flags, Value, NPlayerTask).

do_get_flags([], _PlayerTask, ListenFlags) ->
    ListenFlags;
do_get_flags([Listen|Listens], PlayerTask, ListenFlags) ->
    Flag = 
	case Listen of
	    {_, _Event, F, _Count} ->
		F;
	    {_, _Event, F, _Count, _Expect}->
		F

	end,
    Flags = PlayerTask#player_task.flags,
    ListenFlag = lists:keyfind(Flag, 3, Flags),
    NListenFlags = 
	case lists:member(ListenFlag, ListenFlags) of
	    true ->
		ListenFlags;
	    false ->
		[ListenFlag|ListenFlags]
	end,
    do_get_flags(Listens, PlayerTask, NListenFlags).

do_get_auto_unlisten_flag([], UnListenFlags) ->
    UnListenFlags;
do_get_auto_unlisten_flag([Listen|Listens], UnListenFlags) ->
    UnListenFlag = 
	case Listen of	
	    {listen_grow_flag, Event, Flag, _Count} ->
		{unlisten_flag, Event, Flag};
	    {listen_replace_flag, Event, Flag, _Count} ->
		{unlisten_flag, Event, Flag};
	    {listen_not_repeat_flag, Event, Flag, _Count} ->
		{unlisten_flag, Event, Flag};
	    {listen_expect_flag, Event, Flag, _Count, _Expect} ->
		{unlisten_flag, Event, Flag};
	    _ ->
		[]
	end,
    do_get_auto_unlisten_flag(Listens, [UnListenFlag|UnListenFlags]).

%% 监听标记
listen_flag(Type, K, Count, InstId, IsAutoDel, PlayerTask) ->
    listen_flag(Type, K, Count, InstId, IsAutoDel, [], PlayerTask).
listen_flag(Type, K, Count, InstId, IsAutoDel, Expect, PlayerTask) ->
    Flags = PlayerTask#player_task.flags,
    case lists:keyfind(K, 3, Flags) of
	false ->
	    create_flag(Type, K, Count, [InstId], IsAutoDel, Expect, PlayerTask);
	#flag{listeners=Listeners}=Flag ->
	    case lists:member(InstId, Listeners) of
		true ->
		    PlayerTask;
		false ->
		    NListeners = [InstId|Listeners],
		    NFlag = Flag#flag{listeners=NListeners},
		    NFlags = lists:keyreplace(K, 3, Flags, NFlag),
		    PlayerTask#player_task{flags=NFlags}
	    end
    end.

%% 监听事件
listen_event(Event, Flag, PlayerTask) ->
    Events = PlayerTask#player_task.events,
    NEvents = task_event:listen(Event, Flag, Events),
    PlayerTask#player_task{events=NEvents}.

%% 解除监听事件
unlisten_event(Event, Flag, PlayerTask) ->
    Events = PlayerTask#player_task.events,
    NEvents = task_event:unlisten(Event, Flag, Events),
    PlayerTask#player_task{events=NEvents}.  

%% 解除监听标志
unlisten_flag(K, InstId, PlayerTask) ->
    Flags = PlayerTask#player_task.flags,
    NFlags = 
	case lists:keyfind(K, 3, Flags) of
	    false ->
		Flags;
	    #flag{listeners=Listeners}=Flag ->
		NListeners = lists:delete(InstId, Listeners),
		case (NListeners == []) of %% 如果没有了监听者，则删除标志
		    true ->
			lists:keydelete(K, 3, Flags);
		    false ->
			NFlag = Flag#flag{listeners=NListeners},
			lists:keyreplace(K, 3, Flags, NFlag)
		end
	end,
    PlayerTask#player_task{flags=NFlags}.

delete_flag_info(Key, Task) ->
    FlagInfo = Task#task.flag_info,
    case lists:keyfind(Key, #flag.key, FlagInfo) of
	false ->
	    Task;
	_Flag ->
	    NFlagInfo = lists:keydelete(Key, #flag.key, FlagInfo),
	    Task#task{flag_info=NFlagInfo}
    end.

replace_flag(K, V, PlayerTask) ->
    Flags = PlayerTask#player_task.flags,
    NFlags = 
	case lists:keyfind(K, 3, Flags) of
	    false ->
		[];
	    Flag ->
		NFlag = Flag#flag{value=V},
		lists:keyreplace(K, 3, Flags, NFlag)
	end,
    PlayerTask#player_task{flags=NFlags}.

%% 更新标志位
update_flag(K, V, PlayerTask) ->
    Flags = PlayerTask#player_task.flags,
    case lists:keyfind(K, 3, Flags) of
	false ->
	    PlayerTask;
	#flag{type=Type}=Flag when Type == ?ft_grow ->
	    update_grow_flag(K, Flag, Flags, PlayerTask);
	#flag{type=Type}=Flag when Type == ?ft_not_repeat ->
	    update_not_repeat_flag(K, V, Flag, Flags, PlayerTask);
	#flag{type=Type}=Flag when Type == ?ft_replace ->
	    update_replace_flag(K, V, Flag, Flags, PlayerTask);
	#flag{type=Type}=Flag when Type == ?ft_expect ->
	    update_expect_flag(K, V, Flag, Flags, PlayerTask)
    end.

update_grow_flag(K, Flag, Flags, PlayerTask) ->
    #flag{value=Value, listeners=Listeners}=Flag,
    NFlag = Flag#flag{value=Value+1},
    NPlayerTask = update_listener_flag(NFlag, Listeners, PlayerTask),
    NFlags = lists:keyreplace(K, 3, Flags, NFlag),
    NPlayerTask#player_task{flags=NFlags}.

update_not_repeat_flag(K, V, Flag, Flags, PlayerTask) ->
    #flag{value=Value, count=Count, listeners=Listeners}=Flag,
    case lists:member(V, Value) of
	true ->
	    PlayerTask;
	false ->
	    case length(Value) >= Count of
		true ->
		    PlayerTask;
		false ->
		    NValue = [V|Value],
		    NFlag = Flag#flag{value=NValue},
		    NPlayerTask = update_listener_flag(NFlag, Listeners, PlayerTask),
		    NFlags = lists:keyreplace(K, 3, Flags, NFlag),
		    NPlayerTask#player_task{flags=NFlags}
	    end
    end.

update_replace_flag(K, V, Flag, Flags, PlayerTask) ->
    #flag{listeners=Listeners}=Flag,
    NFlag = Flag#flag{value=V},
    NPlayerTask = update_listener_flag(NFlag, Listeners, PlayerTask),
    NFlags = lists:keyreplace(K, 3, Flags, NFlag),
    NPlayerTask#player_task{flags=NFlags}.

update_expect_flag(K, V, Flag, Flags, PlayerTask) ->

    #flag{value=Value, count=Count, listeners=Listeners, expect=Expect}=Flag,
    case (V==Expect) of
	true ->
	    case Value < Count of
		true ->
		    NFlag = Flag#flag{value=Value+1},
		    NPlayerTask = update_listener_flag(NFlag, Listeners, PlayerTask),
		    NFlags = lists:keyreplace(K, 3, Flags, NFlag),
		    NPlayerTask#player_task{flags=NFlags};
		false ->
		    PlayerTask
	    end;
	false ->
	    case lists:member(V, Expect) of
		true ->
		    case Value < Count of
			true ->
			    NFlag = Flag#flag{value=Value+1},
			    NPlayerTask = update_listener_flag(NFlag, Listeners, PlayerTask),
			    NFlags = lists:keyreplace(K, 3, Flags, NFlag),
			    NPlayerTask#player_task{flags=NFlags};
			false ->
			    PlayerTask
		    end;
		false ->
		    PlayerTask
	    end
    end.

update_listener_flag(_Flag, [], PlayerTask) ->
    PlayerTask;
update_listener_flag(Flag, [Listener|Listeners], PlayerTask) ->
    GiveTasks = PlayerTask#player_task.give_tasks,
    GiveTask = lists:keyfind(Listener, 2, GiveTasks),
    Flags = GiveTask#task.flag_info,
    NGiveTask = GiveTask#task{flag_info=lists:keyreplace(Flag#flag.key, 3, Flags, Flag)},
    NGiveTasks = lists:keyreplace(Listener, 2, GiveTasks, NGiveTask),
    NPlayerTask = PlayerTask#player_task{give_tasks=NGiveTasks},
    update_listener_flag(Flag, Listeners, NPlayerTask).

%% 删除标志位
dec_flag(K, PlayerTask) ->
    Flags = PlayerTask#player_task.flags,
    NFlags = lists:keydelete(K, 3, Flags),
    PlayerTask#player_task{flags=NFlags}.

%% 创建标志位
create_flag(Type, K, V, Count, Listener, IsAutoDel, Expect, PlayerTask) ->
    Flags = PlayerTask#player_task.flags,
    NFlags = 
	case lists:keyfind(K, 3, Flags) of
	    false ->
		[new(Type, K, V, Count, Listener, IsAutoDel, Expect)|Flags]
	end,
    PlayerTask#player_task{flags=NFlags}.

create_flag(Type, K, Count, Listener, IsAutoDel, Expect, PlayerTask) when Type == ?ft_replace ->
    create_flag(Type, K, "", Count, Listener, IsAutoDel, Expect, PlayerTask);
create_flag(Type, K, Count, Listener, IsAutoDel, Expect, PlayerTask) when Type == ?ft_grow ->
    create_flag(Type, K, 0, Count, Listener, IsAutoDel, Expect, PlayerTask);
create_flag(Type, K, Count, Listener, IsAutoDel, Expect, PlayerTask) when Type == ?ft_not_repeat ->
    create_flag(Type, K, [], Count, Listener, IsAutoDel, Expect, PlayerTask);
create_flag(Type, K, Count, Listener, IsAutoDel, Expect, PlayerTask) when Type == ?ft_expect ->
    create_flag(Type, K, 0, Count, Listener, IsAutoDel, Expect, PlayerTask).

new(Type, Key, Value, Count, Listeners, IsAutoDel, Expect) ->
    #flag{type=Type, key=Key, value=Value, count=Count, listeners=Listeners, is_auto_del=IsAutoDel, expect=Expect}.

%%%===================================================================
%%% Test case
%%%===================================================================
-ifdef(TEST).
-include_lib("eunit/include/eunit.hrl").

-endif.
