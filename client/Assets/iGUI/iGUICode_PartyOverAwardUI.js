import iGUI;

private static var instance : iGUICode_PartyOverAwardUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var ok_btn : iGUIButton;
@HideInInspector
var over_award : iGUILabel;
@HideInInspector
var award_icon5 : iGUILabel;
@HideInInspector
var score_label5 : iGUILabel;
@HideInInspector
var award_icon4 : iGUILabel;
@HideInInspector
var score_label4 : iGUILabel;
@HideInInspector
var award_icon3 : iGUILabel;
@HideInInspector
var score_label3 : iGUILabel;
@HideInInspector
var award_icon2 : iGUILabel;
@HideInInspector
var score_label2 : iGUILabel;
@HideInInspector
var award_icon1 : iGUILabel;
@HideInInspector
var score_label1 : iGUILabel;
@HideInInspector
var score_bar : iGUILabel;
@HideInInspector
var score_bar_bg : iGUILabel;
@HideInInspector
var tip_label2 : iGUILabel;
@HideInInspector
var tip_label1 : iGUILabel;
@HideInInspector
var frame : iGUIPanel;
@HideInInspector
var root : iGUIRoot;




//private var SLOT_NUM : int = 5;
//private var mSlotArray : Array = new Array();
private var mAwardSlot : ItemIcon = null;
//--------------------------------------------------
function Start()
{
	// 界面事件注册
	ok_btn.clickCallback = ClickCallback_ok_btn;
//	award_icon1.mouseOverCallback = MouseOverCallback_icon;
//	award_icon2.mouseOverCallback = MouseOverCallback_icon;
//	award_icon3.mouseOverCallback = MouseOverCallback_icon;
//	award_icon4.mouseOverCallback = MouseOverCallback_icon;
//	award_icon5.mouseOverCallback = MouseOverCallback_icon;
	over_award.mouseOverCallback = MouseOverCallback_icon;
	//
	init();
}
//--------------------------------------------------
function OnDestroy()
{
	clear();
}
//--------------------------------------------------
function ClickCallback_ok_btn(caller : iGUIElement)
{
	UI.getUI().SetModal("PartyOverAwardUI", false);
	UI.getUI().CloseUIRoot("PartyOverAwardUI");
}
//--------------------------------------------------
function MouseOverCallback_icon(caller : iGUIElement)
{
//	var slot : ItemIcon = getSlot(caller);
//	if (slot)
//	{
		ItemHint.ShowPackItemHint(caller, mAwardSlot.getRow(), false);
//	}
}
//--------------------------------------------------
private function init() : void
{
//	for (var i:int = 0; i<SLOT_NUM; ++i)
//	{
//		var res1 : iGUILabel[] = getCtrls(i);
//		var slot : ItemIcon = new ItemIcon(res1[1]);
//		slot.setContent(null);
//		mSlotArray.Add(slot);
//	}
	//
	var gain : notify_party_gain = Party.Ctrl.Get("party_gain");
//	if (0 == gain.grade_scores.Count || gain.grade_scores.Count > SLOT_NUM)
//		throw "iGUICode_PartyOverAwardUI -> init() -> grade scores count ["+gain.grade_scores.Count+"] is wrong.";
	
	//
//	for (var j:int = 0; j<gain.grade_scores.Count; ++j)
//	{
//		var pair : pair_int = gain.grade_scores[j];
//		(mSlotArray[j] as ItemIcon).setContent(ResManager.LgtMgr.getItemRow(pair.value));
//		var res2 : iGUILabel[] = getCtrls(j);
//		res2[0].label.text = pair.key.ToString() + "分";
//	}
	//
	var row : ItemRow = ResManager.LgtMgr.getItemRow(gain.item_id);
	mAwardSlot = new ItemIcon(over_award);
	mAwardSlot.setContent(row);
	//
	tip_label2.label.text = tip_label2.label.text.Replace("{0}", gain.score.ToString());
	//
//	var max_score : pair_int = gain.grade_scores[gain.grade_scores.Count - 1];
//	score_bar.setWidth(score_bar_bg.rect.width * gain.score/max_score.key);
}
//--------------------------------------------------
private function clear() : void
{
//	for (var slot : ItemIcon in mSlotArray)
//	{
//		slot.setContent(null);
//	}
//	mSlotArray.Clear();
	mAwardSlot.setContent(null);
	mAwardSlot = null;
}
//--------------------------------------------------
//private function getCtrls(index : int) : iGUILabel[]
//{
//	if (0 == index) return [score_label1, award_icon1];
//	if (1 == index) return [score_label2, award_icon2];
//	if (2 == index) return [score_label3, award_icon3];
//	if (3 == index) return [score_label4, award_icon4];
//	// 4 == idnex
//	return [score_label5, award_icon5];
//}
//--------------------------------------------------
//private function getSlot(icon : iGUILabel) : ItemIcon
//{
//	if (icon == over_award)
//		return mAwardSlot;
//	
//	for (var slot : ItemIcon in mSlotArray)
//	{
//		if (slot.isBelong(icon))
//			return slot;
//	}
//	return null;
//}
//--------------------------------------------------


