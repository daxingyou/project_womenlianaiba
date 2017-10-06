%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% ������������
%%% @end
%%% Created : 13 Mar 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(db_update_gift).

%% API
-export([update_gift/0]).

-record(gift_list, {             %% �����б�
	  account,               %% ����ʺ�
	  send_list = [],        %% �����б�
	  receive_list = [],     %% δ�����б�
	  received_list = []     %% �����б�
	 }).

-record(player_gift, {
	  house_id,              %% ����Id
	  boy = #gift_list{},    %% ���Խ�ɫ������
	  girl = #gift_list{}    %% Ů�Խ�ɫ������
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
