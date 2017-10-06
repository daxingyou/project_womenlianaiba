%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% 
%%% @end
%%% Created : 11 Apr 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(gen_task).

-include("player_task.hrl").
-include("enum_def.hrl").
-include("common_def.hrl").
-include("tplt_def.hrl").
-include("packet_def.hrl").
-include("sys_msg.hrl").
-include("resource.hrl").
-include("records.hrl").

-define(ReplaceDiamond, 5).

%% API
-export([notify_reward/2, notify_dec_task/2, notify_add_task/2]).

-export([get_flag_info/2, task_is_exist/2]).
-export([complete/2, immediate_complete/3, change/3, reward/4, send_add_item_message/2]).

%%%===================================================================
%%% API
%%%===================================================================
%% 完成玩家的每日任务
complete(Account, InstId) ->
    F = build_complete_trans(Account, InstId),
    do_complete_trans(Account, F).

%% 立即完成任务，需要耗费Q点
immediate_complete(Account, InstId, PlayerData) ->
    [PlayerTask] = db:dirty_read(player_task, Account),
    case can_immediate_complete(InstId, PlayerTask) of
	true ->
	    do_immediate_complete(Account, InstId, PlayerTask, PlayerData);
	Reason ->
	    Reason
    end.

%% 获取奖励
reward(Account, InstId, Type, PlayerData) ->
    Mod = get_mod(Type),
    F = build_reward_trans(Account, InstId, Mod),
    Mod:do_after_reward(Account, F, PlayerData).

%% 更改任务
change(Account, InstId, Type) ->
    Mod = get_mod(Type),
    F = build_change_trans(Account, InstId, Mod),
    do_change_trans(Account, F).

task_is_exist(InstId, PlayerTask) ->
    GiveTasks = PlayerTask#player_task.give_tasks,
    case lists:keyfind(InstId, 2, GiveTasks) of
	false ->
	    throw({false, task_cant_exist});
	_ ->
	    true
    end.

%% 通知领取奖励
notify_reward(Account, Task) ->
    NTask = format_task(Task),
    net_helper:send2client(Account, #notify_reward_task{info=NTask}).

%% 通知删除任务
notify_dec_task(_Account, []) ->
    ok;
notify_dec_task(Account, InstIds) ->
    net_helper:send2client(Account, #notify_dec_task{inst_ids=InstIds}).

%% 通知增加任务
notify_add_task(_Account, []) ->
    ok;
notify_add_task(Account, Tasks) ->
    NTasks = remove_hide_task(Tasks),
    NNTasks = [format_task(Task) || Task <- NTasks],
    net_helper:send2client(Account, #notify_add_task{tasks=NNTasks}).

send_add_item_message(Account, TaskId) ->
    TaskTplt = tplt:get_data(player_task_tplt, TaskId),
    RewardItems = TaskTplt#player_task_tplt.reward_items,
    RewardItemsCount = TaskTplt#player_task_tplt.reward_items_count,
    send_add_item_message(Account, RewardItems, RewardItemsCount).
send_add_item_message(_Account, [], []) ->
    ok;
send_add_item_message(Account, [0|RewardItems], [_RewardItemCount|RewardItemsCount]) ->
    send_add_item_message(Account, RewardItems, RewardItemsCount);
send_add_item_message(Account, [RewardItem|RewardItems], [RewardItemCount|RewardItemsCount]) ->
    ItemTplt = tplt:get_data(item_tplt, RewardItem),
    Name = ItemTplt#item_tplt.name,
    sys_msg:send(Account, ?msg_task_for_add_item, [Name, RewardItemCount]),
    send_add_item_message(Account, RewardItems, RewardItemsCount).

%%%===================================================================
%%% Internal functions
%%%===================================================================
remove_hide_task(Tasks) ->
    lists:foldl(fun(Task, NTasks) ->
			TaskId = Task#task.task_id,
			TaskTplt = tplt:get_data(player_task_tplt, TaskId),
			case TaskTplt#player_task_tplt.is_show == 0 of
			    true ->
				NTasks;
			    false ->
				[Task | NTasks]
			end
		end, [], Tasks).

build_reward_trans(Account, InstId, Mod) ->
    fun() ->
	    [PlayerTask] = db:read(player_task, Account),
	    [PlayerBasicData] = db:read(player_basic_data, Account),
	    HouseId = player_basic_data:get_house_id(PlayerBasicData),
	    [HouseData] = db:read(house_data, HouseId),
	    case Mod:can_reward(InstId, PlayerTask) of
		true ->
		    Mod:do_reward(Account, InstId, PlayerBasicData, HouseData, PlayerTask);
		Reason ->
		    Reason
	    end
    end.

can_replace(InstId, Task, Mod, HouseData, PlayerTask) ->
    try
	validate_task(Task),
	task_is_exist(InstId, PlayerTask),

	Mod:can_replace(Task, HouseData)
	%%validate_diamond(HouseData)
    catch
	throw:Error ->
	    Error
    end.

validate_task(Task) ->
    case Task == [] of
	true ->
	    throw({false, s2c, ?err_task_is_empty});
	false ->
	    true
    end.

%% validate_diamond(HouseData) ->
%%     Diamond = house_diamond:get_lover_diamond(HouseData),
%%     case Diamond >= ?ReplaceDiamond of
%% 	true ->
%% 	    true;
%% 	false ->
%% 	    throw({false, s2c, ?err_hp_not_enough})
%%     end.  


build_change_trans(Account, InstId, Mod) ->
    fun() ->
	    [PlayerTask] = db:read(player_task, Account),
	    [PlayerBasicData] = db:read(player_basic_data, Account),
	    HouseId = player_basic_data:get_house_id(PlayerBasicData),
	    [HouseData] = db:read(house_data, HouseId),
	    Task = Mod:get_change_task(Account, HouseData, PlayerTask),
	    case can_replace(InstId, Task, Mod, HouseData, PlayerTask) of
		true ->
		    ReplaceDiamond = Mod:get_replace_diamond(Task),
		    do_replace(Account, InstId, Task, ReplaceDiamond, PlayerBasicData, HouseData, PlayerTask);
		Reason ->
		    Reason
	    end
    end.

do_change_trans(Account, F) ->
    case db:transaction(F) of
	{true, InstId, Task, PlayerBasicData, HouseData} ->
	    player_hp:send(Account, PlayerBasicData, HouseData),
	    house_diamond:notify(HouseData),
	    notify_change_task(Account, InstId, Task);
	Reason ->
	    base_task:notify(Account, Reason)
    end.

%% 执行替换
do_replace(Account, InstId, Task, ReplaceDiamond, PlayerBasicData, HouseData, PlayerTask) ->
    case base_task:replace(Account, InstId, Task, PlayerBasicData, HouseData, PlayerTask) of
	{NTask, NPlayerBasicData, NHouseData, NNPlayerTask} ->
	    NNHouseData = house_diamond:dec_diamond(ReplaceDiamond, NHouseData),
	    db:write(NPlayerBasicData),
	    db:write(NNHouseData),
	    db:write(NNPlayerTask),
	    {true, InstId, NTask, NPlayerBasicData, NNHouseData};
	Reason ->
	    Reason
    end.

build_immediate_complete_trans(Account, InstId, PlayerTask) ->
    fun() ->
	    [PlayerBasicData] = db:read(player_basic_data, Account),
	    HouseId = player_basic_data:get_house_id(PlayerBasicData),
	    [HouseData] = db:read(house_data, HouseId),
	    case base_task:immediate_complete(Account, InstId, PlayerBasicData, HouseData, PlayerTask) of
		{Task, NPlayerBasicData, NHouseData, NPlayerTask} ->
		    db:write(NPlayerBasicData), 
		    db:write(NHouseData), 
		    db:write(NPlayerTask),
		    {true, Task, NPlayerTask};
		Reason ->
		    Reason
	    end
    end.

can_immediate_complete(InstId, PlayerTask) ->
    GiveTasks = PlayerTask#player_task.give_tasks,
    Task = lists:keyfind(InstId, 2, GiveTasks),
    try
	task_is_exist(InstId, PlayerTask),
	base_task:validate_isnt_complete(Task)
    catch
	throw:Error ->
	    Error
    end.

do_immediate_complete(Account, InstId, PlayerTask, PlayerData) ->
    GiveTasks = PlayerTask#player_task.give_tasks,
    Task = lists:keyfind(InstId, 2, GiveTasks),
    TaskId = Task#task.task_id,
    PlayerTaskTplt = tplt:get_data(player_task_tplt, TaskId),
    LoginType = player_data:get_login_type(PlayerData),

    QCoin = util:get_price(PlayerTaskTplt#player_task_tplt.q_coin, LoginType),
    ShipCallback = 
	fun(#order{status=Status}=_Order)-> 			   
		case (Status =:= ?order_payed) of
		    true ->
			F = build_immediate_complete_trans(Account, InstId, PlayerTask),
			case db:transaction(F) of
			    {true, NTask, _PlayerTask} ->
				notify_complete_task(Account, NTask),
				?pay_shipped;
			    Reason ->
				base_task:notify(Account, Reason),
				?pay_error
			end;
		    _ ->
			?pay_error
		end				       
	end,
    player_love_coin:pay([{TaskId, 1, QCoin}], ShipCallback, ?order_goods_meta_task, PlayerData).

build_complete_trans(Account, InstId) ->
    fun() ->
	    [PlayerTask] = db:read(player_task, Account),
	    [PlayerBasicData] = db:read(player_basic_data, Account),
	    HouseId = player_basic_data:get_house_id(PlayerBasicData),
	    [HouseData] = db:read(house_data, HouseId),
	    do_complete(Account, InstId, PlayerBasicData, HouseData, PlayerTask)
    end.    

do_complete_trans(Account, F) ->
    case db:transaction(F) of
	{true, Task, _PlayerTask} ->
	    notify_complete_task(Account, Task);
	Reason ->
	    base_task:notify(Account, Reason)
    end.

%% 执行完成任务
do_complete(Account, InstId, PlayerBasicData, HouseData, PlayerTask) ->
    case base_task:complete(Account, InstId, PlayerBasicData, HouseData, PlayerTask) of
	{Task, NPlayerBasicData, NHouseData, NPlayerTask} ->
	    db:write(NPlayerBasicData), 
	    db:write(NHouseData), 
	    db:write(NPlayerTask),
	    {true, Task, NPlayerTask};
	Reason ->
	    Reason
    end.

format_task(GiveTask) when is_record(GiveTask, task) ->
    #task{inst_id=InstId, task_id=TaskId, type=Type, 
	  give_date=GiveDate, complete_date=CompleteDate, 
	  reward_date=RewardDate, flag_info=FlagInfo} = GiveTask,
    #task_info{inst_id=InstId, task_id=TaskId, type=Type, 
	       give_date=GiveDate, complete_date=CompleteDate,
	       reward_date=RewardDate, info=do_get_flag_info(FlagInfo, [])}.
    
get_flag_info(TaskId, PlayerTask) ->
    Listens = base_task:get_listen_event(TaskId),
    Flags = task_flag:get_flags(Listens, PlayerTask),
    do_get_flag_info(Flags, []).

do_get_flag_info([], FlagInfos) ->
    FlagInfos;
do_get_flag_info([Flag|Flags], FlagInfos) ->
    case Flag of
	false ->
	    do_get_flag_info(Flags, FlagInfos); 
	_ ->
	    Key = task_flag:get_flag_key(Flag),
	    Value = task_flag:get_flag_value_count(Flag),
	    Count = task_flag:get_flag_count(Flag),
	    FlagInfo = #flag_info{key=Key, value=Value, count=Count},
	    do_get_flag_info(Flags, [FlagInfo|FlagInfos])
    end.
 

get_mod(?tt_daily) ->
    daily_task;
get_mod(?tt_chain) ->
    chain_task.

%% 通知更换任务
notify_change_task(Account, InstId, Task) ->
    NTask = format_task(Task),
    net_helper:send2client(Account, #notify_change_task{inst_id=InstId, info=NTask}).

%% 通知完成任务
notify_complete_task(Account, Task) ->
    NTask = format_task(Task),
    net_helper:send2client(Account, #notify_complete_task{info=NTask}).
