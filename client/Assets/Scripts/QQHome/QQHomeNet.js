#pragma strict
#pragma downcast
/*
//qqhome net center
//create by fullzhu 2012.4.6
//last edit at 2012.4.6 by fullzhu
*/


private static var instance : QQHomeNet;
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
	NetHelper.RegistHandler(new notify_vip_gift_receive_info(), HandleNotifyQQHomeBase);
	NetHelper.RegistHandler(new notify_vip_gift(), HandleNotifyQQHomeGiftGetResult);
}

//handle net event
function HandleNotifyQQHomeBase(evt:GameEvent, pack:notify_vip_gift_receive_info) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_QQHOME_INIT),pack);
}

function HandleNotifyQQHomeGiftGetResult(evt:GameEvent, pack:notify_vip_gift) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_QQHOME_GIFT_GET_RESULT),pack);
}

//client request
function ReqQQHomeBase() {
	var packet:req_vip_gift_receive_info = new req_vip_gift_receive_info();
	NetHelper.Send(packet);
}

function ReqQQHomeGetNewerGift(array : ArrayList) {
	var packet:req_receive_vip_beginner_gift = new req_receive_vip_beginner_gift();
	packet.items = array;
	NetHelper.Send(packet);
}

function ReqQQHomeGetDailyGift(array : ArrayList) {
	var packet:req_receive_vip_daily_gift = new req_receive_vip_daily_gift();
	packet.items = array;
	NetHelper.Send(packet);
}

//logic function for external interface

//logic function for interal