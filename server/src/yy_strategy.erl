%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%%
%%% @end
%%% Created :  8 Oct 2012 by LinZhengJian <linzhj@35info.cn>

-module(yy_strategy).

-export([pay_money/6, finish_order/3]).

-export([get_verify/1, get_verify/2]).

-spec pay_money(string(), float(), string(), integer(), integer(), term()) -> ok.
pay_money(UId, Money, SN, Channel, SrvId, Callback)->
    SSN = integer_to_list(SN),
    FilePath = "/payMoney",
    Schannel = integer_to_list(Channel),
    Ssrvid = integer_to_list(SrvId),
    [Smoney] = case is_integer(Money) of
    		 true -> io_lib:format("~.2f",[float(Money)]);
    		 false ->io_lib:format("~.2f",[Money])
	     end,
    STime = dateformat:format(datetime:local_time(), "YmdHis"),
    AppId = get_appid(),
    AppKey = get_appkey(),
    Queries =[
	      {"appid", AppId},
	      {"uid", UId},
	      {"money", Smoney},
	      {"sn", SSN},
	      {"ch", Schannel},
	      {"srvid", Ssrvid},
	      {"time", STime},
	      {"verify", get_verify([AppId, UId, Smoney, SSN, Schannel, Ssrvid, STime], AppKey)}
	     ],
    QueryString = http_helper:build_query_string(Queries),
    Fun = fun(Body)->
		  ReturnProps = reply_to_proplist(Body),
		  data_helper:format("yy_strategy:~p~n",[ReturnProps]),
		  Callback(ReturnProps)
	  end,
    http_client:asyn_post("http://" ++ get_apphost() ++ FilePath, QueryString, Fun).


    
finish_order(UId, YYOrderId, SrvId)->
    FilePath = "/finishOrder",
    Syyorderid = YYOrderId,
    Ssrvid = integer_to_list(SrvId),
    STime = dateformat:format(datetime:local_time(), "YmdHis"),
    AppId = get_appid(),
    AppKey = get_appkey(),
    Queries =[
	      {"appid", AppId},
	      {"uid", UId},
	      {"orderid", Syyorderid},
	      {"srvid", Ssrvid},
	      {"time", STime},
	      {"verify", get_verify([AppId, UId, Syyorderid, Ssrvid, STime], AppKey)}
	     ],
    QueryString = http_helper:build_query_string(Queries),
    Callback = fun(_)-> ok end,
    http_client:asyn_post("http://" ++ get_apphost() ++ FilePath, QueryString, Callback).

%% 应用参数
get_verify(QueryValues)->
    get_verify(QueryValues, get_appkey()).

get_verify([], _Key)->
    "";

get_verify(QueryValues, Key) ->
    data_helper:format("QueryValues:~p~n",[QueryValues]),
    Source = string:join(QueryValues, ""),
    <<Sha:160/integer>>  = crypto:sha(Key),
    Md5Source = lists:flatten(io_lib:format("~s~40.16.0b", [Source, Sha])), 
    <<Md5:128>> = crypto:md5(Md5Source),
    Verify = lists:flatten(io_lib:format("~32.16.0b", [Md5])),
    data_helper:format("Verify:~p~n",[Verify]),
    Verify.

get_appid()->
    case application:get_env(server, app_id) of
	{ok, APPID} ->
	    APPID;
	undefined  ->
	    "106407"
    end.

get_appkey()->
    case application:get_env(server, app_key) of
	{ok, APPKEY} ->
	    APPKEY;
	undefined  ->
	    "7b8b9bfa2f674cc747b55fff2860fc2b27bfecbe"
    end.

get_apphost()->
    case application:get_env(server, open_api_host) of
	{ok, APPHOST} ->
	    APPHOST;
	undefined  ->
	    "service.open.yy.com"
    end.



%%辅助函数
reply_to_proplist(Body) ->
        case Body of 
	    ""->
		{error, 2, -10, "网络出现故障"};
	_ ->
		Props = string:tokens(Body, "&"),
		Fun = fun(Prop, Acc)->
			[Key, Value] = string:tokens(Prop, "="),
			[{Key, Value}|Acc]
		end,
		lists:foldl(Fun, [], Props)
	end.
