%%% @author  linyijie
%%% @copyright (C) 2010, 
%%% @doc
%%%  ��Ϣϵͳ�����Ͷ���: һ���ϵͳ������ͨ������Ϣģ�鴫��һ��ָ����IDֵ���ͻ���
%%%  �ͻ��˸��ݸ�IDֵ,����ģ����Ӧ���ı�, ��ʾ����
%%% @end
%%% Created : 25 Mar 2010 by  <>

-define(err_no_error, 0). % û����
%%---- �������Ķ��� -------------------------------
-define(err_swap_item, 1). % ������Ʒʧ��
-define(err_move_item, 2). % �ƶ���Ʒʧ��
-define(err_cannot_use_item, 3). % ����ʹ����Ʒ
-define(err_dont_place_furniture, 4). % ���ܰڷżҾ�
-define(err_player_count_over, 5). % ���������Ŀ�������� 
-define(err_player_is_editing_house, 6). % �������������(�༭����) 
-define(err_not_at_home, 7). % ��Ҳ��ڼ�
-define(err_not_same_scene, 8). % ��Ҳ���ͬһ������ 
-define(err_furniture_not_exist, 9). % �Ҿ߲�����
-define(err_bag_full, 10). % ��������
-define(err_not_exist_item_temp_id, 11). % ��Ʒ��ģ��ID������
-define(err_cannot_dress, 12). % ���ܰѷ�װ���ڸ�λ��
-define(err_grid_lock, 13).    % ������ס��
-define(err_grid_empty, 14).   % �����ǿյ�, ���������
-define(err_already_exists_friend, 15).   % �����Ѿ�����
-define(err_not_exists_friend, 16).   % ���Ѳ�����
-define(err_friend_count_over, 17).   % ���Ѹ�����������
-define(err_add_self_as_friend, 18).   % ������Ѽ�Ϊ����
-define(err_invitee_has_invitation, 19). % �������Ŀ�����ڴ���һ������
-define(err_cancel_trade_invitation, 20). % �������Ŀ��ȡ����������
-define(err_cannot_invite_someone, 21).  % ��ҵ�ǰ״̬����������ĳ��
-define(err_furniture_sex, 22).  % ʹ�üҾߣ�������Ա�
-define(err_furniture_has_used, 23).  % ���˿���ʹ�õļҾߣ��Ѿ�����ռ��
-define(err_furniture_not_position, 24).  % ���˿���ʹ�õļҾߣ�û���㹻��λ��
-define(err_furniture_property_is_full, 25).  % �����������
-define(err_furniture_not_permission, 26).  % ���û��ʹ��Ȩ��
-define(err_not_enough_coin, 27).  % �����Ǯ����
-define(err_cannot_be_invite, 28). % �Է���״̬�޷���������
-define(err_reject_invitation, 29).    % �Է��ܾ������� 

-define(err_kick_by_master, 31). % �������߳�����
-define(err_other_cancel_trade, 32). % �Է�ȡ������
-define(err_cannot_trade_too_far, 33). % ˫������̫Զ�ˣ����ܽ��н���
-define(err_not_enough_position, 34). %  ����û���㹻��λ��

-define(err_cannot_trade_bag_full, 35). % ����ʧ��, �����ռ䲻��
-define(err_cannot_trade_other_bag_full, 36). % ����ʧ��, �Է������ռ䲻��
-define(err_cannot_trade_money_full, 37). % ����ʧ��, ��Ǯ����
-define(err_cannot_trade_other_money_full, 38). % ����ʧ��, �Է���Ǯ����

-define(err_task_not_enough_props, 39). % û���㹻�ĵ���
-define(err_task_is_full, 40).  % �����Ѿ�����
-define(err_task_is_exist, 41). % �����Ѿ�����

-define(err_farm_no_grass, 42).         % ���ز���Ҫ����
-define(err_farm_no_pest, 43).          % ���ز���Ҫ����
-define(err_farm_no_drought, 44).       % ���ز���Ҫ��ˮ

-define(friend_online_notify, 45).  % ����%s������(%sΪ����)
-define(friend_offline_notify, 46).  % ����%s������(%sΪ����)

-define(err_cannot_assart, 47).  % �������������Ҫ�ȼ�%s���ͽ��%s.
-define(err_plot_not_empty, 48). % �ؿ��ϻ���ũ����, ���ܲ���
-define(err_plot_empty, 49).     % �ؿ���û��ũ����
-define(err_damage_full, 50).    % �����������޷��ٷ�
-define(err_cannot_put_damage, 51).     % ��ǰ�׶β��������ֲ���
-define(err_not_crop_pick, 52). % ��ǰũ��û������ɲ�ժ
-define(err_picked, 53). % ���Ѿ���ժ����
-define(err_not_remain_fruit, 54). % ��ʵ�Ѿ�����ժ����
-define(err_cannot_pick, 55).  % ���кð�, ����ʣ�޼���!
-define(err_put_damage_too_much, 56). % ÿ��ֻ�ܷ�50��
-define(err_farm_operate_too_much, 57). % ����ò����Ĵ����Ѿ�����150��, �������ٲ���
-define(err_cannot_clear_damage, 58).   % �����Ի���֤��Ŷ
-define(err_farm_no_damage, 59).        % û�и��ֺ�
-define(err_sure_hoeing_crop, 60).      % ���ﻹû���ջ�, ���Ҫ������
-define(err_item_cannot_sell, 61).      % ��Ʒ����������
-define(err_already_exists_trade_item, 62).  % �������Ѵ��ڸ���Ʒ
-define(err_trade_money_less_0, 63).         % ���׽��С��0
-define(err_other_is_busy, 64).              % �Է���æ����
-define(err_select_item_is_empty, 65).       % ѡ����ƷΪ��
-define(err_item_bind_can_not_trade, 66).    % ��Ʒ�󶨲��ܽ���
-define(err_sys_mail_can_not_reject, 67).    % ϵͳ�ʼ���������
-define(err_sys_mail_can_not_reply, 68).     % ϵͳ�ʼ����ܻظ�
-define(err_mail_not_exists, 69).            % �ʼ�������
-define(err_mail_item_not_exists, 70).       % �ʼ���Ʒ������
-define(err_mail_reciever_not_exists, 71).   % �Ҳ����ռ��� 
-define(err_mail_item_full, 72).             % �ʼ���Ʒ�����Ѿ��ﵽ����
-define(err_mail_title_empty, 73).           % �ʼ����ⲻ��Ϊ��
-define(err_can_not_mail_to_self, 74).       % ���ܸ����ѷ��ʼ� 
-define(err_mail_reciever_empty, 75).        % �ռ��˲���Ϊ��
-define(err_not_enough_level, 76).           % �ȼ�����
-define(err_mail_can_not_reject_again, 77).  % �����ʼ�����������
-define(err_mail_sender_undefined, 78).      % ������δ����  
-define(msg_farm_shop_buy_success, 79).      % ����ɹ�, �����ѽ��%s, eq��%s��, ������%s����Ʒ
-define(msg_farm_shop_sell_success, 80).     % �ɹ�����%s��%s, �õ����%s
-define(msg_farm_shop_sell_all_success, 81). % �ɹ������ֿ�������δ������ʵ, �õ����%s
-define(err_trade_item_not_find, 82).        % �Ҳ���������Ʒ
-define(err_domestic_not_exists, 83).        % �������񲻴���
-define(err_not_need_domestic_service, 84).  % ��ʱ����Ҫ�ü�������(����˵��������)
-define(err_target_is_empty, 85).            % Ŀ��Ϊ��
-define(err_trade_need_all_sured, 86).       % ��˫����ȷ�ϲ��ܽ���
-define(err_trade_all_sured, 87).            % ˫����ȷ�Ͻ��ף����ܸı���Ʒ���Ǯ
-define(err_player_clean_not_enough, 88).    % �������Ȳ���
-define(err_player_health_not_enough, 89).   % ���｡��ֵ����
-define(err_player_charm_not_enough, 90).    % ��������ֵ����
-define(err_player_active_not_enough, 91).   % �����Ծֵ����
-define(err_house_clean_not_enough, 92).     % �������Ȳ���
-define(err_fertilizered, 93).               % �Ѿ�ʩ������
-define(err_player_replacing_house, 94).     % ����ڱ༭����
-define(err_welcome_words, 95).              % ����ķ��ݻ�ӭ�����̫����
-define(err_mail_title_too_long, 96).        % �ʼ�����̫��
-define(err_mail_content_too_long, 97).      % �ʼ�����̫��
-define(err_not_permission_enter_house, 98). % û��Ȩ�޽��뷿��
-define(err_house_permission_not_friend, 99).% ����Ȩ�޴��󣬻����Ǻ���
-define(err_sex_not_same, 100).              % �÷�װ�����������Ա��´���
-define(err_exist_purchase_item, 101).       % ���ڹ������Ʒ
-define(err_player_offline, 102).            % �Է�������
-define(err_house_clean_full, 103).          % ������������
-define(err_not_pick, 104).                  % ��ǰũ��û�������ժȡ
-define(err_domestic_not_enough_coin, 105).  % ��Ľ�Ǯ���㣬�޷�֧����ɨ���á�
-define(msg_farm_setting_prompt, 106).       % ��ʾũ�����õ���Ϣ���磺�Ųݣ�͵��...
-define(msg_house_transaction_success, 107). % �ɹ�������
-define(msg_player_property_by_stime, 108).  % ����������ʾ(ϵͳʱ��)
-define(msg_player_property_by_property, 109).% ����������ʾ(����Ӱ������)
-define(msg_player_property_by_furniture, 110).% ����������ʾ(�Ҿ�Ӱ������)
-define(msg_player_property_by_work, 111).     % ����������ʾ(��Ӱ������)
-define(msg_player_property_by_task, 112).     % ����������ʾ(����Ӱ������)
-define(err_only_at_home_can_kick_guest, 113). % Ҫ�����Ѽ����������
-define(err_only_at_home_can_edit_house, 114). % Ҫ�����Ѽ�����ܱ༭����
-define(msg_npc_script, 115).                  % ͨ��npc�ű���ʾ������
-define(msg_player_property_by_npc, 116).      % ����������ʾ(npcӰ��)
-define(msg_send_mail_success, 117).           % �ʼ����ͳɹ�
-define(msg_add_friend, 118).                  % ���%s��Ϊ����
-define(msg_be_add_friend, 119).               % %s�����Ϊ����
-define(msg_assart_plot, 120).                 % ȷ������������, �⽫���ѽ��%s
-define(msg_farm_setting_success, 121).        % ũ�����óɹ�
-define(msg_farm_setting_fail, 122).           % ũ�����óɹ�
-define(msg_farm_reset_setting_success, 123).  % ����ũ�����óɹ�
-define(msg_game_coin_overflow, 124).          % ��ҳ�������
-define(msg_not_item_to_sell, 125).            % û����Ʒ����
-define(msg_farm_land_level_not_enough, 126).  % �Բ���������һ��������Ҫ�ȼ�%d�������%d�����ĵȼ�����
-define(msg_farm_land_money_not_enough, 127).  % �Բ���������һ��������Ҫ�ȼ�%d�������%d�����Ľ�Ҳ���
-define(msg_farm_land_level_money_not_enough, 128).% �Բ���������һ��������Ҫ�ȼ�%d�������%d�����ĵȼ����Ҿ�����
-define(msg_land_not_hoeing_all, 129).         % ������ػ�û�п�����
-define(msg_upgrade_land, 130).                % ������һ��������Ҫ�ȼ�%d�������%d����ȷ��������
-define(msg_need_redland, 131).                % �߼�����ֻ�����ں�������
-define(msg_not_money_cannot_steal, 132).      % �����޷���Ҳ�ҵ��Ҽ���͵����
-define(msg_crop_cannot_aberrance, 133).       % �����ﲻ�ܲ�������
-define(msg_used_aberrance_item, 134).         % ���Ѿ�ʹ�ù�������Ʒ��
-define(msg_aberrance_item_not_stage, 135).    % ����Ʒ������ũ�������ǰʹ��
-define(msg_redland_over, 136).                % �������Ѿ�ȫ��������
-define(msg_gift_err_pack, 137).               % ������ʧ�ܣ��Ѿ����ڴ��������
-define(msg_gift_err_unpack, 138).             % �������ʧ��
-define(msg_gift_err_name, 139).               % ����������಻����16���ַ�
-define(msg_gift_err_game_coin, 140).          % ��Ϸ�Ҳ���
-define(msg_gift_err_eq_coin, 141).            % EQ�Ҳ���
-define(msg_bag_no_item, 142).                 % �����ڲ����ڸ���Ʒ
-define(msg_gift_err_comment, 143).            % ����������಻����80���ַ�
-define(msg_gift_err_pickup, 144).             % ����������󣬸��û�û��Ȩ�޻�ȡ������
-define(msg_gift_err_giftbox, 145).            % ����в�����Ϊ��
-define(msg_gift_item_not_exist, 146).         % ��ѡ����Ҫ���͵���Ʒ����ѡ��һ�����￨
-define(msg_gift_err_pack_count, 147).         % ÿ������������ѵ�����в�����5��
-define(err_fer_crop_ripe, 148).               % ũ�����Ѿ�����, ������Ҫʩ��
-define(msg_pet_bite, 149).                    % �����˼�͵ȡũ���ﱻ��ҧ��%s���
-define(msg_del_over_time_item, 150).          % %s���ڣ�����ʧ
-define(msg_item_will_be_del, 151).            % %s��������
-define(err_mail_cut_time_not_enough, 152).    % ��Ʒʣ��ʱ�䲻�㣬�޷��ʼ�
-define(err_trade_cut_time_not_enough, 153).   % ��Ʒʣ��ʱ�䲻�㣬�޷�����
-define(err_not_exist_task, 154).              % ������ϲ����ڸ�����
-define(err_task_not_enough_position, 155).    % ����û���㹻�Ŀո�
-define(err_task_not_contain_item, 156).       % �����в����ڸ���������Ҫ����Ʒ
-define(err_task_not_repeat_get, 157).         % �����������ظ���
-define(err_task_has_expried, 158).            % �������Ѿ����� 
-define(msg_task_script, 159).                 % %s
-define(msg_gift_err_sender, 160).             % ���Ϳ������ʱ�����ʺŲ�����
-define(msg_pet_food_is_full, 161).            % ��������,������������
-define(msg_pet_food_used, 162).               % �Ѿ��������ɹ�����ӵ���Ĺ�����
-define(msg_pet_food_buy_success, 163).        % ����ɹ����Ѿ��������ɹ��Ĵ�ŵ���Ĳֿ���
-define(msg_gift_box_owner_pickup, 164).       % ���%s���������
-define(err_player_no_eq_home, 165).           % ���û��EQ��Բ
-define(msg_task_complete, 166).               % %s:�������
-define(msg_task_give, 167).                   % ����%s����
-define(msg_task_reward_item, 168).            % �����������%s, ����:%s
-define(msg_task_reward_game_coin, 169).       % ��������Ϸ��%s
-define(msg_task_reward_eq_coin, 170).         % ��������eq��%s
-define(err_you_already_in_scene, 171).        % ���Ѿ��ڳ������ˣ�����ظ�������뵱ǰ������
-define(msg_gift_box_has_been_pickup, 172).    % �Ѿ������ڸ������
-define(msg_farm_does_not_have_dog, 173).      % ��ұ������й�����ʹ�ù�����
-define(msg_farm_pet_food_waste, 174).         % �Ѿ��������ɹ�����ӵ���Ĺ�����, �����˷���
-define(msg_farm_shop_buy_dog_success, 175).   % ������һֻ��
-define(msg_bited_dec_money, 176).             % ���ڲ�ժ�Ĺ����б�������%s�Σ������ܵ�ʱ����ʧ��%s���
-define(err_not_enough_game_coin, 177).        % ������Ϸ�Ҳ���
-define(msg_item_can_not_pack, 178).           % ����Ʒ��������������
-define(msg_farm_event_1, 179).                % ��ʲô��û���ţ�����ʧ��50���
-define(msg_farm_event_2, 180).                % ����˫������������50���
-define(msg_task_bag_is_full, 181).            % ��ȡ����ʧ�ܣ������Ѿ���
-define(success_resize_player_pack, 182).      % �������ݳɹ�
-define(msg_get_item, 183).                    % �����Ʒ:%s X %s
-define(msg_change_house, 184).                % ����л�����
-define(err_other_reject_accept_friend, 185).  % �Է��ܾ���Ϊ��������
-define(err_other_logout_invite_fail, 186).    % ���%s���ߣ�����ʧ��
-define(msg_add_friend_success, 187).          % �Ӻ��ѳɹ�
-define(err_not_find_match_players, 188).      % �Ҳ�������������� 

-define(warn_before_edit_house, 193).             % ��ļ����б��䣬��ȥ��װģʽ��������������б��䣬�Ƿ������(�ͻ�����)


-define(msg_buy_house, 199).                   % ���ʹ���µķ���

-define(err_farm_task_not_repeat_get, 200).    % �����������ظ���
-define(err_farm_task_is_exist, 201).          % �����Ѿ�����
-define(err_farm_task_is_full, 202).           % �����Ѿ�����
-define(err_farm_not_exist_task, 203).         % ������ϲ����ڸ�����
-define(err_farm_task_has_expried, 204).       % �������Ѿ����� 

-define(err_pos_not_empty, 205).               % ��λ��������Ʒ
-define(err_task_not_give_up, 206).            % �������������

-define(err_not_enough_money, 207).            % ��Ǯ����
-define(err_farm_depot_no_item, 208).          % ũ�����������ڸ���Ʒ
-define(err_drop_float_bottle_fail, 209).      % ��Ʈ��ƿʧ��
-define(err_pick_float_bottle_fail, 210).      % ��Ʈ��ƿʧ��
-define(msg_send_make_friend_request, 211).    % ��ĺ�����������ѷ���

-define(err_wallow_work_warn_time, 212).       % ����������ԣ���������롣
-define(err_wallow_work_bad_time, 213).        % ����������ԣ����޷�������档
-define(err_wallow_magic_box_warn_time, 214).  % ����������ԣ��޷�ʰȡ��Ʒ����Ǯ��ü��롣
-define(err_wallow_magic_box_bad_time, 215).   % ����������ԣ��޷���ȡ��Ʒ���޷���ȡ��Ǯ��
-define(err_wallow_warn_time, 216).            % ����������ԣ���ժ������롣
-define(err_wallow_bad_time, 217).             % ����������ԣ��޷�������档
-define(err_wallow_buy_good_warn_time, 218).   % ʱ�䳬������ʱ�䣬������Ʒ���뾭��
-define(err_wallow_buy_good_bad_time, 219).    % ʱ�䳬������ʱ�䣬������Ʒ�����Ӿ���
-define(err_wallow_sell_good, 220).            % ʱ�䳬������ʱ��, ��ʾ��Ҳ�����������
-define(err_wallow_complete_task, 221).        % ʱ�䳬������ʱ��, �������������
-define(err_wallow_farm_complete_task, 222).   % ʱ�䳬������ʱ��, ������ũ���������
-define(err_magic_box_get_nothing, 223).       % ��ʲôҲû�õ�
-define(err_other_busy_stop_invite, 224).      % ������ĳЩ���飬���¶Է�ֹͣ������״̬
-define(err_wallow_pick_crop, 225).            % ����������ԣ��޷���ժ����
-define(err_player_disease_can_not_work, 226). % ����״��̫���޷���

-define(msg_player_property_by_disease_special_event, 227). % ����������ʾ(���������¼�����)
-define(err_wallow_give_task, 228).            % ʱ�䳬������ʱ��, �����������
-define(err_wallow_farm_give_task, 229).       % ʱ�䳬������ʱ��, �����������
-define(err_reject_add_friend, 230).           % %s�ܾ�����Ϊ����

-define(err_exceed_max_game_coin, 231).        %���������Ϸ���޶�
-define(err_not_enough_eq_coin, 232).          % ����eq�Ҳ���
-define(msg_move_farm_coin_success, 233).        %�����Ǯ��ʾ
-define(msg_move_game_coin_success, 234).        %�����Ǯ��ʾ

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%       ����С�� ��ϵͳ��ʾ�����￪ʼ
-define(err_no_del_item_when_house_is_editing, 300). % ���ڱ༭���ݲ���ɾ��Ʒ
-define(msg_commemoration, 301).               % ���ֻ����100��������
-define(msg_flower_success_1, 302). % ��ˮ�ɹ������������4��ɳ�ֵ
-define(msg_flower_success_2, 303). % ��ˮ�ɹ������������1��ɳ�ֵ
-define(msg_water_flower_limit, 304). % ���ս�ˮ�Ѵﵽ���ޣ�����������
-define(err_player_no_love_home, 305). % û��ͨ����С��
-define(err_login_account_empty, 306). % �˺Ų���Ϊ��
-define(err_login_account_or_password, 307).     % �˺Ż��������
-define(err_other_is_editing_house, 308).        % ����������ڱ༭����, ����ʱ���ܱ༭����
-define(err_player_editing_house, 309). % ����ڱ༭����, �㱻���˳���
-define(err_not_enough_lover_diamond, 310).  % ����ˮ������
-define(msg_friend_water_flower_limit, 311). % ��ɻ����Ѿ���8λ���ѽ���, �����ٽ���

-define(err_has_get_holiday_gift, 312).      % �Ѿ��������������
-define(err_today_not_holiday_gift, 313).    % ����û�н������� 
%%-define(err_change_dress_not_enough_coin, 314). %% ��װû���㹻�Ľ��

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%������ʾ������˲�ʹ�ã�����ռλ
%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
-define(msg_no_love_seed, 315). %% �㻹��������ȡ��������Ŷ����ȥѰ��һ�ݰ����
-define(msg_no_love_flower, 316). %% ���ѻ��ǵ���û�а�����


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% ���
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

-define(err_mateup_unknow, 317).            %% δ֪������쳣
-define(err_visit_mateuping, 321).          %% ��Թ����У��������ݱ��ݷ�
-define(msg_kicked_mateuping, 322).         %% ��Թ����У����ÿ��ͻؼ�
-define(msg_mateup_success, 323).           %% ��Գɹ���,����������Ϣ��ʾ

-define(err_hp_not_enough, 324).            %% ����ֵ����

-define(msg_qq_strategy, 325).              %% ����Ϊ%

-define(msg_cannot_create_party, 326).      %% �ɶ��Ѿ�������, �����ٿ�, ����ȡ��

%%%%%%%%%%%%%%%����%%%%%%%%%%%
-define(err_not_exist_item, 327).           %% ���������ڸ���Ʒ
-define(err_not_engouth_diamond, 328).      %% û���㹻��ˮ��
-define(err_exceed_max_receive, 329).       %% ������ҽ���������������
-define(err_item_is_empty, 330).            %% ���û��ѡ����Ʒ

%%%%%%��ע�б�%%%%%%%%%%%%%%%%%
-define(msg_attention_full, 331).           %% ��ע�б�����
-define(msg_exist_in_attention, 332).       %% �Ѿ��ڹ�ע�б�����
-define(msg_not_exist_in_attention, 333).   %% ��ע���󲻴���
-define(err_you_are_mateuping_can_not_login, 334). %% ����������У��޷�������Ϸ
-define(msg_add_attention_success, 335).     %% ���Ѿ���{0}�����˹�ע�б�
%% 336     %% �ɹ�������Ը����
%% 337     %% ���ˮ�����㣬�޷�ʵ�ָ�Ը����
%% 338     %% ʵ�ָ�Ը����Ҫ����{0}��ˮ�������Ƿ�ȷ����Taʵ�֣�
%% 339     %% ʵ�ָ�Ը����Ҫ����{0}��Q�㣬���Ƿ�ȷ����Taʵ�֣�
-define(err_item_count_not_enough, 340).     %% ��Ʒ��������
-define(err_item_not_gift, 341).             %% ��Ʒ���ܵ�������
-define(err_account_or_password, 342).       %% �˺Ż��������
-define(err_not_laba, 343).                  %% �������Ҳ������� 
-define(err_player_is_empty, 403).           %% ����ʺŲ����ڣ����²��ܷ�������
-define(err_level_not_enough_to_buy, 404).   %% ����ʺŲ����ڣ����²��ܷ�������
-define(err_item_overdue, 407).              %% ��Ʒ����
-define(err_can_not_use_furniture_when_edit_house, 408).  %% ����������װ���޷�ʹ�üҾ�
-define(err_house_right_not_buy, 409).       %% ��Ȩδ����
-define(err_prev_house_right_not_buy, 410).       %% ��Ȩ��Ҫ�𼶹���
-define(err_level_not_enough_to_buy_house_right, 411).       %% �ȼ�����
-define(msg_level_up, 412).       %% ������ʾ
-define(msg_kicked_move_house, 413). %% ��������

-define(err_scene_not_exists, 415). %% ����������
-define(err_house_right_has_buy, 416). %% ��Ȩ�����
-define(err_can_not_buy_double_house, 417). %% ����ֻ���õ���ķ���
-define(err_can_not_buy_single_house, 418). %% ����ֻ�������µķ��� 
-define(err_not_at_home_not_move_house, 419). %% �ڱ��˼Ҳ��ܰ��


-define(err_special_house_sell_out, 423). %% ���ַ���������
-define(msg_buy_special_house_ok, 424). %% �����Ȩ���ݹ���ɹ�
-define(err_special_house_right_not_buy, 425).       %% �����Ȩδ����
-define(level_not_enough, 426).         %% �ȼ�����


-define(err_whip_max, 431).  %% �޴򳬹���������
-define(err_whip_not_in_house, 432).  %% ��Ҽ������ʹ�ñ޴���
-define(err_already_has_search_plan, 433). %% ��ǰ�Ѿ����ڽ����ռ���
-define(msg_search_item_gain_exp, 434).  %% ��{0}�������{1}�㾭��
-define(err_not_search_plan, 435). %% ��ǰ����û���������ռ�
-define(err_account_cant_exist, 436). %%�˺�����δ��ͨ��Ӧ��

-define(err_whip_not_enough, 442).
-define(err_whip_not_exist, 443).
-define(err_friend_is_searching, 445).
-define(err_you_has_whip, 446).
-define(msg_flowerpot_not_crop, 447). %% ������û��ũ����
-define(msg_crop_event_handled, 448). %% �����ϵ��¼��Ѿ���������
-define(msg_not_fertilize, 449).      %% û�з���

-define(msg_crop_exist, 453).              %% �������Ѿ���������
-define(msg_get_fruit_count, 455).         %% ����˶��ٸ���ʵ
-define(msg_help_boss_whip, 460).          %% �޴��˹�Ա��������5���ӵ��ռ�ʱ��

-define(msg_you_kick_someone, 461). %% ���%p�ϳ��˷��� 
-define(msg_flowerpot_not_exist, 462).     %% ���費����

-define(err_you_are_breakuping_can_not_login, 463). %%���ڰ������
-define(err_visit_breakuping, 464).        %% �������У��������ݱ��ݷ�
-define(msg_kicked_breakuping, 466).         %% ��Թ����У����ÿ��ͻؼ�

-define(msg_farm_level_not_enough, 469).   %% ��ֲ��ʱ��ȼ�����
-define(msg_task_for_add_item, 470).

-define(err_score_coin_not_enough, 471).   %% �齱�Ҳ���


-define(msg_someone_kick_you, 473). %% �㱻%p�ϳ��˷���
-define(err_not_allow_enter, 475). %% �÷������˲���ӭ�㣬���Ժ��ٷ���

-define(err_funiture_count_limit, 476). %% �Ҿߴﵽ����
-define(err_daily_score_not_enough, 477). %% �������������콱

-define(msg_ring_task_not_exist, 478).    %% ���񲻴���
-define(msg_ring_task_past_due, 479).     %% �������
-define(msg_ring_task_require_item_not_enough, 480).  %% ȱ����ƷXXX��XX��
-define(msg_ring_task_task_has_complete, 481).        %% �����Ѿ���ɹ����������ظ����
-define(msg_ring_task_task_cant_complete, 482).       %% ����û����ɣ���������ȡ����
-define(msg_someone_be_kick, 483). %% %p��ŭ��%p�����ϳ��˷���
-define(msg_not_need_reduce_fruit_time, 484). %% �����Ƿ�û��������������Ѿ�����
-define(msg_all_crop_reduce_time, 485).       %% ��������������һ��Сʱ
-define(msg_use_add_increase_fruit_ok, 486).  %% �ɹ�ʹ�÷��տ�, 24Сʱ�ڻ�ù�ʵ����
-define(msg_daily_active_reward_gain_item, 487).  %% ��ϲ����{1}��{0}
-define(msg_ring_task_item_not_exist, 493).  %% ȱ����Ʒ����������
-define(msg_ring_task_give_count, 494).  %% ����������ʾ
-define(msg_ring_task_exceed_max_count, 495).  %% ���񳬹������
-define(msg_maind_quiz_get_item, 496).  %% �����ʴ��ȡ��Ʒ

-define(err_create_party_fail_interval, 498). %% �ٹ�{0}�ſɴ�����һ�ɶ�
-define(err_can_not_enter_private_party, 499). %% �޷���˽���ɶ�


-define(err_flower_shake_prop_overflow, 10036). %% ���߲���
-define(err_extend_aging_item, 501).            %% �����·�ʱЧ��Ҫ����Ʒ����


%% ��Ʒ����
-define(err_item_upgrade_fail, 502). 
-define(err_item_upgrade_cap, 503).     %% ��Ʒ�Ѿ�����߼�
-define(err_item_upgrade_lack, 504).    %% ȱ�ٵ���

-define(err_party_money_not_enough, 506).  %% �ɶ�ȱ��ˮ��

-define(msg_kick_by_pub_host, 520).  %% ��������{0}����˾ư�
-define(msg_kick_by_pub_guest, 521). %% ���������˼����ư�
-define(msg_recv_yy_gift, 522).      %% ���յ�{0}������{1}���{2}������
-define(msg_gain_gift_reward, 523).  %% �н���ʾ{0}������
-define(err_you_are_in_shitlist, 524).  %% �������û����õ�½����ʾ

-define(err_channel_only_host_can_kick, 525).  %% ��Ȩ��Ƶ������ 
-define(err_not_pub_channel, 526).  %% Ƶ�������� 
-define(err_pub_host_reject_enter, 527).  %% δ��{0}����, �ư����˲���ӭ��� 
-define(err_channel_player_full, 528).  %% �ư������� 
-define(err_yy_gift_send_self, 529).  %% �������������� 
-define(err_target_not_in_channel, 538).  %% ���������Ƶ���� 
-define(msg_channel_kick_someone, 539).  %% {0}��{1}�߳�Ƶ�� 

-define(msg_channel_log, 541).  %% {0}
-define(msg_not_empty_flowerpot, 542).   %% ��������, �޷���ֲ

-define(err_task_is_empty, 543).

-define(unlock_furniture_level_error, 546).      % ����ʱ�ȼ�����
-define(unlock_furniture_diamond_error, 547).    % ����ʱˮ������
-define(unlock_furniture_material_error, 548).   % ����ʱ���ϲ���
-define(unlock_furniture_unlock_error, 549).     % ����Ľ�������
-define(unlock_furniture_type_error, 550).       % ���������ʹ��󣬲�������������
-define(unlock_house_material_error, 551).       % ��������ʱ���ϴ���

-define(player_point_error, 555).       % ���ֲ���
-define(player_point_pay_error, 556).   % ֧������

-define(msg_add_item, 558).             % �����{0}��{1}��Ʒ
-define(mutli_item_upgrade_lover_edit, 561).   %% ����ta���ڼ�װ���޷���������
-define(mind_quiz_count, 563).          % �������س�������
-define(party_exceed_max_point, 564).   % ����������

-define(player_hp_count_error, 566).    % ÿһ������������Ѿ�����
-define(player_hp_overflow, 567).       % �����Ѿ����ˣ��������ٻظ�

-define(player_food_unlocked_level_error, 572). % ����ʳ��ĵȼ�����
-define(player_food_unlocked_id_error, 573).    % ����ʳ���id�ظ�����
-define(player_food_expand_stock_max_stock, 574).% ����������
-define(player_food_expand_stock_due_time, 575). % ��������һ��δ��ɣ������ظ�����
-define(player_food_expand_stock_diamond, 576).  % ������ˮ������
-define(player_food_produce_area_diamond, 577).  % ������������ʱˮ������
-define(player_food_produce_area_items, 578).    % ������������ʱ��Ʒ����
-define(player_food_upgrade_diamond, 579).       % ����ʳ��ʱˮ������
-define(player_food_upgrade_items, 580).         % ����ʳ��ʱ��Ʒ����
-define(player_food_make_product_number, 581).   % ����ʳ��ʱ������������
-define(player_food_make_product_diamond, 582).  % ����ʳ��ʱˮ������
-define(player_food_make_product_stock, 583).    % ����ʳ��ʱ��泬������
-define(player_food_make_product_position, 584). % ɾ��ʳ��ʱ����ɾ����ʳ�ﲻ����
-define(player_food_complete_expand_stock, 585). % ���������ʱ��Id���󣬲����ڸ�ID�������
-define(player_food_complete_expand_stock_due_time, 586). % ���������ʱ��ʱ�仹û�е�
-define(player_food_complete_product, 587).      % �������ʳ��ʱ����ʳ�ﲻ���� 
-define(player_food_complete_product_time, 588). % ʱ�仹û�е�����ǰ���������������
-define(player_food_unlocked_diamond, 589).      % ����ʳ���ˮ������
-define(player_food_upgrade_decoration, 592).    % ����ʳ��ʱ�����Ȳ���

-define(msg_add_buff, 593).                      % ������һ��buff

-define(msg_party_food_diamond, 595).		 % ����ˮ������,�޷��Գ�
-define(msg_party_food_eat_count_Max, 596).	 % �����Ѿ��Եĺܱ���

-define(msg_party_drink_have_score, 603).        % ���������˺���һ��{0}�����{1}����
-define(msg_party_drink_not_score, 604).         % ���������˺���һ��{0}������������޷����л�û�����
-define(msg_party_drink_guest_have_score, 605).  % {0}�������˺���һ��{1}������{2}����
-define(msg_party_drink_guest_not_score, 606).   % {0}�������˺���һ��{1}������������޷����л�û�����
-define(msg_not_need_party_drink, 607).          % ����Ҫ��Ⱦ�, û�п���
