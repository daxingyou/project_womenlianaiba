%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2011, LinZhengJian
%%% @doc
%%% 新手引导模块
%%% @end
%%% Created : 19 Dec 2011 by LinZhengJian <linzhj@35info.cn>

-module(player_guide).

-include("router.hrl").
-include("packet_def.hrl").
-include("player_data.hrl").

-export([start/1, handle_cast/2]).

-define(FLAGCOUNT, 20).

-record(player_guide,{account, flags}).

start(Account)->
    [router:make_event_source(?msg_req_player_guide, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_update_player_guide, Account, {Account, ?MODULE})
    ].

handle_cast({#msg{event=?msg_req_player_guide}, #req_player_guide{}}, #player_data{account=Account}=State) ->
    PlayerGuideFlags = find(Account),
    Length = length(PlayerGuideFlags),
    if
	(Length >= ?FLAGCOUNT) ->
	    net_helper:send2client(Account, #notify_player_guide{flags=PlayerGuideFlags});
	true->
	    net_helper:send2client(Account, #notify_player_guide{flags=
			  lists:append(PlayerGuideFlags, lists:duplicate((?FLAGCOUNT-Length), 0))})
    end,
    {noreply, State};

handle_cast({#msg{event=?msg_req_update_player_guide}, #req_update_player_guide{flags=Flags}}, #player_data{account=Account}=State) ->
    Return = update(Account, Flags),
    case Return of
	ok->
	    net_helper:send2client(Account, #notify_update_player_guide{result=1});
	_->
	    net_helper:send2client(Account, #notify_update_player_guide{result=0})
    end,
    {noreply,State}.

find(Account)->
    PlayerGuide = db:dirty_read(player_guide, Account),
    case PlayerGuide of
	[#player_guide{flags=GuideList}]->
	    GuideList;
	_ ->[]
    end.

update(Account, GuideList)->
    db:dirty_write(#player_guide{account=Account, flags=GuideList}).
