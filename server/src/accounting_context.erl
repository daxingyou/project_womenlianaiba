%%%-------------------------------------------------------------------
%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%% 支付中间件
%%% @end
%%% Created : 11 Apr 2012 by LinZhengJian <linzhj@35info.cn>
%%%-------------------------------------------------------------------
-module(accounting_context).

-behaviour(gen_server).

%% API
-export([start_link/0]).

%% gen_server callbacks
-export([init/1, handle_call/3, handle_cast/2, handle_info/2,
	 terminate/2, code_change/3]).

-export([pay/4, cancel/1]).

-export([get_order_amount/1]).

-export([log/2, log/3]).

-define(SERVER, ?MODULE). 

-record(state, {}).

-include("records.hrl").
-include("resource.hrl").
-include("qq_strategy.hrl").

%%%===================================================================
%%% API
%%%===================================================================

%% spec Callback(Order)-> 支付回调状态(pay_shipped ||  pay_error || pay_token_error)
pay(_Account, #qq_payment_info{}=PaymentInfo, Order, Callback)-> 
    qq_accounting_context:pay(PaymentInfo, Order, Callback);
pay(Account, #yy_payment_info{}=PaymentInfo, Order, Callback)-> 
    yy_accounting_context:pay(Account, PaymentInfo, Order, Callback).

%% "{\"ret\":0,\"msg\":\"OK\\\"}"
%% "{\"ret\":1,\"msg\":\"server busy.\"}"
%% "{\"ret\":2,\"msg\":\"token no exist.\"}"
%% "{\"ret\":3,\"msg\":\"server timeout.\"}"
%% "{\"ret\":4,\"msg\":\"parameter error(sig).\"}"
cancel(OrderId)->
    qq_accounting_context:cancel(OrderId).

log(Order, PaymentInfo)->
    {{Year, Month, Day}, {_Hour, _Minute, _Second}} = calendar:local_time(),
    LogFileName = get_order_log_filename({Year, Month, Day}),
    %% File = get_file(LogFileName),
    gen_server:cast(?MODULE, {log, Order, PaymentInfo, LogFileName}),
    ok.
log(Order, PaymentInfo, LogFileName) ->
    %% File = get_file(LogFileName),
    gen_server:cast(?MODULE, {log, Order, PaymentInfo, LogFileName}),
    ok.

get_order_amount(#order{items=Items})->
    lists:foldl(fun(#order_item{number=Number, price=Price}, Amount) -> Amount + Number * Price end, 0, Items).

%%--------------------------------------------------------------------
%% @doc
%% Starts the server
%%
%% @spec start_link() -> {ok, Pid} | ignore | {error, Error}
%% @end
%%--------------------------------------------------------------------
start_link() ->
    gen_server:start_link({local, ?SERVER}, ?MODULE, [], []).

%%%===================================================================
%%% gen_server callbacks
%%%===================================================================

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Initializes the server
%%
%% @spec init(Args) -> {ok, State} |
%%                     {ok, State, Timeout} |
%%                     ignore |
%%                     {stop, Reason}
%% @end
%%--------------------------------------------------------------------
init([]) ->
    qq_accounting_context:init(),
    yy_accounting_context:init(),
    {ok, #state{}}.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Handling call messages
%%
%% @spec handle_call(Request, From, State) ->
%%                                   {reply, Reply, State} |
%%                                   {reply, Reply, State, Timeout} |
%%                                   {noreply, State} |
%%                                   {noreply, State, Timeout} |
%%                                   {stop, Reason, Reply, State} |
%%                                   {stop, Reason, State}
%% @end
%%--------------------------------------------------------------------
handle_call(_Request, _From, State) ->
    Reply = ok,
    {reply, Reply, State}.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Handling cast messages
%%
%% @spec handle_cast(Msg, State) -> {noreply, State} |
%%                                  {noreply, State, Timeout} |
%%                                  {stop, Reason, State}
%% @end
%%--------------------------------------------------------------------

handle_cast({log, Order, PaymentInfo, LogFileName}, State)->
    do_log(Order, PaymentInfo, LogFileName),
    {noreply, State};

handle_cast(_Msg, State) ->
    {noreply, State}.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Handling all non call/cast messages
%%
%% @spec handle_info(Info, State) -> {noreply, State} |
%%                                   {noreply, State, Timeout} |
%%                                   {stop, Reason, State}
%% @end
%%--------------------------------------------------------------------
handle_info(_Info, State) ->
    {noreply, State}.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% This function is called by a gen_server when it is about to
%% terminate. It should be the opposite of Module:init/1 and do any
%% necessary cleaning up. When it returns, the gen_server terminates
%% with Reason. The return value is ignored.
%%
%% @spec terminate(Reason, State) -> void()
%% @end
%%--------------------------------------------------------------------
terminate(_Reason, _State) ->
    ok.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Convert process state when code is changed
%%
%% @spec code_change(OldVsn, State, Extra) -> {ok, NewState}
%% @end
%%--------------------------------------------------------------------
code_change(_OldVsn, State, _Extra) ->
    {ok, State}.

%%%===================================================================
%%% Internal functions
%%%===================================================================
do_log(#order{order_id=OrderId, goods_meta=GoodsMeta, items=OrderItems, status=Status}, #yy_payment_info{uid=UId}, LogFileName)->
    ensure_dir(),
    {{Year, Month, Day}, {Hour, Minute, Second}} = calendar:local_time(),
    File = get_file(LogFileName),
    %% log order info
    %% Format:Date,OrderId,Account,Type,Status,GoodsId,Count,Summary
    [file:write(File,
    		util:string_format("\n~w-~w-~w ~w:~w:~w,~w,~s,~w,~w,~w,~w,~w,~w",
    				   [Year, Month, Day, Hour, Minute, Second,           %Date
    				    OrderId, UId, get_order_type(GoodsMeta),Status, GoodsId, Number, Number*Price,0 ])) || #order_item{goods_id=GoodsId, number=Number, price=Price} <- OrderItems],
    %%close log file
    file:close(File),
    ok;

do_log(#order{order_id=OrderId, goods_meta=GoodsMeta, items=OrderItems, status=Status},
      #qq_payment_info{open_id=OpenId, open_key=OpenKey, pf=PF}, LogFileName)->
    ensure_dir(),
    {{Year, Month, Day}, {Hour, Minute, Second}} = calendar:local_time(),
    File = get_file(LogFileName),
    UserInfo = get_user_info(PF, OpenId, OpenKey),
    %% log order info
    %% Format:Date,OrderId,Account,Type,Status,GoodsId,Count,Summary
    [file:write(File,
    		util:string_format("\n~w-~2..0w-~2..0w ~w:~w:~w,~w,~s,~w,~w,~w,~w,~w,~w",
    				   [Year, Month, Day, Hour, Minute, Second,           %Date
    				    OrderId, OpenId, get_order_type(GoodsMeta),Status, GoodsId, Number, Number*Price,UserInfo#pengyou.is_yellow_vip ])) 
		|| #order_item{goods_id=GoodsId, number=Number, price=Price} <- OrderItems],
    %%close log file
    file:close(File),
    ok.

get_order_log_filename({Year, Month, Day})->
    util:string_format("/data/orderlog/~w~2..0w~2..0w_order.csv",[Year, Month, Day]).

ensure_dir()->
    case filelib:is_dir("/data/orderlog") of
	true->
	    ok;
	false->
	    file:make_dir("/data"),
	    file:make_dir("/data/orderlog"),
	    ok
    end.

get_file(LogFileName)->
    case filelib:is_file(LogFileName) of
	true->
	    {ok, FileRef} = file:open(LogFileName, [append]),    
	    FileRef;
	false ->
	    {ok, FileRef} = file:open(LogFileName, [append]),    
	    file:write(FileRef, "Date,OrderId,Account,Type,Status,GoodsId,Count,Summary,Vip"),
	    FileRef
    end.

get_order_type(?order_goods_meta_props)->
    1;
get_order_type(?order_goods_meta_wish) ->
    2;
get_order_type(?order_goods_meta_clothes) ->
    3;
get_order_type(?order_goods_meta_gift) ->
    4;
get_order_type(?order_goods_meta_task) ->
    5;
get_order_type(?order_goods_meta_house) ->
    6;
get_order_type(?order_goods_meta_daily_active) ->
    7;
get_order_type(?order_goods_meta_ring_task) ->
    8;
get_order_type(?order_goods_meta_recharge) ->
    9;
get_order_type(?order_goods_yy_gift) ->
    10;
get_order_type(?order_goods_yy_host_recv) ->
    11;
get_order_type(?order_goods_yy_pay_back) ->
    12;
get_order_type(?order_goods_meta_farm) ->
    13;
get_order_type(?order_goods_meta_mind_quiz) ->
    14;
get_order_type(?order_goods_meta_hp) ->
    15;
get_order_type(?order_goods_meta_mate_up) ->
    16;
get_order_type(?order_goods_meta_food_stock) ->
    17;
get_order_type(?order_goods_meta_food_product) ->
    18;
get_order_type(?order_goods_meta_event) ->
    19;
get_order_type(?order_goods_meta_special_house) ->
    20;
get_order_type(?order_goods_meta_party_drink) ->
    21;
get_order_type(_) ->
    0.	   

%%获取用户信息(来自TX的信息)
get_user_info(PF, OpenId, OpenKey)->
    case db_player:get_online_player_user_info(list_to_atom(OpenId)) of
	undefined->
	    qq_strategy:get_user_info(PF, OpenId, OpenKey);
	UserInfo ->
	    UserInfo
    end.
