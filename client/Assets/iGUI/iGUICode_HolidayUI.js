#pragma strict
#pragma downcast

import iGUI;

class HolidayIcon {
	public var data : int;					// item id
	public var asynIcon : AsynIcon = null;	// asyn icon manager
	public var iconSlot : iGUIImage;		// icon slot ui
	
	public function CallbackIconLoad(tex : Texture) {
		iconSlot.image = tex;
	}
}

class HolidaySlotIcon extends PlatResInfoCtrl {
	public var nameElement : iGUILabel;
	public var qqhzElement : iGUIImage;
	public var qqhzYearElement : iGUIImage;
	
	//overwrite
	public function Callback() {
		nameElement.userData = info.nickname;
		nameElement.label.text = Global.limitTextLength(info.nickname, 4, Define.unknow, "...");
		
		/*
		if(info.is_yellow_vip == 0 && info.is_yellow_year_vip == 0) {
			qqhzElement.image = null;
			qqhzElement.setEnabled(false);
			qqhzYearElement.setEnabled(false);
		} else if(info.is_yellow_vip != 0 && info.is_yellow_year_vip == 0){
			qqhzElement.image = Resources.Load("UISkins/Textures/hz/hz_lv"+info.yellow_vip_level.ToString());
			qqhzElement.setEnabled(true);
			qqhzYearElement.setEnabled(false);
		} else if(info.is_yellow_year_vip != 0){
			qqhzElement.image = Resources.Load("UISkins/Textures/hz/hz_lv"+info.yellow_vip_level.ToString());
			qqhzElement.setEnabled(true);
			qqhzYearElement.setEnabled(true);
		} else {
			Debug.Log("do nothing--unknown qqhometype!!");
		}
		*/
	}
}

private var mTimer:Timer = null;							//Timer
private var mInterval:float = 200f;							//show time interval
private var mTotalCount:int = 20;							//show total time

private var mAwardsList : ArrayList = new ArrayList();		//struct iGUIImage
private var mShowIdx : int = 0;

private var mBRefresh : boolean = false;

private var bgAsynIcon : AsynIcon = null;

function Start() {
	Init();
}

function Init() {
	mAwardsList.Add(ImgAward1);
	mAwardsList.Add(ImgAward2);
	mAwardsList.Add(ImgAward3);
	mAwardsList.Add(ImgAward4);
	mAwardsList.Add(ImgAward5);
	mAwardsList.Add(ImgAward6);
	mAwardsList.Add(ImgAward7);
	mAwardsList.Add(ImgAward8);
	
	BtnClose.clickCallback = CallbackMouseClickClose;
	BtnRuleClose.clickCallback = CallbackMouseClickRuleClose;
	BtnRoleInfo.clickCallback = CallbackMouseClickRule;
	BtnBuyFruit.clickCallback = CallbackMouseClickBuyFruit;
	BtnAward.clickCallback = CallbackMouseClickLottery;
	
	ImgAward1.mouseOverCallback = CallbackMouseOverSlot;
	ImgAward2.mouseOverCallback = CallbackMouseOverSlot;
	ImgAward3.mouseOverCallback = CallbackMouseOverSlot;
	ImgAward4.mouseOverCallback = CallbackMouseOverSlot;
	ImgAward5.mouseOverCallback = CallbackMouseOverSlot;
	ImgAward6.mouseOverCallback = CallbackMouseOverSlot;
	ImgAward7.mouseOverCallback = CallbackMouseOverSlot;
	ImgAward8.mouseOverCallback = CallbackMouseOverSlot;
	//ImgResult.mouseOverCallback = CallbackMouseOverSlot;
	
	ImgItem1.mouseOverCallback = CallbackMouseOverSlot;
	ImgItem2.mouseOverCallback = CallbackMouseOverSlot;
	ImgItem3.mouseOverCallback = CallbackMouseOverSlot;
	ImgItem4.mouseOverCallback = CallbackMouseOverSlot;
	ImgItem5.mouseOverCallback = CallbackMouseOverSlot;
	ImgItem6.mouseOverCallback = CallbackMouseOverSlot;
	ImgItem7.mouseOverCallback = CallbackMouseOverSlot;
	ImgItem8.mouseOverCallback = CallbackMouseOverSlot;
	ImgItem9.mouseOverCallback = CallbackMouseOverSlot;
	ImgItem10.mouseOverCallback = CallbackMouseOverSlot;
	
	LabName1.mouseOverCallback = CallbackMouseOverName;
	LabName2.mouseOverCallback = CallbackMouseOverName;
	LabName3.mouseOverCallback = CallbackMouseOverName;
	LabName4.mouseOverCallback = CallbackMouseOverName;
	LabName5.mouseOverCallback = CallbackMouseOverName;
	LabName6.mouseOverCallback = CallbackMouseOverName;
	LabName7.mouseOverCallback = CallbackMouseOverName;
	LabName8.mouseOverCallback = CallbackMouseOverName;
	LabName9.mouseOverCallback = CallbackMouseOverName;
	LabName10.mouseOverCallback = CallbackMouseOverName;
	
	bgAsynIcon =  new AsynIcon(CallbackBGIcon, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	bgAsynIcon.load("UI/77_01.png.u3d");
	
	mInterval = HolidayLogic.GetInstance().GetInteral();
}

private function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOLIDAY_LOTTERY_ENABLE), HandleNotifyEnable);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOLIDAY_LOTTERY_AWARD_REFRESH), HandleNotifyRefreshAward);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOLIDAY_LOTTERY_BOARD_REFRESH), HandleNotifyRefreshBoard);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOLIDAY_LOTTERY_RESULT_UI), HandleNotifyLotteryResult);
}

//game event
private function HandleNotifyEnable(evt:GameEvent, obj:System.Object) {
	Enable(obj);
	
	if(obj == true) {
		var data : int = HolidayLogic.GetInstance().GetLotterySpecial();
		SetHouseIcon(ImgResult,data);
		
		var awards : ArrayList = HolidayLogic.GetInstance().GetAwards();
		var idx : int = 0;
		for(var award : LotteryItemData in awards) {
			SetAwardsElement(idx,award);
			idx++;
		}
	}
}

private function HandleNotifyRefreshAward(evt:GameEvent, obj:System.Object) {
	var awards : ArrayList = obj as ArrayList;
	var idx : int = 0;
	for(var award : LotteryItemData in awards) {
		SetElement(idx,award);
		idx++;
	}
	
	var times : int = HolidayLogic.GetInstance().GetRemainTimes();
	LabFruitNum.label.text = times.ToString();
	
	if(times < 10) {
		BtnAward.passive = true;
	} else {
		BtnAward.passive = false;
	}
	
	ImgSelect.setEnabled(false);
	SetLotteryStatus(false);
}

private function HandleNotifyRefreshBoard(evt:GameEvent, obj:System.Object) {
	var boardList : ArrayList = obj as ArrayList;
	var idx : int = 0;
	
	for(var element : iGUIElement in ConBoard.items) {
		element.setEnabled(false);
	}
	
	for(var award : ScoreBoard in boardList) {
		SetBoardElement(idx,award);
		idx++;
	}
	
	var score : int = HolidayLogic.GetInstance().GetScore();
	var rank : int = HolidayLogic.GetInstance().GetRank();
	
	LabSelfScore.label.text = score.ToString();
	LabSelfRank.label.text = score.ToString();
}

private function HandleNotifyLotteryResult(evt:GameEvent, obj:System.Object) {
	SetResultAward(obj);
	
	var times : int = HolidayLogic.GetInstance().GetRemainTimes();
	LabFruitNum.label.text = times.ToString();
	
	BtnAward.passive = false;
	SetLotteryStatus(true);
	
	DestroyTimer();
}

//logic function for extern
public function Enable(enable : boolean) {
	UI.getUI().EnableUIRoot("HolidayUI",enable);
	UI.getUI().SetModal("HolidayUI", enable);
	
	PanMain.setEnabled(true);
	PanRule.setEnabled(false);
	
	SetLotteryStatus(false);
	BtnAward.passive = false;
}

//logic function for internal
private function ShowTip(element : iGUIElement,item_id : int) {
	if(item_id == 0) return ;
	
	ItemHint.ShowPackItemHint(element, ResManager.LgtMgr.getItemRow(item_id), false);
}

private function SetResultAward(idx : int) {
	var image : iGUIImage = mAwardsList[idx] as iGUIImage;
	ImgSelect.setX(image.positionAndSize.x);
	ImgSelect.setY(image.positionAndSize.y);
	
	mShowIdx = Random.Range(0,mAwardsList.Count-1);
}

private function SetLotteryStatus(bRefresh : boolean) {
	mBRefresh = bRefresh;
	
	if(bRefresh) {
		BtnAward.style.normal.background = Resources.Load("UISkins/Textures/lottery/btn_lottery_refresh_normal");
		BtnAward.style.hover.background = Resources.Load("UISkins/Textures/lottery/btn_lottery_refresh_hover");
		BtnAward.style.active.background = Resources.Load("UISkins/Textures/lottery/btn_lottery_refresh_push");
	} else {
		BtnAward.style.normal.background = Resources.Load("UISkins/Textures/lottery/btn_lottery_normal");
		BtnAward.style.hover.background = Resources.Load("UISkins/Textures/lottery/btn_lottery_hover");
		BtnAward.style.active.background = Resources.Load("UISkins/Textures/lottery/btn_lottery_push");
	}
}

private function SetElement(idx : int, data : LotteryItemData) {
	switch(idx) {
		case 0:
			SetElementData(ImgAward1,LabAward1,data);
			break;
		case 1:
			SetElementData(ImgAward2,LabAward2,data);
			break;
		case 2:
			SetElementData(ImgAward3,LabAward3,data);
			break;
		case 3:
			SetElementData(ImgAward4,LabAward4,data);
			break;
		case 4:
			SetElementData(ImgAward5,LabAward5,data);
			break;
		case 5:
			SetElementData(ImgAward6,LabAward6,data);
			break;
		case 6:
			SetElementData(ImgAward7,LabAward7,data);
			break;
		case 7:
			SetElementData(ImgAward8,LabAward8,data);
			break;
	}
}

private function SetAwardsElement(idx : int, data : LotteryItemData) {
	switch(idx) {
		case 0:
			SetElementData(ImgItem2,null,data);
			break;
		case 1:
			SetElementData(ImgItem3,null,data);
			break;
		case 2:
			SetElementData(ImgItem4,null,data);
			break;
		case 3:
			SetElementData(ImgItem5,null,data);
			break;
		case 4:
			SetElementData(ImgItem6,null,data);
			break;
		case 5:
			SetElementData(ImgItem7,null,data);
			break;
		case 6:
			SetElementData(ImgItem8,null,data);
			break;
		case 7:
			SetElementData(ImgItem9,null,data);
			break;
		case 8:
			SetElementData(ImgItem10,null,data);
			break;
	}
}

private function SetElementData(imgElement : iGUIImage, labElement : iGUILabel, data : LotteryItemData) {
	if(labElement != null) {
		if(data.count == 0) {
			labElement.label.text = "";
		} else {
			labElement.label.text = data.count.ToString();
		}
	}
	
	var row : ItemRow = ResManager.LgtMgr.getItemRow(data.id);
	imgElement.setEnabled(true);
	
	var icon : HolidayIcon = new HolidayIcon();
	icon.data = data.id;
	icon.iconSlot = imgElement;
	icon.asynIcon = new AsynIcon(icon.CallbackIconLoad, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	icon.asynIcon.load("Icon/" + row.icon);
	imgElement.userData = data.id;
}

private function SetBoardElement(idx : int, data : ScoreBoard) {
	switch(idx) {
		case 0:
			SetBoardElementData(ConRank1,LabName1,LabScore1,data);
			break;
		case 1:
			SetBoardElementData(ConRank2,LabName2,LabScore2,data);
			break;
		case 2:
			SetBoardElementData(ConRank3,LabName3,LabScore3,data);
			break;
		case 3:
			SetBoardElementData(ConRank4,LabName4,LabScore4,data);
			break;
		case 4:
			SetBoardElementData(ConRank5,LabName5,LabScore5,data);
			break;
		case 5:
			SetBoardElementData(ConRank6,LabName6,LabScore6,data);
			break;
		case 6:
			SetBoardElementData(ConRank7,LabName7,LabScore7,data);
			break;
		case 7:
			SetBoardElementData(ConRank8,LabName8,LabScore8,data);
			break;
		case 8:
			SetBoardElementData(ConRank9,LabName9,LabScore9,data);
			break;
		case 9:
			SetBoardElementData(ConRank10,LabName10,LabScore10,data);
			break;
	}
}

private function SetBoardElementData(element : iGUIContainer, name : iGUILabel, score : iGUILabel, data : ScoreBoard) {
	element.setEnabled(true);
	score.label.text = data.score.ToString();
	
	var slot : HolidaySlotIcon = new HolidaySlotIcon();
	slot.account = data.account;
	slot.nameElement = name;
	Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(data.account,slot);
}

private function SetHouseIcon(imgElement : iGUIImage,id : int) {
	var row : PlayerHouseRow = ResManager.LgtMgr.PlayerHouseTable[id] as PlayerHouseRow;
	if(row == null) return ;

	var icon : HolidayIcon = new HolidayIcon();
	icon.data = id;
	icon.iconSlot = imgElement;
	icon.asynIcon = new AsynIcon(icon.CallbackIconLoad, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	icon.asynIcon.load("Icon/" + row.big_icon);
	imgElement.userData = id;
}

private function StartShowTimer() {
	if(mTimer != null) {
		mTimer.Reset();
		mTimer = null;
	}
	mTimer = new Timer(mInterval,mTotalCount);
	mTimer.addEventListener(TimerEvent.TIMER,CallbackTimerTrigger);
	mTimer.addEventListener(TimerEvent.TIMER_COMPLETE,CallbackTimerStop);
	mTimer.Start();
}

private function DestroyTimer() {
	if(mTimer != null) {
		mTimer.Reset();
		mTimer = null;
	}
}

//callback
private function CallbackMouseClickClose(callback : iGUIElement) {
	Enable(false);
}

private function CallbackMouseClickRuleClose(callback : iGUIElement) {
	PanRule.setEnabled(false);
	PanMain.setEnabled(true);
}

private function CallbackMouseClickRule(callback : iGUIElement) {
	PanMain.setEnabled(false);
	PanRule.setEnabled(true);
}

private function CallbackMouseClickBuyFruit(callback : iGUIElement) {
	HolidayLogic.GetInstance().BuyLoveFruit();
}

private function CallbackMouseClickLottery(callback : iGUIElement) {
	if(mBRefresh) {
		HolidayLogic.GetInstance().RefreshAwards();
	} else {
		var times : int = HolidayLogic.GetInstance().GetRemainTimes();
		if(times < 10) {
			Global.GetSysMsgHandler().ShowSysMsg(471);
		} else {
			StartShowTimer();
			callback.passive = true;
			var image : iGUIImage = mAwardsList[0] as iGUIImage;
			ImgSelect.setX(image.positionAndSize.x);
			ImgSelect.setY(image.positionAndSize.y);
			ImgSelect.setEnabled(true);
		}
	}
}

private function CallbackMouseOverSlot(callback : iGUIElement) {
	if(callback.userData != null) {
		ShowTip(callback,callback.userData);
	}
}

private function CallbackMouseOverName(callback : iGUIElement) {
	if(callback.userData != null) {
		var style : GUIStyle = new GUIStyle(); 	
		style.normal.textColor = Color.white;
		style.fontStyle = FontStyle.Bold;
		Global.SysTooltip.Begin(callback);
		Global.SysTooltip.Add(GUIContent(callback.userData as String), style); 	
		Global.SysTooltip.Show(true);
	}
}

private function CallbackTimerTrigger() {
	var image : iGUIImage = mAwardsList[mShowIdx] as iGUIImage;
	ImgSelect.setX(image.positionAndSize.x);
	ImgSelect.setY(image.positionAndSize.y);	
	mShowIdx++;
	if(mShowIdx >= mAwardsList.Count) {
		mShowIdx = 0;
	}
}

private function CallbackTimerStop() {
	HolidayLogic.GetInstance().Lottery();
}

private function CallbackBGIcon(tex:Texture) {
	PanMain.style.normal.background = tex;
}


private static var instance : iGUICode_HolidayUI;
function Awake(){
	instance=this;
	
	RegistEventMsg();
}
static function getInstance(){
	return instance;
}
@HideInInspector
var ImgSelect : iGUIImage;
@HideInInspector
var BtnRuleClose : iGUIButton;
@HideInInspector
var PanRule : iGUIPanel;
@HideInInspector
var ImgItem10 : iGUIImage;
@HideInInspector
var LabScore10 : iGUILabel;
@HideInInspector
var ImgQQHZYear10 : iGUIImage;
@HideInInspector
var ImgQQHZ10 : iGUIImage;
@HideInInspector
var LabName10 : iGUILabel;
@HideInInspector
var ConRank10 : iGUIContainer;
@HideInInspector
var ImgItem9 : iGUIImage;
@HideInInspector
var LabScore9 : iGUILabel;
@HideInInspector
var ImgQQHZYear9 : iGUIImage;
@HideInInspector
var ImgQQHZ9 : iGUIImage;
@HideInInspector
var LabName9 : iGUILabel;
@HideInInspector
var ConRank9 : iGUIContainer;
@HideInInspector
var ImgItem8 : iGUIImage;
@HideInInspector
var LabScore8 : iGUILabel;
@HideInInspector
var ImgQQHZYear8 : iGUIImage;
@HideInInspector
var ImgQQHZ8 : iGUIImage;
@HideInInspector
var LabName8 : iGUILabel;
@HideInInspector
var ConRank8 : iGUIContainer;
@HideInInspector
var ImgItem7 : iGUIImage;
@HideInInspector
var LabScore7 : iGUILabel;
@HideInInspector
var ImgQQHZYear7 : iGUIImage;
@HideInInspector
var ImgQQHZ7 : iGUIImage;
@HideInInspector
var LabName7 : iGUILabel;
@HideInInspector
var ConRank7 : iGUIContainer;
@HideInInspector
var ImgItem6 : iGUIImage;
@HideInInspector
var LabScore6 : iGUILabel;
@HideInInspector
var ImgQQHZYear6 : iGUIImage;
@HideInInspector
var ImgQQHZ6 : iGUIImage;
@HideInInspector
var LabName6 : iGUILabel;
@HideInInspector
var ConRank6 : iGUIContainer;
@HideInInspector
var ImgItem5 : iGUIImage;
@HideInInspector
var LabScore5 : iGUILabel;
@HideInInspector
var ImgQQHZYear5 : iGUIImage;
@HideInInspector
var ImgQQHZ5 : iGUIImage;
@HideInInspector
var LabName5 : iGUILabel;
@HideInInspector
var ConRank5 : iGUIContainer;
@HideInInspector
var ImgItem4 : iGUIImage;
@HideInInspector
var LabScore4 : iGUILabel;
@HideInInspector
var ImgQQHZYear4 : iGUIImage;
@HideInInspector
var ImgQQHZ4 : iGUIImage;
@HideInInspector
var LabName4 : iGUILabel;
@HideInInspector
var ConRank4 : iGUIContainer;
@HideInInspector
var ImgItem3 : iGUIImage;
@HideInInspector
var LabScore3 : iGUILabel;
@HideInInspector
var ImgQQHZYear3 : iGUIImage;
@HideInInspector
var ImgQQHZ3 : iGUIImage;
@HideInInspector
var LabName3 : iGUILabel;
@HideInInspector
var ConRank3 : iGUIContainer;
@HideInInspector
var ImgItem2 : iGUIImage;
@HideInInspector
var LabScore2 : iGUILabel;
@HideInInspector
var ImgQQHZYear2 : iGUIImage;
@HideInInspector
var ImgQQHZ2 : iGUIImage;
@HideInInspector
var LabName2 : iGUILabel;
@HideInInspector
var ConRank2 : iGUIContainer;
@HideInInspector
var ImgItem1 : iGUIImage;
@HideInInspector
var LabScore1 : iGUILabel;
@HideInInspector
var ImgQQHZYear1 : iGUIImage;
@HideInInspector
var ImgQQHZ1 : iGUIImage;
@HideInInspector
var LabName1 : iGUILabel;
@HideInInspector
var ConRank1 : iGUIContainer;
@HideInInspector
var LabSelfRank : iGUILabel;
@HideInInspector
var LabSelfScore : iGUILabel;
@HideInInspector
var LabAward8 : iGUILabel;
@HideInInspector
var LabAward7 : iGUILabel;
@HideInInspector
var LabAward6 : iGUILabel;
@HideInInspector
var LabAward5 : iGUILabel;
@HideInInspector
var LabAward4 : iGUILabel;
@HideInInspector
var LabAward3 : iGUILabel;
@HideInInspector
var LabAward2 : iGUILabel;
@HideInInspector
var LabAward1 : iGUILabel;
@HideInInspector
var ImgResult : iGUIImage;
@HideInInspector
var BtnClose : iGUIButton;
@HideInInspector
var BtnBuyFruit : iGUIButton;
@HideInInspector
var LabFruitNum : iGUILabel;
@HideInInspector
var BtnRoleInfo : iGUIButton;
@HideInInspector
var ImgAward8 : iGUIImage;
@HideInInspector
var ImgAward7 : iGUIImage;
@HideInInspector
var ImgAward6 : iGUIImage;
@HideInInspector
var ImgAward5 : iGUIImage;
@HideInInspector
var ImgAward4 : iGUIImage;
@HideInInspector
var ImgAward3 : iGUIImage;
@HideInInspector
var ImgAward2 : iGUIImage;
@HideInInspector
var ImgAward1 : iGUIImage;
@HideInInspector
var BtnAward : iGUIButton;
@HideInInspector
var ConLottery : iGUIContainer;
@HideInInspector
var ConBoard : iGUIContainer;
@HideInInspector
var PanMain : iGUIPanel;
@HideInInspector
var root1 : iGUIRoot;
