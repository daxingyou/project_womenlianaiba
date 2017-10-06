%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2013, LinZhengJian
%%% @doc
%%%
%%% @end
%%% Created : 20 Feb 2013 by LinZhengJian <linzhj@35info.cn>

-module(channel_service).

-define(LOVE_CSI, channel_status_info).
-define(ChannelLimit, 200).

-include("records.hrl").
-include("common_def.hrl").

-export([start/0, create/3, delete/1]).

-export([enter/2, go_out/2, start_announce/3, stop_announce/2]).

-export([broadcast/2, broadcast/3, get_channel_list/0, get_status_info/1, get_channel/1]).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% start open api %%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% @doc
% @spec start()->ok.
% 启动频道服务
% 传入参数： 
% 返回值：ok
% @end
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
start()->
    % 创建频道状态表
    ets:new(?LOVE_CSI, [set, public, named_table]), 
    Channels = channel_db:all(),
    {List1, List0} = spilt_by_credit_level(Channels, {[], []}),
    ets:insert(?LOVE_CSI, {1, List1}),  %推荐频道列表
    ets:insert(?LOVE_CSI, {0, List0}),  %非推荐频道列表 
    ok.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% @doc
% @spec create(ChannelName, ChannelCredit)-> channel().
% 创建一个新频道
% 传入参数：频道名字，频道信誉值(0-非推荐，1-推荐) 
% 返回值：新创建的频道实体
% @end
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
create(ChannelName, Admin, ChannelCredit)->
    Id=guid:make(?st_channel),
    Channel=#channel_basic_info{id=Id, name=ChannelName, admin=Admin, credit_level=ChannelCredit},
    channel_db:insert(Channel),
    ChannelStatusInfo = get_status_info1(Channel),
    save_status_info(ChannelStatusInfo),
    Channel.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% @doc
% @spec delete(ChannelId)-> ok.
% 删除一个新频道
% 传入参数：频道Id
% 返回值：ok
% @end
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
delete(ChannelId)->
    channel_db:delete(ChannelId).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% @doc
% @spec enter(account, channelId)->ok|{false, Reason}.
% 用户进入频道
% 传入参数：用户Id，频道Id
% 返回值：ok-成功，{false, Reason}-失败
% @end
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
enter(Account, ChannelId)->
    %% 判断ChannelId 是否存在
    case channel_db:select(ChannelId) of 
	empty->
	    {false, 'error channel id'};
	ChannelBasicInfo->
	    %% 判断是否重复登陆
	    ChannelInfo = get_status_info1(ChannelBasicInfo),
	    #channel_status_info{audiences=Audiences, audience_count=AudienceCount}=ChannelInfo,
	    case lists:member(Account, Audiences) of
		true ->
		    {false, 'duplicate enter'};
		false ->
		    case AudienceCount >= ?ChannelLimit of
			true->
			    {false, 'audience overflow'};
			false->
			    save_status_info(ChannelInfo#channel_status_info{audiences=[Account|Audiences], 
									     audience_count=AudienceCount+1})
		    end
	    end
    end.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% @doc
% @spec go_out(account, channelId)->ok|{false, Reason}.
% 用户退出频道
% 传入参数：用户Id，频道Id
% 返回值：ok-成功，{false, Reason}-失败
% @end
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
go_out(Account, ChannelId)->
    %% 判断ChannelId 是否存在
    case channel_db:select(ChannelId) of 
	empty->
	    {false, 'error channel id'};
	ChannelBasicInfo->
	    ChannelInfo = get_status_info1(ChannelBasicInfo),
	    %% 判断是否重复退出
	    #channel_status_info{audiences=Audiences, audience_count=AudienceCount}=ChannelInfo,
	    case lists:member(Account, Audiences) of
		true ->
		    save_status_info(ChannelInfo#channel_status_info{audiences=lists:delete(Account, Audiences), audience_count=AudienceCount-1});
			false ->
		    {false, 'duplicate go out'}
	    end
    end.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% @doc
% @spec start_announce(account, channelId)->ok|{false, Reason}.
% 开播
% 传入参数：用户Id，频道Id
% 返回值：ok-成功，{false, Reason}-失败
% @end
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
start_announce(Account, ChannelId, RoomId)->
    case channel_db:select(ChannelId) of 
	empty->
	    {false, 'error channel id'};
	ChannelBasicInfo->
	    case ChannelBasicInfo of
		#channel_basic_info{admin=Account}->
		    ChannelStatusInfo = get_status_info1(ChannelBasicInfo),
		    save_status_info(ChannelStatusInfo#channel_status_info{live_status=1, extend_room_id=RoomId});
		_ ->
		    {false, 'unenough permissions'}
	    end
    end.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% @doc
% @spec stop_announce(account, channelId)->ok|{false, Reason}.
% 停播
% 传入参数：用户Id，频道Id
% 返回值：ok-成功，{false, Reason}-失败
% @end
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
stop_announce(Account, ChannelId)->
    case channel_db:select(ChannelId) of 
	empty->
	    {false, 'error channel id'};
	ChannelBasicInfo->
	    case ChannelBasicInfo of
		#channel_basic_info{admin=Account}->
		    ChannelStatusInfo = get_status_info1(ChannelBasicInfo),
		    save_status_info(ChannelStatusInfo#channel_status_info{live_status=0, extend_room_id=0});
		_ ->
		    {false, 'unenough permissions'}
	    end
    end.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% @doc 根据主播账号获取频道信息
% @spec get_channel(account)->empty|#channel_status_info{}.
% 停播
% 传入参数：主播Account
% 返回值：empty-不存在，#channel_status_info{}-存在
% @end
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
get_channel(AdminAccount)->
    get_channel1(AdminAccount, get_channel_list()).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% @doc
% @spec broadcast(ChannelId, MessageList, ExceptantList)->ok|{false, Reason}.
% 频道内广播
% 传入参数：频道Id, 消息或者消息列表, 例外列表
% 返回值：ok-成功，{false, Reason}-失败
% @end
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
broadcast(ChannelId, Message)->
    broadcast(ChannelId, [Message], []).

broadcast(ChannelId, MessageList, ExceptantList)->
    case channel_db:select(ChannelId) of 
	emtpy->
	    {false, 'error channel id'};
	ChannelBasicInfo->
	    #channel_status_info{audiences=Audiences} = get_status_info1(ChannelBasicInfo),
	    SendFun = 
		fun(Message, [])->
			[net_helper:send2client(Account, Message) || Account <- Audiences];
		   (Message, Exceptants)->
			[begin 
			     case lists:member(Account, Exceptants) of
				 true->
				     ok;
				 false->
				     net_helper:send2client(Account, Message) 
			     end
			 end || Account <- Audiences]
		end,

	    [SendFun(Message, ExceptantList) || Message <- MessageList]
    end.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% @doc
% @spec get_channel_list()->list(channel_status_info).
% 获取频道列表(只包含主播在线的)
% 传入参数：无
% 返回值：List of channel_status_info
% @end
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
get_channel_list()->
    [{1, List1}] = ets:lookup(?LOVE_CSI, 1),
    [{0, List0}] = ets:lookup(?LOVE_CSI, 0),
    StatusList1 = [StatusInfo || {_CID, StatusInfo} <- List1],
    StatusList0 = [StatusInfo || {_CID, StatusInfo} <- List0],
    lists:append(StatusList1, StatusList0).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% @doc
% @spec get_status_info()-> #channel_status_info{} | empty.
% 获取具体某个频道信息
% 传入参数：频道Id
% 返回值：相应频道的信息(存在)或者empty(不存在).
% @end
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
get_status_info(ChannelId)->
    case channel_db:select(ChannelId) of 
	empty->    
	    empty;
	ChannelBasicInfo->
	    get_status_info1(ChannelBasicInfo)
    end.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% @doc
% @spec get_status_info()-> #channel_status_info{} | empty.
% 在频道内送礼
% 传入参数：频道Id, 送礼人Account, 收礼人Account, 礼物Id, 礼物数量, 送礼时间
% 返回值：ok
% @end
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%giving_gift(ChannelId, Sender, Receiver, GiftId, Count, DateTime)->
%%    ok.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% @doc
% @spec get_status_info()-> #channel_status_info{} | empty.
% 在频道内送礼
% 传入参数：频道Id, 送礼人Account, 收礼人Account, 礼物Id, 礼物数量, 送礼时间
% 返回值：ok
% @end
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%get_gift_list()->
%%    [].

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% end open api %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% start intenal api %%%%%%%%%%%%%%%%%%%%%%%%%%
get_status_info1(#channel_basic_info{credit_level=CreditLevel, id=ChannelId}=ChannelBasicInfo)->
    [{_Credit, CSIList}] =  ets:lookup(?LOVE_CSI, CreditLevel),
    case lists:keyfind(ChannelId, 1, CSIList) of
	false->
	    #channel_status_info{channel_id=ChannelId, basic_info=ChannelBasicInfo, live_status=0, extend_room_id=0, audiences=[], audience_count=0};
	{ChannelId, ChannelStatusInfo}->
	    ChannelStatusInfo
    end.

save_status_info(#channel_status_info{basic_info=ChannelBasicInfo}=ChannelStatusInfo)->
    #channel_basic_info{credit_level=CreditLevel, id=ChannelId}=ChannelBasicInfo,
    case ets:lookup(?LOVE_CSI, CreditLevel) of
	[{CreditLevel, []}]->
	    ets:insert(?LOVE_CSI, {CreditLevel, [{ChannelId, ChannelStatusInfo}]});
	[{CreditLevel, CSIList}] ->
	    ets:insert(?LOVE_CSI, {CreditLevel, [{ChannelId, ChannelStatusInfo}|lists:keydelete(ChannelId, 1, CSIList)]})
    end,
    ok.

spilt_by_credit_level([], ListTuble)->
    ListTuble;
spilt_by_credit_level([#channel_basic_info{credit_level=1}=Channel], {List1, List0}) ->
    {[create_statu_by_basic(Channel)|List1],List0};
spilt_by_credit_level([#channel_basic_info{credit_level=0}=Channel], {List1, List0}) ->
    {List1, [create_statu_by_basic(Channel)|List0]};
spilt_by_credit_level([Channel|Channels], {List1, List0}) ->
    case Channel of
	#channel_basic_info{credit_level=0}->
	    spilt_by_credit_level(Channels, {List1, [create_statu_by_basic(Channel)|List0]});
	#channel_basic_info{credit_level=1}->
	    spilt_by_credit_level(Channels, {[create_statu_by_basic(Channel)|List1],List0})
    end.
    
create_statu_by_basic(#channel_basic_info{id=ChannelId}=ChannelBasicInfo)->
     {ChannelId, #channel_status_info{channel_id=ChannelId, basic_info=ChannelBasicInfo, live_status=0, extend_room_id=0, audiences=[], audience_count=0}}.


get_channel1(_Account, [])->
    empty;
get_channel1(Account, [ChannelStatusInfo|ChannelList]) ->
    #channel_status_info{basic_info=ChannelBasicInfo}=ChannelStatusInfo,
    case ChannelBasicInfo of
	#channel_basic_info{admin=Account}->
	    ChannelBasicInfo;
	_ ->
	    get_channel1(Account, ChannelList)    
    end.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% end intenal api %%%%%%%%%%%%%%%%%%%%%%%%%%%%
