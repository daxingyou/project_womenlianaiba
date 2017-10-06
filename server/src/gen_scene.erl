%%%-------------------------------------------------------------------
%%% @author  <hjx>
%%% @copyright (C) 2010, 
%%% @doc
%%%
%%% @end
%%% Created :  5 May 2010 by  <hjx>
%%%-------------------------------------------------------------------
-module(gen_scene).

-behaviour(gen_msgproc).

-include("gen_scene.hrl").
-include("sys_msg.hrl").
-include("router.hrl").
-include("tplt_def.hrl").
-include("common_def.hrl").

-export([start/3]).  
-export([broadcast_all_players/2, broadcast_all_players/3, broadcast_other_players/2, 
	 get_players/1, get_player_count/2, get_player_count/1]).

%% API

%% gen_server callbacks
-export([init/1, handle_call/3, handle_cast/2, handle_info/2,
	 terminate/2, code_change/3, register/1]).
-export([behaviour_info/1]).

-export([get_temp_furnitures/1,
	 set_temp_furnitures/2]).


-record(temp_furni, {
	  account='',
	  instance_id=0,   
	  template_id=0,    
	  function_id=0,    % 功能
	  position_index=0, % 使用位置
	  leave_pos         % 离开家具时的站立点   
	 }).

-spec behaviour_info(atom()) -> 'undefined' | [{atom(), arity()}].


behaviour_info(callbacks) ->
    [{init,1},{register, 1},{handle_call,3},{handle_cast,2},
     {try_enter_scene,2}, 
     {on_leave_scene, 2}];
behaviour_info(_Other) ->
    undefined.


register([SceneName, Mod, Args]) ->
    Mod:register(Args) ++
    [router:make_event_target(try_enter_scene, SceneName, {SceneName, ?MODULE}),
     router:make_event_target(leave_scene, SceneName, {SceneName, ?MODULE}),
     router:make_event_target(get_players, SceneName, {SceneName, ?MODULE}),
     router:make_event_target(start_use_furniture, SceneName, {SceneName, ?MODULE}),
     router:make_event_target(stop_use_furniture, SceneName, {SceneName, ?MODULE}),
     router:make_event_target(stop_use_all_furniture, SceneName, {SceneName, ?MODULE}),
     router:make_event_target(broadcast_other_players, SceneName, {SceneName, ?MODULE}),
     router:make_event_target(broadcast_all_players, SceneName, {SceneName, ?MODULE})
    ].

%%%===================================================================
%%% API
%%%===================================================================

%% 向该场景的所有玩家广播消息
broadcast_all_players(SceneName, Accounts, Packet) when is_list(Accounts) -> 
    [router:cast(A, scene_msg, {SceneName, [Packet]}) || A <- Accounts].
broadcast_all_players(State, Packet) ->
    Accounts = get_players(State),
    SceneName = get_scene_name(State),
    broadcast_all_players(SceneName, Accounts, Packet).

%%
%% 向该场景的玩家广播消息,但不包括Account玩家
%%
broadcast_other_players(SceneName, Accounts, {RequestAccount, Packet}) when is_list(Accounts) ->
    [router:cast(A, scene_msg, {SceneName, [Packet]}) || A <- Accounts, RequestAccount =/= A].
broadcast_other_players(State, {RequestAccount, Data}) ->
    Accounts = get_players(State),
    SceneName = get_scene_name(State),
    broadcast_other_players(SceneName, Accounts, {RequestAccount, Data}).

get_players(#scene_data{players=Players}) ->
    dict:fetch_keys(Players);
get_players(SceneName) ->
    case router:send(SceneName, get_players) of
	undefined -> [];
	Players -> Players
    end.

get_scene_name(#scene_data{scene_name=SceneName}) ->
    SceneName.

get_player_count(#scene_data{players=Players}) ->
    dict:size(Players).

get_player_count(SceneName, SceneData) when SceneData == [] ->
    case router:send(SceneName, get_players) of
	undefined ->
	    0;
	Players ->
	    length(Players)
    end;
get_player_count(_SceneName, SceneData) ->
    get_player_count(SceneData).

remove_player(Account, #scene_data{players=PlayerDict}=State) when is_atom(Account) ->
    NPlayerDict = dict:erase(Account, PlayerDict),
    State#scene_data{players=NPlayerDict}.

%% 启动场景
%% SceneName:场景名
-spec start(atom(), atom(), list()) -> any().
start(SceneName, Mod, Args) when is_atom(SceneName), 
				 is_atom(Mod), is_list(Args) ->
    gen_msgproc:start_link({global, SceneName}, ?MODULE, 
			   [SceneName, Mod, Args], []),
    data_helper:format("start scene: ~w~n", [SceneName]). 


get_temp_furnitures(#scene_data{temp_furnitures=List}) ->
    List.

set_temp_furnitures(NewList, SceneData) ->
    SceneData#scene_data{temp_furnitures=NewList}.

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


init([SceneName, Mod, Args]) when is_atom(SceneName), is_atom(Mod), is_list(Args) ->
    process_flag(trap_exit, true),
    {ok, CustomData} = Mod:init(Args),
    {ok, #scene_data{scene_name=SceneName, module=Mod, custom_data=CustomData}}.

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
handle_call({#msg{event=try_enter_scene}, {Account, EnterPos, _ForceEnter}}, 
	    _From, 
	    #scene_data{module=Mod} = State) ->
    PlayerList = get_players(State),

    case Mod:try_enter_scene({Account, EnterPos}, State) of
	{false, Err} ->
	    {reply, {false, Err}, State};
	{ok, State0, NPos} ->
	    State1 = do_add_player(Account, State0),

	    %% 互相通知人物状态
	    %% 用cast调用，如果改用call, 可能会导致 死锁timeout
	    [begin 
		 %% 看到其它玩家，把自已信息告知对方
		 router:cast(Account, on_see_other_player, {A, []}),
		 %% 其它玩家看到自已 
		 router:cast(A, on_see_other_player, 
			     {Account, get_furniture_packets(A, State1)})
	     end || A <- PlayerList, A =/= Account],

	    {reply, {ok, NPos, get_player_count(State1)}, State1}   
    end;
    

%% 取场景中的所有玩家
handle_call(#msg{event=get_players}, _From, 
	    State)->
    Players = get_players(State),
    {reply, Players, State};

%% 删除场景中的玩家
handle_call({#msg{event=leave_scene}, Account}, _From, State) ->
    Players = get_players(State),

    case lists:member(Account, Players) of
	false ->
	    {reply, ok, State};
	_ ->
	    Mod = State#scene_data.module,
	    
	    NState = remove_player(Account, State),
    
	    {NState1, Flag} = Mod:on_leave_scene(Account, NState),
	    broadcast_all_players(NState,
				  #notify_player_leave_scene{account=atom_to_list(Account)}),
	    
	    CanStop = (Flag =:= auto_stop) and (get_player_count(NState) =:= 0),
	    case CanStop of
		true ->
		    data_helper:format("stop scene~n"),
%%		    {stop, {shutdown, stop_scene_because_no_player}, stopped, NState1};
		    {stop, normal, stopped, NState1};
		_ ->
		    {reply, ok, NState1}
	    end
    end;

handle_call({#msg{event=start_use_furniture}, {Account, InstID, FurTempID, FunID, LeavePos, _Status}}, _From, 
	    State) ->
    Mod = State#scene_data.module,
    case Mod:is_editing(State) of 
	true ->
	    sys_msg:send(Account, ?err_can_not_use_furniture_when_edit_house),
	    {reply, ok, State};
	_ ->
	    %% 改变家具使用状态
	    FurList = get_temp_furnitures(State),
	    
	    #furni_tplt{max_use_player=MaxPlayers, use_type=UseType} = 
		tplt:get_data(furni_tplt, FurTempID),
	    case UseType of
		?FurnitureNormalStatus ->
		    {A, B} = partition_furnitures(InstID, FurList),
		    LenA = length(A),
		    NState = 
			case LenA < MaxPlayers of
			    true ->
				Pos = find_empty_pos(A, MaxPlayers),
				R = #temp_furni{account=Account,
						instance_id=InstID,
						template_id=FurTempID,
						position_index=Pos,
						function_id=FunID,
						leave_pos=LeavePos
					       },

				NewFurList = A ++ [R | B],

				NewState = set_temp_furnitures(NewFurList, State),
				%% 通知
				gen_scene:broadcast_all_players(State, get_use_fur_packet(R)),
				NewState;
			    _ ->
				sys_msg:send(Account, ?err_furniture_not_position),
				State
			end,	
		    {reply, ok, NState};
		_ ->
		    {reply, ok, State}
	    end
    end;

handle_call({#msg{event=stop_use_furniture}, {Account, FurInstID}}, _From, 
	    State) ->
    %% 改变家具使用状态
    FurList = get_temp_furnitures(State),

    {A, NewFurList} = partition_furnitures(Account, FurInstID, FurList),
    NewState = set_temp_furnitures(NewFurList, State),

    case length(A) > 0 of
	true -> %% 有改变才通知
	    #temp_furni{position_index=PosIndex} = hd(A),

	    Packet = #notify_stop_use_furniture{account=atom_to_list(Account),
						position_index=PosIndex,
						instance_id=FurInstID},
	    net_helper:send2client(Account, Packet),
	    broadcast_other_players(State, {Account, Packet});
	_ ->
	    ok
    end,
    {reply, ok, NewState};

handle_call(#msg{event=stop_use_all_furniture}, _From, 
	    State) ->
    FurList = get_temp_furnitures(State),

    [begin
	    Packet = #notify_stop_use_furniture{account=atom_to_list(Account),
						position_index=PosIndex,
						instance_id=FurInstID},
	    
	    gen_scene:broadcast_all_players(State, Packet)
     end || #temp_furni{account=Account, 
			instance_id=FurInstID, 
			position_index=PosIndex} <- FurList],
    %% 改变家具使用状态
    NewState = set_temp_furnitures([], State),
    {reply, ok, NewState};


handle_call(Request, From, State) ->
    %% 没处理的消息，传到对应模块
    Mod = State#scene_data.module,
    Mod:handle_call(Request, From, State).

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
%% 广播所有玩家(包括自己)
handle_cast({#msg{event=broadcast_all_players}, Data},
	    State) ->
    broadcast_all_players(State, Data),
    {noreply, State};

%% 广播部分玩家(不包括自己)
handle_cast({#msg{event=broadcast_other_players}, {RequestAccount, Packet}},
	    State) ->
    broadcast_other_players(State, {RequestAccount, Packet}),
    {noreply, State};

handle_cast(Msg, State) ->
    %% 没处理的消息，传到对应模块
    Mod = State#scene_data.module,
    Mod:handle_cast(Msg, State).

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
handle_info({timer, Mod, Fun, Arg}, State) ->
    NewState = Mod:Fun(Arg, State),
    {noreply, NewState};
handle_info({timer, F}, State) ->
    NewState = F(State),
    {noreply, NewState};
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
terminate(Reason, State) ->
    Mod = State#scene_data.module,
    Mod:terminate(Reason, State),
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


%% 增加玩家到场景    
do_add_player(Account, #scene_data{players=PlayerDict}=State)->
    NPlayerDict = dict:store(Account, 
		undefined, %% 以后有需要，在这里保存数据
		PlayerDict),
    State#scene_data{players=NPlayerDict}.


%% 取得某个人使用家具的数据包 
get_furniture_packets(Account, State) ->
    FurList = get_temp_furnitures(State),
    [get_use_fur_packet(X) || #temp_furni{account=A}=X <- FurList, A =:= Account].


%% 返回{AList, BList}  AList 为符合条件的列表
partition_furnitures(Account, FurInstID, FurList) 
  when is_atom(Account),
       is_integer(FurInstID),
       is_list(FurList) ->
    F = fun(#temp_furni{instance_id=InstID, account=Player}) ->
		(InstID =:= FurInstID) and (Account =:= Player)		
	end,
    lists:partition(F, FurList).
    
partition_furnitures(FurInstID, FurList) 
  when is_integer(FurInstID),
       is_list(FurList) ->
    F = fun(#temp_furni{instance_id=InstID}) ->
		(InstID =:= FurInstID)		
	end,
    lists:partition(F, FurList).


find_empty_pos(FurList, MaxPlayers) ->
    UsePosList = [PosIndex || #temp_furni{position_index=PosIndex} <- FurList],
    EmptyList = lists:seq(0, MaxPlayers - 1) -- UsePosList,
    hd(EmptyList).

%% 取得使用家具的数据包 
get_use_fur_packet(#temp_furni{account=Player,
		       instance_id=InstID,
		       position_index=PosIndex,
		       function_id=FunID,
		       leave_pos=LeavePos
		      }) ->
    #notify_start_use_furniture{account=atom_to_list(Player),
				position_index=PosIndex,
				instance_id=InstID,
				function_id=FunID,
				walk_pos=LeavePos
			       }.




%%----------------------------------测试函数-------------------------------
-include_lib("eunit/include/eunit.hrl").
-ifdef(TEST).

dict_test() ->
    A = dict:new(),
    B = dict:store(a, undefined, A),
    C = dict:store(b, undefined, B),

    ?assertEqual(B, dict:erase(b, C)),

    ?assertEqual([a], dict:fetch_keys(B)),
    ?assertEqual([a, b], dict:fetch_keys(C)),
    
    ok.


-endif.	

