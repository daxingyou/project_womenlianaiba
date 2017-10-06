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
	 exp=0,            %% 总经验(等级和当前经验要换算出来)
	 right_grade=0,    %% 产权等级
	 light_plan,       %% 自动开关灯 
	 decoration=0,      %% 装修度
	 search_plan       %% 搜索物品
	}).

-record(player_unlock_house,{account,
			     unlock_list
			    }).
