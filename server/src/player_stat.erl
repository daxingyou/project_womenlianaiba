%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% 统计玩家数据
%%% @end
%%% Created : 30 Mar 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(player_stat).

-include("player_stat.hrl").

-export([init/1, add_gift/1]).

%%%===================================================================
%%% API
%%%===================================================================
init(Account) ->
    #player_stat{account=Account, gift=0}.

%% 增加收礼数量
add_gift(Account) when is_atom(Account) ->
    [PlayerStat] = db:dirty_read(player_stat, Account),
    add_gift(PlayerStat);
add_gift(PlayerStat) when is_record(PlayerStat, player_stat) ->
    add_gift(PlayerStat, 1).


%%%===================================================================
%%% Internal functions
%%%===================================================================
add_gift(PlayerStat, Count) ->
    Gift = PlayerStat#player_stat.gift,
    PlayerStat#player_stat{gift=Gift+Count}.
