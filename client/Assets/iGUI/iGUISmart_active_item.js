import iGUI;

private static var instance : iGUISmart_active_item;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var immediateCompleteBtn : iGUIButton;
@HideInInspector
var state : iGUIButton;
@HideInInspector
var point : iGUILabel;
@HideInInspector
var label1 : iGUILabel;
@HideInInspector
var item_content : iGUILabel;
@HideInInspector
var active_item : iGUIPanel;

