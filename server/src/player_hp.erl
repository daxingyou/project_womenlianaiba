%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%   体力值相关操作
%%% @end
%%% Created :  1 Mar 2012 by hongjx <hongjx@35info.cn>

-module(player_hp).

-include("packet_def.hrl").
-include("house_data.hrl").
-include("tplt_def.hrl").
-include("sys_msg.hrl").
-include("router.hrl").
-include("common_def.hrl").
-include("enum_def.hrl").
-include("resource.hrl").
-include("records.hrl").

-record(player_recover_hp, {account,
			    count,
			    datetime}).

-export([get_hp/2, get_hp/3]).

-export([start/1]).
-export([dec_hp/3, add_hp/3, save_hp/1, save_hp/2]).
-export([send/3]).

-export([handle_cast/2]).

%%%===================================================================
%%% api   
%%%===================================================================

start(Account) ->
    [router:make_event_source(?msg_req_start_recover_hp, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_recover_hp, Account, {Account, ?MODULE})].

%% 取体力值
get_hp(BasicData, #house_data{}=HouseData)->
    HouseLevel = house_level_exp:get_level(HouseData),
    get_hp(BasicData, HouseLevel, datetime:localtime());
get_hp(BasicData, HouseLevel) when is_integer(HouseLevel) ->
    get_hp(BasicData, HouseLevel, datetime:localtime()).


get_hp(#player_basic_data{hp=HP, hp_update_time=UpdateTime}, 
       HouseLevel, 
       #stime{}=Now) when is_integer(HouseLevel) ->
    get_hp(HP, UpdateTime, HouseLevel, Now).

    

%% 减少体力值
%%   成功返回{ok, NewBasicData}
%%   失败返回{false, ?err_hp_not_enough}
dec_hp(HPSub, BasicData, #house_data{}=HouseData) when is_integer(HPSub), HPSub >= 0 ->
    HouseLevel = house_level_exp:get_level(HouseData),
    dec_hp(HPSub, BasicData, HouseLevel);
dec_hp(HPSub, #player_basic_data{hp=HP, hp_update_time=UpdateTime}=BasicData, 
       HouseLevel) when is_integer(HPSub),
			is_integer(HouseLevel) ->

    Now = datetime:localtime(),

    {MaxHP, RestoreSeconds} = get_level_info(HouseLevel),
    {CurHP, OverSeconds, _Speed} = get_hp_and_over_seconds(HP, 
						    UpdateTime, 
						    MaxHP, 
						    RestoreSeconds, 
						    Now), 
    NewTime = datetime:dec_time(Now, OverSeconds),
    case HPSub > CurHP of
	true -> {false, ?err_hp_not_enough};
	_ ->
	    NewHP = CurHP - HPSub,
	    {ok, BasicData#player_basic_data{hp=NewHP, hp_update_time=NewTime}}
    end.
	     
%% 增加体力值
%%  返回 NewBasicData
add_hp(HPAdd, BasicData, #house_data{}=HouseData) when is_integer(HPAdd), HPAdd >= 0 ->
    HouseLevel = house_level_exp:get_level(HouseData),
    add_hp(HPAdd, BasicData, HouseLevel);
add_hp(HPAdd, #player_basic_data{hp=HP, hp_update_time=UpdateTime}=BasicData, 
       HouseLevel) when is_integer(HPAdd),
			is_integer(HouseLevel) ->
    Now = datetime:localtime(),
    {MaxHP, RestoreSeconds} = get_level_info(HouseLevel),
    
    {CurHP, OverSeconds, _Speed} = get_hp_and_over_seconds(HP, 
						    UpdateTime, 
						    MaxHP, 
						    RestoreSeconds, 
						    Now), 
    NewTime = datetime:dec_time(Now, OverSeconds),
    NewHP = CurHP + HPAdd,

    BasicData#player_basic_data{hp=NewHP, hp_update_time=NewTime}.

%% 修改玩家的体力值
%% Proc = Proc(BasicData, HouseData)
%% Proc 需要返回如下的值{ok, NewBasicData} 或者 {ok, NewBasicData, Other} 或者 {false, Reason}
%% modify_hp的返回值: {ok, HouseData, OldBasicData, NewBasicData} 或者 {ok, HouseData, OldBasicData, NewBasicData}
%%               或者 {false, Reason}
save_hp(BasicData) when is_record(BasicData, player_basic_data) ->
    db:write(BasicData).

save_hp(Account, Proc) when is_function(Proc) ->
    F = fun() ->
		[BasicData] = db:read(player_basic_data, Account),
		[HouseData] = db:read(house_data, player_basic_data:get_house_id(BasicData)),
		Ret = Proc(BasicData, HouseData),
		case Ret of
		    {ok, NBasicData} ->	
			db:write(NBasicData),
			{ok, HouseData, BasicData, NBasicData};
		    {ok, NBasicData, Other} ->	
			db:write(NBasicData),
			{ok, HouseData, BasicData, NBasicData, Other};
		    False -> False
		end
	end,
    db:transaction(F).


%% 取发送内容	    
get_send_packet(#player_basic_data{hp=HP, hp_update_time=UpdateTime}, HouseLevel) 
  when is_integer(HouseLevel) ->
    #level_info_tplt{max_hp=MaxHP, hp_restore_time=RestoreSeconds} 
	= tplt:get_data2(level_info_tplt, HouseLevel),

    Now = datetime:localtime(),
    {NewHP, OverSeconds, Speed} = get_hp_and_over_seconds(HP, UpdateTime, MaxHP, RestoreSeconds, Now),
   
    RemainSeconds = case NewHP >= MaxHP of
			true -> 0;
			_ -> Speed - OverSeconds
		    end,

    #notify_hp{hp=NewHP, max_hp=MaxHP, 
	       restore_seconds=RemainSeconds, total_seconds=Speed}.



%% 发送网络消息	     
send(Account, BasicData, HouseLevel) when is_atom(Account),
					  is_integer(HouseLevel) ->
    Packet = get_send_packet(BasicData, HouseLevel),
    net_helper:send2client(Account, Packet);

send(Account, BasicData, HouseData) ->
    HouseLevel = house_level_exp:get_level(HouseData),
    send(Account, BasicData, HouseLevel).

handle_cast({#msg{src=Account}, #req_start_recover_hp{}}, State) ->
    PlayerRecoverHP = get_player_recover_hp(Account),
    Now = datetime:localtime(),
    LastRecoverDate = PlayerRecoverHP#player_recover_hp.datetime,
    NPlayerRecoverHP = 
	case datetime:diff_date(LastRecoverDate, Now) > 0 of
	    true ->
		PlayerRecoverHP1 = PlayerRecoverHP#player_recover_hp{count=0, datetime=Now},
		db:dirty_write(PlayerRecoverHP1),
		PlayerRecoverHP1;
	    false ->
		PlayerRecoverHP
	end,
    [PlayerBasicData] = db:dirty_read(player_basic_data, Account),
    [HouseData] = db:dirty_read(house_data, player_basic_data:get_house_id(PlayerBasicData)),
    HouseLevel = house_level_exp:get_level(HouseData),
    #level_info_tplt{max_hp=MaxHP} = tplt:get_data2(level_info_tplt, HouseLevel),
    CurrHP = get_hp(PlayerBasicData, HouseData),
    DiffHP = MaxHP - CurrHP,
    Count =  NPlayerRecoverHP#player_recover_hp.count + 1,
    NeedLoveCoin = round((DiffHP * 0.5) * Count),
    case can_recover_hp(DiffHP, Count) of
	true ->
	    net_helper:send2client(Account, #notify_start_recover_hp{count=Count, 
								     hp=DiffHP, 
								     love_coin=NeedLoveCoin});
	{false, Reason} ->
	    sys_msg:send(Account, Reason)
    end,
    {noreply, State};
handle_cast({#msg{src=Account}, #req_recover_hp{}}, State) ->
    PlayerRecoverHP = get_player_recover_hp(Account),
    [PlayerBasicData] = db:dirty_read(player_basic_data, Account),
    [HouseData] = db:dirty_read(house_data, player_basic_data:get_house_id(PlayerBasicData)),
    HouseLevel = house_level_exp:get_level(HouseData),
    #level_info_tplt{max_hp=MaxHP} = tplt:get_data2(level_info_tplt, HouseLevel),
    CurrHP = get_hp(PlayerBasicData, HouseData),
    DiffHP = MaxHP - CurrHP,
    Count =  PlayerRecoverHP#player_recover_hp.count + 1,
    NeedLoveCoin = round((DiffHP * 0.5) * Count),
    case can_recover_hp(DiffHP, Count) of
	true ->
	    ShipCallback = 
		fun(#order{status=Status}=_Order)-> 			   
			case (Status =:= ?order_payed) of
			    true ->
				do_recover_hp(Account, DiffHP, Count, PlayerRecoverHP, PlayerBasicData, HouseData),
				?pay_shipped;
			    _ ->
				?pay_error
			end				       
		end,

	    player_love_coin:pay([{0, 1, NeedLoveCoin}], ShipCallback, ?order_goods_meta_hp, State);
	{false, Reason} ->
	    sys_msg:send(Account, Reason)
    end,
    {noreply, State}.

%%%===================================================================
%%% 内部函数   
%%%===================================================================
can_recover_hp(DiffHP, Count) ->
    case DiffHP > 0 of
	true ->
	    case Count =< 10 of
		true ->
		    true;
		false ->
		    {false, ?player_hp_count_error}
	    end;
	false ->
	    {false, ?player_hp_overflow}
    end.

do_recover_hp(Account, DiffHP, Count, PlayerRecoverHP, PlayerBasicData, HouseData) ->
    Now = datetime:localtime(),
    NPlayerBasicData = add_hp(DiffHP, PlayerBasicData, HouseData),
    NPlayerRecoverHP = PlayerRecoverHP#player_recover_hp{count=Count, datetime=Now},
    db:dirty_write(NPlayerBasicData),
    db:dirty_write(NPlayerRecoverHP),
    send(Account, NPlayerBasicData, HouseData),
    net_helper:send2client(Account, #notify_recover_hp{}).

get_hp(HP, 
       #stime{}=UpdateTime, 
       HouseLevel, 
       #stime{}=Now) 
  when is_integer(HP), is_integer(HouseLevel) ->
    {MaxHP, RestoreSeconds} = get_level_info(HouseLevel),
    
    get_hp(HP, UpdateTime, MaxHP, RestoreSeconds, Now). 
     

get_hp(HP, UpdateTime, MaxHP, RestoreSeconds, Now) ->
    {NewHP, _OverS, _Speed} = get_hp_and_over_seconds(HP, UpdateTime, MaxHP, RestoreSeconds, Now),
    NewHP.

get_hp_and_over_seconds(HP, 
       #stime{}=UpdateTime, 
       MaxHP, 
       RestoreSeconds, 
       #stime{}=Now) 
  when is_integer(HP), is_integer(MaxHP), is_integer(RestoreSeconds) ->
    Seconds = datetime:diff_time(UpdateTime, Now),
    Speed = get_speed(Now, RestoreSeconds),
    case Seconds < 0 of
	true -> %% 服务器时间被改过会出现这种情况
	    {HP, 0, Speed};
	_ ->

	    %% 根据hp回复速度，算出要回复多少
	    GainHP = Seconds div Speed,

	    case GainHP + HP >= MaxHP of
		true -> 
		    case HP > MaxHP of
			true ->
			    {HP, 0, Speed};
			_ ->
			    {MaxHP, 0, Speed}
		    end;
		_ -> 
		    {GainHP + HP, Seconds rem Speed, Speed}
	    end
    end.

get_level_info(HouseLevel) when is_integer(HouseLevel) ->
    Tplt = tplt:get_data2(level_info_tplt, HouseLevel),
    #level_info_tplt{max_hp=MaxHP, 
		     hp_restore_time=RestoreSeconds} = Tplt,
    {MaxHP, RestoreSeconds}.

in_quick_time(Now) ->
    {From, To} = common_def:get_val(quick_hp_effect_time),
    (From < Now) and (Now < To).

get_speed(Now, RestoreSeconds) ->
    Speed = case in_quick_time(Now) of
		true ->
		    Percent = common_def:get_val(quick_hp_percent),
		    RestoreSeconds * Percent div 100;
		_ ->
		    RestoreSeconds
	    end,
    Speed.

get_player_recover_hp(Account) ->
    case db:dirty_read(player_recover_hp, Account) of
	[] ->
	    Now = datetime:localtime(),
	    #player_recover_hp{account=Account, count=0, datetime=Now};
	[PlayerRecoverHp] ->
	    PlayerRecoverHp
    end.
