%%%-------------------------------------------------------------------
%%% @author linyijie <linyj@35info.cn>
%%% @copyright (C) 2013, linyijie
%%% @doc
%%%  小精灵
%%% @end
%%% Created : 29 Mar 2013 by linyijie <linyj@35info.cn>
%%%-------------------------------------------------------------------
-module(sprite).

-include("tplt_def.hrl").
-include("router.hrl").
-include("packet_def.hrl").
-include("common_def.hrl").
-include("sys_msg.hrl").
-include("player_buff.hrl").

-export([start/1, handle_cast/2, handle_click_guest/2]).
-compile(export_all).

-define(normal_sprite_id, 0).  %% 普通小精灵的id, 特殊小精灵的id是在模板表里定义的

-record(sprite_data, {id,                 %% 模板表ID
		      level,              %% 等级
		      show_count = 0,     %% 小精灵出现的次数
		      finish_time         %% 小精灵到什么时间点就不显示了
		     }).

-record(player_sprite, {account,
			sprites = [],   %% 精灵列表
			time,           %% 评价对应的时间, 每天清除appraise的数据为0
			appraise=0      %% 评价
	       }).

%% -record(special_sprite_tplt, %% 特殊小精灵
%% 	    {id = 1,         %% 特殊小精灵会有多种, 因此需要一个特殊的ID标记
%% 	     count = 20,     %% 点击了多少个小精灵才会出现特殊的精灵
%% 	     need_hp=10,     %% 需要扣多少的体力
%% 	     add_coin=0,     %% 奖励多少水晶
%% 	     add_exp=0,      %% 奖励多少经验
%% 	     add_items = [{2200081, 1}],
%% 	     model = "love_elf2.mod.u3d",    %% 小精灵的模型
%% 	     particle = "elf002.prefab.u3d",  %% 小精灵出现的粒子效果
%% 	     click_particle = "elf02_over.prefab.u3d"%% 点击小精灵的时候出现的粒子效果
%% 	    }).

start(Account) ->
    [router:make_event_source(?msg_req_get_sprites, Account, {Account, ?MODULE}),
     router:make_event_source(?msg_req_click_sprite, Account, {Account, ?MODULE})
    ]. 

handle_click_guest(Account, Appraise) ->
    PlayerSprite = get_player_sprite_data(Account),
    TotalAppraise = PlayerSprite#player_sprite.appraise + Appraise,
    PlayerSprite1 = PlayerSprite#player_sprite{appraise=TotalAppraise},    
    PlayerSprite2 = show_sprite(Account, PlayerSprite1),
    db:dirty_write(PlayerSprite2),
    send_data(Account, PlayerSprite2).

%% 处理获得精灵的请求
handle_cast({#msg{src=Account}, #req_get_sprites{}}, PlayerData) ->
    handle_get_sprites(Account),
    {noreply, PlayerData};

%% 处理点击精灵的请求
handle_cast({#msg{src=Account}, #req_click_sprite{id=SpriteID}}, PlayerData) ->
    handle_click_sprite(Account, SpriteID),
    {noreply, PlayerData}.

handle_get_sprites(Account) ->
    PlayerSprite = get_player_sprite_data(Account),
    send_data(Account, PlayerSprite).

handle_click_sprite(Account, SpriteID) ->
    F = fun() -> 
		[BasicData] = db:read(player_basic_data, Account),
		HouseID = player_basic_data:get_house_id(BasicData),
		[HouseData] = db:read(house_data, HouseID),
		PlayerSprites = get_player_sprite_data(Account),
		Sprite1 = get_sprite(SpriteID, PlayerSprites#player_sprite.sprites),
		Tplt = tplt:get_data2(normal_sprite_tplt, SpriteID),
		DecHp = Tplt#normal_sprite_tplt.hp,
		case player_hp:dec_hp(DecHp, BasicData, HouseData) of
		    {ok, NewBasicData} ->
			Sprite = upgrade_sprite(Sprite1, 1),
			{AddCoin, AddExp, AddItem} = get_awards(SpriteID, Sprite#sprite_data.level),
			HouseData1 = house_diamond:add_diamond(AddCoin, HouseData),

			Sprites = set_sprite_dispear(Sprite, PlayerSprites#player_sprite.sprites),
			PlayerSprites1 = PlayerSprites#player_sprite{sprites=Sprites},

			db:write(PlayerSprites1),
			{BasicData2, HouseData2, ExpMsgs} = 
			    house_level_exp:add_exp(AddExp, NewBasicData, HouseData1),

			player_hp:save_hp(BasicData2),
			{HouseData3, ItemMsgs} = house_pack:add_items(AddItem, HouseData2), 
			house_pack:save(HouseData3),
			IsUpgrade = Sprite#sprite_data.level =/= Sprite1#sprite_data.level,
			{true, Sprite, BasicData2, HouseData3, ExpMsgs, ItemMsgs, AddItem, IsUpgrade};
		    {false, MsgID}  -> {false, Sprite1, MsgID}
		end
	end,
    case db:transaction(F) of
	{true, Sprite, BasicData2, HouseData4, ExpMsgs1, ItemMsgs1, AddItem, IsUpgrade} ->
	    player_hp:send(Account, BasicData2, HouseData4),
	    house_level_exp:send_msgs(ExpMsgs1, HouseData4),
	    house_diamond:notify(HouseData4),
	    house_pack:send_msgs(ItemMsgs1, HouseData4),
	    [begin
		 ItemName = item:get_item_name(ItemID),
		 sys_msg:send(Account, ?msg_add_item, [ItemName, Count])
	     end || {ItemID, Count} <- AddItem],
	    Packet = #notify_del_sprite{id=Sprite#sprite_data.id, del=1},
	    net_helper:send2client(Account, Packet),
	    case IsUpgrade of
		true -> 
		    Packet1 = #notify_sprite_upgrade{id=Sprite#sprite_data.id, 
						    level=Sprite#sprite_data.level},
		    net_helper:send2client(Account, Packet1);
		false -> ok
	    end;
		
	{false, Sprite, MsgID} ->
	    sys_msg:send(Account, MsgID),
	    Packet = #notify_del_sprite{id=Sprite#sprite_data.id, del=0},
	    net_helper:send2client(Account, Packet)
    end.

get_player_sprite_data(Account) ->
    Now = datetime:localtime(),
    case db:dirty_read(player_sprite, Account) of
	[] ->
	    Data = tplt:get_all_data(normal_sprite_tplt),
	    Sprites = [#sprite_data{id=ID, level=1, finish_time=datetime:make_time(1970,1,1,0,0,0)}
		       || #normal_sprite_tplt{id=ID} <- Data],
	    Sprites1 = #player_sprite{account=Account,sprites=Sprites,appraise=0,time=Now},
	    db:dirty_write(Sprites1),
	    Sprites1;
	[Sprites] ->
	    T = Sprites#player_sprite.time,
	    case datetime:diff_date(T, Now) >= 3600 of
		true -> 
		    Sprites1 = Sprites#player_sprite{time=Now, appraise=0},
		    db:dirty_write(Sprites1),
		    Sprites1;
		false -> Sprites
	    end
    end.

get_sprite(SpriteID, Sprites) ->
    case lists:keyfind(SpriteID, #sprite_data.id, Sprites) of
	S when is_tuple(S) ->
	    S
    end.

send_data(Account, PlayerSprites) ->
    Sprites1 = [#sprite{id=S#sprite_data.id,
			curr_exp = S#sprite_data.show_count,
			level = S#sprite_data.level,
			remain_time=erlang:max(0, datetime:diff_time(datetime:localtime(), S#sprite_data.finish_time))}
		 || S <- PlayerSprites#player_sprite.sprites],
    Packet = #notify_sprite_data{sprites=Sprites1, appraise=PlayerSprites#player_sprite.appraise},
    net_helper:send2client(Account, Packet).

set_sprite_dispear(Sprite, Sprites) ->
    Sprite1 = Sprite#sprite_data{finish_time=datetime:localtime()},
    lists:keyreplace(Sprite#sprite_data.id, #sprite_data.id, Sprites, Sprite1).

get_awards(SpriteID, Level) ->
    Data = tplt:get_all_data(sprite_upgrade_tplt),
    [Awards] = [begin
		    Items = util:eval(binary_to_list(S#sprite_upgrade_tplt.award_item) ++ "."),
		    AwardItem = get_award_item(Items),
		    {S#sprite_upgrade_tplt.award_money, 
		     S#sprite_upgrade_tplt.award_exp, 
		     [AwardItem]}
		end
		|| S <- Data, S#sprite_upgrade_tplt.id == SpriteID, S#sprite_upgrade_tplt.level==Level],
    Awards.

get_award_item(Items) ->
    Total = lists:sum([R || {_, _, _, R} <- Items]),
    case Total == 0 of
	true -> [];
	false ->
	    Rand = random:uniform(Total),
	    get_award_item_impl(Items, Rand)
    end.

get_award_item_impl([{Item, Min, Max, Ratio} | _ItemRest], Rest) when Rest - Ratio =< 0 -> 
    {Item, rand:uniform(Min, Max)};
get_award_item_impl([{_Item, _Min, _Max, Ratio} | ItemRest], Rest) -> 
    get_award_item_impl(ItemRest, Rest - Ratio).

upgrade_sprite(#sprite_data{id=ID, show_count=ShowCount, level=Level} = Sprite, AddShowCount) ->
    All = tplt:get_all_data(sprite_upgrade_tplt),

    Data = get_upgrade_data(ID, Level, All),
    case Data of 
	[] -> Sprite;
	[T] ->
	    Rest = ShowCount + AddShowCount - T#sprite_upgrade_tplt.show_count,
	    case Rest > 0 of
		true ->
		    Lvl = Level+1,
		    case get_upgrade_data(ID, Lvl, All) of
			[_] -> Sprite#sprite_data{show_count=Rest, level=Lvl};
			[] -> Sprite
		    end;
		false ->
		    Sprite#sprite_data{show_count=ShowCount+AddShowCount}
	    end
    end.

get_upgrade_data(ID, Level, AllTplt) ->
    [Tplt || Tplt <- AllTplt, 
		      Tplt#sprite_upgrade_tplt.id == ID, Level == Tplt#sprite_upgrade_tplt.level].
    
show_sprite(Account, #player_sprite{appraise=Appraise, sprites=Sprites}=PlayerSprites) ->
    Now = datetime:localtime(),
    #stime{year=Year, month=Month, day=Day} = Now,
    FinishTime = datetime:make_time(Year, Month, Day, 23, 59, 59),
    Sprites1 = [begin 
		    Tplt = tplt:get_data2(normal_sprite_tplt, ID),
		    case (Appraise >= Tplt#normal_sprite_tplt.appraise) and
			(datetime:diff_date(Now, S#sprite_data.finish_time) /= 0) of
			true -> %% 该ID的小精灵出现
			    case ID >=4 of
				true -> 
				    give_buff(Account, ?hb_increase_appraise, Now);
				false -> ok
			    end,
			    S#sprite_data{finish_time=FinishTime};
			false -> S
		    end
		end || #sprite_data{id=ID}=S <- Sprites],
    PlayerSprites#player_sprite{sprites=Sprites1}.


give_buff(Account, BuffID, Now) ->
    #stime{year=Year, month=Month, day=Day} = Now,
    FinishTime = datetime:make_time(Year, Month, Day, 23, 59, 59), %% 第二天凌晨0点
    BuffTime = datetime:diff_time(Now, FinishTime),
    player_buff:add_buff(Account, BuffID, BuffTime).
   
