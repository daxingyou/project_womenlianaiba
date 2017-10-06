%%%-------------------------------------------------------------------
%%% @author lyj <lyj@35info.cn>
%%% @copyright (C) 2012, lyj
%%% @doc
%%% 关注列表
%%% @end
%%% Created :  8 Mar 2012 by lyj <lyj@35info.cn>
%%%-------------------------------------------------------------------
-module(attention).

-export([start/1, handle_cast/2]).
-export([get_account/1, get_count/1, get_attention_list/1]).
-compile(export_all).

-include("packet_def.hrl").
-include("router.hrl").
-include("sys_msg.hrl").

-define(max_attention, 50).

-record(attention, {account,        %% 关注列表的主人
		    attentions = [],%% 列表
		    count=0         %% 受关注的数量
		   }).

start(Account) ->
    [router:make_event_source(?msg_req_add_attention, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_cancel_attention, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_get_attention_list, Account, {Account, ?MODULE})
    ].

get_account(#attention{account=Account}) ->
    Account.

get_count(#attention{count=Count}) ->
    Count.

%% 请求获得派对列表
handle_cast({#msg{src=Account}, #req_add_attention{account=AttentionAcc,name=Name}}, PlayerData) ->
    do_add_attention(Account, Name, AttentionAcc),
    {noreply, PlayerData};
handle_cast({#msg{src=Account}, #req_cancel_attention{account=CancelAcc}}, PlayerData) ->
    do_cancel_attention(Account, CancelAcc),
    {noreply, PlayerData};
handle_cast({#msg{src=Account}, #req_get_attention_list{}}, PlayerData) ->
    do_get_attention_list(Account),
    {noreply, PlayerData}.

do_add_attention(Account, Name, AttentionAcc) ->
    Attentions = db_get(Account),
    case can_add_attention(AttentionAcc, Attentions#attention.attentions, ?max_attention) of
    	true -> 
    	    NewAttentions = add_attention(AttentionAcc, Attentions),
    	    db_add_attention(NewAttentions, AttentionAcc),
    	    send_add_attention(Account, AttentionAcc),
	    router:cast(Account, add_attention_event, AttentionAcc),
    	    sys_msg:send(Account, ?msg_add_attention_success, [Name]);
    	{false, Reason} -> sys_msg:send(Account, Reason)
    end.

send_add_attention(Account, AttentionAcc) ->    
    HasEvent = case farm:has_event(get_atom(AttentionAcc)) of
		    true -> 1;
		    _ -> 0
		end,
    FriendItem = #friend_item{account=AttentionAcc, crop_event=HasEvent},
    Pack = #notify_add_attention{info=FriendItem},
    net_helper:send2client(Account, Pack).

do_cancel_attention(Account, CancelAcc) ->
    Attentions = db_get(Account),
    case can_cancel_attention(CancelAcc, Attentions#attention.attentions) of
	true -> 
	    NewAttentions = cancel_attention(CancelAcc, Attentions),
	    db_cancel_attention(NewAttentions, CancelAcc),
	    send_cancel_attention(Account, CancelAcc);
	{false, Reason} -> sys_msg:send(Account, Reason)
    end.

dec_count(AttentionAcc) ->
    [Record] = db:dirty_read(attention, AttentionAcc),
    Count = Record#attention.count-1,
    case Count >= 0 of
	true -> Record#attention{count=Record#attention.count-1};
	false -> Record#attention{count=0}
    end.
    

send_cancel_attention(Account, CancelAcc) ->
    Pack = #notify_cancel_attention{account = CancelAcc},
    net_helper:send2client(Account, Pack).

do_get_attention_list(Account) ->
    Attention = db_get(Account),
    send_attention_list(Account, Attention).

get_attention_list(Account) ->
    Attention = db_get(Account),
    Attention#attention.attentions.

send_attention_list(Account, Attention) ->
    L = Attention#attention.attentions,
    NewL = [begin
		Acc = get_atom(X),
		HasEvent = case farm:has_event(Acc) of
		    true -> 1;
		    _ -> 0
		end,

		#friend_item{account=Acc, crop_event=HasEvent}
	    end || X <- L],
    Pack = #notify_attention_list{attentions=NewL},
    net_helper:send2client(Account, Pack).

get_atom(S) when is_list(S) ->
    list_to_atom(S);
get_atom(Acc) when is_atom(Acc) ->
    Acc.


%% 判断能否增加到关注列表
can_add_attention(_AttentionAcc, List, MaxCount) when length(List) >= MaxCount ->
    %% 判断是否到达上限
    {false, ?msg_attention_full};
can_add_attention(AttentionAcc, List, _MaxCount) ->
    %% 判断是否已经在列表中
    case lists:member(AttentionAcc, List) of
	true -> {false, ?msg_exist_in_attention};
	false -> true
    end.

%% 增加到关注列表
add_attention(AttentionAcc, Attention) ->
    List = [AttentionAcc | Attention#attention.attentions],
    Attention#attention{attentions=List}.

%% 判断能否取消关注
can_cancel_attention(AttentionAcc, List) ->
    %% 判断帐号是否已经存在于关注列表中
    case lists:member(AttentionAcc, List) of
	true -> true;
	false -> {false, ?msg_not_exist_in_attention}
    end.

%% 取消关注
cancel_attention(CancelAcc, Attention) ->
    List = lists:delete(CancelAcc, Attention#attention.attentions),
    Attention#attention{attentions=List}.


make_attention(Account, Attentions) ->
    make_attention(Account, Attentions, 0).

make_attention(Account, Attentions, Count) ->
    #attention{account = Account, attentions = Attentions, count = Count}.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% 数据库层的操作 %%
db_get(Account) ->
    case db:dirty_read(attention, Account) of
	[] ->
	    Attention1 = make_attention(Account, []),
	    Attention1;
	[Attention] ->
	    Attention
    end.

db_save(Attention) ->
    db:dirty_write(Attention).

db_add_attention(Attention, AttentionAcc) ->
    Account = list_to_atom(AttentionAcc),
    F = fun() ->
		case db:read(attention, Account) of
		    [] ->
			db:write(make_attention(Account, [], 1));
		    [Record] ->
			db:write(Record#attention{count=Record#attention.count+1})
		end,
		db:write(Attention)
	end,
    db:transaction(F).

db_cancel_attention(Attention, CancelAcc) ->
    Account = list_to_atom(CancelAcc),
    F = fun() ->
		[Record] = db:read(attention, Account),
		db:write(Record#attention{count=Record#attention.count-1}),
		db:write(Attention)
	end,
    db:transaction(F).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% 单元测试代码 %%


-ifdef(TEST).
-include_lib("eunit/include/eunit.hrl").

-endif.
