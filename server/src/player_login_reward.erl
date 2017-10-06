%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% 连续登录奖励
%%% @end
%%% Created :  8 May 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(player_login_reward).

-include("packet_def.hrl").
-include("router.hrl").
-include("common_def.hrl").
-include("enum_def.hrl").
-include("sys_msg.hrl").
-include("tplt_def.hrl").

-record(player_login_reward,       %% 玩家登录奖励
	{
	  account,                 %% 玩家帐号
	  login_info = []          %% 登录信息
	}).

-record(player_login_info,         %% 玩家登录信息
	{
	  login_date=#stime{},     %% 登录日期
	  reward_date=#stime{}     %% 奖励日期
	}).



-export([start/1, login/1, get_continue_login_day/1]).
-export([handle_cast/2]).
%%%===================================================================
%%% API
%%%===================================================================
start(Account) ->
    [router:make_event_source(?msg_req_give_login_reward, Account, {self(), ?MODULE}),
     router:make_event_source(?msg_req_login_list, Account, {self(), ?MODULE})
    ].

%% 取连续登陆天数
get_continue_login_day(Account) ->
    LoginDate = datetime:localtime(),
    PlayerLoginReward = get_player_login_reward(Account),
    case is_yestoday_login(PlayerLoginReward, LoginDate) of
	true ->
	    get_day(PlayerLoginReward);
	_ ->
	    0
    end.

login(Account) ->
    PlayerLoginReward = get_player_login_reward(Account),
    LoginDate = datetime:localtime(),
    case is_login(PlayerLoginReward, LoginDate) of
	true ->
	    case is_reward(PlayerLoginReward, LoginDate) of
		true ->
		    send_login_list(Account, PlayerLoginReward, ?st_hide);	    
		false ->
		    send_login_list(Account, PlayerLoginReward, ?st_show)
	    end;
	false ->
	    case is_yestoday_login(PlayerLoginReward, LoginDate) of
		true ->
		    NPlayerLoginReward = set_login(PlayerLoginReward, LoginDate),
		    send_login_list(Account, NPlayerLoginReward, ?st_show),
		    db:dirty_write(NPlayerLoginReward);
		false ->
		    NPlayerLoginReward = clear(PlayerLoginReward),
		    NNPlayerLoginReward = set_login(NPlayerLoginReward, LoginDate),
		    send_login_list(Account, NNPlayerLoginReward, ?st_show),
		    db:dirty_write(NNPlayerLoginReward)
	    end
    end.
%%%===================================================================
%%% Handle cast
%%%===================================================================
handle_cast({#msg{src=Account}, #req_login_list{}}, State) ->
    login(Account),
    {noreply, State};
handle_cast({#msg{src=Account}, #req_give_login_reward{}}, State) ->
    F = fun() ->
		PlayerLoginReward = get_player_login_reward(Account),
		[PlayerBasicData] = db:read(player_basic_data, Account),
		HouseId = player_basic_data:get_house_id(PlayerBasicData),
		[HouseData] = db:read(house_data, HouseId),
		LoginDate = datetime:localtime(),
		case can_reward(PlayerLoginReward, LoginDate) of
		    true ->
			{NPlayerLoginReward, NPlayerBasicData, NHouseData, Msgs, AddExpMsgs} = 
			    do_reward(Account, LoginDate, PlayerLoginReward, PlayerBasicData, HouseData),
			db:write(NPlayerLoginReward),
			db:write(NHouseData),
			db:write(NPlayerBasicData),
			{true, NPlayerLoginReward, Msgs, AddExpMsgs, NHouseData};
		    Reason ->
			Reason
		end
	end,
    case db:transaction(F) of
	{true, NPlayerLoginReward, Msgs, AddExpMsgs, NHouseData} ->
	    house_diamond:notify(NHouseData),
	    [net_helper:send2client(Account, Msg) || Msg <- Msgs],
	    house_level_exp:send_msgs(AddExpMsgs, NHouseData),
	    party_coin:notify(Account),
	    send_login_list(Account, NPlayerLoginReward, ?st_hide),
	    net_helper:send2client(Account, #notify_give_login_reward{});
	_ ->
	    ok
    end,
    {noreply, State}.
%%%===================================================================
%%% Internal Function
%%%===================================================================
%% 判断是否可以奖励
can_reward(PlayerLoginReward, LoginDate) ->
    case is_login(PlayerLoginReward, LoginDate) of
	true ->
	    case is_reward(PlayerLoginReward, LoginDate) of
		true ->
		    {false, has_reward};
		false ->
		    true
	    end;
	false ->
	    {false, cant_login}
    end.

%% 执行奖励
%% 奖励金钱，奖励物品, 设置奖励时间
do_reward(Account, LoginDate, PlayerLoginReward, PlayerBasicData, HouseData) ->
    Day = get_day(PlayerLoginReward),
    PlayerLoginRewardTplt = tplt:get_data(player_login_reward_tplt, Day),
    NPlayerLoginReward = set_reward(PlayerLoginReward, LoginDate),
    NHouseData = do_reward_diamond(PlayerLoginRewardTplt, HouseData),
    {NNHouseData, AddItemMsg} = do_reward_item(PlayerLoginRewardTplt, NHouseData),
    do_reward_point(Account, PlayerLoginRewardTplt),
    {NPlayerBasicData, NNNHouseData, AddExpMsgs} = 
	do_reward_exp(PlayerLoginRewardTplt, PlayerBasicData, NNHouseData),
    {NPlayerLoginReward, NPlayerBasicData, NNNHouseData, AddItemMsg, AddExpMsgs}.

do_reward_diamond(PlayerLoginRewardTplt, HouseData) ->
    Diamond = PlayerLoginRewardTplt#player_login_reward_tplt.diamond,
    house_diamond:add_diamond(Diamond, HouseData).

do_reward_item(PlayerLoginRewardTplt, HouseData) ->
    Items = PlayerLoginRewardTplt#player_login_reward_tplt.items,
    ItemsCount = PlayerLoginRewardTplt#player_login_reward_tplt.items_count,
    RewardItems = recombine_reward_items(Items, ItemsCount, []),
    case RewardItems /= [] of
	true ->
	    house_pack:add_items(RewardItems, HouseData);
	false ->
	    {HouseData, []}
    end.

do_reward_exp(PlayerLoginRewardTplt, PlayerBasicData, HouseData) ->
    Exp = PlayerLoginRewardTplt#player_login_reward_tplt.exp,
    house_level_exp:add_exp(Exp, PlayerBasicData, HouseData).

do_reward_point(Account, PlayerLoginRewardTplt) ->
    Point = PlayerLoginRewardTplt#player_login_reward_tplt.point,
    party_coin:add(Account, Point).

recombine_reward_items([], [], RewardItems) ->
    RewardItems;
recombine_reward_items([0], [0], RewardItems) ->
    RewardItems;
recombine_reward_items([RewardItem|RewardItems], [RewardItemCount|RewardItemsCount], NRewardItems) ->
    RewardItems1 = {RewardItem, RewardItemCount},
    recombine_reward_items(RewardItems, RewardItemsCount, [RewardItems1|NRewardItems]).

%% 发送登录结果
send_login_list(Account, PlayerLoginReward, IsShow) ->
    PlayerLoginInfo = PlayerLoginReward#player_login_reward.login_info,
    Info = build_login_list(PlayerLoginInfo),
    Packet = #notify_login_list{info=Info, type=IsShow},
    net_helper:send2client(Account, Packet).

%% 初始话玩家登录奖励结构
%% Account : 玩家帐号
%% reply   : #player_login_reward{}
init(Account) ->
    #player_login_reward{account=Account, login_info=[]}.

%% 清空玩家登录信息
%% PlayerLoginReward : #player_login_reward{}
%% reply             : #player_login_reard{login_info=[]}
clear(PlayerLoginReward) ->
    PlayerLoginReward#player_login_reward{login_info=[]}.

%% 判断是否登录过
%% PlayerLoginReward : #player_login_reward{}
%% LoginDate         : #stime{}
%% reply             : true or false
is_login(PlayerLoginReward, LoginDate) ->
    LoginInfo = PlayerLoginReward#player_login_reward.login_info,
    lists:foldl(fun(#player_login_info{login_date=Date}, IsLogin) -> 
			datetime:is_equal(Date, LoginDate) or IsLogin 
		end, false, LoginInfo).

get_day(PlayerLoginReward) ->
    LoginInfo = PlayerLoginReward#player_login_reward.login_info,
    length(LoginInfo).

%% 判断前一天是否登录过,如果没有登录过则清空登录信息
%% PlayerLoginReward : #player_login_reward{}
%% LoginDate         : #stime
%% reply             : true or false
is_yestoday_login(PlayerLoginReward, LoginDate) ->
    LoginInfo = PlayerLoginReward#player_login_reward.login_info,
    lists:foldl(fun(#player_login_info{login_date=Date}, IsLogin) ->
			(datetime:diff_date(Date, LoginDate) =< 86400) or IsLogin
		end, false, LoginInfo).

%% 设置登录时间
set_login(PlayerLoginReward, LoginDate) ->
    LoginInfo = PlayerLoginReward#player_login_reward.login_info,
    PlayerLoginInfo = #player_login_info{login_date=LoginDate},
    NLoginInfo = [PlayerLoginInfo|LoginInfo],
    NNLoginInfo = 
    case length(NLoginInfo) >= 5 of
	true ->
	    lists:sublist(NLoginInfo, 1, 5);
	false ->
	    NLoginInfo
    end,
    PlayerLoginReward#player_login_reward{login_info=NNLoginInfo}.

%% 判断是否奖励过
%% PlayerLoginReward : #player_login_reward{}
%% RewardDate        : #stime{}
%% reply             : true or false
is_reward(PlayerLoginReward, RewardDate) ->
    LoginInfo = PlayerLoginReward#player_login_reward.login_info,
    lists:foldl(fun(#player_login_info{reward_date=Date}, IsReward) -> 
			datetime:is_equal(Date, RewardDate) or IsReward 
		end, false, LoginInfo).

%% 设置奖励时间
%% PlayerLoginReward : #player_login_reward{}
%% RewardDate        : #stime{}
set_reward(PlayerLoginReward, RewardDate) ->
    LoginInfo = PlayerLoginReward#player_login_reward.login_info,
    NLoginInfo = lists:foldl(fun(#player_login_info{login_date=LoginDate}=PlayerLoginInfo, Infos) ->
				     NPlayerLoginInfo = 
					 case datetime:is_equal(LoginDate, RewardDate) of
					     true ->
						 PlayerLoginInfo#player_login_info{reward_date=RewardDate};
					     false ->
						 PlayerLoginInfo
					 end,
				     [NPlayerLoginInfo|Infos]
			     end, [], LoginInfo),
    PlayerLoginReward#player_login_reward{login_info=lists:reverse(NLoginInfo)}.

build_login_list(PlayerLoginInfo) ->
    lists:foldl(fun(#player_login_info{login_date=LoginDate, reward_date=RewardDate}, LoginList) ->
			LoginInfo = #login_info{login_date=LoginDate, reward_date=RewardDate},
			[LoginInfo | LoginList]
		end, [], PlayerLoginInfo).


%% 获取玩家登录奖励
get_player_login_reward(Account) ->
    case db:dirty_read(player_login_reward, Account) of
	[] ->
	    init(Account);
	[PlayerLoginReward] ->
	    PlayerLoginReward
    end.
