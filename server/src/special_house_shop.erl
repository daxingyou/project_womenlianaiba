%%%-------------------------------------------------------------------
%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%   特殊产权商店
%%% @end
%%% Created :  6 Jun 2012 by hongjx <hongjx@35info.cn>
%%%-------------------------------------------------------------------
-module(special_house_shop).

-behaviour(gen_server).

-include("packet_def.hrl").
-include("router.hrl").
-include("common_def.hrl").
-include("tplt_def.hrl").
-include("enum_def.hrl").
-include("sys_msg.hrl").
-include("player_data.hrl").
-include("records.hrl").
-include("resource.hrl").
-include("house_data.hrl").

%% API
-export([start_link/0]).

%% gen_server callbacks
-export([init/1, handle_call/3, handle_cast/2, handle_info/2,
	 terminate/2, code_change/3]).

-export([get_goods_list/0, buy_house/2, help_buy_house/3, gm_add_house/2, add_house/2,
	 get_player_special_house/1, start_auto_dec_timer/0, get_name/1]).
-export([get_house_list/1, get_account/1]).

-define(SERVER, ?MODULE). 

-record(state, {}).

%% 玩家房屋列表
-record(player_special_house,
	{account='',
	 house_list=[]
	}
       ).

%%%===================================================================
%%% API
%%%===================================================================
%%--------------------------------------------------------------------
%% @doc
%% @获取房屋列表信息
%% @end
%%--------------------------------------------------------------------
get_house_list(PlayerSpecialHouse) ->
    PlayerSpecialHouse#player_special_house.house_list.

%%--------------------------------------------------------------------
%% @doc
%% @获取帐号信息
%% @end
%%--------------------------------------------------------------------
get_account(PlayerSpecialHouse) ->
    PlayerSpecialHouse#player_special_house.account.

get_player_special_house('') ->
    [];
get_player_special_house(Account) when is_atom(Account) ->
    case db:dirty_read(player_special_house, Account) of
	[#player_special_house{house_list=Val}] ->
	    Val;
	[] ->
	    []
    end.


gm_add_house(Account, HouseTpltID) ->
    F = fun() -> db_add_house(Account, HouseTpltID) end,
    db:transaction(F).

add_house(Account, HouseTpltID) ->
    F = fun() -> db_add_house(Account, HouseTpltID) end,
    db:transaction(F).

%% %% 启动定时器(自动删房屋商品)
%% %% Avg 表示平均每天删几个
%% %% Max 表示每天最多可删几个
%% start_timer(Avg, Max) ->    
%%     gen_server:cast(?SERVER, {start_timer, Avg, Max}).

%% %% 停止定时器
%% stop_timer() ->    
%%     gen_server:cast(?SERVER, stop_timer).

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
    load_tplt(),    

    %% %% 平均每天删3个(最小0个, 最大12个)
    %% Tm = start_auto_dec_timer(),
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

%% 帮别人满足愿望
%% FunSuccess 返回MessageList = [{Account, Packet}]
help_buy_house(#player_wish{goods_id=HouseTpltID, account=Recver}, DoAfterBuy, State) ->
    Account = player_data:get_account(State),
    F = fun() -> 
		%% 帮别人买
		case do_buy_house(HouseTpltID, Recver) of
		    {false, Err} -> 
			{false, Err};
		    _ ->
			DoAfterBuy()
		end
	end,

    %% 购买后要做的事情
    FunBuy = fun() ->
		case db:transaction(F) of
		    {false, Err} ->				
			sys_msg:send(Account, Err),
			?pay_error;
		    MessageList ->
			%% 通知购买成功
			[net_helper:send2client(Target, Message) || {Target, Message} <- MessageList],

			?pay_shipped %% 成功发货
		end
	end,
    buy_house_1(HouseTpltID, State, FunBuy).


%% 购买房屋
buy_house(HouseTpltID, State) ->
    Account = player_data:get_account(State),
    
    %% 购买后要做的事情
    FunBuy = fun() ->
		case db:transaction(fun() -> do_buy_house(HouseTpltID, Account) end) of
		    {false, Err} ->				
			sys_msg:send(Account, Err),
			?pay_error;
		    _ ->
			%% 刷新数量
			net_helper:send2client(Account, 
			   #notify_special_house_list{house_list=get_goods_list()}),
			
			%% 通知购买成功
			sys_msg:send(Account, ?msg_buy_special_house_ok),
			net_helper:send2client(Account, #notify_buy_special_house_success{}),
			?pay_shipped %% 成功发货
		end
	end,
    buy_house_1(HouseTpltID, State, FunBuy).


buy_house_1(HouseTpltID, State, FunBuy) ->
    LoginType = player_data:get_login_type(State),
    Price = util:get_price(get_special_house_price(HouseTpltID), LoginType),
    ReqGoodsList = [{HouseTpltID, 1, Price}],

    TestQQBuy = common_def:get_val(test_qq_buy),

    case TestQQBuy of
	0 ->
	    %% 组织回调函数
	    ShipCallback = 
		fun(#order{status=Status}=_Order)-> 			   
			case (Status =:= ?order_payed) of
			    true ->
				FunBuy();
			    _ ->
				?pay_error
			end				       
		end,
	    
	    player_love_coin:pay(ReqGoodsList, ShipCallback, ?order_goods_meta_house, State);
	_ ->
	    FunBuy()
    end,
    ok.


%%%===================================================================
%%% Internal functions
%%%===================================================================
%% 加载模板数据
load_tplt() ->
    F = fun() ->
		All = tplt:get_all_data(special_house_tplt),
		OldList = db:all_keys(special_house_goods),		
		[db:write(build_record(X)) || #special_house_tplt{id=ID}=X <- All, 
		    not lists:member(ID, OldList)],
		stop_sell_old_house(),
		ok
	end,
    db:transaction(F).

build_record(#special_house_tplt{id=ID, 
				 house_tplt_id=TpltID, 
				 count=Count, 
				 q_coin=QCoin}) ->
    #special_house_goods{id=ID, 
		   house_tplt_id=TpltID, 
		   remain_count=Count, 
		   q_coin=QCoin}.


%% 停止旧房子的销售(主要是针对同类型房屋)
stop_sell_old_house() ->
    List = do_get_goods_list(),

    L = order_by_id(List),


    F = fun(#special_house_goods{house_tplt_id=TpltID}=R, {DelAcc, IDs}) ->
		case lists:member(TpltID, IDs) of
		    true ->
			{[R | DelAcc], IDs};
		    _ ->
			{DelAcc, [TpltID | IDs]}
		end
	end,

    {StopList, _} = lists:foldr(F, {[], []}, L),
    [db:write(X#special_house_goods{remain_count=0}) || X <- StopList].


order_by_id(List) ->
    lists:keysort(#special_house_goods.id, List).


%% 取得在售商品列表
get_goods_list() ->
    db:transaction(fun() -> do_get_goods_list() end).
do_get_goods_list() ->
    F = fun(#special_house_goods{remain_count=Count}=R, Acc) ->
		case Count > 0 of
		    true ->
			[R | Acc];
		    _ ->
			Acc
		end
	end,

    db:foldl(F, [], special_house_goods).


get_goods_by_tplt_id(HouseTpltID) ->
    F = fun(#special_house_goods{house_tplt_id=TpltID, remain_count=Count}=R, Acc) ->
		case (Count > 0) and (HouseTpltID =:= TpltID) of
		    true ->
			[R | Acc];
		    _ ->
			Acc
		end
	end,

    db:foldl(F, [], special_house_goods).


do_buy_house(HouseTpltID, Account) when is_atom(Account) ->
    %% 更新商品数量    
    %% 更新玩家特殊产权列表
    case get_goods_by_tplt_id(HouseTpltID) of
	[#special_house_goods{id=ID, remain_count=Count}=GoodsR] -> 
	    db:write(GoodsR#special_house_goods{remain_count=Count - 1}),
	    Ret = db_add_house(Account, HouseTpltID),
	    #special_house_tplt{broadcast_id=BroadcastID} = tplt:get_data(special_house_tplt, ID),
	    broadcast(BroadcastID, HouseTpltID, Account),
	    Ret;
	[] -> %% 提示卖光了
	    {false, ?err_special_house_sell_out}
    end.


db_add_house(Account, HouseTpltID) ->
    case db:read(player_special_house, Account) of
	[#player_special_house{house_list=HouseList}=R] ->
	    db:write(R#player_special_house{house_list=[HouseTpltID | HouseList]});
	[] ->
	    db:write(#player_special_house{account=Account, house_list=[HouseTpltID]})
    end.
    


%% 取价格
get_special_house_price(HouseTpltID) ->
    List = get_goods_list(),
    case lists:keyfind(HouseTpltID, #special_house_goods.house_tplt_id, List) of
	#special_house_goods{q_coin=QCoin} -> QCoin			      
    end.



%% 自动删别墅
start_auto_dec_timer() ->
    ok.

%% start_auto_dec_timer() ->

%%     Avg = common_def:get_val(special_shop_auto_dec_n_per_day), 
%%     Max = common_def:get_val(special_shop_auto_dec_times_per_day),
%%     Percent = Avg * 100 div Max,
%%     {A1,A2,A3} = now(),
%%     rand:seed(A1, A2, A3),
%%     Rand = rand:uniform(100),
%%     data_helper:format("Rand:~p, Percent:~p~n", [Rand, Percent]),
%%     case Rand =< Percent of
%% 	true ->
%% 	    db:transaction(fun() -> do_dec_special_house() end);
%% 	_ ->
%% 	    ok
%%     end.

%% do_dec_special_house() ->
%%     F = fun(#special_house_goods{remain_count=Count}=R, Acc) ->
%% 		case Count > common_def:get_val(special_shop_auto_dec_min) of
%% 		    true -> 
%% 			[R#special_house_goods{remain_count=Count - 1} | Acc];
%% 		    _ -> %% 28 个就不再减了
%% 			Acc
%% 		end
%% 	end,

%%     L = db:foldl(F, [], special_house_goods),
%%     [db:write(X) || X <- L].

%% 公告(炫耀)
broadcast(BroadcastID, HouseTpltID, Account) when is_atom(Account) ->
    case BroadcastID > 0 of
	true ->
	    [BasicData] = db:dirty_read(player_basic_data, Account),

	    UserName = player_basic_data:get_username(BasicData),

	    #house_tplt{name=ItemName} = tplt:get_data(house_tplt, HouseTpltID),

	    %% 发送系统广播
	    sys_broadcast:send(BroadcastID, [util:to_string(UserName), util:to_string(ItemName)]);	
	_ ->
	    ok
    end.

get_name(HouseTempID) ->
    #house_tplt{name=ItemName} = tplt:get_data(house_tplt, HouseTempID),
    ItemName.
