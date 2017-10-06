%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%%
%%% @end
%%% Created : 18 Sep 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(player_flag).

-record(player_flag, {account,
		      flags
		     }).

-record(flag_atom, {key,
		    value,
		    create_date
		   }).

-export([remove/2, get/2, set/3]).

%%%===================================================================
%%% API
%%%===================================================================

%% 移除标记
remove(Account, Key) ->
    PlayerFlag = get_player_flag(Account),
    case is_exist(Key, PlayerFlag) of
	false ->
	    throw({false, remove_flag_but_not_exist, Key});
	_ ->
	    Flags = get_flags(PlayerFlag),
	    NFlags = lists:keydelete(Key, #flag_atom.key, Flags),
	    NPlayerFlag = set_flags(NFlags, PlayerFlag),
	    db:dirty_write(NPlayerFlag),
	    NPlayerFlag
    end.

%% 设置标记
%% 如果标记不存在则创建
set(Account, Key, Value) ->
    PlayerFlag = get_player_flag(Account),
    case is_exist(Key, PlayerFlag) of
	false ->
	    create(Key, Value, PlayerFlag);
	FlagAtom ->
	    NFlagAtom = set_value(Value, FlagAtom),
	    Flags = get_flags(PlayerFlag),
	    NFlags = lists:keyreplace(Key, #flag_atom.key, Flags, NFlagAtom),
	    NPlayerFlag = set_flags(NFlags, PlayerFlag),
	    db:dirty_write(NPlayerFlag),
	    NPlayerFlag
    end.

%% 获取标记
get(Account, Key) ->
    PlayerFlag = get_player_flag(Account),
    case is_exist(Key, PlayerFlag) of
	false ->
	    throw({false, get_flag_but_not_exist, Key});
	FlagAtom ->
	    get_value(FlagAtom)
    end.

%%%===================================================================
%%% Internal Func
%%%===================================================================

%% 创建标记
create(Key, Value, PlayerFlag) ->
    Flags = get_flags(PlayerFlag),
    FlagAtom = create_flag_atom(Key, Value),
    NFlags = [FlagAtom | Flags],
    NPlayerFlag = set_flags(NFlags, PlayerFlag),
    db:dirty_write(NPlayerFlag),
    NPlayerFlag.

%% 是否存在标记
is_exist(Key, PlayerFlag) ->
    Flags = get_flags(PlayerFlag),
    lists:keyfind(Key, #flag_atom.key, Flags).

get_player_flag(Account) ->
    case db:dirty_read(player_flag, Account) of
	[] ->
	    #player_flag{account=Account, flags=[]};
	[PlayerFlag] ->
	    PlayerFlag
    end.

get_flags(PlayerFlag) ->
    PlayerFlag#player_flag.flags.
set_flags(Flags, PlayerFlag) ->
    PlayerFlag#player_flag{flags=Flags}.

get_value(FlagAtom) when is_record(FlagAtom, flag_atom) ->
    FlagAtom#flag_atom.value.
set_value(Value, FlagAtom) when is_record(FlagAtom, flag_atom) ->
    FlagAtom#flag_atom{value=Value}.

create_flag_atom(Key, Value) ->
    #flag_atom{key=Key, value=Value, create_date=datetime:localtime()}.
