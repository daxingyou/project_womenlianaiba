%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%%
%%% @end
%%% Created : 11 Dec 2012 by LinZhengJian <linzhj@35info.cn>

-module(db_player_flower_shake).

-include("records.hrl").

-export([get/2, get_love_coin_shake/2, add/4, add_love_coin_shake/3]).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% shake = {count, last_date} 
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
get(Account, {Date, _})->
    Data = db:dirty_read(player_flower_shake, Account),
    data_helper:format("shake data:~p, Date:~p~n", [Data, Date]),
    case Data of
	[]->
	    {0, 0, undefined};
	[#player_flower_shake{shake_list={Count, {Date, Time}}, love_coin_shake_count=LoveCoinShakeCount}] ->
	    {Count, LoveCoinShakeCount, {Date, Time}};
	[#player_flower_shake{shake_list={_Count, {_Date, _Time}}, love_coin_shake_count=_LoveCoinShakeCount}] ->
	    {0, 0, undefined};
	[#player_flower_shake{love_coin_shake_count=LoveCoinShakeCount}] ->
	    {0, LoveCoinShakeCount, undefined};
	[_Shake] -> 
	    {0, 0, undefined}
    end.

get_love_coin_shake(Account, {Date, _})->
    Data = db:dirty_read(player_flower_love_coin_shake, Account),
    case Data of
	[]->
	    {0, undefined};
	[#player_flower_love_coin_shake{time={Date, Time}, count=Count}] ->
	    {Count, {Date, Time}};
	[_Shake] -> 
	    {0, undefined}
    end.

add(Account, ShakeCount, LoveCoinShakeCount,{Date, _} =ShakeTime)->
    NewPlayerFlowerShake = 
	case db:dirty_read(player_flower_shake, Account) of
	    []->
		#player_flower_shake{account=Account, shake_list={ShakeCount, ShakeTime}, 
				     love_coin_shake_count=LoveCoinShakeCount};
	    [#player_flower_shake{shake_list={Count, {Date, _}}, love_coin_shake_count=LoveCoinShakedCount}]->
		#player_flower_shake{account=Account, shake_list={ShakeCount + Count, ShakeTime},
				     love_coin_shake_count=LoveCoinShakedCount+LoveCoinShakeCount};	    
	    [_Shake] ->
		#player_flower_shake{account=Account, shake_list={ShakeCount, ShakeTime},
				     love_coin_shake_count=LoveCoinShakeCount}
	end,
    db:dirty_write(NewPlayerFlowerShake).

add_love_coin_shake(Account, Count, {Date, _} =ShakeTime)->
    NewPlayerFlowerShake = 
	case db:dirty_read(player_flower_love_coin_shake, Account) of
	    []->
		#player_flower_love_coin_shake{account=Account, count=Count, time=ShakeTime};
	    [#player_flower_love_coin_shake{time={Date, _}, count=LoveCoinShakedCount}] ->
		#player_flower_love_coin_shake{account=Account, count=LoveCoinShakedCount+Count, time=ShakeTime};
	    [_Shake] ->
		#player_flower_love_coin_shake{account=Account, count=Count, time=ShakeTime}
	end,
    db:dirty_write(NewPlayerFlowerShake).
		    
