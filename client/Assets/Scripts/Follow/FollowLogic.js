/*
//dress net center
//creat by fullzhu 2012.3.14
//last edit at 2012.3.14 by fullzhu
*/
#pragma strict
#pragma downcast
class FollowAttention extends PlatResInfoCtrl {

	//overwrite
	public function Callback() {
	 	FollowNet.GetInstance().ReqAddAttention(account,info.nickname);
	 } 
}

class FollowInfo {
	public var account : String;
	public var bPlantActive : boolean;
}

class FollowShare {
	var account : String;
	var title : String;
	var des : String;
	var summary : String;
	
	public function Callback(data:Hashtable) {
	 	var info : player_basic_information = data[account];
	 	if(info) {
			var url : String = PlatResLoaderMgr.ImageURLReplace(info.imageurl,IMAGE_TYPE.IMGTYPE_BIG);
	 		ExternalFlatform.Share(share_type.st_attention, des, title, summary, url);
	 	}
	 } 
}

private var mAttentionList : ArrayList = new ArrayList();				//struct FollowInfo

private var mPage : PagerMgr;
private var mPerPagenum : int = 8;

private var mInit : boolean = false;
private var mDataRecv : boolean = false;

private static var instance : FollowLogic;
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
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOUSE_CREATED), HandleNotifyHouseOwnerInfo);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ADD_ATTENTION), HandleNotifyAddAttention);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_CANCEL_ATTENTION), HandleNotifyCancelAttention);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ATTENTION_LIST), HandleNotifyAttentionList);
}

//hanlde game event
function HandleNotifyHouseOwnerInfo(evt:GameEvent, obj:house_info) {
	Init();
}
function HandleNotifyAddAttention(evt:GameEvent, obj:notify_add_attention) {
	var info : FollowInfo = new FollowInfo();
	info.account = obj.info.account;
	info.bPlantActive = obj.info.crop_event == 0 ? false : true;
	mAttentionList.Insert(0,info);
	
	var share : FollowShare = new FollowShare();
	share.account = obj.info.account;
	share.title = Define.getContent(5098);
	share.des = Define.getContent(5099);
	share.summary = Define.getContent(5100);
	var platResMgr : PlatformResMgr = ResManager.platformResMgr;
	var idArray : Array = new Array();
	idArray.Add(obj.info.account);
	platResMgr.GetUserInfo(share.Callback,idArray);
	
	RefreshInterface();
}

function HandleNotifyCancelAttention(evt:GameEvent, obj:notify_cancel_attention) {
	var idx : int = -1;
	for(var i=0; i<mAttentionList.Count; i++) {
		var info : FollowInfo = mAttentionList[i] as FollowInfo;
		if(info.account == obj.account) {
			idx = i;
			break;
		}
	}
	if(idx != -1) {
		mAttentionList.RemoveAt(idx);
		RefreshInterface();
		
	}
}

function HandleNotifyAttentionList(evt:GameEvent, obj:notify_attention_list) {
	mAttentionList.Clear();
	for(var follow : friend_item in obj.attentions) {
		var info : FollowInfo = new FollowInfo();
		info.account = follow.account;
		info.bPlantActive = follow.crop_event == 0 ? false : true;
		mAttentionList.Add(info);
	}
	
	OnRecvListData();
	RefreshInterface();
}

//logic function for external interface
function Init() {
	if(!mInit) {
		FollowNet.GetInstance().ReqGetAttentionList();
		mInit = true;
	}
}

function Clear() {
	mAttentionList.Clear();
	
	mPage = new PagerMgr(mAttentionList,mPerPagenum);
}

function OnRecvListData() {
	mPage = new PagerMgr(mAttentionList,mPerPagenum);
	
	mDataRecv = true;
	
	if(SocialLogic.GetInstance().IsHavePlantEvent()) {
		if(PaoPaoControl.GetPpCtrol(iGUICode_MainUI.getInstance().SocialPlantPP) == null)
			new PaoPaoControl(30000,0,2000,1,iGUICode_MainUI.getInstance().SocialPlantPP, iGUICode_MainUI.getInstance().social_btn);
	}
}

function RefreshInterface() {
	if(mPage == null) {
		mPage = new PagerMgr(mAttentionList,mPerPagenum);
	} else {
		mPage.ResetData(mAttentionList);
	}
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_REFRESH_ATTENTION_INTERFACE));
}

function AddAttention(account : String) {
	if(account==null || account == "") {
		Debug.LogWarning("invalid account");
		return ;
	}
	
	if(!CheckAdd(account)) {
		return ;
	}
	
	var attention : FollowAttention = new FollowAttention();
	attention.account = account;
	Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(account,attention);
}

function RemoveAttention(account : String) {
	if(account==null || account == "") {
		Debug.LogWarning("invalid account");
	}
	
	FollowNet.GetInstance().ReqCancelAttention(account);
}

function SendGift(account : String) {
	//iGUICode_FollowUI.getInstance().Enable(false);	// step1
	GiftLogic.Ctrl.Set("receive_account", account);		// step2
	GiftLogic.Ctrl.Excute("open_gift_make_ui", true);	// step3
}

function Visit(account : String) {
	if(account==null || account == "") {
		Debug.LogWarning("invalid account");
		return ;
	}
	
	PlayerFriend.GetInstance().ReqEnterFriendHouse(account,enter_house_type.eht_attention);
}

function VisitHomePage(account : String) {
	if(account == null || account == "") {
		Debug.Log("invalid account!!");
		return ;
	}
	
	ExternalFlatform.gotoFriendHomePage(account);
}

function MakeFriend(account : String) {
	if(account == null || account == "") {
		Debug.Log("invalid account!!");
		return ;
	}
	
	var content : String = Define.getContent(5101);
	// 其他入口
	if (false == PlatformMgr.IsPlatQZone())
	{
		UI.getUI().OpenMsgbox("", content, true);
		return;
	}
	// QQ空间
	var name : String = DataCenter.getPlayerName(account);
	content = Define.getContent(5102, [name]);
	UI.getUI().OpenMsgbox("", content, true);
	
	ExternalFlatform.ReqMakeFriend(account);
}

function IsDataRecv() : boolean {
	return mDataRecv;
}

public function RefreshPlant(account : String, active : boolean) {
	for(var info : FollowInfo in mAttentionList) {
		if(info.account == account) {
			info.bPlantActive = active;
			RefreshInterface();
			break;
		}
	}
}

public function IsHavePlantEvent() : boolean {
	for(var info : FollowInfo in mAttentionList) {
		if(info.bPlantActive == true) {
			return true;
		}
	}
	
	return false;
}

//logic function for interal
function CheckAdd(account : String) : boolean {
	if(account==null || account == "") {
		Debug.LogWarning("invalid account");
		
		return false;
	}
	
	return true;
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