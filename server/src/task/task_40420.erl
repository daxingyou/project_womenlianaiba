%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% ����ʳ��
%%% @end
%%% Created : 10 Apr 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(task_40420). 

-export([listen_event/0, can_give/1, do_give/1, can_complete/1, do_complete/1]).

listen_event() ->
    [{listen_grow_flag, upgrade_food, upgrade_food_40420, 1}].

can_give(_) ->
    true.

do_give(_) ->
    [].

can_complete({_, Flags}) ->
    task_flag:get_value_count(upgrade_food_40420, Flags) >= 1.

do_complete(_Flags) ->
    [].
