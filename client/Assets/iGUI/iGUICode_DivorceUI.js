import iGUI;

private static var instance : iGUICode_DivorceUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
// 窗口7
@HideInInspector
var frame7_btn1 : iGUIButton;
@HideInInspector
var frame7_text1 : iGUIListBox;
@HideInInspector
var frame7 : iGUIPanel;
// 窗口6
@HideInInspector
var frame6_cancel_btn : iGUIButton;
@HideInInspector
var frame6_ok_btn : iGUIButton;
@HideInInspector
var frame6_page_label : iGUILabel;
@HideInInspector
var frame6_right_page_btn : iGUIButton;
@HideInInspector
var frame6_left_page_btn : iGUIButton;
@HideInInspector
var frame6_first_page_btn : iGUIButton;
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
var frame6_title_label : iGUILabel;
@HideInInspector
var frame6 : iGUIPanel;
// 窗口5
@HideInInspector
var frame5_btn1 : iGUIButton;
@HideInInspector
var frame5_txt1 : iGUILabel;
@HideInInspector
var frame5_title : iGUILabel;
@HideInInspector
var frame5 : iGUIPanel;
// 窗口4
@HideInInspector
var frame4_btn1 : iGUIButton;
@HideInInspector
var frame4_label1 : iGUILabel;
@HideInInspector
var frame4 : iGUIPanel;
// 窗口3
@HideInInspector
var frame3_btn1 : iGUIButton;
@HideInInspector
var frame3 : iGUIPanel;
// 窗口2
@HideInInspector
var frame2_cost_label : iGUILabel;
@HideInInspector
var frame2_level_label : iGUILabel;
@HideInInspector
var frame2_btn3 : iGUIButton;
@HideInInspector
var frame2_btn2 : iGUIButton;
@HideInInspector
var frame2_btn1 : iGUIButton;
@HideInInspector
var frame2 : iGUIPanel;
// 窗口1
@HideInInspector
var frame1_btn2 : iGUIButton;
@HideInInspector
var frame1_btn1 : iGUIButton;
@HideInInspector
var frame1 : iGUIPanel;
@HideInInspector
var root : iGUIRoot;



//--------------------------------------------------
function Start()
{
	// 界面事件注册
	frame1_btn1.clickCallback = System.Delegate.Combine(frame1_btn1.clickCallback, ClickCallback_frame1_btn1 as iGUIEventCallback);
	frame1_btn2.clickCallback = System.Delegate.Combine(frame1_btn2.clickCallback, ClickCallback_frame1_btn2 as iGUIEventCallback);
	frame2_btn1.clickCallback = System.Delegate.Combine(frame2_btn1.clickCallback, ClickCallback_frame2_btn1 as iGUIEventCallback);
	frame2_btn2.clickCallback = System.Delegate.Combine(frame2_btn2.clickCallback, ClickCallback_frame2_btn2 as iGUIEventCallback);
	frame2_btn3.clickCallback = System.Delegate.Combine(frame2_btn3.clickCallback, ClickCallback_frame2_btn3 as iGUIEventCallback);
	frame3_btn1.clickCallback = System.Delegate.Combine(frame3_btn1.clickCallback, ClickCallback_frame3_btn1 as iGUIEventCallback);
	frame4_btn1.clickCallback = System.Delegate.Combine(frame4_btn1.clickCallback, ClickCallback_frame4_btn1 as iGUIEventCallback);
	frame5_btn1.clickCallback = System.Delegate.Combine(frame5_btn1.clickCallback, ClickCallback_frame5_btn1 as iGUIEventCallback);	
	frame6_first_page_btn.clickCallback = System.Delegate.Combine(frame6_first_page_btn.clickCallback, ClickCallback_frame6_first_page_btn as iGUIEventCallback);
	frame6_left_page_btn.clickCallback = System.Delegate.Combine(frame6_left_page_btn.clickCallback, ClickCallback_frame6_left_page_btn as iGUIEventCallback);
	frame6_right_page_btn.clickCallback = System.Delegate.Combine(frame6_right_page_btn.clickCallback, ClickCallback_frame6_right_page_btn as iGUIEventCallback);
	frame6_ok_btn.clickCallback = System.Delegate.Combine(frame6_ok_btn.clickCallback, ClickCallback_frame6_ok_btn as iGUIEventCallback);
	frame6_cancel_btn.clickCallback = System.Delegate.Combine(frame6_cancel_btn.clickCallback, ClickCallback_frame6_cancel_btn as iGUIEventCallback);
	frame7_btn1.clickCallback = System.Delegate.Combine(frame7_btn1.clickCallback, ClickCallback_frame7_btn1_btn as iGUIEventCallback);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.BACKPACK_CLICKED), handleClickBackpackSlot);
	Divorce.addObserver("event_click_divorce_slot", handleClickDivorceSlot);
}
//--------------------------------------------------
function OnDestroy()
{
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.BACKPACK_CLICKED), handleClickBackpackSlot);
	Divorce.delObserver("event_click_divorce_slot", handleClickDivorceSlot);
	clear();
}
//--------------------------------------------------
// “再考虑考虑”按钮
function ClickCallback_frame1_btn1(caller : iGUIElement)
{
	Divorce.getInstance().closeDivorceUI();
}
//--------------------------------------------------
// "必须要分手"按钮
function ClickCallback_frame1_btn2(caller : iGUIElement)
{
	var level : int = DataCenter.getMainPlayerCurLv();
	var cost : int = Divorce.getInstance().getCost(level);
	frame2_level_label.label.text = level.ToString() + Define.level;
	frame2_cost_label.label.text = cost.ToString();
	openUI(2);
}
//--------------------------------------------------
// "我已阅读,请确定执行"按钮
function ClickCallback_frame2_btn1(caller : iGUIElement)
{
	mCost = Divorce.getInstance().getCost(DataCenter.getMainPlayerCurLv());
	if (mCost > SelfItemLogic.getInstance()._loverDiamond)	// 水晶不足
	{
		var content : String = Define.getContent(5136);
		UI.getUI().OpenMsgbox("", content, true);
		return;
	}
	openUI(6);
}
//--------------------------------------------------
// "我还需要再考虑考虑"按钮
function ClickCallback_frame2_btn2(caller : iGUIElement)
{
	Divorce.getInstance().closeDivorceUI();
}
//--------------------------------------------------
// "查看分手水晶花费"按钮
function ClickCallback_frame2_btn3(caller : iGUIElement)
{
	openUI(5);
}
//--------------------------------------------------
// "重新进入游戏"按钮
function ClickCallback_frame3_btn1(caller : iGUIElement)
{
	ExternalFlatform.ReloadPage();
}
//--------------------------------------------------
// "点击领取水晶"按钮
function ClickCallback_frame4_btn1(caller : iGUIElement)
{
	Divorce.request_player_breakup_diamond();
}
//--------------------------------------------------
// "点击了解"按钮
function ClickCallback_frame5_btn1(caller : iGUIElement)
{
	openUI(2);
}
//--------------------------------------------------
// "首页"按钮
function ClickCallback_frame6_first_page_btn(caller : iGUIElement)
{
	firstPage();
}
//--------------------------------------------------
// "前一页"按钮
function ClickCallback_frame6_left_page_btn(caller : iGUIElement)
{
	prePage();
}
//--------------------------------------------------
// "后一页"按钮
function ClickCallback_frame6_right_page_btn(caller : iGUIElement)
{
	nextPage();
}
//--------------------------------------------------
// "确认"按钮
function ClickCallback_frame6_ok_btn(caller : iGUIElement)
{
	var items : Array = new Array();
	for (var pg : PackGrid in mPackGridArray)
	{
		items.Add(pg._item.change());
	}
	Divorce.getInstance().closeDivorceUI();
	Backpack.getInstance().closeBackpackUI();
	Divorce.request_breakup(mCost, items);
}
//--------------------------------------------------
// "取消"按钮
function ClickCallback_frame6_cancel_btn(caller : iGUIElement)
{
	Divorce.getInstance().closeDivorceUI();
	Backpack.getInstance().closeBackpackUI();
}
//--------------------------------------------------
// 按钮
function ClickCallback_frame7_btn1_btn(caller : iGUIElement)
{
	Divorce.getInstance().closeDivorceUI();
}
//--------------------------------------------------
// 打开第几个界面
public function openUI(flag : int) : void
{
	frame1.setEnabled(false);
	frame2.setEnabled(false);
	frame3.setEnabled(false);
	frame4.setEnabled(false);
	frame5.setEnabled(false);
	frame6.setEnabled(false);
	frame7.setEnabled(false);
	if (1 == flag)	{ frame1.setEnabled(true); }
	if (2 == flag)	{ frame2.setEnabled(true); }
	if (3 == flag)	{ frame3.setEnabled(true); }
	if (4 == flag)
	{
		var diamond : int =  Divorce.getFlag("diamond");
		frame4_label1.label.text = diamond.ToString();
		frame4.setEnabled(true);
	}
	if (5 == flag)	{ frame5.setEnabled(true); }
	if (6 == flag)	{ initItemSelectUI(); }
	if (7 == flag)	{ showItemMoveUI(); }
}
//--------------------------------------------------
// 初始物品选择界面
private function initItemSelectUI() : void
{
	var x : float = frame6.positionAndSize.x + frame6.positionAndSize.width;
	var y : float = frame6.positionAndSize.y;
	Backpack.getInstance().openBackpackUI(x, y, 1, false, false, false);
	frame6.setEnabled(true);
	createSlots();
	handlePageNum();
	refreshSlots();
}
//--------------------------------------------------





/***************************************************
*** 界面逻辑
***************************************************/
private var SLOT_NUM : int = 20;							// 每页物品数量
private var mSlotArray : Array = new Array();				// slot数组
private var mPackGridArray : Array = new Array();			// 物品数组
private var mCurPageNum : int = 1;							// 当前页码
private var mTotalPageCount : int = 0;						// 总页数
private var mCost : int = 0;								// 水晶花费



//--------------------------------------------------
// 清除
private function clear() : void
{
	mSlotArray.Clear();
	mPackGridArray.Clear();
}
//--------------------------------------------------
// 创建列表
private function createSlots() : void
{
	for (var i:int=0; i<SLOT_NUM; ++i)
	{
		var element : iGUIElement[] = getItemCtrl(i);
		mSlotArray.Add(new DivorceSlot(element[0], element[1], element[2]));
	}
}
//--------------------------------------------------
// 清除列表
private function clearSlots() : void
{
	for (var slot : DivorceSlot in mSlotArray)
	{
		slot.setVisible(false);
		slot.setContent(null);
	}
}
//--------------------------------------------------
// 刷新列表
private function refreshSlots() : void
{
	// 清除
	clearSlots();
	// 设置当前页的内容
	var arr : Array = Page.getPageA(mPackGridArray, SLOT_NUM, mCurPageNum);
	for (var i:int=0; i<arr.Count; ++i)
	{
		var slot : DivorceSlot = mSlotArray[i] as DivorceSlot;
		slot.setVisible(true);
		slot.setContent(arr[i]);
	}
	// 设置页数
	frame6_page_label.label.text = mCurPageNum.ToString() + "/" + mTotalPageCount.ToString();
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
	
	return [item_slot20, item_image20, item_num20];
}
//--------------------------------------------------
// 鼠标点击背包物品
private function handleClickBackpackSlot(evt : GameEvent, obj : System.Object) : void
{
	var bc : BackpackClass = obj as BackpackClass;
	Backpack.getInstance().delItem(bc.pg);
	mPackGridArray.Add(bc.pg);
	handlePageNum();
	refreshSlots();
}
//--------------------------------------------------
// 鼠标点击离婚格子
private function handleClickDivorceSlot(pg : PackGrid) : void
{
	Backpack.getInstance().addItem(pg);
	mPackGridArray.Remove(pg);
	handlePageNum();
	refreshSlots();
}
//--------------------------------------------------
// 处理页码
private function handlePageNum() : void
{
	var total : int = Page.getPageCountA(mPackGridArray.Count, SLOT_NUM);
	if (0 == total)
	{
		mCurPageNum = 1;
		mTotalPageCount = 1;
		return;
	}
	if (mCurPageNum > total)
	{
		mCurPageNum = total;
	}
	mTotalPageCount = total;
}
//--------------------------------------------------
// 首页
private function firstPage() : void
{
	if (1 == mCurPageNum)
		return;
	
	mCurPageNum = 1;
	refreshSlots();
}
//--------------------------------------------------
// 前一页
private function prePage() : void
{
	if (1 == mCurPageNum)
		return;
	
	--mCurPageNum;
	refreshSlots();
}
//--------------------------------------------------
// 后一页
private function nextPage() : void
{
	if (mTotalPageCount == mCurPageNum)
		return;
	
	++mCurPageNum;
	refreshSlots();
}
//--------------------------------------------------
// 显示物品转移界面
private function showItemMoveUI() : void
{
	var items : ArrayList =  Divorce.getFlag("items");
	if (null == items || 0 == items.Count)
	{
		Divorce.getInstance().closeDivorceUI();
		return;
	}
	frame7.setEnabled(true);
	var y : float = 0.0f;
	for (var id : int in items)
	{
		var row : ItemRow = ResManager.LgtMgr.getItemRow(id);
		y = showMoveItems(row.name, y);
	}
	frame7_text1.refreshRect();
}
//--------------------------------------------------
// 显示转移的物品
private function showMoveItems(name : String, y : float) : float
{
	var y_gap : float = 3.0f;
	// 物品名字控件
	var name_label : iGUILabel = frame7_text1.addElement("iGUILabel") as iGUILabel;
	name_label.style.alignment = TextAnchor.MiddleCenter;
	name_label.refreshStyle();
	name_label.setWidth(240.0f);
	name_label.setHeight(25.0f);
	name_label.setX((frame7_text1.positionAndSize.width - name_label.positionAndSize.width)/2);
	name_label.setY(y + y_gap);
	name_label.label.text = name;
	return y + y_gap + name_label.positionAndSize.height;
}
//--------------------------------------------------


