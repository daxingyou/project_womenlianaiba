%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%%
%%% @end
%%% Created : 10 Apr 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(task_1064).

-export([listen_event/0, can_give/1, do_give/1, can_complete/1, do_complete/1]).

listen_event() ->
    [{listen_grow_flag, create_pair_checkin_event, create_checkin_flag_64, 1}].

can_give(_) ->
    true.

do_give(_) ->
    [].

can_complete({_Account, Flags}) ->
    task_flag:get_value_count(create_checkin_flag_64, Flags) == 1.

do_complete(_) ->
    [].
