%%% @author  <hjx>
%%% @copyright (C) 2010, 
%%% @doc
%%%   ��ұ༭����
%%% @end
%%% Created : 31 May 2010 by  <hjx>

-module(player_edit_house).

-include("packet_def.hrl").
-include("mutex_actions.hrl").
-include("router.hrl").
-include("enum_def.hrl").
-include("common_def.hrl").
-include("sys_msg.hrl").
-include("tplt_def.hrl").
-include("house_data.hrl").
-include("resource.hrl").
-include("records.hrl").


-behaviour(gen_action).


-export([handle_cast/2, start/1]).
-export([do_start_action/2, do_stop_action/2]).


start(Account) ->
    [
     router:make_event_source(?msg_req_change_furnitures, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_end_edit_house, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_start_edit_house, Account, {Account, ?MODULE})
    ].


%%%===================================================================
%%% ������ػص�����
%%%===================================================================


%% ��ʼ����
%% ����NewState || {false, Error} || {false, Error, Params} 
%% ������ҽ����װģʽ����
do_start_action(_Param, State) ->    
    SceneName = player_data:get_scene_name(State),
    Account = player_data:get_account(State),
    %% ��ʼ�༭����
    case router:send(SceneName, start_edit_house, Account) of
	ok ->
	    net_helper:send2client(Account, #notify_start_edit_house{result=1}),
	    
	    State;
	Err -> Err
    end.

%% �����༭����
%% �Զ�����ʱ��Param ��ʽΪ {auto_stop, Reason}, �������Ϊcall_stop_action�����Param
%% �Զ���������ʱ��: ��ǰ�������¶���ֹͣʱ�����˳���Ϸʱ
do_stop_action(_Param, State) ->    
    SceneName = player_data:get_scene_name(State),
    Account = player_data:get_account(State),

    router:send(SceneName, end_edit_house, Account),
    net_helper:send2client(Account, #notify_end_edit_house{}),

    State.


%%%===================================================================
%%% ����handle_cast
%%%===================================================================

%% ������ҽ����װģʽ����
handle_cast({_Msg, #req_start_edit_house{}}, State) ->
    NewState = mutex_actions:try_start_action(?action_type_edit_house, undefined, State),
    case mutex_actions:contains_action(?action_type_edit_house, NewState) of
	false ->
	    Account = player_data:get_account(State),
	    net_helper:send2client(Account, #notify_start_edit_house{result=0});
	_ ->
	    SceneName = player_data:get_scene_name(State),
	    router:send(SceneName, stop_use_all_furniture),
	    ok
    end,
    {noreply, NewState};

%%-----------------------------���ݱ༭���------------------------------------------
%% �ύ��װ�����޸�
handle_cast({_Msg, #req_change_furnitures{buy_goods_list=GoodsList,
					  move_furnitures=MoveFurs}=Req}, State)->

    Account = player_data:get_account(State),
    TotalLoveCoinPrice = calc_love_coin_goods_price(GoodsList),
    %% ��֯�ص�����
    ShipCallback = 
	fun(#order{status=Status}=_Order)-> 			   
		case (Status =:= ?order_payed) of
		    true ->
			F = fun() ->
				    [PlayerBasicData] = db:read(player_basic_data, Account),
				    HouseID = player_basic_data:get_house_id(PlayerBasicData),
				    [HouseData] = db:read(house_data, HouseID),
				    case house_edit:req_change_furnitures(Account, Req, HouseData) of
					{ok, NHouseData} ->
					    %% д���ݿ�
					    ok = db:write(NHouseData),

					    %% %% ÿ���Ҿ߼Ӿ���
					    %% AddExp = length(GoodsList) * common_def:get_val(buy_per_furniture_add_exp),

					    %% {_NewBasicData, NewHouseData, MsgList} = house_level_exp:add_exp(AddExp, PlayerBasicData, NHouseData),	
					    {ok, NHouseData, HouseData};
					Other ->
					    Other
				    end
			    end,
			notify_edit_house(Account, GoodsList, MoveFurs, F, State);
		    _ ->
			?pay_error
		end
	end,
    player_love_coin:pay([{0, 1, TotalLoveCoinPrice}], ShipCallback, ?order_goods_meta_clothes, State),
    {noreply, State};
%% ������ҽ�����װģʽ����
handle_cast({#msg{event=?msg_req_end_edit_house}, #req_end_edit_house{}}, State) ->
    NewState = mutex_actions:call_stop_action(?action_type_edit_house, State),
    {noreply, NewState}.


do_log(HouseID, Account, GoodsList, LoginType) ->
    L = [GoodsID || #furniture_goods_data{goods_id=GoodsID} <- GoodsList],
    sysshop:log_buy(HouseID, Account, L, LoginType).


notify_buy_goods(Account, GoodsList) ->
    ItemList = [begin
		    #sys_shop_tplt{item_id=ItemID} = tplt:get_data(sys_shop_tplt, GoodsID),
		    ItemID	     
		end || #furniture_goods_data{goods_id=GoodsID} <- GoodsList],
    %% ֪ͨ����ģ�����¼�����
    router:cast(Account, buy_goods_event, ItemList).


calc_love_coin_goods_price(GoodsList) when is_list(GoodsList) ->
    F = fun(#furniture_goods_data{goods_id=GoodsID}, TotalPrice) ->
		TotalPrice + get_love_coin_goods_price(GoodsID)
	end,
    lists:foldl(F, 0, GoodsList).

get_love_coin_goods_price(GoodsID) ->
    case tplt:get_data(sys_shop_tplt, GoodsID) of
	#sys_shop_tplt{money_type=MoneyType, price=Price} -> 
	    case MoneyType == ?mt_love_coin of
		true ->
		    Price;
		false ->
		    0
	    end;
	empty -> 
	    erlang:error({badarg, GoodsID})
    end.

notify_edit_house(Account, GoodsList, MoveFurs, F, State) ->
    %% ������ύ���ݿ�����
    case db:transaction(F) of
	{false, Err} ->
	    net_helper:send2client(Account,				   
				   #notify_change_furnitures_fail{error_code=Err,
								  unfind_bag_items=[]}),
	    ?pay_error;
	{unfind_items, UnfindItems} ->
	    net_helper:send2client(Account,				   
				   #notify_change_furnitures_fail{error_code=0,
								  unfind_bag_items=UnfindItems}),
	    ?pay_error;
	{ok, #house_data{house_id=HouseID}=NewHouse, OldHouse} ->	    
	    SceneName = house:get_house_name(NewHouse#house_data.house_id),
	    LoginType = player_data:get_login_type(State),
	    %% ��Ʒ��Ǯ��¼
	    do_log(HouseID, Account, GoodsList, LoginType),

	    %% ֪ͨ����ģ��
	    notify_buy_goods(Account, GoodsList),

	    %% %% ֪ͨ�ͻ���
	    %% house_level_exp:send_msgs(Msgs, NewHouse),

	    house_edit:notify_change_furnitures(NewHouse, OldHouse, 
						MoveFurs, SceneName, Account),

	    farm:broadcast_farm_data(State, NewHouse),
	    router:cast(Account, on_decoration_change, furniture_property:get_decoration(NewHouse)),
	    ?pay_shipped
    end.
