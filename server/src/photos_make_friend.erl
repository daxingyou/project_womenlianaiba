%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%  照片交友
%%% @end
%%% Created : 12 Mar 2012 by hongjx <hongjx@35info.cn>

-module(photos_make_friend).

-include("enum_def.hrl").
-include("packet_def.hrl").
-include("qq_strategy.hrl").
-include("register.hrl").
-include("house_data.hrl").


-record(photo_player, {account, sex}).

-export([handle_cast/2, start/1, 
	 save_first_player/1, 
	 update_photo_player_table/0 
	]).

%%-compile(export_all).


start(Account) ->
    [
     router:make_event_source(?msg_req_opposite_sex_photos, Account, {Account, ?MODULE})
    ].

%% 更新照片交友表
update_photo_player_table() ->
    %% 清空旧数据
    mnesia:clear_table(photo_player),
    %% 重新生成数据
    Tab = house_data,

    F = fun() ->
		case mnesia:first(Tab) of
		    '$end_of_table' ->
			ok;
		    First ->
			MinLevel = common_def:get_val(photo_friend_min_level),
			MinDecoration = common_def:get_val(photo_friend_min_decoration),
			MinDay = common_def:get_val(photo_friend_min_continue_login_day),
			do_update_photo_player_table(Tab, First, MinLevel, MinDecoration, MinDay) 
		end
	end,
    db:sync_dirty(F).

do_update_photo_player_table(Tab, PrevKey, MinLevel, MinDecoration, MinDay) ->
    %% 取满足等级条件的单身男女
    case mnesia:read(Tab, PrevKey) of
	[HouseData] ->
	    #house_data{decoration=Decoration} = HouseData,
	    case Decoration >= MinDecoration of
		true ->
		    case house_level_exp:get_level(HouseData) >= MinLevel of
			true -> %% 满足等级条件
			    case house:get_owner(HouseData) of
				{'', Girl} -> %% 单身女
				    case player_login_reward:get_continue_login_day(Girl) >= MinDay of
					true ->
					    mnesia:write(#photo_player{account=Girl, sex=?st_girl});
					_ -> ok
				    end;
				{Boy, ''} -> %% 单身男
				    case player_login_reward:get_continue_login_day(Boy) >= MinDay of
					true ->
					    mnesia:write(#photo_player{account=Boy, sex=?st_boy});
					_ -> ok
				    end;
				{_Boy, _Girl} ->
				    ok
			    end;
			_ ->
			    ok
		    end;
		_ ->
		    ok
	    end
    end,

    %% 遍历下一条
    case mnesia:next(Tab, PrevKey) of
	'$end_of_table' ->
	    ok;
	K ->
	    do_update_photo_player_table(Tab, K, MinLevel, MinDecoration, MinDay)
    end.




save_first_player(State) ->
    Account = player_data:get_account(State),
    FirstPhotoPlayer = player_data:get_first_photo_player(State),
    
    FModify = fun(BasicData) ->
		      player_basic_data:set_first_photo_player(FirstPhotoPlayer, BasicData)
	      end,
    modify(player_basic_data, Account, FModify).

modify(Table, Key, FModify) when is_atom(Table) ->
    F = fun() ->
		case db:read(Table, Key) of		    
		    [Record] -> 
			NRecord = FModify(Record),
			db:write(NRecord)
		end
        end,
    db:transaction(F).


%%%===================================================================
%%% 处理handle_cast
%%%===================================================================

%% 请求刷新异性照片
handle_cast({_Msg, #req_opposite_sex_photos{}}, State) ->
    Count = common_def:get_val(head_photo_count),
    Account = player_data:get_account(State),
    [PlayerBasicData] = db:dirty_read(player_basic_data, Account),
    Sex = player_basic_data:get_sex(PlayerBasicData),
    %% 随机选出异性玩家
    FirstPhotoPlayer = player_data:get_first_photo_player(State),
    {NewPhotoPlayer, Players} = do_random_players(Count, get_opposite_sex(Sex), FirstPhotoPlayer),

    NState = player_data:set_first_photo_player(NewPhotoPlayer, State),


    EXOpenIDList = [atom_to_list(EXOpenID) || EXOpenID <- Players],
    Password = player_data:get_password(State),
    LoginType = player_data:get_login_type(State),
    %% 去腾讯取用户信息
    QQPlayerList = common_platform:get_user_multi_info(LoginType, 
						   atom_to_list(Account), 
						   Password, 
						   EXOpenIDList),
    
    %% 通知异性照片列表
    net_helper:send2client(Account, #notify_opposite_sex_photos{photos=QQPlayerList}),
    
    {noreply, NState}.



get_opposite_sex(?st_boy) ->
    ?st_girl;
get_opposite_sex(?st_girl) ->
    ?st_boy.


get_search_table() ->
    photo_player.

first_player() ->
    mnesia:dirty_first(get_search_table()).

next_player(Key) ->
    try
	case mnesia:dirty_next(get_search_table(), Key) of
	    '$end_of_table' ->
		first_player();
	    Ret -> Ret
	end
    catch 
	_Err : _Reason -> 
	    first_player()
    end.

read_player(Key) ->
    mnesia:dirty_read(get_search_table(), Key).

do_random_players(N, Sex, Key) ->
    do_random_players(N, Sex, Key, Key, []).

do_random_players(N, Sex, Key, StopKey, Acc) when N > 0 ->
    case read_player(Key) of
	[#photo_player{sex=PlayerSex}] -> 
	    NextKey = next_player(Key),
	    case NextKey of 
		StopKey -> %% 死循环, 返回
		    {NextKey, Acc};
		_ -> %% 继续查找
		   case (PlayerSex =:= Sex) of
		       true -> %% 找到异性单身, 个数减一
			   do_random_players(N - 1, Sex, NextKey, StopKey, [Key | Acc]);
		       _ -> %% 继续找
			   do_random_players(N, Sex, NextKey, StopKey, Acc)
		   end
	    end;
	_ -> %% 读不到记录
	    FirstPlayer = first_player(),
	    case (FirstPlayer == '$end_of_table') of
		true ->
		    {FirstPlayer, Acc};
		_ ->
		    do_random_players(N, Sex, FirstPlayer, FirstPlayer, Acc)
	    end
    end;
do_random_players(_N, _Sex, Key, _StopKey, Acc) ->
    %% 找到N个了，返回
    {Key, Acc}.


%%%===================================================================
%%% 测试代码
%%%===================================================================

-ifdef(TEST).
-include_lib("eunit/include/eunit.hrl").
     
sex_test() ->
    ?assertEqual(?st_girl, get_opposite_sex(?st_boy)),
    ?assertEqual(?st_boy, get_opposite_sex(?st_girl)),
    ok.

do_random_test() ->
    ?assertEqual({key, []}, do_random_players(-1, 1, key)),
    ?assertEqual({key, []}, do_random_players(-0, 1, key)),
    
    ok.

-endif.
    



