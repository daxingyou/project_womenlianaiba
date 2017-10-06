#pragma strict
#pragma downcast

import iGUI;

private static var instance : iGUICode_DragonBoatFestivalUI;
function Awake(){
	instance=this;
	
	RegistEventMsg();
}
static function getInstance(){
	return instance;
}

@HideInInspector
var s_cover8 : iGUILabel;
@HideInInspector
var s_num8 : iGUILabel;
@HideInInspector
var s_icon8 : iGUILabel;
@HideInInspector
var s_panel8 : iGUIPanel;
@HideInInspector
var s_cover7 : iGUILabel;
@HideInInspector
var s_num7 : iGUILabel;
@HideInInspector
var s_icon7 : iGUILabel;
@HideInInspector
var s_panel7 : iGUIPanel;
@HideInInspector
var s_cover6 : iGUILabel;
@HideInInspector
var s_num6 : iGUILabel;
@HideInInspector
var s_icon6 : iGUILabel;
@HideInInspector
var s_panel6 : iGUIPanel;
@HideInInspector
var s_cover5 : iGUILabel;
@HideInInspector
var s_num5 : iGUILabel;
@HideInInspector
var s_icon5 : iGUILabel;
@HideInInspector
var s_panel5 : iGUIPanel;
@HideInInspector
var s_cover4 : iGUILabel;
@HideInInspector
var s_num4 : iGUILabel;
@HideInInspector
var s_icon4 : iGUILabel;
@HideInInspector
var s_panel4 : iGUIPanel;
@HideInInspector
var s_cover3 : iGUILabel;
@HideInInspector
var s_num3 : iGUILabel;
@HideInInspector
var s_icon3 : iGUILabel;
@HideInInspector
var s_panel3 : iGUIPanel;
@HideInInspector
var s_cover2 : iGUILabel;
@HideInInspector
var s_num2 : iGUILabel;
@HideInInspector
var s_icon2 : iGUILabel;
@HideInInspector
var s_panel2 : iGUIPanel;
@HideInInspector
var s_cover1 : iGUILabel;
@HideInInspector
var s_num1 : iGUILabel;
@HideInInspector
var s_icon1 : iGUILabel;
@HideInInspector
var s_panel1 : iGUIPanel;
@HideInInspector
var s_reward_num : iGUILabel;
@HideInInspector
var s_reward_icon : iGUILabel;
@HideInInspector
var s_reward_panel : iGUIPanel;
@HideInInspector
var s_reward_btn : iGUIButton;
@HideInInspector
var s_close_btn : iGUIButton;
@HideInInspector
var s_frame : iGUIPanel;

@HideInInspector
var tip_label4 : iGUILabel;
@HideInInspector
var tip_label3 : iGUILabel;
@HideInInspector
var tip_label2 : iGUILabel;
@HideInInspector
var tip_label1 : iGUILabel;
@HideInInspector
var reward_num : iGUILabel;
@HideInInspector
var reward_icon : iGUILabel;
@HideInInspector
var reward_panel : iGUIPanel;
@HideInInspector
var reward_btn : iGUIButton;
@HideInInspector
var cover20 : iGUILabel;
@HideInInspector
var num20 : iGUILabel;
@HideInInspector
var icon20 : iGUILabel;
@HideInInspector
var panel20 : iGUIPanel;
@HideInInspector
var cover19 : iGUILabel;
@HideInInspector
var num19 : iGUILabel;
@HideInInspector
var icon19 : iGUILabel;
@HideInInspector
var panel19 : iGUIPanel;
@HideInInspector
var cover18 : iGUILabel;
@HideInInspector
var num18 : iGUILabel;
@HideInInspector
var icon18 : iGUILabel;
@HideInInspector
var panel18 : iGUIPanel;
@HideInInspector
var cover17 : iGUILabel;
@HideInInspector
var num17 : iGUILabel;
@HideInInspector
var icon17 : iGUILabel;
@HideInInspector
var panel17 : iGUIPanel;
@HideInInspector
var cover16 : iGUILabel;
@HideInInspector
var num16 : iGUILabel;
@HideInInspector
var icon16 : iGUILabel;
@HideInInspector
var panel16 : iGUIPanel;
@HideInInspector
var cover15 : iGUILabel;
@HideInInspector
var num15 : iGUILabel;
@HideInInspector
var icon15 : iGUILabel;
@HideInInspector
var panel15 : iGUIPanel;
@HideInInspector
var cover14 : iGUILabel;
@HideInInspector
var num14 : iGUILabel;
@HideInInspector
var icon14 : iGUILabel;
@HideInInspector
var panel14 : iGUIPanel;
@HideInInspector
var cover13 : iGUILabel;
@HideInInspector
var num13 : iGUILabel;
@HideInInspector
var icon13 : iGUILabel;
@HideInInspector
var panel13 : iGUIPanel;
@HideInInspector
var cover12 : iGUILabel;
@HideInInspector
var num12 : iGUILabel;
@HideInInspector
var icon12 : iGUILabel;
@HideInInspector
var panel12 : iGUIPanel;
@HideInInspector
var cover11 : iGUILabel;
@HideInInspector
var num11 : iGUILabel;
@HideInInspector
var icon11 : iGUILabel;
@HideInInspector
var panel11 : iGUIPanel;
@HideInInspector
var cover10 : iGUILabel;
@HideInInspector
var num10 : iGUILabel;
@HideInInspector
var icon10 : iGUILabel;
@HideInInspector
var panel10 : iGUIPanel;
@HideInInspector
var cover9 : iGUILabel;
@HideInInspector
var num9 : iGUILabel;
@HideInInspector
var icon9 : iGUILabel;
@HideInInspector
var panel9 : iGUIPanel;
@HideInInspector
var cover8 : iGUILabel;
@HideInInspector
var num8 : iGUILabel;
@HideInInspector
var icon8 : iGUILabel;
@HideInInspector
var panel8 : iGUIPanel;
@HideInInspector
var cover7 : iGUILabel;
@HideInInspector
var num7 : iGUILabel;
@HideInInspector
var icon7 : iGUILabel;
@HideInInspector
var panel7 : iGUIPanel;
@HideInInspector
var cover6 : iGUILabel;
@HideInInspector
var num6 : iGUILabel;
@HideInInspector
var icon6 : iGUILabel;
@HideInInspector
var panel6 : iGUIPanel;
@HideInInspector
var cover5 : iGUILabel;
@HideInInspector
var num5 : iGUILabel;
@HideInInspector
var icon5 : iGUILabel;
@HideInInspector
var panel5 : iGUIPanel;
@HideInInspector
var cover4 : iGUILabel;
@HideInInspector
var num4 : iGUILabel;
@HideInInspector
var icon4 : iGUILabel;
@HideInInspector
var panel4 : iGUIPanel;
@HideInInspector
var cover3 : iGUILabel;
@HideInInspector
var num3 : iGUILabel;
@HideInInspector
var icon3 : iGUILabel;
@HideInInspector
var panel3 : iGUIPanel;
@HideInInspector
var cover2 : iGUILabel;
@HideInInspector
var num2 : iGUILabel;
@HideInInspector
var icon2 : iGUILabel;
@HideInInspector
var panel2 : iGUIPanel;
@HideInInspector
var cover1 : iGUILabel;
@HideInInspector
var num1 : iGUILabel;
@HideInInspector
var icon1 : iGUILabel;
@HideInInspector
var panel1 : iGUIPanel;
@HideInInspector
var frame : iGUIPanel;
@HideInInspector
var root : iGUIRoot;




private var mSelectIndex : int = 0;
private var mLoopCount : int = 0;
private var mBeginTime : float = 0.0f;
private var mSlotArray : Array = new Array();
private var mRewardtSlot : DragonBoatFestivalSlot = null;
private var mRewardBtn : iGUIButton;
private var mNormal : boolean;
private var mAsynIcon : AsynIcon = null;
public var EclipsTime : float = 0.05f;
//--------------------------------------------------
function Start()
{	
	s_reward_btn.clickCallback = System.Delegate.Combine(s_reward_btn.clickCallback, ClickCallback_reward_btn as iGUIEventCallback);
	reward_btn.clickCallback = ClickCallback_reward_btn;
	s_close_btn.clickCallback = ClickCallbackCloseSmall;
	//init();
}
//--------------------------------------------------
function Update()
{
	rotate();
}
//--------------------------------------------------
// 初始化
private function Init(normal : boolean) : void
{
	if(normal) {
		mAsynIcon = new AsynIcon(setIcon, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
		mAsynIcon.load("UI/DBF.png.u3d");
	}
	//
	var item_list : List.<lottery_item> = DragonBoatFestival.getInstance().getItems();
	if (20 != item_list.Count && 8 != item_list.Count)
		throw "iGUICode_DragonBoatFestivalUI -> init() -> list count [" + item_list.Count + "] is wrong!";
	
	for (var i:int = 0; i<item_list.Count; ++i)
	{
		var slot : DragonBoatFestivalSlot = null;
		if(normal) {
			var res = getPanel(i);
			slot = new DragonBoatFestivalSlot(res[1], res[2], res[3]);
		} else {
			var res1 = getPanelSmall(i);
			slot = new DragonBoatFestivalSlot(res1[1], res1[2], res1[3]);
		} 
		var row : lottery_item = item_list[i];
		slot.setContent(row.item_id, row.item_count);
		mSlotArray.Add(slot);
	}
	//
	if(normal) {
		mRewardtSlot = new DragonBoatFestivalSlot(reward_icon, reward_num, null);
		mRewardBtn = reward_btn;
	} else {
		mRewardtSlot = new DragonBoatFestivalSlot(s_reward_icon, s_reward_num, null);
		mRewardBtn = s_reward_btn;
	}
	
	mNormal = normal;
	
	setRewardBtnState(true);
}
//--------------------------------------------------

private function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_DRAGON_NORMAL_UI), HandleNotifyEnableNormal);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_DRAGON_SMALL_UI), HandleNotifyEnableSmall);
}

private function HandleNotifyEnableNormal(evt:GameEvent, obj:System.Object) {
	EnableNormal(obj);
}

private function HandleNotifyEnableSmall(evt:GameEvent, obj:System.Object) {
	EnableSmall(obj);
}

private function EnableNormal(enable : boolean) {
	if(enable) {
		Init(true);
	}
	frame.setEnabled(enable);
	UI.getUI().SetModal("DragonBoatFestivalUI", enable);
}

private function EnableSmall(enable : boolean) {
	if(s_frame.enabled == enable) return ;
	
	if(enable) {
		Init(false);
		
		ClickSmallRewardAuto();
	}
	s_frame.setEnabled(enable);
	UI.getUI().SetModal("DragonBoatFestivalUI", enable);
}
// 清除
private function clear() : void
{
	if(mAsynIcon) {
		mAsynIcon.cancel();
	}
	//
	for (var slot : DragonBoatFestivalSlot in mSlotArray)
	{
		slot.setContent(0, 0);
	}
	mSlotArray.Clear();
	mRewardtSlot.setContent(0, 0);
}
//--------------------------------------------------
// 点击领取奖励按钮
function ClickCallback_reward_btn(caller : iGUIElement)
{
	if (true == caller.userData)	// 开始旋转
	{
		if(!mNormal && DragonBoatFestival.getInstance().UseDragonBoat() == false) {
			clear();
			UI.getUI().SetModal("DragonBoatFestivalUI", false);
			UI.getUI().CloseUIRoot("DragonBoatFestivalUI");
			Global.GetSysMsgHandler().ShowSysMsg(519);
			return ;
		}
		
		caller.passive = true;
		s_close_btn.passive = true;
		mBeginTime = Time.time;
		mLoopCount = 0;
		
	}
	else	// 关闭界面
	{
		clear();
		UI.getUI().SetModal("DragonBoatFestivalUI", false);
		UI.getUI().CloseUIRoot("DragonBoatFestivalUI");
		
		if(!mNormal) {
			Global.GetSysMsgHandler().ShowSysMsg(517);
		}
	}
}
//--------------------------------------------------
function ClickCallbackCloseSmall(caller : iGUIElement) {
	clear();
	UI.getUI().SetModal("DragonBoatFestivalUI", false);
	UI.getUI().CloseUIRoot("DragonBoatFestivalUI");
}
//---
//----
function ClickSmallRewardAuto() {
	s_reward_btn.passive = true;
	s_close_btn.passive = true;
	mBeginTime = Time.time;
	mLoopCount = 0;
}
// 设置窗口背景
private function setIcon(tex : Texture) : void
{
	frame.style.normal.background = tex;
}
//--------------------------------------------------
// 设置选中,index:[1, 20]
private function setSelect(index : int) : void
{
	for (var i:int = 0; i<mSlotArray.Count; ++i)
	{
		var slot : DragonBoatFestivalSlot = mSlotArray[i];
		if (index == i)
		{
			slot.setSelect(true);
			if (0.0f == mBeginTime)		// 停止旋转,设置所获奖励
			{
				mRewardtSlot.setContent(slot.ItemID, slot.ItemNum);
			}
		}
		else
		{
			slot.setSelect(false);
		}
	}
}
//--------------------------------------------------
// 获取控件
private function getPanel(index : int) : iGUIElement[]
{
	if (0 == index) return [panel1, icon1, num1, cover1];
	if (1 == index) return [panel2, icon2, num2, cover2];
	if (2 == index) return [panel3, icon3, num3, cover3];
	if (3 == index) return [panel4, icon4, num4, cover4];
	if (4 == index) return [panel5, icon5, num5, cover5];
	if (5 == index) return [panel6, icon6, num6, cover6];
	if (6 == index) return [panel7, icon7, num7, cover7];
	if (7 == index) return [panel8, icon8, num8, cover8];
	if (8 == index) return [panel9, icon9, num9, cover9];
	if (9 == index) return [panel10, icon10, num10, cover10];
	if (10 == index) return [panel11, icon11, num11, cover11];
	if (11 == index) return [panel12, icon12, num12, cover12];
	if (12 == index) return [panel13, icon13, num13, cover13];
	if (13 == index) return [panel14, icon14, num14, cover14];
	if (14 == index) return [panel15, icon15, num15, cover15];
	if (15 == index) return [panel16, icon16, num16, cover16];
	if (16 == index) return [panel17, icon17, num17, cover17];
	if (17 == index) return [panel18, icon18, num18, cover18];
	if (18 == index) return [panel19, icon19, num19, cover19];
	if (19 == index) return [panel20, icon20, num20, cover20];
	
	throw Exception("iGUICode_DragonBoatFestivalUI -> getPanle(int) -> index [" + index + "] is wrong!");
}
//--------------------------------------------------
private function getPanelSmall(index : int)
{
	var idx : int = index;
	
	if (0 == idx) return [s_panel1, s_icon1, s_num1, s_cover1];
	if (1 == idx) return [s_panel2, s_icon2, s_num2, s_cover2];
	if (2 == idx) return [s_panel3, s_icon3, s_num3, s_cover3];
	if (3 == idx) return [s_panel4, s_icon4, s_num4, s_cover4];
	if (4 == idx) return [s_panel5, s_icon5, s_num5, s_cover5];
	if (5 == idx) return [s_panel6, s_icon6, s_num6, s_cover6];
	if (6 == idx) return [s_panel7, s_icon7, s_num7, s_cover7];
	if (7 == idx) return [s_panel8, s_icon8, s_num8, s_cover8];
	
	throw Exception("iGUICode_DragonBoatFestivalUI -> getPanle(int) -> idx [" + idx + "] is wrong!");
}
//--------------------------------------------------
// 旋转
private function rotate() : void
{
	if ((0.0f == mBeginTime) || (Time.time - mBeginTime < EclipsTime))
		return;
	
	// step1
	mBeginTime = Time.time;
	if (mSelectIndex > mSlotArray.Count - 1)	// 循环一次
	{
		++mLoopCount;
		mSelectIndex = 0;
	}
	// step2
	if (mLoopCount >= 3)	// 保证每个至少转过3圈
	{
		if (DragonBoatFestival.getInstance().getHitIndex() == mSelectIndex)
		{
			mBeginTime = 0.0f;
			setRewardBtnState(false);
		}
	}
	// step3
	setSelect(mSelectIndex);
	++mSelectIndex;
}
//--------------------------------------------------
// 设置获取奖励按钮状态
private function setRewardBtnState(start : boolean) : void
{
	var btn : iGUIButton = mRewardBtn;
	btn.passive = false;
	s_close_btn.passive = false;
	
	if(mNormal) {
		btn.userData = start;
		//
		var normal : String = start ? "Start" : "Enter";
		var hover : String = start ? "Start_hover" : "Enter_hover";
		var active : String = start ? "Start" : "Enter";
		//
		btn.style.normal.background = Resources.Load("UISkins/Textures/baoxiang/" + normal);
		btn.style.hover.background = Resources.Load("UISkins/Textures/baoxiang/" + hover);
		btn.style.active.background = Resources.Load("UISkins/Textures/baoxiang/" + active);
	} else {
		var bValid : boolean = DragonBoatFestival.getInstance().IsAutoDragonSmall();
		btn.userData = bValid;
	}
}
//--------------------------------------------------


