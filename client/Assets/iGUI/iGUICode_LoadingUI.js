#pragma strict
#pragma downcast
import iGUI;

private static var instance : iGUICode_LoadingUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var tip : iGUILabel;
@HideInInspector
var progress_stripe : iGUILabel;
@HideInInspector
var heart : iGUILabel;
@HideInInspector
var text : iGUILabel;
@HideInInspector
var progress : iGUILabel;
@HideInInspector
var frame : iGUIPanel;
@HideInInspector
var background : iGUILabel;
@HideInInspector
var root : iGUIRoot;


// 加载游戏资源所需变量
private var mMain : Main = null;
private var mResMgr : ResManager;
// 加载公共场景所需变量
private var mBeginLoadCommonSceneTime : float = 0.0f;
public var LoadCommonSceneTime : float = 5.0f;



function Start()
{
	setProgress(0, 1);
	switch (LoadingUIMgr.getLoadingType())
	{
	case LoadingType.ENTER_GAME:
		tip.style.normal.background = Resources.Load("UISkins/Textures/loading/tip");
		mMain = GameObject.FindWithTag("MainCamera").GetComponent("Main");
		mResMgr = ResManager.getInstance();
		break;
	case LoadingType.ENTER_COMMON_SCENE:
		tip.style.normal.background = Resources.Load("UISkins/Textures/loading/ggloading");
		mBeginLoadCommonSceneTime = Time.time;
		break;
	}
}

function OnGUI()
{
	switch (LoadingUIMgr.getLoadingType())
	{
	case LoadingType.ENTER_GAME:
		loadGame();
		break;
	case LoadingType.ENTER_COMMON_SCENE:
		loadCommonScene();
		break;
	}
}
//--------------------------------------------------
// 设置进度条
private function setProgress(cur : int, total : int) : void
{
	if (0 == cur)
	{
		text.label.text = "0%";
		return;
	}
	if (0 == total)
	{
		return;
	}
	text.label.text = (cur * 100 / total).ToString() + "%";
	var width : float = cur * 232.0f / total;
	if (width >= 5)
	{
		progress.enabled = true;
	}
	progress.setWidth(width);
	heart.setX(progress.rect.xMax - frame.rect.x - heart.rect.width/2);
}
//--------------------------------------------------
// 加载游戏资源
private function loadGame() : void
{
	switch (mMain.getGameState())
	{
	case GameState.GS_PREPARE:
		break;
	case GameState.GS_LOAD:
		setProgress(mResMgr.GetLoadCount(), mResMgr.GetLoadTotal());
		break;
	case GameState.GS_INIT:
		setProgress(1, 1);
		break;
	}
}
//--------------------------------------------------
// 加载公共场景
private function loadCommonScene() : void
{
	var time_diff : float = Time.time - mBeginLoadCommonSceneTime;
	if (time_diff <= LoadCommonSceneTime*0.8)
	{
		setProgress(time_diff, LoadCommonSceneTime);
	}
	else
	{
		setProgress(8, 10);
	}
}
//--------------------------------------------------





// 加载类型
enum LoadingType
{
	ENTER_GAME = 1,				// 进入游戏
	ENTER_COMMON_SCENE =2,		// 进入公共场景
}



class LoadingUIMgr
{
	private static var mLoadingType : LoadingType = LoadingType.ENTER_GAME;
	//--------------------------------------------------
	// 获取加载类型
	public static function getLoadingType() : LoadingType
	{
		return mLoadingType;
	}
	//--------------------------------------------------
	// 打开进入游戏加载界面
	public static function openEnterGameLoadingUI() : void
	{
		mLoadingType = LoadingType.ENTER_GAME;
		openLoadingUI();
	}
	//--------------------------------------------------
	// 打开进入公共场景加载界面
	public static function openEnterCommonSceneLoadingUI() : void
	{
		mLoadingType = LoadingType.ENTER_COMMON_SCENE;
		openLoadingUI();
	}
	//--------------------------------------------------
	// 打开加载界面
	private static function openLoadingUI() : void
	{
		UI.getUI().OpenUIRoot("LoadingUI");
		UI.getUI().SetModal("LoadingUI", true);
	}
	//--------------------------------------------------
	// 关闭加载界面
	public static function closeLoadingUI() : void
	{
		UI.getUI().SetModal("LoadingUI", false);
		UI.getUI().CloseUIRoot("LoadingUI");
	}
	//--------------------------------------------------
}


