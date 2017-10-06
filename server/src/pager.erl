%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% ��ҳϵͳ
%%% @end
%%% Created :  9 Mar 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(pager).

%% API
-export([get_current/3, get_previous/3, get_next/3, get_page_size/2]).

%%%===================================================================
%%% API
%%%===================================================================
%% ��ȡ��ǰҳ������
%% PageIndex:ҳ������, PageCount:ÿҳ����, List:��Ҫ����ҳ���б�����
%% �����10����¼��ÿҳ��ʾ4���� ���ȥ��5ҳ�����ݣ���᷵�ص���ҳ�������������.
get_current(_PageIndex, _PageCount, []) ->
    [];
get_current(PageIndex, PageCount, List) when is_list(List) ->
    TotalCount = get_total_count(List),
    PageSize = get_page_size(PageCount, TotalCount),
    NPageIndex = get_page_index(PageIndex, PageSize),
    NPageCount = get_page_count(NPageIndex, PageCount, TotalCount),
    PageStart = get_page_start(NPageIndex, PageCount, PageSize),
    lists:sublist(List, PageStart, NPageCount).

%% ��ȡ��һҳ����
get_previous(CurrPageIndex, PageCount, List) ->
    get_current(CurrPageIndex -1, PageCount, List).

%% ��ȡ��һҳ����
get_next(CurrPageIndex, PageCount, List) ->
    get_current(CurrPageIndex + 1, PageCount, List).

%% ��ȡ��¼��ҳ��
%% PageCount:ÿҳ��ʾ�������� TotalCount:��¼������|List:��¼
get_page_size(_PageCount, []) ->
    1;
get_page_size(PageCount, List) when is_list(List) ->
    TotalCount = get_total_count(List),
    get_page_size(PageCount, TotalCount);
get_page_size(PageCount, TotalCount) ->
    util:ceil(TotalCount/PageCount).
%%%===================================================================
%%% Internal functions
%%%===================================================================
get_total_count(List) when is_list(List) ->
    length(List).

%% ��ȡ��ȷ��ҳ������
%% ���ֻ��3ҳ�����ʱ�����Ҫȡ��4ҳ���򷵻�3
get_page_index(PageIndex, PageSize) when PageIndex >= PageSize ->
    PageSize;
get_page_index(PageIndex, _PageSize) when PageIndex =< 1 ->
    1;
get_page_index(PageIndex, _PageSize) ->
    PageIndex.

%% ��ȡÿҳȡ������
%% ���ȡ�����һҳ����������һҳ����������
get_page_count(PageIndex, PageCount, TotalCount) ->
    PageSize = get_page_size(PageCount, TotalCount),
    case PageIndex < PageSize of
	true ->
	    PageCount;
	false when PageIndex =< 1 ->
	    TotalCount;
	false when PageIndex > 1 ->
	    TotalCount - (PageIndex - 1) * PageCount
    end.

%% ��ȡҳ�����ʼλ��
get_page_start(PageIndex, PageCount, PageSize) ->
    NPageIndex = get_page_index(PageIndex, PageSize),
    case NPageIndex > 1 of
	true ->
	    (NPageIndex - 1) * PageCount + 1;
	false ->
	    1
    end.

%%%===================================================================
%%% Test
%%%===================================================================
-ifdef(TEST).
-include_lib("eunit/include/eunit.hrl").
get_page_size_test() ->
    ?assertEqual(3, get_page_size(2, 5)),
    ?assertEqual(0, get_page_size(5, 0)).

get_page_count_test() ->
    ?assertEqual(10, get_page_count(2, 10, 30)),
    ?assertEqual(5, get_page_count(3, 10, 25)).

get_page_start_test() ->
    ?assertEqual(1, get_page_start(1, 10, 2)),
    ?assertEqual(11, get_page_start(2, 10, 2)),
    ?assertEqual(11, get_page_start(3, 10, 2)),
    ?assertEqual(10, get_page_start(10, 3, 4)),
    ?assertEqual(21, get_page_start(3, 10, 10)).

get_current_test() ->
    ?assertEqual([4, 5, 6], get_current(2, 3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])),
    ?assertEqual([10], get_current(10, 3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).

-endif.
