%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%   每日活跃奖励
%%% @end
%%% Created :  7 Sep 2012 by hongjx <hongjx@35info.cn>

-module(daily_active_reward).

-include("packet_def.hrl").
-include("tplt_def.hrl").
-include("sys_msg.hrl").
-include("resource.hrl").
-include("records.hrl").
-include("common_def.hrl").

%%-compile(export_all).

-export([start/1, handle_cast/2]).
-export([add_score/3, inc_at/4, notify/1, do_event/3]).

-record(daily_active_reward, 
	 {account, 
	  date, 
	  progress_list=[],
	  has_reward_list=[]}).

start(Account) ->
    [
     router:make_event_source(?msg_req_daily_reward_ui, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_immediate_complete_daily_reward, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_daily_reward, Account, {Account, ?MODULE})
    ].

%%%===================================================================
%%% api
%%%===================================================================
do_event(Account, Event, _Value) ->
    Level = get_level(Account),
    L = get_all_active_list(Level),
    Key = list_to_binary(atom_to_list(Event)),
    case find_event(Key, L) of
	#daily_active_tplt{id=ID} ->
	    case is_self_event(Event) of
		false ->
		    case db_pair_player:get_lover(Account) of
			Lover when is_atom(Lover) and (Lover /= '') ->
			    add_score(Lover, ID, Level);
			_ ->
			    ok
		    end;
		_ ->
		    ok		    
	    end,
	    add_score(Account, ID, Level);
	_ ->
	    ok
    end.

notify(Account) ->
    Level = get_level(Account),
    R = db:transaction(fun() -> read_daily_reward(Account, Level) end),
    notify_can_reward(Account, Level, R).

add_score(Account, Idx, Level) when is_integer(Idx), is_atom(Account) ->
    #daily_active_tplt{add_score=Gain, max_score=Max} = 
	get_active_tplt(Idx, Level),
    Level = get_level(Account),
    F = fun() ->
		R = read_daily_reward(Account, Level),
		#daily_active_reward{progress_list=PList} = R,
		NewList = inc_at(Idx, Gain, PList, Max),
		NewR = R#daily_active_reward{progress_list=NewList},
		db:write(NewR),
		notify_can_reward(Account, Level, NewR)
	end,
    db:transaction(F).

    

%%%===================================================================
%%% handle_cast
%%%===================================================================
handle_cast({_Msg, 
	     #req_immediate_complete_daily_reward{index=Index}}, PlayerData) ->
    Account = player_data:get_account(PlayerData),
    Level = get_level(Account),
    immediate_complete(Account, Index, Level, PlayerData), 
    {noreply, PlayerData};
handle_cast({_Msg, 
	     #req_daily_reward_ui{}}, PlayerData) ->

    Account = player_data:get_account(PlayerData),
    Level = get_level(Account),
    R = db:transaction(fun() -> read_daily_reward(Account, Level) end),
    notify(Account, Level, R),

    %%router:cast(Account, on_open_daily_reward_ui, []),
    {noreply, PlayerData};


handle_cast({_Msg, 
	     #req_daily_reward{score=Score}}, PlayerData) ->

    Account = player_data:get_account(PlayerData),
    Level = get_level(Account),
    case db:transaction(fun() -> do_reward(Account, Score, Level) end) of
	{false, Err} ->
	    sys_msg:send(Account, Err);
	{ok, NNHouseData, Msgs, DailyReward, LevelMsgs, Items} ->
	    notify(Account, Level, DailyReward),	    
	    %%notify_can_reward(Account, DailyReward),
	    party_coin:send2client(Account),
	    [begin
		 ItemName = item:get_item_name(ItemID),
		 sys_msg:send(Account, ?msg_daily_active_reward_gain_item, 
			      [ItemName, integer_to_list(ItemCount)]) 
	     end || {ItemID, ItemCount} <- Items],
	    house_level_exp:send_msgs(LevelMsgs, NNHouseData),
	    house_pack:send_msgs(Msgs, NNHouseData),
	    house_diamond:notify(NNHouseData),
	    router:cast(Account, on_daily_active_reward, Account);
	{ok, DailyReward} ->
	    notify(Account, Level, DailyReward)
	    %%notify_can_reward(Account, DailyReward)
    end,
    {noreply, PlayerData}.


%%%===================================================================
%%% Internal functions
%%%===================================================================
read_daily_reward(Account, Level) when is_atom(Account) ->
    L = get_all_active_list(Level),
    read_daily_reward(Account, datetime:date(), length(L)).

read_daily_reward(Account, Today, DefLen) when is_atom(Account) ->
    case db:read(daily_active_reward, Account) of
	 [#daily_active_reward{date=Today}=R] ->
	    R;
	_ ->
	    #daily_active_reward{progress_list=[0 || _ <- lists:seq(1, DefLen)], 
				 has_reward_list=[],
				 date=Today, 
				 account=Account}
    end.


do_reward(Account, Score, Level) when is_atom(Account) ->
    DailyReward = read_daily_reward(Account, Level),
    #daily_active_reward{progress_list=PList, 
		  has_reward_list=RList} = DailyReward,

    case lists:member(Score, RList) of
	true ->  %% 领过
	    {ok, DailyReward};
	_ ->
	    %% 分数是否足够
	    Total = lists:sum(PList),
	    case Total >= Score of
		true ->
		    #daily_active_score_tplt{diamond=Money, 
					     exp=Exp,
					     point=Point,
					     reward_items=ItemIDs, 
					     reward_items_count=ItemCounts
					    } = get_score_tplt(Score, Level),

		    Items = case ItemIDs of
				[0] ->
				    [];
				_ ->
				    lists:zip(ItemIDs, ItemCounts)
			    end,
		    
		    [BasicData] = db:read(player_basic_data, Account),
		    
		    HouseID = player_basic_data:get_house_id(BasicData),
		    [HouseData] = db:read(house_data, HouseID),
		    {NHouseData, Msgs} = house_pack:add_items(Items, HouseData),
		    NNHouseData =
			case Money > 0 of
			    true ->
				HouseData0 = house_diamond:add_diamond(Money, NHouseData),
				HouseData0;
			    _ ->
				NHouseData
			end,
		    case Point >= 0 of
			true ->
			    party_coin:add(Account, Point);
			false ->
			    ok
		    end,
		    NDailyReward = DailyReward#daily_active_reward{has_reward_list=RList ++ [Score]},
		    db:write(NNHouseData),
		    {_NBasicData, NNNHouseData, LevelMsgs} = 
			house_level_exp:add_exp(Exp, BasicData, NNHouseData),

		    db:write(NDailyReward),


		    {ok, NNNHouseData, Msgs, NDailyReward, LevelMsgs, Items};
		_ ->
		    {false, ?err_daily_score_not_enough}
	    end
    end.
    
notify(Account, Level, #daily_active_reward{progress_list=PList, 
		  has_reward_list=RList}) ->
    ScoreList = get_all_score_list(Level),

    Packet = #notify_daily_reward_ui{progress_list=PList, 
				     has_reward_list=RList,
				    reward_score_list=ScoreList},

    net_helper:send2client(Account, Packet).


notify_can_reward(Account, Level, #daily_active_reward{progress_list=NewList,  has_reward_list=RList}) ->
    Total = lists:sum(NewList),
    L = get_all_score_list(Level) -- RList,
    case lists:any(fun(X) -> X =< Total end, L) of
	true ->
	    %% 通知客户端可领奖
	    net_helper:send2client(Account, #notify_daily_active_can_reward{});
	_ ->
	    ok
    end.		
    

inc_at(Idx, AddVal, List, Max) ->
    {A, B} = lists:split(Idx - 1, List),
    [Old | Tail] = B,
    N = Old + AddVal,
    NewVal =
	case N > Max of
	    true -> 
		Max;
	    _ ->
		N
	end,
    A ++ [NewVal | Tail].

%% lists:keyfind(Key, #daily_active_tplt.event, L) 
find_event(_BinEvent, []) ->
    false;
find_event(BinEvent, [#daily_active_tplt{event=EventList}=H | Tail]) 
  when is_binary(BinEvent) ->
    case lists:member(BinEvent, EventList) of
	true ->
	    H;
	_ ->
	    find_event(BinEvent, Tail)
    end.

is_self_event(EventList) when is_list(EventList) ->
    %% 判断第一个就可以了
    is_self_event(hd(EventList));
is_self_event(BinEvent) when is_binary(BinEvent) ->
    is_self_event(list_to_atom(binary_to_list(BinEvent)));
is_self_event(chat_world_event) ->
    true;
is_self_event(polymorph_event) ->
    true;
is_self_event(Event) when is_atom(Event) ->
    S = atom_to_list(Event),
    string:str(S, "enter_house_from") == 1.

do_add_score_1(Account, Level, Index, AddScore, Max) ->
    R = read_daily_reward(Account, Level),
    #daily_active_reward{progress_list=PList} = R,
    NewList = inc_at(Index, AddScore, PList, Max),
    NewR = R#daily_active_reward{progress_list=NewList},
    db:write(NewR),
    F = fun() ->
		notify(Account, Level, NewR),
		notify_can_reward(Account, Level, NewR)
	end,
    [F].

do_add_score_2(Account, Level, Index, AddScore, Max, EventList) ->
    L = do_add_score_1(Account, Level, Index, AddScore, Max),
    case is_self_event(EventList) of
	false ->
	    case db_pair_player:get_lover(Account) of
		Lover when is_atom(Lover) and (Lover /= '') ->
		    L ++ do_add_score_1(Lover, Level, Index, AddScore, Max);
		_ ->
		    L
	    end;
	_ ->
	    L
    end.

get_old_score(Account, Index, Level) ->
    R0 = db:transaction(fun() -> read_daily_reward(Account, Level) end),
    #daily_active_reward{progress_list=PList0} = R0,
    lists:nth(Index, PList0).    

%% 立即完成
immediate_complete(Account, Index, Level, PlayerData) ->
    #daily_active_tplt{max_score=Max, event=EventList} = get_active_tplt(Index, Level),
    Level = get_level(Account),
    LoginType = player_data:get_login_type(PlayerData),
    AddScore = Max - get_old_score(Account, Index, Level),
    QCoin = util:get_price(AddScore, LoginType),
    
    case AddScore > 0 of
	false ->
	    sys_msg:send(Account, ?msg_ring_task_task_has_complete);
	_ ->
	    F = fun() ->
			FnList = do_add_score_2(Account, Level, Index, AddScore, Max, EventList),
			{ok, FnList}
		end,
	    
	    case common_def:get_val(test_qq_buy) /= 0 of
		true ->
		    case db:transaction(F) of
			{ok, FunList} ->
			    [Fn() || Fn <- FunList]
		    end;
		_ ->
		    ShipCallback = 
			fun(#order{status=Status}=_Order)-> 			   
				case (Status =:= ?order_payed) of
				    true ->
					case db:transaction(F) of
					    {ok, FunList} ->
						[Fn() || Fn <- FunList],
						?pay_shipped;
					    _Reason ->
						?pay_error
					end;
				    _ ->
					?pay_error
				end				       
			end,

		    player_love_coin:pay([{Index, 1, QCoin}], 
				   ShipCallback, 
				   ?order_goods_meta_food_stock, PlayerData)
	    end
    end.


get_level(Account) when is_atom(Account) ->
    1.
    %% [BasicData] = db:dirty_read(player_basic_data, Account),
    %% HouseID = player_basic_data:get_house_id(BasicData),
    %% [HouseData] = db:dirty_read(house_data, HouseID),
    %% house_level_exp:get_level(HouseData).


%%%===================================================================
%%% 根据玩家等级，取数据(整合不同的xml)
%%%===================================================================
get_active_tplt(Idx, Level) ->
    case Level =< common_def:get_val(daily_active_spilt_level) of
	true ->
	    tplt:get_data(daily_active_tplt, Idx);
	_ ->
	    X = tplt:get_data(daily_active_tplt, Idx),
	    setelement(1, X, daily_active_tplt)	    
    end.

get_score_tplt(Score, Level) ->
    case Level =< common_def:get_val(daily_active_spilt_level) of
	true ->
	    tplt:get_data(daily_active_score_tplt, Score);
	_ ->
	    X = tplt:get_data(daily_active_score_tplt_1, Score),
	    setelement(1, X, daily_active_score_tplt)	    
    end.

get_all_active_list(Level) ->
    case Level =< common_def:get_val(daily_active_spilt_level) of
	true ->
	    tplt:get_all_data(daily_active_tplt);
	_ ->
	    [setelement(1, X, daily_active_tplt) || 
		X <- tplt:get_all_data(daily_active_tplt_1)]
    end.

get_all_score_list(Level) ->
    case Level =< common_def:get_val(daily_active_spilt_level) of
	true ->
	    [begin 
		 #daily_active_score_tplt{score=S} = X,
		 S 
	     end || X <- tplt:get_all_data(daily_active_score_tplt)];
	_ ->
	    [begin 
		 #daily_active_score_tplt_1{score=S} = X, 
		 S
	     end || X  <- tplt:get_all_data(daily_active_score_tplt_1)]
    end.


