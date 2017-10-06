-record(player_data, {
	  account = "",                              % 自己的帐号
	  lover = "",                                % 爱人的帐号
	  scene_name='',                             % 场景名称
	  house_id,
	  pub_id=0,                                  % 酒吧id
	  mm_pid,                                    % 中间人:网关进程的PID
	  net_process = [],                          % 网络消息处理器
	  walk_type,
	  curr_pos=#point{x=0.0,y=0.0,z=0.0},        % 玩家当前点坐标
	  dest_pos=#point{x=0.0,y=0.0,z=0.0},        % 玩家目标点坐标
	  walk_plan=[],                              % 行走停下来后计划做什么事
	  actions = [],                              % 当前动作(编辑房屋，交易等等)       
	  use_furni_info=0,                          % 使用家具的信息
	  action_status = "",                        % 动作状态
	  action_type = "",                          % 动作类型
	  login_time,                                % 玩家登陆时间
	  party_buff_timer=[],                          % 派对buff定时器
	  is_first_time_login,                       % 是否首次登陆
	  first_photo_player,                        % 照片交友的当前玩家
	  password,                                  % 对应openkey
	  login_type,                                % 登陆类型(登陆哪个平台)
	  client_ip,                                 % 客户端ip
	  pf_key,                                    % 平台信息加密串
	  is_start_mind_quiz,
	  mind_quiz_rewards,
	  party_point                                % 派对积分，每次派对只能增加固定上限
	 }).

