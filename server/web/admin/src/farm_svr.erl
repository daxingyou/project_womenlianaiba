%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@china-channel.com>
%%% @copyright (C) 2010, linyibin
%%% @doc
%%% 游戏服务器
%%% @end
%%% Created : 27 Aug 2010 by linyibin <linyb@china-channel.com>
%%%-------------------------------------------------------------------
-module(farm_svr).

-export([list/1, add/4, delete/2, start/2, close/2, restart/2, status/2, get_time/2]).

-define(filepath, "/root/server/web/eqweb/ebin/farm_srv.txt").

%% API


%%%===================================================================
%%% API
%%%===================================================================
list(Req) ->
    case file:consult(?filepath) of
	{ok, ServerList} ->
	    NList = create(ServerList, [], 1),
	    Req:respond({200, [{"Content-Type", "text/html; charset=gb2312"}], [NList]});
	{error, _Reason} ->
	    Req:respond({200, [], ["fail"]})
    end.


add(Req, IP, HostName, ServerName) ->
    case file:write_file(?filepath, "\r\n{'"++HostName++"', \""++ServerName++"\", '"++IP++"'}.", [append]) of
	ok ->
	    Req:respond({200, [], ["ok"]});
	{error, Reason} ->
	    Req:respond({200, [], [Reason]})
    end.

delete(Req, HostName) ->
    case file:consult(?filepath) of
	{ok, ServerList} ->
	    NList = delete(ServerList, [], HostName),
	    file:write_file(?filepath, NList),
	    Req:respond({200, [], ["ok"]});
	{error, _Reason} ->
	    Req:respond({200, [], ["fail"]})
    end.
    
start(Req, HostName) ->
    StartResult = rpc:call(HostName, farmsvr, start, []),
    io:format("StartResult:~p~n", [StartResult]),
    case StartResult of
	{badrpc, nodedown} ->
	    Req:respond({200, [], ["doesn't exist node!"]});
	{badrpc, Reason} ->
	    Req:respond({200, [], [Reason]});
	{error, _} ->
	    Req:respond({200, [], ["fail"]});
	_ ->
	    Req:respond({200, [], ["ok"]})
    end.

close(Req, HostName) ->
    CloseResult = rpc:call(HostName, farmsvr, stop, []),
    case CloseResult of
	{badrpc, nodedown} ->
	    Req:respond({200, [], ["doesn't exist node!"]});
	{badrpc, Reason} ->
	    Req:respond({200, [], [Reason]});
	_ ->
	    Req:respond({200, [], ["ok"]})
    end.

restart(Req, HostName) ->
    RestartResult = rpc:call(HostName, init, restart, []),
    io:format("RestartResult:~p~n", [RestartResult]),
    case RestartResult of
	{badrpc, Reason2} ->
	    Req:respond({200, [], [Reason2]});
	{error, _} ->
	    Req:respond({200, [], ["fail"]});
	_ ->
	    Req:respond({200, [], ["ok"]})
    end.

status(Req, HostName) ->
      StatusResult = rpc:call(HostName, application, which_applications, []),
      case StatusResult of
	  {badrpc, nodedown} ->
	      Req:respond({200, [], ["Error"]});
	  {badrpc, Reason} ->
	      Req:respond({200, [], [Reason]});
	  Lists ->
	      case is_exist(Lists, farmsvr) of
		  true ->
		      Req:respond({200, [], ["Started"]});
		  _ ->
		      Req:respond({200, [], ["Closed"]})
	      end
      end.

get_time(Req, HostName) ->
    StatusResult = rpc:call(HostName, datetime, local_time, []),
    case StatusResult of
	{badrpc, nodedown} ->
	    Req:respond({200, [], ["Error"]});
	{badrpc, Reason} ->
	    Req:respond({200, [], [Reason]});
	{{Y, M, D}, {H, Mi, S}} ->
	    Date = integer_to_list(Y) ++ "-" ++ integer_to_list(M) ++ "-" ++ integer_to_list(D) ++ " " ++ integer_to_list(H) ++ ":" ++ integer_to_list(Mi) ++ ":" ++ integer_to_list(S),
	    Req:respond({200, [], [Date]});
	_ ->
	    Req:respond({200, [], ["Error"]})
    end.


%%%===================================================================
%%% Internal functions
%%%===================================================================
is_exist([], _Type) ->
    false;
is_exist([{LType, _, _}|Lists], Type) ->
    case LType == Type of
	true ->
	    true;
	_ ->
	    is_exist(Lists, Type)
    end.

create([], NList, Index) ->
    NList ++ "<input type=hidden id=\"total_server\" value="++ integer_to_list(Index - 1) ++" >";
create([{HostName, ServerName, IP}|ServerList], NList, Index) ->
    LHostName = atom_to_list(HostName),
    LIndex = integer_to_list(Index),
    List1 = "<tr id=\"farm_svr_row\" style=\"background-color: #E7E8EB\">" ++
	"<td>" ++ atom_to_list(IP) ++ "</td>" ++
	"<td id=\"hostname_"++LIndex++"\">" ++ LHostName ++ "</td><td>" ++ ServerName ++ "</td><td>
	    <input type=\"radio\" id=\"start_"++LIndex++"\" name=\"farm_svr_"++LIndex++"\" checked=\"checked\" value=\"start\" />
            <label for=\"start_"++LIndex++"\">开启服务器</label><br />
	    <input type=\"radio\" id=\"close_"++LIndex++"\" name=\"farm_svr_"++LIndex++"\" value=\"close\" /><label for=\"close_"++LIndex++"\">关闭服务器</label><br />
            <input type=\"radio\" id=\"restart_"++LIndex++"\" name=\"farm_svr_"++LIndex++"\" value=\"restart\" /><label for=\"restart_"++LIndex++"\">重启服务器</label>
	</td><td><img id=\"status_"++LIndex++"\" src=\"images/closed.png\" width=\"20px\" height=\"20px\" /></td><td><label id=\"time_"++LIndex++"\"/></td><td><table>" ++
	        "<tr><td><a href=\"#\" onclick=\"farm_player_manager('"++ LHostName ++"')\">玩家管理</td></tr>" ++
	        "<tr><td><a href=\"#\" onclick=\"player_broadcast('"++ LHostName ++"')\">公告管理</td></tr>" ++	
	    "</table></td><td><input type=\"submit\" name=\"submit\" id=\"submit\" onclick=\"farm_svr_submit('"++LHostName++"', "++LIndex++")\"  value=\" 提交 \" /></td><td><a href=\"#\" onclick=\"delete_farm_svr('"++LHostName++"')\">删除</a></td></tr>",
    create(ServerList, NList ++ List1, Index + 1).

delete([], NList, _HName) ->
    NList;
delete([{HostName, ServerName, IP}|ServerList], NList, HName) ->
    case HostName == HName of
	true ->
	    delete(ServerList, NList, HName);
	_ ->
	    List1 = "\r\n{'"++atom_to_list(HostName)++"', \""++ServerName++"\", '"++atom_to_list(IP)++"'}.",
	    delete(ServerList, NList ++ List1, HName)
    end.
