%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%%
%%% @end
%%% Created :  4 Jun 2012 by LinZhengJian <linzhj@35info.cn>

-module(furniture_property).

-include("packet_def.hrl").
-include("common_def.hrl").
-include("enum_def.hrl").
-include("tplt_def.hrl").
-include("house_data.hrl").

-export([get_decoration/1, update/1, update_property_field/1]).

-spec get_decoration(#house_data{})->integer().
get_decoration(#house_data{furniture_vec=Furnitures, template_id=TemplateId})->
    FurnitureDecoration = 
	lists:foldl(
	  fun(Fur, AccDecoration)->
		  AccDecoration + get_decoration1(Fur)
	  end, 0, Furnitures),
    #house_tplt{internal_decoration=Internal} = tplt:get_data(house_tplt, TemplateId),
    FurnitureDecoration + Internal.
    

get_property_value(PropertyList, Key)->
    case lists:keyfind(Key, #item_property.key, PropertyList) of
	false -> 
	    false;
	#item_property{value=Value} when is_integer(Value) ->
	    Value
    end.


get_decoration1(#house_furniture{item_tempid=ItemId, property=P})->
    case get_property_value(P, "decoration") of
	N when is_integer(N) ->
	    N;
	_ ->
	    case tplt:get_property(tplt:get_data(item_tplt, ItemId)) of
		#furniture_additional_properties_tplt{decoration=Decoration}->
		    Decoration;
		_->
		    0
	    end
    end.    
    
update(#house_data{furniture_vec=L}=HouseData) ->
    case L of
	[] ->
	    unchanged;
	_ ->	    
	    HD = hd(L),
	    case HD of
		#house_furniture{} -> %% 数据已升级过
		    unchanged;
		_ -> %% 未升级过
		    NewL = update_property_field(L),
		    HouseData#house_data{furniture_vec=NewL}
	    end
    end.

update_property_field(L) when is_list(L) ->
    [update_property_field(X) || X <- L];
update_property_field(#house_furniture{}=T) ->
    T;
update_property_field(T) when is_tuple(T) ->
    #house_furniture{}=erlang:append_element(T, []).  

    
