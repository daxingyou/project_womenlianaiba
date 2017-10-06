%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2013, hongjx
%%% @doc
%%%  主要用来处理登陆后, 才加物品的需求
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
    %% 收集消息
    MsgList = db:transaction(F),
    %% 发送消息
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
%%% 内部函数
%%%===================================================================
%% 修改记录, 先读取，修改后写入
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




