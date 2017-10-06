import iGUI;

private static var instance : iGUICode_PartyFunctionUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var enable_btn : iGUIButton;
@HideInInspector
var bottom_num5 : iGUILabel;
@HideInInspector
var bottom_image5 : iGUIImage;
@HideInInspector
var bottom_num4 : iGUILabel;
@HideInInspector
var bottom_image4 : iGUIImage;
@HideInInspector
var bottom_num3 : iGUILabel;
@HideInInspector
var bottom_image3 : iGUIImage;
@HideInInspector
var bottom_num2 : iGUILabel;
@HideInInspector
var bottom_image2 : iGUIImage;
@HideInInspector
var bottom_num1 : iGUILabel;
@HideInInspector
var bottom_image1 : iGUIImage;
@HideInInspector
var center_cover5 : iGUILabel;
@HideInInspector
var center_icon5 : iGUILabel;
@HideInInspector
var center_cover4 : iGUILabel;
@HideInInspector
var center_icon4 : iGUILabel;
@HideInInspector
var center_cover3 : iGUILabel;
@HideInInspector
var center_icon3 : iGUILabel;
@HideInInspector
var center_cover2 : iGUILabel;
@HideInInspector
var center_icon2 : iGUILabel;
@HideInInspector
var center_cover1 : iGUILabel;
@HideInInspector
var center_icon1 : iGUILabel;
@HideInInspector
var top_praise_btn : iGUIButton;
@HideInInspector
var top_total_score : iGUILabel;
@HideInInspector
var top_tip_label1 : iGUILabel;
@HideInInspector
var bottom_frame : iGUIPanel;
@HideInInspector
var center_frame : iGUIPanel;
@HideInInspector
var top_frame : iGUIPanel;
@HideInInspector
var frame : iGUIPanel;
@HideInInspector
var root : iGUIRoot;



private var SLOT_NUM : int = 5;
private var mBottomSlotArray : Array = new Array();
private var mCenterSlotArray : Array = new Array();
private var mPraiseBtnTip : String = "";
//--------------------------------------------------
function Start()
{
	// 界面事件注册
	top_praise_btn.clickCallback = ClickCallback_top_praise_btn;
	enable_btn.clickCallback = ClickCallback_enable_btn;
	//
	registerEvents();
	init();
}
//--------------------------------------------------
function OnDestroy()
{
	unregisterEvents();
	clear();
	
	// alter by zlj 隐藏派对请喝酒按钮
	//iGUICode_MainUI.getInstance().showPartyDrinkBtn(false);
}
//--------------------------------------------------
function ClickCallback_top_praise_btn(caller : iGUIElement)
{
	Party.request_add_party_score();
}
//--------------------------------------------------
function ClickCallback_enable_btn(caller : iGUIElement)
{
	var enable : boolean = caller.userData;
	// 隐藏好友列表
	if (false == enable && UI.getUI().isUIRootOpen("SocialUI"))
	{
		iGUICode_SocialUI.getInstance().Enable(false);
	}
	setEnableBtnState(!enable);
}
//--------------------------------------------------
private function registerEvents() : void
{
	Party.Ctrl.Register("NOTIY_PARTY_ITEMS", setBottomSlots);
	Party.Ctrl.Register("NOTIFY_UPDATE_PARTY_ITEMS", updateBottomSlots);
	Party.Ctrl.Register("NOTIFY_PARTY_SCORE", updatePartyScore);
	Party.Ctrl.Register("NOTIFY_PARTY_EXP_BUFFS", updatePartyExpBuffs);
}
//--------------------------------------------------
private function unregisterEvents() : void
{
	Party.Ctrl.Unregister("NOTIY_PARTY_ITEMS", setBottomSlots);
	Party.Ctrl.Unregister("NOTIFY_UPDATE_PARTY_ITEMS", updateBottomSlots);
	Party.Ctrl.Unregister("NOTIFY_PARTY_SCORE", updatePartyScore);
	Party.Ctrl.Unregister("NOTIFY_PARTY_EXP_BUFFS", updatePartyExpBuffs);
}
//--------------------------------------------------
private function init() : void
{
	setEnableBtnState(true);
	// 主人家不显示赞按钮
	top_praise_btn.setEnabled(!DataCenter.isInSelfHouse());
	setBottomSlots(Party.Ctrl.Get("prop_award_items"));
	updateBottomSlots(Party.Ctrl.Get("update_party_items"));
	updatePartyScore(Party.Ctrl.Get("party_score"));
	updatePartyExpBuffs(Party.Ctrl.Get("party_exp_buffs"));
	
	// alter by zlj 显示派对请喝酒按钮
	//iGUICode_MainUI.getInstance().showPartyDrinkBtn(true);
}
//--------------------------------------------------
private function clear() : void
{
	for (var bottomSlot : PartyPropAwardSlot in mBottomSlotArray)
	{
		bottomSlot.setContent(null);
	}
	mBottomSlotArray.Clear();
	//
	for (var centerSlot : PartyExpBuffSlot in mCenterSlotArray)
	{
		centerSlot.setContent(0, 0, 0);
	}
	mCenterSlotArray.Clear();
}
//--------------------------------------------------
private function createBottomSlots() : void
{
	if (0 == mBottomSlotArray.Count)
	{
		for (var i:int = 0; i<SLOT_NUM; ++i)
		{
			var bottom : iGUIElement[] = getBottomCtrls(i);
			var bottomSlot : PartyPropAwardSlot = new PartyPropAwardSlot(null, bottom[0], bottom[1]);
			bottomSlot.setContent(null);
			mBottomSlotArray.Add(bottomSlot);
		}
	}
}
//--------------------------------------------------
private function createCenterSlots() : void
{
	if (0 == mCenterSlotArray.Count)
	{
		for (var i:int = 0; i<SLOT_NUM; ++i)
		{
			var center : iGUIElement[] = getCenterCtrls(i);
			var centerSlot : PartyExpBuffSlot = new PartyExpBuffSlot(center[0], center[1]);
			centerSlot.setContent(0, 0, 0);
			centerSlot.setActive(false);
			mCenterSlotArray.Add(centerSlot);
		}
	}
}
//--------------------------------------------------
private function setBottomSlots(items : ArrayList) : void
{
	createBottomSlots();
	if (null == items)
		return;
	
	if (items.Count > SLOT_NUM)
		throw "iGUICode_PartyFunctionUI -> setBottomSlots(ArrayList) -> items count ["+items.Count+"] is wrong.";
	
	for (var i:int = 0; i<items.Count; ++i)
	{
		(mBottomSlotArray[i] as PartyPropAwardSlot).setContent(items[i]);
	}
}
//--------------------------------------------------
private function updateBottomSlots(items : ArrayList) : void
{
	createBottomSlots();
	if (null == items)
		return;
	
	if (items.Count > SLOT_NUM)
		throw "iGUICode_PartyFunctionUI -> updateBottomSlots(ArrayList) -> items count ["+items.Count+"] is wrong.";
	
	// step1:先清空
	for (var bottomSlot : PartyPropAwardSlot in mBottomSlotArray)
	{
		bottomSlot.setContent(null);
	}
	// step2:设置内容
	for (var i:int = 0; i<items.Count; ++i)
	{
		(mBottomSlotArray[i] as PartyPropAwardSlot).update(items[i]);
	}
}
//--------------------------------------------------
private function updatePartyScore(notify : notify_party_score) : void
{
	if (null == notify)
		return;
	
	setPartyScore(notify.score);
	if ("" == mPraiseBtnTip)
	{
		mPraiseBtnTip = top_praise_btn.label.tooltip;
	}
	top_praise_btn.label.tooltip = mPraiseBtnTip.Replace("{0}", notify.remain_times.ToString());
	top_praise_btn.passive = 1 == notify.has_vote;
}
//--------------------------------------------------
public function setPartyScore(total_score : int) : void
{
	top_total_score.label.text = total_score.ToString();
}
//--------------------------------------------------
private function updatePartyExpBuffs(notify : notify_party_exp_buffs) : void
{
	createCenterSlots();
	if (null == notify)
		return;
	
	if (notify.buff_exps.Count > SLOT_NUM)
		throw "iGUICode_PartyFunctionUI -> updatePartyExpBuffs(notify_party_exp_buffs) -> count ["+notify.buff_exps.Count+"] is wrong.";
	
	for (var i:int = 0; i<notify.buff_exps.Count; ++i)
	{
		var expBuff : pair_int = notify.buff_exps[i];
		(mCenterSlotArray[i] as PartyExpBuffSlot).setContent(expBuff.key, expBuff.value, notify.total_add_percent);
	}
	
	for (var j:int = 0; j<notify.lights.Count; ++j)
	{
		for (var slot : PartyExpBuffSlot in mCenterSlotArray)
		{
			if (slot.isBelong(notify.lights[j]))
				slot.setActive(true);
		}
	}
}
//--------------------------------------------------
public function setEnableBtnState(enable : boolean) : void
{
	var btn : iGUIButton = enable_btn;
	btn.userData = enable;
	
	var normal : String = enable ? "open_right" : "close_left";
	var hover : String = enable ? "open_right_hover" : "close_left_hover";
	var active : String = enable ? "open_right" : "close_left";
	
	var dir : String = "Common1/";
	UI.SetButtonState(btn, dir+normal, dir+hover, dir+active);
	
	frame.setEnabled(enable);
}
//--------------------------------------------------
private function getBottomCtrls(index : int) : iGUIElement[]
{
	if (0 == index) return [bottom_image1, bottom_num1];
	if (1 == index) return [bottom_image2, bottom_num2];
	if (2 == index) return [bottom_image3, bottom_num3];
	if (3 == index) return [bottom_image4, bottom_num4];
	// 4 == idnex
	return [bottom_image5, bottom_num5];
}
//--------------------------------------------------
private function getCenterCtrls(index : int) : iGUIElement[]
{
	if (0 == index) return [center_icon1, center_cover1];
	if (1 == index) return [center_icon2, center_cover2];
	if (2 == index) return [center_icon3, center_cover3];
	if (3 == index) return [center_icon4, center_cover4];
	// 4 == idnex
	return [center_icon5, center_cover5];
}
//--------------------------------------------------


