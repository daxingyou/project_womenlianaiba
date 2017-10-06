%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2011, linyibin
%%% @doc
%%% 获取QQ信息
%%% @end
%%% Created : 18 Nov 2011 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(qq_strategy).
-include("qq_strategy.hrl").
%% API
-export([get_user_info/3, get_user_multi_info/4, get_relation_friends/3]).
%%-export([get_sig/6, get_sig/3]).
%%-define(APPHOST, "http://119.147.19.43").
%%-define(APPHOST, "http://113.108.20.23").

%%%===================================================================
%%% API
%%%===================================================================
%% 获取用户信息
%% ret	 返回码。详见公共返回码说明。
%% nickname	 昵称
%% gender	 性别
%% province	 省
%% city	         市
%% figureurl	
%% 头像URL
%% is_vip	 是否为黄钻用户(true或false)
%% is_year_vip	 是否年费黄钻（如果is_vip为false, 那is_year_vip一定是false）
%% vip_level	 黄钻等级（如果是黄钻用户才返回此字段）
get_user_info(PF, OpenId, OpenKey) ->
    FilePath = "/v3/user/get_info",
    Body = request(FilePath, PF, OpenId, OpenKey, []),
    JsonData = get_json_data(Body), 
    case JsonData of
	{error, Reason} ->
	    {error, Reason};
	_ -> json_to_record(OpenId, JsonData)
    end.

%% 批量获取用户信息
%% ret	 返回码。详见公共返回码说明。
%% nickname	 昵称
%% gender	 性别
%% province	 省
%% city	 市
%% figureurl	
%% 头像URL
%% is_vip	 是否为黄钻用户(true或false)
%% is_year_vip	 是否年费黄钻（如果is_vip为false, 那is_year_vip一定是false）
%% vip_level	 黄钻等级（如果是黄钻用户才返回此字段）
get_user_multi_info(PF, OpenId, OpenKey, Fopenids) ->
    FilePath = "/v3/user/get_multi_info",
    PrivateQueries = [{"fopenids", string:join(Fopenids, "_")}],
    Body = request(FilePath, PF, OpenId, OpenKey, PrivateQueries),
    case Body of 
	""->
	    {error, "网络出现故障"};
	_->
	    Data = get_json_data(Body),
	    case Data of 
		{error, _Reason} -> Data;
		_->
		    Items = json:get_value(Data, "items"),
		    [json_to_record(OpenId,Item) || Item <- Items]
	    end
    end.
%% 获取平台好友关系链
%% ret	 返回码。详见公共返回码说明。
%% openid	 好友QQ号码对应的openid
get_relation_friends(PF, OpenId, OpenKey) ->
    FilePath = "/v3/relation/get_app_friends",
    Body = request(FilePath, PF, OpenId, OpenKey, []),
    Data = get_json_data(Body),
    case Data of 
	{error, _Reason} -> Data;
	_->
	    FOpenIDJson = json:get_value(Data, "items"),
	    [binary_to_list(json:get_value(Item, "openid")) || Item <- FOpenIDJson]
    end.

%%%===================================================================
%%% Internal functions
%%%===================================================================
get_json_data(Body)->
    case Body of 
	""->
	    {error, "网络出现故障"};
	_->
	    case json:decode(Body) of 
		{ok, JsonData, ""}->
		    %%io:format("js:~p~n", [JsonData]),
		    StatusCode = json:get_value(JsonData, "ret"),
		    if 
			StatusCode >= -200 andalso StatusCode =< -101 -> {error, binary_to_list(json:get_value(JsonData, "msg"))}; 
			StatusCode == -1 -> {error, "请求的参数错误"};         %% 必须传入的请求参数缺失或参数名错误
			StatusCode == -2 -> {error, "非法的APPID"};           %% appid不合法
			StatusCode == -3 -> {error, "非法的APPID"};           %% 无API访问权限
			StatusCode == -4 -> {error, "非法的APPID"};           %% IP没有权限
			StatusCode == -5 -> {error, "签名参数sig校验失败"};     %% 签名参数sig校验失败
			StatusCode == -6 -> {error, "访问频率超限"};           %% 访问频率超限
			StatusCode == -7 -> {error, "协议不合法"};             %% 协议不合法（要求必须为https协议的地方，被使用了http协议）
			StatusCode == -8 -> {error, "非法操作"};               %%由于外挂打击，无法使用该功能
			StatusCode == -9 -> {error, "API不存在"};              %%API不存在
			StatusCode == 0 -> JsonData;
			StatusCode < 1000 -> {error, "部分数据错误"};
			StatusCode == 1000 -> {error, "未授权操作"};
			StatusCode == 1001 -> {error, "服务器繁忙，通常是后台出错"}; 
			StatusCode == 1002 -> {error, "请先登录"};
			StatusCode == 1003 -> {error, "账户被冻结"};
			StatusCode == 1004 -> {error, "账户余额不足"};
			StatusCode == 1005 -> {error, "未开通朋友网"};
			StatusCode == 1006 -> {error, "未开通QQ空间"};
			StatusCode < 1100 -> {error, "未知错误类型"};
			StatusCode == 1100 -> {error, "cdkey不存在"};
			StatusCode == 1101 -> {error, "cdkey未绑定账户或者礼品赠送完毕"};
			StatusCode == 1102 -> {error, "参加活动受限"};
			StatusCode >=1103 andalso StatusCode =< 1200 -> {error,"平台系统错误"}; 
			StatusCode == 1300 -> {error, "用户不存在，或登录已超时"};
		       true -> {error, "未知错误类型"}
		    end;
		_->{error, "网络出现故障"}
	    end
    end.

json_to_record(DefaultOpenID, Data)->
    io:format("DefaultOpenId:~p, Data:~p~n", [DefaultOpenID, Data]),
    BOpenID = json:get_value(Data, "openid"),
    OpenID = case BOpenID of 
		 undefined -> DefaultOpenID;
		 _->
		     binary_to_list(BOpenID)
	      end,
    Gender = json:get_value(Data, "gender"),
    CertainGender = 
	case Gender of 
	    undefined->
		"";
	    _->binary_to_list(Gender)
	end,
    #pengyou{openid=OpenID,
	     nickname=binary_to_list(json:get_value(Data, "nickname")),
		     gender=CertainGender,
	     imageurl=binary_to_list(json:get_value(Data, "figureurl"))}.

get_apphost()->
    config:get_open_api_host().

get_appid() ->
    config:get_app_id().

get_appkey() ->
    config:get_app_key().

request(FilePath, PF, OpenId, OpenKey, PrivateQueries)->
    AppID = get_appid(),
    AppKey = get_appkey(),
    CommonQueries = [
	       {"appid", AppID},
	       {"openid", OpenId},
	       {"openkey", OpenKey},
	       {"pf", PF}
	      ],
    Queries = lists:append(CommonQueries, PrivateQueries),
    {QueryStringWithoutSig, Sig} = get_querystring_and_sig(FilePath, Queries, AppKey),
    %% io:format("Sig:~p~n",[Sig]),
    Url=lists:concat([FilePath, "?", QueryStringWithoutSig, "&sig=", escape_uri(Sig)]),
    http_client:get(get_apphost() ++ Url).
%%    get_json_data(Body).

query_sort({Key1, _Value1}, {Key2, _Value2})->
    Key1 < Key2.

build_query_string([])->
    "";
build_query_string(Queries) when length(Queries) == 1->
    {Key, Value} = hd(Queries),
    Key ++ "=" ++ Value;

build_query_string(Queries) when length(Queries) > 1->
    [{Key, Value} | OtherQueries] = Queries,
    Key ++ "=" ++ Value ++ "&" ++ build_query_string(OtherQueries).

get_querystring_and_sig(FilePath, Queries, AppKey)->
    SortQueries = lists:sort(fun query_sort/2, Queries),
    QueryString = build_query_string(SortQueries),
    Data = "GET&" ++ escape_uri(FilePath) ++ "&" ++ escape_uri(QueryString),
    Key = AppKey ++ "&",
    io:format("Data:~p~n",[Data]),
    Mac = crypto:sha_mac(Key, Data),
    {QueryString, binary_to_list(base64:encode(Mac))}.

escape_uri([C | Cs]) when C >= $a, C =< $z ->
    [C | escape_uri(Cs)];
escape_uri([C | Cs]) when C >= $A, C =< $Z ->
    [C | escape_uri(Cs)];
escape_uri([C | Cs]) when C >= $0, C =< $9 ->
    [C | escape_uri(Cs)];
escape_uri([C = $. | Cs]) ->
    [C | escape_uri(Cs)];
escape_uri([C = $- | Cs]) ->
    [C | escape_uri(Cs)];
escape_uri([C = $_ | Cs]) ->
    [C | escape_uri(Cs)];
escape_uri([C | Cs]) when C > 16#7f ->
    %% This assumes that characters are at most 16 bits wide.
    escape_byte(((C band 16#c0) bsr 6) + 16#c0)
	++ escape_byte(C band 16#3f + 16#80)
	++ escape_uri(Cs);
escape_uri([C | Cs]) ->
    escape_byte(C) ++ escape_uri(Cs);
escape_uri([]) ->
    [].

escape_byte(C) when C >= 0, C =< 255 ->
    [$%, hex_digit(C bsr 4), hex_digit(C band 15)].

hex_digit(N) when N >= 0, N =< 9 ->
    N + $0;
hex_digit(N) when N > 9, N =< 15 ->
    N + $A - 10.
