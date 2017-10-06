/*--------------------------------------------------
房屋部件图形辅助类,主要用来显示 占据网格,阻挡网格,摆放网格,偏移高度(2012/5/24 modify by hezhr)
--------------------------------------------------*/
#pragma strict



class HouseGridGraphics
{
	/** 显示占据网格
		@目前颜色表示：
		     红色 -- 无法摆放
		     绿色 -- 可以摆放
			 黄色 -- 可以替换
	*/
	private var m_houseCompPropRow : HouseCompPropRow = null;	// 
	private var m_mainNode : SceneObject = null;				// 主结点
	private var m_holdGridObj : GameObject = null;				// 占据网格
	private var m_stopGridObj : GameObject = null;				// 阻挡网格
	private var m_layGridObj : GameObject = null;				// 摆放网格
	private var m_showOffsetHeight : boolean = false;			// 是否显示偏移高度标识
	private var m_holdGridColor : Color;						// 占据网格的颜色
	private var m_face : int = 0;								// 占据网格的面向(0, 1, 2, 3)
	
	//--------------------------------------------------
	// 显示占据网格
	public function showHoldGrid(bShow:boolean, col:Color) : void
	{
		if (null == m_houseCompPropRow)
		{
			return;
		}
		if (null!=m_holdGridObj && col==m_holdGridColor)
		{
			return;
		}
		_hideHoldGrid();
		var res : System.Object[] = createGrid(bShow, col, m_mainNode, m_holdGridObj, m_houseCompPropRow.HoldGrid, m_face);
		m_holdGridObj = res[1] as GameObject;
		if (res[0])
		{
			m_holdGridObj.transform.Translate(0, 0.09f, 0);
		}
		m_holdGridColor = col;
	}
	//--------------------------------------------------
	// 显示占据网格
	public function showHoldGrid(bShow : boolean) : void
	{
		if (bShow)
		{
			showGreenHoldGrid();
		}
		else
		{
			_hideHoldGrid();
		}
	}
	//--------------------------------------------------
	// 隐藏占据网格
	private function _hideHoldGrid() : void
	{
		if (null != m_holdGridObj)
		{
			GameObject.Destroy(m_holdGridObj);
			m_holdGridObj = null;
		}
	}
	//--------------------------------------------------
	// 旋转占据网格
	public function rotateHoldGrid(face : int) : void
	{
		if (null != m_holdGridObj)
		{
			m_holdGridObj.transform.localRotation = Quaternion.Euler(0, 90.0*CommFunc.ToU3DFace(face), 0);
			m_face = face;
		}
	}
	//--------------------------------------------------
	// 显示红色占据网格
	public function showRedHoldGrid() : void
	{
		showHoldGrid(true, Color(1, 0, 0, 1));
	}
	//--------------------------------------------------
	// 显示绿色占据网格
	public function showGreenHoldGrid() : void
	{
		showHoldGrid(true, Color(0, 1, 0, 1));
	}
	//--------------------------------------------------
	// 显示蓝色占据网格
	public function showYellowHoldGrid() : void
	{
		showHoldGrid(true, Color(1, 1, 0, 1));
	}
	//--------------------------------------------------
	// 显示阻挡网格(寻路相关)		
	public function showStopGrid(bShow : boolean) : void
	{
		if (null == m_houseCompPropRow)
		{
			return;
		}
		var res : System.Object[] = createGrid(bShow, Color(1, 0, 0, 1), m_mainNode, m_stopGridObj, m_houseCompPropRow.StopGrid, m_face);
		m_stopGridObj = res[1] as GameObject;
		if (res[0])
		{
			m_stopGridObj.transform.Translate(0, 0.09f, 0);
		}
	}
	//--------------------------------------------------
	// 显示摆放网格,物件上方可供别人摆放的网格
	public function showLayGrid(bShow : boolean) : void
	{
		if (null == m_houseCompPropRow)
		{
			return;
		}
		var res : System.Object[] = createGrid(bShow, Color(0, 0, 1, 1), m_mainNode, m_layGridObj, m_houseCompPropRow.LayGrid, m_face);
		m_layGridObj = res[1] as GameObject;
		if (res[0])
		{
			var y : float = 0.005f + m_houseCompPropRow.SelfHeight;
			if (m_showOffsetHeight)
			{
				y += m_houseCompPropRow.OffsetHeight;
			}
			m_layGridObj.transform.Translate(Vector3(0, 0.09f+y, 0));
		}
	}
	//--------------------------------------------------
	// 显示摆放网格偏移高度
	public function showOffsetHeight(bShow : boolean) : void
	{
		if (bShow == m_showOffsetHeight)
		{
			return;
		}
		m_showOffsetHeight = bShow;
		if (null != m_layGridObj)
		{
			showLayGrid(false);
			showLayGrid(true);
		}
	}
	//--------------------------------------------------
	// 连接
	public function attach(sobj : SceneObject, hcpr : HouseCompPropRow, face : int) : void
	{
		if (null==sobj || null==hcpr)
		{
			Debug.LogError("Error: HouseGridGraphics -> attach(SceneObject, HouseCompPropRow, int) -> parameter is wrong!");
			return;
		}
		if (sobj==m_mainNode && hcpr==m_houseCompPropRow)
		{
			return;
		}
		detach();
		m_houseCompPropRow = hcpr;
		m_mainNode = sobj;
		m_face = face;
	}
	//--------------------------------------------------
	// 解除连接
	public function detach() : void
	{
		showHoldGrid(false);
		showStopGrid(false);
		showLayGrid(false);
		showOffsetHeight(false);
		
		m_houseCompPropRow = null;
		m_mainNode = null;
		m_face = 0;
	}
	//--------------------------------------------------
	// 创建格子
	public static function createGrid(bShow : boolean, col : Color, pareNode : SceneObject, gridObj : GameObject, group : Array, face : int) : System.Object[]
	{
		var result : System.Object[] = new System.Object[2];
		result[0] = false;
		result[1] = null;
		
		var bCreate : boolean = false;
		if (null == pareNode)
		{
			return result;
		}
		if (bShow && 0!=group.length)
		{
			if (null == gridObj)
			{
				gridObj = CreateQuadGroup(HouseSceneDef.HOUSE_GRID_HALF_SIZE, 0.1f, col, group);
				CommFunc.setParent(pareNode.GameObj, gridObj);
				gridObj.transform.localPosition = Vector3(0, 0, 0);
				// 初始设置格子的方向
				gridObj.transform.localRotation = Quaternion.Euler(0, 90.0*CommFunc.ToU3DFace(face), 0);
				bCreate = true;
			}
		}
		else
		{
			if (null != gridObj)
			{
				GameObject.Destroy(gridObj);
				gridObj = null;
			}
		}
		
		result[0] = bCreate;
		result[1] = gridObj;
		return result;
	}
	//--------------------------------------------------
	// 创建一组中空方形;radius,方形的半径;thickness;方形的厚度;col,颜色,可以带透明通道;group,(0,0)对应原点
	private static var m_num : int = 0;
	public static function CreateQuadGroup(radius : float, thickness : float, col : Color, group : Array) : GameObject
	{
		if (radius<=0 || thickness<=0 || radius<=thickness)
		{
			Debug.LogError("Error: HouseGridGraphics -> CreateQuadGroup(float, float, Color, Array) -> parameter is wrong!");
			return;
		}
		++m_num;
		var name : String = "--DirQuadGroup--[auto]--"+m_num+"--";
		var ent : GameObject = new GameObject();
		ent.name = name;
		for (var obj : System.Object in group)
		{
			var info : GridInfo = obj as GridInfo;
			var x = info.x * HouseSceneDef.HOUSE_GRID_SIZE;
			var z = info.z * HouseSceneDef.HOUSE_GRID_SIZE;
			var grid : GameObject = Grid.CreateDirectionGrid(Vector3(x, 0, z), thickness, radius-thickness, radius-thickness, col);
			grid.transform.localRotation = Quaternion.Euler(0, 270, 0);	// 使默认格子方向指向x轴
			CommFunc.setParent(ent, grid);
		}
		return ent;
	}
	//--------------------------------------------------
}


