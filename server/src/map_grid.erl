%%%-------------------------------------------------------------------
%%% File    : map_grid.erl
%%% Author  : 
%%% Description : 
%%%
%%% Created : 15 Nov 2009 by  <>
%%%-------------------------------------------------------------------
-module(map_grid).

-include("packet_def.hrl").   
%% API
-export([calc_grid_index/2, carry/1, get_near_grid/4,
	 calc_total_grids/2]).

%%ÿ�����ӵĿ�Ⱥ͸߶�
-define(GRID_WIDTH, 30).
-define(GRID_HEIGHT, 30).

%%====================================================================
%% API
%%====================================================================
%% �����ָ�����ΰ�����������б�
%% ���ظþ��ε������б�
calc_total_grids(Width, Length) ->
    ColGrids = carry(Width / ?GRID_WIDTH),
    RowGrids = carry(Length / ?GRID_HEIGHT),
    make_list({1, ColGrids}, {1, RowGrids}, ColGrids, []).

%%�����������
calc_grid_index(#point{x=X,z=Z}, MapWidth)
  when MapWidth >= ?GRID_WIDTH ->
    ColGrids = carry(MapWidth / ?GRID_WIDTH),
    ColIndex = carry(X / ?GRID_WIDTH),
    RowIndex = carry(Z / ?GRID_HEIGHT),
    (RowIndex-1) * ColGrids + ColIndex.
    

%%��ø�֪��Χ�ĸ��ӵ������б���
%%���ظ�֪��Χ�������ڵĸ��������б�
%%pointΪָ�������꣬�Ը�����Ϊ���ģ���÷�Χ�ڵĶ���
%% MapWidth, MapHeight�ֱ�Ϊ��ͼ�Ŀ�͸�
%%RangeΪ��Χ���Ը���Ϊ��λ�����磬2�����������ӣ�0�������ӣ�����һ���ܱ߱߳��뾶
get_near_grid(#point{x=X,z=Z}, MapWidth, MapHeight, Range)
  when Range >= 0 ->
    ColIndex = carry(X / ?GRID_WIDTH),
    RowIndex = carry(Z / ?GRID_HEIGHT),
    ColGrids = carry(MapWidth / ?GRID_WIDTH),
    RowGrids = carry(MapHeight / ?GRID_HEIGHT),
    {ColStart, ColEnd} = bound(1, ColGrids, Range, ColIndex),
    {RowStart, RowEnd} = bound(1, RowGrids, Range, RowIndex),
    ColStartIndex1 = (RowStart-1) * ColGrids + ColStart,
    ColEndIndex1 = (RowStart-1) * ColGrids + ColEnd,
    make_list({ColStartIndex1, ColEndIndex1},
	      {RowStart,RowEnd}, ColGrids, []).
    
%%====================================================================
%% Internal functions
%%====================================================================
%% make_list({ColStart, ColEnd}=ColLimit, {RowStart, RowEnd}, [])->
%%     make_list(ColLimit, {RowStart+1,RowEnd},lists:seq(ColStart, ColEnd));
make_list(_ColLimit, {RowStart, RowEnd}, _ColGrids, L)
  when RowStart =:= RowEnd + 1->
    lists:flatten(lists:reverse(L));
make_list({ColStart, ColEnd},{RowStart, RowEnd}, ColGrids, L)->
    make_list({ColStart+ColGrids, ColEnd+ColGrids}, {RowStart+1,RowEnd},
	      ColGrids, [lists:seq(ColStart, ColEnd)|L]).

bound(Min, Max, Range, Value)->
    MinValue = erlang:max(Value - Range, Min),
    MaxValue = erlang:min(Value + Range, Max),
    {MinValue, MaxValue}.

%ȡ������λ
%% carry(1.2) -> 2
%% carry(1.8)-> 2
carry(Value) ->
    Integer = trunc(Value),
    Float = Value - Integer,
    if 
	Float > 0.0 ->
	    Integer + 1;
	true ->
	    Integer
    end.
