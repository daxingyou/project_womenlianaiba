%%%-------------------------------------------------------------------
%%% @author linyijie <linyj@35info.cn>
%%% @copyright (C) 2013, linyijie
%%% @doc
%%%   客人系统
%%% @end
%%% Created : 27 Jun 2013 by linyijie <linyj@35info.cn>
%%%-------------------------------------------------------------------
-module(guest).

-include("tplt_def.hrl").
-include("router.hrl").
-include("packet_def.hrl").
-include("sys_msg.hrl").
-include("player_buff.hrl").
-include("common_def.hrl").
-include("resource.hrl").
-include("records.hrl").

-export([start/1, handle_cast/2]).
-compile(export_all).

start(Account) ->
    [router:make_event_source(?msg_req_click_guest, Account, {Account, ?MODULE})
    ]. 

handle_cast({#msg{src=Account}, #req_click_guest{appraise=Appraise}}, PlayerData) ->
    handle_click_guest(Account, Appraise),
    
    {noreply, PlayerData}.

handle_click_guest(Account, Appraise) ->
    DecHp = Appraise, %% 普通评价为1, 超级评价为10, 这个数值是客户端发过来的
    Ratio = case Appraise of
		1 -> 1;
		10 -> 12
	    end,
    case give_awards(Account, Appraise, Ratio, DecHp) of
	true ->
	    sprite:handle_click_guest(Account, Appraise);
	false -> false
    end.

give_awards(Account, Appraise, Ratio, DecHp) ->
    F = fun() -> 
		[OldBasicData] = db:read(player_basic_data, Account),
		HouseID = player_basic_data:get_house_id(OldBasicData),
		[HouseData] = db:read(house_data, HouseID),

		case player_hp:dec_hp(DecHp, OldBasicData, HouseData) of
		    {ok, BasicData} ->
			AddExp = trunc(100 * Ratio * waiter:get_waiter_add_exp(Account) / 10000),
			AddDiamond = calc_diamond(HouseData, Ratio, Account),
			WaiterRatio = waiter:get_waiter_add_item_drop(Account),
			AddItem = give_items(Appraise, WaiterRatio),
			{HouseData1, ItemMsgs} = house_pack:add_items(AddItem, HouseData), 

			{BasicData2, HouseData2, ExpMsgs} = 
			    house_level_exp:add_exp(AddExp, BasicData, HouseData1),

			player_hp:save_hp(BasicData2),
			HouseData3 = house_diamond:add_diamond(AddDiamond, HouseData2),
			house_pack:save(HouseData3),
			{ok, HouseData3, ExpMsgs, ItemMsgs, BasicData2, AddItem};
		    {false, MsgID}  -> {false, MsgID}
		end
	end,
    case db:transaction(F) of
	{ok, HouseData, ExpMsgs, ItemMsgs, BasicData, AddItem} ->
	    house_level_exp:send_msgs(ExpMsgs, HouseData),
	    house_diamond:notify(HouseData),
	    player_hp:send(Account, BasicData, HouseData),
	    house_pack:send_msgs(ItemMsgs, HouseData),
	    Packet = #notify_can_click_guest{canClick=1},
	    router:cast(Account, click_guest_event, Account),
	    net_helper:send2client(Account, Packet),
	    send_item_msg(Account, AddItem),
	    true;
	{false, MsgID} ->
	    Packet = #notify_can_click_guest{canClick=0},
	    net_helper:send2client(Account, Packet),
	    sys_msg:send(Account, MsgID),
	    false
    end.

send_item_msg(Account, AddItem) ->
    [begin
	 #item_tplt{name=Name} = tplt:get_data2(item_tplt, ItemID),
	 sys_msg:send(Account, ?msg_get_fruit_count, [Name, Count])
     end || {ItemID, Count} <- AddItem].

calc_diamond(HouseData, Ratio, Account) ->
    Diamond = (10 + house_data:get_decoration(HouseData) / 100 + waiter:get_waiter_add_coin(Account)) * Ratio,
    trunc(Diamond).

give_items(Appraise, WaiterRatio) ->
    Items = 
	case Appraise of
	    1 ->
		[{5000000, 1.5 + WaiterRatio}, {5000001, 1.5 + WaiterRatio}, 
		 {5000002, 1.5 + WaiterRatio}, {5000003, 1.5 + WaiterRatio}];
	    10 ->
		[{5000000, 25}, {5000001, 25}, {5000002, 25}, {5000003, 25}]
	end,
    Rand = random:uniform(100),
    give_items_impl(Items, Rand).

give_items_impl([], _RandRest) ->
    [];
give_items_impl([{Item, Ratio} | _ItemRest], RandRest) when RandRest - Ratio =< 0 -> 
    [{Item, 1}];
give_items_impl([{_Item, Ratio} | ItemRest], RandRest) -> 
    give_items_impl(ItemRest, RandRest - Ratio).

debug(Type) ->
    case Type of
        trace ->
            dbg:tracer(),
            dbg:p(all, [call]),  %% 我们关心函数调用
            dbg:tpl(guest, [{'_', [], [{return_trace}]}]), %%以及返回值
            %%dbg:tpl(ftp_response, [{'_', [], [{return_trace}]}]),
            %%dg:tpl(ftp_progress, [{'_', [], [{return_trace}]}]),
	    ok;
        debug ->
            dbg:tracer(),
            dbg:p(all, [call]),
            dbg:tp(guest, [{'_', [], [{return_trace}]}]),
            %%dbg:tp(ftp_response, [{'_', [], [{return_trace}]}]),
            %%dbg:tp(ftp_progress, [{'_', [], [{return_trace}]}]),
	    ok;
        _ ->
            ok
    end.



