%% -record(player, { username, create_date, login_ip }).
-record(tcp_mm_data, {
	  socket,     % client socket
	  addr,       % client address
	  account,    % ����ʺ�, ��Ӧopenkey
	  password,   % ��Ӧopenid
	  login_type, % ��½����(��½�ĸ�ƽ̨)
	  player_sup, % �������ص�ϵͳ��pid����� 
	  is_first_time_login=false, % �Ƿ��һ�ν���Ϸ
	  eq_pid,
	  pid,        % �����̵�pid 
	  pf_key,     % ƽ̨��Ϣ���ܴ�
	  packet_count=0 % ����ֵ, ������ֹ�ط���  
	 }).
