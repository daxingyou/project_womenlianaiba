#pragma strict

/*--------------------------------------------------
处理登陆后的逻辑,主要是事件分布,如新手,公告(2012/3/13 create by hezhr)
--------------------------------------------------*/


public static var playerGuideFlags:ArrayList = new ArrayList();


public static var FirstLogin : boolean = false;	// 创建角色后第一次登陆
//--------------------------------------------------
function Start()
{
	_registEvents();
}
//--------------------------------------------------
// 事件注册
private function _registEvents()
{
	// 网络事件注册
	NetHelper.RegistHandler(new notify_player_guide(), handle_notify_player_guide);
	// 普遍事件注册
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.LOGIN_OK), HandleLoginOk);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_BEGIN_CHANGE_DAYNIGHT), HandleBeginChangeDayNight);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_IN_CHANGE_DAYNIGHT), HandleInChangeDayNight);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_END_CHANGE_DAYNIGHT), HandleEndChangeDayNight);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LEAVE_SCENE), HandleNotifyHouseScene);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_ROOT), handleClickCloseChannelListRoot);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_VoiceChannelUI), handleClickCloseVoiceChannel);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_MINI_VoiceChannelUI), handleClickMiniVoiceChannel);
}
//--------------------------------------------------
// 处理登陆成功事件
public function HandleLoginOk(evt:GameEvent, obj:System.Object)
{
	NoticeLogic.getInstance().initTable();
	GiftLogic.getInstance().init();
	PropShopLogic.getInstance().init();
	request_player_guide();
	reqFirstPaymentStatus();
	BartenderSys.getInstance().reqProducts();
	MainPlayer.request_sync_walk_type(walk_type.wt_walk);
	// 显示更新公告
	if (FirstLogin) {
		// 玩家创建人物后,第一次登陆需要出现的公告	
		NoticeLogic.getInstance().openOnceAfterCreatePlayer();
	} else {
		// 非第一次登陆后需要出现图片
		NoticeLogic.getInstance().openAfterNotFirstLogin();
	}
}
//--------------------------------------------------
// 请求新手引导
public static function request_player_guide()
{
	Debug.Log("============req_player_guide==========");
	var req:req_player_guide = new req_player_guide();
	NetHelper.Send(req);
}
//--------------------------------------------------
// 处理请求新手引导消息
private function handle_notify_player_guide(evt:GameEvent, pack:notify_player_guide)
{
	playerGuideFlags = pack.flags;
	if(playerGuideFlags.Count == 0)
	{
		Debug.Log("---------新手标志列表为空-------------");
		return;
	}
	
	var f:boolean;
	if(playerGuideFlags[0] == 0)//为0表示没跑过新手流程
		f = true;
	else
		f = false;
	if(playerGuideFlags[15] == 0){
		//NewPlayGuideModule.complete_newguide_tasks_f = false;
	}
	else{
		NewPlayGuideModule.complete_newguide_tasks_f = true;
	}
	if(playerGuideFlags[16] == 0 && !Task.task_target1_complete_f){//在农场主任务中是否已经摆放了花盆
		Task.task_target1_complete_f = false;
	}
	else if(playerGuideFlags[16] == 1){
		Task.task_target1_complete_f = true;
	}
//	if(PlatformMgr.IsPlatYY())
//		YYChannelListLogic.getInstance().initChannelList();
//	else
		RunNewPlayGuideModule(f);
}
//
private static var first = true;

function handleClickCloseChannelListRoot(evt : GameEvent, obj : Object){
	handleYYLoginLogic();
}

function handleClickCloseVoiceChannel(evt : GameEvent, obj : Object){
	handleYYLoginLogic();
}

function handleClickMiniVoiceChannel(evt : GameEvent, obj : Object){
	handleYYLoginLogic();
}

function handleYYLoginLogic(){
	if(first){
		if(PlatformMgr.IsPlatYY()){
			var f:boolean;
			if(playerGuideFlags[0] == 0)//为0表示没跑过新手流程
				f = true;
			else
				f = false;
	
			RunNewPlayGuideModule(f);
		}
		first = false;
	}

}
//--------------------------------------------------
// 执行新手引导第一阶段
public function RunNewPlayGuideModule(flag:boolean)
{
	//新手标志应由服务端发送，客户端实现期间先使用本地变量，联调时再换
	//进入新手模块
	//Global.GetNewPlayGuideMgr().Run_GuideFirst(flag);
}
//--------------------------------------------------
// 处理开始切换昼夜事件
public function HandleBeginChangeDayNight(evt:GameEvent, obj:boolean)
{
	if (false == obj)	// 当前是黑夜,要切换到白天,关闭所有灯光
	{
		var ph : PlayerHouse = EQGameSceneMgr.getSingleton().getHouse();
		if (ph)
		{
			if (FitmentLogic.getInstance().inFitmenting)	// 家装
			{
				ph.turnAllLightsForFitment(true);
			}
			else
			{
				ph.turnAllLights(true, false);
			}
		}
		FitmentLogic.getInstance().turnFurniture(true);
	}
}
//--------------------------------------------------
// 处理正在切换昼夜事件
public function HandleInChangeDayNight(evt:GameEvent, obj:float)
{
	var daytime : boolean = AmbientMgr.getSingleton().isDayNight();
	if (EQSceneManager.getSingleton().HouseSceneObj)
	{
		EQSceneManager.getSingleton().HouseSceneObj.smoothPassLights(daytime, obj);
		EQSceneManager.getSingleton().HouseSceneObj.smoothDirectLights(daytime, obj);
		EQSceneManager.getSingleton().HouseSceneObj.smoothSpotLights(daytime, obj);
	}
}
//--------------------------------------------------
// 处理结束切换昼夜事件
public function HandleEndChangeDayNight(evt:GameEvent, obj:boolean)
{
	var ph : PlayerHouse = EQGameSceneMgr.getSingleton().getHouse();
	if (ph)
	{
		if (FitmentLogic.getInstance().inFitmenting)	// 家装
		{
			ph.turnAllLightsForFitment(obj);
		}
		else
		{
			var by_status : boolean = false;
			if (iGUICode_StorageBoxUI.ExitFlag)
			{
				by_status = true;
				iGUICode_StorageBoxUI.ExitFlag = false;
			}
			ph.turnAllLights(obj, by_status);
		}
	}
	FitmentLogic.getInstance().turnFurniture(obj);
	if (EQSceneManager.getSingleton().LoveHomeSceneObj && EQSceneManager.getSingleton().LoveHomeSceneObj._house)
	{
		EQSceneManager.getSingleton().LoveHomeSceneObj._house.turnPassLights(obj);
		EQSceneManager.getSingleton().LoveHomeSceneObj._house.turnDirectLights(obj);
		EQSceneManager.getSingleton().LoveHomeSceneObj._house.turnSpotLights(obj);
	}
}
//--------------------------------------------------
// 处理切换场景事件
public function HandleNotifyHouseScene(evt:GameEvent, obj:System.Object)
{
	// 在别人家,打开背包界面,被踢回自己家时,要把背包界面关掉
	if (GiftLogic.getInstance().isStorageUIOpen())
	{
		//if (DataCenter.isInSelfHouse())		// 放在内层判断
		//{
			iGUICode_StorageBoxUI.getInstance().exitStorage();
		//}
	}
}
//--------------------------------------------------
static function reqFirstPaymentStatus(){
	var req : req_first_payment_return_status = new req_first_payment_return_status();
	NetHelper.Send(req);
}