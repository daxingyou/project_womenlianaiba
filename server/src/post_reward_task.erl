%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% ĞüÉÍÈÎÎñ
%%% @end
%%% Created :  6 Sep 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(post_reward_task).

-export([]).

-include("tplt_def.hrl").
-include("packet_def.hrl").
-include("enum_def.hrl").
-include("router.hrl").
-include("sys_msg.hrl").

-export([start/1, open_post_reward_ui/1, handle_cast/2]).

%% -export([get_daily_post_reward/1, complete/1]).

-record(daily_post_reward, {
	  id,
	  content,
	  require_items,
	  reward_items,
	  reward_diamond,
	  reward_exp,
	  date
	 }).

%%%===================================================================
%%% API
%%%===================================================================
start(Account) ->
    [router:make_event_source(?msg_req_open_post_reward_ui, Account, {self(), ?MODULE}),
     router:make_event_source(?msg_req_complete_post_reward, Account, {self(), ?MODULE})
    ].

open_post_reward_ui(Account) ->
    DailyPostReward = get_daily_post_reward(1),
    Packet = #notify_open_post_reward_ui{content=DailyPostReward#daily_post_reward.content,
					 require_items=lists:reverse(lists:foldl(fun({ItemId, Count, Content}, RequireItems) ->
									   [#require_item_atom{item_id=ItemId, 
											       item_count=Count,
											       content=Content}|RequireItems]
										 end, [], DailyPostReward#daily_post_reward.require_items)),
					 reward_items=lists:foldl(fun({ItemId, Count}, RewardItems) ->
									  [#reward_item_atom{item_id=ItemId, 
											     item_count=Count}|RewardItems]
								  end, [], DailyPostReward#daily_post_reward.reward_items),
					 reward_diamond=DailyPostReward#daily_post_reward.reward_diamond,
					 reward_exp=DailyPostReward#daily_post_reward.reward_exp
					},
    net_helper:send2client(Account, Packet).

%%%===================================================================
%%% Handle Cast
%%%===================================================================
handle_cast({#msg{src=Account}, #req_open_post_reward_ui{}}, State) ->
    open_post_reward_ui(Account),
    {noreply, State};
handle_cast({#msg{src=Account}, #req_complete_post_reward{}}, State) ->
    complete(Account),
    {noreply, State}.

%%%===================================================================
%%% Internal Func
%%%===================================================================
complete(Account) ->
    F = fun() ->
		DailyPostReward = get_daily_post_reward(1),
		[PlayerBasicData] = db:read(player_basic_data, Account),
		HouseId = player_basic_data:get_house_id(PlayerBasicData),
		[HouseData] = db:read(house_data, HouseId),
		case can_complete(DailyPostReward, HouseData) of
		    true ->
			do_complete(DailyPostReward, PlayerBasicData, HouseData);
		    {false, Errors} ->
			{false, Errors}
		end
	end,
    case db:transaction(F) of
	{true, DelItemMsgs, Msgs, NHouseData} ->
	    house_pack:send_msgs(DelItemMsgs, NHouseData),
	    house_diamond:notify(NHouseData),
	    [net_helper:send2client(Account, Msg) || Msg <- Msgs],
	    net_helper:send2client(Account, #notify_complete_post_reward{result=?cprt_ok});
	{false, _Errors} ->
	    sys_msg:send(Account, ?err_item_count_not_enough),
	    net_helper:send2client(Account, #notify_complete_post_reward{result=?cprt_fail})
    end.

can_complete(DailyPostReward, HouseData) ->
    RequireItems = DailyPostReward#daily_post_reward.require_items,
    Errors = 
	lists:foldl(fun({TempId, Count, _Describe}, Err) ->
			    ItemCount = house_pack:get_item_count_by_tempid([TempId], HouseData),
			    case ItemCount >= Count of
				true ->
				    Err;
				false ->
				    [{TempId, Count-ItemCount} | Err]
			    end
		    end, [], RequireItems),
    case length(Errors) > 0 of
	true ->
	    {false, Errors};
	false ->
	    true
    end.

do_complete(DailyPostReward, PlayerBasicData, HouseData) ->
    RequireItems = DailyPostReward#daily_post_reward.require_items,
    RewardItems = DailyPostReward#daily_post_reward.reward_items,
    RewardDiamond = DailyPostReward#daily_post_reward.reward_diamond,
    RewardExp = DailyPostReward#daily_post_reward.reward_exp,
    {NHouseData, DelItemMsgs} = lists:foldl(fun({TempId, Count, _Describe}, {HouseData1, Msgs1}) ->
						    {_, HouseData2, Msgs2} = house_pack:try_del_n_by_tempid([TempId], 
													    Count, 
													    HouseData1),
						    {HouseData2, Msgs1 ++ Msgs2}
					    end, {HouseData, []}, RequireItems),
    {NNHouseData, AddItemMsgs} = house_pack:add_items(RewardItems, NHouseData),
    NNNHouseData = house_diamond:add_diamond(RewardDiamond, NNHouseData),
    {NPlayerBasicData, NNNNHouseData, AddExpMsgs} = house_level_exp:add_exp(RewardExp, PlayerBasicData, NNNHouseData),
    db:write(NPlayerBasicData),
    db:write(NNNNHouseData),
    {true, DelItemMsgs, AddItemMsgs ++ AddExpMsgs, NNNNHouseData}.

get_daily_post_reward(Id) ->
    F = fun() ->
		case db:read(daily_post_reward, Id) of
		    [] ->
			DailyPostReward = create_daily_post_reward(Id),
			db:write(DailyPostReward),
			DailyPostReward;
		    [DailyPostReward] ->
			Today = datetime:localtime(),
			PostDate = DailyPostReward#daily_post_reward.date,
			case datetime:diff_date(PostDate, Today) > 0 of
			    true ->
				NDailyPostReward = create_daily_post_reward(Id),
				db:write(NDailyPostReward),
				NDailyPostReward;
			    false ->
				DailyPostReward
			end
		end
	end,
    db:transaction(F).

create_daily_post_reward(Id) ->
    PostRewardsTplt = tplt:get_all_data(post_reward_task_tplt),
    PostRewardTplt = get_post_reward_tplt(PostRewardsTplt),
    Content = PostRewardTplt#post_reward_task_tplt.content,
    RequireItem1 = PostRewardTplt#post_reward_task_tplt.require_item1,
    RequireItem1Count = PostRewardTplt#post_reward_task_tplt.require_item1_count,
    RequireItem1Content = PostRewardTplt#post_reward_task_tplt.require_item1_content,
    RequireItem2 = PostRewardTplt#post_reward_task_tplt.require_item2,
    RequireItem2Count = PostRewardTplt#post_reward_task_tplt.require_item2_count,
    RequireItem2Content = PostRewardTplt#post_reward_task_tplt.require_item2_content,
    RequireItem3 = PostRewardTplt#post_reward_task_tplt.require_item3,
    RequireItem3Count = PostRewardTplt#post_reward_task_tplt.require_item3_count,
    RequireItem3Content = PostRewardTplt#post_reward_task_tplt.require_item3_content,
    RewardItems = PostRewardTplt#post_reward_task_tplt.reward_items,
    RewardItemsCount = PostRewardTplt#post_reward_task_tplt.reward_items_count,
    RewardDiamond = PostRewardTplt#post_reward_task_tplt.reward_diamond,
    RewardExp = PostRewardTplt#post_reward_task_tplt.reward_exp,
    %% Content = get_element_value(#post_reward_task_tplt.content, PostRewardsTplt),
    %% {RequireItem1, RequireItem1Count, RequireItem1Content} = get_element_value(#post_reward_task_tplt.require_item1, 
    %% 									       #post_reward_task_tplt.require_item1_count, 
    %% 									       #post_reward_task_tplt.require_item1_content,
    %% 									       PostRewardsTplt),
    %% {RequireItem2, RequireItem2Count, RequireItem2Content} = get_element_value(#post_reward_task_tplt.require_item2,
    %% 									       #post_reward_task_tplt.require_item2_count,
    %% 									       #post_reward_task_tplt.require_item2_content,
    %% 									       PostRewardsTplt),
    %% {RequireItem3, RequireItem3Count, RequireItem3Content} = get_element_value(#post_reward_task_tplt.require_item3,
    %% 									       #post_reward_task_tplt.require_item3_count,
    %% 									       #post_reward_task_tplt.require_item3_content,
    %% 									       PostRewardsTplt),
    %% {RewardItems, RewardItemsCount} = get_element_value(#post_reward_task_tplt.reward_items,
    %% 							#post_reward_task_tplt.reward_items_count,
    %% 							PostRewardsTplt),
    %% RewardDiamond = get_element_value(#post_reward_task_tplt.reward_diamond, PostRewardsTplt),
    %% RewardExp = get_element_value(#post_reward_task_tplt.reward_exp, PostRewardsTplt),
    #daily_post_reward{id=Id, 
		       content=Content, 
		       require_items=[{RequireItem1, RequireItem1Count, RequireItem1Content},
				      {RequireItem2, RequireItem2Count, RequireItem2Content},
				      {RequireItem3, RequireItem3Count, RequireItem3Content}],
		       reward_items=recombine_reward_items(RewardItems, RewardItemsCount, []),
		       reward_diamond=RewardDiamond,
		       reward_exp=RewardExp,
		       date=datetime:localtime()}.

recombine_reward_items([], [], NRewardItems) ->
    NRewardItems;
recombine_reward_items([0|RewardItems], [0|RewardItemsCount], NRewardItems) ->
    recombine_reward_items(RewardItems, RewardItemsCount, NRewardItems);
recombine_reward_items([RewardItem|RewardItems], [RewardItemCount|RewardItemsCount], NRewardItems) ->
    RewardItems1 = {RewardItem, RewardItemCount},
    recombine_reward_items(RewardItems, RewardItemsCount, [RewardItems1|NRewardItems]).

%% get_element_value(ElementIndex, PostRewardsTplt) ->

%%     get_post_reward_tplt_element(ElementIndex, PostRewardTplt).

%% get_element_value(ItemElementIndex, CountElementIndex, PostRewardsTplt) ->
%%     PostRewardTplt = get_post_reward_tplt(PostRewardsTplt),
%%     RequireItem = get_post_reward_tplt_element(ItemElementIndex, PostRewardTplt),
%%     RequireItemCount = get_post_reward_tplt_element(CountElementIndex, PostRewardTplt),
%%     {RequireItem, RequireItemCount}.

%% get_element_value(ItemElementIndex, CountElementIndex, ContentElementIndex, PostRewardsTplt) ->
%%     PostRewardTplt = get_post_reward_tplt(PostRewardsTplt),
%%     RequireItem = get_post_reward_tplt_element(ItemElementIndex, PostRewardTplt),
%%     RequireItemCount = get_post_reward_tplt_element(CountElementIndex, PostRewardTplt),
%%     RequireItemContent = get_post_reward_tplt_element(ContentElementIndex, PostRewardTplt),
%%     {RequireItem, RequireItemCount, RequireItemContent}.
        
%% get_post_reward_tplt_element(ElementId, PostRewardTplt) ->
%%     element(ElementId, PostRewardTplt).
    

get_post_reward_tplt(PostRewardsTplt) ->
    TotalCount = length(PostRewardsTplt),
    RandValue = rand:uniform(TotalCount),
    lists:nth(RandValue, PostRewardsTplt).


	     %% {string, content},
	     %% {int, require_item1},
	     %% {int, require_item1_count},
	     %% {int, require_item2},
	     %% {int, require_item2_count},
	     %% {int, require_item3},
	     %% {int, require_item3_count},
	     %% {list_int, reward_items},
	     %% {list_int, reward_items_count},
	     %% {int, reward_diamond},
	     %% {int, reward_exp}
