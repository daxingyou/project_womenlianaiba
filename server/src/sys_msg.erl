%%%-------------------------------------------------------------------
%%% @author  linyijie
%%% @copyright (C) 2010, 
%%% @doc
%%%  ϵͳ��Ϣ����ʾģ��
%%% @end
%%% Created : 25 Mar 2010 by  <>
%%%-------------------------------------------------------------------
-module(sys_msg).

-include("packet_def.hrl").

%% API
-export([send/2, send/3, sendall/0, save_offline_msgs/2, load_offline_sys_msg/1, broadcast/4]).

-record(sys_msg, {account,         %% �˺�
		  msg_list=[]      %% ��Ϣ�б�
		 }).

%%%===================================================================
%%% API
%%%===================================================================
%% ����ϵͳ��Ϣ���ͻ���
%% Player: ����ʺ�
%% SysType: ϵͳ����, �μ�common_def.hrl����
%% MsgCode: ��Ϣ����, �μ�sys_msg.hrl����
send(Player, MsgCode)->
    send(Player, MsgCode, []).

%% Params: [Param | ...]
%% Param: int, float, atom, string
send(_Player, 0, _Params)->
    %% Ϊ0ʱ������
    ok;
send(Player, MsgCode, Params)->
    NParams = [translate(P) || P <- Params],
    net_helper:send2client(Player, #notify_sys_msg{code=MsgCode, params=NParams}).

%% �㲥��ָ����������������, ָ����account��ʹ�ڳ�����, Ҳ�����յ���Ϣ
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


%% TODO: ��ʱδ����
sendall()->
    ok.


%% ȡ������Ϣ
get_offline_msgs(Account) when is_atom(Account) ->
    case db:dirty_read(sys_msg, Account) of
	[] ->
	    [];
	[#sys_msg{msg_list=Msgs}] -> 
	    Msgs
    end.    

%% ����������Ϣ, ������߻��յ�֪ͨ
save_offline_msgs(Account, MsgList) when is_atom(Account), is_list(MsgList) ->    
    F = fun(#sys_msg{msg_list=OldMsgs}=R) -> 
		R#sys_msg{msg_list=OldMsgs ++ MsgList}
	end,
    DefRecord = #sys_msg{account=Account},
    modify(sys_msg, Account, F, DefRecord).	    

%% �޸ļ�¼, �ȶ�ȡ���޸ĺ�д��
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


%% ��Ҳ�����ʱ�������һЩϵͳ��Ϣ, ������ߺ�Ӧ֪ͨ���
load_offline_sys_msg(Account) ->
    Msgs = get_offline_msgs(Account),
    [net_helper:send2client(Account, Packet) || Packet <- Msgs],
    db:dirty_delete(sys_msg, Account),
    ok.


