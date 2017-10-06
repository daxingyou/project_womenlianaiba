public class ver_validate_result
{
    public static readonly int ver_ok = 1;
    public static readonly int ver_fail = 2;
}
public class login_result
{
    public static readonly int lr_ok = 1;
    public static readonly int lr_fail = 2;
    public static readonly int lr_fail_pwd = 3;
    public static readonly int lr_fail_account = 4;
    public static readonly int lr_fail_version = 5;
    public static readonly int lr_no_roles = 6;
    public static readonly int lr_fail_other = 7;
    public static readonly int lr_fail_mateuping = 8;
}
public class create_role_result
{
    public static readonly int rr_ok = 1;
    public static readonly int rr_fail = 2;
}
public class enter_game_result
{
    public static readonly int sr_ok = 1;
    public static readonly int sr_fail = 2;
}
public class package_type
{
    public static readonly int pt_bag = 1;
    public static readonly int pt_body = 2;
}
public class invitation_type
{
    public static readonly int ivt_trade = 1;
    public static readonly int ivt_enter_house = 2;
    public static readonly int ivt_make_friend = 3;
    public static readonly int ivt_private_party = 4;
}
public class party_type
{
    public static readonly int ivt_normal = 1;
    public static readonly int ivt_private = 2;
}
public class sys_broadcast_type
{
    public static readonly int sbt_sys_show = 1;
    public static readonly int sbt_at_time = 2;
    public static readonly int sbt_player_behavior = 3;
    public static readonly int sbt_gm = 4;
    public static readonly int sbt_farm = 5;
    public static readonly int sbt_per_day = 6;
}
public class track_task_result
{
    public static readonly int ttr_ok = 1;
    public static readonly int ttr_fail = 2;
}
public class cancel_track_task_result
{
    public static readonly int cttr_ok = 1;
    public static readonly int cttr_fail = 2;
}
public class task_give_up_result
{
    public static readonly int tgur_ok = 1;
    public static readonly int tgur_fail = 2;
}
public class ui_type
{
    public static readonly int uit_sysshop = 1;
    public static readonly int uit_npcshop = 2;
    public static readonly int uit_farmdepot = 3;
    public static readonly int uit_depot = 4;
    public static readonly int uit_bag = 5;
    public static readonly int uit_housetransaction = 6;
}
public class sg_type
{
    public static readonly int sgt_farm = 1;
}
public class comment_result
{
    public static readonly int cr_ok = 1;
    public static readonly int cr_fail = 2;
}
public class disease_type
{
    public static readonly int dt_normal = 1;
    public static readonly int dt_white = 2;
    public static readonly int dt_yellow = 3;
    public static readonly int dt_purple = 4;
    public static readonly int dt_red = 5;
}
public class buy_house_result
{
    public static readonly int bhr_replace = 1;
    public static readonly int bhr_add = 2;
}
public class set_house_welcome_words_result
{
    public static readonly int shwwr_ok = 1;
    public static readonly int shwwr_fail = 2;
}
public class set_house_permission_result
{
    public static readonly int shpr_ok = 1;
    public static readonly int shpr_fail = 2;
}
public class house_permission_type
{
    public static readonly int hpt_none = 1;
    public static readonly int hpt_friend = 2;
}
public class furniture_permission_type
{
    public static readonly int fpt_yes = 1;
    public static readonly int fpt_no = 2;
}
public class house_visit_type
{
    public static readonly int hvt_visit = 1;
    public static readonly int hvt_leave = 2;
    public static readonly int hvt_pick_garbage = 3;
}
public class clear_house_log_result
{
    public static readonly int chlr_ok = 1;
    public static readonly int chlr_fail = 2;
}
public class accept_invite_type
{
    public static readonly int accept_invite_yes = 1;
    public static readonly int accept_invite_no = 2;
}
public class anonymous_type
{
    public static readonly int at_yes = 1;
    public static readonly int at_no = 2;
}
public class buy_goods_type
{
    public static readonly int bgt_buy = 1;
    public static readonly int bgt_use = 2;
}
public class pay_goods_type
{
    public static readonly int pgt_game_gold = 1;
    public static readonly int pgt_love_coin = 2;
}
public class task_type
{
    public static readonly int tt_daily = 1;
    public static readonly int tt_chain = 2;
}
public class sex_type
{
    public static readonly int st_boy = 1;
    public static readonly int st_girl = 2;
    public static readonly int st_unknow = 3;
}
public class item_type
{
    public static readonly int it_dress = 1;
    public static readonly int it_furniture = 2;
    public static readonly int it_object = 3;
    public static readonly int it_prop = 4;
}
public class change_dress_type
{
    public static readonly int cdt_ok = 1;
    public static readonly int cdt_coin_fail = 2;
    public static readonly int cdt_item_fail = 3;
}
public class audio_status_type
{
    public static readonly int ast_open = 1;
    public static readonly int ast_close = 2;
}
public class mateup_status_type
{
    public static readonly int mst_single = 1;
    public static readonly int mst_mateuping = 2;
    public static readonly int mst_mateuped = 3;
    public static readonly int mst_breakuping = 4;
}
public class money_type
{
    public static readonly int mt_diamond = 1;
    public static readonly int mt_love_coin = 2;
    public static readonly int mt_point = 3;
}
public class notify_gift_type
{
    public static readonly int nsgt_ok = 1;
    public static readonly int nsgt_fail = 2;
}
public class enter_house_type
{
    public static readonly int eht_party = 1;
    public static readonly int eht_photo_friend = 2;
    public static readonly int eht_friend_list = 3;
    public static readonly int eht_attention = 4;
    public static readonly int eht_owner_house = 5;
    public static readonly int eht_guest_book = 6;
    public static readonly int eht_menu = 7;
    public static readonly int eht_wish = 8;
    public static readonly int eht_person_info = 9;
    public static readonly int eht_visit_log = 10;
    public static readonly int eht_ranking_list = 11;
    public static readonly int eht_yy_audio = 12;
}
public class wish_type
{
    public static readonly int wt_normal = 1;
    public static readonly int wt_house = 2;
}
public class show_type
{
    public static readonly int st_show = 1;
    public static readonly int st_hide = 2;
}
public class share_type
{
    public static readonly int st_party = 1;
    public static readonly int st_attention = 2;
    public static readonly int st_pair = 3;
    public static readonly int st_itemmake = 4;
}
public class pack_task_type
{
    public static readonly int ptt_dialogue = 1;
    public static readonly int ptt_deliver_goods = 2;
    public static readonly int ptt_find_item = 3;
    public static readonly int ptt_collect = 4;
    public static readonly int ptt_function = 5;
    public static readonly int ptt_post_reward = 6;
}
public class complete_post_reward_type
{
    public static readonly int cprt_ok = 1;
    public static readonly int cprt_fail = 2;
}
public class common_bool
{
    public static readonly int cb_true = 1;
    public static readonly int cb_false = 2;
}
public class walk_type
{
    public static readonly int wt_none = 1;
    public static readonly int wt_walk = 2;
    public static readonly int wt_run = 3;
}
public class close_window_type
{
    public static readonly int cwt_welcome = 1;
}

public class Config
{
    public static readonly int PROTO_VER = 562;
}
