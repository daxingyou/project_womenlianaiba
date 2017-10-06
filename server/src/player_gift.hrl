-record(gift_list, {             %% 礼物列表
	  account,               %% 玩家帐号
	  send_list = [],        %% 发送列表
	  receive_list = [],     %% 未接收列表
	  received_list = []     %% 接受列表
	 }).

-record(player_gift, {
	  house_id,              %% 房屋Id
	  boy = #gift_list{},    %% 男性角色的礼物
	  girl = #gift_list{}    %% 女性角色的礼物
	 }).
