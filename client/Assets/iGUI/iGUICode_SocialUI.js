#pragma strict
#pragma downcast
import iGUI;

class SocialElement {
	public var panel : iGUIPanel;
	public var headIcon : iGUIImage;
	public var level : iGUILabel;
	public var name : iGUILabel;
	public var qqHZ : iGUIImage;
	public var qqHZYear : iGUIImage;
	public var intimate : iGUIImage;
	public var plant : iGUIImage;
}

class SocialSlotIcon extends PlatResInfoCtrl {
	public var imageElement : iGUIImage;
	public var nameElement : iGUILabel;
	public var qqhzElement : iGUIImage;
	public var qqhzYearElement : iGUIImage;
	
	//overwrite
	public function Callback() {
		if(URLValid) {
			imageElement.image = image;
		} else {
			imageElement.image = Resources.Load("UISkins/Textures/Common1/default_avatar");
		}
		if(info.nickname.Length > 6) {
			nameElement.label.text = info.nickname.Substring(0,6)+"...";
		} else {
			nameElement.label.text = info.nickname;
		}
		
		if(info.is_yellow_vip == 0 && info.is_yellow_year_vip == 0) {
			qqhzElement.image = null;
			qqhzElement.setEnabled(false);
			qqhzYearElement.setEnabled(false);
		} else if(info.is_yellow_vip != 0 && info.is_yellow_year_vip == 0){
			qqhzElement.image = Resources.Load("UISkins/Textures/hz/hz_lv"+info.yellow_vip_level.ToString());
			qqhzElement.setEnabled(true);
			qqhzYearElement.setEnabled(false);
		} else if(info.is_yellow_year_vip != 0){
			qqhzElement.image = Resources.Load("UISkins/Textures/hz/hz_lv"+info.yellow_vip_level.ToString());
			qqhzElement.setEnabled(true);
			qqhzYearElement.setEnabled(true);
		} else {
			Debug.Log("do nothing--unknown qqhometype!!");
		}
		
		var fImage : FriendImage = new FriendImage();
		fImage.account = account;
		fImage.name = info.nickname;
		fImage.image = image;
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_UPDATE_FRIEND_ITEM_INFO),fImage);
	}
}

private var mInit : boolean = false;
private var mLoaderList : ArrayList = new ArrayList();

function Start() {
	Init();
}

function Init() {
	ImgBG0.userData = 0;
	BtnWish0.userData = 0;
	BtnGift0.userData = 0;
	BtnPeasonalIntro0.userData = 0;
	BtnCancelFollow0.userData = 0;
	BtnMakeFriend0.userData = 0;
	BtnCancelFriend0.userData = 0;
	
	ImgBG1.userData = 1;
	BtnWish1.userData = 1;
	BtnGift1.userData = 1;
	BtnPeasonalIntro1.userData = 1;
	BtnCancelFollow1.userData = 1;
	BtnMakeFriend1.userData = 1;
	BtnCancelFriend1.userData = 1;
	
	ImgBG2.userData = 2;
	BtnWish2.userData = 2;
	BtnGift2.userData = 2;
	BtnPeasonalIntro2.userData = 2;
	BtnCancelFollow2.userData = 2;
	BtnMakeFriend2.userData = 2;
	BtnCancelFriend2.userData = 2;
	
	ImgBG3.userData = 3;
	BtnWish3.userData = 3;
	BtnGift3.userData = 3;
	BtnPeasonalIntro3.userData = 3;
	BtnCancelFollow3.userData = 3;
	BtnMakeFriend3.userData = 3;
	BtnCancelFriend3.userData = 3;
	
	ImgBG4.userData = 4;
	BtnWish4.userData = 4;
	BtnGift4.userData = 4;
	BtnPeasonalIntro4.userData = 4;
	BtnCancelFollow4.userData = 4;
	BtnMakeFriend4.userData = 4;
	BtnCancelFriend4.userData = 4;
	
	ImgBG5.userData = 5;
	BtnWish5.userData = 5;
	BtnGift5.userData = 5;
	BtnPeasonalIntro5.userData = 5;
	BtnCancelFollow5.userData = 5;
	BtnMakeFriend5.userData = 5;
	BtnCancelFriend5.userData = 5;
	
	ImgBG6.userData = 6;
	BtnWish6.userData = 6;
	BtnGift6.userData = 6;
	BtnPeasonalIntro6.userData = 6;
	BtnCancelFollow6.userData = 6;
	BtnMakeFriend6.userData = 6;
	BtnCancelFriend6.userData = 6;
	
	ImgBG7.userData = 7;
	BtnWish7.userData = 7;
	BtnGift7.userData = 7;
	BtnPeasonalIntro7.userData = 7;
	BtnCancelFollow7.userData = 7;
	BtnMakeFriend7.userData = 7;
	BtnCancelFriend7.userData = 7;
	
	BtnClose.clickCallback = CallbackMouseClickClose;
	BtnFriend.clickCallback = CallbackMouseClickFriend;
	BtnInvite.clickCallback = CallbackMouseClickInvite;
	BtnFollow.clickCallback = CallbackMouseClickFollow;
	BtnPrePage.clickCallback = CallbackMouseClickPrePage;
	BtnNextPage.clickCallback = CallbackMouseClickNextPage;
	BtnFirstPage.clickCallback = CallbackMouseClickFirstPage;
	
	ImgBG0.clickCallback = CallbackMouseClickVisit;
	BtnWish0.clickCallback = CallbackMouseClickWish;
	BtnGift0.clickCallback = CallbackMouseClickGift;
	BtnPeasonalIntro0.clickCallback = CallbackMouseClickPersonal;
	BtnCancelFollow0.clickCallback = CallbackMouseClickCancelFollow;
	BtnMakeFriend0.clickCallback = CallbackMouseClickMakeFriend;
	BtnCancelFriend0.clickCallback = CallbackMouseClickCancelFriend;
	ImgIntimate0.mouseOverCallback = CallbackMouseOverInitmage;
	
	ImgBG1.clickCallback = CallbackMouseClickVisit;
	BtnWish1.clickCallback = CallbackMouseClickWish;
	BtnGift1.clickCallback = CallbackMouseClickGift;
	BtnPeasonalIntro1.clickCallback = CallbackMouseClickPersonal;
	BtnCancelFollow1.clickCallback = CallbackMouseClickCancelFollow;
	BtnMakeFriend1.clickCallback = CallbackMouseClickMakeFriend;
	BtnCancelFriend1.clickCallback = CallbackMouseClickCancelFriend;
	ImgIntimate1.mouseOverCallback = CallbackMouseOverInitmage;
	
	ImgBG2.clickCallback = CallbackMouseClickVisit;
	BtnWish2.clickCallback = CallbackMouseClickWish;
	BtnGift2.clickCallback = CallbackMouseClickGift;
	BtnPeasonalIntro2.clickCallback = CallbackMouseClickPersonal;
	BtnCancelFollow2.clickCallback = CallbackMouseClickCancelFollow;
	BtnMakeFriend2.clickCallback = CallbackMouseClickMakeFriend;
	BtnCancelFriend2.clickCallback = CallbackMouseClickCancelFriend;
	ImgIntimate2.mouseOverCallback = CallbackMouseOverInitmage;
	
	ImgBG3.clickCallback = CallbackMouseClickVisit;
	BtnWish3.clickCallback = CallbackMouseClickWish;
	BtnGift3.clickCallback = CallbackMouseClickGift;
	BtnPeasonalIntro3.clickCallback = CallbackMouseClickPersonal;
	BtnCancelFollow3.clickCallback = CallbackMouseClickCancelFollow;
	BtnMakeFriend3.clickCallback = CallbackMouseClickMakeFriend;
	BtnCancelFriend3.clickCallback = CallbackMouseClickCancelFriend;
	ImgIntimate3.mouseOverCallback = CallbackMouseOverInitmage;
	
	ImgBG4.clickCallback = CallbackMouseClickVisit;
	BtnWish4.clickCallback = CallbackMouseClickWish;
	BtnGift4.clickCallback = CallbackMouseClickGift;
	BtnPeasonalIntro4.clickCallback = CallbackMouseClickPersonal;
	BtnCancelFollow4.clickCallback = CallbackMouseClickCancelFollow;
	BtnMakeFriend4.clickCallback = CallbackMouseClickMakeFriend;
	BtnCancelFriend4.clickCallback = CallbackMouseClickCancelFriend;
	ImgIntimate4.mouseOverCallback = CallbackMouseOverInitmage;
	
	ImgBG5.clickCallback = CallbackMouseClickVisit;
	BtnWish5.clickCallback = CallbackMouseClickWish;
	BtnGift5.clickCallback = CallbackMouseClickGift;
	BtnPeasonalIntro5.clickCallback = CallbackMouseClickPersonal;
	BtnCancelFollow5.clickCallback = CallbackMouseClickCancelFollow;
	BtnMakeFriend5.clickCallback = CallbackMouseClickMakeFriend;
	BtnCancelFriend5.clickCallback = CallbackMouseClickCancelFriend;
	ImgIntimate5.mouseOverCallback = CallbackMouseOverInitmage;
	
	ImgBG6.clickCallback = CallbackMouseClickVisit;
	BtnWish6.clickCallback = CallbackMouseClickWish;
	BtnGift6.clickCallback = CallbackMouseClickGift;
	BtnPeasonalIntro6.clickCallback = CallbackMouseClickPersonal;
	BtnCancelFollow6.clickCallback = CallbackMouseClickCancelFollow;
	BtnMakeFriend6.clickCallback = CallbackMouseClickMakeFriend;
	BtnCancelFriend6.clickCallback = CallbackMouseClickCancelFriend;
	ImgIntimate6.mouseOverCallback = CallbackMouseOverInitmage;
	
	ImgBG7.clickCallback = CallbackMouseClickVisit;
	BtnWish7.clickCallback = CallbackMouseClickWish;
	BtnGift7.clickCallback = CallbackMouseClickGift;
	BtnPeasonalIntro7.clickCallback = CallbackMouseClickPersonal;
	BtnCancelFollow7.clickCallback = CallbackMouseClickCancelFollow;
	BtnMakeFriend7.clickCallback = CallbackMouseClickMakeFriend;
	BtnCancelFriend7.clickCallback = CallbackMouseClickCancelFriend;
	ImgIntimate7.mouseOverCallback = CallbackMouseOverInitmage;
	
	if(PlatformMgr.IsPlatYY()) {
		BtnInvite.setEnabled(false);
		BtnFriend.setEnabled(false);
	} else {
		BtnInvite.setEnabled(true);
		BtnFriend.setEnabled(true);
	}
	
	mInit = true;
}

private function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_REFRESH_ATTENTION_INTERFACE), HandleNotifyRefreshPage);
}

//game event
private function HandleNotifyRefreshPage(evt:GameEvent, obj:System.Object) {
	var list : ArrayList = SocialLogic.GetInstance().GetCurrData();
	RefreshList(list);
}

//logic function for extern
public function Enable(enable : boolean) {
	UI.getUI().EnableUIRoot("SocialUI",enable);
	
	if(enable) {
		if(SocialLogic.GetInstance().IsDataRecv()) {
			if(PlatformMgr.IsPlatYY()) {
				ChangeSort(SocialSort.SORT_FOLLOW);
			} else {
				ChangeSort(SocialSort.SORT_FRIEND);
			}
		}
		iGUICode_MainUI.getInstance().social_btn.setEnabled(false);
		iGUICode_MainUI.getInstance().love_btn.passive = true;
		iGUICode_MainUI.getInstance().flower.passive = true;
		iGUICode_MainUI.getInstance().new_anniversary.passive = true;
		
		var pp : PaoPaoControl = PaoPaoControl.GetPpCtrol(iGUICode_MainUI.getInstance().SocialPlantPP);
		if(pp)
			pp.StopPpTimer();
	} else {
		iGUICode_MainUI.getInstance().social_btn.setEnabled(true);
		iGUICode_MainUI.getInstance().love_btn.passive = false;
		iGUICode_MainUI.getInstance().flower.passive = false;
		iGUICode_MainUI.getInstance().new_anniversary.passive = false;
	}
}

//logic function for internal
private function Clear() {
	//clear element
	for(var element : iGUIElement in ConContentList.items) {
		element.setEnabled(false);
	}
	//remove loader
	for(var loader : PlatResLoader in mLoaderList) {
		Global.GetPlatResLoaderMgr().Remove(loader);
	}
	
	mLoaderList.Clear();
}

private function RefreshList(list : ArrayList) {
	Clear();
	
	if(list == null || list.Count == 0) {
		Debug.Log("list is null!!");
	} else {
		for(var i=0; i<list.Count; i++) {
			if(i >= 8) break;
			
			ConContentList.items[i].setEnabled(true);
			SetItemElement(i,list[i]);
		}
	}
	
	RefreshPage();
}

private function RefreshPage() {
	var curPage : int = SocialLogic.GetInstance().GetCurrPageNum();
	var totalPage : int = SocialLogic.GetInstance().GetTotalPageNum();
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

private function ChangeSort(sort : SocialSort) {
	var list : ArrayList = SocialLogic.GetInstance().ChangeSort(sort);
	RefreshList(list);
	
	if(sort == SocialSort.SORT_FRIEND) {
		SortFriend();
	} else if(sort == SocialSort.SORT_FOLLOW) {
		SortFollow();
	} else {
		return ;
	}
}

private function SortFriend() {
	BtnFollow.style.normal.background = Resources.Load("UISkins/Textures/Social/guanzhu_p");
	BtnFollow.style.hover.background = Resources.Load("UISkins/Textures/Social/guanzhu_p");
	BtnFriend.style.normal.background = Resources.Load("UISkins/Textures/Social/haoyou_n");
	BtnFriend.style.hover.background = null;
	if(PlatformMgr.IsPlatYY()) {
		BtnInvite.setEnabled(false);
	} else {
		BtnInvite.setEnabled(true);
	}
	
	BtnMakeFriend0.setEnabled(false);
	BtnMakeFriend1.setEnabled(false);
	BtnMakeFriend2.setEnabled(false);
	BtnMakeFriend3.setEnabled(false);
	BtnMakeFriend4.setEnabled(false);
	BtnMakeFriend5.setEnabled(false);
	BtnMakeFriend6.setEnabled(false);
	BtnMakeFriend7.setEnabled(false);
	
	BtnCancelFollow0.setEnabled(false);
	BtnCancelFollow1.setEnabled(false);
	BtnCancelFollow2.setEnabled(false);
	BtnCancelFollow3.setEnabled(false);
	BtnCancelFollow4.setEnabled(false);
	BtnCancelFollow5.setEnabled(false);
	BtnCancelFollow6.setEnabled(false);
	BtnCancelFollow7.setEnabled(false);
	
	BtnWish0.setEnabled(true);
	BtnWish1.setEnabled(true);
	BtnWish2.setEnabled(true);
	BtnWish3.setEnabled(true);
	BtnWish4.setEnabled(true);
	BtnWish5.setEnabled(true);
	BtnWish6.setEnabled(true);
	BtnWish7.setEnabled(true);
	
	BtnCancelFriend0.setEnabled(true);
	BtnCancelFriend1.setEnabled(true);
	BtnCancelFriend2.setEnabled(true);
	BtnCancelFriend3.setEnabled(true);
	BtnCancelFriend4.setEnabled(true);
	BtnCancelFriend5.setEnabled(true);
	BtnCancelFriend6.setEnabled(true);
	BtnCancelFriend7.setEnabled(true);
	
	BtnPeasonalIntro0.setX(128);
	BtnPeasonalIntro1.setX(128);
	BtnPeasonalIntro2.setX(128);
	BtnPeasonalIntro3.setX(128);
	BtnPeasonalIntro4.setX(128);
	BtnPeasonalIntro5.setX(128);
	BtnPeasonalIntro6.setX(128);
	BtnPeasonalIntro7.setX(128);
	
	BtnGift0.setX(152);
	BtnGift1.setX(152);
	BtnGift2.setX(152);
	BtnGift3.setX(152);
	BtnGift4.setX(152);
	BtnGift5.setX(152);
	BtnGift6.setX(152);
	BtnGift7.setX(152);
	
	ImgIntimate0.setEnabled(true);
	ImgIntimate1.setEnabled(true);
	ImgIntimate2.setEnabled(true);
	ImgIntimate3.setEnabled(true);
	ImgIntimate4.setEnabled(true);
	ImgIntimate5.setEnabled(true);
	ImgIntimate6.setEnabled(true);
	ImgIntimate7.setEnabled(true);
	
}

private function SortFollow() {
	BtnFriend.style.normal.background = Resources.Load("UISkins/Textures/Social/haoyou_p");
	BtnFriend.style.hover.background = Resources.Load("UISkins/Textures/Social/haoyou_p");
	BtnFollow.style.normal.background = Resources.Load("UISkins/Textures/Social/guanzhu_n");
	BtnFollow.style.hover.background = null;
	BtnInvite.setEnabled(false);
	
	BtnWish0.setEnabled(false);
	BtnWish1.setEnabled(false);
	BtnWish2.setEnabled(false);
	BtnWish3.setEnabled(false);
	BtnWish4.setEnabled(false);
	BtnWish5.setEnabled(false);
	BtnWish6.setEnabled(false);
	BtnWish7.setEnabled(false);
	
	BtnCancelFriend0.setEnabled(false);
	BtnCancelFriend1.setEnabled(false);
	BtnCancelFriend2.setEnabled(false);
	BtnCancelFriend3.setEnabled(false);
	BtnCancelFriend4.setEnabled(false);
	BtnCancelFriend5.setEnabled(false);
	BtnCancelFriend6.setEnabled(false);
	BtnCancelFriend7.setEnabled(false);
	
	if(PlatformMgr.IsPlatYY()) {
		BtnMakeFriend0.setEnabled(false);
		BtnMakeFriend1.setEnabled(false);
		BtnMakeFriend2.setEnabled(false);
		BtnMakeFriend3.setEnabled(false);
		BtnMakeFriend4.setEnabled(false);
		BtnMakeFriend5.setEnabled(false);
		BtnMakeFriend6.setEnabled(false);
		BtnMakeFriend7.setEnabled(false);
	} else {
		BtnMakeFriend0.setEnabled(true);
		BtnMakeFriend1.setEnabled(true);
		BtnMakeFriend2.setEnabled(true);
		BtnMakeFriend3.setEnabled(true);
		BtnMakeFriend4.setEnabled(true);
		BtnMakeFriend5.setEnabled(true);
		BtnMakeFriend6.setEnabled(true);
		BtnMakeFriend7.setEnabled(true);
	}
	
	BtnCancelFollow0.setEnabled(true);
	BtnCancelFollow1.setEnabled(true);
	BtnCancelFollow2.setEnabled(true);
	BtnCancelFollow3.setEnabled(true);
	BtnCancelFollow4.setEnabled(true);
	BtnCancelFollow5.setEnabled(true);
	BtnCancelFollow6.setEnabled(true);
	BtnCancelFollow7.setEnabled(true);
	
	BtnPeasonalIntro0.setX(152);
	BtnPeasonalIntro1.setX(152);
	BtnPeasonalIntro2.setX(152);
	BtnPeasonalIntro3.setX(152);
	BtnPeasonalIntro4.setX(152);
	BtnPeasonalIntro5.setX(152);
	BtnPeasonalIntro6.setX(152);
	BtnPeasonalIntro7.setX(152);
	
	BtnGift0.setX(175);
	BtnGift1.setX(175);
	BtnGift2.setX(175);
	BtnGift3.setX(175);
	BtnGift4.setX(175);
	BtnGift5.setX(175);
	BtnGift6.setX(175);
	BtnGift7.setX(175);
	
	ImgIntimate0.setEnabled(false);
	ImgIntimate1.setEnabled(false);
	ImgIntimate2.setEnabled(false);
	ImgIntimate3.setEnabled(false);
	ImgIntimate4.setEnabled(false);
	ImgIntimate5.setEnabled(false);
	ImgIntimate6.setEnabled(false);
	ImgIntimate7.setEnabled(false);
}

private function SetItemElement(idx : int, data : SocialItemData) {
	var element : SocialElement = new SocialElement();
	switch(idx) {
		case 0:
			element.panel = PanItem0;
			element.headIcon = ImgIcon0;
			element.level = LabLevel0;
			element.name = LabName0;
			element.qqHZ = ImgQQHZ0;
			element.qqHZYear = ImgQQHZYear0;
			element.intimate = ImgIntimate0;
			element.plant = ImgPlant0;
			SetItemData(element,data);
			break;
		case 1:
			element.panel = PanItem1;
			element.headIcon = ImgIcon1;
			element.level = LabLevel1;
			element.name = LabName1;
			element.qqHZ = ImgQQHZ1;
			element.qqHZYear = ImgQQHZYear1;
			element.intimate = ImgIntimate1;
			element.plant = ImgPlant1;
			SetItemData(element,data);
			break;
		case 2:
			element.panel = PanItem2;
			element.headIcon = ImgIcon2;
			element.level = LabLevel2;
			element.name = LabName2;
			element.qqHZ = ImgQQHZ2;
			element.qqHZYear = ImgQQHZYear2;
			element.intimate = ImgIntimate2;
			element.plant = ImgPlant2;
			SetItemData(element,data);
			break;
		case 3:
			element.panel = PanItem3;
			element.headIcon = ImgIcon3;
			element.level = LabLevel3;
			element.name = LabName3;
			element.qqHZ = ImgQQHZ3;
			element.qqHZYear = ImgQQHZYear3;
			element.intimate = ImgIntimate3;
			element.plant = ImgPlant3;
			SetItemData(element,data);
			break;
		case 4:
			element.panel = PanItem4;
			element.headIcon = ImgIcon4;
			element.level = LabLevel4;
			element.name = LabName4;
			element.qqHZ = ImgQQHZ4;
			element.qqHZYear = ImgQQHZYear4;
			element.intimate = ImgIntimate4;
			element.plant = ImgPlant4;
			SetItemData(element,data);
			break;
		case 5:
			element.panel = PanItem5;
			element.headIcon = ImgIcon5;
			element.level = LabLevel5;
			element.name = LabName5;
			element.qqHZ = ImgQQHZ5;
			element.qqHZYear = ImgQQHZYear5;
			element.intimate = ImgIntimate5;
			element.plant = ImgPlant5;
			SetItemData(element,data);
			break;
		case 6:
			element.panel = PanItem6;
			element.headIcon = ImgIcon6;
			element.level = LabLevel6;
			element.name = LabName6;
			element.qqHZ = ImgQQHZ6;
			element.qqHZYear = ImgQQHZYear6;
			element.intimate = ImgIntimate6;
			element.plant = ImgPlant6;
			SetItemData(element,data);
			break;
		case 7:
			element.panel = PanItem7;
			element.headIcon = ImgIcon7;
			element.level = LabLevel7;
			element.name = LabName7;
			element.qqHZ = ImgQQHZ7;
			element.qqHZYear = ImgQQHZYear7;
			element.intimate = ImgIntimate7;
			element.plant = ImgPlant7;
			SetItemData(element,data);
			break;
	}
}

private function SetItemData(element : SocialElement, data : SocialItemData) {
	var account : String = data.account;
	
	if(account == null || account == "") return ;
	
	element.headIcon.image = null;
	element.name.label.text = "";
	
	var slotData : SocialSlotIcon = new SocialSlotIcon();
	slotData.account = account;
	slotData.imageElement = element.headIcon;
	slotData.nameElement = element.name;
	slotData.qqhzElement = element.qqHZ;
	slotData.qqhzYearElement = element.qqHZYear;
	slotData.imageElement.image = null;
	slotData.nameElement.label.text = "";
	
	if(data.level > 0) {
		element.level.label.text = "LV-"+data.level.ToString();
	} else {
		element.level.label.text = "";
	}
	element.panel.userData = slotData;
	
	if(data.intimate != null) {
		element.intimate.image = Resources.Load("UISkins/Textures/Common1/"+data.intimate.icon);
	} else {
		element.intimate.image = null;
	}
	element.intimate.userData = data.intimate;
	
	if(data.bPlantActive) {
		element.plant.setEnabled(true);
	} else {
		element.plant.setEnabled(false);
	}
	
	var loader : PlatResLoader = Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(account,slotData);
	mLoaderList.Add(loader);
}

//callback
private function CallbackMouseClickClose(callback : iGUIElement) {
	Enable(false);
}

private function CallbackMouseClickFriend(callback : iGUIElement) {
	if(SocialLogic.GetInstance().GetCurSort() != SocialSort.SORT_FRIEND) {
		ChangeSort(SocialSort.SORT_FRIEND);
	}
}

private function CallbackMouseClickInvite(callback : iGUIElement) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_INVITE_FRIEND));
}

private function CallbackMouseClickFollow(callback : iGUIElement) {
	if(SocialLogic.GetInstance().GetCurSort() != SocialSort.SORT_FOLLOW) {
		ChangeSort(SocialSort.SORT_FOLLOW);
	}
}

private function CallbackMouseClickPrePage(callback : iGUIElement) {
	var list : ArrayList = SocialLogic.GetInstance().GetPrePage();
	RefreshList(list);
}

private function CallbackMouseClickNextPage(callback : iGUIElement) {
	var list : ArrayList = SocialLogic.GetInstance().GetNextPage();
	RefreshList(list);
}

private function CallbackMouseClickFirstPage(callback : iGUIElement) {
	var list : ArrayList = SocialLogic.GetInstance().GetPageData(1);
	RefreshList(list);
}

private function CallbackMouseClickVisit(callback : iGUIElement) {
	switch(callback.userData) {
		case 0:SocialLogic.GetInstance().Visit((PanItem0.userData as SocialSlotIcon).account);break;
		case 1:SocialLogic.GetInstance().Visit((PanItem1.userData as SocialSlotIcon).account);break;
		case 2:SocialLogic.GetInstance().Visit((PanItem2.userData as SocialSlotIcon).account);break;
		case 3:SocialLogic.GetInstance().Visit((PanItem3.userData as SocialSlotIcon).account);break;
		case 4:SocialLogic.GetInstance().Visit((PanItem4.userData as SocialSlotIcon).account);break;
		case 5:SocialLogic.GetInstance().Visit((PanItem5.userData as SocialSlotIcon).account);break;
		case 6:SocialLogic.GetInstance().Visit((PanItem6.userData as SocialSlotIcon).account);break;
		case 7:SocialLogic.GetInstance().Visit((PanItem7.userData as SocialSlotIcon).account);break;
	}
}

private function CallbackMouseClickWish(callback : iGUIElement) {
	Enable(false);
	switch(callback.userData) {
		case 0:OpenWishListUIFromFriendList((PanItem0.userData as SocialSlotIcon).account);break;
		case 1:OpenWishListUIFromFriendList((PanItem1.userData as SocialSlotIcon).account);break;
		case 2:OpenWishListUIFromFriendList((PanItem2.userData as SocialSlotIcon).account);break;
		case 3:OpenWishListUIFromFriendList((PanItem3.userData as SocialSlotIcon).account);break;
		case 4:OpenWishListUIFromFriendList((PanItem4.userData as SocialSlotIcon).account);break;
		case 5:OpenWishListUIFromFriendList((PanItem5.userData as SocialSlotIcon).account);break;
		case 6:OpenWishListUIFromFriendList((PanItem6.userData as SocialSlotIcon).account);break;
		case 7:OpenWishListUIFromFriendList((PanItem7.userData as SocialSlotIcon).account);break;
	}
}
//--
//--
function OpenWishListUIFromFriendList(account : String){
	if(!UI.getUI().GetUIRoot("WishListRoot"))
		UI.getUI().OpenUIRoot("WishListRoot");
	
	//2.判断是否单身
	//3.打开许愿单界面
	//4.默认请求自己的愿望列表
	if(ScenePlayerMgr.isMainPlayer(account)
		|| ScenePlayerMgr.IsMainPlayerLoverAccount(account)){
		var house : PlayerHouse = EQGameSceneMgr.getSingleton().getHouse();
		if(!house.hasTwoOwner())
			iGUICode_WishListRoot.getInstance().OpenSingleSelfWishUI();
		else
			iGUICode_WishListRoot.getInstance().OpenLoversSelfWishUI();
	}
	else{
		iGUICode_WishListRoot.getInstance().OpenOtherWishUI(account);
	}
}
private function CallbackMouseClickGift(callback : iGUIElement) {
	Enable(false);
	switch(callback.userData) {
		case 0:FollowLogic.GetInstance().SendGift((PanItem0.userData as SocialSlotIcon).account);break;
		case 1:FollowLogic.GetInstance().SendGift((PanItem1.userData as SocialSlotIcon).account);break;
		case 2:FollowLogic.GetInstance().SendGift((PanItem2.userData as SocialSlotIcon).account);break;
		case 3:FollowLogic.GetInstance().SendGift((PanItem3.userData as SocialSlotIcon).account);break;
		case 4:FollowLogic.GetInstance().SendGift((PanItem4.userData as SocialSlotIcon).account);break;
		case 5:FollowLogic.GetInstance().SendGift((PanItem5.userData as SocialSlotIcon).account);break;
		case 6:FollowLogic.GetInstance().SendGift((PanItem6.userData as SocialSlotIcon).account);break;
		case 7:FollowLogic.GetInstance().SendGift((PanItem7.userData as SocialSlotIcon).account);break;
	}
}

private function CallbackMouseClickMakeFriend(callback : iGUIElement) {
	switch(callback.userData) {
		case 0:FollowLogic.GetInstance().MakeFriend((PanItem0.userData as SocialSlotIcon).account);break;
		case 1:FollowLogic.GetInstance().MakeFriend((PanItem1.userData as SocialSlotIcon).account);break;
		case 2:FollowLogic.GetInstance().MakeFriend((PanItem2.userData as SocialSlotIcon).account);break;
		case 3:FollowLogic.GetInstance().MakeFriend((PanItem3.userData as SocialSlotIcon).account);break;
		case 4:FollowLogic.GetInstance().MakeFriend((PanItem4.userData as SocialSlotIcon).account);break;
		case 5:FollowLogic.GetInstance().MakeFriend((PanItem5.userData as SocialSlotIcon).account);break;
		case 6:FollowLogic.GetInstance().MakeFriend((PanItem6.userData as SocialSlotIcon).account);break;
		case 7:FollowLogic.GetInstance().MakeFriend((PanItem7.userData as SocialSlotIcon).account);break;
	}
}

private function CallbackMouseClickPersonal(callback : iGUIElement) {
	Enable(false);
	switch(callback.userData) {
		case 0:PersonalInfo.getInstance().openUIByAccount((PanItem0.userData as SocialSlotIcon).account);break;
		case 1:PersonalInfo.getInstance().openUIByAccount((PanItem1.userData as SocialSlotIcon).account);break;
		case 2:PersonalInfo.getInstance().openUIByAccount((PanItem2.userData as SocialSlotIcon).account);break;
		case 3:PersonalInfo.getInstance().openUIByAccount((PanItem3.userData as SocialSlotIcon).account);break;
		case 4:PersonalInfo.getInstance().openUIByAccount((PanItem4.userData as SocialSlotIcon).account);break;
		case 5:PersonalInfo.getInstance().openUIByAccount((PanItem5.userData as SocialSlotIcon).account);break;
		case 6:PersonalInfo.getInstance().openUIByAccount((PanItem6.userData as SocialSlotIcon).account);break;
		case 7:PersonalInfo.getInstance().openUIByAccount((PanItem7.userData as SocialSlotIcon).account);break;
	}
}

private var cancelFollowIndex : int = 0;
private function CallbackMouseClickCancelFollow(callback : iGUIElement) {
	cancelFollowIndex = callback.userData;
	var name : String = "";
	switch(cancelFollowIndex) {
		case 0:name = LabName0.label.text;break;
		case 1:name = LabName1.label.text;break;
		case 2:name = LabName2.label.text;break;
		case 3:name = LabName3.label.text;break;
		case 4:name = LabName4.label.text;break;
		case 5:name = LabName5.label.text;break;
		case 6:name = LabName6.label.text;break;
		case 7:name = LabName7.label.text;break;
	}
	UI.getUI().OpenMsgbox("", Define.getContent(5200, [name]),Define.ok,CallbackCancelFollow as iGUIEventCallback,Define.cancel,CallbackCancel as iGUIEventCallback);
}

private function CallbackCancelFollow(callback : iGUIElement) {
	switch(cancelFollowIndex) {
		case 0:FollowLogic.GetInstance().RemoveAttention((PanItem0.userData as SocialSlotIcon).account);break;
		case 1:FollowLogic.GetInstance().RemoveAttention((PanItem1.userData as SocialSlotIcon).account);break;
		case 2:FollowLogic.GetInstance().RemoveAttention((PanItem2.userData as SocialSlotIcon).account);break;
		case 3:FollowLogic.GetInstance().RemoveAttention((PanItem3.userData as SocialSlotIcon).account);break;
		case 4:FollowLogic.GetInstance().RemoveAttention((PanItem4.userData as SocialSlotIcon).account);break;
		case 5:FollowLogic.GetInstance().RemoveAttention((PanItem5.userData as SocialSlotIcon).account);break;
		case 6:FollowLogic.GetInstance().RemoveAttention((PanItem6.userData as SocialSlotIcon).account);break;
		case 7:FollowLogic.GetInstance().RemoveAttention((PanItem7.userData as SocialSlotIcon).account);break;
	}
}

private function CallbackMouseClickCancelFriend(callback : iGUIElement) {
	Global.GetSysMsgHandler().ShowSysMsg(512);
}

private function CallbackMouseOverInitmage(callback : iGUIElement) {
	if(callback.userData != null) {
		var str : String = (callback.userData as FriendIntimateRow).desc;
		
		var style : GUIStyle = new GUIStyle();
		style.normal.textColor = Color.white;
		style.fontStyle = FontStyle.Bold;
		Global.SysTooltip.Begin(callback);
		Global.SysTooltip.Add(GUIContent(str),style); 	
		Global.SysTooltip.Show(true);
	}
}

private function CallbackCancel(callback : iGUIElement) {
}

private static var instance : iGUICode_SocialUI;
function Awake(){
	instance=this;
	
	RegistEventMsg();
}
static function getInstance(){
	return instance;
}

@HideInInspector
var ImgPlant7 : iGUIImage;
@HideInInspector
var ImgIntimate7 : iGUIImage;
@HideInInspector
var BtnCancelFriend7 : iGUIButton;
@HideInInspector
var BtnMakeFriend7 : iGUIButton;
@HideInInspector
var BtnCancelFollow7 : iGUIButton;
@HideInInspector
var BtnWish7 : iGUIButton;
@HideInInspector
var BtnGift7 : iGUIButton;
@HideInInspector
var BtnPeasonalIntro7 : iGUIButton;
@HideInInspector
var ImgIcon7 : iGUIImage;
@HideInInspector
var ImgQQHZYear7 : iGUIImage;
@HideInInspector
var LabName7 : iGUILabel;
@HideInInspector
var LabLevel7 : iGUILabel;
@HideInInspector
var ImgQQHZ7 : iGUIImage;
@HideInInspector
var ImgBG7 : iGUIImage;
@HideInInspector
var PanItem7 : iGUIPanel;

@HideInInspector
var ImgPlant6 : iGUIImage;
@HideInInspector
var ImgIntimate6 : iGUIImage;
@HideInInspector
var BtnCancelFriend6 : iGUIButton;
@HideInInspector
var BtnMakeFriend6 : iGUIButton;
@HideInInspector
var BtnCancelFollow6 : iGUIButton;
@HideInInspector
var BtnWish6 : iGUIButton;
@HideInInspector
var BtnGift6 : iGUIButton;
@HideInInspector
var BtnPeasonalIntro6 : iGUIButton;
@HideInInspector
var ImgIcon6 : iGUIImage;
@HideInInspector
var ImgQQHZYear6 : iGUIImage;
@HideInInspector
var LabName6 : iGUILabel;
@HideInInspector
var LabLevel6 : iGUILabel;
@HideInInspector
var ImgQQHZ6 : iGUIImage;
@HideInInspector
var ImgBG6 : iGUIImage;
@HideInInspector
var PanItem6 : iGUIPanel;

@HideInInspector
var ImgPlant5 : iGUIImage;
@HideInInspector
var ImgIntimate5 : iGUIImage;
@HideInInspector
var BtnCancelFriend5 : iGUIButton;
@HideInInspector
var BtnMakeFriend5 : iGUIButton;
@HideInInspector
var BtnCancelFollow5 : iGUIButton;
@HideInInspector
var BtnWish5 : iGUIButton;
@HideInInspector
var BtnGift5 : iGUIButton;
@HideInInspector
var BtnPeasonalIntro5 : iGUIButton;
@HideInInspector
var ImgIcon5 : iGUIImage;
@HideInInspector
var ImgQQHZYear5 : iGUIImage;
@HideInInspector
var LabName5 : iGUILabel;
@HideInInspector
var LabLevel5 : iGUILabel;
@HideInInspector
var ImgQQHZ5 : iGUIImage;
@HideInInspector
var ImgBG5 : iGUIImage;
@HideInInspector
var PanItem5 : iGUIPanel;

@HideInInspector
var ImgPlant4 : iGUIImage;
@HideInInspector
var ImgIntimate4 : iGUIImage;
@HideInInspector
var BtnCancelFriend4 : iGUIButton;
@HideInInspector
var BtnMakeFriend4 : iGUIButton;
@HideInInspector
var BtnCancelFollow4 : iGUIButton;
@HideInInspector
var BtnWish4 : iGUIButton;
@HideInInspector
var BtnGift4 : iGUIButton;
@HideInInspector
var BtnPeasonalIntro4 : iGUIButton;
@HideInInspector
var ImgIcon4 : iGUIImage;
@HideInInspector
var ImgQQHZYear4 : iGUIImage;
@HideInInspector
var LabName4 : iGUILabel;
@HideInInspector
var LabLevel4 : iGUILabel;
@HideInInspector
var ImgQQHZ4 : iGUIImage;
@HideInInspector
var ImgBG4 : iGUIImage;
@HideInInspector
var PanItem4 : iGUIPanel;

@HideInInspector
var ImgPlant3 : iGUIImage;
@HideInInspector
var ImgIntimate3 : iGUIImage;
@HideInInspector
var BtnCancelFriend3 : iGUIButton;
@HideInInspector
var BtnMakeFriend3 : iGUIButton;
@HideInInspector
var BtnCancelFollow3 : iGUIButton;
@HideInInspector
var BtnWish3 : iGUIButton;
@HideInInspector
var BtnGift3 : iGUIButton;
@HideInInspector
var BtnPeasonalIntro3 : iGUIButton;
@HideInInspector
var ImgIcon3 : iGUIImage;
@HideInInspector
var ImgQQHZYear3 : iGUIImage;
@HideInInspector
var LabName3 : iGUILabel;
@HideInInspector
var LabLevel3 : iGUILabel;
@HideInInspector
var ImgQQHZ3 : iGUIImage;
@HideInInspector
var ImgBG3 : iGUIImage;
@HideInInspector
var PanItem3 : iGUIPanel;

@HideInInspector
var ImgPlant2 : iGUIImage;
@HideInInspector
var ImgIntimate2 : iGUIImage;
@HideInInspector
var BtnCancelFriend2 : iGUIButton;
@HideInInspector
var BtnMakeFriend2 : iGUIButton;
@HideInInspector
var BtnCancelFollow2 : iGUIButton;
@HideInInspector
var BtnWish2 : iGUIButton;
@HideInInspector
var BtnGift2 : iGUIButton;
@HideInInspector
var BtnPeasonalIntro2 : iGUIButton;
@HideInInspector
var ImgIcon2 : iGUIImage;
@HideInInspector
var ImgQQHZYear2 : iGUIImage;
@HideInInspector
var LabName2 : iGUILabel;
@HideInInspector
var LabLevel2 : iGUILabel;
@HideInInspector
var ImgQQHZ2 : iGUIImage;
@HideInInspector
var ImgBG2 : iGUIImage;
@HideInInspector
var PanItem2 : iGUIPanel;

@HideInInspector
var ImgPlant1 : iGUIImage;
@HideInInspector
var ImgIntimate1 : iGUIImage;
@HideInInspector
var BtnCancelFriend1 : iGUIButton;
@HideInInspector
var BtnMakeFriend1 : iGUIButton;
@HideInInspector
var BtnCancelFollow1 : iGUIButton;
@HideInInspector
var BtnWish1 : iGUIButton;
@HideInInspector
var BtnGift1 : iGUIButton;
@HideInInspector
var BtnPeasonalIntro1 : iGUIButton;
@HideInInspector
var ImgIcon1 : iGUIImage;
@HideInInspector
var ImgQQHZYear1 : iGUIImage;
@HideInInspector
var LabName1 : iGUILabel;
@HideInInspector
var LabLevel1 : iGUILabel;
@HideInInspector
var ImgQQHZ1 : iGUIImage;
@HideInInspector
var ImgBG1 : iGUIImage;
@HideInInspector
var PanItem1 : iGUIPanel;

@HideInInspector
var ImgPlant0 : iGUIImage;
@HideInInspector
var ImgIntimate0 : iGUIImage;
@HideInInspector
var BtnCancelFriend0 : iGUIButton;
@HideInInspector
var BtnMakeFriend0 : iGUIButton;
@HideInInspector
var BtnCancelFollow0 : iGUIButton;
@HideInInspector
var BtnWish0 : iGUIButton;
@HideInInspector
var BtnGift0 : iGUIButton;
@HideInInspector
var BtnPeasonalIntro0 : iGUIButton;
@HideInInspector
var ImgIcon0 : iGUIImage;
@HideInInspector
var ImgQQHZYear0 : iGUIImage;
@HideInInspector
var LabName0 : iGUILabel;
@HideInInspector
var LabLevel0 : iGUILabel;
@HideInInspector
var ImgQQHZ0 : iGUIImage;
@HideInInspector
var ImgBG0 : iGUIImage;
@HideInInspector
var PanItem0 : iGUIPanel;

@HideInInspector
var ConContentList : iGUIContainer;
@HideInInspector
var LabPage : iGUILabel;
@HideInInspector
var BtnNextPage : iGUIButton;
@HideInInspector
var BtnPrePage : iGUIButton;
@HideInInspector
var BtnFirstPage : iGUIButton;
@HideInInspector
var BtnFollow : iGUIButton;
@HideInInspector
var BtnFriend : iGUIButton;
@HideInInspector
var BtnInvite : iGUIButton;
@HideInInspector
var BtnClose : iGUIButton;
@HideInInspector
var PanMain : iGUIPanel;
@HideInInspector
var root1 : iGUIRoot;
