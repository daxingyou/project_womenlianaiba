%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%   npc ¶Ô»°
%%% @end
%%% Created :  6 Sep 2012 by hongjx <hongjx@35info.cn>

-module(npc_dialog).


-include("packet_def.hrl").

-export([start/1, handle_cast/2, call_npc_fun/3]).

start(Account) ->
    [
     router:make_event_source(?msg_req_npc_command, Account, {Account, ?MODULE})
    ].


handle_cast({_Msg, 
	     #req_npc_command{npc_id=NpcID, function_name=FunStr}}, PlayerData) ->
    Account = player_data:get_account(PlayerData),
    call_npc_fun(NpcID, FunStr, Account),
    {noreply, PlayerData}.


call_npc_fun(NpcID, FunStr, Account) when is_integer(NpcID), is_list(FunStr) ->
    Mod = list_to_atom("npc_" ++ integer_to_list(NpcID)),
     
    case FunStr of
	"" -> %% µã»÷npc
	    case code:which(Mod) of
		non_existing=No ->
		    No;
		_ ->
		   Ret = Mod:active(Account),
		   convert_result(Ret, Account, NpcID)
	    end;	
	_ ->
	    F = list_to_atom(FunStr),
	    case erlang:function_exported(Mod, F, 1) of
		true ->
		    Ret = Mod:F(Account),
		    convert_result(Ret, Account, NpcID);	
		_ ->
		    erlang:error({Mod, function_not_export, F})
	    end
    end.


convert_result(L, Account, NpcID) when is_list(L), is_integer(NpcID) ->
    Packet = build_packet(L, #notify_npc_open_dialog{npc_id=NpcID}),
    net_helper:send2client(Account, Packet);
convert_result(_, Account, NpcID) when is_integer(NpcID) ->    
    net_helper:send2client(Account, #notify_npc_close_dialog{}).


build_packet([], Packet) ->
    Packet;
build_packet([{talk, TalkStr} | Tail], Packet) ->
    build_packet(Tail, Packet#notify_npc_open_dialog{talk=TalkStr});
build_packet([{button, FunAtom, BtnName} | Tail], 
	     #notify_npc_open_dialog{button_list=BtnList}=Packet) ->
    Btn = #button{name=BtnName, function_name=atom_to_list(FunAtom)},
    NPacket=Packet#notify_npc_open_dialog{button_list=BtnList ++ [Btn]},
    build_packet(Tail, NPacket).

