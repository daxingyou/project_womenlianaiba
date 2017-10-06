import iGUI;

private static var instance : iGUICode_CommSceneUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var ssClose : iGUIButton;
@HideInInspector
var ssScene1_Label : iGUILabel;
@HideInInspector
var ssScene1_Image : iGUIImage;
@HideInInspector
var SceneSelectPanel : iGUIPanel;
@HideInInspector
var scClose : iGUIButton;
@HideInInspector
var scRefreshScene : iGUIButton;
@HideInInspector
var scSceneList : iGUIListBox;
@HideInInspector
var SceneCopyPanel : iGUIPanel;
@HideInInspector
var root : iGUIRoot;


//初始化的变量
var SceneCopyItemStyle : GUIStyle;

function Start ()
{
	ssScene1_Image.clickCallback = Click_ssScene1_Image;
	ssClose.clickCallback = Click_ssClose;
	
	scClose.clickCallback = Click_scClose;
	scRefreshScene.clickCallback = Click_scRefreshScene;
}

function Click_ssScene1_Image(caller : iGUIElement){
	CommSceneLogic.getInstance().clickSelectSceneImage(caller);
}

function Click_ssClose(caller : iGUIElement){
	CommSceneLogic.getInstance().clickSceneSelectUIClose();
}

function Click_scClose(caller : iGUIElement){
	CommSceneLogic.getInstance().clickSceneCopyUIClose();
}

function Click_scRefreshScene(caller : iGUIElement){
	CommSceneLogic.getInstance().clickRefreshSceneButton();
}