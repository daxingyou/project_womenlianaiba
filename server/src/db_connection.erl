%%% @author hongjx <hongjx@china-channel.com>
%%% @copyright (C) 2010, hongjx
%%% @doc
%%%    数据库连接
%%% @end
%%% Created : 17 Aug 2010 by hongjx <hongjx@china-channel.com>

-module(db_connection).

-export([open/1, close/0, start_link/0, init/1]).

start_link() ->
    gen_server:start_link({local, ?MODULE}, ?MODULE, [], []).

init([]) ->
    db_connection:open([get_master_db()]),
    %% 数据库启动后，就停止
    {ok, undefined_state}.


%% 连接 数据库节点
open([DBAddress]) when is_list(DBAddress) ->
    data_helper:format("DBAddress ~p~n", [DBAddress]),
    DBServer = case DBAddress =:= "localhost" of
		   true -> node();
		   false -> list_to_atom(DBAddress)
	       end,
    ok = connect_db(DBServer);

open([DBAddress]) when is_atom(DBAddress) ->
    data_helper:format("DBAddress ~p~n", [DBAddress]),
    DBServer = case DBAddress of
		   localhost -> node();
		   _ -> DBAddress
	       end,
    ok = connect_db(DBServer).


%% 断开连接
close() ->
    mnesia:stop().


%% 连接 数据库节点
connect_db(DBNode) when is_atom(DBNode) ->
    ok = rpc:call(DBNode, global_database, start, [get_backup_db()]),

    case DBNode =:= node() of
	false ->
	    ok = mnesia:start(),
	    %% 判断是否有盘节点, 
	    DiscNodes = mnesia:table_info(schema, disc_copies),
	    case lists:member(node(), DiscNodes) of
		true -> %% 有盘节点之间不要乱连，万一是不同集群的数据库, 就会冲突
		    logger:log(error, "has exists schema on disk, can not connect:~p~n", [DBNode]),
		    ok; 
		_ ->
		    {ok, [DBNode]} = mnesia:change_config(extra_db_nodes, [DBNode])
	    end;
	true ->
	    ok
    end,
    ok.

get_master_db() ->
    case application:get_env(master_db) of
	{ok, Val} -> Val;
	_ ->	    
	    localhost
    end.
    
get_backup_db() ->
    case application:get_env(backup_db) of
	{ok, Val} -> Val;
	_ ->	    
	    undefined
    end.


