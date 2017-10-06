/*
*
*Xml文件管理类
*存储Xml文件列表
*
*/
#pragma strict
#pragma downcast



class XmlManager
{
	var InitFiles : TextAsset;
	var XmlFileMap : Hashtable = new Hashtable();
	
	private var aynResMgr : AsynResourceMgr = null;
	private var resMgr : ResManager = null;
	
	static var DefaultGameObjectName : String = "XmlManager";
	static var DefaultXmlManagerName : String = "XmlManager";
	
	function Init ()
	{
		var sls : String[] = InitFiles.text.Split(["\n", "\r\n"], StringSplitOptions.RemoveEmptyEntries);
		for(var f : String in sls)
		{
			var loader : URLLoader = aynResMgr.getLoader(Global.UrlRoot + f);
			
			AddFile(loader.www.assetBundle.mainAsset);
		}
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
		
		resMgr.RegLoad(urls, OnLoadFinished, true);
	}
	
	private function OnLoadFinished()
	{
		Init();
	}
	
	function AddFile(file : TextAsset)
	{
		if(null == file)
		{
			Debug.Log("XmlManager.AddFile: TextAsset is null.");
			return;
		}
		
		if(XmlFileMap.ContainsKey(file.name))
			throw new Exception("ERROR 'XmlManager.AddFile': File '" + file.name + "' has exists in XmlManager!");
			
		XmlFileMap.Add(file.name, file);
	}
	
	function RemoveFile(name : String)
	{
		if(false == XmlFileMap.Contains(name))
		{
			Debug.Log("XmlManager.RemoveFile: File '" + name + "' not exists!");
			return;
		}
			
		XmlFileMap.Remove(name);
	}
	
	function GetFile(name : String) : TextAsset
	{
		if(false == XmlFileMap.Contains(name))
		{
			Debug.Log("XmlManager.GetFile: File '" + name + "' not exists!");
			return null;
		}
			
		return XmlFileMap[name];
	}
	
	function GetText(name : String) : String
	{
		if(false == XmlFileMap.Contains(name))
		{
			Debug.Log("XmlManager.GetText: File '" + name + "' not exists!");
			return null;
		}
		var ta : TextAsset = XmlFileMap[name];
		return ta.text;
	}
	
	function GetFileCount() : int
	{
		return XmlFileMap.Count;
	}
	
	//*************************************************************************************
	//*************************************************************************************
	//*************************************************************************************
	static function FindManager() : XmlManager
	{
		return FindManager(DefaultGameObjectName);
	}
	
	static function FindManager(gameObjName : String) : XmlManager
	{
		var gameObj : GameObject = GameObject.Find(gameObjName);
		
		if(null == gameObj)
			throw new Exception("ERROR 'XmlManager.FindManager': GameObject '" + gameObjName + "' not exists!");
			
		return gameObj.GetComponent(DefaultXmlManagerName) as XmlManager;
	}
	
	static function FindFile(fileName : String)
	{
		return FindFile(DefaultGameObjectName, fileName);
	}
	
	static function FindFile(gameObjName : String, fileName : String) : TextAsset
	{
		var xmlMgr : XmlManager = FindManager(gameObjName);
		
		if(null == xmlMgr)
			throw new Exception("ERROR 'XmlManager.FindFile': GameObject '" + gameObjName + "' not attach '" + DefaultXmlManagerName + "' script!");
		
		return xmlMgr.GetFile(fileName);
	}
	
	static function FindText(fileName : String) : String
	{
		return FindText(DefaultGameObjectName, fileName);
	}
	
	static function FindText(gameObjName : String, fileName : String) : String
	{
		var xmlMgr : XmlManager = FindManager(gameObjName);
		
		if(null == xmlMgr)
			throw new Exception("ERROR 'XmlManager.FindText': GameObject '" + gameObjName + "' not attach '" + DefaultXmlManagerName + "' script!");
		
		return xmlMgr.GetText(fileName);
	}
}
