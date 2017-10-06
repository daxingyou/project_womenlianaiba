%% -----------------------------------------------------------
%% 注意: 脚本中文要用utf8编辑(将此文件拷贝一下，用ue编辑，输入的中文应该就是utf8)
%%       npc脚本统一放到npc目录下，npc不一定要有脚本，有需要才写
%% 函数返回值说明: 
%%     []中括号包住的，表示要显示到ui的内容  talk 标签表示对话，button 标签表示按钮
%%     其它返回值表示关闭对话界面 
%% -----------------------------------------------------------
-module(npc_1).
-compile(export_all).
-compile(nowarn_unused_vars).

%% npc被点击激活
active(Player) ->
    %% 界面要显示的内容
    DestNpcName = "神秘人",

    [{talk,"嘘，小声。我正在办理重要的事情，没有什么事就请走开。"},  
     {button, more, "1.你是谁？"}, 
     case script:get_ring_task_type(Player)	of		
	 5 ->
	     {button, give_something, "2.我完成了你的工作要求！"};
	 _->		
	     case script:get_ring_task_npc_id(Player)	of
		 1 ->
		     {button, give_something, "2.我把你要的东西带来了。"};    
		 _->
		     case script:has_ring_task(Player) of
			 true ->
			     {button, complete_task, "2.任务已经完成，我来领取奖励。"};
			 false ->
			     {button, open_ring_task, "2.我想来接受连环任务。"}
		     end	
	     end
     end,
     {button, reject, "3.再见。"}
    ].


reject(Player) ->
    ok. %% 关闭对话

open_ring_task(Player) ->
    case script:has_ring_task(Player) of
	true ->
	    [{talk, "你已经有连环任务了。"},  
	    {button, reject, "1.我会打开任务界面再确认一下。"}];
	false ->
	    script:give_ring_task(Player),
	    ok %% 关闭对话
    end.

more(Player) ->
  [{talk, "哼哼，说出来吓死你。我可是受秘密部门派遣的特别秘密办事人员。\n不过最近事情实在太多了，我有点忙不过来。\n我看你骨骼清奇是个好苗子，愿意帮帮我的忙吗？"},  
   {button, more1, "1.要怎么帮你？"},  	
   {button, reject, "2.我可没兴趣，再见。"} 
  ].  

more1(Player) ->
  [{talk, "很简单，我这里有一连串的任务。只要你按任务的要求完成，我就能给你奖励和新的任务。\n完成的任务越多，在我这里累计的奖励也就越好。\n不过……"},  
   {button, more2, "1.不过？"},
   {button, reject, "2.我可没兴趣，再见。"} 	
  ].  

more2(Player) ->
  [{talk, "总会有些麻烦的。\n首先，你要注意每个任务限定的时间，超出时间了，我可是不会承认的。\n其次，你必须连续完成任务，才能获得更好的奖励，一旦失败，奖励只能从最普通的一种给你啦。"},  
   {button, more3, "1.我突然有事，想要中断怎么办？"}, 	
   {button, reject, "2.我可没兴趣，再见。"} 	
  ].  

more3(Player) ->
  [{talk, "这一点我早帮你考虑到了，在商城里有出售一种“时光暂停钟”的东西。\n只要买一个，然后就可以在“连环任务”的面板里将任务的时间暂停住，很方便的。"},  
   {button, more4, "1.任务会很难吗？"},	
   {button, reject, "2.我可没兴趣，再见。"} 	
  ].  

more4(Player) ->
  [{talk, "有的难，有的简单。这要看你的运气！\n这不能怪我，每次总部给我下达的任务都是不同的。\n啊，我好像听见总部又在呼叫我了，看来是有新任务，你要接个任务吗？"},  
   {button, open_ring_task, "1.我要接受连环任务。"},
   {button, more1, "2.我想再听一遍说明"},	
   {button, reject, "3.我可没兴趣，再见。"} 	
  ]. 
   	
give_something(Player) ->
	case script:has_complete_ring_task(Player) of
	true ->
	    	complete_task(Player);
	false ->
			   	case script:complete_ring_task(Player) of
				true ->
		   	 	complete_task(Player);
		    false ->
		    	ok %% 关闭对话
		    end
    end.  

complete_task(Player) ->
    case script:has_complete_ring_task(Player) of
	true ->
	    [{talk, "请选择你要的奖励。"},  
	     {button, diamond, "1.水晶。"},
	     {button, exp, "2.经验。"},
	     {button, reject, "3.下次再选。"}];
	false ->
	    [{talk, "你的任务好像没有完成啊，骗人是不对的。"},  
	    {button, reject, "1.我这就去完成任务，再见。"}]
    end.

diamond(Player) ->
    case script:reward_ring_task(Player, diamond) of
    true ->
	    script:give_ring_task(Player),
	    ok;
	  false ->
	  	ok %% 关闭对话
	 end.  	

exp(Player) ->
    case script:reward_ring_task(Player, exp) of
    true ->
	    script:give_ring_task(Player),
	    ok;
	  false ->
	  	ok %% 关闭对话
	 end.  
