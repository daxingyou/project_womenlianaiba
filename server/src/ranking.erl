%%%-------------------------------------------------------------------
%%% @author linyijie <linyj@35info.cn>
%%% @copyright (C) 2012, linyijie
%%% @doc
%%%  排行榜
%%% @end
%%% Created : 26 Jun 2012 by linyijie <linyj@35info.cn>
%%%-------------------------------------------------------------------
-module(ranking).

-include("house_data.hrl").
-include("packet_def.hrl").
-include("router.hrl").
-include("enum_def.hrl").

-export([start/1, init/1, start_score_lottery_ranking/2]).
-compile(export_all).

-define(level, 1).      %% 等级
-define(decoration, 2). %% 装饰度， 豪华度
-define(male_charm, 3). %% 男性魅力值
-define(female_charm, 4). %% 女性魅力值
-define(score_lottery, 5).%% 积分
-define(attention, 6).    %% 被关注排行版

-record(level_ranking, {account, ranking, level}).
-record(decoration_ranking, {account, ranking, decoration}).
-record(male_charm_ranking, {account, ranking}).
-record(female_charm_ranking, {account, ranking}).
-record(attention_ranking, {account, ranking}).
-record(common_ranking, {type, accounts}).


start_ranking() ->
    spawn(ranking, init, [self()]).

init(_From) ->
    start_level_ranking(),
    start_charm_ranking(),
    start_attention_ranking().


%%  等级排行
start_level_ranking() ->
    F = fun(#house_data{exp = Exp, decoration=Decoration, boy=Boy, girl=Girl}, L1) ->
		L2 = case Boy /= '' of
			    true -> [{Boy, Exp, Decoration} | L1];
			    false -> L1
			end,
		L3 = case Girl /= '' of
			    true -> [{Girl, Exp, Decoration} | L2];
			    false -> L2
			end,
		L3
	end,
    L = db:sync_dirty(fun() -> mnesia:foldl(F, [], house_data) end),
    data_helper:format("ranking sort ok!~n"),
    F1 = fun(Account, Exp, Ranking) -> 
		 Level = house_level_exp:get_level(Exp),
		 #level_ranking{account=Account, ranking=Ranking, level=Level} 
	 end,
    save_ranking(?level, F1, [{Acc, Exp} || {Acc, Exp, _} <- L ]),
    F2 = fun(Account, D, Ranking) -> #decoration_ranking{account=Account, ranking=Ranking, decoration=D} end,
    LLL = [{Acc, Decoration} || {Acc, _, Decoration} <- L ],
    save_ranking(?decoration, F2, LLL),
    data_helper:format("save ranking ok!~n").

%% 魅力排行榜
start_charm_ranking() ->
    F = fun(PlayerData, {MaleList, FemaleList}) ->
		Account = player_basic_data:get_account(PlayerData),
		Charm = player_basic_data:get_charm(PlayerData),
		case player_basic_data:get_sex(PlayerData) of
		    ?st_boy ->
			{[{Account, Charm} | MaleList], FemaleList};
		    _ ->
			{MaleList, [{Account, Charm} | FemaleList]}
		end
	end,
    {MaleL, FemaleL} = db:sync_dirty(fun() -> mnesia:foldl(F, {[], []}, player_basic_data) end),
    data_helper:format("charm ranking sort ok!~n"),
    charm_ranking(MaleL, ?male_charm, 
		  fun(Acc, Ranking) -> #male_charm_ranking{account=Acc, ranking=Ranking} end),
    charm_ranking(FemaleL, ?female_charm, 
		  fun(Acc, Ranking) -> #female_charm_ranking{account=Acc, ranking=Ranking} end),
    data_helper:format("charm save ranking ok!~n").

charm_ranking(L, Type, F) ->
    L1 = lists:sort(fun({_, Charm1}, {_, Charm2}) -> Charm1 > Charm2  end, L),
    F1 = fun({Account, _Charm}, Ranking) ->
		 mnesia:dirty_write(F(Account, Ranking)),
		 Ranking+1
	 end,
    lists:foldl(F1, 1, L1),

    L3 = get_top(L1, 50, []),
    Accounts = [#ranking_data{account=A, data=C} || {A, C}<- L3], 
    mnesia:dirty_write(#common_ranking{type=Type, accounts=Accounts}),
    ok.

%% 被关注排行榜
start_attention_ranking() ->
    F = fun(Attention, L) ->
		Account = attention:get_account(Attention),
		Count = attention:get_count(Attention),
		[{Account, Count} | L]
	end,
    L1 = db:sync_dirty(fun() -> mnesia:foldl(F, [], attention) end),
    data_helper:format("attention ranking sort ok!~n"),

    L2 = lists:sort(fun({_, Count1}, {_, Count2}) -> Count1 > Count2  end, L1),
    F1 = fun({Account, _Count}, Ranking) ->
		 mnesia:dirty_write(#attention_ranking{account=Account, ranking=Ranking}),
		 Ranking+1
	 end,
    lists:foldl(F1, 1, L2),

    L3 = get_top(L2, 50, []),
    Accounts = [#ranking_data{account=A, data=C} || {A, C}<- L3], 
    mnesia:dirty_write(#common_ranking{type=?attention, accounts=Accounts}),

    data_helper:format("attention save ranking ok!~n").

%% 积分排行榜
start_score_lottery_ranking(Account, Score) ->
    L = case db:transaction(fun() -> db:read(common_ranking, ?score_lottery) end) of
	    [] -> [#ranking_data{account=Account, data=Score}];
	    [#common_ranking{accounts=LL}] -> 
		L1 = sort_score(Account, Score, LL),
		L2 = [R || R <- L1, R#ranking_data.data > 0],
		get_top(L2, 10, [])
	end,
    mnesia:dirty_write(#common_ranking{type=?score_lottery, accounts=L}).

sort_score(Account, Score, L) ->
    %% 会根据时间的优先顺序进行排序, 新的数据时间上肯定是比已经存在列表中的数据的时间要晚的
    case lists:keydelete(Account, #ranking_data.account, L) of
	[] -> [#ranking_data{account=Account, data=Score}];
	L1 ->
	    L2 = lists:usort(fun(#ranking_data{data=D1}, #ranking_data{data=D2}) ->  D1 < D2 end, 
			     L1 ++ [#ranking_data{account=Account, data=Score}]),
	    lists:reverse(L2)
    end.

save_ranking(Type, Fun, L) ->
    L1 = lists:sort(fun({_, Data1}, {_, Data2}) -> Data1 > Data2  end, L),
    F1 = fun({Account, Data}, Ranking) ->
		 mnesia:dirty_write(Fun(Account, Data, Ranking)),
		 Ranking+1
	 end,
    lists:foldl(F1, 1, L1),
    save_to_common_ranking(Type, get_top(L1, 50, [])).
    

get_top([], _, Top) -> 
    lists:reverse(Top);
get_top(_, 0, Top) -> 
    lists:reverse(Top);
get_top([Data | Rest], Limit, Top) ->
    get_top(Rest, Limit -1, [Data | Top]).

save_to_common_ranking(?level, Accounts) ->
    Accounts1 = [#ranking_data{account=A, data=house_level_exp:get_level(Exp)} || {A, Exp} <- Accounts],
    mnesia:dirty_write(#common_ranking{type=?level, accounts=Accounts1});
save_to_common_ranking(Type, Accounts) ->
    Accounts1 = [#ranking_data{account=A, data=Data} || {A, Data} <- Accounts],
    mnesia:dirty_write(#common_ranking{type=Type, accounts=Accounts1}).

%% -------- 处理网络请求------------------------------------------------------------
start(Account) ->
    [router:make_event_source(?msg_req_ranking, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_score_ranking, Account, {Account, ?MODULE})
    ].

%% 请求获得排行榜
handle_cast({#msg{src=Account}, #req_ranking{type=Type}}, PlayerData) ->
    do_req_ranking(Account, Type),
    {noreply, PlayerData};
handle_cast({#msg{src=Account}, #req_score_ranking{}}, PlayerData) ->
    do_req_score_ranking(Account),
    {noreply, PlayerData}.

do_req_score_ranking(Account) ->
    L1 = case db:dirty_read(common_ranking, ?score_lottery) of
	     [] -> [];
	     [#common_ranking{accounts=Accounts}] -> Accounts
	 end,
    Score = score_lottery:read(Account),
    send_score_ranking(Account, Score, L1).

send_score_ranking(Account, Score, L) ->
    Packet = #notify_score_ranking{self_score=Score, data=L},
    net_helper:send2client(Account, Packet).

do_req_ranking(Account, Type) ->
    Ranking1 = case db:dirty_read(get_table_name(Type), Account) of
		   [] -> -1; %% 统计数据每天定时执行， 所以新进入的玩家会看不到自己的排名
		   [#level_ranking{ranking=Ranking}] -> Ranking;
		   [#decoration_ranking{ranking=R}] -> R;
		   [#male_charm_ranking{ranking=R1}] -> R1;
		   [#female_charm_ranking{ranking=R2}] -> R2;
		   [#attention_ranking{ranking=R3}] -> R3
	       end,
    Packet = case db:dirty_read(common_ranking, Type) of
		 [] -> 
		     #notify_ranking{type=Type, self_ranking=Ranking1, data=[]};
		 [Record] ->
		     #notify_ranking{type=Type, self_ranking=Ranking1, data=Record#common_ranking.accounts}
	     end,
    net_helper:send2client(Account, Packet).

get_table_name(?level) ->
    level_ranking;
get_table_name(?decoration) ->
    decoration_ranking;
get_table_name(?male_charm) ->
    male_charm_ranking;
get_table_name(?female_charm) ->
    female_charm_ranking;
get_table_name(?attention) ->
    attention_ranking.


-ifdef(TEST).
-include_lib("eunit/include/eunit.hrl").

sort_score_test() ->
    ?assertEqual([#ranking_data{account=a,data=10}], 
		 sort_score(a, 10, [])),
    ?assertEqual([#ranking_data{account=a,data=10}], 
		 sort_score(a, 10, [#ranking_data{account=a, data=5}])),
    ?assertEqual([#ranking_data{account=a,data=5}, #ranking_data{account=b,data=5}], 
		 sort_score(b, 5, [#ranking_data{account=a, data=5}])),
    ?assertEqual([#ranking_data{account=c, data=15},
    		  #ranking_data{account=a, data=10},
    		  #ranking_data{account=b, data=10}],
    		 sort_score(b, 10, [#ranking_data{account=c, data=15},
    				    #ranking_data{account=a, data=10},
    				    #ranking_data{account=b, data=5}])),

    ?assertEqual([#ranking_data{account=c, data=15},
		  #ranking_data{account=d, data=15},
    		  #ranking_data{account=a, data=10},
		  #ranking_data{account=b, data=5}],
    		 sort_score(d, 15, [#ranking_data{account=c, data=15},
    				    #ranking_data{account=a, data=10},
    				    #ranking_data{account=b, data=5}])),

    ?assertEqual([#ranking_data{account=b,data=10}, #ranking_data{account=a,data=5}], 
    		 sort_score(b, 10, [#ranking_data{account=a, data=5}])),
    ?assertEqual([#ranking_data{account=a,data=5}, #ranking_data{account=b,data=3}], 
    		 sort_score(b, 3, [#ranking_data{account=a, data=5}])),
    ok.

-endif.
