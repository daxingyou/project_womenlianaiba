%%% @author  <hjx>
%%% @copyright (C) 2010, 
%%% @doc
%%%   好友相关
%%% @end
%%% Created : 10 May 2010 by  <hjx>
-module(player_friends).


-include("router.hrl").


-include("packet_def.hrl").
-include("sys_msg.hrl").
-include("common_def.hrl").
-include("enum_def.hrl").
-include("qq_strategy.hrl").
-include("records.hrl").


-export([get_friend_list/3, build_friend_info_list/4]).

-export([friend_sort/0, is_friend/2]).

-define(SERVER, ?MODULE). 

%%%===================================================================
%%% API
%%%===================================================================

%%获取朋友列表

get_local_friend_list(_Type, OpenId, _OpenKey)->
    Return = friend:get(list_to_atom(OpenId)),
    data_helper:format("Local:~p~nFriend~p~n",[OpenId,Return]),
    Return.

get_friend_list(Type, OpenId, OpenKey)->
    Return = qq_strategy:get_relation_friends(Type, OpenId, OpenKey),
    data_helper:format("QQ:~p~nFriend~p~n",[OpenId,Return]),
    case Return of
	{error, _Reason}->
	    get_local_friend_list(Type, OpenId, OpenKey);
	_->
	    Return
    end.

build_friend_info_list(Type, OpenId, OpenKey, FOpenIds)->
    common_platform:get_user_multi_info(Type, OpenId, OpenKey, FOpenIds).


friend_sort() ->
    fun(Player1, Player2)
	  when is_record(Player1, player_basic_information), is_record(Player2, player_basic_information)-> 
	    Player1#player_basic_information.nickname > Player2#player_basic_information.nickname 
    end.



-spec is_friend(atom(), atom())-> boolean().
is_friend(_Activer, _Passvier)->
    false.
    %% case db_player:get_platform_login_info(Activer) of
    %% 	#platform_login_info{openid=OpenId, openkey=OpenKey, pf=PF} ->
    %% 	    FriendList = qq_strategy:get_relation_friends(PF, OpenId, OpenKey),
    %% 	    lists:member(atom_to_list(Passvier), FriendList);
    %% 	#yy_platform_login_info{} -> false
    %% end.


%%-----------------------------测试代码---------------------------------
-include_lib("eunit/include/eunit.hrl").

