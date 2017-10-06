import iGUI;

private static var instance : iGUISmartPrefab_ChannelItemSO;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var recommondFlagLbl : iGUILabel;
@HideInInspector
var manyuanFlagLbl : iGUILabel;
@HideInInspector
var enterChannelBtn : iGUIButton;
@HideInInspector
var memberNumLbl : iGUILabel;
@HideInInspector
var onlineFlagLbl : iGUILabel;
@HideInInspector
var anchorLvLbl : iGUILabel;
@HideInInspector
var anhorNameLbl : iGUILabel;
@HideInInspector
var anchorImgFrm : iGUILabel;
@HideInInspector
var channelItem : iGUIPanel;

