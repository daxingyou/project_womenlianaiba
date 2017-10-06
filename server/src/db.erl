%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%   数据库访问层
%%% @end
%%% Created : 31 Jul 2012 by hongjx <hongjx@35info.cn>

-module(db).

-export([read/2, write/1, write/2,
	 dirty_read/2, dirty_write/1, 
	 match_object/1,
	 delete/1, 
	 dirty_delete/1,
	 dirty_delete/2,
	 foldl/3,
	 dirty_all_keys/1, all_keys/1,
	 table_info/2, table/1, table/2, 
	 clear_table/1, transaction/1, sync_dirty/1]).

-export([index_read/3]).

-export([change/1]).

write(Record) when is_tuple(Record) ->
    Tab = element(1, Record),
    case lists:member(Tab, get_cache_tables()) of
	true -> %% 写两张表
	    db_memdisc:write(Record);
	_ ->
	    mnesia:write(Record)
    end.

write(transaction, Records) when is_list(Records) ->
    F = fun() ->
		[write(Record)|| Record <- Records]
	end,
    transaction(F);

write(transaction, Record) ->
    F = fun() ->
		write(Record)
	end,
    transaction(F).

read(Tab, Key) when is_atom(Tab) ->
    case lists:member(Tab, get_cache_tables()) of
	true -> %% 写到缓存上
	    db_memdisc:read(Tab, Key);
	_ ->
	    mnesia:read(Tab, Key)
    end.

dirty_write(Record) when is_tuple(Record) ->
    sync_dirty(fun() -> write(Record) end).


dirty_read(Tab, Key) when is_atom(Tab) ->
    sync_dirty(fun() -> read(Tab, Key) end).


dirty_delete(Tab, Key) ->
    sync_dirty(fun() -> delete({Tab, Key}) end).
dirty_delete({Tab, Key}) ->
    sync_dirty(fun() -> delete({Tab, Key}) end).


delete({Tab, Key}) ->
    case lists:member(Tab, get_cache_tables()) of
	true ->
	    db_memdisc:delete({Tab, Key});
	_ ->
	    mnesia:delete({Tab, Key})
    end.

delete_object(Data)->
    delete({element(1, Data), element(2, Data)}).


table_info(Tab, InfoKey) ->
    transaction(fun() -> mnesia:table_info(Tab, InfoKey) end).

table(Tab) ->
    table(Tab, []).
table(Tab,Opts) ->
    mnesia:table(Tab, Opts).

clear_table(Tab) ->
    mnesia:clear_table(Tab).

%% 注意transaction 不是直接调用mnesia:transaction
transaction(F)->
    mnesia:activity(transaction, F, [], mnesia_frag).

sync_dirty(F)->
    mnesia:activity(sync_dirty, F, [], mnesia_frag).

dirty_all_keys(Tab) ->
    sync_dirty(fun() -> all_keys(Tab) end).


all_keys(Tab) ->
    mnesia:all_keys(Tab).

foldl(Function, Acc, Table) ->
    mnesia:foldl(Function, Acc, Table).



index_read(Tab, SecondaryKey, Pos)->
    mnesia:index_read(Tab, SecondaryKey, Pos).

%% 获取数据
match_object(Pattern)->
    F = fun() ->
		mnesia:match_object(Pattern)
        end,
    transaction(F).



change(OpList) ->
    F = fun() -> 
		[case Op of
		    {write, List1} ->
			[ok = write(Data) || Data <- List1];
		    {delete_object, List1} ->
			[ok = delete_object(Data) || Data <- List1];
		    {delete, List2} ->
			[ok = delete({TableName, Key}) || {TableName, Key} <- List2]
		 end || Op <- OpList],
		ok	   
	end,
    ok = transaction(F).

%% 获得需要缓存的表
get_cache_tables() ->
    [house_data, player_basic_data, farm, player_task, daily_post_reward].


