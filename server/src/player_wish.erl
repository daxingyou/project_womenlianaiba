%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%% 许愿单
%%% @end
%%% Created : 12 Mar 2012 by LinZhengJian <linzhj@35info.cn>

-module(player_wish).

-include("records.hrl").
-include("common_def.hrl").
-include("packet_def.hrl").
-include("player_data.hrl").
-include("resource.hrl").
-include("router.hrl").
-include("house_data.hrl").
-include("enum_def.hrl").
-include("tplt_def.hrl").

-export([start/1, handle_cast/2]).

-export([add/3, delete/1, satisfy/3]).

-export([get_wish_type/1, get_wish_id/1]).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%    message handler
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

start(Account)->
    [router:make_event_source(?msg_req_wish_add, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_wish_delete, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_wish_satisfy, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_wish_list, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_wish_history_list, Account, {Account, ?MODULE})
    ].

get_wish_type(PlayerWish) ->
    PlayerWish#player_wish.wish_type.

get_wish_id(PlayerWish) ->
    PlayerWish#player_wish.wish_id.

handle_cast({#msg{event=?msg_req_wish_add}, #req_wish_add{goods_id=GoodsID, wish_type=WishType}}
	    , #player_data{account=Account}=State) ->
    Limitation = common_def:get_val(limitation_of_player_wish),
    case length(get_list(Account)) of 
	Count when Count < Limitation ->
	    Wish = add(Account, GoodsID, WishType),
	    net_helper:send2client(Account, #notify_wish_add{wish=Wish});
	_ ->
	    net_helper:send2client(Account, #notify_wish_add_fail{message=?message_wish_exceeded})
    end,
    {noreply, State};

handle_cast({#msg{event=?msg_req_wish_delete}, #req_wish_delete{wish_id=WishID}}
	    , #player_data{account=Account}=State) ->
    delete(WishID),
    net_helper:send2client(Account, #notify_wish_delete{wish_id=WishID}), 
    {noreply, State};

handle_cast({#msg{event=?msg_req_wish_satisfy}, #req_wish_satisfy{wish_id=WishID}}, State) ->
    satisfy(WishID, State, fun satisfy_notify_callback/1),
    {noreply, State};

handle_cast({#msg{event=?msg_req_wish_list}, #req_wish_list{account=WishAccount}}
	    , #player_data{account=Account}=State) ->
    WishList = get_list(list_to_atom(WishAccount)),
    net_helper:send2client(Account, #notify_wish_list{wish_list=WishList}),
    {noreply, State};

handle_cast({#msg{event=?msg_req_wish_history_list}, #req_wish_history_list{account=WishAccount}}
	    , #player_data{account=Account}=State) ->
    WishList = get_history_list(list_to_atom(WishAccount)),
    net_helper:send2client(Account, #notify_wish_history_list{history_list=WishList}),
    {noreply, State};

handle_cast(_Event, State)->
    {noreplay, State}.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%    API Functions  
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
add(Account, GoodsID, WishType)->
    WishID = guid:make(?st_wish),
    PlayerWish = #player_wish{wish_id=WishID, account=Account, goods_id=GoodsID, wish_time=datetime:localtime(), wish_type=WishType},
    db:dirty_write(PlayerWish),
    convert_wish(PlayerWish, Account).

delete(WishID)->
    db:dirty_delete(player_wish, WishID).

get_list(Account)->
    WishList = db_wish:get_wish_list(Account),
    [convert_wish(Wish, Account)|| Wish <- WishList].

convert_wish(#player_wish{wish_id=WishID, goods_id=GoodsID, wish_time=WishTime, wish_type=WishType}, Account)->
    #player_love_wish{wish_id=WishID, account=Account, goods_id=GoodsID, wish_time=WishTime, wish_type=WishType}.

add_history(Account, GoodsID, SatisfyAccount, WishType)->
    {Histories, Count} = 
	case db:read(player_wish_histories, Account) of
	    []->
		{[], 0};
	    [#player_wish_histories{histories=HistoryList, count=ExistsCount}]->
		{HistoryList, ExistsCount}
	end,
    Limitation = common_def:get_val(limitation_of_player_wish_history) - 1,
    NHistories = [#player_wish_history{goods_id=GoodsID, satisfy_account=SatisfyAccount, wish_type=WishType}|lists:sublist(Histories, Limitation)],
    db:dirty_write(#player_wish_histories{account=Account, histories=NHistories, count=Count+1}).

get_history_list(Account)->
    case db:dirty_read(player_wish_histories, Account) of
	[]->
	    [];
	[#player_wish_histories{histories=Histories}] ->
	    [convert_history(HistoryItem) || HistoryItem <- Histories]
    end.

convert_history({player_wish_history, GoodsID, SatisfyAccount})->
    #player_love_wish_history{goods_id=GoodsID, satisfy_account=SatisfyAccount, wish_type=1};

convert_history(#player_wish_history{goods_id=GoodsID, satisfy_account=SatisfyAccount, wish_type=WishType})->
    #player_love_wish_history{goods_id=GoodsID, satisfy_account=SatisfyAccount, wish_type=WishType}.

satisfy(WishID, PlayerData, NotifyCallback)->
    F = fun()-> do_satisfy(WishID, PlayerData, NotifyCallback)
	end,
    db:transaction(F).

do_satisfy(WishID, PlayerData, NotifyCallback)->
    % 检查WishID是否存在
    % 检查Account的金额是否足够
    % 更新Account金额
    % 删除Wish
    % 添加Wish History
    % 添加包裹
    validate_wish({WishID, PlayerData}, [], NotifyCallback).

validate_wish({WishID, #player_data{account=SatisfyAccount}=PlayerData}, MessageAcc, NotifyCallback)->
    case db:read(player_wish, WishID) of 
	[#player_wish{wish_type=WishType, account=Account, goods_id=GoodsID}=PlayerWish]->
	    case WishType of
		?wt_house -> %% 房屋许愿
		    PlayerSpecialHouseTplt = tplt:get_data(player_special_house_tplt, GoodsID),
		    LoveCoin = PlayerSpecialHouseTplt#player_special_house_tplt.love_coin,
		    ShipCallback = 
			fun(#order{status=Status}=_Order)-> 			   
				case (Status =:= ?order_payed) of
				    true ->
					do_wish(Account, SatisfyAccount, WishID, PlayerWish, PlayerSpecialHouseTplt),
					?pay_shipped;
				    _ ->
					?pay_error
				end				       
			end,

		    player_love_coin:pay([{0, 1, LoveCoin}], 
					 ShipCallback, 
					 ?order_goods_meta_special_house, PlayerData);
		_ ->
		    buy({WishID, PlayerData}, PlayerWish, MessageAcc, NotifyCallback)
	    end;
	_ ->
	    NotifyCallback(satisfy_fail(WishID, SatisfyAccount, MessageAcc, ?message_wish_satisfy_fail))
    end.

do_wish(Account, SatisfyAccount, WishID, PlayerWish, PlayerSpecialHouseTplt) ->
    GoodsID = PlayerWish#player_wish.goods_id,
    WishType = PlayerWish#player_wish.wish_type,
    Name = PlayerSpecialHouseTplt#player_special_house_tplt.name,
    BroadcastID = PlayerSpecialHouseTplt#player_special_house_tplt.broadcast_id,
    [PlayerBasicData] = db:dirty_read(player_basic_data, Account),
    UserName = player_basic_data:get_username(PlayerBasicData),
    F = fun() ->
		PlayerSpecialHouse = player_special_house:get_player_special_house(Account),
		NPlayerSpecialHouse = player_special_house:add_unlock(GoodsID, PlayerSpecialHouse),
		db:write(NPlayerSpecialHouse),
		do_after_buy(Account, GoodsID, SatisfyAccount, WishID, WishType)

	end,
    db:transaction(F),
    net_helper:send2client(SatisfyAccount, #notify_wish_satisfy_successfully{wish_id=WishID}),
    %% 发送系统广播
    sys_broadcast:send(BroadcastID, [util:to_string(UserName), util:to_string(Name)]).

do_after_buy(Account, GoodsID, SatisfyAccount, WishID, WishType) ->
    add_history(Account, GoodsID, SatisfyAccount, WishType),
    %% 增加亲密度
    player_intimate:add_player_intimate(SatisfyAccount, Account, common_def:get_val(intimate_of_wish)),
    db:delete({player_wish, WishID}).


buy({WishID, #player_data{account=SatisfyAccount}=PlayerData}, #player_wish{goods_id=GoodsID, account=Account, wish_type=WishType},  MessageAcc, NotifyCallback)->
    LoginType = player_data:get_login_type(PlayerData),
    GoodsCost = sysshop:calc_goods_cost([GoodsID], LoginType),
    [ItemId] = sysshop:get_item_id([GoodsID]),
    F = fun(MessageAcc1)->
		do_after_buy(Account, GoodsID, SatisfyAccount, WishID, WishType),
		ship({WishID, SatisfyAccount}, ItemId, Account, MessageAcc1)
	end,
    consume({WishID, PlayerData}, Account, ItemId,GoodsID, GoodsCost, MessageAcc, F, NotifyCallback).

consume({WishID, PlayerData}, Recver, ItemID, GoodsID, GoodsCost, MessageAcc, ShipHandler, NotifyCallback)->
    #player_data{account=SatisfyAccount}=PlayerData,
    HouseID = db_pair_player:get_house_id(SatisfyAccount),
    [HouseData] = db:read(house_data, HouseID),
    case GoodsCost of
	{0,QCoin}->
	    ReqItemList = [{GoodsID, 1, QCoin}],
	    ShipCallback = 
		fun(#order{status=Status}=ShipOrder)-> 			   
			data_helper:format("Order:~p~n", [ShipOrder]),
			case Status of 
			    ?order_payed->
				F = fun()-> ShipHandler(MessageAcc) end,
				MessageList = db:transaction(F),
				HouseId = db_pair_player:get_house_id(SatisfyAccount),
				[NewHouse]=db:dirty_read(house_data,HouseId),

				house_diamond:notify(NewHouse),
				
				%% 物品金钱记录
				item_money_log:log_satisfy_wish(SatisfyAccount, Recver, ItemID, {?mt_love_coin, QCoin}, HouseId), 
				NotifyCallback(MessageList),
				?pay_shipped; %% 成功发货
			    _ ->
				?pay_error
			end
		end,
	    player_love_coin:pay(ReqItemList, ShipCallback, ?order_goods_meta_wish, PlayerData),
	    ok;
	{DiamondCost, 0}->
	    case house_diamond:get_lover_diamond(HouseData) >= DiamondCost of
		true->
		    HouseData1 = house_diamond:dec_diamond(DiamondCost, HouseData),
		    db:write(HouseData1),
		    #house_data{house_id=HouseId}=HouseData1,
		    house_diamond:notify(HouseData1),
		    item_money_log:log_satisfy_wish(SatisfyAccount, Recver, ItemID, {?mt_diamond, DiamondCost}, HouseId), 
		    MessageList = ShipHandler(MessageAcc),
		    NotifyCallback(MessageList);
		false->
		    NotifyCallback(satisfy_fail(WishID, SatisfyAccount, MessageAcc, ?message_wish_satisfy_insufficient_balance))
	    end
    end.

ship({WishID, SatisfyAccount}, ItemID, Account, MessageAcc)->
    HouseID = db_pair_player:get_house_id(Account),
    [HouseData] = db:read(house_data, HouseID),
    ItemCount = 1,
    {HouseData1, Msgs} = house_pack:add_items([{ItemID, ItemCount}], HouseData),
    db:write(HouseData1),
    MessageAcc ++ [{SatisfyAccount, #notify_wish_satisfy_successfully{wish_id=WishID}} | 
		   house_lover_package:build_msgs(Msgs, HouseData1)].


satisfy_fail(WishID, Account, MessageAcc, Message)->
    MessageAcc ++ [{Account, #notify_wish_satisfy_fail{wish_id=WishID, message=Message}}].


satisfy_notify_callback(MessageList)->
    [net_helper:send2client(Target, Message) || {Target, Message} <- MessageList].
