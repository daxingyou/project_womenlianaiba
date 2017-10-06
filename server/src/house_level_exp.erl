%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%  房间等级经验
%%% @end
%%% Created : 22 Feb 2012 by hongjx <hongjx@35info.cn>

-module(house_level_exp).

-include("tplt_def.hrl").
-include("packet_def.hrl").
-include("house_data.hrl").

-export([add_exp/2,    %% 增加经验, 事务由调用方提交
	 add_exp/3,    %% 增加经验, 事务由调用方提交	 
	 add_exp_and_notify/2 %% 增加经验, 会提交事务
	]).

-export([notify/2, notify/3, 
	 get_level/1,		 
	 get_max_hp/1, 	
	 send_msgs/2]).

%% 通过房屋等级或经验取玩家体力上限	 
get_max_hp(#house_data{exp=TotalExp}) ->
    get_max_hp(TotalExp);
get_max_hp(TotalExp) when is_integer(TotalExp) ->
    {_Level, _Exp, _MaxExp, MaxHP, _RestoreSeconds} = calc_level_and_exp(1, TotalExp),
    MaxHP.

get_level(#house_data{exp=TotalExp}) ->
    get_level(TotalExp);
get_level(TotalExp) when is_integer(TotalExp) ->
    {Level, _Exp} = get_level_exp(TotalExp),
    Level.
   
send_msgs(Msgs, #house_data{boy=Boy, girl=Girl}) when is_list(Msgs) ->
    [house:broadcast_owners(Boy, Girl, Packet) || Packet <- Msgs].


%%%===================================================================
%%% 上线时通知客户端 
%%%===================================================================
do_notify(Account, #house_data{exp=TotalExp}) ->
    {Level, Exp} = get_level_exp(TotalExp),
    
    #level_info_tplt{exp=MaxExp} 
	= tplt:get_data2(level_info_tplt, Level),

    net_helper:send2client(Account, 
			   #notify_level_exp{level=Level, exp=Exp, max_exp=MaxExp}),

    player_move_house:notify(Account),
    Level.
notify(Account, HouseData) ->
    do_notify(Account, HouseData).    
notify(Account, HouseData, BasicData) -> %% 这里的BasicData 一定要是自已的
    Level = do_notify(Account, HouseData),
    case player_basic_data:get_account(BasicData) of
	Account ->
	    player_hp:send(Account, BasicData, Level);
	_ ->
	    ok
    end.



%%%===================================================================
%%% 增加公共经验，
%%%   已包含事务处理，写数据库成功后，会发送网络消息 
%%%===================================================================
add_exp_and_notify(0, _) ->
    ok;
add_exp_and_notify(Exp, Account) when Exp > 0,
				      is_atom(Account) ->
    F = fun() ->
		[BasicData] = db:read(player_basic_data, Account),
		add_exp(Exp, BasicData)
	end,

    %% 提交事务
    {_NBasicData, NHouseData, Msgs} = db:transaction(F),
    
    %% 通知客户端
    send_msgs(Msgs, NHouseData),
    ok.

%%%===================================================================
%%% 增加经验，
%%%   返回需要发送的消息列表, 返回值格式为{NewBasicData, NewHouseData, Msgs}
%%%===================================================================
add_exp(0, _) ->
    {'', '', []};
add_exp(Exp, Account) when Exp > 0, 
			       is_atom(Account) ->
    [BasicData] = db:read(player_basic_data, Account),
    add_exp(Exp, BasicData);
add_exp(Exp, #player_basic_data{}=BasicData) when Exp > 0 ->
    HouseID = player_basic_data:get_house_id(BasicData),
    [HouseData] = db:read(house_data, HouseID),
    add_exp(Exp, BasicData, HouseData).

add_exp(0, BasicData, HouseData) ->
    {BasicData, HouseData, []};
add_exp(Exp, #player_basic_data{}=BasicData, 
	#house_data{exp=OldTotalExp}=HouseData) when Exp > 0 ->

    Account = player_basic_data:get_account(BasicData),
    
    {OldLevel, NewLevel, NewExp, MaxExp, MaxHP, RestoreSeconds} = do_add_exp(Exp, OldTotalExp),
    case OldLevel >= common_def:get_val(max_level) of
	 true ->
	    {BasicData, HouseData, []};
	_ ->
	    NotifyExp = #notify_level_exp{level=NewLevel, exp=NewExp, max_exp=MaxExp},
	    NewHouse = HouseData#house_data{exp=Exp + OldTotalExp},
	    ok = db:write(NewHouse),
	    case OldLevel < NewLevel of
		true -> %% 升级了, 两个玩家的体力要补满
		    NBasicData = BasicData#player_basic_data{hp=MaxHP},
		    ok = db:write(NBasicData),
		    case house:get_lover(Account, HouseData) of
			'' -> %% 单身, 不用处理
			    ok;
			Lover ->
			    [LoverBasicData] = db:read(player_basic_data, Lover),
			    ok = db:write(LoverBasicData#player_basic_data{hp=MaxHP})
		    end,
		    router:cast(Account, house_level_up, NewLevel),
		    {NBasicData, NewHouse,
		     [NotifyExp, 
		      #notify_hp{hp=MaxHP, 
				 max_hp=MaxHP, 
				 restore_seconds=0, %% 为0 时客户端不用倒计时
				 total_seconds=RestoreSeconds}]};
		_ -> %% 没升级，保存房屋数据就可以了
		    {BasicData, NewHouse, [NotifyExp]}
	    end
    end.


%%%===================================================================
%%% 内部函数 
%%%===================================================================

%% 取等级经验
get_level_exp(TotalExp) when is_integer(TotalExp) ->
    {Level, Exp, _MaxExp, _MaxHP, _RestoreSeconds} = calc_level_and_exp(1, TotalExp),
    {Level, Exp}.


%% 增加公共经验
do_add_exp(Exp, TotalExp) 
  when Exp > 0 ->
    {OldLevel, CurExp} = get_level_exp(TotalExp),    
    {NewLevel, NewExp, MaxExp, MaxHP, RestoreSeconds} = calc_level_and_exp(OldLevel, CurExp + Exp),    
    {OldLevel, NewLevel, NewExp, MaxExp, MaxHP, RestoreSeconds}.


%% 返回值格式： {Level, Exp, MaxExp, MaxHP, RestoreSeconds}
calc_level_and_exp(Level, Exp) when is_integer(Level),
				    is_integer(Exp),
				    Exp >= 0,
				    Level > 0 ->
    Tplt = tplt:get_data2(level_info_tplt, Level),
    #level_info_tplt{exp=MaxExp, 
		     max_hp=MaxHP, 
		     hp_restore_time=RestoreSeconds} = Tplt,
	    
    case Exp >= MaxExp of
	true ->
	    calc_level_and_exp(Level + 1, Exp - MaxExp);
	_ ->
	    {Level, Exp, MaxExp, MaxHP, RestoreSeconds}
    end.





