%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%
%%% @end
%%% Created : 19 Apr 2012 by hongjx <hongjx@35info.cn>

-module(house_use_furniture).

-include("router.hrl").
-include("gen_scene.hrl").
-include("house_data.hrl").
-include("sys_msg.hrl").
-include("tplt_def.hrl").

-export([start/1]).
-export([handle_call/3]).



start(SceneName)->
    [
     router:make_event_target(change_furniture_status, SceneName, {self(), ?MODULE})
    ].


handle_call({#msg{event=change_furniture_status}, {Account, FurInstID, FunID, OldStatus}}, _From, 
	    State) ->
    %% 改变家具使用状态
    HouseID = house:get_house_id(State),

    F = fun() ->
		[HouseData] = db:read(house_data, HouseID),
		NHouseData = 
		    case house:open_or_close_lights(HouseData) of
			unchanged -> HouseData;
			HouseData0 -> HouseData0
		    end,

		#house_data{furniture_vec=FurList} = NHouseData,

		case change_furniture_status(FurInstID, FurList, OldStatus) of
		    {false, Err} -> 
			{false, Err};
		    {NewFurList, NewStatus} ->
			NNHouseData = NHouseData#house_data{furniture_vec=NewFurList},
			db:write(NNHouseData),
			{ok, NewStatus}
		end
	end,
    
    case db:transaction(F) of
	{false, Err} -> 
    	    sys_msg:send(Account, Err);
	{ok, NewStatus} ->
	    Packet = #notify_change_furniture_status{account=atom_to_list(Account),
						     instance_id=FurInstID,
						     function_id=FunID,
						     new_status=NewStatus
						    },
	    
	    gen_scene:broadcast_all_players(State, Packet)
    end,    

    {reply, ok, State}.

%%%===================================================================
%%% 内部函数
%%%===================================================================

change_furniture_status(FurInstID, FurList, OldStatus) when is_list(FurList),
						 is_integer(FurInstID) ->
    Index = #house_furniture.instance_id,
    case lists:keyfind(FurInstID, Index, FurList) of
	false ->
	    {false, ?err_target_is_empty};
	#house_furniture{template_id=FurTempID}=Fur ->		
	    NewStatus = get_next_status(OldStatus, FurTempID), 
	    NewFurList = lists:keyreplace(FurInstID, Index, FurList, Fur#house_furniture{status=NewStatus}),
	    {NewFurList, NewStatus}
    end.

get_next_status(OldStatus, FurTempID) ->    
    #furni_tplt{status_qty=N} = tplt:get_data(furni_tplt, FurTempID),
    Max = N + 1,
    NewStatus = OldStatus + 1,
    case NewStatus < Max of
	true -> NewStatus;
	_ -> 0
    end.


