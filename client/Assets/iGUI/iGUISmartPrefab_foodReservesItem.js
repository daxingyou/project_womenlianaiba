import iGUI;

class ExpandUserData{
	var food_id : int;
	var idx : int;
}
private static var instance : iGUISmartPrefab_foodReservesItem;
var mThis_food_id : int = 0;
var this_food_base_info : BartenderFoodBaseInfoRow = null;
private var item_idx : int = 0;

function Awake(){
	instance=this;
	registLocalEvent();
}
static function getInstance(){
	return instance;
}
@HideInInspector
var foodLevelContainer : iGUIContainer;
@HideInInspector
var upFoodLvBtn : iGUIButton;
@HideInInspector
var needLevelLbl : iGUILabel;
@HideInInspector
var needDiamondLbl : iGUILabel;
@HideInInspector
var unLockBtn : iGUIButton;
@HideInInspector
var lockedContainer : iGUIContainer;
@HideInInspector
var openedContainer : iGUIContainer;
@HideInInspector
var stockInfoContainer : iGUIContainer;
@HideInInspector
var timeRemainLbl : iGUILabel;
@HideInInspector
var expandImmeBtn : iGUIButton;
@HideInInspector
var label3 : iGUILabel;
@HideInInspector
var cancelExpandBtn : iGUIButton;
@HideInInspector
var label2 : iGUILabel;
@HideInInspector
var expandInfoContainer : iGUIContainer;
@HideInInspector
var addShakeBtn : iGUIButton;
@HideInInspector
var timeLbl : iGUILabel;
@HideInInspector
var priceLbl : iGUILabel;
@HideInInspector
var foodImg : iGUIImage;
@HideInInspector
var image11 : iGUIImage;
@HideInInspector
var foodNameLbl : iGUILabel;
@HideInInspector
var foodReservesItem : iGUIPanel;

function registLocalEvent(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.EXPAND_STOCK_TIMERCOMPLETE), handleExpandStockTimerComplete);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.EXPAND_STOCK_ONTIMER), triggerExpandStockTimerCountDown);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.FOOD_UPGRADE_SUCCESS), handleFoodUpgradeSuccess);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.SET_EXPAND_USERDATA), setExpandUserData);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.All_FOODRRSERVESITEM_INIT), HandleEnableUnLockFoodBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MOUSEOVER_STOCK_GRID_CALLBACK), HandleMouseOverStockGridCallback);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.EXPAND_FOOD_STOCK_CANCEL), HandleCancelExpandStock);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CUR_STOCK_VALUE_CHANGED), HandleCurStockValueChanged);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.ADMAKING_PRODUCT_VALUE_CHANGED), HandleAtmakingProductValueChanged);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.PREMAKE_STOCK_CHANGED), HandlePremakeStockChanged);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.EXPAND_FOOD_STOCK_COMPLETE), HandleCompleteExpandFoodStock);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.START_EXPAND_FOOD_STOCK), HandleStartExpandFoodStock);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.REFRESH_FOOD_ALL_INFOS_SUCC), HandleRefreshFoodAllInfosSucces);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_UNLOCK_FOOD_EVENT), HandleNotifyUnlockFoodEvent);
}

function unRegistLocalEvent(){
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.EXPAND_STOCK_TIMERCOMPLETE), handleExpandStockTimerComplete);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.EXPAND_STOCK_ONTIMER), triggerExpandStockTimerCountDown);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.FOOD_UPGRADE_SUCCESS), handleFoodUpgradeSuccess);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.SET_EXPAND_USERDATA), setExpandUserData);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.All_FOODRRSERVESITEM_INIT), HandleEnableUnLockFoodBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.MOUSEOVER_STOCK_GRID_CALLBACK), HandleMouseOverStockGridCallback);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.EXPAND_FOOD_STOCK_CANCEL), HandleCancelExpandStock);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CUR_STOCK_VALUE_CHANGED), HandleCurStockValueChanged);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.ADMAKING_PRODUCT_VALUE_CHANGED), HandleAtmakingProductValueChanged);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.PREMAKE_STOCK_CHANGED), HandlePremakeStockChanged);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.EXPAND_FOOD_STOCK_COMPLETE), HandleCompleteExpandFoodStock);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.START_EXPAND_FOOD_STOCK), HandleStartExpandFoodStock);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.REFRESH_FOOD_ALL_INFOS_SUCC), HandleRefreshFoodAllInfosSucces);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_UNLOCK_FOOD_EVENT), HandleNotifyUnlockFoodEvent);
}

function destroySubComp(){
	if(stockInfoContainer.itemCount == 0){
		return;
	}
	
	for(var j : int = 0; j < stockInfoContainer.itemCount; ++ j){
		var stock_item_comp : iGUISmartPrefab_stockInfoItemContainer =
			stockInfoContainer.items[j].GetComponent("iGUISmartPrefab_stockInfoItemContainer") as iGUISmartPrefab_stockInfoItemContainer;
		if(stock_item_comp){
			stock_item_comp.destroy();
		}
				
	}
}

function destroyTimers(){
	
}

function destroy(){
	mThis_food_id = 0;
	this_food_base_info = null;
	item_idx = 0;
	instance = null;
	destroyTimers();
	destroySubComp();
	Global.GetSysTooltip().Hide();
	unRegistLocalEvent();
}

function registCtrlsCallback(){
	foodImg.mouseOverCallback = mouseOverCallback_foodImg;
	foodImg.mouseOutCallback = mouseOutCallback_foodImg;
	expandImmeBtn.clickCallback = ClickCallback_expandImmeBtn;
	cancelExpandBtn.clickCallback = ClickCallback_cancelExpandBtn;
	upFoodLvBtn.clickCallback = ClickCallback_upFoodLvBtn;
}

function ClickCallback_expandImmeBtn(caller : iGUIElement){
	var user_data : ExpandUserData = caller.userData as ExpandUserData;
	Global.GetSysMsgHandler().RegistCallbackUserData(590, user_data.food_id);
	var params : ArrayList = new ArrayList();
	params.Add(this_food_base_info.expand_stock_love_coins[user_data.idx]);
	Global.GetSysMsgHandler().ShowSysMsg(590,params);
}

static function confirmExpandCallback(caller : iGUIElement){
	var food_id : int = Convert.ToInt32(caller.userData);
	instance.reqImmediatelyCompleteExpandStock(food_id);
}

static function cancelExpandCallback(caller : iGUIElement){
	
}

function setExpandUserData(evt : GameEvent, obj : Object){
	var info : StockItemInitInfoClass = obj as StockItemInitInfoClass;
	if(info.food_id == mThis_food_id){
		var user_data : ExpandUserData = new ExpandUserData();
		user_data.food_id = info.food_id;
		user_data.idx = info.idx;
		expandImmeBtn.userData = user_data;
	}
}
function Start(){
	var idx_str : String = this.name.Substring(0, 2);
	item_idx = ResManager.LgtMgr.ParseInt(idx_str);
	openedContainer.setLayer(3);
	foodLevelContainer.setLayer(2);
	foodLevelContainer.setX(5);
	foodLevelContainer.ignoreMouseOver = true;
	foodLevelContainer.setY(23);
	foodLevelContainer.setWidth(56);
	foodLevelContainer.setHeight(56);
	needLevelLbl.setX(61f);
	needLevelLbl.setWidth(120f);
	upFoodLvBtn.setX(upFoodLvBtn.positionAndSize.x + 3);
	timeRemainLbl.label.text = "";
	registCtrlsCallback();
	setFoodId(Convert.ToInt32(foodReservesItem.userData));
	foodReservesItem.setEnabled(false);
	iGUICode_BartenderUI.foodReservesItemCreatedNum ++;
	if(iGUICode_BartenderUI.foodReservesItemCreatedNum >= iGUICode_BartenderUI.curPageFoodReservesItemTNum){
		refreshCurFoodListInfo();
	}
}

function showUpgradeBtn(){
	if(hasAllFoodsUnlocked() && !hasUpToMaxGrade()){
		upFoodLvBtn.setEnabled(true);
	}
	
}

function hasAllFoodsUnlocked() : boolean{
	return BartenderSys.getInstance().hasAllFoodsUnlocked();
}

function hasUpToMaxGrade() : boolean{
	var max_grade : int = this_food_base_info.max_upgrade_level;
	var cur_grade : int = this_food_base_info.cur_level;
	
	return (cur_grade >= max_grade) ? true : false;
}

function refreshCurFoodListInfo(){
	BartenderSys.getInstance().reqFoodListCurInfo();
}

function reqProduceArea(){
	BartenderSys.getInstance().reqProduceArea();
}

function initUiBaseInfo(){
	//获取产品表信息
	var food_productRow : BartenderFoodProductInfoRow = 
						BartenderSys.getInstance().getBartenderSysTableMgr().getProductInfoRow(this_food_base_info.upgrade_id);
	//设置食物名
	var food_name : String = food_productRow.name;
	foodNameLbl.label.text = food_name;
	loadFoodIcon(foodImg, food_productRow.icon);
	//设置是否解锁
	var bIs_default_lock : boolean = false;
	var iIs_default_lock : int = this_food_base_info.is_default_lock;
	if(iIs_default_lock == FOODLOCKENUM.LOCKED){
		bIs_default_lock = true;
	}
	if(bIs_default_lock){
		setLockedContainer(true);
	}
	else{
		setLockedContainer(false);
		setOpenedContainer(true);
	}
	iGUICode_BartenderUI.curPageFoodReservesInfoInitNum ++;
	if(iGUICode_BartenderUI.curPageFoodReservesInfoInitNum >= iGUICode_BartenderUI.curPageFoodReservesInfoRefreshedTotalNum){
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.All_FOODRRSERVESITEM_INIT));
		iGUICode_BartenderUI.curPageFoodReservesInfoInitNum = 0;
	}
	createFoodLevelUI();
	showUpgradeBtn();
}

function createFoodLevelUI(){
	var img_name_base : String = "food_lv";
	var img_name : String = img_name_base + this_food_base_info.cur_level.ToString();
	var level_img : iGUIImage = foodLevelContainer.addElement("iGUIImage") as iGUIImage;
	level_img.image = Resources.Load("UISkins/Textures/cookbook/" + img_name);
	level_img.ignoreClicks = true;
	level_img.ignoreMouseOver = true;
	level_img.setX(0);
	level_img.setY(0);
	level_img.setWidth(1);
	level_img.setHeight(1);
}

function loadFoodIcon(img_frm : iGUIImage, img_name : String){
	 BartenderSys.getInstance().loadIcon(img_frm, img_name);
}

function setExpandInfoContainer(enabled : boolean){
	if(enabled && this_food_base_info.cur_remain_expand_time){
		var timeInfo : ExpandStockTimeInfo = new ExpandStockTimeInfo();
		timeInfo.food_id = mThis_food_id;
		timeInfo.during_time = this_food_base_info.cur_remain_expand_time;
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.START_EXPAND_FOOD_STOCK), timeInfo);
	}
}

function setLockedContainer(enabled : boolean){
	lockedContainer.setEnabled(enabled);
	if(enabled){
		needLevelLbl.label.text = "需要人物" + this_food_base_info.need_role_level + "级";
		needDiamondLbl.label.text = "需要" + this_food_base_info.unlock_diamond + "水晶";
		unLockBtn.userData = this_food_base_info.food_id;
		unLockBtn.clickCallback = ClickCallback_unLockBtn;
	}
	else{
		unLockBtn.userData = null;
		unLockBtn.clickCallback = null;	
		foodReservesItem.removeElement(lockedContainer);
	}
}

function setOpenedContainer(enabled : boolean){
	openedContainer.setEnabled(enabled);
	if(enabled)
		setOpenedFoodUIInfo();
}

function setOpenedFoodUIInfo(){
	var food_productRow : BartenderFoodProductInfoRow = 
						BartenderSys.getInstance().getBartenderSysTableMgr().getProductInfoRow(this_food_base_info.upgrade_id);
	priceLbl.label.text = food_productRow.shaking_diamond.ToString();
	//
	var food_shaking_seconds : int = food_productRow.shaking_time;
	var food_shaking_format_time : RemainTimeStruct = PhyPowerMgr.CalculateRemainTime(food_shaking_seconds, true);
	var show_format_time : String = "";
	//
	if(food_shaking_format_time.day != "0"){
		show_format_time += food_shaking_format_time.day + "天";
	}
	if(food_shaking_format_time.hour != "0"){
		show_format_time += food_shaking_format_time.hour + "小时";
	}
	if(food_shaking_format_time.min != "0"){
		show_format_time += food_shaking_format_time.min + "分";
	}
	if(food_shaking_format_time.sec != "0"){
		show_format_time += food_shaking_format_time.sec + "秒";
	}
	
	timeLbl.label.text = show_format_time;
	addShakeBtn.clickCallback = ClickCallback_addShakeBtn;
	//
	var cur_open_gridNum : int = this_food_base_info.min_stock;
	var max_grid_num : int = this_food_base_info.max_stock;
	if(this_food_base_info.min_stock < this_food_base_info.cur_open_gridNum){
		cur_open_gridNum = this_food_base_info.cur_open_gridNum;
	}
	createFoodStockGridList(cur_open_gridNum, max_grid_num);
	if(isAtExpandStock())
		setExpandInfoContainer(true);
}

function createFoodStockGridList(cur_open_gridNum : int, max_gridNum : int){
	stockInfoContainer.removeAll();
	
	var cur_remain_stock_value_list : ArrayList = new ArrayList();
	var copies_per_grid : int = BartenderSys.getInstance().getBartenderSysTableMgr().getProductInfoRow(this_food_base_info.upgrade_id).copies_per_grid;
	//库存实际占用了多少空间
	var cur_stock_value_occupyed_grid : float = Convert.ToSingle(this_food_base_info.cur_stock_value) / copies_per_grid;
	//库存需要占用多少个格子
	var cur_stock_value_need_grid_num : int = Mathf.CeilToInt(cur_stock_value_occupyed_grid);
	//库存占用多少个满格
	var cur_stock_value_occupyed_full_grid_num : int = Mathf.FloorToInt(cur_stock_value_occupyed_grid);
	//库存占用了多少个不满格
	var cur_stock_value_occupyed_notFull_grid_num : int = cur_stock_value_need_grid_num - cur_stock_value_occupyed_full_grid_num;
	//先填充满的格子的库存
	for(var i :int = 0; i < cur_stock_value_occupyed_full_grid_num; ++ i){
		cur_remain_stock_value_list.Add(copies_per_grid);
	}
	//然后再最后加上不满的库存
	var notFull_grid_idx : int = 0;
	var cur_notFull_grid_stock_value : int = this_food_base_info.cur_stock_value - cur_stock_value_occupyed_full_grid_num * copies_per_grid;
	if(cur_stock_value_occupyed_notFull_grid_num > 0){
		cur_remain_stock_value_list.Add(cur_notFull_grid_stock_value);
		notFull_grid_idx = cur_remain_stock_value_list.Count - 1;
	}
	
	var max_grid_num : int = this_food_base_info.max_stock;
	if(this_food_base_info.min_stock < this_food_base_info.cur_open_gridNum){
		cur_open_gridNum = this_food_base_info.cur_open_gridNum;
	}
	
	//库存为0的格子，包括空格子和未开锁的格子
	var  empty_grid_num : int = max_grid_num - cur_stock_value_need_grid_num;
	for(var i1 :int = 0; i1 < empty_grid_num; ++ i1){
		cur_remain_stock_value_list.Add(0);
	}
	
	//更新正在制作的量
	var total_atmakeing_value : int = this_food_base_info.cur_atmaking_stock_value;
	//占用多少格
	var atmakeing_occupyed_gird_num : int = total_atmakeing_value / copies_per_grid;
	var atmaking_vaule_list : ArrayList = new ArrayList();
	for(var i21 :int = 0; i21 < max_grid_num; ++ i21){
		atmaking_vaule_list.Add(0);
	}
	if(atmakeing_occupyed_gird_num > 0){
		//需要多少格表示
		//如果有库存不满格，则要多加1格
		if(cur_stock_value_occupyed_notFull_grid_num > 0){
			atmakeing_occupyed_gird_num += 1;
		}
		//如果没有库存
		if(cur_remain_stock_value_list.Count == 0){
			for(var i31 : int = 0; i31 < atmakeing_occupyed_gird_num; ++ i31){
				if(i31 < atmaking_vaule_list.Count)
					atmaking_vaule_list[i31] = copies_per_grid;
			}
		}
		else{
			if(cur_stock_value_occupyed_notFull_grid_num > 0){
				var notFull_grid_atmaking_value1 : int = cur_notFull_grid_stock_value;
				var notFull_grid_atmaking_value2 : int = copies_per_grid - cur_notFull_grid_stock_value;
				if(notFull_grid_idx + 0 < atmaking_vaule_list.Count)
					atmaking_vaule_list[notFull_grid_idx + 0] = notFull_grid_atmaking_value2;
				if(notFull_grid_idx + (atmakeing_occupyed_gird_num - 1) < atmaking_vaule_list.Count)
					atmaking_vaule_list[notFull_grid_idx + (atmakeing_occupyed_gird_num - 1)] = notFull_grid_atmaking_value1;
				var mid_num1 : int = atmakeing_occupyed_gird_num - 2;
				for(var i51 : int = 1; i51 <= mid_num1; ++ i51){
					if(notFull_grid_idx + i51 < atmaking_vaule_list.Count)
						atmaking_vaule_list[notFull_grid_idx + i51] = copies_per_grid;
				}
			}
			else{
				for(var i41 : int = 0; i41 < atmakeing_occupyed_gird_num; ++ i41){
					if(cur_stock_value_occupyed_full_grid_num + i41 < atmaking_vaule_list.Count)
						atmaking_vaule_list[cur_stock_value_occupyed_full_grid_num + i41] = copies_per_grid;
				}
			}
		}
	}
	
	//
	//更新准备制作的数据
	var total_premake_value : float = this_food_base_info.cur_premake_stock_value;
	//占用多少格
	var premake_occupyed_gird_num : int = Mathf.CeilToInt(total_premake_value / copies_per_grid);
	var premake_vaule_list : ArrayList = new ArrayList();
	for(var i2 :int = 0; i2 < max_grid_num; ++ i2){
		premake_vaule_list.Add(0);
	}
	if(premake_occupyed_gird_num > 0){
		//需要多少格表示
		//如果有库存不满格，则要多加1格
		if(cur_stock_value_occupyed_notFull_grid_num > 0){
			premake_occupyed_gird_num += 1;
		}
		//如果没有库存
		if(cur_remain_stock_value_list.Count == 0){
			//如果没有正在制作的
			if(atmakeing_occupyed_gird_num == 0){
				for(var i3 : int = 0; i3 < premake_occupyed_gird_num; ++ i3){
					if(i3 < premake_vaule_list.Count)
						premake_vaule_list[i3] = copies_per_grid;
				}
			}
			else{//如果有正在制作的
				//全都是满格
				for(var i4 : int = 0; i4 < premake_occupyed_gird_num; ++ i4){
					if(atmakeing_occupyed_gird_num + i4 < premake_vaule_list.Count)
						premake_vaule_list[atmakeing_occupyed_gird_num + i4] = copies_per_grid;
				}
			}
			
		}
		else{//有库存
			//如果没有正在制作的
			if(atmakeing_occupyed_gird_num == 0){
				if(cur_stock_value_occupyed_notFull_grid_num > 0){//有不满格
					var notFull_grid_premake_value1 : int = cur_notFull_grid_stock_value;
					var notFull_grid_premake_value2 : int = copies_per_grid - cur_notFull_grid_stock_value;
					if(notFull_grid_idx + 0 < premake_vaule_list.Count)
						premake_vaule_list[notFull_grid_idx + 0] = notFull_grid_premake_value2;
					if(notFull_grid_idx + (premake_occupyed_gird_num - 1) < premake_vaule_list.Count)
						premake_vaule_list[notFull_grid_idx + (premake_occupyed_gird_num - 1)] = notFull_grid_premake_value1;
					var mid_num2 : int = premake_occupyed_gird_num - 2;
					for(var i5 : int = 1; i5 <= mid_num2; ++ i5){
						if(notFull_grid_idx + i5 < premake_vaule_list.Count)
							premake_vaule_list[notFull_grid_idx + i5] = copies_per_grid;
					}
				}
				else{
					for(var i6 : int = 0; i6 < premake_occupyed_gird_num; ++ i6){
						if(cur_stock_value_occupyed_full_grid_num + i6 < premake_vaule_list.Count)
							premake_vaule_list[cur_stock_value_occupyed_full_grid_num + i6] = copies_per_grid;
					}
				}
			}
			else{//如果有正在制作的
				if(cur_stock_value_occupyed_notFull_grid_num > 0){//有不满格
					var notFull_grid_premake_value11 : int = cur_notFull_grid_stock_value;
					var notFull_grid_premake_value21 : int = copies_per_grid - cur_notFull_grid_stock_value;
					if(notFull_grid_idx + (atmakeing_occupyed_gird_num - 1) + 0 < premake_vaule_list.Count)
						premake_vaule_list[notFull_grid_idx + (atmakeing_occupyed_gird_num - 1) + 0] = notFull_grid_premake_value21;
					if(notFull_grid_idx + (atmakeing_occupyed_gird_num - 1) + (premake_occupyed_gird_num - 1) < premake_vaule_list.Count)
						premake_vaule_list[notFull_grid_idx + (atmakeing_occupyed_gird_num - 1) + (premake_occupyed_gird_num - 1)] = notFull_grid_premake_value11;
					var mid_num3 : int = premake_occupyed_gird_num - 2;
					for(var i55 : int = 1; i55 <= mid_num3; ++ i55){
						if(notFull_grid_idx + (atmakeing_occupyed_gird_num - 1) + i55 < premake_vaule_list.Count)
							premake_vaule_list[notFull_grid_idx + (atmakeing_occupyed_gird_num - 1) + i55] = copies_per_grid;
					}
				}
				else{
					for(var i61 : int = 0; i61 < premake_occupyed_gird_num; ++ i61){
						if(cur_stock_value_occupyed_full_grid_num + atmakeing_occupyed_gird_num + i61 < premake_vaule_list.Count)
							premake_vaule_list[cur_stock_value_occupyed_full_grid_num + atmakeing_occupyed_gird_num + i61] = copies_per_grid;
					}
				}
			}
		}
		
	}
	
	var cur_openTo_grid_idx : int = cur_open_gridNum - 1;
	
	for(var j : int = 0; j < max_gridNum; ++ j){
		var grid_w : float = 19;
		var grid_h : float = 17;
		var grid_space : float = 2;
		var posx : float = (grid_w + grid_space) * j;
		var posy : float = 0;
		var is_opened : boolean = false;
		if(j <= cur_openTo_grid_idx){
			is_opened = true;
		}
		var initInfo : StockItemInitInfoClass = new StockItemInitInfoClass();
		var isOpenedNextGrid : boolean = false;
		if(j == cur_openTo_grid_idx + 1){
			isOpenedNextGrid = true;
		}
		initInfo.idx = j;
		initInfo.food_id = this_food_base_info.food_id;
		initInfo.isOpened = is_opened;
		initInfo.isOpenedNextStock = isOpenedNextGrid;
		if(isOpenedNextGrid)
			initInfo.isInExpandingGrid = isAtExpandStock();
		else
			initInfo.isInExpandingGrid = false;
			
		//
		var j_stock_value : int = cur_remain_stock_value_list[j];
		initInfo.cur_stock_value_this_grid = j_stock_value;
		initInfo.this_grid_max_stock_value = copies_per_grid;
		if(j_stock_value == copies_per_grid){
			initInfo.isFull = true;
		}
		else{
			initInfo.isFull = false;
		}
		if(j_stock_value == 0){
			initInfo.isEmpty = true;
		}
		else{
			initInfo.isEmpty = false;
		}
		//
		
		var j_stock_premake_value : int = premake_vaule_list[j];
		if(j_stock_premake_value > 0){
			initInfo.isPremake = true;
			initInfo.isMaking = false;
		}
		else{
			initInfo.isPremake = false;
		}
		
		initInfo.cur_premake_value = j_stock_premake_value;
		
		var j_stock_atmaking_value : int = atmaking_vaule_list[j];
		if(j_stock_atmaking_value > 0){
			initInfo.isMaking = true;
			initInfo.isPremake = false;
		}
		else{
			initInfo.isMaking = false;
		}
		initInfo.cur_atmaking_value = j_stock_atmaking_value;
		if(j_stock_atmaking_value > 0 && j_stock_premake_value > 0){
			initInfo.isPremake = true;
			initInfo.isMaking = true;
		}
		
		createFoodStockGrid(initInfo, posx, posy, grid_w, grid_h);
	}
}

function createFoodStockGrid(initInfo : StockItemInitInfoClass, posx : float, posy : float, grid_w : float, grid_h : float){
	var stockContainer : iGUIContainer = stockInfoContainer.addSmartObject("stockInfoItemContainer") as iGUIContainer;
	stockContainer.name = initInfo.idx.ToString() + "-stockInfoItemContainer";
	stockContainer.userData = initInfo;
	stockContainer.setX(posx);
	stockContainer.setY(posy);
	NewHandGuideLogic.excuteEvent("CREATE_FOOD_STOCK_GRID", initInfo);
}

function setFoodInfo(food_base_info : BartenderFoodBaseInfoRow){
	this_food_base_info = food_base_info;
}

function setFoodId(food_id : int){
	mThis_food_id = food_id;
}

function ClickCallback_addShakeBtn(caller : iGUIElement){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_ADDSHAKE_BTN), mThis_food_id);
	//EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.ENABLE_MAKE_PRODUCT_BTN_EVENT), false);
}

function ClickCallback_unLockBtn(caller : iGUIElement){
	var food_id : int = Convert.ToInt32(caller.userData);
	if(SelfItemLogic.getInstance().GetCurDiamond() >= this_food_base_info.unlock_diamond
		&& DataCenter.getMainPlayerCurLv() >= this_food_base_info.need_role_level){
		Global.GetSysMsgHandler().RegistCallbackUserData(591, food_id);
		var params : ArrayList = new ArrayList();
		params.Add(this_food_base_info.unlock_diamond);
		Global.GetSysMsgHandler().ShowSysMsg(591,params);
	}
	else if(SelfItemLogic.getInstance().GetCurDiamond() < this_food_base_info.unlock_diamond){
		Global.GetSysMsgHandler().ShowSysMsg(582);
	}
	else if(DataCenter.getMainPlayerCurLv() < this_food_base_info.need_role_level){
		Global.GetSysMsgHandler().ShowSysMsg(572);
	}
}

static function confirmUnlockFoodCallback(caller : iGUIElement){
	var food_id : int = Convert.ToInt32(caller.userData);
	instance.reqUnLockFood(food_id);
}

static function cancelUnlockFoodCallback(caller : iGUIElement){

}

function reqUnLockFood(food_id : int){
	BartenderSys.getInstance().reqUnlockFood(food_id);
}

function HandleNotifyUnlockFoodEvent(evt : GameEvent, obj : Object){
	var unlock_food_id : int = Convert.ToInt32(obj);
	if(mThis_food_id != 0 && unlock_food_id == mThis_food_id){
		setLockedContainer(false);
		setOpenedContainer(true);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.All_FOODRRSERVESITEM_INIT));
	}
	showUpgradeBtn();
}

function HandleRefreshFoodAllInfosSucces(evt : GameEvent, obj : Object){
	if(!foodReservesItem.enabled)
		foodReservesItem.setEnabled(true);
	if(mThis_food_id == 0){
		return;
	}
	var baseInfo : BartenderFoodBaseInfoRow = 
										BartenderSys.getInstance().getBartenderSysTableMgr().getFoodBaseInfoRow(mThis_food_id);
	setFoodInfo(baseInfo);
	initUiBaseInfo();
	iGUICode_BartenderUI.curPageFoodReservesInfoRefreshedNum ++;
	if(!BartenderSys.has_req_product_area && iGUICode_BartenderUI.curPageFoodReservesInfoRefreshedNum >= iGUICode_BartenderUI.curPageFoodReservesInfoRefreshedTotalNum){
		reqProduceArea();
		BartenderSys.has_req_product_area = true;
	}
}

function HandleEnableUnLockFoodBtn(evt : GameEvent, obj : Object){
	var opened_food_num : int = BartenderSys.getInstance().getUnlockedFoodNum();
	var need_btn : boolean = false;
	var page_idx : int = item_idx + (iGUICode_BartenderUI.getInstance().bartenderPageMgr.GetPageIndex() - 1) * iGUICode_BartenderUI.getInstance().numCurPage;
	if(opened_food_num == page_idx){
		need_btn = true;
	}
	if(need_btn){
		unLockBtn.setEnabled(true);
	}
	else{
		unLockBtn.setEnabled(false);
	}
}

function isAtExpandStock() : boolean {
	var expand_remain_time : stime = this_food_base_info.cur_remain_expand_time;
	
	if(!expand_remain_time){
		return false;
	}
	if( (expand_remain_time.year == 0 
		&& expand_remain_time.month == 0 
		&& expand_remain_time.day == 0 
		&& expand_remain_time.hour == 0 
		&& expand_remain_time.minute == 0
		&& expand_remain_time.second == 0)
	  ){
		
		return false;
	}
	else{
		var remain_sec : int =  Mathf.FloorToInt(Global.subtractStime(expand_remain_time, SysTimer.getCurTime()).TotalSeconds);
		if(remain_sec <= 0)
			return false;
		else
			return true;
	}
}

function HandleStartExpandFoodStock(evt : GameEvent, obj : Object){
	var timeInfo : ExpandStockTimeInfo = obj as ExpandStockTimeInfo;
	if(timeInfo.food_id == mThis_food_id){
		updateStockInfos();
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.START_EXPAND_FOOD_STOCK_GRID), timeInfo);
		expandInfoContainer.setEnabled(true);
		priceLbl.setEnabled(false);
		timeLbl.setEnabled(false);
		addShakeBtn.setEnabled(false);
	}
}

function triggerExpandStockTimerCountDown(evt : GameEvent, obj : Object){
	var timeInfo : ExpandStockTimeInfo = obj as ExpandStockTimeInfo;
	var expand_food_id : int = timeInfo.food_id;
	if(expand_food_id == mThis_food_id){
		var remain_tmStruct : RemainTimeStruct = PhyPowerMgr.CalculateRemainTime(timeInfo.remainSecs, true);
		var show_format_time : String = "";
		if(remain_tmStruct.day != "0"){
			show_format_time += remain_tmStruct.day + "天";
		}
		if(remain_tmStruct.hour != "0"){
			show_format_time += remain_tmStruct.hour + "小时";
		}
		if(remain_tmStruct.min != "0"){
			show_format_time += remain_tmStruct.min + "分";
		}
		if(remain_tmStruct.sec != "0"){
			show_format_time += remain_tmStruct.sec + "秒";
		}
		timeRemainLbl.label.text = show_format_time;
	}
}

function handleExpandStockTimerComplete(evt : GameEvent, obj : Object){
	var timeInfo : ExpandStockTimeInfo = obj as ExpandStockTimeInfo;
	var expand_food_id : int = timeInfo.food_id;
	if(expand_food_id == mThis_food_id){
		timeRemainLbl.label.text = "";
		expandInfoContainer.setEnabled(false);
		priceLbl.setEnabled(true);
		timeLbl.setEnabled(true);
		addShakeBtn.setEnabled(true);
	}
}

function reqImmediatelyCompleteExpandStock(food_id : int){
	BartenderSys.getInstance().reqImmediatelyCompleteExpandStock(food_id);
}

function updateStockInfos(){
	if(stockInfoContainer.itemCount == 0){
		return;
	}
	
	var cur_remain_stock_value_list : ArrayList = new ArrayList();
	var copies_per_grid : int = BartenderSys.getInstance().getBartenderSysTableMgr().getProductInfoRow(this_food_base_info.upgrade_id).copies_per_grid;
	//库存实际占用了多少空间
	var cur_stock_value_occupyed_grid : float = Convert.ToSingle(this_food_base_info.cur_stock_value) / copies_per_grid;
	//库存需要占用多少个格子
	var cur_stock_value_need_grid_num : int = Mathf.CeilToInt(cur_stock_value_occupyed_grid);
	//库存占用多少个满格
	var cur_stock_value_occupyed_full_grid_num : int = Mathf.FloorToInt(cur_stock_value_occupyed_grid);
	//库存占用了多少个不满格
	var cur_stock_value_occupyed_notFull_grid_num : int = cur_stock_value_need_grid_num - cur_stock_value_occupyed_full_grid_num;
	//先填充满的格子的库存
	for(var i :int = 0; i < cur_stock_value_occupyed_full_grid_num; ++ i){
		cur_remain_stock_value_list.Add(copies_per_grid);
	}
	//然后再最后加上不满的库存
	var notFull_grid_idx : int = 0;
	var cur_notFull_grid_stock_value : int = this_food_base_info.cur_stock_value - cur_stock_value_occupyed_full_grid_num * copies_per_grid;
	if(cur_stock_value_occupyed_notFull_grid_num > 0){
		cur_remain_stock_value_list.Add(cur_notFull_grid_stock_value);
		notFull_grid_idx = cur_remain_stock_value_list.Count - 1;
	}
	
	var cur_open_gridNum : int = this_food_base_info.min_stock;
	var max_grid_num : int = this_food_base_info.max_stock;
	if(this_food_base_info.min_stock < this_food_base_info.cur_open_gridNum){
		cur_open_gridNum = this_food_base_info.cur_open_gridNum;
	}
	
	//库存为0的格子，包括空格子和未开锁的格子
	var  empty_grid_num : int = max_grid_num - cur_stock_value_need_grid_num;
	for(var i1 :int = 0; i1 < empty_grid_num; ++ i1){
		cur_remain_stock_value_list.Add(0);
	}
	
	//更新正在制作的量
	var total_atmakeing_value : int = this_food_base_info.cur_atmaking_stock_value;
	//占用多少格
	var atmakeing_occupyed_gird_num : int = total_atmakeing_value / copies_per_grid;
	var atmaking_vaule_list : ArrayList = new ArrayList();
	for(var i21 :int = 0; i21 < max_grid_num; ++ i21){
		atmaking_vaule_list.Add(0);
	}
	if(atmakeing_occupyed_gird_num > 0){
		//需要多少格表示
		//如果有库存不满格，则要多加1格
		if(cur_stock_value_occupyed_notFull_grid_num > 0){
			atmakeing_occupyed_gird_num += 1;
		}
		//如果没有库存
		if(cur_remain_stock_value_list.Count == 0){
			for(var i31 : int = 0; i31 < atmakeing_occupyed_gird_num; ++ i31){
				if(i31 < atmaking_vaule_list.Count)
					atmaking_vaule_list[i31] = copies_per_grid;
			}
		}
		else{
			if(cur_stock_value_occupyed_notFull_grid_num > 0){
				var notFull_grid_atmaking_value1 : int = cur_notFull_grid_stock_value;
				var notFull_grid_atmaking_value2 : int = copies_per_grid - cur_notFull_grid_stock_value;
				if(notFull_grid_idx + 0 < atmaking_vaule_list.Count)
					atmaking_vaule_list[notFull_grid_idx + 0] = notFull_grid_atmaking_value2;
				if(notFull_grid_idx + (atmakeing_occupyed_gird_num - 1) < atmaking_vaule_list.Count)
					atmaking_vaule_list[notFull_grid_idx + (atmakeing_occupyed_gird_num - 1)] = notFull_grid_atmaking_value1;
				var mid_num1 : int = atmakeing_occupyed_gird_num - 2;
				for(var i51 : int = 1; i51 <= mid_num1; ++ i51){
					if(notFull_grid_idx + i51 < atmaking_vaule_list.Count)
						atmaking_vaule_list[notFull_grid_idx + i51] = copies_per_grid;
				}
			}
			else{
				for(var i41 : int = 0; i41 < atmakeing_occupyed_gird_num; ++ i41){
					if(cur_stock_value_occupyed_full_grid_num + i41 < atmaking_vaule_list.Count)
						atmaking_vaule_list[cur_stock_value_occupyed_full_grid_num + i41] = copies_per_grid;
				}
			}
		}
	}
	
	//
	//更新准备制作的数据
	var total_premake_value : float = this_food_base_info.cur_premake_stock_value;
	//占用多少格
	var premake_occupyed_gird_num : int = Mathf.CeilToInt(total_premake_value / copies_per_grid);
	var premake_vaule_list : ArrayList = new ArrayList();
	for(var i2 :int = 0; i2 < max_grid_num; ++ i2){
		premake_vaule_list.Add(0);
	}
	if(premake_occupyed_gird_num > 0){
		//需要多少格表示
		//如果有库存不满格，则要多加1格
		if(cur_stock_value_occupyed_notFull_grid_num > 0){
			premake_occupyed_gird_num += 1;
		}
		//如果没有库存
		if(cur_remain_stock_value_list.Count == 0){
			//如果没有正在制作的
			if(atmakeing_occupyed_gird_num == 0){
				for(var i3 : int = 0; i3 < premake_occupyed_gird_num; ++ i3){
					if(i3 < premake_vaule_list.Count)
						premake_vaule_list[i3] = copies_per_grid;
				}
			}
			else{//如果有正在制作的
				//全都是满格
				for(var i4 : int = 0; i4 < premake_occupyed_gird_num; ++ i4){
					if(atmakeing_occupyed_gird_num + i4 < premake_vaule_list.Count)
						premake_vaule_list[atmakeing_occupyed_gird_num + i4] = copies_per_grid;
				}
			}
			
		}
		else{//有库存
			//如果没有正在制作的
			if(atmakeing_occupyed_gird_num == 0){
				if(cur_stock_value_occupyed_notFull_grid_num > 0){//有不满格
					var notFull_grid_premake_value1 : int = cur_notFull_grid_stock_value;
					var notFull_grid_premake_value2 : int = copies_per_grid - cur_notFull_grid_stock_value;
					if(notFull_grid_idx + 0 < premake_vaule_list.Count)
						premake_vaule_list[notFull_grid_idx + 0] = notFull_grid_premake_value2;
					if(notFull_grid_idx + (premake_occupyed_gird_num - 1) < premake_vaule_list.Count)
						premake_vaule_list[notFull_grid_idx + (premake_occupyed_gird_num - 1)] = notFull_grid_premake_value1;
					var mid_num2 : int = premake_occupyed_gird_num - 2;
					for(var i5 : int = 1; i5 <= mid_num2; ++ i5){
						if(notFull_grid_idx + i5 < premake_vaule_list.Count)
							premake_vaule_list[notFull_grid_idx + i5] = copies_per_grid;
					}
				}
				else{
					for(var i6 : int = 0; i6 < premake_occupyed_gird_num; ++ i6){
						if(cur_stock_value_occupyed_full_grid_num + i6 < premake_vaule_list.Count)
							premake_vaule_list[cur_stock_value_occupyed_full_grid_num + i6] = copies_per_grid;
					}
				}
			}
			else{//如果有正在制作的
				if(cur_stock_value_occupyed_notFull_grid_num > 0){//有不满格
					var notFull_grid_premake_value11 : int = cur_notFull_grid_stock_value;
					var notFull_grid_premake_value21 : int = copies_per_grid - cur_notFull_grid_stock_value;
					if(notFull_grid_idx + (atmakeing_occupyed_gird_num - 1) + 0 < premake_vaule_list.Count)
						premake_vaule_list[notFull_grid_idx + (atmakeing_occupyed_gird_num - 1) + 0] = notFull_grid_premake_value21;
					if(notFull_grid_idx + (atmakeing_occupyed_gird_num - 1) + (premake_occupyed_gird_num - 1) < premake_vaule_list.Count)
						premake_vaule_list[notFull_grid_idx + (atmakeing_occupyed_gird_num - 1) + (premake_occupyed_gird_num - 1)] = notFull_grid_premake_value11;
					var mid_num3 : int = premake_occupyed_gird_num - 2;
					for(var i55 : int = 1; i55 <= mid_num3; ++ i55){
						if(notFull_grid_idx + (atmakeing_occupyed_gird_num - 1) + i55 < premake_vaule_list.Count)
							premake_vaule_list[notFull_grid_idx + (atmakeing_occupyed_gird_num - 1) + i55] = copies_per_grid;
					}
				}
				else{
					for(var i61 : int = 0; i61 < premake_occupyed_gird_num; ++ i61){
						if(cur_stock_value_occupyed_full_grid_num + atmakeing_occupyed_gird_num + i61 < premake_vaule_list.Count)
							premake_vaule_list[cur_stock_value_occupyed_full_grid_num + atmakeing_occupyed_gird_num + i61] = copies_per_grid;
					}
				}
			}
		}
		
	}
	
	//
	var cur_openTo_grid_idx : int = cur_open_gridNum - 1;
	
	for(var j : int = 0; j < stockInfoContainer.itemCount; ++ j){
		//
		var is_opened : boolean = false;
		if(j <= cur_openTo_grid_idx){
			is_opened = true;
		}
		var initInfo : StockItemInitInfoClass = new StockItemInitInfoClass();
		var isOpenedNextGrid : boolean = false;
		if(j == cur_openTo_grid_idx + 1){
			isOpenedNextGrid = true;
		}
		initInfo.idx = j;
		initInfo.food_id = this_food_base_info.food_id;
		initInfo.isOpened = is_opened;
		initInfo.isOpenedNextStock = isOpenedNextGrid;
		if(isOpenedNextGrid)
			initInfo.isInExpandingGrid = isAtExpandStock();
		else
			initInfo.isInExpandingGrid = false;
			
		//
		var j_stock_value : int = cur_remain_stock_value_list[j];
		initInfo.cur_stock_value_this_grid = j_stock_value;
		initInfo.this_grid_max_stock_value = copies_per_grid;
		
		if(j_stock_value == copies_per_grid){
			initInfo.isFull = true;
		}
		else{
			initInfo.isFull = false;
		}
		if(j_stock_value == 0){
			initInfo.isEmpty = true;
		}
		else{
			initInfo.isEmpty = false;
		}
		
		//
		
		var j_stock_premake_value : int = premake_vaule_list[j];
		if(j_stock_premake_value > 0){
			initInfo.isPremake = true;
			initInfo.isMaking = false;
		}
		else{
			initInfo.isPremake = false;
		}
		
		initInfo.cur_premake_value = j_stock_premake_value;
		
		var j_stock_atmaking_value : int = atmaking_vaule_list[j];
		if(j_stock_atmaking_value > 0){
			initInfo.isMaking = true;
			initInfo.isPremake = false;
		}
		else{
			initInfo.isMaking = false;
		}
		initInfo.cur_atmaking_value = j_stock_atmaking_value;
		if(j_stock_atmaking_value > 0 && j_stock_premake_value > 0){
			initInfo.isPremake = true;
			initInfo.isMaking = true;
		}
		
		var stock_item_comp : iGUISmartPrefab_stockInfoItemContainer =
			stockInfoContainer.items[j].GetComponent("iGUISmartPrefab_stockInfoItemContainer") as iGUISmartPrefab_stockInfoItemContainer;
		if(stock_item_comp){
			stock_item_comp.refrash(initInfo);
		}
				
	}
}

function HandleCompleteExpandFoodStock(evt : GameEvent, obj : Object){
	var timeInfo : ExpandStockTimeInfo = obj as ExpandStockTimeInfo;
	timeRemainLbl.label.text = "";
	expandInfoContainer.setEnabled(false);
	priceLbl.setEnabled(true);
	timeLbl.setEnabled(true);
	addShakeBtn.setEnabled(true);
	updateStockInfos();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.COMPLETE_EXPAND_FOOD_STOCK_GRID), timeInfo);
}

function HandleCancelExpandStock(evt : GameEvent, obj : Object){
	var timeInfo : ExpandStockTimeInfo = obj as ExpandStockTimeInfo;
	updateStockInfos();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CANCEL_EXPAND_FOOD_STOCK_GRID), timeInfo);
}

function HandlePremakeStockChanged(evt : GameEvent, obj : Object){
	updateStockInfos();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.PREMAKE_STOCK_PERGRID_VALUE_CHANGED));
}

function HandleAtmakingProductValueChanged(evt : GameEvent, obj : Object){
	updateStockInfos();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.ATMAKING_PRODUCT_PERGRID_VALUE_CHANGED));
}

function HandleCurStockValueChanged(evt : GameEvent, obj : Object){
	updateStockInfos();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CUR_PERGRID_STOCK_VALUE_CHANGED));
}

function ClickCallback_cancelExpandBtn(caller : iGUIElement){
	cancelExpandStock();
}

function cancelExpandStock(){
	timeRemainLbl.label.text = "";
	expandInfoContainer.setEnabled(false);
	priceLbl.setEnabled(true);
	timeLbl.setEnabled(true);
	addShakeBtn.setEnabled(true);
	BartenderSys.getInstance().reqCancelExpandFoodStock(mThis_food_id);
}

function mouseOverCallback_foodImg(caller : iGUIElement){
	var productRow : BartenderFoodProductInfoRow = 
						BartenderSys.getInstance().getBartenderSysTableMgr().getProductInfoRow(this_food_base_info.upgrade_id);
	var food_name : String = productRow.name;
	var stock_per_grid : int = productRow.copies_per_grid;
	// alter by zlj 显示整数价格
	var income_per_grid : int = productRow.price_per_copy * stock_per_grid;
	var consume_seconds_per_grid : int = productRow.sale_time;
	var consume_format_time_per_grid : RemainTimeStruct = PhyPowerMgr.CalculateRemainTime(consume_seconds_per_grid, true);
	var show_format_time : String = "";
	if(consume_format_time_per_grid.day != "0"){
		show_format_time += consume_format_time_per_grid.day + "天";
	}
	if(consume_format_time_per_grid.hour != "0"){
		show_format_time += consume_format_time_per_grid.hour + "小时";
	}
	if(consume_format_time_per_grid.min != "0"){
		show_format_time += consume_format_time_per_grid.min + "分";
	}
	if(consume_format_time_per_grid.sec != "0"){
		show_format_time += consume_format_time_per_grid.sec + "秒";
	}

	var food_level : int = this_food_base_info.cur_level;
	var need_house_level : int = this_food_base_info.house_level;
	//
	Global.GetSysTooltip().Begin(caller);
	Global.GetSysTooltip().Add(GUIContent(food_name), BartenderHintStyles.instance.foodNameStyle);
	Global.GetSysTooltip().Add(GUIContent("每格份数: " + stock_per_grid), BartenderHintStyles.instance.foodDescStyle);
	Global.GetSysTooltip().Add(GUIContent("每格收入: " + income_per_grid), BartenderHintStyles.instance.foodDescStyle);
	Global.GetSysTooltip().Add(GUIContent("食物等级: " + food_level), BartenderHintStyles.instance.foodDescStyle);
	Global.GetSysTooltip().Add(GUIContent("销售时间: " + show_format_time), BartenderHintStyles.instance.foodDescStyle);
	Global.GetSysTooltip().Add(GUIContent("销售需要房屋等级: " + need_house_level), BartenderHintStyles.instance.foodDescStyle);
	Global.GetSysTooltip().Show(true, 0, 50);	
}

function mouseOutCallback_foodImg(caller : iGUIElement){
	
}

function HandleMouseOverStockGridCallback(evt : GameEvent, obj : Object){
	var caller : iGUIElement = obj as iGUIElement;
	var userData : StockItemInitInfoClass = caller.userData as StockItemInitInfoClass;
	if(userData == null)
		return;
	
	if(mThis_food_id == userData.food_id && this_food_base_info.cur_stock_value <= 0){
		Global.GetSysTooltip().Begin(caller);
		Global.GetSysTooltip().Add(GUIContent("已售完"), BartenderHintStyles.instance.emptyStockDescStyle);
		Global.GetSysTooltip().Show(true, 0, 20);
	}
	else if(mThis_food_id == userData.food_id && this_food_base_info.cur_stock_value > 0){
		var food_productRow : BartenderFoodProductInfoRow = 
						BartenderSys.getInstance().getBartenderSysTableMgr().getProductInfoRow(this_food_base_info.upgrade_id);
		var name : String = food_productRow.name;
		var cur_stock_value : int = this_food_base_info.cur_stock_value;
		var copies_per_grid : int = food_productRow.copies_per_grid;
		var cur_max_stock_value : int = this_food_base_info.cur_open_gridNum * copies_per_grid;
		var cur_stock_consume_seconds : int = cur_stock_value * food_productRow.consume_speed;
		var cru_stock_consume_format_time : RemainTimeStruct = PhyPowerMgr.CalculateRemainTime(cur_stock_consume_seconds, true);
		var show_format_time : String = "";
		if(cru_stock_consume_format_time.day != "0"){
			show_format_time += cru_stock_consume_format_time.day + "天";
		}
		if(cru_stock_consume_format_time.hour != "0"){
			show_format_time += cru_stock_consume_format_time.hour + "小时";
		}
		if(cru_stock_consume_format_time.min != "0"){
			show_format_time += cru_stock_consume_format_time.min + "分";
		}
		if(cru_stock_consume_format_time.sec != "0"){
			show_format_time += cru_stock_consume_format_time.sec + "秒";
		}
		Global.GetSysTooltip().Begin(caller);
		Global.GetSysTooltip().Add(GUIContent(name + ": " + cur_stock_value), BartenderHintStyles.instance.foodInStockDescStyle);
		Global.GetSysTooltip().Add(GUIContent("库存上限: " + cur_max_stock_value), BartenderHintStyles.instance.foodInStockDescStyle);
		Global.GetSysTooltip().Add(GUIContent("在" + show_format_time + "内销售完"), BartenderHintStyles.instance.foodInStockDescStyle);
		Global.GetSysTooltip().Show(true, 0, 20);
	}
}

function ClickCallback_upFoodLvBtn(caller : iGUIElement){
	// 打开食物升级面板
    UI.getUI().OpenUIRoot("UpgradeFoodUI");
    UI.getUI().SetModal("UpgradeFoodUI", true);
    
    EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_FOOD_UPGRADE_BTN), this_food_base_info);
}

function handleFoodUpgradeSuccess(evt : GameEvent, obj : Object){
	var food_id : int = Convert.ToInt32(obj);
	if(mThis_food_id == food_id){
		if(this_food_base_info.cur_level >= this_food_base_info.max_upgrade_level){
			upFoodLvBtn.clickCallback = null;
			upFoodLvBtn.setEnabled(false);
		}
		var img_name_base : String = "food_lv";
		var img_name : String = img_name_base + this_food_base_info.cur_level.ToString();
		if(foodLevelContainer && foodLevelContainer.items[0]){
			var level_img : iGUIImage = foodLevelContainer.items[0] as iGUIImage;
			level_img.image = Resources.Load("UISkins/Textures/cookbook/" + img_name);
		}
	}
}