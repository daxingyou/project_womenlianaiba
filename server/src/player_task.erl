%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% 基础任务
%%% @end
%%% Created :  9 Apr 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(player_task).

-export([new/1, start/1, give/2, get_player_task/1, do_event/3]).
-export([handle_cast/2]).

-include("player_task.hrl").
-include("packet_def.hrl").
-include("enum_def.hrl").
-include("router.hrl").
-include("tplt_def.hrl").

%%%===================================================================
%%% API
%%%===================================================================
%% 初始化任务
%% Account:玩家帐号
new(Account) ->
    #player_task{account=Account, give_tasks=[], flags=[], events=[], complete_chain_tasks=[]}.

get_player_task(Account) ->
    case db:dirty_read(player_task, Account) of
	[] ->
	    new(Account);			    
	[PlayerTask] ->
	    PlayerTask
    end.

give(Account, _PlayerBasicData) ->
    PlayerTask = player_task:get_player_task(Account),
    NPlayerTask = chain_task:re_listen_event(PlayerTask),
    case PlayerTask == NPlayerTask of
	true ->
	    ok;
	false ->
	    db:dirty_write(NPlayerTask)
    end,
    chain_task:send_chain_tasks_to_client(Account, NPlayerTask),
    daily_task:give(Account).
%% case chain_task:is_give(1, NPlayerTask) or chain_task:is_give(2, NPlayerTask) or
%% 	chain_task:is_give(100, NPlayerTask) or chain_task:is_give(101, NPlayerTask)
    %% of %% 如果当前有接新手任务的话,就不接每日任务
    %% 	true ->
    %% 	    ok;
    %% 	%% send_daily_or_chain_task_to_client(Account, NPlayerTask);
    %% 	false ->
    %% 	    case player:is_boy(PlayerBasicData) of
    %% 		true ->
    %% 		    chain_task:give(Account, 100);
    %% 		false ->
    %% 		    chain_task:give(Account, 101)
    %% 	    end
    %% 	    %% case player:is_boy(PlayerBasicData) of
    %% 	    %% 	true ->
    %% 	    %% 	    give_daily_and_chain_task(Account, 1, 3, NPlayerTask);
    %% 	    %% 	false ->
    %% 	    %% 	    give_daily_and_chain_task(Account, 2, 4, NPlayerTask)
    %% 	    %% end
    %% end.

%% can_give(PrevTask, CurrTask, PlayerTask) ->
%%     (chain_task:is_give(PrevTask, PlayerTask) == false) and %% 如果是老玩家，并且没有接新手的收集跟合成任务
%%     (chain_task:is_complete(PrevTask, PlayerTask) == false) and 
%%     (chain_task:is_give(CurrTask, PlayerTask) == false) and
%%     (chain_task:is_complete(CurrTask, PlayerTask) == false).

%% give_daily_and_chain_task(Account, PrevTask, CurrTask, PlayerTask) ->
%%     case can_give(PrevTask, CurrTask, PlayerTask) of
%% 	true ->
%% 	    chain_task:give(Account, CurrTask),
%% 	    daily_task:give(Account);
%% 	false ->
%% 	    chain_task:send_chain_tasks_to_client(Account, PlayerTask),
%% 	    daily_task:give(Account)
%%     end.

%% send_daily_or_chain_task_to_client(Account, PlayerTask) ->
%%     case chain_task:base_task_complete(1, 10004, PlayerTask) or
%% 	chain_task:base_task_complete(2, 10004, PlayerTask) of
%% 	true ->
%% 	    chain_task:send_chain_tasks_to_client(Account, PlayerTask),
%% 	    daily_task:send_daily_tasks_to_client(Account, PlayerTask);
%% 	false ->
%% 	    case chain_task:base_task_complete(1, 10005, PlayerTask) or
%% 		chain_task:base_task_complete(2, 10005, PlayerTask) of
%% 		true ->
%% 		    chain_task:send_chain_tasks_to_client(Account, PlayerTask),
%% 		    daily_task:give(Account);
%% 		false ->
%% 		    chain_task:send_chain_tasks_to_client(Account, PlayerTask),
%% 		    daily_task:send_daily_tasks_to_client(Account, PlayerTask)
%% 	    end
%%     end.

%% 注册事件
%% Account:玩家帐号
start(Account) ->
    [router:make_event_source(?msg_req_get_task_reward, Account, {self(), ?MODULE}),
     router:make_event_source(?msg_req_change_task, Account, {self(), ?MODULE}),
     router:make_event_source(?msg_req_immediate_complete, Account, {self(), ?MODULE})
    ].

do_event(Account, Event, Value) ->
    [PlayerTask] = db:dirty_read(player_task, Account),
    NPlayerTask = task_flag:update_flags(Event, Value, PlayerTask),
    db:dirty_write(NPlayerTask),
    complete(Account, Event, NPlayerTask).
%%%===================================================================
%%% Handle Cast
%%%===================================================================
handle_cast({#msg{src=Account}, #req_get_task_reward{inst_id=InstId, type=Type}}, State) ->
    gen_task:reward(Account, InstId, Type, State),
    {noreply, State};
handle_cast({#msg{src=Account}, #req_change_task{inst_id=InstId, type=Type}}, State) ->
    gen_task:change(Account, InstId, Type),
    {noreply, State};
handle_cast({#msg{src=Account}, #req_immediate_complete{inst_id=InstId}}, State) ->
    gen_task:immediate_complete(Account, InstId, State),
    {noreply, State}.
%%%===================================================================
%%% Internal Func
%%%===================================================================
complete(Account, Event, PlayerTask) ->
    InstIds = task_flag:get_listens(Event, PlayerTask),
    do_complete(Account, InstIds, PlayerTask).
    
do_complete(_Account, [], _PlayerTask) ->
    ok;
do_complete(Account, [InstId|InstIds], PlayerTask) ->
    GiveTasks = PlayerTask#player_task.give_tasks,
    GiveTask = lists:keyfind(InstId, 2, GiveTasks),
    TaskId = GiveTask#task.task_id,
    InstId = GiveTask#task.inst_id,
    gen_task:complete(Account, InstId),
    FlagInfo = gen_task:get_flag_info(TaskId, PlayerTask),
    net_helper:send2client(Account, #notify_task_flag{inst_id=InstId, info=FlagInfo}),
    do_complete(Account, InstIds, PlayerTask).


