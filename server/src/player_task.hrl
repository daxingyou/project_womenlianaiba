-record(player_task, {
	  account,                    %% ����ʺ�
	  give_tasks,                 %% �Ѿ��ӵ�����, [#task{}, ...]
	  flags,                      %% �����ǣ����ڱ������ϵͳ��״̬,�ṹ[{key, value}, ...]
	  events,
	  complete_chain_tasks = []
	 }).

-record(task, {
	  inst_id,                    %% ����ʵ��Id
	  id,                         %% ��Ӧ���������͵�Id������������ճ����񣬴�λ���򱣴��ճ�������Id���������ʽ�����򱣴���ʽ�����Id
	  task_id,                    %% ����Id
	  type,                       %% ��������, ��(�ճ�������ʽ���񣬽�������)
	  give_date,                  %% ������ܵ�����
	  complete_date,              %% ������ɵ�����
	  reward_date,                %% ����������
	  flag_info,
	  complete_task_ids = []      %% ��ɵ�����Id
	 }).

-record(daily_task, {
	  account,
	  complete_tasks
	 }).
