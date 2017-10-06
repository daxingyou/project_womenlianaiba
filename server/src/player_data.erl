-module(player_data).

-include("packet_def.hrl"). 
-include("player_data.hrl").
-include("enum_def.hrl").

-compile(export_all).

new()->
    #player_data{}.

get_account(#player_data{account=Account}) ->
    Account.

get_lover(#player_data{lover=Lover}) ->
    Lover.
set_lover(Lover, PlayerData) ->
    PlayerData#player_data{lover=Lover}.

get_login_time(#player_data{login_time=LoginTime}) ->
    LoginTime.

calc_online_time(PlayerData) ->
    LoginTime = get_login_time(PlayerData),
    datetime:diff_time(LoginTime, datetime:localtime()).

get_scene_name(#player_data{scene_name=SceneName}) ->
    SceneName.
set_scene_name(SceneName, PlayerData) ->
    PlayerData#player_data{scene_name=SceneName}. 


get_house_id(#player_data{house_id=HouseId}) ->
    HouseId.

get_password(#player_data{password=Password}) ->
    Password.

get_login_type(#player_data{login_type=LoginType}) ->
    LoginType.


change_scene(NewSceneName, NewPos, PlayerData) ->
    PlayerData#player_data{scene_name=NewSceneName, 
					   curr_pos=NewPos,
					   dest_pos=NewPos}.

is_at_home(#player_data{scene_name=SceneName}, PlayerBasicData) ->    
    HouseId = player_basic_data:get_house_id(PlayerBasicData),
    house:get_house_name(HouseId) =:= SceneName.
    

%% 玩家当前动作
get_actions(#player_data{actions=Actions}) ->
    Actions.

set_actions(NewActions, PlayerData) when is_list(NewActions) ->
    PlayerData#player_data{actions=NewActions}.

%% 玩家当前位置
get_pos(#player_data{curr_pos=Pos}) ->
    Pos.

set_pos(Pos, PlayerData) ->
    PlayerData#player_data{curr_pos=Pos}.

set_dest_pos(Pos, PlayerData) ->
    PlayerData#player_data{dest_pos=Pos}.

get_action_status(#player_data{action_status=ActionStatus}) ->
    ActionStatus.

set_action_status(ActionStatus, PlayerData) ->
    PlayerData#player_data{action_status=ActionStatus}.

get_action_type(#player_data{action_type=ActionType}) ->
    ActionType.

set_action_type(ActionType, PlayerData) ->
    PlayerData#player_data{action_type=ActionType}.
  

get_first_photo_player(#player_data{first_photo_player=Player}=PlayerData) ->
    case Player of
	'' -> get_account(PlayerData);
	_ ->  Player
    end.

set_first_photo_player(Player, PlayerData) when is_atom(Player) ->
    PlayerData#player_data{first_photo_player=Player}.


get_use_furni_info(#player_data{use_furni_info=Info}) ->
    Info.

set_use_furni_info(Info, PlayerData) ->
    PlayerData#player_data{use_furni_info=Info}.


get_party_buff_timer(#player_data{party_buff_timer=T}) ->
    T.

set_party_buff_timer(T, PlayerData) ->
    PlayerData#player_data{party_buff_timer=T}.


get_pub_id(#player_data{pub_id=PubID}) ->
    PubID.

set_pub_id(PubID, PlayerData) ->
    PlayerData#player_data{pub_id=PubID}.




