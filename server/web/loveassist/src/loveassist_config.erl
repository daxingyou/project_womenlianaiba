%%%-------------------------------------------------------------------
%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%% ∂¡»°app≈‰÷√
%%% @end
%%% Created : 14 Apr 2012 by LinZhengJian <linzhj@35info.cn>
%%%-------------------------------------------------------------------
-module(loveassist_config).

-define(app_name, loveassist).

-compile(export_all).

get_game_server()->
    case application:get_env(?app_name, game_server) of
	{ok, Val} -> 
	    Val;
	_ ->
	    'love@10.182.14.60'
    end.


get_video_server()->
    case application:get_env(?app_name, video_server) of
	{ok, Val} -> 
	    Val;
	_ ->
	    "10.182.14.60"
    end.
