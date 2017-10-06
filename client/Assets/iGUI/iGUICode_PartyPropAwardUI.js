import iGUI;

private static var instance : iGUICode_PartyPropAwardUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var prop_num5 : iGUILabel;
@HideInInspector
var prop_icon5 : iGUILabel;
@HideInInspector
var prop_num4 : iGUILabel;
@HideInInspector
var prop_icon4 : iGUILabel;
@HideInInspector
var prop_num3 : iGUILabel;
@HideInInspector
var prop_icon3 : iGUILabel;
@HideInInspector
var prop_num2 : iGUILabel;
@HideInInspector
var prop_icon2 : iGUILabel;
@HideInInspector
var prop_num1 : iGUILabel;
@HideInInspector
var prop_icon1 : iGUILabel;
@HideInInspector
var prop_list : iGUIPanel;
@HideInInspector
var tip_label2 : iGUILabel;
@HideInInspector
var tip_label1 : iGUILabel;
@HideInInspector
var close_btn : iGUIButton;
@HideInInspector
var frame : iGUIPanel;
@HideInInspector
var root : iGUIRoot;



private var SLOT_NUM : int = 5;
private var mSlotArray : Array = new Array();
//--------------------------------------------------
function Start()
{
	// 界面事件注册
	close_btn.clickCallback = ClickCallback_close_btn;
	//
	init();
}
//--------------------------------------------------
function OnDestroy()
{
	clear();
}
//--------------------------------------------------
function ClickCallback_close_btn(caller : iGUIElement)
{
	UI.getUI().SetModal("PartyPropAwardUI", false);
	UI.getUI().CloseUIRoot("PartyPropAwardUI");
}
//--------------------------------------------------
private function init() : void
{
	for (var i:int = 0; i<SLOT_NUM; ++i)
	{
		var res : iGUIElement[] = getPropCtrls(i);
		var slot : PartyPropAwardSlot = new PartyPropAwardSlot(res[0], null, res[1]);
		slot.setContent(null);
		mSlotArray.Add(slot);
	}
	//
	var items : ArrayList = Party.Ctrl.Get("prop_award_items");
	if (items.Count > SLOT_NUM)
		throw "iGUICode_PartyPropAwardUI -> init() -> items count ["+items.Count+"] is wrong.";
	
	for (var j:int = 0; j<items.Count; ++j)
	{
		(mSlotArray[j] as PartyPropAwardSlot).setContent(items[j]);
	}
}
//--------------------------------------------------
private function clear() : void
{
	for (var slot : PartyPropAwardSlot in mSlotArray)
	{
		slot.setContent(null);
	}
	mSlotArray.Clear();
}
//--------------------------------------------------
private function getPropCtrls(index : int) : iGUIElement[]
{
	if (0 == index) return [prop_icon1, prop_num1];
	if (1 == index) return [prop_icon2, prop_num2];
	if (2 == index) return [prop_icon3, prop_num3];
	if (3 == index) return [prop_icon4, prop_num4];
	// 4 == idnex
	return [prop_icon5, prop_num5];
}
//--------------------------------------------------


