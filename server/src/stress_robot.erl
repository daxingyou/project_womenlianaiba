%% Author: NoteBook
%% Created: 2009-9-11
%% Description: Add description to client
-module(stress_robot).

%%
%% Include files
%%
-include("net_type.hrl").
-include("packet_def.hrl").  
-include("enum_def.hrl").

-define(chat, ["test1",
	       "test2",
	       "test3"
	      ]).

-define(indoor, [#point{x=4, y=0, z=4}, 
		 #point{x=3.2, y=0, z=3.1},
		 #point{x=4.2, y=0, z=4.1},
		 #point{x=4.1, y=0, z=3},
		 #point{x=1.2, y=0, z=2.1},
		 #point{x=3.2, y=0, z=3.5},
		 #point{x=2.2, y=0, z=2.1}]).

-define(outdoor, [#point{x=1290, y=0, z=-534}, 
	       #point{x=1072, y=0, z=-371}, 
	       #point{x=1613, y=0, z=-90},
	       #point{x=1240, y=0, z=-170},
	       #point{x=1252, y=0, z=-109},
	       #point{x=973, y=0, z=24},
	       #point{x=1621, y=0, z=26},
	       #point{x=1810, y=0, z=-26},
	       #point{x=1322, y=0, z=-295},
	       #point{x=989, y=0, z=-800},
	       #point{x=1853, y=0, z=-661},
	       #point{x=1596, y=0, z=-190},
	       #point{x=1380, y=0, z=-166},
	       #point{x=1531, y=0, z=-214},
	       #point{x=1511, y=0, z=-12},
	       #point{x=1414, y=0, z=-37},
	       #point{x=1604, y=0, z=-260},
	       #point{x=1443, y=0, z=-231},
	       #point{x=1581, y=0, z=-488},
	       #point{x=1695, y=0, z=-94},
	       #point{x=1961, y=0, z=-524},
	       #point{x=1828, y=0, z=-12},
	       #point{x=1555, y=0, z=-79},
	       #point{x=1760, y=0, z=-276},
	       #point{x=1575, y=0, z=-16},
	       #point{x=1407, y=0, z=-87},
	       #point{x=1305, y=0, z=-60},
	       #point{x=1582, y=0, z=-30}]).

-define(boy, [%%[#item{template_id=117}, #item{template_id=576}, #item{template_id=510}, 
	       %%#item{template_id=275}, #item{}, #item{}, #item{}, #item{}],
	      [#item{template_id=300000}, #item{}, #item{}, #item{}, #item{}, #item{}, #item{}, #item{}]
	      %%[#item{template_id=311}, #item{}, #item{}, #item{}, #item{}, #item{}, #item{}, #item{}],
	      %%[#item{template_id=312}, #item{}, #item{}, #item{}, #item{}, #item{}, #item{}, #item{}],
	      %%[#item{template_id=313}, #item{}, #item{}, #item{}, #item{}, #item{}, #item{}, #item{}],
	      %%[#item{template_id=318}, #item{}, #item{}, #item{}, #item{}, #item{}, #item{}, #item{}],
	      %%[#item{template_id=319}, #item{}, #item{}, #item{}, #item{}, #item{}, #item{}, #item{}],
	      %%[#item{template_id=320}, #item{}, #item{}, #item{}, #item{}, #item{}, #item{}, #item{}]
	      %%[#item{template_id=321}, #item{}, #item{}, #item{}, #item{}, #item{}, #item{}, #item{}]
	     ]).
-define(girl, [[#item{template_id=913}, #item{template_id=1189}, #item{}, #item{}, #item{}, #item{}, #item{}, #item{}],
	       [#item{template_id=914}, #item{template_id=1189}, #item{}, #item{}, #item{}, #item{}, #item{}, #item{}],
	       [#item{template_id=915}, #item{template_id=1189}, #item{}, #item{}, #item{}, #item{}, #item{}, #item{}],
	       [#item{template_id=916}, #item{template_id=1189}, #item{}, #item{}, #item{}, #item{}, #item{}, #item{}],
	       [#item{template_id=917}, #item{template_id=1189}, #item{}, #item{}, #item{}, #item{}, #item{}, #item{}],
	       [#item{template_id=918}, #item{template_id=1189}, #item{}, #item{}, #item{}, #item{}, #item{}, #item{}],
	       [#item{template_id=919}, #item{template_id=1189}, #item{}, #item{}, #item{}, #item{}, #item{}, #item{}],
	       [#item{template_id=920}, #item{template_id=1189}, #item{}, #item{}, #item{}, #item{}, #item{}, #item{}],
	       [#item{template_id=921}, #item{template_id=1189}, #item{}, #item{}, #item{}, #item{}, #item{}, #item{}],
	       [#item{template_id=922}, #item{template_id=1189}, #item{}, #item{}, #item{}, #item{}, #item{}, #item{}],
	       [#item{template_id=923}, #item{template_id=1189}, #item{}, #item{}, #item{}, #item{}, #item{}, #item{}],
	       [#item{template_id=924}, #item{template_id=1189}, #item{}, #item{}, #item{}, #item{}, #item{}, #item{}]
	      ]).

%%
%% Exported Functions
%% 
-export([start/1, start/5, stop_walk/1, chat_around/2]).   
%%
%% API Functions
%%
start(Ip, Port, RoleName, Num, ModNum) ->
    {{Y, M, D}, {H, Min, S}} = erlang:localtime(),
    rand:seed(Y+M+D, H+Min+S, Num),
    start([Ip, Port, RoleName, Num, ModNum]).

start([Ip, Port, RoleName, Num, ModNum]) ->
    Socket = connect(Ip, list_to_integer(Port)),
    io:format("client version:~p~n", [?proto_ver]),
    Data = #req_login{account=RoleName, version=?proto_ver},
    gen_tcp:send(Socket, <<"GET / HTTP/1.1\r\nHost: app35398.qzoneapp.com:8001\r\n\r\n">>),
    send_data(Socket, Data),
    loop(Socket, init(), RoleName, Num, ModNum).


%%
%% Add description of start/function_arity
%%
connect(Ip, Port) -> 
    %application:start(tcp_server),
    %%Ip = "app35398.qzoneapp.com",
    {ok, Socket} = gen_tcp:connect(Ip, Port, [{packet, 4}]),
    Socket.
%%
%% Local Functions
%%

init() ->
    [{?msg_notify_login_result, fun process_notify_login_result/6},
     {?msg_notify_create_role_result, fun process_notify_create_role_result/6},
     {?msg_notify_other_player_data, fun process_notify_other_player_data/6},
     {?msg_notify_player_data, fun process_notify_player_data/6},
     {?msg_notify_enter_game, fun process_notify_enter_game/6},
     {?msg_notify_player_leave_scene, fun process_notify_player_leave_scene/6},
     {?msg_notify_house_data, fun common_proc/6},
     {?msg_notify_start_use_furniture, fun process_notify_use_furniture_result/6},
     {?msg_notify_stop_walk, fun process_notify_stop_walk/6},
     {?msg_notify_chat_around, fun process_notify_chat_around/6}
    ].

send_data(Socket, Data) ->
    io:format("Data:~p~n",[Data]),
    {Type, Binary} = protocal:encode(Data),
    Msg = net_helper:make_net_binary(Type, Binary),
    gen_tcp:send(Socket, Msg),
    ok.


loop(Socket, List, RoleName, Num, ModNum) ->
    receive
	{tcp, Socket, Bin} ->
	    Binary = list_to_binary(Bin),
	    {MsgType, MsgData}= net_helper:get_data(Binary),
	    Processor = find_proc(MsgType, List),
	    Processor(MsgData, Socket, List, RoleName, Num, ModNum),
	    loop(Socket, List, RoleName, Num, ModNum);
	{tcp_closed, Socket} ->
	    printf("tcp close~n")
    end.

%%--------------------------鐧诲綍娴佺▼----------------------------------------------
process_notify_login_result(#notify_login_result{result=?lr_no_roles, 
						 sex=_Sex, nick_name=RoleName},
			    Socket, _List, _RoleName, _Num, _ModNum) ->
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
			    Socket, _List, _RoleName, _Num, _ModNum) ->
    send_data(Socket, #req_enter_game{});
process_notify_login_result(#notify_login_result{result=?lr_fail_version}, _Socket, _List, _RoleName, _Num, _ModNum) ->
    printf("Account version error~n");
process_notify_login_result(#notify_login_result{result=?lr_fail}, _Socket, _List, _RoleName, _Num, _ModNum) ->
    printf("Account login fail~n").


process_notify_create_role_result({notify_create_role_result, Result}, Socket, _List, _RoleName, _Num, _ModNum) ->
    case Result of
        ?rr_ok ->
            Data = #req_enter_game{},
            send_data(Socket, Data);
        ?rr_fail ->
            printf("create role fail~n")
    end.

process_notify_enter_game(#notify_enter_game{}, Socket, _List, _RoleName, Num, _ModNum) ->
    
    printf("enter scene success~n"),

	%% true ->
	%%     send_data(Socket, #req_enter_common_scene{scene_id = 1}),
	%%     chat_around(Socket),
	%%     CPoint = #point{x=0, y=0, z=0},
    %%     walk(Socket, CPoint, ?outdoor);
    %% false ->
    send_data(Socket, #req_enter_common_scene{template_id=1, copy_id=0}),
    chat_around(Socket, Num),
    CPoint = #point{x=0, y=0, z=0},
    walk(Socket, CPoint, ?indoor).
%% end.

stop_walk({Socket, Point}) ->
    send_data(Socket, #req_stop_walk{pos=Point}).
%%--------------------------------------------------------------------------------

process_notify_player_leave_scene({notify_player_leave_scene, Result}, _Socket, _List, _RoleName, _Num, _ModNum) ->
    printf("player leave scene~p~n", [Result]).

process_notify_other_player_data(Data, _Socket, _List, _RoleName, _Num, _ModNum) ->
    printf("Data:~p~n", [Data]).


process_notify_player_data(_Data, _Socket, _List, _RoleName, _Num, _ModNum) ->
    ok.


process_notify_use_furniture_result(#notify_start_use_furniture{position_index=PositionIndex}, 
				    Socket, _List, _RoleName, _Num, _ModNum) ->
    case PositionIndex > 0 of
	true ->
	    Data = #req_stop_use_furniture{},
	    send_data(Socket, Data);
	_ ->
	    ok
    end.

process_notify_stop_walk({notify_stop_walk, Account, CPoint}, Socket, _List, RoleName, Num, ModNum) ->
    case Account =:= RoleName of
    	true ->
	    case (Num rem ModNum) == 0 of
		true ->
		    walk(Socket, CPoint, ?indoor);
		false ->
		    walk(Socket, CPoint, ?indoor) 
	    end;
    	_ ->
    	    ok
    end.

process_notify_chat_around({notify_chat_around, Account, _PlayerName, _Content}, Socket, _List, RoleName, _Num, _ModNum) ->
    case Account =:= RoleName of
	true ->
	    
	    send_data(Socket, #req_chat_around{content=get_chat_content()});
	_ ->
	    ok
    end.

%% 通用的网络消息处理函数
common_proc(_Data, _Socket, _List, _RoleName, _Num, _ModNum) ->
    ok.

find_proc(MsgType, List) ->
    case lists:keyfind(MsgType, 1, List) of
	{_, Proc} ->
	    Proc;
	_ ->
	    fun common_proc/6
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
 
walk(Socket, CPoint, Type) ->
    Point = get_walk_point(Type),
    send_data(Socket, #req_start_walk{curr_pos=CPoint, dest_pos=Point}),
    X = Point#point.x + CPoint#point.x,
    Z = Point#point.z + CPoint#point.z,
    Timer =get_timer(trunc(X+Z)),
    %% data_helper:format("Timer:~p~n", [Timer]),
    timer:sleep(Timer),
    send_data(Socket, #req_stop_walk{pos=Point}).

get_walk_point(Type) ->
    Number = rand:uniform(length(Type)),
    lists:nth(Number, Type).

get_chat_content() ->
    Number = rand:uniform(length(?chat)),
    lists:nth(Number, ?chat).

chat_around(Socket, Number) ->
    %% Content = get_chat_content(),
    Content = "robot"++integer_to_list(Number),
    send_data(Socket, #req_chat_around{content=Content}),
    Timer = rand:uniform(20000, 5000, 5000),
    timer:apply_after(Timer, stress_robot, chat_around, [Socket, Number]),
    timer:start().

get_timer(Dist) ->
    %% data_helper:format("Dist:~p~n", [Dist]),
    Ret1 = Dist div 100,
    Ret2 = Dist rem 100,
    case Ret2 > 0 of
	true ->
	    (Ret1 + 1) * 100 + 1500;
	_ ->
	    Ret1 * 100 + 1500
    end.
