/*
//qqhome logic center
//creat by fullzhu 2012.4.6
//last edit at 2012.4.6 by fullzhu
*/
#pragma strict
#pragma downcast
enum QQHomeType {
	QQHOME_NONE = 1,
	QQHOME_NORMAL = 2,
	QQHOME_YEAR = 3
}

private var mTopLevel : int = 8;						//qqhome top_level

private var mType : QQHomeType;
private var mQQHomeLevel : int = 0;						//qqhome level
private var mSex : int;

private var mBNewComer : boolean = false;				//new comer
private var mBGiftGet : boolean = false;				//gift get state

private static var instance : QQHomeLogic;
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
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOUSE_CREATED), HandleNotifyHouseCreated);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_QQHOME_INIT), HandleNotifyInit);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_QQHOME_GIFT_GET_RESULT), HandleNotifyGiftGetResult);
}

//hanlde game event
function HandleNotifyHouseCreated(evt:GameEvent, obj:System.Object) {
	var data : player_basic_data = ScenePlayerMgr.getMainPlayerData();
	mSex = data.sex;
	
	var platResMgr : PlatformResMgr = ResManager.platformResMgr;
	var idArray : Array = new Array();
	idArray.Add(DataCenter.getMainPlayerAccount());
	platResMgr.GetUserInfo(CallbackPlatformRes,idArray);
}

function HandleNotifyInit(evt:GameEvent, obj:notify_vip_gift_receive_info) {
	if(obj.beginner == 0) {
		mBNewComer = true;
	} else {
		mBNewComer = false;
	}
	if(obj.daily == 0) {
		mBGiftGet = false;
	} else {
		mBGiftGet = true;
	}
	Init();
}

function HandleNotifyGiftGetResult(evt:GameEvent, obj:notify_vip_gift) {
	if(obj.status == 0) {
		Debug.Log("something wrong!!");
		return ;
	}
	if(mBNewComer) {
		mBNewComer = false;
	} else {
		mBGiftGet = true;
	}
	
	RefreshInterface();
}

//callback
private function CallbackPlatformRes(data:Hashtable) {
	var info : player_basic_information = data[DataCenter.getMainPlayerAccount()] as player_basic_information;
	if(info) {
		mQQHomeLevel = info.yellow_vip_level;
		if(info.is_yellow_year_vip != 0) {
			mType = QQHomeType.QQHOME_YEAR;
		} else if(info.is_yellow_vip != 0) {
			mType = QQHomeType.QQHOME_NORMAL;
		} else {
			mType = QQHomeType.QQHOME_NONE;
		}
	} else {
		mQQHomeLevel = 0;
		mType = QQHomeType.QQHOME_NONE;
	}
	
	QQHomeNet.GetInstance().ReqQQHomeBase();
}

//logic function for external interface
function Init() {
	UI.getUI().OpenUIRoot("QQHomeUI");
	
	RefreshInterface();
}

function Clear() {
}

function RefreshInterface() {
	if(mBNewComer) {
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_QQHOME_ENTRY_STATUS),QHEntryBtnStatus.ENTRY_NEWER);
	} else if(mBGiftGet) {
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_QQHOME_ENTRY_STATUS),QHEntryBtnStatus.ENTRY_GOT);
	} else {
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_QQHOME_ENTRY_STATUS),QHEntryBtnStatus.ENTRY_DAILY);
	}
}

function TriggerGiftBag() {
	if(IsNewComer()) {
		NewerGift();
		return ;
	}
	if(IsGiftGet()) {
		ShowPrivilege();
	} else {
		DailyGift();
	}
}

function TakeGiftBag() {
	if(IsNewComer()) {
		TakeNewerGift();
		return ;
	}
	if(!IsGiftGet()) {
		TakeDailyGift();
		return ;
	}
}

function OpenQQHome() {
	ExternalFlatform.openVipOP();
}

function ReNewQQHome() {
	ExternalFlatform.openVipOP();
}

function OpenQQHomeYear() {
	ExternalFlatform.openVipYOP();
}

function RenewQQHomeYear() {
	ExternalFlatform.openVipYOP();
}

function IsNewComer() : boolean {
	return mBNewComer;
}

function IsGiftGet() : boolean {
	return mBGiftGet;
}

function IsTopLevel() : boolean {
	return mQQHomeLevel == mTopLevel;
}

function IsQQHomeVip() : boolean {
	return mType == QQHomeType.QQHOME_NORMAL || mType == QQHomeType.QQHOME_YEAR;
}
//logic function for interal
private function DailyGift() {
	if(mType == QQHomeType.QQHOME_NONE) {
		DailyNoQQHome();
	} else if(mType == QQHomeType.QQHOME_NORMAL){
		DailyNormalQQHome();
	} else if(mType == QQHomeType.QQHOME_YEAR){
		DailyYearQQHome();
	} else {
		Debug.Log("do nothing--unknown qqhometype");
	}
}

private function NewerGift() {	
	if(mType == QQHomeType.QQHOME_NONE) {
		NewComerNoQQHome();
	} else {
		NewComerQQHome();
	}
}

public function ShowPrivilege() {
	for(var gift:DictionaryEntry in ResManager.LgtMgr.QQHomeGiftTable) {
		if((gift.Value as QQHomeGiftRow).level == 0) continue;
		
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_QQHOME_SET_PRIVILEGE_ITEM),gift.Value);
	}
	
	var data : QQHomeGiftRow = null;
	if(mQQHomeLevel == 0) {
		data = GetQQHomeGiftRow(1);
	} else {
		data = GetQQHomeGiftRow(mQQHomeLevel);
	}
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_QQHOME_SET_PRIVILEGE_SLOT),data);
}

private function NewComerQQHome() {
	var data : QQHomeGiftRow = GetQQHomeGiftRow(0);
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_QQHOME_SET_NEWER_GIFT_SLOT),data);
}

private function NewComerNoQQHome() {
	var data : QQHomeGiftRow = GetQQHomeGiftRow(0);
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_QQHOME_SET_NEWER_GIFT_SLOT),data);
}

private function DailyNoQQHome() {
	ShowPrivilege();
}

private function DailyNormalQQHome() {
	var data : QQHomeGiftRow = GetQQHomeGiftRow(mQQHomeLevel);
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_QQHOME_SET_DAILY_SLOT),data);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_QQHOME_SET_DAILY_YEAR_SLOT),data);
	
	if(!IsTopLevel()) {
		var nextData : QQHomeGiftRow = GetQQHomeGiftRow(mQQHomeLevel+1);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_QQHOME_SET_DAILY_SLOT_NEXT_LEVEL),nextData);
	}
}

private function DailyYearQQHome() {
	var data : QQHomeGiftRow = GetQQHomeGiftRow(mQQHomeLevel);
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_QQHOME_SET_DAILY_SLOT),data);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_QQHOME_SET_DAILY_YEAR_SLOT),data);
	
	if(!IsTopLevel()) {
		var nextData : QQHomeGiftRow = GetQQHomeGiftRow(mQQHomeLevel+1);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_QQHOME_SET_DAILY_SLOT_NEXT_LEVEL),nextData);
	}
}

private function TakeDailyGift() {
	var data : QQHomeGiftRow = GetQQHomeGiftRow(mQQHomeLevel);
	
	var itemList : ArrayList = new ArrayList();
	if(data.gift1 != 0) {
		var item1 : vip_gift_item = new vip_gift_item();
		item1.item_id = data.gift1;
		item1.count = data.count1;
		itemList.Add(item1);
	}
	if(data.gift2 != 0) {
		var item2 : vip_gift_item = new vip_gift_item();
		item2.item_id = data.gift2;
		item2.count = data.count2;
		itemList.Add(item2);
	}
	if(data.gift3 != 0) {
		var item3 : vip_gift_item = new vip_gift_item();
		item3.item_id = data.gift3;
		item3.count = data.count3;
		itemList.Add(item3);
	}
	if(mType == QQHomeType.QQHOME_YEAR && data.gift_year != 0) {
		var item4 : vip_gift_item = new vip_gift_item();
		item4.item_id = data.gift_year;
		item4.count = data.count_year;
		itemList.Add(item4);
	}
	
	QQHomeNet.GetInstance().ReqQQHomeGetDailyGift(itemList);
}

private function TakeNewerGift() {
	var data : QQHomeGiftRow = GetQQHomeGiftRow(0);
	
	var itemList : ArrayList = new ArrayList();
	if(data.gift1 != 0) {
		var item1 : vip_gift_item = new vip_gift_item();
		item1.item_id = data.gift1;
		item1.count = data.count1;
		itemList.Add(item1);
	}
	if(data.gift2 != 0) {
		var item2 : vip_gift_item = new vip_gift_item();
		item2.item_id = data.gift2;
		item2.count = data.count2;
		itemList.Add(item2);
	}
	if(data.gift3 != 0) {
		var item3 : vip_gift_item = new vip_gift_item();
		item3.item_id = data.gift3;
		item3.count = data.count3;
		itemList.Add(item3);
	}
	
	if(data.gift_year != 0) {
		var item4 : vip_gift_item = new vip_gift_item();
		item4.item_id = data.gift_year;
		item4.count = data.count_year;
		itemList.Add(item4);
	}
	
	QQHomeNet.GetInstance().ReqQQHomeGetNewerGift(itemList);
}
//data operate
public function GetQQHomeGiftRow(level : int) : QQHomeGiftRow {
	for(var gift:DictionaryEntry in ResManager.LgtMgr.QQHomeGiftTable) {
		if((gift.Value as QQHomeGiftRow).level == level && (gift.Value as QQHomeGiftRow).sex == mSex) {
			return gift.Value as QQHomeGiftRow;
		}
	}
	return null;
}

public function GetQQHomeType() : QQHomeType {
	return mType;
}

public function GetQQHomeLv() : int {
	return mQQHomeLevel;
}