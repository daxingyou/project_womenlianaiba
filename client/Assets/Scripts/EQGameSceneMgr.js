/*--------------------------------------------------
场景管理器(2012/5/25 modify by hezhr)
--------------------------------------------------*/
#pragma strict

// 场景类型
enum SceneType
{
	NONE,
	PLAYER_HOUSE,		// 玩家房屋
	PUB_SCENE,			// 酒吧场景
	COMM_SCENE			// 公共场景
};


class EQGameSceneMgr
{
	//////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////
	private static var mSingleton : EQGameSceneMgr;
	
	public static function getSingleton() : EQGameSceneMgr
	{
		if (null == mSingleton)
		{
			mSingleton = new EQGameSceneMgr();
		}
		return mSingleton;
	}
	//////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////
	
	private var mSceneType : SceneType = SceneType.NONE;
	private var mCommonSceneID : int = 0;
	private var mPlayerHouseRow : PlayerHouseRow = null;
	private var mSceneBornRow : BornRow = null;
	private var mGameScene : EQGameScene = null;
	private var mHouseData : house_info = null;
	//--------------------------------------------------
	function EQGameSceneMgr()
	{
		EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LOVE_SCENE_LOAD_OK), loveSceneLoadOK);
	}
	//--------------------------------------------------
	// 获取场景类型
	public function gameSceneType() : SceneType
	{
		return mSceneType;
	}
	//--------------------------------------------------
	public function GetCommonSceneID() : int {
		return mCommonSceneID;
	}
	//--------------------------------------------------
	// 获取房屋场景信息
	public function getPlayerHouseRow() : PlayerHouseRow
	{
		return mPlayerHouseRow;
	}
	//--------------------------------------------------
	// 和当前房屋比较房屋等级
	public function compareHouseLevel(houseLevel : int) : int
	{
		// -1,当前房屋等级<传进来的房屋等级;0,相等;1,当前房屋等级>传进来的房屋等级
		if (null == mPlayerHouseRow)
			return -1;
		
		// 房屋等级==-1表示为正无穷大
		var curHouseLevel : int = mPlayerHouseRow.right_grade;
		if (-1 == curHouseLevel)
			return -1 == houseLevel ? 0 : 1;
		else
			return -1 == houseLevel ? -1 : (curHouseLevel == houseLevel ? 0 : (curHouseLevel > houseLevel ? 1 : -1));
	}
	//--------------------------------------------------
	// 获取场景对应的出生信息
	public function getSceneBornRow() : BornRow
	{
		return mSceneBornRow;
	}
	//--------------------------------------------------
	// 获取房屋数据
	public function getHouseData() : house_info
	{
		return mHouseData;
	}
	//--------------------------------------------------
	// 销毁场景
	private function destroyScene() : void
	{
		mSceneType = SceneType.NONE;
		mPlayerHouseRow = null;
		mSceneBornRow = null;
		mHouseData = null;
		EQSceneManager.getSingleton().destroyScene();
		if (mGameScene)
		{
			mGameScene.Destroy();
			mGameScene = null;
		}
	}
	//--------------------------------------------------
	// 初始摄像机相关参数
	private function initCamera(born_id : int) : void
	{
		var row : BornRow = ResManager.LgtMgr.getBornRow(born_id);
		mSceneBornRow = row;
		// 设置
		var cam : EQCamera = EQCamera.getInstance();
		cam.farClip(row.farclip);
		cam.viewField(row.field);
		cam.lookAt(row.lookat);
		cam.pitch(row.pitch);
		cam.yaw(row.yaw);
		cam.zoom(row.zoom);
	}
	//--------------------------------------------------
	// 进入酒吧场景
	public function enterPubScene(template_id : int) : void
	{
		destroyScene();
		//设置场景类型
		mSceneType = SceneType.PUB_SCENE;
		mCommonSceneID = template_id;
		//全局阻塞
		GlobalBlock.startBlock(false);
		//异步加载场景
		var row : CommSceneRow = ResManager.LgtMgr.getCommonSceneRow(template_id);
		EQSceneManager.getSingleton().loadLoveHomeScene(row.scene_name);
		//处理镜头
		initCamera(row.born_id);
	}
	//--------------------------------------------------
	// 进入公共场景
	public function enterCommScene(template_id : int) : void
	{
		destroyScene();
		//设置场景类型
		mSceneType = SceneType.COMM_SCENE;
		mCommonSceneID = template_id;
		//全局阻塞
		GlobalBlock.startBlock(false);
		//异步加载场景
		var row : CommSceneRow = ResManager.LgtMgr.getCommonSceneRow(template_id);
		EQSceneManager.getSingleton().loadLoveHomeScene(row.scene_name);
		//处理镜头
		initCamera(row.born_id);
		//打开加载loading界面
		LoadingUIMgr.openEnterCommonSceneLoadingUI();
	}
	//--------------------------------------------------
	//TODO:增加通过.unity文件进入房屋的办法
	//--------------------------------------------------
	private function changePlayerHouseScene(houseObjName : String, houseFileName : String) : void
	{
		destroyScene();
		//设置场景类型
		mSceneType = SceneType.PLAYER_HOUSE;
		//文件名和扩展名
		var splits : String[] = houseObjName.Split("."[0]);
		var sceneName : String = splits[0];
		var extName : String = splits[1];
		
		//判断加载方式
		if (extName == "unity")			//用新的场景方式加载
		{
			//全局阻塞
			GlobalBlock.startBlock(true);
			//异步加载场景
			EQSceneManager.getSingleton().loadLoveHomeScene(sceneName);
		}
		else							//用原始的方式处理
		{
			//这函数里面会启动全局阻塞
			EQSceneManager.getSingleton().loadHouseAndScene(houseObjName, houseFileName);
			mGameScene = new PlayerHouse(EQSceneManager.getSingleton().HouseSceneObj);
		}
	}
	//--------------------------------------------------
	//以后会增加新的接口
	public function enterPlayerHouseScene(house_id : int) : void
	{
		var phr : PlayerHouseRow = ResManager.LgtMgr.PlayerHouseTable[house_id] as PlayerHouseRow;
		if (null == phr)
			throw "EQGameSceneMgr -> enterPlayerHouseScene(int) -> can't find '" + house_id + "' in house_tplt.xml";
		// step1:
		HouseSceneRoomMgr.getInstance().init(house_id);
		changePlayerHouseScene(phr.model, phr.struct_info);
		// step2:
		mPlayerHouseRow = phr;
		//处理镜头
		initCamera(phr.born_id);
	}
	//--------------------------------------------------
	// 保存场景数据
	public function recHousedata(data : house_info) : void
	{
		var ph : PlayerHouse = mGameScene as PlayerHouse;
		mHouseData = data;
		ScenePlayerMgr.setMainPlayerHouseData(data);
		if (ph)
		{
			ph.createHousedata(data);
		}
	}
	//--------------------------------------------------
	// 保存更新等级
	public function updateHouseDataLevel(level : int) : void
	{
		if (null == mHouseData)
			return;
		
		mHouseData.level = level;
	}
	//--------------------------------------------------
	// 获取房屋
	public function getHouse() : PlayerHouse
	{
		return mGameScene as PlayerHouse;
	}
	//--------------------------------------------------
	// 获取公共场景
	public function getCommScene(): CommScene
	{
		return mGameScene as CommScene;
	}
	//--------------------------------------------------
	// 获取房屋id
	public function GetSceneHouseID() : UInt64
	{
	    if (mHouseData == null)
	        return 0;
		
		return mHouseData.house_id;
	}
	//--------------------------------------------------
	
	//---------------事件------------
	//love scene加载完成
	private function loveSceneLoadOK(evt:GameEvent, obj:System.Object) : void
	{
		//初始化场景
		EQSceneManager.getSingleton().initLoveHomeScene();
		//创建场景
		createGameScene();
		//全局阻塞结束
		GlobalBlock.endBlock();
		//
		notifyEnterCommOrHouseScene();
	}
	//--------------------------------------------------
	private function createGameScene() : void
	{
		if (mSceneType == SceneType.PLAYER_HOUSE)
		{
			mGameScene = new PlayerHouse(EQSceneManager.getSingleton().HouseSceneObj);
		}
		else if (mSceneType == SceneType.COMM_SCENE || mSceneType == SceneType.PUB_SCENE)
		{
			mGameScene = new CommScene(EQSceneManager.getSingleton().LoveHomeSceneObj);
		}
	}
	//--------------------------------------------------
	//通知进入何种场景
	private function notifyEnterCommOrHouseScene() : void
	{
		if (mSceneType == SceneType.PLAYER_HOUSE)
		{
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOUSE_LOAD_OK));	
		}
		else if (mSceneType == SceneType.COMM_SCENE)
		{
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_COMMON_SCENE));	
		}
		else if (mSceneType == SceneType.PUB_SCENE)
		{
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_PUB_SCENE));	
		}
	}
	//--------------------------------------------------
}


