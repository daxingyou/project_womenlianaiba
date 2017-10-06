%%%-------------------------------------------------------------------
%%% @author  linyijie
%%% @copyright (C) 2010, 
%%% @doc
%%%  系统消息的提示模块
%%% @end
%%% Created : 25 Mar 2010 by  <>
%%%-------------------------------------------------------------------
-module(sys_msg).

-include("packet_def.hrl").

%% API
-export([send/2, send/3, sendall/0, save_offline_msgs/2, load_offline_sys_msg/1, broadcast/4]).

-record(sys_msg, {account,         %% 账号
		  msg_list=[]      %% 消息列表
		 }).

%%%===================================================================
%%% API
%%%===================================================================
%% 发送系统消息给客户端
%% Player: 玩家帐号
%% SysType: 系统类型, 参见common_def.hrl定义
%% MsgCode: 消息代码, 参见sys_msg.hrl定义
send(Player, MsgCode)->
    send(Player, MsgCode, []).

%% Params: [Param | ...]
%% Param: int, float, atom, string
send(_Player, 0, _Params)->
    %% 为0时不处理
    ok;
send(Player, MsgCode, Params)->
    NParams = [translate(P) || P <- Params],
    net_helper:send2client(Player, #notify_sys_msg{code=MsgCode, params=NParams}).

%% 广播给指定场景里的所有玩家, 指定的account即使在场景里, 也不会收到消息
broadcast(SceneName, Account, MsgCode, Params) ->
    NParams = [translate(P) || P <- Params],
    Packet = #notify_sys_msg{code=MsgCode, params=NParams},
    router:cast(undefined, SceneName, broadcast_other_players, {Account, Packet}).

translate(Data) when is_integer(Data) ->
    integer_to_list(Data);
translate(Data) when is_float(Data) ->
    [Str] = io_lib:format("~p", [Data]),
    Str;
translate(Data) when is_atom(Data) ->
    atom_to_list(Data);
translate(Data) when is_binary(Data) ->
    binary_to_list(Data);
translate(Data) when is_list(Data) ->
    Data;
translate(Data) ->
    erlang:error({badtype, Data}).


%% TODO: 暂时未开发
sendall()->
    ok.


%% 取离线消息
get_offline_msgs(Account) when is_atom(Account) ->
    case db:dirty_read(sys_msg, Account) of
	[] ->
	    [];
	[#sys_msg{msg_list=Msgs}] -> 
	    Msgs
    end.    

%% 发送离线消息, 玩家上线会收到通知
save_offline_msgs(Account, MsgList) when is_atom(Account), is_list(MsgList) ->    
    F = fun(#sys_msg{msg_list=OldMsgs}=R) -> 
		R#sys_msg{msg_list=OldMsgs ++ MsgList}
	end,
    DefRecord = #sys_msg{account=Account},
    modify(sys_msg, Account, F, DefRecord).	    

%% 修改记录, 先读取，修改后写入
modify(Table, Key, FModify, DefRecord) when is_atom(Table) ->
    F = fun() ->
		case db:read(Table, Key) of		    
		    [Record] -> 
			NRecord = FModify(Record),
			db:write(NRecord);
		    _ -> %%no_record
			NRecord = FModify(DefRecord),
			db:write(NRecord)			
		end
        end,
    db:transaction(F).


%% 玩家不在线时，保存的一些系统消息, 玩家上线后，应通知玩家
load_offline_sys_msg(Account) ->
    Msgs = get_offline_msgs(Account),
    [net_helper:send2client(Account, Packet) || Packet <- Msgs],
    db:dirty_delete(sys_msg, Account),
    ok.


