%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%  共用平台(QQ, YY之类的平台api转接处)
%%%     能共用的api尽量整合到这里吧
%%% @end
%%% Created : 18 Sep 2012 by hongjx <hongjx@35info.cn>

-module(common_platform).

-export([get_user_multi_info/4]).

-include("packet_def.hrl").
-include("records.hrl").
-include("qq_strategy.hrl").


%% get_user_multi_info("", _OpenId, _OpenKey, _FOpenIds) ->
%%     [];
get_user_multi_info(_Type, _OpenId, _OpenKey, []) ->
     [];
get_user_multi_info("yy", _OpenId, _OpenKey, FOpenIds) ->
    [begin
	 NickName = get_nick_name(Account),

	 #player_basic_information{account=Account,
				   nickname=NickName,
				   imageurl="http://image.open.yy.com/avatarurl/" ++ Account,
				   is_yellow_vip=0,
				   is_yellow_year_vip=0,
				   yellow_vip_level=0}
     end || Account <- FOpenIds];
get_user_multi_info(Type, OpenId, OpenKey, FOpenIds) ->
    QQPlayerList = 
	case qq_strategy:get_user_multi_info(Type, OpenId, OpenKey, FOpenIds) of
	    {error, _Reason}->
		[];
	    L ->
		[pengyou_to_player_info(X) || X <- L]
	end,

    N = length(FOpenIds) - length(QQPlayerList),
    case N > 0 of
	true ->
	    QQUsers = [X || #player_basic_information{account=X} <- QQPlayerList],
	    
	    FillList = [#player_basic_information{account=X, nickname=get_nick_name(X), imageurl=""} 
			|| X <- FOpenIds -- QQUsers],
	    
	    QQPlayerList ++ FillList;
	_ ->
	    QQPlayerList
    end.


pengyou_to_player_info(#pengyou{openid=OpenId, imageurl=ImageUrl, nickname=_NickName
				, is_yellow_vip=IsYellowVIP
				, is_yellow_year_vip=IsYellowYearVIP
				, yellow_vip_level=YellowVipLevel})->
     
    NickName = get_nick_name(OpenId),

    #player_basic_information{account=OpenId, nickname=NickName, imageurl=ImageUrl
			      , is_yellow_vip=IsYellowVIP
			      , is_yellow_year_vip=IsYellowYearVIP
			      , yellow_vip_level=YellowVipLevel}.



get_nick_name(Account) when is_list(Account) ->
    get_nick_name(list_to_atom(Account));
get_nick_name(Account) when is_atom(Account) ->
    case db:dirty_read(player_basic_data, Account) of
	[BasicData] ->		
	    player_basic_data:get_username(BasicData);
	_ -> ""
    end.


