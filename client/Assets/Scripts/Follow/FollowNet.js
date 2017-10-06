#pragma strict
/*
//dress net center
//create by fullzhu 2012.3.12
//last edit at 2012.3.12 by fullzhu
*/


private static var instance : FollowNet;
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
	NetHelper.RegistHandler(new notify_add_attention(), HandleNotifyAddAttention);
	NetHelper.RegistHandler(new notify_cancel_attention(), HandleNotifyCancelAttention);
	NetHelper.RegistHandler(new notify_attention_list(), HandleNotifyAttentionList);
}

//handle net event
function HandleNotifyAddAttention(evt:GameEvent, pack:notify_add_attention) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ADD_ATTENTION),pack);
}

function HandleNotifyCancelAttention(evt:GameEvent, pack:notify_cancel_attention) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_CANCEL_ATTENTION),pack);
}

function HandleNotifyAttentionList(evt:GameEvent, pack:notify_attention_list) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ATTENTION_LIST),pack);
}

//client request
function ReqAddAttention(account : String,name : String) {
	var packet:req_add_attention = new req_add_attention();
	packet.account = account;
	packet.name = name;
	NetHelper.Send(packet);
}

function ReqCancelAttention(account : String) {
	var packet:req_cancel_attention = new req_cancel_attention();
	packet.account = account;
	NetHelper.Send(packet);
}

function ReqGetAttentionList() {
	var packet:req_get_attention_list = new req_get_attention_list();
	NetHelper.Send(packet);
}

//logic function for external interface

//logic function for interal

//data operate