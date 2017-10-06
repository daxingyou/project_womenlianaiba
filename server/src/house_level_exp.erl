%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%  ����ȼ�����
%%% @end
%%% Created : 22 Feb 2012 by hongjx <hongjx@35info.cn>

-module(house_level_exp).

-include("tplt_def.hrl").
-include("packet_def.hrl").
-include("house_data.hrl").

-export([add_exp/2,    %% ���Ӿ���, �����ɵ��÷��ύ
	 add_exp/3,    %% ���Ӿ���, �����ɵ��÷��ύ	 
	 add_exp_and_notify/2 %% ���Ӿ���, ���ύ����
	]).

-export([notify/2, notify/3, 
	 get_level/1,		 
	 get_max_hp/1, 	
	 send_msgs/2]).

%% ͨ�����ݵȼ�����ȡ�����������	 
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
%%% ����ʱ֪ͨ�ͻ��� 
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
notify(Account, HouseData, BasicData) -> %% �����BasicData һ��Ҫ�����ѵ�
    Level = do_notify(Account, HouseData),
    case player_basic_data:get_account(BasicData) of
	Account ->
	    player_hp:send(Account, BasicData, Level);
	_ ->
	    ok
    end.



%%%===================================================================
%%% ���ӹ������飬
%%%   �Ѱ���������д���ݿ�ɹ��󣬻ᷢ��������Ϣ 
%%%===================================================================
add_exp_and_notify(0, _) ->
    ok;
add_exp_and_notify(Exp, Account) when Exp > 0,
				      is_atom(Account) ->
    F = fun() ->
		[BasicData] = db:read(player_basic_data, Account),
		add_exp(Exp, BasicData)
	end,

    %% �ύ����
    {_NBasicData, NHouseData, Msgs} = db:transaction(F),
    
    %% ֪ͨ�ͻ���
    send_msgs(Msgs, NHouseData),
    ok.

%%%===================================================================
%%% ���Ӿ��飬
%%%   ������Ҫ���͵���Ϣ�б�, ����ֵ��ʽΪ{NewBasicData, NewHouseData, Msgs}
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
		true -> %% ������, ������ҵ�����Ҫ����
		    NBasicData = BasicData#player_basic_data{hp=MaxHP},
		    ok = db:write(NBasicData),
		    case house:get_lover(Account, HouseData) of
			'' -> %% ����, ���ô���
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
				 restore_seconds=0, %% Ϊ0 ʱ�ͻ��˲��õ���ʱ
				 total_seconds=RestoreSeconds}]};
		_ -> %% û���������淿�����ݾͿ�����
		    {BasicData, NewHouse, [NotifyExp]}
	    end
    end.


%%%===================================================================
%%% �ڲ����� 
%%%===================================================================

%% ȡ�ȼ�����
get_level_exp(TotalExp) when is_integer(TotalExp) ->
    {Level, Exp, _MaxExp, _MaxHP, _RestoreSeconds} = calc_level_and_exp(1, TotalExp),
    {Level, Exp}.


%% ���ӹ�������
do_add_exp(Exp, TotalExp) 
  when Exp > 0 ->
    {OldLevel, CurExp} = get_level_exp(TotalExp),    
    {NewLevel, NewExp, MaxExp, MaxHP, RestoreSeconds} = calc_level_and_exp(OldLevel, CurExp + Exp),    
    {OldLevel, NewLevel, NewExp, MaxExp, MaxHP, RestoreSeconds}.


%% ����ֵ��ʽ�� {Level, Exp, MaxExp, MaxHP, RestoreSeconds}
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





