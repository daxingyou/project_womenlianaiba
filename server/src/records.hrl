-record(player, {username, create_date, login_ip}).
%% 订阅玩家属性结构
-record(subscribe_property_data, {player_clean, player_health, player_charm, active_value, house_clean}).

-record(house_guest_data, {house_id, guest_books}). %%房屋留言板

-record(house_warming, {account, house_id}).

%% 许愿单相关
-record(player_wish, {wish_id, account, goods_id, wish_time, wish_type}).
-record(player_wish_histories, {account, histories, count}).
-record(player_wish_history, {goods_id, satisfy_account, wish_type}).

%% 交易相关
-record(order_item, {goods_id, number, price}).
-record(order, {order_id, items, status, goods_meta}).
-record(qq_payment_info, {open_id, open_key, pf, pf_key}).
-record(pay_result, {return, message}).
-record(ship_result, {return, message}).

-record(yy_payment_info, {uid, ch, srvid}).

%% 黄钻礼包
-record(vip_beginner_gift_log, {account, receive_date}).
-record(vip_daily_gift_log, {account, receive_date}).


%% 离线消息
-record(offline_notify, {account, notifies}). %notifies:[{notify_type, count}}]


%% 邀请记录
-record(player_invite, {account, active_openids, actived_openids}).


%% GM权限
-record(player_gm_permission, {account, money, item, enable}).


%% 合成
-record(produce_manual, {item_id, produce_level, consume_diamond, material_item, finished_item, success_rate, experience}).

%% 分手
-record(player_breakup, {account, diamond, unobtained_items, createat}).

%% 登录信息
-record(platform_login_info, {openid, openkey, pf, pfkey, iopenid}).
-record(yy_platform_login_info, {uid, srvid, ch}).

%% 亲密度
-record(intimate, {account, value=0}).
-record(player_intimate, {account, intimate_list=[]}).


%% 房屋访问日志（每天记录一次，需要的话，可以考虑扩展）
-record(access_log, {houseid, last_access_time}).
-record(house_access_log, {account, access_log_list}).


-record(yy_orderid_mapping, {yyorderid, orderid}).

%%
-record(player_flower_shake, {account, shake_list, love_coin_shake_count}).
-record(player_flower_love_coin_shake, {account, count, time}).

%% 支付返还
-record(first_payment_return, {account, pay_date, return_items, return_date}).
-record(single_payment_return, {account, return_items}).
-record(total_payment_return, {account, total_amount, return_items, reward_amount}).
-record(total_payment_return_wrapper, {consume_amount, return_diamond, return_items}).


%% 物品升级
-record(item_upgrade_wrapper, {inst_id, item_sub_id, consume_items, consume_diamond, upgraded_item_id, upgraded_property}).

%% 频道基本信息
-record(channel_basic_info, {id, name, admin, credit_level}).
% 频道状态信息
% 频道ID，外部房间ID，频道在线用户列表，频道到在线人数，直播状态(0-停播, 1-开播)，暂时不用[酒吧用户列表-pub_users, 酒吧人数-pub_user_count]
-record(channel_status_info, {channel_id, basic_info, extend_room_id=0, audiences, audience_count, live_status}).

%% 黑名单
-record(shit_player, {account, comment, datetime}).
