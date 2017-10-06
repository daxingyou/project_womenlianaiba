#pragma strict
#pragma downcast
/*--------------------------------------------------
*** 玩家房屋
--------------------------------------------------*/
class PlayerHouse extends EQGameScene
{
	private var mHouseScene : HouseScene = null;			// 房屋场景
	private var mHouseInfo : house_info = null;				// 房屋数据
	private var mFurnitures : Hashtable = new Hashtable();	// 家具表(已摆放的)[instance_id, house_furniture]
	private var mInstanceUid : Hashtable = new Hashtable();	// 映射表[instance_id, Uid]
	//--------------------------------------------------
	// 构造函数
	public function PlayerHouse(hs : HouseScene)
	{
		mHouseScene = hs;
	}
	//--------------------------------------------------
	// 销毁
	public function Destroy() : void
	{
		clearFurnitures();
		super.Destroy();
	}
	//--------------------------------------------------
	// 获取房屋数据
	public function getHouseInfo() : house_info
	{
		return mHouseInfo;
	}
	//--------------------------------------------------
	// 获取家具表
	public function getFurnitures() : Hashtable
	{
		return mFurnitures;
	}
	//--------------------------------------------------
	// 获取家具标识表
	public function getFurnitureUids() : Hashtable
	{
		return mInstanceUid;
	}
	//--------------------------------------------------
	// 改变映射表
	public function changeInstanceUid(instance_id : UInt64, uid : int) : void
	{
		if (mInstanceUid.ContainsKey(instance_id))
		{
			mInstanceUid[instance_id] = uid;
		}
	}
	//--------------------------------------------------
	// 根据坐标信息获取家具
	public function getFurnitureByPos(floor : int, x : int, z : int, bottom : float) : house_furniture
	{
		for (var kv : DictionaryEntry in mFurnitures)
		{
			var fur : house_furniture = kv.Value;
			if (floor == fur.floor && x == fur.x && z == fur.z && bottom == fur.height)
				return fur;
		}
		return null;
	}
	public function getComponentByPos(floor : int, x : int, z : int, bottom : float) : HouseSceneComponent
	{
		var fur : house_furniture = getFurnitureByPos(floor, x, z, bottom);
		if (null == fur)
			return null;
		
		return HSCManager.getSingleton().getHouseSceneComponent(floor, x, z, bottom);
	}
	//--------------------------------------------------
	// 获取某一楼层的家具
	public function getComponentsByFloor(floor : int) : Array
	{
		var arr : Array = new Array();
		for (var fur : house_furniture in mFurnitures.Values)
		{
			if (floor == fur.floor)
			{
				arr.Add(HSCManager.getSingleton().getHouseSceneComponent(floor, fur.x, fur.z, fur.height));
			}
		}
		return arr;
	}
	//--------------------------------------------------
	// 根据实例id获取家具
	public function getFurnitureByInstanceID(instance_id : UInt64) : house_furniture
	{
		if (mFurnitures.ContainsKey(instance_id))
		{
			return mFurnitures[instance_id];
		}
		return null;
	}
	public function getComponentByInstanceID(instance_id : UInt64) : HouseSceneComponent
	{
		var fur : house_furniture = getFurnitureByInstanceID(instance_id);
		if (null == fur)
			return null;
		
		var uid : int = mInstanceUid[instance_id];
		return HSCManager.getSingleton().getHouseSceneComponent(uid);
	}
	//--------------------------------------------------
	// 清除家具
	private function clearFurnitures() : void
	{
		for (var kv : DictionaryEntry in mInstanceUid)
		{
			var uid:int = kv.Value;
			HSCManager.getSingleton().destroyHouseSceneComponent(uid);
		}
		mInstanceUid.Clear();
		mFurnitures.Clear();
	}
	//--------------------------------------------------
	// 删除单个家具,根据实例id
	public function delFurnitureByInstanceId(instance_id : UInt64) : void
	{
		if (mInstanceUid.ContainsKey(instance_id))
		{
			var uid:int = mInstanceUid[instance_id];
			HSCManager.getSingleton().destroyHouseSceneComponent(uid);
			mInstanceUid.Remove(instance_id);
			mFurnitures.Remove(instance_id);
		}
	}
	//--------------------------------------------------
	// 创建房屋数据
	public function createHousedata(data : house_info) : void
	{
		clearFurnitures();
		mHouseInfo = data;
		addFurnitures(data.furniture_vec);
		
		//house event boardcast
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOUSE_CREATED),data);
	}
	//--------------------------------------------------
	// 添加家具
	private function addFurnitures(furs : ArrayList) : void
	{
		for (var fur : house_furniture in furs)
		{
			addOneFurniture(fur);
		}
	}
	//--------------------------------------------------
	// 添加单个家具
	public function addOneFurniture(fur : house_furniture) : void
	{
		if (mFurnitures.ContainsKey(fur.instance_id))
			return;
		
		var comp : HouseSceneComponent = HSCManager.getSingleton().createHouseSceneComponent();
		comp.parseRes(HouseRes.ConvertFromHouseFurniture(fur));
		comp.load();
		
		var hsf : HouseSceneFloor = mHouseScene.GetFloor(fur.floor);
		if (hsf)
		{
			var grid : HouseSceneGrid = hsf.GetGrid(fur.x, fur.z);
			if (grid)
			{
				comp.lay(grid, fur.face, fur.height);
			}
		}
		
		mFurnitures.Add(fur.instance_id, fur);
		mInstanceUid.Add(fur.instance_id, comp.Uid);
		// 开关灯
		var on : boolean = (0 != fur.status);
		comp.turn(on);
	}
	//--------------------------------------------------
	// 开关所有灯光(家装模式需要)
	public function turnAllLightsForFitment(daynight : boolean) : void
	{
		mHouseScene.turnPassLights(daynight);
		mHouseScene.turnDirectLights(daynight);
		mHouseScene.turnSpotLights(daynight);
		mHouseScene.turnLights(!daynight);
	}
	//--------------------------------------------------
	// 开关所有灯光
	public function turnAllLights(daynight : boolean, by_status : boolean) : void
	{
		mHouseScene.turnPassLights(daynight);
		mHouseScene.turnDirectLights(daynight);
		mHouseScene.turnSpotLights(daynight);
		for (var kv:DictionaryEntry in mInstanceUid)
		{
			var uid:int = kv.Value;
			var comp : HouseSceneComponent = HSCManager.getSingleton().getHouseSceneComponent(uid);
			if (null == comp)
				continue;
			
			var fur : house_furniture = mFurnitures[kv.Key];
			if (by_status)	// 根据状态
			{
				comp.turn(0 != fur.status);
			}
			else			// 根据昼夜
			{
				comp.turn(!daynight);
				fur.status = !daynight ? 1 : 0;	// 保存状态
			}
		}
	}
	//--------------------------------------------------
	// 获取格子
	public function getGrid(floor : int, x : int, z : int) : HouseSceneGrid
	{
		var hsf : HouseSceneFloor = mHouseScene.GetFloor(floor);
		if (hsf)
			return hsf.GetGrid(x, z);
		
		return null;
	}
	//--------------------------------------------------
	// 房间是否被2人所有
	public function hasTwoOwner() : boolean
	{
	    return mHouseInfo.boy != "" && mHouseInfo.girl != "";
	}
	//--------------------------------------------------
	// 获取可升级的家具
	public function getUpgradeFurnitures() : Array
	{
		var upgradeFurs : Array = new Array();
		for (var fur : house_furniture in mFurnitures.Values)
		{
			var ir : ItemRow = ResManager.LgtMgr.getItemRow(fur.item_tempid);
			var iur : ItemUpgradeRow = ResManager.LgtMgr.getItemUpgradeRow(ir.upgrade_id);
			if (null == iur)
				continue;
			
			ir = ResManager.LgtMgr.getItemRow(iur.productId);
			if (ir.use_level > DataCenter.getMainPlayerCurLv())	// 升级后的使用等级超过玩家的等级
				continue;
			
			upgradeFurs.Add(fur);
		}
		return upgradeFurs;
	}
	//--------------------------------------------------
}

