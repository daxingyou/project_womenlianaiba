#pragma strict
import iGUI;

private static var instance : iGUISmartPrefab_WishItem;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var func_btn : iGUIButton;
@HideInInspector
var wish_content : iGUILabel;
@HideInInspector
var wishTime : iGUILabel;
@HideInInspector
var itm_img : iGUIImage;
@HideInInspector
var wishItm : iGUIPanel;
