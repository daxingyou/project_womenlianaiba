%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% 每日任务
%%% @end
%%% Created :  9 Apr 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(daily_task).

-include("player_task.hrl").
-include("enum_def.hrl").
-include("common_def.hrl").
-include("tplt_def.hrl").
-include("packet_def.hrl").
-include("sys_msg.hrl").
-include("resource.hrl").
-include("records.hrl").

-export([remove/1, remove/2, give/1, give/4, give/5, get_replace_diamond/1,
	 get_change_task/3, can_reward/2, can_replace/2, send_daily_tasks_to_client/2, do_reward/5, do_after_reward/3, get_daily_tasks_by_filter_level/2, do_get_rand_task/3]).
-export([exclude_complete_daily_tasks/2]).

%% API
-define(Type, ?tt_daily).
-define(Single, 1).
-define(Double, 2).
-define(All, 3).
-define(TaskCount, 5).


%%%===================================================================
%%% API
%%%===================================================================
%% 清空任务
remove(Account) ->
    F = fun() ->
		PlayerTask = player_task:get_player_task(Account),
		GiveDailyTasks = get_give_daily_tasks(PlayerTask),
		NPlayerTask = exclude_daily_task(PlayerTask),
		db:write(NPlayerTask),
		GiveDailyTasks
	end,
    case db:transaction(F) of
	GiveDailyTasks ->
	    InstIds = lists:foldl(fun(GiveTask, Ids) ->
					  Id = GiveTask#task.inst_id,
					  [Id | Ids]
				  end, [], GiveDailyTasks),
	    gen_task:notify_dec_task(Account, InstIds)
    end.

remove(Account, PlayerTask) ->
    F = fun() ->
		GiveDailyTasks = get_give_daily_tasks(PlayerTask),
		NPlayerTask = exclude_daily_task(PlayerTask),
		{GiveDailyTasks, NPlayerTask}
	end,
    case db:transaction(F) of
	{GiveDailyTasks, NPlayerTask} ->
	    InstIds = lists:foldl(fun(GiveTask, Ids) ->
					  Id = GiveTask#task.inst_id,
					  [Id | Ids]
				  end, [], GiveDailyTasks),
	    gen_task:notify_dec_task(Account, InstIds),
	    NPlayerTask
    end.

send_daily_tasks_to_client(Account, PlayerTask) ->
    GiveDailyTasks = get_give_daily_tasks(PlayerTask),
    gen_task:notify_add_task(Account, GiveDailyTasks).

%% 初始化玩家的每日任务
give(Account) when is_atom(Account) ->
    F = build_give_trans(Account),
    do_give_trans(Account, F);
give(PlayerData) ->
    Account = player_data:get_account(PlayerData),
    give(Account).

give(Account, PlayerBasicData, HouseData, PlayerTask) ->
    F = fun() ->
		case can_give(PlayerTask) of
		    true ->
			do_give(Account, PlayerBasicData, HouseData, PlayerTask);
		    false ->
			{false, PlayerTask}
		end
	end,
    case db:transaction(F) of
	{true, Tasks, NPlayerBasicData, NHouseData, NPlayerTask} ->
	    gen_task:notify_add_task(Account, Tasks),
	    {NPlayerBasicData, NHouseData, NPlayerTask};
	{false, NPlayerTask} ->
	    GiveDailyTasks = get_give_daily_tasks(NPlayerTask),
	    gen_task:notify_add_task(Account, GiveDailyTasks),
	    {PlayerBasicData, HouseData, NPlayerTask};
	Reason ->
	    base_task:notify(Account, Reason),
	    {PlayerBasicData, HouseData, PlayerTask}
    end.

give(Account, TaskId, PlayerBasicData, HouseData, PlayerTask) ->
    F = fun() ->
		TaskTplt = tplt:get_data(daily_task_tplt, TaskId),
		Task = new(TaskTplt),
		case base_task:give(Account, Task, PlayerBasicData, HouseData, PlayerTask) of
		    {_Msgs, NTask, NPlayerBasicData, NHouseData, NPlayerTask} ->
			{true, NTask, NPlayerBasicData, NHouseData, NPlayerTask};
		    Reason ->
			Reason
		end
	end,
    case db:transaction(F) of
	{true, Task, NPlayerBasicData, NHouseData, NPlayerTask} ->
	    gen_task:notify_add_task(Account, [Task]),
	    {NPlayerBasicData, NHouseData, NPlayerTask}
    end.

can_replace(Task, HouseData) ->
    ReplaceDiamond = get_replace_diamond(Task),
    Diamond = house_diamond:get_lover_diamond(HouseData),
    case Diamond >= ReplaceDiamond of
	true ->
	    true;
	false ->
	    throw({false, s2c, ?unlock_furniture_diamond_error})
    end.   

get_replace_diamond(Task) ->
    TaskId = Task#task.task_id,
    AllDailyTaskTplt = tplt:get_all_data(daily_task_tplt),
    TaskTplt = lists:keyfind(TaskId, #daily_task_tplt.task_id, AllDailyTaskTplt),
    TaskTplt#daily_task_tplt.diamond.

can_reward(InstId, PlayerTask) ->
    GiveTasks = PlayerTask#player_task.give_tasks,
    Task = lists:keyfind(InstId, 2, GiveTasks),
    try
	base_task:validate_isnt_reward(Task)
    catch
	throw:Error ->
	    Error
    end.

%% 执行奖励
do_reward(Account, InstId, PlayerBasicData, HouseData, PlayerTask) ->
    GiveTasks = PlayerTask#player_task.give_tasks,
    GiveTask = lists:keyfind(InstId, 2, GiveTasks),
    TaskId = GiveTask#task.task_id,
    case base_task:reward(Account, InstId, PlayerBasicData, HouseData, PlayerTask) of
	{Msgs, Task, NPlayerBasicData, NHouseData, NPlayerTask} ->
	    add_complete_daily_task(Account, TaskId),
	    db:write(NPlayerBasicData),
	    db:write(NHouseData),
	    db:write(NPlayerTask),
	    {true, Msgs, Task, NPlayerBasicData, NHouseData};
	Reason ->
	    Reason
    end.

do_after_reward(Account, F, PlayerData) ->
    case db:transaction(F) of
	{true, Msgs, Task, PlayerBasicData, HouseData} ->
	    Lover = player_data:get_lover(PlayerData),
	    house_lover_package:send_msgs(Msgs, Account, Lover),
	    gen_task:send_add_item_message(Account, Task#task.task_id),
	    house_diamond:notify(HouseData),
	    house_level_exp:notify(Account, HouseData, PlayerBasicData),
	    party_coin:send2client(Account),
	    case player:is_single(PlayerData) of
		true ->
		    ok;
		false ->
		    [LoverPlayerBasicData] = db:dirty_read(player_basic_data, Lover),
		    house_level_exp:notify(Lover, HouseData, LoverPlayerBasicData)
	    end,
	    gen_task:notify_reward(Account, Task),
	    router:cast(Account, on_daily_task_reward, Task#task.task_id);
	Reason ->
	    base_task:notify(Account, Reason)
    end.

get_change_task(Account, HouseData, PlayerTask) ->
    DailyTaskTplt = get_rand_task(Account, HouseData, PlayerTask),
    case DailyTaskTplt == [] of
	true ->
	    [];
	false ->
	    new(DailyTaskTplt)
    end.
%%%===================================================================
%%% Internal functions
%%%===================================================================

%% 删除任务
delete_tasks([], PlayerTask) ->
    PlayerTask;
delete_tasks([Task|Tasks], PlayerTask) ->
    InstId = Task#task.inst_id,
    NPlayerTask = base_task:delete(InstId, PlayerTask),
    delete_tasks(Tasks, NPlayerTask).

 

new(DailyTaskTplt) ->
    #task{inst_id=guid:make(?st_task), id=DailyTaskTplt#daily_task_tplt.id, 
	  task_id=DailyTaskTplt#daily_task_tplt.task_id, type=?tt_daily, 
	  give_date=datetime:localtime(), complete_date=#stime{}, reward_date=#stime{}, flag_info=[]}.

%% 接任务的事务
build_give_trans(Account) ->
    fun() ->
	    PlayerTask = player_task:get_player_task(Account),
	    [PlayerBasicData] = db:read(player_basic_data, Account),
	    HouseId = player_basic_data:get_house_id(PlayerBasicData),
	    [HouseData] = db:read(house_data, HouseId),
	    case can_give(PlayerTask) of
		true ->
		    do_give(Account, PlayerBasicData, HouseData, PlayerTask);
		false ->
		    {false, PlayerTask}
	    end
    end.

%% 执行接任务的事务
do_give_trans(Account, F) ->
    case db:transaction(F) of
	{true, Tasks, _NPlayerBasicData, _NHouseData, _PlayerTask} ->
	    gen_task:notify_add_task(Account, Tasks);
	{false, PlayerTask} ->
	    GiveDailyTasks = get_give_daily_tasks(PlayerTask),
	    gen_task:notify_add_task(Account, GiveDailyTasks);
	Reason ->
	    base_task:notify(Account, Reason)
    end.

%% 判断是否可以接受每日任务
can_give(PlayerTask) ->
    GiveDailyTasks = get_give_daily_tasks(PlayerTask),
    case GiveDailyTasks of %% 如果还没有接过每日任务
    	[] ->
    	    true;
    	_ ->
    	    GiveDailyTask = lists:last(GiveDailyTasks),
    	    GiveDate = GiveDailyTask#task.give_date,
    	    Now = datetime:localtime(),
    	    case datetime:is_equal(GiveDate, Now) of %% 如果日期不一样则可以接
    		true ->
    		    false;
    		false ->
    		    true
    	    end
    end.

%% 执行获取任务
do_give(Account, PlayerBasicData, HouseData, PlayerTask) ->
    NPlayerTask = exclude_daily_task(PlayerTask),
    RandTasksTplt = get_rand_task(Account, HouseData, ?TaskCount),
    case do_give_1(Account, RandTasksTplt, [], PlayerBasicData, HouseData, NPlayerTask) of
	{Tasks, NPlayerBasicData, NHouseData, NNPlayerTask} ->
	    remove_complete_daily_task(Account),
	    db:write(NPlayerBasicData),
	    db:write(NHouseData),
	    db:write(NNPlayerTask),
	    {true, Tasks, NPlayerBasicData, NHouseData, NNPlayerTask};
	Reason ->
	    Reason
    end.

%% 接受任务
do_give_1(_Account, [], Tasks, PlayerBasicData, HouseData, PlayerTask) ->
    {Tasks, PlayerBasicData, HouseData, PlayerTask};
do_give_1(Account, [TaskTplt|RandTasksTplt], Tasks, PlayerBasicData, HouseData, PlayerTask) ->
    Task = new(TaskTplt),
    case base_task:give(Account, Task, PlayerBasicData, HouseData, PlayerTask) of
	{_Msgs, GiveTask, NPlayerBasicData, NHouseData, NPlayerTask} ->
	    do_give_1(Account, RandTasksTplt, [GiveTask|Tasks], NPlayerBasicData, NHouseData, NPlayerTask);
	Reason ->
	    Reason
    end.

%% 排除每日任务
exclude_daily_task(PlayerTask) ->
    OtherTasks = get_give_other_tasks(PlayerTask),
    GiveDailyTasks = get_give_daily_tasks(PlayerTask),
    NPlayerTask = delete_tasks(GiveDailyTasks, PlayerTask),
    NPlayerTask#player_task{give_tasks=OtherTasks}.

%% 获取已经接的每日任务
get_give_daily_tasks(PlayerTask) ->
    GiveTasks = PlayerTask#player_task.give_tasks,
    {GiveDailyTasks, _OtherTasks} = lists:partition(fun(#task{type=Type}) -> Type == ?tt_daily end, GiveTasks),
    GiveDailyTasks.

%% 获取其他已经接收的任务（排除每日任务）
get_give_other_tasks(PlayerTask) ->
    GiveTasks = PlayerTask#player_task.give_tasks,
    {_GiveDailyTasks, OtherTasks} = lists:partition(fun(#task{type=Type}) -> Type == ?Type end, GiveTasks),
    OtherTasks.

%% 获取每日任务列表，需要排除已经有的每日任务
exclude_give_daily_tasks(GiveDailyTasks, DailyTasksTplt) ->
    {_, TaskList} = lists:partition(fun(#daily_task_tplt{task_id=TaskId}) -> 
					    lists:keymember(TaskId, 4, GiveDailyTasks) end, DailyTasksTplt),
    TaskList.

%% 获取每日任务列表，排除已经完成的每日任务
exclude_complete_daily_tasks(CompleteTasks, DailyTasksTplt) ->
    {_, TaskList} = lists:partition(fun(#daily_task_tplt{task_id=TaskId}) -> 
					    lists:member(TaskId, CompleteTasks) end, DailyTasksTplt),
    TaskList.

%% 获取随机任务(多个任务)
get_rand_task(Account, HouseData, Count) when is_integer(Count) ->
    Level = house_level_exp:get_level(HouseData),
    DailyTaskTplt = get_daily_tasks_by_player_status(Account, HouseData),
    NDailyTaskTplt = get_daily_tasks_by_filter_level(Level, DailyTaskTplt),
    do_get_rand_task(NDailyTaskTplt, Count, []);
get_rand_task(Account, HouseData, PlayerTask) ->
    Level = house_level_exp:get_level(HouseData),
    GiveDailyTasks = get_give_daily_tasks(PlayerTask),
    DailyTaskTplt = get_daily_tasks_by_player_status(Account, HouseData),
    NDailyTaskTplt = exclude_give_daily_tasks(GiveDailyTasks, DailyTaskTplt),
    NNDailyTaskTplt = get_daily_tasks_by_filter_level(Level, NDailyTaskTplt),
    CompleteTasks = get_complete_daily_task(Account),
    NNNDailyTaskTplt = exclude_complete_daily_tasks(CompleteTasks, NNDailyTaskTplt),
    case NNNDailyTaskTplt == [] of
	true ->
	    [];
	false ->
	    [Task] = do_get_rand_task(NNNDailyTaskTplt, 1, []),
	    Task
    end.

do_get_rand_task(_DailyTaskTplt, 0, RandTasks) ->
    RandTasks;
do_get_rand_task(DailyTaskTplt, Count, RandTasks) ->
    DailyTask = rate:hit([{Tplt, Tplt#daily_task_tplt.rate} || Tplt <- DailyTaskTplt]),
    NDailyTaskTplt = lists:delete(DailyTask, DailyTaskTplt),
    do_get_rand_task(NDailyTaskTplt, Count-1, [DailyTask|RandTasks]).

%% 获取每日任务
%% （如果是单身玩家则获取单身的数据，如果是配对过的则获取配对过的数据）
get_daily_tasks_by_player_status(Account, HouseData) ->
    Lover = house:get_lover(Account, HouseData),
    DailyTaskTplt = tplt:get_all_data(daily_task_tplt),
    {SingleDailyTaskTplt, _} = 
	lists:partition(fun(#daily_task_tplt{use_type=UseType}) -> UseType == ?Single end, DailyTaskTplt),
    {DoubleDailyTaskTplt, _} = 
	lists:partition(fun(#daily_task_tplt{use_type=UseType}) -> UseType == ?Double end, DailyTaskTplt),
    {SingleAndDoubleDailyTaskTplt, _} = 
	lists:partition(fun(#daily_task_tplt{use_type=UseType}) -> UseType == ?All end, DailyTaskTplt),
    case Lover == '' of
	true ->
	    SingleDailyTaskTplt ++ SingleAndDoubleDailyTaskTplt;
	false ->
	    DoubleDailyTaskTplt ++ SingleAndDoubleDailyTaskTplt
    end.

%% 根据等级过滤每日任务
get_daily_tasks_by_filter_level(Level, DailyTaskTplt) ->
    Levels = get_levels(DailyTaskTplt),
    FilterLevel = get_filter_level(Level, Levels),
    {FilterDailyTaskTplt, _} = lists:partition(fun(#daily_task_tplt{level=L}) -> L == FilterLevel end, DailyTaskTplt),
    FilterDailyTaskTplt.

%% 找出最接近的等级
get_filter_level(Level, [L | Levels]) ->
    case Level =< L of
	true ->
	    L;
	false ->
	    get_filter_level(Level, Levels)
    end.

%% 获取模板表中的所有等级
get_levels(DailyTaskTplt) ->
    Levels = lists:foldl(fun(#daily_task_tplt{level=Level}, Levels) ->
				 [Level | Levels]
		end, [], DailyTaskTplt),
    lists:usort(Levels).

get_daily_task(Account) ->
    case db:dirty_read(daily_task, Account) of
	[] ->
	    #daily_task{account=Account, complete_tasks=[]};
	[DailyTask] ->
	    DailyTask
    end.

remove_complete_daily_task(Account) ->
    DailyTask = get_daily_task(Account),
    NDailyTask = DailyTask#daily_task{complete_tasks=[]},
    db:dirty_write(NDailyTask).

add_complete_daily_task(Account, TaskId) ->
    DailyTask = get_daily_task(Account),
    CompleteTasks = DailyTask#daily_task.complete_tasks,
    NCompleteTasks = [TaskId | CompleteTasks],
    NDailyTask = DailyTask#daily_task{complete_tasks=NCompleteTasks},
    db:dirty_write(NDailyTask).

get_complete_daily_task(Account) ->
    DailyTask = get_daily_task(Account),
    DailyTask#daily_task.complete_tasks.

%%%===================================================================
%%% Test Case
%%%===================================================================
-ifdef(TEST).
-include_lib("eunit/include/eunit.hrl").

can_give_test() ->
    PlayerTask = {player_task,ac,[{task,72127685925208068,9,9,1,{stime,2012,4,11,10,25,3},{stime,0,0,0,0,0,0}},{task,72127685925208066,4,4,1,{stime,2012,4,11,10,24,30},{stime,0,0,0,0,0,0}},{task,72127676508995665,5,5,1,{stime,2012,4,11,9,22,59},{stime,0,0,0,0,0,0}},{task,72127676508995663,3,3,1,{stime,2012,4,11,9,22,59},{stime,0,0,0,0,0,0}},{task,72127676508995661,8,8,1,{stime,2012,4,11,9,22,59},{stime,0,0,0,0,0,0}}], []},
    ?assertEqual(false, can_give(PlayerTask)),
    ?assertEqual(true, can_give({player_task, ac, [], []})),
    ?assertEqual(true, can_give({player_task, ac, [{task,72127685925208068,9,9,1,{stime,2012,4,10,10,25,3},{stime,0,0,0,0,0,0}}], []})).
-endif.
