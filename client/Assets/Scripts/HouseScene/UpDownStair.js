/*--------------------------------------------------
楼上楼下(2012/8/14 created by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast



private static var mInstance : UpDownStair = null;
private var mTransmitGrids : Array = new Array();
private var mTransmitParticles : Array = new Array();


//--------------------------------------------------
function Awake()
{
	mInstance = this;
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_CREATE_OTHER_PLAYER), handlePlayerLoadFinished);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_HOUSE_COMP_LOAD_FINISHED), handleHouseCompLoadFinished);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_GIFT_BOX_LOAD_FINISHED), handleGiftBoxLoadFinished);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_TRANSFORM_PARTICLE_LOAD_FINIESHED), handleTransformParticleLoadFinished);
}
//--------------------------------------------------
public static function getInstance() : UpDownStair
{
	if (null == mInstance)
	{
		throw new Exception("UpdownStair -> instance is null!");
	}
	return mInstance;
}
//--------------------------------------------------
// 玩家模型加载结束
function handlePlayerLoadFinished(evt:GameEvent, obj:GameObject)
{
	// 玩家在二楼,当前观察1楼,隐藏玩家
	if (2 == getFloorNumByPos(obj.transform.position) && 1 == getViewFloorNum())
	{
		var p : Player = obj.GetComponent("Player");
		p.setVisible(false);
	}
}
//--------------------------------------------------
// 房屋部件加载结束
function handleHouseCompLoadFinished(evt:GameEvent, obj:HouseSceneComponent)
{
	// 家具在二楼,当前观察1楼,隐藏家具
	if (2 == obj.FloorNo && 1 == getViewFloorNum())
	{
		obj.setVisible(false);
	}
}
//--------------------------------------------------
// 礼盒模型加载结束
function handleGiftBoxLoadFinished(evt:GameEvent, obj:GameObject)
{
	// 礼盒在二楼,当前观察1楼,隐藏礼盒
	if (2 == getFloorNumByPos(obj.transform.position) && 1 == getViewFloorNum())
	{
		CommFunc.setGameObjVisible(obj, false);
	}
}
//--------------------------------------------------
// 传送点粒子加载结束
function handleTransformParticleLoadFinished(evt:GameEvent, obj:TransmitParticleAsynLoad)
{
	// 传送点粒子在二楼,当前观察1楼,隐藏礼盒
	if (2 == obj.getFloor() && 1 == getViewFloorNum())
	{
		obj.setVisible(false);
	}
}
//--------------------------------------------------
// 切换楼上楼下
public function changeUpDownStairs() : void
{
	var scene : HouseScene = getHouseScene();
	if (null == scene)
		return;
	
	var cur_view : int = 0;
	switch (scene.WalkViewFloor.FloorNO)
	{
	case 1:				// 当前看楼下,准备看楼上
		cur_view = scene.UpView() ? 2 : 0;
		viewUpStairs();
		break;
	case 2:				// 当前看楼上,准备看楼下
		cur_view = scene.DownView() ? 1 : 0;
		viewDownStairs();
		break;
	}
	iGUICode_MainUI.getInstance().setUpDownStairsBtnStatus(0==cur_view?false:true, cur_view);
}
//--------------------------------------------------
// 观察楼下
private function viewDownStairs() : void
{
	setUpStairsPlayersVisible(false);
	setUpStairsFurnituresVisible(false);
	setUpStairsTransmitGridsVisible(false);
	setDownStairsPlayersVisisble(true);
	setDownStairsFurnituresVisible(true);
	GiftLogic.getInstance().setUpStairsGiftBoxModelsVisible(false);
}
//--------------------------------------------------
// 观察楼上
private function viewUpStairs() : void
{
	setUpStairsPlayersVisible(true);
	setUpStairsFurnituresVisible(true);
	setUpStairsTransmitGridsVisible(true);
	GiftLogic.getInstance().setUpStairsGiftBoxModelsVisible(true);
}
//--------------------------------------------------
// 显示/隐藏楼上的所有玩家(不包括主玩家)
private function setUpStairsPlayersVisible(visible : boolean) : void
{
	var player_arr : Array = getPlayersByFloorNum(2);
	for (var pObj : GameObject in player_arr)
	{
		var p : Player = pObj.GetComponent("Player");
		p.setVisible(visible);
	}
}
//--------------------------------------------------
// 显示/隐藏楼下的所有玩家(不包括主玩家)
private function setDownStairsPlayersVisisble(visible : boolean) : void
{
	var player_arr : Array = getPlayersByFloorNum(1);
	for (var pObj : GameObject in player_arr)
	{
		var p : Player = pObj.GetComponent("Player");
		p.setVisible(visible);
	}
}
//--------------------------------------------------
// 显示/隐藏楼上的所有家具
private function setUpStairsFurnituresVisible(visible : boolean) : void
{
	var furniture_arr : Array = getFurnituresByFloorNum(2);
	for (var comp : HouseSceneComponent in furniture_arr)
	{
		if (null == comp)
			continue;
		
		// 有可能在家装摆放时,对二楼的家具进行操作
		if (comp.Template.Contains("door"))		// 门做特殊处理
			continue;
		
		comp.setVisible(visible);
	}
}
//--------------------------------------------------
// 显示/隐藏楼下的所有家具
private function setDownStairsFurnituresVisible(visible : boolean) : void
{
	var furniture_arr : Array = getFurnituresByFloorNum(1);
	for (var comp : HouseSceneComponent in furniture_arr)
	{
		if (null == comp)
			continue;
		
		// 有可能在家装摆放时,对二楼的家具进行操作
		if (comp.Template.Contains("door"))		// 门做特殊处理
			continue;
		
		comp.setVisible(visible);
	}
}
//--------------------------------------------------
// 显示/隐藏楼上的传送点
private function setUpStairsTransmitGridsVisible(visible : boolean) : void
{
	for (var par : TransmitParticleAsynLoad in mTransmitParticles)
	{
		if (2 == par.getFloor())
			par.setVisible(visible);
	}
}
//--------------------------------------------------
// 添加传送格子
public function addTransmitGrid(hsg : HouseSceneGrid) : void
{
	if (false == isTransmitGrid(hsg) || "" == hsg.Param1)
		return;
	
	for (var arr : Array in mTransmitGrids)
	{
		var flag : boolean = false;
		for (var grid : HouseSceneGrid in arr)
		{
			if (hsg.Param1 == grid.Param1)
			{
				flag = true;
				break;
			}
		}
		if (flag)
		{
			arr.Add(hsg);
			return;
		}
	}
	var g_arr : Array = new Array();
	g_arr.Add(hsg);
	mTransmitGrids.Add(g_arr);
}
//--------------------------------------------------
// 添加传送粒子效果
public function addTransmitParticle() : void
{
	for (var arr : Array in mTransmitGrids)
	{
		var par : TransmitParticleAsynLoad = new TransmitParticleAsynLoad(getCenterPos(arr));
		mTransmitParticles.Add(par);
	}
}
//--------------------------------------------------
// 清除传送粒子效果
public function clearTransmitParticle() : void
{
	for (var par : TransmitParticleAsynLoad in mTransmitParticles)
	{
		par.destroyRes();
	}
	mTransmitParticles.Clear();
	mTransmitGrids.Clear();
}
//--------------------------------------------------
// 获取房屋对象
public static function getHouseScene() : HouseScene
{
	var scene_type : SceneType = EQGameSceneMgr.getSingleton().gameSceneType();
	if (SceneType.PLAYER_HOUSE == scene_type)
	{
		return EQSceneManager.getSingleton().HouseSceneObj;
	}
	if (SceneType.COMM_SCENE == scene_type || SceneType.PUB_SCENE == scene_type)
	{
		return EQSceneManager.getSingleton().LoveHomeSceneObj._house;
	}
	return null;
}
//--------------------------------------------------
// 获取位置所在格子
public static function getGrid(pos : Vector3) : HouseSceneGrid
{
	var scene : HouseScene = getHouseScene();
	if (null == scene)
		return null;
	
	return scene.gridByPosition(pos);
}
//--------------------------------------------------
// 获取位置所在楼层编号
public static function getFloorNumByPos(pos : Vector3) : int
{
	var grid : HouseSceneGrid = getGrid(pos);
	if (grid)
		return grid.Creator.FloorNO;
	
	return 1;
}
//--------------------------------------------------
// 获取楼层数
public static function getFloorNums() : int
{
	var scene : HouseScene = getHouseScene();
	if (scene)
	{
		return scene.Floors.Count;
	}
	return 0;
}
//--------------------------------------------------
// 获取当前观察的楼层编号
public static function getViewFloorNum() : int
{
	var scene : HouseScene = getHouseScene();
	if (scene && scene.WalkViewFloor)
	{
		return scene.WalkViewFloor.FloorNO;
	}
	return 1;
}
//--------------------------------------------------
// 位置是否在当前观察楼层
public static function isPosInViewFloor(pos : Vector3) : boolean
{
	return getFloorNumByPos(pos) == getViewFloorNum();
}
//--------------------------------------------------
// 获取在某一层的所有玩家(不包括主玩家)
public static function getPlayersByFloorNum(num : int) : Array
{
	var player_arr : Array = new Array();
	if (num < 1)
		return player_arr;
	
	var player_list : Hashtable = ScenePlayerMgr.getPlayerList();
	for (var kv : DictionaryEntry in player_list)
	{
		var pObj : GameObject = kv.Value;
		if (num == getFloorNumByPos(pObj.transform.position))
			player_arr.Add(pObj);
	}
	return player_arr;
}
//--------------------------------------------------
// 获取某一层的所有家具
public static function getFurnituresByFloorNum(num : int) : Array
{
	var house : PlayerHouse = EQGameSceneMgr.getSingleton().getHouse();
	if (house)
		return house.getComponentsByFloor(num);
	
	return new Array();
}
//--------------------------------------------------
// 设置主玩家显示/隐藏
public static function setMainPlayerVisible(first_person : boolean) : void
{
	var mplayer : GameObject = ScenePlayerMgr.getMainPlayer();
	if (null == mplayer)
		return;
	
	var p : Player = mplayer.GetComponent("Player");
	var mp : MainPlayer = mplayer.GetComponent("MainPlayer");
	if (null == p || null == mp)
		return;
	
	mp.setFirstPerson(first_person);
	// step1: 楼上楼下
	var floor_num : int = getFloorNumByPos(mplayer.transform.position);
	if (1 == getViewFloorNum() && 1 != floor_num)	// 当前观察一楼且主玩家不在一楼
	{
		p.setVisible(false);
		return;
	}
	// step2: 第一人称
	if (getHouseScene())	// 游戏一开始进去人物有时会隐藏,添加这句是为了让第一人称在房屋生成时才有效
	{
		p.setVisible(!first_person);
	}
}
//--------------------------------------------------
// 格子是否是传送点
public static function isTransmitGrid(grid : HouseSceneGrid) : boolean
{
	if (null == grid)
		return false;
	
	return 137 == grid.Type;
}
//--------------------------------------------------
// 获取与hsg对应的传送点
public static function getTransmitGrids(hsg : HouseSceneGrid) : Array
{
	var arr : Array = new Array();
	var scene : HouseScene = getHouseScene();
	if (null == hsg || null == scene)
	{
		return arr;
	}
	var hsg_spts : String[] = hsg.Param1.Split([",", ", "], StringSplitOptions.RemoveEmptyEntries);
	if (2 != hsg_spts.Length)
	{
		return arr;
	}
	for (var floor : HouseSceneFloor in scene.Floors.Values)
	{
		for (var grid : HouseSceneGrid in floor.Grids.Values)
		{
			if (false == isTransmitGrid(grid))	// 过滤掉非传送格子
				continue;
			
			var grid_spts : String[] = grid.Param1.Split([",", ", "], StringSplitOptions.RemoveEmptyEntries);
			if (2 == grid_spts.Length && hsg_spts[1] == grid_spts[0])
				arr.Add(grid);
		}
	}
	return arr;
}
//--------------------------------------------------
// 获取几个格子的中心点
public static function getCenterPos(grid_arr : Array) : Vector3
{
	var x_min : float = 0.0f;
	var x_max : float = 0.0f;
	var z_min : float = 0.0f;
	var z_max : float = 0.0f;
	var y_total : float = 0.0f;
	for (var i:int=0; i<grid_arr.Count; ++i)
	{
		var grid : HouseSceneGrid = grid_arr[i];
		var pos : Vector3 = grid.GetPosition(Space.World);
		if (0 == i)
		{
			x_min = pos.x; x_max = pos.x;
			z_min = pos.z; z_max = pos.z;
		}
		if (pos.x < x_min) { x_min = pos.x; }
		if (pos.x > x_max) { x_max = pos.x; }
		if (pos.z < z_min) { z_min = pos.z; }
		if (pos.z > z_max) { z_max = pos.z; }
		y_total += pos.y;
	}
	return Vector3((x_min+x_max)/2, y_total/grid_arr.Count, (z_min+z_max)/2);
}
//--------------------------------------------------







class TransmitParticleAsynLoad
{
	private var mPos : Vector3 = Vector3.zero;
	private var mTransmitParticle : GameObject = null;
	private var mModelLoader : ModelLoader = null;
	private var mVisible : boolean = true;
	private var mFloor : int = 0;
	
	public function TransmitParticleAsynLoad(pos : Vector3)
	{
		mPos = pos;
		var fullDir : String = "Model/Particle/transmissiongate.prefab.u3d";	// 粒子的完整路径
		mModelLoader = Global.GetModelLoaderMgr().AsynLoadModel(fullDir, onLoadFinished, true, true);
	}
	
	private function onLoadFinished(obj : ModelLoader) : void
	{
		mTransmitParticle = obj.mModelObj;
		mTransmitParticle.transform.position = mPos + Vector3(0.0f, 0.01f, 0.0f);
		mTransmitParticle.SetActiveRecursively(mVisible);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_TRANSFORM_PARTICLE_LOAD_FINIESHED), this);
	}
	
	public function destroyRes() : void
	{
		GameObject.Destroy(mTransmitParticle);
		mModelLoader.Destroy();
	}
	
	public function setVisible(visible : boolean) : void
	{
		if (null == mTransmitParticle || visible == mVisible)
			return;
		
		mVisible = visible;
		mTransmitParticle.SetActiveRecursively(visible);
	}
	
	public function getFloor() : int
	{
		if (0 == mFloor)
		{
			mFloor = UpDownStair.getFloorNumByPos(mPos);
		}
		return mFloor;
	}
}


