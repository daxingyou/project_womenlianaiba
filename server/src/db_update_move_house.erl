%%%-------------------------------------------------------------------
%%% @author linyijie <linyj@35info.cn>
%%% @copyright (C) 2013, linyijie
%%% @doc
%%% 升级搬家
%%% @end
%%% Created : 14 Aug 2013 by linyijie <linyj@35info.cn>
%%%-------------------------------------------------------------------
-module(db_update_move_house).

%% API
-export([start/0]).

%%%===================================================================
%%% API
%%%===================================================================
%%--------------------------------------------------------------------
%% @doc
%% @升级特殊房屋
%% @end
%%--------------------------------------------------------------------
start() ->
    AllKeys = db:dirty_all_keys(special_house),
    create_move_house(AllKeys).

%%%===================================================================
%%% Internal functions
%%%===================================================================
create_move_house([]) ->
    {atomic, ok};
create_move_house([Key | Keys]) ->
    Tab = player_move_house,
    case db:dirty_read(Tab, Key) of
	[]->
	    PlayerMoveHouse = player_move_house:new(Key),
	    NPlayerMoveHouse = player_move_house:set_free_count_for_moving_special_house(PlayerMoveHouse, 5),
	    db:dirty_write(NPlayerMoveHouse);
	[_PlayerMoveHouse]->
	    ok;
	_ ->
	    data_helper:format("Key:~p~n",[Key])
    end,
    create_move_house(Keys).
