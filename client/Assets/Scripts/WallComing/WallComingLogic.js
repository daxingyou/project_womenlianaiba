#pragma strict
#pragma downcast
import iGUI;

/*--------------------------------------------------
墙来了(2012/12/28 create by hezhr)
--------------------------------------------------*/
private var mHideUIArray : Array;							// 被隐藏的界面
private var mSceneObj : GameObject = null;					// 场景
private var mKeyArray : Array = new Array();				// 键值数组(1.up,2.down,3.left,4.right)
private var mKeyLifeTime : float = 0.0f;					// 按键时间
private var mKeyStartTime : float = 0.0f;					// 开始计时时间
private var mKeyOver : boolean = false;						// 按键是否全部按完
public static var Ctrl : Controller = new Controller();		// 控制器
public var ScenePrefab : GameObject = null;					// 场景预制件
public var NoHideUIRoots : String[];						// 打开界面不隐藏deroot



//--------------------------------------------------
private static var instance : WallComingLogic;
function Awake()
{
	instance = this;
	registerEvents();
}
//--------------------------------------------------
function Update()
{
	listenKeyCode();
}
//--------------------------------------------------
public static function getInstance() : WallComingLogic
{
	return instance;
}
//--------------------------------------------------
// 注册事件
private function registerEvents() : void
{
	// 网络消息事件
}
//--------------------------------------------------
// 创建场景
private function createWallComingScene() : void
{
	if (null == ScenePrefab)
	{
		throw Exception("WallComingLogic -> createWallComingScene() -> Scene Prefab is null.");
	}
	mSceneObj = GameObject.Instantiate(ScenePrefab);
	for (var cam : Camera in mSceneObj.GetComponentsInChildren(Camera, true))
	{
		cam.renderingPath = Camera.main.renderingPath;
	}
	AmbientMgr.getSingleton().setMode(AmbientMode.AM_CHANGE);
}
//--------------------------------------------------
// 销毁场景
private function destroyWallComingScene() : void
{
	GameObject.Destroy(mSceneObj);
	AmbientMgr.getSingleton().setMode(AmbientMode.AM_NORMAL);
}
//--------------------------------------------------
// 打开界面
public function openWallComingUI() : void
{
	mHideUIArray = UI.getUI().EnableUIRootIgnore(NoHideUIRoots, false);
	UI.getUI().OpenUIRoot("WallComingUI");
	UI.getUI().SetModal("WallComingUI", true);
	createWallComingScene();
}
//--------------------------------------------------
// 关闭界面
public function closeWallComingUI() : void
{
	destroyWallComingScene();
	UI.getUI().SetModal("WallComingUI", false);
	UI.getUI().CloseUIRoot("WallComingUI");
	UI.getUI().EnableUIRoot(mHideUIArray, true);
	mHideUIArray.Clear();
}
//--------------------------------------------------
// 播放角色模型动作
public function playAvatarAni(avatar : WallComingAvatar, ani : String) : void
{
	if (null == avatar)
		return;
	
	avatar.playAni(ani);
}
//--------------------------------------------------
// 设置方向键图标,arrow:1.up,2.down,3.left,4.right
public function setArrowIcon(label : iGUILabel, arrow : int, down : boolean) : void
{
	var icon : String = "";
	if (down)	// 该方向键被按下
	{
		if (1 == arrow) { icon = "up_h"; }
		else if (2 == arrow) { icon = "down_h"; }
		else if (3 == arrow) { icon = "left_h"; }
		else if (4 == arrow) { icon = "right_h"; }
	}
	else		// 该方向键未被按下
	{
		if (1 == arrow) { icon = "up_n"; }
		else if (2 == arrow) { icon = "down_n"; }
		else if (3 == arrow) { icon = "left_n"; }
		else if (4 == arrow) { icon = "right_n"; }
	}
	label.style.normal.background = Resources.Load("UISkins/Textures/wall_coming/" + icon);
	label.setEnabled(true);
}
//--------------------------------------------------
// 开始监听按键
public function startListenKeyCode(arr : Array, life : float) : void
{
	// step1.设置按键值
	mKeyArray.Clear();
	for (var key : int in arr)
	{
		mKeyArray.Add(key);
	}
	// step2.
	mKeyOver = false;
	mKeyLifeTime = life;
	mKeyStartTime = Time.time;
}
//--------------------------------------------------
// 监听按键
private function listenKeyCode() : void
{
	if (0.0f == mKeyStartTime)
		return;
	
	// 时间到
	if (Time.time - mKeyStartTime > mKeyLifeTime)
	{
		mKeyStartTime = 0.0f;
		// 发送监听时间结束事件,true.全部按完,false.未按完
		Ctrl.Excute("LISTEN_KEY_TIME_OUT", mKeyOver);
		return;
	}
	var key : int = 0;
	if (Input.GetKeyDown(KeyCode.UpArrow)) { key = 1; }
	else if (Input.GetKeyDown(KeyCode.DownArrow)) { key = 2; }
	else if (Input.GetKeyDown(KeyCode.LeftArrow)) { key = 3; }
	else if (Input.GetKeyDown(KeyCode.RightArrow)) { key = 4; }
	if (false == mKeyOver && 0 != key)
	{
		mKeyOver = matchKeyCode(key);
	}
}
//--------------------------------------------------
// 匹配按键
private function matchKeyCode(key : int) : boolean
{
	if (0 == mKeyArray.Count)
		return true;
	
	var match : boolean = false;
	if (key == mKeyArray[0])
	{
		mKeyArray.RemoveAt(0);
		match = true;
	}
	// 每按下一次按键,就发送是否匹配成功事件
	Ctrl.Excute("MATCH_KEY_CODE", match);
	var key_over : boolean = 0 == mKeyArray.Count;
	if (key_over)
	{
		// 发送全部匹配成功事件
		Ctrl.Excute("MATCH_ALL_OVER", null);
	}
	return key_over;
}
//--------------------------------------------------


