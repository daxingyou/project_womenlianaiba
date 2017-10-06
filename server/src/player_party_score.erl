%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2013, hongjx
%%% @doc
%%%   ÅÉ¶Ô»ý·Ö
%%% @end
%%% Created : 30 Jan 2013 by hongjx <hongjx@35info.cn>

-module(player_party_score).


-export([add/2]).

-record(party_score, {account, score=0}).


add(Account, N) when is_atom(Account) ->
    Old = read_score(Account),
    New = Old + N,
    write_score(Account, New).


read_score(Account) when is_atom(Account) ->
    case db:read(party_score, Account) of
	[#party_score{score=N}] ->
	    N;
	_ ->
	    0
    end.

write_score(Account, N) when is_atom(Account), is_integer(N) ->
    db:write(#party_score{account=Account, score=N}). 
