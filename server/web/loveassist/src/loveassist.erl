%% @author Mochi Media <dev@mochimedia.com>
%% @copyright 2010 Mochi Media <dev@mochimedia.com>

%% @doc loveassist.

-module(loveassist).
-author("Mochi Media <dev@mochimedia.com>").
-export([start/0, stop/0]).

ensure_started(App) ->
    case application:start(App) of
        ok ->
            ok;
        {error, {already_started, App}} ->
            ok
    end.


%% @spec start() -> ok
%% @doc Start the loveassist server.
start() ->
    loveassist_deps:ensure(),
    ensure_started(crypto),
    application:start(loveassist).


%% @spec stop() -> ok
%% @doc Stop the loveassist server.
stop() ->
    application:stop(loveassist).
