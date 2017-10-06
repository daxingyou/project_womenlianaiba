%%% @author linzhj <linzhj@35info.cn>
%%% @copyright (C) 2010, linzhj
%%% @doc
%%%    Ç©µ½ÏµÍ³
%%% @end
%%% Created : 2011-11-21 by linzhj <linzhj@35info.cn>

-module(player_checkin).

-include("router.hrl").
-include("gen_scene.hrl").
-include("common_def.hrl").
-include("house_data.hrl").

-export([start/1]).
-export([handle_call/3]).

-export([add_check_in/3, get_checkin_list/4, delete_check_in/2, get_last_check_in/3, set_checkin_opened/2]).
-export([delete_check_in/1]).

start(SceneName)->
    [router:make_event_target(checkin_add, SceneName, {self(), ?MODULE}),
     router:make_event_target(last_checkins, SceneName, {self(), ?MODULE}),
     router:make_event_target(checkin_delete, SceneName, {self(), ?MODULE}),
     router:make_event_target(checkin_list, SceneName, {self(), ?MODULE})
    ].

handle_call({#msg{event=checkin_add}, #req_checkin_add{account=Account, content=Content, opened=Opened}}, _From, #scene_data{custom_data=HouseSceneData}=State) -> 
    #house_data{house_id=HouseId, boy=Boy, girl=Girl} = db_house:select(house:get_house_id(HouseSceneData)),
    Lover = case list_to_atom(Account)==Boy of 
		true->
		    Girl;
		_->
		    Boy
	    end,
    CheckIn = add_check_in(HouseId, Account, Content, Opened),
    router:cast(list_to_atom(Account), create_checkin_event, HouseId),
    {reply, {CheckIn, Lover}, State};

handle_call({#msg{event=last_checkins}, #req_last_checkins{owner=_Owner}}, _From, #scene_data{custom_data=HouseSceneData}=State) -> 
    #house_data{house_id=HouseId, boy=Boy, girl=Girl} = db_house:select(house:get_house_id(HouseSceneData)),
    Result = get_last_check_in(HouseId, atom_to_list(Boy), atom_to_list(Girl)),
    {reply, Result, State};

handle_call({#msg{event=checkin_delete}, #req_checkin_delete{id=ID, account=Account}}, _From, #scene_data{custom_data=SceneData}=State) -> 
    #house_data{house_id=HouseId, boy=Owner, girl=Lover} = db_house:select(house:get_house_id(SceneData)),
    IsOwner = house:is_house_owner(atom_to_list(Owner), atom_to_list(Lover), Account), 
    Result = if
	IsOwner == true->
	    delete_check_in(HouseId, ID),
	    {ok, ID};
	true->
	    error
    end,
    {reply, Result, State};

handle_call({#msg{event=checkin_list}, {Account, #req_checkin_list{page_index=PageIndex, page_size=PageSize, start_id=StartID}}}, _From, #scene_data{custom_data=SceneData}=State) -> 
    #house_data{house_id=HouseId} = db_house:select(house:get_house_id(SceneData)),
    router:cast(Account, view_checkin_event, HouseId),
    {reply, get_checkin_list(HouseId, PageIndex, PageSize, StartID), State}.


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%
% Inner Function
%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

set_checkin_opened(ID, Opened)->
    mongodb_services:update(get_connection(), checkin, {'_id', mongodb_services:string_to_objectid(ID)}, {opened, Opened}).

add_check_in(HouseId, Account, Content)->
    add_check_in(HouseId, Account, Content, 1).

add_check_in(HouseId, Account, RawContent, Opened)->
    ID = mongodb_app:gen_objectid(),
    Content = qq_strategy:word_filter(list_to_existing_atom(Account), RawContent, 
				      mongodb_services:objectid_to_string(ID)),
    CheckIn = {'_id', ID, house_id, HouseId, account, Account, content, Content, create_date, bson:timenow(), opened, Opened},
    mongodb_services:insert(get_connection(), checkin, CheckIn),
    tuple_to_record(CheckIn).    

get_last_check_in(HouseID, OwnerAccount, LoverAccount)
  when is_integer(HouseID)->
    Options = {sort, {'_id', -1}},
    %% remove Today Limit temporary
    %% TodayTimeStamp = mongodb_services:today(),
    %% OwnerSelector = {house_id, HouseID, account, OwnerAccount, create_date, {'$gt', TodayTimeStamp}},
    %% LoverSelector = {house_id, HouseID, account, LoverAccount, create_date, {'$gt', TodayTimeStamp}},
    OwnerSelector = {house_id, HouseID, account, OwnerAccount},
    LoverSelector = {house_id, HouseID, account, LoverAccount},
    OwnerItem =  mongodb_services:select_one(get_connection(), checkin, OwnerSelector, Options),
    LoverItem =  mongodb_services:select_one(get_connection(), checkin, LoverSelector, Options),
    #notify_last_checkins{owner=tuple_to_record(OwnerItem), lover=tuple_to_record(LoverItem)}.

delete_check_in(HouseID)->
    Selector = {house_id, HouseID},
    mongodb_services:delete(get_connection(), checkin, Selector).

delete_check_in(HouseID, Id)->
    Selector = {house_id, HouseID, '_id', mongodb_services:string_to_objectid(Id)},
    mongodb_services:delete(get_connection(), checkin, Selector).

get_checkin_list(HouseID, _PageIndex, _PageSize, StartID)->
    MinStartID = case StartID of
		     []->
			 mongodb_services:get_min_objectid();
		     _->
			 mongodb_services:string_to_objectid(StartID)
		 end,
    Selector = {house_id, HouseID, '_id', {'$gt', MinStartID}},
    ItemList =  mongodb_services:select(get_connection(), checkin, Selector, {sort, {create_date, -1}}),
    [tuple_to_record(Item) || Item <- ItemList].
    %%[tuple_to_record(Item) || Item <- lists:sublist(ItemList, PageSize)].

get_connection()->
    %%mongodb_services:get_connection().
    Conns = get(?MODULE),
    NConns = case Conns of 
    		 undefined->
    		     Conns1 = mongodb_services:get_connections(),
    		     put(?MODULE, Conns1),
    		     Conns1;
    		 _->
    		     Conns
    	     end,
    mongodb_services:get_connection(NConns).

tuple_to_record(Item)->
    %%io:format("tuple_to_record:~p~n", [Item]),
    case Item of 
	{}->
	    #check_in{};
	_->
	    #check_in{id=mongodb_services:objectid_to_string(bson:at('_id', Item)), 
		      account=bson:at(account, Item),
		      content=bson:at(content, Item),
		      create_date=datetime:make_time(calendar:now_to_local_time(bson:at(create_date, Item))),
		      opened=bson:lookup(opened, Item, 1)}
    end.
