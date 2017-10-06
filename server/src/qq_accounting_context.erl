%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%% QQ支付接口
%%% @end
%%% Created : 10 Apr 2012 by LinZhengJian <linzhj@35info.cn>

-module(qq_accounting_context).

-include("records.hrl").
-include("common_def.hrl").
-include("resource.hrl").

-export([init/0]).

-export([pay/3, cancel/1]).

-export([accouting_callback/2]).

-define(qq_accounting_table, qq_accounting).

pay(#qq_payment_info{open_id=OpenId, open_key=OpenKey, pf=PF, pf_key=PFKey}=PaymentInfo, 
    #order{order_id=OrderId, goods_meta=GoodsMeta}=Order, Callback)->
    %% 转换订单物品
    % 发送buy_goods请求
    Amount = accounting_context:get_order_amount(Order),
    %% ID*price*num
    PayItem = integer_to_list(OrderId) ++ "*" ++ integer_to_list(Amount) ++ "*1",
    GoodsUrl = common_def:get_val(qq_goods_url),
    TimeStamp = integer_to_list(datetime:get_unix_timestamp(now())),
    AppMode = "1",

    %% 分析buy_goods响应, 成功则等待回调，失败，修改order状态，并进行回调
    HttpCallback = 
	fun(Result)->
		data_helper:format("JsonResult:~p~n",[Result]),
		case Result of 
		    {error, _, _}->
			sys_msg:send(list_to_atom(OpenId), 402),
			accounting_context:log(Order#order{status=?order_refuse}, PaymentInfo),
			Return = Callback(Order#order{status=?order_refuse}),
			#ship_result{return=Return};
		    _->
			case json:get_value(Result, "ret") of
			    0->
				Token = json:get_value(Result, "token"),
				UrlParams = json:get_value(Result, "url_params"),
				save_payment_data(Order#order{status=?order_paying}, Token, Callback, PaymentInfo),
				%% 要求客户端弹出页面
				router:cast(list_to_atom(OpenId), show_buy_dialog, {Token, UrlParams, integer_to_list(OrderId)});
			    _->
				Return = Callback(Order#order{status=?order_cancel}),
				accounting_context:log(Order#order{status=?order_cancel}, PaymentInfo),
				#ship_result{return=Return}
			end
		end
	end,
    qq_strategy:buy_goods(PF, OpenId, OpenKey, PFKey, PayItem, binary_to_list(base64:encode(GoodsMeta)), GoodsUrl, integer_to_list(Amount), TimeStamp, AppMode, HttpCallback),
    ok.

cancel(OrderId)->
    case get_payment_data(OrderId) of
	{_Order, _Token, _Callback, undefined}->
	    2;	
	{Order, _Token, Callback, PaymentInfo} ->
	    accounting_context:log(Order#order{status=?order_cancel}, PaymentInfo),
	    Callback(Order#order{status=?order_cancel})
    end.

ship(OrderId, Token)->
    {Order, OriginalToken, Callback, #qq_payment_info{open_id=OpenId}=PaymentInfo} = get_payment_data(OrderId),
    data_helper:format("Token:~p=OriginalToken:~p~n",[Token, OriginalToken]),
    case list_to_binary(Token) of
	OriginalToken->
	    data_helper:format("Callback:~p~n",[Callback]),
	    data_helper:format("Order:~p~n",[Order#order{status=?order_payed}]),
	    Return = Callback(Order#order{status=?order_payed}),
	    Amount = accounting_context:get_order_amount(Order),
	    payment_return_context:return(list_to_atom(OpenId), Amount, calendar:local_time()),
	    accounting_context:log(Order#order{status=?order_payed}, PaymentInfo),
	    #ship_result{return=Return};
	_->
	    #ship_result{return=2}
    end.

init()->
    ets:new(?qq_accounting_table, [set, public, named_table]). 

accouting_callback(FilePath, QueryString)->
    Query = http_helper:parse_qs(QueryString),
    %% OpenId = http_helper:get_param(Query, "openid"),
    %% AppId =  http_helper:get_param(Query, "appid"),
    %% TimeStamp =  http_helper:get_param(Query, "ts"),
    %% ID*price*num
    PayItem =  http_helper:get_param(Query, "payitem"),
    PayItemInfo = string:tokens(PayItem, "*"),
    OrderId = list_to_integer(hd(PayItemInfo)),
    Token =  http_helper:get_param(Query, "token"),
    "v3" =  http_helper:get_param(Query, "version"),
    %% ProvideType =  http_helper:get_param(Query, "providetype"),
    %% Amount =  http_helper:get_param(Query, "amt"),
    Sig =  http_helper:get_param(Query, "sig"),

    VerifyQueries = proplists:delete("sig", Query),
    case verify_sig(FilePath, VerifyQueries, Sig) of
	true->
	    #ship_result{return=Return} = ship(OrderId, Token),
	    Return;
	false->
	    4
    end.

save_payment_data(#order{order_id=OrderID}=Order, Token, Callback, PaymentInfo)->
    ets:insert(?qq_accounting_table, {OrderID, Order, Token, Callback, PaymentInfo}).

get_payment_data(OrderId)->
    case ets:lookup(?qq_accounting_table, OrderId) of
	[{OrderId, Order, Token, Callback, PaymentInfo}] ->
	    ets:delete(?qq_accounting_table, OrderId),
	    {Order, Token, Callback, PaymentInfo};
	_ ->
	    {#order{}, "", undefined, undefined}
    end.

verify_sig(FilePath, Queries, Sig)->
    Sig == qq_strategy:get_callback_sig(FilePath, Queries, get_appkey()).

get_appkey() ->
    case application:get_env(server, app_key) of
	{ok, APPKEY} ->
	    APPKEY;
	undefined  ->
	    "9142f12312c0ba142b526ce3ef477637"
    end.

