%%%-------------------------------------------------------------------
%%% @author  linyijie
%%% @copyright (C) 2010, 
%%% @doc
%%%  ��Ϣ·����, ����һ������ڲ�����ϵͳ֮���ͨѶ
%%%  �����������ҵ�ͨѶ
%%% @end
%%% Created : 30 Mar 2010 by  <>
%%%-------------------------------------------------------------------
-module(router).

-behaviour(gen_server).

-include("router.hrl").

%% API
-export([start_link/0, stop/0]).
-export([send/2, send/3, cast/3, cast/4, broadcast/3]).
-export([send2/2, send2/3]).
-export([register_handler/1, unregister_handler/1]).
-export([make_event/2, make_event_source/3, make_event_target/3, make_event_source_target/4]).

%% gen_server callbacks
-export([init/1, handle_call/3, handle_cast/2, handle_info/2,
	 terminate/2, code_change/3]).

-define(SERVER, ?MODULE). 

-type event() :: pos_integer() | atom().
-type object() :: pid() | atom().

%%%===================================================================
%%% API
%%%===================================================================

%%--------------------------------------------------------------------
%% @doc
%% Starts the server
%%
%% @spec start_link() -> {ok, Pid} | ignore | {error, Error}
%% @end
%%--------------------------------------------------------------------
start_link() ->
    gen_server:start_link({local, router}, ?MODULE, [], []).

stop()->
    gen_server:call(router, stop).

%% %% EventList��һ����Ϣ�������б�
%% -spec register_handler(list()) -> ok.
%% register_handler(MsgList) ->
%%     gen_server:call(router, {register_handler, MsgList}).

%% %% ��������������¼�
%% -spec unregister_handler(list()) -> ok.
%% unregister_handler(MsgList)->
%%     gen_server:call(router, {unregister_handler, MsgList}).

%% EventList��һ����Ϣ�������б�
-spec register_handler(tuple()) -> ok.
register_handler(MsgHandler) ->
    gen_server:call(router, {register_handler, MsgHandler}).

%% ��������������¼�
-spec unregister_handler(tuple()) -> ok.
unregister_handler({ServerFlag, List})->
    %% ȫ����Ϣ
    case ServerFlag of
	global ->
	    F = fun() ->  
			[db:delete({global_router, Msg}) || {Msg, _Handler} <- List] 
		end,
	    db:transaction(F);
	_ -> ok
    end,
    case ets:info(router) of
	undefined -> ok; %% ���router���ȱ�ɾ����, ���������ж�, �������router������, �쳣�����
	L when is_list(L) ->
	    %% ������Ϣ
	    [ets:delete_object(router, Obj) || Obj <- List]
    end,
    ok.

%% ��ͬ���ķ�ʽ������Ϣ, �м�������Ϣ��ϵͳ�����յ�������Ϣ
-spec send(object(), event(), any()) -> any().
send(Target, Event, MsgData)->
    CanLogError = true,
    do_send(Event, undefined, Target, MsgData, CanLogError).

-spec send(object(), event()) -> any().
send(Target, Event) ->
    CanLogError = true,
    do_send(Event, undefined, Target, null, CanLogError).

%% ����ͬsend��ֻ�ǲ���¼log 
-spec send2(object(), event(), any()) -> any().
send2(Target, Event, MsgData)->
    CanLogError = false,
    do_send(Event, undefined, Target, MsgData, CanLogError).


-spec send2(object(), event()) -> any().
send2(Target, Event) ->
    CanLogError = false,
    do_send(Event, undefined, Target, null, CanLogError).


%% ���첽�ķ�ʽ������Ϣ��Target
-spec cast(object(), object(), event(), any()) -> any().
cast(Src, Target, Event, MsgData)->
    CanLogError = true,
    do_cast(Event, Src, Target, MsgData, CanLogError).

-spec cast(object(), event(), any()) -> any().
cast(Src, Event, MsgData)->
    CanLogError = true,
    do_cast(Event, Src, undefined, MsgData, CanLogError).

%% ���첽�ķ�ʽ�㲥�¼�
-spec broadcast(event(), object(), any()) -> any().
broadcast(Event, Src, MsgData) ->
    do_broadcast(Event, Src, MsgData).

%% ����ֻ�����¼�����Ϣ
-spec make_event(event(), any()) -> tuple().
make_event(Event, Handler) ->
    {#msg{event=Event}, Handler}.

%% ���ɹ����¼����¼�Դ����Ϣ
-spec make_event_source(event(), object(), any()) -> tuple().
make_event_source(Event, Src, Handler) ->
    {#msg{event=Event, src=Src}, Handler}.

%% ���ɹ����¼���Ŀ�����Ϣ
-spec make_event_target(event(), object(), any()) -> tuple().
make_event_target(Event, Target, Handler) ->
    {#msg{event=Event, target=Target}, Handler}.

%% ���ɹ����¼�, Դ ��Ŀ�����Ϣ
-spec make_event_source_target(event(), object(), object(), any()) -> tuple().
make_event_source_target(Event, Src, Target, Handler) ->
    {#msg{event=Event, src=Src, target=Target}, Handler}.

%%%===================================================================
%%% gen_server callbacks
%%%===================================================================
init([]) ->
    process_flag(trap_exit, true),
    ets:new(router, [set, public, named_table]),
    {ok, []}.

handle_call(stop, _From, State) ->
    {stop, normal, State};
handle_call({register_handler, {ServerFlag, MsgList}}, _From, State) ->
    %% ȫ����Ϣ
    case ServerFlag of
	global ->
	    case length(MsgList) > 0 of
		true ->
		    Records = [{global_router, Msg, Handler} || {Msg, Handler} <- MsgList],
		    db:write(transaction, Records);
		_ -> ok
	    end;
	_ -> ok
    end,

    %% ������Ϣ(����ȫ����Ϣ)
    F = fun(Msg, Handler)->
		case ets:lookup(router, Msg)of
		    [_Old] ->
			ets:delete(router, Msg),
			ets:insert(router, {Msg, Handler});
			%%error_logger:error_msg("exist_handler:~p, msg:~p~n", [Handler, Msg]);
		    [] -> 
			ets:insert(router, {Msg, Handler})
		end
	end,
    [F(Message, Handler) || {Message, Handler} <- MsgList],
    {reply, ok, State};


handle_call(_Request, _From, State) ->
    {reply, ok, State}.

handle_cast(Request, State) ->
    logger:log(error, "router unknown request:~p~n", [Request]),
    {noreply, State}.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Handling all non call/cast messages
%%
%% @spec handle_info(Info, State) -> {noreply, State} |
%%                                   {noreply, State, Timeout} |
%%                                   {stop, Reason, State}
%% @end
%%--------------------------------------------------------------------
handle_info(_Info, State) ->
    {noreply, State}.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% This function is called by a gen_server when it is about to
%% terminate. It should be the opposite of Module:init/1 and do any
%% necessary cleaning up. When it returns, the gen_server terminates
%% with Reason. The return value is ignored.
%%
%% @spec terminate(Reason, State) -> void()
%% @end
%%--------------------------------------------------------------------
terminate(_Reason, _State) ->
    data_helper:format("router terminate~n"),
    ok.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Convert process state when code is changed
%%
%% @spec code_change(OldVsn, State, Extra) -> {ok, NewState}
%% @end
%%--------------------------------------------------------------------
code_change(_OldVsn, State, _Extra) ->
    {ok, State}.

%%%===================================================================
%%% Internal functions
%%%===================================================================
%% �����Ϣ�Ĵ�����
get_handler(Message, CanLogError) ->
    % ��4����Ϣ���͹������ѭ�����Ҵ�����
    L = make_msg_list(Message),
    case find_handlers(L) of
	[] -> 
	    %% case CanLogError of
	    %% 	true -> 
	    %% 	    error_logger:error_msg("not found handler: ~p~n", [Message]);
	    %% 	_ -> ok
	    %% end,

	    undefined;
	Handlers -> Handlers
    end.

make_msg_list(#msg{event=_E, src=undefined, target=undefined}=M) ->
    [M];
make_msg_list(#msg{event=E, src=_S, target=undefined}=M) ->
    [#msg{event=E}, M];
make_msg_list(#msg{event=E, src=undefined, target=_T}=M) ->
    [#msg{event=E}, M];
make_msg_list(#msg{event=E, src=S, target=T} = M) ->
    [#msg{event=E}, #msg{event=E, src=S}, #msg{event=E, target=T}, M].	    

find_local_handlers(L) ->
    Ret = case lists:member(router, ets:all()) of
    	      true ->
    		  F = fun(Msg, AccIn) ->
    			      case ets:lookup(router, Msg) of
    				  []-> AccIn;
    				  [{_M, Handler}] -> [Handler | AccIn]
    			      end
    		      end,
    		  lists:foldl(F, [], L);
    	      false  -> []
    	  end,
    Ret.

find_handlers(L) ->
    LocalHandlers = find_local_handlers(L),
    %% ���������Ϣ�ҵ����Ͳ���ȥ��ȫ����Ϣ
    case length(LocalHandlers) > 0 of
	true -> LocalHandlers;
	_ ->
	    F = fun(Msg, AccIn) ->
			case db:dirty_read(global_router, Msg) of
			    []-> AccIn;
			    [{_Tab, _M, Handler}] -> [Handler | AccIn]
			end
		end,
	    lists:foldl(F, [], L)
    end.

%% ����Pid | undefined | {Pid, Mod}
get_pid_mod(Msg, CanLogError) ->
    case get_handler(Msg, CanLogError) of
	[{Name, Mod}] ->
	    case util:get_pid(Name) of
		undefined -> 
		    undefined;
		_ ->
		    {util:get_pid(Name), Mod}
	    end;
	[Name] ->
	    util:get_pid(Name);
	undefined -> 
	    undefined
    end.

do_send(Event, Src, Target, MsgData, CanLogError)->
    Msg = #msg{event=Event, src=Src, target=Target},
    case get_pid_mod(Msg, CanLogError) of
	{Pid, Mod} ->
	    case MsgData of 
		null -> gen_msgproc:call_to_mod(Pid, Mod, Msg);
		_  -> gen_msgproc:call_to_mod(Pid, Mod, {Msg, MsgData})
	    end;
	Pid when is_pid(Pid) ->
	    case MsgData of 
		null -> gen_server:call(Pid, Msg);
		_  -> gen_server:call(Pid, {Msg, MsgData})
	    end;
	undefined -> 
	    undefined
    end.

do_cast(Event, Src, Target, MsgData, CanLogError) ->
    Msg = #msg{event=Event, src=Src, target=Target},
    case get_pid_mod(Msg, CanLogError) of
	{Pid, Mod} -> 
	    gen_msgproc:cast_to_mod(Pid, Mod, {Msg, MsgData});
	Pid when is_pid(Pid) -> 
	    gen_server:cast(Pid, {Msg, MsgData});
	undefined ->
	    ok	       
    end.

do_broadcast(Event, Src, MsgData)->
    Msg = #msg{event=Event, src=Src},
    CanLogError = true,
    Handlers = get_handler(Msg, CanLogError),
    [gen_server:cast(Handler, {Msg, MsgData}) || Handler <- Handlers].

%% --------------------------���Դ���-----------------------------------
-include_lib("eunit/include/eunit.hrl").

%% test() ->
%%     start_link(),
%%     L = [make_event(req_enter, self()),
%% 	 make_event_source(req_swap, test, self()),
%% 	 make_event_target(req_logout, test, self()),
%% 	 make_event_source_target(req_logout, test, test1, self())
%% 	],
%%     register_handler(L),
%%     ?assertEqual([self()], get_handler(#msg{event=req_enter})),
%%     ?assertEqual([self()], get_handler(#msg{event=req_enter, src=test})),
%%     ?assertEqual([self()], get_handler(#msg{event=req_enter, target=test})),
%%     ?assertEqual([self()], get_handler(#msg{event=req_enter, src=test, target=test1})),

%%     broadcast(req_enter, test, []),
%%     unregister_handler(L).


