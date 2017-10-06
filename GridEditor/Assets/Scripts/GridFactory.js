/***************************************************
*** 格子工厂(2012/5/17 create by hezhr)
***************************************************/



private static var mInstance : GridFactory = null;			// 实例
private var mGrids : GameObject = null;						// 下面挂接所有的辅助格子
private var mGridTable : Hashtable = new Hashtable();		// 保存所有格子
public var GridPrefab : GameObject = null;					// 格子的预制件


//--------------------------------------------------
function Awake()
{
	mInstance = this;
}
//--------------------------------------------------
function Start()
{
	mGrids = new GameObject();
	mGrids.name = "Grids";
}
//--------------------------------------------------
public static function getInstance() : GridFactory
{
	return mInstance;
}
//--------------------------------------------------
// 创建单个格子,
private function createGrid(g_x : int, g_z : int, width : float, height : float, pare : GameObject) : GameObject
{
	if (null == GridPrefab)
	{
		Debug.LogError("GridFactory -> createGrid(int, int, float, float, GameObject) -> grid prefab is null!");
		return null;
	}
	var grid : GameObject = GameObject.Instantiate(GridPrefab);
	grid.transform.position = Vector3(g_x*width + width/2, grid.transform.position.y + height, g_z*width + width/2);
	grid.name = "(" + g_x + ", " + g_z + ")";
	if (pare)
	{
		grid.transform.parent = pare.transform;
	}
	return grid;
}
//--------------------------------------------------
// 创建格子
private function createGrid(floor : int, x : int, z : int, height : float, pare : GameObject) : GameObject
{
	var grid : GameObject = createGrid(x, z, 0.8f, height, pare);
	var gp : GridProperty = grid.GetComponent("GridProperty");
	gp.index.floor = floor;
	gp.index.x = x;
	gp.index.z = z;
	gp.index.height = height;
	return grid;
}
//--------------------------------------------------
// 创建辅助格子,floors:层数,radius:半径格子数,height:每层的高度
public function createHelpGrids(floors : int, radius : int, height : float) : void
{
	if ((0 == floors) || (0 == radius))
		return;
	
	destroyHelpGrids();
	for (var f:int=1; f<=floors; ++f)
	{
		var floorObj : GameObject = new GameObject();
		floorObj.name = "Grids_Floor_" + f.ToString();
		floorObj.transform.parent = mGrids.transform;
		
		for (var x:int=-radius; x<radius; ++x)
		{
			for (var z:int=-radius; z<radius; ++z)
			{
				createGrid(f, x, z, (f-1)*height, floorObj);
			}
		}
		mGridTable.Add(f, floorObj);
	}
}
//--------------------------------------------------
// 删除所有辅助格子
public function destroyHelpGrids() : void
{
	for (var grid : GameObject in mGridTable.Values)
	{
		GameObject.Destroy(grid);
	}
	mGridTable.Clear();
}
//--------------------------------------------------
// 显示/隐藏楼层格子
public function setHelpGridsVisible(floor : int, visible : boolean) : void
{
	if (mGridTable.ContainsKey(floor))
	{
		mGridTable[floor].SetActiveRecursively(visible);
	}
}
//--------------------------------------------------
// 根据楼层和索引值获取格子
public function getHelpGrid(floor : int, x : int, z : int) : GameObject
{
	if (false == mGridTable.ContainsKey(floor))
	{
		Debug.LogWarning("GridFactory -> getHelpGrid(int, int, int) -> not exist floor = " + floor);
		return null;
	}
	for (var trans : Transform in mGridTable[floor].GetComponentsInChildren(Transform, true))
	{
		var gp : GridProperty = trans.gameObject.GetComponent("GridProperty");
		if (gp && (x == gp.index.x) && (z == gp.index.z))
		{
			return trans.gameObject;
		}
	}
	Debug.LogWarning("GridFactory -> getHelpGrid(int, int, int) -> not exist floor = " + floor + ", x = " + x + ", z =" + z);
	return null;
}
//--------------------------------------------------
// 获取楼层格子信息
public function getHouseGridsRes(floor : int) : Array
{
	var arr : Array = new Array();
	if (false == mGridTable.ContainsKey(floor))
	{
		Debug.LogWarning("GridFactory -> getHouseGridsRes(int) -> not exist floor = " + floor);
		return arr;
	}
	for (var trans : Transform in mGridTable[floor].GetComponentsInChildren(Transform, true))
	{
		var gp : GridProperty = trans.gameObject.GetComponent("GridProperty");
		if ((null == gp) || (-1 == gp.type))
			continue;
		
		var hgr : HouseGridRes = new HouseGridRes();
		hgr.Type = gp.type;
		hgr.X = gp.index.x;
		hgr.Z = gp.index.z;
		hgr.Room = gp.roomType;
		hgr.Param1 = gp.param1;
		arr.Add(hgr);
	}
	return arr;
}
//--------------------------------------------------
// 是否有格子
public function isEmpty() : boolean
{
	return 0 == mGridTable.Count;
}
//--------------------------------------------------


