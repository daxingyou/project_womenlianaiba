%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2013, LinZhengJian
%%% @doc
%%%
%%% @end
%%% Created :  4 Jan 2013 by LinZhengJian <linzhj@35info.cn>

-module(item_upgrade).

-include("tplt_def.hrl").
-include("packet_def.hrl").
-include("records.hrl").
-include("house_data.hrl").
-include("sys_msg.hrl").
-include("router.hrl").
-include("player_data.hrl").
-include("mutex_actions.hrl").

-export([start/1, handle_cast/2]).
-export([upgrade/2, gm_upgrade/1]).
%%-compile(export_all).

%%%===================================================================
%%% API
%%%===================================================================
start(Account) ->
    [router:make_event_source(?msg_req_item_upgrade, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_mutli_item_upgrade, Account, {Account, ?MODULE})
    ].

%%%===================================================================
%%% handle_cast
%%%===================================================================
handle_cast({#msg{event=?msg_req_item_upgrade}, #req_item_upgrade{instance_id=InstanceId}}, 
	    #player_data{account=Account}=State) ->
    case upgrade(Account, InstanceId) of
	{ok, #item{instance_id=InstID}, #house_data{boy=Boy, girl=Girl}, MessageList}->
	    [begin net_helper:send2client(Boy, M),net_helper:send2client(Girl, M) end || M <- MessageList],
	    net_helper:send2client(Account, #notify_item_upgrade{result=1, upgrade_item_instanceid=InstID});
	{error, item_cant_upgrade}->
	    sys_msg:send(Account, ?err_item_upgrade_cap),
	    net_helper:send2client(Account, #notify_item_upgrade{result=0, upgrade_item_instanceid=0});
	{error, item_no_exist}->
	    sys_msg:send(Account, ?err_item_upgrade_fail),
	    net_helper:send2client(Account, #notify_item_upgrade{result=0, upgrade_item_instanceid=0});
	{error, consumediamond_no_enough}->
	    sys_msg:send(Account, ?err_not_enough_lover_diamond),
	    net_helper:send2client(Account, #notify_item_upgrade{result=0, upgrade_item_instanceid=0});
	{error, consumeitem_no_enough}->
	    sys_msg:send(Account, ?err_item_upgrade_lack),
	    net_helper:send2client(Account, #notify_item_upgrade{result=0, upgrade_item_instanceid=0})
    end,
    {noreply, State};
handle_cast({#msg{src=Account}, #req_mutli_item_upgrade{inst_ids=InstIds}}, State) ->
    F = fun() ->
		[PlayerBasicData] = db:read(player_basic_data, Account),
		HouseId = player_basic_data:get_house_id(PlayerBasicData),
		[HouseData] = db:read(house_data, HouseId),
		UpgradeFurnitures = get_upgrade_furnitures(InstIds, HouseData),
		UpgradePropertys = get_upgrade_property(InstIds, HouseData),
		case can_mutli_upgrade(Account, UpgradePropertys, UpgradeFurnitures, HouseData) of
		    true ->
			do_mutli_upgrade(UpgradePropertys, UpgradeFurnitures, HouseData);
		    Reason ->
			Reason
	        end
	end,
    case db:transaction(F) of
	{false, Reason} ->
	    sys_msg:send(Account, Reason);
	{FurList, HouseData} ->
	    house_diamond:notify(HouseData),
	    Decoration = house_data:get_decoration(HouseData),
	    HouseID = house:get_house_id(HouseData),
	    SceneName = house:get_house_name(HouseID),
	    house:broadcast(SceneName, #notify_mutli_item_upgrade{furnitures=FurList,
								  decoration = Decoration}),
	    router:cast(Account, on_mutli_item_upgrade, Account),
	    router:cast(Account, on_decoration_change, Decoration)
    end,
    {noreply, State}.

%% 是否可以升级
can_mutli_upgrade(Account, UpgradePropertys, UpgradeFurnitures, HouseData) ->
    try
	validate_lover_edit_house(Account, HouseData),
	validate_upgrade_furniture(UpgradeFurnitures),
	validate_upgrade_property(UpgradePropertys),
	validate_diamond(UpgradePropertys, HouseData)
    catch
	throw:Reason ->
	    Reason
    end.

validate_lover_edit_house(Account, HouseData) ->
    Lover = house:get_lover(Account, HouseData),
    case router:send(Lover, has_action, ?action_type_edit_house) of
	undefined ->
	    true;
	true ->
	    throw({false, ?mutli_item_upgrade_lover_edit});
	false ->
	    true
    end.

validate_upgrade_furniture(UpgradeFurnitures) ->
    case UpgradeFurnitures of
	[] ->
	    throw({false, ?err_item_upgrade_fail});
	_ ->
	    true  
    end.

validate_upgrade_property(UpgradePropertys) ->
    case UpgradePropertys of
	[] ->
	    throw({false, ?err_item_upgrade_fail});
	_ ->
	    true
    end.

%% 验证水晶是否足够
validate_diamond(UpgradePropertys, HouseData) ->
    NeedDiamonds = get_upgrade_diamond(UpgradePropertys),
    HouseLoverDiamond = house_diamond:get_lover_diamond(HouseData),
    case HouseLoverDiamond >= NeedDiamonds of
	true ->
	    true;
	false ->
	    throw({false, ?err_not_enough_lover_diamond})
    end.

get_upgrade_furnitures(InstIds, HouseData) ->
    FurList = house_data:get_furniture_vec(HouseData),
    lists:foldl(fun(InstId, Upgrades) ->
			case lists:keyfind(InstId, #house_furniture.instance_id, FurList) of
			    false ->
				Upgrades;
			    Fur ->
				[Fur|Upgrades]
			end
		end, [], InstIds).

get_upgrade_property(InstIds, HouseData) ->
    FurList = house_data:get_furniture_vec(HouseData),
    lists:foldl(fun(InstId, Upgrades) ->
			case lists:keyfind(InstId, #house_furniture.instance_id, FurList) of
			    false ->
				Upgrades;
			    Fur ->
				TempId = Fur#house_furniture.item_tempid,
				#item_tplt{upgrade_id=ItemSubId} = tplt:get_data2(item_tplt, TempId),
				case get_item_upgrade(InstId, ItemSubId) of
				    null->
					Upgrades;
				    IUW->
					UpgradeItemId = IUW#item_upgrade_wrapper.upgraded_item_id,
					case UpgradeItemId of
					    0 ->
						Upgrades;
					    _ ->
						[IUW|Upgrades]
					end
				end
			end
		end, [], InstIds).

get_upgrade_diamond(UpgradePropertys) ->
    lists:foldl(fun(#item_upgrade_wrapper{consume_diamond=ConsumeDiamond}, NeedDiamonds) ->
			ConsumeDiamond + NeedDiamonds
		end, 0, UpgradePropertys).

update_furnitures_property(UpgradePropertys, UpgradeFurnitures) ->
    lists:foldl(fun(#house_furniture{instance_id=InstId, 
				     item_tempid=ItemTpltID,
				     %%template_id=FurTempId, 
				     property=Property}=HouseFur, Fur) ->
			case lists:keyfind(InstId, #item_upgrade_wrapper.inst_id, UpgradePropertys) of
			    false ->
				Fur;
			    UpgradeProperty ->
				ItemTplt = tplt:get_data2(item_tplt, ItemTpltID),
				UpgradeTempId = UpgradeProperty#item_upgrade_wrapper.upgraded_item_id,
				UpgradedProperty = UpgradeProperty#item_upgrade_wrapper.upgraded_property,
				%% io:format("template_id:~p, UpgradeTempId:~p~n", [TempId, UpgradeTempId]),
				UpgradeItemProperty = get_upgrade_properties(ItemTplt, 
									     Property, 
									     UpgradedProperty),
				UpgradeItemTplt = tplt:get_data2(item_tplt, UpgradeTempId),
				SubId = UpgradeItemTplt#item_tplt.sub_id,
				[HouseFur#house_furniture{template_id=SubId,
							  item_tempid=UpgradeTempId,
							  property=UpgradeItemProperty}|Fur]
			end
		end, [], UpgradeFurnitures).

replace_fur_vec(NUpgradeFurnitures, HouseData) ->
    FurVec = house_data:get_furniture_vec(HouseData),
    NNFurVec = 
	lists:foldl(fun(#house_furniture{instance_id=InstId}=HouseFur, NFurVec) ->
			    lists:keyreplace(InstId, #house_furniture.instance_id, NFurVec, HouseFur)
		    end, FurVec, NUpgradeFurnitures),
    house_data:set_furniture_vec(HouseData, NNFurVec).

do_mutli_upgrade(UpgradePropertys, UpgradeFurnitures, HouseData) ->
    DecDiamond = get_upgrade_diamond(UpgradePropertys),
    NHouseData = house_diamond:dec_diamond(DecDiamond, HouseData),
    NUpgradeFurnitures = update_furnitures_property(UpgradePropertys, UpgradeFurnitures),
    NNHouseData = replace_fur_vec(NUpgradeFurnitures, NHouseData),
    Decoration = furniture_property:get_decoration(NNHouseData),
    NNNHouseData = NNHouseData#house_data{decoration=Decoration},
    db:write(NNNHouseData),
    {NUpgradeFurnitures, NNNHouseData}.

upgrade(Account, ItemInstanceId)->
    Fun = fun()->
		  try
		      HouseId = db_pair_player:get_house_id(Account),
		      HouseData = db_house:select(HouseId),
		      HousePack = house_lover_package:get_lover_package(HouseData),
		      InstanceItem = 
			  case house_lover_package:get_item(ItemInstanceId, HousePack) of
			      {false, _}->
				  throw({validate, item_no_exist});
			      OKItem->
				  OKItem
			  end,
		      #item{template_id=ItemId, del_time=DelTime} = InstanceItem,
		      #item_tplt{upgrade_id=ItemSubId} = tplt:get_data2(item_tplt, ItemId),
		      ItemUpgradeWrapper =
			  case get_item_upgrade(ItemInstanceId, ItemSubId) of
			      null->
				  throw({validate, item_cant_upgrade});
			      IUW->
				  IUW
			  end,
		      #item_upgrade_wrapper{consume_items=ConsumeItems, 
					    consume_diamond=ConsumeDiamond, 
					    upgraded_item_id=UpgradeItemId, 
					    upgraded_property=UpgradeProperty} = ItemUpgradeWrapper,
		      case UpgradeItemId of 
			  0->
			      throw({validate, item_cant_upgrade});
			  _->
			      ok
		      end,
		      %% RevertAction = [],
		      %% 扣除水晶或者Q点
		      HouseDiamond = house_diamond:get_lover_diamond(HouseData),
		      ReduceDiamondHouseData = 
			  case HouseDiamond >= ConsumeDiamond of 
			      true->
				  house_diamond:dec_diamond(ConsumeDiamond, HouseData);
			      false ->
				  throw({validate, consumediamond_no_enough})
			  end,
		      {ReduceCIHouseData, MLCI} = 
			  case ConsumeItems of
			      []->
				  {ReduceDiamondHouseData, []};
			      _->
				  case house_lover_package:del_n_by_tempid(ConsumeItems, HousePack) of
				      {false, _} ->
					  throw({validate, consumeitem_no_enough});
				      {ReduceItemPack, TempMLCI} ->
					  {house_lover_package:set_lover_package(ReduceItemPack, ReduceDiamondHouseData), TempMLCI}
				  end
			  end,
		      {ReduceOriginalHouseData, MLRO} = house_pack:del_items([InstanceItem], ReduceCIHouseData),
		      ItemTplt = tplt:get_data2(item_tplt, ItemId),
		      UpgradeItemProperties = get_upgrade_properties(ItemTplt, InstanceItem#item.property, UpgradeProperty),
		      UpgradeItemNotDelTime = item:make_item(UpgradeItemId, UpgradeItemProperties),
		      UpgradeItem = UpgradeItemNotDelTime#item{del_time=DelTime},
		      {AddUpgradeHousePack, MLAU}= house_lover_package:add_items([UpgradeItem],  
										 house_lover_package:get_lover_package(ReduceOriginalHouseData)),
		      AddUpgradeHouseData = house_lover_package:set_lover_package(AddUpgradeHousePack, ReduceOriginalHouseData),
		      MLALL = MLCI ++ MLRO ++ MLAU,
		      db:dirty_write(AddUpgradeHouseData),
		      {ok, UpgradeItem, AddUpgradeHouseData, 
		       [#notify_lover_diamond{amount=house_diamond:get_lover_diamond(AddUpgradeHouseData)} | MLALL]}

		  catch
		      throw:{validate, Reason}->
			  {error, Reason}
		  end
	  end,
    db:transaction(Fun).

get_item_upgrade(InstId, ItemSubId)->
    case tplt:get_data2(item_upgrade_tplt, ItemSubId) of
    	#item_upgrade_tplt{consume_items=ConsumeItems, 
			   consume_diamond=ConsumeDiamond, 
			   upgraded_item_id=UpgradeItemId, 
			   upgraded_property=UpgradeProperty} ->
	    CIWrappers = [{ItemId, ItemCount} || {_GoodsId, ItemId, ItemCount} <-
						     util:eval(binary_to_list(ConsumeItems) ++ ".")],
	    #item_upgrade_wrapper{inst_id=InstId,
				  item_sub_id=ItemSubId, 
				  consume_items=CIWrappers,
				  consume_diamond=ConsumeDiamond, 
				  upgraded_item_id=UpgradeItemId, 
				  upgraded_property=UpgradeProperty};
	_ ->
	    null
    end.

%% 衣服
get_upgrade_properties(#item_tplt{type=1}=ItemTplt, Properties, UpgradedProperty)->
    get_upgrade_properties(ItemTplt, Properties, UpgradedProperty, "charm");
%% 家具
get_upgrade_properties(#item_tplt{type=2}=ItemTplt, Properties, UpgradedProperty)->
    get_upgrade_properties(ItemTplt, Properties, UpgradedProperty, "decoration");

get_upgrade_properties(_ItemTplt, Properties, _UpgradedProperty) 
  when is_list(Properties) ->
    Properties.


get_upgrade_properties(#item_tplt{type=ItemType, property_id=PropertyId},
		       Properties, UpgradedProperty, PropertyKey) when is_list(Properties) ->
    data_helper:format("Properties:~p~n", [Properties]),
    case [Property || Property <- Properties, Property#item_property.key == PropertyKey] of
	[]->
	    OldValue = tplt:get_property_value(ItemType, PropertyId),
	    [#item_property{key=PropertyKey, value=OldValue+UpgradedProperty}|Properties];
	[#item_property{value=OldValue}=ItemProperty]->
	    [#item_property{key=PropertyKey, value=OldValue+UpgradedProperty}|lists:delete(ItemProperty, Properties)]
	end.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%% 修复未升级物品 by hongjx
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
gm_upgrade(#house_data{furniture_vec=FurList, lover_package=Pack}=HouseData) ->
    NFurList = [gm_upgrade(furniture_property:update_property_field(X)) || X <- FurList],    
    NPack = pack:convert_item(fun gm_upgrade/1, Pack),
    HouseData#house_data{furniture_vec=NFurList, lover_package=NPack};
gm_upgrade(#item{template_id=ItemId, property=P}=Item) ->
    NewP = gm_upgrade_property(ItemId, P),
    Item#item{property=NewP};
gm_upgrade(#house_furniture{item_tempid=ItemId, property=P}=Fur) ->
    NewP = gm_upgrade_property(ItemId, P),
    Fur#house_furniture{property=NewP}.

need_upgrade(ItemId, P) ->
    case P of
	[] ->
	    #item_tplt{level=Level} = tplt:get_data2(item_tplt, ItemId),
	    case Level > 1 of
		true ->
		    true;
		_ -> 
		    false
	    end;
	_ ->
	    false
    end.

gm_upgrade_property(ItemId, P) when is_list(P) ->
    case need_upgrade(ItemId, P) of
	true ->
	    #item_base_tplt{base_item_id=BaseItemId} = tplt:get_data2(item_base_tplt, ItemId),
	    
	    %% 加总
	    Sum = sum(BaseItemId, ItemId, 0),
	    ItemTplt = tplt:get_data2(item_tplt, BaseItemId),
	    get_upgrade_properties(ItemTplt, P, Sum);
	_ ->
	    P
    end.

%% 加总属性值
sum(BaseItemId, BaseItemId, Total) ->
    Total;
sum(BaseItemId, DestItemId, Total) ->
    #item_tplt{upgrade_id=ItemSubId} = tplt:get_data2(item_tplt, BaseItemId),
    case tplt:get_data(item_upgrade_tplt, ItemSubId) of
	#item_upgrade_tplt{upgraded_item_id=NewItemId, 
			   upgraded_property=AddValue} ->	    
	    case DestItemId of
		NewItemId ->
		Total + AddValue;
		_ ->
		    sum(NewItemId, DestItemId, Total + AddValue)
	    end;
	_ ->
	    Total
    end.
		

