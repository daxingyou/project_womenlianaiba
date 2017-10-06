#pragma strict
import iGUI;

private static var instance : iGUICode_Tooltip;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var image1 : iGUIImage;
@HideInInspector
var TooltipUI : iGUIPanel;
@HideInInspector
var root1 : iGUIRoot;
