#pragma strict

/*--------------------------------------------------
网络消息处理(2011/10/28 create by hezhr)
--------------------------------------------------*/
// Use this for initialization
var waterpp_start_time : int = 120000;
var waterpp_hide_time : int = 5000;

function Start ()
{
	registEvent();
	CommemorationDayMgr.getSingleton().registEvent();
}
//--------------------------------------------------
// 注册事件
public function registEvent()
{
	// 网络消息事件
	NetHelper.RegistHandler(new notify_sys_msg(), handle_notify_sys_msg);
	NetHelper.RegistHandler(new notify_update_house_name(), handle_notify_update_house_name);
	NetHelper.RegistHandler(new notify_player_data(), handle_notify_player_data);
	NetHelper.RegistHandler(new notify_other_player_data(), handle_notify_other_player_data);
	NetHelper.RegistHandler(new notify_sync_walk_type(), handle_notify_sync_walk_type);
	NetHelper.RegistHandler(new notify_start_walk(), handle_notify_start_walk);
	NetHelper.RegistHandler(new notify_stop_walk(), handle_notify_stop_walk);
	NetHelper.RegistHandler(new notify_sys_broadcast(), handle_notify_sys_broadcast);
	NetHelper.RegistHandler(new notify_player_leave_scene(), handle_notify_player_leave_scene);
	NetHelper.RegistHandler(new notify_sys_time(), handle_notify_sys_time);
	NetHelper.RegistHandler(new notify_house_visit_log(), HandleNotifyVisitLog);
	NetHelper.RegistHandler(new notify_update_player_guide(), handle_notify_update_player_guide);
	NetHelper.RegistHandler(new notify_house_visit_log_add(), handle_notify_house_visit_log_add);
	NetHelper.RegistHandler(new notify_level_exp(), handle_notify_level_exp);
	NetHelper.RegistHandler(new notify_hp(), handle_notify_hp);
	NetHelper.RegistHandler(new notify_today_water_flower(), NotifyIsWatered);
	NetHelper.RegistHandler(new notify_around_change_dress(), NotifyBoardcastChangeDress);
	NetHelper.RegistHandler(new notify_wish_add(), NotifyAddWish);
	NetHelper.RegistHandler(new notify_wish_add_fail(), NotifyAddWishFail);
	NetHelper.RegistHandler(new notify_wish_list(), NotifyWishList);
	NetHelper.RegistHandler(new notify_wish_delete(), NotifyDelWish);
	NetHelper.RegistHandler(new notify_wish_satisfy_successfully(), NotifySatisfyWishSucc);
	NetHelper.RegistHandler(new notify_wish_satisfy_fail(), NotifySatisfyWishFail);
	NetHelper.RegistHandler(new notify_wish_history_list(), NotifyWishRecord);
	NetHelper.RegistHandler(new notify_set_house_welcome_words(), NotifySetWelcomeTextResult);
	NetHelper.RegistHandler(new notify_chat_world(), NotifyChatWorld);
	NetHelper.RegistHandler(new notify_start_body_action(), NotifyPlayAnimation);
	NetHelper.RegistHandler(new notify_end_body_action(), NotifyEndSelfAnim);
	NetHelper.RegistHandler(new notify_house_right_grade(), NotifyHouseRightGrade);
	NetHelper.RegistHandler(new notify_move_house_success(), NotifyMoveHouseSucc);
	NetHelper.RegistHandler(new notify_special_house_list(), NotifySpecialHouseList);
	NetHelper.RegistHandler(new notify_self_special_house_list(), NotifyMySpecialHouseList);
	NetHelper.RegistHandler(new notify_searching_items(), NotifySearchingItmes);
	NetHelper.RegistHandler(new notify_search_items_result(), NotifyCollectResult);
	NetHelper.RegistHandler(new notify_self_msgs(), NotifySelfMsgs);
	NetHelper.RegistHandler(new notify_open_search_items_ui(), NotifyOpenStartSearchUI);
	NetHelper.RegistHandler(new notify_first_payment_return_status(), NotifyFirstPaymentStatus);
	NetHelper.RegistHandler(new notify_buy_special_house_success(), NotifyBuySpecialHouseSuccess);
	//NetHelper.RegistHandler(new notify_party_score_coin(), NotifyPartyScoreCoin);
	NetHelper.RegistHandler(new notify_buy_sys_shop_goods(), NotifyBuySysShopGoods);
	NetHelper.RegistHandler(new notify_exchange(), NotifyExchange);
}
//--------------------------------------------------
// 处理通知玩家数据消息
function handle_notify_player_data(evt:GameEvent, pack:notify_player_data)
{
	//Debug.Log("===== notify palyer data -> player account: " + pack.basic_data.account);
	var player:GameObject = ScenePlayerMgr.createPlayer(pack.basic_data);
	
    var p:Player = player.GetComponent(Player);
    p.setEquips(pack.basic_data.body);
    
    //transform
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_TRANSFORM_INIT),pack.basic_data);
	Property.getInstance().setPlayerCharm(pack.basic_data.charm);
}
//--------------------------------------------------
// 处理通知其他玩家数据消息
function handle_notify_other_player_data(evt:GameEvent, pack:notify_other_player_data)
{
	//Debug.Log("===== notify other palyer data -> player account: " + pack.player.basic_data.account);
	var p: GameObject = ScenePlayerMgr.createPlayer(pack.player.basic_data);
	// 设置坐标
	p.transform.position = Vector3(pack.curr_pos.x, pack.curr_pos.y, pack.curr_pos.z);
	var pm:PlayerMove = p.GetComponent(PlayerMove);
	pm.setWalkType(pack.type);
	var dest: Vector3 = Vector3(pack.dest_pos.x, pack.dest_pos.y, pack.dest_pos.z);
	if (p.transform.position != dest) {
		pm.startWalk(dest, p.GetComponent(Player));
	}
	
    var com:Player = p.GetComponent(Player);
    com.setEquips(pack.player.basic_data.body);
    //
    EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_CREATE_OTHER_PLAYER), p);
    //transform
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_TRANSFORM_INIT),pack.player.basic_data);	
}
//--------------------------------------------------
// 处理通知行走类型消息
function handle_notify_sync_walk_type(evt:GameEvent, pack:notify_sync_walk_type)
{
	ScenePlayerMgr.notifyWalkType(pack.account, pack.type);
}
//--------------------------------------------------
// 处理通知开始行走消息
function handle_notify_start_walk(evt:GameEvent, pack:notify_start_walk)
{
	var dest:Vector3 = Vector3(pack.dest_pos.x, pack.dest_pos.y, pack.dest_pos.z);
	ScenePlayerMgr.notifyStartWalk(pack.account, dest);
}
//--------------------------------------------------
// 处理通知停止行走消息
function handle_notify_stop_walk(evt:GameEvent, pack:notify_stop_walk)
{
	var dest:Vector3 = Vector3(pack.pos.x, pack.pos.y, pack.pos.z);
	ScenePlayerMgr.notifyStopWalk(pack.account, dest);
}
//--------------------------------------------------
// 请求系统时间
static function request_sys_time()
{
	var packet:req_sys_time = new req_sys_time();
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 处理通知系统时间消息
function handle_notify_sys_time(evt:GameEvent, pack:notify_sys_time)
{
	Global.m_SysTime = pack.sys_time;
	SysTimer.init(pack.sys_time);
	AmbientMgr.getSingleton().syncDayNight(true);
}
//--------------------------------------------------
// 处理通知玩家离开场景消息
function handle_notify_player_leave_scene(evt:GameEvent, pack:notify_player_leave_scene)
{
	ScenePlayerMgr.removePlayer(pack.account);
}
//--------------------------------------------------
// 处理通知系统消息消息
function handle_notify_sys_msg(evt:GameEvent, pack:notify_sys_msg)
{
	Global.GetSysMsgHandler().notifySysMsg(pack.code,pack.Params);
}
//--------------------------------------------------
//处理系统公告消息
function handle_notify_sys_broadcast(evt:GameEvent, pack:notify_sys_broadcast)
{
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_SYSBOARD_UPDATE),pack);
}
//---------------------------------------------------
function handle_notify_update_player_guide(evt:GameEvent, pack:notify_update_player_guide)
{

}
function HandleNotifyVisitLog(evt:GameEvent, pack:notify_house_visit_log)
{
	if(iGUICode_NoticeRoot.getInstance())
		iGUICode_NoticeRoot.getInstance().AddVisitLogs(pack.visit_logs);
}
//--
function handle_notify_house_visit_log_add(evt:GameEvent, pack:notify_house_visit_log_add)
{

}
//--
function handle_notify_update_house_name(evt:GameEvent, pack:notify_update_house_name){
	if(pack.result == 1)
		UI.getUI().OpenMsgbox("",Define.modifyok,true);
	else
		UI.getUI().OpenMsgbox("",Define.modifyfailed,true);
}
//--
function handle_notify_level_exp(evt:GameEvent, pack:notify_level_exp){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LV_EXP),pack);
}
//--
function handle_notify_hp(evt:GameEvent, pack:notify_hp){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HP),pack);
}
//--
function NotifyIsWatered(evt:GameEvent, pack:notify_today_water_flower){
	var result:int = pack.result;
	if(result == 1)
		if(PaoPaoControl.GetPpCtrol(iGUICode_MainUI.getInstance().waterTipPP) == null)
			new PaoPaoControl(waterpp_start_time,0,waterpp_hide_time,1,iGUICode_MainUI.getInstance().waterTipPP, iGUICode_MainUI.getInstance().flower);
}

//--
function NotifyBoardcastChangeDress(evt:GameEvent, pack:notify_around_change_dress){
	var player : GameObject = ScenePlayerMgr.getPlayer(pack.account);
	if(player == null){
		Debug.Log("player is not exsit!!");
	} else {
		var p:Player = player.GetComponent(Player);
		p.setBodyData(pack.body);	// 保存其他玩家装备数据
		// 玩家不在使用家具时才显示新的装备
		if (false == FurnitureInteract.getInstance().isInteractFurniture(pack.account)) {
	    	p.setEquips(pack.body);
	    }
	}
}
//--接收加入愿望
function NotifyAddWish(evt:GameEvent, pack:notify_wish_add){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_WISH_ADD),pack);
}
//--接收加入愿望失败
function NotifyAddWishFail(evt:GameEvent, pack:notify_wish_add_fail){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_WISH_ADD_FAIL),pack);
}
//--接收愿望列表
function NotifyWishList(evt:GameEvent, pack:notify_wish_list){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_WISH_LIST),pack);
}
//--接收删除愿望
function NotifyDelWish(evt:GameEvent, pack:notify_wish_delete){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_WISH_DEL),pack);
}
//--接收成功满足愿望
function NotifySatisfyWishSucc(evt:GameEvent, pack:notify_wish_satisfy_successfully){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_SATISFY_SUCC),pack);
}
//--接收满足愿望失败
function NotifySatisfyWishFail(evt:GameEvent, pack:notify_wish_satisfy_fail){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_SATISFY_FAIL),pack);
}
//--接收愿望记录
function NotifyWishRecord(evt:GameEvent, pack:notify_wish_history_list){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_WISH_RECORD),pack);
}
//--
function NotifySetWelcomeTextResult(evt:GameEvent, pack:notify_set_house_welcome_words){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_SETWELCOME_RESULT),pack);
}
//--
function NotifyChatWorld(evt:GameEvent, pack:notify_chat_world){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_SPEAKERWORD),pack);
}
//--
function NotifyPlayAnimation(evt:GameEvent, pack:notify_start_body_action){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_PLAY_ANIMAITON),pack);
}
//--
function NotifyEndSelfAnim(evt:GameEvent, pack:notify_end_body_action){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_END_SANI),pack);
}
//--
function NotifyHouseRightGrade(evt:GameEvent, pack:notify_house_right_grade){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_HOUSE_RIGHT_GRADE),pack);
}
//--
function NotifyMoveHouseSucc(evt:GameEvent, pack:notify_move_house_success){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MOVE_HOUSE_SUCCESS));
}
//--
function NotifySpecialHouseList(evt : GameEvent, pack : notify_special_house_list){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_SPECIAL_HOUSE_LIST), pack);
}
//--
function NotifyMySpecialHouseList(evt : GameEvent, pack : notify_self_special_house_list){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_MY_SPECIAL_HOUSE_LIST), pack);
}
//--
function NotifySearchingItmes(evt : GameEvent, pack : notify_searching_items){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_SEARCHING_ITEMS), pack);
}
//--notify_search_items_result
function NotifyCollectResult(evt : GameEvent, pack : notify_search_items_result){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_COLLECT_RESULT), pack);
}
//--
function NotifySelfMsgs(evt : GameEvent, pack : notify_self_msgs){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_SELF_MSGS), pack);
}
//--
function NotifyOpenStartSearchUI(evt : GameEvent, pack : notify_open_search_items_ui){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_OPEN_START_SEARCH_UI), pack);
}
//--
function NotifyFirstPaymentStatus(evt : GameEvent, pack : notify_first_payment_return_status){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_FIRST_PAYMENT_STATUS), pack);
}
//-----------
function NotifyBuySpecialHouseSuccess(evt : GameEvent, pack : notify_buy_special_house_success){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.SENDMSGTOYYSUBCHANNEL), new MsgToYYParams(SENDTO_YYSUBCHANNEL_MSGTYPE.FROM_SPECIALHOUSE, "", ""));
}
//-----------
/*
function NotifyPartyScoreCoin(evt : GameEvent, pack : notify_party_score_coin){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_PARTY_SCORE_COIN), pack);
}
*/
//---
function NotifyBuySysShopGoods(evt : GameEvent, pack : notify_buy_sys_shop_goods){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_BUY_SYS_SHOP_GOODS), pack);
}
//-----
function NotifyExchange(evt : GameEvent, pack : notify_exchange){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_EXCHANGE), pack);
}