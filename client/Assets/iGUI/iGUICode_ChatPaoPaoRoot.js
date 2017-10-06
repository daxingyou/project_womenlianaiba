#pragma strict
import iGUI;

private static var instance : iGUICode_ChatPaoPaoRoot;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var chatPaoPaoRoot : iGUIRoot;
