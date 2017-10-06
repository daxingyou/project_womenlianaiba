%%%-------------------------------------------------------------------
%%% @author  linyijie
%%% @copyright (C) 2010
%%% @doc
%%% 房屋场景处理模块
%%% @end
%%% Created : 17 Mar 2010 by  linyijie
%%%-------------------------------------------------------------------
-module(house).
-behaviour(gen_scene).

-include("gen_scene.hrl").
-include("enum_def.hrl").
-include("common_def.hrl").
-include("sys_msg.hrl").
-include("tplt_def.hrl").
-include("router.hrl").
-include("player_data.hrl").
-include("records.hrl").
-include("house_data.hrl").

%% behaviour
-export([init/1, broadcast_owners/3, broadcast_owners/2, broadcast/2,
	 get_lover/2, get_owner/1, register/1, handle_call/3, handle_cast/2, terminate/2]).

-export([try_enter_scene/2,
	 on_leave_scene/2]).
-export([
	 get_right_grade/1,
	 get_tplt_id/1,
	 get_house_data/3, 	 
	 get_house_name/1,
	 is_house_name/1,
	 id_from_name/1,
	 is_editing/1,	 
	 change_house_template_id/2,
	 open_or_close_lights/1,
	 is_house_owner/3,
	 is_house_owner/2,
	 exist_furniture/2,
	 get_house_id/1,
	 get_flowerpots/1
	 ]).

-export([shutdown_house_process/4, shutdown_house_process/2]).

-export([get_breakup_house_data/3]).

-record(house_scene_data, {
	  max_players = 100,       %% 最大玩家数
	  house_editing = false,   %% 房屋是否正在编辑
	  temp_furnitures = [],     %% 家具临时信息
	  house_id=0               %% 房屋id
	 }).


-define(light_close, 0).
-define(light_open, 1).

%%%============================================================================
%%% API Functions
%%%============================================================================

%%% @spec shutdown_house_process(#house_data{})->ok.
%%% @doc 关闭房屋进程
%%% @end
-spec shutdown_house_process(#house_data{}, integer())->ok.
shutdown_house_process(#house_data{boy=Boy, girl=Girl, house_id=HouseId}, KickMessage)->
    HouseName = get_house_name(HouseId),
    case util:is_process_alive(HouseName) of
	  true->
	    router:send(HouseName, kick_guests_and_stop_house, {Boy, Girl, KickMessage}),
	      ok;
	  _->
	      ok
      end.

exist_furniture(FurInstID, #house_data{furniture_vec=FurList}) ->
    case lists:keyfind(FurInstID, #house_furniture.instance_id, FurList) of
	false -> false;
	_ -> true
    end.

get_flowerpots(#house_data{furniture_vec=FurList}) ->
    get_flowerpots(FurList, []).

get_flowerpots([], Flowerpots) ->
    Flowerpots;
get_flowerpots([Fur | Rest], Flowerpots) ->
    Tplt = tplt:get_data2(house_comp, Fur#house_furniture.template_id),
    case Tplt#house_comp.type == 2 of
	true -> get_flowerpots(Rest, [Fur | Flowerpots]);
	false -> get_flowerpots(Rest, Flowerpots)
    end.

%%% @spec shutdown_house_process(atom(), atom(), atom())->ok.
%%% @doc 关闭房屋进程
%%%      This function is obsolete. 
%%% @end
-spec shutdown_house_process(atom(), atom(), atom(), integer())->ok.
shutdown_house_process(HouseName, Boy, Girl, KickMessage)->
    case util:is_process_alive(HouseName) of
	true->
	    router:send(HouseName, kick_guests_and_stop_house, {Boy, Girl, KickMessage}),
	    ok;
	_->
	    ok
    end.

get_house_id(#house_data{house_id=HouseID}) ->
    HouseID;
get_house_id(#house_scene_data{house_id=HouseID}) ->
    HouseID;
get_house_id(#scene_data{custom_data=HouseSceneData}) ->
    get_house_id(HouseSceneData).

get_tplt_id(#house_data{template_id=TpltID}) ->
    TpltID.

get_right_grade(HouseData) ->
    ID = get_tplt_id(HouseData),
    Tplt = tplt:get_data2(house_tplt, ID),
    Tplt#house_tplt.right_grade.


register([SceneName, _HouseData])->
	house_use_furniture:start(SceneName) ++
	player_checkin:start(SceneName) ++
	[router:make_event_target(start_edit_house, SceneName, {SceneName, ?MODULE}),
	 router:make_event_target(end_edit_house, SceneName, {SceneName, ?MODULE}),
	 router:make_event_target(can_edit_house, SceneName, {SceneName, ?MODULE}),
	 router:make_event_target(is_editing, SceneName, {SceneName, ?MODULE}),
	 router:make_event_target(house_guest_book, SceneName, {SceneName, ?MODULE}),
	 router:make_event_target(house_visit_log, SceneName, {SceneName, ?MODULE}),
	 router:make_event_source(house_visit_log_add, SceneName, {SceneName, ?MODULE}),
	 router:make_event_target(guest_book_delete, SceneName, {SceneName, ?MODULE}),
	 router:make_event_target(set_guest_book_opened, SceneName, {SceneName, ?MODULE}),
	 router:make_event_target(guest_book_clear, SceneName, {SceneName, ?MODULE}),
	 router:make_event_target(guest_book_add, SceneName, {SceneName, ?MODULE}),
	 router:make_event_target(update_house_name, SceneName, {SceneName, ?MODULE}),
	 router:make_event_target(kick_guests_and_stop_house, SceneName, {SceneName, ?MODULE})
	].


%%%===================================================================
%%% API
%%%===================================================================
%% 取出生点
get_born_pos(#house_data{template_id=TpltID}) ->
    HouseTplt = tplt:get_data(house_tplt, TpltID),
    BornId = HouseTplt#house_tplt.born_id,
    BornData = tplt:get_data(born, BornId),
    [X, Y, Z] = BornData#born.pos,
    Pos = #point{x=X, y=Y, z=Z},
    Pos.

get_owner(#house_data{boy=Boy, girl=Girl}) ->
    {Boy, Girl}.

get_lover(Account, #house_data{boy=Boy, girl=Girl}) ->
    case Account of
	Girl ->
	    Boy;
	Boy ->
	    Girl
    end.




%% 广播消息
%% Boy:男方帐号, Girl:女方帐号, Packet:发送的信息
broadcast_owners(Boy, Girl, Packet) ->
    net_helper:send2client(Boy, Packet),
    net_helper:send2client(Girl, Packet).

broadcast_owners(#house_data{boy=Boy, girl=Girl}, Packet) ->
    net_helper:send2client(Boy, Packet),
    net_helper:send2client(Girl, Packet).

broadcast(SceneName, Packet) ->
    case util:is_process_alive(SceneName) of
	true ->
	    router:cast(undefined, SceneName, broadcast_all_players, Packet);
	false ->
	    {false, not_exist_scene}
    end.

name_head() ->
    "house_scene_".

get_house_name(HouseInstID) when is_integer(HouseInstID) ->
    list_to_atom(name_head() ++ integer_to_list(HouseInstID)).

is_house_name(SceneName) when is_atom(SceneName) ->    
    lists:prefix(name_head(), atom_to_list(SceneName)).
    
id_from_name(SceneName) when is_atom(SceneName) ->    
    case is_house_name(SceneName) of
	true ->
	    Str = atom_to_list(SceneName),
	    LenHead = length(name_head()),
	    IDStr = lists:sublist(Str, LenHead + 1, length(Str) - LenHead),
	    list_to_integer(IDStr);
	_ ->
	    []
    end.

%% 返回分手时的房屋数据
-spec get_breakup_house_data(atom(), integer(), atom()) -> tuple().
get_breakup_house_data(Boy, HouseTempID, Girl) ->
    HTData = tplt:get_data2(house_tplt, HouseTempID),
    get_house_data(Boy, HouseTempID, HTData, Girl, fun init_breakup_house_data/5).

%% 返回房屋的数据
-spec get_house_data(atom(), integer(), atom()) -> tuple().
get_house_data(Boy, HouseTempID, Girl) ->
    HTData = tplt:get_data2(house_tplt, HouseTempID),
    get_house_data(Boy, HouseTempID, HTData, Girl).


%% 改变房屋类型, 清空旧家具，使用新家具
change_house_template_id(#house_data{}=OldHouseData, NewHouseTempID) 
  when is_integer(NewHouseTempID) ->
    FurList = init_funitures_by_house_template(NewHouseTempID),
    OldHouseData#house_data{template_id=NewHouseTempID, furniture_vec=FurList}.

init_funitures_by_house_template(HouseTempID) ->
    HTData = tplt:get_data2(house_tplt, HouseTempID),
    File = HTData#house_tplt.house_furniture,
    FileAtom = tplt:transform_filename_atom(File),
    init_furni_vec(FileAtom).

is_editing(#scene_data{custom_data=HouseSceneData}) ->
    is_editing(HouseSceneData);
is_editing(#house_scene_data{house_editing=Editing}) ->
    Editing.


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

init([_HouseName, #house_data{house_id=HouseID, template_id=HouseTempID}=_HouseData]) ->
    % 装载房屋场景数据

    %% 初始化最高人数
    HouseTplt = tplt:get_data(house_tplt, HouseTempID),
    MaxPlayers = HouseTplt#house_tplt.max_players,



    {ok, #house_scene_data{max_players=MaxPlayers,
			   house_id=HouseID
			  }}.

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

%% 主人开始编辑房屋,客人们离开场景
handle_call({#msg{event=start_edit_house}, Master}, _From, 
	    #scene_data{custom_data=CustomData} = State) ->
    case can_edit_house(Master, State) of
	true ->
	    NewCustomData = CustomData#house_scene_data{house_editing=true 
						       },
	    {reply, ok, State#scene_data{custom_data=NewCustomData}};
	Err ->
	    {reply, Err, State}
    end;


%% 主人结束编辑房屋
handle_call({#msg{event=end_edit_house}, _Master}, _From, 
	    #scene_data{custom_data=CustomData}=State) ->
    NewCustomData = CustomData#house_scene_data{house_editing=false},
    {reply, ok, State#scene_data{custom_data=NewCustomData}};



handle_call(#msg{event=is_editing}, _From, 
	    #scene_data{custom_data=CustomData}=State) ->
    #house_scene_data{house_editing=IsEditing} = CustomData,
    {reply, IsEditing, State};
	
handle_call({#msg{event=guest_book_add}, Data}, _From, #scene_data{custom_data=CustomData}=State) ->
    HouseId = CustomData#house_scene_data.house_id,
    HouseData = db_house:select(HouseId),
    #house_data{boy=Boy, girl=Girl} = HouseData,
    #req_guest_book_add{guest=Guest, content=Content, opened=Opened}=Data,
    GuestAtom = list_to_atom(Guest),
    {GuestBook, DeletedList} = house_guest_book:add_guest_book(GuestAtom, Content, HouseData, Opened),    
    router:cast(GuestAtom, create_guest_book_event, HouseId),
    Players = gen_scene:get_players(State),
    {reply,  {{#notify_guest_book_add{result=1, item=GuestBook}, {Boy, lists:member(Boy, Players)}, 
	       {Girl, lists:member(Girl, Players)}}, DeletedList}, State};

handle_call({#msg{event=guest_book_clear}, #req_guest_book_clear{account=AccountStr}}, 
	    _From, #scene_data{custom_data=CustomData}=State) ->
    HouseData = db_house:select(CustomData#house_scene_data.house_id),
    #house_data{house_id=HouseId, boy=Boy, girl=Girl} = HouseData,
    Account = list_to_atom(AccountStr),
    IsOwner = is_house_owner(Boy, Girl, Account),
    Return = if 
	IsOwner == true ->
	    clear_guest_book(HouseId),
	    net_helper:send2client(Account, #notify_guest_book_clear{result=1});
	true->
	    #notify_guest_book_clear{result=1}
    end,
    {reply, Return, State};

handle_call({#msg{event=house_guest_book}, {#req_house_guest_book{house_id=HouseId}, RequestAccount}}, _From, #scene_data{custom_data=CustomData}=State) ->
    HouseData = db_house:select(CustomData#house_scene_data.house_id),
    #house_data{boy=Account, girl=LoverAccount} = HouseData,
    #house_guest_data{guest_books=GuestBooks}=house_guest_book:get_house_guest_books(HouseId),
    case is_house_owner(Account, LoverAccount, RequestAccount) of
	true->
	    player_offline_notify:delete(RequestAccount, ?offline_guest_book),
	    ok;
	_->ok
    end,
    {reply, #notify_house_guest_book{account=Account, lover_account=LoverAccount, guest_books=GuestBooks}, State};

handle_call({#msg{event=house_visit_log}, #req_house_visit_log{}}, _From, #scene_data{custom_data=CustomData}=State) ->
    HouseData = db_house:select(CustomData#house_scene_data.house_id),
    #house_data{visit_logs=VisitLogs} = HouseData,
    {reply, #notify_house_visit_log{visit_logs=player_house_log:compatible(VisitLogs)}, State};

handle_call({#msg{event=guest_book_delete}, #req_guest_book_delete{account=AccountStr, id=ID}}, _From, #scene_data{custom_data=CustomData}=State) ->
    HouseData = db_house:select(CustomData#house_scene_data.house_id),
    #house_data{house_id=HouseId, boy=Boy, girl=Girl} = HouseData,
    IsOwner = is_house_owner(Boy, Girl, list_to_atom(AccountStr)),
    Return = if 
		 IsOwner == true ->
		     #house_guest_data{guest_books=GuestBooks}= house_guest_book:get_house_guest_books(HouseId),
		     NGuestBooks = [Item || Item <- GuestBooks, Item#guest_book.id /= ID],
		     NHouseGuestBook=#house_guest_data{house_id=HouseId, guest_books=NGuestBooks},
		     db:dirty_write(NHouseGuestBook),    
		     #notify_guest_book_delete{result=1, id=ID};
		 true->
		     #notify_guest_book_delete{result=0}
	     end,
    {reply, Return, State};

handle_call({#msg{event=set_guest_book_opened}, #req_set_guest_book_opened{id=ID, opened=Opened}}, _From, #scene_data{custom_data=CustomData}=State) ->
    HouseId = CustomData#house_scene_data.house_id,
    #house_guest_data{guest_books=GuestBooks}= house_guest_book:get_house_guest_books(HouseId),
    NGuestBooks = [
		   begin case Item#guest_book.id of 
			     ID->
				 Item#guest_book{opened=Opened};
			     _->Item
			 end
		   end || Item <- GuestBooks],
    NHouseGuestBook=#house_guest_data{house_id=HouseId, guest_books=NGuestBooks},
    db:dirty_write(NHouseGuestBook),    
    {reply, #notify_set_guest_book_opened{id=ID, opened=Opened}, State};

handle_call({#msg{event=update_house_name}, #req_update_house_name{account=AccountStr,name=Name}}, 
	    _From, #scene_data{custom_data=CustomData}=State) ->

    F = fun() ->
		[HouseData] = db:read(house_data, CustomData#house_scene_data.house_id),
		#house_data{boy=Boy, girl=Girl} = HouseData,
		Account = list_to_atom(AccountStr),
		IsOwner = is_house_owner(Boy, Girl, Account),
		if 
		    IsOwner == true ->
			NHouseData=HouseData#house_data{name=Name},
			ok = db:write(NHouseData),
			{#notify_update_house_name{result=1}, State};		     
		    true->
			{#notify_update_house_name{result=0}, State}
		end
	end,

    {Return, NState} = db:transaction(F),
    {reply, Return, NState};

%% 踢人并停止房屋进程
handle_call({#msg{event=kick_guests_and_stop_house}, {NewBoy, NewGirl, Reason}},
	    _From, State) -> 
    Players = gen_scene:get_players(State),
    
    [router:cast(X, be_kick, Reason) || X <- Players, (X =/= NewGirl) and (X =/= NewBoy)],

    data_helper:format("kick guests and stop scene~n"),
    {stop, normal, stopped, State};


handle_call(_Request, _From, State) -> 
    Reply = ok,  
    {reply, Reply, State}.


clear_guest_book(HouseId)->
    NHouseGuestBook=#house_guest_data{guest_books=[], house_id=HouseId},
    db:dirty_write(NHouseGuestBook).


is_house_owner(#house_data{boy=Boy, girl=Girl}, Account) when is_atom(Account) ->
    is_house_owner(Boy, Girl, Account).

is_house_owner(Boy, Girl, Account)->
    if 
	Boy == Account ->
	    true;
	Girl == Account ->
	    true;
	true->
	    false
    end.


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

%% 添加访问日志
handle_cast({#msg{event=house_visit_log_add}, 
	     #req_house_visit_log_add{guest=Guest, account=AccountStr, openid=AccountOpenID}}, #scene_data{custom_data=CustomData}=State) ->
    Account = list_to_atom(AccountStr),
    F = fun() ->
		[HouseData] = db:read(house_data, CustomData#house_scene_data.house_id),
		#house_data{boy=Boy, girl=Girl} = HouseData,
		case player_house_log:write(Account, Boy, Girl, HouseData, Guest, AccountOpenID) of
		    {ok, NHouseData}=Ret ->
			ok = db:write(NHouseData),
			Ret;
		    Other -> 
			Other
		end
	end,

    case db:transaction(F) of
	{ok, #house_data{}=HouseData} ->
	    Now = calendar:local_time(),
	    case daily_visit_log:is_accessed_of_today(Account, HouseData#house_data.house_id, Now) of
		false ->
		    player_intimate:add_house_intimate(Account, HouseData#house_data.house_id,
						       common_def:get_val(intimate_of_visiting)),
		    daily_visit_log:access(Account, HouseData#house_data.house_id, Now),
		    ok;
		true ->
		    ok
	    end,
	    ok;
	_ ->
	    ok
    end,

    {noreply, State};

handle_cast(stop, State) ->
    {stop, normal, State}.


%%%===================================================================
%%% terminate
%%%===================================================================

terminate(_Reason, _State) ->
    ok.

%%%===================================================================
%%% Internal functions
%%%===================================================================

%% 生成房屋家具
make_house_furniture([])->
    [];
make_house_furniture([#house_furniture_tplt{furniture_id=TempID,
					    item_temp_id=ItemTempID,
					    x=X,
					    height=Height,
					    z=Z,
					    flr=Floor,
					   face=Face}|Rest])->
    [#house_furniture{instance_id=guid:make(?st_furniture),
		      template_id = TempID,
		      x=X,
		      height=Height,
		      z=Z,
		      floor=Floor,
		      face=Face,
		      item_tempid=ItemTempID,
		      status=0
		     } | make_house_furniture(Rest)].


%% 获取房屋数据
-spec get_house_data(atom(), integer(), tuple(), atom()) -> tuple().
get_house_data(Boy, HouseTempID, HTData, Girl) when is_atom(Boy), 
						    is_atom(Girl),
						    is_integer(HouseTempID) ->
    get_house_data(Boy, HouseTempID, HTData, Girl, fun init_house_data/5).

-spec get_house_data(atom(), integer(), tuple(), atom(), term()) -> tuple().
get_house_data(Boy, HouseTempID, HTData, Girl, InitHouseDataFunction) when is_atom(Boy), 
						    is_atom(Girl),
						    is_integer(HouseTempID) ->
    File = HTData#house_tplt.house_furniture,
    FileAtom = tplt:transform_filename_atom(File),
    FurniVec = init_furni_vec(FileAtom),
    InitHouseDataFunction(Boy, HouseTempID, HTData, FurniVec, Girl).

%% 初始化房屋家具数据
init_furni_vec([]) ->
    [];
init_furni_vec(FileAtom) ->
    make_house_furniture(tplt:get_all_data(FileAtom)).

%% 初始化房屋
init_house_data(Boy, HouseTempID, HTData, FurniVec, Girl) ->
    WelcomeWords = tplt:get_common_def("init_house_welcome_word"),
    Level = HTData#house_tplt.level,
    HouseData = #house_data{house_id=guid:make(?st_house), 
			   level = Level,
			    template_id = HouseTempID,
			    furniture_permission = ?fpt_yes,
			    house_permission = ?hpt_none,
			    furniture_vec = FurniVec,
			    welcome_words = WelcomeWords,
			    buy_date=datetime:localtime(),
			    lover_diamond=common_def:get_val(init_house_diamond),
			    lover_package=pack:new(0),
			    exp=0,
			    boy=Boy,
			    girl=Girl
			   },
    HouseData#house_data{decoration=furniture_property:get_decoration(HouseData)}.

init_breakup_house_data(Boy, HouseTempID, HTData, _FurniVec, Girl) ->
    WelcomeWords = tplt:get_common_def("init_house_welcome_word"),
    Level = HTData#house_tplt.level,
    HouseData = #house_data{house_id=guid:make(?st_house), 
			   level = Level,
			    template_id = HouseTempID,
			    furniture_permission = ?fpt_yes,
			    house_permission = ?hpt_none,
			    furniture_vec = [],
			    welcome_words = WelcomeWords,
			    buy_date=datetime:localtime(),
			    lover_diamond=0,
			    lover_package=pack:new(0),
			    exp=0,
			    boy=Boy,
			    girl=Girl
			   },
    HouseData#house_data{decoration=furniture_property:get_decoration(HouseData)}.


%% 试着进场景，失败返回{false, Error}
try_enter_scene({Account, EnterPos}, 
		#scene_data{custom_data=CustomData}=State) when is_atom(Account) ->
    #house_scene_data{house_id=HouseID} = CustomData,

    case can_enter_scene(Account, State) of
	true ->
	    HouseID = get_house_id(CustomData),
	    F = fun() ->
			[HouseData0] = db:read(house_data, HouseID),

			%% 属性升级
			HouseData = 
			    case furniture_property:update(HouseData0) of
				unchanged ->
				    HouseData0;
				HouseData1 -> 
				    db:write(HouseData1),
				    HouseData1
			    end,

			Pos = 
			    case EnterPos of
				born_pos -> get_born_pos(HouseData);
				_ -> EnterPos
			    end,
			
			case open_or_close_lights(HouseData) of
			    unchanged ->
				{unchanged, HouseData, Pos};
			    NHouseData ->
				db:write(NHouseData),
				{NHouseData, Pos}
			end
		end,
	    
	    {NewHouse, NewPos} =    
		case db:transaction(F) of
		    {unchanged, OldHouse, NPos} ->
			{OldHouse, NPos};
		    {NHouseData, NPos} ->
			{NHouseData, NPos}
		end,    
	    
	    #house_data{template_id=TpltID} = NewHouse,
	    
	    %% 通知进入玩家房屋
	    net_helper:send2client(Account, 
				   #notify_enter_player_house{house_tplt_id=TpltID,
							      enter_pos=NewPos,
							      data=get_house_info(NewHouse)}),
	    farm:send_farm_data(Account, NewHouse),
	    %%farm:init_house_max_flowerpot(Account, NewHouse),
	    player_gift:init(Account, NewHouse),
	    NState = friend_search_item:on_enter_house(Account, NewHouse, State),

	    NewState = NState,
	    {ok, NewState, NewPos};
	Other ->
	    Other
    end. 


get_house_info(#house_data{house_id=HouseID, 
			   template_id=TemplateId,
			   furniture_vec=FurVec,
			   visit_logs=VisitLogs,
			   boy=Boy,
			   girl=Girl,
			   name=HouseName,
			   mateup_status=MateUpStatus,
			   welcome_words=WelcomeWords			 
			  }=HouseData) ->
    #house_info{house_id=HouseID, 
		template_id=TemplateId,
		furniture_vec=FurVec,
		visit_logs=player_house_log:compatible(VisitLogs),
		level=house_level_exp:get_level(HouseData),
		boy=Boy,
		girl=Girl,
		name=HouseName,
		mateup_status=MateUpStatus,
		welcome_words=WelcomeWords,
		decoration=house_data:get_decoration(HouseData)}.



on_leave_scene(_Account, State) ->
    {State, auto_stop}.


%% 判断可否进入房屋
%% 返回值: true | {false, Reason}
can_enter_scene(Account, 
	    #scene_data{custom_data=CustomData}=State)->
    HouseID = CustomData#house_scene_data.house_id,
    HouseData = db_house:select(HouseID),
    IsHouseOwner = is_house_owner(HouseData, Account),
    MaxPlayerCount = CustomData#house_scene_data.max_players,
    Players = gen_scene:get_players(State),
    
    %% 屋主不计入限制人数
    PlayerCount = length(get_guests(Players, HouseData)),

    ActionCanDo = action:can_do([{fun({MaxPlayerCount1, PlayerCount1}) -> %% 玩家数超过时不能进入
					  MaxPlayerCount1 > PlayerCount1
				  end, {MaxPlayerCount, PlayerCount}, ?err_player_count_over}
				]),
    can_enter_scene1(ActionCanDo, IsHouseOwner).


can_enter_scene1(ActionCanDo, IsHouseOwner) ->
    case ActionCanDo of
	true ->
	    true;
	{false, ErrMsg} ->  %% 其他错误的情况，主人能进
	    can_enter_scene2(IsHouseOwner, ErrMsg)
    end.

can_enter_scene2(IsHouseOwner, ErrMsg) ->
    case IsHouseOwner of
	true ->
	    true;
	_ ->
	    {false, ErrMsg}
    end.


get_guests(Players, #house_data{boy=Boy, girl=Girl}) ->
    [X || X <- Players, (X =/= Boy) and (X =/= Girl)].



%% 判断能否编辑房屋
can_edit_house(Player, #scene_data{custom_data=CustomData}) ->
    HouseData = db_house:select(CustomData#house_scene_data.house_id),
    Boy = HouseData#house_data.boy,
    Girl = HouseData#house_data.girl,
    IsEditing = CustomData#house_scene_data.house_editing,
    case IsEditing of
	true ->
	    {false, ?err_other_is_editing_house};
	_ ->
	    %% 判断是否情侣
	    case Player of
		Boy ->
		    true;
		Girl ->
		    true;
		_ ->
		    {false, ?err_only_at_home_can_edit_house}
	    end
    end.


%% 判断是否灯具
is_light(FurTempID) ->    
    case tplt:get_data(furni_tplt, FurTempID) of
	#furni_tplt{use_type=UseType} ->
	    UseType =:= 2;
	_ ->
	    false
    end.


%% 开关灯关键逻辑
%% 今天 6点 ~ 18点  铁定关灯 
%% 今天 18点 之后 铁定开灯
%% 今天 6点之前
%%    如果昨天18有开过灯，则不管，否则铁定开灯
calc_update_lights(Plan) ->
    {HClose, HOpen} = common_def:get_val(open_light_plan),
    Now = datetime:local_time(),
    {Today, {H, _M, _S}} = Now,
    case (HClose =< H) and (H < HOpen) of
	true -> %% 需要关灯
	    case Plan of
		{Today, HClose, _B} -> %% 关过灯了, 没必要处理
		    Plan;
		_ ->
		    {?light_close, {Today, HClose, undefined}}
	    end;
	_ -> %% 需要开灯
	    Theday = case HOpen =< H of
			 true ->  %% 18点 之后
			     Today;
			 _ -> %% 6点前，要判断昨天的 
			     {A, _B} = datetime:dec_time(Now, 86400),
			     A
		     end,

	    case Plan of
		{Theday, _A, HOpen} -> %% 开过灯了, 没必要处理
		    Plan;
		_ ->
		    {?light_open, {Theday, undefined, HOpen}}
	    end
    end.



%% 对所有灯进行开关
open_or_close_lights(HouseData) ->
    #house_data{furniture_vec=FurList, light_plan=Plan} = HouseData,
    case calc_update_lights(Plan) of
	{NewStatus, NewPlan} -> 
	    
	    NewFurList = 
		[begin
		     #house_furniture{template_id=FurTempID}=X,
		     case is_light(FurTempID) of
			 true ->
			     X#house_furniture{status=NewStatus};
			 _ ->
			     X
		     end
		 end || X <- FurList		    
		],
	    
	    HouseData#house_data{furniture_vec=NewFurList, light_plan=NewPlan};
	_ ->
	    unchanged
    end.




%%----------------------------------测试函数-------------------------------
-include_lib("eunit/include/eunit.hrl").
-ifdef(TEST).

get_guests_test() ->
    ?assertEqual([a, c, d, f, g], get_guests([a, b, c, d, e, f, g], #house_data{boy=b, girl=e})),
    ok.


-endif.	
