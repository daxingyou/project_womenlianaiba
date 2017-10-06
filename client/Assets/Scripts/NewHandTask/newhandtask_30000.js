#pragma strict
#pragma downcast
import iGUI;



var imageSource : String = "xinshou01.png.u3d";	// 提示图片的资源名,填""表示不显示图片
var imagePos : Vector2 = Vector2(334, 155);	// 提示图片的坐标位置
var arrowDirection : String = "";	// 箭头朝向("toleft","toright","totop","tobottom"),填""表示不显示箭头
var arrowPos : Vector2 = Vector2(0, 0);	// 箭头位置
var buttonNormal : String = "NewGuide/ok-n";	// 按钮常态皮肤,填""表示不显示按钮
var buttonHover : String = "NewGuide/ok-h";	// 按钮高亮皮肤,填""表示不显示按钮
var buttonPos : Vector2 = Vector2(527, 305);	// 按钮位置
//--------------------------------------------------
function Start() {
	NewHandGuideLogic.registEvent("COMPLETE_CUR_NEW_HAND_TASK", handleCompleteCurNewHandTask);
	//
	NewHandGuideLogic.openNewHandGuideUI(true);
	var btn : iGUIButton = NewHandGuideLogic.showContent(imageSource, imagePos, arrowDirection, arrowPos, buttonNormal, buttonHover, buttonPos);
	if (btn) {
		btn.clickCallback = ClickCallback_ok_btn;
	}
}
//
function OnDestroy() {
	NewHandGuideLogic.unregistEvent("COMPLETE_CUR_NEW_HAND_TASK", handleCompleteCurNewHandTask);
}
// 处理完成当前新手任务
function handleCompleteCurNewHandTask(obj : Object) : void {
	NewHandGuideLogic.destroyNewHandTask(this.gameObject);
	NewHandGuideLogic.closeNewHandGuideUI();
}
// 点击确定按钮
function ClickCallback_ok_btn(caller : iGUIElement) : void {
	NewHandGuideLogic.requestCloseWindows(close_window_type.cwt_welcome);
}


