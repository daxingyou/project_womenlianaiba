%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2013, linyibin
%%% @doc
%%% °®Çé±Ò
%%% @end
%%% Created : 26 Feb 2013 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(player_love_coin).

%% API
-export([handle_cast/2, start/1, recharge_love_coin/3]).
-export([notify/1, can_pay/2, pay/4, get_player_love_coin/1, get_love_coin/1, recharge/3, update_love_coin/2]).

-include("packet_def.hrl").
-include("enum_def.hrl").
-include("router.hrl").
-include("records.hrl").
-include("tplt_def.hrl").
-include("common_def.hrl").
-include("resource.hrl").
-include("house_data.hrl").
-include("player_love_coin.hrl").

%%%===================================================================
%%% API
%%%===================================================================
%% ×¢²áÊÂ¼þ
%% Account:Íæ¼ÒÕÊºÅ
start(Account) ->
    [router:make_event_source(?msg_req_recharge_love_coin, Account, {self(), ?MODULE})
    ].

notify(Account) ->
    PlayerLoveCoin = get_player_love_coin(Account),
    LoveCoin = get_love_coin(PlayerLoveCoin),
    net_helper:send2client(Account, #notify_init_love_coin{love_coin=LoveCoin}).

can_pay(Account, LoveCoin) when is_atom(Account) ->
    PlayerLoveCoin = get_player_love_coin(Account),
    can_pay(PlayerLoveCoin, LoveCoin);
can_pay(PlayerLoveCoin, LoveCoin) ->
    CurrLoveCoin = PlayerLoveCoin#player_love_coin.love_coin,
    CurrLoveCoin >= LoveCoin.

pay(ReqGoodsList, ShipCallback, Type, PlayerData) ->
    Order = trade_context:make_order(ReqGoodsList, Type),
    LoveCoin = 	lists:foldl(
		  fun({_GoodsId, Number, Price}, TotalPrice)->
			  TotalPrice + (Number * Price)
		  end, 0, ReqGoodsList),
    Account = player_data:get_account(PlayerData),
    PlayerLoveCoin = get_player_love_coin(Account),
    case can_pay(PlayerLoveCoin, LoveCoin) of
	true ->
	    NOrder = Order#order{status=?order_payed},
	    case ShipCallback(NOrder) of
		?pay_shipped ->
		    do_pay(Account, NOrder, LoveCoin),
		    ?pay_shipped;
		{?pay_shipped, Reply} ->
		    do_pay(Account, NOrder, LoveCoin),
		    Reply;
		_ ->
		    ?pay_error
	    end;
	false ->
	    Order1 = Order#order{status=?pay_error},
	    ShipCallback(Order1),
	    net_helper:send2client(Account, #notify_open_recharge_ui{}),
	    ?pay_error
    end.

do_pay(Account, NOrder, LoveCoin) ->
    F = fun() ->
		NPlayerLoveCoin = get_player_love_coin(Account),
		NNPlayerLoveCoin = dec(NPlayerLoveCoin, LoveCoin),
		db:write(NNPlayerLoveCoin),
		NNPlayerLoveCoin
	end,
    case db:transaction(F) of
	NNPlayerLoveCoin ->
	    PaymentInfo = sysshop:get_payment_info(Account),
	    accounting_context:log(NOrder, PaymentInfo, get_love_coin_order_log_filename()),
	    %% accounting_context:log(NOrder, PaymentInfo, get_love_coin_order_log_filename()),
	    net_helper:send2client(Account, 
				   #notify_love_coin{love_coin=get_love_coin(NNPlayerLoveCoin)})
    end.


dec(Account, LoveCoin) when is_atom(Account) ->
    PlayerLoveCoin = get_player_love_coin(Account),
    dec(PlayerLoveCoin, LoveCoin);
dec(PlayerLoveCoin, LoveCoin) ->
    NLoveCoin = PlayerLoveCoin#player_love_coin.love_coin - LoveCoin,
    PlayerLoveCoin#player_love_coin{love_coin=NLoveCoin}.

recharge(Account, Type, LoveCoin) when LoveCoin > 0 ->
    F = fun() ->
		PlayerLoveCoin = get_player_love_coin(Account),
		NLoveCoin = PlayerLoveCoin#player_love_coin.love_coin + LoveCoin,
		NPlayerLoveCoin = PlayerLoveCoin#player_love_coin{love_coin=NLoveCoin},
		db:write(NPlayerLoveCoin),
		NPlayerLoveCoin
	end,
    case db:transaction(F) of
	NNPlayerLoveCoin ->
	    Order = trade_context:make_order([{0, 1, LoveCoin}], Type),
	    PaymentInfo = sysshop:get_payment_info(Account),
	    accounting_context:log(Order, PaymentInfo, get_add_love_coin_order_log_filename()),
	    NNLoveCoin = NNPlayerLoveCoin#player_love_coin.love_coin,
	    net_helper:send2client(Account, 
				   #notify_recharge_love_coin{love_coin=NNLoveCoin})
    end.

get_love_coin(PlayerLoveCoin) ->
    PlayerLoveCoin#player_love_coin.love_coin.

%%%===================================================================
%%% Handle Cast
%%%===================================================================
handle_cast({#msg{src=Account}, #req_recharge_love_coin{id=ID}}, State) ->
    recharge_love_coin(Account, ID, State),
    {noreply, State}.

%%--------------------------------------------------------------------
%% @doc
%% @spec
%% @end
%%--------------------------------------------------------------------

%%%===================================================================
%%% Internal functions
%%%===================================================================
recharge_love_coin(Account, ID, State) ->
    LoveCoinRecharge = tplt:get_data(love_coin_recharge_tplt, ID),
    QCoin = LoveCoinRecharge#love_coin_recharge_tplt.q_coin,
    ShipCallback = 
    	fun(#order{status=Status}=_Order)-> 			   
    		case (Status =:= ?order_payed) of
    		    true ->
			LoveCoin = LoveCoinRecharge#love_coin_recharge_tplt.buy_love_coin + 
			    LoveCoinRecharge#love_coin_recharge_tplt.reward_love_coin,
			F = fun() ->
				    PlayerLoveCoin = get_player_love_coin(Account),
				    NLoveCoin = PlayerLoveCoin#player_love_coin.love_coin + LoveCoin,
				    NPlayerLoveCoin = PlayerLoveCoin#player_love_coin{love_coin=NLoveCoin},
				    db:write(NPlayerLoveCoin),
				    NPlayerLoveCoin
			    end,

			case db:transaction(F) of
			    NNPlayerLoveCoin ->
				NNLoveCoin = NNPlayerLoveCoin#player_love_coin.love_coin,
				net_helper:send2client(Account, 
						       #notify_recharge_love_coin{love_coin=NNLoveCoin})
			end,
			?pay_shipped;
    		    _ ->
    			?pay_error
    		end				       
    	end,
    sysshop:qq_buy([{ID, 1, QCoin}], 
    		   ShipCallback, ?order_goods_meta_recharge, State).

get_player_love_coin(Account) ->
    case db:dirty_read(player_love_coin, Account) of
	[] ->
	    PlayerLoveCoin1 = #player_love_coin{account=Account, love_coin=0},
	    db:dirty_write(PlayerLoveCoin1),
	    PlayerLoveCoin1;
	[PlayerLoveCoin] ->
	    PlayerLoveCoin
    end.

get_love_coin_order_log_filename()->
    {{Year, Month, Day}, {_Hour, _Minute, _Second}} = calendar:local_time(),
    util:string_format("/data/orderlog/~w~2..0w~2..0w_love_coin_order.csv",[Year, Month, Day]).

get_add_love_coin_order_log_filename() ->
        {{Year, Month, Day}, {_Hour, _Minute, _Second}} = calendar:local_time(),
    util:string_format("/data/orderlog/~w~2..0w~2..0w_love_coin_add_order.csv",[Year, Month, Day]).

update_love_coin(Account, Coin) ->
    Data1 = case db:dirty_read(player_love_coin, Account) of
	       [] ->
		   #player_love_coin{account=Account, love_coin=Coin};
	       [Data] ->
		   Data#player_love_coin{love_coin=Coin}
	    end,
    db:dirty_write(Data1).
