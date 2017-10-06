%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% 玩家身上的物品
%%% @end
%%% Created : 20 Feb 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(player_body).

-include("tplt_def.hrl"). 
-include("packet_def.hrl").
-include("sys_msg.hrl").

-export([can_puton/2, get_item/2, get_all_items/1, puton/2, putoff/2, putoff/3, make_equips_item/1, del_overtime_items/1]).

%%%===================================================================
%%% API
%%%===================================================================
%% 生成物品装备的集合
%% 返回装备物品列表
make_equips_item([]) ->
    Item=#item{},
    array:from_list([make_item(E) || E <- [Item,Item,Item,Item,Item,Item,Item,Item]]);
make_equips_item(Equips)->
    array:from_list([make_item(Item) || Item <- Equips]).

can_puton(_Sex, []) ->
    true;
can_puton(Sex, [TempId|TempIds]) ->
    SexTplt = get_sex(TempId),
    case SexTplt == Sex of
	true ->
	    can_puton(Sex, TempIds);
	false ->
	    {false, err_sex}
    end.

get_item(InstId, BodyGrid) ->
    case pack:get_index(InstId, BodyGrid) of
	Index when is_integer(Index), Index >= 0 ->	    
	    pack:get_item(Index, BodyGrid);
	_ -> 
	    false
    end.

get_all_items(BodyGrid) ->
    Fun = fun(_Index, {Item, _Count}, Acc) ->
		  case item:is_empty(Item) of
		      true ->
			  Acc;
		      false ->
			  [Item | Acc]
		  end
	  end,
    pack:foldl(Fun, [], BodyGrid).
    
%% 穿上装备
puton(BodyGrid, Items) ->
    TempIds = item:get_tempid(Items),
    PutOffItems = item_dress:get_mutli_putoff_dress(TempIds, BodyGrid),
    NPutOffItems = 
    case PutOffItems of
	[] ->
	    PutOffItems;
	_ ->
	    lists:map(fun({_Index, Item}) -> Item end, PutOffItems)
    end,
    NBodyGrid = putoff(BodyGrid, NPutOffItems),
    NNBodyGrid = do_puton(NBodyGrid, Items),
    {NNBodyGrid, NPutOffItems}.

%%脱下装备
putoff(BodyGrid, []) ->
    BodyGrid;
putoff(BodyGrid, [Item|PutOffItems]) ->
    InstId = item:get_instid(Item),
    Index = pack:get_index(InstId, BodyGrid),
    NBodyGrid = pack:del_item(Index, BodyGrid),
    putoff(NBodyGrid, PutOffItems).

%% 脱下装备并保存到背包中
putoff(PlayerBasicData, HouseData, PutoffItems) ->
    Body = player_basic_data:get_body(PlayerBasicData),
    NBody = putoff(Body, PutoffItems),
    NPlayerBasicData = player_basic_data:set_body(NBody, PlayerBasicData),
    {NHouseData, _Msg} = house_pack:add_items(PutoffItems, HouseData),
    {NPlayerBasicData, NHouseData}.

%% 返回NewPlayerBasicData
del_overtime_items(Account) when is_atom(Account) ->
    F = fun() ->
		[BasicData] = db:read(player_basic_data, Account),
		Pack = player_basic_data:get_body(BasicData),
		case pack:del_overtime_items(Pack) of
		    {false, Err} -> 
			{false, Err, BasicData};
		    {_NewPack, []} ->
			{ok, BasicData};
		    {NewPack, DelItems} ->
			NBasicData = player_basic_data:set_body(NewPack, BasicData),
			db:write(NBasicData),
			{ok, NBasicData, DelItems}
		end
	end,

    case db:transaction(F) of
	{false, Err, BasicData} ->
	    sys_msg:send(Account, Err),
	    BasicData;
	{ok, NBasicData, DelItems} ->
	    HouseID = player_basic_data:get_house_id(NBasicData),
	    %% 后台物品金钱日志
	    [item_money_log:log_delete_overtime_item(HouseID, DelItemID, DelCount) 
	     || {DelItemID, DelCount} <- DelItems],
	    %% 通知

	    %% 通知物品过期
	    MsgFormat = binary_to_list(tplt:get_common_def("item_overtime_msg")) ++ [10],	    
	    F2 = fun({ItemID, _Count}, Str) -> 
			 Str ++ (item:get_item_name(ItemID) ++ MsgFormat) 
		 end,
	    _Content = lists:foldl(F2, "", DelItems),
	    %%sys_msg:send(Account, ?msg_notify_overtime_items, [Content]),

	    NBasicData;
	{ok, BasicData} -> 
	    BasicData
    end.

%%%===================================================================
%%% Internal functions
%%%===================================================================
do_puton(BodyGrid, []) ->
    BodyGrid;
do_puton(BodyGrid, [Item|Items]) ->
    TempId = item:get_tempid(Item),
    EPos = get_equip_pos(TempId),
    NBodyGrid = pack:set_item(Item, EPos, BodyGrid),
    do_puton(NBodyGrid, Items).

%% 获取装备位置
get_equip_pos(TempId) ->
    #item_dress_tplt{equip_pos=EPos} = tplt:get_dress_data(TempId),
    EPos.

get_sex(TempId) ->
    #item_dress_tplt{sex=Sex} = tplt:get_dress_data(TempId),
    Sex.

%% 生成一个物品
make_item(#item{template_id=0})->
    #pack_grid{};
make_item(#item{template_id=TempID})->
    item_must_be_valid(TempID),
    #pack_grid{count=1,
	       item_data=item:make_item(TempID)}.   

%% 检查玩家初始装备是否合法 
item_must_be_valid(TempID) ->
    %% TODO: 将来可能要在这里检查玩家初始物品，防止做弊
    %% 找不到要报错
    tplt:get_data2(item_tplt, TempID).


%%%===================================================================
%%% Internal functions
%%%===================================================================
-ifdef(TEST).
-include_lib("eunit/include/eunit.hrl").
get_all_items_test() ->
    Body = {array,8,10,undefined,{{pack_grid,0,0,{item,0,0,{stime,0,0,0,0,0,0}}},{pack_grid,1,0,{item,72145868702220291,8000003,{stime,0,0,0,0,0,0}}},{pack_grid,0,0,{item,0,0,{stime,0,0,0,0,0,0}}},{pack_grid,0,0,{item,0,0,{stime,0,0,0,0,0,0}}},{pack_grid,0,0,{item,0,0,{stime,0,0,0,0,0,0}}},{pack_grid,1,0,{item,72145868702220292,8500003,{stime,0,0,0,0,0,0}}},{pack_grid,0,0,{item,0,0,{stime,0,0,0,0,0,0}}},{pack_grid,0,0,{item,0,0,{stime,0,0,0,0,0,0}}},undefined,undefined}},
    ?assertEqual([{item,72145868702220292,8500003,{stime,0,0,0,0,0,0}},
		  {item,72145868702220291,8000003,{stime,0,0,0,0,0,0}}], get_all_items(Body)).

-endif.

