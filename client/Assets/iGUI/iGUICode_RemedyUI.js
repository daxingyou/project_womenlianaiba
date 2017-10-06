#pragma strict
#pragma downcast
import iGUI;

class RemedyIcon {
	public var gift : int = 0;				// gift data
	public var asynIcon : AsynIcon = null;	// asyn icon manager
	public var iconSlot : iGUIImage;		// icon slot ui
	
	public function CallbackIconLoad(tex : Texture) {
		iconSlot.image = tex;
	}
}

private var mInit : boolean = false;
private var bgAsynIcon : AsynIcon = null;

function Start() {
	Init();
}

private function Init() {
	BtnClose.clickCallback = CallbackMouseClickClose;
	ImgGift1.mouseOverCallback = CallbackMouseOverGift;
	ImgGift2.mouseOverCallback = CallbackMouseOverGift;
	ImgGift3.mouseOverCallback = CallbackMouseOverGift;
	ImgGift4.mouseOverCallback = CallbackMouseOverGift;
	ImgGift5.mouseOverCallback = CallbackMouseOverGift;
	ImgGift6.mouseOverCallback = CallbackMouseOverGift;
	ImgGift7.mouseOverCallback = CallbackMouseOverGift;
	
	bgAsynIcon =  new AsynIcon(CallbackBGIcon, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	bgAsynIcon.load("UI/make_up.png.u3d");
	
	mInit = true;
}

private function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REMEDY_ENABLE_UI), HandleNotifyRemedyActive);
}

//handle client net msg
private function HandleNotifyRemedyActive(evt:GameEvent, obj:System.Object) {
	Enable(true);
	
	Refresh();
}

//internal function
private function Enable(enable : boolean) {
	if(enable && !mInit) {
		Init();
	}
	
	UI.getUI().EnableUIRoot("RemedyUI",enable);
	UI.getUI().SetModal("RemedyUI", enable);
}

private function Refresh() {
	var list : ArrayList = RemedyLogic.GetInstance().GetAwardList();
	if(list == null) return ;
	
	Clear();
	
	for(var idx=0; idx<list.Count; idx++) {
		var info : RemedyAwardInfo = list[idx] as RemedyAwardInfo;
		var icon : RemedyIcon = new RemedyIcon();
		icon.gift = info.id;
		
		if(idx == 0) {
			ImgGift1.setEnabled(true);
			LabCount1.setEnabled(true);
			icon.iconSlot = ImgGift1;
			LabCount1.label.text = info.num.ToString();
			ImgGift1.userData = info.id;
		} else if(idx == 1) {
			ImgGift2.setEnabled(true);
			LabCount2.setEnabled(true);
			icon.iconSlot = ImgGift2;
			LabCount2.label.text = info.num.ToString();
			ImgGift2.userData = info.id;
		} else if(idx == 2) {
			ImgGift3.setEnabled(true);
			LabCount3.setEnabled(true);
			icon.iconSlot = ImgGift3;
			LabCount3.label.text = info.num.ToString();
			ImgGift3.userData = info.id;
		} else if(idx == 3) {
			ImgGift4.setEnabled(true);
			LabCount4.setEnabled(true);
			icon.iconSlot = ImgGift4;
			LabCount4.label.text = info.num.ToString();
			ImgGift4.userData = info.id;
		} else if(idx == 4) {
			ImgGift5.setEnabled(true);
			LabCount5.setEnabled(true);
			icon.iconSlot = ImgGift5;
			LabCount5.label.text = info.num.ToString();
			ImgGift5.userData = info.id;
		} else if(idx == 5) {
			ImgGift6.setEnabled(true);
			LabCount6.setEnabled(true);
			icon.iconSlot = ImgGift6;
			LabCount6.label.text = info.num.ToString();
			ImgGift6.userData = info.id;
		} else if(idx == 6) {
			ImgGift7.setEnabled(true);
			LabCount7.setEnabled(true);
			icon.iconSlot = ImgGift7;
			LabCount7.label.text = info.num.ToString();
			ImgGift7.userData = info.id;
		} else {
			break;
		}
		icon.asynIcon =  new AsynIcon(icon.CallbackIconLoad, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
		icon.asynIcon.load("Icon/" + ResManager.LgtMgr.getItemRow(info.id).icon); 
	}
}

private function Clear() {
	ImgGift1.setEnabled(false);
	LabCount1.setEnabled(false);
	ImgGift1.userData = null;
	ImgGift2.setEnabled(false);
	LabCount2.setEnabled(false);
	ImgGift2.userData = null;
	ImgGift3.setEnabled(false);
	LabCount3.setEnabled(false);
	ImgGift3.userData = null;
	ImgGift4.setEnabled(false);
	LabCount4.setEnabled(false);
	ImgGift4.userData = null;
	ImgGift5.setEnabled(false);
	LabCount5.setEnabled(false);
	ImgGift5.userData = null;
	ImgGift6.setEnabled(false);
	LabCount6.setEnabled(false);
	ImgGift6.userData = null;
	ImgGift7.setEnabled(false);
	LabCount7.setEnabled(false);
	ImgGift7.userData = null;	
}

//callback function
private function CallbackBGIcon(tex:Texture) {
	PanRemedy.style.normal.background = tex;
}

private function CallbackMouseOverGift(callback : iGUIElement) {
	if(callback.userData != null) {
		ItemHint.ShowPackItemHint(callback, ResManager.LgtMgr.getItemRow(callback.userData), false);
	}
}

private function CallbackMouseClickClose(callback : iGUIElement) {
	Enable(false);
}

private static var instance : iGUICode_RemedyUI;
function Awake(){
	instance=this;
	
	RegistEventMsg();
}
static function getInstance(){
	return instance;
}
@HideInInspector
var LabCount1 : iGUILabel;
@HideInInspector
var LabCount2 : iGUILabel;
@HideInInspector
var LabCount3 : iGUILabel;
@HideInInspector
var LabCount4 : iGUILabel;
@HideInInspector
var LabCount5 : iGUILabel;
@HideInInspector
var LabCount6 : iGUILabel;
@HideInInspector
var LabCount7 : iGUILabel;
@HideInInspector
var ImgGift1 : iGUIImage;
@HideInInspector
var ImgGift2 : iGUIImage;
@HideInInspector
var ImgGift3 : iGUIImage;
@HideInInspector
var ImgGift4 : iGUIImage;
@HideInInspector
var ImgGift5 : iGUIImage;
@HideInInspector
var ImgGift6 : iGUIImage;
@HideInInspector
var ImgGift7 : iGUIImage;
@HideInInspector
var BtnClose : iGUIButton;
@HideInInspector
var PanRemedy : iGUIPanel;
@HideInInspector
var root1 : iGUIRoot;
