#pragma strict
#pragma downcast
import iGUI;



var imageSource : String = "xinshou15.png.u3d";	// 提示图片的资源名,填""表示不显示图片
var imagePos : Vector2 = Vector2(334, 155);	// 提示图片的坐标位置
var arrowDirection : String = "tobottom";	// 箭头朝向("toleft","toright","totop","tobottom"),填""表示不显示箭头
var arrowPos : Vector2 = Vector2(701, 488);	// 箭头位置
var buttonNormal : String = "Common1/makefood_n";	// 按钮常态皮肤,填""表示不显示按钮
var buttonHover : String = "Common1/makefood_h";	// 按钮高亮皮肤,填""表示不显示按钮
var buttonPos : Vector2 = Vector2(706, 545);	// 按钮位置
//
var imageSource1 : String = "xinshou15.png.u3d";
var imagePos1 : Vector2 = Vector2(215, 0);
var arrowDirection1 : String = "toleft";
var arrowPos1 : Vector2 = Vector2(150, 104);
var buttonNormal1 : String = "cookbook/Btn_lock";
var buttonHover1 : String = "cookbook/Btn_lock";
var buttonPos1 : Vector2 = Vector2(136, 126);
//
private var mStockItemInfo : StockItemInitInfoClass = null;
//--------------------------------------------------
function Start() {
	NewHandGuideLogic.registEvent("COMPLETE_CUR_NEW_HAND_TASK", handleCompleteCurNewHandTask);
	NewHandGuideLogic.registEvent("OPEN_MAKE_FOOD_UI", openMakeFoodUI);
	NewHandGuideLogic.registEvent("CREATE_FOOD_STOCK_GRID", createFoodStockGrid);
	NewHandGuideLogic.registEvent("CLOSE_EXPAND_STOCK_CONFIRM_PANEL", closeExpandStockConfirmPanel);
	//
	NewHandGuideLogic.openNewHandGuideUI(true);
	var btn : iGUIButton = NewHandGuideLogic.showContent(imageSource, imagePos, arrowDirection, arrowPos, buttonNormal, buttonHover, buttonPos);
	if (btn) {
		btn.clickCallback = ClickCallback_open_bartender_ui_btn;
	}
}
//
function OnDestroy() {
	NewHandGuideLogic.unregistEvent("COMPLETE_CUR_NEW_HAND_TASK", handleCompleteCurNewHandTask);
	NewHandGuideLogic.unregistEvent("OPEN_MAKE_FOOD_UI", openMakeFoodUI);
	NewHandGuideLogic.unregistEvent("CREATE_FOOD_STOCK_GRID", createFoodStockGrid);
	NewHandGuideLogic.unregistEvent("CLOSE_EXPAND_STOCK_CONFIRM_PANEL", closeExpandStockConfirmPanel);
}
// 处理完成当前新手任务
function handleCompleteCurNewHandTask(obj : Object) : void {
	NewHandGuideLogic.destroyNewHandTask(this.gameObject);
	NewHandGuideLogic.closeNewHandGuideUI();
}
// 点击打开制作食物界面按钮
function ClickCallback_open_bartender_ui_btn(caller : iGUIElement) : void {
	NewHandGuideLogic.closeNewHandGuideUI();
	iGUICode_MainUI.getInstance().clickCallback_makeFoodBtn(null);
}
// 打开食物制作界面
function openMakeFoodUI(obj : Object) : void {
	NewHandGuideLogic.openNewHandGuideUI(true);
	var btn : iGUIButton = NewHandGuideLogic.showContent(imageSource1, imagePos1, arrowDirection1, arrowPos1, buttonNormal1, buttonHover1, buttonPos1);
	if (btn) {
		btn.clickCallback = ClickCallback_add_storage_btn;
	}
}
// 创建食物库存格子
function createFoodStockGrid(obj : Object) : void {
	var info : StockItemInitInfoClass = obj as StockItemInitInfoClass;
	if (!info.isOpened && null == mStockItemInfo) {
		mStockItemInfo = info;
	}
}
// 点击扩展库存按钮
function ClickCallback_add_storage_btn(caller : iGUIElement) : void {
	iGUICode_NewHandGuideUI.getInstance().setModalState(false);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.POPUP_REQ_EXPANDSTOCK_CONFIRM_UI), mStockItemInfo);
}
// 关闭扩充库存确定界面
function closeExpandStockConfirmPanel(obj : Object) : void {
	iGUICode_NewHandGuideUI.getInstance().setModalState(true);
}


