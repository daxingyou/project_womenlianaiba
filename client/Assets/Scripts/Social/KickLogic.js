/*
//kick logic center
//creat by fullzhu 2012.9.13
//last edit at 2012.9.13 by fullzhu
*/
#pragma strict
#pragma downcast

private static var instance : KickLogic;
function Awake(){
	instance=this;
	
	RegistNetMsg();
	RegistEventMsg();
}
static function GetInstance(){
	return instance;
}

function Start () {
	Init();
}

function Init() {
}

function RegistNetMsg() {
}

function RegistEventMsg() {
	//EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOUSE_CREATED), HandleNotifyHouseOwnerInfo);
}

//callback

//logic function for external interface
function ReqKickPlayer(account : String) {
	var packet:req_kick_guest = new req_kick_guest();
	packet.target_player = account;
	NetHelper.Send(packet);
}

//logic function for interal

//data operate