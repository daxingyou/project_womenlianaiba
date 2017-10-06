%% Author: NoteBook
%% Created: 2009-9-11
%% Description: Add description to client
-module(robot).

%%
%% Include files
%%
-include("net_type.hrl").
-include("packet_def.hrl").  
-include("enum_def.hrl").

%%
%% Exported Functions
%%
-export([start/1, start/4]).   
%%
%% API Functions
%%
start(Ip, Port, RoleName, Password) ->
    start([Ip, Port, RoleName, Password]).

start([Ip, Port, RoleName, Password]) ->
    data_helper:format("start player:~p~n", [RoleName]),
    Socket = connect(Ip, list_to_integer(Port)),
    printf("client version:~p~n", [?proto_ver]),
    gen_tcp:send(Socket, <<"GET / HTTP/1.1\r\nHost: app35398-1.qzoneapp.com:8001\r\n\r\n">>),
    Data = #req_login{version=?proto_ver, account=RoleName, password=Password},
    send_data(Socket, Data),
    loop(Socket, init(), RoleName, Password);
start([Ip, Port, RoleName]) ->
    start([Ip, Port, RoleName, []]).

%%
%% Add description of start/function_arity
%%
connect(Ip, Port) -> 
    %application:start(tcp_server),
    {ok, Socket} = gen_tcp:connect(Ip, Port, [{packet, 4}]),
    Socket.
%%
%% Local Functions
%%

init() ->
    [{?msg_notify_create_role_result, fun process_notify_create_role_result/5},
     {?msg_notify_login_result, fun process_notify_login_result/5},
     {?msg_notify_other_player_data, fun process_notify_other_player_data/5},
     {?msg_notify_player_data, fun process_notify_player_data/5},
     {?msg_notify_enter_game, fun process_notify_enter_game/5},
     {?msg_notify_player_leave_scene, fun process_notify_player_leave_scene/5},
     {?msg_notify_house_data, fun common_proc/5},
%%     {?msg_notify_npc_list, fun process_notify_npc_list/5},
     {?msg_notify_start_use_furniture, fun process_notify_use_furniture_result/5}
    ].

send_data(Socket, Data) ->
    {Type, Binary} = protocal:encode(Data),
    Msg = net_helper:make_net_binary(Type, Binary),
    gen_tcp:send(Socket, Msg),
    ok.


loop(Socket, List, RoleName, Password) ->
    receive
	{tcp, Socket, Bin} ->
	    Binary = list_to_binary(Bin),
	    {MsgType, MsgData}= net_helper:get_data(Binary),
	    printf("receive msg:{MsgType:~p, MsgData:~p}~n", [MsgType, MsgData]),
	    Processor = find_proc(MsgType, List),
	    Processor(MsgData, Socket, List, RoleName, Password),
	    loop(Socket, List, RoleName, Password);
	{tcp_closed, Socket} ->
	    printf("tcp close~n")
    end.

%%--------------------------鐧诲綍娴佺▼----------------------------------------------

process_notify_login_result(#notify_login_result{result=?lr_no_roles, 
						 sex=_Sex, nick_name=RoleName},
			    Socket, _List, _RoleName, _Password) ->
    PlayerBasicData = #player_basic_data{username=RoleName, 
    					 sex=1,
    					 skin_color=1, 
    					 hair=1, 
    					 face=1, 
    					 beard=1},
    Equip = #item{},
    Equips = [Equip, Equip, Equip, Equip, Equip, Equip, Equip, Equip],
    Data = #req_create_role{basic_data=PlayerBasicData,equips=Equips},
    io:format("Data:~p~n", [Data]),
    send_data(Socket, Data);

process_notify_login_result(#notify_login_result{result=?lr_ok},
			    Socket, _List, _RoleName, _Password) ->
    send_data(Socket, #req_enter_game{});
process_notify_login_result(#notify_login_result{result=?lr_fail_version}, _Socket, _List, _RoleName, _Password) ->
    printf("Account version error~n");
process_notify_login_result(#notify_login_result{result=?lr_fail}, _Socket, _List, _RoleName, _Password) ->
    printf("Account login fail~n").

process_notify_create_role_result(#notify_create_role_result{result=Result}, Socket, _List, _RoleName, _Password) ->
    case Result of
        ?rr_ok ->
            Data = #req_enter_game{},
            send_data(Socket, Data);
        ?rr_fail ->
            printf("create role fail~n")
    end.

process_notify_enter_game(#notify_enter_game{}, _Socket, _List, _RoleName, _Password) ->

    printf("enter scene success~n"),
    %% process_req_modify_furniture_permission(Socket),
    %% process_req_use_furniture(Socket);
    %%Data = #req_enter_player_house{account=test1},
    %% Data = #req_enter_common_scene{scene_id = 1},
    %% send_data(Socket, Data),
    %% send_data(Socket, #req_player_basic_data{}),
    %% send_data(Socket, #req_sys_time{}),
    %% process_req_task_list(Socket),
    ok.




%%--------------------------------------------------------------------------------

process_notify_player_leave_scene({notify_player_leave_scene, Result}, _Socket, _List, _RoleName, _Password) ->
    printf("player leave scene~p~n", [Result]).

process_notify_other_player_data(Data, _Socket, _List, _RoleName, _Password) ->
    printf("Data:~p~n", [Data]).


process_notify_player_data(_Data, Socket, _List, _RoleName, _Password) ->
    send_data(Socket, #req_start_change_dress{}),
    %% Packet = #req_change_dress{goods_list=[875], lover_goods_list=[], item_list=[]},
    %%io:format("Packet:~p~n", [Packet]),
    %% send_data(Socket, Packet),

    %% send_data(Socket, #req_start_mind_quiz{}),
    %% send_data(Socket, #req_mind_quiz_reward{level=1}),
    send_data(Socket, #req_start_recover_hp{}),
    send_data(Socket, #req_flower_shake{house_id=72255026655133720,shake_count=1,enable_props=0}),
    send_data(Socket, #req_give_login_reward{}),
    send_data(Socket, #req_products{}),
    %% send_data(Socket, #req_expand_food_stock{id=1}),
    %% send_data(Socket, #req_expand_produce_area{}),
    %% send_data(Socket, #req_exchange{id=1}),
    %% send_data(Socket, #req_start_body_action{action_status="aaa", action_type="bbb"}),
    %% send_data(Socket, #req_end_body_action{}),
    %% GiftInfo = #gift_info{gift_id=0, receiver=b, sender=a, gift_box=10000, gift=#item{instance_id=72109629982769178, template_id=300004}},
    %% send_data(Socket, #req_send_gift{gift=GiftInfo}),
    %% send_data(Socket, #req_receive_gift_list{}),
    %% send_data(Socket, #req_received_gift_list{}),
    %%send_data(Socket, #req_receive_gift{house_id=72109650618875916, gift_ids=[72117604492378113]}),
    %send_data(Socket, #req_gm_command{type=?gct_add_item, params=["1"]}),
    %send_data(Socket, #req_swap_item{index1=1,index2=2}).
    ok.


%% process_notify_npc_list({notify_npc_list, [#npc_map_mapping_info{npc_key=_NpcKey}|_NpcMapMappings]}, _Socket, _List, _RoleName, _Password) ->
%%     ok.
    %% Data = #req_npc_command{npc_key=NpcKey, unique_id=1, page_index=1, command_index=1},
    %% send_data(Socket, Data).

%% process_req_use_furniture(Socket) ->
%%     Data = #req_use_furniture{instance_id=72145459250266116, function_id=33, account=test1},
%%     send_data(Socket, Data).

process_notify_use_furniture_result(#notify_start_use_furniture{position_index=PositionIndex}, 
				    Socket, _List, _RoleName, _Password) ->
    case PositionIndex > 0 of
	true ->
	    Data = #req_stop_use_furniture{},
	    send_data(Socket, Data);
	_ ->
	    ok
    end.

%% process_req_modify_furniture_permission(Socket) ->
%%     Data = #req_modify_furniture_permission{furniture_permission=1},
%%     send_data(Socket, Data).

%% process_req_task_list(Socket) ->
%%     Data = #req_task_list{},
%%     send_data(Socket, Data).

%% 通用的网络消息处理函数
common_proc(_Data, _Socket, _List, _RoleName, _Password) ->
    ok.

find_proc(MsgType, List) ->
    case lists:keyfind(MsgType, 1, List) of
	{_, Proc} ->
	    Proc;
	_ ->
	    fun common_proc/5
    end.

printf(_Str) ->
    data_helper:format(_Str),
    ok.

printf(_Str, _Params) ->
    data_helper:format(_Str, _Params),
    ok.

%% %% TODO: 获得一条行走路径
%% get_path(Pos)->
%%     [].
