-module(server_app).

-behaviour(application).

%% Internal API
-export([start_client/0]).

%% Application and Supervisor callbacks
-export([start/0, start/2, stop/1, init/1]).

						%最大启动次数
-define(MAX_RESTART,    5).
-define(MAX_TIME,      3).

start_client() ->
    supervisor:start_child(gamesvr_sup, []).

%%----------------------------------------------------------------------
%% Application behaviour callbacks
%%----------------------------------------------------------------------
start() ->
    start([], []).

start(_Type, _Args) ->
    supervisor:start_link({local, ?MODULE}, ?MODULE, []).

stop(_S) ->
    ok.

%%----------------------------------------------------------------------
%% Supervisor behaviour callbacks
%%----------------------------------------------------------------------
init([]) ->    
    {ok,
     {_SupFlags = {one_for_one, ?MAX_RESTART, ?MAX_TIME},
      [{guid,                                    % guid生成器
       	{guid, start_link,[]},                   % StartFun = {M, F, A}
       	permanent,                               % Restart  = permanent | transient | temporary
       	2000,                                    % Shutdown = brutal_kill | int() >= 0 | infinity
       	worker,                                  % Type     = worker | supervisor
       	[guid]                                   % Modules  = [Module] | dynamic
       },
       {tplt,                                    % 模板表进程
	{tplt, start_link,[]},                   % StartFun = {M, F, A}
	permanent,                               % Restart  = permanent | transient | temporary
	2000,                                    % Shutdown = brutal_kill | int() >= 0 | infinity
	worker,                                  % Type     = worker | supervisor
	[tplt]                                   % Modules  = [Module] | dynamic
       },

       {db_connection,                           % 
	{db_connection, start_link,[]},          % StartFun = {M, F, A}
	temporary,                               % Restart  = permanent | transient | temporary
	2000,                                    % Shutdown = brutal_kill | int() >= 0 | infinity
	worker,                                  % Type     = worker | supervisor
	[db_connection]                          % Modules  = [Module] | dynamic
       },
       
       {router,                                  % 消息路由器
	{router, start_link,[]},                 % StartFun = {M, F, A}
	permanent,                               % Restart  = permanent | transient | temporary
	2000,                                    % Shutdown = brutal_kill | int() >= 0 | infinity
	worker,                                  % Type     = worker | supervisor
	[router]                                 % Modules  = [Module] | dynamic
       },
       {common_def,                              % 公用变量进程
	{common_def, start_link,[]},                 % StartFun = {M, F, A}
	permanent,                               % Restart  = permanent | transient | temporary
	2000,                                    % Shutdown = brutal_kill | int() >= 0 | infinity
	worker,                                  % Type     = worker | supervisor
	[common_def]                             % Modules  = [Module] | dynamic
       },
       {scene_sup,	                         % 场景监控进程
	{supervisor,start_link,[{local, scene_sup}, scene_sup, []]},
	permanent,                               % Restart  = permanent | transient | temporary
	infinity,                                % Shutdown = brutal_kill | int() >= 0 | infinity
	supervisor,                              % Type     = worker | supervisor
	[]                                       % Modules  = [Module] | dynamic
       },
       {scene_manager,                           % 场景管理器
	{scene_manager, start_link,[]},          % StartFun = {M, F, A}
	permanent,                               % Restart  = permanent | transient | temporary
	2000,                                    % Shutdown = brutal_kill | int() >= 0 | infinity
	worker,                                  % Type     = worker | supervisor
	[scene_manager]                          % Modules  = [Module] | dynamic
       },
       {sys_time,                                % 系统时间
	{sys_time, start_link, []},
	permanent,
	2000,
	worker,
	[sys_time]
       },
       {sys_broadcast,                                    % 系统广播
	{sys_broadcast, start_link,[]},                   % StartFun = {M, F, A}
	permanent,                               % Restart  = permanent | transient | temporary
	2000,                                    % Shutdown = brutal_kill | int() >= 0 | infinity
	worker,                                  % Type     = worker | supervisor
	[sys_broadcast]                                   % Modules  = [Module] | dynamic
       },
       {party_manager,                                    % 派对管理
	{party_manager, start_link,[]},                   % StartFun = {M, F, A}
	permanent,                               % Restart  = permanent | transient | temporary
	2000,                                    % Shutdown = brutal_kill | int() >= 0 | infinity
	worker,                                  % Type     = worker | supervisor
	[party_manager]                                   % Modules  = [Module] | dynamic
       },
       {mongodb_services,                                 % Mongodb_Services
	{mongodb_services, start, []},                    % {Host, Port, PoolSize}，默认是{"127.0.0.1", 27017, 1}
	permanent,
	2000,
	worker,
	[mongodb_services]
       },
       {player_mateup_context,                            
	{player_mateup_context, start_link, []}, 
	permanent,
	2000,
	worker,
	[player_mateup_context]
       },
       {love_cron,                            
	{love_cron, start_link, []}, 
	permanent,
	2000,
	worker,
	[love_cron]
       },
       {special_house_shop,                      % 特殊产权商店
	{special_house_shop, start_link,[]},     % StartFun = {M, F, A}
	permanent,                               % Restart  = permanent | transient | temporary
	2000,                                    % Shutdown = brutal_kill | int() >= 0 | infinity
	worker,                                  % Type     = worker | supervisor
	[special_house_shop]                     % Modules  = [Module] | dynamic
       },
       {daily_plan,                              % 每日计划
	{daily_plan, start_link,[]},             % StartFun = {M, F, A}
	permanent,                               % Restart  = permanent | transient | temporary
	2000,                                    % Shutdown = brutal_kill | int() >= 0 | infinity
	worker,                                  % Type     = worker | supervisor
	[daily_plan]                             % Modules  = [Module] | dynamic
       },
       {accounting_context,                            
	{accounting_context, start_link, []}, 
	permanent,
	2000,
	worker,
	[accounting_context]
       },
       {produce_context,                            
	{produce_context, start_link, []}, 
	permanent,
	2000,
	worker,
	[produce_context]
       },
       {channel_context,                            
	{channel_context, start_link, []}, 
	permanent,
	2000,
	worker,
	[channel_context]
       },
       {player_breakup_context,                            
	{player_breakup_context, start_link, []}, 
	permanent,
	2000,
	worker,
	[player_breakup_context]
       },
       {payment_return_context,                            
	{payment_return_context, start_link, []}, 
	permanent,
	2000,
	worker,
	[payment_return_context]
       },
       {tcp_server_app,                          % tcp 服务， 让这个服务放在监控树的最后启动
	{tcp_server_app, start,[]},              % StartFun = {M, F, A}
	permanent,                               % Restart  = permanent | transient | temporary
	2000,                                    % Shutdown = brutal_kill | int() >= 0 | infinity
	worker,                                  % Type     = worker | supervisor
	[tcp_server_app]                         % Modules  = [Module] | dynamic
       }
      ]
     }
    }.


    

