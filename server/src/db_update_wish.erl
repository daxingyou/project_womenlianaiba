%%%-------------------------------------------------------------------
%%% @author linyijie <linyj@35info.cn>
%%% @copyright (C) 2013, linyijie
%%% @doc
%%%
%%% @end
%%% Created :  5 Aug 2013 by linyijie <linyj@35info.cn>
%%%-------------------------------------------------------------------
-module(db_update_wish).

-include("enum_def.hrl").

%% API
-export([start/0]).

%%%===================================================================
%%% API
%%%===================================================================

%%--------------------------------------------------------------------
%% @doc
%% @spec
%% @end
%%--------------------------------------------------------------------
start() ->
    AllKeys = db:dirty_all_keys(player_wish),
    clean_special_house(AllKeys).

%%%===================================================================
%%% Internal functions
%%%===================================================================
clean_special_house([]) ->
    {atomic, ok};
clean_special_house([Key | Keys]) ->
    Tab = player_wish,
    case db:dirty_read(Tab, Key) of
	[]->
	    data_helper:format("Key:~p~n",[Key]);
	[PlayerWish]->
	    WishType = player_wish:get_wish_type(PlayerWish),
	    WishID = player_wish:get_wish_id(PlayerWish),
	    case WishType of
		?wt_house ->
		    db:dirty_delete({Tab, WishID});
		_ ->
		    ok
	    end;
	_ ->
	    data_helper:format("Key:~p~n",[Key])
    end,
    clean_special_house(Keys).
