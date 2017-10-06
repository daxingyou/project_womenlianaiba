%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2013, hongjx
%%% @doc
%%%   派对物品管理
%%% @end
%%% Created :  8 Jan 2013 by hongjx <hongjx@35info.cn>

-module(party_items).


-include("packet_def.hrl").
-include("house_data.hrl").

-export([on_enter_house/3, 
	 on_stop_party/1,
	 dec_player_items/3, 
	 on_start_party/3]).
%%-compile(export_all).

-record(party_items, {house_id, items=[]}).

%%%============================================================================
%%% API Functions
%%%============================================================================
dec_player_items(HouseID, P, ItemID) when is_integer(HouseID), is_atom(P), is_integer(ItemID) ->
    PlayerItems = read(HouseID),

    case get_player_items(PlayerItems, P) of
	[] ->
	    {false, []};
	L ->
	    case dec_item(ItemID, L) of
		L ->
		    {false, []};
		NewL ->
		    NewPlayerItems = set_player_items(PlayerItems, P, NewL),
		    write(HouseID, NewPlayerItems),
		    {ok, [fun() -> notify_update_items(P, NewL) end]}
	    end
    end.

on_enter_house(HouseData, P, CostItems) when is_atom(P) ->
    F = fun() ->
		on_enter_house_1(HouseData, P, CostItems)
	end,
    db:transaction(F).

on_enter_house_1(#house_data{house_id=HouseID}=HouseData, P, CostItems) ->
    case CostItems of
	[] ->
	    notify_update_items(P, []);
	_ ->
	    PlayerItems = read(HouseID),
	    case get_player_items(PlayerItems, P) of
		[] ->
		    GuestCount = common_def:get_val(party_guest_item_count),
		    MasterCount = common_def:get_val(party_master_item_count),
		    N = case house:is_house_owner(HouseData, P) of
			    true -> MasterCount;
			    _ -> GuestCount
			end,
		    Items = [{ItemID, N} || ItemID <- CostItems],
		    NPlayerItems = [{P, Items} | PlayerItems],
		    write(HouseID, NPlayerItems),
		    notify_update_items(P, Items),
		    notify_gain_items(P, Items);
		L ->
		    notify_update_items(P, L)
	    end
    end.

on_start_party(HouseData, Players, PartyItems) ->        
    F = fun() ->
		on_start_party_1(HouseData, Players, PartyItems)
	end,
    db:transaction(F).

on_stop_party(HouseID) ->
    db:delete({party_items, HouseID}).


%%%============================================================================
%%% inner Functions
%%%============================================================================

read(HouseID) when is_integer(HouseID) ->
    case db:read(party_items, HouseID) of
	[#party_items{items=L}] -> L;	    
	_ -> []
    end.
	     
write(HouseID, PlayerItems) when is_integer(HouseID), is_list(PlayerItems) ->
    db:write(#party_items{house_id=HouseID, items=PlayerItems}).



get_player_items(PlayerItems, P) when is_list(PlayerItems), is_atom(P) ->
    case lists:keyfind(P, 1, PlayerItems) of
	{_, Items} ->
	    Items;
	_ ->
	    []
    end.

set_player_items(PlayerItems, P, Items) when is_atom(P) ->
    case get_player_items(PlayerItems, P) of
	[] ->
	    [{P, Items} | PlayerItems];
	_ ->
	    lists:keyreplace(P, 1, PlayerItems, {P, Items})
    end.


dec_item(ItemID, L) when is_integer(ItemID), is_list(L) ->
    F = fun({ID, Count}, Acc) ->
		case ID of
		    ItemID -> 
			case Count < 2 of
			    true -> 
				[{ID, 0} | Acc];
			    _ -> 
				[{ID, Count - 1} | Acc]
			end;
		    _ ->
			[{ID, Count} | Acc]
		end	
		
	end,
    lists:foldr(F, [], L).

make_pack_grid(ItemID, Count) ->
    #pack_grid{count=Count, item_data=item:new(ItemID, ItemID)}.

notify_update_items(P, NewL) ->
    PairList = [make_pack_grid(K, V)|| {K, V} <- NewL],
    net_helper:send2client(P, #notify_update_party_items{items=PairList}).

notify_gain_items(P, NewL) ->
    PairList = [make_pack_grid(K, V) || {K, V} <- NewL],
    net_helper:send2client(P, #notify_party_items{items=PairList}).


on_start_party_1(HouseData, Players, PartyItems) ->        
    #house_data{house_id=HouseID} = HouseData,
    %% 分发变身物品
    GuestCount = common_def:get_val(party_guest_item_count),
    MasterCount = common_def:get_val(party_master_item_count),
    PlayerItems =
	[begin
	     N = case house:is_house_owner(HouseData, P) of
		     true -> MasterCount;
		     _ -> GuestCount
		 end,
	     Items = [{ItemID, N} || ItemID <- PartyItems],
	     {P, Items}
	 end || P <- Players],

    write(HouseID, PlayerItems),

    case PartyItems of
	[] -> ok;
	_ ->
	    [begin 
		 notify_update_items(P, Items), 
		 notify_gain_items(P, Items) 
	     end || {P, Items} <- PlayerItems]
    end.
