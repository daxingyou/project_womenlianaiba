%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%   等级报告
%%% @end
%%% Created : 23 May 2012 by hongjx <hongjx@35info.cn>

-module(level_report).

-include("packet_def.hrl").


-export([run/0]).
-export([save_all_players/0]).
-export([save_all_players/1]).


-define(LEVEL_FILTER, 7).



save_all_players({{_Y, _M, _D}, {_H, _N, _S}}=RunTime) ->
    S = datetime:diff_time(datetime:local_time(), RunTime),
    timer:apply_after(S * 1000, level_report, save_all_players, []).

%% 保存所有玩家，因数据量比较大，文件先打开
save_all_players() ->
    FileName = ensure_dir() ++ "/" ++ "all_player" ++ ".csv",
    {ok, FileRef} = file:open(FileName, [write]),  
    OldTime = datetime:local_time(),
    SLine = "\r\n",
    io:format("~n~n~n~n~n~n~n~n~n~n~n~nstart save all players ok.~n~n~n~n~n~n~n~n~n~n~n~n"),
    file:write(FileRef, "账号,性别,等级,最后等陆时间,名字utf8" ++ SLine),
    Tab = house_data,
    F = fun(R, Acc) ->
		Lv = house_level_exp:get_level(R),
		case house:get_owner(R) of
		    {'', B} ->
			{Date, Name} = get_date_name(B),
			write_player(FileRef, B, 2, Lv, Date, Name);
		    {A, ''} ->
			{Date, Name} = get_date_name(A),
			write_player(FileRef, A, 1, Lv, Date, Name);
		    {A, B} ->
			{DateA, NameA} = get_date_name(A),
			{DateB, NameB} = get_date_name(B),
			write_player(FileRef, A, 1, Lv, DateA, NameA), 
			write_player(FileRef, B, 2, Lv, DateB, NameB)
		end, 
		Acc
	   end,

    db:sync_dirty(fun() -> db:foldl(F, [], Tab) end),
    
    file:close(FileRef),
    io:format("~n~n~n~n~n~n~n~n~n~n~n~nsave all players ok. ~p~n~n~n~n~n~n~n~n~n~n~n~n", 
	      [datetime:diff_time(OldTime, datetime:local_time())]).

write_player(FileRef, ID, Gender, Lv, LoginDate, Name) ->
    Str = atom_to_list(ID) ++ "," 
	++ integer_to_list(Gender) ++ "," 
	++ integer_to_list(Lv) ++ ","
	++ integer_to_list(LoginDate) ++ "," 
	++ Name
	++ "\r\n",
    file:write(FileRef, Str).


%% get_login_date(A) ->
%%     case mnesia:dirty_read(player_basic_data, A) of
%% 	[] -> 20010101;
%% 	[#player_basic_data{last_login_time=STime}] ->
%% 	    case STime of
%% 		{stime,Y,M,D,_H,_N,_S} ->
%% 		    Y * 10000 + M * 100 + D;
%% 		_ ->
%% 		    20010101
%% 	    end
%%     end.

get_date_name(A) ->
    case mnesia:dirty_read(player_basic_data, A) of
	[] -> {20010101, ""};
	[#player_basic_data{last_login_time=STime, username=Name}] ->
	    case STime of
		{stime,Y,M,D,_H,_N,_S} ->
		    {Y * 10000 + M * 100 + D, Name};
		_ ->
		    {20010101, ""}
	    end
    end.
    

get_name(A) ->
    case mnesia:dirty_read(player_basic_data, A) of
	[] -> [];
	[#player_basic_data{username=Name}] ->
	    Name
    end.



%% 生成报告
run() ->    
    Tab = house_data,
    F = fun(R, Acc) ->
		Lv = house_level_exp:get_level(R),
		PairOwner = house:get_owner(R), 
		[{Lv, PairOwner, house_data:get_buy_date(R), house_data:get_exp(R), house_data:get_lover_diamond(R)} | Acc]
	end,

    L = db:sync_dirty(fun() -> db:foldl(F, [], Tab) end),
    All = calc_all(L),
    Single = calc_single(L, true),
    %% Double = calc_single(L, false),
    %% io:format("all:~p~n", [lists:sort(dict:to_list(All))]),
    %% io:format("single:~p~n", [lists:sort(dict:to_list(Single))]),
    %% io:format("double:~p~n", [lists:sort(dict:to_list(Double))]),
    CSV = get_csv(All, Single),
    File = ensure_dir() ++ "/" ++ "level_report" ++ get_date_str() ++ ".csv",
    ok = file:write_file(File, CSV),
    save_high_players(L),    
    save_new_players(L),
    save_yesterday_login_players(),
    ok.

save_yesterday_login_players() ->
    Tab = player_login_reward,
    Keys = db:dirty_all_keys(Tab),
    F = fun(Account, Acc) ->
		case player_login_reward:get_continue_login_day(Account) > 0 of
		    true -> 
			[Account | Acc];
		    _ ->
			Acc
		end
	end,

    L = lists:foldl(F, [], Keys),
    CSV = get_yesterday_login_csv(L),
    File = ensure_dir() ++ "/" ++ "yesterday_login" ++ get_date_str() ++ ".csv",
    ok = file:write_file(File, CSV),
    ok.

get_yesterday_login_csv(L) ->
    SLine = "\r\n",
    F = fun(Acc, S) ->
		S ++ atom_to_list(Acc)
		    ++ SLine		
	end,

    Report = lists:foldl(F, "账号" ++ SLine, L),
    Report.


save_new_players(L) ->
    News = lists:usort(fun(A, B) -> element(1, A) =< element(1, B) end, calc_new_players(L)),
    CSV = get_new_players_csv(News),
    File = ensure_dir() ++ "/" ++ "new_players" ++ get_date_str() ++ ".csv",
    ok = file:write_file(File, CSV),
    ok.

calc_new_players(L) ->
    Today = datetime:make_time({datetime:date(), {0, 0, 0}}),
    Yesterday = datetime:dec_time(Today, 60 * 60 * 24),

    F = fun({Lv, PairOwner, BuyDate, _Exp, _Diamond}, Acc) ->
		case Yesterday =< BuyDate of %% 过虑掉大部分玩家
		    true ->
			case element(1, BuyDate) of
			    stime ->
				calc_pair_player(PairOwner, Lv, Acc, Today, Yesterday);
			    _ ->
				Acc
			end;
		    _ ->
			Acc
		end		     
	end,
    lists:foldl(F, [], L).

proc_basic_data(A, Gender, Lv, Acc, Today, Yesterday) ->
    case mnesia:dirty_read(player_basic_data, A) of
	[] -> Acc;
	[#player_basic_data{create_time=DT}] ->
	    case (Yesterday =< DT) and (DT < Today) of
		true ->
		    [{A, Gender, Lv, get_name(A)} | Acc];
		_ ->
		    Acc
	    end
    end.

%% 生成csv文件
get_new_players_csv(L) ->
    SLine = "\r\n",
    F = fun({ID, Gender, Lv,Name}, S) ->
		S ++ atom_to_list(ID) ++ "," 
		    ++ integer_to_list(Gender) ++ "," 
		    ++ integer_to_list(Lv) ++ "," 
		    ++ convert_name(Name)
		    ++ SLine		
	end,

    Report = lists:foldl(F, "账号,性别,等级,名字utf8" ++ SLine, L),
    Report.

convert_name(Name) when is_list(Name) ->
    [X || X <- Name, (X /= 10) and (X /= 13) and (X /= $,)].

calc_pair_player({'', B}, Lv, Acc, Today, Yesterday) ->
    proc_basic_data(B, 2, Lv, Acc, Today, Yesterday);
calc_pair_player({A, ''}, Lv, Acc, Today, Yesterday) ->
    proc_basic_data(A, 1, Lv, Acc, Today, Yesterday);
calc_pair_player({A, B}, Lv, Acc, Today, Yesterday) ->
    Acc1 = proc_basic_data(A, 1, Lv, Acc, Today, Yesterday),
    proc_basic_data(B, 2, Lv, Acc1, Today, Yesterday).



save_high_players(L) ->
    HighPlayers = lists:usort(fun(A, B) -> element(1, A) =< element(1, B) end, calc_high_players(L)),
    CSV = get_high_csv(HighPlayers),
    File = ensure_dir() ++ "/" ++ "high_level_player" ++ get_date_str() ++ ".csv",
    ok = file:write_file(File, CSV),
    ok.

%% 生成csv文件
get_high_csv(L) ->
    SLine = "\r\n",
    F = fun({ID, Gender, Lv, Exp, Diamond}, S) ->
		S ++ atom_to_list(ID) ++ "," 
		    ++ integer_to_list(Gender) ++ "," 
		    ++ integer_to_list(Lv) ++ ","
		    ++ integer_to_list(Exp) ++ ","
		    ++ integer_to_list(Diamond)
		    ++ SLine		
	end,

    Report = lists:foldl(F, "账号,性别,等级,经验,水晶" ++ SLine, L),
    Report.


calc_high_players(L) ->
    F = fun({Lv, {A, B}=X, _BuyDate, Exp, Diamond}, Acc) ->
		case Lv >= ?LEVEL_FILTER of
		    true ->
			case X of
			    {'', B} ->
				[{B, 2, Lv, Exp, Diamond} | Acc];
			    {A, ''} ->
				[{A, 1, Lv, Exp, Diamond} | Acc];
			    _ ->
				[{A, 1, Lv, Exp, Diamond}, {B, 2, Lv, Exp, Diamond} | Acc]
			end;
		    _ ->
			Acc	 
		end
	end,
    lists:foldl(F, [], L).


get_date_str() ->
    {Y, M, D} = datetime:date(),
    fill_zero(integer_to_list(Y)) ++ fill_zero(integer_to_list(M)) ++ fill_zero(integer_to_list(D)).

%% 生成csv文件
get_csv(All, Single) ->
    SLine = "\r\n",
    MaxLevel = lists:max(dict:fetch_keys(All)),
    F = fun(Lv, S) ->
		A = get_val(Lv, All),
		B = get_val(Lv, Single),
		C = A - B,
		S ++ integer_to_list(Lv) ++ "," ++ integer_to_list(B + C * 2) ++ "," 
		    ++ integer_to_list(C * 2) ++ "," 
		    ++ integer_to_list(A) ++ ","
		    ++ integer_to_list(B) ++ "," ++ integer_to_list(C)
		    ++ SLine		
	end,

    Report = lists:foldl(F, "等级,总玩家,情侣玩家,总房数,单人房,双人房" ++ SLine, lists:seq(1, MaxLevel)),
   
    Report ++ SLine ++ SLine 
	++ "总人数,2级以上人数" ++ SLine
	++ integer_to_list(total_user_count(All, Single)) ++ ","
	++ integer_to_list(total_user_count(All, Single, 2)).

total_user_count(All, Single) ->
    total_user_count(All, Single, 1).
total_user_count(All, Single, MinLevel) ->
    AllHouse = total_house_count(All, MinLevel),
    SingleHouse = total_house_count(Single, MinLevel),
    DoubleHouse = AllHouse - SingleHouse,
    SingleHouse + DoubleHouse * 2.

total_house_count(Dic, MinLevel) ->
    F = fun(Key, Val, N) ->
		case Key >= MinLevel of
		    true ->
			Val + N;
		    _ -> N
		end
	end,
    dict:fold(F, 0, Dic).


get_val(Lv, Dic) ->
    case dict:find(Lv, Dic) of
	{ok, Value} -> Value;
	_ -> 0
    end.


calc_single(L, Flag) ->
    F = fun({Lv, PairOwner, _BuyDate, _Exp, _Diamond}, Dic) ->
		case is_single(PairOwner) of
		    Flag ->
			case dict:find(Lv, Dic) of
			    {ok, Value} ->
				dict:store(Lv, Value + 1, Dic);
			    _ ->
				dict:store(Lv, 1, Dic)
			end;
		    _ ->
			Dic
		end
	end,
    lists:foldl(F, dict:new(), L).

calc_all(L) ->
    F = fun({Lv, _PairOwner, _BuyDate, _Exp, _Diamond}, Dic) ->
		case dict:find(Lv, Dic) of
		    {ok, Value} ->
			dict:store(Lv, Value + 1, Dic);
		    _ ->
			dict:store(Lv, 1, Dic)
		end
	end,
    lists:foldl(F, dict:new(), L).


%% 单身
is_single({_A, _B}=PairOwner) ->
    case PairOwner of
	{'', _} -> true;
	{_, ''} -> true;
	_ -> false
    end.


ensure_dir()->
    Dir = "/data/stat",
    case filelib:is_dir(Dir) of
	true->
	    ok;
	false->
	    file:make_dir("/data"),
	    file:make_dir(Dir),
	    ok
    end,
    Dir.



fill_zero(Str) ->
    case length(Str) == 1 of
	true ->
	    [$0 | Str];
	_ ->
	    Str
    end.
