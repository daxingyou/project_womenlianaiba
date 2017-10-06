%%%-------------------------------------------------------------------
%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%%
%%% @end
%%% Created : 11 Jul 2012 by LinZhengJian <linzhj@35info.cn>
%%%-------------------------------------------------------------------
-module(player_breakup_context).

-include("enum_def.hrl").
-include("packet_def.hrl").
-include("house_data.hrl").
-include("common_def.hrl").
-include("player_gift.hrl").
-include("sys_msg.hrl").
-include("records.hrl").

-behaviour(gen_server).

%% API
-export([start_link/0]).

%% gen_server callbacks
-export([init/1, handle_call/3, handle_cast/2, handle_info/2,
	 terminate/2, code_change/3]).

-define(SERVER, ?MODULE). 

-record(state, {}).

-export([breakup/3]).

%%%===================================================================
%%% API
%%%===================================================================

%%% @spec breakup(atom(), #house_data{})->ok
%%% @edoc
%%%     离婚
%%% @end
-spec breakup(atom(), list(), #house_data{})->ok.
breakup(Sponsor, ExpectItems, HouseData)->
    gen_server:cast(?SERVER, {breakup, {Sponsor, ExpectItems, HouseData}}).

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
%% handle_cast({breakup, Sponsor, #house_data{boy=Boy, girl=Girl})

handle_cast({breakup, {Sponsor, ExpectItems, #house_data{boy=Boy, girl=Girl, house_id=HouseId}=HouseData}}, State) ->

    %% 删除派对
    party:del_party(Boy, HouseId),
    party:del_party(Girl, HouseId),

    %% 关闭进程
    player:shutdown_player_process(Boy),
    player:shutdown_player_process(Girl),
    house:shutdown_house_process(HouseData, ?msg_kicked_breakuping),

    %% 设置用户状态 房屋状态
    update_mateup_status(HouseData),

    do_breakup(Sponsor, ExpectItems, HouseData),

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

do_breakup(Sponsor, ExpectItems, #house_data{boy=Boy, girl=Girl, house_id=HouseId, exp=Experience}=HouseData)->
    Now = datetime:localtime(),
    %% 分脏 衣服，礼物
    HouseTemplateID = common_def:get_val(single_house_template_id),
    %% 特殊房产不需要

    BoyHouseData = house:get_breakup_house_data(Boy, HouseTemplateID, ''),
    BoyHouseId = BoyHouseData#house_data.house_id,
    BoyPair = db_pair_player:create(BoyHouseId, Boy, ?st_boy, ''),
    BoyPlayerData = db_player:select(Boy),

    GirlHouseData = house:get_breakup_house_data('', HouseTemplateID, Girl),
    GirlHouseId = GirlHouseData#house_data.house_id,
    GirlPair = db_pair_player:create(GirlHouseId, Girl, ?st_girl, ''),
    GirlPlayerData = db_player:select(Girl),

    {{BoyItemList, GirlItemList},UnObtainedItems} 
	= repartition_package({Sponsor, ExpectItems, HouseData, BoyHouseData, GirlHouseData}),
    {BoyGiftList, GirlGiftList} =  repartition_gift({HouseData, BoyHouseData, GirlHouseData}),
    {BoyPlayerBreakup, GirlPlayerBreakup} = create_breakup_record(HouseData, Now, Sponsor, UnObtainedItems),
    
    NewBoyPlayerData = BoyPlayerData#player_basic_data{mateup_status=?mst_single, house_id=BoyHouseId},
    NewGirlPlayerData = GirlPlayerData#player_basic_data{mateup_status=?mst_single, house_id=GirlHouseId},
    
    {NewBoyHouseData, _} = house_pack:add_items(BoyItemList, BoyHouseData),
    {NewGirlHouseData, _} = house_pack:add_items(GirlItemList,GirlHouseData),
    
    SearchList = friend_search_item:get_cancel_search_list(HouseData),

    HouseNameTail = binary_to_list(tplt:get_common_def("single_home_tail")),

    BoyName = player_basic_data:get_username(NewBoyPlayerData),
    BoyHouseName = BoyName ++ HouseNameTail,

    GirlName = player_basic_data:get_username(NewGirlPlayerData),
    GirlHouseName = GirlName ++ HouseNameTail,

    db:change(
      [
       {write, [NewBoyPlayerData, NewGirlPlayerData,
		NewBoyHouseData#house_data{exp=Experience, lover_diamond=0, name=BoyHouseName}, 
		NewGirlHouseData#house_data{exp=Experience, lover_diamond=0, name=GirlHouseName}, 
		BoyPair, GirlPair, 
		BoyGiftList,GirlGiftList,
		BoyPlayerBreakup, GirlPlayerBreakup]},
       {delete, [{house_guest_data, HouseId},{house_data, HouseId}, 
		 {house_today_visitors, HouseId},
		 {player_gift, HouseId}, {flower, HouseId} | SearchList]}]),

    
    %% 签到
    player_checkin:delete_check_in(HouseId),
    ok.

update_mateup_status(#house_data{boy=Boy, girl=Girl}=HouseData)->
    BoyPlayer = db_player:select(Boy),
    GirlPlayer = db_player:select(Girl),
    ChangeList = [{write, [
			   BoyPlayer#player_basic_data{mateup_status=?mst_breakuping},
			   GirlPlayer#player_basic_data{mateup_status=?mst_breakuping},
			   HouseData#house_data{mateup_status=?mst_breakuping}
			  ]}],
    db:change(ChangeList).

repartition_package({Sponsor, ExpectItems, #house_data{boy=Boy, girl=Girl}=HouseData, _BoyHouseData, _GirlHouseData})->
    UnMigrateItems = common_def:get_val(move_house_drop_items),
    UnpackItems = furniture:convert_furnitures_to_items(HouseData#house_data.furniture_vec, UnMigrateItems),  
    HousePackage = house_lover_package:get_lover_package(HouseData),    
    {SponsorItems, PassiveItems, UnObtainedItems} = distribution_items(ExpectItems, HousePackage),
    case Sponsor of
	Boy ->
	    {{SponsorItems, PassiveItems ++ UnpackItems}, UnObtainedItems};
	Girl ->
	    {{PassiveItems ++ UnpackItems, SponsorItems}, UnObtainedItems}
    end.

repartition_gift({HouseData, BoyHouseData, GirlHouseData})->
    #player_gift{boy=BoyGift, girl=GirlGift} = player_gift:get_player_gift(HouseData),
    BoyPlayerGift = #player_gift{house_id=BoyHouseData#house_data.house_id, boy=BoyGift, girl=#gift_list{account=''}}, 
    GirlPlayerGift = #player_gift{house_id=GirlHouseData#house_data.house_id, girl=GirlGift, boy=#gift_list{account=''}}, 
    {BoyPlayerGift, GirlPlayerGift}.

repartition_diamond(HouseData)->
    TotalDiamond = house_diamond:get_lover_diamond(HouseData),
    util:ceil(TotalDiamond / 2).

distribution_items(ExpectItems, HousePackage)->
    HouseItemList = house_pack:get_item_list(HousePackage),
    distribution_item(ExpectItems, HouseItemList, {[], []}).

distribution_item(ExpectItems, [], {SponsorItems, PassiveItems})->
    {SponsorItems, PassiveItems, [Item#item.template_id || Item <- ExpectItems]};

distribution_item(ExpectItems, [PackItem|HouseItems], {SponsorItems, PassiveItems}) ->
    #pack_grid{item_data=Item, count=Count}=PackItem,
    case lists:member(Item, ExpectItems) of
	true->
	    distribution_item(lists:delete(Item, ExpectItems), HouseItems, {[{Item, Count}|SponsorItems], PassiveItems});
	false ->
	    distribution_item(ExpectItems, HouseItems, {SponsorItems, [{Item, Count}|PassiveItems]})
    end.
%% distinguish_item_gender(HousePackage)->
%%     HouseItemList = house_pack:get_item_list(HousePackage),
%%     F = fun(#pack_grid{item_data=Item, count=Count}, {UnkownAcc, BoyAcc, GirlAcc})->
%% 		case item_dress:get_item_gender_attribute(Item) of
%% 		    ?st_unknow->
%% 			{[{Item, Count} | UnkownAcc], BoyAcc, GirlAcc};
%% 		    ?st_boy ->
%% 			{UnkownAcc,[{Item, Count} | BoyAcc], GirlAcc};
%% 		    ?st_girl->
%% 			{UnkownAcc, BoyAcc, [{Item, Count} | GirlAcc]}
%% 		end
%% 	end,
%%     lists:foldl(F, {[],[],[]}, HouseItemList).


create_breakup_record(#house_data{boy=Boy, girl=Girl}=HouseData, Now, Boy, UnObtainedItems)->
    AverageDiamond = repartition_diamond(HouseData),
    {#player_breakup{account=Boy, 
		    diamond=AverageDiamond, 
		    createat=Now,
		    unobtained_items=UnObtainedItems},
     #player_breakup{account=Girl, 
		    diamond=AverageDiamond, 
		    createat=Now,
		     unobtained_items=[]}};
create_breakup_record(#house_data{boy=Boy, girl=Girl}=HouseData, Now, Girl, UnObtainedItems)->
    AverageDiamond = repartition_diamond(HouseData),
    {#player_breakup{account=Boy, 
		    diamond=AverageDiamond, 
		    createat=Now,
		    unobtained_items=[]},
     #player_breakup{account=Girl, 
		    diamond=AverageDiamond, 
		    createat=Now,
		    unobtained_items=UnObtainedItems}}.


