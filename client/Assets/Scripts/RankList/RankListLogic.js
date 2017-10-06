/*--------------------------------------------------
排行榜逻辑(2012/7/4 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast
import iGUI;



private static var mInstance : RankListLogic = null;
private static var mCtrl : Controller = new Controller();						// 控制器



//--------------------------------------------------
function Awake()
{
	mInstance = this;
}
function Start()
{
	registEvents();
}
public static function getInstance() : RankListLogic
{
	if (null == mInstance)
	{
		throw Exception("RankListLogic -> instance is null!");
	}
	return mInstance;
}
//--------------------------------------------------
// 事件注册
private function registEvents() : void
{
	// 网络消息事件
	NetHelper.RegistHandler(new notify_ranking(), handle_notify_ranking);
}
//--------------------------------------------------
// 请求排行榜
public static function request_ranking(type : int) : void
{
	// type: 1.等级,2.装饰度,豪华度,3.男性魅力值,4.女性魅力值,5.(服务端用,客户端不用),6.被关注人数
	var packet : req_ranking = new req_ranking();
	packet.type = type;
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 处理通知排行榜
private function handle_notify_ranking(evt : GameEvent, pack : notify_ranking) : void
{
	mCtrl.Excute("event_rank_result", pack);
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
// 打开排行榜界面
public function openRankListUI() : void
{
	UI.getUI().OpenUIRoot("RankListUI");
	UI.getUI().SetModal("RankListUI", true);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_OPEN_PAIHANGBANG));
}
//--------------------------------------------------
// 关闭排行榜界面
public function closeRankListUI() : void
{
	UI.getUI().SetModal("RankListUI", false);
	UI.getUI().CloseUIRoot("RankListUI");
}
//--------------------------------------------------



