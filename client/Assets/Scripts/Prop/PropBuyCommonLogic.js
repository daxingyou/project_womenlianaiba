#pragma strict
#pragma downcast

/*--------------------------------------------------
通用道具购买逻辑(2012/12/6 create by hezhr)
--------------------------------------------------*/
import iGUI;


private static var mInstance : PropBuyCommonLogic = null;
private var mHideUIArray : Array;										// 被隐藏的界面
public var NoHideRoots : String[];										// 不隐藏的root
public static var Ctrl : Controller = new Controller();					// 控制器


//--------------------------------------------------
function Awake()
{
	mInstance = this;
}
//--------------------------------------------------
public static function getInstance() : PropBuyCommonLogic
{
	return mInstance;
}
//--------------------------------------------------
// 打开道具通用购买界面
public function openPropBuyCommonUI(goods_id : int) : void
{
	Ctrl.Set("goods_id", goods_id);
	mHideUIArray = UI.getUI().EnableUIRootIgnore(NoHideRoots, false);
	UI.getUI().OpenUIRoot("PropBuyCommonUI");
	UI.getUI().SetModal("PropBuyCommonUI", true);
}
//--------------------------------------------------
// 关闭道具通用购买界面
public function closePropBuyCommonUI() : void
{
	UI.getUI().SetModal("PropBuyCommonUI", false);
	UI.getUI().CloseUIRoot("PropBuyCommonUI");
	if (null == mHideUIArray)
		return;
	
	UI.getUI().EnableUIRoot(mHideUIArray, true);
	mHideUIArray.Clear();
}
//--------------------------------------------------


