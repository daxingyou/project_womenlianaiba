#pragma strict
#pragma downcast

import iGUI;
import System.DateTime;

private static var instance : FlowerOwnerUI;
private var playerSettingMgr : PlayerSettingMgr;
function Awake(){
	instance=this;
	playerSettingMgr = Camera.main.GetComponent("PlayerSettingMgr") as PlayerSettingMgr;
	playerSettingMgr.playMusic("flower");
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.REQUEST_SHOW_FLOWER_DATA), ShowFlowerData);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENABLE_ROCK_AWARD_UI), HandleRefreshRockAwardEnable);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REFRESH_ROCK_AWARD_UI), HandleRefreshRockAward);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_FLOWER_ROCK_RESULT_UI), HandleNotifyRockResult);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_FLOWER_FREE_REMAIN_TIME), HandleNotifyRockRemainTime);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_FLOWER_FREE_INVALID), HandleNotifyRockFreeInvalid);
}

static function getInstance(){
	return instance;
}

@HideInInspector
var LabLRockCount : iGUILabel;
@HideInInspector
var LabLTimeCount : iGUILabel;
@HideInInspector
var LabLAwardMoney : iGUILabel;
@HideInInspector
var BtnLAwardContinue : iGUIButton;
@HideInInspector
var LabRockCount : iGUILabel;
@HideInInspector
var LabTimeCount : iGUILabel;
@HideInInspector
var LabAwardExp : iGUILabel;
@HideInInspector
var LabAwardItem : iGUILabel;
@HideInInspector
var LabAwardMoney : iGUILabel;
@HideInInspector
var BtnAwardClose : iGUIButton;
@HideInInspector
var BtnAwardContinue : iGUIButton;
@HideInInspector
var PanRockAward : iGUIPanel;
@HideInInspector
var LabChooseCount : iGUILabel;
@HideInInspector
var BtnChooseFive : iGUIButton;
@HideInInspector
var BtnChooseOne : iGUIButton;
@HideInInspector
var BtnChooseClose : iGUIButton;
@HideInInspector
var PanRockChoose : iGUIPanel;
@HideInInspector
var BtnRock : iGUIButton;
@HideInInspector
var TimeLabel : iGUILabel;
@HideInInspector
var FlowerLog : iGUIImage;
@HideInInspector
var label1 : iGUILabel;
@HideInInspector
var LevelLabel : iGUILabel;
@HideInInspector
var PickBtn : iGUIButton;
@HideInInspector
var HelpImg : iGUIImage;
@HideInInspector
var CloseImg : iGUIImage;
@HideInInspector
var DecorateImg : iGUIImage;
@HideInInspector
var ToolImg : iGUIImage;
@HideInInspector
var FertilizeImg : iGUIImage;
@HideInInspector
var WaterImg : iGUIImage;
@HideInInspector
var image3 : iGUIImage;
@HideInInspector
var image2 : iGUIImage;
@HideInInspector
var GrowLabel : iGUILabel;
@HideInInspector
var image1 : iGUIImage;
@HideInInspector
var panel1 : iGUIPanel;

private var FruitDateTime:DateTime = Convert.ToDateTime("2011-11-24 17:50:00");
private var mRockFreeCount : int = 0;
private var mRockLoveCount : int = 0;
private var mRockMode : int = 1;
private var mClickBtnLAwardContinue : boolean = false;

function Start() {
	BtnRock.clickCallback = CallbackMouseClickRock;
	BtnChooseClose.clickCallback = CallbackMouseClickChooseClose;
	BtnChooseOne.clickCallback = CallbackMouseClickChooseOne;
	BtnChooseFive.clickCallback = CallbackMouseClickChooseFive;
	BtnAwardContinue.clickCallback = CallbackMouseClickAwardContinue;
	BtnLAwardContinue.clickCallback = CallbackMouseClickAwardContinueLove;
	BtnAwardClose.clickCallback = CallbackMouseClickAwardClose;
	//
	CallbackMouseClickRock(null);
}

function ShowFlowerData(evt:GameEvent, obj:System.Object)
{
	var pack : notify_flower_data = obj as notify_flower_data;
	var time : stime = pack.fruit_time;
	var fowerRow : FlowerRow = FlowerTable.GetInst().Get(pack.id, pack.level);
	FruitDateTime = Convert.ToDateTime(pack.fruit_time.year + "-" + 
					pack.fruit_time.month + "-" + pack.fruit_time.day + " " + 
					pack.fruit_time.hour + ":" + pack.fruit_time.minute + ":" + 
					pack.fruit_time.second);
	GrowLabel.label.text = pack.grow.ToString() + "/" + fowerRow.grow.ToString();
	LevelLabel.label.text = pack.level.ToString();
}

function Update()
{
	var dt1:DateTime = SysTimer.getCurTime();
	var ts:TimeSpan = FruitDateTime - dt1;
	if(ts.Days <= 0 && ts.Hours <= 0 && ts.Minutes <= 0 && ts.Seconds <= 0)
	{
		TimeLabel.enabled = false;
		PickBtn.enabled = true;
	}
	else
	{
		TimeLabel.enabled = true;
		PickBtn.enabled = false;
		var day : String = ts.Days.ToString();
		var hour : String = ts.Hours.ToString();
		var minute : String = ts.Minutes.ToString();
		var seconds : String = ts.Seconds.ToString();
		TimeLabel.label.text = Define.getContent(5127, [day, hour, minute, seconds]);
	}
	
	TimeLabel.enabled = false;
	PickBtn.enabled = false;
}

function OnDestroy () {
    EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.REQUEST_SHOW_FLOWER_DATA), ShowFlowerData);
}



function WaterImg_Click(caller : iGUIImage){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.REQUEST_WATER));
}

function ToolBg_Click(caller : iGUIImage){
	
}

function CloseImg_Click(caller : iGUIImage){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.REQUEST_FLOWER_CLOSE));
	UI.getUI().CloseUIRoot("FlowerOwnerUI");
	playerSettingMgr.playMusic("main");
}

function HelpImg_Click(caller : iGUIImage){
	UI.getUI().OpenUIRoot("FlowerHelp");
}

function PickBtn_Click(caller : iGUIButton){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.REQUEST_PICK_FRUIT));
}

function FlowerLog_Click(caller : iGUIImage){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.REQUEST_FLOWER_LOG));
	//UI.getUI().OpenUIRoot("FlowerLog");
}

function ToolImg_Click(caller : iGUIImage){
	Global.GetSysMsgHandler().ShowSysMsg(242);
}

function FertilizeImg_Click(caller : iGUIImage){
	Global.GetSysMsgHandler().ShowSysMsg(242);
}

function DecorateImg_Click(caller : iGUIImage){
	Global.GetSysMsgHandler().ShowSysMsg(242);
}

private function EnableChoose(enable : boolean) {
	PanRockChoose.setEnabled(enable);
}

private function EnableAward(enable : boolean) {
	PanRockAward.setEnabled(enable);
	
	//EnableChoose(!enable);
}

private function OnRockFail() {
	Global.GetSysMsgHandler().ShowSysMsg(10036);
}

private function OnRockSuccess() {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REQUEST_FLOWER_ROCK),mRockMode);
}

private function OnRockLoveSuccess() {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REQUEST_FLOWER_LOVE_ROCK));
}

private function HandleRefreshRockAwardEnable(evt:GameEvent, obj:Object) {
	EnableAward(obj);
}

private function HandleRefreshRockAward(evt:GameEvent, obj:Object) {
	var data : FlowerRockInfo = obj as FlowerRockInfo;
	
	LabRockCount.label.text = (Flower.mFreeLimitCount-data.freeCount).ToString();
	LabLRockCount.label.text = (Flower.mLoveLimitCount-data.loveCount).ToString();
	
	BtnLAwardContinue.passive = false;
	if(Flower.mFreeLimitCount-data.freeCount == 0) {
		BtnAwardContinue.passive = true;
	} else {
		BtnAwardContinue.passive = false;
	}
	if(Flower.mLoveLimitCount-data.loveCount == 0) {
		BtnLAwardContinue.passive = true;
	} else {
		BtnLAwardContinue.passive = false;
	}
	
	var award : FlowerFreeRockAward = Flower.GetFreeRockAwardData(data.freeCount+1);
	var level : int = Flower.GetCurLevel();
	if(award != null) {
		LabAwardMoney.label.text = (award.diamond + 150* level).ToString();
	}
	
	var loveAward : FlowerRockAward = Flower.GetRockAwardData(data.loveCount+1);
	if(loveAward != null) {
		LabLAwardMoney.label.text = loveAward.diamond.ToString();
		LabLTimeCount.label.text = loveAward.love_coin.ToString();
	}
	
	if (mClickBtnLAwardContinue) {
		mClickBtnLAwardContinue = false;
		loveAward = Flower.GetRockAwardData(data.loveCount);	// 这边要获取当前的数据,所以次数不能+1,
		if (null != loveAward && 0 != loveAward.item_id){
			var count : String = loveAward.item_count.ToString();
			var name : String = ResManager.LgtMgr.getItemRow(loveAward.item_id).name;
			UI.getUI().OpenMsgbox("", Define.getContent(570, [count, name]), true);
		}
	}
}

private function HandleNotifyRockResult(evt:GameEvent, obj:Object) {
	var data : notify_flower_shake = obj as notify_flower_shake;
	
	mRockFreeCount = data.free_shake;
	
	LabChooseCount.label.text = data.free_shake.ToString();
	LabAwardMoney.label.text = data.diamond.ToString();
	LabAwardExp.label.text = data.exp.ToString();
	
	var itemStr : String = "";
	for(var item in data.items) {
		var info : lottery_item = item as lottery_item;
		var row : ItemRow = ResManager.LgtMgr.getItemRow(info.item_id);
		itemStr = itemStr + row.name + "X" + info.item_count.ToString();
	}
	LabAwardItem.label.text = itemStr;
	
	EnableAward(true);
	BtnAwardContinue.passive = false;
}

private function HandleNotifyRockRemainTime(evt:GameEvent, obj:Object) {
	var time : int = obj;
	var minuter : int = Mathf.CeilToInt(time/60);
	var second : int = time - minuter*60;
	LabTimeCount.label.text = minuter.ToString() + ":" + second.ToString();
	
	BtnAwardContinue.passive = true;
}

private function HandleNotifyRockFreeInvalid(evt:GameEvent, obj:Object) {
	BtnAwardContinue.passive = false;
}

//callback
private function CallbackMouseClickRock(callback : iGUIElement) {
	//EnableAward(true);
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REQUEST_FLOWER_FREE_COUNT));
}

private function CallbackMouseClickChooseClose(callback : iGUIElement) {
	EnableChoose(false);
}

private function CallbackMouseClickChooseOne(callback : iGUIElement) {
	mRockMode = 1;
	OnRockSuccess();
}

private function CallbackMouseClickChooseFive(callback : iGUIElement) {
	mRockMode = 5;	
	OnRockSuccess();
}

private function CallbackMouseClickAwardContinue(callback : iGUIElement) {
	BtnAwardContinue.passive = true;
	OnRockSuccess();
}

private function CallbackMouseClickAwardContinueLove(callback : iGUIElement) {
	mClickBtnLAwardContinue = true;
	BtnLAwardContinue.passive = true;
	OnRockLoveSuccess();
}

private function CallbackMouseClickAwardClose(callback : iGUIElement) {
	EnableAward(false);
}

public function GetRockMode() : int {
	return mRockMode;
}

public function GetRockFreeCount() : int {
	return mRockFreeCount;
}

public function SetPassive(bPassive : boolean) {
	BtnAwardContinue.passive = bPassive;
	BtnLAwardContinue.passive = bPassive;
} 