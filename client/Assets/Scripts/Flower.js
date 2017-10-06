// 花藤
#pragma strict

class FlowerRockInfo {
	var freeCount : int = 0;
	var loveCount : int = 0;
	var limitTime : int = 0;
}

private var visitHouseId : UInt64; // 访问者的房屋Id
private var ownerHouseId : UInt64;// 访问的房屋Id
private var flowerTable : FlowerTable = new FlowerTable();
static private var currLevel : int = 0;
private var flowerFactory : FlowerFactory = new FlowerFactory();
public var flowerParticle : GameObject;
private var flowerParticleInst : GameObject;
private var enableUIList : Array;	// 用来存放需要关闭的其他root
private var hasOpen : boolean = false;
private var mRockGoodsId : int = 10012;

private var mTimer : Timer = null;				//event Timer
private var mInterval:float = 1000f;			//show time interval
private var mRemainTime : int = 0;				//remain time(second)

private var mRockInfo : FlowerRockInfo = new FlowerRockInfo();

static public var mFreeLimitCount : int = 5;
static public var mLoveLimitCount : int = 50;
static private var mBWarnning : boolean = false;

function Start () {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.REQUEST_GET_FLOWER), GetFlower);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.REQUEST_CLEAR_STATUS), ClearStatus);
	NetHelper.RegistHandler(new notify_flower_data(), handle_notify_flower_data);
	NetHelper.RegistHandler(new notify_can_water_flower(), handle_notify_can_water_flower);
	
	NetHelper.RegistHandler(new notify_flower_shaked(), handle_notify_flower_rock_count);
	NetHelper.RegistHandler(new notify_flower_love_coin_shaked(), handle_notify_love_rock_count);
	NetHelper.RegistHandler(new notify_flower_shake_prop_required(), handle_notify_flower_rock_prop);
	NetHelper.RegistHandler(new notify_flower_shake(), handle_notify_flower_rock_result);
	NetHelper.RegistHandler(new notify_flower_shake_overflow(), handle_notify_flower_overflow);
	
	Global.GetSysMsgHandler().RegistMsgCallback(10036,CallbackSure,CallbackCancel, null);
	Global.GetSysMsgHandler().RegistMsgCallback(10037,CallbackSureUseProp,CallbackPropCancel, null);
	Global.GetSysMsgHandler().RegistMsgCallback(565,CallbackSureRock,CallbackCancel, null);
}

function RegistFlowerHandler(pack:notify_flower_data)
{
	if(visitHouseId == ownerHouseId)
	{	
		EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.REQUEST_WATER), RequestWater);
		EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.REQUEST_PICK_FRUIT), PickFruit);
		EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.REQUEST_FLOWER_LOG), Log);
		EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.REQUEST_FLOWER_CLOSE), Close);
		
		EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REQUEST_FLOWER_FREE_COUNT), RequestFreeCount);
		EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REQUEST_FLOWER_ROCK), RequestRock);
		EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REQUEST_FLOWER_LOVE_ROCK), RequestLoveRock);
	}
	else
	{
		EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.REQUEST_WATER), RequestWater);
		EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.REQUEST_FLOWER_CLOSE), Close);
	}
}

function ClearStatus(evt:GameEvent, obj:System.Object)
{
	hasOpen = false;
}

// 玩家进入花藤场景后，首先先请求服务端获取花藤数据
// 如果没有花藤数据， 
//1.显示花藤选择页面(自己的花藤)
//2.提示好友没有开通花藤(访问别人家的花藤)
function GetFlower(evt:GameEvent, obj:System.Object)
{
	var house : PlayerHouse = EQGameSceneMgr.getSingleton().getHouse();
	visitHouseId = DataCenter.getHouseID(Global.OpenID);
	ownerHouseId = DataCenter.getCurHouseID();
	//if(house.hasTwoOwner() || Application.platform == RuntimePlatform.WindowsEditor)//如果是单身玩家,提示玩家无法使用爱情树
	//{
	if(!hasOpen)
	{
		//Debug.Log("GlobalId:"+Global.OpenID);
		//Debug.Log("visitHouseId:"+visitHouseId);
		//Debug.Log("OwnerHouseId:" + ownerHouseId);
		hasOpen = true;
		var packet:req_get_flower = new req_get_flower();
		packet.house_id= ownerHouseId;
		NetHelper.Send(packet);
	}
	//}
	//else
	//{
		//if(ownerHouseId == visitHouseId)
			//Global.GetSysMsgHandler().ShowSysMsg(315);
		//else
			//Global.GetSysMsgHandler().ShowSysMsg(316);
	//}
}

// 服务端返回花藤数据
// 如果花藤Id==0的时候，代表玩家还没有创建花藤
// 1.如果是在自己家里，则弹出花藤选择界面
// 2.如果是在别人家里，则弹出提示框，提示主人还没有创建花藤
function handle_notify_flower_data(evt:GameEvent, pack:notify_flower_data)
{
	if(pack.id == 0)
	{
		if((ownerHouseId == visitHouseId))
		{
			CreateFlower(1500000);
		}
		else
		{
			//TODO:通知界面提示该花藤主人还没有创建
			Global.GetSysMsgHandler().ShowSysMsg(240);
			hasOpen = false;
		}
		//EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.REQUEST_CREATE_FLOWER), "4001");
		//ShowChoiceUI();
	}
	else
	{
		EnterFlowerScene(pack);
		ShowFlowerModel(pack);
	}
}

//// 如果花藤Id==0的时候，代表玩家还没有创建花藤
//// 1.如果是在自己家里，则弹出花藤选择界面
//// 2.如果是在别人家里，则弹出提示框，提示主人还没有创建花藤
//function ShowChoiceUI()
//{
//	if(ownerHouseId == visitHouseId)
//	{
//		//TODO:通知界面显示花藤选择框
//		EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.REQUEST_CREATE_FLOWER), CreateFlower);
//		UI.getUI().OpenUIRoot("FlowerChoiceUI");
//	}
//	else
//	{
//		//TODO:通知界面提示该花藤主人还没有创建
//	}
//}

// 根据不同的等级显示不同的花藤模型
// 1.初始化进入后显示的花藤模型
// 2.当玩家等级上升后显示新的花藤模型，并且将就的模型删除
function ShowFlowerModel(pack:notify_flower_data)
{
	if((pack.operate == 1) || (pack.operate == 2))//当玩家初始进入花藤界面后
	{
		currLevel = pack.level;
		RegistFlowerHandler(pack);
		CreateFlowerModel(pack.id, currLevel);
		AmbientMgr.getSingleton().setMode(AmbientMode.AM_CHANGE);
		flowerParticleInst = GameObject.Instantiate(flowerParticle);
		CreateFlowerParticle(pack.id, currLevel);
	}
	else
	{
		if(pack.level > currLevel) //如果等级发生变化,此时需要重新更换花藤数据:1.删除旧的花藤 2.创建新的花藤
		{
			currLevel = pack.level;
			CreateFlowerModel(pack.id, currLevel);
			CreateFlowerParticle(pack.id, currLevel);
		}
	}
}

// 创建花藤的模型
function CreateFlowerModel(flowerId : int, level:int)
{
	var fowerRow : FlowerRow = FlowerTable.GetInst().Get(flowerId, level);// 获取花藤数据
	flowerFactory.Create(fowerRow.model); //创建花藤
}

function CreateFlowerParticle(flowerId : int, level:int)
{
	var flowerRow:FlowerRow = FlowerTable.GetInst().Get(flowerId, level);
	var split:String[] = flowerRow.particle.Split([" "], StringSplitOptions.RemoveEmptyEntries);
	
	var particles:GameObject[] = GameObject.FindGameObjectsWithTag("FlowerParticle"); 
	for (var p:GameObject in particles)
	{
		CommFunc.setGameObjActive(p, false);
		
		for(var s:String in split)
		{
			if(p.name == s)
			{
				CommFunc.setGameObjActive(p, true);
				break;		
			}
		}
	}
}

// 1.如果花藤的主人（男主人跟女主人）进入花藤主页，注册所有事件
// 2.如果进入别人家的花藤，只注册浇水的事件
function EnterFlowerScene(pack:notify_flower_data)
{
	if((pack.operate == 1) || (pack.operate == 2))//1.创建， 2.登录
	{
		if((ownerHouseId == visitHouseId))
		{
			//通知界面显示自己的花藤界面
			//显示花藤数据信息
			enableUIList = UI.getUI().OpenUIRootAndHideOther("FlowerOwnerUI");
		}
		else
		{
			//通知界面显示好友的花藤界面
			//显示花藤数据信息
			enableUIList = UI.getUI().OpenUIRootAndHideOther("FlowerGuestUI");
		}
	}
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.REQUEST_SHOW_FLOWER_DATA), pack);
}

//给花藤浇水
function RequestWater(evt:GameEvent, obj:System.Object)
{
	var packet:req_can_water_flower = new req_can_water_flower();
	packet.my_house_id = visitHouseId;
	packet.house_id = ownerHouseId;
	NetHelper.Send(packet);
}

function RequestRock(evt:GameEvent, obj:System.Object) {
	RequestRockSend(obj, false);
}

function RequestLoveRock(evt:GameEvent, obj:System.Object) {
	if(mBWarnning == false) {
		Global.GetSysMsgHandler().ShowSysMsg(565);
		
		mBWarnning = true;
		return ;
	}
	RequestRockLoveSend();
}

function RequestRockSend(count : int, bProp : boolean) {
	var packet:req_flower_shake = new req_flower_shake();
	packet.house_id = ownerHouseId;
	packet.shake_count = count;
	packet.enable_props = bProp == true ? 1 : 0;
	NetHelper.Send(packet);
}

function RequestRockLoveSend() {
	var packet:req_flower_love_coin_shake = new req_flower_love_coin_shake();
	packet.house_id = ownerHouseId;
	NetHelper.Send(packet);
}

function RequestFreeCount(evt:GameEvent, obj:System.Object) {
	var packet:req_flower_shaked = new req_flower_shaked();
	packet.house_id = ownerHouseId;
	NetHelper.Send(packet);
}

function handle_notify_can_water_flower(evt:GameEvent, pack:notify_can_water_flower)
{
	if(pack.result != 0)
	{
		var packet:req_water_flower = new req_water_flower();
		packet.my_house_id = visitHouseId;
		packet.house_id = ownerHouseId;
		packet.name = DataCenter.getCurPlayerName();
		NetHelper.Send(packet);
		
		if(visitHouseId == ownerHouseId)
		{
			if(FlowerOwnerUI.getInstance() != null && FlowerOwnerUI.getInstance().image3 != null)
			{
				var myAnimationowOwner = FlowerOwnerUI.getInstance().image3.getTextureAnimation("animation1");
				myAnimationowOwner.play();
			}
		}
		else
		{
			if(FlowerGuestUI.getInstance() != null && FlowerGuestUI.getInstance().image3 != null)
			{
				var myAnimationGuest = FlowerGuestUI.getInstance().image3.getTextureAnimation("animation1");
				myAnimationGuest.play();
			}
		}
		if(DataCenter.isInSelfHouse())
			if(PaoPaoControl.GetPpCtrol(iGUICode_MainUI.getInstance().waterTipPP))
				PaoPaoControl.GetPpCtrol(iGUICode_MainUI.getInstance().waterTipPP).StopPpTimer();
	}
}

function handle_notify_flower_rock_count(evt:GameEvent, pack:notify_flower_shaked) {
	mRockInfo.freeCount = pack.free_shake;
	mRockInfo.limitTime = pack.free_shake_time;
	mFreeLimitCount = pack.total_shake_count;
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENABLE_ROCK_AWARD_UI),true);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REFRESH_ROCK_AWARD_UI),mRockInfo);
	
	mRemainTime = pack.free_shake_time;
	if(mRemainTime > 0) {
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_FLOWER_FREE_REMAIN_TIME),mRemainTime);
		StartTimer();
	}
}

function handle_notify_love_rock_count(evt:GameEvent, pack:notify_flower_love_coin_shaked) {
	mRockInfo.loveCount = pack.love_coin_shake;
	mLoveLimitCount = pack.total_shake_count;
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENABLE_ROCK_AWARD_UI),true);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REFRESH_ROCK_AWARD_UI),mRockInfo);
}

function handle_notify_flower_rock_prop(evt:GameEvent, pack:notify_flower_shake_prop_required) {
	var freeCount : int = FlowerOwnerUI.getInstance().GetRockFreeCount();
	var mode : int = FlowerOwnerUI.getInstance().GetRockMode();
	
	var count : int = mode - freeCount;
	var params : ArrayList = new ArrayList();
	params.Add(count);
	Global.GetSysMsgHandler().ShowSysMsg(10037,params);
}

function handle_notify_flower_rock_result(evt:GameEvent, pack:notify_flower_shake) {
	//EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_FLOWER_ROCK_RESULT_UI), pack);
}

function handle_notify_flower_overflow(evt:GameEvent, pack:notify_flower_shake_overflow) {
	var params : ArrayList = new ArrayList();
	params.Add(pack.available);
	Global.GetSysMsgHandler().ShowSysMsg(10038,params);
}

private function CallbackSure(callback : iGUIElement) {
	PropBuyCommonLogic.getInstance().openPropBuyCommonUI(mRockGoodsId);
	
	FlowerOwnerUI.getInstance().SetPassive(false);
}

private function CallbackSureUseProp(callback : iGUIElement) {
	var mode : int = FlowerOwnerUI.getInstance().GetRockMode();
	RequestRockSend(mode,true);
	
	FlowerOwnerUI.getInstance().SetPassive(false);
}

private function CallbackSureRock(callback : iGUIElement) {
	RequestRockLoveSend();
}

private function CallbackCancel(callback : iGUIElement) {
	FlowerOwnerUI.getInstance().SetPassive(false);
}

private function CallbackPropCancel(callback : iGUIElement) {
	FlowerOwnerUI.getInstance().SetPassive(false);
}

private function StartTimer() {
	if(mTimer != null) {
		mTimer.Reset();
		mTimer = null;
	}
	mTimer = new Timer(mInterval,mRemainTime);
	mTimer.addEventListener(TimerEvent.TIMER,CallbackTimerTrigger);
	mTimer.addEventListener(TimerEvent.TIMER_COMPLETE,CallbackTimerStop);
	mTimer.Start();
}

private function CallbackTimerTrigger() {
	mRemainTime--;
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_FLOWER_FREE_REMAIN_TIME),mRemainTime);
}

private function CallbackTimerStop() {
	if(mTimer != null) {
		mTimer.Reset();
		mTimer = null;
	}
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_FLOWER_FREE_INVALID));
}

static function GetCurLevel() : int {
	return currLevel;
}

static function GetRockAwardData(count : int) : FlowerRockAward {
	return ResManager.LgtMgr.FlowerRockAwardTable[count];
}

static function GetFreeRockAwardData(count : int) : FlowerFreeRockAward {
	return ResManager.LgtMgr.FlowerFreeRockAwardTable[count];
}

//创建新的花藤
function CreateFlower(flowerId : int)
{
	var packet:req_create_flower = new req_create_flower();
	packet.house_id = visitHouseId;
	packet.flower_id = flowerId;
	NetHelper.Send(packet);
}

//摘取花藤的果实，摘取玩果实后进入下一个果实成熟周期
function PickFruit(evt:GameEvent, obj:System.Object)
{
	var packet:req_pick_fruit = new req_pick_fruit();
	packet.house_id = ownerHouseId;
	NetHelper.Send(packet);
}

//获取访问日志
function Log(evt:GameEvent, obj:System.Object)
{
	//TODO:提交服务端获取访问日志
	UI.getUI().OpenUIRoot("FlowerLog");
	var packet:req_flower_log = new req_flower_log();
	packet.house_id = ownerHouseId;
	NetHelper.Send(packet);
}

//关闭花藤界面,此时取消所有花藤注册过的信息
//TODO:通知界面层关闭UI界面
function Close(evt:GameEvent, obj:System.Object)
{
	//
	if(mTimer != null) {
		mTimer.Reset();
		mTimer = null;
	}
	// 恢复其他界面
	UI.getUI().EnableUIRoot(enableUIList, true);
	enableUIList.Clear();
	//
	flowerFactory.Destroy();
	Destroy(flowerParticleInst);
	AmbientMgr.getSingleton().setMode(AmbientMode.AM_NORMAL);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.REQUEST_WATER), RequestWater);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REQUEST_FLOWER_ROCK), RequestRock);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REQUEST_FLOWER_LOVE_ROCK), RequestLoveRock);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REQUEST_FLOWER_FREE_COUNT), RequestFreeCount);
	//EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.REQUEST_CREATE_FLOWER));
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.REQUEST_PICK_FRUIT), PickFruit);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.REQUEST_FLOWER_LOG), Log);
	//EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.REQUEST_FLOWER_HELP));
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.REQUEST_FLOWER_CLOSE), Close);
	hasOpen = false;
}