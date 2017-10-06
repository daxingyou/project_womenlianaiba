-module(protocal).
-include("packet_def.hrl").
-include("net_type.hrl").
-export([encode/1, decode/2]).


encode(#req_login{version=VERSION, login_type=LOGIN_TYPE, account=ACCOUNT, password=PASSWORD, pf_key=PF_KEY, iopenid=IOPENID, srvid=SRVID, ch=CH}) ->
	{?msg_req_login, <<VERSION:?INT, (net_helper:encode_string(LOGIN_TYPE))/binary, (net_helper:encode_string(ACCOUNT))/binary, (net_helper:encode_string(PASSWORD))/binary, (net_helper:encode_string(PF_KEY))/binary, (net_helper:encode_string(IOPENID))/binary, SRVID:?INT, CH:?INT>>};
encode(#notify_login_result{result=RESULT, nick_name=NICK_NAME, sex=SEX}) ->
	{?msg_notify_login_result, <<RESULT:?INT, (net_helper:encode_string(NICK_NAME))/binary, SEX:?INT>>};
encode(#stime{year=YEAR, month=MONTH, day=DAY, hour=HOUR, minute=MINUTE, second=SECOND}) ->
	{?msg_stime, <<YEAR:?INT, MONTH:?INT, DAY:?INT, HOUR:?INT, MINUTE:?INT, SECOND:?INT>>};
encode(#point{x=X, y=Y, z=Z}) ->
	{?msg_point, <<X:?FLOAT, Y:?FLOAT, Z:?FLOAT>>};
encode(#grid_pos{x=X, y=Y, z=Z}) ->
	{?msg_grid_pos, <<X:?INT, Y:?INT, Z:?INT>>};
encode(#item_property{key=KEY, value=VALUE}) ->
	{?msg_item_property, <<(net_helper:encode_string(KEY))/binary, VALUE:?INT>>};
encode(#item{instance_id=INSTANCE_ID, template_id=TEMPLATE_ID, del_time=DEL_TIME, property=PROPERTY}) ->
	{?msg_item, <<INSTANCE_ID:?UINT64, TEMPLATE_ID:?INT, (net_helper:get_encode_binary_data(encode(DEL_TIME)))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, PROPERTY))/binary>>};
encode(#visit_log{account=ACCOUNT, openid=OPENID, visit_time=VISIT_TIME}) ->
	{?msg_visit_log, <<(net_helper:encode_string(ACCOUNT))/binary, (net_helper:encode_string(OPENID))/binary, (net_helper:get_encode_binary_data(encode(VISIT_TIME)))/binary>>};
encode(#guest_book{id=ID, account=ACCOUNT, content=CONTENT, opened=OPENED, create_time=CREATE_TIME}) ->
	{?msg_guest_book, <<ID:?UINT64, (net_helper:encode_string(ACCOUNT))/binary, (net_helper:encode_string(CONTENT))/binary, OPENED:?INT, (net_helper:get_encode_binary_data(encode(CREATE_TIME)))/binary>>};
encode(#pack_grid{count=COUNT, lock=LOCK, item_data=ITEM_DATA}) ->
	{?msg_pack_grid, <<COUNT:?INT, LOCK:?INT, (net_helper:get_encode_binary_data(encode(ITEM_DATA)))/binary>>};
encode(#polymorph{id=ID, duration=DURATION, start_at=START_AT}) ->
	{?msg_polymorph, <<ID:?INT, DURATION:?INT, (net_helper:get_encode_binary_data(encode(START_AT)))/binary>>};
encode(#player_basic_data{account=ACCOUNT, username=USERNAME, sex=SEX, skin_color=SKIN_COLOR, hair=HAIR, face=FACE, beard=BEARD, online_time=ONLINE_TIME, hair_color=HAIR_COLOR, last_login_time=LAST_LOGIN_TIME, house_id=HOUSE_ID, mateup_status=MATEUP_STATUS, hp=HP, body=BODY, hp_update_time=HP_UPDATE_TIME, create_time=CREATE_TIME, first_photo_player=FIRST_PHOTO_PLAYER, animal_type=ANIMAL_TYPE, birthday=BIRTHDAY, star=STAR, height=HEIGHT, salary=SALARY, blood_type=BLOOD_TYPE, education=EDUCATION, contact=CONTACT, interest=INTEREST, signature=SIGNATURE, city=CITY, province=PROVINCE, career=CAREER, weight=WEIGHT, alter_body=ALTER_BODY, charm=CHARM, produce_experience=PRODUCE_EXPERIENCE, produce_level=PRODUCE_LEVEL}) ->
	{?msg_player_basic_data, <<(net_helper:encode_string(ACCOUNT))/binary, (net_helper:encode_string(USERNAME))/binary, SEX:?INT, SKIN_COLOR:?INT, HAIR:?INT, FACE:?INT, BEARD:?INT, ONLINE_TIME:?FLOAT, HAIR_COLOR:?INT, (net_helper:get_encode_binary_data(encode(LAST_LOGIN_TIME)))/binary, HOUSE_ID:?UINT64, MATEUP_STATUS:?INT, HP:?INT, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, BODY))/binary, (net_helper:get_encode_binary_data(encode(HP_UPDATE_TIME)))/binary, (net_helper:get_encode_binary_data(encode(CREATE_TIME)))/binary, (net_helper:encode_string(FIRST_PHOTO_PLAYER))/binary, ANIMAL_TYPE:?INT, (net_helper:get_encode_binary_data(encode(BIRTHDAY)))/binary, STAR:?INT, HEIGHT:?INT, SALARY:?INT, BLOOD_TYPE:?INT, EDUCATION:?INT, (net_helper:encode_string(CONTACT))/binary, (net_helper:encode_string(INTEREST))/binary, (net_helper:encode_string(SIGNATURE))/binary, CITY:?INT, PROVINCE:?INT, (net_helper:encode_string(CAREER))/binary, WEIGHT:?INT, (net_helper:get_encode_binary_data(encode(ALTER_BODY)))/binary, CHARM:?INT, PRODUCE_EXPERIENCE:?INT, PRODUCE_LEVEL:?INT>>};
encode(#player_info{basic_data=BASIC_DATA, scenename=SCENENAME}) ->
	{?msg_player_info, <<(net_helper:get_encode_binary_data(encode(BASIC_DATA)))/binary, (net_helper:encode_string(SCENENAME))/binary>>};
encode(#npc_info{npc_id=NPC_ID, body=BODY, head=HEAD, hair=HAIR, equip1=EQUIP1, equip2=EQUIP2, skeleton=SKELETON, npc_name=NPC_NAME}) ->
	{?msg_npc_info, <<NPC_ID:?INT, BODY:?INT, HEAD:?INT, HAIR:?INT, EQUIP1:?INT, EQUIP2:?INT, SKELETON:?INT, (net_helper:encode_string(NPC_NAME))/binary>>};
encode(#npc_map_mapping_info{id=ID, npc_id=NPC_ID, npc_name=NPC_NAME, pos=POS, script_id=SCRIPT_ID, action=ACTION, npc_key=NPC_KEY, towards=TOWARDS}) ->
	{?msg_npc_map_mapping_info, <<ID:?INT, NPC_ID:?INT, (net_helper:encode_string(NPC_NAME))/binary, (net_helper:get_encode_binary_data(encode(POS)))/binary, SCRIPT_ID:?INT, ACTION:?INT, (net_helper:encode_string(NPC_KEY))/binary, TOWARDS:?INT>>};
encode(#furniture_position{position_index=POSITION_INDEX, is_used=IS_USED, used_account=USED_ACCOUNT, status=STATUS, func_id=FUNC_ID, use_time=USE_TIME}) ->
	{?msg_furniture_position, <<POSITION_INDEX:?INT, IS_USED:?INT, (net_helper:encode_string(USED_ACCOUNT))/binary, STATUS:?INT, FUNC_ID:?INT, (net_helper:get_encode_binary_data(encode(USE_TIME)))/binary>>};
encode(#furniture_goods_data{goods_id=GOODS_ID, x=X, z=Z, height=HEIGHT, floor=FLOOR, face=FACE}) ->
	{?msg_furniture_goods_data, <<GOODS_ID:?INT, X:?INT, Z:?INT, HEIGHT:?FLOAT, FLOOR:?INT, FACE:?INT>>};
encode(#setting_info{name=NAME, value=VALUE}) ->
	{?msg_setting_info, <<(net_helper:encode_string(NAME))/binary, VALUE:?INT>>};
encode(#player_setting{account=ACCOUNT, info=INFO}) ->
	{?msg_player_setting, <<(net_helper:encode_string(ACCOUNT))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, INFO))/binary>>};
encode(#house_furniture{instance_id=INSTANCE_ID, template_id=TEMPLATE_ID, x=X, z=Z, height=HEIGHT, floor=FLOOR, face=FACE, item_tempid=ITEM_TEMPID, status=STATUS, del_time=DEL_TIME, property=PROPERTY}) ->
	{?msg_house_furniture, <<INSTANCE_ID:?UINT64, TEMPLATE_ID:?INT, X:?INT, Z:?INT, HEIGHT:?FLOAT, FLOOR:?INT, FACE:?INT, ITEM_TEMPID:?INT, STATUS:?INT, (net_helper:get_encode_binary_data(encode(DEL_TIME)))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, PROPERTY))/binary>>};
encode(#room_tex{room_id=ROOM_ID, type=TYPE, tex=TEX, floor_id=FLOOR_ID}) ->
	{?msg_room_tex, <<ROOM_ID:?INT, TYPE:?INT, (net_helper:encode_string(TEX))/binary, FLOOR_ID:?INT>>};
encode(#house_info{house_id=HOUSE_ID, template_id=TEMPLATE_ID, furniture_permission=FURNITURE_PERMISSION, furniture_vec=FURNITURE_VEC, room_tex_vec=ROOM_TEX_VEC, welcome_words=WELCOME_WORDS, house_permission=HOUSE_PERMISSION, visit_logs=VISIT_LOGS, buy_date=BUY_DATE, level=LEVEL, house_clean=HOUSE_CLEAN, boy=BOY, girl=GIRL, name=NAME, mateup_status=MATEUP_STATUS, decoration=DECORATION}) ->
	{?msg_house_info, <<HOUSE_ID:?UINT64, TEMPLATE_ID:?INT, FURNITURE_PERMISSION:?INT, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, FURNITURE_VEC))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, ROOM_TEX_VEC))/binary, (net_helper:encode_string(WELCOME_WORDS))/binary, HOUSE_PERMISSION:?INT, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, VISIT_LOGS))/binary, (net_helper:get_encode_binary_data(encode(BUY_DATE)))/binary, LEVEL:?INT, HOUSE_CLEAN:?INT, (net_helper:encode_string(BOY))/binary, (net_helper:encode_string(GIRL))/binary, (net_helper:encode_string(NAME))/binary, MATEUP_STATUS:?INT, DECORATION:?INT>>};
encode(#notify_repeat_login{account=ACCOUNT}) ->
	{?msg_notify_repeat_login, <<(net_helper:encode_string(ACCOUNT))/binary>>};
encode(#req_create_role{basic_data=BASIC_DATA, equips=EQUIPS, iopenid=IOPENID}) ->
	{?msg_req_create_role, <<(net_helper:get_encode_binary_data(encode(BASIC_DATA)))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, EQUIPS))/binary, (net_helper:encode_string(IOPENID))/binary>>};
encode(#notify_create_role_result{result=RESULT}) ->
	{?msg_notify_create_role_result, <<RESULT:?INT>>};
encode(#req_enter_game{}) ->
	{?msg_req_enter_game, null};
encode(#notify_enter_game{}) ->
	{?msg_notify_enter_game, null};
encode(#notify_body_data{grid_vec=GRID_VEC}) ->
	{?msg_notify_body_data, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, GRID_VEC))/binary>>};
encode(#client_ready_for_pop_msg{}) ->
	{?msg_client_ready_for_pop_msg, null};
encode(#pair_int{key=KEY, value=VALUE}) ->
	{?msg_pair_int, <<KEY:?INT, VALUE:?INT>>};
encode(#req_enter_player_house{type=TYPE, account=ACCOUNT}) ->
	{?msg_req_enter_player_house, <<TYPE:?INT, (net_helper:encode_string(ACCOUNT))/binary>>};
encode(#notify_enter_player_house{house_tplt_id=HOUSE_TPLT_ID, data=DATA, enter_pos=ENTER_POS}) ->
	{?msg_notify_enter_player_house, <<HOUSE_TPLT_ID:?INT, (net_helper:get_encode_binary_data(encode(DATA)))/binary, (net_helper:get_encode_binary_data(encode(ENTER_POS)))/binary>>};
encode(#req_scene_copy_list{template_id=TEMPLATE_ID}) ->
	{?msg_req_scene_copy_list, <<TEMPLATE_ID:?INT>>};
encode(#notify_scene_copy_list{template_id=TEMPLATE_ID, state_list=STATE_LIST}) ->
	{?msg_notify_scene_copy_list, <<TEMPLATE_ID:?INT, (net_helper:encode_list(fun(E)-> <<E:?INT>>end, STATE_LIST))/binary>>};
encode(#req_enter_common_scene{template_id=TEMPLATE_ID, copy_id=COPY_ID}) ->
	{?msg_req_enter_common_scene, <<TEMPLATE_ID:?INT, COPY_ID:?INT>>};
encode(#notify_enter_common_scene{template_id=TEMPLATE_ID, copy_id=COPY_ID, enter_pos=ENTER_POS}) ->
	{?msg_notify_enter_common_scene, <<TEMPLATE_ID:?INT, COPY_ID:?INT, (net_helper:get_encode_binary_data(encode(ENTER_POS)))/binary>>};
encode(#req_kick_guest{target_player=TARGET_PLAYER}) ->
	{?msg_req_kick_guest, <<(net_helper:encode_string(TARGET_PLAYER))/binary>>};
encode(#notify_other_player_data{player=PLAYER, curr_pos=CURR_POS, dest_pos=DEST_POS, type=TYPE}) ->
	{?msg_notify_other_player_data, <<(net_helper:get_encode_binary_data(encode(PLAYER)))/binary, (net_helper:get_encode_binary_data(encode(CURR_POS)))/binary, (net_helper:get_encode_binary_data(encode(DEST_POS)))/binary, TYPE:?INT>>};
encode(#notify_other_player_info{player=PLAYER}) ->
	{?msg_notify_other_player_info, <<(net_helper:get_encode_binary_data(encode(PLAYER)))/binary>>};
encode(#req_other_player_info{account=ACCOUNT}) ->
	{?msg_req_other_player_info, <<(net_helper:encode_string(ACCOUNT))/binary>>};
encode(#notify_player_leave_scene{account=ACCOUNT}) ->
	{?msg_notify_player_leave_scene, <<(net_helper:encode_string(ACCOUNT))/binary>>};
encode(#req_logout{}) ->
	{?msg_req_logout, null};
encode(#notify_player_data{basic_data=BASIC_DATA}) ->
	{?msg_notify_player_data, <<(net_helper:get_encode_binary_data(encode(BASIC_DATA)))/binary>>};
encode(#req_start_walk{curr_pos=CURR_POS, dest_pos=DEST_POS}) ->
	{?msg_req_start_walk, <<(net_helper:get_encode_binary_data(encode(CURR_POS)))/binary, (net_helper:get_encode_binary_data(encode(DEST_POS)))/binary>>};
encode(#notify_start_walk{account=ACCOUNT, curr_pos=CURR_POS, dest_pos=DEST_POS}) ->
	{?msg_notify_start_walk, <<(net_helper:encode_string(ACCOUNT))/binary, (net_helper:get_encode_binary_data(encode(CURR_POS)))/binary, (net_helper:get_encode_binary_data(encode(DEST_POS)))/binary>>};
encode(#req_stop_walk{pos=POS}) ->
	{?msg_req_stop_walk, <<(net_helper:get_encode_binary_data(encode(POS)))/binary>>};
encode(#notify_stop_walk{account=ACCOUNT, pos=POS}) ->
	{?msg_notify_stop_walk, <<(net_helper:encode_string(ACCOUNT))/binary, (net_helper:get_encode_binary_data(encode(POS)))/binary>>};
encode(#req_sync_walk_type{type=TYPE}) ->
	{?msg_req_sync_walk_type, <<TYPE:?INT>>};
encode(#notify_sync_walk_type{account=ACCOUNT, type=TYPE}) ->
	{?msg_notify_sync_walk_type, <<(net_helper:encode_string(ACCOUNT))/binary, TYPE:?INT>>};
encode(#req_sync_position{pos=POS}) ->
	{?msg_req_sync_position, <<(net_helper:get_encode_binary_data(encode(POS)))/binary>>};
encode(#req_walk_for_use_furniture{curr_pos=CURR_POS, dest_pos=DEST_POS, instance_id=INSTANCE_ID, function_id=FUNCTION_ID, furni_temp_id=FURNI_TEMP_ID, status=STATUS}) ->
	{?msg_req_walk_for_use_furniture, <<(net_helper:get_encode_binary_data(encode(CURR_POS)))/binary, (net_helper:get_encode_binary_data(encode(DEST_POS)))/binary, INSTANCE_ID:?UINT64, FUNCTION_ID:?INT, FURNI_TEMP_ID:?INT, STATUS:?INT>>};
encode(#player_basic_information{account=ACCOUNT, imageurl=IMAGEURL, nickname=NICKNAME, is_yellow_vip=IS_YELLOW_VIP, is_yellow_year_vip=IS_YELLOW_YEAR_VIP, yellow_vip_level=YELLOW_VIP_LEVEL}) ->
	{?msg_player_basic_information, <<(net_helper:encode_string(ACCOUNT))/binary, (net_helper:encode_string(IMAGEURL))/binary, (net_helper:encode_string(NICKNAME))/binary, IS_YELLOW_VIP:?INT, IS_YELLOW_YEAR_VIP:?INT, YELLOW_VIP_LEVEL:?INT>>};
encode(#friend_item{account=ACCOUNT, house_id=HOUSE_ID, house_level=HOUSE_LEVEL, intimate=INTIMATE, crop_event=CROP_EVENT}) ->
	{?msg_friend_item, <<(net_helper:encode_string(ACCOUNT))/binary, HOUSE_ID:?UINT64, HOUSE_LEVEL:?INT, INTIMATE:?INT, CROP_EVENT:?INT>>};
encode(#req_friend_list{}) ->
	{?msg_req_friend_list, null};
encode(#notify_player_friend_list{friend_list=FRIEND_LIST}) ->
	{?msg_notify_player_friend_list, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, FRIEND_LIST))/binary>>};
encode(#req_invite_list{}) ->
	{?msg_req_invite_list, null};
encode(#notify_invite_list{friend_list=FRIEND_LIST}) ->
	{?msg_notify_invite_list, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, FRIEND_LIST))/binary>>};
encode(#req_chat_around{content=CONTENT}) ->
	{?msg_req_chat_around, <<(net_helper:encode_string(CONTENT))/binary>>};
encode(#notify_chat_around{account=ACCOUNT, player_name=PLAYER_NAME, content=CONTENT}) ->
	{?msg_notify_chat_around, <<(net_helper:encode_string(ACCOUNT))/binary, (net_helper:encode_string(PLAYER_NAME))/binary, (net_helper:encode_string(CONTENT))/binary>>};
encode(#req_chat_tell{target_player=TARGET_PLAYER, content=CONTENT}) ->
	{?msg_req_chat_tell, <<(net_helper:encode_string(TARGET_PLAYER))/binary, (net_helper:encode_string(CONTENT))/binary>>};
encode(#notify_chat_tell{speaker=SPEAKER, speaker_name=SPEAKER_NAME, content=CONTENT}) ->
	{?msg_notify_chat_tell, <<(net_helper:encode_string(SPEAKER))/binary, (net_helper:encode_string(SPEAKER_NAME))/binary, (net_helper:encode_string(CONTENT))/binary>>};
encode(#req_chat_world{content=CONTENT}) ->
	{?msg_req_chat_world, <<(net_helper:encode_string(CONTENT))/binary>>};
encode(#notify_chat_world{account=ACCOUNT, player_name=PLAYER_NAME, content=CONTENT}) ->
	{?msg_notify_chat_world, <<(net_helper:encode_string(ACCOUNT))/binary, (net_helper:encode_string(PLAYER_NAME))/binary, (net_helper:encode_string(CONTENT))/binary>>};
encode(#notify_house_data{data=DATA}) ->
	{?msg_notify_house_data, <<(net_helper:get_encode_binary_data(encode(DATA)))/binary>>};
encode(#furniture_place_info{instance_id=INSTANCE_ID, x=X, z=Z, height=HEIGHT, floor=FLOOR, face=FACE}) ->
	{?msg_furniture_place_info, <<INSTANCE_ID:?UINT64, X:?INT, Z:?INT, HEIGHT:?FLOAT, FLOOR:?INT, FACE:?INT>>};
encode(#req_change_furnitures{recovery_furnitures=RECOVERY_FURNITURES, placed_furnitures=PLACED_FURNITURES, move_furnitures=MOVE_FURNITURES, buy_goods_list=BUY_GOODS_LIST}) ->
	{?msg_req_change_furnitures, <<(net_helper:encode_list(fun(E)-> <<E:?UINT64>>end, RECOVERY_FURNITURES))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, PLACED_FURNITURES))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, MOVE_FURNITURES))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, BUY_GOODS_LIST))/binary>>};
encode(#notify_change_furnitures_fail{error_code=ERROR_CODE, unfind_bag_items=UNFIND_BAG_ITEMS}) ->
	{?msg_notify_change_furnitures_fail, <<ERROR_CODE:?INT, (net_helper:encode_list(fun(E)-> <<E:?UINT64>>end, UNFIND_BAG_ITEMS))/binary>>};
encode(#notify_change_furnitures{del_furnitures=DEL_FURNITURES, add_furnitures=ADD_FURNITURES, move_furnitures=MOVE_FURNITURES, add_items=ADD_ITEMS, del_items=DEL_ITEMS, decoration=DECORATION}) ->
	{?msg_notify_change_furnitures, <<(net_helper:encode_list(fun(E)-> <<E:?UINT64>>end, DEL_FURNITURES))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, ADD_FURNITURES))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, MOVE_FURNITURES))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, ADD_ITEMS))/binary, (net_helper:encode_list(fun(E)-> <<E:?UINT64>>end, DEL_ITEMS))/binary, DECORATION:?INT>>};
encode(#req_start_edit_house{}) ->
	{?msg_req_start_edit_house, null};
encode(#notify_start_edit_house{result=RESULT}) ->
	{?msg_notify_start_edit_house, <<RESULT:?INT>>};
encode(#req_end_edit_house{}) ->
	{?msg_req_end_edit_house, null};
encode(#notify_end_edit_house{}) ->
	{?msg_notify_end_edit_house, null};
encode(#req_set_house_welcome_words{words=WORDS}) ->
	{?msg_req_set_house_welcome_words, <<(net_helper:encode_string(WORDS))/binary>>};
encode(#notify_set_house_welcome_words{result=RESULT}) ->
	{?msg_notify_set_house_welcome_words, <<RESULT:?INT>>};
encode(#req_set_house_permission{house_permission=HOUSE_PERMISSION, furniture_permission=FURNITURE_PERMISSION}) ->
	{?msg_req_set_house_permission, <<HOUSE_PERMISSION:?INT, FURNITURE_PERMISSION:?INT>>};
encode(#notify_set_house_permission{result=RESULT}) ->
	{?msg_notify_set_house_permission, <<RESULT:?INT>>};
encode(#req_clear_house_log{}) ->
	{?msg_req_clear_house_log, null};
encode(#notify_clear_house_log{result=RESULT}) ->
	{?msg_notify_clear_house_log, <<RESULT:?INT>>};
encode(#notify_start_use_furniture{account=ACCOUNT, position_index=POSITION_INDEX, instance_id=INSTANCE_ID, function_id=FUNCTION_ID, walk_pos=WALK_POS}) ->
	{?msg_notify_start_use_furniture, <<(net_helper:encode_string(ACCOUNT))/binary, POSITION_INDEX:?INT, INSTANCE_ID:?UINT64, FUNCTION_ID:?INT, (net_helper:get_encode_binary_data(encode(WALK_POS)))/binary>>};
encode(#req_stop_use_furniture{}) ->
	{?msg_req_stop_use_furniture, null};
encode(#notify_stop_use_furniture{account=ACCOUNT, position_index=POSITION_INDEX, instance_id=INSTANCE_ID}) ->
	{?msg_notify_stop_use_furniture, <<(net_helper:encode_string(ACCOUNT))/binary, POSITION_INDEX:?INT, INSTANCE_ID:?UINT64>>};
encode(#notify_change_furniture_status{account=ACCOUNT, instance_id=INSTANCE_ID, function_id=FUNCTION_ID, new_status=NEW_STATUS}) ->
	{?msg_notify_change_furniture_status, <<(net_helper:encode_string(ACCOUNT))/binary, INSTANCE_ID:?UINT64, FUNCTION_ID:?INT, NEW_STATUS:?INT>>};
encode(#req_swap_item{type=TYPE, index1=INDEX1, index2=INDEX2}) ->
	{?msg_req_swap_item, <<TYPE:?INT, INDEX1:?INT, INDEX2:?INT>>};
encode(#req_use_item{item_inst_id=ITEM_INST_ID, target_list=TARGET_LIST}) ->
	{?msg_req_use_item, <<ITEM_INST_ID:?UINT64, (net_helper:encode_list(fun(E)-> net_helper:encode_string(E) end, TARGET_LIST))/binary>>};
encode(#notify_use_item_result{item_inst_id=ITEM_INST_ID, item_tplt_id=ITEM_TPLT_ID, result=RESULT}) ->
	{?msg_notify_use_item_result, <<ITEM_INST_ID:?UINT64, ITEM_TPLT_ID:?INT, RESULT:?INT>>};
encode(#req_move_item{pack1_type=PACK1_TYPE, index1=INDEX1, pack2_type=PACK2_TYPE, index2=INDEX2}) ->
	{?msg_req_move_item, <<PACK1_TYPE:?INT, INDEX1:?INT, PACK2_TYPE:?INT, INDEX2:?INT>>};
encode(#req_delete_item{grid_index=GRID_INDEX}) ->
	{?msg_req_delete_item, <<GRID_INDEX:?INT>>};
encode(#req_split_item{type=TYPE, src_gindex=SRC_GINDEX, target_gindex=TARGET_GINDEX, count=COUNT}) ->
	{?msg_req_split_item, <<TYPE:?INT, SRC_GINDEX:?INT, TARGET_GINDEX:?INT, COUNT:?INT>>};
encode(#req_resize_player_pack{}) ->
	{?msg_req_resize_player_pack, null};
encode(#req_extend_aging_item{item_inst_id=ITEM_INST_ID}) ->
	{?msg_req_extend_aging_item, <<ITEM_INST_ID:?UINT64>>};
encode(#notify_extend_aging_item{}) ->
	{?msg_notify_extend_aging_item, null};
encode(#notiy_use_item_by_scene{item_id=ITEM_ID, item_inst_id=ITEM_INST_ID, result=RESULT}) ->
	{?msg_notiy_use_item_by_scene, <<ITEM_ID:?INT, ITEM_INST_ID:?UINT64, RESULT:?INT>>};
encode(#notify_sys_msg{code=CODE, params=PARAMS}) ->
	{?msg_notify_sys_msg, <<CODE:?INT, (net_helper:encode_list(fun(E)-> net_helper:encode_string(E) end, PARAMS))/binary>>};
encode(#notify_sys_broadcast{id=ID, type=TYPE, content=CONTENT, play_times=PLAY_TIMES, priority=PRIORITY, show_seconds=SHOW_SECONDS, start_time=START_TIME}) ->
	{?msg_notify_sys_broadcast, <<ID:?UINT64, TYPE:?INT, (net_helper:encode_string(CONTENT))/binary, PLAY_TIMES:?INT, PRIORITY:?INT, SHOW_SECONDS:?INT, (net_helper:get_encode_binary_data(encode(START_TIME)))/binary>>};
encode(#req_fixed_broadcast{type=TYPE}) ->
	{?msg_req_fixed_broadcast, <<TYPE:?INT>>};
encode(#notify_del_broadcast{type=TYPE, id=ID}) ->
	{?msg_notify_del_broadcast, <<TYPE:?INT, ID:?UINT64>>};
encode(#notify_gm_permission{account=ACCOUNT, enable=ENABLE, money=MONEY, item=ITEM}) ->
	{?msg_notify_gm_permission, <<(net_helper:encode_string(ACCOUNT))/binary, ENABLE:?INT, MONEY:?INT, ITEM:?INT>>};
encode(#req_gm_command{command=COMMAND, params=PARAMS}) ->
	{?msg_req_gm_command, <<(net_helper:encode_string(COMMAND))/binary, (net_helper:encode_list(fun(E)-> net_helper:encode_string(E) end, PARAMS))/binary>>};
encode(#notify_npc_close_dialog{}) ->
	{?msg_notify_npc_close_dialog, null};
encode(#req_npc_command{npc_id=NPC_ID, function_name=FUNCTION_NAME}) ->
	{?msg_req_npc_command, <<NPC_ID:?INT, (net_helper:encode_string(FUNCTION_NAME))/binary>>};
encode(#button{name=NAME, function_name=FUNCTION_NAME}) ->
	{?msg_button, <<(net_helper:encode_string(NAME))/binary, (net_helper:encode_string(FUNCTION_NAME))/binary>>};
encode(#notify_npc_open_dialog{npc_id=NPC_ID, talk=TALK, button_list=BUTTON_LIST}) ->
	{?msg_notify_npc_open_dialog, <<NPC_ID:?INT, (net_helper:encode_string(TALK))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, BUTTON_LIST))/binary>>};
encode(#req_employ_waiter_data{waiter_id=WAITER_ID}) ->
	{?msg_req_employ_waiter_data, <<WAITER_ID:?UINT64>>};
encode(#req_up_waiter_data{waiter_id=WAITER_ID}) ->
	{?msg_req_up_waiter_data, <<WAITER_ID:?UINT64>>};
encode(#req_query_waiter_id{account=ACCOUNT}) ->
	{?msg_req_query_waiter_id, <<(net_helper:encode_string(ACCOUNT))/binary>>};
encode(#notify_query_waiter_id{waiter_id=WAITER_ID}) ->
	{?msg_notify_query_waiter_id, <<WAITER_ID:?UINT64>>};
encode(#waiter_info{waiter_type=WAITER_TYPE, waiter_id=WAITER_ID}) ->
	{?msg_waiter_info, <<WAITER_TYPE:?INT, WAITER_ID:?UINT64>>};
encode(#notify_employ_state{waiter_id=WAITER_ID, waiter_up=WAITER_UP}) ->
	{?msg_notify_employ_state, <<WAITER_ID:?UINT64, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, WAITER_UP))/binary>>};
encode(#req_player_basic_data{}) ->
	{?msg_req_player_basic_data, null};
encode(#notify_player_basic_data{basic_data=BASIC_DATA}) ->
	{?msg_notify_player_basic_data, <<(net_helper:get_encode_binary_data(encode(BASIC_DATA)))/binary>>};
encode(#req_start_body_action{action_status=ACTION_STATUS, action_type=ACTION_TYPE}) ->
	{?msg_req_start_body_action, <<(net_helper:encode_string(ACTION_STATUS))/binary, (net_helper:encode_string(ACTION_TYPE))/binary>>};
encode(#notify_start_body_action{account=ACCOUNT, action_status=ACTION_STATUS, action_type=ACTION_TYPE}) ->
	{?msg_notify_start_body_action, <<(net_helper:encode_string(ACCOUNT))/binary, (net_helper:encode_string(ACTION_STATUS))/binary, (net_helper:encode_string(ACTION_TYPE))/binary>>};
encode(#req_play_animation{target_account=TARGET_ACCOUNT, loop=LOOP, ani=ANI, action=ACTION}) ->
	{?msg_req_play_animation, <<(net_helper:encode_string(TARGET_ACCOUNT))/binary, LOOP:?INT, (net_helper:encode_string(ANI))/binary, (net_helper:encode_string(ACTION))/binary>>};
encode(#notify_play_animation{player_account=PLAYER_ACCOUNT, target_account=TARGET_ACCOUNT, loop=LOOP, ani=ANI, action=ACTION}) ->
	{?msg_notify_play_animation, <<(net_helper:encode_string(PLAYER_ACCOUNT))/binary, (net_helper:encode_string(TARGET_ACCOUNT))/binary, LOOP:?INT, (net_helper:encode_string(ANI))/binary, (net_helper:encode_string(ACTION))/binary>>};
encode(#req_end_body_action{}) ->
	{?msg_req_end_body_action, null};
encode(#notify_end_body_action{account=ACCOUNT}) ->
	{?msg_notify_end_body_action, <<(net_helper:encode_string(ACCOUNT))/binary>>};
encode(#req_sync_body_state{body_state=BODY_STATE}) ->
	{?msg_req_sync_body_state, <<BODY_STATE:?INT>>};
encode(#notify_other_body_state{other_account=OTHER_ACCOUNT, body_state=BODY_STATE}) ->
	{?msg_notify_other_body_state, <<(net_helper:encode_string(OTHER_ACCOUNT))/binary, BODY_STATE:?INT>>};
encode(#req_start_change_looks{}) ->
	{?msg_req_start_change_looks, null};
encode(#notify_start_change_looks{type=TYPE}) ->
	{?msg_notify_start_change_looks, <<TYPE:?INT>>};
encode(#req_cancel_change_looks{}) ->
	{?msg_req_cancel_change_looks, null};
encode(#req_end_change_looks{new_hair=NEW_HAIR, new_hair_color=NEW_HAIR_COLOR, new_face=NEW_FACE, new_skin_color=NEW_SKIN_COLOR, new_beard=NEW_BEARD}) ->
	{?msg_req_end_change_looks, <<NEW_HAIR:?INT, NEW_HAIR_COLOR:?INT, NEW_FACE:?INT, NEW_SKIN_COLOR:?INT, NEW_BEARD:?INT>>};
encode(#notify_change_looks{account=ACCOUNT, new_hair=NEW_HAIR, new_hair_color=NEW_HAIR_COLOR, new_face=NEW_FACE, new_skin_color=NEW_SKIN_COLOR, new_beard=NEW_BEARD}) ->
	{?msg_notify_change_looks, <<(net_helper:encode_string(ACCOUNT))/binary, NEW_HAIR:?INT, NEW_HAIR_COLOR:?INT, NEW_FACE:?INT, NEW_SKIN_COLOR:?INT, NEW_BEARD:?INT>>};
encode(#notify_end_change_looks{}) ->
	{?msg_notify_end_change_looks, null};
encode(#req_start_change_dress{}) ->
	{?msg_req_start_change_dress, null};
encode(#notify_start_change_dress{owner=OWNER, lover=LOVER}) ->
	{?msg_notify_start_change_dress, <<(net_helper:get_encode_binary_data(encode(OWNER)))/binary, (net_helper:get_encode_binary_data(encode(LOVER)))/binary>>};
encode(#req_change_dress{type=TYPE, goods_list=GOODS_LIST, lover_goods_list=LOVER_GOODS_LIST, item_list=ITEM_LIST, putoff_list=PUTOFF_LIST}) ->
	{?msg_req_change_dress, <<TYPE:?INT, (net_helper:encode_list(fun(E)-> <<E:?INT>>end, GOODS_LIST))/binary, (net_helper:encode_list(fun(E)-> <<E:?INT>>end, LOVER_GOODS_LIST))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, ITEM_LIST))/binary, (net_helper:encode_list(fun(E)-> <<E:?UINT64>>end, PUTOFF_LIST))/binary>>};
encode(#notify_change_dress{type=TYPE, item_list=ITEM_LIST, body=BODY}) ->
	{?msg_notify_change_dress, <<TYPE:?INT, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, ITEM_LIST))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, BODY))/binary>>};
encode(#notify_around_change_dress{account=ACCOUNT, body=BODY}) ->
	{?msg_notify_around_change_dress, <<(net_helper:encode_string(ACCOUNT))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, BODY))/binary>>};
encode(#req_invite_someone{target_list=TARGET_LIST, type=TYPE}) ->
	{?msg_req_invite_someone, <<(net_helper:encode_list(fun(E)-> net_helper:encode_string(E) end, TARGET_LIST))/binary, TYPE:?INT>>};
encode(#notify_invitation{invitor=INVITOR, invitor_name=INVITOR_NAME, type=TYPE}) ->
	{?msg_notify_invitation, <<(net_helper:encode_string(INVITOR))/binary, (net_helper:encode_string(INVITOR_NAME))/binary, TYPE:?INT>>};
encode(#req_agree_invitation{invitor=INVITOR, type=TYPE}) ->
	{?msg_req_agree_invitation, <<(net_helper:encode_string(INVITOR))/binary, TYPE:?INT>>};
encode(#goods_atom{goods_id=GOODS_ID, count=COUNT}) ->
	{?msg_goods_atom, <<GOODS_ID:?INT, COUNT:?INT>>};
encode(#req_buy_sys_shop_goods{goods_id=GOODS_ID, count=COUNT}) ->
	{?msg_req_buy_sys_shop_goods, <<GOODS_ID:?INT, COUNT:?INT>>};
encode(#notify_buy_sys_shop_goods{}) ->
	{?msg_notify_buy_sys_shop_goods, null};
encode(#req_mutli_buy_sys_shop_goods{goods_list=GOODS_LIST}) ->
	{?msg_req_mutli_buy_sys_shop_goods, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, GOODS_LIST))/binary>>};
encode(#flag_info{key=KEY, value=VALUE, count=COUNT}) ->
	{?msg_flag_info, <<(net_helper:encode_string(KEY))/binary, VALUE:?INT, COUNT:?INT>>};
encode(#task_info{inst_id=INST_ID, task_id=TASK_ID, type=TYPE, give_date=GIVE_DATE, complete_date=COMPLETE_DATE, reward_date=REWARD_DATE, info=INFO}) ->
	{?msg_task_info, <<INST_ID:?UINT64, TASK_ID:?INT, TYPE:?INT, (net_helper:get_encode_binary_data(encode(GIVE_DATE)))/binary, (net_helper:get_encode_binary_data(encode(COMPLETE_DATE)))/binary, (net_helper:get_encode_binary_data(encode(REWARD_DATE)))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, INFO))/binary>>};
encode(#notify_task_flag{inst_id=INST_ID, info=INFO}) ->
	{?msg_notify_task_flag, <<INST_ID:?UINT64, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, INFO))/binary>>};
encode(#notify_task_list{tasks=TASKS}) ->
	{?msg_notify_task_list, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, TASKS))/binary>>};
encode(#notify_add_task{tasks=TASKS}) ->
	{?msg_notify_add_task, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, TASKS))/binary>>};
encode(#notify_dec_task{inst_ids=INST_IDS}) ->
	{?msg_notify_dec_task, <<(net_helper:encode_list(fun(E)-> <<E:?UINT64>>end, INST_IDS))/binary>>};
encode(#notify_complete_task{info=INFO}) ->
	{?msg_notify_complete_task, <<(net_helper:get_encode_binary_data(encode(INFO)))/binary>>};
encode(#notify_reward_task{info=INFO}) ->
	{?msg_notify_reward_task, <<(net_helper:get_encode_binary_data(encode(INFO)))/binary>>};
encode(#req_get_task_reward{inst_id=INST_ID, type=TYPE}) ->
	{?msg_req_get_task_reward, <<INST_ID:?UINT64, TYPE:?INT>>};
encode(#notify_get_task_reward{inst_id=INST_ID, task_id=TASK_ID}) ->
	{?msg_notify_get_task_reward, <<INST_ID:?UINT64, TASK_ID:?INT>>};
encode(#req_change_task{inst_id=INST_ID, type=TYPE}) ->
	{?msg_req_change_task, <<INST_ID:?UINT64, TYPE:?INT>>};
encode(#notify_change_task{inst_id=INST_ID, info=INFO}) ->
	{?msg_notify_change_task, <<INST_ID:?UINT64, (net_helper:get_encode_binary_data(encode(INFO)))/binary>>};
encode(#req_immediate_complete{inst_id=INST_ID, type=TYPE}) ->
	{?msg_req_immediate_complete, <<INST_ID:?UINT64, TYPE:?INT>>};
encode(#req_move_camera{}) ->
	{?msg_req_move_camera, null};
encode(#req_move_player{}) ->
	{?msg_req_move_player, null};
encode(#req_close_windows{type=TYPE}) ->
	{?msg_req_close_windows, <<TYPE:?INT>>};
encode(#ring_task_atom{inst_id=INST_ID, ring_count=RING_COUNT, type=TYPE, content_id=CONTENT_ID, rule_id=RULE_ID, complete_date=COMPLETE_DATE, due_date=DUE_DATE, is_view=IS_VIEW, count=COUNT}) ->
	{?msg_ring_task_atom, <<INST_ID:?INT64, RING_COUNT:?INT, TYPE:?INT, CONTENT_ID:?INT, RULE_ID:?INT, (net_helper:get_encode_binary_data(encode(COMPLETE_DATE)))/binary, (net_helper:get_encode_binary_data(encode(DUE_DATE)))/binary, IS_VIEW:?INT, COUNT:?INT>>};
encode(#notify_add_ring_task{task=TASK}) ->
	{?msg_notify_add_ring_task, <<(net_helper:get_encode_binary_data(encode(TASK)))/binary>>};
encode(#notify_show_ring_task{}) ->
	{?msg_notify_show_ring_task, null};
encode(#notify_delete_ring_task{inst_id=INST_ID}) ->
	{?msg_notify_delete_ring_task, <<INST_ID:?INT64>>};
encode(#req_give_up_ring_task{inst_id=INST_ID}) ->
	{?msg_req_give_up_ring_task, <<INST_ID:?INT64>>};
encode(#req_stop_ring_task{inst_id=INST_ID}) ->
	{?msg_req_stop_ring_task, <<INST_ID:?INT64>>};
encode(#notify_stop_ring_task{inst_id=INST_ID, due_date=DUE_DATE}) ->
	{?msg_notify_stop_ring_task, <<INST_ID:?INT64, (net_helper:get_encode_binary_data(encode(DUE_DATE)))/binary>>};
encode(#req_immediate_complete_ring_task{inst_id=INST_ID}) ->
	{?msg_req_immediate_complete_ring_task, <<INST_ID:?INT64>>};
encode(#notify_complete_ring_task{inst_id=INST_ID, complete_date=COMPLETE_DATE}) ->
	{?msg_notify_complete_ring_task, <<INST_ID:?INT64, (net_helper:get_encode_binary_data(encode(COMPLETE_DATE)))/binary>>};
encode(#req_view_ring_task{inst_id=INST_ID}) ->
	{?msg_req_view_ring_task, <<INST_ID:?INT64>>};
encode(#notify_view_ring_task{count=COUNT}) ->
	{?msg_notify_view_ring_task, <<COUNT:?INT>>};
encode(#req_ring_task_target{inst_id=INST_ID}) ->
	{?msg_req_ring_task_target, <<INST_ID:?INT64>>};
encode(#notify_ring_task_target{targets=TARGETS}) ->
	{?msg_notify_ring_task_target, <<(net_helper:encode_list(fun(E)-> <<E:?INT>>end, TARGETS))/binary>>};
encode(#req_mind_quiz_count{}) ->
	{?msg_req_mind_quiz_count, null};
encode(#notify_mind_quiz_count{count=COUNT, love_coin_count=LOVE_COIN_COUNT}) ->
	{?msg_notify_mind_quiz_count, <<COUNT:?INT, LOVE_COIN_COUNT:?INT>>};
encode(#req_start_mind_quiz{}) ->
	{?msg_req_start_mind_quiz, null};
encode(#notify_start_mind_quiz{result=RESULT}) ->
	{?msg_notify_start_mind_quiz, <<RESULT:?INT>>};
encode(#req_mind_quiz_reward{level=LEVEL}) ->
	{?msg_req_mind_quiz_reward, <<LEVEL:?INT>>};
encode(#notify_mind_quiz_reward{}) ->
	{?msg_notify_mind_quiz_reward, null};
encode(#req_recharge_love_coin{id=ID}) ->
	{?msg_req_recharge_love_coin, <<ID:?INT>>};
encode(#notify_recharge_love_coin{love_coin=LOVE_COIN}) ->
	{?msg_notify_recharge_love_coin, <<LOVE_COIN:?INT>>};
encode(#notify_init_love_coin{love_coin=LOVE_COIN}) ->
	{?msg_notify_init_love_coin, <<LOVE_COIN:?INT>>};
encode(#notify_love_coin{love_coin=LOVE_COIN}) ->
	{?msg_notify_love_coin, <<LOVE_COIN:?INT>>};
encode(#notify_open_recharge_ui{}) ->
	{?msg_notify_open_recharge_ui, null};
encode(#notify_open_yy_recharge_ui{}) ->
	{?msg_notify_open_yy_recharge_ui, null};
encode(#req_open_ui{type=TYPE}) ->
	{?msg_req_open_ui, <<TYPE:?INT>>};
encode(#notify_open_ui{type=TYPE}) ->
	{?msg_notify_open_ui, <<TYPE:?INT>>};
encode(#req_sys_time{}) ->
	{?msg_req_sys_time, null};
encode(#notify_sys_time{sys_time=SYS_TIME}) ->
	{?msg_notify_sys_time, <<(net_helper:get_encode_binary_data(encode(SYS_TIME)))/binary>>};
encode(#notify_wallow_time{wallow_seconds=WALLOW_SECONDS}) ->
	{?msg_notify_wallow_time, <<WALLOW_SECONDS:?INT>>};
encode(#notify_player_health_status{status=STATUS}) ->
	{?msg_notify_player_health_status, <<STATUS:?INT>>};
encode(#notify_disease_special_event{special_event_id=SPECIAL_EVENT_ID}) ->
	{?msg_notify_disease_special_event, <<SPECIAL_EVENT_ID:?INT>>};
encode(#notify_show_picture{id=ID}) ->
	{?msg_notify_show_picture, <<ID:?INT>>};
encode(#req_is_active_game{type=TYPE}) ->
	{?msg_req_is_active_game, <<TYPE:?INT>>};
encode(#notify_active_game_result{result=RESULT}) ->
	{?msg_notify_active_game_result, <<RESULT:?INT>>};
encode(#req_create_party{house_id=HOUSE_ID, house_name=HOUSE_NAME, player_name=PLAYER_NAME, type=TYPE, title=TITLE, description=DESCRIPTION, cost_items=COST_ITEMS, food_ids=FOOD_IDS}) ->
	{?msg_req_create_party, <<HOUSE_ID:?UINT64, (net_helper:encode_string(HOUSE_NAME))/binary, (net_helper:encode_string(PLAYER_NAME))/binary, TYPE:?INT, (net_helper:encode_string(TITLE))/binary, (net_helper:encode_string(DESCRIPTION))/binary, (net_helper:encode_list(fun(E)-> <<E:?INT>>end, COST_ITEMS))/binary, (net_helper:encode_list(fun(E)-> <<E:?INT>>end, FOOD_IDS))/binary>>};
encode(#notify_create_party_result{result=RESULT}) ->
	{?msg_notify_create_party_result, <<RESULT:?INT>>};
encode(#req_edit_party{house_id=HOUSE_ID, type=TYPE, title=TITLE, description=DESCRIPTION}) ->
	{?msg_req_edit_party, <<HOUSE_ID:?UINT64, TYPE:?INT, (net_helper:encode_string(TITLE))/binary, (net_helper:encode_string(DESCRIPTION))/binary>>};
encode(#notify_edit_party_result{result=RESULT}) ->
	{?msg_notify_edit_party_result, <<RESULT:?INT>>};
encode(#req_delete_party{house_id=HOUSE_ID}) ->
	{?msg_req_delete_party, <<HOUSE_ID:?UINT64>>};
encode(#notify_delete_party_result{result=RESULT}) ->
	{?msg_notify_delete_party_result, <<RESULT:?INT>>};
encode(#notify_private_party_need_item{item_id=ITEM_ID}) ->
	{?msg_notify_private_party_need_item, <<ITEM_ID:?INT>>};
encode(#req_get_party_list{type=TYPE, page=PAGE}) ->
	{?msg_req_get_party_list, <<TYPE:?INT, PAGE:?INT>>};
encode(#party_data{house_id=HOUSE_ID, house_name=HOUSE_NAME, account=ACCOUNT, player_name=PLAYER_NAME, type=TYPE, title=TITLE, desc=DESC, create_time=CREATE_TIME, freeze_seconds=FREEZE_SECONDS, rest_time=REST_TIME, exp=EXP, cur_person=CUR_PERSON, max_person=MAX_PERSON}) ->
	{?msg_party_data, <<HOUSE_ID:?UINT64, (net_helper:encode_string(HOUSE_NAME))/binary, (net_helper:encode_string(ACCOUNT))/binary, (net_helper:encode_string(PLAYER_NAME))/binary, TYPE:?INT, (net_helper:encode_string(TITLE))/binary, (net_helper:encode_string(DESC))/binary, (net_helper:get_encode_binary_data(encode(CREATE_TIME)))/binary, FREEZE_SECONDS:?INT, REST_TIME:?INT, EXP:?INT, CUR_PERSON:?INT, MAX_PERSON:?INT>>};
encode(#notify_party_list{max_page=MAX_PAGE, partys=PARTYS, hot_partys=HOT_PARTYS}) ->
	{?msg_notify_party_list, <<MAX_PAGE:?INT, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, PARTYS))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, HOT_PARTYS))/binary>>};
encode(#req_get_my_party_info{house_id=HOUSE_ID}) ->
	{?msg_req_get_my_party_info, <<HOUSE_ID:?UINT64>>};
encode(#notify_my_party_info{data=DATA, need_money=NEED_MONEY}) ->
	{?msg_notify_my_party_info, <<(net_helper:get_encode_binary_data(encode(DATA)))/binary, NEED_MONEY:?INT>>};
encode(#notify_start_party_exp_timer{seconds=SECONDS, hide_seconds=HIDE_SECONDS, exp=EXP}) ->
	{?msg_notify_start_party_exp_timer, <<SECONDS:?INT, HIDE_SECONDS:?INT, EXP:?INT>>};
encode(#notify_stop_party_exp_timer{}) ->
	{?msg_notify_stop_party_exp_timer, null};
encode(#req_add_party_score{}) ->
	{?msg_req_add_party_score, null};
encode(#notify_party_score{score=SCORE, has_vote=HAS_VOTE, remain_times=REMAIN_TIMES}) ->
	{?msg_notify_party_score, <<SCORE:?INT, HAS_VOTE:?INT, REMAIN_TIMES:?INT>>};
encode(#notify_add_party_score{total_score=TOTAL_SCORE, add_score=ADD_SCORE, guest_account=GUEST_ACCOUNT, guest_name=GUEST_NAME, master_account=MASTER_ACCOUNT, master_name=MASTER_NAME}) ->
	{?msg_notify_add_party_score, <<TOTAL_SCORE:?INT, ADD_SCORE:?INT, (net_helper:encode_string(GUEST_ACCOUNT))/binary, (net_helper:encode_string(GUEST_NAME))/binary, (net_helper:encode_string(MASTER_ACCOUNT))/binary, (net_helper:encode_string(MASTER_NAME))/binary>>};
encode(#notify_party_gain{grade_scores=GRADE_SCORES, score=SCORE, item_id=ITEM_ID}) ->
	{?msg_notify_party_gain, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, GRADE_SCORES))/binary, SCORE:?INT, ITEM_ID:?INT>>};
encode(#notify_party_exp_buffs{buff_exps=BUFF_EXPS, lights=LIGHTS, total_add_percent=TOTAL_ADD_PERCENT}) ->
	{?msg_notify_party_exp_buffs, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, BUFF_EXPS))/binary, (net_helper:encode_list(fun(E)-> <<E:?INT>>end, LIGHTS))/binary, TOTAL_ADD_PERCENT:?INT>>};
encode(#notify_party_items{items=ITEMS}) ->
	{?msg_notify_party_items, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, ITEMS))/binary>>};
encode(#notify_update_party_items{items=ITEMS}) ->
	{?msg_notify_update_party_items, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, ITEMS))/binary>>};
encode(#notify_party_stop{}) ->
	{?msg_notify_party_stop, null};
encode(#req_party_food_eat{food_id=FOOD_ID}) ->
	{?msg_req_party_food_eat, <<FOOD_ID:?UINT64>>};
encode(#notify_party_food_eat_count{count=COUNT}) ->
	{?msg_notify_party_food_eat_count, <<COUNT:?INT>>};
encode(#notify_party_food_ids{food_ids=FOOD_IDS}) ->
	{?msg_notify_party_food_ids, <<(net_helper:encode_list(fun(E)-> <<E:?INT>>end, FOOD_IDS))/binary>>};
encode(#req_equip_off{item_inst_id=ITEM_INST_ID}) ->
	{?msg_req_equip_off, <<ITEM_INST_ID:?UINT64>>};
encode(#notify_equip_off{account=ACCOUNT, equip_pos=EQUIP_POS}) ->
	{?msg_notify_equip_off, <<(net_helper:encode_string(ACCOUNT))/binary, EQUIP_POS:?INT>>};
encode(#req_equip_on{item_inst_id=ITEM_INST_ID}) ->
	{?msg_req_equip_on, <<ITEM_INST_ID:?UINT64>>};
encode(#notify_equip_on{account=ACCOUNT, equip_pos=EQUIP_POS, item_grid=ITEM_GRID}) ->
	{?msg_notify_equip_on, <<(net_helper:encode_string(ACCOUNT))/binary, EQUIP_POS:?INT, (net_helper:get_encode_binary_data(encode(ITEM_GRID)))/binary>>};
encode(#notify_lover_package{grid_vec=GRID_VEC}) ->
	{?msg_notify_lover_package, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, GRID_VEC))/binary>>};
encode(#notify_lover_diamond{amount=AMOUNT}) ->
	{?msg_notify_lover_diamond, <<AMOUNT:?INT>>};
encode(#req_delete_lover_item{item_inst_ids=ITEM_INST_IDS}) ->
	{?msg_req_delete_lover_item, <<(net_helper:encode_list(fun(E)-> <<E:?UINT64>>end, ITEM_INST_IDS))/binary>>};
encode(#notify_add_lover_items{items=ITEMS}) ->
	{?msg_notify_add_lover_items, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, ITEMS))/binary>>};
encode(#pair_item_count{item_inst_id=ITEM_INST_ID, count=COUNT}) ->
	{?msg_pair_item_count, <<ITEM_INST_ID:?UINT64, COUNT:?INT>>};
encode(#notify_update_items_count{items=ITEMS}) ->
	{?msg_notify_update_items_count, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, ITEMS))/binary>>};
encode(#req_lock_lover_item{item_inst_id=ITEM_INST_ID}) ->
	{?msg_req_lock_lover_item, <<ITEM_INST_ID:?UINT64>>};
encode(#req_unlock_lover_item{item_inst_id=ITEM_INST_ID}) ->
	{?msg_req_unlock_lover_item, <<ITEM_INST_ID:?UINT64>>};
encode(#notify_lock_lover_item{item_inst_id=ITEM_INST_ID}) ->
	{?msg_notify_lock_lover_item, <<ITEM_INST_ID:?UINT64>>};
encode(#notify_unlock_lover_item{item_inst_id=ITEM_INST_ID}) ->
	{?msg_notify_unlock_lover_item, <<ITEM_INST_ID:?UINT64>>};
encode(#req_house_guest_book{house_id=HOUSE_ID}) ->
	{?msg_req_house_guest_book, <<HOUSE_ID:?UINT64>>};
encode(#notify_house_guest_book{account=ACCOUNT, lover_account=LOVER_ACCOUNT, guest_books=GUEST_BOOKS}) ->
	{?msg_notify_house_guest_book, <<(net_helper:encode_string(ACCOUNT))/binary, (net_helper:encode_string(LOVER_ACCOUNT))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, GUEST_BOOKS))/binary>>};
encode(#req_house_visit_log_add{guest=GUEST, openid=OPENID, account=ACCOUNT}) ->
	{?msg_req_house_visit_log_add, <<(net_helper:encode_string(GUEST))/binary, (net_helper:encode_string(OPENID))/binary, (net_helper:encode_string(ACCOUNT))/binary>>};
encode(#notify_house_visit_log_add{}) ->
	{?msg_notify_house_visit_log_add, null};
encode(#req_house_visit_log{}) ->
	{?msg_req_house_visit_log, null};
encode(#notify_house_visit_log{visit_logs=VISIT_LOGS}) ->
	{?msg_notify_house_visit_log, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, VISIT_LOGS))/binary>>};
encode(#req_guest_book_delete{account=ACCOUNT, id=ID}) ->
	{?msg_req_guest_book_delete, <<(net_helper:encode_string(ACCOUNT))/binary, ID:?UINT64>>};
encode(#notify_guest_book_delete{result=RESULT, id=ID}) ->
	{?msg_notify_guest_book_delete, <<RESULT:?INT, ID:?UINT64>>};
encode(#req_guest_book_add{owner=OWNER, guest=GUEST, content=CONTENT, opened=OPENED}) ->
	{?msg_req_guest_book_add, <<(net_helper:encode_string(OWNER))/binary, (net_helper:encode_string(GUEST))/binary, (net_helper:encode_string(CONTENT))/binary, OPENED:?INT>>};
encode(#notify_new_guest_book{}) ->
	{?msg_notify_new_guest_book, null};
encode(#notify_guest_book_add{result=RESULT, item=ITEM}) ->
	{?msg_notify_guest_book_add, <<RESULT:?INT, (net_helper:get_encode_binary_data(encode(ITEM)))/binary>>};
encode(#req_guest_book_clear{account=ACCOUNT}) ->
	{?msg_req_guest_book_clear, <<(net_helper:encode_string(ACCOUNT))/binary>>};
encode(#notify_guest_book_clear{result=RESULT}) ->
	{?msg_notify_guest_book_clear, <<RESULT:?INT>>};
encode(#req_create_flower{house_id=HOUSE_ID, flower_id=FLOWER_ID}) ->
	{?msg_req_create_flower, <<HOUSE_ID:?UINT64, FLOWER_ID:?INT>>};
encode(#req_get_flower{house_id=HOUSE_ID}) ->
	{?msg_req_get_flower, <<HOUSE_ID:?UINT64>>};
encode(#notify_flower_data{operate=OPERATE, house_id=HOUSE_ID, id=ID, level=LEVEL, grow=GROW, start_time=START_TIME, fruit_time=FRUIT_TIME}) ->
	{?msg_notify_flower_data, <<OPERATE:?INT, HOUSE_ID:?UINT64, ID:?INT, LEVEL:?INT, GROW:?INT, (net_helper:get_encode_binary_data(encode(START_TIME)))/binary, (net_helper:get_encode_binary_data(encode(FRUIT_TIME)))/binary>>};
encode(#req_can_water_flower{my_house_id=MY_HOUSE_ID, house_id=HOUSE_ID}) ->
	{?msg_req_can_water_flower, <<MY_HOUSE_ID:?UINT64, HOUSE_ID:?UINT64>>};
encode(#notify_can_water_flower{result=RESULT}) ->
	{?msg_notify_can_water_flower, <<RESULT:?INT>>};
encode(#req_water_flower{my_house_id=MY_HOUSE_ID, name=NAME, house_id=HOUSE_ID}) ->
	{?msg_req_water_flower, <<MY_HOUSE_ID:?UINT64, (net_helper:encode_string(NAME))/binary, HOUSE_ID:?UINT64>>};
encode(#req_fertilize_flower{my_house_id=MY_HOUSE_ID, name=NAME, house_id=HOUSE_ID}) ->
	{?msg_req_fertilize_flower, <<MY_HOUSE_ID:?UINT64, (net_helper:encode_string(NAME))/binary, HOUSE_ID:?UINT64>>};
encode(#req_pick_fruit{house_id=HOUSE_ID}) ->
	{?msg_req_pick_fruit, <<HOUSE_ID:?UINT64>>};
encode(#req_change_flower{house_id=HOUSE_ID, flower_id=FLOWER_ID}) ->
	{?msg_req_change_flower, <<HOUSE_ID:?UINT64, FLOWER_ID:?INT>>};
encode(#flower_log{name=NAME, op=OP, time=TIME, grow=GROW}) ->
	{?msg_flower_log, <<(net_helper:encode_string(NAME))/binary, OP:?INT, (net_helper:get_encode_binary_data(encode(TIME)))/binary, GROW:?INT>>};
encode(#req_flower_log{house_id=HOUSE_ID}) ->
	{?msg_req_flower_log, <<HOUSE_ID:?UINT64>>};
encode(#notify_flower_log{logs=LOGS}) ->
	{?msg_notify_flower_log, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, LOGS))/binary>>};
encode(#req_ask_today_water_flower{owner_house_id=OWNER_HOUSE_ID}) ->
	{?msg_req_ask_today_water_flower, <<OWNER_HOUSE_ID:?UINT64>>};
encode(#notify_today_water_flower{result=RESULT}) ->
	{?msg_notify_today_water_flower, <<RESULT:?INT>>};
encode(#check_in{id=ID, account=ACCOUNT, content=CONTENT, opened=OPENED, create_date=CREATE_DATE}) ->
	{?msg_check_in, <<(net_helper:encode_string(ID))/binary, (net_helper:encode_string(ACCOUNT))/binary, (net_helper:encode_string(CONTENT))/binary, OPENED:?INT, (net_helper:get_encode_binary_data(encode(CREATE_DATE)))/binary>>};
encode(#req_checkin_add{account=ACCOUNT, content=CONTENT, opened=OPENED}) ->
	{?msg_req_checkin_add, <<(net_helper:encode_string(ACCOUNT))/binary, (net_helper:encode_string(CONTENT))/binary, OPENED:?INT>>};
encode(#notify_checkin_add{item=ITEM}) ->
	{?msg_notify_checkin_add, <<(net_helper:get_encode_binary_data(encode(ITEM)))/binary>>};
encode(#notify_new_checkin{}) ->
	{?msg_notify_new_checkin, null};
encode(#req_last_checkins{owner=OWNER}) ->
	{?msg_req_last_checkins, <<(net_helper:encode_string(OWNER))/binary>>};
encode(#notify_last_checkins{owner=OWNER, lover=LOVER}) ->
	{?msg_notify_last_checkins, <<(net_helper:get_encode_binary_data(encode(OWNER)))/binary, (net_helper:get_encode_binary_data(encode(LOVER)))/binary>>};
encode(#req_checkin_list{owner=OWNER, start_id=START_ID, page_index=PAGE_INDEX, page_size=PAGE_SIZE}) ->
	{?msg_req_checkin_list, <<(net_helper:encode_string(OWNER))/binary, (net_helper:encode_string(START_ID))/binary, PAGE_INDEX:?INT, PAGE_SIZE:?INT>>};
encode(#notify_checkin_list{checkins=CHECKINS}) ->
	{?msg_notify_checkin_list, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, CHECKINS))/binary>>};
encode(#req_checkin_delete{account=ACCOUNT, id=ID}) ->
	{?msg_req_checkin_delete, <<(net_helper:encode_string(ACCOUNT))/binary, (net_helper:encode_string(ID))/binary>>};
encode(#notify_checkin_delete{result=RESULT, id=ID}) ->
	{?msg_notify_checkin_delete, <<RESULT:?INT, (net_helper:encode_string(ID))/binary>>};
encode(#req_modify_love_time{house_id=HOUSE_ID, love_time=LOVE_TIME}) ->
	{?msg_req_modify_love_time, <<HOUSE_ID:?UINT64, (net_helper:get_encode_binary_data(encode(LOVE_TIME)))/binary>>};
encode(#req_get_love_time{house_id=HOUSE_ID}) ->
	{?msg_req_get_love_time, <<HOUSE_ID:?UINT64>>};
encode(#notify_love_time{house_id=HOUSE_ID, love_time=LOVE_TIME}) ->
	{?msg_notify_love_time, <<HOUSE_ID:?UINT64, LOVE_TIME:?INT>>};
encode(#commemoration_day{id=ID, show_other=SHOW_OTHER, time=TIME, content=CONTENT}) ->
	{?msg_commemoration_day, <<ID:?UINT64, SHOW_OTHER:?INT, (net_helper:get_encode_binary_data(encode(TIME)))/binary, (net_helper:encode_string(CONTENT))/binary>>};
encode(#req_add_commemoration{house_id=HOUSE_ID, time=TIME, show_other=SHOW_OTHER, content=CONTENT}) ->
	{?msg_req_add_commemoration, <<HOUSE_ID:?UINT64, (net_helper:get_encode_binary_data(encode(TIME)))/binary, SHOW_OTHER:?INT, (net_helper:encode_string(CONTENT))/binary>>};
encode(#req_get_commemoration{house_id=HOUSE_ID, my_house_id=MY_HOUSE_ID, page=PAGE}) ->
	{?msg_req_get_commemoration, <<HOUSE_ID:?UINT64, MY_HOUSE_ID:?UINT64, PAGE:?INT>>};
encode(#notify_commemoration{days=DAYS, total=TOTAL}) ->
	{?msg_notify_commemoration, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, DAYS))/binary, TOTAL:?INT>>};
encode(#req_delete_commemoration{house_id=HOUSE_ID, id=ID}) ->
	{?msg_req_delete_commemoration, <<HOUSE_ID:?UINT64, ID:?UINT64>>};
encode(#req_modify_commemoration{house_id=HOUSE_ID, id=ID, show_other=SHOW_OTHER, time=TIME, content=CONTENT}) ->
	{?msg_req_modify_commemoration, <<HOUSE_ID:?UINT64, ID:?UINT64, SHOW_OTHER:?INT, (net_helper:get_encode_binary_data(encode(TIME)))/binary, (net_helper:encode_string(CONTENT))/binary>>};
encode(#req_platform_info{open_ids=OPEN_IDS, token=TOKEN}) ->
	{?msg_req_platform_info, <<(net_helper:encode_list(fun(E)-> net_helper:encode_string(E) end, OPEN_IDS))/binary, TOKEN:?INT>>};
encode(#notify_platform_info{player_informations=PLAYER_INFORMATIONS, token=TOKEN}) ->
	{?msg_notify_platform_info, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, PLAYER_INFORMATIONS))/binary, TOKEN:?INT>>};
encode(#req_daily_visit{account=ACCOUNT}) ->
	{?msg_req_daily_visit, <<(net_helper:encode_string(ACCOUNT))/binary>>};
encode(#notify_daily_visit{visit_firends=VISIT_FIRENDS}) ->
	{?msg_notify_daily_visit, <<(net_helper:encode_list(fun(E)-> <<E:?UINT64>>end, VISIT_FIRENDS))/binary>>};
encode(#req_player_guide{}) ->
	{?msg_req_player_guide, null};
encode(#notify_player_guide{flags=FLAGS}) ->
	{?msg_notify_player_guide, <<(net_helper:encode_list(fun(E)-> <<E:?INT>>end, FLAGS))/binary>>};
encode(#req_update_player_guide{flags=FLAGS}) ->
	{?msg_req_update_player_guide, <<(net_helper:encode_list(fun(E)-> <<E:?INT>>end, FLAGS))/binary>>};
encode(#notify_update_player_guide{result=RESULT}) ->
	{?msg_notify_update_player_guide, <<RESULT:?INT>>};
encode(#notify_active_holiday_gift{}) ->
	{?msg_notify_active_holiday_gift, null};
encode(#req_get_holiday_gift{}) ->
	{?msg_req_get_holiday_gift, null};
encode(#notify_get_holiday_gift_result{result=RESULT, item_id=ITEM_ID, item_count=ITEM_COUNT, diamond=DIAMOND}) ->
	{?msg_notify_get_holiday_gift_result, <<RESULT:?INT, ITEM_ID:?INT, ITEM_COUNT:?INT, DIAMOND:?INT>>};
encode(#lottery_item{item_id=ITEM_ID, item_count=ITEM_COUNT}) ->
	{?msg_lottery_item, <<ITEM_ID:?INT, ITEM_COUNT:?INT>>};
encode(#notify_use_lottery_item_result{item_inst_id=ITEM_INST_ID, items=ITEMS, hit_index=HIT_INDEX}) ->
	{?msg_notify_use_lottery_item_result, <<ITEM_INST_ID:?UINT64, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, ITEMS))/binary, HIT_INDEX:?INT>>};
encode(#notify_heartbeat{}) ->
	{?msg_notify_heartbeat, null};
encode(#notify_player_setting{setting=SETTING}) ->
	{?msg_notify_player_setting, <<(net_helper:get_encode_binary_data(encode(SETTING)))/binary>>};
encode(#req_player_setting{setting=SETTING}) ->
	{?msg_req_player_setting, <<(net_helper:get_encode_binary_data(encode(SETTING)))/binary>>};
encode(#req_update_house_name{name=NAME, account=ACCOUNT}) ->
	{?msg_req_update_house_name, <<(net_helper:encode_string(NAME))/binary, (net_helper:encode_string(ACCOUNT))/binary>>};
encode(#notify_update_house_name{result=RESULT}) ->
	{?msg_notify_update_house_name, <<RESULT:?INT>>};
encode(#req_mateup{boy_number=BOY_NUMBER, girl_number=GIRL_NUMBER}) ->
	{?msg_req_mateup, <<(net_helper:encode_string(BOY_NUMBER))/binary, (net_helper:encode_string(GIRL_NUMBER))/binary>>};
encode(#notify_mateup_list{mateup_list=MATEUP_LIST}) ->
	{?msg_notify_mateup_list, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, MATEUP_LIST))/binary>>};
encode(#notify_mateup_wait{}) ->
	{?msg_notify_mateup_wait, null};
encode(#notify_mateup_fail{message=MESSAGE}) ->
	{?msg_notify_mateup_fail, <<(net_helper:encode_string(MESSAGE))/binary>>};
encode(#req_mateup_select{match_account=MATCH_ACCOUNT}) ->
	{?msg_req_mateup_select, <<(net_helper:encode_string(MATCH_ACCOUNT))/binary>>};
encode(#notify_mateup_success{boy=BOY, girl=GIRL}) ->
	{?msg_notify_mateup_success, <<(net_helper:get_encode_binary_data(encode(BOY)))/binary, (net_helper:get_encode_binary_data(encode(GIRL)))/binary>>};
encode(#req_mateup_number{}) ->
	{?msg_req_mateup_number, null};
encode(#notify_mateup_number{boy_number=BOY_NUMBER, girl_number=GIRL_NUMBER}) ->
	{?msg_notify_mateup_number, <<(net_helper:encode_string(BOY_NUMBER))/binary, (net_helper:encode_string(GIRL_NUMBER))/binary>>};
encode(#notify_house_warming{title=TITLE, desc=DESC, summary=SUMMARY}) ->
	{?msg_notify_house_warming, <<(net_helper:encode_string(TITLE))/binary, (net_helper:encode_string(DESC))/binary, (net_helper:encode_string(SUMMARY))/binary>>};
encode(#client_device_info{operate_system=OPERATE_SYSTEM, cpu=CPU, cpu_count=CPU_COUNT, memory=MEMORY, graphics_card=GRAPHICS_CARD, graphics_card_memory=GRAPHICS_CARD_MEMORY, graphics_card_id=GRAPHICS_CARD_ID, graphics_card_verson=GRAPHICS_CARD_VERSON, graphics_card_vendor=GRAPHICS_CARD_VENDOR, graphics_card_vendor_id=GRAPHICS_CARD_VENDOR_ID, graphics_card_shader_level=GRAPHICS_CARD_SHADER_LEVEL, graphics_card_pixel_fillrate=GRAPHICS_CARD_PIXEL_FILLRATE, support_shadow=SUPPORT_SHADOW, support_render_texture=SUPPORT_RENDER_TEXTURE, support_image_effect=SUPPORT_IMAGE_EFFECT, device_name=DEVICE_NAME, device_unique_identify=DEVICE_UNIQUE_IDENTIFY, device_model=DEVICE_MODEL, browser=BROWSER}) ->
	{?msg_client_device_info, <<(net_helper:encode_string(OPERATE_SYSTEM))/binary, (net_helper:encode_string(CPU))/binary, CPU_COUNT:?INT, MEMORY:?INT, (net_helper:encode_string(GRAPHICS_CARD))/binary, GRAPHICS_CARD_MEMORY:?INT, GRAPHICS_CARD_ID:?INT, (net_helper:encode_string(GRAPHICS_CARD_VERSON))/binary, (net_helper:encode_string(GRAPHICS_CARD_VENDOR))/binary, GRAPHICS_CARD_VENDOR_ID:?INT, GRAPHICS_CARD_SHADER_LEVEL:?INT, GRAPHICS_CARD_PIXEL_FILLRATE:?INT, SUPPORT_SHADOW:?INT, SUPPORT_RENDER_TEXTURE:?INT, SUPPORT_IMAGE_EFFECT:?INT, (net_helper:encode_string(DEVICE_NAME))/binary, (net_helper:encode_string(DEVICE_UNIQUE_IDENTIFY))/binary, (net_helper:encode_string(DEVICE_MODEL))/binary, (net_helper:encode_string(BROWSER))/binary>>};
encode(#notify_level_exp{level=LEVEL, exp=EXP, max_exp=MAX_EXP}) ->
	{?msg_notify_level_exp, <<LEVEL:?INT, EXP:?INT, MAX_EXP:?INT>>};
encode(#notify_hp{hp=HP, max_hp=MAX_HP, total_seconds=TOTAL_SECONDS, restore_seconds=RESTORE_SECONDS}) ->
	{?msg_notify_hp, <<HP:?INT, MAX_HP:?INT, TOTAL_SECONDS:?INT, RESTORE_SECONDS:?INT>>};
encode(#req_start_recover_hp{}) ->
	{?msg_req_start_recover_hp, null};
encode(#notify_start_recover_hp{count=COUNT, hp=HP, love_coin=LOVE_COIN}) ->
	{?msg_notify_start_recover_hp, <<COUNT:?INT, HP:?INT, LOVE_COIN:?INT>>};
encode(#req_recover_hp{}) ->
	{?msg_req_recover_hp, null};
encode(#notify_recover_hp{}) ->
	{?msg_notify_recover_hp, null};
encode(#req_add_attention{account=ACCOUNT, name=NAME}) ->
	{?msg_req_add_attention, <<(net_helper:encode_string(ACCOUNT))/binary, (net_helper:encode_string(NAME))/binary>>};
encode(#notify_add_attention{info=INFO}) ->
	{?msg_notify_add_attention, <<(net_helper:get_encode_binary_data(encode(INFO)))/binary>>};
encode(#req_cancel_attention{account=ACCOUNT}) ->
	{?msg_req_cancel_attention, <<(net_helper:encode_string(ACCOUNT))/binary>>};
encode(#notify_cancel_attention{account=ACCOUNT}) ->
	{?msg_notify_cancel_attention, <<(net_helper:encode_string(ACCOUNT))/binary>>};
encode(#req_get_attention_list{}) ->
	{?msg_req_get_attention_list, null};
encode(#notify_attention_list{attentions=ATTENTIONS}) ->
	{?msg_notify_attention_list, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, ATTENTIONS))/binary>>};
encode(#req_opposite_sex_photos{}) ->
	{?msg_req_opposite_sex_photos, null};
encode(#notify_opposite_sex_photos{photos=PHOTOS}) ->
	{?msg_notify_opposite_sex_photos, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, PHOTOS))/binary>>};
encode(#gift_info{gift_id=GIFT_ID, receiver=RECEIVER, sender=SENDER, gift_box=GIFT_BOX, gift=GIFT, date=DATE}) ->
	{?msg_gift_info, <<GIFT_ID:?UINT64, (net_helper:encode_string(RECEIVER))/binary, (net_helper:encode_string(SENDER))/binary, GIFT_BOX:?INT, (net_helper:get_encode_binary_data(encode(GIFT)))/binary, (net_helper:get_encode_binary_data(encode(DATE)))/binary>>};
encode(#house_gift_info{gift_id=GIFT_ID, gift_box=GIFT_BOX, date=DATE}) ->
	{?msg_house_gift_info, <<GIFT_ID:?UINT64, GIFT_BOX:?INT, (net_helper:get_encode_binary_data(encode(DATE)))/binary>>};
encode(#req_send_gift{gift=GIFT}) ->
	{?msg_req_send_gift, <<(net_helper:get_encode_binary_data(encode(GIFT)))/binary>>};
encode(#notify_send_gift{type=TYPE}) ->
	{?msg_notify_send_gift, <<TYPE:?INT>>};
encode(#req_house_gift_box_list{account=ACCOUNT}) ->
	{?msg_req_house_gift_box_list, <<(net_helper:encode_string(ACCOUNT))/binary>>};
encode(#notify_house_gift_box_list{boy=BOY, girl=GIRL, boy_boxes=BOY_BOXES, girl_boxes=GIRL_BOXES}) ->
	{?msg_notify_house_gift_box_list, <<(net_helper:encode_string(BOY))/binary, (net_helper:encode_string(GIRL))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, BOY_BOXES))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, GIRL_BOXES))/binary>>};
encode(#notify_add_house_gift_box{account=ACCOUNT, boxes=BOXES}) ->
	{?msg_notify_add_house_gift_box, <<(net_helper:encode_string(ACCOUNT))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, BOXES))/binary>>};
encode(#notify_del_house_gift_box{account=ACCOUNT, boxes=BOXES}) ->
	{?msg_notify_del_house_gift_box, <<(net_helper:encode_string(ACCOUNT))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, BOXES))/binary>>};
encode(#req_receive_gift{gift_ids=GIFT_IDS}) ->
	{?msg_req_receive_gift, <<(net_helper:encode_list(fun(E)-> <<E:?UINT64>>end, GIFT_IDS))/binary>>};
encode(#notify_receive_gift{type=TYPE}) ->
	{?msg_notify_receive_gift, <<TYPE:?INT>>};
encode(#req_receive_gift_list{}) ->
	{?msg_req_receive_gift_list, null};
encode(#notify_receive_gift_list{gift=GIFT}) ->
	{?msg_notify_receive_gift_list, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, GIFT))/binary>>};
encode(#req_received_gift_list{}) ->
	{?msg_req_received_gift_list, null};
encode(#notify_received_gift_list{gift=GIFT}) ->
	{?msg_notify_received_gift_list, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, GIFT))/binary>>};
encode(#req_wish_add{goods_id=GOODS_ID, wish_type=WISH_TYPE}) ->
	{?msg_req_wish_add, <<GOODS_ID:?UINT64, WISH_TYPE:?INT>>};
encode(#player_love_wish{account=ACCOUNT, wish_id=WISH_ID, goods_id=GOODS_ID, wish_time=WISH_TIME, wish_type=WISH_TYPE}) ->
	{?msg_player_love_wish, <<(net_helper:encode_string(ACCOUNT))/binary, WISH_ID:?UINT64, GOODS_ID:?UINT64, (net_helper:get_encode_binary_data(encode(WISH_TIME)))/binary, WISH_TYPE:?INT>>};
encode(#notify_wish_add{wish=WISH}) ->
	{?msg_notify_wish_add, <<(net_helper:get_encode_binary_data(encode(WISH)))/binary>>};
encode(#notify_wish_add_fail{message=MESSAGE}) ->
	{?msg_notify_wish_add_fail, <<(net_helper:encode_string(MESSAGE))/binary>>};
encode(#req_wish_delete{account=ACCOUNT, wish_id=WISH_ID}) ->
	{?msg_req_wish_delete, <<(net_helper:encode_string(ACCOUNT))/binary, WISH_ID:?UINT64>>};
encode(#notify_wish_delete{wish_id=WISH_ID}) ->
	{?msg_notify_wish_delete, <<WISH_ID:?UINT64>>};
encode(#req_wish_list{account=ACCOUNT}) ->
	{?msg_req_wish_list, <<(net_helper:encode_string(ACCOUNT))/binary>>};
encode(#notify_wish_list{wish_list=WISH_LIST}) ->
	{?msg_notify_wish_list, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, WISH_LIST))/binary>>};
encode(#player_love_wish_history{goods_id=GOODS_ID, satisfy_account=SATISFY_ACCOUNT, wish_type=WISH_TYPE}) ->
	{?msg_player_love_wish_history, <<GOODS_ID:?UINT64, (net_helper:encode_string(SATISFY_ACCOUNT))/binary, WISH_TYPE:?INT>>};
encode(#req_wish_history_list{account=ACCOUNT}) ->
	{?msg_req_wish_history_list, <<(net_helper:encode_string(ACCOUNT))/binary>>};
encode(#notify_wish_history_list{history_list=HISTORY_LIST}) ->
	{?msg_notify_wish_history_list, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, HISTORY_LIST))/binary>>};
encode(#req_wish_satisfy{wish_id=WISH_ID}) ->
	{?msg_req_wish_satisfy, <<WISH_ID:?UINT64>>};
encode(#notify_wish_satisfy_successfully{wish_id=WISH_ID}) ->
	{?msg_notify_wish_satisfy_successfully, <<WISH_ID:?UINT64>>};
encode(#notify_wish_satisfy_fail{wish_id=WISH_ID, message=MESSAGE}) ->
	{?msg_notify_wish_satisfy_fail, <<WISH_ID:?UINT64, (net_helper:encode_string(MESSAGE))/binary>>};
encode(#req_complete_share{type=TYPE}) ->
	{?msg_req_complete_share, <<TYPE:?INT>>};
encode(#base_person_info{animal_type=ANIMAL_TYPE, birthday=BIRTHDAY, star=STAR, city=CITY, province=PROVINCE, height=HEIGHT, salary=SALARY, blood_type=BLOOD_TYPE, career=CAREER, education=EDUCATION, contact=CONTACT, interest=INTEREST, weight=WEIGHT, signature=SIGNATURE, name=NAME}) ->
	{?msg_base_person_info, <<ANIMAL_TYPE:?INT, (net_helper:get_encode_binary_data(encode(BIRTHDAY)))/binary, STAR:?INT, CITY:?INT, PROVINCE:?INT, HEIGHT:?INT, SALARY:?INT, BLOOD_TYPE:?INT, (net_helper:encode_string(CAREER))/binary, EDUCATION:?INT, (net_helper:encode_string(CONTACT))/binary, (net_helper:encode_string(INTEREST))/binary, WEIGHT:?INT, (net_helper:encode_string(SIGNATURE))/binary, (net_helper:encode_string(NAME))/binary>>};
encode(#req_change_person_info{info=INFO}) ->
	{?msg_req_change_person_info, <<(net_helper:get_encode_binary_data(encode(INFO)))/binary>>};
encode(#req_close_person_info{}) ->
	{?msg_req_close_person_info, null};
encode(#person_info{account=ACCOUNT, username=USERNAME, sex=SEX, info=INFO}) ->
	{?msg_person_info, <<(net_helper:encode_string(ACCOUNT))/binary, (net_helper:encode_string(USERNAME))/binary, SEX:?INT, (net_helper:get_encode_binary_data(encode(INFO)))/binary>>};
encode(#req_person_info{account=ACCOUNT}) ->
	{?msg_req_person_info, <<(net_helper:encode_string(ACCOUNT))/binary>>};
encode(#notify_person_info{info=INFO}) ->
	{?msg_notify_person_info, <<(net_helper:get_encode_binary_data(encode(INFO)))/binary>>};
encode(#notify_show_buy_dialog{token=TOKEN, params=PARAMS, context=CONTEXT}) ->
	{?msg_notify_show_buy_dialog, <<(net_helper:encode_string(TOKEN))/binary, (net_helper:encode_string(PARAMS))/binary, (net_helper:encode_string(CONTEXT))/binary>>};
encode(#req_cancel_qq_order{context=CONTEXT}) ->
	{?msg_req_cancel_qq_order, <<(net_helper:encode_string(CONTEXT))/binary>>};
encode(#notify_cancel_order{}) ->
	{?msg_notify_cancel_order, null};
encode(#req_vip_gift_receive_info{}) ->
	{?msg_req_vip_gift_receive_info, null};
encode(#notify_vip_gift_receive_info{beginner=BEGINNER, daily=DAILY}) ->
	{?msg_notify_vip_gift_receive_info, <<BEGINNER:?INT, DAILY:?INT>>};
encode(#vip_gift_item{item_id=ITEM_ID, count=COUNT}) ->
	{?msg_vip_gift_item, <<ITEM_ID:?INT, COUNT:?INT>>};
encode(#req_receive_vip_beginner_gift{items=ITEMS}) ->
	{?msg_req_receive_vip_beginner_gift, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, ITEMS))/binary>>};
encode(#req_receive_vip_daily_gift{items=ITEMS}) ->
	{?msg_req_receive_vip_daily_gift, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, ITEMS))/binary>>};
encode(#notify_vip_gift{status=STATUS}) ->
	{?msg_notify_vip_gift, <<STATUS:?INT>>};
encode(#login_info{login_date=LOGIN_DATE, reward_date=REWARD_DATE}) ->
	{?msg_login_info, <<(net_helper:get_encode_binary_data(encode(LOGIN_DATE)))/binary, (net_helper:get_encode_binary_data(encode(REWARD_DATE)))/binary>>};
encode(#req_give_login_reward{}) ->
	{?msg_req_give_login_reward, null};
encode(#notify_give_login_reward{}) ->
	{?msg_notify_give_login_reward, null};
encode(#req_login_list{}) ->
	{?msg_req_login_list, null};
encode(#notify_login_list{info=INFO, type=TYPE}) ->
	{?msg_notify_login_list, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, INFO))/binary, TYPE:?INT>>};
encode(#req_offline_notify{}) ->
	{?msg_req_offline_notify, null};
encode(#notify_offline_notify{count=COUNT}) ->
	{?msg_notify_offline_notify, <<COUNT:?INT>>};
encode(#req_buy_house_right{grade=GRADE}) ->
	{?msg_req_buy_house_right, <<GRADE:?INT>>};
encode(#notify_house_right_grade{grade=GRADE}) ->
	{?msg_notify_house_right_grade, <<GRADE:?INT>>};
encode(#req_unlock_special_house{id=ID}) ->
	{?msg_req_unlock_special_house, <<ID:?INT>>};
encode(#notify_unlock_special_house{id=ID}) ->
	{?msg_notify_unlock_special_house, <<ID:?INT>>};
encode(#req_unlock_special_house_info{}) ->
	{?msg_req_unlock_special_house_info, null};
encode(#notify_unlock_special_house_info{ids=IDS}) ->
	{?msg_notify_unlock_special_house_info, <<(net_helper:encode_list(fun(E)-> <<E:?INT>>end, IDS))/binary>>};
encode(#special_house_goods{id=ID, house_tplt_id=HOUSE_TPLT_ID, remain_count=REMAIN_COUNT, q_coin=Q_COIN}) ->
	{?msg_special_house_goods, <<ID:?INT, HOUSE_TPLT_ID:?INT, REMAIN_COUNT:?INT, Q_COIN:?INT>>};
encode(#req_special_house_list{}) ->
	{?msg_req_special_house_list, null};
encode(#notify_special_house_list{house_list=HOUSE_LIST}) ->
	{?msg_notify_special_house_list, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, HOUSE_LIST))/binary>>};
encode(#notify_buy_special_house_success{}) ->
	{?msg_notify_buy_special_house_success, null};
encode(#req_self_special_house_list{}) ->
	{?msg_req_self_special_house_list, null};
encode(#notify_self_special_house_list{house_list=HOUSE_LIST}) ->
	{?msg_notify_self_special_house_list, <<(net_helper:encode_list(fun(E)-> <<E:?INT>>end, HOUSE_LIST))/binary>>};
encode(#req_buy_special_house{house_tplt_id=HOUSE_TPLT_ID}) ->
	{?msg_req_buy_special_house, <<HOUSE_TPLT_ID:?INT>>};
encode(#req_move_house{new_house_tplt_id=NEW_HOUSE_TPLT_ID}) ->
	{?msg_req_move_house, <<NEW_HOUSE_TPLT_ID:?INT>>};
encode(#notify_move_house_success{}) ->
	{?msg_notify_move_house_success, null};
encode(#req_get_free_count_for_moving_special_house{}) ->
	{?msg_req_get_free_count_for_moving_special_house, null};
encode(#notify_get_free_count_for_moving_special_house{count=COUNT}) ->
	{?msg_notify_get_free_count_for_moving_special_house, <<COUNT:?INT>>};
encode(#req_invite_active{}) ->
	{?msg_req_invite_active, null};
encode(#notify_invite_active{count=COUNT, invite_list=INVITE_LIST}) ->
	{?msg_notify_invite_active, <<COUNT:?INT, (net_helper:encode_list(fun(E)-> net_helper:encode_string(E) end, INVITE_LIST))/binary>>};
encode(#req_invite_award{count=COUNT, diamond=DIAMOND, item_id=ITEM_ID, invite_list=INVITE_LIST}) ->
	{?msg_req_invite_award, <<COUNT:?INT, DIAMOND:?INT, ITEM_ID:?INT, (net_helper:encode_list(fun(E)-> net_helper:encode_string(E) end, INVITE_LIST))/binary>>};
encode(#notify_invite_award{result=RESULT}) ->
	{?msg_notify_invite_award, <<RESULT:?INT>>};
encode(#req_open_search_items_ui{}) ->
	{?msg_req_open_search_items_ui, null};
encode(#notify_open_search_items_ui{rate=RATE, item_count=ITEM_COUNT}) ->
	{?msg_notify_open_search_items_ui, <<RATE:?INT, ITEM_COUNT:?INT>>};
encode(#req_search_items{is_npc=IS_NPC, friend_account=FRIEND_ACCOUNT, friend_name=FRIEND_NAME}) ->
	{?msg_req_search_items, <<IS_NPC:?INT, (net_helper:encode_string(FRIEND_ACCOUNT))/binary, (net_helper:encode_string(FRIEND_NAME))/binary>>};
encode(#notify_searching_items{is_npc=IS_NPC, friend_account=FRIEND_ACCOUNT, friend_name=FRIEND_NAME, remain_seconds=REMAIN_SECONDS, whip_count=WHIP_COUNT}) ->
	{?msg_notify_searching_items, <<IS_NPC:?INT, (net_helper:encode_string(FRIEND_ACCOUNT))/binary, (net_helper:encode_string(FRIEND_NAME))/binary, REMAIN_SECONDS:?INT, WHIP_COUNT:?INT>>};
encode(#req_quick_search_items{whip_count=WHIP_COUNT}) ->
	{?msg_req_quick_search_items, <<WHIP_COUNT:?INT>>};
encode(#req_whip{}) ->
	{?msg_req_whip, null};
encode(#notify_search_items_result{is_npc=IS_NPC, friend_account=FRIEND_ACCOUNT, friend_name=FRIEND_NAME, grid_count=GRID_COUNT, gain_items=GAIN_ITEMS}) ->
	{?msg_notify_search_items_result, <<IS_NPC:?INT, (net_helper:encode_string(FRIEND_ACCOUNT))/binary, (net_helper:encode_string(FRIEND_NAME))/binary, GRID_COUNT:?INT, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, GAIN_ITEMS))/binary>>};
encode(#notify_new_self_msgs{}) ->
	{?msg_notify_new_self_msgs, null};
encode(#hire_msg{time=TIME, is_npc=IS_NPC, friend_account=FRIEND_ACCOUNT, cost_money=COST_MONEY}) ->
	{?msg_hire_msg, <<(net_helper:get_encode_binary_data(encode(TIME)))/binary, IS_NPC:?INT, (net_helper:encode_string(FRIEND_ACCOUNT))/binary, COST_MONEY:?INT>>};
encode(#be_hire_msg{time=TIME, friend_account=FRIEND_ACCOUNT, gain_exp=GAIN_EXP}) ->
	{?msg_be_hire_msg, <<(net_helper:get_encode_binary_data(encode(TIME)))/binary, (net_helper:encode_string(FRIEND_ACCOUNT))/binary, GAIN_EXP:?INT>>};
encode(#be_whip_msg{time=TIME, friend_account=FRIEND_ACCOUNT}) ->
	{?msg_be_whip_msg, <<(net_helper:get_encode_binary_data(encode(TIME)))/binary, (net_helper:encode_string(FRIEND_ACCOUNT))/binary>>};
encode(#whip_msg{time=TIME, account=ACCOUNT, is_npc=IS_NPC, whip_count=WHIP_COUNT, friend_account=FRIEND_ACCOUNT}) ->
	{?msg_whip_msg, <<(net_helper:get_encode_binary_data(encode(TIME)))/binary, (net_helper:encode_string(ACCOUNT))/binary, IS_NPC:?INT, WHIP_COUNT:?INT, (net_helper:encode_string(FRIEND_ACCOUNT))/binary>>};
encode(#req_self_msgs{}) ->
	{?msg_req_self_msgs, null};
encode(#notify_self_msgs{hire_msgs=HIRE_MSGS, be_hire_msgs=BE_HIRE_MSGS, be_whip_msgs=BE_WHIP_MSGS, whip_msgs=WHIP_MSGS}) ->
	{?msg_notify_self_msgs, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, HIRE_MSGS))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, BE_HIRE_MSGS))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, BE_WHIP_MSGS))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, WHIP_MSGS))/binary>>};
encode(#req_update_search_items{}) ->
	{?msg_req_update_search_items, null};
encode(#notify_polymorph_result{account=ACCOUNT, alter_body=ALTER_BODY, message=MESSAGE, user=USER}) ->
	{?msg_notify_polymorph_result, <<(net_helper:encode_string(ACCOUNT))/binary, (net_helper:get_encode_binary_data(encode(ALTER_BODY)))/binary, (net_helper:encode_string(MESSAGE))/binary, (net_helper:encode_string(USER))/binary>>};
encode(#req_purify_polymorph{target_account=TARGET_ACCOUNT}) ->
	{?msg_req_purify_polymorph, <<(net_helper:encode_string(TARGET_ACCOUNT))/binary>>};
encode(#req_player_info{account=ACCOUNT}) ->
	{?msg_req_player_info, <<(net_helper:encode_string(ACCOUNT))/binary>>};
encode(#notify_player_info{player=PLAYER}) ->
	{?msg_notify_player_info, <<(net_helper:get_encode_binary_data(encode(PLAYER)))/binary>>};
encode(#req_produce{produce_manual_id=PRODUCE_MANUAL_ID, lucky_stone_count=LUCKY_STONE_COUNT, has_insurance=HAS_INSURANCE}) ->
	{?msg_req_produce, <<PRODUCE_MANUAL_ID:?UINT64, LUCKY_STONE_COUNT:?INT, HAS_INSURANCE:?INT>>};
encode(#notify_produce_ack{}) ->
	{?msg_notify_produce_ack, null};
encode(#notify_produce{result=RESULT, message=MESSAGE, finished=FINISHED, player=PLAYER}) ->
	{?msg_notify_produce, <<RESULT:?INT, (net_helper:encode_string(MESSAGE))/binary, (net_helper:get_encode_binary_data(encode(FINISHED)))/binary, (net_helper:get_encode_binary_data(encode(PLAYER)))/binary>>};
encode(#notify_produce_level{level=LEVEL, experience=EXPERIENCE}) ->
	{?msg_notify_produce_level, <<LEVEL:?INT, EXPERIENCE:?INT>>};
encode(#req_ranking{type=TYPE}) ->
	{?msg_req_ranking, <<TYPE:?INT>>};
encode(#ranking_data{account=ACCOUNT, data=DATA}) ->
	{?msg_ranking_data, <<(net_helper:encode_string(ACCOUNT))/binary, DATA:?INT>>};
encode(#notify_ranking{type=TYPE, self_ranking=SELF_RANKING, data=DATA}) ->
	{?msg_notify_ranking, <<TYPE:?INT, SELF_RANKING:?INT, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, DATA))/binary>>};
encode(#req_score_ranking{}) ->
	{?msg_req_score_ranking, null};
encode(#notify_score_ranking{self_score=SELF_SCORE, data=DATA}) ->
	{?msg_notify_score_ranking, <<SELF_SCORE:?INT, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, DATA))/binary>>};
encode(#req_set_guest_book_opened{id=ID, opened=OPENED}) ->
	{?msg_req_set_guest_book_opened, <<ID:?UINT64, OPENED:?INT>>};
encode(#notify_set_guest_book_opened{id=ID, opened=OPENED}) ->
	{?msg_notify_set_guest_book_opened, <<ID:?UINT64, OPENED:?INT>>};
encode(#req_set_checkin_opened{id=ID, opened=OPENED}) ->
	{?msg_req_set_checkin_opened, <<(net_helper:encode_string(ID))/binary, OPENED:?INT>>};
encode(#notify_set_checkin_opened{id=ID, opened=OPENED}) ->
	{?msg_notify_set_checkin_opened, <<(net_helper:encode_string(ID))/binary, OPENED:?INT>>};
encode(#crop_event{id=ID, type=TYPE, time=TIME}) ->
	{?msg_crop_event, <<ID:?INT, TYPE:?INT, TIME:?INT>>};
encode(#crop_data{inst_id=INST_ID, item_id=ITEM_ID, rest_time=REST_TIME, fruit_id=FRUIT_ID, fruit_count=FRUIT_COUNT, evt=EVT}) ->
	{?msg_crop_data, <<INST_ID:?UINT64, ITEM_ID:?INT, REST_TIME:?INT, (net_helper:encode_list(fun(E)-> <<E:?INT>>end, FRUIT_ID))/binary, (net_helper:encode_list(fun(E)-> <<E:?INT>>end, FRUIT_COUNT))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, EVT))/binary>>};
encode(#req_plant_crop{flowerpot_id=FLOWERPOT_ID, seed_id=SEED_ID}) ->
	{?msg_req_plant_crop, <<FLOWERPOT_ID:?UINT64, SEED_ID:?UINT64>>};
encode(#notify_farm_data{house_id=HOUSE_ID, crops=CROPS, water_limit=WATER_LIMIT}) ->
	{?msg_notify_farm_data, <<HOUSE_ID:?UINT64, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, CROPS))/binary, WATER_LIMIT:?INT>>};
encode(#req_crop_event{house_id=HOUSE_ID, inst_id=INST_ID, event_type=EVENT_TYPE, event_id=EVENT_ID}) ->
	{?msg_req_crop_event, <<HOUSE_ID:?UINT64, INST_ID:?UINT64, EVENT_TYPE:?INT, EVENT_ID:?INT>>};
encode(#req_all_crop_event{house_id=HOUSE_ID, event_type=EVENT_TYPE}) ->
	{?msg_req_all_crop_event, <<HOUSE_ID:?UINT64, EVENT_TYPE:?INT>>};
encode(#req_delete_crop{crop_id=CROP_ID}) ->
	{?msg_req_delete_crop, <<CROP_ID:?UINT64>>};
encode(#notify_delete_crop{crop_id=CROP_ID, result=RESULT}) ->
	{?msg_notify_delete_crop, <<CROP_ID:?UINT64, RESULT:?INT>>};
encode(#notify_crop_data{house_id=HOUSE_ID, op=OP, crop=CROP, water_limit=WATER_LIMIT}) ->
	{?msg_notify_crop_data, <<HOUSE_ID:?UINT64, OP:?INT, (net_helper:get_encode_binary_data(encode(CROP)))/binary, WATER_LIMIT:?INT>>};
encode(#req_pick_crop_fruit{crop_id=CROP_ID}) ->
	{?msg_req_pick_crop_fruit, <<CROP_ID:?UINT64>>};
encode(#notify_pick_crop_fruit{house_id=HOUSE_ID, crop_id=CROP_ID, result=RESULT}) ->
	{?msg_notify_pick_crop_fruit, <<HOUSE_ID:?UINT64, CROP_ID:?UINT64, RESULT:?INT>>};
encode(#req_house_max_flowerpot{}) ->
	{?msg_req_house_max_flowerpot, null};
encode(#notify_house_max_flowerpot{house_id=HOUSE_ID, owner_number=OWNER_NUMBER, max_number=MAX_NUMBER}) ->
	{?msg_notify_house_max_flowerpot, <<HOUSE_ID:?UINT64, OWNER_NUMBER:?INT, MAX_NUMBER:?INT>>};
encode(#req_add_flowerpot_number{}) ->
	{?msg_req_add_flowerpot_number, null};
encode(#req_breakup{diamond=DIAMOND, expect_items=EXPECT_ITEMS}) ->
	{?msg_req_breakup, <<DIAMOND:?INT, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, EXPECT_ITEMS))/binary>>};
encode(#notify_breakup_ack{}) ->
	{?msg_notify_breakup_ack, null};
encode(#notify_breakup_error{}) ->
	{?msg_notify_breakup_error, null};
encode(#req_player_breakup{}) ->
	{?msg_req_player_breakup, null};
encode(#notify_player_breakup_none{}) ->
	{?msg_notify_player_breakup_none, null};
encode(#notify_player_breakup{account=ACCOUNT, diamond=DIAMOND, unobtained_items=UNOBTAINED_ITEMS}) ->
	{?msg_notify_player_breakup, <<(net_helper:encode_string(ACCOUNT))/binary, DIAMOND:?INT, (net_helper:encode_list(fun(E)-> <<E:?INT>>end, UNOBTAINED_ITEMS))/binary>>};
encode(#req_player_breakup_diamond{}) ->
	{?msg_req_player_breakup_diamond, null};
encode(#notify_player_breakup_diamond{}) ->
	{?msg_notify_player_breakup_diamond, null};
encode(#notify_player_be_breakuped{}) ->
	{?msg_notify_player_be_breakuped, null};
encode(#require_item_atom{item_id=ITEM_ID, item_count=ITEM_COUNT, content=CONTENT}) ->
	{?msg_require_item_atom, <<ITEM_ID:?INT, ITEM_COUNT:?INT, (net_helper:encode_string(CONTENT))/binary>>};
encode(#reward_item_atom{item_id=ITEM_ID, item_count=ITEM_COUNT}) ->
	{?msg_reward_item_atom, <<ITEM_ID:?INT, ITEM_COUNT:?INT>>};
encode(#req_open_post_reward_ui{}) ->
	{?msg_req_open_post_reward_ui, null};
encode(#notify_open_post_reward_ui{content=CONTENT, require_items=REQUIRE_ITEMS, reward_items=REWARD_ITEMS, reward_diamond=REWARD_DIAMOND, reward_exp=REWARD_EXP}) ->
	{?msg_notify_open_post_reward_ui, <<(net_helper:encode_string(CONTENT))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, REQUIRE_ITEMS))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, REWARD_ITEMS))/binary, REWARD_DIAMOND:?INT, REWARD_EXP:?INT>>};
encode(#req_complete_post_reward{}) ->
	{?msg_req_complete_post_reward, null};
encode(#notify_complete_post_reward{result=RESULT}) ->
	{?msg_notify_complete_post_reward, <<RESULT:?INT>>};
encode(#notify_active_score_lottery{}) ->
	{?msg_notify_active_score_lottery, null};
encode(#req_open_score_lottery_ui{}) ->
	{?msg_req_open_score_lottery_ui, null};
encode(#notify_open_score_lottery_ui{items=ITEMS, remain_count=REMAIN_COUNT}) ->
	{?msg_notify_open_score_lottery_ui, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, ITEMS))/binary, REMAIN_COUNT:?INT>>};
encode(#req_score_lottery{}) ->
	{?msg_req_score_lottery, null};
encode(#notify_score_lottery_result{items=ITEMS, hit_index=HIT_INDEX, remain_count=REMAIN_COUNT}) ->
	{?msg_notify_score_lottery_result, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, ITEMS))/binary, HIT_INDEX:?INT, REMAIN_COUNT:?INT>>};
encode(#req_refresh_score_lottery_ui{}) ->
	{?msg_req_refresh_score_lottery_ui, null};
encode(#notify_refresh_score_lottery_ui{items=ITEMS, remain_count=REMAIN_COUNT}) ->
	{?msg_notify_refresh_score_lottery_ui, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, ITEMS))/binary, REMAIN_COUNT:?INT>>};
encode(#req_daily_reward_ui{}) ->
	{?msg_req_daily_reward_ui, null};
encode(#notify_daily_reward_ui{progress_list=PROGRESS_LIST, reward_score_list=REWARD_SCORE_LIST, has_reward_list=HAS_REWARD_LIST}) ->
	{?msg_notify_daily_reward_ui, <<(net_helper:encode_list(fun(E)-> <<E:?INT>>end, PROGRESS_LIST))/binary, (net_helper:encode_list(fun(E)-> <<E:?INT>>end, REWARD_SCORE_LIST))/binary, (net_helper:encode_list(fun(E)-> <<E:?INT>>end, HAS_REWARD_LIST))/binary>>};
encode(#req_daily_reward{score=SCORE}) ->
	{?msg_req_daily_reward, <<SCORE:?INT>>};
encode(#notify_daily_active_can_reward{}) ->
	{?msg_notify_daily_active_can_reward, null};
encode(#req_close_daily_reward_ui{}) ->
	{?msg_req_close_daily_reward_ui, null};
encode(#req_immediate_complete_daily_reward{index=INDEX}) ->
	{?msg_req_immediate_complete_daily_reward, <<INDEX:?INT>>};
encode(#req_open_daily_task_ui{}) ->
	{?msg_req_open_daily_task_ui, null};
encode(#req_close_daily_task_ui{}) ->
	{?msg_req_close_daily_task_ui, null};
encode(#req_get_buff{}) ->
	{?msg_req_get_buff, null};
encode(#player_buff_data{id=ID, rest_time=REST_TIME}) ->
	{?msg_player_buff_data, <<ID:?INT, REST_TIME:?INT>>};
encode(#notify_player_buff{account=ACCOUNT, buffs=BUFFS}) ->
	{?msg_notify_player_buff, <<(net_helper:encode_string(ACCOUNT))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, BUFFS))/binary>>};
encode(#notify_add_buff{buff=BUFF}) ->
	{?msg_notify_add_buff, <<(net_helper:get_encode_binary_data(encode(BUFF)))/binary>>};
encode(#pub_account_info{account=ACCOUNT, name=NAME, level=LEVEL}) ->
	{?msg_pub_account_info, <<(net_helper:encode_string(ACCOUNT))/binary, (net_helper:encode_string(NAME))/binary, LEVEL:?INT>>};
encode(#pub_info{pub_id=PUB_ID, owner_info=OWNER_INFO, pub_name=PUB_NAME, person_count1=PERSON_COUNT1, person_count2=PERSON_COUNT2, max_person=MAX_PERSON, status=STATUS, admin_list=ADMIN_LIST, voice_id=VOICE_ID}) ->
	{?msg_pub_info, <<PUB_ID:?UINT64, (net_helper:get_encode_binary_data(encode(OWNER_INFO)))/binary, (net_helper:encode_string(PUB_NAME))/binary, PERSON_COUNT1:?INT, PERSON_COUNT2:?INT, MAX_PERSON:?INT, STATUS:?INT, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, ADMIN_LIST))/binary, VOICE_ID:?UINT64>>};
encode(#req_pub_list{page=PAGE}) ->
	{?msg_req_pub_list, <<PAGE:?INT>>};
encode(#notify_pub_list{my_channel_id=MY_CHANNEL_ID, max_page=MAX_PAGE, pubs=PUBS}) ->
	{?msg_notify_pub_list, <<MY_CHANNEL_ID:?UINT64, MAX_PAGE:?INT, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, PUBS))/binary>>};
encode(#req_leave_pub_channel{pub_id=PUB_ID}) ->
	{?msg_req_leave_pub_channel, <<PUB_ID:?UINT64>>};
encode(#req_enter_pub_channel{pub_id=PUB_ID}) ->
	{?msg_req_enter_pub_channel, <<PUB_ID:?UINT64>>};
encode(#notify_enter_pub_channel{info=INFO, accounts=ACCOUNTS}) ->
	{?msg_notify_enter_pub_channel, <<(net_helper:get_encode_binary_data(encode(INFO)))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, ACCOUNTS))/binary>>};
encode(#req_update_pub_voice_id{pub_id=PUB_ID, voice_id=VOICE_ID}) ->
	{?msg_req_update_pub_voice_id, <<PUB_ID:?UINT64, VOICE_ID:?UINT64>>};
encode(#notify_update_pub_voice_id{pub_id=PUB_ID, voice_id=VOICE_ID}) ->
	{?msg_notify_update_pub_voice_id, <<PUB_ID:?UINT64, VOICE_ID:?UINT64>>};
encode(#req_chat_channel{channel_id=CHANNEL_ID, content=CONTENT}) ->
	{?msg_req_chat_channel, <<CHANNEL_ID:?UINT64, (net_helper:encode_string(CONTENT))/binary>>};
encode(#notify_chat_channel{channel_id=CHANNEL_ID, account=ACCOUNT, player_name=PLAYER_NAME, content=CONTENT}) ->
	{?msg_notify_chat_channel, <<CHANNEL_ID:?UINT64, (net_helper:encode_string(ACCOUNT))/binary, (net_helper:encode_string(PLAYER_NAME))/binary, (net_helper:encode_string(CONTENT))/binary>>};
encode(#notify_channel_add_player{channel_id=CHANNEL_ID, account_info=ACCOUNT_INFO}) ->
	{?msg_notify_channel_add_player, <<CHANNEL_ID:?UINT64, (net_helper:get_encode_binary_data(encode(ACCOUNT_INFO)))/binary>>};
encode(#notify_channel_del_player{channel_id=CHANNEL_ID, account=ACCOUNT}) ->
	{?msg_notify_channel_del_player, <<CHANNEL_ID:?UINT64, (net_helper:encode_string(ACCOUNT))/binary>>};
encode(#req_channel_tell{target_player=TARGET_PLAYER, content=CONTENT}) ->
	{?msg_req_channel_tell, <<(net_helper:encode_string(TARGET_PLAYER))/binary, (net_helper:encode_string(CONTENT))/binary>>};
encode(#notify_channel_tell{speaker=SPEAKER, speaker_name=SPEAKER_NAME, content=CONTENT}) ->
	{?msg_notify_channel_tell, <<(net_helper:encode_string(SPEAKER))/binary, (net_helper:encode_string(SPEAKER_NAME))/binary, (net_helper:encode_string(CONTENT))/binary>>};
encode(#broadcast_kick_pub_player{kicker=KICKER, be_kicket=BE_KICKET}) ->
	{?msg_broadcast_kick_pub_player, <<(net_helper:encode_string(KICKER))/binary, (net_helper:encode_string(BE_KICKET))/binary>>};
encode(#notify_update_pub_player_count{person_count1=PERSON_COUNT1, max_count1=MAX_COUNT1, person_count2=PERSON_COUNT2, max_count2=MAX_COUNT2}) ->
	{?msg_notify_update_pub_player_count, <<PERSON_COUNT1:?INT, MAX_COUNT1:?INT, PERSON_COUNT2:?INT, MAX_COUNT2:?INT>>};
encode(#req_send_yy_gift{recver_account=RECVER_ACCOUNT, gift_id=GIFT_ID, gift_count=GIFT_COUNT}) ->
	{?msg_req_send_yy_gift, <<(net_helper:encode_string(RECVER_ACCOUNT))/binary, GIFT_ID:?INT, GIFT_COUNT:?INT>>};
encode(#broadcast_send_yy_gift{gift_id=GIFT_ID, gift_count=GIFT_COUNT, sender_info=SENDER_INFO, recver_info=RECVER_INFO}) ->
	{?msg_broadcast_send_yy_gift, <<GIFT_ID:?INT, GIFT_COUNT:?INT, (net_helper:get_encode_binary_data(encode(SENDER_INFO)))/binary, (net_helper:get_encode_binary_data(encode(RECVER_INFO)))/binary>>};
encode(#req_kick_channel_player{account=ACCOUNT}) ->
	{?msg_req_kick_channel_player, <<(net_helper:encode_string(ACCOUNT))/binary>>};
encode(#notify_unlock_furniture_list{unlock_list=UNLOCK_LIST}) ->
	{?msg_notify_unlock_furniture_list, <<(net_helper:encode_list(fun(E)-> <<E:?INT>>end, UNLOCK_LIST))/binary>>};
encode(#req_unlock_furniture{id=ID}) ->
	{?msg_req_unlock_furniture, <<ID:?INT>>};
encode(#notify_unlock_furniture{}) ->
	{?msg_notify_unlock_furniture, null};
encode(#req_exchange{id=ID}) ->
	{?msg_req_exchange, <<ID:?INT>>};
encode(#notify_exchange{}) ->
	{?msg_notify_exchange, null};
encode(#notify_friend_intimate{account=ACCOUNT, intimate=INTIMATE}) ->
	{?msg_notify_friend_intimate, <<(net_helper:encode_string(ACCOUNT))/binary, INTIMATE:?INT>>};
encode(#req_flower_shake{house_id=HOUSE_ID, shake_count=SHAKE_COUNT, enable_props=ENABLE_PROPS}) ->
	{?msg_req_flower_shake, <<HOUSE_ID:?UINT64, SHAKE_COUNT:?INT, ENABLE_PROPS:?INT>>};
encode(#req_flower_love_coin_shake{house_id=HOUSE_ID}) ->
	{?msg_req_flower_love_coin_shake, <<HOUSE_ID:?UINT64>>};
encode(#notify_flower_shake{diamond=DIAMOND, exp=EXP, items=ITEMS, shake_prop_count=SHAKE_PROP_COUNT, free_shake=FREE_SHAKE}) ->
	{?msg_notify_flower_shake, <<DIAMOND:?INT, EXP:?INT, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, ITEMS))/binary, SHAKE_PROP_COUNT:?INT, FREE_SHAKE:?INT>>};
encode(#notify_flower_shake_prop_required{}) ->
	{?msg_notify_flower_shake_prop_required, null};
encode(#req_flower_shaked{house_id=HOUSE_ID}) ->
	{?msg_req_flower_shaked, <<HOUSE_ID:?UINT64>>};
encode(#notify_flower_shaked{free_shake=FREE_SHAKE, total_shake_count=TOTAL_SHAKE_COUNT, free_shake_time=FREE_SHAKE_TIME}) ->
	{?msg_notify_flower_shaked, <<FREE_SHAKE:?INT, TOTAL_SHAKE_COUNT:?INT, FREE_SHAKE_TIME:?INT>>};
encode(#notify_flower_love_coin_shaked{total_shake_count=TOTAL_SHAKE_COUNT, love_coin_shake=LOVE_COIN_SHAKE}) ->
	{?msg_notify_flower_love_coin_shaked, <<TOTAL_SHAKE_COUNT:?INT, LOVE_COIN_SHAKE:?INT>>};
encode(#notify_flower_shake_overflow{available=AVAILABLE}) ->
	{?msg_notify_flower_shake_overflow, <<AVAILABLE:?INT>>};
encode(#req_first_payment_return_status{}) ->
	{?msg_req_first_payment_return_status, null};
encode(#notify_first_payment_return_status{returned=RETURNED}) ->
	{?msg_notify_first_payment_return_status, <<RETURNED:?INT>>};
encode(#req_first_payment_return_reward{}) ->
	{?msg_req_first_payment_return_reward, null};
encode(#notify_first_payment_return_reward{returned=RETURNED}) ->
	{?msg_notify_first_payment_return_reward, <<RETURNED:?INT>>};
encode(#single_payment_return_item{return_diamond=RETURN_DIAMOND, return_count=RETURN_COUNT}) ->
	{?msg_single_payment_return_item, <<RETURN_DIAMOND:?INT, RETURN_COUNT:?INT>>};
encode(#req_single_payment_return{}) ->
	{?msg_req_single_payment_return, null};
encode(#notify_single_payment_return{items=ITEMS}) ->
	{?msg_notify_single_payment_return, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, ITEMS))/binary>>};
encode(#req_single_payment_return_reward{return_diamond=RETURN_DIAMOND}) ->
	{?msg_req_single_payment_return_reward, <<RETURN_DIAMOND:?INT>>};
encode(#notify_single_payment_return_reward{returned=RETURNED}) ->
	{?msg_notify_single_payment_return_reward, <<RETURNED:?INT>>};
encode(#total_payment_return_item{consume_amount=CONSUME_AMOUNT, return_items=RETURN_ITEMS, returned=RETURNED}) ->
	{?msg_total_payment_return_item, <<CONSUME_AMOUNT:?INT, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, RETURN_ITEMS))/binary, RETURNED:?INT>>};
encode(#req_total_payment_return{}) ->
	{?msg_req_total_payment_return, null};
encode(#notify_total_payment_return{total_amount=TOTAL_AMOUNT, items=ITEMS}) ->
	{?msg_notify_total_payment_return, <<TOTAL_AMOUNT:?INT, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, ITEMS))/binary>>};
encode(#req_total_payment_return_reward{consume_amount=CONSUME_AMOUNT}) ->
	{?msg_req_total_payment_return_reward, <<CONSUME_AMOUNT:?INT>>};
encode(#notify_total_payment_return_reward{returned=RETURNED}) ->
	{?msg_notify_total_payment_return_reward, <<RETURNED:?INT>>};
encode(#req_item_upgrade{instance_id=INSTANCE_ID}) ->
	{?msg_req_item_upgrade, <<INSTANCE_ID:?UINT64>>};
encode(#notify_item_upgrade{upgrade_item_instanceid=UPGRADE_ITEM_INSTANCEID, result=RESULT}) ->
	{?msg_notify_item_upgrade, <<UPGRADE_ITEM_INSTANCEID:?UINT64, RESULT:?INT>>};
encode(#req_mutli_item_upgrade{inst_ids=INST_IDS}) ->
	{?msg_req_mutli_item_upgrade, <<(net_helper:encode_list(fun(E)-> <<E:?UINT64>>end, INST_IDS))/binary>>};
encode(#notify_mutli_item_upgrade{furnitures=FURNITURES, decoration=DECORATION}) ->
	{?msg_notify_mutli_item_upgrade, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, FURNITURES))/binary, DECORATION:?INT>>};
encode(#notify_make_up_info{level=LEVEL}) ->
	{?msg_notify_make_up_info, <<LEVEL:?INT>>};
encode(#req_enter_pub_scene{}) ->
	{?msg_req_enter_pub_scene, null};
encode(#notify_enter_pub_scene{template_id=TEMPLATE_ID, info=INFO, accounts=ACCOUNTS, enter_pos=ENTER_POS}) ->
	{?msg_notify_enter_pub_scene, <<TEMPLATE_ID:?INT, (net_helper:get_encode_binary_data(encode(INFO)))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, ACCOUNTS))/binary, (net_helper:get_encode_binary_data(encode(ENTER_POS)))/binary>>};
encode(#req_get_sprites{}) ->
	{?msg_req_get_sprites, null};
encode(#req_click_sprite{id=ID}) ->
	{?msg_req_click_sprite, <<ID:?INT>>};
encode(#sprite{id=ID, curr_exp=CURR_EXP, level=LEVEL, remain_time=REMAIN_TIME}) ->
	{?msg_sprite, <<ID:?INT, CURR_EXP:?INT, LEVEL:?INT, REMAIN_TIME:?INT>>};
encode(#notify_sprite_data{appraise=APPRAISE, sprites=SPRITES}) ->
	{?msg_notify_sprite_data, <<APPRAISE:?INT, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, SPRITES))/binary>>};
encode(#notify_del_sprite{id=ID, del=DEL}) ->
	{?msg_notify_del_sprite, <<ID:?INT, DEL:?INT>>};
encode(#req_click_guest{appraise=APPRAISE}) ->
	{?msg_req_click_guest, <<APPRAISE:?INT>>};
encode(#notify_can_click_guest{canClick=CANCLICK}) ->
	{?msg_notify_can_click_guest, <<CANCLICK:?INT>>};
encode(#notify_sprite_upgrade{id=ID, level=LEVEL}) ->
	{?msg_notify_sprite_upgrade, <<ID:?INT, LEVEL:?INT>>};
encode(#req_unlock_food{id=ID}) ->
	{?msg_req_unlock_food, <<ID:?INT>>};
encode(#notify_unlock_food{id=ID}) ->
	{?msg_notify_unlock_food, <<ID:?INT>>};
encode(#req_unlock_food_info{}) ->
	{?msg_req_unlock_food_info, null};
encode(#notify_unlock_food_info{ids=IDS}) ->
	{?msg_notify_unlock_food_info, <<(net_helper:encode_list(fun(E)-> <<E:?INT>>end, IDS))/binary>>};
encode(#req_expand_food_stock{id=ID}) ->
	{?msg_req_expand_food_stock, <<ID:?INT>>};
encode(#food_stock_info{id=ID, size=SIZE, value=VALUE, seconds=SECONDS, due_time=DUE_TIME}) ->
	{?msg_food_stock_info, <<ID:?INT, SIZE:?INT, VALUE:?INT, SECONDS:?INT, (net_helper:get_encode_binary_data(encode(DUE_TIME)))/binary>>};
encode(#notify_expand_food_stock{id=ID, due_time=DUE_TIME}) ->
	{?msg_notify_expand_food_stock, <<ID:?INT, (net_helper:get_encode_binary_data(encode(DUE_TIME)))/binary>>};
encode(#notify_settlement_expand_food_stock{id=ID, size=SIZE}) ->
	{?msg_notify_settlement_expand_food_stock, <<ID:?INT, SIZE:?INT>>};
encode(#req_food_stock_info{}) ->
	{?msg_req_food_stock_info, null};
encode(#notify_food_stock_info{stock_info=STOCK_INFO}) ->
	{?msg_notify_food_stock_info, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, STOCK_INFO))/binary>>};
encode(#req_cancel_expand_food_stock{id=ID}) ->
	{?msg_req_cancel_expand_food_stock, <<ID:?INT>>};
encode(#notify_cancel_expand_food_stock{id=ID}) ->
	{?msg_notify_cancel_expand_food_stock, <<ID:?INT>>};
encode(#req_complete_expand_food_stock{id=ID, grid_index=GRID_INDEX}) ->
	{?msg_req_complete_expand_food_stock, <<ID:?INT, GRID_INDEX:?INT>>};
encode(#notify_complete_expand_food_stock{id=ID, grid_index=GRID_INDEX}) ->
	{?msg_notify_complete_expand_food_stock, <<ID:?INT, GRID_INDEX:?INT>>};
encode(#req_immediately_complete_expand_stock{id=ID, grid_index=GRID_INDEX}) ->
	{?msg_req_immediately_complete_expand_stock, <<ID:?INT, GRID_INDEX:?INT>>};
encode(#notify_immediately_complete_expand_stock{id=ID, grid_index=GRID_INDEX}) ->
	{?msg_notify_immediately_complete_expand_stock, <<ID:?INT, GRID_INDEX:?INT>>};
encode(#req_expand_produce_area{grid_index=GRID_INDEX}) ->
	{?msg_req_expand_produce_area, <<GRID_INDEX:?INT>>};
encode(#notify_expand_produce_area{number=NUMBER, grid_index=GRID_INDEX}) ->
	{?msg_notify_expand_produce_area, <<NUMBER:?INT, GRID_INDEX:?INT>>};
encode(#req_produce_area{}) ->
	{?msg_req_produce_area, null};
encode(#notify_produce_area{number=NUMBER}) ->
	{?msg_notify_produce_area, <<NUMBER:?INT>>};
encode(#req_upgrade_food{id=ID}) ->
	{?msg_req_upgrade_food, <<ID:?INT>>};
encode(#notify_upgrade_food{id=ID, upgrade_id=UPGRADE_ID}) ->
	{?msg_notify_upgrade_food, <<ID:?INT, UPGRADE_ID:?INT>>};
encode(#food_upgrade_info{id=ID, upgrade_id=UPGRADE_ID}) ->
	{?msg_food_upgrade_info, <<ID:?INT, UPGRADE_ID:?INT>>};
encode(#req_food_upgrade_info{}) ->
	{?msg_req_food_upgrade_info, null};
encode(#notify_food_upgrade_info{upgrade_info=UPGRADE_INFO}) ->
	{?msg_notify_food_upgrade_info, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, UPGRADE_INFO))/binary>>};
encode(#product_atom{id=ID, copies=COPIES}) ->
	{?msg_product_atom, <<ID:?INT, COPIES:?INT>>};
encode(#req_make_product{products=PRODUCTS, start_time=START_TIME}) ->
	{?msg_req_make_product, <<(net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, PRODUCTS))/binary, (net_helper:get_encode_binary_data(encode(START_TIME)))/binary>>};
encode(#notify_make_product{start_time=START_TIME}) ->
	{?msg_notify_make_product, <<(net_helper:get_encode_binary_data(encode(START_TIME)))/binary>>};
encode(#req_remove_product{position=POSITION}) ->
	{?msg_req_remove_product, <<POSITION:?INT>>};
encode(#notify_remove_product{start_time=START_TIME}) ->
	{?msg_notify_remove_product, <<(net_helper:get_encode_binary_data(encode(START_TIME)))/binary>>};
encode(#req_complete_product{}) ->
	{?msg_req_complete_product, null};
encode(#notify_complete_product{}) ->
	{?msg_notify_complete_product, null};
encode(#req_immediately_complete_product{}) ->
	{?msg_req_immediately_complete_product, null};
encode(#notify_immediately_complete_product{}) ->
	{?msg_notify_immediately_complete_product, null};
encode(#req_products{}) ->
	{?msg_req_products, null};
encode(#product_info{id=ID, product_id=PRODUCT_ID, copies=COPIES}) ->
	{?msg_product_info, <<ID:?INT, PRODUCT_ID:?INT, COPIES:?INT>>};
encode(#notify_products{start_time=START_TIME, info=INFO}) ->
	{?msg_notify_products, <<(net_helper:get_encode_binary_data(encode(START_TIME)))/binary, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, INFO))/binary>>};
encode(#notify_food_settlement_diamond{diamond=DIAMOND}) ->
	{?msg_notify_food_settlement_diamond, <<DIAMOND:?INT>>};
encode(#notify_reset_temp_diamond{}) ->
	{?msg_notify_reset_temp_diamond, null};
encode(#req_ask_drink_count{drink_id=DRINK_ID}) ->
	{?msg_req_ask_drink_count, <<DRINK_ID:?INT>>};
encode(#shout_data{id=ID, count=COUNT}) ->
	{?msg_shout_data, <<ID:?INT, COUNT:?INT>>};
encode(#notify_drink_count{scene_player_count=SCENE_PLAYER_COUNT, cost=COST, shout=SHOUT}) ->
	{?msg_notify_drink_count, <<SCENE_PLAYER_COUNT:?INT, COST:?INT, (net_helper:encode_list(fun(E)-> net_helper:get_encode_binary_data(encode(E)) end, SHOUT))/binary>>};
encode(#req_party_drink{drink_id=DRINK_ID}) ->
	{?msg_req_party_drink, <<DRINK_ID:?INT>>};
encode(#req_calc_player_charm{}) ->
	{?msg_req_calc_player_charm, null};
encode(#notify_calc_player_charm{charm=CHARM}) ->
	{?msg_notify_calc_player_charm, <<CHARM:?INT>>};
encode(#notify_init_party_coin{coin=COIN}) ->
	{?msg_notify_init_party_coin, <<COIN:?INT>>};
encode(#notify_party_score_coin{coin=COIN}) ->
	{?msg_notify_party_score_coin, <<COIN:?INT>>}.


decode(?msg_req_login, Binary) ->
	net_helper:decode([int, string, string, string, string, string, int, int], Binary, [req_login]);
decode(?msg_notify_login_result, Binary) ->
	net_helper:decode([int, string, int], Binary, [notify_login_result]);
decode(?msg_stime, Binary) ->
	net_helper:decode([int, int, int, int, int, int], Binary, [stime]);
decode(?msg_point, Binary) ->
	net_helper:decode([float, float, float], Binary, [point]);
decode(?msg_grid_pos, Binary) ->
	net_helper:decode([int, int, int], Binary, [grid_pos]);
decode(?msg_item_property, Binary) ->
	net_helper:decode([string, int], Binary, [item_property]);
decode(?msg_item, Binary) ->
	net_helper:decode([uint64, int, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}, {array, user_define, fun(Bin)->decode(?msg_item_property, Bin)end}], Binary, [item]);
decode(?msg_visit_log, Binary) ->
	net_helper:decode([string, string, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}], Binary, [visit_log]);
decode(?msg_guest_book, Binary) ->
	net_helper:decode([uint64, string, string, int, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}], Binary, [guest_book]);
decode(?msg_pack_grid, Binary) ->
	net_helper:decode([int, int, {user_define, fun(Bin)->decode(?msg_item, Bin)end}], Binary, [pack_grid]);
decode(?msg_polymorph, Binary) ->
	net_helper:decode([int, int, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}], Binary, [polymorph]);
decode(?msg_player_basic_data, Binary) ->
	net_helper:decode([string, string, int, int, int, int, int, float, int, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}, uint64, int, int, {array, user_define, fun(Bin)->decode(?msg_pack_grid, Bin)end}, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}, string, int, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}, int, int, int, int, int, string, string, string, int, int, string, int, {user_define, fun(Bin)->decode(?msg_polymorph, Bin)end}, int, int, int], Binary, [player_basic_data]);
decode(?msg_player_info, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_player_basic_data, Bin)end}, string], Binary, [player_info]);
decode(?msg_npc_info, Binary) ->
	net_helper:decode([int, int, int, int, int, int, int, string], Binary, [npc_info]);
decode(?msg_npc_map_mapping_info, Binary) ->
	net_helper:decode([int, int, string, {user_define, fun(Bin)->decode(?msg_point, Bin)end}, int, int, string, int], Binary, [npc_map_mapping_info]);
decode(?msg_furniture_position, Binary) ->
	net_helper:decode([int, int, string, int, int, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}], Binary, [furniture_position]);
decode(?msg_furniture_goods_data, Binary) ->
	net_helper:decode([int, int, int, float, int, int], Binary, [furniture_goods_data]);
decode(?msg_setting_info, Binary) ->
	net_helper:decode([string, int], Binary, [setting_info]);
decode(?msg_player_setting, Binary) ->
	net_helper:decode([string, {array, user_define, fun(Bin)->decode(?msg_setting_info, Bin)end}], Binary, [player_setting]);
decode(?msg_house_furniture, Binary) ->
	net_helper:decode([uint64, int, int, int, float, int, int, int, int, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}, {array, user_define, fun(Bin)->decode(?msg_item_property, Bin)end}], Binary, [house_furniture]);
decode(?msg_room_tex, Binary) ->
	net_helper:decode([int, int, string, int], Binary, [room_tex]);
decode(?msg_house_info, Binary) ->
	net_helper:decode([uint64, int, int, {array, user_define, fun(Bin)->decode(?msg_house_furniture, Bin)end}, {array, user_define, fun(Bin)->decode(?msg_room_tex, Bin)end}, string, int, {array, user_define, fun(Bin)->decode(?msg_visit_log, Bin)end}, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}, int, int, string, string, string, int, int], Binary, [house_info]);
decode(?msg_notify_repeat_login, Binary) ->
	net_helper:decode([string], Binary, [notify_repeat_login]);
decode(?msg_req_create_role, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_player_basic_data, Bin)end}, {array, user_define, fun(Bin)->decode(?msg_item, Bin)end}, string], Binary, [req_create_role]);
decode(?msg_notify_create_role_result, Binary) ->
	net_helper:decode([int], Binary, [notify_create_role_result]);
decode(?msg_req_enter_game, Binary) ->
	net_helper:decode([], Binary, [req_enter_game]);
decode(?msg_notify_enter_game, Binary) ->
	net_helper:decode([], Binary, [notify_enter_game]);
decode(?msg_notify_body_data, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_pack_grid, Bin)end}], Binary, [notify_body_data]);
decode(?msg_client_ready_for_pop_msg, Binary) ->
	net_helper:decode([], Binary, [client_ready_for_pop_msg]);
decode(?msg_pair_int, Binary) ->
	net_helper:decode([int, int], Binary, [pair_int]);
decode(?msg_req_enter_player_house, Binary) ->
	net_helper:decode([int, string], Binary, [req_enter_player_house]);
decode(?msg_notify_enter_player_house, Binary) ->
	net_helper:decode([int, {user_define, fun(Bin)->decode(?msg_house_info, Bin)end}, {user_define, fun(Bin)->decode(?msg_point, Bin)end}], Binary, [notify_enter_player_house]);
decode(?msg_req_scene_copy_list, Binary) ->
	net_helper:decode([int], Binary, [req_scene_copy_list]);
decode(?msg_notify_scene_copy_list, Binary) ->
	net_helper:decode([int, {array, int}], Binary, [notify_scene_copy_list]);
decode(?msg_req_enter_common_scene, Binary) ->
	net_helper:decode([int, int], Binary, [req_enter_common_scene]);
decode(?msg_notify_enter_common_scene, Binary) ->
	net_helper:decode([int, int, {user_define, fun(Bin)->decode(?msg_point, Bin)end}], Binary, [notify_enter_common_scene]);
decode(?msg_req_kick_guest, Binary) ->
	net_helper:decode([string], Binary, [req_kick_guest]);
decode(?msg_notify_other_player_data, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_player_info, Bin)end}, {user_define, fun(Bin)->decode(?msg_point, Bin)end}, {user_define, fun(Bin)->decode(?msg_point, Bin)end}, int], Binary, [notify_other_player_data]);
decode(?msg_notify_other_player_info, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_player_info, Bin)end}], Binary, [notify_other_player_info]);
decode(?msg_req_other_player_info, Binary) ->
	net_helper:decode([string], Binary, [req_other_player_info]);
decode(?msg_notify_player_leave_scene, Binary) ->
	net_helper:decode([string], Binary, [notify_player_leave_scene]);
decode(?msg_req_logout, Binary) ->
	net_helper:decode([], Binary, [req_logout]);
decode(?msg_notify_player_data, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_player_basic_data, Bin)end}], Binary, [notify_player_data]);
decode(?msg_req_start_walk, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_point, Bin)end}, {user_define, fun(Bin)->decode(?msg_point, Bin)end}], Binary, [req_start_walk]);
decode(?msg_notify_start_walk, Binary) ->
	net_helper:decode([string, {user_define, fun(Bin)->decode(?msg_point, Bin)end}, {user_define, fun(Bin)->decode(?msg_point, Bin)end}], Binary, [notify_start_walk]);
decode(?msg_req_stop_walk, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_point, Bin)end}], Binary, [req_stop_walk]);
decode(?msg_notify_stop_walk, Binary) ->
	net_helper:decode([string, {user_define, fun(Bin)->decode(?msg_point, Bin)end}], Binary, [notify_stop_walk]);
decode(?msg_req_sync_walk_type, Binary) ->
	net_helper:decode([int], Binary, [req_sync_walk_type]);
decode(?msg_notify_sync_walk_type, Binary) ->
	net_helper:decode([string, int], Binary, [notify_sync_walk_type]);
decode(?msg_req_sync_position, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_point, Bin)end}], Binary, [req_sync_position]);
decode(?msg_req_walk_for_use_furniture, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_point, Bin)end}, {user_define, fun(Bin)->decode(?msg_point, Bin)end}, uint64, int, int, int], Binary, [req_walk_for_use_furniture]);
decode(?msg_player_basic_information, Binary) ->
	net_helper:decode([string, string, string, int, int, int], Binary, [player_basic_information]);
decode(?msg_friend_item, Binary) ->
	net_helper:decode([string, uint64, int, int, int], Binary, [friend_item]);
decode(?msg_req_friend_list, Binary) ->
	net_helper:decode([], Binary, [req_friend_list]);
decode(?msg_notify_player_friend_list, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_friend_item, Bin)end}], Binary, [notify_player_friend_list]);
decode(?msg_req_invite_list, Binary) ->
	net_helper:decode([], Binary, [req_invite_list]);
decode(?msg_notify_invite_list, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_friend_item, Bin)end}], Binary, [notify_invite_list]);
decode(?msg_req_chat_around, Binary) ->
	net_helper:decode([string], Binary, [req_chat_around]);
decode(?msg_notify_chat_around, Binary) ->
	net_helper:decode([string, string, string], Binary, [notify_chat_around]);
decode(?msg_req_chat_tell, Binary) ->
	net_helper:decode([string, string], Binary, [req_chat_tell]);
decode(?msg_notify_chat_tell, Binary) ->
	net_helper:decode([string, string, string], Binary, [notify_chat_tell]);
decode(?msg_req_chat_world, Binary) ->
	net_helper:decode([string], Binary, [req_chat_world]);
decode(?msg_notify_chat_world, Binary) ->
	net_helper:decode([string, string, string], Binary, [notify_chat_world]);
decode(?msg_notify_house_data, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_house_info, Bin)end}], Binary, [notify_house_data]);
decode(?msg_furniture_place_info, Binary) ->
	net_helper:decode([uint64, int, int, float, int, int], Binary, [furniture_place_info]);
decode(?msg_req_change_furnitures, Binary) ->
	net_helper:decode([{array, uint64}, {array, user_define, fun(Bin)->decode(?msg_furniture_place_info, Bin)end}, {array, user_define, fun(Bin)->decode(?msg_furniture_place_info, Bin)end}, {array, user_define, fun(Bin)->decode(?msg_furniture_goods_data, Bin)end}], Binary, [req_change_furnitures]);
decode(?msg_notify_change_furnitures_fail, Binary) ->
	net_helper:decode([int, {array, uint64}], Binary, [notify_change_furnitures_fail]);
decode(?msg_notify_change_furnitures, Binary) ->
	net_helper:decode([{array, uint64}, {array, user_define, fun(Bin)->decode(?msg_house_furniture, Bin)end}, {array, user_define, fun(Bin)->decode(?msg_house_furniture, Bin)end}, {array, user_define, fun(Bin)->decode(?msg_pack_grid, Bin)end}, {array, uint64}, int], Binary, [notify_change_furnitures]);
decode(?msg_req_start_edit_house, Binary) ->
	net_helper:decode([], Binary, [req_start_edit_house]);
decode(?msg_notify_start_edit_house, Binary) ->
	net_helper:decode([int], Binary, [notify_start_edit_house]);
decode(?msg_req_end_edit_house, Binary) ->
	net_helper:decode([], Binary, [req_end_edit_house]);
decode(?msg_notify_end_edit_house, Binary) ->
	net_helper:decode([], Binary, [notify_end_edit_house]);
decode(?msg_req_set_house_welcome_words, Binary) ->
	net_helper:decode([string], Binary, [req_set_house_welcome_words]);
decode(?msg_notify_set_house_welcome_words, Binary) ->
	net_helper:decode([int], Binary, [notify_set_house_welcome_words]);
decode(?msg_req_set_house_permission, Binary) ->
	net_helper:decode([int, int], Binary, [req_set_house_permission]);
decode(?msg_notify_set_house_permission, Binary) ->
	net_helper:decode([int], Binary, [notify_set_house_permission]);
decode(?msg_req_clear_house_log, Binary) ->
	net_helper:decode([], Binary, [req_clear_house_log]);
decode(?msg_notify_clear_house_log, Binary) ->
	net_helper:decode([int], Binary, [notify_clear_house_log]);
decode(?msg_notify_start_use_furniture, Binary) ->
	net_helper:decode([string, int, uint64, int, {user_define, fun(Bin)->decode(?msg_point, Bin)end}], Binary, [notify_start_use_furniture]);
decode(?msg_req_stop_use_furniture, Binary) ->
	net_helper:decode([], Binary, [req_stop_use_furniture]);
decode(?msg_notify_stop_use_furniture, Binary) ->
	net_helper:decode([string, int, uint64], Binary, [notify_stop_use_furniture]);
decode(?msg_notify_change_furniture_status, Binary) ->
	net_helper:decode([string, uint64, int, int], Binary, [notify_change_furniture_status]);
decode(?msg_req_swap_item, Binary) ->
	net_helper:decode([int, int, int], Binary, [req_swap_item]);
decode(?msg_req_use_item, Binary) ->
	net_helper:decode([uint64, {array, string}], Binary, [req_use_item]);
decode(?msg_notify_use_item_result, Binary) ->
	net_helper:decode([uint64, int, int], Binary, [notify_use_item_result]);
decode(?msg_req_move_item, Binary) ->
	net_helper:decode([int, int, int, int], Binary, [req_move_item]);
decode(?msg_req_delete_item, Binary) ->
	net_helper:decode([int], Binary, [req_delete_item]);
decode(?msg_req_split_item, Binary) ->
	net_helper:decode([int, int, int, int], Binary, [req_split_item]);
decode(?msg_req_resize_player_pack, Binary) ->
	net_helper:decode([], Binary, [req_resize_player_pack]);
decode(?msg_req_extend_aging_item, Binary) ->
	net_helper:decode([uint64], Binary, [req_extend_aging_item]);
decode(?msg_notify_extend_aging_item, Binary) ->
	net_helper:decode([], Binary, [notify_extend_aging_item]);
decode(?msg_notiy_use_item_by_scene, Binary) ->
	net_helper:decode([int, uint64, int], Binary, [notiy_use_item_by_scene]);
decode(?msg_notify_sys_msg, Binary) ->
	net_helper:decode([int, {array, string}], Binary, [notify_sys_msg]);
decode(?msg_notify_sys_broadcast, Binary) ->
	net_helper:decode([uint64, int, string, int, int, int, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}], Binary, [notify_sys_broadcast]);
decode(?msg_req_fixed_broadcast, Binary) ->
	net_helper:decode([int], Binary, [req_fixed_broadcast]);
decode(?msg_notify_del_broadcast, Binary) ->
	net_helper:decode([int, uint64], Binary, [notify_del_broadcast]);
decode(?msg_notify_gm_permission, Binary) ->
	net_helper:decode([string, int, int, int], Binary, [notify_gm_permission]);
decode(?msg_req_gm_command, Binary) ->
	net_helper:decode([string, {array, string}], Binary, [req_gm_command]);
decode(?msg_notify_npc_close_dialog, Binary) ->
	net_helper:decode([], Binary, [notify_npc_close_dialog]);
decode(?msg_req_npc_command, Binary) ->
	net_helper:decode([int, string], Binary, [req_npc_command]);
decode(?msg_button, Binary) ->
	net_helper:decode([string, string], Binary, [button]);
decode(?msg_notify_npc_open_dialog, Binary) ->
	net_helper:decode([int, string, {array, user_define, fun(Bin)->decode(?msg_button, Bin)end}], Binary, [notify_npc_open_dialog]);
decode(?msg_req_employ_waiter_data, Binary) ->
	net_helper:decode([uint64], Binary, [req_employ_waiter_data]);
decode(?msg_req_up_waiter_data, Binary) ->
	net_helper:decode([uint64], Binary, [req_up_waiter_data]);
decode(?msg_req_query_waiter_id, Binary) ->
	net_helper:decode([string], Binary, [req_query_waiter_id]);
decode(?msg_notify_query_waiter_id, Binary) ->
	net_helper:decode([uint64], Binary, [notify_query_waiter_id]);
decode(?msg_waiter_info, Binary) ->
	net_helper:decode([int, uint64], Binary, [waiter_info]);
decode(?msg_notify_employ_state, Binary) ->
	net_helper:decode([uint64, {array, user_define, fun(Bin)->decode(?msg_waiter_info, Bin)end}], Binary, [notify_employ_state]);
decode(?msg_req_player_basic_data, Binary) ->
	net_helper:decode([], Binary, [req_player_basic_data]);
decode(?msg_notify_player_basic_data, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_player_basic_data, Bin)end}], Binary, [notify_player_basic_data]);
decode(?msg_req_start_body_action, Binary) ->
	net_helper:decode([string, string], Binary, [req_start_body_action]);
decode(?msg_notify_start_body_action, Binary) ->
	net_helper:decode([string, string, string], Binary, [notify_start_body_action]);
decode(?msg_req_play_animation, Binary) ->
	net_helper:decode([string, int, string, string], Binary, [req_play_animation]);
decode(?msg_notify_play_animation, Binary) ->
	net_helper:decode([string, string, int, string, string], Binary, [notify_play_animation]);
decode(?msg_req_end_body_action, Binary) ->
	net_helper:decode([], Binary, [req_end_body_action]);
decode(?msg_notify_end_body_action, Binary) ->
	net_helper:decode([string], Binary, [notify_end_body_action]);
decode(?msg_req_sync_body_state, Binary) ->
	net_helper:decode([int], Binary, [req_sync_body_state]);
decode(?msg_notify_other_body_state, Binary) ->
	net_helper:decode([string, int], Binary, [notify_other_body_state]);
decode(?msg_req_start_change_looks, Binary) ->
	net_helper:decode([], Binary, [req_start_change_looks]);
decode(?msg_notify_start_change_looks, Binary) ->
	net_helper:decode([int], Binary, [notify_start_change_looks]);
decode(?msg_req_cancel_change_looks, Binary) ->
	net_helper:decode([], Binary, [req_cancel_change_looks]);
decode(?msg_req_end_change_looks, Binary) ->
	net_helper:decode([int, int, int, int, int], Binary, [req_end_change_looks]);
decode(?msg_notify_change_looks, Binary) ->
	net_helper:decode([string, int, int, int, int, int], Binary, [notify_change_looks]);
decode(?msg_notify_end_change_looks, Binary) ->
	net_helper:decode([], Binary, [notify_end_change_looks]);
decode(?msg_req_start_change_dress, Binary) ->
	net_helper:decode([], Binary, [req_start_change_dress]);
decode(?msg_notify_start_change_dress, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_player_basic_data, Bin)end}, {user_define, fun(Bin)->decode(?msg_player_basic_data, Bin)end}], Binary, [notify_start_change_dress]);
decode(?msg_req_change_dress, Binary) ->
	net_helper:decode([int, {array, int}, {array, int}, {array, user_define, fun(Bin)->decode(?msg_item, Bin)end}, {array, uint64}], Binary, [req_change_dress]);
decode(?msg_notify_change_dress, Binary) ->
	net_helper:decode([int, {array, user_define, fun(Bin)->decode(?msg_item, Bin)end}, {array, user_define, fun(Bin)->decode(?msg_pack_grid, Bin)end}], Binary, [notify_change_dress]);
decode(?msg_notify_around_change_dress, Binary) ->
	net_helper:decode([string, {array, user_define, fun(Bin)->decode(?msg_pack_grid, Bin)end}], Binary, [notify_around_change_dress]);
decode(?msg_req_invite_someone, Binary) ->
	net_helper:decode([{array, string}, int], Binary, [req_invite_someone]);
decode(?msg_notify_invitation, Binary) ->
	net_helper:decode([string, string, int], Binary, [notify_invitation]);
decode(?msg_req_agree_invitation, Binary) ->
	net_helper:decode([string, int], Binary, [req_agree_invitation]);
decode(?msg_goods_atom, Binary) ->
	net_helper:decode([int, int], Binary, [goods_atom]);
decode(?msg_req_buy_sys_shop_goods, Binary) ->
	net_helper:decode([int, int], Binary, [req_buy_sys_shop_goods]);
decode(?msg_notify_buy_sys_shop_goods, Binary) ->
	net_helper:decode([], Binary, [notify_buy_sys_shop_goods]);
decode(?msg_req_mutli_buy_sys_shop_goods, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_goods_atom, Bin)end}], Binary, [req_mutli_buy_sys_shop_goods]);
decode(?msg_flag_info, Binary) ->
	net_helper:decode([string, int, int], Binary, [flag_info]);
decode(?msg_task_info, Binary) ->
	net_helper:decode([uint64, int, int, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}, {array, user_define, fun(Bin)->decode(?msg_flag_info, Bin)end}], Binary, [task_info]);
decode(?msg_notify_task_flag, Binary) ->
	net_helper:decode([uint64, {array, user_define, fun(Bin)->decode(?msg_flag_info, Bin)end}], Binary, [notify_task_flag]);
decode(?msg_notify_task_list, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_task_info, Bin)end}], Binary, [notify_task_list]);
decode(?msg_notify_add_task, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_task_info, Bin)end}], Binary, [notify_add_task]);
decode(?msg_notify_dec_task, Binary) ->
	net_helper:decode([{array, uint64}], Binary, [notify_dec_task]);
decode(?msg_notify_complete_task, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_task_info, Bin)end}], Binary, [notify_complete_task]);
decode(?msg_notify_reward_task, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_task_info, Bin)end}], Binary, [notify_reward_task]);
decode(?msg_req_get_task_reward, Binary) ->
	net_helper:decode([uint64, int], Binary, [req_get_task_reward]);
decode(?msg_notify_get_task_reward, Binary) ->
	net_helper:decode([uint64, int], Binary, [notify_get_task_reward]);
decode(?msg_req_change_task, Binary) ->
	net_helper:decode([uint64, int], Binary, [req_change_task]);
decode(?msg_notify_change_task, Binary) ->
	net_helper:decode([uint64, {user_define, fun(Bin)->decode(?msg_task_info, Bin)end}], Binary, [notify_change_task]);
decode(?msg_req_immediate_complete, Binary) ->
	net_helper:decode([uint64, int], Binary, [req_immediate_complete]);
decode(?msg_req_move_camera, Binary) ->
	net_helper:decode([], Binary, [req_move_camera]);
decode(?msg_req_move_player, Binary) ->
	net_helper:decode([], Binary, [req_move_player]);
decode(?msg_req_close_windows, Binary) ->
	net_helper:decode([int], Binary, [req_close_windows]);
decode(?msg_ring_task_atom, Binary) ->
	net_helper:decode([int64, int, int, int, int, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}, int, int], Binary, [ring_task_atom]);
decode(?msg_notify_add_ring_task, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_ring_task_atom, Bin)end}], Binary, [notify_add_ring_task]);
decode(?msg_notify_show_ring_task, Binary) ->
	net_helper:decode([], Binary, [notify_show_ring_task]);
decode(?msg_notify_delete_ring_task, Binary) ->
	net_helper:decode([int64], Binary, [notify_delete_ring_task]);
decode(?msg_req_give_up_ring_task, Binary) ->
	net_helper:decode([int64], Binary, [req_give_up_ring_task]);
decode(?msg_req_stop_ring_task, Binary) ->
	net_helper:decode([int64], Binary, [req_stop_ring_task]);
decode(?msg_notify_stop_ring_task, Binary) ->
	net_helper:decode([int64, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}], Binary, [notify_stop_ring_task]);
decode(?msg_req_immediate_complete_ring_task, Binary) ->
	net_helper:decode([int64], Binary, [req_immediate_complete_ring_task]);
decode(?msg_notify_complete_ring_task, Binary) ->
	net_helper:decode([int64, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}], Binary, [notify_complete_ring_task]);
decode(?msg_req_view_ring_task, Binary) ->
	net_helper:decode([int64], Binary, [req_view_ring_task]);
decode(?msg_notify_view_ring_task, Binary) ->
	net_helper:decode([int], Binary, [notify_view_ring_task]);
decode(?msg_req_ring_task_target, Binary) ->
	net_helper:decode([int64], Binary, [req_ring_task_target]);
decode(?msg_notify_ring_task_target, Binary) ->
	net_helper:decode([{array, int}], Binary, [notify_ring_task_target]);
decode(?msg_req_mind_quiz_count, Binary) ->
	net_helper:decode([], Binary, [req_mind_quiz_count]);
decode(?msg_notify_mind_quiz_count, Binary) ->
	net_helper:decode([int, int], Binary, [notify_mind_quiz_count]);
decode(?msg_req_start_mind_quiz, Binary) ->
	net_helper:decode([], Binary, [req_start_mind_quiz]);
decode(?msg_notify_start_mind_quiz, Binary) ->
	net_helper:decode([int], Binary, [notify_start_mind_quiz]);
decode(?msg_req_mind_quiz_reward, Binary) ->
	net_helper:decode([int], Binary, [req_mind_quiz_reward]);
decode(?msg_notify_mind_quiz_reward, Binary) ->
	net_helper:decode([], Binary, [notify_mind_quiz_reward]);
decode(?msg_req_recharge_love_coin, Binary) ->
	net_helper:decode([int], Binary, [req_recharge_love_coin]);
decode(?msg_notify_recharge_love_coin, Binary) ->
	net_helper:decode([int], Binary, [notify_recharge_love_coin]);
decode(?msg_notify_init_love_coin, Binary) ->
	net_helper:decode([int], Binary, [notify_init_love_coin]);
decode(?msg_notify_love_coin, Binary) ->
	net_helper:decode([int], Binary, [notify_love_coin]);
decode(?msg_notify_open_recharge_ui, Binary) ->
	net_helper:decode([], Binary, [notify_open_recharge_ui]);
decode(?msg_notify_open_yy_recharge_ui, Binary) ->
	net_helper:decode([], Binary, [notify_open_yy_recharge_ui]);
decode(?msg_req_open_ui, Binary) ->
	net_helper:decode([int], Binary, [req_open_ui]);
decode(?msg_notify_open_ui, Binary) ->
	net_helper:decode([int], Binary, [notify_open_ui]);
decode(?msg_req_sys_time, Binary) ->
	net_helper:decode([], Binary, [req_sys_time]);
decode(?msg_notify_sys_time, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_stime, Bin)end}], Binary, [notify_sys_time]);
decode(?msg_notify_wallow_time, Binary) ->
	net_helper:decode([int], Binary, [notify_wallow_time]);
decode(?msg_notify_player_health_status, Binary) ->
	net_helper:decode([int], Binary, [notify_player_health_status]);
decode(?msg_notify_disease_special_event, Binary) ->
	net_helper:decode([int], Binary, [notify_disease_special_event]);
decode(?msg_notify_show_picture, Binary) ->
	net_helper:decode([int], Binary, [notify_show_picture]);
decode(?msg_req_is_active_game, Binary) ->
	net_helper:decode([int], Binary, [req_is_active_game]);
decode(?msg_notify_active_game_result, Binary) ->
	net_helper:decode([int], Binary, [notify_active_game_result]);
decode(?msg_req_create_party, Binary) ->
	net_helper:decode([uint64, string, string, int, string, string, {array, int}, {array, int}], Binary, [req_create_party]);
decode(?msg_notify_create_party_result, Binary) ->
	net_helper:decode([int], Binary, [notify_create_party_result]);
decode(?msg_req_edit_party, Binary) ->
	net_helper:decode([uint64, int, string, string], Binary, [req_edit_party]);
decode(?msg_notify_edit_party_result, Binary) ->
	net_helper:decode([int], Binary, [notify_edit_party_result]);
decode(?msg_req_delete_party, Binary) ->
	net_helper:decode([uint64], Binary, [req_delete_party]);
decode(?msg_notify_delete_party_result, Binary) ->
	net_helper:decode([int], Binary, [notify_delete_party_result]);
decode(?msg_notify_private_party_need_item, Binary) ->
	net_helper:decode([int], Binary, [notify_private_party_need_item]);
decode(?msg_req_get_party_list, Binary) ->
	net_helper:decode([int, int], Binary, [req_get_party_list]);
decode(?msg_party_data, Binary) ->
	net_helper:decode([uint64, string, string, string, int, string, string, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}, int, int, int, int, int], Binary, [party_data]);
decode(?msg_notify_party_list, Binary) ->
	net_helper:decode([int, {array, user_define, fun(Bin)->decode(?msg_party_data, Bin)end}, {array, user_define, fun(Bin)->decode(?msg_party_data, Bin)end}], Binary, [notify_party_list]);
decode(?msg_req_get_my_party_info, Binary) ->
	net_helper:decode([uint64], Binary, [req_get_my_party_info]);
decode(?msg_notify_my_party_info, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_party_data, Bin)end}, int], Binary, [notify_my_party_info]);
decode(?msg_notify_start_party_exp_timer, Binary) ->
	net_helper:decode([int, int, int], Binary, [notify_start_party_exp_timer]);
decode(?msg_notify_stop_party_exp_timer, Binary) ->
	net_helper:decode([], Binary, [notify_stop_party_exp_timer]);
decode(?msg_req_add_party_score, Binary) ->
	net_helper:decode([], Binary, [req_add_party_score]);
decode(?msg_notify_party_score, Binary) ->
	net_helper:decode([int, int, int], Binary, [notify_party_score]);
decode(?msg_notify_add_party_score, Binary) ->
	net_helper:decode([int, int, string, string, string, string], Binary, [notify_add_party_score]);
decode(?msg_notify_party_gain, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_pair_int, Bin)end}, int, int], Binary, [notify_party_gain]);
decode(?msg_notify_party_exp_buffs, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_pair_int, Bin)end}, {array, int}, int], Binary, [notify_party_exp_buffs]);
decode(?msg_notify_party_items, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_pack_grid, Bin)end}], Binary, [notify_party_items]);
decode(?msg_notify_update_party_items, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_pack_grid, Bin)end}], Binary, [notify_update_party_items]);
decode(?msg_notify_party_stop, Binary) ->
	net_helper:decode([], Binary, [notify_party_stop]);
decode(?msg_req_party_food_eat, Binary) ->
	net_helper:decode([uint64], Binary, [req_party_food_eat]);
decode(?msg_notify_party_food_eat_count, Binary) ->
	net_helper:decode([int], Binary, [notify_party_food_eat_count]);
decode(?msg_notify_party_food_ids, Binary) ->
	net_helper:decode([{array, int}], Binary, [notify_party_food_ids]);
decode(?msg_req_equip_off, Binary) ->
	net_helper:decode([uint64], Binary, [req_equip_off]);
decode(?msg_notify_equip_off, Binary) ->
	net_helper:decode([string, int], Binary, [notify_equip_off]);
decode(?msg_req_equip_on, Binary) ->
	net_helper:decode([uint64], Binary, [req_equip_on]);
decode(?msg_notify_equip_on, Binary) ->
	net_helper:decode([string, int, {user_define, fun(Bin)->decode(?msg_pack_grid, Bin)end}], Binary, [notify_equip_on]);
decode(?msg_notify_lover_package, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_pack_grid, Bin)end}], Binary, [notify_lover_package]);
decode(?msg_notify_lover_diamond, Binary) ->
	net_helper:decode([int], Binary, [notify_lover_diamond]);
decode(?msg_req_delete_lover_item, Binary) ->
	net_helper:decode([{array, uint64}], Binary, [req_delete_lover_item]);
decode(?msg_notify_add_lover_items, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_pack_grid, Bin)end}], Binary, [notify_add_lover_items]);
decode(?msg_pair_item_count, Binary) ->
	net_helper:decode([uint64, int], Binary, [pair_item_count]);
decode(?msg_notify_update_items_count, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_pair_item_count, Bin)end}], Binary, [notify_update_items_count]);
decode(?msg_req_lock_lover_item, Binary) ->
	net_helper:decode([uint64], Binary, [req_lock_lover_item]);
decode(?msg_req_unlock_lover_item, Binary) ->
	net_helper:decode([uint64], Binary, [req_unlock_lover_item]);
decode(?msg_notify_lock_lover_item, Binary) ->
	net_helper:decode([uint64], Binary, [notify_lock_lover_item]);
decode(?msg_notify_unlock_lover_item, Binary) ->
	net_helper:decode([uint64], Binary, [notify_unlock_lover_item]);
decode(?msg_req_house_guest_book, Binary) ->
	net_helper:decode([uint64], Binary, [req_house_guest_book]);
decode(?msg_notify_house_guest_book, Binary) ->
	net_helper:decode([string, string, {array, user_define, fun(Bin)->decode(?msg_guest_book, Bin)end}], Binary, [notify_house_guest_book]);
decode(?msg_req_house_visit_log_add, Binary) ->
	net_helper:decode([string, string, string], Binary, [req_house_visit_log_add]);
decode(?msg_notify_house_visit_log_add, Binary) ->
	net_helper:decode([], Binary, [notify_house_visit_log_add]);
decode(?msg_req_house_visit_log, Binary) ->
	net_helper:decode([], Binary, [req_house_visit_log]);
decode(?msg_notify_house_visit_log, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_visit_log, Bin)end}], Binary, [notify_house_visit_log]);
decode(?msg_req_guest_book_delete, Binary) ->
	net_helper:decode([string, uint64], Binary, [req_guest_book_delete]);
decode(?msg_notify_guest_book_delete, Binary) ->
	net_helper:decode([int, uint64], Binary, [notify_guest_book_delete]);
decode(?msg_req_guest_book_add, Binary) ->
	net_helper:decode([string, string, string, int], Binary, [req_guest_book_add]);
decode(?msg_notify_new_guest_book, Binary) ->
	net_helper:decode([], Binary, [notify_new_guest_book]);
decode(?msg_notify_guest_book_add, Binary) ->
	net_helper:decode([int, {user_define, fun(Bin)->decode(?msg_guest_book, Bin)end}], Binary, [notify_guest_book_add]);
decode(?msg_req_guest_book_clear, Binary) ->
	net_helper:decode([string], Binary, [req_guest_book_clear]);
decode(?msg_notify_guest_book_clear, Binary) ->
	net_helper:decode([int], Binary, [notify_guest_book_clear]);
decode(?msg_req_create_flower, Binary) ->
	net_helper:decode([uint64, int], Binary, [req_create_flower]);
decode(?msg_req_get_flower, Binary) ->
	net_helper:decode([uint64], Binary, [req_get_flower]);
decode(?msg_notify_flower_data, Binary) ->
	net_helper:decode([int, uint64, int, int, int, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}], Binary, [notify_flower_data]);
decode(?msg_req_can_water_flower, Binary) ->
	net_helper:decode([uint64, uint64], Binary, [req_can_water_flower]);
decode(?msg_notify_can_water_flower, Binary) ->
	net_helper:decode([int], Binary, [notify_can_water_flower]);
decode(?msg_req_water_flower, Binary) ->
	net_helper:decode([uint64, string, uint64], Binary, [req_water_flower]);
decode(?msg_req_fertilize_flower, Binary) ->
	net_helper:decode([uint64, string, uint64], Binary, [req_fertilize_flower]);
decode(?msg_req_pick_fruit, Binary) ->
	net_helper:decode([uint64], Binary, [req_pick_fruit]);
decode(?msg_req_change_flower, Binary) ->
	net_helper:decode([uint64, int], Binary, [req_change_flower]);
decode(?msg_flower_log, Binary) ->
	net_helper:decode([string, int, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}, int], Binary, [flower_log]);
decode(?msg_req_flower_log, Binary) ->
	net_helper:decode([uint64], Binary, [req_flower_log]);
decode(?msg_notify_flower_log, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_flower_log, Bin)end}], Binary, [notify_flower_log]);
decode(?msg_req_ask_today_water_flower, Binary) ->
	net_helper:decode([uint64], Binary, [req_ask_today_water_flower]);
decode(?msg_notify_today_water_flower, Binary) ->
	net_helper:decode([int], Binary, [notify_today_water_flower]);
decode(?msg_check_in, Binary) ->
	net_helper:decode([string, string, string, int, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}], Binary, [check_in]);
decode(?msg_req_checkin_add, Binary) ->
	net_helper:decode([string, string, int], Binary, [req_checkin_add]);
decode(?msg_notify_checkin_add, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_check_in, Bin)end}], Binary, [notify_checkin_add]);
decode(?msg_notify_new_checkin, Binary) ->
	net_helper:decode([], Binary, [notify_new_checkin]);
decode(?msg_req_last_checkins, Binary) ->
	net_helper:decode([string], Binary, [req_last_checkins]);
decode(?msg_notify_last_checkins, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_check_in, Bin)end}, {user_define, fun(Bin)->decode(?msg_check_in, Bin)end}], Binary, [notify_last_checkins]);
decode(?msg_req_checkin_list, Binary) ->
	net_helper:decode([string, string, int, int], Binary, [req_checkin_list]);
decode(?msg_notify_checkin_list, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_check_in, Bin)end}], Binary, [notify_checkin_list]);
decode(?msg_req_checkin_delete, Binary) ->
	net_helper:decode([string, string], Binary, [req_checkin_delete]);
decode(?msg_notify_checkin_delete, Binary) ->
	net_helper:decode([int, string], Binary, [notify_checkin_delete]);
decode(?msg_req_modify_love_time, Binary) ->
	net_helper:decode([uint64, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}], Binary, [req_modify_love_time]);
decode(?msg_req_get_love_time, Binary) ->
	net_helper:decode([uint64], Binary, [req_get_love_time]);
decode(?msg_notify_love_time, Binary) ->
	net_helper:decode([uint64, int], Binary, [notify_love_time]);
decode(?msg_commemoration_day, Binary) ->
	net_helper:decode([uint64, int, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}, string], Binary, [commemoration_day]);
decode(?msg_req_add_commemoration, Binary) ->
	net_helper:decode([uint64, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}, int, string], Binary, [req_add_commemoration]);
decode(?msg_req_get_commemoration, Binary) ->
	net_helper:decode([uint64, uint64, int], Binary, [req_get_commemoration]);
decode(?msg_notify_commemoration, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_commemoration_day, Bin)end}, int], Binary, [notify_commemoration]);
decode(?msg_req_delete_commemoration, Binary) ->
	net_helper:decode([uint64, uint64], Binary, [req_delete_commemoration]);
decode(?msg_req_modify_commemoration, Binary) ->
	net_helper:decode([uint64, uint64, int, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}, string], Binary, [req_modify_commemoration]);
decode(?msg_req_platform_info, Binary) ->
	net_helper:decode([{array, string}, int], Binary, [req_platform_info]);
decode(?msg_notify_platform_info, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_player_basic_information, Bin)end}, int], Binary, [notify_platform_info]);
decode(?msg_req_daily_visit, Binary) ->
	net_helper:decode([string], Binary, [req_daily_visit]);
decode(?msg_notify_daily_visit, Binary) ->
	net_helper:decode([{array, uint64}], Binary, [notify_daily_visit]);
decode(?msg_req_player_guide, Binary) ->
	net_helper:decode([], Binary, [req_player_guide]);
decode(?msg_notify_player_guide, Binary) ->
	net_helper:decode([{array, int}], Binary, [notify_player_guide]);
decode(?msg_req_update_player_guide, Binary) ->
	net_helper:decode([{array, int}], Binary, [req_update_player_guide]);
decode(?msg_notify_update_player_guide, Binary) ->
	net_helper:decode([int], Binary, [notify_update_player_guide]);
decode(?msg_notify_active_holiday_gift, Binary) ->
	net_helper:decode([], Binary, [notify_active_holiday_gift]);
decode(?msg_req_get_holiday_gift, Binary) ->
	net_helper:decode([], Binary, [req_get_holiday_gift]);
decode(?msg_notify_get_holiday_gift_result, Binary) ->
	net_helper:decode([int, int, int, int], Binary, [notify_get_holiday_gift_result]);
decode(?msg_lottery_item, Binary) ->
	net_helper:decode([int, int], Binary, [lottery_item]);
decode(?msg_notify_use_lottery_item_result, Binary) ->
	net_helper:decode([uint64, {array, user_define, fun(Bin)->decode(?msg_lottery_item, Bin)end}, int], Binary, [notify_use_lottery_item_result]);
decode(?msg_notify_heartbeat, Binary) ->
	net_helper:decode([], Binary, [notify_heartbeat]);
decode(?msg_notify_player_setting, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_player_setting, Bin)end}], Binary, [notify_player_setting]);
decode(?msg_req_player_setting, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_setting_info, Bin)end}], Binary, [req_player_setting]);
decode(?msg_req_update_house_name, Binary) ->
	net_helper:decode([string, string], Binary, [req_update_house_name]);
decode(?msg_notify_update_house_name, Binary) ->
	net_helper:decode([int], Binary, [notify_update_house_name]);
decode(?msg_req_mateup, Binary) ->
	net_helper:decode([string, string], Binary, [req_mateup]);
decode(?msg_notify_mateup_list, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_player_basic_information, Bin)end}], Binary, [notify_mateup_list]);
decode(?msg_notify_mateup_wait, Binary) ->
	net_helper:decode([], Binary, [notify_mateup_wait]);
decode(?msg_notify_mateup_fail, Binary) ->
	net_helper:decode([string], Binary, [notify_mateup_fail]);
decode(?msg_req_mateup_select, Binary) ->
	net_helper:decode([string], Binary, [req_mateup_select]);
decode(?msg_notify_mateup_success, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_player_basic_information, Bin)end}, {user_define, fun(Bin)->decode(?msg_player_basic_information, Bin)end}], Binary, [notify_mateup_success]);
decode(?msg_req_mateup_number, Binary) ->
	net_helper:decode([], Binary, [req_mateup_number]);
decode(?msg_notify_mateup_number, Binary) ->
	net_helper:decode([string, string], Binary, [notify_mateup_number]);
decode(?msg_notify_house_warming, Binary) ->
	net_helper:decode([string, string, string], Binary, [notify_house_warming]);
decode(?msg_client_device_info, Binary) ->
	net_helper:decode([string, string, int, int, string, int, int, string, string, int, int, int, int, int, int, string, string, string, string], Binary, [client_device_info]);
decode(?msg_notify_level_exp, Binary) ->
	net_helper:decode([int, int, int], Binary, [notify_level_exp]);
decode(?msg_notify_hp, Binary) ->
	net_helper:decode([int, int, int, int], Binary, [notify_hp]);
decode(?msg_req_start_recover_hp, Binary) ->
	net_helper:decode([], Binary, [req_start_recover_hp]);
decode(?msg_notify_start_recover_hp, Binary) ->
	net_helper:decode([int, int, int], Binary, [notify_start_recover_hp]);
decode(?msg_req_recover_hp, Binary) ->
	net_helper:decode([], Binary, [req_recover_hp]);
decode(?msg_notify_recover_hp, Binary) ->
	net_helper:decode([], Binary, [notify_recover_hp]);
decode(?msg_req_add_attention, Binary) ->
	net_helper:decode([string, string], Binary, [req_add_attention]);
decode(?msg_notify_add_attention, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_friend_item, Bin)end}], Binary, [notify_add_attention]);
decode(?msg_req_cancel_attention, Binary) ->
	net_helper:decode([string], Binary, [req_cancel_attention]);
decode(?msg_notify_cancel_attention, Binary) ->
	net_helper:decode([string], Binary, [notify_cancel_attention]);
decode(?msg_req_get_attention_list, Binary) ->
	net_helper:decode([], Binary, [req_get_attention_list]);
decode(?msg_notify_attention_list, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_friend_item, Bin)end}], Binary, [notify_attention_list]);
decode(?msg_req_opposite_sex_photos, Binary) ->
	net_helper:decode([], Binary, [req_opposite_sex_photos]);
decode(?msg_notify_opposite_sex_photos, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_player_basic_information, Bin)end}], Binary, [notify_opposite_sex_photos]);
decode(?msg_gift_info, Binary) ->
	net_helper:decode([uint64, string, string, int, {user_define, fun(Bin)->decode(?msg_item, Bin)end}, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}], Binary, [gift_info]);
decode(?msg_house_gift_info, Binary) ->
	net_helper:decode([uint64, int, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}], Binary, [house_gift_info]);
decode(?msg_req_send_gift, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_gift_info, Bin)end}], Binary, [req_send_gift]);
decode(?msg_notify_send_gift, Binary) ->
	net_helper:decode([int], Binary, [notify_send_gift]);
decode(?msg_req_house_gift_box_list, Binary) ->
	net_helper:decode([string], Binary, [req_house_gift_box_list]);
decode(?msg_notify_house_gift_box_list, Binary) ->
	net_helper:decode([string, string, {array, user_define, fun(Bin)->decode(?msg_house_gift_info, Bin)end}, {array, user_define, fun(Bin)->decode(?msg_house_gift_info, Bin)end}], Binary, [notify_house_gift_box_list]);
decode(?msg_notify_add_house_gift_box, Binary) ->
	net_helper:decode([string, {array, user_define, fun(Bin)->decode(?msg_house_gift_info, Bin)end}], Binary, [notify_add_house_gift_box]);
decode(?msg_notify_del_house_gift_box, Binary) ->
	net_helper:decode([string, {array, user_define, fun(Bin)->decode(?msg_house_gift_info, Bin)end}], Binary, [notify_del_house_gift_box]);
decode(?msg_req_receive_gift, Binary) ->
	net_helper:decode([{array, uint64}], Binary, [req_receive_gift]);
decode(?msg_notify_receive_gift, Binary) ->
	net_helper:decode([int], Binary, [notify_receive_gift]);
decode(?msg_req_receive_gift_list, Binary) ->
	net_helper:decode([], Binary, [req_receive_gift_list]);
decode(?msg_notify_receive_gift_list, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_gift_info, Bin)end}], Binary, [notify_receive_gift_list]);
decode(?msg_req_received_gift_list, Binary) ->
	net_helper:decode([], Binary, [req_received_gift_list]);
decode(?msg_notify_received_gift_list, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_gift_info, Bin)end}], Binary, [notify_received_gift_list]);
decode(?msg_req_wish_add, Binary) ->
	net_helper:decode([uint64, int], Binary, [req_wish_add]);
decode(?msg_player_love_wish, Binary) ->
	net_helper:decode([string, uint64, uint64, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}, int], Binary, [player_love_wish]);
decode(?msg_notify_wish_add, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_player_love_wish, Bin)end}], Binary, [notify_wish_add]);
decode(?msg_notify_wish_add_fail, Binary) ->
	net_helper:decode([string], Binary, [notify_wish_add_fail]);
decode(?msg_req_wish_delete, Binary) ->
	net_helper:decode([string, uint64], Binary, [req_wish_delete]);
decode(?msg_notify_wish_delete, Binary) ->
	net_helper:decode([uint64], Binary, [notify_wish_delete]);
decode(?msg_req_wish_list, Binary) ->
	net_helper:decode([string], Binary, [req_wish_list]);
decode(?msg_notify_wish_list, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_player_love_wish, Bin)end}], Binary, [notify_wish_list]);
decode(?msg_player_love_wish_history, Binary) ->
	net_helper:decode([uint64, string, int], Binary, [player_love_wish_history]);
decode(?msg_req_wish_history_list, Binary) ->
	net_helper:decode([string], Binary, [req_wish_history_list]);
decode(?msg_notify_wish_history_list, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_player_love_wish_history, Bin)end}], Binary, [notify_wish_history_list]);
decode(?msg_req_wish_satisfy, Binary) ->
	net_helper:decode([uint64], Binary, [req_wish_satisfy]);
decode(?msg_notify_wish_satisfy_successfully, Binary) ->
	net_helper:decode([uint64], Binary, [notify_wish_satisfy_successfully]);
decode(?msg_notify_wish_satisfy_fail, Binary) ->
	net_helper:decode([uint64, string], Binary, [notify_wish_satisfy_fail]);
decode(?msg_req_complete_share, Binary) ->
	net_helper:decode([int], Binary, [req_complete_share]);
decode(?msg_base_person_info, Binary) ->
	net_helper:decode([int, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}, int, int, int, int, int, int, string, int, string, string, int, string, string], Binary, [base_person_info]);
decode(?msg_req_change_person_info, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_base_person_info, Bin)end}], Binary, [req_change_person_info]);
decode(?msg_req_close_person_info, Binary) ->
	net_helper:decode([], Binary, [req_close_person_info]);
decode(?msg_person_info, Binary) ->
	net_helper:decode([string, string, int, {user_define, fun(Bin)->decode(?msg_base_person_info, Bin)end}], Binary, [person_info]);
decode(?msg_req_person_info, Binary) ->
	net_helper:decode([string], Binary, [req_person_info]);
decode(?msg_notify_person_info, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_person_info, Bin)end}], Binary, [notify_person_info]);
decode(?msg_notify_show_buy_dialog, Binary) ->
	net_helper:decode([string, string, string], Binary, [notify_show_buy_dialog]);
decode(?msg_req_cancel_qq_order, Binary) ->
	net_helper:decode([string], Binary, [req_cancel_qq_order]);
decode(?msg_notify_cancel_order, Binary) ->
	net_helper:decode([], Binary, [notify_cancel_order]);
decode(?msg_req_vip_gift_receive_info, Binary) ->
	net_helper:decode([], Binary, [req_vip_gift_receive_info]);
decode(?msg_notify_vip_gift_receive_info, Binary) ->
	net_helper:decode([int, int], Binary, [notify_vip_gift_receive_info]);
decode(?msg_vip_gift_item, Binary) ->
	net_helper:decode([int, int], Binary, [vip_gift_item]);
decode(?msg_req_receive_vip_beginner_gift, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_vip_gift_item, Bin)end}], Binary, [req_receive_vip_beginner_gift]);
decode(?msg_req_receive_vip_daily_gift, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_vip_gift_item, Bin)end}], Binary, [req_receive_vip_daily_gift]);
decode(?msg_notify_vip_gift, Binary) ->
	net_helper:decode([int], Binary, [notify_vip_gift]);
decode(?msg_login_info, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_stime, Bin)end}, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}], Binary, [login_info]);
decode(?msg_req_give_login_reward, Binary) ->
	net_helper:decode([], Binary, [req_give_login_reward]);
decode(?msg_notify_give_login_reward, Binary) ->
	net_helper:decode([], Binary, [notify_give_login_reward]);
decode(?msg_req_login_list, Binary) ->
	net_helper:decode([], Binary, [req_login_list]);
decode(?msg_notify_login_list, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_login_info, Bin)end}, int], Binary, [notify_login_list]);
decode(?msg_req_offline_notify, Binary) ->
	net_helper:decode([], Binary, [req_offline_notify]);
decode(?msg_notify_offline_notify, Binary) ->
	net_helper:decode([int], Binary, [notify_offline_notify]);
decode(?msg_req_buy_house_right, Binary) ->
	net_helper:decode([int], Binary, [req_buy_house_right]);
decode(?msg_notify_house_right_grade, Binary) ->
	net_helper:decode([int], Binary, [notify_house_right_grade]);
decode(?msg_req_unlock_special_house, Binary) ->
	net_helper:decode([int], Binary, [req_unlock_special_house]);
decode(?msg_notify_unlock_special_house, Binary) ->
	net_helper:decode([int], Binary, [notify_unlock_special_house]);
decode(?msg_req_unlock_special_house_info, Binary) ->
	net_helper:decode([], Binary, [req_unlock_special_house_info]);
decode(?msg_notify_unlock_special_house_info, Binary) ->
	net_helper:decode([{array, int}], Binary, [notify_unlock_special_house_info]);
decode(?msg_special_house_goods, Binary) ->
	net_helper:decode([int, int, int, int], Binary, [special_house_goods]);
decode(?msg_req_special_house_list, Binary) ->
	net_helper:decode([], Binary, [req_special_house_list]);
decode(?msg_notify_special_house_list, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_special_house_goods, Bin)end}], Binary, [notify_special_house_list]);
decode(?msg_notify_buy_special_house_success, Binary) ->
	net_helper:decode([], Binary, [notify_buy_special_house_success]);
decode(?msg_req_self_special_house_list, Binary) ->
	net_helper:decode([], Binary, [req_self_special_house_list]);
decode(?msg_notify_self_special_house_list, Binary) ->
	net_helper:decode([{array, int}], Binary, [notify_self_special_house_list]);
decode(?msg_req_buy_special_house, Binary) ->
	net_helper:decode([int], Binary, [req_buy_special_house]);
decode(?msg_req_move_house, Binary) ->
	net_helper:decode([int], Binary, [req_move_house]);
decode(?msg_notify_move_house_success, Binary) ->
	net_helper:decode([], Binary, [notify_move_house_success]);
decode(?msg_req_get_free_count_for_moving_special_house, Binary) ->
	net_helper:decode([], Binary, [req_get_free_count_for_moving_special_house]);
decode(?msg_notify_get_free_count_for_moving_special_house, Binary) ->
	net_helper:decode([int], Binary, [notify_get_free_count_for_moving_special_house]);
decode(?msg_req_invite_active, Binary) ->
	net_helper:decode([], Binary, [req_invite_active]);
decode(?msg_notify_invite_active, Binary) ->
	net_helper:decode([int, {array, string}], Binary, [notify_invite_active]);
decode(?msg_req_invite_award, Binary) ->
	net_helper:decode([int, int, int, {array, string}], Binary, [req_invite_award]);
decode(?msg_notify_invite_award, Binary) ->
	net_helper:decode([int], Binary, [notify_invite_award]);
decode(?msg_req_open_search_items_ui, Binary) ->
	net_helper:decode([], Binary, [req_open_search_items_ui]);
decode(?msg_notify_open_search_items_ui, Binary) ->
	net_helper:decode([int, int], Binary, [notify_open_search_items_ui]);
decode(?msg_req_search_items, Binary) ->
	net_helper:decode([int, string, string], Binary, [req_search_items]);
decode(?msg_notify_searching_items, Binary) ->
	net_helper:decode([int, string, string, int, int], Binary, [notify_searching_items]);
decode(?msg_req_quick_search_items, Binary) ->
	net_helper:decode([int], Binary, [req_quick_search_items]);
decode(?msg_req_whip, Binary) ->
	net_helper:decode([], Binary, [req_whip]);
decode(?msg_notify_search_items_result, Binary) ->
	net_helper:decode([int, string, string, int, {array, user_define, fun(Bin)->decode(?msg_vip_gift_item, Bin)end}], Binary, [notify_search_items_result]);
decode(?msg_notify_new_self_msgs, Binary) ->
	net_helper:decode([], Binary, [notify_new_self_msgs]);
decode(?msg_hire_msg, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_stime, Bin)end}, int, string, int], Binary, [hire_msg]);
decode(?msg_be_hire_msg, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_stime, Bin)end}, string, int], Binary, [be_hire_msg]);
decode(?msg_be_whip_msg, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_stime, Bin)end}, string], Binary, [be_whip_msg]);
decode(?msg_whip_msg, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_stime, Bin)end}, string, int, int, string], Binary, [whip_msg]);
decode(?msg_req_self_msgs, Binary) ->
	net_helper:decode([], Binary, [req_self_msgs]);
decode(?msg_notify_self_msgs, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_hire_msg, Bin)end}, {array, user_define, fun(Bin)->decode(?msg_be_hire_msg, Bin)end}, {array, user_define, fun(Bin)->decode(?msg_be_whip_msg, Bin)end}, {array, user_define, fun(Bin)->decode(?msg_whip_msg, Bin)end}], Binary, [notify_self_msgs]);
decode(?msg_req_update_search_items, Binary) ->
	net_helper:decode([], Binary, [req_update_search_items]);
decode(?msg_notify_polymorph_result, Binary) ->
	net_helper:decode([string, {user_define, fun(Bin)->decode(?msg_polymorph, Bin)end}, string, string], Binary, [notify_polymorph_result]);
decode(?msg_req_purify_polymorph, Binary) ->
	net_helper:decode([string], Binary, [req_purify_polymorph]);
decode(?msg_req_player_info, Binary) ->
	net_helper:decode([string], Binary, [req_player_info]);
decode(?msg_notify_player_info, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_player_basic_data, Bin)end}], Binary, [notify_player_info]);
decode(?msg_req_produce, Binary) ->
	net_helper:decode([uint64, int, int], Binary, [req_produce]);
decode(?msg_notify_produce_ack, Binary) ->
	net_helper:decode([], Binary, [notify_produce_ack]);
decode(?msg_notify_produce, Binary) ->
	net_helper:decode([int, string, {user_define, fun(Bin)->decode(?msg_item, Bin)end}, {user_define, fun(Bin)->decode(?msg_player_basic_data, Bin)end}], Binary, [notify_produce]);
decode(?msg_notify_produce_level, Binary) ->
	net_helper:decode([int, int], Binary, [notify_produce_level]);
decode(?msg_req_ranking, Binary) ->
	net_helper:decode([int], Binary, [req_ranking]);
decode(?msg_ranking_data, Binary) ->
	net_helper:decode([string, int], Binary, [ranking_data]);
decode(?msg_notify_ranking, Binary) ->
	net_helper:decode([int, int, {array, user_define, fun(Bin)->decode(?msg_ranking_data, Bin)end}], Binary, [notify_ranking]);
decode(?msg_req_score_ranking, Binary) ->
	net_helper:decode([], Binary, [req_score_ranking]);
decode(?msg_notify_score_ranking, Binary) ->
	net_helper:decode([int, {array, user_define, fun(Bin)->decode(?msg_ranking_data, Bin)end}], Binary, [notify_score_ranking]);
decode(?msg_req_set_guest_book_opened, Binary) ->
	net_helper:decode([uint64, int], Binary, [req_set_guest_book_opened]);
decode(?msg_notify_set_guest_book_opened, Binary) ->
	net_helper:decode([uint64, int], Binary, [notify_set_guest_book_opened]);
decode(?msg_req_set_checkin_opened, Binary) ->
	net_helper:decode([string, int], Binary, [req_set_checkin_opened]);
decode(?msg_notify_set_checkin_opened, Binary) ->
	net_helper:decode([string, int], Binary, [notify_set_checkin_opened]);
decode(?msg_crop_event, Binary) ->
	net_helper:decode([int, int, int], Binary, [crop_event]);
decode(?msg_crop_data, Binary) ->
	net_helper:decode([uint64, int, int, {array, int}, {array, int}, {array, user_define, fun(Bin)->decode(?msg_crop_event, Bin)end}], Binary, [crop_data]);
decode(?msg_req_plant_crop, Binary) ->
	net_helper:decode([uint64, uint64], Binary, [req_plant_crop]);
decode(?msg_notify_farm_data, Binary) ->
	net_helper:decode([uint64, {array, user_define, fun(Bin)->decode(?msg_crop_data, Bin)end}, int], Binary, [notify_farm_data]);
decode(?msg_req_crop_event, Binary) ->
	net_helper:decode([uint64, uint64, int, int], Binary, [req_crop_event]);
decode(?msg_req_all_crop_event, Binary) ->
	net_helper:decode([uint64, int], Binary, [req_all_crop_event]);
decode(?msg_req_delete_crop, Binary) ->
	net_helper:decode([uint64], Binary, [req_delete_crop]);
decode(?msg_notify_delete_crop, Binary) ->
	net_helper:decode([uint64, int], Binary, [notify_delete_crop]);
decode(?msg_notify_crop_data, Binary) ->
	net_helper:decode([uint64, int, {user_define, fun(Bin)->decode(?msg_crop_data, Bin)end}, int], Binary, [notify_crop_data]);
decode(?msg_req_pick_crop_fruit, Binary) ->
	net_helper:decode([uint64], Binary, [req_pick_crop_fruit]);
decode(?msg_notify_pick_crop_fruit, Binary) ->
	net_helper:decode([uint64, uint64, int], Binary, [notify_pick_crop_fruit]);
decode(?msg_req_house_max_flowerpot, Binary) ->
	net_helper:decode([], Binary, [req_house_max_flowerpot]);
decode(?msg_notify_house_max_flowerpot, Binary) ->
	net_helper:decode([uint64, int, int], Binary, [notify_house_max_flowerpot]);
decode(?msg_req_add_flowerpot_number, Binary) ->
	net_helper:decode([], Binary, [req_add_flowerpot_number]);
decode(?msg_req_breakup, Binary) ->
	net_helper:decode([int, {array, user_define, fun(Bin)->decode(?msg_item, Bin)end}], Binary, [req_breakup]);
decode(?msg_notify_breakup_ack, Binary) ->
	net_helper:decode([], Binary, [notify_breakup_ack]);
decode(?msg_notify_breakup_error, Binary) ->
	net_helper:decode([], Binary, [notify_breakup_error]);
decode(?msg_req_player_breakup, Binary) ->
	net_helper:decode([], Binary, [req_player_breakup]);
decode(?msg_notify_player_breakup_none, Binary) ->
	net_helper:decode([], Binary, [notify_player_breakup_none]);
decode(?msg_notify_player_breakup, Binary) ->
	net_helper:decode([string, int, {array, int}], Binary, [notify_player_breakup]);
decode(?msg_req_player_breakup_diamond, Binary) ->
	net_helper:decode([], Binary, [req_player_breakup_diamond]);
decode(?msg_notify_player_breakup_diamond, Binary) ->
	net_helper:decode([], Binary, [notify_player_breakup_diamond]);
decode(?msg_notify_player_be_breakuped, Binary) ->
	net_helper:decode([], Binary, [notify_player_be_breakuped]);
decode(?msg_require_item_atom, Binary) ->
	net_helper:decode([int, int, string], Binary, [require_item_atom]);
decode(?msg_reward_item_atom, Binary) ->
	net_helper:decode([int, int], Binary, [reward_item_atom]);
decode(?msg_req_open_post_reward_ui, Binary) ->
	net_helper:decode([], Binary, [req_open_post_reward_ui]);
decode(?msg_notify_open_post_reward_ui, Binary) ->
	net_helper:decode([string, {array, user_define, fun(Bin)->decode(?msg_require_item_atom, Bin)end}, {array, user_define, fun(Bin)->decode(?msg_reward_item_atom, Bin)end}, int, int], Binary, [notify_open_post_reward_ui]);
decode(?msg_req_complete_post_reward, Binary) ->
	net_helper:decode([], Binary, [req_complete_post_reward]);
decode(?msg_notify_complete_post_reward, Binary) ->
	net_helper:decode([int], Binary, [notify_complete_post_reward]);
decode(?msg_notify_active_score_lottery, Binary) ->
	net_helper:decode([], Binary, [notify_active_score_lottery]);
decode(?msg_req_open_score_lottery_ui, Binary) ->
	net_helper:decode([], Binary, [req_open_score_lottery_ui]);
decode(?msg_notify_open_score_lottery_ui, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_lottery_item, Bin)end}, int], Binary, [notify_open_score_lottery_ui]);
decode(?msg_req_score_lottery, Binary) ->
	net_helper:decode([], Binary, [req_score_lottery]);
decode(?msg_notify_score_lottery_result, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_lottery_item, Bin)end}, int, int], Binary, [notify_score_lottery_result]);
decode(?msg_req_refresh_score_lottery_ui, Binary) ->
	net_helper:decode([], Binary, [req_refresh_score_lottery_ui]);
decode(?msg_notify_refresh_score_lottery_ui, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_lottery_item, Bin)end}, int], Binary, [notify_refresh_score_lottery_ui]);
decode(?msg_req_daily_reward_ui, Binary) ->
	net_helper:decode([], Binary, [req_daily_reward_ui]);
decode(?msg_notify_daily_reward_ui, Binary) ->
	net_helper:decode([{array, int}, {array, int}, {array, int}], Binary, [notify_daily_reward_ui]);
decode(?msg_req_daily_reward, Binary) ->
	net_helper:decode([int], Binary, [req_daily_reward]);
decode(?msg_notify_daily_active_can_reward, Binary) ->
	net_helper:decode([], Binary, [notify_daily_active_can_reward]);
decode(?msg_req_close_daily_reward_ui, Binary) ->
	net_helper:decode([], Binary, [req_close_daily_reward_ui]);
decode(?msg_req_immediate_complete_daily_reward, Binary) ->
	net_helper:decode([int], Binary, [req_immediate_complete_daily_reward]);
decode(?msg_req_open_daily_task_ui, Binary) ->
	net_helper:decode([], Binary, [req_open_daily_task_ui]);
decode(?msg_req_close_daily_task_ui, Binary) ->
	net_helper:decode([], Binary, [req_close_daily_task_ui]);
decode(?msg_req_get_buff, Binary) ->
	net_helper:decode([], Binary, [req_get_buff]);
decode(?msg_player_buff_data, Binary) ->
	net_helper:decode([int, int], Binary, [player_buff_data]);
decode(?msg_notify_player_buff, Binary) ->
	net_helper:decode([string, {array, user_define, fun(Bin)->decode(?msg_player_buff_data, Bin)end}], Binary, [notify_player_buff]);
decode(?msg_notify_add_buff, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_player_buff_data, Bin)end}], Binary, [notify_add_buff]);
decode(?msg_pub_account_info, Binary) ->
	net_helper:decode([string, string, int], Binary, [pub_account_info]);
decode(?msg_pub_info, Binary) ->
	net_helper:decode([uint64, {user_define, fun(Bin)->decode(?msg_pub_account_info, Bin)end}, string, int, int, int, int, {array, user_define, fun(Bin)->decode(?msg_pub_account_info, Bin)end}, uint64], Binary, [pub_info]);
decode(?msg_req_pub_list, Binary) ->
	net_helper:decode([int], Binary, [req_pub_list]);
decode(?msg_notify_pub_list, Binary) ->
	net_helper:decode([uint64, int, {array, user_define, fun(Bin)->decode(?msg_pub_info, Bin)end}], Binary, [notify_pub_list]);
decode(?msg_req_leave_pub_channel, Binary) ->
	net_helper:decode([uint64], Binary, [req_leave_pub_channel]);
decode(?msg_req_enter_pub_channel, Binary) ->
	net_helper:decode([uint64], Binary, [req_enter_pub_channel]);
decode(?msg_notify_enter_pub_channel, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_pub_info, Bin)end}, {array, user_define, fun(Bin)->decode(?msg_pub_account_info, Bin)end}], Binary, [notify_enter_pub_channel]);
decode(?msg_req_update_pub_voice_id, Binary) ->
	net_helper:decode([uint64, uint64], Binary, [req_update_pub_voice_id]);
decode(?msg_notify_update_pub_voice_id, Binary) ->
	net_helper:decode([uint64, uint64], Binary, [notify_update_pub_voice_id]);
decode(?msg_req_chat_channel, Binary) ->
	net_helper:decode([uint64, string], Binary, [req_chat_channel]);
decode(?msg_notify_chat_channel, Binary) ->
	net_helper:decode([uint64, string, string, string], Binary, [notify_chat_channel]);
decode(?msg_notify_channel_add_player, Binary) ->
	net_helper:decode([uint64, {user_define, fun(Bin)->decode(?msg_pub_account_info, Bin)end}], Binary, [notify_channel_add_player]);
decode(?msg_notify_channel_del_player, Binary) ->
	net_helper:decode([uint64, string], Binary, [notify_channel_del_player]);
decode(?msg_req_channel_tell, Binary) ->
	net_helper:decode([string, string], Binary, [req_channel_tell]);
decode(?msg_notify_channel_tell, Binary) ->
	net_helper:decode([string, string, string], Binary, [notify_channel_tell]);
decode(?msg_broadcast_kick_pub_player, Binary) ->
	net_helper:decode([string, string], Binary, [broadcast_kick_pub_player]);
decode(?msg_notify_update_pub_player_count, Binary) ->
	net_helper:decode([int, int, int, int], Binary, [notify_update_pub_player_count]);
decode(?msg_req_send_yy_gift, Binary) ->
	net_helper:decode([string, int, int], Binary, [req_send_yy_gift]);
decode(?msg_broadcast_send_yy_gift, Binary) ->
	net_helper:decode([int, int, {user_define, fun(Bin)->decode(?msg_pub_account_info, Bin)end}, {user_define, fun(Bin)->decode(?msg_pub_account_info, Bin)end}], Binary, [broadcast_send_yy_gift]);
decode(?msg_req_kick_channel_player, Binary) ->
	net_helper:decode([string], Binary, [req_kick_channel_player]);
decode(?msg_notify_unlock_furniture_list, Binary) ->
	net_helper:decode([{array, int}], Binary, [notify_unlock_furniture_list]);
decode(?msg_req_unlock_furniture, Binary) ->
	net_helper:decode([int], Binary, [req_unlock_furniture]);
decode(?msg_notify_unlock_furniture, Binary) ->
	net_helper:decode([], Binary, [notify_unlock_furniture]);
decode(?msg_req_exchange, Binary) ->
	net_helper:decode([int], Binary, [req_exchange]);
decode(?msg_notify_exchange, Binary) ->
	net_helper:decode([], Binary, [notify_exchange]);
decode(?msg_notify_friend_intimate, Binary) ->
	net_helper:decode([string, int], Binary, [notify_friend_intimate]);
decode(?msg_req_flower_shake, Binary) ->
	net_helper:decode([uint64, int, int], Binary, [req_flower_shake]);
decode(?msg_req_flower_love_coin_shake, Binary) ->
	net_helper:decode([uint64], Binary, [req_flower_love_coin_shake]);
decode(?msg_notify_flower_shake, Binary) ->
	net_helper:decode([int, int, {array, user_define, fun(Bin)->decode(?msg_lottery_item, Bin)end}, int, int], Binary, [notify_flower_shake]);
decode(?msg_notify_flower_shake_prop_required, Binary) ->
	net_helper:decode([], Binary, [notify_flower_shake_prop_required]);
decode(?msg_req_flower_shaked, Binary) ->
	net_helper:decode([uint64], Binary, [req_flower_shaked]);
decode(?msg_notify_flower_shaked, Binary) ->
	net_helper:decode([int, int, int], Binary, [notify_flower_shaked]);
decode(?msg_notify_flower_love_coin_shaked, Binary) ->
	net_helper:decode([int, int], Binary, [notify_flower_love_coin_shaked]);
decode(?msg_notify_flower_shake_overflow, Binary) ->
	net_helper:decode([int], Binary, [notify_flower_shake_overflow]);
decode(?msg_req_first_payment_return_status, Binary) ->
	net_helper:decode([], Binary, [req_first_payment_return_status]);
decode(?msg_notify_first_payment_return_status, Binary) ->
	net_helper:decode([int], Binary, [notify_first_payment_return_status]);
decode(?msg_req_first_payment_return_reward, Binary) ->
	net_helper:decode([], Binary, [req_first_payment_return_reward]);
decode(?msg_notify_first_payment_return_reward, Binary) ->
	net_helper:decode([int], Binary, [notify_first_payment_return_reward]);
decode(?msg_single_payment_return_item, Binary) ->
	net_helper:decode([int, int], Binary, [single_payment_return_item]);
decode(?msg_req_single_payment_return, Binary) ->
	net_helper:decode([], Binary, [req_single_payment_return]);
decode(?msg_notify_single_payment_return, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_single_payment_return_item, Bin)end}], Binary, [notify_single_payment_return]);
decode(?msg_req_single_payment_return_reward, Binary) ->
	net_helper:decode([int], Binary, [req_single_payment_return_reward]);
decode(?msg_notify_single_payment_return_reward, Binary) ->
	net_helper:decode([int], Binary, [notify_single_payment_return_reward]);
decode(?msg_total_payment_return_item, Binary) ->
	net_helper:decode([int, {array, user_define, fun(Bin)->decode(?msg_lottery_item, Bin)end}, int], Binary, [total_payment_return_item]);
decode(?msg_req_total_payment_return, Binary) ->
	net_helper:decode([], Binary, [req_total_payment_return]);
decode(?msg_notify_total_payment_return, Binary) ->
	net_helper:decode([int, {array, user_define, fun(Bin)->decode(?msg_total_payment_return_item, Bin)end}], Binary, [notify_total_payment_return]);
decode(?msg_req_total_payment_return_reward, Binary) ->
	net_helper:decode([int], Binary, [req_total_payment_return_reward]);
decode(?msg_notify_total_payment_return_reward, Binary) ->
	net_helper:decode([int], Binary, [notify_total_payment_return_reward]);
decode(?msg_req_item_upgrade, Binary) ->
	net_helper:decode([uint64], Binary, [req_item_upgrade]);
decode(?msg_notify_item_upgrade, Binary) ->
	net_helper:decode([uint64, int], Binary, [notify_item_upgrade]);
decode(?msg_req_mutli_item_upgrade, Binary) ->
	net_helper:decode([{array, uint64}], Binary, [req_mutli_item_upgrade]);
decode(?msg_notify_mutli_item_upgrade, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_house_furniture, Bin)end}, int], Binary, [notify_mutli_item_upgrade]);
decode(?msg_notify_make_up_info, Binary) ->
	net_helper:decode([int], Binary, [notify_make_up_info]);
decode(?msg_req_enter_pub_scene, Binary) ->
	net_helper:decode([], Binary, [req_enter_pub_scene]);
decode(?msg_notify_enter_pub_scene, Binary) ->
	net_helper:decode([int, {user_define, fun(Bin)->decode(?msg_pub_info, Bin)end}, {array, user_define, fun(Bin)->decode(?msg_pub_account_info, Bin)end}, {user_define, fun(Bin)->decode(?msg_point, Bin)end}], Binary, [notify_enter_pub_scene]);
decode(?msg_req_get_sprites, Binary) ->
	net_helper:decode([], Binary, [req_get_sprites]);
decode(?msg_req_click_sprite, Binary) ->
	net_helper:decode([int], Binary, [req_click_sprite]);
decode(?msg_sprite, Binary) ->
	net_helper:decode([int, int, int, int], Binary, [sprite]);
decode(?msg_notify_sprite_data, Binary) ->
	net_helper:decode([int, {array, user_define, fun(Bin)->decode(?msg_sprite, Bin)end}], Binary, [notify_sprite_data]);
decode(?msg_notify_del_sprite, Binary) ->
	net_helper:decode([int, int], Binary, [notify_del_sprite]);
decode(?msg_req_click_guest, Binary) ->
	net_helper:decode([int], Binary, [req_click_guest]);
decode(?msg_notify_can_click_guest, Binary) ->
	net_helper:decode([int], Binary, [notify_can_click_guest]);
decode(?msg_notify_sprite_upgrade, Binary) ->
	net_helper:decode([int, int], Binary, [notify_sprite_upgrade]);
decode(?msg_req_unlock_food, Binary) ->
	net_helper:decode([int], Binary, [req_unlock_food]);
decode(?msg_notify_unlock_food, Binary) ->
	net_helper:decode([int], Binary, [notify_unlock_food]);
decode(?msg_req_unlock_food_info, Binary) ->
	net_helper:decode([], Binary, [req_unlock_food_info]);
decode(?msg_notify_unlock_food_info, Binary) ->
	net_helper:decode([{array, int}], Binary, [notify_unlock_food_info]);
decode(?msg_req_expand_food_stock, Binary) ->
	net_helper:decode([int], Binary, [req_expand_food_stock]);
decode(?msg_food_stock_info, Binary) ->
	net_helper:decode([int, int, int, int, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}], Binary, [food_stock_info]);
decode(?msg_notify_expand_food_stock, Binary) ->
	net_helper:decode([int, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}], Binary, [notify_expand_food_stock]);
decode(?msg_notify_settlement_expand_food_stock, Binary) ->
	net_helper:decode([int, int], Binary, [notify_settlement_expand_food_stock]);
decode(?msg_req_food_stock_info, Binary) ->
	net_helper:decode([], Binary, [req_food_stock_info]);
decode(?msg_notify_food_stock_info, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_food_stock_info, Bin)end}], Binary, [notify_food_stock_info]);
decode(?msg_req_cancel_expand_food_stock, Binary) ->
	net_helper:decode([int], Binary, [req_cancel_expand_food_stock]);
decode(?msg_notify_cancel_expand_food_stock, Binary) ->
	net_helper:decode([int], Binary, [notify_cancel_expand_food_stock]);
decode(?msg_req_complete_expand_food_stock, Binary) ->
	net_helper:decode([int, int], Binary, [req_complete_expand_food_stock]);
decode(?msg_notify_complete_expand_food_stock, Binary) ->
	net_helper:decode([int, int], Binary, [notify_complete_expand_food_stock]);
decode(?msg_req_immediately_complete_expand_stock, Binary) ->
	net_helper:decode([int, int], Binary, [req_immediately_complete_expand_stock]);
decode(?msg_notify_immediately_complete_expand_stock, Binary) ->
	net_helper:decode([int, int], Binary, [notify_immediately_complete_expand_stock]);
decode(?msg_req_expand_produce_area, Binary) ->
	net_helper:decode([int], Binary, [req_expand_produce_area]);
decode(?msg_notify_expand_produce_area, Binary) ->
	net_helper:decode([int, int], Binary, [notify_expand_produce_area]);
decode(?msg_req_produce_area, Binary) ->
	net_helper:decode([], Binary, [req_produce_area]);
decode(?msg_notify_produce_area, Binary) ->
	net_helper:decode([int], Binary, [notify_produce_area]);
decode(?msg_req_upgrade_food, Binary) ->
	net_helper:decode([int], Binary, [req_upgrade_food]);
decode(?msg_notify_upgrade_food, Binary) ->
	net_helper:decode([int, int], Binary, [notify_upgrade_food]);
decode(?msg_food_upgrade_info, Binary) ->
	net_helper:decode([int, int], Binary, [food_upgrade_info]);
decode(?msg_req_food_upgrade_info, Binary) ->
	net_helper:decode([], Binary, [req_food_upgrade_info]);
decode(?msg_notify_food_upgrade_info, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_food_upgrade_info, Bin)end}], Binary, [notify_food_upgrade_info]);
decode(?msg_product_atom, Binary) ->
	net_helper:decode([int, int], Binary, [product_atom]);
decode(?msg_req_make_product, Binary) ->
	net_helper:decode([{array, user_define, fun(Bin)->decode(?msg_product_atom, Bin)end}, {user_define, fun(Bin)->decode(?msg_stime, Bin)end}], Binary, [req_make_product]);
decode(?msg_notify_make_product, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_stime, Bin)end}], Binary, [notify_make_product]);
decode(?msg_req_remove_product, Binary) ->
	net_helper:decode([int], Binary, [req_remove_product]);
decode(?msg_notify_remove_product, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_stime, Bin)end}], Binary, [notify_remove_product]);
decode(?msg_req_complete_product, Binary) ->
	net_helper:decode([], Binary, [req_complete_product]);
decode(?msg_notify_complete_product, Binary) ->
	net_helper:decode([], Binary, [notify_complete_product]);
decode(?msg_req_immediately_complete_product, Binary) ->
	net_helper:decode([], Binary, [req_immediately_complete_product]);
decode(?msg_notify_immediately_complete_product, Binary) ->
	net_helper:decode([], Binary, [notify_immediately_complete_product]);
decode(?msg_req_products, Binary) ->
	net_helper:decode([], Binary, [req_products]);
decode(?msg_product_info, Binary) ->
	net_helper:decode([int, int, int], Binary, [product_info]);
decode(?msg_notify_products, Binary) ->
	net_helper:decode([{user_define, fun(Bin)->decode(?msg_stime, Bin)end}, {array, user_define, fun(Bin)->decode(?msg_product_info, Bin)end}], Binary, [notify_products]);
decode(?msg_notify_food_settlement_diamond, Binary) ->
	net_helper:decode([int], Binary, [notify_food_settlement_diamond]);
decode(?msg_notify_reset_temp_diamond, Binary) ->
	net_helper:decode([], Binary, [notify_reset_temp_diamond]);
decode(?msg_req_ask_drink_count, Binary) ->
	net_helper:decode([int], Binary, [req_ask_drink_count]);
decode(?msg_shout_data, Binary) ->
	net_helper:decode([int, int], Binary, [shout_data]);
decode(?msg_notify_drink_count, Binary) ->
	net_helper:decode([int, int, {array, user_define, fun(Bin)->decode(?msg_shout_data, Bin)end}], Binary, [notify_drink_count]);
decode(?msg_req_party_drink, Binary) ->
	net_helper:decode([int], Binary, [req_party_drink]);
decode(?msg_req_calc_player_charm, Binary) ->
	net_helper:decode([], Binary, [req_calc_player_charm]);
decode(?msg_notify_calc_player_charm, Binary) ->
	net_helper:decode([int], Binary, [notify_calc_player_charm]);
decode(?msg_notify_init_party_coin, Binary) ->
	net_helper:decode([int], Binary, [notify_init_party_coin]);
decode(?msg_notify_party_score_coin, Binary) ->
	net_helper:decode([int], Binary, [notify_party_score_coin]).
