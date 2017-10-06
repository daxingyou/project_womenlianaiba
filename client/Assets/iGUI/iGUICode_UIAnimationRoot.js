#pragma strict
import iGUI;

private static var instance : iGUICode_UIAnimationRoot;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var UIAnimationRoot : iGUIRoot;
