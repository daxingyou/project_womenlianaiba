%%% -------------------------------------------------------------------
%%% Author  : NoteBook
%%% Description :
%%%
%%% Created : 2009-9-24
%%% -------------------------------------------------------------------
-module(player).

-behaviour(gen_msgproc).
%% --------------------------------------------------------------------
%% Include files
%% --------------------------------------------------------------------
-include("router.hrl").
-include("table_info.hrl").
-include("enum_def.hrl").
-include("common_def.hrl").
-include("sys_msg.hrl").
-include("tplt_def.hrl").
-include("packet_def.hrl").
-include("player_data.hrl").
-include("records.hrl").
-include("resource.hrl").
-include("house_data.hrl").
%% --------------------------------------------------------------------
%% External exports

%% gen_server callbacks
-export([init/1, handle_call/3, handle_cast/2, handle_info/2, terminate/2, 
	 code_change/3, register/1]).
-export([start_link/7]).

-export([get_player_simple_data/1]).

-export([do_open_ui/2, is_single/1, is_exist/1, is_boy/1, is_girl/1]).

-export([test_start/1]).

-export([shutdown_player_process/1]).

-export([yy_finish_order/1]).

-define(SAVE_DATA_TIME, 2 * 60). %%单位：秒

%%---------------------------------启动,关闭玩家------------------------------------------
%% 启动玩家
start_link(MMPid, Account, IsFirstTimeLogin, Password, LoginType, ClientIP, PFKey) 
  when is_atom(Account) ->
    data_helper:format("start player link:~n"),
    gen_msgproc:start_link({global, Account}, ?MODULE,  
			  #player_data{account=Account, 
				       mm_pid=MMPid,
				       password=Password,
				       login_type=LoginType,
				       is_first_time_login=IsFirstTimeLogin,
				       client_ip=ClientIP,
				       pf_key=PFKey,
				       walk_type=?wt_none}, 
			  []).


%% 玩家是否是单身
is_single(PlayerData) when is_record(PlayerData, player_data) ->
    PlayerData#player_data.lover == ''.

is_boy(PlayerBasicData) when is_record(PlayerBasicData, player_basic_data) ->
    Sex = PlayerBasicData#player_basic_data.sex,
    Sex == ?st_boy.

is_girl(PlayerBasicData) when is_record(PlayerBasicData, player_basic_data) ->
    Sex = PlayerBasicData#player_basic_data.sex,
    Sex == ?st_girl.

is_exist(Account) when is_atom(Account) ->
    PlayerBasicData = db:dirty_read(player_basic_data, Account),
    PlayerBasicData /= [].

yy_finish_order({UId, YYOrderId, SrvId})->
    data_helper:format("Uid:~p  OId:~p  SrvId:~p~n",[UId, YYOrderId, SrvId]),
    router:cast(list_to_atom(UId), yy_finish_order, {UId, YYOrderId, SrvId}).

%% --------------------------------------------------------------------
%% Function: init/1
%% Description: Initiates the server
%% Returns: {ok, State}          |
%%          {ok, State, Timeout} |
%%          ignore               |
%%          {stop, Reason}
%% --------------------------------------------------------------------
%% 监听指定的消息
register_player_msg(Account)->
    [
     router:make_event_source(?msg_client_ready_for_pop_msg, Account, Account),
     router:make_event_source(?msg_req_player_basic_data, Account, Account),
     router:make_event_source(?msg_req_change_person_info, Account, Account),
     router:make_event_source(?msg_req_close_person_info, Account, Account),
     router:make_event_source(?msg_req_person_info, Account, Account),
     router:make_event_source(?msg_req_open_ui, Account, Account),
     router:make_event_source(?msg_req_is_active_game, Account, Account),
     router:make_event_source(?msg_req_friend_list, Account, Account),
     router:make_event_source(?msg_req_invite_list, Account, Account),
     router:make_event_source(?msg_req_invite_someone, Account, Account),
     router:make_event_source(?msg_req_fixed_broadcast, Account, Account),
     router:make_event_source(?msg_req_platform_info, Account, Account),
     router:make_event_source(?msg_client_device_info, Account, Account),
     router:make_event_source(?msg_req_daily_visit, Account, Account),
     router:make_event_target(get_tcp_mm_pid, Account, {Account, ?MODULE}),
     router:make_event_target(get_scene_name, Account, {Account, ?MODULE}),
     router:make_event_source(show_buy_dialog, Account, Account),
     router:make_event_source(?msg_req_cancel_qq_order, Account, Account),
     router:make_event_source(scene_msg, Account, {Account, ?MODULE}),
     router:make_event_source(on_see_other_player, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_offline_notify, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_invite_active, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_invite_award, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_player_info, Account, {Account, ?MODULE}),
     router:make_event_source(yy_finish_order, Account, {Account, ?MODULE})
    ].

register(#player_data{account=Account})-> 
    data_helper:format("player register:~n"),
    mutex_actions:start(Account) ++
	player_walk:start(Account) ++
	player_edit_house:start(Account) ++
	player_change_scene:start(Account) ++
	player_use_furniture:start(Account) ++
	player_be_kick:start(Account) ++
	player_action:start(Account) ++
	register_player_msg(Account)++
	player_house:start(Account) ++
	pub:start(Account) ++
	party:start(Account) ++
	ranking:start(Account) ++
	flower:start(Account) ++
	holiday_gift:start(Account) ++
	player_lovers_pack:start(Account) ++
	player_guide:start(Account) ++	
	player_mateup:start(Account) ++	
	player_setting:start(Account) ++
	player_change_dress:start(Account) ++
	photos_make_friend:start(Account) ++
	commemoration:start(Account) ++
	attention:start(Account) ++
	player_gift:start(Account) ++
	sysshop:start(Account) ++
	player_chat:start(Account) ++
	friend_search_item:start(Account) ++
	player_wish:start(Account) ++
	props_item:start(Account) ++
	event_center:start(Account) ++
	player_task:start(Account) ++
	self_msgs:start(Account) ++
	player_move_house:start(Account) ++
	vip_gift:start(Account) ++
	npc_dialog:start(Account) ++
	daily_active_reward:start(Account) ++
	player_login_reward:start(Account) ++
	player_gm:start(Account) ++
	player_produce:start(Account) ++
	player_breakup:start(Account) ++
	score_lottery:start(Account) ++
	farm:start(Account) ++
	post_reward_task:start(Account) ++
	ring_task:start(Account) ++ 
	mind_quiz:start(Account) ++
	player_be_invite:start(Account) ++
	player_intimate:start(Account) ++
	player_payment_return:start(Account) ++
	player_item:start(Account) ++
        player_love_coin:start(Account) ++
	player_unlock_furniture:start(Account) ++
	player_exchange:start(Account) ++
	sprite:start(Account) ++ 
	player_buff:start(Account) ++
	guest:start(Account) ++
	item_upgrade:start(Account) ++ 
	player_hp:start(Account)++
	waiter:start(Account) ++
	player_food:start(Account) ++
	player_special_house:start(Account)++
	party_food:start(Account) ++
	player_charm:start(Account).


init(#player_data{account=Account, is_first_time_login=_IsFirstTimeLogin, client_ip=IP}=State) ->
    process_flag(trap_exit, true),
    data_helper:format("player start :~p, ~p~n", [Account, Account]),
    [PlayerBasicData] = db:dirty_read(player_basic_data, Account),
    HouseID = player_basic_data:get_house_id(PlayerBasicData),
    [HouseData] = db:dirty_read(house_data, HouseID),
    {NPlayerBasicData, NHouseData0} = player_change_dress:putoff_overdue_items(PlayerBasicData, HouseData),

    NHouseData = item_upgrade:gm_upgrade(NHouseData0),
    %% 需要写入NHouseData时，需要在进场景前写入，以防相互覆盖，因为进场景时还会写入一次 
    db:dirty_write(NHouseData),
    
    net_helper:send2client(Account, #notify_player_data{basic_data=NPlayerBasicData}),
    Lover = house:get_lover(Account, NHouseData),
    PlayerData = init_player_data(Account, Lover, HouseID, State),
    %% 通知共用背包和爱情水晶
    house_lover_package:notify(Account, NHouseData),
    player_unlock_furniture:notify(Account),
    mind_quiz:init(Account),
    player_love_coin:notify(Account),
    house_diamond:notify(Account, NHouseData),
    player_setting:notify(Account),
    holiday_gift:notify(Account),
    daily_active_reward:notify(Account),
    house_level_exp:notify(Account, NHouseData, NPlayerBasicData),
    self_msgs:notify(Account),
    player_mateup:send_pair_number(Account),
    waiter:notify(Account),
    player_food:settlement(Account),
    NNPlayerData = player_change_scene:enter_self_home(PlayerData, NHouseData),

    %% 处理离线消息
    send_house_warming(Account),
    %%player_basic_data:notify(Account, PlayerBasicData),
    player_gm:notify(Account),
    score_lottery:notify(Account),
    player_task:give(Account, NPlayerBasicData),
    ring_task:init(Account),
    FirstPhotoPlayer = player_basic_data:get_first_photo_player(NPlayerBasicData),
    NNNPlayerData = player_data:set_first_photo_player(FirstPhotoPlayer, NNPlayerData),

    stat:login(State#player_data.login_type, Account, IP, self()),
    db:dirty_write(NPlayerBasicData),

    
    {ok, NNNPlayerData};
init([]) ->
    data_helper:format("player init empty params~n"),
    {ok, #player_data{}}.

%%---------------------------------处理玩家发送的数据-------------------------------------
%%

%% 处理消息
%% MsgType 消息类型
%% NetData 消息对应的结构体
%% process_message(Account, {MsgType, NetData}) when is_atom(Account) ->
%%     gen_server:cast(Account, {MsgType, NetData}).
%% ====================================================================
%% Server functions
%% ====================================================================


%% --------------------------------------------------------------------
%% Function: handle_call/3
%% Description: Handling call messages
%% Returns: {reply, Reply, State}          |
%%          {reply, Reply, State, Timeout} |
%%          {noreply, State}               |
%%          {noreply, State, Timeout}      |
%%          {stop, Reason, Reply, State}   | (terminate/2 is called)
%%          {stop, Reason, State}            (terminate/2 is called)
%% --------------------------------------------------------------------
handle_call(#msg{event=get_scene_name}, _From, State) ->
    SceneName = player_data:get_scene_name(State),
    {reply, SceneName, State};

handle_call(#msg{event=get_tcp_mm_pid}, _From, #player_data{mm_pid=MMPid}=State) ->
    {reply, MMPid, State};
handle_call(Request, _From, State) ->
    data_helper:format("player not process handle_call request:~p~n", [Request]),
    {reply, ok, State}.

%% --------------------------------------------------------------------
%% Function: handle_cast/2
%% Description: Handling cast messages
%% Returns: {noreply, State}          |
%%          {noreply, State, Timeout} |
%%          {stop, Reason, State}            (terminate/2 is called)
%% --------------------------------------------------------------------
handle_cast({#msg{event=scene_msg}, {SourceScene, MsgList}}, 
	    #player_data{scene_name=SceneName}=State) ->
    %% 同一场景才发送
    case SourceScene of
	SceneName ->
	    Account = player_data:get_account(State),
	    [net_helper:send2client(Account, Msg) || Msg <- MsgList];
	_ ->
	    ok
    end,
    {noreply, State};
handle_cast({send2client, Packet}, #player_data{mm_pid=MMPid}=State) ->
    tcp_mm:send(MMPid, Packet),
    {noreply, State};

%% 进场景时，需要通知其它人的一些消息包，统一在这里处理
handle_cast({#msg{event=on_see_other_player}, {HeAccount, MyOtherPackets}}, 
	    #player_data{scene_name=SceneName}=State) ->
    %% 服装之类的数据
    Packet = get_player_simple_data(State), 
    %% 动作
    %% 其它往后加到MsgList中
    MsgList = [Packet | player_action:get_packets(State)] ++ MyOtherPackets,

    %% 打上场景标签，发给对方
    router:cast(HeAccount, scene_msg, {SceneName, MsgList}),

    {noreply, State};

%% 客户端信息
handle_cast({_Msg, #client_device_info{}=Req}, State) ->
    Account = player_data:get_account(State),
    client_device_info:db_insert(atom_to_list(Account), Req),
    {noreply, State};

handle_cast({#msg{event=?msg_req_daily_visit}, #req_daily_visit{account=_Account}}, #player_data{account=TAccount}=State) ->
    net_helper:send2client(TAccount, #notify_daily_visit{visit_firends=[]}),
    %% net_helper:send2client(TAccount, #notify_daily_visit{visit_firends=daily_visit_log:get_today_visited_firends(Account)}),
    {noreply, State};

handle_cast({#msg{event=yy_finish_order}, {UId, YYOrderId, SrvId}}, State) ->
    %%发送finishOrder请求, 考虑异步请求
    data_helper:format("handle cast Uid:~p  OId:~p  SrvId:~p~n",[UId, YYOrderId, SrvId]),
    yy_strategy:finish_order(UId, YYOrderId, SrvId),
    {noreply, State};

%% 玩家打开界面
handle_cast({_Msg, #req_open_ui{type=Type}}, State)->
    do_open_ui(Type, State),
    {noreply, State};

%% 客户端可以弹消息了 
handle_cast({_Msg, #client_ready_for_pop_msg{}}, State)->
    Account = player_data:get_account(State),
    login_actions:on_login(Account),
    sys_msg:load_offline_sys_msg(Account),
    compensation_20130115:notify(Account),
    party_coin:notify(Account),
    {noreply, State};

%% 取个人信息
handle_cast({_Msg, #req_person_info{account=AccountStr}}, State) ->    
    Account = player_data:get_account(State),
    PersonAtom = list_to_atom(AccountStr),
    case db:dirty_read(player_basic_data, PersonAtom) of
	[] ->
	    ok;
	[R] ->
	    Info = player_basic_data:get_person_info(R),
	    router:cast(Account, view_person_info_event, PersonAtom),
	    net_helper:send2client(Account, #notify_person_info{info=Info})	    
    end,

    {noreply, State};


%% 更改个人信息
handle_cast({_Msg, #req_change_person_info{info=Info}}, State) ->    
    Account = player_data:get_account(State),
    F = fun() ->
		[PlayerBasicData] = db:read(player_basic_data, Account),
		NPlayerBasicData = player_basic_data:set_base_person_info(Info, PlayerBasicData),
		db:write(NPlayerBasicData),
		{ok, NPlayerBasicData}
	end,
    {ok, _NPlayerBasicData} = db:transaction(F),
    %%net_helper:send2client(Account, #notify_player_data{basic_data=NPlayerBasicData}),
    %%player_basic_data:notify(Account, NPlayerBasicData),
    {noreply, State};

handle_cast({_Msg, #req_close_person_info{}}, State) ->    
    Account = player_data:get_account(State),
    router:cast(Account, close_person_info_event, Account),
    {noreply, State};

handle_cast({#msg{event=?msg_req_player_basic_data}, #req_player_basic_data{}}, State) ->    
    Account = player_data:get_account(State),
    [PlayerBasicData] = db:dirty_read(player_basic_data, Account),
    player_basic_data:notify(Account, PlayerBasicData),
    {noreply, State};
%% 请求固定公告
handle_cast({#msg{event=?msg_req_fixed_broadcast}, Type}, #player_data{account=Account}=State)  ->
    sys_broadcast:req_fixed_broadcast(Account, Type),
    {noreply, State};

%% 请求应用平台信息
handle_cast({#msg{event=?msg_req_platform_info}, #req_platform_info{open_ids=OpenIDs, token=Token}}, #player_data{account=Account,password=OpenKey, login_type=Type}=State)  ->
    OpenId = atom_to_list(Account),
    PlatformInfoList = player_friends:build_friend_info_list(Type, OpenId, OpenKey, OpenIDs),
    net_helper:send2client(Account, #notify_platform_info{player_informations=PlatformInfoList, token=Token}),
    {noreply, State};

handle_cast({_Msg, #req_invite_list{}}, #player_data{account=Account}=State) ->
    L = get_friend_list(State, true, true),
    net_helper:send2client(Account, #notify_invite_list{friend_list=L}),
    {noreply, State};
    
handle_cast({_Msg, #req_friend_list{}}, #player_data{account=Account} = State) -> 
    FriendItemList = get_friend_list(State, false, false),
    net_helper:send2client(Account, #notify_player_friend_list{friend_list=FriendItemList}),
    {noreply, State};

handle_cast({#msg{event=show_buy_dialog}, {Token, Params, Context}}, #player_data{account=Account} = State) -> 
    net_helper:send2client(Account, #notify_show_buy_dialog{token=Token, params=Params, context=Context}),
    {noreply, State};

handle_cast({_Msg, #req_cancel_qq_order{context=Context}}, #player_data{account=Account} = State) -> 
    OrderID=list_to_integer(Context),
    accounting_context:cancel(OrderID),
    net_helper:send2client(Account, #notify_cancel_order{}),
    {noreply, State};

handle_cast({_Msg, #req_offline_notify{}}, #player_data{account=Account} = State) -> 
    Count = house_guest_book:notify_guest_book_get(Account),
    net_helper:send2client(Account, #notify_offline_notify{count=Count}),
    {noreply, State};

handle_cast({_Msg, #req_invite_active{}}, #player_data{account=Account} = State) -> 
    InviteList = player_invite:get_active(Account),
    LuckyDrawNumberOfInvite = common_def:get_val(lucky_draw_number_of_invite),
    net_helper:send2client(Account, 
			   #notify_invite_active{count=trunc(length(InviteList)/LuckyDrawNumberOfInvite)
						 , invite_list=lists:sublist(InviteList, 1, LuckyDrawNumberOfInvite)}),
    {noreply, State};

handle_cast({_Msg, #req_invite_award{item_id=ItemID, invite_list=InviteList, count=ItemCount, diamond=Diamond}}, #player_data{account=Account} = State) -> 
    % 验证邀请名单
    % 物品入包
    % 发送通知
    AllInviteList = player_invite:get_active(Account),
    F = fun(Invitee)-> lists:member(Invitee, AllInviteList) end,
    case lists:all(F, InviteList) of
	true->
	    lists:foreach(fun(Invitee) -> player_invite:make_actived(Account, Invitee) end, InviteList),
	    ShipFun = 
		fun()->
			HouseID = db_pair_player:get_house_id(Account),
			[HouseData] = db:read(house_data, HouseID),
			{HouseData1, Msgs} = 
			    case Diamond of
				0 ->
				    house_pack:add_items([{ItemID, ItemCount}], HouseData);
				_->
				    {house_diamond:add_diamond(Diamond, HouseData), []}
			    end,
			db:write(HouseData1),
			{house_lover_package:build_msgs(Msgs, HouseData1), HouseData1}
		end,
	    {MessageList, NewHouse} = db:transaction(ShipFun),
	    house_diamond:notify(NewHouse),
	    [net_helper:send2client(Target, Message) || {Target, Message} <- MessageList],
	    net_helper:send2client(Account, #notify_invite_award{result=1});
	false->
	    net_helper:send2client(Account, #notify_invite_award{result=0})
    end,
    {noreply, State};

handle_cast({_Msg, #req_player_info{account=Account}}, #player_data{account=CurrentAccount}=State) -> 
    PlayerBasicData = db_player:select(list_to_atom(Account)),
    net_helper:send2client(CurrentAccount, #notify_player_info{player=PlayerBasicData}),
    {noreply, State};


%% 请求邀请
handle_cast({_Msg, 
	     #req_invite_someone{type=Type, target_list=L}}, 
	    MyState) ->    
    Account = player_data:get_account(MyState),
    [router:cast(list_to_atom(Invitee), be_invite, {Account, Type})
     || Invitee <- L],
    {noreply, MyState};


handle_cast(Request, State) ->
    logger:log(error, "handle cast not process, Request:~p~n", [Request]),
    {noreply, State}.

%%---------------------handle info ------------------------------------------
handle_info({timer, Mod, Fun, Arg}, State) ->
    NewState = Mod:Fun(Arg, State),
    {noreply, NewState};
handle_info({timer, F}, State) ->    
    NewState = F(State),
    {noreply, NewState};
handle_info(_Info, State) ->
    {noreply, State}.

terminate(normal, State) ->
    do_logout(State);
terminate(shutdown, State) ->
    do_logout(State);
terminate({shutdown, _Reason}, State) ->
    do_logout(State);
terminate(_Reason, #player_data{mm_pid=Pid}=State) ->
    do_logout(State),
    tcp_mm:stop(Pid).

code_change(_OldVsn, State, _Extra) ->
    {ok, State}.

%%%==================================================================
%%% API Functions
%%%==================================================================

%%% @spec shutdown_player_process(atom)->ok.
%%% @doc 通过用户ID 关闭用户进程
%%% @end
-spec shutdown_player_process(atom())->ok.
shutdown_player_process(Account)->
    data_helper:format("Account~p~n",[Account]),
    case util:is_process_alive(Account) of
	true->
	    case router:send(Account, get_tcp_mm_pid) of
		undefined ->
		    ok;
		MMPid ->
		    tcp_mm:repeat_login_stop(MMPid),
		    ok
	    end,
	    player_sup:stop(Account),
	    ok;
	_->
	    ok
    end.


%%%===================================================================
%%% Internal functions
%%%===================================================================
%% 获取玩家的简单信息
get_player_simple_data(#player_data{walk_type=Type, curr_pos=Pos, dest_pos=DPos}=State) ->
    Account = player_data:get_account(State),
    [PlayerBasicData] = db:dirty_read(player_basic_data, Account),
    #notify_other_player_data{player=#player_info{basic_data=PlayerBasicData}, 
			      type=Type,
			      curr_pos=Pos, 
			      dest_pos=DPos}.

%% 初始化玩家数据
init_player_data(Account, Lover, HouseId, State) ->
    State#player_data{account=Account, 
		      lover=Lover,
		      house_id=HouseId,
		      login_time=datetime:localtime()
		     }.

do_logout(#player_data{account=Account, login_type=LoginType, client_ip=IP}=State) ->
    try 
	%% 怀疑这段代码引起人物残留，所以在这里捕获异常
	mutex_actions:clear_actions(logout, State)
    catch
    	A: B ->
	    error_logger:error_msg("account: ~p, logout error: ~p~n", [Account, {A, B}])
    end,

    #player_data{scene_name=SceneName} = State,    
    router:send2(SceneName, leave_scene, Account),
    
    pub:leave(Account, player_data:get_pub_id(State)),

    photos_make_friend:save_first_player(State),
    stat:logout(LoginType, Account, IP, self(),
		player_data:calc_online_time(State)),
    
    State.

do_open_ui(Type, #player_data{account=Account}) ->
    case Type of
	?uit_bag -> ok;
	_ -> ok
    end,
    net_helper:send2client(Account, #notify_open_ui{type=Type}).

send_house_warming(Account)->
    F = fun() ->
		case db:read(house_warming, Account) of 
		    [] -> false;
		    [_HouseWarming]->
			db:delete({house_warming, Account}),
			true
		end
	end,
    case db:transaction(F) of
	true ->
	    net_helper:send2client(Account, #notify_house_warming{title=?message_mateup_suceessful_title
								  ,desc=?message_mateup_suceessful_desc
								  ,summary=?message_mateup_suceessful_summary});	    
	false ->
	    ok
    end.


get_friend_list(#player_data{account=Account,password=OpenKey, login_type=Type},
    MergeAttentions, IsOnline) ->
    OpenId = atom_to_list(Account),
    L0 = player_friends:get_friend_list(Type, OpenId, OpenKey),
    FriendList0 = 
	case MergeAttentions of
	    true ->
		lists:usort(L0 ++ attention:get_attention_list(Account));
	    _ ->
		L0
	end,

    FriendList = case IsOnline of
		     true ->
			 [X || X <- FriendList0, db_player:get_online_player_user_info(list_to_atom(X)) /= undefined];
		     _ ->
			 FriendList0
		 end,

    PlayerIntimateList = player_intimate:get_player_intimate_with_checkup(Account, FriendList),
    F = fun(Friend, AccIn) -> 
		Item = list_to_atom(Friend),
		ItemBasic = db_player:select(Item),
		{ItemHouseId, ItemHouseLevel, HasEvent} = 
		    case ItemBasic of 
			[]-> 
			    {0, 0, 0};
			_->
			    HouseData = db_house:select(ItemBasic#player_basic_data.house_id),
			    EventType = case farm:has_event(Item) of
					    true -> 1;
					    _ -> 0
					end,
			    {ItemBasic#player_basic_data.house_id, 
			     house_level_exp:get_level(HouseData), EventType}
		    end,
		Intimate = 
		    case player_intimate:get_friend_intimate(PlayerIntimateList, Item) of
			undefined->
			    0;
			#intimate{value=Value}->
			    Value
		    end,

		[#friend_item{account=Item, crop_event=HasEvent, house_id=ItemHouseId, house_level=ItemHouseLevel, intimate=Intimate}|AccIn]
	end,
    lists:foldl(F, [], FriendList).



%%---------------------测试函数--------------------------------------------
%% 测试函数的入口
-spec test_start(atom()) -> any().
test_start(Account)->
    gen_server:start_link({local, Account}, ?MODULE, [], []).




