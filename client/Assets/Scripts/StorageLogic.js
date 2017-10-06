/*--------------------------------------------------
背包逻辑相关(2011/12/31 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast



/*--------------------------------------------------
*** 背包里的物品选项(适用于背包)
--------------------------------------------------*/
class StorageSlot
{
	private var mIdx : int = 0;								// 格子索引,从0开始
	private var mImageLabel : iGUILabel = null;				// icon
	private var mCountLabel : iGUILabel = null;				// 数量
	public var mSelectLabel : iGUIImage = null;				// 选择框
	private var mAsynIcon : AsynIcon = null;				// 异步家装icon的管理器
	private var mFitPackGrid : FitmentPackGrid = null;		// 格子
	//--------------------------------------------------
	// 设置选项内容(icon名),基本上内部调用
	private function _setContent(imageName : String, count : int) : void
	{
		// 设置icon
		if ("" == imageName)
		{
			mImageLabel.style.normal.background = null;
			mCountLabel.label.text = "";
			mAsynIcon.cancel();
		}
		else
		{
			mAsynIcon.load("Icon/" + imageName);
			mCountLabel.label.text = count.ToString();
		}
	}
	//--------------------------------------------------
	// 设置选项是否被选中
	private function _setSelect(select : boolean) : void
	{
		var gui : iGUICode_StorageBoxUI = iGUICode_StorageBoxUI.getInstance();
		gui.getSelectFrame().setSelect(mSelectLabel, -3, -5, select);
		if (select)
		{
			gui.openClickItemPanel(mSelectLabel, mFitPackGrid);
		}
		else if (gui.getSelectFrame().isSelected(mSelectLabel))
		{
			gui.closeClickItemPanel(true);
		}
	}
	//--------------------------------------------------
	// 清除选项内容
	private function _clearContent() : void
	{
		_setContent("", 0);
		_setSelect(false);
		var gui : iGUICode_StorageBoxUI = iGUICode_StorageBoxUI.getInstance();
		gui.setStorageTimeoutVisible(mIdx, false);
	}
	//--------------------------------------------------
	// 构造函数(物品在每页的索引)
	function StorageSlot(n : int)
	{
		mIdx = n;
		var gui : iGUICode_StorageBoxUI = iGUICode_StorageBoxUI.getInstance();
		gui.setStorageTimeoutVisible(n, false);
		switch (n)
		{
			case 0:
				mImageLabel = gui.storage_goods1_image;
				mCountLabel = gui.storage_goods1_count;
				mSelectLabel = gui.storage_goods1_background;
				break;
			case 1:
				mImageLabel = gui.storage_goods2_image;
				mCountLabel = gui.storage_goods2_count;
				mSelectLabel = gui.storage_goods2_background;
				break;
			case 2:
				mImageLabel = gui.storage_goods3_image;
				mCountLabel = gui.storage_goods3_count;
				mSelectLabel = gui.storage_goods3_background;
				break;
			case 3:
				mImageLabel = gui.storage_goods4_image;
				mCountLabel = gui.storage_goods4_count;
				mSelectLabel = gui.storage_goods4_background;
				break;
			case 4:
				mImageLabel = gui.storage_goods5_image;
				mCountLabel = gui.storage_goods5_count;
				mSelectLabel = gui.storage_goods5_background;
				break;
			case 5:
				mImageLabel = gui.storage_goods6_image;
				mCountLabel = gui.storage_goods6_count;
				mSelectLabel = gui.storage_goods6_background;
				break;
			case 6:
				mImageLabel = gui.storage_goods7_image;
				mCountLabel = gui.storage_goods7_count;
				mSelectLabel = gui.storage_goods7_background;
				break;
			case 7:
				mImageLabel = gui.storage_goods8_image;
				mCountLabel = gui.storage_goods8_count;
				mSelectLabel = gui.storage_goods8_background;
				break;
			case 8:
				mImageLabel = gui.storage_goods9_image;
				mCountLabel = gui.storage_goods9_count;
				mSelectLabel = gui.storage_goods9_background;
				break;
			case 9:
				mImageLabel = gui.storage_goods10_image;
				mCountLabel = gui.storage_goods10_count;
				mSelectLabel = gui.storage_goods10_background;
				break;
			case 10:
				mImageLabel = gui.storage_goods11_image;
				mCountLabel = gui.storage_goods11_count;
				mSelectLabel = gui.storage_goods11_background;
				break;
		}

		mAsynIcon = new AsynIcon(setIcon, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	}
	//--------------------------------------------------
	// 异步加载icon的回调函数,内部调用
	function setIcon(tex : Texture)
	{
		mImageLabel.style.normal.background = tex as Texture2D;
	}
	//--------------------------------------------------
	// 更新选项里的内容,外部调用
	public function updateToUI(fpg : FitmentPackGrid) : void
	{
		mFitPackGrid = fpg;
		if (null == fpg)
		{
			_clearContent();
			return;
		}
		
		_setContent(fpg.packGrid._item._itemInfo.icon, fpg.packGrid._count);
		if (fpg.select)
		{
			_setSelect(true);
		}
		else
		{
			_setSelect(false);
		}
		
		var mature : boolean = TimeEffect.getInstance().isMature(fpg.packGrid._item._delTime);
		var gui : iGUICode_StorageBoxUI = iGUICode_StorageBoxUI.getInstance();
		gui.setStorageTimeoutVisible(mIdx, mature);
	}
	//--------------------------------------------------
	// 显示tooltip
	public function showTooltip() : void
	{
		if (null == mFitPackGrid)
			return;
		
		ItemHint.ShowPackItemHint(mSelectLabel, mFitPackGrid.packGrid, true);
	}
	//--------------------------------------------------
	//
	public function UpdateMultiSelectStateUI(fpg : FitmentPackGrid){
		if(!fpg)
			return;
			
		_SetMultiSelected(fpg.multi_selected);
	}
	//--------------------------------------------------
	//
	private function _SetMultiSelected(selected : boolean){
		var gui : iGUICode_StorageBoxUI = iGUICode_StorageBoxUI.getInstance();	
		if(!gui)
			return;
		
		if(selected){
			gui.CreateMultiSelectFrame(mSelectLabel);
		}
		else{
			gui.DeleteMultiSelectFrame(mSelectLabel);
		}
	}
}



/*--------------------------------------------------
*** 背包逻辑
--------------------------------------------------*/
private var SLOT_NUM : int = 11;									// 每页的物品数
private var mStorageType : int = -1;								// 背包类型:-1,none;0,道具;1,人物装饰;2,家居装饰;3,炼金图纸;4,炼金材料;5,种子
private var mStorageSlots : Array = new Array();					// 每页的物品选项(预先构造)
// 道具
private var mPropPackGrids : Array = new Array();					// 道具里的物品
private var mPropPage : Page = new Page();							// 道具物品对应的分页
// 人物装饰
private var mPersonPackGrids : Array = new Array();					// 人物装饰里的物品
private var mPersonPage : Page = new Page();						// 人物装饰物品对应的分页
// 家居装饰
private var mHousePackGrids : Array = new Array();					// 家居装饰里的物品
private var mHousePage : Page = new Page();							// 家居装饰物品对应的分页
// 炼金图纸
private var mComposePaperPackGrids : Array = new Array();			// 炼金图纸里的物品
private var mComposePaperPage : Page = new Page();					// 炼金图纸物品对应的分页
// 炼金材料
private var mComposeMaterialPackGrids : Array = new Array();		// 炼金材料里的物品
private var mComposeMaterialPage : Page = new Page();				// 炼金材料物品对应的分页
// 种子
private var mSeedPackGrids : Array = new Array();					// 种子里的物品
private var mSeedPage : Page = new Page();							// 种子对应的分页
private var isMultiSelectState : boolean = false;
private var mMultiSelectedItems : ArrayList = new ArrayList();
private var mMultiSalePrice : int = 0;


//--------------------------------------------------
private static var instance : StorageLogic = null;
static function getInstance()
{
	return instance;
}
//--------------------------------------------------
// override function
function Awake()
{
	instance = this;
}
//--------------------------------------------------
// override function
function Start()
{
	_registEvents();
}
//--------------------------------------------------
// 注册事件
private function _registEvents() : void
{
	var lp : ItemPack = SelfItemLogic.getInstance()._loverPackage;
	EventCenter.RegistHandler(GameEvent.MakeEventSource(GameEventDef.ITME_PACK_ADD_GRID, lp), loverPackageAddGrid);
	EventCenter.RegistHandler(GameEvent.MakeEventSource(GameEventDef.ITME_PACK_DEL_GRID_BEGIN, lp), loverPackageDelGridBegin);
	EventCenter.RegistHandler(GameEvent.MakeEventSource(GameEventDef.ITEM_PACK_UPDATE_GRID, lp), loverPackageUpdateGrid);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.POST_MULTISELECTSTATE), NotifyMultiSelectStateChanged);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.PACKITEM_SELECTSTATE_CHANGED), HandlePackItemSelectStateChanged);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.TO_UPDATE_MULTISELECTFRAME), HandleUpdateMultiSelectFrames);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_MULTISALE_BTN), HandleClickMultiSaleBtn);
}
//--------------------------------------------------
// 根据类型获取物品
private function _setData(ip : ItemPack, type_arr : Array, arr : Array) : void
{
	if (null == ip)
		throw "StorageLogic -> _setData(ItemPack, int, Array) -> parameter_1 is null!";
	
	if (null==type_arr || 0==type_arr.Count)
		throw "StorageLogic -> _setData(ItemPack, int, Array) -> parameter_2 is null!";
	
	if (null == arr)
		throw "StorageLogic -> _setData(ItemPack, int, Array) -> parameter_3 is null!";
	
	for (var type : int in type_arr)
	{
		for (var i:int=0; i<ip.count(); ++i)
		{
			var pg : PackGrid = ip.getPackGrid(i);
			if (type == pg._item._itemInfo.type)
			{
				arr.Add(new FitmentPackGrid(pg));
			}
		}
	}
}
//--------------------------------------------------
// 分离出道具
private function _setPropData(ip : ItemPack) : void
{
	mPropPackGrids.Clear();
	var prop_arr : Array = new Array();
	prop_arr.Add(ItemType.Prop);
	prop_arr.Add(ItemType.Food);
	prop_arr.Add(ItemType.PropCantUse);
	prop_arr.Add(ItemType.ClothesGift);
	prop_arr.Add(ItemType.FurnitureGift);
	prop_arr.Add(ItemType.MaterialGift);
	_setData(ip, prop_arr, mPropPackGrids);
	mPropPage.reset(mPropPackGrids, SLOT_NUM, 0);
}
//--------------------------------------------------
// 分离出人物装饰
private function _setPersonData(ip : ItemPack) : void
{
	mPersonPackGrids.Clear();
	var clothes_arr : Array = new Array();
	clothes_arr.Add(ItemType.Clothes);
	_setData(ip, clothes_arr, mPersonPackGrids);
	mPersonPage.reset(mPersonPackGrids, SLOT_NUM, 0);
}
//--------------------------------------------------
// 分离出家具装饰
private function _setHouseData(ip : ItemPack) : void
{
	mHousePackGrids.Clear();
	var furniture_arr : Array = new Array();
	furniture_arr.Add(ItemType.Furniture);
	_setData(ip, furniture_arr, mHousePackGrids);
	mHousePage.reset(mHousePackGrids, SLOT_NUM, 0);
}
//--------------------------------------------------
// 分离出炼金图纸
private function _setComposePaperData(ip : ItemPack) : void
{
	mComposePaperPackGrids.Clear();
	var compose_paper_arr : Array = new Array();
	compose_paper_arr.Add(ItemType.ComposePaper);
	_setData(ip, compose_paper_arr, mComposePaperPackGrids);
	mComposePaperPage.reset(mComposePaperPackGrids, SLOT_NUM, 0);
}
//--------------------------------------------------
// 分离出炼金材质
private function _setComposeMaterialData(ip : ItemPack) : void
{
	mComposeMaterialPackGrids.Clear();
	var compose_material_arr : Array = new Array();
	compose_material_arr.Add(ItemType.ComposeMaterial);
	_setData(ip, compose_material_arr, mComposeMaterialPackGrids);
	mComposeMaterialPage.reset(mComposeMaterialPackGrids, SLOT_NUM, 0);
}
//--------------------------------------------------
// 分离出种子
private function _setSeedData(ip : ItemPack) : void
{
	mSeedPackGrids.Clear();
	var seed_arr : Array = new Array();
	seed_arr.Add(ItemType.Seed);
	_setData(ip, seed_arr, mSeedPackGrids);
	mSeedPage.reset(mSeedPackGrids, SLOT_NUM, 0);
}
//--------------------------------------------------
// 添加物品
private function _addPackGrid(grid : PackGrid) : void
{
	var type : ItemType = grid._item._itemInfo.type;
	var fpg : FitmentPackGrid = new FitmentPackGrid(grid);
	if (ItemType.Clothes==type)			// 服饰
	{
		mPersonPackGrids.Add(fpg);
		mPersonPage.reset(mPersonPackGrids, SLOT_NUM, mPersonPage.getBeginIndex());
	}
	else if (ItemType.Furniture == type)	// 家具
	{
		mHousePackGrids.Add(fpg);
		mHousePage.reset(mHousePackGrids, SLOT_NUM, mHousePage.getBeginIndex());
	}
	else if (ItemType.Prop==type || ItemType.PropCantUse==type || ItemType.ClothesGift==type || 
			ItemType.FurnitureGift==type || ItemType.MaterialGift==type || ItemType.Food==type)	// 道具
	{
		mPropPackGrids.Add(fpg);
		mPropPage.reset(mPropPackGrids, SLOT_NUM, mPropPage.getBeginIndex());
	}
	else if (ItemType.ComposePaper == type)		// 炼金图纸
	{
		mComposePaperPackGrids.Add(fpg);
		mComposePaperPage.reset(mComposePaperPackGrids, SLOT_NUM, mComposePaperPage.getBeginIndex());
	}
	else if (ItemType.ComposeMaterial == type)	// 炼金材料
	{
		mComposeMaterialPackGrids.Add(fpg);
		mComposeMaterialPage.reset(mComposeMaterialPackGrids, SLOT_NUM, mComposeMaterialPage.getBeginIndex());
	}
	else if (ItemType.Seed == type)				// 种子
	{
		mSeedPackGrids.Add(fpg);
		mSeedPage.reset(mSeedPackGrids, SLOT_NUM, mSeedPage.getBeginIndex());
	}
}
//--------------------------------------------------
// 删除物品
private function _delPackGrid(grid : PackGrid, packgrids : Array, pg : Page) : void
{
	var dix : int = -1;
	for (var i:int=0; i<packgrids.Count; ++i)
	{
		var fpg : FitmentPackGrid = packgrids[i] as FitmentPackGrid;
		if (fpg.packGrid._item._instanceID == grid._item._instanceID)
		{
			dix = i;
			break;
		}
	}
	
	if (-1 == dix)
		return;
	
	packgrids.RemoveAt(dix);
	
	var index : int = pg.getBeginIndex();
	if (index >= packgrids.Count)
	{
		index = packgrids.Count - 1;
	}
	if (index < 0)
	{
		index = 0;
	}
	pg.reset(packgrids, SLOT_NUM, index);
}
//--------------------------------------------------
// 更新物品
private function _updatePackGrid(grid : PackGrid, packgrids : Array) : void
{
	for (var i:int=0; i<packgrids.Count; ++i)
	{
		var fpg : FitmentPackGrid = packgrids[i] as FitmentPackGrid;
		if (fpg.packGrid._item._instanceID == grid._item._instanceID)
		{
			fpg.packGrid._count = grid._count;
			return;
		}
	}
}
//--------------------------------------------------
// 格子是否属于当前类型
private function _isCurStorageType(pg : PackGrid) : boolean
{
	var type : ItemType = pg._item._itemInfo.type;
	
	// 过滤掉非当前类型
	if (0 == mStorageType && (ItemType.Prop!=type && ItemType.PropCantUse!=type && ItemType.ClothesGift!=type && 
		ItemType.FurnitureGift!=type && ItemType.MaterialGift!=type && ItemType.Food!=type))	// 道具
		return false;
	else if (1==mStorageType && ItemType.Clothes!=type)				// 人物装饰
		return false;
	else if (2==mStorageType && ItemType.Furniture!=type)			// 家居装饰
		return false;
	else if (3==mStorageType && ItemType.ComposePaper!=type)		// 炼金图纸
		return false;
	else if (4==mStorageType && ItemType.ComposeMaterial!=type)		// 炼金材料
		return false;
	else if (5==mStorageType && ItemType.Seed!=type)				// 种子
		return false;
	
	return true;
}
//--------------------------------------------------
// 进入背包
public function enterStorage() : void
{
	// slots
	for (var i:int=0; i<SLOT_NUM; ++i)
	{
		mStorageSlots.Add(new StorageSlot(i));
	}
	
	var lp : ItemPack = SelfItemLogic.getInstance()._loverPackage;
	_setPropData(lp);
	_setPersonData(lp);
	_setHouseData(lp);
	_setComposePaperData(lp);
	_setComposeMaterialData(lp);
	_setSeedData(lp);
	
	// 设置默认分栏
	var type : int = _getDefaultStorageType();
	_changeStorageType(type);
	iGUICode_StorageBoxUI.getInstance().openDefaultStorage(type);
}
//--------------------------------------------------
// 退出背包
public function exitStorage() : void
{
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.POST_MULTISELECTSTATE), false);
	ResetAllPackItemsMultiSelectedState();
	RemoveAllSelectItems();
	ResetMultiSalePrice();
	
	_changeStorageType(-1);
	mStorageSlots.Clear();
	mPropPackGrids.Clear();
	mPersonPackGrids.Clear();
	mHousePackGrids.Clear();
	mComposePaperPackGrids.Clear();
	mComposeMaterialPackGrids.Clear();
	mSeedPackGrids.Clear();
}
//--------------------------------------------------
// 更新物品
private function _updateStorageSlots() : void
{
	for (var i:int=0; i<mStorageSlots.Count; ++i)
	{
		var slot : StorageSlot = mStorageSlots[i] as StorageSlot;
		slot.updateToUI(_getPackGridByIndex(i));
	}
}
//--------------------------------------------------
// 改变背包类型
private function _changeStorageType(type : int) : void
{
	if (type == mStorageType)
		return;
	
	_unselectPackGrid();	// step1:放在下面赋值之前
	mStorageType = type;	// step2
	_updateStorageSlots();	// step3
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.TO_RESET_MULTISELECTFRAME));
}
//--------------------------------------------------
// 获取打开背包时,默认的背包类型(优先级:道具>人物装饰>家居装饰)
private function _getDefaultStorageType() : int
{
	if (mPropPackGrids.Count > 0) return 0;					// 道具
	if (mPersonPackGrids.Count > 0) return 1;				// 人物装饰
	if (mHousePackGrids.Count > 0) return 2;				// 家居装饰
	if (mComposePaperPackGrids.Count > 0) return 3;			// 炼金图纸
	if (mComposeMaterialPackGrids.Count > 0) return 4;		// 炼金材料
	if (mSeedPackGrids.Count > 0) return 5;					// 种子
	
	return 0;
}
//--------------------------------------------------
// 道具模式
public function propMode() : void
{
	_changeStorageType(0);
}
//--------------------------------------------------
// 人物装饰模式
public function personMode() : void
{
	_changeStorageType(1);
}
//--------------------------------------------------
// 家居装饰模式
public function houseMode() : void
{
	_changeStorageType(2);
}
//--------------------------------------------------
// 炼金图纸模式
public function composePaperMode() : void
{
	_changeStorageType(3);
}
//--------------------------------------------------
// 炼金材料模式
public function composeMaterialMode() : void
{
	_changeStorageType(4);
}
//--------------------------------------------------
// 种子模式
public function seedMode() : void
{
	_changeStorageType(5);
}
//--------------------------------------------------
// 根据控件获取物品
private function _getStorageSlotByCaller(caller : iGUIElement) : System.Object[]
{
	var result : System.Object[] = new System.Object[2];
	result[0] = null;
	result[1] = -1;
	
	for (var i:int=0; i<mStorageSlots.Count; ++i)
	{
		var slot : StorageSlot = mStorageSlots[i] as StorageSlot;
		if (slot.mSelectLabel == caller)
		{
			result[0] = slot;
			result[1] = i;
			return result;
		}
	}
	return result;
}
//--------------------------------------------------
// 鼠标进入
public function mouseMoveSlot(caller : iGUIElement) : void
{
	var result : System.Object[] = _getStorageSlotByCaller(caller);
	var slot : StorageSlot = result[0] as StorageSlot;
	if (slot)
	{
		slot.showTooltip();
	}
}
//--------------------------------------------------
// 点击背包物品
public function clickSlot(caller : iGUIElement) : void
{
	if(!isMultiSelectState)
		_singleClickLogic(caller);
	else
		_multiSelectLogic(caller);
		
}
//--------------------------------------------------
//选择多个逻辑
private function _multiSelectLogic(caller : iGUIElement){
	var storage = _getCurStorage();
	var packGrids : Array = storage[0] as Array;
	var pg : Page = storage[1] as Page;
	if (null==packGrids || null==pg)
		return;
	
	var result : System.Object[] = _getStorageSlotByCaller(caller);
	var slot : StorageSlot = result[0] as StorageSlot;
	if (null == slot)
		return;
	
	var num : int = result[1];
	var index : int = pg.getBeginIndex() + num;
	if (index < packGrids.Count)
	{
		var fpg : FitmentPackGrid = packGrids[index] as FitmentPackGrid;
		fpg.multi_selected = !fpg.multi_selected;
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.PACKITEM_SELECTSTATE_CHANGED), fpg);
	}
}
//--------------------------------------------------
//(原有的点击格子逻辑)对单个物品操作
private function _singleClickLogic(caller : iGUIElement):void{
	var storage = _getCurStorage();
	var packGrids : Array = storage[0] as Array;
	var pg : Page = storage[1] as Page;
	if (null==packGrids || null==pg)
		return;
	
	var result : System.Object[] = _getStorageSlotByCaller(caller);
	var slot : StorageSlot = result[0] as StorageSlot;
	if (null == slot)
		return;
	
	var num : int = result[1];
	var index : int = pg.getBeginIndex() + num;
	if (index < packGrids.Count)
	{
		var fpg : FitmentPackGrid = packGrids[index] as FitmentPackGrid;
		if (fpg.select)
		{
			_unselectPackGrid();
		}
		else
		{
			_selectPackGrid(index);
		}
	}
	else
	{
		_unselectPackGrid();
	}
	
	_updateStorageSlots();
	//
	if (index < packGrids.Count)
	{
		var fpg_1 : FitmentPackGrid = packGrids[index] as FitmentPackGrid;
		GiftLogic.Ctrl.Excute("select_gift_item", fpg_1.packGrid);
	}

}
//--------------------------------------------------
// 设置背包里对应索引的物品为选中状态
private function _selectPackGrid(ix : int) : void
{
	_unselectPackGrid();
	
	var storage : System.Object[] = _getCurStorage();
	var packGrids : Array = storage[0] as Array;
	if (packGrids)
	{
		var fpg : FitmentPackGrid = packGrids[ix] as FitmentPackGrid;
		fpg.select = true;
	}
}
//--------------------------------------------------
// 取消背包里物品的被选中状态
private function _unselectPackGrid() : void
{
	var select : System.Object[] = _getSelectPackGrid();
	var fpg : FitmentPackGrid = select[0] as FitmentPackGrid;
	if (fpg)
	{
		fpg.select = false; 
	}
}
//--------------------------------------------------
// 取消选中
public function unselectPackGrid() : void
{
	if (-1 == mStorageType)
		return;
	
	_unselectPackGrid();
	_updateStorageSlots();
}
//--------------------------------------------------
// 获取当前选中的背包物品
private function _getSelectPackGrid() : System.Object[]
{
	var result : System.Object[] = new System.Object[2];
	result[0] = null;
	result[1] = -1;
	
	var storage : System.Object[] = _getCurStorage();
	var packGrids : Array = storage[0] as Array;
	if (null == packGrids)
	{
		return result;
	}
	for (var i:int=0; i<packGrids.Count; ++i)
	{
		var fpg : FitmentPackGrid = packGrids[i] as FitmentPackGrid;
		if (fpg.select)
		{
			result[0] = fpg;
			result[1] = i;
			return result;
		}
	}
	
	return result;
}
//--------------------------------------------------
// 根据索引获取背包物品
private function _getPackGridByIndex(index : int) : FitmentPackGrid
{
	var storage : System.Object[] = _getCurStorage();
	var packGrids : Array = storage[0] as Array;
	var pg : Page = storage[1] as Page;
	if (null==packGrids || null==pg)
		return null;
	
	var ix : int = pg.getBeginIndex() + index;
	if (ix < packGrids.Count)
		return packGrids[ix] as FitmentPackGrid;
	
	return null;
}
//--------------------------------------------------
// 获取当前选中的背包物品
public function getSelectPackGrid() : FitmentPackGrid
{
	var select : System.Object[] = _getSelectPackGrid();
	return select[0] as FitmentPackGrid;
}
//--------------------------------------------------
// 获取当前类型的背包列表
private function _getCurStorage() : System.Object[]
{
	var result : System.Object[] = new System.Object[2];
	result[0] = null;
	result[1] = null;
	
	if (0 == mStorageType)			// 道具
	{
		result[0] = mPropPackGrids;
		result[1] = mPropPage;
		return result;
	}
	if (1 == mStorageType)			// 人物装饰
	{
		result[0] = mPersonPackGrids;
		result[1] = mPersonPage;
		return result;
	}
	if (2 == mStorageType)			// 家居装饰
	{
		result[0] = mHousePackGrids;
		result[1] = mHousePage;
		return result;
	}
	if (3 == mStorageType)			// 炼金图纸
	{
		result[0] = mComposePaperPackGrids;
		result[1] = mComposePaperPage;
		return result;
	}
	if (4 == mStorageType)			// 炼金材料
	{
		result[0] = mComposeMaterialPackGrids;
		result[1] = mComposeMaterialPage;
		return result;
	}
	if (5 == mStorageType)			// 种子
	{
		result[0] = mSeedPackGrids;
		result[1] = mSeedPage;
		return result;
	}
	
	return result;
}
//--------------------------------------------------
// 移动物品:0,<; 1,>; 2,<<; 3,>>
public function pageMove(x : int) : void
{
	var storage : System.Object[] = _getCurStorage();
	var pg : Page = storage[1] as Page;
	if (null == pg)
		return;
	
	if (0 == x) { pg.movePreOne(); }
	if (1 == x) { pg.moveNextOne(); }
	if (2 == x) { pg.movePrePage(); }
	if (3 == x) { pg.moveNextPage(); }
	
	_updateStorageSlots();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.TO_RESET_MULTISELECTFRAME));
}
//--------------------------------------------------
// 处理背包增加物品事件
public function loverPackageAddGrid(evt:GameEvent, obj:System.Object) : void
{
	if (-1 == mStorageType)
		return;
	
	var grid : PackGrid = obj as PackGrid;
	_addPackGrid(grid);
	
	// 过滤掉非当前类型
	if (false == _isCurStorageType(grid))
		return;
	
	_updateStorageSlots();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.TO_RESET_MULTISELECTFRAME));
}
//--------------------------------------------------
// 处理背包删除物品事件
public function loverPackageDelGridBegin(evt:GameEvent, obj:System.Object) : void
{
	if (-1 == mStorageType)
		return;
	
	var grid : PackGrid = obj as PackGrid;
	_delPackGrid(grid, mPersonPackGrids, mPersonPage);
	_delPackGrid(grid, mHousePackGrids, mHousePage);
	_delPackGrid(grid, mPropPackGrids, mPropPage);
	_delPackGrid(grid, mComposePaperPackGrids, mComposePaperPage);
	_delPackGrid(grid, mComposeMaterialPackGrids, mComposeMaterialPage);
	_delPackGrid(grid, mSeedPackGrids, mSeedPage);
	
	// 过滤掉非当前类型
	if (false == _isCurStorageType(grid))
		return;
	
	_updateStorageSlots();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.TO_RESET_MULTISELECTFRAME));
}
//--------------------------------------------------
// 处理背包物品更新事件
public function loverPackageUpdateGrid(evt:GameEvent, obj:System.Object) : void
{
	if (-1 == mStorageType)
		return;
	
	var grid : PackGrid = obj as PackGrid;
	_updatePackGrid(grid, mPersonPackGrids);
	_updatePackGrid(grid, mHousePackGrids);
	_updatePackGrid(grid, mPropPackGrids);
	_updatePackGrid(grid, mComposePaperPackGrids);
	_updatePackGrid(grid, mComposeMaterialPackGrids);
	_updatePackGrid(grid, mSeedPackGrids);
	
	// 过滤掉非当前类型
	if (false == _isCurStorageType(grid))
		return;
	
	_updateStorageSlots();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.TO_RESET_MULTISELECTFRAME));
}
//--------------------------------------------------
function NotifyMultiSelectStateChanged(evt : GameEvent, obj : Object){
	var state : boolean = Convert.ToBoolean(obj);
	isMultiSelectState = state;
	if(state){
		
	}
	else{
		//multiSaleBtn状态转为不能点击
		ResetAllPackItemsMultiSelectedState();
		RemoveAllSelectItems();
		ResetMultiSalePrice();
	}
}
//---------------------------------------------------
function HandlePackItemSelectStateChanged(evt : GameEvent, obj : Object){
	var fpg : FitmentPackGrid = obj as FitmentPackGrid;
	UpdateMultiSelectArray(fpg);
	UpdateMultiSelectStateUI();
}
//--------------------------------------------------
private function UpdateMultiSelectStateUI(){
	for (var i:int=0; i<mStorageSlots.Count; ++i)
	{
		var slot : StorageSlot = mStorageSlots[i] as StorageSlot;
		slot.UpdateMultiSelectStateUI(_getPackGridByIndex(i));
	}
}
//----------------------------------------------------
function UpdateMultiSelectArray(fpg : FitmentPackGrid){
	if(fpg.multi_selected){
		AddSelectedToArray(fpg.packGrid._item._instanceID);
		SetMultiSalePrice(fpg.packGrid._item._itemInfo.sell_price * fpg.packGrid._count);
	}
	else{
		DeleteUnSelectedFromArray(fpg.packGrid._item._instanceID);
		SetMultiSalePrice(-(fpg.packGrid._item._itemInfo.sell_price * fpg.packGrid._count));
	}
}
//----------------------------------------------------
function SetMultiSalePrice(price : int){
	mMultiSalePrice += price;
}
//----------------------------------------------------
function ResetMultiSalePrice(){
	mMultiSalePrice = 0;
}
//----------------------------------------------------
function AddSelectedToArray(inst_id : UInt64){
	if(!IsPackItemInArray(inst_id)){
		mMultiSelectedItems.Add(inst_id);
	}
}
//----------------------------------------------------
function DeleteUnSelectedFromArray(inst_id : UInt64){
	if(IsPackItemInArray(inst_id)){
		mMultiSelectedItems.Remove(inst_id);
	}
}
//----------------------------------------------------
function GetMulitSelectedList() : ArrayList {
	return mMultiSelectedItems;
}
//-----------------------------------------------------
function IsPackItemInArray(inst_id : UInt64) : boolean {
	return mMultiSelectedItems.Contains(inst_id);
}
//--
function RemoveAllSelectItems(){
	mMultiSelectedItems.Clear();
}
//-----------------------------------------------------
function ResetAllPackItemsMultiSelectedState(){
	for(var idx:int=0; idx< mPropPackGrids.Count; ++idx){
		var fpg : FitmentPackGrid = mPropPackGrids[idx] as FitmentPackGrid;
		fpg.multi_selected = false;	
	}
	
	for(var idx1:int=0; idx1< mPersonPackGrids.Count; ++idx1){
		var fpg1 : FitmentPackGrid = mPersonPackGrids[idx1] as FitmentPackGrid;
		fpg1.multi_selected = false;	
	}
	
	for(var idx2:int=0; idx2< mHousePackGrids.Count; ++idx2){
		var fpg2 : FitmentPackGrid = mHousePackGrids[idx2] as FitmentPackGrid;
		fpg2.multi_selected = false;	
	}
	
	for(var idx3:int=0; idx3< mComposePaperPackGrids.Count; ++idx3){
		var fpg3 : FitmentPackGrid = mComposePaperPackGrids[idx3] as FitmentPackGrid;
		fpg3.multi_selected = false;	
	}
	
	for(var idx4:int=0; idx4< mComposeMaterialPackGrids.Count; ++idx4){
		var fpg4 : FitmentPackGrid = mComposeMaterialPackGrids[idx4] as FitmentPackGrid;
		fpg4.multi_selected = false;	
	}
	
	for(var idx5:int=0; idx5< mSeedPackGrids.Count; ++idx5){
		var fpg5 : FitmentPackGrid = mSeedPackGrids[idx5] as FitmentPackGrid;
		fpg5.multi_selected = false;	
	}
}
//-------------------------------------------------------
function HandleUpdateMultiSelectFrames(evt : GameEvent, obj : Object){
	UpdateMultiSelectStateUI();
}
//--------------------------------------------------------
function HandleClickMultiSaleBtn(evt : GameEvent, obj : Object){
	if(mMultiSelectedItems.Count <= 0)
		return;
	
	MultiSaleMsg();
}
//---------------------------------------------------------
function MultiSaleMsg(){
	var bUnSold : boolean = false;
	var sell_price : int = 0;
	for(var id : UInt64 in mMultiSelectedItems) {
		var pg : PackGrid = SelfItemLogic.getInstance().Package.getItemPack(id);
		if(pg == null) continue;
		if(pg._item._itemInfo.sell_price > 0) {
			sell_price += pg._item._itemInfo.sell_price * pg._count;
		} else {
			var params : ArrayList = new ArrayList();
			params.Add(pg._item._itemInfo.name);
			Global.GetSysMsgHandler().ShowSysMsg(518, params);
		}
	}
	if(sell_price > 0) {
		var content : String = Define.getContent(5126, [sell_price.ToString()]);
		UI.getUI().OpenMsgbox("", content, Define.ok, ConfirmMultiSale as iGUIEventCallback, Define.cancel, CancelMultiSale as iGUIEventCallback);
	}

}
//---------------------------------------------------------
function ConfirmMultiSale(caller : iGUIElement){
	var req : req_delete_lover_item = new req_delete_lover_item();
	for(var id : UInt64 in mMultiSelectedItems) {
		var pg : PackGrid = SelfItemLogic.getInstance().Package.getItemPack(id);
		if(pg != null && pg._item._itemInfo.sell_price > 0) {
			req.item_inst_ids.Add(id);
		}
	}
	if(req.item_inst_ids.Count > 0) {
		NetHelper.Send(req);
	}
	
	RemoveAllSelectItems();
	ResetMultiSalePrice();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.TO_RESET_MULTISELECTFRAME));
}
//---------------------------------------------------------
function CancelMultiSale(caller : iGUIElement){

}