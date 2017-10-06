% Author: NoteBook
%% Created: 2009-9-9
%% Description: 网络协议模块的定义
-module(net_protocal_def).


-export([get_struct_def/0, get_enum_def/0, get_version/0]).

%% 获得消息结构体的定义
get_struct_def() -> 
    [
     %%------------------------这两条置顶---------------------------
     [req_login,                                          % 请求登录
      {int, version},                                     % 版本号
      {string, login_type},                               % 登陆目标(朋友网, QQ)
      {string, account},                                  % 用户帐号
      {string, password},                                 % 用户密码
      {string, pf_key},                                   % 平台信息加密串
      {string, iopenid},                                  % 邀请人的OpenID
      {int, srvid},                                       % YY平台的服务ID
      {int, ch}                                           % YY平台的频道
     ],

     [notify_login_result,                                %返回登录结果
      {login_result, result},                              
      {string, nick_name},                                % 名字
      {sex_type, sex}                                     % 性别
     ],

     %%------------------------公共数据---------------------------
     % 坐标数据, 现在这个只作为结构体用，不作为消息
     [stime, 
      {int, year},
      {int, month},
      {int, day},
      {int, hour},
      {int, minute},
      {int, second}
     ],
     [point,
      {float, x},
      {float, y},
      {float, z}
     ],

     [grid_pos,  %% 格子坐标点
      {int, x},
      {int, y},
      {int, z}
     ],

     [item_property,
      {string, key},
      {int, value}
     ],
     
     [item,                                               % 物品
      {uint64, instance_id},                              % 物品实例ID
      {int,    template_id},                              % 物品模板ID
      {stime,  del_time},                                 % 删除时间
      {array, item_property, property}
     ],
     [visit_log,
      {string,account},
      {string,openid},
      {stime, visit_time}
     ],
     [guest_book,                                        % 留言板
      {uint64, id},                                      % ID     
      {string,account},                                  % 用户账户
      {string, content},                                 % 留言内容
      {int, opened},                                     % 是否公开的 0-否，1-是
      {stime, create_time}                               % 留言时间
     ],

     [pack_grid,                                          % 包裹格
      {int, count},                                       % 格子里面存放的物品的数量
      {int, lock},                                        % 格子是否被锁住
      {item, item_data}                                   % 物品数据
     ],
     [polymorph,                                          % 变身内容
      {int, id},                                          % 变身Id
      {int, duration},                                    % 持续时间
      {stime, start_at}                                   % 开始时间
     ],
     [player_basic_data,                                  % 玩家基础数据
      {string, account},                                  % 用户帐号
      {string, username},                                 % 用户名称
      {int, sex},                                         % 性别
      {int, skin_color},                                  % 肤色(身体)
      {int, hair},                                        % 发型
      {int, face},                                        % 脸型
      {int, beard},                                       % 胡子
      {float, online_time},                               % 在线时长
      {int, hair_color},                                  % 发色
      {stime, last_login_time},                           % 最后登录时间
      {uint64, house_id},                                 % 房间id
      {int, mateup_status},                               % 配对状态 [mst_single, mst_mateuping, mst_mateuped]
      {int, hp},                                          % 体力值
      {array, pack_grid, body},                           % 玩家装备      
      {stime, hp_update_time},                            % 体力值更新时间(最后一次)
      {stime, create_time},                               % 角色创建时间
      {string, first_photo_player},                       % 照片交友的当前玩家
      {int, animal_type},    % 生肖(0 表示 未知)
      {stime, birthday},     % 生日
      {int, star},           % 星座(0 表示 未知)
      {int, height},           % 身高(0 表示 未知)
      {int, salary},           % 薪资(0 表示 未知)
      {int, blood_type},       % 血型(0 表示 未知)
      {int, education},        % 学历(0 表示 未知) 
      {string, contact},        % 联系方式
      {string, interest},       % 爱好
      {string, signature},      % 个性签名
      {int, city}, % 居住城市(0 表示 未知)
      {int, province}, % 居住城市中的哪个片区(0 表示 未知)
      {string, career},        % 职业
      {int, weight},           % 体重
      {polymorph, alter_body}, % 变身后的身体
      {int, charm},            % 魅力值
      {int, produce_experience},  % 合成经验
      {int, produce_level}     % 合成等级
     ],

     [player_info,
      {player_basic_data, basic_data},                    % 玩家基本信息
      {string, scenename}                                 % 玩家所在场景名称
     ],  

     [npc_info,
      {int, npc_id},                                      % Npc主键
      {int, body},                                        % 身体
      {int, head},                                        % 头
      {int, hair},                                        % 头发
      {int, equip1},                                      % 初始装备1
      {int, equip2},                                      % 初始装备2
      {int, skeleton},                                    % 骨骼
      {string, npc_name}                                  % npc名称(注释用)
     ],

     [npc_map_mapping_info,
      {int, id},
      {int, npc_id},                                      % 关联的npc主键
      {string, npc_name},                                 % npc名称(显示在地图上)
      {point, pos},                                       % npc坐标
      {int, script_id},                                   % 执行的脚本编号
      {int, action},                                      % 自动播放的动作
      {string, npc_key},                                  % npc在地图中的唯一标识
      {int, towards}
     ],


     [furniture_position,                                 % 家具使用位置
      {int, position_index},                              % 索引位置
      {int, is_used},                                     % 是否被使用
      {string, used_account},                             % 使用帐号
      {int, status},                                      % 家具状态
      {int, func_id},                                     % 功能Id
      {stime, use_time}                                   % 使用时间 
     ],

     [furniture_goods_data,
      {int, goods_id},    % 商品ID
      {int, x},           % x坐标
      {int, z},           % z坐标
      {float, height},      % 离地高度
      {int, floor},       % 楼层
      {int, face}         % 朝向
     ],

     [setting_info,
      {string, name},
      {int, value}
     ],
     [player_setting,
      {string, account},
      {array, setting_info, info}
     ],

     [house_furniture,                                    % 房屋家具
      {uint64, instance_id},                              % 物件实例ID
      {int, template_id},                                 % 物件的模板ID
      {int, x},                                           % 坐标
      {int, z},                                           % 坐标
      {float, height},                                    % 离地高度
      {int, floor},                                       % 楼层
      {int, face},                                        % 朝向
      {int, item_tempid},                                 % 家具对应的物品模板表ID
      {int, status},                                      % 当前状态
      {stime, del_time},                                  % 删除时间
      {array, item_property, property}                    % 物品属性  
     ],

     [room_tex,         % 房间墙纸, 地板
      {int, room_id},   % 房间ID
      {int, type},      % 类型(地板，墙)
      {string, tex},    % 纹理
      {int, floor_id}   % 楼层ID 
     ],

     [house_info,                                         % 房屋数据
      {uint64, house_id},                                 % 房屋的主人
      {int, template_id},                                 % 房屋的模板ID
      {furniture_permission_type, furniture_permission},  % 使用家具权限
      {array, house_furniture, furniture_vec},            % 房屋内的家具集合
      {array, room_tex, room_tex_vec},                    % 房屋墙纸的集合
      {string, welcome_words},                            % 欢迎语
      {house_permission_type, house_permission},          % 房屋权限
      {array, visit_log, visit_logs},                     % 房屋访问记录
      {stime, buy_date},                                  % 购买日期
      {int, level},                                       % 等级  
      {int, house_clean},                                 % 房屋清洁度
      {string, boy},                                      % 男主人
      {string, girl},                                     % 女主人
      {string, name},                                     % 房间名字
      {int, mateup_status},                               % 配对情况
      {int, decoration}                                   % 装修度
     ],

     %-----------------------登录流程---------------------------


     [notify_repeat_login,                                % 通知客户端重复登陆
      {string, account}                                   % 用户帐号
     ],

     [req_create_role,                                    % 请求创建角色
      {player_basic_data, basic_data},                    % 玩家信息
      {array, item, equips},                              % 玩家身体,用于盛放装备(时装)
      {string, iopenid}                                   % 邀请人的ID
     ],

     [notify_create_role_result,                          % 返回角色创建结果
      {create_role_result, result}
     ],

     [req_enter_game                                      % 请求进入游戏
     ],

     [notify_enter_game                                   % 通知进入游戏
     ],
  
     [notify_body_data,                                   % 发送玩家身体数据给客户端
      {array, pack_grid, grid_vec}                        % 玩家的身体数据
     ],

     [client_ready_for_pop_msg                            % 客户端可以弹消息了
     ],

     [pair_int,
      {int, key},
      {int, value}
     ],
     %-----------------------切换场景----------------------------
     [req_enter_player_house,    % 请求进入目标玩家房屋
      {enter_house_type, type},  % 从那个地方进入玩家房屋
      {string, account}          % 目标玩家帐号
     ],

     [notify_enter_player_house, % 自已进入玩家场景(进入自已家 或 进入朋友家都会收到此消息)
      {int, house_tplt_id},     % 房屋的模板ID
      {house_info, data},       % 房屋数据
      {point, enter_pos}        % 进入点
     ],
     
     [req_scene_copy_list,    % 查询公共场景分线状态
      {int, template_id}        % 场景模板ID
     ],

     [notify_scene_copy_list, % 查询公共场景分线状态
      {int, template_id},       % 场景模板ID
      {array, int, state_list}  % (-1表示分线出故障, 0表示空闲, 1 表示拥挤 2表示爆满)
     ],
     
     [req_enter_common_scene,    % 进入公共场景
      {int, template_id},        % 场景模板ID
      {int, copy_id}          % 副本id(从0开始, -1表示自动选择副本)
     ],     

     [notify_enter_common_scene, % 自已进入公共场景
      {int, template_id},        % 场景模板ID
      {int, copy_id},            % 副本id
      {point, enter_pos}         % 进入点
     ],

     [req_kick_guest,        % 踢人
      {string, target_player} % 被踢玩家
     ],

     [notify_other_player_data,         % 新玩家登陆后发送相关信息给用户
      {player_info, player},            % 玩家的基本信息
      {point, curr_pos},                % 玩家的当前点坐标
      {point, dest_pos},                % 玩家的目标点坐标
      {walk_type, type}
     ],
     
     [notify_other_player_info,         % 其它玩家信息
      {player_info, player}             % 玩家的基本信息
     ],

     [req_other_player_info,            % 请求查看其它玩家信息
      {string, account}                 % 玩家账号
     ],

     [notify_player_leave_scene,    % 通知有玩家离开场景
      {string, account}             % 玩家帐号
     ],
     %-----------------------------------------------------------		
     [req_logout % 请求退出
     ],

     [notify_player_data, 	 % 发送玩家的详细信息
      {player_basic_data, basic_data} %玩家的基本信息
     ],

     %-------------------------------------------------------------
     % 行走相关
     [req_start_walk,    % 请求开始行走
      {point, curr_pos}, % 当前位置
      {point, dest_pos}  % 目标位置
     ],
     [notify_start_walk, % 通知周边玩家开始行走
      {string, account}, % 帐号
      {point, curr_pos}, % 当前位置
      {point, dest_pos}  % 目标位置   
     ], 

     [req_stop_walk,     % 请求结束行走
      {point, pos}       % 玩家当前位置
     ],
     [notify_stop_walk,  % 通知周边玩家停止行走
      {string, account}, % 帐号
      {point, pos}
     ],

     [req_sync_walk_type,
      {walk_type, type}
     ],

     [notify_sync_walk_type,
      {string, account},
      {walk_type, type}
     ],
 
     [req_sync_position, % 请求同步坐标
      {point, pos}
     ],

     [req_walk_for_use_furniture,  % 行走计划(使用家具
      {point, curr_pos}, % 当前位置
      {point, dest_pos},  % 目标位置
      {uint64, instance_id},    % 家具id
      {int, function_id},       % 功能Id
      {int, furni_temp_id},     % 发过来，省得服务端再去读数据库
      {int, status}             % 家具当前的状态值(信任客户端的状态值)
     ],

     %-------------------------------------------------------------
     % 好友相关
     %%----------------------------------好友列表---------------------------------%%
     [player_basic_information,      %% 好友信息
      {string, account},       %% 好友账户
      {string, imageurl},      %% 好友头像Url
      {string, nickname},       %% 好友名字
      {int, is_yellow_vip},     %% 是否是黄钻会员 0：不是； 1：是
      {int, is_yellow_year_vip}, %% 是否是黄钻年费会员 0：不是； 1：是
      {int, yellow_vip_level}   %% 黄钻级别
     ],
     [friend_item,                 %% 好友列表
      {string, account},           %% 好友账户
      {uint64, house_id},          %% 好友的房屋Id
      {int, house_level},          %% 房屋等级
      {int, intimate},             %% 魅力值
      {int, crop_event}          %% 0 表示无事件, 非0 表示需要浇水or施肥      
     ],

     [req_friend_list        % 取好友列表
     ],

     [notify_player_friend_list,      %% 好友列表
      {array, friend_item, friend_list}
     ],

     [req_invite_list     %% 请求邀请列表
     ],
     
     [notify_invite_list, %% 返回邀请列表
      {array, friend_item, friend_list}
     ],
     %-------------------------------------------------------------
     % 聊天相关
     [req_chat_around,   % 说话, 周围的人可以听到
      {string, content}  % 说话内容
     ],

     [notify_chat_around, % 通知周围的人玩家说了一句话
      {string, account},  % 说话的玩家账号
      {string, player_name}, %% 玩家姓名
      {string, content}   % 说话内容
     ],

     [req_chat_tell,     % 密聊 
      {string, target_player}, % 目标玩家
      {string, content}  % 说话内容
     ],
     
     [notify_chat_tell, % 通知玩家收到密聊信息
      {string, speaker}, % 说话的玩家账号
      {string, speaker_name}, % 说话的玩家姓名
      {string, content} % 说话内容
     ],

     [req_chat_world,   % 说话, 全服可以听到
      {string, content}  % 说话内容
     ],

     [notify_chat_world, % 通知全服的人玩家说了一句话
      {string, account},  % 说话的玩家账号
      {string, player_name}, %% 玩家姓名
      {string, content}   % 说话内容
     ],
     %-----------------------房屋相关--------------------------------


     [notify_house_data, % 发送房屋的数据
      {house_info, data} % 房屋数据
     ],

     [furniture_place_info, % 家具摆放信息
      {uint64, instance_id},  % 实例id
      {int, x},           % x坐标
      {int, z},           % z坐标
      {float, height},      % 离地高度
      {int, floor},         % 楼层
      {int, face}           % 朝向
     ],     

     [req_change_furnitures, %% 提交家具变更
      {array, uint64, recovery_furnitures},               %% 回收列表
      {array, furniture_place_info, placed_furnitures},   %% 摆放列表
      {array, furniture_place_info, move_furnitures},     %% 移动列表
      {array, furniture_goods_data, buy_goods_list}       %% 购买列表
     ], 

     [notify_change_furnitures_fail, %% 通知家具变更失败
      {int, error_code},                   %% 这个等同于 系统消息的code
      {array, uint64, unfind_bag_items}   %% 未找到的背包物品      
     ],

     [notify_change_furnitures, %% 通知家具变更
      {array, uint64, del_furnitures},                %% 删除列表
      {array, house_furniture, add_furnitures},       %% 增加列表
      {array, house_furniture, move_furnitures},      %% 移动列表
      {array, pack_grid, add_items},                  %% 增加物品列表
      {array, uint64, del_items},                     %% 删除物品列表
      {int, decoration}                               %% 房屋装饰度
     ], 

     [req_start_edit_house % 请求进入家装模式
     ],
     
     [notify_start_edit_house, % 通知玩家进入家装模式
      {int, result}            % 0 表示失败
     ],

     [req_end_edit_house   % 请求结束家装模式      
     ],

     [notify_end_edit_house % 通知玩家结束家装模式
     ],

     [req_set_house_welcome_words,                        % 请求设置欢迎语
      {string, words}
     ],

     [notify_set_house_welcome_words,                     % 返回设置欢迎语
      {set_house_welcome_words_result, result}
     ],

     [req_set_house_permission,                           % 请求设置房屋权限
      {house_permission_type, house_permission},
      {furniture_permission_type, furniture_permission}
     ],

     [notify_set_house_permission,                        % 返回设置房屋权限
      {set_house_permission_result, result}
     ],

     [req_clear_house_log                                 % 请求清空房屋日志
     ],

     [notify_clear_house_log,                             % 返回清空房屋日志结果
      {clear_house_log_result, result}
     ],


     %----------------------家具相关-------------------------------------
     [notify_start_use_furniture,                        % 返回是否允许使用家具
      {string, account},                                  % 玩家帐号
      {int, position_index},                              % 允许的索引值
      {uint64, instance_id},                              % 家具id
      {int, function_id},                                 % 功能id
      {point, walk_pos}                                  % 行走最终位置
     ],
     
     [req_stop_use_furniture                             % 请求停止使用家具
     ],

     [notify_stop_use_furniture,                        % 通知停止使用家具
      {string, account},                                  % 玩家帐号 
      {int, position_index},                              % 允许的索引值
      {uint64, instance_id}                               % 家具id
     ],

     [notify_change_furniture_status,                   % 通知改变家具状态
      {string, account},                                
      {uint64, instance_id},                            % 家具id
      {int, function_id},                                 % 功能id
      {int, new_status}                                 % 开关之类的状态
     ],
     %--------------------物品,包裹相关-----------------------------------
     [req_swap_item,             % 请求包裹内部的物品交换
      {int, type},               % 包裹类型,参看package_type的定义
      {int, index1},             % 格子1的索引
      {int, index2}              % 格子2的索引
     ],
     [req_use_item,              % 请求使用物品
      {uint64, item_inst_id},    % 物品的实例ID
      {array, string, target_list} % 物品作用在谁身上
     ],
     [notify_use_item_result,    % 通知使用道具后的结果
      {uint64, item_inst_id},    % 物品的实例ID
      {int, item_tplt_id},       % 物品模板表ID
      {int, result}              % 结果, 1-- 成功, 0 -- 失败
     ],
     [req_move_item,             % 请求在包裹之间移动物品
      {int, pack1_type},         % 包裹1的类型
      {int, index1},             % 包裹1中的物品格子的索引
      {int, pack2_type},         % 包裹2的类型
      {int, index2}              % 包裹2中的物品格子的索引
     ],
     [req_delete_item,           % 请求删除物品
      {int, grid_index}          % 格子索引
     ],
     [req_split_item,            % 请求拆分物品
      {int, type},               % 包裹类型, 具体见package_type
      {int, src_gindex},         % 格子索引
      {int, target_gindex},      % 格子索引
      {int, count}               % 拆分出来的数量
     ],
     [req_resize_player_pack    % 请求对玩家包裹扩容
     ],
     [req_extend_aging_item,     % 请求延长物品时效
      {uint64, item_inst_id}     % 物品实例Id
     ],
     [notify_extend_aging_item],

     [notiy_use_item_by_scene,			% 通知当前场景所有玩家使用物品
      {int, item_id},			        % 使用的物品ID
      {uint64, item_inst_id},			% 物品实例ID
      {int, result}
     ],
     %----------------------系统消息相关----------------------------------
     [notify_sys_msg,            % 发送系统消息给客户端
      %%{int, type},               % 系统类型, 有时候不同的系统, 表现的形式会不一样,参见common_def.hrl
      {int, code},               % 系统消息代码, 参见sys_msg.hrl
      {array, string, params}    % 参数
     ],

     [notify_sys_broadcast,      % 系统公告, 参考sys_broadcast_type
      {uint64, id},         % 公告id
      {int, type},         % 公告类型
      {string, content},   % 播放内容 
      {int, play_times},   % 播放次数
      {int, priority},     % 优先级
      {int, show_seconds}, % 显示秒数
      {stime, start_time}  % 公告开始时间
     ],

     [req_fixed_broadcast,  % 请求固定的公告
      {int, type}           % 公告类型(系统自动显示公告或农场公告)
     ],

     [notify_del_broadcast,  % 通知删除公告
      {int, type},               % 公告类型
      {uint64, id}               % 公告id
     ],
     [notify_gm_permission,      %通知gm权限
      {string, account},         % 
      {int, enable},          %0-否，1-是
      {int, money},           %0-否，1-是
      {int, item}             %0-否，1-是
     ],
     [req_gm_command,            % 请求使用GM指令
      {string, command},               % GM指令类型
      {array, string, params}    % 指令后面跟随的参数
     ],
     %----------------------NPC相关----------------------------------
     %% [notify_npc_list,                                    % 通知客户端npc列表
     %%  {array, npc_map_mapping_info, npc_map_mapping_list} % npc与地图的对应表
     %% ],

     [notify_npc_close_dialog                             % 请求关闭对话框
     ],

     [req_npc_command,                                    % 请求npc功能
      {int, npc_id},                                      % npc编号 
      {string, function_name}                             % 功能名，点击npc传空过来就可以了
     ],

     [button,                                             % 按钮
      {string, name},                                     % 按钮文字
      {string, function_name}                             % 功能名
     ],

     [notify_npc_open_dialog,                             % 打开npc对话框     
      {int, npc_id},                                      % npc编号 
      {string, talk},                                     % 谈话内容 
      {array, button, button_list}                        % 按钮列表  
     ],

     %% [notify_npc_show_dialog_by_option,                   % 通知客户端显示对话框(加选项)
     %%  {int, template_id},                                 % 对话框内容
     %%  {array, npc_command, command_list}                  % 对应对话框中指令信息
     %% ],

     %% [notify_npc_show_dialog_by_message,                  % 通知客户端显示对话框(只显示消息)
     %%  {int, template_id},                                 % 对话框内容
     %%  {uint64, unique_id},                                % 唯一标识
     %%  {int, page_index},                                  % 对话框对应的页码
     %%  {int, command_index}                                % 对应的指令信息
     %% ],

     %% [notify_npc_show_dialog_by_item,                     % 通知客户端显示对话框(显示物品)
     %%  {int, template_id},                                 % 任务Id
     %%  {array, npc_command, item_list}                     % 对话框对应的页码
     %% ],

     %% [req_npc_command,                                    % 请求npc指令
     %%  {string, npc_key},                                  % npc主键
     %%  {uint64, unique_id},                                % 唯一标识
     %%  {int, page_index},                                  % 当前页码索引
     %%  {int, command_index}                                % 当前命令索引
     %% ],
     %----------------------侍者相关----------------------------------
     [req_employ_waiter_data,		% 雇佣侍者
      {uint64, waiter_id}		% 侍者ID
     ],

     [req_up_waiter_data,		% 升级当前雇佣的侍者
      {uint64, waiter_id}		% 侍者ID
     ],

     [req_query_waiter_id,		% 查询目标玩家侍者ID
     {string, account}			% 目标玩家帐号
     ],

     [notify_query_waiter_id,		% 通知查询的目标玩家侍者ID
     {uint64, waiter_id}		% 侍者ID
     ],

     [waiter_info,
     {int, waiter_type},
     {uint64, waiter_id}
     ],

     [notify_employ_state,
      {uint64, waiter_id},		 % 当前雇佣侍者id
      {array, waiter_info, waiter_up}		 % 侍者升级后ID
     ],

     %----------------------玩家相关----------------------------------
     [req_player_basic_data                               % 请求玩家基本资料
     ],

     [notify_player_basic_data,                           % 通知玩家基本资料
      {player_basic_data, basic_data}                    % 玩家基本信息
     ],

     [req_start_body_action,                              % 请求开始自身动作或二人动作
      {string, action_status},                            % 动作状态
      {string, action_type}                               % 动作类型
     ],

     [notify_start_body_action,                           % 通知开始自身动作或二人动作
      {string, account},                                  % 玩家账号
      {string, action_status},                            % 动作名称
      {string, action_type}                               % 动作类型
     ],     

     [req_play_animation,                                 % 请求播放动画
      {string, target_account},                           % 动作目标玩家(自身动作填空字串)
      {int, loop},                                        % 循环播放
      {string, ani},                                      % 动画名称
      {string, action}                                    % 动作名称
     ],

     [notify_play_animation,                              % 通知播放动画
      {string, player_account},                           % 玩家账号
      {string, target_account},                           % 动作目标玩家(自身动作填空字串)
      {int, loop},                                        % 循环播放
      {string, ani},                                      % 动画名称
      {string, action}                                    % 动作名称
     ],     

     [req_end_body_action                                 % 请求结束自身动作或二人动作      
     ],

     [notify_end_body_action,                             % 通知结束自身动作或二人动作
      {string, account}                                   % 玩家账号
    ], 

     [req_sync_body_state,                                % 同步身体状态
      {int, body_state}                                   % 身体动作状态
     ],

     [notify_other_body_state,                            % 同步其它人身体状态
      {string, other_account},                            % 账号
      {int, body_state}                                   % 身体动作状态 
     ],

     [req_start_change_looks                              % 请求开始美容
     ],
     [notify_start_change_looks,                          % 通知开始
      {int, type}                                         % 费用类型(1为游戏金币，2为点卡点数) 
     ],
     [req_cancel_change_looks                             % 取消美容
     ],
     [req_end_change_looks,                               % 结束美容(改变个人形象)
      {int, new_hair},                                    % 新发型
      {int, new_hair_color},                              % 新发色
      {int, new_face},                                    % 新脸型
      {int, new_skin_color},                              % 新肤色
      {int, new_beard}                                    % 新胡子
     ],
     [notify_change_looks,                                % 通知容貌改变(自已，周围玩家都会收到)
      {string, account},                                  % 玩家账号
      {int, new_hair},                                    % 新发型
      {int, new_hair_color},                              % 新发色
      {int, new_face},                                    % 新脸型
      {int, new_skin_color},                              % 新肤色
      {int, new_beard}                                    % 新胡子
     ],
     [notify_end_change_looks                             % 通知结束美容(改变个人形象)
     ],
     %----------------------换装相关----------------------------------
     [req_start_change_dress],       % 请求开始换装
     [notify_start_change_dress,     % 返回两个玩家的装备信息
      {player_basic_data, owner},
      {player_basic_data, lover}
     ],
     [req_change_dress,              % 请求换装
      {money_type, type},            % 消费类型
      {array, int, goods_list},      % 为自己购买的物品
      {array, int, lover_goods_list},% 为爱人购买的物品
      {array, item, item_list},      % 背包换到自己身上的物品
      {array, uint64, putoff_list}   % 脱下的装备列表
     ],
     [notify_change_dress,
      {change_dress_type, type},
      {array, item, item_list},
      {array, pack_grid, body}
     ],
     [notify_around_change_dress,   % 通知周边的玩家有玩家穿上服装
      {string, account},            % 指定的玩家穿上服装
      {array, pack_grid, body}
     ],
     %----------------------邀请----------------------------------------
     [req_invite_someone,          % 请求邀请某人
      {array, string, target_list},% 被邀请人的帐号
      {int, type}                  % 邀请的类型(交易, 交好友等)
     ],
     [notify_invitation,           % 通知被邀请人, 有人发送了一个邀请
      {string, invitor},           % 邀请人帐号
      {string, invitor_name},      % 邀请人姓名
      {int, type}                  % 邀请的类型(交易, 交好友等)
     ],
     [req_agree_invitation,        % 同意邀请
      {string, invitor},           % 邀请人帐号
      {int, type}                  % 邀请的类型(交易, 交好友等)
     ],
     %----------------------商城----------------------------------------
     [goods_atom,
      {int, goods_id},
      {int, count}
     ],

     [req_buy_sys_shop_goods,      % 请求购买系统商城的商品
      {int, goods_id},             % 商品ID
      {int, count}                 % 数量
     ],
     
     [notify_buy_sys_shop_goods    % 通知客户端购买系统商城成功
     ],

     [req_mutli_buy_sys_shop_goods,
      {array, goods_atom, goods_list}
     ],

     %%--------------------任务-----------------------------------------
     [flag_info,
      {string, key},
      {int, value},
      {int, count}
     ],
     
     [task_info,
      {uint64, inst_id},           %% 任务实例Id
      {int, task_id},              %% 任务Id
      {task_type, type},           %% 任务类型, 如(日常任务，链式任务，节日任务)
      {stime, give_date},          %% 任务接受的日期
      {stime, complete_date},      %% 任务完成的日期
      {stime, reward_date},        %% 任务领取奖励的日期
      {array, flag_info, info}
     ],

     [notify_task_flag,
      {uint64, inst_id},
      {array, flag_info, info}
     ],

     [notify_task_list,            %% 通知客户端任务列表
      {array, task_info, tasks}    %% 所有任务
     ],

     [notify_add_task,             %% 通知增加任务
      {array, task_info, tasks}                 
     ],

     [notify_dec_task,             %% 通知删除任务
      {array, uint64, inst_ids}
     ],

     [notify_complete_task,        %% 通知客户端任务完成
      {task_info, info}
     ],

     [notify_reward_task,
      {task_info, info}
     ],

     [req_get_task_reward,         %% 请求领取奖励
      {uint64, inst_id},           %% 任务实例Id
      {task_type, type}            %% 任务类型
     ],

     [notify_get_task_reward,      %% 通知客户端显示任务奖励
      {uint64, inst_id},           %% 获得到奖励后删除该任务
      {int, task_id}
     ],

     [req_change_task,             %% 请求更换任务
      {uint64, inst_id},
      {task_type, type}
     ],

     [notify_change_task,          %% 通知客户端到的新的任务
      {uint64, inst_id},           %% 旧的任务Id
      {task_info, info}            %% 替换成新的任务
     ],

     [req_immediate_complete,      %% 请求立即完成任务
      {uint64, inst_id},           %% 任务Id
      {task_type, type}            %% 任务类型
     ],
     [req_move_camera              %% 新手任务用，移动镜头
     ],
     [req_move_player              %% 新手任务用，移动玩家
     ],

     [req_close_windows,           %% 关闭界面
      {close_window_type, type}    %% 界面类型
     ],

     %%--------------------环形任务-----------------------------------------
     [ring_task_atom,
      {int64, inst_id},
      {int, ring_count},
      {pack_task_type, type},
      {int, content_id},
      {int, rule_id},
      {stime, complete_date},
      {stime, due_date},
      {common_bool, is_view},
      {int, count}
     ],
     [notify_add_ring_task,
      {ring_task_atom, task}
     ],
     [notify_show_ring_task],
     [notify_delete_ring_task,
      {int64, inst_id}
     ],
     [req_give_up_ring_task,
      {int64, inst_id}
     ],
     [req_stop_ring_task,
      {int64, inst_id}
     ],
     [notify_stop_ring_task,
      {int64, inst_id},
      {stime, due_date}
     ],
     [req_immediate_complete_ring_task,
      {int64, inst_id}
     ],
     [notify_complete_ring_task,
      {int64, inst_id},
      {stime, complete_date}
     ],
     [req_view_ring_task,
      {int64, inst_id}
     ],
     [notify_view_ring_task,
      {int, count}
     ],
     [req_ring_task_target,
      {int64, inst_id}
     ],
     [notify_ring_task_target,
      {array, int, targets}
     ],
     %% --------------------------智力考验-------------------------------------
     [req_mind_quiz_count],
     [notify_mind_quiz_count,
      {int, count},
      {int, love_coin_count}],
     [req_start_mind_quiz
     ],
     [notify_start_mind_quiz,
      {common_bool, result}
     ],
     [req_mind_quiz_reward,
      {int, level}
     ],
     [notify_mind_quiz_reward],
     %% --------------------------充值爱币-------------------------------------
     [req_recharge_love_coin,
      {int, id}
     ],
     [notify_recharge_love_coin,
      {int, love_coin}
     ],
     [notify_init_love_coin,
      {int, love_coin}],
     [notify_love_coin,
      {int, love_coin}
     ],
     [notify_open_recharge_ui],
     [notify_open_yy_recharge_ui],  %% 通知客户端弹出yy的充值界面
     %% --------------------------界面----------------------------------------
     [req_open_ui,                         %% 请求打开界面
      {int, type}                          %% 界面类型
     ],
     [notify_open_ui,                      %% 通知打开界面
      {int, type}
     ],
     %% --------------------------系统时间--------------------------------------
     [req_sys_time                         %% 请求系统时间
     ],
     
     [notify_sys_time,                     %% 返回系统时间
      {stime, sys_time}
     ],

     [notify_wallow_time,                     %% 返回自已防沉迷上线时间
      {int, wallow_seconds}
     ],
     %% --------------------------疾病系统--------------------------------------
     [notify_player_health_status,         %% 通知玩家健康状况
      {disease_type, status}               %% 玩家健康状况
     ],
     [notify_disease_special_event,        %% 通知玩家疾病特殊事件
      {int, special_event_id}              %% 特殊事件Id
     ],

     %% --------------------------秀图--------------------------------------
     [notify_show_picture,
      {int, id}
     ],

     %% --------------------------------------------------------------------------
     [req_is_active_game,               %% 是否激活了相关的游戏
      {int, type}                       %% 小游戏类型
     ],
     [notify_active_game_result,        %% 是否激活了相关的游戏
      {int, result}                     %% 结果, 0 -- 没激活, 1 -- 激活
     ],

     %%--------------------------派对--------------------------------------
     [req_create_party,        %% 请求创建派对
      {uint64, house_id},      %% 创建者的房屋id
      {string, house_name},    %% 创建者的房屋名字
      {string, player_name},   %% 创建者的名字
      {int, type},             %% 派对类型
      {string, title},         %% 派对标题
      {string, description},   %% 派对描述
      {array, int, cost_items},%% 包场物品类型id
      {array, int, food_ids}   %% 使用食物ID列表
     ],

     %% 通知派对创建结果
     [notify_create_party_result,
      {int, result} %% 结果, 1-- 成功, 0 --失败
     ],

     %% 请求修改派对信息
     [req_edit_party,
      {uint64, house_id}, %% 请求创建派对
      {int, type},        %% 派对类型
      {string, title},    %% 派对标题
      {string, description} %%派对描述
     ],

     %% 通知修改派对信息的结果
     [notify_edit_party_result,
      {int, result} %% 结果, 1-- 成功, 2 --编辑的派对不存在, 3 --指定的账号不被允许修改， 比如配偶没权限修改
     ],

     %% 请求删除派对
     [req_delete_party,
      {uint64, house_id} %% 创建者的房屋id
     ],

     %% 通知派对删除的结果
     [notify_delete_party_result,
      {int, result}  %% 结果, 1-- 成功, 2 --删除的派对不存在, 3 --指定的账号不被允许删除， 比如配偶没权限删除
     ],

     [notify_private_party_need_item,
      {int, item_id}
     ],

     %% 请求获得派对列表
     [req_get_party_list,
      {int, type},    %% 派对类型 
      {int, page}     %% 页数
     ],

     %% 派对数据
     [party_data,
      {uint64, house_id},      %% 创建者的房屋id
      {string, house_name},    %% 创建者的房屋名字
      {string, account},       %% 创建者的帐号
      {string, player_name},   %% 创建者的名字
      {int, type},             %% 派对类型
      {string, title},         %% 派对的标题
      {string, desc},          %% 派对的内容(详细描述)
      {stime, create_time},    %% 派对的创建时间
      {int, freeze_seconds},   %% 下一次可创建时间
      {int, rest_time},        %% 派对的剩余时间
      {int, exp},              %% 每次经验
      {int, cur_person},       %% 当前人数
      {int, max_person}        %% 最大人数
     ],

     %% 通知派对列表结果
     [notify_party_list,
      {int, max_page},             %% 最大页数
      {array, party_data, partys}, %% 派对数据
      {array, party_data, hot_partys} %% 推荐派对
     ],
     [req_get_my_party_info,       %% 请求获得自己创建的派对
      {uint64, house_id}      
     ], 
     [notify_my_party_info,        %% 发送自己的派对信息
      {party_data, data},          %% 自己的派对信息, 如果没有派对, party_data.house_id 为 0
      {int, need_money}            %% 需要多少水晶 
     ],

     [notify_start_party_exp_timer, %% 派对定时器, 每二分钟算一次
      {int, seconds}, %% 这个倒计时，用来显示的
      {int, hide_seconds}, %% 这个倒计时用来隐藏buff的
      {int, exp}
     ],

     [notify_stop_party_exp_timer 
     ],

     [req_add_party_score      %% 请求投票加积分
     ],

     [notify_party_score,
      {int, score},            %% 积分
      {int, has_vote},         %% 是否已投票 0 表示未投
      {int, remain_times}      %% 还有几次     
     ],
     
     [notify_add_party_score, %% 加积分广播到聊天栏 
      {int, total_score},     %% 总积分
      {int, add_score},       %% 增加多少
      {string, guest_account}, %% 客人
      {string, guest_name},    %% 玩家名
      {string, master_account}, %% 主人
      {string, master_name}
     ],

     [notify_party_gain,          %% 通知派对收获
      {array, pair_int, grade_scores}, %% 等级积分列表 key表示分数 value 表示物品id
      {int, score},               %% 自已的积分
      {int, item_id}              %% 获得物品id 
     ],

     [notify_party_exp_buffs,    %% 经验加成图标
      {array, pair_int, buff_exps}, %% key 表示effect_avator 的id, value 表示加成百分比		
      {array, int, lights},      %% 点亮的effect_avator 的id
      {int, total_add_percent}   %% 总的百分比加成
     ],

     [notify_party_items,        %% 通知获得
      {array, pack_grid, items}  %% 
     ],

     [notify_update_party_items, %% 通知更新
      {array, pack_grid, items}   
     ],

     [notify_party_stop          %% 通知派对停止
     ],
     
     [req_party_food_eat,			%% 吃派对食物
      {uint64, food_id}
     ],

     [notify_party_food_eat_count,		%% 通知今日已吃食物次数
     {int, count}
     ],

     [notify_party_food_ids,			%% 使用派对食物id
     {array, int, food_ids}
     ],

     %%--------------------情侣房间物品,包裹相关-----------------------------------
     [req_equip_off,        %% 请求脱下装备
      {uint64, item_inst_id}     
     ],

     [notify_equip_off,        %% 通知脱下装备
      {string, account},
      {int, equip_pos}         %% 装备位置
     ],

     [req_equip_on,          %% 请求穿上装备
      {uint64, item_inst_id}     
     ],

     [notify_equip_on,        %% 通知穿上装备
      {string, account},
      {int, equip_pos},       %% 装备位置
      {pack_grid, item_grid}  %% 物品信息   
     ],

     [notify_lover_package,        % 通知玩家的装备数据
      {array, pack_grid, grid_vec} % 格子数据
     ],

     [notify_lover_diamond,        % 通知玩家的爱情水晶
      {int, amount}               % 数量
     ],
     
     [req_delete_lover_item,     %% 请求删除情侣共用的物品
      {array, uint64, item_inst_ids}     
     ],

     [notify_add_lover_items,  %% 通知增加情侣共用的物品
      {array, pack_grid, items}  %% 物品信息   
     ],
     
     [pair_item_count,
      {uint64, item_inst_id},
      {int, count}
     ],

     [notify_update_items_count, %% 通知物品数量被修改过
      {array, pair_item_count, items}  %% 物品信息   
     ],

     [req_lock_lover_item,       % 请求锁定背包物品
      {uint64, item_inst_id}     % 物品实例ID
     ],
     [req_unlock_lover_item,     % 请求解除锁定背包物品
      {uint64, item_inst_id}     % 物品实例ID
     ],
     [notify_lock_lover_item,    % 锁定背包物品
      {uint64, item_inst_id}     % 物品实例ID
     ],
     [notify_unlock_lover_item,  % 解除锁定背包物品
      {uint64, item_inst_id}     % 物品实例ID
     ],
     %%--------------------房屋记录系统---------------------------------------------
     [req_house_guest_book,              %% 请求访问留言
      {uint64, house_id}
     ],
     [notify_house_guest_book,            %% 响应访问留言
      {string, account},                  %% 用户账户 
      {string, lover_account},            %% 情侣账户
      {array, guest_book, guest_books}    %% 留言记录
     ],
     [req_house_visit_log_add,            %% 请求添加访问日志
      {string, guest},                    %% 访客名字
      {string, openid},                   %% openid
      {string, account}                   %% 用户账户     
     ],
     [notify_house_visit_log_add],        %% 通知添加访问日志
     [req_house_visit_log                 %% 请求访问
     ],               
     [notify_house_visit_log,             %% 请求访问
      {array, visit_log, visit_logs}      %% 访问记录
     ],
     [req_guest_book_delete,              %% 请求删除留言
      {string, account},                  %% 用户账户
      {uint64, id}                           %% 留言ID
     ],
     [notify_guest_book_delete,           %% 通知删除留言
      {int, result},                      %% 0-失败，1-成功
      {uint64, id}                           %% 留言ID
     ],
     [req_guest_book_add,                 %% 通知添加留言
      {string, owner},                    %% 主人账户
      {string, guest},                    %% 访客账户
      {string, content},                  %% 留言内容
      {int, opened}                       %% 是否公开的 0-否，1-是
     ],
     [notify_new_guest_book],             %% 通知有新的留言
     [notify_guest_book_add,              %% 通知添加留言
      {int, result},                      %% 0-失败，1-成功 
      {guest_book, item}                  %% 成功添加的留言  
     ],
     [req_guest_book_clear,               %% 通知清空留言  
      {string, account}                   %% 用户账户
     ],
     [notify_guest_book_clear,            %% 通知清空留言
      {int, result}                       %% 0-失败，1-成功 
     ],
     %%-------------------爱情花藤----------------------------------------------
     [req_create_flower,  %% 创建花藤 
      {uint64, house_id}, %% 主人的房屋ID
      {int, flower_id}    %% 花藤的id
     ],
     [req_get_flower,     %% 请求获得花藤数据
      {uint64, house_id}
     ],
     [notify_flower_data, %% 通知花藤的数据
      {int, operate},     %% 发送给客户端的是由哪些操作引发的, 1--创建花藤, 2--客户端主动请求数据, 3--请求浇水,4--请求施肥,5--请求采摘
      {uint64, house_id}, %% 花藤拥有者的帐号
      {int, id},          %% 花藤id
      {int, level},       %% 等级
      {int, grow},         %% 成长值数
      {stime, start_time},%% 刚开始种植的时间
      {stime, fruit_time} %% 结果时间
     ],
     [req_can_water_flower, %% 询问能否浇水
      {uint64, my_house_id}, %% 浇水的人的房屋ID
      {uint64, house_id}     %% 被浇水的房屋中的花藤
     ],
     [notify_can_water_flower, %% 通知客户端能否浇水
      {int, result} %% 结果, 1 -- 能浇水, 0 -- 不能浇水
     ],
     [req_water_flower,   %% 请求浇水
      {uint64, my_house_id}, %% 浇水的人的房屋ID
      {string, name},     %% 操作者的名称
      {uint64, house_id}  %% 被浇水的房屋中的花藤
     ],
     [req_fertilize_flower,%% 请求施肥
      {uint64, my_house_id}, %% 浇水的人的房屋ID
      {string, name},     %% 操作者的名称
      {uint64, house_id}  %% 被浇水的房屋中的花藤
     ],
     [req_pick_fruit,     %% 请求采摘果实
      {uint64, house_id}  %% 房屋ID
     ],
     [req_change_flower,  %% 请求更换花藤
      {uint64, house_id}, %% 主人的房屋ID
      {int, flower_id}    %% 要更改的花藤的ID
     ],
     [flower_log,
      {string, name},     %% 操作者的名称
      {int, op},          %% 操作类型: 1 -- 浇水, 2 -- 施肥
      {stime, time},      %% 操作的时间
      {int, grow}         %% 增长了多少成长值
     ],
     [req_flower_log,     %% 请求获得花藤的操作日志
      {uint64, house_id}  %% 房屋id
     ],
     [notify_flower_log,     
      {array, flower_log, logs}
     ],
     [req_ask_today_water_flower, %% 询问今天是否有浇自己家的花藤
      {uint64, owner_house_id}    %% 自己的房屋ID
     ],
     [notify_today_water_flower,  %% 通知客户端今天是否有浇水过
      {int, result}               %% 0 -- 今天已经不能浇水, 1 -- 今天还可以浇水
     ],
     %%---------------------爱情签到系统----------------------------------------
     [check_in,            %% 签到
      {string, id},        %% 签到id
      {string, account},   %% 用户账户
      {string, content},   %% 签到内容
      {int, opened},       %% 是否公开 0-否，1-是
      {stime, create_date} %% 签到时间
     ],          
     [
      req_checkin_add,    %% 添加签到
      {string, account},  %% 用户账户
      {string, content},  %% 签到内容 
      {int, opened}       %% 是否公开 0-否，1-是
     ],
     [notify_checkin_add, %% 通知添加签到
      {check_in, item}        %% 签到id
     ],
     [notify_new_checkin],  %%通知有新的签到
     [req_last_checkins,     %% 请求最新的签到
      {string, owner}        %% 房屋主人账户 
     ],
     [notify_last_checkins,    %% 通知最新的签到
      {check_in, owner},       %% 主人最新签到 
      {check_in, lover}        %% 情侣最新签到
     ],
     [req_checkin_list,   %% 请求签到列表
      {string, owner},    %% 房屋主人账户 
      {string, start_id},     %% 上一页的最后一个ID, 本页的ID都要大于这个ID,第一页就为0
      {int, page_index},  %% 第几页 
      {int, page_size}    %% 每页记录数
     ],
     [notify_checkin_list,           %% 通知签到列表
      {array, check_in, checkins}    %% 签到列表
     ],
     [req_checkin_delete,     %% 请求删除签到
      {string, account},        %%用户账户
      {string, id}               %% 签到id
     ],
     [notify_checkin_delete,      %% 通知删除签到
      {int, result},              %% 0-失败，1-成功
      {string, id}
     ],
     %%---------------------------------纪念日------------------------------------- 
     [req_modify_love_time,     %% 请求修改恋爱纪念日
      {uint64, house_id},       %% 房屋ID
      {stime,  love_time}       %% 相恋开始的时间
     ],
     [req_get_love_time,        %% 请求获得恋爱纪念日
      {uint64, house_id}        %% 房屋ID
     ],
     [notify_love_time,         %% 通知恋爱开始的时间
      {uint64, house_id},       %% 房屋ID
      {int, love_time}          %% 相恋了多长的时间
     ],
     [commemoration_day,        %% 纪念日的定义
      {uint64, id},             %% 纪念日的标识符
      {int, show_other},        %% 其他人是否可见, 1 -- 其他人可以看, 0 -- 其他人不能看
      {stime, time},            %% 纪念日的时间
      {string, content}         %% 纪念日的内容
     ],
     [req_add_commemoration,    %% 请求增加新的纪念日
      {uint64, house_id},       %% 房屋ID
      {stime, time},            %% 纪念日的时间
      {int, show_other},        %% 其他人是否可见, 1 -- 其他人可以看, 0 -- 其他人不能看
      {string, content}         %% 纪念日的内容
     ],
     [req_get_commemoration,    %% 请求获得纪念日列表
      {uint64, house_id},       %% 房屋ID(被查看的房屋的ID)
      {uint64, my_house_id},    %% 查看人自己的房屋ID
      {int, page}               %% 页数
     ],
     [notify_commemoration,     %% 通知获得纪念日列表
      {array, commemoration_day, days}, %% 纪念日列表
      {int, total}              %% 总页数
     ],
     [req_delete_commemoration, %% 请求删除纪念日
      {uint64, house_id},       %% 房屋ID
      {uint64, id}              %% 纪念日的标识符
     ],
     [req_modify_commemoration, %% 请求修改纪念日
      {uint64, house_id},       %% 房屋ID
      {uint64, id},             %% 纪念日的标识符
      {int, show_other},        %% 其他人是否可见, 1 -- 其他人可以看, 0 -- 其他人不能看
      {stime, time},            %% 时间
      {string, content}         %% 内容
     ],
     %%----------------------------------应用平台信息----------------------------%%
     [req_platform_info,                                    %% 请求应用平台用户信息
      {array, string, open_ids},                            %% 平台用户ID
      {int, token}                                          %% 客户端使用的标示
     ],
     [notify_platform_info,                                      %% 响应应用平台用户信息
      {array, player_basic_information, player_informations},    %% 平台用户信息列表
      {int, token}
     ],
     %%---------------------------------每天访问记录----------------------------%%
     [req_daily_visit,                                      %%请求当天拜访记录
      {string, account}                                     %%用户账户
     ],
     [notify_daily_visit,                                   %%响应当天拜访记录
      {array, uint64, visit_firends}                        %%拜访过的好友列表
     ],
     %%----------------------------------新手引导---------------------------------%%
     [req_player_guide                               %%请求新手引导标志
     ],
     [notify_player_guide,                           %%响应新手引导标志
      {array, int, flags}
     ],
     [req_update_player_guide,                       %%请求更新新手引导标志
      {array, int, flags}
     ],
     [notify_update_player_guide,                    %%响应更新新手引导标志
      {int, result}                                  %% 0-失败，1-成功
     ],
     %%----------------------------------节日礼物---------------------------------%%
     [notify_active_holiday_gift               %% 激活节日礼物
     ],
     [req_get_holiday_gift                     %% 领取节日礼物
     ],
     [notify_get_holiday_gift_result,          %% 领取节日礼物结果
      {int, result},                           %% 0 无 1 物品 2 爱情水晶 
      {int, item_id},                          %% 物品
      {int, item_count},                       %% 物品个数
      {int, diamond}                           %% 爱情水晶
     ],
     
     [lottery_item,                            %% 抽奖物品
      {int, item_id},
      {int, item_count}
     ],

     [notify_use_lottery_item_result,                 %% 使用抽奖物品
      {uint64, item_inst_id},                         %% 物品实例id
      {array, lottery_item, items},                   %% 可抽的物品列表
      {int, hit_index}                                %% 最后抽到的序号(下标从0开始)
     ],
     %%----------------------------------heartbeat---------------------------------%%
     [notify_heartbeat],
     %% ----------------------------玩家设置--------------------------------------
     [notify_player_setting,
      {player_setting, setting}
     ],
     [req_player_setting,
      {setting_info, setting}
     ],
     %%----------------------------------房屋名字-----------------------------------%%
     [req_update_house_name,           %% 请求更新房屋名字
      {string, name},                  %% 房屋名字
      {string, account}                %% 玩家账号
     ],
     [notify_update_house_name,        %% 响应更新房屋名字
      {int, result}                    %% 0-失败 1-成功
     ],
     %%----------------------------------配对相关-----------------------------------%%
     [req_mateup,                      %% 请求配对信息
      {string, boy_number},            %% 男生号码
      {string, girl_number}            %% 女生号码
     ],
     [notify_mateup_list,                                  %% 匹配列表
      {array, player_basic_information, mateup_list}        
     ],
     [notify_mateup_wait],             %% 没找到匹配的号码
     [notify_mateup_fail,              %% 通知匹配失败
      {string, message}
     ],
     [req_mateup_select,               %% 请求进行配对
      {string, match_account}          %% 用来进行匹配的用户
     ],
     [notify_mateup_success,           %% 通知配对成功
      {player_basic_information, boy}, %% 男生信息
      {player_basic_information, girl} %% 女生信息
     ],
     [req_mateup_number],              %% 请求配对号码
     [notify_mateup_number,            %% 通知配对号码
      {string, boy_number},
      {string, girl_number}
     ],
     [notify_house_warming,            %% 通知配对后搬入新房间
      {string, title},                 %% 标题
      {string, desc},                  %% 描述
      {string, summary}                %% 摘要
     ],
     %%----------------------------------玩家信息收集-----------------------------------%%
     [client_device_info,                  %% 客户端平台信息
      {string, operate_system}, 	%% 操作系统名称 
      {string, cpu}, 		        %% 处理器名称 
      {int, cpu_count}, 		%% 处理器数量 
      {int, memory},		        %% 内存大小 
      {string, graphics_card},	        %% 显卡名称 
      {int, graphics_card_memory}, 	%% 显卡内存大小 
      {int, graphics_card_id}, 	        %% 显卡标识符 
      {string, graphics_card_verson},   %% 显卡版本 
      {string, graphics_card_vendor},   %% 显卡厂商 
      {int, graphics_card_vendor_id},    %% 显卡厂商标识符 
      {int, graphics_card_shader_level}, 	%% 显卡着色器级别 
      {int, graphics_card_pixel_fillrate}, 	%% 显卡像素填充率 
      {int, support_shadow},  		%% 是否支持内置阴影(1.支持;0.不支持) 
      {int, support_render_texture},  	%% 是否支持渲染纹理(1.支持;0.不支持) 
      {int, support_image_effect}, 	%% 是否支持图像效果(1.支持;0.不支持) 
      {string, device_name},  		%% 设备名称 
      {string, device_unique_identify}, %% 设备唯一标示符 
      {string, device_model}, 		%% 设备模型 
      {string, browser}			%% 浏览器
     ],    


     %%----------------------------------经验, 等级, 体力值-----------------------------------%%
     [notify_level_exp,         %% 通知等级经验
      {int, level},                   
      {int, exp},
      {int, max_exp}
     ],
     
     [notify_hp,                 %% 通知体力值
      {int, hp},
      {int, max_hp},
      {int, total_seconds},      %% 总时间
      {int, restore_seconds}     %% 回复时间
     ],

     [req_start_recover_hp],

     [notify_start_recover_hp,
      {int, count},
      {int, hp},
      {int, love_coin}
     ],

     [req_recover_hp],

     [notify_recover_hp],
     %%----------------------------------关注列表-----------------------------------%%
     [req_add_attention,         %% 请求把玩家加入到关注列表中
      {string, account},         %% 要加入到关注列表的玩家
      {string, name}             %% 玩家的名字
     ],
     [notify_add_attention,      %% 通知玩家关注成功
      {friend_item, info}        %% 要加入到关注列表的玩家
     ],
     [req_cancel_attention,      %% 请求取消关注
      {string, account}          %% 被取消关注的帐号
     ],
     [notify_cancel_attention,   %% 通知取消关注的结果
      {string, account}          %% 被取消关注的帐号
     ],
     [req_get_attention_list     %% 请求获得关注列表
     ],
     [notify_attention_list,     %% 通知关注列表
      {array, friend_item, attentions} %% 关注列表
     ],
     %%----------------------------------照片交友-----------------------------------%%
     [req_opposite_sex_photos                      %% 请求刷新异性照片
     ],

     [notify_opposite_sex_photos,                  %% 通知异性照片列表
      {array, player_basic_information, photos}        
     ],
     %%----------------------------------玩家礼物-----------------------------------%%
     [gift_info,                 %% 礼物结构信息
      {uint64, gift_id},         %% 礼物Id
      {string, receiver},        %% 接收者
      {string, sender},          %% 发送者
      {int, gift_box},           %% 礼物盒
      {item, gift},
      {stime, date}
     ],
     [house_gift_info,
      {uint64, gift_id},
      {int, gift_box},
      {stime, date}
     ],
     [req_send_gift,             %% 请求发送礼物
      {gift_info, gift}          %% 礼物信息
     ],
     [notify_send_gift,          %% 通知发送礼物结果
      {notify_gift_type, type}
     ],
     [req_house_gift_box_list,
      {string, account}
     ],
     [notify_house_gift_box_list,%% 通知房屋接收到的所有礼物盒
      {string, boy},
      {string, girl},
      {array, house_gift_info, boy_boxes},   %% 男方礼物盒列表
      {array, house_gift_info, girl_boxes}   %% 女方礼物盒列表
     ],
     [notify_add_house_gift_box, %% 通知玩家新接收到的礼物盒
      {string, account},
      {array, house_gift_info, boxes}      %% 增加的礼物盒列表
     ],
     [notify_del_house_gift_box, %% 通知玩家删除礼物盒
      {string, account},
      {array, house_gift_info, boxes}      %% 删除的礼物盒列表
     ],
     [req_receive_gift,          %% 请求接受礼物
      {array, uint64, gift_ids}  %% 礼物Id
     ],
     [notify_receive_gift,       %% 通知接受礼物结果
      {notify_gift_type, type}
     ],
     [req_receive_gift_list      %% 请求未接受礼物列表
     ],
     [notify_receive_gift_list,  %% 通知未接受礼物列表
      {array, gift_info, gift}   %% 礼物列表
     ],
     [req_received_gift_list     %% 请求已接受礼物列表
     ],
     [notify_received_gift_list, %% 请求已接受礼物列表
      {array, gift_info, gift}   %% 通知已接受礼物列表
     ],
     %%----------------------------------------许愿单-------------------------------%%
     [req_wish_add,                        %% 请求添加心愿单
      {uint64, goods_id} ,                 %% 物品id
      {int, wish_type}                     %% 许愿单类型 %% 1-普通许愿单 2-别墅许愿单
     ],
     [player_love_wish,                    %% 心愿单
      {string, account},                   %% 用户账户
      {uint64, wish_id},                   %% 心愿单ID
      {uint64, goods_id},                  %% 物品ID
      {stime, wish_time},                  %% 许愿时间
      {int, wish_type}                     %% 许愿单类型 %% 1-普通许愿单 2-别墅许愿单
     ],
     [notify_wish_add,                     %% 通知添加心愿单
      {player_love_wish, wish}                    %% 心愿单ID
     ],
     [notify_wish_add_fail,                %% 通知添加心愿单
      {string, message}                    %% 心愿单ID
     ],
     [req_wish_delete,                     %% 请求删除心愿单
      {string, account},                   %% 用户账号
      {uint64, wish_id}                    %% 心愿单ID
     ],
     [notify_wish_delete,                  %% 通知删除心愿单
      {uint64, wish_id}                    %% 心愿单ID
     ],
     [req_wish_list,                       %% 请求心愿单
      {string, account}                    %% 用户账号
     ],
     [notify_wish_list,                    %% 通知心愿单
      {array, player_love_wish, wish_list}      %% 心愿单列表
     ],
     [player_love_wish_history,                 %% 心愿单历史记录
      {uint64, goods_id},                       %% 商品ID 
      {string,satisfy_account},                 %% 实现愿望的用户账号
      {int, wish_type}                          %% 许愿单类型 %% 1-普通许愿单 2-别墅许愿单
     ],
     [req_wish_history_list,
      {string, account}
     ],
     [notify_wish_history_list,            %% 通知心愿单历史记录
      {array, player_love_wish_history, history_list}
     ],
     [req_wish_satisfy,                    %% 请求实现心愿
      {uint64, wish_id}                    %% 心愿单ID
     ],
     [notify_wish_satisfy_successfully,    %% 通知实现心愿
      {uint64, wish_id}                    %% 心愿单ID
     ],
     [notify_wish_satisfy_fail,            %% 通知实现心愿失败
      {uint64, wish_id},                   %% 心愿单ID
      {string, message}                    %% 失败的提示消息
     ],
     %%--------------------------------------完成分享-------------------------------%%
     [req_complete_share,                  %% 完成分享
      {share_type, type}                   %% 分享的类型
     ],
     %%--------------------------------------个人资料-------------------------------%%
     [base_person_info,
      {int, animal_type},    % 生肖(0 表示 未知)
      {stime, birthday},     % 生日(默认都是0)
      {int, star},           % 星座(0 表示 未知)
      {int, city}, % 居住城市(0 表示 未知)
      {int, province}, % 省(0 表示 未知)
      {int, height},    % 身高(0 表示 未知)
      {int, salary},    % 薪资(0 表示 未知)
      {int, blood_type},     % 血型(0 表示 未知)
      {string, career},         % 职业(0 表示 未知)
      {int, education},      % 学历(0 表示 未知) 
      {string, contact},        % 联系方式
      {string, interest},       % 爱好
      {int, weight},            % 体重
      {string, signature},      % 个性签名
      {string, name}            % 玩家名字
     ],     

     [req_change_person_info,  % 更改个人信息 
      {base_person_info, info}
     ],

     [req_close_person_info],

     [person_info,           % 个人信息
      {string, account},                                  % 用户帐号
      {string, username},                                 % 用户名称
      {int, sex},                                         % 性别
      {base_person_info, info}
     ],

     [req_person_info,              %% 请求个人信息  
      {string, account}             %% 自已或其它人账号
     ],

     [notify_person_info,          %% 请求个人信息  
      {person_info, info}
     ],
     %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% QQ充值 %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
     [notify_show_buy_dialog,      %% 通知弹出支付对话框
      {string, token},             %% 支付令牌
      {string, params},            %% 支付参数
      {string, context}            %% 支付上下文，此处为orderid
     ],
     [req_cancel_qq_order,            %% 请求取消订单
      {string, context}
     ],
     [notify_cancel_order],          %% 通知取消订单
     %%---------------------------- 黄钻礼包 -----------------------------%%
     [req_vip_gift_receive_info],      % 请求用户礼包的领取情况
     [notify_vip_gift_receive_info,    % 通知用户礼包的领取情况
      {int, beginner},                 % 0未领取，1已经领取
      {int, daily}                     % 0未领取，1已经领取
     ],
     [vip_gift_item,                   % 黄钻礼包
      {int, item_id},               % 物品ID
      {int, count}                     % 数量 
     ],
     [req_receive_vip_beginner_gift,   %%请求领取黄钻新手礼包
      {array, vip_gift_item, items}           %%新手礼包
     ],
     [req_receive_vip_daily_gift,   %%请求领取黄钻每日礼包
      {array, vip_gift_item, items}           %%每日礼包
     ],
     [notify_vip_gift,        %%通知领取礼包
      {int, status}           % 0:失败 1成功
     ],
     %%---------------------------- 连续登录奖励 --------------------------%%
     [login_info,
      {stime, login_date},          %% 登录时间
      {stime, reward_date}          %% 奖励时间
     ],
     [req_give_login_reward],       %% 请求获取连续登录奖励
     [notify_give_login_reward      %% 通知获取连续登录奖励结果
     ],
     [req_login_list],
     [notify_login_list,
      {array, login_info, info},    %% 登录的信息
      {show_type, type}             %% 是否需要显示
     ],
     %%--------------------------------离线通知---------------------------%%
     [req_offline_notify],          %% 请求离线留言
     [notify_offline_notify,        %% 通知离线留言
      {int, count}                  %% 留言数
     ],
     %%--------------------------------房屋升级---------------------------%%
     [req_buy_house_right, %% 购买产权等级
      {int, grade}  %% 产权等级      
     ],

     [notify_house_right_grade, %% 通知更新产权等级(进游戏时会通知, 购买成功后也会通知)
      {int, grade}  %% 产权等级      
     ],

     [req_unlock_special_house,          %% 请求解锁特殊房产
      {int, id}
     ],

     [notify_unlock_special_house,       %% 通知解锁特殊房产
      {int, id}
     ],

     [req_unlock_special_house_info
     ],

     [notify_unlock_special_house_info,  %% 通知解锁过的特殊房产
      {array, int, ids}
     ],
     
     [special_house_goods,  %% 房间当成商品
      {int, id},            %% 流水号 
      {int, house_tplt_id}, %% 房间模板id
      {int, remain_count},  %% 剩余数量
      {int, q_coin}         %% 多少Q币
     ],

     [req_special_house_list     %% 请求特殊产权列表
     ],

     [notify_special_house_list, %% 通知特殊产权列表
      {array, special_house_goods, house_list} %% 房间商品列表
     ],

     [notify_buy_special_house_success
     ],

     [req_self_special_house_list     %% 请求自已特殊产权列表
     ],

     [notify_self_special_house_list,
      {array, int, house_list} %% 房间模板id列表
     ],

     [req_buy_special_house, %% 购买特殊产权房屋
      {int, house_tplt_id} %% 房屋模板id  
     ],     
     
     [req_move_house, %% 搬家
      {int, new_house_tplt_id} %% 新房屋模版id
     ],

     [notify_move_house_success %% 通知搬家成攻
     ],

     [req_get_free_count_for_moving_special_house
     ],

     [notify_get_free_count_for_moving_special_house,
      {int, count}
     ],
     %%-------------------------------邀请好友---------------------------%%
     [req_invite_active],           % 请求邀请列表
     [notify_invite_active,         % 通知邀请列表
      {int, count},                 % 邀请好友总数
      {array, string, invite_list}  % 邀请好友列表
     ],
     [req_invite_award,             % 领取好友邀请奖励
      {int, count},                 % 物品数量
      {int, diamond},               % 水晶数量
      {int, item_id},               % 物品ID
      {array, string, invite_list}  % 邀请好友列表
     ],
     [notify_invite_award,          % 通知好友邀请奖励
      {int, result}                 % 0-失败 1-成功
     ],
     %%-----------------------------收集系统----------------------------%%
     [req_open_search_items_ui
     ],

     [notify_open_search_items_ui,
      {int, rate},       % 机率
      {int, item_count}  % 数量
     ],

     [req_search_items,            % 请求收集物品 
      {int, is_npc},                % 0 否, 1 是
      {string, friend_account},     % 好友账号
      {string, friend_name}         % 好友名称
     ],
     
     [notify_searching_items,       % 通知某人正在收集中  
      {int, is_npc},                % 0 否, 1 是
      {string, friend_account},     % 好友账号
      {string, friend_name},        % 好友名称
      {int, remain_seconds},        % 剩余多少秒
      {int, whip_count}             % 已鞭打次数
     ],

     [req_quick_search_items,       % 自已立即完成
      {int, whip_count}            
     ],

     [req_whip                      % 好友帮忙鞭打，加快时间条
     ],

     [notify_search_items_result,   % 通知收集结果
      {int, is_npc},                % 0 否, 1 是
      {string, friend_account},     % 好友账号
      {string, friend_name},        % 好友名称
      {int, grid_count},                 % 总格子数
      {array, vip_gift_item, gain_items} % 获得的物品列表
     ],

     [notify_new_self_msgs         % 自已有新消息
     ],

     [hire_msg,          %% 雇佣好友
      {stime, time},
      {int, is_npc},
      {string, friend_account}, %% 为空表示npc
      {int, cost_money}         %% 花了多少钱
     ],

     [be_hire_msg,       %% 被好友雇佣
      {stime, time},
      {string, friend_account}, 
      {int, gain_exp}           %% 获得多少经验
     ],

     [be_whip_msg,       %% 被鞭打
      {stime, time},
      {string, friend_account} 
     ],

     [whip_msg,          %% 鞭打
      {stime, time},
      {string, account},       %% 鞭打发起者
      {int, is_npc},
      {int, whip_count},       %% 鞭打次数
      {string, friend_account} %% 为空表示npc
     ],

     [req_self_msgs           % 请求与自已有关的消息
     ],

     [notify_self_msgs,       % 通知与自已相关的信息 
      {array, hire_msg, hire_msgs}, 
      {array, be_hire_msg, be_hire_msgs}, 
      {array, be_whip_msg, be_whip_msgs}, 
      {array, whip_msg, whip_msgs} 
     ],

     [req_update_search_items % 请求更新收集, 服务端取消定时器，用这条协议来代替定时器触发完成事件
     ],
     %%-----------------------------变身道具----------------------------%%
     [notify_polymorph_result,      % 通知变身结果
      {string, account},            % 用户账号
      {polymorph, alter_body},      % 变身效果
      {string, message},            % 变身后的消息显示
      {string, user}                % 使用道具的人
     ],
     [req_purify_polymorph,         % 请求净化变身效果
      {string, target_account}      % 清除具体账户的效果
     ],
     [req_player_info,        % 请求用户数据
      {string, account}       % 用户账号
     ],
     [notify_player_info,     % 通知用户数据
      {player_basic_data, player}
     ],
     %%----------------------------合成系统------------------------------%%
     [req_produce,
      {uint64, produce_manual_id},   % 合成图谱的ItemInstanceID
      {int, lucky_stone_count},   % 幸福符数量
      {int, has_insurance}        % 是否有完璧符 0-没有，1-有
     ],
     [notify_produce_ack],        % 确认服务端收到请求
     [notify_produce,
      {int, result},              % 是否成功，0-失败,1-成功, 2-异常
      {string, message},          % 附加信息
      {item, finished},           % 合成的item
      {player_basic_data, player} % 用户信息
     ],
     [notify_produce_level,
      {int, level},               % 是否成功，0-失败,1-成功, 2-异常
      {int, experience}           % 附加信息
     ],
     %% -- 排行榜 -----------------------------------------
     [req_ranking,                % 请求获得排行版
      {int, type}                 % 排行版类型， 1 -- 等级排行， 2 -- 装饰度， 豪华度排行
     ],
     [ranking_data,               % 排行榜数据
      {string, account},          % 账号
      {int, data}                 % 数据
     ],
     [notify_ranking,             % 通知排行榜的结果
      {int, type},                % 排行版类型
      {int, self_ranking},        % 请求者所在的排名
      {array, ranking_data, data} % 榜单
     ],
     [req_score_ranking],         % 请求获得积分排行
     [notify_score_ranking,       % 通知积分榜单
      {int, self_score},          % 请求者自己的积分
      {array, ranking_data, data} % 榜单
     ],
     %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%私密权限%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
     [req_set_guest_book_opened, % 请求设置留言公开
      {uint64, id},            % 留言ID
      {int, opened}            % 0-不公开, 1-公开
     ],
     [notify_set_guest_book_opened,  %%通知
      {uint64, id},           % 留言ID
      {int, opened}            % 0-不公开, 1-公开
     ],
     [req_set_checkin_opened, % 请求设置签到公开
      {string, id},           % 签到id
      {int, opened}           % 0-不公开, 1-公开
     ],
     [notify_set_checkin_opened,
      {string, id},            % 签到id
      {int, opened}            % 0-不公开, 1-公开
     ],   
     %% -- 农场， 种植 -----------------------------------------
     [crop_event,
      {int, id},          % 事件的ID, 每个事件在每个作物里是唯一的, 但是作物间的事件ID是可以重复的, 为0的话, 就代表没有事件了
      {int, type},        % 事件类型, 1 -- 浇水, 2 -- 施肥
      {int, time}         % 什么时候触发该事件
     ],
     [crop_data, 
      {uint64, inst_id},  % 家具实例ID
      {int, item_id},     % 物品的ID
      {int, rest_time},   % 成熟时间的倒计时
      {array, int, fruit_id},    % 果实的ID
      {array, int, fruit_count}, % 果实的数量
      {array, crop_event, evt}       % 事件列表
     ],
     [req_plant_crop,             % 请求种植农作物
      {uint64, flowerpot_id},     % 花盆的实例ID
      {uint64, seed_id}           % 种子的实例ID
     ],
     [notify_farm_data,           % 通知农场的数据
      {uint64, house_id},         % 房屋ID
      {array, crop_data, crops},  % 作物列表
      {int, water_limit}          % 浇水次数限制
     ],
     [req_crop_event,             % 请求处理作物的事件
      {uint64, house_id},         % 房屋ID
      {uint64, inst_id},          % 作物的唯一ID, 也就是家具的ID
      {int, event_type},          % 事件类型
      {int, event_id}             % 事件的ID
     ],
     [req_all_crop_event,         % 请求处理所有作物的事件
      {uint64, house_id},         % 房屋ID
      {int, event_type}           % 事件类型
     ],
     [req_delete_crop,            % 请求铲除农作物
      {uint64, crop_id}           % 作物的ID, 就是家具的ID
     ],
     [notify_delete_crop,         % 通知铲除的结果
      {uint64, crop_id},          % 作物的ID, 就是家具的ID
      {int, result}               % 结果 1 -- 成功, 0 -- 失败
     ],
     [notify_crop_data,           % 通知单个作物的数据 
      {uint64, house_id},         % 房屋ID
      {int, op},                  % 操作的类型, 指明发送这条消息是由哪个操作引起的(种植, 浇水或者施肥)
      {crop_data, crop},          % 作物的数据
      {int, water_limit}          % 浇水次数限制
     ],
     [req_pick_crop_fruit,        % 请求采摘果实
      {uint64, crop_id}           % 作物的ID
     ],
     [notify_pick_crop_fruit,     % 采摘后的结果
      {uint64, house_id},         % 房屋ID
      {uint64, crop_id},          % 作物ID
      {int, result}               % 结果 1 -- 成功, 0 -- 失败
     ],
     [req_house_max_flowerpot    % 请求房屋能够摆放的最大花盆数量
     ],
     [notify_house_max_flowerpot, % 通知房屋能够摆放的最大花盆数量
      {uint64, house_id},
      {int, owner_number},        % 自己的花盆的最大数量
      {int, max_number}           % 花盆的最大数量
     ],
     [req_add_flowerpot_number   % 请求房屋能够摆放的最大花盆数量
     ],
     %%%%%%%%%%%%%%%%%%%%%%%%%%%离婚相关%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
     [req_breakup,               % 请求离婚
      {int, diamond},            % 离婚需要的水晶数
      {array, item, expect_items} % 离婚时需要获得的物品 list(instance_id)
     ],
     [notify_breakup_ack        % 通知离婚
     ],
     [notify_breakup_error      % 离婚请求失败
     ],
     [req_player_breakup       % 请求分手结果
     ],
     [notify_player_breakup_none %没有分手信息
     ],
     [notify_player_breakup,    % 分手后再上线，通知分手结果
      {string, account},        % 用户账户
      {int, diamond},           % 分到的水晶
      {array, int, unobtained_items} % 分手过程中被配偶转移的物品
     ],
     [req_player_breakup_diamond  % 领取离婚后所得的水晶
     ],
     [notify_player_breakup_diamond  % 通知一级领取
     ],
     [notify_player_be_breakuped],   % 通知被离婚
     %%-------------------------------悬赏奖励---------------------------%%
     [require_item_atom,                            %% 需要的物品
      {int, item_id},
      {int, item_count},
      {string, content}
     ],
     [reward_item_atom,
      {int, item_id},
      {int, item_count}
     ],
     [req_open_post_reward_ui                   %% 请求打开悬赏奖励界面
     ],
     [notify_open_post_reward_ui,
      {string, content},
      {array, require_item_atom, require_items},
      {array, reward_item_atom, reward_items},
      {int, reward_diamond},
      {int, reward_exp}
     ],
     [req_complete_post_reward],
     [notify_complete_post_reward,
      {complete_post_reward_type, result}
     ],
     %%----------------------------------积分抽奖---------------------------------%%
     [notify_active_score_lottery               %% 激活抽奖按钮
     ],

     [req_open_score_lottery_ui                 %% 请求打开抽奖界面
     ],

     [notify_open_score_lottery_ui,             %% 打开抽奖界面
      {array, lottery_item, items},             %% 可抽的物品列表
      {int, remain_count}                       %% 剩余抽奖次数(为0时关闭界面)
     ],
     
     [req_score_lottery                       %% 请求积分抽奖
     ],
     
     [notify_score_lottery_result,            %% 积分抽奖结果
      {array, lottery_item, items},           %% 可抽的物品列表
      {int, hit_index},                       %% 最后抽到的序号(下标从0开始)
      {int, remain_count}                     %% 剩余抽奖次数
     ],

     [req_refresh_score_lottery_ui                 %% 请求刷新抽奖界面
     ],

     [notify_refresh_score_lottery_ui,             %% 打开抽奖界面
      {array, lottery_item, items},             %% 可抽的物品列表
      {int, remain_count}                       %% 剩余抽奖次数(为0时关闭界面)
     ],
     %%----------------------------------每日活跃奖励---------------------------------%%
     [req_daily_reward_ui               %% 请求开ui
     ],

     [notify_daily_reward_ui,           %% 通知ui内容
      {array, int, progress_list},      %% 进度列表
      {array, int, reward_score_list},  %% 领奖分数列表
      {array, int, has_reward_list}     %% 已领奖列表
     ],

     [req_daily_reward,      %% 领奖
      {int, score}
     ],
     [notify_daily_active_can_reward %% 通知有奖励可以领取
     ],
     [req_close_daily_reward_ui               %% 请求关ui
     ],
     [req_immediate_complete_daily_reward,
      {int, index}                            %% 下标从1开始
     ],
     %%----------------------------------每日任务---------------------------------%%
     [req_open_daily_task_ui],
     [req_close_daily_task_ui],
     %%----------------------------------房屋的buff---------------------------------%%
     [req_get_buff                     %% 请求获得buff
     ],
     [player_buff_data,                %% 房屋buff的数据
      {int, id},                       %% buff的id
      {int, rest_time}                 %% buff剩余时间
     ],
     [notify_player_buff,               %% 通知房屋的buff
      {string, account},                %% 房屋的ID 
      {array, player_buff_data, buffs}  %% buff的数据
     ],
     [notify_add_buff,                  %% 增加新的buff
      {player_buff_data, buff}          %% buff数据
     ],
     %%----------------------------------酒吧---------------------------------%%
     [pub_account_info,                 %% 账号信息
      {string, account},                %% 账号 
      {string, name},
      {int, level}                      %% 等级
     ],

     [pub_info,                         %% 酒吧信息
      {uint64, pub_id},                 %% 酒吧id
      {pub_account_info, owner_info},   %% 酒吧拥有者账号信息
      {string, pub_name},               %% 酒吧名
      {int, person_count1},             %% 场景人数
      {int, person_count2},             %% 频道人数
      {int, max_person},                %% 人数上限
      {int, status},                    %% 状态(0离线, 1在线)
      {array, pub_account_info, admin_list},      %% 协管员 
      {uint64, voice_id}                %% yy语音id(有可能为0, 为0表示未创建yy语音聊天)
     ], 

     [req_pub_list,                     %% 按页请求酒吧列表
      {int, page}                       %% 请求哪一页(起始页与派对相同)
     ],

     [notify_pub_list,                  %% 发送酒吧列表
      {uint64, my_channel_id},             %% 我的频道(为0表示不存在)  
      {int, max_page},                  %% 最大页数
      {array, pub_info, pubs}
     ],

     [req_leave_pub_channel,            %% 离开频道 
      {uint64, pub_id}                  %% 酒吧id
     ],

     [req_enter_pub_channel,            %% 进频道,(进酒吧前，要先进频道)
      {uint64, pub_id}                  %% 酒吧id
     ],
     
     [notify_enter_pub_channel,
      {pub_info, info},                           %% 酒吧信息
      {array, pub_account_info, accounts}         %% 玩家列表
     ],

     [req_update_pub_voice_id,                       %% 设置酒吧语音id
      {uint64, pub_id},                              %% 酒吧id
      {uint64, voice_id}                             %% yy语音id(大于0)
     ],

     [notify_update_pub_voice_id,                    %% 酒吧语音id
      {uint64, pub_id},                              %% 酒吧id
      {uint64, voice_id}                                %% yy语音id(大于0)
     ],

     [req_chat_channel,      % 说话, 频道的人可以听到
      {uint64, channel_id},  %% id
      {string, content}  % 说话内容
     ],

     [notify_chat_channel,    % 通知频道的人，玩家说了一句话
      {uint64, channel_id},  %% id
      {string, account},  % 说话的玩家账号
      {string, player_name}, %% 玩家姓名
      {string, content}   % 说话内容
     ],

     [notify_channel_add_player,  % 添加玩家
      {uint64, channel_id},  % id
      {pub_account_info, account_info}     % 玩家账号
     ],

     [notify_channel_del_player,  % 删除玩家
      {uint64, channel_id},  % id
      {string, account}     % 玩家账号
     ],

     [req_channel_tell,     % 密聊 
      {string, target_player}, % 目标玩家
      {string, content}  % 说话内容
     ],
     
     [notify_channel_tell, % 通知玩家收到密聊信息
      {string, speaker}, % 说话的玩家账号
      {string, speaker_name}, % 说话的玩家姓名
      {string, content} % 说话内容
     ],

     [broadcast_kick_pub_player,
      {string, kicker},    %% 踢人者账号
      {string, be_kicket}  %% 被踢者账号
     ],

     [notify_update_pub_player_count,
      {int, person_count1},             %% 场景人数 
      {int, max_count1},                %% 场景人数上限
      {int, person_count2},             %% 频道人数
      {int, max_count2}                 %% 频道人数上限
     ],

     %%---------------------------------YY送礼-------------------------------------%%
     [req_send_yy_gift,              %% 请求发送礼物
      {string, recver_account},      %% 收礼人
      {int, gift_id},                %% 礼物ID
      {int, gift_count}              %% 礼物个数
     ],

     [broadcast_send_yy_gift,        %% 广播发送礼物结果
      {int, gift_id},                %% 礼物ID
      {int, gift_count},             %% 礼物个数
      {pub_account_info, sender_info},     %% 发送者
      {pub_account_info, recver_info}       %% 收礼者
     ],
     
     [req_kick_channel_player,       %% 踢人
      {string, account}              %% 被踢人的账号
     ],

     %%---------------------------------房屋解锁------------------------------------%%
     [notify_unlock_furniture_list,
      {array, int, unlock_list}
     ],

     [req_unlock_furniture,
      {int, id}
     ],

     [notify_unlock_furniture],
 
     %%---------------------------------兑换------------------------------------%%
     [req_exchange,
      {int, id}
     ],

     [notify_exchange],
     %%---------------------------------亲密度-------------------------------------%%
     [notify_friend_intimate,
      {string, account},
      {int, intimate}
     ],
     [req_flower_shake,
      {uint64, house_id},
      {int, shake_count},
      {int, enable_props} %% 0-不使用道具，1-使用道具
     ],
     [req_flower_love_coin_shake,
      {uint64, house_id}
     ],
     [notify_flower_shake,
      {int, diamond},
      {int, exp},
      {array, lottery_item, items},
      {int, shake_prop_count},
      {int, free_shake}
     ],
     [notify_flower_shake_prop_required],
     [req_flower_shaked,
      {uint64, house_id}
     ],
     [notify_flower_shaked,
      {int, free_shake},
      {int, total_shake_count},
      {int, free_shake_time}
     ],
     [notify_flower_love_coin_shaked,
      {int, total_shake_count},
      {int, love_coin_shake}
     ],
     [notify_flower_shake_overflow,  %%已经达到最大次数
      {int, available}
     ],
     %% 充值返还
     [req_first_payment_return_status],
     [notify_first_payment_return_status,
      {int, returned}   %% 0-没有， 1-有 
     ],
     [req_first_payment_return_reward],
     [notify_first_payment_return_reward,
      {int, returned}   %% 0-没有， 1-有 
     ],
     [single_payment_return_item,
      {int, return_diamond},
      {int, return_count}
     ],
     [req_single_payment_return],  %%单次返回
     [notify_single_payment_return,
      {array, single_payment_return_item, items}
     ],
     [req_single_payment_return_reward,  %%领取单次返回
      {int, return_diamond}
     ],
     [notify_single_payment_return_reward,
      {int, returned}
     ],
     [total_payment_return_item,  %% 总额返还
      {int, consume_amount},
      {array, lottery_item, return_items},
      {int, returned} %% 0 - 不可领取， 1-可以领取
     ],
     [req_total_payment_return],  %%
     [notify_total_payment_return,
      {int, total_amount},
      {array, total_payment_return_item, items}
     ],
     [req_total_payment_return_reward,
      {int, consume_amount}
     ],
     [notify_total_payment_return_reward,
      {int, returned}
     ],
     [req_item_upgrade,
      {uint64, instance_id}
     ],
     [notify_item_upgrade,
      {uint64, upgrade_item_instanceid},
      {int, result} %0-失败,1-成功
     ], 
     [req_mutli_item_upgrade,
      {array, uint64, inst_ids}
     ],
     [notify_mutli_item_upgrade,
      {array, house_furniture, furnitures},
      {int, decoration}
     ],
     [notify_make_up_info, %% 通知补偿信息
      {int, level}  %% 等级
     ],
     %%---------------------------酒吧场景-----------------------------------
     [req_enter_pub_scene    % 进入酒吧场景
     ],     

     [notify_enter_pub_scene, % 自已进入公共场景
      {int, template_id},        % 场景模板ID
      {pub_info, info},                           %% 酒吧信息
      {array, pub_account_info, accounts},        %% 玩家列表
      {point, enter_pos}         % 进入点
     ],
     %%---------------------------小精灵-----------------------------------
     [req_get_sprites            %% 请求获得小精灵
     ],
     [req_click_sprite,          %% 请求点击小精灵
      {int, id}                 %% 精灵ID
     ],
     [sprite,                    %% 精灵数据
      {int, id},                 %% 小精灵的模板表中的id
      {int, curr_exp},           %% 当前经验(就是该小精灵出现的次数)
      {int, level},              %% 小精灵的等级
      {int, remain_time}         %% 精灵剩余的显示时间
     ],
     [notify_sprite_data,        %% 通知精灵的数据
      {int, appraise},           %% 评价
      {array, sprite, sprites}   %% 精灵列表数据
     ],
     [notify_del_sprite,         %% 删除小精灵
      {int, id},                 %% 精灵ID
      {int, del}                 %% 是否删除, 1--删除, 0--不用删除
     ],
     [req_click_guest,           %% 点击客人
      {int, appraise}            %% 评价
     ],
     [notify_can_click_guest,    %% 客人是否可以点
      {int, canClick}            %% 是否可以点, 0 -- 不能, 1 -- 可以
     ],
     [notify_sprite_upgrade,     %% 通知客户端, 小精灵升级了
      {int, id},                 %% 小精灵ID
      {int, level}               %% 小精灵的等级
     ],   
     %%---------------------------食物系统-----------------------------------
     [req_unlock_food,
      {int, id}
     ],
     [notify_unlock_food,
      {int, id}
     ],
     [req_unlock_food_info
     ],
     [notify_unlock_food_info,
      {array, int, ids}
     ],
     [req_expand_food_stock,
      {int, id}
     ],
     [food_stock_info,
      {int, id},
      {int, size},
      {int, value},
      {int, seconds},
      {stime, due_time}
     ],
     [notify_expand_food_stock,
      {int, id},
      {stime, due_time}
     ],
     [notify_settlement_expand_food_stock,
      {int, id},
      {int, size}
     ],
     [req_food_stock_info
     ], 
     [notify_food_stock_info,
      {array, food_stock_info, stock_info}
     ],
     [req_cancel_expand_food_stock,
      {int, id}
     ],
     [notify_cancel_expand_food_stock,
      {int, id}
     ],
     [req_complete_expand_food_stock,
      {int, id},
      {int, grid_index}
     ],
     [notify_complete_expand_food_stock,
      {int, id},
      {int, grid_index}
     ],
     [req_immediately_complete_expand_stock,
      {int, id},
      {int, grid_index}
     ],
     [notify_immediately_complete_expand_stock,
      {int, id},
      {int, grid_index}
     ],
     [req_expand_produce_area,
      {int, grid_index}
     ],
     [notify_expand_produce_area,
      {int, number},
      {int, grid_index}
     ],
     [req_produce_area
     ],
     [notify_produce_area,
      {int, number}
     ],
     [req_upgrade_food,
      {int, id}
     ],
     [notify_upgrade_food,
      {int, id},
      {int, upgrade_id}
     ],
     [food_upgrade_info,
      {int, id},
      {int, upgrade_id}
     ],
     [req_food_upgrade_info
     ],
     [notify_food_upgrade_info,
      {array, food_upgrade_info, upgrade_info}
     ],
     [product_atom,
      {int, id},
      {int, copies}
     ],
     [req_make_product,
      {array, product_atom, products},
      {stime, start_time}
     ],
     [notify_make_product,
      {stime, start_time}
     ],
     [req_remove_product,
      {int, position}
     ],
     [notify_remove_product,
      {stime, start_time}
     ],
     [req_complete_product
     ],
     [notify_complete_product
     ],
     [req_immediately_complete_product
     ],
     [notify_immediately_complete_product
     ],
     [req_products
     ],
     [product_info,
      {int, id},
      {int, product_id},
      {int, copies}],
     [notify_products,
      {stime, start_time},
      {array, product_info, info}
     ],
     [notify_food_settlement_diamond,
      {int, diamond}
     ],
     [notify_reset_temp_diamond
     ],
     %%---------------------------派对请喝酒-----------------------------------
     [req_ask_drink_count,        %% 询问服务端, 请过多少次酒了
      {int, drink_id}           %% 酒水ID
     ],
     [shout_data,                %% 请喝酒的数据
      {int, id},                 %% 请喝酒的是什么酒, 就是酒的id
      {int, count}               %% 该类型的酒请喝了多少次
     ],
     [notify_drink_count,        %% 请喝酒的次数
      {int, scene_player_count}, %% 玩家数量
      {int, cost},               %% 需要花多少钱
      {array, shout_data, shout} %% 请喝酒的数据
     ],
     [req_party_drink,           %% 请喝酒
      {int, drink_id}            %% 酒水ID
     ],
     %----------------------魅力值-------------------------------------
     [req_calc_player_charm
     ],
     [notify_calc_player_charm,
      {int, charm}
     ],
     %%---------------------------派对积分货币-----------------------------------
     [notify_init_party_coin,
      {int, coin}
     ],
     [notify_party_score_coin,
      {int, coin}               
     ]
    ].

% 获得枚举类型的定义
get_enum_def() ->
    [
     {ver_validate_result, [ver_ok, ver_fail]}, % 版本验证结果
     {login_result, [lr_ok, lr_fail, lr_fail_pwd, lr_fail_account, 
		     lr_fail_version, lr_no_roles, lr_fail_other, lr_fail_mateuping]},          % 登录结果
     {create_role_result, [rr_ok, rr_fail]},    % 创建角色结果
     {enter_game_result, [sr_ok, sr_fail]},    % 登录游戏结果
     {package_type, % 包裹类型
      [pt_bag,      % 玩家背包
       pt_body     % 玩家装备
      ]}, 
     {invitation_type, [ivt_trade,       % 邀请交易
			ivt_enter_house, % 邀请进房间
			ivt_make_friend,  % 邀请加为好友
			ivt_private_party % 私人集会
		       ]
     },
     {party_type, [ivt_normal,
		   ivt_private 
		  ]
     },
     {sys_broadcast_type,  % 系统公告类型
      [
       sbt_sys_show,       %1、	系统自动显示播放的公告
       sbt_at_time,        %2、	系统定点发送的公告
       sbt_player_behavior,%3、	玩家行为引起的服务器公告
       sbt_gm,             %4、	对于GM或者其他的官方管理人员进行临时发出的公告
       sbt_farm,           %5、	农场的公告
       sbt_per_day         %6、	每天公告
      ]},
     {track_task_result, [ttr_ok, ttr_fail]},                      % 跟踪任务结果
     {cancel_track_task_result, [cttr_ok, cttr_fail]},             % 取消跟踪任务结果
     {task_give_up_result, [tgur_ok, tgur_fail]},                  % 放弃任务结果
     {ui_type, [uit_sysshop,   % 系统商城界面
		uit_npcshop,   % npc商店
		uit_farmdepot, % 农场仓库
		uit_depot,     % 玩家仓库
		uit_bag,       % 玩家包裹
		uit_housetransaction % 房屋买卖
	       ] 
     },
     %% 小游戏类型
     {sg_type, [sgt_farm       % 农场
	       ] 
     },
     {comment_result, [cr_ok, cr_fail]},    % 留言结果
     {disease_type, [dt_normal, dt_white, dt_yellow, dt_purple, dt_red]},  %% 疾病类型
     {buy_house_result, [bhr_replace, bhr_add]},
     {set_house_welcome_words_result, [shwwr_ok, shwwr_fail]},
     {set_house_permission_result, [shpr_ok, shpr_fail]},
     {house_permission_type, [hpt_none, hpt_friend]},
     {furniture_permission_type, [fpt_yes, fpt_no]},
     {house_visit_type, [hvt_visit, hvt_leave, hvt_pick_garbage]},
     {clear_house_log_result, [chlr_ok, chlr_fail]},
     {accept_invite_type, [accept_invite_yes, accept_invite_no]},
     {anonymous_type, [at_yes, at_no]},
     {buy_goods_type, [bgt_buy, bgt_use]},
     {pay_goods_type, [pgt_game_gold, pgt_love_coin]},
     {task_type, [tt_daily, tt_chain]},
     {sex_type, [st_boy, st_girl, st_unknow]},
     {item_type, [it_dress,  % 服装 
		  it_furniture, % 家具 
		  it_object, % 物件 
		  it_prop % 道具
		 ]},
     {change_dress_type, [cdt_ok, cdt_coin_fail, cdt_item_fail]},
     {audio_status_type, [ast_open, ast_close]} ,
     {mateup_status_type, [mst_single, mst_mateuping, mst_mateuped, mst_breakuping]},
     {money_type, [mt_diamond,   % 爱情水晶
		   mt_love_coin, % 爱情币
		   mt_point      % 玩家积分
		  ]},
     {notify_gift_type, [nsgt_ok, nsgt_fail]},
     {enter_house_type, [eht_party,         % 派对
			 eht_photo_friend,  % 照片交友
			 eht_friend_list,   % 好友列表
			 eht_attention,     % 关注
			 eht_owner_house,   % 进入自己房屋
			 eht_guest_book,    % 留言
			 eht_menu,          % 环形菜单
			 eht_wish,          % 许愿单
			 eht_person_info,   % 个人资料
			 eht_visit_log,     % 访问记录
			 eht_ranking_list,  % 排行榜
			 eht_yy_audio       % YY语音
			]},
     {wish_type, [wt_normal, wt_house]},
     {show_type, [st_show, st_hide]},
     {share_type,[st_party,      % 派对
		  st_attention,  % 关注
		  st_pair,        % 配对
		  st_itemmake     %% 合成
		 ]},
     {pack_task_type, [ptt_dialogue,        %% 对话
		       ptt_deliver_goods,   %% 送货
		       ptt_find_item,       %% 寻物
		       ptt_collect,         %% 收集
		       ptt_function,         %% 功能
		       ptt_post_reward
		      ]},
     {complete_post_reward_type, [cprt_ok, cprt_fail]},
     {common_bool, [cb_true, cb_false]},
     {walk_type, [wt_none, wt_walk, wt_run]},
     {close_window_type, [cwt_welcome]}		%欢迎界面
    ].


get_version() -> 
    562. 
 
