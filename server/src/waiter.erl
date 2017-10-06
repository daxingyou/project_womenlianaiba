%% @author wujd <wujd@35info.cn>
%%  @copyright (C) 2013, wujd
%%  @doc
%% 
%%  @end
%%  Created : 20 june 2013 by wujd <wujd@35info.cn>

-module(waiter).

-include("tplt_def.hrl").
-include("packet_def.hrl").
-include("router.hrl").
-include("player_love_coin.hrl").
-include("common_def.hrl").
-include("records.hrl").

-compile(export_all).

-export([start/1]).
-export([handle_cast/2]).
-export([notify/1]).
-export([get_waiter_id/1, get_waiter_add_exp/1, get_waiter_add_coin/1, get_waiter_add_item_drop/1]).

-record(player_waiter, {account,
			waiter_id=0,    %% 当前雇佣侍者ID
			waiter_up=[]   %% 侍者升级后ID
		       }).

-define(waiter_employ, 1).   %% 雇佣
-define(waiter_up, 2).       %% 升级

%% ====================================================================
start(Account) ->
    [
     router:make_event_source(?msg_req_employ_waiter_data, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_up_waiter_data, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_query_waiter_id, Account, {Account, ?MODULE})
    ].

handle_cast({#msg{src=Account}, #req_up_waiter_data{waiter_id=Waiterid}}, State) ->
    case get_tplt_waiter_type(Waiterid) of
	error ->  %% 错误的侍者ID, 在表中找不到
	    false;
	WaiterType ->
	    PlayerWaiterInfo = get_player_waiter(Account),
	    WaiterInfo = PlayerWaiterInfo#player_waiter.waiter_up,
	    case lists:keyfind(WaiterType, #waiter_info.waiter_type, WaiterInfo) of
		false ->  %% 没有升级过该类型侍者,直接让升级
		    up_waiter(Account, Waiterid, WaiterType, State);

		#waiter_info{waiter_id=Findid, waiter_type=FindType} ->
		    if 
			Findid == Waiterid -> 
			    up_waiter(Account, Waiterid, FindType, State);
			%% 该类型侍者升级过, 需要升级的id和存储已经升级过id不一致
			true -> 
			    false
		    end
	    end
    end,
    {noreply, State};


handle_cast({#msg{src=Account}, #req_query_waiter_id{account=TagAccount}}, State) ->
    Waiter_Id = get_waiter_id(list_to_atom(TagAccount)),
    Packet = #notify_query_waiter_id{waiter_id=Waiter_Id},
    net_helper:send2client(Account, Packet),
    {noreply, State};


handle_cast({#msg{src=Account}, #req_employ_waiter_data{waiter_id=Waiterid}}, State) ->
   
    case get_tplt_waiter_type(Waiterid) of
	error ->  %% 错误的侍者ID, 在表中找不到
	    false;
	WaiterType ->
	    PlayerWaiterInfo = get_player_waiter(Account),
	    WaiterInfo = PlayerWaiterInfo#player_waiter.waiter_up,
	
	    case lists:keyfind(WaiterType, #waiter_info.waiter_type, WaiterInfo) of
		false ->  %% 没有升级过该类型侍者,直接让雇佣
		    employ_waiter(Account, Waiterid, WaiterType, State);
		#waiter_info{waiter_id=Findid, waiter_type=FindType} ->
		    if 
			Findid == Waiterid -> employ_waiter(Account, Waiterid, FindType, State);

			%% 该类型侍者升级过, 雇佣的id和升级以后的id不一致
			true -> false
		    end
	    end
    end,
    {noreply, State}.


%% 升级侍者
up_waiter(Account, Waiterid, WaiterType, PlayerData) ->
    case can_up_waiter(Account, Waiterid) of
	{} ->
	    false;
	Data ->
	    {Coin, Id} = Data,
	    dec_money(Account, Waiterid, Id, WaiterType, ?waiter_up, Coin, PlayerData)
    end.


%% 雇佣侍者
employ_waiter(Account, Waiterid, WaiterType, PlayerData) ->
    case can_employ_waiter(Account, Waiterid) of
	{} ->
	 	    false;
	Data ->
	    {Coin, Id} = Data,
	    dec_money(Account, Waiterid, Id, WaiterType, ?waiter_employ, Coin, PlayerData)
    end.	


%% 验证可否升级
can_up_waiter(Account, Waiterid) ->
    F = fun() ->
		case tplt:get_data(waiter_tplt, Waiterid) of
		    #waiter_tplt{up_coin=Up_coin, up_house_lv=Up_house_lv, up_id=Up_id} ->
			%%HouseLv = get_house_lv(Account),
			Player_lv = get_player_lv(Account),
			case (Up_id > 0) and (Up_house_lv =< Player_lv) of
			    false -> {};
			    true -> 
				case tplt:get_data(waiter_tplt, Up_id) of
				    #waiter_tplt{id=Id} ->
					{Up_coin, Id}
				end
			end;
		    _-> 
			{}
		end
	end,
    db:transaction(F).


get_player_lv(Account) ->
    [BasicData] = db:dirty_read(player_basic_data, Account),
    HouseID = player_basic_data:get_house_id(BasicData),
    [HouseData] = db:dirty_read(house_data, HouseID),
    HouseLevel = house_level_exp:get_level(HouseData),
    HouseLevel.


%% 验证可否雇佣
can_employ_waiter(Account, Waiterid) ->
    F = fun() ->
		case tplt:get_data(waiter_tplt, Waiterid) of
		    #waiter_tplt{player_lv=Player_lv, employ_money=Money} ->
			HouseLevel = get_player_lv(Account),
			{Player_lv, Money, HouseLevel};
		    _->
			{}
		end
	end,
       
    case db:transaction(F) of
	{} ->
	    {};
	Data ->
	    {Playerlv, Money, Level} = Data,
	
	    case Level >= Playerlv of
		true ->
		    {Money, Waiterid};
		false ->
		    {}
	    end
    end.


%% 扣除雇佣消耗
dec_money(Account, LastWaiterid, Waiterid, WaiterType, WaiterState, Money, PlayerData) ->

    %% 雇佣侍者
    ShipCallback = 
	fun(#order{status=Status}=_Order)-> 			   
		case (Status =:= ?order_payed) of
		    true ->
			save_waiter(Account, LastWaiterid, Waiterid, WaiterType, WaiterState),
			?pay_shipped;
		    false ->
			?pay_error
		end
	end,
    player_love_coin:pay([{Waiterid, 1, Money}], ShipCallback, 1, PlayerData),
    send_pack(Account).


%% 保存雇佣的侍者ID
%% LastWaiterid 升级或雇佣前侍者ID
%% Waiterid 升级或雇佣后侍者Id
save_waiter(Account, LastWaiterid, Waiterid, WaiterType, WaiterState) ->
    Playerwaiter = get_player_waiter(Account),

    NPlayerwaiter =
	case WaiterState of
	    ?waiter_employ ->
		Playerwaiter#player_waiter{account=Account, waiter_id=Waiterid};
	    ?waiter_up ->
		Waiter_up = Playerwaiter#player_waiter.waiter_up,
		Cur_waiter_id = Playerwaiter#player_waiter.waiter_id,  % 当前雇佣的侍者ID
		
		%% 升级的侍者为当前的侍者直接更换当前雇佣的侍者
		NWaiter_id =
		    case Cur_waiter_id == LastWaiterid of
			false -> Cur_waiter_id;
			true -> Waiterid
		    end,

		NWaiter_up =
		    case lists:keyfind(WaiterType, #waiter_info.waiter_type, Waiter_up) of
			false ->
			    lists:append(Waiter_up, [#waiter_info{waiter_type=WaiterType, waiter_id=Waiterid}]);
			FindData ->
			    DWaiterInfo = lists:delete(FindData, Waiter_up),
			    lists:append(DWaiterInfo, [#waiter_info{waiter_type=WaiterType, waiter_id=Waiterid}])
		    end,
		Playerwaiter#player_waiter{account=Account, waiter_id=NWaiter_id, waiter_up=NWaiter_up}
	end,
    db:dirty_write(NPlayerwaiter).


%% 通知侍者信息
send_pack(Account) ->
    
    PlayerWaiter = get_player_waiter(Account),
    Waiterid = PlayerWaiter#player_waiter.waiter_id,
    WaiterUp = PlayerWaiter#player_waiter.waiter_up,
    Packet = #notify_employ_state{waiter_id=Waiterid, waiter_up=WaiterUp},
   
    net_helper:send2client(Account, Packet).


%% 登入时通知侍者信息
notify(Account) ->
    send_pack(Account).				


%% 获取房屋权限等级
get_house_lv(Account) ->
    UnLockList = player_move_house:get_player_unlock_house(Account),
    Count = player_move_house:get_max_unlock_house(UnLockList),
    Count.


%% 获取配表中的侍者信息
get_tplt_waiter(WaiterID) ->
    tplt:get_data2(waiter_tplt, WaiterID).

%% 获取配表中的侍者类别
get_tplt_waiter_type(WaiterID) ->
    case get_tplt_waiter(WaiterID) of
	#waiter_tplt{waiter_type=WaiterType} ->
	    WaiterType
    end.


%% 获取当前雇佣的侍者ID
get_waiter_id(Account) ->
    PlayerWaiter = get_player_waiter(Account),
    PlayerWaiter#player_waiter.waiter_id.


%% 获取当前侍者增加的经验
get_waiter_add_exp(Account) ->
    WaiterID = get_waiter_id(Account),
    case get_tplt_waiter(WaiterID) of
	#waiter_tplt{exp_rate=ExpRate} -> ExpRate
    end.


%% 获取当前侍者增加的水晶
get_waiter_add_coin(Account) ->
    WaiterID = get_waiter_id(Account),
    case get_tplt_waiter(WaiterID) of
	#waiter_tplt{coin_rate=CoinRate} ->
	    CoinRate
    end.
    

%% 获取当前侍者增加的物品掉落
get_waiter_add_item_drop(Account) ->
    WaiterID = get_waiter_id(Account),
    case get_tplt_waiter(WaiterID) of
	#waiter_tplt{item_drop_rate=ItemDropRate} ->
	    ItemDropRate / 100

    end.


%% 获取玩家当前侍者信息
get_player_waiter(Account) ->
    
    case db:dirty_read(player_waiter, Account) of
	[] ->
	    #player_waiter{account=Account, waiter_id=0, waiter_up=[]};
	[PlayerWaiter] -> 
	    PlayerWaiter
    end.
