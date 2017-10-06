%%%-------------------------------------------------------------------
%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%%
%%% @end
%%% Created : 26 Jun 2012 by LinZhengJian <linzhj@35info.cn>
%%%-------------------------------------------------------------------
-module(produce_context).

-include("produce_context.hrl").
-include("records.hrl").
-include("packet_def.hrl").
-include("resource.hrl").
-include("house_data.hrl").

-behaviour(gen_server).

%% API
-export([start_link/0]).

%% gen_server callbacks
-export([init/1, handle_call/3, handle_cast/2, handle_info/2,
	 terminate/2, code_change/3]).

-export([produce/2]).

-define(SERVER, ?MODULE). 

-record(state, {}).

%%%===================================================================
%%% API
%%%===================================================================

produce(Request, Callback)->
    gen_server:cast(?SERVER, {produce, {Request, Callback}}).

%%--------------------------------------------------------------------
%% @doc
%% Starts the server
%%
%% @spec start_link() -> {ok, Pid} | ignore | {error, Error}
%% @end
%%--------------------------------------------------------------------
start_link() ->
    gen_server:start_link({local, ?SERVER}, ?MODULE, [], []).

%%%===================================================================
%%% gen_server callbacks
%%%===================================================================

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Initializes the server
%%
%% @spec init(Args) -> {ok, State} |
%%                     {ok, State, Timeout} |
%%                     ignore |
%%                     {stop, Reason}
%% @end
%%--------------------------------------------------------------------
init([]) ->
    {ok, #state{}}.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Handling call messages
%%
%% @spec handle_call(Request, From, State) ->
%%                                   {reply, Reply, State} |
%%                                   {reply, Reply, State, Timeout} |
%%                                   {noreply, State} |
%%                                   {noreply, State, Timeout} |
%%                                   {stop, Reason, Reply, State} |
%%                                   {stop, Reason, State}
%% @end
%%--------------------------------------------------------------------
handle_call(_Request, _From, State) ->
    Reply = ok,
    {reply, Reply, State}.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Handling cast messages
%%
%% @spec handle_cast(Msg, State) -> {noreply, State} |
%%                                  {noreply, State, Timeout} |
%%                                  {stop, Reason, State}
%% @end
%%--------------------------------------------------------------------
handle_cast({produce, {Request, Callback}}, State) ->
    do_preduce(Request, Callback),
    {noreply, State};

handle_cast(_Msg, State) ->
    {noreply, State}.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Handling all non call/cast messages
%%
%% @spec handle_info(Info, State) -> {noreply, State} |
%%                                   {noreply, State, Timeout} |
%%                                   {stop, Reason, State}
%% @end
%%--------------------------------------------------------------------
handle_info(_Info, State) ->
    {noreply, State}.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% This function is called by a gen_server when it is about to
%% terminate. It should be the opposite of Module:init/1 and do any
%% necessary cleaning up. When it returns, the gen_server terminates
%% with Reason. The return value is ignored.
%%
%% @spec terminate(Reason, State) -> void()
%% @end
%%--------------------------------------------------------------------
terminate(_Reason, _State) ->
    ok.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Convert process state when code is changed
%%
%% @spec code_change(OldVsn, State, Extra) -> {ok, NewState}
%% @end
%%--------------------------------------------------------------------
code_change(_OldVsn, State, _Extra) ->
    {ok, State}.

%%%===================================================================
%%% Internal functions
%%%===================================================================
-spec do_preduce(#produce_request{}, function()) -> ok.
do_preduce(#produce_request{account=Account, produce_manual_id=ManualInstanceId}=Request, 
	   Callback)->
    [PlayerBasicData] = db:dirty_read(player_basic_data, Account),
    try
	HouseId = player_basic_data:get_house_id(PlayerBasicData),
	HouseData = db_house:select(HouseId),
	HousePackage = house_lover_package:get_lover_package(HouseData),
	#item{template_id=ItemId} = 
	    case 
		house_lover_package:get_item(ManualInstanceId, HousePackage)
	    of
		{false, _Reason}->
		    throw({validate, manual});
		Item->
		    Item
	    end,
	ProduceManual= produce_manual:get(ItemId),
	
	try
	    producing(
	      reduce_insurancestone(                                                   	      % 扣除完璧符
		reduce_luckystone(                                                            % 扣除幸运符
		  reduce_materia(                                                             % 扣除原材料
		    reduce_diamond(                                                            % 扣除合成图谱
		      reduce_manual(                                                         % 扣除水晶
			check_level({new, Request, ProduceManual, PlayerBasicData, HouseData}) 	% 校验等级
		       )
		     )
		   )
		 )
	       )
	     ) of
	    {{produce_success, ResultItem}, _ProduceRequest, _ProduceManual, NewPlayerBasicData, _HouseData}->
		router:cast(Account, on_produce_context_success, item:get_tempid(ResultItem)),
		Callback(#produce_response{request=Request, status=1, result_item=ResultItem,  
					   message=?produce_success, player=NewPlayerBasicData});
	{produce_failure, _ProduceRequest, _ProduceManual, NewPlayerBasicData, _HouseData}->
		Callback(#produce_response{request=Request, status=0, message=?produce_failure,
					   player=NewPlayerBasicData})
	catch
	    throw:{validate, level}->  %%直接返回
		Callback(#produce_response{request=Request, status=2, message=?produce_fail_level, player=PlayerBasicData}); 
	    throw:{validate, manual}->  %%直接返回
		Callback(#produce_response{request=Request, status=2, message=?produce_fail_money, player=PlayerBasicData}); 
	    throw:{validate, money}-> %%返配方
		do_revert([fun revert_manual/3], Request, HouseId, ProduceManual),
		Callback(#produce_response{request=Request, status=2, message=?produce_fail_manual}); 
	    throw:{validate, material}-> %%返还水晶和配方
    	    do_revert([fun revert_money/3, fun revert_manual/3], Request, HouseId, ProduceManual),
		Callback(#produce_response{request=Request, status=2, message=?produce_fail_material, player=PlayerBasicData}); 
	    throw:{validate, luckystone}-> %%返还水晶，材料和配方
		do_revert([fun revert_money/3, fun revert_material/3, fun revert_manual/3], Request, HouseId, ProduceManual),
		Callback(#produce_response{request=Request, status=2, message=?produce_fail_luckystone, player=PlayerBasicData}); 
	    throw:{validate, insurancestone}-> %%返还水晶，材料，配方和幸运符
		do_revert([fun revert_money/3, fun revert_material/3, fun revert_manual/3, fun revert_luckystone/3], Request, HouseId, ProduceManual),
		Callback(#produce_response{request=Request, status=2, message=?produce_fail_insurancestone, player=PlayerBasicData}); 
	    %% throw:{validate, money}->
	    %%     ok;
	    Type:Error-> %%返还全部
		data_helper:format("Type:~p~nError:~p~nDetail:~p~n",[Type, Error, erlang:get_stacktrace()]),
		do_revert([fun revert_money/3, fun revert_material/3, fun revert_manual/3, fun revert_luckystone/3, fun revert_insurancestone/3], Request, HouseId, ProduceManual),
		Callback(#produce_response{request=Request, status=2, message=?produce_failure_unkow, player=PlayerBasicData})
	end
    catch
	throw:{validate, manual}->  %%直接返回
	    Callback(#produce_response{request=Request, status=2, message=?produce_fail_money, player=PlayerBasicData});  
	_:_->
	    Callback(#produce_response{request=Request, status=2, message=?produce_failure_unkow, player=PlayerBasicData})
    end.

%% 扣除物品
check_level({new, ProduceRequest, ProduceManual, PlayerBasicData, HouseData})->
    %% 校验等级
    case  PlayerBasicData#player_basic_data.produce_level >= ProduceManual#produce_manual.produce_level of
	true-> % 允许的合成等级
	    {level_enable, ProduceRequest, ProduceManual, PlayerBasicData, HouseData};
	false->
	    throw({validate, level})
    end.

%% 扣除水晶
reduce_diamond({manual_enable, ProduceRequest, ProduceManual, PlayerBasicData, #house_data{}=HouseData})->
    TotalDiamond = house_diamond:get_lover_diamond(HouseData),
    ConsumeDiamond = ProduceManual#produce_manual.consume_diamond,
    case TotalDiamond >= ConsumeDiamond of 
	true->
	    NewHouseData = house_diamond:dec_diamond(ConsumeDiamond, HouseData),
	    db:dirty_write(NewHouseData),
	    house_diamond:notify(NewHouseData),
	    {diamond_enable, ProduceRequest, ProduceManual, PlayerBasicData, NewHouseData};
	false->
	    throw({validate, money})
    end.

%% 扣除手册
reduce_manual({level_enable, ProduceRequest, ProduceManual, PlayerBasicData, HouseData})->
    ManualInstanceId = ProduceRequest#produce_request.produce_manual_id,
    case house_pack:del_items([ManualInstanceId], HouseData) of
	{false, _Reason1}->
	    throw({validate, manual});
	 {NewHouseData, MessageList} ->
	    send2client(HouseData, MessageList),
	    db:dirty_write(NewHouseData),
	    {manual_enable, ProduceRequest, ProduceManual, PlayerBasicData, NewHouseData}
    end.

%% 扣除原材料
reduce_materia({diamond_enable, ProduceRequest, ProduceManual, PlayerBasicData, HouseData})->
    MaterialItems=ProduceManual#produce_manual.material_item,
    case house_lover_package:del_n_by_tempid(MaterialItems, house_lover_package:get_lover_package(HouseData)) of
	{false, _Reason}->
	    throw({validate, material});
	{NewPack, MessageList} ->
	    send2client(HouseData, MessageList),
	    NewHouseData = house_lover_package:set_lover_package(NewPack, HouseData),
	    db:dirty_write(NewHouseData),
	    {materia_enable, ProduceRequest, ProduceManual, PlayerBasicData, house_lover_package:set_lover_package(NewPack, NewHouseData)}
    end.

%% 扣除幸运符
reduce_luckystone({materia_enable, ProduceRequest, ProduceManual, PlayerBasicData, HouseData})->
    LockyStoneItemId = common_def:get_val(luckystone_itemid),
    LuckyStoneCount = ProduceRequest#produce_request.lucky_stone_count,
    case LuckyStoneCount > 0 of
	true->
	    case house_lover_package:del_n_by_tempid([{LockyStoneItemId, LuckyStoneCount}], house_lover_package:get_lover_package(HouseData)) of
		{false, _Reason2}->
		    throw({validate, luckystone});
		{NewPack, MessageList} ->
		    send2client(HouseData, MessageList),
		    NewHouseData = house_lover_package:set_lover_package(NewPack, HouseData),
		    db:dirty_write(NewHouseData),
		    {luckystone_enable, ProduceRequest, ProduceManual, PlayerBasicData, NewHouseData}
	    end;
	false ->
	    {luckystone_enable, ProduceRequest, ProduceManual, PlayerBasicData, HouseData}
    end.

%% 扣除完璧符
reduce_insurancestone({luckystone_enable, ProduceRequest, ProduceManual, PlayerBasicData, HouseData})->
    HasInsurance = ProduceRequest#produce_request.has_insurance,
    InsuranceItemId = common_def:get_val(insurancestone_itemid),
    case HasInsurance of
	true->
	    case house_lover_package:del_n_by_tempid([{InsuranceItemId, 1}], house_lover_package:get_lover_package(HouseData)) of
		{false, _Reason3}->
		    throw({validate, insurancestone});
		{NewPack, MessageList} ->
		    send2client(HouseData, MessageList),
		    NewHouseData = house_lover_package:set_lover_package(NewPack, HouseData),
		    db:dirty_write(NewHouseData),
		    {insurancestone_enable, ProduceRequest, ProduceManual, PlayerBasicData, NewHouseData}

	    end;
	false ->
	    {insurancestone_enable, ProduceRequest, ProduceManual, PlayerBasicData, HouseData}
    end.

%% 合成
producing({Status, ProduceRequest, ProduceManual, PlayerBasicData, HouseData})->
    after_produce(
      do_produce(
	before_produce({Status, ProduceRequest, ProduceManual, PlayerBasicData, HouseData})
       )
     ).

before_produce({Status, ProduceRequest, ProduceManual, PlayerBasicData, HouseData})->
    use_luckystone({Status, ProduceRequest, ProduceManual, PlayerBasicData, HouseData}).

do_produce({before_produce, ProduceRequest, ProduceManual, PlayerBasicData, HouseData})->
    SuccessRate = ProduceManual#produce_manual.success_rate,
    Hitting = rand:uniform() * 100,
    Status = 
	case SuccessRate >= Hitting of % true-> %成功, false-> %失败
	    true->
		produce_success;
	    false->
		produce_failure
	end,
    {Status, ProduceRequest, ProduceManual, PlayerBasicData, HouseData}.

after_produce({Status, ProduceRequest, ProduceManual, PlayerBasicData, HouseData})->
    use_insurancestone({Status, ProduceRequest, ProduceManual, PlayerBasicData, HouseData}).

use_luckystone({insurancestone_enable, ProduceRequest, ProduceManual, PlayerBasicData, HouseData})->
    LuckyStoneCount = ProduceRequest#produce_request.lucky_stone_count,
    SuccessRate = ProduceManual#produce_manual.success_rate,
    LuckystoneValue = common_def:get_val(luckystone_value),
    FinalSuccessRate = 
	case LuckyStoneCount of
	    Count when is_integer(Count)->
		SuccessRate + LuckystoneValue * Count;
	    _->
		SuccessRate
	end,
    {before_produce, ProduceRequest, ProduceManual#produce_manual{success_rate=FinalSuccessRate}, PlayerBasicData, HouseData}.

use_insurancestone({Status, ProduceRequest, ProduceManual, PlayerBasicData, HouseData})->
    HasInsurance = ProduceRequest#produce_request.has_insurance,
    FinishedItemId = rate:hit(ProduceManual#produce_manual.finished_item),
    PlayerProduceLevel = PlayerBasicData#player_basic_data.produce_level,
    ProduceLevel = ProduceManual#produce_manual.produce_level,
    Experience = PlayerBasicData#player_basic_data.produce_experience,
    MaterialItems=ProduceManual#produce_manual.material_item,
    case Status of
	produce_success -> %成功
	    %% 送出合成的物品
	    Charm = case player_charm:get_charm_by_itemid(FinishedItemId) of
			{MinCharm, MaxCharm}->
			    rand:uniform(MinCharm, MaxCharm);
			FixCharm->
			    FixCharm
		    end,    
	    {{NewPack, MessageList}, FinishedItem}
		= case Charm of
		      null->
			  {house_lover_package:add_items([{FinishedItemId, 1}], house_lover_package:get_lover_package(HouseData)), item:make_item(FinishedItemId)};
		      0->
			  {house_lover_package:add_items([{FinishedItemId, 1}], house_lover_package:get_lover_package(HouseData)), item:make_item(FinishedItemId)};
		      _->
			  FItem = item:make_item(FinishedItemId, [#item_property{key="charm", value=Charm}]),
			  {house_lover_package:add_items([FItem], house_lover_package:get_lover_package(HouseData)), FItem}
		  end,
	    send2client(HouseData, MessageList),
	    NewHouseData = house_lover_package:set_lover_package(NewPack, HouseData),
	    db:dirty_write(NewHouseData),
	    %% 添加经验
	    MaxLevel = common_def:get_val(max_produce_level),

	    case PlayerProduceLevel == ProduceLevel andalso PlayerProduceLevel < MaxLevel  of
	    	true->
		    {NewPlayerProduceLevel, NewExperience}=	   
			produce_level:add_experience({PlayerProduceLevel, Experience}, 
						     ProduceManual#produce_manual.experience),
		    NewPlayerBasicData = PlayerBasicData#player_basic_data{produce_experience=NewExperience,
									 produce_level=NewPlayerProduceLevel},
		    db:dirty_write(NewPlayerBasicData),
		    {{produce_success, FinishedItem}, ProduceRequest, ProduceManual, NewPlayerBasicData, NewHouseData};
	    	false->
	    	    {{produce_success, FinishedItem}, ProduceRequest, ProduceManual, PlayerBasicData, NewHouseData}
	    end;
	produce_failure->
	    case HasInsurance of %使用完璧符，退还原材料
		true->
		    %% 返还物品
		    {NewPack, MessageList} =  house_lover_package:add_items(MaterialItems, house_lover_package:get_lover_package(HouseData)),
		    send2client(HouseData, MessageList),
		    NewHouseData = house_lover_package:set_lover_package(NewPack, HouseData),
		    db:dirty_write(NewHouseData),
		    {produce_failure, ProduceRequest, ProduceManual, PlayerBasicData, NewHouseData};
		false->
		    {produce_failure, ProduceRequest, ProduceManual, PlayerBasicData, HouseData}
	    end
	end.

%% 合成失败退货
do_revert([], _Request, _HouseId, _Manual)->
    ok;
do_revert([Function|Functions], Request, HouseId, Manual) ->
    Function(Request, HouseId, Manual),
    do_revert(Functions, Request, HouseId, Manual). 

revert_money(#produce_request{}, HouseId, #produce_manual{consume_diamond=ConsumeDiamond})->
    HouseData = db_house:select(HouseId),
    NewHouseData = house_diamond:add_diamond(ConsumeDiamond, HouseData),
    db:dirty_write(NewHouseData),
    house_diamond:notify(NewHouseData),
    ok.

revert_material(#produce_request{}, HouseId, #produce_manual{material_item=MaterialItems})->
    HouseData = db_house:select(HouseId),
    {NewPack, MessageList} = house_lover_package:add_items(MaterialItems, house_lover_package:get_lover_package(HouseData)),
    send2client(HouseData, MessageList),
    db:dirty_write(house_lover_package:set_lover_package(NewPack, HouseData)),
    ok.

revert_manual(#produce_request{}, HouseId, #produce_manual{item_id=ItemId})->
    HouseData = db_house:select(HouseId),
    {NewPack, MessageList} = house_lover_package:add_items([{ItemId, 1}], house_lover_package:get_lover_package(HouseData)),
    send2client(HouseData, MessageList),
    db:dirty_write(house_lover_package:set_lover_package(NewPack, HouseData)),
    ok.

revert_luckystone(#produce_request{lucky_stone_count=LuckyStoneCount}, HouseId, #produce_manual{})->
    LockyStoneItemId = common_def:get_val(luckystone_itemid),
    HouseData = db_house:select(HouseId),
    {NewPack, MessageList} = house_lover_package:add_items([{LockyStoneItemId, LuckyStoneCount}], house_lover_package:get_lover_package(HouseData)),
    send2client(HouseData, MessageList),
    db:dirty_write(house_lover_package:set_lover_package(NewPack, HouseData)),
    ok.

revert_insurancestone(#produce_request{has_insurance=HasInsurance}, HouseId, #produce_manual{})->
    case HasInsurance of
	true->
	    InsuranceItemId = common_def:get_val(insurancestone_itemid),
	    HouseData = db_house:select(HouseId),
	    {NewPack, MessageList} = house_lover_package:add_items([{InsuranceItemId, 1}], house_lover_package:get_lover_package(HouseData)),
	    send2client(HouseData, MessageList),
	    db:dirty_write(house_lover_package:set_lover_package(NewPack, HouseData)),
	    ok;
	false->
	    ok
    end.


%% 发送消息到客户端
send2client(#house_data{boy=Boy, girl=Girl}, MessageList)->
    [begin
	 net_helper:send2client(Boy, Message),
	 net_helper:send2client(Girl, Message)
     end || Message <- MessageList].
