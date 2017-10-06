%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%   ��Ʒ�齱
%%% @end
%%% Created : 16 Jun 2012 by hongjx <hongjx@35info.cn>

-module(item_lottery).

-include("packet_def.hrl").
-include("tplt_def.hrl").

-export([can_use_item/6, use_item/2]).


can_use_item(_Owner, _Targets, _HouseData, _Item, _ItemTplt, _PlayerData) ->
    true.

%% ģ�����ֻҪ��ģ�����Ͳ��������м��ɣ� ����ֻҪ��д����һ��Ԫ������Ĳ���
%% ����Ҫʹ�������Ʒ�� ֻҪ��дitem_lottery �� ��id �Ϳ�����
%% ��������
use_item({Account,_,_,Item,_,_}, GroupID) ->
    GroupItems = get_group_items(GroupID),

    Rates = [X || #lottery_item_tplt{group_id=GID, rate=X} <- tplt:get_all_data(lottery_item_tplt), GID =:= GroupID],
    TotalRate = lists:sum(Rates),
    Hit = rand:uniform(TotalRate),
    {Index, #lottery_item{item_id=ItemID, item_count=ItemCount}} = util:rate_select_one(Hit, Rates, GroupItems),
    
    HouseID = player_basic_data:get_house_id(Account),
    [HouseData] = db:read(house_data, HouseID),
    {NHouseData, Msgs} = house_pack:add_items([{ItemID, ItemCount}], HouseData),
    %% ɾ����Ʒʱ�Զ��ᱣ��HouseData, ��������Ͳ��ñ����� 
    Packet = #notify_use_lottery_item_result{hit_index=Index - 1, 
					     item_inst_id=item:get_instid(Item),
					     items=GroupItems},
    {ok, NHouseData, [{house_pack, send_msgs, [Msgs, NHouseData]}, 
		      {net_helper, send2client, [Account, Packet]}]}.

get_group_items(GroupID) when is_integer(GroupID) ->
    [#lottery_item{item_id=ItemID, item_count=Count} || 
	#lottery_item_tplt{group_id=GID, item_id=ItemID, item_count=Count}
	    <- tplt:get_all_data(lottery_item_tplt),  GID =:= GroupID].


