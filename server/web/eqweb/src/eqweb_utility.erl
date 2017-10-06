%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%% ¹¦ÄÜÀà
%%% @end
%%% Created :  2 Mar 2012 by LinZhengJian <linzhj@35info.cn>

-module(eqweb_utility).

-export([compress/2, datetime_to_string/1, now_to_string/0]).

now_to_string()->
    datetime_to_string(erlang:localtime()).

datetime_to_string({{Year, Month, Day}, {Hour, Minutes, Second}})->
 lists:concat([Year, Month, Day, Hour, Minutes, Second]).

-spec(compress(string(), list())-> {ok, string()}|{error, term()}).
compress(ArchiveName, FileList)->
   zip(ArchiveName, FileList).

cmd(ArchiveName, FileList)->
    Files = string:join(FileList, ""),
    Command = "tar -cvf " ++ ArchiveName ++ " " ++ Files,
    %% io:format("Command:~p~n",[Command]),
    Result = os:cmd(Command),
    %% io:format("Result:~p~n",[Result]),
    case Result of 
	"" ->
	    {error, "Compress Fail"};
	_Message ->
	    {ok, ArchiveName}
    end.

zip(ArchiveName, FileList)->
    case zip:create(ArchiveName, FileList) of
	{ok ,FileName}->
	    {ok ,FileName};
	{ok, FileName, _Binary} ->
	    {ok ,FileName};
	{error, Reason}->
	    {error, Reason}
    end.
