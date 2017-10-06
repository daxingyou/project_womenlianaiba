/*--------------------------------------------------
背包逻辑(2012/7/2 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast
import iGUI;



private static var mInstance : Backpack = null;
private var SLOT_NUM : int = 20;													// 每页物品数量
private var mRealTime : boolean = false;											// 背包是否实时接收物品添加/删除/更新事件
private var mIsOpened : boolean = false;											// 背包是否被打开
public static var PropTabPage : BackpackPage = new BackpackPage();					// 道具标签页
public static var DressTabPage : BackpackPage = new BackpackPage();					// 装饰标签页
public static var FurnitureTabPage : BackpackPage = new BackpackPage();				// 家具标签页
public static var ComposePaperTabPage : BackpackPage = new BackpackPage();			// 合成图纸标签页
public static var ComposeMaterialTabPage : BackpackPage = new BackpackPage();		// 合成材料标签页
public static var SeedTabPage : BackpackPage = new BackpackPage();					// 种子标签页



//--------------------------------------------------
function Awake()
{
	mInstance = this;
	registEvents();
}
public static function getInstance() : Backpack
{
	if (null == mInstance)
	{
		throw new Exception("Backpack -> instance is null!");
	}
	return mInstance;
}
//--------------------------------------------------
// 事件注册
private function registEvents() : void
{
	var ip : ItemPack = SelfItemLogic.getInstance()._loverPackage;
	EventCenter.RegistHandler(GameEvent.MakeEventSource(GameEventDef.ITME_PACK_ADD_GRID, ip), loverPackageAddGrid);
	EventCenter.RegistHandler(GameEvent.MakeEventSource(GameEventDef.ITME_PACK_DEL_GRID_BEGIN, ip), loverPackageDelGridBegin);
	EventCenter.RegistHandler(GameEvent.MakeEventSource(GameEventDef.ITEM_PACK_UPDATE_GRID, ip), loverPackageUpdateGrid);
}
//--------------------------------------------------
// 设置各标签页数据
private function setTabPages() : void
{
	var ip : ItemPack = SelfItemLogic.getInstance()._loverPackage;
	// 道具
	var prop_arr : Array = new Array();
	prop_arr.Add(ItemType.Prop);
	prop_arr.Add(ItemType.PropCantUse);
	prop_arr.Add(ItemType.ClothesGift);
	prop_arr.Add(ItemType.FurnitureGift);
	prop_arr.Add(ItemType.MaterialGift);
	PropTabPage.init(ip, prop_arr, SLOT_NUM);
	// 装饰
	var dress_arr : Array = new Array();
	dress_arr.Add(ItemType.Clothes);
	DressTabPage.init(ip, dress_arr, SLOT_NUM);
	// 家具
	var furniture_arr : Array = new Array();
	furniture_arr.Add(ItemType.Furniture);
	FurnitureTabPage.init(ip, furniture_arr, SLOT_NUM);
	// 合成图纸
	var compose_paper_arr : Array = new Array();
	compose_paper_arr.Add(ItemType.ComposePaper);
	ComposePaperTabPage.init(ip, compose_paper_arr, SLOT_NUM);
	// 合成材料
	var compose_material_arr : Array = new Array();
	compose_material_arr.Add(ItemType.ComposeMaterial);
	ComposeMaterialTabPage.init(ip, compose_material_arr, SLOT_NUM);
	// 种子
	var seed_arr : Array = new Array();
	seed_arr.Add(ItemType.Seed);
	SeedTabPage.init(ip, seed_arr, SLOT_NUM);
}
//--------------------------------------------------
// 处理背包增加物品事件
private function loverPackageAddGrid(evt : GameEvent, obj : System.Object) : void
{
	if (false == mRealTime)
		return;
	
	addItem(obj as PackGrid);
}
//--------------------------------------------------
// 处理背包删除物品事件
private function loverPackageDelGridBegin(evt : GameEvent, obj : System.Object) : void
{
	if (false == mRealTime)
		return;
	
	delItem(obj as PackGrid);
}
//--------------------------------------------------
// 处理背包物品更新事件
private function loverPackageUpdateGrid(evt : GameEvent, obj : System.Object) : void
{
	if (false == mRealTime)
		return;
	
	updateItem(obj as PackGrid);
}
//--------------------------------------------------
// 添加物品
public function addItem(pg : PackGrid) : void
{
	if (false == isBackpackUIOpen())
		return;
	
	PropTabPage.addPackGrid(pg);
	DressTabPage.addPackGrid(pg);
	FurnitureTabPage.addPackGrid(pg);
	ComposePaperTabPage.addPackGrid(pg);
	ComposeMaterialTabPage.addPackGrid(pg);
	SeedTabPage.addPackGrid(pg);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.BACKPACK_REFRESH), pg);
}
//--------------------------------------------------
// 删除物品
public function delItem(pg : PackGrid) : void
{
	if (false == isBackpackUIOpen())
		return;
	
	PropTabPage.delPackGrid(pg);
	DressTabPage.delPackGrid(pg);
	FurnitureTabPage.delPackGrid(pg);
	ComposePaperTabPage.delPackGrid(pg);
	ComposeMaterialTabPage.delPackGrid(pg);
	SeedTabPage.delPackGrid(pg);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.BACKPACK_REFRESH), pg);
}
//--------------------------------------------------
// 更新物品
private function updateItem(pg : PackGrid) : void
{
	if (false == isBackpackUIOpen())
		return;
	
	PropTabPage.updatePackGrid(pg);
	DressTabPage.updatePackGrid(pg);
	FurnitureTabPage.updatePackGrid(pg);
	ComposePaperTabPage.updatePackGrid(pg);
	ComposeMaterialTabPage.updatePackGrid(pg);
	SeedTabPage.updatePackGrid(pg);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.BACKPACK_REFRESH), pg);
}
//--------------------------------------------------
// 打开背包;close,是否显示关闭按钮
public function openBackpackUI(x : float, y : float, tab : int, modal : boolean, rt : boolean, close : boolean) : void
{
	openBackpackUI(tab, modal, rt);
	iGUICode_BackpackUI.getInstance().setPosition(x, y);
	iGUICode_BackpackUI.getInstance().setCloseEnable(close);
}
//--------------------------------------------------
// 打开背包;tab,默认打开标签:1.道具,2.服饰,3.家具,4.合成图纸,5.合成材料,6.种子;modal,是否模态;rt,背包里物品是否实时更新
public function openBackpackUI(tab : int, modal : boolean, rt : boolean) : void
{
	setTabPages();
	mRealTime = rt;
	mIsOpened = true;
	UI.getUI().OpenUIRoot("BackpackUI");
	UI.getUI().SetModal("BackpackUI", modal);
	UI.getUI().SetTopDepth("BackpackUI");
	iGUICode_BackpackUI.getInstance().changeToDefaultTab(tab);
}
//--------------------------------------------------
// 关闭背包
public function closeBackpackUI() : void
{
	mRealTime = false;
	mIsOpened = false;
	UI.getUI().SetModal("BackpackUI", false);
	UI.getUI().CloseUIRoot("BackpackUI");
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.BACKPACK_CLOSED));
}
//--------------------------------------------------
// 背包是否打开
public function isBackpackUIOpen() : boolean
{
	return mIsOpened;
}
//--------------------------------------------------


