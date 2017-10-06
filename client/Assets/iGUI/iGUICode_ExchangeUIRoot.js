import iGUI;

class TypeTabUserDataClass{
	var typeIdx : int = 0;
	var itemList : ArrayList= new ArrayList();
}

class ExchangeSourceItemInfo{
	var itemID : int = 0;
	var itemIcon : String = "";
	var existingNum : int = 0;
	var num : int = 0;
}

var mTabBtnNormalBgs : Texture2D[];
var mTabBtnActiveBgs : Texture2D[];
var mTypeTabBtnWidth : float = 56f;
var mTypeTabBtnHeight : float = 24f;
var mTypeTabBtnSpace : float = 10f;
var mOnePageCount : int = 3;
var hintFont : Font;
private var mClassifyDataList : ArrayList;
private var mPageMgr : PagerMgr = null;
private static var instance : iGUICode_ExchangeUIRoot;
function Awake(){
	instance=this;
	registEvt();
}

private function registEvt(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_EXCHANGE), handleNotifyExchange);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.EXCHANGELIST_PAGE_CHANGE), handleExchangeListPageChange);
}

static function getInstance(){
	return instance;
}
@HideInInspector
var image1 : iGUIImage;
@HideInInspector
var pageNumLbl : iGUILabel;
@HideInInspector
var nextPageBtn : iGUIButton;
@HideInInspector
var prePageBtn : iGUIButton;
@HideInInspector
var contentListbox : iGUIListBox;
@HideInInspector
var typeTabBtnContainer : iGUIContainer;
@HideInInspector
var closeBtn : iGUIButton;
@HideInInspector
var exchangeMainPanel : iGUIPanel;
@HideInInspector
var exchangeUIRoot : iGUIRoot;

function Start(){
	initData();
	RegistCallback();
	if(!mClassifyDataList)
		throw "mClassifyDataList is null";
	CreateTypeTabBtns();
}

function initData(){
	if(ExchangeComp.getInstance())
		mClassifyDataList = ExchangeComp.getInstance().GetClassifyData();
}

private function RegistCallback(){
	prePageBtn.clickCallback = clickCallback_prePageBtn;
	nextPageBtn.clickCallback = clickCallback_nextPageBtn;
	closeBtn.clickCallback = clickCallback_closeBtn;
}

//根据分类数量创建分类按钮
private function CreateTypeTabBtns(){
	for(var i:int = 0; i < mClassifyDataList.Count; ++ i){
		var itemList : ArrayList = mClassifyDataList[i] as ArrayList;
		CreateTypeTabBtnImpl(i, itemList);
	}
}

//创建分类按钮，带userData
private function CreateTypeTabBtnImpl(idx : int, itemList : ArrayList){
	var posx : int = idx * (mTypeTabBtnWidth + mTypeTabBtnSpace);
	var posy : int = 0;
	var typeTabBtnName : String = "typeTabBtn" + idx;
	var typeTabDataInfo : TypeTabUserDataClass = new TypeTabUserDataClass();
	typeTabDataInfo.typeIdx = idx;
	typeTabDataInfo.itemList = itemList;
	var typeTabBtn : iGUIButton = typeTabBtnContainer.addElement("iGUIButton") as iGUIButton;
	typeTabBtn.userData = typeTabDataInfo;
	typeTabBtn.style.normal.background = mTabBtnNormalBgs[idx];
	typeTabBtn.style.hover.background = mTabBtnActiveBgs[idx];
	typeTabBtn.style.active.background = mTabBtnNormalBgs[idx];
	typeTabBtn.clickCallback = clickCallback_typeTabBtn;
	typeTabBtn.variableName = typeTabBtnName;
	typeTabBtn.gameObject.name = typeTabBtnName;
	typeTabBtn.setX(posx);
	typeTabBtn.setY(posy);
	typeTabBtn.setWidth(mTypeTabBtnWidth);
	typeTabBtn.setHeight(mTypeTabBtnHeight);
	if(idx == 0){
		clickCallback_typeTabBtn(typeTabBtn);
	}
}

//
private function clickCallback_typeTabBtn(caller : iGUIElement){
	var typeTabDataInfo : TypeTabUserDataClass = caller.userData as TypeTabUserDataClass;
	var itemList : ArrayList = typeTabDataInfo.itemList;
	mPageMgr = null;
	mPageMgr = new PagerMgr(itemList, mOnePageCount);
	var showList : ArrayList = mPageMgr.CurrPage();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.EXCHANGELIST_PAGE_CHANGE), showList);
	typeTabBtnChanged(typeTabDataInfo.typeIdx);
}

//--
private function typeTabBtnChanged(activeIdx : int){
	var activeTabBtn : iGUIButton = typeTabBtnContainer.items[activeIdx] as iGUIButton;
	activeTabBtn.style.normal.background = mTabBtnActiveBgs[activeIdx];
	activeTabBtn.style.hover.background = mTabBtnActiveBgs[activeIdx];
	activeTabBtn.style.active.background = mTabBtnActiveBgs[activeIdx];
	for(var i:int=0; i < typeTabBtnContainer.itemCount; ++ i){
		if(i != activeIdx){
			var noActiveTabBtn : iGUIButton = typeTabBtnContainer.items[i] as iGUIButton;
			noActiveTabBtn.style.normal.background = mTabBtnNormalBgs[i];
			noActiveTabBtn.style.hover.background = mTabBtnActiveBgs[i];
			noActiveTabBtn.style.active.background = mTabBtnNormalBgs[i];
		}
	}
}
//-
private function clickCallback_prePageBtn(caller : iGUIElement){
	if(!mPageMgr)
		return;
	
	var showList : ArrayList = mPageMgr.PrevPage();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.EXCHANGELIST_PAGE_CHANGE), showList);
}

//--
private function clickCallback_nextPageBtn(caller : iGUIElement){
	if(!mPageMgr)
		return;
	
	var showList : ArrayList = mPageMgr.NextPage();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.EXCHANGELIST_PAGE_CHANGE), showList);
}

//--
private function handleExchangeListPageChange(evt : GameEvent, obj : Object){
	var showList : ArrayList = obj as ArrayList;
	createExchangeItemShowList(showList);
	handlePageNumChanged();
}

//
private function createExchangeItemShowList(showList : ArrayList){
	contentListbox.removeAll();
	for(var i:int=0; i < showList.Count; ++ i){
		var itemInfo : ExchangeRow = showList[i] as ExchangeRow;
		createExchangeItemInfoPanel(itemInfo);
	}
}

//
private function createExchangeItemInfoPanel(itemInfo : ExchangeRow){
	var sourceItemInfoList : ArrayList = new ArrayList();
	var sourceItemInfo1 : ExchangeSourceItemInfo = fillExchangeSourceItemInfo(itemInfo.item1_id, itemInfo.item1_num);
	if(sourceItemInfo1){
		sourceItemInfoList.Add(sourceItemInfo1);
	}
	var sourceItemInfo2 : ExchangeSourceItemInfo = fillExchangeSourceItemInfo(itemInfo.item2_id, itemInfo.item2_num);
	if(sourceItemInfo2){
		sourceItemInfoList.Add(sourceItemInfo2);
	}
	var sourceItemInfo3 : ExchangeSourceItemInfo = fillExchangeSourceItemInfo(itemInfo.item3_id, itemInfo.item3_num);
	if(sourceItemInfo3){
		sourceItemInfoList.Add(sourceItemInfo3);
	}
	var sourceItemInfo4 : ExchangeSourceItemInfo = fillExchangeSourceItemInfo(itemInfo.item4_id, itemInfo.item4_num);
	if(sourceItemInfo4){
		sourceItemInfoList.Add(sourceItemInfo4);
	}
	var itemPanel : iGUIPanel = contentListbox.addSmartObject("ExchangeItemPanel") as iGUIPanel;
	var sourceIconFrm : iGUIImage = itemPanel.items[0].items[0] as iGUIImage;
	loadExchangeItemIcon(sourceIconFrm, itemInfo.source_icon);
	var sourceItemsContainer : iGUIContainer = itemPanel.items[0].items[1] as iGUIContainer;
	//clear first
	for(var j:int=0; j< sourceItemsContainer.itemCount; ++ j){
		var sourceItemContainer1 : iGUIContainer = sourceItemsContainer.items[j] as iGUIContainer;
		var sourceItemImgFrm1 : iGUIImage = sourceItemContainer1.items[0] as iGUIImage;
		var sourceItemNumLbl1 : iGUILabel = sourceItemContainer1.items[1] as iGUILabel;
		sourceItemImgFrm1.image = null;
		sourceItemNumLbl1.label.text = "";
	}
	//fill data
	for(var i:int=0; i < sourceItemInfoList.Count; ++ i){
		var sourceItemInfo : ExchangeSourceItemInfo = sourceItemInfoList[i] as ExchangeSourceItemInfo;
		var sourceItemContainer : iGUIContainer = sourceItemsContainer.items[i] as iGUIContainer;
		var sourceItemImgFrm : iGUIImage = sourceItemContainer.items[0] as iGUIImage;
		var sourceItemNumLbl : iGUILabel = sourceItemContainer.items[1] as iGUILabel;
		sourceItemImgFrm.userData = sourceItemInfo.itemID;
		sourceItemImgFrm.mouseOverCallback = mouseOverCallback_sourceItem;
		loadExchangeItemIcon(sourceItemImgFrm, sourceItemInfo.itemIcon);
		sourceItemNumLbl.label.text = sourceItemInfo.existingNum.ToString() + "/" + sourceItemInfo.num.ToString();
		if(sourceItemInfo.existingNum < sourceItemInfo.num){
			sourceItemNumLbl.labelColor = Color.red;
		}
		else{
			sourceItemNumLbl.labelColor = Color.white;
		}
	}
	var tarItemPanel : iGUIPanel = itemPanel.items[2] as iGUIPanel;
	var tarItemContainer : iGUIContainer = tarItemPanel.items[0] as iGUIContainer;
	var tarItemImgFrm : iGUIImage = tarItemContainer.items[0] as iGUIImage;
	var tarItemNumLbl : iGUILabel = tarItemContainer.items[1] as iGUILabel;
	loadExchangeItemIcon(tarItemImgFrm, itemInfo.reward_icon);
	if(itemInfo.reward_params.Count - 1 >= 0)
		tarItemNumLbl.label.text = itemInfo.reward_params[itemInfo.reward_params.Count-1].ToString();
	if(itemInfo.reward_params.Count > 1){
		tarItemImgFrm.userData = itemInfo;
		tarItemImgFrm.mouseOverCallback = mouseOverCallback_tarItemImgFrm;
	}
	var exchangeBtn : iGUIButton = tarItemPanel.items[1] as iGUIButton;
	exchangeBtn.userData = itemInfo.id;
	exchangeBtn.clickCallback = clickCallback_exchangeBtn;
}

function mouseOverCallback_sourceItem(caller : iGUIElement){
	var id : int = Convert.ToInt32(caller.userData);
	var item_desc : String = ResManager.LgtMgr.getItemDescription(id);
	var style : GUIStyle = new GUIStyle();
	style.normal.textColor = Color.white;
	style.wordWrap = true;
	style.font = hintFont;
	style.fontStyle = FontStyle.Bold;
	Global.GetSysTooltip().Begin(caller);
	Global.GetSysTooltip().Add(GUIContent(item_desc), style);
	Global.GetSysTooltip().Show(true, 0, 100);	
}

function mouseOverCallback_tarItemImgFrm(caller : iGUIElement){
	var row : ExchangeRow = caller.userData as ExchangeRow;
	var reward_param : int = row.reward_params[0];
	var item_desc : String = "";
	if ("item_unlock_special_house" == row.reward_module) {
		var pshr : PlayerSpecialHouseRow = ResManager.LgtMgr.getPlayerSpecialHouseRow(reward_param);
		item_desc = pshr.desc;
	} else {
		item_desc = ResManager.LgtMgr.getItemDescription(reward_param);
	}
	var style : GUIStyle = new GUIStyle();
	style.normal.textColor = Color.white;
	style.wordWrap = true;
	style.font = hintFont;
	style.fontStyle = FontStyle.Bold;
	Global.GetSysTooltip().Begin(caller);
	Global.GetSysTooltip().Add(GUIContent(item_desc), style);
	Global.GetSysTooltip().Show(true, 0, 100);	
}

//
private function clickCallback_exchangeBtn(caller : iGUIElement){
	var id : int = Convert.ToInt32(caller.userData);
	reqExchange(id);
}

//
private function reqExchange(id : int){
	var req : req_exchange = new req_exchange();
	req.id = id;
	NetHelper.Send(req);
}

//
private function fillExchangeSourceItemInfo(itemID : int, num : int) : ExchangeSourceItemInfo{
	var itemRow : ItemRow = null;
	var sourceItemInfo : ExchangeSourceItemInfo = null;
	if(itemID != 0){
		itemRow = ResManager.LgtMgr.getItemRow(itemID);
		if(!itemRow)
			throw "itemID " + itemID + " is not exist!";
		sourceItemInfo = new ExchangeSourceItemInfo();
		sourceItemInfo.itemID = itemID;
		sourceItemInfo.itemIcon = itemRow.icon;
		sourceItemInfo.existingNum = SelfItemLogic.getInstance().getItemNum(itemID);
		sourceItemInfo.num = num;
	}
	return sourceItemInfo;
}

//--
private function loadExchangeItemIcon(imgFrm : iGUIImage, icon : String){
	var _asynIcon : AsynIcon = new AsynIcon(function (img : Texture){imgFrm.image = img;}, null);
	_asynIcon.load("Icon/" + icon);	
}

//
private function handlePageNumChanged(){
	if(!mPageMgr)
		return;
	
	var cur_p : int = mPageMgr.GetPageIndex();
	var t_p : int = mPageMgr.GetTotalPage();
	pageNumLbl.label.text = cur_p.ToString() + "/" + t_p.ToString();	
}

//
private function clickCallback_closeBtn(caller : iGUIElement){
	destroy();
	closeExchangeUIRoot();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLOSE_EXCHANGEUI));
}

//
private function destroy(){
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_EXCHANGE), handleNotifyExchange);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.EXCHANGELIST_PAGE_CHANGE), handleExchangeListPageChange);
	mClassifyDataList = null;
	mPageMgr = null;
}
//
private function closeExchangeUIRoot(){
	UI.getUI().SetModal("ExchangeUIRoot", false);
	UI.getUI().CloseUIRoot("ExchangeUIRoot");
}
//--
private function handleNotifyExchange(evt : GameEvent, obj : Object){
	if(!mPageMgr)
		return;
	
	var showList : ArrayList = mPageMgr.CurrPage();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.EXCHANGELIST_PAGE_CHANGE), showList);	
}

