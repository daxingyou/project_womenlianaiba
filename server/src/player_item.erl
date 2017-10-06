%%%-------------------------------------------------------------------
%%% @author linyb <linyb@35info.cn>
%%% @copyright (C) 2012, linyb
%%% @doc
%%%
%%% @end
%%% Created : 27 Dec 2012 by linyb <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(player_item).

-include("packet_def.hrl").
-include("enum_def.hrl").
-include("router.hrl").
-include("tplt_def.hrl").
-include("sys_msg.hrl").
%% API
-export([start/1, handle_cast/2]).

%%%===================================================================
%%% API
%%%===================================================================
start(Account) ->
    [router:make_event_source(?msg_req_extend_aging_item, Account, {self(), ?MODULE})
    ].

%%%===================================================================
%%% Handle Cast
%%%===================================================================
handle_cast({#msg{src=Account}, #req_extend_aging_item{item_inst_id=InstId}}, State) ->
    [PlayerBasicData] = db:dirty_read(player_basic_data, Account),
    HouseId = player_basic_data:get_house_id(PlayerBasicData),
    [HouseData] = db:dirty_read(house_data, HouseId),
    ExtendItemId = common_def:get_val(extend_aging_item),
    Count = house_pack:get_item_count_by_tempid([ExtendItemId], HouseData),
    case Count > 0 of
	true ->
	    Item = house_pack:get_item(InstId, HouseData),
	    NItem = item:clear_del_time(Item),
	    case house_pack:del_items([Item], HouseData) of
		{false, _} ->
		    ok;
		{NHouseData, Msg1} ->
		    {NNHouseData, Msg2} = house_pack:add_items([NItem], NHouseData),
		    db:dirty_write(NNHouseData),
		    house_pack:send_msgs(Msg1 ++ Msg2, NNHouseData),
		    net_helper:send2client(Account, #notify_extend_aging_item{})
	    end;
	false ->
	    sys_msg:send(Account, ?err_extend_aging_item)
    end,
    {noreply, State}.

%%--------------------------------------------------------------------
%% @doc
%% @spec
%% @end
%%--------------------------------------------------------------------

%%%===================================================================
%%% Internal functions
%%%===================================================================
