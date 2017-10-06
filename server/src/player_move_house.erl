%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%  搬家
%%% @end
%%% Created : 12 May 2012 by hongjx <hongjx@35info.cn>

-module(player_move_house).


-include("packet_def.hrl").
-include("router.hrl").
-include("common_def.hrl").
-include("tplt_def.hrl").
-include("enum_def.hrl").
-include("sys_msg.hrl").
-include("player_data.hrl").
-include("records.hrl").
-include("resource.hrl").
-include("house_data.hrl").

-record(player_move_house, {account,
			    move_special_house_free_count   %% 搬特殊房屋免费的次数
			   }).

-export([handle_cast/2, 
	 start/1, 
	 notify/1,
	 new/1,
	 get_player_unlock_house/1, 
	 get_max_unlock_house/1,
	 get_player_move_house/1,
	 add_free_count_for_moving_special_house/2,
	 dec_free_count_for_moving_special_house/2,
	 set_free_count_for_moving_special_house/2,
	 get_move_special_house_free_count/1
	]).


%%%===================================================================
%%% API
%%%===================================================================
start(Account) ->
    [
     router:make_event_source(?msg_req_special_house_list, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_self_special_house_list, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_buy_special_house, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_buy_house_right, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_move_house, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_get_free_count_for_moving_special_house, Account, {Account, ?MODULE})
    ].

%%--------------------------------------------------------------------
%% @doc
%% @获取数据库内容
%% @end
%%--------------------------------------------------------------------
get_player_move_house(Account) ->
    case db:read(player_move_house, Account) of
	[] ->
	    new(Account);
	[PlayerMoveHouse] ->
	    PlayerMoveHouse
    end.

%%--------------------------------------------------------------------
%% @doc
%% @新建房屋数据
%% @end
%%--------------------------------------------------------------------
new(Account) ->
    #player_move_house{account=Account, 
		       move_special_house_free_count=0}.    

%%--------------------------------------------------------------------
%% @doc
%% @增加搬房屋的免费次数
%% @end
%%--------------------------------------------------------------------
add_free_count_for_moving_special_house(PlayerMoveHouse, Count) ->
    OldCount = get_move_special_house_free_count(PlayerMoveHouse),
    NCount = OldCount + Count,
    set_free_count_for_moving_special_house(PlayerMoveHouse, NCount).

%%--------------------------------------------------------------------
%% @doc
%% @扣除搬房屋的免费次数
%% @end
%%--------------------------------------------------------------------
dec_free_count_for_moving_special_house(PlayerMoveHouse, Count) ->
    OldCount = get_move_special_house_free_count(PlayerMoveHouse),
    NCount = OldCount - Count,
    case NCount > 0 of
	true ->
	    set_free_count_for_moving_special_house(PlayerMoveHouse, NCount);
	false ->
	    set_free_count_for_moving_special_house(PlayerMoveHouse, 0)
    end.

%%%===================================================================
%%% 处理handle_cast
%%%===================================================================
notify(Account) ->
    PlayerUnlockHouse = get_player_unlock_house(Account),
    Grade = get_max_unlock_house(PlayerUnlockHouse),
    net_helper:send2client(Account, #notify_house_right_grade{grade=Grade}).

%% 购买特殊产权房屋
handle_cast({_Msg, #req_buy_special_house{house_tplt_id=HouseTpltID}}, State) ->
    special_house_shop:buy_house(HouseTpltID, State), 
    {noreply, State};


%% 请求商店在售的特殊产权房屋
handle_cast({_Msg, #req_special_house_list{}}, State) ->
    Account = player_data:get_account(State),
    List = special_house_shop:get_goods_list(),
    net_helper:send2client(Account, 
			   #notify_special_house_list{house_list=List}),
    {noreply, State};

%% 取购买过的特殊产权列表
handle_cast({_Msg, #req_self_special_house_list{}}, State) ->
    Account = player_data:get_account(State),

    List = get_special_house_list(Account),
    net_helper:send2client(Account, 
			   #notify_self_special_house_list{house_list=List}),
    {noreply, State};

%% 购买产权等级
handle_cast({_Msg, #req_buy_house_right{grade=BuyGrade}}, State) ->
    Account = player_data:get_account(State),
    HouseRightTplt = tplt:get_data(house_right_tplt, BuyGrade),
    #house_right_tplt{money=CostMoney, money_type=?mt_diamond, 
		      material1=Material1, num1=Num1,
		      material2=Material2, num2=Num2,
		      material3=Material3, num3=Num3,
		      material4=Material4, num4=Num4} = HouseRightTplt,
    UnlockMaterial = [Material1, Material2, Material3, Material4],
    UnlockMaterialCount = [Num1, Num2, Num3, Num4],
    UnlockMaterials = util:recombine_items(UnlockMaterial, UnlockMaterialCount),

    HouseID = db_pair_player:get_house_id(Account),
    F = fun() ->
    		[HouseData] = db:read(house_data, HouseID),
		Money = house_diamond:get_lover_diamond(HouseData),
		NMoney = Money - CostMoney,
		PlayerUnlockHouse = get_player_unlock_house(Account),
    		case can_buy_right(BuyGrade, NMoney, UnlockMaterials, PlayerUnlockHouse, HouseData) of
    		    true ->
			NPlayerUnlockHouse = add_player_unlock_house(PlayerUnlockHouse, BuyGrade),
			NHouseData = house_diamond:set_lover_diamond(NMoney, HouseData), 
			{NNHouseData, Msgs} = house_pack:del_items_by_count(UnlockMaterials, NHouseData),
			db:write(NPlayerUnlockHouse),
    			db:write(NNHouseData),
			{NNHouseData, Msgs};
    		    Err ->
    			Err
    		end
    	end, 

    case db:transaction(F) of
    	{false, Err} -> 
    	    sys_msg:send(Account, Err);
    	{NHouseData, Msgs} ->
	    house_pack:send_msgs(Msgs, NHouseData),
	    router:cast(Account, on_buy_house, BuyGrade),
    	    house_diamond:notify(NHouseData),
	    net_helper:send2client(Account, #notify_house_right_grade{grade=BuyGrade})
    end,

    {noreply, State};

%%--------------------------------------------------------------------
%% @doc
%% @获取免费搬家次数
%% @end
%%--------------------------------------------------------------------
handle_cast({_Msg, #req_get_free_count_for_moving_special_house{}}, State) ->
    Account = player_data:get_account(State),
    F = fun() ->
		PlayerMoveHouse = get_player_move_house(Account),
		get_move_special_house_free_count(PlayerMoveHouse)
	end,
    case db:transaction(F) of
	FreeCount ->
	    net_helper:send2client(Account, #notify_get_free_count_for_moving_special_house{count=FreeCount})
    end,
    {noreply, State};

%% 搬家
handle_cast({_Msg, #req_move_house{new_house_tplt_id=NewHouseTpltID}}, State) ->
    Account = player_data:get_account(State),
    
    [PlayerBasicData] = db:dirty_read(player_basic_data, Account),
    AtHome = player_data:is_at_home(State, PlayerBasicData),
    HouseID = player_basic_data:get_house_id(PlayerBasicData),
    F = fun() ->
    		[HouseData] = db:read(house_data, HouseID),    
		PlayerMoveHouse = get_player_move_house(Account),
		HouseTplt = tplt:get_data(house_tplt, NewHouseTpltID),
		Cost = common_def:get_val(move_house_cost),
		Money = house_diamond:get_lover_diamond(HouseData),
		DecDiamond = get_move_house_need_diamond(Cost, PlayerMoveHouse, HouseTplt),
    		case can_move_house(Account, AtHome, Money - DecDiamond, HouseTplt, HouseData) of
    		    true ->
			LoveCoin = get_move_house_need_love_coin(HouseTplt#house_tplt.love_coin,
								 PlayerMoveHouse,
								 HouseTplt),
			ShipCallback = 
			    fun(#order{status=Status}=_Order)-> 			   
				    case (Status =:= ?order_payed) of
					true ->
					    {NHouseData, NPlayerMoveHouse} = do_move_house(NewHouseTpltID, 
											   DecDiamond, 
											   PlayerMoveHouse, 
											   HouseTplt,
											   HouseData),
					    {?pay_shipped, {NHouseData, NPlayerMoveHouse}};
					_ ->
					    ?pay_error
				    end				       
			    end,

			player_love_coin:pay([{0, 1, LoveCoin}], 
					     ShipCallback, 
					     ?order_goods_meta_house, State);
		    Error ->
			Error			    
    		end
    	end,
    
    case db:transaction(F) of
	?pay_error ->
	    {noreply, State};
    	{false, Err} -> 
    	    sys_msg:send(Account, Err),
	    {noreply, State};
    	{NHouseData, NPlayerMoveHouse} ->
	    FreeCount = get_move_special_house_free_count(NPlayerMoveHouse),
	    net_helper:send2client(Account, #notify_get_free_count_for_moving_special_house{count=FreeCount}),
	    house_diamond:notify(NHouseData),
	    house:broadcast_owners(NHouseData, #notify_move_house_success{}),
	    #house_data{boy=Boy, girl=Girl, house_id=HouseID}=NHouseData,
	    HouseName = house:get_house_name(HouseID),	    
	    %% 踢人关场景
	    player_mateup_context:stop_player(Boy, Girl),
	    router:send(HouseName, kick_guests_and_stop_house, {Boy, Girl, ?msg_kicked_move_house}),
	    #house_tplt{right_grade=NewGrade} = tplt:get_data(house_tplt, NewHouseTpltID),
	    router:cast(Account, on_change_house, NewGrade),
	    {noreply, State}
    end.



%%%===================================================================
%%% 内部函数
%%%===================================================================

%%--------------------------------------------------------------------
%% @doc
%% @获取搬家需要的水晶
%% @end
%%--------------------------------------------------------------------
get_move_house_need_diamond(Diamond, PlayerMoveHouse, #house_tplt{right_grade=NewGrade}) when NewGrade < 0 ->
    FreeCount = get_move_special_house_free_count(PlayerMoveHouse),
    case FreeCount > 0 of
	true ->
	    0;
	false ->
	    Diamond
    end;
get_move_house_need_diamond(Diamond, _PlayerMoveHouse, #house_tplt{right_grade=NewGrade}) when NewGrade > 0 ->
    Diamond.

%%--------------------------------------------------------------------
%% @doc
%% @获取搬家需要的爱情币
%% @end
%%--------------------------------------------------------------------
get_move_house_need_love_coin(LoveCoin, PlayerMoveHouse, #house_tplt{right_grade=NewGrade}) when NewGrade < 0 ->
    FreeCount = get_move_special_house_free_count(PlayerMoveHouse),
    case FreeCount > 0 of
	true ->
	    0;
	false ->
	    LoveCoin
    end;
get_move_house_need_love_coin(LoveCoin, _PlayerMoveHouse, #house_tplt{right_grade=NewGrade}) when NewGrade > 0 ->
    LoveCoin.

%% 将玩家等级转为 产权等级
house_level_to_right_grade(HouseLevel, LevelPerRight) 
  when is_integer(HouseLevel) ->
    (HouseLevel div LevelPerRight).

%% 判断是否可搬家
can_move_house(Account, AtHome, NMoney, HouseTplt, HouseData) ->
    try
	can_move_house_by_athome(AtHome),
	can_move_house_by_diamond(NMoney),
	can_move_house_by_house_right(Account, HouseTplt, HouseData)
    catch
	throw:Reason ->
	    Reason
    end.

%%--------------------------------------------------------------------
%% @doc
%% @判断是否是在自己家
%% @end
%%--------------------------------------------------------------------
can_move_house_by_athome(AtHome) ->
    case AtHome of
	true ->
	    true;
	false ->
	    throw({false, ?err_not_at_home_not_move_house})
    end.

%%--------------------------------------------------------------------
%% @doc
%% @水晶是否足够
%% @end
%%--------------------------------------------------------------------
can_move_house_by_diamond(NMoney) ->
    case NMoney >= 0 of
	true ->
	    true;
	false ->
	    %% 判断钱是否足够
	    throw({false, ?err_not_enough_lover_diamond})
    end.

%%--------------------------------------------------------------------
%% @doc
%% @是否有房屋权限
%% @end
%%--------------------------------------------------------------------
can_move_house_by_house_right(Account, HouseTplt, HouseData) ->
    NewGrade = HouseTplt#house_tplt.right_grade,
    IsSingle = HouseTplt#house_tplt.is_single,
    NewHouseTpltID = HouseTplt#house_tplt.id,
    SingleType = case house:get_lover(Account, HouseData) of
		     '' -> 1; %% 单身
		     _ -> 0 %% 非单身
		 end,
    case IsSingle =/= SingleType of
	true -> %%  单身只能用单身的房子，情侣只能用情侣的房子 
	    case IsSingle of 
		1 -> %% 单身
		    throw({false, ?err_can_not_buy_single_house});
		0 -> %% 情侣
		    throw({false, ?err_can_not_buy_double_house});
		_ -> %% 不限制
		    has_house_right(Account, NewHouseTpltID, NewGrade)
	    end;
	_  ->
	    has_house_right(Account, NewHouseTpltID, NewGrade)
    end.

do_move_house(NewHouseTpltID, DecDiamond, 
	      PlayerMoveHouse, #house_tplt{right_grade=NewGrade}, 
	      HouseData) when NewGrade < 0 ->
    NHouseData = house_diamond:dec_diamond(DecDiamond, HouseData),
    %% 收起家具, 更换房间
    NNHouseData = do_move_house(NewHouseTpltID, NHouseData),
    %% 停止搜索
    NNNHouseData = friend_search_item:cancel_search(NNHouseData),
    NPlayerMoveHouse = dec_free_count_for_moving_special_house(PlayerMoveHouse, 1),
    db:write(NPlayerMoveHouse),
    db:write(NNNHouseData),
    {NNNHouseData, NPlayerMoveHouse};
do_move_house(NewHouseTpltID, DecDiamond, 
	      PlayerMoveHouse, #house_tplt{right_grade=NewGrade}, 
	      HouseData) when NewGrade > 0 ->
    NHouseData = house_diamond:dec_diamond(DecDiamond, HouseData),
    %% 收起家具, 更换房间
    NNHouseData = do_move_house(NewHouseTpltID, NHouseData),
    %% 停止搜索
    NNNHouseData = friend_search_item:cancel_search(NNHouseData),
    db:write(NNNHouseData),
    {NNNHouseData, PlayerMoveHouse}.

%% 特殊产权判断
has_house_right(Account, NewHouseTpltID, NewGrade) when NewGrade < 0 ->
    IsUnLock = player_special_house:is_unlock(Account, NewHouseTpltID),
    case IsUnLock of
	true ->
	    true;
	false ->
	    throw({false, ?err_special_house_right_not_buy})
    end;
has_house_right(_Account, _NewHouseTpltID, NewGrade) when NewGrade =:= 0 ->
    throw({false, ?err_scene_not_exists});
%% 普通产权判断
has_house_right(Account, _NewHouseTpltID, NewGrade) when NewGrade > 0 ->
    PlayerUnlockHouse = get_player_unlock_house(Account),
    CurGrade = get_max_unlock_house(PlayerUnlockHouse),
    case CurGrade < NewGrade of
	true -> %% 判断有没有购买产权
	    throw({false, ?err_house_right_not_buy});
	_ ->
	    true
    end.


can_buy_right(BuyGrade, NDiamond, UnlockMaterials, PlayerUnlockHouse, HouseData) ->
    LevelPerRight = common_def:get_val(level_per_right),

    HouseLevel = house_level_exp:get_level(HouseData),

    MaxGrade = house_level_to_right_grade(HouseLevel, LevelPerRight),

    CurGrade = get_max_unlock_house(PlayerUnlockHouse),

    try
	validate_grade(BuyGrade, CurGrade, MaxGrade),
	validate_diamond(NDiamond),
	validate_material(UnlockMaterials, HouseData)
    catch
	throw:Reason ->
	    Reason
    end.

validate_grade(BuyGrade, CurGrade, MaxGrade) ->
    case BuyGrade =< CurGrade of
	true ->
	    throw({false, ?err_house_right_has_buy});
	_ ->
	    case (CurGrade + 1 =/= BuyGrade) of
		true -> %% 需要逐级开启
	    	    case BuyGrade of
			1 -> true; %% 1级例外
			_ -> throw({false, ?err_prev_house_right_not_buy})
		    end;
		_ ->
		    case BuyGrade > MaxGrade of
			true ->
			    throw({false, ?err_level_not_enough_to_buy_house_right});
			_ ->
			    true
		    end
	    end
    end.

validate_diamond(Diamond) ->
    case Diamond < 0 of
	true ->
	    throw({false, ?err_not_enough_lover_diamond});
	_ ->
	    true
    end.

validate_material([], _HouseData) ->
    true;
validate_material([{ItemId, Count}|Materials], HouseData) ->
    case house_pack:get_item_count_by_tempid([ItemId], HouseData) >= Count of
	true ->
	    validate_material(Materials, HouseData);
	false ->
	    throw({false, ?unlock_house_material_error})
    end.


do_move_house(NewTpltID, #house_data{lover_package=Pack, furniture_vec=Furs}=HouseData) ->
    DropItems = common_def:get_val(move_house_drop_items),
    Items = furniture:convert_furnitures_to_items(Furs, DropItems),  
    {NPack, _Msgs} = house_lover_package:add_items(Items, Pack),
    NewHouseData = HouseData#house_data{template_id=NewTpltID,
					lover_package=NPack,
					furniture_vec=[],
					buy_date=datetime:localtime()
				       },
    NewHouseData#house_data{decoration=furniture_property:get_decoration(NewHouseData)}.


%% 取可用的特殊产权列表(情侣双方合并)
get_special_house_list(Account) when is_atom(Account) ->
    Lover = db_pair_player:get_lover(Account),
    get_special_house_list(Account, Lover).
get_special_house_list(Boy, Girl) ->
    special_house_shop:get_player_special_house(Boy) ++ 
	special_house_shop:get_player_special_house(Girl).

get_player_unlock_house(Account) ->
    case db:dirty_read(player_unlock_house, Account) of
	[] ->
	    PlayerUnlockHouse = #player_unlock_house{account=Account, unlock_list=[]},
	    PlayerUnlockHouse;
	[UnlockHouse] ->
	    UnlockHouse
    end.

add_player_unlock_house(PlayerUnlockHouse, UnlockId) ->
    UnlockList = PlayerUnlockHouse#player_unlock_house.unlock_list,
    NUnlockList = [UnlockId|UnlockList],
    PlayerUnlockHouse#player_unlock_house{unlock_list=NUnlockList}.

get_max_unlock_house(PlayerUnlockHouse) ->
    UnlockList = PlayerUnlockHouse#player_unlock_house.unlock_list,
    case UnlockList == [] of
	true ->
	    1;
	false ->
	    lists:max(UnlockList)
    end.

%%--------------------------------------------------------------------
%% @doc
%% @获取免费搬房屋的次数
%% @end
%%--------------------------------------------------------------------
get_move_special_house_free_count(PlayerMoveHouse) ->
    PlayerMoveHouse#player_move_house.move_special_house_free_count.

%%--------------------------------------------------------------------
%% @doc
%% @设置免费搬房屋的次数
%% @end
%%--------------------------------------------------------------------
set_free_count_for_moving_special_house(PlayerMoveHouse, Count) ->
    PlayerMoveHouse#player_move_house{move_special_house_free_count=Count}.
