#pragma strict

import iGUI;

class WishItemUserData{
	var mWishAccount : String;
	var mWishID : UInt64;
	var mPrice : int;
	var mPrice_type : int;
	
	function WishItemUserData(wish_acc : String,wish_id : UInt64, price : int, price_type : int){
		mWishAccount = wish_acc;
		mWishID = wish_id;
		mPrice = price;
		mPrice_type = price_type;
	}
}

class WishIcon extends PlatResInfoCtrl {
	public var imageElement : iGUIImage;
	public var nameElement : iGUILabel;
	
	//overwrite
	public function Callback() {
		iGUICode_WishListRoot.getInstance().Callback_SetHeadInfo(this);
	}
}

var mDelBtn_Txt_Img : Texture2D;
var mSatisfyBtn_Txt_Img : Texture2D;
private var mHeadInfoLoaderArray : Array = new Array();
private static var mWishRecordItemHeadName_MaxLen :int = 80;
private static var instance : iGUICode_WishListRoot;
function Awake(){
	instance=this;
	RegisetEvt();
}

static function getInstance(){
	return instance;
}

@HideInInspector
var text2Lbl : iGUILabel;
@HideInInspector
var text1Lbl : iGUILabel;
@HideInInspector
var guanZhuBtn : iGUIButton;
@HideInInspector
var visitBtn : iGUIButton;
@HideInInspector
var headImg : iGUIImage;
@HideInInspector
var recordContent : iGUILabel;
@HideInInspector
var wishRecrodItm : iGUIPanel;
@HideInInspector
var CloseImg : iGUIImage;
@HideInInspector
var singleWishWinHelpBtn : iGUIButton;
@HideInInspector
var otherWishWinHelBtn : iGUIButton;
@HideInInspector
var loversWinHelpBtn : iGUIButton;
@HideInInspector
var helpWin : iGUIPanel;
@HideInInspector
var image2 : iGUIImage;
@HideInInspector
var image1 : iGUIImage;
@HideInInspector
var singleWinCloseBtn : iGUIButton;
@HideInInspector
var loversWinCloseBtn : iGUIButton;
@HideInInspector
var otherWinCloseBtn : iGUIButton;
@HideInInspector
var selfWishRecordList : iGUIListBox;
@HideInInspector
var loversSelfWishRecrodList : iGUIListBox;
@HideInInspector
var loversLoverListScrollView : iGUIScrollView;
@HideInInspector
var loversSelfListScrollView : iGUIScrollView;
@HideInInspector
var otherListScrollView : iGUIScrollView;
@HideInInspector
var singleSelfListScrollView : iGUIScrollView;
@HideInInspector
var func_btn : iGUIButton;
@HideInInspector
var wish_content : iGUILabel;
@HideInInspector
var wishTime : iGUILabel;
@HideInInspector
var itm_img : iGUIImage;
@HideInInspector
var wishItm : iGUIPanel;
@HideInInspector
var otherWishList : iGUIPanel;
@HideInInspector
var otherWishTabPanel : iGUITabPanel;
@HideInInspector
var otherWishListWin : iGUIPanel;
@HideInInspector
var loversSelfWishBtn : iGUIButton;
@HideInInspector
var loversSelfWishRecrod : iGUIPanel;
@HideInInspector
var loversSelfWishList : iGUIPanel;
@HideInInspector
var loversWishTabPanel : iGUITabPanel;
@HideInInspector
var loversWishListWin : iGUIPanel;
@HideInInspector
var wishBtn : iGUIButton;

@HideInInspector
var selfWishRecord : iGUIPanel;
@HideInInspector
var selfWishList : iGUIPanel;
@HideInInspector
var singleWishTabPanel : iGUITabPanel;
@HideInInspector
var singleWishListWin : iGUIPanel;
@HideInInspector
var wishListRoot : iGUIRoot;

//
function RegisetEvt(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.TO_WISHLIST_MAX), NotifyToWishListMax);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.UPDATE_WISH_RECORD), NotifyWishRecords);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.DEL_WISH_DATA), NotifyDelWishData);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.ADD_WISH_DATA), NotifyAddWishData);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_TARGET_WISH_LSIT), NotifyUpdateTargetPlayerWishData);
	
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_CLEAR_TARGET_WISH_LIST), NotifyClearTargetPlayerWishList);
}
//
function Start(){
	CloseImg.clickCallback = HelpWinCloseBtnCallback;
	loversWinHelpBtn.clickCallback = HelpBtnClickCallback;
	otherWishWinHelBtn.clickCallback = HelpBtnClickCallback;
	singleWishWinHelpBtn.clickCallback = HelpBtnClickCallback;
	wishBtn.clickCallback = WishBtnClickCallback;
	loversSelfWishBtn.clickCallback = WishBtnClickCallback;
	singleWishTabPanel.tabChangeCallback = SingleWishTabChangeCallback;
	loversWishTabPanel.tabChangeCallback = LoversWishTabChangeCallback;
	otherWishTabPanel.tabChangeCallback = OtherWishTabChangeCallback;
	singleWinCloseBtn.clickCallback = _WinCloseBtnClickCallback;
	loversWinCloseBtn.clickCallback = _WinCloseBtnClickCallback;
	otherWinCloseBtn.clickCallback = _WinCloseBtnClickCallback;
}
//--
private function SingleWishTabChangeCallback(caller : iGUIElement){
	var tabpanel:iGUITabPanel = caller as iGUITabPanel;
	if(tabpanel.activePanel == 0){ //请求愿望列表
		ReqPlayerWishList(ScenePlayerMgr.getMainPlayerAccount());
	}
	else{ //请求满足的愿望的历史记录
		WishListComp.ReqWishRecord(ScenePlayerMgr.getMainPlayerAccount());
	}
}
//--
private function LoversWishTabChangeCallback(caller : iGUIElement){
	var tabpanel:iGUITabPanel = caller as iGUITabPanel;
	if(tabpanel.activePanel == 0){ //请求愿望列表
		ReqPlayerWishList(ScenePlayerMgr.getMainPlayerAccount());
	}
	else if(tabpanel.activePanel == 1){ //请求爱人的愿望列表
		ReqPlayerWishList(ScenePlayerMgr.GetMainPlayerLoverAccount());
	}
	else{ //请求满足的愿望的历史记录
		WishListComp.ReqWishRecord(ScenePlayerMgr.getMainPlayerAccount());
	}
}
//--
private function OtherWishTabChangeCallback(caller : iGUIElement){
	var tabpanel:iGUITabPanel = caller as iGUITabPanel;
	if(tabpanel.activePanel == 0){ //请求其他玩家愿望列表
		ReqPlayerWishList(Global.GetCurVisitHouseAccount());
	}
}
//
public function OpenOtherWishUI(account : String){
	otherWishListWin.setEnabled(true);
	UI.getUI().SetModal("WishListRoot", true);
	if(account == ""){
		ReqPlayerWishList(Global.GetCurVisitHouseAccount());
	}
	else{
		ReqPlayerWishList(account);
	}
}
//--
public function CloseOtherWishUI(){
	otherWishListWin.setEnabled(false);
	UI.getUI().SetModal("WishListRoot", false);
}
//
public function OpenSingleSelfWishUI(){
	singleWishListWin.setEnabled(true);
	UI.getUI().SetModal("WishListRoot", true);
	ReqPlayerWishList(ScenePlayerMgr.getMainPlayerAccount());
}
//
public function CloseSingleSelfWishUI(){
	singleWishListWin.setEnabled(false);
	UI.getUI().SetModal("WishListRoot", false);
}
//--
public function OpenLoversSelfWishUI(){
	loversWishListWin.setEnabled(true);
	UI.getUI().SetModal("WishListRoot", true);
	ReqPlayerWishList(ScenePlayerMgr.getMainPlayerAccount());
}
//--
public function CloseLoversSelfWishUI(){
	loversWishListWin.setEnabled(false);
	UI.getUI().SetModal("WishListRoot", false);
}
//--
private function ReqPlayerWishList(account : String){
	WishListComp.ReqWishList(account);
}
//--
private function NotifyAddWishData(evt:GameEvent, obj:WishClass){
	//Debug.Log("-----------" + obj.mWishId + "***" + obj.mGoodsId + "***" + obj.mWishAccount);
	var house : PlayerHouse = EQGameSceneMgr.getSingleton().getHouse();
	if(!WishListComp.has_two_owner){
		CreateWishItem(singleSelfListScrollView,obj,Define.me, mDelBtn_Txt_Img, _DelBtnClickCallback);
	}
	else{
		CreateWishItem(loversSelfListScrollView,obj,Define.me, mDelBtn_Txt_Img, _DelBtnClickCallback);
	}
}
//--少个按钮文字，回调函数，内容中玩家名字文字
function CreateWishItem(parent : iGUIElement, wish : WishClass, name : String, btn_txt_img : Texture2D, btn_clickCallback : iGUIEventCallback){
	var _scrollView : iGUIScrollView = parent as iGUIScrollView;
	var wish_itm_cnt : int = _scrollView.itemCount;
	var wish_itm : iGUIElement = _scrollView.addSmartObject("WishItem");
	var wish_itm_h : float = wish_itm.positionAndSize.height;
	var wish_itm_y : float = 0f;
	if(_scrollView.variableName == "singleSelfListScrollView"){
		wish_itm_y = wish_itm_h * (wish_itm_cnt - 1);
		wishBtn.setY(wish_itm_h * wish_itm_cnt);
	}
	else if(_scrollView.variableName == "loversSelfListScrollView"){
		wish_itm_y = wish_itm_h * (wish_itm_cnt - 1);
		loversSelfWishBtn.setY(wish_itm_h * wish_itm_cnt);
	}
	else if(_scrollView.variableName == "otherListScrollView" || "loversLoverListScrollView"){
		wish_itm_y = wish_itm_h * wish_itm_cnt;
	}
	
	if(wish_itm_y < 0)
		wish_itm_y = 0;
	wish_itm.setY(wish_itm_y);
	
	//设置许愿物品图标
	//获取商店表内容
	var itm_name : String = "";
	var itm_icon : String = "";
	var wish_itm_userData : WishItemUserData;
	if(wish.wish_type == 1){
		var shop_row : ShopCenterRow = _getShopTableRow(wish.mGoodsId);
		if(!shop_row){
			throw Exception("wish item cant find shoprow id:" + wish.mGoodsId.ToString()); 
		}
		var itm_row : ItemRow = _getItemRow(shop_row.item_id);
		if(!itm_row){
			throw Exception("wish item cant find itemrow id:" + shop_row.item_id.ToString()); 
		}
		itm_icon = itm_row.icon;
		itm_name = itm_row.name;
		wish_itm_userData = new WishItemUserData(wish.mWishAccount, wish.mWishId, DataCenter.getCostByPlatform(shop_row.price), shop_row.money_type);
	}
	else if(wish.wish_type == 2){
		var tmp_house_id : int = wish.mGoodsId;
		var row : PlayerSpecialHouseRow = ResManager.LgtMgr.getPlayerSpecialHouseRow(tmp_house_id);
		itm_icon = row.icon;
		itm_name = row.name;
		var mny_type : int = pay_goods_type.pgt_love_coin;
		wish_itm_userData = new WishItemUserData(wish.mWishAccount, wish.mWishId, DataCenter.getCostByPlatform(row.love_coin), mny_type);	
	}
	//设置许愿项的id
	wish_itm.userData = wish_itm_userData;
	//设置图像icon
	var _img_frm : iGUIImage = wish_itm.items[1] as iGUIImage;
	_LoadItemImg(_img_frm, itm_icon);
	//设置时间label
	wish_itm.items[3].label.text = iGUICode_NoticeRoot.FormatDateString(wish.mWishTime.year)	+ "-"
								 + iGUICode_NoticeRoot.FormatDateString(wish.mWishTime.month)	+ "-" 
								 + iGUICode_NoticeRoot.FormatDateString(wish.mWishTime.day)		+ "  "
								 + iGUICode_NoticeRoot.FormatDateString(wish.mWishTime.hour)	+ ":"
								 + iGUICode_NoticeRoot.FormatDateString(wish.mWishTime.minute);
	wish_itm.items[3].labelColor = new Color(1f,1f,1f);
	
	//设置内容label
	wish_itm.items[2].label.text = Define.getContent(5212, [name, itm_name]);
	wish_itm.items[2].labelColor = new Color(1f,1f,1f);
	//
	var del_btn : iGUIButton = wish_itm.items[0] as iGUIButton;//func_btn
	del_btn.label.text = "";
	del_btn.label.image = btn_txt_img;
	del_btn.clickCallback = btn_clickCallback;
}
//--
function _LoadItemImg(img_frm : iGUIImage, img_name : String){
	var _asynIcon : AsynIcon = new AsynIcon(function (tex : Texture){img_frm.image = tex; }, null);
	_asynIcon.load("Icon/" + img_name); 	
}
//--
function _getShopTableRow(id : int) : ShopCenterRow{
	var _row:ShopCenterRow = null;
	var _table:Array = ResManager.LgtMgr.ShopCenterTable;
	for(var obj:Object in _table)
	{
		var _r:ShopCenterRow = obj as ShopCenterRow;
		if(id == _r.goods_id)
		{
			_row = _r;
			break;
		}
	}
	if(_row == null)
		throw "Error: can't find shop center row which id is '" + id + "'!";
	return _row;
}
//--
function _getItemRow(id : int) : ItemRow{
	return ResManager.LgtMgr.getItemRow(id);
}
//--
private function _DelBtnClickCallback(caller : iGUIElement){
	var _wish_itm_userData : WishItemUserData = caller.getTargetContainer().userData as WishItemUserData;
	var del_itmID : UInt64 = _wish_itm_userData.mWishID;
	WishListComp.ReqDelWish(del_itmID);
}
//--
function NotifyUpdateTargetPlayerWishData(evt:GameEvent, obj:WishClass){
	//Debug.Log("-----------" + obj.wish_id + "***" + obj.goods_id + "***" + obj.account);
	if(ScenePlayerMgr.isMainPlayer(obj.mWishAccount)
		|| ScenePlayerMgr.IsMainPlayerLoverAccount(obj.mWishAccount)){
		CreateWishItem(loversLoverListScrollView, obj,"Ta", mSatisfyBtn_Txt_Img, _SatisfyBtnClickCallback);
	}
	else{
		CreateWishItem(otherListScrollView, obj,"Ta", mSatisfyBtn_Txt_Img, _SatisfyBtnClickCallback);
	}
}
//--
function _SatisfyBtnClickCallback(caller : iGUIElement){
	var _wish_itm_userData : WishItemUserData = caller.getTargetContainer().userData as WishItemUserData;
	if(_wish_itm_userData == null)
		return;
	var s_wish_account : String = _wish_itm_userData.mWishAccount;
	var s_wishID : UInt64 = _wish_itm_userData.mWishID;
	WishListComp.ReqSatisfyWish(s_wish_account, s_wishID, _wish_itm_userData.mPrice, _wish_itm_userData.mPrice_type);
}
//--
function NotifyClearTargetPlayerWishList(evt:GameEvent, obj:Object){
	//if(ScenePlayerMgr.isMainPlayer(obj.mWishAccount)
	//	|| ScenePlayerMgr.IsMainPlayerLoverAccount(obj.mWishAccount)){
		loversLoverListScrollView.removeAll();
	//}
	//else{
		otherListScrollView.removeAll();
	//}
}
//--
function NotifyDelWishData(evt:GameEvent, obj:WishClass){
	var house : PlayerHouse = EQGameSceneMgr.getSingleton().getHouse();
	if(!WishListComp.has_two_owner){
		_DelWish(singleSelfListScrollView,obj);
	}
	else{
		_DelWish(loversSelfListScrollView,obj);
	}
}
//--
private function _DelWish(scroll_view : iGUIScrollView, wish : WishClass){
	for(var i:int = 0; i < scroll_view.itemCount; ++ i){
		var _wish_itm_userData : WishItemUserData = scroll_view.items[i].userData as WishItemUserData;
		if(_wish_itm_userData != null){
			if(_wish_itm_userData.mWishID == wish.mWishId){
				scroll_view.removeElement(scroll_view.items[i]);
				_RePosWishList(scroll_view);
				break;
			}
		}
	}
}
//--
private function _RePosWishList(_scroll_view : iGUIScrollView){
	//--test
	var wish_itm_y : float = 0f;
	var wish_itm_h : float = 0f;
	for(var i :int=1; i < _scroll_view.itemCount; ++i){
		//Debug.LogWarning("_scroll_view--------" + i + "----" + _scroll_view.items[i].variableName);
		wish_itm_h = _scroll_view.items[i].positionAndSize.height;
		wish_itm_y = wish_itm_h * (i - 1);
		if(wish_itm_y < 0)
			wish_itm_y = 0;
		_scroll_view.items[i].setY(wish_itm_y);
	}
	var _addwish_btn_y : float = wish_itm_h * (_scroll_view.itemCount - 1);
	if(_addwish_btn_y < 0)
		_addwish_btn_y = 0;
	_scroll_view.items[0].setY(_addwish_btn_y);
	//--
	
}
//--
function NotifyWishRecords(evt:GameEvent, obj:ArrayList){	
	var house : PlayerHouse = EQGameSceneMgr.getSingleton().getHouse();
	if(!WishListComp.has_two_owner){
		_CreateRecordItm(selfWishRecordList,obj);
	}
	else{
		_CreateRecordItm(loversSelfWishRecrodList,obj);
	}

}
//--
private static var listbox_itm_order : float = 0;
private function _CreateRecordItm(list_box : iGUIListBox, record_list : ArrayList){
	clearHeadInfoLoder();
	list_box.removeAll();
	for(var i:int=0;i<record_list.Count;++i){
		var itm : player_love_wish_history = record_list[i] as player_love_wish_history;
		var satisfy_account : String = itm.satisfy_account;
		var record_goods_id : UInt64 = itm.goods_id;
		var wish_type : int = itm.wish_type;
		var wish_record_itm : iGUIElement = _CreateWishRecordItem(list_box);
		_SetWishRecordItemContent(wish_record_itm, satisfy_account, record_goods_id, wish_type);
		//for(var _i:int=0; _i < wish_record_itm.itemCount; ++_i)
		//	Debug.Log("--" + _i + "---"+ wish_record_itm.items[_i].variableName);
		

		/*
		guanzhubtn ---0
		headimg -------1
		recordContent----2
		visitbtn---5
		mWishRecordItemHeadName_MaxLen
		
		var contentItm:iGUILabel = list_box.addElement("iGUILabel");
		contentItm.setOrder(listbox_itm_order);
		contentItm.style.wordWrap = true;
		var shop_row : ShopCenterRow = _getShopTableRow(record_list[i].goods_id);
		Debug.Log("shop_colitemid....."+ shop_row.item_id);
		var itm_row : ItemRow = _getItemRow(shop_row.item_id);

		var content : String =  record_list[i].satisfy_account +"满足了你的愿望，你获得了" + itm_row.name;
		var contentHeight:float = contentItm.style.CalcHeight(new GUIContent(content),list_box.rect.width);
		contentItm.setHeight(contentHeight);
		contentItm.label.text = content;
		contentItm.style.fontStyle = FontStyle.Bold;
		//设置文本颜色
		contentItm.labelColor = new Color(0.125f,0.5f,0.72941f);
		++listbox_itm_order;
		list_box.refreshRect();
		*/
	}

}
//--
private function _SetWishRecordItemContent(record_itm : iGUIElement, account : String, goods_id : UInt64, wish_type : int){
	var headImg : iGUIImage = record_itm.items[1] as iGUIImage;
	var contentLbl : iGUILabel = record_itm.items[2] as iGUILabel;
	//头像名字
	var headInfo : WishIcon = new WishIcon();
	headInfo.imageElement = headImg;
	headInfo.nameElement = contentLbl;
	var headInfoLoader : PlatResLoader = Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(account,headInfo);
	mHeadInfoLoaderArray.Add(headInfoLoader);
	//物品内容
	var content : String = "";
	if(wish_type == 1){
		var shop_row : ShopCenterRow = _getShopTableRow(goods_id);
		var itm_row : ItemRow = _getItemRow(shop_row.item_id);
		content =  Define.getContent(5213, [itm_row.name]);
	}
	else if(wish_type == 2){
		var tmp_house_id : int = goods_id;
		var house_row : PlayerHouseRow = ResManager.LgtMgr.PlayerHouseTable[tmp_house_id] as PlayerHouseRow;
		content =  Define.getContent(5213, [house_row.name]);

	}
	//record_itm.items[4].labelColor = new Color(0.125f,0.5f,0.72941f);
	record_itm.items[4].label.text = content;
	record_itm.items[4].label.tooltip = content;
	//设置按钮回调
	var _gzBtn : iGUIButton = record_itm.items[0] as iGUIButton;
	var _visit_btn : iGUIButton = record_itm.items[5] as iGUIButton;
	record_itm.userData = account;
	_gzBtn.clickCallback = _AddGuanZhuBtnCallback;
	_visit_btn.clickCallback = _VisitBtnCallback;
	
}
//--
function _AddGuanZhuBtnCallback(caller : iGUIElement){
	FollowLogic.GetInstance().AddAttention(Convert.ToString(caller.getTargetContainer().userData));
}
//--
function _VisitBtnCallback(caller : iGUIElement){
	PlayerFriend.GetInstance().ReqEnterFriendHouse(Convert.ToString(caller.getTargetContainer().userData),enter_house_type.eht_wish);
}
//--
function Callback_SetHeadInfo(obj : WishIcon){
	if(obj.URLValid){
		obj.imageElement.image = obj.image;
	}
	else{
		obj.imageElement.image = Resources.Load("UISkins/Textures/Common1/default_avatar") as Texture2D;
	}
	
	//
	var _head_name : String = "";
	if("" == obj.info.nickname){
		_head_name = Define.noname;
	}
	else{
		_head_name = obj.info.nickname;
		obj.nameElement.label.tooltip = _head_name;
	}
	//
	var show_name : String = _head_name;
	var name_width : float = obj.nameElement.style.CalcSize(GUIContent(_head_name)).x;
	if(name_width > mWishRecordItemHeadName_MaxLen){
		var _subs : String = iGUICode_MainUI.getInstance()._MatchHouseNameLength(_head_name, mWishRecordItemHeadName_MaxLen);
		_subs = _subs + "...";
		show_name = _subs;
	}
	else{
		var _name_lbl : iGUILabel = obj.nameElement;
		_name_lbl.setWidth(name_width);
		_name_lbl.getTargetContainer().items[3].setX(_name_lbl.positionAndSize.x + name_width);
	}
	obj.nameElement.label.text = show_name;
}
//--
private function _CreateWishRecordItem(parent : iGUIListBox) : iGUIElement{
	var _wish_record_item : iGUIElement = parent.addSmartObject("WishRecordItem");
	_wish_record_item.setOrder(listbox_itm_order);
	++ listbox_itm_order;
	return _wish_record_item;
}
//--
private function _WinCloseBtnClickCallback(caller : iGUIElement){
	if(caller.variableName == "wishBtn"){
		singleWishListWin.setEnabled(false);
	}
	else if(caller.variableName == "loversSelfWishBtn"){
		loversWishListWin.setEnabled(false);
	}
	else if(caller.variableName == "otherWinCloseBtn" || 
			caller.variableName == "loversWinCloseBtn" || 
			caller.variableName == "singleWinCloseBtn"){
		caller.getTargetContainer().setEnabled(false);
	}
	HelpWinCloseBtnCallback(null);
	UI.getUI().SetModal("WishListRoot", false);
}
//--
private function WishBtnClickCallback(caller : iGUIElement){
	iGUICode_MainUI.OpenDressUI();
	_WinCloseBtnClickCallback(caller);
}
//--
function HelpBtnClickCallback(caller : iGUIElement){
	if(!helpWin.enabled){
		helpWin.setEnabled(true);
		loversWishListWin.passive = true;
		otherWishListWin.passive = true;
		singleWishListWin.passive = true;
	}
}
//--
function HelpWinCloseBtnCallback(caller : iGUIElement){
	if(helpWin.enabled){
		helpWin.setEnabled(false);
		loversWishListWin.passive = false;
		otherWishListWin.passive = false;
		singleWishListWin.passive = false;
	}
}
//--
function NotifyToWishListMax(evt:GameEvent, flag:boolean){
	if(!WishListComp.has_two_owner){
		wishBtn.setEnabled(!flag);
	}
	else{
		loversSelfWishBtn.setEnabled(!flag);
	}
}
// 清除异步加载图片
function clearHeadInfoLoder()
{
	for (var obj : Object in mHeadInfoLoaderArray)
	{
		var loader : PlatResLoader = obj as PlatResLoader;
		loader.Cancel();
	}
	mHeadInfoLoaderArray.Clear();
}
//--
function OnDestroy(){
	clearHeadInfoLoder();
}