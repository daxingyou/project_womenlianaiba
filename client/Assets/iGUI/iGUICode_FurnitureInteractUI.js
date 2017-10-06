#pragma strict
#pragma downcast
import iGUI;

class CountdownTimer {
	var FurnitureID : UInt64 = 0;
	var RemainTime : int = 0;
}

private static var instance : iGUICode_FurnitureInteractUI;
function Awake(){
	instance=this;
	registerEvents();
}
static function getInstance(){
	return instance;
}

@HideInInspector
var PanTimer : iGUIPanel;
@HideInInspector
var func_btn9 : iGUIButton;
@HideInInspector
var func_btn8 : iGUIButton;
@HideInInspector
var func_btn7 : iGUIButton;
@HideInInspector
var func_btn6 : iGUIButton;
@HideInInspector
var func_btn5 : iGUIButton;
@HideInInspector
var func_btn4 : iGUIButton;
@HideInInspector
var func_btn3 : iGUIButton;
@HideInInspector
var func_btn2 : iGUIButton;
@HideInInspector
var func_btn1 : iGUIButton;
@HideInInspector
var menu : iGUIPanel;
@HideInInspector
var root : iGUIRoot;


function Start()
{
	UI.getUI().SetIgnoreMouseOver(menu, true);
	for (var i:int=0; i<7; ++i)
	{
		var btn : iGUIButton = getFuncBtn(i);
		mFuncBtnArr.Add(btn);
	}
	
	func_btn1.clickCallback = System.Delegate.Combine(func_btn1.clickCallback, ClickCallback_func_btn1 as iGUIEventCallback);
	func_btn2.clickCallback = System.Delegate.Combine(func_btn2.clickCallback, ClickCallback_func_btn2 as iGUIEventCallback);
	func_btn3.clickCallback = System.Delegate.Combine(func_btn3.clickCallback, ClickCallback_func_btn3 as iGUIEventCallback);
	func_btn4.clickCallback = System.Delegate.Combine(func_btn4.clickCallback, ClickCallback_func_btn4 as iGUIEventCallback);
	func_btn5.clickCallback = System.Delegate.Combine(func_btn5.clickCallback, ClickCallback_func_btn5 as iGUIEventCallback);
	func_btn6.clickCallback = System.Delegate.Combine(func_btn6.clickCallback, ClickCallback_func_btn6 as iGUIEventCallback);
	func_btn7.clickCallback = System.Delegate.Combine(func_btn7.clickCallback, ClickCallback_func_btn7 as iGUIEventCallback);
	func_btn8.clickCallback = System.Delegate.Combine(func_btn8.clickCallback, ClickCallback_func_btn8 as iGUIEventCallback);
	func_btn9.clickCallback = System.Delegate.Combine(func_btn9.clickCallback, ClickCallback_func_btn9 as iGUIEventCallback);
	
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLANT_REFRESH_REMAIN_TIME), HandleNotifyRefreshTimer);
}

function OnDestroy()
{
	unregisterEvents();
}

function OnGUI()
{
	setMenuPos(mFurniture);
}





/***************************************************
*** 界面事件回调
***************************************************/

//--------------------------------------------------
// 点击功能按钮1
function ClickCallback_func_btn1(caller : iGUIElement)
{
	var row : FurniInteractRow = FurnitureDataHandler.getFurniInteractRow(caller.userData);
	FurnitureInteract.publishEvent("use_funiture", row);
}
//--------------------------------------------------
// 点击功能按钮2
function ClickCallback_func_btn2(caller : iGUIElement)
{
	ClickCallback_func_btn1(caller);
}
//--------------------------------------------------
// 点击功能按钮3
function ClickCallback_func_btn3(caller : iGUIElement)
{
	FurnitureInteract.publishEvent("event_plant", mFurniture);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_PLANT));
}
//--------------------------------------------------
// 点击功能按钮4
function ClickCallback_func_btn4(caller : iGUIElement)
{
	FurnitureInteract.publishEvent("event_harvest", mFurniture);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_HARVEST));
}
//--------------------------------------------------
// 点击功能按钮5
function ClickCallback_func_btn5(caller : iGUIElement)
{
	caller.passive = true;
	
	FurnitureInteract.publishEvent("event_water", mFurniture);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_WATER));
}
//--------------------------------------------------
// 点击功能按钮6
function ClickCallback_func_btn6(caller : iGUIElement)
{
	caller.passive = true;
	
	FurnitureInteract.publishEvent("event_fertilize", mFurniture);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_FERTILIZE));
}
//--------------------------------------------------
// 点击功能按钮7
function ClickCallback_func_btn7(caller : iGUIElement)
{
	FurnitureInteract.publishEvent("event_remove", mFurniture);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_REMOVEPLANT));
}
//--------------------------------------------------
function ClickCallback_func_btn8(caller : iGUIElement)
{
	PlantLogic.GetInstance().SpeedUp();
}
//--------------------------------------------------
function ClickCallback_func_btn9(caller : iGUIElement)
{
	PlantLogic.GetInstance().AddHarvest();
}
//--------------------------------------------------




/***************************************************
*** 界面逻辑
***************************************************/
private var mFurniture : HouseSceneComponent = null;
private var mFuncBtnArr : Array = new Array();



//--------------------------------------------------
// 事件注册
private function registerEvents() : void
{
	FurnitureInteract.addObserver("click_funiture", clickFurniture);
	FurnitureInteract.addObserver("find_path_failed", findPathFailed);
}
//--------------------------------------------------
// 取消事件注册
private function unregisterEvents() : void
{
	FurnitureInteract.delObserver("click_funiture", clickFurniture);
	FurnitureInteract.delObserver("find_path_failed", findPathFailed);
}
//--------------------------------------------------
// 点击家具
private function clickFurniture(param : HouseSceneComponent) : void
{
	// 隐藏界面
	enableUI(false);
	mFurniture = param;
	if (null == param)
		return;
	
	// 显示菜单
	var menu_arr : Array = FurnitureDataHandler.getFurniMenu(param.CompId);
	if (0 == menu_arr.Count)
		return;
	
	var arr : Array = showFuncBtn(menu_arr);
	if (arr.Count > 0)
	{
		//event boardcast
		var btnArr : Array = new Array();
		for (var i:int=0; i<15; ++i)
		{
			var btn : iGUIButton = getFuncBtn(i);
			if(btn != null) {
				btnArr.Add(btn);
			}
		}
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_FURNI_INTERACT_FUNC_BTN_SHOW), btnArr);
		setMenuPos(mFurniture);
		enableUI(true);
	}
}
//--------------------------------------------------
// 根据索引获取功能按钮
private function getFuncBtn(index : int) : iGUIButton
{
	if (0 == index) return func_btn1;
	if (1 == index) return func_btn2;
	if (2 == index) return func_btn3;
	if (3 == index) return func_btn4;
	if (4 == index) return func_btn5;
	if (5 == index) return func_btn6;
	if (6 == index) return func_btn7;
	if (11 == index) return func_btn8;
	if (12 == index) return func_btn9;
	return null;
}
//--------------------------------------------------
// 隐藏按钮
private function hideFuncBtn() : void
{
	for (var i:int=0; i<15; ++i)
	{
		var btn : iGUIButton = getFuncBtn(i);
		if(btn != null) {
			btn.setEnabled(false);
			btn.userData = null;
		}
	}
}
//--------------------------------------------------
// 显示按钮
private function showFuncBtn(menu_arr : Array) : Array
{
	hideFuncBtn();
	var show_arr : Array = new Array();
	for (var i:int=0; i<menu_arr.Count; ++i)
	{
		if (0 == menu_arr[i])
			continue;
		
		var btn : iGUIButton = getFuncBtn(i);
		btn.setEnabled(true);
		btn.userData = menu_arr[i];
		show_arr.Add(btn);
	}
	return show_arr;
}
//--------------------------------------------------
// 显示/隐藏家具交互界面
private function enableUI(enable : boolean) : void
{
	menu.setEnabled(enable);
	root.setEnabled(enable);
	
	PanTimer.setEnabled(false);
}
//--------------------------------------------------
// 设置菜单位置
private function setMenuPos(furni : HouseSceneComponent) : void
{
	if (false==root.enabled || false==menu.enabled)
		return;
	
	if (null==furni || null==furni.GameObj)
	{
		enableUI(false);
		return;
	}
	var pos : Vector3 = Camera.main.WorldToScreenPoint(furni.GameObj.transform.position);
	pos.y = Screen.height - pos.y;
	var x : float = pos.x - menu.rect.width/2.0f;
	var y : float = pos.y - menu.rect.height/2.0f - 70.0f;
	menu.setX(x);
	menu.setY(y);
}
//--------------------------------------------------
// 寻路失败
private function findPathFailed(param : System.Object) : void
{
	var content : String = Define.getContent(5090);
	UI.getUI().OpenMsgbox("", content, true);
}
//--------------------------------------------------

//add timer show
function HandleNotifyRefreshTimer(evt:GameEvent, obj:CountdownTimer) {
	if(obj == null || mFurniture == null) return ;
	if(obj.FurnitureID != mFurniture.InstId) return ;
	
	if(obj.RemainTime == 0) {
		if(PanTimer.enabled == true) {
			PanTimer.setEnabled(false);
		}
	} else {
		if(PanTimer.enabled == false) {
			PanTimer.setEnabled(true);
		}
	}
	
	var minutes : int = System.Math.Floor(obj.RemainTime/60);
	var second:int = obj.RemainTime % 60;
	var str : String = minutes.ToString()+":"+second.ToString();
	if(second < 10) {
		str = minutes.ToString()+":0"+second.ToString();
	}
	PanTimer.label.text = Define.getContent(5142, [str]);
}

//plant
function SetWaterPassive(passive : boolean) {
	func_btn5.passive = passive;
}

function SetFerPassive(passive : boolean) {
	func_btn6.passive = passive;
}

