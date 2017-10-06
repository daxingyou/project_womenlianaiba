-module(config).

-export([get_database_server/0, get_website_port/0, get_game_page/1]).
-export([get_app_id/0, get_app_key/0, get_app_name/0, get_error_page/0]).
-export([get_open_api_host/0]).
-export([get_password/0, get_filepath/0]).
-export([get_recipient/0, get_smtp/0]).
-export([get_server_list/0]).	     
-define(app_name, eqweb).

%%获取数据库服务器的地址  
get_database_server()->
    case application:get_env(?app_name, databasesvr) of
	 {ok, Val} ->
	    list_to_atom(Val);
	 _ ->
	     undefined
     end.

get_website_port()->
    case application:get_env(?app_name, port) of
	{ok, Val} -> 
	    if 
		is_integer(Val)->
		    Val;
		is_list(Val)->
		    list_to_integer(Val);
		true->
		    8080
	    end;
	_ ->
	    8080
    end.

get_game_page(PF)->
    case application:get_env(?app_name, gamepage) of
	 {ok, Val} ->
	    proplists:get_value(PF, Val);
	 _ ->
	     "WebPlayer.html"
     end.

get_error_page()->
    case application:get_env(?app_name, errorpage) of
	 {ok, Val} ->
	   Val;
	 _ ->
	     "error.html"
     end.


get_app_id() ->
    case application:get_env(?app_name, app_id) of
	 {ok, Val} ->
	   Val;
	 _ ->
	     ""
     end.

get_app_key() ->
    case application:get_env(?app_name, app_key) of
	 {ok, Val} ->
	   Val;
	 _ ->
	     ""
     end.

get_app_name() ->
    case application:get_env(?app_name, app_name) of
	 {ok, Val} ->
	   Val;
	 _ ->
	     ""
     end.

get_open_api_host()->
    case application:get_env(?app_name, open_api_host) of
	 {ok, Val} ->
	   Val;
	 _ ->
	     "http://113.108.20.23"
     end.


get_password()->
    case application:get_env(?app_name, password) of
	{ok, Val} ->
	    Val;
	_ ->
	     ""
    end.

get_filepath()->
    case application:get_env(?app_name, filepath) of
	{ok, Val} ->
	    Val;
	_ ->
	     ""
    end.


get_recipient()->
    case application:get_env(?app_name, recipient) of
	{ok, Val} ->
	    Val;
	_ ->
	     []
    end.

get_smtp()->
    case application:get_env(?app_name, smtp) of
	{ok, Val} ->
	    Val;
	_ ->
	     []
    end.

get_server_list()->
    case rpc:call(get_database_server(), application, get_env, [server, server_id]) of
	{ok ,Val} ->
	    Val;
	_ ->
	    []
    end.
