#pragma strict
import iGUI;

@HideInInspector
var BtnPermission : iGUIButton;
@HideInInspector
var MBtnFollow : iGUIButton;
@HideInInspector
var MBtnVisit : iGUIButton;
@HideInInspector
var LabText : iGUILabel;
@HideInInspector
var BtnDel : iGUIButton;
@HideInInspector
var LabTime : iGUILabel;
@HideInInspector
var LabName : iGUILabel;
@HideInInspector
var ImgIcon : iGUIImage;
@HideInInspector
var MessagePanel : iGUIPanel;

function Start() {
	if(BtnDel) {
		BtnDel.clickCallback = CallbackDelCheckItem;
		BtnDel.mouseOverCallback = CallbackDelMouseOver;
		BtnDel.mouseOutCallback = CallbackDelMouseOut;
	}
	if(MBtnVisit) {
		MBtnVisit.clickCallback = CallbackVisitHouse;
	}
	if(MBtnFollow) {
		MBtnFollow.clickCallback = CallbackFollow;
	}
	if(BtnPermission) {
		BtnPermission.clickCallback = CallbackPermission;
	}
}

function CallbackDelCheckItem(callback : iGUIElement) {
	//EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_DEL_MESSAGE),MessagePanel.userData);
	UI.getUI().OpenMsgbox("", Define.getContent(5214), Define.ok, CallbackDelSure as iGUIEventCallback, Define.cancel, CallbackDelCancel as iGUIEventCallback);
}

function CallbackDelMouseOver(callback : iGUIElement) {
	callback.labelColor = (callback as iGUIButton).style.hover.textColor;
}

function CallbackDelMouseOut(callback : iGUIElement) {
	callback.labelColor = (callback as iGUIButton).style.normal.textColor;
}

function CallbackDelSure() {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_DEL_MESSAGE),MessagePanel.userData);
}

function CallbackDelCancel(callback : iGUIElement) {
}

function CallbackVisitHouse() {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_MESSAGE_VISIT),MessagePanel.userData);
}

function CallbackFollow() {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_MESSAGE_FOLLOW),MessagePanel.userData);
}

function CallbackPermission(caller : iGUIElement) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_MESSAGE_PERMISSION),caller);
}

