#pragma strict
import iGUI;

class PlayerNameInfo extends PlatResInfoCtrl {
	public var nameElement : iGUIButton;
	
	//overwrite
	public function Callback() {
	 	iGUICode_RoleAssist.getInstance().Callback_PlayerNameInfo(this);
	 } 
}

private var mInit : boolean = false;
private var mAccount : String = "";
private var mObject : GameObject = null;
private var mNameInfoLoaderArray : Array = new Array();

function Start() {
	Init();
	UI.getUI().SetIgnoreMouseOver(ConFunctions, true);
}

function OnDestroy(){
	clearNameInfoLoder();
}

function Update() {
	//mouse down anywhere
	if (Input.GetMouseButtonUp(0)) {
		Enable(false,null,false);
	}
}

function OnGUI()
{
	UpdateUIPosition();
}

private function RegistEventMsg() {
	//EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_CLICK_PLAYER), HandleNotifyAssistEnable);
}

private function Init() {
	BtnFollow.clickCallback = CallbackMouseClickFollow;
	BtnGift.clickCallback = CallbackMouseClickGift;
	BtnAction.clickCallback = CallbackMouseClickAction;
	BtnVisit.clickCallback = CallbackMouseClickVisit;
	BtnInfo.clickCallback = CallbackMouseClickInfo;
	chat_private.clickCallback = ClickCallback_ChatPrivate;
	BtnMakeFriend.clickCallback = ClickCallback_BtnMakeFriend;
	BtnKick.clickCallback = CallbackMouseClickKick;
	
	mInit = true;
}

function clearNameInfoLoder()
{
	for (var obj : Object in mNameInfoLoaderArray)
	{
		var loader : PlatResLoader = obj as PlatResLoader;
		loader.Cancel();
	}
	mNameInfoLoaderArray.Clear();
}
//--
function ClickCallback_ChatPrivate(caller : iGUIButton){
	Enable(false,null,false);
	ReqPlayerNameInfo(mAccount, caller);
}
//--
function ReqPlayerNameInfo(account : String, ctrl : iGUIButton){
	clearNameInfoLoder();
	var info : PlayerNameInfo = new PlayerNameInfo();
	info.account = account;
	info.nameElement = ctrl;
	var nameInfoLoader : PlatResLoader = Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(account,info);
	mNameInfoLoaderArray.Add(nameInfoLoader);
}
//--
function Callback_PlayerNameInfo(obj : PlayerNameInfo){
	var name : String = "";
	var caller : iGUIButton = obj.nameElement;
	if("" == obj.info.nickname){
		name = Define.noname;
	}
	else{
		name = obj.info.nickname;
		name = name.Trim();
		name = name.Replace("\n", "");
	}
	var chat_data : ChatItemClass = new ChatItemClass(obj.account, "", "", CHAT_TYPE.CHAT_TO_OTHER_PRIVATE);
	chat_data.name = name;
	caller.userData = chat_data;
	ChatLogic.getInstance().ClickCallback_ChatPrivate(caller);
}

private var validClick : boolean = false;
public function Enable(enable : boolean,obj : GameObject,bValid : boolean) {
	if(enable) {
		validClick = bValid;
	} else{
		if(validClick) { 
			validClick = false;
			return ;
		}
	}
	if(enable && !mInit) {
		Init();
	}
	UI.getUI().EnableUIRoot("RoleAssistUI",enable);
	if(obj != null) {
		mObject = obj;
		mAccount = obj.GetComponent(Player).getAccount();
		
		UpdateUIPosition();
		
		
		//enable buttons
		var hostAccount : String = DataCenter.getMaleHostAccount();
		var hostLoverAccount : String = DataCenter.getFemaleHostAccount();
		var account : String = DataCenter.getMainPlayerAccount();
		if(DataCenter.isPlayerInCommonScene() || DataCenter.isPlayerInPubScene()) {
			BtnKick.setEnabled(false);
		} else if(account == hostAccount || account == hostLoverAccount) {
			if(mAccount == hostAccount || mAccount == hostLoverAccount) {
				BtnKick.setEnabled(false);
			} else { 
				BtnKick.setEnabled(true);
			}
		} else {
			BtnKick.setEnabled(false);
		} 
	}
}

private function UpdateUIPosition()
{
	if (null==mObject || false==root1.enabled || false==ConFunctions.enabled)
		return;
	
	var pos : Vector3 = Camera.main.WorldToScreenPoint(mObject.transform.position);
	pos.y = Screen.height - pos.y;
	var x : float = pos.x - ConFunctions.rect.width/2;
	var y : float = pos.y - ConFunctions.rect.height/2 - 90;
	ConFunctions.setX(x);
	ConFunctions.setY(y);
}

//handle game event
/*
private function HandleNotifyAssistEnable(evt:GameEvent, obj:System.Object) {
	if(obj == null || obj.GetComponent(Player) == null) {
		Debug.LogWarning("pick object is null!!!");
		return ;
	}
	var account : String = obj.GetComponent(Player).getAccount();
	if(account == "") {
		Debug.LogWarning("invalid account!!");
		return ;
	}
	Enable(true,account);
}
*/

//Callback
private function CallbackMouseClickFollow(callback : iGUIElement) {
	FollowLogic.GetInstance().AddAttention(mAccount);
	
	Enable(false,null,false);
}

private function CallbackMouseClickGift(callback : iGUIElement) {
	Enable(false,null,false);	// step1
	
	GiftLogic.Ctrl.Set("receive_account", mAccount);	// step2
	GiftLogic.Ctrl.Excute("open_gift_make_ui", true);	// step3
}

private function CallbackMouseClickAction(callback : iGUIElement) {
	//TODO:
	Enable(false,null,false);
}

private function CallbackMouseClickVisit(callback : iGUIElement) {
	Enable(false,null,false);	// step1
	
	PlayerFriend.GetInstance().ReqEnterFriendHouse(mAccount,enter_house_type.eht_menu);
}

private function CallbackMouseClickInfo(callback : iGUIElement) {
	Enable(false,null,false);
	
	PersonalInfo.getInstance().openUIByAccount(mAccount);
}

private function ClickCallback_BtnMakeFriend(callback : iGUIElement) {
	Enable(false,null,false);
	
	FollowLogic.GetInstance().MakeFriend(mAccount);
}

private function CallbackMouseClickKick(callback : iGUIElement) {
	Enable(false,null,false);
	
	KickLogic.GetInstance().ReqKickPlayer(mAccount);
}

private static var instance : iGUICode_RoleAssist;
function Awake(){
	instance=this;
	
	RegistEventMsg();
}
static function getInstance(){
	return instance;
}

@HideInInspector
var BtnKick : iGUIButton;
@HideInInspector
var BtnMakeFriend : iGUIButton;
@HideInInspector
var chat_private : iGUIButton;
@HideInInspector
var ConFunctions : iGUIPanel;
@HideInInspector
var BtnInfo : iGUIButton;
@HideInInspector
var BtnVisit : iGUIButton;
@HideInInspector
var BtnAction : iGUIButton;
@HideInInspector
var BtnGift : iGUIButton;
@HideInInspector
var BtnFollow : iGUIButton;
@HideInInspector
var root1 : iGUIRoot;