import iGUI;

private static var instance : iGUICode_WallComingUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var time_bar_thumb : iGUILabel;
@HideInInspector
var panel_time_bar : iGUIPanel;
@HideInInspector
var arrow_icon7 : iGUILabel;
@HideInInspector
var arrow_icon6 : iGUILabel;
@HideInInspector
var arrow_icon5 : iGUILabel;
@HideInInspector
var arrow_icon4 : iGUILabel;
@HideInInspector
var arrow_icon3 : iGUILabel;
@HideInInspector
var arrow_icon2 : iGUILabel;
@HideInInspector
var arrow_icon1 : iGUILabel;
@HideInInspector
var panel_arrow_icons : iGUIPanel;
@HideInInspector
var close_btn : iGUIButton;
@HideInInspector
var panel_control : iGUIPanel;
@HideInInspector
var texture_bottom : iGUIImage;
@HideInInspector
var panel_bottom : iGUIPanel;
@HideInInspector
var texture_center : iGUIImage;
@HideInInspector
var panel_center : iGUIPanel;
@HideInInspector
var texture_top : iGUIImage;
@HideInInspector
var panel_top : iGUIPanel;
@HideInInspector
var texture_main : iGUIImage;
@HideInInspector
var panel_main : iGUIPanel;
@HideInInspector
var frame : iGUIPanel;
@HideInInspector
var root : iGUIRoot;


private var ARROW_NUM : int = 7;						// 键值的最多数量
private var mKeyArray : Array = new Array();			// 所有键值
private var mCurKeyIndex : int = 0;						// 当前监听的键值索引
private var mTimeBarBeginTime : float = 0.0f;			// 时间轴开始时间
private var mTimeBarSpeed : float = 0.0f;				// 时间轴滚动速度
private var mTimeBarLife : float = 0.0f;				// 时间轴行走时间
//--------------------------------------------------
function Start()
{
	// 界面事件注册
	close_btn.clickCallback = ClickCallback_close_btn;
	//
	registerEvents();
	//
	mKeyArray.Add(1);
	mKeyArray.Add(1);
	mKeyArray.Add(1);
	mKeyArray.Add(1);
	mKeyArray.Add(1);
	mKeyArray.Add(1);
	mKeyArray.Add(1);
	setArrowIcon(mKeyArray);
	WallComingLogic.getInstance().startListenKeyCode(mKeyArray, 3.0);
	startTimeBar(3.0);
}
//--------------------------------------------------
function Update()
{
	updateTimeBar();
}
//--------------------------------------------------
function OnDestroy()
{
	unregisterEvents();
}
//--------------------------------------------------
function ClickCallback_close_btn(caller : iGUIElement)
{
	WallComingLogic.getInstance().closeWallComingUI();
}
//--------------------------------------------------
private function registerEvents() : void
{
	WallComingLogic.Ctrl.Register("MATCH_KEY_CODE", matchKeyCode);
}
//--------------------------------------------------
private function unregisterEvents() : void
{
	WallComingLogic.Ctrl.Unregister("MATCH_KEY_CODE", matchKeyCode);
}
//--------------------------------------------------
private function matchKeyCode(match : boolean) : void
{
	if (match)
	{
		updateArrowIcon(mKeyArray);
	}
}
//--------------------------------------------------
// 设置方向图片
private function setArrowIcon(keyArr : Array) : void
{
	if (keyArr.Count > ARROW_NUM)
		throw "iGUICode_WallComingUI -> setArrowIcon(Array) -> key count [" + keyArr.Count + "] is out of max length.";
	
	// step1.重设索引值
	mCurKeyIndex = 0;
	// step2.清空
	for (var i:int = 0; i<ARROW_NUM; ++i)
	{
		getArrowIcon(i).setEnabled(false);
	}
	// step3.设置为未按下时的图片
	for (var j:int = 0; j<keyArr.Count; ++j)
	{
		WallComingLogic.getInstance().setArrowIcon(getArrowIcon(j), keyArr[j], false);
	}
}
//--------------------------------------------------
// 更新方向图片
private function updateArrowIcon(keyArr : Array) : void
{
	if (mCurKeyIndex >= keyArr.Count)
		throw "iGUICode_WallComingUI -> updateArrowIcon(Array) -> cur key index [" + mCurKeyIndex + "] is out of key count [" + keyArr.Count + "].";
	
	// step1.设置为按下时的图片
	WallComingLogic.getInstance().setArrowIcon(getArrowIcon(mCurKeyIndex), keyArr[mCurKeyIndex], true);
	// step2.索引自增
	++mCurKeyIndex;
}
//--------------------------------------------------
// 根据索引获取方向图片控件
private function getArrowIcon(index : int) : iGUILabel
{
	if (0 == index) return arrow_icon1;
	if (1 == index) return arrow_icon2;
	if (2 == index) return arrow_icon3;
	if (3 == index) return arrow_icon4;
	if (4 == index) return arrow_icon5;
	if (5 == index) return arrow_icon6;
	// 6 == index
	return arrow_icon7;
}
//--------------------------------------------------
// 开始时间轴
private function startTimeBar(life : int) : void
{
	time_bar_thumb.setX(time_bar_thumb.rect.width/2);
	mTimeBarBeginTime = Time.time;
	mTimeBarSpeed = (panel_time_bar.rect.width - time_bar_thumb.rect.width)/life;
	mTimeBarLife = life;
}
//--------------------------------------------------
// 更新时间轴
private function updateTimeBar() : void
{
	if (0.0f == mTimeBarBeginTime)
		return;
	
	// 时间到
	if (Time.time - mTimeBarBeginTime > mTimeBarLife)
	{
		mTimeBarBeginTime = 0.0f;
		return;
	}
	time_bar_thumb.rect.x += Time.deltaTime * mTimeBarSpeed;
}
//--------------------------------------------------


