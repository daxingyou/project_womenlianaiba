-record(player_data, {
	  account = "",                              % �Լ����ʺ�
	  lover = "",                                % ���˵��ʺ�
	  scene_name='',                             % ��������
	  house_id,
	  pub_id=0,                                  % �ư�id
	  mm_pid,                                    % �м���:���ؽ��̵�PID
	  net_process = [],                          % ������Ϣ������
	  walk_type,
	  curr_pos=#point{x=0.0,y=0.0,z=0.0},        % ��ҵ�ǰ������
	  dest_pos=#point{x=0.0,y=0.0,z=0.0},        % ���Ŀ�������
	  walk_plan=[],                              % ����ͣ������ƻ���ʲô��
	  actions = [],                              % ��ǰ����(�༭���ݣ����׵ȵ�)       
	  use_furni_info=0,                          % ʹ�üҾߵ���Ϣ
	  action_status = "",                        % ����״̬
	  action_type = "",                          % ��������
	  login_time,                                % ��ҵ�½ʱ��
	  party_buff_timer=[],                          % �ɶ�buff��ʱ��
	  is_first_time_login,                       % �Ƿ��״ε�½
	  first_photo_player,                        % ��Ƭ���ѵĵ�ǰ���
	  password,                                  % ��Ӧopenkey
	  login_type,                                % ��½����(��½�ĸ�ƽ̨)
	  client_ip,                                 % �ͻ���ip
	  pf_key,                                    % ƽ̨��Ϣ���ܴ�
	  is_start_mind_quiz,
	  mind_quiz_rewards,
	  party_point                                % �ɶԻ��֣�ÿ���ɶ�ֻ�����ӹ̶�����
	 }).

