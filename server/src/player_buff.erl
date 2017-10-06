%%%-------------------------------------------------------------------
%%% @author linyijie <linyj@35info.cn>
%%% @copyright (C) 2012, linyijie
%%% @doc
%%% 房屋buff系统, 这个模块的buff和房屋绑定
%%% @end
%%% Created : 17 Sep 2012 by linyijie <linyj@35info.cn>
%%%-------------------------------------------------------------------
-module(player_buff).

-include("tplt_def.hrl").
-include("packet_def.hrl").
-include("router.hrl").
-include("player_buff.hrl").
-include("sys_msg.hrl").

-export([start/1, handle_cast/2, add_buff/2, add_buff/3, get_buff/2, get_params/1, is_buff_expired/2, delete_buff/2, notify/2, make_buff_packet/2]).

-compile(export_all).

-record(buff, {id, create_time, buff_time, params}).
-record(player_buff, {account, buffs}).

start(Account) ->
    [router:make_event_source(?msg_req_get_buff, Account, {Account, ?MODULE})
    ]. 

handle_cast({#msg{src=Account}, #req_get_buff{}}, PlayerData) ->
    handle_get_buff(Account),
    
    {noreply, PlayerData}.

handle_get_buff(Account) ->
    Buffs = get_player_buffs(Account),
    F = fun(Buff, Acc) ->
		case is_buff_expired(Account, Buff#buff.id) of
		    true -> Acc;
		    false -> [Buff | Acc]
		end
	end,
    Buffs1 = lists:foldl(F, [], Buffs),
    notify(Account, Buffs1).

delete_same_type_buff(Type, Buffs) ->
    F = fun(Buff, Acc) -> 
		#buff_tplt{type=Type1} = tplt:get_data2(buff_tplt, Buff#buff.id),
		case Type == Type1 of
		    true -> Acc;
		    false -> [Buff | Acc]
		end
	end,
    Buffs1 = lists:foldl(F, [], Buffs),
    lists:reverse(Buffs1).

add_buff(Account, BuffID) ->
    #buff_tplt{duration=Duration, param=Param, type=Type} = tplt:get_data2(buff_tplt, BuffID),
    add_buff(Account, BuffID, Duration, Type, Param).

add_buff(Account, BuffID, BuffTime) ->
    #buff_tplt{param=Param, type=Type} = tplt:get_data2(buff_tplt, BuffID),
    add_buff(Account, BuffID, BuffTime, Type, Param).

%% 增加一个buff到房屋, BuffTime为buff的存在时长
add_buff(Account, BuffID, BuffTime, Type, Params) ->
    Buffs = get_player_buffs(Account), 
    NewBuff = #buff{id = BuffID, create_time = datetime:localtime(), 
		    buff_time=BuffTime, params=Params},
    Buffs1 = delete_same_type_buff(Type, Buffs),
    PlayerBuffs = #player_buff{account=Account, buffs=[NewBuff | Buffs1]},
    db:dirty_write(PlayerBuffs),
    BuffData = translate_buff_data(NewBuff),
    net_helper:send2client(Account, #notify_add_buff{buff=BuffData}),
    NewBuff.


get_player_buffs(Account) ->
    case db:dirty_read(player_buff, Account) of
	[] -> [];
	[#player_buff{buffs=Buffs}] -> Buffs
    end.

get_Player_buff_id_By_type(Account, Type) ->
    Buffs = get_player_buffs(Account),
    [Buff#buff.id||Buff<-Buffs, begin 
				    #buff_tplt{type=Type1} = tplt:get_data2(buff_tplt, Buff#buff.id),
				    Type == Type1
				end].
   
get_buff(Account, BuffID) ->
    Buffs = get_player_buffs(Account),
    case lists:keyfind(BuffID, #buff.id, Buffs) of
	false -> [];
	Buff -> Buff
    end.

get_params(#buff{params=Params}) ->
    Params.


%% 判断一个指定的buff是否过期
is_buff_expired(Account, BuffID) ->
    Buffs = get_player_buffs(Account),
    case lists:keyfind(BuffID, #buff.id, Buffs) of
	false -> true;
	Buff ->
	    CreateTime = Buff#buff.create_time,
	    BuffTime = Buff#buff.buff_time,
	    case datetime:diff_time(CreateTime, datetime:localtime()) > BuffTime of
		true -> 
		    delete_buff(Account, Buff#buff.id, Buffs),
		    true;
		false -> false
	    end
    end.

%% 删除一个buff
delete_buff(Account, BuffID) ->
    Buffs = get_player_buffs(Account),
    delete_buff(Account, BuffID, Buffs).

delete_buff(Account, BuffID, Buffs) ->
    Buffs1 = lists:keydelete(BuffID, #buff.id, Buffs),
    PlayerBuff = #player_buff{account=Account, buffs=Buffs1},
    ok = db:dirty_write(PlayerBuff).

notify(Account, BuffID) when is_integer(BuffID) ->
    case get_buff(Account, BuffID) of
	[] -> ok;
	Buff ->
	    notify(Account, Buff)
    end;
notify(Account, Buffs) when is_list(Buffs) ->
    Packet = make_buff_packet(Account, Buffs),
    net_helper:send2client(Account, Packet);
notify(Account, Buff) ->
    Packet = make_buff_packet(Account, [Buff]),
    net_helper:send2client(Account, Packet).

make_buff_packet(Account, Buffs) ->
    Buffs1 = [translate_buff_data(Buff)|| Buff <- Buffs],
    #notify_player_buff{account=Account, buffs = Buffs1}.

translate_buff_data(#buff{id=BuffID, create_time=CreateTime, buff_time=BuffTime}) ->
    RestTime1 = case BuffTime - datetime:diff_time(CreateTime, datetime:localtime()) of
		    RT when RT < 0 -> 
			0;
		    RestTime -> RestTime
		end,
    #player_buff_data{id=BuffID, rest_time=RestTime1}.
    
    


    

