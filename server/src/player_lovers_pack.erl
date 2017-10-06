%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2011, hongjx
%%% @doc
%%%   情侣包裹相关操作
%%% @end
%%% Created : 25 Nov 2011 by hongjx <hongjx@35info.cn>

-module(player_lovers_pack).
-include("packet_def.hrl").
-include("router.hrl").
-include("enum_def.hrl").


-export([handle_cast/2, start/1]).



start(Account) ->
    [
     router:make_event_source(?msg_req_delete_lover_item, Account, {Account, ?MODULE})
    ].


%%%===================================================================
%%% 处理handle_cast
%%%===================================================================
%% 请求回收情侣共用的物品
handle_cast({_Msg, #req_delete_lover_item{item_inst_ids=ItemInstIDs}}, State) ->
    Account = player_data:get_account(State),
    PlayerBasicData = select(Account),
    HouseID = player_basic_data:get_house_id(PlayerBasicData),
    [house_lover_package:recycle_lover_item(HouseID, Account, ItemInstID) || ItemInstID <- ItemInstIDs],
    {noreply, State}.

select(Account) ->
    F = fun() ->
		db:read(player_basic_data, Account)
	end,
    case db:transaction(F) of
	[] ->
	    [];
	[Data] -> Data
    end.
    



