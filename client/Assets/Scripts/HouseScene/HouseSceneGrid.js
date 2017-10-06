/*--------------------------------------------------
房屋格子(2012/5/25 modify by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast



class HouseSceneGrid extends SceneObject
{
	var Type : int = 0;									// 格子属性类型
	var Room : int = 0;									// 格子所在房间编号
	var X : int = 0;									// 格子X编号
	var Z : int = 0;									// 格子Z编号
	var Param1 : String = "";							// 格子参数
	var IsFrameGrid : boolean = false;					// 是否框架格子
	var Blocked : boolean = false;						// 阻档属性
	var Creator : HouseSceneFloor = null;				// 格子所在楼层
	var WallFace : boolean[] = [false, false, false, false];
	var HouseComps : Array = new Array();				// 仅映射，管理由HouseScene负责
	var GridTypeRow : HouseGridTypeRow = null;			// 格子属性
	//--------------------------------------------------
	function HouseSceneGrid(floor : HouseSceneFloor)
	{
		Creator = floor;
	}
	//--------------------------------------------------
	protected function comComparFun(com1 : HouseSceneComponent, com2 : HouseSceneComponent) : int
	{
		if (com1.Height == com2.Height)
			return 0;
		
		if (com1.Height < com2.Height)
			return -1;
		
		return 1;
	}
	//--------------------------------------------------
	public function attachComponent(com : HouseSceneComponent) : void
	{
		HouseComps.Add(com);
		HouseComps.Sort(comComparFun);
	}
	//--------------------------------------------------
	public function detachComponent(com : HouseSceneComponent) : void
	{
		HouseComps.Remove(com);
	}
	//--------------------------------------------------
	// 设置网格编号
	public function setGridNo(x : int, z : int) : void
	{
		X = x;
		Z = z;
		
		updatePosition(Space.World);
	}
	//--------------------------------------------------
	// 设置格子类型, 只能设置一次
	public function setGridType(typeID : int) : void
	{
		if (GridTypeRow)
			return;
		
		Type = typeID;
		GridTypeRow = ResManager.LgtMgr.HouseGridTypeTable[typeID] as HouseGridTypeRow;
		// 阻挡属性
		Blocked = (HouseSceneDef.HOUSE_BLOCKED_GRID_TYPE == typeID || HouseSceneDef.HOUSE_ASSIST_GRID_TYPE == typeID);
		
		if (null == GridTypeRow)
			Debug.Log("Grid type id:" + typeID + " not find row.");
	}
	//--------------------------------------------------
	// 设置哪面是墙, 这是双方的行为, 返回另外一个影响的网格, 这个网格必须有.
	// remarks face 0为x正方向. 逆时针方向存取,既, 0,x  1,-z  2,-x  3,z
	public function setWallFace(face : int, wall : boolean) : HouseSceneGrid
	{
		if (IsFrameGrid)
			throw "HouseSceneGrid -> setWallFace(int, boolean) -> can't be frame grid!";
		
		var rts : System.Object[] = getFaceGridNo(face);
		var x : int = rts[0];
		var z : int = rts[1];
		var nf : int = negativeFace(face);
		
		var grid : HouseSceneGrid = Creator.GetGrid(x, z);
		if (!grid)
			throw "HouseSceneGrid -> setWallFace(int, boolean) -> can't find neighbor grid!";
		
		if (WallFace[face] != wall)
		{
			WallFace[face] = wall;
			grid.WallFace[nf] = wall;
		}
		
		return grid;
	}
	//--------------------------------------------------
	// 获取墙体情况
	public function getWallFace(face : int) : boolean
	{
		return WallFace[face];
	}
	//--------------------------------------------------
	// 获取朝向的邻居网格坐标,return [x,z]
	public function getFaceGridNo(face : int) : System.Object[]
	{
		var x : int = X;
		var z : int = Z;
		var nf : int = negativeFace(face);
		
		switch (face)
		{
		case 0:
			++x;
			break;
		case 1:
			--z;
			break;
		case 2:
			--x;
			break;
		case 3:
			++z;
			break;
		}
		
		var result : System.Object[] = new System.Object[2];
		result[0] = x;
		result[1] = z;
		
		return result;
	}
	//--------------------------------------------------
	public function hasWallFace() : boolean
	{
		for (var i:int=0; i<HouseSceneDef.WALL_FACE_COUNT; ++i)
		{
			if (WallFace[i])
				return true;
		}
		return false;
	}
	//--------------------------------------------------
	// 设为阻挡
	public function setBlocked(bVal : boolean) : void
	{
		Blocked = bVal;
		
		//
		// Todo...
		//
	}
	//--------------------------------------------------
	// 计算观察模式
	public function calcWatchMode(mode : HouseWatchMode) : void
	{
		for (var hsc_obj : System.Object in HouseComps)
		{
			var hsc : HouseSceneComponent = hsc_obj as HouseSceneComponent;
			hsc.calcWatchMode(mode);
		}
	}
	//--------------------------------------------------
	// 更新剔除
	public function updateCull() : void
	{
		for (var hsc_obj : System.Object in HouseComps)
		{
			var hsc : HouseSceneComponent = hsc_obj as HouseSceneComponent;
			hsc.updateCull();
		}
	}
	//--------------------------------------------------
	// 是否是邻居网格, 同时返回朝向,返回-1则不是
	public function isNeighborGrid(grid : HouseSceneGrid) : int
	{
		if (Creator != grid.Creator)
		{
			return -1;
		}
		if (IsFrameGrid || grid.IsFrameGrid)
		{
			return -1;
		}
		if ((X + 1 == grid.X) && (Z == grid.Z))
		{
			return 0;
		}
		if ((X - 1 == grid.X) && (Z == grid.Z))
		{
			return 2;
		}
		if ((X == grid.X) && (Z + 1 == grid.Z))
		{
			return 3;
		}
		if ((X == grid.X) && (Z - 1 == grid.Z))
		{
			return 1;
		}
		return -1;
	}
	//--------------------------------------------------
	public static function negativeFace(face : int) : int
	{
		var nf : int = 0;
		switch (face)
		{
		case 0:
			nf = 2;
			break;
		case 1:
			nf = 3;
			break;
		case 2:
			nf = 0;
			break;
		case 3:
			nf = 1;
			break;
		}
		
		return nf;
	}
	//--------------------------------------------------
	public function updatePosition() : void
	{
		updatePosition(Space.Self);
	}
	//--------------------------------------------------
	public function updatePosition(relativeTo : Space) : void
	{
		var pt : Vector3 = Vector3.zero;
		
		pt.x = /*0.0 - */(HouseSceneDef.HOUSE_GRID_SIZE * X + HouseSceneDef.HOUSE_GRID_HALF_SIZE);	//##LH
		pt.y = Creator.FloorHeight;
		pt.z = (HouseSceneDef.HOUSE_GRID_SIZE * Z + HouseSceneDef.HOUSE_GRID_HALF_SIZE);
		
		SetPosition(pt, relativeTo);
	}
	//--------------------------------------------------
	// 获取占据格子同个房屋内,周边一定距离内的非阻挡格子;hold_grids:家具的占据格子,floor:楼层,distance:距离
	public static function getAroundGrids(hold_grids : Array, floor : HouseSceneFloor, distance : int) : Array
	{
		var around_grids : Array = new Array();
		if (null==hold_grids || 0==hold_grids.Count || null==floor || distance<1)
		{
			return around_grids;
		}
		// 遍历房屋所有格子
		for (var grid_obj : System.Object in floor.Grids.Values)
		{
			var grid : HouseSceneGrid = grid_obj as HouseSceneGrid;
			// 找出在距离内的非阻挡格子
			for (var hsg1_obj : System.Object in hold_grids)
			{
				var hsg1 : HouseSceneGrid = hsg1_obj as HouseSceneGrid;
				if (Mathf.Abs(grid.X - hsg1.X) <= distance &&
					Mathf.Abs(grid.Z - hsg1.Z) <= distance &&
					false == grid.Blocked &&
					grid.Room == hsg1.Room)
				{
					around_grids.Add(grid);
					break;
				}
			}
		}
		// 过滤掉占据格子
		var arr : Array = new Array();
		for (var around_obj : System.Object in around_grids)
		{
			var around : HouseSceneGrid = around_obj as HouseSceneGrid;
			for (var hsg2_obj : System.Object in hold_grids)
			{
				var hsg2 : HouseSceneGrid = hsg2_obj as HouseSceneGrid;
				if (around == hsg2)
				{
					arr.Add(around);
					break;
				}
			}
		}
		for (var del_grid_obj : System.Object in arr)
		{
			var del_grid : HouseSceneGrid = del_grid_obj as HouseSceneGrid;
			around_grids.Remove(del_grid);
		}
		return around_grids;
	}
	//--------------------------------------------------
	// 获取最近的格子,从grids里获取离pos最近的格子
	public static function getNearestGrid(grids : Array, pos : Vector3) : HouseSceneGrid
	{
		if (null==grids || 0==grids.Count)
		{
			Debug.LogWarning("HouseSceneGrid -> getNearestGrid(Array, Vector3) -> parameter is wrong!");
			return null;
		}
		var nearest_grid : HouseSceneGrid = grids[0] as HouseSceneGrid;
		var distance : float = Vector3.Distance(nearest_grid.GameObj.transform.position, pos);
		for (var grid_obj : System.Object in grids)
		{
			var grid : HouseSceneGrid = grid_obj as HouseSceneGrid;
			var dis : float = Vector3.Distance(grid.GameObj.transform.position, pos);
			if (distance > dis)		// 最近距离
			{
				distance = dis;
				nearest_grid = grid;
			}
		}
		return nearest_grid;
	}
	//--------------------------------------------------
	// 随机获取房间可行走区域的格子,在找不到情况为空
	public static function getRandomGridInWalkArea(ignore_grids : Array) : HouseSceneGrid
	{
		var hs : HouseScene = EQSceneManager.getSingleton().HouseSceneObj;
		if (null == hs)
			return null;
		
		var grs : Array = new Array();
		for (var floor_obj : System.Object in hs.Floors.Values)
		{
			var floor : HouseSceneFloor = floor_obj as HouseSceneFloor;
			for (var grid_obj : System.Object in floor.Grids.Values)
			{
				var grid : HouseSceneGrid = grid_obj as HouseSceneGrid;
				var typeID : int = grid.GridTypeRow.TypeID;
				// 格子具有阻挡属性,跳过
				if (HouseSceneDef.HOUSE_BLOCKED_GRID_TYPE == typeID || HouseSceneDef.HOUSE_ASSIST_GRID_TYPE == typeID)	
					continue;
				// 格子已经被使用了,跳过
				if (-1 != CommFunc.indexOfArray(ignore_grids, grid))
					continue;
				
				grs.Add(grid);
			}
		}
		
		if (0 == grs.Count)
			return null;
		
		var ix = Random.Range(0, grs.Count);
		return grs[ix] as HouseSceneGrid;
	}
	//--------------------------------------------------
	// 根据楼层随机获取可行走区域的格子
	public static function getRandomGridInWalkAreaByFloor(ignoreGrids : Array, floorNo : int) : HouseSceneGrid
	{
		var hs : HouseScene = EQSceneManager.getSingleton().HouseSceneObj;
		if (null == hs || false == hs.Floors.ContainsKey(floorNo))
			return null;
		
		var grs : Array = new Array();
		var floor : HouseSceneFloor = hs.Floors[floorNo];
		for (var grid : HouseSceneGrid in floor.Grids.Values)
		{
			var typeID : int = grid.GridTypeRow.TypeID;
			// 格子具有阻挡属性,跳过
			if (HouseSceneDef.HOUSE_BLOCKED_GRID_TYPE == typeID || HouseSceneDef.HOUSE_ASSIST_GRID_TYPE == typeID)	
				continue;
			// 格子已经被使用了,跳过
			if (-1 != CommFunc.indexOfArray(ignoreGrids, grid))
				continue;
			
			grs.Add(grid);
		}
		if (0 == grs.Count)
			return null;
		
		var ix = Random.Range(0, grs.Count);
		return grs[ix];
	}
	//--------------------------------------------------
	// 获取可行走区域内离位置所在格子的所有最近格子
	public static function getAroundGridsInWalkArea(pos : Vector3) : Array
	{
		var around_arr : Array = new Array();
		var pos_grid : HouseSceneGrid = getGridByPos(pos);
		if (null == pos_grid)
			return around_arr;
		
		var x0 : int = (pos_grid.Creator.Grids[0] as HouseSceneGrid).X;
		var z0 : int = (pos_grid.Creator.Grids[0] as HouseSceneGrid).Z;
		var distance : int = CommFunc.getPosDistance(x0, z0, pos_grid.X, pos_grid.Z);
		for (var grid_obj : System.Object in pos_grid.Creator.Grids.Values)
		{
			var grid : HouseSceneGrid = grid_obj as HouseSceneGrid;
			// 格子具有阻挡属性,跳过
			if (grid == pos_grid || grid.Blocked || HouseSceneDef.HOUSE_BLOCKED_GRID_TYPE == grid.GridTypeRow.TypeID ||
				HouseSceneDef.HOUSE_ASSIST_GRID_TYPE == grid.GridTypeRow.TypeID)
			{
				continue;
			}
			var dist : int = CommFunc.getPosDistance(grid.X, grid.Z, pos_grid.X, pos_grid.Z);
			if (distance == dist)
			{
				around_arr.Add(grid);
			}
			else if (distance > dist)
			{
				distance = dist;
				around_arr.Clear();
				around_arr.Add(grid);
			}
		}
		return around_arr;
	}
	//--------------------------------------------------
	// 根据获取格子
	public static function getGridByPos(pos : Vector3) : HouseSceneGrid
	{
		var hs : HouseScene = EQSceneManager.getSingleton().HouseSceneObj;
		if (null == hs)
			return null;
		
		return hs.gridByPosition(pos);
	}
	//--------------------------------------------------
}


