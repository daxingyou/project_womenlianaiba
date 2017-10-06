%%%-------------------------------------------------------------------
%%% @author  linyijie
%%% @copyright (C) 2010, 
%%% @doc
%%%  ���ݿ��ڴ�Ӳ�̲���ģ��
%%% ��ģ�������ݴ洢���ڴ���Ӳ����, ��mnesia���õ�disc_copies��ͬ����, ���õ�����
%%% ���ڴ���Ӳ�̵�������һһ��Ӧ��, ���Ե����������ʱ��, �ǳ�ռ���ڴ�, �ҳ����ʼ���ǳ���
%%% ��ģ����㷨��:
%%% 1. �����ڶ�ȡ��ʱ��, ����ڴ���ļ�¼������, ����Ӳ������, �ڴ��cacheס������
%%% 2. ������д���ʱ��, ����ڴ���ļ�¼������, cacheס������, �Ҹ��µ�Ӳ����
%%% 3. ��ģ��֧��ֻɾ���ڴ������, �����ݿ��ɾ�������ֿ�, Ŀ����Ϊ�˼����ڴ�ռ��
%%% @end
%%% Created :  3 Jun 2010 by  <>
%%%-------------------------------------------------------------------
-module(db_memdisc).

-export([create_table/3, create_mem_table/3, delete_table/1, delete_mem_data/2, delete/2, 
	 delete/1, dirty_delete/1]).
-export([read/2, write/1, dirty_read/2, dirty_write/1]).
-export([test/0]).

create_mem_table(Name, NodeList, TabDef) -> 
    MemTable = make_mem_name(Name),
    MemTabDef = [{ram_copies, NodeList}, {record_name, Name} | TabDef],
    {atomic, ok} = mnesia:create_table(MemTable, MemTabDef).

create_table(Name, NodeList, TabDef) ->
    create_mem_table(Name, NodeList, TabDef),
    MemTable = make_mem_name(Name),

    DiscTabDef = [{disc_only_copies, NodeList}, {record_name, Name} | TabDef],
    case mnesia:create_table(Name, DiscTabDef) of
	{aborted, Reason} ->
	    {atomic, ok} = mnesia:delete_table(MemTable),
	    {aborted, Reason};
	Any -> Any
    end.

delete_table(Name) ->
    MemTable = make_mem_name(Name),
    mnesia:delete_table(MemTable),
    mnesia:delete_table(Name).

read(Table, Key)->
    MemTable = make_mem_name(Table),
    case mnesia:read(MemTable, Key) of 
	[] -> 
	    case mnesia:read(Table, Key) of
		[] -> [];
		Datas -> 
		    [mnesia:write(MemTable, D, write) || D <- Datas],
		    Datas
	    end;
	Result when is_list(Result) -> Result
    end.

dirty_read(Table, Key)->
    MemTable = make_mem_name(Table),
    case mnesia:dirty_read(MemTable, Key) of 
	[] -> 
	    case mnesia:dirty_read(Table, Key) of
		[] -> [];
		Datas -> 
		    [mnesia:dirty_write(MemTable, D) || D <- Datas],
		    Datas
	    end;
	Result when is_list(Result) -> Result
    end.

write(Val) ->
    Table = element(1, Val),
    MemTable = make_mem_name(Table),
    mnesia:write(Table, Val, write),
    mnesia:write(MemTable, Val, write).

dirty_write(Record) ->
    Table = element(1, Record),
    MemTable = make_mem_name(Table),
    mnesia:dirty_write(Table, Record),
    mnesia:dirty_write(MemTable, Record).    

%% ֻɾ���ڴ��е�����
delete_mem_data(Table, Key) ->
    MemTable = make_mem_name(Table),
    F = fun() ->
		mnesia:delete({MemTable, Key})
	end,
    mnesia:activity(transaction, F, [], mnesia_frag).


delete({Table, Key}) ->
    MemTable = make_mem_name(Table),
    mnesia:delete({MemTable, Key}),
    mnesia:delete({Table, Key}).

dirty_delete({Table, Key}) ->
    MemTable = make_mem_name(Table),
    mnesia:dirty_delete({MemTable, Key}),
    mnesia:dirty_delete({Table, Key}).
    

%% ɾ���ڴ��Ӳ�̵�����
delete(Table, Key)->
    MemTable = make_mem_name(Table),
    F = fun() ->
		mnesia:delete({MemTable, Key}),
		mnesia:delete({Table, Key})
	end,
    mnesia:activity(transaction, F, [], mnesia_frag).

%% --------------�ڲ�����--------------------------------
%% �����ڴ�������
make_mem_name(Table) when is_atom(Table)->
    list_to_atom(atom_to_list(Table) ++ "_mem").

%% --------------test------------------------------------
-record(test_data, {id, data}).
test() ->
    Table = test_data,
    Nodes = [node()],
    mnesia:delete_schema(Nodes),
    mnesia:create_schema(Nodes),
    mnesia:start(),
    delete_table(Table),
    create_table(Table, Nodes, [{attributes,  record_info(fields, test_data)}]),
    mnesia:wait_for_tables([make_mem_name(Table), Table], 2000),
    test_read(Table),
    ok.

test_read(Table) ->
    {atomic, []} = read(Table, 1),
    {atomic, ok} = write(#test_data{id = 1, data = 2}),
    DiscTable = Table,
    F = fun() ->
		mnesia:write(DiscTable, #test_data{id=2, data=3}, write)
	end,
    mnesia:activity(transaction, F, [], mnesia_frag),
    {atomic, {Table, 1, 2}} = read(Table, 1),
    {atomic, {Table, 2, 3}} = read(Table, 2),
    ok.
    
    
