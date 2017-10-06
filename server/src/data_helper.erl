%%%-------------------------------------------------------------------
%%% @author  linyibin
%%% @copyright (C) 2010, 
%%% @doc
%%%  ���˴�ӡ��Ϣ
%%% @end
%%% Created : 26 Apr 2010 by  <>
%%%-------------------------------------------------------------------
-module(data_helper).

-export([start/0, format/1, format/2]).

-include("packet_def.hrl"). 

start() ->
    filter().

%% ���ӹ�������
-ifndef(release).
filter() ->
    %%put(��Ϣ���ͣ� ��Ϣ���ƣ�
    [put(Type, ok) || Type <- [?msg_req_start_walk,
			       ?msg_req_stop_walk,
			       ?msg_req_sync_position
			      ]].
-else.
filter() ->
    [].
-endif.


%% ��ʽ�����ݲ���ӡ����
-ifndef(release).
-spec format(list(), any()) -> atom().
format(Format, {Type, _Data} = Args) ->
    case get(Type) of
	undefined -> %%���û�й������������ӡ������Ϣ
	    io:format(Format, [Args]);
	_ ->
	    ok
    end;
format(Format, {Type} = Args) ->
    case get(Type) of
	undefined -> %%���û�й������������ӡ������Ϣ
	    io:format(Format, [Args]);
	_ ->
	    ok
    end;
format(Format, Args) when is_list(Args) ->
    io:format(Format, Args);
format(Format, Args) ->
    io:format(Format, [Args]).
-else.
format(_Format, _Args) ->
    ok.
-endif.

-ifndef(release).
format(Format) ->
    io:format(Format).
-else.
format(_Format) ->
    ok.
-endif.

%% %% ��ʽ�����ݲ���ӡ����
%% -spec format(list(), any()) -> atom().
%% format(Format, {Type, _Data} = Args) ->
%%     case get(Type) of
%% 	undefined -> %%���û�й������������ӡ������Ϣ
%% 	    ok;
%% 	_ ->
%% 	    ok
%%     end;
%% format(Format, {Type} = Args) ->
%%     case get(Type) of
%% 	undefined -> %%���û�й������������ӡ������Ϣ
%% 	    ok;
%% 	_ ->
%% 	    ok
%%     end;
%% format(Format, Args) when is_list(Args) ->
%%     ok;
%% format(Format, Args) ->
%%     ok.

%% format(Format) ->
%%     ok.

%%%===================================================================
%%% Test case
%%%===================================================================
-include_lib("eunit/include/eunit.hrl").
-ifdef(TEST).

start_test() ->
    put(?msg_req_sync_position, req_sync_position).

format_test() ->
    ok == format("Data:~p~n", {30, {req_start_walk, {point, 0, 0, 0}, {point, 10, 10, 10}}}).

-endif.
