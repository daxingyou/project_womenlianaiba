#pragma strict
#pragma downcast
import iGUI;

/*
class FollowSlotIcon {
	var account : String;
	var imageElement : iGUIImage;
	var nameElement : iGUILabel;
	
	public function CallbackLoad(data : FriendImageInfo) {					// FriendImageInfo define @iGUICode_MainUI.js
		if(data.bValid) {
			imageElement.image = data.image;
		} else {
			imageElement.image = Resources.Load("UISkins/Textures/Common1/default_avatar");
		}
		nameElement.label.text = data.nickName;
	}
}

private var mInit : boolean = false;

function Start() {
	Init();
}

public function Init() {
	BtnCancel1.userData = 1;
	BtnCancel2.userData = 2;
	BtnCancel3.userData = 3;
	BtnCancel4.userData = 4;
	BtnCancel5.userData = 5;
	BtnCancel6.userData = 6;
	BtnCancel7.userData = 7;
	BtnCancel8.userData = 8;
	
	BtnGift1.userData = 1;
	BtnGift2.userData = 2;
	BtnGift3.userData = 3;
	BtnGift4.userData = 4;
	BtnGift5.userData = 5;
	BtnGift6.userData = 6;
	BtnGift7.userData = 7;
	BtnGift8.userData = 8;
	
	BtnVisit1.userData = 1;
	BtnVisit2.userData = 2;
	BtnVisit3.userData = 3;
	BtnVisit4.userData = 4;
	BtnVisit5.userData = 5;
	BtnVisit6.userData = 6;
	BtnVisit7.userData = 7;
	BtnVisit8.userData = 8;
	
	BtnVisitPage1.userData = 1;
	BtnVisitPage2.userData = 2;
	BtnVisitPage3.userData = 3;
	BtnVisitPage4.userData = 4;
	BtnVisitPage5.userData = 5;
	BtnVisitPage6.userData = 6;
	BtnVisitPage7.userData = 7;
	BtnVisitPage8.userData = 8;
	
	BtnClose.clickCallback = CallbackMouseClickClose;
	BtnPrePage.clickCallback = CallbackMouseClickPrePage;
	BtnNextPage.clickCallback = CallbackMouseClickNextPage;
	
	BtnCancel1.clickCallback = CallbackMouseClickCancel;
	BtnGift1.clickCallback = CallbackMouseClickGift;
	BtnVisit1.clickCallback = CallbackMouseClickVisit;
	BtnVisitPage1.clickCallback = CallbackMouseClickVisitPage;
	
	BtnCancel2.clickCallback = CallbackMouseClickCancel;
	BtnGift2.clickCallback = CallbackMouseClickGift;
	BtnVisit2.clickCallback = CallbackMouseClickVisit;
	BtnVisitPage2.clickCallback = CallbackMouseClickVisitPage;
	
	BtnCancel3.clickCallback = CallbackMouseClickCancel;
	BtnGift3.clickCallback = CallbackMouseClickGift;
	BtnVisit3.clickCallback = CallbackMouseClickVisit;
	BtnVisitPage3.clickCallback = CallbackMouseClickVisitPage;
	
	BtnCancel4.clickCallback = CallbackMouseClickCancel;
	BtnGift4.clickCallback = CallbackMouseClickGift;
	BtnVisit4.clickCallback = CallbackMouseClickVisit;
	BtnVisitPage4.clickCallback = CallbackMouseClickVisitPage;
	
	BtnCancel5.clickCallback = CallbackMouseClickCancel;
	BtnGift5.clickCallback = CallbackMouseClickGift;
	BtnVisit5.clickCallback = CallbackMouseClickVisit;
	BtnVisitPage5.clickCallback = CallbackMouseClickVisitPage;
	
	BtnCancel6.clickCallback = CallbackMouseClickCancel;
	BtnGift6.clickCallback = CallbackMouseClickGift;
	BtnVisit6.clickCallback = CallbackMouseClickVisit;
	BtnVisitPage6.clickCallback = CallbackMouseClickVisitPage;
	
	BtnCancel7.clickCallback = CallbackMouseClickCancel;
	BtnGift7.clickCallback = CallbackMouseClickGift;
	BtnVisit7.clickCallback = CallbackMouseClickVisit;
	BtnVisitPage7.clickCallback = CallbackMouseClickVisitPage;
	
	BtnCancel8.clickCallback = CallbackMouseClickCancel;
	BtnGift8.clickCallback = CallbackMouseClickGift;
	BtnVisit8.clickCallback = CallbackMouseClickVisit;
	BtnVisitPage8.clickCallback = CallbackMouseClickVisitPage;

	mInit = true;
}

private function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_REFRESH_ATTENTION_INTERFACE), HandleNotifyRefreshPage);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_FOLLOW_ENABLE), HandleNotifyFollowEnable);
}

public function Enable(enable : boolean) {
	UI.getUI().EnableUIRoot("FollowUI",enable);
	
	if(enable) {
		if(!mInit) {
			Init();
		}
		ClearList();
		
		FollowLogic.GetInstance().Init();
		
		UI.getUI().SetModal("FollowUI", true);
	} else {
		UI.getUI().SetModal("FollowUI", false);
	}
}

private function ClearList() {
	for(var i=0; i<8; i++) {
		SetSlot(i,"");
	}
}

private function RefreshList(list : ArrayList) {
	ClearList();
	
	if(list == null) {
		Debug.Log("list is null!!");
		return;
	}
	
	for(var i=0; i<list.Count; i++) {
		var data : FollowInfo = list[i] as FollowInfo;
		SetSlot(i,data.account);
	}
	RefreshPage();
}

private function RefreshPage() {
	var curPage : int = FollowLogic.GetInstance().GetCurrPageNum();
	var totalPage : int = FollowLogic.GetInstance().GetTotalPageNum();
	if(totalPage == 0) totalPage = 1;
	if(curPage == 0) curPage = 1;
	LabPage.label.text = curPage.ToString()+"/"+totalPage.ToString();
	if(curPage == 1) {
		BtnPrePage.passive = true;
	} else {
		BtnPrePage.passive = false;
	}
	if(curPage >= totalPage) {
		BtnNextPage.passive = true;
	} else {
		BtnNextPage.passive = false;
	}
}

private function SetSlot(idx : int, account : String) {
	switch(idx) {
		case 0:
			SetElementData(ConFriend1,account);
			SetElementImage(ImgIcon1,LabName1,account,idx);
			break;
		case 1:
			SetElementData(ConFriend2,account);
			SetElementImage(ImgIcon2,LabName2,account,idx);
			break;
		case 2:
			SetElementData(ConFriend3,account);
			SetElementImage(ImgIcon3,LabName3,account,idx);
			break;
		case 3:
			SetElementData(ConFriend4,account);
			SetElementImage(ImgIcon4,LabName4,account,idx);
			break;
		case 4:
			SetElementData(ConFriend5,account);
			SetElementImage(ImgIcon5,LabName5,account,idx);
			break;
		case 5:
			SetElementData(ConFriend6,account);
			SetElementImage(ImgIcon6,LabName6,account,idx);
			break;
		case 6:
			SetElementData(ConFriend7,account);
			SetElementImage(ImgIcon7,LabName7,account,idx);
			break;
		case 7:
			SetElementData(ConFriend8,account);
			SetElementImage(ImgIcon8,LabName8,account,idx);
			break;
	}
}

private function SetElementData(element : iGUIElement,account : String) {
	if(account == null || account == "") {
		element.enabled = false;
		element.userData = null;
	} else {
		element.enabled = true;
		element.userData = account;
	}
}

private function SetElementImage(imageElement : iGUIElement,nameElement : iGUIElement,account : String,idx : int) {
	if(account == null) {
		return ;
	}
	
	var image : FriendImageInfo = new FriendImageInfo();
	var slotData : FollowSlotIcon = new FollowSlotIcon();
	
	(imageElement as iGUIImage).image = null;
	nameElement.label.text = "";
	
	slotData.account = account;
	slotData.imageElement = imageElement;
	slotData.nameElement = nameElement;
	
	image.image = new Texture2D(imageElement.rect.width,imageElement.rect.height);
	image.mark = idx+100;
	
	if(account == "") {
		image.bCancel = true;
	} else {
		image.bCancel = false;
	}
	
	Global.GetPlatResLoaderMgr().NetLoadImageForFriend(account,slotData.CallbackLoad,image);
}

//handle game event
private function HandleNotifyRefreshPage(evt:GameEvent, obj:System.Object) {
	var list : ArrayList = FollowLogic.GetInstance().GetCurrData();
	RefreshList(list);
}

private function HandleNotifyFollowEnable(evt:GameEvent, obj:System.Object) {
	Enable(obj);
}

//callback
private function CallbackMouseClickClose(callback : iGUIElement) {
	Enable(false);
}

private function CallbackMouseClickPrePage(callback : iGUIElement) {
	var list : ArrayList = FollowLogic.GetInstance().GetPrePage();
	RefreshList(list);
}

private function CallbackMouseClickNextPage(callback : iGUIElement) {
	var list : ArrayList = FollowLogic.GetInstance().GetNextPage();
	RefreshList(list);
}

private var cancelFollowIndex : int = 0;
private function CallbackMouseClickCancel(callback : iGUIElement) {
	cancelFollowIndex = callback.userData;
	var name : String = "";
	switch(cancelFollowIndex) {
		case 1:name = LabName1.label.text;break;
		case 2:name = LabName2.label.text;break;
		case 3:name = LabName3.label.text;break;
		case 4:name = LabName4.label.text;break;
		case 5:name = LabName5.label.text;break;
		case 6:name = LabName6.label.text;break;
		case 7:name = LabName7.label.text;break;
		case 8:name = LabName8.label.text;break;
	}
	UI.getUI().OpenMsgbox("", "你是否将" + name + "从关注列表中移除？","确定",CallbackCancelFollow as iGUIEventCallback,"取消",CallbackCancel as iGUIEventCallback);
}

private function CallbackCancelFollow(callback : iGUIElement) {
	switch(cancelFollowIndex) {
		case 1:FollowLogic.GetInstance().RemoveAttention(ConFriend1.userData);break;
		case 2:FollowLogic.GetInstance().RemoveAttention(ConFriend2.userData);break;
		case 3:FollowLogic.GetInstance().RemoveAttention(ConFriend3.userData);break;
		case 4:FollowLogic.GetInstance().RemoveAttention(ConFriend4.userData);break;
		case 5:FollowLogic.GetInstance().RemoveAttention(ConFriend5.userData);break;
		case 6:FollowLogic.GetInstance().RemoveAttention(ConFriend6.userData);break;
		case 7:FollowLogic.GetInstance().RemoveAttention(ConFriend7.userData);break;
		case 8:FollowLogic.GetInstance().RemoveAttention(ConFriend8.userData);break;
	}
}

private function CallbackCancel(callback : iGUIElement) {
}

private function CallbackMouseClickGift(callback : iGUIElement) {
	switch(callback.userData) {
		case 1:FollowLogic.GetInstance().SendGift(ConFriend1.userData);break;
		case 2:FollowLogic.GetInstance().SendGift(ConFriend2.userData);break;
		case 3:FollowLogic.GetInstance().SendGift(ConFriend3.userData);break;
		case 4:FollowLogic.GetInstance().SendGift(ConFriend4.userData);break;
		case 5:FollowLogic.GetInstance().SendGift(ConFriend5.userData);break;
		case 6:FollowLogic.GetInstance().SendGift(ConFriend6.userData);break;
		case 7:FollowLogic.GetInstance().SendGift(ConFriend7.userData);break;
		case 8:FollowLogic.GetInstance().SendGift(ConFriend8.userData);break;
	}
}

private function CallbackMouseClickVisit(callback : iGUIElement) {
	switch(callback.userData) {
		case 1:FollowLogic.GetInstance().Visit(ConFriend1.userData);break;
		case 2:FollowLogic.GetInstance().Visit(ConFriend2.userData);break;
		case 3:FollowLogic.GetInstance().Visit(ConFriend3.userData);break;
		case 4:FollowLogic.GetInstance().Visit(ConFriend4.userData);break;
		case 5:FollowLogic.GetInstance().Visit(ConFriend5.userData);break;
		case 6:FollowLogic.GetInstance().Visit(ConFriend6.userData);break;
		case 7:FollowLogic.GetInstance().Visit(ConFriend7.userData);break;
		case 8:FollowLogic.GetInstance().Visit(ConFriend8.userData);break;
	}
}

private function CallbackMouseClickVisitPage(callback : iGUIElement) {
	switch(callback.userData) {
		case 1:FollowLogic.GetInstance().VisitHomePage(ConFriend1.userData);break;
		case 2:FollowLogic.GetInstance().VisitHomePage(ConFriend2.userData);break;
		case 3:FollowLogic.GetInstance().VisitHomePage(ConFriend3.userData);break;
		case 4:FollowLogic.GetInstance().VisitHomePage(ConFriend4.userData);break;
		case 5:FollowLogic.GetInstance().VisitHomePage(ConFriend5.userData);break;
		case 6:FollowLogic.GetInstance().VisitHomePage(ConFriend6.userData);break;
		case 7:FollowLogic.GetInstance().VisitHomePage(ConFriend7.userData);break;
		case 8:FollowLogic.GetInstance().VisitHomePage(ConFriend8.userData);break;
	}
}

private static var instance : iGUICode_FollowUI;
function Awake(){
	instance=this;
	
	RegistEventMsg();
}
static function getInstance(){
	return instance;
}

@HideInInspector
var BtnNextPage : iGUIButton;
@HideInInspector
var BtnPrePage : iGUIButton;
@HideInInspector
var LabPage : iGUILabel;
@HideInInspector
var LabNumLimit : iGUILabel;
@HideInInspector
var BtnClose : iGUIButton;

@HideInInspector
var LabName8 : iGUILabel;
@HideInInspector
var BtnVisitPage8 : iGUIButton;
@HideInInspector
var BtnVisit8 : iGUIButton;
@HideInInspector
var BtnGift8 : iGUIButton;
@HideInInspector
var BtnCancel8 : iGUIButton;
@HideInInspector
var ImgIcon8 : iGUIImage;
@HideInInspector
var ConFriend8 : iGUIPanel;

@HideInInspector
var LabName7 : iGUILabel;
@HideInInspector
var BtnVisitPage7 : iGUIButton;
@HideInInspector
var BtnVisit7 : iGUIButton;
@HideInInspector
var BtnGift7 : iGUIButton;
@HideInInspector
var BtnCancel7 : iGUIButton;
@HideInInspector
var ImgIcon7 : iGUIImage;
@HideInInspector
var ConFriend7 : iGUIPanel;

@HideInInspector
var LabName6 : iGUILabel;
@HideInInspector
var BtnVisitPage6 : iGUIButton;
@HideInInspector
var BtnVisit6 : iGUIButton;
@HideInInspector
var BtnGift6 : iGUIButton;
@HideInInspector
var BtnCancel6 : iGUIButton;
@HideInInspector
var ImgIcon6 : iGUIImage;
@HideInInspector
var ConFriend6 : iGUIPanel;

@HideInInspector
var LabName5 : iGUILabel;
@HideInInspector
var BtnVisitPage5 : iGUIButton;
@HideInInspector
var BtnVisit5 : iGUIButton;
@HideInInspector
var BtnGift5 : iGUIButton;
@HideInInspector
var BtnCancel5 : iGUIButton;
@HideInInspector
var ImgIcon5 : iGUIImage;
@HideInInspector
var ConFriend5 : iGUIPanel;

@HideInInspector
var LabName4 : iGUILabel;
@HideInInspector
var BtnVisitPage4 : iGUIButton;
@HideInInspector
var BtnVisit4 : iGUIButton;
@HideInInspector
var BtnGift4 : iGUIButton;
@HideInInspector
var BtnCancel4 : iGUIButton;
@HideInInspector
var ImgIcon4 : iGUIImage;
@HideInInspector
var ConFriend4 : iGUIPanel;

@HideInInspector
var LabName3 : iGUILabel;
@HideInInspector
var BtnVisitPage3 : iGUIButton;
@HideInInspector
var BtnVisit3 : iGUIButton;
@HideInInspector
var BtnGift3 : iGUIButton;
@HideInInspector
var BtnCancel3 : iGUIButton;
@HideInInspector
var ImgIcon3 : iGUIImage;
@HideInInspector
var ConFriend3 : iGUIPanel;

@HideInInspector
var LabName2 : iGUILabel;
@HideInInspector
var BtnVisitPage2 : iGUIButton;
@HideInInspector
var BtnVisit2 : iGUIButton;
@HideInInspector
var BtnGift2 : iGUIButton;
@HideInInspector
var BtnCancel2 : iGUIButton;
@HideInInspector
var ImgIcon2 : iGUIImage;
@HideInInspector
var ConFriend2 : iGUIPanel;

@HideInInspector
var LabName1 : iGUILabel;
@HideInInspector
var BtnVisitPage1 : iGUIButton;
@HideInInspector
var BtnVisit1 : iGUIButton;
@HideInInspector
var BtnGift1 : iGUIButton;
@HideInInspector
var BtnCancel1 : iGUIButton;
@HideInInspector
var ImgIcon1 : iGUIImage;
@HideInInspector
var ConFriend1 : iGUIPanel;

@HideInInspector
var PanFollowList : iGUIPanel;
@HideInInspector
var root1 : iGUIRoot;
*/
