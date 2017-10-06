%%%-------------------------------------------------------------------
%%% @author linyijie <linyj@35info.cn>
%%% @copyright (C) 2012, linyijie
%%% @doc
%%%  缩短果实结果的时间
%%% @end
%%% Created : 17 Sep 2012 by linyijie <linyj@35info.cn>
%%%-------------------------------------------------------------------
-module(item_reduce_fruit_time).

-include("sys_msg.hrl").

-export([can_use_item/6, use_item/2]).

can_use_item(_Owner, _Targets, HouseData, _Item, _ItemTplt, _PlayerData) ->
    F = fun() ->
		HouseID = house:get_house_id(HouseData),
		Crops = farm:get_crops(HouseID),
		case Crops of
		    [] -> {error, ?msg_not_need_reduce_fruit_time};
		    _Crops ->
			case farm:is_all_crop_mature(Crops) of
			    true -> {error, ?msg_not_need_reduce_fruit_time};
			    false -> true 
			end
		end
	end,
    case db:transaction(F) of
	{error, MsgID} -> {false, MsgID};
	true -> true
    end.
%% 模板表里的参数填写的是缩短果实成熟的时间, 单位:秒
use_item({Account, _Targets, HouseData, _Item, _ItemTplt, PlayerData}, ReduceTime) ->
    farm:reduce_all_fruit_time(Account, PlayerData, HouseData, ReduceTime),
    {ok, HouseData, []}.

