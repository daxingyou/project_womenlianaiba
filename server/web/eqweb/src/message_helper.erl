%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2011, LinZhengJian
%%% @doc
%%% 提示消息帮助类，负责拼接提示
%%% @end
%%% Created : 23 Dec 2011 by LinZhengJian <linzhj@35info.cn>

-module(message_helper).

-export([get_failure_invitation_message/1]).

get_failure_invitation_message({_Inviting, Invited, FailureType})->
    case FailureType of 
	1->
	    io:format("1~n"),
	    "邀请失败，" ++ Invited ++ "拒绝了你的邀请";
	2->
	    io:format("2~n"),
	    "邀请失败，" ++ Invited ++ "已经接受了别人的邀请";
	3->
	    io:format("3~n"),
	    "邀请失败，" ++ Invited ++ "拒绝了你的邀请";
	_ ->""
    end.
