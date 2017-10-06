import iGUI;

private static var instance : iGUICode_SinglePayUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var num_label4 : iGUILabel;
@HideInInspector
var num_label3 : iGUILabel;
@HideInInspector
var num_label2 : iGUILabel;
@HideInInspector
var num_label1 : iGUILabel;
@HideInInspector
var get_btn4 : iGUIButton;
@HideInInspector
var get_btn3 : iGUIButton;
@HideInInspector
var get_btn2 : iGUIButton;
@HideInInspector
var get_btn1 : iGUIButton;
@HideInInspector
var close_btn : iGUIButton;
@HideInInspector
var frame : iGUIPanel;
@HideInInspector
var root : iGUIRoot;


private var ITEM_NUM : int = 4;
private var mItems : ArrayList = null;
private var mCurIndex : int = -1;

//--------------------------------------------------
function Start()
{
	// 界面事件注册
	close_btn.clickCallback = ClickCallback_close_btn;
	get_btn1.clickCallback = ClickCallback_get_btn1;
	get_btn2.clickCallback = ClickCallback_get_btn2;
	get_btn3.clickCallback = ClickCallback_get_btn3;
	get_btn4.clickCallback = ClickCallback_get_btn4;
	//
	PayLogic.Ctrl.Register("single_return_result", singleReturnResult);
	//
	init();
}
//--------------------------------------------------
function OnDestroy()
{
	PayLogic.Ctrl.Unregister("single_return_result", singleReturnResult);
}
//--------------------------------------------------
private function init() : void
{
	var bg_png : String = "";
	if (PlatformMgr.IsPlatQZone() || PlatformMgr.IsPlatPY() || PlatformMgr.IsPlatQTwiter())		// qzone,朋友网,微博
	{
		bg_png = "danbi.png.u3d";
	}
	else if (PlatformMgr.IsPlatYY())	// YY
	{
		bg_png = "danbi_yy.png.u3d";
	}
	var bgAsynIcon : AsynIcon =  new AsynIcon(CallbackBGIcon, null);
	bgAsynIcon.load("UI/" + bg_png);
	//
	mItems = PayLogic.Ctrl.Get("single_pay_return_items");
	for (var i:int = 0; i<ITEM_NUM; ++i)
	{
		setItemCtrls(i, true);
	}
}
//--------------------------------------------------
private function CallbackBGIcon(tex : Texture) : void
{
	frame.style.normal.background = tex;
}
//--------------------------------------------------
function ClickCallback_close_btn(caller : iGUIElement)
{
	UI.getUI().SetModal("SinglePayUI", false);
	UI.getUI().CloseUIRoot("SinglePayUI");
}
//--------------------------------------------------
function ClickCallback_get_btn1(caller : iGUIElement)
{
	getDiamond(0, caller);
}
//--------------------------------------------------
function ClickCallback_get_btn2(caller : iGUIElement)
{
	getDiamond(1, caller);
}
//--------------------------------------------------
function ClickCallback_get_btn3(caller : iGUIElement)
{
	getDiamond(2, caller);
}
//--------------------------------------------------
function ClickCallback_get_btn4(caller : iGUIElement)
{
	getDiamond(3, caller);
}
//--------------------------------------------------
private function getReturnItem(index : int) : int[]
{
	if (index < 0 || index >= mItems.Count)
		throw Exception("iGUICode_SinglePayUI -> getReturnItem(int) index[" + index + "], item count[" + mItems.Count+"].");
	
	var it : single_payment_return_item = mItems[index];
	return [it.return_diamond, it.return_count];
}
//--------------------------------------------------
private function getItemCtrl(index : int) : iGUIElement[]
{
	if (0 == index) return [get_btn1, num_label1];
	if (1 == index) return [get_btn2, num_label2];
	if (2 == index) return [get_btn3, num_label3];
	// 3 == index
	return [get_btn4, num_label4];
}
//--------------------------------------------------
private function setItemCtrls(index : int, can_get : boolean) : void
{
	var ele : iGUIElement[] = getItemCtrl(index);
	var btn : iGUIButton = ele[0];
	var label : iGUILabel = ele[1];
	// 水晶和数量
	var res : int[] = getReturnItem(index);
	var diamond : int = res[0];
	var count : int = res[1];
	// 是否可获取标识,若为true,要根据水晶和数量进行确定
	if (can_get)
	{
		can_get = (0 != diamond && 0 != count);
	}
	setGetBtnState(btn, can_get);
	// 设置数量
	label.label.text = can_get ? "x " + count.ToString() + Define.stock : "";
}
//--------------------------------------------------
private function setGetBtnState(btn : iGUIButton, can_get : boolean) : void
{
	btn.userData = can_get;
	
	var normal : String = can_get ? "lingqu_n" : "lingqu_p";
	var hover : String = can_get ? "lingqu_h" : "lingqu_p";
	
	var dir : String = "recharge/";
	UI.SetButtonState(btn, dir+normal, dir+hover, dir+normal);
}
//--------------------------------------------------
private function getDiamond(index : int, btn : iGUIButton) : void
{
	if (false == btn.userData)
		return;
	
	mCurIndex = index;
	var res : int[] = getReturnItem(index);
	var diamond : int = res[0];
	PayLogic.request_single_payment_return_reward(diamond);
}
//--------------------------------------------------
private function singleReturnResult(returned : boolean) : void
{
	if (false == returned)
		return;
	
	setItemCtrls(mCurIndex, false);
}
//--------------------------------------------------


