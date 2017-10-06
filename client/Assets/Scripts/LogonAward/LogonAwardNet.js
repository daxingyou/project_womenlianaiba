#pragma strict
/*
//friend invite net center
//create by fullzhu 2012.5.10
//last edit at 2012.5.10 by fullzhu
*/

private static var instance : LogonAwardNet;
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
	NetHelper.RegistHandler(new notify_login_list(), HandleNotifyLoginList);
	NetHelper.RegistHandler(new notify_give_login_reward(), HandleNotifyGetGiftResult);
}

//handle net event
function HandleNotifyLoginList(evt:GameEvent, pack:notify_login_list) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LOGON_LIST),pack);
}

function HandleNotifyGetGiftResult(evt:GameEvent, pack:notify_give_login_reward) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_GET_LOGON_AWARD_RESULT),pack);
}

//client request
function ReqLoginList() {
	var packet:req_login_list = new req_login_list();
	NetHelper.Send(packet);
}

function ReqGetInviteGift() {
	var packet:req_give_login_reward = new req_give_login_reward();
	NetHelper.Send(packet);
}

//logic function for external interface

//logic function for interal

//data operate