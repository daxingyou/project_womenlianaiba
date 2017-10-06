#pragma strict
#pragma downcast
/*
//friend invite net center
//create by fullzhu 2012.5.7
//last edit at 2012.5.7 by fullzhu
*/

private static var instance : FriendInviteNet;
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
	NetHelper.RegistHandler(new notify_invite_active(), HandleNotifyInviteList);
	NetHelper.RegistHandler(new notify_invite_award(), HandleNotifyGetGiftResult);
}

//handle net event
function HandleNotifyInviteList(evt:GameEvent, pack:notify_invite_active) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_INVITE_LIST),pack);
}

function HandleNotifyGetGiftResult(evt:GameEvent, pack:notify_invite_award) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_GET_INVITE_GIFT_RESULT),pack);
}

//client request
function ReqInviteList() {
	var packet:req_invite_active = new req_invite_active();
	NetHelper.Send(packet);
}

function ReqGetInviteGift(diamond : int,itemID : int,itemCount : int, friendList : ArrayList) {
	var packet:req_invite_award = new req_invite_award();
	packet.diamond = diamond;
	packet.item_id = itemID;
	packet.count = itemCount;
	packet.invite_list = friendList.Clone();
	NetHelper.Send(packet);
}

//logic function for external interface

//logic function for interal

//data operate