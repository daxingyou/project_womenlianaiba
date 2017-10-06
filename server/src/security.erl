-module(security).
-export([start/0]).
-export([policy_file_server/0, policy_file_server_proc/1]).


start() ->
    spawn(?MODULE, policy_file_server, []).

%%------------------------------------------------------------------------------
%% Flash Policy File Server
%%------------------------------------------------------------------------------

policy_file_server () ->
    {ok, LSock} = gen_tcp:listen(843, [binary, {packet, 0}, {active, false}, {reuseaddr, true}]),

    policy_file_server_accept(LSock).

policy_file_server_accept (LSock) ->
    case gen_tcp:accept(LSock) of
        {ok, Sock} ->
            spawn(?MODULE, policy_file_server_proc, [Sock]),

            policy_file_server_accept(LSock);

        {error, Reason} ->
            data_helper:format("policy file server exit: ~s~n", [Reason]),
            exit(Reason)
    end.

policy_file_server_proc (Sock) ->
    case gen_tcp:recv(Sock, 0) of
        {ok, _} ->
            gen_tcp:send(Sock, <<
                "<?xml version=\"1.0\"?>"
                "<cross-domain-policy>",
                "<allow-access-from domain=\"*\" to-ports=\"*\" />",
                "</cross-domain-policy>",0
            >>);
        _ ->
            ok
    end,
    gen_tcp:close(Sock).
