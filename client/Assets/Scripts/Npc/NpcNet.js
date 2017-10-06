#pragma strict
#pragma downcast

/*
//items make net center
//create by fullzhu 2012.9.5
//last edit at 2012.9.5 by fullzhu
*/

private static var instance : NpcNet;
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
	NetHelper.RegistHandler(new notify_npc_close_dialog(), HandleNotifyCloseDialog);
	NetHelper.RegistHandler(new notify_npc_open_dialog(), HandleNotifyOpenDialog);
}

//handle net event
function HandleNotifyCloseDialog(evt:GameEvent, pack:notify_npc_close_dialog) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_NPC_DIALOG_CLOSE));
}

function HandleNotifyOpenDialog(evt:GameEvent, pack:notify_npc_open_dialog) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_NPC_DIALOG_OPEN),pack);
}

//client request
function ReqNpcCommand(id : int, func : String) {
	var packet:req_npc_command = new req_npc_command();
	packet.npc_id = id;
	packet.function_name = func;
	NetHelper.Send(packet);
}

//logic function for external interface

//logic function for interal

//data operate