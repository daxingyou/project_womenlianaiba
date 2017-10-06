#pragma strict
#pragma downcast

/* 需要全局处理的东西. 可以放在这里. 这个脚本挂在Global物件下,会和游戏一起启动.
 */
static var UrlRoot : String = "";//"http://10.35.16.79/WebEQGame/";
static var ErrorMsg : String = "";
static var SysTooltip : TooltipBuild = null;
static var SysKeyWordShield : KeyWordShield = null;
private static var m_asynResourceMgr:AsynResourceMgr = null;
private static var m_modelLoaderMgr:ModelLoaderMgr = null;
private static var m_onHandleChatMgr : OnHandleChatScript = null;
private static var m_SysMsgHandler : SysMsgHandler = null;
private static var m_NewPlayGuideModule : NewPlayGuideModule = null;
private static var mPlatResLoaderMgr:PlatResLoaderMgr = null;

static var AppType : String = "";
static var OpenID : String = "";
static var OpenKey : String = "";
static var CustomOpenID : String = "";
static var PFKey : String = "";
static var IopenID : String = "";
static var mGiftRandomTime : float = 5.0f;
static var CH:int = 0;
static var Srvid:int = 0;
public static var m_SysTime : stime;
public static var mCurVisitHouseAccount : String = "";
//--------------------------------------------------
function Awake()
{
	Application.ExternalCall("initUnityParameters", null);
//	AppType = "yy";		// 编辑器状态下要测YY平台时,得打开这个,同时登陆界面那里也要设置YY平台类型
	m_asynResourceMgr = this.gameObject.GetComponent(AsynResourceMgr);
	m_modelLoaderMgr = this.gameObject.GetComponent(ModelLoaderMgr);
	m_onHandleChatMgr = this.gameObject.GetComponent(OnHandleChatScript);
	m_SysMsgHandler = gameObject.GetComponent(SysMsgHandler);
	m_NewPlayGuideModule = gameObject.GetComponent(NewPlayGuideModule);
	mPlatResLoaderMgr = this.gameObject.GetComponent(PlatResLoaderMgr);
}
//--------------------------------------------------
function Start()
{
//	var mgr = GetComponent(AsynResourceMgr);
//	var testMgr:TestAsynResourceMgr = new TestAsynResourceMgr();
//	testMgr.test(mgr);
	
	SysTooltip = new TooltipBuild();
	SysKeyWordShield = new KeyWordShield("keyword");
}
//--------------------------------------------------
function Update()
{
//	garbageCollection();
}
//--------------------------------------------------
// 垃圾回收
private function garbageCollection()
{
	if (0 == Time.frameCount % 30)	// 每30帧回收一次
	{
		System.GC.Collect();
	}
}
//--------------------------------------------------
public static function webPrint(message : String)
{
	Application.ExternalCall("showUnityMessage", message);
}
//
function setType(appType:String)
{
	AppType = appType;
	webPrint("app type:" + appType);
}
//
function SetCustomOpenID(openID : String){
	CustomOpenID = openID;
	webPrint("CustomOpenID:" + CustomOpenID);
}
//
function setOpenID(openID:String)
{
	OpenID = openID;
	//print1("openID:" + openID);
	webPrint("OpenID:" + OpenID);
}
//
function setOpenKey(openKey:String)
{
	OpenKey = openKey;
	//print1("openKey:" + openKey);
	webPrint("OpenKey:" + OpenKey);
}
//
function setPFKey(pFKey:String)
{
	PFKey = pFKey;
	//print1("openKey:" + openKey);
	webPrint("PFKey:" + PFKey);
}
//
function setIOpenID(iopenID:String)
{
	IopenID = iopenID;
	//print1("openKey:" + openKey);
	webPrint("IopenID:" + IopenID);
}
//
function setSrvid(srvid:int)
{
	Srvid = srvid;
	//print1("appType:" + appType);
	webPrint("Srvid:" + Srvid);
}
//
function setCH(ch:int)
{
	CH = ch;
	//print1("appType:" + appType);
	webPrint("channnel:" + CH);
}
// 提供全局访问异步资源管理器的接口
public static function GetAsynResMgr():AsynResourceMgr
{
	return m_asynResourceMgr;
}
// 提供全局访问ModelLoaderMgr的接口
public static function GetModelLoaderMgr():ModelLoaderMgr
{
	return m_modelLoaderMgr;
}
public static function GetHandleChatMgr():OnHandleChatScript
{
	return m_onHandleChatMgr;
}
//
public static function GetSysMsgHandler():SysMsgHandler
{
	return m_SysMsgHandler;
}
//
public static function GetNewPlayGuideMgr():NewPlayGuideModule
{
	return m_NewPlayGuideModule;
}
//
public static function GetPlatResLoaderMgr():PlatResLoaderMgr
{
	return mPlatResLoaderMgr;
}
//--------------------------------------------------
public static function GetSysTooltip() : TooltipBuild {
	return SysTooltip;
}

public static function GetKeyWordShield() : KeyWordShield {
	return SysKeyWordShield;
}
// log (2011/12/17 add by hezhr)
public static function Log(obj:Object)
{
	if (Application.platform == RuntimePlatform.WindowsEditor)
	{
		Debug.Log(obj);
	}
	if (Application.platform==RuntimePlatform.WindowsWebPlayer)
	{
		if (obj)
			Debug.Log(obj);
		else
			Debug.Log("NULL");
	}
}
// log warning
public static function LogWarning(obj:Object)
{
	if (Application.platform == RuntimePlatform.WindowsEditor)
	{
		Debug.LogWarning(obj);
	}
	if (Application.platform==RuntimePlatform.WindowsWebPlayer && obj)
	{
		if (obj)
			Debug.LogWarning(obj);
		else
			Debug.LogWarning("NULL");
	}
}
// log error
public static function LogError(obj:Object)
{
	if (Application.platform == RuntimePlatform.WindowsEditor)
	{
		Debug.LogError(obj);
	}
	if (Application.platform==RuntimePlatform.WindowsWebPlayer && obj)
	{
		if (obj)
			Debug.LogError(obj);
		else
			Debug.LogError("NULL");
	}
}
//
public static function SetCurVisitHouseAccount(account : String){
	mCurVisitHouseAccount = account;
}
//
public static function GetCurVisitHouseAccount() : String{
	return mCurVisitHouseAccount;
}
//--------------------------------------------------
// 限制文本长度
public static function limitTextLength(text : String, length : int, def_text : String, suf_text : String) : String
{
	/*
		1.如果text为"",则返回默认值def_text
		2.如果长度超过length,则截取,并在后缀加上suf_text
	*/
	if (null==text || ""==text)
		return def_text;
	
	if (text.Length > length)
		return text.Substring(0, length) + suf_text;
	
	return text;
}
//--------------------------------------------------
// 判断stime是否为空
public static function isStimeNull(tm : stime) : boolean
{
	if (null == tm)
		return true;
	
	if (0==tm.year && 0==tm.month && 0==tm.day && 0==tm.hour && 0==tm.minute && 0==tm.second)
		return true;
	
	return false;
}
//--------------------------------------------------
// 比较stime大小;pref<next,返回<0;pref==next,返回0;pref>next,返回>0
public static function compareStime(pref : stime, next : stime) : int
{
	var date_pref : System.DateTime = new System.DateTime(pref.year, pref.month, pref.day, pref.hour, pref.minute, pref.second);
	var date_next : System.DateTime = new System.DateTime(next.year, next.month, next.day, next.hour, next.minute, next.second);
	return System.DateTime.Compare(date_pref, date_next);
}
public static function compareStime(pref : System.DateTime, next : stime) : int
{
	var date_next : System.DateTime = new System.DateTime(next.year, next.month, next.day, next.hour, next.minute, next.second);
	return System.DateTime.Compare(pref, date_next);
}
public static function compareStime(pref : stime, next : System.DateTime) : int
{
	var date_pref : System.DateTime = new System.DateTime(pref.year, pref.month, pref.day, pref.hour, pref.minute, pref.second);
	return System.DateTime.Compare(date_pref, next);
}
public static function compareStime(pref : System.DateTime, next : System.DateTime) : int
{
	return System.DateTime.Compare(pref, next);
}
//--------------------------------------------------
// 获取sitme的差值,返回[日, 时, 分, 秒]
public static function subtractStime(pref : stime, next : stime) : System.TimeSpan
{
	var date_pref : System.DateTime = new System.DateTime(pref.year, pref.month, pref.day, pref.hour, pref.minute, pref.second);
	var date_next : System.DateTime = new System.DateTime(next.year, next.month, next.day, next.hour, next.minute, next.second);
	return date_pref.Subtract(date_next);
}
public static function subtractStime(pref : System.DateTime, next : stime) : System.TimeSpan
{
	var date_next : System.DateTime = new System.DateTime(next.year, next.month, next.day, next.hour, next.minute, next.second);
	return pref.Subtract(date_next);
}
public static function subtractStime(pref : stime, next : System.DateTime) : System.TimeSpan
{
	var date_pref : System.DateTime = new System.DateTime(pref.year, pref.month, pref.day, pref.hour, pref.minute, pref.second);
	return date_pref.Subtract(next);
}
public static function subtractStime(pref : System.DateTime, next : System.DateTime) : System.TimeSpan
{
	return pref.Subtract(next);
}
//--------------------------------------------------
public static function changeQuality(high : boolean) : void
{
	QualitySettings.SetQualityLevel(high ? 5 : 1, true);
	Camera.main.renderingPath = high ? RenderingPath.UsePlayerSettings : RenderingPath.VertexLit;
}
//--------------------------------------------------
public static function isHighQuality() : boolean
{
	return RenderingPath.UsePlayerSettings == Camera.main.renderingPath;
}
//--------------------------------------------------
function setUserName(name: String): void
{
    Login.setUserName(name);
}
//--------------------------------------------------
function setUserSex(sex: String): void
{
    Login.setUserSex(sex);
}
//--------------------------------------------------
function showCreatePlayerUI(arg: String): void
{
    Login.showCreatePlayerUI();
}
//--------------------------------------------------
function externalVisitFriendHouse(openID : String){
	if(openID != ""){
		PlayerFriend.GetInstance().ReqEnterFriendHouse(openID, enter_house_type.eht_friend_list);
	}
}
//--------------------------------------------------
public static function getChannelSysBoardLabel() : iGUILabel{
	if(iGUICode_VoiceChannelUI.getInstance())
		return iGUICode_VoiceChannelUI.getInstance().getChannelSystomBoardLabel();
	
	return null;
}
