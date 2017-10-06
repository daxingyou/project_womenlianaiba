/* create by Y3
 * 对item数据的操作, 我们可能可以提供对应的回调来处理
 * 对于物品和界面的表现, 是一个典型的mvc设计结构, 可以考虑如何实现
 * 可能对数据的操作会使用到接口
 */
#pragma strict



/*--------------------------------------------------
*** 物品(背包里使用)
--------------------------------------------------*/
class Item
{
	var _itemInfo : ItemRow;				// 物品信息,item_tplt.xml
	var _instanceID : UInt64;				// 物品实例id
	var _delTime : stime;					// 到期时间
	var _property : ArrayList;				// 属性列表
	//--------------------------------------------------
	// 构造函数
	public function Item(ie : item)
	{
		_itemInfo = ResManager.LgtMgr.getItemRow(ie.template_id);
		_instanceID = ie.instance_id;
		_delTime = ie.del_time;
		_property = ie.property;
	}
	//--------------------------------------------------
	// 构造函数
	public function Item()
	{
		//this is a null item
		_itemInfo = null;
		_instanceID = 0;
		_delTime = new stime();
		_property = new ArrayList();
	}
	//--------------------------------------------------
	// 判断物品是否为空
	public function isNull() : boolean
	{
		return (0 == _instanceID);
	}
	//--------------------------------------------------
	// 获取服务端发送过来的数据类型
	public function change() : item
	{
		var ie : item = new item();
		ie.instance_id = _instanceID;
		if (_itemInfo)
			ie.template_id = _itemInfo.id;
		if (_delTime)
			ie.del_time = _delTime;
		if (_property)
			ie.property = _property;
		
		return ie;
	}
	//--------------------------------------------------
}



/*--------------------------------------------------
*** 背包里的格子(背包里使用)
--------------------------------------------------*/
class PackGrid
{
	var _item:Item;		// 物品
	var _count:int;		// 数量
	var _lock:int;		// 是否被锁定	,no use now
	//--------------------------------------------------
	// 构造函数
	function PackGrid(pg:pack_grid)
	{
		_item = new Item(pg.item_data);
		_count = pg.count;
		_lock = pg.Lock;
	}
	//--------------------------------------------------
	// 是否有物品
	function hasItem() : boolean
	{
		return (_count != 0);
	}
	//--------------------------------------------------
}



/*--------------------------------------------------
*** 物品格子包(背包里使用)
--------------------------------------------------*/
class ItemPack
{
	private var _packGrids : Array = new Array();		// PackGrid list
	//--------------------------------------------------
	// 总数
	public function count() : int
	{
		return _packGrids.Count;
	}
	//--------------------------------------------------
	// 根据索引获取格子
	public function getPackGrid(index : int) : PackGrid
	{
		return _packGrids[index] as PackGrid;
	}
	//--------------------------------------------------
	// 根据实例id获取格子
	public function getPackGridByInstID(instId : UInt64) : PackGrid
	{
		for (var pg_obj : System.Object in _packGrids)
		{
			var pg : PackGrid = pg_obj as PackGrid;
			if (instId == pg._item._instanceID)
				return pg;
		}
		return null;
	}
	//--------------------------------------------------
	// 添加格子
	public function addPackGrid(pack : PackGrid) : void
	{
		var pg : PackGrid = getPackGridByInstID(pack._item._instanceID);
		if (null != pg)
			return;		// 这里不抛异常,直接返回
		// 
		_packGrids.Add(pack);
		// 
		EventCenter.PostEvent(this, GameEventDef.ITME_PACK_ADD_GRID, pack);
	}
	//--------------------------------------------------
	// 删除格子
	public function delPackGrid(instId : UInt64) : void
	{
		var pg : PackGrid = getPackGridByInstID(instId);
		if (null == pg)
			return;		// 这里不抛异常,直接返回
		// 
		EventCenter.PostEvent(this, GameEventDef.ITME_PACK_DEL_GRID_BEGIN, pg);
		// 
		_packGrids.Remove(pg);
		// 
		EventCenter.PostEvent(this, GameEventDef.ITME_PACK_DEL_GRID_END, instId);
	}
	//--------------------------------------------------
	// 更新格子
	public function updatePackGrid(instId : UInt64, count : int) : void
	{
		var pg : PackGrid = getPackGridByInstID(instId);
		if (null == pg)
			return;		// 这里不抛异常,直接返回
		// 
		pg._count = count;
		// 
		EventCenter.PostEvent(this, GameEventDef.ITEM_PACK_UPDATE_GRID, pg);
	}
	//--------------------------------------------------
	// 初始
	public function init(gridVec : ArrayList) : void
	{
		for (var grid_obj : System.Object in gridVec)
		{
			var grid : pack_grid = grid_obj as pack_grid;
			_packGrids.Add(new PackGrid(grid));
		}
		//
		EventCenter.PostEvent(this, GameEventDef.ITEM_PACK_INIT, null);
	}
	//--------------------------------------------------
}




class ItemPackage
{
	private var mPackGrids : Array = new Array();
	public var Ctrl : Controller = new Controller();
	//--------------------------------------------------
	// 初始函数
	public function init(arr : ArrayList) : void
	{
		for (var grid_obj : System.Object in arr)
		{
			var grid : pack_grid = grid_obj as pack_grid;
			mPackGrids.Add(new PackGrid(grid));
		}
		Ctrl.Excute("INIT_ITEM_PACK", arr);
	}
	//--------------------------------------------------
	// 添加物品
	public function addItemPack(grid : pack_grid) : void
	{
		var instance_id : UInt64 = grid.item_data.instance_id;
		if (null != getItemPack(instance_id))
		{
			Debug.LogError("Error: ItemPackage -> addItemPack(pack_grid) -> exist instance id [" + instance_id + "]!");
			return;
		}
		mPackGrids.Add(new PackGrid(grid));
		Ctrl.Excute("ADD_ITEM_PACK", grid);
	}
	//--------------------------------------------------
	// 更新物品
	public function updateItemPack(pic : pair_item_count) : void
	{
		var instance_id : UInt64 = pic.item_inst_id;
		var pg : PackGrid = getItemPack(instance_id);
		if (null == pg)
		{
			Debug.LogError("Error: ItemPackage -> updateItemPack(pair_item_count) -> can't find instance id [" + instance_id + "]!");
			return;
		}
		pg._count = pic.count;
		Ctrl.Excute("UPDATE_ITEM_PACK", pic);
	}
	//--------------------------------------------------
	// 删除物品
	public function delItemPack(instance_id : UInt64) : void
	{
		var pg : PackGrid = getItemPack(instance_id);
		if (null == pg)
		{
			Debug.LogError("Error: ItemPackage -> delItemPack(UInt64) -> can't find instance id [" + instance_id + "]!");
			return;
		}
		mPackGrids.Remove(pg);
		Ctrl.Excute("DEL_ITEM_PACK", instance_id);
	}
	//--------------------------------------------------
	// 获取物品
	public function getItemPack(instance_id : UInt64) : PackGrid
	{
		for (var pg_obj : System.Object in mPackGrids)
		{
			var pg : PackGrid = pg_obj as PackGrid;
			if (instance_id == pg._item._instanceID)
				return pg;
		}
		return null;
	}
	//--------------------------------------------------
	// 是否存在对应模板id的物品,存在返回所有物品
	public function getItemPack(template_id : int) : Array
	{
		var arr : Array = new Array();
		for (var pg_obj : System.Object in mPackGrids)
		{
			var pg : PackGrid = pg_obj as PackGrid;
			if (template_id == pg._item._itemInfo.id)
				arr.Add(pg);
		}
		return arr;
	}
	//--------------------------------------------------
}


