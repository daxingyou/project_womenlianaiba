#pragma strict
#pragma downcast
import iGUI;

private static var instance : iGUICode_BackpackUI;
function Awake(){
	instance=this;
	// 初始
	init();
}
static function getInstance(){
	return instance;
}
@HideInInspector
var page_label : iGUILabel;
@HideInInspector
var right_page_btn : iGUIButton;
@HideInInspector
var left_page_btn : iGUIButton;
@HideInInspector
var first_page_btn : iGUIButton;
@HideInInspector
var item_select : iGUILabel;
@HideInInspector
var item_num20 : iGUILabel;
@HideInInspector
var item_image20 : iGUIImage;
@HideInInspector
var item_slot20 : iGUIPanel;
@HideInInspector
var item_num19 : iGUILabel;
@HideInInspector
var item_image19 : iGUIImage;
@HideInInspector
var item_slot19 : iGUIPanel;
@HideInInspector
var item_num18 : iGUILabel;
@HideInInspector
var item_image18 : iGUIImage;
@HideInInspector
var item_slot18 : iGUIPanel;
@HideInInspector
var item_num17 : iGUILabel;
@HideInInspector
var item_image17 : iGUIImage;
@HideInInspector
var item_slot17 : iGUIPanel;
@HideInInspector
var item_num16 : iGUILabel;
@HideInInspector
var item_image16 : iGUIImage;
@HideInInspector
var item_slot16 : iGUIPanel;
@HideInInspector
var item_num15 : iGUILabel;
@HideInInspector
var item_image15 : iGUIImage;
@HideInInspector
var item_slot15 : iGUIPanel;
@HideInInspector
var item_num14 : iGUILabel;
@HideInInspector
var item_image14 : iGUIImage;
@HideInInspector
var item_slot14 : iGUIPanel;
@HideInInspector
var item_num13 : iGUILabel;
@HideInInspector
var item_image13 : iGUIImage;
@HideInInspector
var item_slot13 : iGUIPanel;
@HideInInspector
var item_num12 : iGUILabel;
@HideInInspector
var item_image12 : iGUIImage;
@HideInInspector
var item_slot12 : iGUIPanel;
@HideInInspector
var item_num11 : iGUILabel;
@HideInInspector
var item_image11 : iGUIImage;
@HideInInspector
var item_slot11 : iGUIPanel;
@HideInInspector
var item_num10 : iGUILabel;
@HideInInspector
var item_image10 : iGUIImage;
@HideInInspector
var item_slot10 : iGUIPanel;
@HideInInspector
var item_num9 : iGUILabel;
@HideInInspector
var item_image9 : iGUIImage;
@HideInInspector
var item_slot9 : iGUIPanel;
@HideInInspector
var item_num8 : iGUILabel;
@HideInInspector
var item_image8 : iGUIImage;
@HideInInspector
var item_slot8 : iGUIPanel;
@HideInInspector
var item_num7 : iGUILabel;
@HideInInspector
var item_image7 : iGUIImage;
@HideInInspector
var item_slot7 : iGUIPanel;
@HideInInspector
var item_num6 : iGUILabel;
@HideInInspector
var item_image6 : iGUIImage;
@HideInInspector
var item_slot6 : iGUIPanel;
@HideInInspector
var item_num5 : iGUILabel;
@HideInInspector
var item_image5 : iGUIImage;
@HideInInspector
var item_slot5 : iGUIPanel;
@HideInInspector
var item_num4 : iGUILabel;
@HideInInspector
var item_image4 : iGUIImage;
@HideInInspector
var item_slot4 : iGUIPanel;
@HideInInspector
var item_num3 : iGUILabel;
@HideInInspector
var item_image3 : iGUIImage;
@HideInInspector
var item_slot3 : iGUIPanel;
@HideInInspector
var item_num2 : iGUILabel;
@HideInInspector
var item_image2 : iGUIImage;
@HideInInspector
var item_slot2 : iGUIPanel;
@HideInInspector
var item_num1 : iGUILabel;
@HideInInspector
var item_image1 : iGUIImage;
@HideInInspector
var item_slot1 : iGUIPanel;
@HideInInspector
var item_slot_list : iGUIPanel;
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
	Backpack.getInstance().closeBackpackUI();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_BACKPACKUI));
}
//--------------------------------------------------
// 点击首页按钮
function ClickCallback_first_page_btn(caller : iGUIElement)
{
	if (null!=mCurTabPage && mCurTabPage.firstPage())
	{
		refreshSlots();
	}
}
//--------------------------------------------------
// 点击左翻页按钮
function ClickCallback_left_page_btn(caller : iGUIElement)
{
	if (null!=mCurTabPage && mCurTabPage.prePage())
	{
		refreshSlots();
	}
}
//--------------------------------------------------
// 点击右翻页按钮
function ClickCallback_right_page_btn(caller : iGUIElement)
{
	if (null!=mCurTabPage && mCurTabPage.nextPage())
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
	
	changeToPropTab();
}
//--------------------------------------------------
// 点击标签按钮2
function ClickCallback_tab_btn2(caller : iGUIElement)
{
	if (true == caller.userData)
		return;
	
	changeToDressTab();
}
//--------------------------------------------------
// 点击标签按钮3
function ClickCallback_tab_btn3(caller : iGUIElement)
{
	if (true == caller.userData)
		return;
	
	changeToFurnitureTab();
}
//--------------------------------------------------
// 点击标签按钮4
function ClickCallback_tab_btn4(caller : iGUIElement)
{
	if (true == caller.userData)
		return;
	
	changeToComposePaperTab();
}
//--------------------------------------------------
// 点击标签按钮5
function ClickCallback_tab_btn5(caller : iGUIElement)
{
	if (true == caller.userData)
		return;
	
	changeToComposeMaterialTab();
}
//--------------------------------------------------
// 点击标签按钮6
function ClickCallback_tab_btn6(caller : iGUIElement)
{
	if (true == caller.userData)
		return;
	
	changeToSeedTab();
}
//--------------------------------------------------
// 点击标签按钮7
function ClickCallback_tab_btn7(caller : iGUIElement)
{

}
//--------------------------------------------------
// 点击标签按钮8
function ClickCallback_tab_btn8(caller : iGUIElement)
{

}
//--------------------------------------------------




/***************************************************
*** 界面逻辑
***************************************************/
private var SLOT_NUM : int = 20;							// 每页物品数量
private var mSlotArray : Array = new Array();
private var mCurTabPage : BackpackPage = null;				// 当前标签页



//--------------------------------------------------
// 初始
private function init() : void
{
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.BACKPACK_REFRESH), handleRefreshSlots);
	createSlots();
}
//--------------------------------------------------
// 清除
private function clear() : void
{
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.BACKPACK_REFRESH), handleRefreshSlots);
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
		mSlotArray.Add(new BackpackSlot(root, element[0], element[1], element[2], item_select));
	}
}
//--------------------------------------------------
// 清除列表
private function clearSlots() : void
{
	for (var slot : BackpackSlot in mSlotArray)
	{
		slot.setContent(null);
	}
}
//--------------------------------------------------
// 刷新列表
private function refreshSlots() : void
{
	// 清除
	clearSlots();
	if (null == mCurTabPage)
	{
		return;
	}
	// 设置当前页的内容
	var arr : Array = mCurTabPage.getCurPage();
	for (var i:int=0; i<arr.Count; ++i)
	{
		var slot : BackpackSlot = mSlotArray[i] as BackpackSlot;
		slot.setContent(arr[i]);
	}
	// 设置页数
	page_label.label.text = mCurTabPage.getCurPageNum().ToString() + "/" + mCurTabPage.getTotalPageNum().ToString();
}
//--------------------------------------------------
// 更新格子
private function handleRefreshSlots(evt : GameEvent, obj : System.Object) : void
{
	var pg : PackGrid = obj as PackGrid;
	if (null != mCurTabPage && mCurTabPage.isBelong(pg))
	{
		refreshSlots();
	}
}
//--------------------------------------------------
// 获取物品控件
private function getItemCtrl(index : int) : iGUIElement[]
{
	if (0 == index) return [item_slot1, item_image1, item_num1];
	if (1 == index) return [item_slot2, item_image2, item_num2];
	if (2 == index) return [item_slot3, item_image3, item_num3];
	if (3 == index) return [item_slot4, item_image4, item_num4];
	if (4 == index) return [item_slot5, item_image5, item_num5];
	if (5 == index) return [item_slot6, item_image6, item_num6];
	if (6 == index) return [item_slot7, item_image7, item_num7];
	if (7 == index) return [item_slot8, item_image8, item_num8];
	if (8 == index) return [item_slot9, item_image9, item_num9];
	if (9 == index) return [item_slot10, item_image10, item_num10];
	if (10 == index) return [item_slot11, item_image11, item_num11];
	if (11 == index) return [item_slot12, item_image12, item_num12];
	if (12 == index) return [item_slot13, item_image13, item_num13];
	if (13 == index) return [item_slot14, item_image14, item_num14];
	if (14 == index) return [item_slot15, item_image15, item_num15];
	if (15 == index) return [item_slot16, item_image16, item_num16];
	if (16 == index) return [item_slot17, item_image17, item_num17];
	if (17 == index) return [item_slot18, item_image18, item_num18];
	if (18 == index) return [item_slot19, item_image19, item_num19];
	// 19 == index
	return [item_slot20, item_image20, item_num20];
}
//--------------------------------------------------
// 初始标签页
private function setTabPage(btn : iGUIButton, tab_page : BackpackPage) : void
{
	setTabBtnState(btn);
	mCurTabPage = tab_page;
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
	var normal : String = "UISkins/Textures/ItemsMake/" + state_image[0];
	var hover : String = "UISkins/Textures/ItemsMake/" + state_image[1];
	var push : String = "UISkins/Textures/ItemsMake/" + state_image[2];
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
	if (tab_btn1 == tab) return ["daojv_n", "daojv_h", "daojv_a"];
	if (tab_btn2 == tab) return ["renwuzhs_n", "renwuzhs_h", "renwuzhs_a"];
	if (tab_btn3 == tab) return ["jiajvzhs_n", "jiajvzhs_h", "jiajvzhs_a"];
	if (tab_btn4 == tab) return ["tuzhi_n", "tuzhi_h", "tuzhi_a"];
	if (tab_btn5 == tab) return ["hccl_n", "hccl_h", "hccl_a"];
	if (tab_btn6 == tab) return ["crop_n", "crop_h", "crop_a"];
	if (tab_btn7 == tab) return ["crop_n", "crop_h", "crop_a"];
	// tab_btn8 == tab
	return ["crop_n", "crop_h", "crop_a"];
}
//--------------------------------------------------
// 道具标签
private function changeToPropTab() : void
{
	setTabPage(tab_btn1, Backpack.PropTabPage);
}
//--------------------------------------------------
// 装饰标签
private function changeToDressTab() : void
{
	setTabPage(tab_btn2, Backpack.DressTabPage);
}
//--------------------------------------------------
// 家具标签
private function changeToFurnitureTab() : void
{
	setTabPage(tab_btn3, Backpack.FurnitureTabPage);
}
//--------------------------------------------------
// 合成图纸标签
private function changeToComposePaperTab() : void
{
	setTabPage(tab_btn4, Backpack.ComposePaperTabPage);
}
//--------------------------------------------------
// 合成材料标签
private function changeToComposeMaterialTab() : void
{
	setTabPage(tab_btn5, Backpack.ComposeMaterialTabPage);
}
//--------------------------------------------------
// 种子标签
private function changeToSeedTab() : void
{
	setTabPage(tab_btn6, Backpack.SeedTabPage);
}
//--------------------------------------------------
// 设置默认标签页
public function changeToDefaultTab(tab : int) : void
{
	if (1 == tab) { changeToPropTab(); return; }
	if (2 == tab) { changeToDressTab(); return; }
	if (3 == tab) { changeToFurnitureTab(); return; }
	if (4 == tab) { changeToComposePaperTab(); return; }
	if (5 == tab) { changeToComposeMaterialTab(); return; }
	if (6 == tab) { changeToSeedTab(); return; }
	// 默认,0 == tab
	if (false == Backpack.PropTabPage.isEmpty()) { changeToPropTab(); return; }
	if (false == Backpack.DressTabPage.isEmpty()) { changeToDressTab(); return; }
	if (false == Backpack.FurnitureTabPage.isEmpty()) { changeToFurnitureTab(); return; }
	if (false == Backpack.ComposePaperTabPage.isEmpty()) { changeToComposePaperTab(); return; }
	if (false == Backpack.ComposeMaterialTabPage.isEmpty()) { changeToComposeMaterialTab(); return; }
	if (false == Backpack.SeedTabPage.isEmpty()) { changeToSeedTab(); return; }
}
//--------------------------------------------------
// 设置界面位置
public function setPosition(x : float, y : float) : void
{
	frame.setX(x);
	frame.setY(y);
}
//--------------------------------------------------
// 是否显示关闭按钮
public function setCloseEnable(visible : boolean) : void
{
	close_btn.setEnabled(visible);
}
//--------------------------------------------------


