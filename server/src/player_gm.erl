%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%%
%%% @end
%%% Created : 22 May 2012 by LinZhengJian <linzhj@35info.cn>

-module(player_gm).

-include("packet_def.hrl").
-include("player_data.hrl").
-include("records.hrl").
-include("house_data.hrl").
-include("enum_def.hrl").

-export([start/1, handle_cast/2]).
-export([notify/1, add_item/3, add_exp/2, add_money/2, update_exp/2, update_money/2, del_item/2]).

add_money(Account, Money) when is_atom(Account), Money >= 0 ->
    F = fun()->
		HouseId = player_basic_data:get_house_id(Account),
		[HouseData] = db:read(house_data, HouseId),
		NewHouseData = house_diamond:add_diamond(Money, HouseData),
		db:write(NewHouseData),
		NewHouseData
	end,
    NewHouseData = db:transaction(F),
    house_diamond:notify(NewHouseData),
    ok.

update_money(Account, Money) when is_atom(Account), Money >= 0 ->
    F = fun()->
		HouseId = player_basic_data:get_house_id(Account),
		[HouseData] = db:read(house_data, HouseId),
		NewHouseData =  HouseData#house_data{lover_diamond=Money},
		db:write(NewHouseData),
		NewHouseData
	end,
    NewHouseData = db:transaction(F),
    house_diamond:notify(NewHouseData),
    ok.

add_exp(Account, Exp) when is_atom(Account), Exp >= 0 ->
    house_level_exp:add_exp_and_notify(Exp, Account).

update_exp(Account, Exp) ->
    F = fun() ->
		[BasicData] = db:read(player_basic_data, Account),
		HouseID = player_basic_data:get_house_id(BasicData),
		[HouseData] = db:read(house_data, HouseID),
		NewHouse = HouseData#house_data{exp=Exp},
		ok = db:write(NewHouse)
	end,
    db:transaction(F).

add_item(Account, ItemTpltID, ItemCount) when is_atom(Account), ItemCount > 0 ->
    F = fun()->
		HouseId = player_basic_data:get_house_id(Account),
		[HouseData] = db:read(house_data, HouseId),
		{HouseData1, MessageList} = house_pack:add_items([{ItemTpltID, ItemCount}], HouseData),
		db:write(HouseData1),
		{HouseData1, MessageList}
	end,
    {HouseData, MessageList} = db:transaction(F),
    [send_item(HouseData, Message) || Message <- MessageList],
    ok.

del_item(Account, ItemTpltID) when is_atom(Account) ->
    F = fun()->
		HouseId = player_basic_data:get_house_id(Account),
		[HouseData] = db:read(house_data, HouseId),
		{NHouseData, Msgs} = house_pack:del_item_by_tempid(ItemTpltID, HouseData),
		db:write(NHouseData),
		{NHouseData, Msgs}
	end,
    {HouseData, MessageList} = db:transaction(F),
    [send_item(HouseData, Message) || Message <- MessageList],
    ok.

start(Account)->
    [router:make_event_source(?msg_req_gm_command, Account, {self(), ?MODULE})].

handle_cast({_Msg, #req_gm_command{command=Command, params=Parameters}}, State) -> 
    %% ¼ÇÂ¼ÈÕÖ¾
    log(State, Command, Parameters),
    case player_gm_permission:get(player_data:get_account(State)) of
	#player_gm_permission{enable=1}->
	    NPlayerData = run_command(string:to_lower(Command), Parameters, State),
	    {noreply, NPlayerData};
	_ ->
	    {noreply, State}
    end.


notify(Account)->
    case player_gm_permission:get(Account) of
	    #player_gm_permission{account=Account, money=Money, item=Item, enable=Enable}->
	    net_helper:send2client(Account, #notify_gm_permission{account=Account, money=Money, item=Item, enable=Enable});
	_ ->
	    net_helper:send2client(Account, #notify_gm_permission{account=Account, money=0, item=0, enable=0})
    end.

%%%%%%%%%%%%%%%%%%%%%%%
%
%intanal functions
%
%%%%%%%%%%%%%%%%%%%%%%
-spec run_command(list(string()),list(list(string())), term())->term().
run_command("addmoney",[AmountString],PlayerData)->
    Amount = list_to_integer(AmountString),
    HouseId = player_data:get_house_id(PlayerData),
    HouseData = db_house:select(HouseId),
    NHouseData = house_diamond:add_diamond(Amount, HouseData),
    db:dirty_write(NHouseData),
    house_diamond:notify(NHouseData),
    PlayerData;

run_command("additem",[ItemIdString, CountString],PlayerData)->
    ItemId = list_to_integer(ItemIdString),
    Count = list_to_integer(CountString),
    HouseId = player_data:get_house_id(PlayerData),
    F = fun()->
		[HouseData] = db:read(house_data, HouseId),
		{HouseData1, MessageList} = house_pack:add_items([{ItemId, Count}], HouseData),
		db:write(HouseData1),
		{HouseData1, MessageList}
	end,
    {HouseData, MessageList} = db:transaction(F),
    [send_item(HouseData, Message) || Message <- MessageList],
    PlayerData;

run_command("broadcast", [Content], PlayerData)->
    Type=2,
    StartTime=datetime:local_time(),
    PlayTimes=1,
    Priority=1,
    ID=sys_broadcast:add(Type, Content, StartTime, PlayTimes, Priority),
    sys_broadcast:reload(),
    sys_broadcast:send(ID, Type, Content, PlayTimes, Priority, 0, StartTime),
    PlayerData;

run_command("unbroadcast", _Content, PlayerData)->
    Type=?sbt_at_time,
    IDs = sys_broadcast:clear(Type),
    [sys_broadcast:gm_change_broadcast(ID, Type) || ID <- IDs],
    PlayerData;

run_command(_Command, _Parameters, PlayerData)->
    PlayerData.

send_item(#house_data{boy=Boy, girl=Girl}, NotifyItem)->
    net_helper:send2client(Boy, NotifyItem),
    net_helper:send2client(Girl, NotifyItem),
    ok.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% Accessorial Functions
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
log(PlayerData, Command, Parameters)->		 
    player_gm_log:add(player_data:get_account(PlayerData), Command, string:join(Parameters, ",")).
