#pragma strict
#pragma downcast

private static var instance : YYChannelListLogic;
public static var Ctrl : Controller = new Controller();
private var mPubInfo : pub_info = new pub_info();			// 频道信息
private var mGuestArray : Array = new Array();				// 客人列表
var OpenYYPubUIHideRoot : String[];							// 打开酒吧场景主界面要隐藏的界面
//
static function getInstance() : YYChannelListLogic{
	return instance;
}
//
function Awake(){
	instance = this;
	registEvt();
}

// Use this for initialization
function Start () {
	registNetEvent();
}
//
function registEvt(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_ROOT), handleClickCloseChannelListRoot);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.YY_AUDIO_LEAVE_ROOM), handleYyAuDioLeaveRoom);
}
//
function registNetEvent(){
	NetHelper.RegistHandler(new notify_pub_list(), handle_notify_pub_list);
	NetHelper.RegistHandler(new notify_enter_pub_channel(), handle_notify_enter_pub_channel);
	NetHelper.RegistHandler(new notify_channel_add_player(), handle_notify_channel_add_player);
	NetHelper.RegistHandler(new notify_channel_del_player(), handle_notify_channel_del_player);
	NetHelper.RegistHandler(new notify_update_pub_player_count(), handle_notify_update_pub_player_count);
	NetHelper.RegistHandler(new broadcast_send_yy_gift(), handle_broadcast_send_yy_gift);
	NetHelper.RegistHandler(new notify_enter_pub_scene(), handle_notify_enter_pub_scene);
	NetHelper.RegistHandler(new notify_open_yy_recharge_ui(), handle_notify_open_yy_recharge_ui);
}
//
function handle_notify_pub_list(evt : GameEvent, pack : notify_pub_list){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_PUB_LIST), pack);
}
//
function handle_notify_enter_pub_channel(evt : GameEvent, pack : notify_enter_pub_channel){
	// 保存数据
	mPubInfo = pack.info;
	mGuestArray = pack.accounts.ToArray();
	// 打开界面
	closeChannelListRoot();
	openVoiceChannelUI();
}
//
function handle_notify_channel_add_player(evt : GameEvent, pack : notify_channel_add_player){
	addGuestArray(pack.account_info);
	Ctrl.Excute("CHANNEL_ADD_GUEST", pack.account_info.account);
}
//
function handle_notify_channel_del_player(evt : GameEvent, pack : notify_channel_del_player){
	delGuestArray(pack.account);
	Ctrl.Excute("CHANNEL_DEL_GUEST", pack.account);
}
//
function handle_notify_update_pub_player_count(evt : GameEvent, pack : notify_update_pub_player_count){
	Ctrl.Excute("UPDATE_PUB_PLAYER_COUNT", pack);
}
//
function handle_broadcast_send_yy_gift(evt : GameEvent, pack : broadcast_send_yy_gift){
	Ctrl.Excute("BROADCAST_YY_GIFT", pack);
}
//
function handle_notify_enter_pub_scene(evt : GameEvent, pack : notify_enter_pub_scene){
	// 保存数据
	mPubInfo = pack.info;
	mGuestArray = pack.accounts.ToArray();
	// 设置主玩家初始位置
	var enterPos : Vector3 = Vector3(pack.enter_pos.x, pack.enter_pos.y, pack.enter_pos.z);
	ScenePlayerMgr.getMainPlayer().transform.position = enterPos;
	ScenePlayerMgr.clearPlayer();
	// 初始场景
	EQGameSceneMgr.getSingleton().enterPubScene(pack.template_id);
	// 初始界面
	closeChannelListRoot();
	openYYPubUI();
}
//
function handle_notify_open_yy_recharge_ui(evt : GameEvent, pack : notify_open_yy_recharge_ui){
	UI.getUI().OpenMsgbox("", Define.getContent(569), "", okCallback, "", canelCallback);
}
function okCallback(caller : iGUIElement)
{
	ExternalFlatform.recharge();
}
// 
function canelCallback(caller : iGUIElement) {}
//
function handleClickCloseChannelListRoot(evt : GameEvent, obj : Object){
	closeChannelListRoot();
}
//
function handleYyAuDioLeaveRoom(evt : GameEvent, obj : Object){
	//var roomId : UInt64 = YYAudioLogic.GetInstance().GetmRoomID();
	//YYAudioLogic.GetInstance().ReqUpdateRoomID(mPubInfo.pub_id, roomId);
}
//
function openChannelListRoot(){
	if(!UI.getUI().GetUIRoot("YYChannelListRoot"))
		UI.getUI().OpenUIRoot("YYChannelListRoot");
	else
		UI.getUI().EnableUIRoot("YYChannelListRoot", true);
	UI.getUI().SetModal("YYChannelListRoot", true);
}
//
function closeChannelListRoot(){
	UI.getUI().SetModal("YYChannelListRoot", false);
	UI.getUI().EnableUIRoot("YYChannelListRoot", false);
}
//打开频道列表界面
function openVoiceChannelUI(){
	YYGiftDisplayLogic.getInstance().clearGift2D();
	if (UI.getUI().GetUIRoot("YYPubUI")){
		closeYYPubUI();
	}
	//
	if (UI.getUI().GetUIRoot("VoiceChannelUI")){
		closeVoiceChannelUI();
	}
	UI.getUI().OpenUIRoot("VoiceChannelUI");
	UI.getUI().SetModal("VoiceChannelUI", true);
	AmbientMgr.getSingleton().setMode(AmbientMode.AM_CHANGE);
}
//关闭频道列表界面
function closeVoiceChannelUI(){
	UI.getUI().SetModal("VoiceChannelUI", false);
	UI.getUI().CloseUIRoot("VoiceChannelUI");
	AmbientMgr.getSingleton().setMode(AmbientMode.AM_NORMAL);
}
//频道列表界面是否最小化
function isVoiceChannelUIMinimize() : boolean {
	var root : iGUIRoot = UI.getUI().GetUIRoot("VoiceChannelUI");
	if (null == root)
		return false;
	
	return false == root.enabled;
}
//最小化频道列表界面
function minimizeVoiceChannelUI(){
	UI.getUI().SetModal("VoiceChannelUI", false);
	UI.getUI().EnableUIRoot("VoiceChannelUI", false);
	AmbientMgr.getSingleton().setMode(AmbientMode.AM_NORMAL);
}
//最大化频道列表界面
function maximizeVoiceChannelUI(){
	UI.getUI().EnableUIRoot("VoiceChannelUI", true);
	UI.getUI().SetModal("VoiceChannelUI", true);
	AmbientMgr.getSingleton().setMode(AmbientMode.AM_CHANGE);
}
//打开酒吧场景主界面
function openYYPubUI(){
	UI.getUI().EnableUIRoot(OpenYYPubUIHideRoot, false);
	closeVoiceChannelUI();
	UI.getUI().OpenUIRoot("YYPubUI");
	if (UI.getUI().IsModal())
	{
		UI.getUI().SetPassive("YYPubUI", true);
	}
}
//关闭酒吧场景主界面
function closeYYPubUI(){
	UI.getUI().CloseUIRoot("YYPubUI");
	UI.getUI().EnableUIRoot(OpenYYPubUIHideRoot, true);
}
//
function initChannelList(){
	openChannelListRoot();
	reqPubList(1);
}
//
function reqPubList(page : int){
	var req : req_pub_list = new req_pub_list();
	req.page = page;
	NetHelper.Send(req);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CHANNEL_LIST_PAGE_CHANGE), page);
}
//请求离开酒吧频道
function reqLeavePubChannel(pubId : UInt64){
	var req : req_leave_pub_channel = new req_leave_pub_channel();
	req.pub_id = pubId;
	NetHelper.Send(req);
}
//请求踢人
function reqKickChannelPlayer(account : String){
	var req : req_kick_channel_player = new req_kick_channel_player();
	req.account = account;
	NetHelper.Send(req);
}
//请求送礼
function reqSendYYGift(account : String, id : int, count : int){
	var req : req_send_yy_gift = new req_send_yy_gift();
	req.recver_account = account;
	req.gift_id = id;
	req.gift_count = count;
	NetHelper.Send(req);
}
//请求进入酒吧场景
function reqEnterPubScene(){
	var req : req_enter_pub_scene = new req_enter_pub_scene();
	NetHelper.Send(req);
}
//获取频道信息
public function getPubInfo() : pub_info{
	return mPubInfo;
}
//获取客人列表
public function getGuestArray() : Array{
	rankGuestAdmin(true);	// 把在线的管理人员排在最前面
	return mGuestArray;
}
//是否在客人列表内
private function inGuestArray(account : String) : int{
	for (var i:int = 0; i<mGuestArray.Count; ++i){
		var info : pub_account_info = mGuestArray[i];
		if (account == info.account)
			return i;
	}
	return -1;
}
//添加客人
private function addGuestArray(info : pub_account_info){
	var index : int = inGuestArray(info.account);
	if (-1 != index)
		return;
	
	mGuestArray.Unshift(info);
}
//删除客人
private function delGuestArray(account : String){
	var index : int = inGuestArray(account);
	if (-1 == index)
		return;
	
	mGuestArray.RemoveAt(index);
}
//把管理员放在列表最前面
private function rankGuestAdmin(onlyOnline : boolean){
	for (var i:int=0; i<mPubInfo.admin_list.Count; ++i){
		var admin : pub_account_info = mPubInfo.admin_list[0];
		if (onlyOnline && -1 != inGuestArray(admin.account)){
			delGuestArray(admin.account);
			addGuestArray(admin);
		} else if (false == onlyOnline){
			addGuestArray(admin);
		}
	}
	var owner : pub_account_info = mPubInfo.owner_info;
	if (onlyOnline && -1 != inGuestArray(owner.account)){
		delGuestArray(owner.account);
		addGuestArray(owner);
	} else if (false == onlyOnline){
		addGuestArray(owner);
	}
}
//当前玩家是否为主播
public function isAnchor() : boolean{
	return isAnchor(DataCenter.getMainPlayerAccount());
}
//是否为主播帐号
public function isAnchor(account : String) : boolean{
	return account == mPubInfo.owner_info.account;
}
//当前玩家是否为管理员(包括主持人和协管员)
public function isAdmin() : boolean{
	return isAdmin(DataCenter.getMainPlayerAccount());
}
//是否为管理员帐号(包括主持人和协管员)
public function isAdmin(account : String) : boolean{
	if (account == mPubInfo.owner_info.account)
		return true;
	
	for (var admin : String in mPubInfo.admin_list){
		if (account == admin)
			return true;
	}
	return false;
}
//是否在频道内
public function inPubChannel() : boolean{
	return inPubChannel(mPubInfo.pub_id);
}
//是否在频道内
public function inPubChannel(pub_id : UInt64) : boolean{
	if (pub_id != mPubInfo.pub_id)
		return false;
	
	if (UI.getUI().GetUIRoot("VoiceChannelUI") || UI.getUI().GetUIRoot("YYPubUI"))
		return true;
	
	return false;
}
//
