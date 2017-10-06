%%% @author  linyijie
%%% @copyright (C) 2010, 
%%% @doc
%%%  excel映射文件的结构体定义, 定义完结构体后, 程序会生成相应的资源映射文件供excel使用
%%% @end

%%% Created : 22 Mar 2010 by  <>

%% 类型的定义包括了: int, float, string, list_int, list_float, list_string
%% 新增类型 vector3, color, quaternion
%% 其中以list_ 打头的都是列表的形式, 模板表里填写的格式如下 1, 2, 3 要以逗号为分隔符
%% 其中以range 表示区间,  模板表里填写的格式如下 1~2,  最终生成的数据为元组{1, 2}。 也可直接填2, 表示{2, 2} 

-define(tplt_list,(
	  [{house_tplt,     % 房屋模板表
	    [{int, id},     % id
	     {string, name},% 名称
	     {int, level},  % 等级
	     {int, type},   % 类型
	     {string, model},        % 场景id，客户端用
	     {string, house_furniture}, % 对应的房屋附属家具
	     {int, born_id},                % 出生点
	     {int, max_players},              % 最大人数
	     {int, preview_born},
	     {string, struct_info},
	     {int, right_grade},          % 产权等级(0 表示没有 -1 表示特殊产权)
	     {int, is_single},            % 是否单身房(0 表示否 1 表示是)
	     {string, icon},              % 图标
	     {string, big_icon},
	     {string, tip},           
	     {int, internal_decoration},  % 自身的装修度
	     {int, max_furniture},        % 最多能放几个家具
	     {int, max_flowerpot},        % 最多能放几个花盆
	     {string, bg_music},          % 背景音乐
	     {int, max_guest},
	     {string, guest_id},
	     {string, waiter_pos},	  % 位置
	     {int, waiter_rotate},	  % 朝向
	     {int, love_coin}
	    ]},
	   {born,                          %% 出生点表
	    [{int, id},                            
	     {list_space_float, pos},
	     {int, dir},
	     {string, lookat},
	     {string, pitch},
	     {string, yaw},
	     {string, zoom},
	     {string, farclip},
	     {string, field},
	     {string, watch_mode},
	     {string, view_floor}
	    ]
	   },
	   {house_furniture_tplt, % 房屋附属家具(给房屋的时候的默认家具)
	    [{int, id},           % id
	     {int, furniture_id}, % 家具ID
	     {int, item_temp_id}, % 对应的物品模板ID(用于把家具转换成物品)
	     {int, x},      % x坐标
	     {int, z},      % y坐标
	     {float, height}, % 离地高度
	     {int, flr},      % 楼层
	     {int, face}      % 朝向
	    ]},
	   {item_base_tplt, %% 映射到1级物品id
	    [{int, item_id},
	     {int, base_item_id} %% 1级物品id
	     ]
	   },
	   {item_tplt,        % 物品模板表
	    [{int, id},       % 物品的ID
	     {string, name},  % 物品的名称
	     {int, type},     % 物品归属的类型
	     {int, use_type}, % 使用类型
	     {string, icon},  % 物品的图标
	     {int, overlap},  % 最大堆叠数
	     {int, sell_price},% 售价(0表示不可卖出)
	     {int, sub_id},   % 链接到家具表的id
	     {int, upgrade_id}, % 升级字表Id
	     {int, bind},    % 目前用来控制是否可送礼
	     {int, effect_time_id}, % 时效
	     {int, property_id},    % 根据类型对应不同的表id
	     {int, use_level},      % 使用等级
	     {int, level}
	    ]},
	   {item_effect_time_tplt,      %% 物品时效
	    [{int, id},                % id
     	     {int, type},              % 类型(1表示倒计时时效。2表示时间段时候。)
     	     {int, effect_time},       % 有效时间(天)
	     {int, trade_cut_time},    % 交易扣除时间(天)
	     {int, del_time}           % 删除时间(格式YYYYMMDD), 00:00开始删除
	    ]},
	   {item_dress_tplt,  % 物品服装表
	    [{int, id},       % ID
	     {string, name},  % 名称
	     {int, sex},      % 性别
	     {int, equip_pos},% 装备的位置
	     {list_int, equip_placeholder}, % 占位符
	     {string, model},      % 对应模型
	     {string, model_body}, % 模型对应身体
	     {int, place},    % 存放方式
	     {string, action},% 动作
	     {string, particle},   %% 例子效果
	     {string, attach_pos}, %% 对应的骨骼名称
	     {int, type1},    % 类型1
	     {int, type2}     % 类型2
	    ]},
	   {house_comp,       % 房屋部件表
	    [{int, id},       % 部件的ID
	     {int, type},     % 1:普通家具2:花盆
	     {string, name},  % 名称
	     {int, prop_id},  % 
	     {string, pos},   % 坐标
	     {string, rot},   % 翻转
	     {string, scale},  % 缩放
	     {string, model},
	     {int, cull_level},
	     {string, particle},
	     {string, particle_pos}
	    ]},
	   {common_scene,     % 公共场景
	    [{int, id},       % 场景id
	     {string, name},  % 中文名称
	     {int, copy_count}, % 每台服务器的副本数
	     {int, max_players}, % 最大人数
	     {int, born_id},
	     {string, furnitures},
	     {string, scene_name},
	     {int, type},
	     {string, bg_music}
	    ]},	   
	   {mutex_actions,    % 动作互斥
	    [{int, id},       % id  
	     {string, name},  % 中文名称
	     {list_int, allow_actions} % 允许的动作描述
	    ]},	   
	   {change_looks_tplt,             % 美容
	    [
	     {int, id},          % 性别 * 10000 + 改变(1.发型, 2.发色 3.脸形 4.肤色 5.胡子) * 1000 + 改变后的新值(新发型，新颜色)
	     {int, money_type},  % 费用类型(1为游戏金币，2为点卡点数)
	     {int, money}        % 费用
	   ]},
	   {teleport_tplt,      % 传送点
	    [
	     {int, id},           % 流水号
	     {int, src_scene_id}, % 出发场景id
	     {float, src_x},        % 传送点
	     {float, src_y},
	     {float, src_z},
	     {float, src_radius},  % 传送点半径
	     {int, dest_scene_id}, % 目标场景id
	     {float, dest_x},      % 目标点
	     {float, dest_y},
	     {float, dest_z},
	     {int, dest_dir}      % 到达后人物朝向
	   ]},
	   {create_random_dress,     % 创建人物服装随机表
	    [{int, id},       % id 
	     {int, sex},      % 性别
	     {int, fashion1}, % 套装1
	     {int, fashion2}, % 套装2
	     {int, fashion3}, % 套装3
	     {int, fashion4}, % 套装4
	     {int, fashion5}  % 套装5
	    ]},
	   {npc_tplt,             % npc
	    [{int, npc_id},      % npc主键
	     {int, body},        % 身体
	     {int, head},        % 头
	     {int, hair},        % 头发
	     {int, equip1},      % 初始装备1
	     {int, equip2},      % 初始装备2
	     {int, skeleton},    % 骨骼
	     {string, npc_name}  % npc名称
	    ]},
	   {npc_map_mapping_tplt,% 地图对应npc关系
	    [{int, id},         % 地图主键
	     {int, npc_id},     % 关联的npc
	     {string, npc_name},% npc名称
	     {float, x},        % x轴坐标
	     {float, y},        % y轴坐标
	     {float, z},        % z轴坐标
	     {int, script_id},  % 执行脚本编号
	     {int, action},     % 自动播放动作
	     {int, towards}     % 朝向
	    ]},
	   {player_level_tplt,    % 玩家等级与时长对照关系
	    [{int, level},        % 玩家等级
	     {int, online_time} % 玩家在线时长
	    ]},
	   {sys_shop_tplt,            %% 系统商城
	    [{int, goods_id},         %% 商品ID
	     {int, item_id},          %% 物品ID
	     {int, type},             %% 分类
	     {int, money_type},       %% 1. 爱情水晶
	     {int, price},            %% 价格
	     {int, point},            %% 玩家积分
	     {int, intro},            %% 介绍
	     {int, commend},          %% 推荐
	     {int, broadcast_id},     %% 系统公告id
	     {int, sex},              %% 性别
	     {int, player_level},     %% 玩家等级
	     {int, visible},          %% 是否可见(0表示不可见) 
	     {int, newcomer}          %% 新手是否显示
	    ]},
	   {npc_shop_tplt,            %% 系统商城
	    [{int, goods_id},         %% 商品ID
	     {int, item_id},          %% 物品ID
	     {int, type},             %% 分类
	     {int, sex},              %% 性别
	     {int, price},            %% 玩家买进物品的价格
	     {int, intro},            %% 介绍
	     {int, sale_type}         %% 销售类型
	    ]},
	   {furni_tplt,               %% 家具模板表
	    [{int, furniture_id},     %% 家具Id
	     {int, max_use_player},   %% 最大使用人数
	     {int, use_sex},          %% 使用的性别 
	     {int, permission},       %% 使用权限
	     {list_int, function_list},%% 功能列表
	     {int, use_type},          %% 使用类型
	     {int, status_qty}          %% 状态数量
	    ]},
	   {furni_interact_tplt,
	    [{int, function_id},      %% 功能id
	     {int, property_id},      %% 玩家属性Id
	     {int, status}            %% 修改的家具状态
	    ]},
	   {common_define_tplt,                     %% 公共定义模板表
	   [{string, key},                          
	    {string, value}
	   ]},
	   {player_disease_probability_tplt,  %% 玩家疾病触发几率表
	    [{int, player_health},          %% 人物清洁度
	     {int, probability}               %% 触发几率
	    ]},
	   {player_disease_type_tplt,         %% 疾病类型模板表
	   [{int, type},                      %% 疾病类型
	    {int, rate},                      %% 得不同疾病的比例
	    {int, upgrate_probability},       %% 提高触发几率
	    {int, level},                     %% 疾病的等级
	    {int, treatment_costs},           %% 治疗费用
	    {int, min},                       %% 最小浮动值
	    {int, max},                       %% 最大浮动值
	    {list_int, special_event_id},     %% 特殊事件Id
	    {list_int, event_id_probability}, %% 特殊事件Id的几率
	    {int, special_event_probability}  %% 特殊事件几率
	   ]},
	   {player_disease_special_event_tplt,%% 疾病特殊事件模板表
	     [{int, special_event_id},          %% 特殊事件Id
	     {int, property_id},               %% 影响的属性Id
	     {string, image}                   %% 图片地址
	    ]},
	   {house_transaction_tplt,           %% 房屋交易表
	   [{int, id},                        %% 主键Id
	    {string, name},                   %% 名称
	    {int, type},                      %% 类型
	    {int, recommend},                 %% 推荐
	    {int, level},                     %% 等级
	    {int, pay_type},                  %% 支付类型
	    {int, price},                     %% 价格
	    {int, house_id},                  %% 对应的房屋模板Id
	    {string, intro},                  %% 简介
	    {int, broadcast_id}               %% 系统公告id
	   ]},
	   {sys_broadcast_tplt,               %% 系统公告
	   [{int, id},                        %% 主键Id
	    {string, content},                %% 内容
	    {int, show_seconds}               %% 显示时间
	   ]},
	   {holiday_gift,                     %% 节日礼物
	   [{int, sequence_id},               %% 流水号 
	    {int, start_day},                 %% 起始日期格式:yyyymmdd
	    {int, duration},                  %% 持继天数
	    {int, group_id},                  %% 组(这个字段日前好像没什么用)	         
	    {int, gift_type},	              %% 礼物类型
	    {int, item_id},	              %% 物品id
	    {int, count},	              %% 物品个数 or 爱情水晶数
	    {int, rate}                       %% 获得的机率
	   ]},

	   {level_info_tplt,            %% 等级对照表
	   [{int, level},               %% 等级 
	    {int, exp},                 %% 升级需要的经验值
	    {int, max_hp},              %% 最大体力值
	    {int, hp_restore_time},     %% 多久才能加一点体力
	    {int, max_decoration},       % 最大装修度
	    {float, party_owner_calc_exp_a}, %% 豪华度/当前预期豪华度*系数A*累积时间
	    {float, party_guest_calc_exp_b}, %% 豪华度/当前预期豪华度*系数B*累积时间
	    {int, party_cost_money},  %% 派对消耗体力
	    {int, party_add_score}    %% 投票帮别人增加多少分数
	   ]},

	   {flower_tplt,                              %% 花藤模板表
	    [{int, id},                               %% 自增长Id
	     {int, flower_id},                        %% 花藤Id
	     {int, level},                            %% 花藤的等级
	     {int, grow},                             %% 成长值
	     {string, model},                         %% 模型名称
	     {string, particle}
	    ]},
	   {gift_box_tplt,                    %% 礼物盒
	    [{int, id},                       %% ID
	     {int, type},                     %% 类型
	     {string, name},                  %% 名称
	     {int, price},                    %% 价格
	     {string, model},                 %% 模型
	     {string, icon},                  %% 图标
	     {string, intro}                  %% 简介
	    ]},
	   {props_item_tplt,                  %% 道具物品
	    [{int, id},                       %% 物品ID, 和物品表的ID相同
	     {int, target},                   %% 使用对象, 1 -- 对自己使用, 2 -- 对其他人使用, 3 -- 范围使用
	     {int, del},                      %% 使用后是否删除
	     {string, intro},                 %% 使用说明
	     {string, movie},                 %% 播放指定的动画
	     {int, ui},                       %% 指定的界面
	     {string, audio},                 %% 播放指定的声音
	     {int, sysmsg},                   %% 显示指定的消息, 该值是系统消息中定义的ID值
	     {string, module},                %% 要执行的脚本的模块名
	     {string, arguments}              %% 参数
	    ]},
	   {player_task_tplt,                 %% 玩家任务基础表
	    [{int, task_id},                  %% 任务Id
	     {string, icon},                  %% 任务图标
	     {string, title},                 %% 任务标题
	     {string, describe},              %% 任务目标
	     {list_int, require_items},       %% 需要的物品
	     {list_int, require_items_count}, %% 需要物品的数量 
	     {list_int, reward_items},        %% 奖励物品
	     {list_int, reward_items_count},  %% 奖励物品的数量
	     {int, diamond},                  %% 奖励的水晶
	     {int, experience},               %% 奖励的经验值
	     {int, hp},                       %% 奖励的体力值
	     {int, point},                    %% 奖励的积分
	     {int, love_coin},		      %% 奖励爱情币
	     {int, is_show},                  %% 是否显示
	     {int, q_coin},                   %% 立即完成需要的Q币
	     {string, target1},               %% 目标1
	     {string, target2},               %% 目标2
	     {string, target3},               %% 目标3
	     {int, type},                     %% 任务类型
	     {int, need_player_level}         %% 玩家所需等级
	    ]},
	   {daily_task_tplt,                  %% 每日任务
	    [{int, id},                       %% 每日任务Id
	     {int, task_id},                  %% 对应的基础任务Id
	     {int, use_type},                 %% 使用类型, 1:单身, 2:配对过的 
	     {int, level},
	     {int, rate},
	     {int, diamond}                   %% 替换任务需要耗费的水晶
	    ]},
	   {chain_task_tplt,                  %% 链式任务
	    [
	     {int, id},                       %% 主键Id
	     {list_int, task_id},             %% 任务Id列表
	     {list_int, next_chain}           %% 下一条链式任务Id
	    ]},
	   {house_right_tplt,                 %% 房屋产权
	    [{int, grade},                    %% 等级
	     {string, desc},                  %% 描述                      
	     {int, money_type},               %% 金钱类型(1为游戏金币，2为点卡点数)
	     {int, money},                    %% 金钱数量
	     {int, material1},
	     {int, material1_shop_id},
	     {int, num1},
	     {int, material2},
	     {int, material2_shop_id},
	     {int, num2},
	     {int, material3},
	     {int, material3_shop_id},
	     {int, num3},
	     {int, material4},
	     {int, material4_shop_id},
	     {int, num4},
	     {string, icon},
	     {string, hover_icon}
	    ]},
	   {special_house_tplt,               %% 特殊产权
	    [{int, id},                       %% 流水号(相同流水号只会被加载一次，所以流水号一定要一直增加) 
	     {int, house_tplt_id},            %% 房屋id
	     {int, q_coin},                   %% Q币
	     {int, count},                    %% 发行数量
	     {int, broadcast_id}              %% 公告id
	    ]},
	   {player_special_house_tplt,
	    [{int, id},
	     {list_int, unlock_house_ids},
	     {int, love_coin},
	     {int, broadcast_id},
	     {string, name},
	     {string, desc},
	     {string, icon},
	     {string, big_icon},
	     {int, decoration},
	     {int, furniture_count},
	     {int, is_show}
	    ]},
	   {player_login_reward_tplt,
	    [{int, day},                      %% 对应的天数
	     {int, diamond},                  %% 奖励的水晶
	     {list_int, items},               %% 奖励的物品Id
	     {list_int, items_count},         %% 奖励的物品数量
	     {int, exp},                      %% 奖励的经验
	     {int, point}                     %% 奖励的积分
	    ]},
	   {polymorph_props_item_tplt,
	    [{int, id},                       %% ID
	     {int, duration},                 %% 持续时间
	     {int, effect_id},                %% 效果ID
	     {string, message}                %% 使用结果信息
	    ]},
	   {lottery_item_tplt,                %% 抽奖物品(粽子)
	    [{int, id},                       %% 维一id
	     {int, group_id},                 %% 组id
	     {int, item_id},                  %% 物品id
	     {int, item_count},               %% 物品数量  
	     {int, rate}                      %% 机率 
	    ]},
	   {score_lottery_item_tplt,                %% 抽奖物品(带积分)
	    [{int, id},                       %% 维一id
	     {int, group_id},                 %% 组id
	     {int, item_id},                  %% 物品id
	     {int, item_count},               %% 物品数量  
	     {int, rate}                      %% 机率 
	    ]},
	   {search_item_tplt,                 %% 收集物品
	    [{int, id},                       %% 维一id
	     {int, type},                     %% 类型(0 普通物品, 1 特殊物品)
	     {int, item_id},                  %% 物品id
	     {int, rate}                      %% 机率 
	    ]},
	   {charm_rate_tplt,                  %% 魅力几率表
	    [{int, charm},                     %% 魅力
	    {int, rate}                       %% 机率整数0 - 100 
	   ]},
	   {rate_tplt,                        %% 几率表
	    [{int, id},                       %% 几率Id
	     {int, rate},                     %% 几率
	     {int, type}                      %% 几率类型
	    ]},
	   {item_dress_additional_properties_tplt,      %% 服装附加属性
	    [{int, id},                                 %% 服装ID
	     {string, charm}                            %% 魅力值
	    ]},
	   {furniture_additional_properties_tplt,                %% 服装附加属性
	    [{int, id},                                      %% 服装ID
	     {int, decoration}                               %% 装修度
	    ]},
	   {event_tplt,               %% 事件表
	    [{int, id},                %% Id
	     {string, event},          %% 事件名称
	     {int, rate},              %% 几率
	     {int, item_id},           %% 奖励的物品Id
	     {int, diamond},           %% 奖励的水晶
	     {int, exp},               %% 奖励的经验值
	     {int, hp}                 %% 奖励的体力值
	    ]},
	   {produce_level_tplt,
	    [{int, level},
	     {int, experience},
	     {int, horizontal}
	    ]},
	   {produce_manual_tplt,              %% 物品制作图谱
	    [{int, item_id},                  %% item_id
	     {int, produce_level},            %% 合成等级
	     {int, consume_diamond},          %% 消耗水晶
	     {string, material_item},         %% 原材料
	     {string, finished_item},         %% 成品
	     {int, success_rate},             %% 成功概率
	     {int, experience}                %% 经验值
	    ]},
	   {daily_active_tplt,                %% 每日活跃项
	    [{int, id},                       %% 
	     {string, desc},                  %% 任务内容（文字)
	     {list_string, event},            %% 检查事件的api 
	     {int, add_score},                %% 每次加多少分 
	     {int, max_score}                 %%
	    ]},	   
	   {daily_active_score_tplt,          %% 每日活跃奖励
	    [{int, score},                    %% 
	     {list_int, reward_items},        %% 奖励物品
	     {list_int, reward_items_count},  %% 奖励物品的数量
	     {int, diamond},                  %% 奖励的水晶
	     {int, exp},                      %% 奖励的经验
	     {int, point}                     %% 奖励的积分
	    ]},	   
	   {daily_active_tplt_1,                %% 每日活跃项
	    [{int, id},                       %% 
	     {string, desc},                  %% 任务内容（文字)
	     {list_string, event},            %% 检查事件的api 
	     {int, add_score},                %% 每次加多少分 
	     {int, max_score}                 %%
	    ]},	   
	   {daily_active_score_tplt_1,          %% 每日活跃奖励
	    [{int, score},                    %% 
	     {list_int, reward_items},        %% 奖励物品
	     {list_int, reward_items_count},  %% 奖励物品的数量
	     {int, diamond},                  %% 奖励的水晶
	     {int, exp}                       %% 奖励的经验
	    ]},	   
	   {crop_tplt,                        %% 作物表
	    [{int, crop_id},                  %% crop_id
	     {string, name},                  %% 种子的中文名
	     {int, price_type},               %% 价格类型: 1-水晶   2-爱情币
	     {int, price},                    %% 具体的价格
	     {int, level},                    %% 玩家需要几级（人物等级）才能够种植
	     {int, event_count},              %% 成长期间发生的事件次数
	     {int, ripe_time},                %% 成熟所需的时间
	     {string, fruit_id},              %% 果实的ID
	     {int, count},                    %% 数量
	     {string, intro},                 %% 介绍
	     {string, seedling},              %% 小苗模型
	     {string, fruit_model},           %% 成熟模型
	     {string, icon}                   %% 图标
	    ]},
	   {ring_task_front_task_tplt,
	    [{int, ring_count},
	     {int, type},
	     {int, id}
	    ]},
	   {dialogue_task_tplt,
	    [{int, id},
	     {string, content},
	     {string, npc_options},
	     {string, npc_content},
	     {string, target},
	     {int, npc_id},
	     {string, npc_name}
	    ]},
	   {deliver_goods_task_tplt,
	    [{int, id},
	     {string, content},
	     {string, npc_options},
	     {string, npc_content},
	     {string, target},
	     {int, npc_id},
	     {string, npc_name},
	     {int, require_item}
	    ]},
	   {find_item_task_tplt,
	    [{int, id},
	     {string, content},
	     {string, npc_options},
	     {string, npc_content},
	     {string, target},
	     {int, area_event_id},
	     {string, map_name},
	     {int, reward_item}
	    ]},
	   {collect_task_tplt,
	    [{int, id},
	     {string, content},
	     {string, target},
	     {int, require_item},
	     {int, require_item_count}
	    ]},
	   {function_task_tplt,
	    [{int, id},
	     {string, content},
	     {string, target},
	     {string, event},
	     {int, count}
	    ]},
	   {post_reward_task_tplt,
	    [{int, id},
	     {string, content},
	     {int, require_item1},
	     {int, require_item1_count},
	     {string, require_item1_content},
	     {int, require_item2},
	     {int, require_item2_count},
	     {string, require_item2_content},
	     {int, require_item3},
	     {int, require_item3_count},
	     {string, require_item3_content},
	     {list_int, reward_items},
	     {list_int, reward_items_count},
	     {int, reward_diamond},
	     {int, reward_exp}
	    ]},
	   {ring_task_tplt,
	    [{int, ring_count},
	     {int, due_time},
	     {int, start_require_item},
	     {int, stop_require_item},
	     {int, stop_require_item_count},
	     {list_int, reward_items},
	     {list_int, reward_items_count},
	     {int, reward_diamond},
	     {int, reward_exp},
	     {int, q_coin}
	    ]},
	   {mind_quiz_tplt,
	    [{int, level},
	     {int, reward_items_probability},
	     {list_int, reward_items},
	     {list_int, reward_items_count},
	     {int, reward_diamond},
	     {int, reward_exp}
	    ]},
	   {intimate_level,
	    [{int, level},
	     {int, toplimit},
	     {string, name},
	     {string, tooltip},
	     {string, icon}
	    ]},
	   {mateup_diamond,
	    [{int, level},
	     {int, diamond}
	    ]},
	   {make_up_tplt,  %% 补偿表
	    [{int, level},  %% 等级
	     {string, items}%% 物品列表 
	    ]},
	   {flower_shake_tplt,
	    [{int, nthtime},
	     {int, diamond},
	     {int, exp},
	     {int, item_id},
	     {int, item_count},
	     {int, love_coin}
	    ]},	   
	   {flower_love_coin_shake_tplt,
	    [{int, nthtime},
	     {int, diamond},
	     {int, exp},
	     {int, item_id},
	     {int, item_count},
	     {int, love_coin},
	     {int, item_rate}
	    ]},	   
	   {single_payment_return_tplt,
	    [{int, consume_amount},
	     {string, award_items}
	    ]},
	   {total_payment_return_tplt,
	    [{int, consume_amount},
	     {int, return_diamond},
	     {string, return_items}
	    ]},
	   {item_upgrade_tplt,
	    [{int, item_sub_id},
	     {string, consume_items},
	     {int, consume_diamond},
	     {int, upgraded_item_id},
	     {int, upgraded_property}
	    ]
	   },
	   {yy_gift_tplt,
	    [{int, id},             
	     {int, type},       %% 礼物类别，1.热门，2.普通，3.高级，4.豪华，5.道具  
	     {int, hot},
	     {int, price},      %% 礼物价格
	     {int, recv_price}, %% 实收价格
	     {int, probability}, %% 返回概率
	     {int, back_price},  %% 返回价格
	     {int, display_type},
	     {int, display_id}
	    ]
	   },
	   
	   {love_coin_recharge_tplt,
	    [{int, id},
	     {int, buy_love_coin},
	     {int, reward_love_coin},
	     {int, q_coin}
	    ]},
	   {flowerpot_unlock,    %% 解锁花盆
	    [{int, number},
	     {int, level},
	     {int, coin},
	     {int, item_id1},    %% 物品ID
	     {int, goods_id1},   %% 商品ID
	     {int, count1},
	     {int, item_id2},
	     {int, goods_id2},   %% 商品ID
	     {int, count2},
	     {int, item_id3},
	     {int, goods_id3},   %% 商品ID
	     {int, count3},
	     {int, item_id4},
	     {int, goods_id4},   %% 商品ID
	     {int, count4}
	    ]},
	   {normal_sprite_tplt,         %% 小精灵模板表
	    [{int, id},          %% 精灵ID
	     {int, appraise},    %% 评价到达多少后, 出现小精灵
	     {int, hp},          %% 点击小精灵需要消耗多少体力
	     {int, buff_id},     %% buff的id, 如果不给buff, 就填0
	     {string, modal},    %% 精灵模型
	     {string, show},     %% 出现时的显示动画
	     {string, dispear},  %% 消失时的显示动画
	     {string, particle}  %% 粒子效果
	    ]},
	   {sprite_upgrade_tplt, %% 小精灵升级模板表
	    [{int, index},       %% 索引值, 无用的
	     {int, id},          %% 精灵ID
	     {int, level},    
	     {int, show_count},  
	     {int, award_money},
	     {int, award_exp}, 
	     {string, award_item}
	    ]},

	   {sys_shop_class_tplt,
	    [{int, id},
	     {int, type},
	     {int, buytype},
	     {string, icon},
	     {string, description},
	     {int, newcomer},
	     {int, auto_fitment},
	     {int, unlock},
	     {int, unlock_level},
	     {int, unlock_money},
	     {list_int, unlock_material},
	     {list_int, unlock_material_count},
	     {list_int, unlock_material_shop_id}
	    ]},
	   {exp_transition,
	    [{int, old_min},
	     {int, old_max},
	     {int, new_min},
	     {int, new_max}
	    ]},
	   {exchange_tplt,
	   [{int, id},
	    {int, type},
	    {int, item1_id},
	    {int, item1_num},
	    {int, item2_id},
	    {int, item2_num},
	    {int, item3_id},
	    {int, item3_num},
	    {int, item4_id},
	    {int, item4_num},
	    {string, reward_module},
	    {string, source_icon},
	    {string, reward_icon}, 
	    {string, reward_params}
	   ]},
	   {player_food_tplt,                  %% 食物系统
	    [{int, id},                        %% id
	     {int, upgrade_id},                %% 对应的升级表Id
	     {int, level},                     %% 解锁需要的等级
	     {int, is_lock},                   %% 默认是否锁住
	     {int, min_stock},                 %% 最小库存
	     {int, max_stock},                 %% 最大库存
	     {list_int, expand_stock_diamond}, %% 扩充库存需要的水晶
	     {list_int, expand_stock_time},    %% 扩充库存需要的时间
	     {list_int, expand_stock_love_coin},%% 扩充库存需要的爱情币
	     {int, max_upgrade_level},
	     {int, player_level},
	     {int, house_level},
	     {int, unlock_diamond},
	     {string, particle},
	     {string, unsatisfy}
	    ]},
	   {player_food_upgrade_tplt,          %% 食物升级表
	    [{int, upgrade_id},                %% 升级表Id
	     {list_int, item_ids},             %% 升级需要的物品
	     {list_int, item_count},           %% 升级需要的数量
	     {list_int, shop_ids},
	     {int, decoration},                %% 升级需要的豪华度
	     {int, diamond},                   %% 升级需要的水晶
	     {int, next_upgrade_id}            %% 下一级升级Id
	    ]},
	   {player_food_product_tplt,          %% 食物生产表
	    [{int, product_id},                %% 产品表Id跟食物升级表Id一一对应
	     {string, name},                   %% 名称
	     {string, icon},                   %% 图标
	     {int, level},                     %% 星级
	     {int, diamond},                   %% 水晶
	     {int, consume_time},              %% 消耗的时间
	     {int, copies},                    %% 每格几份
	     {float, price},                   %% 每份价格
	     {int, consume_speed},             %% 消耗速度
	     {int, sale_time},                 %% 销售时间
	     {int, love_coin},                 %% 立即完成需要耗费的爱情币
	     {string, desc}                    %% 描述
	    ]},
	   {player_food_produce_area_tplt,     %% 食物生产区域表
	    [{int, id},
	     {list_int, item_ids},
	     {list_int, item_count},
	     {list_int, shop_ids},
	     {int, diamond}
	    ]},
	   {buff_tplt,                   %% buff
	    [{int, id},                  %% buff的ID
	     {int, type},                %% 类型
	     {int, duration},            %% 持续时间
	     {string, normal_icon},      %% 正常的icon
	     {string, disable_icon},     %% 不可用的icon
	     {string, hint},             %% 界面提示
	     {string, sys_msg},          %% 系统消息的提示
	     {string, param}             %% 参数
	    ]},
	   {waiter_tplt,		  %% 侍者模板表
	    [{int, id},			  %% 侍者id
	     {string, waiter_name},	  %% 侍者名字
	     {int, waiter_lv},		  %% 侍者等级
	     {int, waiter_type},		  %% 侍者类别
	     {int, player_lv},             %% 雇佣玩家等级
	     {string, explain},            %% 说明
	     {int, coin_rate},             %% 提升水晶出现几率
	     {int, exp_rate},              %% 提升经验出现几率
	     {int, item_drop_rate},        %% 提升物品掉落几率
	     {string, speciality_explain}, %% 特长说明
	     {int, employ_money},	  %% 雇佣价格
	     {string, waiter_mod_name},	  %% 侍者模型文件名
	     {string, picture},            %% 侍者头像
	     {int, up_id},                 %% 升级后侍者ID
	     {int, up_coin},               %% 升级需要价格
	     {int, up_house_lv}            % 升级需要房屋等级
	    ]},
	   {party_drink_tplt,              %% 派对请喝酒
	    [{int, id},			   %% 食物ID
	     {string, name},		   %% 名称
	     {int, price},	           %% 需要花费多少
	     {int, type},		   %% 花费的类型
	     {int, master_score},          %% 主人可以获得多少积分
	     {int, guest_score},           %% 客人可以获得多少积分
	     {int, shout_count},           %% 请客上限
	     {int, shouted_count}          %% 被请客的上限
	    ]},
	   {player_charm_tplt,
	    [{int, id},
	     {string, name},
	     {int, sex}
	    ]},
	   {party_food_tplt,
	    [{int, id},				%% 食物ID
	     {int, diamond},			%% 消耗水晶
	     {int, hp},				%% 奖励体力
	     {int, point},			%% 奖励积分
	     {list_int, item_ids},		%% 给予的物品id
	     {list_int, item_counts},		%% 给予的物品数量
	     {list_int, item_rate},		%% 给予的物品几率
	     {string, food_name},		%% 食物名字
	     {string, model_name},		%% 模型名字
	     {list_int, item_box_ids},		%% 宝箱ID
	     {list_int, item_box_counts}	%% 宝箱数量
	    ]}
	  ])
       ).
