%%% @author  linyijie
%%% @copyright (C) 2010, 
%%% @doc
%%%  道具物品
%%% @end
%%% Created : 31 Mar 2010 by  <>

-module(props_item).

-export([start/1, handle_cast/2]).
-compile(export_all).


-include("packet_def.hrl").
-include("router.hrl").
-include("sys_msg.hrl").
-include("tplt_def.hrl").


-define(use_del, 1).      % 使用物品后删除
-define(use_not_del, 0).  % 使用物品后不删除


start(Account) ->
    [router:make_event_source(?msg_req_use_item, Account, {Account, ?MODULE})
    ].

handle_cast({#msg{src=Owner}, #req_use_item{item_inst_id=ItemID, target_list=Targets}}, PlayerData) ->
    case party:is_party_item(ItemID) of
	true ->
	    use_party_item_impl(Owner, ItemID, Targets, PlayerData);
	_ ->
	    use_item_impl(Owner, ItemID, Targets, PlayerData)
    end,

    {noreply, PlayerData}.


use_party_item_impl(Owner, ItemTpltID, Targets, PlayerData) ->
    SceneName = player_data:get_scene_name(PlayerData),
    SceneHouseID = house:id_from_name(SceneName),

    F = fun() ->
		case party_items:dec_player_items(SceneHouseID, Owner, ItemTpltID) of
		    {ok, FnList} ->
			HouseData0 = house_pack:read(Owner),
			Item = item:make_item(ItemTpltID),
			{HouseData, _Msgs} = house_pack:add_items([Item], HouseData0),
			ItemTplt = tplt:get_data(props_item_tplt, ItemTpltID),
			case can_use_item(Owner, Targets, HouseData, Item, ItemTplt, PlayerData) of
			    true ->
				{use_item(Owner, Targets, HouseData, Item, ItemTplt, PlayerData), FnList};
			    {false, Err} -> {false, [{sys_msg, send, [Owner, Err]}]}
			end;
		    _ -> {false, [{sys_msg, send, [Owner, ?err_item_count_not_enough]}]}
		end
    	end,

    case db:transaction(F) of
	{false, MFA} ->
	    do_mfa(MFA),
	    PlayerData;
	{{ok, Item, _Del, Sysmsg, _HouseData1, _Msgs, MFA1}, FnList} ->
	    [Fn() || Fn <- FnList],
	    ItemInstID = item:get_instid(Item),
	    Packet = #notify_use_item_result{item_inst_id =ItemInstID, 
					     item_tplt_id=ItemTpltID, result=1},
	    net_helper:send2client(Owner, Packet),
	    sys_msg:send(Owner, Sysmsg),	    
	    do_mfa(MFA1)	    
    end.


use_item_impl(Owner, ItemID, Targets, PlayerData) ->
    F = fun() ->
    		HouseData = house_pack:read(Owner),
    		case house_pack:get_item(ItemID, HouseData) of
    		    {false, Err} -> {false, [{sys_msg, send, [Owner, Err]}]};
		    Item ->
			TpltID = item:get_tempid(Item),
			ItemTplt = tplt:get_data(props_item_tplt, TpltID),
			case can_use_item(Owner, Targets, HouseData, Item, ItemTplt, PlayerData) of
			    true ->
				use_item(Owner, Targets, HouseData, Item, ItemTplt, PlayerData);
			    {false, Err} -> {false, [{sys_msg, send, [Owner, Err]}]}
			end
		end
    	end,

    case db:transaction(F) of
	{false, MFA} ->
	    do_mfa(MFA),
	    PlayerData;
	{ok, Item, Del, Sysmsg, HouseData1, Msgs, MFA1} ->
	    TpltID1 = item:get_tempid(Item),
	    case Del of
		?use_del ->
		    DelItemCount = 1,
		    HouseID = house:get_house_id(HouseData1),
		    item_money_log:log_delete_item(HouseID, TpltID1, DelItemCount, Owner),
		    house_pack:send_msgs(Msgs, HouseData1);
		?use_not_del -> ok
	    end,
	    Packet = #notify_use_item_result{item_inst_id = ItemID, item_tplt_id=TpltID1, result=1},
	    net_helper:send2client(Owner, Packet),
	    sys_msg:send(Owner, Sysmsg),
	    do_mfa(MFA1)	    
    end.

%% 判断能否使用物品
can_use_item(_Owner, _Targets, _HouseData, {false, Err}, _ItemTplt, _PlayerData) ->
    {false, Err};
can_use_item(Owner, Targets, HouseData, Item, ItemTplt, PlayerData) ->
    #props_item_tplt{module=Module} = ItemTplt,
    M = binary_to_atom(Module, latin1),
    M:can_use_item(Owner, Targets, HouseData, Item, ItemTplt, PlayerData).


%% 使用物品的对外接口
use_item(Owner, Targets, HouseData, Item, ItemTplt, PlayerData) ->
    #props_item_tplt{module=M, arguments=A, sysmsg=Sysmsg, del=Del}=ItemTplt,
    case do_script(M, {Owner, Targets, HouseData, Item, ItemTplt, PlayerData}, A) of
	{false, MFA} -> {false, MFA};
	{ok, HouseData1,  MFA} ->
	    case Del of
		?use_not_del -> 
		    house_pack:save(HouseData1),
		    {ok, Item, Del, Sysmsg, null, null, MFA};
		?use_del ->
		    case house_pack:del_items([item:get_instid(Item)], HouseData1) of
			{false, Err} ->
			    house_pack:save(HouseData1),
			    {false, [{sys_msg, send, [Owner, Err]}]};
			{NHouseData, Msgs} -> 
			    house_pack:save(NHouseData),
			    {ok, Item, Del, Sysmsg, NHouseData, Msgs, MFA}
		    end
	    end
    end.

do_script(M, Extra, A) ->
    Module = binary_to_list(M),
    Script = lists:concat([Module, ":use_item(Extra, ", binary_to_list(A), ")."]),
    Ret = util:eval(Script, 'Extra', Extra),
    Ret.

do_mfa([]) ->
    ok;
do_mfa([{M, F, A} | Rest]) ->
    apply(M, F, A),
    do_mfa(Rest).
