#pragma strict
#pragma downcast
import iGUI;



private var mFoodTimerList : Array = new Array();
private var mTotalSellPrice : float = 0;
private var mOrginalTotalSellPriceText : String = "";
private var mFirstLogin : boolean = true;
private var mDiamond : int = 0;	// 离线获得的水晶
//--------------------------------------------------
private static var instance : FoodConsumeLogic = null;
public static function getInstance() : FoodConsumeLogic
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
	NetHelper.RegistHandler(new notify_reset_temp_diamond(), handle_notify_reset_temp_diamond);
	NetHelper.RegistHandler(new notify_food_settlement_diamond(), handle_notify_food_settlement_diamond);
	//
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.REFRESH_FOOD_ALL_INFOS_SUCC), handleRefreshFoodAllInfos);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_HOUSE_SCENE), enterHouseScene);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LOGON_AWARD_ENABLE), handleNotifyLogonAwardEnable);
}
//--------------------------------------------------
function OnDestroy()
{
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.REFRESH_FOOD_ALL_INFOS_SUCC), handleRefreshFoodAllInfos);
	// 
	clearFoodTimer();
}
//--------------------------------------------------
// 处理通知重置临时结算水晶
private function handle_notify_reset_temp_diamond(evt:GameEvent, pack:notify_reset_temp_diamond):void
{
	updateTotalSellPrice(0);
	refreshFoodList();
}
//--------------------------------------------------
// 处理通知食物结算水晶
private function handle_notify_food_settlement_diamond(evt:GameEvent, pack:notify_food_settlement_diamond):void
{
	mDiamond = pack.diamond;
}
//--------------------------------------------------
// 创建食物消耗定时器
private function createFoodTimer(foodId : int, foodName : String, sellPrice : float, sellTime : int, sellSeconds : int) : void
{
	if (existFoodTimer(foodId))
		return;
	
	// 创建定时器并保存到列表
	mFoodTimerList.Add(new FoodConsumeTimer(foodId, foodName, sellPrice, sellTime, sellSeconds, iGUICode_MainUI.getInstance().SAPCurSellPrice));
}
//--------------------------------------------------
// 清除食物消耗定时器
private function clearFoodTimer() : void
{
	FoodConsumeTimer.ShowSellCount = 0;	// 重新设置显示消耗标识
	for (var foodTimer : FoodConsumeTimer in mFoodTimerList)
	{
		foodTimer.destroy();
	}
	mFoodTimerList.Clear();
}
//--------------------------------------------------
// 是否存在食物消耗定时器
private function existFoodTimer(foodId : int) : boolean
{
	for (var foodTimer : FoodConsumeTimer in mFoodTimerList)
	{
		if (foodTimer.isEqual(foodId))
			return true;
	}
	return false;
}
//--------------------------------------------------
// 进入房屋场景
private function enterHouseScene(evt:GameEvent, obj:System.Object) : void
{
	if (!mFirstLogin)
		return;
	
	mFirstLogin = false;
	refreshFoodList();
}
//--------------------------------------------------
// 刷新食物列表
private function handleRefreshFoodAllInfos(evt : GameEvent, obj : Object) : void
{
	refreshFoodList();
}
//--------------------------------------------------
// 处理登陆奖励界面显示/隐藏
private function handleNotifyLogonAwardEnable(evt : GameEvent, obj : Object) : void
{
	var enabled : boolean = obj;
	if (true == enabled || 0 == mDiamond)
		return;
	
	openFoodSettlementDiamondUI(mDiamond);
}
//--------------------------------------------------
// 刷新食物列表
private function refreshFoodList() : void
{
	if (null == EQGameSceneMgr.getSingleton().getHouse())
		return;
	// 
	var playerLevel : int = EQGameSceneMgr.getSingleton().getHouseData().level;
	var arrList : ArrayList = BartenderSys.getInstance().getInStockFoodList();
	for (var row : BartenderFoodBaseInfoRow in arrList)
	{
		// 玩家等级或房屋等级不满足条件
		var res : int = EQGameSceneMgr.getSingleton().compareHouseLevel(row.house_level);
		if (0 == row.cur_stock_value || playerLevel < row.player_level || -1 == res)
			continue;
		
		var productRow : BartenderFoodProductInfoRow = BartenderSys.getInstance().getBartenderSysTableMgr().getProductInfoRow(row.upgrade_id);
		createFoodTimer(row.food_id, productRow.name, productRow.price_per_copy, productRow.consume_speed, row.consume_seconds);
	}
}
//--------------------------------------------------
// 更新临时结算区
public function updateTotalSellPrice(sellPrice : float) : void
{
	if (0 == sellPrice)	// 清空
	{
		mTotalSellPrice = 0;
	}
	else	// 累加
	{
		mTotalSellPrice += sellPrice;
	}
	// 
	var gui : iGUICode_MainUI = iGUICode_MainUI.getInstance();
	if (null == gui)
		return;
	
	gui.SettleAccountPanel.setEnabled(0 != sellPrice && !Party.getInstance().existParty());
	gui.SAPTotalSellPrice.setEnabled(0 != sellPrice);
	if ("" == mOrginalTotalSellPriceText)
	{
		mOrginalTotalSellPriceText = gui.SAPTotalSellPrice.label.text;
	}
	gui.SAPTotalSellPrice.label.text = mOrginalTotalSellPriceText.Replace("{0}", CommFunc.toDecimal(mTotalSellPrice, 2).ToString());
}
//--------------------------------------------------
// 打开食物结算水晶界面
public static function openFoodSettlementDiamondUI(diamond : int) : void
{
	UI.getUI().OpenUIRoot("FoodSettlementDiamondUI");
	UI.getUI().SetModal("FoodSettlementDiamondUI", true);
	iGUICode_FoodSettlementDiamondUI.getInstance().setDiamondLabel(diamond);
}
//--------------------------------------------------






// 食物消耗信息
class FoodConsumeInfo
{
	var id : int = 0;				// 标识
	var name : String = "";			// 名字
	var sellPrice : float = 0;		// 收入
	var sellTime : float = 0;		// 销售时间(秒)
	var count : int = 0;			// 数量
}





// 食物定时器
class FoodConsumeTimer
{
	public static var ShowSellCount : int = 0;	// 显示消耗标识
	private var mSellTimer : Timer = null;
	private var mShowTimer : Timer = null;
	private var mFoodId : int = 0;				// 食物id
	private var mFoodName : String = "";		// 食物名字
	private var mSellPrice : float = 0.0f;		// 卖出价格
	private var mSellTime : int = 0;			// 消耗速度(秒)
	private var mCheckTime : boolean = false;
	private var mLabel : iGUILabel = null;
	//--------------------------------------------------
	public function FoodConsumeTimer(foodId : int, foodName : String, sellPrice : float, sellTime : int, sellSeconds : int, label : iGUILabel)
	{
		mFoodId = foodId;
		mFoodName = foodName;
		mSellPrice = sellPrice;
		mSellTime = sellTime;
		// 
		mLabel = label;
		setLabelEnabled();
		// 定时器
		var interval : int = sellTime;
		if (0 != sellSeconds)
		{
			interval = sellSeconds;
			mCheckTime = true;
		}
		mSellTimer = new Timer(interval*1000, 999999);
		mSellTimer.addEventListener(TimerEvent.TIMER, sellOneTime);
		mSellTimer.addEventListener(TimerEvent.TIMER_COMPLETE, overTime);
		mSellTimer.Start();
	}
	//--------------------------------------------------
	private function sellOneTime(tmr : Timer, obj : System.Object) : void 
	{
		// 没有库存,则不显示
		if (BartenderSys.getInstance().getUnlockedFoodStockValue(mFoodId) <= 0)
			return;
		// 
		++ShowSellCount;
		setLabelEnabled();
		mLabel.label.text = mFoodName + " +" + mSellPrice.ToString();
		// 定时器
		mShowTimer = new Timer(1000, 1);
		mShowTimer.addEventListener(TimerEvent.TIMER, showOneTime);
		mShowTimer.addEventListener(TimerEvent.TIMER_COMPLETE, overTime);
		mShowTimer.Start();
		// 更新临时结算区
		FoodConsumeLogic.getInstance().updateTotalSellPrice(mSellPrice);
		if (mCheckTime)
		{
			mCheckTime = false;
			mSellTimer.Stop();
			mSellTimer = new Timer(mSellTime*1000, 999999);
			mSellTimer.addEventListener(TimerEvent.TIMER, sellOneTime);
			mSellTimer.addEventListener(TimerEvent.TIMER_COMPLETE, overTime);
			mSellTimer.Start();
		}
	}
	//--------------------------------------------------
	private function showOneTime(tmr : Timer, obj : System.Object) : void
	{
		--ShowSellCount;
		setLabelEnabled();
	}
	//--------------------------------------------------
	private function overTime(tmr : Timer, obj : System.Object) : void {}
	//--------------------------------------------------
	private function setLabelEnabled() : void
	{
		mLabel.setEnabled(0 != ShowSellCount);
	}
	//--------------------------------------------------
	public function destroy() : void
	{
		if (mSellTimer)
		{
			mSellTimer.Stop();
			mSellTimer = null;
		}
		if (mShowTimer)
		{
			mShowTimer.Stop();
			mShowTimer = null;
			--ShowSellCount;
			setLabelEnabled();
		}
	}
	//--------------------------------------------------
	public function isEqual(id : int) : boolean
	{
		return id == mFoodId;
	}
	//--------------------------------------------------
}


