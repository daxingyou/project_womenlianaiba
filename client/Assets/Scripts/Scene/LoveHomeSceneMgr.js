#pragma strict
#pragma downcast

//房屋物件逻辑和物件的映射
class HouseComponentLogicMapping
{
	var InstId : UInt64;		//实例id
	var CompUid : int;			//家具在游戏中的唯一id
}

//是否也由这个类来统一管理旧的房屋读取方式.这样不至于太混乱
class LoveHomeScene
{
	//场景名字
	var _sceneName : String = null;
	//根节点, 就是LoveHomeScene
	var _rootObject : GameObject = null;
	//场景的配置脚本
	var _sceneConfig : LoveHomeSceneConfig = null;
	//房屋场景
	var _house : HouseScene = null;
	//场景中, 预先摆放的家具资源
	var _houseComponentLogicMappingTable : Hashtable = null;

	//
	private var _loadUrl : String = null;

	//构造函数
	function LoveHomeScene(sceneName:String)
	{
		_sceneName = sceneName;
		createUrl();
		
		Global.GetAsynResMgr().asynLoad(_loadUrl, downloadOK, false);
	}
	
	private function createUrl()
	{
		_loadUrl = "Scene/" + _sceneName + ".unity.u3d";
	}
	
	function downloadOK(loader:IURLLoader, deleCount:int)
	{
		Application.LoadLevelAdditive(_sceneName);
		//由于gameobject无法马上获取, 所以这里就不获取了. 可以在对应脚本start的时候处理
	}
	
	//初始化场景
	function initScene()
	{
		_rootObject = GameObject.Find("LoveHomeScene");
		_sceneConfig = _rootObject.GetComponent(LoveHomeSceneConfig);
		
		//配置房屋
		configHouseScene();
		
		//配置房屋的家具
		configHouseComponent();
		
		//配置天空盒和雾
		configSkyboxAndFog();
	}
	
	function destroy()
	{
		Global.GetAsynResMgr().destroyLoader(_loadUrl, true);
		_house.Destroy();
		GameObject.Destroy(_rootObject);
		
		Global.GetAsynResMgr().resourceAutoDelete();
		Resources.UnloadUnusedAssets();
	}
	
	private function configHouseScene()
	{
		var houseObj : GameObject = _rootObject.transform.Find("House").gameObject;
		
		if(_sceneConfig.HouseXML == null)
		{
			_house = new HouseScene();
			_house.CreateNullScene(houseObj);
		}
		else {
			//创建一个新的房屋
			_house = new HouseScene();
			_house.buildWithXml(_sceneConfig.HouseXML.text);
			
			if(_sceneConfig.HouseNodeName != null && _sceneConfig.HouseNodeName != "")
			{
				var houseEntity : GameObject = houseObj.transform.Find(_sceneConfig.HouseNodeName).gameObject;
				if(houseEntity!=null)
				{			
					_house.buildFrameComps(houseEntity);
				}
			}
		}
		
		EQSceneManager.getSingleton().HouseSceneObj = _house;
	}
	
	//配置房屋的家具. 这个家具是固化在场景中的. 唯一id由表格生成. 目前只有室外场景用到
	private function configHouseComponent()
	{
		if(!_sceneConfig.HouseCompXML)
			return;
		
		if(_houseComponentLogicMappingTable == null)
			_houseComponentLogicMappingTable = new Hashtable();
		
		for(var hcr : HouseComponenetRes in HouseRes.ConvertFromXmlString(_sceneConfig.HouseCompXML.text))
		{
			var comp : HouseSceneComponent = HSCManager.getSingleton().createHouseSceneComponent();
			comp.parseRes(hcr);
			comp.load();
			
			var tf : HouseSceneFloor = _house.GetFloor(comp.FloorNo);
			if(tf)
			{
				var tg:HouseSceneGrid = tf.GetGrid(comp.X, comp.Z);
				if(tg)
				{
					comp.lay(tg, comp.Face, comp.Height);
				}
			}
			
			//
			var mapping : HouseComponentLogicMapping = new HouseComponentLogicMapping();
			mapping.InstId = comp.InstId;
			mapping.CompUid = comp.Uid;
			
			_houseComponentLogicMappingTable.Add(comp.InstId, mapping);
		}

	}
	
	private function configSkyboxAndFog()
	{
		if (_sceneConfig.EnableUseSkyBoxAndFog)
		{
			AmbientMgr.getSingleton().openFog(true);
			AmbientMgr.getSingleton().setFogColor(_sceneConfig.FogColor1, _sceneConfig.FogColor2);
			AmbientMgr.getSingleton().setFogDensity(_sceneConfig.FogDensity1, _sceneConfig.FogDensity2);
			AmbientMgr.getSingleton().setFogStartEnd(_sceneConfig.FogStartDistance1, _sceneConfig.FogEndDistance1, _sceneConfig.FogStartDistance2, _sceneConfig.FogEndDistance2);
			AmbientMgr.getSingleton().setSky(_sceneConfig.SkyBox1, _sceneConfig.SkyBox2);
		}
		else
		{
			AmbientMgr.getSingleton().openFog(false);
			AmbientMgr.getSingleton().setSky(null, null);
		}
		AmbientMgr.getSingleton().setSceneAmbient(_sceneConfig.AmbientColor1, _sceneConfig.AmbientColor2);
		AmbientMgr.getSingleton().syncDayNight(false);
	}

}