%% @author Mochi Media <dev@mochimedia.com>
%% @copyright 2010 Mochi Media <dev@mochimedia.com>

%% @doc Web server for loveassist.

-module(loveassist_web).
-author("Mochi Media <dev@mochimedia.com>").

-export([start/1, stop/0, loop/2]).

%% External API

start(Options) ->
    {DocRoot, Options1} = get_option(docroot, Options),
    Loop = fun (Req) ->
                   ?MODULE:loop(Req, DocRoot)
           end,
    mochiweb_http:start([{name, ?MODULE}, {loop, Loop} | Options1]).

stop() ->
    mochiweb_http:stop(?MODULE).

loop(Req, DocRoot) ->
    "/" ++ Path = Req:get(path),
    try
        case Req:get(method) of
            Method when Method =:= 'GET'; Method =:= 'HEAD' ->
                case Path of
		    "order/ship"->
			Query = Req:parse_qs(),
			case propslists:get_value("payitem", Query) of
			    "video" ++ _Other -> %%视频金币
				video_cb(Req);
			    _ ->
				lovehome_cb(Req)
			end;
		    _ ->
			Req:serve_file(Path, DocRoot)
		end;
            'POST' ->
                case string:to_lower(Path) of
		    "paymoneycb"->
			Data = Req:parse_post(),
			Node=loveassist_config:get_game_server(),
			RPCReturn = rpc:call(Node, yy_accounting_context, accouting_callback, [Data]),
			io:format("RPCReturn:~p~n",[RPCReturn]),
			ResponseBody = case RPCReturn of
				   {badrpc, Reason} ->
				    log("Reason:~p~n",[Reason]),
				       "error";
				   error ->
				       "op_ret=-10";
				   ok ->
				       "op_ret=1"
			       end,
		    	http_server:send(Req, ResponseBody);
		    "posttest"->
		    	Data = Req:parse_post(),
		    	io:format("Post Data:~p~n",[Data]),
		    	http_server:send(Req, "i am ok.");
                    _ ->
                        Req:not_found()
                end;
            _ ->
                Req:respond({501, [], []})
        end
    catch
        Type:What ->
            Report = ["web request failed",
                      {path, Path},
                      {type, Type}, {what, What},
                      {trace, erlang:get_stacktrace()}],
            error_logger:error_report(Report),
            %% NOTE: mustache templates need \ because they are not awesome.
            Req:respond({500, [{"Content-Type", "text/plain"}],
                         "request failed, sorry\n"})
    end.

%% Internal API

get_option(Option, Options) ->
    {proplists:get_value(Option, Options), proplists:delete(Option, Options)}.

get_filepath_and_querystring(Request)->
    RawPath = Request:get(raw_path),
    {Path, QueryString, _} = mochiweb_util:urlsplit_path(RawPath),
    {Path, QueryString}.

video_cb(Req) ->
    Node = loveassist_config:get_video_server(),
    Body = 
	case rpc:call(Node, qq_strategy, paycb, [Req:get(path), Req:parse_qs()]) of
	    ok->
		"{\"ret\":0,\"msg\":\"OK\\\"}";
	    {error, server_busy}->
		"{\"ret\":1,\"msg\":\"server busy.\"}";
	    2->
		"{\"ret\":2,\"msg\":\"token no exist.\"}";
	    {error, error_sig}->
		"{\"ret\":4,\"msg\":\"parameter error(sig).\"}";
	    4->
		"{\"ret\":3,\"msg\":\"server timeout.\"}";
	    {badrpc, _Reason}->
		io:format("Reason:~p~n",[_Reason]),
		"{\"ret\":1,\"msg\":\"server busy.\"}";
	    _->
		"{\"ret\":4,\"msg\":\"server busy\"}"
	end,
    http_server:send(Req, Body).

lovehome_cb(Req)->
    {ReqPath, QueryString} = get_filepath_and_querystring(Req),        
    Node = loveassist_config:get_game_server(),
    Body = 
	case rpc:call(Node, qq_accounting_context, accouting_callback, [ReqPath, QueryString]) of
	    0->
		"{\"ret\":0,\"msg\":\"OK\\\"}";
	    1->
		"{\"ret\":1,\"msg\":\"server busy.\"}";
	    2->
		"{\"ret\":2,\"msg\":\"token no exist.\"}";
	    3->
		"{\"ret\":3,\"msg\":\"server timeout.\"}";
	    4->
		"{\"ret\":4,\"msg\":\"parameter error(sig).\"}";
	    {badrpc, _Reason}->
		io:format("Reason:~p~n",[_Reason]),
		"{\"ret\":1,\"msg\":\"server busy.\"}";
	    _->
		"{\"ret\":4,\"msg\":\"server busy\"}"
	end,
    http_server:send(Req, Body).

%%
%% Tests
%%
-ifdef(TEST).
-include_lib("eunit/include/eunit.hrl").

you_should_write_a_test() ->
    ?assertEqual(
       "No, but I will!",
       "Have you written any tests?"),
    ok.

-endif.


log(Pattern, Info)->
    io:format(Pattern, Info).
