%%%-------------------------------------------------------------------
%%% @author linyijie <linyj@35info.cn>
%%% @copyright (C) 2013, linyijie
%%% @doc
%%% Íæ¼Ò¶Ò»»
%%% @end
%%% Created : 29 Mar 2013 by linyijie <linyj@35info.cn>
%%%-------------------------------------------------------------------
-module(player_exchange).

%% API
-export([start/1]).
-export([handle_cast/2]).

-include("packet_def.hrl").
-include("enum_def.hrl").
-include("router.hrl").
-include("records.hrl").
-include("tplt_def.hrl").
-include("common_def.hrl").
-include("resource.hrl").
-include("house_data.hrl").
-include("sys_msg.hrl").

%%%===================================================================
%%% API
%%%===================================================================
start(Account) ->
    [router:make_event_source(?msg_req_exchange, Account, {self(), ?MODULE})
    ].

%%--------------------------------------------------------------------
%% @doc
%% @spec
%% @end
%%--------------------------------------------------------------------

%%%===================================================================
%%% Handle Cast
%%%===================================================================
handle_cast({#msg{src=Account}, #req_exchange{id=ID}}, State) ->
    ExchangeTplt = tplt:get_data(exchange_tplt, ID),
    F = fun() ->
		[PlayerBasicData] = db:read(player_basic_data, Account),
		HouseId = player_basic_data:get_house_id(PlayerBasicData),
		[HouseData] = db:read(house_data, HouseId),
		Materials = filter_materials([{ExchangeTplt#exchange_tplt.item1_id, 
					       ExchangeTplt#exchange_tplt.item1_num},
					      {ExchangeTplt#exchange_tplt.item2_id, 
					       ExchangeTplt#exchange_tplt.item2_num},
					      {ExchangeTplt#exchange_tplt.item3_id, 
					       ExchangeTplt#exchange_tplt.item3_num},
					      {ExchangeTplt#exchange_tplt.item4_id, 
					       ExchangeTplt#exchange_tplt.item4_num}
					     ]),
		case can_exchange(Materials, HouseData) of
		    true ->
			do_exchange(Account, ExchangeTplt, Materials, PlayerBasicData, HouseData);
		    Reason ->
			Reason
		end
	end,
    case db:transaction(F) of
	{false, Reason} ->
	    sys_msg:send(Account, Reason);
	{false, mfa, MFA} ->
	    do_mfa(MFA);
	{HouseData, Msgs, MFA} ->
	    house_pack:send_msgs(Msgs, HouseData),
	    house_diamond:notify(HouseData),
	    do_mfa(MFA),
	    router:cast(Account, on_player_exchange, ID),
	    net_helper:send2client(Account, #notify_exchange{})
    end,
    {noreply, State}.

%%%===================================================================
%%% Internal functions
%%%===================================================================
filter_materials(Materials) ->
    lists:foldl(fun({ItemId, Num}, M) ->
			case ItemId of
			    0 ->
				M;
			    _ ->
				[{ItemId, Num}|M]
			end
		end, [], Materials).

can_exchange(Materials, HouseData) ->
    try
	validate_material(Materials, HouseData)
    catch
	throw:Reason ->
	    Reason
    end.

validate_material([], _HouseData) ->
    true;
validate_material([{ItemId, Count}|Materials], HouseData) ->
    case house_pack:get_item_count_by_tempid([ItemId], HouseData) >= Count of
	true ->
	    validate_material(Materials, HouseData);
	false ->
	    throw({false, ?unlock_house_material_error})
    end.

do_exchange(Account, ExchangeTplt, Materials, PlayerBasicData, HouseData) ->
    M = ExchangeTplt#exchange_tplt.reward_module,
    A = ExchangeTplt#exchange_tplt.reward_params,
    case do_script(M, {Account, [], HouseData, [], [], PlayerBasicData}, A) of
	{false, MFA} -> {false, mfa, MFA};
	{ok, NHouseData, MFA} ->
	    {NNHouseData, Msgs} = house_pack:del_items_by_count(Materials, NHouseData),
	    db:write(NNHouseData),
	    {NNHouseData, Msgs, MFA}
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
