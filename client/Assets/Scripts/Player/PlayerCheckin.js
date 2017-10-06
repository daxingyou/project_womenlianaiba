#pragma strict
#pragma downcast
/*
//player sign in logic
//creat by fullzhu 2011.11.16
//last edit at 2011.12.9 by fullzhu
*/

private var mAccount : String = "";
private var mLoverAccount : String = "";
private var mHostAccount : String = "";
private var mHostLoveAccount : String = "";

private static var instance : PlayerCheckin;
function Awake(){
	instance=this;
	
	RegistNetMsg();
	RegistEventMsg();
}
static function GetInstance(){
	return instance;
}

function Start () {
}

//net event regist
function RegistNetMsg() {
	NetHelper.RegistHandler(new notify_checkin_add(), HandleNotifyCheckinAdd);
	NetHelper.RegistHandler(new notify_last_checkins(), HandleNotifyLastCheckin);
	NetHelper.RegistHandler(new notify_checkin_list(), HandleNotifyCheckinList);
	NetHelper.RegistHandler(new notify_checkin_delete(), HandleNotifyCheckinDel);
	NetHelper.RegistHandler(new notify_new_checkin(), HandleNotifyCheckinNew);
	NetHelper.RegistHandler(new notify_set_checkin_opened(), HandleNotifySetCheckinOpened);
}

function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOUSE_CREATED), HandleNotifyHouseOwnerInfo);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_CHECKIN_LIST), HandleEventReqCheckinList);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_CHECKIN_LAST), HandleEventReqCheckinLast);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_DEL_CHECKIN_RECORD), HandleEventReqCheckinDel);
}

//handle net event
function HandleNotifyCheckinAdd(evt:GameEvent, pack:notify_checkin_add) {
	Debug.Log("revc notify_checkin_add");
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_CHECKIN_ADD),pack);
}

function HandleNotifyLastCheckin(evt:GameEvent, pack:notify_last_checkins) {
	Debug.Log("revc notify_last_checkins");
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_CHECKIN_LAST),pack);
}

function HandleNotifyCheckinList(evt:GameEvent, pack:notify_checkin_list) {
	Debug.Log("revc notify_checkin_list");
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_CHECKIN_LIST),pack);
}

function HandleNotifyCheckinDel(evt:GameEvent, pack:notify_checkin_delete) {
	Debug.Log("revc notify_checkin_delete");
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_CHECKIN_DEL),pack);
}

function HandleNotifyCheckinNew(evt:GameEvent, pack:notify_new_checkin) {
	Debug.Log("revc notify_checkin_new");
}

function HandleNotifySetCheckinOpened(evt:GameEvent, pack:notify_set_checkin_opened) {
}

//handle game event
function HandleNotifyHouseOwnerInfo(evt:GameEvent, obj:house_info) {
	if(!obj)
		return;
	
	mAccount = ScenePlayerMgr.getMainPlayerAccount();
	mHostAccount = obj.boy;
	mHostLoveAccount = obj.girl;
	
	if(mAccount == obj.boy) {
		mLoverAccount = obj.girl;
	} else if(mAccount == obj.girl) {
		mLoverAccount = obj.boy;
	}
	
	if(iGUICode_CheckinUI.getInstance()) {
		iGUICode_CheckinUI.getInstance().ActiveSmart(false);
		iGUICode_CheckinUI.getInstance().ActiveMain(false);
	}
	
	if(mHostLoveAccount == "" || mHostAccount == "") {
		iGUICode_MainUI.getInstance().love_btn.style.normal.background = Resources.Load("UISkins/Textures/MainUI/single_btn");
		iGUICode_MainUI.getInstance().love_btn.style.hover.background = Resources.Load("UISkins/Textures/MainUI/single_btn_hover");
		iGUICode_MainUI.getInstance().love_btn.style.active.background = Resources.Load("UISkins/Textures/MainUI/single_btn");
	} else {
		iGUICode_MainUI.getInstance().love_btn.style.normal.background = Resources.Load("UISkins/Textures/MainUI/love_sing_in_btn");
		iGUICode_MainUI.getInstance().love_btn.style.hover.background = Resources.Load("UISkins/Textures/MainUI/love_sing_in_btn_hover");
		iGUICode_MainUI.getInstance().love_btn.style.active.background = Resources.Load("UISkins/Textures/MainUI/love_sing_in_btn");
	}
}
function ReqSendCheckin(content : String, opened : int) {
	content = content.Replace("\n", "");
	ReqCheckinAdd(mAccount, content, opened);
}
function HandleEventReqCheckinList(evt:GameEvent, obj:System.Object) {
	ReqCheckinList();
}
function HandleEventReqCheckinLast(evt:GameEvent, obj:System.Object) {
	ReqLastCheckin();
}

function HandleEventReqCheckinDel(evt:GameEvent, obj:System.Object) {
	Debug.Log(obj);
	ReqCheckinDel(obj);
}

//client request
function ReqCheckinAdd(account : String, content : String, opened : int) {
	Debug.Log("send req_checkin_add");
	var packet:req_checkin_add = new req_checkin_add();
	packet.account = account;
	packet.content = content;
	packet.opened = opened;
	NetHelper.Send(packet);
}

function ReqLastCheckin() {
	Debug.Log("send req_last_checkins");
	var packet:req_last_checkins = new req_last_checkins();
	packet.owner = mAccount;
	NetHelper.Send(packet);
}

function ReqCheckinList() {
	Debug.Log("send req_checkin_list");
	var packet:req_checkin_list = new req_checkin_list();
	packet.owner = mHostAccount;
	NetHelper.Send(packet);
}

function ReqCheckinDel(id : String) {
	Debug.Log("send req_checkin_delete");
	var packet:req_checkin_delete = new req_checkin_delete();
	packet.account = mAccount;
	packet.id = id;
	NetHelper.Send(packet);
}

function ReqSetCheckinOpened(id : String, opened : int) {
	var packet:req_set_checkin_opened = new req_set_checkin_opened();
	packet.id = id;
	packet.opened = opened;
	NetHelper.Send(packet);
}

//logic function for external interface

//logic function for interal


//data operate
public function GetAccount() {
	return mAccount;
}

public function GetLoverAccount() {
	return mLoverAccount;
}

public function GetHostLoverAccount() {
	return mHostLoveAccount;
}

public function GetHostAccount() {
	return mHostAccount;
}