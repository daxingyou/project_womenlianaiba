#pragma strict
#pragma downcast
import iGUI;

private static var instance : iGUICode_PhotoFriend;
function Awake(){
	instance=this;
	//syncToList();
}
static function getInstance(){
	return instance;
}
@HideInInspector
var countdown : iGUILabel;
@HideInInspector
var countdown_txt : iGUILabel;
@HideInInspector
var focus10 : iGUIButton;
@HideInInspector
var focus9 : iGUIButton;
@HideInInspector
var focus8 : iGUIButton;
@HideInInspector
var focus7 : iGUIButton;
@HideInInspector
var focus6 : iGUIButton;
@HideInInspector
var focus5 : iGUIButton;
@HideInInspector
var focus4 : iGUIButton;
@HideInInspector
var focus3 : iGUIButton;
@HideInInspector
var focus2 : iGUIButton;
@HideInInspector
var focus1 : iGUIButton;
@HideInInspector
var visit10 : iGUIButton;
@HideInInspector
var visit9 : iGUIButton;
@HideInInspector
var visit8 : iGUIButton;
@HideInInspector
var visit7 : iGUIButton;
@HideInInspector
var visit6 : iGUIButton;
@HideInInspector
var visit5 : iGUIButton;
@HideInInspector
var visit4 : iGUIButton;
@HideInInspector
var visit3 : iGUIButton;
@HideInInspector
var visit2 : iGUIButton;
@HideInInspector
var visit1 : iGUIButton;
@HideInInspector
var close : iGUIButton;
@HideInInspector
var changeFriend : iGUIButton;
@HideInInspector
var photoName10 : iGUILabel;
@HideInInspector
var photoImg10 : iGUILabel;
@HideInInspector
var photoName9 : iGUILabel;
@HideInInspector
var photoImg9 : iGUILabel;
@HideInInspector
var photoName8 : iGUILabel;
@HideInInspector
var photoImg8 : iGUILabel;
@HideInInspector
var photoName7 : iGUILabel;
@HideInInspector
var photoImg7 : iGUILabel;
@HideInInspector
var photoName6 : iGUILabel;
@HideInInspector
var photoImg6 : iGUILabel;
@HideInInspector
var photoName5 : iGUILabel;
@HideInInspector
var photoImg5 : iGUILabel;
@HideInInspector
var photoName4 : iGUILabel;
@HideInInspector
var photoImg4 : iGUILabel;
@HideInInspector
var photoName3 : iGUILabel;
@HideInInspector
var photoImg3 : iGUILabel;
@HideInInspector
var photoName2 : iGUILabel;
@HideInInspector
var photoImg2 : iGUILabel;
@HideInInspector
var photoName1 : iGUILabel;
@HideInInspector
var photoImg1 : iGUILabel;
@HideInInspector
var PhotoFriendPanel : iGUIPanel;
@HideInInspector
var root : iGUIRoot;

//-------------------------------------
var disableRootArr : Array = null;


function Start()
{
	RegisterCallbacks();

//	//异步加载配对背景
//	peduiGndIcon = new AsynIcon(function (tex){
//								 	Peidui1Panel.style.normal.background = tex; 
//							}, null);	
//	peduiGndIcon.load("UI/peidui_gnd.png.u3d");
}

//function OnDestroy () {
//    peduiGndIcon.cancel();
//}

function syncToList()
{
	var MainPlayer:GameObject = ScenePlayerMgr.getMainPlayer();
	var male:boolean = (MainPlayer.GetComponent("Player") as Player).isMale();
	
	PhotoFriend.getInstance().slotImage.Add(photoImg1);
	PhotoFriend.getInstance().slotImage.Add(photoImg2);
	PhotoFriend.getInstance().slotImage.Add(photoImg3);
	PhotoFriend.getInstance().slotImage.Add(photoImg4);
	PhotoFriend.getInstance().slotImage.Add(photoImg5);
	PhotoFriend.getInstance().slotImage.Add(photoImg6);
	PhotoFriend.getInstance().slotImage.Add(photoImg7);
	PhotoFriend.getInstance().slotImage.Add(photoImg8);
	PhotoFriend.getInstance().slotImage.Add(photoImg9);
	PhotoFriend.getInstance().slotImage.Add(photoImg10);
	for(var ui : iGUILabel in PhotoFriend.getInstance().slotImage)
	{
		if(male)
			ui.style.normal.background = Resources.Load("UISkins/Textures/photofriend/default_woman");
		else
			ui.style.normal.background = Resources.Load("UISkins/Textures/photofriend/default_man");
		ui.setEnabled(false);
	}
	
	PhotoFriend.getInstance().slotName.Add(photoName1);
	PhotoFriend.getInstance().slotName.Add(photoName2);
	PhotoFriend.getInstance().slotName.Add(photoName3);
	PhotoFriend.getInstance().slotName.Add(photoName4);
	PhotoFriend.getInstance().slotName.Add(photoName5);
	PhotoFriend.getInstance().slotName.Add(photoName6);
	PhotoFriend.getInstance().slotName.Add(photoName7);
	PhotoFriend.getInstance().slotName.Add(photoName8);
	PhotoFriend.getInstance().slotName.Add(photoName9);
	PhotoFriend.getInstance().slotName.Add(photoName10);
	for(var ui : iGUILabel in PhotoFriend.getInstance().slotName)
		ui.setEnabled(false);
	
	PhotoFriend.getInstance().btnVisit.Add(visit1);
	PhotoFriend.getInstance().btnVisit.Add(visit2);
	PhotoFriend.getInstance().btnVisit.Add(visit3);
	PhotoFriend.getInstance().btnVisit.Add(visit4);
	PhotoFriend.getInstance().btnVisit.Add(visit5);
	PhotoFriend.getInstance().btnVisit.Add(visit6);
	PhotoFriend.getInstance().btnVisit.Add(visit7);
	PhotoFriend.getInstance().btnVisit.Add(visit8);
	PhotoFriend.getInstance().btnVisit.Add(visit9);
	PhotoFriend.getInstance().btnVisit.Add(visit10);
	for(var ui : iGUIElement in PhotoFriend.getInstance().btnVisit)
		ui.setEnabled(false);
	
	PhotoFriend.getInstance().btnFocus.Add(focus1);
	PhotoFriend.getInstance().btnFocus.Add(focus2);
	PhotoFriend.getInstance().btnFocus.Add(focus3);
	PhotoFriend.getInstance().btnFocus.Add(focus4);
	PhotoFriend.getInstance().btnFocus.Add(focus5);
	PhotoFriend.getInstance().btnFocus.Add(focus6);
	PhotoFriend.getInstance().btnFocus.Add(focus7);
	PhotoFriend.getInstance().btnFocus.Add(focus8);
	PhotoFriend.getInstance().btnFocus.Add(focus9);
	PhotoFriend.getInstance().btnFocus.Add(focus10);
	for(var ui : iGUIElement in PhotoFriend.getInstance().btnFocus)
		ui.setEnabled(false);
}

function RegisterCallbacks()
{
	close.clickCallback = Click_close;
	changeFriend.clickCallback = Click_changeFriend;
	
	visit1.clickCallback = Click_visit1;
	visit2.clickCallback = Click_visit2;
	visit3.clickCallback = Click_visit3;
	visit4.clickCallback = Click_visit4;
	visit5.clickCallback = Click_visit5;
	visit6.clickCallback = Click_visit6;
	visit7.clickCallback = Click_visit7;
	visit8.clickCallback = Click_visit8;
	visit9.clickCallback = Click_visit9;
	visit10.clickCallback = Click_visit10;
	
	focus1.clickCallback = Click_focus1;
	focus2.clickCallback = Click_focus2;
	focus3.clickCallback = Click_focus3;
	focus4.clickCallback = Click_focus4;
	focus5.clickCallback = Click_focus5;
	focus6.clickCallback = Click_focus6;
	focus7.clickCallback = Click_focus7;
	focus8.clickCallback = Click_focus8;
	focus9.clickCallback = Click_focus9;
	focus10.clickCallback = Click_focus10;
}

function Click_close(caller : iGUIElement){
	PhotoFriend.getInstance().clickCloseBtn();
	if(DataCenter.isInSelfHouse()){
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_PHOTOFRIENDUI));
	}
}
function Click_changeFriend(caller : iGUIElement){
	PhotoFriend.getInstance().clickChangeFriendBtn();
}

function Click_visit1(caller : iGUIElement){
	PhotoFriend.getInstance().clickVisitBtn(1-1);
}
function Click_visit2(caller : iGUIElement){
	PhotoFriend.getInstance().clickVisitBtn(2-1);
}
function Click_visit3(caller : iGUIElement){
	PhotoFriend.getInstance().clickVisitBtn(3-1);
}
function Click_visit4(caller : iGUIElement){
	PhotoFriend.getInstance().clickVisitBtn(4-1);
}
function Click_visit5(caller : iGUIElement){
	PhotoFriend.getInstance().clickVisitBtn(5-1);
}
function Click_visit6(caller : iGUIElement){
	PhotoFriend.getInstance().clickVisitBtn(6-1);
}
function Click_visit7(caller : iGUIElement){
	PhotoFriend.getInstance().clickVisitBtn(7-1);
}
function Click_visit8(caller : iGUIElement){
	PhotoFriend.getInstance().clickVisitBtn(8-1);
}
function Click_visit9(caller : iGUIElement){
	PhotoFriend.getInstance().clickVisitBtn(9-1);
}
function Click_visit10(caller : iGUIElement){
	PhotoFriend.getInstance().clickVisitBtn(10-1);
}

function Click_focus1(caller : iGUIElement){
	PhotoFriend.getInstance().clickFocusBtn(1-1);
}
function Click_focus2(caller : iGUIElement){
	PhotoFriend.getInstance().clickFocusBtn(2-1);
}
function Click_focus3(caller : iGUIElement){
	PhotoFriend.getInstance().clickFocusBtn(3-1);
}
function Click_focus4(caller : iGUIElement){
	PhotoFriend.getInstance().clickFocusBtn(4-1);
}
function Click_focus5(caller : iGUIElement){
	PhotoFriend.getInstance().clickFocusBtn(5-1);
}
function Click_focus6(caller : iGUIElement){
	PhotoFriend.getInstance().clickFocusBtn(6-1);
}
function Click_focus7(caller : iGUIElement){
	PhotoFriend.getInstance().clickFocusBtn(7-1);
}
function Click_focus8(caller : iGUIElement){
	PhotoFriend.getInstance().clickFocusBtn(8-1);
}
function Click_focus9(caller : iGUIElement){
	PhotoFriend.getInstance().clickFocusBtn(9-1);
}
function Click_focus10(caller : iGUIElement){
	PhotoFriend.getInstance().clickFocusBtn(10-1);
}
