#pragma strict
#pragma downcast
import iGUI;

class PlantIcon {
	public var id : int = 0;				// plant id
	public var asynIcon : AsynIcon = null;	// asyn icon manager
	public var iconSlot : iGUIImage;		// icon slot ui
	
	public function CallbackIconLoad(tex : Texture) {
		iconSlot.image = tex;
	}
}

private var bgAsynIcon : AsynIcon = null;

function Start() {
	BtnBClose.clickCallback = CallbackMouseClickClose;
	BtnClose.clickCallback = CallbackMouseClickMainClose;
	BtnPrePage.clickCallback = CallbackMouseClickPrePage;
	BtnNextPage.clickCallback = CallbackMouseClickNextPage;
	BtnFirstPage.clickCallback = CallbackMouseClickFirstPage;
	BtnLabel1.clickCallback = CallbackMouseClickLabel1;
	BtnLabel2.clickCallback = CallbackMouseClickLabel2;
	BtnLabel3.clickCallback = CallbackMouseClickLabel3;
	
	BtnGrow1.clickCallback = CallbackMouseClickGrow;
	BtnSGrow1.clickCallback = CallbackMouseClickSGrow;
	BtnGrow2.clickCallback = CallbackMouseClickGrow;
	BtnSGrow2.clickCallback = CallbackMouseClickSGrow;
	BtnGrow3.clickCallback = CallbackMouseClickGrow;
	BtnSGrow3.clickCallback = CallbackMouseClickSGrow;
	BtnGrow4.clickCallback = CallbackMouseClickGrow;
	BtnSGrow4.clickCallback = CallbackMouseClickSGrow;
	BtnGrow5.clickCallback = CallbackMouseClickGrow;
	BtnSGrow5.clickCallback = CallbackMouseClickSGrow;
	BtnGrow6.clickCallback = CallbackMouseClickGrow;
	BtnSGrow6.clickCallback = CallbackMouseClickSGrow;
	
	BtnLClose.clickCallback = CallbackMouseClickLockClose;
	BtnUnlock.clickCallback = CallbackMouseClickUnLock;
	BtnTotalBuy.clickCallback = CallbackMouseClickTotalBuy;
	BtnLBuy1.clickCallback = CallbackMouseClickLockBuy;
	BtnLBuy2.clickCallback = CallbackMouseClickLockBuy;
	BtnLBuy3.clickCallback = CallbackMouseClickLockBuy;
	BtnLBuy4.clickCallback = CallbackMouseClickLockBuy;
	
	ImgLIcon1.mouseOverCallback = CallbackMouseOverMat;
	ImgLIcon2.mouseOverCallback = CallbackMouseOverMat;
	ImgLIcon3.mouseOverCallback = CallbackMouseOverMat;
	ImgLIcon4.mouseOverCallback = CallbackMouseOverMat;
	
	bgAsynIcon =  new AsynIcon(CallbackBGIcon, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	bgAsynIcon.load("UI/plant_manual.png.u3d");
}

private function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLANT_MAIN_UI), HandleNotifyEnableMain);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLANT_MAIN_REFRESH_LIST_UI), HandleNotifyRefreshList);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLANT_LOCK_UI), HandleNotifyEnableLock);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLANT_LOCK_REFRESH_UI), HandleNotifyRefreshLock);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_BUY_SYS_SHOP_GOODS),HandleNotifyBuyItemSuccess);
}

//handle event msg
private function HandleNotifyEnableMain(evt:GameEvent, obj:System.Object) {
	EnableMain(obj);
}

private function HandleNotifyEnableLock(evt:GameEvent, obj:System.Object) {
	EnableLock(obj);
}

private function HandleNotifyRefreshList(evt:GameEvent, obj:System.Object) {
	var sort : PlantSeedSort = PlantLogic.GetInstance().GetSort();
	ChangeSort(sort);
}

private function HandleNotifyRefreshLock(evt:GameEvent, obj:System.Object) {
	var info : PlantLockInfo = PlantLogic.GetInstance().GetLockInfo();
	RefreshLock(info);
}

private function HandleNotifyBuyItemSuccess(evt:GameEvent, obj:System.Object) {
	if(PanLock.enabled == true) {
		PlantLogic.GetInstance().RefreshLockInfo();
	}
}

public function Enable(enable : boolean) {
	UI.getUI().EnableUIRoot("PlantUI",enable);
	UI.getUI().SetModal("PlantUI", enable);
	
	PanHelp.setEnabled(enable);
}

public function EnableMain(enable : boolean) {
	UI.getUI().EnableUIRoot("PlantUI",enable);
	UI.getUI().SetModal("PlantUI", enable);
	
	PanMain.setEnabled(enable);
//	gotoPlayerLevelPage();
}

public function EnableLock(enable : boolean) {
	UI.getUI().EnableUIRoot("PlantUI",enable);
	UI.getUI().SetModal("PlantUI", enable);
	
	PanLock.setEnabled(enable);
}

//logic function for internal
private function Clear() {
	//clear element
	for(var element : iGUIElement in ConSeedsList.items) {
		element.setEnabled(false);
	}
}

private function ClearLock() {
	for(var element : iGUIElement in ConLMatList.items) {
		element.setEnabled(false);
	}
}

private function ChangeSort(sort : PlantSeedSort) {
	if(sort == PlantSeedSort.PS_CRYSTAL) {
		ImgConsume1.image = Resources.Load("UISkins/Textures/Common1/Qcrystal");
		ImgConsume2.image = Resources.Load("UISkins/Textures/Common1/Qcrystal");
		ImgConsume3.image = Resources.Load("UISkins/Textures/Common1/Qcrystal");
		ImgConsume4.image = Resources.Load("UISkins/Textures/Common1/Qcrystal");
		ImgConsume5.image = Resources.Load("UISkins/Textures/Common1/Qcrystal");
		ImgConsume6.image = Resources.Load("UISkins/Textures/Common1/Qcrystal");
	} else if(sort == PlantSeedSort.PS_LOVEDIAMOND) {
		ImgConsume1.image = Resources.Load("UISkins/Textures/Common1/plant_aib");
		ImgConsume2.image = Resources.Load("UISkins/Textures/Common1/plant_aib");
		ImgConsume3.image = Resources.Load("UISkins/Textures/Common1/plant_aib");
		ImgConsume4.image = Resources.Load("UISkins/Textures/Common1/plant_aib");
		ImgConsume5.image = Resources.Load("UISkins/Textures/Common1/plant_aib");
		ImgConsume6.image = Resources.Load("UISkins/Textures/Common1/plant_aib");
	} else {
		return ;
	}
	
	var list : ArrayList = PlantLogic.GetInstance().ChangeSort(sort);
	RefreshList(list);
}

private function RefreshList(list : ArrayList) {
	Clear();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CHECK_SEED_CROP_ID), list);
	if(list == null || list.Count == 0) {
		Debug.Log("list is null!!");
	} else {
		for(var i=0; i<list.Count; i++) {
			if(i >= 6) break;
			var data : PlantSeedRow = list[i] as PlantSeedRow;
			if(data == null) continue;
			
			ConSeedsList.items[i].setEnabled(true);
			if(i==0) {
				SetListSlot(ImgIcon1,LabName1,LabMoney1,LabFruit1,LabTime1,BtnGrow1,BtnSGrow1,data);
			} else if(i==1) {
				SetListSlot(ImgIcon2,LabName2,LabMoney2,LabFruit2,LabTime2,BtnGrow2,BtnSGrow2,data);
			} else if(i==2) {
				SetListSlot(ImgIcon3,LabName3,LabMoney3,LabFruit3,LabTime3,BtnGrow3,BtnSGrow3,data);
			} else if(i==3) {
				SetListSlot(ImgIcon4,LabName4,LabMoney4,LabFruit4,LabTime4,BtnGrow4,BtnSGrow4,data);
			} else if(i==4) {
				SetListSlot(ImgIcon5,LabName5,LabMoney5,LabFruit5,LabTime5,BtnGrow5,BtnSGrow5,data);
			} else if(i==5) {
				SetListSlot(ImgIcon6,LabName6,LabMoney6,LabFruit6,LabTime6,BtnGrow6,BtnSGrow6,data);
			} else {
				continue;
			}
		}
	}
	
	RefreshPage();
}

function SetListSlot(img:iGUIImage,name:iGUILabel,consume:iGUILabel,harvest:iGUILabel,time:iGUILabel,grow:iGUIButton,sGrow:iGUIButton,data:PlantSeedRow) {
	if(data == null) return ;
	
	img.userData = data;
	grow.userData = data.crop_id;
	sGrow.userData = data.crop_id;
	
	name.label.text = data.name + Define.getContent(5197, [data.level.ToString()]);
	consume.label.text = data.price.ToString();
	harvest.label.text = data.intro;
	time.label.text = ((data.ripe_time)/60).ToString() + Define.minute;
	
	var icon : PlantIcon = new PlantIcon();
	icon.id = data.crop_id;
	icon.iconSlot = img;
	icon.asynIcon =  new AsynIcon(icon.CallbackIconLoad, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	icon.asynIcon.load("Icon/" + data.icon);
}

function RefreshLock(info : PlantLockInfo) {
	if(info == null) return ;
	
	ClearLock();
	
	LabLNeedLevel.label.text = Define.getContent(5198, [info.level.ToString()]);
	LabLMoney.label.text = (info.coin).ToString();
	
	if(DataCenter.getMainPlayerCurLv() >= info.level) {
		LabLNeedLevel.labelColor = Color.white;
	} else {
		LabLNeedLevel.labelColor = Color.red;
	}
	if(SelfItemLogic.getInstance()._loverDiamond >= info.coin) {
		LabLMoney.labelColor = Color.white;
	} else {
		LabLMoney.labelColor = Color.red;
	}
	
	var bMatEnough : boolean = true;
	for(var mat : PlantLockMatInfo in info.matList) {
		if(mat.needNum > mat.num) {
			bMatEnough = false;
			break;
		}
	}
	/*
	if(bMatEnough == false) {
		BtnUnlock.passive = true;
	} else {
		BtnUnlock.passive = false;
	}
	*/
	
	if(info.matList == null || info.matList.Count == 0) {
		Debug.Log("list is null!!");
	} else {
		for(var i=0; i<info.matList.Count; i++) {
			if(i >= 4) break;
			var data : PlantLockMatInfo = info.matList[i] as PlantLockMatInfo;
			if(data == null) continue;
			
			ConLMatList.items[i].setEnabled(true);
			if(i==0) {
				SetLockMatSlot(ImgLIcon1,LabLName1,LabLNum1,BtnLBuy1,data);
			} else if(i==1) {
				SetLockMatSlot(ImgLIcon2,LabLName2,LabLNum2,BtnLBuy2,data);
			} else if(i==2) {
				SetLockMatSlot(ImgLIcon3,LabLName3,LabLNum3,BtnLBuy3,data);
			} else if(i==3) {
				SetLockMatSlot(ImgLIcon4,LabLName4,LabLNum4,BtnLBuy4,data);
			} else {
				continue;
			}
		}
	}
}

function SetLockMatSlot(img:iGUIImage,name:iGUILabel,num:iGUILabel,btn:iGUIButton,data:PlantLockMatInfo) {
	if(data == null) return ;
	
	img.userData = data.mat;
	if(data.num >= data.needNum) {
		btn.passive = true;
		btn.userData = null;
	} else {
		btn.passive = false;
		btn.userData = data;
	}
	
	name.label.text = data.mat.name;
	num.label.text = (data.num).ToString() + "/" + (data.needNum).ToString();
	if(data.num >= data.needNum) {
		num.labelColor = Color.white;
	} else {
		num.labelColor = Color.red;
	}
	
	var icon : PlantIcon = new PlantIcon();
	icon.id = data.mat.id;
	icon.iconSlot = img;
	icon.asynIcon =  new AsynIcon(icon.CallbackIconLoad, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	icon.asynIcon.load("Icon/" + data.mat.icon);
}

private function RefreshPage() {
	var curPage : int = PlantLogic.GetInstance().GetCurrPageNum();
	var totalPage : int = PlantLogic.GetInstance().GetTotalPageNum();
	if(totalPage == 0) totalPage = 1;
	if(curPage == 0) curPage = 1;
	LabPage.label.text = curPage.ToString()+"/"+totalPage.ToString();
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

//callback
private function CallbackMouseClickClose(callback : iGUIElement) {
	Enable(false);
}

private function CallbackMouseClickMainClose(callback : iGUIElement) {
	EnableMain(false);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_BACKPACKUI));
}

private function CallbackMouseClickPrePage(callback : iGUIElement) {
	var list : ArrayList = PlantLogic.GetInstance().GetPrePage();
	RefreshList(list);
}

private function CallbackMouseClickNextPage(callback : iGUIElement) {
	var list : ArrayList = PlantLogic.GetInstance().GetNextPage();
	RefreshList(list);
}

private function CallbackMouseClickFirstPage(callback : iGUIElement) {
	var list : ArrayList = PlantLogic.GetInstance().GetPageData(1);
	RefreshList(list);
}

private function gotoPlayerLevelPage() {
	var pageIndex : int = PlantLogic.GetInstance().GetPageNumByPlayerLevel();
	var list : ArrayList = PlantLogic.GetInstance().GetPageData(pageIndex);
	RefreshList(list);
}

private function CallbackMouseClickLabel1(callback : iGUIElement) {
	ChangeSort(PlantSeedSort.PS_CRYSTAL);
}

private function CallbackMouseClickLabel2(callback : iGUIElement) {
	ChangeSort(PlantSeedSort.PS_LOVEDIAMOND);
}

private function CallbackMouseClickLabel3(callback : iGUIElement) {
	ChangeSort(PlantSeedSort.PS_LOVEDIAMOND);
}

private function CallbackMouseClickGrow(callback : iGUIElement) {
	PlantLogic.GetInstance().CheckGrow(callback.userData);
}

private function CallbackMouseClickSGrow(callback : iGUIElement) {
	PlantLogic.GetInstance().CheckBatchGrow(callback.userData);
}

private function CallbackMouseClickLockClose(callback : iGUIElement) {
	EnableLock(false);
}

private function CallbackMouseClickUnLock(callback : iGUIElement) {
	PlantLogic.GetInstance().Unlock();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.UNLOCKFLOWERPOT));
}

private function CallbackMouseClickTotalBuy(callback : iGUIElement) {
	PlantLogic.GetInstance().LockTotalBuy();
}

private function CallbackMouseClickLockBuy(callback : iGUIElement) {
	var data : PlantLockMatInfo = callback.userData as PlantLockMatInfo;
	if(data == null) return ;
	
	var mat : goods_atom = new goods_atom();
	mat.goods_id = data.goodId;
	mat.count = data.needNum - data.num;
	var mat_arr : Array = new Array();
	mat_arr.Add(mat);
	FurnitureUnlockLogic.getInstance().requestFillMaterial(mat_arr);
}

private function CallbackMouseOverMat(callback : iGUIElement) {
	if(callback.userData != null) {
		ItemHint.ShowPackItemHint(callback, callback.userData as ItemRow, false);
	}
}

private function CallbackBGIcon(tex:Texture) {
	PanHelp.style.normal.background = tex;
}

private static var instance : iGUICode_PlantUI;
function Awake(){
	instance=this;
	
	RegistEventMsg();
}
static function getInstance(){
	return instance;
}
@HideInInspector
var LabLNum4 : iGUILabel;
@HideInInspector
var LabLName4 : iGUILabel;
@HideInInspector
var ImgLIcon4 : iGUIImage;
@HideInInspector
var BtnLBuy4 : iGUIButton;
@HideInInspector
var ConLMat4 : iGUIPanel;
@HideInInspector
var LabLNum3 : iGUILabel;
@HideInInspector
var LabLName3 : iGUILabel;
@HideInInspector
var ImgLIcon3 : iGUIImage;
@HideInInspector
var BtnLBuy3 : iGUIButton;
@HideInInspector
var ConLMat3 : iGUIPanel;
@HideInInspector
var LabLNum2 : iGUILabel;
@HideInInspector
var LabLName2 : iGUILabel;
@HideInInspector
var ImgLIcon2 : iGUIImage;
@HideInInspector
var BtnLBuy2 : iGUIButton;
@HideInInspector
var ConLMat2 : iGUIPanel;
@HideInInspector
var LabLNum1 : iGUILabel;
@HideInInspector
var LabLName1 : iGUILabel;
@HideInInspector
var ImgLIcon1 : iGUIImage;
@HideInInspector
var BtnLBuy1 : iGUIButton;
@HideInInspector
var ConLMat1 : iGUIPanel;
@HideInInspector
var ConLMatList : iGUIContainer;
@HideInInspector
var LabLTitle : iGUILabel;
@HideInInspector
var LabLNeedLevel : iGUILabel;
@HideInInspector
var LabLMoney : iGUILabel;
@HideInInspector
var ImgPotIcon : iGUIImage;
@HideInInspector
var BtnUnlock : iGUIButton;
@HideInInspector
var BtnTotalBuy : iGUIButton;
@HideInInspector
var BtnLClose : iGUIButton;
@HideInInspector
var PanLock : iGUIPanel;
@HideInInspector
var ConSeedsList : iGUIContainer;
@HideInInspector
var ImgConsume6 : iGUIImage;
@HideInInspector
var ImgIcon6 : iGUIImage;
@HideInInspector
var LabTime6 : iGUILabel;
@HideInInspector
var LabName6 : iGUILabel;
@HideInInspector
var LabMoney6 : iGUILabel;
@HideInInspector
var LabFruit6 : iGUILabel;
@HideInInspector
var BtnSGrow6 : iGUIButton;
@HideInInspector
var BtnGrow6 : iGUIButton;
@HideInInspector
var ConSeed6 : iGUIPanel;
@HideInInspector
var ImgConsume5 : iGUIImage;
@HideInInspector
var ImgIcon5 : iGUIImage;
@HideInInspector
var LabTime5 : iGUILabel;
@HideInInspector
var LabName5 : iGUILabel;
@HideInInspector
var LabMoney5 : iGUILabel;
@HideInInspector
var LabFruit5 : iGUILabel;
@HideInInspector
var BtnSGrow5 : iGUIButton;
@HideInInspector
var BtnGrow5 : iGUIButton;
@HideInInspector
var ConSeed5 : iGUIPanel;
@HideInInspector
var ImgConsume4 : iGUIImage;
@HideInInspector
var ImgIcon4 : iGUIImage;
@HideInInspector
var LabTime4 : iGUILabel;
@HideInInspector
var LabName4 : iGUILabel;
@HideInInspector
var LabMoney4 : iGUILabel;
@HideInInspector
var LabFruit4 : iGUILabel;
@HideInInspector
var BtnSGrow4 : iGUIButton;
@HideInInspector
var BtnGrow4 : iGUIButton;
@HideInInspector
var ConSeed4 : iGUIPanel;
@HideInInspector
var ImgConsume3 : iGUIImage;
@HideInInspector
var ImgIcon3 : iGUIImage;
@HideInInspector
var LabTime3 : iGUILabel;
@HideInInspector
var LabName3 : iGUILabel;
@HideInInspector
var LabMoney3 : iGUILabel;
@HideInInspector
var LabFruit3 : iGUILabel;
@HideInInspector
var BtnSGrow3 : iGUIButton;
@HideInInspector
var BtnGrow3 : iGUIButton;
@HideInInspector
var ConSeed3 : iGUIPanel;
@HideInInspector
var ImgConsume2 : iGUIImage;
@HideInInspector
var ImgIcon2 : iGUIImage;
@HideInInspector
var LabTime2 : iGUILabel;
@HideInInspector
var LabName2 : iGUILabel;
@HideInInspector
var LabMoney2 : iGUILabel;
@HideInInspector
var LabFruit2 : iGUILabel;
@HideInInspector
var BtnSGrow2 : iGUIButton;
@HideInInspector
var BtnGrow2 : iGUIButton;
@HideInInspector
var ConSeed2 : iGUIPanel;
@HideInInspector
var ImgConsume1 : iGUIImage;
@HideInInspector
var ImgIcon1 : iGUIImage;
@HideInInspector
var LabTime1 : iGUILabel;
@HideInInspector
var LabName1 : iGUILabel;
@HideInInspector
var LabMoney1 : iGUILabel;
@HideInInspector
var LabFruit1 : iGUILabel;
@HideInInspector
var BtnSGrow1 : iGUIButton;
@HideInInspector
var BtnGrow1 : iGUIButton;
@HideInInspector
var ConSeed1 : iGUIPanel;
@HideInInspector
var BtnFirstPage : iGUIButton;
@HideInInspector
var BtnPrePage : iGUIButton;
@HideInInspector
var BtnNextPage : iGUIButton;
@HideInInspector
var BtnLabel3 : iGUIButton;
@HideInInspector
var BtnLabel2 : iGUIButton;
@HideInInspector
var BtnLabel1 : iGUIButton;
@HideInInspector
var LabPage : iGUILabel;
@HideInInspector
var BtnClose : iGUIButton;
@HideInInspector
var PanMain : iGUIPanel;
@HideInInspector
var BtnBClose : iGUIButton;
@HideInInspector
var PanHelp : iGUIPanel;
@HideInInspector
var root1 : iGUIRoot;