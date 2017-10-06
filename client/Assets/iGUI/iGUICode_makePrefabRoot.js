import iGUI;

private static var instance : iGUICode_makePrefabRoot;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var foodLevelContainer : iGUIContainer;
@HideInInspector
var upFoodLvBtn : iGUIButton;
@HideInInspector
var needDiamondLbl : iGUILabel;
@HideInInspector
var needLevelLbl : iGUILabel;
@HideInInspector
var cancelMakingBtn : iGUIButton;
@HideInInspector
var unlockAreaBtn : iGUIButton;
@HideInInspector
var makingMaskImg : iGUIImage;
@HideInInspector
var openedStockPanel : iGUIPanel;
@HideInInspector
var unLockBtn : iGUIButton;
@HideInInspector
var lockedContainer : iGUIContainer;
@HideInInspector
var openedContainer : iGUIContainer;
@HideInInspector
var maskLayer : iGUIImage;
@HideInInspector
var remainBg : iGUIImage;
@HideInInspector
var makingBg : iGUIImage;
@HideInInspector
var readyMakeBg : iGUIImage;
@HideInInspector
var unlockBg : iGUIImage;
@HideInInspector
var lockBtn : iGUIButton;
@HideInInspector
var stockInfoItemContainer : iGUIContainer;
@HideInInspector
var stockInfoContainer : iGUIContainer;
@HideInInspector
var timeRemainLbl : iGUILabel;
@HideInInspector
var expandImmeBtn : iGUIButton;
@HideInInspector
var label3 : iGUILabel;
@HideInInspector
var cancelExpandBtn : iGUIButton;
@HideInInspector
var label2 : iGUILabel;
@HideInInspector
var expandInfoContainer : iGUIContainer;
@HideInInspector
var noOpenImg : iGUIImage;
@HideInInspector
var shakingPanel : iGUIPanel;
@HideInInspector
var addShakeBtn : iGUIButton;
@HideInInspector
var timeLbl : iGUILabel;
@HideInInspector
var priceLbl : iGUILabel;
@HideInInspector
var foodImg : iGUIImage;

@HideInInspector
var image11 : iGUIImage;
@HideInInspector
var foodNameLbl : iGUILabel;
@HideInInspector
var foodReservesItem : iGUIPanel;
/*
@HideInInspector
var image10 : iGUIImage;
@HideInInspector
var productImgFrm : iGUIImage;
@HideInInspector
var fr_grid3 : iGUIProgressBar;
@HideInInspector
var fr_grid2 : iGUIProgressBar;
@HideInInspector
var fr_grid1 : iGUIProgressBar;
@HideInInspector
var reservesDataContainer : iGUIContainer;
@HideInInspector
var foodImg : iGUIImage;
@HideInInspector
var foodReservesItem : iGUIContainer;
*/
@HideInInspector
var image8 : iGUIImage;
@HideInInspector
var image7 : iGUIImage;
@HideInInspector
var image6 : iGUIImage;
@HideInInspector
var image5 : iGUIImage;
@HideInInspector
var image4 : iGUIImage;
@HideInInspector
var exchangeBtn : iGUIButton;
@HideInInspector
var exchangeTarNumLbl : iGUILabel;
@HideInInspector
var exchangeTarImg : iGUIImage;
@HideInInspector
var exchangeTarContainer : iGUIContainer;
@HideInInspector
var exchangeTarPanel : iGUIPanel;
@HideInInspector
var image3 : iGUIImage;
@HideInInspector
var needItem4NumLbl : iGUILabel;
@HideInInspector
var needItem4Img : iGUIImage;
@HideInInspector
var needItem4Container : iGUIContainer;
@HideInInspector
var needItem3NumLbl : iGUILabel;
@HideInInspector
var needItem3Img : iGUIImage;
@HideInInspector
var needItem3Container : iGUIContainer;
@HideInInspector
var needItem2NumLbl : iGUILabel;
@HideInInspector
var needItem2Img : iGUIImage;
@HideInInspector
var needItem2Container : iGUIContainer;
@HideInInspector
var needItem1NumLbl : iGUILabel;
@HideInInspector
var needItem1Img : iGUIImage;
@HideInInspector
var needItem1Container : iGUIContainer;
@HideInInspector
var needItemInfoContainer : iGUIContainer;
@HideInInspector
var needItemPanel : iGUIPanel;
@HideInInspector
var panelImg : iGUIImage;
@HideInInspector
var exchangeItemPanel : iGUIPanel;
@HideInInspector
var active_item1 : iGUISmart_active_item;
@HideInInspector
var reward_state_btn : iGUIButton;
@HideInInspector
var image2 : iGUIImage;
@HideInInspector
var image1 : iGUIImage;
@HideInInspector
var reward_score_item : iGUIPanel;
@HideInInspector
var makePrefabRoot : iGUIRoot;
