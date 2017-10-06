%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% 
%%% @end
%%% Created : 27 Feb 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(db_update_player).

-include("packet_def.hrl").
-include("common_def.hrl").
-include("enum_def.hrl").
-include("house_data.hrl").


-export([update_player_body/0, update_player_setting/0]).
-export([update_player_charm_20120627/0, update_player_basic_data/0]).

%%%===================================================================
%%% API
%%%===================================================================
update_player_body() ->
    F = fun() ->
		Keys = mnesia:dirty_all_keys(player_body),
		[merge_player_body_data(Key) || Key <- Keys]
	end,
    mnesia:activity(transaction, F, [], mnesia_frag),
    {atomic, ok}.

update_player_setting() ->
    F = fun() ->
		Keys = mnesia:dirty_all_keys(player_setting),
		[update_player_setting_music(Key) || Key <- Keys]
	end,
    mnesia:activity(transaction, F, [], mnesia_frag),
    {atomic, ok}.

update_player_charm_20120627()->
    %% Start = calendar:local_time(),
    %% FUpdate = fun()->
    %% 		      FirstAccount = mnesia:dirty_first(player_basic_data),
    %% 		      update_player_charm_20120629(FirstAccount)
    %% 	      end,		      
    %% %% mnesia:activity(transaction, FUpdate, [], mnesia_frag),
    %% FUpdate(),
    %% End = calendar:local_time(),
    %% io:format("Times:~p~n",[calendar:time_difference(Start, End)]),
    {atomic, ok}.

update_player_basic_data() ->
    F = fun(#house_data{house_id=HouseId, boy=Boy, girl=Girl}, PlayerBasicDatas) ->
		case (Boy /= '') and (Girl /= '') of
		    true ->
			BoyBasicData = mnesia:read(player_basic_data, Boy),
			GirlBasicData = mnesia:read(player_basic_data, Girl),
			if
			    BoyBasicData == [] ->
				Equips = [{item,0,0,{stime,0,0,0,0,0,0}},
					  {item,0,300000,{stime,0,0,0,0,0,0}},
					  {item,0,0,{stime,0,0,0,0,0,0}},
					  {item,0,0,{stime,0,0,0,0,0,0}},
					  {item,0,0,{stime,0,0,0,0,0,0}},
					  {item,0,500000,{stime,0,0,0,0,0,0}},
					  {item,0,0,{stime,0,0,0,0,0,0}},
					  {item,0,0,{stime,0,0,0,0,0,0}}],
				EquipItems = player_body:make_equips_item(Equips),
				BasicData = {player_basic_data,atom_to_list(Boy),[],1,0,0,0,0,0.0,0,
					     {stime,0,0,0,0,0,0},
					     0,0,0,[],
					     {stime,0,0,0,0,0,0},
					     {stime,0,0,0,0,0,0},
					     [],0,
					     {stime,0,0,0,0,0,0},
					     0,0,0,0,0,[],[],[],0,0,[],0,
					     {polymorph,0,0,{stime,0,0,0,0,0,0}},
					     0,0,1},
				P = player_basic_data:init(Boy, HouseId, EquipItems, BasicData),
				[P | PlayerBasicDatas];
			    GirlBasicData == [] ->
				Equips = [{item,0,0,{stime,0,0,0,0,0,0}},
					  {item,0,350000,{stime,0,0,0,0,0,0}},
					  {item,0,0,{stime,0,0,0,0,0,0}},
					  {item,0,0,{stime,0,0,0,0,0,0}},
					  {item,0,0,{stime,0,0,0,0,0,0}},
					  {item,0,550000,{stime,0,0,0,0,0,0}},
					  {item,0,0,{stime,0,0,0,0,0,0}},
					  {item,0,0,{stime,0,0,0,0,0,0}}],
				EquipItems = player_body:make_equips_item(Equips),
				BasicData = {player_basic_data,atom_to_list(Girl),[],2,0,0,0,0,0.0,0,
					     {stime,0,0,0,0,0,0},
					     0,0,0,[],
					     {stime,0,0,0,0,0,0},
					     {stime,0,0,0,0,0,0},
					     [],0,
					     {stime,0,0,0,0,0,0},
					     0,0,0,0,0,[],[],[],0,0,[],0,
					     {polymorph,0,0,{stime,0,0,0,0,0,0}},
					     0,0,1},
				P = player_basic_data:init(Girl, HouseId, EquipItems, BasicData),
				[P | PlayerBasicDatas];
			    true ->
				PlayerBasicDatas
			end;
		    false ->
			PlayerBasicDatas
		end
	end,

    db:transaction(fun() -> L = mnesia:foldl(F, [], house_data), [mnesia:write(Data)|| Data <- L] end),
    {atomic, ok}.
%%%===================================================================
%%% Internal functions
%%%===================================================================
update_player_setting_music(Key) ->
    [PlayerSetting] = mnesia:read(player_setting, Key),
    Info = [#setting_info{name="music", value=?ast_open}],
    NPlayerSetting = PlayerSetting#player_setting{info=Info}, 
    mnesia:write(NPlayerSetting).

merge_player_body_data(Key) ->
    [{player_body, _, Body}] = mnesia:read(player_body, Key),
    [PlayerBasicData] = mnesia:read(player_basic_data, Key),
    NPlayerBasicData = setelement(21, PlayerBasicData, Body),
    mnesia:write(NPlayerBasicData).

%% update_player_charm_20120629(Account) when Account /= '$end_of_table'->
%%     case mnesia:dirty_read({player_basic_data, Account}) of
%% 	[]->
%% 	    io:format("Account:~p~n",[Account]);
%% 	[PlayerBasicData]->
%% 	    NPlayerBasicData = attached_property(PlayerBasicData),
%% 	    mnesia:dirty_write(NPlayerBasicData),
%% 	    ok;
%% 	_ ->
%% 	    io:format("_Account:~p~n",[Account])
%%     end,
%%     NextAccount = mnesia:dirty_next(player_basic_data, Account),
%%     update_player_charm_20120629(NextAccount);

%% update_player_charm_20120629(_Other)->
%%     ok.
					     
%% attached_property(PlayerBasicData)->
%%     Body = element(15, PlayerBasicData),
%%     Items = player_body:get_all_items(Body),
%%     TotalCharm =      %% 遍历Items，计算charm总和
%% 	lists:foldl(
%% 	  fun(#item{template_id=ItemId}, CharmAcc)->
%% 		  get_charm(ItemId) + CharmAcc
%% 	  end, 0, Items),
%%     setelement(34, PlayerBasicData, TotalCharm).     %% 修改PlayerBasicData.charm

%% -spec get_charm(integer()) -> integer().
%% get_charm(ItemId)->
%%     tplt:get_property_value(tplt:get_data(item_tplt, ItemId)).
