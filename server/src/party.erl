%%%-------------------------------------------------------------------
%%% @author lyj <lyj@35info.cn>
%%% @copyright (C) 2011, lyj
%%% @doc
%%% 派对
%%% @end
%%% Created : 18 Oct 2011 by lyj <lyj@35info.cn>
%%%-------------------------------------------------------------------
-module(party).


-include("packet_def.hrl").
-include("enum_def.hrl").
-include("house_data.hrl").
-include("common_def.hrl").
-include("router.hrl").
-include("sys_msg.hrl").
-include("tplt_def.hrl").
-include("resource.hrl").
-include("records.hrl").
-include_lib("stdlib/include/qlc.hrl").


-export([start/1, handle_cast/2, del_party/2, on_bian_shen/2,
	 on_enter_scene/1, on_leave_scene/1, is_party_item/1,
	 update_party_20121227/0, start_party_timer/1,
	 get_party/1, in_private_party/1, finish_party/2]).

-export([load_party_list/0]).
-export([get_party_master/1]).

-compile(export_all).

-record(party, {house_id,   %% 创建该party的房屋
		account,    %% 创建该party的帐号
		house_name, %% 房屋的名字
		player_name,%% 玩家的名字
		type,       %% 类型
		title,      %% 标题
		desc,       %% 描述
		create_time, %% 创建时间
		decoration,  %% 豪华度
		house_tplt_id, %%
		lover,       %% 另一个账号
		level,        %% 等级
		vote_list=[], %% 投票记录
		score=0,      %% 当前积分
		light_buffs=[], %% 点亮的变身buff
		cost_items=[],  %% 包场道具
		max_point,           %% 玩家每场派对增加的积分
		food_ids=[]	     %% 使用派对食物
	       }).

-record(party_drink, {account,   %% 派对请喝酒
		      shout,     %% 请喝酒的数量
		      shouted,   %% 被请的数量
		      time       %% 每天都要清空这些数据
	       }).


-record(party_create_time, 
	{house_id,
	 create_time %% 
	}).

-record(party_vote,
	{account,
	 today,
	 times=0  %% 投票次数
	}).
	
start(Account) ->
    [router:make_event_source(?msg_req_get_party_list, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_create_party, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_edit_party, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_add_party_score, Account, {Account, ?MODULE}),
     router:make_event_source(start_buff, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_delete_party, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_ask_drink_count, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_party_drink, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_get_my_party_info, Account, {Account, ?MODULE})
    ].


%%%===================================================================
%%% handle cast 
%%%===================================================================
handle_cast({#msg{src=Account}, #req_ask_drink_count{drink_id=ID}}, PlayerData) ->
    SceneName = player_data:get_scene_name(PlayerData),
    handle_ask_drink_count(Account, SceneName, ID),
    {noreply, PlayerData};
handle_cast({#msg{src=Account}, #req_party_drink{drink_id=ID}}, PlayerData) ->
    SceneName = player_data:get_scene_name(PlayerData),
    handle_party_drink(Account, SceneName, ID, PlayerData),
    {noreply, PlayerData};
handle_cast({#msg{src=Account}, #req_add_party_score{}}, PlayerData) ->
    SceneName = player_data:get_scene_name(PlayerData),
    HouseID = house:id_from_name(SceneName),
    Today = datetime:date(),
    F = fun() ->
		do_add_party_score(Account, HouseID, SceneName, Today)
	end,
    
    case db:transaction(F) of
	{false, Reason} ->
	    sys_msg:send(Account, Reason);
	{ok, Funs} ->
	    [Fn() || Fn <- Funs] 
    end,

    {noreply, PlayerData};


%% 请求获得派对列表
handle_cast({#msg{src=Account}, #req_get_party_list{type=Type, page=Page}}, PlayerData) ->
    {MaxPage, L, LHot} = get_party(Type, Page, Account),
    Pack = #notify_party_list{max_page=MaxPage, partys=L, hot_partys=LHot},
    net_helper:send2client(Account, Pack),
    {noreply, PlayerData};

%% 请求创建派对
handle_cast({#msg{src=Account}, #req_create_party{house_id=HouseID,house_name=HouseName,
						  player_name=PlayerName, type=Type,
						  cost_items=CostItems,
						  title=Title, description=Desc,
						  food_ids=FoodIDS}}, PlayerData) ->
    {ok, PartySize} = application:get_env(server, party_size),
    case get_size() > PartySize of
	true -> 
	    Result = #notify_create_party_result{result = PartySize},
	    net_helper:send2client(Account, Result);
	false ->
	    case create_party(HouseID, Account, HouseName, PlayerName, Type, Title, Desc, CostItems, FoodIDS) of
		{ok, NHouseData, Msgs} ->
		    party_manager:start_party_timer(HouseID),
		    Result = #notify_create_party_result{result = 0},
		    router:cast(Account, create_party_event, HouseID),

		    SceneName = house:get_house_name(HouseID),
		    {NNHouseData, AddItems, ItemMsgs} = give_party_master_item(FoodIDS, NHouseData),
		    case router:send2(SceneName, get_players) of
			Players when is_list(Players) ->
			    party_items:on_start_party(NNHouseData, Players, convert_cost_items(CostItems)),
			    
			    broadcast_exp_buffs(SceneName),
			    broadcast_score(Players, NNHouseData),
			    
			    [router:cast(P, start_buff, SceneName) || P <- Players];
			_ ->
			    ok
		    end,
		    db:dirty_write(NNHouseData),
		    
		    %% 通知是否有使用派对食物
		    net_helper:send2client(Account, #notify_party_food_ids{food_ids=FoodIDS}),

		    send_item_msg(Account, AddItems), % 通知获取的物品信息
		    house_pack:send_msgs(Msgs, NNHouseData),
		    house_diamond:notify(NNHouseData),
		    house_pack:send_msgs(ItemMsgs, NNHouseData),
		    net_helper:send2client(Account, Result);
		{false, {Reason, Params}} ->
		    sys_msg:send(Account, Reason, Params);
		{false, need_item} ->
		    ItemID = common_def:get_val(private_party_cost_item_id),
		    net_helper:send2client(Account, 
					   #notify_private_party_need_item{item_id=ItemID});
		{false, Reason} ->
		    sys_msg:send(Account, Reason)
	    end
    end,
    {noreply, PlayerData};

%% 请求修改派对
handle_cast({#msg{src=Account}, #req_edit_party{house_id=HouseID,type=Type, title=Title, description=Desc}}, PlayerData) ->
    Result = case edit_party(HouseID, Account, Type, Title, Desc) of
		 ok -> 1;
		 not_exist -> %% 编辑的派对不存在
		     2;
		 not_allow -> %% 指定的账号不被允许修改， 比如配偶没权限修改
		     3
	     end,
    Packet = #notify_edit_party_result{result = Result},
    net_helper:send2client(Account, Packet),
    {noreply, PlayerData};

%% 请求删除派对
handle_cast({#msg{src=Account}, #req_delete_party{house_id=HouseID}}, PlayerData) ->
    Result = case del_party(Account, HouseID) of
		 ok -> 1;
		 not_exist -> %% 删除的派对不存在
		     2;
		 not_allow -> %% 指定的派对不被允许删除， 比如配偶没权限修改
		     3
	     end,
    Packet = #notify_delete_party_result{result = Result},
    net_helper:send2client(Account, Packet),
    {noreply, PlayerData};


handle_cast({#msg{event=start_buff}, Scene},  
	    PlayerData) ->
    SceneName = player_data:get_scene_name(PlayerData),
    NewPlayerData =
	case Scene of
	    SceneName ->
		start_buff(PlayerData);
	    _ -> %% 不同场景，直接跳过
		PlayerData
	end,
    {noreply, NewPlayerData};
%% 请求获得自己创建的派对
handle_cast({#msg{src=Account}, #req_get_my_party_info{house_id=HouseID}}, PlayerData) ->
    Party = get_my_party_info(HouseID, Account),
    [HouseData] = db:dirty_read(house_data, HouseID),

    Level = house_level_exp:get_level(HouseData),
    #level_info_tplt{party_cost_money=NeedMoney} = 
	tplt:get_data(level_info_tplt, Level),

    Result = #notify_my_party_info{data=Party, need_money=NeedMoney},
    net_helper:send2client(Account, Result),
    {noreply, PlayerData}.


%%%===================================================================
%% 事件
%%%===================================================================
%% 返回PlayerData
on_enter_scene(PlayerData) ->
    Today = datetime:date(),
    Account = player_data:get_account(PlayerData),
    SceneName = player_data:get_scene_name(PlayerData),
    case house:id_from_name(SceneName) of
	[] -> %% 公共场景, 不在屋内
	    PlayerData;
	HouseID ->
	    case db:dirty_read(party, HouseID) of
		[] -> %% 没有办派对
		    PlayerData;
		[Party] ->
		    #party{score=Score, account=Master, 
			   house_id=HouseID, lover=Lover, vote_list=VoteList} = Party,
		    N = get_remain_vote_times(Account, Today),
		    HasVote =
			case lists:member(Account, VoteList) of
			    true -> 1;
			    _ -> 
				case N > 0 of
				    true ->
					case Account of
					    Master -> 1;
					    Lover -> 1;
					    _ -> 0
					end;
				    _ ->
					1
				end
			end,

		    [HouseData] = db:dirty_read(house_data, HouseID),
		    CostItems = Party#party.cost_items,

		    net_helper:send2client(Account, party_exp_buffs_packet(Party)),
		    net_helper:send2client(Account, #notify_party_score{score=Score, has_vote=HasVote, 
								       remain_times=N}),
		    party_items:on_enter_house(HouseData, Account, CostItems),

		    %% 通知是否有使用派对食物
		    FoodIDs = get_party_food_eat(SceneName),
		    net_helper:send2client(Account, #notify_party_food_ids{food_ids=FoodIDs}),

		    start_buff(Party, HouseData, PlayerData)		    
	    end
    end.

on_leave_scene(PlayerData) ->
    cancel_buff(PlayerData).

%% 变身
on_bian_shen(BianShenID, #party{house_id=HouseID, light_buffs=Lights}=Party) ->
    case lists:member(BianShenID, Lights) of
	true -> 
	    [];
	_ ->
	    NewLights = [BianShenID | Lights],
	    NewParty = Party#party{light_buffs=NewLights},
	    db:write(NewParty),

	    Packet = party_exp_buffs_packet(NewParty),

	    SceneName = house:get_house_name(HouseID),
	    [{router, cast, [undefined, SceneName, broadcast_all_players, 
			     Packet]}]
    end.

%%%===================================================================
%%% api 
%%%===================================================================
is_party_item(ItemID) when is_integer(ItemID) ->
    KVList = common_def:get_val(party_cost_items),
    lists:keymember(ItemID, 2, KVList).

in_private_party(HouseID) when is_integer(HouseID) ->
    case db:dirty_read(party, HouseID) of
	[] -> false;
	[R] -> 
	    case is_party_overdue(R) of
		true -> false;
		_ ->
		    is_private_party(R#party.type)
	    end	    
    end.	    

load_party_list() ->
    Seconds = common_def:get_val(party_alive_time),
    F = fun() ->
		Q = qlc:q([begin
			     case is_party_overdue(P, Seconds) of
				 true -> %% 过期
				     try_finish_party(P);
				 _ ->    %% 开定时器
				     start_party_timer(P)
			     end
			   end || P <- db:table(party)
			 ]),
		qlc:e(Q)
	end,
    db:transaction(F).


start_party_timer(#party{house_id=HouseID, create_time=CreateTime}) ->
    Seconds = common_def:get_val(party_alive_time) - datetime:diff_time(CreateTime, datetime:localtime()),
    start_party_timer(HouseID, Seconds);
start_party_timer(HouseID) when is_integer(HouseID) ->
    Seconds = common_def:get_val(party_alive_time),
    start_party_timer(HouseID, Seconds).
start_party_timer(HouseID, Seconds) when Seconds >= 0 ->
    F = fun(State) ->
		try_finish_party(HouseID),
		State
	end,
    erlang:send_after(Seconds * 1000, self(), {timer, F}).
    
get_party(SceneName) when is_atom(SceneName) ->
    case house:id_from_name(SceneName) of
	[] -> [];
	HouseID ->
	    case db:dirty_read(party, HouseID) of
		[] -> [];
		[R] -> 
		    case is_party_overdue(R) of
			true ->
			    [];
			_ ->
			    R
		    end
	    end	    
    end.


get_party_list([], _type, _Page, _Overdue, _Account) ->
    {1, [], []};
get_party_list(Partys1, Type, Page, Overdue, Account) ->
    Partys2 = case Type == 0 of %% 0 代表不判断类型, 显示所有的派对
		 true -> Partys1;
		 false -> [P || P <- Partys1, P#party.type == Type]
	     end,
    Partys = sort_party(Partys2),
    HotPartys = sort_hot_party(Partys2),
    Len = length(Partys),
    PageCount = common_def:get_val(party_count_per_page), %% 每页设置显示10个派对
    Start = (Page-1) * PageCount + 1,
    Count = erlang:min(PageCount, Len - Start + 1),
    MaxPage = util:ceil(Len / PageCount),
    case Count > 0 of
	true ->
	    L = lists:sublist(Partys, Start, Count),
	    L1 = [translate(P, Overdue, Account) || P <- L],
	    LHot = [translate(P, Overdue, Account) || 
		       P <- lists:sublist(HotPartys, 1, common_def:get_val(hot_party_count))],
	    {MaxPage, L1, LHot};
	false -> %% 客户端发过来的页数可能会因为服务器的数据被其他人删除, 导致页数出错, 所以做个校验
	    {MaxPage, [], []}
    end.

sort_party(Partys) ->
    F = fun(A, B) ->
		IsA = is_private_party(A#party.type),
		IsB = is_private_party(B#party.type),
		case IsA == IsB of
		    false ->
			IsA > IsB;
		    true ->
			A#party.create_time > B#party.create_time
		end
	end,
    lists:sort(F, Partys).

sort_hot_party(Partys) ->
    F = fun(A, B) ->
		A#party.decoration > B#party.decoration
	end,
    lists:sort(F, Partys).


get_rest_time(CreateTime, Overdue) ->
    T = datetime:add_time(CreateTime, Overdue),
    datetime:diff_time(datetime:localtime(), T).

get_my_party_info(HouseID, Account) ->
    Overdue = common_def:get_val(party_alive_time),
    
    Party = case db:dirty_read(party, HouseID) of
		[] -> [];
		[P] -> P
	    end,

    Seconds = get_freeze_time(HouseID),
    case is_party_overdue(Party, Overdue) of
	true ->
	    #party_data{house_id=0,
			house_name="",
			account = "",
			player_name = "",
			type = 0,
			title="",
			desc="",
			create_time=datetime:localtime(),
			freeze_seconds=Seconds,
			rest_time=0};
	false ->
	    R = translate(Party, Overdue, Account),
	    R#party_data{freeze_seconds=Seconds}
    end.

translate(Party, Overdue, Account) ->
    Exp = calc_exp(Party, Account),
    MaxPerson = get_max_person(Party#party.house_tplt_id),
    CurPerson = get_cur_person(Party#party.house_id),
    #party_data{house_id=Party#party.house_id,
		house_name=Party#party.house_name,
		account=Party#party.account,
		player_name=Party#party.player_name,
		type=Party#party.type, 
		title=Party#party.title, 
		desc=Party#party.desc,
		create_time=Party#party.create_time,
		exp=Exp,
		cur_person=CurPerson,
		max_person=MaxPerson,
		freeze_seconds=0,
		rest_time=get_rest_time(Party#party.create_time, Overdue)}.

get_cur_person(TargetHouseID) ->
    Scene = house:get_house_name(TargetHouseID),
    case router:send(Scene, get_players) of
	undefined ->
	    0;
	Players ->
	    length(Players)
    end.


get_max_person(HouseTempID) ->
    HouseTplt = tplt:get_data(house_tplt, HouseTempID),
    HouseTplt#house_tplt.max_players.


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

create_party(HouseID, Account, HouseName, PlayerName, Type, Title, Desc, CostItems, FoodIDS) ->
    F = fun() ->
	  case db:read(party, HouseID) of
	      [] ->
		  try_create_party(HouseID, Account, HouseName, PlayerName, Type, Title, Desc, CostItems, FoodIDS);
	      [_] -> 
		  {false, ?msg_cannot_create_party}
	  end
	end,
    db:transaction(F).

try_create_party(HouseID, Account, HouseName, PlayerName, Type, Title, Desc, CostItems, FoodIDS) ->
    HouseData = house_pack:read(Account),

    Level = house_level_exp:get_level(HouseData),
    #level_info_tplt{party_cost_money=CostMoney} = 
	tplt:get_data(level_info_tplt, Level),
    
    Money = house_diamond:get_lover_diamond(HouseData),

    case Money >= CostMoney of
	false ->
	    {false, {?err_party_money_not_enough, [integer_to_list(CostMoney)]}};
	true ->	
	    HouseData0 = house_diamond:dec_diamond(CostMoney, HouseData),
	    OldPack = house_lover_package:get_lover_package(HouseData0),

	    Food_id_lists = [{FoodItemID, 1} || FoodItemID <- FoodIDS],
	    IDCountList = [{CostItemID, 1} || CostItemID <- CostItems] ++ Food_id_lists,
	
	    case house_lover_package:del_n_by_tempid(IDCountList, OldPack) of
		{false, Err} ->
		    {false, Err};
		{NewPack, DelMsgs} ->
		    NHouseData = house_lover_package:set_lover_package(NewPack, HouseData0),
		    FreezeTime = get_freeze_time(HouseID),
		    case FreezeTime > 0 of
			true ->
			    {false, {?err_create_party_fail_interval, 
				     [format_time(FreezeTime)]}};
			_ ->
			    Now = datetime:localtime(),
			    WriteList = [NHouseData,
					 #party{house_id=HouseID, account=Account,
						lover=house:get_lover(Account, NHouseData),
						house_tplt_id=NHouseData#house_data.template_id,
						house_name=HouseName, 
						level=house_level_exp:get_level(NHouseData),
						player_name=PlayerName,
						cost_items=convert_cost_items(CostItems),
						decoration=NHouseData#house_data.decoration,
						type=Type, title=Title, 
						desc=Desc, create_time=Now,
						max_point=common_def:get_val(party_max_point),
						food_ids=FoodIDS},
					 #party_create_time{house_id=HouseID, create_time=Now}
					],
			    case is_private_party(Type) of
				true ->
				    ItemID = common_def:get_val(private_party_cost_item_id),
				    case house_pack:del_item_by_tempid(ItemID, NHouseData) of
					{false, _NoItem} -> 
					    {false, need_item};
					{NewHouseData, Msgs} ->
					    [db:write(R) || R <- WriteList],
					    db:write(NewHouseData),
					    {ok, NewHouseData, DelMsgs ++ Msgs}						  
				    end;
				_ ->
				    [db:write(R) || R <- WriteList],
				    {ok, NHouseData, DelMsgs}
			    end

		    end
	    end
    end.
    

edit_party(HouseID, Account, Type, Title, Desc) ->
    F = fun() ->
		case db:read(party, HouseID) of
		    [] -> not_exist;
		    [P] ->
			case P#party.account == Account of
			    true ->
				db:write(P#party{type=Type, title=Title, desc=Desc}),
				ok;
			    false -> not_allow
			end
		end
	end,
    db:transaction(F).

del_party(Account, HouseID) ->
    F = fun() ->
		case db:read(party, HouseID) of
		    [] -> not_exist;
		    [P] ->
			case P#party.account == Account of
			    true ->
				db:delete({party, HouseID}),
				ok;
			    false -> not_allow
			end
		end
	end,
    db:transaction(F).

get_party(Type, Page, Account) ->
    Overdue = common_def:get_val(party_alive_time),
    %%del_time_over_party(Overdue),
    Partys = get_all_party(),
    get_party_list(Partys, Type, Page, Overdue, Account).

get_all_party() ->
    F = fun() ->
		Q = qlc:q([P || P <- db:table(party)]),
		qlc:e(Q)
	end,
    db:transaction(F).

update_party_20121227() ->
    [begin
	 [HouseData] = db:dirty_read(house_data, R#party.house_id),

	 NewR = R#party{
		  lover=house:get_lover(R#party.account, HouseData),
		  house_tplt_id=HouseData#house_data.template_id,
		  level=house_level_exp:get_level(HouseData)},
	 db:dirty_write(NewR)
     end || R <- get_all_party()],
    {atomic, ok}.

%% 派对是否过期了
is_party_overdue(Party) ->
    Overdue = common_def:get_val(party_alive_time),
    is_party_overdue(Party, Overdue).

is_party_overdue([], _Overdue) ->
    true;
is_party_overdue(Party, Overdue) ->
    datetime:diff_time(Party#party.create_time, datetime:localtime()) > Overdue.

%% 删除过期的party
%% del_time_over_party(Overdue) ->
%%     F = fun() ->
%% 		Q = qlc:q([db:delete({party, P#party.house_id}) || 
%% 			      P <- db:table(party), is_party_overdue(P, Overdue)
%% 			 ]),
%% 		qlc:e(Q)
%% 	end,
%%     db:transaction(F).

get_size() ->
    db:table_info(party,size).

get_freeze_time(HouseID) when is_integer(HouseID) ->
   case db:dirty_read(party_create_time, HouseID) of
       [] ->
	   0;
       [#party_create_time{create_time=CreateTime}] ->
	   PartyInterval = common_def:get_val(next_party_interval),
	   PartyInterval - datetime:diff_time(CreateTime, datetime:localtime()) 
   end.

format_time(Seconds) ->
    %%H = Seconds div 3600, 
    M = 
	case Seconds rem 60 of
	    0 ->
		Seconds div 60;
	    _ ->
		(Seconds div 60) + 1
	end,
    integer_to_list(M).
    %%fill_zero(integer_to_list(H)) ++ ":" ++ fill_zero(integer_to_list(M)).
    
%% fill_zero(Str) ->
%%     case length(Str) == 1 of
%% 	true ->
%% 	    [$0 | Str];
%% 	_ ->
%% 	    Str
%%     end.

is_private_party(PartyType) when is_integer(PartyType) ->
    PartyType =:= ?ivt_private.

%% 结算派对经验
fetch_exp(Seconds, Account, Party, HouseData) ->
    AliveTime = common_def:get_val(party_alive_time), 
    DiffTime = datetime:diff_time(Party#party.create_time, 
				  datetime:localtime()),

    case DiffTime > AliveTime of
	true ->
	    {0, 0, 0};
	_ ->
	    CloseSeconds = AliveTime - DiffTime,

	    IsOwner = house:is_house_owner(HouseData, Account),
	    IsPrivate = is_private_party(Party#party.type),
	    D = HouseData#house_data.decoration,
	    Level = house_level_exp:get_level(HouseData),
	    #level_info_tplt{max_decoration=MaxD,
			     party_owner_calc_exp_a=Ka,
			     party_guest_calc_exp_b=Kb} = 
		tplt:get_data(level_info_tplt, Level),
	    Percent = 100 + sum_add_exp_percent(Party),

	    RawExp = calc_party_exp0(D, MaxD, Seconds, IsOwner, IsPrivate, Ka, Kb, Party#party.account),
	    Exp = round(calc_party_exp1(RawExp, Percent)),

	    case CloseSeconds < Seconds of
		true ->
		    {CloseSeconds, 0, 0};
		_ ->
		    {Seconds, Exp, RawExp}
	    end

    end.

%% 返回PlayerData
start_buff(PlayerData) ->
    SceneName = player_data:get_scene_name(PlayerData),
    case house:id_from_name(SceneName) of
	[] -> %% 公共场景, 不在屋内
	    PlayerData;
	HouseID ->
	    case db:dirty_read(party, HouseID) of
		[] -> %% 没有办派对
		    PlayerData;
		[Party] ->
		    [HouseData] = db:dirty_read(house_data, HouseID),
		    start_buff(Party, HouseData, PlayerData)
	    end
    end.

add_exp_and_notify(Account, RawExp, HouseID) when is_atom(Account), is_integer(HouseID) ->
    case db:dirty_read(party, HouseID) of
	[] ->
	    false;
	[Party] -> 
	    Percent = 100 + sum_add_exp_percent(Party),
	    Exp = round(calc_party_exp1(RawExp, Percent)),
	    %% 由于策划善变，案子无法固定
	    %% 需要经验奖励改成新的积分奖励，由于其他旧有的计算经验的方式都不变，
	    %% 所以名字都按照经验的处理，只在最后的保存位置改成奖励积分
	    case Exp >= 0 of
		true ->
		    PlayerPoint = party_coin:add(Account, Exp),
		    router:cast(Account, on_party_add_point, Account),
		    party_coin:send2client(Account, PlayerPoint);
		false ->
		    ok
	    end,

	    %% house_level_exp:add_exp_and_notify(Exp, Account),
	    ok
    end.

%% 启动派对buff
start_buff(#party{house_id=HouseID}=Party, 
	   HouseData,
	   PlayerData) ->
    Account = player_data:get_account(PlayerData),
    %% Lover = house:get_lover(Account, HouseData),
    Seconds = common_def:get_val(party_exp_buf_seconds),

    case fetch_exp(Seconds, Account, Party, HouseData) of 
	{CloseSeconds, _Exp, RawExp} when CloseSeconds > 0 -> %% 有派对
	    F = fun(State) ->
			%% 结算
			case add_exp_and_notify(Account, RawExp, HouseID) of
			    ok ->
				%% 再次启动定时器
				start_buff(State);
			    _ -> State
			end
		end,

	    case player_data:get_party_buff_timer(PlayerData) of
		[] -> ok;
		OldT ->
		    erlang:cancel_timer(OldT)
	    end,

	    T = erlang:send_after(Seconds * 1000, self(), {timer, F}),
	    
	    
	    net_helper:send2client(Account, 
				   #notify_start_party_exp_timer{seconds=Seconds, 
								 hide_seconds=CloseSeconds,
								 exp=RawExp}),

	    player_data:set_party_buff_timer(T, PlayerData);
	_Other -> %% 没有派对
	    PlayerData
    end.


%% 停止派对buff
cancel_buff(PlayerData) ->
    Account = player_data:get_account(PlayerData),
    case player_data:get_party_buff_timer(PlayerData) of
	[] -> ok;
	T ->
	    net_helper:send2client(Account, #notify_stop_party_exp_timer{}),
	    erlang:cancel_timer(T)
    end,

    player_data:set_party_buff_timer([], PlayerData).


calc_exp(#party{account=A, lover=Lover, level=Level,
		type=Type, decoration=D}=Party, Account) ->
    IsOwner = case Account of
		  A -> true;
		  Lover -> true;
		  _ -> false
	      end,

    IsPrivate = is_private_party(Type),
    #level_info_tplt{max_decoration=MaxD,
		     party_owner_calc_exp_a=Ka,
		     party_guest_calc_exp_b=Kb} = 
	tplt:get_data(level_info_tplt, Level),

    Seconds = common_def:get_val(party_exp_buf_seconds),
    Percent = 100 + sum_add_exp_percent(Party),

    calc_party_exp(D, MaxD, Seconds, IsOwner, IsPrivate, Ka, Kb, Percent, A).


calc_party_exp(D, MaxD, Seconds, IsOwner, IsPrivate, Ka, Kb, Percent, Account) ->
    Ret = calc_party_exp0(D, MaxD, Seconds, IsOwner, IsPrivate, Ka, Kb, Account),
    round(calc_party_exp1(Ret, Percent)).
calc_party_exp1(Ret, Percent) ->
    (Ret * Percent) / 100.    
%% 豪华度/当前预期豪华度*系数A*累积时间
calc_party_exp0(_D, _MaxD, _Seconds, IsOwner, IsPrivate, Ka, Kb, Account) ->
    K = case IsOwner of
	    true -> Ka; 
	    _ -> Kb 
	end,

    K2 = case IsPrivate of
	     true ->
		 K * 2;
	     _ -> 
		 K
	 end,
    
    [BasicData] = db:dirty_read(player_basic_data, Account),
    Charm = player_basic_data:get_charm(BasicData),		% 魅力值
    round((20 + Charm / 100) * K2).

 
try_finish_party(HouseID) when is_integer(HouseID) ->
    F = fun() ->
		case db:read(party, HouseID) of
		    [] ->
			{ok, []};
		    [R] ->
			try_finish_party(R)
		end
	end,
    case db:transaction(F) of
	{_, Funs} ->
	    [Fn() || Fn <- Funs],
	    notify_stop_party(HouseID)
    end;	   
%% 返回{okOrfalse, Funs}
try_finish_party(#party{house_id=HouseID, account=Account, score=Score}) ->
    Rewards = common_def:get_val(party_rewards),
    Ret = 
	case util:is_process_alive(Account) of
	    true->
		finish_party(Account, [Rewards, Score]);
	    _ ->
		add_item_on_login(Account, [Rewards, Score]),
		{ok, []}
	end,

    party_items:on_stop_party(HouseID),
    db:delete({party, HouseID}),
    Ret.

add_item_on_login(Account, Args) ->
    login_actions:add(Account, ?MODULE, finish_party, Args).

%% 玩家上线后才发物品到背包
%% 返回{okOrfalse, Funs}
finish_party(Account, [Rewards, Score]) when 
      is_atom(Account),
      is_list(Rewards), 
      is_integer(Score) ->
    case calc_party_gain(Rewards, Score) of
	0 ->
	    {ok, []};
	ItemID ->
	    L = [#pair_int{key=K, value=V} || {K, V} <- Rewards],
	    ItemCount = 1,
	    HouseData = house_pack:read(Account),
	    {NHouseData, Msgs} = house_pack:add_items([{ItemID, ItemCount}], HouseData),
	    db:write(NHouseData),		    
	    FNotify = fun() ->
			      house_pack:send_msgs(Msgs, NHouseData),
			      net_helper:send2client(Account, 
						     #notify_party_gain{grade_scores=L,
									score=Score,item_id=ItemID})
		      end,
	    {ok, [FNotify]}	
    end.


%% 计算派对收获
calc_party_gain(Rewards, Score) ->
    L = lists:takewhile(fun({X, _Y}) -> X =< Score end, Rewards),
    case L of
	[] ->
	    0;
	_ ->
	    {_S, ItemID} = lists:last(L),
	    ItemID
    end.


party_exp_buffs_packet(#party{light_buffs=NewLights}) ->
    FullPercent = common_def:get_val(party_full_buff_add_exp),
    L = common_def:get_val(party_buff_exp),
    BuffExps = [#pair_int{key=ID, value=Percent} || {ID, Percent} <- L],
    TotalPercent = case length(NewLights) == length(L) of
		       true -> 
			   FullPercent;
		       _ ->
			   sum_percent(L, NewLights)
		   end,

    #notify_party_exp_buffs{buff_exps=BuffExps, 
				     lights=NewLights,
				     total_add_percent=TotalPercent}.




sum_add_exp_percent(#party{light_buffs=NewLights}) ->
    L = common_def:get_val(party_buff_exp),
    FullPercent = common_def:get_val(party_full_buff_add_exp),
    L = common_def:get_val(party_buff_exp),
    case length(NewLights) == length(L) of
	true -> 
	    FullPercent;
	_ ->
	    sum_percent(L, NewLights)
    end.
sum_percent(L, Lights) ->
    F = fun({ID, Percent}, Acc) ->
		case lists:member(ID, Lights) of
		    true ->
			Acc + Percent;
		    _ ->
			Acc
		end
	end,
    lists:foldl(F, 0, L).


notify_stop_party(HouseID) when is_integer(HouseID) ->
    SceneName = house:get_house_name(HouseID),
    router:cast(undefined, SceneName, broadcast_all_players, 
		     #notify_party_stop{}).


convert_cost_items(Items) ->
    KVList = common_def:get_val(party_cost_items),
    [V || {K, V} <- KVList, lists:member(K, Items)].


broadcast_exp_buffs(SceneName) ->
    LBuffs = common_def:get_val(party_buff_exp),
    
    BuffExps = [#pair_int{key=ID, value=Percent} || {ID, Percent} <- LBuffs],
    Packet = #notify_party_exp_buffs{buff_exps=BuffExps, 
				     lights=[],
				     total_add_percent=0},
    
    router:cast(undefined, SceneName, broadcast_all_players, 
		Packet).

broadcast_score(Players, #house_data{boy=Boy, girl=Girl}) ->
    Today = datetime:date(),
    [begin
	 N = get_remain_vote_times(P, Today),
	 HasVote =
	     case N > 0 of
		 true ->
		     case P of
			 Boy -> 1;
			 Girl -> 1;
			 _ -> 0
		     end;
		 _ ->
		     1
	     end,     
	 net_helper:send2client(P, #notify_party_score{score=0, has_vote=HasVote, 
						       remain_times=N})
     end || P <- Players].


get_remain_vote_times(Account, Today)  when is_atom(Account) ->
    common_def:get_val(party_max_vote) - 
	db:transaction(fun()-> read_today_vote_times(Account, Today) end).
    
read_today_vote_times(Account, Today)  when is_atom(Account) ->
    case db:read(party_vote, Account) of
	[#party_vote{today=Today, times=N}] -> N;
	_ -> 0
    end.

write_today_vote_times(Account, Today, Times) when is_atom(Account), is_integer(Times) ->
    db:write(#party_vote{account=Account, today=Today, times=Times}).

do_add_party_score(Account, HouseID, SceneName, Today) ->
    VoteTimes = read_today_vote_times(Account, Today),
    RemainTimes = common_def:get_val(party_max_vote) - VoteTimes,
    case RemainTimes =< 0 of
	true -> %% 次数超限
	    {false, ?err_whip_max};
	_ ->
	    case db:read(party, HouseID) of
		[] ->
		    {ok, []};
		[Party] ->
		    #party{score=Score, account=Master, player_name=MasterName, 
			   lover=Lover, vote_list=VoteList, max_point=MaxPoint} = Party,
		    case lists:member(Account, VoteList) of
			true -> %% 已投过票了
			    {false, ?msg_ring_task_task_has_complete};
			_ ->
			    HouseData = house_pack:read(Account),
			    case Account of
				Master -> %% 屋主不能投票
				    {false, ?err_target_is_empty};
				Lover ->
				    {false, ?err_target_is_empty};
				_ ->
				    Level = house_level_exp:get_level(HouseData),
				    #level_info_tplt{party_add_score=MayBeAddScore} = tplt:get_data(level_info_tplt, Level),
				    AddScore = case MaxPoint > MayBeAddScore of
						   true ->
						       MayBeAddScore;
						   false ->
						       MaxPoint
					       end,
				    case AddScore =< 0 of
					true ->
					    {false, ?party_exceed_max_point};
					false ->
					    NewScore = Score + AddScore,
					    FNotifyAddCoin = party_coin:tran_add(Master, AddScore),
					    NewParty = Party#party{score=NewScore, vote_list=[Account | VoteList], max_point=MaxPoint-AddScore},
					    db:write(NewParty),
					    write_today_vote_times(Account, Today, VoteTimes + 1),

					    %% 通知投票成功
					    Packet = #notify_party_score{score=NewScore, has_vote=1, remain_times=RemainTimes - 1},
					    [GuestData] = db:dirty_read(player_basic_data, Account),
					    GuestName = player_basic_data:get_username(GuestData),
					    PacketBroadcast = #notify_add_party_score{
					      total_score=NewScore,
					      add_score=AddScore,       %% 增加多少
					      guest_account=Account, %% 客人
					      guest_name=GuestName,    %% 玩家名
					      master_account=Master, %% 主人
					      master_name=MasterName},

					    FNotify = fun() -> 
							      router:cast(undefined, SceneName, broadcast_all_players, 
									  PacketBroadcast),

							      net_helper:send2client(Account, Packet) 	      
						      end,
					    {ok, [FNotify, FNotifyAddCoin]}
				    end
			    end
		    end			
	    end		   
    end.


give_party_master_item(FoodIDs, HouseData) ->
    give_party_master_item1(FoodIDs, HouseData, [], []).
    

%% 给予派对主人物品
give_party_master_item1([], HouseData, AllAddItem, AllItemMsg) ->
    {HouseData,  AllAddItem, AllItemMsg};

give_party_master_item1([FoodId | FoodIds], HouseData, AllAddItem, AllItemMsg) when is_integer(FoodId) ->
    F = fun() ->
		case tplt:get_data2(party_food_tplt, FoodId) of
		    #party_food_tplt{item_box_ids=Box_Ids, item_box_counts=Box_Counts} ->
			AddItem = lists:zip(Box_Ids, Box_Counts),
			{NHouseData, ItemMsgs} = house_pack:add_items(AddItem, HouseData),
			{NHouseData, AddItem, ItemMsgs}
		end 
	end,
    {NHouseData, AddItem, ItemMsgs} = db:transaction(F),
    give_party_master_item1(FoodIds, NHouseData, AddItem ++ AllAddItem, ItemMsgs ++ AllItemMsg).
   

%% 通知获取物品消息
send_item_msg(Account, AddItem) ->
    [begin
	 #item_tplt{name=Name} = tplt:get_data2(item_tplt, ItemID),
	 sys_msg:send(Account, ?msg_get_fruit_count, [Name, Count])
     end || {ItemID, Count} <- AddItem].


%% 获取派对主人
get_party_master(SceneName) ->
    case get_party(SceneName) of
	[] -> [];     
	Party ->
	    #party{account=Master, lover=Lover} = Party,
	    [Master, Lover]
    end.


%% 获取开启派对时使用的食物
get_party_food_eat(SceneName) ->
    case get_party(SceneName) of
	[] -> [];     
	Party ->
	    #party{food_ids=FoodIDs} = Party,
	    FoodIDs
    end.
%%-----------------------------------派对请喝酒------------------------------
%% 查询数据库, 请喝了多少次酒
handle_ask_drink_count(Account, SceneName, DrinkID) ->
    F = fun() ->
		#party_drink{shout=Shout} = get_party_drink(Account),
		Shout
	end,
    Shout = db:transaction(F),
    Tplt = tplt:get_data2(party_drink_tplt, DrinkID),
    case gen_scene:get_player_count(SceneName, []) of
	0 -> 
	    sys_msg:send(Account, ?msg_not_need_party_drink); %% 提示客户端不需要清酒, 因为没客人, 只有自己一个人
	1 -> 
	    sys_msg:send(Account, ?msg_not_need_party_drink); %% 提示客户端不需要清酒, 因为没客人, 只有自己一个人
	Count when Count > 1 -> 
	    do_ask_drink_count_impl(Account, Count, Tplt, Shout)
    end.

do_ask_drink_count_impl(Account, Count, Tplt, Shout) ->
    Count1 = Count - 1,
    Cost = calc_cost(Count1, Tplt#party_drink_tplt.price),
    ShoutData = [#shout_data{id=ID, count=C} || {ID, C} <- Shout],
    Packet = #notify_drink_count{shout=ShoutData, cost=Cost, scene_player_count=Count},
    net_helper:send2client(Account, Packet).


%% 请喝酒
handle_party_drink(Account, SceneName, DrinkID, PlayerData) ->
    Tplt = tplt:get_data2(party_drink_tplt, DrinkID),
    [BasicData] = db:dirty_read(player_basic_data, Account),
    UserName = player_basic_data:get_username(BasicData),
    F = fun() ->
		PartyDrink = get_party_drink(Account),
		PlayerList = gen_scene:get_players(SceneName),
		case length(PlayerList) of
		    0 -> [{Account, ?msg_not_need_party_drink, []}]; %% 提示客户端不需要清酒, 因为没客人, 只有自己一个人
		    1 -> [{Account, ?msg_not_need_party_drink, []}]; %% 提示客户端不需要清酒, 因为没客人, 只有自己一个人
		    Count1 when Count1 > 1 -> 
			Count = Count1 - 1,
			Cost = calc_cost(Count, Tplt#party_drink_tplt.price),
			case deduct_money(Account, Tplt#party_drink_tplt.type, Cost, PlayerData) of
			    ?pay_shipped ->
				give_party_score(Account, UserName, DrinkID, PartyDrink, PlayerList);
			    ?pay_error ->
				case Tplt#party_drink_tplt.type of
				    1 -> [{Account, ?err_not_enough_lover_diamond, []}];
				    _ -> []
				end
			end
		end
	end,
    SysMsg = db:transaction(F),
    [case Msg of
	 {Account1, Code, Params} ->
	     sys_msg:send(Account1, Code, Params);
	 Fun -> %% 这个函数主要是提示客户端获得的积分
	     Fun()
     end || Msg <- SysMsg].

%% 计算请酒需要花费多少
calc_cost(PlayerCount, Price) ->
    PlayerCount * Price.

%% 扣钱
deduct_money(Account, 1, Money, _PlayerData) ->%% 扣水晶
    [BasicData] = db:read(player_basic_data, Account),
    HouseID = player_basic_data:get_house_id(BasicData),
    [HouseData] = db:read(house_data, HouseID),
    F = fun(Ret, _HouseData2) ->
		case Ret of
		    true -> ?pay_shipped;
		    false -> ?pay_error
		end
	end,
    house_diamond:dec_diamond(Money, HouseData, F);
deduct_money(_Account, 2, Money, PlayerData) ->%% 扣爱情币
    ShipCallback = 
	fun(#order{status=Status}=_Order)-> 			   
		case (Status =:= ?order_payed) of
		    true ->
			?pay_shipped;
		    _ ->
			?pay_error
		end				       
	end,
    player_love_coin:pay([{0, 1, Money}], 
			 ShipCallback, 
			 ?order_goods_meta_party_drink, PlayerData).

%% 给派对积分
give_party_score(Account, UserName, DrinkID, MasterDrink, PlayerList) ->
    Tplt = tplt:get_data2(party_drink_tplt, DrinkID),
    %% 处理请客的人的积分
    MsgList = case is_drink_limit(DrinkID, MasterDrink#party_drink.shout, Tplt#party_drink_tplt.shout_count) of 
		  true -> %% 提示
		      [{Account, ?msg_party_drink_not_score, [Tplt#party_drink_tplt.name]}];
		  false -> 
		      MasterScore = Tplt#party_drink_tplt.master_score,
		      PartyCoinFun = party_coin:tran_add(Account, MasterScore),
		      Shout = add_drink_count(MasterDrink#party_drink.shout, DrinkID),
		      MasterDrink1 = MasterDrink#party_drink{shout=Shout},
		      db:write(MasterDrink1),
		      [{Account, ?msg_party_drink_have_score, [Tplt#party_drink_tplt.name, MasterScore]}, 
		       PartyCoinFun] %% 提示
	      end,

    %% 处理客人相关的积分
    MsgList1 = [begin
		    GuestDrink = get_party_drink(Player),
		    case is_drink_limit(DrinkID, GuestDrink#party_drink.shouted, Tplt#party_drink_tplt.shouted_count) of
			true -> %% 提示
			    {Account, ?msg_party_drink_guest_not_score, 
			     [UserName, Tplt#party_drink_tplt.name]};
			false -> 
			    GuestScore = Tplt#party_drink_tplt.guest_score,
			    PartyCoinFun1 = party_coin:tran_add(Player, GuestScore),
			    Shouted = add_drink_count(GuestDrink#party_drink.shouted, DrinkID),
			    GuestDrink1 = GuestDrink#party_drink{shouted=Shouted},
			    db:write(GuestDrink1),
			    %% 提示
			    [{Account, ?msg_party_drink_guest_have_score, 
			      [UserName, Tplt#party_drink_tplt.name, GuestScore]}
			     , PartyCoinFun1]
		    end 
		end || Player <- PlayerList],
    MsgList ++ lists:flatten(MsgList1).

%% 判断是否达到上限(请喝酒, 或者被请)
is_drink_limit(DrinkID, Shout, Limit) ->
    case lists:keyfind(DrinkID, #shout_data.id, Shout) of
	false -> false;
	#shout_data{count=Count} -> 
	    Count > Limit
    end.

%% 增加喝酒的次数(请喝酒和被请都可以)
add_drink_count(Shout, DrinkID) ->
    case lists:keyfind(DrinkID, #shout_data.id, Shout) of
	false -> [#shout_data{id=DrinkID, count=1}| Shout];
	S -> 
	    S1 = S#shout_data{count=S#shout_data.count+1},
	    lists:keyreplace(DrinkID, #shout_data.id, Shout, S1)
    end.

get_party_drink(Account) ->
    %% 每天都需要重新计算次数
    Now = datetime:localtime(),
    case db:read(party_drink, Account) of
	[] ->
	    #party_drink{account=Account, shout=[], shouted=[], time=Now};
	[PartyDrink] ->
	    Diff = datetime:diff_date(PartyDrink#party_drink.time, Now),
	    case Diff >= 24 * 60 * 60  of
		true ->
		    #party_drink{account=Account, shout=[], shouted=[], time=Now};
		false ->
		    PartyDrink
	    end
    end.
