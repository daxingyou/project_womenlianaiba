%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%%
%%% @end
%%% Created :  9 Oct 2012 by LinZhengJian <linzhj@35info.cn>

-module(yy_accounting_context).

-include("records.hrl").
-include("common_def.hrl").
-include("resource.hrl").
-include("packet_def.hrl").

-define(yy_accounting_table, yy_accounting).

-export([init/0]).

-export([pay/4, cancel/1]).

-export([accouting_callback/1]).

init()->
    ets:new(?yy_accounting_table, [set, public, named_table]). 

pay(Account, #yy_payment_info{uid=UId, ch=Channel, srvid=SrvId}=PaymentInfo, #order{order_id=OrderID}=Order, Callback)->
    Amount = accounting_context:get_order_amount(Order),
    HttpCallback = 
	fun(Result)->
		data_helper:format("YYResult:~p~n",[Result]),
		case Result of 
		    {error, _, _}->
			sys_msg:send(list_to_atom(UId), 402),
			accounting_context:log(Order#order{status=?order_refuse}, PaymentInfo),
			Return = Callback(Order#order{status=?order_refuse}),
			#ship_result{return=Return};
		    _->
			case proplists:get_value("op_ret", Result) of
			    "1"-> %%支付完成，直接发货
				YYOrderId = proplists:get_value("orderid", Result),
				save_payment_data(Order#order{status=?order_paying}, YYOrderId, Callback, PaymentInfo),
				ship(YYOrderId);
			    "20"-> %%等待用户确认支付
				YYOrderId = proplists:get_value("orderid", Result),
				save_payment_data(Order#order{status=?order_paying}, YYOrderId, Callback, PaymentInfo);
			    "-32"-> %%余额不足
				YYOrderId = proplists:get_value("orderid", Result),
				cancel(YYOrderId),
				Packet = #notify_open_yy_recharge_ui{},
				net_helper:send2client(Account, Packet);
			    _->
				Return = Callback(Order#order{status=?order_cancel}),
				accounting_context:log(Order#order{status=?order_cancel}, PaymentInfo),
				#ship_result{return=Return}
			end
		end
	end,
    %% SN = OrderID,
    yy_strategy:pay_money(UId, Amount, OrderID, Channel, SrvId, HttpCallback).

cancel(OrderId)->
    case get_payment_data(OrderId) of
	{_Order, _OriginalYYOrderId, _Callback, undefined}->
	    ok;	
	{Order, _OriginalYYOrderId, Callback, PaymentInfo} ->
	    accounting_context:log(Order#order{status=?order_cancel}, PaymentInfo),
	    Callback(Order#order{status=?order_cancel})
    end.

save_payment_data(Order, Token, Callback, PaymentInfo)->
    ets:insert(?yy_accounting_table, {Token, Order, Token, Callback, PaymentInfo}).

get_payment_data(Token)->
    case ets:lookup(?yy_accounting_table, Token) of
	[{OrderId, Order, Token, Callback, PaymentInfo}] ->
	    ets:delete(?yy_accounting_table, OrderId),
	    {Order, Token, Callback, PaymentInfo};
	_ ->
	    {#order{}, "", undefined, undefined}
    end.

ship(YYOrderId)->
    {Order, OriginalYYOrderId, Callback, #yy_payment_info{uid=UId, srvid=SrvId}=PaymentInfo} = get_payment_data(YYOrderId),
    data_helper:format("OriginalOrderId:~p~n",[OriginalYYOrderId]),
    case YYOrderId of
	OriginalYYOrderId->
	    %% data_helper:format("Callback:~p~n",[Callback]),
	    data_helper:format("Order:~p~n",[Order#order{status=?order_payed}]),
	    Return = Callback(Order#order{status=?order_payed}),
	    accounting_context:log(Order#order{status=?order_payed}, PaymentInfo),
	    Amount = accounting_context:get_order_amount(Order),
	    payment_return_context:return(list_to_atom(UId), Amount, calendar:local_time()),
	    data_helper:format("Return:~p~n",[Return]),
	    case Return of
		?pay_shipped->
		    %%发送finishOrder请求, 考虑异步请求
		    YYMapping = #yy_orderid_mapping{yyorderid=YYOrderId, orderid=Order#order.order_id},
		    db:dirty_write(YYMapping),
		    player:yy_finish_order({UId, YYOrderId, SrvId});
		_->
		    ok
	    end,
	    data_helper:format("send finish order!~n"),
	    #ship_result{return=Return};
	_->
	    #ship_result{return=2}
    end.

accouting_callback(Query)->
    AppId = proplists:get_value("appid", Query),
    UId = proplists:get_value("uid", Query),
    OpRet = proplists:get_value("op_ret", Query),
    Token = proplists:get_value("orderid", Query),
    Money = proplists:get_value("money", Query),
    Channel = proplists:get_value("ch", Query),
    SrvId = proplists:get_value("srvid", Query), 
    Time = proplists:get_value("time", Query),
    Verify = proplists:get_value("verify", Query),
    
    %% 需要op_ret验证
    case OpRet=="1" andalso yy_strategy:get_verify([AppId, UId, OpRet, Money, Token, Channel, SrvId, Time])==Verify of
	true->
	    ship(Token),
	    ok;
	_->
	    error
    end.
