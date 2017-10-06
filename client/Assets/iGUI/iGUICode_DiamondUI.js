#pragma strict
#pragma downcast
import iGUI;

private var bgAsynIcon : AsynIcon = null;
private var mInit : boolean = false;

function Start() {
	Init();
}

private function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_SHOW_DIAMOND_BUY_UI), HandleNotifyEnable);
}

private function HandleNotifyEnable(evt:GameEvent, obj:boolean) {
	Enable(obj);
}

private function Init() {
	BtnClose.clickCallback = CallbackMouseClickEnable;
	
	BtnBuy1.clickCallback = CallbackMouseClickBuy;
	BtnBuy1.userData = 1;
	BtnBuy2.clickCallback = CallbackMouseClickBuy;
	BtnBuy2.userData = 2;
	BtnBuy3.clickCallback = CallbackMouseClickBuy;
	BtnBuy3.userData = 3;
	BtnBuy4.clickCallback = CallbackMouseClickBuy;
	BtnBuy4.userData = 4;
	BtnBuy5.clickCallback = CallbackMouseClickBuy;
	BtnBuy5.userData = 5;
	BtnBuy6.clickCallback = CallbackMouseClickBuy;
	BtnBuy6.userData = 6;
	BtnBuy7.clickCallback = CallbackMouseClickBuy;
	BtnBuy7.userData = 7;
	BtnBuy8.clickCallback = CallbackMouseClickBuy;
	BtnBuy8.userData = 8;
	
	bgAsynIcon =  new AsynIcon(CallbackBGIcon, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	if(PlatformMgr.IsPlatYY()) {
		bgAsynIcon.load("UI/recharge_yy.png.u3d");
	} else {
		bgAsynIcon.load("UI/recharge.png.u3d");
	}
	
	mInit = true;
}

function Enable(enable : boolean) {
	if(enable && !mInit) {
		Init();
	}
	
	UI.getUI().EnableUIRoot("DiamondUI",enable);
	UI.getUI().SetModal("DiamondUI", enable);
}

//callback
private function CallbackMouseClickEnable(callback : iGUIElement) {
	Enable(false);
}

private function CallbackMouseClickBuy(callback : iGUIElement) {
	DiamondLogic.GetInstance().CheckRecharge(callback.userData);
}

private function CallbackBGIcon(tex:Texture) {
	PanDiamond.style.normal.background = tex;
}


private static var instance : iGUICode_DiamondUI;
function Awake(){
	instance=this;
	
	RegistEventMsg();
}
static function getInstance(){
	return instance;
}
@HideInInspector
var BtnBuy8 : iGUIButton;
@HideInInspector
var BtnBuy7 : iGUIButton;
@HideInInspector
var BtnBuy6 : iGUIButton;
@HideInInspector
var BtnBuy5 : iGUIButton;
@HideInInspector
var BtnBuy4 : iGUIButton;
@HideInInspector
var BtnBuy3 : iGUIButton;
@HideInInspector
var BtnBuy2 : iGUIButton;
@HideInInspector
var BtnBuy1 : iGUIButton;
@HideInInspector
var BtnClose : iGUIButton;
@HideInInspector
var PanDiamond : iGUIPanel;
@HideInInspector
var root1 : iGUIRoot;
