/*--------------------------------------------------
房屋部件(2012/5/25 modify by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast



class HouseSceneComponent extends SceneObject
{
	public var InstId : UInt64 = 0;								// 实例id
	public var Uid : int = 0;									// 唯一标识(每次进入游戏都不一样)
	public var CompId : int = 0;								// 部件id,对应house_comp.xml表的id
	public var ItemId : int = 0;								// 物品id,对应item_tplt.xml表的id
	public var FloorNo : int = 0;								// 楼层编号
	public var RoomNo : int = 0;								// 房间编号
	public var Face : int = 0;									// 朝向(0,朝x轴;1,朝-z轴;2,朝-x轴;3,朝z轴)
	public var X : int = 0;										// 部件中心格子对应楼层格子的X编号
	public var Z : int = 0;										// 部件中心格子对应楼层格子的Z编号
	public var Height : float = 0.0f;							// 摆放底部高度
	public var IsFrame : boolean = false;						// 是否为框架部件,默认为false
	public var CompPropRow : HouseCompPropRow = null;			// 部件属性,对应house_comp_prop.xml
	public var CompRow : HouseCompRow = null;					// 部件信息,对应house_comp.xml
	public var ModelObj : GameObject = null;					// 模型物件
	public var Property : ArrayList = new ArrayList();			// 属性
	
	public var HoldBox : Int2AABBBox = new Int2AABBBox();		// 占据格的box
	public var HoldGrids : Array = new Array();					// 占据网格数组
	public var HoldZone : Array = new Array();					// 物件占据的区域
	public var Lights : Array = new Array();					// 携带光源
	
	private var mLoaded : boolean = false;						// 是否已加载,默认为false
	private var mVisible : boolean = true;						// 是否显示
	//--------------------------------------------------
	// 构造函数
	public function HouseSceneComponent(uid : int)
	{
		Uid = uid;
		GameObj = new GameObject();	// 家具根节点,下面挂接模型节点(2011/12/16 modify by hezhr)
	}
	//--------------------------------------------------
	// 销毁
	public function Destroy() : void
	{
		// step1: 销毁光源
		for (var zl : ZoneLight in Lights)
		{
			zl.Destroy();
		}
		Lights.Clear();
		// step2: 销毁之前先取消摆放
		unLay();
		// step3: 销毁模型
		super.Destroy();
	}
	//--------------------------------------------------
	// 底部(y方向)
	public function getBottom() : float
	{
		if (0.0f != CompPropRow.OffsetHeight)
			return CompPropRow.OffsetHeight;
		
		return Height;
	}
	//--------------------------------------------------
	// 顶部(y方向) 
	public function getTop() : float
	{
		return getBottom() + CompPropRow.SelfHeight;
	}
	//--------------------------------------------------
	// 是否靠墙物件
	public function isLayWallObject() : boolean
	{
		return (0 != CompPropRow.HoldType);
	}
	//--------------------------------------------------
	// 是否放置在网格上
	public function isLayed() : boolean
	{
		return (null != getAttachGrid());
	}
	//--------------------------------------------------
	// 获取占据网格
	public function getAttachGrid() : HouseSceneGrid
	{
		var idx : int = HoldBox.linearIndex(0, 0);
		
		if ((idx < 0) || (idx >= HoldGrids.Count))
			return null;
		
		return HoldGrids[idx];
	}
	//--------------------------------------------------
	// override function,设置可见性
	public function setVisible(visible : boolean) : void
	{
		if (visible == mVisible)
			return;
		
		mVisible = visible;
		AsynCtrl.addOrProcessEvent(new HouseComponentSetVisibleEvent(visible));
	}
	function _setVisible(visible : boolean) : void
	{
		super.SetVisible(visible);
	}
	//--------------------------------------------------
	// 设置父节点
	public function setParentNode(parentNode : SceneObject) : void
	{
		SetParent(parentNode);
		//SetPosition(Vector3.zero);
		SetRotation(Quaternion.identity);
	}
	//--------------------------------------------------
	// 计算观察模式对物件的影响
	public function calcWatchMode(mode : HouseWatchMode) : void
	{
		var beWatchMode : int = CompPropRow.BeWatchMode;
		var limit : int = CompBeWatchMode.CW_MODE_LIMIT;
		var outw : int = CompBeWatchMode.CW_MODE_OUTWALL;
		
		if (beWatchMode + mode > limit)
		{
			setVisible(true);
		}
		else if (beWatchMode + mode == limit)
		{
			// 如果是外墙，计算隐藏
			if (beWatchMode == outw)
			{
				// 面对隐藏
				var cam : Camera = Camera.main;
				var nor : Vector3 = GetRotation(Space.World) * Vector3(1.0f, 0.0f, 0.0f);
				var vec : Vector3 = GetPosition(Space.World) - cam.transform.position;
				if (Vector3.Dot(vec, nor) < 0.0001f)
					setVisible(false);	//##LH		true -> false
				else
					setVisible(true);	//##LH		false -> true
			}
			else
			{
				setVisible(true);
			}
		}
		else
		{
			setVisible(false);
		}
	}
	//--------------------------------------------------
	// 分析资源
	public function parseRes(res : HouseComponenetRes) : void
	{
		if (mLoaded)
			return;
		
		InstId = res.InstId;
		CompId = res.CompId;
		ItemId = res.ItemId;
		IsFrame = res.IsFrame;
		FloorNo = res.Floor;
		RoomNo = res.Room;
		Face = res.Face;
		X = res.X;
		Z = res.Z;
		Height = res.Bottom;
		Property = res.Property;
		//
		if (IsFrame)	// 框架部件:地板,墙壁等
		{
			CompPropRow = ResManager.LgtMgr.getHouseCompPropRow(0);
			Template = res.Name;
			// 框架物件只能在一个房间
			HoldZone.Add(CommFunc.room2zone(0 != res.Room, res.Floor, res.Room));
		}
		else			// 普通部件:门,窗等
		{
			CompRow = ResManager.LgtMgr.getHouseCompRow(res.CompId);
			CompPropRow = ResManager.LgtMgr.getHouseCompPropRow(CompRow.prop_id);
			Template = CompRow.model.Remove(CompRow.model.IndexOf("."[0]));	// 去除后缀".mod.u3d"
		}
		//
		CullObj._cullLevel = CompRow.cull_level;
	}
	//--------------------------------------------------
	// 分析资源
	public function parseRes(comp_id : int, item_id : int) : void
	{
		CompId = comp_id;
		ItemId = item_id;
		CompRow = ResManager.LgtMgr.getHouseCompRow(comp_id);
		CompPropRow = ResManager.LgtMgr.getHouseCompPropRow(CompRow.prop_id);
		Template = CompRow.model.Remove(CompRow.model.IndexOf("."[0]));	// 去除后缀".mod.u3d"
		//
		var hs : HouseScene = EQSceneManager.getSingleton().HouseSceneObj;
		if (hs && hs.WalkViewFloor)
		{
			FloorNo = hs.WalkViewFloor.FloorNO;
			Height = hs.WalkViewFloor.FloorHeight;
		}
		//
		CullObj._cullLevel = CompRow.cull_level;
	}
	//--------------------------------------------------
	// 创建灯光
	public function createLight(id : int) : void
	{
		if (!ResManager.LgtMgr.WebLightTable.ContainsKey(id))
			return;
		
		var row : WebLightRow = ResManager.LgtMgr.WebLightTable[id];
		var zl : ZoneLight = new ZoneLight();
		zl.createActiveLight(row, this);
		Lights.Add(zl);
		
//		if (row.Light1)
//		{
//			zl = new ZoneLight();
//			zl.createLight(ZoneLightType.ZLT_ACTIVE, this);
//			zl.loadActiveLight(row.Light1);
//			Lights.Add(zl);
//		}
//		
//		if (row.Light2)
//		{
//			zl = new ZoneLight();
//			zl.createLight(ZoneLightType.ZLT_ACTIVE, this);
//			zl.loadActiveLight(row.Light2);
//			Lights.Add(zl);
//		}
//		
//		if (row.PassLi1)
//		{
//			zl = new ZoneLight();
//			zl.createLight(ZoneLightType.ZLT_PASS, this);
//			zl.loadPassLight(row.PassLi1);
//			Lights.Add(zl);
//		}
//		
//		if (row.PassLi2)
//		{
//			zl = new ZoneLight();
//			zl.createLight(ZoneLightType.ZLT_PASS, this);
//			zl.loadPassLight(row.PassLi2);
//			Lights.Add(zl);
//		}
	}
	//--------------------------------------------------
	// 加载(2011/11/11/ modify by hezhr)
	public function load() : void
	{
		if (mLoaded || null==GameObj)
			return;
		
		//
		CommFunc.setGameObjectLayer(GameObj, FloorNo, RoomNo);
		AsynCtrl.addOrProcessEvent(new HouseComponentModelLoadEvent(CompRow, IsFrame));
		if (false == IsFrame)	// 普通部件
		{
			GameObj.name = Template;
			// 光源
			if (CompPropRow.LightID!=0)
			{
				createLight(CompPropRow.LightID);
			}
			SetPosition(CompRow.pos);
			SetRotation(CompRow.rot);
			SetScale(CompRow.scale);
		}
		// 占据网格
		for (var info : GridInfo in CompPropRow.HoldGrid)
		{
			HoldBox.merge(info.x, info.z);
		}
		for (var i:int=0; i<HoldBox.volume(); ++i)
		{
			HoldGrids.Add(null);
		}
		
		mLoaded = true;
	}
	//--------------------------------------------------
	// 更新位置和朝向
	public function updatePosAndRot() : void
	{
		var pos : Vector3 = Vector3.zero;
		var rot : Quaternion = Quaternion.identity;
		// 设置位置和旋转(如果有逻辑高度的则不受mBottom的影响)
		if (0.0f == CompPropRow.OffsetHeight)
		{
			pos = Vector3(0.0f, Height, 0.0f);
		}
		rot = Quaternion.Euler(0.0f, 90.0 * CommFunc.ToU3DFace(Face), 0.0f);
		
		setPosAndRot(pos, rot);
	}
	//--------------------------------------------------
	// 设置位置和朝向
	public function setPosAndRot(pos : Vector3, rot : Quaternion) : void
	{
		// 设置模型的坐标
		var vec : Vector3 = Vector3.zero;
		var qua : Quaternion = Quaternion.identity;
		
		if (false == IsFrame)
		{
			vec = CompRow.pos;
			qua = CompRow.rot;
			
			//x坐标取反???????????
			//vec.x = 0 - vec.x;		//##LH
		}
		
		SetPosition(pos + rot * vec);
		SetRotation(rot * qua, Space.World);
	}
	//--------------------------------------------------
	// 取得所有格子对象
	public function calcHoldGrids(attachGrid : HouseSceneGrid, face : int) : HouseSceneGrid[]
	{	
		var hold_grids : HouseSceneGrid[];
		var floor : HouseSceneFloor = attachGrid.Creator;
		if (IsFrame)
		{
			hold_grids = [floor.RootGrid];
		}
		else
		{
			hold_grids = new HouseSceneGrid[HoldBox.volume()];
			for (var x:int=HoldBox.mXmin; x<=HoldBox.mXmax; ++x)
			{
				for (var z:int=HoldBox.mYmin; z<=HoldBox.mYmax; ++z)
				{
					var tempX : int = x;
					var tempZ : int = z;
					var rts = Int2AABBBox.rotateQuarter(tempX, tempZ, face, true);
					tempX = rts[0];
					tempZ = rts[1];
					tempX += attachGrid.X;
					tempZ += attachGrid.Z;
					hold_grids[HoldBox.linearIndex(x, z)] = floor.GetGrid(tempX, tempZ);
				}
			}
		}
		return hold_grids;
	}
	//--------------------------------------------------
	// return [boolean, boolean : forward_indoor]
	private function _checkPassLights() : System.Object[]
	{
		var result : System.Object[] = new System.Object[2];
		result[0] = false;
		result[1] = false;
		
		// 必须是靠墙物件
		if (!isLayWallObject())
			return result;
		
		// 占据网格必须是2*N
		if (0 != HoldGrids.length % 2)
			return result;
		
		// x轴正方向和反方向的第一格必须一个在室内、一个在室外(目前所有窗x轴只占两格)
		// 这里只进行(0,0)和(-1,0)或(1,0)的判断
		// 并保存正方向indoor值，即如果是(0,0)(1,0)保存(1,0)的indoor值，如果是(-1,0)(0,0)保存(0,0)的indoor值
		var forward_indoor : boolean = false;
		
		if ((HoldBox.mXmin < 0) && (HoldGrids.Count > HoldBox.linearIndex(0, 0)))
		{
			var min_grid1 : HouseSceneGrid = HoldGrids[HoldBox.linearIndex(0, 0)];
			var min_grid2 : HouseSceneGrid = HoldGrids[HoldBox.linearIndex(-1, 0)];
			forward_indoor = min_grid1.GridTypeRow.InDoor;
			if (forward_indoor == min_grid2.GridTypeRow.InDoor)
			{
				result[0] = false;
				result[1] = forward_indoor;
				return result;
			}
		}
		else if ((HoldBox.mXmax > 1) && (HoldGrids.Count > HoldBox.linearIndex(1, 0)))
		{
			var max_grid1 : HouseSceneGrid = HoldGrids[HoldBox.linearIndex(1, 0)];
			var max_grid2 : HouseSceneGrid = HoldGrids[HoldBox.linearIndex(0, 0)];
			forward_indoor = max_grid1.GridTypeRow.InDoor;
			if (forward_indoor == max_grid2.GridTypeRow.InDoor)
			{
				result[0] = false;
				result[1] = forward_indoor;
				return result;
			}
		}
		
		result[0] = true;
		result[1] = forward_indoor;
		return result;
	}
	//--------------------------------------------------
	// 拿起
	public function take() : void
	{
		unLay();
		calcWatchMode(HouseWatchMode.HW_MODE_3);
	}
	//--------------------------------------------------
	// 摆放,Face为左手坐标系旋转顺序
	public function lay(grid : HouseSceneGrid, face : int, height : float) : void
	{
		if (null == GameObj)
			return;
		
		unLay();	// 摆放之前先取消之前的摆放
		
		Height = height;
		Face = face;
		X = grid.X;
		Z = grid.Z;
		
		// 框架所在房间在parseRes时计算
		if (!IsFrame)
			RoomNo = grid.Room;
		
		// 通过格子信息来获取楼层号
		FloorNo = grid.Creator.FloorNO;
		
		// 设置层
		CommFunc.setGameObjectLayer(GameObj, FloorNo, RoomNo);
		if (ModelObj)
		{
			ModelObj.layer = GameObj.layer;
		    for (var trans : Transform in ModelObj.GetComponentsInChildren(Transform))
		    {
			    trans.gameObject.layer = ModelObj.layer;
		    }
		}
		
		// 占据网格
		var holdGrids : HouseSceneGrid[] = calcHoldGrids(grid, face);
		HoldGrids.Clear();
		for (var it : HouseSceneGrid in holdGrids)
		{
			if (it)
			{
				it.attachComponent(this);
				HoldGrids.Add(it);
			}
		}
		
		// 如果是最底下的一个
		if (grid.HouseComps.Count > 0)
		{
			if (this == grid.HouseComps[0])
			{
				// 设置阻挡属性
				var stopGrids : Array = new Array();
				CommFunc.copyGrids(CompPropRow.StopGrid, stopGrids);
				convertGrids(stopGrids, face, grid.X, grid.Z);
				
				for (var info : GridInfo in stopGrids)
				{
					var gr : HouseSceneGrid = grid.Creator.GetGrid(info.x, info.z);
					if (gr)
					{
						gr.setBlocked(true);
					}
				}
			}
		}
		
		// 加面片阴影
		// 贴地, 非框架, 非可以替换物件, 非光源
		if (0.0f == CompPropRow.OffsetHeight && 0.0f == Height && !IsFrame
			&& !CompPropRow.CanRep && 0 == CompPropRow.LightID)
		{
			//createSheetShadow();
		}
		
		SetParent(grid);
		
		// 更新位置和旋转
		updatePosAndRot();
		
		// 移除,现在设计为所有componnet都同HouseScene管理   --不移除啊
		grid.Creator.Creator.attachComponent(this);
		
		// 框架物件在load时就已经计算好了，这里只计算非框架物件
		if (!IsFrame)
		{
			// 计算物件所属房间，一般只会在一个房间，门和窗户会跨两个房间
			HoldZone.Clear();
			for (var i:int=0; i<HoldGrids.length; ++i)
			{
				var gi : HouseSceneGrid = HoldGrids[i];
				if (null == gi.GridTypeRow)
					Debug.LogWarning("=================");
				if (null == gi.Creator)
					Debug.LogWarning("*****************");
				var zone : int = CommFunc.room2zone(gi.GridTypeRow.InDoor, gi.Creator.FloorNO, gi.Room);
				var j : int;
				for (j=0; j<HoldZone.length; ++j)
				{
					if (zone == HoldZone[j])
						break;
				}
				if (j == HoldZone.length)
					HoldZone.Add(zone);
			}
		}
		
		// 加载携带光源
		if (!IsFrame && 0!=CompPropRow.LightID)
		{
			var rtns : System.Object[] = _checkPassLights();
			for (var zl : ZoneLight in Lights)
			{
				zl.setCullingMask(CommFunc.CalcLayerMask(GameObj.layer));
				
//				if (zl.Type == ZoneLightType.ZLT_PASS)
//				{
//					zl.mForwardIndoor = rtns[1];
//				}
//				
//				zl.turnOn();
			}
		}
		
		// 粒子,TODO:
		
		// 加入楼层部件管理
		if (FloorNo > 0)
		{
			var flr : HouseSceneFloor = EQSceneManager.getSingleton().HouseSceneObj.GetFloor(FloorNo);
			if (flr && 0 != RoomNo)
				flr.insertRoomComponent(RoomNo, this);
		}
		
		// 刷新可见区域
		if (EQSceneManager.getSingleton().HouseSceneObj.WalkViewFloor)
		{
			calcWatchMode(EQSceneManager.getSingleton().HouseSceneObj.GetWatchModeByFloorNO(FloorNo));
		}
	}
	//--------------------------------------------------
	// 解除摆放
	public function unLay() : void
	{
		if (!isLayed())
			return;
		
		var grid : HouseSceneGrid = getAttachGrid();
		// 如果是最底下的一个
		if (this == grid.HouseComps[0])
		{
			// 设置阻挡属性
			var stopGrids : Array = new Array();
			CommFunc.copyGrids(CompPropRow.StopGrid, stopGrids);
			convertGrids(stopGrids, Face, grid.X, grid.Z);
			
			for (var info : GridInfo in stopGrids)
			{
				var gr : HouseSceneGrid = grid.Creator.GetGrid(info.x, info.z);
				if (gr)
				{
					gr.setBlocked(false);
				}
			}
		}
		
		SetParent(null);
		
		for (var i:int=0; i<HoldGrids.length; ++i)
		{
			var hold_grid : HouseSceneGrid = HoldGrids[i];
			HoldGrids[i] = null;
			if (hold_grid)
			{
				hold_grid.detachComponent(this);
			}
		}
		
		if (!IsFrame && (0 != CompPropRow.LightID))
		{
			for (var zl : ZoneLight in Lights)
			{
				zl.setCullingMask(-1);
			}
		}
		
		// 通知
		grid.Creator.Creator.detachComponent(this);
	}
	//--------------------------------------------------
	// 根据坐标点转化格子数组
	public static function convertGrids(arr : Array, face : int, gridX : int, gridZ : int) : void
	{
		for (var info : GridInfo in arr)
		{
			var rtn = Int2AABBBox.rotateQuarter(info.x, info.z, face, true);
			info.x = rtn[0];
			info.z = rtn[1];
			
			info.x += gridX;
			info.z += gridZ;
		}
	}
	//--------------------------------------------------
	// 有光源的话,开关光源
	public function turn(on : boolean) : void
	{
		for (var zl : ZoneLight in Lights)
		{
			if (ZoneLightType.ZLT_PASS == zl.Type)
				continue;
			
			zl.turn(on);
		}
	}
	//--------------------------------------------------
}





/************************************************************************************************************************
* 房屋部件摆放逻辑 ********************************************************************************************************
*************************************************************************************************************************/
class HSCLayLogic
{
	//--------------------------------------------------
	// 在某个格子上找可以替换的物件
	public static function findCanReplaceComponent(pThis : HouseSceneComponent, grid : HouseSceneGrid) : HouseSceneComponent
	{
		if (!pThis || !grid)
			return null;
		
		for (var comp : HouseSceneComponent in grid.HouseComps)
		{
			if (comp.getAttachGrid() == grid)
			{
				if (canReplaceComponent(pThis, comp))
					return comp;
			}
		}
		
		return null;
	}
	//--------------------------------------------------
	// 判断一个物件是否能替换另一个物件
	public static function canReplaceComponent(pThis : HouseSceneComponent, comp : HouseSceneComponent) : boolean
	{
		// 此为游戏逻辑
		// 暂时先这样判断可替换与否
		
		return pThis.CompPropRow.CanRep && (pThis.CompPropRow.PropID == comp.CompPropRow.PropID);
	}
	//--------------------------------------------------
	// 能否摆放
	public static function canLay(pThis : HouseSceneComponent, grid : HouseSceneGrid, face : int) : System.Object[]
	{
		var result : System.Object[] = new System.Object[2];
		result[0] = HouseReturnValue.HRV_OK;
		result[1] = 0.0f;
		
		var height : float = 0.0f;
		
		if (pThis.isLayed())
		{
			result[0] = HouseReturnValue.HRV_LAYED;
			result[1] = height;
			return result;
		}
		
		var flr : HouseSceneFloor = grid.Creator;
		if (pThis.IsFrame)		
		{
			result[0] = HouseReturnValue.HRV_OK;
			result[1] = height;
			return result;
		}
		
		// 摆放高度默认为偏移高度
		height = pThis.CompPropRow.OffsetHeight;
		
		// 取得当前this->HoldGrid, 转换成世界GridsArray
		var holdGrid : Array = new Array();
		CommFunc.copyGrids(pThis.CompPropRow.HoldGrid, holdGrid);
		HouseSceneComponent.convertGrids(holdGrid, face, grid.X, grid.Z);
		
		// 根据this->SelfHeight + offsetHeight, 算出该Grid的最适合放置的comp
		var selfHeight : float = pThis.CompPropRow.SelfHeight;
		var ret : System.Object[] = getFirstCanLayComponent(pThis, grid);
		if (!ret[0])
		{
			result[0] = HouseReturnValue.HRV_NO_LAY_SPACE;
			result[1] = height;
			return result;
		}
		
		var comp : HouseSceneComponent = ret[1];
		if (comp)
		{
			// 如果不是悬挂物件
			if (0.0f == pThis.CompPropRow.OffsetHeight)
			{
				// 是否可放置
				if (!CommFunc.BitContains(comp.CompPropRow.AcceptLay, pThis.CompPropRow.LayType))
				{
					result[0] = HouseReturnValue.HRV_NO_MATCH_LAYTYPE;
					result[1] = height;
					return result;
				}
				
				var grid0 : HouseSceneGrid = comp.getAttachGrid();
				
				// 取出comp->LayGrid, 转换成世界GridsArray;
				var layGrid : Array = new Array();
				CommFunc.copyGrids(comp.CompPropRow.LayGrid, layGrid);
				HouseSceneComponent.convertGrids(layGrid, comp.Face, grid0.X, grid0.Z);
				
				// 保证LayGrid 包含HoldGrid
				for (var hold : GridInfo in holdGrid)
				{
					var find : boolean = false;
					for (var lay : GridInfo in layGrid)
					{
						if ((lay.x == hold.x) && (lay.z == hold.z))
						{
							find = true;
							break;
						}
					}
					if (false == find)
					{
						result[0] = HouseReturnValue.HRV_NO_GRID_LAY;
						result[1] = height;
						return result;
					}
				}		
			}
		}
		
		// 取得所有格子对象
		var gs : HouseSceneGrid[] = pThis.calcHoldGrids(grid, face);
		var p : HouseSceneGrid;
		
		// 如果holdGrid 的每个格子，在comp高度上都有空间可以容下this
		for (var i:int=0; i<gs.Length; ++i)
		{
			p = gs[i];
			if (p == grid)
				continue;
			
			if (!p)
			{
				result[0] = HouseReturnValue.HRV_NO_GRID_LAY;
				result[1] = height;
				return result;
			}
			
			var r : System.Object[] = getFirstCanLayComponent(pThis, p);
			
			if (!r[0])
			{
				result[0] = HouseReturnValue.HRV_NO_LAY_SPACE;
				result[1] = height;
				return result;
			}
			// 如果不是悬挂物件
			if (0.0f == pThis.CompPropRow.OffsetHeight)
			{
				// 只能放在同一个物件上面
				if (r[1] != comp)
				{
					result[0] = HouseReturnValue.HRV_NO_LAY_SPACE;
					result[1] = height;
					return result;
				}
			}
		}
		
		// 网格内有没有墙体阻挡(靠墙物件，允许内部有墙体)
		for (var x:int=pThis.HoldBox.mXmin; x<=pThis.HoldBox.mXmax; ++x)
		{
			for (var z:int=pThis.HoldBox.mYmin; z<=pThis.HoldBox.mYmax; ++z)
			{
				p = gs[pThis.HoldBox.linearIndex(x,z)];
				if (x != pThis.HoldBox.mXmax)
				{
					// 如果是靠墙物件，且为靠墙格子，不用检查此面墙
					if (pThis.isLayWallObject() && (pThis.HoldBox.mXmin == x))
					{
					}
					else
					{
						if (p.getWallFace(face))
						{
							result[0] = HouseReturnValue.HRV_WALL_STOP;
							result[1] = height;
							return result;
						}
					}
				}
				
				if (z != pThis.HoldBox.mYmin)
				{
					if (p.getWallFace((face + 1) % 4))
					{
						result[0] = HouseReturnValue.HRV_WALL_STOP;
						result[1] = height;
						return result;
					}
				}
			}
		}
		
		// 如果是靠墙物件
		if (pThis.isLayWallObject())
		{
			// 取靠墙格子
			var backGrids : Array = new Array();
			for (var info1 : GridInfo in pThis.CompPropRow.HoldGrid)
			{
				if (0 == info1.x)
				{
					backGrids.Add(new GridInfo(info1.x, info1.z));
				}
			}
			HouseSceneComponent.convertGrids(backGrids, face, grid.X, grid.Z);
			
			// 判断是否靠墙
			var newFace : int = (2 + face) % 4; 
			for (var info2 : GridInfo in backGrids)
			{
				p = flr.GetGrid(info2.x, info2.z);
				
				if (null == p)
					continue;
				
				if (!p.getWallFace(newFace))
				{
					result[0] = HouseReturnValue.HRV_NEAR_WALL;
					result[1] = height;
					return result;
				}
			}
		}
		
		// 如果不是悬挂物件
		if (0.0f == pThis.CompPropRow.OffsetHeight)
		{
			// 摆放高度
			if (comp)
				height = comp.getTop();
		}
		
		result[0] = HouseReturnValue.HRV_OK;
		result[1] = height;
		return result;
	}
	//--------------------------------------------------
	// 自动靠墙
	public static function canAutoLayWall(pThis : HouseSceneComponent, grid : HouseSceneGrid) : System.Object[]
	{
		var height : float = 0.0f;
		var face : int = 0;
		var hrv : HouseReturnValue = HouseReturnValue.HRV_NO_AUTO_LAYWALL;
		var face_arr : Array = new Array();
				
		for (var i:int=0; i<HouseSceneDef.WALL_FACE_COUNT; ++i)
		{
			face = face % HouseSceneDef.WALL_FACE_COUNT;
			var rtns : System.Object[] = canLay(pThis, grid, face);
			hrv = rtns[0];
			height = rtns[1];
			if (HouseReturnValue.HRV_OK == hrv)
			{
				face_arr.Add(face);
			}
			++face;
		}
		
		if (face_arr.Count > 0)
		{
			hrv = HouseReturnValue.HRV_OK;
		}
		
		var result : System.Object[] = new System.Object[3];
		result[0] = hrv;
		result[1] = height;
		result[2] = face_arr;
		
		return result;
	}
	//--------------------------------------------------
	// 能否被拿起
	public static function canTake(pThis : HouseSceneComponent) : HouseReturnValue
	{
		// 未摆放
		if (!pThis.isLayed())
		{
			return HouseReturnValue.HRV_NO_LAYED;
		}
		// 房屋框架
		if (pThis.IsFrame)
		{
			return HouseReturnValue.HRV_NOTAKE_FRAME;
		}
		// 如果是悬挂物件直接返回ok
		if (0.0f != pThis.CompPropRow.OffsetHeight)
		{
			return HouseReturnValue.HRV_OK;
		}
		// 非悬挂的普通物件
		if (0.0f != pThis.Height)	// 不是摆在地上,可以拾取,直接返回
		{
			return HouseReturnValue.HRV_OK;
		}
		// 摆在地上,判断上面是否有东西
		var gridAttach : HouseSceneGrid = pThis.getAttachGrid();
		var layGrids : Array = new Array();
		CommFunc.copyGrids(pThis.CompPropRow.LayGrid, layGrids);
		HouseSceneComponent.convertGrids(layGrids, pThis.Face, gridAttach.X, gridAttach.Z);
		// 找出所有LayGrid, 对每个格子检查上面有没有物品摆放
		for (var info : GridInfo in layGrids)
		{
			var grid : HouseSceneGrid = gridAttach.Creator.GetGrid(info.x, info.z);
			if (grid)
			{
				for (var comp : HouseSceneComponent in grid.HouseComps)
				{
					if ((comp != pThis) && (0.0f == comp.CompPropRow.OffsetHeight))	// 该部件不是要拾取的部件,且不是悬挂物件
					{
						return HouseReturnValue.HRV_HAS_COMP_LAY;
					}
				}	
			}
		}
		return HouseReturnValue.HRV_OK;
	}
	//--------------------------------------------------
	// return [bool, HouseSceneComponent]
	public static function getFirstCanLayComponent(pThis : HouseSceneComponent, grid : HouseSceneGrid) : System.Object[]
	{
		var result : System.Object[] = new System.Object[2];
		result[0] = false;
		result[1] = null;
		
		// 判断格子上是否可放置this。(有些物件只能放在室内格子，有些物件只能放在室外格子)
		if (!CommFunc.BitContains(grid.GridTypeRow.AcceptLay, pThis.CompPropRow.LayType))
		{
			return result;
		}
		
		var selfHeight : float = pThis.CompPropRow.SelfHeight;		// 自身高度
		var compDown : HouseSceneComponent = null;
		var hBottom : float = 0.0f;									// 摆放底部值
		var compUp : HouseSceneComponent = null;
		var hTop : float = 0;										// 摆放顶部值
		var ci : int = 0;
		
		for (ci=0; ci<grid.HouseComps.Count; ++ci)
		{
			var it : HouseSceneComponent = grid.HouseComps[ci];
			// 过滤占据不同格子空间的物件
			var layType : int = pThis.CompPropRow.HoldType;
			var iteType : int = it.CompPropRow.HoldType;
			if (layType!=2 && iteType!=2 && layType!=iteType)
				continue;
			
			compUp = it;
			hTop = compUp.getBottom();
			
			// 如果不是悬挂物件
			if (0.0f == pThis.CompPropRow.OffsetHeight)
			{
				// 如果碰到第一个悬挂物件，停止查找
				if (0.0f != compUp.CompPropRow.OffsetHeight)
					break;
				
				if (hBottom + selfHeight <= hTop)
				{
					result[0] = true;
					result[1] = compDown;
					return result;
				}
			}
			else
			{
				if (hBottom > pThis.getBottom())
				{
					result[0] = false;
					result[1] = null;
					return result;
				}
				else
				{
					if (pThis.getTop() <= hTop)
					{
						result[0] = true;
						result[1] = compDown;
						return result;
					}
				}
			}
			
			compDown = compUp;		
			hBottom = compDown.getTop();
		}
		
		// 如果是最后一个，则将顶部设为层高
		if (ci == grid.HouseComps.Count)
		{
			hTop = grid.Creator.FloorHeight;
			if (hTop <= 0.0f)
			{
				hTop = HouseSceneDef.HOUSE_DEF_FLOOR_HEGHT;
			}
		}
		
		// 如果不是悬挂物件
		if (0.0f == pThis.CompPropRow.OffsetHeight)
		{
			if (hBottom + selfHeight <= hTop)
			{
				result[0] = true;
				result[1] = compDown;
				return result;
			}
		}
		else
		{
			if ((hBottom <= pThis.getBottom()) && ((pThis.getTop() <= hTop)))
			{
				result[0] = true;
				result[1] = compDown;
				return result;
			}
		}
		
		result[0] = false;
		result[1] = null;
		return result;
	}
	//--------------------------------------------------
}


