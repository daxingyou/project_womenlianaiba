%%%-------------------------------------------------------------------
%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%% 合并配对数据
%%% @end
%%% Created : 21 Feb 2012 by LinZhengJian <linzhj@35info.cn>
%%%-------------------------------------------------------------------
-module(player_mateup_context).

-behaviour(gen_server).

-include("resource.hrl").
-include("packet_def.hrl").
-include("enum_def.hrl").
-include("sys_msg.hrl").
-include("router.hrl").
-include("records.hrl").
-include("house_data.hrl").

%% API
-export([start_link/0]).

%% gen_server callbacks
-export([init/1, handle_call/3, handle_cast/2, handle_info/2,
	 terminate/2, code_change/3]).

-export([mateup/2]).

-export([stop_player/2]).

-define(SERVER, ?MODULE). 

-record(state, {}).

%%%===================================================================
%%% API
%%%===================================================================

%%--------------------------------------------------------------------
%% @doc
%% Starts the server
%%
%% @spec start_link() -> {ok, Pid} | ignore | {error, Error}
%% @end
%%--------------------------------------------------------------------
start_link() ->
    gen_server:start_link({local, ?SERVER}, ?MODULE, [], []).


mateup(Boy, Girl)->
    BoyHouseID = db_pair_player:get_house_id(Boy),
    GirlHouseID = db_pair_player:get_house_id(Girl),
    update_mateup_status(Boy, Girl, BoyHouseID, GirlHouseID),
    gen_server:cast(?SERVER, {mateup, {Boy, Girl, BoyHouseID, GirlHouseID}}).


stop_player(Boy, Girl)->
    gen_server:cast(?SERVER, {stop_player, {Boy, Girl}}).

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
    {ok, #state{}}.

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
handle_cast({stop_player, {Boy, Girl}}, State) ->
    player:shutdown_player_process(Boy),
    player:shutdown_player_process(Girl),
    {noreply, State};


handle_cast({mateup, {Boy, Girl, BoyHouseID, GirlHouseID}}, State) ->
    %% 删除派对
    party:del_party(Boy, BoyHouseID),
    party:del_party(Girl, GirlHouseID),
    %% 关闭用户进程和房屋进程
    player:shutdown_player_process(Boy),
    player:shutdown_player_process(Girl),
    BoyPlayer = db_player:select(Boy),
    GirlPlayer = db_player:select(Girl),

    %% 踢出所有用户后，房屋进程自动关闭
    BoyHouseName = house:get_house_name(BoyHouseID),
    GirlHouseName = house:get_house_name(GirlHouseID),
    house:shutdown_house_process(BoyHouseName, Boy, '', ?msg_kicked_mateuping),
    house:shutdown_house_process(GirlHouseName, '', Girl, ?msg_kicked_mateuping),


    BoyHouse = db_house:select(BoyHouseID),
    GirlHouse = db_house:select(GirlHouseID),
    DelList0 = friend_search_item:get_cancel_search_list(BoyHouse),
    DelList1 = friend_search_item:get_cancel_search_list(GirlHouse),

    % 读取需要合并的数据 （水晶，家具，包裹）
    %% 合并水晶
    BoyDiamond = house_diamond:get_lover_diamond(BoyHouse),
    GirlDiamond = house_diamond:get_lover_diamond(GirlHouse),
    TotalDiamond = BoyDiamond + GirlDiamond,

    %% 合并家具
    BoyPackage = house_lover_package:get_lover_package(BoyHouse),
    GirlPackage = house_lover_package:get_lover_package(GirlHouse),
    UnMigrateItems = get_unmigrate_items(),
    ItemsOfBoy = furniture:convert_furnitures_to_items(BoyHouse#house_data.furniture_vec, UnMigrateItems),  
    ItemsOfGirl = furniture:convert_furnitures_to_items(GirlHouse#house_data.furniture_vec, UnMigrateItems),  

    %% 写入数据
    HouseName = get_house_name(Boy, Girl),
    HouseTemplateID = common_def:get_val(lover_house_template_id),
    HouseData = house:get_house_data(Boy, HouseTemplateID, Girl),
    #house_data{house_id = HouseID} = HouseData,
    BoyPair = db_pair_player:create(HouseID, Boy, ?st_boy, Girl),
    GirlPair = db_pair_player:create(HouseID, Girl, ?st_girl, Boy),
    BoyPackItems = house_lover_package:convert_pack_to_items(BoyPackage),
    GirlPackItems = house_lover_package:convert_pack_to_items(GirlPackage),
    {Package, _Msgs} = house_lover_package:add_items(
	     lists:concat([BoyPackItems
			   , GirlPackItems
			   , ItemsOfBoy, ItemsOfGirl]),
	     pack:new(0)),
    Experience = 
	case BoyHouse#house_data.exp > GirlHouse#house_data.exp of
	    true ->
		BoyHouse#house_data.exp;
	    false->
		GirlHouse#house_data.exp
	end,
    BoyHP = BoyPlayer#player_basic_data.hp,
    GirlHP = GirlPlayer#player_basic_data.hp,
    BoyPlayerGift = player_gift:get_player_gift(BoyHouseID),
    GirlPlayerGift = player_gift:get_player_gift(GirlHouseID),

    %% %% 产权等级取最大的
    %% MaxRightGrade = max(BoyHouse#house_data.right_grade, GirlHouse#house_data.right_grade),
    try
    db:change([{write, [
			       BoyPair, GirlPair,
			       HouseData#house_data{name=HouseName, 
						    right_grade=0,
						    lover_diamond=TotalDiamond,
						    lover_package=Package,
						    welcome_words=tplt:get_common_def("init_house_welcome_word"),
						    exp=Experience}, 
			       BoyPlayer#player_basic_data{house_id=HouseID, hp=BoyHP, mateup_status=?mst_mateuped},
			       GirlPlayer#player_basic_data{house_id=HouseID, hp=GirlHP, mateup_status=?mst_mateuped},
			       #house_warming{account=Boy, house_id=HouseID}, #house_warming{account=Girl, house_id=HouseID},
			       player_gift:merge(HouseID, BoyPlayerGift, GirlPlayerGift)
			      ]},
		      {delete, [
				{pair_info, Boy}, {pair_info, Girl}, 
				{house_guest_data, BoyHouseID}, {house_guest_data, GirlHouseID},
				{house_today_visitors, BoyHouseID}, {house_today_visitors, GirlHouseID},
				{house_guest_data, BoyHouseID}, {house_guest_data, GirlHouseID},
				{house_data, BoyHouseID}, {house_data, GirlHouseID},
				{player_gift, BoyHouseID}, {player_gift, GirlHouseID}
			       ] ++ DelList0 ++ DelList1}
		     ]),
    player_checkin:delete_check_in(BoyHouseID),
    player_checkin:delete_check_in(GirlHouseID),
    daily_task:remove(Boy),
    daily_task:remove(Girl),
    house_guest_book:add_guest_book(Boy, ?default_boy_house_guest_book, HouseData),
    house_guest_book:add_guest_book(Girl, ?default_girl_house_guest_book, HouseData),
    player_checkin:add_check_in(HouseData#house_data.house_id, atom_to_list(Boy), ?default_boy_house_checkin),
    player_checkin:add_check_in(HouseData#house_data.house_id, atom_to_list(Girl), ?default_girl_house_checkin)
    %% sys_msg:save_offline_msgs(Boy, [#notify_sys_msg{code=?msg_mateup_success}]),
    %% sys_msg:save_offline_msgs(Girl, [#notify_sys_msg{code=?msg_mateup_success}])
    catch
	_:_->
	    {noreply, State}
    end,
    %% 物品金钱记录
    item_money_log:log_mateup_house(BoyHouseID, ItemsOfBoy, BoyPackItems,
		 GirlHouseID, ItemsOfGirl, GirlPackItems,
		 HouseID),
    {noreply, State};

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
get_house_name(BoyAccount, GirlAccount)->
    BoyName =  db_player:get_user_name(BoyAccount), 
    GirlName = db_player:get_user_name(GirlAccount),
    util:string_format(?default_house_name, [BoyName, GirlName]).

update_mateup_status(Boy, Girl, BoyHouseID, GirlHouseID)->
    BoyPlayer = db_player:select(Boy),
    GirlPlayer = db_player:select(Girl),
    BoyHouse = db_house:select(BoyHouseID),
    GirlHouse = db_house:select(GirlHouseID),
    ChangeList = [{write, [
			   BoyPlayer#player_basic_data{mateup_status=?mst_mateuping},
			   GirlPlayer#player_basic_data{mateup_status=?mst_mateuping},
			   BoyHouse#house_data{mateup_status=?mst_mateuping},
			   GirlHouse#house_data{mateup_status=?mst_mateuping}
			  ]}],
    db:change(ChangeList).

get_unmigrate_items()->
    common_def:get_val(move_house_drop_items).



