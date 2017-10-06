%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%   对house_data进行分片
%%% @end
%%% Created : 16 Aug 2012 by hongjx <hongjx@35info.cn>

-module(db_update_house20120816).

-export([run/2, all/1]).


run(Table, FragCount) ->
    TmpTable = list_to_atom(atom_to_list(Table) ++ "_temp"),
    case need_reconvert(Table, TmpTable) of
	true -> %% 没转过，或者临时表复制到一半
	    Fields = mnesia:table_info(Table, attributes),
	    Keys = all_keys(Table),
	    mnesia:create_table(TmpTable, 
				[{disc_only_copies, [node()]}, 
				 %%[{ram_copies, [node()]}, 
				 {attributes, Fields}, 
				 {record_name, Table}]),

	    move_to_temp_table(Table, TmpTable, Keys),

	    create_frag_and_move(Table, Fields, TmpTable, Keys, FragCount);
	_ -> 
	    Fields = mnesia:table_info(TmpTable, attributes),
	    Keys = all_keys(TmpTable),
	    create_frag_and_move(Table, Fields, TmpTable, Keys, FragCount)
    end,	    

    %% if not exists table create it, else move record
    {atomic, ok}.

need_reconvert(Table, TmpTable) ->
    TabList = mnesia:system_info(tables),
    case lists:member(TmpTable, TabList) of
	false -> %% 还没转过
	    true;
	_ ->
	    case lists:member(Table, TabList) of
		false -> %% 旧表已经删掉了
		    false;
		_ ->
		    table_size(Table) >= table_size(TmpTable)
	    end
    end.


move_to_temp_table(Table, TmpTable, Keys) ->
    lists:foreach(fun(K) -> move_record(K, Table, TmpTable) end, Keys),
    %%batch_move_record(Table, TmpTable, Keys),

    {atomic, ok} = mnesia:delete_table(Table).
    

create_frag_and_move(Table, Fields, TmpTable, Keys, FragCount) ->
    mnesia:create_table(Table, [{attributes, Fields}, {frag_properties, 
						       [{n_disc_only_copies, 1}, 
							%%{hash_module, eq_frag_hash}, 
							{n_fragments, FragCount}]}]),


    %%batch_move_record(TmpTable, Table, Keys),
    lists:foreach(fun(K) -> move_record(K, TmpTable, Table) end, Keys),

    {atomic, ok} = mnesia:delete_table(TmpTable).



%% batch_move_record_1(Table, NewTable, Keys) ->
%%     F = fun(K, Acc) ->
%% 		[R] = transaction(fun() -> mnesia:read(Table, K) end),
%% 		[R | Acc]
%% 	end,
%%     Records = lists:foldl(F, [], Keys),

%%     FWrite = fun(R) ->
%% 		transaction(fun() -> mnesia:write(NewTable, R, write) end)
%% 	     end,
%%     lists:foreach(FWrite, Records).

%% batch_move_record(Table, NewTable, Keys) when length(Keys) > 50000 ->
%%     io:format("batch move ~n"),
%%     {A, B} =  lists:split(50000, Keys),
%%     batch_move_record_1(Table, NewTable, A),
%%     batch_move_record(Table, NewTable, B);
%% batch_move_record(Table, NewTable, Keys) ->
%%     batch_move_record_1(Table, NewTable, Keys).


move_record(Key, OldTable, NewTable) ->
    F = fun() ->
		[R] = mnesia:read(OldTable, Key),
		mnesia:write(NewTable, R, write)
	end,
    transaction(F).


transaction(F)->
    mnesia:activity(sync_dirty, F, [], mnesia_frag).


all(Tab) ->
    Keys = all_keys(Tab),
    [transaction(fun() -> [R] = mnesia:read(Tab, K), R end)
     || K <- Keys].


all_keys(Tab) ->
    transaction(fun() -> mnesia:all_keys(Tab) end).
    
table_size(Tab) ->
    transaction(fun() -> mnesia:table_info(Tab, size) end).
