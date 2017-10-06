import iGUI;

private static var instance : iGUICode_SettingPanelUI;
function Awake(){
	instance=this;
	mSettingMgr = getPlayerSettingMgr();
	NetHelper.RegistHandler(new notify_player_setting(), handlePlayerSetting);
}
static function getInstance(){
	return instance;
}
@HideInInspector
var low_quality_btn : iGUIButton;
@HideInInspector
var high_quality_btn : iGUIButton;
@HideInInspector
var cull_close_btn : iGUIButton;
@HideInInspector
var cull_open_btn : iGUIButton;
@HideInInspector
var divorce_btn : iGUIButton;
@HideInInspector
var welcome_setup_btn : iGUIButton;
@HideInInspector
var music_close_btn : iGUIButton;
@HideInInspector
var music_open_btn : iGUIButton;
@HideInInspector
var frame : iGUIPanel;
@HideInInspector
var root : iGUIRoot;



private var mAutoClosed : boolean = true;
private var mIsOpened : boolean = false;
private var mSettingMgr : PlayerSettingMgr = null;
//--------------------------------------------------
private static var mPlayerSettingMgr : PlayerSettingMgr = null;
public static function getPlayerSettingMgr() : PlayerSettingMgr
{
	if (null == mPlayerSettingMgr)
	{
		mPlayerSettingMgr = Camera.main.GetComponent("PlayerSettingMgr");
	}
	return mPlayerSettingMgr;
}
//--------------------------------------------------
function Start()
{
	music_open_btn.clickCallback = ClickCallback_music_open_btn;
	music_close_btn.clickCallback = ClickCallback_music_close_btn;
	welcome_setup_btn.clickCallback = ClickCallback_welcome_setup_btn;
	divorce_btn.clickCallback = ClickCallback_divorce_btn;
	cull_open_btn.clickCallback = ClickCallback_cull_open_btn;
	cull_close_btn.clickCallback = ClickCallback_cull_close_btn;
	high_quality_btn.clickCallback = ClickCallback_high_quality_btn;
	low_quality_btn.clickCallback = ClickCallback_low_quality_btn;
}
//--------------------------------------------------
function Update()
{
	if (mAutoClosed && Input.GetMouseButtonUp(0))
	{
		mIsOpened = false;
		frame.setEnabled(false);
	}
	else
	{
		mAutoClosed = true;
	}
}
//--------------------------------------------------
function ClickCallback_music_open_btn(caller : iGUIElement)
{
	mSettingMgr.setSetting("music", audio_status_type.ast_close);
	mAutoClosed = false;
}
//--------------------------------------------------
function ClickCallback_music_close_btn(caller : iGUIElement)
{
	mSettingMgr.setSetting("music", audio_status_type.ast_open);
	mAutoClosed = false;
}
//--------------------------------------------------
function ClickCallback_welcome_setup_btn(caller : iGUIElement)
{
	iGUICode_WelcomeRoot.OpenWelcomeRoot();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_OPEN_SETUPWIN));
}
//--------------------------------------------------
function ClickCallback_divorce_btn(caller : iGUIElement)
{
	if (true == caller.userData)	// 单身
	{
		mAutoClosed = false;
	}
	else
	{
		Divorce.getInstance().openDivorceUI(1);
	}
}
//--------------------------------------------------
function ClickCallback_cull_open_btn(caller : iGUIElement)
{
	mSettingMgr.setSetting("cull", 0);
	mAutoClosed = false;
}
//--------------------------------------------------
function ClickCallback_cull_close_btn(caller : iGUIElement)
{
	mSettingMgr.setSetting("cull", 1);
	mAutoClosed = false;
}
//--------------------------------------------------
function ClickCallback_high_quality_btn(caller : iGUIElement)
{
	mSettingMgr.setSetting("quality", 0);
	mAutoClosed = false;
}
//--------------------------------------------------
function ClickCallback_low_quality_btn(caller : iGUIElement)
{
	mSettingMgr.setSetting("quality", 1);
	mAutoClosed = false;
}
//--------------------------------------------------
private function changeDivorce() : void
{
	var isSingle : boolean = DataCenter.isMainPlayerSingle();
	var normal : String = isSingle ? "fenshou_g" : "fenshou";
	var hover : String = isSingle ? "fenshou_g" : "fenshou_h";
	var active : String = isSingle ? "fenshou_g" : "fenshou";
	divorce_btn.userData = isSingle;
	divorce_btn.style.normal.background = Resources.Load("UISkins/Textures/MainUI/" + normal);
	divorce_btn.style.hover.background = Resources.Load("UISkins/Textures/MainUI/" + hover);
	divorce_btn.style.active.background = Resources.Load("UISkins/Textures/MainUI/" + active);
}
//--------------------------------------------------
private function changeMusic(open : int) : void
{
	mSettingMgr.setMusicStatus(open);
	if (audio_status_type.ast_open == open)		// 打开音乐
	{
		mSettingMgr.SetMusicCtrl(true);
		mSettingMgr.playMusic("main");
		music_open_btn.setEnabled(true);
		music_close_btn.setEnabled(false);
	}
	else										// 关闭音乐
	{
		mSettingMgr.SetMusicCtrl(false);
		mSettingMgr.stopMusic();
		music_open_btn.setEnabled(false);
		music_close_btn.setEnabled(true);
	}
}
//--------------------------------------------------
private function changeCull(open : int) : void
{
//	cull_open_btn.enabled = false;
//	cull_close_btn.enabled = false;
	if (1 == open)		// 打开剔除
	{
		ObjectCull.CullEnable = true;
		cull_open_btn.setEnabled(true);
		cull_close_btn.setEnabled(false);
	}
	else				// 关闭剔除
	{
		ObjectCull.CullEnable = false;
		cull_open_btn.setEnabled(false);
		cull_close_btn.setEnabled(true);
	}
}
//--------------------------------------------------
private function changeQuality(high : int) : void
{
	if (1 == high)		// 高品质
	{
		Global.changeQuality(true);
		high_quality_btn.setEnabled(true);
		low_quality_btn.setEnabled(false);
	}
	else				// 低品质
	{
		Global.changeQuality(false);
		high_quality_btn.setEnabled(false);
		low_quality_btn.setEnabled(true);
	}
	ScenePlayerMgr.getInstance().setHighLowQuality(1 == high);
}
//--------------------------------------------------
private function handlePlayerSetting(evt:GameEvent, pack:notify_player_setting) : void
{
	// 声音模块
	changeMusic(mSettingMgr.getSetting("music", pack));
	// 物件剔除模块
	changeCull(mSettingMgr.getSetting("cull", pack));
	// 品质模型
	changeQuality(mSettingMgr.getSetting("quality", pack));
}
//--------------------------------------------------
private function openFrame(x : float, y : float) : void
{
	mAutoClosed = false;
	if (mIsOpened)
	{
		mIsOpened = false;
		frame.setEnabled(false);
	}
	else
	{
		mIsOpened = true;
		frame.setEnabled(true);
		frame.setX(x);
		frame.setY(y - frame.positionAndSize.height);
		changeDivorce();
	}
}
//--------------------------------------------------
// 参数:右下角坐标
public static function openSettingPanel(x : float, y : float, init : boolean) : void
{
	if (false == UI.isUIRootOpen("SettingPanelUI"))
	{
		UI.getUI().OpenUIRoot("SettingPanelUI");
	}
	if (init)
	{
		iGUICode_SettingPanelUI.getInstance().frame.setEnabled(false);
	}
	else
	{
		iGUICode_SettingPanelUI.getInstance().openFrame(x, y);
	}
}
//--------------------------------------------------


