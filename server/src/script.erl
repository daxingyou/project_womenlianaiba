%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2012, linyibin
%%% @doc
%%% ���߻��õĽű�
%%% @end
%%% Created : 11 Jul 2012 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(script).

-include("player_task.hrl").
%% API
-compile(export_all).

%%%===================================================================
%%% API
%%%===================================================================
%% �����ͽ���
open_post_reward_ui(Account) ->
    post_reward_task:open_post_reward_ui(Account).

%% ���ܻ�����
give_ring_task(Account) ->
    ring_task:give(Account).

complete_ring_task(Account) ->
    ring_task:complete(Account).

%%Type: ѡ���Ƿ�ˮ�����߾���
reward_ring_task(Account, Type) ->
    ring_task:reward(Account, Type).

%% ���ܻ�����
give_ring_task(Account, Type) ->
    ring_task:give(Account, Type).

get_ring_task_npc_options(Account) ->
    ring_task:get_npc_options(Account).

get_ring_task_npc_content(Account) ->
    ring_task:get_npc_content(Account).

get_ring_task_npc_id(Account) ->
    ring_task:get_npc_id(Account).

get_ring_task_type(Account) ->
    ring_task:get_task_type(Account).

has_ring_task(Account) ->
    ring_task:has_task(Account).

has_complete_ring_task(Account) ->
    ring_task:has_complete(Account).

%% �Ƿ�������ڽӸ�����
%% ����ֵ: true����false
is_task_give(Account, Id) when is_integer(Id) and is_atom(Account) ->
    [PlayerTask] = db:dirty_read(player_task, Account),
    chain_task:is_give(Id, PlayerTask).

%% �Ƿ������ɹ�������
%% ����ֵ: true����false
is_task_complete(Account, Id) when is_integer(Id) and is_atom(Account) ->
    [PlayerTask] = db:dirty_read(player_task, Account),
    chain_task:is_complete(Id, PlayerTask).

%% �ж�����Ƿ�����
%% ����ֵ: true����false
is_boy(Account) when is_atom(Account) ->
    [PlayerBasicData] = db:dirty_read(player_basic_data, Account),
    player:is_boy(PlayerBasicData).

%% �ж�����Ƿ�Ů��
%% ����ֵ: true����false
is_girl(Account) when is_atom(Account) ->
    [PlayerBasicData] = db:dirty_read(player_basic_data, Account),
    player:is_girl(PlayerBasicData).

%% ������Ʒ
add_item(Account, TempId) ->
    player_gm:add_item(Account, TempId, 1).

%% ��ȡ����ֵ
get_hp(Account) ->
    [PlayerBasicData] = db:dirty_read(player_basic_data, Account),
    HouseId = player_basic_data:get_house_id(PlayerBasicData),
    [HouseData] = db:dirty_read(house_data, HouseId),
    player_hp:get_hp(PlayerBasicData, HouseData).

%% ������ֵ
dec_hp(Account, HP) ->
    F = fun() ->
		HouseData = house_pack:read(Account),
		[PlayerBasicData] = db:read(player_basic_data, Account),
		{ok, NPlayerBasicData}=player_hp:dec_hp(HP, PlayerBasicData, HouseData),
		player_hp:save_hp(NPlayerBasicData),
		{ok, NPlayerBasicData, HouseData}
	end,
    case db:transaction(F) of
	{ok, NPlayerBasicData, HouseData}->
	    player_hp:send(Account, NPlayerBasicData, HouseData)
    end.

%% �Ƿ�ʥ����
is_christmas_day() ->
    Now = datetime:localtime(),
    MinDay = datetime:make_time(2012, 12, 24, 0, 0, 0),
    MaxDay = datetime:make_time(2012, 12, 31, 0, 0, 0),
    (datetime:diff_time(MinDay, Now) >= 0) and (datetime:diff_time(MaxDay, Now) =< 0).
%%--------------------------------------------------------------------
%% @doc
%% @spec
%% @end
%%--------------------------------------------------------------------

%%%===================================================================
%%% Internal functions
%%%===================================================================
