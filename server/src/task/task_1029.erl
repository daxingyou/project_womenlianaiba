%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% �ݷ�30�����ѡ�
%%% @end
%%% Created : 10 Apr 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(task_1029). 

-export([listen_event/0, can_give/1, do_give/1, can_complete/1, do_complete/1]).

listen_event() ->
    [{listen_not_repeat_flag, enter_house_from_friend_list_event, create_friend_flag_29, 30}].

can_give(_) ->
    true.

do_give(_) ->
    [].

can_complete({_, Flags}) ->
    task_flag:get_value_count(create_friend_flag_29, Flags) == 30.

do_complete(_Flags) ->
    [].
