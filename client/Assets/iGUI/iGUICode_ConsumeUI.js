#pragma strict
#pragma downcast
import iGUI;

private var bgAsynIcon : AsynIcon = null;
private var mInit : boolean = false;
private var mHideUI : Array;									// hide ui

function Start() {
	Init();
}

function Enable(enable : boolean) {
	if(enable) {
		if(!mInit) {
			Init();
		}
		
		mHideUI = UI.getUI().EnableUIRootIgnore(ConsumeLogic.GetInstance().mFilterHideRoot, false);
		UI.getUI().EnableUIRoot("ConsumeUI",enable);
		UI.getUI().SetModal("ConsumeUI", true);
	} else {
		if (null != mHideUI) {
			UI.getUI().EnableUIRoot(mHideUI, true);
			mHideUI.Clear();
		}
		
		UI.getUI().SetModal("ConsumeUI", false);
		UI.getUI().EnableUIRoot("ConsumeUI",enable);
	}
}

private function Init() {
	BtnEnergyBuy.clickCallback = CallbackMouseClickEnergyBuy;
	BtnEnergyClose.clickCallback = CallbackMouseClickEnergyEnable;
	
	bgAsynIcon =  new AsynIcon(CallbackBGIcon, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	bgAsynIcon.load("UI/unable_to_perform.png.u3d");
}

private function RegistEventMsg() {
	//EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_REFRESH_ATTENTION_INTERFACE), HandleNotifyRefreshPage);
}

//handle game event
/*
private function HandleNotifyRefreshPage(evt:GameEvent, obj:System.Object) {
}
*/

//callback
private function CallbackMouseClickEnergyBuy(callback : iGUIElement) {
	Enable(false);
	ConsumeLogic.GetInstance().Consume();
}
private function CallbackMouseClickEnergyEnable(callback : iGUIElement) {
	Enable(false);
}
private function CallbackBGIcon(tex:Texture) {
	PanEnergy.style.normal.background = tex;
}

private static var instance : iGUICode_ConsumeUI;
function Awake(){
	instance=this;
	
	RegistEventMsg();
}
static function getInstance(){
	return instance;
}
@HideInInspector
var BtnEnergyBuy : iGUIButton;
@HideInInspector
var BtnEnergyClose : iGUIButton;
@HideInInspector
var PanEnergy : iGUIPanel;
@HideInInspector
var root1 : iGUIRoot;
