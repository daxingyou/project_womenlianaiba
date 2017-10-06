%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%% 用户配对
%%% @end
%%% Created : 17 Feb 2012 by LinZhengJian <linzhj@35info.cn>

-module(player_mateup).

-include("router.hrl").
-include("packet_def.hrl").
-include("player_data.hrl").
-include("register.hrl").
-include("qq_strategy.hrl").
-include("enum_def.hrl").
-include("resource.hrl").
-include("sys_msg.hrl").
-include("house_data.hrl").
-include("tplt_def.hrl").
-include("records.hrl").
-include("common_def.hrl").

-export([start/1, handle_cast/2]).

-export([send_pair_number/1]).

-export([correct_mateup_status/1]).

start(Account)->
    [
     router:make_event_source(?msg_req_mateup, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_mateup_number, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_mateup_select, Account, {Account, ?MODULE})
    ].

handle_cast({#msg{event=?msg_req_mateup}, Data}, #player_data{account=Account}=State) ->
    {ok, NState, MessageList} =    
	case mateup_validate(db_pair_player:get_lover(Account)) of
	    ok ->
		mateup(Data, State);
	    _->
		{ok, State, [{Account, {sysmsg, ?err_mateup_unknow}}]}
	end,
    send2client(MessageList),
    {noreply, NState};
handle_cast({#msg{event=?msg_req_mateup_select}, #req_mateup_select{match_account=MatchAccountString}=Data}, 
	    #player_data{account=Account, login_type=LoginType, password=Password}=State) ->
    MatchAccount = list_to_atom(MatchAccountString),
    case mateup_validate(db_pair_player:get_lover(Account)) of
	ok->
	    case mateup_select(Data, State) of
		{ok, true} ->
		    Gender = db_pair_player:get_sex(Account),
		    %% 验证牵手费
		    ShipCallback = 
			fun(#order{status=Status}=_Order)-> 			   
				case (Status =:= ?order_payed) of
				    true ->
					mateup_success(Account, MatchAccount, Gender, LoginType, Password),
					?pay_shipped;
				    _ ->
					%% send2client([{[Account], {notify, #notify_mateup_fail{message=?message_mateup_not_enough_love_coin}}}]),
					?pay_error
				end				       
			end,

		    player_love_coin:pay([{0, 1, 100}], 
					 ShipCallback, 
					 ?order_goods_meta_mate_up, State);
		{ok, MessageList} ->
		    send2client(MessageList)
	    end;
	_->
	    send2client([{Account, {sysmsg, ?err_mateup_unknow}}])
    end,

    {noreply, State};

handle_cast({#msg{event=?msg_req_mateup_number}, _Data}, #player_data{account=Account}=State) ->
    {ok, NState, MessageList} =
	case mateup_validate(db_pair_player:get_lover(Account)) of
	    ok->
		case register:get_pair_info(Account) of
		    {Account, BoyNumber, GirlNumber, _Gender}->
			{ok, State, [{Account, {notify, #notify_mateup_number{boy_number=BoyNumber, girl_number=GirlNumber}}}]};
	    _->
			{ok, State, [{Account, {sysmsg, ?err_mateup_unknow}}]}
		end
	end,
    send2client(MessageList),  
    {noreply, NState}.


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% 公开的方法
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
send_pair_number(Account)->
    case register:get_pair_info(Account) of
	{Account, BoyNumber, GirlNumber, _Gender}->
	    net_helper:send2client(Account, #notify_mateup_number{boy_number=BoyNumber, girl_number=GirlNumber});
	_->
	    net_helper:send2client(Account, #notify_mateup_number{})
    end.    

%%% @spec correct_mateup_status(atom())->ok.
%%% @doc 修正配对失败时的玩家状态
%%%      修改成?mst_single
%%% @end
-spec correct_mateup_status(atom())->ok.
correct_mateup_status(Account)->
    Player = db_player:select(Account),
    db:dirty_write(Player#player_basic_data{mateup_status=?mst_single}),
    HouseId=db_pair_player:get_house_id(Account),
    House=db_house:select(HouseId),
    db:dirty_write(House#house_data{mateup_status=?mst_single}).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%
%  内部方法
%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
mateup_validate(Lover)->
    case Lover of
	'' -> %% 还没配对成功
	    ok;
	Lover when is_atom(Lover)->
	    {error, mateuped};
	{error, Reason}->
	    {error, Reason};
	_Any ->
	    {error, unknow}
    end.

mateup(#req_mateup{boy_number=BoyNumber, girl_number=GirlNumber},
	    #player_data{account=Account, password=Password, login_type=LoginType}=State)->
    register:add_pair_info(Account, BoyNumber, GirlNumber, ""),
    PairInfoList = register:get_pair_info(BoyNumber, GirlNumber),
    %% 过滤当前用户
    RealPairInfoList = lists:keydelete(Account, 1, PairInfoList),
    MessageList = 
	case RealPairInfoList of 
	    %%不存在：将配对信息写入数据库
	    []->
		register:add_pair_info(Account, BoyNumber, GirlNumber, ""),
		[{Account, {notify, #notify_mateup_wait{}}}];
	    _->
		EXOpenIDList = [atom_to_list(EXOpenID) || {EXOpenID, _EXBoyNumber, _EXGirlNumber, _Gender} <- RealPairInfoList],
		MateupList = common_platform:get_user_multi_info(LoginType, atom_to_list(Account), Password, EXOpenIDList),
		[{Account, {notify, #notify_mateup_list{mateup_list=MateupList}}}]
    end,
    {ok, State, MessageList}.

mateup_select(#req_mateup_select{match_account=MatchAccountString}, 
	      #player_data{account=Account, login_type=_LoginType, password=_Password})->
    MatchAccount = list_to_atom(MatchAccountString),
    {Account, BoyNumber, GirlNumber, _UnusedGender} = register:get_pair_info(Account),
    MessageList = 
	case mateup_validate_lover(db_pair_player:get_lover(MatchAccount)) of 
	    ok-> %%被选中的玩家也还没配对成功
		case mateup_validate_matecode(BoyNumber, GirlNumber, MatchAccount, register:get_pair_info(MatchAccount)) of
		    ok->
			Gender = db_pair_player:get_sex(Account),
			case mateup_validate_gender(Gender, db_pair_player:get_sex(MatchAccount))of 
			    ok->
				true;
			    error-> %%性别相同
				[{[Account], {notify, #notify_mateup_fail{message=?message_mateup_same_gender}}}]
			end;
		    error-> %%配对号码验证失败
			[{[Account], {notify, #notify_mateup_fail{message=?message_mateup_not_match}}}]
		end;
	    error-> %%选中的用户已经配对成功
		[{[Account], {notify, #notify_mateup_fail{message=?message_mateup_mateuped}}}]
    end,
    {ok, MessageList}.


mateup_validate_matecode(BoyNumber, GirlNumber, MatchAccount, PairInfoOfMatchAccount)->
    case PairInfoOfMatchAccount of
	{MatchAccount, BoyNumber, GirlNumber, _UnusedGender}->
	    ok;
	_ ->
	    error
    end.

mateup_validate_lover(MatchAccountLover)->
    case MatchAccountLover of
	''-> ok;
	_-> error
    end.

mateup_validate_gender(Gender, MatchGender)->
    case Gender==MatchGender of
	true->
	    error;
	false-> 
	    ok
    end.

mateup_success(BoyAccount, GirlAccount, ?st_boy, PF, OpenKey)->
    OpenID = atom_to_list(BoyAccount),
    [BoyPlayer] = common_platform:get_user_multi_info(PF, OpenID, OpenKey, [OpenID]),
    [GirlPlayer] = common_platform:get_user_multi_info(PF, OpenID, OpenKey, [atom_to_list(GirlAccount)]),
    %% BoyPlayer = pengyou_to_player(qq_strategy:get_user_info(PF, OpenID, OpenKey)),
    %% GirlPlayer = pengyou_to_player(qq_strategy:get_user_single_info(PF, OpenID , OpenKey, atom_to_list(GirlAccount))),
    net_helper:send2client(BoyAccount, #notify_mateup_success{boy=BoyPlayer, girl=GirlPlayer}),
    net_helper:send2client(GirlAccount, #notify_mateup_success{boy=BoyPlayer, girl=GirlPlayer}),
    player_mateup_context:mateup(BoyAccount, GirlAccount),
    ok;

mateup_success(GirlAccount, BoyAccount, ?st_girl, PF, OpenKey)->
    OpenID=atom_to_list(GirlAccount),
    [BoyPlayer] = common_platform:get_user_multi_info(PF, OpenID, OpenKey, [atom_to_list(BoyAccount)]),
    [GirlPlayer] = common_platform:get_user_multi_info(PF, OpenID, OpenKey, [OpenID]),
    %% BoyPlayer = pengyou_to_player(qq_strategy:get_user_single_info(PF, OpenID, OpenKey, atom_to_list(BoyAccount))),
    %% GirlPlayer = pengyou_to_player(qq_strategy:get_user_info(PF, OpenID, OpenKey)),
    net_helper:send2client(BoyAccount, #notify_mateup_success{boy=BoyPlayer, girl=GirlPlayer}),
    net_helper:send2client(GirlAccount, #notify_mateup_success{boy=BoyPlayer, girl=GirlPlayer}),
    player_mateup_context:mateup(BoyAccount, GirlAccount),
    ok.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%
%  辅助方法
%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
send2client([0]) ->
    ok;
send2client([1]) ->
    ok;
send2client([])->
    ok;

send2client([Message])->
    send2client(Message);

send2client([Message|MessageList])->
    send2client(Message),
    send2client(MessageList);

send2client({Account, {sysmsg, Message}}) when is_atom(Account)->    
    sys_msg:send(Account, Message);

send2client({Account, {notify, Message}}) when is_atom(Account)->  
    data_helper:format("notify Account~p~n",[Account]),  
    net_helper:send2client(Account, Message);

send2client({[], _Message})->
    ok;

send2client({[Account|AccountList], Message}) when is_list(AccountList)->
    send2client({Account, Message}),					    
    send2client({AccountList, Message}).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%
%    单元测试
%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

-ifdef(TEST).
-include_lib("eunit/include/eunit.hrl").
player_mateup_test()->
    ?assertEqual(ok, mateup_validate('')),
    ?assertMatch({error, _}, mateup_validate(undefined)),
    
    ?assertEqual(ok, mateup_validate_matecode("12345", "12345", matchaccount, {matchaccount, "12345", "12345", ""})),
    ?assertEqual(error, mateup_validate_matecode("12345", "12345", matchaccount, {matchaccount1, "12345", "12345", ""})),
    ?assertEqual(error, mateup_validate_matecode("12345", "12345", matchaccount, {matchaccount, "123456", "12345", ""})),
    ok.
-endif.
