%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2011, hongjx
%%% @doc
%%%   ����С��, ���ñ���
%%% @end
%%% Created : 25 Nov 2011 by hongjx <hongjx@35info.cn>

-module(house_lover_package).


-include("router.hrl").
-include("common_def.hrl").
-include("sys_msg.hrl").
-include("tplt_def.hrl").
-include("gen_scene.hrl").
-include("enum_def.hrl").
-include("house_data.hrl").

-export([
	 get_not_exist_items/2,
	 add_items/2,
	 is_item_exist/2, 
	 get_item/2,
	 get_item_count/2,
	 get_item_total_count/2,
	 convert_pack_to_items/1]).

%% ɾ����Ʒ
-export([del_items/2,
	 del_whole_item/2,
	 del_n_by_tempid/2,
	 try_del_n_by_tempid/3,
	 del_overtime_items/2,
	 recycle_lover_item/3,
	 del_item_by_tempid/3, 
	 del_item_by_tempid/2]).

%% ֪ͨ
-export([
	 notify/2,
	 send_msgs/1,
	 send_msgs/2,
	 send_msgs/3,
	 build_msgs/2,
	 build_operator_whole_item_msgs/2,
	 build_pack_grid/1
	 ]).

-export([get_lover_package/1, set_lover_package/2]).

%%%===================================================================
%%% api 
%%%===================================================================

get_lover_package(HouseID) when is_integer(HouseID)->
    HouseData = db_house:select(HouseID),
    get_lover_package(HouseData);    

get_lover_package(#house_data{lover_package=LoverPackage})->
    LoverPackage.

set_lover_package(Package, HouseData) ->
    HouseData#house_data{lover_package=Package}.

notify(Account, #house_data{lover_package=Pack}) when is_atom(Account) ->
    net_helper:send2client(Account, #notify_lover_package{grid_vec=Pack}).


get_not_exist_items(HouseLoverPackage, ItemList) ->
    do_get_not_exist_items(HouseLoverPackage, ItemList, []).


recycle_lover_item(HouseID, Account, ItemInstID) when is_atom(Account),
						     is_integer(HouseID) ->
    SceneName = house:get_house_name(HouseID),
    HouseIsEditing = 
	case router:send(SceneName, is_editing) of
	    true -> true;
	    _ -> false
	end,
    
    F = fun() ->
		[HouseData] = db:read(house_data, HouseID),
		case do_recycle(Account, ItemInstID, HouseData, HouseIsEditing) of
		    {ok, NHouseData, ItemID, ItemCount, TotalPrice, Msgs} ->
			ok = db:write(NHouseData),
			{ok, NHouseData, ItemID, ItemCount, TotalPrice, Msgs};
		    {false, Err} -> {false, Err}
		end
	end,

    case db:transaction(F) of
	{false, Err} ->
	    sys_msg:send(Account, Err);
	{ok, #house_data{boy=Boy, girl=Girl, house_id=HouseID, lover_diamond=NMoney}=NewHouse, 
	ItemID, ItemCount, TotalPrice, Msgs} ->
	    on_recycle_ok(HouseID, Account, Boy, Girl,   
		      ItemID, ItemCount, NMoney, TotalPrice, Msgs, NewHouse)
    end,
    ok.
%%%===================================================================
%%% ɾ��������Ʒ 
%%%===================================================================
do_recycle(Account, ItemInstID, 
	       #house_data{girl=Girl, boy=Boy, 
			   lover_diamond=Money, 
			   lover_package=LoverPack}=HouseData,
	       _HouseIsEditing) ->    
    %% ��֤Account
    case Account of
	Boy -> ok;
	Girl -> ok
    end,

    case del_whole_item(ItemInstID, LoverPack) of
	{false, Err} ->
	    {false, Err};
	{NPack, Msgs} ->
	    ItemCount = get_item_count(ItemInstID, LoverPack),
	    Item = get_item(ItemInstID, LoverPack),
	    ItemTpltID = item:get_tempid(Item),
	    #item_tplt{sell_price=SellPrice, type=_ItemType} = tplt:get_data(item_tplt, ItemTpltID),
	    TotalPrice = SellPrice * ItemCount,
	    NMoney = Money + TotalPrice,
	    
	    NHouseData = HouseData#house_data{lover_diamond=NMoney, 
					      lover_package=NPack},
	    
	    {ok, NHouseData, ItemTpltID, ItemCount, TotalPrice, Msgs}
    end.

on_recycle_ok(HouseID, Account, Boy, Girl, ItemID, ItemCount, _NMoney, TotalPrice, Msgs, NewHouse) ->

    %% ��Ʒ��Ǯ��¼
    item_money_log:log_recycle_item(HouseID, ItemID, ItemCount, TotalPrice, Account),

    house_diamond:notify(NewHouse),

    %% ֪ͨ������ɾ����Ʒ��     
    send_msgs(Msgs, Boy, Girl).




%%%===================================================================
%%% ������Ʒ 
%%%===================================================================
%% Items = [{TempID, ItemCount}] or [#item{}] 
%% ���� {false, Err} �� {NewPack, Msgs} 
%%   Msgs ��ͨ�� send_msgs ���ͳ�ȥ
add_items(Items, Pack) when is_list(Items) ->
    F = fun(X, {PackAcc, MsgsAcc}) ->
		{Item, ItemCount} = 
		    case X of
			{ItemID, N} -> {ItemID, N};
			#item{} -> {X, 1}
		    end,

		{NPack, UpdateGrids, AddGrids} = pack:smart_append_item(Item, ItemCount, PackAcc),
		
		Msgs1 = 
		    case length(UpdateGrids) > 0 of
			true -> MsgsAcc ++ [#notify_update_items_count{items=UpdateGrids}];
			_ -> MsgsAcc
		    end,
		
		Msgs2 = 
		    case length(AddGrids) > 0 of
			true -> Msgs1 ++ [#notify_add_lover_items{items=AddGrids}];
			_ -> Msgs1
		    end,

		{NPack, Msgs2}		 
	end,
    lists:foldl(F, {Pack, []}, Items).


%%%===================================================================
%%% ɾ����Ʒ 
%%%===================================================================
%% ɾ����Ʒ(ÿ��ɾ��һ������)
%% Items = [ItemInstID] or [#item{}]  
%% ���� {false, Err} �� {NewPack, Msgs} 
%%   Msgs ��ͨ�� send_msgs ���ͳ�ȥ
del_items(Items, Pack) when is_list(Items) ->
    F = fun(Item, {PackAcc, OldMsgs}) ->
		{NPack, Msgs} = del_item(Item, PackAcc),
		{NPack, OldMsgs ++ Msgs}		 
	end,
    lists:foldl(F, {Pack, []}, Items).


%% ����ģ��id ɾ��Ʒ 
%% ����true �� {false, Err}
del_item_by_tempid(HouseID, Account, ItemIDList) 
  when is_integer(HouseID),
       is_atom(Account),
       is_list(ItemIDList) ->
    F = fun() ->
		[HouseData] = db:read(house_data, HouseID),
		Pack = get_lover_package(HouseData),

		%%
		case del_item_by_tempid(ItemIDList, Pack) of
		    {false, Err} ->
			{false, Err};
		    {{NPack, Msgs}, DelItemID} ->
			NHouseData = HouseData#house_data{lover_package=NPack},
			ok = db:write(NHouseData),
			{ok, NHouseData, DelItemID, Msgs}			
		end
	end,

    case db:transaction(F) of
	{ok, #house_data{house_id=HouseID}=HouseData, 
	  DelItemID, Msgs} ->	    
	    DelCount = 1,
	    %% ��Ʒ��Ǯ��¼
	    item_money_log:log_delete_item(HouseID, DelItemID, DelCount, Account),
	    send_msgs(Msgs, HouseData),
	    true;
	Other ->
	    Other
    end.


%% ɾ����� IDCountList = [{ItemTempID, Count}]
%% ���� {false, Err} �� {NewPack, Msgs} 
%%   Msgs ��ͨ�� send_msgs ���ͳ�ȥ
del_n_by_tempid(IDCountList, OldPack) when is_list(IDCountList) ->
    F = fun({TempID, Count}, Acc) ->
		case Acc of
		    {false, _Err} -> Acc;
		    {Pack, Msgs} when is_list(Msgs) ->
			case del_n_by_tempid([TempID], Count, Pack) of
			    {false, Err} -> {false, Err};
			    {Pack1, Msgs1} ->
				{Pack1, Msgs ++ Msgs1}
			end
		end
	end,

    lists:foldl(F, {OldPack, []}, IDCountList).


%% ��ɾ�����㼸��
%% NNeed ��ʾ��Ҫɾ��������
%% ����{NDel, NewPack, Msgs} 
%%   Msgs ��ͨ�� send_msgs ���ͳ�ȥ
try_del_n_by_tempid(TempIDList, 0, Pack) when is_list(TempIDList) ->
    {0, Pack, []};
try_del_n_by_tempid(TempIDList, NNeed, Pack) when is_list(TempIDList) ->
    {NDel, NewPack, UpdateItems} = pack:del_items_by_tempid(TempIDList, NNeed, Pack),
    Packet = #notify_update_items_count{items=UpdateItems},
    {NDel, pack:compress(NewPack), [Packet]}.


del_n_by_tempid(TempIDList, NNeed, Pack) when is_list(TempIDList) ->
    {NDel, NewPack, UpdateItems} = pack:del_items_by_tempid(TempIDList, NNeed, Pack),
    case NDel of
	NNeed -> %% �����㹻ɾ��
	    Packet = #notify_update_items_count{items=UpdateItems},
	    {pack:compress(NewPack), [Packet]};
	_ ->
	    {false, ?err_item_count_not_enough}	    
    end.

%% һ��ɾ��������һ��
%% ���� {false, Err} �� {NewPack, Msgs} 
%%   Msgs ��ͨ�� send_msgs ���ͳ�ȥ
del_item(ItemInstID, LoverPack) when is_integer(ItemInstID) -> 
    case pack:get_index(ItemInstID, LoverPack) of
	Index when is_integer(Index), Index >= 0 ->
	    DelCount = 1, 
	    del_lovers_pack(Index, DelCount, LoverPack);
	_Other ->
	    {false, ?msg_bag_no_item}
    end;
del_item(Item, LoverPack) ->
    del_item(item:get_instid(Item), LoverPack).


%% һ��ɾ����
%% ���� {false, Err} �� {NewPack, Msgs} 
%%   Msgs ��ͨ�� send_msgs ���ͳ�ȥ
del_whole_item(ItemInstID, LoverPack) when is_integer(ItemInstID) -> 
    case pack:get_index(ItemInstID, LoverPack) of
	Idx when is_integer(Idx), Idx >= 0 ->
	    case pack:is_lock(Idx, LoverPack) of
		false ->
		    ItemCount = pack:get_item_count(Idx, LoverPack),	    
		    del_lovers_pack(Idx, ItemCount, LoverPack);
		true ->
		    {false, ?err_grid_lock}
	    end;		    
	_Other ->
	    {false, ?msg_bag_no_item}
    end;
del_whole_item(Item, LoverPack) ->
    del_whole_item(item:get_instid(Item), LoverPack).


%% ����ģ��id ɾ��һ����Ʒ
%% ���� {false, Err} �� {{NewPack, Msgs}, DelItemID} 
%%   Msgs ��ͨ�� send_msgs ���ͳ�ȥ
del_item_by_tempid([], _Pack) ->
    {false, ?msg_bag_no_item};
del_item_by_tempid([ItemID | Tail], Pack) -> 
    case del_item_by_tempid_1(ItemID, Pack) of
	{false, _Err} -> %% �Ҳ�����������
	    del_item_by_tempid(Tail, Pack);
	Ret -> %% �ҵ��˳�
	    {Ret, ItemID}
    end.	     

del_item_by_tempid_1(ItemID, Pack) when is_integer(ItemID) ->
    case pack:get_index_by_tempid(ItemID, Pack) of
	Index when is_integer(Index), Index >= 0 ->
	    DelCount = 1, 
	    del_lovers_pack(Index, DelCount, Pack);
	_Other ->
	    {false, ?msg_bag_no_item}
    end.

%%%===================================================================
%%% ���ñ���������Ʒ, ���������� 
%%%===================================================================



%% ��������Ʒ������ɾ��������Ʒ��ָ��Ʒ�����жѵ���
build_operator_whole_item_msgs(AddItems, DelItems)
  when is_list(AddItems),
       is_list(DelItems) ->
    AddList = [build_pack_grid(X) || X <- AddItems],
    AddPacket = #notify_add_lover_items{items=AddList},

    DelList = [#pair_item_count{item_inst_id=get_item_instance_id(X), count=0} || X <- DelItems],
    DelPacket = #notify_update_items_count{items=DelList},
    [AddPacket, DelPacket].

build_msgs(Msgs, #house_data{boy=Boy, girl=Girl}) when is_list(Msgs) ->
    build_msgs(Msgs, Boy, Girl).
build_msgs(Msgs, Boy, Girl) when is_list(Msgs) ->
    F = fun(X, Acc) -> 
		[{Boy, X}, {Girl, X} | Acc]
	end,
    lists:foldr(F, [], Msgs).

send_msgs(Msgs, #house_data{boy=Boy, girl=Girl}) ->
    send_msgs(Msgs, Boy, Girl).
send_msgs(Msgs, Boy, Girl) ->
    send_msgs(build_msgs(Msgs, Boy, Girl)).

send_msgs(Msgs) ->
    [net_helper:send2client(Account, Packet) || {Account, Packet} <-  Msgs].

build_pack_grid({Item, ItemCount}) when is_integer(ItemCount) ->
    #pack_grid{count=ItemCount, item_data=Item};
build_pack_grid(Item) ->
    ItemCount = 1,
    #pack_grid{count=ItemCount, item_data=Item}.

get_item_instance_id(ItemInstID) when is_integer(ItemInstID) ->
    ItemInstID;
get_item_instance_id(Item) ->
    item:get_instid(Item).

convert_pack_to_items([])->
    [];
convert_pack_to_items(PackGridArray)->
    Fun = fun(_Index, #pack_grid{count=Count, item_data=Item}, Acc)->
		  [{Item, Count}|Acc]
    end,
    array:foldl(Fun, [], PackGridArray).

%% ��ȡ������û�е���Ʒ(����������Ʒ�У��п��ܴ����Ѿ���ɾ������Ʒ)
do_get_not_exist_items(_HouseLoverPackage, [], NotExistItems) ->
    NotExistItems;
do_get_not_exist_items(HouseLoverPackage, [Item|Items], NotExistItems) ->
    case is_item_exist(Item, HouseLoverPackage) of
	true ->
	    do_get_not_exist_items(HouseLoverPackage, Items, NotExistItems);
	false ->
	    do_get_not_exist_items(HouseLoverPackage, Items, [Item|NotExistItems])
    end.




is_item_exist(Item, LoverPack) when is_record(Item, item) ->
    ItemInstID = item:get_instid(Item),
    is_item_exist(ItemInstID, LoverPack);
is_item_exist(ItemInstID, LoverPack) when is_integer(ItemInstID) ->
    case get_item(ItemInstID, LoverPack) of
	{false, _Err} -> 
	    false;
	_ ->	    
	    true
    end.

get_item(ItemInstID, Pack) ->
    case pack:get_index(ItemInstID, Pack) of
	Index when is_integer(Index), Index >= 0 ->	    
	    pack:get_item(Index, Pack);
	_ -> 
	    {false, ?msg_bag_no_item}
    end.


get_item_count(ItemInstID, Pack) ->
    case pack:get_index(ItemInstID, Pack) of
	Index when is_integer(Index), Index >= 0 ->	    
	    pack:get_item_count(Index, Pack);
	_ -> 
	    {false, ?msg_bag_no_item}
    end.

%% ��ȡ��Ʒ��������
get_item_total_count(HouseLoverPackage, TempId) when is_integer(TempId) ->
    pack:get_count(TempId, HouseLoverPackage).



%%%===================================================================
%%% ɾ��������Ʒ 
%%%==================================================================
%% ����NewHouseData
del_overtime_items(Account, HouseID) when is_integer(HouseID) ->
    F = fun() ->
		[HouseData] = db:read(house_data, HouseID),
		Pack = get_lover_package(HouseData),
		case del_overtime_items(Pack) of
		    {false, Err} -> 
			{false, Err, HouseData};
		    {_NewPack, []} ->
			{ok, HouseData};
		    {NewPack, DelItems} ->
			NHouseData = set_lover_package(NewPack, HouseData),
			db:write(NHouseData),
			{ok, NHouseData, DelItems}
		end
	end,

    case db:transaction(F) of
	{false, Err, HouseData} ->
	    sys_msg:send(Account, Err),
	    HouseData;
	{ok, NHouseData, DelItems} ->
	    %% ��̨��Ʒ��Ǯ��־
	    [item_money_log:log_delete_overtime_item(HouseID, DelItemID, DelCount) 
	     || {DelItemID, DelCount} <- DelItems],
	    %% ֪ͨ��һ��
	    

	    %% ֪ͨ��Ʒ����
	    MsgFormat = binary_to_list(tplt:get_common_def("item_overtime_msg")) ++ [10],	    
	    F2 = fun({ItemID, _Count}, Str) -> 
			 Str ++ (item:get_item_name(ItemID) ++ MsgFormat) 
		 end,
	    _Content = lists:foldl(F2, "", DelItems),
	    %%sys_msg:send(Account, ?msg_notify_overtime_items, [Content]),
	    
	    NHouseData;
	{ok, HouseData} -> 
	    HouseData
    end.

%% ɾ��������Ʒ
del_overtime_items(Pack) ->
    {NewPack, DelItems} = pack:del_overtime_items(Pack),
    {pack:compress(NewPack), DelItems}.

%%%===================================================================
%%% �ڲ����� 
%%%==================================================================
del_lovers_pack(Idx, DelCount, LoverPack) ->    
    OldCount = pack:get_item_count(Idx, LoverPack),
    case pack:is_lock(Idx, LoverPack) of
	true ->
	    {false, ?err_grid_lock};
	_ ->
	    case DelCount > OldCount of
		true ->
		    {false, ?err_item_count_not_enough};
		_ ->
		    OldItem = pack:get_item(Idx, LoverPack),
		    ItemInstID = item:get_instid(OldItem),
		    
		    NewPack = pack:del_item(Idx, DelCount, LoverPack),    
		    
		    N = OldCount - DelCount,
		    %% ��֯��Ϣ��������Ʒ����
		    Msgs = #notify_update_items_count{items=[#pair_item_count{item_inst_id=ItemInstID, count=N}]},
		    {pack:compress(NewPack), %% ������Ŀռ�ȥ��
		     [Msgs]}
	    end
    end. 







%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%
%    ��Ԫ����
%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

-ifdef(TEST).
-include_lib("eunit/include/eunit.hrl").
player_lover_package_test()->
    ?assertMatch([], convert_pack_to_items(pack:new(0))),
    ok.
-endif.
