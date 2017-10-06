#pragma strict

import iGUI;

private static var instance : iGUICode_ChainTaskUI;
function Awake(){
	instance=this;
	Global.GetSysMsgHandler().RegistMsgCallback(490, stopOkCallback, cancelCallback, null);
	Global.GetSysMsgHandler().RegistMsgCallback(492, giveupOkCallback, cancelCallback, null);
}
static function getInstance(){
	return instance;
}

@HideInInspector
var FailedImage : iGUILabel;
@HideInInspector
var CompleteImage : iGUILabel;
@HideInInspector
var CommTaskCurTimes : iGUILabel;
@HideInInspector
var CommTaskRemainTime : iGUILabel;
@HideInInspector
var CommTaskGiveUp : iGUIButton;
@HideInInspector
var CommTaskStopTime : iGUIButton;
@HideInInspector
var CommTaskClose : iGUIButton;
@HideInInspector
var CommTaskCompleteText : iGUILabel;
@HideInInspector
var CommTaskComplete: iGUIButton;
@HideInInspector
var CommTaskItem3Count : iGUILabel;
@HideInInspector
var CommTaskItem3: iGUILabel;
@HideInInspector
var CommTaskItem2Count : iGUILabel;
@HideInInspector
var CommTaskItem2: iGUILabel;
@HideInInspector
var CommTaskItem1Count : iGUILabel;
@HideInInspector
var CommTaskItem1: iGUILabel;
@HideInInspector
var CommTaskExp : iGUILabel;
@HideInInspector
var CommTaskGold : iGUILabel;
@HideInInspector
var CommTaskTargetContent1 : iGUILabel;
@HideInInspector
var CommTaskTargetTile1 : iGUILabel;
@HideInInspector
var CommTaskTargetPanel1 : iGUIPanel;
@HideInInspector
var CommTaskMainContent : iGUILabel;
@HideInInspector
var CommTaskTitle : iGUILabel;
@HideInInspector
var CommTaskPanel : iGUIPanel;
@HideInInspector
var RewardExp : iGUILabel;
@HideInInspector
var RewardGold : iGUILabel;
@HideInInspector
var root : iGUIRoot;


function Start()
{
	CommTaskClose.clickCallback = Click_CommTaskClose;
	CommTaskComplete.clickCallback = Click_CommTaskComplete;
	CommTaskStopTime.clickCallback = Click_CommTaskStopTime;
	CommTaskGiveUp.clickCallback = Click_CommTaskGiveUp;
	CommTaskItem1.mouseOverCallback = MouseOver_CommTaskItem;
	CommTaskItem2.mouseOverCallback = MouseOver_CommTaskItem;
	CommTaskItem3.mouseOverCallback = MouseOver_CommTaskItem;
	CompleteImage.setEnabled(false);
	FailedImage.setEnabled(false);
	// 初始
	init();
}
function OnDestroy()
{
	Global.GetSysMsgHandler().UnregistMsgCallback(490);
	Global.GetSysMsgHandler().UnregistMsgCallback(492);
	clearItemIcon();
	mItemIconArray.clear();
	endTimer();
}
//--------------------------------------------------
// 点击关闭按钮
function Click_CommTaskClose(caller : iGUIElement)
{
	ChainTaskLogic.getInstance().closeChainTaskUI();
}
//--------------------------------------------------
// 点击立即完成按钮
function Click_CommTaskComplete(caller : iGUIElement)
{
	if (false == caller.userData)
		return;
	
	var msg : SysMsgRow = Global.GetSysMsgHandler().getSysMsgRow(534);
	var content : String = msg.msg_content.Replace("{0}", mCompleteNeedCost.ToString());
	UI.getUI().OpenMsgbox("", content, Define.ok, CallbackOk, Define.cancel, cancelCallback);
}
//--------------------------------------------------
function CallbackOk(caller : iGUIElement)
{
	ChainTaskLogic.request_immediate_complete_ring_task(ChainTaskLogic.getInstance().getChainTask().inst_id);
}
//--------------------------------------------------
// 点击时间停止按钮
function Click_CommTaskStopTime(caller : iGUIElement)
{
	if (false == caller.userData)
		return;
	
	Global.GetSysMsgHandler().ShowSysMsg(490);
}
//--------------------------------------------------
function stopOkCallback(caller : iGUIElement)
{
	CommTaskStopTime.userData = false;
	ChainTaskLogic.request_stop_ring_task(ChainTaskLogic.getInstance().getChainTask().inst_id);
}
//--------------------------------------------------
// 点击放弃按钮
function Click_CommTaskGiveUp(caller : iGUIElement)
{
	if (false == caller.userData)
		return;
	
	Global.GetSysMsgHandler().ShowSysMsg(492);
}
//--------------------------------------------------
function giveupOkCallback(caller : iGUIElement)
{
	CommTaskGiveUp.userData = false;
	// 不知道为啥原因,这里不用用mRingTask,否则任务实例id会是错误的
	ChainTaskLogic.request_give_up_ring_task(ChainTaskLogic.getInstance().getChainTask().inst_id);
}
//--------------------------------------------------
// 鼠标移到奖励物品上面
function MouseOver_CommTaskItem(caller : iGUIElement)
{
	for (var obj : Object in mItemIconArray)
	{
		var icon : ItemIcon = obj as ItemIcon;
		if (icon.isBelong(caller as iGUILabel))
		{
			ItemHint.ShowPackItemHint(caller, icon.getRow(), true);
			return;
		}
	}
}
//--------------------------------------------------
function cancelCallback(caller : iGUIElement)
{
}
//--------------------------------------------------



/***************************************************
*** 界面逻辑
***************************************************/
private var mItemIconArray : Array = new Array();
private var mTimer : Timer = null;					// 定时器
private var mRemainTime : int = 0;					// 剩余时间(秒)
private var mCompleteNeedCost : int = 0;			// 立即完成所需金额


//--------------------------------------------------
// 初始
private function init() : void
{
	mItemIconArray.Add(new ItemIcon(CommTaskItem1));
	mItemIconArray.Add(new ItemIcon(CommTaskItem2));
	mItemIconArray.Add(new ItemIcon(CommTaskItem3));
	clearItemIcon();
	for (var i:int=0; i<3; ++i)
	{
		var count_label : iGUILabel = getTaskItemCount(i);
		count_label.label.text = "";
	}
	// 设置控件
	setControls();
}
//--------------------------------------------------
// 清除
private function clearItemIcon() : void
{
	for (var obj : Object in mItemIconArray)
	{
		var icon : ItemIcon = obj as ItemIcon;
		icon.setContent(null);
	}
}
//--------------------------------------------------
// 设置各控件
private function setControls() : void
{
	var task : ring_task_atom = ChainTaskLogic.getInstance().getChainTask();
	if (null == task)
		return;
	
	var task_str : String[];		// 0.任务内容,1.任务目标
	switch (task.type)
	{
	case pack_task_type.ptt_dialogue:				// 对话任务
		task_str = getDialogueTask(task.content_id, task.rule_id);
		break;
	case pack_task_type.ptt_deliver_goods:			// 送货任务
		task_str = getDeliverGoodsTask(task.content_id, task.rule_id);
		break;
	case pack_task_type.ptt_find_item:				// 寻物任务
		task_str = getFindItemTask(task.content_id, task.rule_id);
		break;
	case pack_task_type.ptt_collect:				// 收集任务
		task_str = getCollectTask(task.content_id, task.rule_id);
		break;
	case pack_task_type.ptt_function:				// 功能任务
		task_str = getFunctionTask(task.content_id, task.rule_id);
		task_str[1] = task_str[1].Replace("b_count", task.count.ToString());
		break;
	default:
		return;
	}
	
	var rtr : RingTaskRow = ResManager.LgtMgr.getRingTaskRow(task.ring_count);
	// 设置
	setTaskMainContent(task_str[0]);
	setTaskTarget(task_str[1]);
	initCompleteStop(task.due_date, task.complete_date);
	setCurChain(task.ring_count);
	setReawrdGoldExp(rtr.reward_diamond, rtr.reward_exp);
	for (var i:int=0; i<rtr.reward_items.Count; ++i)
	{
		var item_id : int = Convert.ToInt32(rtr.reward_items[i]);
		if (0 == item_id)
			continue;
		
		var ir : ItemRow = ResManager.LgtMgr.getItemRow(item_id);
		setTaskItem(i, ir, Convert.ToInt32(rtr.reward_items_count[i]));
	}
	setQDianCost(rtr.q_coin);
}
//--------------------------------------------------
// 获取对话任务内容描述和目标描述
private function getDialogueTask(content_id : int, rule_id : int) : String[]
{
	var dtr : DialogueTaskRow = ResManager.LgtMgr.getDialogueTaskRow(content_id);
	// 替换npc名
	dtr.content = OfferRewardTaskLogic.replaceNPCName(dtr.content, 1, dtr.npc_name);
	dtr.target = OfferRewardTaskLogic.replaceNPCName(dtr.target, 1, dtr.npc_name);
	return [dtr.content, dtr.target];
}
//--------------------------------------------------
// 获取送货任务内容描述和目标描述
private function getDeliverGoodsTask(content_id : int, rule_id : int) : String[]
{
	var dgtr : DeliverGoodsTaskRow = ResManager.LgtMgr.getDeliverGoodsTaskRow(content_id);
	if (0 == dgtr.require_item)
		return [dgtr.content, dgtr.target];
	
	// 替换npc名,需要物品名
	var ir : ItemRow = ResManager.LgtMgr.getItemRow(dgtr.require_item);
	dgtr.content = OfferRewardTaskLogic.replaceNPCName(dgtr.content, 1, dgtr.npc_name);
	dgtr.target = OfferRewardTaskLogic.replaceNPCName(dgtr.target, 1, dgtr.npc_name);
	dgtr.content = OfferRewardTaskLogic.replaceRequireItemName(dgtr.content, 1, ir.name);
	dgtr.target = OfferRewardTaskLogic.replaceRequireItemName(dgtr.target, 1, ir.name);
	return [dgtr.content, dgtr.target];
}
//--------------------------------------------------
// 获取寻物任务内容描述和目标描述
private function getFindItemTask(content_id : int, rule_id : int) : String[]
{
	var fitr : FindItemTaskRow = ResManager.LgtMgr.getFindItemTaskRow(content_id);
	// 替换地图名,奖励物品名
	for (var i:int=0; i<fitr.reward_items.Count; ++i)
	{
		if (0 == fitr.reward_items[i])
			continue;
		
		var ir : ItemRow = ResManager.LgtMgr.getItemRow(Convert.ToInt32(fitr.reward_items[i]));
		fitr.content = OfferRewardTaskLogic.replaceMapName(fitr.content, i + 1, fitr.map_name);
		fitr.target = OfferRewardTaskLogic.replaceMapName(fitr.target, i + 1, fitr.map_name);
		fitr.content = OfferRewardTaskLogic.replaceRewardItemName(fitr.content, i + 1, ir.name);
		fitr.target = OfferRewardTaskLogic.replaceRewardItemName(fitr.target, i + 1, ir.name);
	}
	return [fitr.content, fitr.target];
}
//--------------------------------------------------
// 获取收集任务内容描述和目标描述
private function getCollectTask(content_id : int, rule_id : int) : String[]
{
	var ctr : CollectTaskRow = ResManager.LgtMgr.getCollectTaskRow(content_id);
	if (0 == ctr.require_item)
		return [ctr.content, ctr.target];
	
	// 替换需要物品名,需要物品数量
	var ir : ItemRow = ResManager.LgtMgr.getItemRow(ctr.require_item);
	ctr.content = OfferRewardTaskLogic.replaceRequireItemName(ctr.content, 1, ir.name);
	ctr.target = OfferRewardTaskLogic.replaceRequireItemName(ctr.target, 1, ir.name);
	ctr.content = OfferRewardTaskLogic.replaceRequireItemCount(ctr.content, 1, ctr.require_item_count);
	ctr.target = OfferRewardTaskLogic.replaceRequireItemCount(ctr.target, 1, ctr.require_item_count);
	return [ctr.content, ctr.target];
}
//--------------------------------------------------
// 获取功能任务内容描述和目标描述
private function getFunctionTask(content_id : int, rule_id : int) : String[]
{
	var ftr : FunctionTaskRow = ResManager.LgtMgr.getFunctionTaskRow(content_id);
	// 替换功能说明
	ftr.content = OfferRewardTaskLogic.replaceFunctionName(ftr.content, 1, ftr.func_content);
	ftr.target = OfferRewardTaskLogic.replaceFunctionName(ftr.target, 1, ftr.func_content);
	return [ftr.content, ftr.target];
}
//--------------------------------------------------
// 设置任务主要内容
private function setTaskMainContent(content : String) : void
{
	CommTaskMainContent.label.text = content;
}
//--------------------------------------------------
// 设置目标任务
private function setTaskTarget(content : String) : void
{
	CommTaskTargetContent1.label.text = content;
}
//--------------------------------------------------
// 设置当前环数数
private function setCurChain(cur_times : int) : void
{
	CommTaskCurTimes.label.text = Define.getContent(5129, [(cur_times + 1).ToString()]);
}
//--------------------------------------------------
// 初始立即完成和时间停止按钮
private function initCompleteStop(due_date : stime, complete_date : stime) : void
{
	var completed : boolean = !TimeEffect.getInstance().isNull(complete_date);				// 任务是否被完成
	var stoped : boolean = TimeEffect.getInstance().isNull(due_date);						// 时间是否被停止
	var seconds : int = stoped ? 0 : TimeEffect.getInstance().getRemainSeconds(due_date);	// 剩余时间
	
	if (completed)		// 任务被完成
	{
		setCompleteBtnStatus(false);
		if (stoped)		// 时间被停止
		{
			setStopBtnStatus(false);
			CommTaskRemainTime.label.text =  "20"+Define.minute+"00"+Define.seconds;
			CompleteImage.setEnabled(true);
		}
		else			// 时间未必停止
		{
			if (seconds > 0)	// 时间未到期
			{
				setStopBtnStatus(true);
				startTimer(seconds);
				CompleteImage.setEnabled(true);
			}
			else				// 时间已到期,任务失败
			{
				setStopBtnStatus(false);
				CommTaskRemainTime.label.text =  "00"+Define.minute+"00"+Define.seconds;
				FailedImage.setEnabled(true);
			}
		}
		return;
	}
	// 任务未被完成
	if (stoped)			// 时间被停止
	{
		setCompleteBtnStatus(true);
		setStopBtnStatus(false);
		CommTaskRemainTime.label.text =  "20"+Define.minute+"00"+Define.seconds;
		return;
	}
	// 时间未被停止
	if (seconds > 0)	// 时间未到期
	{
		setCompleteBtnStatus(true);
		setStopBtnStatus(true);
		startTimer(seconds);
		return;
	}
	// 时间已到期,任务失败
	setCompleteBtnStatus(false);
	setStopBtnStatus(false);
	CommTaskRemainTime.label.text =  "00"+Define.minute+"00"+Define.seconds;
	FailedImage.setEnabled(true);
}
//--------------------------------------------------
// 开始定时器
private function startTimer(remain : int) : void
{
	if (mTimer)
		return;
	
	mRemainTime = remain;
	mTimer = new Timer(1000, remain);
	mTimer.addEventListener(TimerEvent.TIMER, oneTime);
	mTimer.addEventListener(TimerEvent.TIMER_COMPLETE, overTime);
	mTimer.Start();
}
//--------------------------------------------------
// 每秒触发
private function oneTime(tm : Timer, obj : System.Object) : void
{
	--mRemainTime;
	// 分
	var minutes : int = mRemainTime / 60;
	var minutes_text : String = minutes.ToString();
	if (minutes < 10)
	{
		minutes_text = "0" + minutes_text;
	}
	// 秒
	var seconds : int = mRemainTime % 60;
	var seconds_text : String = seconds.ToString();
	if (seconds < 10)
	{
		seconds_text = "0" + seconds_text;
	}
	// 显示
	CommTaskRemainTime.label.text = Define.remaintime+"：" + minutes_text + Define.minute + seconds_text + Define.seconds;
}
//--------------------------------------------------
// 定时器结束
private function overTime(tm : Timer, obj : System.Object) : void
{
	var task : ring_task_atom = ChainTaskLogic.getInstance().getChainTask();
	if (null == task)
		return;
	
	initCompleteStop(task.due_date, task.complete_date);
}
//--------------------------------------------------
// 结束定时器
private function endTimer() : void
{
	if (mTimer)
	{
		mTimer.Stop();
	}
}
//--------------------------------------------------
// 设置奖励水晶和奖励经验
private function setReawrdGoldExp(gold : int, exp : int) : void
{
	CommTaskGold.label.text = "X" + gold.ToString();
	CommTaskExp.label.text = "X" + exp.ToString();
}
//--------------------------------------------------
// 设置奖励物品
private function setTaskItem(index : int, row : ItemRow, count : int) : void
{
	if (index < 0 || index > 2)
		return;
	
	(mItemIconArray[index] as ItemIcon).setContent(row);
	var count_label : iGUILabel = getTaskItemCount(index);
	count_label.label.text = count.ToString();
}
//--------------------------------------------------
// 获取数量控件
private function getTaskItemCount(index : int) : iGUILabel
{
	if (0 == index) return CommTaskItem1Count;
	if (1 == index) return CommTaskItem2Count;
	// 2 == index
	return CommTaskItem3Count;
}
//--------------------------------------------------
// 设置立即完成所需Q点消耗
private function setQDianCost(q_dian : int) : void
{
	mCompleteNeedCost = q_dian;
	CommTaskCompleteText.label.text = q_dian.ToString();
}
//--------------------------------------------------
// 设置立即完成按钮
private function setCompleteBtnStatus(can_click : boolean) : void
{
	CommTaskComplete.userData = can_click;
	
	var normal : String = can_click ? "awaycomplete_n" : "awaycomplete_g";
	var hover : String = can_click ? "awaycomplete_h" : "awaycomplete_g";
	var active : String = can_click ? "awaycomplete_n" : "awaycomplete_g";
	
	CommTaskComplete.style.normal.background = Resources.Load("UISkins/Textures/task/" + normal) as Texture2D;
	CommTaskComplete.style.hover.background = Resources.Load("UISkins/Textures/task/" + hover) as Texture2D;
	CommTaskComplete.style.active.background = Resources.Load("UISkins/Textures/task/" + active) as Texture2D;
}
//--------------------------------------------------
// 设置停止时间按钮
private function setStopBtnStatus(can_click : boolean) : void
{
	CommTaskStopTime.userData = can_click;
	
	var normal : String = can_click ? "timestop_n" : "timestop_g";
	var hover : String = can_click ? "timestop_h" : "timestop_g";
	var active : String = can_click ? "timestop_n" : "timestop_g";
	
	CommTaskStopTime.style.normal.background = Resources.Load("UISkins/Textures/task/" + normal) as Texture2D;
	CommTaskStopTime.style.hover.background = Resources.Load("UISkins/Textures/task/" + hover) as Texture2D;
	CommTaskStopTime.style.active.background = Resources.Load("UISkins/Textures/task/" + active) as Texture2D;
}
//--------------------------------------------------
// 停止时间
public function setStopTime(due_date : stime) : void
{
	if (TimeEffect.getInstance().isNull(due_date))		// 时间被停止
	{
		endTimer();
	}
}
//--------------------------------------------------
// 立即完成
public function setCompleteTask(complete_date : stime) : void
{
	if (TimeEffect.getInstance().isNull(complete_date))		// 任务未被完成
	{
		setCompleteBtnStatus(true);
	}
	// 任务被完成
	setCompleteBtnStatus(false);
	CompleteImage.setEnabled(true);
}
//--------------------------------------------------


