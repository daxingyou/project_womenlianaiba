-record(house_data, 
	{house_id=0, 
	 template_id=0, 
	 furniture_permission=0, 
	 furniture_vec=[], 
	 room_tex_vec=[], 
	 welcome_words="", 
	 house_permission=0, 
	 visit_logs=[], 
	 buy_date, 
	 level=0, 
	 house_clean=0, 
	 boy='', 
	 girl='', 
	 name="", 
	 mateup_status=0, 
	 lover_diamond=0, 
	 lover_package=[],
	 exp=0,            %% �ܾ���(�ȼ��͵�ǰ����Ҫ�������)
	 right_grade=0,    %% ��Ȩ�ȼ�
	 light_plan,       %% �Զ����ص� 
	 decoration=0,      %% װ�޶�
	 search_plan       %% ������Ʒ
	}).

-record(player_unlock_house,{account,
			     unlock_list
			    }).
