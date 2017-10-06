#pragma strict
#pragma downcast
import iGUI;

class DressIcon {
	public var equip : Item = null;			// equip data
	public var asynIcon : AsynIcon = null;	// asyn icon manager
	public var iconSlot : iGUIImage;		// icon slot ui
	
	public function CallbackIconLoad(tex : Texture) {
		iconSlot.image = tex;
	}
}

class MallGoodsIcon {
	public var goods : ShopCenterRow = null;	// goods data
	public var asynIcon : AsynIcon = null;		// asyn icon manager
	public var iconSlot : iGUIImage;			// icon slot ui
	
	public function CallbackIconLoad(tex : Texture) {
		iconSlot.image = tex;
	}
}

class EquipIcon {
	public var data : EquipSlotData;			// slotData
	public var asynIcon : AsynIcon = null;		// asyn icon manager
	public var iconSlot : iGUIImage;			// icon slot ui
	
	public function CallbackIconLoad(tex : Texture) {
		iconSlot.image = tex;
	}
}

class EquipSlotData {
	public var goodsID : int = 0;
	public var itemID : int = 0;
	public var instanceID : UInt64 = 0;
}

enum DBMoneyChoose {
	DBMONEY_NONE = 0,
	DBMONEY_COIN = 1,
	DBMONEY_CREDIT = 2
}

private var BClickDownLeftGirl : boolean = false;
private var BClickDownRightGirl : boolean = false;
private var BClickDownLeft : boolean = false;
private var BClickDownRight : boolean = false;
private var mDBMoneyChoose : DBMoneyChoose = DBMoneyChoose.DBMONEY_NONE;
private var mInit : boolean = false;

function Start() {
	if(mInit == false) {
		Init();
	}
}

function Update() {
	if(BClickDownLeftGirl) {
		DressLogicCenter.GetInstance().GirlViewLeft();
	}
	if(BClickDownRightGirl) {
		DressLogicCenter.GetInstance().GirlViewRight();
	}
	if(BClickDownLeft) {
		DressLogicCenter.GetInstance().BoyViewLeft();
	}
	if(BClickDownRight) {
		DressLogicCenter.GetInstance().BoyViewRight();
	}
}

private function Init() {
	ConSlot1.userData = 1;
	ConSlot2.userData = 2;
	ConSlot3.userData = 3;
	ConSlot4.userData = 4;
	ConSlot5.userData = 5;
	ConSlot6.userData = 6;
	ConSlot7.userData = 7;
	ConSlot8.userData = 8;
	ConSlot9.userData = 9;
	ConSlot10.userData = 10;
	ConSlot11.userData = 11;
	
	ImgSlotBG1.clickCallback = CallbackMouseClickPackSlot;
	ImgSlotBG2.clickCallback = CallbackMouseClickPackSlot;
	ImgSlotBG3.clickCallback = CallbackMouseClickPackSlot;
	ImgSlotBG4.clickCallback = CallbackMouseClickPackSlot;
	ImgSlotBG5.clickCallback = CallbackMouseClickPackSlot;
	ImgSlotBG6.clickCallback = CallbackMouseClickPackSlot;
	ImgSlotBG7.clickCallback = CallbackMouseClickPackSlot;
	ImgSlotBG8.clickCallback = CallbackMouseClickPackSlot;
	ImgSlotBG9.clickCallback = CallbackMouseClickPackSlot;
	ImgSlotBG10.clickCallback = CallbackMouseClickPackSlot;
	ImgSlotBG11.clickCallback = CallbackMouseClickPackSlot;
	
	ImgSlotBG1.mouseOverCallback = CallbackMouseOverPackSlot;
	ImgSlotBG2.mouseOverCallback = CallbackMouseOverPackSlot;
	ImgSlotBG3.mouseOverCallback = CallbackMouseOverPackSlot;
	ImgSlotBG4.mouseOverCallback = CallbackMouseOverPackSlot;
	ImgSlotBG5.mouseOverCallback = CallbackMouseOverPackSlot;
	ImgSlotBG6.mouseOverCallback = CallbackMouseOverPackSlot;
	ImgSlotBG7.mouseOverCallback = CallbackMouseOverPackSlot;
	ImgSlotBG8.mouseOverCallback = CallbackMouseOverPackSlot;
	ImgSlotBG9.mouseOverCallback = CallbackMouseOverPackSlot;
	ImgSlotBG10.mouseOverCallback = CallbackMouseOverPackSlot;
	ImgSlotBG11.mouseOverCallback = CallbackMouseOverPackSlot;
	//add will
	BtnGoodsWill1.clickCallback = BtnGoodsWillCallback;
	BtnGoodsWill2.clickCallback = BtnGoodsWillCallback;
	BtnGoodsWill3.clickCallback = BtnGoodsWillCallback;
	BtnGoodsWill4.clickCallback = BtnGoodsWillCallback;
	BtnGoodsWill5.clickCallback = BtnGoodsWillCallback;
	BtnGoodsWill6.clickCallback = BtnGoodsWillCallback;
	BtnGoodsWill7.clickCallback = BtnGoodsWillCallback;
	BtnGoodsWill8.clickCallback = BtnGoodsWillCallback;
	BtnGoodsWill9.clickCallback = BtnGoodsWillCallback;
	BtnGoodsWill10.clickCallback = BtnGoodsWillCallback;
	BtnGoodsWill11.clickCallback = BtnGoodsWillCallback;
	BtnGoodsWill12.clickCallback = BtnGoodsWillCallback;
	/*	ui adjust
	BtnGoodsWill13.clickCallback = BtnGoodsWillCallback;
	BtnGoodsWill14.clickCallback = BtnGoodsWillCallback;
	BtnGoodsWill15.clickCallback = BtnGoodsWillCallback;
	BtnGoodsWill16.clickCallback = BtnGoodsWillCallback;
	*/
	//
	BtnLeftOne.clickCallback = CallbackMouseClickPackLeftOne;
	BtnRightOne.clickCallback = CallbackMouseClickPackRightOne;
	BtnLeftPage.clickCallback = CallbackMouseClickPackLeftPage;
	BtnRightPage.clickCallback = CallbackMouseClickPackRightPage;
	BtnDressFemale.clickCallback = CallbackMouseClickPackFemale;
	BtnDressMale.clickCallback = CallbackMouseClickPackMale;
	BtnQuit.clickCallback = CallbackMouseClickQuit;
	BtnSave.clickCallback = CallbackMouseClickSave;
	BtnHuanzuan.clickCallback = CallbackMouseClickOpenQQHome;
	
	ConGoods1.userData = 1;
	ConGoods2.userData = 2;
	ConGoods3.userData = 3;
	ConGoods4.userData = 4;
	ConGoods5.userData = 5;
	ConGoods6.userData = 6;
	ConGoods7.userData = 7;
	ConGoods8.userData = 8;
	ConGoods9.userData = 9;
	ConGoods10.userData = 10;
	ConGoods11.userData = 11;
	ConGoods12.userData = 12;
	/*
	ConGoods13.userData = 13;
	ConGoods14.userData = 14;
	ConGoods15.userData = 15;
	ConGoods16.userData = 16;
	*/
	
	BtnPreview1.clickCallback = CallbackMouseClickMallSlot;
	BtnPreview2.clickCallback = CallbackMouseClickMallSlot;
	BtnPreview3.clickCallback = CallbackMouseClickMallSlot;
	BtnPreview4.clickCallback = CallbackMouseClickMallSlot;
	BtnPreview5.clickCallback = CallbackMouseClickMallSlot;
	BtnPreview6.clickCallback = CallbackMouseClickMallSlot;
	BtnPreview7.clickCallback = CallbackMouseClickMallSlot;
	BtnPreview8.clickCallback = CallbackMouseClickMallSlot;
	BtnPreview9.clickCallback = CallbackMouseClickMallSlot;
	BtnPreview10.clickCallback = CallbackMouseClickMallSlot;
	BtnPreview11.clickCallback = CallbackMouseClickMallSlot;
	BtnPreview12.clickCallback = CallbackMouseClickMallSlot;
	
	ImgGoods1.clickCallback = CallbackMouseClickMallSlot;
	ImgGoods2.clickCallback = CallbackMouseClickMallSlot;
	ImgGoods3.clickCallback = CallbackMouseClickMallSlot;
	ImgGoods4.clickCallback = CallbackMouseClickMallSlot;
	ImgGoods5.clickCallback = CallbackMouseClickMallSlot;
	ImgGoods6.clickCallback = CallbackMouseClickMallSlot;
	ImgGoods7.clickCallback = CallbackMouseClickMallSlot;
	ImgGoods8.clickCallback = CallbackMouseClickMallSlot;
	ImgGoods9.clickCallback = CallbackMouseClickMallSlot;
	ImgGoods10.clickCallback = CallbackMouseClickMallSlot;
	ImgGoods11.clickCallback = CallbackMouseClickMallSlot;
	ImgGoods12.clickCallback = CallbackMouseClickMallSlot;
	/*
	ImgGoodsBG13.clickCallback = CallbackMouseClickMallSlot;
	ImgGoodsBG14.clickCallback = CallbackMouseClickMallSlot;
	ImgGoodsBG15.clickCallback = CallbackMouseClickMallSlot;
	ImgGoodsBG16.clickCallback = CallbackMouseClickMallSlot;
	*/
	
	ImgGoods1.mouseOverCallback = CallbackMouseOverMallSlot;
	ImgGoods2.mouseOverCallback = CallbackMouseOverMallSlot;
	ImgGoods3.mouseOverCallback = CallbackMouseOverMallSlot;
	ImgGoods4.mouseOverCallback = CallbackMouseOverMallSlot;
	ImgGoods5.mouseOverCallback = CallbackMouseOverMallSlot;
	ImgGoods6.mouseOverCallback = CallbackMouseOverMallSlot;
	ImgGoods7.mouseOverCallback = CallbackMouseOverMallSlot;
	ImgGoods8.mouseOverCallback = CallbackMouseOverMallSlot;
	ImgGoods9.mouseOverCallback = CallbackMouseOverMallSlot;
	ImgGoods10.mouseOverCallback = CallbackMouseOverMallSlot;
	ImgGoods11.mouseOverCallback = CallbackMouseOverMallSlot;
	ImgGoods12.mouseOverCallback = CallbackMouseOverMallSlot;
	/*
	ImgGoodsBG13.mouseOverCallback = CallbackMouseOverMallSlot;
	ImgGoodsBG14.mouseOverCallback = CallbackMouseOverMallSlot;
	ImgGoodsBG15.mouseOverCallback = CallbackMouseOverMallSlot;
	ImgGoodsBG16.mouseOverCallback = CallbackMouseOverMallSlot;
	*/
	
	
	BtnNew.clickCallback = CallbackMouseClickMallNew;
	BtnMallFemale.clickCallback = CallbackMouseClickMallFemale;
	BtnMallMale.clickCallback = CallbackMouseClickMallMale;
	BtnMallLeft.clickCallback = CallbackMouseClickMallLeft;
	BtnMallRight.clickCallback = CallbackMouseClickMallRight;
	BtnMallDiamond.clickCallback = CallbackMouseClickMallDiamond;
	BtnMallClothes.clickCallback = CallbackMouseClickMallClothes;
	BtnMallCloak.clickCallback = CallbackMouseClickMallCloak;
	BtnMallGlass.clickCallback = CallbackMouseClickMallGlass;
	BtnMallHead.clickCallback = CallbackMouseClickMallHead;
	BtnMallRing.clickCallback = CallbackMouseClickMallRing;
	BtnMallShoes.clickCallback = CallbackMouseClickMallShoes;

	
	BtnLeftViewGirl.clickCallback = CallbackMouseClickLeftViewGirl;
	BtnResetGirl.clickCallback = CallbackMouseClickResetGirl;
	BtnRightViewGirl.clickCallback = CallbackMouseClickViewGirl;
	BtnLeftView.clickCallback = CallbackMouseClickLeftView;
	BtnReset.clickCallback = CallbackMouseClickReset;
	BtnRightView.clickCallback = CallbackMouseClickRightView;
	
	BtnLeftViewGirl.clickUpCallback = CallbackMouseClickUpLeftViewGirl;
	BtnLeftViewGirl.clickDownCallback = CallbackMouseClickDownLeftViewGirl;
	BtnLeftViewGirl.mouseOutCallback = CallbackMouseMouseOutLeftViewGirl;
	BtnRightViewGirl.clickUpCallback = CallbackMouseClickUpViewGirl;
	BtnRightViewGirl.clickDownCallback = CallbackMouseClickDownViewGirl;
	BtnRightViewGirl.mouseOutCallback = CallbackMouseMouseOutViewGirl;
	
	BtnLeftView.clickUpCallback = CallbackMouseClickUpLeftView;
	BtnLeftView.clickDownCallback = CallbackMouseClickDownLeftView;
	BtnLeftView.mouseOutCallback = CallbackMouseMouseOutLeftView;
	BtnRightView.clickUpCallback = CallbackMouseClickUpRightView;
	BtnRightView.clickDownCallback = CallbackMouseClickDownRightView;
	BtnRightView.mouseOutCallback = CallbackMouseMouseOutRightView;
		
	ImgBody1.clickCallback = CallbackMouseClickBody;
	ImgBody2.clickCallback = CallbackMouseClickBody;
	ImgBody3.clickCallback = CallbackMouseClickBody;
	ImgBody4.clickCallback = CallbackMouseClickBody;
	ImgBody5.clickCallback = CallbackMouseClickBody;
	ImgBody6.clickCallback = CallbackMouseClickBody;
	
	ImgBody1.mouseOverCallback = CallbackMouseOverBody;
	ImgBody2.mouseOverCallback = CallbackMouseOverBody;
	ImgBody3.mouseOverCallback = CallbackMouseOverBody;
	ImgBody4.mouseOverCallback = CallbackMouseOverBody;
	ImgBody5.mouseOverCallback = CallbackMouseOverBody;
	ImgBody6.mouseOverCallback = CallbackMouseOverBody;
	
	ImgBody1Girl.clickCallback = CallbackMouseClickBodyGirl;
	ImgBody2Girl.clickCallback = CallbackMouseClickBodyGirl;
	ImgBody3Girl.clickCallback = CallbackMouseClickBodyGirl;
	ImgBody4Girl.clickCallback = CallbackMouseClickBodyGirl;
	ImgBody5Girl.clickCallback = CallbackMouseClickBodyGirl;
	ImgBody6Girl.clickCallback = CallbackMouseClickBodyGirl;
	
	ImgBody1Girl.mouseOverCallback = CallbackMouseOverBody;
	ImgBody2Girl.mouseOverCallback = CallbackMouseOverBody;
	ImgBody3Girl.mouseOverCallback = CallbackMouseOverBody;
	ImgBody4Girl.mouseOverCallback = CallbackMouseOverBody;
	ImgBody5Girl.mouseOverCallback = CallbackMouseOverBody;
	ImgBody6Girl.mouseOverCallback = CallbackMouseOverBody;
	
	//check buy
	BtnCBSure.clickCallback = CallbackMouseClickCheckBuySure;
	BtnCBCancel.clickCallback = CallbackMouseClickCheckBuyCancel;
	BtnCBChoose1.clickCallback = CallbackMouseClickCheckBuyChoose1;
	BtnCBChoose2.clickCallback = CallbackMouseClickCheckBuyChoose2;
	
	Global.GetSysMsgHandler().RegistMsgCallback(540,CallbackSaveDress,CallbackOperateCancel, null);
	
	if(PlatformMgr.IsPlatYY()) {
		BtnHuanzuan.setEnabled(false);
	} else {
		BtnHuanzuan.setEnabled(true);
	}
	
	mInit = true;
} 

private function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_GOLD_UPDATE), HandleNotifyUpdateGoldShow);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_RMB_UPDATE), HandleNotifyUpdateRMBShow);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_CREDIT_UPDATE), HandleNotifyUpdateCreditShow);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_BOY_SLOT_ICON), HandleNotifyBoySlotIcon);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_GIRL_SLOT_ICON), HandleNotifyGirlSlotIcon);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_ENABLE), HandleNotifyDressEnable);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_REFRESH_PACK_LIST), HandleNotifyDressRefreshPackList);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_CLEAR_BOY_SLOT_ICON), HandleNotifyBoySlotIconClear);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_CLEAR_GIRL_SLOT_ICON), HandleNotifyGirlSlotIconClear);
}

//handle game evt
private function HandleNotifyUpdateGoldShow(evt:GameEvent, obj:System.Object) {
	LabGold.label.text = obj.ToString();
}

private function HandleNotifyUpdateRMBShow(evt:GameEvent, obj:System.Object) {
	LabRMB.label.text = obj.ToString();
}

private function HandleNotifyUpdateCreditShow(evt:GameEvent, obj:System.Object) {
	LabCredit.label.text = obj.ToString();
}

private function HandleNotifyBoySlotIcon(evt:GameEvent, obj:System.Object) {
	var data : EquipSlotData = obj as EquipSlotData;
	if (0 == data.itemID) return;
	
	var dressID: int = ResManager.LgtMgr.getItemRow(data.itemID).sub_id;
	var equipPos : int = (ResManager.LgtMgr.ItemDressTable[dressID] as ItemDressRow).equip_pos;
	var validImage : iGUIImage = null;
	var lvValidImage : iGUIImage = null;
	
	var equip_icon : EquipIcon = new EquipIcon();
	equip_icon.data = data;
	switch(equipPos) {
		case 0:equip_icon.iconSlot = ImgBody3;validImage = ImgBodyValid3;lvValidImage = ImgBodyLvValid3;break;
		case 1:equip_icon.iconSlot = ImgBody4;validImage = ImgBodyValid4;lvValidImage = ImgBodyLvValid4;break;
		case 2:equip_icon.iconSlot = ImgBody2;validImage = ImgBodyValid2;lvValidImage = ImgBodyLvValid2;break;
		case 3:equip_icon.iconSlot = ImgBody1;validImage = ImgBodyValid1;lvValidImage = ImgBodyLvValid1;break;
		case 4:equip_icon.iconSlot = ImgBody6;validImage = ImgBodyValid6;lvValidImage = ImgBodyLvValid6;break;
		case 5:equip_icon.iconSlot = ImgBody5;validImage = ImgBodyValid5;lvValidImage = ImgBodyLvValid5;break;
		//case 6:equip_icon.iconSlot = ImgBody5;break;
		//case 7:equip_icon.iconSlot = ImgBody5;break;
	}
	equip_icon.asynIcon =  new AsynIcon(equip_icon.CallbackIconLoad, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	equip_icon.asynIcon.load("Icon/" + ResManager.LgtMgr.getItemRow(data.itemID).icon);
				
	equip_icon.iconSlot.userData = equip_icon;
	
	RefreshTimeOutValid(equip_icon,validImage,lvValidImage);
}

private function HandleNotifyGirlSlotIcon(evt:GameEvent, obj:System.Object) {
	var data : EquipSlotData = obj as EquipSlotData;
	if (0 == data.itemID) return;
	
	var dressID: int = ResManager.LgtMgr.getItemRow(data.itemID).sub_id;
	var equipPos : int = (ResManager.LgtMgr.ItemDressTable[dressID] as ItemDressRow).equip_pos;
	var validImage : iGUIImage = null;
	var lvValidImage : iGUIImage = null;
	
	var equip_icon : EquipIcon = new EquipIcon();
	equip_icon.data = data;
	switch(equipPos) {
		case 0:equip_icon.iconSlot = ImgBody3Girl;validImage = ImgBodyValid3Girl;lvValidImage = ImgBodyLvValid3Girl;break;
		case 1:equip_icon.iconSlot = ImgBody4Girl;validImage = ImgBodyValid4Girl;lvValidImage = ImgBodyLvValid4Girl;break;
		case 2:equip_icon.iconSlot = ImgBody2Girl;validImage = ImgBodyValid2Girl;lvValidImage = ImgBodyLvValid2Girl;break;
		case 3:equip_icon.iconSlot = ImgBody1Girl;validImage = ImgBodyValid1Girl;lvValidImage = ImgBodyLvValid1Girl;break;
		case 4:equip_icon.iconSlot = ImgBody6Girl;validImage = ImgBodyValid6Girl;lvValidImage = ImgBodyLvValid6Girl;break;
		case 5:equip_icon.iconSlot = ImgBody5Girl;validImage = ImgBodyValid5Girl;lvValidImage = ImgBodyLvValid5Girl;break;
		//case 6:equip_icon.iconSlot = ImgBody5Girl;break;
		//case 7:equip_icon.iconSlot = ImgBody5Girl;break;
	}
	equip_icon.asynIcon =  new AsynIcon(equip_icon.CallbackIconLoad, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	equip_icon.asynIcon.load("Icon/" + ResManager.LgtMgr.getItemRow(data.itemID).icon);
				
	equip_icon.iconSlot.userData = equip_icon;
	
	RefreshTimeOutValid(equip_icon,validImage,lvValidImage);
}

private function HandleNotifyDressEnable(evt:GameEvent, obj:System.Object) {
	Enable(obj);
}

private function HandleNotifyDressRefreshPackList(evt : GameEvent, obj:System.Object) {
	var packList : ArrayList = DressLogicCenter.GetInstance().GetCurPackPageData(0);
	RefreshPackList(packList);
}

private function HandleNotifyBoySlotIconClear(evt:GameEvent, obj:System.Object) {
	switch(obj) {
		case 0:ImgBody3.image = null;ImgBody3.userData = null;ImgBodyValid3.setEnabled(false);ImgBodyLvValid3.setEnabled(false);break;
		case 1:ImgBody4.image = null;ImgBody4.userData = null;ImgBodyValid4.setEnabled(false);ImgBodyLvValid4.setEnabled(false);break;
		case 2:ImgBody2.image = null;ImgBody2.userData = null;ImgBodyValid2.setEnabled(false);ImgBodyLvValid2.setEnabled(false);break;
		case 3:ImgBody1.image = null;ImgBody1.userData = null;ImgBodyValid1.setEnabled(false);ImgBodyLvValid1.setEnabled(false);break;
		case 4:ImgBody6.image = null;ImgBody6.userData = null;ImgBodyValid6.setEnabled(false);ImgBodyLvValid6.setEnabled(false);break;
		case 5:ImgBody5.image = null;ImgBody5.userData = null;ImgBodyValid5.setEnabled(false);ImgBodyLvValid5.setEnabled(false);break;
		//case 6:ImgBody5.image = null;ImgBody5.userData = null;break;
		//case 7:ImgBody5.image = null;ImgBody5.userData = null;break;
	}
}

private function HandleNotifyGirlSlotIconClear(evt:GameEvent, obj:System.Object) {
	switch(obj) {
		case 0:ImgBody3Girl.image = null;ImgBody3Girl.userData = null;ImgBodyValid3Girl.setEnabled(false);ImgBodyLvValid3Girl.setEnabled(false);break;
		case 1:ImgBody4Girl.image = null;ImgBody4Girl.userData = null;ImgBodyValid4Girl.setEnabled(false);ImgBodyLvValid4Girl.setEnabled(false);break;
		case 2:ImgBody2Girl.image = null;ImgBody2Girl.userData = null;ImgBodyValid2Girl.setEnabled(false);ImgBodyLvValid2Girl.setEnabled(false);break;
		case 3:ImgBody1Girl.image = null;ImgBody1Girl.userData = null;ImgBodyValid1Girl.setEnabled(false);ImgBodyLvValid1Girl.setEnabled(false);break;
		case 4:ImgBody6Girl.image = null;ImgBody6Girl.userData = null;ImgBodyValid6Girl.setEnabled(false);ImgBodyLvValid6Girl.setEnabled(false);break;
		case 5:ImgBody5Girl.image = null;ImgBody5Girl.userData = null;ImgBodyValid5Girl.setEnabled(false);ImgBodyLvValid5Girl.setEnabled(false);break;
		//case 6:ImgBody3Girl.image = null;ImgBody3Girl.userData = null;break;
		//case 7:ImgBody3Girl.image = null;ImgBody3Girl.userData = null;break;
	}
}

var rootArray : Array;
function Enable(bActive : boolean) {
	UI.getUI().EnableUIRoot("DressUI",bActive);
	var kRoot : Array = new Array();
	kRoot.Add("DressUI");
	if (20003 == NewPlayGuideModule.CurNewHandSuffix || 20004 == NewPlayGuideModule.CurNewHandSuffix
		|| 10003 == NewPlayGuideModule.CurNewHandSuffix || 10004 == NewPlayGuideModule.CurNewHandSuffix)
	{
		kRoot.Add("StepLeadRoot");
	}
	if(bActive) {
		rootArray = UI.getUI().EnableUIRootIgnore(kRoot,false);
	} else {
		UI.getUI().EnableUIRoot(rootArray,true);
		
		Global.SysTooltip.Hide();
	}
	
	if(bActive) {
		if(mInit == false) {
			Init();
		}
		
		ClearAvatarSlot();
		
		DressLogicCenter.GetInstance().Init();
		
		var packList : ArrayList = DressLogicCenter.GetInstance().GetCurPackPageData(0);
		RefreshPackList(packList);
		
		var mallList : ArrayList = DressLogicCenter.GetInstance().ChangeMallSort(DressMall.GoodsSort.SORT_NEW);
		RefreshMallList(mallList);
		
		LabGold.label.text = "0";
		LabRMB.label.text = "0";
		LabCredit.label.text = "0";
		RefreshMallPage();
		
		BClickDownLeftGirl = false;
		BClickDownRightGirl = false;
		BClickDownLeft = false;
		BClickDownRight = false;
		
		ImgNewSelect.setEnabled(false);
		ImgMaleSelect.setEnabled(false);
		ImgFemaleSelect.setEnabled(false);
		
		if(PlayerFriend.GetInstance().IsMainPlayerBoy()) {
			ImgBodyPreview1.setEnabled(false);
			ImgBodyPreview2.setEnabled(false);
			ImgBodyPreview3.setEnabled(false);
			ImgBodyPreview4.setEnabled(false);
			ImgBodyPreview5.setEnabled(false);
			ImgBodyPreview6.setEnabled(false);
			
			ImgBodyPreview1Girl.setEnabled(true);
			ImgBodyPreview2Girl.setEnabled(true);
			ImgBodyPreview3Girl.setEnabled(true);
			ImgBodyPreview4Girl.setEnabled(true);
			ImgBodyPreview5Girl.setEnabled(true);
			ImgBodyPreview6Girl.setEnabled(true);
			
			ImgBoyNotice.setEnabled(false);
			if(DressLogicCenter.GetInstance().IsSingle()) {
				ImgGirlNotice.setEnabled(true);
			}
		} else {
			ImgBodyPreview1.setEnabled(true);
			ImgBodyPreview2.setEnabled(true);
			ImgBodyPreview3.setEnabled(true);
			ImgBodyPreview4.setEnabled(true);
			ImgBodyPreview5.setEnabled(true);
			ImgBodyPreview6.setEnabled(true);
			
			ImgBodyPreview1Girl.setEnabled(false);
			ImgBodyPreview2Girl.setEnabled(false);
			ImgBodyPreview3Girl.setEnabled(false);
			ImgBodyPreview4Girl.setEnabled(false);
			ImgBodyPreview5Girl.setEnabled(false);
			ImgBodyPreview6Girl.setEnabled(false);
			
			ImgGirlNotice.setEnabled(false);
			if(DressLogicCenter.GetInstance().IsSingle()) {
				ImgBoyNotice.setEnabled(true);
			}
		}
		
		BtnMallFemale.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/woman");
		BtnMallFemale.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/woman_hover");
		BtnMallMale.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/man");
		BtnMallMale.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/man_hover");
		BtnNew.style.normal.background = Resources.Load("UISkins/Textures/itemshop/new_push");
		BtnNew.style.hover.background = null;
		
		BtnMallGlass.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_yanjing_n");
		BtnMallGlass.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_yanjing_h");
		BtnMallHead.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_toubu_n");
		BtnMallHead.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_toubu_h");
		BtnMallRing.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_shipin_n");
		BtnMallRing.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_shipin_h");;
		BtnMallShoes.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_jiaobu_n");
		BtnMallShoes.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_jiaobu_h");
		BtnMallCloak.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_beibu_n");
		BtnMallCloak.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_beibu_h");
		BtnMallClothes.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_shenti_h");
		BtnMallClothes.style.hover.background = null;
		
		EnableCheckBuy(false);
	}
}

function EnableCheckBuy(enable : boolean) {
	PanCheckBuy.setEnabled(enable);
	PanBoy.passive = enable;
	PanGirl.passive = enable;
	DressStorage.passive = enable;
	PanMall.passive = enable;
	
	if(enable == true) {
		var cost : int = DataCenter.GetPlayerDiamond();
		LabCBMoney1.label.text = cost.ToString();
		var cost1 : int = DataCenter.GetPlayerCredit();
		LabCBMoney2.label.text = cost1.ToString();
		
		mDBMoneyChoose = DBMoneyChoose.DBMONEY_NONE;
		ImgCBChoose1.setEnabled(false);
		ImgCBChoose2.setEnabled(false);
		LabCBTip.label.text = "";
		LabCBCost.label.text = "";
		CallbackMouseClickCheckBuyChoose1(BtnCBChoose1);
	}
}

function RefreshPackList(list : ArrayList) {
	ClearPackList();
	
	if(list == null) {
		Debug.LogWarning("pack list is null!!");
		return ;
	} else {
		for(var i=0; i<list.Count; i++) {
			SetPackSlot(i+1,list[i]);
		}
	}
}

function RefreshMallList(list : ArrayList) {
	ClearMallList();
	
	if(list == null) {
		Debug.LogWarning("mall list is null!!");
		return ;
	}
	
	for(var i=0; i<list.Count; i++) {
		SetMallSlot(i+1,list[i]);
	}
}

function RefreshMallPage() {
	var curPage : int = DressLogicCenter.GetInstance().GetMallCurrPage();
	var totalPage : int = DressLogicCenter.GetInstance().GetMallTotalPage();
	if(totalPage == 0) totalPage = 1;
	if(curPage == 0) curPage = 1;
	LabMallPage.label.text = curPage.ToString()+"/"+totalPage.ToString();
	if(curPage == 1) {
		BtnMallLeft.passive = true;
	} else {
		BtnMallLeft.passive = false;
	}
	if(curPage >= totalPage) {
		BtnMallRight.passive = true;
	} else {
		BtnMallRight.passive = false;
	}
}

function RefreshTimeOutValid(slot : EquipIcon, image : iGUIImage, lvImg : iGUIImage) {
	if(slot == null || image == null) return ;
	
	var bLevelValid : boolean = DressLogicCenter.GetInstance().IsLevelValid(slot.data.itemID);
	if(bLevelValid) {
		lvImg.setEnabled(false);
	} else {
		lvImg.setEnabled(true);
	}
	
	if(slot.data.instanceID != 0)		
	{
		var id64:UInt64 = slot.data.instanceID;
		var grid : pack_grid = DressLogicCenter.GetInstance().GetBodyEquip(id64);
		if(grid != null) {
			if(TimeEffect.getInstance().isMature(grid.item_data.del_time)) {
				image.setEnabled(true);
				lvImg.setEnabled(false);
			} else {
				image.setEnabled(false);
			}
		} else {	
			var pa : PackGrid = SelfItemLogic.getInstance().Package.getItemPack(slot.data.instanceID);
			if(pa == null) {
				image.setEnabled(true);
				lvImg.setEnabled(false);
			}
			else if(TimeEffect.getInstance().isMature(pa._item._delTime)) {
				image.setEnabled(true);
				lvImg.setEnabled(false);
			} else {
				image.setEnabled(false);
			}
		}
	} else {
		image.setEnabled(false);
	}
}

function RefreshTimeOutValid(slot : DressIcon, image : iGUIImage, lvImg : iGUIImage) {
	if(slot == null || image == null) return ;
	
	var bLevelValid : boolean = DressLogicCenter.GetInstance().IsLevelValid(slot.equip._itemInfo.id);
	if(bLevelValid) {
		lvImg.setEnabled(false);
	} else {
		lvImg.setEnabled(true);
	}
	
	if(slot.equip._instanceID != 0)		
	{
		if(TimeEffect.getInstance().isMature(slot.equip._delTime)) {
			image.setEnabled(true);
			lvImg.setEnabled(false);
		} else {
			image.setEnabled(false);
		}
	} else {
		image.setEnabled(false);
	}
}

function ClearAvatarSlot() {
	ImgBody1.image = null;
	ImgBody1.userData = null;
	ImgBody2.image = null;
	ImgBody2.userData = null;
	ImgBody3.image = null;
	ImgBody3.userData = null;
	ImgBody4.image = null;
	ImgBody4.userData = null;
	ImgBody5.image = null;
	ImgBody5.userData = null;
	ImgBody6.image = null;
	ImgBody6.userData = null;
	
	ImgBody1Girl.image = null;
	ImgBody1Girl.userData = null;
	ImgBody2Girl.image = null;
	ImgBody2Girl.userData = null;
	ImgBody3Girl.image = null;
	ImgBody3Girl.userData = null;
	ImgBody4Girl.image = null;
	ImgBody4Girl.userData = null;
	ImgBody5Girl.image = null;
	ImgBody5Girl.userData = null;
	ImgBody6Girl.image = null;
	ImgBody6Girl.userData = null;
	
}

private function SetPackSlot(slot : int, ins : Item) {
	for(var element:iGUIElement in ConDressList.items) {
		if(element.userData == slot) {
			if(element.items[0].userData != null) {
				(element.items[0].userData as DressIcon).asynIcon.cancel();
			}
			
			if(ins == null) {
				(element.items[1] as iGUIImage).image = null;
				element.items[3].label.text = "";
				element.items[2].setEnabled(false);
				element.items[4].setEnabled(false);
				
				element.items[0].userData = null;
			} else {
				var dress_icon : DressIcon = new DressIcon();
				dress_icon.equip = ins;
				dress_icon.iconSlot = element.items[1];
				dress_icon.asynIcon =  new AsynIcon(dress_icon.CallbackIconLoad, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
				dress_icon.asynIcon.load("Icon/" + ins._itemInfo.icon);
				
				var nameStr : String = ins._itemInfo.name;
				var labText : String = "";
				if(nameStr.Length > 3) { 
					labText = nameStr.Substring(0,3)+"...";
				} else {
					labText = nameStr;
				}
				element.items[3].label.text = labText;
				
				element.items[0].userData = dress_icon;
				
				RefreshTimeOutValid(dress_icon,element.items[2],element.items[4]);
				break;
			}
		}
	}
}

private function SetMallSlot(slot : int, ins : ShopCenterRow) {
	for(var element:iGUIElement in PanGoods.items) {
		if(element.userData == slot) {
			if(element.items[1].userData != null) {
				(element.items[1].userData as MallGoodsIcon).asynIcon.cancel();
			}
			
			if(ins == null) {
				(element.items[2] as iGUIImage).image = null;
				(element.items[3] as iGUIImage).image = null;
				element.items[7].setEnabled(false);
				element.items[4].label.text = "";
				element.items[5].label.text = "";
				element.items[6].label.text = "";
				
				element.items[3].userData = null;
				element.items[1].userData = null;
			} else {
				var goods_icon : MallGoodsIcon = new MallGoodsIcon();
				goods_icon.goods = ins;
				goods_icon.iconSlot = element.items[3];
				goods_icon.asynIcon =  new AsynIcon(goods_icon.CallbackIconLoad, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
				goods_icon.asynIcon.load("Icon/" + ResManager.LgtMgr.getItemRow(ins.item_id).icon);
				
				var priceStr : String = ins.price.ToString();
				var priceYYStr : String = DataCenter.getCostByPlatform(ins.price).ToString();
				var nameStr : String = ResManager.LgtMgr.getItemRow(ins.item_id).name;
				var labText : String = "";
				if(ins.money_type == pay_goods_type.pgt_game_gold) {
					(element.items[2] as iGUIImage).image = null;
					element.items[5].label.text = "";
				} else if(ins.money_type == pay_goods_type.pgt_love_coin) {
					if(PlatformMgr.IsPlatYY()) {
						(element.items[2] as iGUIImage).image = Resources.Load("UISkins/Textures/Common1/aib");
						element.items[5].label.text = priceYYStr;
					} else {
						(element.items[2] as iGUIImage).image = Resources.Load("UISkins/Textures/Common1/aib");
						element.items[5].label.text = priceStr;
					}
				}
				if(nameStr.Length > 10) { 
					labText = nameStr.Substring(0,10)+"...";
				} else {
					labText = nameStr;
				}
				element.items[4].label.text = labText;
				if(ins.point > 0) {
					element.items[6].setEnabled(true);
					element.items[7].setEnabled(true);
					element.items[6].label.text = ins.point.ToString();
				} else {
					element.items[6].setEnabled(false);
					element.items[7].setEnabled(false);
				}
				/*
				if(ResManager.LgtMgr.getItemRow(ins.item_id).overlap > 1) {
					element.items[6].label.text = ResManager.LgtMgr.getItemRow(ins.item_id).overlap.ToString();
				} else {
					element.items[6].label.text = "";
				}
				*/
				
				element.items[1].userData = goods_icon;
				element.items[3].userData = goods_icon;
				break;
			}
		}
	}
}

private function ClearPackList() {
	for(var i=0; i<11; i++) {
		SetPackSlot(i+1,null);
	}
}

private function ClearMallList() {
	for(var i=0; i<12; i++) {
		SetMallSlot(i+1,null);
	}
}

//private function ShowTip(element : iGUIElement,item_id : int) {
//	if(item_id == 0) return ;
//	var str : String = ResManager.LgtMgr.getItemRow(item_id).name;
//	var style : GUIStyle = new GUIStyle();
//	style.normal.textColor = Color.white;
//	style.fontStyle = FontStyle.Bold;
//	Global.SysTooltip.Begin(element);
//	Global.SysTooltip.Add(GUIContent(str),style); 	
//	Global.SysTooltip.Show(true);
//}

//callback
private function CallbackMouseClickPackSlot(callback : iGUIElement) {
	if(callback.userData != null) {
		// 判断时效到期
		if (TimeEffect.getInstance().isMature((callback.userData as DressIcon).equip._delTime))
		{
			UI.getUI().OpenMsgbox("", Define.getContent(5137), true);
			return;
		}
		DressLogicCenter.GetInstance().Equip((callback.userData as DressIcon).equip);
	}
}

private function CallbackMouseOverPackSlot(callback : iGUIElement) {
	if(callback.userData != null) {
		//ShowTip(callback,callback.userData.equip._itemInfo.id);
		ItemHint.ShowPackItemHint(callback, (callback.userData as DressIcon).equip, false);
	}
}

private function CallbackMouseClickPackLeftOne(callback : iGUIElement) {
	var packList : ArrayList = DressLogicCenter.GetInstance().GetCurPackPageData(-1);
	RefreshPackList(packList);
}

private function CallbackMouseClickPackRightOne(callback : iGUIElement) {
	var packList : ArrayList = DressLogicCenter.GetInstance().GetCurPackPageData(1);
	RefreshPackList(packList);
}

private function CallbackMouseClickPackLeftPage(callback : iGUIElement) {
	var packList : ArrayList = DressLogicCenter.GetInstance().GetCurPackPageData(-11);
	RefreshPackList(packList);
}

private function CallbackMouseClickPackRightPage(callback : iGUIElement) {
	var packList : ArrayList = DressLogicCenter.GetInstance().GetCurPackPageData(11);
	RefreshPackList(packList);
}

private function CallbackMouseClickPackFemale(callback : iGUIElement) {
	var packList : ArrayList = DressLogicCenter.GetInstance().ChangePackSort(DressPack.DressSort.SORT_FEMALE);
	RefreshPackList(packList);
}

private function CallbackMouseClickPackMale(callback : iGUIElement) {
	var packList : ArrayList = DressLogicCenter.GetInstance().ChangePackSort(DressPack.DressSort.SORT_MALE);
	RefreshPackList(packList);
}

private function CallbackMouseClickQuit(callback : iGUIElement) {
	UI.getUI().OpenMsgbox("",Define.getContent(5138),Define.ok,CallbackCheckQuitDress as iGUIEventCallback,Define.cancel,CallbackOperateCancel as iGUIEventCallback);
}

private function CallbackCheckQuitDress(callback : iGUIElement) {
	Enable(false);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CONFIRM_QUIT_DRESS));
	DressLogicCenter.GetInstance().Clear();
}

private function CallbackMouseClickSave(callback : iGUIElement) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_SAVE_DRESS));
	var cost : int = DressLogicCenter.GetInstance().GetCostRMB();
	if(cost > 0) {
		//var params : ArrayList = new ArrayList();
		//params.Add(cost);
		//Global.GetSysMsgHandler().ShowSysMsg(540,params);
		EnableCheckBuy(true);
	} else {
		DressLogicCenter.GetInstance().Save(money_type.mt_love_coin);
	}
}

private function CallbackMouseClickOpenQQHome(callback : iGUIElement) {
	QQHomeLogic.GetInstance().OpenQQHome();
}

private function CallbackSaveDress(callback : iGUIElement) {
	DressLogicCenter.GetInstance().Save(money_type.mt_love_coin);
}

private function CallbackOperateCancel(callback : iGUIElement) {
	//DO NOTHING
}

private function CallbackMouseClickMallNew(callback : iGUIElement) {
	var mallList : ArrayList = DressLogicCenter.GetInstance().ChangeMallSort(DressMall.GoodsSort.SORT_NEW);
	RefreshMallList(mallList);
	RefreshMallPage();
	
	ImgNewSelect.setEnabled(false);
	ImgMaleSelect.setEnabled(false);
	ImgFemaleSelect.setEnabled(false);
	
	BtnMallFemale.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/woman");
	BtnMallFemale.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/woman_hover");
	BtnMallMale.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/man");
	BtnMallMale.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/man_hover");
	BtnNew.style.normal.background = Resources.Load("UISkins/Textures/itemshop/new_push");
	BtnNew.style.hover.background = null;
	
	BtnMallGlass.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_yanjing_n");
	BtnMallGlass.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_yanjing_h");
	BtnMallHead.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_toubu_n");
	BtnMallHead.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_toubu_h");
	BtnMallRing.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_shipin_n");
	BtnMallRing.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_shipin_h");;
	BtnMallShoes.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_jiaobu_n");
	BtnMallShoes.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_jiaobu_h");
	BtnMallCloak.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_beibu_n");
	BtnMallCloak.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_beibu_h");
	BtnMallClothes.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_shenti_h");
	BtnMallClothes.style.hover.background = null;		
}

private function CallbackMouseClickMallFemale(callback : iGUIElement) {
	var mallList : ArrayList = DressLogicCenter.GetInstance().ChangeMallSort(DressMall.GoodsSort.SORT_FEMALE);
	RefreshMallList(mallList);
	RefreshMallPage();
	
	ImgNewSelect.setEnabled(false);
	ImgMaleSelect.setEnabled(false);
	ImgFemaleSelect.setEnabled(false);
	
	BtnMallFemale.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/woman_push");
	BtnMallFemale.style.hover.background = null;
	BtnMallMale.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/man");
	BtnMallMale.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/man_hover");
	BtnNew.style.normal.background = Resources.Load("UISkins/Textures/itemshop/new_normal");
	BtnNew.style.hover.background = Resources.Load("UISkins/Textures/itemshop/new_hover");
	
	BtnMallGlass.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_yanjing_n");
	BtnMallGlass.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_yanjing_h");
	BtnMallHead.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_toubu_n");
	BtnMallHead.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_toubu_h");
	BtnMallRing.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_shipin_n");
	BtnMallRing.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_shipin_h");;
	BtnMallShoes.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_jiaobu_n");
	BtnMallShoes.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_jiaobu_h");
	BtnMallCloak.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_beibu_n");
	BtnMallCloak.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_beibu_h");
	BtnMallClothes.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_shenti_h");
	BtnMallClothes.style.hover.background = null;	
}

private function CallbackMouseClickMallMale(callback : iGUIElement) {
	var mallList : ArrayList = DressLogicCenter.GetInstance().ChangeMallSort(DressMall.GoodsSort.SORT_MALE);
	RefreshMallList(mallList);
	RefreshMallPage();
	
	ImgNewSelect.setEnabled(false);
	ImgMaleSelect.setEnabled(false);
	ImgFemaleSelect.setEnabled(false);
	
	BtnMallFemale.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/woman");
	BtnMallFemale.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/woman_hover");
	BtnMallMale.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/man_push");
	BtnMallMale.style.hover.background = null;
	BtnNew.style.normal.background = Resources.Load("UISkins/Textures/itemshop/new_normal");
	BtnNew.style.hover.background = Resources.Load("UISkins/Textures/itemshop/new_hover");
	
	BtnMallGlass.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_yanjing_n");
	BtnMallGlass.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_yanjing_h");
	BtnMallHead.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_toubu_n");
	BtnMallHead.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_toubu_h");
	BtnMallRing.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_shipin_n");
	BtnMallRing.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_shipin_h");;
	BtnMallShoes.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_jiaobu_n");
	BtnMallShoes.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_jiaobu_h");
	BtnMallCloak.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_beibu_n");
	BtnMallCloak.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_beibu_h");
	BtnMallClothes.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_shenti_h");
	BtnMallClothes.style.hover.background = null;	
}

private function CallbackMouseClickMallLeft(callback : iGUIElement) {
	var mallList : ArrayList = DressLogicCenter.GetInstance().GetMallPrePage();
	RefreshMallList(mallList);
	
	RefreshMallPage();
}

private function CallbackMouseClickMallRight(callback : iGUIElement) {
	var mallList : ArrayList = DressLogicCenter.GetInstance().GetMallNextPage();
	RefreshMallList(mallList);
	
	RefreshMallPage();
}

private function CallbackMouseClickMallClothes(callback : iGUIElement) {
	var mallList : ArrayList = DressLogicCenter.GetInstance().ChangeMallSubSort(DressMall.GoodsSubSort.SORT_SUB_CLOTHES);
	RefreshMallList(mallList);
	RefreshMallPage();
	
	BtnMallGlass.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_yanjing_n");
	BtnMallGlass.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_yanjing_h");
	BtnMallHead.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_toubu_n");
	BtnMallHead.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_toubu_h");
	BtnMallRing.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_shipin_n");
	BtnMallRing.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_shipin_h");
	BtnMallShoes.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_jiaobu_n");
	BtnMallShoes.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_jiaobu_h");
	BtnMallCloak.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_beibu_n");
	BtnMallCloak.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_beibu_h");
	BtnMallClothes.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_shenti_h");
	BtnMallClothes.style.hover.background = null;	
}

private function CallbackMouseClickMallCloak(callback : iGUIElement) {
	var mallList : ArrayList = DressLogicCenter.GetInstance().ChangeMallSubSort(DressMall.GoodsSubSort.SORT_SUB_CLOAK);
	RefreshMallList(mallList);
	RefreshMallPage();
	
	BtnMallGlass.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_yanjing_n");
	BtnMallGlass.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_yanjing_h");
	BtnMallHead.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_toubu_n");
	BtnMallHead.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_toubu_h");
	BtnMallRing.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_shipin_n");
	BtnMallRing.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_shipin_h");
	BtnMallShoes.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_jiaobu_n");
	BtnMallShoes.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_jiaobu_h");
	BtnMallCloak.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_beibu_h");
	BtnMallCloak.style.hover.background = null;
	BtnMallClothes.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_shenti_n");
	BtnMallClothes.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_shenti_h");	
}

private function CallbackMouseClickMallGlass(callback : iGUIElement) {
	var mallList : ArrayList = DressLogicCenter.GetInstance().ChangeMallSubSort(DressMall.GoodsSubSort.SORT_SUB_GLASS);
	RefreshMallList(mallList);
	RefreshMallPage();
	
	BtnMallGlass.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_yanjing_h");
	BtnMallGlass.style.hover.background = null;
	BtnMallHead.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_toubu_n");
	BtnMallHead.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_toubu_h");
	BtnMallRing.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_shipin_n");
	BtnMallRing.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_shipin_h");
	BtnMallShoes.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_jiaobu_n");
	BtnMallShoes.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_jiaobu_h");
	BtnMallCloak.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_beibu_n");
	BtnMallCloak.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_beibu_h");
	BtnMallClothes.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_shenti_n");
	BtnMallClothes.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_shenti_h");
}

private function CallbackMouseClickMallHead(callback : iGUIElement) {
	var mallList : ArrayList = DressLogicCenter.GetInstance().ChangeMallSubSort(DressMall.GoodsSubSort.SORT_SUB_HEAD);
	RefreshMallList(mallList);
	RefreshMallPage();
	
	BtnMallGlass.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_yanjing_n");
	BtnMallGlass.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_yanjing_h");
	BtnMallHead.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_toubu_h");
	BtnMallHead.style.hover.background = null;
	BtnMallRing.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_shipin_n");
	BtnMallRing.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_shipin_h");
	BtnMallShoes.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_jiaobu_n");
	BtnMallShoes.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_jiaobu_h");
	BtnMallCloak.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_beibu_n");
	BtnMallCloak.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_beibu_h");
	BtnMallClothes.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_shenti_n");
	BtnMallClothes.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_shenti_h");
}

private function CallbackMouseClickMallRing(callback : iGUIElement) {
	var mallList : ArrayList = DressLogicCenter.GetInstance().ChangeMallSubSort(DressMall.GoodsSubSort.SORT_SUB_RING);
	RefreshMallList(mallList);
	RefreshMallPage();
	
	BtnMallGlass.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_yanjing_n");
	BtnMallGlass.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_yanjing_h");
	BtnMallHead.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_toubu_n");
	BtnMallHead.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_toubu_h");
	BtnMallRing.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_shipin_h");
	BtnMallRing.style.hover.background = null;
	BtnMallShoes.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_jiaobu_n");
	BtnMallShoes.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_jiaobu_h");
	BtnMallCloak.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_beibu_n");
	BtnMallCloak.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_beibu_h");
	BtnMallClothes.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_shenti_n");
	BtnMallClothes.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_shenti_h");
}

private function CallbackMouseClickMallShoes(callback : iGUIElement) {
	var mallList : ArrayList = DressLogicCenter.GetInstance().ChangeMallSubSort(DressMall.GoodsSubSort.SORT_SUB_SHOES);
	RefreshMallList(mallList);
	RefreshMallPage();
	
	BtnMallGlass.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_yanjing_n");
	BtnMallGlass.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_yanjing_h");
	BtnMallHead.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_toubu_n");
	BtnMallHead.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_toubu_h");
	BtnMallRing.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_shipin_n");
	BtnMallRing.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_shipin_h");
	BtnMallShoes.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_jiaobu_h");
	BtnMallShoes.style.hover.background = null;
	BtnMallCloak.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_beibu_n");
	BtnMallCloak.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_beibu_h");
	BtnMallClothes.style.normal.background = Resources.Load("UISkins/Textures/chose_clother/btn_shenti_n");
	BtnMallClothes.style.hover.background = Resources.Load("UISkins/Textures/chose_clother/btn_shenti_h");
}

private function CallbackMouseClickMallDiamond(callback : iGUIElement) {
	DiamondLogic.GetInstance().OpenRecharge();
}

private function CallbackMouseClickMallSlot(callback : iGUIElement) {
	if(callback.userData != null) {
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_MALL_SLOT));
		DressLogicCenter.GetInstance().Equip((callback.userData as MallGoodsIcon).goods);
	}
}

private function CallbackMouseOverMallSlot(callback : iGUIElement) {
	if(callback.userData != null) {
		//ShowTip(callback,callback.userData.goods.item_id);
		ItemHint.ShowPackItemHint(callback, (callback.userData as MallGoodsIcon).goods);
	}
}

private function CallbackMouseClickLeftViewGirl(callback : iGUIElement) {
	DressLogicCenter.GetInstance().GirlViewLeft();
}

private function CallbackMouseClickResetGirl(callback : iGUIElement) {
	DressLogicCenter.GetInstance().ResetGirl();
}

private function CallbackMouseClickViewGirl(callback : iGUIElement) {
	DressLogicCenter.GetInstance().GirlViewRight();
}

private function CallbackMouseClickLeftView(callback : iGUIElement) {
	DressLogicCenter.GetInstance().BoyViewLeft();
}

private function CallbackMouseClickReset(callback : iGUIElement) {
	DressLogicCenter.GetInstance().ResetBoy();
}

private function CallbackMouseClickRightView(callback : iGUIElement) {
	DressLogicCenter.GetInstance().BoyViewRight();
}

private function CallbackMouseClickUpLeftViewGirl(callback : iGUIElement) {
	BClickDownLeftGirl = false;
}

private function CallbackMouseClickDownLeftViewGirl(callback : iGUIElement) {
	BClickDownLeftGirl = true;
}

private function CallbackMouseMouseOutLeftViewGirl(callback : iGUIElement) {
	BClickDownLeftGirl = false;
}

private function CallbackMouseClickUpViewGirl(callback : iGUIElement) {
	BClickDownRightGirl = false;
}

private function CallbackMouseClickDownViewGirl(callback : iGUIElement) {
	BClickDownRightGirl = true;
}

private function CallbackMouseMouseOutViewGirl(callback : iGUIElement) {
	BClickDownRightGirl = false;
}

private function CallbackMouseClickUpLeftView(callback : iGUIElement) {
	BClickDownLeft = false;
}

private function CallbackMouseClickDownLeftView(callback : iGUIElement) {
	BClickDownLeft = true;
}

private function CallbackMouseMouseOutLeftView(callback : iGUIElement) {
	BClickDownLeft = false;
}

private function CallbackMouseClickUpRightView(callback : iGUIElement) {
	BClickDownRight = false;
}

private function CallbackMouseClickDownRightView(callback : iGUIElement) {
	BClickDownRight = true;
}

private function CallbackMouseMouseOutRightView(callback : iGUIElement) {
	BClickDownRight = false;
}

private function CallbackMouseOverBody(callback : iGUIElement) {
	var info : EquipIcon = callback.userData as EquipIcon;
	
	if(info != null) {
		//ShowTip(callback,callback.userData.itemID);
		if(info.data != null)
		{
			if(info.data.instanceID != 0)		
			{
				var id64:UInt64 = info.data.instanceID;
				var grid : pack_grid = DressLogicCenter.GetInstance().GetBodyEquip(id64);
				if(grid != null)							//从身上来的物品
					ItemHint.ShowPackItemHint(callback, grid, false);
				else										//背包来的物品
				{	
					var pa : PackGrid = SelfItemLogic.getInstance().Package.getItemPack(info.data.instanceID);
					if(pa != null) {
						ItemHint.ShowPackItemHint(callback, pa, false);
					}
				}
			}
			else if(info.data.goodsID != 0)	//从商城来的物品
			{
				var id : int = info.data.goodsID;
				var row : ShopCenterRow = ResManager.LgtMgr.getShopCenterRow(id);
				ItemHint.ShowPackItemHint(callback, row);
			}
		}
	}
}

private function CallbackMouseClickBody(callback : iGUIElement) {
	if(callback.userData != null) {
		var info : EquipIcon = callback.userData as EquipIcon;
		
		DressLogicCenter.GetInstance().UnEquipBoy(info.data.itemID);
	}
}

private function CallbackMouseClickBodyGirl(callback : iGUIElement) {
	if(callback.userData != null) {
		var info : EquipIcon = callback.userData as EquipIcon;
		
		DressLogicCenter.GetInstance().UnEquipGirl(info.data.itemID);
	}
}

/*
private function CallbackCameraBGImage(image : Texture) {
	GameObject.Find("CameraDressBoy").GetComponent("Backdrop").image = image;
	GameObject.Find("CameraDressGirl").GetComponent("Backdrop").image = image;
}
*/

private function CallbackMouseClickCheckBuySure(callback : iGUIElement) {
	//Global.GetSysMsgHandler().ShowSysMsg(540,params);
	var type : int = money_type.mt_love_coin;
	if(mDBMoneyChoose == DBMoneyChoose.DBMONEY_CREDIT) {
		type = money_type.mt_point;
	} else if(mDBMoneyChoose == DBMoneyChoose.DBMONEY_COIN) {
		type = money_type.mt_love_coin;
	} else {
		Global.GetSysMsgHandler().ShowSysMsg(557);
		return ;
	}
	
	var list : ArrayList = DressLogicCenter.GetInstance().CheckMoneyChoose(type);
	if(list.Count > 0) {
		var str : String = "";
		for(var name : String in list) {
			str += name + ".";
		}
		LabCBTip.label.text = Define.getContent(5139, [str]);
	} else {
		DressLogicCenter.GetInstance().Save(type);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_CHECKBUY_SUREBTN));
	}
}

private function CallbackMouseClickCheckBuyCancel(callback : iGUIElement) {
	EnableCheckBuy(false);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_CHECKBUY_CANCELBTN));
}

private function CallbackMouseClickCheckBuyChoose1(callback : iGUIElement) {
	ImgCBChoose1.setEnabled(true);
	ImgCBChoose2.setEnabled(false);
	mDBMoneyChoose = DBMoneyChoose.DBMONEY_CREDIT;
	
	LabCBCost.label.text = Define.getContent(5140, [DressLogicCenter.GetInstance().GetCostCredit().ToString()]);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_CHECKBUY_CHOOSE1));
}

private function CallbackMouseClickCheckBuyChoose2(callback : iGUIElement) {
	ImgCBChoose1.setEnabled(false);
	ImgCBChoose2.setEnabled(true);
	mDBMoneyChoose = DBMoneyChoose.DBMONEY_COIN;
	
	LabCBCost.label.text = Define.getContent(5141, [DressLogicCenter.GetInstance().GetCostRMB().ToString()]);
}
//--
private function BtnGoodsWillCallback(caller : iGUIElement){
	var parent : iGUIElement = caller.getTargetContainer();
	var itm : iGUIElement = parent.items[3];
	if(!itm)
		throw "itm is null...";
	 
	if(itm.userData){
		var _goods_id : UInt64 = (itm.userData as MallGoodsIcon).goods.goods_id;
		var price : int = (itm.userData as MallGoodsIcon).goods.price;
		WishListComp.ReqAddWish(_goods_id, 1);
	}
}

private static var instance : iGUICode_DressUI;
function Awake(){
	instance=this;

	RegistEventMsg();
}
static function getInstance(){
	return instance;
}
@HideInInspector
var LabCBCost : iGUILabel;
@HideInInspector
var LabCBTip : iGUILabel;
@HideInInspector
var BtnCBChoose2 : iGUIButton;
@HideInInspector
var BtnCBChoose1 : iGUIButton;
@HideInInspector
var ImgCBChoose2 : iGUIImage;
@HideInInspector
var ImgCBChoose1 : iGUIImage;
@HideInInspector
var LabCBMoney2 : iGUILabel;
@HideInInspector
var LabCBMoney1 : iGUILabel;
@HideInInspector
var BtnCBSure : iGUIButton;
@HideInInspector
var BtnCBCancel : iGUIButton;
@HideInInspector
var PanCheckBuy : iGUIPanel;

@HideInInspector
var BtnMallCloak : iGUIButton;
@HideInInspector
var BtnMallGlass : iGUIButton;
@HideInInspector
var BtnMallHead : iGUIButton;
@HideInInspector
var BtnMallRing : iGUIButton;
@HideInInspector
var BtnMallShoes : iGUIButton;
@HideInInspector
var BtnMallClothes : iGUIButton;
@HideInInspector
var BtnMallDiamond : iGUIButton;
@HideInInspector
var MImgSlotLvValid1 : iGUIImage;
@HideInInspector
var MImgSlotLvValid2 : iGUIImage;
@HideInInspector
var MImgSlotLvValid3 : iGUIImage;
@HideInInspector
var MImgSlotLvValid4 : iGUIImage;
@HideInInspector
var MImgSlotLvValid5 : iGUIImage;
@HideInInspector
var MImgSlotLvValid6 : iGUIImage;
@HideInInspector
var MImgSlotLvValid7 : iGUIImage;
@HideInInspector
var MImgSlotLvValid8 : iGUIImage;
@HideInInspector
var MImgSlotLvValid9 : iGUIImage;

@HideInInspector
var ImgBodyLvValid1 : iGUIImage;
@HideInInspector
var ImgBodyLvValid2 : iGUIImage;
@HideInInspector
var ImgBodyLvValid3 : iGUIImage;
@HideInInspector
var ImgBodyLvValid4 : iGUIImage;
@HideInInspector
var ImgBodyLvValid5 : iGUIImage;
@HideInInspector
var ImgBodyLvValid6 : iGUIImage;
@HideInInspector
var ImgBodyLvValid1Girl : iGUIImage;
@HideInInspector
var ImgBodyLvValid2Girl : iGUIImage;
@HideInInspector
var ImgBodyLvValid3Girl : iGUIImage;
@HideInInspector
var ImgBodyLvValid4Girl : iGUIImage;
@HideInInspector
var ImgBodyLvValid5Girl : iGUIImage;
@HideInInspector
var ImgBodyLvValid6Girl : iGUIImage;

@HideInInspector
var ImgSlotValid1 : iGUIImage;
@HideInInspector
var ImgSlotValid2 : iGUIImage;
@HideInInspector
var ImgSlotValid3 : iGUIImage;
@HideInInspector
var ImgSlotValid4 : iGUIImage;
@HideInInspector
var ImgSlotValid5 : iGUIImage;
@HideInInspector
var ImgSlotValid6 : iGUIImage;
@HideInInspector
var ImgSlotValid7 : iGUIImage;
@HideInInspector
var ImgSlotValid8 : iGUIImage;
@HideInInspector
var ImgSlotValid9 : iGUIImage;
@HideInInspector
var ImgSlotValid10 : iGUIImage;
@HideInInspector
var ImgSlotValid11 : iGUIImage;

@HideInInspector
var ImgBodyValid1 : iGUIImage;
@HideInInspector
var ImgBodyValid2 : iGUIImage;
@HideInInspector
var ImgBodyValid3 : iGUIImage;
@HideInInspector
var ImgBodyValid4 : iGUIImage;
@HideInInspector
var ImgBodyValid5 : iGUIImage;
@HideInInspector
var ImgBodyValid6 : iGUIImage;
@HideInInspector
var ImgBodyValid1Girl : iGUIImage;
@HideInInspector
var ImgBodyValid2Girl : iGUIImage;
@HideInInspector
var ImgBodyValid3Girl : iGUIImage;
@HideInInspector
var ImgBodyValid4Girl : iGUIImage;
@HideInInspector
var ImgBodyValid5Girl : iGUIImage;
@HideInInspector
var ImgBodyValid6Girl : iGUIImage;

@HideInInspector
var ImgNewSelect : iGUIImage;
@HideInInspector
var ImgFemaleSelect : iGUIImage;
@HideInInspector
var ImgMaleSelect : iGUIImage;

@HideInInspector
var ImgBoyNotice : iGUIImage;
@HideInInspector
var ImgGirlNotice : iGUIImage;

@HideInInspector
var ImgBodyPreview1 : iGUIImage;
@HideInInspector
var ImgBodyPreview2 : iGUIImage;
@HideInInspector
var ImgBodyPreview3 : iGUIImage;
@HideInInspector
var ImgBodyPreview4 : iGUIImage;
@HideInInspector
var ImgBodyPreview5 : iGUIImage;
@HideInInspector
var ImgBodyPreview6 : iGUIImage;
@HideInInspector
var ImgBodyPreview1Girl : iGUIImage;
@HideInInspector
var ImgBodyPreview2Girl : iGUIImage;
@HideInInspector
var ImgBodyPreview3Girl : iGUIImage;
@HideInInspector
var ImgBodyPreview4Girl : iGUIImage;
@HideInInspector
var ImgBodyPreview5Girl : iGUIImage;
@HideInInspector
var ImgBodyPreview6Girl : iGUIImage;

@HideInInspector
var ImgGirlAvatar : iGUIImage;
@HideInInspector
var ImgBoyAvatar : iGUIImage;

@HideInInspector
var Currency16 : iGUIImage;
@HideInInspector
var ImgGoodsBG16 : iGUIImage;
@HideInInspector
var LabGoodsNum16 : iGUILabel;
@HideInInspector
var BtnGoodsWill16 : iGUIButton;
@HideInInspector
var LabGoods16 : iGUILabel;
@HideInInspector
var ImgGoods16 : iGUIImage;
@HideInInspector
var ConGoods16 : iGUIPanel;

@HideInInspector
var Currency15 : iGUIImage;
@HideInInspector
var ImgGoodsBG15 : iGUIImage;
@HideInInspector
var LabGoodsNum15 : iGUILabel;
@HideInInspector
var BtnGoodsWill15 : iGUIButton;
@HideInInspector
var LabGoods15 : iGUILabel;
@HideInInspector
var ImgGoods15 : iGUIImage;
@HideInInspector
var ConGoods15 : iGUIPanel;

@HideInInspector
var Currency14 : iGUIImage;
@HideInInspector
var ImgGoodsBG14 : iGUIImage;
@HideInInspector
var LabGoodsNum14 : iGUILabel;
@HideInInspector
var BtnGoodsWill14 : iGUIButton;
@HideInInspector
var LabGoods14 : iGUILabel;
@HideInInspector
var ImgGoods14 : iGUIImage;
@HideInInspector
var ConGoods14 : iGUIPanel;

@HideInInspector
var Currency13 : iGUIImage;
@HideInInspector
var ImgGoodsBG13 : iGUIImage;
@HideInInspector
var LabGoodsNum13 : iGUILabel;
@HideInInspector
var BtnGoodsWill13 : iGUIButton;
@HideInInspector
var LabGoods13 : iGUILabel;
@HideInInspector
var ImgGoods13 : iGUIImage;
@HideInInspector
var ConGoods13 : iGUIPanel;

@HideInInspector
var BtnPreview12 : iGUIButton;
@HideInInspector
var Currency12 : iGUIImage;
@HideInInspector
var ImgGoodsBG12 : iGUIImage;
@HideInInspector
var LabGoodsNum12 : iGUILabel;
@HideInInspector
var BtnGoodsWill12 : iGUIButton;
@HideInInspector
var LabGoods12 : iGUILabel;
@HideInInspector
var ImgGoods12 : iGUIImage;
@HideInInspector
var ConGoods12 : iGUIPanel;

@HideInInspector
var BtnPreview11 : iGUIButton;
@HideInInspector
var Currency11 : iGUIImage;
@HideInInspector
var ImgGoodsBG11 : iGUIImage;
@HideInInspector
var LabGoodsNum11 : iGUILabel;
@HideInInspector
var BtnGoodsWill11 : iGUIButton;
@HideInInspector
var LabGoods11 : iGUILabel;
@HideInInspector
var ImgGoods11 : iGUIImage;
@HideInInspector
var ConGoods11 : iGUIPanel;

@HideInInspector
var BtnPreview10 : iGUIButton;
@HideInInspector
var Currency10 : iGUIImage;
@HideInInspector
var ImgGoodsBG10 : iGUIImage;
@HideInInspector
var LabGoodsNum10 : iGUILabel;
@HideInInspector
var BtnGoodsWill10 : iGUIButton;
@HideInInspector
var LabGoods10 : iGUILabel;
@HideInInspector
var ImgGoods10 : iGUIImage;
@HideInInspector
var ConGoods10 : iGUIPanel;

@HideInInspector
var BtnPreview9 : iGUIButton;
@HideInInspector
var Currency9 : iGUIImage;
@HideInInspector
var ImgGoodsBG9 : iGUIImage;
@HideInInspector
var LabQQHomePrice9 : iGUILabel;
@HideInInspector
var LabGoodsNum9 : iGUILabel;
@HideInInspector
var BtnGoodsWill9 : iGUIButton;
@HideInInspector
var LabGoods9 : iGUILabel;
@HideInInspector
var ImgGoods9 : iGUIImage;
@HideInInspector
var ConGoods9 : iGUIPanel;

@HideInInspector
var BtnPreview8 : iGUIButton;
@HideInInspector
var Currency8 : iGUIImage;
@HideInInspector
var ImgGoodsBG8 : iGUIImage;
@HideInInspector
var LabQQHomePrice8 : iGUILabel;
@HideInInspector
var LabGoodsNum8 : iGUILabel;
@HideInInspector
var BtnGoodsWill8 : iGUIButton;
@HideInInspector
var LabGoods8 : iGUILabel;
@HideInInspector
var ImgGoods8 : iGUIImage;
@HideInInspector
var ConGoods8 : iGUIPanel;

@HideInInspector
var BtnPreview7 : iGUIButton;
@HideInInspector
var Currency7 : iGUIImage;
@HideInInspector
var ImgGoodsBG7 : iGUIImage;
@HideInInspector
var LabQQHomePrice7 : iGUILabel;
@HideInInspector
var LabGoodsNum7 : iGUILabel;
@HideInInspector
var BtnGoodsWill7 : iGUIButton;
@HideInInspector
var LabGoods7 : iGUILabel;
@HideInInspector
var ImgGoods7 : iGUIImage;
@HideInInspector
var ConGoods7 : iGUIPanel;

@HideInInspector
var BtnPreview6 : iGUIButton;
@HideInInspector
var Currency6 : iGUIImage;
@HideInInspector
var ImgGoodsBG6 : iGUIImage;
@HideInInspector
var LabQQHomePrice6 : iGUILabel;
@HideInInspector
var LabGoodsNum6 : iGUILabel;
@HideInInspector
var BtnGoodsWill6 : iGUIButton;
@HideInInspector
var LabGoods6 : iGUILabel;
@HideInInspector
var ImgGoods6 : iGUIImage;
@HideInInspector
var ConGoods6 : iGUIPanel;

@HideInInspector
var BtnPreview5 : iGUIButton;
@HideInInspector
var Currency5 : iGUIImage;
@HideInInspector
var ImgGoodsBG5 : iGUIImage;
@HideInInspector
var LabQQHomePrice5 : iGUILabel;
@HideInInspector
var LabGoodsNum5 : iGUILabel;
@HideInInspector
var BtnGoodsWill5 : iGUIButton;
@HideInInspector
var LabGoods5 : iGUILabel;
@HideInInspector
var ImgGoods5 : iGUIImage;
@HideInInspector
var ConGoods5 : iGUIPanel;

@HideInInspector
var BtnPreview4 : iGUIButton;
@HideInInspector
var Currency4 : iGUIImage;
@HideInInspector
var ImgGoodsBG4 : iGUIImage;
@HideInInspector
var LabQQHomePrice4 : iGUILabel;
@HideInInspector
var LabGoodsNum4 : iGUILabel;
@HideInInspector
var BtnGoodsWill4 : iGUIButton;
@HideInInspector
var LabGoods4 : iGUILabel;
@HideInInspector
var ImgGoods4 : iGUIImage;
@HideInInspector
var ConGoods4 : iGUIPanel;

@HideInInspector
var BtnPreview3 : iGUIButton;
@HideInInspector
var Currency3 : iGUIImage;
@HideInInspector
var ImgGoodsBG3 : iGUIImage;
@HideInInspector
var LabQQHomePrice3 : iGUILabel;
@HideInInspector
var LabGoodsNum3 : iGUILabel;
@HideInInspector
var BtnGoodsWill3 : iGUIButton;
@HideInInspector
var LabGoods3 : iGUILabel;
@HideInInspector
var ImgGoods3 : iGUIImage;
@HideInInspector
var ConGoods3 : iGUIPanel;

@HideInInspector
var BtnPreview2 : iGUIButton;
@HideInInspector
var Currency2 : iGUIImage;
@HideInInspector
var ImgGoodsBG2 : iGUIImage;
@HideInInspector
var LabQQHomePrice2 : iGUILabel;
@HideInInspector
var LabGoodsNum2 : iGUILabel;
@HideInInspector
var BtnGoodsWill2 : iGUIButton;
@HideInInspector
var LabGoods2 : iGUILabel;
@HideInInspector
var ImgGoods2 : iGUIImage;
@HideInInspector
var ConGoods2 : iGUIPanel;

@HideInInspector
var BtnPreview1 : iGUIButton;
@HideInInspector
var Currency1 : iGUIImage;
@HideInInspector
var ImgGoodsBG1 : iGUIImage;
@HideInInspector
var LabQQHomePrice1 : iGUILabel;
@HideInInspector
var LabGoodsNum1 : iGUILabel;
@HideInInspector
var BtnGoodsWill1 : iGUIButton;
@HideInInspector
var LabGoods1 : iGUILabel;
@HideInInspector
var ImgGoods1 : iGUIImage;
@HideInInspector
var ConGoods1 : iGUIPanel;

@HideInInspector
var PanGoods : iGUIPanel;
@HideInInspector
var LabMallPage : iGUILabel;
@HideInInspector
var BtnMallRight : iGUIButton;
@HideInInspector
var BtnMallLeft : iGUIButton;
@HideInInspector
var BtnMallFemale : iGUIButton;
@HideInInspector
var BtnMallMale : iGUIButton;
@HideInInspector
var BtnNew : iGUIButton;
@HideInInspector
var PanMall : iGUIPanel;
@HideInInspector
var ImgBody6Girl : iGUIImage;
@HideInInspector
var ImgBody5Girl : iGUIImage;
@HideInInspector
var ImgBody4Girl : iGUIImage;
@HideInInspector
var ImgBody3Girl : iGUIImage;
@HideInInspector
var ImgBody2Girl : iGUIImage;
@HideInInspector
var ImgBody1Girl : iGUIImage;
@HideInInspector
var BtnLeftViewGirl : iGUIButton;
@HideInInspector
var BtnRightViewGirl : iGUIButton;
@HideInInspector
var BtnResetGirl : iGUIButton;
@HideInInspector
var PanGirl : iGUIPanel;
@HideInInspector
var ImgBody6 : iGUIImage;
@HideInInspector
var ImgBody5 : iGUIImage;
@HideInInspector
var ImgBody4 : iGUIImage;
@HideInInspector
var ImgBody3 : iGUIImage;
@HideInInspector
var ImgBody2 : iGUIImage;
@HideInInspector
var ImgBody1 : iGUIImage;
@HideInInspector
var BtnLeftView : iGUIButton;
@HideInInspector
var BtnReset : iGUIButton;
@HideInInspector
var BtnRightView : iGUIButton;
@HideInInspector
var PanBoy : iGUIPanel;
@HideInInspector
var LabCredit : iGUILabel;
@HideInInspector
var LabRMB : iGUILabel;
@HideInInspector
var LabGold : iGUILabel;
@HideInInspector
var ConCost : iGUIContainer;
@HideInInspector
var LabSlotText11 : iGUILabel;
@HideInInspector
var ImgSlotGood11 : iGUIImage;
@HideInInspector
var ImgSlotBG11 : iGUIImage;
@HideInInspector
var LabSlotText10 : iGUILabel;
@HideInInspector
var ImgSlotGood10 : iGUIImage;
@HideInInspector
var ImgSlotBG10 : iGUIImage;
@HideInInspector
var LabSlotText9 : iGUILabel;
@HideInInspector
var ImgSlotGood9 : iGUIImage;
@HideInInspector
var ImgSlotBG9 : iGUIImage;
@HideInInspector
var LabSlotText8 : iGUILabel;
@HideInInspector
var ImgSlotGood8 : iGUIImage;
@HideInInspector
var ImgSlotBG8 : iGUIImage;
@HideInInspector
var LabSlotText7 : iGUILabel;
@HideInInspector
var ImgSlotGood7 : iGUIImage;
@HideInInspector
var ImgSlotBG7 : iGUIImage;
@HideInInspector
var LabSlotText6 : iGUILabel;
@HideInInspector
var ImgSlotGood6 : iGUIImage;
@HideInInspector
var ImgSlotBG6 : iGUIImage;
@HideInInspector
var LabSlotText5 : iGUILabel;
@HideInInspector
var ImgSlotGood5 : iGUIImage;
@HideInInspector
var ImgSlotBG5 : iGUIImage;
@HideInInspector
var LabSlotText4 : iGUILabel;
@HideInInspector
var ImgSlotGood4 : iGUIImage;
@HideInInspector
var ImgSlotBG4 : iGUIImage;
@HideInInspector
var LabSlotText3 : iGUILabel;
@HideInInspector
var ImgSlotGood3 : iGUIImage;
@HideInInspector
var ImgSlotBG3 : iGUIImage;
@HideInInspector
var LabSlotText2 : iGUILabel;
@HideInInspector
var ImgSlotGood2 : iGUIImage;
@HideInInspector
var ImgSlotBG2 : iGUIImage;
@HideInInspector
var LabSlotText1 : iGUILabel;
@HideInInspector
var ImgSlotGood1 : iGUIImage;
@HideInInspector
var ImgSlotBG1 : iGUIImage;
@HideInInspector
var ConSlot11 : iGUIContainer;
@HideInInspector
var ConSlot10 : iGUIContainer;
@HideInInspector
var ConSlot9 : iGUIContainer;
@HideInInspector
var ConSlot8 : iGUIContainer;
@HideInInspector
var ConSlot7 : iGUIContainer;
@HideInInspector
var ConSlot6 : iGUIContainer;
@HideInInspector
var ConSlot5 : iGUIContainer;
@HideInInspector
var ConSlot4 : iGUIContainer;
@HideInInspector
var ConSlot3 : iGUIContainer;
@HideInInspector
var ConSlot2 : iGUIContainer;
@HideInInspector
var ConSlot1 : iGUIContainer;
@HideInInspector
var BtnRightPage : iGUIButton;
@HideInInspector
var BtnLeftPage : iGUIButton;
@HideInInspector
var BtnRightOne : iGUIButton;
@HideInInspector
var BtnLeftOne : iGUIButton;
@HideInInspector
var ConDressList : iGUIContainer;
@HideInInspector
var BtnHuanzuan : iGUIButton;
@HideInInspector
var BtnSave : iGUIButton;
@HideInInspector
var BtnDressFemale : iGUIButton;
@HideInInspector
var BtnDressMale : iGUIButton;
@HideInInspector
var BtnQuit : iGUIButton;
@HideInInspector
var DressStorage : iGUIPanel;
@HideInInspector
var DressUI : iGUIRoot;