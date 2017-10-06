#pragma strict
#pragma downcast
/*
//player platform manager
//creat by fullzhu 2012.9.17
//last edit at 2012.9.17 by fullzhu
*/

enum PlatType{
	PT_PENGYOU = 0,
	PT_QZONE = 1,
	PT_TAPP = 2,
	PT_YY = 3,
}

private static var mPlatType : PlatType;

private static var instance : PlatformMgr;
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

function Update() {
}

function Init(plat : String) {
	if(plat == "pengyou") {
		mPlatType = PlatType.PT_PENGYOU;
	} else if(plat == "qzone") {
		mPlatType = PlatType.PT_QZONE;
	} else if(plat == "tapp") {
		mPlatType = PlatType.PT_TAPP;
	} else if(plat == "yy") {
		mPlatType = PlatType.PT_YY;
	} else {
		Debug.Log("error apptype!!!");
	}
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLATFORM_TYPE_INIT),mPlatType);
}

//net event regist
function RegistNetMsg() {
	//NetHelper.RegistHandler(new notify_npc_close_dialog(), HandleNotifyCloseDialog);
}

//game event regist()
function RegistEventMsg() {
}

//handle game event
function HandleNotifyLeaveScene(evt:GameEvent, obj:System.Object) {
}

//extern function
function LoadImageUrl(url : String, callback : Function) {
}

function LoadPlatInfo(account : String, callback : Function) {
}

function LoadPlatInfo(accountList : ArrayList, callback : Function) {
}

//data operate
static function GetPlatType() : PlatType {
	return mPlatType;
}

static function IsPlatPY() : boolean {
	return mPlatType == PlatType.PT_PENGYOU;
}

static function IsPlatQZone() : boolean {
	return mPlatType == PlatType.PT_QZONE;
}

static function IsPlatQTwiter() : boolean {
	return mPlatType == PlatType.PT_TAPP;
}

static function IsPlatYY() : boolean {
	return mPlatType == PlatType.PT_YY;
}
