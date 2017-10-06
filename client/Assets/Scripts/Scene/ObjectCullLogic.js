#pragma strict


// 这个脚本通知可以直接挂接在场景编辑器的物件下面就可以使物件同样具有隐藏规则
// 把脚本挂接在GameObject下，然后设置在编辑器指示面板设置cullLevel为对应的剔除等级就可以



//====================================================
// 剔除场景的范围. 范围数值单位是厘米, 可以修改
enum CullDistanceType
{
	_1 = 500,
	_2 = 500,
	_3 = 500,
	_4 = 500,
	_5 = 800,
	_6 = 800,
	_7 = 800,
	_8 = 800,
	_9 = 1600,
	_10 = 2400,
}



//====================================================
// 物件剔除类
class ObjectCull
{
	var _gameObject : GameObject = null;							// 对应的gameObject
	var _cullLevel : int = 0;										// 剔除等级, 0为不剔除
	var _callback : Function = null;								// 设置可见的回调函数
	private var mVisible : boolean = true;							// 当前是否可见	
	private var mFirstTimeUpateVisible : boolean = true;			// 是否是第一次更新可见
	private var mLastUpdateTime : float = 0.0f;						// 上次更新的世界
	
	public static var CullDistance : Hashtable = null;				// 裁切距离
	public static var CullEnable : boolean = false;					// 默认关闭裁切
	//--------------------------------------------------
	// 构造函数
	public function ObjectCull()
	{
		if (CullDistance == null)
		{
			CullDistance = new Hashtable();
			//设置不同等级的显示范围
			CullDistance.Add(1, CullDistanceType._1);
			CullDistance.Add(2, CullDistanceType._2);
			CullDistance.Add(3, CullDistanceType._3);
			CullDistance.Add(4, CullDistanceType._4);
			CullDistance.Add(5, CullDistanceType._5);
			CullDistance.Add(6, CullDistanceType._6);
			CullDistance.Add(7, CullDistanceType._7);
			CullDistance.Add(8, CullDistanceType._8);
			CullDistance.Add(9, CullDistanceType._9);
			CullDistance.Add(10, CullDistanceType._10);
		}
		
		//
		_cullLevel = 0;
		mFirstTimeUpateVisible = true;
		mLastUpdateTime = 0;
	}
	//--------------------------------------------------
	// 更新
	public function update() : void
	{
		// 不允许剔除
		if (!CullEnable)
		{
			sysnAndNofityVisible(true);
			return;
		}
		
		if (_gameObject == null)
			return;
		
		if (_cullLevel == 0)
			return;
		
		// 每一秒更新
		var curr : float = Time.time;
		if (curr - mLastUpdateTime > 1.0f)
		{
			calcAndNofityVisible();
			mLastUpdateTime = curr;
		}
	}
	//--------------------------------------------------
	// 计算和通知是否可见
	private function calcAndNofityVisible() : void
	{
		// 不允许剔除
		if (!CullEnable)
			return;
		
		if (_gameObject == null)
			return;
		
		if (_cullLevel < 1 || _cullLevel > 10)
			return;
		
		// 计算照相机到物体的距离(这里取距离的平方)
//		var cam : Camera = Camera.main;
//		if (cam == null)
//			return;
//		
//		var camTran : Transform = cam.transform;
//		var offset : Vector3 = cam.transform.position - _gameObject.transform.position;
		
		// 计算照相机看点到物体的距离(这里取距离的平方)
		var offset : Vector3 = EQCamera.getInstance().getLookAt() - _gameObject.transform.position;
		var distanceSqr : float = offset.sqrMagnitude;
		
		// 根据距离的平方判断是否显示
		var vis : boolean;
		var dis100 : int = System.Convert.ToInt32(CullDistance[_cullLevel]);
		if (distanceSqr < dis100/100.0f * dis100/100.0f)
		{
			vis = true;
		}
		else
		{
			vis = false;
		}
		sysnAndNofityVisible(vis);
	}
	//--------------------------------------------------
	// 同步通知显示
	private function sysnAndNofityVisible(vis : boolean) : void
	{
		var needNotify : boolean = false;
		// 显示设置被改变
		if (vis != mVisible)
		{
			needNotify = true;
			mVisible = vis;
		}
		// 是否第一次设置
		if (mFirstTimeUpateVisible)
		{
			needNotify = true;
			mFirstTimeUpateVisible = false;
		}
		// 需要改变显示
		if (needNotify)
		{
			_callback(vis);
		}
	}
	//--------------------------------------------------
}





//====================================================
public var cullLevel : int = 0;
private var mCull : ObjectCull = null;

//--------------------------------------------------
function Start()
{
	mCull = new ObjectCull();
	mCull._cullLevel = cullLevel;
	mCull._gameObject = gameObject;
	mCull._callback = callback;
}
//--------------------------------------------------
function Update()
{
	mCull.update();
}
//--------------------------------------------------
function OnDestroy()
{
	// 手动解除引用关系
	mCull._gameObject = null;
	mCull._callback = null;
	mCull = null;
}
//--------------------------------------------------
private function callback(v : boolean) : void
{
	var render : Renderer = GetComponent(Renderer);
	if (render != null)
	{
		render.enabled = v;
	}
	
	for (var comps : Component in GetComponentsInChildren(Renderer))
	{
		render = comps as Renderer;
		render.enabled = v;
	}
}
//--------------------------------------------------

