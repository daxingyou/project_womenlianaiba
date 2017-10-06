/*--------------------------------------------------
描述房屋各类资源(2012/5/24 modify by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast


// 房屋楼层资源
class HouseFloorRes
{
	var No : int = 0;						// 房屋楼层编号
	var Height : float = 0.0f;				// 房屋楼层高度
	var Grids : Array = new Array();		// 房屋楼层格子
	var Walls : Array = new Array();		// 房屋楼层墙壁
}

// 房屋墙壁资源
class HouseWallRes
{
	var X0 : int = 0;
	var Z0 : int = 0;
	var X1 : int = 0;
	var Z1 : int = 0;
}

// 房屋格子资源
class HouseGridRes
{
	var Type : int = 0;							// 网格类型
	var X : int = 0;							// 网格在楼层中的X编号
	var Z : int = 0;							// 网格在楼层中的Z编号
	var Room : int = 0;							// 网格所属房间编号
	var Param1 : String = "";					// 网格附带的参数,目前是用于对应传送网格
}

// 房屋部件资源
class HouseComponenetRes
{
	var Name : String = "";						// 名字, 唯一标识
	var IsFrame : boolean = false;				// 是否是框架部件
	var CompId : int = 0;						// 普通部件对应house_comp.xml表的id
	var ItemId : int = 0;						// 对应的物品总表的id
	var Floor : int = 0;						// 摆放的楼层id
	var Room : int = 0;							// 摆放的房间id
	var X : int = 0;							// 摆放物件中心格子对应楼层格子的X编号
	var Z : int = 0;							// 摆放物件中心格子对应楼层格子的Z编号
	var Face : int = 0;							// 摆放物件的朝向
	var Bottom : float = 0;						// 摆放底部的高度
	var InstId : UInt64 = 0;					// 实例id
	var Property : ArrayList = new ArrayList();	// 属性
}

// 穿透光资源
class PassLightRes
{
	var pos : Vector3 = Vector3.zero;			// 光源位置
	var dColor : Vector3 = Vector3.zero;		// 白天灯光颜色
	var dInte : float = 0.0f;					// 白天灯光强度
	var dRange : float = 0.0f;					// 白天灯光范围
	var nColor : Vector3 = Vector3.zero;		// 晚上灯光颜色
	var nInte : float = 0.0f;					// 晚上灯光强度
	var nRange : float = 0.0f;					// 晚上灯光范围
	var floor : int = 0;						// 楼层编号
	var room : int = 0;							// 房屋编号
}

// 方向光资源
class DirectLightRes
{
	var pos : Vector3 = Vector3.zero;			// 光源位置
	var dir : Vector3 = Vector3.zero;			// 光源方向
	var dColor : Vector3 = Vector3.zero;		// 白天灯光颜色
	var dInte : float = 0.0f;					// 白天灯光强度
	var nColor : Vector3 = Vector3.zero;		// 晚上灯光颜色
	var nInte : float = 0.0f;					// 晚上灯光强度
	var floor : int = 0;						// 楼层编号
	var room : int = 0;							// 房屋编号
}

// 聚光资源
class SpotLightRes
{
	var pos : Vector3 = Vector3.zero;			// 光源位置
	var dir : Vector3 = Vector3.zero;			// 光源方向
	var dColor : Vector3 = Vector3.zero;		// 白天灯光颜色
	var dInte : float = 0.0f;					// 白天灯光强度
	var dRange : float = 0.0f;					// 白天灯光范围
	var dAngle : int = 0;						// 白天聚光角度
	var nColor : Vector3 = Vector3.zero;		// 晚上灯光颜色
	var nInte : float = 0.0f;					// 晚上灯光强度
	var nRange : float = 0.0f;					// 晚上灯光范围
	var nAngle : int = 0;						// 晚上聚光角度
	var floor : int = 0;						// 楼层编号
	var room : int = 0;							// 房屋编号
}

// 房屋资源
class HouseRes
{
	var FloorHouseResMap : Hashtable = new Hashtable();				// 楼层资源集合
	var PassLightResList : Array = new Array();						// 穿透光资源集合
	var DirectLightResList : Array = new Array();					// 方向光资源集合
	var SpotLightResList : Array = new Array();						// 聚光资源集合
	var FloorRootNO : int = 0;										// 房屋的起始层编号
	//--------------------------------------------------
	// 从xml文件解析
	public function LoadFromString(xmlStr : String) : void
	{
		var parser : XMLParser = new XMLParser();
		var nroot : XMLNode = parser.Parse(xmlStr);
		
		// 穿透光
		var nPassLights : XMLNodeList = nroot.GetNodeList("House>0>PassLights>0>PassLight");
		if (nPassLights)
		{
			ProcessPassLights(nPassLights);
		}
		// 方向光
		var nDirectLights : XMLNodeList = nroot.GetNodeList("House>0>PassLights>0>DirectLight");
		if (nDirectLights)
		{
			ProcessDirectLights(nDirectLights);
		}
		// 聚光
		var nSpotLights : XMLNodeList = nroot.GetNodeList("House>0>SpotLights>0>SpotLight");
		if (nSpotLights)
		{
			ProcessSpotLights(nSpotLights);
		}
		// 楼层
		var nfloors : XMLNodeList = nroot.GetNodeList("House>0>Floors>0>Floor");
		if (nfloors)
		{
			ProcessFloors(nfloors);
		}
		// 房屋起始层编号
		FloorRootNO = ParseInt(nroot.GetValue("House>0>Floors>0>@rootNO"));
	}
	//--------------------------------------------------
	// 从house_furniture解析家具
	public static function ConvertFromHouseFurniture(hf : house_furniture) : HouseComponenetRes
	{
		var hcr : HouseComponenetRes = new HouseComponenetRes();
		hcr.Name = "HCOMP_" + hcr.GetHashCode().ToString("X");
		hcr.IsFrame = false;
		// 不能直接调用hf.template_id,必须这样处理,才能保证资源总是最新的
		hcr.CompId = ResManager.LgtMgr.getItemRow(hf.item_tempid).sub_id;
		hcr.ItemId = hf.item_tempid;
		hcr.Floor = hf.floor;
		hcr.X = hf.x;
		hcr.Z = hf.z;
		hcr.Face = hf.face;
		hcr.Bottom = hf.height;
		hcr.InstId = hf.instance_id;
		hcr.Property = hf.property;
		var grid : HouseSceneGrid = EQSceneManager.getSingleton().HouseSceneObj.getGrid(hf.floor, hf.x, hf.z);
		if (null == grid)
			throw "HouseRes.js -> ConvertFromHouseFurniture() -> furniture id: "+hf.template_id+", floor: "+hf.floor+", x: "+hf.x+", z: "+hf.z;
		
		hcr.Room = grid.Room;
		return hcr;
	}
	//--------------------------------------------------
	// 从XML表格解析
	public static function ConvertFromXmlString(xmlStr : String) : Array
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(xmlStr);
		
		var hcrArr : Array = new Array();
		for (var row : Hashtable in dt.Table)
		{
			var hcr : HouseComponenetRes = new HouseComponenetRes();
			hcr.Name = "HCOMP_" + hcr.GetHashCode().ToString("X");
			hcr.IsFrame = false;
			
			if (row.ContainsKey("id"))
				hcr.InstId = ParseInt(row["id"]);
			if (row.ContainsKey("item_id"))
			{
				hcr.ItemId = ParseInt(row["item_id"]);
				// 不能直接调用furniture_id,必须这样处理,才能保证资源总是最新的
				hcr.CompId = ResManager.LgtMgr.getItemRow(hcr.ItemId).sub_id;
			}
			if (0 == hcr.CompId && row.ContainsKey("furniture_id"))
			{
				hcr.CompId = ParseInt(row["furniture_id"]);
			}
			if (row.ContainsKey("flr"))
				hcr.Floor = ParseInt(row["flr"]);
			if (row.ContainsKey("x"))
				hcr.X = ParseInt(row["x"]);
			if (row.ContainsKey("z"))
				hcr.Z = ParseInt(row["z"]);
			if (row.ContainsKey("face"))
				hcr.Face = ParseInt(row["face"]);
			if (row.ContainsKey("height"))
				hcr.Bottom = ParseFloat(row["height"]);
			
			var grid : HouseSceneGrid = EQSceneManager.getSingleton().HouseSceneObj.getGrid(hcr.Floor, hcr.X, hcr.Z);
			if (null == grid)
				throw "HouseRes.js -> ConvertFromXmlString() -> furniture id: "+hcr.CompId+", floor: "+hcr.Floor+", x: "+hcr.X+", z: "+hcr.Z;
			
			hcr.Room = grid.Room;
			hcrArr.Add(hcr);
		}
		return hcrArr;
	}
	//--------------------------------------------------
	// 处理穿透光
	private function ProcessPassLights(nodes : XMLNodeList) : void
	{
		for (var n : XMLNode in nodes)
		{
			var plr : PassLightRes = new PassLightRes();
			plr.pos = ParserVector3(n["@pos"], " ");
			plr.dColor = ParserVector3(n["@dColor"], " ");
			plr.dInte = float.Parse(n["@dInte"]);
			plr.dRange = float.Parse(n["@dRange"]);
			plr.nColor = ParserVector3(n["@nColor"], " ");
			plr.nInte = float.Parse(n["@nInte"]);
			plr.nRange = float.Parse(n["@nRange"]);
			plr.room = int.Parse(n["@room"]);
			plr.floor = 1;
			if (null != n["@floor"])
			{
				plr.floor = int.Parse(n["@floor"]);
			}
			PassLightResList.Add(plr);
		}
	}
	//--------------------------------------------------
	// 处理方向光
	private function ProcessDirectLights(nodes : XMLNodeList) : void
	{
		for (var n : XMLNode in nodes)
		{
			var dlr : DirectLightRes = new DirectLightRes();
			dlr.pos = ParserVector3(n["@pos"], " ");
			dlr.dir = ParserVector3(n["@dir"], " ");
			dlr.dColor = ParserVector3(n["@dColor"], " ");
			dlr.dInte = float.Parse(n["@dInte"]);
			dlr.nColor = ParserVector3(n["@nColor"], " ");
			dlr.nInte = float.Parse(n["@nInte"]);
			dlr.room = int.Parse(n["@room"]);
			dlr.floor = int.Parse(n["@floor"]);
			
			DirectLightResList.Add(dlr);
		}
	}
	//--------------------------------------------------
	// 处理聚光
	private function ProcessSpotLights(nodes : XMLNodeList) : void
	{
		for (var n : XMLNode in nodes)
		{
			var slr : SpotLightRes = new SpotLightRes();
			slr.pos = ParserVector3(n["@pos"], " ");
			slr.dir = ParserVector3(n["@dir"], " ");
			slr.dColor = ParserVector3(n["@dColor"], " ");
			slr.dInte = float.Parse(n["@dInte"]);
			slr.dRange = float.Parse(n["@dRange"]);
			slr.dAngle = int.Parse(n["@dAngle"]);
			slr.nColor = ParserVector3(n["@nColor"], " ");
			slr.nInte = float.Parse(n["@nInte"]);
			slr.nRange = float.Parse(n["@nRange"]);
			slr.nAngle = int.Parse(n["@nAngle"]);
			slr.room = int.Parse(n["@room"]);
			slr.floor = int.Parse(n["@floor"]);
			
			SpotLightResList.Add(slr);
		}
	}
	//--------------------------------------------------
	// 处理楼层
	private function ProcessFloors(nodes : XMLNodeList) : void
	{
		for (var n : XMLNode in nodes)
		{
			var floor : HouseFloorRes = new HouseFloorRes();
			floor.No = ParseInt(n["@NO"]);
			floor.Height = ParseFloat(n["@height"]);
			//
			var ngrids : XMLNodeList = n.GetNodeList("Grids>0>Grid");
			ProcessGrids(ngrids, floor);
			//
			var nwalls : XMLNodeList = n.GetNodeList("Walls>0>Wall");
			ProcessWalls(nwalls, floor);
			//
			FloorHouseResMap.Add(floor.No, floor);
		}
	}
	//--------------------------------------------------
	// 处理格子
	private function ProcessGrids(nodes : XMLNodeList, floor : HouseFloorRes) : void
	{
		for (var n : XMLNode in nodes)
		{
			var grid : HouseGridRes = new HouseGridRes();
			grid.Type = ParseInt(n["@type"]);
			grid.Room = ParseInt(n["@room"]);
			grid.X = ParseInt(n["@x"]);
			grid.Z = ParseInt(n["@z"]);
			grid.Param1 = n["@param1"];
			floor.Grids.Add(grid);
		}
	}
	//--------------------------------------------------
	// 处理墙壁
	private function ProcessWalls(nodes : XMLNodeList, floor : HouseFloorRes) : void
	{
		for (var n : XMLNode in nodes)
		{
			var wall : HouseWallRes = new HouseWallRes();
			wall.X0 = ParseInt(n["@x0"]);
			wall.Z0 = ParseInt(n["@z0"]);
			wall.X1 = ParseInt(n["@x1"]);
			wall.Z1 = ParseInt(n["@z1"]);
			floor.Walls.Add(wall);
		}
	}
	//--------------------------------------------------
	// 检查进制
	private static function CheckStrVType(v : String) : int
	{
		if (-1 != v.IndexOf("X"))
			return 16;
		
		return 10;
	}
	//--------------------------------------------------
	// 解析整型
	private static function ParseInt(str : String) : int
	{
		if (null == str || 0 == str.Length)
			return 0;
		
		if (10 == CheckStrVType(str))
			return int.Parse(str);
		
		return int.Parse(str.Replace("X", ""), NumberStyles.HexNumber);
	}
	//--------------------------------------------------
	// 解析浮点型
	private static function ParseFloat(str : String) : float
	{
		if (null == str || 0 == str.Length)
			return 0.0f;
		
		return float.Parse(str);
	}
	//--------------------------------------------------
	// 解析Vector3
	private static function ParserVector3(str : String, spt : String) : Vector3
	{
		var split : String[] = str.Split(spt[0]);
		return new Vector3(float.Parse(split[0]), float.Parse(split[1]), float.Parse(split[2]));
	}
	//--------------------------------------------------
}


