#pragma strict
#pragma downcast
import iGUI;

public class TextInfo {
	public var id : UInt64;
	public var text : String;
	public var closeEnable : boolean;
	public var timeStr : String;
	public var account : String;
	public var opened : int;
}

class MessagePlatShow {
	public var headImage : System.Object;
	public var nameLabel : System.Object;
	public var image : Texture;
	public var account : String;
	public var nickName : String;
	public var bValid : boolean;
}

class MessageInfo {
	var info : TextInfo = new TextInfo();
	var smartobject : iGUIElement;
}

class MessageIcon extends PlatResInfoCtrl {
	public var imageElement : iGUIImage;
	public var nameElement : iGUILabel;
	
	//overwrite
	public function Callback() {
		if(URLValid) {
			imageElement.image = image;
		} else {
			imageElement.image = Resources.Load("UISkins/Textures/Common1/default_avatar");
		}
		if(info.nickname == "") {
			nameElement.label.text = Define.unknow;
		} else {
			nameElement.label.text = info.nickname;
		}
	}
}

private var maxPageNum : int = 30;
private var mInit : boolean = false;
private var mKeyShieldEnable : boolean = false;

private var mAccount : String;
private var mLoverAccount : String;
private var mHostAccount : String;
private var mHostLoverAccount : String;

private var mMessageInfo : ArrayList = new ArrayList();			//struct TextInfo
private var mPageMessageInfo : ArrayList = new ArrayList();		//struct TextInfo
private var mMessageData : ArrayList = new ArrayList();			//struct MessageInfo

private var mPage : PagerMgr;

function Start() {
	Init();
}


function Init() {
	ScrollInput.areaHeight = 1;
	ScrollMessage.areaHeight = 1;
	
	WordsLimit.label.text = "140";
	BtnPage1.label.text = "1";
	BtnPage1.userData = 1;
	BtnPage2.label.text = "2";
	BtnPage2.userData = 2;
	BtnPage3.label.text = "3";
	BtnPage3.userData = 3;
	BtnPage4.label.text = "4";
	BtnPage4.userData = 4;
	BtnPage5.label.text = "5";
	BtnPage5.userData = 5;
	PermissionBtn.userData = 1;
	
	//btn event
	
	BtnSend.clickCallback = CallbackClickSendEvt;
	BtnClose.clickCallback = CallbackClickCloseEvt;
	BtnPage1.clickCallback = CallbackClickPageNum;
	BtnPage2.clickCallback = CallbackClickPageNum;
	BtnPage3.clickCallback = CallbackClickPageNum;
	BtnPage4.clickCallback = CallbackClickPageNum;
	BtnPage5.clickCallback = CallbackClickPageNum;
	BtnPageRight.clickCallback = CallbackNextPage;
	//BtPageRightStep.clickCallback = CallbackNextPageStep;
	BtnPageLeft.clickCallback = CallbackPrePage;
	//BtnPageLeftStep.clickCallback = CallbackPrePageStep;
	TextInput.valueChangeCallback = CallbackInputValueChange;
	TextInput.focusCallback = CallbackInputFocus;
	TextInput.blurCallback = CallbackInputBlur;
	PermissionBtn.clickCallback = CallbackClickPermissionBtn;
	
	mInit = true;
}

function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_MESSAGE_DATA), HandleEventMessageData);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_MESSAGE_DELETE), HandleEventMessageDel);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_MESSAGE_ADD), HandleEventMessageAdd);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_MESSAGE_VISIT), HandleEventMessageVisit);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_MESSAGE_FOLLOW), HandleEventMessageFollow);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_MESSAGE_PERMISSION), HandleEventMessagePermission);
}

public function AddText(id : UInt64, text : String, time : String, account : String, opened : int, enable : boolean, bInsert : boolean) {
	var info : TextInfo = new TextInfo();
	info.id = id;
	info.text = text;
	info.closeEnable = enable;
	info.timeStr = time;
	info.account = account;
	info.opened = opened;
	
	if(bInsert) {
		mMessageInfo.Insert(0,info);
	} else {
		mMessageInfo.Add(info);
	}
}

public function GetText(id : UInt64) {
	for(var info in mMessageInfo) {
		var data : TextInfo = info as TextInfo;
		if(data.id == id) {
			return data.text;
		}
	}
	return "";
}

public function DelText(id : UInt64) {
	var idx : int = -1;
	for(var i=0; i<mMessageInfo.Count; i++) {
		var data : TextInfo = mMessageInfo[i] as TextInfo;
		if(data.id == id) {
			idx = i;
			break;
		}
	}
	if(idx != -1) {
		mMessageInfo.RemoveAt(idx);
	}
}

public function Clear() {
	ScrollMessage.areaHeight = 1;
	ScrollMessage.removeAll();
	TextInput.value = "";
	
	mMessageInfo.Clear();
	mPageMessageInfo.Clear();
	mMessageData.Clear();
}

private function GetTimeStr(time : stime) : String {
	var str : String = "";
	str += time.year+"-"+time.month+"-"+time.day+"  ";
	if(time.hour < 10) {
		str += "0"+time.hour;
	} else {
		str += time.hour;
	}
	str += ":";
	if(time.minute < 10) {
		str += "0"+time.minute;
	} else {
		str += time.minute;
	}
	str += "  " + Define.message;
	return str;
}

public function GetMessageInfo(id : UInt64) : MessageInfo {
	for(var i=0; i<mMessageData.Count; i++) {
		var data : MessageInfo = mMessageData[i] as MessageInfo;
		if(data.info.id == id) {
			return data;
		}
	}
	return null;
}

private function GetMessageData(id : UInt64) : int {
	for(var i=0; i<mMessageData.Count; i++) {
		var data : MessageInfo = mMessageData[i] as MessageInfo;
		if(data.info.id == id) {
			return i;
		}
	}
	return -1;
}

private function AddItem(info : TextInfo, bInsert : boolean) {
	var message : MessageInfo = new MessageInfo();
	message.info = info;
	message.smartobject = ScrollMessage.addSmartObject("SOMessagePanel");
	message.smartobject.userData = info.id;
	if (bInsert == true) {
		mMessageData.Insert(0,message);
	} else {
		mMessageData.Add(message);
	}
	
	var del_btn : iGUIButton = message.smartobject.items[0];
	var permission_btn : iGUIButton = message.smartobject.items[1];
	var icon_img : iGUIImage = message.smartobject.items[2];
	var name_lab : iGUILabel = message.smartobject.items[3];
	var text_lab : iGUILabel = message.smartobject.items[4];
	var time_lab : iGUILabel = message.smartobject.items[5];
	var follow_btn : iGUIButton = message.smartobject.items[6];
	var visit_btn : iGUIButton = message.smartobject.items[7];
	
	del_btn.setEnabled(info.closeEnable);
	time_lab.label.text = info.timeStr;
	follow_btn.setEnabled(info.account == mAccount ? false : true);
	CheckPermission(info, text_lab, permission_btn);
	
	var platInfo : MessageIcon = new MessageIcon();
	platInfo.imageElement = icon_img;
	platInfo.nameElement = name_lab;
	Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(info.account,platInfo);
	
	if (mMessageData.Count > maxPageNum) {
		var data : MessageInfo = mMessageData[mMessageData.Count-1] as MessageInfo;
		ScrollMessage.removeElement(data.smartobject);
		mMessageData.RemoveAt(mMessageData.Count-1);
	}
}

private function DelItem(id : UInt64) {
	var idx : int = GetMessageData(id);
	if(idx != -1) {
		var data : MessageInfo = mMessageData[idx] as MessageInfo;
		ScrollMessage.removeElement(data.smartobject);
		mMessageData.RemoveAt(idx);
		
		var curPage : int = mPage.GetPageIndex();
		if(mMessageInfo.Count > curPage*maxPageNum) {
			AddItem(mMessageInfo[curPage*maxPageNum],false);
		}
	
		if(mMessageData.Count == 0) {
			CallbackPrePage(null);
		}
		
		Refresh();
	}
}

private function CheckPermission(info : TextInfo, text_label : iGUILabel, permission_btn : iGUIButton) : void
{
	text_label.style.wordWrap = true;
	var visible : boolean = false;
	// 在自己家,或自己的留言
	if (DataCenter.isInSelfHouse() || info.account == DataCenter.getMainPlayerAccount()) {
		visible = true;
	}
	var text : String = mKeyShieldEnable ? Global.GetKeyWordShield().Search(info.text) : info.text;
	// 不是在自己家和自己的留言,并且被加锁
	if (false==visible && 0==info.opened) {
		text = Define.getContent(5130);
	}
	text_label.label.text = text;
	permission_btn.userData = info;
	permission_btn.setEnabled(visible);
	SetItemPermissionBtn(permission_btn, info.opened);
}

private function SetItemPermissionBtn(permission_btn : iGUIButton, open : int) : void
{
	var normal : String = (0 == open ? "locked_blue" : "unlock_blue");
	var hover : String = (0 == open ? "locked_blue_h" : "unlock_blue_h");
	permission_btn.style.normal.background = Resources.Load("UISkins/Textures/love_check _in/" + normal);
	permission_btn.style.hover.background = Resources.Load("UISkins/Textures/love_check _in/" + hover);
	permission_btn.style.active.background = Resources.Load("UISkins/Textures/love_check _in/" + normal);
}

//logic function
var rootArray : Array;
public function Active(bActive : boolean) {
	if(mInit == false) {
		Init();
	}
	
	UI.getUI().EnableUIRoot("MessageUI",bActive);
	var kRoot : Array = new Array();
	kRoot.Add("MessageUI");
	if(bActive) {
		Clear();
		mAccount = MessageMgr.GetAccount();
		mLoverAccount = MessageMgr.GetLoverAccount();
		mHostAccount = MessageMgr.GetHostAccount();
		mHostLoverAccount = MessageMgr.GetHostLoverAccount();
	
		MessageMgr.GetInstance().ReqHouseMessage();
		SetHouseName();
		
		rootArray = UI.getUI().EnableUIRootIgnore(kRoot,false);
	} else {
		UI.getUI().EnableUIRoot(rootArray,true);
	}
}

public function PageNumEnable() {
	var pageNum = mPage.GetTotalPage();
	var currPage = mPage.GetPageIndex();
	
	if(currPage == 1) {
		BtnPageLeft.passive = true ;
	} else {
		BtnPageLeft.passive = false ;
	}
	if(currPage >= pageNum) {
		BtnPageRight.passive = true ;
	} else {
		BtnPageRight.passive = false ;
	}
	
	if(pageNum == 0) {
		pageNum = 1;
	}
	LabPage.label.text = currPage + "/" + pageNum;
}

public function RefreshPage() {
	ScrollMessage.removeAll();
	mMessageData.Clear();
	
	for(var info in mPageMessageInfo) {
		AddItem(info,false);
	}
	
	Refresh();
}

private function Refresh() {
	var startPos : float = 0.0;
	for(var message in mMessageData) {
		var data : MessageInfo = message as MessageInfo;
		data.smartobject.setY(startPos);
		startPos += data.smartobject.rect.height + 10;
	}

	ScrollMessage.areaHeight = startPos/ScrollMessage.rect.height;
	ScrollMessage.refreshRect();
	ScrollMessage.refreshStyle();
	
	PageNumEnable();
}

//callback
public function CallbackClickEvt(callback : iGUIElement) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_DEL_MESSAGE),callback.userData);
}

public function CallbackClickSendEvt(callback : iGUIElement) {
	if(TextInput.value != "") {
		MessageMgr.GetInstance().ReqSendMessage(TextInput.value, PermissionBtn.userData);
		TextInput.value = "";
		WordsLimit.label.text = "140";
		SetPermissionBtn(1);
	} else {
		UI.getUI().OpenMsgbox("", Define.getContent(5179),true);
	}
}

public function CallbackClickPageNum(callback : iGUIElement) {
	if(mPage && mMessageInfo.Count > 0) {
		var page : int = callback.userData; 
		mPageMessageInfo = mPage.GetPage(page);
		RefreshPage();
	}
}

public function CallbackNextPage(callback : iGUIElement) {
	var pageNum = mPage.GetTotalPage();
	var currPage = mPage.GetPageIndex();
	if(mPage && mMessageInfo.Count > 0 && currPage < pageNum) {
		mPageMessageInfo = mPage.NextPage();
		RefreshPage();
	}
}

public function CallbackNextPageStep(callback : iGUIElement) {
}

public function CallbackPrePage(callback : iGUIElement) {
	var pageNum = mPage.GetTotalPage();
	var currPage = mPage.GetPageIndex();
	if(mPage && mMessageInfo.Count > 0 && currPage != 1) {
		mPageMessageInfo = mPage.PrevPage();
		RefreshPage();
	}
}

public function CallbackPrePageStep(callback : iGUIElement) {
}

public function CallbackInputValueChange(callback : iGUITextarea) {
	var length : int = 140-callback.value.Length;
	WordsLimit.label.text = length.ToString();
}

public function CallbackInputFocus(callback : iGUITextarea) {
	LabInputNotice.setEnabled(false);
}

public function CallbackInputBlur(callback : iGUITextarea) {
	if(callback.value == "") {
		LabInputNotice.setEnabled(true);
	}
}

public function CallbackClickCloseEvt(callback : iGUIElement) {
	Active(false);
}

public function CallbackClickPermissionBtn(callback : iGUIElement) {
	SetPermissionBtn(0 == callback.userData ? 1 : 0);
}

//handle event msg
function HandleEventMessageData(evt:GameEvent, obj:System.Object) {
	var data : 	notify_house_guest_book = obj as notify_house_guest_book;
	
	Clear();
	for(var book in data.guest_books) {
		var bookData : guest_book = book as guest_book;
		
		if(mAccount == mHostAccount) {
			if(bookData.account == mHostLoverAccount) {
				AddText(bookData.id,bookData.content,GetTimeStr(bookData.create_time),bookData.account,bookData.opened,false,false);
			} else {
				AddText(bookData.id,bookData.content,GetTimeStr(bookData.create_time),bookData.account,bookData.opened,true,false);
			}
		} else if(mAccount == mHostLoverAccount) {
			if(bookData.account == mHostAccount) {
				AddText(bookData.id,bookData.content,GetTimeStr(bookData.create_time),bookData.account,bookData.opened,false,false);
			} else {
				AddText(bookData.id,bookData.content,GetTimeStr(bookData.create_time),bookData.account,bookData.opened,true,false);
			}
		} else if(bookData.account == mAccount) {
			AddText(bookData.id,bookData.content,GetTimeStr(bookData.create_time),bookData.account,bookData.opened,true,false);
		} else {
			AddText(bookData.id,bookData.content,GetTimeStr(bookData.create_time),bookData.account,bookData.opened,false,false);
		}
	}
	
	mPage = new PagerMgr(mMessageInfo,maxPageNum);
	if(mMessageInfo.Count > 0) {
		mPageMessageInfo = mPage.CurrPage();
	}
	RefreshPage();
}

function HandleEventMessageDel(evt:GameEvent, obj:System.Object) {
	var delIdx : int = -1;
	var msg : notify_guest_book_delete = obj as notify_guest_book_delete;
	
	for(var i=0; i<mMessageInfo.Count; i++) {
		var data : TextInfo = mMessageInfo[i] as TextInfo;
		if(data.id == msg.id) {
			delIdx = i;
			break;
		}
	}
	if(delIdx != -1) {
		mMessageInfo.RemoveAt(delIdx);
		mPage.ResetData(mMessageInfo);
		
		DelItem(msg.id);
	}
}

function HandleEventMessageAdd(evt:GameEvent, obj:System.Object) {
	var data : notify_guest_book_add = obj as notify_guest_book_add;
	
	if(mAccount == mHostAccount) {
		if(data.item.account == mHostLoverAccount) {
			AddText(data.item.id,data.item.content,GetTimeStr(data.item.create_time),data.item.account,data.item.opened,false,true);
		} else {
			AddText(data.item.id,data.item.content,GetTimeStr(data.item.create_time),data.item.account,data.item.opened,true,true);
		}
	} else if(mAccount == mHostLoverAccount) {
		if(data.item.account == mHostAccount) {
			AddText(data.item.id,data.item.content,GetTimeStr(data.item.create_time),data.item.account,data.item.opened,false,true);
		} else {
			AddText(data.item.id,data.item.content,GetTimeStr(data.item.create_time),data.item.account,data.item.opened,true,true);
		}
	} else if(data.item.account == mAccount) {
		AddText(data.item.id,data.item.content,GetTimeStr(data.item.create_time),data.item.account,data.item.opened,true,true);
	} else {
		AddText(data.item.id,data.item.content,GetTimeStr(data.item.create_time),data.item.account,data.item.opened,false,true);
	}
	
	mPage.ResetData(mMessageInfo);
	
	if(mPage.GetPageIndex() == 1) {
		AddItem(mMessageInfo[0],true);
		Refresh();
	}
}

function HandleEventMessageVisit(evt:GameEvent, obj:System.Object) {
	var idx : int = GetMessageData(obj);
	if(idx == -1) {
		Debug.Log("invalid id!!");
		return ;
	}
	var data : MessageInfo = mMessageData[idx] as MessageInfo;
	var account : String = data.info.account;
	if(account==null || account == "") {
		Debug.LogWarning("invalid account");
		return ;
	}
	
	PlayerFriend.GetInstance().ReqEnterFriendHouse(account,enter_house_type.eht_guest_book);
}

function HandleEventMessageFollow(evt:GameEvent, obj:System.Object) {
	var idx : int = GetMessageData(obj);
	if(idx == -1) {
		Debug.Log("invalid id!!");
		return ;
	}
	
	var data : MessageInfo = mMessageData[idx] as MessageInfo;
	var account : String = data.info.account;
	if(account==null || account == "") {
		Debug.LogWarning("invalid account");
		return ;
	}
	
	FollowLogic.GetInstance().AddAttention(account);
}

function HandleEventMessagePermission(evt:GameEvent, btn:iGUIButton) {
	var info : TextInfo = btn.userData as TextInfo;
	info.opened = (0 == info.opened ? 1 : 0);	// 需要保存opened
	MessageMgr.GetInstance().ReqSetGuestBookOpened(info.id, info.opened);
	SetItemPermissionBtn(btn, info.opened);
}

function SetHouseName()
{
	var house_name : String = iGUICode_MainUI.MainUICtrl.Get("house_name") as String;
	if (null == house_name)
		return;
	if (PlayerFriend.GetInstance().IsInSelfHouse())
	{
		HouseName.setEnabled(false);
		return;
	}
	HouseName.setEnabled(true);
	HouseName.label.text = house_name;
	HouseName.label.tooltip = house_name;
}

function SetPermissionBtn(opened : int) : void
{
	PermissionBtn.userData = opened;
	if (1 == opened) {
		PermissionBtn.style.normal.background = Resources.Load("UISkins/Textures/Common1/toggle_empty");
	} else {
		PermissionBtn.style.normal.background = Resources.Load("UISkins/Textures/Common1/toggle_full");
	}
}

//iGUI
private static var instance : iGUICode_MessageUI;
function Awake(){
	instance=this;
	
	RegistEventMsg();
}
static function getInstance(){
	return instance;
}
@HideInInspector
var PermissionText : iGUILabel;
@HideInInspector
var PermissionBtn : iGUIButton;
@HideInInspector
var PermissionIcon : iGUIImage;
@HideInInspector
var HouseName : iGUILabel;
@HideInInspector
var LabPage : iGUILabel;
@HideInInspector
var LabInputNotice : iGUILabel;
@HideInInspector
var BtnSend : iGUIButton;
@HideInInspector
var BtnPageRight : iGUIButton;
@HideInInspector
var BtnPage5 : iGUIButton;
@HideInInspector
var BtnPage4 : iGUIButton;
@HideInInspector
var BtnPage3 : iGUIButton;
@HideInInspector
var BtnPage2 : iGUIButton;
@HideInInspector
var BtnPage1 : iGUIButton;
@HideInInspector
var BtnClose : iGUIButton;
@HideInInspector
var BtnPageLeft : iGUIButton;
@HideInInspector
var ScrollMessage : iGUIScrollView;
@HideInInspector
var TextMessage : iGUIContainer;
@HideInInspector
var ScrollInput : iGUIScrollView;
@HideInInspector
var TextInput : iGUITextarea;
@HideInInspector
var MessageUI : iGUIPanel;
@HideInInspector
var WordsLimit : iGUILabel;