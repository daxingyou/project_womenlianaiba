%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% �ϳɣ��У�
%%% @end
%%% Created : 10 Apr 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(task_10008).  

-export([listen_event/0, can_give/1, do_give/1, can_complete/1, do_complete/1]).

listen_event() ->
    [{listen_expect_flag, on_produce_context_success, on_produce_context_success_10008, 1, [1500002]}].

can_give(_) ->
    true.

do_give(_) ->
    [{add_item, {9900042, 1}}].

can_complete({_, Flags}) ->
    (task_flag:get_value_count(on_produce_context_success_10008, Flags) == 1).

do_complete(_Flags) ->
    [].

