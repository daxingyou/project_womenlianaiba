#pragma strict
#pragma downcast

import iGUI;

class ItemsMakeIcon {
	public var data : int;					// item id
	public var asynIcon : AsynIcon = null;	// asyn icon manager
	public var iconSlot : iGUIImage;		// icon slot ui
	
	public function CallbackIconLoad(tex : Texture) {
		iconSlot.image = tex;
	}
}

private var mGiftRandomList : ArrayList = new ArrayList();			//struct Texture

function Start() {
	Init();
}

function Init() {
	BtnClose.clickCallback = CallbackMouseClickClose;
	BtnLuckyAdd.clickCallback = CallbackMouseClickLuckAdd;
	BtnLuckyMinus.clickCallback = CallbackMouseClickLuckyMinus;
	BtnSaftyAdd.clickCallback = CallbackMouseClickSaftyAdd;
	BtnSaftyMinus.clickCallback = CallbackMouseClickSaftyMinus;
	BtnMake.clickCallback = CallbackMouseClickMake;
	open.clickCallback = CallbackMouseClickOpenPacket;
	
	ImgMaterial0.mouseOverCallback = CallbackMouseOverSlot;
	ImgMaterial1.mouseOverCallback = CallbackMouseOverSlot;
	ImgMaterial2.mouseOverCallback = CallbackMouseOverSlot;
	ImgMaterial3.mouseOverCallback = CallbackMouseOverSlot;
	ImgMaterial4.mouseOverCallback = CallbackMouseOverSlot;
	//ImgObtain.mouseOverCallback = CallbackMouseOverSlot;
	ImgLucky.mouseOverCallback = CallbackMouseOverSlot;
	ImgSafty.mouseOverCallback = CallbackMouseOverSlot;
	skillbg.mouseOverCallback = CallbackMouseOverNotice;
}

private function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEMSMAKE_REFRESH_INTERFACE), HandleNotifyRefresh);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEMSMAKE_ENABLE), HandleNotifyEnable);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_UI_MODAL_STATE), HandleNotifyPacketModal);
}

//game event
private function HandleNotifyRefresh(evt:GameEvent, obj:System.Object) {
	Refresh();
}

private function HandleNotifyEnable(evt:GameEvent, obj:System.Object) {
	Enable(obj);
}

private function HandleNotifyPacketModal(evt:GameEvent, obj:System.Object) {
	if(UI.getUI().isUIRootOpen("ItemsMakeUI")) {
		UI.getUI().SetPassive("BackpackUI", obj);
	} 
}

//logic function for extern
public function Enable(enable : boolean) {
	UI.getUI().EnableUIRoot("ItemsMakeUI",enable);
	UI.getUI().SetModal("ItemsMakeUI", enable);
	EnablePacket(enable);
	
	Clear();
}

function EnablePacket(enable : boolean) {
	if(enable) {
		Backpack.getInstance().openBackpackUI(PanMain.positionAndSize.x+PanMain.positionAndSize.width,PanMain.positionAndSize.y,4,false,true,true);
		
		ItemsMakeLogic.GetInstance().RegSlotClickEvent();
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.OPEN_ITEMSMAKEUI));
	} else {
		Backpack.getInstance().closeBackpackUI();
		
		ItemsMakeLogic.GetInstance().DelSlotClickEvent();
	}
}

//logic function for internal
private function Clear() {
	var animation : iGUITextureAnimation = ImgObtain.getTextureAnimation("animationresult");
	animation.stop();
	mGiftRandomList.Clear();
	
	for(var element : iGUIElement in ConMaterial.items) {
		element.setEnabled(false);
	}
	
	BtnLuckyAdd.passive = true;
	BtnLuckyMinus.passive = true;
	BtnSaftyAdd.passive = true;
	BtnSaftyMinus.passive = true;
	
	ImgObtain.setEnabled(false);
	LabObtainNum.setEnabled(false);
}

private function Refresh() {
	var data : MakeData = ItemsMakeLogic.GetInstance().GetMakeData();
	if(data == null) return ;
	
	var animation : iGUITextureAnimation = ImgObtain.getTextureAnimation("animationresult");
	animation.stop();
	
	var obtain : MaterialData = ItemsMakeLogic.GetInstance().GetObtainData();
	
	Clear();
	
	LabLevel.label.text = data.LevelData.Level.ToString();
	LabCurrSkillValue.label.text = data.LevelData.SkilledValue.ToString()+"/"+data.LevelData.LVUpSkilledValue.ToString();
	ImgBar.setWidth(142*data.LevelData.SkilledValue/data.LevelData.LVUpSkilledValue);
	
	SetElementData(ImgLucky,LabLuckyNum,data.LuckyData);
	SetElementData(ImgSafty,LabSaftyNum,data.SaftyData);
	
	var idx : int = 0;
	for(var material : MaterialData in data.MaterialList) {
		if(idx >= 5) break;
		
		SetElement(idx,material);
		idx++;
	}
	
	if(obtain != null) {
		ImgObtain.mouseOverCallback = CallbackMouseOverObtainSlot;
		
		SetElementData(ImgObtain,LabObtainNum,obtain);
	} else {
		ImgObtain.mouseOverCallback = null;
		
		for(var ob : MaterialData in data.ObtainData) {
			var row : ItemRow = ResManager.LgtMgr.getItemRow(ob.id);
			if(row) {
				var asynIcon : AsynIcon = new AsynIcon(CallbackResultImgLoad, null);
				asynIcon.load("Icon/" + row.icon);
			}
		}
	}
	
	LabCrystal.label.text = data.ConsumeCrystal.ToString();
	LabRate.label.text = data.SuccessRate.ToString() + "%";
	LabSkilledValue.label.text = data.SkilledValue.ToString();
	
	RefreshPage();
}

private function RefreshPage() {
	var data : MakeData = ItemsMakeLogic.GetInstance().GetMakeData();
	
	var luckyCount : int = ItemsMakeLogic.GetInstance().GetCurLuckyCount();
	if(luckyCount == 0) {
		BtnLuckyMinus.passive = true;
	} else {
		BtnLuckyMinus.passive = false;
	}
	
	if(data.SuccessRate >= 100) {
		BtnLuckyAdd.passive = true;
	} else {
		BtnLuckyAdd.passive = false;
	}
	
	
	var saftyCount : int = ItemsMakeLogic.GetInstance().GetCurSaftyCount();
	if(saftyCount == 0) {
		BtnSaftyMinus.passive = true;
	} else {
		BtnSaftyMinus.passive = false;
	}
	if(saftyCount == 1) {
		BtnSaftyAdd.passive = true;
	} else {
		BtnSaftyAdd.passive = false;
	}
	
	if(data == null || data.RecipeID == 0) {
		BtnLuckyAdd.passive = true;
		BtnLuckyMinus.passive = true;
		BtnSaftyAdd.passive = true;
		BtnSaftyMinus.passive = true;
	}
	
	LabObtainNum.setEnabled(false);
	BtnMake.passive = false;
}

private function ShowTip(element : iGUIElement,item_id : int) {
	if(item_id == 0) return ;
	
	ItemHint.ShowPackItemHint(element, ResManager.LgtMgr.getItemRow(item_id), false);
}

private function SetElement(idx : int, data : MaterialData) {
	switch(idx) {
		case 0:
			SetElementData(ImgMaterial0,LabMaterial0,data);
			break;
		case 1:
			SetElementData(ImgMaterial1,LabMaterial1,data);
			break;
		case 2:
			SetElementData(ImgMaterial2,LabMaterial2,data);
			break;
		case 3:
			SetElementData(ImgMaterial3,LabMaterial3,data);
			break;
		case 4:
			SetElementData(ImgMaterial4,LabMaterial4,data);
			break;
		}
}

private function SetElementData(imgElement : iGUIImage, labElement : iGUILabel, data : MaterialData) {
	labElement.label.text = data.TotalCount.ToString()+"/"+data.CurrCount.ToString();
	if(data.CurrCount > data.TotalCount || data.TotalCount == 0) {
		labElement.labelColor = Color.red;
	} else {
		labElement.labelColor = Color.white;
	}
	
	var row : ItemRow = ResManager.LgtMgr.getItemRow(data.id);
	imgElement.setEnabled(true);
	labElement.setEnabled(true);
	
	var icon : ItemsMakeIcon = new ItemsMakeIcon();
	icon.data = data.id;
	icon.iconSlot = imgElement;
	icon.asynIcon = new AsynIcon(icon.CallbackIconLoad, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	icon.asynIcon.load("Icon/" + row.icon);
	imgElement.userData = data.id;
}

//callback
private function CallbackMouseClickClose(callback : iGUIElement) {
	Enable(false);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_ClOSE_MAKEUI));
}

private function CallbackMouseClickLuckAdd(callback : iGUIElement) {
	if(ItemsMakeLogic.GetInstance().CheckAddLucky(1)) {
		ItemsMakeLogic.GetInstance().AddLucky(1);
	}
}

private function CallbackMouseClickLuckyMinus(callback : iGUIElement) {
	ItemsMakeLogic.GetInstance().AddLucky(-1);
}

private function CallbackMouseClickSaftyAdd(callback : iGUIElement) {
	if(ItemsMakeLogic.GetInstance().CheckAddSafty()) {
		ItemsMakeLogic.GetInstance().AddSafty(1);
	}
}

private function CallbackMouseClickSaftyMinus(callback : iGUIElement) {
	ItemsMakeLogic.GetInstance().AddSafty(-1);
}

private function CallbackMouseClickMake(callback : iGUIElement) {		
	if(ItemsMakeLogic.GetInstance().CheckForge()) {
		ItemsMakeLogic.GetInstance().Forge();
		BtnMake.passive = true;
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_MAKE));
	}
}

private function CallbackMouseOverSlot(callback : iGUIElement) {
	if(callback.userData != null) {
		ShowTip(callback,callback.userData);
	}
}

private function CallbackMouseOverObtainSlot(callback : iGUIElement) {
	var obtain : item = ItemsMakeLogic.GetInstance().GetObtainItem();
	if(obtain == null) return ;
	var pg : PackGrid = SelfItemLogic.getInstance().Package.getItemPack(obtain.instance_id);
	if(pg == null) return ;
	
	ItemHint.ShowPackItemHint(callback, pg, true);
}

private function CallbackMouseClickOpenPacket(callback : iGUIElement) {
	if(Backpack.getInstance().isBackpackUIOpen()) {
		EnablePacket(false);
	} else {
		EnablePacket(true);
	}
}

private function CallbackMouseOverNotice(callback : iGUIElement) {
	var data : MakeData = ItemsMakeLogic.GetInstance().GetMakeData();
	if(data == null) return ;
	
	var style : GUIStyle = new GUIStyle();
	style.normal.textColor = Color.white;
	style.fontStyle = FontStyle.Bold;
	//style.wordWrap = true;
	Global.GetSysTooltip().Begin(callback);
	Global.GetSysTooltip().Add(GUIContent(Define.skilllevel+"："+data.LevelData.Level.ToString()+Define.level), style);
	Global.GetSysTooltip().Add(GUIContent(Define.skilled+"："+data.LevelData.SkilledValue.ToString()+"/"+data.LevelData.LVUpSkilledValue.ToString()), style);
	Global.GetSysTooltip().Add(GUIContent(Define.getContent(5152)), style);
	Global.GetSysTooltip().Add(GUIContent(Define.getContent(5153)), style);
	Global.GetSysTooltip().Add(GUIContent(Define.skilled), style);
	Global.GetSysTooltip().Show(true);
}

private function CallbackResultImgLoad(tex : Texture) {
	var data : MakeData = ItemsMakeLogic.GetInstance().GetMakeData();
	if(data == null) return ;
	
	mGiftRandomList.Add(tex);
	
	if(mGiftRandomList.Count == data.ObtainData.Count) {
		var animation : iGUITextureAnimation = ImgObtain.getTextureAnimation("animationresult");
		if(animation != null) {
			var repeatIdx : int = 0;
			for(var i=0; i<animation.images.Count; i++) {
				if(i <= mGiftRandomList.Count-1) {
					animation.images[i] = mGiftRandomList[i];
				} else {
					if(repeatIdx > mGiftRandomList.Count-1) {
						repeatIdx = 0;
					}
					animation.images[i] = mGiftRandomList[repeatIdx];
					repeatIdx++;
				}
			}
			animation.playFromStart();
			
			ImgObtain.setEnabled(true);
		}
	}
}


private static var instance : iGUICode_ItemsMakeUI;
function Awake(){
	instance=this;
	
	RegistEventMsg();
}
static function getInstance(){
	return instance;
}

@HideInInspector
var skillbg : iGUILabel;
@HideInInspector
var open : iGUIButton;
@HideInInspector
var LabSkilledValue : iGUILabel;
@HideInInspector
var LabRate : iGUILabel;
@HideInInspector
var LabCrystal : iGUILabel;
@HideInInspector
var BtnMake : iGUIButton;
@HideInInspector
var LabMaterial1 : iGUILabel;
@HideInInspector
var ImgMaterial1 : iGUIImage;
@HideInInspector
var LabMaterial2 : iGUILabel;
@HideInInspector
var ImgMaterial2 : iGUIImage;
@HideInInspector
var LabMaterial3 : iGUILabel;
@HideInInspector
var ImgMaterial3 : iGUIImage;
@HideInInspector
var LabMaterial4 : iGUILabel;
@HideInInspector
var ImgMaterial4 : iGUIImage;
@HideInInspector
var LabMaterial0 : iGUILabel;
@HideInInspector
var ImgMaterial0 : iGUIImage;
@HideInInspector
var ConMaterial : iGUIContainer;
@HideInInspector
var BtnSaftyMinus : iGUIButton;
@HideInInspector
var LabSaftyNum : iGUILabel;
@HideInInspector
var LabObtainNum : iGUILabel;
@HideInInspector
var BtnSaftyAdd : iGUIButton;
@HideInInspector
var BtnLuckyMinus : iGUIButton;
@HideInInspector
var LabLuckyNum : iGUILabel;
@HideInInspector
var BtnLuckyAdd : iGUIButton;
@HideInInspector
var ImgObtain : iGUIImage;
@HideInInspector
var ImgBar : iGUIImage;
@HideInInspector
var ImgLucky : iGUIImage;
@HideInInspector
var ImgSafty : iGUIImage;
@HideInInspector
var LabLevel : iGUILabel;
@HideInInspector
var LabCurrSkillValue : iGUILabel;
@HideInInspector
var BtnClose : iGUIButton;
@HideInInspector
var PanMain : iGUIPanel;
@HideInInspector
var root1 : iGUIRoot;
