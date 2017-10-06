%%%-------------------------------------------------------------------
%%% @author lyj <lyj@35info.cn>
%%% @copyright (C) 2011, lyj
%%% @doc
%%%  纪念日
%%% @end
%%% Created :  5 Dec 2011 by lyj <lyj@35info.cn>
%%%-------------------------------------------------------------------
-module(commemoration).


-include("packet_def.hrl").
-include("router.hrl").
-include("common_def.hrl").
-include("sys_msg.hrl").
-include("resource.hrl").

-export([start/1, handle_cast/2, add_commemoration/5]).
-compile(export_all).
-define(table_name, commemoration).


-define(MAX_COMMEMORATION_DAY, 100).
-define(COMM_ID, 1). %% 纪念日的ID, 这个ID是个特殊的ID, 用于主界面设置纪念日界面的ID用的

-record(commemoration, {house_id,
			love_time=#stime{}, %% 恋爱纪念日
			days=[]}).          %% 纪念日的集合

start(Account) ->	
    [router:make_event_source(?msg_req_modify_love_time, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_get_love_time, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_add_commemoration, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_get_commemoration, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_delete_commemoration, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_modify_commemoration, Account, {Account, ?MODULE})
    ].

%% 请求修改相恋时间
handle_cast({#msg{src=Account}, #req_modify_love_time{house_id=HouseID,love_time=Time}}, State) ->
    modify_love_time(Account, HouseID, Time),
    {noreply, State};

%% 请求获得相恋时间
handle_cast({#msg{src=Account}, #req_get_love_time{house_id=HouseID}}, State) ->
    get_love_time(Account, HouseID),
    {noreply, State};

%% 请求增加一条纪念日
handle_cast({#msg{src=Account}, #req_add_commemoration{house_id=HouseID, show_other = ShowOther, 
						       time=Time, content=Content}}, State) ->
    add_commemoration(Account, HouseID, Time, ShowOther, Content),
    {noreply, State};
 
%% 请求获得纪念日
handle_cast({#msg{src=Account}, #req_get_commemoration{house_id=HouseID, 
						       my_house_id=MyHouseID, page=Page}}, State) -> 
	    get_commemoration(Account, HouseID, HouseID == MyHouseID, Page),
    {noreply, State};

%% 请求删除纪念日
handle_cast({#msg{src=Account}, #req_delete_commemoration{house_id=HouseID, id=ID}}, State) -> 
    delete_commemoration(Account, HouseID, ID),
    {noreply, State};

%% 请求修改纪念日
handle_cast({#msg{src=Account}, #req_modify_commemoration{house_id=HouseID, id=ID, 
							  time=Time, content=Content, 
							  show_other=ShowOther}}, State) -> 
    modify_commemoration(Account, HouseID, ID, Time, Content, ShowOther),
    {noreply, State}.

%%------------------------------------------------------------------
modify_love_time(Account, HouseID, Time) ->
    Data = select(HouseID),
    Content= ?default_commemoration,
    LoveTime = Data#commemoration.love_time,
    Days = case LoveTime#stime.year == 0 of
	       true -> add_commemoration_impl(?COMM_ID, Time, 1, Content, Data#commemoration.days);
	       false ->
		   [case D#commemoration_day.id == ?COMM_ID of 
			true -> D#commemoration_day{time=Time};
			false -> D
		    end || D <- Data#commemoration.days]
	   end,
    save(Data#commemoration{love_time=Time, days=Days}),
    Packet = #notify_love_time{house_id = HouseID, 
			       love_time = get_love_time_impl(Time)},
    net_helper:send2client(Account, Packet).

get_love_time(Account, HouseID) ->
    Data = case select(HouseID) of
	       [] -> create_commemoration(HouseID);
	       D -> D
	   end,
    Packet = #notify_love_time{house_id = HouseID, 
			       love_time = get_love_time_impl(Data#commemoration.love_time)},
    net_helper:send2client(Account, Packet).

get_love_time_impl(#stime{year=0}) ->
    0;
get_love_time_impl(LoveTime) ->
    DF = datetime:diff_time(LoveTime, datetime:localtime()),
    case DF >= 0 of
	true ->	DF div (24 * 3600) + 1;
	_ -> DF div (24 * 3600)
    end.

create_commemoration(HouseID) ->
    C = #commemoration{house_id = HouseID},
    save(C),
    C.

add_commemoration(Account, HouseID, Time, ShowOther, Content) ->
    Data = select(HouseID),
    case length(Data#commemoration.days) >= 100 of
	true -> sys_msg:send(Account, ?msg_commemoration);
	false ->
	    case length(Data#commemoration.days) > ?MAX_COMMEMORATION_DAY of
		true -> 
		    %% 达到100条的上线, 提示玩家
		    sys_msg:send(Account, ?msg_commemoration);
		false ->
		    Days = add_commemoration_impl(Time, ShowOther, Content, Data#commemoration.days),
		    NData = Data#commemoration{days = Days},
		    save(NData)
	    end
    end.

add_commemoration_impl(Time, ShowOther, Content, Days) ->
    add_commemoration_impl(guid:make(?st_commemoration), Time, ShowOther, Content, Days).

add_commemoration_impl(ID, Time, ShowOther, Content, Days) ->
    NDays = [#commemoration_day{id = ID, 
				time = Time, 
				show_other = ShowOther,
				content = list_to_binary(Content)} | Days],
    lists:sort(fun(D1, D2) -> 
		       datetime:diff_time(D2#commemoration_day.time, D1#commemoration_day.time) >= 0  
	       end, NDays).

get_commemoration(Account, HouseID, IsOwner, Page) ->
    Count = 10,
    Data = select(HouseID),
    Days = case IsOwner of
	       true -> Data#commemoration.days;
	       false ->
		   [D || D <- Data#commemoration.days, D#commemoration_day.show_other == 1]
	   end,
    L = length(Days),
    Total = case L rem Count of
		0 -> L div Count;
		_ -> L div Count + 1
	    end,
    Packet = #notify_commemoration{days = lists:sublist(Days, (Page-1) * Count + 1, Count), total = Total}, 
    net_helper:send2client(Account, Packet).

delete_commemoration(Account, HouseID, ID) ->
    Data = select(HouseID),
    NData = case ID == ?COMM_ID of
		true -> Data#commemoration{love_time=#stime{}};
		false -> Data
	    end,
    Days = [D || D <- Data#commemoration.days, D#commemoration_day.id /= ID],
    save(NData#commemoration{days = Days}),
    Packet = #notify_love_time{house_id = HouseID, 
			       love_time = get_love_time_impl(NData#commemoration.love_time)},
    net_helper:send2client(Account, Packet),
    ok.

modify_commemoration(Account, HouseID, ID, Time, Content, ShowOther) ->
    Data = select(HouseID),
    Days = [case D#commemoration_day.id of
		ID -> D#commemoration_day{time=Time, content=list_to_binary(Content), show_other=ShowOther};
		_ -> D
	    end || D <- Data#commemoration.days],
    NDays = lists:sort(fun(D1, D2) -> 
			       datetime:diff_time(D2#commemoration_day.time, D1#commemoration_day.time) >= 0  
		       end, Days),
    case ID of
	?COMM_ID -> 
	    save(Data#commemoration{love_time = Time, days = NDays}),
	    Packet = #notify_love_time{house_id = HouseID, 
				       love_time = get_love_time_impl(Time)},
	    net_helper:send2client(Account, Packet);
	_ -> save(Data#commemoration{days = NDays})
    end,
    %% TODO: 发送消息告知修改成功
    ok.

%% -------------数据库操作相关---------------------------
%% 获取指定玩家的数据
select(HouseID) ->
    case db:dirty_read(?table_name, HouseID) of
	[] -> [];
	[Data] -> Data
    end.

save(Data) ->
    db:dirty_write(Data).


