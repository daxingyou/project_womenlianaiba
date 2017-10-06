%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@china-channel.com>
%%% @copyright (C) 2010, linyibin
%%% @doc
%%% 房屋设置
%%% @end
%%% Created :  4 Aug 2010 by linyibin <linyb@china-channel.com>
%%%-------------------------------------------------------------------
-module(player_house).

-include("router.hrl").
-include("enum_def.hrl").
-include("packet_def.hrl").
-include("common_def.hrl").
-include("sys_msg.hrl").
-include("player_data.hrl").
-include("house_data.hrl").
-include("records.hrl").

%% API
-export([start/1]).
-export([handle_cast/2]).
-export([test/0]).

%%%===================================================================
%%% API
%%%===================================================================
start(Account) ->
    [
     router:make_event_source(?msg_req_set_house_welcome_words, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_set_house_permission, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_clear_house_log, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_house_guest_book, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_house_visit_log, Account, {Account, ?MODULE}),
     %% router:make_event_source(?msg_req_guest_book_forbidden, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_guest_book_delete, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_guest_book_clear, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_guest_book_add, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_checkin_add, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_last_checkins, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_checkin_delete, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_house_visit_log_add, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_checkin_list, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_update_house_name, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_set_guest_book_opened, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_set_checkin_opened, Account, {Account, ?MODULE})
    ].

%%%===================================================================
%%% Handle cast
%%%===================================================================
%% 请求清空房屋日志
handle_cast({_Msg, #req_clear_house_log{}}, State) ->
    Account = player_data:get_account(State),
    F = fun() ->
		[PlayerBasicData] = db:read(player_basic_data, Account),
		HouseID = player_basic_data:get_house_id(PlayerBasicData),
		[HouseData] = db:read(house_data, HouseID),
		NHouseData = player_house_log:clear(HouseData),
		ok = db:write(NHouseData)
	end,
    db:transaction(F),
    net_helper:send2client(Account, #notify_clear_house_log{result=1}),
    {noreply, State};
%% 请求设置房屋欢迎词
handle_cast({_Msg, #req_set_house_welcome_words{words=Words}}, State) ->
    Account = player_data:get_account(State),
    F = fun() ->
		[PlayerBasicData] = db:read(player_basic_data, Account),
		HouseId = player_basic_data:get_house_id(PlayerBasicData),
		[HouseData] = db:read(house_data, HouseId),
		case can_setting(Words, 128) of
		    true ->
			NHouseData = HouseData#house_data{welcome_words=Words},
			db:write(NHouseData);
		    Reason ->
			Reason
		end
	end,
    case db:transaction(F) of
	{false, err_words} ->
	    sys_msg:send(Account, ?err_welcome_words);
	_ ->
	    net_helper:send2client(Account, #notify_set_house_welcome_words{result=?shwwr_ok})
    end,
    {noreply, State};

%%房屋留言版
handle_cast({#msg{event=?msg_req_set_guest_book_opened}, Data}, State) ->
    SceneName = player_data:get_scene_name(State),
    Return = router:send(SceneName, set_guest_book_opened, Data),
    Account = player_data:get_account(State),
    net_helper:send2client(Account, Return),
    {noreply, State};

handle_cast({#msg{event=?msg_req_guest_book_add}, Data}, State) ->
    SceneName = player_data:get_scene_name(State),   
    {{GuestBook, {Boy, BoyAtHome}, {Girl, GirlAtHome}}, DeletedList} = router:send(SceneName, guest_book_add, Data),
    Account = player_data:get_account(State),
    net_helper:send2client(Account, GuestBook),
    [net_helper:send2client(Account, #notify_guest_book_delete{result=1, id=Deleted#guest_book.id}) || Deleted  <-DeletedList],
    case Account of 
	Boy->
	    house_guest_book:notify_guest_book_add({Girl, GirlAtHome}, #notify_new_guest_book{});
	Girl->
	    house_guest_book:notify_guest_book_add({Boy, BoyAtHome}, #notify_new_guest_book{});
	_->
	    house_guest_book:notify_guest_book_add({Girl, GirlAtHome}, #notify_new_guest_book{}),
	    house_guest_book:notify_guest_book_add({Boy, BoyAtHome}, #notify_new_guest_book{})
    end,
    {noreply, State};

handle_cast({#msg{event=?msg_req_guest_book_clear}, Data}, State) ->
    SceneName = player_data:get_scene_name(State),
    Return = router:send(SceneName, guest_book_clear, Data),
    Account = player_data:get_account(State),
    net_helper:send2client(Account, Return),
    {noreply, State};

handle_cast({#msg{event=?msg_req_house_guest_book}, Data}, State) ->
    SceneName = player_data:get_scene_name(State),
    Account = player_data:get_account(State),
    Return = router:send(SceneName, house_guest_book, {Data, Account}),
    net_helper:send2client(Account, Return),
    {noreply, State};

handle_cast({#msg{event=?msg_req_house_visit_log}, Data}, State) ->
    SceneName = player_data:get_scene_name(State),
    Return = router:send(SceneName, house_visit_log, Data),
    Account = player_data:get_account(State),
    net_helper:send2client(Account, Return),
    {noreply, State};

handle_cast({#msg{event=?msg_req_house_visit_log_add}, Data}, State) ->
    SceneName = player_data:get_scene_name(State),
    Account = player_data:get_account(State),
    router:cast(SceneName, house_visit_log_add, Data),
    net_helper:send2client(Account, #notify_house_visit_log_add{}),
    {noreply, State};


%% handle_cast({{#msg{event=?msg_req_guest_book_forbidden}, Data}, State) ->
    %% SceneName = player_data:get_scene_name(State),
    %% router:send(SceneName, guest_book_forbidden, Data),
%%     {noreply, State};

handle_cast({#msg{event=?msg_req_guest_book_delete}, Data}, State) ->
    SceneName = player_data:get_scene_name(State),
    Return = router:send(SceneName, guest_book_delete, Data),
    Account = player_data:get_account(State),
    net_helper:send2client(Account, Return),
    {noreply, State};

%% 签到系统
handle_cast({#msg{event=?msg_req_set_checkin_opened}, #req_set_checkin_opened{id=ID, opened=Opened}}, State) ->
    Account = player_data:get_account(State),
    player_checkin:set_checkin_opened(ID, Opened),
    net_helper:send2client(Account, #notify_set_checkin_opened{id=ID, opened=Opened}),
    {noreply, State};

handle_cast({#msg{event=?msg_req_checkin_add}, Data}, State) ->
    SceneName = player_data:get_scene_name(State),
    {CheckIn, Lover} = router:send(SceneName, checkin_add, Data),
    Account = player_data:get_account(State),
    net_helper:send2client(Account, #notify_checkin_add{item=CheckIn}),
    net_helper:send2client(Lover, #notify_new_checkin{}),
    {noreply, State};

handle_cast({#msg{event=?msg_req_last_checkins}, Data}, #player_data{account=Account}=State) ->
    SceneName = player_data:get_scene_name(State),
    router:send(SceneName, last_checkins, Data),
    Result = router:send(SceneName, last_checkins, Data),
    net_helper:send2client(Account, Result),
    {noreply, State};

handle_cast({#msg{event=?msg_req_checkin_delete}, Data}, #player_data{account=Account}=State) ->
    SceneName = player_data:get_scene_name(State),
    Result = router:send(SceneName, checkin_delete, Data),
    case Result of 
	{ok, ID}->
	    net_helper:send2client(Account, #notify_checkin_delete{result=1, id=ID});
	_->
	    net_helper:send2client(Account, #notify_checkin_delete{result=0})
    end,
    {noreply, State};

handle_cast({#msg{event=?msg_req_checkin_list}, Data}, #player_data{account=Account}=State) ->
    SceneName = player_data:get_scene_name(State),
    CheckIns = router:send(SceneName, checkin_list, {Account, Data}),
    net_helper:send2client(Account, #notify_checkin_list{checkins=CheckIns}),
    {noreply, State};
handle_cast({#msg{event=?msg_req_update_house_name}, Data}, #player_data{account=Account}=State) ->
    SceneName = player_data:get_scene_name(State),
    Return = router:send(SceneName, update_house_name, Data),
    net_helper:send2client(Account, Return),
    {noreply, State}.


%%%===================================================================
%%% Internal functions
%%%===================================================================
%% 能否设置
-spec can_setting(list(), integer()) -> tuple() | atom().
can_setting(Words, MaxLength)  
  when is_list(Words), is_integer(MaxLength)->
    Func = fun(Content) ->
		   util:length(Content) =< MaxLength
	   end,
    action:can_do([{Func, Words, err_words}]).


%%%===================================================================
%%% Test case
%%%===================================================================
test() ->
    router:cast(test1, ?msg_req_set_house_welcome_words, #req_set_house_welcome_words{words="1234567890"}),
    router:cast(test1, ?msg_req_set_house_permission, #req_set_house_permission{house_permission=?hpt_friend,
										furniture_permission=?fpt_no}),
    router:cast(test1, ?msg_req_clear_house_log, #req_clear_house_log{}).


-include_lib("eunit/include/eunit.hrl").
-ifdef(TEST).

can_setting_test() ->
    ?assertEqual(true, can_setting("1111111111", 128)),
    ?assertEqual({false, err_words}, can_setting("12345", 4)),
    ?assertEqual(true, can_setting("1234", 4)),
    ?assertEqual(true, can_setting("123", 4)).

-endif.
