#pragma strict

import iGUI;

private static var instance : iGUISmartPrefab_SpecialHouseItm;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}

@HideInInspector
var UnlockLabel : iGUILabel;
@HideInInspector
var PriceImgQQhome1 : iGUIImage;
@HideInInspector
var ImgHouse : iGUIImage;
@HideInInspector
var LabHouse : iGUILabel;
@HideInInspector
var BtnHouseWill : iGUIButton;
@HideInInspector
var BtnPreview1 : iGUIButton;
@HideInInspector
var LabHousePrice : iGUILabel;
@HideInInspector
var Currency : iGUIImage;
@HideInInspector
var special_house_itm : iGUIPanel;