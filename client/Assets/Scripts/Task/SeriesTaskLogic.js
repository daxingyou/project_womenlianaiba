#pragma strict
#pragma downcast
import iGUI;


private var SLOT_NUM : int = 3;
private var mSeriesTaskSlots : Array = new Array();
private var mSeriesTasks : Array = new Array();
private var mBeginIndex : int = 0;
//--------------------------------------------------
private static var instance : SeriesTaskLogic = null;
public static function getInstance() : SeriesTaskLogic
{
	return instance;
}
//--------------------------------------------------
function Awake()
{
	instance = this;
}
//--------------------------------------------------
function Start()
{
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_ADD_TASK), handleNotifyAddTask);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_CHAIN_TASK_COMPLETE), handleNotifyCompleteTask);
	//
}
//--------------------------------------------------
function OnDestroy()
{
	clearSeriesTaskSlots();
	mSeriesTaskSlots.Clear();
}
//--------------------------------------------------
// 获取系列任务按钮
private function getSeriesTaskBtn(gui : iGUICode_MainUI, index : int) : iGUIButton
{
	if (0 == index) return gui.STP_task_btn1;
	if (1 == index) return gui.STP_task_btn2;
	// 2 == index
	return gui.STP_task_btn3;
}
//--------------------------------------------------
// 创建系列任务slot
private function createSeriesTaskSlots() : void
{
	var gui : iGUICode_MainUI = iGUICode_MainUI.getInstance();
	if (mSeriesTaskSlots.Count > 0 || null == gui)
		return;
	
	for (var i:int = 0; i<SLOT_NUM; ++i)
	{
		mSeriesTaskSlots.Add(new SeriesTaskSlot(getSeriesTaskBtn(gui, i)));
	}
	gui.STP_up_btn1.clickCallback = ClickCallback_up_btn;
	gui.STP_down_btn1.clickCallback = ClickCallback_down_btn;
}
//--------------------------------------------------
// 清除系列任务slot
private function clearSeriesTaskSlots() : void
{
	for (var slot : SeriesTaskSlot in mSeriesTaskSlots)
	{
		slot.setContent(null);
	}
}
//--------------------------------------------------
// 刷新系列任务slot
private function refreshSeriesTaskSlots() : void
{
	var gui : iGUICode_MainUI = iGUICode_MainUI.getInstance();
	if (null == gui)
		return;
	
	createSeriesTaskSlots();
	clearSeriesTaskSlots();
	gui.SeriesTaskPanel.setEnabled(0 != mSeriesTasks.Count);
	if (mSeriesTasks.Count > SLOT_NUM)
	{
		gui.STP_up_btn1.setEnabled(true);
		gui.STP_down_btn1.setEnabled(true);
	}
	else
	{
		mBeginIndex = 0;
		gui.STP_up_btn1.setEnabled(false);
		gui.STP_down_btn1.setEnabled(false);
	}
	var curPage : Array = Page.getPageC(mSeriesTasks, SLOT_NUM, mBeginIndex);
	for (var i:int = 0; i<curPage.Count; ++i)
	{
		(mSeriesTaskSlots[i] as SeriesTaskSlot).setContent(curPage[i]);
	}
}
//--------------------------------------------------
// 点击向上按钮
private function ClickCallback_up_btn(caller : iGUIElement) : void
{
	if (0 == mBeginIndex)
		return;
	
	--mBeginIndex;
	refreshSeriesTaskSlots();
}
//--------------------------------------------------
// 点击向下按钮
private function ClickCallback_down_btn(caller : iGUIElement) : void
{
	if (mBeginIndex >= mSeriesTasks.Count - SLOT_NUM)
		return;
	
	++mBeginIndex;
	refreshSeriesTaskSlots();
}
//--------------------------------------------------
// 判断是否为系列任务
private function isSeriesTask(taskInstId : UInt64) : task_info
{
	var taskInfo : task_info = Task.getInstance().findTaskByInstId(taskInstId);
	var taskRow : PlayerTaskRow = ResManager.LgtMgr.getPlayerTaskRow(taskInfo.task_id);
	if (2 == taskRow.type)	// 系列任务
		return taskInfo;
	
	return null;
}
//--------------------------------------------------
// 移除系列任务
private function removeSeriesTask(instId : UInt64) : void
{
	var index : int = -1;
	for (var i:int = 0; i<mSeriesTasks.Count; ++i)
	{
		if (instId == (mSeriesTasks[i] as task_info).inst_id)
		{
			index = i;
			break;
		}
	}
	if (-1 != index)
	{
		mSeriesTasks.RemoveAt(index);
	}
}
//--------------------------------------------------
// 处理添加任务事件
private function handleNotifyAddTask(evt : GameEvent, obj : Object) : void
{
	var taskInfo : task_info = isSeriesTask(Convert.ToUInt64(obj));
	if (null == taskInfo || !Task.getInstance().canPlayerReceive(taskInfo.task_id))
		return;
	
	mSeriesTasks.Add(taskInfo);
	refreshSeriesTaskSlots();
}
//--------------------------------------------------
// 处理完成任务事件
private function handleNotifyCompleteTask(evt : GameEvent, obj : Object) : void
{
	var taskInfo : task_info = isSeriesTask(Convert.ToUInt64(obj));
	if (null == taskInfo)
		return;
	
	Debug.Log("===== destroy series task: " + taskInfo.task_id);
	// step1:
	removeSeriesTask(taskInfo.inst_id);
	refreshSeriesTaskSlots();
	// step2:如果已打开系列任务界面,则关闭
	if (UI.getUI().isUIRootOpen("TaskUI"))
	{
		UI.getUI().SetModal("TaskUI", false);
		UI.getUI().CloseUIRoot("TaskUI");
	}
	// step3:领取奖励,打开奖励界面
	Task.reqGetTaskReward(taskInfo.inst_id, taskInfo.type);
	if (Task.getInstance().isTaskHasAward(taskInfo.task_id))
	{
		NewHandGuideLogic.openNewHandTaskRewardUI(taskInfo.task_id);
	}
}
//--------------------------------------------------






class SeriesTaskSlot
{
	private var mTaskBtn : iGUIButton = null;
	private var mAsynIcon : AsynIcon = null;
	private var mTaskInfo : task_info = null;
	private var mTaskRow : PlayerTaskRow = null;
	//--------------------------------------------------
	public function SeriesTaskSlot(taskBtn : iGUIButton)
	{
		mTaskBtn = taskBtn;
		taskBtn.mouseOverCallback = MouseOverCallback_task_btn;
		taskBtn.clickCallback = ClickCallback_task_btn;
		mAsynIcon = new AsynIcon(setTexture, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	}
	//--------------------------------------------------
	private function setTexture(tex : Texture) : void
	{
		mTaskBtn.style.normal.background = tex;
	}
	//--------------------------------------------------
	public function setContent(taskInfo : task_info) : void
	{
		if (null == taskInfo)
		{
			mTaskBtn.setEnabled(false);
			mAsynIcon.cancel();
			setTexture(null);
			mTaskInfo = null;
			mTaskRow = null;
			return;
		}
		mTaskInfo = taskInfo;
		mTaskRow = ResManager.LgtMgr.getPlayerTaskRow(taskInfo.task_id);
		mAsynIcon.load("Icon/" + mTaskRow.icon + ".png.u3d");
		mTaskBtn.setEnabled(true);
	}
	//--------------------------------------------------
	private function MouseOverCallback_task_btn(caller : iGUIElement) : void
	{
		if (null == mTaskRow)
			return;
		
		var style : GUIStyle = new GUIStyle();
		style.alignment = TextAnchor.MiddleCenter;
		style.normal.textColor = Color(1.0f, 1.0f, 1.0f);
		style.fontStyle = FontStyle.Bold;
		Global.SysTooltip.Begin(caller);
		Global.SysTooltip.Add(GUIContent(mTaskRow.title), style);
		Global.SysTooltip.Show(true);
	}
	//--------------------------------------------------
	private function ClickCallback_task_btn(caller : iGUIElement) : void
	{
		if (null == mTaskRow)
			return;
		
		UI.getUI().OpenUIRoot("TaskUI");
		UI.getUI().SetModal("TaskUI", true);
		iGUICode_TaskUI.getInstance().init(mTaskInfo, mTaskRow);
	}
	//--------------------------------------------------
}


