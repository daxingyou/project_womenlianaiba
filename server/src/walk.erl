%%%-------------------------------------------------------------------
%%% File    : player_walk.erl
%%% Author  :  <>
%%% Description : 
%%%
%%% Created : 29 Oct 2009 by  <>
%%%-------------------------------------------------------------------
-module(walk).

-include("packet_def.hrl").

%% API
-export([next_step/4, can_walk/2]).

%%====================================================================
%% API
%%====================================================================

%% ������һ���ĵ�
next_step(CurrPoint, _Speed, [], PosIndex) ->
    {CurrPoint, PosIndex};
next_step(CurrPoint, Speed, Path, PosIndex) ->
    NextPoint = lists:nth(PosIndex, Path),
    {Xspeed, Zspeed} = calc_speed(CurrPoint, NextPoint, Speed),
    {NewX, XState} = calc_point(CurrPoint#point.x, NextPoint#point.x, Xspeed),
    {NewZ, ZState} = calc_point(CurrPoint#point.z, NextPoint#point.z, Zspeed),
    if
	(XState =:= arrive) and (ZState =:= arrive) ->
	    {#point{x=NewX, y=0.0, z=NewZ}, PosIndex+1};
	true ->
	    {#point{x=NewX, y=0.0, z=NewZ}, PosIndex}
    end.

calc_point(CurrPoint, NextPoint, Speed) ->
    NewPoint = CurrPoint + Speed,
    if 
	abs(CurrPoint - NewPoint) >= abs(CurrPoint - NextPoint) ->
	    {NextPoint, arrive}; %%����Ŀ�ĵ�
	true ->
	    {NewPoint, unarrive} %%��û����Ŀ�ĵ�
    end.

%% ���ݵ�ǰ�����һ������Speed��x��z������ٶ�
calc_speed(#point{x=X1,z=Z1}, #point{x=X2,z=Z2}, Speed)->
    Dx = X2 - X1,
    Dz = Z2 - Z1,
    DD = abs(Dx) + abs(Dz),
    Xspeed = Speed * Dx / DD,
    Zspeed = Speed * Dz / DD,
    {Xspeed, Zspeed}.

%% �жϸ�·���Ƿ�������
can_walk(CurrPoint, [NextPoint|_Rest])->
    Dx = CurrPoint#point.x - NextPoint#point.z,
    Dz = CurrPoint#point.z - NextPoint#point.z,
    if
	((Dx =:= 0) and (Dz =:= 0))->
	    false;
	true ->
	    true
    end;
can_walk(_CurrPoint, []) ->
    false.
%%====================================================================
%% Internal functions
%%====================================================================
