import iGUI;

private static var instance : iGUICode_BuffUIRoot;

private var mBuffList : Array = null;

private var mRefreshTime : int = 500;					// 刷新间隔 微秒
private var mShowTooltips : boolean = false;			// 当前是否显示Tooltips
private var mSelectBuff : BuffInfo = null;				// 当前鼠标悬停的buff
private var mCtrl : Controller = new Controller();		// 控制器

var buffInfoStyle : GUIStyle;
function Awake(){
	instance=this;
}

function Start()
{
	init();
}

static function getInstance(){
	return instance;
}

private function init() : void
{
	registEvent();
	RegistCallback();
	createTimer();

	initBuffIcon();
	RefreshBuffIcon();
}

private function initBuffIcon() : void
{
	var buffIconRes : String[] = ["buff_1.png.u3d", "buff_2.png.u3d", "buff_3.png.u3d", "buff_4.png.u3d", "buff_5.png.u3d", "buff_6.png.u3d", "buff_7.png.u3d"];
	// 初始化界面	
	for(var i : int = 0; i < 7;  i++)
	{
		var element : iGUIElement[] = getItemCtrl(i);
		element[0].passive = true;
		element[1].enabled = false;
		element[2].enabled = false;
		element[2].label.text = "";
		var icon : BuffIcon = new BuffIcon(element[0] as iGUIImage, buffIconRes[i]);
	}
}

private function registEvent() : void
{
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_TRANSFORM_REFRESH_REMAIN_TIME), HandleNotifyRefreshTransform);
}

// 刷新变身buff
function HandleNotifyRefreshTransform(evt:GameEvent, obj:int) 
{
	var element : iGUIElement[] = getItemCtrl(6);
	if(obj == 0)
	{
		element[0].passive = true;
		element[1].enabled = false;
		element[2].enabled = false;
		element[0].image = null;
		element[2].label.text = "";
	}
	else
	{
		var mTransformObj : EffectAvatarRow = iGUICode_MainUI.getInstance().getEffectAvatar();
		element[0].passive = false;
		element[1].enabled = true;
		element[2].enabled = true;	
		element[0].image = Resources.Load("UISkins/Textures/MainUI/"+mTransformObj.icon);
		element[2].label.text = "";
		element[2].label.text = BuffLogic.convertSecondToString(obj);
	}	
}

private function createTimer() : void
{
	var timer = this.gameObject.AddComponent("TimerEx");
	timer.init(mRefreshTime, 0, Refresh, null, null);
	timer.start();
}

private function Refresh() : void
{
	mBuffList = BuffLogic.getBuffList();
	
	RefreshBuffInfo();
	if(mShowTooltips)
		RefreshTooltips();
}

// 刷新BUFF界面的时间
private function RefreshBuffInfo() : void
{
	for(var i:int = 0; i < mBuffList.length; i++)
	{
		var buff : BuffInfo = mBuffList[i];
		var second : int = BuffLogic.getLeftSecond(buff);		
		var buffRow : NewBuffRow = BuffLogic.getBuffRow(buff.data.id);
		var element : iGUIElement[] = getItemCtrl(buffRow.type - 1);
		if(second < buff.data.rest_time)
		{
			element[0].userData = buff;
			element[0].passive = false;
			element[1].enabled = true;
			element[2].enabled = true;
			element[2].label.text = BuffLogic.convertSecondToString(buff.data.rest_time - second);
		}
		else
		{
			element[0].userData = null;
			element[0].passive = true;
			element[1].enabled = false;
			element[2].enabled = false;
			element[2].label.text = "";
			// 移除过期的buff
			//BuffLogic.removeTimeoutBuff();			
		}
	}
}

// 刷新BUFF的图标 
public function RefreshBuffIcon() : void
{
	initBuffIcon();
	mBuffList = BuffLogic.getBuffList();
	
	for(var i:int = 0; i < mBuffList.length; i++)
	{
		var buff : BuffInfo = mBuffList[i];
		var second : int = BuffLogic.getLeftSecond(buff);		
		var buffRow : NewBuffRow = BuffLogic.getBuffRow(buff.data.id);
		var element : iGUIElement[] = getItemCtrl(buffRow.type - 1);
		var iconRes = "";
		if(second <= buff.data.rest_time)
		{
			iconRes = buffRow.normal_icon;
			var icon : BuffIcon = new BuffIcon(element[0] as iGUIImage, iconRes);
		}
	}
}

// 刷新Tooltips上的信息
private function RefreshTooltips() : void
{
	if(mSelectBuff != null)
	{
		str = getHintString(mSelectBuff);
		var arr : ArrayList = Global.GetSysTooltip().GetContent();
		if(arr[0])
			arr[0].object.label = GUIContent(str);
	}
}

private function RegistCallback()
{
	closeBtn.clickCallback = clickCallback_closeBtn;
	buffIcon1.mouseOverCallback = mouseOverCallback_Buff;
	buffIcon2.mouseOverCallback = mouseOverCallback_Buff;
	buffIcon3.mouseOverCallback = mouseOverCallback_Buff;
	buffIcon4.mouseOverCallback = mouseOverCallback_Buff;
	buffIcon5.mouseOverCallback = mouseOverCallback_Buff;
	buffIcon6.mouseOverCallback = mouseOverCallback_Buff;
	buffIcon7.mouseOverCallback = mouseOverCallback_Transform;
	buffIcon1.mouseOutCallback = mouseOutCallback_Buff;
	buffIcon2.mouseOutCallback = mouseOutCallback_Buff;
	buffIcon3.mouseOutCallback = mouseOutCallback_Buff;
	buffIcon4.mouseOutCallback = mouseOutCallback_Buff;
	buffIcon5.mouseOutCallback = mouseOutCallback_Buff;
	buffIcon6.mouseOutCallback = mouseOutCallback_Buff;
	buffIcon7.mouseOutCallback = mouseOutCallback_Buff;
}

private function destroy()
{
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_TRANSFORM_REFRESH_REMAIN_TIME), HandleNotifyRefreshTransform);
	if(mBuffList)
	{
		mBuffList = null;
	}
}

private function clickCallback_closeBtn(caller : iGUIElement)
{	
	destroy();
	UI.getUI().SetModal("BuffUIRoot", false);
	UI.getUI().CloseUIRoot("BuffUIRoot");
}

private function mouseOverCallback_Buff(caller : iGUIElement)
{
	var str : String = "";
	if(caller.userData != null)
	{
		var buff : BuffInfo = caller.userData as BuffInfo;
		mSelectBuff = buff;		
		str = getHintString(buff);
	}
	if(str != "")
	{
		Global.GetSysTooltip().Begin(caller);
		Global.GetSysTooltip().Add(GUIContent(str), buffInfoStyle);
		Global.GetSysTooltip().Show(false);
		mShowTooltips = true;
	}
}

private function getHintString(buff : BuffInfo) : String
{
	var buffRow : NewBuffRow = BuffLogic.getBuffRow(buff.data.id);
	return buffRow.hint;
	//var second : int = BuffLogic.getLeftSecond(buff);
	//return buffRow.hint + "\n剩余时间:" + BuffLogic.convertSecondToString(buff.data.rest_time - second);
}

private function mouseOverCallback_Transform(caller : iGUIElement)
{

	var str : String = Define.getContent(5222);
	Global.GetSysTooltip().Begin(caller);
	Global.GetSysTooltip().Add(GUIContent(str), buffInfoStyle);
	Global.GetSysTooltip().Show(false);
}

private function mouseOutCallback_Buff(caller : iGUIElement)
{
	mSelectBuff = null;
	mShowTooltips = false;
	Global.GetSysTooltip().Hide();
}

private function getItemCtrl(index : int) : iGUIElement[]
{
	switch(index)
	{
	case 0:
		return [buffIcon1, timeText1, buffTime1];
	case 1:
		return [buffIcon2, timeText2, buffTime2];
	case 2:
		return [buffIcon3, timeText3, buffTime3];
	case 3:
		return [buffIcon4, timeText4, buffTime4];
	case 4:
		return [buffIcon5, timeText5, buffTime5];
	case 5:	
		return [buffIcon6, timeText6, buffTime6];
	case 6:
		return [buffIcon7, timeText7, buffTime7];
	}
}

@HideInInspector
var buffUIRoot : iGUIRoot;

@HideInInspector
var buffPanel1 : iGUIPanel;
@HideInInspector
var buffMainPanel : iGUIPanel;

@HideInInspector
var closeBtn : iGUIButton;

@HideInInspector
var timeText1 : iGUILabel;
@HideInInspector
var buffTime1 : iGUILabel;
@HideInInspector
var buffIcon1 : iGUIImage;
@HideInInspector
var timeText2 : iGUILabel;
@HideInInspector
var buffTime2 : iGUILabel;
@HideInInspector
var buffIcon2 : iGUIImage;
@HideInInspector
var timeText3 : iGUILabel;
@HideInInspector
var buffTime3 : iGUILabel;
@HideInInspector
var buffIcon3 : iGUIImage;
@HideInInspector
var timeText4 : iGUILabel;
@HideInInspector
var buffTime4 : iGUILabel;
@HideInInspector
var buffIcon4 : iGUIImage;
@HideInInspector
var timeText5 : iGUILabel;
@HideInInspector
var buffTime5 : iGUILabel;
@HideInInspector
var buffIcon5 : iGUIImage;
@HideInInspector
var timeText6 : iGUILabel;
@HideInInspector
var buffTime6 : iGUILabel;
@HideInInspector
var buffIcon6 : iGUIImage;
@HideInInspector
var timeText7 : iGUILabel;
@HideInInspector
var buffTime7 : iGUILabel;
@HideInInspector
var buffIcon7 : iGUIImage;