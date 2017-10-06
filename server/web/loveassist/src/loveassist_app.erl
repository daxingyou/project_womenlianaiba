%% @author Mochi Media <dev@mochimedia.com>
%% @copyright loveassist Mochi Media <dev@mochimedia.com>

%% @doc Callbacks for the loveassist application.

-module(loveassist_app).
-author("Mochi Media <dev@mochimedia.com>").

-behaviour(application).
-export([start/2,stop/1]).


%% @spec start(_Type, _StartArgs) -> ServerRet
%% @doc application start callback for loveassist.
start(_Type, _StartArgs) ->
    loveassist_deps:ensure(),
    loveassist_sup:start_link().

%% @spec stop(_State) -> ServerRet
%% @doc application stop callback for loveassist.
stop(_State) ->
    ok.
