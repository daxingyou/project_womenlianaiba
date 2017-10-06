%%% @author lyj <lyj@35info.cn>
%%% @copyright (C) 2010, lyj
%%% @doc
%%%  统计的功能模块
%%% @end
%%% Created : 16 Dec 2010 by lyj <lyj@35info.cn>
-module(statistics).

-behaviour(gen_server).

%% API
-export([start_link/0]).

%% gen_server callbacks
-export([init/1, handle_call/3, handle_cast/2, handle_info/2,
	 terminate/2, code_change/3]).

-export([buy_item/3, add_money/3]).

-export([count_player/0, count_house/0, count_await_player/0, 
	 count_yesterday_login/0, count_player_task/0]).

-export([basal/0]).

%% -record(stat,
%% 	{who,
%% 	 datas = gb_trees:empty()
%% 	}               
%%        ).  

-define(SERVER, ?MODULE). 
-include("house_data.hrl").
-include("register.hrl").
-include("enum_def.hrl").
-include("packet_def.hrl").
-include("player_data.hrl").
-include("player_task.hrl").
%%%===================================================================
%%% API
%%%===================================================================
%% 统计购买物品数量
-spec buy_item(atom(), pos_integer(), pos_integer()) -> ok.
buy_item(Account, ItemID, Count) ->
    gen_server:cast(?SERVER, {buy_item, Account, ItemID, Count}),
    ok.

-spec add_money(atom(), pos_integer(), pos_integer()) -> ok.
add_money(Account, Type, Count) ->
    gen_server:cast(?SERVER, {add_money, Account, Type, Count}),
    ok.
-spec count_player() -> {integer(), integer()}.    
count_player()->
    F = fun(#pair_player{sex=Sex, lover_account=Lover}, {CopulativeMale, CopulativeFemale, SingleMale, SingleFemale}) -> 
	       case {Sex, Lover} of 
		   {1, ''} -> 
		       {CopulativeMale, CopulativeFemale, SingleMale+1, SingleFemale}; 
		   {2, ''} -> 
		       {CopulativeMale, CopulativeFemale, SingleMale, SingleFemale+1}; 
		   {1, _Lover} ->
		       {CopulativeMale+1, CopulativeFemale, SingleMale, SingleFemale}; 
		   {2, _Lover}->
		       {CopulativeMale, CopulativeFemale+1, SingleMale, SingleFemale}
	       end 
	end,
    db:transaction(fun() -> mnesia:foldl(F, {0, 0, 0, 0}, pair_player) end).

-spec count_house() -> {integer(), integer(), integer()}.    
count_house()->
    F = fun(#house_data{boy=Boy, girl=Girl}, {Both, Male, Female}) -> 
		case {Boy, Girl} of 
		   {Boy, ''} -> 
			{Both, Male+1, Female}; 
		    {'', Girl} -> 
		       {Both, Male, Female+1};
		    {Boy, Girl} ->
		       {Both+1, Male, Female}
		end 
	end,
    db:transaction(fun() -> mnesia:foldl(F, {0, 0, 0}, house_data) end).

count_await_player()->
    F = fun(#pair_info{openid=Account, gender=Gender}, {Male, Female}) -> 
		case Gender of 
		   1 -> 
			{Male+1, Female}; 
		   2 -> 
			{Male, Female+1};
		    [231,148,183] -> 
			{Male+1, Female}; 
		    [229,165,179] -> 
			{Male, Female+1};
		    _->
			case db_pair_player:get_sex(Account) of
			    ?st_boy->
				{Male+1, Female}; 
			    ?st_girl->
				{Male, Female+1};
			    _->
				{Male+1, Female}
			end
		end 
	end,
    db:transaction(fun() -> mnesia:foldl(F, {0, 0}, pair_info) end).

basal()->
    Conn = mongodb_services:get_connection(),
    Today = date(),
    {Year, Month, Day} = Today,
    
    {PairHouse, BoyHouse, GirlHouse} = count_house(),
    HouseStat = {t, PairHouse +  BoyHouse + GirlHouse, p, PairHouse, b, BoyHouse, g, GirlHouse}, 
    mongodb_services:insert(Conn, statistics_house, HouseStat),
    write_satitics_file("/data/stat/house.csv", 
			util:string_format("\n~w-~w-~w,~w,~w,~w,~w",
					   [Year, Month, Day,
					   PairHouse +  BoyHouse + GirlHouse, PairHouse, BoyHouse, GirlHouse])),
    
    {CopulativeMale, CopulativeFemale, SingleMale, SingleFemale} = count_player(),
    PlayerStat = {t, CopulativeMale+CopulativeFemale+SingleMale+SingleFemale, 
		 b, CopulativeMale+SingleMale,
		 g, CopulativeFemale+SingleFemale,
		 p, CopulativeMale+CopulativeFemale, 
		 s, SingleMale+SingleFemale,
		 sb, SingleMale,
		 sg, SingleFemale}, 
    mongodb_services:insert(Conn, statistics_await, PlayerStat),
    write_satitics_file("/data/stat/player.csv", 
			util:string_format("\n~w-~w-~w,~w,~w,~w,~w,~w,~w,~w",
					   [Year, Month, Day
					   ,CopulativeMale+CopulativeFemale+SingleMale+SingleFemale
					   ,CopulativeMale+SingleMale
					   ,CopulativeFemale+SingleFemale
					   ,CopulativeMale+CopulativeFemale
					   ,SingleMale+SingleFemale
					   ,SingleMale
					   ,SingleFemale])),

    {BoyWaiting, GirlWaiting} = count_await_player(),
    AwaitStat = {t, BoyWaiting + GirlWaiting, b, BoyWaiting, g, GirlWaiting}, 
    mongodb_services:insert(Conn, statistics_await, AwaitStat),
    write_satitics_file("/data/stat/await.csv", 
			util:string_format("\n~w-~w-~w,~w,~w,~w",
					   [Year, Month, Day,
					   BoyWaiting + GirlWaiting, BoyWaiting, GirlWaiting])),
    ok.

write_satitics_file(FileName, Data)->
    case filelib:is_file(FileName) of
	true ->
	    case file:read_file_info(FileName) of
		{ok, _FileInfo} ->
		    file:write_file(FileName, Data, [append]);
		Error ->
		    Error
	    end;
	false ->
	    {ok, FileRef} = file:open(FileName, [append]),    
	    file:write(FileRef, Data),
	    file:close(FileRef)
    end.

count_yesterday_login() ->
    Now = datetime:localtime(),
    F = fun({player_login_reward, _Account, LoginInfo}, TotalLoginCount) ->
		case lists:foldl(fun({player_login_info, LoginDate, _RewardDate}, IsLogin) ->
				    (datetime:diff_date(LoginDate, Now) == 86400) or IsLogin
			    end, false, LoginInfo) of
		    true ->
			TotalLoginCount + 1;
		    false ->
			TotalLoginCount
		end
	end,
    LoginCount = db:transaction(fun() -> mnesia:foldl(F, 0, player_login_reward) end),
    {stime, Y, M, D, _, _, _} = datetime:dec_time(Now, 86400),
    write_satitics_file("/data/stat/yesterday_login_count.csv", 
			util:string_format("\n~w-~w-~w, ~w", [Y, M, D, LoginCount])).

count_player_task() ->
    TaskIds = [{20000, 0},
	       {20001, 0}, 
	       {20002, 0}, 
	       {20003, 0}, 
	       {20004, 0}, 
	       {20005, 0}, 
	       {20006, 0}, 
	       {20007, 0}, 
	       {20008, 0}, 
	       {20009, 0}, 
	       {20010, 0},
	       {20015, 0},
	       {20014, 0},
	       {20013, 0},
	       {20018, 0},
	       {20020, 0},
	       {20030, 0},
	       {10011, 0},
	       {20043, 0},
	       {20044, 0},
	       {20046, 0},
	       {20045, 0},
	       {20034, 0},
	       {20017, 0},
	       {20016, 0},
	       {20022, 0},
	       {20029, 0},
	       {20023, 0},
	       {20025, 0},
	       {20027, 0},
	       {20031, 0},
	       {20032, 0},
	       {20033, 0},
	       {20011, 0},
	       {20012, 0},
	       {10007, 0},
	       {20036, 0},
	       {20019, 0},
	       {20021, 0},
	       {20038, 0},
	       {20039, 0},
	       {20040, 0},
	       {20041, 0},
	       {20037, 0},
	       {20049, 0}],

    #stime{year=Y, month=M, day=D} = datetime:localtime(),
    Key = mnesia:dirty_first(player_task),
    NTaskIds = calc_task_count(Key, TaskIds),
    FileName = "/data/stat/player_task.csv",
    case filelib:is_file(FileName) of
	true ->
	    ok;
	false ->
	    {ok, FileRef} = file:open(FileName, [append]),    
	    file:write(FileRef, "date, 20000, 20001, 20002, 20003, 20004, 20005, 20006, 20007, 20008, 20009, 20010, 20011"),
	    file:close(FileRef)
    end,
    write_satitics_file(FileName,
			util:string_format("\n~w-~w-~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w, ~w", 
					   [Y, M, D] ++ [Count || {_, Count} <- NTaskIds])).

calc_task_count(Key, TaskIds) when Key == '$end_of_table' ->
    TaskIds;
calc_task_count(Key, TaskIds) ->
    [PlayerTask] = mnesia:dirty_read(player_task, Key),
    GiveChainTasks = chain_task:get_chain_tasks(PlayerTask),
    GiveTaskIds = [TaskId || #task{task_id=TaskId}<- GiveChainTasks],
    NTaskIds = find_and_replace_task_count(GiveTaskIds, TaskIds),
    calc_task_count(mnesia:dirty_next(player_task, Key), NTaskIds).

find_and_replace_task_count([], TaskIds) ->
    TaskIds;
find_and_replace_task_count([TaskId|Tasks], TaskIds) ->
    NTaskIds = find_and_replace_task_count(TaskId, TaskIds),
    find_and_replace_task_count(Tasks, NTaskIds);
find_and_replace_task_count(TaskId, TaskIds) when is_integer(TaskId) ->
    case lists:keyfind(TaskId, 1, TaskIds) of
	false ->
	    TaskIds;
	{Id, Count} ->
	    NCount = Count + 1,
	    lists:keyreplace(TaskId, 1, TaskIds, {Id, NCount})
    end.
%%--------------------------------------------------------------------
%% @doc
%% Starts the server
%%
%% @spec start_link() -> {ok, Pid} | ignore | {error, Error}
%% @end
%%--------------------------------------------------------------------
start_link() ->
    gen_server:start_link({local, ?SERVER}, ?MODULE, [], []).

%%%===================================================================
%%% gen_server callbacks
%%%===================================================================

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Initializes the server
%%
%% @spec init(Args) -> {ok, State} |
%%                     {ok, State, Timeout} |
%%                     ignore |
%%                     {stop, Reason}
%% @end
%%--------------------------------------------------------------------
init([]) ->
    %% TODO: 读取数据
    %% TODO: 定时写入数据
    {ok, gb_trees:empty()}.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Handling call messages
%%
%% @spec handle_call(Request, From, State) ->
%%                                   {reply, Reply, State} |
%%                                   {reply, Reply, State, Timeout} |
%%                                   {noreply, State} |
%%                                   {noreply, State, Timeout} |
%%                                   {stop, Reason, Reply, State} |
%%                                   {stop, Reason, State}
%% @end
%%--------------------------------------------------------------------
handle_call(_Request, _From, State) ->
    Reply = ok,
    {reply, Reply, State}.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Handling cast messages
%%
%% @spec handle_cast(Msg, State) -> {noreply, State} |
%%                                  {noreply, State, Timeout} |
%%                                  {stop, Reason, State}
%% @end
%%--------------------------------------------------------------------
handle_cast({buy_item, Account, ItemID, Count}, State) ->
    Datas = find_datas(Account, State),
    NDatas = change_datas(fun do_buy_item/2, buy_item, {ItemID, Count}, Datas),
    {noreply, update_state(Account, NDatas, State)};

handle_cast({add_money, Account, Type, Count}, State) ->
    Datas = find_datas(Account, State),
    NDatas = change_datas(fun do_add_money/2, add_money, {Type, Count}, Datas),
    {noreply, update_state(Account, NDatas, State)};
handle_cast(_Msg, State) ->
    {noreply, State}.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Handling all non call/cast messages
%%
%% @spec handle_info(Info, State) -> {noreply, State} |
%%                                   {noreply, State, Timeout} |
%%                                   {stop, Reason, State}
%% @end
%%--------------------------------------------------------------------
handle_info(_Info, State) ->
    {noreply, State}.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% This function is called by a gen_server when it is about to
%% terminate. It should be the opposite of Module:init/1 and do any
%% necessary cleaning up. When it returns, the gen_server terminates
%% with Reason. The return value is ignored.
%%
%% @spec terminate(Reason, State) -> void()
%% @end
%%--------------------------------------------------------------------
terminate(_Reason, _State) ->
    ok.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Convert process state when code is changed
%%
%% @spec code_change(OldVsn, State, Extra) -> {ok, NewState}
%% @end
%%--------------------------------------------------------------------
code_change(_OldVsn, State, _Extra) ->
    {ok, State}.

%%%===================================================================
%%% Internal functions
%%%===================================================================
do_buy_item({ItemID, Count}=Data, ItemList) -> 
    case lists:keyfind(ItemID, 1, ItemList) of 
	false -> [Data | ItemList];
	{ID, C} -> lists:keyreplace(ID, 1, ItemList, {ID, Count + C})
    end.


do_add_money({Type, Count}=Data, AddList) -> 
    case lists:keyfind(Type, 1, AddList) of 
	false -> [Data | AddList];
	{_T, C} -> lists:keyreplace(Type, 1, AddList, {Type, Count + C})
    end.

change_datas(Fun, Type, Data, Datas) ->
    case lists:keyfind(Type, 1, Datas) of
	false ->
	    [{Type, [Data]} | Datas];
	{_Key, Val} ->
	    NVal = Fun(Data, Val),
	    lists:keyreplace(Type, 1, Datas, {Type, NVal})
    end.

find_datas(Who, State) ->
    case gb_trees:lookup(Who, State) of
	none ->
	    [];
	{value, Val} ->
	    Val
    end.

update_state(Who, Datas, State) ->
    gb_trees:enter(Who, Datas, State).


-include_lib("eunit/include/eunit.hrl").
-ifdef(TEST).

do_buy_item_test() ->
    ?assertEqual([{1, 1}], do_buy_item({1, 1}, [])),
    ?assertEqual([{2, 2}, {1, 1}], do_buy_item({2, 2}, [{1, 1}])),
    ?assertEqual([{1, 3}], do_buy_item({1, 2}, [{1, 1}])),
    ok.

do_add_money_test() ->
    ?assertEqual([{work, 1}], do_add_money({work, 1}, [])),
    ?assertEqual([{farm, 2}, {work, 1}], do_buy_item({farm, 2}, [{work, 1}])),
    ?assertEqual([{work, 3}], do_buy_item({work, 2}, [{work, 1}])),
    ok.

-endif.  


