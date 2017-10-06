%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%  节日礼物
%%% @end
%%% Created :  4 Feb 2012 by hongjx <hongjx@35info.cn>

-module(holiday_gift).

-include("packet_def.hrl").
-include("router.hrl").
-include("enum_def.hrl").
-include("tplt_def.hrl").
-include("sys_msg.hrl").
-include("house_data.hrl").

-export([handle_cast/2, start/1, notify/1]).


start(Account) ->
    [
     router:make_event_source(?msg_req_get_holiday_gift, Account, {Account, ?MODULE})
    ].

notify(Account) ->
    Today = datetime:date(),
    case has_get_holiday_gift(Account, Today) of
	true ->
	    ok;
	_ ->
	    case length(get_today_gifts(Today)) > 0 of
		false ->
		    ok;
		_ ->
		    %% 通知客户端激活节日礼物
		    net_helper:send2client(Account, #notify_active_holiday_gift{})
	    end	    
    end.

%%%===================================================================
%%% 处理handle_cast
%%%===================================================================

%% 领取礼物
handle_cast({_Msg, #req_get_holiday_gift{}}, State) ->
    Account = player_data:get_account(State),
    Today = datetime:date(),

    F = fun() -> do_get_gift(Account, Today) end,

   case db:transaction(F) of
       {false, Err} ->
	   sys_msg:send(Account, Err),
	   net_helper:send2client(Account, 
				  #notify_get_holiday_gift_result{result=0}); %% 0 表示什么也没获
       {ok, #house_data{house_id=HouseID, boy=Boy, girl=Girl}=NewHouse, 
	GiftType, NItemID, NItemCount, Msgs} ->	 	   
	   [house:broadcast_owners(Boy, Girl, Msg) || Msg <- Msgs],
	   house_diamond:notify(NewHouse),

	   %% 物品金钱记录
	   do_log(HouseID, Account, GiftType, NItemID, NItemCount),

	   net_helper:send2client(Account, 
				  #notify_get_holiday_gift_result{result=GiftType,
								  item_id=NItemID,
								  item_count=NItemCount,
								  diamond=NItemCount
								 })
   end,
		
   {noreply, State}.

do_log(HouseID, Account, GiftType, NItemID, NItemCount) ->
    case GiftType of
	1 -> %% 物品
	    item_money_log:log_holiday_gain_item(HouseID, NItemID, NItemCount, Account);
	2 -> %% 爱情水晶			    
	    item_money_log:log_holiday_gain_diamond(HouseID, NItemCount, Account)
    end.

do_get_gift(Account, Today) when is_atom(Account) ->
    HasFetch =
	case db:read(player_holiday_gift_logs, Account) of
	    [{_Table, _Player, Today}] -> true;
	    _ -> false
	end,
    
    case HasFetch of
	true ->
	    {false, ?err_has_get_holiday_gift};
	_ ->
	    case get_today_gifts(Today) of
		[] ->
		    {false, ?err_today_not_holiday_gift};
		Gifts ->
		    {GiftType, ItemID, Count} = random_gift(Gifts),
		    [PlayerBasicData] = db:read(player_basic_data, Account),
		    HouseID = player_basic_data:get_house_id(PlayerBasicData),
		    [HouseData] = db:read(house_data, HouseID),
		    
		    %% 结算
		    {NHouseData, Msgs} = 
			case GiftType of
			    1 -> %% 物品
				house_pack:add_items([{ItemID, Count}], HouseData);
			    2 -> %% 爱情水晶			    
				{house_diamond:add_diamond(Count, HouseData), []}
			end,
		    
		    ok = db:write(NHouseData),
		    %% 记录今天领过礼物了
		    ok = db:write({player_holiday_gift_logs, Account, Today}),
		    {ok, NHouseData, GiftType, ItemID, Count, Msgs}
	    end 
    end.


%%%===================================================================
%%% 内部函数
%%%===================================================================
random_gift(Gifts) ->
    Rates = [X || #holiday_gift{rate=X} <- Gifts],
    TotalRate = lists:sum(Rates),
    Hit = rand:uniform(TotalRate),
    {_Idx, #holiday_gift{gift_type=GiftType, item_id=ItemID, count=Count}} = util:rate_select_one(Hit, Rates, Gifts),

    {GiftType, ItemID, Count}.

get_today_gifts(Today) ->
    TodayDays = datetime:date_to_gregorian_days(Today),
    L = tplt:get_all_data(holiday_gift),   
    
    [X || #holiday_gift{start_day=StartDay, duration=Dur}=X <- L, 
	  in_duration(TodayDays - get_days(StartDay), Dur)].

in_duration(N, Max) ->
    (0 =< N) and (N < Max).

get_days(YYYYMMDD) when is_integer(YYYYMMDD) ->
    D = YYYYMMDD rem 100,
    A = YYYYMMDD div 100,
    Y = A div 100,
    M = A rem 100,
    datetime:date_to_gregorian_days({Y, M, D}).



%%%===================================================================
%%% 数据库
%%%===================================================================
%% 是否已经领过礼物
has_get_holiday_gift(Account, Today) ->
    case db:dirty_read(player_holiday_gift_logs, Account) of
	[{_Table, _Player, Today}] -> true;
	_ -> false
    end.








