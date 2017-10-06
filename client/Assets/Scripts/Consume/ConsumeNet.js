#pragma strict
/*
//dress net center
//create by fullzhu 2012.4.6
//last edit at 2012.4.6 by fullzhu
*/


private static var instance : ConsumeNet;
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
	NetHelper.RegistHandler(new notify_show_buy_dialog(), HandleNotifyShowBuyDialog);
	NetHelper.RegistHandler(new notify_cancel_order(), HandleNotifyCancelOrder);
	
	//NetHelper.RegistHandler(new notify_cancel_order(), HandleNotifyPowerDialog);
}

//handle net event
function HandleNotifyShowBuyDialog(evt:GameEvent, pack:notify_show_buy_dialog) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_SHOW_BUY_DIALOG),pack);
}

function HandleNotifyCancelOrder(evt:GameEvent, pack:notify_cancel_order) {
}

/*
function HandleNotifyPowerDialog(evt:GameEvent, pack:notify_cancel_order) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_SHOW_POWER_DIALOG),pack);
}
*/

//client request
function ReqCancelQQOrder(orderID : String) {
	var packet:req_cancel_qq_order = new req_cancel_qq_order();
	packet.context = orderID;
	NetHelper.Send(packet);
}

//logic function for external interface

//logic function for interal

//data operate