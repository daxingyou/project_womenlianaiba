/*
//friend invite logic center
//creat by fullzhu 2012.5.7
//last edit at 2012.5.7 by fullzhu
*/
#pragma strict
#pragma downcast
import System.DayOfWeek;

private var mInviteList : ArrayList = new ArrayList();				//struct account(String)

private var mGroup : int = 1;										//week day
private var mCount : int = 0;

private static var instance : FriendInviteLogic;
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
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_INVITE_LIST), HandleNotifyInviteList);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_GET_INVITE_GIFT_RESULT), HandleNotifyGetGiftResult);
}

//hanlde game event
function HandleNotifyInviteList(evt:GameEvent, obj:notify_invite_active) {
	mInviteList = obj.invite_list.Clone();
	mCount = obj.count;
	var date : DateTime = SysTimer.getCurTime();
	switch(date.DayOfWeek) {
		case System.DayOfWeek.Monday : mGroup = 1;break;
		case System.DayOfWeek.Tuesday : mGroup = 2;break;
		case System.DayOfWeek.Wednesday : mGroup = 3;break;
		case System.DayOfWeek.Thursday : mGroup = 4;break;
		case System.DayOfWeek.Friday : mGroup = 5;break;
		case System.DayOfWeek.Saturday : mGroup = 6;break;
		case System.DayOfWeek.Sunday : mGroup = 7;break;
	}
	
	RefreshInterface();
}

function HandleNotifyGetGiftResult(evt:GameEvent, obj:notify_invite_award) {
	if(obj.result == 1) {
		FriendInviteLogic.GetInstance().InviteList();
	}
}

//logic function for external interface
function Init() {
}

function Clear() {
}

function RefreshInterface() {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REFRESH_INVITE_FRIEND_LIST),mInviteList);
	var giftList : ArrayList = GetInviteGiftData(mGroup);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REFRESH_INVITE_GIFT_LIST),giftList);
}

function InviteFriend() {
	ExternalFlatform.InviteFriends();
}

function InviteGift() {
	var gift : InviteGift = RandomResult();
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REFRESH_INVITE_GIFT_RESULT),gift);
	
	if(gift.gift_type == 1) {
		FriendInviteNet.GetInstance().ReqGetInviteGift(0,gift.item_id,gift.count,mInviteList);
	} else if(gift.gift_type == 2) {
		FriendInviteNet.GetInstance().ReqGetInviteGift(gift.count,0,0,mInviteList);
	} else {
		Debug.Log("gift_type is wrong!!");
	}
}

function InviteList() {
	FriendInviteNet.GetInstance().ReqInviteList();
}

function OpenBBS() {
	ExternalFlatform.OpenUrl("http://sobar.soso.com/t/89455090");
}

//logic function for interal
private function RandomResult() : InviteGift {
	var random_num : float = Random.Range(0,100);
	var giftList : ArrayList = GetInviteGiftData(mGroup);
	var rateArray : ArrayList = new ArrayList();
	
	var rateAdd : int = 0;
	for(var i=0; i<giftList.Count; i++) {
		rateAdd = (giftList[i] as InviteGift).rate + rateAdd;
		rateArray.Add(rateAdd);
	}
	
	var kRate : float = 100;
	var idx : int = 0;
	for(var j=0; j<rateArray.Count; j++) {
		var r:float = rateArray[j];
		if(r <= kRate && r >= random_num) {
			kRate = rateArray[j];
			idx = j;
		}
	}
	
	return giftList[idx];
}

//data operate
function GetInviteGiftData(group : int) : ArrayList {
	var giftList : ArrayList = new ArrayList();
	for(var gift:DictionaryEntry in ResManager.LgtMgr.InviteGiftTable) {
		if((gift.Value as InviteGift).group_id == group) {
			giftList.Add(gift.Value);
		}
	}
	return giftList;
}

function GetGiftGetCount() : int {
	return mCount;
}