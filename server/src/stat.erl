%%%-------------------------------------------------------------------
%%% @author lyj <lyj@35info.cn>
%%% @copyright (C) 2012, lyj
%%% @doc
%%%  统计模块, 目前是把数据发到腾讯, 让腾讯统计
%%% @end
%%% Created : 22 Feb 2012 by lyj <lyj@35info.cn>
%%%-------------------------------------------------------------------
-module(stat).
-export([login/4, logout/5, create_player/4, level/5, add_item/5, dec_item/5, modify_exp/6, modify_coin/6, modify_fee/6]).
-export([get_server_ip/0]).

-define(extra,
	"&source=&touid=&toopenid=&level=&itemid=&itemtype=&itemcnt=&modifyexp=&totalexp="
	"&modifycoin=&totalcoin=&modifyfee=&totalfee=&onlinetime=&keycheckret=&safebuf=&remark=&user_num=").

-define(level, 101).      %% 等级变化
-define(add_item, 102).   %% 增加物品
-define(dec_item, 103).   %% 减少物品
-define(modify_exp, 104). %% 经验值发生变化
-define(modify_coin, 105).%% 虚拟币发生变化

-ifdef(debug).
login(_,_,_,_) ->
    ok.
logout(_,_,_,_,_) ->
    ok.
create_player(_,_,_,_) ->
    ok.
level(_,_,_,_,_) ->
    ok.
add_item(_,_,_,_,_) ->
    ok.
dec_item(_,_,_,_,_) ->
    ok.
modify_exp(_,_,_,_,_,_) ->
    ok.

modify_coin(_,_,_,_,_,_) ->
    ok. 
modify_fee(_,_,_,_,_,_) -> 
    ok.
get_server_ip() ->
	ok.

-else.

get_base(Domain, Account, ClientIP, Pid, OptType, ActionID) ->
    lists:concat(["http://tencentlog.com/stat/report.php?version=1&appid=35398&worldid=1",
		 "&domain=", transform_domain(Domain),                           %% 朋友平台为2, qzone为1
		 "&svrip=", get_server_ip(),
		 "&time=",datetime:get_unix_timestamp(now()),
		 "&opuid=", Account,                    
		 "&opopenid=", Account,                 
		 "&userip=", ip_to_int(ClientIP),       
		 "&key=", pid_to_list(Pid),             %% 可以传入进程ID, string类型
		 "&optype=", OptType,   %%支付类操作为1；留言发表类为2；写操作类为3；读操作类为4；其它为5
		 "&actionid=", ActionID %%操作ID，用来标识用户进行了哪种操作的ID。1~100 为保留字段，其中：登录为1；
                                        %%主动注册为2；接受邀请注册为3；邀请他人注册是4；支付消费为5。留言为6；留言回复为7；
                                        %%如有其它类型的留言发表类操作，请填8。用户登出为9；角色登录为11；创建角色为12；
                                        %%角色退出为13；角色实时在线为14。支付充值为15。
                                        %%其它操作请开发者使用100 以上的int型数据上报
		 ]).


%% 用户登录
login(Domain, Account, ClientIP, Pid) ->
    Url = get_base(Domain, Account, ClientIP, Pid, 4, 11) ++?extra,
    send(Url).

%% 用户登出
logout(Domain, Account, ClientIP, Pid, OnlineTime) ->
    Url = get_base(Domain, Account, ClientIP, Pid, 3, 9) ++ lists:concat(["&onlinetime=", OnlineTime]) ++
	"&source=&touid=&toopenid=&level=&itemid=&itemtype=&itemcnt=&modifyexp=&totalexp="
	"&modifycoin=&totalcoin=&modifyfee=&totalfee=&keycheckret=&safebuf=&remark=&user_num=",
    send(Url).

%% 创建角色
create_player(Domain, Account, ClientIP, Pid) ->
    Url = get_base(Domain, Account, ClientIP, Pid, 3, 12) ++?extra,
    send(Url).

%% 等级发生变化
level(Domain, Account, ClientIP, Pid, Level) ->
    Url = get_base(Domain, Account, ClientIP, Pid, 3, ?level) ++ lists:concat(["&level=", Level]) ++
	"&source=&touid=&toopenid=&itemid=&itemtype=&itemcnt=&modifyexp=&totalexp="
	"&modifycoin=&totalcoin=&modifyfee=&totalfee=&onlinetime=&keycheckret=&safebuf=&remark=&user_num=",
    send(Url).

%% 增加物品, 任何系统增加了物品, 都可以调用此接口
%% ItemList = [{ItemID, ItemType, ItemCount} | Rest]
%% ItemType为string类型, 可以提交utf8的中文命名类型
add_item(_Domain, _Account, _ClientIP, _Pid, []) ->
    ok;
add_item(Domain, Account, ClientIP, Pid, [{ItemID, ItemType, ItemCount} | Rest]) ->
    Url = get_base(Domain, Account, ClientIP, Pid, 3, ?add_item) ++ 
	lists:concat(["&itemid=", ItemID, "&itemtype=", ItemType, "&itemcnt=", ItemCount]) ++
	"&source=&touid=&toopenid=&level=&modifyexp=&totalexp="
	"&modifycoin=&totalcoin=&modifyfee=&totalfee=&onlinetime=&keycheckret=&safebuf=&remark=&user_num=",
    send(Url),
    add_item(Domain, Account, ClientIP, Pid, Rest).

%% 减少物品, 任何系统减少了物品, 都可以调用该接口, 例如道具的使用, 家具的摆放, 穿衣服等
%% ItemList = [{ItemID, ItemType, ItemCount} | Rest]
%% ItemType为string类型, 可以提交utf8的中文命名类型
dec_item(_Domain, _Account, _ClientIP, _Pid, []) ->
    ok;
dec_item(Domain, Account, ClientIP, Pid, [{ItemID, ItemType, ItemCount} | Rest]) ->
    Url = get_base(Domain, Account, ClientIP, Pid, 3, ?dec_item) ++ 
	lists:concat(["&itemid=", ItemID, "&itemtype=", ItemType, "&itemcnt=", ItemCount]) ++
	"&source=&touid=&toopenid=&level=&modifyexp=&totalexp="
	"&modifycoin=&totalcoin=&modifyfee=&totalfee=&onlinetime=&keycheckret=&safebuf=&remark=&user_num=",
    send(Url),
    add_item(Domain, Account, ClientIP, Pid, Rest).

%% 经验值发生变化
modify_exp(Domain, Account, ClientIP, Pid, ModifyExp, TotalExp) ->
    Url = get_base(Domain, Account, ClientIP, Pid, 3, ?modify_exp) ++ 
	lists:concat(["&modifyexp=", ModifyExp, "&totalexp", TotalExp]) ++
	"&source=&touid=&toopenid=&level=&itemid=&itemtype=&itemcnt="
	"&modifycoin=&totalcoin=&modifyfee=&totalfee=&onlinetime=&keycheckret=&safebuf=&remark=&user_num=",
    send(Url).

%% 虚拟币发生变化
modify_coin(Domain, Account, ClientIP, Pid, ModifyCoin, TotalCoin) ->
    Url = get_base(Domain, Account, ClientIP, Pid, 3, ?modify_coin) ++ 
	lists:concat(["&modifycoin=", ModifyCoin, "&totalcoin=", TotalCoin]) ++
	"&source=&touid=&toopenid=&level=&itemid=&itemtype=&itemcnt=&modifyexp=&totalexp="
	"&modifyfee=&totalfee=&onlinetime=&keycheckret=&safebuf=&remark=&user_num=",
    send(Url).

%% Q币发生变化,(单位为Q分)
modify_fee(Domain, Account, ClientIP, Pid, ModifyFee, TotalFee) ->
        Url = get_base(Domain, Account, ClientIP, Pid, 3, 5) ++ 
	lists:concat(["&modifyfee=", ModifyFee, "&totalfee=", TotalFee]) ++
	"&source=&touid=&toopenid=&level=&itemid=&itemtype=&itemcnt=&modifyexp=&totalexp="
	"&modifycoin=&totalcoin=&onlinetime=&keycheckret=&safebuf=&remark=&user_num=",
    send(Url).

send(Url) ->
    F = fun(Info) ->
		case Info of
		    {_ReqID, {error, Reason}} ->error_logger:error_msg("Error in stat.erl, Reason:~p.\n", [Reason]);
		    _ -> ok
		end
	end,
    case httpc:request(get, {Url, []}, [], [{sync, false}, {receiver, F}]) of
	{ok, _} -> ok;
	{error, Reason} -> error_logger:error_msg("Error in stat.erl, Reason:~p.\n", [Reason])
    end.

get_server_ip() ->
    case get(server_addr) of
	undefined ->
	    {ok, List} = inet:getifaddrs(),
	    Addrs = case lists:keysearch("eth0", 1, List) of
			{value, {_, L}} -> 
			    [Addr || {addr, Addr} <- L];
			false -> 
			    [{_, L} | _] = List,
			    [Addr || {addr, Addr} <- L]
		    end,
	    Addr2 = ip_to_int(hd(Addrs)),
	    put(server_addr, Addr2),
	    Addr2;
	Addr -> Addr
    end.

ip_to_int({A,B,C,D}) -> 
    (A*16777216)+(B*65536)+(C*256)+(D).

transform_domain("tapp") ->
    3;
transform_domain("pengyou") ->
    2;
transform_domain("qzone") ->
    1;
transform_domain(_) ->
    0.

-endif.
