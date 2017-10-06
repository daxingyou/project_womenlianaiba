/*--------------------------------------------------
场景管理器(2012/5/24 modify by hezhr)
--------------------------------------------------*/
#pragma strict


// 场景状态
enum SceneState
{
	SS_NORMAL,		// 正常
	SS_DECORATE		// 家装
};



class EQSceneManager
{
	var HouseSceneObj : HouseScene = null;			
	var LoveHomeSceneObj : LoveHomeScene = null;	//当这个指针不为空时候, HouseSceneObj一定是指针引用
	private static var singleton : EQSceneManager = null;
	private var sceneState : SceneState = SceneState.SS_NORMAL;
	private var lastUpdateHouseScene : float = 0;
	//--------------------------------------------------
	public static function getSingleton() : EQSceneManager
	{
		if (null == singleton)
		{
			singleton = new EQSceneManager();
		}
		return singleton;
	}
	//--------------------------------------------------
	// 获取场景状态(正常,家装)
	public function getState() : SceneState
	{
		return sceneState;
	}
	//--------------------------------------------------
	// 加载房屋和场景(这个为旧版的加载方式)
	public function loadHouseAndScene(houseObjName : String, houseFileName : String) : void
	{
		HouseSceneObj = new HouseScene();
		HouseSceneObj.CreateHouseSceneNode();
		HouseSceneObj.LoadFromString(houseObjName, houseFileName);
		
		AmbientMgr.getSingleton().openFog(false);
		AmbientMgr.getSingleton().setSky(null, null);
		AmbientMgr.getSingleton().syncDayNight(false);
	}
	//--------------------------------------------------
	// 加载新版的场景, 可以带房屋场景
	public function loadLoveHomeScene(sceneName:String)
	{
		LoveHomeSceneObj = new LoveHomeScene(sceneName);
	}
	//--------------------------------------------------
	public function initLoveHomeScene()
	{
		LoveHomeSceneObj.initScene();
	}
	//--------------------------------------------------
	// 删除场景
	public function destroyScene() : void
	{
		//如果有LoveHomeSceneObj. 会把房屋也设置为空
		if(LoveHomeSceneObj)
		{
			LoveHomeSceneObj.destroy();
			LoveHomeSceneObj = null;
			HouseSceneObj = null;
		}
		
		if(HouseSceneObj)
		{
			HouseSceneObj.Destroy();
			HouseSceneObj = null;
		}
		// 重新设置
		AmbientMgr.getSingleton().resetAmbient();
	}
	//--------------------------------------------------
	// 每帧更新
	public function update() : void
	{
		if (null == HouseSceneObj)
			return;
		
		// 1/4秒更新一次场景
		var curr = Time.time;
		if (curr - lastUpdateHouseScene > 0.25)
		{
			HouseSceneObj.Update();
			lastUpdateHouseScene = curr;
		}
		//
		PickMgr.getSingleton().mouseMove(Input.mousePosition);
		//
		switch (sceneState)
		{
		case SceneState.SS_NORMAL:
			break;
		case SceneState.SS_DECORATE:
			_handleDecorate();
			break;
		}
	}
	//--------------------------------------------------
	// 开始家装操作
	public function startDecorate() : void
	{
		sceneState = SceneState.SS_DECORATE;
	}
	//--------------------------------------------------
	// 结束家装操作
	public function endDecorate() : void
	{
		sceneState = SceneState.SS_NORMAL;
	}
	//--------------------------------------------------
	// 处理家装的逻辑,每帧处理
	private function _handleDecorate() : void
	{
		if (false == iGUICode_StorageBoxUI.canFitment)
			return;
		
		if (UI.getUI().IsMouseOverUI())	// 鼠标在界面上
		{
			if (false == iGUICode_StorageBoxUI.getInstance().shop.isMouseOver)
				return;
			
			if (false == iGUICode_StorageBoxUI.getInstance().isControlUIOpen())	// 非旋转状态下
			{
				var leftButtonDown : boolean = Input.GetMouseButtonDown(0);		// 鼠标左键按下
				FitmentEventMgr.getSingleton().handleFitmentLogic(leftButtonDown);
			}
		}
		else	// 鼠标不在界面上
		{
			FitmentEventMgr.getSingleton().MouseMove(Input.mousePosition);
			if (Input.GetMouseButtonDown(0))
			{
				FitmentEventMgr.getSingleton().LButtonDown(Input.mousePosition);
			}
			else if (Input.GetMouseButtonUp(0))
			{
				FitmentEventMgr.getSingleton().LButtonUp(Input.mousePosition);
			}

//			if (Input.GetKeyDown(KeyCode.Delete))
//				fitEvent.KeyDown(KeyCode.Delete);
//			else if (Input.GetKeyDown(KeyCode.Escape))
//				fitEvent.KeyDown(KeyCode.Escape);	
		}
	}
	//--------------------------------------------------
}


