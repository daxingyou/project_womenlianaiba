#pragma strict

import iGUI;

var panel_bg_girl : String = "welcome_bg_female.png.u3d";
var panel_bg_boy : String = "welcome_bg_male.png.u3d";
var panel_bg_lovers : String = "welcome_bg_lovers.png.u3d";
var show_life : float = 3000f;
private var mTimer : Timer;
private var mCurWelcomeTxt : String = "";
private var mNewWelcomeTxt : String = "";
private static var instance : iGUICode_WelcomeRoot;
function Awake(){
	instance=this;
	RegistEvent();
}
static function getInstance(){
	return instance;
}


@HideInInspector
var limitTip : iGUIImage;
@HideInInspector
var titleImg : iGUIImage;
@HideInInspector
var button_close_setupwin : iGUIButton;
@HideInInspector
var button_setup_ok : iGUIButton;
@HideInInspector
var welcome_edit : iGUITextarea;
@HideInInspector
var button_ok : iGUIButton;
@HideInInspector
var welcome_txt : iGUILabel;
@HideInInspector
var welcome_SetupWin : iGUIWindow;
@HideInInspector
var welcomeShowWindow : iGUIPanel;
@HideInInspector
var welcomeRoot : iGUIRoot;
//--
function Start() {
	button_ok.clickCallback 			= _ClickCallback_button_ok;
	button_setup_ok.clickCallback 		= _ClickCallback_button_setup_ok;
	button_close_setupwin.clickCallback = _ClickCallback_button_close_setupwin;
}
//--
function RegistEvent(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_OPEN_SETUPWIN), HandleOpenSetupWin);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.SHOW_WELCOMETEXT), HandleShowWelcomeText);
	
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_SELF_WELCOMETEXT), HandleSetSelfWelcomeText);
}
//--
function HandleSetSelfWelcomeText(evt : GameEvent, obj : house_info){
	mNewWelcomeTxt = "";
	mCurWelcomeTxt = obj.welcome_words;
}
//--处理接收欢迎语逻辑
function HandleShowWelcomeText(evt : GameEvent, obj : house_info){
	//1.在文字标签框中填入欢迎语文本
	//2.根据单身时的性别，是否情侣显示不同的窗口背景
	//3.显示窗口
	_SetWelcomeText(obj.welcome_words);
	_SetWelcomeShowWinBg(obj);
	OpenWelcomeShowWin();
}
//--
private function _SetWelcomeShowWinBg(obj:house_info){
	var _asynIcon : AsynIcon = new AsynIcon(function (tex : Texture){welcomeShowWindow.style.normal.background = tex as Texture2D; }, null);
	var bg_img_name : String = "";
	var house : PlayerHouse = EQGameSceneMgr.getSingleton().getHouse();
	if(!house.hasTwoOwner()){
		if(obj.boy == "" && obj.girl != ""){
			bg_img_name = panel_bg_girl;
		}
		else if(obj.boy != "" && obj.girl == ""){
			bg_img_name = panel_bg_boy;
		}
	}
	else{
		bg_img_name = panel_bg_lovers;
	}
	_asynIcon.load("UI/" + bg_img_name); 
}
//--
private function _SetWelcomeText(txt : String){
	welcome_txt.label.text = txt;
}
//--打开欢迎语显示界面
public function OpenWelcomeShowWin(){
	OpenWelcomeRoot();
	CloseWelcomeShowWin();
	//UI.getUI().SetModal("WelcomeRoot", true);
	welcomeShowWindow.setEnabled(true);
	//
	if(mTimer)
		mTimer.Reset();
	mTimer = new Timer(show_life,1f);
	mTimer.addEventListener(TimerEvent.TIMER, _OnTimer);
	mTimer.addEventListener(TimerEvent.TIMER_COMPLETE, _OnTimerComplete);
	mTimer.Start();

}
//--
function _OnTimer(_timer : Timer, obj : Object){
	CloseWelcomeShowWin();
}
//--
function _OnTimerComplete(_timer : Timer, obj : Object){

}
//--打开设置界面
public function OpenSetupWin(){
	//OpenWelcomeRoot();
	if(mNewWelcomeTxt == ""){
		welcome_edit.value = mCurWelcomeTxt;
	}
	else
		welcome_edit.value = mNewWelcomeTxt;
	welcome_SetupWin.setEnabled(true);
	UI.getUI().SetModal("WelcomeRoot", true);
}
//--关闭欢迎语显示界面
public function CloseWelcomeShowWin(){
	welcomeShowWindow.setEnabled(false);
	//yield WaitForSeconds(0.5f);
	//UI.getUI().SetModal("WelcomeRoot", false);
	//_CloseWelcomeRoot();
}
//--关闭设置界面
public function CloseSetupWin(){
	welcome_SetupWin.setEnabled(false);
	UI.getUI().SetModal("WelcomeRoot", false);
	//_CloseWelcomeRoot();
}
//--请求设置欢迎语
private function ReqSetupWelcomeText() : boolean{
	//todo：1.获取设置文本框的文字内容
	//todo：2.构造请求协议结构，填充数据
	//todo：3。发送请求
	var input_value : String = welcome_edit.value;
	if(input_value == ""){
		UI.getUI().OpenMsgbox("",Define.getContent(5211),true);
		return false;
	}
	var req : req_set_house_welcome_words = new req_set_house_welcome_words();
	req.words = input_value;
	NetHelper.Send(req);
	mNewWelcomeTxt = input_value;
	return true;
}
//--按钮回调
private function _ClickCallback_button_ok(caller : iGUIElement){
	//todo：1.关闭欢迎语显示窗口
	CloseWelcomeShowWin();
}
//--按钮回调
private function _ClickCallback_button_setup_ok(caller : iGUIElement){
	//1.请求设置欢迎语
	//2.关闭设置窗口
	if(ReqSetupWelcomeText()){
		CloseSetupWin();
	}
}
//--按钮回调
private function _ClickCallback_button_close_setupwin(caller : iGUIElement){
	//1.关闭设置窗口界面
	CloseSetupWin();
}
//--
private function HandleOpenSetupWin(evt : GameEvent, obj : Object){
	OpenSetupWin();
}
//--打开欢迎语Root
static function OpenWelcomeRoot(){
	if(!UI.getUI().GetUIRoot("WelcomeRoot"))
		UI.getUI().OpenUIRoot("WelcomeRoot");
	
	//UI.getUI().SetModal("WelcomeRoot", true);
}
/*
//--关闭欢迎语Root
private static function _CloseWelcomeRoot(){
	if(UI.getUI().GetUIRoot("WelcomeRoot"))
		UI.getUI().CloseUIRoot("WelcomeRoot");
	
	//UI.getUI().SetModal("WelcomeRoot", false);
}
*/