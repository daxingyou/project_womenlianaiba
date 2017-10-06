%%% @author  linyijie
%%% @copyright (C) 2010, 
%%% @doc
%%%  消息系统的类型定义: 一般的系统都可以通过该消息模块传送一个指定的ID值给客户端
%%%  客户端根据该ID值,查找模板表对应的文本, 显示出来
%%% @end
%%% Created : 25 Mar 2010 by  <>

-define(err_no_error, 0). % 没错误
%%---- 错误代码的定义 -------------------------------
-define(err_swap_item, 1). % 交换物品失败
-define(err_move_item, 2). % 移动物品失败
-define(err_cannot_use_item, 3). % 不能使用物品
-define(err_dont_place_furniture, 4). % 不能摆放家具
-define(err_player_count_over, 5). % 场景玩家数目超过限制 
-define(err_player_is_editing_house, 6). % 玩家正在整理房间(编辑房间) 
-define(err_not_at_home, 7). % 玩家不在家
-define(err_not_same_scene, 8). % 玩家不在同一场景中 
-define(err_furniture_not_exist, 9). % 家具不存在
-define(err_bag_full, 10). % 包裹满了
-define(err_not_exist_item_temp_id, 11). % 物品的模板ID不存在
-define(err_cannot_dress, 12). % 不能把服装穿在该位置
-define(err_grid_lock, 13).    % 格子锁住了
-define(err_grid_empty, 14).   % 格子是空的, 不允许操作
-define(err_already_exists_friend, 15).   % 好友已经存在
-define(err_not_exists_friend, 16).   % 好友不存在
-define(err_friend_count_over, 17).   % 好友个数超过限制
-define(err_add_self_as_friend, 18).   % 误把自已加为好友
-define(err_invitee_has_invitation, 19). % 被邀请的目标正在处理一个邀请
-define(err_cancel_trade_invitation, 20). % 被邀请的目标取消交易邀请
-define(err_cannot_invite_someone, 21).  % 玩家当前状态不允许邀请某人
-define(err_furniture_sex, 22).  % 使用家具，错误的性别
-define(err_furniture_has_used, 23).  % 单人可以使用的家具，已经被人占用
-define(err_furniture_not_position, 24).  % 多人可以使用的家具，没有足够的位置
-define(err_furniture_property_is_full, 25).  % 玩家属性已满
-define(err_furniture_not_permission, 26).  % 玩家没有使用权限
-define(err_not_enough_coin, 27).  % 所需金钱不足
-define(err_cannot_be_invite, 28). % 对方的状态无法接受邀请
-define(err_reject_invitation, 29).    % 对方拒绝了邀请 

-define(err_kick_by_master, 31). % 被主人踢出房间
-define(err_other_cancel_trade, 32). % 对方取消交易
-define(err_cannot_trade_too_far, 33). % 双方距离太远了，不能进行交易
-define(err_not_enough_position, 34). %  包裹没有足够的位置

-define(err_cannot_trade_bag_full, 35). % 交易失败, 背包空间不足
-define(err_cannot_trade_other_bag_full, 36). % 交易失败, 对方背包空间不足
-define(err_cannot_trade_money_full, 37). % 交易失败, 金钱满了
-define(err_cannot_trade_other_money_full, 38). % 交易失败, 对方金钱满了

-define(err_task_not_enough_props, 39). % 没有足够的道具
-define(err_task_is_full, 40).  % 任务已经满了
-define(err_task_is_exist, 41). % 任务已经存在

-define(err_farm_no_grass, 42).         % 这块地不需要除草
-define(err_farm_no_pest, 43).          % 这块地不需要除虫
-define(err_farm_no_drought, 44).       % 这块地不需要浇水

-define(friend_online_notify, 45).  % 好友%s上线了(%s为参数)
-define(friend_offline_notify, 46).  % 好友%s下线了(%s为参数)

-define(err_cannot_assart, 47).  % 扩建这块土地需要等级%s级和金币%s.
-define(err_plot_not_empty, 48). % 地块上还有农作物, 不能播种
-define(err_plot_empty, 49).     % 地块上没有农作物
-define(err_damage_full, 50).    % 数量已满，无法再放
-define(err_cannot_put_damage, 51).     % 当前阶段不能做这种操作
-define(err_not_crop_pick, 52). % 当前农田没有作物可采摘
-define(err_picked, 53). % 你已经采摘过了
-define(err_not_remain_fruit, 54). % 果实已经被采摘完了
-define(err_cannot_pick, 55).  % 行行好吧, 我所剩无几了!
-define(err_put_damage_too_much, 56). % 每天只能放50次
-define(err_farm_operate_too_much, 57). % 今天该操作的次数已经超过150次, 不允许再操作
-define(err_cannot_clear_damage, 58).   % 不可以毁灭证据哦
-define(err_farm_no_damage, 59).        % 没有该灾害
-define(err_sure_hoeing_crop, 60).      % 作物还没有收获, 真的要铲除吗
-define(err_item_cannot_sell, 61).      % 物品不允许卖出
-define(err_already_exists_trade_item, 62).  % 交易栏已存在该物品
-define(err_trade_money_less_0, 63).         % 交易金额小于0
-define(err_other_is_busy, 64).              % 对方正忙着呢
-define(err_select_item_is_empty, 65).       % 选择物品为空
-define(err_item_bind_can_not_trade, 66).    % 物品绑定不能交易
-define(err_sys_mail_can_not_reject, 67).    % 系统邮件不能退信
-define(err_sys_mail_can_not_reply, 68).     % 系统邮件不能回复
-define(err_mail_not_exists, 69).            % 邮件不存在
-define(err_mail_item_not_exists, 70).       % 邮件物品不存在
-define(err_mail_reciever_not_exists, 71).   % 找不到收件人 
-define(err_mail_item_full, 72).             % 邮件物品数量已经达到上限
-define(err_mail_title_empty, 73).           % 邮件主题不能为空
-define(err_can_not_mail_to_self, 74).       % 不能给自已发邮件 
-define(err_mail_reciever_empty, 75).        % 收件人不能为空
-define(err_not_enough_level, 76).           % 等级不足
-define(err_mail_can_not_reject_again, 77).  % 退信邮件，不能再退
-define(err_mail_sender_undefined, 78).      % 发信人未定义  
-define(msg_farm_shop_buy_success, 79).      % 购买成功, 共花费金币%s, eq币%s点, 购买了%s个物品
-define(msg_farm_shop_sell_success, 80).     % 成功卖出%s个%s, 得到金币%s
-define(msg_farm_shop_sell_all_success, 81). % 成功卖出仓库里所有未锁定果实, 得到金币%s
-define(err_trade_item_not_find, 82).        % 找不到交易物品
-define(err_domestic_not_exists, 83).        % 家政服务不存在
-define(err_not_need_domestic_service, 84).  % 暂时不需要该家政服务(比如说清洁度满了)
-define(err_target_is_empty, 85).            % 目标为空
-define(err_trade_need_all_sured, 86).       % 需双方都确认才能交易
-define(err_trade_all_sured, 87).            % 双方都确认交易，不能改变物品或金钱
-define(err_player_clean_not_enough, 88).    % 人物清洁度不够
-define(err_player_health_not_enough, 89).   % 人物健康值不够
-define(err_player_charm_not_enough, 90).    % 人物魅力值不够
-define(err_player_active_not_enough, 91).   % 人物活跃值不够
-define(err_house_clean_not_enough, 92).     % 房屋清洁度不够
-define(err_fertilizered, 93).               % 已经施过肥了
-define(err_player_replacing_house, 94).     % 玩家在编辑房屋
-define(err_welcome_words, 95).              % 错误的房屋欢迎语（长度太长）
-define(err_mail_title_too_long, 96).        % 邮件标题太长
-define(err_mail_content_too_long, 97).      % 邮件内容太长
-define(err_not_permission_enter_house, 98). % 没有权限进入房间
-define(err_house_permission_not_friend, 99).% 房屋权限错误，还不是好友
-define(err_sex_not_same, 100).              % 该服装不能在这种性别下穿着
-define(err_exist_purchase_item, 101).       % 存在购买的物品
-define(err_player_offline, 102).            % 对方不在线
-define(err_house_clean_full, 103).          % 房屋清洁度已满
-define(err_not_pick, 104).                  % 当前农田没有作物可摘取
-define(err_domestic_not_enough_coin, 105).  % 你的金钱不足，无法支付打扫费用。
-define(msg_farm_setting_prompt, 106).       % 提示农场设置的信息，如：放草，偷菜...
-define(msg_house_transaction_success, 107). % 成功购买房屋
-define(msg_player_property_by_stime, 108).  % 人物属性提示(系统时间)
-define(msg_player_property_by_property, 109).% 人物属性提示(属性影响属性)
-define(msg_player_property_by_furniture, 110).% 人物属性提示(家具影响属性)
-define(msg_player_property_by_work, 111).     % 人物属性提示(打工影响属性)
-define(msg_player_property_by_task, 112).     % 人物属性提示(任务影响属性)
-define(err_only_at_home_can_kick_guest, 113). % 要在自已家里才能踢人
-define(err_only_at_home_can_edit_house, 114). % 要在自已家里才能编辑房屋
-define(msg_npc_script, 115).                  % 通过npc脚本提示的内容
-define(msg_player_property_by_npc, 116).      % 人物属性提示(npc影响)
-define(msg_send_mail_success, 117).           % 邮件发送成功
-define(msg_add_friend, 118).                  % 你把%s加为好友
-define(msg_be_add_friend, 119).               % %s把你加为好友
-define(msg_assart_plot, 120).                 % 确定开垦土地吗, 这将花费金币%s
-define(msg_farm_setting_success, 121).        % 农场设置成功
-define(msg_farm_setting_fail, 122).           % 农场设置成功
-define(msg_farm_reset_setting_success, 123).  % 重置农场设置成功
-define(msg_game_coin_overflow, 124).          % 金币超过上限
-define(msg_not_item_to_sell, 125).            % 没有物品可买
-define(msg_farm_land_level_not_enough, 126).  % 对不起，升级下一块土地需要等级%d级，金币%d，您的等级不足
-define(msg_farm_land_money_not_enough, 127).  % 对不起，升级下一块土地需要等级%d级，金币%d，您的金币不足
-define(msg_farm_land_level_money_not_enough, 128).% 对不起，升级下一块土地需要等级%d级，金币%d，您的等级与金币均不足
-define(msg_land_not_hoeing_all, 129).         % 你的土地还没有开荒完
-define(msg_upgrade_land, 130).                % 升级下一块土地需要等级%d级，金币%d，您确定升级吗？
-define(msg_need_redland, 131).                % 高级种子只能种在红土地上
-define(msg_not_money_cannot_steal, 132).      % 你身无分文也敢到我家来偷东西
-define(msg_crop_cannot_aberrance, 133).       % 该作物不能产生变异
-define(msg_used_aberrance_item, 134).         % 您已经使用过变异物品了
-define(msg_aberrance_item_not_stage, 135).    % 该物品必须在农作物成熟前使用
-define(msg_redland_over, 136).                % 红土地已经全部升级完
-define(msg_gift_err_pack, 137).               % 礼物打包失败，已经存在打包的礼物
-define(msg_gift_err_unpack, 138).             % 礼物回收失败
-define(msg_gift_err_name, 139).               % 礼物名称最多不超过16个字符
-define(msg_gift_err_game_coin, 140).          % 游戏币不足
-define(msg_gift_err_eq_coin, 141).            % EQ币不足
-define(msg_bag_no_item, 142).                 % 包裹内不存在该物品
-define(msg_gift_err_comment, 143).            % 礼物赠言最多不超过80个字符
-define(msg_gift_err_pickup, 144).             % 捡起礼物错误，该用户没有权限获取该礼物
-define(msg_gift_err_giftbox, 145).            % 礼物盒不允许为空
-define(msg_gift_item_not_exist, 146).         % 请选择需要赠送的物品或者选择一张礼物卡
-define(msg_gift_err_pack_count, 147).         % 每天允许制作免费的礼物盒不超过5个
-define(err_fer_crop_ripe, 148).               % 农作物已经成熟, 不再需要施肥
-define(msg_pet_bite, 149).                    % 到主人家偷取农作物被狗咬了%s金币
-define(msg_del_over_time_item, 150).          % %s到期，已消失
-define(msg_item_will_be_del, 151).            % %s即将到期
-define(err_mail_cut_time_not_enough, 152).    % 物品剩余时间不足，无法邮寄
-define(err_trade_cut_time_not_enough, 153).   % 物品剩余时间不足，无法交易
-define(err_not_exist_task, 154).              % 玩家身上不存在该任务
-define(err_task_not_enough_position, 155).    % 包裹没有足够的空格
-define(err_task_not_contain_item, 156).       % 包裹中不存在该任务所需要的物品
-define(err_task_not_repeat_get, 157).         % 该任务不允许重复接
-define(err_task_has_expried, 158).            % 该任务已经到期 
-define(msg_task_script, 159).                 % %s
-define(msg_gift_err_sender, 160).             % 发送快递礼物时，该帐号不存在
-define(msg_pet_food_is_full, 161).            % 狗粮已满,不允许再增加
-define(msg_pet_food_used, 162).               % 已经将狗粮成功地添加到你的狗窝中
-define(msg_pet_food_buy_success, 163).        % 购买成功，已经将狗粮成功的存放到你的仓库中
-define(msg_gift_box_owner_pickup, 164).       % 玩家%s将礼物回收
-define(err_player_no_eq_home, 165).           % 玩家没有EQ家圆
-define(msg_task_complete, 166).               % %s:任务完成
-define(msg_task_give, 167).                   % 接受%s任务
-define(msg_task_reward_item, 168).            % 奖励任务道具%s, 个数:%s
-define(msg_task_reward_game_coin, 169).       % 任务奖励游戏币%s
-define(msg_task_reward_eq_coin, 170).         % 任务奖励的eq币%s
-define(err_you_already_in_scene, 171).        % 您已经在场景中了（玩家重复请求进入当前场景）
-define(msg_gift_box_has_been_pickup, 172).    % 已经不存在该礼物盒
-define(msg_farm_does_not_have_dog, 173).      % 玩家必须先有狗才能使用狗粮。
-define(msg_farm_pet_food_waste, 174).         % 已经将狗粮成功地添加到你的狗窝中, 但是浪费了
-define(msg_farm_shop_buy_dog_success, 175).   % 购买了一只狗
-define(msg_bited_dec_money, 176).             % 你在采摘的过程中被狗发现%s次，在逃跑的时候损失了%s金币
-define(err_not_enough_game_coin, 177).        % 所需游戏币不足
-define(msg_item_can_not_pack, 178).           % 该物品不允许制作礼物
-define(msg_farm_event_1, 179).                % 你什么都没捞着，还损失了50金币
-define(msg_farm_event_2, 180).                % 你获得双倍作物，还获得了50金币
-define(msg_task_bag_is_full, 181).            % 获取任务失败，包裹已经满
-define(success_resize_player_pack, 182).      % 包裹扩容成功
-define(msg_get_item, 183).                    % 获得物品:%s X %s
-define(msg_change_house, 184).                % 玩家切换房屋
-define(err_other_reject_accept_friend, 185).  % 对方拒绝加为好友请求
-define(err_other_logout_invite_fail, 186).    % 玩家%s下线，请求失败
-define(msg_add_friend_success, 187).          % 加好友成功
-define(err_not_find_match_players, 188).      % 找不到符合条件玩家 

-define(warn_before_edit_house, 193).             % 你的家里有宝箱，进去家装模式会清楚房间内所有宝箱，是否继续？(客户端用)


-define(msg_buy_house, 199).                   % 玩家使用新的房屋

-define(err_farm_task_not_repeat_get, 200).    % 该任务不允许重复接
-define(err_farm_task_is_exist, 201).          % 任务已经存在
-define(err_farm_task_is_full, 202).           % 任务已经满了
-define(err_farm_not_exist_task, 203).         % 玩家身上不存在该任务
-define(err_farm_task_has_expried, 204).       % 该任务已经到期 

-define(err_pos_not_empty, 205).               % 该位置已有物品
-define(err_task_not_give_up, 206).            % 该任务不允许放弃

-define(err_not_enough_money, 207).            % 金钱不足
-define(err_farm_depot_no_item, 208).          % 农场包裹不存在该物品
-define(err_drop_float_bottle_fail, 209).      % 扔飘流瓶失败
-define(err_pick_float_bottle_fail, 210).      % 捡飘流瓶失败
-define(msg_send_make_friend_request, 211).    % 你的好友添加请求已发送

-define(err_wallow_work_warn_time, 212).       % 已纳入防沉迷，打工收益减半。
-define(err_wallow_work_bad_time, 213).        % 已纳入防沉迷，打工无法获得收益。
-define(err_wallow_magic_box_warn_time, 214).  % 已纳入防沉迷，无法拾取物品，金钱获得减半。
-define(err_wallow_magic_box_bad_time, 215).   % 已纳入防沉迷，无法获取物品，无法获取金钱。
-define(err_wallow_warn_time, 216).            % 已纳入防沉迷，采摘收益减半。
-define(err_wallow_bad_time, 217).             % 已纳入防沉迷，无法获得收益。
-define(err_wallow_buy_good_warn_time, 218).   % 时间超过沉迷时间，购买物品减半经验
-define(err_wallow_buy_good_bad_time, 219).    % 时间超过沉迷时间，购买物品不增加经验
-define(err_wallow_sell_good, 220).            % 时间超过沉迷时间, 提示玩家不允许卖东西
-define(err_wallow_complete_task, 221).        % 时间超过沉迷时间, 不允许完成任务
-define(err_wallow_farm_complete_task, 222).   % 时间超过沉迷时间, 不允许农场完成任务
-define(err_magic_box_get_nothing, 223).       % 你什么也没得到
-define(err_other_busy_stop_invite, 224).      % 发生了某些事情，导致对方停止被邀请状态
-define(err_wallow_pick_crop, 225).            % 已纳入防沉迷，无法采摘作物
-define(err_player_disease_can_not_work, 226). % 身体状况太差无法打工

-define(msg_player_property_by_disease_special_event, 227). % 人物属性提示(疾病特殊事件引起)
-define(err_wallow_give_task, 228).            % 时间超过沉迷时间, 不允许接任务
-define(err_wallow_farm_give_task, 229).       % 时间超过沉迷时间, 不允许接任务
-define(err_reject_add_friend, 230).           % %s拒绝加你为好友

-define(err_exceed_max_game_coin, 231).        %超出最大游戏币限额
-define(err_not_enough_eq_coin, 232).          % 所需eq币不足
-define(msg_move_farm_coin_success, 233).        %导入金钱提示
-define(msg_move_game_coin_success, 234).        %导入金钱提示

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%       爱的小屋 的系统提示从这里开始
-define(err_no_del_item_when_house_is_editing, 300). % 正在编辑房屋不能删物品
-define(msg_commemoration, 301).               % 最多只能有100条纪念日
-define(msg_flower_success_1, 302). % 浇水成功爱情树获得了4点成长值
-define(msg_flower_success_2, 303). % 浇水成功爱情树获得了1点成长值
-define(msg_water_flower_limit, 304). % 今日浇水已达到上限，请明天再来
-define(err_player_no_love_home, 305). % 没开通爱的小屋
-define(err_login_account_empty, 306). % 账号不能为空
-define(err_login_account_or_password, 307).     % 账号或密码错误
-define(err_other_is_editing_house, 308).        % 你的情侣正在编辑房屋, 你暂时不能编辑房屋
-define(err_player_editing_house, 309). % 玩家在编辑房屋, 你被踢了出来
-define(err_not_enough_lover_diamond, 310).  % 爱情水晶不足
-define(msg_friend_water_flower_limit, 311). % 这可花藤已经被8位好友浇过, 不能再浇了

-define(err_has_get_holiday_gift, 312).      % 已经领过节日礼物了
-define(err_today_not_holiday_gift, 313).    % 今天没有节日礼物 
%%-define(err_change_dress_not_enough_coin, 314). %% 换装没有足够的金币

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%花藤提示，服务端不使用，这里占位
%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
-define(msg_no_love_seed, 315). %% 你还不可以领取爱情种子哦，快去寻找一份爱情吧
-define(msg_no_love_flower, 316). %% 好友还是单身，没有爱情树


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% 配对
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

-define(err_mateup_unknow, 317).            %% 未知的配对异常
-define(err_visit_mateuping, 321).          %% 配对过程中，不允许房屋被拜访
-define(msg_kicked_mateuping, 322).         %% 配对过程中，将访客送回家
-define(msg_mateup_success, 323).           %% 配对成功后,重新上线消息提示

-define(err_hp_not_enough, 324).            %% 体力值不够

-define(msg_qq_strategy, 325).              %% 内容为%

-define(msg_cannot_create_party, 326).      %% 派对已经开过了, 不开再开, 除非取消

%%%%%%%%%%%%%%%礼物%%%%%%%%%%%
-define(err_not_exist_item, 327).           %% 包裹不存在该物品
-define(err_not_engouth_diamond, 328).      %% 没有足够的水晶
-define(err_exceed_max_receive, 329).       %% 超过玩家接收礼物的最大上限
-define(err_item_is_empty, 330).            %% 玩家没有选择物品

%%%%%%关注列表%%%%%%%%%%%%%%%%%
-define(msg_attention_full, 331).           %% 关注列表已满
-define(msg_exist_in_attention, 332).       %% 已经在关注列表中了
-define(msg_not_exist_in_attention, 333).   %% 关注对象不存在
-define(err_you_are_mateuping_can_not_login, 334). %% 你正在配对中，无法进入游戏
-define(msg_add_attention_success, 335).     %% 你已经将{0}加入了关注列表
%% 336     %% 成功加入许愿单！
%% 337     %% 你的水晶不足，无法实现该愿望。
%% 338     %% 实现该愿望需要花费{0}个水晶，你是否确定帮Ta实现？
%% 339     %% 实现该愿望需要花费{0}个Q点，你是否确定帮Ta实现？
-define(err_item_count_not_enough, 340).     %% 物品数量不足
-define(err_item_not_gift, 341).             %% 物品不能当礼物送
-define(err_account_or_password, 342).       %% 账号或密码错误
-define(err_not_laba, 343).                  %% 背包里找不到喇叭 
-define(err_player_is_empty, 403).           %% 玩家帐号不存在，导致不能发送礼物
-define(err_level_not_enough_to_buy, 404).   %% 玩家帐号不存在，导致不能发送礼物
-define(err_item_overdue, 407).              %% 物品过期
-define(err_can_not_use_furniture_when_edit_house, 408).  %% 主人正常家装，无法使用家具
-define(err_house_right_not_buy, 409).       %% 产权未购买
-define(err_prev_house_right_not_buy, 410).       %% 产权需要逐级购买
-define(err_level_not_enough_to_buy_house_right, 411).       %% 等级不够
-define(msg_level_up, 412).       %% 升级提示
-define(msg_kicked_move_house, 413). %% 搬家踢玩家

-define(err_scene_not_exists, 415). %% 场景不存在
-define(err_house_right_has_buy, 416). %% 产权买过了
-define(err_can_not_buy_double_house, 417). %% 单身只能用单身的房子
-define(err_can_not_buy_single_house, 418). %% 情侣只能用情侣的房子 
-define(err_not_at_home_not_move_house, 419). %% 在别人家不能搬家


-define(err_special_house_sell_out, 423). %% 这种房屋卖光了
-define(msg_buy_special_house_ok, 424). %% 特殊产权房屋购买成功
-define(err_special_house_right_not_buy, 425).       %% 特殊产权未购买
-define(level_not_enough, 426).         %% 等级不足


-define(err_whip_max, 431).  %% 鞭打超过最大次数了
-define(err_whip_not_in_house, 432).  %% 玩家家里才能使用鞭打功能
-define(err_already_has_search_plan, 433). %% 当前已经正在进行收集了
-define(msg_search_item_gain_exp, 434).  %% 帮{0}搜索获得{1}点经验
-define(err_not_search_plan, 435). %% 当前房间没有人正在收集
-define(err_account_cant_exist, 436). %%此好友尚未开通本应用

-define(err_whip_not_enough, 442).
-define(err_whip_not_exist, 443).
-define(err_friend_is_searching, 445).
-define(err_you_has_whip, 446).
-define(msg_flowerpot_not_crop, 447). %% 花盆上没有农作物
-define(msg_crop_event_handled, 448). %% 作物上的事件已经被处理了
-define(msg_not_fertilize, 449).      %% 没有肥料

-define(msg_crop_exist, 453).              %% 花盆上已经有作物了
-define(msg_get_fruit_count, 455).         %% 获得了多少个果实
-define(msg_help_boss_whip, 460).          %% 鞭打了雇员，缩短了5分钟的收集时间

-define(msg_you_kick_someone, 461). %% 你把%p赶出了房间 
-define(msg_flowerpot_not_exist, 462).     %% 花盆不存在

-define(err_you_are_breakuping_can_not_login, 463). %%正在办理离婚
-define(err_visit_breakuping, 464).        %% 离婚过程中，不允许房屋被拜访
-define(msg_kicked_breakuping, 466).         %% 配对过程中，将访客送回家

-define(msg_farm_level_not_enough, 469).   %% 种植的时候等级不足
-define(msg_task_for_add_item, 470).

-define(err_score_coin_not_enough, 471).   %% 抽奖币不足


-define(msg_someone_kick_you, 473). %% 你被%p赶出了房间
-define(err_not_allow_enter, 475). %% 该房屋主人不欢迎你，请稍后再访问

-define(err_funiture_count_limit, 476). %% 家具达到上限
-define(err_daily_score_not_enough, 477). %% 分数不够不能领奖

-define(msg_ring_task_not_exist, 478).    %% 任务不存在
-define(msg_ring_task_past_due, 479).     %% 任务过期
-define(msg_ring_task_require_item_not_enough, 480).  %% 缺少物品XXX，XX个
-define(msg_ring_task_task_has_complete, 481).        %% 任务已经完成过，不允许重复完成
-define(msg_ring_task_task_cant_complete, 482).       %% 任务还没有完成，不允许领取奖励
-define(msg_someone_be_kick, 483). %% %p触怒了%p，被赶出了房间
-define(msg_not_need_reduce_fruit_time, 484). %% 请检查是否没有作物或者作物已经成熟
-define(msg_all_crop_reduce_time, 485).       %% 所有作物缩短了一个小时
-define(msg_use_add_increase_fruit_ok, 486).  %% 成功使用丰收卡, 24小时内获得果实翻倍
-define(msg_daily_active_reward_gain_item, 487).  %% 恭喜你获得{1}个{0}
-define(msg_ring_task_item_not_exist, 493).  %% 缺少物品“任务许可令”
-define(msg_ring_task_give_count, 494).  %% 开启任务提示
-define(msg_ring_task_exceed_max_count, 495).  %% 任务超过最大数
-define(msg_maind_quiz_get_item, 496).  %% 智力问答获取物品

-define(err_create_party_fail_interval, 498). %% 再过{0}才可创建下一派对
-define(err_can_not_enter_private_party, 499). %% 无法进私人派对


-define(err_flower_shake_prop_overflow, 10036). %% 道具不足
-define(err_extend_aging_item, 501).            %% 升级衣服时效需要的物品不足


%% 物品升级
-define(err_item_upgrade_fail, 502). 
-define(err_item_upgrade_cap, 503).     %% 物品已经是最高级
-define(err_item_upgrade_lack, 504).    %% 缺少道具

-define(err_party_money_not_enough, 506).  %% 派对缺少水晶

-define(msg_kick_by_pub_host, 520).  %% 被主持人{0}请出了酒吧
-define(msg_kick_by_pub_guest, 521). %% 被其它客人挤出酒吧
-define(msg_recv_yy_gift, 522).      %% 你收到{0}送来的{1}获得{2}个货币
-define(msg_gain_gift_reward, 523).  %% 中奖提示{0}个货币
-define(err_you_are_in_shitlist, 524).  %% 黑名单用户不让登陆的提示

-define(err_channel_only_host_can_kick, 525).  %% 无权在频道踢人 
-define(err_not_pub_channel, 526).  %% 频道不存在 
-define(err_pub_host_reject_enter, 527).  %% 未满{0}分钟, 酒吧主人不欢迎你进 
-define(err_channel_player_full, 528).  %% 酒吧人满了 
-define(err_yy_gift_send_self, 529).  %% 不能送自已礼物 
-define(err_target_not_in_channel, 538).  %% 送礼对象不在频道中 
-define(msg_channel_kick_someone, 539).  %% {0}把{1}踢出频道 

-define(msg_channel_log, 541).  %% {0}
-define(msg_not_empty_flowerpot, 542).   %% 花盆已满, 无法种植

-define(err_task_is_empty, 543).

-define(unlock_furniture_level_error, 546).      % 解锁时等级错误
-define(unlock_furniture_diamond_error, 547).    % 解锁时水晶错误
-define(unlock_furniture_material_error, 548).   % 解锁时材料不够
-define(unlock_furniture_unlock_error, 549).     % 错误的解锁类型
-define(unlock_furniture_type_error, 550).       % 解锁的类型错误，不允许跳级解锁
-define(unlock_house_material_error, 551).       % 解锁房屋时材料错误

-define(player_point_error, 555).       % 积分不足
-define(player_point_pay_error, 556).   % 支付错误

-define(msg_add_item, 558).             % 获得了{0}个{1}物品
-define(mutli_item_upgrade_lover_edit, 561).   %% 您的ta正在家装，无法进行升级
-define(mind_quiz_count, 563).          % 智力闯关超过数量
-define(party_exceed_max_point, 564).   % 超过最大积分

-define(player_hp_count_error, 566).    % 每一天的数量上限已经满了
-define(player_hp_overflow, 567).       % 体力已经满了，不允许再回复

-define(player_food_unlocked_level_error, 572). % 解锁食物的等级不足
-define(player_food_unlocked_id_error, 573).    % 解锁食物的id重复解锁
-define(player_food_expand_stock_max_stock, 574).% 扩充库存已满
-define(player_food_expand_stock_due_time, 575). % 扩充库存上一次未完成，不能重复扩充
-define(player_food_expand_stock_diamond, 576).  % 扩充库存水晶不足
-define(player_food_produce_area_diamond, 577).  % 扩充制造区域时水晶不足
-define(player_food_produce_area_items, 578).    % 扩容制造区域时物品不足
-define(player_food_upgrade_diamond, 579).       % 升级食物时水晶不足
-define(player_food_upgrade_items, 580).         % 升级食物时物品不足
-define(player_food_make_product_number, 581).   % 制作食物时超过生产个数
-define(player_food_make_product_diamond, 582).  % 制作食物时水晶不足
-define(player_food_make_product_stock, 583).    % 制作食物时库存超过上限
-define(player_food_make_product_position, 584). % 删除食物时请求删除的食物不存在
-define(player_food_complete_expand_stock, 585). % 完成扩充库存时该Id错误，不存在该ID在扩库存
-define(player_food_complete_expand_stock_due_time, 586). % 完成扩充库存时，时间还没有到
-define(player_food_complete_product, 587).      % 完成制造食物时，该食物不存在 
-define(player_food_complete_product_time, 588). % 时间还没有到就提前请求完成制造任务
-define(player_food_unlocked_diamond, 589).      % 解锁食物的水晶不足
-define(player_food_upgrade_decoration, 592).    % 升级食物时豪华度不够

-define(msg_add_buff, 593).                      % 新增加一个buff

-define(msg_party_food_diamond, 595).		 % 您的水晶不足,无法试吃
-define(msg_party_food_eat_count_Max, 596).	 % 今天已经吃的很饱了

-define(msg_party_drink_have_score, 603).        % 你请所有人喝了一杯{0}，获得{1}积分
-define(msg_party_drink_not_score, 604).         % 你请所有人喝了一杯{0}，但你今天已无法从中获得积分了
-define(msg_party_drink_guest_have_score, 605).  % {0}请所有人喝了一杯{1}，你获得{2}积分
-define(msg_party_drink_guest_not_score, 606).   % {0}请所有人喝了一杯{1}，但你今天已无法从中获得积分了
-define(msg_not_need_party_drink, 607).          % 不需要请喝酒, 没有客人
