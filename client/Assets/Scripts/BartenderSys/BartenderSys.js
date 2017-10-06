#pragma strict

class ProductInfoStruct{
	var idx : int;
	var start_time : stime;
	var food_id : int;
	var product_id : int;
	var shaking_time : int;  // 调制需要的时间
	var shaking_diamond : int;
	var premake_value : int; // 制作的数量
}

class ShakingCostInfo{
	var cost_diamonds : int = 0;
	var cost_time : int = 0;	
}

var completeMakeFoodTipCount : int = 3;
static var is_first_login_bartend : boolean = true;
static var barTenderUI_IsOpened : boolean = false;
private var barTenderSysTableMgr : BartenderSysTablesMgr = null;
private static var instance : BartenderSys = null;
static var is_at_expanding_stock : boolean = false;
static var at_expanding_stock_food_id : int = 0;    // 扩展储备id
private var product_area_grid_in_using_num : int = 0; //包括了正在制作的产品数量和准备制作的产品数量的总和
private var cur_opened_product_area_grid_num : int = 0;
private var client_making_product_info_list : ArrayList = new ArrayList();
private var client_premake_product_info_list : ArrayList = new ArrayList();
static var has_req_product_area : boolean = false;
private var preMakeCostInfo : ShakingCostInfo = new ShakingCostInfo();
private var makingProductsTimer : Timer = null;
private var remainMakingSeconds : int = 0;
private var mCompleteTipTimer : Timer = null;
private var mExpandStockTimer : Timer = null;
private var mExpandStockTimerTotalSeconds : int = 0;
static var curCompleteExpandStockFoodID : int = 0;

static function getInstance() : BartenderSys {
	return instance;
}

function Awake(){
	instance = this;
	registLocalEvent();
}

function Start () {
	registNetEvent();
}

function getBartenderSysTableMgr(){
	return barTenderSysTableMgr;
}

function registNetEvent(){
	NetHelper.RegistHandler(new notify_settlement_expand_food_stock(), handleNotifyOfflineCompleteExpandStockMsg);
	NetHelper.RegistHandler(new notify_upgrade_food(), handleNotifyUpgradeFood);
	NetHelper.RegistHandler(new notify_food_upgrade_info(), handleNotifyFoodUpgradeInfo);
	NetHelper.RegistHandler(new notify_immediately_complete_product(), handleNotifyImmediateCompleteProduct);
	NetHelper.RegistHandler(new notify_cancel_expand_food_stock(), handleNotifyCancelExpandFoodStock);
	NetHelper.RegistHandler(new notify_make_product(), handleNotifyStartMakeProduct);
	NetHelper.RegistHandler(new notify_complete_product(), handleNotifyCompleteProduct);
	NetHelper.RegistHandler(new notify_expand_produce_area(), handleNotifyExpandProduceArea);
	NetHelper.RegistHandler(new notify_products(), handleNotifyProducts);
	NetHelper.RegistHandler(new notify_produce_area(), handleNotifyProduceArea);
	NetHelper.RegistHandler(new notify_complete_expand_food_stock(), handleNotifyCompleteExpandFoodStock);
	NetHelper.RegistHandler(new notify_unlock_food_info(), handleNotifyUnlockFoodListInfo);
	NetHelper.RegistHandler(new notify_food_stock_info(), handleNotifyFoodStockInfo);
	NetHelper.RegistHandler(new notify_unlock_food(), handleNotifyUnlockFood);
	NetHelper.RegistHandler(new notify_expand_food_stock(), handleNotifyExpandFoodStock);
	NetHelper.RegistHandler(new notify_immediately_complete_expand_stock(), handleNotifyImmediatelyExpandStock);
}

function registLocalEvent(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_COMPLETE_EXPAND_TIP), HandleCloseCompletExpandTip);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.EXPAND_FOOD_STOCK_COMPLETE), HandleCompleteExpandFoodStock);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.START_EXPAND_FOOD_STOCK), HandleStartExpandFoodStock);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.START_COMPLETEFOOD_TIP_TIMER), HandleStartCompleteFoodTipTimer);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.IMMEDIATE_COMPLETE_PRODUCTS), handleImmediateCompleteProducts);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.STOP_MAKING_PRODUCT_TIMER), HandleStopMakingProductTimer);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.COMPLETE_MAKE_ONE_PRODUCT), HandleCompleteMakeOneProduct);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MAKING_PRODUCT_INFO), HandleMakingProductInfo);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_ADDSHAKE_BTN), HandleClickAddShakeBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_BARTENDERUIROOT), HandleCloseBartenderUIRoot);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_BARTENDER_BTN), HandleClickBartenderBtn);	
}

function handleNotifyExpandProduceArea(evt : GameEvent, pack : notify_expand_produce_area){
	cur_opened_product_area_grid_num = pack.number;
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_EXPAND_PRODUCE_AREA), pack);
}

function handleNotifyProducts(evt : GameEvent, pack : notify_products){
	//正在制作的产品列表
	if(client_making_product_info_list.Count == 0){
		var isAdd : boolean = true;
		for(var j : int = 0; j < pack.info.Count; ++ j){
		
			++ product_area_grid_in_using_num;
			
			var info : ProductInfoStruct = new ProductInfoStruct();
			info.idx = j;
			info.start_time = pack.start_time;
			info.food_id = (pack.info[j] as product_info).id;
			info.product_id = (pack.info[j] as product_info).product_id;
			var productRow : BartenderFoodProductInfoRow = barTenderSysTableMgr.getProductInfoRow(info.product_id);
			info.shaking_diamond = productRow.shaking_diamond;
			info.shaking_time = productRow.shaking_time;
			client_making_product_info_list.Add(info);
			//
			updateAtmakingProductVale(info.food_id, isAdd);
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MAKING_PRODUCT_INFO), info);
		}
		var make_start_time : stime = pack.start_time;
		var remain_secs : int = 0;
		for(var ji : int = 0; ji < client_making_product_info_list.Count; ++ ji){
			var ji_shaking_time : int = (client_making_product_info_list[ji] as ProductInfoStruct).shaking_time;
			if(ji == 0){
				var passed_secs : int =  Mathf.FloorToInt(Global.subtractStime(SysTimer.getCurTime(), make_start_time).TotalSeconds);
				remain_secs = ji_shaking_time - passed_secs;
			}
			else{
				remain_secs += ji_shaking_time;
			}
		}
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.START_MAKING_PRODUCTS), remain_secs);
		//准备制作的产品列表,这个列表是跟在正在制作的产品列表之后
	}
	else{
		var remain_secs1 : int = 0;
		for(var ji1 : int = 0; ji1 < client_making_product_info_list.Count; ++ ji1){
			var info1 : ProductInfoStruct = client_making_product_info_list[ji1] as ProductInfoStruct;
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.REFRESH_PRODUCT_INFO), info1);
			var ji1_shaking_time : int = info1.shaking_time;
			if(ji1 == 0){
				//var passed_secs1 : int =  Mathf.FloorToInt(Global.subtractStime(SysTimer.getCurTime(), make_start_time).TotalSeconds);
				remain_secs1 = remainMakingSeconds;
			}
			else{
				remain_secs1 += ji1_shaking_time;
			}
		}
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.START_MAKING_PRODUCTS), remain_secs1);
	}
	
}

function refreshProducts(){
	if(client_making_product_info_list.Count == 0){
		return;
	}
	
	var remain_secs1 : int = 0;
	for(var ji1 : int = 0; ji1 < client_making_product_info_list.Count; ++ ji1){
		var info1 : ProductInfoStruct = client_making_product_info_list[ji1] as ProductInfoStruct;
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.REFRESH_PRODUCT_INFO), info1);
		var ji1_shaking_time : int = info1.shaking_time;
		if(ji1 == 0){
			//var passed_secs1 : int =  Mathf.FloorToInt(Global.subtractStime(SysTimer.getCurTime(), make_start_time).TotalSeconds);
			remain_secs1 = remainMakingSeconds;
		}
		else{
			remain_secs1 += ji1_shaking_time;
		}
	}
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.START_MAKING_PRODUCTS), remain_secs1);	
}

function handleNotifyProduceArea(evt : GameEvent, pack : notify_produce_area){
	var area_num : int = pack.number;
	cur_opened_product_area_grid_num = area_num;
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_PRODUCE_AREA), area_num);
}

function handleNotifyCompleteExpandFoodStock(evt : GameEvent, pack : notify_complete_expand_food_stock){
	is_at_expanding_stock = false;
	at_expanding_stock_food_id = 0;
	var timeInfo : ExpandStockTimeInfo = new ExpandStockTimeInfo();
	timeInfo.food_id = pack.id;
	timeInfo.during_time = null;
	updateExpandFoodStockState(timeInfo, false);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.EXPAND_FOOD_STOCK_COMPLETE), timeInfo);
}

function handleNotifyUnlockFoodListInfo(evt : GameEvent, pack : notify_unlock_food_info){
	var unlocked_food_id_list : ArrayList = pack.ids;
	updateUnlockedFoodListInfo(unlocked_food_id_list);
}

function handleNotifyFoodStockInfo(evt : GameEvent, pack : notify_food_stock_info){
	updateCurFoodStockInfo(pack.stock_info);
}

function handleNotifyUnlockFood(evt : GameEvent, pack : notify_unlock_food){
	var food_id : int = pack.id;
	updateSingleUnlockFoodInfo(food_id);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_UNLOCK_FOOD_EVENT), food_id);
}

function handleNotifyExpandFoodStock(evt : GameEvent, pack : notify_expand_food_stock){
	var timeInfo : ExpandStockTimeInfo = new ExpandStockTimeInfo();
	//timeInfo.idx = pack.grid_index;
	timeInfo.food_id = pack.id;
	timeInfo.during_time = pack.due_time;
	updateExpandFoodStockState(timeInfo, false);
	is_at_expanding_stock = true;
	at_expanding_stock_food_id = pack.id;
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.START_EXPAND_FOOD_STOCK), timeInfo);
}

function updateExpandFoodStockState(timeInfo : ExpandStockTimeInfo, cancel : boolean){
	if(barTenderSysTableMgr){
		barTenderSysTableMgr.updateExpandFoodStockState(timeInfo, cancel);
	}
}

function handleNotifyImmediatelyExpandStock(evt : GameEvent, pack : notify_immediately_complete_expand_stock){
	is_at_expanding_stock = false;
	at_expanding_stock_food_id = 0;
	var timeInfo : ExpandStockTimeInfo = new ExpandStockTimeInfo();
	timeInfo.food_id = pack.id;
	timeInfo.during_time = null;
	updateExpandFoodStockState(timeInfo, false);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.EXPAND_FOOD_STOCK_COMPLETE), timeInfo);
}

function reqExpandProduceArea(idx : int){
	var req : req_expand_produce_area = new req_expand_produce_area();
	req.grid_index = idx;
	NetHelper.Send(req);
}

function reqProducts(){
	var req : req_products = new req_products();
	NetHelper.Send(req);
}

function reqProduceArea(){
	var req : req_produce_area = new req_produce_area();
	NetHelper.Send(req);
}

function reqUnlockFood(id : int){
	var req : req_unlock_food = new req_unlock_food();
	req.id = id;
	NetHelper.Send(req);
}

function reqExpandFoodStock(idx :int, food_id : int){
	var req : req_expand_food_stock = new req_expand_food_stock();
	//req.grid_index = idx;
	req.id = food_id;
	NetHelper.Send(req);
}

function reqImmediatelyCompleteExpandStock(id : int){
	var req : req_immediately_complete_expand_stock = new req_immediately_complete_expand_stock();
	req.id = id;
	NetHelper.Send(req);
}

function reqCompleteExpandFoodStock(food_id : int){
	var req : req_complete_expand_food_stock = new req_complete_expand_food_stock();
	req.id = food_id;
	NetHelper.Send(req);
}

function reqFoodStockInfo(){
	var req : req_food_stock_info = new req_food_stock_info();
	NetHelper.Send(req);
}

function reqUnlockFoodInfo(){
	var req : req_unlock_food_info = new req_unlock_food_info();
	NetHelper.Send(req);
}

function HandleClickBartenderBtn(evt : GameEvent, obj : Object){
	//loadTables();
	openBartenderUIRoot();
	NewHandGuideLogic.excuteEvent("OPEN_MAKE_FOOD_UI", null);
}

function reqFoodListCurInfo(){
	//选的方案是：串行申请所有信息，等到所有信息更新完后再更新界面，先请求食物的解锁信息，在这个信息返回后再去请求库存信息和请求升级信息
	//另外的方案：并行方案，同时申请所有信息，根据各条返回的协议去判断界面的状态
	reqUnlockFoodInfo();
}

function updateSingleUnlockFoodInfo(food_id : int){
	if(barTenderSysTableMgr){
		barTenderSysTableMgr.updateSingleUnlockFoodInfo(food_id);
	}
}

function updateUnlockedFoodListInfo(unlocked_food_id_list : ArrayList){
	if(barTenderSysTableMgr){
		barTenderSysTableMgr.updateUnlockedFoodListInfo(unlocked_food_id_list);
	}
	reqFoodStockInfo();
}

function updateCurFoodStockInfo(stock_info_list : ArrayList){
	if(barTenderSysTableMgr){
		barTenderSysTableMgr.updateFoodStockInfos(stock_info_list);
	}
	reqFoodUpgradeInfos();
}

function reqFoodUpgradeInfos(){
	var req : req_food_upgrade_info = new req_food_upgrade_info();
	NetHelper.Send(req);
}

function HandleCloseBartenderUIRoot(evt : GameEvent, obj : Object){
	//client_making_product_info_list.Clear();
	barTenderUI_IsOpened = false;
	for(var i : int=0; i < client_premake_product_info_list.Count; ++ i){
		-- product_area_grid_in_using_num;
	}
	client_premake_product_info_list.Clear();
	if(client_premake_product_info_list.Count == 0 && client_making_product_info_list.Count == 0){
		product_area_grid_in_using_num = 0;
	}
	cur_opened_product_area_grid_num = 0;
	preMakeCostInfo.cost_diamonds = 0;
	preMakeCostInfo.cost_time = 0;
	has_req_product_area = false;
	//is_at_expanding_stock = false;
	clearRuntimeDatas();
	//unLoadTables();
}

function loadTables(){
	barTenderSysTableMgr = new BartenderSysTablesMgr();
	if(barTenderSysTableMgr){
		barTenderSysTableMgr.loadTables();
	}
}

function clearRuntimeDatas(){
	if(barTenderSysTableMgr){
		barTenderSysTableMgr.clearRuntimeDatas();
	}
}

function unLoadTables(){
	if(barTenderSysTableMgr){
		barTenderSysTableMgr.clearTables();
		barTenderSysTableMgr = null;
	}
}

function openBartenderUIRoot(){
	UI.getUI().OpenUIRoot("BartenderUIRoot");
	UI.getUI().SetModal("BartenderUIRoot", true);
	barTenderUI_IsOpened = true;
}

function loadIcon(img_frm : iGUIImage, img_name : String){
	var _asynIcon : AsynIcon = new AsynIcon(function (img : Texture){img_frm.image = img;}, null);
	_asynIcon.load("Icon/" + img_name); 	
}

function reqCompleteProduct(){
	var req : req_complete_product = new req_complete_product();
	NetHelper.Send(req);
}

function handleNotifyCompleteProduct(evt : GameEvent, pack : notify_complete_product){
	-- product_area_grid_in_using_num;
	for(var j1 : int = 0; j1 < client_premake_product_info_list.Count; ++ j1){
		var info0 : ProductInfoStruct = client_premake_product_info_list[j1] as ProductInfoStruct;
		info0.idx -= 1;
	}
	if(client_premake_product_info_list.Count > 0){
		var outside_idx : int = (client_premake_product_info_list[client_premake_product_info_list.Count - 1] as ProductInfoStruct).idx;
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLEAR_OUTSIDE_DATAS), outside_idx);
	}
	if(client_making_product_info_list.Count == 0){
		return;
	}
	var isAdd : boolean = false;
	var remove_food_info : ProductInfoStruct = client_making_product_info_list[0] as ProductInfoStruct;
	client_making_product_info_list.RemoveAt(0);
	//更新数据表
	var productRow : BartenderFoodProductInfoRow = barTenderSysTableMgr.getProductInfoRow(remove_food_info.product_id);
	updateCurStockValue(remove_food_info.food_id, productRow.copies_per_grid);
	updateAtmakingProductVale(remove_food_info.food_id, isAdd);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.COMPLETE_MAKE_ONE_PRODUCT), remove_food_info);
	removeProductEx(remove_food_info.idx);
}

function HandleClickAddShakeBtn(evt : GameEvent, obj : Object){
	var addtoShake_food_id : int = Convert.ToInt32(obj);
	//首先验证是否满足添加条件
	if(checkCanAddtoShake(addtoShake_food_id)){
		++ product_area_grid_in_using_num;
		var isAdd : boolean = true;
		var foodBaseRow : BartenderFoodBaseInfoRow = barTenderSysTableMgr.getFoodBaseInfoRow(addtoShake_food_id);
		var info : ProductInfoStruct = new ProductInfoStruct();
		info.idx = product_area_grid_in_using_num - 1;
		info.food_id = addtoShake_food_id;
		info.product_id = foodBaseRow.upgrade_id;
		var productRow : BartenderFoodProductInfoRow = barTenderSysTableMgr.getProductInfoRow(foodBaseRow.upgrade_id);
		info.shaking_diamond = productRow.shaking_diamond;
		info.shaking_time = productRow.shaking_time;
		//
		var cur_opened_gridNum : int = foodBaseRow.cur_open_gridNum;
		var copies_per_grid : int = productRow.copies_per_grid;
		var cur_total_stocks :int = cur_opened_gridNum * copies_per_grid;
		var cur_remain_stocks : int = foodBaseRow.cur_stock_value;
		//加上准备制作的量
		var premake_total_value : int = foodBaseRow.cur_premake_stock_value;
		//加上正在制作的量
		var atmaking_total_value : int = foodBaseRow.cur_atmaking_stock_value;
		if(cur_total_stocks - (cur_remain_stocks + premake_total_value + atmaking_total_value) >= copies_per_grid){
			info.premake_value = copies_per_grid;
		}
		else{
			info.premake_value = cur_total_stocks - (cur_remain_stocks + premake_total_value + atmaking_total_value);
		}
		updatePremakeStockValue(addtoShake_food_id, info.premake_value, isAdd);
		//添加到准备制作的食物产品列表
		client_premake_product_info_list.Add(info);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.ADD_FOODPRODUCT_TO_PREMAKE), info);
	}
}

function checkCanAddtoShake(food_id : int) : boolean{
	var can : boolean = true;
	//检查库存是否满、检查制做区开放的格子是否满,有其一满则不能
	if(checkStockIsFull(food_id) || checkProductAreaIsFull()){
		can = false;
	}
	
	return can;
}

function checkStockIsFull(food_id : int) : boolean{
	var isFull : boolean = false;
	var foodBaseRow : BartenderFoodBaseInfoRow = barTenderSysTableMgr.getFoodBaseInfoRow(food_id);
	var productRow : BartenderFoodProductInfoRow = barTenderSysTableMgr.getProductInfoRow(foodBaseRow.upgrade_id);
	var cur_opened_gridNum : int = foodBaseRow.cur_open_gridNum;
	var copies_per_grid : int = productRow.copies_per_grid;
	var cur_total_stocks :int = cur_opened_gridNum * copies_per_grid;
	var cur_remain_stocks : int = foodBaseRow.cur_stock_value;
	//加上准备制作的量
	var premake_total_value : int = foodBaseRow.cur_premake_stock_value;
	//加上正在制作的量
	var atmaking_total_value : int = foodBaseRow.cur_atmaking_stock_value;
	if((cur_remain_stocks + premake_total_value + atmaking_total_value) >= cur_total_stocks){
		return true;
	}
}

function checkProductAreaIsFull() : boolean{
	var isFull : boolean = false;
	if(product_area_grid_in_using_num >= cur_opened_product_area_grid_num){
		return true;
	}
}

function reqMakeProduct(){
	if(client_premake_product_info_list.Count == 0)
		return;
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.ENABLE_MAKE_PRODUCT_BTN_EVENT), true);
	
	var req_list : ArrayList = new ArrayList();
	for(var j : int = 0; j < client_premake_product_info_list.Count; ++ j){
		//-- product_area_grid_in_using_num;
		var info : ProductInfoStruct = client_premake_product_info_list[j] as ProductInfoStruct;
		var foodBaseRow : BartenderFoodBaseInfoRow = barTenderSysTableMgr.getFoodBaseInfoRow(info.food_id);
		var productRow : BartenderFoodProductInfoRow = barTenderSysTableMgr.getProductInfoRow(foodBaseRow.upgrade_id);
		var copies : int = productRow.copies_per_grid;
		//
		var productAtom : product_atom = new product_atom();
		productAtom.id = info.food_id;
		productAtom.copies = info.premake_value;
		req_list.Add(productAtom);
	}
	
	var req : req_make_product = new req_make_product();
	req.products = req_list;
	var cur_stime : stime = new stime();
	var cur_sys_time : System.DateTime = SysTimer.getCurTime();
	cur_stime.year = cur_sys_time.Year;
	cur_stime.month = cur_sys_time.Month;
	cur_stime.day = cur_sys_time.Day;
	cur_stime.hour = cur_sys_time.Hour;
	cur_stime.minute = cur_sys_time.Minute;
	cur_stime.second = cur_sys_time.Second;
	req.start_time = cur_stime;
	NetHelper.Send(req);
}

function handleNotifyStartMakeProduct(evt : GameEvent, pack : notify_make_product){
	var make_start_time : stime = pack.start_time;
	var products_list : ArrayList = client_premake_product_info_list;
	var remain_secs : int = 0;
	for(var ji : int = 0; ji < products_list.Count; ++ ji){
		var ji_shaking_time : int = (products_list[ji] as ProductInfoStruct).shaking_time;
		if(ji == 0){
			var passed_secs : int =  Mathf.FloorToInt(Global.subtractStime(SysTimer.getCurTime(), make_start_time).TotalSeconds);
			remain_secs = ji_shaking_time - passed_secs;
		}
		else{
			remain_secs += ji_shaking_time;
		}
	}
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.START_MAKING_PRODUCTS), remain_secs);
	var isAdd : boolean = true;
	for(var j : int = 0; j < products_list.Count; ++ j){
		//++ product_area_grid_in_using_num;
		var pre_make_info : ProductInfoStruct = products_list[j] as ProductInfoStruct;
		pre_make_info.start_time = make_start_time;
		client_making_product_info_list.Add(pre_make_info);
		updateAtmakingProductVale(pre_make_info.food_id, isAdd);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MAKING_PRODUCT_INFO), pre_make_info);
		updatePremakeStockValue(pre_make_info.food_id, pre_make_info.premake_value, !isAdd);
	}
	var isClear : boolean = true;
	calculatePremakeCost(0, false, isClear);
	client_premake_product_info_list.Clear();
}

function removeProduct(user_data : ShakingPanelUserData){
	//找到相应的表格删除相应的数据，重新整理制作区
	//重新计算倒计时
	//改变库存的表现
	-- product_area_grid_in_using_num;
	var isAdd : boolean = false;
	if(user_data.isReadyShake){
		for(var j : int = 0; j < client_premake_product_info_list.Count; ++ j){
			var info : ProductInfoStruct = client_premake_product_info_list[j] as ProductInfoStruct;
			if(info.idx == user_data.idx){
				var pre_make_info : ProductInfoStruct = client_premake_product_info_list[j] as ProductInfoStruct;
				updatePremakeStockValue(user_data.food_id, pre_make_info.premake_value, isAdd);
				client_premake_product_info_list.RemoveAt(j);
				break;
			}
		}
	}
	else if(user_data.isShaking){
		for(var k : int = 0; k < client_making_product_info_list.Count; ++ k){
			var info1 : ProductInfoStruct = client_making_product_info_list[k] as ProductInfoStruct;
			if(info1.idx == user_data.idx){
				client_making_product_info_list.RemoveAt(k);
				break;
			}
		}
		
		var remain_secs : int = 0;
		for(var ji : int = 0; ji < client_making_product_info_list.Count; ++ ji){
			var ji_shaking_time : int = (client_making_product_info_list[ji] as ProductInfoStruct).shaking_time;
			if(user_data.idx != 0 && ji == 0){
				//var passed_secs : int =  Mathf.FloorToInt(Global.subtractStime(SysTimer.getCurTime(), SysTimer.getCurTime()).TotalSeconds);
				//remain_secs = ji_shaking_time - passed_secs;
				remain_secs = iGUICode_BartenderUI.getInstance().getFirstShakingRemainTime();
			}
			else{
				remain_secs += ji_shaking_time;
			}
		}
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.START_MAKING_PRODUCTS), remain_secs);
		//
		updateAtmakingProductVale(user_data.food_id, isAdd);
		reqRemoveProduct(user_data.idx);
	}
	for(var j1 : int = 0; j1 < client_premake_product_info_list.Count; ++ j1){
		var info0 : ProductInfoStruct = client_premake_product_info_list[j1] as ProductInfoStruct;
		if(info0.idx > user_data.idx){
			info0.idx -= 1;
		}
	}
}

function removeProductEx(idx : int){
	//
	if(client_making_product_info_list.Count == 0){
		//制作列表中的产品已经全部制作完成
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.COMPLETE_MAKE_PRODUCTS_LIST));
	}
	
	var cur_stime : stime = new stime();
	var cur_sys_time : System.DateTime = SysTimer.getCurTime();
	cur_stime.year = cur_sys_time.Year;
	cur_stime.month = cur_sys_time.Month;
	cur_stime.day = cur_sys_time.Day;
	cur_stime.hour = cur_sys_time.Hour;
	cur_stime.minute = cur_sys_time.Minute;
	cur_stime.second = cur_sys_time.Second;
	for(var i : int = 0; i < client_making_product_info_list.Count; ++ i){
		var info2 : ProductInfoStruct = client_making_product_info_list[i] as ProductInfoStruct;
		info2.idx = i;
		if(idx == 0)
			info2.start_time = cur_stime;
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MAKING_PRODUCT_INFO), info2);
	}
	
	//
	if(client_premake_product_info_list.Count == 0){
		
		return;
	}
	for(var l : int = 0; l < client_premake_product_info_list.Count; ++ l){
		var info3 : ProductInfoStruct = client_premake_product_info_list[l] as ProductInfoStruct;
		if(info3.idx > idx -1){
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.ADD_FOODPRODUCT_TO_PREMAKE), info3);
		}
	}
}

function reqRemoveProduct(pos : int){
	var req : req_remove_product = new req_remove_product();
	req.position = pos;
	NetHelper.Send(req);
}

function updatePremakeStockValue(food_id : int, dvalue : int, isAdd : boolean){
	if(barTenderSysTableMgr){
		barTenderSysTableMgr.updatePremakeStockValue(food_id, dvalue, isAdd);
	}
	calculatePremakeCost(food_id, isAdd, false);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.PREMAKE_STOCK_CHANGED));
}

function calculatePremakeCost(food_id : int, isAdd : boolean, isClear : boolean){
	if(food_id > 0){
		var baseInfoRow : BartenderFoodBaseInfoRow = barTenderSysTableMgr.getFoodBaseInfoRow(food_id);
		var productInfoRow : BartenderFoodProductInfoRow = barTenderSysTableMgr.getProductInfoRow(baseInfoRow.upgrade_id);
		var cost_diamond : int = productInfoRow.shaking_diamond;
		var cost_time : int = productInfoRow.shaking_time;
		if(isAdd){
			preMakeCostInfo.cost_diamonds += cost_diamond;
			preMakeCostInfo.cost_time += cost_time;
		}
		else{
			preMakeCostInfo.cost_diamonds -= cost_diamond;
			preMakeCostInfo.cost_time -= cost_time;
		}
	}
	if(isClear){
		preMakeCostInfo.cost_diamonds = 0;
		preMakeCostInfo.cost_time = 0;
	}
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.PREMAKE_COST_VALUE_CHANGED), preMakeCostInfo);
}

function updateAtmakingProductVale(atmaking_food_id : int, isAdd : boolean){
	if(barTenderSysTableMgr){
		barTenderSysTableMgr.updateAtmakingProductVale(atmaking_food_id, isAdd);
	}
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.ADMAKING_PRODUCT_VALUE_CHANGED));
}

function updateCurStockValue(food_id : int, dvalue : int){
	if(barTenderSysTableMgr){
		barTenderSysTableMgr.updateCurStockValue(food_id, dvalue);
	}
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CUR_STOCK_VALUE_CHANGED));
}

function getInStockFoodList() : ArrayList{
	if(barTenderSysTableMgr){
		return barTenderSysTableMgr.getInStockFoodList();
	}
	return null;
} 
// 获取某种食物的当前库存量
function getUnlockedFoodStockValue(food_id : int) : int {
	if(barTenderSysTableMgr){
		return barTenderSysTableMgr.getFoodBaseInfoRow(food_id).cur_stock_value;
	}
	return 0;
}

function foodIsInStock(food_id : int) : boolean {
	if(barTenderSysTableMgr){
		return barTenderSysTableMgr.foodIsInStock(food_id);
	}
	return false;
}

function reqCancelExpandFoodStock(food_id : int){
	destroyExpandStockTimer();
	var req : req_cancel_expand_food_stock = new req_cancel_expand_food_stock();
	req.id = food_id;
	NetHelper.Send(req);
}

function handleNotifyCancelExpandFoodStock(evt : GameEvent, pack : notify_cancel_expand_food_stock){
	is_at_expanding_stock = false;
	at_expanding_stock_food_id = 0;
	var timeInfo : ExpandStockTimeInfo = new ExpandStockTimeInfo();
	timeInfo.food_id = pack.id;
	timeInfo.during_time = null;
	updateExpandFoodStockState(timeInfo, true);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.EXPAND_FOOD_STOCK_CANCEL), timeInfo);
}

function reqImmediateCompleteAllProduct(){
	var req : req_immediately_complete_product = new req_immediately_complete_product();
	NetHelper.Send(req);
}

function immediateCompleteAllProduct(){
	var need_love_coin : int = 0;
	for(var i : int = 0; i < client_making_product_info_list.Count; ++ i){
		var info : ProductInfoStruct = client_making_product_info_list[i] as ProductInfoStruct;
		var productRow : BartenderFoodProductInfoRow = barTenderSysTableMgr.getProductInfoRow(info.product_id);
		need_love_coin += productRow.love_coin;
	}
	var params : ArrayList = new ArrayList();
	params.Add(need_love_coin);
	Global.GetSysMsgHandler().ShowSysMsg(5141,params);
}

static function confirmImmediateCompleteCallback(caller : iGUIElement){
	BartenderSys.getInstance().reqImmediateCompleteAllProduct();
}

static function cancelCallback(caller : iGUIElement){
	
}

function handleNotifyImmediateCompleteProduct(evt : GameEvent, pack : notify_immediately_complete_product){
	product_area_grid_in_using_num -= client_making_product_info_list.Count;
	for(var info : ProductInfoStruct in client_making_product_info_list){
		var isAdd : boolean = false;
		//更新数据表
		var productRow : BartenderFoodProductInfoRow = barTenderSysTableMgr.getProductInfoRow(info.product_id);
		updateCurStockValue(info.food_id, productRow.copies_per_grid);
		updateAtmakingProductVale(info.food_id, isAdd);
		for(var j1 : int = 0; j1 < client_premake_product_info_list.Count; ++ j1){
			var info0 : ProductInfoStruct = client_premake_product_info_list[j1] as ProductInfoStruct;
			info0.idx -= 1;
		}
	}
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.IMMEDIATE_COMPLETE_PRODUCTS));
	client_making_product_info_list.Clear();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.COMPLETE_MAKE_PRODUCTS_LIST));
	for(var l : int = 0; l < client_premake_product_info_list.Count; ++ l){
		var info3 : ProductInfoStruct = client_premake_product_info_list[l] as ProductInfoStruct;
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.ADD_FOODPRODUCT_TO_PREMAKE), info3);
	}
}

public function getUnlockedFoodNum() : int{
	if(barTenderSysTableMgr)
		return barTenderSysTableMgr.getUnlockedFoodNum();
	
	return 0;
}

public function getCurMakingProductCount(){
	return client_making_product_info_list.Count;
}

public function reqAddMakeProduct(){
	if(client_premake_product_info_list.Count == 0)
		return;
	
	var req_list : ArrayList = new ArrayList();
	
	for(var j : int = 0; j < client_premake_product_info_list.Count; ++ j){
		var info : ProductInfoStruct = client_premake_product_info_list[j] as ProductInfoStruct;
		var foodBaseRow : BartenderFoodBaseInfoRow = barTenderSysTableMgr.getFoodBaseInfoRow(info.food_id);
		var productRow : BartenderFoodProductInfoRow = barTenderSysTableMgr.getProductInfoRow(foodBaseRow.upgrade_id);
		var copies : int = productRow.copies_per_grid;
		//
		var productAtom : product_atom = new product_atom();
		productAtom.id = info.food_id;
		productAtom.copies = info.premake_value;
		req_list.Add(productAtom);
	}
	
	var req : req_make_product = new req_make_product();
	req.products = req_list;
	NetHelper.Send(req);
}

function HandleMakingProductInfo(evt : GameEvent, obj : Object){
	var clientProductInfo : ProductInfoStruct = obj as ProductInfoStruct;
	if(clientProductInfo.idx == 0){
		var tmp_time : System.DateTime = SysTimer.getCurTime();
		var passed_secs : int =  Mathf.FloorToInt(Global.subtractStime(tmp_time, clientProductInfo.start_time).TotalSeconds);
		remainMakingSeconds = clientProductInfo.shaking_time - passed_secs;
		destroyMakingProductsTimer();
		startMakingProductsTimer(remainMakingSeconds);
	}
}

function startMakingProductsTimer(remain_secs : int){
	if(remain_secs > 0){
		makingProductsTimer = new Timer(1000, remain_secs);
		makingProductsTimer.addEventListener(TimerEvent.TIMER, triggerOnShakingTimer);
		makingProductsTimer.addEventListener(TimerEvent.TIMER_COMPLETE, handleCompleteShakingTimer);
		makingProductsTimer.Start();
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MAKING_PRODUCTS_TIMERSTART), remain_secs);
	}
	else{
		handleCompleteShakingTimer(null, null);
	}
}

function triggerOnShakingTimer(_timer : Timer, obj : Object){
	-- remainMakingSeconds;
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MAKING_PRODUCTS_ONTIMER), remainMakingSeconds);
}

function handleCompleteShakingTimer(_timer : Timer, obj : Object){
	remainMakingSeconds = 0;
	reqCompleteProduct();
	destroyMakingProductsTimer();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MAKING_PRODUCTS_TIMERCOMPLETE));
}

function destroyMakingProductsTimer(){
	if(makingProductsTimer){
		makingProductsTimer.removeEventListener(TimerEvent.TIMER);
		makingProductsTimer.removeEventListener(TimerEvent.TIMER_COMPLETE);
		makingProductsTimer.Stop();
		makingProductsTimer = null;
	}
}

function HandleCompleteMakeOneProduct(evt : GameEvent, obj : Object){
	destroyMakingProductsTimer();
}

function HandleStopMakingProductTimer(evt : GameEvent, obj : Object){
	destroyMakingProductsTimer();
}

function handleImmediateCompleteProducts(evt : GameEvent, obj : Object){
	destroyMakingProductsTimer();
}

function getFoodListCount() : int{
	if(barTenderSysTableMgr)
		return barTenderSysTableMgr.getFoodListCount();
	
	return 0;
}

function hasAllFoodsUnlocked() : boolean{
	var opened_food_num : int = getUnlockedFoodNum();
	var food_list_num : int = getFoodListCount();
	return (opened_food_num >= food_list_num) ? true : false;
}

function handleNotifyFoodUpgradeInfo(evt : GameEvent, pack : notify_food_upgrade_info){
	updateFoodUpgradeInfos(pack.upgrade_info);
}

function updateFoodUpgradeInfos(upgrade_list : ArrayList){
	if(barTenderSysTableMgr){
		barTenderSysTableMgr.updateFoodUpgradeInfos(upgrade_list);
	}
	//通知所有信息已经更新完
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.REFRESH_FOOD_ALL_INFOS_SUCC));
}

function reqUpgradeFood(food_id : int){
	var req : req_upgrade_food = new req_upgrade_food();
	req.id = food_id;
	NetHelper.Send(req);
}

function handleNotifyUpgradeFood(evt : GameEvent, pack : notify_upgrade_food){
	updateSingleFoodUpgradeInfo(pack);
}

function updateSingleFoodUpgradeInfo(pack : notify_upgrade_food){
	if(barTenderSysTableMgr){
		barTenderSysTableMgr.updateSingleFoodUpgradeInfo(pack);
	}
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.FOOD_UPGRADE_SUCCESS), pack.id);
}

function HandleStartCompleteFoodTipTimer(evt : GameEvent, obj : Object){
	startCompleteTipTimer();
}

function startCompleteTipTimer(){
	destroyCompleteTipTimer();
	if(null == mCompleteTipTimer){
		mCompleteTipTimer = new Timer(1000, completeMakeFoodTipCount); //定义一个间隔1000毫秒，运行3次的Timer
		mCompleteTipTimer.addEventListener(TimerEvent.TIMER, triggerOnTipTimer);
		mCompleteTipTimer.addEventListener(TimerEvent.TIMER_COMPLETE, handleCompleteTipTimer);
		mCompleteTipTimer.Start();
	}
}

function triggerOnTipTimer(_timer : Timer, obj : Object){
	
}

function handleCompleteTipTimer(_timer : Timer, obj : Object){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.COMPLITE_MAKE_FOOD_TIP_TIMER));
	destroyCompleteTipTimer();
}

function destroyCompleteTipTimer(){
	if(mCompleteTipTimer){
		mCompleteTipTimer.removeEventListener(TimerEvent.TIMER);
		mCompleteTipTimer.removeEventListener(TimerEvent.TIMER_COMPLETE);
		mCompleteTipTimer.Stop();
		mCompleteTipTimer = null;
	}
}

function HandleStartExpandFoodStock(evt : GameEvent, obj : Object){
	var timeInfo : ExpandStockTimeInfo = obj as ExpandStockTimeInfo;
		var remain_sec : int =  Mathf.FloorToInt(Global.subtractStime(timeInfo.during_time, SysTimer.getCurTime()).TotalSeconds);
		remain_sec -= 1;
		startExpandStockTimer(remain_sec, timeInfo);
}

function startExpandStockTimer(total_cnt : int, timeInfo : ExpandStockTimeInfo){
	destroyExpandStockTimer();
	mExpandStockTimerTotalSeconds = total_cnt;
	mExpandStockTimer = new Timer(1000, mExpandStockTimerTotalSeconds, timeInfo);
	mExpandStockTimer.addEventListener(TimerEvent.TIMER, triggerExpandStockTimerCountDown);
	mExpandStockTimer.addEventListener(TimerEvent.TIMER_COMPLETE, handleExpandStockTimerComplete);
	mExpandStockTimer.Start();
}

function triggerExpandStockTimerCountDown(_timer : Timer, obj : Object){
	-- mExpandStockTimerTotalSeconds;
	var timeInfo : ExpandStockTimeInfo = obj as ExpandStockTimeInfo;
	timeInfo.remainSecs = mExpandStockTimerTotalSeconds;
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.EXPAND_STOCK_ONTIMER), timeInfo);
}

function handleExpandStockTimerComplete(_timer : Timer, obj : Object){
	var timeInfo : ExpandStockTimeInfo = obj as ExpandStockTimeInfo;
	reqCompleteExpandFoodStock(timeInfo.food_id);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.EXPAND_STOCK_TIMERCOMPLETE), timeInfo);
	destroyExpandStockTimer();

}

function destroyExpandStockTimer(){
	if(mExpandStockTimer){
		mExpandStockTimer.removeEventListener(TimerEvent.TIMER);
		mExpandStockTimer.removeEventListener(TimerEvent.TIMER_COMPLETE);
		mExpandStockTimer.Stop();
		mExpandStockTimerTotalSeconds = 0;
		mExpandStockTimer = null;
	}
}

function HandleCompleteExpandFoodStock(evt : GameEvent, obj : Object){
	var timeInfo : ExpandStockTimeInfo = obj as ExpandStockTimeInfo;
	destroyExpandStockTimer();
	if(barTenderUI_IsOpened){
		openCompleteExpandStockTipUI(timeInfo.food_id);
	}
	else{
		cacheCompleteExpandStockTipInfo(timeInfo.food_id);
	}
}

function cacheCompleteExpandStockTipInfo(food_id : int){
	curCompleteExpandStockFoodID = food_id;
}

function openCompleteExpandStockTipUI(food_id : int){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.OPEN_COMPLETE_EXPAND_TIP), food_id);
}

function HandleCloseCompletExpandTip(evt : GameEvent, obj : Object){
	curCompleteExpandStockFoodID = 0;
}

function handleNotifyOfflineCompleteExpandStockMsg(evt : GameEvent, pack : notify_settlement_expand_food_stock){
	var food_id : int = pack.id;
	cacheCompleteExpandStockTipInfo(food_id);
}