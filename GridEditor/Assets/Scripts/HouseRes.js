import System.Xml;


// 穿透光资源
class PassLightRes
{
	var pos : Vector3 = Vector3.zero;
	var dColor : Vector3 = Vector3.zero;
	var dInte : float = 0.0f;
	var dRange : float = 0.0f;
	var nColor : Vector3 = Vector3.zero;
	var nInte : float = 0.0f;
	var nRange : float = 0.0f;
	var room : int = 0;
}


// 楼层资源
class HouseFloorRes
{
	var No : int = 0;						// 楼层编号
	var Height : float = 0.0f;				// 楼层高度
	var Grids : Array = new Array();		// 格子
	var Walls : Array = new Array();		// 墙壁
}


// 格子资源
class HouseGridRes
{
	var Type : int = 0;						// 网格类型
	var X : int = 0;						// X轴坐标
	var Z : int = 0;						// Z轴坐标
	var Room : int = 0;						// 网格所属房间编号
	var Param1 : String = "";				// 连接格子的参数,目前只用于传送点格子,用来连接其他具有这个参数值的格子
}


// 墙壁资源
class HouseWallRes
{
	var X0 : int = 0;
	var Z0 : int = 0;
	var X1 : int = 0;
	var Z1 : int = 0;
}


// 房屋资源
class HouseRes
{
	var PassLightArray : Array = new Array();			// 穿透光
	var FloorTable : Hashtable = new Hashtable();		// 楼层
	var FloorRootNO : int = 0;							// 房屋的起始层编号
	var FloorRadius : int = 0;							// 房屋的楼层半径格子数
	//--------------------------------------------------
	// 加载xml文件
	function LoadFromString(xmlStr : String)
	{
		var parser : XMLParser = new XMLParser();
		var n_root : XMLNode = parser.Parse(xmlStr);
		// passLight
		var n_passLights : XMLNodeList = n_root.GetNodeList("House>0>PassLights>0>PassLight");
		if (null != n_passLights)
		{
			processPassLights(n_passLights);
		}
		// floors
		var n_floors : XMLNodeList = n_root.GetNodeList("House>0>Floors>0>Floor");
		if (null != n_floors)
		{
			processFloors(n_floors);
		}
		// floor num
		var n_rootNO : String = n_root.GetValue("House>0>Floors>0>@rootNO");
		if (null != n_rootNO)
		{
			FloorRootNO = parseInt(n_rootNO);
		}
		// floor radius
		var n_raidus : String = n_root.GetValue("House>0>Floors>0>@radius");
		if (null != n_raidus)
		{
			FloorRadius = parseInt(n_raidus);
		}
	}
	//--------------------------------------------------
	// 解析穿透光
	private function processPassLights(nodes : XMLNodeList) : void
	{
		for (var n : XMLNode in nodes)
		{
			var pl : PassLightRes = new PassLightRes();
			pl.pos = parserVector3(n["@pos"], " ");
			pl.dColor = parserVector3(n["@dColor"], " ");
			pl.dInte = float.Parse(n["@dInte"]);
			pl.dRange = float.Parse(n["@dRange"]);
			pl.nColor = parserVector3(n["@nColor"], " ");
			pl.nInte = float.Parse(n["@nInte"]);
			pl.nRange = float.Parse(n["@nRange"]);
			pl.room = int.Parse(n["@room"]);
			PassLightArray.Add(pl);
		}
	}
	//--------------------------------------------------
	// 解析楼层
	private function processFloors(nodes : XMLNodeList) : void
	{
		for (var n : XMLNode in nodes)
		{
			var floor : HouseFloorRes = new HouseFloorRes();
			floor.No = parseInt(n["@NO"]);
			floor.Height = parseFloat(n["@height"]);
			FloorTable.Add(floor.No, floor);
			// 格子
			var n_grids : XMLNodeList = n.GetNodeList("Grids>0>Grid");
			processGrids(n_grids, floor);
			// 墙壁
			var n_walls : XMLNodeList = n.GetNodeList("Walls>0>Wall");
			processWalls(n_walls, floor);
		}
	}
	//--------------------------------------------------
	// 解析格子
	private function processGrids(nodes : XMLNodeList, floor : HouseFloorRes) : void
	{
		for (var n : XMLNode in nodes)
		{
			var grid : HouseGridRes = new HouseGridRes();
			grid.Type = parseInt(n["@type"]);
			grid.Room = parseInt(n["@room"]);
			grid.X = parseInt(n["@x"]);
			grid.Z = parseInt(n["@z"]);
			grid.Param1 = n["@param1"];
			floor.Grids.Add(grid);
		}
	}
	//--------------------------------------------------
	// 解析墙壁
	private function processWalls(nodes : XMLNodeList, floor : HouseFloorRes) : void
	{
		for (var n : XMLNode in nodes)
		{
			var wall : HouseWallRes = new HouseWallRes();
			wall.X0 = parseInt(n["@x0"]);
			wall.Z0 = parseInt(n["@z0"]);
			wall.X1 = parseInt(n["@x1"]);
			wall.Z1 = parseInt(n["@z1"]);
			floor.Walls.Add(wall);
		}
	}
	//--------------------------------------------------
	// 解析Vector3
	private function parserVector3(str : String, spt : String) : Vector3
	{
		var split : String[] = str.Split(spt[0]);
		if (split.Length < 3)
			return Vector3.zero;
		
		return new Vector3(float.Parse(split[0]), float.Parse(split[1]), float.Parse(split[2]));
	}
	//--------------------------------------------------
}


