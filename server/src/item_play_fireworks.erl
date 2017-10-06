%%% @author wujd <wujd@35info.com>
%%% @copyright (C) 2013, wujd
%%% @doc
%%% ʹ����Ʒ�����̻���Ч
%%% @end
%%% Created :  9 Aug 2013 by wujd <wujd@35info.com>

-module(item_play_fireworks).

-include("packet_def.hrl").

-export([can_use_item/6, use_item/2]).

can_use_item(_Ower, _Targets, _HouseData, _Item, _ItemTplt, _PlayerData) ->
    true.

use_item({_Account, _Targets, HouseData, Item, _ItemTplt, PlayerData}, _Param) ->
    ItemID = item:get_tempid(Item),		% ��ƷID
    InstID = item:get_instid(Item),		% ʵ��ID
    SceneName = player_data:get_scene_name(PlayerData),
    PlayerList = gen_scene:get_players(SceneName),

    Packent = #notiy_use_item_by_scene{item_id=ItemID, item_inst_id=InstID, result=1},
    gen_scene:broadcast_all_players(SceneName, PlayerList, Packent),
    {ok, HouseData, []}.
