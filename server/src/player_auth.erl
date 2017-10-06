%% Author: NoteBook
%% Created: 2009-9-12
%% Description: Add description to tcp_listen_player
-module(player_auth).

%%
%% Include files
%%
-include("packet_def.hrl").
-include("enum_def.hrl").
-include("tcp_mm_data.hrl").
-include("table_info.hrl").
-include("sys_msg.hrl").
-include("qq_strategy.hrl").
-include("records.hrl").

-define(NODE, 'game@wxp-linyj.CHINA-CHANNEL.COM').

%%
%% Exported Functions
%%
-export([call/4]).

%%
%% API Functions
%%

%% 请求登录
call(Socket, #tcp_mm_data{}=State, TimeOut, 
     {?msg_req_login, #req_login{account=Account, password=Password, ch=Channel, srvid=SrvId,
				 version=Ver, login_type=LoginType, pf_key=PFKey, iopenid=IOpenId}=ReqLogin}) ->
    case Ver =/= ?proto_ver of
	 true ->
	    data_helper:format("version error! client version: ~p server version:~p~n", [Ver, ?proto_ver]),
	    net_helper:send(Socket, #notify_login_result{result=?lr_fail_version}),
	    %% 版本不对，直X掉
	    %%{stop, normal, State};
	    {next_state, 'WAIT_FOR_AUTH', State, TimeOut};
	 _ ->
	    AccountAtom = list_to_atom(Account),
	    
	    case login_validate(ReqLogin) of
		{false, ErrCode}->
		    net_helper:send(Socket, #notify_sys_msg{code=ErrCode});		    
		ok->
		    UserInfo = qq_strategy:get_user_info(LoginType, Account, Password),
		    IsOnline = util:is_process_alive(AccountAtom),
		    LoginInfo = case LoginType of
				    "yy" ->
					#yy_platform_login_info{uid=Account, ch=Channel, srvid=SrvId};
				    _Other ->
					#platform_login_info{openid=Account, openkey=Password, pf=LoginType, pfkey=PFKey, iopenid=IOpenId}
				end,
		    data_helper:format("LoginInfo:~p~n",[LoginInfo]),
		    case IsOnline of
			true ->			    
			    case router:send(AccountAtom, get_tcp_mm_pid) of
				undefined ->
				    net_helper:send(Socket, #notify_login_result{result=?lr_fail});
				MMPid ->
				    tcp_mm:repeat_login_stop(MMPid),
				    db_player:insert_online_player(AccountAtom, UserInfo, LoginInfo),
				    net_helper:send(Socket, #notify_login_result{result=?lr_ok})
			    end;
			false ->
			    db_player:insert_online_player(AccountAtom, UserInfo, LoginInfo),
			    case db_player:select(AccountAtom) of
				[] -> 
				    %%Gender = db_pair_player:get_sex(AccountAtom),
				    %% 通知客户端创建人物
				    net_helper:send(Socket, 
						    #notify_login_result{result=?lr_no_roles,
									 nick_name=UserInfo#pengyou.nickname,
									 sex=convert_gender(UserInfo#pengyou.gender)});
				_BasicData ->
				    %%save_nick_name(UserInfo#pengyou.nickname, BasicData),
				    net_helper:send(Socket, #notify_login_result{result=?lr_ok})
			    end
		    end
	    end,
	    {next_state, 'WAIT_FOR_AUTH', State#tcp_mm_data{account=AccountAtom, 
							    password=Password,
							    login_type=LoginType,
							    pf_key=PFKey
							   }, TimeOut}
    end;

	
%% 处理创建角色的请求
call(Socket, #tcp_mm_data{account=AccountAtom, login_type=LoginType, addr=IP}=State, TimeOut, 
     {?msg_req_create_role, #req_create_role{basic_data=BasicData,equips=Equips, iopenid=Inviter}}) ->
    IsExist = db_player:is_exist(AccountAtom),
    NewState = State#tcp_mm_data{is_first_time_login=not IsExist},
    case IsExist of
        true -> 
            net_helper:send(Socket, #notify_create_role_result{result=?rr_fail}),
            {next_state, 'WAIT_FOR_AUTH', NewState, TimeOut};
        false ->% 玩家不存在，创建玩家的数据 
	    %% player_init:init(?NODE, AccountAtom, BasicData, Equips),
	    player_init:init(AccountAtom, BasicData, Equips),	    
	    case Inviter of 
		""->
		    ok;
		_->
		    data_helper:format("Inviter:~p~n",[Inviter]),
		    player_invite:add(list_to_atom(Inviter), atom_to_list(AccountAtom)),
		    ok
	    end,
	    net_helper:send(Socket, #notify_create_role_result{result=?rr_ok}),
	    stat:create_player(LoginType, AccountAtom, IP, self()),
	    {next_state, 'WAIT_FOR_AUTH', NewState, TimeOut}
    end;

%% 处理进入场景的请求
call(Socket, #tcp_mm_data{account=AccountAtom, password=Password, login_type=LoginType,
			  is_first_time_login=IsFirstTimeLogin, addr=IP, pf_key=PFKey}=State, 
     TimeOut, {?msg_req_enter_game, #req_enter_game{}}) ->
    net_helper:send(Socket, #notify_enter_game{}),
    net_helper:send(Socket, #notify_sys_time{sys_time=datetime:localtime()}),
    PlayerSupPid = start_player(AccountAtom, {self(),  
				IsFirstTimeLogin, Password, LoginType, IP, PFKey}),
    {next_state, 'WAIT_FOR_DATA', 
     State#tcp_mm_data{player_sup=PlayerSupPid}, TimeOut}.


%% 启动一个玩家进程, 并且监控该进程
%% MMPid:中间人Pid, Account:玩家帐号
start_player(Account, Params) ->
    case player_sup:start(Account, Params) of
	{error,{already_started, Pid1}} -> 
	    player_sup:stop(node(Pid1), Account),
	    {ok, Pid3} = player_sup:start(Account, Params),
	    Pid3;
	{error,already_present} ->
	    player_sup:stop(player_sup:get_sup_name(Account), Account),
	    {ok, Pid4} = player_sup:start(Account, Params),
	    Pid4;
	{ok, Pid2} -> Pid2
    end.



%% save_nick_name("", _BasicData) ->
%%     ok;
%% save_nick_name(NickName, BasicData) ->
%%     db_player:update_user_name(NickName, BasicData).


%% 将QQ的性别表示转换为游戏中的性别表示
convert_gender([231,148,183])->
    ?st_boy;
convert_gender([229,165,179])->
    ?st_girl;
convert_gender(_) ->
    ?st_unknow.

%% 是否允许测试账号登陆
-ifdef(release).
unkown_type_login_validate(#req_login{account=""}) ->
    {false, ?err_login_account_or_password}.
-else.
unkown_type_login_validate(#req_login{account=""}) ->
    {false, ?err_login_account_empty};
unkown_type_login_validate(#req_login{}) ->
    ok.
-endif.

login_validate(#req_login{login_type=""}=ReqLogin)->
    unkown_type_login_validate(ReqLogin);

login_validate(ReqLogin)->
    normal_login_validate(ReqLogin).

normal_login_validate(#req_login{account=""})->
    {false, ?err_login_account_or_password};

%% normal_login_validate(#req_login{password=""}) ->
%%     {false, ?err_login_account_or_password};

normal_login_validate(#req_login{account=Account}) ->
    case unvalidate_player_credit_level(Account) of
	false->
	    case db_player:get_user_mateup_status(Account) of
		?mst_mateuping ->
		    %% 正在配对，无法登陆
		    {false, ?err_you_are_mateuping_can_not_login};
		?mst_breakuping ->
		    %% 正在配对，无法登陆
		    {false, ?err_you_are_breakuping_can_not_login};
		_->
		    ok
	    end;
	true ->
	     {false, ?err_you_are_in_shitlist}
    end.

unvalidate_player_credit_level(Account)->
    shit_player:is_shit(list_to_atom(Account)).    

