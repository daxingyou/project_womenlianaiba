using System.Collections.Generic;
using UnityEngine;
public class house_tplt
{
    public int id;
    public string name;
    public int level;
    public int type;
    public string scene_id;
    public string house_furniture;
    public float born_x;
    public float born_y;
    public float born_z;
    public int max_players;
}
public class test_tplt
{
    public int id;
    public string name;
}
public class house_furniture_tplt
{
    public int id;
    public int furniture_id;
    public int item_temp_id;
    public int x;
    public int z;
    public int height;
    public int flr;
    public int face;
}
public class item_tplt
{
    public int id;
    public string name;
    public int type;
    public string imageset;
    public string icon;
    public int intro_id;
    public int overlap;
    public int bind;
    public int use_del;
    public int sell_price;
    public int sub_id;
    public int effect_time_id;
    public int use_id;
    public int voiceid;
    public int dvoiceid;
    public int uvoiceid;
}
public class item_dress_tplt
{
    public int id;
    public string name;
    public int sex;
    public int equip_pos;
    public List<int> equip_placeholder  = new List<int>();
    public int equip_disp_id;
    public int place;
    public string action;
    public int type1;
    public int type2;
}
public class house_comp
{
    public int id;
    public string name;
    public int prop_id;
    public int dis_id;
    public string pos;
    public string rot;
    public string scale;
}
public class common_scene
{
    public int id;
    public string name;
    public string file_res;
    public float x;
    public float y;
    public float z;
}
public class mutex_actions
{
    public int id;
    public string name;
    public List<int> allow_actions  = new List<int>();
}
public class domestic_service_tplt
{
    public int id;
    public string name;
    public int house_clean;
    public int money_rate;
    public int discount_rate;
    public string image;
}
public class domestic_price_tplt
{
    public int house_level;
    public int money;
}
public class work_tplt
{
    public int id;
    public int grade;
    public int money;
    public int need_clean;
    public int need_health;
    public int need_charm;
    public int need_active;
    public int need_disease;
    public int property_id;
    public int event_rate;
    public List<int> event_ids  = new List<int>();
    public List<int> event_rates  = new List<int>();
    public string workImage;
    public string typeImageSet;
    public string typeImage;
}
public class house_magic_box_tplt
{
    public int house_level;
    public List<int> box_ids  = new List<int>();
    public List<int> box_rates  = new List<int>();
    public int max_box_count;
    public List<int> player_box_range  = new List<int>();
    public int max_create_box_times;
}
public class magic_box_tplt
{
    public int id;
    public List<int> money_range  = new List<int>();
    public List<int> item_ids  = new List<int>();
    public List<int> item_rates  = new List<int>();
}
public class player_level_magic_box_tplt
{
    public int player_level;
    public int max_box_per_day;
    public int reward_times;
}
public class house_garbage_tplt
{
    public int house_level;
    public List<int> garbage_ids  = new List<int>();
    public List<int> garbage_rates  = new List<int>();
    public int max_count;
}
public class garbage_tplt
{
    public int id;
    public List<int> money_range  = new List<int>();
    public List<int> item_ids  = new List<int>();
    public List<int> item_rates  = new List<int>();
}
public class random_garbage_tplt
{
    public int id;
    public List<int> interval  = new List<int>();
    public List<int> garbage_count  = new List<int>();
}
public class work_event_tplt
{
    public int id;
    public int reward_money;
    public List<int> reward_items  = new List<int>();
    public int item_rate;
    public string image;
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
public class player_property_tplt
{
    public int property_id;
    public int player_clean;
    public int player_health;
    public int player_charm;
    public int active_value;
}
public class player_property_by_stime_tplt
{
    public int min_property;
    public int max_property;
    public int ref_id;
}
public class sys_shop_tplt
{
    public int goods_id;
    public int item_id;
    public int type;
    public int sex;
    public int price;
    public int intro;
    public int commend;
    public int broadcast_id;
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
public class item_effect_time_tplt
{
    public int id;
    public int type;
    public int effect_time;
    public int trade_cut_time;
    public int del_time;
}
public class furni_interact_tplt
{
    public int function_id;
    public int property_id;
    public int status;
}
public class player_task_tplt
{
    public int task_id;
    public string title;
    public string intention;
    public int step_count;
    public List<int> props  = new List<int>();
    public List<int> props_count  = new List<int>();
    public List<int> require_items  = new List<int>();
    public List<int> require_items_count  = new List<int>();
    public string describe;
    public List<int> select_reward_items  = new List<int>();
    public List<int> select_reward_items_count  = new List<int>();
    public List<int> fixed_reward_items  = new List<int>();
    public List<int> fixed_reward_items_count  = new List<int>();
    public int reward_game_coin;
    public int reward_eq_coin;
    public int time_limit;
    public int property_id;
    public int is_repeat;
    public int is_show;
    public int is_give_up;
}
public class farm_task_tplt
{
    public int task_id;
    public string title;
    public string intention;
    public string describe;
    public string imageset;
    public string image;
    public List<int> fixed_reward_items  = new List<int>();
    public List<int> fixed_reward_items_count  = new List<int>();
    public int reward_game_coin;
    public int reward_eq_coin;
    public int exp;
    public int time_limit;
    public int is_repeat;
}
public class chain_task_tplt
{
    public int task_id;
    public List<int> tasks  = new List<int>();
    public int is_repeat;
    public int is_restart;
}
public class farm_seed_tplt
{
    public int id;
    public string name;
    public int expect_output;
    public int fruit_id;
    public int sprout_time;
    public int s_leaf_time;
    public int b_leaf_time;
    public int bloom_time;
    public int fruit_time;
    public int pick_time;
    public int drought_id;
    public int pest_id;
    public int grass_id;
    public int use_level;
    public int pick_exp;
    public int redland;
}
public class farm_damage_tplt
{
    public int id;
    public int sprout_ratio;
    public int s_leaf_ratio;
    public int b_leaf_ratio;
    public int bloom_ratio;
    public int fruit_ratio;
    public int interval;
    public int reduce_health;
}
public class farm_pet_tplt
{
    public int pet_id;
    public int rate;
    public int min_coin;
    public int max_coin;
}
public class common_define_tplt
{
    public string key;
    public string value;
}
public class farm_shop_tplt
{
    public int item_id;
    public int gameprice;
    public int eqprice;
    public string intro;
    public string special;
    public int level;
    public int repeat_buy;
    public int add_exp;
    public List<string> rewards = new List<string>();
}
public class farm_assart_tplt
{
    public int plot_index;
    public int level;
    public int money;
}
public class farm_level_tplt
{
    public int level;
    public int next_exp;
    public int sow_exp;
    public int water_exp;
    public int weed_exp;
    public int worm_exp;
    public int hoeing_exp;
    public string title;
}
public class farm_decoration_tplt
{
    public int id;
    public int type;
    public int static_model;
    public int dynamic_model;
    public string scene_name;
}
public class farm_decoration_init_tplt
{
    public int background;
    public int house;
    public int doghouse;
    public int signpost;
    public int fence;
    public int scarecrow;
    public int billboard;
    public int billboard_content;
}
public class farm_setting_tplt
{
    public string water;
    public string weed;
    public string worm;
    public string put_grass;
    public string put_pest;
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
public class farm_prop_tplt
{
    public int id;
    public int type;
    public int effect_range;
    public int effect_time;
    public int effect_output;
    public List<int> effect_stage  = new List<int>();
    public int reduce_time;
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
public class player_property_interaction_tplt
{
    public int id;
    public int monitor_player_clean;
    public int monitor_player_health;
    public int monitor_player_charm;
    public int monitor_active_value;
    public int ref_id;
}
public class farmland_upgrade_tplt
{
    public int land_num;
    public int level;
    public int money;
}
public class red_farmland_harvest_tplt
{
    public int id;
    public int ratio;
    public int type;
    public int data;
    public int count;
}
public class farmfruit_aberrance_tplt
{
    public int seed_id;
    public int ratio1;
    public int fruit_id1;
    public int ratio2;
    public int fruit_id2;
    public int ratio3;
    public int fruit_id3;
    public int ratio4;
    public int fruit_id4;
    public int ratio5;
    public int fruit_id5;
    public int ratio6;
    public int fruit_id6;
    public int ratio7;
    public int fruit_id7;
    public int ratio8;
    public int fruit_id8;
    public int ratio9;
    public int fruit_id9;
    public int ratio10;
    public int fruit_id10;
    public int ratio11;
    public int fruit_id11;
    public int ratio12;
    public int fruit_id12;
}
public class gift_box_tplt
{
    public int id;
    public int type;
    public string name;
    public int game_coin;
    public int eq_coin;
    public int model_id;
    public string imageset;
    public string image;
    public string desc;
}
public class gift_card_tplt
{
    public int id;
    public int type;
    public string name;
    public int game_coin;
    public int eq_coin;
    public string imageset;
    public string image;
    public string desc;
    public string url;
}
public class farmhoeing_awards_tplt
{
    public int level;
    public int ratio;
    public List<int> item_id  = new List<int>();
    public int count;
}
public class flower_tplt
{
    public int id;
    public int flower_id;
    public int level;
    public int grow;
    public string model;
}
