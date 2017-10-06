/*--------------------------------------------------
房屋楼层(2012/5/24 modify by hezhr)
--------------------------------------------------*/
#pragma strict



// 楼层房间内的所有物件，不包括灯光，不适用于室外
class RoomComponent
{
	var floor : HouseSceneComponent;
	var wall : Array = new Array();
	var tcx : Array = new Array();
	var sta : Array = new Array();
	var comp : Array = new Array();
};



class HouseSceneFloor extends SceneObject
{
    var Creator : HouseScene;
	var Grids : Hashtable = new Hashtable();
	var Walls : Array = new Array();
	var FloorHeight : float;
	var FloorNO : int;
	var UpFloor : HouseSceneFloor;
	var DownFloor : HouseSceneFloor;
	// 仅映射,目前只保存楼层的框架部件,管理由HouseScene负责
	var HouseComps : Array = new Array();
	// 根格子, 每层至少有这样1个根格子. 这目前主要为从max导出的房屋框架准备的准备的. 如果是花园层应该没这个信息
	var RootGrid : HouseSceneGrid;
	// 楼层部件管理[int, RoomComponent]
	var RoomComponentMap : Hashtable = new Hashtable();
	
	//--------------------------------------------------
	function HouseSceneFloor(sce : HouseScene)
	{
	    Creator = sce;
	    
		RootGrid = new HouseSceneGrid(this);
		RootGrid.IsFrameGrid = true;
		RootGrid.setGridType(HouseGridType.HGT_FRAME);
	}
	//--------------------------------------------------
	public function Destroy() : void
	{
		for (var obj : System.Object in Grids.Values)
		{
			var hsc : HouseSceneGrid = obj as HouseSceneGrid;
			hsc.Destroy();
		}
		
		super.Destroy();
	}
	//--------------------------------------------------
	private function getHashKey(x : int, z : int) : int
	{
	    return x + z * 10000;
	}
	//--------------------------------------------------
	// 获取格子
	public function GetGrid(x : int, z : int) : HouseSceneGrid
	{
	    // 防止getHashKey错误
	    if (x>10000 || x<-10000 || z>10000 || z<-10000)
	        return null;
				
	    return Grids[getHashKey(x, z)] as HouseSceneGrid;   
	}
	//--------------------------------------------------
	// 创建格子
	public function CreateGrid(x : int, z : int, typeID : int, roomID : int, param1 : String) : HouseSceneGrid
	{
		if (HasGrid(x, z))
			throw "HouseSceneFloor -> CreateGrid(int, int, int, int) -> Grid(" + x + "," + z + ") has exists!";
		
		var grid : HouseSceneGrid = new HouseSceneGrid(this);
		grid.GameObj = new GameObject();
		grid.GameObj.name = "Grid(" + x.ToString() + "," + z.ToString() + ")";
		grid.SetParent(this);
		grid.setGridType(typeID);
		grid.setGridNo(x, z);
		grid.Room = roomID;
		grid.Param1 = param1;
		
		Grids.Add(getHashKey(x, z), grid);
		
		/*======= Temp create grid ================================================
		var gpt : Vector3 = grid.GetPosition();
		gpt.y += 4;
		gpt.x = 0;
		gpt.z = 0;
		var mesh : Mesh = new Mesh();
		mesh.vertices =
			[
			Vector3(gpt.x - HouseSceneDef.HOUSE_GRID_HALF_SIZE, gpt.y + 4, gpt.z + HouseSceneDef.HOUSE_GRID_HALF_SIZE),
			Vector3(gpt.x - HouseSceneDef.HOUSE_GRID_HALF_SIZE, gpt.y + 4, gpt.z - HouseSceneDef.HOUSE_GRID_HALF_SIZE),
			Vector3(gpt.x + HouseSceneDef.HOUSE_GRID_HALF_SIZE, gpt.y + 4, gpt.z - HouseSceneDef.HOUSE_GRID_HALF_SIZE),
			Vector3(gpt.x + HouseSceneDef.HOUSE_GRID_HALF_SIZE, gpt.y + 4, gpt.z + HouseSceneDef.HOUSE_GRID_HALF_SIZE)
			];
		mesh.triangles = [0,2,1,0,3,2,0,1,2,2,3,0];
		mesh.uv =
			[
			Vector2(0,1),
			Vector2(0,0),
			Vector2(1,0),
			Vector2(1,1)
			];
		mesh.normals =
			[
			Vector3.up,
			Vector3.up,
			Vector3.up,
			Vector3.up
			];
		grid.GameObj.AddComponent("MeshFilter");
		grid.GameObj.AddComponent("MeshRenderer");
		var meshFilter : MeshFilter = grid.GameObj.GetComponent(typeof(MeshFilter));
		var meshRenderer : MeshRenderer = grid.GameObj.GetComponent(typeof(MeshRenderer));
		meshFilter.mesh = mesh;
		meshRenderer.material = new Material(Shader.Find("Particles/Alpha Blended"));//Diffuse
		meshRenderer.material.color = Color.white;
		meshRenderer.material.mainTexture = GameObject.Find("Main Camera").GetComponent("Main").gridTexture;
		========================================================================*/
		
		return grid;
	}
	//--------------------------------------------------
	// 是否有对应的格子
	public function HasGrid(x : int, z : int) : boolean
	{
		if (null == GetGrid(x, z))
			return false;
		
		return true;
	}
	//--------------------------------------------------
	// 是否有网格
	public function HasGrids() : boolean
	{
		return Grids.Count > 0;
	}
	//--------------------------------------------------
	// 删除格子
	public function destroyGrid(x : int, z : int) : void
	{
		var grid : HouseSceneGrid = GetGrid(x, z);
		if (grid)
		{
			grid.Destroy();
			Grids.Remove(getHashKey(x, z));
		}
	}
	//--------------------------------------------------
	// 格子被增删或发生改变
	public function notifyGridChanged() : void
	{
	}
	//--------------------------------------------------
	// 房间编号被改了
	public function notifyRoomIDChanged() : void
	{
	}
	//--------------------------------------------------
	// 计算观察模式
	public function calcWatchMode(mode : HouseWatchMode) : void
	{
		RootGrid.calcWatchMode(mode);
		for (var obj1 : System.Object in Grids.Values)
		{
			var hsg : HouseSceneGrid = obj1 as HouseSceneGrid;
			hsg.calcWatchMode(mode);
		}
		
		for (var obj2 : System.Object in HouseComps)
		{
			var hsc : HouseSceneComponent = obj2 as HouseSceneComponent;
			hsc.calcWatchMode(mode);
		}
	}
	//--------------------------------------------------
	// 更新剔除
	public function updateCull() : void
	{	
		//只对普通家具做剔除. 房屋框架无视
		for (var obj1 : System.Object in Grids.Values)
		{
			var hsg : HouseSceneGrid = obj1 as HouseSceneGrid;
			hsg.updateCull();
		}
	}
	//--------------------------------------------------
	// 计算网格显示模式
	public function calcGridDisplayMode(mode : GridDisplayMode) : void
	{
		// 隐藏相关平面
		showGridTypePlane(false);
		showWallPlane(false);
		showHoldGridPlane(false);
		showRoomIDPlane(false);
		
		// 根据情况显示
		switch (mode)
		{
		case GridDisplayMode.GD_MODE_HIDE:
			break;
		case GridDisplayMode.GD_MODE_GAME:
			break;
		case GridDisplayMode.GD_MODE_FITMENT:
			showHoldGridPlane(true, true);
			break;
		case GridDisplayMode.GD_MODE_STYLE:
			showGridTypePlane(true);
			showHoldGridPlane(true);
			break;
		case GridDisplayMode.GD_MODE_CONNECTEDNESS:
			showGridTypePlane(true);
			showHoldGridPlane(true);
			showWallPlane(true);
			showRoomIDPlane(true);
			break;
		}
	}
	//--------------------------------------------------
	public function insertRoomComponent(room : int, comp : HouseSceneComponent) : void
	{
		if (!RoomComponentMap.Contains(room))
		{
			RoomComponentMap.Add(room, new RoomComponent());
		}
		
		var it : RoomComponent = RoomComponentMap[room] as RoomComponent;
		
		switch (comp.CompPropRow.PropID)
		{
		case HouseComponentPropertyType.HCP_FLOOR:
			it.floor = comp;
			break;
		case HouseComponentPropertyType.HCP_OUT_WALL:
		case HouseComponentPropertyType.HCP_IN_WALL:
			if (-1 == CommFunc.indexOfArray(it.wall, comp))
			{
				it.wall.Add(comp);
			}
			break;
		case HouseComponentPropertyType.HCP_TCX:
			if (-1 == CommFunc.indexOfArray(it.tcx, comp))
			{
				it.tcx.Add(comp);
			}
			break;
		case HouseComponentPropertyType.HCP_NONE:
		case HouseComponentPropertyType.HCP_STATIC:
		case HouseComponentPropertyType.HCP_ROOF:
			if (-1 == CommFunc.indexOfArray(it.sta, comp))
			{
				it.sta.Add(comp);
			}
			break;
		default:
			if (-1 == CommFunc.indexOfArray(it.comp, comp))
			{
				it.comp.Add(comp);
			}
			break;
		}
	}
	//--------------------------------------------------
	public function removeRoomComponent(room : int, comp : HouseSceneComponent) : void
	{
		if (!RoomComponentMap.Contains(room))
		{
			Debug.Log("Can't find Zone '" + room + "'!");
			return;
		}
		
		var it : RoomComponent = RoomComponentMap[room] as RoomComponent;
		var p : int = -1;
		
		switch (comp.CompPropRow.PropID)
		{
		case HouseComponentPropertyType.HCP_FLOOR:
			it.floor = null;
			break;
		case HouseComponentPropertyType.HCP_OUT_WALL:
		case HouseComponentPropertyType.HCP_IN_WALL:
			p = CommFunc.indexOfArray(it.wall, comp);
			if(-1 != p)
			{
				it.wall.RemoveAt(p);
			}
			break;
		case HouseComponentPropertyType.HCP_TCX:
			p = CommFunc.indexOfArray(it.tcx, comp);
			if(-1 != p)
			{
				it.tcx.RemoveAt(p);
			}
			break;
		case HouseComponentPropertyType.HCP_NONE:
		case HouseComponentPropertyType.HCP_STATIC:
		case HouseComponentPropertyType.HCP_ROOF:
			p = CommFunc.indexOfArray(it.sta, comp);
			if (-1 != p)
			{
				it.sta.RemoveAt(p);
			}
			break;
		default:
			p = CommFunc.indexOfArray(it.comp, comp);
			if (-1 != p)
			{
				it.comp.RemoveAt(p);
			}
			break;
		}
	}
	//--------------------------------------------------
	protected function showGridTypePlane(bShow : boolean) : void
	{
	}
	//--------------------------------------------------
	protected function showWallPlane(bShow : boolean) : void
	{
	}
	//--------------------------------------------------
	protected function showHoldGridPlane(bShow : boolean) : void
	{
		showHoldGridPlane(bShow, false);
	}
	//--------------------------------------------------
	protected function showHoldGridPlane(bShow : boolean, bFitmentMode : boolean) : void
	{
	}
	//--------------------------------------------------
	protected function showRoomIDPlane(bShow : boolean) : void
	{
		showRoomIDPlane(bShow, false, 0);
	}
	//--------------------------------------------------
	protected function showRoomIDPlane(bShow : boolean, bCareID : boolean, filterID : int) : void
	{
	}
	//--------------------------------------------------
}


