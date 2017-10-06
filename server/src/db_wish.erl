%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%% 许愿单 数据库相关操作
%%% @end
%%% Created : 19 Mar 2012 by LinZhengJian <linzhj@35info.cn>

-module(db_wish).

-include("records.hrl").

-export([get_wish_list/1]).

get_wish_list(Account)->
    F = fun() -> db:index_read(player_wish, Account, #player_wish.account) end,
    db:transaction(F).    

			      
