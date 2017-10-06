#pragma strict

import iGUI;

private static var instance : iGUICode_OfferRewardTaskUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}


@HideInInspector
var CommTaskClose : iGUIButton;
@HideInInspector
var CommTaskComplete: iGUIButton;
@HideInInspector
var CommTaskItem3Count : iGUILabel;
@HideInInspector
var CommTaskItem3: iGUILabel;
@HideInInspector
var CommTaskItem2Count : iGUILabel;
@HideInInspector
var CommTaskItem2: iGUILabel;
@HideInInspector
var CommTaskItem1Count : iGUILabel;
@HideInInspector
var CommTaskItem1: iGUILabel;
@HideInInspector
var CommTaskExp : iGUILabel;
@HideInInspector
var CommTaskGold : iGUILabel;
@HideInInspector
var CommTaskTargetStep3 : iGUILabel;
@HideInInspector
var CommTaskTargetContent3 : iGUILabel;
@HideInInspector
var CommTaskTargetTile3 : iGUILabel;
@HideInInspector
var CommTaskTargetPanel3 : iGUIPanel;
@HideInInspector
var CommTaskTargetStep2 : iGUILabel;
@HideInInspector
var CommTaskTargetContent2 : iGUILabel;
@HideInInspector
var CommTaskTargetTile2 : iGUILabel;
@HideInInspector
var CommTaskTargetPanel2 : iGUIPanel;
@HideInInspector
var CommTaskTargetStep1 : iGUILabel;
@HideInInspector
var CommTaskTargetContent1 : iGUILabel;
@HideInInspector
var CommTaskTargetTile1 : iGUILabel;
@HideInInspector
var CommTaskTargetPanel1 : iGUIPanel;
@HideInInspector
var CommTaskMainContent : iGUILabel;
@HideInInspector
var CommTaskTitle : iGUILabel;
@HideInInspector
var CommTaskPanel : iGUIPanel;
@HideInInspector
var root : iGUIRoot;

//--------------------------------------------------
function Start()
{
	CommTaskClose.clickCallback = Click_CommTaskClose;
	CommTaskComplete.clickCallback = Click_CommTaskComplete;
	CommTaskItem1.mouseOverCallback = MouseOver_CommTaskItem;
	CommTaskItem2.mouseOverCallback = MouseOver_CommTaskItem;
	CommTaskItem3.mouseOverCallback = MouseOver_CommTaskItem;
}
//--------------------------------------------------
function OnDestroy()
{
	clearItemIcon();
	mItemIconArray.clear();
}
//--------------------------------------------------
// 点击关闭按钮
function Click_CommTaskClose(caller : iGUIElement)
{
	OfferRewardTaskLogic.getInstance().closeOfferRewardTaskUI();
}
//--------------------------------------------------
// 点击完成任务按钮
function Click_CommTaskComplete(caller : iGUIElement)
{
	if (true == caller.userData)
	{
		OfferRewardTaskLogic.request_complete_post_reward();
	}
}
//--------------------------------------------------
// 鼠标移到奖励物品上面
function MouseOver_CommTaskItem(caller : iGUIElement)
{
	for (var obj : Object in mItemIconArray)
	{
		var icon : ItemIcon = obj as ItemIcon;
		if (icon.isBelong(caller as iGUILabel))
		{
			ItemHint.ShowPackItemHint(caller, icon.getRow(), true);
			return;
		}
	}
}
//--------------------------------------------------



/***************************************************
*** 界面逻辑
***************************************************/
private var mItemIconArray : Array = new Array();



//--------------------------------------------------
// 初始
public function init() : void
{
	mItemIconArray.Add(new ItemIcon(CommTaskItem1));
	mItemIconArray.Add(new ItemIcon(CommTaskItem2));
	mItemIconArray.Add(new ItemIcon(CommTaskItem3));
	clearItemIcon();
	for (var i:int=0; i<3; ++i)
	{
		var target : iGUIElement[] = getTaskTarget(i);
		target[0].setEnabled(false);
		target[1].setEnabled(false);
		target[2].setEnabled(false);
		var count : iGUILabel = getTaskItemCount(i);
		count.label.text = "";
	}
}
//--------------------------------------------------
// 清除
private function clearItemIcon() : void
{
	for (var obj : Object in mItemIconArray)
	{
		var icon : ItemIcon = obj as ItemIcon;
		icon.setContent(null);
	}
}
//--------------------------------------------------
// 设置任务主要内容
public function setTaskMainContent(content : String) : void
{
	CommTaskMainContent.label.text = content;
}
//--------------------------------------------------
// 设置目标任务
public function setTaskTarget(index : int, content : String, cur : int, need : int) : void
{
	if (index < 0 || index > 2)
		return;
	
	var target = getTaskTarget(index);
	target[0].setEnabled(true);
	target[1].setEnabled(true);
	target[2].setEnabled(true);
	target[1].label.text = content;
	target[2].label.text = cur.ToString() + "/" + need.ToString();
}
//--------------------------------------------------
// 获取目标任务控件
private function getTaskTarget(index : int) : iGUIElement[]
{
	if (0 == index)	return [CommTaskTargetTile1, CommTaskTargetContent1, CommTaskTargetStep1];
	if (1 == index)	return [CommTaskTargetTile2, CommTaskTargetContent2, CommTaskTargetStep2];
	// 2 == index
	return [CommTaskTargetTile3, CommTaskTargetContent3, CommTaskTargetStep3];
}
//--------------------------------------------------
// 设置奖励水晶和奖励经验
public function setReawrdGoldExp(gold : int, exp : int) : void
{
	CommTaskGold.label.text = "X" + gold.ToString();
	CommTaskExp.label.text = "X" + exp.ToString();
}
//--------------------------------------------------
// 设置奖励物品
public function setTaskItem(index : int, row : ItemRow, count : int) : void
{
	if (index < 0 || index > 2)
		return;
	
	(mItemIconArray[index] as ItemIcon).setContent(row);
	var count_label : iGUILabel = getTaskItemCount(index);
	count_label.label.text = count.ToString();
}
//--------------------------------------------------
// 获取数量控件
private function getTaskItemCount(index : int) : iGUILabel
{
	if (0 == index) return CommTaskItem1Count;
	if (1 == index) return CommTaskItem2Count;
	// 2 == index
	return CommTaskItem3Count;
}
//--------------------------------------------------
// 设置完成任务按钮
public function setCompleteTaskBtn(can_complete : boolean) : void
{
	CommTaskComplete.userData = can_complete;
	
	var normal : String = can_complete ? "wancheng_n" : "wancheng_g";
	var hover : String = can_complete ? "wancheng_h" : "wancheng_g";
	var active : String = can_complete ? "wancheng_n" : "wancheng_g";
	
	CommTaskComplete.style.normal.background = Resources.Load("UISkins/Textures/task/" + normal) as Texture2D;
	CommTaskComplete.style.hover.background = Resources.Load("UISkins/Textures/task/" + hover) as Texture2D;
	CommTaskComplete.style.active.background = Resources.Load("UISkins/Textures/task/" + active) as Texture2D;
}
//--------------------------------------------------


