#pragma strict
#pragma downcast
/*
//dress net center
//create by fullzhu 2012.2.18
//last edit at 2012.2.18 by fullzhu
*/


private static var instance : DressNet;
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
	NetHelper.RegistHandler(new notify_start_change_dress(), HandleNotifyInitDress);
	NetHelper.RegistHandler(new notify_change_dress(), HandleNotifyChangeDress);
}

function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOUSE_CREATED), HandleNotifyHouseOwnerInfo);
}

//handle net event
function HandleNotifyInitDress(evt:GameEvent, pack:notify_start_change_dress) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_INIT_DRESS_BASE_INFO),pack);
}

function HandleNotifyChangeDress(evt:GameEvent, pack:notify_change_dress) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_DRESS_RESULT),pack);
}

//hanlde game event
function HandleNotifyHouseOwnerInfo(evt:GameEvent, obj:System.Object) {
}

//client request
function ReqStartDress() {
	var packet:req_start_change_dress = new req_start_change_dress();
	NetHelper.Send(packet);
}

function ReqChangeDress(type : int,goodsList : ArrayList,loverGoodsList : ArrayList,itemList : ArrayList,putOffList : ArrayList) {
	var packet:req_change_dress = new req_change_dress();
	packet.type = type;
	packet.goods_list = goodsList.Clone();
	packet.lover_goods_list = loverGoodsList.Clone();
	packet.item_list = itemList.Clone();
	packet.putoff_list = putOffList.Clone();
	NetHelper.Send(packet);
}

//logic function for external interface

//logic function for interal

//data operate