#pragma strict
import iGUI;

private static var instance : iGUICode_PlayerHeadupRoot;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var playerHeadupRoot : iGUIRoot;
