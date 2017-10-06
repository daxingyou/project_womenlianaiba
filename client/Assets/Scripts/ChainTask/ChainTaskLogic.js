/*--------------------------------------------------
连环任务逻辑(2012/9/11 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast
import iGUI;


private static var mInstance : ChainTaskLogic = null;
private static var mCtrl : Controller = new Controller();			// 控制器
private var mChainTask : ring_task_atom = null;						// 当前连环任务



//--------------------------------------------------
function Awake()
{
	mInstance = this;
}
function Start()
{
	registEvents();
}
public static function getInstance() : ChainTaskLogic
{
	if (null == mInstance)
	{
		throw "ChainTaskLogic -> instance is null!";
	}
	return mInstance;
}
//--------------------------------------------------
// 事件注册
private function registEvents() : void
{
	// 网络事件注册
	NetHelper.RegistHandler(new notify_show_ring_task(), handle_notify_show_ring_task);
	NetHelper.RegistHandler(new notify_add_ring_task(), handle_notify_add_ring_task);
	NetHelper.RegistHandler(new notify_delete_ring_task(), handle_notify_delete_ring_task);
	NetHelper.RegistHandler(new notify_stop_ring_task(), handle_notify_stop_ring_task);
	NetHelper.RegistHandler(new notify_complete_ring_task(), handle_notify_complete_ring_task);
	NetHelper.RegistHandler(new notify_view_ring_task(), handle_notify_view_ring_task);
}
//--------------------------------------------------
// 处理通知显示连环任务
private function handle_notify_show_ring_task(evt : GameEvent, pack : notify_show_ring_task) : void
{
	// 打开连环任务界面
	openChainTaskUI();
}
//--------------------------------------------------
// 处理通知增加连环任务
private function handle_notify_add_ring_task(evt : GameEvent, pack : notify_add_ring_task) : void
{
	mChainTask = pack.task;
	iGUICode_MainUI.getInstance().BtnChainTask.setEnabled(true);
	if (common_bool.cb_false == pack.task.is_view)	// 新任务未被查看
	{
		openNewTaskTipPP();
	}
	if (false == TimeEffect.getInstance().isNull(pack.task.complete_date))		// 任务已完成
	{
		openCompleteTaskTipPP();
	}
}
//--------------------------------------------------
// 处理通知删除连环任务
private function handle_notify_delete_ring_task(evt : GameEvent, pack : notify_delete_ring_task) : void
{
	if (null == mChainTask)
		throw "ChainTaskLogic -> handle_notify_delete_ring_task() -> task is null!";
	
	if (pack.inst_id != mChainTask.inst_id)
		throw "ChainTaskLogic -> handle_notify_delete_ring_task() -> pack inst_id[" + pack.inst_id + "] != task inst_id[" + mChainTask.inst_id + "].";
	
	mChainTask = null;
	closeChainTaskUI();
	closeCompleteTaskTipPP();
	iGUICode_MainUI.getInstance().BtnChainTask.setEnabled(false);
}
//--------------------------------------------------
// 请求放弃连环任务
public static function request_give_up_ring_task(instance_id : UInt64) : void
{
	var packet : req_give_up_ring_task  = new req_give_up_ring_task();
	packet.inst_id = instance_id;
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 请求停止连环任务
public static function request_stop_ring_task(instance_id : UInt64) : void
{
	var packet : req_stop_ring_task  = new req_stop_ring_task();
	packet.inst_id = instance_id;
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 处理通知停止连环任务
private function handle_notify_stop_ring_task(evt : GameEvent, pack : notify_stop_ring_task) : void
{
	if (null == mChainTask)
		throw "ChainTaskLogic -> handle_notify_stop_ring_task() -> task is null!";
	
	if (pack.inst_id != mChainTask.inst_id)
		throw "ChainTaskLogic -> handle_notify_stop_ring_task() -> pack inst_id[" + pack.inst_id + "] != task inst_id[" + mChainTask.inst_id + "].";
	
	mChainTask.due_date = pack.due_date;
	if (isChainTaskUIOpened())
	{
		iGUICode_ChainTaskUI.getInstance().setStopTime(pack.due_date);
	}
}
//--------------------------------------------------
// 请求立即完成连环任务
public static function request_immediate_complete_ring_task(instance_id : UInt64) : void
{
	var packet : req_immediate_complete_ring_task  = new req_immediate_complete_ring_task();
	packet.inst_id = instance_id;
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 处理通知完成连环任务
private function handle_notify_complete_ring_task(evt : GameEvent, pack : notify_complete_ring_task) : void
{
	if (null == mChainTask)
		throw "ChainTaskLogic -> handle_notify_complete_ring_task() -> task is null!";
	
	if (pack.inst_id != mChainTask.inst_id)
		throw "ChainTaskLogic -> handle_notify_complete_ring_task() -> pack inst_id[" + pack.inst_id + "] != task inst_id[" + mChainTask.inst_id + "].";
	
	mChainTask.complete_date = pack.complete_date;
	if (isChainTaskUIOpened())
	{
		iGUICode_ChainTaskUI.getInstance().setCompleteTask(pack.complete_date);
	}
}
//--------------------------------------------------
// 请求查看连环任务
public static function request_view_ring_task(instance_id : UInt64) : void
{
	var packet : req_view_ring_task  = new req_view_ring_task();
	packet.inst_id = instance_id;
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 处理通知查看连环任务
private function handle_notify_view_ring_task(evt : GameEvent, pack : notify_view_ring_task) : void
{
	if (null == mChainTask)
		throw "ChainTaskLogic -> handle_notify_view_ring_task() -> task is null!";
	
	mChainTask.count = pack.count;
	closeNewTaskTipPP();
	UI.getUI().OpenUIRoot("ChainTaskUI");
	UI.getUI().SetModal("ChainTaskUI", true);
}
//--------------------------------------------------
// 获取连环任务
public function getChainTask() : ring_task_atom
{
	return mChainTask;
}
//--------------------------------------------------
// 打开连环任务界面
public function openChainTaskUI() : void
{
	if (null == mChainTask)
	{
		Debug.LogError("ChainTaskLogic -> openChainTaskUI() -> chain task is null.");
		return;
	}
	request_view_ring_task(mChainTask.inst_id);
	closeCompleteTaskTipPP();
}
//--------------------------------------------------
// 关闭连环任务界面
public function closeChainTaskUI() : void
{
	UI.getUI().SetModal("ChainTaskUI", false);
	UI.getUI().CloseUIRoot("ChainTaskUI");
	
	if (null == mChainTask)
		return;
	
	if (false == TimeEffect.getInstance().isNull(mChainTask.complete_date))		// 任务已完成
	{
		openCompleteTaskTipPP();
	}
}
//--------------------------------------------------
// 连环任务界面是否打开
private function isChainTaskUIOpened() : boolean
{
	return UI.getUI().isUIRootOpen("ChainTaskUI");
}
//--------------------------------------------------
// 打开新任务未被查看提示泡泡
private function openNewTaskTipPP() : void
{
	var pp_image : iGUIImage = iGUICode_MainUI.getInstance().ChainTaskTipPP1;
	pp_image.setEnabled(true);
	var pp_ani : iGUITextureAnimation = pp_image.getTextureAnimation("ChainTaskTipPP1");
	pp_ani.playFromStart();
}
//--------------------------------------------------
// 关闭新任务未被查看提示泡泡
private function closeNewTaskTipPP() : void
{
	var pp_image : iGUIImage = iGUICode_MainUI.getInstance().ChainTaskTipPP1;
	pp_image.setEnabled(false);
	var pp_ani : iGUITextureAnimation = pp_image.getTextureAnimation("ChainTaskTipPP1");
	pp_ani.stop();
}
//--------------------------------------------------
// 打开任务完成提示泡泡
private function openCompleteTaskTipPP() : void
{
	var pp_image : iGUIImage = iGUICode_MainUI.getInstance().ChainTaskTipPP2;
	pp_image.setEnabled(true);
	var pp_ani : iGUITextureAnimation = pp_image.getTextureAnimation("ChainTaskTipPP2");
	pp_ani.playFromStart();
}
//--------------------------------------------------
// 关闭任务完成提示泡泡
private function closeCompleteTaskTipPP() : void
{
	var pp_image : iGUIImage = iGUICode_MainUI.getInstance().ChainTaskTipPP2;
	pp_image.setEnabled(false);
	var pp_ani : iGUITextureAnimation = pp_image.getTextureAnimation("ChainTaskTipPP2");
	pp_ani.stop();
}
//--------------------------------------------------


