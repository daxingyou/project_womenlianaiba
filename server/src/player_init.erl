%%%-------------------------------------------------------------------
%%% @author  linyijie
%%% @copyright (C) 2010, 
%%% @doc
%%%  角色初始化模块, 就是在角色创建的过程中需要初始化的一些操作
%%%  比如包裹系统, 角色基本信息系统, 货币系统等的初始化
%%% @end
%%% Created : 23 Mar 2010 by  <>
%%%-------------------------------------------------------------------
-module(player_init).

-include("packet_def.hrl").
-include("common_def.hrl").
-include("tplt_def.hrl").
-include("table_info.hrl").
-include("enum_def.hrl").
-include("resource.hrl").
-include("house_data.hrl").

%% API
-export([init/3, init/4, init_pair_house/3]).

%%%===================================================================
%%% API
%%%===================================================================

init_pair_house(Boy, Girl, HouseName)->
    data_helper:format("Boy:~p~nGirl:~p~n", [Boy, Girl]),
    TempID = common_def:get_val(lover_house_template_id),
    HouseData = house:get_house_data(Boy, TempID, Girl),
    #house_data{house_id=HouseID}=HouseData,
    BoyPair = db_pair_player:create(HouseID, Boy, ?st_boy, Girl),
    GirlPair = db_pair_player:create(HouseID, Girl, ?st_girl, Boy),
    NHouseData = HouseData#house_data{name=HouseName},
    F = fun() ->
		db:write(BoyPair),
		db:write(GirlPair),
		db:write(NHouseData),
		db:delete({pair_info, Boy}),
		db:delete({pair_info, Girl})
	end,
    Return = db:transaction(F),
    init_default_content(Boy, Girl, HouseData),
    Return.

init(Node, Account, BasicData, Equips) when is_atom(Account) ->
    rpc:call(Node, ?MODULE, init, [Account, BasicData, Equips]).

init(Account, BasicData, Equips) when is_atom(Account) ->
    EquipItems = player_body:make_equips_item(Equips),
    HouseID = db_pair_player:get_house_id(Account),
    Sex = player_basic_data:get_sex(BasicData),

    {NHouseID, DBRecords} =
	case HouseID of
	    0 -> %% 没有房屋, 需要创建房屋(没有走配对流程, 是单身)
		HouseData = init_house_data(Account, BasicData, 
					    common_def:get_val(init_single_house_diamond)),
		UserName = player_basic_data:get_username(BasicData),
		HouseName = UserName ++ binary_to_list(tplt:get_common_def("single_home_tail")),
		NHouseData = HouseData#house_data{name=HouseName},
		PairPlayerData = db_pair_player:create(house:get_house_id(HouseData), Account, Sex, ''),
		{NHouseData#house_data.house_id, [NHouseData, PairPlayerData]};
	    _ -> 
		{HouseID, []}
	end,
    PlayerBasicData = player_basic_data:init(Account, NHouseID, EquipItems, BasicData),
    F = fun() ->
		[db:write(Record)||Record <- DBRecords],
		db:write(PlayerBasicData),
		db:write(player_setting:init(Account)),
		db:write(player_stat:init(Account))
	end,
    db:transaction(F),
    case player:is_boy(PlayerBasicData) of
    	true ->
    	    chain_task:give(Account, 300);
    	false ->
    	    chain_task:give(Account, 301)
    end.

%%%===================================================================
%%% Internal functions
%%%===================================================================
%% 初始化房屋数据(没有走配对流程, 会调用这个函数)
init_house_data(Account, #player_basic_data{sex=Sex}, InitDiamond) 
  when is_integer(InitDiamond),
       InitDiamond >= 0 ->
    TempID = common_def:get_val(single_house_template_id),
    HouseData = case Sex of
		    ?st_boy ->
			house:get_house_data(Account, TempID, '');
		    ?st_girl ->
			house:get_house_data('', TempID, Account)
		end,

    HouseData#house_data{lover_diamond=InitDiamond}.

init_default_content(Boy, Girl, HouseData)->
    house_guest_book:add_guest_book(Boy, ?default_boy_house_guest_book, HouseData),
    house_guest_book:add_guest_book(Girl, ?default_girl_house_guest_book, HouseData),
    player_checkin:add_check_in(HouseData#house_data.house_id, atom_to_list(Boy), ?default_boy_house_checkin),
    player_checkin:add_check_in(HouseData#house_data.house_id, atom_to_list(Girl), ?default_girl_house_checkin),
    ok.    
