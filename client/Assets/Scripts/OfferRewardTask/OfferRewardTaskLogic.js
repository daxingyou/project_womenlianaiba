/*--------------------------------------------------
悬赏任务逻辑(2012/9/7 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast
import iGUI;


private static var mInstance : OfferRewardTaskLogic = null;
private static var mCtrl : Controller = new Controller();			// 控制器
private var mCanCompleteTask : boolean = true;						// 可以完成任务标识,注意,初始为true



//--------------------------------------------------
function Awake()
{
	mInstance = this;
}
function Start()
{
	registEvents();
}
public static function getInstance() : OfferRewardTaskLogic
{
	if (null == mInstance)
	{
		throw new Exception("OfferRewardTaskLogic -> instance is null!");
	}
	return mInstance;
}
//--------------------------------------------------
// 事件注册
private function registEvents() : void
{
	// 网络事件注册
	NetHelper.RegistHandler(new notify_open_post_reward_ui(), handle_notify_open_post_reward_ui);
	NetHelper.RegistHandler(new notify_complete_post_reward(), handle_notify_complete_post_reward);
}
//--------------------------------------------------
// 请求打开悬赏任务界面
public static function request_open_post_reward_ui() : void
{
	var packet : req_open_post_reward_ui  = new req_open_post_reward_ui();
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 处理通知打开悬赏任务界面
private function handle_notify_open_post_reward_ui(evt : GameEvent, pack : notify_open_post_reward_ui) : void
{
	openOfferRewardTaskUI();
	// step1:目标任务
	for (var i:int=0; i<pack.require_items.Count; ++i)
	{
		var require : require_item_atom = pack.require_items[i];
		if (0 == require.item_id)
			continue;
		
		var require_row : ItemRow = ResManager.LgtMgr.getItemRow(require.item_id);
		var cur_count : int = SelfItemLogic.getInstance().getItemNum(require.item_id);
		require.content = replaceRequireItemName(require.content, i + 1, require_row.name);
		require.content = replaceRequireItemCount(require.content, i + 1, require.item_count);
		pack.content = replaceRequireItemName(pack.content, i + 1, require_row.name);
		pack.content = replaceRequireItemCount(pack.content, i + 1, require.item_count);
		iGUICode_OfferRewardTaskUI.getInstance().setTaskTarget(i, require.content, cur_count, require.item_count);
		if (mCanCompleteTask)
		{
			mCanCompleteTask = cur_count >= require.item_count;
		}
	}
	// step2:水晶,经验
	iGUICode_OfferRewardTaskUI.getInstance().setReawrdGoldExp(pack.reward_diamond, pack.reward_exp);
	// step3:奖励物品
	for (var j:int=0; j<pack.reward_items.Count; ++j)
	{
		var reward : reward_item_atom = pack.reward_items[j];
		if (0 == reward.item_id)
			continue;
		
		var reward_row : ItemRow = ResManager.LgtMgr.getItemRow(reward.item_id);
		pack.content = replaceRewardItemName(pack.content, i + 1, reward_row.name);
		pack.content = replaceRewardItemCount(pack.content, i + 1, reward.item_count);
		iGUICode_OfferRewardTaskUI.getInstance().setTaskItem(j, reward_row, reward.item_count);
	}
	// step4:任务描述
	iGUICode_OfferRewardTaskUI.getInstance().setTaskMainContent(pack.content);
	// step5:完成按钮状态
	iGUICode_OfferRewardTaskUI.getInstance().setCompleteTaskBtn(mCanCompleteTask);
}
//--------------------------------------------------
// 请求完成悬赏任务
public static function request_complete_post_reward() : void
{
	var packet : req_complete_post_reward  = new req_complete_post_reward();
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 处理通知完成悬赏任务
private function handle_notify_complete_post_reward(evt : GameEvent, pack : notify_complete_post_reward) : void
{
	if (complete_post_reward_type.cprt_ok == pack.result)
	{
		closeOfferRewardTaskUI();
	}
}
//--------------------------------------------------
// 打开悬赏任务界面
public function openOfferRewardTaskUI() : void
{
	UI.getUI().OpenUIRoot("OfferRewardTaskUI");
	UI.getUI().SetModal("OfferRewardTaskUI", true);
	iGUICode_OfferRewardTaskUI.getInstance().init();
	mCanCompleteTask = true;
}
//--------------------------------------------------
// 关闭悬赏任务界面
public function closeOfferRewardTaskUI() : void
{
	UI.getUI().SetModal("OfferRewardTaskUI", false);
	UI.getUI().CloseUIRoot("OfferRewardTaskUI");
	mCanCompleteTask = true;
}
//--------------------------------------------------
// 任务要求的道具名字
public static function replaceRequireItemName(str : String, index : int, name : String) : String
{
	return str.Replace("i_name" + index.ToString(), name);
}
//--------------------------------------------------
// 任务要求的道具数量
public static function replaceRequireItemCount(str : String, index : int, count : int) : String
{
	return str.Replace("i_count" + index.ToString(), count.ToString());
}
//--------------------------------------------------
// 任务获得的道具名字
public static function replaceRewardItemName(str : String, index : int, name : String) : String
{
	return str.Replace("g_name" + index.ToString(), name);
}
//--------------------------------------------------
// 任务获得的道具数量
public static function replaceRewardItemCount(str : String, index : int, count : int) : String
{
	return str.Replace("g_count" + index.ToString(), count.ToString());
}
//--------------------------------------------------
// 任务需要的功能说明
public static function replaceFunctionName(str : String, index : int, name : String) : String
{
	return str.Replace("fun_name" + index.ToString(), name);
}
//--------------------------------------------------
// 任务需要的功能次数 
public static function replaceFunctionTimes(str : String, index : int, times : int) : String
{
	return str.Replace("fun_times" + index.ToString(), times.ToString());
}
//--------------------------------------------------
// 任务目标的NPC名字
public static function replaceNPCName(str : String, index : int, name : String) : String
{
	return str.Replace("n_name" + index.ToString(), name);
}
//--------------------------------------------------
// 任务目标的地图名
public static function replaceMapName(str : String, index : int, name : String) : String
{
	return str.Replace("map" + index.ToString(), name);
}
//--------------------------------------------------


