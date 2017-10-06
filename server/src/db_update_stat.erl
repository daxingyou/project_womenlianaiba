%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% 初始化统计数据
%%% @end
%%% Created : 30 Mar 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(db_update_stat).

-include("player_stat.hrl").

%% API
-export([start/0]).


%%%===================================================================
%%% API
%%%===================================================================
start() ->
    F = fun() ->
		Keys = mnesia:dirty_all_keys(player_basic_data),
		[update_stat(Key) || Key <- Keys]
	end,
    mnesia:activity(transaction, F, [], mnesia_frag),
    {atomic, ok}.


%%%===================================================================
%%% Internal functions
%%%===================================================================
update_stat(Key) ->
    Stat = #player_stat{account=Key, gift=0},
    mnesia:write(Stat).
