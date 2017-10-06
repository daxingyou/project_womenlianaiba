%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%%
%%% @end
%%% Created : 27 Jun 2012 by LinZhengJian <linzhj@35info.cn>

-module(player_produce).

-include("records.hrl").
-include("tplt_def.hrl").
-include("packet_def.hrl").
-include("common_def.hrl").
-include("produce_context.hrl").

-export([handle_cast/2, start/1]).

start(Account) ->
    [
     router:make_event_source(?msg_req_produce, Account, {Account, ?MODULE})
    ].

handle_cast({_MSG, #req_produce{produce_manual_id=ItemId,lucky_stone_count=LuckyStoneCount, has_insurance=HasInsurance}}, State) ->
    Account = player_data:get_account(State),
    ProductRequest = #produce_request{produce_manual_id=ItemId,
				      lucky_stone_count=LuckyStoneCount, 
				      has_insurance=case HasInsurance of 0->false; _->true end,
				      account=Account},
    Callback = fun(#produce_response{status=Status, message=Message, result_item=ResultItem, player=Player})->
		       case ResultItem of 
			   undefined->
			       net_helper:send2client(Account, #notify_produce{result=Status, message=Message, player=Player});
			   #item{} ->
			       net_helper:send2client(Account, #notify_produce{result=Status, message=Message, finished=ResultItem, player=Player})
		       end
	       end,
    produce_context:produce(ProductRequest, Callback),
    net_helper:send2client(Account, #notify_produce_ack{}),
    {noreply, State}.
