/***************************************************
*** 主脚本(2012/8/15 modify by hezhr)
***************************************************/
import System;



public var HouseObject : GameObject;					// 要编辑的房屋fbx
public var HouseResFile : TextAsset;					// 房屋对应的xml文件(如果没有,则不需要拖)
private var mHouseRes : HouseRes = new HouseRes();		// 加载进来的房屋资源
private var mHouseResWriter : HouseResWriter = new HouseResWriter();
private var mFloors : int = 1;							// 楼层数
private var mRadius : int = 10;							// 格子半径数
private var mHeight : float = 3.55f;					// 楼层高度
private var mCurFloor : int = 1;						// 当前楼层
public var gridFactory : GridFactory;					// 格子工厂
public var wallFactory : WallFactory;					// 墙壁工厂
public var operateMgr : OperateMgr;
public var dataCenter : DataCenter;

//--------------------------------------------------
function Awake()
{

}
//--------------------------------------------------
function Start()
{
	if (HouseObject)
	{
		GameObject.Instantiate(HouseObject);
	}
	if (HouseResFile)
	{
		mHouseRes.LoadFromString(HouseResFile.text);
		mFloors = mHouseRes.FloorTable.Count;
		mRadius = mHouseRes.FloorRadius;
		if (mHouseRes.FloorTable.ContainsKey(2))
		{
			mHeight = mHouseRes.FloorTable[2].Height;
		}
	}
	gridFactory.createHelpGrids(mFloors, mRadius, mHeight);
	InitData(mHouseRes.FloorTable);
	showDownStairs();
}
//--------------------------------------------------
// 根据xml初始格子墙壁
private function InitData(floors : Hashtable) : void
{
	for (var kv : DictionaryEntry in floors)
	{
		InitGrid(kv.Key, kv.Value.Grids);
		InitWall(kv.Key, kv.Value.Walls);
	}
}
//--------------------------------------------------
// 初始格子
private function InitGrid(floor : int, Grids : Array) : void
{
	for (var i:int=0; i<Grids.Count; ++i)
	{
		var go : GameObject = gridFactory.getHelpGrid(floor, Grids[i].X, Grids[i].Z);
		if (null == go)
			continue;
		
		var grid : Grid = go.GetComponent("Grid");
		var gridType : GridType = dataCenter.GetGridType(Grids[i].Type);
		grid.SetGrid(gridType, Grids[i].Room);
		var gp : GridProperty = go.GetComponent("GridProperty");
		gp.param1 = Grids[i].Param1;
	}
}
//--------------------------------------------------
// 初始墙壁
private function InitWall(floor : int, Walls : Array) : void
{
	for (var i:int=0; i<Walls.Count; ++i)
	{
		wallFactory.Create(floor, Walls[i].X0, Walls[i].Z0, Walls[i].X1, Walls[i].Z1);
	}
}
//--------------------------------------------------
function OnGUI()
{
	showSetGridsUI();
	showUpDownUI();
	showSaveUI();
}
//--------------------------------------------------
// 显示格子数界面
private function showSetGridsUI() : void
{
	GUI.Label(Rect(10, 15, 70, 20), "楼层数: ");
	var floors : String = GUI.TextField(Rect(85, 15, 40, 20), mFloors.ToString());
	if ("" != floors)
	{
		mFloors = Convert.ToInt32(floors);
	}
	GUI.Label(Rect(10, 40, 70, 20), "半径数: ");
	var radius : String = GUI.TextField(Rect(85, 40, 40, 20), mRadius.ToString());
	if ("" != radius)
	{
		mRadius = Convert.ToInt32(radius);
	}
	GUI.Label(Rect(10, 65, 70, 20), "楼层高度: ");
	var height : String = GUI.TextField(Rect(85, 65, 40, 20), mHeight.ToString());
	if ("" != height)
	{
		mHeight = Convert.ToSingle(height);
	}
	if (GUI.Button(Rect(15, 90, 100, 20), "清除辅助网格"))
	{
		gridFactory.destroyHelpGrids();
		wallFactory.destroyWalls();
	}
	if (GUI.Button(Rect(15, 115, 100, 20), "生成辅助网格"))
	{
		if (("" == floors) || ("" == radius) || ("" == height))
			return;
		
		// 已经有格子和墙壁,不能再创建,除非先清除(通过点击"清除辅助网格"按钮)
		if ((false == gridFactory.isEmpty()) || (false == wallFactory.isEmpty()))
			return;
		
		gridFactory.createHelpGrids(mFloors, mRadius, mHeight);
		InitData(mHouseRes.FloorTable);
		showDownStairs();
	}
}
//--------------------------------------------------
// 显示切换楼上楼下按钮
private function showUpDownUI() : void
{
	if (GUI.Button(Rect(15, 140, 100, 20), "楼上楼下"))
	{
		if (1 == mCurFloor)			// 显示二楼
		{
			mCurFloor = 2;
			showUpStairs();
			Camera.main.transform.position.y += mHeight;
		}
		else if (2 == mCurFloor)	// 显示一楼
		{
			mCurFloor = 1;
			showDownStairs();
			Camera.main.transform.position.y -= mHeight;
		}
	}
}
//--------------------------------------------------
// 显示保存界面
private function showSaveUI() : void
{
	if (GUI.Button(Rect(15, 165, 100, 20), "保存"))
	{
		save();
	}
}
//--------------------------------------------------
// 显示一楼
private function showDownStairs() : void
{
	gridFactory.setHelpGridsVisible(2, false);
	wallFactory.setWallsVisible(2, false);
	gridFactory.setHelpGridsVisible(1, true);
	wallFactory.setWallsVisible(1, true);
}
//--------------------------------------------------
// 显示二楼
private function showUpStairs() : void
{
	gridFactory.setHelpGridsVisible(1, false);
	wallFactory.setWallsVisible(1, false);
	gridFactory.setHelpGridsVisible(2, true);
	wallFactory.setWallsVisible(2, true);
}
//--------------------------------------------------
// 保存
private function save() : void
{
	// 没有场景
	if (null == HouseObject)
	{
		Debug.LogWarning("There isn't operate to save!");
		return;
	}
	var path : String = Application.dataPath + "/";
	var filename : String = "";
	// 没有对于的xml文件,创建新文件
	if (null == HouseResFile)
	{
		var res_obj_str : String = AssetDatabase.GetAssetPath(HouseObject);
		res_obj_str = res_obj_str.Replace("Assets/", "");
		res_obj_str = res_obj_str.Substring(0, res_obj_str.Length - 4);
		filename = path + res_obj_str + ".xml";
		mHouseResWriter.createXml(filename, mFloors, mRadius);
		Debug.Log("Create xml file '" + filename + "'!");
	}
	else
	{
		var res_file_str : String = AssetDatabase.GetAssetPath(HouseResFile);
		filename = path + res_file_str.Replace("Assets/", "");
	}
	write(filename);
}
//--------------------------------------------------
// 写文件
private function write(filename : String) : void
{
	Debug.Log("Start to write file '" + filename + "'!");
	var hr : HouseRes = new HouseRes();
	for (var f:int=1; f<=mFloors; ++f)
	{
		var hlr : HouseFloorRes = new HouseFloorRes();
		hlr.No = f;
		hlr.Height = (f - 1) * mHeight;
		hlr.Grids = gridFactory.getHouseGridsRes(f);
		hlr.Walls = wallFactory.getHouseWallsRes(f);
		
		hr.FloorTable.Add(f, hlr);
	}
	hr.FloorRootNO = 1;
	hr.FloorRadius = mRadius;
	mHouseResWriter.write(filename, hr);
}
//--------------------------------------------------


