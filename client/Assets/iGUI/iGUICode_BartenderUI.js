import iGUI;

private static var instance : iGUICode_BartenderUI;
private var mBartenderTablesMgr : BartenderSysTablesMgr = null;
static var shaking_grid_created_num : int = 0;
static var foodReservesItemCreatedNum : int = 0;
static var curPageFoodReservesItemTNum : int = 0;
static var curPageFoodReservesInfoRefreshedNum : int = 0;
static var curPageFoodReservesInfoInitNum : int = 0;
static var curPageFoodReservesInfoRefreshedTotalNum : int = 0;
private var makingTimer : Timer = null;
private var makingRemainSeconds : int = 0;
var max_produce_area_num : int;

// alter by zlj
private	var heartIcon_W   : float;
private	var heartIcon_H   : float;
private var fullHeartStr  : String;
private var emptyHeartStr : String;

function Awake(){
	instance=this;
	registLocalEvent();
}

function Start(){
   startPosX      = 0;
   startPosY      = 0; 
   ColNumCurPage  = 4;
   numCurPage     = 12;
   intervalWidth  = 20;
   intervalHeight = 15;
   itemWidth      = 180;
   itemHeight     = 110;
   // alter by zlj
   heartIcon_W   = 18.0;
   heartIcon_H   = 24.0;
   fullHeartStr  = "UISkins/Textures/cookbook/heart_full";
   emptyHeartStr = "UISkins/Textures/cookbook/heart_empty";
   
   mBartenderTablesMgr = BartenderSys.getInstance().getBartenderSysTableMgr();
   registCtrlsCallback();
   enableMakingTimerCtrlsShow(false);
   createFoodReservesFristPageList(mBartenderTablesMgr.getFoodBaseInfoTable());
   if(BartenderSys.getInstance().getCurMakingProductCount() == 0){
   		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.ENABLE_MAKE_PRODUCT_BTN_EVENT), false);
   }
   else{
   		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.ENABLE_MAKE_PRODUCT_BTN_EVENT), true);
   }
}

static function getInstance(){
	return instance;
}

@HideInInspector
var completeUpgradeTipLbl : iGUILabel;
@HideInInspector
var completeUpgradeGridContainer : iGUIContainer;
@HideInInspector
var completeUpgradeFoodImg : iGUIImage;
@HideInInspector
var closecompeteUpgradeFoodTipPanelBtn : iGUIButton;
@HideInInspector
var completeUpgradeFoodTipPanel : iGUIPanel;

@HideInInspector
var completeExpandTipLbl : iGUILabel;
@HideInInspector
var completeExpandGridContainer : iGUIContainer;
@HideInInspector
var completeExpandFoodImg : iGUIImage;
@HideInInspector
var closecompeteExpandStockTipPanelBtn : iGUIButton;
@HideInInspector
var completeExpandStockTipPanel : iGUIPanel;
@HideInInspector
var immediateCompleteMakingBtn : iGUIButton;
@HideInInspector
var makingRemainTimeLbl : iGUILabel;
@HideInInspector
var label8 : iGUILabel;
@HideInInspector
var costTimeLbl : iGUILabel;
@HideInInspector
var costDiamodsLbl : iGUILabel;
@HideInInspector
var label7 : iGUILabel;
@HideInInspector
var label6 : iGUILabel;
@HideInInspector
var label5 : iGUILabel;
@HideInInspector
var label4 : iGUILabel;
@HideInInspector
var expandGridContainer : iGUIContainer;
@HideInInspector
var expandFoddImg : iGUIImage;
@HideInInspector
var expandTimeLbl : iGUILabel;
@HideInInspector
var expandDiamondLbl : iGUILabel;
@HideInInspector
var image1 : iGUIImage;
@HideInInspector
var label3 : iGUILabel;
@HideInInspector
var label2 : iGUILabel;
@HideInInspector
var expandBtn : iGUIButton;
@HideInInspector
var panel1 : iGUIPanel;
@HideInInspector
var label1 : iGUILabel;
@HideInInspector
var closeExpandStockPanelBtn : iGUIButton;
@HideInInspector
var expandStockConfirmPanel : iGUIPanel;
@HideInInspector
var startShakeBtn : iGUIButton;
@HideInInspector
var shakingContainer : iGUIContainer;
@HideInInspector
var pageNumLbl : iGUILabel;
@HideInInspector
var nextPageBtn : iGUIButton;
@HideInInspector
var prePageBtn : iGUIButton;
@HideInInspector
var foodReservesItemContainer : iGUIContainer;
@HideInInspector
var closePanelBtn : iGUIButton;
@HideInInspector
var barTenderPanel : iGUIPanel;
@HideInInspector
var bartenderUIRoot : iGUIRoot;

function registCtrlsCallback(){
	immediateCompleteMakingBtn.clickCallback = ClickCallback_immediateCompleteMakingBtn;
	closePanelBtn.clickCallback = ClickCallback_closePanelBtn;
	startShakeBtn.clickCallback = Clickcallback_startShakeBtn;
	prePageBtn.clickCallback  = ClickCallback_prePageBtn;
    nextPageBtn.clickCallback = Clickcallback_nextPageBtn;
    expandBtn.clickCallback = ClickCallback_expandBtn;
    closeExpandStockPanelBtn.clickCallback = ClickCallback_closeExpandStockPanelBtn;
    closecompeteExpandStockTipPanelBtn.clickCallback = ClickCallback_closecompeteExpandStockTipPanelBtn;
    closecompeteUpgradeFoodTipPanelBtn.clickCallback = ClickCallback_closecompeteUpgradeFoodTipPanelBtn;
}

function registLocalEvent(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.OPEN_COMPLETE_EXPAND_TIP), handleOpenCompleteExpandTip);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.IMMEDIATE_COMPLETE_PRODUCTS), handleImmediateCompleteProducts);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.COMPLETE_MAKE_PRODUCTS_LIST), handleCompleteMakingProducts);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.START_MAKING_PRODUCTS), handleStartMakingProducts);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.PREMAKE_COST_VALUE_CHANGED), handlePremakeCostValueChanged);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.REMOVE_PRODUCT), HandleRemoveProduct);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.COMPLETE_MAKE_PRODUCTS_LIST), HandleCompleteMakeProductsList);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.ENABLE_MAKE_PRODUCT_BTN_EVENT), HandleEnableMakeProductBtnEvent);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_EXPAND_PRODUCE_AREA), HandleNotifyExpandProduceArea);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_PRODUCE_AREA), HandleNotifyProduceArea);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.POPUP_REQ_EXPANDSTOCK_CONFIRM_UI), HandlePopupReqExpandStockConfirmUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.REFRESH_FOOD_ALL_INFOS_SUCC), HandleRefreshFoodAllInfosSucces);
   	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.BARTENDERUI_SHOW_PAGE_CHANGE), HandleShowPageChange);
   	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.FOOD_UPGRADE_SUCCESS), HandleOpenUpdataFoodSucTip); // 食物升级成功提示信息
} 

function unRegistLocalEvent(){
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.OPEN_COMPLETE_EXPAND_TIP), handleOpenCompleteExpandTip);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.IMMEDIATE_COMPLETE_PRODUCTS), handleImmediateCompleteProducts);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.COMPLETE_MAKE_PRODUCTS_LIST), handleCompleteMakingProducts);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.START_MAKING_PRODUCTS), handleStartMakingProducts);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.PREMAKE_COST_VALUE_CHANGED), handlePremakeCostValueChanged);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.REMOVE_PRODUCT), HandleRemoveProduct);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.COMPLETE_MAKE_PRODUCTS_LIST), HandleCompleteMakeProductsList);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.ENABLE_MAKE_PRODUCT_BTN_EVENT), HandleEnableMakeProductBtnEvent);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_EXPAND_PRODUCE_AREA), HandleNotifyExpandProduceArea);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_PRODUCE_AREA), HandleNotifyProduceArea);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.POPUP_REQ_EXPANDSTOCK_CONFIRM_UI), HandlePopupReqExpandStockConfirmUI);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.REFRESH_FOOD_ALL_INFOS_SUCC), HandleRefreshFoodAllInfosSucces);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.BARTENDERUI_SHOW_PAGE_CHANGE), HandleShowPageChange);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.FOOD_UPGRADE_SUCCESS), HandleOpenUpdataFoodSucTip); 
}

function destroyFoodReservesItemCtrls(){
	var food_info_list_cnt : int = foodReservesItemContainer.itemCount;
	if(food_info_list_cnt == 0){
		return;
	}
	
	for(var j : int = 0; j < food_info_list_cnt; ++ j){
		var food_item_script_comp : iGUISmartPrefab_foodReservesItem = 
			foodReservesItemContainer.items[j].GetComponent("iGUISmartPrefab_foodReservesItem") as iGUISmartPrefab_foodReservesItem;
			if(food_item_script_comp){
				food_item_script_comp.destroy();
			}
	}
}

function destroy(){
	mBartenderTablesMgr = null;
	shaking_grid_created_num = 0;
	foodReservesItemCreatedNum = 0;
	curPageFoodReservesItemTNum = 0;
	destroyMakingTimer();
	curPageFoodReservesInfoRefreshedNum = 0;
	curPageFoodReservesInfoInitNum = 0;
	curPageFoodReservesInfoRefreshedTotalNum = 0;
	destroyFoodReservesItemCtrls();
	destroyProduceAreaCtrls();
	unRegistLocalEvent();
}

function destroyMakingTimer(){
	makingRemainSeconds = 0;
	if(makingTimer){
		makingTimer.removeEventListener(TimerEvent.TIMER);
		makingTimer.removeEventListener(TimerEvent.TIMER_COMPLETE);
		makingTimer.Stop();
		makingTimer = null;
	}
}

function ClickCallback_closePanelBtn(caller : iGUIElement){
	destroy();
	closeUIRoot();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLOSE_BARTENDERUIROOT));
}

function closeUIRoot(){
	UI.getUI().SetModal("BartenderUIRoot", false);
	UI.getUI().CloseUIRoot("BartenderUIRoot");
}

public var intervalWidth  : int;
public var intervalHeight : int;

public var itemWidth  : int;
public var itemHeight : int;
public var startPosX  : float;
public var startPosY  : float;
public var numCurPage : int;
private var ColNumCurPage : float;
var bartenderPageMgr : PagerMgr = null;



public function ClickCallback_prePageBtn(caller : iGUIElement)
{
	if(!bartenderPageMgr || bartenderPageMgr.GetPageIndex() == 1)
    {
       return;
    }
	var list : ArrayList = bartenderPageMgr.PrevPage();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.BARTENDERUI_SHOW_PAGE_CHANGE), list);
}


public function Clickcallback_nextPageBtn(caller : iGUIElement)
{
    if(!bartenderPageMgr || bartenderPageMgr.GetPageIndex() == GetTotalPageNum())
    {
       return;
    }
    var list : ArrayList = bartenderPageMgr.NextPage();
    EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.BARTENDERUI_SHOW_PAGE_CHANGE), list);
}

function createFoodReservesFristPageList(food_list : ArrayList){
	bartenderPageMgr  = new PagerMgr(food_list, numCurPage);
    var show_list : ArrayList = bartenderPageMgr.CurrPage();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.BARTENDERUI_SHOW_PAGE_CHANGE), show_list);
}

public function handlePageChanged(list : ArrayList)
{
    createFoodReservesPageList(list);
}


public function createFoodReservesPageList(list : ArrayList)
{
    if(!bartenderPageMgr)
    {
      return;
    }
    
    destroyFoodReservesItemCtrls();
	foodReservesItemContainer.removeAll(); 
   
	var posX  : float;
	var posY  : float;
	var index : int = 0;
	// 每页的总行数
    var totalRowNum : int = System.Math.Ceiling(numCurPage/ColNumCurPage);
    for(var row : int = 1; row <= totalRowNum; ++row)
    {
        for(var col : int = 1; col <= ColNumCurPage; ++ col)
        {
            posX = startPosX + (col - 1) * (intervalWidth + itemWidth);
            posY = startPosY + (row - 1) * (intervalHeight + itemHeight);
            if((row * col - 1) < list.Count)
            {
				var foodBaseInfo : BartenderFoodBaseInfoRow = list[index] as BartenderFoodBaseInfoRow;
				createFoodReservesItem(index, foodBaseInfo, posX, posY);
				++index;
            }
        }
    }
}


public function createFoodReservesItem(i : int, food_info : BartenderFoodBaseInfoRow, posX : float, posY : float)
{
	var barFood_item : iGUIPanel = foodReservesItemContainer.addSmartObject("foodReservesItem") as iGUIPanel;
	if(i < 10){
		barFood_item.name = "0" + i.ToString() + "-foodReservesItem";
	}
	else{
		barFood_item.name = i.ToString() + "-foodReservesItem";
	}
	barFood_item.userData = food_info.food_id;
	
	barFood_item.setX(posX);
	barFood_item.setY(posY);
}

public function GetTotalPageNum() : int
{
  if(bartenderPageMgr)
  {
     var totalPageNum : int = bartenderPageMgr.GetTotalPage();
     return totalPageNum;
  }
  
  return 1;
}

public function GetFoodInfoByIndex(index : int) : BartenderFoodBaseInfoRow
{
	var curPage : ArrayList = bartenderPageMgr.CurrPage();
	if (index < 0 || index >= curPage.Count)
		throw "iGUICode_BartenderUI -> GetFoodInfoByIndex(int) -> index["+index+"] out of range[0, "+curPage.Count+"].";
	
	return curPage[index];
}

public function HandleShowPageChange(evt : GameEvent, obj : Object)
{  
	var list : ArrayList = obj as ArrayList;
	curPageFoodReservesItemTNum = list.Count;
	curPageFoodReservesInfoRefreshedTotalNum = list.Count;
	foodReservesItemCreatedNum = 0;
	curPageFoodReservesInfoRefreshedNum = 0;
	curPageFoodReservesInfoInitNum = 0;
	
   	handlePageChanged(list);
   //	foodReservesItemContainer.setEnabled(false);
   	//refreshCurFoodListInfo();
	setPageNum();
}

function setPageNum(){
	var curPageNum = bartenderPageMgr.GetPageIndex();
    var labelText : String = curPageNum.ToString() + "/" + GetTotalPageNum().ToString();
    pageNumLbl.label.text = labelText;
}

function HandleRefreshFoodAllInfosSucces(evt : GameEvent, obj : Object){
	if(BartenderSys.curCompleteExpandStockFoodID != 0){
   		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.OPEN_COMPLETE_EXPAND_TIP), BartenderSys.curCompleteExpandStockFoodID);
   }
}

function HandlePopupReqExpandStockConfirmUI(evt : GameEvent, obj : Object){
	var expand_info : StockItemInitInfoClass = obj as StockItemInitInfoClass;
	var expand_idx : int = expand_info.idx;
	var expand_food_id : int = expand_info.food_id;
	var foodBaseInfoRow : BartenderFoodBaseInfoRow = mBartenderTablesMgr.getFoodBaseInfoRow(expand_food_id);
	var productInfoRow : BartenderFoodProductInfoRow = mBartenderTablesMgr.getProductInfoRow(foodBaseInfoRow.upgrade_id);
	var food_icon : String = productInfoRow.icon;
	var diamond : int = foodBaseInfoRow.expand_stock_diamonds[expand_idx];
	var expand_time : int = foodBaseInfoRow.expand_stock_times[expand_idx];
	var cur_open_gridNum : int = foodBaseInfoRow.min_stock;
	var max_grid_num : int = foodBaseInfoRow.max_stock;
	if(foodBaseInfoRow.min_stock < foodBaseInfoRow.cur_open_gridNum){
		cur_open_gridNum = foodBaseInfoRow.cur_open_gridNum;
	}
	
	expandStockConfirmPanel.setEnabled(true);
	barTenderPanel.passive = true;
	loadFoodIcon(expandFoddImg, food_icon);
	expandDiamondLbl.label.text = diamond.ToString();
	//
	var expand_format_time : RemainTimeStruct = PhyPowerMgr.CalculateRemainTime(expand_time, true);
	var show_format_time : String = "";
	if(expand_format_time.day != "0"){
		show_format_time += expand_format_time.day + "天";
	}
	if(expand_format_time.hour != "0"){
		show_format_time += expand_format_time.hour + "小时";
	}
	if(expand_format_time.min != "0"){
		show_format_time += expand_format_time.min + "分";
	}
	if(expand_format_time.sec != "0"){
		show_format_time += expand_format_time.sec + "秒";
	}
	//
	expandTimeLbl.label.text = show_format_time;
	var data : ReqExpandStockNeedData = new ReqExpandStockNeedData();
	data.idx = expand_idx;
	data.food_id = expand_food_id;
	expandBtn.userData = data;
	createExpandStockConfirmUIGridList(expand_food_id, cur_open_gridNum, max_grid_num);
}

function ClickCallback_closeExpandStockPanelBtn(caller : iGUIElement){
	closeExpandStockConfirmPanel();
	NewHandGuideLogic.excuteEvent("CLOSE_EXPAND_STOCK_CONFIRM_PANEL", null);
}

function closeExpandStockConfirmPanel(){
	expandStockConfirmPanel.setEnabled(false);
	barTenderPanel.passive = false;
}

function loadFoodIcon(img_frm : iGUIImage, img_name : String){
	 BartenderSys.getInstance().loadIcon(img_frm, img_name);
}

function createExpandStockConfirmUIGridList(food_id : int, cur_open_gridNum : int, max_grid_num : int){
	var cur_openTo_grid_idx : int = cur_open_gridNum - 1;
	expandGridContainer.removeAll();
	for(var j : int = 0; j < max_grid_num; ++ j){
		var grid_w : float = 19;
		var grid_h : float = 17;
		var grid_space : float = 2;
		var posx : float = (grid_w + grid_space) * j;
		var posy : float = 0;
		var is_opened : boolean = false;
		if(j <= cur_openTo_grid_idx){
			is_opened = true;
		}
		var isOpenedNextGrid : boolean = false;
		if(j == cur_openTo_grid_idx + 1){
			isOpenedNextGrid = true;
		}
		createFoodStockGrid(is_opened, isOpenedNextGrid, posx, posy, grid_w, grid_h);
	}
}

function createFoodStockGrid(is_opened : boolean, isOpenedNextGrid : boolean, posx : float, posy : float, grid_w : float, grid_h : float){
/*
	var stockContainer : iGUIContainer = expandGridContainer.addSmartObject("stockInfoItemContainer") as iGUIContainer;
	stockContainer.userData = initInfo;
	stockContainer.setX(posx);
	stockContainer.setY(posy);
*/
	var grid : iGUIImage = expandGridContainer.addElement("iGUIImage") as iGUIImage;
	grid.setX(posx);
	grid.setY(posy);
	grid.setWidth(grid_w);
	grid.setHeight(grid_h);
	if(is_opened){
		grid.image = Resources.Load("UISkins/Textures/cookbook/heart_yellow");
	}
	else{
		if(isOpenedNextGrid)
			grid.image = Resources.Load("UISkins/Textures/cookbook/heart_red");
		else
			grid.image = Resources.Load("UISkins/Textures/cookbook/heart_gray");
	}
}

function ClickCallback_expandBtn(caller : iGUIElement){
	var data : ReqExpandStockNeedData = caller.userData as ReqExpandStockNeedData;
	var expand_food_id : int = data.food_id;
	var idx : int = data.idx;
	reqExpandFoodStock(idx, expand_food_id);
	closeExpandStockConfirmPanel();
}

function reqExpandFoodStock(idx : int, food_id : int){
	if(food_id > 0)
		BartenderSys.getInstance().reqExpandFoodStock(idx, food_id);
}

function HandleNotifyProduceArea(evt : GameEvent, obj : Object){
	var area_num : int = Convert.ToInt32(obj);
	createProduceAreaList(area_num);
}

function createProduceAreaList(cur_open_num : int){
	var cur_opened_idx : int = cur_open_num - 1;
	destroyProduceAreaCtrls();
	shakingContainer.removeAll();
	for(var j : int = 0; j < max_produce_area_num; ++ j){
		var grid_w : float = 56;
		var grid_h : float = 56;
		var grid_space : float = 4;
		var posx : float = (grid_w + grid_space) * j;
		var posy : float = 0;
		var userData : ShakingPanelUserData = new ShakingPanelUserData();
		userData.idx = j;
		userData.max_num = max_produce_area_num;
		if(j <= cur_opened_idx){
			userData.isOpened = true;
		}
		else{
			userData.isOpened = false;
			if(j == cur_opened_idx + 1){
				userData.isOpenedNexted = true;
			}
			else{
				userData.isOpenedNexted = false;
			}
		}
		createProduceArea(userData, posx, posy, grid_w, grid_h);
	}
}

function createProduceArea(userData : ShakingPanelUserData, posx : float, posy : float, grid_w : float, grid_h : float){
	var shaking_grid_panel : iGUIPanel = shakingContainer.addSmartObject("shakingPanel") as iGUIPanel;
	shaking_grid_panel.userData = userData;
	shaking_grid_panel.setX(posx);
	shaking_grid_panel.setY(posy);
}

function HandleNotifyExpandProduceArea(evt : GameEvent, obj : Object){
	var pack : notify_expand_produce_area = obj as notify_expand_produce_area;
}

function destroyProduceAreaCtrls(){
	if(shakingContainer.itemCount == 0){
		return;
	}
	
	for(var j : int = 0; j < shakingContainer.itemCount; ++ j){
		var shakingSmartObject_script_comp : iGUISmartPrefab_shakingPanel = 
			shakingContainer.items[j].GetComponent("iGUISmartPrefab_shakingPanel") as iGUISmartPrefab_shakingPanel;
			if(shakingSmartObject_script_comp){
				shakingSmartObject_script_comp.destroy();
			}
	}
}

function getFirstShakingRemainTime() : int{
	if(shakingContainer.itemCount == 0){
		return;
	}
	
	var shakingSmartObject_script_comp : iGUISmartPrefab_shakingPanel = null;
	for(var j : int = 0; j < shakingContainer.itemCount; ++ j){
		var t_shakingSmartObject_script_comp : iGUISmartPrefab_shakingPanel = 
			shakingContainer.items[j].GetComponent("iGUISmartPrefab_shakingPanel") as iGUISmartPrefab_shakingPanel;
			if(t_shakingSmartObject_script_comp && t_shakingSmartObject_script_comp.user_data.idx == 0){
				shakingSmartObject_script_comp = t_shakingSmartObject_script_comp;
			}
	}
	return shakingSmartObject_script_comp.getShakingRemainTime();
}

function HandleEnableMakeProductBtnEvent(evt : GameEvent, obj : Object){
	var enabled : boolean = Convert.ToBoolean(obj);
	startShakeBtn.passive = enabled;
}

function Clickcallback_startShakeBtn(caller : iGUIElement){
	if(BartenderSys.getInstance().getCurMakingProductCount() == 0){
		reqMakeProduct();
	}
	else{
		reqAddMakeProduct();
	}
}

function reqMakeProduct(){
	BartenderSys.getInstance().reqMakeProduct();
}

function reqAddMakeProduct(){
	BartenderSys.getInstance().reqAddMakeProduct();
}

function HandleCompleteMakeProductsList(evt : GameEvent, obj : Object){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.ENABLE_MAKE_PRODUCT_BTN_EVENT), false);
}

function HandleRemoveProduct(evt : GameEvent, obj : Object){
	var remove_idx : int = Convert.ToInt32(obj);
	if(shakingContainer.itemCount == 0){
		return;
	}
	
	for(var j : int = 0; j < shakingContainer.itemCount; ++ j){
		var shakingSmartObject_script_comp : iGUISmartPrefab_shakingPanel = 
			shakingContainer.items[j].GetComponent("iGUISmartPrefab_shakingPanel") as iGUISmartPrefab_shakingPanel;
			if(shakingSmartObject_script_comp){
				shakingSmartObject_script_comp.HandleRemoveProduct(remove_idx);
			}
	}
	removeProductEx(remove_idx);
}

function removeProductEx(remove_idx : int){
	BartenderSys.getInstance().removeProductEx(remove_idx);
}

function handlePremakeCostValueChanged(evt : GameEvent, obj : Object){
	var info : ShakingCostInfo = obj as ShakingCostInfo;
	var cost_diamonds : int = info.cost_diamonds;
	var cost_time : int = info.cost_time;
	costDiamodsLbl.label.text = cost_diamonds.ToString();
	var remain_tmStruct : RemainTimeStruct = PhyPowerMgr.CalculateRemainTime(cost_time, true);
	var show_time : String = "";
	if(remain_tmStruct.day != "0"){
		show_time += remain_tmStruct.day + "天";
	}
	if(remain_tmStruct.hour != "0"){
		show_time += remain_tmStruct.hour + "小时";
	}
	if(remain_tmStruct.min != "0"){
		show_time += remain_tmStruct.min + "分";
	}
	if(remain_tmStruct.sec != "0"){
		show_time += remain_tmStruct.sec + "秒";
	}
	costTimeLbl.label.text = show_time;
}

function handleStartMakingProducts(evt : GameEvent, obj : Object){
	makingRemainSeconds = Convert.ToInt32(obj);
	if(makingRemainSeconds <= 0){
		return;
	}
	
	if(makingTimer == null){
		makingTimer = new Timer(1000,makingRemainSeconds);
		makingTimer.addEventListener(TimerEvent.TIMER, triggerMakingTimerCountDown);
		makingTimer.addEventListener(TimerEvent.TIMER_COMPLETE, handleMakingTimerComplete);
		makingTimer.Start();
	}
	
	enableMakingTimerCtrlsShow(true);
}

function triggerMakingTimerCountDown(_timer : Timer, obj : Object){
	var remain_tmStruct : RemainTimeStruct = PhyPowerMgr.CalculateRemainTime(makingRemainSeconds, true);
	-- makingRemainSeconds;
	var show_time : String = "";
	if(remain_tmStruct.day != "0"){
		show_time += remain_tmStruct.day + "天";
	}
	if(remain_tmStruct.hour != "0"){
		show_time += remain_tmStruct.hour + "小时";
	}
	if(remain_tmStruct.min != "0"){
		show_time += remain_tmStruct.min + "分";
	}
	if(remain_tmStruct.sec != "0"){
		show_time += remain_tmStruct.sec + "秒";
	}
	
	makingRemainTimeLbl.label.text = show_time;
}

function handleMakingTimerComplete(_timer : Timer, obj : Object){
	enableMakingTimerCtrlsShow(false);
	destroyMakingTimer();
}

function enableMakingTimerCtrlsShow(enable : boolean){
	if(!enable){
		makingRemainTimeLbl.label.text = "";
		makingRemainTimeLbl.setEnabled(false);
		label8.setEnabled(false);
		immediateCompleteMakingBtn.setEnabled(false);
	}
	else{
		makingRemainTimeLbl.setEnabled(true);
		label8.setEnabled(true);
		immediateCompleteMakingBtn.setEnabled(true);
	}
}

function handleCompleteMakingProducts(evt : GameEvent, obj : Object){
	enableMakingTimerCtrlsShow(false);
	destroyMakingTimer();
}

function ClickCallback_immediateCompleteMakingBtn(caller : iGUIElement){
	BartenderSys.getInstance().immediateCompleteAllProduct();
}

function handleImmediateCompleteProducts(evt : GameEvent, obj : Object){
	enableMakingTimerCtrlsShow(false);
	destroyMakingTimer();
}

function handleOpenCompleteExpandTip(evt : GameEvent, obj : Object){
	var complete_food_id : int = Convert.ToInt32(obj);
	var baseInfo : BartenderFoodBaseInfoRow = BartenderSys.getInstance().getBartenderSysTableMgr().getFoodBaseInfoRow(complete_food_id);
	var productRow : BartenderFoodProductInfoRow = 
						BartenderSys.getInstance().getBartenderSysTableMgr().getProductInfoRow(baseInfo.upgrade_id);
	var name : String = productRow.name;
	var icon : String = productRow.icon;
	var cur_stockGrid_num : int = baseInfo.cur_open_gridNum;
	var max_grid_num : int = baseInfo.max_stock;
	var tip : String = "恭喜你\n" + name + "库存扩容到了" + cur_stockGrid_num.ToString() + "格!";
	completeExpandTipLbl.label.text = tip;
	createCompleteExpandStockGridList(complete_food_id, cur_stockGrid_num, max_grid_num);
	loadFoodIcon(completeExpandFoodImg, icon);
	completeExpandStockTipPanel.setEnabled(true);
	barTenderPanel.passive = true;
}

function createCompleteExpandStockGridList(food_id : int, cur_open_gridNum : int, max_grid_num : int){
	var cur_openTo_grid_idx : int = cur_open_gridNum - 1;
	completeExpandGridContainer.removeAll();
	for(var j : int = 0; j < max_grid_num; ++ j){
		var grid_w : float = 19;
		var grid_h : float = 17;
		var grid_space : float = 2;
		var posx : float = (grid_w + grid_space) * j;
		var posy : float = 0;
		var is_opened : boolean = false;
		if(j <= cur_openTo_grid_idx){
			is_opened = true;
		}
		createCompleteFoodStockGrid(is_opened, posx, posy, grid_w, grid_h);
	}
}

function createCompleteFoodStockGrid(is_opened : boolean, posx : float, posy : float, grid_w : float, grid_h : float){
	var grid : iGUIImage = completeExpandGridContainer.addElement("iGUIImage") as iGUIImage;
	grid.setX(posx);
	grid.setY(posy);
	grid.setWidth(grid_w);
	grid.setHeight(grid_h);
	if(is_opened){
		grid.image = Resources.Load("UISkins/Textures/cookbook/heart_red");
	}
	else{
		grid.image = Resources.Load("UISkins/Textures/cookbook/heart_brown");
	}
}

function ClickCallback_closecompeteExpandStockTipPanelBtn(caller : iGUIElement){
	completeExpandStockTipPanel.setEnabled(false);
	barTenderPanel.passive = false;
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLOSE_COMPLETE_EXPAND_TIP));
}

// add by zlj 食物升级成功后提示
private function HandleOpenUpdataFoodSucTip(evt : GameEvent, obj : Object){
    var updata_food_id : int = Convert.ToInt32(obj);
    var baseInfo : BartenderFoodBaseInfoRow = BartenderSys.getInstance().getBartenderSysTableMgr().getFoodBaseInfoRow(updata_food_id);
    var level : int    = baseInfo.cur_level;
    var produceRow : BartenderFoodProductInfoRow = BartenderSys.getInstance().getBartenderSysTableMgr().getProductInfoRow(baseInfo.upgrade_id);
    var name  : String = produceRow.name;
    var icon  : String = produceRow.icon;
    var tip   : String = "恭喜你\n" + name + "等级提升到" + level.ToString() + "星!";
    completeUpgradeTipLbl.label.text = tip;
    createCompleteUpgradeFoodStarList(level, baseInfo.max_upgrade_level);
    loadFoodIcon(completeUpgradeFoodImg, icon);
    completeUpgradeFoodTipPanel.setEnabled(true);
    barTenderPanel.passive = true;
}
// 显示的当前等级和最高等级
private function createCompleteUpgradeFoodStarList(curLevel : int, max_upgrade_level : int){
	var cur_openTo_grid_idx : int = curLevel - 1;
	if(completeUpgradeGridContainer)
	{
	   completeUpgradeGridContainer.removeAll();
	}
	
	for(var j : int = 0; j < max_upgrade_level; ++ j){
		// 要显示的图片的位置
		var posx : float = 9.0 + heartIcon_W  * j;
		var posy : float = 0;
		var bFullHeart : boolean = false;
		if(j <= cur_openTo_grid_idx){
			bFullHeart = true;
		}
		createCompleteUpgradeFoodStockGrid(bFullHeart, posx, posy);
	}
}
// 用实心显示食物的等级
private function createCompleteUpgradeFoodStockGrid(bFullHeart : boolean, posx : float, posy : float){
	var grid : iGUIImage = completeUpgradeGridContainer.addElement("iGUIImage") as iGUIImage;
	grid.setX(posx);
	grid.setY(posy);
	grid.setWidth(heartIcon_W);
	grid.setHeight(heartIcon_H);
	grid.image = bFullHeart ? Resources.Load(fullHeartStr) : Resources.Load(emptyHeartStr);
}
// 关闭食物升级成功后提示面板
private function ClickCallback_closecompeteUpgradeFoodTipPanelBtn(caller : iGUIElement){
    completeUpgradeFoodTipPanel.setEnabled(false);
    barTenderPanel.passive = false;
}