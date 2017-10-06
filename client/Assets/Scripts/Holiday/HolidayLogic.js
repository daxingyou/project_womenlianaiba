#pragma strict
#pragma downcast
/*
//player HolidayLogic manager
//creat by fullzhu 2012.8.9
//last edit at 2012.8.9 by fullzhu
*/
class ScoreBoard {
	public var account : String;
	public var score : int;
}

class LotteryItemData {
	public var id : int = 0;
	public var count : int = 0;
}

public var mInterval:float = 200f;								//show time interval
public var mHighestAward : int = 120200;						//highest award house id
public var mAwards : int[];

private var mRemainTimes : int = 0;
private var mScore : int = 0;
private var mRank : int = 0;

private static var instance : HolidayLogic;
function Awake(){
	instance=this;
	
	RegistEventMsg();
}
static function GetInstance(){
	return instance;
}

function Start () {
}

//game event regist()
function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOLIDAY_LOTTERY_ACTIVE), HandleNotifyHolidayLotteryActive);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOLIDAY_LOTTERY_INIT), HandleNotifyHolidayLotteryInit);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOLIDAY_LOTTERY_RESULT), HandleNotifyHolidayLotteryResult);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOLIDAY_LOTTERY_REFRESH), HandleNotifyHolidayLotteryRefresh);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOLIDAY_LOTTERY_BOARD), HandleNotifyHolidayLotteryBoard);
}

//handle game event
function HandleNotifyHolidayLotteryActive(evt:GameEvent, obj:System.Object) {
	iGUICode_MainUI.getInstance().SetHolidayLotteryBtnEnable(true);
}

function HandleNotifyHolidayLotteryInit(evt:GameEvent, obj:System.Object) {
	var data : 	notify_open_score_lottery_ui = obj as notify_open_score_lottery_ui;
	
	if(data.items.Count == 0) {
		iGUICode_MainUI.getInstance().SetHolidayLotteryBtnEnable(false);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOLIDAY_LOTTERY_ENABLE),false);
		
		Global.GetSysMsgHandler().ShowSysMsg(472);
	} else {
		mRemainTimes = data.remain_count;
		
		var awardList : ArrayList = new ArrayList();
		for(var award : lottery_item in data.items) {
			var itemData : LotteryItemData = new LotteryItemData();
			itemData.id = award.item_id;
			itemData.count = award.item_count;
			awardList.Add(itemData);
		}
		RefreshAward(awardList);
	}
}

function HandleNotifyHolidayLotteryResult(evt:GameEvent, obj:System.Object) {
	var data : 	notify_score_lottery_result = obj as notify_score_lottery_result;
	
	mRemainTimes = data.remain_count;
	
	if(data.items[data.hit_index] == null) return ;
	
	var inst : lottery_item = data.items[data.hit_index] as lottery_item;
	var row : ItemRow = ResManager.LgtMgr.getItemRow(inst.item_id);
	var params : ArrayList = new ArrayList();
	params.Add(row.name);
	params.Add(inst.item_count);
	Global.GetSysMsgHandler().ShowSysMsg(468,params);
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOLIDAY_LOTTERY_RESULT_UI),data.hit_index);
	
	HolidayNet.GetInstance().ReqLotteryBoard();
}

function HandleNotifyHolidayLotteryRefresh(evt:GameEvent, obj:System.Object) {
	var data : 	notify_refresh_score_lottery_ui = obj as notify_refresh_score_lottery_ui;
	
	mRemainTimes = data.remain_count;
		
	var awardList : ArrayList = new ArrayList();
	for(var award : lottery_item in data.items) {
		var itemData : LotteryItemData = new LotteryItemData();
		itemData.id = award.item_id;
		itemData.count = award.item_count;
		awardList.Add(itemData);
	}
	RefreshAward(awardList);
}

function HandleNotifyHolidayLotteryBoard(evt:GameEvent, obj:System.Object) {
	var info : 	notify_score_ranking = obj as notify_score_ranking;
	
	mScore = info.self_score;
		
	var boardList : ArrayList = new ArrayList();
	for(var rank : ranking_data in info.data) {
		var board : ScoreBoard = new ScoreBoard();
		board.account = rank.account;
		board.score = rank.data;
		boardList.Add(board);
	}
	RefreshBoard(boardList);
}

//extern function
function Open() {
	UI.getUI().OpenUIRoot("HolidayUI");
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOLIDAY_LOTTERY_ENABLE),true);
	
	HolidayNet.GetInstance().ReqLotteryInit();
	HolidayNet.GetInstance().ReqLotteryBoard();
}

function RefreshAward(awards : ArrayList) {
	if(awards == null) return ;
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOLIDAY_LOTTERY_AWARD_REFRESH),awards);
}

function RefreshBoard(board : ArrayList) {
	if(board == null) return ;
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOLIDAY_LOTTERY_BOARD_REFRESH),board);
}

function BuyLoveFruit() {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOLIDAY_LOTTERY_ENABLE),false);
	
	PropShopLogic.Ctrl.Excute("open_prop_shop_ui", 1);
}

function Lottery() {
	HolidayNet.GetInstance().ReqLotteryAward();
}

function RefreshAwards() {
	HolidayNet.GetInstance().ReqLotteryRefresh();
}

//data operate
function GetLotterySpecial() : int {
	return mHighestAward;
}

function GetAwards() : ArrayList {
	var awards : ArrayList = new ArrayList();
	for(var award : int in mAwards) {
		var data : LotteryItemData = new LotteryItemData();
		data.id = award;
		data.count = 0;
		awards.Add(data);
	}
	return awards;
}

function GetRemainTimes() : int {
	return mRemainTimes;
}

function GetScore() : int {
	return mScore;
}

function GetRank() : int {
	return mRank;
}

function GetInteral() : float {
	return mInterval;
}
