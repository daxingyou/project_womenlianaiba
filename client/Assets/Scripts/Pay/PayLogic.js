#pragma strict
#pragma downcast

/*--------------------------------------------------
充值(2012/12/18 create by hezhr)
--------------------------------------------------*/
public static var Ctrl : Controller = new Controller();		// 控制器



//--------------------------------------------------
private static var instance : PayLogic;
function Awake()
{
	instance = this;
	registerEvents();
}
//--------------------------------------------------
public static function getInstance() : PayLogic
{
	return instance;
}
//--------------------------------------------------
// 注册事件
private function registerEvents() : void
{
	// 网络消息事件
	NetHelper.RegistHandler(new notify_single_payment_return(), handle_notify_single_payment_return);
	NetHelper.RegistHandler(new notify_single_payment_return_reward(), handle_notify_single_payment_return_reward);
	NetHelper.RegistHandler(new notify_total_payment_return(), handle_notify_total_payment_return);
	NetHelper.RegistHandler(new notify_total_payment_return_reward(), handle_notify_total_payment_return_reward);
}
//--------------------------------------------------
// 请求单笔充值返回
public static function request_single_payment_return() : void
{
	var packet : req_single_payment_return = new req_single_payment_return();
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 处理通知单笔充值返回
private function handle_notify_single_payment_return(evt:GameEvent, pack:notify_single_payment_return) : void
{
	Ctrl.Set("single_pay_return_items", pack.items);
	UI.getUI().OpenUIRoot("SinglePayUI");
	UI.getUI().SetModal("SinglePayUI", true);
}
//--------------------------------------------------
// 请求领取单笔充值奖励
public static function request_single_payment_return_reward(diamond : int) : void
{
	var packet : req_single_payment_return_reward = new req_single_payment_return_reward();
	packet.return_diamond = diamond;
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 处理通知领取单笔充值奖励
private function handle_notify_single_payment_return_reward(evt:GameEvent, pack:notify_single_payment_return_reward) : void
{
	Ctrl.Excute("single_return_result", pack.returned);
}
//--------------------------------------------------
// 请求累积充值返回
public static function request_total_payment_return() : void
{
	var packet : req_total_payment_return = new req_total_payment_return();
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 处理通知累积充值返回
private function handle_notify_total_payment_return(evt:GameEvent, pack:notify_total_payment_return) : void
{
	Ctrl.Set("total_pay_return_items", pack.items);
	Ctrl.Set("total_consume_amount", pack.total_amount);
	UI.getUI().OpenUIRoot("AccumulatePayUI");
	UI.getUI().SetModal("AccumulatePayUI", true);
}
//--------------------------------------------------
// 请求领取累积充值奖励
public static function request_total_payment_return_reward(amount : int) : void
{
	var packet : req_total_payment_return_reward = new req_total_payment_return_reward();
	packet.consume_amount = amount;
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 处理通知领取累积充值奖励
private function handle_notify_total_payment_return_reward(evt:GameEvent, pack:notify_total_payment_return_reward) : void
{
	Ctrl.Excute("total_return_result", pack.returned);
}
//--------------------------------------------------


