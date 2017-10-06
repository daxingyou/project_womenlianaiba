%%%-------------------------------------------------------------------
%%% @author  <>
%%% @copyright (C) 2010, 
%%% @doc
%%%   ����� 
%%% @end
%%% Created :  8 Apr 2010 by  <>
%%%-------------------------------------------------------------------
-module(rand).


-export([seed/0, seed/1, seed/3, uniform/0, uniform/1, uniform/2, uniform/3,
	 uniform_s/1, uniform_s/2, seed0/0]).

%%-----------------------------------------------------------------------
%% The type of the state

-type ran() :: {integer(), integer(), integer()}.

%%-----------------------------------------------------------------------

-spec seed0() -> ran().

seed0() ->
    random:seed0().

%% seed()
%%  Seed random number generation with default values

-spec seed() -> ran().

seed() ->
    random:seed().

%% seed({A1, A2, A3}) 
%%  Seed random number generation 

-spec seed({integer(), integer(), integer()}) -> 'undefined' | ran().

seed({A1, A2, A3}) ->
    random:seed({A1, A2, A3}).

%% seed(A1, A2, A3) 
%%  Seed random number generation 

-spec seed(integer(), integer(), integer()) -> 'undefined' | ran().

seed(A1, A2, A3) ->
    random:seed(A1, A2, A3).


%% uniform()
%%  Returns a random float between 0 and 1.

-spec uniform() -> float().

uniform() ->
    random:uniform().

%% uniform(N) -> I
%%  Given an integer N >= 1, uniform(N) returns a random integer
%%  between 1 and N.

-spec uniform(pos_integer()) -> pos_integer().

uniform(N) when is_integer(N), N >= 1 ->
    random:uniform(N).

%% ��ȡN��(����ֵ��Min��Max֮��)
%% ��:����N:500,����ֵ:Min:40, Max:50֮�䣬���:460-550֮��
uniform(N, Min, Max)
  when is_integer(N), is_integer(Min), is_integer(Max)->
    N1 = N - Min,
    uniform(Min + Max) + N1.

%% ֵ��Min��Max֮��, ����Min, Max
uniform(Min, Max) ->
    uniform(Max - Min + 1) - 1 + Min.


%%% Functional versions

%% uniform_s(State) -> {F, NewState}
%%  Returns a random float between 0 and 1.

-spec uniform_s(ran()) -> {float(), ran()}.

uniform_s({A1, A2, A3}) ->
    random:uniform_s({A1, A2, A3}).


%% uniform_s(N, State) -> {I, NewState}
%%  Given an integer N >= 1, uniform(N) returns a random integer
%%  between 1 and N.

-spec uniform_s(pos_integer(), ran()) -> {integer(), ran()}.

uniform_s(N, State0) when is_integer(N), N >= 1 ->
    random:uniform_s(N, State0).

