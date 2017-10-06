#pragma strict
#pragma downcast

import iGUI;

public var mInitTextSize : Rect = Rect(10,-30,550,30);
public var mInitPanSize : Rect = Rect(80,380,600,200);

function Start() {
	Init();
}

function Init() {
	BtnSelect1.clickCallback = CallbackClickDialogEvt;
	BtnSelect2.clickCallback = CallbackClickDialogEvt;
	BtnSelect3.clickCallback = CallbackClickDialogEvt;
	BtnSelect4.clickCallback = CallbackClickDialogEvt;
	BtnSelect5.clickCallback = CallbackClickDialogEvt;
}

private function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_NPC_DIALOG_UI_ENABLE), HandleNotifyEnable);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_NPC_DIALOG_UI_REFRESH), HandleNotifyRefresh);
}

//game event
private function HandleNotifyEnable(evt:GameEvent, obj:System.Object) {
	Enable(obj);
}

private function HandleNotifyRefresh(evt:GameEvent, obj:NpcCommand) {
	Refresh(obj);
}

//logic function for extern
public function Enable(enable : boolean) {
	UI.getUI().EnableUIRoot("NpcDialogUI",enable);
	UI.getUI().SetModal("NpcDialogUI", enable);
}

public function Refresh(command : NpcCommand) {
	InitDialog();
	
	LabContent.label.text = command.dialog;
	
	var height : float = LabContent.style.CalcHeight(GUIContent(command.dialog), LabContent.positionAndSize.width);
	var deltaHeight : float = height - LabContent.positionAndSize.height;
	if (deltaHeight > 0) {
		PanMain.setHeight(PanMain.positionAndSize.height+deltaHeight);
		LabContent.setHeight(height);
		
		PanMain.setY(PanMain.positionAndSize.y-deltaHeight);
		//ConSelect.setY(ConSelect.positionAndSize.y+deltaHeight);
		//LabContent.setY(LabContent.positionAndSize.y-deltaHeight);
	}
	
	var btnCount : int = command.funcList.Count;
	switch(btnCount) {
		case 1:
			BtnSelect1.setEnabled(true);
			BtnSelect1.label.text = (command.funcList[0] as NpcCommandFunc).btn;
			BtnSelect1.userData = (command.funcList[0] as NpcCommandFunc).func;
			break;
		case 2:
			BtnSelect1.setEnabled(true);
			BtnSelect1.label.text = (command.funcList[0] as NpcCommandFunc).btn;
			BtnSelect1.userData = (command.funcList[0] as NpcCommandFunc).func;
			BtnSelect2.setEnabled(true);
			BtnSelect2.label.text = (command.funcList[1] as NpcCommandFunc).btn;
			BtnSelect2.userData = (command.funcList[1] as NpcCommandFunc).func;
			break;
		case 3:
			BtnSelect1.setEnabled(true);
			BtnSelect1.label.text = (command.funcList[0] as NpcCommandFunc).btn;
			BtnSelect1.userData = (command.funcList[0] as NpcCommandFunc).func;
			BtnSelect2.setEnabled(true);
			BtnSelect2.label.text = (command.funcList[1] as NpcCommandFunc).btn;
			BtnSelect2.userData = (command.funcList[1] as NpcCommandFunc).func;
			BtnSelect3.setEnabled(true);
			BtnSelect3.label.text = (command.funcList[2] as NpcCommandFunc).btn;
			BtnSelect3.userData = (command.funcList[2] as NpcCommandFunc).func;
			break;
		case 4:
			BtnSelect1.setEnabled(true);
			BtnSelect1.label.text = (command.funcList[0] as NpcCommandFunc).btn;
			BtnSelect1.userData = (command.funcList[0] as NpcCommandFunc).func;
			BtnSelect2.setEnabled(true);
			BtnSelect2.label.text = (command.funcList[1] as NpcCommandFunc).btn;
			BtnSelect2.userData = (command.funcList[1] as NpcCommandFunc).func;
			BtnSelect3.setEnabled(true);
			BtnSelect3.label.text = (command.funcList[2] as NpcCommandFunc).btn;
			BtnSelect3.userData = (command.funcList[2] as NpcCommandFunc).func;
			BtnSelect4.setEnabled(true);
			BtnSelect4.label.text = (command.funcList[3] as NpcCommandFunc).btn;
			BtnSelect4.userData = (command.funcList[3] as NpcCommandFunc).func;
			break;
		case 5:
			BtnSelect1.setEnabled(true);
			BtnSelect1.label.text = (command.funcList[0] as NpcCommandFunc).btn;
			BtnSelect1.userData = (command.funcList[0] as NpcCommandFunc).func;
			BtnSelect2.setEnabled(true);
			BtnSelect2.label.text = (command.funcList[1] as NpcCommandFunc).btn;
			BtnSelect2.userData = (command.funcList[1] as NpcCommandFunc).func;
			BtnSelect3.setEnabled(true);
			BtnSelect3.label.text = (command.funcList[2] as NpcCommandFunc).btn;
			BtnSelect3.userData = (command.funcList[2] as NpcCommandFunc).func;
			BtnSelect4.setEnabled(true);
			BtnSelect4.label.text = (command.funcList[3] as NpcCommandFunc).btn;
			BtnSelect4.userData = (command.funcList[3] as NpcCommandFunc).func;
			BtnSelect5.setEnabled(true);
			BtnSelect5.label.text = (command.funcList[4] as NpcCommandFunc).btn;
			BtnSelect5.userData = (command.funcList[4] as NpcCommandFunc).func;
			break;
	}
}

//logic function for internal

public function InitDialog() {
	PanMain.setPositionAndSize(mInitPanSize);
	LabContent.setPositionAndSize(mInitTextSize);
	
	BtnSelect1.setEnabled(false);
	BtnSelect1.userData = null;
	BtnSelect2.setEnabled(false);
	BtnSelect2.userData = null;
	BtnSelect3.setEnabled(false);
	BtnSelect3.userData = null;
	BtnSelect4.setEnabled(false);
	BtnSelect4.userData = null;
	BtnSelect5.setEnabled(false);
	BtnSelect5.userData = null;
}

//callback
private function CallbackClickDialogEvt(callback : iGUIElement) {
	if(callback.userData != null) {
		NpcMgr.GetInstance().Communicate(callback.userData as String);
	}
}

private static var instance : iGUICode_NpcDialogUI;
function Awake(){
	instance=this;
	
	RegistEventMsg();
}
static function getInstance(){
	return instance;
}
@HideInInspector
var ConSelect : iGUIContainer;
@HideInInspector
var LabContent : iGUILabel;
@HideInInspector
var BtnSelect5 : iGUIButton;
@HideInInspector
var BtnSelect4 : iGUIButton;
@HideInInspector
var BtnSelect3 : iGUIButton;
@HideInInspector
var BtnSelect2 : iGUIButton;
@HideInInspector
var BtnSelect1 : iGUIButton;
@HideInInspector
var PanMain : iGUIPanel;

@HideInInspector
var root1 : iGUIRoot;
