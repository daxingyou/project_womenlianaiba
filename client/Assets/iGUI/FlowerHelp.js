#pragma strict

import iGUI;

private static var instance : FlowerHelp;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var panel1 : iGUIPanel;
@HideInInspector
var CloseImg : iGUIImage;
@HideInInspector
var window2 : iGUIWindow;
@HideInInspector
var FlowerHelp : iGUIRoot;


function CloseImg_Click(caller : iGUIImage){
	UI.getUI().CloseUIRoot("FlowerHelp");
}