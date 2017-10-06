%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% ��ֲֲ��
%%% @end
%%% Created : 10 Apr 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(task_1227).

-export([listen_event/0, can_give/1, do_give/1, can_complete/1, do_complete/1]).

listen_event() ->
    [{listen_grow_flag, on_plant_crop_success, create_on_plant_crop_success_flag_45, 1}].

can_give(_) ->
    true.

do_give(_) ->
    [].

can_complete({_, Flags}) ->
    task_flag:get_value_count(create_on_plant_crop_success_flag_45, Flags) == 1.

do_complete(_Flags) ->
    [].
