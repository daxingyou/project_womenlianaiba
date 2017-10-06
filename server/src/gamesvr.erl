%%%-------------------------------------------------------------------
%%% @author linyijie <linyijie@china-channel.com>
%%% @copyright (C) 2010, linyijie
%%% @doc
%%%  ÓÎÏ··şÎñÆ÷
%%% @end
%%% Created : 17 Aug 2010 by linyijie <linyijie@china-channel.com>
%%%-------------------------------------------------------------------
-module(gamesvr).

-export([start/0, stop/0, stop/1]).


start()->
    io:format("start game server...~n"),
    Mongo = application:start(mongodb),
    io:format("Mongo:~p~n", [Mongo]),

    application:start(crypto),
    application:start(public_key),
    application:start(ssl),
    io:format("start ssl~n"),

    %% Tcp =  application:start(tcp_server),
    %% io:format("Tcp:~p~n", [Tcp]),
    Server=   application:start(server),
    io:format("Server:~p~n", [Server]),
    Server.

stop() ->
    stop(server).

stop(AppFile) ->
    application:stop(AppFile).


