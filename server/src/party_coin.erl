%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2013, hongjx
%%% @doc
%%%   派对积分货币
%%% @end
%%% Created : 13 Mar 2013 by hongjx <hongjx@35info.cn>

-module(party_coin).

-include("packet_def.hrl").
-include("enum_def.hrl").
-include("router.hrl").
-include("records.hrl").
-include("tplt_def.hrl").
-include("common_def.hrl").
-include("resource.hrl").
-include("house_data.hrl").
-include("player_love_coin.hrl").
-include("sys_msg.hrl").

-export([add/2, do_add/2, tran_add/2, notify/1, notify/2, send2client/1, send2client/2, pay/4]).

-record(party_coin,
	{account,
	 coin
	}).  

add(Account, N) when is_atom(Account), N == 0 ->
    F = fun() ->
		get_player_point(Account)
	end,
    db:transaction(F);
add(Account, N) when is_atom(Account), N > 0 ->
    F = fun() ->
		do_add(Account, N)
	end,
    db:transaction(F).

tran_add(Account, N) when is_atom(Account), N > 0 ->
    PlayerPoint = do_add(Account, N),
    Coin = PlayerPoint#party_coin.coin,
    F = fun() ->
		net_helper:send2client(Account, #notify_party_score_coin{coin=Coin})
	end,
    F.

pay(ReqGoodsList, ShipCallback, Type, PlayerData) ->
    Order = trade_context:make_order(ReqGoodsList, Type),
    Point = lists:foldl(
	      fun({_GoodsId, Number, Price}, TotalPrice)->
		      TotalPrice + (Number * Price)
	      end, 0, ReqGoodsList),
    Account = player_data:get_account(PlayerData),
    F = fun() ->
		PlayerPoint = get_player_point(Account),
		case can_pay(PlayerPoint, Point) of
		    true ->
			NOrder = Order#order{status=?order_payed},
			case ShipCallback(NOrder) of
			    ?pay_shipped ->
				NPoint = PlayerPoint#party_coin.coin - Point,
				NPlayerPoint = PlayerPoint#party_coin{coin = NPoint},
				db:write(NPlayerPoint),
				NPoint;
			    _ ->
				{false, ?player_point_pay_error}
			end;
		    Reason ->
			Reason
		end
	end,
    case db:transaction(F) of
	{false, Reason} ->
	    sys_msg:send(Account, Reason);
	NPoint ->
	    net_helper:send2client(Account, #notify_party_score_coin{coin=NPoint})
    end.

can_pay(PlayerPoint, Point) ->
    CurrPoint = PlayerPoint#party_coin.coin,
    case CurrPoint >= Point of
	true ->
	    true;
	false ->
	    {false, ?player_point_error}
    end.

do_add(Account, N) when is_atom(Account), N > 0 ->
    PlayerPoint = get_player_point(Account),
    NCoin = N + PlayerPoint#party_coin.coin,
    NPlayerPoint = PlayerPoint#party_coin{coin=NCoin},
    db:write(NPlayerPoint),
    NPlayerPoint.

notify(Account) when is_atom(Account) ->
    F = fun() ->
		get_player_point(Account)
	end,
    PlayerPoint = db:transaction(F),
    notify(Account, PlayerPoint).

notify(Account, #party_coin{coin=Coin}) ->
    net_helper:send2client(Account, #notify_init_party_coin{coin=Coin}).

send2client(Account) when is_atom(Account) ->
    F = fun() ->
		get_player_point(Account)
	end,
    PlayerPoint = db:transaction(F),
    Coin = PlayerPoint#party_coin.coin,
    net_helper:send2client(Account, #notify_party_score_coin{coin=Coin}).
send2client(Account, PlayerPoint) ->
    Coin = PlayerPoint#party_coin.coin,
    net_helper:send2client(Account, #notify_party_score_coin{coin=Coin}).

get_player_point(Account) ->
    case db:read(party_coin, Account) of
	[] ->
	    #party_coin{account=Account, coin=0};
	[PlayerPoint] ->
	    PlayerPoint
    end.


