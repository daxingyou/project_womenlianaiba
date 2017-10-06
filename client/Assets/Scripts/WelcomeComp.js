#pragma strict

function Awake() {
	RegistEvt();
}
function Start () {

}

function RegistEvt () {
	
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_SELF_HOUSE), HandleSetSelfWelcomeTxt);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_SETWELCOME_RESULT), HandleNotifySetWelcomeResult);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_FRIEND_HOUSE), HandleEnterOthersHouse);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_WELCOMETEXT), HandleNotifyWelcomeText);
}
//--
function HandleNotifyWelcomeText(evt : GameEvent, obj : house_info){
	OpenWelcomeRoot();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.SHOW_WELCOMETEXT), obj);
}
//--
function HandleSetSelfWelcomeTxt(evt : GameEvent, obj : house_info){
	OpenWelcomeRoot();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_SELF_WELCOMETEXT), obj);
}
//--
function HandleEnterOthersHouse(evt : GameEvent, obj : house_info){
	//--test
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_WELCOMETEXT), obj);
}
//--
function OpenWelcomeRoot(){
	iGUICode_WelcomeRoot.OpenWelcomeRoot();
}
//--
function HandleNotifySetWelcomeResult(evt : GameEvent, obj : Object){
	var _obj : notify_set_house_welcome_words = obj as notify_set_house_welcome_words;
	if(_obj.result == 1)
		UI.getUI().OpenMsgbox("",Define.setok,true);
	else
		UI.getUI().OpenMsgbox("",Define.setfailed,true);
}