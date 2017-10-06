import iGUI;

private static var instance : iGUICode_AccumulatePayUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var exchange_btn9 : iGUIButton;
@HideInInspector
var exchange_btn8 : iGUIButton;
@HideInInspector
var exchange_btn7 : iGUIButton;
@HideInInspector
var exchange_btn6 : iGUIButton;
@HideInInspector
var exchange_btn5 : iGUIButton;
@HideInInspector
var exchange_btn4 : iGUIButton;
@HideInInspector
var exchange_btn3 : iGUIButton;
@HideInInspector
var exchange_btn2 : iGUIButton;
@HideInInspector
var exchange_btn1 : iGUIButton;
@HideInInspector
var num_label : iGUILabel;
@HideInInspector
var close_btn : iGUIButton;
@HideInInspector
var frame : iGUIPanel;
@HideInInspector
var root : iGUIRoot;


private var ITEM_NUM : int = 9;
private var mItems : ArrayList = null;
private var mCurIndex : int = -1;

//--------------------------------------------------
function Start()
{
	// 界面事件注册
	close_btn.clickCallback = ClickCallback_close_btn;
	exchange_btn1.clickCallback = ClickCallback_exchange_btn1;
	exchange_btn2.clickCallback = ClickCallback_exchange_btn2;
	exchange_btn3.clickCallback = ClickCallback_exchange_btn3;
	exchange_btn4.clickCallback = ClickCallback_exchange_btn4;
	exchange_btn5.clickCallback = ClickCallback_exchange_btn5;
	exchange_btn6.clickCallback = ClickCallback_exchange_btn6;
	exchange_btn7.clickCallback = ClickCallback_exchange_btn7;
	exchange_btn8.clickCallback = ClickCallback_exchange_btn8;
	exchange_btn9.clickCallback = ClickCallback_exchange_btn9;
	//
	PayLogic.Ctrl.Register("total_return_result", totalReturnResult);
	//
	init();
}
//--------------------------------------------------
function OnDestroy()
{
	PayLogic.Ctrl.Unregister("total_return_result", totalReturnResult);
}
//--------------------------------------------------
private function init() : void
{
	var bg_png : String = "";
	if (PlatformMgr.IsPlatQZone() || PlatformMgr.IsPlatPY() || PlatformMgr.IsPlatQTwiter())		// qzone,朋友网,微博
	{
		bg_png = "leiji.png.u3d";
	}
	else if (PlatformMgr.IsPlatYY())	// YY
	{
		bg_png = "leiji_yy.png.u3d";
	}
	var bgAsynIcon : AsynIcon =  new AsynIcon(CallbackBGIcon, null);
	bgAsynIcon.load("UI/" + bg_png);
	//
	mItems = PayLogic.Ctrl.Get("total_pay_return_items");
	for (var i:int = 0; i<ITEM_NUM; ++i)
	{
		setItemCtrls(i, true);
	}
	var total : int = PayLogic.Ctrl.Get("total_consume_amount");
	num_label.label.text = total.ToString();
}
//--------------------------------------------------
private function CallbackBGIcon(tex : Texture) : void
{
	frame.style.normal.background = tex;
}
//--------------------------------------------------
function ClickCallback_close_btn(caller : iGUIElement)
{
	UI.getUI().SetModal("AccumulatePayUI", false);
	UI.getUI().CloseUIRoot("AccumulatePayUI");
}
//--------------------------------------------------
function ClickCallback_exchange_btn1(caller : iGUIElement)
{
	getAward(0, caller);
}
//--------------------------------------------------
function ClickCallback_exchange_btn2(caller : iGUIElement)
{
	getAward(1, caller);
}
//--------------------------------------------------
function ClickCallback_exchange_btn3(caller : iGUIElement)
{
	getAward(2, caller);
}
//--------------------------------------------------
function ClickCallback_exchange_btn4(caller : iGUIElement)
{
	getAward(3, caller);
}
//--------------------------------------------------
function ClickCallback_exchange_btn5(caller : iGUIElement)
{
	getAward(4, caller);
}
//--------------------------------------------------
function ClickCallback_exchange_btn6(caller : iGUIElement)
{
	getAward(5, caller);
}
//--------------------------------------------------
function ClickCallback_exchange_btn7(caller : iGUIElement)
{
	getAward(6, caller);
}
//--------------------------------------------------
function ClickCallback_exchange_btn8(caller : iGUIElement)
{
	getAward(7, caller);
}
//--------------------------------------------------
function ClickCallback_exchange_btn9(caller : iGUIElement)
{
	getAward(8, caller);
}
//--------------------------------------------------
private function getReturnItem(index : int) : int[]
{
	if (index < 0 || index >= mItems.Count)
		throw Exception("iGUICode_AccumulatePayUI -> getReturnItem(int) index[" + index + "], item count[" + mItems.Count+"].");
	
	// 这里服务端的数据是倒序的
	var it : total_payment_return_item = mItems[ITEM_NUM - index - 1];
	return [it.consume_amount, it.returned];
}
//--------------------------------------------------
private function getItemCtrl(index : int) : iGUIButton
{
	if (0 == index) return exchange_btn1;
	if (1 == index) return exchange_btn2;
	if (2 == index) return exchange_btn3;
	if (3 == index) return exchange_btn4;
	if (4 == index) return exchange_btn5;
	if (5 == index) return exchange_btn6;
	if (6 == index) return exchange_btn7;
	if (7 == index) return exchange_btn8;
	// 8 == index
	return exchange_btn9;
}
//--------------------------------------------------
private function setItemCtrls(index : int, can_exchange : boolean) : void
{
	var btn : iGUIButton = getItemCtrl(index);
	// 是否可领取标识,若为true,要根据水晶和数量进行确定
	if (can_exchange)
	{
		var res : int[] = getReturnItem(index);
		var returned : int = res[1];
		can_exchange = 1 == returned;
	}
	setGetBtnState(btn, can_exchange);
}
//--------------------------------------------------
private function setGetBtnState(btn : iGUIButton, can_exchange : boolean) : void
{
	btn.userData = can_exchange;
	
	var normal : String = can_exchange ? "duihuan_n" : "duihuan1_p";
	var hover : String = can_exchange ? "duihuan_h" : "duihuan1_p";
	
	var dir : String = "recharge/";
	UI.SetButtonState(btn, dir+normal, dir+hover, dir+normal);
}
//--------------------------------------------------
private function getAward(index : int, btn : iGUIButton) : void
{
	if (false == btn.userData)
		return;
	
	mCurIndex = index;
	var res : int[] = getReturnItem(index);
	var amount : int = res[0];
	PayLogic.request_total_payment_return_reward(amount);
}
//--------------------------------------------------
private function totalReturnResult(returned : boolean) : void
{
	if (false == returned)
		return;
	
	var btn : iGUIButton = getItemCtrl(mCurIndex);
	btn.userData = false;
	var bg : String = "recharge/duihuan_p";
	UI.SetButtonState(btn, bg, bg, bg);
}
//--------------------------------------------------


