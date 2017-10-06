#pragma strict
#pragma downcast
/*
*
*游戏对象管理类
*维护游戏对象模板列表，提供对象实例化等服务。
*
*/
class ObjectManager
{
	var ObjectMap : Hashtable = new Hashtable();
	
	var InitFiles : TextAsset;
	
	private var aynResMgr : AsynResourceMgr = null;
	private var resMgr : ResManager = null;
	
	static var DefaultGameObjectName : String = "ObjectManager";
	static var DefaultObjectManagerName : String = "ObjectManager";
	
	function Init()
	{
	
	}
	
	function RegLoad(resmgr : ResManager, mgr : AsynResourceMgr)
	{
		resMgr = resmgr;
		aynResMgr = mgr;
		
		var urls : Array = new Array();
		var sls : String[] = InitFiles.text.Split(["\n", "\r\n"], StringSplitOptions.RemoveEmptyEntries);
		for(var f : String in sls)
		{
			urls.Add(Global.UrlRoot + f);
		}
		
		resMgr.RegLoad(urls, OnLoadFinished, false);
	}
	
	private function OnLoadFinished()
	{
		Init();
	}
	
	//增加游戏对象模板
	function AddObject(obj : GameObject)
	{
		if(null == obj)
		{
			Debug.Log("ObjectManager.AddObject: GameObject is null.");
			return;
		}
		
		if(ObjectMap.ContainsKey(obj.name))
			throw new Exception("ERROR 'ObjectManager.AddObject': Object '" + obj.name + "' has exists in ObjectManager!");
		
		ObjectMap.Add(obj.name, obj);
	}
	
	//删除游戏对象模板
	function RemoveObject(name : String)
	{
		if(false == ObjectMap.Contains(name))
		{
			Debug.Log("ObjectManager.RemoveObject: Object '" + name + "' not exists!");
			return;
		}
			
		ObjectMap.Remove(name);
	}
	
	//获取游戏对象模板
	function GetObject(name : String)
	{
		if(false == ObjectMap.Contains(name))
		{
			Debug.Log("ObjectManager.GetObject: Object '" + name + "' not exists!");
			return null;
		}
			
		return ObjectMap[name];
	}
	
	//获取游戏对象模板个数
	function GetObjectCount()
	{
		return ObjectMap.Count;
	}
	
	function LoadObject(name : String) : GameObject
	{
		var ml : ModelLoader = new ModelLoader(aynResMgr);
		
		return ml.SyncLoadModel(name, true);
	}
	
	//根据游戏对象模板实例化
	function InstanceObject(name : String)
	{
		/*var obj : GameObject = GetObject(name);
		
		if(null == obj)
			return null;
			
		return GameObject.Instantiate(obj);*/
		
		return LoadObject(name);
	}
	
	function InstanceObject(name : String, parent : GameObject)
	{
		var obj : GameObject = InstanceObject(name);
		
		if(null == obj)
			return null;
			
		CommFunc.setParent(parent, obj);
			
		return obj;
	}
	
	function InstanceObject(name : String, position : Vector3, rotation : Quaternion)
	{
		var obj : GameObject = InstanceObject(name);
		
		if(null == obj)
			return null;
			
		obj.transform.position = position;
		obj.transform.rotation = rotation;
			
		return obj;
	}
	
	function InstanceObject(name : String, position : Vector3, rotation : Quaternion, parent : GameObject)
	{
		var obj : GameObject = InstanceObject(name, position, rotation);
		
		if(null == obj)
			return null;
			
		CommFunc.setParent(parent, obj);
			
		return obj;
	}
	
	function InstanceObject(name : String, instName : String)
	{
		var obj : GameObject = InstanceObject(name);
		
		if(null == obj)
			return null;
			
		obj.name = instName;
			
		return obj;
	}
	
	function InstanceObject(name : String, instName : String, parent : GameObject)
	{
		var obj : GameObject = InstanceObject(name, instName);
		
		if(null == obj)
			return null;
			
		CommFunc.setParent(parent, obj);
			
		return obj;
	}
	
	function InstanceObject(name : String, instName : String, position : Vector3, rotation : Quaternion)
	{
		var obj : GameObject = InstanceObject(name, position, rotation);
		
		if(null == obj)
			return null;
			
		obj.name = instName;
		
		return obj;
	}
	
	function InstanceObject(name : String, instName : String, position : Vector3, rotation : Quaternion, parent : GameObject)
	{
		var obj : GameObject = InstanceObject(name, instName, position, rotation);
		
		if(null == obj)
			return null;
			
		CommFunc.setParent(parent, obj);
			
		return obj;
	}
	
	//*************************************************************************************
	//*************************************************************************************
	//*************************************************************************************
	//根据默认游戏对象名获取管理器
	static function FindObjectManager() : ObjectManager
	{
		return FindObjectManager(DefaultGameObjectName);
	}
	
	static function FindObjectManager(gameObjName : String) : ObjectManager
	{
		var gameObj : GameObject = GameObject.Find(gameObjName);
		
		if(null == gameObj)
			throw new Exception("ERROR 'ObjectManager.FindObjectManager': GameObject '" + gameObjName + "' not exists!");
			
		return gameObj.GetComponent(DefaultObjectManagerName) as ObjectManager;
	}
	
	//根据默认游戏对象名获取游戏对象模板
	static function FindObject(objName : String) : ObjectManager
	{
		return FindObject(DefaultGameObjectName, objName);
	}
	
	static function FindObject(gameObjName : String, objName : String)
	{
		var objMgr : ObjectManager = FindObjectManager(gameObjName);
		
		if(null == objMgr)
			throw new Exception("ERROR 'ObjectManager.FindObject': GameObject '" + gameObjName + "' not attach '" + DefaultObjectManagerName + "' script!");
		
		return objMgr.GetObject(objName);
	}
	
	//实例化
	static function Instantiate(gameObjName : String, objName : String)
	{
		var objMgr : ObjectManager = FindObjectManager(gameObjName);
		
		if(null == objMgr)
			return null;
			
		return objMgr.InstanceObject(objName);
	}
	
	static function Instantiate(gameObjName : String, objName : String, parent : GameObject)
	{
		var obj : GameObject = Instantiate(gameObjName, objName);
		
		if(null == obj)
			return null;
			
		CommFunc.setParent(parent, obj);
			
		return obj;
	}
	
	static function Instantiate(gameObjName : String, objName : String, position : Vector3, rotation : Quaternion)
	{
		var objMgr : ObjectManager = FindObjectManager(gameObjName);
		
		if(null == objMgr)
			return null;
			
		return objMgr.InstanceObject(objName, position, rotation);
	}
	
	static function Instantiate(gameObjName : String, objName : String, position : Vector3, rotation : Quaternion, parent : GameObject)
	{
		var obj : GameObject = Instantiate(gameObjName, objName, position, rotation);
		
		if(null == obj)
			return null;
			
		CommFunc.setParent(parent, obj);
			
		return obj;
	}
	
	static function Instantiate(gameObjName : String, objName : String, instName : String)
	{
		var objMgr : ObjectManager = FindObjectManager(gameObjName);
		
		if(null == objMgr)
			return null;
			
		return objMgr.InstanceObject(objName, instName);
	}
	
	static function Instantiate(gameObjName : String, objName : String, instName : String, parent : GameObject)
	{
		var obj : GameObject = Instantiate(gameObjName, objName, instName);
		
		if(null == obj)
			return null;
			
		CommFunc.setParent(parent, obj);
			
		return obj;
	}
	
	static function Instantiate(gameObjName : String, objName : String, instName : String, position : Vector3, rotation : Quaternion)
	{
		var objMgr : ObjectManager = FindObjectManager(gameObjName);
		
		if(null == objMgr)
			return null;
			
		return objMgr.InstanceObject(objName, instName, position, rotation);
	}
	
	static function Instantiate(gameObjName : String, objName : String, instName : String, position : Vector3, rotation : Quaternion, parent : GameObject)
	{
		var obj : GameObject = Instantiate(gameObjName, objName, instName, position, rotation);
		
		if(null == obj)
			return null;
			
		CommFunc.setParent(parent, obj);
			
		return obj;
	}
}
