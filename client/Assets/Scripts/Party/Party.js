#pragma strict
#pragma downcast

/*--------------------------------------------------
派对(2012/0/17 create by hezhr)
--------------------------------------------------*/
private var mHideUIArray : Array;							// 被隐藏的界面
private var mIsPartyOpen : boolean = false;					// 派对是否打开
private var mExpTimer : Timer = null;						// 派对获取经验定时器
private var mExpRemainTime : int = 0;						// 派对获取经验剩余时间(秒)
private var mExpTip : String = "";							// 派对获取经验提示
private var mExp : int = 0;									// 派对获取经验
private var mExpAddPercent : int = 0;						// 派对经验加成百分比
private var mHideExpTimer : Timer = null;					// 隐藏派对经验定时器
private var mExistParty : boolean = false;					// 当前房屋是否有派对
private var mPartyFoodID : int = 0;
public static var Ctrl : Controller = new Controller();		// 控制器
private var mFoodList : ArrayList;							// 派对食物id
private var mFoodModelList : Array = new Array();			// 派对食物模型
private var mCreateFood : boolean = false;				// 是否已经创建了派对食物模型
private var mSrcColor : Array = new Array();
public var HightLight : Color = Color(0.4, 0.4 ,0.4, 0);
private var mClickObj : GameObject = null;	
var OpenPartyNotHideRoot : String[];						// 打开派对界面不隐藏得root
//--------------------------------------------------
private static var instance : Party;
function Awake()
{
	instance = this;
	registerEvents();
}
//--------------------------------------------------
function Start()
{
	Ctrl.Set("max_page", 1);	// 初始最大页数,否则可能由于网络延迟的原因,获取到null
}
//--------------------------------------------------
function Update()
{
	if(mExistParty)
	{
		if(!mCreateFood && null != mFoodList && mFoodList.Count > 0)
		{
			createPartyFood();
		}
	}
	else
	{
		destroyPartyFood();
	}
	clickFood();
}

public static function getInstance() : Party
{
	return instance;
}
//--------------------------------------------------
// 注册事件
public function registerEvents() : void
{
	// 网络消息事件
	NetHelper.RegistHandler(new notify_my_party_info(), handle_notify_my_party_info);
	NetHelper.RegistHandler(new notify_create_party_result(), handle_notify_create_party_result);
	NetHelper.RegistHandler(new notify_party_stop(), handle_notify_party_stop);
	NetHelper.RegistHandler(new notify_party_list(), handle_notify_party_list);
	NetHelper.RegistHandler(new notify_private_party_need_item(), handle_notify_private_party_need_item);
	NetHelper.RegistHandler(new notify_invite_list(), handle_notify_invite_list);
	NetHelper.RegistHandler(new notify_invitation(), handle_notify_invitation);
	NetHelper.RegistHandler(new notify_start_party_exp_timer(), handle_notify_start_party_exp_timer);
	NetHelper.RegistHandler(new notify_stop_party_exp_timer(), handle_notify_stop_party_exp_timer);
	NetHelper.RegistHandler(new notify_party_exp_buffs(), handle_notify_party_exp_buffs);
	NetHelper.RegistHandler(new notify_party_items(), handle_notify_party_items);
	NetHelper.RegistHandler(new notify_update_party_items(), handle_notify_update_party_items);
	NetHelper.RegistHandler(new notify_add_party_score(), handle_notify_add_party_score);
	NetHelper.RegistHandler(new notify_party_score(), handle_notify_party_score);
	NetHelper.RegistHandler(new notify_party_gain(), handle_notify_party_gain);
	NetHelper.RegistHandler(new notify_party_food_ids(), handle_notify_party_food_ids);
	// alter by zlj 返回请客人数上限消息
    NetHelper.RegistHandler(new notify_drink_count(), handle_notify_party_drink_count); 
    
	// 其他事件
	Ctrl.Register("OPEN_PARTY_UI", openPartyUI);
	Ctrl.Register("CLOSE_PARTY_UI", closePartyUI);
	Ctrl.Register("SHOW_HIDE_UI", showHideUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOUSE_CREATED), handle_enter_house_or_common_scene);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_COMMON_SCENE), handle_enter_house_or_common_scene);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_UI_MODAL_STATE), handle_ui_modal_state);
	
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_MOUSE_IN_MODEL), mouseInFood);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_MOUSE_OUT_MODEL), mouseOutFood);
}

//--------------------------------------------------
private function mouseInFood(evt : GameEvent, obj : System.Object) : void
{
	var model : PartyFoodModel = getFoodModel(obj);
	if (null == model)
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
private function mouseOutFood(evt : GameEvent, obj : System.Object) : void
{
	var model : PartyFoodModel = getFoodModel(obj);
	if (null == model)
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
//---------------------------------------------------
private function getFoodModel(obj : System.Object) : PartyFoodModel
{
	for(var food : PartyFoodModel in mFoodModelList)
	{
		if(food.isEqual(obj))
			return food;
	}
	return null;
}
//---------------------------------------------------
// 点击派对食物
private function clickFood()
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
		var model : PartyFoodModel = getFoodModel(mClickObj);
		if (null == model)
			return;	
		if (UI.getUI().isUIRootOpen("ModalRoot"))	// 如果模态对话框打开
			return;
		model.onClicked();
	}
	mClickObj = null;
}

//--------------------------------------------------
// 请求获取自己派对信息
public static function request_get_my_party_info(house_id : UInt64) : void
{
	var packet : req_get_my_party_info = new req_get_my_party_info();
	packet.house_id = house_id;
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 通知获取自己派对消息
private function handle_notify_my_party_info(evt : GameEvent, pack : notify_my_party_info) : void
{
	// house_id = 0,没有派对
	Ctrl.Excute("GET_MY_PARTY_RESULT", pack.data);
	Ctrl.Set("create_need_money", pack.need_money);
}
//--------------------------------------------------
// 请求创建派对
public static function request_create_party(house_id:UInt64, house_name:String, player_name:String, type:int, title:String, describe:String, items:Array, foodItems : Array) : void
{
	var packet:req_create_party = new req_create_party();
	packet.house_id = house_id;
	packet.house_name = house_name;
	packet.player_name = player_name;
	packet.type = type;
	packet.title = title;
	packet.description = describe;
	for (var item_id : int in items)
	{
		packet.cost_items.Add(item_id);
	}
	for (var food_id : int in foodItems)
	{
		packet.food_ids.Add(food_id);
	}
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 通知创建派对结果
private function handle_notify_create_party_result(evt:GameEvent, pack:notify_create_party_result) : void
{
	// 0.成功,>0.派对最大上限
	Ctrl.Excute("CREATE_PARTY_RESULT", pack.result);
}
//--------------------------------------------------
// 通知停止派对
private function handle_notify_party_stop(evt:GameEvent, pack:notify_party_stop) : void
{
	// 关闭派对功能面板
	UI.getUI().CloseUIRoot("PartyFunctionUI");
	mExistParty = false;
	destroyPartyFood();
}
//--------------------------------------------------
// 请求获取派对列表(page,从1开始)
public static function request_get_party_list(type : int, page : int) : void
{
	var packet:req_get_party_list = new req_get_party_list();
	packet.type = type;
	packet.page = page;
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 通知派对列表消息
private function handle_notify_party_list(evt:GameEvent, pack:notify_party_list) : void
{
	// step1:添加推荐派对
	var hot_arr : Array = new Array();
	for (var hot : party_data in pack.hot_partys)
	{
		hot_arr.Add(hot);
	}
	// step2:添加派对
	var party_arr : Array = new Array();
	for (var party : party_data in pack.partys)
	{
		party_arr.Add(party);
	}
	// step3:执行事件
	Ctrl.Set("max_page", pack.max_page);
	Ctrl.Excute("REFRESH_HOT_LIST", hot_arr);
	Ctrl.Excute("REFRESH_PARTY_LIST", party_arr);
}
//--------------------------------------------------
// 通知创建私人派对需要物品
private function handle_notify_private_party_need_item(evt:GameEvent, pack:notify_private_party_need_item) : void
{
	Ctrl.Excute("PRIVATE_PARTY_NEED_ITEM", null);
}
//--------------------------------------------------
// 请求邀请列表
public static function request_invite_list() : void
{
	var packet : req_invite_list = new req_invite_list();
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 通知派对食物id列表
private function handle_notify_party_food_ids(evt:GameEvent, pack:notify_party_food_ids) : void
{
	mFoodList = pack.food_ids;
}

// 通知邀请列表
private function handle_notify_invite_list(evt:GameEvent, pack:notify_invite_list) : void
{
	// step1:关闭派对界面
	Ctrl.Excute("CLOSE_PARTY_UI", true);
	Ctrl.Set("invite_list", pack.friend_list);
	// step2:打开派对邀请界面
	UI.getUI().OpenUIRoot("PartyInviteUI");
	UI.getUI().SetModal("PartyInviteUI", true);
}
//--------------------------------------------------
// 请求邀请好友参加派对
public static function request_invite_someone(friends : Array, type : int) : void
{
	var packet : req_invite_someone = new req_invite_someone();
	for (var account : String in friends)
	{
		packet.target_list.Add(account);
	}
	packet.type = type;
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 通知被邀请玩家参加派对
private function handle_notify_invitation(evt:GameEvent, pack:notify_invitation) : void
{
	if (invitation_type.ivt_private_party != pack.type)
		return;
	
	if (UI.isUIRootOpen("PartyAcceptUI"))
		return;
	
	Ctrl.Set("invitation", pack);
	UI.getUI().OpenUIRoot("PartyAcceptUI");
	UI.getUI().SetModal("PartyAcceptUI", true);
}
//--------------------------------------------------
// 请求同意邀请参加派对
public static function request_agree_invitation(invitor : String, type : int) : void
{
	// step1:保存所要访问的好友帐号
	Global.SetCurVisitHouseAccount(invitor);
	// step2:发送请求
	var packet : req_agree_invitation = new req_agree_invitation();
	packet.invitor = invitor;
	packet.type = type;
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 通知开始派对经验值定时器
private function handle_notify_start_party_exp_timer(evt:GameEvent, pack:notify_start_party_exp_timer) : void
{
	if (pack.seconds < pack.hide_seconds)
		throw Exception("Party -> handle_notify_start_party_exp_timer() -> seconds["+pack.seconds+"] larger than hide seconds["+pack.hide_seconds+"].");
	
	destroyTimer();
	destroyHideExpTimer();
	createTimer(pack.seconds);
	createHideExpTimer(pack.hide_seconds);
	setPartyExpEnabled(true);
	mExp = pack.exp;
	setPartyBufferTip(mExp, mExpAddPercent);
}
//--------------------------------------------------
// 通知停止派对经验值定时器
private function handle_notify_stop_party_exp_timer(evt:GameEvent, pack:notify_stop_party_exp_timer) : void
{
	destroyTimer();
	destroyHideExpTimer();
}
//--------------------------------------------------
// 通知派对经验加成图标
private function handle_notify_party_exp_buffs(evt:GameEvent, pack:notify_party_exp_buffs) : void
{
	Ctrl.Set("party_exp_buffs", pack);
	Ctrl.Excute("NOTIFY_PARTY_EXP_BUFFS", pack);
	UI.getUI().OpenUIRoot("PartyFunctionUI");
	//
	mExpAddPercent = pack.total_add_percent;
	setPartyBufferTip(mExp, mExpAddPercent);
	mExistParty = true;
}
//--------------------------------------------------
// 通知获得派对道具
private function handle_notify_party_items(evt:GameEvent, pack:notify_party_items) : void
{
	Ctrl.Set("prop_award_items", pack.items);
	Ctrl.Excute("NOTIY_PARTY_ITEMS", pack.items);
	UI.getUI().OpenUIRoot("PartyFunctionUI");
	//
	UI.getUI().OpenUIRoot("PartyPropAwardUI");
	UI.getUI().SetModal("PartyPropAwardUI", true);
	mExistParty = true;
}
//--------------------------------------------------
// 通知更新派对道具
private function handle_notify_update_party_items(evt:GameEvent, pack:notify_update_party_items) : void
{
	Ctrl.Set("update_party_items", pack.items);
	Ctrl.Excute("NOTIFY_UPDATE_PARTY_ITEMS", pack.items);
	UI.getUI().OpenUIRoot("PartyFunctionUI");
	mExistParty = true;
}
//--------------------------------------------------
// 请求投票加积分
public static function request_add_party_score() : void
{
	var packet : req_add_party_score = new req_add_party_score();
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 通知
private function handle_notify_add_party_score(evt:GameEvent, pack:notify_add_party_score) : void
{
	// step1.聊天框显示
	var msg : SysMsgRow = Global.GetSysMsgHandler().getSysMsgRow(511);
	var content : String = msg.msg_content.Replace("{0}", pack.guest_name);
	content = content.Replace("{1}", pack.master_name);
	content = content.Replace("{2}", pack.add_score.ToString());
	ChatLogic.getInstance().setTextItemOnListbox(content, Color(1.0f, 1.0f, 0));
	// step2.投票客人飘数字(投票人是主玩家)
	if (ScenePlayerMgr.isMainPlayer(pack.guest_account))
	{
		UIAnimation.createNumberAnimation(Rect(0.83, 0.6, 0, 0), Rect(0.83, 0.45, 0, 0), "good", pack.add_score);
	}
	// step3.主人头上飘数字(主人是主玩家)
	if (ScenePlayerMgr.isMainPlayer(pack.master_account))
	{
		UIAnimation.createNumberAnimation(Rect(0.5, 0.4, 0, 0), Rect(0.5, 0.1, 0, 0), "good", pack.add_score);
	}
	// step4.设置功能面板上的积分 alter by zlj
	var gui : iGUICode_PartyFunctionUI = iGUICode_PartyFunctionUI.getInstance();
	if (gui)
	{
		gui.setPartyScore(pack.total_score);
	}
}
//--------------------------------------------------
// 通知派对积分
private function handle_notify_party_score(evt:GameEvent, pack:notify_party_score) : void
{
	Ctrl.Set("party_score", pack);
	Ctrl.Excute("NOTIFY_PARTY_SCORE", pack);
	UI.getUI().OpenUIRoot("PartyFunctionUI");
	mExistParty = true;
}
//--------------------------------------------------
// 通知派对收获
private function handle_notify_party_gain(evt:GameEvent, pack:notify_party_gain) : void
{
	Ctrl.Set("party_gain", pack);
	//
	UI.getUI().OpenUIRoot("PartyOverAwardUI");
	UI.getUI().SetModal("PartyOverAwardUI", true);
}
//--------------------------------------------------
// 请求准备谈消息(登录游戏时调用)
public static function request_client_ready_for_pop_msg() : void
{
	var packet : client_ready_for_pop_msg = new client_ready_for_pop_msg();
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 通知进入房屋或者室外
private function handle_enter_house_or_common_scene(evt:GameEvent, obj:System.Object) : void
{
	Ctrl.Excute("CLOSE_PARTY_UI", true);
	UI.getUI().CloseUIRoot("PartyFunctionUI");
	mExistParty = false;
	destroyPartyFood();
}
//--------------------------------------------------
// 通知当前模态
private function handle_ui_modal_state(evt:GameEvent, modal:boolean) : void
{
	if ("PartyCreateUI" == UI.getUI().GetModalName())
	{
		//UI.getUI().SetPassive("PartyPropSelectUI", false); // alter by zlj
	}
}
//--------------------------------------------------
// 打开派对界面
private function openPartyUI(hide_other : boolean) : void
{
	if (mIsPartyOpen)
		return;
	
	mIsPartyOpen = true;
	if (hide_other)	// 隐藏其他root
	{
		mHideUIArray = UI.getUI().EnableUIRootIgnore(OpenPartyNotHideRoot, false);
	}
	UI.getUI().OpenUIRoot("PartyUI");
	UI.getUI().SetModal("PartyUI", true);
	request_get_my_party_info(DataCenter.getSelfHouseID());
}
//--------------------------------------------------
// 关闭派对界面
private function closePartyUI(show_other : boolean) : void
{
	if (false == mIsPartyOpen)
		return;
	
	UI.getUI().SetModal("PartyUI", false);
	UI.getUI().CloseUIRoot("PartyUI");
	Ctrl.Excute("SHOW_HIDE_UI", show_other);
	Global.SysTooltip.Hide(Ctrl.Get("tooltip_element"));
	mIsPartyOpen = false;
}
//--------------------------------------------------
// 还原被隐藏的界面
private function showHideUI(show : boolean) : void
{
	if (show)
	{
		UI.getUI().EnableUIRoot(mHideUIArray, true);
		mHideUIArray.Clear();
	}
}
//--------------------------------------------------
// 创建定时器
private function createTimer(remain_time : int) : void
{
	mExpRemainTime = --remain_time;
	mExpTimer = new Timer(1000, remain_time);
	mExpTimer.addEventListener(TimerEvent.TIMER, oneTime);
	mExpTimer.addEventListener(TimerEvent.TIMER_COMPLETE, overTime);
	mExpTimer.Start();
}
//--------------------------------------------------
// 销毁定时器
private function destroyTimer() : void
{
	if (mExpTimer)
	{
		mExpTimer.Stop();
		mExpTimer = null;
	}
}
//--------------------------------------------------
// 每秒触发
private function oneTime(_timer : Timer, obj : System.Object) : void
{
	--mExpRemainTime;
	// 分
	var minutes : int = mExpRemainTime / 60;
	var minutes_text : String = minutes.ToString();
	if (minutes < 10)
	{
		minutes_text = "0" + minutes_text;
	}
	// 秒
	var seconds : int = mExpRemainTime % 60;
	var seconds_text : String = seconds.ToString();
	if (seconds < 10)
	{
		seconds_text = "0" + seconds_text;
	}
	// 显示
	iGUICode_MainUI.getInstance().PartyExpBuffTime.label.text = minutes_text + ":" + seconds_text;
}
//--------------------------------------------------
// 定时结束触发
private function overTime(_timer : Timer, obj : System.Object) : void
{
	setPartyExpEnabled(false);
}
//--------------------------------------------------
private function setPartyExpEnabled(enable : boolean) : void
{
	var gui : iGUICode_MainUI = iGUICode_MainUI.getInstance();
	gui.PartyExpBuffIcon.setEnabled(enable);
	gui.PartyExpBuffTime.setEnabled(enable);
}
//--------------------------------------------------
private function createHideExpTimer(hide_time : int) : void
{
	mHideExpTimer = new Timer(1000, --hide_time);
	mHideExpTimer.addEventListener(TimerEvent.TIMER_COMPLETE, overHideExpTime);
	mHideExpTimer.Start();
}
//--------------------------------------------------
private function destroyHideExpTimer() : void
{
	if (mHideExpTimer)
	{
		mHideExpTimer.Stop();
		mHideExpTimer = null;
	}
}
//--------------------------------------------------
private function overHideExpTime(_timer : Timer, obj : System.Object) : void
{
	destroyTimer();
}
//--------------------------------------------------
private function setPartyBufferTip(exp : int, exp_add_percent : int) : void
{
	var gui : iGUICode_MainUI = iGUICode_MainUI.getInstance();
	if ("" == mExpTip)
	{
		mExpTip = gui.PartyExpBuffIcon.label.tooltip;
	}
	var exp_add : int = Mathf.FloorToInt(exp * exp_add_percent / 100);
	var tip : String = mExpTip.Replace("{0}", exp.ToString());
	tip = tip.Replace("{1}", exp_add.ToString());
	gui.PartyExpBuffIcon.label.tooltip = tip;
}
//--------------------------------------------------
public function existParty() : boolean
{
	return mExistParty;
}
//--------------------------------------------------
// 创建派对食物
public function createPartyFood() : void
{
	destroyPartyFood();
	var data : house_info = EQGameSceneMgr.getSingleton().getHouseData();
	if(null == data)
		return;
	var houseRow : PlayerHouseRow = ResManager.LgtMgr.getPlayerHouseRow(data.template_id);
	if(null == houseRow)
		return;
	var pos : Vector3 = houseRow.waiter_pos;
	
	for(var id : int in mFoodList)
	{
		var arr : Array = HouseSceneGrid.getAroundGridsInWalkArea(pos);
		if(arr.length == 0)
			return;
		var grid : HouseSceneGrid = CommFunc.randomOfArray(arr);
		var bornPos : Vector3 = grid.GetPosition(Space.World);
		mFoodModelList.Add(new PartyFoodModel(id, bornPos, 0));
		pos = bornPos;
	}
	mCreateFood = true;
}
//--------------------------------------------------
// 销毁派对食物
public function destroyPartyFood() : void
{
	for(var food : PartyFoodModel in mFoodModelList)
	{
		food.destroy();
	}
	mFoodModelList.Clear();
	mCreateFood = false;
}

public function requestEatFood(id : int) : void
{
	var req : req_party_food_eat = new req_party_food_eat();
	req.food_id = id;
	NetHelper.Send(req);
}

//alter by zlj 通知请喝酒的次数
private function handle_notify_party_drink_count(evt : GameEvent, pack : notify_drink_count)
{
    iGUICode_BuyTheDrinksUI.getInstance().setDrinkInfo(pack.cost, pack.scene_player_count, pack.shout);
}