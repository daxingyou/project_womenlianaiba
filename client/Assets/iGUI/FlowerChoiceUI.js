#pragma strict
#pragma downcast
import iGUI;

private static var instance : FlowerChoiceUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var CloseBtn : iGUIButton;
@HideInInspector
var ChoiceBtn : iGUIButton;
@HideInInspector
var checkboxGroup1 : iGUICheckboxGroup;
@HideInInspector
var image5 : iGUIImage;
@HideInInspector
var image4 : iGUIImage;
@HideInInspector
var image3 : iGUIImage;
@HideInInspector
var image2 : iGUIImage;
@HideInInspector
var image1 : iGUIImage;
@HideInInspector
var panel1 : iGUIPanel;
@HideInInspector
var root1 : iGUIRoot;


function ChoiceBtn_Click(caller : iGUIButton){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.REQUEST_CREATE_FLOWER), "4001");
}

function CloseBtn_Click(caller : iGUIButton){
	UI.getUI().CloseUIRoot("FlowerChoiceUI");
}