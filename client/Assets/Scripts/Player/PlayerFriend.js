#pragma strict
#pragma downcast
/*
//player friends manager
//creat by fullzhu 2011.11.16
//last edit at 2011.12.1 by fullzhu
*/

class FriendItem {
	public var idx : int;
	public var account : String;
	public var bValid : boolean;
	public var bVisit : boolean;
	public var level : int;
}

class FriendInfo {
	public var account : String;
	public var houseID : UInt64;
	public var level : int;
	public var name : String = "";
	public var headIcon : Texture;
	public var bVisit : boolean;
	public var intimate : int;
	public var bPlantActive : boolean;
}

class FriendImage {
	public var account : String;
	public var name : String;
	public var image : Texture;
}

enum FriendPageType {
	PageType_PreStep = 0,
	PageType_NextStep = 1,
	PageType_PrePage = 2,
	PageType_NextPage = 3,
}

private var mFriendList : Array = new Array();				//struct FriendInfo
private var mAccount : String = "";
private var mLoveAccount : String = "";
private var mHostAccount : String = "";
private var mHostLoveAccount : String = "";
private var mHouseID : UInt64 = 0;							//mAccount id
private var mHostHouseID : UInt64 = 0;						//mHostAccount id
private var mBMainPlayerBoy : boolean = false;				//main player sex

private var mPerPageNum : int = 6;
private var mStartPos : int = 0;
private var mEndPos : int = 5;
private var mBRecvFriendList : boolean = false;

private var mCurrPageData : Array = new Array();			//struct FriendInfo
private var mVisitRecord : Array = new Array();

//Add
private var mPage : PagerMgr;
private var mPerNum : int = 8;
private var mDataRecv : boolean = false;

private static var instance : PlayerFriend;
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
	NetHelper.RegistHandler(new notify_player_friend_list(), HandleNotifyFriendList);
	NetHelper.RegistHandler(new notify_daily_visit(), HandleNotifyFriendVisitRecord);
	NetHelper.RegistHandler(new notify_friend_intimate(), HandleNotifyFriendIntimate);
}

function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LEAVE_SCENE), HandleNotifyHouseScene);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOUSE_CREATED), HandleNotifyHouseOwnerInfo);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_ENTER_FRIEND_HOUSE), HandleRequestEnterFriendHouse);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_RETURN_HOUSE), HandleRequestReturnHouse);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_INVITE_FRIEND), HandleRequestInviteFriend);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_UPDATE_FRIEND_ITEM_INFO), HandleRequestUpdateFriendItem);
}

//handle net event
function HandleNotifyFriendList(evt:GameEvent, pack:notify_player_friend_list) {
	Reset();
	
	for(var friend : friend_item in pack.friend_list) {
		var info : FriendInfo = new FriendInfo();
		info.account = friend.account;
		info.houseID = friend.house_id;
		info.level = friend.house_level;
		info.intimate = friend.intimate;
		info.bPlantActive = friend.crop_event == 0 ? false : true;
		mFriendList.Push(info);
	}
	
	mFriendList.Sort(CompareFun);
	ReqFriendVisitRecord(mAccount);
	
	//Add
	var friendList : ArrayList = new ArrayList();
	for(var data in mFriendList) {
		friendList.Add(data);
	}
	mPage = new PagerMgr(friendList,mPerNum);
	mDataRecv = true;
	
	//tip
	if(SocialLogic.GetInstance().IsHavePlantEvent()) {
		if(PaoPaoControl.GetPpCtrol(iGUICode_MainUI.getInstance().SocialPlantPP) == null)
			new PaoPaoControl(30000,0,2000,1,iGUICode_MainUI.getInstance().SocialPlantPP, iGUICode_MainUI.getInstance().social_btn);
	}
}

function HandleNotifyFriendVisitRecord(evt:GameEvent, pack:notify_daily_visit) {
	for(var record : UInt64 in pack.visit_firends) {
		for(var friend : FriendInfo in mFriendList) {
			if(friend.houseID == record) {
				friend.bVisit = true;
				break;
			}
		}
	}
	
	RefreshListData(mFriendList,mPerPageNum,0);
}

function HandleNotifyFriendIntimate(evt:GameEvent, pack:notify_friend_intimate) {
	for(var friend : FriendInfo in mFriendList) {
		if(friend.account == pack.account) {
			friend.intimate = pack.intimate;
			break;
		}
	}
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_REFRESH_ATTENTION_INTERFACE));
}

//hanlde game event
function HandleNotifyHouseScene(evt:GameEvent, obj:System.Object) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_UPDATE_OWNER_INFO),"");
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_UPDATE_LOVER_INFO),"");
}
function HandleNotifyHouseOwnerInfo(evt:GameEvent, obj:house_info) {
	if(!obj)
		return;
	
	mAccount = ScenePlayerMgr.getMainPlayerAccount();
	mHostAccount = obj.boy;
	mHostLoveAccount = obj.girl;
	
	ExternalFlatform.SetOwnerOpenID(mHostAccount);
	ExternalFlatform.SetLoverOpenID(mHostLoveAccount);
	
	RefreshOwnerHeadInfo();
	
	if(mBRecvFriendList == false) {
		ReqFriendList();
		mBRecvFriendList = true;
	}
	
	mHostHouseID = obj.house_id;
	
	if(mAccount == mHostAccount) {
		mHouseID = obj.house_id;
		mLoveAccount = obj.girl;
		
		mBMainPlayerBoy = true;
		ScenePlayerMgr.SetMainPlayerLoverAccount(mLoveAccount);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_SELF_HOUSE),obj);
	} else if(mAccount == mHostLoveAccount) {
		mHouseID = obj.house_id;
		mLoveAccount = obj.boy;
		
		mBMainPlayerBoy = false;
		ScenePlayerMgr.SetMainPlayerLoverAccount(mLoveAccount);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_SELF_HOUSE),obj);
	} else {
		//mHostHouseID = obj.house_id;
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_FRIEND_HOUSE), obj);
		VisitFriend(mHostAccount);
		VisitFriend(mHostLoveAccount);
	}
}

function HandleRequestEnterFriendHouse(evt:GameEvent, obj:int) {
	if(obj > 0 && obj <= mCurrPageData.Count) {
		var account : String = (mCurrPageData[obj-1] as FriendInfo).account;
		ReqEnterFriendHouse(account,enter_house_type.eht_friend_list);
	} else {
		ExternalFlatform.InviteFriends();
	}
}

function HandleRequestReturnHouse(evt:GameEvent, obj:System.Object) {
	ReqEnterFriendHouse(mAccount,enter_house_type.eht_owner_house);
}

function HandleRequestInviteFriend(evt:GameEvent, obj:System.Object) {
    ExternalFlatform.InviteFriends();
}

function HandleRequestUpdateFriendItem(evt:GameEvent, obj:FriendImage) {
	for(var friend : FriendInfo in mFriendList) {
		if(friend.account == obj.account) {
			friend.name = obj.name;
			friend.headIcon = obj.image;
			break;
		}
	}
}

//client request
function ReqFriendList() {
	var packet:req_friend_list = new req_friend_list();
	NetHelper.Send(packet);
}

function ReqEnterFriendHouse(account : String,enterType : int) {
    if (account != mHostAccount && account != mHostLoveAccount || EQGameSceneMgr.getSingleton().gameSceneType() != SceneType.PLAYER_HOUSE ) {
		//EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_UPDATE_OWNER_INFO),"");
		//EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_UPDATE_LOVER_INFO),"");
		Global.SetCurVisitHouseAccount(account);
		var packet:req_enter_player_house = new req_enter_player_house();
		packet.account = account;
		packet.type = enterType;
		NetHelper.Send(packet);
		
		ReqHouseVisitLogAdd();
	} else {
		UI.getUI().OpenMsgbox("", Define.getContent(5091),true);
	}
}

//--
function ReqHouseVisitLogAdd()
{
	var req_account:String = ScenePlayerMgr.getMainPlayerAccount();
	var req_guest:String = DataCenter.getCurPlayerName();
	if(req_account != null && req_guest != null){
		if(req_account != ""){
			var pack:req_house_visit_log_add = new req_house_visit_log_add();
			pack.account = req_account;
			pack.guest = req_guest;
			pack.openid = req_account;
			NetHelper.Send(pack);
		}
	}
}
function ReqFriendVisitRecord(account : String) {
	var packet:req_daily_visit = new req_daily_visit();
	packet.account = account;
	NetHelper.Send(packet);
}

//logic function for external interface
function GetFriendHouseID(account : String) : UInt64 {
	for(var friend :FriendInfo in mFriendList) {
		if(friend.account == account) {
			return friend.houseID;
		}
	}
	if(account == mLoveAccount || account == mAccount) {
		return mHouseID;
	}
	if(account == mHostAccount || account == mHostLoveAccount) {
		return mHostHouseID;
	}
	return 0;
}

function GetFriendName(account : String) : String {
	for(var friend :FriendInfo in mFriendList) {
		if(friend.account == account) {
			return friend.name;
		}
	}
	if(ResManager.platformResMgr.IsExist(account)) {
		var info : player_basic_information = ResManager.platformResMgr.GetUserInfo(account);
		return info.nickname;
	}
	return "";
}

function GetFriendImage(account : String) : Texture {
	for(var friend : FriendInfo in mFriendList) {
		if(friend.account == account) {
			return friend.headIcon;
		}
	}
	return null;
}

public function RefreshPlant(account : String, active : boolean) {
	for(var friend : FriendInfo in mFriendList) {
		if(friend.account == account) {
			friend.bPlantActive = active;
			break;
		}
	}
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_REFRESH_ATTENTION_INTERFACE));
}

public function IsHavePlantEvent() : boolean {
	for(var friend : FriendInfo in mFriendList) {
		if(friend.bPlantActive == true) {
			return true;
		}
	}
	
	return false;
}


//logic function for interal
function RefreshListData(data : Array,page_num : int,move_num : int) {
	var startPos = mStartPos + move_num;
	var endPos = mEndPos + move_num;
	if(move_num >= 0) {
		if(data.length < page_num) {
			startPos = 0;
			endPos = data.length-1;
		} else {
			if(startPos < 0) {
				startPos = 0;
			}
			if(endPos > data.length-1) {
				endPos = data.length-1;
			}
			else if(endPos < page_num-1) {
				endPos = page_num-1;
			}
		}
	} else {
		if(startPos < 0) {
			startPos = 0;
		}
		if(endPos-startPos < page_num-1) {
			if(startPos + page_num > data.length) {
				endPos = data.length-1;
			} else {
				endPos = startPos + page_num - 1;
			}
		}
	}
	
	mCurrPageData.Clear();
	
	for(var i = startPos; i<=endPos; i++) {
		mCurrPageData.Push(data[i]);
	}
	
	mStartPos = startPos;
	mEndPos = endPos;
}

function RefreshOwnerHeadInfo() {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_UPDATE_OWNER_INFO),mHostAccount);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_UPDATE_LOVER_INFO),mHostLoveAccount);
}

function RefreshVisitRecord(account : String) {
	var item : FriendItem = new FriendItem();
	
	for(var i=0; i<mCurrPageData.Count; i++) {
		if((mCurrPageData[i] as FriendInfo).account == account) {
			item.idx = i+1;
			item.bVisit = true;
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_UPDATE_FRIEND_VISIT),item);
			break;
		}
	}	
}

function Reset() {
	mFriendList.Clear();
	mCurrPageData.Clear();
	mStartPos = 0;
	mEndPos = 5;
}

function IsVisited(account : String) {
	for(var friend : FriendInfo in mFriendList) {
		if(friend.account == account && friend.bVisit == true) {
			return true;
		}
	}
	if(account == mLoveAccount || account == mAccount) {
		return true;
	}
	return false;
}

function VisitFriend(account : String) {
	for(var friend : FriendInfo in mFriendList) {
		if(friend.account == account) {
			friend.bVisit = true;
			break;
		}
	}
	
	RefreshVisitRecord(account);
}

function IsInSelfHouse() : boolean {
	return mHouseID == mHostHouseID;
}

function IsMainPlayerBoy() : boolean {
	return mBMainPlayerBoy;
}

function GetHostAccount() : String {
	return mHostAccount;
}

function GetHostLoverAccount() : String {
	return mHostLoveAccount;
}

function IsSingle() : boolean {
	return mHostLoveAccount == "" || mHostAccount == "";
}

function IsDataRecv() : boolean {
	return mDataRecv;
}

function GetFriendAccountByIndex(index : int) : String {
	if(index > 0 && index <= mCurrPageData.Count) {
		return (mCurrPageData[index-1] as FriendInfo).account;
	}
	return "";
}

function CompareFun(obj1 : System.Object, obj2 : System.Object) : int
{
	var com1 : FriendInfo = obj1 as FriendInfo;
	var com2 : FriendInfo = obj2 as FriendInfo;
		
	if (com1.level == com2.level)
		return 0;
		
	if (com1.level < com2.level)
		return 1;
		
	return -1;
}

//data operate
public function GetNextPage() : ArrayList {
	if(mPage == null) return null;
	 
	return mPage.NextPage();
}
	
public function GetPrePage() : ArrayList {
	if(mPage == null) return null;
	
	return mPage.PrevPage();
}
	
public function GetCurrData() : ArrayList {
	if(mPage == null) return null;
	
	return mPage.CurrPage();
}
	
public function GetPageData(page : int) : ArrayList {
	if(mPage == null) return null;
	
	return mPage.GetPage(page);
}
	
public function GetTotalPageNum() : int {
	if(mPage == null) return 0;
	
	return mPage.GetTotalPage();
}
	
public function GetCurrPageNum() : int {
	if(mPage == null) return 0;
	
	return mPage.GetPageIndex();
}

public function GetFriendList() : Array {
	return mFriendList;
}

public function GetFriendInfo(account : String) : FriendInfo {
	for(var info : FriendInfo in mFriendList) {
		if(info.account == account) {
			return info;
		}
	}
	
	return null;
}

public function GetIntimate(account : String) : FriendIntimateRow {
	var info : FriendInfo = GetFriendInfo(account);
	if(info == null) return null;
	
	var level : int = 0;
	for(var data : DictionaryEntry in ResManager.LgtMgr.FriendIntimateTable) {
		var row : FriendIntimateRow = data.Value;
		var temp : int = 0;
		
		if(row.toplimit > info.intimate) {
			temp = row.level;
		}
		if(level == 0) {
			level = temp;
		} else {
			level = level > temp ? temp : level;
		}
	}
	
	return ResManager.LgtMgr.FriendIntimateTable[level];
}