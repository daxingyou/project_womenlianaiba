%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%%
%%% @end
%%% Created :  6 Jul 2012 by LinZhengJian <linzhj@35info.cn>

-module(player_gm_log).

-export([add/3, show_command_history/0, show_command_history/1]).

-spec add(atom(), atom(), list(string()))->term().
add(Account, Command, Parameter)->
    mongodb_services:insert(mongodb_services:get_connection(), gm_log, {account, Account, command, Command, parameter, Parameter}).

show_command_history()->
    Commands = mongodb_services:select(mongodb_services:get_connection(), gm_log, {}),
    io:format("DateTime\t\tAccount\t\t\t\t\tCommand\t\tArguments~n"),
    [print_command(Command) || Command <- Commands].
show_command_history(Account)->
    Commands = mongodb_services:select(mongodb_services:get_connection(), gm_log, {account, Account}),
    io:format("DateTime\t\tAccount\t\t\t\t\tCommand\t\tArguments~n"),
    [print_command(Command) || Command <- Commands].

print_command(Command)->
    io:format("~p\t~p\t~p\t~p~n", [
				   datetime:now_to_datetime(bson:objectid_time(bson:at('_id', Command))), 
				   bson:at(account, Command), 
				   bson:at(command, Command), 
				   bson:at(parameter, Command)
				  ]).
    

