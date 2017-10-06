#pragma strict
#pragma downcast
import iGUI;

private static var instance : iGUICode_PropShopUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var uf_title_label : iGUILabel;
// 道具使用界面
@HideInInspector
var uf_cancel_btn : iGUIButton;
@HideInInspector
var uf_use_btn : iGUIButton;
@HideInInspector
var uf_tip_label1 : iGUILabel;
@HideInInspector
var uf_icon_label : iGUILabel;
@HideInInspector
var uf_close_btn : iGUIButton;
@HideInInspector
var use_frame : iGUIPanel;
// 支付界面
@HideInInspector
var bf_cancel_btn : iGUIButton;
@HideInInspector
var bf_buy_btn : iGUIButton;
@HideInInspector
var bf_cost_text_label : iGUILabel;
@HideInInspector
var bf_cost_icon_label : iGUILabel;
@HideInInspector
var bf_tip_label2 : iGUILabel;
@HideInInspector
var bf_count_low_label : iGUILabel;
@HideInInspector
var bf_count_high_label : iGUILabel;
@HideInInspector
var bf_count_minus_btn : iGUIButton;
@HideInInspector
var bf_count_add_btn : iGUIButton;
@HideInInspector
var bf_item_name_label : iGUILabel;
@HideInInspector
var bf_item_icon_label : iGUILabel;
@HideInInspector
var bf_item_panel : iGUIPanel;
@HideInInspector
var bf_tip_label1 : iGUILabel;
@HideInInspector
var bf_close_btn : iGUIButton;
@HideInInspector
var buy_frame : iGUIPanel;
// 道具商城主界面
@HideInInspector
var item_buy_btn16 : iGUIButton;
@HideInInspector
var item_wish_btn16 : iGUIButton;
@HideInInspector
var item_spec_text_label16 : iGUILabel;
@HideInInspector
var item_spec_icon_label16 : iGUILabel;
@HideInInspector
var item_cost_text_label16 : iGUILabel;
@HideInInspector
var item_cost_icon_label16 : iGUILabel;
@HideInInspector
var item_icon_label16 : iGUILabel;
@HideInInspector
var item_name_label16 : iGUILabel;
@HideInInspector
var item_panel16 : iGUIPanel;
@HideInInspector
var item_buy_btn15 : iGUIButton;
@HideInInspector
var item_wish_btn15 : iGUIButton;
@HideInInspector
var item_spec_text_label15 : iGUILabel;
@HideInInspector
var item_spec_icon_label15 : iGUILabel;
@HideInInspector
var item_cost_text_label15 : iGUILabel;
@HideInInspector
var item_cost_icon_label15 : iGUILabel;
@HideInInspector
var item_icon_label15 : iGUILabel;
@HideInInspector
var item_name_label15 : iGUILabel;
@HideInInspector
var item_panel15 : iGUIPanel;
@HideInInspector
var item_buy_btn14 : iGUIButton;
@HideInInspector
var item_wish_btn14 : iGUIButton;
@HideInInspector
var item_spec_text_label14 : iGUILabel;
@HideInInspector
var item_spec_icon_label14 : iGUILabel;
@HideInInspector
var item_cost_text_label14 : iGUILabel;
@HideInInspector
var item_cost_icon_label14 : iGUILabel;
@HideInInspector
var item_icon_label14 : iGUILabel;
@HideInInspector
var item_name_label14 : iGUILabel;
@HideInInspector
var item_panel14 : iGUIPanel;
@HideInInspector
var item_buy_btn13 : iGUIButton;
@HideInInspector
var item_wish_btn13 : iGUIButton;
@HideInInspector
var item_spec_text_label13 : iGUILabel;
@HideInInspector
var item_spec_icon_label13 : iGUILabel;
@HideInInspector
var item_cost_text_label13 : iGUILabel;
@HideInInspector
var item_cost_icon_label13 : iGUILabel;
@HideInInspector
var item_icon_label13 : iGUILabel;
@HideInInspector
var item_name_label13 : iGUILabel;
@HideInInspector
var item_panel13 : iGUIPanel;
@HideInInspector
var item_buy_btn12 : iGUIButton;
@HideInInspector
var item_wish_btn12 : iGUIButton;
@HideInInspector
var item_spec_text_label12 : iGUILabel;
@HideInInspector
var item_spec_icon_label12 : iGUILabel;
@HideInInspector
var item_cost_text_label12 : iGUILabel;
@HideInInspector
var item_cost_icon_label12 : iGUILabel;
@HideInInspector
var item_icon_label12 : iGUILabel;
@HideInInspector
var item_name_label12 : iGUILabel;
@HideInInspector
var item_panel12 : iGUIPanel;
@HideInInspector
var item_buy_btn11 : iGUIButton;
@HideInInspector
var item_wish_btn11 : iGUIButton;
@HideInInspector
var item_spec_text_label11 : iGUILabel;
@HideInInspector
var item_spec_icon_label11 : iGUILabel;
@HideInInspector
var item_cost_text_label11 : iGUILabel;
@HideInInspector
var item_cost_icon_label11 : iGUILabel;
@HideInInspector
var item_icon_label11 : iGUILabel;
@HideInInspector
var item_name_label11 : iGUILabel;
@HideInInspector
var item_panel11 : iGUIPanel;
@HideInInspector
var item_buy_btn10 : iGUIButton;
@HideInInspector
var item_wish_btn10 : iGUIButton;
@HideInInspector
var item_spec_text_label10 : iGUILabel;
@HideInInspector
var item_spec_icon_label10 : iGUILabel;
@HideInInspector
var item_cost_text_label10 : iGUILabel;
@HideInInspector
var item_cost_icon_label10 : iGUILabel;
@HideInInspector
var item_icon_label10 : iGUILabel;
@HideInInspector
var item_name_label10 : iGUILabel;
@HideInInspector
var item_panel10 : iGUIPanel;
@HideInInspector
var item_buy_btn9 : iGUIButton;
@HideInInspector
var item_wish_btn9 : iGUIButton;
@HideInInspector
var item_spec_text_label9 : iGUILabel;
@HideInInspector
var item_spec_icon_label9 : iGUILabel;
@HideInInspector
var item_cost_text_label9 : iGUILabel;
@HideInInspector
var item_cost_icon_label9 : iGUILabel;
@HideInInspector
var item_icon_label9 : iGUILabel;
@HideInInspector
var item_name_label9 : iGUILabel;
@HideInInspector
var item_panel9 : iGUIPanel;
@HideInInspector
var item_buy_btn8 : iGUIButton;
@HideInInspector
var item_wish_btn8 : iGUIButton;
@HideInInspector
var item_spec_text_label8 : iGUILabel;
@HideInInspector
var item_spec_icon_label8 : iGUILabel;
@HideInInspector
var item_cost_text_label8 : iGUILabel;
@HideInInspector
var item_cost_icon_label8 : iGUILabel;
@HideInInspector
var item_icon_label8 : iGUILabel;
@HideInInspector
var item_name_label8 : iGUILabel;
@HideInInspector
var item_panel8 : iGUIPanel;
@HideInInspector
var item_buy_btn7 : iGUIButton;
@HideInInspector
var item_wish_btn7 : iGUIButton;
@HideInInspector
var item_spec_text_label7 : iGUILabel;
@HideInInspector
var item_spec_icon_label7 : iGUILabel;
@HideInInspector
var item_cost_text_label7 : iGUILabel;
@HideInInspector
var item_cost_icon_label7 : iGUILabel;
@HideInInspector
var item_icon_label7 : iGUILabel;
@HideInInspector
var item_name_label7 : iGUILabel;
@HideInInspector
var item_panel7 : iGUIPanel;
@HideInInspector
var item_buy_btn6 : iGUIButton;
@HideInInspector
var item_wish_btn6 : iGUIButton;
@HideInInspector
var item_spec_text_label6 : iGUILabel;
@HideInInspector
var item_spec_icon_label6 : iGUILabel;
@HideInInspector
var item_cost_text_label6 : iGUILabel;
@HideInInspector
var item_cost_icon_label6 : iGUILabel;
@HideInInspector
var item_icon_label6 : iGUILabel;
@HideInInspector
var item_name_label6 : iGUILabel;
@HideInInspector
var item_panel6 : iGUIPanel;
@HideInInspector
var item_buy_btn5 : iGUIButton;
@HideInInspector
var item_wish_btn5 : iGUIButton;
@HideInInspector
var item_spec_text_label5 : iGUILabel;
@HideInInspector
var item_spec_icon_label5 : iGUILabel;
@HideInInspector
var item_cost_text_label5 : iGUILabel;
@HideInInspector
var item_cost_icon_label5 : iGUILabel;
@HideInInspector
var item_icon_label5 : iGUILabel;
@HideInInspector
var item_name_label5 : iGUILabel;
@HideInInspector
var item_panel5 : iGUIPanel;
@HideInInspector
var item_buy_btn4 : iGUIButton;
@HideInInspector
var item_wish_btn4 : iGUIButton;
@HideInInspector
var item_spec_text_label4 : iGUILabel;
@HideInInspector
var item_spec_icon_label4 : iGUILabel;
@HideInInspector
var item_cost_text_label4 : iGUILabel;
@HideInInspector
var item_cost_icon_label4 : iGUILabel;
@HideInInspector
var item_icon_label4 : iGUILabel;
@HideInInspector
var item_name_label4 : iGUILabel;
@HideInInspector
var item_panel4 : iGUIPanel;
@HideInInspector
var item_buy_btn3 : iGUIButton;
@HideInInspector
var item_wish_btn3 : iGUIButton;
@HideInInspector
var item_spec_text_label3 : iGUILabel;
@HideInInspector
var item_spec_icon_label3 : iGUILabel;
@HideInInspector
var item_cost_text_label3 : iGUILabel;
@HideInInspector
var item_cost_icon_label3 : iGUILabel;
@HideInInspector
var item_icon_label3 : iGUILabel;
@HideInInspector
var item_name_label3 : iGUILabel;
@HideInInspector
var item_panel3 : iGUIPanel;
@HideInInspector
var item_buy_btn2 : iGUIButton;
@HideInInspector
var item_wish_btn2 : iGUIButton;
@HideInInspector
var item_spec_text_label2 : iGUILabel;
@HideInInspector
var item_spec_icon_label2 : iGUILabel;
@HideInInspector
var item_cost_text_label2 : iGUILabel;
@HideInInspector
var item_cost_icon_label2 : iGUILabel;
@HideInInspector
var item_icon_label2 : iGUILabel;
@HideInInspector
var item_name_label2 : iGUILabel;
@HideInInspector
var item_panel2 : iGUIPanel;
@HideInInspector
var item_buy_btn1 : iGUIButton;
@HideInInspector
var item_wish_btn1 : iGUIButton;
@HideInInspector
var item_spec_text_label1 : iGUILabel;
@HideInInspector
var item_spec_icon_label1 : iGUILabel;
@HideInInspector
var item_cost_text_label1 : iGUILabel;
@HideInInspector
var item_cost_icon_label1 : iGUILabel;
@HideInInspector
var item_icon_label1 : iGUILabel;
@HideInInspector
var item_name_label1 : iGUILabel;
@HideInInspector
var item_panel1 : iGUIPanel;
@HideInInspector
var dredge_btn : iGUIButton;
@HideInInspector
var page_text_label : iGUILabel;
@HideInInspector
var right_one_btn : iGUIButton;
@HideInInspector
var left_one_btn : iGUIButton;
@HideInInspector
var first_page_btn : iGUIButton;
@HideInInspector
var tip_label2 : iGUILabel;
@HideInInspector
var recharge_btn : iGUIButton;
@HideInInspector
var tip_label1 : iGUILabel;
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
var new_tab_btn : iGUIButton;
@HideInInspector
var title_label : iGUILabel;
@HideInInspector
var background : iGUILabel;
@HideInInspector
var close_btn : iGUIButton;
@HideInInspector
var frame : iGUIPanel;
@HideInInspector
var root : iGUIRoot;



//--------------------------------------------------
function Start()
{
	// 商城界面事件注册
	close_btn.clickCallback = System.Delegate.Combine(close_btn.clickCallback, ClickCallback_close_btn as iGUIEventCallback);
	first_page_btn.clickCallback = System.Delegate.Combine(first_page_btn.clickCallback, ClickCallback_first_page_btn as iGUIEventCallback);
	left_one_btn.clickCallback = System.Delegate.Combine(left_one_btn.clickCallback, ClickCallback_left_one_btn as iGUIEventCallback);
	right_one_btn.clickCallback = System.Delegate.Combine(right_one_btn.clickCallback, ClickCallback_right_one_btn as iGUIEventCallback);
	new_tab_btn.clickCallback = System.Delegate.Combine(new_tab_btn.clickCallback, ClickCallback_new_tab_btn as iGUIEventCallback);
	tab_btn1.clickCallback = System.Delegate.Combine(tab_btn1.clickCallback, ClickCallback_tab_btn1 as iGUIEventCallback);
	tab_btn2.clickCallback = System.Delegate.Combine(tab_btn2.clickCallback, ClickCallback_tab_btn2 as iGUIEventCallback);
	tab_btn3.clickCallback = System.Delegate.Combine(tab_btn3.clickCallback, ClickCallback_tab_btn3 as iGUIEventCallback);
	tab_btn4.clickCallback = System.Delegate.Combine(tab_btn4.clickCallback, ClickCallback_tab_btn4 as iGUIEventCallback);
	tab_btn5.clickCallback = System.Delegate.Combine(tab_btn5.clickCallback, ClickCallback_tab_btn5 as iGUIEventCallback);
	tab_btn6.clickCallback = System.Delegate.Combine(tab_btn6.clickCallback, ClickCallback_tab_btn6 as iGUIEventCallback);
	tab_btn7.clickCallback = System.Delegate.Combine(tab_btn7.clickCallback, ClickCallback_tab_btn7 as iGUIEventCallback);
	tab_btn8.clickCallback = System.Delegate.Combine(tab_btn8.clickCallback, ClickCallback_tab_btn8 as iGUIEventCallback);
	recharge_btn.clickCallback = System.Delegate.Combine(recharge_btn.clickCallback, ClickCallback_recharge_btn as iGUIEventCallback);
	dredge_btn.clickCallback = System.Delegate.Combine(dredge_btn.clickCallback, ClickCallback_dredge_btn as iGUIEventCallback);
	// 购买界面事件注册
	bf_close_btn.clickCallback = System.Delegate.Combine(bf_close_btn.clickCallback, ClickCallback_bf_close_btn as iGUIEventCallback);
	bf_buy_btn.clickCallback = System.Delegate.Combine(bf_buy_btn.clickCallback, ClickCallback_bf_buy_btn as iGUIEventCallback);
	bf_cancel_btn.clickCallback = System.Delegate.Combine(bf_cancel_btn.clickCallback, ClickCallback_bf_cancel_btn as iGUIEventCallback);
	bf_count_add_btn.clickCallback = System.Delegate.Combine(bf_count_add_btn.clickCallback, ClickCallback_bf_count_add_btn as iGUIEventCallback);
	bf_count_minus_btn.clickCallback = System.Delegate.Combine(bf_count_minus_btn.clickCallback, ClickCallback_bf_count_minus_btn as iGUIEventCallback);
	bf_item_icon_label.mouseOverCallback = System.Delegate.Combine(bf_item_icon_label.mouseOverCallback, ClickCallback_bf_item_icon_label as iGUIEventCallback);
	// 使用界面事件注册
	uf_close_btn.clickCallback = System.Delegate.Combine(uf_close_btn.clickCallback, ClickCallback_uf_close_btn as iGUIEventCallback);
	uf_use_btn.clickCallback = System.Delegate.Combine(uf_use_btn.clickCallback, ClickCallback_uf_use_btn as iGUIEventCallback);
	uf_cancel_btn.clickCallback = System.Delegate.Combine(uf_cancel_btn.clickCallback, ClickCallback_uf_cancel_btn as iGUIEventCallback);
	// 其他事件注册
	Ctrl.Register("buy_prop_result", buyPropResult);
	Ctrl.Register("close_prop_use_ui", closeUseUI);
	// 初始操作
	_init();
}

function OnDestroy()
{
	// 取消事件注册
	Ctrl.Unregister("buy_prop_result", buyPropResult);
	Ctrl.Unregister("close_prop_use_ui", closeUseUI);
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
	Ctrl.Excute("close_prop_shop_ui", null);
}
//--------------------------------------------------
// 点击首页按钮
function ClickCallback_first_page_btn(caller : iGUIElement)
{
	if (mCurTabPage.firstPage())
	{
		_refreshItems();
	}
}
//--------------------------------------------------
// 点击左翻页按钮
function ClickCallback_left_one_btn(caller : iGUIElement)
{
	if (mCurTabPage.prePage())
	{
		_refreshItems();
	}
}
//--------------------------------------------------
// 点击右翻页按钮
function ClickCallback_right_one_btn(caller : iGUIElement)
{
	if (mCurTabPage.nextPage())
	{
		_refreshItems();
	}
}
//--------------------------------------------------
// 点击新品按钮
function ClickCallback_new_tab_btn(caller : iGUIElement)
{
	if (true == caller.userData)
		return;
	
	_changeToNewTab();
}
//--------------------------------------------------
// 点击道具按钮
function ClickCallback_tab_btn1(caller : iGUIElement)
{
	if (true == caller.userData)
		return;
	
	_changeToPropTab();
}
//--------------------------------------------------
// 点击标签按钮2
function ClickCallback_tab_btn2(caller : iGUIElement)
{
	if (true == caller.userData)
		return;
	
	_changeToClothesGiftTab();
}
//--------------------------------------------------
// 点击标签按钮3
function ClickCallback_tab_btn3(caller : iGUIElement)
{
	if (true == caller.userData)
		return;
	
	_changeToFurnitureTab();
}
//--------------------------------------------------
// 点击标签按钮4
function ClickCallback_tab_btn4(caller : iGUIElement)
{
	if (true == caller.userData)
		return;
	
	_changeToComposePaperTab();
}
//--------------------------------------------------
// 点击标签按钮5
function ClickCallback_tab_btn5(caller : iGUIElement)
{
	if (true == caller.userData)
		return;
	
	_changeToComposeMaterialTab();
}
//--------------------------------------------------
// 点击标签按钮6
function ClickCallback_tab_btn6(caller : iGUIElement)
{
	if (true == caller.userData)
		return;
	
	_changeToSeedTab();
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
// 点击充值按钮
function ClickCallback_recharge_btn(caller : iGUIElement)
{
	DiamondLogic.GetInstance().OpenRecharge();
}
//--------------------------------------------------
// 点击开通黄钻按钮
function ClickCallback_dredge_btn(caller : iGUIElement)
{
	QQHomeLogic.GetInstance().OpenQQHome();
	// 这个函数用来生成灯光数据(给策划用)
	if (RuntimePlatform.WindowsEditor == Application.platform)
	{
		var writer : HouseEditorWritter = new HouseEditorWritter("lights");
		writer.createLightXml();
	}
}
//--------------------------------------------------
// 点击购买界面关闭按钮
function ClickCallback_bf_close_btn(caller : iGUIElement)
{
	_closeBuyUI();
}
//--------------------------------------------------
// 点击购买界面购买按钮
function ClickCallback_bf_buy_btn(caller : iGUIElement)
{
	if (money_type.mt_diamond == mBuyItemSlot.ShopCenterInfo.money_type)
	{
		CallbackOk(null);
		return;
	}
	var msg : SysMsgRow = Global.GetSysMsgHandler().getSysMsgRow(531);
	var content : String = msg.msg_content.Replace("{0}", (mBuyItemSlot.ShopCenterInfo.price * mBuyItemCount).ToString());
	content = content.Replace("{1}", mBuyItemSlot.ItemInfo.name);
	UI.getUI().OpenMsgbox("", content, Define.ok, CallbackOk, Define.cancel, CallbackCancel);
}
//--------------------------------------------------
function CallbackOk(caller : iGUIElement)
{
	SelfItemLogic.ReqBuySysShopGoods(mBuyItemSlot.ShopCenterInfo.goods_id, mBuyItemCount);
}
//--------------------------------------------------
function CallbackCancel(caller : iGUIElement)
{
}
//--------------------------------------------------
// 点击购买界面取消按钮
function ClickCallback_bf_cancel_btn(caller : iGUIElement)
{
	_closeBuyUI();
}
//--------------------------------------------------
// 点击购买界面增加数量按钮
function ClickCallback_bf_count_add_btn(caller : iGUIElement)
{
	if (!_controlClickBuyCountBtnTime() || mBuyItemCount >= BUY_MAX_COUNT)
		return;
	
	_setBuyCountLabel(++mBuyItemCount);
}
//--------------------------------------------------
// 点击购买界面减少数量按钮
function ClickCallback_bf_count_minus_btn(caller : iGUIElement)
{
	if (!_controlClickBuyCountBtnTime() || mBuyItemCount <= 1)
		return;
	
	_setBuyCountLabel(--mBuyItemCount);
}
//--------------------------------------------------
// 鼠标移到购买界面3物品图标上
function ClickCallback_bf_item_icon_label(caller : iGUIElement)
{
	var style : GUIStyle = new GUIStyle();
	style.alignment = TextAnchor.MiddleCenter;
	style.normal.textColor = Color(1.0f, 1.0f, 1.0f);
	style.fontStyle = FontStyle.Bold;
	Global.SysTooltip.Begin(caller);
	Global.SysTooltip.Add(GUIContent(mBuyItemSlot.ItemInfo.name), style); 	
	Global.SysTooltip.Show(true);
}
//--------------------------------------------------
// 点击使用界面关闭按钮
function ClickCallback_uf_close_btn(caller : iGUIElement)
{
	closeUseUI(null);
}
//--------------------------------------------------
// 点击使用界面使用按钮
function ClickCallback_uf_use_btn(caller : iGUIElement)
{
	PropUseLogic.request_use_item(mPropUseItem._item._instanceID, new Array());
}
//--------------------------------------------------
// 点击使用界面取消按钮
function ClickCallback_uf_cancel_btn(caller : iGUIElement)
{
	closeUseUI(null);
}
//--------------------------------------------------





/***************************************************
*** 界面逻辑
***************************************************/
private var Ctrl : Controller = PropShopLogic.Ctrl;
private var SLOT_NUM : int = 16;					// 每页的显示个数
private var mSlotArray : Array = new Array();
private var mCurTabPage : PropShopPage = null;		// 当前标签
private var mBuyItemSlot : PropShopSlot = null;		// 当前要购买的物品
private var BUY_MAX_COUNT : int = 99;				// 购买上限
private var mBuyItemCount : int = 1;				// 当前要购买的物品数量
private var mBuyAsynIcon : AsynIcon = null;			// 购买物品图片异步加载器
private var mClickCountBtnTime : float = 0;			// 点击增加/减少数量按钮的时间
public var ClickTimeGap : float = 0.12f;
private var mPropUseItem : PackGrid = null;			// 准备使用的道具
private var mUseAsynIcon : AsynIcon = null;			// 准备使用物品图片异步加载器



//--------------------------------------------------
// 初始
private function _init() : void
{
	var flag : boolean = Ctrl.Get("is_open_shop_ui");
	if (flag)
	{
		_openShopUI();
	}
	else
	{
		_openUseUI();
	}
}
//--------------------------------------------------
// 清除
private function _clear() : void
{
	_clearPropItem();
	mSlotArray.Clear();
	mCurTabPage = null;
	mBuyAsynIcon = null;
}
//--------------------------------------------------
// 打开商城主界面
private function _openShopUI() : void
{
	frame.setEnabled(true);
	buy_frame.setEnabled(false);
	use_frame.setEnabled(false);
	if (PlatformMgr.IsPlatQZone() || PlatformMgr.IsPlatPY() || PlatformMgr.IsPlatQTwiter())		// qzone,朋友网,微博
	{
		tip_label2.setEnabled(true);
		dredge_btn.setEnabled(true);
	}
	else if (PlatformMgr.IsPlatYY())	// YY
	{
		tip_label2.setEnabled(false);
		dredge_btn.setEnabled(false);
	}
	// 
	for (var i:int=0; i<SLOT_NUM; ++i)
	{
		var element : iGUIElement[] = _getPropItem(i);
		mSlotArray.Add(new PropShopSlot(element[0], element[1], element[2], element[3], element[4], element[5], element[6], element[7], element[8]));
	}
	changeTab(Ctrl.Get("shop_ui_default_tab"));
}
//--------------------------------------------------
// 设置标签按钮状态
private function _setTabBtnState(btn : iGUIButton) : void
{
	_setTabBtnActive(new_tab_btn, false);
	_setTabBtnActive(tab_btn1, false);
	_setTabBtnActive(tab_btn2, false);
	_setTabBtnActive(tab_btn3, false);
	_setTabBtnActive(tab_btn4, false);
	_setTabBtnActive(tab_btn5, false);
	_setTabBtnActive(tab_btn6, false);
	_setTabBtnActive(tab_btn7, false);
	_setTabBtnActive(tab_btn8, false);
	if (btn)
	{
		_setTabBtnActive(btn, true);
	}
}
//--------------------------------------------------
// 设置标签按钮选中状态
private function _setTabBtnActive(tab : iGUIButton, active : boolean) : void
{
	tab.userData = active;
	var state_image = _getTabBtnStateImage(tab);
	var normal : String = "UISkins/Textures/itemshop/" + state_image[0];
	var hover : String = "UISkins/Textures/itemshop/" + state_image[1];
	var push : String = "UISkins/Textures/itemshop/" + state_image[2];
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
private function _getTabBtnStateImage(tab : iGUIButton)
{
	if (tab_btn1 == tab) return ["item_normal", "item_hover", "item_push"];
	if (tab_btn2 == tab) return ["clother_bag_normal", "clother_bag_hover", "clother_bag_push"];
	if (tab_btn3 == tab) return ["jiajuzhuangshi_normal", "jiajuzhuangshi_hover", "jiajuzhuangshi_push"];
	if (tab_btn4 == tab) return ["hecheng_normal", "hecheng_hover", "hecheng_push"];
	if (tab_btn5 == tab) return ["hechengcail_normal", "hechengcail_hover", "hechengcail_push"];
	if (tab_btn6 == tab) return ["zhongzhi_normal", "zhongzhi_hover", "zhongzhi_push"];
	if (tab_btn7 == tab) return ["zhongzhi_normal", "zhongzhi_hover", "zhongzhi_push"];
	if (tab_btn8 == tab) return ["zhongzhi_normal", "zhongzhi_hover", "zhongzhi_push"];
	// new_tab_btn == tab
	return ["new_normal", "new_hover", "new_push"];
}
//--------------------------------------------------
// 新品标签
private function _changeToNewTab() : void
{
	_initTabPage(new_tab_btn, PropShopLogic.PropNewPage);
}
//--------------------------------------------------
// 道具标签
private function _changeToPropTab() : void
{
	_initTabPage(tab_btn1, PropShopLogic.PropAllPage);
}
//--------------------------------------------------
// 服装礼包标签
private function _changeToClothesGiftTab() : void
{
	_initTabPage(tab_btn2, PropShopLogic.ClothesGiftPage);
}
//--------------------------------------------------
// 家具标签
private function _changeToFurnitureTab() : void
{
	_initTabPage(tab_btn3, PropShopLogic.FurniturePage);
}
//--------------------------------------------------
// 合成图纸标签
private function _changeToComposePaperTab() : void
{
	_initTabPage(tab_btn4, PropShopLogic.ComposePaperPage);
}
//--------------------------------------------------
// 合成材料标签
private function _changeToComposeMaterialTab() : void
{
	_initTabPage(tab_btn5, PropShopLogic.ComposeMaterialPage);
}
//--------------------------------------------------
// 种子标签页
private function _changeToSeedTab() : void
{
	_initTabPage(tab_btn6, PropShopLogic.SeedPage);
}
//--------------------------------------------------
// 默认标签页
private function changeTab(tab : int) : void
{
	if (1 == tab) { _changeToPropTab(); return; }
	if (2 == tab) { _changeToClothesGiftTab(); return; }
	if (3 == tab) { _changeToFurnitureTab(); return; }
	if (4 == tab) { _changeToComposePaperTab(); return; }
	if (5 == tab) { _changeToComposeMaterialTab(); return; }
	if (6 == tab) { _changeToSeedTab(); return; }
	// 0 == tab
	_changeToNewTab();
}
//--------------------------------------------------
// 初始标签页
private function _initTabPage(btn : iGUIButton, tab_page : PropShopPage) : void
{
	_setTabBtnState(btn);
	mCurTabPage = tab_page;
	mCurTabPage.firstPage();
	_refreshItems();
}
//--------------------------------------------------
// 获取道具控件
private function _getPropItem(index : int) : iGUIElement[]
{
	var ret;
	switch (index)
	{
	case 0: ret = [item_panel1, item_name_label1, item_icon_label1, item_cost_icon_label1, item_cost_text_label1, item_spec_icon_label1, item_spec_text_label1, item_wish_btn1, item_buy_btn1]; break;
	case 1: ret = [item_panel2, item_name_label2, item_icon_label2, item_cost_icon_label2, item_cost_text_label2, item_spec_icon_label2, item_spec_text_label2, item_wish_btn2, item_buy_btn2]; break;
	case 2: ret = [item_panel3, item_name_label3, item_icon_label3, item_cost_icon_label3, item_cost_text_label3, item_spec_icon_label3, item_spec_text_label3, item_wish_btn3, item_buy_btn3]; break;
	case 3: ret = [item_panel4, item_name_label4, item_icon_label4, item_cost_icon_label4, item_cost_text_label4, item_spec_icon_label4, item_spec_text_label4, item_wish_btn4, item_buy_btn4]; break;
	case 4: ret = [item_panel5, item_name_label5, item_icon_label5, item_cost_icon_label5, item_cost_text_label5, item_spec_icon_label5, item_spec_text_label5, item_wish_btn5, item_buy_btn5]; break;
	case 5: ret = [item_panel6, item_name_label6, item_icon_label6, item_cost_icon_label6, item_cost_text_label6, item_spec_icon_label6, item_spec_text_label6, item_wish_btn6, item_buy_btn6]; break;
	case 6: ret = [item_panel7, item_name_label7, item_icon_label7, item_cost_icon_label7, item_cost_text_label7, item_spec_icon_label7, item_spec_text_label7, item_wish_btn7, item_buy_btn7]; break;
	case 7: ret = [item_panel8, item_name_label8, item_icon_label8, item_cost_icon_label8, item_cost_text_label8, item_spec_icon_label8, item_spec_text_label8, item_wish_btn8, item_buy_btn8]; break;
	case 8: ret = [item_panel9, item_name_label9, item_icon_label9, item_cost_icon_label9, item_cost_text_label9, item_spec_icon_label9, item_spec_text_label9, item_wish_btn9, item_buy_btn9]; break;
	case 9: ret = [item_panel10, item_name_label10, item_icon_label10, item_cost_icon_label10, item_cost_text_label10, item_spec_icon_label10, item_spec_text_label10, item_wish_btn10, item_buy_btn10]; break;
	case 10: ret = [item_panel11, item_name_label11, item_icon_label11, item_cost_icon_label11, item_cost_text_label11, item_spec_icon_label11, item_spec_text_label11, item_wish_btn11, item_buy_btn11]; break;
	case 11: ret = [item_panel12, item_name_label12, item_icon_label12, item_cost_icon_label12, item_cost_text_label12, item_spec_icon_label12, item_spec_text_label12, item_wish_btn12, item_buy_btn12]; break;
	case 12: ret = [item_panel13, item_name_label13, item_icon_label13, item_cost_icon_label13, item_cost_text_label13, item_spec_icon_label13, item_spec_text_label13, item_wish_btn13, item_buy_btn13]; break;
	case 13: ret = [item_panel14, item_name_label14, item_icon_label14, item_cost_icon_label14, item_cost_text_label14, item_spec_icon_label14, item_spec_text_label14, item_wish_btn14, item_buy_btn14]; break;
	case 14: ret = [item_panel15, item_name_label15, item_icon_label15, item_cost_icon_label15, item_cost_text_label15, item_spec_icon_label15, item_spec_text_label15, item_wish_btn15, item_buy_btn15]; break;
	// 15
	default: ret = [item_panel16, item_name_label16, item_icon_label16, item_cost_icon_label16, item_cost_text_label16, item_spec_icon_label16, item_spec_text_label16, item_wish_btn16, item_buy_btn16]; break;
	}
	return ret;
}
//--------------------------------------------------
// 清除
private function _clearPropItem() : void
{
	for (var slot : PropShopSlot in mSlotArray)
	{
		slot.setVisible(false);
		slot.setContent(null);
	}
}
//--------------------------------------------------
// 刷新列表
private function _refreshItems() : void
{
	// 清除
	_clearPropItem();
	// 设置当前页的内容
	var arr : Array = mCurTabPage.getCurPage();
	for (var i:int=0; i<arr.Count; ++i)
	{
		var slot : PropShopSlot = mSlotArray[i] as PropShopSlot;
		// 设置控件内容
		slot.setVisible(true);
		slot.setContent(arr[i]);
	}
	// 设置页数
	page_text_label.label.text = mCurTabPage.getCurPageNum().ToString() + "/" + mCurTabPage.getTotalPageNum().ToString();
}
//--------------------------------------------------
// 打开购买界面
public function openBuyUI(slot : PropShopSlot) : void
{
	frame.passive = true;
	buy_frame.setLayer(frame.layer + 1);
	buy_frame.refreshLayers();
	buy_frame.setEnabled(true);
	//
	mBuyItemSlot = slot;
	if (null == mBuyAsynIcon)
	{
		mBuyAsynIcon =  new AsynIcon(setBuyItemIcon, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	}
	mBuyAsynIcon.load("Icon/" + slot.ItemInfo.icon);
	bf_item_name_label.label.text = Global.limitTextLength(slot.ItemInfo.name, 3, Define.unknow, "...");
	var cost_icon : String = "Qcrystal";			// 水晶
	if (money_type.mt_love_coin == mBuyItemSlot.ShopCenterInfo.money_type)	// 爱情币
	{
		cost_icon = "Qdian";
	}
	bf_cost_icon_label.style.normal.background = Resources.Load("UISkins/Textures/Common1/" + cost_icon);
	_setBuyCountLabel(1);
}
//--------------------------------------------------
// 关闭购买界面
private function _closeBuyUI() : void
{
	frame.passive = false;
	buy_frame.setEnabled(false);
	//
	if (mBuyAsynIcon)
	{
		mBuyAsynIcon.cancel();
	}
	mBuyItemSlot = null;
	mBuyItemCount = 1;
	bf_item_name_label.label.text = "";
	bf_cost_text_label.label.text = "";
}
//--------------------------------------------------
// 回调,设置购买物品图片
function setBuyItemIcon(tex : Texture)
{
	bf_item_icon_label.style.normal.background = tex;
}
//--------------------------------------------------
// 设置购买数量
private function _setBuyCountLabel(count : int) : void
{
	var high : int = count / 10;
	var low : int = count % 10;
	bf_count_high_label.style.normal.background = _getNumImage(high);
	bf_count_low_label.style.normal.background = _getNumImage(low);
	var total_price : int = mBuyItemSlot.ShopCenterInfo.price * count;
	bf_cost_text_label.label.text = total_price.ToString();
}
//--------------------------------------------------
// 获取数字图片名
private function _getNumImage(num : int) : Texture
{
	var name : String = "number_" + num.ToString();
	return Resources.Load("UISkins/Textures/Common1/" + name);
}
//--------------------------------------------------
// 购买道具结果
public function buyPropResult(param : System.Object)
{
	_closeBuyUI();
}
//--------------------------------------------------
// 控制鼠标点击增加/减少数量按钮时间(为了防止不能精确定位到某个数字)
private function _controlClickBuyCountBtnTime() : boolean
{
	if (Time.time - mClickCountBtnTime < ClickTimeGap)
		return false;
	
	mClickCountBtnTime = Time.time;
	return true;
}
//--------------------------------------------------
// 打开道具使用界面
private function _openUseUI() : void
{
	_setUseIconText(Ctrl.Get("prop_item"));
	//
	use_frame.setEnabled(true);
	frame.setEnabled(false);
	buy_frame.setEnabled(false);
	Global.GetSysTooltip().Hide();
}
//--------------------------------------------------
// 设置使用界面的物品图标和文本
private function _setUseIconText(pg : PackGrid) : void
{
	mPropUseItem = pg;
	if (null == mUseAsynIcon)
	{
		mUseAsynIcon = new AsynIcon(setUseItemIcon, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	}
	mUseAsynIcon.load("Icon/" + pg._item._itemInfo.icon);
	uf_tip_label1.label.text = ResManager.LgtMgr.getItemDescription(pg._item._itemInfo.id);
}
//--------------------------------------------------
// 回调,设置使用物品图片
function setUseItemIcon(tex : Texture)
{
	uf_icon_label.style.normal.background = tex;
}
//--------------------------------------------------
// 关闭道具使用界面
public function closeUseUI(param : System.Object) : void
{
	mPropUseItem = null;
	if (mUseAsynIcon)
	{
		mUseAsynIcon.cancel();
	}
	mUseAsynIcon = null;
	Ctrl.Excute("close_prop_shop_ui", null);
	StorageLogic.getInstance().unselectPackGrid();
}
//--------------------------------------------------


