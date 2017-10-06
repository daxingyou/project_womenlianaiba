%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% 智力考验
%%% @end
%%% Created : 18 Sep 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(mind_quiz).

-include("packet_def.hrl"). 
-include("enum_def.hrl").
-include("router.hrl").
-include("tplt_def.hrl").
-include("sys_msg.hrl").
-include("player_data.hrl").
-include("common_def.hrl").
-include("resource.hrl").
-include("records.hrl").
 
-record(player_mind_quiz, {account,
			   count,
			   datetime,
			   love_coin_count}).

-export([start/1, init/1, handle_cast/2]).

-export([start_mind_quiz/2, reward/2]).

-define(MindQuizCount, 3).
-define(LoveCoinCount, 7).
-define(NeedLoveCoin, 30).

%%%===================================================================
%%% API
%%%===================================================================
start(Account) ->
    [router:make_event_source(?msg_req_mind_quiz_count, Account, {self(), ?MODULE}),
     router:make_event_source(?msg_req_start_mind_quiz, Account, {self(), ?MODULE}),
     router:make_event_source(?msg_req_mind_quiz_reward, Account, {self(), ?MODULE})
    ].

init(Account) ->
    PlayerMindQuiz = get_player_mind_quiz(Account),
    MindQuizDate = PlayerMindQuiz#player_mind_quiz.datetime,
    Now = datetime:localtime(),
    case datetime:diff_date(MindQuizDate, Now) > 0 of
	true ->
	    NPlayerMindQuiz = PlayerMindQuiz#player_mind_quiz{count=?MindQuizCount, datetime=Now, love_coin_count=?LoveCoinCount},
	    db:dirty_write(NPlayerMindQuiz);
	false ->
	    ok
    end.

%%%===================================================================
%%% Handle Cast
%%%===================================================================
handle_cast({#msg{src=Account}, #req_mind_quiz_count{}}, State) ->
    PlayerMindQuiz = get_player_mind_quiz(Account),
    Count = PlayerMindQuiz#player_mind_quiz.count,
    LoveCoinCount = PlayerMindQuiz#player_mind_quiz.love_coin_count,
    net_helper:send2client(Account, #notify_mind_quiz_count{count=Count, love_coin_count=LoveCoinCount}),
    {noreply, State};
handle_cast({#msg{src=Account}, #req_start_mind_quiz{}}, State) ->
    NState = start_mind_quiz(Account, State),
    {noreply, NState};
handle_cast({#msg{src=Account}, #req_mind_quiz_reward{level=Level}}, State) ->
    Rewards = State#player_data.mind_quiz_rewards,
    IsStart = State#player_data.is_start_mind_quiz,
    RewardsLength = length(Rewards),
    NState = 
	%% case RewardsLength + 1 == Level of %% 领取奖励必须一级一级往上领
	%%     true ->
		case RewardsLength > 10 of %% 一次闯关不能大于10关
		    true ->
			State#player_data{is_start_mind_quiz=false};
		    false ->
			case IsStart == true of
			    true ->
				case lists:member(Level, Rewards) of
				    true->
					State;
				    false ->
					reward(Account, Level),
					State#player_data{mind_quiz_rewards=[Level|Rewards]}
				end;
			    false ->
				State
			end
		end,
	%%     false ->
	%% 	State#player_data{is_start_mind_quiz=false}
	%% end,

    {noreply, NState}.

%%%===================================================================
%%% Internal Func
%%%===================================================================
start_mind_quiz(Account, State) ->
    PlayerMindQuiz = get_player_mind_quiz(Account),
    Count = PlayerMindQuiz#player_mind_quiz.count,
    LoveCoinCount = PlayerMindQuiz#player_mind_quiz.love_coin_count,
    case Count > 0 of
	true ->
	    NPlayerMindQuiz = PlayerMindQuiz#player_mind_quiz{count = Count-1},
	    db:dirty_write(NPlayerMindQuiz),
	    router:cast(Account, on_start_mind_quiz, Account),
	    net_helper:send2client(Account, #notify_start_mind_quiz{result=?cb_true}),
	    State#player_data{mind_quiz_rewards=[], is_start_mind_quiz=true};
	false ->
	    case LoveCoinCount > 0 of
		true ->
		    ShipCallback = 
			fun(#order{status=Status}=_Order)-> 			   
				case (Status =:= ?order_payed) of
				    true ->
					NPlayerMindQuiz = PlayerMindQuiz#player_mind_quiz{love_coin_count = LoveCoinCount-1},
					db:dirty_write(NPlayerMindQuiz),
					router:cast(Account, on_start_mind_quiz, Account),
					net_helper:send2client(Account, #notify_start_mind_quiz{result=?cb_true}),
					?pay_shipped;
				    _ ->
					net_helper:send2client(Account, #notify_start_mind_quiz{result=?cb_false}),
					?pay_error
				end				       
			end,
		    Ret = player_love_coin:pay([{0, 1, ?NeedLoveCoin}], ShipCallback, ?order_goods_meta_mind_quiz, State),
		    case Ret of     
			?pay_shipped ->
			    State#player_data{mind_quiz_rewards=[], is_start_mind_quiz=true};
			?pay_error ->
			    State#player_data{mind_quiz_rewards=[], is_start_mind_quiz=false}
		    end;
		false ->
		    sys_msg:send(Account, ?mind_quiz_count),
		    net_helper:send2client(Account, #notify_start_mind_quiz{result=?cb_false}),
		    State#player_data{mind_quiz_rewards=[], is_start_mind_quiz=false}
	    end
    end.  

reward(Account, Level) ->
    F = fun() ->
		[PlayerBasicData] = db:read(player_basic_data, Account),
		HouseId = player_basic_data:get_house_id(PlayerBasicData),
		[HouseData] = db:read(house_data, HouseId),
		MindQuizTplt = tplt:get_data(mind_quiz_tplt, Level),
		CanRewardItems = rand:uniform(100) =< MindQuizTplt#mind_quiz_tplt.reward_items_probability,
		{NHouseData, AddItemMsgs} = 
		case CanRewardItems of
		    true ->
			reward_item(MindQuizTplt, HouseData);
		    false ->
			{HouseData, []}
		end,
		{NPlayerBasicData, NNHouseData, AddExpMsgs} = reward_exp(MindQuizTplt, PlayerBasicData, NHouseData),
		NNNHouseData = reward_diamond(MindQuizTplt, NNHouseData),
		db:write(NPlayerBasicData),
		db:write(NNNHouseData),
		{true, AddItemMsgs ++ AddExpMsgs, MindQuizTplt, NNNHouseData, CanRewardItems}
	end,
    case db:transaction(F) of
	{true, Msgs, MindTplt, NNNHouseData, CanRewardItems} ->
	    RewardItems = MindTplt#mind_quiz_tplt.reward_items,
	    RewardItemsCount = MindTplt#mind_quiz_tplt.reward_items_count,
	    case CanRewardItems == true of
		true ->
		    CombineItems = recombine_reward_items(RewardItems, RewardItemsCount, []),
		    ItemsMsg = 
			lists:foldl(fun({Item, Count}, Items) ->
					    item:get_item_name(Item) ++ "X" ++ integer_to_list(Count) ++ " " ++ Items
				    end, [], CombineItems),
		    sys_msg:send(Account, ?msg_maind_quiz_get_item, [ItemsMsg]);
		false ->
		    ok
	    end,
	    house_diamond:notify(NNNHouseData),
	    [net_helper:send2client(Account, Msg) || Msg <- Msgs]
    end.

reward_item(MindQuizTplt, HouseData) ->
    RewardItems = MindQuizTplt#mind_quiz_tplt.reward_items,
    RewardItemsCount = MindQuizTplt#mind_quiz_tplt.reward_items_count,
    Rewards = recombine_reward_items(RewardItems, RewardItemsCount, []),
    house_pack:add_items(Rewards, HouseData).

reward_exp(MindQuizTplt, PlayerBasicData, HouseData) ->
    RewardExp = MindQuizTplt#mind_quiz_tplt.reward_exp,
    house_level_exp:add_exp(RewardExp, PlayerBasicData, HouseData).

reward_diamond(MindQuizTplt, HouseData) ->
    RewardDiamond = MindQuizTplt#mind_quiz_tplt.reward_diamond,
    house_diamond:add_diamond(RewardDiamond, HouseData).
    
recombine_reward_items([], [], RewardItems) ->
    RewardItems;
recombine_reward_items([0], [0], RewardItems) ->
    RewardItems;
recombine_reward_items([RewardItem|RewardItems], [RewardItemCount|RewardItemsCount], NRewardItems) ->
    RewardItems1 = {RewardItem, RewardItemCount},
    recombine_reward_items(RewardItems, RewardItemsCount, [RewardItems1|NRewardItems]).

get_player_mind_quiz(Account) ->
        case db:dirty_read(player_mind_quiz, Account) of
	[] ->
	    PlayerMindQuiz = #player_mind_quiz{account=Account, count=?MindQuizCount, 
					       datetime=datetime:localtime(), love_coin_count=?LoveCoinCount},
	    PlayerMindQuiz;
	[Mind] ->
	    Mind
    end.
