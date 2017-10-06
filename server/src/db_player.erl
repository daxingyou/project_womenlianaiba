%% Author: NoteBook
%% Created: 2009-9-12
%% Description: Add description to db_player
-module(db_player).

%%
%% Include files
%%
-include("table_info.hrl").
-include("packet_def.hrl").
-include("enum_def.hrl").
-include_lib("stdlib/include/qlc.hrl").
-include("qq_strategy.hrl").
-include("records.hrl").

%%
%% Exported Functions
%%
-export([is_exist/1, get_online_players/0]).
-export([update_user_name/2, 
	 select/1, insert_online_player/3, delete_online_player/1]).
-export([get_user_name/1]).
-export([get_user_mateup_status/1]).
-export([get_online_player_user_info/1, get_platform_login_info/1]).

%%
%% API Functions
%%
   
%%
%% 是否存在EQ帐号
%% 结果: true | false
%%
-spec is_exist(atom()) -> atom().
is_exist(Account) ->
    Record = select(Account),
    has_record(Record).

has_record(Record) ->
    case Record of
        [] -> false;
        _ -> true
    end.

get_user_mateup_status(Account)when is_list(Account) ->
    get_user_mateup_status(list_to_atom(Account));

get_user_mateup_status(Account)->
    case select(Account) of
	#player_basic_data{mateup_status=MateupStatus} -> 
	    MateupStatus;
	_->
	    ?mst_single
    end.

get_user_name(Account) when is_list(Account) ->
    get_user_name(list_to_atom(Account));
get_user_name(Account) ->
    case db:dirty_read(player_basic_data, Account) of
	[] -> [];
	[#player_basic_data{username=UserName}] -> UserName
    end.
%%------------------------------player_base_info--------------------------------------

%%
%% 更新玩家数据
%%
update_user_name(UserName, PlayerData) ->
    NPlayerData = PlayerData#player_basic_data{username=UserName},
    db:dirty_write(NPlayerData).



%%
%% 获取玩家数据
%% 格式：{#player_basic_data}
%% 每次都从数据库读取数据
%%
-spec select(atom()) -> list() | tuple().
select(Account) ->
    case db:dirty_read(player_basic_data, Account) of
	[] -> [];
	[PlayerBasicData] -> PlayerBasicData
	end.



%%-----------------------------------------------------------------------------------

%%------------------------------online_player----------------------------------------
%%
%% 加入在线玩家
%%
-spec insert_online_player(atom(), term(), term()) -> tuple().
insert_online_player(Account, UserInfo, LoginInfo) ->
    F = fun() -> 
		case db:read(player_basic_data, Account) of
		    [] ->
			[];
		    [BasicData] ->
			NBasicData = BasicData#player_basic_data{last_login_time=datetime:localtime()},
			db:write(NBasicData)
		end,
		db:write({online_player, Account, date(), node(), UserInfo, LoginInfo})
	end,
    db:transaction(F).

%%
%% 删除在线玩家
%%
-spec delete_online_player(atom()) -> tuple().
delete_online_player(Account) ->
    F = fun() -> 
		db:delete({online_player, Account}) 
	end,
    db:transaction(F).

%%
%% 取所有在线玩家
%%
-spec get_online_players() -> list().
get_online_players() ->
    %% 直接用dirty方法，比较快速
    db:dirty_all_keys(online_player).

-spec get_online_player_user_info(atom())-> #pengyou{}|undefined.
get_online_player_user_info(Account)->
    case db:dirty_read(online_player, Account) of
	[] -> undefined;
	[{online_player, Account, _Data, _Node, UserInfo, _LoginInfo}] ->
	    UserInfo
    end.

-spec get_platform_login_info(atom())-> #platform_login_info{}|undefined.
get_platform_login_info(Account)->
    case db:dirty_read(online_player, Account) of
	[] -> undefined;
	[{online_player, Account, _Data, _Node, _UserInfo, LoginInfo}] ->
	    LoginInfo
    end.


%%-----------------------------------------------------------------------------------
