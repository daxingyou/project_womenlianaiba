%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% 玩家事件
%%% @end
%%% Created : 26 Jun 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(event_center).

-include("packet_def.hrl").
-include("enum_def.hrl").
-include("router.hrl").
-include("tplt_def.hrl").

%% API
-export([start/1]).
-export([handle_cast/2]).

%%%===================================================================
%%% API
%%%===================================================================
start(Account) ->
    [router:make_event_source(water_flower_event, Account, {self(), ?MODULE}),       %% 给自己浇水
     router:make_event_source(create_checkin_event, Account, {self(), ?MODULE}),     %% 写爱情日志
     router:make_event_source(create_guest_book_event, Account, {self(), ?MODULE}),  %% 写留言
     router:make_event_source(view_checkin_event, Account, {self(), ?MODULE}),       %% 查看爱情日记
     router:make_event_source(create_party_event, Account, {self(), ?MODULE}),       %% 创建派对
     router:make_event_source(buy_goods_event, Account, {self(), ?MODULE}),          %% 购买物品
     router:make_event_source(add_attention_event, Account, {self(), ?MODULE}),      %% 增加关注
     router:make_event_source(view_person_info_event, Account, {self(), ?MODULE}),   %% 查看个人资料
     router:make_event_source(close_person_info_event, Account, {self(), ?MODULE}),   %% 查看个人资料
     router:make_event_source(enter_house_event, Account, {self(), ?MODULE}),        %% 进入别人房屋
     router:make_event_source(change_goods_event, Account, {self(), ?MODULE}),       %% 更换物品
     router:make_event_source(polymorph_event, Account, {self(), ?MODULE}),          %% 使用物品变身
     router:make_event_source(be_polymorph_event, Account, {self(), ?MODULE}),       %% 被使用物品变身
     router:make_event_source(add_hp_event, Account, {self(), ?MODULE}),             %% 增加体力
     router:make_event_source(chat_world_event, Account, {self(), ?MODULE}),         %% 发送爱情小喇叭
     router:make_event_source(?msg_req_complete_share, Account, {self(), ?MODULE}),  %% 完成分享
     router:make_event_source(house_level_up, Account, {self(), ?MODULE}),           %% 房屋等级提升
     router:make_event_source(?msg_req_move_camera, Account, {self(), ?MODULE}),     %% 移动镜头
     router:make_event_source(?msg_req_move_player, Account, {self(), ?MODULE}),     %% 移动玩家
     router:make_event_source(on_search_finish, Account, {self(), ?MODULE}),         %% 完成收集
     router:make_event_source(on_change_house, Account, {self(), ?MODULE}),          %% 换房屋
     router:make_event_source(on_buy_house, Account, {self(), ?MODULE}),             %% 购买房屋
     router:make_event_source(on_hire_friend, Account, {self(), ?MODULE}),           %% 雇佣好友
     router:make_event_source(on_hire_npc, Account, {self(), ?MODULE}),              %% 雇佣npc
     router:make_event_source(on_buy_goods_from_sysshop, Account, {self(), ?MODULE}),%% 系统商城购买
     router:make_event_source(on_produce_context_success, Account, {self(), ?MODULE}),%% 成功合成物品
     router:make_event_source(on_plant_crop_success, Account, {self(), ?MODULE}),    %% 种植成功
     router:make_event_source(on_daily_task_reward, Account, {self(), ?MODULE}),     %% 每日任务奖励
     router:make_event_source(on_chain_task_reward, Account, {self(), ?MODULE}),     %% 链式任务奖励
     router:make_event_source(on_pick_up_success, Account, {self(), ?MODULE}),       %% 收获成功
     router:make_event_source(on_water_success, Account, {self(), ?MODULE}),         %% 浇水
     router:make_event_source(on_fertilize_success, Account, {self(), ?MODULE}),     %% 施肥
     router:make_event_source(?msg_req_close_daily_reward_ui, Account, {self(), ?MODULE}),%% 开过每日任务窗口 
     router:make_event_source(on_whip_player_success, Account, {self(), ?MODULE}),   %% 鞭打
     router:make_event_source(on_click_sprite, Account, {self(), ?MODULE}),          %% 点击小精灵
     router:make_event_source(on_unlock_flowerpot, Account, {self(), ?MODULE}),      %% 解锁花盆
     router:make_event_source(?msg_req_open_daily_task_ui, Account, {self(), ?MODULE}), %% 打开每日任务界面
     router:make_event_source(?msg_req_close_daily_task_ui, Account, {self(), ?MODULE}),%% 关闭每日任务界面
     router:make_event_source(on_mutli_item_upgrade, Account, {self(), ?MODULE}),
     router:make_event_source(on_flower_shake, Account, {self(), ?MODULE}),          %% 花藤摇一摇
     router:make_event_source(on_start_mind_quiz, Account, {self(), ?MODULE}),       %% 开始智力闯关
     router:make_event_source(on_player_exchange, Account, {self(), ?MODULE}),       %% 玩家兑换
     router:make_event_source(on_click_large_sprite, Account, {self(), ?MODULE}),    %% 点击大精灵
     router:make_event_source(on_click_small_sprite, Account, {self(), ?MODULE}),    %% 点击小精灵
     router:make_event_source(on_daily_active_reward, Account, {self(), ?MODULE}),   %% 每日活跃奖励
     router:make_event_source(on_party_add_point, Account, {self(), ?MODULE}),       %% 派对自动获取积分
     router:make_event_source(on_decoration_change, Account, {self(), ?MODULE}),     %% 豪华度变化
     router:make_event_source(on_player_charm_change, Account, {self(), ?MODULE}),   %% 魅力值变化
     router:make_event_source(on_enter_self_home, Account, {self(), ?MODULE}),       %% 进入自己房屋
     router:make_event_source(?msg_req_close_windows, Account, {self(), ?MODULE}),   %% 关闭界面
     router:make_event_source(make_product_event, Account, {self(), ?MODULE}),       %% 食物开始制作
     router:make_event_source(complete_product_event, Account, {self(), ?MODULE}),   %% 食物制作成功
     router:make_event_source(click_guest_event, Account, {self(), ?MODULE}),        %% 点击带星星的客人
     router:make_event_source(unlock_food_event, Account, {self(), ?MODULE}),        %% 解锁食物
     router:make_event_source(expand_food_stock_event, Account, {self(), ?MODULE}),  %% 开始扩库存
     router:make_event_source(complete_expand_food_stock_event, Account, {self(), ?MODULE}),   %% 扩库存成功
     router:make_event_source(expand_produce_area_event, Account, {self(), ?MODULE}) %% 解锁料理台
    ].


%%%===================================================================
%%% Handle cast
%%%===================================================================
handle_cast({#msg{event=water_flower_event, src=Account}, HouseId}, State)->
    OwnerHouseId = player_data:get_house_id(State),
    case OwnerHouseId == HouseId of
	true ->
	    do_event(Account, water_self_flower_event, HouseId);
	false ->
	    do_event(Account, water_other_flower_event, HouseId)
    end,
    {noreply, State};
handle_cast({#msg{event=create_checkin_event, src=Account}, HouseId}, State)->
    case player:is_single(State) of
	true ->
	    do_event(Account, create_single_checkin_event, HouseId);
	false ->
	    do_event(Account, create_pair_checkin_event, HouseId)
    end,
    {noreply, State};
handle_cast({#msg{event=create_guest_book_event, src=Account}, HouseId}, State)->
    OwnerHouseId = player_data:get_house_id(State),
    case OwnerHouseId == HouseId of
	true ->
	    do_event(Account, create_self_guest_book_event, HouseId);
	false ->
	    do_event(Account, create_other_guest_book_event, HouseId)
    end,
    {noreply, State};
handle_cast({#msg{event=view_checkin_event, src=Account}, HouseId}, State)->
    OwnerHouseId = player_data:get_house_id(State),
    case OwnerHouseId == HouseId of
	true ->
	    do_event(Account, view_self_checkin_event, HouseId);
	false ->
	    do_event(Account, view_other_checkin_event, HouseId)
    end,
    {noreply, State};
handle_cast({#msg{event=create_party_event, src=Account}, HouseId}, State) ->
    do_event(Account, create_party_event, HouseId),
    {noreply, State};
handle_cast({#msg{event=add_attention_event, src=Account}, AttentionAcc}, State) ->
    do_event(Account, add_attention_event, AttentionAcc),
    {noreply, State};
handle_cast({#msg{event=view_person_info_event, src=Account}, PersonAcc}, State) ->
    case Account == PersonAcc of
	true ->
	    do_event(Account, view_self_person_info_event, PersonAcc);
	false ->
	    do_event(Account, view_other_person_info_event, PersonAcc)
    end,
    {noreply, State};
handle_cast({#msg{event=close_person_info_event, src=Account}, _Account}, State) ->
    do_event(Account, close_person_info_event, Account),
    {noreply, State};
handle_cast({#msg{event=enter_house_event, src=Account}, {Type, HouseId}}, State) ->
    OwnerHouseId = player_data:get_house_id(State),
    case OwnerHouseId == HouseId of
	true ->
	    do_event(Account, enter_self_house_event, HouseId);
	false ->	    
	    case Type of
		?eht_party ->       %% 从派对进
		    do_event(Account, enter_house_from_party_event, HouseId);
		?eht_photo_friend ->%% 从照片交友进
		    do_event(Account, enter_house_from_photo_friend_event, HouseId);
		?eht_friend_list -> %% 从好友列表进
		    do_event(Account, enter_house_from_friend_list_event, HouseId);
		?eht_attention ->   %% 从关注进
		    do_event(Account, enter_house_from_attention_event, HouseId);
		?eht_guest_book ->  %% 从留言板进
		    do_event(Account, enter_house_from_guest_book_event, HouseId);
		?eht_menu ->        %% 从环形菜单进
		    do_event(Account, enter_house_from_menu_event, HouseId);
		?eht_wish ->        %% 从许愿单进
		    do_event(Account, enter_house_from_wish_event, HouseId);
		?eht_person_info -> %% 从个人资料进
		    do_event(Account, enter_house_from_person_info_event, HouseId);
		?eht_visit_log ->   %% 从好友访问记录进
		    do_event(Account, enter_house_from_visit_log_event, HouseId);
		?eht_ranking_list ->
		    do_event(Account, enter_house_from_ranking_list_event, HouseId);
		?eht_yy_audio ->
		    do_event(Account, event_house_from_yy_audio_event, HouseId)
	    end
    end,
    {noreply, State};
handle_cast({#msg{event=buy_goods_event, src=Account}, ItemList}, State) ->
    do_buy_item(Account, ItemList),
    {noreply, State};
handle_cast({#msg{event=change_goods_event, src=Account}, ItemList}, State) -> 
    do_change_goods(Account, ItemList),
    {noreply, State};
handle_cast({#msg{event=polymorph_event, src=Account}, {_TargetAccount, PolymorphId}}, State) ->
    do_event(Account, polymorph_event, PolymorphId),
    {noreply, State};
handle_cast({#msg{event=be_polymorph_event, src=Account}, {_TargetAccount, PolymorphId}}, State) ->
    do_event(Account, be_polymorph_event, PolymorphId),
    {noreply, State};
handle_cast({#msg{event=add_hp_event, src=Account}, TargetAccount}, State) ->
    do_event(Account, add_hp_event, TargetAccount),
    {noreply, State};
handle_cast({#msg{event=chat_world_event, src=Account}, _Conent}, State) ->
    do_event(Account, chat_world_event, Account),
    {noreply, State};
handle_cast({#msg{src=Account}, #req_complete_share{type=Type}}, State) ->
    do_event(Account, share_event, Type),
    {noreply, State};
handle_cast({#msg{event=house_level_up, src=Account}, Level}, State) ->
    do_event(Account, house_level_up, Level),
    {noreply, State};
handle_cast({#msg{src=Account}, #req_move_camera{}}, State) -> 
    do_event(Account, on_move_camera, Account),
    {noreply, State};
handle_cast({#msg{src=Account}, #req_move_player{}}, State) -> 
    do_event(Account, on_move_player, Account),
    {noreply, State};
handle_cast({#msg{event=on_search_finish, src=Account}, Account}, State) ->
    do_event(Account, on_search_finish, Account),
    {noreply, State};
handle_cast({#msg{event=on_change_house, src=Account}, HouseLevel}, State) ->
    do_event(Account, on_change_house, HouseLevel),
    {noreply, State};
handle_cast({#msg{event=on_buy_house, src=Account}, HouseLevel}, State) ->
    do_event(Account, on_buy_house, HouseLevel),
    {noreply, State};
handle_cast({#msg{event=on_hire_friend, src=Account}, FriendAccount}, State) ->
    do_event(Account, on_hire_friend, FriendAccount),
    {noreply, State};
handle_cast({#msg{event=on_hire_npc, src=Account}, Npc}, State) ->
    do_event(Account, on_hire_npc, Npc),
    {noreply, State};
handle_cast({#msg{event=on_buy_goods_from_sysshop, src=Account}, {GoodsId, _Count}}, State) ->
    do_event(Account, on_buy_goods_from_sysshop, GoodsId),
    {noreply, State};
handle_cast({#msg{event=on_produce_context_success, src=Account}, TempId}, State) ->
    do_event(Account, on_produce_context_success, TempId),
    {noreply, State};
handle_cast({#msg{event=on_plant_crop_success, src=Account}, TempId}, State) ->
    do_event(Account, on_plant_crop_success, TempId),
    {noreply, State};
handle_cast({#msg{event=on_daily_task_reward, src=Account}, TaskId}, State) ->
    do_event(Account, on_daily_task_reward, TaskId),
    {noreply, State};
handle_cast({#msg{event=on_chain_task_reward, src=Account}, TaskId}, State) ->
    do_event(Account, on_chain_task_reward, TaskId),
    {noreply, State};
handle_cast({#msg{event=on_pick_up_success, src=Account}, Count}, State) ->
    do_event(Account, on_pick_up_success, Count),
    {noreply, State};
handle_cast({#msg{event=on_water_success, src=Account}, TempId}, State) ->
    do_event(Account, on_water_success, TempId),
    {noreply, State};
handle_cast({#msg{src=Account}, #req_close_daily_reward_ui{}}, State) -> 
    do_event(Account, on_open_daily_reward_ui, Account),
    {noreply, State};
handle_cast({#msg{event=on_fertilize_success, src=Account}, TempId}, State) ->
    do_event(Account, on_fertilize_success, TempId),
    {noreply, State};
handle_cast({#msg{event=on_whip_player_success, src=Account}, Count}, State) ->
    do_event(Account, on_whip_player_success, Count),
    {noreply, State};
handle_cast({#msg{event=on_click_sprite, src=Account}, _Account}, State) ->
    do_event(Account, on_click_sprite, Account),
    {noreply, State};
handle_cast({#msg{src=Account}, #req_open_daily_task_ui{}}, State) -> 
    do_event(Account, on_open_daily_task_ui, Account),
    {noreply, State};
handle_cast({#msg{src=Account}, #req_close_daily_task_ui{}}, State) -> 
    do_event(Account, on_close_daily_task_ui, Account),
    {noreply, State};
handle_cast({#msg{event=on_unlock_flowerpot, src=Account}, _Account}, State) ->
    do_event(Account, on_unlock_flowerpot, Account),
    {noreply, State};
handle_cast({#msg{event=on_mutli_item_upgrade, src=Account}, _Account}, State) ->
    do_event(Account, on_mutli_item_upgrade, Account),
    {noreply, State};

handle_cast({#msg{event=on_flower_shake, src=Account}, _Account}, State) ->
    do_event(Account, on_flower_shake, Account),
    {noreply, State};
handle_cast({#msg{event=on_start_mind_quiz, src=Account}, _Account}, State) ->
    do_event(Account, on_start_mind_quiz, Account),
    {noreply, State};
handle_cast({#msg{event=on_player_exchange, src=Account}, _Account}, State) ->
    do_event(Account, on_player_exchange, Account),
    {noreply, State};
handle_cast({#msg{event=on_click_large_sprite, src=Account}, _Account}, State) ->
    do_event(Account, on_click_large_sprite, Account),
    {noreply, State};
handle_cast({#msg{event=on_click_small_sprite, src=Account}, _Account}, State) ->
    do_event(Account, on_click_small_sprite, Account),
    {noreply, State};
handle_cast({#msg{event=on_daily_active_reward, src=Account}, _Account}, State) ->
    do_event(Account, on_daily_active_reward, Account),
    {noreply, State};
handle_cast({#msg{event=on_party_add_point, src=Account}, _Account}, State) ->
    do_event(Account, on_party_add_point, Account),
    {noreply, State};
handle_cast({#msg{event=on_decoration_change, src=Account}, Decoration}, State) ->
    do_event(Account, on_decoration_change, Decoration),
    {noreply, State};
handle_cast({#msg{event=on_player_charm_change, src=Account}, Decoration}, State) ->
    do_event(Account, on_player_charm_change, Decoration),
    {noreply, State};
handle_cast({#msg{event=on_enter_self_home, src=Account}, _Account}, State) ->
    do_event(Account, on_enter_self_home, Account),
    {noreply, State};
handle_cast({#msg{src=Account}, #req_close_windows{type=Type}}, State) ->
    do_event(Account, close_windows, Type),
    {noreply, State};
handle_cast({#msg{event=make_product_event, src=Account}, _Account}, State) ->
    do_event(Account, make_product_event, Account),
    {noreply, State};
handle_cast({#msg{event=complete_product_event, src=Account}, _Account}, State) ->
    do_event(Account, complete_product_event, Account),
    {noreply, State};
handle_cast({#msg{event=click_guest_event, src=Account}, _Account}, State) ->
    do_event(Account, click_guest_event, Account),
    {noreply, State};
handle_cast({#msg{event=unlock_food_event, src=Account}, _Account}, State) ->
    do_event(Account, unlock_food_event, Account),
    {noreply, State};
handle_cast({#msg{event=expand_food_stock_event, src=Account}, _Account}, State) ->
    do_event(Account, expand_food_stock_event, Account),
    {noreply, State};
handle_cast({#msg{event=complete_expand_food_stock_event, src=Account}, _Account}, State) ->
    do_event(Account, complete_expand_food_stock_event, Account),
    {noreply, State};
handle_cast({#msg{event=expand_produce_area_event, src=Account}, _Account}, State) ->
    do_event(Account, expand_produce_area_event, Account),
    {noreply, State}.


%%%===================================================================
%%% Internal functions

%%%===================================================================
do_change_goods(_Account, []) ->
    ok;
do_change_goods(Account, [Item|ItemList]) when is_record(Item, item) ->
    TempId = Item#item.template_id,
    ItemTplt = tplt:get_data(item_tplt, TempId),
    case ItemTplt#item_tplt.use_type of
	1 ->
	    do_event(Account, change_furniture_event, TempId);
	2 ->
	    do_event(Account, change_flower_prop_event, TempId);
	3 ->
	    do_event(Account, change_clothes_event, TempId);
	4 ->
	    do_event(Account, change_shoes_event, TempId);
	5 ->
	    do_event(Account, change_can_use_prop_event, TempId);
	6 ->
	    do_event(Account, change_cant_use_prop_event, TempId);
	7 ->
	    do_event(Account, change_hat_event, TempId);
	_ ->
	    ok
    end,
    do_change_goods(Account, ItemList).


do_buy_item(_Account, []) ->
    ok;
do_buy_item(Account, [TempId|ItemList]) when is_integer(TempId) ->
    do_buy_item_1(Account, TempId),
    do_buy_item(Account, ItemList); 
do_buy_item(Account, [Item|ItemList]) when is_record(Item, item) ->
    TempId = Item#item.template_id,
    do_buy_item_1(Account, TempId),
    do_buy_item(Account, ItemList).

do_buy_item_1(Account, TempId) ->
    ItemTplt = tplt:get_data(item_tplt, TempId),
    case ItemTplt#item_tplt.use_type of
	1 ->   % 家具
	    do_event(Account, buy_furniture_event, TempId);
	2 ->   % 购买花藤道具
	    do_event(Account, buy_flower_prop_event, TempId);
	3 ->   % 服装
	    do_event(Account, buy_clothes_event, TempId);
	4 ->   % 鞋子
	    do_event(Account, buy_shoes_event, TempId);
	5 ->   % 购买可以使用的道具
	    do_event(Account, buy_can_use_prop_event, TempId);
	6 ->   % 购买不可以使用的道具
	    do_event(Account, buy_cant_use_prop_event, TempId);
	7 ->   % 购买帽子
	    do_event(Account, buy_hat_event, TempId);
	_ ->
	    ok
    end.


do_event(Account, Event, Value) ->
    player_task:do_event(Account, Event, Value),
    daily_active_reward:do_event(Account, Event, Value),
    action_event:do_event(Account, Event, Value),
    ring_task:set_event_count(Account, Event).


