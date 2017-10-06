%%%-------------------------------------------------------------------
%%% @author linyijie <linyj@35info.cn>
%%% @copyright (C) 2013, linyijie
%%% @doc
%%%  单笔充值奖励的数据库更新
%%% @end
%%% Created : 25 Apr 2013 by linyijie <linyj@35info.cn>
%%%-------------------------------------------------------------------
-module(db_update_single_payment_return).

-include("records.hrl").

-export([start/0]).


start() ->
    Keys = db:dirty_all_keys(single_payment_return),
    [begin
	 [Data] = db:dirty_read(single_payment_return, Key),
	 #single_payment_return{return_items=Items} = Data,
	 NewItems =[{convert_to_consume(ReturnDiamond), Count} || {ReturnDiamond, Count} <- Items],
	 NewData = Data#single_payment_return{return_items=NewItems},
	 db:dirty_write(NewData)
     end || Key <- Keys],
    {atomic, ok}.

convert_to_consume(40) ->
    100;
convert_to_consume(80) ->
    200;
convert_to_consume(200) ->
    500;
convert_to_consume(400) ->
    1000.

    

