#pragma strict
#pragma downcast
import iGUI;

private static var instance : iGUICode_Peidui;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}

@HideInInspector
var BtnCheckCal : iGUIButton;
@HideInInspector
var BtnCheckCancel : iGUIButton;
@HideInInspector
var BtnCheckSure : iGUIButton;
@HideInInspector
var PanCheckMerry : iGUIPanel;
@HideInInspector
var BtnCloseCost : iGUIButton;
@HideInInspector
var BtnCalCost : iGUIButton;
@HideInInspector
var TFTargetLevel : iGUITextfield;
@HideInInspector
var TFSelfLevel : iGUITextfield;
@HideInInspector
var LabCost : iGUILabel;
@HideInInspector
var BtnCal : iGUIButton;
@HideInInspector
var PanCost : iGUIPanel;
@HideInInspector
var p1Url : iGUIButton;
@HideInInspector
var spNext : iGUIButton;
@HideInInspector
var spPrev : iGUIButton;
@HideInInspector
var spClose : iGUIButton;
@HideInInspector
var spSlotName3 : iGUILabel;
@HideInInspector
var spSlotName2 : iGUILabel;
@HideInInspector
var spSlotName1 : iGUILabel;
@HideInInspector
var spSlotImage3 : iGUILabel;
@HideInInspector
var spSlotImage2 : iGUILabel;
@HideInInspector
var spSlotImage1 : iGUILabel;
@HideInInspector
var spSlotBase3 : iGUIImage;
@HideInInspector
var spSlotBase1 : iGUIImage;
@HideInInspector
var spSlotBase2 : iGUIImage;
@HideInInspector
var SelectPanel : iGUIPanel;
@HideInInspector
var p1FemaleQQ : iGUITextfield;
@HideInInspector
var p1MaleQQ : iGUITextfield;
@HideInInspector
var MalePanel : iGUIPanel;
@HideInInspector
var MaleImage : iGUIImage;
@HideInInspector
var FemalePanel : iGUIPanel;
@HideInInspector
var FemaleImage : iGUIImage;
@HideInInspector
var Peidui1Panel : iGUIPanel;
@HideInInspector
var p1Close : iGUIButton;
@HideInInspector
var p1OK : iGUIButton;
@HideInInspector
var root : iGUIRoot;


private var peduiGndIcon : AsynIcon;
private var mSelfLv : int = 0;
private var mTargetLv : int = 0;

function Start()
{
	RegisterCallbacks();

	//异步加载配对背景
	peduiGndIcon = new AsynIcon(function (tex){
								 	Peidui1Panel.style.normal.background = tex; 
							}, null);
	
	var peidui_gnd : String = "";
	if (PlatformMgr.IsPlatQZone() || PlatformMgr.IsPlatPY() || PlatformMgr.IsPlatQTwiter())		// qzone,朋友网,微博
	{
		peidui_gnd = "peidui_gnd.png.u3d";
	}
	else if (PlatformMgr.IsPlatYY())	// YY
	{
		peidui_gnd = "peidui_gnd_YY.png.u3d";
	}
	
	if (String.IsNullOrEmpty(peidui_gnd))
		throw Exception("iGUICode_Peidui -> Start() -> platform is wrong.");
	
	peduiGndIcon.load("UI/" + peidui_gnd);
}

function OnDestroy () {
    peduiGndIcon.cancel();
}

function RegisterCallbacks()
{
	MaleImage.clickCallback = Click_MaleImage;
	FemaleImage.clickCallback = Click_FemaleImage;
	
	p1Close.clickCallback = Click_p1Close;
	p1OK.clickCallback = Click_p1OK;
	p1Url.clickCallback = Click_p1Url;
	
	spClose.clickCallback = Click_spClose;
	spNext.clickCallback = Click_spNext;
	spPrev.clickCallback = Click_spPrev;
	spSlotBase1.clickCallback = Click_spSlotBase1;
	spSlotBase2.clickCallback = Click_spSlotBase2;
	spSlotBase3.clickCallback = Click_spSlotBase3;
	
	BtnCalCost.clickCallback = CallbackMouseClickCalCost;
	BtnCloseCost.clickCallback = CallbackMouseClickClose;
	BtnCal.clickCallback = CallbackMouseClickCal;
	TFSelfLevel.valueChangeCallback = CallbackValueChangeSelf;
	TFTargetLevel.valueChangeCallback = CallbackValueChangeTarget;
	
	BtnCheckCal.clickCallback = CallbackMouseClickCalCost;
	BtnCheckCancel.clickCallback = CallbackMouseClickCheckClose;
	BtnCheckSure.clickCallback = CallbackMouseClickCheckSure;
}

function EnableCost(enable : boolean) : void {
	PanCost.setEnabled(enable);
	
	if(!enable) {
		TFSelfLevel.setValue("");
		TFTargetLevel.setValue("");
	} else {
		LabCost.label.text = "0";
	}
}

function EnableMerryCheck(enable : boolean) : void {
	PanCheckMerry.setEnabled(enable);
}

function Click_MaleImage(caller : iGUIElement){
	Peidui.getInstance().ClickPeiduiProfile();
}

function Click_FemaleImage(caller : iGUIElement){
	Peidui.getInstance().ClickPeiduiProfile();
}

function Click_p1Close(caller : iGUIElement){
	Peidui.getInstance().closePeidui1();
}

function Click_p1OK(caller : iGUIElement){
	Peidui.getInstance().holdLeaveLove();
}

function Click_p1Url(caller : iGUIElement){
	//Application.OpenURL ("http://sobar.soso.com/t/87189330/");
	ExternalFlatform.OpenUrl("http://sobar.soso.com/t/87189330/");
}

function Click_spClose(caller : iGUIElement){
	Peidui.getInstance().closeSelectPanel(true);
}

function Click_spPrev(caller : iGUIElement){
	Peidui.getInstance().prevPage();
}

function Click_spNext(caller : iGUIElement){
	Peidui.getInstance().nextPage();
}

function Click_spSlotBase1(caller : iGUIElement){
	Peidui.getInstance().clickMateSlot(0);
}

function Click_spSlotBase2(caller : iGUIElement){
	Peidui.getInstance().clickMateSlot(1);
}

function Click_spSlotBase3(caller : iGUIElement){
	Peidui.getInstance().clickMateSlot(2);
}

function CallbackMouseClickCalCost(caller : iGUIElement) {
	EnableCost(true);
}

function CallbackMouseClickClose(caller : iGUIElement) {
	EnableCost(false);
}

function CallbackMouseClickCheckClose(caller : iGUIElement) {
	EnableMerryCheck(false);
}

function CallbackMouseClickCheckSure(caller : iGUIElement) {
	EnableMerryCheck(false);
	Peidui.getInstance().CheckSureMerry();
}

function CallbackMouseClickCal(caller : iGUIElement) {
	var selfCost = Peidui.getInstance().GetMerryCost(mSelfLv);
	var targetCost = Peidui.getInstance().GetMerryCost(mTargetLv);
	
	if(selfCost==0 && targetCost == 0) {
		LabCost.label.text = "0";
	} else {
		var cost : int = Mathf.Abs(selfCost-targetCost) + 100;
		LabCost.label.text = cost.ToString();
	}
}

private var selfText : String = "";
function CallbackValueChangeSelf(caller : iGUITextfield) {
	var level : int = 0;
	if(caller.value == "") {
		selfText = caller.value;
		mSelfLv = level;
	} else if(int.TryParse(caller.value, level)) {
		if(level > 0 && level <= 60) {
			selfText = caller.value;
			mSelfLv = level;
		} else {
			caller.setValue(selfText);
		}
	} else {
		caller.setValue(selfText);
	}
}

private var targetText : String = "";
function CallbackValueChangeTarget(caller : iGUITextfield) {
	var level : int = 0;
	if(caller.value == "") {
		targetText = caller.value;
		mTargetLv = level;
	} else if(int.TryParse(caller.value, level)) {
		if(level > 0 && level <= 60) {
			targetText = caller.value;
			mTargetLv = level;
		} else {
			caller.setValue(targetText);
		}
	} else {
		caller.setValue(targetText);
	}
}

