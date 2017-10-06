%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% Å©³¡Ö÷
%%% @end
%%% Created : 10 Apr 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(task_10010).   

-export([listen_event/0, can_give/1, do_give/1, can_complete/1, do_complete/1]).

listen_event() ->
    [{listen_expect_flag, buy_furniture_event, buy_furniture_event_10010_1, 1, [0210000]},
    {listen_grow_flag, on_buy_goods_from_sysshop, on_buy_goods_from_sysshop_10010_2, 1},
    {listen_grow_flag, on_plant_crop_success, on_plant_crop_success_10010, 1}].

can_give(_) ->
    true.

do_give(_) ->
    [{add_item, {0220000, 3}}].

can_complete({_, Flags}) -> 
	(task_flag:get_value_count(on_plant_crop_success_10010, Flags) >= 1).

do_complete(_Flags) ->
    [].
