import iGUI;

private static var instance : iGUISmartPrefab_reward_score_item;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var reward_state_btn : iGUIButton;
@HideInInspector
var image2 : iGUIImage;
@HideInInspector
var image1 : iGUIImage;
@HideInInspector
var reward_score_item : iGUIPanel;

