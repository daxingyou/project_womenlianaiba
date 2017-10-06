#pragma strict
#pragma downcast

/*
//items make net center
//create by fullzhu 2012.6.21
//last edit at 2012.6.21 by fullzhu
*/

private static var instance : ItemsMakeNet;
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
	NetHelper.RegistHandler(new notify_produce(), HandleNotifyItemsMakeResult);
}

//handle net event
function HandleNotifyItemsMakeResult(evt:GameEvent, pack:notify_produce) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEMSMAKE_RESULT),pack);
}

//client request
function ReqItemsMake(recipe : UInt64, luckyCount : int, bSafty : int) {
	var packet:req_produce = new req_produce();
	packet.produce_manual_id = recipe;
	packet.lucky_stone_count = luckyCount;
	packet.has_insurance = bSafty;
	NetHelper.Send(packet);
}

//logic function for external interface

//logic function for interal

//data operate