%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2011, hongjx
%%% @doc
%%%  爱情水晶
%%% @end
%%% Created :  1 Dec 2011 by hongjx <hongjx@35info.cn>

-module(house_diamond).

-include("router.hrl").
-include("gen_scene.hrl").
-include("house_data.hrl").


-export([
	 add_diamond/2,
	 dec_diamond/2,
	 dec_diamond/3,
	 notify/2,              %% 只通知自已
	 notify/1 %% 通知双方
	]).

-export([get_lover_diamond/1, set_lover_diamond/2]).



%%%===================================================================
%%% api 
%%%===================================================================


get_lover_diamond(HouseID) when is_integer(HouseID)->
    HouseData = db_house:select(HouseID),
    get_lover_diamond(HouseData);    

get_lover_diamond(HouseData) when is_record(HouseData, house_data)->
    case HouseData#house_data.lover_diamond of
	Diamond when is_integer(Diamond) andalso Diamond>0 ->
	    Diamond;
	_ ->
	    0
    end.

set_lover_diamond(Diamond, HouseData) when is_record(HouseData, house_data)->
    HouseData#house_data{lover_diamond=Diamond}.
 


notify(Account, #house_data{lover_diamond=N}) ->
    net_helper:send2client(Account, #notify_lover_diamond{amount=N}).    

%% 通知两个更新爱情水晶 
notify(#house_data{boy=Boy, girl=Girl, lover_diamond=Diamond}) ->
    Packet = #notify_lover_diamond{amount=Diamond},
    house:broadcast_owners(Boy, Girl, Packet).


%%%===================================================================
%%% 增加金钱
%%%===================================================================
add_diamond(N, #house_data{lover_diamond=Money}=HouseData) when N >= 0 ->
    NMoney = Money + N,
    HouseData#house_data{lover_diamond=NMoney}.

dec_diamond(N, #house_data{lover_diamond=Money}=HouseData) when N >= 0,
								Money >= N->
    NMoney = Money - N,
    HouseData#house_data{lover_diamond=NMoney}.

dec_diamond(N, #house_data{lover_diamond=Money}=HouseData, Fun) when N >= 0 ->
    Rest = Money - N,
    case Rest >= 0 of
	true ->
	    HouseData1 = HouseData#house_data{lover_diamond=Rest},
	    db:transaction(fun() -> db:write(HouseData1) end),
	    Fun(true, HouseData1);
	false ->
	    data_helper:format("dec_diamond, false, HouseData:~p~n", [HouseData]),
	    Fun(false, HouseData)
    end.

    

    

