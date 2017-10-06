%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%%
%%% @end
%%% Created : 17 May 2012 by LinZhengJian <linzhj@35info.cn>

-module(item_polymorph).
-include("packet_def.hrl").
-include("router.hrl").
-include("sys_msg.hrl").
-include("tplt_def.hrl").

-compile(export_all).


can_use_item(_Owner, _Targets, _HouseData, _Item, _ItemTplt, _PlayerData) ->
    true.

use_item({Account, [TargetAccount], HouseData, _Item, _ItemTplt, PlayerData}, PolymorphId) ->
    transforms(Account, TargetAccount, PolymorphId, PlayerData, HouseData).

transforms(Account, TargetAccountString, PolymorphId, PlayerData, HouseData)->
    {polymorph_props_item_tplt, PolymorphId, RawDuration, _EffectId, Message} = 
	tplt:get_data(polymorph_props_item_tplt, PolymorphId),

    SceneName = player_data:get_scene_name(PlayerData),
    Party = party:get_party(SceneName),
    Duration = 
	case Party of
	    [] ->
		RawDuration;
	    _ ->
		RawDuration * 2
	end, 

    TargetAccount = list_to_atom(TargetAccountString),
    [PlayerBasicData] = db:read(player_basic_data, TargetAccount),
    Now = datetime:localtime(),
    Polymorph = #polymorph{id=PolymorphId, duration=Duration, start_at=Now},
    db:write(PlayerBasicData#player_basic_data{alter_body=Polymorph}),
    L = [
	 {router, cast, [undefined, SceneName, broadcast_all_players, #notify_polymorph_result{account=TargetAccount, alter_body=Polymorph, message=Message, user=Account}]},
	 {router, cast, [Account, polymorph_event, {TargetAccount, PolymorphId}]},
	 {router, cast, [TargetAccount, be_polymorph_event, {Account, PolymorphId}]}
	 ],

    case Party of
	[] ->
	    {ok, HouseData, L};
	_ ->
	    Exp = common_def:get_val(party_use_magic_item_exp),
	    %% [BasicData] = db:read(player_basic_data, Account),
	    PlayerPoint = party_coin:add(Account, Exp),

	    %% {NewBasicData, HouseData1, Msgs} = house_level_exp:add_exp(Exp, BasicData, HouseData),
	    %% db:write(NewBasicData),
	    %% db:write(HouseData1),

	    MFAs = party:on_bian_shen(PolymorphId, Party),
	    NewL = L ++ [{party_coin, send2client, [Account, PlayerPoint]}] ++ MFAs,
	    {ok, HouseData, NewL}
    end.


purify_polymorph(TargetAccount)->
    [PlayerBasicData] = db:dirty_read(player_basic_data, TargetAccount),
    db:dirty_write(PlayerBasicData#player_basic_data{alter_body=#polymorph{}}).
