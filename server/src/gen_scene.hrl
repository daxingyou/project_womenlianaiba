
-include("packet_def.hrl").


%%�������� 
-record(scene_data,{
	  scene_name,            %% ��������
	  players = dict:new(),  %% ����б�, һ��dict
	  enter_pos=#point{x=0,y=0,z=0}, %% �����
	  module,                   %% ģ����
	  temp_furnitures = [],     %% �Ҿ���ʱ��Ϣ
	  custom_data            %% ���ݻ򹫹��������Զ�����
	 }).
