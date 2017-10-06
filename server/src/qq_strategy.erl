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
-include("sys_msg.hrl").
-include("records.hrl").

%% API
-export([get_user_info/3, get_user_multi_info/4, get_relation_friends/3, get_user_single_info/4]).
-export([buy_goods/11, word_filter/3, word_filter/5, word_filter/6]).
-export([get_callback_sig/3]).
%%-export([get_sig/6, get_sig/3]).
%%-define(APPHOST, "http://119.147.19.43").
%%-define(APPHOST, "http://113.108.20.23").
-define(SendSysMsg, 1). %% 发送系统消息通知客户端
-define(SaveLog, 2).    %% 保存到错误日志中

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
    JsonData = reply_to_json(OpenId, Body),
    case JsonData of
	{error, _, _} ->
	    get_empty_record();
	_ -> 
	    json_to_record(OpenId, JsonData)
    end.

get_user_single_info(PF, OpenId, OpenKey, FOpenid) ->
    case get_user_multi_info(PF, OpenId, OpenKey, [FOpenid]) of
	[]->
	    get_empty_record();
	UserInfoList when is_list(UserInfoList)->
	    hd(UserInfoList);
	Other ->
	    Other
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
    Data = reply_to_json(OpenId, Body),
    case Data of 
	{error, _, _} -> 
	    [];
	_->
	    case json:get_value(Data, "items") of
		null->
		    [];
		Items->
		    [json_to_record(OpenId,Item) || Item <- Items]
	    end
    end.

%% 获取平台好友关系链
%% ret	 返回码。详见公共返回码说明。
%% openid	 好友QQ号码对应的openid
get_relation_friends(PF, OpenId, OpenKey) ->
    FilePath = "/v3/relation/get_app_friends",
    Body = request(FilePath, PF, OpenId, OpenKey, []),
    Data = reply_to_json(OpenId, Body),
    case Data of 
	{error, _, _} -> 
	    [];
	_->
	     case json:get_value(Data, "items") of
		 FOpenIDJson when is_list(FOpenIDJson)->
		     [binary_to_list(json:get_value(Item, "openid")) || Item <- FOpenIDJson];
		 _UnKown ->
		     %% error_logger:error_msg("get_app_friends error, account:~p, msg:~p~n", [OpenId, UnKown]),
		     []
	     end
    end.


buy_goods(PF, OpenId, OpenKey, PFKey, PayItem, GoodsMeta, GoodsUrl, Amount, TimeStamp, AppMode, Callback)->
    FilePath = "/v3/pay/buy_goods",
    PrivateQueries = [
		      {"pfkey", PFKey},
		      {"payitem", PayItem},
		      {"goodsmeta", GoodsMeta},
		      {"goodsurl", GoodsUrl},
		      {"amt", Amount},
		      {"ts", TimeStamp},
		      {"appmode", AppMode}
		     ],
    Fun = 	       
	fun(Body)-> 
		Data = reply_to_json(OpenId, Body),
		Callback(Data)
	end, 
    asyn_request_https(FilePath, PF, OpenId, OpenKey, PrivateQueries, Fun),
    ok.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% 敏感词过滤(目前只针对留言)
% 留言的意思 是 任何 可以给其他人 发送 是否持久性信息，会产生系统ID的信息。
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
word_filter(Account, Message, MessageId)->
    case db_player:get_platform_login_info(Account) of
	#platform_login_info{openid=OpenId, openkey=OpenKey, pf=PF} ->
	    word_filter(PF, OpenId, OpenKey, Message, MessageId);	
	_ ->
	    Message
    end.

word_filter(PF, OpenId, OpenKey, Message, MessageId)->
    word_filter(PF, OpenId, OpenKey, Message, MessageId, "6").

%% actionid 6：表示留言； 7：表示留言回复； 8：表示其他。
word_filter(PF, OpenId, OpenKey, Message, MessageId, ActionId)->
    FilePath = "/v3/csec/word_filter",
    Body = request(FilePath, PF, OpenId, OpenKey, [
						   {"content", Message}, 
						   {"msgid", MessageId}, 
						   {"actionid", ActionId}]),
    Data = reply_to_json(OpenId, Body),
    case Data of 
	{error, _, _} -> 
	    [];
	_->
	    case json:get_value(Data, "is_dirty") of
		undefine->
		    Message;
		1 ->
		    binary_to_list(json:get_value(Data, "msg"));
		0->
		    Message;
		_Other ->
		    Message
	    end
    end.

%%%===================================================================
%%% Internal functions
%%%===================================================================
reply_to_json(Account, Body) ->
    case get_json_data(Body) of
	{error, ?SaveLog, _ErrId, Msg} ->
	    %% error_logger:error_msg("qq reply error, account:~p, err_code:~p~n", [Account, ErrId]),
	    {error, ?SaveLog, Msg};
	{error, ?SendSysMsg, _ErrId, Msg} when is_list(Account) ->
	    sys_msg:send(list_to_atom(Account), ?msg_qq_strategy, [Msg]),
	    {error, ?SendSysMsg, Msg};
	{error, ?SendSysMsg, _ErrId, Msg} when is_atom(Account) ->
	    sys_msg:send(Account, ?msg_qq_strategy, [Msg]),
	    {error, ?SendSysMsg, Msg};
	JsonData ->
	    JsonData
    end.

get_json_data(Body)->
    case Body of 
	""->
	    {error, ?SaveLog, -10, "网络出现故障"};
	_->
	    case json:decode(Body) of 
		{ok, JsonData, ""}->
		    data_helper:format("js:~p~n", [JsonData]),
		    StatusCode = json:get_value(JsonData, "ret"),
		    if 
			StatusCode >= -200 andalso StatusCode =< -101 -> {error, ?SaveLog, binary_to_list(json:get_value(JsonData, "msg"))}; 
			StatusCode == -1 -> {error, ?SaveLog, StatusCode, "请求的参数错误"};     %% 必须传入的请求参数缺失或参数名错误
			StatusCode == -2 -> {error, ?SaveLog, StatusCode, "非法的APPID"};       %% appid不合法
			StatusCode == -3 -> {error, ?SaveLog, StatusCode, "非法的APPID"};       %% 无API访问权限
			StatusCode == -4 -> {error, ?SaveLog, StatusCode, "非法的APPID"};       %% IP没有权限
			StatusCode == -5 -> {error, ?SaveLog, StatusCode, "签名参数sig校验失败"}; %% 签名参数sig校验失败
			StatusCode == -6 -> {error, ?SaveLog, StatusCode, "访问频率超限"};       %% 访问频率超限
			StatusCode == -7 -> {error, ?SaveLog, StatusCode, "协议不合法"};         %% 协议不合法（要求必须为https协议的地方，被使用了http协议）
			StatusCode == -8 -> {error, ?SaveLog, StatusCode, "非法操作"};           %%由于外挂打击，无法使用该功能
			StatusCode == -9 -> {error, ?SaveLog, StatusCode, "API不存在"};          %%API不存在
			StatusCode == 0 -> JsonData;
			StatusCode < 1000 -> {error, ?SaveLog, StatusCode, "部分数据错误"};
			StatusCode == 1000 -> {error, ?SaveLog, StatusCode, "未授权操作"};
			StatusCode == 1001 -> {error, ?SendSysMsg, StatusCode, "服务器繁忙，通常是后台出错"}; 
			StatusCode == 1002 -> {error, ?SendSysMsg, StatusCode, "请先登录"};
			StatusCode == 1003 -> {error, ?SendSysMsg, StatusCode, "账户被冻结"};
			StatusCode == 1004 -> {error, ?SendSysMsg, StatusCode, "账户余额不足"};
			StatusCode == 1005 -> {error, ?SaveLog, StatusCode, "未开通朋友网"};
			StatusCode == 1006 -> {error, ?SaveLog, StatusCode, "未开通QQ空间"};
			StatusCode < 1100 -> {error, ?SaveLog, StatusCode, "未知错误类型"};
			StatusCode == 1100 -> {error, ?SaveLog, StatusCode, "cdkey不存在"};
			StatusCode == 1101 -> {error, ?SaveLog, StatusCode, "cdkey未绑定账户或者礼品赠送完毕"};
			StatusCode == 1102 -> {error, ?SaveLog, StatusCode, "参加活动受限"};
			StatusCode >=1103 andalso StatusCode =< 1200 -> {error, ?SaveLog, StatusCode,"平台系统错误"}; 
			StatusCode == 1300 -> {error, ?SendSysMsg, StatusCode, "用户不存在，或登录已超时"};
		       true -> {error, ?SaveLog, StatusCode, "未知错误类型"}
		    end;
		_->{error, ?SaveLog, -10, "网络出现故障"}
	    end
    end.

json_to_record(DefaultOpenID, Data)->
    data_helper:format("DefaultOpenId:~p, Data:~p~n", [DefaultOpenID, Data]),
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
	     imageurl=binary_to_list(json:get_value(Data, "figureurl")),
	     is_yellow_vip=json:get_value(Data, "is_yellow_vip", 0),
	     is_yellow_year_vip=json:get_value(Data, "is_yellow_year_vip", 0),
	     yellow_vip_level=json:get_value(Data, "yellow_vip_level", 0)
	    }.

get_empty_record() ->
    #pengyou{openid="",
	     nickname="",
	     gender="",
	     imageurl="",
	     is_yellow_vip=0,
	     is_yellow_year_vip=0,
	     yellow_vip_level=0
	    }.

get_apphost()->
    case application:get_env(server, open_api_host) of
	{ok, APPHOST} ->
	    APPHOST;
	undefined  ->
	    "113.108.20.23"
    end.

get_appid() ->
    case application:get_env(server, app_id) of
	{ok, APPID} ->
	    APPID;
	undefined  ->
	    "35398"
    end.

get_appkey() ->
    case application:get_env(server, app_key) of
	{ok, APPKEY} ->
	    APPKEY;
	undefined  ->
	    "9142f12312c0ba142b526ce3ef477637"
    end.

asyn_request_https(FilePath, PF, OpenId, OpenKey, PrivateQueries, Callback)->
    asyn_request("https", FilePath, PF, OpenId, OpenKey, PrivateQueries, Callback).

%% request_https(FilePath, PF, OpenId, OpenKey, PrivateQueries)->
%%     request("https", FilePath, PF, OpenId, OpenKey, PrivateQueries).

request(FilePath, PF, OpenId, OpenKey, PrivateQueries)->
    request("http", FilePath, PF, OpenId, OpenKey, PrivateQueries).

request(Protocal, FilePath, PF, OpenId, OpenKey, PrivateQueries)->
    Url = build_url(FilePath, PF, OpenId, OpenKey, PrivateQueries),
    http_client:get(Protocal ++ "://" ++ get_apphost() ++ Url).

asyn_request(Protocal, FilePath, PF, OpenId, OpenKey, PrivateQueries, Callback)->
    Url = build_url(FilePath, PF, OpenId, OpenKey, PrivateQueries),
    http_client:asyn_get(Protocal ++ "://" ++ get_apphost() ++ Url, Callback).

build_url(FilePath, PF, OpenId, OpenKey, PrivateQueries)->
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
    lists:concat([FilePath, "?", QueryStringWithoutSig, "&sig=", http_helper:url_encode(Sig)]).

query_sort({Key1, _Value1}, {Key2, _Value2})->
    Key1 < Key2.

build_sig_query_string([])->
    "";
build_sig_query_string([{Key, Value}])->
    Key ++ "=" ++ http_helper:url_encode(Value);
build_sig_query_string(Queries)->
    [{Key, Value}|OtherQueries]=Queries,
    Key ++ "=" ++ http_helper:url_encode(Value) ++ "&" ++ build_sig_query_string(OtherQueries).

build_cb_query_string([])->
    "";
build_cb_query_string([{Key, Value}])->
    Key ++ "=" ++ http_helper:uri_encode(Value);
build_cb_query_string(Queries)->
    [{Key, Value}|OtherQueries]=Queries,
    Key ++ "=" ++ http_helper:uri_encode(Value) ++ "&" ++ build_cb_query_string(OtherQueries).

get_querystring_and_sig(FilePath, Queries, AppKey)->
    SortQueries = lists:sort(fun query_sort/2, Queries),
    QueryString = build_sig_query_string(SortQueries),
    SigString =  http_helper:build_query_string(SortQueries),
    Data = "GET&" ++ http_helper:url_encode(FilePath) ++ "&" ++ http_helper:url_encode(SigString),
    Key = AppKey ++ "&",
    data_helper:format("Data:~p~n",[Data]),
    Mac = crypto:sha_mac(Key, Data),
    {QueryString, binary_to_list(base64:encode(Mac))}.

get_callback_sig(FilePath, Queries, AppKey)->
    SortQueries = lists:sort(fun query_sort/2, Queries),
    SigString =  build_cb_query_string(SortQueries),
    Data = "GET&" ++ http_helper:url_encode(FilePath) ++ "&" ++ http_helper:url_encode(SigString),
    Key = AppKey ++ "&",
    data_helper:format("Data:~p~n",[Data]),
    Mac = crypto:sha_mac(Key, Data),
    binary_to_list(base64:encode(Mac)).


    
