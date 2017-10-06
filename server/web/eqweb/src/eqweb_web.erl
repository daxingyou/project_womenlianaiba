%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@china-channel.com>
%%% @copyright (C) 2010, linyibin
%%% @doc
%%% 
%%% @end 
%%% Created :  6 Aug 2010 by linyibin <linyb@china-channel.com>
%%%-------------------------------------------------------------------
-module(eqweb_web).
-author('author <author@example.com>').
-include("qq_strategy.hrl").
-export([start/1, stop/0, loop/2]).

%% External API

start(Options) ->
    {DocRoot, Options1} = get_option(docroot, Options),
    Loop = fun (Req) ->
                   loop(Req, DocRoot)
           end,
    inets:start(),
    mochiweb_http:start([{name, ?MODULE}, {loop, Loop} | Options1]).

stop() ->
    mochiweb_http:stop(?MODULE).

loop(Req, DocRoot) ->
    "/" ++ Path = Req:get(path),
    %% io:format("ReqPath:~p, path:~p, Method:~p, DocRoot:~p~n", [Req:get(path), Path, Req:get(method), DocRoot]),
    case Req:get(method) of
        'GET' ->
            case Path of
		"WebPlayer/pengyou.html" -> %%配对页面
		    List = Req:parse_qs(),
		    %%TODO:OpenId需要做校验,校验规则详见QQ开放平台
		    %% 获取用户的OpenId跟OpenKey
		    OpenId = get_param(List, "openid"),
		    LoveHouseInfo = love_house:get_house_id(OpenId),
		    case LoveHouseInfo of %%是否已经有爱的小屋
			0->		
			    Req:serve_file(Path, DocRoot); 
			_->
			    URL = get_game_page_url(Req),
			    Req:respond({302, 
					 [{"Location", URL}, 
					  {"Content-Type", "text/html; charset=UTF-8"}], 
					 ""})	   
		    end;
		%% "WebPlayer/WebPlayer.html" -> %%游戏页面
		%%     Req:serve_file(Path, DocRoot);
		"WebPlayer/pengyou" ->%% 朋友网
		    List = Req:parse_qs(),
		    %%TODO:OpenId需要做校验,校验规则详见QQ开放平台
		    %% 获取用户的OpenId跟OpenKey
		    OpenId = get_param(List, "openid"),
		    OpenKey = get_param(List, "openkey"),
		    LoveHouseInfo = love_house:get_house_id(OpenId),
		    case LoveHouseInfo of %%是否已经有爱的小屋
			0->
			    InvitorInfo = qq_strategy:get_user_info("pengyou", OpenId, OpenKey),
			    case InvitorInfo of 
				{error, Reason}->
				    %% 无法获取信息，刷新页面重试
				    http_server:send(Req, build_response_json(error, Reason));
				_->
				    InvitedRecords = love_house:find_register_invited(OpenId),
				    InvitedString = get_invitor_info(InvitedRecords, OpenId, OpenKey),
				    InvitingRecord = love_house:find_register_inviting(OpenId),
				    InvitingString = get_invitee_info(InvitingRecord, OpenId, OpenKey),
				    FailureInvitation = love_house:get_failure_invitation(OpenId),
				    FailureInvitationString = get_failure_invitation_json(FailureInvitation, InvitorInfo, OpenId, OpenKey),
				    Body = "'{\"status\":\"show\", \"data\":" ++ 
					"{\"invited\":" ++ InvitedString ++ ", " ++
					"\"inviting\":" ++ InvitingString ++ ", " ++ 
					"\"userInfo\":" ++ get_info(InvitorInfo) ++ ", " ++
					"\"failureMessage\":" ++ FailureInvitationString ++ 
					case InvitingRecord of 
					    {ID, _Invitng, _Invited}->
						",\"id\":\"" ++ integer_to_list(ID) ++ "\"" ;
					    _ -> ""
					end
					++ "}}'",
				    http_server:send(Req, Body)
			    end;
			{badrpc, Reason}->
			    io:format("Reason:~p~n",[Reason]),
			    http_server:send(Req,build_response_json(error, "内部服务错误，请刷新页面"));
			_->
			    %% 如果已经注册过了，就直接跳转到游戏页面
			    http_server:send(Req,build_response_json(redirect, get_game_page_url(Req)))
		    end;
		"WebPlayer/inviting"->
		    List = Req:parse_qs(),
		    %%TODO:OpenId需要做校验,校验规则详见QQ开放平台
		    %% 获取用户的OpenId跟OpenKey
		    Inviting = get_param(List, "inviting"),
		    Invited = get_param(List, "invited"),
		    if Inviting == Invited->
			    http_server:send(Req, build_response_json(error, "不能和自己进行配对"));
		       true->
		    OpenId = get_param(List, "openid"),
		    OpenKey = get_param(List, "openkey"),
		    InvitingHouseInfo = love_house:get_house_id(Inviting),
		    if 
			InvitingHouseInfo==0->  %%是否已经有爱的小屋
			    InvitingInfo = love_house:find_register_inviting(Inviting),
			    if 
				InvitingInfo=={}->  %% 没发送过邀请
				    Invitation = love_house:find_invitation(Invited, Inviting),
				    if 
					Invitation=={}->
					    InvitedHouseInfo = love_house:get_house_id(Invited),		
					    if
						InvitedHouseInfo==0->  %%对方没有爱的小屋
						    ID = love_house:add_register_invitation(Inviting, Invited),
						    MultiInfo = qq_strategy:get_user_multi_info("pengyou", OpenId, OpenKey, [Invited]),
						    InviteeString = case MultiInfo of 
									[]-> "null";
									[Info|_Other]->
									    get_info(Info);
									_ -> "null"
								    end,
						    Body = "'{\"status\":\"show\", \"data\":{" ++ 
							"\"id\":\"" ++ integer_to_list(ID) ++ "\", " ++
							"\"inviting\":" ++ InviteeString ++ "}}'",
						    http_server:send(Req, Body);
						true->
						    http_server:send(Req, build_response_json(error, "该玩家与其他玩家完成配对，请另外选择"))
					    end;
					true->
					    InvitedInfo = qq_strategy:get_user_info("pengyou", OpenId, OpenKey),
					    [InvitingInfo1|_Tail] = qq_strategy:get_user_multi_info("pengyou", OpenId, OpenKey, [Invited]),
					    Body = create_house(InvitingInfo1, InvitedInfo, Req),
					    http_server:send(Req, Body)
				    end;
				true->	      %%已经发送过邀请
				    http_server:send(Req, build_response_json(error, "不能多次发送邀请"))
			    end;
			true->           %%已经配对成功
			    http_server:send(Req,build_response_json(redirect, get_game_page_url(Req)))
		    end
		    end;
		"WebPlayer/invited"->
		    List = Req:parse_qs(),
		    Inviting = get_param(List, "inviting"),
		    Invited = get_param(List, "invited"),
		    OpenId = get_param(List, "openid"),
		    OpenKey = get_param(List, "openkey"),
		    InvitedHouseInfo = love_house:get_house_id(Invited),		
		    if 
			InvitedHouseInfo==0->  %%是否已经有爱的小屋
			    Invitation = love_house:find_invitation(Inviting, Invited),
			    if
				Invitation /= {} ->  %% 发送过邀请
				    InvitedInfo = qq_strategy:get_user_info("pengyou", OpenId, OpenKey),
				    [InvitingInfo|_Tail] = qq_strategy:get_user_multi_info("pengyou", OpenId, OpenKey, [Inviting]),
				    Body = create_house(InvitingInfo, InvitedInfo, Req),
				    http_server:send(Req, Body);
				true->
				    http_server:send(Req, build_response_json(error, "邀请已经被取消"))
			    end;
			true->           %%已经配对成功
			    http_server:send(Req,build_response_json(redirect, get_game_page_url(Req)))
		    end;
		"WebPlayer/cancel"->
		    List = Req:parse_qs(),
		    Account = get_param(List, "account"),
		    ID = get_param(List, "id"),
		    InvitingHouseInfo = love_house:get_house_id(Account),		
		    case InvitingHouseInfo of
			0->   %% 还没配对成功
			    love_house:cancel_invitation(ID),
			    Body = "'{\"status\":\"show\", \"data\": {\"inviting\":null}}'",
			    http_server:send(Req, Body);
			_-> %%已经配对成功了
			    http_server:send(Req,build_response_json(redirect,get_game_page_url(Req)))
		    end;
		"WebPlayer/refuse"->
		    List = Req:parse_qs(),
		    Account = get_param(List, "account"),
		    OpenId = get_param(List, "openid"),
		    OpenKey = get_param(List, "openkey"),
		    ID = get_param(List, "id"),
		    InvitingHouseInfo = love_house:get_house_id(Account),
		    case InvitingHouseInfo of
			0->   %% 还没配对成功
			    love_house:refuse_invitation(ID),
			    OpenId = get_param(List, "openid"),
			    OpenKey = get_param(List, "openkey"),
			    InvitedRecords = love_house:find_register_invited(OpenId),
			    InvitedString = get_invitor_info(InvitedRecords, OpenId, OpenKey),
			    http_server:send(Req, "'{\"status\":\"show\",\"data\":{\"invited\":" ++ InvitedString ++ "}}'");
			_-> %%已经配对成功了
			    http_server:send(Req,build_response_json(redirect, get_game_page_url(Req)))
		    end;
		"WebPlayer/friendlist"->
		    List = Req:parse_qs(),
		    OpenId = get_param(List, "openid"),
		    OpenKey = get_param(List, "openkey"),
		    Body = build_friend_list_json(OpenId, OpenKey),
		    http_server:send(Req, Body);
		"WebPlayer/qqmatch" ->
		    List = Req:parse_qs(),
		    OpenID = get_param(List, "openid"),
		    InvitingHouseID = love_house:get_house_id(OpenID),
		    %% io:format("HouseID~p~n",[InvitingHouseID]),
		    case InvitingHouseID of
			0->   %% 还没配对成功
			    %% 查询数据库
			    PairInfo = love_house:get_pair_info(list_to_atom(OpenID)),
			    %% 发送配对信息
			    %% 判断是否已经添加配对码			
			    Body = case PairInfo of 
				{_OpenIdAtom, BoyNumber, GirlNumber, _Gender}->
					   %% 已经发送配对号码
					   build_pair_info_json(BoyNumber, GirlNumber);
				_->
				    %%
				    build_pair_info_json(null)
			    end,
			    http_server:send(Req, Body);
			_-> %%已经配对成功了
			    http_server:send(Req,build_response_json(redirect,get_game_page_url(Req)))
		    end;
		""->
		    case is_application_available() of
			{ok, true}->
			    List = Req:parse_qs(),
			    default_handler(DocRoot, Req, List);
			_ ->
			    URL = get_error_url(Req),
			    http_server:redirect(Req, URL)
		    end;
		"WebPlayer/QQMatch.html" ->
		    handle_request(DocRoot, Req, fun qqmatch_html_handler/3);
		"WebPlayer/mateup" ->
		    handle_request(DocRoot, Req, fun mateup_handler/3);
		"WebPlayer/delaymateup"->
		    handle_request(DocRoot, Req, fun delaymateup_handler/3);
		"WebPlayer/confirmmateup"->
		    handle_request(DocRoot, Req, fun confirmmateup_handler/3);
		"qzone" ->	
		    ok;
		"weibo" ->
		    ok;
		_ ->
		    Req:serve_file(Path, DocRoot)
	    end;
	_ ->
            case Path of
		"index" ->
		    QueryString = build_cb_query_string(Req:parse_post()),
		    URL = "http://118.244.197.5/WebPlayer/yy.html?" ++ QueryString,
		    Body = "op_ret=1&effurl=" ++ binary_to_list(base64:encode(URL)),
		    http_server:send(Req, Body);
		"zip/file"->
		    validate(Req, DocRoot, fun zip/2);
		"report/bug"->
		    PostData = Req:parse_post(),
		    Data = proplists:get_value("data", PostData),
		    SMTPConfig = config:get_smtp(),
		    gen_smtp_client:send(
		      {proplists:get_value(username, SMTPConfig)
		       , config:get_recipient()
		       ,"Subject: LoveHome client bug report." ++ 
			   "\r\n\r\n" ++ Data}
		      , SMTPConfig
		     ),
		    %%FileName = DocRoot ++ "/report/bug/" ++ dateformat:format("YmdHisU") ++ ".log",
		    %%file:write_file(FileName, Data),
		    http_server:send(Req, "ok");
		_->
		    Req:respond({501, [], []})
	    end
    end.

%% Internal API
get_option(Option, Options) ->
    {proplists:get_value(Option, Options), proplists:delete(Option, Options)}.

get_param([], _Param) ->
    [];
get_param([{Key, Value}|List], Param) ->
    case Key == Param of
	true ->
	    Value;
	_ ->
	    get_param(List, Param)
    end.

%% html generator
get_invitee_info(InvitingRecord, OpenId, OpenKey)->    
    case InvitingRecord of 
       	{_ID, _Inviting, Invited} ->
	    MultiInfo = qq_strategy:get_user_multi_info("pengyou", OpenId, OpenKey, [Invited]),
	    case MultiInfo of 
		[]-> "null";
		[Info|_Other]->
		    get_info(Info);
		_ -> "null"
	    end;
	_->
	    "null"
    end.

get_invitor_info(InvitedRecords, OpenId, OpenKey)
  when is_list(InvitedRecords) ->    
    case InvitedRecords of 
	[]->"[]";
	_->
	    MultiInfo = qq_strategy:get_user_multi_info("pengyou", OpenId, OpenKey, [Inviting||{_ID, Inviting, _Invited} <- InvitedRecords]),
	    case MultiInfo of 
		[]-> "[]";
		{error, _Reason}->"[]";
		_->
		    F = 
			fun({ID, Inviteing, _Invited}, AccIn) ->
				ItemInfo = lists:keyfind(Inviteing, 2, MultiInfo),
				[{ItemInfo, ID}|AccIn]
			end,
		    SortedMultiInfo = lists:foldr(F, [], InvitedRecords),
		    "[" ++ string:join([get_info(Info, ID) || {Info, ID} <- SortedMultiInfo],",") ++ "]"
	    end
    end.

get_info(#pengyou{openid=OpenId, nickname=NickName, imageurl=ImageUrl}, InvitedRecords) 
  when is_tuple(InvitedRecords) ->
    {ID, _Inviteing, _Invited} = lists:keyfind(OpenId, 2, InvitedRecords),
    "{\"openId\":\"" ++ OpenId ++
	"\", \"nickName\":\"" ++ NickName ++
	"\", \"imageUrl\":\"" ++ ImageUrl ++ 
	"\", \"id\":\"" ++ integer_to_list(ID) ++ "\"}";

get_info(#pengyou{openid=OpenId, nickname=NickName, imageurl=ImageUrl}, ID)
  when is_integer(ID) ->
    "{\"openId\":\"" ++ OpenId ++
	"\", \"nickName\":\"" ++ NickName ++
	"\", \"imageUrl\":\"" ++ ImageUrl ++ 
	"\", \"id\":\"" ++ integer_to_list(ID) ++ "\"}".


get_info(#pengyou{openid=OpenId, nickname=NickName, imageurl=ImageUrl}) ->
    "{\"openId\":\"" ++ OpenId ++
	"\", \"nickName\":\"" ++ NickName ++
	"\", \"imageUrl\":\"" ++ ImageUrl ++ "\"}".

build_response_json(error, Message)->
    "'{\"status\":\"error\",\"data\":{\"message\":\"" ++ Message ++"\"}}'";

build_response_json(redirect, Url) ->
    "'{\"status\":\"redirect\",\"data\":{\"url\":\"" ++ Url ++ "\"}}'".

build_friend_list_json(OpenId, OpenKey)->
    FriendList = qq_strategy:get_relation_friends("pengyou", OpenId, OpenKey),
    case FriendList of 
	{error, Reason}->
	    build_response_json(error, Reason);
	_->
	    FriendInfoList=qq_strategy:get_user_multi_info("pengyou", OpenId, OpenKey, FriendList),
	    case FriendInfoList of
		{error, Reason}->
		    build_response_json(error, Reason);
		_->
				    "'{\"status\":\"show\", \"data\":{\"friends\":[" ++		
			string:join([get_info(Item) || Item <- FriendInfoList], ",") ++ "]}}'"
	    end
    end.

create_house(InvitingInfo, InvitedInfo, Request)->
    InvitingGender = case InvitedInfo#pengyou.gender of 
			 "女"->"男";
			 ""-> InvitingInfo#pengyou.gender;
			 _ -> "女"
		     end,
    case InvitingGender of 
	"女"->
	    HouseName = InvitedInfo#pengyou.nickname ++ "和" ++ InvitingInfo#pengyou.nickname ++ "的家",
	    love_house:create_love_house(InvitedInfo#pengyou.openid, InvitingInfo#pengyou.openid, HouseName);
	_->
	    HouseName = InvitingInfo#pengyou.nickname ++ "和" ++ InvitingInfo#pengyou.nickname ++ "的家",
	    love_house:create_love_house(InvitingInfo#pengyou.openid, InvitedInfo#pengyou.openid, HouseName)
    end,
    "'{\"status\":\"matchsucc\", \"data\":{" ++ 
	"\"url\":\"" ++ get_game_page_url(Request) ++"\", " ++
	"\"inviting\":" ++ get_info(InvitingInfo) ++ ", " ++
	"\"invited\": " ++ get_info(InvitedInfo) ++ "}}'".

create_pair_house(Gender, UserInfo, EXUserInfo, Request)->
    case Gender of 
	"女"->
	    HouseName = EXUserInfo#pengyou.nickname ++ "和" ++ UserInfo#pengyou.nickname ++ "的家",
	    love_house:mateup(EXUserInfo#pengyou.openid, UserInfo#pengyou.openid, HouseName);
	_->
	    HouseName = UserInfo#pengyou.nickname ++ "和" ++ EXUserInfo#pengyou.nickname ++ "的家",
	    love_house:mateup(UserInfo#pengyou.openid, EXUserInfo#pengyou.openid, HouseName)
    end,
    "'{\"status\":\"matchsucc\", \"data\":{" ++ 
	"\"url\":\"" ++ get_game_page_url(Request) ++"\", " ++
	"\"inviting\":" ++ get_info(UserInfo) ++ ", " ++
	"\"invited\": " ++ get_info(EXUserInfo) ++ "}}'".

get_gender(UserInfo, EXUserInfo)->
    case UserInfo#pengyou.gender == EXUserInfo#pengyou.gender of
	true ->
	    "";
	_->
	    case UserInfo#pengyou.gender of 
		"女"->"女";
		"男"->"男";
		_->
		    case EXUserInfo#pengyou.gender of
			"女"->"男";
			"男"->"女";
			_ -> ""
		    end
	    end
    end.


get_failure_invitation_json(FailureInvitation, #pengyou{nickname=NickName}, OpenId, OpenKey)->
    case FailureInvitation of 
	{_Inviting, Invited, FailureType}->
	    MultiInfo = qq_strategy:get_user_multi_info("pengyou", OpenId, OpenKey, [Invited]),
	    InvitedNickName = case MultiInfo of 
				  []-> "";
				  [Info|_Other]->
				      Info#pengyou.nickname;
				  _ -> ""
			      end,
	    "\"" ++ message_helper:get_failure_invitation_message({NickName, InvitedNickName, FailureType}) ++ "\"";
	_ ->
	    "null"
    end.

get_error_url(Request) ->
    QueryString = http_server:get_querystring(Request),
    config:get_error_page() ++ "?" ++ QueryString.

get_game_page_url(Request)->
    QueryString = http_server:get_querystring(Request),
    List = Request:parse_qs(),
    PF = 
	case get_param(List, "pf") of
	    Empty when Empty == "" orelse Empty == [] orelse Empty==undefined ->
		Referer = Request:get_header_value("Referer"),
		RefererQueryString = http_server:get_querystring(Referer),
		RefererQuery = mochiweb_util:parse_qs(RefererQueryString),
		case get_param(RefererQuery, "pf") of
		    ""->
			"pengyou";
		    undefined->
			"pengyou";
		RefererPF->
			RefererPF
		end;    
	    Value ->
		Value
	end,
    config:get_game_page(list_to_atom(PF)) ++ "?" ++ QueryString.

build_pair_info_json(null)->
 "'{\"status\":\"show\", \"data\":{" ++ 
	"\"inviting\":null}" ++
	"}'".

build_pair_info_json(BoyNumber, GirlNumber)->
    "'{\"status\":\"show\", \"data\":{" ++ 
	"\"inviting\":{\"boyNumber\":\"" ++ BoyNumber ++ "\", \"girlNumber\":\"" ++ GirlNumber ++ "\"}}" ++
	"}'".

%%%
%%-spec(handle_request(DocRoot, Req, fun)-> term())
handle_request(DocRoot, Req, Handler)->
    List = Req:parse_qs(),
    case house_validate(DocRoot, Req, List) of 
	ok ->
	    Handler(DocRoot, Req, List);
	{respond, Body}->
	    http_server:send(Req, Body);
	{redirect, URL} ->
	    http_server:redirect(Req, URL);
	{error, Reason}->
	    Body = build_response_json(error, Reason),
	    http_server:send(Req, Body);
	_->
	    http_server:send(Req, "内部服务出错")
    end.

house_validate(_DocRoot, Req, List)->
    OpenId = get_param(List, "openid"),
    case love_house:get_house_id(OpenId) of
	HouseID when is_integer(HouseID) andalso HouseID==0 -> %% 还没配对成功
	    ok;
	HouseID when is_integer(HouseID) andalso HouseID>0 ->
	    URL = get_game_page_url(Req),
	    {redirect, URL};
	{badrpc, _Reason}->
	    URL = get_error_url(Req),
	    {redirect, URL};
	_->
	    {error, "内部服务出错"}
    end.

%%% handler
-ifndef(debug).
default_handler(_DocRoot, Req, _List)->
    URL = get_game_page_url(Req),
    http_server:redirect(Req, URL).
-else.
default_handler(_DocRoot, Req, _List)->
    Host = get_host(),
    URL = Host ++ ":" ++ integer_to_list(config:get_website_port()) ++ get_game_page_url(Req),
    http_server:redirect(Req, URL).

get_host()->
    case config:get_server_list() of
	[]->
	    "";
	[_Server|ServerList] ->
	    case length(ServerList) of
		1 ->
		    get_server(hd(ServerList));
		Len ->
		    Index = random:uniform(Len),
		    get_server(lists:nth(Index, ServerList))
	    end;
	_Other ->""
    end.

get_server({Server,_ID})->
    io:format("server:~p~n",[Server]),
    Host = "http://" ++ string:substr(atom_to_list(Server), 6),
    io:format("Host:~p~n",[Host]),
    Host.
-endif.
qqmatch_html_handler(DocRoot, Req, _List)->
    %%TODO:OpenId需要做校验,校验规则详见QQ开放平台
    %% 获取用户的OpenId跟OpenKey
    "/" ++ Path = Req:get(path),
    Req:serve_file(Path, DocRoot).  
mateup_handler(_DocRoot, Req, List)->
    OpenID = get_param(List, "openid"),
    OpenIdAtom = list_to_atom(OpenID),
    OpenKey = get_param(List, "openkey"),
    %% 查询号码是否存在
    GirlNumber = get_param(List, "girlNumber"),
    BoyNumber = get_param(List, "boyNumber"),
    PairInfoList = love_house:get_pair_info(BoyNumber, GirlNumber),
    %% 去除当前用户
    RealPairInfoList = lists:keydelete(OpenIdAtom, 1, PairInfoList),
    Body = case RealPairInfoList of 
	       %% 过滤当前用户
	       %%不存在：将配对信息写入数据库
	       []->
		   UserInfo = qq_strategy:get_user_info("pengyou", OpenID, OpenKey),
		   Gender = 
		       if is_record(UserInfo, pengyou)->
			       UserInfo#pengyou.gender;
			  true->
			       ""
		       end,
		   love_house:add_pair_info(OpenIdAtom, BoyNumber, GirlNumber, Gender),
		   build_pair_info_json(BoyNumber, GirlNumber);
	       _->
		   %% 存在输入相同配对信息的用户
		   EXOpenIDList = [atom_to_list(EXOpenID) || {EXOpenID, _EXBoyNumber, _EXGirlNumber, _Gender} <- RealPairInfoList],
		   InvitingInfoList = qq_strategy:get_user_multi_info("pengyou", OpenID, OpenKey, EXOpenIDList),
		   "'{\"status\":\"show\", \"data\":{\"invitedList\":[" ++	    
		       string:join([get_info(Item) || Item <- InvitingInfoList], ",") ++ "]}}'"
	   end,
    http_server:send(Req, Body).
delaymateup_handler(_DocRoot, Req, List)->
    OpenID = get_param(List, "openid"),
    OpenKey = get_param(List, "openkey"),
    OpenIdAtom = list_to_atom(OpenID),
    GirlNumber = get_param(List, "girlNumber"),
    BoyNumber = get_param(List, "boyNumber"),
    UserInfo = qq_strategy:get_user_info("pengyou", OpenID, OpenKey),
    Gender = 
	if is_record(UserInfo, pengyou)->
			       UserInfo#pengyou.gender;
	   true->
		""
		       end,
    love_house:add_pair_info(OpenIdAtom, BoyNumber, GirlNumber, Gender),
    Body = build_pair_info_json(BoyNumber, GirlNumber),
    http_server:send(Req, Body).

confirmmateup_handler(_DocRoot, Req, List)->
    OpenID = get_param(List, "openid"),
    OpenKey = get_param(List, "openkey"),
    EXOpenID = get_param(List, "exopenid"),
    BoyNumber = get_param(List, "boyNumber"),
    GirlNumber = get_param(List, "girlNumber"),
    case love_house:get_pair_info(list_to_atom(EXOpenID)) of 
	    {_EXOpenIDAtom, EXBoyNumber, EXGirlNumber, EXGender} ->
    IsSameNumber = (BoyNumber == EXBoyNumber andalso GirlNumber == EXGirlNumber),
    case IsSameNumber of 
	true->
	    EXHouseID = love_house:get_house_id(EXOpenID),		
	    case EXHouseID of 
		0-> %%被选中的玩家也还没配对成功
		    Gender = get_param(List, "gender"),
		    UserInfo = qq_strategy:get_user_info("pengyou", OpenID, OpenKey),
		    EXUserInfoList = qq_strategy:get_user_multi_info("pengyou", OpenID, OpenKey, [EXOpenID]),
		    EXUserInfo = hd(EXUserInfoList),
		    %% io:format("Gender:~p~nExGender:~p~n",[Gender, EXGender]),
		    ExactGender = case Gender of 
				      "0"->
					  "女";
				      "1"->
					  "男";
				      _->
					  get_gender(UserInfo, EXUserInfo#pengyou{gender=EXGender})
				  end,
		    case ExactGender of 
			""-> %%没有性别
			    Body = "'{\"status\":\"needgender\",\"data\":{\"choiceSex\":true}}'",
			    http_server:send(Req, Body);
			_->
			    Body = create_pair_house(ExactGender, UserInfo, EXUserInfo, Req),
			    http_server:send(Req, Body)
		    end;
		_->
		    http_server:send(Req, build_response_json(error, "该玩家与其他玩家完成配对，请另外选择"))
	    end;
	_ ->
	    http_server:send(Req, build_response_json(error,"出现异常，请刷新页面重新选择"))
    end;
	_ ->
	    http_server:send(Req, build_response_json(error, "该玩家与其他玩家完成配对，请另外选择"))
    end.

validate(Req, DocRoot, OKHandler)->
    PostData = Req:parse_post(),
    PWD = proplists:get_value("pwd", PostData, ""),
    case validate_password(PWD) of
	true->
	    OKHandler(Req, DocRoot);
	false->
	    redirect_to_zip_page(Req)
    end.

validate_password(Input)->
    Input == config:get_password().

zip(Req, DocRoot)->
    PostData = Req:parse_post(),
    FilePath = get_filepath(PostData),
    %% io:format("Path:~p~n",[FilePath]),
    case FilePath of 
	""->
	    redirect_to_zip_page(Req);
	FilePath->
	    ZipDirectory = lists:concat([DocRoot, "/zip/"]),
	    os:cmd("rm -f " ++ ZipDirectory ++ "*.zip"),
	    FileName = lists:concat(["/zip/",  eqweb_utility:now_to_string(), ".zip"]),
	    FullName = lists:concat([DocRoot, FileName]),
	    case eqweb_utility:compress(FullName, [FilePath]) of
		{ok, _}->
		    http_server:redirect(Req, FileName);
		_->
		    redirect_to_zip_page(Req)
	    end
    end.    

get_filepath(PostData)->
    case proplists:get_value("filepath", PostData) of
	[]->
	    config:get_filepath();
	FilePath ->
	    FilePath
    end.
redirect_to_zip_page(Req)->
    http_server:redirect(Req, "/zip/zip.html").

is_application_available()->
    DatabaseServer = config:get_database_server(),
    case net_adm:ping(DatabaseServer) of
	pong->
	    {ok, true};
	pang ->
	    {ok, false}
    end.

build_cb_query_string([])->
    "";
build_cb_query_string([{Key, Value}])->
    Key ++ "=" ++ Value;
build_cb_query_string(Queries)->
    [{Key, Value}|OtherQueries]=Queries,
    Key ++ "=" ++ Value ++ "&" ++ build_cb_query_string(OtherQueries).

%%
%% Tests
%%
-include_lib("eunit/include/eunit.hrl").
-ifdef(TEST).
-endif.
