%%%-------------------------------------------------------------------
%%% @author linyijie <linyj@35info.cn>
%%% @copyright (C) 2013, linyijie
%%% @doc
%%% 将旧有房屋升级成解锁
%%% @end
%%% Created :  1 Aug 2013 by linyijie <linyj@35info.cn>
%%%-------------------------------------------------------------------
-module(db_update_special_house).

%% API
-export([start/0,
	 start1/0
	]).

%%%===================================================================
%%% API
%%%===================================================================
start() ->
    AllKeys = db:dirty_all_keys(player_special_house),
    create_unlock_special_house(AllKeys).

start1() ->
    AllKeys = db:dirty_all_keys(player_special_house),
    create_unlock_special_house1(AllKeys).

%%--------------------------------------------------------------------
%% @doc
%% @创建解锁的房屋
%% @end
%%--------------------------------------------------------------------
create_unlock_special_house1([]) ->
    {atomic, ok};
create_unlock_special_house1([Key | Keys]) ->
    Tab = player_special_house,
    case db:dirty_read(Tab, Key) of
	[]->
	    data_helper:format("Key:~p~n",[Key]);
	[PlayerSpecialHouse]->
	    HouseList = special_house_shop:get_house_list(PlayerSpecialHouse),
	    Account = special_house_shop:get_account(PlayerSpecialHouse),
	    NPlayerSpecialHouse = case db:dirty_read(special_house, Account) of
				      [] ->
					  player_special_house:new(Account);
				      [S] ->
					  S
				  end,
	    UnLockIDs = player_special_house:get_unlocks(NPlayerSpecialHouse),
	    NNNUnLockIDs = get_unlock_id(130003, 5, HouseList, UnLockIDs),
	    data_helper:format("UnLockIDs:~p~n", [NNNUnLockIDs]),
	    case NNNUnLockIDs of
		[] ->
		    ok;
		_ ->
		    NNPlayerSpecialHouse = player_special_house:set_unlocks(NNNUnLockIDs, NPlayerSpecialHouse),
		    db:dirty_write(NNPlayerSpecialHouse)
	    end;
	%% case lists:member(130000, HouseList) of
	%% 	true ->
	    %% 	    Account = special_house_shop:get_account(PlayerSpecialHouse),
	    %% 	    NPlayerSpecialHouse = player_special_house:new(Account),
	    %% 	    NNPlayerSpecialHouse = player_special_house:add_unlocks(1, NPlayerSpecialHouse),
	    %% 	    db:dirty_write(NNPlayerSpecialHouse);
	    %% 	false ->
	    %% 	    ok
	    %% end;
	_ ->
	    data_helper:format("Key:~p~n",[Key])
    end,
    create_unlock_special_house1(Keys).

%%--------------------------------------------------------------------
%% @doc
%% @创建解锁的房屋
%% @end
%%--------------------------------------------------------------------
create_unlock_special_house([]) ->
    {atomic, ok};
create_unlock_special_house([Key | Keys]) ->
    Tab = player_special_house,
    case db:dirty_read(Tab, Key) of
	[]->
	    data_helper:format("Key:~p~n",[Key]);
	[PlayerSpecialHouse]->
	    HouseList = special_house_shop:get_house_list(PlayerSpecialHouse),
	    Account = special_house_shop:get_account(PlayerSpecialHouse),
	    NPlayerSpecialHouse = player_special_house:new(Account),
	    UnLockIDs = get_unlock_id(130000, 2, HouseList, []),
	    NUnLockIDs = get_unlock_id(130001, 6, HouseList, UnLockIDs),
	    NNUnLockIDs = get_unlock_id(130002, 7, HouseList, NUnLockIDs),
	    NNNUnLockIDs = get_unlock_id(130003, 5, HouseList, NNUnLockIDs),
	    data_helper:format("UnLockIDs:~p~n", [NNNUnLockIDs]),
	    case NNNUnLockIDs of
		[] ->
		    ok;
		_ ->
		    NNPlayerSpecialHouse = player_special_house:set_unlocks(NNNUnLockIDs, NPlayerSpecialHouse),
		    db:dirty_write(NNPlayerSpecialHouse)
	    end;
	%% case lists:member(130000, HouseList) of
	%% 	true ->
	    %% 	    Account = special_house_shop:get_account(PlayerSpecialHouse),
	    %% 	    NPlayerSpecialHouse = player_special_house:new(Account),
	    %% 	    NNPlayerSpecialHouse = player_special_house:add_unlocks(1, NPlayerSpecialHouse),
	    %% 	    db:dirty_write(NNPlayerSpecialHouse);
	    %% 	false ->
	    %% 	    ok
	    %% end;
	_ ->
	    data_helper:format("Key:~p~n",[Key])
    end,
    create_unlock_special_house(Keys).

%%%===================================================================
%%% Internal functions
%%%===================================================================
get_unlock_id(HouseTempID, UnLockID, HouseList, UnLockIDs) ->
    case lists:member(HouseTempID, HouseList) of
	true ->
	    [UnLockID | UnLockIDs];
	false ->
	    UnLockIDs
    end.
