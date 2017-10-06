#pragma strict
#pragma downcast
import iGUI;

enum QHEntryBtnStatus {
	ENTRY_NEWER = 1,
	ENTRY_DAILY = 2,
	ENTRY_GOT = 3
}

class QQHomeGiftIcon {
	public var data : int;					// gift data
	public var asynIcon : AsynIcon = null;	// asyn icon manager
	public var iconSlot : iGUIImage;		// icon slot ui
	
	public function CallbackIconLoad(tex : Texture) {
		iconSlot.image = tex;
	}
}

private var mInit : boolean = false;

function Start() {
	Init();
	InitIdentity();
}

function Enable(enable : boolean) {
	UI.getUI().EnableUIRoot("QQHomeUI",enable);
	
	if(!QQHomeLogic.GetInstance().IsQQHomeVip()) {
		Enable(PanNewerGift,enable);
	} else if(QQHomeLogic.GetInstance().IsNewComer()) {
		Enable(PanNewerGift,enable);
	} else if(QQHomeLogic.GetInstance().IsGiftGet()) {
		Enable(PanPrivilege,enable);
	} else {
		Enable(PanDailyGift,enable);
	}
}

function Enable(element : iGUIElement,enable : boolean) {
	element.setEnabled(enable);
	
	if(enable) {
		if(!mInit) {
			Init();
		}
		UI.getUI().SetModal("QQHomeUI", true);
		
		QQHomeLogic.GetInstance().TriggerGiftBag();
	} else {
		UI.getUI().SetModal("QQHomeUI", false);
	}
}

function EnablePrivilege(enable : boolean) {
	QQHomeLogic.GetInstance().ShowPrivilege();
	Enable(PanPrivilege,enable);
}

private function Init() {
	BtnNewerGiftClose.clickCallback = CallbackMouseClickNewerEnable;
	BtnNewerGiftGet.clickCallback = CallbackMouseClickNewerGet;
	BtnNewerGiftRenew.clickCallback = CallbackMouseClickRenew;
	BtnNewerGiftKown.clickCallback = CallbackMouseClickNewerKnown;
	BtnNewerGiftOpen.clickCallback = CallbackMouseClickOpen;
	
	BtnDailyClose.clickCallback = CallbackMouseClickDailyEnable;
	BtnDailyGet.clickCallback = CallbackMouseClickDailyGet;
	BtnDailyViewMore.clickCallback = CallbackMouseClickDailyViewMore;
	BtnDailyRenew.clickCallback = CallbackMouseClickRenew;
	BtnDailyYearRenew.clickCallback = CallbackMouseClickYearRenew;
	BtnDailyYearOpen.clickCallback = CallbackMouseClickOpenYear;
	
	BtnPrivilegeClose.clickCallback = CallbackMouseClickPrivilegeEnable;
	BtnPrivilegeRenew.clickCallback = CallbackMouseClickRenew;
	BtnPrivilegeRenewYear.clickCallback = CallbackMouseClickYearRenew;
	BtnPrivilegeOpen.clickCallback = CallbackMouseClickOpen;
	BtnPrivilegeOpenYear.clickCallback = CallbackMouseClickOpenYear;
	
	ImgNewerGift1.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgNewerGift2.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgNewerGift3.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgNewerGift4.mouseOverCallback = CallbackMouseOverGiftSlot;
	
	ImgDailyGift1.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgDailyGift2.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgDailyGift3.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgDailyGiftNext1.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgDailyGiftNext2.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgDailyGiftNext3.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgYearDailyGift.mouseOverCallback = CallbackMouseOverGiftSlot;
	
	ImgPrivilegeGiftOne1.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgPrivilegeGiftTwo1.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgPrivilegeGiftThree1.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgPrivilegeGiftOne2.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgPrivilegeGiftTwo2.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgPrivilegeGiftThree2.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgPrivilegeGiftOne3.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgPrivilegeGiftTwo3.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgPrivilegeGiftThree3.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgPrivilegeGiftOne4.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgPrivilegeGiftTwo4.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgPrivilegeGiftThree4.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgPrivilegeGiftOne5.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgPrivilegeGiftTwo5.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgPrivilegeGiftThree5.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgPrivilegeGiftOne6.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgPrivilegeGiftTwo6.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgPrivilegeGiftThree6.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgPrivilegeGiftOne7.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgPrivilegeGiftTwo7.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgPrivilegeGiftThree7.mouseOverCallback = CallbackMouseOverGiftSlot;
	ImgPrivilegeYearGift.mouseOverCallback = CallbackMouseOverGiftSlot;
}

private function InitIdentity() {
	var type : QQHomeType = QQHomeLogic.GetInstance().GetQQHomeType();
	var level : int = QQHomeLogic.GetInstance().GetQQHomeLv();
	if(type == QQHomeType.QQHOME_NONE) {
		BtnNewerGiftGet.setEnabled(false);
		BtnNewerGiftRenew.setEnabled(false);
		BtnNewerGiftKown.setEnabled(true);
		BtnNewerGiftOpen.setEnabled(true);
		BtnPrivilegeRenew.setEnabled(false);
		BtnPrivilegeRenewYear.setEnabled(false);
		BtnPrivilegeOpen.setEnabled(true);
		BtnPrivilegeOpenYear.setEnabled(true);
		
		ImgNewerBG.setEnabled(true);
		ImgNewerLock1.setEnabled(true);
		ImgNewerLock2.setEnabled(true);
		ImgNewerLock3.setEnabled(true);
		ImgNewerLock4.setEnabled(true);
	} else if(type == QQHomeType.QQHOME_NORMAL) {
		BtnNewerGiftGet.setEnabled(true);
		BtnNewerGiftRenew.setEnabled(true);
		BtnNewerGiftKown.setEnabled(false);
		BtnNewerGiftOpen.setEnabled(false);
		BtnDailyYearOpen.setEnabled(true);
		BtnDailyYearRenew.setEnabled(false);
		BtnPrivilegeRenew.setEnabled(true);
		BtnPrivilegeRenewYear.setEnabled(false);
		BtnPrivilegeOpen.setEnabled(false);
		BtnPrivilegeOpenYear.setEnabled(true);
		
		ImgYearDailyGiftBG.setEnabled(false);
		ImgDailyYearGiftLock.setEnabled(true);
		ImgNewerBG.setEnabled(false);
		ImgNewerLock1.setEnabled(false);
		ImgNewerLock2.setEnabled(false);
		ImgNewerLock3.setEnabled(false);
		ImgNewerLock4.setEnabled(false);
	} else if(type == QQHomeType.QQHOME_YEAR) {
		BtnNewerGiftGet.setEnabled(true);
		BtnNewerGiftRenew.setEnabled(true);
		BtnNewerGiftKown.setEnabled(false);
		BtnNewerGiftOpen.setEnabled(false);
		BtnDailyYearOpen.setEnabled(false);
		BtnDailyYearRenew.setEnabled(true);
		BtnPrivilegeRenew.setEnabled(false);
		BtnPrivilegeRenewYear.setEnabled(true);
		BtnPrivilegeOpen.setEnabled(false);
		BtnPrivilegeOpenYear.setEnabled(true);
		
		ImgYearDailyGiftBG.setEnabled(true);
		ImgDailyYearGiftLock.setEnabled(false);
		ImgNewerBG.setEnabled(false);
		ImgNewerLock1.setEnabled(false);
		ImgNewerLock2.setEnabled(false);
		ImgNewerLock3.setEnabled(false);
		ImgNewerLock4.setEnabled(false);
	} else {
		Debug.Log("do nothing!!!");
	}
	
	if(QQHomeLogic.GetInstance().IsTopLevel()) {
		ImgDailyGiftNext1.setEnabled(false);
		LabDailyGiftCountNext1.setEnabled(false);
		ImgDailyGiftNext2.setEnabled(false);
		LabDailyGiftCountNext2.setEnabled(false);
		ImgDailyGiftNext3.setEnabled(false);
		LabDailyGiftCountNext3.setEnabled(false);
		ImgDailyNextBG.setEnabled(true);
	} else {
		ImgDailyNextBG.setEnabled(false);
	}
	
	ImgDailyLevel.image = Resources.Load("UISkins/Textures/hz/hz_lv"+level.ToString());
	ImgDailyLevelNext.image = Resources.Load("UISkins/Textures/hz/hz_lv"+(level+1).ToString());
}

private function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_QQHOME_ENTRY_STATUS), HandleNotifyEntryStatus);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_QQHOME_SET_PRIVILEGE_ITEM), HandleNotifySetPrivilegeItem);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_QQHOME_SET_PRIVILEGE_SLOT), HandleNotifySetPrivilegeSlot);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_QQHOME_SET_NEWER_GIFT_SLOT), HandleNotifySetNewerGiftSlot);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_QQHOME_SET_DAILY_SLOT), HandleNotifySetDailySlot);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_QQHOME_SET_DAILY_YEAR_SLOT), HandleNotifySetDailyYearSlot);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_QQHOME_SET_DAILY_SLOT_NEXT_LEVEL), HandleNotifySetDailyNextSlot);
}

private function ShowTip(element : iGUIElement,item_id : int) {
	if(item_id == 0) return ;
	ItemHint.ShowPackItemHint(element, ResManager.LgtMgr.getItemRow(item_id), false);
}

private function SetShowItem(data : QQHomeGiftRow) {
	switch(data.level) {
		case 1:
			if(data.gift1 != 0) {
				EnableItem(true,ImgPrivilegeGiftOne1,LabPrivilegeGiftNameOne1,LabPrivilegeGiftCountOne1);
				SetItem(data.gift1,data.count1,ImgPrivilegeGiftOne1,LabPrivilegeGiftNameOne1,LabPrivilegeGiftCountOne1);
			} else {
				EnableItem(false,ImgPrivilegeGiftOne1,LabPrivilegeGiftNameOne1,LabPrivilegeGiftCountOne1);
			}
			if(data.gift2 != 0) {
				EnableItem(true,ImgPrivilegeGiftTwo1,LabPrivilegeGiftNameTwo1,LabPrivilegeGiftCountTwo1);
				SetItem(data.gift2,data.count2,ImgPrivilegeGiftTwo1,LabPrivilegeGiftNameTwo1,LabPrivilegeGiftCountTwo1);
			} else {
				EnableItem(false,ImgPrivilegeGiftTwo1,LabPrivilegeGiftNameTwo1,LabPrivilegeGiftCountTwo1);
			}
			if(data.gift3 != 0) {
				EnableItem(true,ImgPrivilegeGiftThree1,LabPrivilegeGiftNameThree1,LabPrivilegeGiftCountThree1);
				SetItem(data.gift3,data.count3,ImgPrivilegeGiftThree1,LabPrivilegeGiftNameThree1,LabPrivilegeGiftCountThree1);
			} else {
				EnableItem(false,ImgPrivilegeGiftThree1,LabPrivilegeGiftNameThree1,LabPrivilegeGiftCountThree1);
			}
			break;
		case 2:
			if(data.gift1 != 0) {
				EnableItem(true,ImgPrivilegeGiftOne2,LabPrivilegeGiftNameOne2,LabPrivilegeGiftCountOne2);
				SetItem(data.gift1,data.count1,ImgPrivilegeGiftOne2,LabPrivilegeGiftNameOne2,LabPrivilegeGiftCountOne2);
			} else {
				EnableItem(false,ImgPrivilegeGiftOne2,LabPrivilegeGiftNameOne2,LabPrivilegeGiftCountOne2);
			}
			if(data.gift2 != 0) {
				EnableItem(true,ImgPrivilegeGiftTwo2,LabPrivilegeGiftNameTwo2,LabPrivilegeGiftCountTwo2);
				SetItem(data.gift2,data.count2,ImgPrivilegeGiftTwo2,LabPrivilegeGiftNameTwo2,LabPrivilegeGiftCountTwo2);
			} else {
				EnableItem(false,ImgPrivilegeGiftTwo2,LabPrivilegeGiftNameTwo2,LabPrivilegeGiftCountTwo2);
			}
			if(data.gift3 != 0) {
				EnableItem(true,ImgPrivilegeGiftThree2,LabPrivilegeGiftNameThree2,LabPrivilegeGiftCountThree2);
				SetItem(data.gift3,data.count3,ImgPrivilegeGiftThree2,LabPrivilegeGiftNameThree2,LabPrivilegeGiftCountThree2);
			} else {
				EnableItem(false,ImgPrivilegeGiftThree2,LabPrivilegeGiftNameThree2,LabPrivilegeGiftCountThree2);
			}
			break;
		case 3:
			if(data.gift1 != 0) {
				EnableItem(true,ImgPrivilegeGiftOne3,LabPrivilegeGiftNameOne3,LabPrivilegeGiftCountOne3);
				SetItem(data.gift1,data.count1,ImgPrivilegeGiftOne3,LabPrivilegeGiftNameOne3,LabPrivilegeGiftCountOne3);
			} else {
				EnableItem(false,ImgPrivilegeGiftOne3,LabPrivilegeGiftNameOne3,LabPrivilegeGiftCountOne3);
			}
			if(data.gift2 != 0) {
				EnableItem(true,ImgPrivilegeGiftTwo3,LabPrivilegeGiftNameTwo3,LabPrivilegeGiftCountTwo3);
				SetItem(data.gift2,data.count2,ImgPrivilegeGiftTwo3,LabPrivilegeGiftNameTwo3,LabPrivilegeGiftCountTwo3);
			} else {
				EnableItem(false,ImgPrivilegeGiftTwo3,LabPrivilegeGiftNameTwo3,LabPrivilegeGiftCountTwo3);
			}
			if(data.gift3 != 0) {
				EnableItem(true,ImgPrivilegeGiftThree3,LabPrivilegeGiftNameThree3,LabPrivilegeGiftCountThree3);
				SetItem(data.gift3,data.count3,ImgPrivilegeGiftThree3,LabPrivilegeGiftNameThree3,LabPrivilegeGiftCountThree3);
			} else {
				EnableItem(false,ImgPrivilegeGiftThree3,LabPrivilegeGiftNameThree3,LabPrivilegeGiftCountThree3);
			}
			break;
		case 4:
			if(data.gift1 != 0) {
				EnableItem(true,ImgPrivilegeGiftOne4,LabPrivilegeGiftNameOne4,LabPrivilegeGiftCountOne4);
				SetItem(data.gift1,data.count1,ImgPrivilegeGiftOne4,LabPrivilegeGiftNameOne4,LabPrivilegeGiftCountOne4);
			} else {
				EnableItem(false,ImgPrivilegeGiftOne4,LabPrivilegeGiftNameOne4,LabPrivilegeGiftCountOne4);
			}
			if(data.gift2 != 0) {
				EnableItem(true,ImgPrivilegeGiftTwo4,LabPrivilegeGiftNameTwo4,LabPrivilegeGiftCountTwo4);
				SetItem(data.gift2,data.count2,ImgPrivilegeGiftTwo4,LabPrivilegeGiftNameTwo4,LabPrivilegeGiftCountTwo4);
			} else {
				EnableItem(false,ImgPrivilegeGiftTwo4,LabPrivilegeGiftNameTwo4,LabPrivilegeGiftCountTwo4);
			}
			if(data.gift3 != 0) {
				EnableItem(true,ImgPrivilegeGiftThree4,LabPrivilegeGiftNameThree4,LabPrivilegeGiftCountThree4);
				SetItem(data.gift3,data.count3,ImgPrivilegeGiftThree4,LabPrivilegeGiftNameThree4,LabPrivilegeGiftCountThree4);
			} else {
				EnableItem(false,ImgPrivilegeGiftThree4,LabPrivilegeGiftNameThree4,LabPrivilegeGiftCountThree4);
			}
			break;
		case 5:
			if(data.gift1 != 0) {
				EnableItem(true,ImgPrivilegeGiftOne5,LabPrivilegeGiftNameOne5,LabPrivilegeGiftCountOne5);
				SetItem(data.gift1,data.count1,ImgPrivilegeGiftOne5,LabPrivilegeGiftNameOne5,LabPrivilegeGiftCountOne5);
			} else {
				EnableItem(false,ImgPrivilegeGiftOne5,LabPrivilegeGiftNameOne5,LabPrivilegeGiftCountOne5);
			}
			if(data.gift2 != 0) {
				EnableItem(true,ImgPrivilegeGiftTwo5,LabPrivilegeGiftNameTwo5,LabPrivilegeGiftCountTwo5);
				SetItem(data.gift2,data.count2,ImgPrivilegeGiftTwo5,LabPrivilegeGiftNameTwo5,LabPrivilegeGiftCountTwo5);
			} else {
				EnableItem(false,ImgPrivilegeGiftTwo5,LabPrivilegeGiftNameTwo5,LabPrivilegeGiftCountTwo5);
			}
			if(data.gift3 != 0) {
				EnableItem(true,ImgPrivilegeGiftThree5,LabPrivilegeGiftNameThree5,LabPrivilegeGiftCountThree5);
				SetItem(data.gift3,data.count3,ImgPrivilegeGiftThree5,LabPrivilegeGiftNameThree5,LabPrivilegeGiftCountThree5);
			} else {
				EnableItem(false,ImgPrivilegeGiftThree5,LabPrivilegeGiftNameThree5,LabPrivilegeGiftCountThree5);
			}
			break;
		case 6:
			if(data.gift1 != 0) {
				EnableItem(true,ImgPrivilegeGiftOne6,LabPrivilegeGiftNameOne6,LabPrivilegeGiftCountOne6);
				SetItem(data.gift1,data.count1,ImgPrivilegeGiftOne6,LabPrivilegeGiftNameOne6,LabPrivilegeGiftCountOne6);
			} else {
				EnableItem(false,ImgPrivilegeGiftOne6,LabPrivilegeGiftNameOne6,LabPrivilegeGiftCountOne6);
			}
			if(data.gift2 != 0) {
				EnableItem(true,ImgPrivilegeGiftTwo6,LabPrivilegeGiftNameTwo6,LabPrivilegeGiftCountTwo6);
				SetItem(data.gift2,data.count2,ImgPrivilegeGiftTwo6,LabPrivilegeGiftNameTwo6,LabPrivilegeGiftCountTwo6);
			} else {
				EnableItem(false,ImgPrivilegeGiftTwo6,LabPrivilegeGiftNameTwo6,LabPrivilegeGiftCountTwo6);
			}
			if(data.gift3 != 0) {
				EnableItem(true,ImgPrivilegeGiftThree6,LabPrivilegeGiftNameThree6,LabPrivilegeGiftCountThree6);
				SetItem(data.gift3,data.count3,ImgPrivilegeGiftThree6,LabPrivilegeGiftNameThree6,LabPrivilegeGiftCountThree6);
			} else {
				EnableItem(false,ImgPrivilegeGiftThree6,LabPrivilegeGiftNameThree6,LabPrivilegeGiftCountThree6);
			}
			break;
		case 7:
			if(data.gift1 != 0) {
				EnableItem(true,ImgPrivilegeGiftOne7,LabPrivilegeGiftNameOne7,LabPrivilegeGiftCountOne7);
				SetItem(data.gift1,data.count1,ImgPrivilegeGiftOne7,LabPrivilegeGiftNameOne7,LabPrivilegeGiftCountOne7);
			} else {
				EnableItem(false,ImgPrivilegeGiftOne7,LabPrivilegeGiftNameOne7,LabPrivilegeGiftCountOne7);
			}
			if(data.gift2 != 0) {
				EnableItem(true,ImgPrivilegeGiftTwo7,LabPrivilegeGiftNameTwo7,LabPrivilegeGiftCountTwo7);
				SetItem(data.gift2,data.count2,ImgPrivilegeGiftTwo7,LabPrivilegeGiftNameTwo7,LabPrivilegeGiftCountTwo7);
			} else {
				EnableItem(false,ImgPrivilegeGiftTwo7,LabPrivilegeGiftNameTwo7,LabPrivilegeGiftCountTwo7);
			}
			if(data.gift3 != 0) {
				EnableItem(true,ImgPrivilegeGiftThree7,LabPrivilegeGiftNameThree7,LabPrivilegeGiftCountThree7);
				SetItem(data.gift3,data.count3,ImgPrivilegeGiftThree7,LabPrivilegeGiftNameThree7,LabPrivilegeGiftCountThree7);
			} else {
				EnableItem(false,ImgPrivilegeGiftThree7,LabPrivilegeGiftNameThree7,LabPrivilegeGiftCountThree7);
			}
			break;
	}
}

private function SetItem(itemID : int,count : int,image : iGUIImage,label : iGUILabel,labelCount : iGUILabel) {
	if(label != null) {			
		label.label.text = ResManager.LgtMgr.getItemRow(itemID).name;
	}
	if(labelCount != null) {
		labelCount.label.text = count.ToString();
	}
	if(image != null) {
		var gift_icon : QQHomeGiftIcon = new QQHomeGiftIcon();
		gift_icon.data = itemID;
		gift_icon.iconSlot = image;
		gift_icon.asynIcon = new AsynIcon(gift_icon.CallbackIconLoad, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
		gift_icon.asynIcon.load("Icon/" + ResManager.LgtMgr.getItemRow(itemID).icon);
		image.userData = itemID;
	}
}

private function EnableItem(bEnable : boolean,image : iGUIImage,label : iGUILabel,labelCount : iGUILabel) {
	if(image != null) {
		image.setEnabled(bEnable);
	}
	if(label != null) {
		label.setEnabled(bEnable);
	}
	if(labelCount != null) {
		labelCount.setEnabled(bEnable);
	}
}
//handle game event
private function HandleNotifyEntryStatus(evt:GameEvent, obj:System.Object) {
	var status : QHEntryBtnStatus = obj;
	
	if(status == QHEntryBtnStatus.ENTRY_NEWER) {
		if(PlatformMgr.IsPlatYY()) {
			iGUICode_MainUI.getInstance().BtnQQHomeNewer.setEnabled(false);
		} else {
			iGUICode_MainUI.getInstance().BtnQQHomeNewer.setEnabled(true);
		}
		iGUICode_MainUI.getInstance().BtnQQHomeDaily.setEnabled(false);
		iGUICode_MainUI.getInstance().BtnQQHomeGot.setEnabled(false);
	} else if(status == QHEntryBtnStatus.ENTRY_DAILY) {
		iGUICode_MainUI.getInstance().BtnQQHomeNewer.setEnabled(false);
		iGUICode_MainUI.getInstance().BtnQQHomeDaily.setEnabled(true);
		iGUICode_MainUI.getInstance().BtnQQHomeGot.setEnabled(false);
	} else if(status == QHEntryBtnStatus.ENTRY_GOT) {
		iGUICode_MainUI.getInstance().BtnQQHomeNewer.setEnabled(false);
		iGUICode_MainUI.getInstance().BtnQQHomeDaily.setEnabled(false);
		iGUICode_MainUI.getInstance().BtnQQHomeGot.setEnabled(true);
	} else {
		iGUICode_MainUI.getInstance().BtnQQHomeNewer.setEnabled(false);
		iGUICode_MainUI.getInstance().BtnQQHomeDaily.setEnabled(false);
		iGUICode_MainUI.getInstance().BtnQQHomeGot.setEnabled(false);
	}
}

private function HandleNotifySetPrivilegeItem(evt:GameEvent, obj:System.Object) {
	var data : QQHomeGiftRow = obj;
	
	SetShowItem(data);
}

private function HandleNotifySetPrivilegeSlot(evt:GameEvent, obj:System.Object) {
	var data : QQHomeGiftRow = obj;
	
	SetItem(data.gift_year,data.count_year,ImgPrivilegeYearGift,LabPrivilegeYearGiftName,LabPrivilegeYearGiftCount);
}

private function HandleNotifySetNewerGiftSlot(evt:GameEvent, obj:System.Object) {
	var data : QQHomeGiftRow = obj;
	
	if(data.gift1 != 0) {
		EnableItem(true,ImgNewerGift1,LabNewerGiftName1,LabNewerGiftCount1);
		SetItem(data.gift1,data.count1,ImgNewerGift1,LabNewerGiftName1,LabNewerGiftCount1);
	} else {
		EnableItem(false,ImgNewerGift1,LabNewerGiftName1,LabNewerGiftCount1);
	}
	if(data.gift2 != 0) {
		EnableItem(true,ImgNewerGift2,LabNewerGiftName2,LabNewerGiftCount2);
		SetItem(data.gift2,data.count2,ImgNewerGift2,LabNewerGiftName2,LabNewerGiftCount2);
	} else {
		EnableItem(false,ImgNewerGift2,LabNewerGiftName2,LabNewerGiftCount2);
	}
	if(data.gift3 != 0) {
		EnableItem(true,ImgNewerGift3,LabNewerGiftName3,LabNewerGiftCount3);
		SetItem(data.gift3,data.count3,ImgNewerGift3,LabNewerGiftName3,LabNewerGiftCount3);
	} else {
		EnableItem(false,ImgNewerGift3,LabNewerGiftName3,LabNewerGiftCount3);
	}
	if(data.gift_year != 0) {
		EnableItem(true,ImgNewerGift4,LabNewerGiftName4,LabNewerGiftCount4);
		SetItem(data.gift_year,data.count_year,ImgNewerGift4,LabNewerGiftName4,LabNewerGiftCount4);
	} else {
		EnableItem(false,ImgNewerGift4,LabNewerGiftName4,LabNewerGiftCount4);
	}
}

private function HandleNotifySetDailySlot(evt:GameEvent, obj:System.Object) {
	var data : QQHomeGiftRow = obj;
	
	if(data.gift1 != 0) {
		EnableItem(true,ImgDailyGift1,LabDailyGiftName1,LabDailyGiftCount1);
		SetItem(data.gift1,data.count1,ImgDailyGift1,LabDailyGiftName1,LabDailyGiftCount1);
	} else {
		EnableItem(false,ImgDailyGift1,LabDailyGiftName1,LabDailyGiftCount1);
	}
	if(data.gift2 != 0) {
		EnableItem(true,ImgDailyGift2,LabDailyGiftName2,LabDailyGiftCount2);
		SetItem(data.gift2,data.count2,ImgDailyGift2,LabDailyGiftName2,LabDailyGiftCount2);
	} else {
		EnableItem(false,ImgDailyGift2,LabDailyGiftName2,LabDailyGiftCount2);
	}
	if(data.gift3 != 0) {
		EnableItem(true,ImgDailyGift3,LabDailyGiftName3,LabDailyGiftCount3);
		SetItem(data.gift3,data.count3,ImgDailyGift3,LabDailyGiftName3,LabDailyGiftCount3);
	} else {
		EnableItem(false,ImgDailyGift3,LabDailyGiftName3,LabDailyGiftCount3);
	}
}

private function HandleNotifySetDailyNextSlot(evt:GameEvent, obj:System.Object) {
	var data : QQHomeGiftRow = obj;
	
	if(data.gift1 != 0) {
		EnableItem(true,ImgDailyGiftNext1,null,LabDailyGiftCountNext1);
		SetItem(data.gift1,data.count1,ImgDailyGiftNext1,null,LabDailyGiftCountNext1);
	} else {
		EnableItem(false,ImgDailyGiftNext1,null,LabDailyGiftCountNext1);
	}
	if(data.gift2 != 0) {
		EnableItem(true,ImgDailyGiftNext2,null,LabDailyGiftCountNext2);
		SetItem(data.gift2,data.count2,ImgDailyGiftNext2,null,LabDailyGiftCountNext2);
	} else {
		EnableItem(false,ImgDailyGiftNext2,null,LabDailyGiftCountNext2);
	}
	if(data.gift3 != 0) {
		EnableItem(true,ImgDailyGiftNext3,null,LabDailyGiftCountNext3);
		SetItem(data.gift3,data.count3,ImgDailyGiftNext3,null,LabDailyGiftCountNext3);
	} else {
		EnableItem(false,ImgDailyGiftNext3,null,LabDailyGiftCountNext3);
	}
}

private function HandleNotifySetDailyYearSlot(evt:GameEvent, obj:System.Object) {
	var data : QQHomeGiftRow = obj;
	
	SetItem(data.gift_year,data.count_year,ImgYearDailyGift,LabYearDailyGiftName,LabYearDailyGiftCount);
}
//callback
private function CallbackMouseClickNewerEnable(callback : iGUIElement) {
	Enable(PanNewerGift,false);
}

private function CallbackMouseClickNewerKnown(callback : iGUIElement) {
	Enable(PanNewerGift,false);
	Enable(PanPrivilege,true);
	QQHomeLogic.GetInstance().ShowPrivilege();
}

private function CallbackMouseClickDailyEnable(callback : iGUIElement) {
	Enable(PanDailyGift,false);
}

private function CallbackMouseClickNewerGet(callback : iGUIElement) {
	Enable(PanNewerGift,false);
	QQHomeLogic.GetInstance().TakeGiftBag();
}

private function CallbackMouseClickDailyGet(callback : iGUIElement) {
	Enable(PanDailyGift,false);
	QQHomeLogic.GetInstance().TakeGiftBag();
}

private function CallbackMouseClickRenew(callback : iGUIElement) {
	Enable(false);
	
	QQHomeLogic.GetInstance().ReNewQQHome();
}

private function CallbackMouseClickYearRenew(callback : iGUIElement) {
	Enable(false);
	
	QQHomeLogic.GetInstance().RenewQQHomeYear();
}

private function CallbackMouseClickDailyViewMore(callback : iGUIElement) {
	Enable(PanDailyGift,false);
	Enable(PanPrivilege,true);
	QQHomeLogic.GetInstance().ShowPrivilege();
}

private function CallbackMouseClickPrivilegeEnable(callback : iGUIElement) {
	Enable(PanPrivilege,false);
}

private function CallbackMouseClickOpenYear(callback : iGUIElement) {
	Enable(false);
	
	QQHomeLogic.GetInstance().OpenQQHomeYear();
}

private function CallbackMouseClickOpen(callback : iGUIElement) {
	Enable(false);
	
	QQHomeLogic.GetInstance().OpenQQHome();
}

private function CallbackMouseOverGiftSlot(callback : iGUIElement) {
	if(callback.userData != null) {
		ShowTip(callback,callback.userData);
	}
}

private static var instance : iGUICode_QQHomeUI;
function Awake(){
	instance=this;
	
	RegistEventMsg();
}
static function getInstance(){
	return instance;
}

@HideInInspector
var LabPrivilegeGiftCountThree7 : iGUILabel;
@HideInInspector
var LabPrivilegeGiftNameThree7 : iGUILabel;
@HideInInspector
var ImgPrivilegeGiftThree7 : iGUIImage;
@HideInInspector
var LabPrivilegeGiftCountTwo7 : iGUILabel;
@HideInInspector
var LabPrivilegeGiftNameTwo7 : iGUILabel;
@HideInInspector
var ImgPrivilegeGiftTwo7 : iGUIImage;
@HideInInspector
var LabPrivilegeGiftCountOne7 : iGUILabel;
@HideInInspector
var LabPrivilegeGiftNameOne7 : iGUILabel;
@HideInInspector
var ImgPrivilegeGiftOne7 : iGUIImage;
@HideInInspector
var ImgPrivilegeLevel7 : iGUIImage;
@HideInInspector
var ConPrivilegeLevel7 : iGUIContainer;
@HideInInspector
var LabPrivilegeGiftCountThree6 : iGUILabel;
@HideInInspector
var LabPrivilegeGiftNameThree6 : iGUILabel;
@HideInInspector
var ImgPrivilegeGiftThree6 : iGUIImage;
@HideInInspector
var LabPrivilegeGiftCountTwo6 : iGUILabel;
@HideInInspector
var LabPrivilegeGiftNameTwo6 : iGUILabel;
@HideInInspector
var ImgPrivilegeGiftTwo6 : iGUIImage;
@HideInInspector
var LabPrivilegeGiftCountOne6 : iGUILabel;
@HideInInspector
var LabPrivilegeGiftNameOne6 : iGUILabel;
@HideInInspector
var ImgPrivilegeGiftOne6 : iGUIImage;
@HideInInspector
var ImgPrivilegeLevel6 : iGUIImage;
@HideInInspector
var ConPrivilegeLevel6 : iGUIContainer;
@HideInInspector
var LabPrivilegeGiftCountThree5 : iGUILabel;
@HideInInspector
var LabPrivilegeGiftNameThree5 : iGUILabel;
@HideInInspector
var ImgPrivilegeGiftThree5 : iGUIImage;
@HideInInspector
var LabPrivilegeGiftCountTwo5 : iGUILabel;
@HideInInspector
var LabPrivilegeGiftNameTwo5 : iGUILabel;
@HideInInspector
var ImgPrivilegeGiftTwo5 : iGUIImage;
@HideInInspector
var LabPrivilegeGiftCountOne5 : iGUILabel;
@HideInInspector
var LabPrivilegeGiftNameOne5 : iGUILabel;
@HideInInspector
var ImgPrivilegeGiftOne5 : iGUIImage;
@HideInInspector
var ImgPrivilegeLevel5 : iGUIImage;
@HideInInspector
var ConPrivilegeLevel5 : iGUIContainer;
@HideInInspector
var LabPrivilegeGiftCountThree4 : iGUILabel;
@HideInInspector
var LabPrivilegeGiftNameThree4 : iGUILabel;
@HideInInspector
var ImgPrivilegeGiftThree4 : iGUIImage;
@HideInInspector
var LabPrivilegeGiftCountTwo4 : iGUILabel;
@HideInInspector
var LabPrivilegeGiftNameTwo4 : iGUILabel;
@HideInInspector
var ImgPrivilegeGiftTwo4 : iGUIImage;
@HideInInspector
var LabPrivilegeGiftCountOne4 : iGUILabel;
@HideInInspector
var LabPrivilegeGiftNameOne4 : iGUILabel;
@HideInInspector
var ImgPrivilegeGiftOne4 : iGUIImage;
@HideInInspector
var ImgPrivilegeLevel4 : iGUIImage;
@HideInInspector
var ConPrivilegeLevel4 : iGUIContainer;
@HideInInspector
var LabPrivilegeGiftCountThree3 : iGUILabel;
@HideInInspector
var LabPrivilegeGiftNameThree3 : iGUILabel;
@HideInInspector
var ImgPrivilegeGiftThree3 : iGUIImage;
@HideInInspector
var LabPrivilegeGiftCountTwo3 : iGUILabel;
@HideInInspector
var LabPrivilegeGiftNameTwo3 : iGUILabel;
@HideInInspector
var ImgPrivilegeGiftTwo3 : iGUIImage;
@HideInInspector
var LabPrivilegeGiftCountOne3 : iGUILabel;
@HideInInspector
var LabPrivilegeGiftNameOne3 : iGUILabel;
@HideInInspector
var ImgPrivilegeGiftOne3 : iGUIImage;
@HideInInspector
var ImgPrivilegeLevel3 : iGUIImage;
@HideInInspector
var ConPrivilegeLevel3 : iGUIContainer;
@HideInInspector
var LabPrivilegeGiftCountThree2 : iGUILabel;
@HideInInspector
var LabPrivilegeGiftNameThree2 : iGUILabel;
@HideInInspector
var ImgPrivilegeGiftThree2 : iGUIImage;
@HideInInspector
var LabPrivilegeGiftCountTwo2 : iGUILabel;
@HideInInspector
var LabPrivilegeGiftNameTwo2 : iGUILabel;
@HideInInspector
var ImgPrivilegeGiftTwo2 : iGUIImage;
@HideInInspector
var LabPrivilegeGiftCountOne2 : iGUILabel;
@HideInInspector
var LabPrivilegeGiftNameOne2 : iGUILabel;
@HideInInspector
var ImgPrivilegeGiftOne2 : iGUIImage;
@HideInInspector
var ImgPrivilegeLevel2 : iGUIImage;
@HideInInspector
var ConPrivilegeLevel2 : iGUIContainer;
@HideInInspector
var LabPrivilegeGiftCountThree1 : iGUILabel;
@HideInInspector
var LabPrivilegeGiftNameThree1 : iGUILabel;
@HideInInspector
var ImgPrivilegeGiftThree1 : iGUIImage;
@HideInInspector
var LabPrivilegeGiftCountTwo1 : iGUILabel;
@HideInInspector
var LabPrivilegeGiftNameTwo1 : iGUILabel;
@HideInInspector
var ImgPrivilegeGiftTwo1 : iGUIImage;
@HideInInspector
var LabPrivilegeGiftCountOne1 : iGUILabel;
@HideInInspector
var LabPrivilegeGiftNameOne1 : iGUILabel;
@HideInInspector
var ImgPrivilegeGiftOne1 : iGUIImage;
@HideInInspector
var ImgPrivilegeLevel1 : iGUIImage;
@HideInInspector
var ConPrivilegeLevel1 : iGUIContainer;
@HideInInspector
var LabPrivilegeYearGiftName : iGUILabel;
@HideInInspector
var LabPrivilegeYearGiftCount : iGUILabel;
@HideInInspector
var ImgPrivilegeYearGift : iGUIImage;
@HideInInspector
var BtnPrivilegeRenewYear : iGUIButton;
@HideInInspector
var BtnPrivilegeOpenYear : iGUIButton;
@HideInInspector
var BtnPrivilegeOpen : iGUIButton;
@HideInInspector
var BtnPrivilegeRenew : iGUIButton;
@HideInInspector
var BtnPrivilegeClose : iGUIButton;
@HideInInspector
var PanPrivilege : iGUIPanel;

@HideInInspector
var ImgDailyNextBG : iGUIImage;
@HideInInspector
var ImgYearDailyGiftBG : iGUIImage;
@HideInInspector
var ImgDailyYearGiftLock : iGUIImage;
@HideInInspector
var ImgDailyLevelNext : iGUIImage;
@HideInInspector
var LabDailyGiftCountNext3 : iGUILabel;
@HideInInspector
var ImgDailyGiftNext3 : iGUIImage;
@HideInInspector
var LabDailyGiftCountNext2 : iGUILabel;
@HideInInspector
var ImgDailyGiftNext2 : iGUIImage;
@HideInInspector
var LabDailyGiftCountNext1 : iGUILabel;
@HideInInspector
var ImgDailyGiftNext1 : iGUIImage;
@HideInInspector
var ImgDailyLevel : iGUIImage;
@HideInInspector
var BtnDailyYearOpen : iGUIButton;
@HideInInspector
var BtnDailyYearRenew : iGUIButton;
@HideInInspector
var BtnDailyRenew : iGUIButton;
@HideInInspector
var LabYearDailyGiftName : iGUILabel;
@HideInInspector
var LabYearDailyGiftCount : iGUILabel;
@HideInInspector
var ImgYearDailyGift : iGUIImage;
@HideInInspector
var LabDailyGiftName3 : iGUILabel;
@HideInInspector
var LabDailyGiftCount3 : iGUILabel;
@HideInInspector
var ImgDailyGift3 : iGUIImage;
@HideInInspector
var LabDailyGiftName2 : iGUILabel;
@HideInInspector
var LabDailyGiftCount2 : iGUILabel;
@HideInInspector
var ImgDailyGift2 : iGUIImage;
@HideInInspector
var LabDailyGiftName1 : iGUILabel;
@HideInInspector
var LabDailyGiftCount1 : iGUILabel;
@HideInInspector
var ImgDailyGift1 : iGUIImage;
@HideInInspector
var BtnDailyViewMore : iGUIButton;
@HideInInspector
var BtnDailyGet : iGUIButton;
@HideInInspector
var BtnDailyClose : iGUIButton;
@HideInInspector
var PanDailyGift : iGUIPanel;


@HideInInspector
var ImgNewerBG : iGUIImage;
@HideInInspector
var ImgNewerLock1 : iGUIImage;
@HideInInspector
var ImgNewerLock2 : iGUIImage;
@HideInInspector
var ImgNewerLock3 : iGUIImage;
@HideInInspector
var ImgNewerLock4 : iGUIImage;
@HideInInspector
var LabNewerGiftName4 : iGUILabel;
@HideInInspector
var LabNewerGiftName3 : iGUILabel;
@HideInInspector
var LabNewerGiftName2 : iGUILabel;
@HideInInspector
var LabNewerGiftName1 : iGUILabel;
@HideInInspector
var LabNewerGiftCount4 : iGUILabel;
@HideInInspector
var LabNewerGiftCount3 : iGUILabel;
@HideInInspector
var LabNewerGiftCount2 : iGUILabel;
@HideInInspector
var LabNewerGiftCount1 : iGUILabel;
@HideInInspector
var ImgNewerGift4 : iGUIImage;
@HideInInspector
var ImgNewerGift3 : iGUIImage;
@HideInInspector
var ImgNewerGift2 : iGUIImage;
@HideInInspector
var ImgNewerGift1 : iGUIImage;
@HideInInspector
var BtnNewerGiftRenew : iGUIButton;
@HideInInspector
var BtnNewerGiftOpen : iGUIButton;
@HideInInspector
var BtnNewerGiftGet : iGUIButton;
@HideInInspector
var BtnNewerGiftKown : iGUIButton;
@HideInInspector
var BtnNewerGiftClose : iGUIButton;
@HideInInspector
var PanNewerGift : iGUIPanel;
@HideInInspector
var root1 : iGUIRoot;