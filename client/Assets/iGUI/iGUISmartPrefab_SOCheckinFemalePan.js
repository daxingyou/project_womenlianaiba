#pragma strict
import iGUI;

@HideInInspector
var PanFemale : iGUIPanel;
@HideInInspector
var LabContent : iGUILabel;
@HideInInspector
var BtnDel : iGUIButton;
@HideInInspector
var LabTime : iGUILabel;
@HideInInspector
var ImgMale : iGUIImage;
@HideInInspector
var BtnPermission : iGUIButton;

function Start() {
	if(BtnDel) {
		BtnDel.clickCallback = CallbackDelCheckItem;
	}
	if(BtnPermission) {
		BtnPermission.clickCallback = CallbackPermission;
	}
}

function CallbackDelCheckItem(callback : iGUIElement) {
	//EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_DEL_CHECKIN_RECORD),PanFemale.userData);
	UI.getUI().OpenMsgbox("", Define.getContent(5214), Define.ok, CallbackDelSure as iGUIEventCallback, Define.cancel, CallbackDelCancel as iGUIEventCallback);
}

function CallbackDelSure() {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_DEL_CHECKIN_RECORD),PanFemale.userData);
}

function CallbackDelCancel() {
}

function CallbackPermission(caller : iGUIElement) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_CHECKIN_PERMISSION),caller);
}
