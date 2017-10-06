%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% �μ�5�α�����֯���ɶ�
%%% @end
%%% Created : 10 Apr 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(task_1611). 

-export([listen_event/0, can_give/1, do_give/1, can_complete/1, do_complete/1]).

listen_event() ->
    [{listen_grow_flag, enter_house_from_party_event, create_party_flag_14, 5}].

can_give(_) ->
    true.

do_give(_) ->
    [].

can_complete({_, Flags}) ->
    task_flag:get_value_count(create_party_flag_14, Flags) == 5.

do_complete(_Flags) ->
    [].
