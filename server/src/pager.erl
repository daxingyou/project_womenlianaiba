%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% 分页系统
%%% @end
%%% Created :  9 Mar 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(pager).

%% API
-export([get_current/3, get_previous/3, get_next/3, get_page_size/2]).

%%%===================================================================
%%% API
%%%===================================================================
%% 获取当前页面内容
%% PageIndex:页面索引, PageCount:每页数量, List:需要做分页的列表内容
%% 如果有10条记录，每页显示4条， 如果去第5页的数据，则会返回第三页的最后两条数据.
get_current(_PageIndex, _PageCount, []) ->
    [];
get_current(PageIndex, PageCount, List) when is_list(List) ->
    TotalCount = get_total_count(List),
    PageSize = get_page_size(PageCount, TotalCount),
    NPageIndex = get_page_index(PageIndex, PageSize),
    NPageCount = get_page_count(NPageIndex, PageCount, TotalCount),
    PageStart = get_page_start(NPageIndex, PageCount, PageSize),
    lists:sublist(List, PageStart, NPageCount).

%% 获取上一页数据
get_previous(CurrPageIndex, PageCount, List) ->
    get_current(CurrPageIndex -1, PageCount, List).

%% 获取下一页数据
get_next(CurrPageIndex, PageCount, List) ->
    get_current(CurrPageIndex + 1, PageCount, List).

%% 获取记录总页数
%% PageCount:每页显示的数量， TotalCount:记录总数量|List:记录
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

%% 获取正确的页面索引
%% 如果只有3页，这个时候如果要取第4页，则返回3
get_page_index(PageIndex, PageSize) when PageIndex >= PageSize ->
    PageSize;
get_page_index(PageIndex, _PageSize) when PageIndex =< 1 ->
    1;
get_page_index(PageIndex, _PageSize) ->
    PageIndex.

%% 获取每页取的数量
%% 如果取到最后一页，则根据最后一页的数量返回
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

%% 获取页面的起始位置
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
