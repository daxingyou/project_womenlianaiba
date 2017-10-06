#pragma strict
#pragma downcast
import iGUI;

var test_data : int = 0;
var myPlantGridNum : int = 32;
var myPlantGridCul : int = 8;

private static var instance : iGUICode_HouseUpdateRoot;
function Awake(){
	instance=this;
	RegistEvt();
}
static function getInstance(){
	return instance;
}
@HideInInspector
var free_move_count_label : iGUILabel;
@HideInInspector
var love_coin_label : iGUILabel;
@HideInInspector
var tab2Ctrl : iGUIImage;
@HideInInspector
var tab3Ctrl : iGUIImage;
@HideInInspector
var myPlantListNextPageBtn : iGUIButton;
@HideInInspector
var myPlantListPrePageBtn : iGUIButton;
@HideInInspector
var plantContainer : iGUIContainer;
@HideInInspector
var myPlantTab : iGUIPanel;
@HideInInspector
var image4 : iGUIImage;
@HideInInspector
var myPlantListPageNum : iGUILabel;
@HideInInspector
var label13 : iGUILabel;
@HideInInspector
var label12 : iGUILabel;
@HideInInspector
var label11 : iGUILabel;
@HideInInspector
var label9 : iGUILabel;
@HideInInspector
var label8 : iGUILabel;
@HideInInspector
var normal_hao_hua_du_max : iGUILabel;
@HideInInspector
var special_hao_hua_du_max : iGUILabel;
@HideInInspector
var my_house_hao_hua_du_max : iGUILabel;
@HideInInspector
var normal_house_name : iGUILabel;
@HideInInspector
var normal_hao_hua_du : iGUILabel;
@HideInInspector
var normal_hao_hua_du_tip : iGUILabel;
@HideInInspector
var my_house_hao_hua_du : iGUILabel;
@HideInInspector
var my_house_hao_hua_du_tip : iGUILabel;
@HideInInspector
var my_house_name : iGUILabel;
@HideInInspector
var special_hao_hua_du : iGUILabel;
@HideInInspector
var special_hao_hua_du_tip : iGUILabel;
@HideInInspector
var special_house_name : iGUILabel;
@HideInInspector
var myHouselistTab : iGUIPanel;
@HideInInspector
var cur_use_special_frm : iGUIPanel;
@HideInInspector
var fanhuiBtn : iGUIButton;
@HideInInspector
var cur_sel_pre_special_house_frm : iGUIPanel;
@HideInInspector
var sel_speical_house_frm : iGUIPanel;
@HideInInspector
var moveSecialHouseBtn : iGUIButton;
@HideInInspector
var closeMyHouseListWinBtn : iGUIButton;
@HideInInspector
var buySpecialHouseBtn : iGUIButton;
@HideInInspector
var myHouseListPageTxt : iGUILabel;
@HideInInspector
var myHouseListNextPageBtn : iGUIButton;
@HideInInspector
var myHouseListPrePageBtn : iGUIButton;

@HideInInspector
var myHouseTip : iGUILabel;
@HideInInspector
var myHousePreview : iGUIImage;
@HideInInspector
var myHouseListContainer : iGUIContainer;
@HideInInspector
var myHouseListPanel : iGUIPanel;
@HideInInspector
var myHouseListWinTitle : iGUIImage;
@HideInInspector
var myHouseListWin : iGUIPanel;
@HideInInspector
var myHouseListBtn : iGUIButton;
@HideInInspector
var label10 : iGUILabel;
@HideInInspector
var label_remain : iGUILabel;
@HideInInspector
var remainNum : iGUILabel;
@HideInInspector
var specialListPageTxt : iGUILabel;
@HideInInspector
var specialListNextPageBtn : iGUIButton;
@HideInInspector
var specialListPrePageBtn : iGUIButton;
@HideInInspector
var specialHouseTip : iGUILabel;
@HideInInspector
var specialHousePreview : iGUIImage;
@HideInInspector
var specialHouseListContainer : iGUIContainer;
@HideInInspector
var specialPanel : iGUIPanel;
@HideInInspector
var cur_right_frm : iGUIPanel;
@HideInInspector
var returnRightBtn : iGUIButton;
@HideInInspector
var closeHelpWinBtn : iGUIButton;
@HideInInspector
var helpWin : iGUIPanel;
@HideInInspector
var cur_use_frm : iGUIPanel;
@HideInInspector
var select_house_frm : iGUIPanel;
@HideInInspector
var move_btn : iGUIButton;
@HideInInspector
var house_tip : iGUILabel;
@HideInInspector
var preview_img : iGUIImage;
@HideInInspector
var container1 : iGUIContainer;
@HideInInspector
var rightGradeListContainer : iGUIContainer;
@HideInInspector
var houseListContainer : iGUIContainer;
@HideInInspector
var houseLisPageLabel : iGUILabel;
@HideInInspector
var nextPageHLBtn : iGUIButton;
@HideInInspector
var prePageHLBtn : iGUIButton;
@HideInInspector
var house_list_right_desc : iGUILabel;
@HideInInspector
var image2 : iGUIImage;
@HideInInspector
var image1 : iGUIImage;
@HideInInspector
var closeHouseListBtn : iGUIButton;
@HideInInspector
var houseListPanel : iGUIPanel;
@HideInInspector
var label7 : iGUILabel;
@HideInInspector
var label6 : iGUILabel;
@HideInInspector
var addDiamondBtn : iGUIButton;
@HideInInspector
var requestRightBtn : iGUIButton;
@HideInInspector
var label5 : iGUILabel;
@HideInInspector
var label4 : iGUILabel;
@HideInInspector
var diamondRequestLbl : iGUILabel;
@HideInInspector
var label3 : iGUILabel;
@HideInInspector
var lvRequestLbl : iGUILabel;
@HideInInspector
var label2 : iGUILabel;
@HideInInspector
var label1 : iGUILabel;
@HideInInspector
var closeConfirmBtn : iGUIButton;
@HideInInspector
var updateConfirmPanel : iGUIPanel;
@HideInInspector
var pageLabel : iGUILabel;
@HideInInspector
var nextPageBtn : iGUIButton;
@HideInInspector
var prePageBtn : iGUIButton;
@HideInInspector
var normalPanel : iGUIPanel;
@HideInInspector
var houseLvtabPanel : iGUITabPanel;
@HideInInspector
var helpImg : iGUIImage;
@HideInInspector
var titleImage : iGUIImage;
@HideInInspector
var closeBtn : iGUIButton;
@HideInInspector
var houseLvListPanel : iGUIPanel;
@HideInInspector
var houseUpdateRoot : iGUIRoot;

//--
var mNotOpenGrade : int = 4;
var cul_num : int = 5;
private var row_num : int = 0;
var mLvWeight : int = 5;
var itm_space : float = 2;
var container_w_space : float = 27;
var container_h_space : float = 21;
var mHouseRightPageNum : int = 10;
var houseright_desc_txt_style : GUIStyle;
var res_location : String = "UISkins/Textures/HouseUpdate/";
var lock_img_name : String = "lock_img";
private var mHouseRightPageMgr : PagerMgr = null;
//--
function Start(){
	UpdateTab2Tab3BtnStyle(0);
	myPlantListNextPageBtn.clickCallback = ClickCallback_myPlantListNextPageBtn;
	myPlantListPrePageBtn.clickCallback = ClickCallback_myPlantListPrePageBtn;
	fanhuiBtn.clickCallback = ClickCallback_fanhuiBtn;
	specialListPrePageBtn.clickCallback = Clickcallback_specialListPrePageBtn;
	specialListNextPageBtn.clickCallback = Clickcallback_specialListNextPageBtn;
	myHouseListPrePageBtn.clickCallback = ClickCallback_myHouseListPrePageBtn;
	myHouseListNextPageBtn.clickCallback = ClickCallback_myHouseListNextPageBtn;
	moveSecialHouseBtn.clickCallback = ClickCallback_moveSecialHouseBtn;
	closeMyHouseListWinBtn.clickCallback = ClickCallback_closeMyHouseListWinBtn;
	myHouseListBtn.clickCallback = ClickCallback_myHouseListBtn;
	buySpecialHouseBtn.clickCallback = ClickCallback_buySpecialHouseBtn;
	houseLvtabPanel.tabChangeCallback = TabChangeCallback_houseLvtabPanel;
	returnRightBtn.clickCallback = ClickCallback_returnRightBtn;
	image2.clickCallback = ClickCallback_helpImg;
	helpImg.clickCallback = ClickCallback_helpImg;
	closeHelpWinBtn.clickCallback = ClickCallback_closeHelpWinBtn;
	move_btn.clickCallback = ClickCallback_move_btn;
	nextPageBtn.clickCallback = ClickCallback_nextPageBtn;
	prePageBtn.clickCallback = ClickCallback_prePageBtn;
	nextPageHLBtn.clickCallback = ClickCallback_nextPageHLBtn;
	prePageHLBtn.clickCallback = ClickCallback_prePageHLBtn;
	closeHouseListBtn.clickCallback = ClickCallback_closeHouseListBtn;
	closeConfirmBtn.clickCallback = ClickCallback_closeConfirmBtn;
	closeBtn.clickCallback = ClickCallback_closeRightListBtn;
	//requestRightBtn.clickCallback = ClickCallback_requestRightBtn;
	addDiamondBtn.clickCallback = ClickCallback_addDiamondBtn;
}
//--
function RegistEvt(){
	//UPDATE_MY_SPECIAL_HOUSE_LIST
//	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.UPDATE_MY_SPECIAL_HOUSE_LIST), HandleUpdateMySpecialHouseList);
	//UPDATE_SPECIAL_HOUSE_LIST
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.UPDATE_SPECIAL_HOUSE_LIST), HandleUpdateSpecialHouseList);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.LOAD_HOUSERIGHTDATA_OK), HandleLoadHouseRightData);
	//UPDATE_HOUSE_RIGHT_GRADE
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.UPDATE_HOUSE_RIGHT_GRADE), HandleUpdateHouseRightGrade);
	//HOUSELIST_PAGE_CHANGE
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.HOUSELIST_PAGE_CHANGE), HandleHouseListPageChange);
	//HOUSERIGHT_PAGE_CHANGE
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.HOUSERIGHT_PAGE_CHANGE), HandleHouseRightPageChange);
	//MYSPECIALHOUSE_PAGE_CHANGE
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MYSPECIALHOUSE_PAGE_CHANGE), HandleMySpecialHousePageChange);
	//--
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.SPECIALHOUSE_PAGE_CHANGE), HandleSpecialHousePageChange);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MYPLANTUNLOCKLIST_PAGE_CHANGE), HandleMyPlantUnlockListPageChange);
	//
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_UNLOCK_SPECIAL_HOUSE), HandleUnlockSpecialHouse);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_UNLOCK_SPECIAL_HOUSE_INFO), HandleUnlockSpecialHouseInfo);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_GET_FREE_COUNT_FOR_MOVING_SPECIAL_HOUSE), HandleGetFreeCountForMovingSpecialHouse);
}
//--
function HandleLoadHouseRightData(evt : GameEvent, arr : ArrayList){
	mHouseRightPageMgr = new PagerMgr(arr, mHouseRightPageNum);
	var show_list : ArrayList = mHouseRightPageMgr.CurrPage();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.HOUSERIGHT_PAGE_CHANGE), show_list);
}
//--
function ShowHouseRightData(arr : ArrayList){
	rightGradeListContainer.removeAll();
	var t_cnt : float = arr.Count;
	if(t_cnt <= 0){
		Debug.LogError("table is null");
	}
	
	var _result : float = t_cnt / cul_num;
	row_num = System.Math.Ceiling(_result);
	
	var icon_h : int = 56;
	var icon_w : int = 56;
	var _f_itm : HouseRightRow = arr[0] as HouseRightRow;
	if(_f_itm){
		var icon_img : Texture2D = Resources.Load(res_location + _f_itm.icon) as Texture2D;
		if(icon_img){
			icon_h = 56;//icon_img.height;
			icon_w = 56;//icon_img.width;
		}
	}
	
	for(var _r_cnt:int=0; _r_cnt < row_num; ++ _r_cnt){
			for(var _c_cnt:int=0; _c_cnt < cul_num; ++ _c_cnt){
				var posx : float = _c_cnt * icon_w;
				var posy : float = _r_cnt * icon_h;
				var idx : int = cul_num * _r_cnt + _c_cnt;
				if(idx >= 0 && idx < t_cnt){
					var _houseRight_itm : HouseRightRow = arr[idx] as HouseRightRow;
					AddRightIconContainer(_houseRight_itm, icon_w, icon_h, posx, posy, _r_cnt, _c_cnt);
				}
			}
		}
}
//--
function AddRightIconContainer(itm : HouseRightRow, icon_w : int, icon_h : int, posx : float, posy : float, cur_r : int, cur_c : int){
	var itm_container : iGUIContainer = rightGradeListContainer.addElement("iGUIContainer") as iGUIContainer;
	itm_container.userData = itm;
	
	var itm_img : iGUIImage = itm_container.addElement("iGUIImage") as iGUIImage;
	itm_img.userData = itm;
	var itm_lock : iGUIImage = itm_container.addElement("iGUIImage") as iGUIImage;
	itm_lock.variableName = lock_img_name;
	itm_lock.userData = itm;
	var itm_desc : iGUILabel = itm_container.addElement("iGUILabel") as iGUILabel;
	itm_desc.style = houseright_desc_txt_style;
	itm_desc.label.text = itm.desc;
	var _tex : Texture2D = Resources.Load(res_location + itm.icon) as Texture2D;
	var hover_tex : Texture2D = Resources.Load(res_location + itm.hover_icon) as Texture2D;
	var tex_w : float = 56;//_tex.width;
	var tex_h : float = 56;//_tex.height;
	if(itm.grade < mNotOpenGrade){
		itm_img.clickCallback = ClickCallback_RightItmImg;
	}
	else{
		itm_img.clickCallback = ClickCallback_Limited;
	}
	itm_img.image = _tex;
	itm_img.hoverImage = hover_tex;
	itm_img.setWidth(tex_w);
	itm_img.setHeight(tex_h);
	itm_img.setX(0.5f);
	itm_img.setY(0f);
	itm_lock.image = Resources.Load(res_location + "fangwu_suo") as Texture2D;
	if(itm.grade < mNotOpenGrade){
		itm_lock.clickCallback = ClickCallback_RightItmLock;
	}
	else{
		itm_lock.clickCallback = ClickCallback_Limited;
	}
	itm_lock.setWidth(tex_w);
	itm_lock.setHeight(tex_h);
	itm_lock.setX(0.5f);
	itm_lock.setY(0f);
	//itm_lock.setEnabled(false);
	var word_h : float = itm_desc.style.CalcHeight(GUIContent(itm.desc), tex_w);
	itm_desc.setPositionAndSize(Rect(0.5f, tex_h + itm_space, tex_w, word_h));
	itm_container.setWidth(tex_w);
	itm_container.setHeight(tex_h + itm_space + word_h);
	posx = posx + cur_c * container_w_space;
	posy = posy + cur_r * (word_h + container_h_space);
	itm_container.setX(posx);
	itm_container.setY(posy);
	var r_cont_w : float = row_num * tex_w + (row_num - 1) * container_w_space;
	var r_cont_h : float = cul_num * tex_h + (cul_num - 1) * container_h_space;
	rightGradeListContainer.setWidth(r_cont_w);
	rightGradeListContainer.setHeight(r_cont_h);
	//rightGradeListContainer.setX(0.5f);
	//rightGradeListContainer.setY(0.5f);
	SetCurRightFrm(itm_container);
	NewHandGuideLogic.excuteEvent("ADD_RIGHT_ICON_CONTAINER", itm);
}
//--
function ClickCallback_RightItmImg(caller : iGUIElement){
	var _itm : HouseRightRow = caller.userData as HouseRightRow;
	LoadHouseData(_itm.grade);
	//
	CloseHouseRightListUI();
	OpenHouseListUI(_itm.grade);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_RIGHT_ITM_IMG));
}
//--
function ClickCallback_Limited(caller : iGUIElement){
	Global.GetSysMsgHandler().ShowSysMsg(421);
}
//--
function ClickCallback_RightItmLock(caller : iGUIElement){
	OpenUnlockConfirmUI(caller);
	//SetWinPassive(houseLvListPanel, true);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_RIGHT_LOCK));
}
//--
function ClickCallback_addDiamondBtn(caller : iGUIElement){
	PropShopLogic.Ctrl.Excute("open_prop_shop_ui", 0);
}
//--
function ClickCallback_closeConfirmBtn(caller : iGUIElement){
	CloseUnlockConfirmUI();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_CONFIRMWIN));
	//SetWinPassive(houseLvListPanel, false);
}
//--
function HandleUpdateHouseRightGrade(evt : GameEvent, obj : int){
	var itms : iGUIElement[] = rightGradeListContainer.items;
	var itm_arr : Array = new Array(itms);
	for(var _obj : Object in itm_arr){
		var ele : iGUIElement = _obj as iGUIElement;
		var _itm : HouseRightRow = ele.userData  as HouseRightRow;
		if(obj >= _itm.grade){
			var _c : iGUIContainer = ele as iGUIContainer;
			if(_c.items[1].variableName == lock_img_name)
				_c.removeElement(_c.items[1]);
		}
	}
}
//--
function ClickCallback_closeRightListBtn(caller : iGUIElement){
	CloseHouseRightListUI();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLOSE_HOUSERIGHTLISTUI));
}
//--
function ClickCallback_closeHouseListBtn(caller : iGUIElement){
	CloseHouseListUI();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_HOUSELIST));
}
//--分页
//--
function ClickCallback_nextPageBtn(caller : iGUIElement){
	var list : ArrayList = mHouseRightPageMgr.NextPage();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.HOUSERIGHT_PAGE_CHANGE), list);
}
//--
function ClickCallback_prePageBtn(caller : iGUIElement){
	var list : ArrayList = mHouseRightPageMgr.PrevPage();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.HOUSERIGHT_PAGE_CHANGE), list);
}
//--
function HandleHouseRightPageChange(evt : GameEvent, obj : Object){
	ShowHouseRightData(obj as ArrayList);
	HandleUpdateHouseRightGrade(null, HouseUpdateComp.mCur_grade);
	UpdateHouseRightPageNumTxt();
}
//--
function UpdateHouseRightPageNumTxt(){
	var cur_p : int = mHouseRightPageMgr.GetPageIndex();
	var t_p : int = mHouseRightPageMgr.GetTotalPage();
	var p_txt : String = cur_p.ToString() + " / " + t_p.ToString();
	pageLabel.label.text = p_txt;
}
//--
function GetCurGradeRight(house_id : int) : int {
	var phr:PlayerHouseRow = ResManager.LgtMgr.PlayerHouseTable[house_id] as PlayerHouseRow;
	if(phr != null){
		var cur_right : int = phr.right_grade;
		return cur_right;
	}
	else{
		return -1;
	}
}
//--
function SetCurRightFrm(ele : iGUIElement){
	if(ele != null){
		var cur_right : int = GetCurGradeRight(DataCenter.getSelfHouseData().template_id);
		if(cur_right != -1){
			var right : int = (ele.userData as HouseRightRow).grade;
			if(right == cur_right){
				var p_posx : float = rightGradeListContainer.positionAndSize.x;
				var p_posy : float = rightGradeListContainer.positionAndSize.y;
				var c_posx : float = ele.positionAndSize.x;
				var c_posy : float = ele.positionAndSize.y;
				var n_posx : float = p_posx + c_posx + ele.positionAndSize.width/2 - cur_right_frm.positionAndSize.width/2;
				var n_posy : float = p_posy + c_posy - cur_right_frm.positionAndSize.height + 10;
				cur_right_frm.setX(n_posx);
				cur_right_frm.setY(n_posy);
				cur_right_frm.setEnabled(true);
			}
		}
	}
	else{
		cur_right_frm.setEnabled(false);
	}
	
}
//--------------------------开关窗口
//---
//--
function OpenHouseRightListUI(){
	houseLvtabPanel.activePanel = 0;
	//houseLvListPanel.style = normal_house_win_style;
	houseLvListPanel.setEnabled(true);
	UI.getUI().SetModal("HouseUpdateRoot", true);
}
//--
function CloseHouseRightListUI(){
	auto_select_first = false;
	SetSpecialHouseSelected(null);
	ShowSpecialHouseDetail(0);
	SetCurSelectSpecialHouseID(0);
	houseLvListPanel.setEnabled(false);
	CloseHelpWin();
	UI.getUI().SetModal("HouseUpdateRoot", false);
}
//--
function OpenUnlockConfirmUI(caller : iGUIElement){
	var _itm : HouseRightRow = caller.userData  as HouseRightRow;
	requestRightBtn.userData = _itm;
	
	var material1_id : int = _itm.material1;
	var num1 : int = _itm.num1;
	var material2_id : int = _itm.material2;
	var num2 : int = _itm.num2;
	var material3_id : int = _itm.material3;
	var num3 : int = _itm.num3;
	var material4_id : int = _itm.material4;
	var num4 : int = _itm.num4;
	
	var material1_goodsid : int = _itm.material1_shop_id;
	var material2_goodsid : int = _itm.material2_shop_id;
	var material3_goodsid : int = _itm.material3_shop_id;
	var material4_goodsid : int = _itm.material4_shop_id;
	
	var existing_material1_num : int = SelfItemLogic.getInstance().getItemNum(material1_id);
	var existing_material2_num : int = SelfItemLogic.getInstance().getItemNum(material2_id);
	var existing_material3_num : int = SelfItemLogic.getInstance().getItemNum(material3_id);
	var existing_material4_num : int = SelfItemLogic.getInstance().getItemNum(material4_id);
	
	var material1_info : UnlockMaterialItemsClass = new UnlockMaterialItemsClass(material1_id, material1_goodsid, existing_material1_num, num1);
	var material2_info : UnlockMaterialItemsClass = new UnlockMaterialItemsClass(material2_id, material2_goodsid, existing_material2_num, num2);
	var material3_info : UnlockMaterialItemsClass = new UnlockMaterialItemsClass(material3_id, material3_goodsid, existing_material3_num, num3);
	var material4_info : UnlockMaterialItemsClass = new UnlockMaterialItemsClass(material4_id, material4_goodsid, existing_material4_num, num4);
	
	var unlockMaterialArray : Array = new Array();
	unlockMaterialArray.clear();
	unlockMaterialArray.Push(material1_info);
	unlockMaterialArray.Push(material2_info);
	unlockMaterialArray.Push(material3_info);
	unlockMaterialArray.Push(material4_info);
	
	var houseRightInfo : UnLockItemInfoClass = new UnLockItemInfoClass();
	houseRightInfo.name = _itm.desc;
	houseRightInfo.item_id = 0;
	houseRightInfo.icon = _itm.icon;
	var need_lv : int = _itm.grade * mLvWeight;
	var need_diamond : int = _itm.money;
	
	OpenUnLockInfoRoot();
	if(iGUICode_UnLockInfoRoot.getInstance()){
		iGUICode_UnLockInfoRoot.getInstance().ExtenalInitData(houseRightInfo, need_diamond, need_lv, unlockMaterialArray);
	}
	//var itm_row : ItemRow = ResManager.LgtMgr.getItemRow(material1_id);
	/*
	lvRequestLbl.label.text = need_lv.ToString();
	if(IsLvEnough(need_lv)){
		lvRequestLbl.labelColor = Color(0.83,0.21,0.53);
		label4.setEnabled(false);
	}
	else{
		lvRequestLbl.labelColor = Color.red;
		label4.setEnabled(true);
	}
	diamondRequestLbl.label.text = need_diamond.ToString();
	if(IsDiamondEnough(need_diamond)){
		diamondRequestLbl.labelColor = Color(0.83,0.21,0.53);
		label5.setEnabled(false);
	}
	else{
		diamondRequestLbl.labelColor = Color.red;
		label5.setEnabled(true);
	}
	updateConfirmPanel.setEnabled(true);
	*/
}
//--
function OpenUnLockInfoRoot(){
	UI.getUI().OpenUIRoot("UnLockInfoRoot");
	UI.getUI().SetModal("UnLockInfoRoot", true);
}
//--
function CloseUnlockConfirmUI(){
	updateConfirmPanel.setEnabled(false);
}
//--
function SetWinPassive(p : iGUIElement, f : boolean){
	p.passive = f;
}
//--
function ClickCallback_helpImg(caller : iGUIElement){
	OpenHelpWin();
}
//--
function OpenHelpWin(){
	helpWin.setEnabled(true);
	houseListPanel.passive = true;
	houseLvListPanel.passive = true;
	myHouseListWin.passive = true;
	updateConfirmPanel.passive = true;
	UI.getUI().SetTopDepth("HouseUpdateRoot");
}
//--
function ClickCallback_closeHelpWinBtn(caller : iGUIElement){
	CloseHelpWin();
}
//--
function CloseHelpWin(){
	helpWin.setEnabled(false);
	houseListPanel.passive = false;
	houseLvListPanel.passive = false;
	myHouseListWin.passive = false;
	updateConfirmPanel.passive = false;
	setNewGuideInTop();
}
//--
// 重新设置新手界面最高层
private static function setNewGuideInTop() : void
{
	if (20006 == NewPlayGuideModule.CurNewHandSuffix || 10006 == NewPlayGuideModule.CurNewHandSuffix)
	{
		UI.getUI().SetTopDepth("StepLeadRoot");
	}
}
//------------------------------------------------------------------------------------------
//--
//--
//------
//--
var mHouseDataPageNum : int = 10;
var mHouseDataCul_num : float = 5;
var house_icon_w : int = 56;
var house_icon_h : int = 56;
var house_icon_desc_space : float = 2;
var house_icon_w_space : int = 27;
var house_icon_h_space : int = 20;
var house_desc_style : GUIStyle;
private var mHouseDataRow_num : int = 0;
private var mCurSelectHouse_TpltId : int = 0;
private var mHouseDataPageMgr : PagerMgr;
//--
function LoadHouseData(grade : int){
	var house_t : Hashtable = ResManager.LgtMgr.PlayerHouseTable;
	var _t : ArrayList = new ArrayList();
	for(var obj : Object in house_t.Values){
		var row : PlayerHouseRow = obj as PlayerHouseRow;
		if(row.right_grade == grade/* && row.is_single == HouseUpdateComp.is_single*/){
			_t.Add(row);
		}
	}
	
	//
	houseListContainer.removeAll();
	var t_cnt : int = _t.Count;
	if(t_cnt <= 0){
		return;
	}
	_t.Sort();
	mHouseDataPageMgr = new PagerMgr(_t, mHouseDataPageNum);
	var curShowHouseDataList : ArrayList = mHouseDataPageMgr.CurrPage();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.HOUSELIST_PAGE_CHANGE), curShowHouseDataList);
}
//--
function ShowHouseDataList(t : ArrayList){
	houseListContainer.removeAll();
	var t_cnt : float = t.Count;
	var _result : float = t_cnt / mHouseDataCul_num;
	row_num = System.Math.Ceiling(_result);
	for(var _r_cnt:int=0; _r_cnt < row_num; ++ _r_cnt){
		for(var _c_cnt:int=0; _c_cnt < mHouseDataCul_num; ++ _c_cnt){
			var posx : float = _c_cnt * house_icon_w;
			var posy : float = _r_cnt * house_icon_h;
			var idx : int = mHouseDataCul_num * _r_cnt + _c_cnt;
			if(idx >= 0 && idx < t_cnt){
				var _house_itm : PlayerHouseRow = t[idx] as PlayerHouseRow;
				AddHouseIconContainer(_house_itm, house_icon_w, house_icon_h, posx, posy, _r_cnt, _c_cnt);
			}
		}
	}
}
//--
function AddHouseIconContainer(itm : PlayerHouseRow, house_icon_w : int, house_icon_h : int, posx : float, posy : float, cur_r : int, cur_c : int){
	var itm_container : iGUIContainer = houseListContainer.addElement("iGUIContainer") as iGUIContainer;
	var itm_img : iGUIImage = itm_container.addElement("iGUIImage") as iGUIImage;
	itm_img.userData = itm;
	itm_img.clickCallback = ClickCallback_HouseDataItm;
	itm_img.setPositionAndSize(Rect(0.5,0,house_icon_w,house_icon_h));
	_LoadItemImg(itm_img, itm.icon);
	//
	var itm_name : iGUILabel = itm_container.addElement("iGUILabel") as iGUILabel;
	itm_name.style = house_desc_style;
	var word_h : float = itm_name.style.CalcHeight(GUIContent(itm.name), house_icon_w);
	itm_name.setPositionAndSize(Rect(0.5f, house_icon_h + house_icon_desc_space, house_icon_w, word_h));

	itm_name.label.text = itm.name;
	itm_container.setWidth(house_icon_w);
	itm_container.setHeight(house_icon_h + house_icon_desc_space + word_h);
	posx = posx + cur_c * house_icon_w_space;
	posy = posy + cur_r * (word_h + house_icon_h_space);
	itm_container.setX(posx);
	itm_container.setY(posy);
	//
	SetCurUseHouse(itm_container, itm.id);
	//
	NewHandGuideLogic.excuteEvent("ADD_HOUSE_ICON_CONTAINER", itm_img);
}
//--
function SetCurUseHouse(ele : iGUIElement, house_id : int){
	if(CheckIsCurUseHouse(house_id)){
		SetCurUseFrm(ele);
		var c : iGUIContainer = ele as iGUIContainer;
		ShowHouseDataDetail(c.items[0]);
	}
}
//--
function SetCurUseFrm(ele : iGUIElement){
	if(ele != null){
		var p_posx : float = houseListContainer.positionAndSize.x;
		var p_posy : float = houseListContainer.positionAndSize.y;
		var e_posx : float = ele.positionAndSize.x;
		var e_posy : float = ele.positionAndSize.y;
		var n_posx : float = p_posx + e_posx + ele.positionAndSize.width/2 - cur_use_frm.positionAndSize.width/2;
		var n_posy : float = p_posy + e_posy - cur_use_frm.positionAndSize.height + 10;
		cur_use_frm.setX(n_posx);
		cur_use_frm.setY(n_posy);
		cur_use_frm.setEnabled(true);
	}
	else{
		cur_use_frm.setEnabled(false);
	}
}
//--
function ClickCallback_HouseDataItm(caller : iGUIElement){
	var _itm : PlayerHouseRow = caller.userData as PlayerHouseRow;
	_SetCurSelectHouseId(_itm.id);
	SetSelected(caller);
	ShowHouseDataDetail(caller);
}
//--
function ShowHouseDataDetail(caller : iGUIElement){
	if(caller != null){
		var _itm : PlayerHouseRow = caller.userData as PlayerHouseRow;
		_LoadItemImg(preview_img, _itm.big_icon);
		house_tip.label.text = _itm.tip;
		normal_house_name.label.text = _itm.name;
		normal_hao_hua_du.label.text = _itm.internal_decoration.ToString();
		normal_hao_hua_du_max.label.text = _itm.max_furniture.ToString();
		normal_hao_hua_du_tip.setEnabled(true);
		label8.setEnabled(true);
	}
	else{
		preview_img.image = null;
		house_tip.label.text = "";
		normal_house_name.label.text = "";
		normal_hao_hua_du.label.text = "";
		normal_hao_hua_du_max.label.text = "";
		normal_hao_hua_du_tip.setEnabled(false);
		label8.setEnabled(false);
	}
	
}
//--
function SetSelected(caller : iGUIElement){
	//select_house_frm
	if(caller != null){
		var caller_p : iGUIElement = caller.getTargetContainer();
		var posx : float = caller_p.positionAndSize.x;
		var posy : float = caller_p.positionAndSize.y;
		var p_posx : float = houseListContainer.positionAndSize.x;
		var p_posy : float = houseListContainer.positionAndSize.y;
		var n_posx : float = p_posx + posx - 8;
		var n_posy : float = p_posy + posy - 8;
		select_house_frm.setX(n_posx);
		select_house_frm.setY(n_posy);
		select_house_frm.setEnabled(true);
	}
	else{
		select_house_frm.setEnabled(false);
	}
}
//--
function ClickCallback_move_btn(caller : iGUIElement){
	if(select_house_frm.enabled){
		if(!CheckIsCurUseHouse(mCurSelectHouse_TpltId)){
			//Global.GetSysMsgHandler().ShowSysMsg(420);
			okCallback(null);
		}
		else{
			UI.getUI().OpenMsgbox("", Define.getContent(5151),true);
		}
	}
}
//--
function CheckIsCurUseHouse(house_id : int) : boolean{
	var cur_house_id : int = DataCenter.getSelfHouseData().template_id;
	if(house_id == cur_house_id || (cur_house_id == 100000 && house_id == 110100))
		return true;
	else
		return false;
}
//--
static function okCallback(caller : iGUIElement){
	if(iGUICode_HouseUpdateRoot.getInstance().mCurSelectHouse_TpltId != 0){
		iGUICode_HouseUpdateRoot.getInstance().ReqMoveHouse(iGUICode_HouseUpdateRoot.getInstance().mCurSelectHouse_TpltId);
		iGUICode_HouseUpdateRoot.getInstance()._SetCurSelectHouseId(0);
		iGUICode_HouseUpdateRoot.getInstance().SetSelected(null);
		iGUICode_HouseUpdateRoot.getInstance().SetCurUseFrm(null);
		iGUICode_HouseUpdateRoot.getInstance().ShowHouseDataDetail(null);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_MOVEHOUSE));
	}
	setNewGuideInTop();
}
//--
function ReqMoveHouse(house_id : int){
	var req : req_move_house = new req_move_house();
	req.new_house_tplt_id = house_id;
	NetHelper.Send(req);
}
//--
static function cancelCallback(caller : iGUIElement){
	iGUICode_HouseUpdateRoot.getInstance()._SetCurSelectHouseId(0);
	setNewGuideInTop();
}
//--
function _SetCurSelectHouseId(house_id : int){
	mCurSelectHouse_TpltId = house_id;
}
//--
function _LoadItemImg(img_frm : iGUIImage, img_name : String){
	var _asynIcon : AsynIcon = new AsynIcon(function (tex : Texture){img_frm.image = tex; }, 
											Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	_asynIcon.load("Icon/" + img_name); 	
}
//--
function ClickCallback_nextPageHLBtn(caller : iGUIElement){
	var list : ArrayList = mHouseDataPageMgr.NextPage();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.HOUSELIST_PAGE_CHANGE), list);
}
//--
function ClickCallback_prePageHLBtn(caller : iGUIElement){
	var list : ArrayList = mHouseDataPageMgr.PrevPage();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.HOUSELIST_PAGE_CHANGE), list);
}
//--
function HandleHouseListPageChange(evt : GameEvent, obj : Object){
	ShowHouseDataList(obj as ArrayList);
	UpdateHouseListPageNumTxt();
}
//--
function UpdateHouseListPageNumTxt(){
	var cur_p : int = mHouseDataPageMgr.GetPageIndex();
	var t_p : int = mHouseDataPageMgr.GetTotalPage();
	var p_txt : String = cur_p.ToString() + " / " + t_p.ToString();
	houseLisPageLabel.label.text = p_txt;
}
//--
function OpenHouseListUI(grade : int){
	var house_right_row : HouseRightRow = ResManager.LgtMgr.HouseRightTable[grade] as HouseRightRow;
	house_list_right_desc.label.text = house_right_row.desc;
	houseListPanel.setEnabled(true);
	UI.getUI().SetModal("HouseUpdateRoot", true);
}
//--
function CloseHouseListUI(){
	SetSelected(null);
	SetCurUseFrm(null);
	ShowHouseDataDetail(null);
	houseListPanel.setEnabled(false);
	CloseHelpWin();
	UI.getUI().SetModal("HouseUpdateRoot", false);
}
//--
function ClickCallback_returnRightBtn(caller : iGUIElement){
	CloseHouseListUI();
	OpenHouseRightListUI();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_RETURN_RIGHT));
}
//--
static function OpenHouseUpdateRoot(){
	UI.getUI().OpenUIRoot("HouseUpdateRoot");
	var com : HouseUpdateComp = GameObject.Find("Global").GetComponent(HouseUpdateComp) as HouseUpdateComp;
	com.LoadHouseRightData();
	iGUICode_HouseUpdateRoot.getInstance().OpenHouseRightListUI();
	if(HouseUpdateComp.mFirst_in && HouseUpdateComp.mCur_grade > 0){
		//iGUICode_HouseUpdateRoot.getInstance().HandleUpdateHouseRightGrade(null, HouseUpdateComp.mCur_grade);
		HouseUpdateComp.mFirst_in = false;
	}
}

//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
//---------------
/*
	特殊产权
*/
//-
var mSpecialHouseCul : float = 2;
private var mSpecialHouseRow : float;
var special_house_icon_w : int = 56;
var special_house_icon_h : int = 56;
private var cur_select_special_house_id : int = 0;
var mMySpecialHouseCul : float = 3;
var special_house_itm_space_w : int = 9;
var special_house_itm_space_h : int = 7;
var my_special_house_icon_w : int = 56;
var my_special_house_icon_h : int = 56;
private var mMySpecialHouseRow : float;
private var cur_select_my_special_house_id : int = 0;
private var specialHousePageMgr : PagerMgr = null;
private var mySpecialHousePageMgr : PagerMgr = null;
private var myPlantListPageMgr : PagerMgr = null;
var specialHousePageNum : int = 4;
var mySpecialHousePageNum : int = 6;
var my_special_house_itm_space_w : int = 9;
var my_special_house_itm_space_h : int = 7;
var normal_house_win_style : GUIStyle;
var special_house_win_style : GUIStyle;
//private var has_set_cur_use_frm : boolean = false;
private var has_set_cur_sel_frm : boolean = false;
//
function TabChangeCallback_houseLvtabPanel(caller : iGUIElement){
	var tabpanel:iGUITabPanel = caller as iGUITabPanel;
	auto_select_first = false;
	UpdateTab2Tab3BtnStyle(tabpanel.activePanel);
	if(tabpanel.activePanel == 0){
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_HOUSE_BTN));
	}
	else if(tabpanel.activePanel == 1){	// 特权房屋
//		ReqSpecialHouseList();
		HouseUpdateComp.request_unlock_special_house_info();
	}
	else if(tabpanel.activePanel == 2){	// 我的特权房产
//		ReqMySpecialHouseList();
		HouseUpdateComp.request_unlock_special_house_info();
		HouseUpdateComp.request_get_free_count_for_moving_special_house();
	}
	else if(tabpanel.activePanel == 3){
		PlantLogic.GetInstance().RefreshPlantLock();
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_MYPLANT_TABBTN));
		//RefreshLockStatus(12);
	}
	if(tabpanel.activePanel != 0){
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.BUY_HOUSE_RIGHT_DIAMOND_LIMITED));
	}
}
//--
function UpdateTab2Tab3BtnStyle(activeTab : int){
	if(activeTab == 1){
		tab2Ctrl.image = Resources.Load("UISkins/Textures/HouseUpdate/fangwu_tx_add");
		tab2Ctrl.hoverImage = Resources.Load("UISkins/Textures/HouseUpdate/fangwu_tx_add");
		tab3Ctrl.image = Resources.Load("UISkins/Textures/HouseUpdate/fangwu-wd");
		tab3Ctrl.hoverImage = Resources.Load("UISkins/Textures/HouseUpdate/fangwu_wd_add");
	}
	else if(activeTab == 2){
		tab2Ctrl.image = Resources.Load("UISkins/Textures/HouseUpdate/fangwu_tx");
		tab2Ctrl.hoverImage = Resources.Load("UISkins/Textures/HouseUpdate/fangwu_tx_add");
		tab3Ctrl.image = Resources.Load("UISkins/Textures/HouseUpdate/fangwu_wd_add");
		tab3Ctrl.hoverImage = Resources.Load("UISkins/Textures/HouseUpdate/fangwu_wd_add");	
	}else{
		tab2Ctrl.image = Resources.Load("UISkins/Textures/HouseUpdate/fangwu_tx");
		tab2Ctrl.hoverImage = Resources.Load("UISkins/Textures/HouseUpdate/fangwu_tx_add");
		tab3Ctrl.image = Resources.Load("UISkins/Textures/HouseUpdate/fangwu-wd");
		tab3Ctrl.hoverImage = Resources.Load("UISkins/Textures/HouseUpdate/fangwu_wd_add");	
	}
}
//--
function ReqSpecialHouseList(){
	var req : req_special_house_list = new req_special_house_list();
	NetHelper.Send(req);
}
//--
function Clickcallback_specialListNextPageBtn(caller : iGUIElement){
//	var list : ArrayList = specialHousePageMgr.NextPage();
//	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.SPECIALHOUSE_PAGE_CHANGE), list);
	if (getNextPage()) {
		refreshCurPage(false);
	}
}
//--specialListPrePageBtn
function Clickcallback_specialListPrePageBtn(caller : iGUIElement){
//	var list : ArrayList = specialHousePageMgr.PrevPage();
//	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.SPECIALHOUSE_PAGE_CHANGE), list);
	if (getPrePage()) {
		refreshCurPage(false);
	}
}
//--------------------------------------------------
// 特殊房产标签
private var mSpecialHouseArray : Array = new Array();
private var mAutoSelectFirst : boolean = false;	// 是否自动选中第一个
private var mCurSelectSpecialHouse : PlayerSpecialHouseRow = null;	// 当前选中的特殊房屋
private var mUnlockSpecialHouseIds : Array = new Array();
private var NUM_PER_PAGE : int = 4;
private var mCurPage : int = 1;
private var mMaxPage : int = 1;
private var mCurFreeMoveCount : int = 0;
// 处理解锁特殊房屋事件
function HandleUnlockSpecialHouse(evt : GameEvent, id : int){
	mUnlockSpecialHouseIds.Add(id);
	refreshCurPage(true);
}
// 处理已解锁特殊房屋信息事件
function HandleUnlockSpecialHouseInfo(evt : GameEvent, id_list : ArrayList){
	if (1 == houseLvtabPanel.activePanel) {	// 显示特殊房屋标签页
		mUnlockSpecialHouseIds.Clear();
		for (var i:int = 0; i<id_list.Count; ++i) {
			mUnlockSpecialHouseIds.Add(id_list[i]);
		}
		refreshCurPage(true);
	} else if (2 == houseLvtabPanel.activePanel) {	// 显示我的房产标签页
		var houseIdList : ArrayList = new ArrayList();
		for (var j:int = 0; j<id_list.Count; ++j) {
			var row : PlayerSpecialHouseRow = ResManager.LgtMgr.getPlayerSpecialHouseRow(id_list[j]);
			for (var k:int = 0; k<row.unlock_house_ids.Count; ++k) {
				houseIdList.Add(row.unlock_house_ids[k]);
			}
		}
		HandleUpdateMySpecialHouseList(null, houseIdList);
	}
}
// 刷新当前页
function refreshCurPage(firstPage : boolean) {
	specialHouseListContainer.removeAll();	// 先移除
	mAutoSelectFirst = false;
	//
	if (firstPage) {	// 刷新第一页
		mCurPage = 1;
	}
	var curPage : Array = getCurPage();
	for (var i:int = 0; i<curPage.Count; ++i){
		CreateSpecialHouseItem(curPage[i], i);
	}
	specialListPageTxt.label.text = mCurPage.ToString() + "/" + mMaxPage.ToString();
}
// 获取当前页
function getCurPage() : Array {
	if (0 == mSpecialHouseArray.Count) {
		for (var row : PlayerSpecialHouseRow in ResManager.LgtMgr.getPlayerSpecialHouseTable()) {
			
			if (1 == row.is_show || 2 == houseLvtabPanel.activePanel) {
				mSpecialHouseArray.Add(row);
			}
		}
	}
	mMaxPage = Page.getPageCountA(mSpecialHouseArray.Count, NUM_PER_PAGE);
	if (0 == mMaxPage) {
		mMaxPage = 1;
	}
	return Page.getPageA(mSpecialHouseArray, NUM_PER_PAGE, mCurPage);
}
// 获取前一页
function getPrePage() : boolean {
	if (1 == mCurPage) {
		return false;
	}
	--mCurPage;
	return true;
}
// 获取后一页
function getNextPage() : boolean {
	if (mMaxPage == mCurPage) {
		return false;
	}
	++mCurPage;
	return true;
}
// 判断该特殊房屋是否已解锁
function IsSpecialHouseUnlock(id: int) : boolean {
	for (var unlockId:int in mUnlockSpecialHouseIds) {
		if (id == unlockId)
			return true;
	}
	return false;
}
// 创建单个特殊房屋
function CreateSpecialHouseItem(row : PlayerSpecialHouseRow, index : int){
	var unlock : boolean = IsSpecialHouseUnlock(row.id);
	var houseItem : iGUIPanel = specialHouseListContainer.addSmartObject("SpecialHouseItm") as iGUIPanel;
	houseItem.userData = row;
	(houseItem.items[3] as iGUIImage).clickCallback = ClickCallback_SpecialHouseImage;
	(houseItem.items[0] as iGUIButton).clickCallback = ClickCallback_SpecialHouseWishBtn;
	(houseItem.items[0] as iGUIButton).passive = unlock;
	(houseItem.items[7] as iGUILabel).setEnabled(!unlock);
	
	_LoadItemImg(houseItem.items[3], row.icon);
	houseItem.items[5].label.text = row.love_coin.ToString();
	
	var posx : float = 0;
	var posy : float = 0;
	if (0 == index) {
		posx = 0;
		posy = 0;
	} else if (1 == index) {
		posx = 143;
		posy = 0;
	} else if (2 == index) {
		posx = 0;
		posy = 100;
	} else {	// 3 == index
		posx = 143;
		posy = 100;
	}
	houseItem.setX(posx);
	houseItem.setY(posy);
	
	if(!mAutoSelectFirst){
		mAutoSelectFirst = true;
		ClickCallback_SpecialHouseImage((houseItem.items[3] as iGUIImage));
	}
}
// 点击特殊房屋图标
function ClickCallback_SpecialHouseImage(caller : iGUIElement){
	SelectSpecialHouse(caller.getTargetContainer());
}
// 点击特殊房屋许愿按钮
function ClickCallback_SpecialHouseWishBtn(caller : iGUIElement){
	caller = caller.getTargetContainer();
	var row : PlayerSpecialHouseRow = caller.userData as PlayerSpecialHouseRow;
	WishListComp.ReqAddWish(row.id, 2);
}
// 设置当前选中的特殊房屋
function SelectSpecialHouse(caller : iGUIElement){
	mCurSelectSpecialHouse = caller.userData;
	ShowSpecialHouseInfo(caller.userData);
	SetSpecialHouseSelected(caller);
	var unlock : boolean = IsSpecialHouseUnlock(mCurSelectSpecialHouse.id);
	buySpecialHouseBtn.userData = !unlock;
	var normal : String = "HouseUpdate/" + (unlock ? "buyhouseaccess_g" : "buyhouseaccess_n");
	var hover : String = "HouseUpdate/" + (unlock ? "buyhouseaccess_g" : "buyhouseaccess_h");
	UI.SetButtonState(buySpecialHouseBtn, normal, hover, normal);
}
// 获取当前选中的殊房屋
function getSelectSpecialHouse() : PlayerSpecialHouseRow{
	return mCurSelectSpecialHouse;
}
// 显示特殊房屋的信息
function ShowSpecialHouseInfo(row : PlayerSpecialHouseRow){
	if (null == row) {
		specialHousePreview.image = null;
		specialHouseTip.label.text = "";
		special_house_name.label.text = "";
		special_hao_hua_du.label.text = "";
		special_hao_hua_du_max.label.text = "";
		special_hao_hua_du_tip.setEnabled(false);
		label9.setEnabled(false);
	} else {
		_LoadItemImg(specialHousePreview, row.big_icon);
		specialHouseTip.label.text = row.desc;
		special_house_name.label.text = row.name;
		special_hao_hua_du.label.text = row.decoration.ToString();
		special_hao_hua_du_max.label.text = row.furniture_count.ToString();
		special_hao_hua_du_tip.setEnabled(true);
		label9.setEnabled(true);
	}
}
// 处理获取移动特殊房屋免费次数
function HandleGetFreeCountForMovingSpecialHouse(evt : GameEvent, count : int){
	mCurFreeMoveCount = count;
	free_move_count_label.label.text = count.ToString();
}
//--------------------------------------------------
function HandleSpecialHousePageChange(evt : GameEvent, list : ArrayList){
	SetSpecialHouseSelected(null);
	ShowSpecialHouseDetail(0);
	SetCurSelectSpecialHouseID(0);
	CreateSpecialHouseItmList(list);
}
//--
function HandleUpdateSpecialHouseList(evt : GameEvent, list : ArrayList){
	specialHousePageMgr = new PagerMgr(list, specialHousePageNum);
	var show_list : ArrayList = specialHousePageMgr.CurrPage(); 
	CreateSpecialHouseItmList(list);
}
//--
function CreateSpecialHouseItmList(list : ArrayList){
	var house_list_cnt : float = list.Count;
	//
	specialHouseListContainer.removeAll();
	var _result : float = house_list_cnt / mSpecialHouseCul;
	mSpecialHouseRow = System.Math.Ceiling(_result);
	for(var _r_cnt:int=0; _r_cnt < mSpecialHouseRow; ++ _r_cnt){
		for(var _c_cnt:int=0; _c_cnt < mSpecialHouseCul; ++ _c_cnt){
			var posx : float = _c_cnt * special_house_icon_w;
			var posy : float = _r_cnt * special_house_icon_h;
			var idx : int = mSpecialHouseCul * _r_cnt + _c_cnt;
			if(idx >= 0 && idx < house_list_cnt){
				var _house_itm : special_house_goods = list[idx] as special_house_goods;
				CreateSpecialHouseItm(_house_itm, special_house_icon_w, special_house_icon_h, posx, posy, _r_cnt, _c_cnt);
			}
		}
	}
}
//--
private var auto_select_first : Boolean = false;
//--
function CreateSpecialHouseItm(data : special_house_goods, house_icon_w : int, house_icon_h : int, posx : float, posy : float, cur_r : int, cur_c : int){
	//var itm_container : iGUIContainer = specialHouseListContainer.addElement("iGUIContainer") as iGUIContainer;
	var house_itm : iGUIPanel = specialHouseListContainer.addSmartObject("SpecialHouseItm") as iGUIPanel;
	house_itm.userData = data;
	(house_itm.items[3] as iGUIImage).clickCallback = ClickCallback_SpecialHouseDataItm;
	(house_itm.items[0] as iGUIButton).clickCallback = ClickCallback_AddHouseWish;
	//for(var i:int=0; i< house_itm.itemCount; ++i){
	//	Debug.Log("---" + i + "----" + house_itm.items[i].variableName);
	//}
	//if(PlatformMgr.IsPlatYY()){
	//	(house_itm.items[2] as iGUIImage).image = Resources.Load("UISkins/Textures/Common1/Ydian");
	//	house_itm.items[7].setEnabled(false);
	//	house_itm.items[6].setEnabled(false);
	//}
	//else{
	//	(house_itm.items[2] as iGUIImage).image = Resources.Load("UISkins/Textures/Common1/Qdian");
	//	house_itm.items[7].setEnabled(true);
	//	house_itm.items[6].setEnabled(true);
	//}
	//itm_img.setPositionAndSize(Rect(0.5,0,house_icon_w,house_icon_h));
	var house_row : PlayerHouseRow = ResManager.LgtMgr.PlayerHouseTable[data.house_tplt_id] as PlayerHouseRow;
	if(!house_row){
		throw new Exception("can't find house_tplt_id:" + data.house_tplt_id);
	}
	_LoadItemImg(house_itm.items[3], house_row.icon);
	//
	var r_coin : String = DataCenter.getCostByPlatform(data.q_coin).ToString();
	//var itm_coin : iGUILabel = itm_container.addElement("iGUILabel") as iGUILabel;
	//itm_coin.style = house_desc_style;
	//var coin_h : float = itm_coin.style.CalcHeight(GUIContent(r_coin), house_icon_w);
	//itm_coin.setPositionAndSize(Rect(0.5f, house_icon_h + house_icon_desc_space, house_icon_w, coin_h));
	house_itm.items[5].label.text = r_coin;
	//
	var r_y_icon : String = (DataCenter.getCostByPlatform(data.q_coin) * 0.8).ToString();
	//var itm_y_coin : iGUILabel = itm_container.addElement("iGUILabel") as iGUILabel;
	//itm_y_coin.style = house_desc_style;
	//var y_coin_h : float = itm_y_coin.style.CalcHeight(GUIContent(r_y_icon), house_icon_w);
	//itm_y_coin.setPositionAndSize(Rect(0.5f, house_icon_h + house_icon_desc_space * 2 + coin_h, house_icon_w, y_coin_h));
	house_itm.items[6].label.text = r_y_icon;
	
	//itm_container.setWidth(house_itm.positionAndSize.width);
	//itm_container.setHeight(house_itm.positionAndSize.height);
	posx = posx + cur_c * special_house_itm_space_w;
	posy = posy + cur_r * special_house_itm_space_h;
	house_itm.setX(posx);
	house_itm.setY(posy);
	if(GetCurSelectSpecialHouseID() == data.house_tplt_id){
		SetSpecialHouseSelected(house_itm);
		SetRemainHouseNum(data.remain_count);
		ShowSpecialHouseDetail(data.house_tplt_id);
		//SetCurSelectSpecialHouseID();
	}
	if(!auto_select_first){
		ClickCallback_SpecialHouseDataItm((house_itm.items[3] as iGUIImage));
		auto_select_first = true;
	}
}
//--
function ClickCallback_AddHouseWish(caller : iGUIElement){
	caller = caller.getTargetContainer();
	var data : special_house_goods = caller.userData as special_house_goods;
	WishListComp.ReqAddWish(data.house_tplt_id, 2);
}
//--
function ClickCallback_SpecialHouseDataItm(caller : iGUIElement){
	caller = caller.getTargetContainer();
	var data : special_house_goods = caller.userData as special_house_goods;
	SetRemainHouseNum(data.remain_count);
	SetCurSelectSpecialHouseID(data.house_tplt_id);
	SetSpecialHouseSelected(caller);
	ShowSpecialHouseDetail(data.house_tplt_id);
}
//--
function SetSpecialHouseSelected(caller : iGUIElement){
	//select_house_frm
	if(caller != null){
		var caller_p : iGUIElement = caller.getTargetContainer();
		var posx : float = caller_p.positionAndSize.x;
		var posy : float = caller_p.positionAndSize.y;
		var p_posx : float = specialHouseListContainer.positionAndSize.x;
		var p_posy : float = specialHouseListContainer.positionAndSize.y;
		var n_posx : float = p_posx + posx - 8;
		var n_posy : float = p_posy + posy - 8;
		cur_sel_pre_special_house_frm.setX(n_posx);
		cur_sel_pre_special_house_frm.setY(n_posy);
		cur_sel_pre_special_house_frm.setEnabled(true);
	}
	else{
		cur_sel_pre_special_house_frm.setEnabled(false);
	}
}
//--
function ShowSpecialHouseDetail(house_id : int){
	if(house_id != 0){
		var row : PlayerHouseRow = ResManager.LgtMgr.PlayerHouseTable[house_id] as PlayerHouseRow;
		_LoadItemImg(specialHousePreview, row.big_icon);;
		specialHouseTip.label.text = row.tip;
		special_house_name.label.text = row.name;
		special_hao_hua_du.label.text = row.internal_decoration.ToString();
		special_hao_hua_du_max.label.text = row.max_furniture.ToString();
		special_hao_hua_du_tip.setEnabled(true);
		label9.setEnabled(true);
	}
	else{
		specialHousePreview.image = null;
		specialHouseTip.label.text = "";
		special_house_name.label.text = "";
		special_hao_hua_du.label.text = "";
		special_hao_hua_du_max.label.text = "";
		special_hao_hua_du_tip.setEnabled(false);
		label9.setEnabled(false);
	}
}
//--
function ClickCallback_buySpecialHouseBtn(caller : iGUIElement){
//	if(GetCurSelectSpecialHouseID() != 0){
//		var s_house_row : SpecialHouseRow = GetSpecialHouseRow(GetCurSelectSpecialHouseID());
//		var params : ArrayList = new ArrayList();
//		params.Add(s_house_row.q_coin);
//		Global.GetSysMsgHandler().ShowSysMsg(536,params);
//	}
	if (0 == mCurSelectSpecialHouse.id || false == caller.userData) {
		return;
	}
	var msg_row:SysMsgRow = Global.GetSysMsgHandler().getSysMsgRow(593);
	var msg_content:String = msg_row.msg_content.Replace("{0}", mCurSelectSpecialHouse.love_coin.ToString());
	UI.getUI().OpenMsgbox("",msg_content,"", confirmBuySpecialHouse as iGUIEventCallback, "", cancelBuySpecialHouse as iGUIEventCallback);
}
//--
function GetSpecialHouseRow(house_id : int) : SpecialHouseRow{
	var _row : SpecialHouseRow = null;
	var _t : Hashtable = ResManager.LgtMgr.SpecialHouseTable;
	var _tmp_arr : Array = new Array();
	for(var obj:Object in _t.Values){
		var _r : SpecialHouseRow = obj as SpecialHouseRow;
		if(_r.house_tplt_id == house_id){
			_tmp_arr.Add(_r);
		}
	}
	_tmp_arr = _tmp_arr.Sort();
	if(_tmp_arr.Count >0){
		_row = _tmp_arr[_tmp_arr.Count -1] as SpecialHouseRow;
	}
	if(_row == null){
		throw "Error: can't find SpecialHouseRow house_id:" + house_id;
	}
	
	return _row;
}

//--
static function confirmBuySpecialHouse(caller : iGUIElement){
//	iGUICode_HouseUpdateRoot.getInstance().ReqBuySpecialHouse(iGUICode_HouseUpdateRoot.getInstance().GetCurSelectSpecialHouseID());
	var row : PlayerSpecialHouseRow = iGUICode_HouseUpdateRoot.getInstance().getSelectSpecialHouse();
	if (row) {
		HouseUpdateComp.request_unlock_special_house(row.id);
	}
}
//--
static function cancelBuySpecialHouse(caller : iGUIElement){
	
}
//--
function ReqBuySpecialHouse(house_id : int){
	var req : req_buy_special_house = new req_buy_special_house();
	req.house_tplt_id = house_id;
	NetHelper.Send(req);
}
//--
function SetCurSelectSpecialHouseID(id : int){
	cur_select_special_house_id = id;
}
//--
function GetCurSelectSpecialHouseID() : int{
	return cur_select_special_house_id;
}
//--
function SetRemainHouseNum(num : int){
	remainNum.label.text = num.ToString();
}
//--
function ClickCallback_myHouseListBtn(caller : iGUIElement){
	ReqMySpecialHouseList();
	OpenMySpecialHouseListWin();
}
//--
function ReqMySpecialHouseList(){
	var req : req_self_special_house_list = new req_self_special_house_list();
	NetHelper.Send(req);
}
//--
function HandleUpdateMySpecialHouseList(evt : GameEvent, list : ArrayList){
	myHouseListContainer.removeAll();
	if(list.Count <= 0){
		return;
	}
	mySpecialHousePageMgr = new PagerMgr(list, mySpecialHousePageNum);
	
	var show_list : ArrayList = mySpecialHousePageMgr.CurrPage(); 
	CreateMySpecialHouseItmList(show_list);
	SetMyHouseListPageNum();
}
//--
function CreateMySpecialHouseItmList(list : ArrayList){
	myHouseListContainer.removeAll();
	var house_list_cnt : float = list.Count;
	if(house_list_cnt <= 0){
		return;
	}
	//
	var _result : float = house_list_cnt / mMySpecialHouseCul;
	mMySpecialHouseRow = System.Math.Ceiling(_result);
	for(var _r_cnt:int=0; _r_cnt < mMySpecialHouseRow; ++ _r_cnt){
		for(var _c_cnt:int=0; _c_cnt < mMySpecialHouseCul; ++ _c_cnt){
			var posx : float = _c_cnt * my_special_house_icon_w;
			var posy : float = _r_cnt * my_special_house_icon_h;
			var idx : int = mMySpecialHouseCul * _r_cnt + _c_cnt;
			if(idx >= 0 && idx < house_list_cnt){
				CreateMySpecialHouseItm(list[idx], my_special_house_icon_w, my_special_house_icon_h, posx, posy, _r_cnt, _c_cnt);
			}
		}
	}
}
function CreateMySpecialHouseItm(house_id : int, house_icon_w : int, house_icon_h : int, posx : float, posy : float, cur_r : int, cur_c : int){
	var itm_container : iGUIContainer = myHouseListContainer.addElement("iGUIContainer") as iGUIContainer;
	var itm_img : iGUIImage = itm_container.addElement("iGUIImage") as iGUIImage;
	itm_img.userData = house_id;
	itm_img.clickCallback = ClickCallback_MySpecialHouseDataItm;
	itm_img.setPositionAndSize(Rect(0.5,0,house_icon_w,house_icon_h));
	var row : PlayerHouseRow = ResManager.LgtMgr.PlayerHouseTable[house_id] as PlayerHouseRow;
	_LoadItemImg(itm_img, row.icon);
	/*
	//
	var itm_name : iGUILabel = itm_container.addElement("iGUILabel") as iGUILabel;
	itm_name.style = house_desc_style;
	var word_h : float = itm_name.style.CalcHeight(GUIContent(itm.name), house_icon_w);
	itm_name.setPositionAndSize(Rect(0.5f, house_icon_h + house_icon_desc_space, house_icon_w, word_h));

	itm_name.label.text = itm.name;
	*/
	itm_container.setWidth(house_icon_w);
	itm_container.setHeight(house_icon_h/* + house_icon_desc_space + word_h*/);
	posx = posx + cur_c * house_icon_w_space;
	posy = posy + cur_r * (/*word_h + */house_icon_h_space);
	itm_container.setX(posx);
	itm_container.setY(posy);
	if(!has_set_cur_sel_frm) {
		has_set_cur_sel_frm = true;
		ClickCallback_MySpecialHouseDataItm(itm_img);
	}
//	if(!has_set_cur_use_frm) {
		SetCurUseSpecialHouse(itm_container, house_id);
//	}
	// alter by zlj 
//	if(DataCenter.getSelfHouseData().template_id == house_id)
//	{
//	    cur_use_special_frm.setEnabled(true);
//	}	
}
//--has_set_cur_use_frm has_set_cur_sel_frm
function SetCurUseSpecialHouse(ele : iGUIElement, house_id : int){
	if(CheckIsCurUseHouse(house_id)){
		SetCurUseSpecialFrm(ele);
	}
}
//--
function SetCurUseSpecialFrm(ele : iGUIElement){
	if(ele != null){
		var p_posx : float = myHouseListContainer.positionAndSize.x;
		var p_posy : float = myHouseListContainer.positionAndSize.y;
		var e_posx : float = ele.positionAndSize.x;
		var e_posy : float = ele.positionAndSize.y;
		var n_posx : float = p_posx + e_posx + ele.positionAndSize.width/2 - cur_use_special_frm.positionAndSize.width/2;
		var n_posy : float = p_posy + e_posy - cur_use_special_frm.positionAndSize.height + 10;
		cur_use_special_frm.setX(n_posx);
		cur_use_special_frm.setY(n_posy);
		cur_use_special_frm.setEnabled(true);
//		has_set_cur_use_frm = true;
	}
	else{
//		has_set_cur_use_frm = false;
		cur_use_special_frm.setEnabled(false);
	}
}
//--
function ClickCallback_MySpecialHouseDataItm(caller : iGUIElement){
	var h_id : int = caller.userData;
	cur_select_my_special_house_id = h_id;
	SetMySpecialHouseSelected(caller);
	ShowMySpecialHouseDetail(h_id);
}
//--
function OpenMySpecialHouseListWin(){
	myHouseListWin.setEnabled(true);
	CloseHouseRightListUI();
	UI.getUI().SetModal("HouseUpdateRoot", true);
}
//--
function CloseMySpecialHouseListWin(){
	SetCurUseSpecialFrm(null);
	myHouseListWin.setEnabled(false);
	UI.getUI().SetModal("HouseUpdateRoot", false);
}
//--
function ClickCallback_closeMyHouseListWinBtn(caller : iGUIElement){
	CloseMySpecialHouseListWin();
	cur_select_my_special_house_id = 0;
	SetMySpecialHouseSelected(null);
	ShowMySpecialHouseDetail(0);
	has_set_cur_sel_frm = false;
}
//--
function ClickCallback_moveSecialHouseBtn(caller : iGUIElement){
	if(cur_select_my_special_house_id == 0){
		return;
	}
	if(CheckIsCurUseHouse(cur_select_my_special_house_id)){
		UI.getUI().OpenMsgbox("", "不能更换到当前已使用的房屋户型", true);
		return;
	}
	var row : PlayerHouseRow = ResManager.LgtMgr.getPlayerHouseRow(cur_select_my_special_house_id);
	var msg_row:SysMsgRow = Global.GetSysMsgHandler().getSysMsgRow(594);
	var msg_content:String = msg_row.msg_content.Replace("{0}", mCurFreeMoveCount > 0 ? "0" : row.love_coin.ToString());
	UI.getUI().OpenMsgbox("",msg_content,"", OkMoveSpecialHouseCallback as iGUIEventCallback, "", cancelCallback as iGUIEventCallback);
}
//--
function OkMoveSpecialHouseCallback(caller : iGUIElement){
	if(cur_select_my_special_house_id != 0){
		ReqMoveHouse(cur_select_my_special_house_id);
	}
}
//--
function CancelMoveSpecialHouseCallback(caller : iGUIElement){

}
//--
function SetMySpecialHouseSelected(caller : iGUIElement){
	//select_house_frm
	if(caller != null){
		var caller_p : iGUIElement = caller.getTargetContainer();
		var posx : float = caller_p.positionAndSize.x;
		var posy : float = caller_p.positionAndSize.y;
		var p_posx : float = myHouseListContainer.positionAndSize.x;
		var p_posy : float = myHouseListContainer.positionAndSize.y;
		var n_posx : float = p_posx + posx - 8;
		var n_posy : float = p_posy + posy - 8;
		sel_speical_house_frm.setX(n_posx);
		sel_speical_house_frm.setY(n_posy);
		sel_speical_house_frm.setEnabled(true);
	}
	else{
		sel_speical_house_frm.setEnabled(false);
	}
}
//--
function ClickCallback_myHouseListPrePageBtn(caller : iGUIElement){
	if(mySpecialHousePageMgr != null){
		var list : ArrayList = mySpecialHousePageMgr.PrevPage();
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MYSPECIALHOUSE_PAGE_CHANGE), list);
	}
}
//--
function ClickCallback_myHouseListNextPageBtn(caller : iGUIElement){
	if(mySpecialHousePageMgr != null){
		var list : ArrayList = mySpecialHousePageMgr.NextPage();
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MYSPECIALHOUSE_PAGE_CHANGE), list);
	}
}
//--
function HandleMySpecialHousePageChange(evt : GameEvent, list : ArrayList){
	SetMySpecialHouseSelected(null);
	ShowMySpecialHouseDetail(0);
	has_set_cur_sel_frm = false;
	CreateMySpecialHouseItmList(list);
	SetMyHouseListPageNum();
}
//--
function ShowMySpecialHouseDetail(house_id : int){
	if(house_id != 0){
		var row : PlayerHouseRow = ResManager.LgtMgr.PlayerHouseTable[house_id] as PlayerHouseRow;
		_LoadItemImg(myHousePreview, row.big_icon);
		myHouseTip.label.text = row.tip;
		my_house_name.label.text = row.name;
		my_house_hao_hua_du.label.text = row.internal_decoration.ToString();
		my_house_hao_hua_du_max.label.text = row.max_furniture.ToString();
		my_house_hao_hua_du_tip.setEnabled(true);
		label11.setEnabled(true);
		love_coin_label.label.text = row.love_coin.ToString();
		love_coin_label.setEnabled(true);
		label7.setEnabled(true);
		label6.setEnabled(true);
	}
	else{
		myHousePreview.image = null;
		myHouseTip.label.text = "";
		my_house_name.label.text = "";
		my_house_hao_hua_du.label.text = "";
		my_house_hao_hua_du_max.label.text = "";
		my_house_hao_hua_du_tip.setEnabled(false);
		label11.setEnabled(false);
		love_coin_label.setEnabled(false);
		label7.setEnabled(false);
		label6.setEnabled(false);
		
		// alter by zlj
		cur_use_special_frm.setEnabled(false);
		//cur_use_frm.setEnabled(false);
	}
}
//--
function ClickCallback_fanhuiBtn(caller : iGUIElement){
	CloseMySpecialHouseListWin();
	OpenHouseRightListUI();
	houseLvtabPanel.activePanel = 1;
	auto_select_first = false;
	//houseLvListPanel.style = special_house_win_style;
}
//--myHouseListPageTxt
function SetMyHouseListPageNum(){
	if(mySpecialHousePageMgr != null){
		var cur_p : int = mySpecialHousePageMgr.GetPageIndex();
		var t_p : int = mySpecialHousePageMgr.GetTotalPage();
		myHouseListPageTxt.label.text = cur_p.ToString() + "/" + t_p.ToString();
	}
}
//--
var mMyPlantGridWSpace : int = 10;
var mMyPlantGridHSpace : int = 10;
var mMyPlantItemContainerW : int = 50;
var mMyPlantItemContainerH : int = 50;
var mMyPlantIconW : int = 50;
var mMyPlantIconH : int = 30;
var mMyPlantUnLockBtnW : int = 50;
var mMyPlantUnLockBtnH : int = 15;
var mMyPlantItemInnerSpaceH : int = 5;
var mMyPlantListOnePageCount : int = 16;
//--
function CreateMyPlantList(list : ArrayList){
	plantContainer.removeAll();
	if(list.Count <= 0)
		return;
	
	var t_cnt : float = list.Count;
	var _result : float = t_cnt / myPlantGridCul;
	row_num = System.Math.Ceiling(_result);
	
	for(var _r_cnt:int=0; _r_cnt < row_num; ++ _r_cnt){
		for(var _c_cnt:int=0; _c_cnt < myPlantGridCul; ++ _c_cnt){
			var posx : float = _c_cnt * mMyPlantItemContainerW;
			var posy : float = _r_cnt * mMyPlantItemContainerH;
			var idx : int = myPlantGridCul * _r_cnt + _c_cnt;
			var need_btn : boolean = false;
			var lock_flag : boolean = true;
			if(mOpenPlantNum == idx + (myPlantListPageMgr.GetPageIndex() - 1) * mMyPlantListOnePageCount){
				need_btn = true;
			}
			if(idx >= 0 && idx < t_cnt){
				lock_flag = Convert.ToBoolean(list[idx]);
				AddMyPlantItemContainer(posx, posy, _r_cnt, _c_cnt, need_btn, lock_flag);
			}
			
		}
	}
}
//--
function AddMyPlantItemContainer(posx : float, posy : float, cur_r : int, cur_c : int, need_btn : boolean, lock_flag : boolean){
	var itm_container : iGUIContainer = plantContainer.addElement("iGUIContainer") as iGUIContainer;
	var itm_img : iGUIImage = itm_container.addElement("iGUIImage") as iGUIImage;
	if(!lock_flag){
		itm_img.image = Resources.Load("UISkins/Textures/plant/" + "unlocked") as Texture2D;
	}
	else{
		itm_img.image = Resources.Load("UISkins/Textures/plant/" + "unlocking") as Texture2D;
	}
	itm_img.ignoreClicks = true;
	itm_img.setPositionAndSize(Rect(0.5,0,mMyPlantIconW,mMyPlantIconH));
	//
	if(need_btn){
		var unlockBtn : iGUIButton = itm_container.addElement("iGUIButton") as iGUIButton;
		unlockBtn.style.normal.background = Resources.Load("UISkins/Textures/unlock/" + "unl_n") as Texture2D;
		unlockBtn.style.hover.background = Resources.Load("UISkins/Textures/unlock/" + "unl_h") as Texture2D;
		unlockBtn.style.active.background = Resources.Load("UISkins/Textures/unlock/" + "unl_n") as Texture2D;
		unlockBtn.clickCallback = ClickCallback_UnLockMyPlantBtn;
		unlockBtn.setPositionAndSize(Rect(0.5, mMyPlantIconH + mMyPlantItemInnerSpaceH, mMyPlantUnLockBtnW, mMyPlantUnLockBtnH));
	}
	itm_container.setWidth(mMyPlantItemContainerW);
	itm_container.setHeight(mMyPlantItemContainerH);
	posx = posx + cur_c * mMyPlantGridWSpace;
	posy = posy + cur_r * mMyPlantGridHSpace;
	itm_container.setX(posx);
	itm_container.setY(posy);

}
private var mOpenPlantNum : int = 0;
//--
public function RefreshLockStatus(openNum : int) : void {
	mOpenPlantNum = openNum;
	var lockInfoArray : ArrayList = new ArrayList();
	var lock_flag : boolean = true;
	for(var i:int=0; i < myPlantGridNum; ++ i){
		if(i <= openNum - 1){
			lock_flag = false;
		}
		else{
			lock_flag = true;
		}
		lockInfoArray.Add(lock_flag);	
	}
	myPlantListPageMgr = new PagerMgr(lockInfoArray, mMyPlantListOnePageCount);
	var show_list : ArrayList = myPlantListPageMgr.CurrPage(); 
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MYPLANTUNLOCKLIST_PAGE_CHANGE), show_list);
}
//--
function ClickCallback_UnLockMyPlantBtn(caller : iGUIElement){
	PlantLogic.GetInstance().OpenUnLock();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_UNLOCKFLOWERPOT_BTN));
}
//--
function ClickCallback_myPlantListPrePageBtn(caller : iGUIElement){
	if(myPlantListPageMgr){
		var list : ArrayList = myPlantListPageMgr.PrevPage();
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MYPLANTUNLOCKLIST_PAGE_CHANGE), list);
	}
}
//-
function ClickCallback_myPlantListNextPageBtn(caller : iGUIElement){
	if(myPlantListPageMgr){
		var list : ArrayList = myPlantListPageMgr.NextPage();
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MYPLANTUNLOCKLIST_PAGE_CHANGE), list);
	}
}
//--
function HandleMyPlantUnlockListPageChange(evt : GameEvent, obj : Object){
	var list : ArrayList = obj as ArrayList;
	SetMyPlantListPageNum();
	CreateMyPlantList(list);
}
//--
function SetMyPlantListPageNum(){
	if(myPlantListPageMgr != null){
		var cur_p : int = myPlantListPageMgr.GetPageIndex();
		var t_p : int = myPlantListPageMgr.GetTotalPage();
		myPlantListPageNum.label.text = cur_p.ToString() + "/" + t_p.ToString();
	}
}