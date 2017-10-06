#pragma strict
/*
//diamond logic center
//creat by fullzhu 2013.3.1
//last edit at 2013.3.1 by fullzhu
*/

private var mTotalDiamond : int = 0;

private static var instance : DiamondLogic;
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
	NetHelper.RegistHandler(new notify_open_recharge_ui(), HandleNotifyShowBuyDialog);
	NetHelper.RegistHandler(new notify_init_love_coin(), HandleNotifyInitDiamond);
	NetHelper.RegistHandler(new notify_love_coin(), HandleNotifyUpdateDiamond);
	NetHelper.RegistHandler(new notify_recharge_love_coin(), HandleNotifyRechargeDiamond);
}

function RegistEventMsg() {
	//EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_SHOW_BUY_DIALOG), HandleNotifyShowBuy);
}

//handle net event
function HandleNotifyShowBuyDialog(evt:GameEvent, pack:notify_open_recharge_ui) {
	OpenRecharge();
}

function HandleNotifyInitDiamond(evt:GameEvent, pack:notify_init_love_coin) {
	mTotalDiamond = pack.love_coin;
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_UPDATE_DIAMOND),mTotalDiamond);
}

function HandleNotifyUpdateDiamond(evt:GameEvent, pack:notify_love_coin) {
	var diamond : int = pack.love_coin;
	UpdateDiamond(diamond);
}

function HandleNotifyRechargeDiamond(evt:GameEvent, pack:notify_recharge_love_coin) {
	var diamond : int = pack.love_coin;
	UpdateDiamond(diamond);
}

//hanlde game event

//logic function for external interface
function Init() {
}

function Clear() {
}

function UpdateDiamond(diamond : int) {
	var deltaDiamond : int = diamond - mTotalDiamond;
	
	mTotalDiamond = diamond;	
	if(mTotalDiamond < 0) mTotalDiamond = 0;
	
	if(deltaDiamond != 0) {
		UIAnimation.createNumberAnimation(Rect(0.5, 0.5, 0, 0), Rect(0.5, 0.1, 0, 0), "aib_icon", deltaDiamond);
	}
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_UPDATE_DIAMOND),mTotalDiamond);
}

function OpenRecharge() : void {
	UI.getUI().OpenUIRoot("DiamondUI");
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_SHOW_DIAMOND_BUY_UI),true);
}

function CheckRecharge(id : int) : void {
	ReqRecharge(id);
}

//logic function for interal
private function ReqRecharge(id : int) : void {
	var packet:req_recharge_love_coin = new req_recharge_love_coin();
	packet.id = id;
	NetHelper.Send(packet);
}

//data operate
public function GetPlayerDiamond() : int {
	return mTotalDiamond;
}