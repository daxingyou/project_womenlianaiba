%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% 升级礼物数据
%%% @end
%%% Created : 13 Mar 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(db_update_gift).

%% API
-export([update_gift/0]).

-record(gift_list, {             %% 礼物列表
	  account,               %% 玩家帐号
	  send_list = [],        %% 发送列表
	  receive_list = [],     %% 未接收列表
	  received_list = []     %% 接受列表
	 }).

-record(player_gift, {
	  house_id,              %% 房屋Id
	  boy = #gift_list{},    %% 男性角色的礼物
	  girl = #gift_list{}    %% 女性角色的礼物
	 }).
%%%===================================================================
%%% API
%%%===================================================================
update_gift() ->
    F = fun() ->
		Keys = mnesia:dirty_all_keys(house_data),
		[create_gift_data(Key) || Key <- Keys]
	end,
    mnesia:activity(transaction, F, [], mnesia_frag),
    {atomic, ok}.
%%%===================================================================
%%% Internal functions
%%%===================================================================
create_gift_data(Key) ->
    [HouseData] = mnesia:dirty_read(house_data, Key),
    Boy = element(13, HouseData),
    Girl = element(14, HouseData),
    BoyGiftList = #gift_list{account=Boy},
    GirlGiftList = #gift_list{account=Girl},
    PlayerGift = #player_gift{house_id=Key, boy=BoyGiftList, girl=GirlGiftList},
    mnesia:write(PlayerGift).
