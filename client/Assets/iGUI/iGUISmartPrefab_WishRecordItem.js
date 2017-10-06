#pragma strict
import iGUI;

private static var instance : iGUISmartPrefab_WishRecordItem;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}

@HideInInspector
var text2Lbl : iGUILabel;
@HideInInspector
var text1Lbl : iGUILabel;
@HideInInspector
var guanZhuBtn : iGUIButton;
@HideInInspector
var visitBtn : iGUIButton;
@HideInInspector
var headImg : iGUIImage;
@HideInInspector
var recordContent : iGUILabel;
@HideInInspector
var wishRecrodItm : iGUIPanel;