#pragma strict
#pragma downcast
import iGUI;

class InviteGiftIcon {
	public var gift : InviteGift = null;	// gift data
	public var asynIcon : AsynIcon = null;	// asyn icon manager
	public var iconSlot : iGUIImage;		// icon slot ui
	
	public function CallbackIconLoad(tex : Texture) {
		iconSlot.image = tex;
	}
}

class FriendInviteIcon extends PlatResInfoCtrl {
	public var imageElement : iGUIImage;
	public var nameElement : iGUILabel;
	
	//overwrite
	public function Callback() {
		if(URLValid) {
			imageElement.image = image;
		} else {
			imageElement.image = Resources.Load("UISkins/Textures/Common1/default_avatar");
		}
		nameElement.label.text = info.nickname;
	}
}


private var mInviteNum : int = 1;
private var mGiftNum : int = 5;
private var mInit : boolean = false;

private var mGiftRandomList : ArrayList = new ArrayList();			//struct InviteGiftIcon

function Start() {
	Init();
}

private function Init() {
	BtnClose.clickCallback = CallbackMouseClickClose;
	BtnGfitGet.clickCallback = CallbackMouseClickGetGift;
	BtnFriend1.clickCallback = CallbackMouseClickInviteFriend;
	BtnGoBBS.clickCallback = CallbackMouseClickGoBBS;
	ImgGift1.mouseOverCallback = CallbackMouseOverGift;
	ImgGift2.mouseOverCallback = CallbackMouseOverGift;
	ImgGift3.mouseOverCallback = CallbackMouseOverGift;
	ImgGift4.mouseOverCallback = CallbackMouseOverGift;
	ImgGift5.mouseOverCallback = CallbackMouseOverGift;
	
	var bgAsynIcon : AsynIcon =  new AsynIcon(CallbackBGIcon, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	bgAsynIcon.load("UI/friend_invite_bg.png.u3d");
	
	mInit = true;
}

private function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REFRESH_INVITE_FRIEND_LIST), HandleNotifyRefreshFriend);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REFRESH_INVITE_GIFT_LIST), HandleNotifyRefreshGift);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REFRESH_INVITE_GIFT_RESULT), HandleNotifyRefreshGiftResult);
}

//handle client net msg
private function HandleNotifyRefreshFriend(evt:GameEvent, obj:ArrayList) {
	var friendList : ArrayList = new ArrayList();
	friendList = obj.Clone();
	
	ClearFriendList();
	for(var i=0; i<mInviteNum; i++) {
		if(friendList.Count < i+1) {
			if(i==0) {
				BtnFriend1.setEnabled(true);
				ImgFriend1.setEnabled(false);
				LabFriend1.setEnabled(false);
			}
		} else {
			if(i==0) {
				BtnFriend1.setEnabled(false);
				ImgFriend1.setEnabled(true);
				LabFriend1.setEnabled(true);
				
				SetElementImage(ImgFriend1,LabFriend1,friendList[i],i);
			}
		}
	}
	
	var count : int = FriendInviteLogic.GetInstance().GetGiftGetCount();
	if(count > 0) {
		BtnGfitGet.style.normal.background = Resources.Load("UISkins/Textures/yaoqing/yaoqing_ok");
		BtnGfitGet.style.hover.background = Resources.Load("UISkins/Textures/yaoqing/yaoqing_ok_hover");
		BtnGfitGet.style.active.background = Resources.Load("UISkins/Textures/yaoqing/yaoqing_ok");
	} else {
		BtnGfitGet.style.normal.background = Resources.Load("UISkins/Textures/yaoqing/yaoqing_ok_hui");
		BtnGfitGet.style.hover.background = Resources.Load("UISkins/Textures/yaoqing/yaoqing_ok_hui");
		BtnGfitGet.style.active.background = Resources.Load("UISkins/Textures/yaoqing/yaoqing_ok_hui");
	}
	LabGetGiftCount.label.text = count.ToString();
	LabFriendCount.label.text = count.ToString();
}

private function HandleNotifyRefreshGift(evt:GameEvent, obj:ArrayList) {
	var giftList : ArrayList = new ArrayList();
	giftList = obj.Clone();
	
	ClearGiftList();
	for(var i=0; i<giftList.Count; i++) {
		if(i > mGiftNum-1) break;
		
		if(i==0) {
			SetGiftSlot(ImgGift1,LabGift1,giftList[i]);
			mGiftRandomList.Add(ImgGift1.userData);
		} else if(i==1) {
			SetGiftSlot(ImgGift2,LabGift2,giftList[i]);
			mGiftRandomList.Add(ImgGift2.userData);
		} else if(i==2) {
			SetGiftSlot(ImgGift3,LabGift3,giftList[i]);
			mGiftRandomList.Add(ImgGift3.userData);
		} else if(i==3) {
			SetGiftSlot(ImgGift4,LabGift4,giftList[i]);
			mGiftRandomList.Add(ImgGift4.userData);
		} else if(i==4) {
			SetGiftSlot(ImgGift5,LabGift5,giftList[i]);
			mGiftRandomList.Add(ImgGift5.userData);
		}
	}
}

private function HandleNotifyRefreshGiftResult(evt:GameEvent, obj:System.Object) {
	SetGiftSlot(ImgGiftResult,LabGiftResult,obj);
	
	BtnGfitGet.passive = false;
}
//internal function
private function ClearFriendList() {
	BtnFriend1.setEnabled(true);
	ImgFriend1.setEnabled(false);
	LabFriend1.setEnabled(false);
}

private function ClearGiftList() {
	ImgGift1.image = null;
	ImgGift1.userData = null;
	ImgGift2.image = null;
	ImgGift2.userData = null;
	ImgGift3.image = null;
	ImgGift3.userData = null;
	ImgGift4.image = null;
	ImgGift4.userData = null;
	ImgGift5.image = null;
	ImgGift5.userData = null;
	
	mGiftRandomList.Clear();
}

private function ShowGiftTip(slot : InviteGiftIcon) {
	if(slot == null) return ;
	if(slot.gift.gift_type == 1) {
		ItemHint.ShowPackItemHint(slot.iconSlot, ResManager.LgtMgr.getItemRow(slot.gift.item_id), false);
	}
}

private function SetElementImage(imageElement : iGUIElement,nameElement : iGUIElement,account : String,idx : int) {
	if(account == null) {
		return ;
	}
	
	var slotData : FriendInviteIcon = new FriendInviteIcon();
	
	(imageElement as iGUIImage).image = null;
	(nameElement as iGUILabel).label.text = "";
	
	slotData.account = account;
	slotData.imageElement = imageElement;
	slotData.nameElement = nameElement;
	
	Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(account,slotData);
}

private function SetGiftSlot(imageElement : iGUIElement,countElement : iGUIElement,gift : InviteGift) {
	var gift_icon : InviteGiftIcon = new InviteGiftIcon();
	gift_icon.gift = gift;
	gift_icon.iconSlot = imageElement;
	if(gift.gift_type == 1) {
		gift_icon.asynIcon =  new AsynIcon(gift_icon.CallbackIconLoad, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
		gift_icon.asynIcon.load("Icon/" + ResManager.LgtMgr.getItemRow(gift.item_id).icon);
	} else if(gift.gift_type == 2) {
		gift_icon.iconSlot.image = Resources.Load("UISkins/Textures/Common1/gift_crystal");
	} else {
		Debug.Log("there is something wrong in the invite table");
	}
	
	countElement.label.text = gift.count.ToString();
	imageElement.userData = gift_icon;
}

private function NoticeGiftRoll() {
	yield WaitForSeconds(Global.mGiftRandomTime);
	var animation : iGUITextureAnimation = ImgGiftResult.getTextureAnimation("animationInvite");
	animation.stop();
	FriendInviteLogic.GetInstance().InviteGift();
}
//external function
public function Enable(enable : boolean) {
	PanFriendInvite.setEnabled(enable);
	
	if(enable) {
		if(!mInit) {
			Init();
		}
		UI.getUI().SetModal("FriendInviteUI", true);
		
		FriendInviteLogic.GetInstance().InviteList();
		
		ImgGiftResult.image = Resources.Load("UISkins/Textures/yaoqing/yaoqing_？");
	} else {
		UI.getUI().SetModal("FriendInviteUI", false);
	}
}

//callback function
private function CallbackMouseClickGetGift(callback : iGUIElement) {
	var count : int = FriendInviteLogic.GetInstance().GetGiftGetCount();
	if(count > 0) {
		var animation : iGUITextureAnimation = ImgGiftResult.getTextureAnimation("animationInvite");
		if(animation != null) {
			for(var i=0; i<mGiftRandomList.Count; i++) {
				if(i >= animation.images.Count) break;
				
				animation.images[i] = (mGiftRandomList[i] as InviteGiftIcon).iconSlot.image;
			}
			animation.playFromStart();
		}
		callback.passive = true;
		NoticeGiftRoll();
	}
}

private function CallbackMouseClickClose(callback : iGUIElement) {
	Enable(false);
}

private function CallbackMouseClickInviteFriend(callback : iGUIElement) {
	Enable(false);
	FriendInviteLogic.GetInstance().InviteFriend();
}

private function CallbackMouseClickGoBBS(callback : iGUIElement) {
	Enable(false);
	FriendInviteLogic.GetInstance().OpenBBS();
}

private function CallbackMouseOverGift(callback : iGUIElement) {
	ShowGiftTip(callback.userData);
}

private function CallbackBGIcon(tex:Texture) {
	PanFriendInvite.style.normal.background = tex;
}

private static var instance : iGUICode_FriendInviteUI;
function Awake(){
	instance=this;
	
	RegistEventMsg();
}
static function getInstance(){
	return instance;
}
@HideInInspector
var BtnGoBBS : iGUIButton;
@HideInInspector
var LabFriendCount : iGUILabel;
@HideInInspector
var LabGetGiftCount : iGUILabel;
@HideInInspector
var LabGiftResult : iGUILabel;
@HideInInspector
var LabGift1 : iGUILabel;
@HideInInspector
var LabGift2 : iGUILabel;
@HideInInspector
var LabGift3 : iGUILabel;
@HideInInspector
var LabGift4 : iGUILabel;
@HideInInspector
var LabGift5 : iGUILabel;
@HideInInspector
var BtnFriend1 : iGUIButton;
@HideInInspector
var LabFriend1 : iGUILabel;
@HideInInspector
var ImgFriend1 : iGUIImage;
@HideInInspector
var BtnGfitGet : iGUIButton;
@HideInInspector
var ImgGiftResult : iGUIImage;
@HideInInspector
var ImgGift5 : iGUIImage;
@HideInInspector
var ImgGift4 : iGUIImage;
@HideInInspector
var ImgGift3 : iGUIImage;
@HideInInspector
var ImgGift2 : iGUIImage;
@HideInInspector
var ImgGift1 : iGUIImage;
@HideInInspector
var BtnClose : iGUIButton;
@HideInInspector
var PanFriendInvite : iGUIPanel;
@HideInInspector
var root1 : iGUIRoot;
