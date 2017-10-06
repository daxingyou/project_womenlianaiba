#pragma strict

//这个脚本通知可以直接挂接在场景编辑器的物件下面就可以使物件同样具有隐藏规则
//把脚本挂接在GameObject下，然后设置在编辑器指示面板设置cullLevel为对应的剔除等级就可以

//剔除场景的范围. 范围数值单位是厘米, 可以修改
enum CullDistanceType {
	_1 = 400,
	_2 = 400,
	_3 = 400,
	_4 = 800,
	_5 = 800,
	_6 = 800,
	_7 = 1600,
	_8 = 1600,
	_9 = 3200,
	_10 = 6400,
}

//物件剔除类
class ObjectCull
{
	//对应的gameObject
	var _gameObject : GameObject = null;
	//剔除等级, 0为不剔除
	var _cullLevel : int = 0;
	//设置可见的回调函数
	var _callback : Function = null;
	//当前是否可见
	var _visible : boolean = true;
	//是否是第一次更新可见
	var _firstTimeUpateVisible : boolean = true;
	//上次更新的世界
	var _lastUpdateTime : float = 0;
	
	//裁切距离
	public static var CullDistance : Hashtable = null;
	//裁切允许
	public static var CullEnable : boolean = true;
	
	//构造函数
	public function ObjectCull()
	{
		if( CullDistance == null )
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
		_firstTimeUpateVisible = true;
		_lastUpdateTime = 0;
	}
	
	function update()
	{
		if(!CullEnable)
		{
			sysnAndNofityVisible(true);
			return;
		}
		if(_gameObject == null)
			return;
		if(_cullLevel == 0)
			return;

		var curr : float = Time.time;
		if( curr - _lastUpdateTime > 1.0f )
		{
			calcAndNofityVisible();
			
			_lastUpdateTime = curr;
		}
	}
	
	//计算和通知是否可见
	function calcAndNofityVisible()
	{
		if(!CullEnable)
			return;
		if(_gameObject == null)
			return;
		var cam : Camera = Camera.main;
		if(cam == null)
			return;
		if(_cullLevel < 1 || _cullLevel > 10)
			return;
		
		
		var dis100 : int = System.Convert.ToInt32(CullDistance[_cullLevel]);
		
		var camTran : Transform = cam.transform;
		var offset : Vector3 = cam.transform.position - _gameObject.transform.position;
		var distanceSqr : float = offset.sqrMagnitude;
		
		var vis : boolean;
		if( distanceSqr < dis100/100.0f * dis100/100.0f )
			vis = true;
		else
			vis = false;
		
		sysnAndNofityVisible(vis);
	}
	
	private function sysnAndNofityVisible(vis:boolean)
	{
		var needNotify : boolean = false;
		if(vis != _visible)
		{
			needNotify = true;
			_visible = vis;
		}
			
		if(_firstTimeUpateVisible)
		{
			needNotify = true;
			_firstTimeUpateVisible = false;
		}
		
		//
		if(needNotify)
			_callback(_visible);
	}
}




//====================================================
var cullLevel : int = 0;

@HideInInspector
var cull : ObjectCull = null;

function Start () {
	cull = new ObjectCull();
	cull._cullLevel = cullLevel;
	cull._gameObject = gameObject;
	cull._callback = callback;
}

function Update () {
	cull.update();
}

function OnDestroy () {
	//手动解除引用关系
	cull._gameObject = null;
	cull._callback = null;
	cull = null;
}

function callback(v:boolean)
{
	var render : Renderer = GetComponent (Renderer);
	if(render != null)
	{
		render.enabled = v;
	}

	for (var comps : Component in GetComponentsInChildren(Renderer))
	{
		render = comps as Renderer;
		render.enabled = v;
	}
		
}