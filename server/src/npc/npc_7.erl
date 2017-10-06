%% -----------------------------------------------------------
%% 注意: 脚本中文要用utf8编辑(将此文件拷贝一下，用ue编辑，输入的中文应该就是utf8)
%%       npc脚本统一放到npc目录下，npc不一定要有脚本，有需要才写
%% 函数返回值说明: 
%%     []中括号包住的，表示要显示到ui的内容  talk 标签表示对话，button 标签表示按钮
%%     其它返回值表示关闭对话界面 
%% -----------------------------------------------------------
-module(npc_7).
-compile(export_all).
-compile(nowarn_unused_vars).

%% npc被点击激活
active(Player) ->
    %% 界面要显示的内容
    DestNpcName = "圣诞老人",

    [{talk,"活动结束了，请今年的圣诞再来吧。祝你新年快乐！！"}] ++
	case script:is_christmas_day() of
	    true ->
		 		[{button, reject, "1.你也新年快乐，再见。"}];
	    _->
 		[{button, reject, "1.你也新年快乐，再见。"}]
    %%		[{button, gift, "1.我来领礼物。（需要5点体力）"},
    %%		 {button, reject, "2.你也圣诞快乐，再见。"}
    %%		]
	end.

gift(Player) ->
    case script:get_hp(Player) < 5 of
	true ->
	    [ {talk,"你的体力不足，至少需要5点体力哦。"},
	      {button, reject, "1.那我下次再来，再见。"}
	    ];
	false ->
	    case script:is_boy(Player) of
		true ->
		    script:dec_hp(Player, 5),
		    script:add_item(Player, 8500005),
		    script:add_item(Player, 8500006),
		    script:add_item(Player, 8500007),
		    ok;
		false ->
		    script:dec_hp(Player, 5),
		    script:add_item(Player, 8500008),
		    script:add_item(Player, 8500009),
		    script:add_item(Player, 8500010),
		    ok
	    end
    end.

reject(Player) ->
    ok. %% 关闭对话
