%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2011, hongjx
%%% @doc
%%%  房屋编辑(家装)
%%%      以后逐步把家装相关的代码搬到这里 
%%% @end
%%% Created : 31 Dec 2011 by hongjx <hongjx@35info.cn>

-module(house_edit).

-include("gen_scene.hrl").
-include("enum_def.hrl").
-include("common_def.hrl").
-include("sys_msg.hrl").
-include("tplt_def.hrl").
-include("router.hrl").
-include("house_data.hrl").


-export([req_change_furnitures/3, notify_change_furnitures/5]).

%%%===================================================================
%%% api 
%%%===================================================================


%% 一次性提交家装所有修改
req_change_furnitures(Account, Req, HouseData) ->  
    #req_change_furnitures{recovery_furnitures=RecoveryFurs, 
			   placed_furnitures=PlacedFurs,
			   move_furnitures=MoveFurs,
			   buy_goods_list=GoodsList
			  } = Req,
    %% 验证Account
    true = house:is_house_owner(HouseData, Account),


    #house_data{furniture_vec=OldFurs, template_id=TpltID,
	       lover_diamond=Money, lover_package=OldPack} = HouseData,
    
    HouseLevel = house_level_exp:get_level(HouseData),

    %% 购买家具
    case buy_furniture_list(GoodsList, OldFurs, Money, HouseLevel) of
	{false, Err} ->
	    {false, Err};
	{NewFurs, NMoney} ->
	    %% 摆放上去的家具
	    {Furs1, Pack1, UnfindItems} = placed_furnitures(PlacedFurs, NewFurs, OldPack),
	    case UnfindItems of
		[] ->
		    %% 回收家具
		    {Furs2, Pack2} = recovery_furnitures(RecoveryFurs, Furs1, Pack1),
		    
		    %% 移动家具
		    Furs3 = move_furnitures(MoveFurs, Furs2),
		    
		    NHouseData = HouseData#house_data{furniture_vec=Furs3, 
						      lover_diamond=NMoney, lover_package=Pack2},

		    %% 家具数量限制
		    case length(Furs3) > get_furniture_limit(TpltID) of
			true ->
			    {false, ?err_funiture_count_limit};
			_ ->
			    {ok, NHouseData#house_data{decoration=furniture_property:get_decoration(NHouseData)}}
		    end;
		_ ->
		    {unfind_items, UnfindItems}
	    end
    end.

%%%===================================================================
%%% 移动家具   
%%%===================================================================
move_furnitures(MoveList, FurVec)
  when is_list(MoveList) ->
    NFurList = [begin
		    #house_furniture{instance_id=InstanceID}=Fur,
		    Ret = lists:keyfind(InstanceID, #furniture_place_info.instance_id, MoveList),
		    case Ret of
			#furniture_place_info{x=X, z=Z, height=Height, floor=Floor, face=Face} ->
			    Fur#house_furniture{x=X, z=Z, height=Height, floor=Floor, face=Face};
			_ ->
			    Fur
		    end
		end || Fur <- FurVec],

    NFurList.


%%%===================================================================
%%% 回收家具   
%%%===================================================================
recovery_furnitures(DelList, FurVec, 
	       LoverPack) when is_list(DelList) ->
    ItemCount = 1,
    ItemList = [begin 
		    #house_furniture{item_tempid=ItemTempID, del_time=DelTime, property=P} =
			lists:keyfind(InstanceID, #house_furniture.instance_id, FurVec),
		    {item:new(ItemTempID, InstanceID, DelTime, P), ItemCount}
		end || InstanceID <- DelList],
    
    NewPack = add_lovers_pack(ItemList, LoverPack),	 

    {furniture:delete(DelList, FurVec), NewPack}.

add_lovers_pack(ItemList, LoverPack) ->
    F = fun({Item, ItemCount}, Pack) ->
		{NPack, _UpdateGrids, _AddGrids} = 
		    pack:smart_append_item(Item, ItemCount, Pack),		
		NPack
	end,
    lists:foldl(F, LoverPack, ItemList).

%%%===================================================================
%%% 购买家具   
%%%===================================================================
buy_furniture_list(GoodsList, 
		   OldFurList, 
		   Money,
		   HouseLevel) when is_list(GoodsList)->
    %% 判断是否有足够的金钱来购买商品
    TotalDiamondPrice = calc_diamond_goods_price(GoodsList),
    %% 扣除相应的货币
    NMoney = Money - TotalDiamondPrice,

    case NMoney < 0 of
	true ->
	    {false, ?err_not_enough_lover_diamond};	    	    
	_ ->
	    case level_can_buy_goods(HouseLevel, GoodsList) of
		false ->
		    {false, ?err_level_not_enough_to_buy};
		_ ->	    
		    FurnitureList = make_furniture_list(GoodsList),
		    
		    NFurs = furniture:add(FurnitureList, OldFurList),
		    
		    {NFurs, NMoney}	     
	    end
    end.


level_can_buy_goods(HouseLevel, GoodsList) ->
    F = fun(#furniture_goods_data{goods_id=GoodsID}) ->
		#sys_shop_tplt{player_level=LevelLimit} = tplt:get_data(sys_shop_tplt, GoodsID),
		HouseLevel < LevelLimit
	end,
    not lists:any(F, GoodsList).


make_furniture_list(GoodsList) when is_list(GoodsList) ->
    [begin Tplt = tplt:get_data(sys_shop_tplt, GoodsID),
	   ItemID = Tplt#sys_shop_tplt.item_id,
	   #item_tplt{sub_id=FurnitureID} = tplt:get_data(item_tplt, ItemID),
	   InstID = guid:make(?st_furniture),
	   furniture:new(ItemID, InstID, FurnitureID, 
		       X, Z, Height, Floor, Face)
     end || #furniture_goods_data{goods_id=GoodsID, x=X, z=Z, height=Height,
				  floor=Floor, face=Face} <- GoodsList].


calc_diamond_goods_price(GoodsList) when is_list(GoodsList)->
    F = fun(#furniture_goods_data{goods_id=GoodsID}, TotalPrice) ->
		TotalPrice + get_diamond_goods_price(GoodsID)
	end,
    lists:foldl(F, 0, GoodsList).

get_diamond_goods_price(GoodsID) ->
    case tplt:get_data(sys_shop_tplt, GoodsID) of
	#sys_shop_tplt{money_type=MoneyType, price=Price} -> 
	    case MoneyType == ?mt_diamond of
		true ->
		    Price;
		false ->
		    0
	    end;
	empty -> 
	    erlang:error({badarg, GoodsID})
    end.



%%%===================================================================
%%% 放置家具   
%%%===================================================================
placed_furnitures(PlacedFurList, 
		 FurVec, 
		 LoverPack) when is_list(PlacedFurList) ->
    F = fun(#furniture_place_info{instance_id=ItemInstID, x=X, z=Z, 
				  height=Height, floor=Floor, 
				  face=Face
				 }, 
	    {FurAcc, PackAcc, FailItems}) ->
		case pack:get_index(ItemInstID, PackAcc) of
		    not_found ->
			{FurAcc, PackAcc, [ItemInstID | FailItems]};
		    GIndex ->
			Item = pack:get_item(GIndex, PackAcc),
			ItemTempID = item:get_tempid(Item),
			DelTime = item:get_del_time(Item),
			#item_tplt{sub_id=FurnitureTempID} = tplt:get_data(item_tplt, ItemTempID),
			
			#item{property=P} = Item,
			FurInstID = ItemInstID, %%guid:make(?st_furniture),
			Furniture = furniture:new(ItemTempID, FurInstID, FurnitureTempID, 
					      X, Z, Height, Floor, Face, DelTime, P),
			ItemCount = 1,
			NewPack = pack:del_item(GIndex, ItemCount, PackAcc),
			NewFurs = furniture:add(Furniture, FurAcc),
			{NewFurs, NewPack, FailItems}
		    end
	end,

    {NFurs, NPack, UnfindItems} = lists:foldl(F, {FurVec, LoverPack, []}, PlacedFurList),
    
    %% 将多余的空间去掉
    {NFurs, pack:compress(NPack), UnfindItems}.


notify_change_furnitures(#house_data{boy=Boy, girl=Girl, 
				     furniture_vec=NewFurs, 
				     lover_package=NewPack, 
				     lover_diamond=NMoney}=NewHouseData, 
			 #house_data{furniture_vec=OldFurs, 
				     lover_package=OldPack}, 
			 MoveFurs, SceneName, Operator) ->

    notify_change_furnitures(Boy, Girl, NewFurs, NewPack, 
			     NMoney, OldFurs, OldPack, MoveFurs, 
			     SceneName, Operator, NewHouseData).


notify_change_furnitures(Boy, Girl, NewFurs, NewPack, 
			    NMoney, OldFurs, OldPack, MoveFurs, SceneName, Operator, HouseData) 
  when is_atom(SceneName) ->
    OItemList = pack:to_list(OldPack),
    NItemList = pack:to_list(NewPack),

    AddItems = NItemList -- OItemList,
    DelItems = OItemList -- NItemList,    

    notify_placed_furnitures(Operator, DelItems),
    DelItemIDs = [item:get_instid(Item) || #pack_grid{item_data=Item} <- DelItems],
    
    OldFurIDs = [X#house_furniture.instance_id || X <- OldFurs],
    NewFurIDs = [X#house_furniture.instance_id || X <- NewFurs],

    DelFurIDs = OldFurIDs -- NewFurIDs,
    AddFurIDs = NewFurIDs -- OldFurIDs,
    
    AddFurs = [lists:keyfind(InstID, #house_furniture.instance_id, NewFurs) || InstID <- AddFurIDs],
    
    ModifyFurs = [X || X <- NewFurs, 
		 lists:keymember(X#house_furniture.instance_id, 
				 #furniture_place_info.instance_id, MoveFurs)],

    %% 通知金钱变更    
    net_helper:send2client(Boy, #notify_lover_diamond{amount=NMoney}),
    net_helper:send2client(Girl, #notify_lover_diamond{amount=NMoney}),    
    
    %% 通知家具变更
    Decoration = house_data:get_decoration(HouseData),
    Packet = #notify_change_furnitures{del_furnitures=DelFurIDs,
				       add_furnitures=AddFurs,
				       move_furnitures=ModifyFurs,
				       add_items=AddItems,
				       del_items=DelItemIDs,
				       decoration=Decoration},

    router:cast(undefined, SceneName, broadcast_all_players, Packet),
    ok.

    
notify_placed_furnitures(Account, DelBagGrids) ->
    ItemList = [Item || #pack_grid{item_data=Item} <- DelBagGrids],
    
    case length(ItemList) > 0 of
	true ->	    
	    %% 有摆放家具了，通知其它模块做事件处理
	    router:cast(Account, change_goods_event, ItemList);
	_ ->
	    ok
    end.

get_furniture_limit(TpltID) ->
    #house_tplt{max_furniture=Limit} = tplt:get_data(house_tplt, TpltID),
    Limit.

