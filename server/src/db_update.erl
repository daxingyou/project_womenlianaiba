%%%-------------------------------------------------------------------
%%% File    : db_update.erl
%%% Author  :  <>
%%% Description : �Զ��������ݿ�ṹ�������ݣ���ģ��ᴴ��һ�����ݿ���±�
%%% �ñ����ڴ洢��ִ�й������ݽṹ�������ݵĸĶ��ļ�¼�������պ�Ĳ��ң�ͬʱ
%%% �ñ�Ҳ��Ϊ��Щ����Ѿ���ִ�й�����Щδ��ִ�е�һ���ж�����
%%%
%%% Created : 28 Oct 2009 by  <>
%%%-------------------------------------------------------------------
-module(db_update).

-export([start/1]).

-export([test/0, get_all_keys/1, call_add_table_fields/2]).

-include_lib("stdlib/include/qlc.hrl").


-record(db_update_history, {
	  id,      %% ˳���(������	  
	  comment, %% �ö�����ע��
	  time,    %% �ö���ִ�е�ʱ��
	  detail   %% ��ϸ����(���ڳ�������ʱ�ȶ�)
	 }).

start(Nodes) when is_list(Nodes) ->
    init("db_update.cfg", Nodes).
    

init(File, Nodes) ->
    init_update_history(Nodes),
    case file:consult(File) of
	{ok, Terms} ->
	    do_waitfor_tables([db_update_history]), %% �Ȳ���db_update_history�������Ͳ�����	    
	    Size = get_table_info(db_update_history, size),
	    {_Head, Rest} = lists:split(Size, Terms),
	    waitfor_tables(),
	    change(Rest, Size + 1, []);
	{error, Reason} ->
	    logger:log(error, "Can't load config file ~p~n ~p. Ignoring.~n", 
		       [File, Reason]),
	    fail
    end.
    
%% ��ʼ�����ݿ���¼�¼�ı�
init_update_history(Nodes)->
    case mnesia:create_table(db_update_history, 
			[{attributes, record_info(fields, db_update_history)},
			 {disc_only_copies, Nodes}]) of
	{atomic, ok} ->
	    ok;
	{aborted, {already_exists, _Tab}}->
	    ok;
	{aborted, Reason} ->
	    logger:log(error, "create table 'db_update_history' aborted, Reason:~p~n", 
		      [Reason])
    end.   

%% ������
%% Ĭ��disc_only_copies, node(), �����Ƭ��
call_create_table(Table, Fields) when is_list(Fields), length(Fields) > 1 ->   
    Ret = mnesia:create_table(Table, [{disc_only_copies, [node()]}, 
				      {attributes, Fields}
			       ]),
    mnesia:change_table_frag(Table, {activate, [{hash_module, eq_frag_hash}
						      %%, {n_disc_only_copies, 1}
						     ]}),
    Ret.

%% �����Ƭ��
call_active_table_frag(TableList) when is_list(TableList) ->
    [mnesia:change_table_frag(T, {activate, []}) || 
	T <- TableList, get_table_info(T, frag_properties) =/= []],
    {atomic, ok}.


%% ������
%% Options����ָ���߼�ѡ��
call_create_table(Table, Fields, Options) 
  when is_list(Fields), is_list(Options), length(Fields) > 1 -> 
    AllOpts = case lists:keyfind(disc_type, 1, Options) of
		 {disc_type, DiscType} ->
		      NOpt = lists:keydelete(disc_type, 1, Options),
		      [{DiscType, [node()]} | NOpt];
		 _ ->
		      Options
	     end,

    do_create_table(Table, [{attributes, Fields} | AllOpts]),
    mnesia:change_table_frag(Table, {activate, [{hash_module, eq_frag_hash}
								   %%, {n_disc_only_copies, 1}
								  ]}),
    {atomic, ok}.


do_create_table(Table, Options) ->
    case lists:keyfind(mem_disc, 1, Options) of
	{mem_disc, []} ->
	    NOpt = lists:keydelete(mem_disc, 1, Options),
	    db_memdisc:create_table(Table, [node()], NOpt);
	{mem_disc, Nodes} ->
	    NOpt = lists:keydelete(mem_disc, 1, Options),
	    db_memdisc:create_table(Table, Nodes, NOpt);
	false ->
	    mnesia:create_table(Table, Options)
    end.


%% ɾ����
call_delete_table(Table) ->
    delete_table(Table),
    {atomic, ok}.
	
%% �������ֶ�(���ظ�ִ��)
call_add_table_index(Table, Field) when is_atom(Field) ->
    TabList = get_frag_tables(Table),
    
    [case mnesia:add_table_index(T, Field) of
	 {atomic, ok} -> ok;
	 {_, {already_exists, _, _}} -> ok
     end || T <- TabList],

    {atomic, ok}.

%% ȥ�������ֶ�(���ظ�ִ��)
call_del_table_index(Table, Field) when is_atom(Field) ->
    TabList = get_frag_tables(Table),

    [case mnesia:del_table_index(T, Field) of
	 {atomic, ok} -> ok;
	 {_, {no_exists, _, _}} -> ok
     end || T <- TabList],

    {atomic, ok}.


%% �ı��������̬
call_change_table_copy_type(Table, mem_disc) -> %% ���⴦��mem_disc  
    Fields = get_table_info(Table, attributes),
    Opt = [{attributes, Fields}],
    db_memdisc:create_mem_table(Table, [node()], Opt),
    mnesia:change_table_copy_type(Table, node(), disc_only_copies),
    {atomic, ok};
call_change_table_copy_type(Table, NewType) ->
    mnesia:change_table_copy_type(Table, node(), NewType),
    {atomic, ok}.

%% �ı��Ƭhash�㷨
call_change_frag_hash(NewHashMod, Changes) -> 
    Tables = get_tables(lists:reverse(Changes)),
    %% ����Ƿ�ֻ��һ����Ƭ
    one_frag_check(Tables),
    
    %% ����ȡ����Ƭ����
    [mnesia:change_table_frag(T, deactivate) || T <- Tables],
    %% �������÷�Ƭ����x
    [{atomic, ok}=mnesia:change_table_frag(T, {activate, [{hash_module, NewHashMod}]}) 
     || T <- Tables],    
    {atomic, ok}.
    
    


%% �����ֶ�(���ظ�ִ��)
call_add_table_fields(Table, KeyVals) when is_list(KeyVals) -> 
    TabList = get_frag_tables(Table),
    [{atomic, ok} = call_add_table_fields_1(T, KeyVals) || T <- TabList],
    {atomic, ok}.

call_add_table_fields_1(Table, KeyVals) when is_list(KeyVals) -> 
    Fields = [F || {F, _V} <- KeyVals],
    Vals = [V || {_F, V} <- KeyVals],	    
    
    OldFields = get_table_info(Table, attributes),

    NewFields = 
	case OldFields -- Fields of
	    OldFields -> %% ûת������ṹ
		lists:append(OldFields, Fields);
	    _ -> %% �Ѿ�ת����ṹ��
		OldFields
	end,
    
    F = fun(R) ->		
		case size(R) =:= length(NewFields) + 1 of
		    true -> %% ������¼ת����
			R;
		    _ ->
			case size(R) + length(Vals) =:= length(NewFields) + 1 of
			    true -> %% �ɼ�¼
				A = tuple_to_list(R), 
				B = Vals, 
				C = lists:append(A, B), 
				list_to_tuple(C);
			    _ ->
				erlang:error({bad_record, R})  
			end
		end
	end,
    
    do_transform_table(Table, F, NewFields).

%% mnesia:all_keys() ȡ�õ�keys��ʱ��ȫ
get_all_keys(Tab) ->
    case mnesia:dirty_first(Tab) of
	'$end_of_table' ->
	    [];
	First ->
	    do_get_all_keys(Tab, First, [First])
    end.

do_get_all_keys(Tab, PrevKey, Acc) ->
    case mnesia:dirty_next(Tab, PrevKey) of
	'$end_of_table' ->
	    Acc;
	K ->
	    do_get_all_keys(Tab, K, [K | Acc])
    end.

%%do_transform_table(Table, FConvert, NewFields) ->    
%%    mnesia:transform_table(Table, FConvert, NewFields).
do_transform_table(Table, FConvert, NewFields) ->    
    Keys = get_all_keys(Table),
    {atomic, ok} = mnesia:transform_table(Table, ignore, NewFields),    
    F = fun(Key) ->
		convert_record_2(Table, Key, FConvert)		
	end,
    lists:foreach(F, Keys),
    {atomic, ok}.

convert_record_2(Table, Key, FConvert) ->
    [R] = mnesia:dirty_read(Table, Key),
    NewR = FConvert(R),
    ok = mnesia:dirty_write(NewR).


%% ȡ������������Ϊ��Ƭ�������� ���ܻ������
%% %% ��������
%% call_rename_table(OldTable, NewTable) ->

%%     Fields = mnesia:table_info(OldTable, attributes),
%%     mnesia:create_table(NewTable, [{disc_only_copies, [node()]}, {attributes, Fields}]),
%%     Records = select_table(OldTable),
%%     F = fun() ->
%% 	lists:foreach(fun(R) -> 
%% 			      mnesia:write(setelement(1, R, NewTable))		
%% 		      end,
%% 		      Records)
%% 	end,
%%     {atomic, _OpResult} = mnesia:transaction(F),
    
%%     mnesia:delete_table(OldTable).

%% ɾ���ֶ�(���ظ�ִ��)
call_remove_table_field(Table, Field) when is_atom(Field) ->
    call_remove_table_fields(Table, [Field]).


%% ɾ��������ֶ�(���ظ�ִ��)
call_remove_table_fields(Table, Fields) when is_list(Fields) -> 
    TabList = get_frag_tables(Table),
    [{atomic, ok} = call_remove_table_fields_1(T, Fields) || T <- TabList],
    {atomic, ok}.

call_remove_table_fields_1(Table, Fields) when is_list(Fields) ->
    OldFields = get_table_info(Table, attributes),
    RawList = [pos_list_item(OldFields, F) || F <- Fields],
    DelPosList = [X || X <- RawList, X > 0],
    %% ɾ���ֶ�
    NewFields = remove_list_items(OldFields, DelPosList),
    true = length(NewFields) > 1,

    Keys = get_all_keys(Table),
    case DelPosList of
	[] -> %% �ϴ�ת��һ��, ��Ҫ��ת
	    %% ִ��ɾ������
	    do_del_fields(Table, Keys, NewFields);
	_ ->
	    %% ���м�¼��ɾ�����
	    mark_all_record(Table, Keys, DelPosList),
	    
	    %% �ı�ṹ
	    {atomic, ok} = mnesia:transform_table(Table, ignore, NewFields),
	    
	    %% ִ��ɾ������
	    do_del_fields(Table, Keys, NewFields)
    end,

    {atomic, ok}.


%% ִ��ɾ������
do_del_fields(Table, Keys, NewFields) ->
    FConvert = fun(R) -> 
    		case size(R) =:= length(NewFields) + 1 of
    		    true -> %% ������¼ת����
    			R;
    		    _ ->
			NewR = remove_mark_fields(R),
			case size(NewR) =:= length(NewFields) + 1 of
			    true ->
				NewR;
			    _ ->			
				erlang:error({bad_record, R})  
			end
		end
	end,

    F = fun(Key) ->
		 convert_record_2(Table, Key, FConvert)		
	end,
    lists:foreach(F, Keys).

%% ���м�¼��ɾ�����
mark_all_record(Table, Keys, DelPosList) ->
    F = fun(Key) ->
		convert_record_2(Table, Key, fun(R) -> mark_del_fields(DelPosList, R) end)		
	end,
    lists:foreach(F, Keys).
    

%% ���������ֶ�
call_rename_table_field(Table, {OldField, NewField}) ->
    TabList = get_frag_tables(Table),
    [{atomic, ok} = call_rename_table_field_1(T, {OldField, NewField}) || T <- TabList],
    {atomic, ok}.

%% ���������ֶ�
call_rename_table_field_1(Table, {OldField, NewField}) ->
    OldFields = get_table_info(Table, attributes),
    case lists:member(NewField, OldFields) of
	true -> %% �Ѿ��������
	    {atomic, ok};
	false ->
	    NewFields = replace_list_item(OldFields, OldField, NewField),
	    %% ����Ҫ��ת��
	    F = ignore,

	    mnesia:transform_table(Table, F, NewFields)
    end.



%% ������
call_clear_tables(TableList) when is_list(TableList) ->
    [call_clear_frag_table(T) || T <- TableList],
    {atomic, ok}.

call_clear_frag_table(Tab) when is_atom(Tab) ->
    TabList = get_frag_tables(Tab),
    [{atomic, ok} = mnesia:clear_table(T) || T <- TabList],
    {atomic, ok}.

%% ������������ֶ�
call_rename_table_fields(Table, KeyVals) when is_list(KeyVals) ->
    OldFields = get_table_info(Table, attributes),
    
    NewFields = replace_list_items(OldFields, KeyVals),

    %% ����Ҫ��ת��
    F = ignore,
    mnesia:transform_table(Table, F, NewFields).


%% �����¼
call_insert_data(Table, Records) when is_list(Records) ->
    F = fun() ->
		FWrite = fun(Data) ->
				AList = lists:append([Table], tuple_to_list(Data)),
				Record = list_to_tuple(AList),
				mnesia:write(Record)				
			end,
		lists:foreach(FWrite, Records)		
	end,
    {atomic, _OpResult} = mnesia:transaction(F).


%% ɾ����¼
call_delete_data(Table, Keys) when is_list(Keys) ->
    F = fun() -> 
		FDelete = fun(Key) ->
				  mnesia:delete({Table, Key})
			  end,
		lists:foreach(FDelete, Keys)		
	end,
    {atomic, _OpResult} = mnesia:transaction(F).

       
%% ����module�еĺ��������һЩ���Ӳ���( ע��Mod�о�����Ҫֱ��ʹ��Recordд�����ݿ�)
call_module_fun(Mod, Fun, Params) when is_list(Params) ->
    apply(Mod, Fun, Params).


%% ִ��ÿһ�����ݿ�������������¼�����ݿ���±���
change([], _ID, _Changes)->
    ok;
        
change([H | Rest], ID, Changes) when is_tuple(H) ->
    try
	{atomic, ok} = do_change(H, ID, Changes)
    catch 
	error: Msg ->
	    %% ���������ѶϢ����ȷ
	    logger:delay_log(error, "~p~n ~p~n stack:~p~n", 
			     [H, Msg, erlang:get_stacktrace()]),
	    erlang:error(Msg)
    end,

    change(Rest, ID + 1, [H | Changes]).
    

%% ����ÿ���������
do_change(H, ID, Changes) when is_tuple(H) ->
    io:format("H:~p~n", [H]),
    Result = case H of
	{module_fun, Mod, Fun, Params, _Comment} ->
	    call_module_fun( Mod, Fun, Params );

	{delete_data, Table, Keys, _Comment} ->
	    call_delete_data(Table, Keys);

	{insert_data, Table, Records, _Comment} ->
	    call_insert_data(Table, Records);

	{create_table, Table, Fields, _Comment} ->
	    call_create_table(Table, Fields);

	{create_table, Table, Fields, Options, _Comment} ->
	    call_create_table(Table, Fields, Options);

	{active_table_frag, TableList, _Comment} ->
	    call_active_table_frag(TableList);	
		 
	{delete_table, Table, _Comment} ->
	    call_delete_table(Table);

	{add_table_fields, Table, KeyVals, _Comment}->
	    call_add_table_fields(Table, KeyVals);

	{remove_table_fields, Table, Fields, _Comment} ->
	    call_remove_table_fields(Table, Fields);

	{rename_table_fields, Table, KeyVals, _Comment} ->
	    call_rename_table_fields(Table, KeyVals);

	{remove_table_field, Table, Field, _Comment} ->
	    call_remove_table_field(Table, Field);

	{rename_table_field, Table, {OldField, NewField}, _Comment} ->
	    call_rename_table_field(Table, {OldField, NewField});

	{clear_tables, TableList, _Comment} ->
	    call_clear_tables(TableList);

	{add_table_index, Table, Field, _Comment} ->
	    call_add_table_index(Table, Field);

	{del_table_index, Table, Field, _Comment} ->
	    call_del_table_index(Table, Field);

	{change_table_copy_type, Table, NewType, _Comment} ->
	    call_change_table_copy_type(Table, NewType);

	{change_frag_hash, NewHashMod, _Comment} ->
	    call_change_frag_hash(NewHashMod, Changes);

	%% δ�����������
	Other ->
	    erlang:error({bad_operate_type, Other})
    end,
    
    case Result of
	{atomic, ok} ->
	    update_history(H, ID);
	_->
	    {atomic, fail}
    end.

update_history(H, ID) ->
    Comment = lists:last(tuple_to_list(H)),
    io:format("change database, comment:~p~n", [Comment]),
    Func = fun() ->
		   ok =  mnesia:write(#db_update_history{id = ID, 
					      comment = Comment, 
					      time = erlang:localtime(), 
					      detail = H})
	   end,
    {atomic, _OpResult} = mnesia:transaction(Func).


%%%===================================================================
%%% Internal functions
%%%===================================================================
waitfor_tables() ->
    Tables = mnesia:system_info(tables), 
    do_waitfor_tables(Tables).

do_waitfor_tables(Tables) ->
    case mnesia:wait_for_tables(Tables, 1000) of
	{timeout, BadTables} ->
	    logger:log(warning, "wait for tables: ~p........~n", [BadTables]), 
	    mnesia:wait_for_tables(BadTables, infinity);	    
	ok ->
	    ok
    end.


get_tables(AList) when is_list(AList) ->
    F = fun(X, Acc) -> 
		Tab = element(2, X),
		case element(1, X) of
		    create_table -> [Tab | Acc];
		    delete_table -> lists:delete(Tab, Acc);
		    _ -> Acc
		end
	end,
    lists:foldl(F, [], AList).


get_del_mark() ->
    '`!@#del_mark#@!`'.

remove_mark_fields(Record) when is_tuple(Record) ->
    DelMark = get_del_mark(),
    L = [X || X <- tuple_to_list(Record), X =/= DelMark],
    list_to_tuple(L).

mark_del_fields(DelPosList, Record) when is_tuple(Record) ->
    List = tuple_to_list(Record),
    Array = array:from_list(List),
    F = fun(Pos, Acc) -> 
		case lists:member(Pos, DelPosList) of
		    true ->
			array:set(Pos, get_del_mark(), Acc);
		    _ ->
			Acc
		end		
	end,
    Ret = lists:foldl(F, Array, DelPosList),
    list_to_tuple(array:to_list(Ret)).

exists_list_index(AList, Index) when is_list(AList) ->
    Len = length(AList),
    (1 =< Index) and (Index =< Len).

replace_list_items(AList, []) when is_list(AList)  ->
    AList;

replace_list_items(AList, [{Old, New} | Rest]) when is_list(AList) ->
    NewList = replace_list_item(AList, Old, New),
    replace_list_items(NewList, Rest).
    

replace_list_item(AList, OldItem, NewItem) when is_list(AList) ->
    Index = pos_list_item(AList, OldItem),
    case exists_list_index(AList, Index) of
	true ->
	    {List2, List3} = lists:split(Index - 1, AList),
	    [_H | T] = List3,
	    Last = lists:append([NewItem], T),
	    lists:append(List2, Last);
	false ->
	    AList
    end.
    

remove_list_items(AList, IndexArray) when is_list(AList), is_list(IndexArray) ->
    NIndexArray = lists:sort(IndexArray),

    F = fun(Index, Acc) -> 
		remove_list_item(Acc, Index)
	end,
 
    lists:foldr(F, AList, NIndexArray).

    

remove_tuple_items(ATuple, IndexArray) when is_tuple(ATuple), is_list(IndexArray) ->
    List = remove_list_items(tuple_to_list(ATuple), IndexArray),
    list_to_tuple(List).
 
remove_list_item(AList, Index) when is_list(AList) ->
    case exists_list_index(AList, Index) of
	true->
	    {List2, List3} = lists:split(Index - 1, AList),
	    [_H | T] = List3,
	    lists:append(List2, T);
	false ->
	    AList
    end.

remove_tuple_item(ATuple, Index) when is_tuple(ATuple) ->
    List = remove_list_item(tuple_to_list(ATuple), Index),
    list_to_tuple(List).

%% �����б���ĳ��ֵ��λ��, û�ҵ�����0
pos_list_item(AList, Val) when is_list(AList) ->
    pos_loop(AList, Val, 1).
    

%% û�ҵ�������0
pos_loop([], _Val, _N) ->
    0;

%% �ҵ�������λ�ã���1��ʼ
pos_loop([_Val | _T], _Val, N) ->
    N;

pos_loop([_H | T], Val, N) ->
    pos_loop( T, Val, N + 1 ).


  


%% ȡ�����з�Ƭ��
get_frag_tables(Tab) when is_atom(Tab) ->
    KVList = get_table_info(Tab, frag_size),
    [Table || {Table, _Size} <- KVList] ++  get_memdisc_table(Tab).


%% ������
do_tran(Fun, Args) when is_list(Args) ->
    mnesia:activity(transaction, Fun, Args, mnesia_frag).


one_frag_check(Tables) ->
    F = fun(T, Acc) -> 
		case catch get_table_info(T, frag_properties) of
		    Props when is_list(Props) ->
			NFrag = 
			    case lists:keyfind(n_fragments, 1, Props) of
				{n_fragments, N} -> N;
				_ -> 1
			    end,
			
			case NFrag > 1 of 
			    true -> [T | Acc];
			    _ -> Acc
			end;
		    _  ->
			Acc
		end
	end,
	 	 
    ErrorTables = lists:foldl(F, [], Tables),
    case length(ErrorTables) > 0 of
	true ->
	    erlang:error({too_many_frags_can_not_change_hash, [ErrorTables]});
	_ ->
	    ok
    end.

%% ȡ�ڴ��, û���򷵻�[]
get_memdisc_table(Tab) when is_atom(Tab)->
    MemTab = list_to_atom(atom_to_list(Tab) ++ mem_tail()),
    try
	get_table_info(MemTab, type),
	[MemTab]
    catch 
	_Type: _Msg -> []
    end.

get_table_info(Tab, Info) ->
    do_tran(fun mnesia:table_info/2, [Tab, Info]).


%%%===================================================================
%%% ���Դ���
%%%===================================================================

test() ->    
    test_pos(),
    test_remove(),
    test_replace(),
    test_sort(),
    test_db().

test_sort() ->
    FGreater = fun(A, B) -> A > B end,
    A = [2, 892, 83, 992, 0],
    OrderArray = lists:sort(FGreater, A ),
    [992, 892, 83, 2, 0] = OrderArray,
    ok.


test_replace() ->
    A = [a,b,c,d],
    [hjx,b,c,d] = replace_list_item(A, a, hjx),
    [a,hjx,c,d] = replace_list_item(A, b, hjx),
    [a,b,hjx,d] = replace_list_item(A, c, hjx),
    [a,b,c,hjx] = replace_list_item(A, d, hjx),
    [a,b,c,d] = replace_list_item(A, e, akk),
    [a,b,c,d] = replace_list_item(A, f, akk),

    [age, b, money, d] = replace_list_items(A, [{a, age}, {c, money}]),
    [a, age, c, d] = replace_list_items(A, [{b, age}]),
    [age, bb, money, dd] = replace_list_items(A, [{a, age}, {b, bb}, {c, money}, {d, dd}]),
    [a, b, c, d] = replace_list_items(A, [{aaa, age}, {ccc, money}]),
     
    ok.

test_remove()->
    A = [1,2,3,4],
    [2,3,4] = remove_list_item(A, 1),
    [1,3,4] = remove_list_item(A, 2),
    [1,2,4] = remove_list_item(A, 3),
    [1,2,3] = remove_list_item(A, 4),
    [1,2,3,4] = remove_list_item(A, 5),
    [1,2,3,4] = remove_list_item(A, 0),

    [1,4] = remove_list_items(A, [2, 3]),
    [2,3,4] = remove_list_items(A, [1]),
    [2,4] = remove_list_items(A, [1, 3]),
    [4] = remove_list_items(A, [1, 2, 3]),
    [] = remove_list_items(A, [1, 2, 3, 4]),
    [] = remove_list_items(A, [1, 2, 3, 4, 5]),
    [1, 4] = remove_list_items(A, [2, 3, 5, 7, 9]),

    B = {a,b,c,d},
    {b,c,d} = remove_tuple_item(B, 1),
    {a,c,d} = remove_tuple_item(B, 2),
    {a,b,d} = remove_tuple_item(B, 3),
    {a,b,c} = remove_tuple_item(B, 4),
    {a,b,c,d} = remove_tuple_item(B, 5),
    {a,b,c,d} = remove_tuple_item(B, 0),

    {a,d} = remove_tuple_items(B, [2, 3]),
    {b,c,d} = remove_tuple_items(B, [1]),
    {b,d} = remove_tuple_items(B, [1, 3]),
    {d} = remove_tuple_items(B, [1, 2, 3]),
    {} = remove_tuple_items(B, [1, 2, 3, 4]),
    {} = remove_tuple_items(B, [1, 2, 3, 4, 5]),
    {a, d} = remove_tuple_items(B, [2, 3, 5, 7, 9]),
    ok.

test_pos() ->
    A = [1, 2, 3, 4],
    0 = pos_list_item(A, 0),
    1 = pos_list_item(A, 1),
    2 = pos_list_item(A, 2),
    3 = pos_list_item(A, 3),
    4 = pos_list_item(A, 4),
    0 = pos_list_item(A, 99),    
    ok.
    
test_db() ->
    mnesia:create_schema([node()]),
    ok = mnesia:start(),

    %% �Բ�������ı���wait for
    mnesia:wait_for_tables([person_table, palyer_table, rm_person], 2000),
    test_create_table(), 
    test_delete_table(),
    test_add_remove_record(),
    test_rename_table(),
    test_modify_table_field(),    
    mnesia:stop(),
    ok.
      

test_add_remove_record() ->
    PersonFields = [name, age],
    delete_table(person_table),
    call_create_table(person_table, PersonFields),
    call_insert_data(person_table, [{hjx, 20}, {ye, 30}]),
    Records = select_table(person_table),
    [] = Records -- [{person_table, hjx, 20}, {person_table, ye, 30}],  

    call_delete_data(person_table, [hjx]),
    [{person_table, ye, 30}] = select_table(person_table),     

    ok.

test_create_table() ->
    PersonFields = [age, height],
    PlayerFields = [username, money],
    delete_table(person_table),
    delete_table(player_table),
    call_create_table(person_table, PersonFields),
    call_create_table(player_table, PlayerFields),

    PersonFields = mnesia:table_info(person_table, attributes),    
    PlayerFields = mnesia:table_info(player_table, attributes),
    insert_record({person_table, 19, 28}),
    insert_record({person_table, 20, 30}),
    [] = [{person_table, 20, 30},{person_table, 19, 28}] 
	-- select_table(person_table),
    ok.

test_delete_table() ->
    PersonFields = [age, height],
    delete_table(person_table),
    call_create_table(person_table, PersonFields),
    
    call_delete_table(person_table),
    {timeout, _} = mnesia:wait_for_tables([person_table], 200),

    ok.

test_rename_table() ->
    PersonFields = [name, age],
    delete_table(person_table),
    call_create_table(person_table, PersonFields),
    insert_record({person_table, hjx, 31}),
    insert_record({person_table, y3, 22}),
    Records = select_table(person_table),
    [] = Records -- [{person_table, hjx, 31}, {person_table, y3, 22}],
    %% call_rename_table(person_table, rm_person),

    %%  NewRecords = select_table(rm_person),
    %% [] = NewRecords -- [{rm_person, hjx, 31}, {rm_person, y3, 22}],
    %% {timeout, _} = mnesia:wait_for_tables([person_table], 200),
    
    ok.

test_modify_table_field() ->
    PersonFields = [name, age],
    delete_table(person_table),
    call_create_table(person_table, PersonFields),
     insert_record({person_table, hjx, 31}),
    insert_record({person_table, y3, 22}),
    Records = select_table(person_table),
    [] = Records -- [{person_table, hjx, 31}, {person_table, y3, 22}],

    %% ��������
    call_add_table_fields(person_table, [{height, 177}, {power, 99}]),
    [name, age, height, power] = mnesia:table_info(person_table, attributes),
    NewRecords = select_table(person_table),
    [] = NewRecords -- [{person_table, hjx, 31, 177, 99}, {person_table, y3, 22, 177, 99}],    

    %% ����ɾ��
    call_remove_table_field(person_table, height),
    NotHeightRecords = select_table(person_table), 
    [name, age, power] = mnesia:table_info(person_table, attributes),
    [] = [{person_table, hjx, 31, 99}, {person_table, y3, 22, 99}] 
	-- NotHeightRecords,

    %% ����ɾ��
    call_remove_table_field(person_table, power), 
    NotPowerRecords = select_table(person_table),   
    [name, age] = mnesia:table_info(person_table, attributes),
    [] = [{person_table, hjx, 31}, {person_table, y3, 22}] 
	-- NotPowerRecords,

    %% ��������
    call_add_table_fields(person_table, [{height, 177}, {power, 99}, {money, 123}]),
    [name, age, height, power, money] = mnesia:table_info(person_table, attributes),
    MoneyRecords = select_table(person_table),    
    [] = MoneyRecords -- [{person_table, hjx, 31, 177, 99, 123}, {person_table, y3, 22, 177, 99, 123}],    

    %% ����ɾ��
    call_remove_table_fields(person_table, [height, power]),
    DeleteTestRecords = select_table(person_table),   
    [name, age, money] = mnesia:table_info(person_table, attributes),
    [] = [{person_table, hjx, 31, 123}, {person_table, y3, 22, 123}] 
	-- DeleteTestRecords,

    %% ��������
    call_add_table_fields(person_table, [{height, 160}, {power, 25}]),
    [name, age, money, height, power] = mnesia:table_info(person_table, attributes),
    [] = [{person_table, hjx, 31, 123, 160, 25}, {person_table, y3, 22, 123, 160, 25}] 
	-- select_table(person_table),               
    %% ����������
    call_rename_table_field(person_table, {power, wid}),
    [] = [{person_table, hjx, 31, 123, 160, 25}, {person_table, y3, 22, 123, 160, 25}] 
	-- select_table(person_table),

    [name, age, money, height, wid] = mnesia:table_info(person_table, attributes),

    %% ����������
    call_rename_table_fields(person_table, [{wid, power}, {age, myage}, {name, myname}]),
    [] = [{person_table, hjx, 31, 123, 160, 25}, {person_table, y3, 22, 123, 160, 25}] 
	-- select_table(person_table),

    [myname, myage, money, height, power] = mnesia:table_info(person_table, attributes),
    insert_record({person_table, jy, 22, 1123, 1160, 225}),
    [] = [{person_table, jy, 22, 1123, 1160, 225}, 
	  {person_table, hjx, 31, 123, 160, 25},
	  {person_table, y3, 22, 123, 160, 25}] 
	-- select_table(person_table),
    %% �������������
    call_clear_tables([person_table]),
    0 = mnesia:table_info(person_table, size),
    ok.

insert_record(Record) ->
    F = fun() -> ok = mnesia:write( Record ) end,
    {atomic, OpResult} = mnesia:transaction(F),
    OpResult.


delete_table(Table)->
    mnesia:delete_table(Table).
     

select_table(Table) ->
    F = fun() -> qlc:e(qlc:q([X || X <- mnesia:table(Table)])) end,
    {atomic, Records} = mnesia:transaction(F),
    Records.

mem_tail() ->
    "_mem".
