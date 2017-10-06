%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@china-channel.com>
%%% @copyright (C) 2010, linyibin
%%% @doc
%%% ϵͳ�ַ�������
%%% @end
%%% Created : 14 Jul 2010 by linyibin <linyb@china-channel.com>
%%%-------------------------------------------------------------------
-module(sys_string).

%% API
-export([format/2]).

%%%===================================================================
%%% API
%%%===================================================================
%% ��ʽ���ַ���
-spec format(list(), list()) -> list().
format(Content, ReplaceWords) ->
    format(Content, ReplaceWords, 0).

%%%===================================================================
%%% Internal functions
%%%===================================================================
%% ��ʽ���ַ���
-spec format(list(), list(), integer()) -> list().
format(Content, [], _Index) ->
    Content;
format(Content, [ReplaceWord|ReplaceWords], Index) ->
    Length = length(Content),
    KeyWord = "{" ++ integer_to_list(Index) ++ "}",
    RIndex = string:rstr(Content, KeyWord),
    LString = string:substr(Content, 1, RIndex - 1),
    RString = string:substr(Content, RIndex + length(KeyWord), Length),
    format(LString ++ ReplaceWord ++ RString, ReplaceWords, Index + 1).

%%%===================================================================
%%% Test case
%%%===================================================================
-include_lib("eunit/include/eunit.hrl").
-ifdef(TEST).

format_test() ->
    ?assertEqual("1234567", format("12{0}45{1}7", ["3","6"], 0)),
    ?assertEqual("1234567", format("12{0}4567", ["3"], 0)).

-endif.
