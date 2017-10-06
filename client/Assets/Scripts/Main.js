#pragma strict
#pragma downcast
import System;



// 游戏运行状态
enum GameState
{
	GS_PREPARE, 		// 下载器准备
	GS_LOAD, 			// 初使资源下载
	GS_INIT, 			// 初使化
	GS_LOGIN, 			// 登入
	GS_CREATE_PLAYER,	// 创建角色
	GS_GAME 			// 游戏中
};

var UIObj : UI;
var gridTexture : Texture;
var tmpItemIcon : Texture;
var tmpItemPTypeIcon : Texture;

private var mAsynResMgr : AsynResourceMgr = null;
private var mTempHouseData : house_info = null;
private var mStartLoadRes : boolean = false;
public static var state : GameState = GameState.GS_PREPARE;

private var mConfigFile : String = "Config.txt";
private var mListFile : String = "Filelist.xml.u3d";
private var mSummFile : String = "FLSummary.xml";

//--------------------------------------------------
// 异常信息捕获函数
function HandleLog (logString : String, stackTrace : String, type : LogType)
{
	// 只捕获异常
	if(type != LogType.Exception)
		return;

    if(!logString.Contains("load error")){
    	ShowError.error_type = 0;
    }
	else{
		ShowError.error_type = 1;
	}
	
    Global.ErrorMsg += Define.exceptionmsg + "：\n    " + logString + "\n";
    Global.ErrorMsg += Define.stackmsg + "：\n    " + stackTrace;

    // 发送异常信息到服务器
	InformationCollect.sendExceptionInfo(Global.OpenID, Global.ErrorMsg);
    // 跳入异常显示场景
    Application.LoadLevel(1);
}
//--------------------------------------------------
private static var mInstance : Main = null;
//--------------------------------------------------
public static function getInstance() : Main
{
	if (null == mInstance)
	{
		mInstance = GameObject.Find("Main Camera").GetComponent("Main");
	}
	return mInstance;
}
//--------------------------------------------------
function Awake()
{
	// 在编辑器模式下不进行异常信息捕获
	if (!(Application.platform == RuntimePlatform.OSXEditor || Application.platform == RuntimePlatform.WindowsEditor))
	{
		Application.RegisterLogCallback(HandleLog);
	}
	// 事件注册
	registEvents();
}
//--------------------------------------------------
function Start()
{
	// 显示loading界面
	LoadingUIMgr.openEnterGameLoadingUI();
	// init manager
	mAsynResMgr = ResManager.getAsyResMgr();
	// to load config file
	var w : WWW;
	if (Application.platform == RuntimePlatform.OSXWebPlayer || Application.platform == RuntimePlatform.WindowsWebPlayer)
		w = new WWW(AsynResourceMgr.fullUrlWebPlayer(mConfigFile + "?r=" + UnityEngine.Random.value.ToString()));
	else if (Application.platform == RuntimePlatform.OSXEditor || Application.platform == RuntimePlatform.WindowsEditor)
		w = new WWW(AsynResourceMgr.fullUrlWebPlayer(mConfigFile));

	yield w;
	
	var check : boolean = true;
	if (null == w.error)
	{
		ConfigMgr.Init(w.text);
		check = ConfigMgr.GetValue("CheckFileVer") == "1" ? true : false;
	}
	
	// check file version
	if (check)
	{
		// 文件列表改为存放在resources目录下
		var flStr : TextAsset = UnityEngine.Resources.Load("Filelist");
		loadFVList(flStr.text, mAsynResMgr.fileVers, "P", "V");
		
//		// to load FLSummary file
//		w = new WWW(AsynResourceMgr.fullUrlWebPlayer(mSummFile));
//		yield w;
//		
//		var fvs : Dictionary.<String, int> = new Dictionary.<String, int>();
//		if(w.error == null)
//		{
//			loadFVList(w.text, fvs, "Path", "Ver");
//		}
//		
//		// to load update list file
//		var v : int = -1;
//		if(fvs.ContainsKey(mListFile))
//			v = fvs[mListFile];
//		if(-1 == v)
//			w = new WWW(AsynResourceMgr.fullUrlWebPlayer(mListFile));
//		else
//			w = WWW.LoadFromCacheOrDownload(AsynResourceMgr.fullUrlWebPlayer(mListFile), v);
//		yield w;
//		
//		if(w.error == null)
//		{
//			loadFVList(w.assetBundle.mainAsset.text, mAsynResMgr.fileVers, "P", "V");
//		}
//		Debug.Log("=================== Main.js -> Start() -> verson = "+v+" =================");
	}
	else
	{
		Debug.LogWarning("*** update list file check skipped ***");
	}
	startLoadRes();
}
//--------------------------------------------------
function Update()
{
	switch(state)
	{
	case GameState.GS_GAME:
		EQSceneManager.getSingleton().update();
		break;
	}
	
	if (Input.GetKeyUp(KeyCode.F1))
	{
		DebugConsole.IsOpen = !DebugConsole.IsOpen;
	}
}
//--------------------------------------------------
private function loadFVList(xmlStr : String, fvlist : Dictionary.<String, int>, pk : String, vk : String) : void
{
	var xd : XmlDocument = new XmlDocument();
	xd.LoadXml(xmlStr);
	
	for (var r : XmlElement in xd.DocumentElement.ChildNodes)
	{
		fvlist.Add(r.SelectSingleNode(pk).InnerText, int.Parse(r.SelectSingleNode(vk).InnerText));
	}
}
//--------------------------------------------------
// 事件注册
private function registEvents() : void
{
	NetHelper.RegistHandler(new notify_enter_player_house(), handle_notify_enter_player_house);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOUSE_LOAD_OK), handle_house_load_ok);
}
//--------------------------------------------------
// 进入玩家房屋消息
function handle_notify_enter_player_house(evt:GameEvent, pack:notify_enter_player_house)
{
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LEAVE_SCENE));

	var enterPos:Vector3 = Vector3(pack.enter_pos.x, pack.enter_pos.y, pack.enter_pos.z);
	ScenePlayerMgr.getMainPlayer().transform.position = enterPos;
	ScenePlayerMgr.clearPlayer();
	
	Debug.LogWarning("=== houseid: "+pack.data.house_id+", level: "+pack.data.level);
	
	// 1.加载默认房屋
	EQGameSceneMgr.getSingleton().enterPlayerHouseScene(pack.house_tplt_id);
	// 2.保存房屋数据到临时地方
	mTempHouseData = pack.data;
}
//--------------------------------------------------
// 开始下载资源
public function startLoadRes() : void
{
	if (mStartLoadRes)
		return;
	
	mStartLoadRes = true;
	ResManager.getInstance().BeforeStartLoad();
	ResManager.getInstance().StartLoad(beforeInit, initState, initFinished);
	state = GameState.GS_LOAD;
}
//--------------------------------------------------
// 房屋模型加载完成
function handle_house_load_ok(evt:GameEvent, obj:System.Object)
{
	// 保存房屋数据
	EQGameSceneMgr.getSingleton().recHousedata(mTempHouseData);
	BuffLogic.request_get_buff();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_HOUSE_SCENE));	
}
//--------------------------------------------------
// 成功进入场景
public function enter_scene_ok() : void
{
	state = GameState.GS_GAME;
}
//--------------------------------------------------
// 初使化资源管理器的初使化下载完成，在进入数据初使化前触发
function beforeInit() : void
{
	state = GameState.GS_INIT;
}
//--------------------------------------------------
// 初使化资源管理器的下载状态回调，每成功下载一个文件都会触发
function initState(url : String, cur : int, total : int) : void
{
}
//--------------------------------------------------
// 初使化资源管理器的初使化琥完成回调
function initFinished() : void
{
	LoadingUIMgr.closeLoadingUI();
	if(Application.platform == RuntimePlatform.WindowsEditor)
	{
		UI.getUI().OpenUIRoot("LoginUI");
	}
	else
	{
		Login.connect(Global.OpenID, Global.OpenKey, ConfigMgr.GetValue("host"), ConfigMgr.GetValue("port"), Global.AppType, Global.PFKey, Global.IopenID, Global.CH, Global.Srvid);
	}
	state = GameState.GS_LOGIN;
	mAsynResMgr.resourceAutoDelete();
}
//--------------------------------------------------
public function getGameState() : GameState
{
	return state;
}
//--------------------------------------------------

