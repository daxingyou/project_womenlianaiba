%% -----------------------------------------------------------
%% 注意: 脚本中文要用utf8编辑(将此文件拷贝一下，用ue编辑，输入的中文应该就是utf8)
%%       npc脚本统一放到npc目录下，npc不一定要有脚本，有需要才写
%% 函数返回值说明: 
%%     []中括号包住的，表示要显示到ui的内容  talk 标签表示对话，button 标签表示按钮
%%     其它返回值表示关闭对话界面 
%% -----------------------------------------------------------
-module(npc_3).
-compile(export_all).
-compile(nowarn_unused_vars).

%% npc被点击激活
active(Player) ->
  %% 界面要显示的内容
  DestNpcName = "旅行中的少女",
  
  [{talk,"我的心在流浪，总是在寻找一个安逸的地方。"}] ++  
  case	script:get_ring_task_npc_id(Player)	of
		3 ->
			case script:has_ring_task(Player) of
			    true ->
				[{button, task, "1." ++ script:get_ring_task_npc_options(Player)},{button, reject, "2.再见。"}];
			    false ->
				[{button, reject, "1.再见。"}]
			end;
		_->
			[{button, reject, "1.再见。"}]
		end.

task(Player) ->
	case script:complete_ring_task(Player) of
		true ->
    [{talk, script:get_ring_task_npc_content(Player)}, 
     {button, reject, "1.我的任务完成了，再见。"} 	
    ];
    false ->
    	ok %% 关闭对话
    end.   
  	
reject(Player) ->
  ok. %% 关闭对话
