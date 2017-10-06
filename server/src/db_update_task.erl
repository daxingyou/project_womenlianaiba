%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%%
%%% @end
%%% Created : 11 Apr 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(db_update_task).
-include("player_task.hrl").
%% API
-export([update_task/0, update_task_flag/0, clean/0, update_task_20120711/0, update_task_20120925/0]).

%%%===================================================================
%%% API
%%%===================================================================
clean() ->
    mnesia:clear_table(player_task),
    {atomic, ok}.

update_task_flag() ->
    F = fun() ->
		Keys = mnesia:dirty_all_keys(player_task),
		[change_task_flag(Key) || Key <- Keys]
	end,
    mnesia:activity(transaction, F, [], mnesia_frag),
    {atomic, ok}.

update_task() ->
    {atomic, ok}.

update_task_20120711() ->
    F = fun(PlayerTask, PlayerTasks) ->
		GiveTasks = PlayerTask#player_task.give_tasks,
		NGiveTasks = [#task{inst_id=InstId, id=Id, task_id=TaskId, 
				    type=Type, give_date=GiveDate, complete_date=CompleteDate, 
				    reward_date=RewardDate, flag_info=FlagInfo, complete_task_ids=[]} 
			      || {task, InstId, Id, TaskId, Type, GiveDate, CompleteDate, RewardDate, FlagInfo} <- GiveTasks],
		NPlayerTask = PlayerTask#player_task{give_tasks=NGiveTasks},
		[NPlayerTask | PlayerTasks]
	end,
    db:transaction(fun() -> L = mnesia:foldl(F, [], player_task), [mnesia:write(Data)|| Data <- L] end),
    {atomic, ok}.

update_task_20120925() ->
    change_task_10005(player_task, mnesia:dirty_first(player_task)),
    {atomic, ok}.

%%%===================================================================
%%% Internal functions
%%%===================================================================
change_task_10005(Tab, Key) when Key /= '$end_of_table' ->
    case mnesia:dirty_read({Tab, Key}) of
	[]->
	    io:format("Key:~p~n",[Key]);
	[PlayerTask]->
	    GiveTasks = PlayerTask#player_task.give_tasks,
	    case lists:keyfind(10005, #task.task_id, GiveTasks) of
		false ->
		    ok;
		Task ->
		    InstId = Task#task.inst_id,
		    NTask = task_flag:delete_flag_info(on_daily_task_reward_10005, Task),
		    NNTask = task_flag:delete_flag_info(create_checkin_flag_10005, NTask),
		    NGiveTasks = lists:keyreplace(InstId, #task.inst_id, GiveTasks, NNTask),
		    NNGiveTasks = lists:keydelete(11000, #task.task_id, NGiveTasks),
		    NPlayerTask = PlayerTask#player_task{events=[], flags=[], give_tasks=NNGiveTasks},
		    mnesia:dirty_write(NPlayerTask)
	    end;
	_ ->
	    io:format("Key:~p~n",[Key])
    end,
    NextKey = mnesia:dirty_next(Tab, Key),
    change_task_10005(Tab, NextKey);
change_task_10005(_Tab, _Key) ->
    ok.

change_task_flag(Key) ->
    [PlayerTask] = mnesia:read(player_task, Key),
    GiveTasks = PlayerTask#player_task.give_tasks,
    NGiveTasks = lists:foldl(fun(GiveTask, TaskList) -> 
				     {task, InstId, Id, TaskId, Type, GiveDate, CompleteDate, RewardDate} = GiveTask,
				     NGiveTask = {task, InstId, Id, TaskId, Type, GiveDate, CompleteDate, RewardDate, []},
				     [NGiveTask|TaskList]
			     end, [], GiveTasks),
    NPlayerTask = PlayerTask#player_task{give_tasks=NGiveTasks},
    mnesia:write(NPlayerTask).

%% create_task(Key) ->
%%     Task = player_task:init(Key),
%%     mnesia:write(Task).
