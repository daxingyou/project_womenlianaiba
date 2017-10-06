#pragma strict
#pragma downcast
import iGUI;



var imageSource : String = "xinshou09.png.u3d";	// 提示图片的资源名,填""表示不显示图片
var imagePos : Vector2 = Vector2(0, 110);	// 提示图片的坐标位置
var arrowDirection : String = "";	// 箭头朝向("toleft","toright","totop","tobottom"),填""表示不显示箭头
var arrowPos : Vector2 = Vector2(300, 300);	// 箭头位置
var buttonNormal : String = "";	// 按钮常态皮肤,填""表示不显示按钮
var buttonHover : String = "";	// 按钮高亮皮肤,填""表示不显示按钮
var buttonPos : Vector2 = Vector2(500, 500);	// 按钮位置
//--------------------------------------------------
function Start() {
	NewHandGuideLogic.registEvent("COMPLETE_CUR_NEW_HAND_TASK", handleCompleteCurNewHandTask);
	//
	NewHandGuideLogic.openNewHandGuideUI(false);
	NewHandGuideLogic.showContent(imageSource, imagePos, arrowDirection, arrowPos, buttonNormal, buttonHover, buttonPos);
	setOtherBtnsVisible(false);
}
//
function OnDestroy() {
	NewHandGuideLogic.unregistEvent("COMPLETE_CUR_NEW_HAND_TASK", handleCompleteCurNewHandTask);
}
// 处理完成当前新手任务
function handleCompleteCurNewHandTask(obj : Object) : void {
	NewHandGuideLogic.destroyNewHandTask(this.gameObject);
	NewHandGuideLogic.closeNewHandGuideUI();
	setOtherBtnsVisible(true);
}
//显示/隐藏其他按钮
function setOtherBtnsVisible(visible : boolean) : void {
	var gui : iGUICode_MainUI = iGUICode_MainUI.getInstance();
	if (null == gui) {
		return;
	}
	gui.BtnDiamondRecharge.setEnabled(visible);
	gui.BtnFriendInvite.setEnabled(visible);
	gui.BtnPropShop.setEnabled(visible);
	gui.BtnQQHomeNewer.setEnabled(visible);
	gui.BtnRankList.setEnabled(visible);
	gui.changeWaiterBtn.setEnabled(visible);
	gui.collect_btn.setEnabled(visible);
	gui.disableDlgBtn.setEnabled(visible);
	gui.DlgContainer.setEnabled(visible);
	gui.exchangBtn.setEnabled(visible);
	gui.firstPayBtn.setEnabled(visible);
	gui.flower.setEnabled(visible);
	gui.function_button_list.setEnabled(visible);
	gui.halfWallBtn.setEnabled(visible);
	gui.HouseName.setEnabled(visible);
	gui.makeFoodBtn.setEnabled(visible);
	gui.NoticeBtn.setEnabled(visible);
	gui.SinglePayBtn.setEnabled(visible);
	gui.speakerBtn.setEnabled(visible);
	gui.SummonPanel.setEnabled(visible);
	gui.runSwitchBtn.setEnabled(visible);
	UI.getUI().EnableUIRoot("SysBoardUI", visible);
}


