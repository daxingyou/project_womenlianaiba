%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2011, hongjx
%%% @doc
%%%  物品升级, 增加家装值
%%% @end
%%% Created : 19 Sep 2011 by hongjx <hongjx@35info.cn>

-module(db_update_item_20120508).

-export([add_del_time_field/0]).


%% 旧数据
%-record(item, {instance_id=0, template_id=0}).
%% 新数据
%-record(item, {instance_id=0, template_id=0, del_time=[]}).

%%%=================================================================================
%%% 当时的数据结构
-record(pack_grid, {count=0, lock=0, item_data=[]}).
-record(stime, {year=0, month=0, day=0, hour=0, minute=0, second=0}).

-record(player_basic_data, {account="", username="", sex=0, skin_color=0, hair=0, face=0, beard=0, online_time=0.00000000000000000000e+000, hair_color=0, last_login_time=#stime{}, house_id=0, mateup_status=0, hp=0, body=[], hp_update_time=#stime{}, create_time=#stime{}, first_photo_player="", animal_type=0, birthday=#stime{}, star=0, height=0, salary=0, blood_type=0, education=0, contact="", interest="", signature="", city=0, province=0, career="", weight=0}).

-record(gift_info, {gift_id=0, receiver="", sender="", gift_box=0, gift, date=#stime{}}).

-record(gift_list, {             %% 礼物列表
	  account,               %% 玩家帐号
	  send_list = [],        %% 发送列表
	  receive_list = [],     %% 未接收列表
	  received_list = []     %% 接受列表
	 }).

-record(player_gift, {
	  house_id,              %% 房屋Id
	  boy = #gift_list{},    %% 男性角色的礼物
	  girl = #gift_list{}    %% 女性角色的礼物
	 }).

-record(house_data, 
	{house_id=0, 
	 template_id=0, 
	 furniture_permission=0, 
	 furniture_vec=[], 
	 room_tex_vec=[], 
	 welcome_words="", 
	 house_permission=0, 
	 visit_logs=[], 
	 buy_date, 
	 level=0, 
	 house_clean=0, 
	 boy='', 
	 girl='', 
	 name="", 
	 mateup_status=0, 
	 lover_diamond=0, 
	 lover_package=[],
	 exp=0             %% 总经验(等级和当前经验要换算出来)
	}).


add_del_time_field() ->
    convert_table(house_data),
    convert_table(player_basic_data),
    convert_table(player_gift),
    {atomic, ok}.


convert_table(Tab) ->
    Keys = mnesia:dirty_all_keys(Tab),
    [begin
	 %%io:format("key:~p~n", [{Tab, K}]),
	 [R] = mnesia:dirty_read(Tab, K),
	 NewR = convert_record(R),
	 mnesia:dirty_write(NewR) 
     end || K <- Keys].

%% 转换礼物
convert_record(#gift_info{gift=Gift}=R) ->
    NGift = convert_item(Gift),
    R#gift_info{gift=NGift};
convert_record(#gift_list{send_list=SendList,
			  receive_list=RecvList,
			  received_list=HasRecvList
			 }=R) ->
    NSendList = convert_gift_list(SendList),
    NRecvList = convert_gift_list(RecvList),
    NHasRecvList = convert_gift_list(HasRecvList),

    R#gift_list{send_list=NSendList,
		receive_list=NRecvList,
		received_list=NHasRecvList}; 
convert_record(#player_gift{boy=BoyGift, girl=GirlGift}=R) ->
    NBoyGift = convert_record(BoyGift),
    NGirlGift = convert_record(GirlGift),
    R#player_gift{boy=NBoyGift, girl=NGirlGift};
%% 转换装备
convert_record(#player_basic_data{body=Pack}=R) ->
    NPack = convert_grid_vec(Pack),
    R#player_basic_data{body=NPack};
%% 转换房屋共用物品
convert_record(#house_data{lover_package=Pack, furniture_vec=FurList}=R) ->
    NPack = convert_grid_vec(Pack),
    NFurList = convert_furniture_list(FurList),
    R#house_data{lover_package=NPack, furniture_vec=NFurList}.

convert_gift_list(List) when is_list(List) ->
    [convert_record(X) || X <- List].


convert_furniture_list(List) when is_list(List) -> 
    [convert_furniture(X) || X <- List].

%% 转换包裹
convert_grid_vec(GridVec) when is_list(GridVec) ->
    F = fun(Grid, Acc) ->
		NGrid = convert_grid(Grid),
		[NGrid | Acc]
	end,
    lists:foldr(F, [], GridVec);
convert_grid_vec(GridVec) ->
    F = fun(Idx, Grid, Acc) -> 
		NGrid = convert_grid(Grid),
		array:set(Idx, NGrid, Acc)
	end,
    array:foldl(F, pack:new(array:size(GridVec)), GridVec).

%% 转换格子
convert_grid(#pack_grid{item_data=Item}=Grid) ->
    NItem = convert_item(Item), 
    Grid#pack_grid{item_data=NItem}.

%% 转换物品
convert_item(Item) when size(Item) == 3 -> % 旧数据
    erlang:append_element(Item, #stime{}); %% 默认设为无时效        
convert_item(Item) when size(Item) == 4 -> % 已经转化过了
    Item.

convert_furniture(Item) when size(Item) == 10 -> % 旧数据
    erlang:append_element(Item, #stime{}); %% 默认设为无时效        
convert_furniture(Item) when size(Item) == 11 -> % 已经转化过了
    Item.




