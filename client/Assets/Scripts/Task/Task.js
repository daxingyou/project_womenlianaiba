#pragma strict
#pragma downcast

/*--------------------------------------------------
任务系统(2012/4/18 create by Y3)
--------------------------------------------------*/

class immediateCompleteTaskPrice{
	var inst_id : UInt64 = 0;
	var type : int = 0;
}

//所有的任务
public var allTasks : ArrayList = null;
//日常任务控件列表
private var mDailyTaskCtrls : Array = new Array();
//日常任务的最大个数
private static var DAILY_TASK_MAX_COUNT : int = 5;
//按钮按一次的等待时间
private static var BUTTON_WAIT_TIME : float = 2.0f;
public static var task_target1_complete_f : boolean = false;
private var mEndNewguideDailyTask : boolean = false;
//--------------------------------------------------
private static var instance : Task;
function Awake()
{
	instance = this;
	registerEvents();
}
//--------------------------------------------------
public static function getInstance() : Task
{
	return instance;
}
//--------------------------------------------------
function Update()
{
	if (UI.getUI().isUIRootOpen("DailyTaskUI"))
	{
		updateAllDailyPanel();
	}
}
//--------------------------------------------------
function OnDestroy()
{
    for (var d : DailyTaskCtrl in mDailyTaskCtrls)
    {
    	d.clear();
    }
}
//--------------------------------------------------
private function registerEvents() : void
{
	NetHelper.RegistHandler(new notify_complete_task(), notifyCompleteTask);
	NetHelper.RegistHandler(new notify_reward_task(), notifyRewardTask);
	NetHelper.RegistHandler(new notify_change_task(), notifyChangeTask);
	NetHelper.RegistHandler(new notify_task_flag(), notifyTaskFlag);
	NetHelper.RegistHandler(new notify_add_task(), notifyAddTask);
	NetHelper.RegistHandler(new notify_dec_task(), notifyDecTask);
}
//--------------------------------------------------
//打开日常任务界面
public function openDailyUI() : void
{
	return;
	UI.getUI().OpenUIRoot("DailyTaskUI");
	UI.getUI().SetModal("DailyTaskUI", true);
	if (20005 == NewPlayGuideModule.CurNewHandSuffix || 10005 == NewPlayGuideModule.CurNewHandSuffix)
	{
		UI.getUI().SetTopDepth("StepLeadRoot");
	}
	//更新页面
	iGUICode_DailyTaskUI.getInstance().sysnControl(mDailyTaskCtrls);
	updateAllDailyPanel();
	if (NewPlayGuideModule.IsInNewHandTasks())
	{
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_DALIYTASKBTN), mEndNewguideDailyTask);
	}
}
//--------------------------------------------------
//关闭日常任务UI
public function closeDailyUI() : void
{
	UI.getUI().SetModal("DailyTaskUI", false);
	UI.getUI().CloseUIRoot("DailyTaskUI");
}
//--------------------------------------------------
//更新所有的日常任务面板
private function updateAllDailyPanel() : void
{
	for (var i:int = 0; i<DAILY_TASK_MAX_COUNT; ++i)
	{
		updateDailyPanel(i);
	}
}
//--------------------------------------------------
private function updateDailyPanel(ix:int) : void
{
	if (false == UI.getUI().isUIRootOpen("DailyTaskUI"))
		return;
	
	var ct : DailyTaskCtrl = mDailyTaskCtrls[ix];
	var t : task_info = findDailyTaskByIndex(ix);
		
	if(t == null)
	{
		ct.basePanel.setEnabled(false);
	}
	else
	{
		if(t.complete_date.year != 0 && t.reward_date.year == 0 && !mEndNewguideDailyTask)
		{
			mEndNewguideDailyTask = true;
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.COMPLETE_NEWGUIDE_DAILYTASK), true);
		}
		
		var r : PlayerTaskRow = ResManager.LgtMgr.getPlayerTaskRow(t.task_id);
		ct.icon.load("Icon/" + r.icon + ".png.u3d"); 			// 异步加载图标
		ct.basePanel.setEnabled(true);							// 显示
		
		if(t.reward_date.year != 0)			//已经完成任务
		{
			ct.taskImgMark.setEnabled(true);
		}
		else
		{
			ct.taskImgMark.setEnabled(false);
		}
		ct.taskTitle.label.text = r.title;
		ct.tsakContent.label.text = r.target1;
		ct.taskPrizeDiamond.label.text = r.diamond.ToString();
		ct.taskPrizeExp.label.text = r.experience.ToString();
		if(r.reward_items.Count != 0){
			ct.tempicon.setEnabled(true);
			ct.tempx.setEnabled(true);
			ct.tempPrize.setEnabled(true);
			ct.tempPrize.label.text = r.reward_items_count[0].ToString();
			var item_id : int = r.reward_items[0];
			var item_row : ItemRow = ResManager.LgtMgr.getItemRow(item_id);
			var itm_icon : String = item_row.icon;
			_LoadItemImg(ct.tempicon, itm_icon);
		}
		else{
			ct.tempicon.setEnabled(false);
			ct.tempx.setEnabled(false);
			ct.tempPrize.setEnabled(false);
			ct.tempPrize.label.text = "";
		}
		
		//完成进度
		if (t.info.Count >=1)
		{
			var fl : flag_info = t.info[0];
			var str : String = fl.value.ToString() + "/" + fl.count.ToString();
			ct.taskStep.setEnabled(true);
			ct.taskStep.label.text = str;
		}
		else
		{
			ct.taskStep.setEnabled(false);
		}
		//领取按钮
		if(t.complete_date.year == 0)	//未完成任务,  不显示
		{
			ct.taskGetPrize.setEnabled(false);
		}
		else	//完成任务了
		{
			ct.taskGetPrize.setEnabled(true);
			if(t.reward_date.year == 0)	//未领取奖励
			{
				ct.taskGetPrize.style.normal.background = Resources.Load("UISkins/Textures/everydaytask/get_rewards");
				ct.taskGetPrize.style.hover.background = Resources.Load("UISkins/Textures/everydaytask/get_rewards_hover");
				ct.taskGetPrize.style.active.background = Resources.Load("UISkins/Textures/everydaytask/get_rewards");
			}
			else
			{
				ct.taskGetPrize.style.normal.background = Resources.Load("UISkins/Textures/everydaytask/get_over");
				ct.taskGetPrize.style.hover.background = null;
				ct.taskGetPrize.style.active.background = null;
			}
		}
		//
		var curr = Time.time;
		//换任务按钮
		var gray : boolean = false;
		//任务完成情况
		if(t.complete_date.year == 0)	//未完成
		{
			//nothing
		}
		else							//完成任务
		{
			if(t.reward_date.year == 0)	//未领取
			{
				gray = true;;
			}
			else						//领取了
			{
				//nothing
			}
		}
		//需要时间限制
		if( curr - ct.lastChangeTime < BUTTON_WAIT_TIME)
		{
			gray = true;
		}
		if(!gray)
		{
			ct.taskChange.style.normal.background = Resources.Load("UISkins/Textures/task/everdaytask_option_1");
			ct.taskChange.style.hover.background = Resources.Load("UISkins/Textures/task/everdaytask_option_2");
			ct.taskChange.style.active.background = Resources.Load("UISkins/Textures/task/everdaytask_option_1");
		}
		else
		{
			ct.taskChange.style.normal.background = Resources.Load("UISkins/Textures/task/everdaytask_option_3");
			ct.taskChange.style.hover.background = Resources.Load("UISkins/Textures/task/everdaytask_option_3");
			ct.taskChange.style.active.background = Resources.Load("UISkins/Textures/task/everdaytask_option_3");
		}
		//立即完成按钮
		gray = false;
		//任务完成情况
		if(t.complete_date.year == 0)	//未完成
		{
			//nothing
		}
		else							//完成任务
		{
			if(t.reward_date.year == 0)	//未领取
			{
				gray = true;
			}
			else						//领取了
			{
				gray = true;
			}
		}
		//需要时间限制
		if( curr - ct.lastCompleteTime < BUTTON_WAIT_TIME)
		{
			gray = true;
		}
		if(!gray)
		{
			ct.taskCompleteImm.style.normal.background = Resources.Load("UISkins/Textures/task/everdaytask_enter_1");
			ct.taskCompleteImm.style.hover.background = Resources.Load("UISkins/Textures/task/everdaytask_enter_2");
			ct.taskCompleteImm.style.active.background = Resources.Load("UISkins/Textures/task/everdaytask_enter_1");
		}
		else
		{
			ct.taskCompleteImm.style.normal.background = Resources.Load("UISkins/Textures/task/everdaytask_enter_3");
			ct.taskCompleteImm.style.hover.background = Resources.Load("UISkins/Textures/task/everdaytask_enter_3");
			ct.taskCompleteImm.style.active.background = Resources.Load("UISkins/Textures/task/everdaytask_enter_3");
		}
		//底板显示
		if(r.q_coin == 5)
		{
			ct.background.setEnabled(false);
		}
		else
		{
			ct.background.setEnabled(true);
		}
		//temp
		//var dieTime:DateTime = Convert.ToDateTime("2012-08-31 00:00:00");
		//var ts:TimeSpan = SysTimer.getCurTime() - dieTime;
		//Debug.Log("|||||||||||||||||||||||||||||||||||||||||||||" + ts.TotalSeconds.ToString());
		//if(ts.TotalSeconds > 0)
		//{
		//	ct.tempicon.setEnabled(false);
		//	ct.tempx.setEnabled(false);
		//	ct.tempPrize.setEnabled(false);
		//}
	}
}
//--------------------------------------------------
private function _LoadItemImg(img_frm : iGUILabel, img_name : String){
	var _asynIcon : AsynIcon = new AsynIcon(function (tex : Texture){img_frm.style.normal.background = tex; }, null);
	_asynIcon.load("Icon/" + img_name); 	
}
//--------------------------------------------------
//从任务列表中挑选指定索引的日常任务. 找不到返回空
private function findDailyTaskByIndex(ix:int) : task_info
{
	var ii : int = 0;
	for (var t : task_info in allTasks)
	{
		if (t.type == task_type.tt_daily)
		{
			if (ii == ix)
				return t;		//找到同一类型指定索引的任务
			
			ii++;
		}
	}
	return null;
}
//--------------------------------------------------
//找出日常任务对应的排列的几个
private function findDailyTaskOrder(t:task_info) : int
{
	var n : int = -1;
	for (var i:int = 0; i<allTasks.Count; ++i)
	{
		var tt : task_info = allTasks[i];
		if (tt.type == task_type.tt_daily)
		{
			n++;
		}
		if (Object.ReferenceEquals(tt, t))	//2个指针相同
			return n;
	}
	return n;
}
//--------------------------------------------------
//根据实例id找出索引
public function findTaskIndexByInstID(instId:UInt64) : int
{
	for (var i:int = 0; i<allTasks.Count; i++)
	{
		var t:task_info = allTasks[i];
		if (t.inst_id == instId)
			return i;
	}
	return -1;
}
//--------------------------------------------------
//根据实例id找出任务
public function findTaskByInstId(instId : UInt64) : task_info
{
	var index : int = findTaskIndexByInstID(instId);
	if (-1 == index)
		return null;
	
	return allTasks[index];
}
//--------------------------------------------------
//判断任务是否有奖励
public function isTaskHasAward(taskId : int) : boolean
{
	var taskRow : PlayerTaskRow = ResManager.LgtMgr.getPlayerTaskRow(taskId);
	return 0 != taskRow.reward_items.Count || 0 != taskRow.diamond || 0 != taskRow.experience || 0 != taskRow.hp;
}
//--------------------------------------------------
// 判断玩家是否可以接收该任务
public function canPlayerReceive(taskId : int) : boolean
{
	var taskRow : PlayerTaskRow = ResManager.LgtMgr.getPlayerTaskRow(taskId);
	var playerLevel : int = EQGameSceneMgr.getSingleton().getHouseData().level;
	return playerLevel >= taskRow.need_player_level;	// 玩家等级>=任务所需玩家等级时才可接收
}
//--------------------------------------------------
private function AddTask(t:task_info) : void
{
	allTasks.Add(t);
	
	if (t.type == task_type.tt_chain)
	{
		mOrderCommTaskInfoIndexes.Add(t.inst_id);
		
		//if(t.task_id >= 10000 && t.task_id <= 10010)
			mCurrTaskInfoIndex = t.inst_id;

//		if((t.info[0] as flag_info).value > 0){
//			task_target1_complete_f = true;
//		}
//		else{
//			task_target1_complete_f = false;
//		}
	}
}
//--------------------------------------------------
private function delTask(uid:UInt64) : void
{
	var ix:int = findTaskIndexByInstID(uid);
	if (ix < 0)
		return;
	
	var t : task_info = allTasks[ix];
	allTasks.RemoveAt(ix);
	if (t.type == task_type.tt_chain)
	{
		for (var i:int = 0; i < mOrderCommTaskInfoIndexes.Count; i++)
		{
			var oid : UInt64 = mOrderCommTaskInfoIndexes[i];
			if (uid == oid)
			{
				mOrderCommTaskInfoIndexes.RemoveAt(i);
				break;
			}
		}
		
		if (uid == mCurrTaskInfoIndex)
		{
			mCurrTaskInfoIndex = 0;
		}
	}
}
//--------------------------------------------------
//点击获取奖励的按钮
public function clickGetPrizeButton(ix:int) : void
{
	var t : task_info = findDailyTaskByIndex(ix);
	if (t == null)
		return;
	
	mEndNewguideDailyTask = false;
	if (t.complete_date.year != 0 && t.reward_date.year == 0)	//任务完成且未领取奖励
	{
		reqGetTaskReward(t.inst_id, t.type);
	}
}
//--------------------------------------------------
//点击立即完成按钮
public function clickImmdiateCompleteButton(ix:int) : void
{
	var t : task_info = findDailyTaskByIndex(ix);
	if (t == null)
		return;
		
	//任务完成情况
	if (t.complete_date.year == 0)	//未完成
	{
		//nothing
	}
	else							//完成任务
	{
		if (t.reward_date.year == 0)	//未领取
		{
			return;
		}
		else						//领取了
		{
			return;
		}
	}
	//需要时间限制
	var curr = Time.time;
	var dailyTaskCtrl : DailyTaskCtrl = mDailyTaskCtrls[ix] as DailyTaskCtrl;
	if (curr - dailyTaskCtrl.lastCompleteTime < BUTTON_WAIT_TIME)
		return;
	
	dailyTaskCtrl.lastCompleteTime = curr;
	if (t.complete_date.year == 0)	//未完成任务
	{
		var priceInfo : immediateCompleteTaskPrice = new immediateCompleteTaskPrice();
		priceInfo.inst_id = t.inst_id;
		priceInfo.type = t.type;
		Global.GetSysMsgHandler().RegistCallbackUserData(534, priceInfo);
		var r : PlayerTaskRow = ResManager.LgtMgr.getPlayerTaskRow(t.task_id);
		var price : int = r.q_coin;
		var params : ArrayList = new ArrayList();
		params.Add(price);
		Global.GetSysMsgHandler().ShowSysMsg(534,params);
	}
}

//--
static function confirmCallback(caller : iGUIElement){
	var info : immediateCompleteTaskPrice = caller.userData as immediateCompleteTaskPrice;
	Task.getInstance().reqImmediateComplete(info.inst_id, info.type);
}
//--
static function cancelCallback(caller : iGUIElement){

}
//--------------------------------------------------
//点击更换任务按钮
public function clickChangeTaskButton(ix:int) : void
{
	var t : task_info = findDailyTaskByIndex(ix);
	if (t == null)
		return;

	//任务完成情况
	if (t.complete_date.year == 0)	//未完成
	{
		//nothing
	}
	else							//完成任务
	{
		if (t.reward_date.year == 0)	//未领取
		{
			return;
		}
		else						//领取了
		{
			//nothing
		}
	}
	//需要时间限制
	var curr = Time.time;
	var dailyTaskCtrl : DailyTaskCtrl = mDailyTaskCtrls[ix] as DailyTaskCtrl;
	if (curr - dailyTaskCtrl.lastChangeTime < BUTTON_WAIT_TIME)
		return;
	
	dailyTaskCtrl.lastChangeTime = curr;
	reqChangeTask(t.inst_id, t.type);
}
//--------------------------------------------------
// 请求领取奖励. instID任务唯一id, type任务类型
public static function reqGetTaskReward(instID : UInt64, type : int) : void
{
	var packet : req_get_task_reward = new req_get_task_reward();
	packet.inst_id = instID;
	packet.type = type;
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 请求更换任务
public static function reqChangeTask(instID : UInt64, type : int) : void
{
	var packet : req_change_task = new req_change_task();
	packet.inst_id = instID;
	packet.type = type;
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 请求立即完成任务
public static function reqImmediateComplete(instID : UInt64, type : int) : void
{
	var packet : req_immediate_complete = new req_immediate_complete();
	packet.inst_id = instID;
	packet.type = type;
	NetHelper.Send(packet);
}
//--------------------------------------------------
//完成任务
private function notifyCompleteTask(evt:GameEvent, pack:notify_complete_task) : void
{
	var ix : int = findTaskIndexByInstID(pack.info.inst_id);	//如果返回-1, 那就挂掉把
	if (ix < 0)
		return;
	
	allTasks[ix] = pack.info;
	updateUIWhenTaskInfoChange(allTasks[ix]);
	calcRewardChangeAndPostEvent(pack.info.type == task_type.tt_daily, pack.info.type == task_type.tt_chain);
	//通知链式任务完成
	if (pack.info.type == task_type.tt_chain)
	{
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_CHAIN_TASK_COMPLETE), pack.info.inst_id);
	}
}
//--------------------------------------------------
//完成奖励
private function notifyRewardTask(evt:GameEvent, pack:notify_reward_task) : void
{
	var ix : int = findTaskIndexByInstID(pack.info.inst_id);
	if (ix < 0)
		return;
	
	allTasks[ix] = pack.info;
	updateUIWhenTaskInfoChange(allTasks[ix]);
	//piaoShuzhi(allTasks[ix]);
	calcRewardChangeAndPostEvent(pack.info.type == task_type.tt_daily, pack.info.type == task_type.tt_chain);
	//通知链式任务领取奖励
	if (pack.info.type == task_type.tt_chain)
	{
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_CHAIN_TASK_REWARD), pack.info.inst_id);
	}
}
//--------------------------------------------------
//通知客户端到的切换任务
private function notifyChangeTask(evt:GameEvent, pack:notify_change_task) : void
{
	var ix : int = findTaskIndexByInstID(pack.inst_id);
	if (ix < 0)
		return;
	
	allTasks[ix] = pack.info;
	updateUIWhenTaskInfoChange(allTasks[ix]);
	calcRewardChangeAndPostEvent(pack.info.type == task_type.tt_daily, pack.info.type == task_type.tt_chain);
}
//--------------------------------------------------
//通知任务进度变更
private function notifyTaskFlag(evt:GameEvent, pack:notify_task_flag) : void
{
	var ix : int = findTaskIndexByInstID(pack.inst_id);
	if (ix < 0)
		return;
	
	(allTasks[ix] as task_info).info = pack.info;
	updateUIWhenTaskInfoChange(allTasks[ix]);
}
//--------------------------------------------------
//当对应任务消息改变时, 更新指定的界面. 这里只是涉及到改变, 而不涉及到添加和删除任务列表
private function updateUIWhenTaskInfoChange(t:task_info) : void
{
	if (t.type == task_type.tt_daily)
	{
		//如果是日常任务就更新指定位置的界面
		updateDailyPanel(findDailyTaskOrder(t));
	}
	else if (t.type == task_type.tt_chain && mCurrTaskInfoIndex != 0)
	{
		//更新任务主面板
		if (t == allTasks[findTaskIndexByInstID(mCurrTaskInfoIndex)])
		{
			updateCommTaskPanel();

//			if((t.info[0] as flag_info).value > 0){
//				task_target1_complete_f = true;
//			}
//			else{
//				task_target1_complete_f = false;
//			}
		}
	}
}
//--------------------------------------------------
//增加任务
private function notifyAddTask(evt:GameEvent, pack:notify_add_task) : void
{	
	if(allTasks == null)
	{
		allTasks = new ArrayList();
		// 初始化普通任务
		loadMainuiTaskCtrls();
	}
	//
	var daily : boolean = false;
	var chain : boolean = false;
	for (var ti1 : task_info in pack.tasks)
	{
		AddTask(ti1);
		
		if (task_type.tt_daily == ti1.type)
			daily = true;
		else if (task_type.tt_chain == ti1.type)
			chain = true;
	}
	//更新chain list的ui
//	updateCommTaskMainUI();
	updateTaskSelectUI();
	//
	for (var ti2 : task_info in pack.tasks)
	{
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_ADD_TASK), ti2.inst_id);
	}
	//
	calcRewardChangeAndPostEvent(daily, chain);
}
//--------------------------------------------------
//删除任务
private function notifyDecTask(evt:GameEvent, pack:notify_dec_task) : void
{
	var hasChain : boolean = false;
	
	for(var i:int = 0; i < pack.inst_ids.Count; i++)
	{
		var uid:UInt64 = pack.inst_ids[i];
		delTask(uid);
	}
	//更新chain list的ui
//	updateCommTaskMainUI();
	updateTaskSelectUI();
	if (closeCommTaskUI == 0)
	{
		closeCommTaskUI();
	}
}
//--------------------------------------------------
////飘数字
//private function piaoShuzhi(t:task_info) : void
//{
//	if(t.type == task_type.tt_daily)
//	{
//		var dailyIndex = findDailyTaskOrder(t);
//		var ct : DailyTaskCtrl = mDailyTaskCtrls[dailyIndex];
//		var r : PlayerTaskRow = ResManager.LgtMgr.getPlayerTaskRow(t.task_id);
//		
//		var rect : Rect = ct.taskPrizeDiamond.rect;
//		rect.x -= 30;
//		//UIAnimation.createNumberAnimation(rect, Rect(rect.x,rect.y-100,0,0), "crystal_big", r.diamond);
//		
//		rect = ct.taskPrizeExp.rect;
//		rect.x -= 30;
//		//UIAnimation.createNumberAnimation(rect, Rect(rect.x,rect.y-100,0,0), "crystal_big", r.experience);
//	}
//}
//--------------------------------------------------
//计算奖励领取情况和抛出事件
private function calcRewardChangeAndPostEvent(daily:boolean, comm:boolean) : void
{
	//日常任务
	if(daily)
	{
		var reward : boolean = true;
		for(var i:int = 0; i < DAILY_TASK_MAX_COUNT; i++)
		{
			var t : task_info = findDailyTaskByIndex(i);
			if(t == null)
				break;
			
			if(t.complete_date.year != 0 && t.reward_date.year == 0)	//已经完成任务, 且未领取
			{
				reward = false;
				break;
			}
		}
		if(reward)//在可以获取奖励都领取的情况下, 判断释放还有任务没完成
		{
			PostCompletedDailyTaskState();
		}
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.DAIYLY_TASK_REWARD), reward);
	}
	//普通任务
	if(comm)
	{
		//more
	}
}
//--------------------------------------------------
private function PostCompletedDailyTaskState() : void
{
	var nocompleted : boolean = false;
	for(var i:int = 0; i < DAILY_TASK_MAX_COUNT; i++)
	{
		var t : task_info = findDailyTaskByIndex(i);
		if(t == null)
			break;
		
		if(t.complete_date.year == 0)	//有没有完成的任务
		{
			nocompleted = true;
			break;
		}
	}
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.DAIYLY_TASK_COMPLETE), nocompleted);
}
//--------------------------------------------------



//--------------------------------------------------
//普通任务从这里开始
//--------------------------------------------------
//普通任务控件
class CommTaskCtrl
{
	var iconUI : iGUIButton;
	var icon : AsynIcon = new AsynIcon(iconCallback, Resources.Load("UISkins/Textures/Common1/box2"));
	
	function CommTaskCtrl(btn : iGUIButton)
	{
		iconUI = btn;
	}
	
	function iconCallback(tex:Texture)
	{
		iconUI.style.normal.background = tex;
	}
	
	function clear()
	{
		icon.cancel();
	}
}



//任务物品的异步处理
class AsynTaskItemCtrl
{
	var iconUI : iGUILabel;
	var icon : AsynIcon = new AsynIcon(iconCallback, null);
	
	function AsynTaskItemCtrl(label : iGUILabel)
	{
		iconUI = label;
	}
	
	function iconCallback(tex:Texture)
	{
		iconUI.style.normal.background = tex;
	}
	
	function clear()
	{
		icon.cancel();
	}
}



//-------------------普通任务成员变量--------------------
// 主界面的任务个数
private static var MAINUI_TASK_COUNT : int = 3;
// 上个普通任务完成时间
private var mLastCommTaskCompleteTime : float = 0.0f;
// 所有的普通任务信息引用, 这个列表是排序表. 前面3个是主界面显示的任务, 其它是在任务面板的任务
private var mOrderCommTaskInfoIndexes : Array = new Array();
// 当前的任务信息索引
private var mCurrTaskInfoIndex : UInt64 = 0;
// 主界面的任务按钮
private var mMainuiTaskCtrls : Array = new Array();
// 任务面板的物品图标的异步加载数组
private var mAsynTaskItemCtrls : Array = new Array();
// 选择任务面板的任务数
private static var SELECTUI_TASK_COUNT : int = 20;
// 选择面板上的任务按钮
private var mSelectuiTaskCtrls : Array = new Array();
//--------------------------------------------------
public function clickMainUITaskBtn(num : int) : void
{
	var ix : int = num - 1;
	if (ix < MAINUI_TASK_COUNT)
	{
		mCurrTaskInfoIndex = mOrderCommTaskInfoIndexes[ix];
		openCommTaskUI();
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_TASK_BTN), mCurrTaskInfoIndex);
	}
	else
	{
		openTaskSelectUI();
	}
}
//--------------------------------------------------
//点击获取奖励的按钮
public function clickCommTaskCompleteBtn() : void
{
	//任务完成, 请求领取奖励, 且关闭界面
	var t : task_info = allTasks[findTaskIndexByInstID(mCurrTaskInfoIndex)];
	if (t.complete_date.year != 0)	
	{
		reqGetTaskReward(t.inst_id, t.type);
		closeCommTaskUI();
	}
}
//--------------------------------------------------
//点击立即完成按钮
public function clickCommTaskImmediatelyBtn() : void
{
	requestImmediatelyTask(mCurrTaskInfoIndex);
}
//--------------------------------------------------
// 请求立即完成任务
public function requestImmediatelyTask(instId : UInt64) : void
{
	var t : task_info = allTasks[findTaskIndexByInstID(instId)];
	//任务完成, 则返回
	if (t.complete_date.year != 0)
		return;
	
	//需要时间限制
	var curr : float = Time.time;
	if (curr - mLastCommTaskCompleteTime < BUTTON_WAIT_TIME)
		return;
	
	mLastCommTaskCompleteTime = curr;
	if (t.complete_date.year == 0)	//未完成任务
	{
		var priceInfo : immediateCompleteTaskPrice = new immediateCompleteTaskPrice();
		priceInfo.inst_id = t.inst_id;
		priceInfo.type = t.type;
		Global.GetSysMsgHandler().RegistCallbackUserData(534, priceInfo);
		var r : PlayerTaskRow = ResManager.LgtMgr.getPlayerTaskRow(t.task_id);
		var price : int = r.q_coin;
		var params : ArrayList = new ArrayList();
		params.Add(price);
		Global.GetSysMsgHandler().ShowSysMsg(534,params);
	}
}
//--------------------------------------------------
//打开普通任务的ui.
public function openCommTaskUI(taskUid : UInt64) : void
{
	// step1:
	closeCommTaskUI();
	// step2:
	mCurrTaskInfoIndex = taskUid;
	// step3:
	openCommTaskUI();
}
//--------------------------------------------------
// 打开普通任务的ui
private function openCommTaskUI() : void
{
	if (isCommTaskUIOpen())
		return;
	
	UI.getUI().OpenUIRoot("TaskUI");
	UI.getUI().SetModal("TaskUI", true);
	// 更新页面
	createAsynTaskItemCtrls();
	updateCommTaskPanel();
}
//--------------------------------------------------
// 关闭日常任务UI
public function closeCommTaskUI() : void
{
	if (false == isCommTaskUIOpen())
		return;
	
	UI.getUI().SetModal("TaskUI", false);
	UI.getUI().CloseUIRoot("TaskUI");
	// 清除数据
	clearAsynTaskItemCtrls();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), mCurrTaskInfoIndex);
}
//--------------------------------------------------
//普通任务界面是否开着
private function isCommTaskUIOpen() : boolean
{
	return UI.getUI().isUIRootOpen("TaskUI");
}
//--------------------------------------------------
private function commTaskGui() : iGUICode_TaskUI
{
	return iGUICode_TaskUI.getInstance();
}
//--------------------------------------------------
// 创建普通任务面板的异步图标事件
public function createAsynTaskItemCtrls() : void
{
	var gui : iGUICode_TaskUI = iGUICode_TaskUI.getInstance();
	if (null == gui)
		return;
	
	mAsynTaskItemCtrls.Add(new AsynTaskItemCtrl(gui.CommTaskItem1));
  	mAsynTaskItemCtrls.Add(new AsynTaskItemCtrl(gui.CommTaskItem2));
  	mAsynTaskItemCtrls.Add(new AsynTaskItemCtrl(gui.CommTaskItem3));
}
//--------------------------------------------------
// 清除普通任务面板的异步图标事件
public function clearAsynTaskItemCtrls() : void
{
	for (var atic : AsynTaskItemCtrl in mAsynTaskItemCtrls)
	{
		atic.clear();
	}
	mAsynTaskItemCtrls.Clear();
}
//--------------------------------------------------
private function loadMainuiTaskCtrls() : void
{
	if (0 != mMainuiTaskCtrls.Count)
		return;
	
	var mainui : iGUICode_MainUI = iGUICode_MainUI.getInstance();
	mMainuiTaskCtrls.Add(new CommTaskCtrl(mainui.TaskBtn1));
	mMainuiTaskCtrls.Add(new CommTaskCtrl(mainui.TaskBtn2));
	mMainuiTaskCtrls.Add(new CommTaskCtrl(mainui.TaskBtn3));
	mMainuiTaskCtrls.Add(new CommTaskCtrl(mainui.TaskBtn4));
}
//--------------------------------------------------
private function updateCommTaskMainUI() : void
{
	//先设置为隐藏
	for (var ctc : CommTaskCtrl in mMainuiTaskCtrls)
	{
		ctc.iconUI.setEnabled(false);
	}
	//显示
	for (var i:int = 0; i<mOrderCommTaskInfoIndexes.Count; ++i)
	{
		if (i == MAINUI_TASK_COUNT)
			break;
		
		var ti : task_info = allTasks[findTaskIndexByInstID(mOrderCommTaskInfoIndexes[i])];
		var r : PlayerTaskRow = ResManager.LgtMgr.getPlayerTaskRow(ti.task_id);
		if (0 == r.is_show)
			continue;
		
		var ctc : CommTaskCtrl = mMainuiTaskCtrls[i];		
		ctc.icon.load("Icon/" + r.icon + ".png.u3d"); 		// 异步加载图标
		ctc.iconUI.setEnabled(true);						// 显示
	}
	//需要显示更多任务的按钮
	if (mOrderCommTaskInfoIndexes.Count > MAINUI_TASK_COUNT)
	{
		ctc = mMainuiTaskCtrls[i];
		ctc.iconUI.setEnabled(true);
	}
}
//--------------------------------------------------
private function updateCommTaskPanel() : void
{
	if (false == isCommTaskUIOpen())
		return;
	
	var currTaskInfo : task_info = allTasks[findTaskIndexByInstID(mCurrTaskInfoIndex)];
	var r : PlayerTaskRow = ResManager.LgtMgr.getPlayerTaskRow(currTaskInfo.task_id);
	refreshTaskPanel(currTaskInfo, r);
}
//--------------------------------------------------
// 更新系列任务面板
public function refreshTaskPanel(taskInfo : task_info, taskRow : PlayerTaskRow) : void
{
	var gui : iGUICode_TaskUI = iGUICode_TaskUI.getInstance();
	if (null == gui)
		return;
	
	gui.CommTaskTitle.label.text = taskRow.title;
	gui.CommTaskMainContent.label.text = taskRow.describe;
	// 
	gui.CommTaskTargetContent1.label.text = taskRow.target1;
	if (taskInfo.info.Count >=1)
	{
		gui.CommTaskTargetStep1.label.text = (taskInfo.info[0] as flag_info).value.ToString() + "/" + (taskInfo.info[0] as flag_info).count.ToString();
	}
	else
	{
		gui.CommTaskTargetStep1.label.text = "";
	}
	gui.CommTaskTargetStep1.setEnabled("" != taskRow.target1);
	//
	gui.CommTaskTargetContent2.label.text = taskRow.target2;
	if (taskInfo.info.Count >=2)
	{
		gui.CommTaskTargetStep2.label.text = (taskInfo.info[1] as flag_info).value.ToString() + "/" + (taskInfo.info[1] as flag_info).count.ToString();
	}
	else
	{
		gui.CommTaskTargetStep2.label.text = "";
	}
	gui.CommTaskTargetStep2.setEnabled("" != taskRow.target2);
	//
	gui.CommTaskTargetContent3.label.text = taskRow.target3;
	if (taskInfo.info.Count >=3)
	{
		gui.CommTaskTargetStep3.label.text = (taskInfo.info[2] as flag_info).value.ToString() + "/" + (taskInfo.info[2] as flag_info).count.ToString();
	}
	else
	{
		gui.CommTaskTargetStep3.label.text = "";
	}
	gui.CommTaskTargetStep3.setEnabled("" != taskRow.target3);
	//
	gui.CommTaskGold.label.text = taskRow.diamond.ToString();
	gui.CommTaskExp.label.text = taskRow.experience.ToString();
	
	//三个物品
	sysnTaskItemCtrl(taskRow, 0);
	sysnTaskItemCtrl(taskRow, 1);
	sysnTaskItemCtrl(taskRow, 2);
	//立即完成按钮
	var immGray : boolean = false;
	if (taskInfo.complete_date.year != 0)	//完成
	{
		immGray = true;
	}
	//
	if (taskRow.q_coin == -1)
	{
		gui.CommTaskImmediately.setEnabled(false);
		gui.CommTaskImmediatelyNum.setEnabled(false);
	}
	else 
	{
		gui.CommTaskImmediately.setEnabled(true);
		var _icon : String = "";
		if(PlatformMgr.IsPlatYY())
			_icon = "yy_awaycomplete_";
		else
			_icon = "awaycomplete_";
		
		if (false == immGray)
		{
			gui.CommTaskImmediately.style.normal.background = Resources.Load("UISkins/Textures/task/" + _icon + "n");
			gui.CommTaskImmediately.style.hover.background = Resources.Load("UISkins/Textures/task/" + _icon + "h");
			gui.CommTaskImmediately.style.active.background = Resources.Load("UISkins/Textures/task/" + _icon + "n");
		}
		else
		{
			gui.CommTaskImmediately.style.normal.background = Resources.Load("UISkins/Textures/task/" + _icon + "g");
			gui.CommTaskImmediately.style.hover.background = Resources.Load("UISkins/Textures/task/" + _icon + "g");
			gui.CommTaskImmediately.style.active.background = Resources.Load("UISkins/Textures/task/" + _icon + "g");
		}
		gui.CommTaskImmediatelyNum.setEnabled(true);
		gui.CommTaskImmediatelyNum.label.text = taskRow.q_coin.ToString();
	}
	//领取按钮
//	if (taskInfo.complete_date.year == 0)	//未完成任务,不显示
//	{
//		gui.CommTaskComplete.setEnabled(false);
//	}
//	else										//完成任务了
//	{
//		gui.CommTaskComplete.setEnabled(true);	//一定是未领取奖励
//	}
}
//--------------------------------------------------
//同步奖励物品的图标
private function sysnTaskItemCtrl(r:PlayerTaskRow, ix:int) : void
{
	var attc : AsynTaskItemCtrl = mAsynTaskItemCtrls[ix];
	if (r.reward_items.Count > ix)
	{
		var it : ItemRow = ResManager.LgtMgr.getItemRow(r.reward_items[ix]);
		attc.icon.load("Icon/" + it.icon);
	}
	else
	{
		attc.clear();
		attc.iconCallback(null);
	}
}
//--------------------------------------------------



//-------------------选择面板UI---------------------
// 打开任务选择界面
private function openTaskSelectUI() : void
{
	UI.getUI().OpenUIRoot("TaskSelectUI");
	UI.getUI().SetModal("TaskSelectUI", true);
	// 更新页面
	createSelectuiTaskCtrls();
	updateTaskSelectUI();
}
//--------------------------------------------------
// 关闭任务选择界面
public function closeTaskSelectUI() : void
{
	UI.getUI().SetModal("TaskSelectUI", false);
	UI.getUI().CloseUIRoot("TaskSelectUI");
	// 清除数据
	clearSelectuiTaskCtrls();
}
//--------------------------------------------------
private function createSelectuiTaskCtrls() : void
{
	// 创建异步加载的图标
	var gui : iGUICode_TaskSelectUI = iGUICode_TaskSelectUI.getInstance();
	for (var i:int = 0; i<SELECTUI_TASK_COUNT; ++i)
	{
		mSelectuiTaskCtrls.Add(new CommTaskCtrl(gui.getTaskSelectSlot(i)));
	}
}
//--------------------------------------------------
// 清除选择任务面板的异步图标事件
private function clearSelectuiTaskCtrls() : void
{
	for (var ctc : CommTaskCtrl in mSelectuiTaskCtrls)
	{
		ctc.clear();
	}
	mSelectuiTaskCtrls.Clear();
}
//--------------------------------------------------
// 点击选择面板的任务图标
public function clickTaskSelectSlot(no : int) : void
{
	var inx = no + MAINUI_TASK_COUNT;
	if (inx >= mOrderCommTaskInfoIndexes.Count)
		return;
	
	var lastMainuiTaskId : UInt64 = mOrderCommTaskInfoIndexes[MAINUI_TASK_COUNT-1];
	// 移动主界面的任务顺序
	for (var i:int = MAINUI_TASK_COUNT-1; i>=1; --i)
	{
		mOrderCommTaskInfoIndexes[i] = mOrderCommTaskInfoIndexes[i-1];
	}
	mOrderCommTaskInfoIndexes[0] = mOrderCommTaskInfoIndexes[inx];					// 当前任务移动到第一个
	// 移动选择面板的任务顺序
	for (var j:int = inx; j < mOrderCommTaskInfoIndexes.Count-1; ++j)
	{
		mOrderCommTaskInfoIndexes[j] = mOrderCommTaskInfoIndexes[j+1];
	}
	mOrderCommTaskInfoIndexes[mOrderCommTaskInfoIndexes.Count-1] = lastMainuiTaskId;	// 主面板任务移动到最后一个
	// 更新
//	updateCommTaskMainUI();
	updateTaskSelectUI(); 
}
//--------------------------------------------------
// 更新任务选择面板
private function updateTaskSelectUI() : void
{
	if (false == UI.getUI().isUIRootOpen("TaskSelectUI"))
		return;
	
	// 先设置为隐藏
	for (var ctc : CommTaskCtrl in mSelectuiTaskCtrls)
	{
		ctc.iconUI.setEnabled(false);
	}
	// 显示
	for (var i:int = MAINUI_TASK_COUNT; i<mOrderCommTaskInfoIndexes.Count; ++i)
	{
		// 总任务数超过
		if (MAINUI_TASK_COUNT + SELECTUI_TASK_COUNT == i)
			break;
		
		var ti : task_info = allTasks[findTaskIndexByInstID(mOrderCommTaskInfoIndexes[i])];
		var ctc : CommTaskCtrl = mSelectuiTaskCtrls[i-MAINUI_TASK_COUNT];
		var row : PlayerTaskRow = ResManager.LgtMgr.getPlayerTaskRow(ti.task_id);
		ctc.icon.load("Icon/" + row.icon + ".png.u3d"); 		// 异步加载图标
		ctc.iconUI.setEnabled(true);							// 显示
	}
}
//--------------------------------------------------


