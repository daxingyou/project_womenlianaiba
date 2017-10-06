/* create by Y3
 * 这里的代码写的无比的乱啊. 我自己都快看不下去了.
*/
#pragma strict
#pragma downcast



// 变量
private var SLOT_NUM : int = 11;						// 每页的物品数
private var mFitmentType : int = -1;					// 家装类型:-1,none 0,package 1,class  2,store 
private var mFitmentSlots : Array = new Array();		// 每页的物品选项,[FitmentSlot]
private var mReqChangeFitment : boolean = false;		// 是否有请求家装操作
private var mTotalDiamondCost : int = 0;				// 购买的水晶总数
private var mTotalMoneyCost : int = 0;					// 购买的恋爱币总数
@HideInInspector
public var inFitmenting : boolean = false;				// 是否在家装状态下标识

// 各种临时的保存车
private var mShopCart : Hashtable = new Hashtable();	// 购物车,[uid, Array(HouseSceneComponent, ShopCenterRow)]
private var mLayCart : Hashtable = new Hashtable();		// 摆放车,[instance_id, Array(HouseSceneComponent, PackGrid)]
private var mTakeCart : Hashtable = new Hashtable();	// 回收车,[instance_id, Array(house_furniture, oldGrid, oldFace, oldBottom)]
private var mMoveCart : Hashtable = new Hashtable();	// 移动车,[instance_id, Array(HouseSceneComponent, oldGrid, oldFace, oldBottom)]

// 商城分类
@HideInInspector
public var shopClasses : Array = new Array();			// 商城里的物品分类,[ShopCenterClassRow]
@HideInInspector
public var pageClass : Page = new Page();				// 商城物品分类对应的分页
private var mCurClass : ShopCenterClassRow = null;		// 当前选中的物品分类

// 商城物品
@HideInInspector
public var shopItems : Array = new Array();				// 商城里的物品,[ShopCenterRow]
@HideInInspector
public var pageShopItem : Page = new Page();			// 商城物品对应的分页
@HideInInspector
private var mCurSelectIndex : int = -1;					// 当前选中的商城物品的索引(在当前页的索引)
private var mCurSelectItem : ShopCenterRow = null;		// 当前选中的物品

// 商城背包
@HideInInspector
public var fitmentPackGrids : Array = new Array();		// 背包里的物品,[FitmentPackGrid]
@HideInInspector
public var pageFitmentPack : Page = new Page();			// 背包物品对应的分页

// 装饰度相关
private var mCurFurniNum : int = 0;						// 当前家具数量
private var mCurDecoration : int = 0;					// 当前装饰度
//--------------------------------------------------
private static var instance : FitmentLogic;
public static function getInstance() : FitmentLogic
{
	return instance;
}
//--------------------------------------------------
// override function
function Awake()
{
	instance=this;
}
//--------------------------------------------------
// override function
function Start()
{
	RegistNetMsg();
	RegistEventMsg();
}
//--------------------------------------------------
// 进入家装模式
public function enterFitment() : void
{
	EQSceneManager.getSingleton().startDecorate();
	inFitmenting = true;
	// slots
	for (var i:int=0; i<SLOT_NUM; ++i)
	{
		mFitmentSlots.Add(new FitmentSlot(i));
	}
	// 商城背包
	var lp : ItemPack = SelfItemLogic.getInstance()._loverPackage;
	for (var j:int=0; j<lp.count(); ++j)
	{
		var pg : PackGrid = lp.getPackGrid(j);
		if (ItemType.Furniture == pg._item._itemInfo.type)
		{
			fitmentPackGrids.Add(new FitmentPackGrid(pg));
		}
	}
	pageFitmentPack.reset(fitmentPackGrids, SLOT_NUM, 0);
	// 商城分类
	if (0 == shopClasses.Count)
	{
		for (var sccr : ShopCenterClassRow in ResManager.LgtMgr.ShopCenterClassTable)
		{
			if (NewPlayGuideModule.IsInNewHandTasks())	// 玩家在新手阶段
			{
				if (!sccr.newcomer)	// 过滤非新手物品
					continue;
			}
			else										// 玩家在非新手阶段
			{
				if (sccr.newcomer)	// 过滤新手物品
					continue;
			}
			if (1 == sccr.buytype)	// 家具类型
			{
				shopClasses.Add(sccr);
			}
		}
		pageClass.reset(shopClasses, SLOT_NUM, 0);
	}
	// 初始设置
	changeFitmentType(1);	// 进入家装默认为商城分类
	GiftLogic.Ctrl.Excute("set_gift_box_visible", false);
//	setCameraPos();
	mCurFurniNum = Property.getInstance().getCurFurniNum();
	mCurDecoration = Property.getInstance().getDecoration();
}
//--------------------------------------------------
// 退出家装模式
private function endFitment() : void
{
	inFitmenting = false;
	changeFitmentType(-1);
	mFitmentSlots.Clear();
	fitmentPackGrids.Clear();
	shopClasses.Clear();
	
	EQSceneManager.getSingleton().endDecorate();
	GiftLogic.Ctrl.Excute("set_gift_box_visible", true);
//	setCameraPos();
}
//--------------------------------------------------
// 创建商城里不同分类的物品
private function createShopItems() : void
{
	if (null == mCurClass)
		throw "FitmentLogic -> createShopItems() -> isn't select shop class.";
	
	shopItems.Clear();
	for (var scr : ShopCenterRow in ResManager.LgtMgr.ShopCenterTable)
	{
		if (NewPlayGuideModule.IsInNewHandTasks())	// 玩家在新手阶段
		{
			if (!scr.newcomer)	// 过滤非新手物品
				continue;
		}
		else										// 玩家在非新手阶段
		{
			if (scr.newcomer)	// 过滤新手物品
				continue;
		}
		if (scr.visible && scr.type == mCurClass.type)
		{
			shopItems.Add(scr);
		}
	}
	pageShopItem.reset(shopItems, SLOT_NUM - 1, 0);
}
//--------------------------------------------------
// 更新物品
private function updateFitmentSlots() : void
{
	for (var slot : FitmentSlot in mFitmentSlots)
	{
		slot.updateToUI(mFitmentType);
	}
}
//--------------------------------------------------
// 改变家装类型
private function changeFitmentType(type : int) : void
{
	if (type == mFitmentType)
		return;
	
	mFitmentType = type;
	// step1:清除选中项
	unselectPackGrid();
	unselectShopItem();
	// step2:创建商城物品
	if (2 == type)
	{
		createShopItems();
	}
	// step3:更新界面
	updateFitmentSlots();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_CHANGE_FITMENT_TYPE), type);
}
//--------------------------------------------------
// 获取当前选中的背包物品的索引(在整个背包列表的索引)
private function indexSelectPackGrid() : int
{
	for (var i:int=0; i<fitmentPackGrids.Count; ++i)
	{
		if ((fitmentPackGrids[i] as FitmentPackGrid).select)
			return i;
	}
	return -1;
}
//--------------------------------------------------
// 设置背包里对应索引的物品为选中状态
private function selectPackGrid(index : int) : void
{
	(fitmentPackGrids[index] as FitmentPackGrid).select = true;
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.SELECT_PACK_FURNI), fitmentPackGrids[index] as FitmentPackGrid);
}
//--------------------------------------------------
// 取消背包里物品的被选中状态
public function unselectPackGrid() : void
{
	var index : int = indexSelectPackGrid();
	if (-1 == index)
		return;
	
	(fitmentPackGrids[index] as FitmentPackGrid).select = false;
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.UNSELECT_PACK_FURNI));
}
//--------------------------------------------------
// 设置选中商城里对应索引的物品
private function selectShopItem(index : int) : void
{
	mCurSelectIndex = index;
	mCurSelectItem = shopItems[mCurSelectIndex];
}
//--------------------------------------------------
// 取消商城里的选中物品
private function unselectShopItem() : void
{
	mCurSelectIndex = -1;
	mCurSelectItem = null;
}
//--------------------------------------------------
// 商城模式
public function shopMode() : void
{
	if (1 == mFitmentType || 2 == mFitmentType)
		return;
	
	if (null == mCurClass)
	{
		changeFitmentType(1);	// 商城分类
	}
	else
	{
		changeFitmentType(2);	// 商城物品
	}
	FitmentEventMgr.getSingleton().undo();	// 取消对还未摆放的家具操作
}
//--------------------------------------------------
// 背包模式
public function packageMode() : void
{
	if (0 == mFitmentType)
		return;
	
	changeFitmentType(0);		// 商城背包
	FitmentEventMgr.getSingleton().undo();	// 取消对还未摆放的家具操作
}
//--------------------------------------------------
// 点击物品选项
public function clickSlot(caller : iGUIElement) : void
{
	// step1:有家具正在旋转,点击物品无效
	if (FitmentEventMgr.getSingleton().getFitment())
		return;
	
	// step2:已有选中的物品,取消选中
	if (-1 != getSelect())
	{
		clearSelect();
		return;
	}
	
	// 获取物品索引
	var index : int = -1;
	for (var i:int=0; i<SLOT_NUM; ++i)
	{
		if ((mFitmentSlots[i] as FitmentSlot).isSlot(caller))	// 点击选中物品
		{
			index = i;
			break;
		}
	}
	handleFitmentType(index);
}
//--------------------------------------------------
// 处理不同类型家装模式
public function handleFitmentType(index : int) : void
{
	if (-1 == index)
		return;
	
	// 处理点击不同家装模式
	var ix : int = 0;
	switch (mFitmentType)
	{
	case 0:			// 商城背包
		ix = pageFitmentPack.getBeginIndex() + index;
		if (ix < fitmentPackGrids.Count)
		{
			unselectPackGrid();
			// 等级不匹配,消息框提示
			var fpg : FitmentPackGrid = fitmentPackGrids[ix];
			if (fpg.packGrid._item._itemInfo.use_level > DataCenter.getMainPlayerCurLv())
			{
				Global.GetSysMsgHandler().ShowSysMsg(514);
				return;
			}
			if (false == fpg.select)
			{
				selectPackGrid(ix);
			}
		}
		break;
	case 1:			// 商城分类
		ix = pageClass.getBeginIndex() + index;
		if (ix < shopClasses.Count)
		{
			mCurClass = shopClasses[ix];
			if (FurnitureUnlockLogic.getInstance().isUnlock(mCurClass))	// 需要解锁
			{
				FurnitureUnlockLogic.getInstance().openUnlockUI(mCurClass);
				return;
			}
			else	// 不需要解锁
			{
				changeFitmentType(2);
				EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.SELECT_FURNI_TYPE));
				return;
			}
		}
		break;
	case 2:			// 商城物品
		if (SLOT_NUM - 1 == index)		// 返回按钮
		{
			mCurClass = null;
			changeFitmentType(1);
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.RETURN_TO_TYPE_LIST));
			return;
		}
		else
		{
			ix = pageShopItem.getBeginIndex() + index;
			if (ix < shopItems.Count)
			{
				var scr : ShopCenterRow = shopItems[ix];
				if (null == scr || scr.limit_level > DataCenter.getMainPlayerCurLv())
				{
					Global.GetSysMsgHandler().ShowSysMsg(404);
					return;
				}
				else
				{
					unselectShopItem();
					if (ix != mCurSelectIndex)
					{
						selectShopItem(ix);
						EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.SELECT_FURNI), scr.type);
					}
				}
			}
		}
		break;
	}
	// 更新物品
	updateFitmentSlots();
}
//--------------------------------------------------
// 移动物品:0,<; 1,>; 2,<<; 3,>>
public function pageMove(x : int) : void
{
	var page : Page = null;
	switch (mFitmentType)
	{
	case 0: page = pageFitmentPack; break;	// 商城背包
	case 1: page = pageClass; break;		// 商城分类
	case 2: page = pageShopItem; break;		// 商城物品
	}
	
	if (null == page) return;
	
	switch(x)
	{
	case 0: page.movePreOne(); break;		// <
	case 1: page.moveNextOne(); break;		// >
	case 2: page.movePrePage(); break;		// <<
	case 3: page.moveNextPage(); break;		// >>
	}
	
	updateFitmentSlots();
}
//--------------------------------------------------
// 设置当前选中的商品类型
public function setCurClass(scc : ShopCenterClassRow) : void
{
	mCurClass = scc;
}
//--------------------------------------------------
// 获取当前选中的商品类型
public function getCurClass() : ShopCenterClassRow
{
	return mCurClass;
}
//--------------------------------------------------
// 获取当前选中的商品索引
public function getCurItemIndex() : int
{
	return mCurSelectIndex;
}
//--------------------------------------------------
// 请求开始编辑房屋
public function ReqStartEditHouse() : void
{
	var packet:req_start_edit_house = new req_start_edit_house();
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 请求结束编辑房屋
public function ReqEndEditHouse() : void
{
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.EXIT_EDIT_HOUSE));
	var packet:req_end_edit_house = new req_end_edit_house();
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 请求改变家具
private function ReqChangeFurnitures(take_cart : Hashtable, lay_cart : Hashtable, move_cart : Hashtable, shop_cart : Hashtable) : void
{
	mReqChangeFitment = true;
	var packet : req_change_furnitures = new req_change_furnitures();
	for (var take_kv : DictionaryEntry in take_cart)	// 回收家具
	{
		var take_instance_id : UInt64 = take_kv.Key;
		packet.recovery_furnitures.Add(take_instance_id);
	}
	for (var lay_kv : DictionaryEntry in lay_cart)		// 摆放家具
	{
		var lay_arr : Array = lay_kv.Value as Array;
		var lay_comp : HouseSceneComponent = lay_arr[0] as HouseSceneComponent;
		
		var lay_info : furniture_place_info = new furniture_place_info();
		lay_info.instance_id = lay_comp.InstId;
		lay_info.x = lay_comp.X;
		lay_info.z = lay_comp.Z;
		lay_info.height = lay_comp.Height;
		lay_info.floor = lay_comp.FloorNo;
		lay_info.face = lay_comp.Face;
		
		packet.placed_furnitures.Add(lay_info);
	}
	for (var move_kv : DictionaryEntry in move_cart)	// 移动家具
	{
		var move_arr : Array = move_kv.Value as Array;
		var move_comp : HouseSceneComponent = move_arr[0] as HouseSceneComponent;
		
		var move_info : furniture_place_info = new furniture_place_info();
		move_info.instance_id = move_comp.InstId;
		move_info.x = move_comp.X;
		move_info.z = move_comp.Z;
		move_info.height = move_comp.Height;
		move_info.floor = move_comp.FloorNo;
		move_info.face = move_comp.Face;
		
		packet.move_furnitures.Add(move_info);
	}
	for (var shop_kv : DictionaryEntry in shop_cart)	// 购买家具
	{
		var shop_arr : Array = shop_kv.Value as Array;
		var shop_comp : HouseSceneComponent = shop_arr[0] as HouseSceneComponent;
		
		var shop_info : furniture_goods_data = new furniture_goods_data();
		shop_info.goods_id = (shop_arr[1] as ShopCenterRow).goods_id;
		shop_info.x = shop_comp.X;
		shop_info.z = shop_comp.Z;
		shop_info.height = shop_comp.Height;
		shop_info.floor = shop_comp.FloorNo;
		shop_info.face = shop_comp.Face;
		
		packet.buy_goods_list.Add(shop_info);
	}
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 注册网络消息
private function RegistNetMsg() : void
{
	NetHelper.RegistHandler(new notify_start_edit_house(), handle_notify_start_edit_house);
	NetHelper.RegistHandler(new notify_end_edit_house(), handle_notify_end_edit_house);
	NetHelper.RegistHandler(new notify_change_furnitures(), handle_notify_change_furnitures);
	NetHelper.RegistHandler(new notify_change_furnitures_fail(), handle_notify_change_furnitures_fail);
}
//--------------------------------------------------
// 处理开始编辑房屋消息
public function handle_notify_start_edit_house(evt : GameEvent, pack : notify_start_edit_house) : void
{
	if (1 == pack.result)	// 请求成功
	{
		iGUICode_MainUI.getInstance().ClickCallback_decorate_btn_impl();
		GuestLogic.getInstance().clearGuestList();
		enterFitment();
	}
	else	// 请求失败
	{
		EQCamera.getInstance().FollowMe = true;
	}
}
//--------------------------------------------------
// 处理结束编辑房屋消息
public function handle_notify_end_edit_house(evt : GameEvent, pack : notify_end_edit_house) : void
{
	endFitment();
	iGUICode_StorageBoxUI.getInstance().exitFitment();
}
//--------------------------------------------------
// 处理改变家具消息
public function handle_notify_change_furnitures(evt : GameEvent, pack : notify_change_furnitures) : void
{
	// step1: 还原所有操作
	if (mReqChangeFitment)
	{
		recoverAllOperate();
	}
	// step2: 根据服务端发送过来的重新设置
	var house : PlayerHouse = EQGameSceneMgr.getSingleton().getHouse();
	for (var del_furniture_instance_id : UInt64 in pack.del_furnitures)			// 1.删除家具
	{
		house.delFurnitureByInstanceId(del_furniture_instance_id);
	}
	for (var add_furniture : house_furniture in pack.add_furnitures)			// 2.添加家具
	{
		house.addOneFurniture(add_furniture);
	}
	for (var move_furniture : house_furniture in pack.move_furnitures)			// 3.移动家具
	{
		var comp : HouseSceneComponent = house.getComponentByInstanceID(move_furniture.instance_id);
		var grid : HouseSceneGrid = house.getGrid(move_furniture.floor, move_furniture.x, move_furniture.z);
		comp.lay(grid, move_furniture.face, move_furniture.height);
	}
	// step3: 修改背包里的物品(只有在自己家时才可以)
	if (DataCenter.isInSelfHouse())
	{
		for (var add_item : pack_grid in pack.add_items)						// 4.增加物品
		{
			SelfItemLogic.getInstance().Package.addItemPack(add_item);
		}
		for (var del_item_instance_id : UInt64 in pack.del_items)				// 5.删除物品
		{
			SelfItemLogic.getInstance().Package.delItemPack(del_item_instance_id);
		}
	}
	// step4: 请求退出家族模式
	if (mReqChangeFitment)
	{
		ReqEndEditHouse();
	}
	mReqChangeFitment = false;
	// 处理其他逻辑
	Property.getInstance().setDecoration(pack.decoration);
	if (null != UI.getUI().GetUIRoot("UpgradeFurnitureUI"))
	{
		ItemUpgradeLogic.GetInstance().oneKeyUpgrageFurs();
	}
}
//--------------------------------------------------
// 处理改变家具失败消息
public function handle_notify_change_furnitures_fail(evt : GameEvent, pack : notify_change_furnitures_fail) : void
{
	iGUICode_StorageBoxUI.getInstance().setLockShopUI(false);
	if (0 == pack.error_code)
	{
		// 清除不存在的家具
		clearDeletedFurnitures(pack.unfind_bag_items);
		// 提示
		UI.getUI().OpenMsgbox("", Define.getContent(5097), true);
	}
	else	// 弹系统消息
	{
		Global.GetSysMsgHandler().notifySysMsg(pack.error_code, null);
	}
}
//--------------------------------------------------
// 注册事件消息
private function RegistEventMsg() : void
{
	var lp : ItemPack = SelfItemLogic.getInstance()._loverPackage;
	EventCenter.RegistHandler(GameEvent.MakeEventSource(GameEventDef.ITME_PACK_ADD_GRID, lp), HandleLoverPackageAddGrid);
	EventCenter.RegistHandler(GameEvent.MakeEventSource(GameEventDef.ITME_PACK_DEL_GRID_BEGIN, lp), HandleLoverPackageDelGridBegin);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_FURNI_TYPE_UNLOCK_LIST), HandleFurniTypeUnlockList);
}
//--------------------------------------------------
// 处理背包增加物品事件
private function HandleLoverPackageAddGrid(evt : GameEvent, obj : System.Object) : void
{
	if (!inFitmenting)
		return;
	
	var pg : PackGrid = obj as PackGrid;
	if (ItemType.Furniture != pg._item._itemInfo.type)
		return;
	
	fitmentPackGrids.Add(new FitmentPackGrid(pg));
	
	var ix : int = pageFitmentPack.getBeginIndex();
	pageFitmentPack.reset(fitmentPackGrids, SLOT_NUM, ix);
	
	updateFitmentSlots();
}
//--------------------------------------------------
// 处理背包删除物品事件
private function HandleLoverPackageDelGridBegin(evt : GameEvent, obj : System.Object) : void
{
	if (!inFitmenting)
		return;
	
	var pg : PackGrid = obj as PackGrid;
	if (ItemType.Furniture != pg._item._itemInfo.type)
		return;
	
	var dix : int = -1;
	for (var i:int=0; i<fitmentPackGrids.Count; ++i)
	{
		if (pg == (fitmentPackGrids[i] as FitmentPackGrid).packGrid)
		{
			dix = i;
			break;
		}
	}	
	if (-1 == dix)
		return;
	
	fitmentPackGrids.RemoveAt(dix);
	
	var ix : int = pageFitmentPack.getBeginIndex();
	if (ix >= fitmentPackGrids.Count)
	{
		ix = fitmentPackGrids.Count - 1;
	}
	if (ix < 0)
	{
		ix = 0;
	}
	pageFitmentPack.reset(fitmentPackGrids, SLOT_NUM, ix);

	updateFitmentSlots();
}
//--------------------------------------------------
// 处理家具类型解锁列表
private function HandleFurniTypeUnlockList(evt : GameEvent, obj : System.Object) : void
{
	updateFitmentSlots();
}
//--------------------------------------------------
// 获取当前选中的房屋部件信息
public function getComponentItem() : Item
{
	var it : Item = null;
	switch (mFitmentType)
	{
	case 0:			// 商城背包
		var pack_index : int = indexSelectPackGrid();
		if (-1 != pack_index)
		{
			var fpg : FitmentPackGrid = fitmentPackGrids[pack_index];
			it = fpg.packGrid._item;
		}
		break;
	case 2:			// 商城物品
		if (null != mCurSelectItem)
		{
			var item : ItemRow = ResManager.LgtMgr.getItemRow(mCurSelectItem.item_id);
			if (ItemType.Furniture == item.type)	// 家具
			{
				it = new Item();
				it._itemInfo = item;
			}
		}
		break;
	}
	return it;
}
//--------------------------------------------------
// 获取当前选中的背包物品
private function getPackGridFromPack() : FitmentPackGrid
{
	if (0 == mFitmentType)	// 商城背包
	{
		var pack_index : int = indexSelectPackGrid();
		if (-1 != pack_index)
			return fitmentPackGrids[pack_index] as FitmentPackGrid;
	}
	return null;
}
//--------------------------------------------------
// 获取选中的索引
private function getSelect() : int
{
	for (var i:int=0; i<SLOT_NUM; ++i)
	{
		if ((mFitmentSlots[i] as FitmentSlot).isSelected())
			return i;
	}
	return -1;
}
//--------------------------------------------------
// 清除选中
public function clearSelect() : void
{
	unselectShopItem();
	unselectPackGrid();
	for (var slot : FitmentSlot in mFitmentSlots)
	{
		slot.setSelect(false);
	}
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MOUSE_PICKED_FURNI), false);
}
//--------------------------------------------------
// 开关当前家装家具灯光,切换白天黑夜(不立即执行)
public function turnFurniture(daynight : boolean) : void
{
	var comp : HouseSceneComponent = FitmentEventMgr.getSingleton().getFitment();
	if (null == comp)
		return;
	
	// 同步主动光为家装里的白天黑夜状态
	comp.turn(!daynight);
}
//--------------------------------------------------
// 家具创建完,主要是为了设置实例id
public function createFitmentFinish(fitment : HouseSceneComponent) : void
{
	if (0 == mFitmentType)	// 背包里的物品
	{
		var fpg : FitmentPackGrid = getPackGridFromPack();
		if (null == fpg)
		{
			FitmentEventMgr.getSingleton().undo();
			return;
		}
		fitment.InstId = fpg.packGrid._item._instanceID;
	}
	// 同步主动光为家装里的白天黑夜状态
	var daynight : boolean = iGUICode_StorageBoxUI.getInstance().shop_day_night_btn.userData;
	fitment.turn(!daynight);
}
//--------------------------------------------------
// 家具摆下后的逻辑处理
public function putFitmentFinish(comp : HouseSceneComponent) : void
{
	var fitmentType : int = FitmentEventMgr.getSingleton().checkFitmentType();
	
	// 判断家具类型
	switch (fitmentType)
	{
	case 0:			// 商城家具,未摆放
	case 1:			// 商城家具,已摆放
		// 添加到购物车
		addToShopCart(comp, mCurSelectItem);
		break;
	case 2:			// 场景家具
		// 添加到移动车(1.移动的位置同原始位置,从移动车移除;2.回收车里拿出来,从回收车移除)
		addToMoveCart(comp);
		break;
	case 3:			// 背包家具
		// 添加到摆放车
		addToLayCart(comp);
		break;
	}
	
	// 清除物品选中状态
	clearSelect();
}
//--------------------------------------------------
// 请求各类操作
public function requestAllOperate() : void
{
	ReqChangeFurnitures(mTakeCart, mLayCart, mMoveCart, mShopCart);
}
//--------------------------------------------------
// 清除放在背包里的家具,此家具被摆放到场景中,但是被另外一个人从背包里删除
private function clearDeletedFurnitures(arr : ArrayList) : void
{
	for (var instance_id : UInt64 in arr)
	{
		var lay_arr : Array = mLayCart[instance_id] as Array;
		var lay_comp : HouseSceneComponent = lay_arr[0] as HouseSceneComponent;
		HSCManager.getSingleton().destroyHouseSceneComponent(lay_comp.Uid);
		mLayCart.Remove(instance_id);
	}
}
//--------------------------------------------------
// 回归各类操作
public function recoverAllOperate() : void
{
	// 清除购物车里,销毁模型,[uid, Array(HouseSceneComponent, ShopCenterRow)]
	for (var shop_kv : DictionaryEntry in mShopCart)
	{
		var uid : int = shop_kv.Key;
		var shop_comp : HouseSceneComponent = (shop_kv.Value as Array)[0] as HouseSceneComponent;
		calcDecoration(shop_comp, false);
		HSCManager.getSingleton().destroyHouseSceneComponent(uid);
	}
	// 清除摆放车,并把物品放回背包,销毁模型,[instance_id, Array(HouseSceneComponent, PackGrid)]
	for (var lay_kv : DictionaryEntry in mLayCart)
	{
		var lay_arr : Array = lay_kv.Value as Array;
		var lay_comp : HouseSceneComponent = lay_arr[0] as HouseSceneComponent;
		// 物品未被Ta删除,则放回背包
		if (SelfItemLogic.getInstance().existItemPack(lay_kv.Key))
		{
			SelfItemLogic.getInstance().addToPack(lay_arr[1] as PackGrid);
		}
		calcDecoration(lay_comp, false);
		HSCManager.getSingleton().destroyHouseSceneComponent(lay_comp.Uid);
	}
	// 清除回收车,还原物品的位置,从背包里删除物品,[instance_id, Array(house_furniture, oldGrid, oldFace, oldBottom)]
	for (var take_kv : DictionaryEntry in mTakeCart)
	{
		var take_arr : Array = take_kv.Value as Array;
		var hf : house_furniture = take_arr[0] as house_furniture;
		var take_comp : HouseSceneComponent = HSCManager.getSingleton().createHouseSceneComponent();
		take_comp.parseRes(HouseRes.ConvertFromHouseFurniture(hf));
		take_comp.load();
		take_comp.lay(take_arr[1] as HouseSceneGrid, take_arr[2], take_arr[3]);
		SelfItemLogic.getInstance().delFromPack(hf.instance_id);
		EQGameSceneMgr.getSingleton().getHouse().changeInstanceUid(hf.instance_id, take_comp.Uid);	// 重新关联实例id和uid
		calcDecoration(take_comp, true);
	}
	// 清除移动车,还原物品的位置,[instance_id, Array(HouseSceneComponent, oldGrid, oldFace, oldBottom)]
	for (var move_kv : DictionaryEntry in mMoveCart)
	{
		var move_arr : Array = move_kv.Value as Array;
		var move_comp : HouseSceneComponent = move_arr[0] as HouseSceneComponent;
		move_comp.lay(move_arr[1] as HouseSceneGrid, move_arr[2], move_arr[3]);
	}
	
	clearCarts();
}
//--------------------------------------------------
// 清空各类车
public function clearCarts() : void
{
	mShopCart.Clear();
	mMoveCart.Clear();
	mLayCart.Clear();
	mTakeCart.Clear();
	
	calcTotalCost(null, false);
}
//--------------------------------------------------
// 添加到购物车
public function addToShopCart(comp : HouseSceneComponent, scr : ShopCenterRow) : void
{
	if (mShopCart.ContainsKey(comp.Uid))
		return;

	var arr : Array = new Array();
	arr.Add(comp);		// [0]
	arr.Add(scr);		// [1]
	mShopCart.Add(comp.Uid, arr);
	
	// 计算总花费,并更新显示
	calcTotalCost(scr, true);
	// 计算装饰度
	calcDecoration(comp, true);
}
//--------------------------------------------------
// 从购物车删除
public function delFromShopCart(comp : HouseSceneComponent) : void
{
	if (mShopCart.ContainsKey(comp.Uid))
	{
		var scr : ShopCenterRow = (mShopCart[comp.Uid] as Array)[1] as ShopCenterRow;
		mShopCart.Remove(comp.Uid);
		
		// 计算总花费,并更新显示
		calcTotalCost(scr, false);
		// 计算装饰度
		calcDecoration(comp, false);
	}
}
//--------------------------------------------------
// 添加到摆放车
private function addToLayCart(comp : HouseSceneComponent) : void
{
	if (mLayCart.ContainsKey(comp.InstId))
		return;
	
	var fpg : FitmentPackGrid = getPackGridFromPack();
	if (null == fpg)	// 该物品被删除了
	{
		FitmentEventMgr.getSingleton().undo();
		return;
	}
	
	var arr : Array = new Array();
	arr.Add(comp);				// [0]
	arr.Add(fpg.packGrid);		// [1]
	mLayCart.Add(comp.InstId, arr);
	
	// 从背包里删除格子
	SelfItemLogic.getInstance().delFromPack(comp.InstId);
	//
	calcDecoration(comp, true);
}
//--------------------------------------------------
// 从摆放车删除
public function delFromLayCart(comp : HouseSceneComponent) : void
{
	if (mLayCart.ContainsKey(comp.InstId))
	{
		// 添加格子到背包
		var arr : Array = mLayCart[comp.InstId] as Array;
		var pack : PackGrid = arr[1] as PackGrid;
		SelfItemLogic.getInstance().addToPack(pack);
		mLayCart.Remove(comp.InstId);
		//
		calcDecoration(comp, false);
	}
}
//--------------------------------------------------
// 添加到回收车
public function addToTakeCart(comp : HouseSceneComponent) : void
{
	if (mTakeCart.ContainsKey(comp.InstId))
		return;
	
	// 添加格子到背包
	SelfItemLogic.getInstance().addToPack(comp.InstId, comp.ItemId, comp.Property);
	// 获取家具的摆放位置
	var oldGrid : HouseSceneGrid = FitmentEventMgr.getSingleton().mEvent.OldGrid;
	var oldFace : int = FitmentEventMgr.getSingleton().mEvent.OldFace;
	var oldBottom : float = FitmentEventMgr.getSingleton().mEvent.OldBottom;
	if (null == oldGrid)
	{
		oldGrid = comp.getAttachGrid();
		oldFace = comp.Face;
		oldBottom = comp.getBottom();
	}
	// 保存回收
	var fur : house_furniture = checkGoodsOrFurniture(comp.InstId);
	var arr : Array = new Array();
	arr.Add(fur);		// [0]
	arr.Add(oldGrid);	// [1]
	arr.Add(oldFace);	// [2]
	arr.Add(oldBottom);	// [3]
	mTakeCart.Add(comp.InstId, arr);
	// 判断回收前是否移动过
	var take_arr : Array = mTakeCart[comp.InstId] as Array;
	var move_arr : Array = mMoveCart[comp.InstId] as Array;
	if (move_arr)
	{
		take_arr[1] = move_arr[1];
		take_arr[2] = move_arr[2];
		take_arr[3] = move_arr[3];
		delFromMoveCart(comp);	// 从移动车删除
	}
	//
	calcDecoration(comp, false);
}
//--------------------------------------------------
// 从回收车删除
private function delFromTakeCart(comp : HouseSceneComponent) : void
{
	if (mTakeCart.ContainsKey(comp.InstId))
	{
		// 从背包里删除格子
		SelfItemLogic.getInstance().delFromPack(comp.InstId);
		// 重新关联实例id和uid
		EQGameSceneMgr.getSingleton().getHouse().changeInstanceUid(comp.InstId, comp.Uid);
		mTakeCart.Remove(comp.InstId);
		calcDecoration(comp, true);
	}
}
//--------------------------------------------------
// 添加到移动车
private function addToMoveCart(comp : HouseSceneComponent) : void
{
	if (mMoveCart.ContainsKey(comp.InstId))
	{
		var temp : Array = mMoveCart[comp.InstId] as Array;
		// 部件的当前位置,朝向,高度和之前的一样,则从移动车移除该部件
		if (temp[1] == comp.getAttachGrid() &&
			temp[2] == comp.Face &&
			temp[3] == comp.getBottom())
		{
			mMoveCart.Remove(comp.InstId);
		}
		return;
	}
	// 获取家具的摆放位置
	var oldGrid : HouseSceneGrid = FitmentEventMgr.getSingleton().mEvent.OldGrid;
	var oldFace : int = FitmentEventMgr.getSingleton().mEvent.OldFace;
	var oldBottom : float = FitmentEventMgr.getSingleton().mEvent.OldBottom;
	// 判断家具是否有移动
	if (oldGrid == comp.getAttachGrid() &&
		oldFace == comp.Face &&
		oldBottom == comp.getBottom())
	{
		return;
	}
	// 保存移动
	var arr : Array = new Array();
	arr.Add(comp);		// [0]
	arr.Add(oldGrid);	// [1]
	arr.Add(oldFace);	// [2]
	arr.Add(oldBottom);	// [3]
	mMoveCart.Add(comp.InstId, arr);
	// 判断移动前是否回收过
	var move_arr : Array = mMoveCart[comp.InstId] as Array;
	var take_arr : Array = mTakeCart[comp.InstId] as Array;
	if (take_arr)
	{
		move_arr[1] = take_arr[1];
		move_arr[2] = take_arr[2];
		move_arr[3] = take_arr[3];
		delFromTakeCart(comp);	// 从回收车删除
	}	
}
//--------------------------------------------------
// 从移动车删除
private function delFromMoveCart(comp : HouseSceneComponent) : void
{
	if (mMoveCart.ContainsKey(comp.InstId))
	{
		mMoveCart.Remove(comp.InstId);
	}
}
//--------------------------------------------------
// 处理旋转家具时,鼠标点击保存购买/退出按钮
public function handleCurPickComp() : void
{
	FitmentEventMgr.getSingleton().undo();	// 取消对还未摆放的家具操作
	clearSelect();	// 清除物品选中状态
}
//--------------------------------------------------
// 判断是否是物品或者是家具
public function checkGoodsOrFurniture(instance_id : UInt64) : house_furniture
{
	return EQGameSceneMgr.getSingleton().getHouse().getFurnitureByInstanceID(instance_id);
}
//--------------------------------------------------
// 判断是否有购买操作
public function checkBuyOperate() : boolean
{
	return mShopCart.Count > 0;
}
//--------------------------------------------------
// 判断是否有变更摆放操作
public function checkChangeLayOperate() : boolean
{
	if (0==mMoveCart.Count && 0==mLayCart.Count && 0==mTakeCart.Count)
		return false;
	
	return true;
}
//--------------------------------------------------
// 计算总水晶和恋爱币花费
private function calcTotalCost(row : ShopCenterRow, add_flag : boolean) : void
{
	if (null == row)
	{
		mTotalDiamondCost = 0;
		mTotalMoneyCost = 0;
	}
	else if (1 == row.money_type)		// 水晶
	{
		if (add_flag)
			mTotalDiamondCost += row.price;
		else
			mTotalDiamondCost -= row.price;
	}
	else if (2 == row.money_type)		// 恋爱币
	{
		if (add_flag)
			mTotalMoneyCost += row.price;
		else
			mTotalMoneyCost -= row.price;
	}
	iGUICode_StorageBoxUI.getInstance().updateTotalText(mTotalDiamondCost, mTotalMoneyCost);
}
//--------------------------------------------------
// 获取总水晶消费
public function getTotalDiamondCost() : int
{
	return mTotalDiamondCost;
}
//--------------------------------------------------
// 判断水晶是否足够
public function checkDiamondEnough() : boolean
{
	return mTotalDiamondCost <= SelfItemLogic.getInstance()._loverDiamond;
}
//--------------------------------------------------
// 获取总恋爱币消费
public function getTotalMoneyCost() : int
{
	return mTotalMoneyCost;
}
//--------------------------------------------------
// 判断恋爱币是否足够
public function checkMoneyEnough() : boolean
{
	return mTotalMoneyCost <= DataCenter.GetPlayerDiamond();
}
//--------------------------------------------------
// 判断鼠标是否在slot上面
public function isMouseOverSlot() : boolean
{
	for (var slot : FitmentSlot in mFitmentSlots)
	{
		if (slot.isMouseOver())
			return true;
	}
	return false;
}
//--------------------------------------------------
// 获取家装下摆上去的花盆
public function getFitmentFlowerpot() : Array
{
	var flowerpots : Array = new Array();
	for (var comp : HouseSceneComponent in EQSceneManager.getSingleton().HouseSceneObj.HouseComps)
	{
		if (comp.CompRow && 2 == comp.CompRow.type)
		{
			flowerpots.Add(comp);
		}
	}
	return flowerpots;
}
//--------------------------------------------------
// 花盆数量是否超过
public function isFlowerpotOverTop() : boolean
{
	var flowerpots : Array = getFitmentFlowerpot();
	return flowerpots.Count > PlantLogic.GetInstance().GetLimitCount();
}
//--------------------------------------------------
// 处理楼上楼下镜头的位置
public function setCameraPos() : void
{
	var scene : HouseScene = UpDownStair.getHouseScene();
	if (null == scene)
		return;
	
	var floor_count : int = UpDownStair.getFloorNums();
	if (floor_count < 2)
		return;
	
	var offset : Vector3 = Vector3.zero;
	if (inFitmenting)	// 家装模式
	{
		offset = Vector3(0.0f, scene.WalkViewFloor.FloorHeight, 0.0f);
	}
	EQCamera.getInstance().setPosOffset(offset);
}
//--------------------------------------------------
// 计算装饰度
private function calcDecoration(comp : HouseSceneComponent, add_flag : boolean) : void
{
	var decoration : int = Property.getInstance().getProperty(comp);
	if (add_flag)
	{
		++mCurFurniNum;
		mCurDecoration += decoration;
	}
	else
	{
		--mCurFurniNum;
		mCurDecoration -= decoration;
	}
	iGUICode_StorageBoxUI.getInstance().updateDecoration(mCurFurniNum, mCurDecoration);
}
//--------------------------------------------------


