/***************************************************
*** 墙壁工厂(2012/8/15 modify by hezhr)
***************************************************/



private static var mInstance : WallFactory = null;				// 实例
private var mWalls : GameObject = null;							// 下面挂接所有的辅助墙壁
private var mWallTable : Hashtable = new Hashtable();			// 保存所有墙壁
private var mStartObj : GameObject;								// 鼠标点下的开始对象
private var mEndObj : GameObject;								// 鼠标点下的结束对象
public var wall : GameObject;
public var gridFactory : GridFactory;
public var operateMgr : OperateMgr;


//--------------------------------------------------
function Awake()
{
	mInstance = this;
}
//--------------------------------------------------
function Start()
{
	mWalls = new GameObject();
	mWalls.name = "Walls";
}
//--------------------------------------------------
public static function getInstance() : WallFactory
{
	return mInstance;
}
//--------------------------------------------------
function Update()
{
	if (operateMgr.operate != OperateType.Wall)
		return;
	
	var ray : Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	var hit : RaycastHit;
	GetStartObject(ray, hit);
	GetEndObject(ray, hit);
}
//--------------------------------------------------
// 获取鼠标点下的开始对象
private function GetStartObject(ray : Ray, hit : RaycastHit) : void
{
	if (Input.GetMouseButtonDown(0))
	{
		if (Physics.Raycast(ray, hit, 10000))
		{
		    mStartObj = hit.transform.gameObject;
		}
	}
}
//--------------------------------------------------
// 获取鼠标点下的结束对象
private function GetEndObject(ray : Ray, hit : RaycastHit) : void
{
	if (Input.GetMouseButtonUp(0))
	{
		if (Physics.Raycast(ray, hit, 10000))
		{
			mEndObj = hit.transform.gameObject;
		}
		if ((null != mStartObj) && (null != mEndObj) && (mStartObj != mEndObj) && CanCreate(mStartObj, mEndObj))
		{
			var wallObj : GameObject = getWall(mStartObj, mEndObj);
			if (null == wallObj)
			{
				var gp1 : GridProperty = mStartObj.GetComponent("GridProperty");
				var gp2 : GridProperty = mEndObj.GetComponent("GridProperty");
				Create(gp1.index.floor, gp1.index.x, gp1.index.z, gp2.index.x, gp2.index.z);
			}
			else
			{
				GameObject.Destroy(wallObj);
			}
		}
		
		mStartObj = null;
		mEndObj = null;
	}
}
//--------------------------------------------------
// 是否可以创建墙壁
private function CanCreate(startObject : GameObject, endObject : GameObject) : boolean
{
	var gp1 : GridProperty = startObject.GetComponent("GridProperty");
	var gp2 : GridProperty = endObject.GetComponent("GridProperty");
	var diffx : int = gp1.index.x - gp2.index.x;
	var diffz : int = gp1.index.z - gp2.index.z;
	return (diffx == 0 && (Mathf.Abs(diffz) == 1 || Mathf.Abs(diffz) == 3)) || ((Mathf.Abs(diffx) == 1 || Mathf.Abs(diffx) == 3) && diffz == 0);
}
//--------------------------------------------------
// 创建墙壁
private function CreateWall(go1 : GameObject, go2 : GameObject, positionX0 : float, positionZ0 : float, positionX1 : float, positionZ1 : float, width : float, height : float, pare : GameObject) : GameObject
{
	var go : GameObject = null;
	if (positionX0 == positionX1)
	{
		if (positionZ0 > positionZ1)
			go = Instantiate(wall, Vector3(positionX1, wall.transform.position.y + height, positionZ1 + width), wall.transform.rotation);
		else
			go = Instantiate(wall, Vector3(positionX1, wall.transform.position.y + height, positionZ1 - width), wall.transform.rotation);
	}
	else if (positionZ0 == positionZ1)
	{
		var relativePos = go1.transform.position - go2.transform.position;
		var rotation = Quaternion.LookRotation(relativePos);
		if (positionX0 > positionX1)
			go = Instantiate(wall, Vector3(positionX1 + width, wall.transform.position.y + height, positionZ1), rotation);
		else
			go = Instantiate(wall, Vector3(positionX1 - width, wall.transform.position.y + height, positionZ1), rotation);
	}
	if (go && pare)
	{
		go.transform.parent = pare.transform;
	}
	return go;
}
//--------------------------------------------------
// 创建墙壁
public function Create(floor : int, x0 : int, z0 : int, x1 : int, z1 : int) : void
{
	var go1 : GameObject = gridFactory.getHelpGrid(floor, x0, z0);
	var go2 : GameObject = gridFactory.getHelpGrid(floor, x1, z1);
	if ((null == go1) || (null == go2))
		return;
	
	var gp : GridProperty = go1.GetComponent("GridProperty");
	var floorObj : GameObject = null;
	var floorName : String = "Walls_Floor_" + floor.ToString();
	if (mWallTable.ContainsKey(floor))
	{
		floorObj = GameObject.Find(floorName);
	}
	else
	{
		floorObj = new GameObject();
		floorObj.name = floorName;
		floorObj.transform.parent = mWalls.transform;
		mWallTable.Add(floor, floorObj);
	}
	var go : GameObject = CreateWall(go1, go2, go1.transform.position.x, go1.transform.position.z, go2.transform.position.x, go2.transform.position.z, 0.40f, gp.index.height, floorObj);
	SetName(go, x0, z0, x1, z1);
	SetProperty(go, floor, x0, z0, x1, z1);
}
//--------------------------------------------------
// 设置墙壁的属性
private function SetProperty(go : GameObject, floor : int, x0 : int, z0 : int, x1 : int, z1 : int) : void
{
	var wp : Wall = go.GetComponent("Wall");
	wp.isUse = true;
	wp.floor = floor;
	wp.x0 = x0;
	wp.z0 = z0;
	wp.x1 = x1;
	wp.z1 = z1;
}
//--------------------------------------------------
// 设置名字
private function SetName(go : GameObject, x0 : int, z0 : int, x1 : int, z1 : int) : void
{
	go.name = "(" + x0 + ", " + z0 + ")(" + x1 + ", " + z1 + ")";
}
//--------------------------------------------------
// 删除所有墙壁
public function destroyWalls() : void
{
	for (var wallObj : GameObject in mWallTable.Values)
	{
		GameObject.Destroy(wallObj);
	}
	mWallTable.Clear();
}
//--------------------------------------------------
// 显示/隐藏楼层墙壁
public function setWallsVisible(floor : int, visible : boolean) : void
{
	if (mWallTable.ContainsKey(floor))
	{
		mWallTable[floor].SetActiveRecursively(visible);
	}
}
//--------------------------------------------------
// 获取墙壁
private function getWall(startObj : GameObject, endObj : GameObject) : GameObject
{
	var gp1 : GridProperty = startObj.GetComponent("GridProperty");
	var gp2 : GridProperty = endObj.GetComponent("GridProperty");
	for (var wallObj : GameObject in mWallTable.Values)
	{
		for (var trans : Transform in wallObj.GetComponentsInChildren(Transform, true))
		{
			var wp : Wall = trans.gameObject.GetComponent("Wall");
			if (wp && wp.floor == gp1.index.floor && 
						((wp.x0 == gp1.index.x && wp.z0 == gp1.index.z && wp.x1 == gp2.index.x && wp.z1 == gp2.index.z) || 
			    		 (wp.x0 == gp2.index.x && wp.z0 == gp2.index.z && wp.x1 == gp1.index.x && wp.z1 == gp1.index.z)))
			{
				return trans.gameObject;
			}
		}
	}
	return null;
}
//--------------------------------------------------
// 获取墙壁信息
public function getHouseWallsRes(floor : int) : Array
{
	var arr : Array = new Array();
	if (false == mWallTable.ContainsKey(floor))
	{
		Debug.LogWarning("WallFactory -> getHouseWallsRes(int) -> not exist floor = " + floor);
		return arr;
	}
	for (var trans : Transform in mWallTable[floor].GetComponentsInChildren(Transform, true))
	{
		var w : Wall = trans.gameObject.GetComponent("Wall");
		if (null == w)
			continue;
		
		var hwr : HouseWallRes = new HouseWallRes();
		hwr.X0 = w.x0;
		hwr.Z0 = w.z0;
		hwr.X1 = w.x1;
		hwr.Z1 = w.z1;
		arr.Add(hwr);
	}
	return arr;
}
//--------------------------------------------------
// 是否有墙壁
public function isEmpty() : boolean
{
	return 0 == mWallTable.Count;
}
//--------------------------------------------------


