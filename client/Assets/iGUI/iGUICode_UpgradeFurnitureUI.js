import iGUI;

private static var instance : iGUICode_UpgradeFurnitureUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var tip_lable : iGUILabel;
@HideInInspector
var lost_tip_label : iGUILabel;
@HideInInspector
var cost_tip_label : iGUILabel;
@HideInInspector
var cost_icon_label : iGUILabel;
@HideInInspector
var cost_num_label : iGUILabel;
@HideInInspector
var cost_label : iGUILabel;
@HideInInspector
var upgrade_num_label : iGUILabel;
@HideInInspector
var upgrade_label : iGUILabel;
@HideInInspector
var ok_btn : iGUIButton;
@HideInInspector
var title_label : iGUILabel;
@HideInInspector
var close_btn : iGUIButton;
@HideInInspector
var frame : iGUIPanel;
@HideInInspector
var root : iGUIRoot;



private var mUpgradeFurnis : Array = null;
private var mCostEnough : boolean = false;
//--------------------------------------------------
function Start()
{
	close_btn.clickCallback = ClickCallback_close_btn;
	ok_btn.clickCallback = ClickCallback_ok_btn;
}
//--------------------------------------------------
function OnDestroy()
{
}
//--------------------------------------------------
function ClickCallback_close_btn(caller : iGUIElement)
{
	UI.getUI().SetModal("UpgradeFurnitureUI", false);
	UI.getUI().CloseUIRoot("UpgradeFurnitureUI");
}
//--------------------------------------------------
function ClickCallback_ok_btn(caller : iGUIElement)
{
	ClickCallback_close_btn(null);
	// 水晶不够
	if (false == mCostEnough)
	{
		Global.GetSysMsgHandler().ShowSysMsg(562);
		return;
	}
	var upgradeFurnis : Array = new Array();
	for (var furni : house_furniture in mUpgradeFurnis)
	{
		upgradeFurnis.Add(furni.instance_id);
	}
	ItemUpgradeNet.GetInstance().ReqMutliItemUpgrage(upgradeFurnis);
}
//--------------------------------------------------
public function init(furnis : Array, totalCost : int) : void
{
	// 保存数据
	mUpgradeFurnis = furnis;
	mCostEnough = totalCost <= SelfItemLogic.getInstance().GetCurDiamond();
	// 数量
	upgrade_num_label.label.text = furnis.Count.ToString() + " " + Define.piece;
	// 水晶
	cost_num_label.label.text = totalCost.ToString();
	cost_num_label.style.normal.textColor = mCostEnough ? Color.white : Color.red;
	// 水晶不足提示
	cost_tip_label.setEnabled(false == mCostEnough);
	lost_tip_label.setEnabled(false == mCostEnough);
}
//--------------------------------------------------


