%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%%
%%% @end
%%% Created : 18 Sep 2012 by LinZhengJian <linzhj@35info.cn>

-module(player_intimate).

-include("records.hrl").
-include("tplt_def.hrl").
-include("house_data.hrl").
-include("router.hrl").
-include("packet_def.hrl").

-export([start/1, handle_cast/2]).

-export([add_player_intimate/3, 
	 add_house_intimate/3,
	 get_player_intimate_with_checkup/1, 
	 get_player_intimate_with_checkup/2, 
	 calculate_level/1,
	 get_friend_intimate/2]).

%%---------------------------------------------------------------------
%%
%% gen_server functions
%%
%%---------------------------------------------------------------------

start(Account)->
    [
     router:make_event_source(add_player_intimate, Account, {Account, ?MODULE}),
     router:make_event_source(add_house_intimate, Account, {Account, ?MODULE})
    ].

handle_cast({#msg{event=add_house_intimate}, {_Activer, _HouseId, _Value}}, State) ->
    %% #house_data{boy=Boy, girl=Girl} = db_house:select(HouseId),
    %% add_intimate(Activer, Boy, Value),   
    %% add_intimate(Activer, Girl, Value),
    {noreply, State};

handle_cast({#msg{event=add_player_intimate}, {_Activer, _Passiver, _Value}}, State) ->
    %% add_intimate(Activer, Passiver, Value),
    {noreply, State}.


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%
%% Open API
%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%
%% 增加友好度
%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
add_player_intimate(_Activer, _Passiver, _Value)->
    %% router:cast(Activer, add_player_intimate, {Activer, Passiver, Value}),
    ok.

add_house_intimate(_Activer, _HouseId, _Value)->
    %% router:cast(Activer, add_house_intimate, {Activer, HouseId, Value}),
    ok.


%%-------------------------------------------------------------------------
%%
%% @spec get_player_intimate_with_checkup(atom())-> list(#intimate{}) | [].
%% @doc 获取指定用户的亲密度列表
%%      登陆时使用
%% @end
%%
%%-------------------------------------------------------------------------
get_player_intimate_with_checkup(_Account)->
    [].
    %% %% 获取平台信息
    %% #platform_login_info{openid=OpenId, openkey=OpenKey, pf=PF} = db_player:get_platform_login_info(Account),
    %% %% 获取用户好友列表
    %% FriendList = qq_strategy:get_relation_friends(PF, OpenId, OpenKey),
    %% get_player_intimate_with_checkup(Account, FriendList).

-spec get_player_intimate_with_checkup(atom())-> list(#intimate{}) | [].
get_player_intimate_with_checkup(_Account, _FriendList)->
    [].
    %% %% 获取用户亲密度列表
    %% PlayerIntimate = db_player_intimate:get(Account),
    %% %% 根据好友列表，检验亲密度列表的有效性
    %% %% 返回亲密度列表
    %% case valid_player_intimate(PlayerIntimate, FriendList) of
    %% 	{UnvalidIntimateList, ValidPlayerIntimate}->
    %% 	    correct_player_intimate(PlayerIntimate, UnvalidIntimateList),
    %% 	    ValidPlayerIntimate;
    %% 	ValidPlayerIntimate->
    %% 	    ValidPlayerIntimate
    %% end.

-spec add(atom(), atom(), integer()) -> ok.
add(Activer, Passiver, Value)->
    add1(Passiver, Activer, Value),
    add1(Activer, Passiver, Value).

add1(Activer, Passiver, Value)->
    PlayerIntimate = db_player_intimate:get(Activer),
    #player_intimate{intimate_list=IntimateList}=PlayerIntimate,
    case get_friend_intimate(IntimateList, Passiver) of
	undefined->
	    NewIntimate = #intimate{account=Passiver, value=Value},
	    db_player_intimate:set(PlayerIntimate#player_intimate{intimate_list=[NewIntimate|IntimateList]}),
	    NewIntimate;
	#intimate{value=OldValue}=Intimate->
	    IntimateLevel = calculate_level(OldValue),
	    case IntimateLevel >= common_def:get_val(max_intimate_level) of
		false->
		    NewIntimateList = lists:delete(Intimate, IntimateList),
		    NewIntimate = Intimate#intimate{value=OldValue + Value},
		    db_player_intimate:set(PlayerIntimate#player_intimate{intimate_list=[NewIntimate|NewIntimateList]}),
		    NewIntimate;
		true->
		    Intimate
	    end
    end.

%%---------------------------------------------------------
%% @spec calculate_level(integer())-> integer()
%% @doc 计算亲密等级
%% @end
%%---------------------------------------------------------
-spec calculate_level(integer())-> integer().
calculate_level(Intimate)->
    calculate_level(Intimate, 1).


calculate_level(Intimate, 1)->
    case tplt:get_data(intimate_level, 1) of
	#intimate_level{toplimit=TopLimit} ->
	case Intimate < TopLimit of
	    true->
		1;
	    false->
		calculate_level(Intimate, 2)
	end;
	empty ->
	    1
    end;

calculate_level(Intimate, Level)->
    case tplt:get_data(intimate_level, Level) of
	#intimate_level{toplimit=TopLimit} ->
	case Intimate < TopLimit of
	    true->
		Level;
	    false->
		calculate_level(Intimate, Level + 1)
	end;
	empty ->
	    Level - 1
    end.
%%---------------------------------------------------------
%%
%% internal functions
%%
%%---------------------------------------------------------
valid_player_intimate(_PlayerIntimate, [])->
    [];

valid_player_intimate(#player_intimate{intimate_list=[]}, FriendList)->
    [#intimate{account=Friend, value=0} || Friend <- FriendList];

valid_player_intimate(#player_intimate{intimate_list=IntimateList}, FriendList)->
    valid_player_intimate1(IntimateList, FriendList, []).

valid_player_intimate1([], [], ValidIntimateList)->
    ValidIntimateList;

valid_player_intimate1(IntimateList, [], ValidIntimateList)->
    {IntimateList, ValidIntimateList};

valid_player_intimate1([], FriendList,  ValidIntimateList)->
    [#intimate{account=list_to_atom(Friend), value=0} || Friend <- FriendList] ++ ValidIntimateList;

valid_player_intimate1(IntimateList, [Friend|FriendList], ValidIntimateList)->
    FriendAccount = list_to_atom(Friend),
    case get_friend_intimate(IntimateList, FriendAccount) of
	undefined->
	    valid_player_intimate1(IntimateList, FriendList, 
				   [#intimate{account=FriendAccount, value=0}|ValidIntimateList]);
	Intimate->
	    valid_player_intimate1(lists:delete(Intimate, IntimateList), FriendList, [Intimate|ValidIntimateList])
    end.

get_friend_intimate([], _Friend) ->
    undefined;
get_friend_intimate([#intimate{account=Friend}=Intimate|_IntimateList], Friend)->
    Intimate;
get_friend_intimate([_Intimate|IntimateList], Friend) ->
    get_friend_intimate(IntimateList, Friend).

%% 需要同时删除双方的记录
correct_player_intimate(#player_intimate{intimate_list=IntimateList}=PlayerIntimate, UnvalidIntimateList)->
    db_player_intimate:set(PlayerIntimate#player_intimate{intimate_list=lists:subtract(IntimateList, UnvalidIntimateList)}).


%%% 添加亲密度
add_intimate(_Activer, '', _Value)->
    ok;

add_intimate(Activer, Passiver, Value)->
    %% 判断好友关系
    case player_friends:is_friend(Activer, Passiver) of
	true->
	    %% 添加
	    #intimate{value=TotalValue} = add(Activer, Passiver, Value),
	    net_helper:send2client(Activer, #notify_friend_intimate{account=atom_to_list(Passiver), intimate=TotalValue}),
	    net_helper:send2client(Passiver, #notify_friend_intimate{account=atom_to_list(Activer), intimate=TotalValue}),
	    ok;
	false->
	    ok
    end.
