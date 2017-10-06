%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2013, hongjx
%%% @doc
%%%  酒吧场景
%%% @end
%%% Created : 11 Mar 2013 by hongjx <hongjx@35info.cn>

-module(pub_scene).

-include("gen_scene.hrl").
-include("tplt_def.hrl").

-export([init/1, register/1, handle_call/3, handle_cast/2, 
	 try_enter_scene/2, 
	 is_editing/1,
	 on_leave_scene/2,
	 terminate/2]).


-export([build_name/2,
	 change_pub/2        %% 改变玩家酒吧
	]).


-record(player_pub_scene, {host='',
			   scene_tplt_id=0     % 对应common_scene.xml
			   }).

-record(pub_scene_data, {host='',
			 pub_id=0            % 酒吧id    
			   }).


build_name(Account, TpltID) when is_atom(Account), is_integer(TpltID) ->
    list_to_atom(atom_to_list(Account) ++ "_pub_" ++ integer_to_list(TpltID)).

is_editing(_) ->
    false.

on_leave_scene(Account, #scene_data{custom_data=CustomData}=State) ->
    #pub_scene_data{pub_id=PubID} = CustomData,
    data_helper:format("***********************leave scene, account:~p, ~p************~n", [Account, PubID]),
    pub:notify_sync_player_count(State, PubID),
    {State, no_stop}. %% 场景不自动关

%% 判断可否进入场景
try_enter_scene({Account, EnterPos}, #scene_data{custom_data=CustomData}=State) 
  when is_atom(Account) ->
    #pub_scene_data{host=Host, pub_id=PubID} = CustomData,
    TpltID = 
	case db_read_pub_scene_id(Host) of
	    0 ->
		common_def:get_val(default_pub_scene_id);
	    ID when is_integer(ID) ->
		ID
	end,

    Pos = 
	case EnterPos of
	    born_pos ->
		get_born_pos(TpltID);
	    _ ->
		EnterPos
	end,    

    
    {Info, Accounts, _YYID} = pub:get_pub_info(PubID),

    net_helper:send2client(Account, 
			   #notify_enter_pub_scene{template_id=TpltID, 
						   enter_pos=Pos,
						   info=Info, 
						   accounts=Accounts
						  }),
    %%pub:notify_sync_player_count(State, PubID),
    {ok, State, Pos}.

%% 取出生点
get_born_pos(SceneTpltID) when is_integer(SceneTpltID) ->
    case tplt:get_data(common_scene, SceneTpltID) of
	#common_scene{born_id=BornId} ->
	    BornData = tplt:get_data(born, BornId),
	    [X, Y, Z] = BornData#born.pos,
	    #point{x=X, y=Y, z=Z};
	_ ->
	    #point{}
    end.

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

init([Host, PubID]) ->
    {ok, #pub_scene_data{host=Host, pub_id=PubID}}.


register(_Args) ->
    [].

%%%===================================================================
%%% Handle call
%%%===================================================================
handle_call(_Request, _From, State) ->  
    Reply = ok,  
    {reply, Reply, State}.

%%%===================================================================
%%% Handle cast
%%%===================================================================
handle_cast(stop, State) ->
    {stop, normal, State}.

%%%===================================================================
%%% terminate
%%%===================================================================
terminate(_Reason, _State) ->
    ok.

%%%===================================================================
%%% db
%%%===================================================================
db_read_pub_scene_id(Host) when is_atom(Host) ->
    case db:dirty_read(player_pub_scene, Host) of
	[] ->
	     0;
	[#player_pub_scene{scene_tplt_id=ID}] ->
	    ID
    end.

change_pub(Host, SceneTpltID) when is_atom(Host), is_integer(SceneTpltID) ->
    db:dirty_write(#player_pub_scene{host=Host, scene_tplt_id=SceneTpltID}).
%%%===================================================================
%%% Internal functions
%%%===================================================================



