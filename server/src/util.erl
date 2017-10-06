%%%-------------------------------------------------------------------
%%% @author  linyijie
%%% @copyright (C) 2010, 
%%% @doc
%%%  一些杂项函数放在这个模块中
%%% @end
%%% Created : 24 May 2010 by  <>
%%%-------------------------------------------------------------------
-module(util).

-include("packet_def.hrl").

-export([middle/3, replace/3, replace_str/3, array_index_of/2, array_count_if/2]).
-export([binary_to_integer/1, length/1, char_count/1, is_process_alive/1]).
-export([rate_select_one/2, rate_select_one/3]).
-export([get_pid/1, ceil/1]).
-export([string_format/2]).
-export([eval/1, eval/3]).
-export([get_price/2]).
-export([recombine_items/2]).
-export([to_string/1]).

%%--------------------------------------------------------------------
%% @doc
%% @格式转换
%% @end
%%--------------------------------------------------------------------
to_string(Bin) when is_binary(Bin) ->
    binary_to_list(Bin);
to_string(S) when is_list(S) ->
    S.

%% 系统提供的是QQ币，YY币需要另做转换
%% get_price(QQPrice, "yy") when is_integer(QQPrice) ->
%%     (QQPrice div 10) + 1;
get_price(QQPrice, LoginType) when is_integer(QQPrice), is_list(LoginType) ->
    QQPrice.


%% 返回>= Min, <= Max的值
-spec middle(number(), number(), number()) -> number().
middle(Value, Min, _Max) when Value < Min ->
    Min;
middle(Value, _Min, Max) when Value > Max ->
    Max;
middle(Value, _Min, _Max) ->
    Value.



%% 替换数组里指定索引里的值
replace(L, N, New) ->
    replace(L, N, New, []).

replace([], _N, _New, NewList) ->
    lists:reverse(NewList);
replace([_|Rest], 1, New, NewList) ->
    replace(Rest, 0, New, [New | NewList]);
replace([H|Rest], N, New, NewList) ->
    replace(Rest, N-1, New, [H | NewList]).


%% 替换字符串(只替换一次)
replace_str(String, OldStr, NewStr) ->
    StartIdx = string:str(String, OldStr),
    case StartIdx > 0 of
	true ->
	    MidIdx = StartIdx + string:len(OldStr),
	    A = string:substr(String, 1, StartIdx - 1),
	    B = string:substr(String, MidIdx),
	    A ++ NewStr ++ B;
	_ ->
	    String
    end.
    

%% 查找符合条件的第一个元素的Index
%% 没找到返回-1
%% Fun(X) -> true | false.
-spec array_index_of(any(), any()) -> integer().
array_index_of(Fun, GridVec) ->
    array_index_of_1(Fun, GridVec, array:size(GridVec), 0).

%% 没找到返回-1
array_index_of_1(_Fun, _GridVec, ArraySize, ArraySize) ->
    -1;
array_index_of_1(Fun, GridVec, ArraySize, Index) ->
    Item = array:get(Index, GridVec),
    case Fun(Item) of
	true ->
	    Index;
	false ->
	    array_index_of_1(Fun, GridVec, ArraySize, Index + 1)
    end.
 
%% 统计符合条件的元素个数
%% Fun(X) -> true | false.
-spec array_count_if(any(), any()) -> integer().
array_count_if(Fun, GridVec) ->
    Count = array:size(GridVec),
    N = 0,
    array_count_if_1(Fun, GridVec, Count, N).

array_count_if_1(_Fun, _GridVec, 0, N) ->
    N;
array_count_if_1(Fun, GridVec, Count, N) ->
    Index = Count - 1,
    Item = array:get(Index, GridVec),
    case Fun(Item) of
	true ->
	    array_count_if_1(Fun, GridVec, Index, N + 1);
	false ->
	    array_count_if_1(Fun, GridVec, Index, N)
    end.

binary_to_integer(Content) ->
    list_to_integer(binary_to_list(Content)).

%% 计算字符串长度
-spec length(list()) -> integer().
length(Content) ->
    Binary = iolist_to_binary(Content),
    List = unicode:characters_to_list(Binary),
    erlang:length(List).

%% 计算字符个数(注:汉字占两个字符，字母占一个字符)
%%  Content = utf8 
-spec char_count(list()) -> integer().
char_count(Content) when is_list(Content) ->
    Binary = iolist_to_binary(Content),
    %% 转成Unicode
    List = unicode:characters_to_list(Binary),
    %% 数量加总
    F = fun(X, Acc) -> 
		case X > 255 of 
		    true -> Acc + 2;
		    _ -> Acc + 1
		end
	end,
    lists:foldl(F, 0, List).

is_process_alive(Name) ->
    case whereis(Name) of
	undefined ->
	    global:whereis_name(Name) =/= undefined;
	    %% {ResL, _BadNodes} = rpc:multicall(nodes(), erlang, whereis, [Name]),
	    %% is_process_alive_1(ResL);
	_ ->
	    true
    end.


get_pid(Pid) when is_pid(Pid) ->
    Pid;
get_pid(Name) when is_atom(Name) ->
    case whereis(Name) of
	undefined ->
	    global:whereis_name(Name);
	Pid ->
	    Pid
    end.

%% is_process_alive_1([]) ->
%%     false;
%% is_process_alive_1([Res|ResL]) ->
%%     case Res =:= undefined of
%% 	true ->
%% 	    is_process_alive_1(ResL);
%% 	_ ->
%% 	    true
%%     end.


%% 按机率多选一
rate_select_one(Hit, EventRates, Events) when is_integer(Hit),
					 is_list(EventRates), 
					 is_list(Events),
					 erlang:length(Events) =:= erlang:length(EventRates) ->
    
    F = fun(E, Acc) ->
		case Acc of
		    {not_find, N, Idx} ->
			case Hit =< N + E of
			    true -> Idx;
			    false -> {not_find, N + E, Idx + 1}
			end;
		    Idx ->
			Idx
		end
	end,

    Idx = lists:foldl(F, {not_find, 0, 1}, EventRates),
    case is_integer(Idx) of
	true ->
	    EventID = lists:nth(Idx, Events),
	    {Idx, EventID};
	false ->
	    {Idx, 0}
    end.

rate_select_one(EventRates, Events) ->
    TotalRate = 100,
    %% 命中点
    Hit = rand:uniform(TotalRate),
    rate_select_one(Hit, EventRates, Events).

%% 向上取整, 比如 ceil(1.2) = 2, ceil(1.6) = 2
ceil(X) when X < 0 ->
    trunc(X);
ceil(X) ->
    T = trunc(X),
    case X - T == 0 of
        true -> T;
        false -> T + 1
    end.

%%格式化字符串输出
string_format(Pattern, Args)->
    lists:flatten(io_lib:format(Pattern, Args)).

%% 执行指定字符串的脚本
%% eval(Str) ->
%%     {ok,Ts,_} = erl_scan:string(Str),
%%     Ts1 = case lists:reverse(Ts) of
%%                [{dot,_}|_] -> Ts;
%%                TsR -> lists:reverse([{dot,1} | TsR])
%%            end,
%%     {ok,Expr} = erl_parse:parse_exprs(Ts1),
%%     erl_eval:exprs(Expr, []).

eval(S, ArgumentName, ArgumentValue) ->
    {ok, Scanned, _} = erl_scan:string(S),
    {ok, Parsed} = erl_parse:parse_exprs(Scanned),
    Bindings=erl_eval:add_binding(ArgumentName, ArgumentValue, erl_eval:new_bindings()),
    {value, Value, _} = erl_eval:exprs(Parsed, Bindings),
    Value.

eval(S) ->
    {ok, Scanned, _} = erl_scan:string(S),
    {ok, Parsed} = erl_parse:parse_exprs(Scanned),
    {value, Value, _} =  erl_eval:exprs(Parsed, erl_eval:new_bindings()),
    Value.

recombine_items(ItemList, ItemCountList) ->
    recombine_items(ItemList, ItemCountList, []).

recombine_items([], [], UnlockMaterials) ->
    UnlockMaterials;
recombine_items([0], [0], UnlockMaterials) ->
    UnlockMaterials;
recombine_items([Item|UnlockMaterialItems], [Count|UnlockMaterialCount], UnlockMaterials) ->
    case (Item == 0) and (Count == 0) of
	true ->
	    recombine_items(UnlockMaterialItems, UnlockMaterialCount, UnlockMaterials);
	false ->
	    UnlockMaterial = {Item, Count},
	    recombine_items(UnlockMaterialItems, UnlockMaterialCount, [UnlockMaterial|UnlockMaterials])
    end.
    
