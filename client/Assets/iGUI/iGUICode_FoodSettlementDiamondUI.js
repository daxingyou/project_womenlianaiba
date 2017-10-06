import iGUI;

private static var instance : iGUICode_FoodSettlementDiamondUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var damond_label : iGUILabel;
@HideInInspector
var close_btn : iGUIButton;
@HideInInspector
var frame : iGUIPanel;
@HideInInspector
var root : iGUIRoot;



//--------------------------------------------------
function Start()
{
	// 界面事件注册
	close_btn.clickCallback = ClickCallback_close_btn;
}
//--------------------------------------------------
function ClickCallback_close_btn(caller : iGUIElement)
{
	UI.getUI().SetModal("FoodSettlementDiamondUI", false);
	UI.getUI().CloseUIRoot("FoodSettlementDiamondUI");
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_CLOSE_FOOD_SETTLEMENT_DIAMOND_UI));
}
//--------------------------------------------------
public function setDiamondLabel(diamond : int) : void
{
	damond_label.label.text = diamond.ToString();
}
//--------------------------------------------------


