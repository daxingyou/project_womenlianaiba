%% -----------------------------------------------------------
%% 注意: 脚本中文要用utf8编辑(将此文件拷贝一下，用ue编辑，输入的中文应该就是utf8)
%%       npc脚本统一放到npc目录下，npc不一定要有脚本，有需要才写
%% 函数返回值说明: 
%%     []中括号包住的，表示要显示到ui的内容  talk 标签表示对话，button 标签表示按钮
%%     其它返回值表示关闭对话界面 
%% -----------------------------------------------------------
-module(npc_2).
-compile(export_all).
-compile(nowarn_unused_vars).

%% npc被点击激活
active(Player) ->
  %% 界面要显示的内容
    DestNpcName = "劳意",

    [{talk,"你好，有什么是我可以帮助你的么？"} ] ++
	case	script:get_ring_task_npc_id(Player)	of
		2 ->
			case script:has_ring_task(Player) of
			    true ->
				[{button, more, "1.你是谁？"}, 
				 {button, open_post_reward_ui, "2.我想看看今天你要回收什么？"},
				 {button, task, "3." ++ script:get_ring_task_npc_options(Player)},
				 {button, reject, "4.再见。"}
				];
			    false ->
				[{button, more, "1.你是谁？"}, 
				 {button, open_post_reward_ui, "2.我想看看今天你要回收什么？"},
				 {button, reject, "3.再见。"}
				]
				end;
		_->
				[{button, more, "1.你是谁？"}, 
				 {button, open_post_reward_ui, "2.我想看看今天你要回收什么？"},
				 {button, reject, "3.再见。"}
				]
		end. 

reject(Player) ->
    ok. %% 关闭对话

open_post_reward_ui(Player) ->
    script:open_post_reward_ui(Player).

more(Player) ->
    [{talk, "大自然是需要我们去爱护，才会变得更美的。所以我现在的任务就是来这里回收各种你们不再需要的东西。每天我都会发布一次要回收的物品，如果你带来足够多的物品，我会慷慨的授予你豪华的奖励的！"},  
     {button, active, "1.我明白了。"} 	
    ].  

task(Player) ->
	case script:complete_ring_task(Player) of
		true ->
    [{talk, script:get_ring_task_npc_content(Player)}, 
     {button, reject, "1.我的任务完成了，再见。"} 	
    ];
    false ->
    	ok %% 关闭对话
    end.  
