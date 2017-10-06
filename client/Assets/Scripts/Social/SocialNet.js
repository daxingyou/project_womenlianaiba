#pragma strict
#pragma downcast
/*
//social net center
//create by fullzhu 2012.6.6
//last edit at 2012.6.6 by fullzhu
*/

private static var instance : SocialNet;
function Awake(){
	instance=this;
	
	RegistNetMsg();
}
static function GetInstance(){
	return instance;
}

function Start () {
}

//net event regist
function RegistNetMsg() {
	//NetHelper.RegistHandler(new notify_invite_active(), HandleNotifyInviteList);
}

//handle net event
function HandleNotifyInviteList(evt:GameEvent, pack:notify_invite_active) {
	//EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_INVITE_LIST),pack);
}

//client request
/*
function ReqInviteList() {
	var packet:req_invite_active = new req_invite_active();
	NetHelper.Send(packet);
}
*/

//logic function for external interface

//logic function for interal

//data operate