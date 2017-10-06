%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%%
%%% @end
%%% Created : 19 Apr 2012 by LinZhengJian <linzhj@35info.cn>

-module(vip_gift).
-include("packet_def.hrl").
-include("player_data.hrl").
-include("records.hrl").
-include("house_data.hrl").

-export([start/1, handle_cast/2]).

start(Account)->
    [router:make_event_source(?msg_req_vip_gift_receive_info, Account, {self(), ?MODULE}),
    router:make_event_source(?msg_req_receive_vip_beginner_gift, Account, {self(), ?MODULE}),
    router:make_event_source(?msg_req_receive_vip_daily_gift, Account, {self(), ?MODULE})].


handle_cast({_Msg, #req_vip_gift_receive_info{}}, #player_data{account=Account} = State) -> 
    %% 获取房屋物品包
    Beginner = get_beginner_flag(Account),
    Daily = get_daily_flag(Account),
    net_helper:send2client(Account, #notify_vip_gift_receive_info{beginner=Beginner, daily=Daily}),
    {noreply, State};

handle_cast({_Msg, #req_receive_vip_beginner_gift{items=GiftItems}}, #player_data{account=Account} = State) -> 
    %% 通知访问主人，物品增加
    case get_beginner_flag(Account) of
	0->
	    add_vip_gift(Account, GiftItems),
	    db:dirty_write(#vip_beginner_gift_log{account=Account, receive_date=datetime:local_time()}),
	    net_helper:send2client(Account, #notify_vip_gift{status=1});
	1->
	    net_helper:send2client(Account, #notify_vip_gift{status=0})
    end,
    {noreply, State};

handle_cast({_Msg, #req_receive_vip_daily_gift{items=GiftItems}}, #player_data{account=Account} = State) -> 
    case get_daily_flag(Account) of
	0->
	    add_vip_gift(Account, GiftItems),
	    db:dirty_write(#vip_daily_gift_log{account=Account, receive_date=datetime:local_time()}),
	    net_helper:send2client(Account, #notify_vip_gift{status=1});
	1->
	    net_helper:send2client(Account, #notify_vip_gift{status=0})
    end,
    {noreply, State}.


add_vip_gift(Account, GiftItems)->
    HouseId = db_pair_player:get_house_id(Account),
    HouseData = db_house:select(HouseId),
    Items = [{ItemId, Count} || #vip_gift_item{item_id=ItemId, count=Count}<-GiftItems],
    {NHouseData, Msgs} = house_pack:add_items(Items, HouseData),
    db:dirty_write(NHouseData),
    house_pack:send_msgs(Msgs, NHouseData).



get_beginner_flag(Account)->
    case db:dirty_read(vip_beginner_gift_log, Account) of
	[]->
	    0;
	[#vip_beginner_gift_log{}]->
	    1
    end.


get_daily_flag(Account)->
    case db:dirty_read(vip_daily_gift_log, Account) of
	[]->
	    0;
	[#vip_daily_gift_log{receive_date={RDate,_RTime}}]->
	    {{NYear, NMonth, NDay}, _NTime}=datetime:local_time(),
	    case RDate of 
		{NYear, NMonth, NDay}->
		    1;
		_ -> 
		    0
	    end
    end.
