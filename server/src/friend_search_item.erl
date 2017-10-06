%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%   派好友搜索物品 
%%% @end
%%% Created : 27 Jun 2012 by hongjx <hongjx@35info.cn>

-module(friend_search_item).

-include("packet_def.hrl").
-include("tplt_def.hrl").
-include("house_data.hrl").
-include("sys_msg.hrl").

-export([handle_cast/2, start/1]).

-export([cancel_search/1, get_cancel_search_list/1,
	 on_enter_house/3
	]).


-define(common_gain, 0).
-define(special_gain, 1).


-record(search_plan,
	{finish_time, %% 完成的时间点
	 whip_list=[],%% 好友帮忙鞭打列表
	 owner='',         %% 谁发起的
	 is_npc,
	 friend_account='',
	 friend_name=""
	}
       ).


%% 玩家搜索
-record(player_searching,
	{account,
	 finish_time, %% 完成的时间点
	 boss=''
	}).


start(Account) ->
    [
     router:make_event_source(?msg_req_open_search_items_ui, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_whip, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_update_search_items, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_search_items, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_quick_search_items, Account, {Account, ?MODULE})
    ].


%% 有人进场景, 通知当前谁在搜索  
on_enter_house(Account, #house_data{search_plan=Plan, house_id=HouseID}=HouseData, SceneState) 
  when is_atom(Account) ->
    case Plan of
	#search_plan{is_npc=IsNpc,
		     friend_account=FriendAccount,
		     friend_name=FriendName, 
		     whip_list=WhipList,
		     finish_time=FinishTime} ->
	    
	    S = datetime:diff_time(datetime:localtime(), FinishTime),
	    case S > 0 of
		true -> 
		    Packet = #notify_searching_items{is_npc=IsNpc,
						     friend_account=FriendAccount,
						     friend_name=FriendName,
						     whip_count=length(WhipList),
						     remain_seconds=S},

		    HouseID = house:get_house_id(HouseData),
		    SceneName = house:get_house_name(HouseID),

		    router:cast(Account, scene_msg, {SceneName, [Packet]});
		_ -> 
		    ok
	    end;
	_ -> %% 没有搜索任务
	    ok
    end,
    SceneState.


%%%===================================================================
%%% 处理handle_cast
%%%===================================================================
%% 请求开始收集
handle_cast({_Msg, #req_search_items{is_npc=IsNpc, 
				     friend_account=FriendStr, 
				     friend_name=FriendName
				    }}, State) ->
    
    Account = player_data:get_account(State),
    FriendAccount = list_to_atom(FriendStr),
    F = fun() ->
		try_search_items(Account, IsNpc, FriendAccount, FriendName, State)
	end,

    %% 
    case db:transaction(F) of
	{false, Err} ->
	    sys_msg:send(Account, Err);
	{ok, MFAList} ->
	    [erlang:apply(Mod, Fun, A) || {Mod, Fun, A} <- MFAList],
	    router:cast(Account, on_hire_friend, FriendAccount),
	    %% 通知有新自身消息
	    net_helper:send2client(Account, #notify_new_self_msgs{}),
	    net_helper:send2client(FriendAccount, #notify_new_self_msgs{})	    
    end,       

    {noreply, State};


%% 更新收集结果，取代定时器
handle_cast({_Msg, #req_update_search_items{}}, State) ->
    
    Account = player_data:get_account(State),
    SceneName = player_data:get_scene_name(State),
    SceneHouseID = house:id_from_name(SceneName),

    try_finish_search(SceneHouseID, Account),
    
    {noreply, State};


%% 开界面
handle_cast({_Msg, #req_open_search_items_ui{}}, State) ->
    Account = player_data:get_account(State),
    SceneName = player_data:get_scene_name(State),
    SceneHouseID = house:id_from_name(SceneName),

    case try_finish_search(SceneHouseID, Account) of
	{not_plan, HouseData} ->	    
	    Account = player_data:get_account(State),
	    [BasicData] = db:dirty_read(player_basic_data, Account),
	    HouseID = player_basic_data:get_house_id(BasicData),
	    case HouseID of
		SceneHouseID -> %% 自已家
		    MyCharm = player_basic_data:get_charm(BasicData),
		    ItemCount = get_item_count(HouseData),

		    Rate = calc_charm_rate(MyCharm),

		    net_helper:send2client(Account, #notify_open_search_items_ui{rate=Rate, item_count=ItemCount});
		_ ->
		    ok
	    end;
	_ ->
	    ok
    end,

    {noreply, State};


%% 自已立即完成
handle_cast({_Msg, #req_quick_search_items{whip_count=WhipCount}}, State) ->
    whip(State, WhipCount),
    {noreply, State};


% 好友帮忙鞭打，加快时间条
handle_cast({_Msg, #req_whip{}}, State) ->
    case whip(State) of
	true -> %% 成攻
	    Account = player_data:get_account(State),
	    router:cast(Account, on_whip_player_success, 1);
	_ ->
	    ok
    end,
    {noreply, State}.


%%%===================================================================
%%% 停止搜索 
%%%===================================================================
cancel_search(#house_data{search_plan=Plan}=HouseData) ->
    case Plan of 
	#search_plan{is_npc=0,
		     owner=Owner,
		     friend_account=FriendAccount} ->
	    case db:read(player_searching, FriendAccount) of
		[#player_searching{boss=Owner}] ->
		    db:delete({player_searching, FriendAccount});
		_ ->
		    ok
	    end;
	_ ->
	    ok
    end,
	
    %% 清空搜索
    HouseData#house_data{search_plan=undefined}.

get_cancel_search_list(#house_data{search_plan=Plan}) ->
    case Plan of 
	#search_plan{is_npc=0, 
		     owner=Owner,
		     friend_account=FriendAccount} ->
	    case db:dirty_read(player_searching, FriendAccount) of
		[#player_searching{boss=Owner}] ->
		    [{player_searching, FriendAccount}];
		_ ->
		    []
	    end;	    
	_ ->
	    []
    end.


%%%===================================================================
%%% 完成搜索
%%%===================================================================
try_finish_search(HouseID, Account) when is_integer(HouseID) ->
    F = fun() ->
		[HouseData] = db:read(house_data, HouseID),
		#house_data{search_plan=Plan, house_id=HouseID} = HouseData,
		
		case Plan of
		    #search_plan{is_npc=IsNpc, 
				 friend_account=FriendAccount,
				 friend_name=FriendName,
				 finish_time=FinishTime
				} ->

			S = datetime:diff_time(datetime:localtime(), FinishTime),
			
			case S =< 0 of
			    true -> 
				%% 成功后广播
				Packet = #notify_searching_items{is_npc=IsNpc,
								 friend_account=FriendAccount,
								 friend_name=FriendName,
								 whip_count=0,
								 remain_seconds=0},
				SceneName = house:get_house_name(HouseID),
				%% 男女主人才有权限完成
				case house:is_house_owner(HouseData, Account) of
				    true ->
					%% 成功后广播
					Packet = #notify_searching_items{is_npc=IsNpc,
									 friend_account=FriendAccount,
									 friend_name=FriendName,
									 whip_count=0,
									 remain_seconds=0},
					
					MFA = {router, cast, 
					       [undefined, SceneName, broadcast_all_players, Packet]},
					
					
					{ok, NHouseData, MFAList} = do_finish_search(HouseData),  	
					db:write(NHouseData),
					{ok, [MFA | MFAList]};		
				    _ ->
					%% 如果已完成，不是主人的话要关闭收集中...
					router:cast(Account, scene_msg, {SceneName, [Packet]}),

					{not_owner, HouseData}	 					
				end;
			    _ -> 
				{not_finish, HouseData}	 
			end;
		    _ ->
			{not_plan, HouseData}
		end

	end,

    case db:transaction(F) of
	{ok, MFAList} ->
	    [erlang:apply(Mod, Fun, A) || {Mod, Fun, A} <- MFAList];
	Other -> Other
    end.


%% 时间到了，完成搜索, 结算物品
do_finish_search(HouseData) ->
    #house_data{search_plan=Plan} = HouseData,
    case Plan of    
	#search_plan{owner=Owner, is_npc=IsNpc, 
		     friend_account=FriendAccount,
		     friend_name=FriendName
		    } ->

	    [BasicData] = db:read(player_basic_data, Owner),
	    
	    CommonItemCount = get_item_count(HouseData),
	    MyCharm = player_basic_data:get_charm(BasicData),
	    GridCount = get_grid_count(HouseData),
	    L = rand_items(GridCount, CommonItemCount, MyCharm),

	    ItemList = [{ItemID, Count} || {ItemID, Count} <- L, ItemID > 0],
	    {NHouseData, PackMsgs} = house_pack:add_items(ItemList, HouseData),

	    GainItems = [#vip_gift_item{item_id=ItemID, count=Count1} 
			 || {ItemID, Count1} <- L, ItemID > 0],

	    Packet = #notify_search_items_result{grid_count=GridCount, % 总格子数
						 gain_items=GainItems, % 获得的物品列表
						 is_npc=IsNpc, 
						 friend_account=FriendAccount,
						 friend_name=FriendName
						},

	    %% 如果主人不在线，要发离线消息
	    MFAList0 = 
		case house:get_lover(Owner, NHouseData) of
		    '' ->
			[send_msg_mfa(Owner, Packet)];
		    Lover ->
			[send_msg_mfa(Lover, Packet), send_msg_mfa(Owner, Packet)]
		end,

	    MFAList = [{house_pack, send_msgs, [PackMsgs, NHouseData]} | MFAList0],

	    MFAList1 = [{router, cast, [Owner, on_search_finish, Owner]} | MFAList],

	    NNHouseData = cancel_search(NHouseData),
	    {ok, NNHouseData, MFAList1};
	_ ->	    
	    {ok, HouseData, []}
    end.

%%%===================================================================
%%% 鞭打加速
%%%===================================================================
whip(State) ->
    whip(State, 1).
whip(_State, 0) ->
    false;
whip(State, WhipCount) ->
    Account = player_data:get_account(State),
    F = fun() ->
		try_whip(State, WhipCount)
	end,

    case db:transaction(F) of
	{false, Err} ->
	    sys_msg:send(Account, Err),
	    false;
	{ok, MFAList} ->
	    [erlang:apply(Mod, Fun, A) || {Mod, Fun, A} <- MFAList],
	    true
    end.       


try_whip(State, WhipCount) ->
    Account = player_data:get_account(State),
    SceneName = player_data:get_scene_name(State),
    SceneHouseID = house:id_from_name(SceneName),
    [HouseData] = db:read(house_data, SceneHouseID),
    #house_data{search_plan=Plan} = HouseData,
    case can_whip(SceneHouseID, Plan, WhipCount, HouseData, Account) of
	true ->
	    #search_plan{owner=Boss, is_npc=IsNpc, friend_account=FriendAccount, friend_name=FriendName} = Plan,
	    case calc_remain_seconds(Account, SceneHouseID, 
				     Plan, HouseData, WhipCount) of
		{false, Err} -> 
		    {false, Err};
		{RemainSeconds, NHouseData, Plan1, MFAList} -> 
		    self_msgs:add_whip_msg(Account, Boss, FriendAccount, IsNpc, WhipCount),
		    MFA2 = {net_helper, send2client, [Boss, #notify_new_self_msgs{}]},
		    MFA3 = {net_helper, send2client, [FriendAccount, #notify_new_self_msgs{}]},

		    %% 成功后广播
		    Packet = #notify_searching_items{is_npc=IsNpc,
						     friend_account=FriendAccount,
						     friend_name=FriendName,
						     whip_count=length(Plan1#search_plan.whip_list),
						     remain_seconds=RemainSeconds},
		    MFA = {router, cast, 
			   [undefined, SceneName, broadcast_all_players, Packet]},

		    case RemainSeconds > 0 of
			true ->
			    FinishTime = datetime:add_time(datetime:localtime(), RemainSeconds),

			    NPlan = Plan1#search_plan{finish_time=FinishTime},
			    
			    db:write(#player_searching{account=FriendAccount, 
							   boss=Boss,
							   finish_time=FinishTime}),
    
			    db:write(NHouseData#house_data{search_plan=NPlan}),

			    {ok, MFAList ++ [MFA, MFA2, MFA3]};
			_ -> %% 收集完成，结算物品到背包
			    {ok, NewHouseData, MFAList2} = do_finish_search(NHouseData),
			    db:write(NewHouseData),
			    {ok, MFAList ++ [MFA, MFA2, MFA3] ++ MFAList2}			    
		    end
	    end;
	Reason ->
	    Reason
    end.

can_whip(SceneHouseID, Plan, ReqWhipCount, HouseData, Account) ->
    try
	is_in_house(SceneHouseID),
	has_search_plan(Plan),
	
	is_whip_enough(ReqWhipCount, HouseData, Account)
    catch
	throw:Error ->
	    Error
    end.

is_in_house(SceneHouseID) ->
    case is_integer(SceneHouseID) of
	false -> %% 要在房间里才能鞭打
	    throw({false, ?err_whip_not_in_house});
	true ->
	    true
    end.

has_search_plan(Plan) ->
    case Plan of
	#search_plan{} ->
	    true;
	_ ->
	    throw({false, ?err_not_search_plan})
    end.

is_whip_enough(ReqWhipCount, HouseData, Account) ->
    TempIds = common_def:get_val(whip_item_id),
    WhipCount = house_pack:get_item_count_by_tempid(TempIds, HouseData),
    case house:is_house_owner(HouseData, Account) of
	false -> 
	    true;
	_ ->
	    case WhipCount > 0 of
		true ->
		    case ReqWhipCount =< WhipCount of
			true ->
			    true;
			false ->
			    throw({false, ?err_whip_not_enough})
		    end;
		false ->
		    throw({false, ?err_whip_not_exist})
	    end
    end.

calc_remain_seconds(Account, SceneHouseID, 
		    #search_plan{whip_list=WhipList,
				 finish_time=FinishTime}=Plan,
		    HouseData, WhipCount) ->
    TotalSeconds = datetime:diff_time(datetime:localtime(), FinishTime),
    %% 每个鞭子抵扣多少秒
    [MyBasicData] = db:read(player_basic_data, Account),
    MyHouseID = player_basic_data:get_house_id(MyBasicData),
    case SceneHouseID of
	MyHouseID -> %% 自已的房屋, 尽量完成    
	    SubSeconds = common_def:get_val(whip_item_sub_seconds),

	    %% 扣鞭子
	    WhipItems = common_def:get_val(whip_item_id),

	    NMax = case TotalSeconds rem SubSeconds of
			0 ->
			    TotalSeconds div SubSeconds;
			_ ->
			    (TotalSeconds div SubSeconds) + 1
		    end,
	    
	    NNeed = 
		case WhipCount > NMax of
		    true -> NMax;
		    _ -> WhipCount
		end,

	    {DelN, NHouseData, PackMsgs} = 
		house_pack:try_del_n_by_tempid(WhipItems, NNeed, HouseData),
	    case DelN of 
		0 ->
		    {false, ?err_no_error};
		_ ->
		    MFA = {house_pack, send_msgs, [PackMsgs, NHouseData]},
		    RemainSeconds = TotalSeconds - DelN * SubSeconds,
		    S = case RemainSeconds < 0 of
			    true -> 0;
			    _ -> RemainSeconds
			end,
		    {S, NHouseData, Plan, [MFA]}
		end;
	_ -> %% 在别人家, 帮忙加速
	    SubSeconds = common_def:get_val(whip_sub_seconds),
	    Max = common_def:get_val(whip_max),
	    case length(WhipList) >= Max of
		true -> %% 超过上限了
		    {false, ?err_whip_max};
		_ ->
		    case lists:member(Account, WhipList) of
			true ->
			    {false, ?err_you_has_whip};
			_ ->
			    %% 体力消耗, 加经验
			    CostHp = common_def:get_val(whip_cost_hp),
			    GainExp = common_def:get_val(whip_get_exp),

			    [MyHouseData] = db:read(house_data, MyHouseID),
			    case player_hp:dec_hp(CostHp, MyBasicData, MyHouseData) of
				{false, Error} -> 
				    {false, Error};
				{ok, NMyBasicData} ->
				    {NNMyBasicData, NMyHouseData, ExpHpMsgs} = 
					house_level_exp:add_exp(GainExp, NMyBasicData, MyHouseData),
				    db:write(NNMyBasicData),
				    MFA0 = {house_level_exp, send_msgs, [ExpHpMsgs, NMyHouseData]}, 
				    MFA1 = {player_hp, send, [Account, NNMyBasicData, NMyHouseData]},

				    %% 取记录，并修改剩余时间
				    RemainSeconds = TotalSeconds - SubSeconds,

				    S = case RemainSeconds < 0 of
					    true -> 0;
					    _ -> RemainSeconds			
					end,

				    MFA = {sys_msg, send, [Account, ?msg_help_boss_whip]},

				    {S, HouseData, 
				     Plan#search_plan{whip_list=[Account | WhipList]}, 
				     [MFA0, MFA1, MFA]}
			    end

		    end
	    end

    end.

%%%===================================================================
%%% 请好友搜索
%%%===================================================================
try_search_items(Account, IsNpc, FriendAccount, FriendName, State) ->
    case can_search_items(IsNpc, FriendAccount) of
	true ->
	    do_search_items(Account, IsNpc, FriendAccount, FriendName, State);
	Reason ->
	    Reason
    end.

can_search_items(IsNpc, FriendAccount) ->
    try
	is_player_busy(FriendAccount, IsNpc),
	is_player_exist(FriendAccount, IsNpc)
    catch
    	throw:Error ->
	    Error
    end.

is_player_busy(Account, IsNpc) ->
    case IsNpc == 0 of
	true ->
	    case db:dirty_read(player_searching, Account) of
		[#player_searching{finish_time=FinishTime}] ->
		    case FinishTime >= datetime:localtime() of
			true ->
			    throw({false, ?err_friend_is_searching});
			_ ->
			    ok
		    end;
		_ ->
		    true
	    end;
	false ->
	    true
    end.


is_player_exist(Account, IsNpc) ->
    case IsNpc == 0 of
	true ->
	    case player:is_exist(Account) of
		true ->
		    true;
		false ->
		    throw({false, ?err_account_cant_exist})
	    end;
	false ->
	    true
    end.


do_search_items(Account, IsNpc, FriendAccount, FriendName, State) ->
    {BasicData, HouseData} = read_basic_and_house_data(Account),
    #house_data{search_plan=CurPlan, house_id=HouseID} = HouseData,
    case CurPlan of
	#search_plan{} -> %% 当前已有收集任务了
	    {false, ?err_already_has_search_plan};
	_ ->
	    Cost = common_def:get_val(search_items_cost_diamond),
	    #house_data{lover_diamond=Money} = HouseData,
	    NMoney = Money - Cost,
	    case NMoney < 0 of
		true -> %% 钱不够
		    {false, ?err_not_enough_lover_diamond};	    	    
		_ ->		    
		    {GainExp, MFAList, HouseData0} = add_friend_exp(IsNpc, Cost, 
								    FriendAccount, 
								    BasicData, HouseData),
		    
		    #house_data{house_id=HouseID} = HouseData0,
		    RemainSeconds = common_def:get_val(search_items_cost_seconds),
		    FinishTime = datetime:add_time(datetime:localtime(), RemainSeconds),

		    Plan = #search_plan{finish_time=FinishTime,
					whip_list=[],
					is_npc=IsNpc,
					owner=Account,
					friend_account=FriendAccount,
					friend_name=FriendName
				       },

		    %% 扣钱
		    NHouseData = HouseData0#house_data{search_plan=Plan, lover_diamond=NMoney},

		    %% 保存到数据库    
		    db:write(NHouseData),
		    self_msgs:add_hire_msg(Account, Cost, FriendAccount, IsNpc, GainExp),
		    case IsNpc of
			0 -> %% 因每个人只能被雇一次，所以这里要记录
			    db:write(#player_searching{account=FriendAccount, 
							   boss=Account,
							   finish_time=FinishTime});
			_ ->
			    ok
		    end,

		    %% 成功后广播
		    Packet = #notify_searching_items{is_npc=IsNpc,
						     friend_account=FriendAccount,
						     friend_name=FriendName,
						     whip_count=0,
						     remain_seconds=RemainSeconds},

		    SceneName = player_data:get_scene_name(State),
		    
		    MFA0 = {house_diamond, notify, [NHouseData]},
		    MFA2 = {router, cast, [undefined, SceneName, broadcast_all_players, Packet]},
		    
		    {ok, [MFA0, MFA2 | MFAList]}
	    end
    end.

add_friend_exp(IsNpc, Cost, FriendAccount, MyBasicData, MyHouseData) ->
    case IsNpc of
	0 ->
	    %% 好友获得经验
	    GainExp = Cost * 5 div 2,
	    %%GainExp = 0,
	    IsOwner = house:is_house_owner(MyHouseData, FriendAccount),
	    {FriendBasicData, FriendHouseData} =
		case IsOwner of		    
		    true ->
			{MyBasicData, MyHouseData};
		    _ ->
			read_basic_and_house_data(FriendAccount)
		end,

	    {_NBasicData, NFriendHouseData, Msgs} = house_level_exp:add_exp(GainExp, 
									    FriendBasicData, 
									    FriendHouseData),
	    
	    %% 通知好友获得经验
	    MFA = {house_level_exp, send_msgs, [Msgs, NFriendHouseData]}, 

	    MyName = player_basic_data:get_username(MyBasicData),
	    Packet = #notify_sys_msg{code=?msg_search_item_gain_exp, 
				     params=[MyName, integer_to_list(GainExp)]}, 
	    NHouseData = case IsOwner of
			     true ->
				 NFriendHouseData;
			     _ ->
				 MyHouseData
			 end,

	    {GainExp, [MFA, send_msg_mfa(FriendAccount, Packet)], NHouseData};
	_ ->
	    {0, [], MyHouseData}
    end.


send_msg_mfa(Account, Packet) ->    
    case util:is_process_alive(Account) of
	true ->
	    {net_helper, send2client, [Account, Packet]};
	_ ->
	    {sys_msg, save_offline_msgs, [Account, [Packet]]}
    end.

    
%%%===================================================================
%%% 内部函数
%%%===================================================================
read_basic_and_house_data(Account) when is_atom(Account) ->
    [PlayerBasicData] = db:read(player_basic_data, Account),
    HouseID = player_basic_data:get_house_id(PlayerBasicData),
    [HouseData] = db:read(house_data, HouseID),
    {PlayerBasicData, HouseData}.

    

%% 算物品堆叠数量
get_item_count(#house_data{decoration=H}=HouseData) ->
    Level = house_level_exp:get_level(HouseData),
    #level_info_tplt{max_decoration=MaxH} = tplt:get_data(level_info_tplt, Level),
    get_item_count(H, MaxH, Level).

%% Base * 用户当前豪华度/当前等级最大豪华度 *（玩家房屋等级/5）
%% H: 当前豪华度 
%% MaxH: 最大豪华度 
%% Level: 房屋等级
get_item_count(H, MaxH, Level) ->
    Base = common_def:get_val(calc_search_item_count_base),

    N = 
	case H >= MaxH of
	    true -> %% 满了
		(Base * Level) div 5;
	    _ ->
		(Base * H * Level) div (5 * MaxH)
	end,

    case N < 1 of 
	true -> %% 最小数量为1
	    1;
	_ -> 
	    N
    end.    


rand_items(GridCount, CommonItemCount, MyCharm) ->
    %% 普通格0
    L0 = get_gain_item_list(?common_gain),
    %% 特殊格1
    L1 = get_gain_item_list(?special_gain),

    Rate0 = 100, %% 百分百获得普通材料
    Rate1 = calc_charm_rate(MyCharm), %% 特殊材料机率跟魅力值有关
    
    Items1 = [{rand_item_id(L1, Rate1), 1} || _X <- lists:seq(1, GridCount - 1)],
    [{rand_item_id(L0, Rate0), CommonItemCount} | Items1].

rand_item_id(TpltList, Percent) when is_list(TpltList) ->
    case rand:uniform(100) =< Percent of
	true -> %% 
	    %% 随机取一个
	    Rates = [X || #search_item_tplt{rate=X} <-  TpltList],
	    TotalRate = lists:sum(Rates),
	    Hit = rand:uniform(TotalRate),
	    {_Pos, #search_item_tplt{item_id=ItemID}} = util:rate_select_one(Hit, Rates, TpltList),
	    ItemID;
	_ ->
	    0
    end.

%% 取得到特殊物品的百分比
calc_charm_rate(MyCharm) ->
    L = get_charm_rate_list(),
    
    F = fun(#charm_rate_tplt{charm=Charm, rate=Rate}, {SaveCharm, _SaveRate}=Acc) ->
		case MyCharm >= Charm of
		    true ->
			case Charm > SaveCharm of
			    true ->
				{Charm, Rate};
			    _ ->
				Acc
			end;
		    _ ->
			Acc
		end
	end,

    {_Max, R} = lists:foldl(F, {0, 0}, L),
    R.

%% 取收获物品列表
get_gain_item_list(Type) ->
    [X || #search_item_tplt{type=T}=X <- tplt:get_all_data(search_item_tplt), T == Type].

get_charm_rate_list() ->
    tplt:get_all_data(charm_rate_tplt).

%% 取随机物品格子数
get_grid_count(HouseData) ->
    LevelList =  common_def:get_val(open_search_special_grid),
    Level = house_level_exp:get_level(HouseData),
    
    L = [X || X <-  LevelList, X =< Level],
    
    %% 默认一个普通格 + 一个特殊格 = 2
    %% 再加上等级附加的格子数
    2 + length(L).

