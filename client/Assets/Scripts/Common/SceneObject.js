/*--------------------------------------------------
设置SceneObject从AsynModel继承,便于模型的异步加载(2012/5/25 modify by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast


class SceneObject extends AsynModel
{
	var Template : String = "";			// GameObject template name in ObjectManager or new GameObject's name
	var GameObj : GameObject = null;
	var AsynCtrl : AsynModelCtrl = new AsynModelCtrl(this);			// 异步控制器
	var CullObj : ObjectCull = new ObjectCull();					// 物件剔除
	var CullVisible : boolean = true;								// 物件剔除的可视化
	var BaseVisible : boolean = true;								// 基本的可视化
	
	//--------------------------------------------------
	public function SceneObject()
	{
		CullObj._callback = CullCallback;
	}
	//--------------------------------------------------
	public function updateCull() : void
	{
		CullObj._gameObject = GameObj;
		CullObj.update();
	}
	//--------------------------------------------------
	public function GetLayer() : int
	{
		if (null == GameObj)
			return 0;
		
		return GameObj.layer;
	}
	//--------------------------------------------------
	public function SetLayer(layer : int) : void
	{
		if (null == GameObj)
			return;
		
		GameObj.layer = layer;
	}
	//--------------------------------------------------
	public function CullCallback(v : boolean) : void
	{
		CullVisible = v;
		SysnVisible();
	}
	//--------------------------------------------------
	// 设置最基本的可见性, 实际效果, 会受到物件剔除方面的影响
	public function SetVisible(visible : boolean) : void
	{
		BaseVisible = visible;
		SysnVisible();
	}
	//--------------------------------------------------
	public function SysnVisible() : void
	{
		if (null == GameObj)
			return;
			
		var vis : boolean = false;
		// 同时可见, 才能可见
		if (CullVisible && BaseVisible)
			vis = true;
		
		for (var render : Renderer in GameObj.GetComponentsInChildren(Renderer))
		{
			render.enabled = vis;
		}
		
		for (var colli : Collider in GameObj.GetComponentsInChildren(Collider))
		{
			colli.enabled = vis;
		}
	}
	//--------------------------------------------------
	public function GetVisible() : boolean
	{
		if (null == GameObj)
			return false;
		
		for (var render : Renderer in GameObj.GetComponentsInChildren(Renderer))
		{
			if (render.enabled)
				return true;
		}
		
		return false;
	}
	//--------------------------------------------------
	public function SetParent(parent : SceneObject) : void
	{
		if (null == GameObj)
			return;
		
		if (null == parent)
		{
			CommFunc.setParent(null, GameObj);
			return;
		}
		CommFunc.setParent(parent.GameObj, GameObj);
	}
	//--------------------------------------------------
	public function GetPosition(relativeTo : Space) : Vector3
	{
		if (null == GameObj)
			return Vector3.zero;
		
		if (relativeTo == Space.Self)
			return GameObj.transform.localPosition;
		
		return GameObj.transform.position;
	}
	//--------------------------------------------------
	public function GetPosition() : Vector3
	{
		return GetPosition(Space.Self);
	}
	//--------------------------------------------------
	function SetPosition(pt : Vector3, relativeTo : Space) : void
	{
		if (null == GameObj)
			return;
		
		if (relativeTo == Space.Self)
			GameObj.transform.localPosition = pt;
		else
			GameObj.transform.position = pt;
	}
	//--------------------------------------------------
	public function SetPosition(pt : Vector3) : void
	{
		SetPosition(pt, Space.Self);
	}
	//--------------------------------------------------
	public function SetPosition(x : float, y : float, z : float, relativeTo : Space) : void
	{
		SetPosition(new Vector3(x, y, z), relativeTo);
	}
	//--------------------------------------------------
	public function SetPosition(x : float, y : float, z : float) : void
	{
		SetPosition(new Vector3(x, y, z), Space.Self);
	}
	//--------------------------------------------------
	public function Translate(translation : Vector3, relativeTo : Space) : void
	{
		GameObj.transform.Translate(translation, relativeTo);
	}
	//--------------------------------------------------
	public function Translate(translation : Vector3) : void
	{
		Translate(translation, Space.Self);
	}
	//--------------------------------------------------
	public function Translate(x : float, y : float, z : float, relativeTo : Space) : void
	{
		GameObj.transform.Translate(x, y, z, relativeTo);
	}
	//--------------------------------------------------
	public function Translate(x : float, y : float, z : float) : void
	{
		Translate(x, y, z, Space.Self);
	}
	//--------------------------------------------------
	public function Translate(translation : Vector3, relativeTo : Transform) : void
	{
		GameObj.transform.Translate(translation, relativeTo);
	}
	//--------------------------------------------------
	public function Translate(x : float, y : float, z : float, relativeTo : Transform) : void
	{
		GameObj.transform.Translate(x, y, z, relativeTo);
	}
	//--------------------------------------------------
	public function GetRotation(relativeTo : Space) : Quaternion
	{
		if (null == GameObj)
			return Quaternion.identity;
		
		if (relativeTo == Space.Self)
			return GameObj.transform.localRotation;
		
		return GameObj.transform.rotation;
	}
	//--------------------------------------------------
	public function GetRotation() : Quaternion
	{
		return GetRotation(Space.Self);
	}
	//--------------------------------------------------
	public function SetRotation(rt : Quaternion, relativeTo : Space) : void
	{
		if (null == GameObj)
			return;
		
		if (relativeTo == Space.Self)
			GameObj.transform.localRotation = rt;
		else
			GameObj.transform.rotation = rt;
	}
	//--------------------------------------------------
	public function SetRotation(rt : Quaternion) : void
	{
		SetRotation(rt, Space.Self);
	}
	//--------------------------------------------------
	public function GetEulerAngles(relativeTo : Space) : Vector3
	{
		if (null == GameObj)
			return Vector3.zero;
		
		if (relativeTo == Space.Self)
			return GameObj.transform.localEulerAngles;
		
		return GameObj.transform.eulerAngles;
	}
	//--------------------------------------------------
	public function GetEulerAngles() : Vector3
	{
		return GetEulerAngles(Space.Self);
	}
	//--------------------------------------------------
	public function SetEulerAngles(ea : Vector3, relativeTo : Space) : void
	{
		if (null == GameObj)
			return;
		
		if (relativeTo == Space.Self)
			GameObj.transform.localEulerAngles = ea;
		else
			GameObj.transform.eulerAngles = ea;
	}
	//--------------------------------------------------
	public function SetEulerAngles(ea : Vector3) : void
	{
		SetEulerAngles(ea, Space.Self);
	}
	//--------------------------------------------------
	public function Rotate(eulerAngles : Vector3, relativeTo : Space) : void
	{
		GameObj.transform.Rotate(eulerAngles, relativeTo);
	}
	//--------------------------------------------------
	public function Rotate(eulerAngles : Vector3) : void
	{
		Rotate(eulerAngles, Space.Self);
	}
	//--------------------------------------------------
	public function Rotate(xAngle : float, yAngle : float, zAngle : float, relativeTo : Space) : void
	{
		GameObj.transform.Rotate(xAngle, yAngle, zAngle, relativeTo);
	}
	//--------------------------------------------------
	public function Rotate(xAngle : float, yAngle : float, zAngle : float) : void
	{
		Rotate (xAngle, yAngle, zAngle, Space.Self);
	}
	//--------------------------------------------------
	public function Rotate(axis : Vector3, angle : float, relativeTo : Space) : void
	{
		GameObj.transform.Rotate(axis, angle, relativeTo);
	}
	//--------------------------------------------------
	public function Rotate(axis : Vector3, angle : float) : void
	{
		Rotate(axis, angle, Space.Self);
	}
	//--------------------------------------------------
	public function SetScale(scale : Vector3) : void
	{
		if (null == GameObj)
			return;
		
		GameObj.transform.localScale = scale;
	}
	//--------------------------------------------------
	public function SetScale(x : float, y : float, z : float) : void
	{
		SetScale(Vector3(x, y, z));
	}
	//--------------------------------------------------
	public function Destroy() : void
	{
		if (GameObj)
		{
			GameObject.Destroy(GameObj);
		}
		AsynCtrl.clearEvent();	// 删除异步模型加载事件
	}
	//--------------------------------------------------
}

