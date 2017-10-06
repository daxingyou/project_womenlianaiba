%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%%
%%% @end
%%% Created : 18 Dec 2012 by LinZhengJian <linzhj@35info.cn>

-module(player_payment_return).

-export([start/1, handle_cast/2]).

-export([get_first_payment_return_status/1, save_first_payment_return/3]).
-export([save_single_payment_return/3]).
-export([save_total_payment_return/3]).
-compile(export_all).

-define(FIRST_PAYMENT_RETURN_TABLE, first_payment_return).
-define(SINGLE_PAYMENT_RETURN_TABLE, single_payment_return).
-define(TOTAL_PAYMENT_RETURN_TABLE, total_payment_return).

-include("packet_def.hrl").
-include("router.hrl").
-include("enum_def.hrl").
-include("common_def.hrl").
-include("tplt_def.hrl").
-include("records.hrl").
-include("sys_msg.hrl").
-include("house_data.hrl").

start(Account) ->	
    [
     router:make_event_source(?msg_req_first_payment_return_status, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_first_payment_return_reward, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_single_payment_return_reward, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_single_payment_return, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_total_payment_return_reward, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_total_payment_return, Account, {Account, ?MODULE})
    ].

handle_cast({#msg{src=Account}, #req_first_payment_return_status{}}, State) ->
    case get_first_payment_return_status(Account) of
	unreturned->
	    net_helper:send2client(Account, #notify_first_payment_return_status{returned=1});
	_->
	    net_helper:send2client(Account, #notify_first_payment_return_status{returned=0})
    end,
    {noreply, State};

handle_cast({#msg{src=Account}, #req_first_payment_return_reward{}}, State) ->
    FirstPaymentReturn = get_first_payment_return(Account),
    case get_first_payment_return_status(FirstPaymentReturn) of
	unreturned->
	    ReturnItems = common_def:get_val(first_payment_return_items),
	    ReturnDiamond = common_def:get_val(first_payment_return_diamond),
	    PlayerHouseId = db_pair_player:get_house_id(Account),
	    Fun = 
		fun()->
			HouseData = db_house:select(PlayerHouseId),
			HousePack = house_lover_package:get_lover_package(HouseData),
			{NewHousePack, ItemNotifyList} 
			    = case ReturnItems of 
				  []-> {HousePack, []};
				  _->
				      house_lover_package:add_items(ReturnItems, HousePack)
			      end,
			NewHouseData = house_lover_package:set_lover_package(NewHousePack, HouseData),
			
			DiamondHouseData =  house_diamond:add_diamond(ReturnDiamond, NewHouseData),
			db:write(DiamondHouseData),
			db:write(FirstPaymentReturn#first_payment_return{return_items=ReturnItems, return_date=calendar:local_time()}),
			{NewHouseData#house_data.boy, NewHouseData#house_data.girl, 
			 [#notify_lover_diamond{amount=house_diamond:get_lover_diamond(DiamondHouseData)}|ItemNotifyList]}
		end,
	    {Boy, Girl, MessageList} = db:transaction(Fun),
	    [begin net_helper:send2client(Boy, Message), net_helper:send2client(Girl, Message) end
	     || Message <- MessageList],
	    net_helper:send2client(Account, #notify_first_payment_return_reward{returned=1});    
	_->
	    net_helper:send2client(Account, #notify_first_payment_return_reward{returned=0})    
    end,
    {noreply, State};

handle_cast({#msg{src=Account}, #req_single_payment_return{}}, State)->
    #single_payment_return{return_items=ReturnItems} = get_single_payment_return(Account),
    All = tplt:get_all_data(single_payment_return_tplt),
    NotifyReturnItems = [#single_payment_return_item{return_diamond = Consume,
						     return_count=get_consume_count(Consume, ReturnItems)}
			 || #single_payment_return_tplt{consume_amount=Consume} <- All],
    net_helper:send2client(Account, #notify_single_payment_return{items=NotifyReturnItems}),
    {noreply, State};

handle_cast({#msg{src=Account}, #req_single_payment_return_reward{return_diamond=ReturnDiamond}}, State)->
    #single_payment_return{return_items=ReturnItems} = get_single_payment_return(Account),
    case ReturnItems of
	undefined->
	    net_helper:send2client(Account, #notify_single_payment_return_reward{returned=0});
	[] ->
	    net_helper:send2client(Account, #notify_single_payment_return_reward{returned=0});
	_->
	    case lists:keyfind(ReturnDiamond, 1, ReturnItems) of
		false->
		    net_helper:send2client(Account, #notify_single_payment_return_reward{returned=0});
		{ReturnDiamond, Count}->
		    give_awards(Account, ReturnDiamond, Count, ReturnItems)
	    end
    end,
    {noreply, State};


handle_cast({#msg{src=Account}, #req_total_payment_return{}}, State)->
    #total_payment_return{return_items=ReturnItems, total_amount=TotalAmount} = get_total_payment_return(Account),
    NotifyReturnItems = convert_to_total_notify_items(ReturnItems), 
    net_helper:send2client(Account, #notify_total_payment_return{items=NotifyReturnItems, total_amount=TotalAmount}),
    {noreply, State};

handle_cast({#msg{src=Account}, #req_total_payment_return_reward{consume_amount=ConsumeAmount}}, State)->
    TPR = get_total_payment_return(Account),
    #total_payment_return{return_items=ReturnItems} = TPR,
    case ReturnItems of
	[] ->
	    net_helper:send2client(Account, #notify_total_payment_return_reward{returned=0});
	_->
	    case lists:keyfind(ConsumeAmount, 1, ReturnItems) of
		{ConsumeAmount, PayDate, undefined}->
		    #total_payment_return_wrapper{return_diamond=ReturnDiamond, return_items=RuleReturnItems} 
			= get_total_payment_return_rule(ConsumeAmount),
		    PlayerHouseId = db_pair_player:get_house_id(Account),
		    HouseData = db_house:select(PlayerHouseId),
		    NewHouseData = house_diamond:add_diamond(ReturnDiamond, HouseData),
		    HousePack = house_lover_package:get_lover_package(NewHouseData),
		    {NewHousePack, MessageList} 
			= case ReturnItems of 
				  []-> {HousePack, []};
			      _->
				  house_lover_package:add_items(RuleReturnItems, HousePack)
			  end,
		    
		    NewReturnItems = [{ConsumeAmount, PayDate, calendar:local_time()}|lists:keydelete(ConsumeAmount, 1, ReturnItems)],
		    SPR = TPR#total_payment_return{return_items=NewReturnItems},
		    db:dirty_write(house_lover_package:set_lover_package(NewHousePack, NewHouseData)),
		    db:dirty_write(SPR),	
		    house_diamond:notify(NewHouseData),
		    [begin net_helper:send2client(NewHouseData#house_data.boy, Message), 
			   net_helper:send2client(NewHouseData#house_data.girl, Message) end || Message <- MessageList],
		    net_helper:send2client(Account, #notify_total_payment_return_reward{returned=1});
		_->
		    net_helper:send2client(Account, #notify_total_payment_return_reward{returned=0})
	    end
    end,
    {noreply, State};
handle_cast(_Request, State) ->
    {noreply, State}.

give_awards(Account, ReturnDiamond, Count, ReturnItems) ->
    PlayerHouseId = db_pair_player:get_house_id(Account),
    HouseData = db_house:select(PlayerHouseId),
    #single_payment_return_tplt{award_items=StrAwardItems}=
	tplt:get_data2(single_payment_return_tplt, ReturnDiamond),
    AwardItems = util:eval(binary_to_list(StrAwardItems) ++ "."),
    {NewHouseData, ItemMsgs} = award_items(AwardItems, Count, HouseData),
    NewReturnItems = lists:keydelete(ReturnDiamond, 1, ReturnItems),
    SPR = #single_payment_return{account=Account, return_items=NewReturnItems},
    db:dirty_write(NewHouseData),
    db:dirty_write(SPR),
    house_pack:send_msgs(ItemMsgs, NewHouseData),
    net_helper:send2client(Account, #notify_single_payment_return_reward{returned=1}).

award_items(AwardItems, Count, HouseData) ->
    L = [{ItemID, Count * ItemCount} ||{ItemID, ItemCount} <- AwardItems],
    house_pack:add_items(L, HouseData).

get_consume_count(Consume, ReturnItems) ->
    case lists:keyfind(Consume, 1, ReturnItems) of
	false -> 0;
	{_Amount, Count} -> Count
    end.

%% 首次返还
get_first_payment_return(Account)->
    case db:dirty_read(?FIRST_PAYMENT_RETURN_TABLE, Account) of
	[]->
	    #first_payment_return{account=Account};   
	 [FirstPaymentReturn]->
	    FirstPaymentReturn
    end.

get_first_payment_return_status(Account) when is_atom(Account)->
    get_first_payment_return_status(get_first_payment_return(Account));

get_first_payment_return_status(#first_payment_return{pay_date=undefined})->
    unpayed;

get_first_payment_return_status(#first_payment_return{return_items=undefined})->
    unreturned;

get_first_payment_return_status(_) ->
    returned.

save_first_payment_return(Account, _Amount, DateTime)->    
    FirstPaymentReturn = get_first_payment_return(Account),
    db:dirty_write(FirstPaymentReturn#first_payment_return{pay_date=DateTime}).
		  
get_single_payment_return(Account)->
    case db:dirty_read(?SINGLE_PAYMENT_RETURN_TABLE, Account) of
	[]->
	    #single_payment_return{account=Account, return_items=[]};   
	 [SinglePaymentReturn]->
	    SinglePaymentReturn
    end.    

save_single_payment_return(Account, Amount1, _DateTime)->
    #single_payment_return{return_items=ReturnItems} = get_single_payment_return(Account),
    {Amount, Cnt} = case Amount1 > 1000 of
			true -> {1000, Amount1 div 1000};
			false -> {Amount1, 1}
		    end,
    SPR =
	case lists:keyfind(Amount, 1, ReturnItems) of
	    false->
		#single_payment_return{account=Account, return_items=[{Amount, Cnt}|ReturnItems]};
	    {Amount, Count}->
		NewReturnItems = lists:keydelete(Amount, 1, ReturnItems),
		#single_payment_return{account=Account, return_items=[{Amount, Count + Cnt}|NewReturnItems]}
	end,
    db:dirty_write(SPR).


%% 总额返还
convert_to_total_notify_items(ReturnItems)->
    SPRTList = get_total_payment_return_rules(),
    Fun = fun(#total_payment_return_wrapper{consume_amount=ConsumeAmount, return_items=RuleReturnItems}, NAcc)->
		  case lists:keyfind(ConsumeAmount, 1, ReturnItems) of
		      {ConsumeAmount, _PayDateTime, undefined}->
			  [#total_payment_return_item{
			      consume_amount=ConsumeAmount, returned=1,
			      return_items = convert_to_lottery_items(RuleReturnItems)} | NAcc];
		      _->
			  [#total_payment_return_item{
			      consume_amount=ConsumeAmount, returned=0,
			      return_items = convert_to_lottery_items(RuleReturnItems)} | NAcc]
		  end
	  end,
    lists:foldr(Fun, [], SPRTList).

convert_to_lottery_items(ReturnItems)->
    [#lottery_item{item_id=ItemId, item_count=ItemCount} || {ItemId, ItemCount} <- ReturnItems].

convert_rule(#total_payment_return_tplt{consume_amount=ConumeAmount,
					  return_diamond=ReturnDiamond,
					  return_items=ReturnItems})->
    #total_payment_return_wrapper{consume_amount=ConumeAmount,
					  return_diamond=ReturnDiamond,
					  return_items=util:eval(binary_to_list(ReturnItems) ++ ".")}.

get_total_payment_return_rule(ReturnDiamond)->
    convert_rule(tplt:get_data(total_payment_return_tplt, ReturnDiamond)).

get_total_payment_return_rules()->
    TPRTList = tplt:get_all_data(total_payment_return_tplt),
    lists:reverse([convert_rule(Rule) || Rule <- TPRTList]).

calc_total_payment_return_rule(Amount, RewardAmount)->
    calc_total_payment_return_rule(Amount, get_total_payment_return_rules(), RewardAmount, []).

calc_total_payment_return_rule(_Amount, [#total_payment_return_wrapper{consume_amount=ConsumeAmount}], 
			       ConsumeAmount, RewardRuleAcc)->
    RewardRuleAcc;

calc_total_payment_return_rule(Amount, 
			       [#total_payment_return_wrapper{consume_amount=ConsumeAmount}=Rule], 
			       _RewardAmount, RewardRuleAcc)->
    case Amount >= ConsumeAmount of
	true->
	    [Rule | RewardRuleAcc];
	false->
	    RewardRuleAcc
    end;

calc_total_payment_return_rule(Amount, 
			       [#total_payment_return_wrapper{consume_amount=ConsumeAmount}=Rule|OtherRules], 
			       RewardAmount, RewardRuleAcc)->
    case Amount >= ConsumeAmount of
	true->
	    calc_total_payment_return_rule(Amount, OtherRules, RewardAmount, [Rule|RewardRuleAcc]);
	false->
	    calc_total_payment_return_rule(Amount, OtherRules, RewardAmount, RewardRuleAcc)
    end.

get_total_payment_return(Account)->
    case db:dirty_read(?TOTAL_PAYMENT_RETURN_TABLE, Account) of
	[]->
	    #total_payment_return{account=Account, return_items=[], total_amount=0, reward_amount=0};   
	 [TotalPaymentReturn]->
	    TotalPaymentReturn
    end.    

save_total_payment_return_rule([], TPR, _DateTime)->
    TPR;

save_total_payment_return_rule([#total_payment_return_wrapper{consume_amount=ConsumeAmount}], 
			       #total_payment_return{return_items=ReturnItems}=TPR, 
			       DateTime)->
    case lists:keyfind(ConsumeAmount, 1, ReturnItems) of
	false->
	    TPR#total_payment_return{reward_amount = ConsumeAmount,
				     return_items=[{ConsumeAmount, DateTime, undefined}|ReturnItems]};
	{ConsumeAmount, _PayDateTime, _ReturnDateTime}->	
	    TPR
	    %% TPR#total_payment_return{total_amount=TotalAmount+Amount}
    end;

save_total_payment_return_rule([#total_payment_return_wrapper{consume_amount=ConsumeAmount}|OtherRules], 
			       #total_payment_return{return_items=ReturnItems}=TPR, 
			       DateTime)->
    case lists:keyfind(ConsumeAmount, 1, ReturnItems) of
	false->
	    save_total_payment_return_rule(
	      OtherRules,
	      TPR#total_payment_return{reward_amount = ConsumeAmount,
				       return_items=[{ConsumeAmount, DateTime, undefined}|ReturnItems]},
	      DateTime);
	{ConsumeAmount, _PayDateTime, _ReturnDateTime}->	
	    save_total_payment_return_rule(
	      OtherRules,
	      TPR,
	      DateTime)
    end.

save_total_payment_return(Account, Amount, DateTime)->
    TPR = get_total_payment_return(Account),
    #total_payment_return{reward_amount=RewardAmount, total_amount=TotalAmount} = TPR,
    RewardRules = calc_total_payment_return_rule(Amount + TotalAmount, RewardAmount),
    NewTPR = save_total_payment_return_rule(RewardRules, TPR, DateTime),
    db:dirty_write(NewTPR#total_payment_return{total_amount=Amount + TotalAmount}).
