
-include("packet_def.hrl").


%%场景数据 
-record(scene_data,{
	  scene_name,            %% 场景名称
	  players = dict:new(),  %% 玩家列表, 一个dict
	  enter_pos=#point{x=0,y=0,z=0}, %% 进入点
	  module,                   %% 模块名
	  temp_furnitures = [],     %% 家具临时信息
	  custom_data            %% 房屋或公共场景的自定数据
	 }).
