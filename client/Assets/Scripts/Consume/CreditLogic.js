#pragma strict
/*
//diamond logic center
//creat by fullzhu 2013.3.1
//last edit at 2013.3.1 by fullzhu
*/

private var mTotalaCredit : int = 0;

private static var instance : CreditLogic;
function Awake(){
	instance=this;
	
	RegistNetMsg();
	RegistEventMsg();
}
static function GetInstance(){
	return instance;
}

function Start () {
}

function RegistNetMsg() {
	NetHelper.RegistHandler(new notify_init_party_coin(), HandleNotifyInitCredit);
	NetHelper.RegistHandler(new notify_party_score_coin(), HandleNotifyUpdateCredit);
}

function RegistEventMsg() {
	//EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_SHOW_BUY_DIALOG), HandleNotifyShowBuy);
}

//handle net event
function HandleNotifyInitCredit(evt:GameEvent, pack:notify_init_party_coin) {
	var credit : int = pack.coin;
	
	InitCredit(credit);
}

function HandleNotifyUpdateCredit(evt:GameEvent, pack:notify_party_score_coin) {
	var credit : int = pack.coin;
	
	UpdateCredit(credit);
}

//hanlde game event

//logic function for external interface
function Init() {
}

function Clear() {
}

function InitCredit(credit : int) {
	mTotalaCredit = credit;
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_UPDATE_CREDIT),mTotalaCredit);
}

function UpdateCredit(credit : int) {
	var deltaCredit : int = credit - mTotalaCredit;
	
	mTotalaCredit = credit;
	if(mTotalaCredit < 0) mTotalaCredit = 0;
	
	if(deltaCredit != 0) {
		UIAnimation.createNumberAnimation(Rect(0.5, 0.5, 0, 0), Rect(0.5, 0.1, 0, 0), "points", deltaCredit);
	}
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_UPDATE_CREDIT),mTotalaCredit);
}

//logic function for interal

//data operate
public function GetPlayerCredit() : int {
	return mTotalaCredit;
}