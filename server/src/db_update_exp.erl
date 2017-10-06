%%%-------------------------------------------------------------------
%%% @author linyijie <linyj@35info.cn>
%%% @copyright (C) 2013, linyijie
%%% @doc
%%%  转换(升级)玩家的经验
%%% @end
%%% Created : 11 Apr 2013 by linyijie <linyj@35info.cn>
%%%-------------------------------------------------------------------
-module(db_update_exp).

-include("tplt_def.hrl").
-export([start/0]).
-compile(export_all).

start() ->
    AllKeys = db:dirty_all_keys(house_data),
    AllTplt = tplt:get_all_data(exp_transition),
    change_exp(AllKeys, AllTplt).

change_exp([], _AllTplt) ->
    {atomic, ok};
change_exp([Key | Keys], AllTplt) ->
    Tab = house_data,
    case db:dirty_read(Tab, Key) of
	[]->
	    data_helper:format("Key:~p~n",[Key]);
	[House]->
	    Exp = house_data:get_exp(House),
	    NewExp = get_new_exp(Exp, AllTplt),
	    House1 = house_data:set_exp(House, NewExp),
	    db:dirty_write(House1),
	    data_helper:format("old exp:~p, new exp:~p~n", [Exp, NewExp]);
	_ ->
	    data_helper:format("Key:~p~n",[Key])
    end,
    change_exp(Keys, AllTplt).


get_new_exp(CurrExp, AllTplt) ->
    D = [calc_new_exp(CurrExp, OldMin, OldMax, NewMin, NewMax) || 
	    #exp_transition{old_min=OldMin, old_max=OldMax, new_min=NewMin, new_max=NewMax} <- AllTplt, 
				   CurrExp>=OldMin, CurrExp<OldMax],
    case D of
	[] -> throw({transition_exp_error, CurrExp});
	_ -> hd(D)
    end.

calc_new_exp(CurrExp, OldMin, OldMax, NewMin, NewMax) ->
    NewExp = NewMin + (NewMax - NewMin) * (CurrExp - OldMin) / (OldMax - OldMin),
    trunc(NewExp).
