#pragma strict
/*
//dress net center
//creat by fullzhu 2012.4.6
//last edit at 2012.4.6 by fullzhu
*/

public var mFilterHideRoot : String[];							// filter ui

private var mOrderID : String = "";

private static var instance : ConsumeLogic;
function Awake(){
	instance=this;
	
	RegistEventMsg();
}
static function GetInstance(){
	return instance;
}

function Start () {
}

function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_SHOW_BUY_DIALOG), HandleNotifyShowBuy);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_SHOW_POWER_DIALOG), HandleNotifyPower);
}

//hanlde game event
function HandleNotifyShowBuy(evt:GameEvent, obj:notify_show_buy_dialog) {
	mOrderID = obj.context;
	ExternalFlatform.buyGoods(obj.Params,obj.context);
}

function HandleNotifyPower(evt:GameEvent, obj:notify_cancel_order) {
	PowerConsume();
}

//logic function for external interface
function Init() {
}

function Clear() {
}

function Consume() {
	PropBuyCommonLogic.getInstance().openPropBuyCommonUI(885);	// 20体力药剂
}

function PowerConsume() {
	UI.getUI().OpenUIRoot("ConsumeUI");
	iGUICode_ConsumeUI.getInstance().Enable(true);
}

function CancelQQOrder(orderID : String) {
	ConsumeNet.GetInstance().ReqCancelQQOrder(orderID);
}

function RefreshInterface() {
}
//logic function for interal


//data operate
function GetOrderID() : String {
	return mOrderID;
}