%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% µÈ´ýµÄ°®
%%% @end
%%% Created : 10 Apr 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(task_20031).  

-export([listen_event/0, can_give/1, do_give/1, can_complete/1, do_complete/1]).

listen_event() ->
    [{listen_grow_flag, create_single_checkin_event, create_single_checkin_event_20031, 1}, 
     {listen_grow_flag, create_pair_checkin_event, create_pair_checkin_event_20031, 1}].

can_give({_Account, _Flags}) ->
    true.

do_give({_Account, _Flags}) ->
    [].

can_complete({_Account, Flags}) ->
    (task_flag:get_value_count(create_single_checkin_event_20031, Flags) >= 1) or (task_flag:get_value_count(create_pair_checkin_event_20031, Flags) >= 1).

do_complete({_Account, _Flags}) ->
    [].
