#pragma strict
#pragma downcast
/*
//friend invite logic center
//creat by fullzhu 2012.5.10
//last edit at 2012.5.10 by fullzhu
*/

private var mDateCount : int = 0;

private static var instance : LogonAwardLogic;
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
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_SHOW_NOTICE_OVER), HandleShowNoticeOver);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LOGON_LIST), HandleNotifyLogonList);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_GET_LOGON_AWARD_RESULT), HandleNotifyLogonAwardResult);
}

//hanlde game event
function HandleShowNoticeOver(evt:GameEvent, obj:System.Object) {
	if (1==obj || 2==obj) {
		LogonAwardNet.GetInstance().ReqLoginList();
	}
}

function HandleNotifyLogonList(evt:GameEvent, obj:notify_login_list) {
	mDateCount = obj.info.Count;
	
	UI.getUI().OpenUIRoot("LogonAwardUI");
	
	if(obj.type == show_type.st_show) {
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LOGON_AWARD_ENABLE),true);
	} else {
		Party.request_client_ready_for_pop_msg();
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LOGON_AWARD_ENABLE),false);
	}
	if(obj.info.Count > 0) {
		if((obj.info[obj.info.Count-1] as login_info).reward_date.year == 0) {
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LOGON_AWARD_ENTRANCE),false);
		}
	}
	
	RefreshInterface();
}

function HandleNotifyLogonAwardResult(evt:GameEvent, obj:System.Object) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LOGON_AWARD_ENTRANCE),false);
}

//logic function for external interface
function Init() {
}

function Clear() {
}

function RefreshInterface() {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REFRESH_AWARD_LAST_DAY),mDateCount);
	/*
	for(var gift in ResManager.LgtMgr.LogonAwardTable) {
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REFRESH_AWARD_GIFT_LIST),gift.Value);
	}
	*/
}

function AwardGet() {
	var gift : LogonAward = GetAwardData(mDateCount);
	if(gift == null) {
		Debug.Log("there is nothing wrong at table!!" + mDateCount);
		return ;
	}
	
	LogonAwardNet.GetInstance().ReqGetInviteGift();
}

//logic function for interal

//data operate
function GetAwardData(day : int) : LogonAward {
	for(var gift : DictionaryEntry in ResManager.LgtMgr.LogonAwardTable) {
		if((gift.Value as LogonAward).day == day) {
			return gift.Value;
		}
	}
	return null;
}

function GetDateCount() : int {
	return mDateCount;
}