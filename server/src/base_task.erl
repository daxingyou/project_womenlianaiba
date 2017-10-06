%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% 任务基础
%%% @end
%%% Created :  9 Apr 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(base_task).

-include("enum_def.hrl").
-include("tplt_def.hrl").
-include("packet_def.hrl").
-include("common_def.hrl").
-include("player_task.hrl").
-include("sys_msg.hrl").
-include("player_data.hrl").
-include("records.hrl").
-include("resource.hrl").

%% API
-export([give/5, delete/2, complete/5, reward/5, immediate_complete/5, replace/6, notify/2, get_listen_event/1]).
-export([validate_isnt_reward/1, validate_isnt_complete/1, get_mod/1]).
-export([can_reward_item/1]).

%%%===================================================================
%%% API
%%%===================================================================
%% 接任务
%% Account: 玩家帐号
%% Id:      对应的任务类型的Id，如该任务是日常任务，此位置则保存日常任务表的Id，如果是链式任务，则保存链式任务的Id
%% Tasks:   [{Id, TaskId, Type}, ...]
give(Account, Task, PlayerBasicData, HouseData, PlayerTask) ->
    build_give(Account, Task, PlayerBasicData, HouseData, PlayerTask).

%% 完成任务
%% Account: 玩家帐号
%% InstId : 任务对应的实例Id
complete(Account, InstId, PlayerBasicData, HouseData, PlayerTask) ->
    build_complete(Account, InstId, PlayerBasicData, HouseData, PlayerTask).

delete(InstId, PlayerTask) ->
    GiveTasks = PlayerTask#player_task.give_tasks,
    GiveTask = lists:keyfind(InstId, 2, GiveTasks),
    TaskId = GiveTask#task.task_id,
    NGiveTasks = lists:keydelete(InstId, 2, GiveTasks),	
    NPlayerTask = PlayerTask#player_task{give_tasks=NGiveTasks},
    Mod = get_mod(TaskId),
    UnListenFlag = task_flag:get_auto_unlisten_flag(Mod:listen_event()),
    operate_flag(UnListenFlag, InstId, NPlayerTask).

%% 领取奖励
%% Account: 玩家帐号
%% InstId:  任务对应的实例Id
reward(Account, InstId, PlayerBasicData, HouseData, PlayerTask) ->
    build_reward(Account, InstId, PlayerBasicData, HouseData, PlayerTask).

%% 立即完成
immediate_complete(Account, InstId, PlayerBasicData, HouseData, PlayerTask) ->
    build_immediate_complete(Account, InstId, PlayerBasicData, HouseData, PlayerTask).

%% 替换任务
%% Account: 玩家帐号
%% InstId:  需要跟换的任务的实例Id
%% Id:      对应的任务类型的Id，如该任务是日常任务，此位置则保存日常任务表的Id，如果是链式任务，则保存链式任务的Id
%% TaskId:  需要替换成的新的任务的实例Id
%% Type:    任务类型
replace(Account, InstId, Task, PlayerBasicData, HouseData, PlayerTask) ->
    {_Msgs, NTask, NPlayerBasicData, NHouseData, NPlayerTask} = build_give(Account, Task, PlayerBasicData, HouseData, PlayerTask),
    NNPlayerTask = delete(InstId, NPlayerTask),
    {NTask, NPlayerBasicData, NHouseData, NNPlayerTask}.

get_listen_event(TaskId) ->
    Mod = get_mod(TaskId),
    Mod:listen_event().
%%%===================================================================
%%% Internal functions
%%%===================================================================
%% 获取任务模块
get_mod(TaskId) when is_integer(TaskId) ->
    list_to_atom("task_" ++ integer_to_list(TaskId)).

%% 玩家接受任务
build_give(Account, Task, PlayerBasicData, HouseData, PlayerTask) ->
    case can_give(Account, Task#task.task_id, HouseData, PlayerTask) of
	true ->
	    do_give(Account, Task, PlayerBasicData, HouseData, PlayerTask);
	Reason ->
	    Reason
    end.

%% 玩家完成任务
build_complete(Account, InstId, PlayerBasicData, HouseData, PlayerTask) ->
    GiveTasks = PlayerTask#player_task.give_tasks,
    Task = lists:keyfind(InstId, 2, GiveTasks),
    TaskId = Task#task.task_id,
    Mod = get_mod(TaskId),
    case can_complete(Account, Mod, TaskId, HouseData, PlayerTask) of
	true ->
	    do_complete(Account, Mod, InstId, PlayerBasicData, HouseData, PlayerTask);
	Reason ->
	    Reason
    end.

build_immediate_complete(Account, InstId, PlayerBasicData, HouseData, PlayerTask) ->
    GiveTasks = PlayerTask#player_task.give_tasks,
    Task = lists:keyfind(InstId, 2, GiveTasks),
    TaskId = Task#task.task_id,
    Mod = get_mod(TaskId),
    do_complete(Account, Mod, InstId, PlayerBasicData, HouseData, PlayerTask).
    

%% 领取奖励
build_reward(Account, InstId, PlayerBasicData, HouseData, PlayerTask) ->
    GiveTasks = PlayerTask#player_task.give_tasks,
    Task = lists:keyfind(InstId, 2, GiveTasks),
    TaskId = Task#task.task_id,
    Mod = get_mod(TaskId),
    case can_reward(Mod, TaskId, Task, HouseData) of
	true ->
	    {Msgs, NPlayerBasicData, NHouseData, NPlayerTask} = do_reward(Account, Task, PlayerBasicData, HouseData, PlayerTask),
	    NTask = Task#task{reward_date=datetime:localtime()},
	    NGiveTasks = lists:keyreplace(InstId, 2, GiveTasks, NTask),
	    NNPlayerTask = NPlayerTask#player_task{give_tasks=NGiveTasks},
	    {Msgs, NTask, NPlayerBasicData, NHouseData, NNPlayerTask};
	Reason ->
	    Reason
    end.

%% 执行奖励
do_reward(Account, Task, PlayerBasicData, HouseData, PlayerTask) ->
    TaskId = Task#task.task_id,
    InstId = Task#task.inst_id,
    PlayerTaskTplt = tplt:get_data(player_task_tplt, TaskId),
    Operates = 
	reward_diamond(PlayerTaskTplt) ++ 
	reward_hp(PlayerTaskTplt) ++ 
	reward_exp(PlayerTaskTplt) ++
	reward_love_coin(PlayerTaskTplt) ++
	reward_point(PlayerTaskTplt),
    NOperates = Operates ++ reward_item(PlayerTaskTplt),
    do_operate(Account, NOperates, InstId, [], PlayerBasicData, HouseData, PlayerTask).

can_reward_item(DateTime) ->
    Now = datetime:localtime(),
    datetime:diff_time(DateTime, Now) =< 0.

%% 奖励水晶
reward_diamond(PlayerTaskTplt) ->
    Diamond = PlayerTaskTplt#player_task_tplt.diamond,
    if
	Diamond /= 0 ->
	    [{add_diamond, Diamond}];
	Diamond == 0 ->
	    []
    end.

%% 奖励体力
reward_hp(PlayerTaskTplt) ->
    Hp = PlayerTaskTplt#player_task_tplt.hp,
    if
	Hp /= 0 ->
	    [{add_hp, Hp}];
	Hp == 0 ->
	    []
    end.

%% 奖励经验
reward_exp(PlayerTaskTplt) ->
    Exp = PlayerTaskTplt#player_task_tplt.experience,
    if
	Exp /= 0 ->
	    [{add_exp, Exp}];
	Exp == 0 ->
	    []
    end.
%% 奖励积分
reward_point(PlayerTaskTplt) ->
    Point = PlayerTaskTplt#player_task_tplt.point,
    if
	Point /= 0 ->
	    [{add_point, Point}];
	Point == 0 ->
	    []
    end.

%% 奖励物品
reward_item(PlayerTaskTplt) ->
    Items = PlayerTaskTplt#player_task_tplt.reward_items,
    ItemsCount = PlayerTaskTplt#player_task_tplt.reward_items_count,
    get_reward_item(Items, ItemsCount, []).

%% 奖励爱情币
reward_love_coin(PlayerTask_tplt) ->
    Love_coin = PlayerTask_tplt#player_task_tplt.love_coin,
    if
	Love_coin /= 0 ->
	    [{add_love_coin, Love_coin}];
	Love_coin == 0 ->
	    []
    end.

    
%% 获取奖励的物品
get_reward_item([], [], RewardItems) ->
    RewardItems;
get_reward_item([TempId|Items], [ItemCount|ItemsCount], RewardItems) ->
    RewardItem = create_item(TempId, ItemCount),
    get_reward_item(Items, ItemsCount, RewardItems ++ RewardItem).

create_item(_TempId, 0) ->
    [];
create_item(TempId, Count) when Count > 0 ->
    [{add_item, {TempId, Count}}].

can_reward(_Mod, TaskId, Task, HouseData) ->
    PlayerTaskTplt = tplt:get_data(player_task_tplt, TaskId),
    HouseLoverPackage = house_lover_package:get_lover_package(HouseData),
    RequireItems = PlayerTaskTplt#player_task_tplt.require_items,
    RequireItemsCount = PlayerTaskTplt#player_task_tplt.require_items_count,
    try
	validate_require_items(RequireItems, RequireItemsCount, HouseLoverPackage),
	validate_is_complete(Task),
	validate_isnt_reward(Task)
	%% validate_script_can_reward(Mod)
    catch
	throw:Error ->
	    Error
    end.

%% %% 判断脚本是否可以完成
%% %% Mod:模块名称
%% validate_script_can_reward(Mod) ->
%%     case Mod:can_reward() of
%% 	true ->
%% 	    true;
%% 	Error ->
%% 	    throw(Error)
%%     end.

%% 判断是否可以完成任务
%% Mod:模块名称
%% TaskId:任务Id
%% HouseData:房屋数据
can_complete(Account, Mod, TaskId, HouseData, PlayerTask) ->
    PlayerTaskTplt = tplt:get_data(player_task_tplt, TaskId),
    HouseLoverPackage = house_lover_package:get_lover_package(HouseData),
    RequireItems = PlayerTaskTplt#player_task_tplt.require_items,
    RequireItemsCount = PlayerTaskTplt#player_task_tplt.require_items_count,
    try
	validate_require_items(RequireItems, RequireItemsCount, HouseLoverPackage),
	validate_script_can_complete(Account, Mod, PlayerTask)
    catch
	throw:Error ->
	    Error
    end.

%% 执行完成任务
%% InstId:任务的实例Id
%% PlayerTask:任务结构
do_complete(Account, Mod, InstId, PlayerBasicData, HouseData, PlayerTask) ->
    Flags = PlayerTask#player_task.flags,
    GiveTasks = PlayerTask#player_task.give_tasks,
    Task = lists:keyfind(InstId, 2, GiveTasks),
    NTask = Task#task{complete_date=datetime:localtime()},
    NGiveTasks = lists:keyreplace(InstId, 2, GiveTasks, NTask),
    NPlayerTask = PlayerTask#player_task{give_tasks=NGiveTasks},
    Operates = Mod:do_complete({Account, Flags}),
    NOperates = task_flag:get_auto_unlisten_flag(Mod:listen_event()) ++ Operates,
    {_Msg, NPlayerBasicData, NHouseData, NNPlayerTask} = do_operate(Account, NOperates, InstId, [], PlayerBasicData, HouseData, NPlayerTask),
    {NTask, NPlayerBasicData, NHouseData, NNPlayerTask}.

%% 判断脚本是否可以完成
%% Mod:模块名称
validate_script_can_complete(Account, Mod, PlayerTask) ->
    Flags = PlayerTask#player_task.flags,
    case Mod:can_complete({Account, Flags}) of
	true ->
	    true;
	Error ->
	    throw(Error)
    end.


%% 执行接受任务
do_give(Account, Task, PlayerBasicData, HouseData, PlayerTask) ->
    Flags = PlayerTask#player_task.flags,
    TaskId = Task#task.task_id,
    InstId = Task#task.inst_id,
    Mod = get_mod(TaskId),
    Operates = Mod:do_give({Account, Flags}),
    NOperates = Operates ++ Mod:listen_event(),
    {Msgs, NPlayerBasicData, NHouseData, NPlayerTask} = do_operate(Account, NOperates, InstId, [], PlayerBasicData, HouseData, PlayerTask),
    GiveTasks = NPlayerTask#player_task.give_tasks,
    NTask = Task#task{flag_info=task_flag:get_flags(Mod:listen_event(), NPlayerTask)},
    NGiveTasks = [NTask | GiveTasks],
    NNPlayerTask = NPlayerTask#player_task{give_tasks=NGiveTasks},
    {Msgs, NTask, NPlayerBasicData, NHouseData, NNPlayerTask}.

%% 执行脚本操作
do_operate(_Account, [], _InstId, Msgs, PlayerBasicData, HouseData, PlayerTask) ->
    {Msgs, PlayerBasicData, HouseData, PlayerTask};
do_operate(Account, [{give_daily_task, TaskId}|Operates], InstId, Msg, PlayerBasicData, HouseData, PlayerTask) ->
    {NPlayerBasicData, NHouseData, NPlayerTask} = daily_task:give(Account, TaskId, PlayerBasicData, HouseData, PlayerTask),
    do_operate(Account, Operates, InstId, Msg, NPlayerBasicData, NHouseData, NPlayerTask);
do_operate(Account, [{give_daily_tasks, Account}|Operates], InstId, Msg, PlayerBasicData, HouseData, PlayerTask) ->
    {NPlayerBasicData, NHouseData, NPlayerTask} = daily_task:give(Account, PlayerBasicData, HouseData, PlayerTask),
    do_operate(Account, Operates, InstId, Msg, NPlayerBasicData, NHouseData, NPlayerTask);
do_operate(Account, [{remove_daily_tasks, Account}|Operates], InstId, Msg, PlayerBasicData, HouseData, PlayerTask) ->
    NPlayerTask = daily_task:remove(Account, PlayerTask),
    do_operate(Account, Operates, InstId, Msg, PlayerBasicData, HouseData, NPlayerTask);
do_operate(Account, [Operate|Operates], InstId, Msgs, PlayerBasicData, HouseData, PlayerTask) ->
    NHouseData = operate_diamond(Operate, HouseData),
    NPlayerBasicData = operate_hp(Operate, PlayerBasicData, NHouseData),
    {NNPlayerBasicData, NNHouseData} = operate_exp(Operate, NPlayerBasicData, NHouseData),
    {NNNHouseData, Msg} = operate_item(Operate, NNHouseData),
    operate_point(Operate, Account),
    operate_love_coin(Operate, Account),
    NMsgs = get_msg(Msg, Msgs),
    NPlayerTask = task_flag:operate_flag(Operate, InstId, PlayerTask),
    do_operate(Account, Operates, InstId, NMsgs, NNPlayerBasicData, NNNHouseData, NPlayerTask).

get_msg(Msg, Msgs) ->
    case Msg of
	[] ->
	    Msgs;
	_ ->
	    Msg ++ Msgs
    end.

operate_flag([], _InstId, PlayerTask) ->
    PlayerTask;
operate_flag([Operate|Operates], InstId, PlayerTask) ->
    NPlayerTask = task_flag:operate_flag(Operate, InstId, PlayerTask),
    operate_flag(Operates, InstId, NPlayerTask).
   

%% 操作水晶
operate_diamond(Operate, HouseData) ->
    case Operate of
	{add_diamond, Diamond} when Diamond >= 0 ->
	    NHouseData = house_diamond:add_diamond(Diamond, HouseData),
	    NHouseData;
	{add_diamond, Diamond} when Diamond < 0 ->
	    NHouseData = house_diamond:dec_diamond(abs(Diamond), HouseData),
	    NHouseData;
	_ ->
	    HouseData
    end.

%% 操作体力值
operate_hp(Operate, PlayerBasicData, HouseData) ->
    case Operate of
	{add_hp, Hp} when Hp >= 0 ->
	    player_hp:add_hp(Hp, PlayerBasicData, HouseData);
	{add_hp, Hp} when Hp < 0 ->
	    {ok, NPlayerBasicData} = player_hp:dec_hp(abs(Hp), PlayerBasicData, HouseData),
	    NPlayerBasicData;
	_ ->
	    PlayerBasicData
    end.

%% 操作经验
operate_exp(Operate, PlayerBasicData, HouseData) ->
    case Operate of
	{add_exp, Exp} when Exp >= 0 ->
	    {NPlayerBasicData, NHouseData, _Msgs} = house_level_exp:add_exp(Exp, PlayerBasicData, HouseData),
	    {NPlayerBasicData, NHouseData};
	_ ->
	    {PlayerBasicData, HouseData}
    end.

%% 操作物品
operate_item(Operate, HouseData) ->
    case Operate of
	{add_item, {0, 0}} ->
	    {HouseData, []};
	{add_item, {TempId, Count}} ->
	    house_pack:add_items([{TempId, Count}], HouseData);
	_ ->
	    {HouseData, []}
    end.

operate_point(Operate, Account) ->
    case Operate of
	{add_point, Point} ->
	    party_coin:add(Account, Point);
	_ ->
	    ok
    end.


%% 操作爱情币
operate_love_coin(Operate, Account) ->
    case Operate of
	{add_love_coin, Love_coin} ->
	    player_love_coin:recharge(Account, ?order_goods_meta_event, Love_coin);
	_ ->
	    ok
    end.

    
%% 通知客户端
%% Account:玩家帐号
%% Result:返回的错误信息({false, s2c, error_item}:代表发送给客户端错误信息)

notify(_Account, []) ->
    ok;
notify(Account, [Result|Results]) ->
    notify(Account, Result),
    notify(Account, Results);
notify(Account, Result) ->
    case Result of
	{false, s2c, Reason} ->
	    sys_msg:send(Account, Reason);
	_ ->
	    ok
    end.

%% %% 获取进程模块
%% get_mod(?tt_daily) ->
%%     daily_task;
%% get_mod(?tt_chain) ->
%%     chain_task.

%% 判断能否接受该任务
%% 判断需要的物品
can_give(Account, TaskId, HouseData, PlayerTask) ->
    Mod = get_mod(TaskId),
    PlayerTaskTplt = tplt:get_data(player_task_tplt, TaskId),
    HouseLoverPackage = house_lover_package:get_lover_package(HouseData),
    RequireItems = PlayerTaskTplt#player_task_tplt.require_items,
    RequireItemsCount = PlayerTaskTplt#player_task_tplt.require_items_count,
    try
	validate_require_items(RequireItems, RequireItemsCount, HouseLoverPackage),
	validate_script_can_give(Account, Mod, PlayerTask)
    catch
	throw:Error ->
	    Error
    end.


%% 判断物品数量是否足够
%% RequireItems:需要的物品
%% RequireItemsCount:需要的物品对应的数量
%% HouseLoverPackage:玩家包裹
validate_require_items([0], [0], _) ->
    true;
validate_require_items([], [], _) ->
    true;
validate_require_items([TempId|RequireItems], [Count|RequireItemsCount], HouseLoverPackage) ->
    TotalCount = house_lover_package:get_item_total_count(HouseLoverPackage, TempId),
    case TotalCount >= Count of
	true ->
	    validate_require_items(RequireItems, RequireItemsCount, HouseLoverPackage);
	false ->
	    throw({false, s2c, ?err_task_not_contain_item})
    end.

%% 判断该任务是否完成，只有完成后才能领取奖励
validate_is_complete(Task) ->
    CompleteDate = Task#task.complete_date,
    case datetime:is_empty(CompleteDate) of
	false ->
	    true;
	true ->
	    throw({false, err_task_cant_complete})
    end.

validate_isnt_complete(Task) ->
    CompleteDate = Task#task.complete_date,
    case datetime:is_empty(CompleteDate) of
	true ->
	    true;
	false ->
	    throw({false, err_task_has_complete})
    end.

validate_isnt_reward(Task) ->
    RewardDate = Task#task.reward_date,
    case datetime:is_empty(RewardDate) of
	true ->
	    true;
	false ->
	    throw({false, err_task_has_reward})
    end.


%% 判断脚本是否可以接
%% Mod:脚本对应的模块
%% PlayerBasicData:玩家基本数据
%% HouseData:房屋基础数据
validate_script_can_give(Account, Mod, PlayerTask) ->
    Flags = PlayerTask#player_task.flags,
    case Mod:can_give({Account, Flags}) of
	true ->
	    true;
	Error ->
	    throw(Error)
    end.
