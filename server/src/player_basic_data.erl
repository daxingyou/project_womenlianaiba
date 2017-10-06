%%%-------------------------------------------------------------------
%%% File    : player_basic_data.erl
%%% Author  :  <>
%%% Description : 
%%%
%%% Created :  5 Nov 2009 by  <>
%%%-------------------------------------------------------------------
-module(player_basic_data).

-include("packet_def.hrl").
-include("enum_def.hrl").
-include("tplt_def.hrl").

%% API
-compile(export_all).
%%====================================================================
%% API
%%====================================================================
%% 初始化玩家基本数据
init(Account, HouseID, EquipItems, PlayerBasicData)->
    %% 取第一级的体力值
    #level_info_tplt{max_hp=MaxHP} = tplt:get_data2(level_info_tplt, 1),
    Now = datetime:localtime(),
    PlayerBasicData#player_basic_data{account=Account, 
				      house_id=HouseID, hp=MaxHP,
				      body = EquipItems,
				      online_time=0,
				      create_time=Now,
				      last_login_time=Now,
				      hp_update_time=Now,
				      first_photo_player=Account
				     }.

%% 通知客户端玩家基本信息
notify(Account, PlayerBasicData) ->
    net_helper:send2client(Account, #notify_player_basic_data{basic_data=PlayerBasicData}).

get_owner(Account) ->
    case db:dirty_read(player_basic_data, Account) of
	[] ->
	    #player_basic_data{};
	[PlayerBasicData] ->
	    PlayerBasicData
    end.

get_lover(Lover) ->
    case Lover == '' of
	true ->
	    #player_basic_data{};
	false ->
	    get_owner(Lover)
    end.


get_body(#player_basic_data{body=Body}) ->
    Body.
set_body(Body, PlayerBasicData) ->
    PlayerBasicData#player_basic_data{body=Body}.

get_house_id(Account) when is_atom(Account) ->
    [BasicData] = db:read(player_basic_data, Account),
    player_basic_data:get_house_id(BasicData);
get_house_id(#player_basic_data{house_id=HouseId})->
    HouseId.
set_house_id(HouseId, PlayerBasicData) ->
    PlayerBasicData#player_basic_data{house_id=HouseId}.

get_account(#player_basic_data{account=Account})->
    Account.
set_account(Account, PlayerBasicData) ->
    PlayerBasicData#player_basic_data{account=Account}.

get_username(#player_basic_data{username=UserName}) ->
    UserName.
set_username(UserName, PlayerBasicData) ->
    PlayerBasicData#player_basic_data{username=UserName}.

get_sex(#player_basic_data{sex=Sex})->
    Sex.
set_sex(Sex, PlayerBasicData) ->
    PlayerBasicData#player_basic_data{sex=Sex}.

get_hair(#player_basic_data{hair=Hair})->
    Hair.
set_hair(Hair, PlayerBasicData) ->
    PlayerBasicData#player_basic_data{hair=Hair}.

get_face(#player_basic_data{face=Face})->
    Face.
set_face(Face, PlayerBasicData) ->
    PlayerBasicData#player_basic_data{face=Face}.

get_beard(#player_basic_data{beard=Beard})->
    Beard.
set_beard(Beard, PlayerBasicData) ->
    PlayerBasicData#player_basic_data{beard=Beard}.

get_hair_color(#player_basic_data{hair_color=HairColor})->
    HairColor.
set_hair_color(HairColor, PlayerBasicData) ->
    PlayerBasicData#player_basic_data{hair_color=HairColor}.

get_skin_color(#player_basic_data{skin_color=SkinColor})->
    SkinColor.
set_skin_color(SkinColor, PlayerBasicData) ->
    PlayerBasicData#player_basic_data{skin_color=SkinColor}.

get_online_time(#player_basic_data{online_time=OnlineTime}) ->
    OnlineTime.
set_online_time(OnlineTime, PlayerBasicData) ->
    PlayerBasicData#player_basic_data{online_time=OnlineTime}.

%%--------------------------------------------------------------------
%% @doc
%% @获得魅力值
%% @end
%%--------------------------------------------------------------------
get_charm(PlayerBasicData) ->
    PlayerBasicData#player_basic_data.charm.
%%--------------------------------------------------------------------
%% @doc
%% @设置魅力值
%% @end
%%--------------------------------------------------------------------
set_charm(Charm, PlayerBasicData) ->
    PlayerBasicData#player_basic_data{charm=Charm}.

get_first_photo_player(#player_basic_data{first_photo_player=Player}=PlayerBasicData) ->
    case Player of
	'' -> get_account(PlayerBasicData);
	_ ->  Player
    end.

set_first_photo_player(Player, PlayerBasicData) when is_atom(Player) ->
    PlayerBasicData#player_basic_data{first_photo_player=Player}.


get_person_info(#player_basic_data{sex=Sex, account=Account, username=UserName,		   
      animal_type=AnimalType,    % 生肖(0 表示 未知)
      birthday=BirthDay,     % 生日(默认都是0)
      star=Start,           % 星座(0 表示 未知)
      city=City, % 居住城市(0 表示 未知)
      province=Province, % 省(0 表示 未知)
      height=Height,    % 身高(0 表示 未知)
      salary=Salary,    % 薪资(0 表示 未知)
      blood_type=BloodType,     % 血型(0 表示 未知)
      career=Career,         % 职业(0 表示 未知)
      education=Education,      % 学历(0 表示 未知) 
      contact=Contact,        % 联系方式
      weight=Weight, 
      interest=Interest,       % 爱好
      signature=Signature}) ->   
    BasePersonInfo = #base_person_info{
      animal_type=AnimalType,    % 生肖(0 表示 未知)
      birthday=BirthDay,     % 生日(默认都是0)
      star=Start,           % 星座(0 表示 未知)
      city=City, % 居住城市(0 表示 未知)
      province=Province, % 
      height=Height,    % 身高(0 表示 未知)
      salary=Salary,    % 薪资(0 表示 未知)
      blood_type=BloodType,     % 血型(0 表示 未知)
      career=Career,         % 职业(0 表示 未知)
      education=Education,      % 学历(0 表示 未知) 
      contact=Contact,        % 联系方式
      interest=Interest,       % 爱好
      weight=Weight, 
      name=UserName,
      signature=Signature},
    #person_info{sex=Sex, account=Account, username=UserName,
		 info=BasePersonInfo}.



set_base_person_info(#base_person_info{
      name=UserName,
      animal_type=AnimalType,    % 生肖(0 表示 未知)
      birthday=BirthDay,     % 生日(默认都是0)
      star=Start,           % 星座(0 表示 未知)
      city=City, % 居住城市(0 表示 未知)
      province=Province, % 居住城市中的哪个片区(0 表示 未知)
      height=Height,    % 身高(0 表示 未知)
      salary=Salary,    % 薪资(0 表示 未知)
      blood_type=BloodType,     % 血型(0 表示 未知)
      career=Career,         % 职业(0 表示 未知)
      education=Education,      % 学历(0 表示 未知) 
      contact=Contact,        % 联系方式
      interest=Interest,       % 爱好
      weight=Weight,
       signature=Signature},       % 个性签名
		PlayerBasicData) ->
    PlayerBasicData#player_basic_data{
      animal_type=AnimalType,    % 生肖(0 表示 未知)
      birthday=BirthDay,     % 生日(默认都是0)
      star=Start,           % 星座(0 表示 未知)
      city=City, % 居住城市(0 表示 未知)
      province=Province, % 居住城市中的哪个片区(0 表示 未知)
      height=Height,    % 身高(0 表示 未知)
      salary=Salary,    % 薪资(0 表示 未知)
      blood_type=BloodType,     % 血型(0 表示 未知)
      career=Career,         % 职业(0 表示 未知)
      education=Education,      % 学历(0 表示 未知) 
      contact=Contact,        % 联系方式
      interest=Interest,       % 爱好
      weight=Weight,
      username=UserName,
      signature=Signature       % 个性签名
     }.

%% -------------------------------test--------------------------------
-ifdef(TEST).
-include_lib("eunit/include/eunit.hrl"). 
test()->
    ok.
-endif.




