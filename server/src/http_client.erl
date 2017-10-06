%%% @author linzhj <linzhj@35info.cn>
%%% @copyright (C) 2010, linzhj
%%% @doc
%%%    签到系统
%%% @end
%%% Created : 2011-12-09 by linzhj <linzhj@35info.cn>


-module(http_client).

-export([get/1, get/2, post/2, post/4]).

-export([asyn_get/2, asyn_get/3, asyn_post/3, asyn_post/5]).

asyn_get(Url, Callback)->
    asyn_get(Url, [], Callback).

asyn_get(Url, Headers, Callback)->
    data_helper:format("Get Url:~p~n",[Url]),
    Receiver = 
	fun(Response)-> 
		Body = get_body(Response), 
		Callback(Body) 
	end,
    httpc:request(get, {Url, Headers}, [], [{sync, false}, {receiver, Receiver}]),
    ok.

get(Url)->
    get(Url, []).

get(Url, Headers)->
    get(Url, Headers, 3).

get(Url, Headers, Retry)->
    data_helper:format("Get Url:~p~n",[Url]),
    Response = httpc:request(get, {Url, Headers}, [], []),
    Body = get_body(Response),
    case Body of
	""->
	    case Retry of
		0->
		    Body;
		_ ->
		    get(Url, Headers, Retry-1)
	    end;
	_ ->
	    Body
    end.

post(Url, Body)->
    post(Url, [], "application/x-www-form-urlencoded", Body).
		
post(Url, Headers, ContentType, Body)->
    data_helper:format("Post Url:~p~nBody:~p~n",[Url, Body]),
    Response = httpc:request(post, {Url, Headers, ContentType, Body},[],[]), 
    get_body(Response).

asyn_post(Url, Body, Callback)->
    asyn_post(Url, [], "application/x-www-form-urlencoded", Body, Callback).

asyn_post(Url, Headers, ContentType, Body, Callback)->
    data_helper:format("Post Url:~p~nBody:~p~n",[Url, Body]),
    Receiver = 
	fun(Response)-> 
		ReturnBody = get_body(Response), 
		Callback(ReturnBody) 
	end,
    httpc:request(post, {Url, Headers, ContentType, Body},[],[{sync, false}, {receiver, Receiver}]).

get_body(Response)->
    data_helper:format("Response:~p~n",[Response]),
    Return = case Response of 
		 {ok, saved_to_file} -> "";
		 {_RId, saved_to_file} -> "";
		 {error, _Reason} -> "";
		 {ok, Result}-> 
		     get_body1(Result);
		 {_RId, Result}->
		     get_body1(Result);
		 _-> ""
	     end,
    data_helper:format("Body:~p~n", [Return]),
    Return.

get_body1(Result)->
    case Result of
	{_, _, Body} -> 
	    case is_list(Body) of
		true->  Body;
		_->binary_to_list(Body)
	    end;
	{error, Reason}->
	    data_helper:format("error:~p~n", [Reason]);
	{_StatusCode, _Body} -> "";
	_ -> ""
    end.
