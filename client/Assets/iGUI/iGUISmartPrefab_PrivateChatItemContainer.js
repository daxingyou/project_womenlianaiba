import iGUI;

private static var instance : iGUISmartPrefab_PrivateChatItemContainer;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var private_talk_btn : iGUIButton;
@HideInInspector
var private_content_lbl : iGUILabel;
@HideInInspector
var private_content_container : iGUIContainer;
@HideInInspector
var private_chat_item_container : iGUIContainer;

