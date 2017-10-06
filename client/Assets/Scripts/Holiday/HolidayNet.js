#pragma strict
#pragma downcast

/*
//items make net center
//create by fullzhu 2012.6.21
//last edit at 2012.6.21 by fullzhu
*/

private static var instance : HolidayNet;
function Awake(){
	instance=this;
	
	RegistNetMsg();
}
static function GetInstance(){
	return instance;
}

function Start () {
}

//net event regist
function RegistNetMsg() {
	NetHelper.RegistHandler(new notify_active_score_lottery(), HandleNotifyHolidayLotteryActive);
	NetHelper.RegistHandler(new notify_open_score_lottery_ui(), HandleNotifyHolidayLotteryInit);
	NetHelper.RegistHandler(new notify_score_lottery_result(), HandleNotifyHolidayLotteryResult);
	NetHelper.RegistHandler(new notify_refresh_score_lottery_ui(), HandleNotifyHolidayLotteryRefresh);
	NetHelper.RegistHandler(new notify_score_ranking(), HandleNotifyHolidayLotteryBoardRefresh);
}

//handle net event
function HandleNotifyHolidayLotteryActive(evt:GameEvent, pack:notify_active_score_lottery) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOLIDAY_LOTTERY_ACTIVE),pack);
}

function HandleNotifyHolidayLotteryInit(evt:GameEvent, pack:notify_open_score_lottery_ui) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOLIDAY_LOTTERY_INIT),pack);
}

function HandleNotifyHolidayLotteryResult(evt:GameEvent, pack:notify_score_lottery_result) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOLIDAY_LOTTERY_RESULT),pack);
}

function HandleNotifyHolidayLotteryRefresh(evt:GameEvent, pack:notify_refresh_score_lottery_ui) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOLIDAY_LOTTERY_REFRESH),pack);
}

function HandleNotifyHolidayLotteryBoardRefresh(evt:GameEvent, pack:notify_score_ranking) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOLIDAY_LOTTERY_BOARD),pack);
}

//client request
function ReqLotteryInit() {
	var packet:req_open_score_lottery_ui = new req_open_score_lottery_ui();
	NetHelper.Send(packet);
}

function ReqLotteryAward() {
	var packet:req_score_lottery = new req_score_lottery();
	NetHelper.Send(packet);
}

function ReqLotteryBoard() {
	var packet:req_score_ranking = new req_score_ranking();
	NetHelper.Send(packet);
}

function ReqLotteryRefresh() {
	var packet:req_refresh_score_lottery_ui = new req_refresh_score_lottery_ui();
	NetHelper.Send(packet);
}

//logic function for external interface

//logic function for interal

//data operate