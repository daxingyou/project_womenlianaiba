%%%-------------------------------------------------------------------
%%% @author  <linyibin>
%%% @copyright (C) 2010, 
%%% @doc
%%% �Ҿߴ���ģ��
%%% @end
%%% Created : 24 May 2010 by  <>
%%%-------------------------------------------------------------------
-module(furniture).

-include("enum_def.hrl").
-include("tplt_def.hrl").
-include("packet_def.hrl").
-include("sys_msg.hrl").
-include("common_def.hrl").
-include("house_data.hrl").

%% API
-export([get_status/1, get_position_index/1]).


-export([is_exist/2, get/2, add/2, new/10, new/9, new/8, replace/3, delete/2]).
-export([get_tempid/1, get_instid/1, get_itemid/1]).

-export([convert_furnitures_to_items/2]).

-define(NormalStatus, 1).
-define(KeepStatus, 2).

%%%===================================================================
%%% API
%%%===================================================================
get_status(#furniture_position{status=Status}) ->
    Status.

get_position_index(#furniture_position{position_index=PositionIndex}) ->
    PositionIndex.



%% �ж�ָ���ļҾ��Ƿ����
%% ����ֵ, ����:true, ������:false
-spec is_exist(integer(), tuple()) -> atom().
is_exist(InstanceID, #house_data{furniture_vec=FurVec}) ->
    case lists:keyfind(InstanceID, 2, FurVec) of
	false ->
	    false;
	_ ->
	    true
    end.

%% ���ָ���ļҾ�
-spec get(integer(), tuple()) -> atom() | tuple().
get(InstanceID, #house_data{furniture_vec=FurVec}) ->
    case lists:keyfind(InstanceID, 2, FurVec) of
    	false ->
    	    false;
    	Furniture ->
    	    Furniture
    end.

%% ȡ��Ʒģ��id
get_itemid(#house_furniture{item_tempid=ItemTempID}) ->
    ItemTempID.
%% ȡ�Ҿ�ģ��id
get_tempid(#house_furniture{template_id=TemplateID}) ->
    TemplateID.
%% ȡ�Ҿ�ʵ��id
get_instid(#house_furniture{instance_id=InstanceID}) ->
    InstanceID.


add(FurnitureList, FurnitureVec) when is_list(FurnitureList) ->
    FurnitureList ++ FurnitureVec;
add(Furniture, FurnitureVec) ->
    [Furniture | FurnitureVec].

new(ItemTempID, InstanceID, TemplateID, X, Z, Height, Floor, Face)->
    DelTime = item:get_del_time(ItemTempID),
    new(ItemTempID, InstanceID, TemplateID, X, Z, Height, Floor, Face, DelTime).
new(ItemTempID, InstanceID, TemplateID, X, Z, Height, Floor, Face, DelTime)->
    new(ItemTempID, InstanceID, TemplateID, X, Z, Height, Floor, Face, DelTime, []).
new(ItemTempID, InstanceID, TemplateID, X, Z, Height, Floor, Face, DelTime, Property)->
    #house_furniture{item_tempid=ItemTempID, instance_id=InstanceID, 
		     template_id=TemplateID, x=X, z=Z,
		     height=Height, floor=Floor, face=Face,
		     status=0, del_time=DelTime, property=Property
		    }.

%% �滻�Ҿ�
-spec replace(integer(), tuple(), tuple()) -> any().
replace(InstanceId, #house_data{furniture_vec=FurVec}=HouseData, Furniture) ->
    case is_exist(InstanceId, HouseData) of
	true ->
	    lists:keyreplace(InstanceId, 2, FurVec, Furniture);
	_ ->
	    ok
    end.


%% ɾ���Ҿ�
delete(IDList, #house_data{furniture_vec=FurVec} = HouseData) ->
    FurVec1 = delete(IDList, FurVec),
    HouseData#house_data{furniture_vec=FurVec1};
delete(IDList, FurnitureVec) when is_list(IDList) ->
    [X || X <- FurnitureVec, 
	  not lists:member(X#house_furniture.instance_id, IDList)];
delete(FurnitureID, FurnitureVec) ->
    lists:keydelete(FurnitureID, 2, FurnitureVec).


convert_furnitures_to_items(FurList, DropItems) ->
    NewList = furniture_property:update_property_field(FurList),
     
    %% [X || {A, B}=X <- [a, b, {c, d}]].
    %% ���Ϊ[{c, d}]
    ItemCount = 1,
    [begin 
	 #house_furniture{instance_id=InstanceID, item_tempid=ItemTempID, del_time=DelTime, property=P} = X,
	 {item:new(ItemTempID, InstanceID, DelTime, P), ItemCount} 
     end || X <- NewList, 
	    not lists:member(X#house_furniture.item_tempid, DropItems)].


%%%===================================================================
%%% ���Ժ���
%%%===================================================================
