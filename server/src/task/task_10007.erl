%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% 为合成做准备
%%% @end
%%% Created : 10 Apr 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(task_10007).  

-export([listen_event/0, can_give/1, do_give/1, can_complete/1, do_complete/1]).

listen_event() ->
    [{listen_grow_flag, on_hire_friend, on_hire_friend_10007, 1},{listen_grow_flag, on_search_finish, on_search_finish_10007, 1}].

can_give(_) ->
    true.

do_give(_) ->
    [{add_item, {2200033, 12}}].

can_complete({_, Flags}) ->
   (task_flag:get_value_count(on_hire_friend_10007, Flags) >= 1)
	and 
	(task_flag:get_value_count(on_search_finish_10007, Flags) >= 1).

do_complete(_Flags) ->
    [].

