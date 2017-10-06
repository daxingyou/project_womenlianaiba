#pragma strict
#pragma downcast
import iGUI;

class LogonAwardIcon {
	public var gift : LogonAward = null;	// gift data
	public var asynIcon : AsynIcon = null;	// asyn icon manager
	public var iconSlot : iGUIImage;		// icon slot ui
	
	public function CallbackIconLoad(tex : Texture) {
		iconSlot.image = tex;
	}
}


private var mInviteNum : int = 1;
private var mGiftNum : int = 5;
private var mInit : boolean = false;

function Start() {
	Init();
}

private function Init() {
	BtnClose.clickCallback = CallbackMouseClickClose;
	BtnGfitGet.clickCallback = CallbackMouseClickGetGift;
	ImgGift1.mouseOverCallback = CallbackMouseOverGift;
	ImgGift2.mouseOverCallback = CallbackMouseOverGift;
	ImgGift3.mouseOverCallback = CallbackMouseOverGift;
	ImgGift4.mouseOverCallback = CallbackMouseOverGift;
	ImgGift5.mouseOverCallback = CallbackMouseOverGift;
	
	var bgAsynIcon : AsynIcon =  new AsynIcon(CallbackBGIcon, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	bgAsynIcon.load("UI/logon_award_bg.png.u3d");
	
	mInit = true;
}

private function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REFRESH_AWARD_GIFT_LIST), HandleNotifyRefreshAward);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LOGON_AWARD_ENABLE), HandleNotifyEnable);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REFRESH_AWARD_LAST_DAY), HandleNotifyLastDay);
}

//handle client net msg
private function HandleNotifyRefreshAward(evt:GameEvent, obj:LogonAward) {
	switch(obj.day) {
		case 1:SetGiftSlot(ImgGift1,LabGift1,ImgDiamond1,LabDiamond1,obj);break;
		case 2:SetGiftSlot(ImgGift2,LabGift2,ImgDiamond2,LabDiamond2,obj);break;
		case 3:SetGiftSlot(ImgGift3,LabGift3,ImgDiamond3,LabDiamond3,obj);break;
		case 4:SetGiftSlot(ImgGift4,LabGift4,ImgDiamond4,LabDiamond4,obj);break;
		case 5:SetGiftSlot(ImgGift5,LabGift5,ImgDiamond5,LabDiamond5,obj);break;
	}
}

private function HandleNotifyEnable(evt:GameEvent, obj:System.Object) {
	Enable(obj);
}

private function HandleNotifyLastDay(evt:GameEvent, obj:System.Object) {
	ImgMark1.setEnabled(false);
	ImgMark2.setEnabled(false);
	ImgMark3.setEnabled(false);
	ImgMark4.setEnabled(false);
	ImgMark5.setEnabled(false);
	switch(obj) {
		case 1:ImgMark1.setEnabled(true);break;
		case 2:ImgMark2.setEnabled(true);break;
		case 3:ImgMark3.setEnabled(true);break;
		case 4:ImgMark4.setEnabled(true);break;
		case 5:ImgMark5.setEnabled(true);break;
	}
}
//internal function
private function ShowGiftTip(slot : LogonAwardIcon) {
	if(slot == null) return ;
	if(slot.gift.item_id != 0) {
		ItemHint.ShowPackItemHint(slot.iconSlot, ResManager.LgtMgr.getItemRow(slot.gift.item_id), false);
	}
}

private function SetGiftSlot(imageElement:iGUIElement,countElement:iGUIElement,imageDiamond:iGUIElement,countDiamond:iGUIElement,gift : LogonAward) {
	var gift_icon : LogonAwardIcon = new LogonAwardIcon();
	gift_icon.gift = gift;
	gift_icon.iconSlot = imageElement;
	if(gift.item_id != 0) {
		gift_icon.asynIcon =  new AsynIcon(gift_icon.CallbackIconLoad, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
		gift_icon.asynIcon.load("Icon/" + ResManager.LgtMgr.getItemRow(gift.item_id).icon);
		countElement.label.text = gift.count.ToString();
	} else {
		(imageElement as iGUIImage).image = null;
		countElement.label.text = "";
	}
	if(gift.diamond > 0) {
		imageDiamond.setEnabled(true);
		countDiamond.label.text = "X"+gift.diamond.ToString();
	} else {
		imageDiamond.setEnabled(false);
		countDiamond.label.text = "";
	}
	
	imageElement.userData = gift_icon;
}
//external function
public function Enable(enable : boolean) {
	PanLogonAward.setEnabled(enable);
	
	if(enable) {
		if(!mInit) {
			Init();
		}
		UI.getUI().SetModal("LogonAwardUI", true);
	} else {
		UI.getUI().SetModal("LogonAwardUI", false);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.POST_lOGONAWARDUI_CLOSE));
		Divorce.publishEvent("event_open_divorce_ui4", true);
	}
}

//callback function
private function CallbackMouseClickGetGift(callback : iGUIElement) {
	LogonAwardLogic.GetInstance().AwardGet();
}

private function CallbackMouseClickClose(callback : iGUIElement) {
	Enable(false);
}

private function CallbackMouseOverGift(callback : iGUIElement) {
	ShowGiftTip(callback.userData);
}

private function CallbackBGIcon(tex:Texture) {
	PanLogonAward.style.normal.background = tex;
}

private static var instance : iGUICode_LogonAwardUI;
function Awake(){
	instance=this;
	
	RegistEventMsg();
}
static function getInstance(){
	return instance;
}

@HideInInspector
var LabDiamond1 : iGUILabel;
@HideInInspector
var LabDiamond2 : iGUILabel;
@HideInInspector
var LabDiamond3 : iGUILabel;
@HideInInspector
var LabDiamond4 : iGUILabel;
@HideInInspector
var LabDiamond5 : iGUILabel;
@HideInInspector
var LabGift1 : iGUILabel;
@HideInInspector
var LabGift2 : iGUILabel;
@HideInInspector
var LabGift3 : iGUILabel;
@HideInInspector
var LabGift4 : iGUILabel;
@HideInInspector
var LabGift5 : iGUILabel;
@HideInInspector
var BtnGfitGet : iGUIButton;
@HideInInspector
var ImgDiamond5 : iGUIImage;
@HideInInspector
var ImgDiamond4 : iGUIImage;
@HideInInspector
var ImgDiamond3 : iGUIImage;
@HideInInspector
var ImgDiamond2 : iGUIImage;
@HideInInspector
var ImgDiamond1 : iGUIImage;
@HideInInspector
var ImgMark5 : iGUIImage;
@HideInInspector
var ImgMark4 : iGUIImage;
@HideInInspector
var ImgMark3 : iGUIImage;
@HideInInspector
var ImgMark2 : iGUIImage;
@HideInInspector
var ImgMark1 : iGUIImage;
@HideInInspector
var ImgGift5 : iGUIImage;
@HideInInspector
var ImgGift4 : iGUIImage;
@HideInInspector
var ImgGift3 : iGUIImage;
@HideInInspector
var ImgGift2 : iGUIImage;
@HideInInspector
var ImgGift1 : iGUIImage;
@HideInInspector
var BtnClose : iGUIButton;
@HideInInspector
var PanLogonAward : iGUIPanel;
@HideInInspector
var root1 : iGUIRoot;
