#pragma strict
#pragma downcast
import iGUI;



var imageSource : String = "xinshou06.png.u3d";	// 提示图片的资源名,填""表示不显示图片
var imagePos : Vector2 = Vector2(334, 155);	// 提示图片的坐标位置
var arrowDirection : String = "tobottom";	// 箭头朝向("toleft","toright","totop","tobottom"),填""表示不显示箭头
var arrowPos : Vector2 = Vector2(701, 488);	// 箭头位置
var buttonNormal : String = "Common1/makefood_n";	// 按钮常态皮肤,填""表示不显示按钮
var buttonHover : String = "Common1/makefood_h";	// 按钮高亮皮肤,填""表示不显示按钮
var buttonPos : Vector2 = Vector2(706, 545);	// 按钮位置
// 
var imageSource1 : String = "";
var imagePos1 : Vector2 = Vector2(100, 100);
var arrowDirection1 : String = "toleft";
var arrowPos1 : Vector2 = Vector2(221, 86);
var buttonNormal1 : String = "cookbook/Btn_Cookbookmark_n";
var buttonHover1 : String = "cookbook/Btn_Cookbookmark_h";
var buttonPos1 : Vector2 = Vector2(165, 105);
//
var imageSource2 : String = "";
var imagePos2 : Vector2 = Vector2(100, 100);
var arrowDirection2 : String = "toleft";
var arrowPos2 : Vector2 = Vector2(424, 86);
var buttonNormal2 : String = "cookbook/Btn_Cookbookmark_n";
var buttonHover2 : String = "cookbook/Btn_Cookbookmark_h";
var buttonPos2 : Vector2 = Vector2(365, 105);
// 
var imageSource3 : String = "";
var imagePos3 : Vector2 = Vector2(100, 100);
var arrowDirection3 : String = "tobottom";
var arrowPos3 : Vector2 = Vector2(788, 483);
var buttonNormal3 : String = "cookbook/Btn_MakerStart_n";
var buttonHover3 : String = "cookbook/Btn_MakerStart_h";
var buttonPos3 : Vector2 = Vector2(764, 538);
// 
var imageSource4 : String = "xinshou04.png.u3d";
var imagePos4 : Vector2 = Vector2(588, 307);
var arrowDirection4 : String = "tobottom";
var arrowPos4 : Vector2 = Vector2(691, 492);
var buttonNormal4 : String = "cookbook/Btn_Makercomplete_n";
var buttonHover4 : String = "cookbook/Btn_Makercomplete_h";
var buttonPos4 : Vector2 = Vector2(684, 549);
//
private var NUM_1 : int = 1;	// 制作第1个食物
private var NUM_2 : int = 2;	// 制作第2个食物
//--------------------------------------------------
function Start() {
	NewHandGuideLogic.registEvent("COMPLETE_CUR_NEW_HAND_TASK", handleCompleteCurNewHandTask);
	NewHandGuideLogic.registEvent("OPEN_MAKE_FOOD_UI", openMakeFoodUI);
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
		btn.clickCallback = ClickCallback_make_food_btn1;
	}
}
// 点击制作按钮1
function ClickCallback_make_food_btn1(caller : iGUIElement) : void {
	var foodInfo : BartenderFoodBaseInfoRow = iGUICode_BartenderUI.getInstance().GetFoodInfoByIndex(NUM_1 - 1);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_ADDSHAKE_BTN), foodInfo.food_id);
	var btn : iGUIButton = NewHandGuideLogic.showContent(imageSource2, imagePos2, arrowDirection2, arrowPos2, buttonNormal2, buttonHover2, buttonPos2);
	if (btn) {
		btn.clickCallback = ClickCallback_make_food_btn2;
	}
}
// 点击制作按钮2
function ClickCallback_make_food_btn2(caller : iGUIElement) : void {
	var foodInfo : BartenderFoodBaseInfoRow = iGUICode_BartenderUI.getInstance().GetFoodInfoByIndex(NUM_2 - 1);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_ADDSHAKE_BTN), foodInfo.food_id);
	var btn : iGUIButton = NewHandGuideLogic.showContent(imageSource3, imagePos3, arrowDirection3, arrowPos3, buttonNormal3, buttonHover3, buttonPos3);
	if (btn) {
		btn.clickCallback = ClickCallback_start_make_btn;
	}
}
// 点击开始制作按钮
function ClickCallback_start_make_btn(caller : iGUIElement) : void {
	BartenderSys.getInstance().reqMakeProduct();
	var btn : iGUIButton = NewHandGuideLogic.showContent(imageSource4, imagePos4, arrowDirection4, arrowPos4, buttonNormal4, buttonHover4, buttonPos4);
	if (btn) {
		btn.clickCallback = ClickCallback_complete_btn;
	}
}
// 点击立即完成按钮
function ClickCallback_complete_btn(caller : iGUIElement) : void {
	BartenderSys.getInstance().immediateCompleteAllProduct();
}



