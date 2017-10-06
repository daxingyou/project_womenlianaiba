#pragma strict
import iGUI;



private static var instance : iGUICode_PersonalInfoUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}

@HideInInspector
var moName : iGUITextfield;
@HideInInspector
var closeModifyPanel : iGUIButton;
@HideInInspector
var OKModify : iGUIButton;
@HideInInspector
var moSignature : iGUITextarea;
@HideInInspector
var moHobby : iGUITextarea;
@HideInInspector
var moContact : iGUITextfield;
@HideInInspector
var moJob : iGUITextfield;
@HideInInspector
var moPositionRegion : iGUIDropDownList;
@HideInInspector
var moPositionProvince : iGUIDropDownList;
@HideInInspector
var moSalary : iGUIDropDownList;
@HideInInspector
var moDegree : iGUIDropDownList;
@HideInInspector
var moWeight : iGUIDropDownList;
@HideInInspector
var moHeight : iGUIDropDownList;
@HideInInspector
var moBloodType : iGUIDropDownList;
@HideInInspector
var moXingzuo : iGUIDropDownList;
@HideInInspector
var moBirthdayDay : iGUIDropDownList;
@HideInInspector
var moBirthdayMonth : iGUIDropDownList;
@HideInInspector
var moBirthdayYear : iGUIDropDownList;
@HideInInspector
var moShengxiao : iGUIDropDownList;
@HideInInspector
var modifyPanel : iGUIPanel;

@HideInInspector
var closeInfoPanel : iGUIButton;
@HideInInspector
var femaleInfo : iGUIButton;
@HideInInspector
var maleInfo : iGUIButton;
@HideInInspector
var infoSignature : iGUILabel;
@HideInInspector
var infoHobby : iGUILabel;
@HideInInspector
var infoContact : iGUILabel;
@HideInInspector
var infoPosition : iGUILabel;
@HideInInspector
var infoSalary : iGUILabel;
@HideInInspector
var infoJob : iGUILabel;
@HideInInspector
var infoDegree : iGUILabel;
@HideInInspector
var infoWeight : iGUILabel;
@HideInInspector
var infoHeigt : iGUILabel;
@HideInInspector
var infoBloodType : iGUILabel;
@HideInInspector
var infoXingzuo : iGUILabel;
@HideInInspector
var infoBirthday : iGUILabel;
@HideInInspector
var infoShengxiao : iGUILabel;
@HideInInspector
var infoSex : iGUILabel;

@HideInInspector
var modifyInfo : iGUIButton;
@HideInInspector
var visitHer : iGUIButton;
@HideInInspector
var giftHer : iGUIButton;
@HideInInspector
var focusHer : iGUIButton;
@HideInInspector
var headName : iGUILabel;
@HideInInspector
var headImage : iGUILabel;
@HideInInspector
var headPanel : iGUIPanel;
@HideInInspector
var InfoPanel : iGUIPanel;
@HideInInspector
var root : iGUIRoot;

function Start()
{
	moPositionProvince.valueChangeCallback = ValueChange_moPositionProvince;
	moBirthdayYear.valueChangeCallback = ValueChange_moBirthdayYear;
	moBirthdayMonth.valueChangeCallback = ValueChange_moBirthdayMonth;
	
	closeModifyPanel.clickCallback = Click_closeModifyPanel;
	closeInfoPanel.clickCallback = Click_closeInfoPanel;
	
	modifyInfo.clickCallback = Click_modifyInfo;
	focusHer.clickCallback = Click_focusHer;
	giftHer.clickCallback = Click_giftHer;
	visitHer.clickCallback = Click_visitHer;
	
	OKModify.clickCallback = Click_OKModify;
	
	maleInfo.clickCallback = Click_maleInfo;
	femaleInfo.clickCallback = Click_femaleInfo;
}

function ValueChange_moPositionProvince(caller : iGUIElement)
{
	PersonalInfo.getInstance().provinceChange((caller as iGUIDropDownList).selectedIndex);
}

function ValueChange_moBirthdayYear(caller : iGUIElement)
{
	PersonalInfo.getInstance().calcYearMonthDay();
}

function ValueChange_moBirthdayMonth(caller : iGUIElement)
{
	PersonalInfo.getInstance().calcYearMonthDay();
}

function Click_closeModifyPanel(caller : iGUIElement)
{
	PersonalInfo.getInstance().clickCloseModify();
}

function Click_closeInfoPanel(caller : iGUIElement)
{
	PersonalInfo.getInstance().clickClose();
}

function Click_modifyInfo(caller : iGUIElement)
{
	PersonalInfo.getInstance().clickModifyInfoButton();
}

function Click_focusHer(caller : iGUIElement)
{
	PersonalInfo.getInstance().clickFocus();
}
function Click_giftHer(caller : iGUIElement)
{
	PersonalInfo.getInstance().clickGift();
}
function Click_visitHer(caller : iGUIElement)
{
	PersonalInfo.getInstance().clickVisit();
}

function Click_OKModify(caller : iGUIElement)
{
	PersonalInfo.getInstance().clickOKModifyButton();
}

function Click_maleInfo(caller : iGUIElement)
{
	PersonalInfo.getInstance().changeSexPanel(true);
}

function Click_femaleInfo(caller : iGUIElement)
{
	PersonalInfo.getInstance().changeSexPanel(false);
}