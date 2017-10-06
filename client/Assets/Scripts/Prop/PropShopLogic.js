#pragma strict
#pragma downcast

/*--------------------------------------------------
道具商城逻辑(2012/4/10 create by hezhr)
--------------------------------------------------*/
import iGUI;



private static var mInstance : PropShopLogic = null;
private var mHideUIArray : Array;											// 被隐藏的界面
public var OpenPropShopUINotHideRoot : String[];							// 打开道具商城界面不隐藏得root
public static var Ctrl : Controller = new Controller();						// 控制器
private var SLOT_NUM : int = 16;											// 每页的显示个数
public static var PropNewPage : PropShopPage = new PropShopPage();			// 新品道具
public static var PropAllPage : PropShopPage = new PropShopPage();			// 所有道具
public static var ClothesGiftPage : PropShopPage = new PropShopPage();		// 服装礼包
public static var FurniturePage : PropShopPage = new PropShopPage();			// 家具
public static var ComposePaperPage : PropShopPage = new PropShopPage();		// 合成图纸
public static var ComposeMaterialPage : PropShopPage = new PropShopPage();	// 合成材料
public static var SeedPage : PropShopPage = new PropShopPage();				// 种子




//--------------------------------------------------
function Awake()
{
	mInstance = this;
	_registEvents();
}
//--------------------------------------------------
public static function getInstance() : PropShopLogic
{
	return mInstance;
}
//--------------------------------------------------
// 事件注册
private function _registEvents() : void
{
	// 网络事件注册
	// 普通事件注册
	// 其他事件注册
	Ctrl.Register("open_prop_shop_ui", openPropShopUI);
	Ctrl.Register("open_prop_use_ui", openPropUseUI);
	Ctrl.Register("close_prop_shop_ui", closePropShopUI);
}
//--------------------------------------------------
// 初始
public function init() : void
{
	var type_arr_1 : Array = new Array();	// 道具类型(可使用,不可使用)
	type_arr_1.Add(ItemType.Prop);
	type_arr_1.Add(ItemType.PropCantUse);
	var type_arr_2 : Array = new Array();	// 服装礼包类型
	type_arr_2.Add(ItemType.ClothesGift);
	var type_arr_3 : Array = new Array();	// 家具类型
	type_arr_3.Add(ItemType.FurnitureGift);
	type_arr_3.Add(ItemType.Furniture);
	var type_arr_4 : Array = new Array();	// 合成图纸类型
	type_arr_4.Add(ItemType.ComposePaper);
	var type_arr_5 : Array = new Array();	// 合成材料类型
	type_arr_5.Add(ItemType.MaterialGift);
	type_arr_5.Add(ItemType.ComposeMaterial);
	var type_arr_6 : Array = new Array();	// 种子
	type_arr_6.Add(ItemType.Seed);
	//
	PropNewPage.init(getPropNewData(), SLOT_NUM);
	PropAllPage.init(getShopCenterData(type_arr_1), SLOT_NUM);
	ClothesGiftPage.init(getShopCenterData(type_arr_2), SLOT_NUM);
	FurniturePage.init(getShopCenterData(type_arr_3), SLOT_NUM);
	ComposePaperPage.init(getShopCenterData(type_arr_4), SLOT_NUM);
	ComposeMaterialPage.init(getShopCenterData(type_arr_5), SLOT_NUM);
	SeedPage.init(getShopCenterData(type_arr_6), SLOT_NUM);
}
//--------------------------------------------------
// 获取商城数据
public function getShopCenterData(type_arr : Array) : Array
{
	var arr : Array = new Array();
	for (var type : int in type_arr)
	{
		for (var scr : ShopCenterRow in ResManager.LgtMgr.ShopCenterTable)
		{
			var scct : Array = ResManager.LgtMgr.ShopCenterClassTable;
			for (var sccr_obj : System.Object in scct)
			{
				var sccr : ShopCenterClassRow = sccr_obj as ShopCenterClassRow;
				if (sccr.type==scr.type && 3==sccr.buytype)		// 道具类型
				{
					var ir : ItemRow = ResManager.LgtMgr.getItemRow(scr.item_id);
					if (scr.visible && type==ir.type)
					{
						arr.Add(scr);
					}	
				}
			}
		}
	}
	return arr;
}
//--------------------------------------------------
// 获取新品道具数据
public function getPropNewData() : Array
{
	var new_arr : Array = new Array();
	for (var scr : ShopCenterRow in ResManager.LgtMgr.ShopCenterTable)
	{
		var scct : Array = ResManager.LgtMgr.ShopCenterClassTable;
		for (var sccr_obj : System.Object in scct)
		{
			var sccr : ShopCenterClassRow = sccr_obj as ShopCenterClassRow;
			if (sccr.type==scr.type && 3==sccr.buytype)		// 道具类型
			{
				var ir : ItemRow = ResManager.LgtMgr.getItemRow(scr.item_id);
				if (scr.recommend)
				{
					new_arr.Add(scr);
				}	
			}
		}
	}
	return new_arr;
}
//--------------------------------------------------
// 打开道具商城界面,tab标签标识:0.新品,1.道具,2.服饰,3.家具,4.合成图纸,5.合成材料,6.种子
public function openPropShopUI(tab : int) : void
{
	Ctrl.Set("is_open_shop_ui", true);
	Ctrl.Set("shop_ui_default_tab", tab);
	_openPropShopRoot();
}
//--------------------------------------------------
// 打开道具使用界面
public function openPropUseUI(param : System.Object) : void
{
	Ctrl.Set("is_open_shop_ui", false);
	_openPropShopRoot();
}
//--------------------------------------------------
// 打开道具root
private function _openPropShopRoot() : void
{
	mHideUIArray = UI.getUI().EnableUIRootIgnore(OpenPropShopUINotHideRoot, false);
	UI.getUI().OpenUIRoot("PropShopUI");
	UI.getUI().SetModal("PropShopUI", true);
}
//--------------------------------------------------
// 关闭道具商城界面
public function closePropShopUI(param : System.Object) : void
{
	UI.getUI().SetModal("PropShopUI", false);
	UI.getUI().CloseUIRoot("PropShopUI");
	if (null == mHideUIArray)
		return;
	
	UI.getUI().EnableUIRoot(mHideUIArray, true);
	mHideUIArray.Clear();
}


