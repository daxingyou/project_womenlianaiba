/*
//player HolidayGift manager
//creat by fullzhu 2012.2.3
//last edit at 2012.2.3 by fullzhu
*/
#pragma strict

static private var mAccount : String = "";
static private var mLoverAccount : String = "";
static private var mHostAccount : String = "";
static private var mHostLoverAccount : String = "";

static private var mHoliday : stime = new stime();

private static var instance : GiftMgr;
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

//net event regist
function RegistNetMsg() {
	NetHelper.RegistHandler(new notify_active_holiday_gift(), HandleNotifyHolidayActive);
	NetHelper.RegistHandler(new notify_get_holiday_gift_result(), HandleNotifyGiftResult);
}

//game event regist()
function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOUSE_CREATED), HandleNotifyHouseOwnerInfo);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REQUEST_GIFT_ROLL), HandleNotifyReqRollItem);	
}

//handle net event
function HandleNotifyHolidayActive(evt:GameEvent, pack:notify_active_holiday_gift) {
	iGUICode_MainUI.getInstance().SetHolidayGiftBtnEnable(true);
	var dt:DateTime = SysTimer.getCurTime();
	mHoliday.year = dt.Year;
	mHoliday.month = dt.Month;
	mHoliday.day = dt.Day;
	mHoliday.hour = dt.Hour;
	mHoliday.minute = dt.Minute;
	mHoliday.second = dt.Second;
}
function HandleNotifyGiftResult(evt:GameEvent, pack:notify_get_holiday_gift_result) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_GIFT_RESULT),pack);
}


//handle game event
function HandleNotifyHouseOwnerInfo(evt:GameEvent, obj:System.Object) {
	if(!obj)
		return;
	
	mAccount = ScenePlayerMgr.getMainPlayerAccount();
	var houseInfo : house_info = obj as house_info;
	if(mAccount == houseInfo.boy) {
		mLoverAccount = houseInfo.girl;
	} else if(mAccount == houseInfo.girl) {
		mLoverAccount = houseInfo.boy;
	}
	mHostAccount = houseInfo.boy;
	mHostLoverAccount = houseInfo.girl;
}

function HandleNotifyReqRollItem(evt:GameEvent, obj:System.Object) {
	ReqRollItem();
}

//client request
function ReqRollItem() {
	var packet:req_get_holiday_gift = new req_get_holiday_gift();
	NetHelper.Send(packet);
}

//data operate

static public function GetAccount() {
	return mAccount;
}

static public function GetLoverAccount() {
	return mLoverAccount;
}

static public function GetHostAccount() {
	return mHostAccount;
}

static public function GetHostLoverAccount() {
	return mHostLoverAccount;
}

static public function GetHoliday() {
	return mHoliday;
}

