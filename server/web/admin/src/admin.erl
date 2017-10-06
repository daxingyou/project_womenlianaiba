%% @author Mochi Media <dev@mochimedia.com>
%% @copyright 2010 Mochi Media <dev@mochimedia.com>

%% @doc admin.

-module(admin).
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
%% @doc Start the admin server.
start() ->
    admin_deps:ensure(),
    ensure_started(crypto),
    application:start(admin).


%% @spec stop() -> ok
%% @doc Stop the admin server.
stop() ->
    application:stop(admin).
