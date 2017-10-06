#pragma strict
#pragma downcast

/*
//plant logic center
//creat by fullzhu 2012.7.9
//last edit at 2012.7.9 by fullzhu
*/

enum PlantSeedSort {
	PS_CRYSTAL = 1,
	PS_LOVEDIAMOND = 2,
}

class PlantLockMatInfo {
	public var mat : ItemRow = null;
	public var goodId : int = 0;
	public var num : int = 0;
	public var needNum : int = 0;
}

class PlantLockInfo {
	public var number : int = 0;
	public var level : int = 0;
	public var coin : int = 0;
	public var matList : ArrayList = new ArrayList();		//struct PlantLockMatInfo
}


public var mPacketPos : Vector3;

public var mSpeedGoodsId : int = 10010;
public var mHarvestGoodsId : int = 10011;
public var mFertilizeId : int = 2200041;

private var mPlantList : ArrayList = new ArrayList();				//struct plant
private var mHouseID : UInt64 = 0;
private var mLimitCount : int = 0;					//single
private var mMaxCount : int = 0;					//couple

private var mPlantPot : ArrayList = new ArrayList();
private var mPlantSeed : UInt64 = 0;

private var mInterval:float = 1000f;				//show time interval
private var mRemainTime : int = 0;					//remain time(second)
private var mTimer:Timer = null;					//Timer

private var mWaterTimer : Timer = null;				//event Timer
private var mFertilezeTimer : Timer = null;			//event Timer

private var mWaterList : ArrayList = new ArrayList();	//water list
private var mFerList : ArrayList = new ArrayList();		//fer list

private var mWaterIdx : int = 0;
private var mFerIdx : int = 0;

private var mWaterLimit : int = 0;		// 浇水限制

private var mHouseInfo : house_info = null;

private var mPage : PagerMgr;
private var mSeedsList : ArrayList = new ArrayList();			//seeds list---struct PlantSeedRow
private var mSort : PlantSeedSort;
private var mBBatch : boolean = false;

//lock
private var mLockInfo : PlantLockInfo = new PlantLockInfo();		//lock info

private static var instance : PlantLogic;
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
	mSort = PlantSeedSort.PS_CRYSTAL;
}

function Clear() {
}

function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOUSE_CREATED), HandleNotifyHouseOwnerInfo);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LEAVE_SCENE), HandleNotifyLeaveScene);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLANT_LIST), HandleNotifyPlantList);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLANT_REFRESH), HandleNotifyPlantRefresh);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLANT_DELETE), HandleNotifyPlantDelete);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLANT_PICK_FRUIT_RESULT), HandleNotifyPickFruitResult);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_HOUSE_COMP_LOAD_FINISHED), HandleNotifyPotLoadFinish);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_FURNI_INTERACT_FUNC_BTN_SHOW),HandleFurniInteractFuncBtnShow);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLAYR_BUFF),HandleNotifyPlantSpeed);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLANT_LIMIT_COUNT),HandleNotifyPlantLimitCount);

	
	FurnitureInteract.addObserver("event_plant", HandleNotifyPlant);
	FurnitureInteract.addObserver("event_harvest", HandleNotifyHarvest);
	FurnitureInteract.addObserver("event_water", HandleNotifyWater);
	FurnitureInteract.addObserver("event_fertilize", HandleNotifyFertilize);
	FurnitureInteract.addObserver("event_remove", HandleNotifyRemove);
	
	Global.GetSysMsgHandler().RegistMsgCallback(452,CallbackSureRemove,CallbackCancel, null);
	Global.GetSysMsgHandler().RegistMsgCallback(449,CallbackFerBuy,CallbackCancel, null);
	Global.GetSysMsgHandler().RegistMsgCallback(465,CallbackSeedBuy,CallbackCancel, null);
	Global.GetSysMsgHandler().RegistMsgCallback(10047,CallbackSure,CallbackCancel, null);
	
	Global.GetSysMsgHandler().RegistMsgCallback(544,CallbackRecharge,CallbackCancel, null);
	Global.GetSysMsgHandler().RegistMsgCallback(545,CallbackSure,CallbackCancel, null);
	Global.GetSysMsgHandler().RegistMsgCallback(552,CallbackRecharge,CallbackCancel, null);
}

//hanlde game event
function HandleNotifyHouseOwnerInfo(evt:GameEvent, obj:house_info) {
	if(!obj)
		return;
	
	mHouseID = obj.house_id;
	mHouseInfo = obj;
	
	//var house:PlayerHouseRow = ResManager.LgtMgr.PlayerHouseTable[obj.template_id] as PlayerHouseRow;
	//mLimitCount = house.max_flowerpot;
	var account : String = ScenePlayerMgr.getMainPlayerAccount();
	var houseInfo : house_info = obj as house_info;
	if(account == houseInfo.boy || account == houseInfo.girl) {
		PlantNet.GetInstance().ReqLimitCount();
	}
}

function HandleNotifyLeaveScene() {
	RemoveAll();
}

function HandleNotifyPlantList(evt:GameEvent, obj:notify_farm_data) {
	if(mHouseID != obj.house_id) {
		Debug.Log("error house_id!!!");
		return;
	}
	
	RemoveAll();
	mWaterLimit = obj.water_limit;
	if(!DataCenter.isPlayerInCommonScene()) {
		for(var data : crop_data in obj.crops) {
			var com : HouseSceneComponent = EQGameSceneMgr.getSingleton().getHouse().getComponentByInstanceID(data.inst_id);
			if(com != null) {
				Add(data,com.ModelObj);
			}
		}
	}
}

function HandleNotifyPlantRefresh(evt:GameEvent, obj:notify_crop_data) {
	if(mHouseID != obj.house_id) {
		Debug.Log("error house_id!!!");
		return;
	}
	
	if (1 == obj.op) {	// 浇水
		mWaterLimit = obj.water_limit;
	}
	
	if(IsExsit(obj.crop.inst_id)) {
		Refresh(obj.crop,obj.op);
	} else {
		var com : HouseSceneComponent = EQGameSceneMgr.getSingleton().getHouse().getComponentByInstanceID(obj.crop.inst_id);
		if(com != null) {
			Add(obj.crop,com.ModelObj);
		}
	}
}

function HandleNotifyPlantDelete(evt:GameEvent, obj:notify_delete_crop) {
	if(obj.result == 0) {
		Debug.Log("pickup failed!!!");
		return;
	}
	
	Cancel(obj.crop_id);
}

function HandleNotifyPickFruitResult(evt:GameEvent, obj:notify_pick_crop_fruit) {
	if(mHouseID != obj.house_id) {
		Debug.Log("error house_id!!!");
		return;
	}
	if(obj.result == 0) {
		Debug.Log("pickup failed!!!");
		return;
	}
	
	var pt : Plant = GetPlant(obj.crop_id);
	if(pt == null) return ;
	var data : crop_data = pt.GetInstData();
	if(data == null) return ;
	
	/*
	if(PlayerFriend.GetInstance().IsInSelfHouse()) {
		var row : ItemRow = ResManager.LgtMgr.getItemRow(data.fruit_id);
		var params : ArrayList = new ArrayList();
		params.Add(row.name);
		params.Add(data.fruit_count);
		Global.GetSysMsgHandler().ShowSysMsg(455,params);
	}
	*/
	
	Harvest(obj.crop_id);
}

function HandleNotifyPotLoadFinish(evt:GameEvent, obj:HouseSceneComponent) {
	if(obj.CompRow.type == 2) {
		var inst : Plant = GetPlant(obj.InstId);
		if(inst) {
			inst.SetPotObj(obj.ModelObj);
			inst.Active();
		}
	}
}

function HandleNotifyItemsChoose(evt:GameEvent, obj:System.Object) {
	var bc : BackpackClass = obj as BackpackClass;
	if(bc == null || bc.pg == null || mPlantPot.Count == 0) return ;
	
	if(IsExsit(mPlantPot[0])) {
		Global.GetSysMsgHandler().ShowSysMsg(453);
		return ;
	}
	
	if (ItemType.Seed == bc.pg._item._itemInfo.type) {
		mPlantSeed = bc.pg._item._instanceID;
		Global.GetSysMsgHandler().ShowSysMsg(10047);
	}
}

function HandleNotifyPlant(hsc : HouseSceneComponent) {
	if(hsc == null) return ;
	
	//mPlantPot = hsc.InstId;
	
	mPlantPot.Clear();
	if(!IsExsit(hsc.InstId)) {
		mPlantPot.Add(hsc.InstId);
	}
	var flowerpots : Array = FitmentLogic.getInstance().getFitmentFlowerpot();
	for(var pot : HouseSceneComponent in flowerpots) {
		if(pot.InstId != hsc.InstId && !IsExsit(pot.InstId)) {
			mPlantPot.Add(pot.InstId);
		}
	}
	
	/*EnablePacket(true);
	var list : ArrayList = SelfItemLogic.getInstance().getPackGridList(ItemType.Seed);
	if(list.Count == 0) {
		Global.GetSysMsgHandler().ShowSysMsg(465);
	}*/
	
	OpenSeedsList();
}

function HandleNotifyHarvest(hsc : HouseSceneComponent) {
	if(hsc == null) return ;
	
	for(var pt : Plant in mPlantList) {
		if(pt.IsCrop()) {
			Crop(pt.GetInstanceID());
		} 
	}
	
	/*
	var inst : Plant = GetPlant(hsc.InstId);
	if(inst && inst.IsCrop()) {
		Crop(hsc.InstId);
	} else {
		Global.GetSysMsgHandler().ShowSysMsg(454);
	}
	*/
}

function HandleNotifyWater(hsc : HouseSceneComponent) {
	if(hsc == null) return ;
	
	RefreshWaterList();
	StartWarterTimer();
	
	/*
	var inst : Plant = GetPlant(hsc.InstId);
	if(inst && inst.IsWaterEvtTrig()) {
		Watering(hsc.InstId);
	} else {
		Global.GetSysMsgHandler().ShowSysMsg(450);
	}
	*/
}

function HandleNotifyFertilize(hsc : HouseSceneComponent) {
	if(hsc == null) return ;
	
	
	RefreshFerList();
	StartFerTimer();
	
	/*
	var inst : Plant = GetPlant(hsc.InstId);
	if(inst && inst.IsFerEvtTrig()) {
		Fertilize(hsc.InstId);
	} else {
		Global.GetSysMsgHandler().ShowSysMsg(451);
	}
	*/
}

function HandleNotifyRemove(hsc : HouseSceneComponent) {
	if(hsc == null) return ;
	
	var inst : Plant = GetPlant(hsc.InstId);
	if(inst) {
		mPlantPot.Clear();
		mPlantPot.Add(hsc.InstId);
		Global.GetSysMsgHandler().ShowSysMsg(452);
	} else {
		Global.GetSysMsgHandler().ShowSysMsg(456);
	}
}

function HandleFurniInteractFuncBtnShow(evt:GameEvent, arr : Array) {
	if(arr.Count >= 7 && !PlayerFriend.GetInstance().IsInSelfHouse()) {
		(arr[2] as iGUIButton).setEnabled(false);
		(arr[3] as iGUIButton).setEnabled(false);
		(arr[6] as iGUIButton).setEnabled(false);
	}
}

function HandleNotifyPlantSpeed(evt:GameEvent,obj:Object) {
	var buffId : int = 2200047;	// 果实的buffid
	var buff : BuffInfo = BuffLogic.getValidBuff(buffId);
	if (null == buff)
		return;
	
	Speed(buff.data.id, buff.data.rest_time);
}

function HandleNotifyPlantLimitCount(evt:GameEvent,data:notify_house_max_flowerpot) {
	mLimitCount = data.owner_number;
	mMaxCount = data.max_number;
	
	mLockInfo = GetPlantLockData(mLimitCount+1);
	
	RefreshPlantLock();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLANT_LOCK_UI), false);
}

//callback
private function CallbackSure(callback : iGUIElement) {
	/*
	EnablePacket(false);
	
	var pg : PackGrid = SelfItemLogic.getInstance().Package.getItemPack(mPlantSeed);
	if(pg == null) return ;
	var count : int = pg._count > mPlantPot.Count ? mPlantPot.Count : pg._count;
	for(var i=0; i<count; i++) {
		Grow(mPlantPot[i],mPlantSeed);
	}
	//Grow(mPlantPot,mPlantSeed);
	*/
	var seedData : PlantSeedRow = GetSeedData(mPlantSeed);
	if(seedData == null) return ;
	
	var params : ArrayList = new ArrayList();
	if(mBBatch) {
		if(seedData.price_type == PlantSeedSort.PS_CRYSTAL) {
			if(SelfItemLogic.getInstance()._loverDiamond < seedData.price*mPlantPot.Count) {
				params.Add(Define.crystal);
				Global.GetSysMsgHandler().ShowSysMsg(544, params);
				return ;
			}
		} else if(seedData.price_type == PlantSeedSort.PS_LOVEDIAMOND) {
			if(DataCenter.GetPlayerDiamond() < seedData.price*mPlantPot.Count) {
				params.Add(Define.aibi);
				Global.GetSysMsgHandler().ShowSysMsg(544, params);
				return ;
			}
		} else {
			return ;
		}
		
		Grow(mPlantPot[0],mPlantSeed);
		/*
		for(var i=0; i<mPlantPot.Count; i++) {
			Grow(mPlantPot[i],mPlantSeed);
		}
		*/
	} else {
		if(seedData.price_type == PlantSeedSort.PS_CRYSTAL) {
			if(SelfItemLogic.getInstance()._loverDiamond < seedData.price) {
				params.Add(Define.crystal);
				Global.GetSysMsgHandler().ShowSysMsg(544,params);
				return ;
			}
		} else if(seedData.price_type == PlantSeedSort.PS_LOVEDIAMOND) {
			if(DataCenter.GetPlayerDiamond() < seedData.price) {
				params.Add(Define.aibi);
				Global.GetSysMsgHandler().ShowSysMsg(544,params);
				return ;
			}
		} else {
			return ;
		}
		
		Grow(mPlantPot[0],mPlantSeed);
	}
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLANT_MAIN_UI), false);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_SurePlant));
}

private function CallbackRecharge(callback : iGUIElement) {
	DiamondLogic.GetInstance().OpenRecharge();
}

private function CallbackSureRemove(callback : iGUIElement) {
	Uproot(mPlantPot[0]);
}

private function CallbackFerBuy(callback : iGUIElement) {
	PropBuyCommonLogic.getInstance().openPropBuyCommonUI(20001);	// 化肥
}

private function CallbackSeedBuy(callback : iGUIElement) {
	PropShopLogic.Ctrl.Excute("open_prop_shop_ui", 6);
}

private function CallbackCancel(callback : iGUIElement) {
	//DO NOTHING
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_CANCEL_PLANT));
}

private function CallbackTimerTrigger() {
	mRemainTime--;
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLANT_SPEED_REMAIN_TIME),mRemainTime);
}

private function CallbackTimerStop() {
	if(mTimer != null) {
		mTimer.Reset();
		mTimer = null;
	}
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLANT_SPEED_END));
}

private function CallbackWaterTimerTrigger() {
	if(mWaterIdx > mWaterList.Count-1) {
		iGUICode_FurnitureInteractUI.getInstance().SetWaterPassive(false);
		return ;
	}
	
	var pt : Plant = mWaterList[mWaterIdx++];
	if(pt) {
//		var power : int = DataCenter.getMainPlayerCurPhyPower();
//		if(power == 0 && mWaterTimer != null) {
//			CallbackWaterTimerStop();
//			
//			Global.GetSysMsgHandler().ShowSysMsg(324);
		if (mWaterLimit > 200) {
			CallbackWaterTimerStop();
			
			Global.GetSysMsgHandler().ShowSysMsg(241);
		} else {
			Watering(pt.GetInstanceID());
		}
	}
}

private function CallbackWaterTimerStop() {
	if(mWaterTimer != null) {
		mWaterTimer.Reset();
		mWaterTimer = null;
	}
	
	iGUICode_FurnitureInteractUI.getInstance().SetWaterPassive(false);
}

private function CallbackFerTimerTrigger() {
	if(mFerIdx > mFerList.Count-1) {
		iGUICode_FurnitureInteractUI.getInstance().SetFerPassive(false);
		
		return ;
	}
	
	var pt : Plant = mFerList[mFerIdx++];
	if(pt) {
		var count : int = SelfItemLogic.getInstance().getItemNum(mFertilizeId);
//		var power : int = DataCenter.getMainPlayerCurPhyPower();
		if(count == 0 && mFertilezeTimer != null) {			// 肥料不足
			CallbackFerTimerStop();
			
			Global.GetSysMsgHandler().ShowSysMsg(449);
//		} elseif(power == 0 && mFertilezeTimer != null) {	// 体力不足
//			CallbackFerTimerStop();
//			
//			Global.GetSysMsgHandler().ShowSysMsg(324);
		} else {
			Fertilize(pt.GetInstanceID());
		}
	}
}

private function CallbackFerTimerStop() {
	if(mFertilezeTimer != null) {
		mFertilezeTimer.Reset();
		mFertilezeTimer = null;
	}
	
	iGUICode_FurnitureInteractUI.getInstance().SetFerPassive(false);
}

//logic function for external interface
function EnablePacket(enable : boolean) {
	if(enable) {
		Backpack.getInstance().openBackpackUI(mPacketPos.x,mPacketPos.y,6, true, true, true);
		EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.BACKPACK_CLICKED), HandleNotifyItemsChoose);
	} else {
		Backpack.getInstance().closeBackpackUI();
		EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.BACKPACK_CLICKED), HandleNotifyItemsChoose);
	}
}

function Add(data : crop_data, potObj : GameObject) {
	var seedData : PlantSeedRow = GetSeedData(data.item_id);
	
	var inst : Plant = new Plant(seedData,data,potObj);
	mPlantList.Add(inst);
	
	if(!inst.IsActive() && potObj != null) {
		inst.Active();
	}
}

function Refresh(data : crop_data,type : int) {
	for(var inst : Plant in mPlantList) {
		if(inst.GetInstanceID() == data.inst_id) {
			inst.Refresh(data);
			if(type == 1) {
				inst.Watering();
			} else if(type == 2) {
				inst.Fertilize();
			}
			break;
		}
	}
	//RefreshStatus();
}

function RefreshStatus() {
	var bActive : boolean = false;
	for(var inst : Plant in mPlantList) {
		if(inst.IsWaterEvtTrig() || inst.IsFerEvtTrig()) {
			bActive = true;
			break;
		}
	}
	
	if(bActive == false) {
		SocialLogic.GetInstance().RefreshPlant(mHouseInfo.boy, bActive);
		SocialLogic.GetInstance().RefreshPlant(mHouseInfo.girl, bActive);
	}
}

function Harvest(id : UInt64) {
	for(var inst : Plant in mPlantList) {
		if(inst.GetInstanceID() == id) {
			inst.Harvest();
			break;
		}
	}
	Remove(id);
}

function Cancel(id : UInt64) {
	for(var inst : Plant in mPlantList) {
		if(inst.GetInstanceID() == id) {
			inst.Remove();
			break;
		}
	}
	Remove(id);
}

function Grow(pot : UInt64, seed : UInt64) {
	PlantNet.GetInstance().ReqCropGrow(pot,seed);
}

function Watering(id : UInt64) {
	for(var inst : Plant in mPlantList) {
		if(inst.GetInstanceID() == id) {
			var instID : UInt64 = inst.GetInstanceID();
			var evtID : int = inst.GetEventID();
			var evtType : int = inst.GetEventType();
			if(evtID != 0) {
				PlantNet.GetInstance().ReqCropEvent(mHouseID,instID,evtID,evtType);
			}
			break;
		}
	}
}

function Fertilize(id : UInt64) {
	for(var inst : Plant in mPlantList) {
		if(inst.GetInstanceID() == id) {
			var instID : UInt64 = inst.GetInstanceID();
			var evtID : int = inst.GetEventID();
			var evtType : int = inst.GetEventType();
			if(evtID != 0) {
				PlantNet.GetInstance().ReqCropEvent(mHouseID,instID,evtID,evtType);
			}
			break;
		}
	}
}

function SpeedUp() {
	var row : ShopCenterRow = ResManager.LgtMgr.getShopCenterRow(mSpeedGoodsId);
	if(row == null) return ;
	
	var arr : Array = SelfItemLogic.getInstance().Package.getItemPack(row.item_id);
	if(arr.Count > 0) {
		PropUseLogic.Ctrl.Excute("click_prop_item", arr[0]);
	} else {
		PropBuyCommonLogic.getInstance().openPropBuyCommonUI(mSpeedGoodsId);
	}
}

function AddHarvest() {
	var row : ShopCenterRow = ResManager.LgtMgr.getShopCenterRow(mHarvestGoodsId);
	if(row == null) return ;
	
	var arr : Array = SelfItemLogic.getInstance().Package.getItemPack(row.item_id);
	if(arr.Count > 0) {
		PropUseLogic.Ctrl.Excute("click_prop_item", arr[0]);
	} else {
		PropBuyCommonLogic.getInstance().openPropBuyCommonUI(mHarvestGoodsId);
	}
}

function Crop(id : UInt64) {
	PlantNet.GetInstance().ReqPickFruit(id);
}

function Uproot(id : UInt64) {
	PlantNet.GetInstance().ReqDelCrop(id);
}

function Replaced(pot : UInt64) {
	for(var inst : Plant in mPlantList) {
		if(inst.GetInstanceID() == pot) {
			inst.Replaced();
			break;
		}
	}
}

function RemoveAll() {
	for(var pt : Plant in mPlantList) {
		pt.Remove();
	}
	
	mWaterIdx = 0;
	mFerIdx = 0;
	
	mWaterTimer = null;
	mFertilezeTimer = null;
	
	mPlantList.Clear();
	mWaterList.Clear();
	mFerList.Clear();
	
	if(iGUICode_FurnitureInteractUI.getInstance()) {
		iGUICode_FurnitureInteractUI.getInstance().SetWaterPassive(false);
		iGUICode_FurnitureInteractUI.getInstance().SetFerPassive(false);
	}
}

function Remove(id : UInt64) {
	var removeIdx : int = -1;
	for(var idx : int = 0; idx <mPlantList.Count; idx++) {
		var inst : Plant = mPlantList[idx] as Plant;
		if(inst.GetInstanceID() == id) {
			removeIdx = idx;
			break;
		}
	}
	if(removeIdx != -1) {
		mPlantList.RemoveAt(removeIdx);
	}
}

function IsExsit(id : UInt64) {
	for(var idx : int = 0; idx <mPlantList.Count; idx++) {
		var inst : Plant = mPlantList[idx] as Plant;
		if(inst.GetInstanceID() == id) {
			return true;
		}
	}
	
	return false;
}

function CheckGrow(id : int) : void {
	mPlantSeed = id;
	
	var seedData : PlantSeedRow = GetSeedData(id);
	if(seedData == null) return ;
	
	var consume : int = seedData.price;
	var params : ArrayList = new ArrayList();
	params.Add(consume);
	if(seedData.price_type == pay_goods_type.pgt_game_gold) {
		params.Add(Define.crystal);
	} else if(seedData.price_type == pay_goods_type.pgt_love_coin) {
		params.Add(Define.aibi);
	} else {
		params.Add("");
	}
	Global.GetSysMsgHandler().ShowSysMsg(545,params);
	mBBatch = false;
}

function CheckBatchGrow(id : int) : void {
	mPlantSeed = id;
	
	var seedData : PlantSeedRow = GetSeedData(id);
	if(seedData == null) return ;
	
	var potCount : int = mPlantPot.Count;
	if(potCount == 0) {
		Global.GetSysMsgHandler().ShowSysMsg(542);
		return ;
	}
	
	var consume : int = potCount * seedData.price;
	var params : ArrayList = new ArrayList();
	params.Add(consume);
	if(seedData.price_type == pay_goods_type.pgt_game_gold) {
		params.Add(Define.crystal);
	} else if(seedData.price_type == pay_goods_type.pgt_love_coin) {
		params.Add(Define.aibi);
	} else {
		params.Add("");
	}
	Global.GetSysMsgHandler().ShowSysMsg(545,params);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_SEED));
	
	mBBatch = true;
}

public function ChangeSort(sort : PlantSeedSort) : ArrayList {
	mSort = sort;
	
	mSeedsList.Clear();
	
	var list : Array = new Array();
	
	var plantSeedTable : Array = ResManager.LgtMgr.getPlantSeedTable();
	if(mSort == PlantSeedSort.PS_CRYSTAL) {
		for (var i:int = 0; i<plantSeedTable.Count; ++i) {
			var row1 : PlantSeedRow = plantSeedTable[i];
			if(row1.price_type == pay_goods_type.pgt_game_gold) {
				list.Add(row1);
			}
		}
	} else if(mSort == PlantSeedSort.PS_LOVEDIAMOND) {
		for (var j:int = 0; j<plantSeedTable.Count; ++j) {
			var row2 : PlantSeedRow = plantSeedTable[j];
			if(row2.price_type == pay_goods_type.pgt_love_coin) {
				list.Add(row2);
			}
		}
	} else {
		return null;
	}
	
	list.Sort(CompareFun);
	
	for(var data in list) {
		mSeedsList.Add(data);
	}
	
	mPage = new PagerMgr(mSeedsList,6);
	
	return GetCurrData();
}

public function RefreshPlantLock() : void {
	if(iGUICode_HouseUpdateRoot.getInstance()) {
		iGUICode_HouseUpdateRoot.getInstance().RefreshLockStatus(mLimitCount);
	}
}

public function OpenUnLock() : void {
	mLockInfo = GetPlantLockData(mLimitCount+1);
	
	UI.getUI().OpenUIRoot("PlantUI");
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLANT_LOCK_REFRESH_UI));
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLANT_LOCK_UI), true);
}

public function Unlock() : void {
	/*
	var coin : int = SelfItemLogic.getInstance()._loverDiamond;
	if(coin < mLockInfo.coin) {
		Global.GetSysMsgHandler().ShowSysMsg(552);
		return ;
	}
	*/
	
	PlantNet.GetInstance().ReqUnlock();
}

public function LockTotalBuy() : void {
	if(mLockInfo == null) return ;
	
	var mat_arr : Array = new Array();
	for(var it : PlantLockMatInfo in mLockInfo.matList) {
		if(it.needNum > it.num) {
			var mat : goods_atom = new goods_atom();
			mat.goods_id = it.goodId;
			mat.count = it.needNum - it.num;
			mat_arr.Add(mat);
		}
	}
	if(mat_arr.Count > 0) {
		FurnitureUnlockLogic.getInstance().requestFillMaterial(mat_arr);
	}
}

public function RefreshLockInfo() : void {
	mLockInfo = GetPlantLockData(mLimitCount+1);
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLANT_LOCK_REFRESH_UI));
}

//logic function for interal
private function Speed(id : int,remain_time : int) {
	mRemainTime = remain_time;
	
	StartTimer();
	
	var buff : BuffRow = GetBuff(id);
	if(buff == null) {
		Debug.Log("buff is not exsit!!!");
	 	return ;
	}
	var effect : EffectAvatarRow = GetModelEffect(buff.effect_id);
	if(effect == null) {
		Debug.Log("buff effect is not exsit!!!");
		return ;
	}
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLANT_SPEED_INIT_UI),effect);
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

private function StartWarterTimer() {
	var count : int = mWaterList.Count;
	if(count == 0) {
		iGUICode_FurnitureInteractUI.getInstance().SetWaterPassive(false);
		
		Global.GetSysMsgHandler().ShowSysMsg(450);
		return ;
	}
	
	mWaterIdx = 0;
	
	if(mWaterTimer != null) {
		mWaterTimer.Reset();
		mWaterTimer = null;
	}
	if(count > 0) {
		mWaterTimer = new Timer(1.0*mInterval,count-1);
		mWaterTimer.addEventListener(TimerEvent.TIMER,CallbackWaterTimerTrigger);
		mWaterTimer.addEventListener(TimerEvent.TIMER_COMPLETE,CallbackWaterTimerStop);
		mWaterTimer.Start();
		
		CallbackWaterTimerTrigger();
	} else {
		iGUICode_FurnitureInteractUI.getInstance().SetWaterPassive(false);
	}
}

private function StartFerTimer() {
	var count : int = mFerList.Count;
	if(count == 0) {
		iGUICode_FurnitureInteractUI.getInstance().SetFerPassive(false);
		
		Global.GetSysMsgHandler().ShowSysMsg(451);
		return ;
	}
	
	mFerIdx = 0;
	
	if(mFertilezeTimer != null) {
		mFertilezeTimer.Reset();
		mFertilezeTimer = null;
	}
		
	if(count > 0) {
		mFertilezeTimer = new Timer(1.0*mInterval,count-1);
		mFertilezeTimer.addEventListener(TimerEvent.TIMER,CallbackFerTimerTrigger);
		mFertilezeTimer.addEventListener(TimerEvent.TIMER_COMPLETE,CallbackFerTimerStop);
		mFertilezeTimer.Start();
		
		CallbackFerTimerTrigger();
	} else {
		iGUICode_FurnitureInteractUI.getInstance().SetFerPassive(false);
	}
}

private function RefreshWaterList() : void {
	mWaterList.Clear();
	
	for(var pt : Plant in mPlantList) {
		if(pt.IsWaterEvtTrig()) {
			mWaterList.Add(pt);
		}
	}
}

private function RefreshFerList() : void {
	mFerList.Clear();
	
	for(var pt : Plant in mPlantList) {
		if(pt.IsFerEvtTrig()) {
			mFerList.Add(pt);
		}
	}
}

public function CompareFun(obj1 : System.Object, obj2 : System.Object) : int {
	var com1 : PlantSeedRow = obj1 as PlantSeedRow;
	var com2 : PlantSeedRow = obj2 as PlantSeedRow;
		
	if (com1.level == com2.level)
		return 0;
		
	if (com1.level < com2.level)
		return -1;
		
	return 1;
}


private function OpenSeedsList() : void {
	UI.getUI().OpenUIRoot("PlantUI");
	
	mSort = PlantSeedSort.PS_CRYSTAL;
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLANT_MAIN_REFRESH_LIST_UI));
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLANT_MAIN_UI), true);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.BACKPACK_OPENDED));
}

//data operate
function GetSort() : PlantSeedSort {
	return mSort;
}

function GetSeedData(id : int) : PlantSeedRow {
	return ResManager.LgtMgr.getPlantSeedRow(id);
}

function GetLimitCount() : int {
	return mMaxCount;
}

function GetPlant(id : UInt64) {
	for(var inst : Plant in mPlantList) {
		if(inst.GetInstanceID() == id) {
			return inst;
		}
	}
	
	return null;
}

function GetLockInfo() : PlantLockInfo {
	return mLockInfo;
}

private function GetBuff(id : int) : BuffRow {
	return ResManager.LgtMgr.BuffTable[id];
}
	
private function GetModelEffect(id : int) : EffectAvatarRow {
	return ResManager.LgtMgr.EffectAvatarTable[id];
}

private function GetPlantLockData(num : int) : PlantLockInfo {
	var data : PlantLockRow = ResManager.LgtMgr.PlantLockTable[num];
	if(data == null) return null;
	
	var info : PlantLockInfo = new PlantLockInfo();
	info.number = data.number;
	info.level = data.level;
	info.coin = data.coin;
	if(data.item_id1 != 0) {
		var mat1 : PlantLockMatInfo = new PlantLockMatInfo();
		mat1.mat = ResManager.LgtMgr.getItemRow(data.item_id1);
		mat1.goodId = data.goods_id1;
		mat1.needNum = data.count1;
		mat1.num = SelfItemLogic.getInstance().getItemNum(data.item_id1);
		info.matList.Add(mat1);
	}
	if(data.item_id2 != 0) {
		var mat2 : PlantLockMatInfo = new PlantLockMatInfo();
		mat2.mat = ResManager.LgtMgr.getItemRow(data.item_id2);
		mat2.goodId = data.goods_id2;
		mat2.needNum = data.count2;
		mat2.num = SelfItemLogic.getInstance().getItemNum(data.item_id2);
		info.matList.Add(mat2);
	}
	if(data.item_id3 != 0) {
		var mat3 : PlantLockMatInfo = new PlantLockMatInfo();
		mat3.mat = ResManager.LgtMgr.getItemRow(data.item_id3);
		mat3.goodId = data.goods_id3;
		mat3.needNum = data.count3;
		mat3.num = SelfItemLogic.getInstance().getItemNum(data.item_id3);
		info.matList.Add(mat3);
	}
	if(data.item_id4 != 0) {
		var mat4 : PlantLockMatInfo = new PlantLockMatInfo();
		mat4.mat = ResManager.LgtMgr.getItemRow(data.item_id4);
		mat4.goodId = data.goods_id4;
		mat4.needNum = data.count4;
		mat4.num = SelfItemLogic.getInstance().getItemNum(data.item_id4);
		info.matList.Add(mat4);
	}
	
	return info;
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

public function GetPageNumByPlayerLevel() : int {
	var level : int = DataCenter.getMainPlayerCurLv();
	for (var pageIndex:int = 1; pageIndex<=GetTotalPageNum(); ++pageIndex) {
		var pageData : ArrayList = GetPageData(pageIndex);
		if (null != pageData && 0 != pageData.Count) {
			var first : PlantSeedRow = pageData[0];
			var last : PlantSeedRow = pageData[pageData.Count - 1];
			if ((level >= first.level && level <= last.level) || (level >= last.level && level <= first.level)) {
				return pageIndex;
			}
		}
	}
	return 0;
}
