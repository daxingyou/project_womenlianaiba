%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% 链式任务
%%% @end
%%% Created :  9 Apr 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(chain_task).

-include("player_task.hrl").
-include("enum_def.hrl").
-include("common_def.hrl").
-include("tplt_def.hrl").
-include("packet_def.hrl").
-include("sys_msg.hrl").
-include("resource.hrl").
-include("records.hrl").
%% API
-export([give/2, send_chain_tasks_to_client/2, 
	 can_reward/2, do_reward/5,
	 do_after_reward/3, is_complete/2, 
	 base_task_complete/3, is_give/2,
	 get_chain_tasks/1, re_listen_event/1]).

%%%===================================================================
%%% API
%%%===================================================================
give(Account, Ids) when is_list(Ids) ->
    F = build_give_trans(Account, Ids),
    do_give_trans(Account, F);
give(Account, Id) when is_integer(Id) ->
    give(Account, [Id]).

re_listen_event(PlayerTask) when is_record(PlayerTask, player_task) ->
    ChainTasks = get_chain_tasks(PlayerTask),
    NPlayerTask = re_listen_event(ChainTasks, PlayerTask),
    db:dirty_write(NPlayerTask),
    NPlayerTask.
re_listen_event([], PlayerTask) ->
    PlayerTask;
re_listen_event([#task{inst_id=InstId, task_id=TaskId, complete_date=CompleteDate}=Task|ChainTasks], PlayerTask) ->
    case datetime:is_empty(CompleteDate) of
	true ->
	    TaskMod = base_task:get_mod(TaskId),
	    ListenEvents = TaskMod:listen_event(),
	    EventNames = [task_event:get_event_name(ListenEvent) || ListenEvent <- ListenEvents],
	    Listens = task_flag:get_listens(EventNames, PlayerTask),
	    NNPlayerTask = 
		case lists:member(InstId, Listens) of
		    true ->
			PlayerTask;
		    false ->
			NPlayerTask = operate_flag(ListenEvents, InstId, PlayerTask),
			NTask = Task#task{flag_info=task_flag:get_flags(ListenEvents, NPlayerTask)},
			GiveTasks = NPlayerTask#player_task.give_tasks,
			NGiveTasks = lists:keyreplace(InstId, #task.inst_id, GiveTasks, NTask),
			NPlayerTask#player_task{give_tasks=NGiveTasks}
		end,
	    re_listen_event(ChainTasks, NNPlayerTask);
	false ->
	    re_listen_event(ChainTasks, PlayerTask)
    end.

operate_flag([], _InstId, PlayerTask) ->
    PlayerTask;
operate_flag([Event | ListenEvents], InstId, PlayerTask) ->
    NPlayerTask = task_flag:operate_flag(Event, InstId, PlayerTask),
    operate_flag(ListenEvents, InstId, NPlayerTask).
    

send_chain_tasks_to_client(Account, PlayerTask) ->
    ChainTasks = get_chain_tasks(PlayerTask),
    gen_task:notify_add_task(Account, ChainTasks).

can_reward(InstId, PlayerTask) ->
    GiveTasks = PlayerTask#player_task.give_tasks,
    Task = lists:keyfind(InstId, 2, GiveTasks),
    Task /= false.

do_reward(Account, InstId, PlayerBasicData, HouseData, PlayerTask) ->
    case base_task:reward(Account, InstId, PlayerBasicData, HouseData, PlayerTask) of
	{Msgs, RewardTask, NPlayerBasicData, NHouseData, NPlayerTask} ->
	    CompleteTaskIds = [RewardTask#task.task_id | RewardTask#task.complete_task_ids],
	    TaskIds = get_task_ids(RewardTask#task.id) -- lists:reverse(CompleteTaskIds),
	    Id = RewardTask#task.id,
	    {NNPlayerBasicData, NNHouseData, NNPlayerTask, GiveTasks, Msgs1} = 
	    case TaskIds == [] of
		true ->
		    NextChain = get_next_chain_task(Id),
		    {PlayerBasicData1, HouseData1, PlayerTask1, Tasks, NMsgs} = 
		    do_give(Account, NextChain, NPlayerBasicData, NHouseData, NPlayerTask, [], []),
		    CompleteChainTasks = PlayerTask1#player_task.complete_chain_tasks,
		    PlayerTask2 = PlayerTask1#player_task{complete_chain_tasks=[Id|CompleteChainTasks]},
		    {PlayerBasicData1, HouseData1, PlayerTask2, Tasks, NMsgs};
		false ->
		    [TaskId|_NTaskIds] = TaskIds,
		    Task = #task{inst_id=guid:make(?st_task), id=Id, task_id=TaskId, type=?tt_chain, 
				 give_date=datetime:localtime(), complete_date=#stime{}, 
				 reward_date=#stime{}, flag_info=[], complete_task_ids=CompleteTaskIds},
		    {NMsgs, Task1, PlayerBasicData1, HouseData1, PlayerTask1} = 
		    base_task:give(Account, Task, NPlayerBasicData, NHouseData, NPlayerTask),
		    {PlayerBasicData1, HouseData1, PlayerTask1, [Task1], NMsgs}
	    end,
	    NNNPlayerTask = base_task:delete(RewardTask#task.inst_id, NNPlayerTask),
	    db:write(NNPlayerBasicData),
	    db:write(NNHouseData),
	    db:write(NNNPlayerTask),
	    {true, Msgs ++ Msgs1, RewardTask, GiveTasks, NPlayerBasicData, NHouseData};
	Reason ->
	    Reason
    end.

%% 该链式任务是否完成过
is_complete(Id, PlayerTask) ->
    CompleteChainTasks = PlayerTask#player_task.complete_chain_tasks,
    lists:member(Id, CompleteChainTasks).

base_task_complete(ChainTaskId, TaskId, PlayerTask) ->
    GiveTasks = PlayerTask#player_task.give_tasks,
    ChainTask = lists:keyfind(ChainTaskId, #task.id, GiveTasks),
    case ChainTask of
	false ->
	    false;
	_ ->
	    lists:member(TaskId, ChainTask#task.complete_task_ids)
    end.

%% 该链式任务是否正在进行
is_give(Id, PlayerTask) ->
    GiveTasks = PlayerTask#player_task.give_tasks,
    {ChainTasks, _OtherTasks} = lists:partition(fun(#task{id=Id1, type=Type}) -> 
							(Type == ?tt_chain) and (Id1 == Id) 
						end, GiveTasks),
    ChainTasks /= [].

do_after_reward(Account, F, PlayerData) ->
    case db:transaction(F) of
	{true, Msgs, RewardTask, GiveTasks, PlayerBasicData, HouseData} ->
	    Lover = player_data:get_lover(PlayerData),
	    house_lover_package:send_msgs(Msgs, Account, Lover),
	    gen_task:send_add_item_message(Account, RewardTask#task.task_id),
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
	    gen_task:notify_reward(Account, RewardTask),
	    gen_task:notify_add_task(Account, GiveTasks),
	    gen_task:notify_dec_task(Account, [RewardTask#task.inst_id]),
	    router:cast(Account, on_chain_task_reward, RewardTask#task.task_id);
	Reason ->
	    base_task:notify(Account, Reason)
    end.
%%%===================================================================
%%% Internal functions
%%%===================================================================
get_chain_tasks(PlayerTask) ->
    GiveTasks = PlayerTask#player_task.give_tasks,
    {GiveChainTasks, _OtherTasks} = lists:partition(fun(#task{type=Type}) -> Type == ?tt_chain end, GiveTasks),
    GiveChainTasks.

build_give_trans(Account, Ids) ->
    fun() ->
	    PlayerTask = player_task:get_player_task(Account),
	    [PlayerBasicData] = db:read(player_basic_data, Account),
	    HouseId = player_basic_data:get_house_id(PlayerBasicData),
	    [HouseData] = db:read(house_data, HouseId),
	    case can_give(PlayerTask) of
		true ->
		    {NPlayerBasicData, NHouseData, NPlayerTask, Tasks, Msgs} = 
			do_give(Account, Ids, PlayerBasicData, HouseData, PlayerTask, [], []),
		    db:write(NPlayerBasicData),
		    db:write(NHouseData),
		    db:write(NPlayerTask),
		    {true, Tasks, NHouseData, Msgs};
		false ->
		    {false, PlayerTask}
	    end
    end.

do_give_trans(Account, F) ->
    case db:transaction(F) of
	{true, Tasks, NHouseData, Msgs} ->
	    Lover = house:get_lover(Account, NHouseData),
	    house_lover_package:send_msgs(Msgs, Account, Lover),
	    gen_task:notify_add_task(Account, Tasks);
	Reason ->
	    base_task:notify(Account, Reason)
    end.

can_give(_PlayerTask) ->
    true.

do_give(_Account, [], PlayerBasicData, HouseData, PlayerTask, Tasks, Msgs) ->
    {PlayerBasicData, HouseData, PlayerTask, Tasks, Msgs};
do_give(Account, Id, PlayerBasicData, HouseData, PlayerTask, Tasks, Msgs) when Id == 0 ->
    do_give(Account, [], PlayerBasicData, HouseData, PlayerTask, Tasks, Msgs);
do_give(Account, Id, PlayerBasicData, HouseData, PlayerTask, Tasks, Msgs) when is_integer(Id) ->
    do_give(Account, [Id], PlayerBasicData, HouseData, PlayerTask, Tasks, Msgs);
do_give(Account, [Id|Ids], PlayerBasicData, HouseData, PlayerTask, Tasks, Msgs) ->
    TaskId = get_task_id(Id),
    Task = #task{inst_id=guid:make(?st_task), id=Id, task_id=TaskId, type=?tt_chain, 
		 give_date=datetime:localtime(), complete_date=#stime{}, 
		 reward_date=#stime{}, flag_info=[], complete_task_ids=[]},
    ChainMod = get_chain_mod(Id),
    case code:which(ChainMod) of
	non_existing ->
	    case base_task:give(Account, Task, PlayerBasicData, HouseData, PlayerTask) of
		{Msgs1, NTask, NPlayerBasicData, NHouseData, NPlayerTask} ->
		    do_give(Account, Ids, NPlayerBasicData, NHouseData, NPlayerTask, [NTask|Tasks], Msgs1 ++ Msgs);
		Reason ->
		    Reason
	    end;
	_ ->
	    case ChainMod:can_give({Account, PlayerTask}) of
		true ->
		    case base_task:give(Account, Task, PlayerBasicData, HouseData, PlayerTask) of
			{Msgs1, NTask, NPlayerBasicData, NHouseData, NPlayerTask} ->
			    do_give(Account, Ids, NPlayerBasicData, NHouseData, NPlayerTask, [NTask|Tasks], Msgs1 ++ Msgs);
			Reason ->
			    Reason
		    end;
		false ->
		    do_give(Account, Ids, PlayerBasicData, HouseData, PlayerTask, Tasks, Msgs)
	    end
    end.

get_chain_mod(Id) when is_integer(Id) ->
    list_to_atom("chain_task_" ++ integer_to_list(Id)).

get_task_id(Id) ->
    ChainTaskTplt = tplt:get_data(chain_task_tplt, Id),
    TaskIds = ChainTaskTplt#chain_task_tplt.task_id,
    [TaskId | _NTaskIds] = TaskIds,
    TaskId.

get_task_ids(Id) ->
    ChainTaskTplt = tplt:get_data(chain_task_tplt, Id),
    ChainTaskTplt#chain_task_tplt.task_id.

get_next_chain_task(Id) ->
    ChainTaskTplt = tplt:get_data(chain_task_tplt, Id),
    ChainTaskTplt#chain_task_tplt.next_chain.

