/*--------------------------------------------------
离婚系统(2012/7/24 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast
import iGUI;



private static var mInstance : Divorce = null;
private static var mCtrl : Controller = new Controller();			// 控制器



//--------------------------------------------------
function Awake()
{
	mInstance = this;
	registEvents();
}
//--------------------------------------------------
public static function getInstance() : Divorce
{
	return mInstance;
}
//--------------------------------------------------
// 根据等级获取花费
public function getCost(level : int) : int
{
	for (var kv : DictionaryEntry in ResManager.LgtMgr.DivorceTable)
	{
		var row : DivorceRow = kv.Value as DivorceRow;
		if (level == row.level)
			return row.cost;
	}
	throw new Exception("Divorce -> getCost(int) -> can't find level [" + level + "]!");
}
//--------------------------------------------------
// 事件注册
private function registEvents() : void
{
	// 网络事件注册
	NetHelper.RegistHandler(new notify_breakup_ack(), handle_notify_breakup_ack);
	NetHelper.RegistHandler(new notify_breakup_error(), handle_notify_breakup_error);
	NetHelper.RegistHandler(new notify_player_breakup_none(), handle_notify_player_breakup_none);
	NetHelper.RegistHandler(new notify_player_breakup(), handle_notify_player_breakup);
	NetHelper.RegistHandler(new notify_player_breakup_diamond(), handle_notify_player_breakup_diamond);
	NetHelper.RegistHandler(new notify_player_be_breakuped(), handle_notify_player_be_breakuped);
	// 其他事件注册
	addObserver("event_open_divorce_ui4", handleOpenDivorceUI4);
}
//--------------------------------------------------
// 发布事件
public static function publishEvent(event : String, obj : System.Object) : void
{
	mCtrl.Excute(event, obj);
}
//--------------------------------------------------
// 添加事件观察者
public static function addObserver(event : String, observer : Function) : void
{
	mCtrl.Register(event, observer);
}
//--------------------------------------------------
// 移除事件观察者
public static function delObserver(event : String, observer : Function) : void
{
	mCtrl.Unregister(event, observer);
}
//--------------------------------------------------
// 设置标识
public static function setFlag(flag_name : String, flag : System.Object) : void
{
	mCtrl.Set(flag_name, flag);
}
//--------------------------------------------------
// 获取标识
public static function getFlag(flag_name : String) : System.Object
{
	return mCtrl.Get(flag_name);
}
//--------------------------------------------------
// 请求离婚
public static function request_breakup(cost : int, items : Array) : void
{
	Login.setRepeatLoginFlag(true);
	Login.m_avoidRepeatLoginDia = true;
	
	var packet : req_breakup = new req_breakup();
	packet.diamond = cost;
	for (var ie : item in items)
	{
		packet.expect_items.Add(ie);
	}
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 处理通知请求离婚成功结果
private function handle_notify_breakup_ack(evt : GameEvent, pack : notify_breakup_ack) : void
{
	openDivorceUI(3);
}
//--------------------------------------------------
// 处理通知请求离婚失败结果
private function handle_notify_breakup_error(evt : GameEvent, pack : notify_breakup_error) : void
{
	//
}
//--------------------------------------------------
// 请求分手结果
public static function request_player_breakup() : void
{
	var packet : req_player_breakup  = new req_player_breakup();
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 处理通知没有分手结果
private function handle_notify_player_breakup_none(evt : GameEvent, pack : notify_player_breakup_none) : void
{
	// 不必处理
}
//--------------------------------------------------
// 处理通知分手结果
private function handle_notify_player_breakup(evt : GameEvent, pack : notify_player_breakup) : void
{
	setFlag("diamond", pack.diamond);
	setFlag("items", pack.unobtained_items);
	openDivorceUI(4);
}
//--------------------------------------------------
// 请求领取离婚后的水晶
public static function request_player_breakup_diamond() : void
{
	var packet : req_player_breakup_diamond  = new req_player_breakup_diamond ();
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 处理通知领取离婚后所得的水晶
private function handle_notify_player_breakup_diamond(evt : GameEvent, pack : notify_player_breakup_diamond) : void
{
	openDivorceUI(7);
}
//--------------------------------------------------
// 处理通知玩家被离婚
private function handle_notify_player_be_breakuped(evt : GameEvent, pack : notify_player_be_breakuped) : void
{
	Login.setRepeatLoginFlag(true);
	Login.m_avoidRepeatLoginDia = true;
	
	UI.getUI().OpenMsgbox("", Define.getContent(5094), Define.refresh, CallbackRefreshPage as iGUIEventCallback);
}
//--------------------------------------------------
// 回调
private function CallbackRefreshPage(callback : iGUIElement) : void
{
	ExternalFlatform.ReloadPage();
}
//--------------------------------------------------
// 打开离婚界面,flag:第几个界面
public function openDivorceUI(flag : int) : void
{
	UI.getUI().OpenUIRoot("DivorceUI");
	UI.getUI().SetModal("DivorceUI", true);
	iGUICode_DivorceUI.getInstance().openUI(flag);
}
//--------------------------------------------------
// 关闭离婚界面
public function closeDivorceUI() : void
{
	UI.getUI().SetModal("DivorceUI", false);
	UI.getUI().CloseUIRoot("DivorceUI");
}
//--------------------------------------------------
// 打开离婚界面4
private function handleOpenDivorceUI4(flag : boolean) : void
{
	if (true == getFlag("open_divorce_ui4_flag"))
		return;
	
	setFlag("open_divorce_ui4_flag", flag);
	request_player_breakup();
}
//--------------------------------------------------


