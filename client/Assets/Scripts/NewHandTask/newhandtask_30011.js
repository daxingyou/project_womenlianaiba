#pragma strict
#pragma downcast
import iGUI;



var imageSource : String = "xinshou13.png.u3d";	// 提示图片的资源名,填""表示不显示图片
var imagePos : Vector2 = Vector2(334, 155);	// 提示图片的坐标位置
var arrowDirection : String = "tobottom";	// 箭头朝向("toleft","toright","totop","tobottom"),填""表示不显示箭头
var arrowPos : Vector2 = Vector2(84, 529);	// 箭头位置
var buttonNormal : String = "MainUI/house_hover";	// 按钮常态皮肤,填""表示不显示按钮
var buttonHover : String = "MainUI/house_hover";	// 按钮高亮皮肤,填""表示不显示按钮
var buttonPos : Vector2 = Vector2(98, 586);	// 按钮位置
//
var imageSource1 : String = "";
var imagePos1 : Vector2 = Vector2(100, 100);
var arrowDirection1 : String = "toleft";
var arrowPos1 : Vector2 = Vector2(291, 173);
var buttonNormal1 : String = "HouseUpdate/fangwu_qx";
var buttonHover1 : String = "HouseUpdate/fangwu_qx_hover";
var buttonPos1 : Vector2 = Vector2(239, 174);
// 
var imageSource2 : String = "";
var imagePos2 : Vector2 = Vector2(100, 100);
var arrowDirection2 : String = "tobottom";
var arrowPos2 : Vector2 = Vector2(254, 348);
var buttonNormal2 : String = "HouseUpdate/fangwu_genghuan";
var buttonHover2 : String = "HouseUpdate/fangwu_genghuan_hover";
var buttonPos2 : Vector2 = Vector2(235, 400);
//
private var mHouseRightRow : HouseRightRow = null;
//--------------------------------------------------
function Start() {
	NewHandGuideLogic.registEvent("COMPLETE_CUR_NEW_HAND_TASK", handleCompleteCurNewHandTask);
	NewHandGuideLogic.registEvent("ADD_RIGHT_ICON_CONTAINER", addRightIconContainer);
	NewHandGuideLogic.registEvent("ADD_HOUSE_ICON_CONTAINER", addHouseIconContainer);
	//
	NewHandGuideLogic.openNewHandGuideUI(true);
	var btn : iGUIButton = NewHandGuideLogic.showContent(imageSource, imagePos, arrowDirection, arrowPos, buttonNormal, buttonHover, buttonPos);
	if (btn) {
		btn.clickCallback = ClickCallback_open_house_ui_btn;
	}
}
//
function OnDestroy() {
	NewHandGuideLogic.unregistEvent("COMPLETE_CUR_NEW_HAND_TASK", handleCompleteCurNewHandTask);
	NewHandGuideLogic.unregistEvent("ADD_RIGHT_ICON_CONTAINER", addRightIconContainer);
	NewHandGuideLogic.unregistEvent("ADD_HOUSE_ICON_CONTAINER", addHouseIconContainer);
}
// 处理完成当前新手任务
function handleCompleteCurNewHandTask(obj : Object) : void {
	NewHandGuideLogic.destroyNewHandTask(this.gameObject);
	NewHandGuideLogic.closeNewHandGuideUI();
}
// 点击打开房屋界面按钮
function ClickCallback_open_house_ui_btn(caller : iGUIElement) : void {
	NewHandGuideLogic.closeNewHandGuideUI();
	if(EQGameSceneMgr.getSingleton().gameSceneType() == SceneType.COMM_SCENE) {
		return;
	}
	if (DataCenter.isInSelfHouse()) {
		iGUICode_HouseUpdateRoot.OpenHouseUpdateRoot();
		NewHandGuideLogic.openNewHandGuideUI(true);
		var btn : iGUIButton = NewHandGuideLogic.showContent(imageSource1, imagePos1, arrowDirection1, arrowPos1, buttonNormal1, buttonHover1, buttonPos1);
		if (btn) {
			btn.clickCallback = ClickCallback_one_level_btn;
		}
	} else {
		Global.GetSysMsgHandler().ShowSysMsg(419);
	}
}
// 添加权限图标
function addRightIconContainer(obj : Object) : void {
	if (null == mHouseRightRow) {
		mHouseRightRow = obj as HouseRightRow;
	}
}
// 添加房屋图标
function addHouseIconContainer(obj : Object) : void {
	var img : iGUIImage = obj as iGUIImage;
	var itm : PlayerHouseRow = img.userData as PlayerHouseRow;
	if (110101 == itm.id) {
		img.clickCallback(img);
	}
}
// 点击1级权限按钮
function ClickCallback_one_level_btn(caller : iGUIElement) : void {
	caller.userData = mHouseRightRow;
	iGUICode_HouseUpdateRoot.getInstance().ClickCallback_RightItmImg(caller);
	//
	var btn : iGUIButton = NewHandGuideLogic.showContent(imageSource2, imagePos2, arrowDirection2, arrowPos2, buttonNormal2, buttonHover2, buttonPos2);
	if (btn) {
		btn.clickCallback = ClickCallback_change_house_btn;
	}
}
// 点击更换户型按钮
function ClickCallback_change_house_btn(caller : iGUIElement) : void {
	iGUICode_HouseUpdateRoot.getInstance().ClickCallback_move_btn(null);
}


