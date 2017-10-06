#pragma strict
#pragma downcast
import iGUI;

class ContentDate {
	var date : stime;
	var panel : iGUIPanel;
	var checkinInfoList : ArrayList = new ArrayList();					//struct CheckinInfo
}

class CheckinInfo {
	var info : check_in = new check_in();
	var smartobject : iGUIElement;
}

class PageData {
	var start_id : String = "";
	var pageNum : int = 0;
}

private var mPage : PagerMgr;

private var mContentDateList : ArrayList = new ArrayList();				//struct ContentDate
private var mCheckinData : ArrayList = new ArrayList();					//struct check_in
private var mPageCheckinData : ArrayList = new ArrayList();				//current page checkin data struct check_in

private var mAccount : String = "";
private var mLoverAccount : String = "";
private var mHostAccount : String = "";
private var mHostLoveAccount : String = "";

private var mImage : Texture;
private var mLoverImage : Texture;

private var maxPageNum : int = 50;
private var strCutNum : int = 38;
private var mInit : boolean = false;
private var mKeyShieldEnable : boolean = false;
private var mHideOtherUIArray : Array = new Array();
public var NotHideUI : String[];

function Start() {
	Init();
}

//event regist
private function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_CHECKIN_ADD), HandleNotifyCheckinAdd);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_CHECKIN_LAST), HandleNotifyCheckinLast);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_CHECKIN_LIST), HandleNotifyCheckinList);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_CHECKIN_DEL), HandleNotifyCheckinDel);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_CHECKIN_PERMISSION), HandleEventCheckinPermission);
}

//handle game event
public function HandleNotifyCheckinAdd(evt:GameEvent, obj:System.Object) {
	if(CheckinMain.enabled) {
		var check : check_in = new check_in();
		var data : notify_checkin_add = obj as notify_checkin_add;
		Construct(data.item,check);
		mCheckinData.Insert(0,check);
		mPage.ResetData(mCheckinData);
	
		if(mPage.GetPageIndex() == 1) {
			AddItem(data.item,true);
			Refresh();
		}
	}
}

public function HandleNotifyCheckinLast(evt:GameEvent, obj:System.Object) {
	var data : notify_last_checkins = obj as notify_last_checkins;
	
	if(mImage == null) {
		mImage = new Texture2D(60,60);
	}
	mImage = iGUICode_MainUI.getInstance().GetOwnerImage();
	if(mLoverImage == null) {
		mLoverImage = new Texture2D(60,60);
	}
	mLoverImage = iGUICode_MainUI.getInstance().GetLoverImage();
	
	ImgMale.image = mImage;
	ImgFemale.image = mLoverImage;
	
	LabDate.label.text = GetTimeStr(Global.m_SysTime);
	LabMaleTime.label.text = GetTimeStrHour(data.owner.create_date);
	if(data.owner.content.Length > strCutNum) { 
		var str1 : String = data.owner.content.Substring(0,strCutNum)+"...";
		if(mKeyShieldEnable == true) {
			LabMaleMessage.label.text = Global.GetKeyWordShield().Search(str1);
		} else {
			LabMaleMessage.label.text = str1;
		}
	} else {
		if(mKeyShieldEnable == true)  {
			LabMaleMessage.label.text = Global.GetKeyWordShield().Search(data.owner.content);
		} else {
			LabMaleMessage.label.text = data.owner.content;
		}
	}
	
	LabFemaleTime.label.text = GetTimeStrHour(data.lover.create_date);
	if(data.lover.content.Length > strCutNum) {
		var str2 : String = data.lover.content.Substring(0,strCutNum)+"...";
		if(mKeyShieldEnable == true) {
			LabFemalMessage.label.text = Global.GetKeyWordShield().Search(str2);
		} else {
			LabFemalMessage.label.text = str2;
		}
	} else {
		if(mKeyShieldEnable == true) {
			LabFemalMessage.label.text = Global.GetKeyWordShield().Search(data.lover.content);
		} else {
			LabFemalMessage.label.text = data.lover.content;
		}
	}
	
	TxAreaInput.value = "";
	LabWordLimit.label.text = "140";
}

public function HandleNotifyCheckinList(evt:GameEvent, obj:System.Object) {
	var data : notify_checkin_list = obj as notify_checkin_list;
		
	if(mImage == null) {
		mImage = new Texture2D(60,60);
	}
	mImage = iGUICode_MainUI.getInstance().GetOwnerImage();
	if(mLoverImage == null) {
		mLoverImage = new Texture2D(60,60);
	}
	mLoverImage = iGUICode_MainUI.getInstance().GetLoverImage();
	
	Clear();
	mCheckinData = data.checkins.Clone();
	
	mPage = new PagerMgr(mCheckinData,maxPageNum);
	if(mCheckinData.Count > 0) {
		mPageCheckinData = mPage.CurrPage();
	}
	SwitchPage(mPageCheckinData);
	
}

public function HandleNotifyCheckinDel(evt:GameEvent, obj:System.Object) {
	var data : notify_checkin_delete = obj as notify_checkin_delete;
	
	var delIdx : int = -1;
	for(var i=0; i<mCheckinData.Count; i++) {
		var check : check_in = mCheckinData[i] as check_in;
		if(check.id == data.id) {
			delIdx = i;
			break;
		}
	}
	if(delIdx != -1) {
		mCheckinData.RemoveAt(delIdx);
		mPage.ResetData(mCheckinData);
		
		DelItem(data.id);
		Refresh();
	}
}

//data operate
public function GetContentDate(time : stime) : int {
	for(var i=0; i<mContentDateList.Count; i++) {
		var info : ContentDate = mContentDateList[i];
		if(info.date.year == time.year && info.date.month == time.month && info.date.day == time.day) {
			return i;
		}
	}
	return -1;
}

public function GetContentDate(id : String) : int {
	for(var i=0; i<mContentDateList.Count; i++) {
		var info : ContentDate = mContentDateList[i];
		for(var j=0; j<info.checkinInfoList.Count; j++) {
			var check : CheckinInfo = info.checkinInfoList[j];
			if(check.info.id == id) {
				return i;
			}
		}
	}
	return -1;
}

public function GetCheckinInfo(content_idx : int, id : String) : int {
	if(content_idx < 0 || content_idx >= mContentDateList.Count) return -1;
	
	var info : ContentDate = mContentDateList[content_idx];
	for(var i=0; i<info.checkinInfoList.Count; i++) {
		var checkInfo : CheckinInfo = info.checkinInfoList[i] as CheckinInfo;
		var check : check_in = checkInfo.info;
		if(check.id == id) {
			return i;
		}
	}
	
	return -1;
}

private function GetTimeStr(time : stime) : String {
	var str : String = "";
	str += time.year+"-"+time.month+"-"+time.day;
	return str;
}

private function GetTimeStrHour(time : stime) : String {
	var str : String = "";
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
	return str;
}

private function GetShowCheckinCount() : int {
	var totalCount : int = 0;
	for(var i=0; i<mContentDateList.Count; i++) {
		var info : ContentDate = mContentDateList[i];
		for(var j=0; j<info.checkinInfoList.Count; j++) {
			totalCount++;
		}
	}
	return totalCount;
}

//extern function
public function ActiveSmart(active : boolean) {
	CheckinSmart.setEnabled(active);
	
	mAccount = PlayerCheckin.GetInstance().GetAccount();
	mLoverAccount = PlayerCheckin.GetInstance().GetLoverAccount();
	mHostAccount = PlayerCheckin.GetInstance().GetHostAccount();
	mHostLoveAccount = PlayerCheckin.GetInstance().GetHostLoverAccount();
		
	if(active == true) {
		if(mInit == false) {
			Init();
		}
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_CHECKIN_LAST));
	} else {
		if(mAccount == mHostAccount || mAccount == mHostLoveAccount) {
		}
	}
}

public function ActiveMain(active : boolean) {	
	CheckinMain.setEnabled(active);
	
	mAccount = PlayerCheckin.GetInstance().GetAccount();
	mLoverAccount = PlayerCheckin.GetInstance().GetLoverAccount();
	mHostAccount = PlayerCheckin.GetInstance().GetHostAccount();
	mHostLoveAccount = PlayerCheckin.GetInstance().GetHostLoverAccount();
	
	if(active) {
		mHideOtherUIArray = UI.EnableUIRootIgnore(NotHideUI, false);
		if(mInit == false) {
			Init();
		}
		
		if(mAccount == mHostAccount || mAccount == mHostLoveAccount) {
			PanInput.setEnabled(true);
		} else {
			PanInput.setEnabled(false);
		}
		
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_CHECKIN_LIST));
		SetHouseName();
		RefreshUI();
	} else {
		UI.getUI().EnableUIRoot(mHideOtherUIArray, true);
		mHideOtherUIArray.Clear();
	}
}

public function AddItem(info : check_in, bInsert : boolean) {
	var content_idx : int = GetContentDate(info.create_date);
	var content : ContentDate;
	var check : CheckinInfo = new CheckinInfo();
	if(content_idx == -1) {
		content = new ContentDate();
		content.date = info.create_date;
		content.panel = SVContent.addElement("iGUIPanel",Rect(120,0,662,40));
		content.panel.style.normal.background = null;
		content.panel.style.normal.textColor = Color.white;
		content.panel.style.contentOffset = Vector2(-104,23);
		content.panel.style.padding.bottom = 0;
		content.panel.label.text = GetTimeStr(info.create_date);
		Construct(info,check.info);
		if(info.account == mHostAccount) {
			check.smartobject = content.panel.addSmartObject("SOCheckinMalePan");
		} else {
			check.smartobject = content.panel.addSmartObject("SOCheckinFemalePan");
		}
		if(bInsert) {
			content.checkinInfoList.Insert(0,check);
			mContentDateList.Insert(0,content);
		} else {
			content.checkinInfoList.Add(check);
			mContentDateList.Add(content);
		}
	} else {
		content = mContentDateList[content_idx];
		Construct(info,check.info);
		if(info.account == mHostAccount) {
			check.smartobject = content.panel.addSmartObject("SOCheckinMalePan");
		} else {
			check.smartobject = content.panel.addSmartObject("SOCheckinFemalePan");
		}
		if(bInsert) {
			content.checkinInfoList.Insert(0,check);
		} else {
			content.checkinInfoList.Add(check);
		}
	}
	
	check.smartobject.userData = info.id;
	
	var del_btn : iGUIButton = check.smartobject.items[0];
	var permission_btn : iGUIButton = check.smartobject.items[1];
	var icon_img : iGUIImage = check.smartobject.items[2];
	var content_lab : iGUILabel = check.smartobject.items[3];
	var time_lab : iGUILabel = check.smartobject.items[4];
	
	// 删除按钮
	if(mAccount == mHostAccount && info.account == mAccount) {
		del_btn.setEnabled(true);
	} else if(mAccount == mHostLoveAccount && info.account == mAccount) {
		del_btn.setEnabled(true);
	} else {
		del_btn.setEnabled(false);
	}
	// 时间
	time_lab.label.text = GetTimeStrHour(info.create_date);
	// 头像
	if(info.account == mHostAccount) {
		icon_img.image = mImage;
	} else {
		icon_img.image = mLoverImage;
	}
	// 内容,权限按钮
	CheckPermission(info, check.smartobject, content_lab, permission_btn);
	
	var count : int = GetShowCheckinCount();
	if(count > maxPageNum) {
		var delContent : ContentDate = mContentDateList[mContentDateList.Count-1];
		var delCheck : CheckinInfo = delContent.checkinInfoList[delContent.checkinInfoList.Count-1];
		delContent.panel.removeElement(delCheck.smartobject);
		delContent.checkinInfoList.RemoveAt(delContent.checkinInfoList.Count-1);
		if(delContent.checkinInfoList.Count == 0) {
			SVContent.removeElement(delContent.panel);
			mContentDateList.RemoveAt(mContentDateList.Count-1);
		}
	}
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.ADD_CHECKIN_ITEM));
}

public function DelItem(id : String) {
	var content_idx : int = GetContentDate(id);
	if(content_idx != -1) {
		var check_idx : int = GetCheckinInfo(content_idx,id);
		if(check_idx != -1) {
			var content : ContentDate = mContentDateList[content_idx];
			var check : CheckinInfo = content.checkinInfoList[check_idx];
			content.panel.removeElement(check.smartobject);
			content.checkinInfoList.RemoveAt(check_idx);
			if(content.checkinInfoList.Count == 0) {
				SVContent.removeElement(content.panel);
				mContentDateList.RemoveAt(content_idx);
			}
		}
	}
	
	var curPage : int = mPage.GetPageIndex();
	if(mCheckinData.Count > curPage*maxPageNum) {
		AddItem(mCheckinData[curPage*maxPageNum],false);
	}
}

private function CheckPermission(info : check_in, panel : iGUIPanel, text_label : iGUILabel, permission_btn : iGUIButton) : void
{
	text_label.style.wordWrap = true;
	var visible : boolean = false;
	// 在自己家,或自己的留言
	if (DataCenter.isInSelfHouse() || info.account == DataCenter.getMainPlayerAccount()) {
		visible = true;
	}
	// 不在自己家和自己的留言,并且被加锁
	var text : String = mKeyShieldEnable ? Global.GetKeyWordShield().Search(info.content) : info.content;
	if (false==visible && 0==info.opened) {
		text = Define.getContent(5130);
	}
	var height : float = text_label.style.CalcHeight(GUIContent(text), text_label.rect.width);
	if (height > text_label.rect.height) {
		text_label.setHeight(height);
		if (text_label.rect.height > panel.rect.height) {
			panel.setHeight(text_label.rect.height + 15);
		}
	}
	text_label.label.text = text;
	permission_btn.userData = info;
	permission_btn.setEnabled(visible);
	SetItemPermissionBtn(info.account == mHostAccount ? true : false, permission_btn, info.opened);
}

private function SetItemPermissionBtn(male : boolean, permission_btn : iGUIButton, open : int) : void
{
	var normal : String = (0 == open ? "locked_red" : "unlock_red");
	var hover : String = (0 == open ? "locked_red_h" : "unlock_red_h");
	if (male)
	{
		normal = (0 == open ? "locked_blue" : "unlock_blue");
		hover = (0 == open ? "locked_blue_h" : "unlock_blue_h");
	}
	permission_btn.style.normal.background = Resources.Load("UISkins/Textures/love_check _in/" + normal);
	permission_btn.style.hover.background = Resources.Load("UISkins/Textures/love_check _in/" + hover);
	permission_btn.style.active.background = Resources.Load("UISkins/Textures/love_check _in/" + normal);
}

//interal function
private function Init() {
	BtnHide.clickCallback = CallbackHideSmart;
	BtnCheckin.clickCallback = CallbackSendCheckin;
	BtnViewMore.clickCallback = CallbackViewMore;
	BtnClose.clickCallback = CallbackCloseMain;
	BtnNextPage.clickCallback = CallbackNextPage;
	BtnPrePage.clickCallback = CallbackPrePage;
	BtnPage1.clickCallback = CallbackPage1;
	BtnPage2.clickCallback = CallbackPage2;
	BtnPage3.clickCallback = CallbackPage3;
	BtnSendCheck.clickCallback = CallbackMainSendCheckin;
	PermissionBtn.clickCallback = CallbackClickPermissionBtn;
	
	TxAreaInput.valueChangeCallback = CallbackInputValueChange;
	TxAreaInput.focusCallback = CallbackSmartInputFocus;
	TxAreaInput.blurCallback = CallbackSmartInputBlur;
	TAInput.valueChangeCallback = CallbackInputMainValueChange;
	TAInput.focusCallback = CallbackMainInputFocus;
	TAInput.blurCallback = CallbackMainInputBlur;
	
	LabMaleMessage.style.clipping = TextClipping.Clip;
	LabFemalMessage.style.clipping = TextClipping.Clip;
	PermissionBtn.userData = 1;
	
	mInit = true;
}

private function Refresh() {
	var height : float = 0;
	for(var info in mContentDateList) {
		var startPos : float = 0.0;
		var data : ContentDate = info as ContentDate;
		
		data.panel.setY(height);
		data.panel.style.alignment = TextAnchor.UpperLeft;
		for(var check in data.checkinInfoList) {
			var dataCheck : CheckinInfo = check as CheckinInfo;
			dataCheck.smartobject.setY(startPos);
			startPos += dataCheck.smartobject.rect.height;
		}
		startPos += data.panel.rect.height;
		height += startPos;
	}
	SVContent.areaHeight = height/SVContent.rect.height;
	SVContent.refreshRect();
	SVContent.refreshStyle();
	
	PageNumEnable();
}

private function Clear() {
	mContentDateList.Clear();
	mCheckinData.Clear();
	mPageCheckinData.Clear();
}

private function SwitchPage(pageData : ArrayList) {
	SVContent.removeAll();
	mContentDateList.Clear();
	
	for(var check in pageData) {
		AddItem(check,false);
	}
	Refresh();
}

private function RefreshUI() {
	if(PlayerFriend.GetInstance().IsSingle()) {
		LabTitle.style.normal.background = Resources.Load("UISkins/Textures/love_check _in/title2");
		BtnSendCheck.style.normal.background = Resources.Load("UISkins/Textures/love_check _in/send_single");
		BtnSendCheck.style.hover.background = Resources.Load("UISkins/Textures/love_check _in/send_single_hover");
		BtnSendCheck.style.active.background = Resources.Load("UISkins/Textures/love_check _in/send_single");
	} else {
		LabTitle.style.normal.background = Resources.Load("UISkins/Textures/love_check _in/title");
		BtnSendCheck.style.normal.background = Resources.Load("UISkins/Textures/love_check _in/send_message_blue");
		BtnSendCheck.style.hover.background = Resources.Load("UISkins/Textures/love_check _in/send_message_blue_hover");
		BtnSendCheck.style.active.background = Resources.Load("UISkins/Textures/love_check _in/send_message_blue");
	}
}

private function PageNumEnable() {
	var pageNum = mPage.GetTotalPage();
	var currPage = mPage.GetPageIndex();
	
	if(currPage == 1) {
		BtnPrePage.passive = true ;
	} else {
		BtnPrePage.passive = false ;
	}
	if(currPage >= pageNum) {
		BtnNextPage.passive = true ;
	} else {
		BtnNextPage.passive = false ;
	}
	
	if(pageNum == 0) {
		pageNum = 1;
	}
	LabPage.label.text = currPage + "/" + pageNum;
}

function Construct(src : check_in, dst : check_in) {
	dst.id = src.id;
	dst.account = src.account;
	dst.content = src.content;
	dst.create_date.year = src.create_date.year;
	dst.create_date.month = src.create_date.month;
	dst.create_date.day = src.create_date.day;
	dst.create_date.hour = src.create_date.hour;
	dst.create_date.minute = src.create_date.minute;
	dst.create_date.second = src.create_date.second;
}

//callback function
function CallbackHideSmart(callback : iGUIElement) {
	ActiveSmart(false);
}
function CallbackSendCheckin(callback : iGUIElement) {
//	if(TxAreaInput.value != "") {
//		PlayerCheckin.GetInstance().ReqSendCheckin(TxAreaInput.value, PermissionBtn.userData);
//		TxAreaInput.value = "";
//		LabWordLimit.label.text = "140";
//		SetPermissionBtn(1);
//		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_CHECKIN_LAST));
//	} else {
//		UI.getUI().OpenMsgbox("", "请输入日记内容！",true);
//	}
}
function CallbackViewMore(callback : iGUIElement) {
	ActiveMain(true);
	ActiveSmart(false);
}
function CallbackCloseMain(callback : iGUIElement) {
	ActiveMain(false);
	UI.getUI().SetModal("CheckinUI", false);
}
function CallbackNextPage(callback : iGUIElement) {
	if(mPage && mCheckinData.Count > 0) {
		mPageCheckinData = mPage.NextPage();
		SwitchPage(mPageCheckinData);
	}
}
function CallbackPrePage(callback : iGUIElement) {
	if(mPage && mCheckinData.Count > 0) {
		mPageCheckinData = mPage.PrevPage();
		SwitchPage(mPageCheckinData);
	}
}
function CallbackPage1(callback : iGUIElement) {
	if(mPage && mCheckinData.Count > 0) {
		mPageCheckinData = mPage.GetPage(1);
		SwitchPage(mPageCheckinData);
	}
}
function CallbackPage2(callback : iGUIElement) {
	if(mPage && mCheckinData.Count > 0) {
		mPageCheckinData = mPage.GetPage(2);
		SwitchPage(mPageCheckinData);
	}
}
function CallbackPage3(callback : iGUIElement) {
	if(mPage && mCheckinData.Count > 0) {
		mPageCheckinData = mPage.GetPage(3);
		SwitchPage(mPageCheckinData);
	}
}
function CallbackMainSendCheckin(callback : iGUIElement) {
	if(TAInput.value != "") {
		PlayerCheckin.GetInstance().ReqSendCheckin(TAInput.value, PermissionBtn.userData);
		TAInput.value = "";
		LabWordsLimit.label.text = "140";
		SetPermissionBtn(1);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_SEND_CHECKIN));
	} else {
		UI.getUI().OpenMsgbox("", Define.getContent(5131),true);
	}
}
function CallbackClickPermissionBtn(callback : iGUIElement) {
	SetPermissionBtn(0 == callback.userData ? 1 : 0);
}
public function CallbackInputValueChange(callback : iGUITextarea) {
	var length : int = 140-callback.value.Length;
	LabWordLimit.label.text = length.ToString();
}
public function CallbackSmartInputFocus(callback : iGUITextarea) {
	LabSmartInputNotice.setEnabled(false);
}

public function CallbackSmartInputBlur(callback : iGUITextarea) {
	if(callback.value == "") {
		LabSmartInputNotice.setEnabled(true);
	}
}
public function CallbackInputMainValueChange(callback : iGUITextarea) {
	var length : int = 140-callback.value.Length;
	LabWordsLimit.label.text = length.ToString();
}
public function CallbackMainInputFocus(callback : iGUITextarea) {
	LabMainInputNotice.setEnabled(false);
}

public function CallbackMainInputBlur(callback : iGUITextarea) {
	if(callback.value == "") {
		LabMainInputNotice.setEnabled(true);
	}
}

function HandleEventCheckinPermission(evt:GameEvent, btn:iGUIButton) {
	var info : check_in = btn.userData as check_in;
	info.opened = (0 == info.opened ? 1 : 0);	// 需要保存opened
	PlayerCheckin.GetInstance().ReqSetCheckinOpened(info.id, info.opened);
	SetItemPermissionBtn(info.account == mHostAccount ? true : false, btn, info.opened);
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

private static var instance : iGUICode_CheckinUI;
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
var LabTitle : iGUILabel;
@HideInInspector
var LabPage : iGUILabel;
@HideInInspector
var LabMainInputNotice : iGUILabel;
@HideInInspector
var LabSmartInputNotice : iGUILabel;

@HideInInspector
var PanBackground : iGUIPanel;
@HideInInspector
var PanInput : iGUIPanel;
@HideInInspector
var BtnNextPage : iGUIButton;
@HideInInspector
var BtnPage3 : iGUIButton;
@HideInInspector
var BtnPage2 : iGUIButton;
@HideInInspector
var BtnPage1 : iGUIButton;
@HideInInspector
var BtnPrePage : iGUIButton;
@HideInInspector
var LabWordsLimit : iGUILabel;
@HideInInspector
var LabWordsLimit2 : iGUILabel;
@HideInInspector
var LabWordsLimit1 : iGUILabel;
@HideInInspector
var BtnSendCheck : iGUIButton;
@HideInInspector
var TAInput : iGUITextarea;
@HideInInspector
var SVContent : iGUIScrollView;
@HideInInspector
var BtnClose : iGUIButton;
@HideInInspector
var label1 : iGUILabel;
@HideInInspector
var CheckinMain : iGUIPanel;
@HideInInspector
var LabWordLimit : iGUILabel;
@HideInInspector
var BtnCheckin : iGUIButton;
@HideInInspector
var BtnViewMore : iGUIButton;
@HideInInspector
var TxAreaInput : iGUITextarea;
@HideInInspector
var ImgFemale : iGUIImage;
@HideInInspector
var LabFemalMessage : iGUILabel;
@HideInInspector
var LabFemaleTime : iGUILabel;
@HideInInspector
var LabMaleMessage : iGUILabel;
@HideInInspector
var LabMaleTime : iGUILabel;
@HideInInspector
var ImgMale : iGUIImage;
@HideInInspector
var LabDate : iGUILabel;
@HideInInspector
var BtnHide : iGUIButton;
@HideInInspector
var CheckinSmart : iGUIWindow;
@HideInInspector
var HouseName : iGUILabel;



