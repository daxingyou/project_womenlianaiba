%%%-------------------------------------------------------------------
%%% @author  <>
%%% @copyright (C) 2010, 
%%% @doc
%%%  物品一些通用的操作
%%% @end
%%% Created :  7 Apr 2010 by  <>
%%%-------------------------------------------------------------------
-module(item).

-include("common_def.hrl").
-include("packet_def.hrl").
-include("tplt_def.hrl"). 
-include("sys_msg.hrl").
%% API
-export([make_item/1, make_item/2, new/2, new/3, new/4, get_tempid/1, get_instid/1]).
-export([get_empty/0, is_empty/1, set_item/2, get_item_name/1, is_bind/1, get_use_level/1]).
-export([get_del_time/1, has_del_time/1, overdue/1, clear_del_time/1]).

%%%===================================================================
%%% API
%%%===================================================================
%% 根据物品的模板ID生成一个物品
-spec make_item(pos_integer()) -> tuple().
make_item(ItemTempID) when is_integer(ItemTempID), ItemTempID > 0->
    new(ItemTempID, guid:make(?st_item)).

make_item(ItemTempID, PropertyList) when is_list(PropertyList)->
    new(ItemTempID, guid:make(?st_item), get_del_time(ItemTempID), PropertyList);

make_item(ItemTempID, DelTime) when is_integer(ItemTempID), ItemTempID > 0->
    new(ItemTempID, guid:make(?st_item), DelTime).

new(TemplateID, InstID)->
    new(TemplateID, InstID, get_del_time(TemplateID)).
new(TemplateID, InstID, DelTime)->
    #item{template_id = TemplateID, instance_id=InstID, 
	  del_time=DelTime}.
new(TemplateID, InstID, DelTime, PropertyList)->
    #item{template_id = TemplateID, instance_id=InstID, 
	  del_time=DelTime, property=PropertyList}.


%% 获得物品的ID
-spec get_tempid(tuple()) -> non_neg_integer().
get_tempid(#item{template_id=TempID}) ->
    TempID;
get_tempid(Items) when is_list(Items) ->
    [get_tempid(Item)||Item<-Items].

%% 获取物品实例Id
-spec get_instid(tuple()) -> non_neg_integer().
get_instid(#item{instance_id=InstID}) ->
    InstID.

%% 设置物品
-spec set_item(integer(), integer()) -> tuple().
set_item(InstId, TempId) when is_integer(InstId), is_integer(TempId) ->
    #item{template_id=TempId, instance_id=InstId}.

%% 获得空的物品
-spec get_empty() -> tuple().
get_empty() ->
    #item{template_id=0, instance_id=0}.

%% 物品是否为空
-spec is_empty(tuple()) -> true | false.
is_empty(#item{instance_id=0, template_id=0})->
    true;
is_empty(Item) when is_record(Item, item)->
    false;
is_empty(Item) ->
    erlang:error({badarg, Item}).


%% 取物品名称
get_item_name(#item{template_id=TpltID}) -> 
    get_item_name(TpltID);
get_item_name(ItemTpltID) when is_integer(ItemTpltID) -> 
    #item_tplt{name=ItemName} = tplt:get_data(item_tplt, ItemTpltID),
    binary_to_list(ItemName).

%% 是否是绑定物品
is_bind(#item{template_id=TempId}) ->
    is_bind(TempId);
is_bind(TempId) ->
    #item_tplt{bind=Bind} = tplt:get_data(item_tplt, TempId),
    Bind =:= 1.

%% 获取使用等级
get_use_level(TempId) ->
    #item_tplt{use_level=UseLevel} = tplt:get_data(item_tplt, TempId),
    UseLevel.

%% %% 设置到期时间
%% set_del_time(Item, DelTime) ->
%%     Item#item{del_time=DelTime}.
%% 取到期时间
get_del_time(#item{del_time=DelTime}) ->
    DelTime;
get_del_time(ItemTemplateID) when is_integer(ItemTemplateID) ->
    TemplateID = ItemTemplateID,
    #item_tplt{effect_time_id=EffectTimeID} = tplt:get_data2(item_tplt, TemplateID),
    case EffectTimeID =/= 0 of
	true ->
	    #item_effect_time_tplt{type=Type,
			      effect_time=NTime,
			      del_time=YYYYMMDD}
		= tplt:get_data2(item_effect_time_tplt, EffectTimeID),
	    case Type of
		1 -> %% 1表示倒计时时效(单位:天)
		    NDay = NTime,
		    Now = datetime:local_time(),

		    %% 规定多少秒代表一天
		    %%ItemEffectTimeUnit = 24 * 60 * 60,
		    ItemEffectTimeUnit = common_def:get_val(seconds_of_a_day),
		    {{Y, M, D}, {H, N, S}} = datetime:add_time(Now, NDay * ItemEffectTimeUnit),
		    datetime:make_time(Y, M, D, H, N, S);
		2 -> %% 2表示时间段
		    Day = YYYYMMDD rem 100,
		    YYYYMM = YYYYMMDD div 100,
		    Month = YYYYMM rem 100,
		    Year = YYYYMM div 100,
		    datetime:make_time(Year, Month, Day, 0, 0, 0);
		3 -> %% 3表示倒计时时效(单位:分钟)
		    Now = datetime:local_time(),
		    NMinute = NTime,
		    {{Y, M, D}, {H, N, S}} = datetime:add_time(Now, NMinute * 60),
		    datetime:make_time(Y, M, D, H, N, S)
	    end;	
	_ ->
	    datetime:make_time(0, 0, 0, 0, 0, 0)
    end.

%% 判断物品是否有时效
has_del_time(#item{del_time=DelTime}) ->
    has_del_time(DelTime);
has_del_time(#stime{year=0}) ->
    false;
has_del_time(#stime{}) ->
    true.

clear_del_time(Item) ->
    DelTime = #stime{year=0, month=0, day=0, hour=0, minute=0, second=0},
    Item#item{del_time=DelTime}.

%% 判断是否已经过期
overdue(#item{del_time=STime}=Item) ->
    Now = datetime:local_time(),

    #stime{year=Y, month=M, day=D, 
	   hour=H, minute=N, second=S} = STime,
    DelTime = {{Y, M, D}, {H, N, S}},
    case has_del_time(Item) of
	true ->
	    DelTime < Now;
	_ -> %% 物品无时效属性 
	    false
    end;
overdue(Items) when is_list(Items) ->
    lists:foldl(fun(Item, OverdueItems) ->
			case overdue(Item) of
			    true ->
				[Item | OverdueItems];
			    false ->
				OverdueItems
			end
		end, [], Items).


-ifdef(TEST).
-include_lib("eunit/include/eunit.hrl").

get_tempid_test() ->
    ?assertEqual([1, 2], get_tempid([#item{instance_id=0, template_id=1}, #item{instance_id=0, template_id=2}])),
    ?assertEqual(1, get_tempid(#item{instance_id=0, template_id=1})).
    
-endif.
