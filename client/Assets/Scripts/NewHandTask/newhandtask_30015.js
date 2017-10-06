#pragma strict
#pragma downcast
import iGUI;



var imageSource : String = "xinshou17.png.u3d";	// 提示图片的资源名,填""表示不显示图片
var imagePos : Vector2 = Vector2(334, 155);	// 提示图片的坐标位置
var arrowDirection : String = "tobottom";	// 箭头朝向("toleft","toright","totop","tobottom"),填""表示不显示箭头
var arrowPos : Vector2 = Vector2(701, 488);	// 箭头位置
var buttonNormal : String = "Common1/makefood_n";	// 按钮常态皮肤,填""表示不显示按钮
var buttonHover : String = "Common1/makefood_h";	// 按钮高亮皮肤,填""表示不显示按钮
var buttonPos : Vector2 = Vector2(706, 545);	// 按钮位置
//
var imageSource1 : String = "xinshou17.png.u3d";
var imagePos1 : Vector2 = Vector2(63, 217);
var arrowDirection1 : String = "tobottom";
var arrowPos1 : Vector2 = Vector2(167, 404);
var buttonNormal1 : String = "cookbook/Btn_MakerIcon_Locked";
var buttonHover1 : String = "cookbook/Btn_MakerIcon_Locked";
var buttonPos1 : Vector2 = Vector2(170, 464);
//
var imageSource2 : String = "xinshou18.png.u3d";
var imagePos2 : Vector2 = Vector2(334, 155);
var arrowDirection2 : String = "";
var arrowPos2 : Vector2 = Vector2(300, 300);
var buttonNormal2 : String = "Newguide/ok-n";
var buttonHover2 : String = "Newguide/ok-h";
var buttonPos2 : Vector2 = Vector2(527, 305);
//
var ShakingIndex : int = 3;	// 扩展平台的索引,从1开始
//--------------------------------------------------
function Start() {
	NewHandGuideLogic.registEvent("COMPLETE_CUR_NEW_HAND_TASK", handleCompleteCurNewHandTask);
	NewHandGuideLogic.registEvent("OPEN_MAKE_FOOD_UI", openMakeFoodUI);
	//
	NewHandGuideLogic.openNewHandGuideUI(true);
	var btn : iGUIButton = null;
	if (UI.getUI().isUIRootOpen("BartenderUIRoot")) {	// 烹饪界面已打开
		btn = NewHandGuideLogic.showContent(imageSource1, imagePos1, arrowDirection1, arrowPos1, buttonNormal1, buttonHover1, buttonPos1);
		if (btn) {
			btn.clickCallback = ClickCallback_unlock_btn;
		}
	} else {	// 烹饪界面未打开
		btn = NewHandGuideLogic.showContent(imageSource, imagePos, arrowDirection, arrowPos, buttonNormal, buttonHover, buttonPos);
		if (btn) {
			btn.clickCallback = ClickCallback_open_bartender_ui_btn;
		}
	}
}
//
function OnDestroy() {
	NewHandGuideLogic.unregistEvent("COMPLETE_CUR_NEW_HAND_TASK", handleCompleteCurNewHandTask);
	NewHandGuideLogic.unregistEvent("OPEN_MAKE_FOOD_UI", openMakeFoodUI);
}
// 处理完成当前新手任务
function handleCompleteCurNewHandTask(obj : Object) : void {
	var btn : iGUIButton = NewHandGuideLogic.showContent(imageSource2, imagePos2, arrowDirection2, arrowPos2, buttonNormal2, buttonHover2, buttonPos2);
	if (btn) {
		btn.clickCallback = ClickCallback_ok_btn;
	}
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
		btn.clickCallback = ClickCallback_unlock_btn;
	}
}
// 点击解锁按钮
function ClickCallback_unlock_btn(caller : iGUIElement) : void {
	UI.getUI().OpenUIRoot("BarCntrProduceUI");
	UI.getUI().SetModal("BarCntrProduceUI", true);
	iGUICode_BarCntrProduceUI.getInstance().setUnlockBarCntrID(ShakingIndex - 1);
}
// 点击确定按钮
function ClickCallback_ok_btn(caller : iGUIElement) : void {
	NewHandGuideLogic.destroyNewHandTask(this.gameObject);
	NewHandGuideLogic.closeNewHandGuideUI();
}


