#pragma strict

/*
//player message manager
//creat by fullzhu 2011.11.21
//last edit at 2011.11.25 by fullzhu
*/


static private var mAccount : String = "";
static private var mLoverAccount : String = "";
static private var mHostAccount : String = "";
static private var mHostLoverAccount : String = "";

static private var mNewMessage : boolean = false;					//unread message

private static var instance : MessageMgr;
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
	NetHelper.RegistHandler(new notify_guest_book_delete(), HandleNotifyGuestBookDelete);
	NetHelper.RegistHandler(new notify_guest_book_add(), HandleNotifyGuestBookAdd);
	NetHelper.RegistHandler(new notify_guest_book_clear(), HandleNotifyGuestBookClear);
	//NetHelper.RegistHandler(new notify_clear_house_log(), HandleNotifyGuestNewsClear);
	NetHelper.RegistHandler(new notify_new_guest_book(), HandleNotifyGuestBookNew);
	NetHelper.RegistHandler(new notify_house_guest_book(), HandleNotifyHouseMessage);
	NetHelper.RegistHandler(new notify_offline_notify(), HandleNotifyOfflineMessage);
	NetHelper.RegistHandler(new notify_set_guest_book_opened(), HandleNotifySetGuestBookOpened);
}

//game event regist()
function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOUSE_CREATED), HandleNotifyHouseOwnerInfo);	
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_CLEAR_MESSAGE), HandleEventReqClearMessage);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_CLEAR_NEWS), HandleEventReqClearNews);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_DEL_MESSAGE), HandleEventReqDeleteMessage);
}

//handle net event
function HandleNotifyGuestBookDelete(evt:GameEvent, pack:notify_guest_book_delete) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_MESSAGE_DELETE),pack);
}

function HandleNotifyGuestBookAdd(evt:GameEvent, pack:notify_guest_book_add) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_MESSAGE_ADD),pack);
}

function HandleNotifyGuestBookClear(evt:GameEvent, pack:notify_guest_book_clear) {
	//EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_DEL_MESSAGE),callback.userData);
}

function HandleNotifyGuestNewsClear(evt:GameEvent, pack:notify_clear_house_log) {
	//EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_DEL_MESSAGE),callback.userData);
}

function HandleNotifyGuestBookNew(evt:GameEvent, pack:notify_new_guest_book) {
	mNewMessage = true;
	iGUICode_MainUI.getInstance().SetMessageBtnFlash(true);
}

function HandleNotifyHouseMessage(evt:GameEvent, pack:notify_house_guest_book) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_MESSAGE_DATA),pack);
}

function HandleNotifyOfflineMessage(evt:GameEvent, pack:notify_offline_notify) {
	if(pack.count > 0) {
		mNewMessage = true;
		iGUICode_MainUI.getInstance().SetMessageBtnFlash(true);
	}
}

function HandleNotifySetGuestBookOpened(evt:GameEvent, pack:notify_set_guest_book_opened) {
}

//handle game event

function HandleNotifyHouseOwnerInfo(evt:GameEvent, obj:house_info) {
	if(!obj)
		return;
	
	mAccount = ScenePlayerMgr.getMainPlayerAccount();
	if(mAccount == obj.boy) {
		mLoverAccount = obj.girl;
	} else if(mAccount == obj.girl) {
		mLoverAccount = obj.boy;
	}
	mHostAccount = obj.boy;
	mHostLoverAccount = obj.girl;
	
	if(mAccount == mHostAccount || mAccount == mHostLoverAccount) {
		ReqOfflineMsg();
	}
}

function HandleEventReqClearMessage(evt:GameEvent, obj:System.Object) {
	ReqGuestBookClear(mAccount);
}

function HandleEventReqClearNews(evt:GameEvent, obj:System.Object) {
	ReqGuestNewsClear();
}

function ReqSendMessage(content : String, opened : int) {
	content = content.Replace("\n", "");
	ReqGuestBookAdd(mHostAccount,mAccount,content,opened);
}

function HandleEventReqDeleteMessage(evt:GameEvent, obj : UInt64) {
	ReqGuestBookDelete(mHostAccount,obj);
}

//client request
function ReqHouseMessage() {
	var packet:req_house_guest_book = new req_house_guest_book();
	if(mHostAccount != "") {
		packet.house_id = DataCenter.getHouseID(mHostAccount);
	} else {
		packet.house_id = DataCenter.getHouseID(mHostLoverAccount);
	}
	NetHelper.Send(packet);
}

function ReqGuestBookDelete(account : String, id : UInt64) {
	var packet:req_guest_book_delete = new req_guest_book_delete();
	packet.account = account;
	packet.id = id;
	NetHelper.Send(packet);
}


function ReqGuestBookAdd(owner_account : String, guest_account : String, content : String, opened : int) {
	var packet:req_guest_book_add = new req_guest_book_add();
	packet.owner = owner_account;
	packet.guest = guest_account;
	packet.content = content;
	packet.opened = opened;
	NetHelper.Send(packet);
}

function ReqGuestBookClear(account : String) {
	var packet:req_guest_book_clear = new req_guest_book_clear();
	packet.account = account;
	NetHelper.Send(packet);
}

function ReqGuestNewsClear() {
	var packet:req_clear_house_log = new req_clear_house_log();
	NetHelper.Send(packet);
}

function ReqOfflineMsg() {
	var packet:req_offline_notify = new req_offline_notify();
	NetHelper.Send(packet);
}

function ReqSetGuestBookOpened(id : UInt64, opened : int) {
	var packet:req_set_guest_book_opened = new req_set_guest_book_opened();
	packet.id = id;
	packet.opened = opened;
	NetHelper.Send(packet);
}

//logic function for external interface
function OnEnterHouse(account : String) {
	mAccount = account;
	mHostAccount = account;
}

function OnEnterVisit(account : String) {
	mHostAccount = account;
}

//logic function for interal
function MessageFilter(message : String) {
	//TODO:
}

//data operate

static public function GetAccount() {
	return mAccount;
}

static public function GetLoverAccount() {
	return mLoverAccount;
}

static public function GetHostAccount() {
	return mHostAccount;
}

static public function GetHostLoverAccount() {
	return mHostLoverAccount;
}

static public function SetNewMessageStatue(bRead : boolean) {
	mNewMessage = bRead;
}

static public function IsNewMessageUnread() {
	return mNewMessage;
}

