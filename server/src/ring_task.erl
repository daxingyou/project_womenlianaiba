%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% 环形任务
%%% @end
%%% Created :  6 Sep 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(ring_task).

-include("enum_def.hrl").
-include("tplt_def.hrl").
-include("records.hrl").
-include("common_def.hrl").
-include("resource.hrl").
-include("packet_def.hrl").
-include("sys_msg.hrl").
-include("router.hrl").

-record(ring_task, {account,           %% 玩家帐号
		    pack_task,         %% 当前任务
		    ring_count = 0,    %% 环数
		    give_date,         %% 接任务的时间
		    give_count=0       %% 接任务的次数
		   }).

-export([init/1, give/1, give/2, complete/1, reward/2, has_task/1, has_complete/1]).

-export([give_up/2, view/2, stop_time/1, immediate_complete/2]).

-export([get_npc_options/1, get_npc_content/1, get_npc_id/1, set_event_count/2, get_task_type/1]).

-export([start/1, handle_cast/2]).

%%%===================================================================
%%% Handle Cast
%%%===================================================================
handle_cast({#msg{src=Account}, #req_give_up_ring_task{inst_id=InstId}}, State) ->
    give_up(Account, InstId),
    {noreply, State};
handle_cast({#msg{src=Account}, #req_stop_ring_task{inst_id=_InstId}}, State) ->
    stop_time(Account),
    {noreply, State};
handle_cast({#msg{src=Account}, #req_immediate_complete_ring_task{inst_id=_InstId}}, State) ->
    immediate_complete(Account, State),
    {noreply, State};
handle_cast({#msg{src=Account}, #req_view_ring_task{inst_id=InstId}}, State) ->
    view(Account, InstId),
    {noreply, State};
handle_cast({#msg{src=Account}, #req_ring_task_target{inst_id=InstId}}, State) ->
    get_targets(Account, InstId),
    {noreply, State}.

%%%===================================================================
%%% API
%%%===================================================================
start(Account) ->
    [router:make_event_source(?msg_req_give_up_ring_task, Account, {self(), ?MODULE}),
     router:make_event_source(?msg_req_stop_ring_task, Account, {self(), ?MODULE}),
     router:make_event_source(?msg_req_immediate_complete_ring_task, Account, {self(), ?MODULE}),
     router:make_event_source(?msg_req_view_ring_task, Account, {self(), ?MODULE}),
     router:make_event_source(?msg_req_ring_task_target, Account, {self(), ?MODULE})
    ].

init(Account) ->
    RingTask = get_ring_task(Account),
    case has_task(RingTask) of
	true ->
	    PackTask = RingTask#ring_task.pack_task,
	    NPackTask = pack_task:update(PackTask),
	    NRingTask = RingTask#ring_task{pack_task=NPackTask},
	    RingCount = get_ring_count(NRingTask),
	    db:dirty_write(NRingTask),
	    net_helper:send2client(Account, #notify_add_ring_task{task=format_pack_task(RingCount, NPackTask)});
	false ->
	    ok
    end.

give(Account) ->
    RingTask = get_ring_task(Account),
    RingCount = get_ring_count(RingTask),
    TaskType = 
	case RingCount < 20 of
	    true ->
		FrontTplt = tplt:get_data(ring_task_front_task_tplt, RingCount),
		FrontTplt#ring_task_front_task_tplt.type;
	    false ->
		rand_task_type()
	end,
    give(Account, TaskType).

give(Account, TaskType) ->
    RingTask = get_ring_task(Account),
    case has_task(RingTask) of
	true ->
	    sys_msg:send(Account, ?msg_ring_task_not_exist);
	false ->
	    [PlayerBasicData] = db:dirty_read(player_basic_data, Account),
	    HouseId = player_basic_data:get_house_id(PlayerBasicData),
	    [HouseData] = db:dirty_read(house_data, HouseId),
	    RingCount = get_ring_count(RingTask),
	    RingTaskTplt = tplt:get_data(ring_task_tplt, RingCount),
	    case RingCount == 0 of
		true ->
		    Now = datetime:localtime(),
		    DiffTime = datetime:diff_date(RingTask#ring_task.give_date, Now),
		    if  DiffTime == 0 ->
			    Count = RingTask#ring_task.give_count,
			    MaxCount = common_def:get_val(ring_task_max_count),
			    case Count < MaxCount of
				true ->
				    NRingTask = RingTask#ring_task{give_count=Count+1},
				    case give_1(Account, TaskType, NRingTask, RingTaskTplt, HouseData) of
					true ->
					    sys_msg:send(Account, ?msg_ring_task_give_count, [MaxCount, Count+1]);
					_ ->
					    ok
				    end;
				false ->
				    sys_msg:send(Account, ?msg_ring_task_exceed_max_count)
			    end;
			DiffTime > 0 ->
			    NRingTask = RingTask#ring_task{give_date=Now, give_count=1},
			    give_1(Account, TaskType, NRingTask, RingTaskTplt, HouseData);
			true ->
			    ok
		    end;
		false ->
		    give_1(Account, TaskType, RingTask, RingTaskTplt, HouseData)
	    end
    end.

give_1(Account, TaskType, RingTask, RingTaskTplt, HouseData) ->
    StartRequireItem = RingTaskTplt#ring_task_tplt.start_require_item,
    case StartRequireItem  == 0 of
	true ->
	    do_give(Account, TaskType, RingTask, RingTaskTplt, HouseData),
	    true;
	false ->
	    case house_pack:get_item_count_by_tempid([StartRequireItem], HouseData) > 0 of
		true ->
		    do_give(Account, TaskType, RingTask, RingTaskTplt, HouseData),
		    true;
		false ->
		    sys_msg:send(Account, ?msg_ring_task_item_not_exist)
	    end
    end.

do_give(Account, TaskType, RingTask, RingTaskTplt, HouseData) ->
    RingCount = get_ring_count(RingTask),
    StartRequireItem = RingTaskTplt#ring_task_tplt.start_require_item,
    DueTime = RingTaskTplt#ring_task_tplt.due_time,
    ID = get_rand_id(RingCount, TaskType),
    PackTask = pack_task:create(TaskType, ID, DueTime),
    NRingTask = create_pack_task(PackTask, RingTask),
    {NHouseData, Msgs1} = pack_task:do_give(PackTask, HouseData),
    {NNHouseData, Msgs2} = 
    case StartRequireItem > 0 of
	true ->
	    house_pack:del_item_by_tempid(StartRequireItem, NHouseData);
	false ->
	    {NHouseData, []}
    end,
    db:dirty_write(NRingTask),
    db:dirty_write(NNHouseData),
    Msgs = Msgs1 ++ Msgs2,
    [net_helper:send2client(Account, Msg) || Msg <- Msgs],
    net_helper:send2client(Account, #notify_add_ring_task{task=format_pack_task(RingCount, PackTask)}),
    net_helper:send2client(Account, #notify_show_ring_task{}).

get_rand_id(RingCount, TaskType) ->
    case RingCount < 20 of
	true ->
	    FrontTplt = tplt:get_data(ring_task_front_task_tplt, RingCount),
	    FrontTplt#ring_task_front_task_tplt.id;
	false ->
	    pack_task:rand_id(TaskType)
    end.

complete(Account) ->
    RingTask = get_ring_task(Account),
    case has_task(RingTask) of
	true ->
	    PackTask = RingTask#ring_task.pack_task,
	    case has_past_due(PackTask) of
		false ->
		    case has_complete(PackTask) of
			false ->
			    [PlayerBasicData] = db:dirty_read(player_basic_data, Account),
			    HouseId = player_basic_data:get_house_id(PlayerBasicData),
			    [HouseData] = db:dirty_read(house_data, HouseId),
			    case pack_task:can_complete(PackTask, HouseData) of
				true ->
				    do_complete(Account, RingTask, PackTask, HouseData),
				    true;
				{false, item_not_enough, {RequireItemId, RequireItemCount}} ->
				    ItemName = item:get_item_name(RequireItemId),
				    sys_msg:send(Account, ?msg_ring_task_require_item_not_enough, [ItemName, RequireItemCount]),
				    false;
				{false, count_not_enough} ->
				    sys_msg:send(Account, ?msg_ring_task_task_cant_complete),
				    false

			    end;
			true ->
			    %%通知客户端任务已经完成，不允许重复完成
			    sys_msg:send(Account, ?msg_ring_task_task_has_complete),
			    false
		    end;
		true ->
		    sys_msg:send(Account, ?msg_ring_task_past_due),
		    false
	    end;
	false ->
	    sys_msg:send(Account, ?msg_ring_task_not_exist),
	    false
    end.

immediate_complete(Account, PlayerData) ->
    RingTask = get_ring_task(Account),
    case has_task(RingTask) of
	true ->
	    PackTask = RingTask#ring_task.pack_task,
	    case has_past_due(PackTask) of
		false ->
		    case has_complete(PackTask) of
			false ->
			    RingCount = get_ring_count(RingTask),
			    RingTaskTplt = tplt:get_data(ring_task_tplt, RingCount),
			    LoginType = player_data:get_login_type(PlayerData),
			    QCoin = util:get_price(RingTaskTplt#ring_task_tplt.q_coin, LoginType),
			    ShipCallback = 
			    	fun(#order{status=Status}=_Order)-> 			   
			    		case (Status =:= ?order_payed) of
			    		    true ->
						Now = datetime:localtime(),
						NPackTask = pack_task:set_complete_date(Now, PackTask),
						NRingTask = RingTask#ring_task{pack_task=NPackTask},
						db:dirty_write(NRingTask),
						net_helper:send2client(Account, 
								       #notify_complete_ring_task{inst_id=pack_task:get_inst_id(NPackTask),
												  complete_date=pack_task:get_complete_date(NPackTask)
												 }),
						?pay_shipped;

			    		    _ ->
			    			?pay_error
			    		end				       
			    	end,
			    player_love_coin:pay([{pack_task:get_type(PackTask), 1, QCoin}], 
			    		   ShipCallback, ?order_goods_meta_ring_task, PlayerData);
			true ->
			    %%通知客户端任务已经完成，不允许重复完成
			    sys_msg:send(Account, ?msg_ring_task_task_has_complete)
		    end;
		true ->
		    sys_msg:send(Account, ?msg_ring_task_past_due)
	    end;
	false ->
	    sys_msg:send(Account, ?msg_ring_task_not_exist)
    end.

stop_time(Account) ->
    RingTask = get_ring_task(Account),
    case has_task(RingTask) of
	true ->
	    PackTask = RingTask#ring_task.pack_task,
	    RingCount = get_ring_count(RingTask),
	    RingTaskTplt = tplt:get_data(ring_task_tplt, RingCount),
	    StopRequireItem = RingTaskTplt#ring_task_tplt.stop_require_item,
	    StopRequireItemCount = RingTaskTplt#ring_task_tplt.stop_require_item_count,
	    [PlayerBasicData] = db:dirty_read(player_basic_data, Account),
	    HouseId = player_basic_data:get_house_id(PlayerBasicData),
	    [HouseData] = db:dirty_read(house_data, HouseId),
	    ItemCount = house_pack:get_item_count_by_tempid([StopRequireItem], HouseData),
	    case ItemCount >= StopRequireItemCount of
		true ->
		    {_, NHouseData, Msgs} = house_pack:try_del_n_by_tempid([StopRequireItem], StopRequireItemCount, HouseData),
		    EmptyDate = datetime:empty(),
		    NPackTask = pack_task:set_due_date(EmptyDate, PackTask),
		    NRingTask = RingTask#ring_task{pack_task=NPackTask},
		    db:dirty_write(NHouseData),
		    db:dirty_write(NRingTask),
		    [net_helper:send2client(Account, Msg) || Msg <- Msgs],
		    net_helper:send2client(Account, #notify_stop_ring_task{inst_id=pack_task:get_inst_id(NPackTask),
									   due_date=pack_task:get_due_date(NPackTask)
									  });
		false ->
		    %%通知客户端物品不够
		    ItemName = item:get_item_name(StopRequireItem),
		    sys_msg:send(Account, ?msg_ring_task_require_item_not_enough, [ItemName, StopRequireItemCount - ItemCount])
	    end;
	false ->
	    sys_msg:send(Account, ?msg_ring_task_not_exist)
    end.

%% Type:diamond or exp
reward(Account, Type) ->
    RingTask = get_ring_task(Account),
    case has_task(RingTask) of
	true ->
	    PackTask = RingTask#ring_task.pack_task,
	    case has_past_due(PackTask) of
		false ->
		    case has_complete(PackTask) of
			true ->
			    F = fun() ->
					[PlayerBasicData] = db:read(player_basic_data, Account),
					HouseId = player_basic_data:get_house_id(PlayerBasicData),
					[HouseData] = db:read(house_data, HouseId),
					RingCount = get_ring_count(RingTask),
					{NPlayerBasicData, NHouseData, Msgs} = reward(Type, RingCount, PlayerBasicData, HouseData),
					NRingTask = 
					    case RingCount >= 49 of
						true ->
						    reset_ring_count(RingTask);
						false ->
						    add_ring_count(RingTask, 1)
					    end,
					NNRingTask = clear_pack_task(NRingTask),
					db:write(NPlayerBasicData),
					db:write(NHouseData),
					db:write(NNRingTask),
					{true, Msgs, NHouseData}
				end,
			    case db:transaction(F) of
				{true, Msgs, NHouseData} ->
				    house_diamond:notify(NHouseData),
				    [net_helper:send2client(Account, Msg) || Msg <- Msgs],
				    net_helper:send2client(Account, #notify_delete_ring_task{inst_id=pack_task:get_inst_id(PackTask)})
			    end,
			    true;
			false ->
			    %%通知客户端任务未完成，不允许领取奖励
			    sys_msg:send(Account, ?msg_ring_task_task_cant_complete),
			    false
		    end;
		true ->
		    sys_msg:send(Account, ?msg_ring_task_past_due),
		    false
	    end;
	false ->
	    sys_msg:send(Account, ?msg_ring_task_not_exist),
	    false
    end.

view(Account, _InstId) ->
    RingTask = get_ring_task(Account),
    case has_task(RingTask) of
	true ->
	    PackTask = RingTask#ring_task.pack_task,
	    NPackTask = pack_task:set_is_view(?cb_true, PackTask),
	    NRingTask = RingTask#ring_task{pack_task=NPackTask},
	    Count = pack_task:get_event_count(NPackTask),
	    db:dirty_write(NRingTask),
	    net_helper:send2client(Account, #notify_view_ring_task{count=Count});
	false ->
	    sys_msg:send(Account, ?msg_ring_task_not_exist)
	        end.

get_targets(Account, _InstId) ->
    RingTask = get_ring_task(Account),
    case has_task(RingTask) of
	true ->
	    %%TODO:发给客户端任务的目标数量
	    ok;
	false ->
	    sys_msg:send(Account, ?msg_ring_task_not_exist)
    end.

get_npc_options(Account) ->
    RingTask = get_ring_task(Account),
    case has_task(RingTask) of
	true ->
	    PackTask = RingTask#ring_task.pack_task,
	    pack_task:get_npc_options(PackTask);
	false ->
	    ok
    end.

get_npc_content(Account) ->
    RingTask = get_ring_task(Account),
    case has_task(RingTask) of
	true ->
	    PackTask = RingTask#ring_task.pack_task,
	    pack_task:get_npc_content(PackTask);
	false ->
	    ok
    end.

get_npc_id(Account) ->
    RingTask = get_ring_task(Account),
    case has_task(RingTask) of
	true ->
	    PackTask = RingTask#ring_task.pack_task,
	    pack_task:get_npc_id(PackTask);
	false ->
	    0
    end.

set_event_count(Account, Event) ->
    RingTask = get_ring_task(Account),
    case has_task(RingTask) of
	true ->
	    PackTask = RingTask#ring_task.pack_task,
	    NPackTask = pack_task:set_event_count(PackTask, Event),
	    NRingTask = RingTask#ring_task{pack_task=NPackTask},
	    db:dirty_write(NRingTask);
	false ->
	    ok
    end.

get_task_type(Account) ->
    RingTask = get_ring_task(Account),
    case has_task(RingTask) of
	true ->
	    PackTask = RingTask#ring_task.pack_task,
	    pack_task:get_type(PackTask);
	false ->
	    -1
    end.
%%%===================================================================
%%% Internal Func
%%%===================================================================
give_up(Account, InstId) ->
    RingTask = get_ring_task(Account),
    case has_task(RingTask) of
	true ->
	    NRingTask = remove_pack_task(RingTask),
	    NNRingTask = reset_ring_count(NRingTask),
	    db:dirty_write(NNRingTask),
	    net_helper:send2client(Account, #notify_delete_ring_task{inst_id=InstId});
	false ->
	    sys_msg:send(Account, ?msg_ring_task_not_exist)
    end.

do_complete(Account, RingTask, PackTask, HouseData) ->
    Now = datetime:localtime(),
    {NHouseData, Msgs} = pack_task:do_complete(PackTask, HouseData),
    NPackTask = pack_task:set_complete_date(Now, PackTask),
    NRingTask = RingTask#ring_task{pack_task=NPackTask},
    db:dirty_write(NHouseData),
    db:dirty_write(NRingTask),
    house_pack:send_msgs(Msgs, NHouseData),
    net_helper:send2client(Account, #notify_complete_ring_task{inst_id=pack_task:get_inst_id(NPackTask),
							       complete_date=pack_task:get_complete_date(NPackTask)
							      }).

reward(Type, RingCount, PlayerBasicData, HouseData) ->
    RingTaskTplt = tplt:get_data(ring_task_tplt, RingCount),
    RewardItems = RingTaskTplt#ring_task_tplt.reward_items,
    RewardItemsCount = RingTaskTplt#ring_task_tplt.reward_items_count,
    Rewards = recombine_reward_items(RewardItems, RewardItemsCount, []),
    {NHouseData, AddItemMsgs} = house_pack:add_items(Rewards, HouseData),
    {NPlayerBasicData, NNHouseData, Msgs} = do_reward(Type, RingTaskTplt, PlayerBasicData, NHouseData),
    {NPlayerBasicData, NNHouseData, AddItemMsgs ++ Msgs}.

do_reward(exp, RingTaskTplt, PlayerBasicData, HouseData) ->
    RewardExp =RingTaskTplt#ring_task_tplt.reward_exp,
    {NPlayerBasicData, NHouseData, Msgs} = house_level_exp:add_exp(RewardExp, PlayerBasicData, HouseData),
    {NPlayerBasicData, NHouseData, Msgs};
do_reward(diamond, RingTaskTplt, PlayerBasicData, HouseData) ->
    RewardDiamond = RingTaskTplt#ring_task_tplt.reward_diamond,
    NHouseData = house_diamond:add_diamond(RewardDiamond, HouseData),
    {PlayerBasicData, NHouseData, []}.

has_task(Account) when is_atom(Account) ->
    RingTask = get_ring_task(Account),
    has_task(RingTask);
has_task(RingTask) ->
    RingTask#ring_task.pack_task /= [].

has_past_due(PackTask) ->
    Now = datetime:localtime(),
    DueDate = pack_task:get_due_date(PackTask),
    case DueDate == datetime:empty() of
	true ->
	    false;
	false ->
	    datetime:diff_time(DueDate, Now) >= 0
    end.

has_complete(Account) when is_atom(Account) ->
    RingTask = get_ring_task(Account),
    PackTask = RingTask#ring_task.pack_task,
    has_complete(PackTask);
has_complete(PackTask) ->
    CompleteDate = pack_task:get_complete_date(PackTask),
    datetime:is_empty(CompleteDate) == false.

create_pack_task(PackTask, RingTask) ->
    RingTask#ring_task{pack_task = PackTask}.


remove_pack_task(RingTask) ->
    RingTask#ring_task{pack_task=[]}.

get_ring_task(Account) ->
    case db:dirty_read(ring_task, Account) of
	[] ->
	    #ring_task{account=Account, pack_task=[], ring_count=0, give_date=datetime:localtime(), give_count=0};
	[RingTask] ->
	    RingTask
    end.

rand_task_type() ->
    %% TaskTypes = [?ptt_dialogue, ?ptt_deliver_goods, ?ptt_find_item, ?ptt_collect],
    TaskTypes = [?ptt_dialogue, ?ptt_collect, ?ptt_deliver_goods, ?ptt_function],
    TotalCount = length(TaskTypes),
    RandValue = rand:uniform(TotalCount),
    lists:nth(RandValue, TaskTypes).

reset_ring_count(RingTask) ->
    RingTask#ring_task{ring_count=0}.

add_ring_count(RingTask, Count) ->
    RingCount = RingTask#ring_task.ring_count,
    RingTask#ring_task{ring_count=RingCount+Count}.

clear_pack_task(RingTask) ->
    RingTask#ring_task{pack_task=[]}.
    
    
get_ring_count(RingTask) ->
    RingTask#ring_task.ring_count.

recombine_reward_items([], [], RewardItems) ->
    RewardItems;
recombine_reward_items([0], [0], RewardItems) ->
    RewardItems;
recombine_reward_items([RewardItem|RewardItems], [RewardItemCount|RewardItemsCount], NRewardItems) ->
    RewardItems1 = {RewardItem, RewardItemCount},
    recombine_reward_items(RewardItems, RewardItemsCount, [RewardItems1|NRewardItems]).

format_pack_task(RingCount, PackTask) ->
    #ring_task_atom{inst_id=pack_task:get_inst_id(PackTask),
		    ring_count=RingCount,
		    type=pack_task:get_type(PackTask),
		    content_id=pack_task:get_content_id(PackTask),
		    rule_id=pack_task:get_rule_id(PackTask),
		    complete_date=pack_task:get_complete_date(PackTask),
		    due_date=pack_task:get_due_date(PackTask),
		    is_view=pack_task:get_is_view(PackTask),
		    count=pack_task:get_event_count(PackTask)
		   }.
