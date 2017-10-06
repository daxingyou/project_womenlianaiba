#pragma strict
#pragma downcast
import iGUI;

class ItemUpgradeIcon {
	public var id : int = 0;				// item id
	public var asynIcon : AsynIcon = null;	// asyn icon manager
	public var iconSlot : iGUIImage;		// icon slot ui
	
	public function CallbackIconLoad(tex : Texture) {
		iconSlot.image = tex;
	}
}

private var mInit : boolean = false;
private var mCurMultiIdx : iGUIElement = null;
private var mTimer : Timer = null;				//event Timer
private var mRemainTime : int = 5;				//remain time(second)

function Start() {
	Init();
}

private function Init() {
	BtnSure.clickCallback = CallbackMouseClickTimeDelay;
	BtnCancel.clickCallback = CallbackMouseClickTimeCancel;
	BtnBuy.clickCallback = CallbackMouseClickPropBuy;
	
	BtnUpSure.clickCallback = CallbackMouseClickUpgradeSure;
	BtnUpCancel.clickCallback = CallbackMouseClickUpgradeCancel;
	BtnUpBuy1.clickCallback = CallbackMouseClickPropBuy;
	BtnUpBuy2.clickCallback = CallbackMouseClickPropBuy;
	BtnUpBuy3.clickCallback = CallbackMouseClickPropBuy;
	BtnUpBuy4.clickCallback = CallbackMouseClickPropBuy;
	ImgProp.mouseOverCallback = CallbackMouseOverProp;
	ImgUpProp1.mouseOverCallback = CallbackMouseOverProp;
	ImgUpProp2.mouseOverCallback = CallbackMouseOverProp;
	ImgUpProp3.mouseOverCallback = CallbackMouseOverProp;
	ImgUpProp4.mouseOverCallback = CallbackMouseOverProp;
	ImgUpOld.mouseOverCallback = CallbackMouseOverItem;
	ImgUpNew.mouseOverCallback = CallbackMouseOverProp;
	
	BtnMultiSure.clickCallback = CallbackMouseClickMultiSure;
	BtnMultiCancel.clickCallback = CallbackMouseClickMultiCancel;
	BtnMultiClose.clickCallback = CallbackMouseClickMultiCancel;
	BtnPrePage.clickCallback = CallbackMouseClickMultiPrePage;
	BtnNextPage.clickCallback = CallbackMouseClickMultiNextPage;
	BtnUpStop.clickCallback = CallbackMouseClickMultiStop;
	ImgSlot1.mouseOverCallback = CallbackMouseOverItem;
	ImgSlot2.mouseOverCallback = CallbackMouseOverItem;
	ImgSlot3.mouseOverCallback = CallbackMouseOverItem;
	ImgSlot4.mouseOverCallback = CallbackMouseOverItem;
	ImgSlot5.mouseOverCallback = CallbackMouseOverItem;
	ImgSlot6.mouseOverCallback = CallbackMouseOverItem;
	ImgSlot7.mouseOverCallback = CallbackMouseOverItem;
	ImgSlot8.mouseOverCallback = CallbackMouseOverItem;
	ImgSlot9.mouseOverCallback = CallbackMouseOverItem;
	
	mInit = true;
}

private function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEM_TIME_DELAY_UI), HandleNotifyEnableTime);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEM_UPGRADE_UI), HandleNotifyEnableUpgrade);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEM_TIME_REFRESH), HandleNotifyTimeLimitRefresh);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEM_UPGRADE_REFRESH), HandleNotifyUpgradeRefresh);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEM_UPGRADE_MULTI_UI), HandleNotifyUpgradeMultiEnable);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEM_UPGRADE_LIST_REFRESH_UI), HandleNotifyUpgradeMultiRefresh);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEM_UPGRADE_TIMECOUNT_UI), HandleNotifyUpgradeMultiTime);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEM_UPGRADE_STOP_UI), HandleNotifyMultiStop);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEM_UPGRADE_FREE_UI), HandleNotifyUpgradeUpFree);
}

//handle event msg
private function HandleNotifyEnableTime(evt:GameEvent, obj:System.Object) {
	EnableTime(obj);
}

private function HandleNotifyEnableUpgrade(evt:GameEvent, obj:System.Object) {
	EnableUpgrade(obj);
}

private function HandleNotifyTimeLimitRefresh(evt:GameEvent, obj:System.Object) {
	var info : ItemDelayInfo = obj as ItemDelayInfo;
	RefreshTimeDelay(info);
}

private function HandleNotifyUpgradeRefresh(evt:GameEvent, obj:System.Object) {
	var info : ItemUpgradeInfo = obj as ItemUpgradeInfo;
	RefreshUpgrade(info);
}

private function HandleNotifyUpgradeMultiEnable(evt:GameEvent, obj:System.Object) {
	EnableUpgradeMulti(obj);
}

private function HandleNotifyUpgradeMultiRefresh(evt:GameEvent, obj:System.Object) {
	var list : ArrayList = ItemUpgradeLogic.GetInstance().GetPageData(1);
	RefreshUpgradeMulti(list);
}

private function HandleNotifyUpgradeMultiTime(evt:GameEvent, obj:System.Object) {
	RefreshMultiTimeCount();
}

private function HandleNotifyMultiStop(evt:GameEvent, obj:System.Object) {
	CallbackTimerStop();
	BtnMultiSure.passive = false;
	BtnUpBuy1.passive = false;
	BtnUpBuy2.passive = false;
	BtnUpBuy3.passive = false;
	BtnUpBuy4.passive = false;
}

private function HandleNotifyUpgradeUpFree(evt:GameEvent, obj:System.Object) {
	BtnUpSure.passive = false;
}

//function
function EnableTime(enable : boolean) {
	if(enable && !mInit) {
		Init();
	}
	
	PanTimeLimit.setEnabled(enable);
	UI.getUI().SetModal("ItemUpgradeUI", enable);
}

function EnableUpgrade(enable : boolean) {
	if(enable && !mInit) {
		Init();
	}
	
	if(enable) {
		//BtnUpCancel.setEnabled(true);
		BtnUpSure.setEnabled(true);
		BtnUpStop.setEnabled(false);
		LabTimeCount.setEnabled(false);
		BtnUpSure.passive = false;
	}
	
	PanUpgrade.setEnabled(enable);
	PanUpgradeList.setEnabled(false);
	UI.getUI().SetModal("ItemUpgradeUI", enable);
}

function EnableUpgradeMulti(enable : boolean) {
	if(enable && !mInit) {
		Init();
	}
	
	if(!enable) {
		ItemUpgradeLogic.GetInstance().StopMultiUpgrade();
	} else {
		//BtnUpCancel.setEnabled(false);
		BtnUpSure.setEnabled(false);
		BtnUpStop.setEnabled(true);
		LabTimeCount.setEnabled(true);
		
		LabTimeCount.label.text = "";
	}
	
	PanUpgrade.setEnabled(enable);
	PanUpgradeList.setEnabled(enable);
	UI.getUI().SetModal("ItemUpgradeUI", enable);
}

function RefreshTimeDelay(info : ItemDelayInfo) {
	if(info == null || info.ins == null) return ;
	
	LabItemName.label.text = info.ins._itemInfo.name;
	LabOldTime.label.text = TimeEffect.getInstance().getEffectTimeStr(info.ins);
	
	var icon : ItemUpgradeIcon = new ItemUpgradeIcon();
	icon.id = info.ins._itemInfo.id;
	icon.iconSlot = ImgOldItem;
	icon.asynIcon =  new AsynIcon(icon.CallbackIconLoad, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	icon.asynIcon.load("Icon/" + info.ins._itemInfo.icon);
	
	var icon1 : ItemUpgradeIcon = new ItemUpgradeIcon();
	icon1.id = info.ins._itemInfo.id;
	icon1.iconSlot = ImgNewItem;
	icon1.asynIcon =  new AsynIcon(icon1.CallbackIconLoad, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	icon1.asynIcon.load("Icon/" + info.ins._itemInfo.icon);
	
	SetProp(ImgProp,LabPropNum,BtnBuy,info.prop);
}

function RefreshUpgrade(info : ItemUpgradeInfo) {
	ClearUpgrade();
	
	LabUpItemName.label.text = info.oldIns._itemInfo.name;
	
	var icon : ItemUpgradeIcon = new ItemUpgradeIcon();
	icon.id = info.oldIns._itemInfo.id;
	icon.iconSlot = ImgUpOld;
	icon.asynIcon =  new AsynIcon(icon.CallbackIconLoad, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	icon.asynIcon.load("Icon/" + info.oldIns._itemInfo.icon);
	ImgUpOld.userData = info.oldIns;
	
	var icon1 : ItemUpgradeIcon = new ItemUpgradeIcon();
	icon1.id = info.newIns.id;
	icon1.iconSlot = ImgUpNew;
	icon1.asynIcon =  new AsynIcon(icon1.CallbackIconLoad, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	icon1.asynIcon.load("Icon/" + info.newIns.icon);
	ImgUpNew.userData = info.newIns;
	
	LabUpOldLevel.label.text =info.oldIns._itemInfo.level.ToString();
	LabUpNewLevel.label.text =info.oldIns._itemInfo.level.ToString()+"　→　"+info.newIns.level.ToString();
	LabUpLevelAdd.label.text = "+"+(info.newIns.level-info.oldIns._itemInfo.level).ToString();
	LabUpOldNeedLv.label.text = Define.needlevel+"："+info.oldIns._itemInfo.use_level.ToString();
	LabUpNewNeedLv.label.text = Define.needlevel+"："+info.newIns.use_level.ToString();
	LabUpNeedLvAdd.label.text = "+"+(info.newIns.use_level-info.oldIns._itemInfo.use_level).ToString();
	
	var proOld : int = Property.getInstance().getProperty(info.oldIns);
	if(info.oldIns._itemInfo.type == ItemType.Furniture) {
		LabUpNewValuetxt.label.text = Define.luxury+"：";
		LabUpOldValue.label.text = Define.luxury+"："+proOld.ToString();
		LabUpNewValue.label.text = proOld.ToString()+"　→　"+(proOld+info.proValue).ToString();
	} else {
		LabUpNewValuetxt.label.text = Define.charm+"：";
		LabUpOldValue.label.text = Define.charm+"："+proOld.ToString();
		LabUpNewValue.label.text = proOld.ToString()+"　→　"+(proOld+info.proValue).ToString();
	}
	LabUpValueAdd.label.text = "+"+info.proValue.ToString();
	
	/*
	for(var idx=0; idx<info.propList.Count; idx++) {
		if(idx == 0) {
			ImgUpProp1.setEnabled(true);
			LabUpPropNum1.setEnabled(true);
			BtnUpBuy1.setEnabled(true);
			SetProp(ImgUpProp1,LabUpPropNum1,BtnUpBuy1,info.propList[idx]);
		} else if(idx == 1) {
			ImgUpProp2.setEnabled(true);
			LabUpPropNum2.setEnabled(true);
			BtnUpBuy2.setEnabled(true);
			SetProp(ImgUpProp2,LabUpPropNum2,BtnUpBuy2,info.propList[idx]);
		} else if(idx == 2) {
			ImgUpProp3.setEnabled(true);
			LabUpPropNum3.setEnabled(true);
			BtnUpBuy3.setEnabled(true);
			SetProp(ImgUpProp3,LabUpPropNum3,BtnUpBuy3,info.propList[idx]);
		} else if(idx == 3) {
			ImgUpProp4.setEnabled(true);
			LabUpPropNum4.setEnabled(true);
			BtnUpBuy4.setEnabled(true);
			SetProp(ImgUpProp4,LabUpPropNum4,BtnUpBuy4,info.propList[idx]);
		}
	}
	*/
	
	ImgUpProp3.setEnabled(true);
	LabUpPropNum3.setEnabled(true);
	BtnUpBuy3.setEnabled(false);
	LabUpPropNum3.label.text = info.diamond.ToString()/* + "/" + SelfItemLogic.getInstance()._loverDiamond.ToString()*/;
	
	ClearStrangeStatus();
}

function RefreshUpgradeMulti(list : ArrayList) {
	if(list == null) return ;
	
	ClearSlot();
	for(var i=0; i<list.Count; i++) {
		var it : Item = list[i] as Item;
		if(i==0) {
			SetListSlot(ImgSlot1, it);
		} else if(i==1) {
			SetListSlot(ImgSlot2, it);
		} else if(i==2) {
			SetListSlot(ImgSlot3, it);
		} else if(i==3) {
			SetListSlot(ImgSlot4, it);
		} else if(i==4) {
			SetListSlot(ImgSlot5, it);
		} else if(i==5) {
			SetListSlot(ImgSlot6, it);
		} else if(i==6) {
			SetListSlot(ImgSlot7, it);
		} else if(i==7) {
			SetListSlot(ImgSlot8, it);
		} else if(i==8) {
			SetListSlot(ImgSlot9, it);
		} else if(i==9) {
			SetListSlot(ImgSlot10, it);
		} else if(i==10) {
			SetListSlot(ImgSlot11, it);
		} else if(i==11) {
			SetListSlot(ImgSlot12, it);
		} else {
			continue;
		}
	}
	
	RefreshUpgradePage();
}

function RefreshUpgradePage() {
	var curPage : int = ItemUpgradeLogic.GetInstance().GetCurrPageNum();
	var totalPage : int = ItemUpgradeLogic.GetInstance().GetTotalPageNum();
	if(totalPage == 0) totalPage = 1;
	if(curPage == 0) curPage = 1;
	LabPageNum.label.text = curPage.ToString()+"/"+totalPage.ToString();
	if(curPage == 1) {
		BtnPrePage.passive = true;
	} else {
		BtnPrePage.passive = false;
	}
	if(curPage >= totalPage) {
		BtnNextPage.passive = true;
	} else {
		BtnNextPage.passive = false;
	}
}

function RefreshMultiTimeCount() {
	StartTimer();
}

private function StartTimer() {
	if(mTimer != null) {
		mTimer.Reset();
		mTimer = null;
	}
	mTimer = new Timer(1000.0f,mRemainTime);
	mTimer.addEventListener(TimerEvent.TIMER,CallbackTimerTrigger);
	mTimer.addEventListener(TimerEvent.TIMER_COMPLETE,CallbackTimerStop);
	mTimer.Start();
}

function ClearUpgrade() {
	ImgUpProp1.setEnabled(false);
	ImgUpProp2.setEnabled(false);
	ImgUpProp3.setEnabled(false);
	ImgUpProp4.setEnabled(false);
	
	LabUpPropNum1.setEnabled(false);
	LabUpPropNum2.setEnabled(false);
	LabUpPropNum3.setEnabled(false);
	LabUpPropNum4.setEnabled(false);
	
	BtnUpBuy1.setEnabled(false);
	BtnUpBuy2.setEnabled(false);
	BtnUpBuy3.setEnabled(false);
	BtnUpBuy4.setEnabled(false);
}

function ClearSlot() {
	ImgSlot1.image = null;
	ImgSlot1.userData = null;
	ImgSlot2.image = null;
	ImgSlot2.userData = null;
	ImgSlot3.image = null;
	ImgSlot3.userData = null;
	ImgSlot4.image = null;
	ImgSlot4.userData = null;
	ImgSlot5.image = null;
	ImgSlot5.userData = null;
	ImgSlot6.image = null;
	ImgSlot6.userData = null;
	ImgSlot7.image = null;
	ImgSlot7.userData = null;
	ImgSlot8.image = null;
	ImgSlot8.userData = null;
	ImgSlot9.image = null;
	ImgSlot9.userData = null;
	ImgSlot10.image = null;
	ImgSlot10.userData = null;
	ImgSlot11.image = null;
	ImgSlot11.userData = null;
	ImgSlot12.image = null;
	ImgSlot12.userData = null;
}

function ClearStrangeStatus() {
	iGUICode_StorageBoxUI.getInstance().cip_delay_btn.label.text = "";
	iGUICode_StorageBoxUI.getInstance().cip_upgrade_btn.label.text = "";
	iGUICode_StorageBoxUI.getInstance().cip_use_btn.label.text = "";
	iGUICode_StorageBoxUI.getInstance().cip_recovr_btn.label.text = "";
}

function SetProp(img : iGUIImage, count : iGUILabel, buy : iGUIButton, info : UpgradePropInfo) {
	if(info == null) return ;
	var row : ItemRow = ResManager.LgtMgr.getItemRow(info.propId);
	img.userData = row;
	
	var icon : ItemUpgradeIcon = new ItemUpgradeIcon();
	icon.id = info.propId;
	icon.iconSlot = img;
	icon.asynIcon =  new AsynIcon(icon.CallbackIconLoad, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	icon.asynIcon.load("Icon/" + row.icon);
	
	if(info.propNeedNum > info.propNum) {
		count.labelColor = Color.red;
	} else {
		count.labelColor = Color.white;
	}
	count.label.text = info.propNum.ToString() + "/" + info.propNeedNum.ToString();
	
	buy.userData = info.propGoodsID;
}

function SetListSlot(img : iGUIImage, it : Item) {
	if(it == null || it._itemInfo == null) return ;
	
	img.userData = it;
	
	var icon : ItemUpgradeIcon = new ItemUpgradeIcon();
	icon.id = it._itemInfo.id;
	icon.iconSlot = img;
	icon.asynIcon =  new AsynIcon(icon.CallbackIconLoad, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	icon.asynIcon.load("Icon/" + it._itemInfo.icon);
}

//callback
private function CallbackMouseClickTimeDelay(callback : iGUIElement) {
	ItemUpgradeLogic.GetInstance().CheckDelay();
}

private function CallbackMouseClickTimeCancel(callback : iGUIElement) {
	EnableTime(false);
}

private function CallbackMouseClickPropBuy(callback : iGUIElement) {
	EnableTime(false);
	EnableUpgrade(false);
	
	PropBuyCommonLogic.getInstance().openPropBuyCommonUI(callback.userData);
}

private function CallbackMouseOverProp(callback : iGUIElement) {
	if(callback.userData != null) {
		ItemHint.ShowPackItemHint(callback, callback.userData as ItemRow, false);
	}
}

private function CallbackMouseOverItem(callback : iGUIElement) {
	if(callback.userData != null) {
		ItemHint.ShowPackItemHint(callback, callback.userData as Item, false);
	}
}

private function CallbackMouseClickUpgradeSure(callback : iGUIElement) {
	ItemUpgradeLogic.GetInstance().CheckUpgrade();
	
	BtnUpSure.passive = true;
}

private function CallbackMouseClickUpgradeCancel(callback : iGUIElement) {
	EnableUpgrade(false);
}

private function CallbackMouseClickMultiSure(callback : iGUIElement) {
	ItemUpgradeLogic.GetInstance().CheckMultiUpgrade();
	
	BtnMultiSure.passive = true;
	BtnUpBuy1.passive = true;
	BtnUpBuy2.passive = true;
	BtnUpBuy3.passive = true;
	BtnUpBuy4.passive = true;
}

private function CallbackMouseClickMultiCancel(callback : iGUIElement) {
	EnableUpgradeMulti(false);
}

private function CallbackMouseClickMultiPrePage(callback : iGUIElement) {
	var list : ArrayList = ItemUpgradeLogic.GetInstance().GetPrePage();
	RefreshUpgradeMulti(list);
}

private function CallbackMouseClickMultiNextPage(callback : iGUIElement) {
	var list : ArrayList = ItemUpgradeLogic.GetInstance().GetNextPage();
	RefreshUpgradeMulti(list);
}

private function CallbackMouseClickMultiStop(callback : iGUIElement) {
	ItemUpgradeLogic.GetInstance().StopMultiUpgrade();
}

private function CallbackTimerTrigger() {
	mRemainTime--;
	LabTimeCount.label.text = Define.getContent(5154, [mRemainTime.ToString()]);
}

private function CallbackTimerStop() {
	if(mTimer != null) {
		mTimer.Reset();
		mTimer = null;
	}
	
	LabTimeCount.label.text = "";
	mRemainTime = 5;
}

private static var instance : iGUICode_ItemUpgradeUI;
function Awake(){
	instance=this;
	
	RegistEventMsg();
}
static function getInstance(){
	return instance;
}
@HideInInspector
var LabTimeCount : iGUILabel;
@HideInInspector
var BtnUpStop : iGUIButton;
@HideInInspector
var ImgSlot12 : iGUIImage;
@HideInInspector
var ImgSlot11 : iGUIImage;
@HideInInspector
var ImgSlot10 : iGUIImage;
@HideInInspector
var ImgSlot9 : iGUIImage;
@HideInInspector
var ImgSlot8 : iGUIImage;
@HideInInspector
var ImgSlot7 : iGUIImage;
@HideInInspector
var ImgSlot6 : iGUIImage;
@HideInInspector
var ImgSlot5 : iGUIImage;
@HideInInspector
var ImgSlot4 : iGUIImage;
@HideInInspector
var ImgSlot3 : iGUIImage;
@HideInInspector
var ImgSlot2 : iGUIImage;
@HideInInspector
var ImgSlot1 : iGUIImage;
@HideInInspector
var LabPageNum : iGUILabel;
@HideInInspector
var BtnNextPage : iGUIButton;
@HideInInspector
var BtnPrePage : iGUIButton;
@HideInInspector
var BtnMultiClose : iGUIButton;
@HideInInspector
var BtnMultiCancel : iGUIButton;
@HideInInspector
var BtnMultiSure : iGUIButton;
@HideInInspector
var PanUpgradeList : iGUIPanel;
@HideInInspector
var LabUpNewValuetxt : iGUILabel;
@HideInInspector
var LabUpLevelAdd : iGUILabel;
@HideInInspector
var LabUpNeedLvAdd : iGUILabel;
@HideInInspector
var LabUpValueAdd : iGUILabel;
@HideInInspector
var LabUpPropNum4 : iGUILabel;
@HideInInspector
var LabUpPropNum3 : iGUILabel;
@HideInInspector
var LabUpPropNum2 : iGUILabel;
@HideInInspector
var LabUpPropNum1 : iGUILabel;
@HideInInspector
var LabUpOldValue : iGUILabel;
@HideInInspector
var LabUpOldNeedLv : iGUILabel;
@HideInInspector
var LabUpOldLevel : iGUILabel;
@HideInInspector
var LabUpNewValue : iGUILabel;
@HideInInspector
var LabUpNewNeedLv : iGUILabel;
@HideInInspector
var LabUpNewLevel : iGUILabel;
@HideInInspector
var LabUpItemName : iGUILabel;
@HideInInspector
var ImgUpProp4 : iGUIImage;
@HideInInspector
var ImgUpProp3 : iGUIImage;
@HideInInspector
var ImgUpProp2 : iGUIImage;
@HideInInspector
var ImgUpProp1 : iGUIImage;
@HideInInspector
var ImgUpOld : iGUIImage;
@HideInInspector
var ImgUpNew : iGUIImage;
@HideInInspector
var BtnUpBuy1 : iGUIButton;
@HideInInspector
var BtnUpBuy2 : iGUIButton;
@HideInInspector
var BtnUpBuy3 : iGUIButton;
@HideInInspector
var BtnUpBuy4 : iGUIButton;
@HideInInspector
var BtnUpCancel : iGUIButton;
@HideInInspector
var BtnUpSure : iGUIButton;
@HideInInspector
var PanUpgrade : iGUIPanel;
@HideInInspector
var LabOldTime : iGUILabel;
@HideInInspector
var LabPropNum : iGUILabel;
@HideInInspector
var BtnBuy : iGUIButton;
@HideInInspector
var BtnCancel : iGUIButton;
@HideInInspector
var BtnSure : iGUIButton;
@HideInInspector
var ImgProp : iGUIImage;
@HideInInspector
var ImgNewItem : iGUIImage;
@HideInInspector
var ImgOldItem : iGUIImage;
@HideInInspector
var LabItemName : iGUILabel;
@HideInInspector
var PanTimeLimit : iGUIPanel;
@HideInInspector
var root1 : iGUIRoot;
