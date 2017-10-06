/*--------------------------------------------------
*** 房屋部件管理器
--------------------------------------------------*/
#pragma strict
#pragma downcast



class HSCManager
{
	private var HouseSceneComponentMap : Hashtable = new Hashtable();	// 房屋部件映射表
	private var Num : int = 1;	// 每个部件唯一的标识(从1开始吧,因为默认的uid为0)
	private static var singleton : HSCManager;
	//--------------------------------------------------
	public static function getSingleton() : HSCManager
	{
		if (null == singleton)
		{
			singleton = new HSCManager();
		}
		return singleton;
	}
	//--------------------------------------------------
	// 创建房屋部件
	public function createHouseSceneComponent() : HouseSceneComponent
	{
		var comp : HouseSceneComponent = new HouseSceneComponent(Num++);
		HouseSceneComponentMap.Add(comp.Uid, comp);
		
		return comp;
	}
	//--------------------------------------------------
	// 销毁房屋部件,根据标识
	public function destroyHouseSceneComponent(uid : int)
	{
		if (false == HouseSceneComponentMap.ContainsKey(uid))
			return;
		
		var comp : HouseSceneComponent = HouseSceneComponentMap[uid] as HouseSceneComponent;
		comp.Destroy();
		HouseSceneComponentMap.Remove(uid);
	}
	//--------------------------------------------------
	// 销毁房屋部件,根据部件
	public function destroyHouseSceneComponent(hsc : HouseSceneComponent)
	{
		if (null == hsc)
			return;
		
		destroyHouseSceneComponent(hsc.Uid);
	}
	//--------------------------------------------------
	// 销毁房屋部件,根据位置
	public function destroyHouseSceneComponent(floor : int, x : int, z : int, height : float)
	{
		var uid : int = 0;
		for (var kv : DictionaryEntry in HouseSceneComponentMap)
		{
			var comp : HouseSceneComponent = kv.Value as HouseSceneComponent;
			if (floor==comp.FloorNo &&  x==comp.X && z==comp.Z && height==comp.Height)
			{
				uid = kv.Key;
				break;
			}
		}
		destroyHouseSceneComponent(uid);
	}
	//--------------------------------------------------
	// 获取房屋部件,根据标识
	public function getHouseSceneComponent(uid : int) : HouseSceneComponent
	{
		if (false == HouseSceneComponentMap.ContainsKey(uid))
			return null;
			
		return HouseSceneComponentMap[uid] as HouseSceneComponent;
	}
	//--------------------------------------------------
	// 获取房屋部件,根据模型
	public function getHouseSceneComponent(gobj : GameObject) : HouseSceneComponent
	{
		for (var kv : DictionaryEntry in HouseSceneComponentMap)
		{
			var comp : HouseSceneComponent = kv.Value as HouseSceneComponent;
			if (false == comp.IsFrame)	// 普通部件
			{
				// 这里做这么长的判断是因为普通部件模型不是根节点,而是挂接在默认的部件下面
				if (CommFunc.existChildGameObj(comp.GameObj, gobj))
					return comp;
			}
		}
		return null;
	}
	//--------------------------------------------------
	// 获取房屋部件,根据位置
	public function getHouseSceneComponent(floor : int, x : int, z : int, height : float) : HouseSceneComponent
	{
		for (var kv : DictionaryEntry in HouseSceneComponentMap)
		{
			var comp : HouseSceneComponent = kv.Value as HouseSceneComponent;
			if (floor==comp.FloorNo &&  x==comp.X && z==comp.Z && height==comp.Height)
			{
				return comp;
			}
		}
		return null;
	}
	//--------------------------------------------------
}


