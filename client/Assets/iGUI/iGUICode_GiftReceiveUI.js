#pragma strict
#pragma downcast
import iGUI;

private static var instance : iGUICode_GiftReceiveUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
// 接收所有礼物提示框
@HideInInspector
var caf_ok_btn : iGUIButton;
@HideInInspector
var caf_text_label : iGUILabel;
@HideInInspector
var caf_close_btn : iGUIButton;
@HideInInspector
var collect_all_frame : iGUIPanel;
// 接收单个礼物提示框
@HideInInspector
var cof_ok_btn : iGUIButton;
@HideInInspector
var cof_gift_describe : iGUILabel;
@HideInInspector
var cof_gift_icon : iGUILabel;
@HideInInspector
var cof_close_btn : iGUIButton;
@HideInInspector
var collect_one_frame : iGUIPanel;
// 收礼主界面
@HideInInspector
var page_label : iGUILabel;
@HideInInspector
var right_one_btn : iGUIButton;
@HideInInspector
var left_one_btn : iGUIButton;
@HideInInspector
var tip_label : iGUILabel;
@HideInInspector
var one_key_btn : iGUIButton;
@HideInInspector
var gift_visit_btn5 : iGUIButton;
@HideInInspector
var gift_attention_btn5 : iGUIButton;
@HideInInspector
var gift_btn5 : iGUIButton;
@HideInInspector
var gift_describe5 : iGUILabel;
@HideInInspector
var gift_date5 : iGUILabel;
@HideInInspector
var gift_icon5 : iGUILabel;
@HideInInspector
var gift_item5 : iGUIPanel;
@HideInInspector
var gift_visit_btn4 : iGUIButton;
@HideInInspector
var gift_attention_btn4 : iGUIButton;
@HideInInspector
var gift_btn4 : iGUIButton;
@HideInInspector
var gift_describe4 : iGUILabel;
@HideInInspector
var gift_date4 : iGUILabel;
@HideInInspector
var gift_icon4 : iGUILabel;
@HideInInspector
var gift_item4 : iGUIPanel;
@HideInInspector
var gift_visit_btn3 : iGUIButton;
@HideInInspector
var gift_attention_btn3 : iGUIButton;
@HideInInspector
var gift_btn3 : iGUIButton;
@HideInInspector
var gift_describe3 : iGUILabel;
@HideInInspector
var gift_date3 : iGUILabel;
@HideInInspector
var gift_icon3 : iGUILabel;
@HideInInspector
var gift_item3 : iGUIPanel;
@HideInInspector
var gift_visit_btn2 : iGUIButton;
@HideInInspector
var gift_attention_btn2 : iGUIButton;
@HideInInspector
var gift_btn2 : iGUIButton;
@HideInInspector
var gift_describe2 : iGUILabel;
@HideInInspector
var gift_date2 : iGUILabel;
@HideInInspector
var gift_icon2 : iGUILabel;
@HideInInspector
var gift_item2 : iGUIPanel;
@HideInInspector
var gift_visit_btn1 : iGUIButton;
@HideInInspector
var gift_attention_btn1 : iGUIButton;
@HideInInspector
var gift_btn1 : iGUIButton;
@HideInInspector
var gift_describe1 : iGUILabel;
@HideInInspector
var gift_date1 : iGUILabel;
@HideInInspector
var gift_icon1 : iGUILabel;
@HideInInspector
var gift_item1 : iGUIPanel;
@HideInInspector
var gift_record_btn : iGUIButton;
@HideInInspector
var gift_list_btn : iGUIButton;
@HideInInspector
var close_btn : iGUIButton;
@HideInInspector
var title_label : iGUILabel;
@HideInInspector
var background : iGUILabel;
@HideInInspector
var frame : iGUIPanel;
@HideInInspector
var root : iGUIRoot;


//--------------------------------------------------
function Start()
{
	// 界面事件注册
	close_btn.clickCallback = System.Delegate.Combine(close_btn.clickCallback, ClickCallback_close_btn as iGUIEventCallback);
	gift_list_btn.clickCallback = System.Delegate.Combine(gift_list_btn.clickCallback, ClickCallback_gift_list_btn as iGUIEventCallback);
	gift_record_btn.clickCallback =  System.Delegate.Combine(gift_record_btn.clickCallback, ClickCallback_gift_record_btn as iGUIEventCallback);
	gift_icon1.mouseOverCallback = System.Delegate.Combine(gift_icon1.mouseOverCallback, MouseOverCallback_gift_icon as iGUIEventCallback);
	gift_icon2.mouseOverCallback = System.Delegate.Combine(gift_icon2.mouseOverCallback, MouseOverCallback_gift_icon as iGUIEventCallback);
	gift_icon3.mouseOverCallback = System.Delegate.Combine(gift_icon3.mouseOverCallback, MouseOverCallback_gift_icon as iGUIEventCallback);
	gift_icon4.mouseOverCallback = System.Delegate.Combine(gift_icon4.mouseOverCallback, MouseOverCallback_gift_icon as iGUIEventCallback);
	gift_icon5.mouseOverCallback = System.Delegate.Combine(gift_icon5.mouseOverCallback, MouseOverCallback_gift_icon as iGUIEventCallback);
	gift_btn1.clickCallback = System.Delegate.Combine(gift_btn1.clickCallback, ClickCallback_gift_btn as iGUIEventCallback);
	gift_btn2.clickCallback = System.Delegate.Combine(gift_btn2.clickCallback, ClickCallback_gift_btn as iGUIEventCallback);
	gift_btn3.clickCallback = System.Delegate.Combine(gift_btn3.clickCallback, ClickCallback_gift_btn as iGUIEventCallback);
	gift_btn4.clickCallback = System.Delegate.Combine(gift_btn4.clickCallback, ClickCallback_gift_btn as iGUIEventCallback);
	gift_btn5.clickCallback = System.Delegate.Combine(gift_btn5.clickCallback, ClickCallback_gift_btn as iGUIEventCallback);
	gift_attention_btn1.clickCallback = System.Delegate.Combine(gift_attention_btn1.clickCallback, ClickCallback_gift_attention_btn as iGUIEventCallback);
	gift_attention_btn2.clickCallback = System.Delegate.Combine(gift_attention_btn2.clickCallback, ClickCallback_gift_attention_btn as iGUIEventCallback);
	gift_attention_btn3.clickCallback = System.Delegate.Combine(gift_attention_btn3.clickCallback, ClickCallback_gift_attention_btn as iGUIEventCallback);
	gift_attention_btn4.clickCallback = System.Delegate.Combine(gift_attention_btn4.clickCallback, ClickCallback_gift_attention_btn as iGUIEventCallback);
	gift_attention_btn5.clickCallback = System.Delegate.Combine(gift_attention_btn5.clickCallback, ClickCallback_gift_attention_btn as iGUIEventCallback);
	gift_visit_btn1.clickCallback = System.Delegate.Combine(gift_visit_btn1.clickCallback, ClickCallback_gift_visit_btn as iGUIEventCallback);
	gift_visit_btn2.clickCallback = System.Delegate.Combine(gift_visit_btn2.clickCallback, ClickCallback_gift_visit_btn as iGUIEventCallback);
	gift_visit_btn3.clickCallback = System.Delegate.Combine(gift_visit_btn3.clickCallback, ClickCallback_gift_visit_btn as iGUIEventCallback);
	gift_visit_btn4.clickCallback = System.Delegate.Combine(gift_visit_btn4.clickCallback, ClickCallback_gift_visit_btn as iGUIEventCallback);
	gift_visit_btn5.clickCallback = System.Delegate.Combine(gift_visit_btn5.clickCallback, ClickCallback_gift_visit_btn as iGUIEventCallback);
	one_key_btn.clickCallback = System.Delegate.Combine(one_key_btn.clickCallback, ClickCallback_one_key_btn as iGUIEventCallback);
	left_one_btn.clickCallback = System.Delegate.Combine(left_one_btn.clickCallback, ClickCallback_left_one_btn as iGUIEventCallback);
	right_one_btn.clickCallback = System.Delegate.Combine(right_one_btn.clickCallback, ClickCallback_right_one_btn as iGUIEventCallback);
	
	cof_close_btn.clickCallback = System.Delegate.Combine(cof_close_btn.clickCallback, ClickCallback_cof_close_btn as iGUIEventCallback);
	cof_ok_btn.clickCallback = System.Delegate.Combine(cof_ok_btn.clickCallback, ClickCallback_cof_ok_btn as iGUIEventCallback);
	cof_gift_icon.mouseOverCallback = System.Delegate.Combine(gift_icon1.mouseOverCallback, MouseOverCallback_cof_gift_icon as iGUIEventCallback);
	
	caf_close_btn.clickCallback = System.Delegate.Combine(caf_close_btn.clickCallback, ClickCallback_caf_close_btn as iGUIEventCallback);
	caf_ok_btn.clickCallback = System.Delegate.Combine(caf_ok_btn.clickCallback, ClickCallback_caf_ok_btn as iGUIEventCallback);
	// 其他事件注册
	Ctrl.Register("receive_gift_result", receiveGiftResult);
	Ctrl.Register("receive_gift_list_result", receiveGiftListResult);
	Ctrl.Register("receive_gift_record_result", receiveGiftRecordResult);
	// 初始操作
	_init();
}

function OnDestroy()
{
	// 取消事件注册
	Ctrl.Unregister("receive_gift_result", receiveGiftResult);
	Ctrl.Unregister("receive_gift_list_result", receiveGiftListResult);
	Ctrl.Unregister("receive_gift_record_result", receiveGiftRecordResult);
	// 清除操作
	_clear();
}



/***************************************************
*** 界面事件回调
***************************************************/


//--------------------------------------------------
// 点击关闭按钮
function ClickCallback_close_btn(caller : iGUIElement)
{
	Ctrl.Excute("close_gift_receive_ui", true);
	if(!DataCenter.isInSelfHouse()){
		Ctrl.Set("open_select_ui", true);
		Ctrl.Excute("open_gift_make_ui", true);
	}
}
//--------------------------------------------------
// 点击礼物清单按钮
function ClickCallback_gift_list_btn(caller : iGUIElement)
{
	if (true == caller.userData)
		return;
	
	_changeToGiftList();
}
//--------------------------------------------------
// 点击收礼记录按钮
function ClickCallback_gift_record_btn(caller : iGUIElement)
{	
	if (true == caller.userData)
		return;
	
	_changeToGiftRecord();
}
//--------------------------------------------------
// 鼠标移到礼物选项上
function MouseOverCallback_gift_icon(caller : iGUIElement)
{
	for (var slot : GiftItemSlot in mSlotArray)
	{
		if (slot.getImage() == caller)
		{
			slot.showTooltip();
		}
	}
}
//--------------------------------------------------
// 点击礼物按钮
function ClickCallback_gift_btn(caller : iGUIElement)
{
	mCurReceiveGift = _getGiftInfoByBtn(caller);
	if (true == caller.userData)	// 回礼
	{
		Ctrl.Set("receive_account", mCurReceiveGift.sender);
		Ctrl.Excute("close_gift_receive_ui", true);
		Ctrl.Excute("close_gift_make_ui", true);
		Ctrl.Set("open_select_ui", false);
		Ctrl.Excute("open_gift_make_ui", true);
	}
	else	// 收礼
	{
		frame.passive = true;
		collect_one_frame.setEnabled(true);
		// 设置控件
		var it : ItemRow = ResManager.LgtMgr.getItemRow(mCurReceiveGift.gift.template_id);
		var sender : String  = Global.limitTextLength(DataCenter.getPlayerName(mCurReceiveGift.sender), 6, Define.unknow, "...");
		cof_gift_describe.label.text = Define.getContent(5149, [sender]);
		if (null == mCollectOneAsynIcon)
		{
			mCollectOneAsynIcon = new AsynIcon(setCollectOneIcon, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
		}
		mCollectOneAsynIcon.load("Icon/" + it.icon);
	}
}
//--------------------------------------------------
// 点击关注按钮
function ClickCallback_gift_attention_btn(caller : iGUIElement)
{
	var gi : gift_info = _getGiftInfoByAttentionBtn(caller);
	FollowLogic.GetInstance().AddAttention(gi.sender);
}
//--------------------------------------------------
// 点击拜访按钮
function ClickCallback_gift_visit_btn(caller : iGUIElement)
{
	Ctrl.Excute("close_gift_receive_ui", true);
	var gi : gift_info = _getGiftInfoByVisitBtn(caller);
	FollowLogic.GetInstance().Visit(gi.sender);
}
//--------------------------------------------------
// 点击一键收礼按钮
function ClickCallback_one_key_btn(caller : iGUIElement)
{
	frame.passive = true;
	collect_all_frame.setEnabled(true);
}
//--------------------------------------------------
// 点击向左翻页按钮
function ClickCallback_left_one_btn(caller : iGUIElement)
{
	if (mCurGiftPage.prePage())
	{
		_refreshGiftItem();
	}
}
//--------------------------------------------------
// 点击向右翻页按钮
function ClickCallback_right_one_btn(caller : iGUIElement)
{
	if (mCurGiftPage.nextPage())
	{
		_refreshGiftItem();
	}
}
//--------------------------------------------------
// 点击关闭按钮
function ClickCallback_cof_close_btn(caller : iGUIElement)
{
	collect_one_frame.setEnabled(false);
	frame.passive = false;
	// 重置控件
	mCurReceiveGift = null;
	if (mCollectOneAsynIcon)
	{
		mCollectOneAsynIcon.cancel();
	}
	cof_gift_describe.label.text = "";
}
//--------------------------------------------------
// 点击确认收礼按钮
function ClickCallback_cof_ok_btn(caller : iGUIElement)
{
	var arr : Array = new Array();
	arr.Add(mCurReceiveGift.gift_id);
	GiftLogic.getInstance().request_receive_gift(arr);
}
//--------------------------------------------------
// 鼠标移到礼物选项上
function MouseOverCallback_cof_gift_icon(caller : iGUIElement)
{
	if (null == mCurReceiveGift)
		return;
	
	var it : ItemRow = ResManager.LgtMgr.getItemRow(mCurReceiveGift.gift.template_id);
	
	var style : GUIStyle = new GUIStyle(); 	
	style.alignment = TextAnchor.MiddleCenter;
	style.normal.textColor = Color(1.0f, 1.0f, 1.0f);
	style.fontStyle = FontStyle.Bold;
	Global.SysTooltip.Begin(caller);
	Global.SysTooltip.Add(GUIContent(it.name), style); 	
	Global.SysTooltip.Show(true);
}
//--------------------------------------------------
// 点击关按钮
function ClickCallback_caf_close_btn(caller : iGUIElement)
{
	collect_all_frame.setEnabled(false);
	frame.passive = false;
}
//--------------------------------------------------
// 点击确认一键收礼按钮
function ClickCallback_caf_ok_btn(caller : iGUIElement)
{
	ClickCallback_caf_close_btn(null);
	var arr : Array = new Array();
	for (var gi : gift_info in mCurGiftPage.getUseArray())
	{
		arr.Add(gi.gift_id);
	}
	GiftLogic.getInstance().request_receive_gift(arr);
}



/***************************************************
*** 界面逻辑
***************************************************/
private var Ctrl : Controller = GiftLogic.Ctrl;
private var SLOT_NUM : int = 5;				// 每页的显示个数
private var GIFT_MAX : int = 30;			// 礼物可显示的最大数
private var mSlotArray : Array = new Array();
private var mCurGiftPage : GiftItemPage = null;
private var mGiftListPage : GiftItemPage = new GiftItemPage(GiftLogic.GiftListArray, 30, SLOT_NUM);
private var mGiftRecordPage : GiftItemPage = new GiftItemPage(GiftLogic.GiftRecordArray, 0, SLOT_NUM);
private var mCurReceiveGift : gift_info = null;		// 当前要收取的礼物
private var mCollectOneAsynIcon : AsynIcon = null;	// 收取单个礼物的异步图标
private var mTabPageFlag : int = 1;					// 标签页(1.礼物清单标签页,2.收礼记录标签页)


//--------------------------------------------------
// 初始
private function _init() : void
{
	frame.setEnabled(true);
	collect_one_frame.setEnabled(false);
	collect_all_frame.setEnabled(false);
	// 
	for (var i:int=0; i<SLOT_NUM; ++i)
	{
		var element = _getGiftItem(i);
		mSlotArray.Add(new GiftItemSlot(element[1], element[2], element[3]));
	}
	_changeToGiftList();
}
//--------------------------------------------------
// 清除
private function _clear() : void
{
	_clearGiftItem();
	mSlotArray.Clear();
	if (mCollectOneAsynIcon)
	{
		mCollectOneAsynIcon.cancel();
	}
	mCollectOneAsynIcon = null;
	mCurGiftPage = null;
	mGiftListPage = null;
	mGiftRecordPage = null;
	mCurReceiveGift = null;
}
//--------------------------------------------------
// 转换到礼物清单
private function _changeToGiftList()
{
	// 设置一些控件
	_activeTag(gift_list_btn, true);
	_activeTag(gift_record_btn, false);
	_changeGiftBtnState(false);
	one_key_btn.setEnabled(false);
	tip_label.setEnabled(false);
	// 清除
	_clearGiftItem();
	// 
	mTabPageFlag = 1;
	GiftLogic.getInstance().request_receive_gift_list();
}
//--------------------------------------------------
// 转换到收礼记录
private function _changeToGiftRecord()
{
	// 设置一些控件
	_activeTag(gift_record_btn, true);
	_activeTag(gift_list_btn, false);
	_changeGiftBtnState(true);
	one_key_btn.setEnabled(false);
	tip_label.setEnabled(false);
	// 清除
	_clearGiftItem();
	// 
	mTabPageFlag = 2;
	GiftLogic.getInstance().request_received_gift_list();
}
//--------------------------------------------------
// 激活按钮
private function _activeTag(tag : iGUIButton, active : boolean) : void
{
	tag.userData = active;
	var state_image = getTagIcon(tag);
	var normal : String = "UISkins/Textures/gift/" + state_image[0];
	var hover : String = "UISkins/Textures/gift/" + state_image[1];
	var push : String = "UISkins/Textures/gift/" + state_image[2];
	if (active)
	{
		tag.style.normal.background = Resources.Load(push);
		tag.style.hover.background = Resources.Load(push);
		tag.style.active.background = Resources.Load(push);
	}
	else
	{
		tag.style.normal.background = Resources.Load(normal);
		tag.style.hover.background = Resources.Load(hover);
		tag.style.active.background = Resources.Load(push);
	}
}
//--------------------------------------------------
// 获取标签图标
private function getTagIcon(tag : iGUIButton) : String[]
{
	if (gift_list_btn == tag) return ["giftlist_n", "giftlist_h", "giftlist_p"];
	// gift_record_btn == tag
	return ["giftlog_n", "giftlog_h", "giftlog_p"];
}
//--------------------------------------------------
// 改变礼物按钮状态
private function _changeGiftBtnState(make_gift : boolean)
{
	for (var i:int=0; i<SLOT_NUM; ++i)
	{
		var element = _getGiftItem(i);
		_changeGiftBtn(element[4], make_gift);
	}
}
//--------------------------------------------------
// 改变礼物按钮
private function _changeGiftBtn(btn : iGUIButton, make_gift : boolean)
{
	if (make_gift)	// 回礼状态
	{
		btn.style.normal.background = Resources.Load("UISkins/Textures/gift/huizengliwu");
		btn.style.hover.background = Resources.Load("UISkins/Textures/gift/huizengliwu_hover");
		btn.style.active.background = Resources.Load("UISkins/Textures/gift/huizengliwu");
		btn.userData = true;
	}
	else	// 收礼状态
	{
		btn.style.normal.background = Resources.Load("UISkins/Textures/gift/shouquliwu");
		btn.style.hover.background = Resources.Load("UISkins/Textures/gift/shouquliwu_hover");
		btn.style.active.background = Resources.Load("UISkins/Textures/gift/shouquliwu");
		btn.userData = false;
	}
}
//--------------------------------------------------
// 获取礼物控件
private function _getGiftItem(index : int)
{
	if (0 == index) return [gift_item1, gift_icon1, gift_date1, gift_describe1, gift_btn1, gift_attention_btn1, gift_visit_btn1];
	if (1 == index) return [gift_item2, gift_icon2, gift_date2, gift_describe2, gift_btn2, gift_attention_btn2, gift_visit_btn2];
	if (2 == index) return [gift_item3, gift_icon3, gift_date3, gift_describe3, gift_btn3, gift_attention_btn3, gift_visit_btn3];
	if (3 == index) return [gift_item4, gift_icon4, gift_date4, gift_describe4, gift_btn4, gift_attention_btn4, gift_visit_btn4];
	
	return [gift_item5, gift_icon5, gift_date5, gift_describe5, gift_btn5, gift_attention_btn5, gift_visit_btn5];
}
//--------------------------------------------------
// 根据礼物按钮获取礼物信息
private function _getGiftInfoByBtn(btn : iGUIButton) : gift_info
{
	var index : int = 4;
	if (gift_btn1 == btn)	index = 0;
	if (gift_btn2 == btn)	index = 1;
	if (gift_btn3 == btn)	index = 2;
	if (gift_btn4 == btn)	index = 3;
	
	return (mSlotArray[index] as GiftItemSlot).gift;
}
//--------------------------------------------------
// 根据关注按钮获取礼物信息
private function _getGiftInfoByAttentionBtn(btn : iGUIButton) : gift_info
{
	var index : int = 4;
	if (gift_attention_btn1 == btn)	index = 0;
	if (gift_attention_btn2 == btn)	index = 1;
	if (gift_attention_btn3 == btn)	index = 2;
	if (gift_attention_btn4 == btn)	index = 3;
	
	return (mSlotArray[index] as GiftItemSlot).gift;
}
//--------------------------------------------------
// 根据摆放按钮获取礼物信息
private function _getGiftInfoByVisitBtn(btn : iGUIButton) : gift_info
{
	var index : int = 4;
	if (gift_visit_btn1 == btn)	index = 0;
	if (gift_visit_btn2 == btn)	index = 1;
	if (gift_visit_btn3 == btn)	index = 2;
	if (gift_visit_btn4 == btn)	index = 3;
	
	return (mSlotArray[index] as GiftItemSlot).gift;
}
//--------------------------------------------------
// 清除
private function _clearGiftItem()
{
	for (var i:int=0; i<SLOT_NUM; ++i)
	{
		var element = _getGiftItem(i);
		element[0].setEnabled(false);
	}
	for (var slot : GiftItemSlot in mSlotArray)
	{
		slot.setContent(null, "", "", 1, "");
	}
}
//--------------------------------------------------
// 刷新列表
private function _refreshGiftItem()
{
	// 清除
	_clearGiftItem();
	// 设置当前页的内容
	var arr : Array = mCurGiftPage.getCurPage();
	for (var i:int=0; i<arr.Count; ++i)
	{
		var element = _getGiftItem(i);
		element[0].setEnabled(true);
		// 设置控件内容
		var gi : gift_info = arr[i];
		var icon_name = _getIconAndName(gi, mTabPageFlag);
		var date : String = _getDateText(gi.date, 1);
		(mSlotArray[i] as GiftItemSlot).setContent(gi, icon_name[0], date, element[4].userData ? 1 : 2, icon_name[1]);
	}
	// 设置页数
	page_label.label.text = mCurGiftPage.getCurPageNum().ToString() + "/" + mCurGiftPage.getTotalPageNum().ToString();
}
//--------------------------------------------------
// 收礼结果
function receiveGiftResult(param : System.Object)
{
	// param:1.成功,2.失败
	ClickCallback_cof_close_btn(null);
	if (2 == param)
	{
		UI.getUI().OpenMsgbox("", Define.getContent(5150), true);
		return;
	}
	GiftLogic.getInstance().request_receive_gift_list();
}
//--------------------------------------------------
// 礼物清单
function receiveGiftListResult(param : System.Object)
{
	mCurGiftPage = mGiftListPage;
	mCurGiftPage.refresh();
	mCurGiftPage.firstPage();
	_refreshGiftItem();
	// 显示/隐藏一键收取按钮
	if (mCurGiftPage.getCurPage().Count > 0)
	{
		one_key_btn.setEnabled(true);
		tip_label.setEnabled(true);
	}
}
//--------------------------------------------------
// 收礼记录
function receiveGiftRecordResult(param : System.Object)
{
	mCurGiftPage = mGiftRecordPage;
	mCurGiftPage.refresh();
	mCurGiftPage.firstPage();
	_refreshGiftItem();
}
//--------------------------------------------------
// 回调
function setCollectOneIcon(tex : Texture)
{
	cof_gift_icon.style.normal.background = tex;
}
//--------------------------------------------------
// 获取图片和名字
private function _getIconAndName(gi : gift_info, tab : int)
{
	var icon : String = "";
	var name : String = "";
	if (1 == tab)		// 礼物清单
	{
		var gbr : GiftBoxRow = ResManager.LgtMgr.GiftBoxTable[gi.gift_box];
		icon = gbr.icon;
		name = gbr.name;
	}
	else if (2 == tab)	// 收礼记录
	{
		var ir : ItemRow = ResManager.LgtMgr.getItemRow(gi.gift.template_id);
		icon = ir.icon;
		name = ir.name;
	}
	return [icon, name];
}
//--------------------------------------------------
// 获取日期文本
private function _getDateText(date : stime, state : int) : String
{
	var text : String = "";
	if (1 == state)
	{
		text = date.year + "-" + date.month + "-" + date.day + "  " + date.hour + ":" + date.minute + ":" + date.second;
	}
	return text;
}


