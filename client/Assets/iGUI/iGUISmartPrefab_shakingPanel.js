import iGUI;

class ShakingPanelUserData{
	var idx : int;
	var food_id : int;
	var isOpened : boolean;
	var isShaking : boolean;
	var isOpenedNexted : boolean;
	var isReadyShake : boolean;
	var productID : int;
	var shakeSeconds : float = 0;
	var remainShakingSeconds : float = 0;
	var max_num : int;
}

private static var instance : iGUISmartPrefab_shakingPanel;
var user_data : ShakingPanelUserData = null;
function Awake(){
	instance=this;
	registLocalEvent();
}
static function getInstance(){
	return instance;
}
@HideInInspector
var cancelMakingBtn : iGUIButton;
@HideInInspector
var unlockAreaBtn : iGUIButton;
@HideInInspector
var makingMaskImg : iGUIImage;
@HideInInspector
var noOpenImg : iGUIImage;
@HideInInspector
var shakingPanel : iGUIPanel;
@HideInInspector
var productImgFrm : iGUIImage;

function registLocalEvent(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.REFRESH_PRODUCT_INFO), HandleNotifyMakingProductInfo);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MAKING_PRODUCTS_TIMERSTART), handleMakingProductsTimerStart);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MAKING_PRODUCTS_TIMERCOMPLETE), handleMakingProductsTimerComplete);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MAKING_PRODUCTS_ONTIMER), handleMakingProductsOnTimer);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.IMMEDIATE_COMPLETE_PRODUCTS), handleImmediateCompleteProducts);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLEAR_OUTSIDE_DATAS), HandleClearOutsideDatas);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.COMPLETE_MAKE_ONE_PRODUCT), HandleCompleteMakeOneProduct);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.ADD_FOODPRODUCT_TO_PREMAKE), HandleAddFoodProductToPremake);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MAKING_PRODUCT_INFO), HandleNotifyMakingProductInfo);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_EXPAND_PRODUCE_AREA), HandleNotifyExpandProduceArea);
}

function unRegistLocalEvent(){
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.REFRESH_PRODUCT_INFO), HandleNotifyMakingProductInfo);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.MAKING_PRODUCTS_TIMERSTART), handleMakingProductsTimerStart);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.MAKING_PRODUCTS_TIMERCOMPLETE), handleMakingProductsTimerComplete);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.MAKING_PRODUCTS_ONTIMER), handleMakingProductsOnTimer);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.IMMEDIATE_COMPLETE_PRODUCTS), handleImmediateCompleteProducts);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLEAR_OUTSIDE_DATAS), HandleClearOutsideDatas);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.COMPLETE_MAKE_ONE_PRODUCT), HandleCompleteMakeOneProduct);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.ADD_FOODPRODUCT_TO_PREMAKE), HandleAddFoodProductToPremake);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.MAKING_PRODUCT_INFO), HandleNotifyMakingProductInfo);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_EXPAND_PRODUCE_AREA), HandleNotifyExpandProduceArea);
}

function destroy(){
	unRegistLocalEvent();
}

function regisetCtrlsCallback(){
	cancelMakingBtn.clickCallback = ClickCallback_cancelMakingBtn;
}

function Start(){
	regisetCtrlsCallback();
	++ iGUICode_BartenderUI.shaking_grid_created_num;
	user_data = shakingPanel.userData as ShakingPanelUserData;
	initGrid();
	//在所有制作区格子创建好后去更新产品信息
	if(iGUICode_BartenderUI.shaking_grid_created_num >= user_data.max_num){
		refreshProducts();
		if(BartenderSys.is_first_login_bartend){
			//reqProducts();
			BartenderSys.is_first_login_bartend = false;
		}
		else{
			
		}
	}
}

function reqProducts(){
	BartenderSys.getInstance().reqProducts();
}

function refreshProducts(){
	BartenderSys.getInstance().refreshProducts();
}

function initGrid(){
	if(user_data.isOpened){
		productImgFrm.image = null;
		makingMaskImg.setHeight(0);
		shakingPanel.removeElement(unlockAreaBtn);
		shakingPanel.removeElement(noOpenImg);
	}
	else{
		if(user_data.isOpenedNexted){
			unlockAreaBtn.setEnabled(true);
			unlockAreaBtn.clickCallback = clickCallback_unlockAreaBtn;
		}
		else{
			noOpenImg.image = Resources.Load("UISkins/Textures/cookbook/Btn_MakerIcon_Lockedg");
			noOpenImg.setEnabled(true);
		}
	}
}

function clickCallback_unlockAreaBtn(caller : iGUIElement){
	UI.getUI().OpenUIRoot("BarCntrProduceUI");
	UI.getUI().SetModal("BarCntrProduceUI", true);
	iGUICode_BarCntrProduceUI.getInstance().setUnlockBarCntrID(user_data.idx);
}

function reqExpandProduceArea(idx : int){
	BartenderSys.getInstance().reqExpandProduceArea(idx);
}

function HandleNotifyExpandProduceArea(evt : GameEvent, obj : Object){
	var pack : notify_expand_produce_area = obj as notify_expand_produce_area;
	var idx : int = pack.grid_index;
	if(user_data.idx == idx){
		user_data.isOpened = true;
		user_data.isOpenedNexted = false;
		//
		makingMaskImg.setHeight(0);
		shakingPanel.removeElement(unlockAreaBtn);
		shakingPanel.removeElement(noOpenImg);
	}
	else if(user_data.idx == (idx + 1)){
		user_data.isOpened = false;
		user_data.isOpenedNexted = true;
		//
		noOpenImg.setEnabled(false);
		unlockAreaBtn.setEnabled(true);
		unlockAreaBtn.clickCallback = clickCallback_unlockAreaBtn;
	}
}

function HandleNotifyMakingProductInfo(evt : GameEvent, obj : Object){
	var clientProductInfo : ProductInfoStruct = obj as ProductInfoStruct;
	if(user_data.idx == clientProductInfo.idx){
		if(user_data.idx == 0){
			makingMaskImg.image = Resources.Load("UISkins/Textures/cookbook/mo") as Texture2D;
			makingMaskImg.setEnabled(true);
		}
		productImgFrm.setEnabled(true);
		productImgFrm.mouseOverCallback = mouseOverCallback_productImgFrm;
		productImgFrm.mouseOutCallback = mouseOutCallback_productImgFrm;
		productImgFrm.opacity = 1;
		
		var food_icon : String = BartenderSys.getInstance().getBartenderSysTableMgr().getProductInfoRow(clientProductInfo.product_id).icon;
		loadFoodProductIcon(productImgFrm, food_icon);
		
		user_data.food_id = clientProductInfo.food_id;
		user_data.productID = clientProductInfo.product_id;
		user_data.shakeSeconds = clientProductInfo.shaking_time;
		user_data.isShaking = true;
		user_data.isReadyShake = false;
	}
}

function loadFoodProductIcon(img_frm : iGUIImage, img_name : String){
	BartenderSys.getInstance().loadIcon(img_frm, img_name);
}

function HandleAddFoodProductToPremake(evt : GameEvent, obj : Object){
	var info : ProductInfoStruct = obj as ProductInfoStruct;
	if(info.idx == user_data.idx){
		user_data.isReadyShake = true;
		user_data.food_id = info.food_id;
		user_data.productID = info.product_id;
		//
		productImgFrm.setEnabled(true);
		productImgFrm.mouseOverCallback = mouseOverCallback_productImgFrm;
		productImgFrm.mouseOutCallback = mouseOutCallback_productImgFrm;
		productImgFrm.opacity = 0.5;
		
		var food_icon : String = BartenderSys.getInstance().getBartenderSysTableMgr().getProductInfoRow(info.product_id).icon;
		loadFoodProductIcon(productImgFrm, food_icon);
	}
	else{
		
	}
}

function HandleCompleteMakeOneProduct(evt : GameEvent, obj : Object){
	//var complete_idx : int = Convert.ToInt32(obj);
	//if(complete_idx == user_data.idx){
		if(user_data == null){
			user_data = shakingPanel.userData as ShakingPanelUserData;
		}
		
		if(user_data){
			user_data.isShaking = false;
			user_data.isReadyShake = false;
		}
		//
		cancelMakingBtn.setEnabled(false);
		productImgFrm.image = null;
		productImgFrm.mouseOverCallback = null;
		productImgFrm.mouseOutCallback = null;
		productImgFrm.setEnabled(false);
		makingMaskImg.setHeight(0);
		makingMaskImg.setEnabled(false);
}

function ClickCallback_cancelMakingBtn(caller : iGUIElement){
	//
	Global.GetSysTooltip().Hide();
	if(user_data.idx == 0){
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.STOP_MAKING_PRODUCT_TIMER));
	}
	//
	removeProduct();
	//
	user_data.isReadyShake = false;
	user_data.isShaking = false;
	user_data.productID = 0;
	user_data.food_id = 0;
	user_data.remainShakingSeconds = 0;
	user_data.shakeSeconds = 0;
	//
	cancelMakingBtn.setEnabled(false);
	productImgFrm.image = null;
	productImgFrm.mouseOverCallback = null;
	productImgFrm.mouseOutCallback = null;
	productImgFrm.setEnabled(false);
	makingMaskImg.setHeight(0);
	makingMaskImg.setEnabled(false);
	//
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.REMOVE_PRODUCT), user_data.idx);
}

function removeProduct(){
	BartenderSys.getInstance().removeProduct(user_data);
}

function HandleRemoveProduct(remove_idx : int){
	if(user_data.idx >= remove_idx){
		user_data.isReadyShake = false;
		user_data.isShaking = false;
		user_data.productID = 0;
		user_data.food_id = 0;
		user_data.remainShakingSeconds = 0;
		user_data.shakeSeconds = 0;
		//
		cancelMakingBtn.setEnabled(false);
		productImgFrm.image = null;
		productImgFrm.mouseOverCallback = null;
		productImgFrm.mouseOutCallback = null;
		productImgFrm.setEnabled(false);
		makingMaskImg.setHeight(0);
		makingMaskImg.setEnabled(false);
	}
}

function mouseOverCallback_productImgFrm(caller : iGUIElement){
	cancelMakingBtn.setEnabled(true);
	//
	var food_productRow : BartenderFoodProductInfoRow = 
						BartenderSys.getInstance().getBartenderSysTableMgr().getProductInfoRow(user_data.productID);
	var name : String = food_productRow.name;
	var making_seconds : int = food_productRow.shaking_time;
	Global.GetSysTooltip().Begin(caller);
	Global.GetSysTooltip().Add(GUIContent(name), BartenderHintStyles.instance.makingProductDescStyle);
	Global.GetSysTooltip().Add(GUIContent("调制时间: " + making_seconds + "秒"), BartenderHintStyles.instance.makingProductDescStyle);
	Global.GetSysTooltip().Show(true, 0, 20);
}

function mouseOutCallback_productImgFrm(caller : iGUIElement){
	cancelMakingBtn.setEnabled(false);
}

function HandleClearOutsideDatas(evt : GameEvent, obj : Object){
	var up_idx : int = Convert.ToInt32(obj);
	if(user_data.idx > up_idx && user_data.isOpened){
		user_data.isReadyShake = false;
		user_data.isShaking = false;
		user_data.productID = 0;
		user_data.food_id = 0;
		user_data.remainShakingSeconds = 0;
		user_data.shakeSeconds = 0;
		//
		cancelMakingBtn.setEnabled(false);
		productImgFrm.image = null;
		productImgFrm.mouseOverCallback = null;
		productImgFrm.mouseOutCallback = null;
		productImgFrm.setEnabled(false);
		makingMaskImg.setHeight(0);
		makingMaskImg.setEnabled(false);
	}
}

function getShakingRemainTime() : int{
	if(user_data && user_data.idx == 0)
		return user_data.remainShakingSeconds;
	return 0;
}

function handleImmediateCompleteProducts(evt : GameEvent, obj : Object){
	user_data.isShaking = false;
	user_data.isReadyShake = false;
	//
	cancelMakingBtn.setEnabled(false);
	productImgFrm.image = null;
	productImgFrm.mouseOverCallback = null;
	productImgFrm.mouseOutCallback = null;
	productImgFrm.setEnabled(false);
	makingMaskImg.setHeight(0);
	makingMaskImg.setEnabled(false);
}

function handleMakingProductsOnTimer(evt : GameEvent, obj : Object){
	if(user_data.idx == 0){
		var remainSecs : int = Convert.ToInt32(obj);
		user_data.remainShakingSeconds = remainSecs;
		var scale : float = (user_data.shakeSeconds - user_data.remainShakingSeconds) / user_data.shakeSeconds;
		if(scale >= 0){
			makingMaskImg.setHeight(scale);
		}
	}
}

function handleMakingProductsTimerComplete(evt : GameEvent, obj : Object){
	if(user_data.idx == 0){
		user_data.remainShakingSeconds = 0;
		makingMaskImg.setHeight(0);
		makingMaskImg.image = null;
		makingMaskImg.setEnabled(false);
	}
}

function handleMakingProductsTimerStart(evt : GameEvent, obj : Object){
	if(user_data.idx == 0){
		var remainSecs : int = Convert.ToInt32(obj);
		user_data.remainShakingSeconds = remainSecs;
		//makingMaskImg.setEnabled(true);
		//var scale : float = (user_data.shakeSeconds - user_data.remainShakingSeconds) / user_data.shakeSeconds;
		//makingMaskImg.setHeight(scale);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.ENABLE_MAKE_PRODUCT_BTN_EVENT), true);
	}
}
