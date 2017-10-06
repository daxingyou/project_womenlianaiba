%%% @author  linyijie
%%% @copyright (C) 2010, 
%%% @doc
%%%  excelӳ���ļ��Ľṹ�嶨��, ������ṹ���, �����������Ӧ����Դӳ���ļ���excelʹ��
%%% @end

%%% Created : 22 Mar 2010 by  <>

%% ���͵Ķ��������: int, float, string, list_int, list_float, list_string
%% �������� vector3, color, quaternion
%% ������list_ ��ͷ�Ķ����б����ʽ, ģ�������д�ĸ�ʽ���� 1, 2, 3 Ҫ�Զ���Ϊ�ָ���
%% ������range ��ʾ����,  ģ�������д�ĸ�ʽ���� 1~2,  �������ɵ�����ΪԪ��{1, 2}�� Ҳ��ֱ����2, ��ʾ{2, 2} 

-define(tplt_list,(
	  [{house_tplt,     % ����ģ���
	    [{int, id},     % id
	     {string, name},% ����
	     {int, level},  % �ȼ�
	     {int, type},   % ����
	     {string, model},        % ����id���ͻ�����
	     {string, house_furniture}, % ��Ӧ�ķ��ݸ����Ҿ�
	     {int, born_id},                % ������
	     {int, max_players},              % �������
	     {int, preview_born},
	     {string, struct_info},
	     {int, right_grade},          % ��Ȩ�ȼ�(0 ��ʾû�� -1 ��ʾ�����Ȩ)
	     {int, is_single},            % �Ƿ���(0 ��ʾ�� 1 ��ʾ��)
	     {string, icon},              % ͼ��
	     {string, big_icon},
	     {string, tip},           
	     {int, internal_decoration},  % �����װ�޶�
	     {int, max_furniture},        % ����ܷż����Ҿ�
	     {int, max_flowerpot},        % ����ܷż�������
	     {string, bg_music},          % ��������
	     {int, max_guest},
	     {string, guest_id},
	     {string, waiter_pos},	  % λ��
	     {int, waiter_rotate},	  % ����
	     {int, love_coin}
	    ]},
	   {born,                          %% �������
	    [{int, id},                            
	     {list_space_float, pos},
	     {int, dir},
	     {string, lookat},
	     {string, pitch},
	     {string, yaw},
	     {string, zoom},
	     {string, farclip},
	     {string, field},
	     {string, watch_mode},
	     {string, view_floor}
	    ]
	   },
	   {house_furniture_tplt, % ���ݸ����Ҿ�(�����ݵ�ʱ���Ĭ�ϼҾ�)
	    [{int, id},           % id
	     {int, furniture_id}, % �Ҿ�ID
	     {int, item_temp_id}, % ��Ӧ����Ʒģ��ID(���ڰѼҾ�ת������Ʒ)
	     {int, x},      % x����
	     {int, z},      % y����
	     {float, height}, % ��ظ߶�
	     {int, flr},      % ¥��
	     {int, face}      % ����
	    ]},
	   {item_base_tplt, %% ӳ�䵽1����Ʒid
	    [{int, item_id},
	     {int, base_item_id} %% 1����Ʒid
	     ]
	   },
	   {item_tplt,        % ��Ʒģ���
	    [{int, id},       % ��Ʒ��ID
	     {string, name},  % ��Ʒ������
	     {int, type},     % ��Ʒ����������
	     {int, use_type}, % ʹ������
	     {string, icon},  % ��Ʒ��ͼ��
	     {int, overlap},  % ���ѵ���
	     {int, sell_price},% �ۼ�(0��ʾ��������)
	     {int, sub_id},   % ���ӵ��Ҿ߱��id
	     {int, upgrade_id}, % �����ֱ�Id
	     {int, bind},    % Ŀǰ���������Ƿ������
	     {int, effect_time_id}, % ʱЧ
	     {int, property_id},    % �������Ͷ�Ӧ��ͬ�ı�id
	     {int, use_level},      % ʹ�õȼ�
	     {int, level}
	    ]},
	   {item_effect_time_tplt,      %% ��ƷʱЧ
	    [{int, id},                % id
     	     {int, type},              % ����(1��ʾ����ʱʱЧ��2��ʾʱ���ʱ��)
     	     {int, effect_time},       % ��Чʱ��(��)
	     {int, trade_cut_time},    % ���׿۳�ʱ��(��)
	     {int, del_time}           % ɾ��ʱ��(��ʽYYYYMMDD), 00:00��ʼɾ��
	    ]},
	   {item_dress_tplt,  % ��Ʒ��װ��
	    [{int, id},       % ID
	     {string, name},  % ����
	     {int, sex},      % �Ա�
	     {int, equip_pos},% װ����λ��
	     {list_int, equip_placeholder}, % ռλ��
	     {string, model},      % ��Ӧģ��
	     {string, model_body}, % ģ�Ͷ�Ӧ����
	     {int, place},    % ��ŷ�ʽ
	     {string, action},% ����
	     {string, particle},   %% ����Ч��
	     {string, attach_pos}, %% ��Ӧ�Ĺ�������
	     {int, type1},    % ����1
	     {int, type2}     % ����2
	    ]},
	   {house_comp,       % ���ݲ�����
	    [{int, id},       % ������ID
	     {int, type},     % 1:��ͨ�Ҿ�2:����
	     {string, name},  % ����
	     {int, prop_id},  % 
	     {string, pos},   % ����
	     {string, rot},   % ��ת
	     {string, scale},  % ����
	     {string, model},
	     {int, cull_level},
	     {string, particle},
	     {string, particle_pos}
	    ]},
	   {common_scene,     % ��������
	    [{int, id},       % ����id
	     {string, name},  % ��������
	     {int, copy_count}, % ÿ̨�������ĸ�����
	     {int, max_players}, % �������
	     {int, born_id},
	     {string, furnitures},
	     {string, scene_name},
	     {int, type},
	     {string, bg_music}
	    ]},	   
	   {mutex_actions,    % ��������
	    [{int, id},       % id  
	     {string, name},  % ��������
	     {list_int, allow_actions} % ����Ķ�������
	    ]},	   
	   {change_looks_tplt,             % ����
	    [
	     {int, id},          % �Ա� * 10000 + �ı�(1.����, 2.��ɫ 3.���� 4.��ɫ 5.����) * 1000 + �ı�����ֵ(�·��ͣ�����ɫ)
	     {int, money_type},  % ��������(1Ϊ��Ϸ��ң�2Ϊ�㿨����)
	     {int, money}        % ����
	   ]},
	   {teleport_tplt,      % ���͵�
	    [
	     {int, id},           % ��ˮ��
	     {int, src_scene_id}, % ��������id
	     {float, src_x},        % ���͵�
	     {float, src_y},
	     {float, src_z},
	     {float, src_radius},  % ���͵�뾶
	     {int, dest_scene_id}, % Ŀ�곡��id
	     {float, dest_x},      % Ŀ���
	     {float, dest_y},
	     {float, dest_z},
	     {int, dest_dir}      % ��������ﳯ��
	   ]},
	   {create_random_dress,     % ���������װ�����
	    [{int, id},       % id 
	     {int, sex},      % �Ա�
	     {int, fashion1}, % ��װ1
	     {int, fashion2}, % ��װ2
	     {int, fashion3}, % ��װ3
	     {int, fashion4}, % ��װ4
	     {int, fashion5}  % ��װ5
	    ]},
	   {npc_tplt,             % npc
	    [{int, npc_id},      % npc����
	     {int, body},        % ����
	     {int, head},        % ͷ
	     {int, hair},        % ͷ��
	     {int, equip1},      % ��ʼװ��1
	     {int, equip2},      % ��ʼװ��2
	     {int, skeleton},    % ����
	     {string, npc_name}  % npc����
	    ]},
	   {npc_map_mapping_tplt,% ��ͼ��Ӧnpc��ϵ
	    [{int, id},         % ��ͼ����
	     {int, npc_id},     % ������npc
	     {string, npc_name},% npc����
	     {float, x},        % x������
	     {float, y},        % y������
	     {float, z},        % z������
	     {int, script_id},  % ִ�нű����
	     {int, action},     % �Զ����Ŷ���
	     {int, towards}     % ����
	    ]},
	   {player_level_tplt,    % ��ҵȼ���ʱ�����չ�ϵ
	    [{int, level},        % ��ҵȼ�
	     {int, online_time} % �������ʱ��
	    ]},
	   {sys_shop_tplt,            %% ϵͳ�̳�
	    [{int, goods_id},         %% ��ƷID
	     {int, item_id},          %% ��ƷID
	     {int, type},             %% ����
	     {int, money_type},       %% 1. ����ˮ��
	     {int, price},            %% �۸�
	     {int, point},            %% ��һ���
	     {int, intro},            %% ����
	     {int, commend},          %% �Ƽ�
	     {int, broadcast_id},     %% ϵͳ����id
	     {int, sex},              %% �Ա�
	     {int, player_level},     %% ��ҵȼ�
	     {int, visible},          %% �Ƿ�ɼ�(0��ʾ���ɼ�) 
	     {int, newcomer}          %% �����Ƿ���ʾ
	    ]},
	   {npc_shop_tplt,            %% ϵͳ�̳�
	    [{int, goods_id},         %% ��ƷID
	     {int, item_id},          %% ��ƷID
	     {int, type},             %% ����
	     {int, sex},              %% �Ա�
	     {int, price},            %% ��������Ʒ�ļ۸�
	     {int, intro},            %% ����
	     {int, sale_type}         %% ��������
	    ]},
	   {furni_tplt,               %% �Ҿ�ģ���
	    [{int, furniture_id},     %% �Ҿ�Id
	     {int, max_use_player},   %% ���ʹ������
	     {int, use_sex},          %% ʹ�õ��Ա� 
	     {int, permission},       %% ʹ��Ȩ��
	     {list_int, function_list},%% �����б�
	     {int, use_type},          %% ʹ������
	     {int, status_qty}          %% ״̬����
	    ]},
	   {furni_interact_tplt,
	    [{int, function_id},      %% ����id
	     {int, property_id},      %% �������Id
	     {int, status}            %% �޸ĵļҾ�״̬
	    ]},
	   {common_define_tplt,                     %% ��������ģ���
	   [{string, key},                          
	    {string, value}
	   ]},
	   {player_disease_probability_tplt,  %% ��Ҽ����������ʱ�
	    [{int, player_health},          %% ��������
	     {int, probability}               %% ��������
	    ]},
	   {player_disease_type_tplt,         %% ��������ģ���
	   [{int, type},                      %% ��������
	    {int, rate},                      %% �ò�ͬ�����ı���
	    {int, upgrate_probability},       %% ��ߴ�������
	    {int, level},                     %% �����ĵȼ�
	    {int, treatment_costs},           %% ���Ʒ���
	    {int, min},                       %% ��С����ֵ
	    {int, max},                       %% ��󸡶�ֵ
	    {list_int, special_event_id},     %% �����¼�Id
	    {list_int, event_id_probability}, %% �����¼�Id�ļ���
	    {int, special_event_probability}  %% �����¼�����
	   ]},
	   {player_disease_special_event_tplt,%% ���������¼�ģ���
	     [{int, special_event_id},          %% �����¼�Id
	     {int, property_id},               %% Ӱ�������Id
	     {string, image}                   %% ͼƬ��ַ
	    ]},
	   {house_transaction_tplt,           %% ���ݽ��ױ�
	   [{int, id},                        %% ����Id
	    {string, name},                   %% ����
	    {int, type},                      %% ����
	    {int, recommend},                 %% �Ƽ�
	    {int, level},                     %% �ȼ�
	    {int, pay_type},                  %% ֧������
	    {int, price},                     %% �۸�
	    {int, house_id},                  %% ��Ӧ�ķ���ģ��Id
	    {string, intro},                  %% ���
	    {int, broadcast_id}               %% ϵͳ����id
	   ]},
	   {sys_broadcast_tplt,               %% ϵͳ����
	   [{int, id},                        %% ����Id
	    {string, content},                %% ����
	    {int, show_seconds}               %% ��ʾʱ��
	   ]},
	   {holiday_gift,                     %% ��������
	   [{int, sequence_id},               %% ��ˮ�� 
	    {int, start_day},                 %% ��ʼ���ڸ�ʽ:yyyymmdd
	    {int, duration},                  %% �ּ�����
	    {int, group_id},                  %% ��(����ֶ���ǰ����ûʲô��)	         
	    {int, gift_type},	              %% ��������
	    {int, item_id},	              %% ��Ʒid
	    {int, count},	              %% ��Ʒ���� or ����ˮ����
	    {int, rate}                       %% ��õĻ���
	   ]},

	   {level_info_tplt,            %% �ȼ����ձ�
	   [{int, level},               %% �ȼ� 
	    {int, exp},                 %% ������Ҫ�ľ���ֵ
	    {int, max_hp},              %% �������ֵ
	    {int, hp_restore_time},     %% ��ò��ܼ�һ������
	    {int, max_decoration},       % ���װ�޶�
	    {float, party_owner_calc_exp_a}, %% ������/��ǰԤ�ں�����*ϵ��A*�ۻ�ʱ��
	    {float, party_guest_calc_exp_b}, %% ������/��ǰԤ�ں�����*ϵ��B*�ۻ�ʱ��
	    {int, party_cost_money},  %% �ɶ���������
	    {int, party_add_score}    %% ͶƱ��������Ӷ��ٷ���
	   ]},

	   {flower_tplt,                              %% ����ģ���
	    [{int, id},                               %% ������Id
	     {int, flower_id},                        %% ����Id
	     {int, level},                            %% ���ٵĵȼ�
	     {int, grow},                             %% �ɳ�ֵ
	     {string, model},                         %% ģ������
	     {string, particle}
	    ]},
	   {gift_box_tplt,                    %% �����
	    [{int, id},                       %% ID
	     {int, type},                     %% ����
	     {string, name},                  %% ����
	     {int, price},                    %% �۸�
	     {string, model},                 %% ģ��
	     {string, icon},                  %% ͼ��
	     {string, intro}                  %% ���
	    ]},
	   {props_item_tplt,                  %% ������Ʒ
	    [{int, id},                       %% ��ƷID, ����Ʒ���ID��ͬ
	     {int, target},                   %% ʹ�ö���, 1 -- ���Լ�ʹ��, 2 -- ��������ʹ��, 3 -- ��Χʹ��
	     {int, del},                      %% ʹ�ú��Ƿ�ɾ��
	     {string, intro},                 %% ʹ��˵��
	     {string, movie},                 %% ����ָ���Ķ���
	     {int, ui},                       %% ָ���Ľ���
	     {string, audio},                 %% ����ָ��������
	     {int, sysmsg},                   %% ��ʾָ������Ϣ, ��ֵ��ϵͳ��Ϣ�ж����IDֵ
	     {string, module},                %% Ҫִ�еĽű���ģ����
	     {string, arguments}              %% ����
	    ]},
	   {player_task_tplt,                 %% ������������
	    [{int, task_id},                  %% ����Id
	     {string, icon},                  %% ����ͼ��
	     {string, title},                 %% �������
	     {string, describe},              %% ����Ŀ��
	     {list_int, require_items},       %% ��Ҫ����Ʒ
	     {list_int, require_items_count}, %% ��Ҫ��Ʒ������ 
	     {list_int, reward_items},        %% ������Ʒ
	     {list_int, reward_items_count},  %% ������Ʒ������
	     {int, diamond},                  %% ������ˮ��
	     {int, experience},               %% �����ľ���ֵ
	     {int, hp},                       %% ����������ֵ
	     {int, point},                    %% �����Ļ���
	     {int, love_coin},		      %% ���������
	     {int, is_show},                  %% �Ƿ���ʾ
	     {int, q_coin},                   %% ���������Ҫ��Q��
	     {string, target1},               %% Ŀ��1
	     {string, target2},               %% Ŀ��2
	     {string, target3},               %% Ŀ��3
	     {int, type},                     %% ��������
	     {int, need_player_level}         %% �������ȼ�
	    ]},
	   {daily_task_tplt,                  %% ÿ������
	    [{int, id},                       %% ÿ������Id
	     {int, task_id},                  %% ��Ӧ�Ļ�������Id
	     {int, use_type},                 %% ʹ������, 1:����, 2:��Թ��� 
	     {int, level},
	     {int, rate},
	     {int, diamond}                   %% �滻������Ҫ�ķѵ�ˮ��
	    ]},
	   {chain_task_tplt,                  %% ��ʽ����
	    [
	     {int, id},                       %% ����Id
	     {list_int, task_id},             %% ����Id�б�
	     {list_int, next_chain}           %% ��һ����ʽ����Id
	    ]},
	   {house_right_tplt,                 %% ���ݲ�Ȩ
	    [{int, grade},                    %% �ȼ�
	     {string, desc},                  %% ����                      
	     {int, money_type},               %% ��Ǯ����(1Ϊ��Ϸ��ң�2Ϊ�㿨����)
	     {int, money},                    %% ��Ǯ����
	     {int, material1},
	     {int, material1_shop_id},
	     {int, num1},
	     {int, material2},
	     {int, material2_shop_id},
	     {int, num2},
	     {int, material3},
	     {int, material3_shop_id},
	     {int, num3},
	     {int, material4},
	     {int, material4_shop_id},
	     {int, num4},
	     {string, icon},
	     {string, hover_icon}
	    ]},
	   {special_house_tplt,               %% �����Ȩ
	    [{int, id},                       %% ��ˮ��(��ͬ��ˮ��ֻ�ᱻ����һ�Σ�������ˮ��һ��Ҫһֱ����) 
	     {int, house_tplt_id},            %% ����id
	     {int, q_coin},                   %% Q��
	     {int, count},                    %% ��������
	     {int, broadcast_id}              %% ����id
	    ]},
	   {player_special_house_tplt,
	    [{int, id},
	     {list_int, unlock_house_ids},
	     {int, love_coin},
	     {int, broadcast_id},
	     {string, name},
	     {string, desc},
	     {string, icon},
	     {string, big_icon},
	     {int, decoration},
	     {int, furniture_count},
	     {int, is_show}
	    ]},
	   {player_login_reward_tplt,
	    [{int, day},                      %% ��Ӧ������
	     {int, diamond},                  %% ������ˮ��
	     {list_int, items},               %% ��������ƷId
	     {list_int, items_count},         %% ��������Ʒ����
	     {int, exp},                      %% �����ľ���
	     {int, point}                     %% �����Ļ���
	    ]},
	   {polymorph_props_item_tplt,
	    [{int, id},                       %% ID
	     {int, duration},                 %% ����ʱ��
	     {int, effect_id},                %% Ч��ID
	     {string, message}                %% ʹ�ý����Ϣ
	    ]},
	   {lottery_item_tplt,                %% �齱��Ʒ(����)
	    [{int, id},                       %% άһid
	     {int, group_id},                 %% ��id
	     {int, item_id},                  %% ��Ʒid
	     {int, item_count},               %% ��Ʒ����  
	     {int, rate}                      %% ���� 
	    ]},
	   {score_lottery_item_tplt,                %% �齱��Ʒ(������)
	    [{int, id},                       %% άһid
	     {int, group_id},                 %% ��id
	     {int, item_id},                  %% ��Ʒid
	     {int, item_count},               %% ��Ʒ����  
	     {int, rate}                      %% ���� 
	    ]},
	   {search_item_tplt,                 %% �ռ���Ʒ
	    [{int, id},                       %% άһid
	     {int, type},                     %% ����(0 ��ͨ��Ʒ, 1 ������Ʒ)
	     {int, item_id},                  %% ��Ʒid
	     {int, rate}                      %% ���� 
	    ]},
	   {charm_rate_tplt,                  %% �������ʱ�
	    [{int, charm},                     %% ����
	    {int, rate}                       %% ��������0 - 100 
	   ]},
	   {rate_tplt,                        %% ���ʱ�
	    [{int, id},                       %% ����Id
	     {int, rate},                     %% ����
	     {int, type}                      %% ��������
	    ]},
	   {item_dress_additional_properties_tplt,      %% ��װ��������
	    [{int, id},                                 %% ��װID
	     {string, charm}                            %% ����ֵ
	    ]},
	   {furniture_additional_properties_tplt,                %% ��װ��������
	    [{int, id},                                      %% ��װID
	     {int, decoration}                               %% װ�޶�
	    ]},
	   {event_tplt,               %% �¼���
	    [{int, id},                %% Id
	     {string, event},          %% �¼�����
	     {int, rate},              %% ����
	     {int, item_id},           %% ��������ƷId
	     {int, diamond},           %% ������ˮ��
	     {int, exp},               %% �����ľ���ֵ
	     {int, hp}                 %% ����������ֵ
	    ]},
	   {produce_level_tplt,
	    [{int, level},
	     {int, experience},
	     {int, horizontal}
	    ]},
	   {produce_manual_tplt,              %% ��Ʒ����ͼ��
	    [{int, item_id},                  %% item_id
	     {int, produce_level},            %% �ϳɵȼ�
	     {int, consume_diamond},          %% ����ˮ��
	     {string, material_item},         %% ԭ����
	     {string, finished_item},         %% ��Ʒ
	     {int, success_rate},             %% �ɹ�����
	     {int, experience}                %% ����ֵ
	    ]},
	   {daily_active_tplt,                %% ÿ�ջ�Ծ��
	    [{int, id},                       %% 
	     {string, desc},                  %% �������ݣ�����)
	     {list_string, event},            %% ����¼���api 
	     {int, add_score},                %% ÿ�μӶ��ٷ� 
	     {int, max_score}                 %%
	    ]},	   
	   {daily_active_score_tplt,          %% ÿ�ջ�Ծ����
	    [{int, score},                    %% 
	     {list_int, reward_items},        %% ������Ʒ
	     {list_int, reward_items_count},  %% ������Ʒ������
	     {int, diamond},                  %% ������ˮ��
	     {int, exp},                      %% �����ľ���
	     {int, point}                     %% �����Ļ���
	    ]},	   
	   {daily_active_tplt_1,                %% ÿ�ջ�Ծ��
	    [{int, id},                       %% 
	     {string, desc},                  %% �������ݣ�����)
	     {list_string, event},            %% ����¼���api 
	     {int, add_score},                %% ÿ�μӶ��ٷ� 
	     {int, max_score}                 %%
	    ]},	   
	   {daily_active_score_tplt_1,          %% ÿ�ջ�Ծ����
	    [{int, score},                    %% 
	     {list_int, reward_items},        %% ������Ʒ
	     {list_int, reward_items_count},  %% ������Ʒ������
	     {int, diamond},                  %% ������ˮ��
	     {int, exp}                       %% �����ľ���
	    ]},	   
	   {crop_tplt,                        %% �����
	    [{int, crop_id},                  %% crop_id
	     {string, name},                  %% ���ӵ�������
	     {int, price_type},               %% �۸�����: 1-ˮ��   2-�����
	     {int, price},                    %% ����ļ۸�
	     {int, level},                    %% �����Ҫ����������ȼ������ܹ���ֲ
	     {int, event_count},              %% �ɳ��ڼ䷢�����¼�����
	     {int, ripe_time},                %% ���������ʱ��
	     {string, fruit_id},              %% ��ʵ��ID
	     {int, count},                    %% ����
	     {string, intro},                 %% ����
	     {string, seedling},              %% С��ģ��
	     {string, fruit_model},           %% ����ģ��
	     {string, icon}                   %% ͼ��
	    ]},
	   {ring_task_front_task_tplt,
	    [{int, ring_count},
	     {int, type},
	     {int, id}
	    ]},
	   {dialogue_task_tplt,
	    [{int, id},
	     {string, content},
	     {string, npc_options},
	     {string, npc_content},
	     {string, target},
	     {int, npc_id},
	     {string, npc_name}
	    ]},
	   {deliver_goods_task_tplt,
	    [{int, id},
	     {string, content},
	     {string, npc_options},
	     {string, npc_content},
	     {string, target},
	     {int, npc_id},
	     {string, npc_name},
	     {int, require_item}
	    ]},
	   {find_item_task_tplt,
	    [{int, id},
	     {string, content},
	     {string, npc_options},
	     {string, npc_content},
	     {string, target},
	     {int, area_event_id},
	     {string, map_name},
	     {int, reward_item}
	    ]},
	   {collect_task_tplt,
	    [{int, id},
	     {string, content},
	     {string, target},
	     {int, require_item},
	     {int, require_item_count}
	    ]},
	   {function_task_tplt,
	    [{int, id},
	     {string, content},
	     {string, target},
	     {string, event},
	     {int, count}
	    ]},
	   {post_reward_task_tplt,
	    [{int, id},
	     {string, content},
	     {int, require_item1},
	     {int, require_item1_count},
	     {string, require_item1_content},
	     {int, require_item2},
	     {int, require_item2_count},
	     {string, require_item2_content},
	     {int, require_item3},
	     {int, require_item3_count},
	     {string, require_item3_content},
	     {list_int, reward_items},
	     {list_int, reward_items_count},
	     {int, reward_diamond},
	     {int, reward_exp}
	    ]},
	   {ring_task_tplt,
	    [{int, ring_count},
	     {int, due_time},
	     {int, start_require_item},
	     {int, stop_require_item},
	     {int, stop_require_item_count},
	     {list_int, reward_items},
	     {list_int, reward_items_count},
	     {int, reward_diamond},
	     {int, reward_exp},
	     {int, q_coin}
	    ]},
	   {mind_quiz_tplt,
	    [{int, level},
	     {int, reward_items_probability},
	     {list_int, reward_items},
	     {list_int, reward_items_count},
	     {int, reward_diamond},
	     {int, reward_exp}
	    ]},
	   {intimate_level,
	    [{int, level},
	     {int, toplimit},
	     {string, name},
	     {string, tooltip},
	     {string, icon}
	    ]},
	   {mateup_diamond,
	    [{int, level},
	     {int, diamond}
	    ]},
	   {make_up_tplt,  %% ������
	    [{int, level},  %% �ȼ�
	     {string, items}%% ��Ʒ�б� 
	    ]},
	   {flower_shake_tplt,
	    [{int, nthtime},
	     {int, diamond},
	     {int, exp},
	     {int, item_id},
	     {int, item_count},
	     {int, love_coin}
	    ]},	   
	   {flower_love_coin_shake_tplt,
	    [{int, nthtime},
	     {int, diamond},
	     {int, exp},
	     {int, item_id},
	     {int, item_count},
	     {int, love_coin},
	     {int, item_rate}
	    ]},	   
	   {single_payment_return_tplt,
	    [{int, consume_amount},
	     {string, award_items}
	    ]},
	   {total_payment_return_tplt,
	    [{int, consume_amount},
	     {int, return_diamond},
	     {string, return_items}
	    ]},
	   {item_upgrade_tplt,
	    [{int, item_sub_id},
	     {string, consume_items},
	     {int, consume_diamond},
	     {int, upgraded_item_id},
	     {int, upgraded_property}
	    ]
	   },
	   {yy_gift_tplt,
	    [{int, id},             
	     {int, type},       %% �������1.���ţ�2.��ͨ��3.�߼���4.������5.����  
	     {int, hot},
	     {int, price},      %% ����۸�
	     {int, recv_price}, %% ʵ�ռ۸�
	     {int, probability}, %% ���ظ���
	     {int, back_price},  %% ���ؼ۸�
	     {int, display_type},
	     {int, display_id}
	    ]
	   },
	   
	   {love_coin_recharge_tplt,
	    [{int, id},
	     {int, buy_love_coin},
	     {int, reward_love_coin},
	     {int, q_coin}
	    ]},
	   {flowerpot_unlock,    %% ��������
	    [{int, number},
	     {int, level},
	     {int, coin},
	     {int, item_id1},    %% ��ƷID
	     {int, goods_id1},   %% ��ƷID
	     {int, count1},
	     {int, item_id2},
	     {int, goods_id2},   %% ��ƷID
	     {int, count2},
	     {int, item_id3},
	     {int, goods_id3},   %% ��ƷID
	     {int, count3},
	     {int, item_id4},
	     {int, goods_id4},   %% ��ƷID
	     {int, count4}
	    ]},
	   {normal_sprite_tplt,         %% С����ģ���
	    [{int, id},          %% ����ID
	     {int, appraise},    %% ���۵�����ٺ�, ����С����
	     {int, hp},          %% ���С������Ҫ���Ķ�������
	     {int, buff_id},     %% buff��id, �������buff, ����0
	     {string, modal},    %% ����ģ��
	     {string, show},     %% ����ʱ����ʾ����
	     {string, dispear},  %% ��ʧʱ����ʾ����
	     {string, particle}  %% ����Ч��
	    ]},
	   {sprite_upgrade_tplt, %% С��������ģ���
	    [{int, index},       %% ����ֵ, ���õ�
	     {int, id},          %% ����ID
	     {int, level},    
	     {int, show_count},  
	     {int, award_money},
	     {int, award_exp}, 
	     {string, award_item}
	    ]},

	   {sys_shop_class_tplt,
	    [{int, id},
	     {int, type},
	     {int, buytype},
	     {string, icon},
	     {string, description},
	     {int, newcomer},
	     {int, auto_fitment},
	     {int, unlock},
	     {int, unlock_level},
	     {int, unlock_money},
	     {list_int, unlock_material},
	     {list_int, unlock_material_count},
	     {list_int, unlock_material_shop_id}
	    ]},
	   {exp_transition,
	    [{int, old_min},
	     {int, old_max},
	     {int, new_min},
	     {int, new_max}
	    ]},
	   {exchange_tplt,
	   [{int, id},
	    {int, type},
	    {int, item1_id},
	    {int, item1_num},
	    {int, item2_id},
	    {int, item2_num},
	    {int, item3_id},
	    {int, item3_num},
	    {int, item4_id},
	    {int, item4_num},
	    {string, reward_module},
	    {string, source_icon},
	    {string, reward_icon}, 
	    {string, reward_params}
	   ]},
	   {player_food_tplt,                  %% ʳ��ϵͳ
	    [{int, id},                        %% id
	     {int, upgrade_id},                %% ��Ӧ��������Id
	     {int, level},                     %% ������Ҫ�ĵȼ�
	     {int, is_lock},                   %% Ĭ���Ƿ���ס
	     {int, min_stock},                 %% ��С���
	     {int, max_stock},                 %% �����
	     {list_int, expand_stock_diamond}, %% ��������Ҫ��ˮ��
	     {list_int, expand_stock_time},    %% ��������Ҫ��ʱ��
	     {list_int, expand_stock_love_coin},%% ��������Ҫ�İ����
	     {int, max_upgrade_level},
	     {int, player_level},
	     {int, house_level},
	     {int, unlock_diamond},
	     {string, particle},
	     {string, unsatisfy}
	    ]},
	   {player_food_upgrade_tplt,          %% ʳ��������
	    [{int, upgrade_id},                %% ������Id
	     {list_int, item_ids},             %% ������Ҫ����Ʒ
	     {list_int, item_count},           %% ������Ҫ������
	     {list_int, shop_ids},
	     {int, decoration},                %% ������Ҫ�ĺ�����
	     {int, diamond},                   %% ������Ҫ��ˮ��
	     {int, next_upgrade_id}            %% ��һ������Id
	    ]},
	   {player_food_product_tplt,          %% ʳ��������
	    [{int, product_id},                %% ��Ʒ��Id��ʳ��������Idһһ��Ӧ
	     {string, name},                   %% ����
	     {string, icon},                   %% ͼ��
	     {int, level},                     %% �Ǽ�
	     {int, diamond},                   %% ˮ��
	     {int, consume_time},              %% ���ĵ�ʱ��
	     {int, copies},                    %% ÿ�񼸷�
	     {float, price},                   %% ÿ�ݼ۸�
	     {int, consume_speed},             %% �����ٶ�
	     {int, sale_time},                 %% ����ʱ��
	     {int, love_coin},                 %% ���������Ҫ�ķѵİ����
	     {string, desc}                    %% ����
	    ]},
	   {player_food_produce_area_tplt,     %% ʳ�����������
	    [{int, id},
	     {list_int, item_ids},
	     {list_int, item_count},
	     {list_int, shop_ids},
	     {int, diamond}
	    ]},
	   {buff_tplt,                   %% buff
	    [{int, id},                  %% buff��ID
	     {int, type},                %% ����
	     {int, duration},            %% ����ʱ��
	     {string, normal_icon},      %% ������icon
	     {string, disable_icon},     %% �����õ�icon
	     {string, hint},             %% ������ʾ
	     {string, sys_msg},          %% ϵͳ��Ϣ����ʾ
	     {string, param}             %% ����
	    ]},
	   {waiter_tplt,		  %% ����ģ���
	    [{int, id},			  %% ����id
	     {string, waiter_name},	  %% ��������
	     {int, waiter_lv},		  %% ���ߵȼ�
	     {int, waiter_type},		  %% �������
	     {int, player_lv},             %% ��Ӷ��ҵȼ�
	     {string, explain},            %% ˵��
	     {int, coin_rate},             %% ����ˮ�����ּ���
	     {int, exp_rate},              %% ����������ּ���
	     {int, item_drop_rate},        %% ������Ʒ���伸��
	     {string, speciality_explain}, %% �س�˵��
	     {int, employ_money},	  %% ��Ӷ�۸�
	     {string, waiter_mod_name},	  %% ����ģ���ļ���
	     {string, picture},            %% ����ͷ��
	     {int, up_id},                 %% ����������ID
	     {int, up_coin},               %% ������Ҫ�۸�
	     {int, up_house_lv}            % ������Ҫ���ݵȼ�
	    ]},
	   {party_drink_tplt,              %% �ɶ���Ⱦ�
	    [{int, id},			   %% ʳ��ID
	     {string, name},		   %% ����
	     {int, price},	           %% ��Ҫ���Ѷ���
	     {int, type},		   %% ���ѵ�����
	     {int, master_score},          %% ���˿��Ի�ö��ٻ���
	     {int, guest_score},           %% ���˿��Ի�ö��ٻ���
	     {int, shout_count},           %% �������
	     {int, shouted_count}          %% ����͵�����
	    ]},
	   {player_charm_tplt,
	    [{int, id},
	     {string, name},
	     {int, sex}
	    ]},
	   {party_food_tplt,
	    [{int, id},				%% ʳ��ID
	     {int, diamond},			%% ����ˮ��
	     {int, hp},				%% ��������
	     {int, point},			%% ��������
	     {list_int, item_ids},		%% �������Ʒid
	     {list_int, item_counts},		%% �������Ʒ����
	     {list_int, item_rate},		%% �������Ʒ����
	     {string, food_name},		%% ʳ������
	     {string, model_name},		%% ģ������
	     {list_int, item_box_ids},		%% ����ID
	     {list_int, item_box_counts}	%% ��������
	    ]}
	  ])
       ).
