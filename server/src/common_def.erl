%%%-------------------------------------------------------------------
%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2011, hongjx
%%% @doc
%%%   ���ñ�������
%%% @end
%%% Created : 27 Jan 2011 by hongjx <hongjx@35info.cn>
%%%-------------------------------------------------------------------
-module(common_def).

-behaviour(gen_server).

%% API
-export([start_link/0]).

%% gen_server callbacks
-export([init/1, handle_call/3, handle_cast/2, handle_info/2,
	 terminate/2, code_change/3]).
-export([get_val/1, reload/0, set/2, show_all/0]).

-define(SERVER, ?MODULE). 

-record(state, {dict}).

%%%===================================================================
%%% API
%%%===================================================================
%% ȡ�����ĳ��ֵ
get_val(Key) when is_atom(Key) -> 
     gen_server:call(?SERVER, Key).

reload() ->
    gen_server:cast(?SERVER, reload).

show_all() ->
    gen_server:cast(?SERVER, show_all).


set(Key, Val) ->
    gen_server:cast(?SERVER, {set, Key, Val}).

%%--------------------------------------------------------------------
%% @doc
%% Starts the server
%%
%% @spec start_link() -> {ok, Pid} | ignore | {error, Error}
%% @end
%%--------------------------------------------------------------------
start_link() ->
    gen_server:start_link({local, ?SERVER}, ?MODULE, [], []).

%%%===================================================================
%%% gen_server callbacks
%%%===================================================================

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Initializes the server
%%
%% @spec init(Args) -> {ok, State} |
%%                     {ok, State, Timeout} |
%%                     ignore |
%%                     {stop, Reason}
%% @end
%%--------------------------------------------------------------------
init([]) ->
    %%data_helper:format("Dict: ~p~n~n~n", [Dict]),
    Dict = load(),
    {ok, #state{dict=Dict}}.


load() ->
    FilePath1 = case os:getenv("template") of
		    false -> "./template/";
		    "tx" -> "./template/";
		    "yy" -> "./yy_template/"
		end,
    File = FilePath1 ++ "common_define.cfg",
    KeyValList = 
	try
	    {ok, [List]} = file:consult(File),
	    List
	catch 
	    error: Msg ->
		%% ���������ѶϢ����ȷ
		logger:delay_log(error, "file: ~p~n ~p~n stack:~p~n", 
				 [File, Msg, erlang:get_stacktrace()]),
		erlang:error(Msg)		    
	end,

    Dict = dict:from_list(KeyValList),
    Dict.
%%--------------------------------------------------------------------
%% @private
%% @doc
%% Handling call messages
%%
%% @spec handle_call(Request, From, State) ->
%%                                   {reply, Reply, State} |
%%                                   {reply, Reply, State, Timeout} |
%%                                   {noreply, State} |
%%                                   {noreply, State, Timeout} |
%%                                   {stop, Reason, Reply, State} |
%%                                   {stop, Reason, State}
%% @end
%%--------------------------------------------------------------------
handle_call(Key, _From, #state{dict=Dict}=State) ->
    Val = do_get_val(Key, Dict),
    {reply, Val, State}.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Handling cast messages
%%
%% @spec handle_cast(Msg, State) -> {noreply, State} |
%%                                  {noreply, State, Timeout} |
%%                                  {stop, Reason, State}
%% @end
%%--------------------------------------------------------------------
handle_cast(reload, State) ->    
    {noreply, State#state{dict=load()}};
handle_cast(show_all, State) ->    
    {noreply, State};
handle_cast({set, Key, Val}, #state{dict=Dict}=State) ->    
    NDict = dict:store(Key, Val, Dict),
    {noreply, State#state{dict=NDict}};
handle_cast(_Msg, State) ->
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

do_get_val(Key, Dict) when is_atom(Key) ->
    %% ���̹ҵ���Ӱ��󲿷ֽ��̣����Դ˴���ʹ��dict:fetch
    case dict:find(Key, Dict) of
	{ok, Val} -> Val;
	Error -> Error
    end.
