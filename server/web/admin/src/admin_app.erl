%% @author Mochi Media <dev@mochimedia.com>
%% @copyright admin Mochi Media <dev@mochimedia.com>

%% @doc Callbacks for the admin application.

-module(admin_app).
-author("Mochi Media <dev@mochimedia.com>").

-behaviour(application).
-export([start/2,stop/1]).


%% @spec start(_Type, _StartArgs) -> ServerRet
%% @doc application start callback for admin.
start(_Type, _StartArgs) ->
    admin_deps:ensure(),
    admin_sup:start_link().

%% @spec stop(_State) -> ServerRet
%% @doc application stop callback for admin.
stop(_State) ->
    ok.
