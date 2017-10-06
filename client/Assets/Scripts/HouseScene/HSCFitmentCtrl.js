/*--------------------------------------------------
*** 房屋部件家装控制器(2012/5/24 modify by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast



class HSCFitmentCtrl
{
//	// 摆放模式
//	enum PutMode 
//	{
//		pmEditor = 0,	// 编辑器模式
//		pmPlayer		// 玩家模式
//	};
//	var PMode : PutMode = PutMode.pmPlayer;			// 是否玩家模式,玩家模式下不能摆放门窗,只能替换门窗

	private var SceneNode : SceneObject = null;				// 家装控制节点

	private var Listener : FitmentEvent = null;				// 家装事件	
	private var Comp : HouseSceneComponent = null;			// 房屋部件
	private var CompGridGraphics : HouseGridGraphics = new HouseGridGraphics();		// 部件对应的网格
	private var CurrOperateGrid : HouseSceneGrid = null;	// 当前对应的格子
	private var LastOperateGrid : HouseSceneGrid = null;	// 上次操作的格子
	private var Face : int = 0;								// 朝向(0,朝x轴;1,朝-z轴;2,朝-x轴;3,朝z轴)
	private var Height : float = 0.0f;						// 摆放高度
	//--------------------------------------------------
	// 构造函数
	function HSCFitmentCtrl()
	{
		var name : String = "FitmentCtrlObject";
		SceneNode = new SceneObject();
		SceneNode.GameObj = new GameObject(name);
		SceneNode.Template = name;
	}
	//--------------------------------------------------
	// 销毁
	public function destroy() : void
	{
		SceneNode.Destroy();
	}
	//--------------------------------------------------
	// 设置监听
	public function setListener(listener : FitmentEvent) : void
	{
		Listener = listener;
	}
	//--------------------------------------------------
	// 连接部件
	public function attach(hsc : HouseSceneComponent) : void
	{
		Comp = hsc;
		Face = hsc.Face;
		Height = hsc.Height;
		CompGridGraphics.attach(SceneNode, hsc.CompPropRow, hsc.Face);
		Comp.setParentNode(SceneNode);
		Comp.updatePosAndRot();
	}
	//--------------------------------------------------
	// 解除连接
	public function detach() : void
	{
		Listener = null;
		Comp = null;
		CurrOperateGrid = null;
		LastOperateGrid = null;
		Face = 0;
		Height = 0.0f;
		CompGridGraphics.detach();
	}
	//--------------------------------------------------
	// 获取连接的部件
	public function getAttach() : HouseSceneComponent
	{
		return Comp;
	}
	//--------------------------------------------------
	// 执行
	public function exec(ray : Ray) : void
	{
		if (false == _check())
			return;
		
		var all_house : boolean = (1 == UpDownStair.getViewFloorNum() ? false : true);
		var ray_grid : System.Object[] = EQSceneManager.getSingleton().HouseSceneObj.rayGrid(ray, all_house);
		var grid : HouseSceneGrid = ray_grid[1] as HouseSceneGrid;	// 射线相交的格子
		CurrOperateGrid = grid;
		
		if (grid && grid!=LastOperateGrid)
		{
			SceneNode.SetPosition(grid.GetPosition());	// 设置部件的坐标与格子的坐标一样
			showHoldGrid(_calcLay(grid));
			_updateCompPosAndRot();
			LastOperateGrid = grid;
		}
	}
	//--------------------------------------------------
	// 旋转角度
	public function rotate(degree : float) : void
	{
		if (false == _check())
			return;
		
		// 处理靠墙角占单个格子的靠墙部件
		if (Comp.isLayWallObject())
		{
			var rtns : System.Object[] = HSCLayLogic.canAutoLayWall(Comp, CurrOperateGrid);
			var face_arr : Array = rtns[2] as Array;
			if (2 == face_arr.Count)
			{
				if (face_arr[0] == Face)
				{
					Face = face_arr[1];
				}
				else
				{
					Face = face_arr[0];
				}
			}
		}
		else	// 普通部件
		{
			if (degree < 0)
				Face--;
			else if (degree > 0)
				Face++;
			
			if (Face < 0)
				Face += 4;
			else if (Face >= 4)
				Face -= 4;
		}
		
		showHoldGrid(_calcLay());
		_updateCompPosAndRot();
	}	
//	//--------------------------------------------------
//	// 设置摆放模式
//	function setPutMode(val : PutMode)
//	{
//		PMode = val;
//	}
//	//--------------------------------------------------
//	// 获取摆放模式
//	function getPutMode() : PutMode
//	{ 
//		return PMode;
//	}
	//--------------------------------------------------
	// 更新部件位置和朝向
	private function _updateCompPosAndRot() : void
	{
		if (false == _check())
			return;
		
		CompGridGraphics.rotateHoldGrid(Face);
		Comp.Face = Face;
		Comp.Height = Height;
		Comp.updatePosAndRot();
	}
	//--------------------------------------------------
	// 显示不同颜色的格子,在计算是否可以摆放后调用
	public function showHoldGrid(canLay : boolean) : void
	{
		if (canLay)
			CompGridGraphics.showGreenHoldGrid();
		else
			CompGridGraphics.showRedHoldGrid();
	}
	//--------------------------------------------------
	// 计算是否可以摆放
	private function _calcLay() : boolean
	{
		if (null == LastOperateGrid)
			return false;
		
		return _calcLay(LastOperateGrid);
	}
	//--------------------------------------------------
	// 计算是否可以摆放
	private function _calcLay(grid : HouseSceneGrid) : boolean
	{
		var ret : boolean = false;		// 返回值
		var hrv : HouseReturnValue = HouseReturnValue.HRV_FAIL;
		var compRep : HouseSceneComponent = null;	// 可替换部件
		var beProcessed : boolean = false; 			// 是否被处理了的标识
	
//		// 目前项目里的部件是不可替换的,以后可能可以替换
//		if (PutMode.pmPlayer == PMode) // 玩家模式下
//		{
//			// 可替换物品只允许替换，不允许摆放
//			if (Comp.HouseCompPropRow.CanRep) // 如果可替换其它物件
//			{
//				// 找可被替换的物件
//				compRep = HSCLayLogic.findCanReplaceComponent(Comp, grid);
//				if (compRep) // 找到
//				{
//					Height = Comp.Height;
//					Face = compRep.Face;
//					hrv = HouseReturnValue.HRV_OK;
//				}
//				else 		// 没找到
//				{
//					hrv = HouseReturnValue.HRV_FAIL; 
//				}
//				beProcessed = true;
//			}
//		}
		
		if (!beProcessed) // 如果没被处理过
		{
			var rtns : System.Object[];
			if (Comp.isLayWallObject()) // 是否为靠墙对象
			{
				rtns = HSCLayLogic.canAutoLayWall(Comp, grid);
				var face_arr : Array = rtns[2] as Array;
				if (0 != face_arr.Count)
				{
					if (-1 == CommFunc.indexOfArray(face_arr, Face))
					{
						Face = face_arr[0];
					}
				}
			}
			else
			{
				rtns = HSCLayLogic.canLay(Comp, grid, Face);
			}
			hrv = rtns[0];
			Height = rtns[1];
		}
		
		if (HouseReturnValue.HRV_OK == hrv)	// 可以摆放
		{
			Listener.notifyCanLay(grid, Face, Height, compRep);	
			ret = true;
		}
		else	// 不能摆放
		{
			Listener.notifyForbidLay();	
			ret = false;
		}
		
		return ret;
	}
	//--------------------------------------------------
	// 检查
	private function _check() : boolean
	{
		if (Comp && Listener)
			return true;
			
		return false;
	}
	//--------------------------------------------------
}


