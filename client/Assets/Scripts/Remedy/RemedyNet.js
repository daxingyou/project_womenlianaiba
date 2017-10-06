#pragma strict
#pragma downcast

/*
//remedy net center
//create by fullzhu 2013.1.17
//last edit at 2013.1.17 by fullzhu
*/

private static var instance : RemedyNet;
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
	NetHelper.RegistHandler(new notify_make_up_info(), HandleNotifyRemedyInfo);
}

//handle net event
function HandleNotifyRemedyInfo(evt:GameEvent, pack:notify_make_up_info) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REMEDY_DATA),pack);
}


//client request

//logic function for external interface

//logic function for interal

//data operate