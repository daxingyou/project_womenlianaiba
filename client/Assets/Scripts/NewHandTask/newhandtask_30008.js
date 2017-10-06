#pragma strict
#pragma downcast
import iGUI;



var imageSource : String = "xinshou10.png.u3d";	// 提示图片的资源名,填""表示不显示图片
var imagePos : Vector2 = Vector2(334, 155);	// 提示图片的坐标位置
var arrowDirection : String = "tobottom";	// 箭头朝向("toleft","toright","totop","tobottom"),填""表示不显示箭头
var arrowPos : Vector2 = Vector2(701, 488);	// 箭头位置
var buttonNormal : String = "Common1/makefood_n";	// 按钮常态皮肤,填""表示不显示按钮
var buttonHover : String = "Common1/makefood_h";	// 按钮高亮皮肤,填""表示不显示按钮
var buttonPos : Vector2 = Vector2(706, 545);	// 按钮位置
// 
var imageSource1 : String = "xinshou10.png.u3d";
var imagePos1 : Vector2 = Vector2(425, 0);
var arrowDirection1 : String = "toright";
var arrowPos1 : Vector2 = Vector2(689, 81);
var buttonNormal1 : String = "cookbook/Btn_Cookbookunlock_n";
var buttonHover1 : String = "cookbook/Btn_Cookbookunlock_h";
var buttonPos1 : Vector2 = Vector2(748, 98);
//
private var NUM : int = 4;	// 解锁第4个食物
//--------------------------------------------------
function Start() {
	NewHandGuideLogic.registEvent("COMPLETE_CUR_NEW_HAND_TASK", handleCompleteCurNewHandTask);
	//
	NewHandGuideLogic.openNewHandGuideUI(true);
	var btn : iGUIButton = NewHandGuideLogic.showContent(imageSource, imagePos, arrowDirection, arrowPos, buttonNormal, buttonHover, buttonPos);
	if (btn) {
		btn.clickCallback = ClickCallback_open_bartender_ui_btn;
	}
	NewHandGuideLogic.registEvent("OPEN_MAKE_FOOD_UI", openMakeFoodUI);
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
		btn.clickCallback = ClickCallback_unlock_btn;
	}
}
//点击解锁按钮
function ClickCallback_unlock_btn(caller : iGUIElement) : void {
	var foodInfo : BartenderFoodBaseInfoRow = iGUICode_BartenderUI.getInstance().GetFoodInfoByIndex(NUM - 1);
	if (SelfItemLogic.getInstance().GetCurDiamond() >= foodInfo.unlock_diamond && 
		DataCenter.getMainPlayerCurLv() >= foodInfo.need_role_level) {
		Global.GetSysMsgHandler().RegistCallbackUserData(591, foodInfo.food_id);
		var params : ArrayList = new ArrayList();
		params.Add(foodInfo.unlock_diamond);
		Global.GetSysMsgHandler().ShowSysMsg(591, params);
	} else if (SelfItemLogic.getInstance().GetCurDiamond() < foodInfo.unlock_diamond) {
		Global.GetSysMsgHandler().ShowSysMsg(582);
	} else if (DataCenter.getMainPlayerCurLv() < foodInfo.need_role_level) {
		Global.GetSysMsgHandler().ShowSysMsg(572);
	}
}

