#pragma strict
#pragma downcast
import iGUI;



var imageSource : String = "xinshou14.png.u3d";	// 提示图片的资源名,填""表示不显示图片
var imagePos : Vector2 = Vector2(334, 155);	// 提示图片的坐标位置
var arrowDirection : String = "tobottom";	// 箭头朝向("toleft","toright","totop","tobottom"),填""表示不显示箭头
var arrowPos : Vector2 = Vector2(39, 531);	// 箭头位置
var buttonNormal : String = "MainUI/decorate_btn";	// 按钮常态皮肤,填""表示不显示按钮
var buttonHover : String = "MainUI/decorate_btn_hover";	// 按钮高亮皮肤,填""表示不显示按钮
var buttonPos : Vector2 = Vector2(50, 586);	// 按钮位置
//
var imageSource1 : String = "xinshou14.png.u3d";
var imagePos1 : Vector2 = Vector2(334, 155);
var arrowDirection1 : String = "tobottom";
var arrowPos1 : Vector2 = Vector2(428, 485);
var buttonNormal1 : String = "NewGuide/type0001";
var buttonHover1 : String = "NewGuide/type0001";
var buttonPos1 : Vector2 = Vector2(432, 542);
//
var imageSource2 : String = "";
var imagePos2 : Vector2 = Vector2(100, 100);
var arrowDirection2 : String = "tobottom";
var arrowPos2 : Vector2 = Vector2(604, 443);
var buttonNormal2 : String = "NewGuide/tm";
var buttonHover2 : String = "NewGuide/tm";
var buttonPos2 : Vector2 = Vector2(595, 503);
//
var imageSource3 : String = "";
var imagePos3 : Vector2 = Vector2(100, 100);
var arrowDirection3 : String = "tobottom";
var arrowPos3 : Vector2 = Vector2(694, 443);
var buttonNormal3 : String = "NewGuide/tm";
var buttonHover3 : String = "NewGuide/tm";
var buttonPos3 : Vector2 = Vector2(684, 503);
//
//--------------------------------------------------
function Start() {
	NewHandGuideLogic.registEvent("COMPLETE_CUR_NEW_HAND_TASK", handleCompleteCurNewHandTask);
	NewHandGuideLogic.registEvent("OPEN_FITMENT_UI", openFitmentUI);
	//
	NewHandGuideLogic.openNewHandGuideUI(true);
	var btn : iGUIButton = NewHandGuideLogic.showContent(imageSource, imagePos, arrowDirection, arrowPos, buttonNormal, buttonHover, buttonPos);
	if (btn) {
		btn.clickCallback = ClickCallback_fitment_btn;
	}
}
//
function OnDestroy() {
	NewHandGuideLogic.unregistEvent("COMPLETE_CUR_NEW_HAND_TASK", handleCompleteCurNewHandTask);
	NewHandGuideLogic.unregistEvent("OPEN_FITMENT_UI", openFitmentUI);
}
// 处理完成当前新手任务
function handleCompleteCurNewHandTask(obj : Object) : void {
	NewHandGuideLogic.destroyNewHandTask(this.gameObject);
	NewHandGuideLogic.closeNewHandGuideUI();
}
// 点击加载按钮
function ClickCallback_fitment_btn(caller : iGUIElement) : void {
	NewHandGuideLogic.closeNewHandGuideUI();
	iGUICode_MainUI.getInstance().ClickCallbackFitment(null);
}
// 打开家装界面
function openFitmentUI(obj : Object) : void {
	NewHandGuideLogic.openNewHandGuideUI(true);
	var btn : iGUIButton = NewHandGuideLogic.showContent(imageSource1, imagePos1, arrowDirection1, arrowPos1, buttonNormal1, buttonHover1, buttonPos1);
	if (btn) {
		btn.clickCallback = ClickCallback_pink_type_btn;
	}
}
// 点击粉红分类按钮
function ClickCallback_pink_type_btn(caller : iGUIElement) : void {
	FitmentLogic.getInstance().handleFitmentType(5);
	var btn : iGUIButton = NewHandGuideLogic.showContent(imageSource2, imagePos2, arrowDirection2, arrowPos2, buttonNormal2, buttonHover2, buttonPos2);
	if (btn) {
		btn.clickCallback = ClickCallback_auto_fitment_btn;
	}
}
// 点击自动家装按钮
function ClickCallback_auto_fitment_btn(caller : iGUIElement) : void {
	iGUICode_StorageBoxUI.getInstance().ClickCallback_auto_fitment_btn(null);
	var btn : iGUIButton = NewHandGuideLogic.showContent(imageSource3, imagePos3, arrowDirection3, arrowPos3, buttonNormal3, buttonHover3, buttonPos3);
	if (btn) {
		btn.clickCallback = ClickCallback_save_btn;
	}
}
// 点击保存家装按钮
function ClickCallback_save_btn(caller : iGUIElement) : void {
	iGUICode_StorageBoxUI.getInstance().ClickCallback_shop_save_btn(null);
}


