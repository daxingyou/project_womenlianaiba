#pragma strict
#pragma downcast
import iGUI;

private static var instance : iGUICode_LoadingModalRoot;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var loadingModalRoot : iGUIRoot;

function OnGUI()
{
	if(loadingModalRoot.itemCount == 0)
	{
		UI.getUI().CloseLoadingModalRoot();
	}
}
//--
function CreateLoadingWin()
{
	//var _win:iGUIPanel = loadingModalRoot.addElement("iGUIPanel");
	//_win.style = loadingModalRoot.alertWindowStyle;
	//_win.setPositionAndSize(new Rect(0.5f,0.5f,0.5f,0.5f));
	var loading_win:iGUILoadingIndicator = loadingModalRoot.addElement("iGUILoadingIndicator");
	
	//loading_win.style = loadingModalRoot.
	loading_win.setPositionAndSize(new Rect(0.5f,0.5f,0.5f,0.5f));
}
//--
function CloseLoadingWin()
{
	loadingModalRoot.removeElement(loadingModalRoot.items[0]);
}