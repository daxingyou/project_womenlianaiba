#pragma strict
#pragma downcast
import iGUI;

private static var instance : iGUICode_RankListUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var tips : iGUILabel;
@HideInInspector
var self_rank_num : iGUILabel;
@HideInInspector
var self_rank_label : iGUILabel;
@HideInInspector
var page_label : iGUILabel;
@HideInInspector
var right_page_btn : iGUIButton;
@HideInInspector
var left_page_btn : iGUIButton;
@HideInInspector
var first_page_btn : iGUIButton;
@HideInInspector
var rank_visit_btn8 : iGUIButton;
@HideInInspector
var rank_describe8 : iGUILabel;
@HideInInspector
var rank_name8 : iGUILabel;
@HideInInspector
var rank_image8 : iGUILabel;
@HideInInspector
var rank_num8 : iGUILabel;
@HideInInspector
var rank_panel8 : iGUIPanel;
@HideInInspector
var rank_visit_btn7 : iGUIButton;
@HideInInspector
var rank_describe7 : iGUILabel;
@HideInInspector
var rank_name7 : iGUILabel;
@HideInInspector
var rank_image7 : iGUILabel;
@HideInInspector
var rank_num7 : iGUILabel;
@HideInInspector
var rank_panel7 : iGUIPanel;
@HideInInspector
var rank_visit_btn6 : iGUIButton;
@HideInInspector
var rank_describe6 : iGUILabel;
@HideInInspector
var rank_name6 : iGUILabel;
@HideInInspector
var rank_image6 : iGUILabel;
@HideInInspector
var rank_num6 : iGUILabel;
@HideInInspector
var rank_panel6 : iGUIPanel;
@HideInInspector
var rank_visit_btn5 : iGUIButton;
@HideInInspector
var rank_describe5 : iGUILabel;
@HideInInspector
var rank_name5 : iGUILabel;
@HideInInspector
var rank_image5 : iGUILabel;
@HideInInspector
var rank_num5 : iGUILabel;
@HideInInspector
var rank_panel5 : iGUIPanel;
@HideInInspector
var rank_visit_btn4 : iGUIButton;
@HideInInspector
var rank_describe4 : iGUILabel;
@HideInInspector
var rank_name4 : iGUILabel;
@HideInInspector
var rank_image4 : iGUILabel;
@HideInInspector
var rank_num4 : iGUILabel;
@HideInInspector
var rank_panel4 : iGUIPanel;
@HideInInspector
var rank_visit_btn3 : iGUIButton;
@HideInInspector
var rank_describe3 : iGUILabel;
@HideInInspector
var rank_name3 : iGUILabel;
@HideInInspector
var rank_image3 : iGUILabel;
@HideInInspector
var rank_num3 : iGUILabel;
@HideInInspector
var rank_panel3 : iGUIPanel;
@HideInInspector
var rank_visit_btn2 : iGUIButton;
@HideInInspector
var rank_describe2 : iGUILabel;
@HideInInspector
var rank_name2 : iGUILabel;
@HideInInspector
var rank_image2 : iGUILabel;
@HideInInspector
var rank_num2 : iGUILabel;
@HideInInspector
var rank_panel2 : iGUIPanel;
@HideInInspector
var rank_visit_btn1 : iGUIButton;
@HideInInspector
var rank_describe1 : iGUILabel;
@HideInInspector
var rank_name1 : iGUILabel;
@HideInInspector
var rank_image1 : iGUILabel;
@HideInInspector
var rank_num1 : iGUILabel;
@HideInInspector
var rank_panel1 : iGUIPanel;
@HideInInspector
var rank_tip_label3 : iGUILabel;
@HideInInspector
var rank_tip_label2 : iGUILabel;
@HideInInspector
var rank_tip_label1 : iGUILabel;
@HideInInspector
var rank_list : iGUIPanel;
@HideInInspector
var tab_btn9 : iGUIButton;
@HideInInspector
var tab_btn8 : iGUIButton;
@HideInInspector
var tab_btn7 : iGUIButton;
@HideInInspector
var tab_btn6 : iGUIButton;
@HideInInspector
var tab_btn5 : iGUIButton;
@HideInInspector
var tab_btn4 : iGUIButton;
@HideInInspector
var tab_btn3 : iGUIButton;
@HideInInspector
var tab_btn2 : iGUIButton;
@HideInInspector
var tab_btn1 : iGUIButton;
@HideInInspector
var tab_list : iGUIPanel;
@HideInInspector
var close_btn : iGUIButton;
@HideInInspector
var title_label : iGUILabel;
@HideInInspector
var frame : iGUIPanel;
@HideInInspector
var root : iGUIRoot;



//--------------------------------------------------
function Start()
{
	// 界面事件注册
	close_btn.clickCallback = System.Delegate.Combine(close_btn.clickCallback, ClickCallback_close_btn as iGUIEventCallback);
	first_page_btn.clickCallback = System.Delegate.Combine(first_page_btn.clickCallback, ClickCallback_first_page_btn as iGUIEventCallback);
	left_page_btn.clickCallback = System.Delegate.Combine(left_page_btn.clickCallback, ClickCallback_left_page_btn as iGUIEventCallback);
	right_page_btn.clickCallback = System.Delegate.Combine(right_page_btn.clickCallback, ClickCallback_right_page_btn as iGUIEventCallback);
	tab_btn1.clickCallback = System.Delegate.Combine(tab_btn1.clickCallback, ClickCallback_tab_btn1 as iGUIEventCallback);
	tab_btn2.clickCallback = System.Delegate.Combine(tab_btn2.clickCallback, ClickCallback_tab_btn2 as iGUIEventCallback);
	tab_btn3.clickCallback = System.Delegate.Combine(tab_btn3.clickCallback, ClickCallback_tab_btn3 as iGUIEventCallback);
	tab_btn4.clickCallback = System.Delegate.Combine(tab_btn4.clickCallback, ClickCallback_tab_btn4 as iGUIEventCallback);
	tab_btn5.clickCallback = System.Delegate.Combine(tab_btn5.clickCallback, ClickCallback_tab_btn5 as iGUIEventCallback);
	tab_btn6.clickCallback = System.Delegate.Combine(tab_btn6.clickCallback, ClickCallback_tab_btn6 as iGUIEventCallback);
	tab_btn7.clickCallback = System.Delegate.Combine(tab_btn7.clickCallback, ClickCallback_tab_btn7 as iGUIEventCallback);
	tab_btn8.clickCallback = System.Delegate.Combine(tab_btn8.clickCallback, ClickCallback_tab_btn8 as iGUIEventCallback);
	tab_btn9.clickCallback = System.Delegate.Combine(tab_btn9.clickCallback, ClickCallback_tab_btn9 as iGUIEventCallback);
	// 初始
	init();
}
//--------------------------------------------------
function OnDestroy()
{
	// 清除
	clear();
}
//--------------------------------------------------
// 点击关闭按钮
function ClickCallback_close_btn(caller : iGUIElement)
{
	RankListLogic.getInstance().closeRankListUI();
}
//--------------------------------------------------
// 点击首页按钮
function ClickCallback_first_page_btn(caller : iGUIElement)
{
	if (mCurTabPage.firstPage())
	{
		refreshSlots();
	}
}
//--------------------------------------------------
// 点击左翻页按钮
function ClickCallback_left_page_btn(caller : iGUIElement)
{
	if (mCurTabPage.prePage())
	{
		refreshSlots();
	}
}
//--------------------------------------------------
// 点击右翻页按钮
function ClickCallback_right_page_btn(caller : iGUIElement)
{
	if (mCurTabPage.nextPage())
	{
		refreshSlots();
	}
}
//--------------------------------------------------
// 点击标签按钮1
function ClickCallback_tab_btn1(caller : iGUIElement)
{
	if (true == caller.userData)
		return;
	
	changeToLevelTab();
}
//--------------------------------------------------
// 点击标签按钮2
function ClickCallback_tab_btn2(caller : iGUIElement)
{
	if (true == caller.userData)
		return;
	
	changeToLuxuryTab();
}
//--------------------------------------------------
// 点击标签按钮3
function ClickCallback_tab_btn3(caller : iGUIElement)
{
	if (true == caller.userData)
		return;
	
	changeToMaleCharmTab();
}
//--------------------------------------------------
// 点击标签按钮4
function ClickCallback_tab_btn4(caller : iGUIElement)
{
	if (true == caller.userData)
		return;
	
	changeToFemaleCharmTab();
}
//--------------------------------------------------
// 点击标签按钮5
function ClickCallback_tab_btn5(caller : iGUIElement)
{
	if (true == caller.userData)
		return;
	
	changeToFollowedTab();
}
//--------------------------------------------------
// 点击标签按钮6
function ClickCallback_tab_btn6(caller : iGUIElement)
{
	if (true == caller.userData)
		return;
}
//--------------------------------------------------
// 点击标签按钮7
function ClickCallback_tab_btn7(caller : iGUIElement)
{
	if (true == caller.userData)
		return;
}
//--------------------------------------------------
// 点击标签按钮8
function ClickCallback_tab_btn8(caller : iGUIElement)
{
	if (true == caller.userData)
		return;
}
//--------------------------------------------------
// 点击标签按钮6
function ClickCallback_tab_btn9(caller : iGUIElement)
{
	if (true == caller.userData)
		return;
}




/***************************************************
*** 界面逻辑
***************************************************/
private var SLOT_NUM : int = 8;										// 每页物品数量
private var mSlotArray : Array = new Array();
private var mCurTabPage : RankListPage = new RankListPage();		// 当前标签页



//--------------------------------------------------
// 初始
private function init() : void
{
	self_rank_label.setEnabled(false);
	self_rank_num.setEnabled(false);
	RankListLogic.addObserver("event_rank_result", handleRankResult);
	createSlots();
	changeToLevelTab();
}
//--------------------------------------------------
// 清除
private function clear() : void
{
	RankListLogic.delObserver("event_rank_result", handleRankResult);
	clearSlots();
	mSlotArray.Clear();
	mCurTabPage = null;
}
//--------------------------------------------------
// 创建列表
private function createSlots() : void
{
	for (var i:int=0; i<SLOT_NUM; ++i)
	{
		var element : iGUIElement[] = getItemCtrl(i);
		mSlotArray.Add(new RankListSlot(element[0], element[1], element[2], element[3], element[4], element[5]));
	}
}
//--------------------------------------------------
// 清除列表
private function clearSlots() : void
{
	for (var slot : RankListSlot in mSlotArray)
	{
		slot.setVisible(false);
		slot.setContent(null, 0, 0);
	}
}
//--------------------------------------------------
// 刷新列表
private function refreshSlots() : void
{
	// 清除
	clearSlots();
	// 设置当前页的内容
	var arr : Array = mCurTabPage.getCurPage();
	for (var i:int=0; i<arr.Count; ++i)
	{
		var slot : RankListSlot = mSlotArray[i] as RankListSlot;
		slot.setVisible(true);
		slot.setContent(arr[i], (mCurTabPage.getCurPageNum() - 1) * SLOT_NUM + i + 1, mCurTabPage.getPageType());
	}
	// 设置页数
	page_label.label.text = mCurTabPage.getCurPageNum().ToString() + "/" + mCurTabPage.getTotalPageNum().ToString();
}
//--------------------------------------------------
// 获取物品控件
private function getItemCtrl(index : int) : iGUIElement[]
{
	if (0 == index) return [rank_panel1, rank_num1, rank_image1, rank_name1, rank_describe1, rank_visit_btn1];
	if (1 == index) return [rank_panel2, rank_num2, rank_image2, rank_name2, rank_describe2, rank_visit_btn2];
	if (2 == index) return [rank_panel3, rank_num3, rank_image3, rank_name3, rank_describe3, rank_visit_btn3];
	if (3 == index) return [rank_panel4, rank_num4, rank_image4, rank_name4, rank_describe4, rank_visit_btn4];
	if (4 == index) return [rank_panel5, rank_num5, rank_image5, rank_name5, rank_describe5, rank_visit_btn5];
	if (5 == index) return [rank_panel6, rank_num6, rank_image6, rank_name6, rank_describe6, rank_visit_btn6];
	if (6 == index) return [rank_panel7, rank_num7, rank_image7, rank_name7, rank_describe7, rank_visit_btn7];
	
	return [rank_panel8, rank_num8, rank_image8, rank_name8, rank_describe8, rank_visit_btn8];
}
//--------------------------------------------------
// 初始标签页
private function setTabPage(btn : iGUIButton, data_arr : ArrayList, type : int) : void
{
	setTabBtnState(btn);
	mCurTabPage.init(data_arr, SLOT_NUM, type);
	mCurTabPage.firstPage();
	refreshSlots();
}
//--------------------------------------------------
// 设置标签按钮状态
private function setTabBtnState(btn : iGUIButton) : void
{
	setTabBtnActive(tab_btn1, false);
	setTabBtnActive(tab_btn2, false);
	setTabBtnActive(tab_btn3, false);
	setTabBtnActive(tab_btn4, false);
	setTabBtnActive(tab_btn5, false);
	setTabBtnActive(tab_btn6, false);
	setTabBtnActive(tab_btn7, false);
	setTabBtnActive(tab_btn8, false);
	setTabBtnActive(tab_btn9, false);
	if (btn)
	{
		setTabBtnActive(btn, true);
	}
}
//--------------------------------------------------
// 设置标签按钮选中状态
private function setTabBtnActive(tab : iGUIButton, active : boolean) : void
{
	tab.userData = active;
	var state_image = getTabBtnStateImage(tab);
	var normal : String = "UISkins/Textures/RankList/" + state_image[0];
	var hover : String = "UISkins/Textures/RankList/" + state_image[1];
	var push : String = "UISkins/Textures/RankList/" + state_image[2];
	if (active)
	{
		tab.style.normal.background = Resources.Load(push);
		tab.style.hover.background = Resources.Load(push);
		tab.style.active.background = Resources.Load(push);
	}
	else
	{
		tab.style.normal.background = Resources.Load(normal);
		tab.style.hover.background = Resources.Load(hover);
		tab.style.active.background = Resources.Load(push);
	}
}
//--------------------------------------------------
// 获取标签按钮各种状态的图片
private function getTabBtnStateImage(tab : iGUIButton) : String[]
{
	if (tab_btn1 == tab) return ["Lv_n", "Lv_h", "Lv_p"];
	if (tab_btn2 == tab) return ["Lux_n", "Lux_h", "Lux_p"];
	if (tab_btn3 == tab) return ["gla_m_n", "gla_m_h", "gla_m_p"];
	if (tab_btn4 == tab) return ["gla_w_n", "gla_w_h", "gla_w_p"];
	if (tab_btn5 == tab) return ["renqi_n", "renqi_h", "renqi_p"];
	if (tab_btn6 == tab) return ["gla_w_n", "gla_w_h", "gla_w_p"];
	if (tab_btn7 == tab) return ["gla_w_n", "gla_w_h", "gla_w_p"];
	if (tab_btn8 == tab) return ["gla_w_n", "gla_w_h", "gla_w_p"];
	// tab_btn9 == tab
	return ["Lv_n", "Lv_h", "Lv_p"];
}
//--------------------------------------------------
// 等级标签
private function changeToLevelTab() : void
{
	rank_tip_label3.label.text = Define.grade;
	RankListLogic.request_ranking(1);
}
//--------------------------------------------------
// 装饰度/豪华度标签
private function changeToLuxuryTab() : void
{
	rank_tip_label3.label.text = Define.luxury;
	RankListLogic.request_ranking(2);
}
//--------------------------------------------------
// 男性魅力值标签
private function changeToMaleCharmTab() : void
{
	rank_tip_label3.label.text = Define.malecharm;
	RankListLogic.request_ranking(3);
}
//--------------------------------------------------
// 女性魅力值标签
private function changeToFemaleCharmTab() : void
{
	rank_tip_label3.label.text = Define.femalcharm;
	RankListLogic.request_ranking(4);
}
//--------------------------------------------------
// 被关注标签
private function changeToFollowedTab() : void
{
	rank_tip_label3.label.text = Define.getContent(5199);
	RankListLogic.request_ranking(6);
}
//--------------------------------------------------
// 处理标签
private function handleRankResult(data : notify_ranking) : void
{
	var btn : iGUIButton = null;
	// 等级
	if (1 == data.type) { btn = tab_btn1; }
	// 装饰度,豪华度
	if (2 == data.type) { btn = tab_btn2; }
	// 男性魅力值
	if (3 == data.type) { btn = tab_btn3; }
	// 女性魅力值
	if (4 == data.type) { btn = tab_btn4; }
	// 被关注人数
	if (6 == data.type) { btn = tab_btn5; }
	
	if (null == btn)
	{
		throw new Exception("iGUICode_RankListUI -> handleRankResult(notify_ranking) -> data type: " + data.type + " is not handled!");
	}
	setTabPage(btn, data.data, data.type);
	
	if (-1 == data.self_ranking)	// 不显示自身排名
	{
		self_rank_label.setEnabled(false);
		self_rank_num.setEnabled(false);
	}
	else
	{
		self_rank_label.setEnabled(true);
		self_rank_num.setEnabled(true);
		self_rank_num.label.text = data.self_ranking.ToString();
	}
}
//--------------------------------------------------


