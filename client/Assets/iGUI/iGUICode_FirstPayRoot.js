import iGUI;

var normalRewardBtnImg : Texture2D;
var hoverRewardBtnImg : Texture2D;
var disableRewardBtnImg : Texture2D;
var hasRewardBtnImg : Texture2D;
var rewardItemIDs : int[];
var itemHintStyle : GUIStyle;
private static var instance : iGUICode_FirstPayRoot;
private var had_get_reward : boolean = false;

class FirstPayRewardItemDesc{
	var itemName : String;
	var desc : String;
}

function Awake(){
	instance=this;
	RegistEvt();
}
function Start(){
	RegistCtrlCallbackFunc();
}

static function getInstance(){
	return instance;
}

@HideInInspector
var image3 : iGUIImage;
@HideInInspector
var image2 : iGUIImage;
@HideInInspector
var image1 : iGUIImage;
@HideInInspector
var container1 : iGUIContainer;
@HideInInspector
var close_btn : iGUIButton;
@HideInInspector
var getRewardBtn : iGUIButton;
@HideInInspector
var firstPayPanel : iGUIPanel;
@HideInInspector
var firstPayRoot : iGUIRoot;

function RegistCtrlCallbackFunc(){
	image1.mouseOverCallback = MouseOverCallback_RewardItemDesc;
	image2.mouseOverCallback = MouseOverCallback_RewardItemDesc;
	image3.mouseOverCallback = MouseOverCallback_RewardItemDesc;
	close_btn.clickCallback = ClickCallback_close_btn;
}

function RegistEvt(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.FIRSTPAYMENT_STATUSRESULT), HandleFirstPaymentStatusResult);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.GET_FIRSTPAYMENT_REWARD), HandleAfterGetReward);
}

function MouseOverCallback_RewardItemDesc(caller : iGUIElement){
	if(!caller.userData)
		return;
	
	var desc_class : FirstPayRewardItemDesc = caller.userData as FirstPayRewardItemDesc;
	var itm_name : String = desc_class.itemName;
	var itm_desc : String = desc_class.desc;
	Global.GetSysTooltip().Begin(caller);
	Global.GetSysTooltip().Add(GUIContent(itm_name), itemHintStyle);
	if(itm_desc != ""){
		Global.GetSysTooltip().Add(GUIContent(itm_desc), itemHintStyle);
	}
	Global.GetSysTooltip().Show(true);

}

function HandleAfterGetReward(evt : GameEvent, obj : Object){
	getRewardBtn.clickCallback = null;
	instance.getRewardBtn.style.normal.background = instance.hasRewardBtnImg;
	instance.getRewardBtn.style.hover.background = instance.hasRewardBtnImg;
	instance.getRewardBtn.style.active.background = instance.hasRewardBtnImg;
	had_get_reward = true;
}

function HandleFirstPaymentStatusResult(evt : GameEvent, obj : Object){
	var result : int = Convert.ToInt32(obj);
	SetBtnVariable(result);
}

function ClickCallback_getRewardBtn(caller : iGUIElement){
	ReqRewardStatus();
}

function ClickCallback_close_btn(caller : iGUIElement){
	ClosePanel();
	if(had_get_reward){
		var fp_obj : GameObject = GameObject.Find("FirstPaymentGameObject");
		if(fp_obj)
		{
			var _comp : Component = fp_obj.GetComponent("FirstPayComp");
			if(_comp)
				Destroy(_comp);
			
			Destroy(fp_obj);
		}
	}
	CloseRoot();
}

function OnDestroy(){
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.GET_FIRSTPAYMENT_REWARD), HandleAfterGetReward);
}

static function Init(){
	OpenRoot();
	if(!PlatformMgr.IsPlatYY())
		LoadPanelBg(instance.firstPayPanel, "shouci.png.u3d");
	else
		LoadPanelBg(instance.firstPayPanel, "shouci_yy.png.u3d");
	OpenPanel();
	LoadRewardItemInfo();
}

static function SetBtnVariable(result : int){
	if(result == 0){
		instance.getRewardBtn.clickCallback = null;
		instance.getRewardBtn.style.normal.background = instance.disableRewardBtnImg;
		instance.getRewardBtn.style.hover.background = instance.disableRewardBtnImg;
		instance.getRewardBtn.style.active.background = instance.disableRewardBtnImg;
	}
	else if(result == 1){
		instance.getRewardBtn.clickCallback = instance.ClickCallback_getRewardBtn;
		instance.getRewardBtn.style.normal.background = instance.normalRewardBtnImg;
		instance.getRewardBtn.style.hover.background = instance.hoverRewardBtnImg;
		instance.getRewardBtn.style.active.background = instance.normalRewardBtnImg;
	}
}

static function LoadRewardItemInfo(){
	for(var i:int=0; i<instance.rewardItemIDs.length; ++i){
		var item_id : int = instance.rewardItemIDs[i];
		if(item_id > 0){
			var item_row : ItemRow = ResManager.LgtMgr.getItemRow(item_id);
			var item_name : String = item_row.name;
			var desc_class : FirstPayRewardItemDesc = new FirstPayRewardItemDesc();
			desc_class.itemName = item_name;
			desc_class.desc = ResManager.LgtMgr.getItemDescription(item_id);
			var img_frm : iGUIImage = instance.container1.items[i] as iGUIImage;
			img_frm.userData = desc_class;
		}
	}
}

static function LoadPanelBg(panel : iGUIPanel, img_name : String){
	var _asynIcon : AsynIcon = new AsynIcon(function (img : Texture){panel.style.normal.background = img;}, null);
	_asynIcon.load("UI/" + img_name); 	
}

static function OpenPanel(){
	instance.firstPayPanel.setEnabled(true);
}

static function ClosePanel(){
	instance.firstPayPanel.setEnabled(false);
}

static function OpenRoot(){
	if(!UI.getUI().GetUIRoot("FirstPayRoot"))
		UI.getUI().OpenUIRoot("FirstPayRoot");
		
	UI.getUI().SetModal("FirstPayRoot", true);
}

static function CloseRoot(){
	if(UI.getUI().GetUIRoot("FirstPayRoot"))
		UI.getUI().CloseUIRoot("FirstPayRoot");
		
	UI.getUI().SetModal("FirstPayRoot", false);
}

static function ReqRewardStatus(){
	var req : req_first_payment_return_reward = new req_first_payment_return_reward();
	NetHelper.Send(req);
}

