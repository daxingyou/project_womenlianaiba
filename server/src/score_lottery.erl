%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%  积分抽奖
%%% @end
%%% Created :  9 Aug 2012 by hongjx <hongjx@35info.cn>

-module(score_lottery).



-include("packet_def.hrl").
-include("router.hrl").
-include("enum_def.hrl").
-include("tplt_def.hrl").
-include("sys_msg.hrl").
-include("house_data.hrl").

-export([handle_cast/2, start/1, notify/1, get_account/1, get_score/1, read/1]).

-record(score_lottery,
	{account, score=0, random_info}).

start(Account) ->
    [
     router:make_event_source(?msg_req_refresh_score_lottery_ui, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_open_score_lottery_ui, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_score_lottery, Account, {Account, ?MODULE})
    ].

notify(Account) ->
    case is_active() of
	true ->
	    %% 通知客户端激活节日礼物
	    net_helper:send2client(Account, #notify_active_score_lottery{});
	_  ->
	    ok
    end.
get_account(#score_lottery{account=Account}) ->
    Account.

get_score(#score_lottery{score=Scroe}) ->
    Scroe.

read(Account) ->
    case db:dirty_read(score_lottery, Account) of
	[] -> 0;
	[#score_lottery{score=Score}] -> Score
    end.

%%%===================================================================
%%% 处理handle_cast
%%%===================================================================
handle_cast({_Msg, #req_open_score_lottery_ui{}}, State) ->
    Account = player_data:get_account(State),
    case do_refresh_ui(Account) of
	{_GroupID, Items, RemainCount} ->
	    net_helper:send2client(Account, 
				   #notify_open_score_lottery_ui{items=Items,
								 remain_count=RemainCount});
	_ ->
	    ok
    end,
   {noreply, State};

handle_cast({_Msg, #req_refresh_score_lottery_ui{}}, State) ->
    Account = player_data:get_account(State),
    case do_refresh_ui(Account) of
	{_GroupID, Items, RemainCount} ->
	    net_helper:send2client(Account, 
				   #notify_refresh_score_lottery_ui{
								 items=Items,
								 remain_count=RemainCount});
	_ ->
	    ok
    end,
   {noreply, State};

%% 抽奖
handle_cast({_Msg, #req_score_lottery{}}, State) ->
    AddScore = common_def:get_val(lottery_add_score),
    Account = player_data:get_account(State),
    case is_active() of
	false -> 
	    close_ui(Account);
	_ ->
	    GroupID = db_fetch_group_id(Account),
	    TpltItems = get_tplt_items(GroupID),
	    Rates = [X || #score_lottery_item_tplt{rate=X} <- TpltItems],
	    TotalRate = lists:sum(Rates),
	    Hit = rand:uniform(TotalRate),

	    {Index, #score_lottery_item_tplt{item_id=ItemID, item_count=ItemCount}} = util:rate_select_one(Hit, Rates, TpltItems),

	    F = fun() ->
			do_score_lottery(Account, ItemID, ItemCount, AddScore, TpltItems, Index)
		end,
	    
	    case db:transaction(F) of
	        {false, Err} ->
	    	   sys_msg:send(Account, Err);
	    	{ok, MFAList}->	
		    [erlang:apply(Mod, Fun, A) || {Mod, Fun, A} <- MFAList]
	    end
    end,
   {noreply, State}.


%%%===================================================================
%%% 内部函数
%%%===================================================================
do_score_lottery(Account, ItemID, ItemCount, AddScore, TpltItems, Index) ->
    HouseID = player_basic_data:get_house_id(Account),
    [HouseData] = db:read(house_data, HouseID),

    %% 删物品
    CostItemID = common_def:get_val(lottery_cost_item_id),
    CostItemCount = common_def:get_val(lottery_cost_item_count),
    {NDel, NHouseData, DelMsgs} =  
	house_pack:try_del_n_by_tempid([CostItemID], CostItemCount, HouseData),
    case NDel of
	CostItemCount -> %% 删成功了
	    %% 加物品
	    {NNHouseData, AddMsgs} = house_pack:add_items([{ItemID, ItemCount}], NHouseData),

	    db:write(NNHouseData),
	    %% 加分数, 更新随机组
	    TotalScore = add_score_and_rand(Account, AddScore),

	    GroupItems = to_group_items(TpltItems),
	    RemainCount = house_pack:get_item_count_by_tempid([CostItemID], NNHouseData),

	    Packet = #notify_score_lottery_result{hit_index=Index - 1, 
						  items=GroupItems, 
						  remain_count=RemainCount},


	    %% 更新排行
	    {ok, 
	     [{house_pack, send_msgs, [DelMsgs, NNHouseData]},
	      {ranking, start_score_lottery_ranking, [Account, TotalScore]}, 
	      {house_pack, send_msgs, [AddMsgs, NNHouseData]}, 
	      {net_helper, send2client, [Account, Packet]}]};
	_ ->
	    {false, ?err_score_coin_not_enough}
    end.


random_group_id() ->
    IDs = get_group_ids(),
    Pos = rand:uniform(length(IDs)),
    GroupID = lists:nth(Pos, IDs),
    GroupID.
    

do_refresh_ui(Account) ->
    case is_active() of
	false -> 
	    close_ui(Account);
	_ ->
	    GroupID = db_fetch_group_id(Account),
	    Items = get_group_items(GroupID),

	    [PlayerBasicData] = db:dirty_read(player_basic_data, Account),
	    HouseID = player_basic_data:get_house_id(PlayerBasicData),
	    [HouseData] = db:dirty_read(house_data, HouseID),

	    ItemTempID = common_def:get_val(lottery_cost_item_id),

	    RemainCount = house_pack:get_item_count_by_tempid([ItemTempID], HouseData),
	    {GroupID, Items, RemainCount}
    end.


is_active() ->
    Now = datetime:localtime(),
    {From, To} = common_def:get_val(lottery_effect_time),
    (From < Now) and (Now < To).

close_ui(Account) ->
    net_helper:send2client(Account, 
			   #notify_open_score_lottery_ui{
							 items=[],
							 remain_count=0}).



get_tplt_items(GroupID) when is_integer(GroupID) ->
    [X || X = #score_lottery_item_tplt{group_id=GID}
	      <- tplt:get_all_data(score_lottery_item_tplt),  GID =:= GroupID].


to_group_items(TpltItems) ->
    [#lottery_item{item_id=ItemID, item_count=Count} || 
	#score_lottery_item_tplt{item_id=ItemID, item_count=Count} <- TpltItems].


get_group_items(GroupID) when is_integer(GroupID) ->
    [#lottery_item{item_id=ItemID, item_count=Count} || 
	#score_lottery_item_tplt{group_id=GID, item_id=ItemID, item_count=Count}
	    <- tplt:get_all_data(score_lottery_item_tplt),  GID =:= GroupID].


get_group_ids() ->
    L = [GID || #score_lottery_item_tplt{group_id=GID} 
		<- tplt:get_all_data(score_lottery_item_tplt)],
    lists:usort(L).
    

%%%===================================================================
%%% 数据库
%%%===================================================================
%% 增加积分
add_score_and_rand(Account, N) when is_atom(Account), is_integer(N) ->
    GroupID = random_group_id(),
    Today = datetime:date(),
    NewR = 
	case db:read(score_lottery, Account) of
	    [#score_lottery{score=Score}=R] ->
		R#score_lottery{score=N + Score, random_info={Today, GroupID}};
	    _ ->
		#score_lottery{account=Account, score=N, random_info={Today, GroupID}}
	end,
    db:write(NewR),
    NewR#score_lottery.score.


db_fetch_group_id(Account) when is_atom(Account) ->
    GroupID = random_group_id(),
    Today = datetime:date(),    
     
    case db:dirty_read(score_lottery, Account) of
	[#score_lottery{random_info=Info}=R] ->
	    case Info of
		{Today, CurGroupID} ->
		    CurGroupID;
		_ ->
		    NewR = R#score_lottery{random_info={Today, GroupID}},
		    db:dirty_write(NewR),
		    GroupID
	    end;
	_ ->
	    NewR = #score_lottery{account=Account, score=0, random_info={Today, GroupID}},	     
	    db:dirty_write(NewR),
	    GroupID
    end.






