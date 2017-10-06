using System.Collections.Generic;
using UnityEngine;
public class house_tplt
{
    public int id;
    public string name;
    public int level;
    public int type;
    public string model;
    public string house_furniture;
    public int born_id;
    public int max_players;
    public int preview_born;
    public string struct_info;
    public int right_grade;
    public int is_single;
    public string icon;
    public string big_icon;
    public string tip;
    public int internal_decoration;
    public int max_furniture;
    public int max_flowerpot;
    public string bg_music;
    public int max_guest;
    public string guest_id;
    public string waiter_pos;
    public int waiter_rotate;
    public int love_coin;
}
public class born
{
    public int id;
    public list_space_float pos;
    public int dir;
    public string lookat;
    public string pitch;
    public string yaw;
    public string zoom;
    public string farclip;
    public string field;
    public string watch_mode;
    public string view_floor;
}
public class house_furniture_tplt
{
    public int id;
    public int furniture_id;
    public int item_temp_id;
    public int x;
    public int z;
    public float height;
    public int flr;
    public int face;
}
public class item_base_tplt
{
    public int item_id;
    public int base_item_id;
}
public class item_tplt
{
    public int id;
    public string name;
    public int type;
    public int use_type;
    public string icon;
    public int overlap;
    public int sell_price;
    public int sub_id;
    public int upgrade_id;
    public int bind;
    public int effect_time_id;
    public int property_id;
    public int use_level;
    public int level;
}
public class item_effect_time_tplt
{
    public int id;
    public int type;
    public int effect_time;
    public int trade_cut_time;
    public int del_time;
}
public class item_dress_tplt
{
    public int id;
    public string name;
    public int sex;
    public int equip_pos;
    public List<int> equip_placeholder  = new List<int>();
    public string model;
    public string model_body;
    public int place;
    public string action;
    public string particle;
    public string attach_pos;
    public int type1;
    public int type2;
}
public class house_comp
{
    public int id;
    public int type;
    public string name;
    public int prop_id;
    public string pos;
    public string rot;
    public string scale;
    public string model;
    public int cull_level;
    public string particle;
    public string particle_pos;
}
public class common_scene
{
    public int id;
    public string name;
    public int copy_count;
    public int max_players;
    public int born_id;
    public string furnitures;
    public string scene_name;
    public int type;
    public string bg_music;
}
public class mutex_actions
{
    public int id;
    public string name;
    public List<int> allow_actions  = new List<int>();
}
public class change_looks_tplt
{
    public int id;
    public int money_type;
    public int money;
}
public class teleport_tplt
{
    public int id;
    public int src_scene_id;
    public float src_x;
    public float src_y;
    public float src_z;
    public float src_radius;
    public int dest_scene_id;
    public float dest_x;
    public float dest_y;
    public float dest_z;
    public int dest_dir;
}
public class create_random_dress
{
    public int id;
    public int sex;
    public int fashion1;
    public int fashion2;
    public int fashion3;
    public int fashion4;
    public int fashion5;
}
public class npc_tplt
{
    public int npc_id;
    public int body;
    public int head;
    public int hair;
    public int equip1;
    public int equip2;
    public int skeleton;
    public string npc_name;
}
public class npc_map_mapping_tplt
{
    public int id;
    public int npc_id;
    public string npc_name;
    public float x;
    public float y;
    public float z;
    public int script_id;
    public int action;
    public int towards;
}
public class player_level_tplt
{
    public int level;
    public int online_time;
}
public class sys_shop_tplt
{
    public int goods_id;
    public int item_id;
    public int type;
    public int money_type;
    public int price;
    public int point;
    public int intro;
    public int commend;
    public int broadcast_id;
    public int sex;
    public int player_level;
    public int visible;
    public int newcomer;
}
public class npc_shop_tplt
{
    public int goods_id;
    public int item_id;
    public int type;
    public int sex;
    public int price;
    public int intro;
    public int sale_type;
}
public class furni_tplt
{
    public int furniture_id;
    public int max_use_player;
    public int use_sex;
    public int permission;
    public List<int> function_list  = new List<int>();
    public int use_type;
    public int status_qty;
}
public class furni_interact_tplt
{
    public int function_id;
    public int property_id;
    public int status;
}
public class common_define_tplt
{
    public string key;
    public string value;
}
public class player_disease_probability_tplt
{
    public int player_health;
    public int probability;
}
public class player_disease_type_tplt
{
    public int type;
    public int rate;
    public int upgrate_probability;
    public int level;
    public int treatment_costs;
    public int min;
    public int max;
    public List<int> special_event_id  = new List<int>();
    public List<int> event_id_probability  = new List<int>();
    public int special_event_probability;
}
public class player_disease_special_event_tplt
{
    public int special_event_id;
    public int property_id;
    public string image;
}
public class house_transaction_tplt
{
    public int id;
    public string name;
    public int type;
    public int recommend;
    public int level;
    public int pay_type;
    public int price;
    public int house_id;
    public string intro;
    public int broadcast_id;
}
public class sys_broadcast_tplt
{
    public int id;
    public string content;
    public int show_seconds;
}
public class holiday_gift
{
    public int sequence_id;
    public int start_day;
    public int duration;
    public int group_id;
    public int gift_type;
    public int item_id;
    public int count;
    public int rate;
}
public class level_info_tplt
{
    public int level;
    public int exp;
    public int max_hp;
    public int hp_restore_time;
    public int max_decoration;
    public float party_owner_calc_exp_a;
    public float party_guest_calc_exp_b;
    public int party_cost_money;
    public int party_add_score;
}
public class flower_tplt
{
    public int id;
    public int flower_id;
    public int level;
    public int grow;
    public string model;
    public string particle;
}
public class gift_box_tplt
{
    public int id;
    public int type;
    public string name;
    public int price;
    public string model;
    public string icon;
    public string intro;
}
public class props_item_tplt
{
    public int id;
    public int target;
    public int del;
    public string intro;
    public string movie;
    public int ui;
    public string audio;
    public int sysmsg;
    public string module;
    public string arguments;
}
public class player_task_tplt
{
    public int task_id;
    public string icon;
    public string title;
    public string describe;
    public List<int> require_items  = new List<int>();
    public List<int> require_items_count  = new List<int>();
    public List<int> reward_items  = new List<int>();
    public List<int> reward_items_count  = new List<int>();
    public int diamond;
    public int experience;
    public int hp;
    public int point;
    public int love_coin;
    public int is_show;
    public int q_coin;
    public string target1;
    public string target2;
    public string target3;
    public int type;
    public int need_player_level;
}
public class daily_task_tplt
{
    public int id;
    public int task_id;
    public int use_type;
    public int level;
    public int rate;
    public int diamond;
}
public class chain_task_tplt
{
    public int id;
    public List<int> task_id  = new List<int>();
    public List<int> next_chain  = new List<int>();
}
public class house_right_tplt
{
    public int grade;
    public string desc;
    public int money_type;
    public int money;
    public int material1;
    public int material1_shop_id;
    public int num1;
    public int material2;
    public int material2_shop_id;
    public int num2;
    public int material3;
    public int material3_shop_id;
    public int num3;
    public int material4;
    public int material4_shop_id;
    public int num4;
    public string icon;
    public string hover_icon;
}
public class special_house_tplt
{
    public int id;
    public int house_tplt_id;
    public int q_coin;
    public int count;
    public int broadcast_id;
}
public class player_special_house_tplt
{
    public int id;
    public List<int> unlock_house_ids  = new List<int>();
    public int love_coin;
    public int broadcast_id;
    public string name;
    public string desc;
    public string icon;
    public string big_icon;
    public int decoration;
    public int furniture_count;
    public int is_show;
}
public class player_login_reward_tplt
{
    public int day;
    public int diamond;
    public List<int> items  = new List<int>();
    public List<int> items_count  = new List<int>();
    public int exp;
    public int point;
}
public class polymorph_props_item_tplt
{
    public int id;
    public int duration;
    public int effect_id;
    public string message;
}
public class lottery_item_tplt
{
    public int id;
    public int group_id;
    public int item_id;
    public int item_count;
    public int rate;
}
public class score_lottery_item_tplt
{
    public int id;
    public int group_id;
    public int item_id;
    public int item_count;
    public int rate;
}
public class search_item_tplt
{
    public int id;
    public int type;
    public int item_id;
    public int rate;
}
public class charm_rate_tplt
{
    public int charm;
    public int rate;
}
public class rate_tplt
{
    public int id;
    public int rate;
    public int type;
}
public class item_dress_additional_properties_tplt
{
    public int id;
    public string charm;
}
public class furniture_additional_properties_tplt
{
    public int id;
    public int decoration;
}
public class event_tplt
{
    public int id;
    public string event;
    public int rate;
    public int item_id;
    public int diamond;
    public int exp;
    public int hp;
}
public class produce_level_tplt
{
    public int level;
    public int experience;
    public int horizontal;
}
public class produce_manual_tplt
{
    public int item_id;
    public int produce_level;
    public int consume_diamond;
    public string material_item;
    public string finished_item;
    public int success_rate;
    public int experience;
}
public class daily_active_tplt
{
    public int id;
    public string desc;
    public List<string> event = new List<string>();
    public int add_score;
    public int max_score;
}
public class daily_active_score_tplt
{
    public int score;
    public List<int> reward_items  = new List<int>();
    public List<int> reward_items_count  = new List<int>();
    public int diamond;
    public int exp;
    public int point;
}
public class daily_active_tplt_1
{
    public int id;
    public string desc;
    public List<string> event = new List<string>();
    public int add_score;
    public int max_score;
}
public class daily_active_score_tplt_1
{
    public int score;
    public List<int> reward_items  = new List<int>();
    public List<int> reward_items_count  = new List<int>();
    public int diamond;
    public int exp;
}
public class crop_tplt
{
    public int crop_id;
    public string name;
    public int price_type;
    public int price;
    public int level;
    public int event_count;
    public int ripe_time;
    public string fruit_id;
    public int count;
    public string intro;
    public string seedling;
    public string fruit_model;
    public string icon;
}
public class ring_task_front_task_tplt
{
    public int ring_count;
    public int type;
    public int id;
}
public class dialogue_task_tplt
{
    public int id;
    public string content;
    public string npc_options;
    public string npc_content;
    public string target;
    public int npc_id;
    public string npc_name;
}
public class deliver_goods_task_tplt
{
    public int id;
    public string content;
    public string npc_options;
    public string npc_content;
    public string target;
    public int npc_id;
    public string npc_name;
    public int require_item;
}
public class find_item_task_tplt
{
    public int id;
    public string content;
    public string npc_options;
    public string npc_content;
    public string target;
    public int area_event_id;
    public string map_name;
    public int reward_item;
}
public class collect_task_tplt
{
    public int id;
    public string content;
    public string target;
    public int require_item;
    public int require_item_count;
}
public class function_task_tplt
{
    public int id;
    public string content;
    public string target;
    public string event;
    public int count;
}
public class post_reward_task_tplt
{
    public int id;
    public string content;
    public int require_item1;
    public int require_item1_count;
    public string require_item1_content;
    public int require_item2;
    public int require_item2_count;
    public string require_item2_content;
    public int require_item3;
    public int require_item3_count;
    public string require_item3_content;
    public List<int> reward_items  = new List<int>();
    public List<int> reward_items_count  = new List<int>();
    public int reward_diamond;
    public int reward_exp;
}
public class ring_task_tplt
{
    public int ring_count;
    public int due_time;
    public int start_require_item;
    public int stop_require_item;
    public int stop_require_item_count;
    public List<int> reward_items  = new List<int>();
    public List<int> reward_items_count  = new List<int>();
    public int reward_diamond;
    public int reward_exp;
    public int q_coin;
}
public class mind_quiz_tplt
{
    public int level;
    public int reward_items_probability;
    public List<int> reward_items  = new List<int>();
    public List<int> reward_items_count  = new List<int>();
    public int reward_diamond;
    public int reward_exp;
}
public class intimate_level
{
    public int level;
    public int toplimit;
    public string name;
    public string tooltip;
    public string icon;
}
public class mateup_diamond
{
    public int level;
    public int diamond;
}
public class make_up_tplt
{
    public int level;
    public string items;
}
public class flower_shake_tplt
{
    public int nthtime;
    public int diamond;
    public int exp;
    public int item_id;
    public int item_count;
    public int love_coin;
}
public class flower_love_coin_shake_tplt
{
    public int nthtime;
    public int diamond;
    public int exp;
    public int item_id;
    public int item_count;
    public int love_coin;
    public int item_rate;
}
public class single_payment_return_tplt
{
    public int consume_amount;
    public string award_items;
}
public class total_payment_return_tplt
{
    public int consume_amount;
    public int return_diamond;
    public string return_items;
}
public class item_upgrade_tplt
{
    public int item_sub_id;
    public string consume_items;
    public int consume_diamond;
    public int upgraded_item_id;
    public int upgraded_property;
}
public class yy_gift_tplt
{
    public int id;
    public int type;
    public int hot;
    public int price;
    public int recv_price;
    public int probability;
    public int back_price;
    public int display_type;
    public int display_id;
}
public class love_coin_recharge_tplt
{
    public int id;
    public int buy_love_coin;
    public int reward_love_coin;
    public int q_coin;
}
public class flowerpot_unlock
{
    public int number;
    public int level;
    public int coin;
    public int item_id1;
    public int goods_id1;
    public int count1;
    public int item_id2;
    public int goods_id2;
    public int count2;
    public int item_id3;
    public int goods_id3;
    public int count3;
    public int item_id4;
    public int goods_id4;
    public int count4;
}
public class normal_sprite_tplt
{
    public int id;
    public int appraise;
    public int hp;
    public int buff_id;
    public string modal;
    public string show;
    public string dispear;
    public string particle;
}
public class sprite_upgrade_tplt
{
    public int index;
    public int id;
    public int level;
    public int show_count;
    public int award_money;
    public int award_exp;
    public string award_item;
}
public class sys_shop_class_tplt
{
    public int id;
    public int type;
    public int buytype;
    public string icon;
    public string description;
    public int newcomer;
    public int auto_fitment;
    public int unlock;
    public int unlock_level;
    public int unlock_money;
    public List<int> unlock_material  = new List<int>();
    public List<int> unlock_material_count  = new List<int>();
    public List<int> unlock_material_shop_id  = new List<int>();
}
public class exp_transition
{
    public int old_min;
    public int old_max;
    public int new_min;
    public int new_max;
}
public class exchange_tplt
{
    public int id;
    public int type;
    public int item1_id;
    public int item1_num;
    public int item2_id;
    public int item2_num;
    public int item3_id;
    public int item3_num;
    public int item4_id;
    public int item4_num;
    public string reward_module;
    public string source_icon;
    public string reward_icon;
    public string reward_params;
}
public class player_food_tplt
{
    public int id;
    public int upgrade_id;
    public int level;
    public int is_lock;
    public int min_stock;
    public int max_stock;
    public List<int> expand_stock_diamond  = new List<int>();
    public List<int> expand_stock_time  = new List<int>();
    public List<int> expand_stock_love_coin  = new List<int>();
    public int max_upgrade_level;
    public int player_level;
    public int house_level;
    public int unlock_diamond;
    public string particle;
    public string unsatisfy;
}
public class player_food_upgrade_tplt
{
    public int upgrade_id;
    public List<int> item_ids  = new List<int>();
    public List<int> item_count  = new List<int>();
    public List<int> shop_ids  = new List<int>();
    public int decoration;
    public int diamond;
    public int next_upgrade_id;
}
public class player_food_product_tplt
{
    public int product_id;
    public string name;
    public string icon;
    public int level;
    public int diamond;
    public int consume_time;
    public int copies;
    public float price;
    public int consume_speed;
    public int sale_time;
    public int love_coin;
    public string desc;
}
public class player_food_produce_area_tplt
{
    public int id;
    public List<int> item_ids  = new List<int>();
    public List<int> item_count  = new List<int>();
    public List<int> shop_ids  = new List<int>();
    public int diamond;
}
public class buff_tplt
{
    public int id;
    public int type;
    public int duration;
    public string normal_icon;
    public string disable_icon;
    public string hint;
    public string sys_msg;
    public string param;
}
public class waiter_tplt
{
    public int id;
    public string waiter_name;
    public int waiter_lv;
    public int waiter_type;
    public int player_lv;
    public string explain;
    public int coin_rate;
    public int exp_rate;
    public int item_drop_rate;
    public string speciality_explain;
    public int employ_money;
    public string waiter_mod_name;
    public string picture;
    public int up_id;
    public int up_coin;
    public int up_house_lv;
}
public class party_drink_tplt
{
    public int id;
    public string name;
    public int price;
    public int type;
    public int master_score;
    public int guest_score;
    public int shout_count;
    public int shouted_count;
}
public class player_charm_tplt
{
    public int id;
    public string name;
    public int sex;
}
public class party_food_tplt
{
    public int id;
    public int diamond;
    public int hp;
    public int point;
    public List<int> item_ids  = new List<int>();
    public List<int> item_counts  = new List<int>();
    public List<int> item_rate  = new List<int>();
    public string food_name;
    public string model_name;
    public List<int> item_box_ids  = new List<int>();
    public List<int> item_box_counts  = new List<int>();
}
