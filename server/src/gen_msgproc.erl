%%%-------------------------------------------------------------------
%%% @author  linyijie
%%% @copyright (C) 2010, 
%%% @doc
%%%  ͨ�õ�������Ϣ������, ֻҪ���봦��������Ϣ�Ľ���, ��������Ϊ��Ϣ�ļ�����,
%%%  �ü������ǻ���gen_server, ��gen_server��һ���򵥵���չ, ���󲿷ֵ�ʹ��
%%%  ��gen_server��ʹ����һ�µ�, Ψһ�Ĳ�ͬ����Ҫ��һ��ע����Ϣ�ĺ���register()
%%%  �ú�������һ��ע�����Ϣ�б�, ����:register() -> [?msg_req_create].
%%% @end
%%% Created :  7 Apr 2010 by  <>
%%%-------------------------------------------------------------------
-module(gen_msgproc).
 
%% API
-export([start_link/3,start_link/4]).

-export([behaviour_info/1]).

%% gen_server callbacks
-export([init/1, handle_call/3, handle_cast/2, handle_info/2,
	 terminate/2, code_change/3]).

-export([call_to_mod/3, cast_to_mod/3]).

%%%===================================================================
%%% API
%%%===================================================================
-spec behaviour_info(atom()) -> 'undefined' | [{atom(), arity()}].

behaviour_info(callbacks) ->
    [{init,1},{register,1},{handle_call,3},{handle_cast,2},{handle_info,2},
     {terminate,2},{code_change,3}];
behaviour_info(_Other) ->
    undefined. 
%%--------------------------------------------------------------------
%% @doc
%% Starts the server
%%
%% @spec start_link() -> {ok, Pid} | ignore | {error, Error}
%% @end
%%--------------------------------------------------------------------
%% Target: �������� | ����Pid
start_link(Mod, Args, Options) ->
    gen_server:start_link(?MODULE, {local, Mod, Args}, Options).

start_link({global, Name}, Mod, Args, Options) ->
    gen_server:start_link({global, Name}, ?MODULE, {global, Mod, Args}, Options);

start_link(Name, Mod, Args, Options) ->
    gen_server:start_link(Name, ?MODULE, {local, Mod, Args}, Options).

%% ͬ�����͸��ص�ģ�鴦��
call_to_mod(Pid, Mod, Msg) when is_pid(Pid) ->
    gen_server:call(Pid, {cb, Mod, Msg}).

%% �첽���͸��ص�ģ�鴦��
cast_to_mod(Pid, Mod, Msg) ->
    gen_server:cast(Pid, {cb, Mod, Msg}).

%%%===================================================================
%%% gen_server callbacks
%%%===================================================================
init({ServerFlag, Mod, Args}) ->
    process_flag(trap_exit, true),

    {A1, A2, A3} = now(),
    random:seed(A1, A2, A3),

    undefined = put(mod, Mod),
    L = Mod:register(Args),
    router:register_handler({ServerFlag, L}),
    undefined = put('$msgs', L),
    undefined = put('$server_flag', ServerFlag),
    try 
     	Mod:init(Args)
    catch
    	A: B ->
    	    router:unregister_handler({ServerFlag, L}),
	    %% ���������ѶϢ����ȷ
	    logger:log(error, "~p~n ~p~n stack:~p~n", 
			     [A, B, erlang:get_stacktrace()]),

    	    throw({A, B})
    end.

handle_call({cb, Mod, Data}, From, State) ->
    Mod:handle_call(Data, From, State);
handle_call(Request, From, State) ->
    Mod = get(mod),
    Mod:handle_call(Request, From, State).

handle_cast({cb, Mod, Msg}, State) ->
    Mod:handle_cast(Msg, State);
handle_cast(Msg, State) ->
    Mod = get(mod),
    Mod:handle_cast(Msg, State).

handle_info(Info, State) ->
    Mod = get(mod),
    Mod:handle_info(Info, State).

terminate(Reason, State) ->
    Mod = get(mod),
    ServerFlag = get('$server_flag'),
    L = get('$msgs'),
    try
	Mod:terminate(Reason, State)
    catch ErrType: ErrMsg ->
        error_logger:error_msg("Error in ~p:terminate: ~p ~nstack:~p.\n", 
			       [Mod, {ErrType, ErrMsg}, erlang:get_stacktrace()])    	
    end,
    router:unregister_handler({ServerFlag, L}).

code_change(OldVsn, State, Extra) ->
    Mod = get(mod),
    Mod:code_change(OldVsn, State, Extra).
