%%%-------------------------------------------------------------------
%%% @author lyj <lyj@35info.cn>
%%% @copyright (C) 2012, lyj
%%% @doc
%%%  升级关注的数据表
%%% @end
%%% Created : 29 Mar 2012 by lyj <lyj@35info.cn>
%%%-------------------------------------------------------------------
-module(db_update_attention).
-export([init_count/0]).

-record(attention, {account,        %% 关注列表的主人
		    attentions = [],%% 列表
		    count=0         %% 受关注的数量
		   }).

%% 初始化count字段
init_count() ->
    %% 1. 收集每个关注列表, 
    %% 2. 统计出相同的被关注的帐号
    %% 3. 如果帐号已经存在, 更新count
    %% 4. 如果帐号不存在, 则给一个空的关注列表, 并且更新count
    F = fun(#attention{attentions=List}, Acc) ->
		collect(List, Acc)
	end,
    Total = db:transaction(fun() -> mnesia:foldl(F, [], attention) end),
    save(Total),
    {atomic, ok}.

collect([], Acc) ->
    Acc;
collect([Account | Rest], Acc) ->
    case lists:keysearch(Account, 1, Acc) of
	{value, {_, Count}} ->
	    NAcc = lists:keyreplace(Account, 1, Acc, {Account, Count+1}),
	    collect(Rest, NAcc);
	false -> 
	    NAcc = [{Account, 1} | Acc],
	    collect(Rest, NAcc)
    end.

save(Total) ->
    F = fun() ->
		[case mnesia:read(attention, list_to_atom(Account)) of
		     [] -> mnesia:write(#attention{account=list_to_atom(Account), count=Count});
		     [Record] -> mnesia:write(Record#attention{count=Count})
		 end || {Account, Count} <- Total]
	end,
    db:transaction(F).

-ifdef(TEST).
-include_lib("eunit/include/eunit.hrl").

collect_test() ->
    ?assertEqual([{"c",1}, {"b", 1}], collect(["b", "c"], [])),
    ?assertEqual([{"c",1}, {"b", 2}], collect(["c"], [{"b", 2}])),
    ?assertEqual([{"c",1}, {"b", 3}], collect(["b", "c"], [{"b", 2}])),
    ?assertEqual([{"c",1}, {"b", 3}, {"d",4}], collect(["b", "c", "d"], [{"b", 2}, {"d", 3}])),
    ?assertEqual([{"b", 2}], collect([], [{"b", 2}])),
    ok.

-endif.


