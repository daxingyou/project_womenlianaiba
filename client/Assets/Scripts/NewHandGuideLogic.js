#pragma strict
#pragma downcast
import iGUI;



private static var mCtrl : Controller = new Controller();		// 控制器
private var mCurNewHandTaskId : int = 0;	// 当前新手任务id
private var mPreNewHandTaskHasAward : boolean = true;	// 前一个新手任务是否有奖励
//--------------------------------------------------
private static var instance : NewHandGuideLogic = null;
public static function getInstance() : NewHandGuideLogic
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
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LOGON_AWARD_ENABLE), handleNotifyLogonAwardEnable);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_CLOSE_FOOD_SETTLEMENT_DIAMOND_UI), handleNotifyCloseFoodSettlementDiamondUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_CLOSE_NEW_HAND_TASK_REAWARD_UI), handleNotifyCloseNewHandTaskRewardUI);
}
//--------------------------------------------------
// 注册新手任务事件
public static function registEvent(event : String, callback : Function) : void
{
	mCtrl.Register(event, callback);
}
//--------------------------------------------------
// 取消注册新手任务事件
public static function unregistEvent(event : String, callback : Function) : void
{
	mCtrl.Unregister(event, callback);
}
//--------------------------------------------------
// 执行新手任务事件
public static function excuteEvent(event : String, obj : System.Object) : void
{
	mCtrl.Excute(event, obj);
}
//--------------------------------------------------
// 请求关闭窗口
public static function requestCloseWindows(type : int) : void
{
	var req : req_close_windows = new req_close_windows();
	req.type = type;	// 界面类型
	NetHelper.Send(req);
}
//--------------------------------------------------
// 打开新手引导界面
public static function openNewHandGuideUI(modal : boolean) : void
{
	UI.getUI().OpenUIRoot("NewHandGuideUI");
	UI.getUI().SetTopDepth("NewHandGuideUI");
	iGUICode_NewHandGuideUI.getInstance().setModalState(modal);
}
//--------------------------------------------------
// 关闭新手引导界面
public static function closeNewHandGuideUI() : void
{
	UI.getUI().CloseUIRoot("NewHandGuideUI");
}
//--------------------------------------------------
// 显示引导界面内容(提示图片,箭头,功能按钮)
public static function showContent(tipSrc:String, tipPos:Vector2, arrowDirection:String, arrowPos:Vector2, btnNormal:String, btnHover:String, btnPos:Vector2) : iGUIButton
{
	var gui : iGUICode_NewHandGuideUI = iGUICode_NewHandGuideUI.getInstance();
	gui.showTip(tipSrc, tipPos);
	gui.showArrow(arrowDirection, arrowPos);
	return gui.showBtn(btnNormal, btnHover, btnPos);
}
//--------------------------------------------------
// 打开新手任务奖励界面
public static function openNewHandTaskRewardUI(taskId : int) : void
{
	UI.getUI().OpenUIRoot("NewHandTaskRewardUI");
	UI.getUI().SetModal("NewHandTaskRewardUI", true);
	iGUICode_NewHandTaskRewardUI.getInstance().init(taskId);
}
//--------------------------------------------------
// 创建新手任务
public static function createNewHandTask(taskId : int) : void
{
	if (0 == taskId)
		return;
	
	Debug.Log("===== crate new hand task: " + taskId);
	var gobj : GameObject = new GameObject("new_hand_task_" + taskId);
	var prefix : String = taskId < 30000 ? "newhand_" : "newhandtask_";
	gobj.AddComponent(prefix + taskId);
}
//--------------------------------------------------
// 删除新手任务
public static function destroyNewHandTask(gobj : GameObject) : void
{
	GameObject.Destroy(gobj);
}
//--------------------------------------------------
// 是否在新手流程
public function isInNewHandTask() : boolean
{
	return 0 != mCurNewHandTaskId;
}
//--------------------------------------------------
// 判断是否为新手任务
private function isNewHandTask(taskInstId : UInt64) : task_info
{
	var taskInfo : task_info = Task.getInstance().findTaskByInstId(taskInstId);
	var taskRow : PlayerTaskRow = ResManager.LgtMgr.getPlayerTaskRow(taskInfo.task_id);
	if (1 == taskRow.type)	// 新手任务
		return taskInfo;
	
	return null;
}
//--------------------------------------------------
// 处理添加任务事件
private function handleNotifyAddTask(evt : GameEvent, obj : Object) : void
{
	var taskInfo : task_info = isNewHandTask(Convert.ToUInt64(obj));
	if (null == taskInfo || !Task.getInstance().canPlayerReceive(taskInfo.task_id))
		return;
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_NEW_HAND_TASK), taskInfo);
	if (!Global.isStimeNull(taskInfo.complete_date) && // 完成任务时间非空
		Global.compareStime(SysTimer.getCurTime(), taskInfo.complete_date) > 0)	// 当前任务已被完成
	{
		Task.reqGetTaskReward(taskInfo.inst_id, taskInfo.type);
		return;
	}
	
	mCurNewHandTaskId = taskInfo.task_id;
	if (!mPreNewHandTaskHasAward)	// 上一个完成的任务没有奖励,则直接打开新手界面
	{
		createNewHandTask(taskInfo.task_id);
	}
}
//--------------------------------------------------
// 处理完成任务事件
private function handleNotifyCompleteTask(evt : GameEvent, obj : Object) : void
{
	var taskInfo : task_info = isNewHandTask(Convert.ToUInt64(obj));
	if (null == taskInfo)
		return;
	
	Debug.Log("===== destroy new hand task: " + taskInfo.task_id);
	// step1:
	Task.reqGetTaskReward(taskInfo.inst_id, taskInfo.type);
	mCurNewHandTaskId = 0;
	excuteEvent("COMPLETE_CUR_NEW_HAND_TASK", null);
	// step2:
	mPreNewHandTaskHasAward = Task.getInstance().isTaskHasAward(taskInfo.task_id);
	if (mPreNewHandTaskHasAward)	// 该完成的任务有奖励,打开奖励界面
	{
		openNewHandTaskRewardUI(taskInfo.task_id);
	}
}
//--------------------------------------------------
// 处理登陆奖励界面显示/隐藏
private function handleNotifyLogonAwardEnable(evt : GameEvent, obj : Object) : void
{
	var enabled : boolean = obj;
	if (true == enabled || UI.getUI().isUIRootOpen("FoodSettlementDiamondUI"))
		return;
	
	createNewHandTask(mCurNewHandTaskId);
}
//--------------------------------------------------
// 处理关闭食物结算水晶界面
private function handleNotifyCloseFoodSettlementDiamondUI(evt : GameEvent, obj : Object) : void
{
	createNewHandTask(mCurNewHandTaskId);
}
//--------------------------------------------------
// 处理关闭领取新手任务奖励界面
private function handleNotifyCloseNewHandTaskRewardUI(evt : GameEvent, obj : Object) : void
{
	createNewHandTask(mCurNewHandTaskId);
}
//--------------------------------------------------
// 是否有要点击客人的新手任务
public function isClickGuestNewHandTask() : boolean
{
	var taskId : int = mCurNewHandTaskId;
	return 30003 == taskId || 30007 == taskId || 30010 == taskId;
}
//--------------------------------------------------


