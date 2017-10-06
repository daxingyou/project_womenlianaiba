%%% @author linzhj <linzhj@35info.cn>
%%% @copyright (C) 2010, linzhj
%%% @doc
%%%    签到系统
%%% @end
%%% Created : 2011-12-12 by linzhj <linzhj@35info.cn>

-module(http_server).

-export([send/2, redirect/2, get_querystring/1]).

send(Request, Body)->
    io:format("Send:~p~n",[Body]),
    Request:ok({'utf-8' ,[], Body}).

redirect(Request, URL)->
    Request:respond({302, 
		 [{"Location", URL}, 
		  {"Content-Type", "text/html; charset=UTF-8"}], 
		 ""}).
		 
get_querystring(undefined)->
    "";

get_querystring(RawPath) when is_list(RawPath)->
 {_, QueryString, _} = mochiweb_util:urlsplit_path(RawPath),
    QueryString;

get_querystring(Request)->
    RawPath = Request:get(raw_path),
    {_, QueryString, _} = mochiweb_util:urlsplit_path(RawPath),
    QueryString.

