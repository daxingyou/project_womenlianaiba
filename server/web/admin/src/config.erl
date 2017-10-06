-module(config).

-export([get_database_server/0, get_website_port/0]).

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
