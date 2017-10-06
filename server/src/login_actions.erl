%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2013, hongjx
%%% @doc
%%%  ��Ҫ���������½��, �ż���Ʒ������
%%% @end
%%% Created :  7 Jan 2013 by hongjx <hongjx@35info.cn>

-module(login_actions).


-record(login_actions, 
       {account, actions=[]}).

-export([add/4, on_login/1]).

on_login(Account) ->
    F = fun() ->
		L = get_actions(Account),
		MsgList = [M:F(Account, A) || {M, F, A} <- L],
		
		db:delete({login_actions, Account}),
		MsgList
	end,
    %% �ռ���Ϣ
    MsgList = db:transaction(F),
    %% ������Ϣ
    [begin
	 [Fn() || Fn <- Funs] 
     end || {_, Funs} <- MsgList].


add(Account, M, F, A) when is_atom(Account) ->    
    Action = {M, F, A},
    Fn = fun(#login_actions{actions=Actions}=R) -> 
		R#login_actions{actions=Actions ++ [Action]}
	end,

    DefRecord = #login_actions{account=Account},
    modify(login_actions, Account, Fn, DefRecord).	    

%%%===================================================================
%%% �ڲ�����
%%%===================================================================
%% �޸ļ�¼, �ȶ�ȡ���޸ĺ�д��
modify(Table, Key, FModify, DefRecord) when is_atom(Table) ->
    case db:read(Table, Key) of		    
	[Record] -> 
	    NRecord = FModify(Record),
	    db:write(NRecord);
	_ -> %%no_record
	    NRecord = FModify(DefRecord),
	    db:write(NRecord)			
    end.


get_actions(Account) when is_atom(Account) ->
    case db:read(login_actions, Account) of
	[] ->
	    [];
	[#login_actions{actions=L}] -> 
	    L
    end.    




