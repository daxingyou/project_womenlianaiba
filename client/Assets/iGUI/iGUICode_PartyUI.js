#pragma strict
#pragma downcast
import iGUI;

private static var instance : iGUICode_PartyUI;
function Awake(){
	instance=this;
	registerEvents();
}
static function getInstance(){
	return instance;
}
@HideInInspector
var party_join_btn10 : iGUIButton;
@HideInInspector
var party_remain_label10 : iGUILabel;
@HideInInspector
var party_exp_label10 : iGUILabel;
@HideInInspector
var party_people_label10 : iGUILabel;
@HideInInspector
var party_describe10 : iGUILabel;
@HideInInspector
var party_title10 : iGUILabel;
@HideInInspector
var party_creater10 : iGUILabel;
@HideInInspector
var party_photo10 : iGUILabel;
@HideInInspector
var party_item10 : iGUIPanel;
@HideInInspector
var party_join_btn9 : iGUIButton;
@HideInInspector
var party_remain_label9 : iGUILabel;
@HideInInspector
var party_exp_label9 : iGUILabel;
@HideInInspector
var party_people_label9 : iGUILabel;
@HideInInspector
var party_describe9 : iGUILabel;
@HideInInspector
var party_title9 : iGUILabel;
@HideInInspector
var party_creater9 : iGUILabel;
@HideInInspector
var party_photo9 : iGUILabel;
@HideInInspector
var party_item9 : iGUIPanel;
@HideInInspector
var party_join_btn8 : iGUIButton;
@HideInInspector
var party_remain_label8 : iGUILabel;
@HideInInspector
var party_exp_label8 : iGUILabel;
@HideInInspector
var party_people_label8 : iGUILabel;
@HideInInspector
var party_describe8 : iGUILabel;
@HideInInspector
var party_title8 : iGUILabel;
@HideInInspector
var party_creater8 : iGUILabel;
@HideInInspector
var party_photo8 : iGUILabel;
@HideInInspector
var party_item8 : iGUIPanel;
@HideInInspector
var party_join_btn7 : iGUIButton;
@HideInInspector
var party_remain_label7 : iGUILabel;
@HideInInspector
var party_exp_label7 : iGUILabel;
@HideInInspector
var party_people_label7 : iGUILabel;
@HideInInspector
var party_describe7 : iGUILabel;
@HideInInspector
var party_title7 : iGUILabel;
@HideInInspector
var party_creater7 : iGUILabel;
@HideInInspector
var party_photo7 : iGUILabel;
@HideInInspector
var party_item7 : iGUIPanel;
@HideInInspector
var party_join_btn6 : iGUIButton;
@HideInInspector
var party_remain_label6 : iGUILabel;
@HideInInspector
var party_exp_label6 : iGUILabel;
@HideInInspector
var party_people_label6 : iGUILabel;
@HideInInspector
var party_describe6 : iGUILabel;
@HideInInspector
var party_title6 : iGUILabel;
@HideInInspector
var party_creater6 : iGUILabel;
@HideInInspector
var party_photo6 : iGUILabel;
@HideInInspector
var party_item6 : iGUIPanel;
@HideInInspector
var party_join_btn5 : iGUIButton;
@HideInInspector
var party_remain_label5 : iGUILabel;
@HideInInspector
var party_exp_label5 : iGUILabel;
@HideInInspector
var party_people_label5 : iGUILabel;
@HideInInspector
var party_describe5 : iGUILabel;
@HideInInspector
var party_title5 : iGUILabel;
@HideInInspector
var party_creater5 : iGUILabel;
@HideInInspector
var party_photo5 : iGUILabel;
@HideInInspector
var party_item5 : iGUIPanel;
@HideInInspector
var party_join_btn4 : iGUIButton;
@HideInInspector
var party_remain_label4 : iGUILabel;
@HideInInspector
var party_exp_label4 : iGUILabel;
@HideInInspector
var party_people_label4 : iGUILabel;
@HideInInspector
var party_describe4 : iGUILabel;
@HideInInspector
var party_title4 : iGUILabel;
@HideInInspector
var party_creater4 : iGUILabel;
@HideInInspector
var party_photo4 : iGUILabel;
@HideInInspector
var party_item4 : iGUIPanel;
@HideInInspector
var party_join_btn3 : iGUIButton;
@HideInInspector
var party_remain_label3 : iGUILabel;
@HideInInspector
var party_exp_label3 : iGUILabel;
@HideInInspector
var party_people_label3 : iGUILabel;
@HideInInspector
var party_describe3 : iGUILabel;
@HideInInspector
var party_title3 : iGUILabel;
@HideInInspector
var party_creater3 : iGUILabel;
@HideInInspector
var party_photo3 : iGUILabel;
@HideInInspector
var party_item3 : iGUIPanel;
@HideInInspector
var party_join_btn2 : iGUIButton;
@HideInInspector
var party_remain_label2 : iGUILabel;
@HideInInspector
var party_exp_label2 : iGUILabel;
@HideInInspector
var party_people_label2 : iGUILabel;
@HideInInspector
var party_describe2 : iGUILabel;
@HideInInspector
var party_title2 : iGUILabel;
@HideInInspector
var party_creater2 : iGUILabel;
@HideInInspector
var party_photo2 : iGUILabel;
@HideInInspector
var party_item2 : iGUIPanel;
@HideInInspector
var party_join_btn1 : iGUIButton;
@HideInInspector
var party_remain_label1 : iGUILabel;
@HideInInspector
var party_exp_label1 : iGUILabel;
@HideInInspector
var party_people_label1 : iGUILabel;
@HideInInspector
var party_describe1 : iGUILabel;
@HideInInspector
var party_title1 : iGUILabel;
@HideInInspector
var party_creater1 : iGUILabel;
@HideInInspector
var party_photo1 : iGUILabel;
@HideInInspector
var party_item1 : iGUIPanel;
@HideInInspector
var party_list : iGUIPanel;
@HideInInspector
var remain_time_label : iGUILabel;
@HideInInspector
var tip_label1 : iGUILabel;
@HideInInspector
var tip_image2 : iGUILabel;
@HideInInspector
var tip_image1 : iGUILabel;
@HideInInspector
var invite_friend_btn : iGUIButton;
@HideInInspector
var create_party_btn : iGUIButton;
@HideInInspector
var close_btn : iGUIButton;
@HideInInspector
var page_label : iGUILabel;
@HideInInspector
var next_page_btn : iGUIButton;
@HideInInspector
var pre_page_btn : iGUIButton;
@HideInInspector
var first_page_btn : iGUIButton;
@HideInInspector
var type_select_list : iGUIDropDownList;
@HideInInspector
var frame_title : iGUILabel;
@HideInInspector
var frame : iGUIPanel;
@HideInInspector
var root : iGUIRoot;



//--------------------------------------------------
function Start()
{
	// 界面事件注册
	close_btn.clickCallback = ClickCallback_close_btn;
	first_page_btn.clickCallback = ClickCallback_first_page_btn;
	pre_page_btn.clickCallback = ClickCallback_pre_page_btn;
	next_page_btn.clickCallback = ClickCallback_next_page_btn;
	create_party_btn.clickCallback = ClickCallback_create_party_btn;
	invite_friend_btn.clickCallback = ClickCallback_invite_friend_btn;
	type_select_list.valueChangeCallback = ValueChangeCallback_type;
	// 其他初始操作
	init();
	createSlots();
}
//--------------------------------------------------
function OnDestroy()
{
	unregisterEvents();
	if (mTimer)
	{
		mTimer.Stop();
	}
	clearSlots(mHotSlotArray);
	clearSlots(mSlotArray);
	mHotSlotArray.Clear();
	mSlotArray.Clear();
}
//--------------------------------------------------





/***************************************************
*** 界面事件回调
***************************************************/
//--------------------------------------------------
function ClickCallback_close_btn(caller : iGUIElement)
{
	Ctrl.Excute("CLOSE_PARTY_UI", true);
}
//--------------------------------------------------
function ClickCallback_first_page_btn(caller : iGUIElement)
{
	// 首页
	if (1 == mCurPage)
		return;
	
	mCurPage = 1;
	Party.request_get_party_list(mCurType, mCurPage);
}
//--------------------------------------------------
function ClickCallback_pre_page_btn(caller : iGUIElement)
{
	// 请求前一页
	if (mCurPage <= 1)
		return;
	
	--mCurPage;
	Party.request_get_party_list(mCurType, mCurPage);
}
//--------------------------------------------------
function ClickCallback_next_page_btn(caller : iGUIElement)
{
	// 请求后一页
	var _mp : int = Ctrl.Get("max_page");
	if (mCurPage >= _mp)
		return;
	
	++mCurPage;
	Party.request_get_party_list(mCurType, mCurPage);
}
//--------------------------------------------------
function ClickCallback_create_party_btn(caller : iGUIElement)
{
	// 关闭派对界面,打开创建派对界面
	Ctrl.Excute("CLOSE_PARTY_UI", false);
	UI.getUI().OpenUIRoot("PartyCreateUI");
	UI.getUI().SetModal("PartyCreateUI", true);
	//UI.getUI().OpenUIRoot("PartyPropSelectUI"); // alter by zlj
}
//--------------------------------------------------
function ClickCallback_invite_friend_btn(caller : iGUIElement)
{
	Party.request_invite_list();
}
//--------------------------------------------------
function ValueChangeCallback_type(caller : iGUIElement)
{
	mCurPage = 1;
	Party.request_get_party_list((caller as iGUIDropDownList).selectedIndex, 1);
}
//--------------------------------------------------





/***************************************************
*** 界面逻辑
***************************************************/
private var Ctrl : Controller = Party.Ctrl;
private var HOT_SLOT_NUM : int = 4;					// 推荐派对数量
private var SLOT_NUM : int = 6;						// 每页派对数量
private var mHotSlotArray : Array = new Array();	//
private var mSlotArray : Array = new Array();		// 
private var mCurType : int = 0;						// 当前类型(0.派对,1.普通派对,2.私人派对)
private var mCurPage : int = 1;						// 当前派对页
private var mTimer : Timer = null;					// 定时器
private var mRemainTime : int = 0;					// 剩余时间(秒)
private var mHasGetMyParty : boolean = false;		// 是否已经获取了派对信息
//--------------------------------------------------
private function registerEvents() : void
{
	Ctrl.Register("GET_MY_PARTY_RESULT", getMyParty);
	Ctrl.Register("REFRESH_HOT_LIST", refreshHotList);
	Ctrl.Register("REFRESH_PARTY_LIST", refreshPartyList);
}
//--------------------------------------------------
private function unregisterEvents() : void
{
	Ctrl.Unregister("GET_MY_PARTY_RESULT", getMyParty);
	Ctrl.Unregister("REFRESH_HOT_LIST", refreshHotList);
	Ctrl.Unregister("REFRESH_PARTY_LIST", refreshPartyList);
}
//--------------------------------------------------
// 初始操作
private function init() : void
{
	if (false == mHasGetMyParty)
	{
		create_party_btn.setEnabled(false);
		remain_time_label.setEnabled(false);
		invite_friend_btn.setEnabled(false);
	}
	type_select_list.selectedIndex = 0;
	Party.request_get_party_list(0, 1);
}
//--------------------------------------------------
// 显示创建派对界面
private function showCreateParty() : void
{
	create_party_btn.setEnabled(true);
	remain_time_label.setEnabled(false);
	invite_friend_btn.setEnabled(false);
}
//--------------------------------------------------
// 显示销毁派对界面
private function showDestroyParty(create : stime, remain : int) : void
{
	create_party_btn.setEnabled(false);
	remain_time_label.setEnabled(true);
	//
	mRemainTime = remain;
	mTimer = new Timer(1000, remain);
	mTimer.addEventListener(TimerEvent.TIMER, oneTime);
	mTimer.addEventListener(TimerEvent.TIMER_COMPLETE, overTime);
	mTimer.Start();
}
//--------------------------------------------------
// 每秒触发
private function oneTime(_timer : Timer, obj : System.Object) : void
{
	--mRemainTime;
	// 分
	var minutes : int = mRemainTime / 60;
	var minutes_text : String = minutes.ToString();
	if (minutes < 10)
	{
		minutes_text = "0" + minutes_text;
	}
	// 秒
	var seconds : int = mRemainTime % 60;
	var seconds_text : String = seconds.ToString();
	if (seconds < 10)
	{
		seconds_text = "0" + seconds_text;
	}
	// 显示
	remain_time_label.label.text = Define.getContent(5196, [minutes_text, seconds_text]);
}
//--------------------------------------------------
// 定时结束触发
private function overTime(_timer : Timer, obj : System.Object) : void
{
	showCreateParty();
}
//--------------------------------------------------
// 获取自己的派对
private function getMyParty(param : party_data) : void
{
	mHasGetMyParty = true;
	if (0 == param.house_id)	// 没有派对
	{
		showCreateParty();
		return;
	}
	// 有派对
	showDestroyParty(param.create_time, param.rest_time);
	invite_friend_btn.setEnabled(2 == param.type);	// 私人派对,显示邀请按钮
}
//--------------------------------------------------
// 获取物品控件
private function getItemCtrl(index : int) : iGUIElement[]
{
	if (0 == index) return [party_item1, party_photo1, party_creater1, party_title1, party_describe1, party_people_label1, party_join_btn1, party_exp_label1, party_remain_label1];
	if (1 == index) return [party_item2, party_photo2, party_creater2, party_title2, party_describe2, party_people_label2, party_join_btn2, party_exp_label2, party_remain_label2];
	if (2 == index) return [party_item3, party_photo3, party_creater3, party_title3, party_describe3, party_people_label3, party_join_btn3, party_exp_label3, party_remain_label3];
	if (3 == index) return [party_item4, party_photo4, party_creater4, party_title4, party_describe4, party_people_label4, party_join_btn4, party_exp_label4, party_remain_label4];
	if (4 == index) return [party_item5, party_photo5, party_creater5, party_title5, party_describe5, party_people_label5, party_join_btn5, party_exp_label5, party_remain_label5];
	if (5 == index) return [party_item6, party_photo6, party_creater6, party_title6, party_describe6, party_people_label6, party_join_btn6, party_exp_label6, party_remain_label6];
	if (6 == index) return [party_item7, party_photo7, party_creater7, party_title7, party_describe7, party_people_label7, party_join_btn7, party_exp_label7, party_remain_label7];
	if (7 == index) return [party_item8, party_photo8, party_creater8, party_title8, party_describe8, party_people_label8, party_join_btn8, party_exp_label8, party_remain_label8];
	if (8 == index) return [party_item9, party_photo9, party_creater9, party_title9, party_describe9, party_people_label9, party_join_btn9, party_exp_label9, party_remain_label9];
	// 9 == index
	return [party_item10, party_photo10, party_creater10, party_title10, party_describe10, party_people_label10, party_join_btn10, party_exp_label10, party_remain_label10];
}
//--------------------------------------------------
// 创建列表
private function createSlots() : void
{
	for (var i:int = 0; i<HOT_SLOT_NUM+SLOT_NUM; ++i)
	{
		var element : iGUIElement[] = getItemCtrl(i);
		var slot : PartySlot = new PartySlot(element[0], element[1], element[2], element[3], element[4], element[5], element[6], element[7], element[8]);
		if (i < HOT_SLOT_NUM)		// 推荐派对
		{
			mHotSlotArray.Add(slot);
		}
		else						// 非推荐派对
		{
			mSlotArray.Add(slot);
		}
	}
}
//--------------------------------------------------
// 清除列表
private function clearSlots(arr : Array) : void
{
	for (var slot : PartySlot in arr)
	{
		slot.setVisible(false);
		slot.setContent(null);
	}
}
//--------------------------------------------------
// 刷新推荐派对
private function refreshHotList(list : Array) : void
{
	clearSlots(mHotSlotArray);
	for (var i:int=0; i<list.Count; ++i)
	{
		var slot : PartySlot = mHotSlotArray[i];
		slot.setVisible(true);
		slot.setContent(list[i]);
	}
}
//--------------------------------------------------
// 刷新派对列表
private function refreshPartyList(list : Array) : void
{
	clearSlots(mSlotArray);
	for (var i:int=0; i<list.Count; ++i)
	{
		var slot : PartySlot = mSlotArray[i];
		slot.setVisible(true);
		slot.setContent(list[i]);
	}
	var max_page : int = Ctrl.Get("max_page");
	if (mCurPage > max_page)
	{
		mCurPage = max_page;
	}
	page_label.label.text = mCurPage + "/" + max_page;
}
//--------------------------------------------------


