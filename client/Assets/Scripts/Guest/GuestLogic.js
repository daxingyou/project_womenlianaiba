#pragma strict
#pragma downcast

private var mPreGuestTimer : Timer = null;
private var mPreTimerInterval : float = 5000;
private var mFirstLogin : boolean = true;
private var mShowGuest : boolean = true;
private var mGuestTimer : Timer = null;	// 客人出现定时器
private var mTimerInterval : float = 1000;	// 定时器时间间隔
private var mTimerCount : int = 100000;	// 定时器次数
private var mGuestList : Array = new Array();	// 客人列表
private var mPlayerHouseRow : PlayerHouseRow = null;
private var mClickObj : GameObject = null;	
private var mSrcColor : Array = new Array();
public var HightLight : Color = Color(0.4, 0.4 ,0.4, 0);
public static var Ctrl : Controller = new Controller();		// 控制器
//--------------------------------------------------
private static var instance : GuestLogic = null;
public static function getInstance() : GuestLogic
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
	NetHelper.RegistHandler(new notify_can_click_guest(), handle_notify_can_click_guest);
	// 
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_MOUSE_IN_MODEL), mouseInGuest);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_MOUSE_OUT_MODEL), mouseOutGuest);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_HOUSE_SCENE), enterHouseScene);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LEAVE_SCENE), leaveHouseScene);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_NEW_HAND_TASK), handleNotifyNewHandTask);
}
//--------------------------------------------------
function Update()
{
	clickGuest();
}
//--------------------------------------------------
private function mouseInGuest(evt : GameEvent, obj : System.Object) : void
{
	var guest : GuestModel = getGuset(obj);
	if (null == guest)
		return;
	
	var render : Renderer = CommFunc.getRenderer(obj);
	if (render && 0 != render.materials.Length)
	{
		mSrcColor.Clear();
		for (var i:int = 0; i<render.materials.Length; ++i)
		{
			mSrcColor.Add(render.materials[i].color);
			render.materials[i].color += HightLight;
		}
	}
}
//--------------------------------------------------
private function mouseOutGuest(evt : GameEvent, obj : System.Object) : void
{
	var guest : GuestModel = getGuset(obj);
	if (null == guest)
		return;
	
	var render : Renderer = CommFunc.getRenderer(obj);
	if (render && 0 != render.materials.Length)
	{
		for (var i:int = 0; i<render.materials.Length; ++i)
		{
			render.materials[i].color = mSrcColor[i];
		}
	}
}
//--------------------------------------------------
private function clickGuest()
{
	if (UI.getUI().IsMouseOverUI())
		return;
	
	if (Input.GetMouseButtonDown(0))
	{
		leftButtonDown();
	}
	if (Input.GetMouseButtonUp(0))
	{
		leftButtonUp();
	}
}
//--------------------------------------------------
private function leftButtonDown()
{
	mClickObj = PickMgr.getSingleton().getPickObject();
}
//--------------------------------------------------
private function leftButtonUp()
{
	if (mClickObj && mClickObj == PickMgr.getSingleton().getPickObject())
	{
		var guest : GuestModel = getGuset(mClickObj);
		if (null == guest)
			return;
		guest.onClicked();
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_SPRITE));
	}
}
//--------------------------------------------------
// 请求点击客人
public static function request_click_guest(appraise : int) : void
{
	var req : req_click_guest = new req_click_guest();
	req.appraise = appraise;
	NetHelper.Send(req);
}
//--------------------------------------------------
// 通知点击客人结果
private function handle_notify_can_click_guest(evt:GameEvent, pack:notify_can_click_guest):void
{
	// canClick是否可以点,0:不能,1:可以
	Ctrl.Excute("CAN_CLICK_GUEST", pack.canClick);
}
//--------------------------------------------------
// 进入房屋场景
private function enterHouseScene(evt:GameEvent, obj:System.Object) : void
{
	mPlayerHouseRow = EQGameSceneMgr.getSingleton().getPlayerHouseRow();
	if (null == mPlayerHouseRow)
		return;
	
	if (mFirstLogin)
	{
		mFirstLogin = false;
		createPreTimer();
	}
	else
	{
		if (mShowGuest)
		{
			createTimer();
		}
	}
}
//--------------------------------------------------
// 离开房屋场景
private function leaveHouseScene(evt:GameEvent, obj:System.Object) : void
{
	mPlayerHouseRow = null;
	destroyTimer();
	clearGuestList();
}
//--------------------------------------------------
// 通知新手任务
private function handleNotifyNewHandTask(evt:GameEvent, obj:System.Object) : void
{
	var taskInfo : task_info = obj as task_info;
	mShowGuest = taskInfo.task_id >= 30003 || taskInfo.task_id < 30000;
	if (mShowGuest)
	{
		createTimer();
	}
	else
	{
		destroyTimer();
	}
}
//--------------------------------------------------
private function createPreTimer() : void
{
	if (mPreGuestTimer)
		return;
	
	mPreGuestTimer = new Timer(mPreTimerInterval, mTimerCount);
	mPreGuestTimer.addEventListener(TimerEvent.TIMER, onePreTime);
	mPreGuestTimer.addEventListener(TimerEvent.TIMER_COMPLETE, overTime);
	mPreGuestTimer.Start();
}
//--------------------------------------------------
private function onePreTime(tmr : Timer, obj : System.Object) : void
{
	if (mShowGuest)
	{
		createTimer();
	}
}
//--------------------------------------------------
// 创建产生客人定时器
private function createTimer() : void
{
	if (mGuestTimer)
		return;
	
	mGuestTimer = new Timer(mTimerInterval, mTimerCount);
	mGuestTimer.addEventListener(TimerEvent.TIMER, oneTime);
	mGuestTimer.addEventListener(TimerEvent.TIMER_COMPLETE, overTime);
	mGuestTimer.Start();
}
//--------------------------------------------------
// 删除定时器
private function destroyTimer() : void
{
	if (mGuestTimer)
	{
		mGuestTimer.Stop();
		mGuestTimer = null;
	}
}
//--------------------------------------------------
// 定时器时间间隔触发
private function oneTime(tmr : Timer, obj : System.Object) : void
{
	if (null == mPlayerHouseRow)
		return;
	
	// 人数超过上限,非室内场景,家装状态,派对状态
	if (mGuestList.Count >= mPlayerHouseRow.max_guest || 
		SceneType.PLAYER_HOUSE != EQGameSceneMgr.getSingleton().gameSceneType() || 
		FitmentLogic.getInstance().inFitmenting || 
		Party.getInstance().existParty())
		return;
	
	// 生成客人
	createGuest();
}
//--------------------------------------------------
private function overTime(tmr : Timer, obj : System.Object) : void {}
//--------------------------------------------------
// 创建客人
private function createGuest() : void
{
	if (0 == mPlayerHouseRow.guests.Count)
		return;
	
	var guestId : int = CommFunc.randomOfArray(mPlayerHouseRow.guests);
	var born : BornRow = EQGameSceneMgr.getSingleton().getSceneBornRow();
	mGuestList.Add(new GuestModel(guestId, born.pos));
}
//--------------------------------------------------
// 获取客人
private function getGuset(obj : GameObject) : GuestModel
{
	for (var guest : GuestModel in mGuestList)
	{
		if (guest.isEqual(obj))
			return guest;
	}
	return null;
}

//--------------------------------------------------
// 是否为客人
public function isGuest(obj : GameObject) : boolean
{
	return null != getGuset(obj);
}
//--------------------------------------------------
// 删除单个客人
public function destroyGuest(guestObj : GameObject, direct : boolean) : void
{
	var guest : GuestModel = getGuset(guestObj);
	if (guest)
	{
		mGuestList.Remove(guest);
		guest.destroy(direct);
	}
}
//--------------------------------------------------
// 清除客人列表
public function clearGuestList() : void
{
	for (var guest : GuestModel in mGuestList)
	{
		guest.destroy(true);
	}
	mGuestList.Clear();
}
//--------------------------------------------------
// 根据类型获取客人随机动作
public function getRandomAnimationName(type : int) : String
{
	var anis : Array = new Array();
	if (1 == type)	// 满意
	{
		anis.push("dance");
		anis.push("laugh");
		anis.push("fkiss");
	}
	else if (2 == type)	// 不满意
	{
		anis.push("angry");
	}
	else	// 其他
	{
		anis.push("stand");
	}
	return CommFunc.randomOfArray(anis);
}
//--------------------------------------------------
// 随机获取客人所需食物
public function getRandomNeedFood() : BartenderFoodBaseInfoRow
{
	var playerLevel : int = EQGameSceneMgr.getSingleton().getHouseData().level;
	var needArr : Array = BartenderSys.getInstance().getBartenderSysTableMgr().getFoodBaseInfoRowByLevel(playerLevel);
	if (0 == needArr.Count)
		return null;
	
	return CommFunc.randomOfArray(needArr);
}
//--------------------------------------------------


