/*
//item upgrade center
//creat by fullzhu 2012.12.28
//last edit at 2012.12.28 by fullzhu
*/
#pragma strict
#pragma downcast

class UpgradePropInfo {
	public var propId : int = 0;
	public var propGoodsID : int = 0;
	public var propNum : int = 0;
	public var propNeedNum : int = 0;
}

class ItemDelayInfo {
	public var ins : Item = null;
	public var prop : UpgradePropInfo = new UpgradePropInfo();
}

class ItemUpgradeInfo {
	public var oldIns : Item = null;
	public var newIns : ItemRow = null;
	public var diamond : int = 0;
	public var proValue : int = 0;
	public var propList : ArrayList = new ArrayList();		//struct UpgradePropInfo
}

public var mTimePropGoods : int = 822;//822				
public var mTimePropNum : int = 1;
public var mMaxUpgradeLv : int = 10;
private var mDelayData : ItemDelayInfo = new ItemDelayInfo();
private var mUpgradeData : ItemUpgradeInfo = new ItemUpgradeInfo();
private var mMatch : MatchCollection;
private var mTimer : Timer = null;				//event Timer
private var mInterval:float = 6000f;			//show time interval
private var mRemainTime : int = 0;				//remain time(second)
private var mMultiList : ArrayList = new ArrayList();		//multi list				//struct Item
private var mUpgradeList : ArrayList = new ArrayList();		//multi upgrade 			//struct Item
private var mMultiIdx : int = 0;							//multi index
private var mCurUpgradeIt : Item = null;
private var mBMultiStatus : boolean = false;
private var mBMultContinue : boolean = false;
private var mPage : PagerMgr;

private static var instance : ItemUpgradeLogic;
function Awake(){
	instance=this;
	
	RegistEventMsg();
}
static function GetInstance(){
	return instance;
}

function Start () {
	Init();
}

function Init() {
}

function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEM_UPGRADE_SUCCESS), HandleNotifyItemUpgradeSuccess);
	
	//Global.GetSysMsgHandler().RegistMsgCallback(515,CallbackSureUpgrade,CallbackCancel, null);
}

//callback
private function HandleNotifyItemUpgradeSuccess(evt:GameEvent, obj:notify_item_upgrade) {
	var data : notify_item_upgrade = obj as notify_item_upgrade;
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEM_UPGRADE_FREE_UI));
	
	if(data.result == 0) {
		if(mBMultiStatus) StopMultiUpgrade();
		
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEM_UPGRADE_UI), false);
		return ;
	}
	
	Global.GetSysMsgHandler().ShowSysMsg(10046);
	
	var pg : PackGrid = SelfItemLogic.getInstance().Package.getItemPack(data.upgrade_item_instanceid);
	if(pg == null) return ;
	
	if(mBMultiStatus == false) {
		if(pg._item._itemInfo.level == mMaxUpgradeLv) return ;
		OpenUpgrade(pg._item, false);
	} else {
		if(mBMultContinue) {
			OpenUpgrade(mUpgradeList[++mMultiIdx], true);
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEM_UPGRADE_TIMECOUNT_UI));
		}
		
		if(mCurUpgradeIt == null) return ;
		mMultiList.Remove(mCurUpgradeIt);
		if(pg._item._itemInfo.level < mMaxUpgradeLv) {
			mMultiList.Add(pg._item);
		}
		
		mPage.ResetData(mMultiList);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEM_UPGRADE_LIST_REFRESH_UI));
	}
}

//logic function for external interface
function OpenItemDelay(ins : Item) : void {
	UI.getUI().OpenUIRoot("ItemUpgradeUI");
	
	var rowItem : ItemRow = ResManager.LgtMgr.getItemRow(ins._itemInfo.id);
	if(rowItem.effect_time_id == 0) return ;
	var row : ShopCenterRow = ResManager.LgtMgr.getShopCenterRow(mTimePropGoods);
	if(row == null) return ;
	
	mDelayData.ins = ins;
	mDelayData.prop.propId = row.item_id;
	mDelayData.prop.propGoodsID = mTimePropGoods;
	mDelayData.prop.propNum = SelfItemLogic.getInstance().getItemNum(row.item_id);
	mDelayData.prop.propNeedNum = mTimePropNum;
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEM_TIME_REFRESH), mDelayData);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEM_TIME_DELAY_UI), true);
	
	mBMultiStatus = false;
}

function OpenUpgrade(ins : Item, bMulti : boolean) : void {
	UI.getUI().OpenUIRoot("ItemUpgradeUI");
	
	if(ins._itemInfo.level == mMaxUpgradeLv) {
		Global.GetSysMsgHandler().ShowSysMsg(503);
		return ;
	}
	var upgradeRow : ItemUpgradeRow = GetUpgradeRow(ins._itemInfo.id);
	if(!upgradeRow) {
		Global.GetSysMsgHandler().ShowSysMsg(502);
		return ;
	}
	var row : ItemRow = ResManager.LgtMgr.getItemRow(upgradeRow.productId);
	if(!row) return ;
	
	mUpgradeData.oldIns = ins;
	mUpgradeData.newIns = row;
	mUpgradeData.diamond = upgradeRow.diamond;
	mUpgradeData.proValue = upgradeRow.proVal;
	mUpgradeData.propList = GetProps(upgradeRow.props);
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEM_UPGRADE_REFRESH), mUpgradeData);
	
	if(!bMulti) {
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEM_UPGRADE_UI), true);
	}
	
	mBMultiStatus = bMulti;
}

function OpenMultiUpgrade() : void {
	UI.getUI().OpenUIRoot("ItemUpgradeUI");
	
	var list : ArrayList = StorageLogic.getInstance().GetMulitSelectedList();
	if(list == null || list.Count == 0) return ;
	
	mMultiList.Clear();
	for(var id : UInt64 in list) {
		var it : PackGrid =  SelfItemLogic.getInstance().Package.getItemPack(id);
		if(it == null || !IsCanUpgrade(it._item._itemInfo.id)) continue;
		
		mMultiList.Add(it._item);
	}
	if(mMultiList == null || mMultiList.Count == 0) return ;
	
	/*
	if(mMultiList.Count == 1) {
		OpenUpgrade(mMultiList[0] as Item, false);
		return ;
	} else {
		OpenUpgrade(mMultiList[0] as Item, true);
	}
	*/
	
	OpenUpgrade(mMultiList[0] as Item, true);
	
	mPage = new PagerMgr(mMultiList,12);
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEM_UPGRADE_LIST_REFRESH_UI));
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEM_UPGRADE_MULTI_UI), true);
	
	mBMultiStatus = true;
}

function CheckDelay() : void {
	if(mDelayData == null) return ;
	
	if(mDelayData.prop.propNum<mDelayData.prop.propNeedNum) {
		Global.GetSysMsgHandler().ShowSysMsg(501);
	} else {
		ItemUpgradeNet.GetInstance().ReqItemDelay(mDelayData.ins._instanceID);
		
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEM_TIME_DELAY_UI), false);
	}
}

function CheckUpgrade() : boolean {
	if(mUpgradeData == null) return false;
	
	if(mUpgradeData.diamond > SelfItemLogic.getInstance()._loverDiamond) {
		if(mBMultiStatus) StopMultiUpgrade();
		
		Global.GetSysMsgHandler().ShowSysMsg(310);
		
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEM_UPGRADE_FREE_UI));
		return false;
	}
	
	/*
	var bSuccess : boolean = true;
	for(var prop in mUpgradeData.propList) {
		var info : UpgradePropInfo = prop as UpgradePropInfo;
		if(info.propNum < info.propNeedNum) {
			bSuccess = false;
			break;
		}
	}
	if(!bSuccess) {
		if(mBMultiStatus) StopMultiUpgrade();
		
		Global.GetSysMsgHandler().ShowSysMsg(504);
		return false;
	}
	*/
	
	var plrLevel : int = DataCenter.getMainPlayerCurLv();
	var itemLevel : int = mUpgradeData.newIns.use_level;
	if(itemLevel > plrLevel) {
		if(mBMultiStatus) StopMultiUpgrade();
		
		Global.GetSysMsgHandler().ShowSysMsg(515);
		
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEM_UPGRADE_FREE_UI));
		return false;
	}
	
	CallbackSureUpgrade();
	
	return true;
}

function CheckMultiUpgrade() : void {
	if(!mBMultiStatus) return ;
	if(mMultiList.Count == 0) {
		Global.GetSysMsgHandler().ShowSysMsg(516);
		return ;
	}
	
	mUpgradeList.Clear();
	mUpgradeList = mMultiList.Clone();
	
	mRemainTime = mMultiList.Count;
	mMultiIdx = 0;
	OpenUpgrade(mMultiList[mMultiIdx] as Item, true);
	StartTimer();
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEM_UPGRADE_LIST_REFRESH_UI));
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEM_UPGRADE_TIMECOUNT_UI));
}

function StopMultiUpgrade() : void {
	CallbackTimerStop();
}

function IsCanUpgrade(item_id : int) : boolean {
	return ResManager.LgtMgr.getItemUpgradeRow(item_id) != null;
}

//logic function for interal
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

//callback
private function CallbackTimerTrigger() {
	mRemainTime--;
	
	mCurUpgradeIt = mUpgradeList[mMultiIdx];
	if(CheckUpgrade()) {
		if(mMultiIdx+1 <= mUpgradeList.Count-1) {
			mBMultContinue = true;
			//OpenUpgrade(mUpgradeList[++mMultiIdx], true);
			//EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEM_UPGRADE_TIMECOUNT_UI));
		} else {
			mBMultContinue = false;
		}
	}
}

private function CallbackTimerStop() {
	if(mTimer != null) {
		mTimer.Reset();
		mTimer = null;
	}
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEM_UPGRADE_STOP_UI));
}

function CallbackSureUpgrade() {
	if(mUpgradeData.oldIns == null) {
		Global.GetSysMsgHandler().ShowSysMsg(513);
		
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEM_UPGRADE_FREE_UI));
	} else {
		ItemUpgradeNet.GetInstance().ReqItemUpgrade(mUpgradeData.oldIns._instanceID);
	}
}

function CallbackCancel() {
}

//data operate
private function GetUpgradeRow(id : int) : ItemUpgradeRow {
	return ResManager.LgtMgr.getItemUpgradeRow(id);
}

private function GetProps(props : String) : ArrayList {
	if(props == null || props == "") return null;
	
	var list : ArrayList = new ArrayList();
	var reg : Regex = new Regex("(\\{(\\d+),(\\d+),(\\d+)})");
	mMatch = reg.Matches(props);
	
	for(var i : int = 0; i < mMatch.Count; i++) {
		var prop : UpgradePropInfo = new UpgradePropInfo();
		var str : String = mMatch[i].Value.Replace("\r\n", "").Replace("{", "").Replace("}", "").Trim();
		var separator : String = ",";
		var wordArray : String[] = str.Split(separator[0]);
		//var goodsId : int = ResManager.LgtMgr.ParseInt(wordArray[0]);
		//var row : ShopCenterRow = ResManager.LgtMgr.getShopCenterRow(goodsId);
		//if(row == null) break;
		
		prop.propGoodsID = ResManager.LgtMgr.ParseInt(wordArray[0]);
		prop.propId = ResManager.LgtMgr.ParseInt(wordArray[1]);
		prop.propNeedNum = ResManager.LgtMgr.ParseInt(wordArray[2]);
		prop.propNum = SelfItemLogic.getInstance().getItemNum(ResManager.LgtMgr.ParseInt(wordArray[1]));
		
		list.Add(prop);
	}
	return list;
}

public function GetNextPage() : ArrayList {
	if(mPage == null) return null;
	 
	return mPage.NextPage();
}
	
public function GetPrePage() : ArrayList {
	if(mPage == null) return null;
	
	return mPage.PrevPage();
}
	
public function GetCurrData() : ArrayList {
	if(mPage == null) return null;
	
	return mPage.CurrPage();
}
	
public function GetPageData(page : int) : ArrayList {
	if(mPage == null) return null;
	
	return mPage.GetPage(page);
}
	
public function GetTotalPageNum() : int {
	if(mPage == null) return 0;
	
	return mPage.GetTotalPage();
}
	
public function GetCurrPageNum() : int {
	if(mPage == null) return 0;
	
	return mPage.GetPageIndex();
}

public function GetUpgradeFursTotalCost() : int {
	var totalCost : int = 0;
	var house : PlayerHouse = EQGameSceneMgr.getSingleton().getHouse();
	var upgradeFurs : Array = house.getUpgradeFurnitures();
	for (var fur : house_furniture in upgradeFurs) {
		var ir : ItemRow = ResManager.LgtMgr.getItemRow(fur.item_tempid);
		var iur : ItemUpgradeRow = ResManager.LgtMgr.getItemUpgradeRow(ir.upgrade_id);
		if (null == iur)
			continue;
		
		totalCost += iur.diamond;
	}
	return totalCost;
}

public function oneKeyUpgrageFurs() : void {
	var uiOpened : boolean = null == UI.getUI().GetUIRoot("UpgradeFurnitureUI") ? false : true;
	var house : PlayerHouse = EQGameSceneMgr.getSingleton().getHouse();
	// 房屋内没有摆放家具
	if (0 == house.getFurnitures().Count) {
		if (uiOpened) {
			UI.getUI().SetModal("UpgradeFurnitureUI", false);
			UI.getUI().CloseUIRoot("UpgradeFurnitureUI");
		}
		Global.GetSysMsgHandler().ShowSysMsg(559);
		return;
	}
	var upgradeFurs : Array = house.getUpgradeFurnitures();
	// 没有可升级的家具
	if (0 == upgradeFurs.Count) {
		if (uiOpened) {
			UI.getUI().SetModal("UpgradeFurnitureUI", false);
			UI.getUI().CloseUIRoot("UpgradeFurnitureUI");
		}
		Global.GetSysMsgHandler().ShowSysMsg(560);
		return;
	}
	if (false == uiOpened) {
		UI.getUI().OpenUIRoot("UpgradeFurnitureUI");
		UI.getUI().SetModal("UpgradeFurnitureUI", true);
	}
	iGUICode_UpgradeFurnitureUI.getInstance().init(upgradeFurs, GetUpgradeFursTotalCost());
}