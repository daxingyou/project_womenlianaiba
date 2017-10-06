%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%% 好友关系（测试时模拟腾讯好友关系）
%%% @end
%%% Created :  3 Feb 2012 by LinZhengJian <linzhj@35info.cn>

-module(friend).

-compile(export_all).

-record(friend,{account, friend_account}).

add(Account, FriendAccount)->
    Friend=#friend{account=list_to_atom(Account), friend_account=FriendAccount},
    ReverseFriend=#friend{account=list_to_atom(FriendAccount), friend_account=Account},
    db:write(transaction, [Friend, ReverseFriend]).

get(Account)->
    F = fun() ->
                db:read(friend, Account)
        end,
    case db:transaction(F) of
	[] ->
	    [];
	FriendList ->
	    [Friend#friend.friend_account || Friend <- FriendList]
    end.


remove(Account, FriendAccount)->
    F = fun()->
		db:delete({friend, Account}),
		db:delete({friend, FriendAccount})
	end,
    db:transaction(F).
