%%%-------------------------------------------------------------------
%%% @author lyj <lyj@35info.cn>
%%% @copyright (C) 2011, lyj
%%% @doc
%%%  ���黨��
%%% @end
%%% Created : 19 Nov 2011 by lyj <lyj@35info.cn>
%%%-------------------------------------------------------------------
-module(flower).

-include("packet_def.hrl").
-include("router.hrl").
-include("enum_def.hrl").
-include("common_def.hrl").
-include("tplt_def.hrl").
-include("sys_msg.hrl").
-include("records.hrl").
-include("house_data.hrl").
-include("resource.hrl").

-export([start/1, handle_cast/2]).
-compile(export_all).
-define(table_name, flower).

-record(flower, {house_id,          %% ����ID
		 flower_id = 0,     %% ���ٶ�Ӧ��ģ���id
		 grow = 0,          %% �ɳ�ֵ
		 water = [],        %% ��ˮ��¼
		 fertilize = [],    %% ʩ�ʼ�¼
		 start_time,        %% ��ֲʱ��
		 fruit_time,        %% ���ʱ��
		 pick = 0,          %% �Ѿ���ժ������
		 output = 0,        %% ����
		 log = []
 		}).

-define(DEFAULT_FRUIT_TIME, 7 * 24 * 3600).
-define(DEFAULT_OUTPUT, 1).
-define(OP_WATER, 1).  %% ��ˮ�����Ķ���
-define(WATER_GROW, 4).  %% ÿ�ν�ˮ���ӵĳɳ�ֵ
-define(FREE_SHAKE, 5).

start(Account) ->	
    [router:make_event_source(?msg_req_get_flower, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_create_flower, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_can_water_flower, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_water_flower, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_pick_fruit, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_change_flower, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_flower_log, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_ask_today_water_flower, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_flower_shake, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_flower_shaked, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_flower_love_coin_shake, Account, {Account, ?MODULE})
    ].

%% �����û�������
handle_cast({#msg{src=Account}, #req_get_flower{house_id=StrHouseID}}, State) ->
    get_flower(Account, StrHouseID),
    {noreply, State};

%% ���󴴽�����
handle_cast({#msg{src=Account}, #req_create_flower{house_id=HouseID, flower_id=FlowerID}}, State) ->
    create_flower(Account, HouseID, FlowerID),
    {noreply, State};

%% ����ѯ���ܷ�ˮ
handle_cast({#msg{src=Account}, #req_can_water_flower{my_house_id=MyHouseID, house_id=HouseID}}, State) ->
    can_water_impl(Account, HouseID, MyHouseID == HouseID),
    {noreply, State};

%% ����ˮ
handle_cast({#msg{src=Account}, #req_water_flower{my_house_id = MyHouse, house_id=HouseID, name=Name}}, State) ->
    water(Account, MyHouse, HouseID, Name),
    {noreply, State};

%% �����ժ��ʵ
handle_cast({#msg{src=Account}, #req_pick_fruit{house_id=HouseID}}, State) ->
    pick_fruit(Account, HouseID),
    {noreply, State};

%% �����������
handle_cast({#msg{src=Account}, #req_flower_log{house_id=HouseID}}, State) ->
    get_flower_log(Account, HouseID),
    {noreply, State};

%% �����������
handle_cast({#msg{src=Account}, #req_change_flower{house_id=HouseID, flower_id=FlowerID}}, State) ->
    change_flower(Account, HouseID, FlowerID),
    {noreply, State};

%% ѯ�ʽ����Ƿ��н��Լ��ҵĻ���
handle_cast({#msg{src=Account}, #req_ask_today_water_flower{owner_house_id=HouseID}}, State) ->
    ask_today_flower(Account, HouseID),
    {noreply, State};

%% ҡһҡ
handle_cast({#msg{src=Account}, #req_flower_love_coin_shake{house_id=HouseId}}, State) ->
    case select(HouseId) of
	[]->
	    %% ϵͳ��Ϣ��ʾ���ٲ�����
	    ok;
	_Flower -> %% ���ٴ���
	    ShakeCount = 1,
	    ShakeTime = datetime:local_time(),
	    TotalShakeCount = common_def:get_val(love_coin_shake_count), %% ����ÿ��ֻ��ҡ50��
	    {LoveCoinShakedCount, _LastDate} = db_player_flower_shake:get_love_coin_shake(Account, ShakeTime),
	    case LoveCoinShakedCount < TotalShakeCount of
		true ->
		    {Diamond, Exp, ItemList, LoveCoin} = get_love_coin_shake_reward(LoveCoinShakedCount, ShakeCount),
		    ShipCallback = 
			fun(#order{status=Status}=_Order)-> 			   
				case (Status =:= ?order_payed) of
				    true ->
					love_coin_shake(Account, HouseId, LoveCoinShakedCount, 0, ShakeCount, 
							TotalShakeCount, ShakeTime, Diamond, Exp, ItemList),
					net_helper:send2client(Account, 
							       #notify_flower_love_coin_shaked{
								 total_shake_count=TotalShakeCount,
								 love_coin_shake=LoveCoinShakedCount + ShakeCount}),
					?pay_shipped;
				    _ ->
					net_helper:send2client(Account, 
							       #notify_flower_love_coin_shaked{
								 total_shake_count=TotalShakeCount,
								 love_coin_shake=LoveCoinShakedCount}),
					?pay_error
				end				       
			end,
		    player_love_coin:pay([{0, 1, LoveCoin}], ShipCallback, ?order_goods_meta_shake, State);
		false ->
		    net_helper:send2client(Account, 
					   #notify_flower_shake_overflow{available=1})
	    end
    end,

    {noreply, State};
handle_cast({#msg{src=Account}, #req_flower_shake{house_id=HouseId, shake_count=ShakeCount, enable_props=_IntEnableProps}}, State) ->
    case select(HouseId) of
	[]->
	    %% ϵͳ��Ϣ��ʾ���ٲ�����
	    ok;
	Flower -> %% ���ٴ���
	    ShakeTime = datetime:local_time(),
	    TotalShakeCount = common_def:get_val(free_shake_count), %% ���ÿ��ֻ��ҡ5��
	    {ShakedCount, _LoveCoinShakedCount, LastDate} = db_player_flower_shake:get(Account, ShakeTime),
	    FlowerLevel = get_level(Flower),
	    FreeShakeTime = common_def:get_val(free_shake_time),
	    case LastDate of
		undefined ->
		    case shake(Account, HouseId, ShakedCount, ShakeCount, 0,
			       TotalShakeCount, ShakeTime, FlowerLevel) of
			true->
			    DueDate = datetime:add_time(ShakeTime, FreeShakeTime),
			    DiffTime = datetime:diff_time(ShakeTime, DueDate),
			    net_helper:send2client(Account, 
						   #notify_flower_shaked{
						     total_shake_count=TotalShakeCount,
						     free_shake=ShakedCount+ShakeCount, 
						     free_shake_time=DiffTime});
			false ->
			    ok
		    end;
		_ ->
		    case datetime:diff_time(LastDate, ShakeTime) >= FreeShakeTime of
			true ->
			    case shake(Account, HouseId, ShakedCount, ShakeCount, 0,
				       TotalShakeCount, ShakeTime, FlowerLevel) of
				true->
				    DueDate = datetime:add_time(ShakeTime, FreeShakeTime),
				    DiffTime = datetime:diff_time(ShakeTime, DueDate),
				    net_helper:send2client(Account, 
							   #notify_flower_shaked{
							     total_shake_count=TotalShakeCount,
							     free_shake=ShakedCount+ShakeCount, 
							     free_shake_time=DiffTime});
				false ->
				    ok
			    end;
			false ->
			    ok
		    end
	    end
    end,
    {noreply, State};
handle_cast({#msg{src=Account}, #req_flower_shaked{house_id=_HouseId}}, State) ->
    ShakeTime = datetime:local_time(),
    {ShakedCount, _LoveCoinShakedCount, LastDate} = db_player_flower_shake:get(Account, ShakeTime),
    FreeShakeTime = common_def:get_val(free_shake_time),
    FreeTotalShakeCount = common_def:get_val(free_shake_count),
    LoveCoinTotalShakeCount = common_def:get_val(love_coin_shake_count),
    DueDate =
	case LastDate of
	    undefined ->
		ShakeTime;
	    _ ->
		datetime:add_time(LastDate, FreeShakeTime)
	end,
    DiffTime = datetime:diff_time(ShakeTime, DueDate),
    net_helper:send2client(Account, #notify_flower_shaked{free_shake=ShakedCount,
							  total_shake_count=FreeTotalShakeCount,
							  free_shake_time=DiffTime}),
    {LoveCoinShakedCount, _}=db_player_flower_shake:get_love_coin_shake(Account, ShakeTime),
    net_helper:send2client(Account, #notify_flower_love_coin_shaked{total_shake_count=LoveCoinTotalShakeCount,
								    love_coin_shake=LoveCoinShakedCount}),
    {noreply, State}.
%%------------------------------------------------------------------
get_flower(Account, HouseID) ->
    Flower = select(HouseID),
    send(Account, 2, Flower).    

create_flower(Account, HouseID, FlowerID) ->
    Flower = create(HouseID, FlowerID),
    save(Flower),
    send(Account, 1, Flower).    

%% ��������
create(HouseID, FlowerID) ->
    Now = datetime:localtime(),
    #flower{house_id = HouseID, flower_id = FlowerID, 
	    start_time = Now, fruit_time = datetime:add_time(Now, ?DEFAULT_FRUIT_TIME),
	    output = ?DEFAULT_OUTPUT}.

can_water(Account, #flower{water = Water}, Owner) ->
    can_water(Account, Water, Owner);
    
can_water(Account, Water, true) -> %% ���˽�ˮ�ж�
    L = [D || D={_, _, Acc} <- Water, Account == Acc],
    case L of
    	[] -> true;
    	[{_, true, _}] -> true; %% ��������˽�ˮ, ��������ˮ2��
    	_ -> {false, ?msg_water_flower_limit} %% ���˽�ˮ�Ĵ�������2��, ������ˮ
    end;
can_water(Account, Water, false) -> %% ���ѽ�ˮ�ж�
    Friends = 8, %% ÿ������ֻ�������8�����Ѱ�æ
    L = [D || D={_, false, _} <- Water],
    case length(L) >= Friends of
    	true -> {false, ?msg_friend_water_flower_limit};
    	false -> 
    	    case [D || D={_,_,Acc} <- Water, Account ==Acc] == [] of
    		true -> true;
    		false -> {false, ?msg_water_flower_limit}
    	    end
    end.

can_water_impl(Account, HouseID, Owner) ->
    Flower = select(HouseID),
    NFlower = refresh_water(Flower),
    Packet = case can_water(Account, NFlower, Owner) of 
		 true -> #notify_can_water_flower{result=1};
		 {false, Reason} -> 
		     sys_msg:send(Account, Reason),
		     #notify_can_water_flower{result=0}
	     end,
    net_helper:send2client(Account, Packet).


%% ɾ�����ڵ�����
refresh_water(Flower) when is_record(Flower, flower) ->
    Water = [D || D = {Time,_, _} <- Flower#flower.water, datetime:diff_time(datetime:localtime(), Time) > 0],
    Flower#flower{water = Water}.

water(Account, OwnerHouseID, HouseID, Name)  ->
    Flower = select(HouseID),
    NFlower = refresh_water(Flower),
    IsOwner = OwnerHouseID == HouseID,
    Grow = case IsOwner of
	       true -> ?WATER_GROW;
	       false -> 1
	   end,
    case can_water(Account, NFlower, IsOwner) of 
    	true ->
	    NFlower1 = NFlower#flower{grow = NFlower#flower.grow + Grow, 
				      water = [{get_next_day_zero(), IsOwner, Account} | NFlower#flower.water],
				      log = add_log(Name, ?OP_WATER, Grow, NFlower#flower.log)},
	    save(NFlower1),
	    send(Account, 3, NFlower1),
	    router:cast(Account, water_flower_event, HouseID),
	    case IsOwner of
		true -> 
		    sys_msg:send(Account, ?msg_flower_success_1);
		false -> 
		    sys_msg:send(Account, ?msg_flower_success_2)
	    end;
	{false, Reason} ->
	    sys_msg:send(Account, Reason)
    end.

can_pick_fruit(Flower) when is_record(Flower, flower) ->
    datetime:diff_time(datetime:localtime(), Flower#flower.fruit_time) =< 0.

pick_fruit(Account, HouseID) ->
    Flower = select(HouseID),
    case can_pick_fruit(Flower) of
	true ->
	    Now = datetime:localtime(), 
	    NFlower = Flower#flower{fruit_time=datetime:add_time(Now, ?DEFAULT_FRUIT_TIME), 
				    pick = Flower#flower.output + Flower#flower.pick,
				    output = ?DEFAULT_OUTPUT},
	    %% TODO: ��ժ����Ʒ���ɺ�ŵ���Ұ�����
	    save(NFlower),
	    send(Account, 5, NFlower);
	false ->
	    %% TODO: ������ʾ��Ϣ���ͻ���, ���ܽ�ˮ
	    ok
    end.

%% ��û��ٵĲ�����־
get_flower_log(Account, HouseID) ->
    Flower = select(HouseID),
    Packet = #notify_flower_log{logs = Flower#flower.log},
    net_helper:send2client(Account, Packet).

%% ���Ļ���
change_flower(Account, HouseID, FlowerID) ->
    %% TODO: ��Ǯ
    %% TODO: ���ʵ��ʱ���Ƿ���Ҫ�ı�
    Flower = select(HouseID),
    NFlower = Flower#flower{flower_id = FlowerID},
    save(NFlower),
    send(Account, 6, NFlower).

%% %% ʩ��
%% fertilize(Account, Data) ->
%%     Num = 1,
%%     increase_output(Data, Num).

get_level(#flower{flower_id=ID, grow=Grow}) ->
    Datas = [D || D <- tplt:get_all_data(flower_tplt), ID == D#flower_tplt.flower_id],
    case [FlowerTplt#flower_tplt.level || FlowerTplt  <- Datas, Grow < FlowerTplt#flower_tplt.grow] of
	[Lvl|_] -> Lvl;
	[] -> 
	    #flower_tplt{level = L} = lists:last(Datas),
	    L
    end.

send(Account, Operate, []) ->
    Packet = #notify_flower_data{operate=Operate,
				 house_id=0,
				 id=0,
				 level=0,
				 grow = 0},
    net_helper:send2client(Account, Packet);
send(Account, Operate, Flower) ->
    Packet = #notify_flower_data{operate=Operate,
				 house_id=Flower#flower.house_id, 
				 id=Flower#flower.flower_id,
				 level=get_level(Flower),
				 grow = Flower#flower.grow,
				 start_time = Flower#flower.start_time,
				 fruit_time = Flower#flower.fruit_time},
    net_helper:send2client(Account, Packet).

add_log(Name, Op, Grow, Log) ->
    Local = datetime:localtime(),
    L = [#flower_log{name=Name, time=Local, op=Op, grow=Grow} | Log],
    case length(L) > 50 of
	true -> lists:sublist(L, 50);
	false -> L
    end.

%% ��ô����賿��ʱ��
get_next_day_zero() ->
    #stime{year=Year, month=Month, day=Day} = datetime:localtime(),
    T = #stime{year=Year, month=Month, day=Day, hour=0, minute=0, second=0},
    datetime:add_time(T, 24*3600).

ask_today_flower(Account, HouseID) ->
    case select(HouseID) of
	[] ->
	    Packet = #notify_today_water_flower{result=1},
	    net_helper:send2client(Account, Packet);
	Flower ->
	    NFlower = refresh_water(Flower),
	    Packet = case can_water(Account, NFlower, true) of 
			 true -> #notify_today_water_flower{result=1};
			 {false, _Reason} -> #notify_today_water_flower{result=0}
		     end,
	    net_helper:send2client(Account, Packet)
    end.

  
%% -------------���ݿ�������---------------------------
%% ��ȡָ����ҵ�����
select(HouseID) ->
    case db:dirty_read(?table_name, HouseID) of
	[] -> [];
	[Data] -> Data
    end.


save(Data) ->
    db:dirty_write(Data).

%% ҡһҡ
love_coin_shake(Account, HouseId, ShakedCount, ShakeCount, LoveCoinShakeCount, TotalShakeCount, ShakeTime, Diamond, Exp, ItemList)->
    F = fun()->
		try
		    validate_shake_total_overflow(ShakedCount, TotalShakeCount),
		    PlayerHouseId = db_pair_player:get_house_id(Account),
		    PlayerHouseData = db_house:select(PlayerHouseId),
		    do_love_coin_shake(Account, HouseId, PlayerHouseData, ShakeCount, LoveCoinShakeCount,
			     ShakedCount, ShakeTime, Diamond, Exp, ItemList)
		catch
		    throw:{validate, Reason, Arg}->
			{error, Reason, Arg};

		    throw:{validate, Reason}->
			{error, Reason}
		end
	end,
    case db:transaction(F) of
	{error, total_overflow, TotalCount}->
	    net_helper:send2client(Account, 
				   #notify_flower_shake_overflow{available=TotalCount}),
	    false;
	{error, shake_overflow, TotalCount}->
	    net_helper:send2client(Account, 
				   #notify_flower_shake_overflow{available=TotalCount}),
	    false;
	{error, prop_required}->
	    net_helper:send2client(Account, 
				   #notify_flower_shake_prop_required{}),
	    false;
	{error, prop_overflow}->
	    sys_msg:send(Account, ?err_flower_shake_prop_overflow),
	    false;
	{ok, MessageList} ->
	    router:cast(Account, on_flower_shake, Account),
	    [net_helper:send2client(TargetAccount, Message) || 
		{TargetAccount, Message} <- MessageList],
	    true
    end.
shake(Account, HouseId, ShakedCount, ShakeCount, LoveCoinShakeCount, TotalShakeCount, ShakeTime, FlowerLevel)->
    F = fun()->
		try
		    validate_shake_total_overflow(ShakedCount, TotalShakeCount),

		    {Diamond, Exp, ItemList, _LoveCoin} = get_shake_reward(flower_shake_tplt, ShakedCount, ShakeCount),
		    NeedDiamond = Diamond + 150 * FlowerLevel,
		    PlayerHouseId = db_pair_player:get_house_id(Account),
		    PlayerHouseData = db_house:select(PlayerHouseId),
		    do_shake(Account, HouseId, PlayerHouseData, ShakeCount, LoveCoinShakeCount,
			     ShakedCount, ShakeTime, NeedDiamond, Exp, ItemList)
		catch
		    throw:{validate, Reason, Arg}->
			{error, Reason, Arg};

		    throw:{validate, Reason}->
			{error, Reason}
		end
	end,
    case db:transaction(F) of
	{error, total_overflow, TotalCount}->
	    net_helper:send2client(Account, 
				   #notify_flower_shake_overflow{available=TotalCount}),
	    false;
	{error, shake_overflow, TotalCount}->
	    net_helper:send2client(Account, 
				   #notify_flower_shake_overflow{available=TotalCount}),
	    false;
	{error, prop_required}->
	    net_helper:send2client(Account, 
				   #notify_flower_shake_prop_required{}),
	    false;
	{error, prop_overflow}->
	    sys_msg:send(Account, ?err_flower_shake_prop_overflow),
	    false;
	{ok, MessageList} ->
	    router:cast(Account, on_flower_shake, Account),
	    [net_helper:send2client(TargetAccount, Message) || 
		{TargetAccount, Message} <- MessageList],
	    true
    end.

%% ��֤�Ƿ��Ѿ���������ҡ������
validate_shake_total_overflow(ShakedCount, TotalCount)->
    case ShakedCount >= TotalCount of
	true->
	    throw({validate, total_overflow, TotalCount});
	false ->
	    ok
    end.
%% spec validate_shake_count_overflow(ShakedCount, ShakeCount, TotalCount)-> free|prop|partial
validate_shake_count_overflow(ShakedCount, ShakeCount)->
    NextShakedCount = ShakedCount + ShakeCount,
    FreeShakeCount = common_def:get_val(free_shake_count),
    data_helper:format("ShakedCount:~p, free shake count:~p~n", [ShakedCount, FreeShakeCount]),
    case NextShakedCount =< FreeShakeCount of
	true -> false; %% ���
	false ->
	    case ShakedCount >= FreeShakeCount of
		true -> %% ��ȫ�����
		    true;
		false->
		    false
	    end
    end.

do_love_coin_shake(Account, _TargetHouseId, #house_data{boy=Boy, girl=Girl}=HouseData, 
	 ShakeCount, LoveCoinShakeCount, ShakedCount, ShakeTime, Diamond, Exp, ItemList)->
    PlayerBasic = db_player:select(Account),
    {ExpPlayerBasic, ExpHouseData, ExpNotifyList} = house_level_exp:add_exp(Exp, PlayerBasic, HouseData),
    {ItemHouseData, ItemNotifyList} = house_pack:add_items(ItemList, ExpHouseData),
    FreeShakeCount = common_def:get_val(free_shake_count),
    DiamondHouseData = house_diamond:add_diamond(Diamond, ItemHouseData),
    db:dirty_write(DiamondHouseData),
    db:dirty_write(ExpPlayerBasic),
    db_player_flower_shake:add_love_coin_shake(Account, LoveCoinShakeCount, ShakeTime),
    NotifyHouseDiamond = #notify_lover_diamond{amount=house_diamond:get_lover_diamond(DiamondHouseData)},
    LotteryItemList = [#lottery_item{item_id=ItemId, item_count=ItemCount} || {ItemId, ItemCount} <- ItemList],
    NewShakedCount = ShakeCount + ShakedCount,
    RemaindFreeShake = case NewShakedCount >= FreeShakeCount of
			  true->0;
			  false-> FreeShakeCount - NewShakedCount
		      end,
    NotifyFlowerShake =   
	#notify_flower_shake{diamond=Diamond, exp=Exp,items=LotteryItemList, shake_prop_count=ShakeCount, free_shake=RemaindFreeShake},

    MessageList = [{Account, NotifyFlowerShake},
		   {Boy, NotifyHouseDiamond}, 
		   {Girl, NotifyHouseDiamond}],
    NewMessageList = merge_notify(MessageList, Boy, Girl, [ItemNotifyList, ExpNotifyList]),
    {ok, NewMessageList}.

do_shake(Account, _TargetHouseId, #house_data{boy=Boy, girl=Girl}=HouseData, 
	 ShakeCount, LoveCoinShakeCount, ShakedCount, ShakeTime, Diamond, Exp, ItemList)->
    PlayerBasic = db_player:select(Account),
    {ExpPlayerBasic, ExpHouseData, ExpNotifyList} = house_level_exp:add_exp(Exp, PlayerBasic, HouseData),
    {ItemHouseData, ItemNotifyList} = house_pack:add_items(ItemList, ExpHouseData),
    FreeShakeCount = common_def:get_val(free_shake_count),
    DiamondHouseData = house_diamond:add_diamond(Diamond, ItemHouseData),
    db:dirty_write(DiamondHouseData),
    db:dirty_write(ExpPlayerBasic),
    db_player_flower_shake:add(Account, ShakeCount, LoveCoinShakeCount, ShakeTime),
    NotifyHouseDiamond = #notify_lover_diamond{amount=house_diamond:get_lover_diamond(DiamondHouseData)},
    LotteryItemList = [#lottery_item{item_id=ItemId, item_count=ItemCount} || {ItemId, ItemCount} <- ItemList],
    NewShakedCount = ShakeCount + ShakedCount,
    RemaindFreeShake = case NewShakedCount >= FreeShakeCount of
			  true->0;
			  false-> FreeShakeCount - NewShakedCount
		      end,
    NotifyFlowerShake =   
	#notify_flower_shake{diamond=Diamond, exp=Exp,items=LotteryItemList, shake_prop_count=ShakeCount, free_shake=RemaindFreeShake},

    MessageList = [{Account, NotifyFlowerShake},
		   {Boy, NotifyHouseDiamond}, 
		   {Girl, NotifyHouseDiamond}],
    NewMessageList = merge_notify(MessageList, Boy, Girl, [ItemNotifyList, ExpNotifyList]),
    {ok, NewMessageList}.

merge_notify(Acc, _Boy, _Girl, []) ->
    Acc;
merge_notify(Acc, Boy, Girl, [MessageList])->
    lists:foldl(fun(Message, AccIn)->
			[{Boy, Message}, {Girl, Message} | AccIn]
		end, Acc, MessageList);

merge_notify(Acc, Boy, Girl, [MessageList|TailMessageList])->
    AccOut =
	lists:foldl(fun(Message, AccIn)->
			    [{Boy, Message}, {Girl, Message} | AccIn]
		    end, Acc, MessageList),
    merge_notify(AccOut, Boy, Girl, TailMessageList).

merge_item(ItemList, 0, _ItemCount)->
    ItemList;
merge_item([], ItemId, ItemCount)->
    [{ItemId, ItemCount}];
merge_item(ItemList, ItemId, ItemCount)->
   case lists:keyfind(ItemId, 1, ItemList) of
       {ItemId, CurrentItemCount}->
	   [{ItemId, ItemCount + CurrentItemCount} | lists:keydelete(ItemId, 1, ItemList)];
       false ->
	   [{ItemId, ItemCount} | ItemList]
   end.

get_shake_reward(_TpltName, ShakedCount, _ShakeCount) when ShakedCount == 50 ->
    {0, 0, [], 0};
get_shake_reward(TpltName, ShakedCount, ShakeCount)->
    get_shake_reward(TpltName, ShakedCount, ShakeCount, {0, 0, [], 0}).

get_shake_reward(TpltName, ShakedCount, 1, {DiamondAcc, ExpAcc, ItemList, LoveCoinAcc})->
    #flower_shake_tplt{diamond=Diamond, exp=Exp,item_id=ItemId, item_count=ItemCount, love_coin=LoveCoin} 
	= tplt:get_data(TpltName, ShakedCount + 1),
    {DiamondAcc + Diamond, ExpAcc + Exp, merge_item(ItemList, ItemId, ItemCount), LoveCoinAcc+LoveCoin};
get_shake_reward(TpltName, ShakedCount, ShakeCount, {DiamondAcc, ExpAcc, ItemList, LoveCoinAcc}) ->
    #flower_shake_tplt{diamond=Diamond, exp=Exp,item_id=ItemId, item_count=ItemCount, love_coin=LoveCoin}
	= tplt:get_data(TpltName, ShakedCount + 1),
    get_shake_reward(TpltName, ShakedCount + 1, ShakeCount - 1, 
		     {DiamondAcc + Diamond, ExpAcc + Exp, 
		      merge_item(ItemList, ItemId, ItemCount), LoveCoinAcc+LoveCoin}).


get_love_coin_shake_reward(ShakedCount, _ShakeCount) when ShakedCount == 50 ->
    {0, 0, [], 0};
get_love_coin_shake_reward(ShakedCount, ShakeCount)->
    get_love_coin_shake_reward(ShakedCount, ShakeCount, {0, 0, [], 0}).

get_love_coin_shake_reward(ShakedCount, 1, {DiamondAcc, ExpAcc, ItemList, LoveCoinAcc})->
    #flower_love_coin_shake_tplt{diamond=Diamond, exp=Exp,item_id=ItemId, 
				 item_count=ItemCount, item_rate=ItemRate, love_coin=LoveCoin} 
	= tplt:get_data(flower_love_coin_shake_tplt, ShakedCount + 1),
    Rate = rand:uniform(1000),
    NItemList = 
	case Rate =< ItemRate of
	    true ->
		merge_item(ItemList, ItemId, ItemCount);
	    false ->
		ItemList
	end,
    {DiamondAcc + Diamond, ExpAcc + Exp, NItemList, LoveCoinAcc+LoveCoin};
get_love_coin_shake_reward(ShakedCount, ShakeCount, {DiamondAcc, ExpAcc, ItemList, LoveCoinAcc}) ->
    #flower_love_coin_shake_tplt{diamond=Diamond, exp=Exp,item_id=ItemId, 
				 item_count=ItemCount, item_rate=ItemRate, love_coin=LoveCoin}
	= tplt:get_data(flower_love_coin_shake_tplt, ShakedCount + 1),
    Rate = rand:uniform(1000),
    NItemList = case Rate =< ItemRate of
		    true ->
			merge_item(ItemList, ItemId, ItemCount);
		    false ->
			ItemList
		    end,
    get_love_coin_shake_reward( ShakedCount + 1, ShakeCount - 1, 
				{DiamondAcc + Diamond, ExpAcc + Exp, 
				 NItemList, LoveCoinAcc+LoveCoin}).

%% ������Ϣ���ͻ���
send2client(#house_data{boy=Boy, girl=Girl}, MessageList)->
    [begin
	 net_helper:send2client(Boy, Message),
	 net_helper:send2client(Girl, Message)
     end || Message <- MessageList].

-ifdef(TEST).
-include_lib("eunit/include/eunit.hrl").
     
can_water_test() ->
    T = datetime:localtime(),
    ?assertEqual(true, can_water(a, [], true)),
    ?assertEqual(true, can_water(a, [{T, true, a}], true)),
    ?assertEqual({false,  ?msg_water_flower_limit}, can_water(a, [{T, true, a}, {T, true, a}], true)),
    ?assertEqual(true, can_water(a, [{T, true, a}, {T, true, b}], true)),
    ?assertEqual({false, ?msg_water_flower_limit}, can_water(a, [{T, false, a}, {T, true, b}], false)),
    ?assertEqual({false,  ?msg_water_flower_limit}, can_water(a, [{T, true, a}, {T, true, a}, {T,true,b}], true)),
    ?assertEqual(true, can_water(b, [{T, true, a}, {T, true, a}, {T,true,b}], true)),
    ?assertEqual({false,  ?msg_water_flower_limit}, can_water(a, [{T, true, a}, {T, true, a}, {T,true,b},{T,true,b}], true)),
    ?assertEqual({false, ?msg_friend_water_flower_limit}, can_water(abcd, [{T, false, a}, {T, false, b}, {T,false,c}, {T,false,d}, {T,false,e}, {T,false,f}, {T,false,g}, {T,false,h}, {T,true,g}], false)),
    ?assertEqual(true, can_water(abcd, [{T, false, a}, {T, false, b}], false)),
    ?assertEqual(true, can_water(abcd, [{T, false, a}, {T, false, b}], true)),
    ?assertEqual(true, can_water('abcd', [{T,false,a},{T,true,b},{T,true,b}], false)),
    ok.

-endif.
    

