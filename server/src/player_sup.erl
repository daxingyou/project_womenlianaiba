%% linyijie
%% 监控玩家,及其相关的进程(比如玩家包裹进程)
%%
-module(player_sup).  

-behaviour(supervisor).  

-export([start/2, get_sup_name/1, start_link/2, stop/1, stop/2]).  
-export([init/1]).  

-define(SERVER, ?MODULE).  

-define(SUP, server_app).

start(Account, Params) ->
    ChildSpec = {
      get_sup_name(Account), {?MODULE, start_link, [Account, Params]},
      temporary, infinity, supervisor, [?MODULE]
     },
    supervisor:start_child(?SUP, ChildSpec).

stop(Node, Account) ->
    rpc:call(Node, ?MODULE, stop, [Account]).

stop(Account) ->
    Name = get_sup_name(Account),
    ok = supervisor:terminate_child(?SUP, Name),
    supervisor:delete_child(?SUP, Name).

start_link(Account, Params) ->
    supervisor:start_link(?MODULE, [Account, Params]).

init([Account, {MMPid, IsFirstTimeLogin, Password, LoginType, ClientIP, PFKey}]) ->  
    process_flag(trap_exit, true),
    % {Mod, [Param]}
    L = [
         {player, [MMPid, Account, IsFirstTimeLogin, Password, LoginType, ClientIP, PFKey]}
	],
    {ok,{{one_for_one,10,1}, [{Mod, 
			      {Mod, start_link, Params},  
			      transient, 2000, worker, [Mod]}
			     || {Mod, Params} <- L]}}. 

get_sup_name(Account) ->
     list_to_atom(atom_to_list(Account) ++ "_sup").
    
