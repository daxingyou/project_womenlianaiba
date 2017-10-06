%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%% �û����
%%% @end
%%% Created : 17 Feb 2012 by LinZhengJian <linzhj@35info.cn>

-module(player_breakup).

-include("router.hrl").
-include("packet_def.hrl").
-include("player_data.hrl").
-include("house_data.hrl").
-include("enum_def.hrl").
-include("resource.hrl").
-include("sys_msg.hrl").
-include("records.hrl").
-include("tplt_def.hrl").

-export([start/1, handle_cast/2]).

start(Account)->
    [
     router:make_event_source(?msg_req_player_breakup, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_player_breakup_diamond, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_breakup, Account, {Account, ?MODULE})

    ].

handle_cast({#msg{event=?msg_req_player_breakup}, _Data}, #player_data{account=Account}=State) ->
    case db_player_breakup:select(Account) of
	#player_breakup{diamond=Diamond, unobtained_items=UnObtainedItems}->
	    NotifyPlayerBreakup = 
		#notify_player_breakup{account=Account, diamond=Diamond, unobtained_items=UnObtainedItems},
	    net_helper:send2client(Account, NotifyPlayerBreakup);
	_->
	    net_helper:send2client(Account, #notify_player_breakup_none{})
    end,
    {noreply, State};

handle_cast({#msg{event=?msg_req_player_breakup_diamond}, #req_player_breakup_diamond{}}, #player_data{account=Account}=State) ->
    case db_player_breakup:select(Account) of
	#player_breakup{diamond=DiamondAmount}->
	    HouseId = db_pair_player:get_house_id(Account),
	    HouseData = db_house:select(HouseId),
	    NHouseData = house_diamond:add_diamond(DiamondAmount, HouseData),
	    db:dirty_write(NHouseData),
	    db_player_breakup:delete(Account),
	    house_diamond:notify(NHouseData),
	    net_helper:send2client(Account, #notify_player_breakup_diamond{});
	_->
	    net_helper:send2client(Account, #notify_player_breakup_diamond{})
    end,
    {noreply, State};

handle_cast({#msg{event=?msg_req_breakup}, #req_breakup{expect_items=ExpectItems}}, #player_data{account=Account}=State) ->
    [PlayerBasicData] = db:dirty_read(player_basic_data, Account),
    HouseId = player_basic_data:get_house_id(PlayerBasicData),
    [HouseData] = db:dirty_read(house_data, HouseId),
    case breakup_validate(HouseData) of
	{error, single}->  %%�����޷����
	    ok;
	{error, unknow}->  %%δ֪�쳣
	    ok;
	ok->
	    notify_be_breakuped(Account, HouseData),
	    player_breakup_context:breakup(Account, ExpectItems, HouseData),
	    net_helper:send2client(Account, #notify_breakup_ack{}),
	    ok
    end,
    {noreply, State}.


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%
%  �ڲ�����
%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%%% @doc ��֤�Ƿ������������
breakup_validate(#house_data{boy=Boy, girl=Girl})->
    case {Boy, Girl} of
	{'', _Gril} -> %% ��û��Գɹ�
	    {error, single};
	{_Boy, ''} ->
	    {error, single};
	{Boy, Girl}->
	    ok;
	_Any ->
	    {error, unknow}
    end.


%%% @doc ֪ͨ�����
notify_be_breakuped(Boy, #house_data{boy=Boy, girl=Girl})->
    net_helper:send2client(Girl, #notify_player_be_breakuped{});

notify_be_breakuped(Girl, #house_data{boy=Boy, girl=Girl}) ->
    net_helper:send2client(Boy, #notify_player_be_breakuped{}).
    
