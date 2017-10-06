%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% 打包生成任务
%%% @end
%%% Created :  6 Sep 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(pack_task).

-include("enum_def.hrl").
-include("common_def.hrl").
-include("tplt_def.hrl").
-include("resource.hrl").

-record(pack_task, {inst_id,         %% 任务实例
		    type,            %% 任务类型(对话任务，送货任务，悬赏任务等)
		    flag,            %% 任务标志位
		    content_id,      %% 内容Id
		    rule_id,         %% 规则Id
		    complete_date,   %% 完成日期
		    due_date,        %% 到期日期
		    is_view,         %% 是否查看过
		    listen_event,    %% 监听的事件
		    event_count      %% 事件执行的次数
		   }).

-export([create/3, do_give/2, can_complete/2, do_complete/2, remove/2]).

-export([get_inst_id/1, rand_id/1, get_type/1, get_flag/1, set_flag/2, 
	 get_content_id/1, get_rule_id/1, get_complete_date/1, set_complete_date/2,
	 get_due_date/1, set_due_date/2, get_is_view/1, set_is_view/2, get_event_count/1]).

-export([get_npc_options/1, get_npc_content/1, get_npc_id/1, set_event_count/2, update/1]).


%%%===================================================================
%%% API
%%%===================================================================
update({pack_task, InstId, Type, Flag, ContentId, RuleId, CompleteData, DueData, IsView}) ->
    {pack_task, InstId, Type, Flag, ContentId, RuleId, CompleteData, DueData, IsView, [], 0};
update(PackTask) ->
    PackTask.

get_inst_id(PackTask) ->
    PackTask#pack_task.inst_id.

get_type(PackTask) ->
    PackTask#pack_task.type.

get_flag(PackTask) ->
    PackTask#pack_task.flag.

set_flag(Flag, PackTask) ->
    PackTask#pack_task{flag=Flag}.

get_content_id(PackTask) ->
    PackTask#pack_task.content_id.

get_rule_id(PackTask) ->
    PackTask#pack_task.rule_id.

get_complete_date(PackTask) ->
    PackTask#pack_task.complete_date.

set_complete_date(CompleteDate, PackTask) ->
    PackTask#pack_task{complete_date=CompleteDate}.

get_due_date(PackTask) ->
    PackTask#pack_task.due_date.

set_due_date(DueDate, PackTask) ->
    PackTask#pack_task{due_date=DueDate}.

get_is_view(PackTask) ->
    PackTask#pack_task.is_view.

set_is_view(IsView, PackTask) ->
    PackTask#pack_task{is_view=IsView}.

get_event_count(PackTask) ->
    PackTask#pack_task.event_count.

get_npc_options(PackTask) when PackTask#pack_task.type == ?ptt_dialogue ->
    ContentID = get_content_id(PackTask),
    ContentTplt = tplt:get_data(dialogue_task_tplt, ContentID),
    binary_to_list(ContentTplt#dialogue_task_tplt.npc_options);
get_npc_options(PackTask) when PackTask#pack_task.type == ?ptt_deliver_goods ->
    ContentID = get_content_id(PackTask),
    ContentTplt = tplt:get_data(deliver_goods_task_tplt, ContentID),
    binary_to_list(ContentTplt#deliver_goods_task_tplt.npc_options);
get_npc_options(PackTask) when PackTask#pack_task.type == ?ptt_collect ->
    [];
get_npc_options(_PackTask) ->
    [].

get_npc_content(PackTask) when PackTask#pack_task.type == ?ptt_dialogue ->
    ContentID = get_content_id(PackTask),
    ContentTplt = tplt:get_data(dialogue_task_tplt, ContentID),
    binary_to_list(ContentTplt#dialogue_task_tplt.npc_content);
get_npc_content(PackTask) when PackTask#pack_task.type == ?ptt_deliver_goods ->
    ContentID = get_content_id(PackTask),
    ContentTplt = tplt:get_data(deliver_goods_task_tplt, ContentID),
    binary_to_list(ContentTplt#deliver_goods_task_tplt.npc_content);
get_npc_content(PackTask) when PackTask#pack_task.type == ?ptt_collect ->
    [];
get_npc_content(_PackTask) ->
    [].

get_npc_id(PackTask) when PackTask#pack_task.type == ?ptt_dialogue ->
    ContentID = get_content_id(PackTask),
    ContentTplt = tplt:get_data(dialogue_task_tplt, ContentID),
    ContentTplt#dialogue_task_tplt.npc_id;
get_npc_id(PackTask) when PackTask#pack_task.type == ?ptt_deliver_goods ->
    ContentID = get_content_id(PackTask),
    ContentTplt = tplt:get_data(deliver_goods_task_tplt, ContentID),
    ContentTplt#deliver_goods_task_tplt.npc_id;
get_npc_id(PackTask) when PackTask#pack_task.type == ?ptt_collect ->
    1;
get_npc_id(_PackTask) ->
    0.

set_event_count(#pack_task{listen_event=ListenEvent, rule_id=ID, event_count=EventCount}=PackTask, Event) ->
    case ListenEvent == Event of
	true->
	    FuncTplt = tplt:get_data(function_task_tplt, ID),
	    Count = FuncTplt#function_task_tplt.event,
	    case EventCount < Count of
		true ->
		    PackTask#pack_task{event_count=EventCount+1};
		false ->
		    PackTask#pack_task{event_count=Count}
	    end;
	false ->
	    PackTask
    end.

rand_id(?ptt_dialogue) ->
    get_rand_id(dialogue_task_tplt);
rand_id(?ptt_deliver_goods) ->
    get_rand_id(deliver_goods_task_tplt);
rand_id(?ptt_find_item) ->
    get_rand_id(find_item_task_tplt);
rand_id(?ptt_collect) ->
    get_rand_id(collect_task_tplt);
rand_id(?ptt_function) ->
    get_rand_id(function_task_tplt);
rand_id(?ptt_post_reward) ->
    get_rand_id(post_reward_tplt).
    

create(?ptt_dialogue, ID, DueTime) ->
    new(?ptt_dialogue, ID, DueTime);
create(?ptt_deliver_goods, ID, DueTime) ->
    new(?ptt_deliver_goods, ID, DueTime);
create(?ptt_find_item, ID, DueTime) ->
    new(?ptt_find_item, ID, DueTime);
create(?ptt_collect, ID, DueTime) ->
    new(?ptt_collect, ID, DueTime);
create(?ptt_function, ID, DueTime) ->
    new(?ptt_function, ID, DueTime); 
create(?ptt_post_reward, _ID, DueTime) ->
    new(?ptt_post_reward, 0, DueTime).


remove(InstId, PackTasks) ->
    lists:keydelete(InstId, #pack_task.inst_id, PackTasks).

do_give(#pack_task{type=?ptt_dialogue}, HouseData) ->
    {HouseData, []};
do_give(#pack_task{type=?ptt_deliver_goods, rule_id=RuleId}, HouseData) ->
    RuleTplt = tplt:get_data(deliver_goods_task_tplt, RuleId),
    RequireItemId = RuleTplt#deliver_goods_task_tplt.require_item,
    {NHouseData, Msgs} = house_pack:add_items([{RequireItemId, 1}], HouseData),
    {NHouseData, Msgs};
do_give(#pack_task{type=?ptt_find_item}, HouseData) ->
    {HouseData, []};
do_give(#pack_task{type=?ptt_collect}, HouseData) ->
    {HouseData, []};
do_give(#pack_task{type=?ptt_function}, HouseData) ->
    {HouseData, []}.

can_complete(#pack_task{type=Type}, _HouseData) when Type == ?ptt_dialogue->
    true;
can_complete(#pack_task{type=Type, rule_id=RuleId}, HouseData) when Type == ?ptt_deliver_goods ->
    RuleTplt = tplt:get_data(deliver_goods_task_tplt, RuleId),
    RequireItemId = RuleTplt#deliver_goods_task_tplt.require_item,
    case house_pack:get_item_count_by_tempid([RequireItemId], HouseData) > 0 of
	false ->
	    {false, item_not_enough, {RequireItemId, 1}};
	_ ->
	    true
    end;
can_complete(#pack_task{type=Type}, _HouseData) when Type == ?ptt_find_item ->
    true;
can_complete(#pack_task{type=Type, rule_id=RuleId}, HouseData) when Type == ?ptt_collect ->
    RuleTplt = tplt:get_data(collect_task_tplt, RuleId),
    RequireItemId = RuleTplt#collect_task_tplt.require_item,
    RequireItemCount = RuleTplt#collect_task_tplt.require_item_count,
    SelfItemCount = house_pack:get_item_count_by_tempid([RequireItemId], HouseData),
    case SelfItemCount >= RequireItemCount of
	true ->
	    true;
	false ->
	    {false, item_not_enough, {RequireItemId, RequireItemCount-SelfItemCount}}
    end;
can_complete(#pack_task{type=Type, rule_id=ID, event_count=EventCount}, _HouseData) when Type == ?ptt_function ->
    FuncTplt = tplt:get_data(function_task_tplt, ID),
    Count = FuncTplt#function_task_tplt.count,
    case EventCount >= Count of
	true->
	    true;
	false ->
	    {false, count_not_enough}
    end.

do_complete(#pack_task{type=Type}, HouseData) when Type == ?ptt_dialogue ->
    {HouseData, []};
do_complete(#pack_task{type=Type, rule_id=RuleId}, HouseData) when Type == ?ptt_deliver_goods ->
    RuleTplt = tplt:get_data(deliver_goods_task_tplt, RuleId),
    RequireItemId = RuleTplt#deliver_goods_task_tplt.require_item,
    {NHouseData, Msgs} = house_pack:del_item_by_tempid(RequireItemId, HouseData),
    {NHouseData, Msgs};
do_complete(#pack_task{type=Type}, HouseData) when Type == ?ptt_find_item ->
    {HouseData, []};
do_complete(#pack_task{type=Type, rule_id=RuleId}, HouseData) when Type == ?ptt_collect ->
    RuleTplt = tplt:get_data(collect_task_tplt, RuleId),
    RequireItemId = RuleTplt#collect_task_tplt.require_item,
    RequireItemCount = RuleTplt#collect_task_tplt.require_item_count,
    {_, NHouseData, Msgs} = house_pack:try_del_n_by_tempid([RequireItemId], RequireItemCount, HouseData),
    {NHouseData, Msgs};
do_complete(#pack_task{type=Type}, HouseData) when Type == ?ptt_function ->
    {HouseData, []}.

%%%===================================================================
%%% Internal Func
%%%===================================================================


get_rand_id(TaskTplt) ->
    TasksTplt = tplt:get_all_data(TaskTplt),
    Task = rand(TasksTplt),
    Id = element(2, Task),
    Id.

rand(List) ->
    TotalCount = length(List),
    RandValue = rand:uniform(TotalCount),
    lists:nth(RandValue, List).

new(?ptt_function, ID, DueTime) ->
    InstId = guid:make(?st_pack_task),
    Now = datetime:localtime(),
    DueDate = datetime:add_time(Now, DueTime * 60),
    FuncTplt = tplt:get_data(function_task_tplt, ID),
    ListenEvent = binary_to_atom(FuncTplt#function_task_tplt.event, latin1),
    #pack_task{inst_id=InstId, type=?ptt_function, content_id=ID, 
	       rule_id=ID, complete_date=datetime:empty(), 
	       due_date=DueDate, is_view=?cb_false, 
	       listen_event=ListenEvent, event_count=0};
new(Type, ID, DueTime) ->
    InstId = guid:make(?st_pack_task),
    Now = datetime:localtime(),
    DueDate = datetime:add_time(Now, DueTime * 60),
    #pack_task{inst_id=InstId, type=Type, content_id=ID, 
	       rule_id=ID, complete_date=datetime:empty(), 
	       due_date=DueDate, is_view=?cb_false, 
	       listen_event=[], event_count=0}.
