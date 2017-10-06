#pragma strict

import iGUI;

private static var instance : iGUISmartPrefab_VisitItem;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var visitBtn : iGUIButton;
@HideInInspector
var contentLbl : iGUILabel;
@HideInInspector
var timeLbl : iGUILabel;
@HideInInspector
var visitItem : iGUIPanel;