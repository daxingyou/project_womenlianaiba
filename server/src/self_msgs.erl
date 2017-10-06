%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%  ���������Ϣ
%%% @end
%%% Created : 10 Jul 2012 by hongjx <hongjx@35info.cn>

-module(self_msgs).

-export([start/1, handle_cast/2]).
-export([notify/1, add_whip_msg/5, add_hire_msg/5]).

-include("packet_def.hrl").

-record(self_msgs, 
	{account='',
	 has_read=true, %% �Ѷ����
	 msgs=[]        %% ������Ϣ(��ʱ������)
	}
       ).

start(Account) ->
    [
     router:make_event_source(?msg_req_self_msgs, Account, {Account, ?MODULE})
    ].



notify(Account) when is_atom(Account) ->
    %% �鿴��ȡ��־
    case db:dirty_read(self_msgs, Account) of
	[#self_msgs{has_read=false}] ->
	    %% ֪ͨ���µ�δ����Ϣ
	    net_helper:send2client(Account, #notify_new_self_msgs{});
	_ ->
	    ok
    end.

add_whip_msg(Account, Boss, FriendAccount, IsNpc, WhipCount) ->
    Now = datetime:localtime(),
    
    %% ���ݱ�Ϊδ��
    case IsNpc of
	0 -> %% ���Ѳ���npc
	    FriendR = read_record(FriendAccount),
	    #self_msgs{msgs=FriendMsgs} = FriendR,
	    BeWhipMsg = #be_whip_msg{time=Now, 
				  friend_account=Account},
	    db:write(FriendR#self_msgs{has_read=false, 
					   msgs=[BeWhipMsg | FriendMsgs]});
	_ ->
	    ok
    end,

    MyR = read_record(Boss),
    #self_msgs{msgs=MyMsgs} = MyR,

    WhipMsg = #whip_msg{time=Now, account=Account, is_npc=IsNpc,  
			friend_account=FriendAccount, whip_count=WhipCount},

    db:write(MyR#self_msgs{has_read=false, msgs=[WhipMsg | MyMsgs]}),
    
    ok.


add_hire_msg(Account, Cost, FriendAccount, IsNpc, GainExp) ->
    Now = datetime:localtime(),
    %% ���ݱ�Ϊδ��
    case IsNpc of
	0 -> %% ���Ѳ���npc
	    FriendR = read_record(FriendAccount),
	    #self_msgs{msgs=FriendMsgs} = FriendR,
	    BeHireMsg = #be_hire_msg{time=Now, 
				     friend_account=Account, gain_exp=GainExp},
	    db:write(FriendR#self_msgs{has_read=false, 
					   msgs=[BeHireMsg | FriendMsgs]});
	_ ->
	    ok
    end,

    MyR = read_record(Account),
    #self_msgs{msgs=MyMsgs} = MyR,

    HireMsg = #hire_msg{time=Now, is_npc=IsNpc, 
			friend_account=FriendAccount, cost_money=Cost},
    db:write(MyR#self_msgs{has_read=false, msgs=[HireMsg | MyMsgs]}),
    
    ok.

%%%===================================================================
%%% ����handle_cast
%%%===================================================================
% ���Ѱ�æ�޴򣬼ӿ�ʱ����
handle_cast({_Msg, #req_self_msgs{}}, State) ->
    Account = player_data:get_account(State),

    Packet = update_self_msgs(Account),
    
    net_helper:send2client(Account, Packet),

    {noreply, State}.


%%%===================================================================
%%% �ڲ�����
%%%===================================================================
do_update_self_msgs(Account) ->
    Now = datetime:localtime(),
    %% ��������, ȥ��3��ǰ������
    Day3 = datetime:dec_time(Now, 3 * 24 * 60 * 60),
    R = read_record(Account),
    #self_msgs{msgs=Msgs} = R,
    NewMsgs = [begin 
		   X 			 
	       end || X <- Msgs, element(2, X) >  Day3],

    %% ���ݱ�Ϊ�Ѷ�     
    %% д��������
    db:write(R#self_msgs{has_read=true, msgs=NewMsgs}),
    NewMsgs.

update_self_msgs(Account) ->
    NewMsgs = db:transaction(fun() -> do_update_self_msgs(Account) end),
    F = fun(X, #notify_self_msgs{hire_msgs=HireMsgs, whip_msgs=WhipMsgs,
				 be_whip_msgs=BeWhipMsgs,
				 be_hire_msgs=BeHireMsgs}=Acc) ->
		case X of
		    #hire_msg{} ->
			Acc#notify_self_msgs{hire_msgs=[X | HireMsgs]};
		    #be_hire_msg{} ->
			Acc#notify_self_msgs{be_hire_msgs=[X | BeHireMsgs]};
		    #whip_msg{} ->
			Acc#notify_self_msgs{whip_msgs=[X | WhipMsgs]};
		    #be_whip_msg{} ->
			Acc#notify_self_msgs{be_whip_msgs=[X | BeWhipMsgs]}
		end
	end,
    lists:foldl(F, #notify_self_msgs{}, NewMsgs).



    

read_record(Account) ->
    case db:read(self_msgs, Account) of
	[R] ->
	    R;
	_ ->
	    #self_msgs{account=Account}
    end.



