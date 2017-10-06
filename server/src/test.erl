-module(test).

-export([start/0, start_it/1, t/0, t1/1]).


start() ->
    start_it("test:t()").

start_it(Str) ->
    {ok,Ts,_} = erl_scan:string(Str),
    Ts1 = case lists:reverse(Ts) of
               [{dot,_}|_] -> Ts;
               TsR -> lists:reverse([{dot,1} | TsR])
           end,
    {ok,Expr} = erl_parse:parse_exprs(Ts1),
    erl_eval:exprs(Expr, []).

t() ->
    io:format("t function~n"),
    1234.

t1(A) ->
    io:format("A:~p~n", [A]).
