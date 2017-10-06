%%%-------------------------------------------------------------------
%%% @author linyijie <linyj@35info.cn>
%%% @copyright (C) 2013, linyijie
%%% @doc
%%% ���ⷿ��
%%% @end
%%% Created : 31 Jul 2013 by linyijie <linyj@35info.cn>
%%%-------------------------------------------------------------------
-module(player_special_house).

-include("packet_def.hrl").
-include("house_data.hrl").
-include("tplt_def.hrl").
-include("sys_msg.hrl").
-include("router.hrl").
-include("common_def.hrl").
-include("enum_def.hrl").
-include("resource.hrl").
-include("records.hrl").

%% API
-export([start/1, 
	 get_player_special_house/1, 
	 new/1, 
	 add_unlock/2, 
	 set_unlocks/2, 
	 get_unlocks/1,
	 is_unlock/2, 
	 unlock/2]).
-export([handle_cast/2]).

-record(special_house, {account,              %% ����ʺ�
			unlocks=[]            %% ��������ʳ��
		       }).

%%%===================================================================
%%% API
%%%===================================================================
start(Account) ->
    [router:make_event_source(?msg_req_unlock_special_house, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_unlock_special_house_info, Account, {Account, ?MODULE})
    ].

%%--------------------------------------------------------------------
%% @doc
%% @��ȡ���ݿ�����
%% @end
%%--------------------------------------------------------------------
get_player_special_house(Account) ->
    case db:read(special_house, Account) of
	[] ->
	    new(Account);
	[PlayerSpecialHouse] ->
	    PlayerSpecialHouse
    end.

%%--------------------------------------------------------------------
%% @doc
%% @�½����ݽ����ṹ��
%% @end
%%--------------------------------------------------------------------
new(Account) ->
    #special_house{account=Account, unlocks=[]}.

%%--------------------------------------------------------------------
%% @doc
%% @���ӽ����ķ���
%% @end
%%--------------------------------------------------------------------
add_unlock(ID, PlayerSpecialHouse) ->
    UnLocks = get_unlocks(PlayerSpecialHouse),
    NUnLocks = 
    case lists:member(ID, UnLocks) of
	true ->
	    UnLocks;
	false ->
	    [ID|UnLocks]
    end,
    set_unlocks(NUnLocks, PlayerSpecialHouse).


%%--------------------------------------------------------------------
%% @doc
%% @���ý������ķ���
%% @end
%%--------------------------------------------------------------------
set_unlocks(UnLocks, PlayerSpecialHouse) ->
    PlayerSpecialHouse#special_house{unlocks=UnLocks}.

%%--------------------------------------------------------------------
%% @doc
%% @�жϸ÷���Id�Ƿ��Ѿ�������
%% @end
%%--------------------------------------------------------------------
is_unlock(Account, HouseTempID) ->
    PlayerSpecialHouse = get_player_special_house(Account),
    UnLocks = get_unlocks(PlayerSpecialHouse),
    has_unlock(UnLocks, HouseTempID).

%%--------------------------------------------------------------------
%% @doc
%% @��������
%% @end
%%--------------------------------------------------------------------
unlock(Account, ID) ->
    F = fun() ->
		PlayerSpecialHouse = get_player_special_house(Account),
		do_unlock(Account, ID, PlayerSpecialHouse)
	end,
    case db:transaction(F) of
	NPlayerSpecialHouse ->
	    FreeCount = player_move_house:get_move_special_house_free_count(NPlayerSpecialHouse),
	    net_helper:send2client(Account, #notify_get_free_count_for_moving_special_house{count=FreeCount}),
	    net_helper:send2client(Account, #notify_unlock_special_house{id=ID})
    end.

%%%===================================================================
%%% Handle cast
%%%===================================================================
handle_cast({#msg{src=Account}, #req_unlock_special_house{id=ID}}, State) ->
    unlock_special_house(Account, ID, State),
    {noreply, State};
handle_cast({#msg{src=Account}, #req_unlock_special_house_info{}}, State) ->
    F = fun() ->
		PlayerSpecialHouse = get_player_special_house(Account),
		get_unlocks(PlayerSpecialHouse)
	end,
    case db:transaction(F) of
	UnLocks ->
	    net_helper:send2client(Account, #notify_unlock_special_house_info{ids=UnLocks})
    end,
    {noreply, State}.

%%%===================================================================
%%% Internal functions
%%%===================================================================

%%--------------------------------------------------------------------
%% @doc
%% @�������ⷿ��
%% @end
%%--------------------------------------------------------------------
unlock_special_house(Account, ID, State) ->
    F = fun() ->
		[PlayerBasicData] = db:read(player_basic_data, Account),
		PlayerSpecialHouseTplt = tplt:get_data(player_special_house_tplt, ID),
		PlayerSpecialHouse = get_player_special_house(Account),
		LoveCoin = PlayerSpecialHouseTplt#player_special_house_tplt.love_coin,
		BroadcastID = PlayerSpecialHouseTplt#player_special_house_tplt.broadcast_id,
		Name = PlayerSpecialHouseTplt#player_special_house_tplt.name,
		UserName = player_basic_data:get_username(PlayerBasicData),
		ShipCallback = 
		    fun(#order{status=Status}=_Order)-> 			   
			    case (Status =:= ?order_payed) of
				true ->
				    do_unlock(Account, ID, PlayerSpecialHouse),
				    sys_broadcast:send(BroadcastID, 
						       [util:to_string(UserName), util:to_string(Name)]),
				    net_helper:send2client(Account, #notify_unlock_special_house{id=ID}),
				    ?pay_shipped;
				_ ->
				    ?pay_error
			    end				       
		    end,

		player_love_coin:pay([{0, 1, LoveCoin}], 
				     ShipCallback, 
				     ?order_goods_meta_special_house, State)
	end,
    db:transaction(F).

%%--------------------------------------------------------------------
%% @doc
%% @����
%% @end
%%--------------------------------------------------------------------
do_unlock(Account, ID, PlayerSpecialHouse) ->
    NPlayerSpecialHouse = 
	case is_first_unlock(PlayerSpecialHouse) of
	    true ->
		add_free_count_for_moving_special_house(Account),
		add_unlock(ID, PlayerSpecialHouse);
	    false ->
		add_unlock(ID, PlayerSpecialHouse)
	end,
    db:write(NPlayerSpecialHouse),
    NPlayerSpecialHouse.

%%--------------------------------------------------------------------
%% @doc
%% @�Ƿ��һ�ν���
%% @end
%%--------------------------------------------------------------------
is_first_unlock(PlayerSpecialHouse) ->
    UnLocks = get_unlocks(PlayerSpecialHouse),
    case UnLocks of
	[] ->
	    true;
	_ ->
	    false
    end.

%%--------------------------------------------------------------------
%% @doc
%% @������ѻ����ݵĴ���
%% @end
%%--------------------------------------------------------------------
add_free_count_for_moving_special_house(Account) ->
    PlayerMoveHouse = player_move_house:get_player_move_house(Account),
    NPlayerMoveHouse = player_move_house:add_free_count_for_moving_special_house(PlayerMoveHouse, 5), 
    db:write(NPlayerMoveHouse).

%%--------------------------------------------------------------------
%% @doc
%% @��ȡ�������ķ���
%% @end
%%--------------------------------------------------------------------
get_unlocks(PlayerSpecialHouse) ->
    PlayerSpecialHouse#special_house.unlocks.

%%--------------------------------------------------------------------
%% @doc
%% @����Id�Ƿ��ڽ����б���
%% @end
%%--------------------------------------------------------------------
has_unlock([], _HouseTempID) ->
    false;
has_unlock([ID|UnLocks], HouseTempID) ->
    PlayerSpecialHouseTplt = tplt:get_data(player_special_house_tplt, ID),
    UnLocksHouseTempIDs = PlayerSpecialHouseTplt#player_special_house_tplt.unlock_house_ids,
    case lists:member(HouseTempID, UnLocksHouseTempIDs) of
	true ->
	    true; 
	false ->
	    has_unlock(UnLocks, HouseTempID)
    end.
