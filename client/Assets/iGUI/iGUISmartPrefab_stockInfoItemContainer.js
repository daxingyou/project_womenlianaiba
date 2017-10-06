import iGUI;

enum FOOD_STOCK_STATE{
	EMPTY = 0,
	FULL = 1,
	EXPANDING = 2,
	PREMAKE = 3,
	MAKING = 4,
	LOCKED = 5,
	OPENED = 6,
}

class ReqExpandStockNeedData{
	var idx : int;
	var food_id : int;
}

class StockItemInitInfoClass{
	var idx : int;
	var food_id : int;
	var isOpened : boolean;
		var isMaking : boolean;
		var isPremake : boolean;
		var isEmpty : boolean;
		var isFull : boolean;
	//
	var cur_stock_value_this_grid : int; //当前本格持有的库存量
	var this_grid_max_stock_value : int; //本格最大的库存量
	var cur_premake_value : int;	//当前格子中准备制作的量
	var cur_atmaking_value : int;
	//
	var isOpenedNextStock : boolean;
	var isInExpandingGrid : boolean;
}

class ExpandStockTimeInfo{
	var idx : int;
	var food_id : int;
	var during_time : stime;
	var remainSecs : int;
}

private static var instance : iGUISmartPrefab_stockInfoItemContainer;
var initInfo : StockItemInitInfoClass = null;
var expandInfo : ExpandStockTimeInfo = null;
function Awake(){
	instance=this;
	registLocalEvent();
}
static function getInstance(){
	return instance;
}
@HideInInspector
var openedStockPanel : iGUIPanel;
@HideInInspector
var maskLayer : iGUIImage;
@HideInInspector
var remainBg : iGUIImage;
@HideInInspector
var makingBg : iGUIImage;
@HideInInspector
var readyMakeBg : iGUIImage;
@HideInInspector
var unlockBg : iGUIImage;
@HideInInspector
var lockBtn : iGUIButton;
@HideInInspector
var stockInfoItemContainer : iGUIContainer;

function registLocalEvent(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CANCEL_EXPAND_FOOD_STOCK_GRID), HandleCancelExpandStockGrid);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CUR_PERGRID_STOCK_VALUE_CHANGED), HandleCurStockValueChanged);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.ATMAKING_PRODUCT_PERGRID_VALUE_CHANGED), HandleAtmakingProductValueChanged);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.PREMAKE_STOCK_PERGRID_VALUE_CHANGED), HandlePremakeStockValueChanged);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.SEND_STOCK_INEXPANDING_EVENT), HandleNotifyStockInExpandingEvent);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.COMPLETE_EXPAND_FOOD_STOCK_GRID), HandleCompleteExpandFoodStockGrid);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.START_EXPAND_FOOD_STOCK_GRID), HandleStartExpandFoodStockGrid);
}

function unRegistLocalEvent(){
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CANCEL_EXPAND_FOOD_STOCK_GRID), HandleCancelExpandStockGrid);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CUR_PERGRID_STOCK_VALUE_CHANGED), HandleCurStockValueChanged);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.ATMAKING_PRODUCT_PERGRID_VALUE_CHANGED), HandleAtmakingProductValueChanged);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.PREMAKE_STOCK_PERGRID_VALUE_CHANGED), HandlePremakeStockValueChanged);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.SEND_STOCK_INEXPANDING_EVENT), HandleNotifyStockInExpandingEvent);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.COMPLETE_EXPAND_FOOD_STOCK_GRID), HandleCompleteExpandFoodStockGrid);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.START_EXPAND_FOOD_STOCK_GRID), HandleStartExpandFoodStockGrid);
}

public function destroy(){
	unRegistLocalEvent();
}

function HandleNotifyStockInExpandingEvent(evt : GameEvent, obj : Object){
	if(initInfo == null)
		initInfo = stockInfoItemContainer.userData as StockItemInitInfoClass;
		
	if(initInfo.isOpenedNextStock && !initInfo.isInExpandingGrid){
		unlockBg.setEnabled(true);
		lockBtn.setEnabled(false);
	}
}

function HandleStartExpandFoodStockGrid(evt : GameEvent, obj : Object){
	var info : ExpandStockTimeInfo = obj as ExpandStockTimeInfo;
	expandInfo = info;
	if(initInfo == null)
		initInfo = stockInfoItemContainer.userData as StockItemInitInfoClass;
	
	if(info.food_id == initInfo.food_id){
		if(initInfo.isInExpandingGrid){
			setState(FOOD_STOCK_STATE.EXPANDING);
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.SET_EXPAND_USERDATA), initInfo);
		}
	}
	else{
		if(initInfo.isOpenedNextStock){
			unlockBg.setEnabled(true);
			lockBtn.setEnabled(false);
		}
	}
}

function setState(state : FOOD_STOCK_STATE){
	switch(state){
		case FOOD_STOCK_STATE.EXPANDING:
			//openedStockPanel.setEnabled(false);
			unlockBg.setEnabled(true);
			lockBtn.setEnabled(false);
			break;
		case FOOD_STOCK_STATE.OPENED:
			openedStockPanel.setEnabled(true);
			if(unlockBg)
				stockInfoItemContainer.removeElement(unlockBg);
			if(lockBtn)
			stockInfoItemContainer.removeElement(lockBtn);
			break;
	}
}

function HandleCompleteExpandFoodStockGrid(evt : GameEvent, obj : Object){
	var info : ExpandStockTimeInfo = obj as ExpandStockTimeInfo;
	if(info.food_id == initInfo.food_id){
		refreshState();
	}
	else{
		if(initInfo.isOpenedNextStock){
			lockBtn.setEnabled(true);
			lockBtn.clickCallback = ClickCallback_lockBtn;
			unlockBg.setEnabled(false);
		}
	}
}

function HandleCancelExpandStockGrid(evt : GameEvent, obj : Object){
	HandleCompleteExpandFoodStockGrid(evt, obj);
}

function Start(){
	initInfo = stockInfoItemContainer.userData as StockItemInitInfoClass;
	registCtrlsCallback();
	refreshState();
}

function registCtrlsCallback(){
	stockInfoItemContainer.mouseOverCallback = mouseOverCallback_stockInfoItemContainer;
}

// alter by zlj 更新库存量(UI表现)
function refreshState(){
	if(initInfo == null)
		initInfo = stockInfoItemContainer.userData as StockItemInitInfoClass;
	
	if(initInfo.isOpened){
		setState(FOOD_STOCK_STATE.OPENED);
		if(initInfo.isFull){
			remainBg.setWidth(1);
			remainBg.setEnabled(true);
		}else if(initInfo.isEmpty){
			remainBg.setWidth(0);
			remainBg.setEnabled(false);
		}
		else{
			var scale : float = Convert.ToSingle(initInfo.cur_stock_value_this_grid) / initInfo.this_grid_max_stock_value;
			remainBg.setWidth(scale);
			remainBg.setEnabled(true);
		}
		if(initInfo.isPremake){
			var scale1 : float = 0;
			if(!initInfo.isEmpty && !initInfo.isFull){
				scale1 = 1;
			}
			else{
				if(initInfo.isMaking){
					scale1 = 1;
				}
				else{
					scale1 = Convert.ToSingle(initInfo.cur_premake_value) / initInfo.this_grid_max_stock_value;
				}
			}
			readyMakeBg.setWidth(scale1);
			readyMakeBg.setEnabled(true);
		}
		else{
			readyMakeBg.setWidth(0);
			readyMakeBg.setEnabled(false);
		}
		if(initInfo.isMaking){
			var scale2 : float = 0;
			if(!initInfo.isEmpty && !initInfo.isFull){
				scale2 = 1;
			}
			else{
				scale2 = Convert.ToSingle(initInfo.cur_atmaking_value) / initInfo.this_grid_max_stock_value;
			}
			makingBg.setWidth(scale2);
			makingBg.setEnabled(true);
		}
		else{
			makingBg.setWidth(0);
			makingBg.setEnabled(false);
		}
	}
	else{	//未开启
		openedStockPanel.setEnabled(false);
		if(initInfo.isOpenedNextStock){
			if(initInfo.isInExpandingGrid){
				setState(FOOD_STOCK_STATE.EXPANDING);
					//EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.SEND_STOCK_INEXPANDING_EVENT));
			}
			else{
				if(BartenderSys.is_at_expanding_stock && BartenderSys.at_expanding_stock_food_id != 0 && BartenderSys.at_expanding_stock_food_id != initInfo.food_id){
					unlockBg.setEnabled(true);
					lockBtn.setEnabled(false);
				}
				else{
					lockBtn.setEnabled(true);
					lockBtn.clickCallback = ClickCallback_lockBtn;
					unlockBg.setEnabled(false);
				}
			}
		}
		else{
			unlockBg.setEnabled(true);
			lockBtn.setEnabled(false);
		}
	}
}

function ClickCallback_lockBtn(caller : iGUIElement){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.POPUP_REQ_EXPANDSTOCK_CONFIRM_UI), initInfo);
}

function refrash(info : StockItemInitInfoClass){
	stockInfoItemContainer.userData = info;
	initInfo = info;
	//refreshState();
}

function HandlePremakeStockValueChanged(evt : GameEvent, obj : Object){
	refreshState();
}

function HandleAtmakingProductValueChanged(evt : GameEvent, obj : Object){
	refreshState();
}

function HandleCurStockValueChanged(evt : GameEvent, obj : Object){
	refreshState();
}

function mouseOverCallback_stockInfoItemContainer(caller : iGUIElement){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MOUSEOVER_STOCK_GRID_CALLBACK), caller);
}