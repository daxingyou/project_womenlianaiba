%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% ÇÇÇ¨ÐÂ¾Ó
%%% @end
%%% Created : 10 Apr 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(task_10006).  

-export([listen_event/0, can_give/1, do_give/1, can_complete/1, do_complete/1]).

listen_event() ->
    [{listen_expect_flag, house_level_up, house_level_up_10006, 1, [5]},{listen_grow_flag, on_buy_house, on_buy_house_10006, 1},{listen_grow_flag, on_change_house, on_change_house_10006, 1}].

can_give(_) ->
    true.

do_give(_) ->
    [].

can_complete({_, Flags}) ->
	(task_flag:get_value_count(on_change_house_10006, Flags) >= 1).

do_complete(_Flags) ->
    [].
