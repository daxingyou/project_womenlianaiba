-record(player, {username, create_date, login_ip}).
%% ����������Խṹ
-record(subscribe_property_data, {player_clean, player_health, player_charm, active_value, house_clean}).

-record(house_guest_data, {house_id, guest_books}). %%�������԰�

-record(house_warming, {account, house_id}).

%% ��Ը�����
-record(player_wish, {wish_id, account, goods_id, wish_time, wish_type}).
-record(player_wish_histories, {account, histories, count}).
-record(player_wish_history, {goods_id, satisfy_account, wish_type}).

%% �������
-record(order_item, {goods_id, number, price}).
-record(order, {order_id, items, status, goods_meta}).
-record(qq_payment_info, {open_id, open_key, pf, pf_key}).
-record(pay_result, {return, message}).
-record(ship_result, {return, message}).

-record(yy_payment_info, {uid, ch, srvid}).

%% �������
-record(vip_beginner_gift_log, {account, receive_date}).
-record(vip_daily_gift_log, {account, receive_date}).


%% ������Ϣ
-record(offline_notify, {account, notifies}). %notifies:[{notify_type, count}}]


%% �����¼
-record(player_invite, {account, active_openids, actived_openids}).


%% GMȨ��
-record(player_gm_permission, {account, money, item, enable}).


%% �ϳ�
-record(produce_manual, {item_id, produce_level, consume_diamond, material_item, finished_item, success_rate, experience}).

%% ����
-record(player_breakup, {account, diamond, unobtained_items, createat}).

%% ��¼��Ϣ
-record(platform_login_info, {openid, openkey, pf, pfkey, iopenid}).
-record(yy_platform_login_info, {uid, srvid, ch}).

%% ���ܶ�
-record(intimate, {account, value=0}).
-record(player_intimate, {account, intimate_list=[]}).


%% ���ݷ�����־��ÿ���¼һ�Σ���Ҫ�Ļ������Կ�����չ��
-record(access_log, {houseid, last_access_time}).
-record(house_access_log, {account, access_log_list}).


-record(yy_orderid_mapping, {yyorderid, orderid}).

%%
-record(player_flower_shake, {account, shake_list, love_coin_shake_count}).
-record(player_flower_love_coin_shake, {account, count, time}).

%% ֧������
-record(first_payment_return, {account, pay_date, return_items, return_date}).
-record(single_payment_return, {account, return_items}).
-record(total_payment_return, {account, total_amount, return_items, reward_amount}).
-record(total_payment_return_wrapper, {consume_amount, return_diamond, return_items}).


%% ��Ʒ����
-record(item_upgrade_wrapper, {inst_id, item_sub_id, consume_items, consume_diamond, upgraded_item_id, upgraded_property}).

%% Ƶ��������Ϣ
-record(channel_basic_info, {id, name, admin, credit_level}).
% Ƶ��״̬��Ϣ
% Ƶ��ID���ⲿ����ID��Ƶ�������û��б�Ƶ��������������ֱ��״̬(0-ͣ��, 1-����)����ʱ����[�ư��û��б�-pub_users, �ư�����-pub_user_count]
-record(channel_status_info, {channel_id, basic_info, extend_room_id=0, audiences, audience_count, live_status}).

%% ������
-record(shit_player, {account, comment, datetime}).
