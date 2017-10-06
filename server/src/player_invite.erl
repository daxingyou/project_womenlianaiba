%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%% ÑûÇë¼ÇÂ¼
%%% @end
%%% Created :  3 May 2012 by LinZhengJian <linzhj@35info.cn>

-module(player_invite).
-include("records.hrl").

-define(TABLENAME, player_invite).

-compile(export_all).

-spec add(atom(), string())->ok.
add(Account, OpenId)->
    NewPlayerInvite = 
	case db:dirty_read(?TABLENAME, Account) of
	    []->
		#player_invite{account=Account, active_openids=[OpenId], actived_openids=[]};
	    [#player_invite{active_openids=Actives}=PlayerInvite] ->
		PlayerInvite#player_invite{active_openids=Actives ++ [OpenId]}
	end,
    db:dirty_write(NewPlayerInvite),
    ok.

-spec make_actived(atom(), string())->ok.
make_actived(Account, OpenId)->
    NewPlayerInvite = 
	case db:dirty_read(?TABLENAME, Account) of
	    []->
		#player_invite{account=Account, active_openids=[], actived_openids=[]};
	    [#player_invite{active_openids=Actives, actived_openids=Activeds}=PlayerInvite] ->
		PlayerInvite#player_invite{active_openids=lists:delete(OpenId, Actives)
					   , actived_openids=Activeds ++ [OpenId]}
	end,
    db:dirty_write(NewPlayerInvite),
    ok.

-spec get_active(atom())->list().
get_active(Account)->
    get_active(Account, 0).    

-spec get_active(atom(), integer())->list().
get_active(Account, Count) when Count >=0 ->
    case db:dirty_read(?TABLENAME, Account) of
	[]->
	    [];
	[#player_invite{active_openids=Actives}] ->
	    case Count of 
		0->
		    Actives;
		_->
		    lists:sublist(Actives, Count)
	    end
    end.
