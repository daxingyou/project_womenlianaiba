/*--------------------------------------------------
*** 家装事件统一管理,简单的家装模式切换,事件分发等(2012/5/24 modify by hezhr)
--------------------------------------------------*/
#pragma strict



class FitmentEventMgr
{
	var mEvent : FitmentEvent = new FitmentEvent();
	private var _toLayShopFitment : boolean = false;	// 鼠标上有未摆放商城家具标识
	private static var singleton : FitmentEventMgr;
	//--------------------------------------------------
	public static function getSingleton() : FitmentEventMgr
	{
		if (null == singleton)
		{
			singleton = new FitmentEventMgr();
		}
		return singleton;
	}
	//--------------------------------------------------
	// 是否创建新家具模式
	public function isNewFitmentOpMode() : boolean
	{
		return (FitmentEvent.OpMode.OpNewFitment == mEvent.getOpMode());
	}
	//--------------------------------------------------
	// 判断家具类型(-1:none;0:商城家具,未摆放;1:商城家具,已摆放;2:场景家具;3:背包家具)
	public function checkFitmentType() : int
	{
		var ret : int = -1;
		
		if (null == mEvent.Fitment)
			return ret;
		
		var instance_id : UInt64 = mEvent.Fitment.InstId;	// 家具实例id
		if (0 == instance_id)	// 商城家具
		{
			if (null == mEvent.OldGrid)			// 未摆放
				ret = 0;
			else								// 已摆放
				ret = 1;
		}
		else
		{
			var fur : house_furniture = FitmentLogic.getInstance().checkGoodsOrFurniture(instance_id);
			if (fur)			// 场景家具
				ret = 2;
			else				// 背包家具
				ret = 3;
		}
		return ret;
	}
	//--------------------------------------------------
	// 处理家装购买/摆放/回收等逻辑
	public function handleFitmentLogic(leftButtonDown : boolean) : void
	{
		if (leftButtonDown && !FitmentLogic.getInstance().isMouseOverSlot())	// 鼠标单击除了物品格子外的其他界面
		{
			FitmentLogic.getInstance().clearSelect();			// 清除物品选中状态
		}
		
		var fitmentType : int = checkFitmentType();
		if (-1 == fitmentType)
			return;
		
		// 判断家具类型
		if (0 == fitmentType)		// 商城家具,未摆放
		{
			_toLayShopFitment = true;
			delFitment();	// 销毁模型
		}
		else
		{
			if (leftButtonDown)		// 鼠标左键按下
			{
				var comp : HouseSceneComponent = mEvent.Fitment;
				if (1 == fitmentType)		// 商城家具,已摆放
				{
					// 从购物车移除
					FitmentLogic.getInstance().delFromShopCart(comp);
				}
				else if (2 == fitmentType)	// 场景家具
				{
					// 添加到回收车
					FitmentLogic.getInstance().addToTakeCart(comp);
				}
				else if (3 == fitmentType)	// 背包家具
				{
					// 从摆放车移除
					FitmentLogic.getInstance().delFromLayCart(comp);
				}
				delFitment();		// 销毁模型
			}
		}
	}
	//--------------------------------------------------
	// 获取当前家具
	public function getFitment() : HouseSceneComponent
	{
		return mEvent.Fitment;
	}
	//--------------------------------------------------
	// 删除家具
	public function delFitment() : void
	{
		mEvent.delFitment();
		iGUICode_StorageBoxUI.getInstance().openControlUI(false);
	}
	//--------------------------------------------------
	// 摆放家具
	public function putFitment() : boolean
	{
		var ret : boolean = mEvent.putFitment();
		if (ret)
		{
			iGUICode_StorageBoxUI.getInstance().openControlUI(false);
		}
		return ret;
	}
	//--------------------------------------------------
	// 左旋转家具
	public function rotateFitmentLeft() : void
	{
		mEvent.rotateFitment(-1.0f);
	}
	//--------------------------------------------------
	// 右旋转家具
	public function rotateFitmentRight() : void
	{
		mEvent.rotateFitment(1.0f);
	}
	//--------------------------------------------------
	// 撤销操作
	public function undo() : void
	{
		mEvent.undo();
		iGUICode_StorageBoxUI.getInstance().openControlUI(false);
	}
	//--------------------------------------------------
	// 鼠标移动
	public function MouseMove(point : Vector3) : void
	{
		mEvent.MouseMove(point);
	}
	//--------------------------------------------------
	// 鼠标左键按下
	public function LButtonDown(point : Vector3) : void
	{
		mEvent.LButtonDown(point);
	}
	//--------------------------------------------------
	// 鼠标左键弹起
	public function LButtonUp(point : Vector3) : void
	{
		mEvent.LButtonUp(point);
	}
	//--------------------------------------------------
	// 鼠标移进家具
	public function onMovein() : void
	{
		mEvent.onMovein();
		mEvent.setMouseCursor();
	}
	//--------------------------------------------------
	// 鼠标移出家具
	public function onMoveout() : void
	{
		mEvent.onMoveout();
		mEvent.setMouseCursor();
	}
	//--------------------------------------------------
}


