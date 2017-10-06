/*--------------------------------------------------
房屋场景(2012/5/25 modify by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast



class HouseScene extends SceneObject
{
	var Floors : Hashtable = new Hashtable();							// 房屋楼层
	var HouseComps : Array = new Array();								// 房屋部件
	var PassLights : Array = new Array();								// 穿透光
	var DirectLights : Array = new Array();								// 方向光
	var SpotLights : Array = new Array();								// 聚光
	var WatchMode : HouseWatchMode = HouseWatchMode.HW_MODE_1;			// 观察模式
	var GridMode : GridDisplayMode = GridDisplayMode.GD_MODE_HIDE;		// 格子显示模式
	var RootHouseFloor : HouseSceneFloor = null;						// 房屋楼层最底层. 是否可以为空, 待定
	var WalkViewFloor : HouseSceneFloor = null;							// 当前在那一层显示, 其实可以考虑让这个值一直有效. 可以是庄园层
	var FitmentCtrl : HSCFitmentCtrl = null;							// 家装控制
	// 
	private var mPassLightObj : GameObject = null;						// 穿透光挂接点
	private var mDirectLightObj : GameObject = null;					// 方向光挂接点
	private var mSpotLightObj : GameObject = null;						// 聚光挂接点
	//--------------------------------------------------
	// 构造函数
	function HouseScene()
	{
	}
	//--------------------------------------------------
	// 创建HouseScene节点
	function CreateHouseSceneNode()
	{
		Template = "HouseScene";
		GameObj = new GameObject();	// 房屋场景根节点,下面挂接楼层节点和模型节点(2011/12/16 modify by hezhr)
		GameObj.name = Template;
	}
	//--------------------------------------------------
	// 由新节点创建空场景
	function CreateNullScene(obj:GameObject)
	{
		Template = obj.name;
		GameObj = obj;
		
		//兼容可能有的异步事件
		AsynCtrl.setMainLoaded(true);
		
		//创建一个楼层
		var hFloor : HouseSceneFloor = new HouseSceneFloor(this);
		hFloor.FloorNO = 1;			//1楼
		hFloor.FloorHeight = 0;		//0高度
		Floors.Add(hFloor.FloorNO, hFloor);
		hFloor.GameObj = new GameObject();
		hFloor.GameObj.name = "Floor1";
		hFloor.SetParent(this);
		
		//创建一个格子. 0,0位置. 类型为1, 房间为0
		hFloor.CreateGrid(0, 0, 1, 0, "");
		
		//
		FitmentCtrl = new HSCFitmentCtrl();
		RootHouseFloor = Floors[1];
		WalkViewFloor = RootHouseFloor;
	}
	//--------------------------------------------------
	// 更新
	public function Update() : void
	{
		// 更新墙体遮挡
		if (WalkViewFloor && (WatchMode == HouseWatchMode.HW_MODE_2))
		{
			WalkViewFloor.calcWatchMode(WatchMode);
		}
		
		//更新家具剔除
		for (var floor : HouseSceneFloor in Floors.Values)
		{
			floor.updateCull();
		}
	}
	//--------------------------------------------------
	// 获取楼层
	public function GetFloor(floor_num : int) : HouseSceneFloor
	{
		if (false == Floors.ContainsKey(floor_num))
			return null;
		
		return Floors[floor_num];
	}
	//--------------------------------------------------
	// 清除房屋部件
	private function clearComps() : void
	{
		// 这里进一步的保存uid是有原因的,由于部件在销毁时,会先从house comps里脱离,会造成索引方面的bug
		var uid_arr : Array  = new Array();
		for (var comp : HouseSceneComponent in HouseComps)
		{
			uid_arr.Add(comp.Uid);
		}
		HouseComps.Clear();
		for (var uid : int in uid_arr)
		{
			HSCManager.getSingleton().destroyHouseSceneComponent(uid);
		}
		uid_arr.Clear();
	}
	//--------------------------------------------------
	// 清除楼层
	private function clearFloors() : void
	{
		for (var floor : HouseSceneFloor in Floors.Values)
		{
			floor.Destroy();
		}
		Floors.Clear();
	}
	//--------------------------------------------------
	// 清除穿透光
	private function clearPassLights() : void
	{
		PassLights.Clear();
		GameObject.Destroy(mPassLightObj);
	}
	//--------------------------------------------------
	// 清除方向光
	private function clearDirectLights() : void
	{
		DirectLights.Clear();
		GameObject.Destroy(mDirectLightObj);
	}
	//--------------------------------------------------
	// 清除聚光
	private function clearSpotLights() : void
	{
		SpotLights.Clear();
		GameObject.Destroy(mSpotLightObj);
	}
	//--------------------------------------------------
	// 销毁房屋
	public function Destroy() : void
	{
		FitmentCtrl.destroy();
		clearPassLights();
		clearDirectLights();
		clearSpotLights();
		clearComps();
		clearFloors();
		UpDownStair.getInstance().clearTransmitParticle();
		super.Destroy();
	}
	//--------------------------------------------------
	// 初始入口,houseOjbName:房屋模型名"000001.mod.u3d",houseFileName:房屋的结构信息文件"000001.xml.u3d"
	public function LoadFromString(houseObjName : String, houseFileName : String) : void
	{
		// start global block
		GlobalBlock.startBlock(true);
		AsynCtrl.addOrProcessEvent(new HouseSceneLoadEvent(houseObjName, houseFileName));
	}
	public function _loadFromString(xmlStr : String) : void
	{
		buildWithXml(xmlStr);
		
		// end global block
		GlobalBlock.endBlock();
		
		// 广播房屋异步加载完成. 一定只是房屋场景才有这条信息
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOUSE_LOAD_OK));
	}
	//--------------------------------------------------
	// 创建
	public function buildWithXml(xmlStr : String) : void
	{
		var houseRes : HouseRes = new HouseRes();
		houseRes.LoadFromString(xmlStr);
		
		buildFloors(houseRes);
		buildPassLights(houseRes);
		buildDirectLights(houseRes);
		buildSpotLights(houseRes);
		
		RootHouseFloor = Floors[houseRes.FloorRootNO];
		WalkViewFloor = RootHouseFloor;
		
		FitmentCtrl = new HSCFitmentCtrl();
	}
	//--------------------------------------------------
	// 变更观察模式
	public function ChangeWatchMode(mode : HouseWatchMode) : void
	{
		if (mode == WatchMode)
			return;
		
		var walk : boolean = false;
		if ((WatchMode == HouseWatchMode.HW_MODE_4) || (mode == HouseWatchMode.HW_MODE_4))
		{
			walk = true;
		}
		WatchMode = mode;
		
		if (WalkViewFloor && RootHouseFloor)
		{
			var floor : HouseSceneFloor = RootHouseFloor;
			
			while (walk && floor != WalkViewFloor)
			{
				if (WatchMode == HouseWatchMode.HW_MODE_4)
					floor.calcWatchMode(HouseWatchMode.HW_MODE_4);
				else
					floor.calcWatchMode(HouseWatchMode.HW_MODE_3);
				
				floor = floor.UpFloor;
			}
			
			WalkViewFloor.calcWatchMode(WatchMode);
		}
	}
	//--------------------------------------------------
	// 获取对应楼层的观察模式
	public function GetWatchModeByFloorNO(flrNO : int) : HouseWatchMode
	{
		var flr : HouseSceneFloor = GetFloor(flrNO);
		if (null == flr)
			throw new Exception("ERROR HouseScene -> GetWatchModeByFloorNO(int) -> Floor[" + flrNO + "] not found!");
		
		if (flrNO == WalkViewFloor.FloorNO)
			return WatchMode;
		
		// 要获取的楼层在当前观察楼层上面,否则在下面
		if (flrNO > WalkViewFloor.FloorNO)
			return HouseWatchMode.HW_MODE_HIDE;
		
		if (WatchMode == HouseWatchMode.HW_MODE_4)
			return HouseWatchMode.HW_MODE_4;
		
		return HouseWatchMode.HW_MODE_3;
	}
	//--------------------------------------------------
	// 看最底层
	public function RootView() : boolean
	{
		var flr : HouseSceneFloor = RootHouseFloor;
		
		if (null == flr)
			return false;
		
		var upflr : HouseSceneFloor = flr.UpFloor;
		if (upflr)
		{
			upflr.calcWatchMode(HouseWatchMode.HW_MODE_HIDE);
			upflr.calcGridDisplayMode(GridDisplayMode.GD_MODE_HIDE);
		}
		//
		flr.calcWatchMode(WatchMode);
		flr.calcGridDisplayMode(GridMode);
		WalkViewFloor = flr;
		return true;
	}
	//--------------------------------------------------
	// 看上一层
	public function UpView() : boolean
	{
		var flr : HouseSceneFloor = WalkViewFloor;
		
		if (null == flr)
			return false;
		
		if (null == flr.UpFloor)
			return false;
		
		if (WatchMode == HouseWatchMode.HW_MODE_4)
			flr.calcWatchMode(HouseWatchMode.HW_MODE_4);
		else
			flr.calcWatchMode(HouseWatchMode.HW_MODE_3);
		
		if (GridMode != GridDisplayMode.GD_MODE_FITMENT)
			flr.calcGridDisplayMode(GridDisplayMode.GD_MODE_HIDE);
		
		//
		WalkViewFloor = flr.UpFloor;
		WalkViewFloor.calcWatchMode(WatchMode);
		WalkViewFloor.calcGridDisplayMode(GridMode);
		return true;
	}
	//--------------------------------------------------
	// 看下一层
	public function DownView() : boolean
	{
		var flr : HouseSceneFloor = WalkViewFloor;
		
		if (null == flr)
			return false;
		
		if (null == flr.DownFloor)
			return false;
		
		flr.calcWatchMode(HouseWatchMode.HW_MODE_HIDE);
		flr.calcGridDisplayMode(GridDisplayMode.GD_MODE_HIDE);
		
		//
		WalkViewFloor = flr.DownFloor;
		WalkViewFloor.calcWatchMode(WatchMode);
		WalkViewFloor.calcGridDisplayMode(GridMode);
		return true;
	}
	//--------------------------------------------------
	// 改变网格显示模式
	public function changeGridDisplayMode(mode : GridDisplayMode) : void
	{
		if (mode ==GridMode )
			return;
		
		GridMode = mode;
		
		if (WalkViewFloor && RootHouseFloor)
		{
			var floor : HouseSceneFloor = RootHouseFloor;
			while (floor != WalkViewFloor) 
			{
				if (GridDisplayMode.GD_MODE_FITMENT == mode)
					floor.calcGridDisplayMode(mode);
				else
					floor.calcGridDisplayMode(GridDisplayMode.GD_MODE_HIDE);
				
				floor = floor.UpFloor;
			}
			floor.calcGridDisplayMode(mode);
		}
		
		// 控制梯子的显示或隐藏
		showStairGraphics(GridMode == GridDisplayMode.GD_MODE_CONNECTEDNESS);
	}
	//--------------------------------------------------
	/* 获取ray网格. 
	@param ray 输入射线, ray方向必须是朝下, 即必须是-y才能正常工作
	@param gr 返回相交的网格
	@param worldCrossingPoint 返回相交的世界坐标交点
	@param allHouse 强制整个房子. true, 不管对应楼层显示是否隐藏都会对整个房子检测检测; false, 只从当前楼层开始检测
	*/
	public function rayGrid(ray : Ray, allHouse : boolean) : System.Object[]
	{
		var rt : boolean = false;
		var gr : HouseSceneGrid = null;
		var worldCrossingPoint : Vector3 = Vector3.zero;
		
		if (RootHouseFloor && WalkViewFloor)
		{
			// 控制相机与 交叉点的距离
			var dis : float = 10000000000.0f;
			
			// 因为我们的游戏只会从+y往-y发现pick, 所以这么写
			var houseFloor : HouseSceneFloor;
			if (allHouse)
			{
				var tf : HouseSceneFloor = RootHouseFloor;
				do
				{
					houseFloor = tf;
					tf = tf.UpFloor;
				}
				while (tf != null);
			}
			else
			{
				houseFloor = WalkViewFloor;
			}
		
			for (; null!=houseFloor; houseFloor=houseFloor.DownFloor)
			{
				var height : float = houseFloor.FloorHeight;
				var centerVec : Vector3  = GetPosition() + new Vector3(0, height, 0);
				var pla : Plane = new Plane(Vector3.up, centerVec);
				
				var rd : float;
				var rc : boolean = pla.Raycast(ray, rd);
		
				if (rc)// 如果有相交
				{
					worldCrossingPoint = ray.GetPoint(rd);
					var vec : Vector3 = worldCrossingPoint - centerVec;
					var x : int = Mathf.Floor(vec.x / HouseSceneDef.HOUSE_GRID_SIZE);
					var z : int = Mathf.Floor(vec.z / HouseSceneDef.HOUSE_GRID_SIZE);
		
					if (houseFloor.HasGrid(x,z) && (dis > rd))
					{
						gr = houseFloor.GetGrid(x,z);
						rt = true;
						break;
					}
				}
			}
		}
		
		////////
		//worldCrossingPoint.x = 0 - worldCrossingPoint.x;		//##LH
		
		var result : System.Object[] = new System.Object[3];
		result[0] = rt;
		result[1] = gr;
		result[2] = worldCrossingPoint;
		
		return result;
	}
	//--------------------------------------------------
	public function rayGrid(ray : Ray) : System.Object[]
	{
		return rayGrid(ray, true);
	}
	//--------------------------------------------------
	/* 获取坐标对应的网格
	@param pos 世界坐标
	@param YBias Y轴的偏差. 点经常不会正好在面上, 而是在一个体积里, 所以需要这个值.
	@param NeYBias -Y轴的偏差.
	@return 返回网格, 如果没找到, 返回空
	*/
	public function gridByPosition(pos : Vector3, YBias : float, NeYBias : float) : HouseSceneGrid
	{
		var ret : HouseSceneGrid = null;
		for (var floor : HouseSceneFloor in Floors.Values)
		{
			var height : float = floor.FloorHeight;
			if ((pos.y < (height-NeYBias)) || (pos.y >= (height+YBias)))
			{
				//不再范围内
				continue;
			}
			
			var centerVec : Vector3 = GetPosition(Space.World) + Vector3(0, height, 0);
			var vec : Vector3 = pos - centerVec;
			var x : int = Mathf.Floor(vec.x / HouseSceneDef.HOUSE_GRID_SIZE);
			var z : int = Mathf.Floor(vec.z / HouseSceneDef.HOUSE_GRID_SIZE);
			ret = getGrid(floor.FloorNO, x, z);
			break;
		}
		return ret;
	}
	//--------------------------------------------------
	// 获取对应位置的格子
	public function gridByPosition(pos : Vector3) : HouseSceneGrid
	{
		return gridByPosition(pos, 0.005f, 0.005f);
	}
	//--------------------------------------------------
	// 获取对应位置的格子
	public function gridByPosition(floor_num : int, pos : Vector3) : HouseSceneGrid
	{
		if (Floors.ContainsKey(floor_num))
		{
			var vec : Vector3 = pos - GetPosition(Space.World);
			var x : int = Mathf.Floor(vec.x / HouseSceneDef.HOUSE_GRID_SIZE);
			var z : int = Mathf.Floor(vec.z / HouseSceneDef.HOUSE_GRID_SIZE);
			return getGrid(floor_num, x, z);
		}
		return null;
	}
	//--------------------------------------------------
	// 获取当前楼层的交叉点,return: [x,z]
	public function getXZ(ray : Ray) : int[]
	{
		var x : int = 0;
		var z : int = 0;
		var centerVec : Vector3 = GetPosition() + Vector3(0, WalkViewFloor.FloorHeight, 0);
		var pla : Plane = new Plane(Vector3.up, centerVec);
		var rd : float;
		var rc : boolean = pla.Raycast(ray, rd);
		
		if (rc)	// 如果有相交
		{
			var worldCrossingPoint : Vector3 = ray.GetPoint(rd);
			var vec : Vector3 = worldCrossingPoint - centerVec;
			x = Mathf.Floor(vec.x / HouseSceneDef.HOUSE_GRID_SIZE);
			z = Mathf.Floor(vec.z / HouseSceneDef.HOUSE_GRID_SIZE);
		}
		
		var result : int[] = new int[2];
		result[0] = x;
		result[1] = z;
		
		return result;
	}
	//--------------------------------------------------
	// 获取格子
	public function getGrid(flrNO : int, x : int, z : int) : HouseSceneGrid
	{
		var floor : HouseSceneFloor = GetFloor(flrNO);
		if (null == floor)
		{
			Debug.LogWarning("Warning: HouseScene -> getGrid(int, int, int) -> floor["+flrNO+"] isn't exist!");
			return null;
		}
		var grid : HouseSceneGrid = floor.GetGrid(x, z);
		if (null == grid)
		{
			Debug.LogWarning("Warning: HouseScene -> getGrid(int, int, int) -> floor["+flrNO+"], grid[x="+x+", z="+z+"] isn't exist!");
			return null;
		}
		return grid;
	}
	//--------------------------------------------------
	// 直接开关穿透光
	public function turnPassLights(on : boolean) : void
	{
		for (var zl : ZoneLight in PassLights)
		{
			zl.changeDayNight(on);
		}
	}
	//--------------------------------------------------
	// 渐变穿透光
	public function smoothPassLights(on : boolean, per : float) : void
	{
		for (var zl : ZoneLight in PassLights)
		{
			zl.smoothDayNight(on, per);
		}
	}
	//--------------------------------------------------
	// 直接开关方向灯
	public function turnDirectLights(on : boolean) : void
	{
		for (var zl : ZoneLight in DirectLights)
		{
			zl.changeDayNight(on);
		}
	}
	//--------------------------------------------------
	// 渐变方向灯
	public function smoothDirectLights(on : boolean, per : float) : void
	{
		for (var zl : ZoneLight in DirectLights)
		{
			zl.smoothDayNight(on, per);
		}
	}
	//--------------------------------------------------
	// 直接开关聚光灯
	public function turnSpotLights(on : boolean) : void
	{
		for (var zl : ZoneLight in SpotLights)
		{
			zl.changeDayNight(on);
		}
	}
	//--------------------------------------------------
	// 渐变聚光灯
	public function smoothSpotLights(on : boolean, per : float) : void
	{
		for (var zl : ZoneLight in SpotLights)
		{
			zl.smoothDayNight(on, per);
		}
	}
	//--------------------------------------------------
	// 开关所有灯光
	public function turnLights(on : boolean) : void
	{
		for (var comp : HouseSceneComponent in HouseComps)
		{
			comp.turn(on);
		}
	}
	//--------------------------------------------------
	private function showStairGraphics(bVal : boolean) : void
	{
	}
	//--------------------------------------------------
	// 创建楼层
	private function buildFloors(houseRes : HouseRes) : void
	{
		var tempFloor : HouseSceneFloor = null;
		
		for (var hfr : HouseFloorRes in houseRes.FloorHouseResMap.Values)
		{
			var hFloor : HouseSceneFloor = new HouseSceneFloor(this);
			hFloor.FloorNO = hfr.No;
			hFloor.FloorHeight = hfr.Height;
			// 设置上下楼层
			hFloor.DownFloor = tempFloor;
			if (tempFloor)
			{
				tempFloor.UpFloor = hFloor;
			}
			tempFloor = hFloor;
			//
			hFloor.GameObj = new GameObject();
			hFloor.GameObj.name = "Floor_" + hfr.No.ToString();
			hFloor.SetParent(this);
			
			Floors.Add(hFloor.FloorNO, hFloor);
			// 创建格子墙壁
			buildGrids(hfr, hFloor);
			buildWalls(hfr, hFloor);
		}
		UpDownStair.getInstance().addTransmitParticle();
	}
	//--------------------------------------------------
	// 创建格子
	private function buildGrids(floorRes : HouseFloorRes, floor : HouseSceneFloor) : void
	{
		for (var hgr : HouseGridRes in floorRes.Grids)
		{
			var grid : HouseSceneGrid = floor.CreateGrid(hgr.X, hgr.Z, hgr.Type, hgr.Room, hgr.Param1);
			UpDownStair.getInstance().addTransmitGrid(grid);
		}
	}
	//--------------------------------------------------
	// 创建墙壁
	private function buildWalls(floorRes : HouseFloorRes, floor : HouseSceneFloor) : void
	{
		for (var hwr : HouseWallRes in floorRes.Walls)
		{
			var ga : HouseSceneGrid = floor.GetGrid(hwr.X0, hwr.Z0);
			var gb : HouseSceneGrid = floor.GetGrid(hwr.X1, hwr.Z1);
			
			if (null == ga)
				throw new Exception("HouseScene -> buildWalls(HouseFloorRes, HouseSceneFloor) -> can't find grid [x0=" + hwr.X0 + ", z0=" + hwr.Z0 + "].");
			
			if (null == gb)
				throw new Exception("HouseScene -> buildWalls(HouseFloorRes, HouseSceneFloor) -> can't find grid [x1=" + hwr.X1 + ", z1=" + hwr.Z1 + "].");
			
			var fc : int = ga.isNeighborGrid(gb);
			if (-1 == fc)
				throw new Exception("Invaid Walls Data!");
			
			ga.setWallFace(fc, true);
			
			var hwall : HouseSceneWall = new HouseSceneWall();
			hwall.X0 = hwr.X0;
			hwall.Z0 = hwr.Z0;
			hwall.X1 = hwr.X1;
			hwall.Z1 = hwr.Z1;
			floor.Walls.Add(hwall);
		}
	}
	//--------------------------------------------------
	// 创建框架部件
	public function buildFrameComps(house_obj : GameObject) : void
	{
		for (var trans : Transform in house_obj.GetComponentsInChildren(Transform))
		{
			if (house_obj == trans.gameObject)
				continue;
			
			var result = parseFrameCompName(trans.gameObject.name);
			var comp : HouseSceneComponent = HSCManager.getSingleton().createHouseSceneComponent();
			GameObject.Destroy(comp.GameObj);
			comp.IsFrame = true;
			comp.FloorNo = result[1];
			comp.RoomNo = result[2];
			comp.CompPropRow = ResManager.LgtMgr.getHouseCompPropRow(result[0]);
			comp.GameObj = trans.gameObject;
			comp.ModelObj = trans.gameObject;
			comp.Template = trans.gameObject.name;
			comp.load();
			HouseComps.Add(comp);
			if (Floors.ContainsKey(comp.FloorNo))
			{
				var floor : HouseSceneFloor = Floors[comp.FloorNo];
				floor.HouseComps.Add(comp);
			}
			HouseSceneRoomMgr.getInstance().parseHouseComp(result[1], result[2], result[0], trans.gameObject);
		}
		WallFloorReplace.getInstance().initRoomSlots();
	}
	//--------------------------------------------------
	// 创建穿透光
	private function buildPassLights(houseRes : HouseRes) : void
	{
		mPassLightObj = new GameObject();
		mPassLightObj.name = "PassLights";
		CommFunc.setParent(GameObj, mPassLightObj);
		
		for (var plr : PassLightRes in houseRes.PassLightResList)
		{
			var zl : ZoneLight = new ZoneLight();
			zl.createPassLight(plr, mPassLightObj);
			
			PassLights.Add(zl);
		}
	}
	//--------------------------------------------------
	// 创建方向光
	private function buildDirectLights(houseRes : HouseRes) : void
	{
		mDirectLightObj = new GameObject();
		mDirectLightObj.name = "DirectLights";
		CommFunc.setParent(GameObj, mDirectLightObj);
		
		for (var dlr : DirectLightRes in houseRes.DirectLightResList)
		{
			var zl : ZoneLight = new ZoneLight();
			zl.createDirectLight(dlr, mDirectLightObj);
			
			DirectLights.Add(zl);
		}	
	}
	//--------------------------------------------------
	// 创建聚光光
	private function buildSpotLights(houseRes : HouseRes) : void
	{
		mSpotLightObj = new GameObject();
		mSpotLightObj.name = "SpotLights";
		CommFunc.setParent(GameObj, mSpotLightObj);
		
		for (var slr : SpotLightRes in houseRes.SpotLightResList)
		{
			var zl : ZoneLight = new ZoneLight();
			zl.createSpotLight(slr, mSpotLightObj);
			
			SpotLights.Add(zl);
		}	
	}
	//--------------------------------------------------
	// 挂接房屋部件
	public function attachComponent(hsc : HouseSceneComponent) : void
	{
	    HouseComps.Add(hsc);
	}
	//--------------------------------------------------
	// 解除挂接房屋部件
	public function detachComponent(hsc : HouseSceneComponent) : void
	{
	    HouseComps.Remove(hsc);
	}
	//--------------------------------------------------
	// 解析框架部件名称
	public static function parseFrameCompName(frame_name : String) : System.Object[]
	{
		var name_str : String[] = frame_name.Split(["_"], StringSplitOptions.RemoveEmptyEntries);
		if (5 != name_str.Length)
			throw "HouseScene -> parseFrameCompName(String) -> frame name [" + frame_name + "], format is wrong.";
		
		var type_str : String = name_str[2];
		var num_str : String = name_str[3];
		
		var type : int = 0;		// 类型
		var floor : int = 0;	// 楼层编号
		var room : int = 0;		// 房屋编号
		// 类型分析
		if ("groundbase"==type_str || "static"==type_str)
		{
			type = HouseComponentPropertyType.HCP_STATIC;
		}
		else if ("innerwall"==type_str || "inneredge"==type_str)
		{
			type = HouseComponentPropertyType.HCP_IN_WALL;
		}
		else if ("outwall"==type_str || "outedge"==type_str)
		{
			type = HouseComponentPropertyType.HCP_OUT_WALL;
		}
		else if ("floor" == type_str)
		{
			type = HouseComponentPropertyType.HCP_FLOOR;
		}
		else if ("roof" == type_str)
		{
			type = HouseComponentPropertyType.HCP_ROOF;
		}
		else if ("tcx"==type_str || "edgetcx"==type_str)
		{
			type = HouseComponentPropertyType.HCP_TCX;
		}
		else	// 类型不属于上面几种就抛异常
		{
			throw "HouseScene -> parseFrameCompName(String) -> frame name [" + frame_name + "], type [" + type_str + "] is wrong.";
		}
		// 楼层/房屋编号分析
		floor = int.Parse(num_str) / 100;
		room = int.Parse(num_str) % 100;
		
		var result : System.Object[] = new System.Object[3];
		result[0] = type;
		result[1] = floor;
		result[2] = room;
		
		return result;
	}
	//--------------------------------------------------
}


