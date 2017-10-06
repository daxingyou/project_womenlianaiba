%%% @author linzhj <linzhj@35info.cn>
%%% @copyright (C) 2010, linzhj
%%% @doc
%%%    签到系统
%%% @end
%%% Created : 2011-12-09 by linzhj <linzhj@35info.cn>


-module(http_client).

-export([get/1, get/2, post/4]).

get(Url)->
    get(Url, []).

get(Url, Headers)->
    io:format("Get Url:~p~n",[Url]),
    Response = httpc:request(get, {Url, Headers}, [], []),
    get_body(Response).

post(Url, Headers, ContentType, Body)->
    io:format("Post Url:~p~n",[Url]),
    Response = httpc:request(post, {Url, Headers, ContentType, Body},[],[]), 
    get_body(Response).

get_body(Response)->
    io:format("Response:~p~n",[Response]),
    Return = case Response of 
	       {ok, saved_to_file} -> "";
	       {error, _Reason} -> "";
	       {ok, Result}-> 
		   case Result of
		       {_, _, Body} -> 
			   case is_list(Body) of
			       true->  Body;
			       _->binary_to_list(Body)
			   end;
		       {_StatusCode, _Body} -> "";
 		       _ -> ""
		   end;
	       _-> ""
	   end,
    io:format("Body:~p~n", [Return]),
    Return.

