-record(gift_list, {             %% �����б�
	  account,               %% ����ʺ�
	  send_list = [],        %% �����б�
	  receive_list = [],     %% δ�����б�
	  received_list = []     %% �����б�
	 }).

-record(player_gift, {
	  house_id,              %% ����Id
	  boy = #gift_list{},    %% ���Խ�ɫ������
	  girl = #gift_list{}    %% Ů�Խ�ɫ������
	 }).
