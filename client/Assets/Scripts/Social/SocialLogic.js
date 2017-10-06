/*
//social logic center
//creat by fullzhu 2012.6.6
//last edit at 2012.6.6 by fullzhu
*/
#pragma strict
#pragma downcast
import System.DayOfWeek;

class SocialItemData {
	public var account : String;
	public var level : int;
	public var intimate : FriendIntimateRow;
	public var bPlantActive : boolean;
}

enum SocialSort {
	SORT_FRIEND = 1,
	SORT_FOLLOW = 2
}
private var mSort : SocialSort;
private var mInit : boolean = false;

private static var instance : SocialLogic;
function Awake(){
	instance=this;
	
	RegistEventMsg();
}
static function GetInstance(){
	return instance;
}

function Start () {
	Init();
}

function Init() {
	if(PlatformMgr.IsPlatYY()) {
		mSort = SocialSort.SORT_FOLLOW;
	} else {
		mSort = SocialSort.SORT_FRIEND;
	}
}

function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOUSE_CREATED), HandleNotifyHouseOwnerInfo);
}

//callback
private function HandleNotifyHouseOwnerInfo(evt:GameEvent, obj:house_info) {
	if(iGUICode_SocialUI.getInstance()) {
		iGUICode_SocialUI.getInstance().Enable(false);
	}
}

//logic function for external interface
public function ChangeSort(sort : SocialSort) : ArrayList {
	mSort = sort;
	
	return GetCurrData();
}

public function Visit(account : String) {
	if(mSort == SocialSort.SORT_FRIEND) {
		PlayerFriend.GetInstance().ReqEnterFriendHouse(account,enter_house_type.eht_friend_list);
	} else if(mSort == SocialSort.SORT_FOLLOW) {
		PlayerFriend.GetInstance().ReqEnterFriendHouse(account,enter_house_type.eht_attention);
	} else {
		return ;
	}
}

public function IsDataRecv() : boolean {
	return PlayerFriend.GetInstance().IsDataRecv() && FollowLogic.GetInstance().IsDataRecv();
}

public function RefreshPlant(account : String, active : boolean) {
	if(iGUICode_SocialUI.getInstance()) {
		PlayerFriend.GetInstance().RefreshPlant(account, active);
		FollowLogic.GetInstance().RefreshPlant(account, active);
	}
}

public function IsHavePlantEvent() : boolean {
	if(PlayerFriend.GetInstance().IsHavePlantEvent() || FollowLogic.GetInstance().IsHavePlantEvent())
		return true;
		
	return false;
}

//logic function for interal
/*
private function Clear() {
}
*/

//data operate
public function GetCurSort() : SocialSort {
	return mSort;
}

public function GetNextPage() : ArrayList {
	var list : ArrayList = new ArrayList();
	
	var dataList : ArrayList = null;
	if(mSort == SocialSort.SORT_FRIEND) {
		dataList = PlayerFriend.GetInstance().GetNextPage();
		for(var data : FriendInfo in dataList) {
			if(data == null) continue ;
			
			var info : SocialItemData = new SocialItemData();
			info.account = data.account;
			info.level = data.level;
			info.intimate = PlayerFriend.GetInstance().GetIntimate(data.account);
			info.bPlantActive = data.bPlantActive;
			list.Add(info);
		}
	} else if(mSort == SocialSort.SORT_FOLLOW){
		dataList = FollowLogic.GetInstance().GetNextPage();
		for(var data : FollowInfo in dataList) {
			if(data == null) continue ;
			
			var info1 : SocialItemData = new SocialItemData();
			info1.account = data.account;
			info1.level = 0;
			info1.intimate = null;
			info1.bPlantActive = data.bPlantActive;
			list.Add(info1);
		}
	} else {
		return null;
	}
	
	return list;
}
	
public function GetPrePage() : ArrayList {
	var list : ArrayList = new ArrayList();
	
	var dataList : ArrayList = null;
	if(mSort == SocialSort.SORT_FRIEND) {
		dataList = PlayerFriend.GetInstance().GetPrePage();
		for(var data : FriendInfo in dataList) {
			if(data == null) continue ;
			
			var info : SocialItemData = new SocialItemData();
			info.account = data.account;
			info.level = data.level;
			info.intimate = PlayerFriend.GetInstance().GetIntimate(data.account);
			info.bPlantActive = data.bPlantActive;
			list.Add(info);
		}
	} else if(mSort == SocialSort.SORT_FOLLOW){
		dataList = FollowLogic.GetInstance().GetPrePage();
		for(var data : FollowInfo in dataList) {
			if(data == null) continue ;
			
			var info1 : SocialItemData = new SocialItemData();
			info1.account = data.account;
			info1.level = 0;
			info1.intimate = null;
			info1.bPlantActive = data.bPlantActive;
			list.Add(info1);
		}
	} else {
		return null;
	}
	
	return list;
}
	
public function GetCurrData() : ArrayList {
	var list : ArrayList = new ArrayList();
	
	var dataList : ArrayList = null;
	if(mSort == SocialSort.SORT_FRIEND) {
		dataList = PlayerFriend.GetInstance().GetCurrData();
		for(var data : FriendInfo in dataList) {
			if(data == null) continue ;
			
			var info : SocialItemData = new SocialItemData();
			info.account = data.account;
			info.level = data.level;
			info.intimate = PlayerFriend.GetInstance().GetIntimate(data.account);
			info.bPlantActive = data.bPlantActive;
			list.Add(info);
		}
	} else if(mSort == SocialSort.SORT_FOLLOW){
		dataList = FollowLogic.GetInstance().GetCurrData();
		for(var data : FollowInfo in dataList) {
			if(data == null) continue ;
			
			var info1 : SocialItemData = new SocialItemData();
			info1.account = data.account;
			info1.level = 0;
			info1.intimate = null;
			info1.bPlantActive = data.bPlantActive;
			list.Add(info1);
		}
	} else {
		return null;
	}
	
	return list;
}
	
public function GetPageData(page : int) : ArrayList {
	var list : ArrayList = new ArrayList();
	
	var dataList : ArrayList = null;
	if(mSort == SocialSort.SORT_FRIEND) {
		dataList = PlayerFriend.GetInstance().GetPageData(page);
		for(var data : FriendInfo in dataList) {
			if(data == null) continue ;
			
			var info : SocialItemData = new SocialItemData();
			info.account = data.account;
			info.level = data.level;
			info.intimate = PlayerFriend.GetInstance().GetIntimate(data.account);
			info.bPlantActive = data.bPlantActive;
			list.Add(info);
		}
	} else if(mSort == SocialSort.SORT_FOLLOW){
		dataList = FollowLogic.GetInstance().GetPageData(page);
		for(var data : FollowInfo in dataList) {
			if(data == null) continue ;
			
			var info1 : SocialItemData = new SocialItemData();
			info1.account = data.account;
			info1.level = 0;
			info1.intimate = null;
			info1.bPlantActive = data.bPlantActive;
			list.Add(info1);
		}
	} else {
		return null;
	}
	
	return list;
}

public function GetCurrPageNum() : int {
	var page : int = 0;
	if(mSort == SocialSort.SORT_FRIEND) {
		page = PlayerFriend.GetInstance().GetCurrPageNum();
	} else if(mSort == SocialSort.SORT_FOLLOW){
		page = FollowLogic.GetInstance().GetCurrPageNum();
	} else {
		return 0;
	}
	
	return page;
}

public function GetTotalPageNum() : int {
	var page : int = 0;
	if(mSort == SocialSort.SORT_FRIEND) {
		page = PlayerFriend.GetInstance().GetTotalPageNum();
	} else if(mSort == SocialSort.SORT_FOLLOW){
		page = FollowLogic.GetInstance().GetTotalPageNum();
	} else {
		return 0;
	}
	
	return page;
}