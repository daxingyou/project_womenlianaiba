%%% @author  <hjx>
%%% @copyright (C) 2010, 
%%% @doc
%%%   ��ұ�����
%%% @end
%%% Created : 27 May 2010 by  <hjx>

-module(player_be_invite).

-include("packet_def.hrl").
-include("mutex_actions.hrl").
-include("router.hrl").
-include("enum_def.hrl").
-include("sys_msg.hrl").
-include("common_def.hrl").


%% -record(invite_data, {
%% 	  invitor,                                 % ������
%% 	  invite_type,                             % ��������
%% 	  invite_params                            % �������
%% 	 }).

-export([handle_cast/2, start/1]).


start(Account) ->
    [
     router:make_event_source(be_invite, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_agree_invitation, Account, {Account, ?MODULE})
    ].


%%%===================================================================
%%% ����handle_cast
%%%===================================================================

handle_cast({#msg{event=be_invite}, {Invitor, Type}}, 
	    State) ->
    Account = player_data:get_account(State),

    [BasicData] = db:dirty_read(player_basic_data, Invitor),
    
    UserName = player_basic_data:get_username(BasicData),

    Packet = #notify_invitation{invitor=atom_to_list(Invitor), 
				invitor_name=UserName, type=Type},
    %% �Է��յ�����
    net_helper:send2client(Account, Packet),
    
    {noreply, State};

%% ����ͬ������
handle_cast({_Msg, 
	     #req_agree_invitation{invitor=InvitorStr, type=Type}}, 
	    State) ->
    Invitor = list_to_atom(InvitorStr),
    Invitee = player_data:get_account(State),    

    %% ����������״̬
    NewState = do_agree_invitation(Invitor, Invitee, Type, [], State),
    {noreply, NewState}.


%%%===================================================================
%%% Api
%%%===================================================================



%%%===================================================================
%%% �ڲ�����
%%%===================================================================
do_agree_invitation('', _Invitee, _Type, _Params, State) ->
    erlang:error({'Invitor can not be empty.'}),
    State;
%% ˽�˾ۻ�
do_agree_invitation(Invitor, Invitee, ?ivt_private_party, _Params, State) ->
    player_change_scene:enter_other_home(Invitor, Invitee, ?eht_party, true, State);
do_agree_invitation(_Invitor, _Invitee, Type, _Params, State) ->
    erlang:error({'unhandle do agree invitation type' , Type}),
    State.
