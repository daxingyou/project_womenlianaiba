%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% 玩家设置
%%% @end
%%% Created :  1 Feb 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(player_setting).

%% API
-export([init/1, start/1, notify/1, handle_cast/2]).

-include("packet_def.hrl").
-include("router.hrl").
-include("common_def.hrl").
-include("enum_def.hrl").


%%%===================================================================
%%% API
%%%===================================================================
start(Account) ->
    [router:make_event_source(?msg_req_player_setting, Account, {self(), ?MODULE})
     ].

init(Account) ->
    SettingInfo = [#setting_info{name="music", value=?ast_open} 
		   #setting_info{name="cull", value=?ast_open}
		  ],
    #player_setting{account=Account, info=SettingInfo}.

notify(Account) ->
    NPlayerSetting = 
	case db:dirty_read(player_setting, Account) of
	    [] ->
		PlayerSetting1 = init(Account),
		db:dirty_write(PlayerSetting1),
		PlayerSetting1;
	    [PlayerSetting] ->
		PlayerSetting
	end,
    net_helper:send2client(Account, #notify_player_setting{setting=NPlayerSetting}).

%%%===================================================================
%%% Internal functions
%%%===================================================================
%% 请求修改设置
handle_cast({#msg{src=Account}, #req_player_setting{setting=Setting}}, State) ->
    [PlayerSetting] = db:dirty_read(player_setting, Account),
    NInfo = edit(PlayerSetting#player_setting.info, Setting),
    NPlayerSetting = PlayerSetting#player_setting{info=NInfo},
    db:dirty_write(NPlayerSetting),
    net_helper:send2client(Account, #notify_player_setting{setting=NPlayerSetting}),
    {noreply, State}.

edit(InfoList, #setting_info{name=Name}=Setting) ->
    case lists:keysearch(Name, 2, InfoList) of
	false ->
	    [Setting | InfoList];
	_ ->
	    lists:keyreplace(Name, 2, InfoList, Setting)
    end.
