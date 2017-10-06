/*--------------------------------------------------
*** 编辑房屋部件事件(2012/5/24 modify by hezhr)
--------------------------------------------------*/
#pragma strict



class FitmentEvent
{
	// 操作模式
	enum OpMode
	{
		OpNewFitment,	// 新家具
		OpEditFitment	// 编辑家具
	};
	
	// 摆放状态
	enum PutState
	{
		PS_NONE,		// 空,没有家具
		PS_PICKUP,		// 拾取,家具在鼠标上,未摆放
		PS_ROTATE		// 旋转,家具已经摆上,可以旋转
	}
	
	private var Mode : OpMode = OpMode.OpEditFitment;		// 操作模式
	private var State : PutState = PutState.PS_NONE;		// 家具摆放状态
	private var CanLay : boolean = false;					// 是否可以停靠
	private var PickObj : GameObject = null;				// 拾取的家具对象
	private var ClickGrid : HouseSceneGrid = null;			// 鼠标点击的格子
	private var FitmentCtrl : HSCFitmentCtrl = null;		// 房屋部件家装控制器
	
	public var Fitment : HouseSceneComponent = null;		// 目前正在操作的物件
	public var FitmentRep : HouseSceneComponent = null;		// 可以替换的物件
	
	var Grid : HouseSceneGrid = null;			// 目前所在的格子
	var Face : int = 0;							// 目前的面向
	var Bottom : float = 0.0f;					// 目前的摆放高度
	var OldGrid : HouseSceneGrid = null;		// 原先所在的格子
	var OldFace : int = 0;						// 原先的面向
	var OldBottom : float = 0.0f;				// 原先的摆放高度
	//--------------------------------------------------
	// 鼠标移动
	public function MouseMove(point : Vector3) : void
	{
		if (PutState.PS_ROTATE == State)	// 旋转状态
			return;
		
		if (null == _getGrid(point))		// 鼠标所在格子为空
			return;
		
		if (null == Fitment)	// 部件为空,则创建部件
		{
			if (false == _createNewFitment(FitmentLogic.getInstance().getComponentItem()))
				return;
		}
		
		FitmentCtrl.exec(_getRay(point));
	}
	//--------------------------------------------------
	// 鼠标左键按键
	public function LButtonDown(point : Vector3) : void
	{
		PickObj = PickMgr.getSingleton().getPickObject();
		ClickGrid = _getGrid(point);
	}
	//--------------------------------------------------
	// 鼠标左键弹起
	public function LButtonUp(point : Vector3) : void
	{
		var attach : boolean = false;	// 是否附加摆放事件
		switch (State)
		{
		case PutState.PS_NONE:		// 空状态
			if (false == _check())	// 鼠标上没有部件
			{
				if (PickObj && PickObj==PickMgr.getSingleton().getPickObject())	// 鼠标在拾取部件上
				{
					_pickupFitment(HSCManager.getSingleton().getHouseSceneComponent(PickObj));
				}
			}
			break;
		case PutState.PS_PICKUP:	// 拾取状态
			if (ClickGrid && ClickGrid==_getGrid(point))
			{
				_attachPutEvent();
				attach = true;
			}
		case PutState.PS_ROTATE:	// 旋转状态
			if (!attach && ClickGrid && ClickGrid==_getGrid(point))
			{
				_detachPutEvent();
			}
			break;
		}
	}
	//--------------------------------------------------
	// 鼠标移进家具
	public function onMovein() : void
	{
	}
	//--------------------------------------------------
	// 鼠标移出家具
	public function onMoveout() : void
	{
	}
	//--------------------------------------------------
	// 设置鼠标
	public function setMouseCursor() : void
	{
	}
	//--------------------------------------------------
	// 附加摆放事件
	private function _attachPutEvent() : void
	{
		if (false==_check() || false==CanLay)
			return;
		
		State = PutState.PS_ROTATE;
		iGUICode_StorageBoxUI.getInstance().openControlUI(true);
	}
	//--------------------------------------------------
	// 解除摆放事件
	private function _detachPutEvent() : void
	{
		if (false == _check())
			return;
		
		State = PutState.PS_PICKUP;
		iGUICode_StorageBoxUI.getInstance().openControlUI(false);
	}
	//--------------------------------------------------
	// 通知可以摆放
	public function notifyCanLay(grid : HouseSceneGrid, face : int, height : float, compRep : HouseSceneComponent) : void
	{
		CanLay = true;
		Grid = grid;
		Face = face;
		Bottom = height;
		FitmentRep = compRep;
	}
	//--------------------------------------------------
	// 通知阻止摆放
	public function notifyForbidLay() : void
	{
		CanLay = false;
	}
	//--------------------------------------------------
	// 获取家装操作模式
	public function getOpMode() : OpMode
	{
		return Mode;
	}
	//--------------------------------------------------
	// 删除家具
	public function delFitment() : void
	{
		if (false == _check())
			return;
		
		// step1
		FitmentCtrl.detach();
		HSCManager.getSingleton().destroyHouseSceneComponent(Fitment);
		// step2:最后调用
		_reset();
	}
	//--------------------------------------------------
	// 摆放家具
	public function putFitment() : boolean
	{
		if (false==_check() || false==CanLay || null==Grid)
			return false;
		
		// step1
		Fitment.lay(Grid, Face, Bottom);
		FitmentCtrl.detach();
		FitmentLogic.getInstance().putFitmentFinish(Fitment);	// 家装的其他逻辑处理
		// step2:最后调用
		_reset();
		return true;
	}
	//--------------------------------------------------
	// 旋转家具
	public function rotateFitment(degree : float) : void
	{
		if (false == _check())
			return;
		
		FitmentCtrl.rotate(degree);
	}
	//--------------------------------------------------
	// 撤消操作
	public function undo() : void
	{
		if (false == _check())
			return;
		
		// step1
		FitmentCtrl.detach();
		if (OpMode.OpNewFitment == Mode)	// 新增部件模式,则删除
		{
			HSCManager.getSingleton().destroyHouseSceneComponent(Fitment);
		}
		else	// 编辑部件模式,则放回原处
		{
			if(OldGrid)
				Fitment.lay(OldGrid, OldFace, OldBottom);
		}
		// step2:最后调用
		_reset();
	}
	//--------------------------------------------------
	// 重置数据
	private function _reset()
	{
		Mode = OpMode.OpEditFitment;
		State = PutState.PS_NONE;
		CanLay = false;
		PickObj = null;
	
		Fitment = null;
		FitmentRep = null;
		FitmentCtrl = null;
		
		Grid = null;
		Face = 0;
		Bottom = 0.0f;
		OldGrid = null;
		OldFace = 0;
		OldBottom = 0.0f;
	}
	//--------------------------------------------------
	// 拾取家具
	private function _pickupFitment(comp : HouseSceneComponent) : boolean
	{
		if (null==comp || comp.CompPropRow.CanRep || false==_initFitmentCtrl())	// 是可替换部件(门,窗),不能拿起来
			return false;
		
		if (HouseReturnValue.HRV_OK != HSCLayLogic.canTake(comp))	// 不能拿起
			return false;
		
		Fitment = comp;
		OldGrid = comp.getAttachGrid();
		OldFace = comp.Face;
		OldBottom = comp.getBottom();
		
		Fitment.take();
		FitmentCtrl.attach(Fitment);
		FitmentCtrl.setListener(this);
		FitmentCtrl.showHoldGrid(true);
		
		Mode = OpMode.OpEditFitment;
		State = PutState.PS_PICKUP;
		//
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MOUSE_PICKED_FURNI),true);
		return true;
	}
	//--------------------------------------------------
	// 创建家具
	private function _createNewFitment(it : Item) : boolean
	{
		if (null==it || false==_initFitmentCtrl())
			return false;
		
		Fitment = HSCManager.getSingleton().createHouseSceneComponent();
		Fitment.InstId = it._instanceID;
		Fitment.parseRes(it._itemInfo.sub_id, it._itemInfo.id);
		Fitment.load();
		
		FitmentCtrl.attach(Fitment);
		FitmentCtrl.setListener(this);
		
		Mode = OpMode.OpNewFitment;
		State = PutState.PS_PICKUP;
		
		FitmentLogic.getInstance().createFitmentFinish(Fitment);	// 家具创建完,主要是为了设置实例id
		//
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MOUSE_PICKED_FURNI),true);
		return true;
	}
	//--------------------------------------------------
	// 获取射线
	private function _getRay(point : Vector3) : Ray
	{
		var ray : Ray = Camera.main.ScreenPointToRay(point);
		
		// 转换左右手坐标系
		//ray.origin.x = 0 - ray.origin.x;			// ##LH
		//ray.direction.x = 0 - ray.direction.x;	// ##LH
		
		return ray;
	}
	//--------------------------------------------------
	// 获取格子
	private function _getGrid(point : Vector3) : HouseSceneGrid
	{
		var sce : HouseScene = EQSceneManager.getSingleton().HouseSceneObj;
		var rtns : System.Object[] = sce.rayGrid(_getRay(point));
		return rtns[1] as HouseSceneGrid;
	}
	//--------------------------------------------------
	// 初始家装控制器
	private function _initFitmentCtrl() : boolean
	{
		if (EQSceneManager.getSingleton().HouseSceneObj)
		{
			FitmentCtrl = EQSceneManager.getSingleton().HouseSceneObj.FitmentCtrl;
//			FitmentCtrl.setPutMode(HSCFitmentCtrl.PutMode.pmPlayer);
		}
		
		if (FitmentCtrl)
			return true;
			
		return false;
	}
	//--------------------------------------------------
	// 检查
	private function _check() : boolean
	{
		if (Fitment && FitmentCtrl)
			return true;
		
		return false;
	}
	//--------------------------------------------------
}


