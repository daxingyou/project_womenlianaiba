%%% @author wujd <wujd@35info.com>
%%% @copyright (C) 2013, wujd
%%% @doc
%%% �ɶ�ʳ��
%%% @end
%%% Created : 30 Jul 2013 by wujd <wujd@35info.com>

-module(party_food).

-include("packet_def.hrl").
-include("records.hrl").
-include("common_def.hrl").
-include("router.hrl").
-include("tplt_def.hrl").
-include("sys_msg.hrl").

-record(party_food_eat, {account,
		   time, 			%% �����賿ʱ��
		   count			%% �����ѳ�ʳ�����
		  }).


-compile(export_all).

-define(food_eat_count_max, 20).		%% ÿ��ɳ�ʳ��������

%% ====================================================================
start(Account) ->
    [
     router:make_event_source(?msg_req_party_food_eat, Account, {Account, ?MODULE})
    ].


handle_cast({#msg{src=Account}, #req_party_food_eat{food_id=FoodID}}, State) ->
    [BasicData] = db:dirty_read(player_basic_data, Account),
    HouseID = player_basic_data:get_house_id(BasicData),
    [HouseData] = db:dirty_read(house_data, HouseID),
    case get_can_food_eat(State, FoodID, HouseData) of
	false -> 
	    false;
	true -> 
	    NHouseData = dec_diamond(FoodID, HouseData),        % �۳�ˮ��
	    NBasicData = add_hp(FoodID, NHouseData, BasicData),	% ��������
	    {NNHouseData, AddItem, ItemMsgs} = give_item(FoodID, NHouseData),	% ������Ʒ
	 
	    add_point(Account, FoodID),		% �������
	    set_food_eat_count(Account),	% ���õ�ǰ��ʳ�����

	    %% �־û�
	    db:dirty_write(NBasicData),
	    db:dirty_write(NNHouseData),
	    
	    %% ֪ͨ�ͻ���
	    house_diamond:notify(NNHouseData),
	    player_hp:send(Account, NBasicData, NNHouseData),
	    send_item_msg(Account, AddItem),
	    %%party_coin:notify(Account),
	    notify(Account),
	    house_pack:send_msgs(ItemMsgs, NNHouseData),
	    party_coin:send2client(Account)

    end,
    {noreply, State}.


%% ��������
add_hp(FoodID, HouseData, PlayerBasicData) -> 
    F = fun() ->
		case tplt:get_data2(party_food_tplt, FoodID) of
		    #party_food_tplt{hp=AddHP} ->
			player_hp:add_hp(AddHP, PlayerBasicData, HouseData)
		end
	end,
    db:transaction(F).


%% �������
add_point(Account, FoodID) ->
    F = fun() ->
		case tplt:get_data2(party_food_tplt, FoodID) of
		    #party_food_tplt{point=AddPoint} ->
			party_coin:tran_add(Account, AddPoint)
		end
	end,
    db:transaction(F).


%% �۳�ˮ��
dec_diamond(FoodID, HouseData) ->
    F = fun() ->
		case tplt:get_data2(party_food_tplt, FoodID) of
		    #party_food_tplt{diamond=Diamond} ->
			NHouseData = house_diamond:dec_diamond(Diamond, HouseData),
			NHouseData
		end
	end,
    db:transaction(F).
    

%% ������Ʒ
give_item(FoodID, HouseData) ->
    F = fun() ->
		ItemInfo = get_item_info(FoodID),
		Rand = random:uniform(10000),
		AddItem = give_items_impl(ItemInfo, Rand),
		{NHouseData, ItemMsgs} = house_pack:add_items(AddItem, HouseData),
		{NHouseData, AddItem, ItemMsgs}
	end,
    db:transaction(F).


give_items_impl([], _RandRest) ->
    [];
give_items_impl([{{Item, Count}, Ratio} | _ItemRest], RandRest) when RandRest - Ratio =< 0 -> 
    [{Item, Count}];
give_items_impl([{{_Item, _Count}, Ratio} | ItemRest], RandRest) -> 
    give_items_impl(ItemRest, RandRest - Ratio).


get_item_info(FoodID) ->
    F = fun() ->
		case tplt:get_data2(party_food_tplt, FoodID) of
		    #party_food_tplt{item_ids=ItemIDLists, item_counts=CountLists, item_rate=RateLists} ->
			ItemInfo = lists:zip(ItemIDLists, CountLists),
			NItemInfo = lists:zip(ItemInfo, RateLists),
			NItemInfo
		end
	end,
    db:transaction(F).


%% ��֤ˮ���Ƿ��㹻
can_food_eat_by_diamond(FoodID, HouseData) ->
    
    Diamond = house_diamond:get_lover_diamond(HouseData),
    case tplt:get_data2(party_food_tplt, FoodID) of
	#party_food_tplt{diamond=NeedDiamond} ->
	    Diamond >= NeedDiamond
    end.
   

%% @doc
%% �ɷ���ɶ�ʳ��
%% @end
get_can_food_eat(PlayerData, FoodID, HouseData) ->
    SceneName = player_data:get_scene_name(PlayerData),
    Account = player_data:get_account(PlayerData),
    case party:get_party_master(SceneName) of
    	[] -> 
	    false;
	[TagAccount, Lover] ->
	    if 
		Account == TagAccount -> 
		    false;		%% �����Լ� 
    		Account == Lover -> 
		    false;		%% ���˰���
    		true -> 
		    case can_food_eat_by_diamond(FoodID, HouseData) of
			false -> 
			    %% ˮ������
			    sys_msg:send(Account, ?msg_party_food_diamond),
			    false;
			true -> 
			    Count = get_eat_count(Account),
			    EatCountMax = common_def:get_val(food_eat_count_max), %% ÿ��ɳ��ɶ�ʳ�����
			    case Count < EatCountMax of
				true -> true;
				false -> 
				    %% �Ѿ��Եĺܱ���
				    sys_msg:send(Account, ?msg_party_food_eat_count_Max),
				    false
			    end
		    end
	    end
    end.
    		    

%% ���õ����ʳ�����
set_food_eat_count(Account) ->
    
    Count = get_eat_count(Account),
    NFoodEat = 
	case Count /= 0 of
	    false ->
		#party_food_eat{account=Account, time=get_next_day_zero(), count=1};
	    true ->
		#party_food_eat{account=Account, time=get_next_day_zero(), count=Count+1}
	end,
    db:dirty_write(NFoodEat).
    

%% ��ô����賿��ʱ��
get_next_day_zero() ->
    #stime{year=Year, month=Month, day=Day} = datetime:localtime(),
    T = #stime{year=Year, month=Month, day=Day, hour=0, minute=0, second=0},
    datetime:add_time(T, 24*3600).


%% ��ȡ�����ѳ�ʳ�����
get_eat_count(Account) ->
    ZeroTime = get_next_day_zero(),
    FoodEat = get_food_eat(Account),
    Time = FoodEat#party_food_eat.time,
    DiffTime = datetime:diff_time(ZeroTime, Time),
    case DiffTime /= 0 of
	true ->
	    0;
	false ->
	    FoodEat#party_food_eat.count
    end.

    
%% ��ȡ����ID
get_house_data(Account) ->
    [BasicData] = db:dirty_read(player_basic_data, Account),
    HouseID = player_basic_data:get_house_id(BasicData),
    [HouseData] = db:dirty_read(house_data, HouseID),
    HouseData.


%% ��ȡ��¼�ĳ�ʳ����Ϣ
get_food_eat(Account) ->
    case db:dirty_read(party_food_eat, Account) of
	[] ->
	    #stime{year=Year, month=Month, day=Day} = datetime:localtime(),
	    T = #stime{year=Year, month=Month, day=Day, hour=0, minute=0, second=0},
	    #party_food_eat{account=Account, time=T, count=0};
	[FoodEat] -> 
	    FoodEat
    end.


%% ֪ͨ�����ѳ�ʳ�����
notify(Account) ->
    Count = get_eat_count(Account),
    Packet = #notify_party_food_eat_count{count=Count},
    net_helper:send2client(Account, Packet).


%% ֪ͨ��ȡ��Ʒ��Ϣ
send_item_msg(Account, AddItem) ->
    [begin
	 #item_tplt{name=Name} = tplt:get_data2(item_tplt, ItemID),
	 sys_msg:send(Account, ?msg_get_fruit_count, [Name, Count])
     end || {ItemID, Count} <- AddItem].
