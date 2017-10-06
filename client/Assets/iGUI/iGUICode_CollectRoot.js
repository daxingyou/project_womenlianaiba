#pragma strict
import iGUI;

class CollectIcon extends PlatResInfoCtrl {
	public var imageElement : iGUIImage;
	public var nameElement : iGUILabel;
	
	//overwrite
	public function Callback() {
		iGUICode_CollectRoot.getInstance().Callback_SetHeadInfo(this);
	}
}

class CollectEmployIcon extends PlatResInfoCtrl {
	public var imageElement : iGUIImage;
	public var nameElement : iGUIImage;
	
	//overwrite
	public function Callback() {
		iGUICode_CollectRoot.getInstance().Callback_SetWorkingEmployeeInfo(this);
	}
}

class CollectEmployResultIcon extends PlatResInfoCtrl {
	public var imageElement : iGUIImage;
	public var nameElement : iGUIImage;
	
	//overwrite
	public function Callback() {
		iGUICode_CollectRoot.getInstance().Callback_SetResultEmployeeInfo(this);
	}
}

private static var instance : iGUICode_CollectRoot;
function Awake(){
	instance=this;
	RegistEvt();
}
static function getInstance(){
	return instance;
}
@HideInInspector
var image7 : iGUIImage;
@HideInInspector
var image6 : iGUIImage;
@HideInInspector
var image5 : iGUIImage;
@HideInInspector
var image4 : iGUIImage;
@HideInInspector
var image3 : iGUIImage;
@HideInInspector
var label22 : iGUILabel;
@HideInInspector
var label21 : iGUILabel;
@HideInInspector
var label20 : iGUILabel;
@HideInInspector
var image2 : iGUIImage;
@HideInInspector
var image1 : iGUIImage;
@HideInInspector
var label19 : iGUILabel;
@HideInInspector
var label18 : iGUILabel;
@HideInInspector
var extend_5_count : iGUILabel;
@HideInInspector
var extend_4_count : iGUILabel;
@HideInInspector
var extend_3_count : iGUILabel;
@HideInInspector
var extend_2_count : iGUILabel;
@HideInInspector
var extend_1_count : iGUILabel;
@HideInInspector
var special_stuff_count : iGUILabel;
@HideInInspector
var normal_stuff_count : iGUILabel;
@HideInInspector
var closeWinBtn : iGUIButton;
@HideInInspector
var remain_num_lbl : iGUILabel;
@HideInInspector
var reduce_btn : iGUIButton;
@HideInInspector
var use_num_lbl : iGUILabel;
@HideInInspector
var add_btn : iGUIButton;
@HideInInspector
var uf_cancel_btn : iGUIButton;
@HideInInspector
var uf_use_btn : iGUIButton;
@HideInInspector
var uf_tip_label1 : iGUILabel;
@HideInInspector
var uf_icon_label : iGUILabel;
@HideInInspector
var uf_close_btn : iGUIButton;
@HideInInspector
var use_frame : iGUIPanel;
@HideInInspector
var whip_btn : iGUIButton;
@HideInInspector
var view_help_players_btn : iGUIButton;
@HideInInspector
var help_count : iGUILabel;
@HideInInspector
var label17 : iGUILabel;
@HideInInspector
var end_collect_btn : iGUIButton;
@HideInInspector
var extend_img_5 : iGUIImage;
@HideInInspector
var extend_img_4 : iGUIImage;
@HideInInspector
var extend_img_3 : iGUIImage;
@HideInInspector
var extend_img_2 : iGUIImage;
@HideInInspector
var extend_img_1 : iGUIImage;
@HideInInspector
var label16 : iGUILabel;
@HideInInspector
var special_stuff_img : iGUIImage;
@HideInInspector
var normal_stuff_img : iGUIImage;
@HideInInspector
var label15 : iGUILabel;
@HideInInspector
var label14 : iGUILabel;
@HideInInspector
var working_player_img : iGUIImage;
@HideInInspector
var immediately_done_btn : iGUIButton;
@HideInInspector
var remain_work_time : iGUILabel;
@HideInInspector
var label13 : iGUILabel;
@HideInInspector
var label12 : iGUILabel;
@HideInInspector
var collecting_friend_img : iGUIImage;
@HideInInspector
var label11 : iGUILabel;
@HideInInspector
var collecting_container : iGUIContainer;
@HideInInspector
var collect_result_container : iGUIContainer;
@HideInInspector
var npc_img : iGUIImage;
@HideInInspector
var invite_friend_img : iGUIImage;
@HideInInspector
var label10 : iGUILabel;
@HideInInspector
var null_friend_container : iGUIContainer;
@HideInInspector
var label9 : iGUILabel;
@HideInInspector
var next_friend_page_btn : iGUIButton;
@HideInInspector
var pre_friend_page_btn : iGUIButton;
@HideInInspector
var firend_list_container : iGUIContainer;
@HideInInspector
var search_friend_list_container : iGUIContainer;
@HideInInspector
var label8 : iGUILabel;
@HideInInspector
var start_collect_btn : iGUIButton;
@HideInInspector
var label7 : iGUILabel;
@HideInInspector
var label6 : iGUILabel;
@HideInInspector
var label5 : iGUILabel;
@HideInInspector
var label4 : iGUILabel;
@HideInInspector
var label3 : iGUILabel;
@HideInInspector
var selected_result_img : iGUIImage;
@HideInInspector
var label2 : iGUILabel;
@HideInInspector
var label1 : iGUILabel;
@HideInInspector
var start_collect_container : iGUIContainer;
@HideInInspector
var start_collect_panel : iGUIPanel;
@HideInInspector
var collectRoot : iGUIRoot;

//--
class EmployeeData{
	var is_npc : int = 0;
	var valid : boolean;
	var photo : Texture;
	var account : String = "";
	var name : String = "";
	public function EmployeeData(is_npc : int, valid : boolean, photo : Texture2D, account : String, name : String){
		this.is_npc = is_npc;
		this.valid = valid;
		this.photo = photo;
		this.account = account;
		this.name = name;
	}
}
//--
var fixed_grid_count : int = 2;
var mSelect_friend_list_Cul_num : int = 5;
var mSelect_friend_list_Row_num : int = 3;
var info_container_space_w : float = 27;
var info_container_space_h : float = 27;
var mPage_num : int = 15;
var whip_item_id1 : int = 2200033;
var whip_item_id2 : int = 2200033;
var whip_reduce_seconds : float = 600;
var per_whip_min : int = 10;
private var mFriendListPageMgr : PagerMgr = null;
private var mHeadInfoLoaderArray : Array = new Array();
private var mWorkingRemainTimer : Timer = null;
private var to_use_total_whip_num :int = 0;
private var to_use_whip_num : int = 0;
private var is_user_changed_use_num : boolean = false;
private var mRemain_Seconds : int = 0;
//--
function Start(){
	RegistUICallback();
}
//--注册控件回调函数
function RegistUICallback(){
	uf_icon_label.mouseOverCallback = MouseOverCallback_uf_icon_label;
	extend_img_5.mouseOverCallback = MouseOverCallback_ShowItemHint;
	extend_img_4.mouseOverCallback = MouseOverCallback_ShowItemHint;
	extend_img_3.mouseOverCallback = MouseOverCallback_ShowItemHint;
	extend_img_2.mouseOverCallback = MouseOverCallback_ShowItemHint;
	extend_img_1.mouseOverCallback = MouseOverCallback_ShowItemHint;
	special_stuff_img.mouseOverCallback = MouseOverCallback_ShowItemHint;
	normal_stuff_img.mouseOverCallback = MouseOverCallback_ShowItemHint;
	view_help_players_btn.clickCallback = ClickCallback_view_help_players_btn;
	next_friend_page_btn.clickCallback = ClickCallback_next_friend_page_btn;
	pre_friend_page_btn.clickCallback = ClickCallback_pre_friend_page_btn;
	closeWinBtn.clickCallback = ClickCallback_closeWinBtn;
	uf_cancel_btn.clickCallback = ClickCallback_uf_cancel_btn;
	uf_use_btn.clickCallback = ClickCallback_uf_use_btn;
	reduce_btn.clickCallback = ClickCallback_reduce_btn;
	add_btn.clickCallback = ClickCallback_add_btn;
	invite_friend_img.clickCallback = ClickCallback_invite_friend_img;
	end_collect_btn.clickCallback = ClickCallback_end_collect_btn;
	immediately_done_btn.clickCallback = ClickCallback_immediately_done_btn;
	whip_btn.clickCallback = ClickCallback_whip_btn;
	npc_img.clickCallback = ClickCallback_npc_img;
	start_collect_btn.clickCallback = ClickCallback_start_collect_btn;
	selected_result_img.clickCallback = ClickCallback_selected_result_img;
}
//--
function RegistEvt(){
	//
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_OPEN_START_SEARCH_UI), HandleNotifyOpenStartSearchUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.UPDATE_COLLECT_RESULT), HandleUpdateCollectResult);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.UPDATE_SEARCHING_ITEMS), HandleUpdateSearchingItems);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.SELECT_FRIEND_PAGE_CHANGE), HandleSelectFriendPageChange);
}
//--
function ClickCallback_closeWinBtn(caller : iGUIElement){
	//CloseCollectingUI();
	CloseSearchNpcUI();
	CloseSearchFriendListUI();
	CloseStartCollectUI();
	ClickCallback_end_collect_btn(caller);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLOSE_COLLECT_UI));
}
//--邀请好友
function ClickCallback_invite_friend_img(caller : iGUIElement){
	if(!PlatformMgr.IsPlatYY())
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_INVITE_FRIEND));
}
//--
function ClickCallback_selected_result_img(caller : iGUIElement){
	//1.打开好友选择界面
	//.2.显示好友列表
	CloseStartCollectUI();
	ShowSelectFriendList();
}
//--获取好友列表
function GetFriendList() : ArrayList {
	var input_friend_list : Array = PlayerFriend.GetInstance().GetFriendList();
	var friend_list : ArrayList = new ArrayList(input_friend_list);
	return friend_list;
}
//--
function ShowSelectFriendList(){
	var friend_list : ArrayList = _FilterSelfInFriendlist(GetFriendList());
	if(friend_list == null || (friend_list.Count -1) == 0){
		OpenSearchNpcUI();
		SetNpcEmployeeData();
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.POINTTO_NPC));
		return;
	}
	OpenSearchFriendListUI();
	//
	mFriendListPageMgr = new PagerMgr(friend_list, mPage_num);
	var show_list : ArrayList = mFriendListPageMgr.CurrPage();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.SELECT_FRIEND_PAGE_CHANGE), show_list);
}
//--
function _FilterSelfInFriendlist(list : ArrayList) : ArrayList{
	for(var obj : Object in list){
		var friend_info = obj as FriendInfo;
		if(ScenePlayerMgr.isMainPlayer(friend_info.account)){
			list.Remove(obj);
			break;
		}
	}
	//
	var sousou_angel : FriendInfo = new FriendInfo();
	sousou_angel.account = "sousou";
	sousou_angel.houseID = 0;
	sousou_angel.level = 1;
	sousou_angel.name = "sousou";
	sousou_angel.headIcon = Resources.Load("UISkins/Textures/collect/angel") as Texture2D;
	sousou_angel.bVisit = true;
	list.Insert(0, sousou_angel);
	//
	return list;
}
//--
function ClickCallback_pre_friend_page_btn(caller : iGUIElement){
	if(mFriendListPageMgr && mFriendListPageMgr.GetPageIndex() > 1){
		var show_list : ArrayList = mFriendListPageMgr.PrevPage();
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.SELECT_FRIEND_PAGE_CHANGE), show_list);
	}
}
//--
function ClickCallback_next_friend_page_btn(caller : iGUIElement){
	if(mFriendListPageMgr && mFriendListPageMgr.GetPageIndex() < mFriendListPageMgr.GetTotalPage()){
		var show_list : ArrayList = mFriendListPageMgr.NextPage();
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.SELECT_FRIEND_PAGE_CHANGE), show_list);
	}
}
//--
function HandleSelectFriendPageChange(evt : GameEvent, list : ArrayList){
	//1.清除界面
	//2.新建列表
	clearHeadInfoLoder();
	ClearFriendListUI();
	_CreateFriendListUI(list);
}
//--
function ClearFriendListUI(){
	firend_list_container.removeAll();
}
//--
private function _CreateFriendListUI(friend_list : ArrayList){
	var t_cnt : float = friend_list.Count;
	if(t_cnt <= 0){
		Debug.LogError("table is null");
	}
	
	var _result : float = t_cnt / mSelect_friend_list_Cul_num;
	mSelect_friend_list_Row_num = System.Math.Ceiling(_result);
	
	var icon_h : int = 56;
	var icon_w : int = 56;
	for(var _r_cnt:int=0; _r_cnt < mSelect_friend_list_Row_num; ++ _r_cnt){
			for(var _c_cnt:int=0; _c_cnt < mSelect_friend_list_Cul_num; ++ _c_cnt){
				var posx : float = _c_cnt * (icon_w + info_container_space_w);
				var posy : float = _r_cnt * (icon_h + info_container_space_h);
				var idx : int = mSelect_friend_list_Cul_num * _r_cnt + _c_cnt;
				if(idx >= 0 && idx < t_cnt){
					var friend_info : FriendInfo = friend_list[idx] as FriendInfo;
					_CreateFriendInfoUI(friend_info, icon_w, icon_h, posx, posy);
				}
			}
		}
}
//--
private function _CreateFriendInfoUI(friend_info : FriendInfo, icon_w : int, icon_h : int, posx : float, posy : float){
	var info_container : iGUIContainer = firend_list_container.addElement("iGUIContainer") as iGUIContainer;
	var friend_img : iGUIImage = info_container.addElement("iGUIImage") as iGUIImage;
	var employee_data : EmployeeData;
	if(friend_info.account == "sousou"){
		employee_data = new EmployeeData(1, false, friend_info.headIcon, "", Define.searchangle);
	}
	else{
		employee_data = new EmployeeData(0, false, null, "", "");
	}
	friend_img.userData = employee_data;
	friend_img.setPositionAndSize(Rect(0, 0, 56, 56));
	friend_img.clickCallback = Callback_SelectFriendImg;
	var friend_name : iGUILabel = info_container.addElement("iGUILabel") as iGUILabel;
	friend_name.setPositionAndSize(Rect(0, 60, 56, 28));
	
	info_container.setWidth(56);
	info_container.setHeight(88);
	info_container.setX(posx);
	info_container.setY(posy);
	//
	var headInfo : CollectIcon = new CollectIcon();
	headInfo.imageElement = friend_img;
	headInfo.nameElement = friend_name;
	var headInfoLoader : PlatResLoader = Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(friend_info.account, headInfo);
	mHeadInfoLoaderArray.Add(headInfoLoader);
	//
}
//--
function Callback_SetHeadInfo(obj : CollectIcon){
	var _head_name : String = "";
	var employee_data : EmployeeData = obj.imageElement.userData as EmployeeData;
	employee_data.valid = true;
	employee_data.account = obj.account;
	
	if(employee_data.is_npc == 1){
		employee_data.name = Define.searchangle;
		_head_name = Define.searchangle;
		obj.imageElement.image = Resources.Load("UISkins/Textures/collect/angel") as Texture2D;
	}
	else{
		if(obj.URLValid){
			obj.imageElement.image = obj.image;
		}
		else{
			obj.imageElement.image = Resources.Load("UISkins/Textures/Common1/default_avatar") as Texture2D;
		}
		if("" == obj.info.nickname){
			_head_name = Define.noname;
		}
		else{
			_head_name = obj.info.nickname;
			
		}
		employee_data.name = obj.info.nickname;
		employee_data.photo = obj.imageElement.image;
		obj.imageElement.userData = employee_data;
	}
	obj.nameElement.label.tooltip = _head_name;
	var show_name : String = _head_name;
	var name_width : float = obj.nameElement.style.CalcSize(GUIContent(_head_name)).x;
	var lbl_len : float = obj.nameElement.positionAndSize.width;
	if(name_width > lbl_len){
		var _subs : String = iGUICode_MainUI.getInstance()._MatchHouseNameLength(_head_name, lbl_len);
		_subs = _subs + "...";
		show_name = _subs;
	}
	obj.nameElement.label.text = show_name;
}
//--
private function Callback_SelectFriendImg(caller : iGUIElement){
	var employee_data : EmployeeData = caller.userData as EmployeeData;
	var flag : boolean = employee_data.valid;
	if(flag){
		if(employee_data.is_npc == 0){
			CloseSearchFriendListUI();
		}
		else{
			CloseSearchNpcUI();
			CloseSearchFriendListUI();
		}
		OpenStartCollectUI();
		_SetSelectResult(employee_data);
	}
}

//--设置选择后的结果
private function _SetSelectResult(employee_data : EmployeeData){
	selected_result_img.image = employee_data.photo;
	selected_result_img.label.tooltip = employee_data.name;
	selected_result_img.userData = employee_data;
}
//--
function ClickCallback_start_collect_btn(caller : iGUIElement){
	if(selected_result_img.userData == null){
		UI.getUI().OpenMsgbox("",Define.getContent(5132),true);
		return;
	}
	
	var employee_data : EmployeeData = selected_result_img.userData as EmployeeData;
	ReqStartCollect(employee_data.is_npc, employee_data.account, employee_data.name);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_START_COLLECT_BTN));
}
//--
function ReqStartCollect(is_npc : int, account : String, name : String){
	var req : req_search_items =  new req_search_items();
	req.is_npc = is_npc;
	req.friend_account = account;
	req.friend_name = name;
	NetHelper.Send(req);
}
//--
function SetNpcEmployeeData(){
	var npc_photo : Texture2D = Resources.Load("UISkins/Textures/collect/angel") as Texture2D;
	var employee_data : EmployeeData = new EmployeeData(1, true, npc_photo, "", Define.searchangle);
	npc_img.userData = employee_data;
}
//--
function ClickCallback_npc_img(caller : iGUIElement){
	Callback_SelectFriendImg(caller);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_NPC_IMG));
}
//--
function HandleUpdateSearchingItems(evt : GameEvent, data : notify_searching_items){
	if(DataCenter.isInSelfHouse()){
		CloseStartCollectUI();
		CloseSearchNpcUI();
		CloseSearchFriendListUI();
		if(CollectComp.self_use_collect_flag)
			CloseCollectResultUI();
		if(data.remain_seconds > 0)
			OpenCollectingUI(true);
	}
	SetWorkingEmployeeData(data);
}
//--
function SetWorkingEmployeeData(data : notify_searching_items){
	//clearHeadInfoLoder();
	SetWorkingEmployeePhoto(data.friend_account,data.is_npc);
	SetWorkingEmployeeRemainTime(data.remain_seconds);
	SetFriendHelpCount(data.whip_count);
}
//--
function SetFriendHelpCount(count : int){
	help_count.label.text = count.ToString();
}
//--
function SetWorkingEmployeeRemainTime(remain_seconds : int){
	var remain_tm:RemainTimeStruct;
	remain_tm = PhyPowerMgr.CalculateRemainTime(remain_seconds);
	remain_work_time.label.text = remain_tm.hour + Define.hour + remain_tm.min.ToString() + Define.minute + remain_tm.sec.ToString()+ Define.seconds;
	if(mWorkingRemainTimer){
		mWorkingRemainTimer.Stop();
		mWorkingRemainTimer = null;
	}
	if(remain_seconds >0){
		StartWorkingRemainTimer(remain_seconds);
	}
	else{
		CloseCollectingUI();
	}
}
//--
function StartWorkingRemainTimer(remain_seconds : int){
	mRemain_Seconds = remain_seconds;
	var remain_timer : Timer = new Timer(1000, remain_seconds);
	remain_timer.addEventListener(TimerEvent.TIMER,WorkingTimer_OnTimer);
	remain_timer.addEventListener(TimerEvent.TIMER_COMPLETE,WorkingTimer_Complete);
	remain_timer.Start();
	mWorkingRemainTimer = remain_timer;
}
//--
function WorkingTimer_OnTimer(_timer:Timer,obj:Object){
	-- mRemain_Seconds;
	SetNeedWhipNum();
	if(!is_user_changed_use_num){
		SetToUseWhipNum();
	}
	var remain_tm:RemainTimeStruct;
	remain_tm = PhyPowerMgr.CalculateRemainTime(mRemain_Seconds);
	remain_work_time.label.text = remain_tm.hour + Define.hour + remain_tm.min.ToString() + Define.minute + remain_tm.sec.ToString() + Define.seconds;
	if(start_collect_panel.enabled && collecting_container.enabled && mRemain_Seconds <= 0){
		CollectComp.ReqUpdateSearchItems();
	}
}
//--
function WorkingTimer_Complete(_timer:Timer,obj:Object){

}
//--
function SetWorkingEmployeePhoto(account : String, is_npc : int){
	//
	collecting_friend_img.userData = is_npc;
	var headInfo : CollectEmployIcon = new CollectEmployIcon();
	headInfo.imageElement = collecting_friend_img;
	headInfo.nameElement = collecting_friend_img;
	var headInfoLoader : PlatResLoader = Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(account, headInfo);
	mHeadInfoLoaderArray.Add(headInfoLoader);
	//	
}
//--
function Callback_SetWorkingEmployeeInfo(obj : CollectEmployIcon){
	var is_npc : int = Convert.ToInt32(collecting_friend_img.userData);
	var _head_name : String = "";
	if("" == obj.info.nickname){
		_head_name = Define.noname;
	}
	else{
		_head_name = obj.info.nickname;

	}
	
	if(is_npc == 0){
		if(obj.URLValid){
			obj.imageElement.image = obj.image;
		}
		else{
			obj.imageElement.image = Resources.Load("UISkins/Textures/Common1/default_avatar") as Texture2D;
		}
		obj.nameElement.label.tooltip = _head_name;
	}
	else{
		obj.nameElement.label.tooltip = Define.searchangle;
		obj.imageElement.image = Resources.Load("UISkins/Textures/collect/angel") as Texture2D;
	}
/*
	//
	var show_name : String = _head_name;
	var name_width : float = (obj.nameLabel as iGUILabel).style.CalcSize(GUIContent(_head_name)).x;
	var lbl_len : float = (obj.nameLabel as iGUILabel).positionAndSize.width;
	if(name_width > lbl_len){
		var _subs : String = iGUICode_MainUI.getInstance()._MatchHouseNameLength(_head_name, lbl_len);
		_subs = _subs + "...";
		show_name = _subs;
	}
	else{
		//var _name_lbl : iGUILabel = obj.nameLabel as iGUILabel;
		//_name_lbl.setWidth(name_width);
	}
	(obj.nameLabel as iGUILabel).label.text = show_name;
*/
}
//--
function ClickCallback_whip_btn(caller : iGUIElement){
	ReqWhip();
}
//--
function ReqWhip(){
	var req : req_whip = new req_whip();
	NetHelper.Send(req);
}
//--
function ClickCallback_immediately_done_btn(caller : iGUIElement){
	OpenUseWhipUI();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_IMMEDIATE_DONE_BTN));
}
//--
function OpenUseWhipUI(){
	start_collect_panel.passive = true;
	use_frame.setEnabled(true);
	SetUseWhipUIData();
}
//--
static function CloseUseWhipUI(){
	iGUICode_CollectRoot.getInstance().is_user_changed_use_num = false;
	iGUICode_CollectRoot.getInstance().start_collect_panel.passive = false;
	iGUICode_CollectRoot.getInstance().use_frame.setEnabled(false);
	Global.GetSysTooltip().Hide();
}
//--
function ClickCallback_uf_cancel_btn(caller : iGUIElement){
	CloseUseWhipUI();
}
//--
function SetUseWhipUIData(){
	SetRemainWhipNum();
	SetNeedWhipNum();
	SetToUseWhipNum();
}
//--
function SetRemainWhipNum(){
	var whip_num : int = GetWhipNum();
	remain_num_lbl.label.text = whip_num.ToString();
}
//--
function CalcuTotalNeedWhipNum() : int{
	var remain_seconds : float = mRemain_Seconds;
	var need_whip : int = Mathf.Ceil(remain_seconds / whip_reduce_seconds);
	return need_whip;
}
//--
function SetToUseWhipNum(){
	var num : int = CompareNums();
	use_num_lbl.userData = num;
	use_num_lbl.label.text = num.ToString();
}
//--
function SetNeedWhipNum(){
	var need_num : int = CalcuTotalNeedWhipNum();
	uf_tip_label1.label.text = Define.getContent(5133, [need_num.ToString()]);
}
//--
function CompareNums() : int{
	var need_whip_num : int = CalcuTotalNeedWhipNum();
	var exist_whip_num : int = GetWhipNum();
	if(need_whip_num >= exist_whip_num){
		to_use_total_whip_num = exist_whip_num;
		return exist_whip_num;
	}
	else{
		to_use_total_whip_num = need_whip_num;
		return need_whip_num;
	}
}
//--
function ClickCallback_add_btn(caller : iGUIElement){
	AddToUseWhipNum();
}
//--
function AddToUseWhipNum(){
	var cur_num :int = Convert.ToInt32(use_num_lbl.userData);
	if(cur_num >= to_use_total_whip_num){
		return;
	}
	else{
		++ cur_num;
		use_num_lbl.userData = cur_num;
		is_user_changed_use_num = true;
		use_num_lbl.label.text = cur_num.ToString();
	}
}
//--
function ClickCallback_reduce_btn(caller : iGUIElement){
	ReduceToUseWhipNum();
}
//--
function ReduceToUseWhipNum(){
	var cur_num : int = Convert.ToInt32(use_num_lbl.userData);
	if(cur_num <= 0){
		return;
	}
	else{
		-- cur_num;
		use_num_lbl.userData = cur_num;
		is_user_changed_use_num = true;
		use_num_lbl.label.text = cur_num.ToString();
	}
}
//--
private static var mReqWhipCnt : int = 0;
//--
function ClickCallback_uf_use_btn(){
	if(GetWhipNum() == 0){
		//Global.GetSysMsgHandler().ShowSysMsg(404);
		UI.getUI().OpenMsgbox("",Define.getContent(5134),"",Callback_GotoShop, "", Callback_CancelUseWhip);
		return;
	}
	var secs : int = Convert.ToInt32(use_num_lbl.userData);
	mReqWhipCnt = secs;
	var whip_cnt : int = secs;
	var t_mins : int = whip_cnt * per_whip_min;
	var params : ArrayList = new ArrayList();
	params.Add(whip_cnt);
	params.Add(t_mins);
	Global.GetSysMsgHandler().ShowSysMsg(441,params);
}
//--
static function ConfirmUseWhip(caller : iGUIElement){
	if(mReqWhipCnt != 0){
		ReqShortenWorkingTime(mReqWhipCnt);
		mReqWhipCnt = 0;
		CloseUseWhipUI();
	}
}
//--
static function CancelUseWhip(caller : iGUIElement){
	mReqWhipCnt = 0;
}
//--
function Callback_GotoShop(caller : iGUIElement){
	PropBuyCommonLogic.getInstance().openPropBuyCommonUI(10007);	// 皮鞭
	CloseUseWhipUI();
}
//--
function Callback_CancelUseWhip(caller : iGUIElement){
	mReqWhipCnt = 0;
}
//--
function GetWhipNum() : int{
	return SelfItemLogic.getInstance().getItemNum(whip_item_id1);
		 //+ SelfItemLogic.getInstance().getItemNum(whip_item_id2);
}
//--
static function ReqShortenWorkingTime(secs : int){
	var req : req_quick_search_items = new req_quick_search_items();
	req.whip_count = secs;
	NetHelper.Send(req);
}
//--
function HandleUpdateCollectResult(evt : GameEvent, data : notify_search_items_result){
	CloseUseWhipUI();
	CloseCollectingUI();
	/*
	if(!start_collect_panel.enabled)
		OpenCollectUI();
	*/
	OpenCollectResultUI();
	SetResultEmployeePhoto(data.friend_account, data.is_npc);
	SetCollectResult(data.grid_count, data.gain_items);
}
//--
function SetCollectResult(grid_cnt : int, gain_items : ArrayList){
	OpenExtendGridGrade(grid_cnt);
	SetCollectItems(gain_items);
}
//--
function SetCollectItems(gain_items : ArrayList){
	var item_cnt : int = gain_items.Count;
	if(item_cnt <= 0){
		return;
	}
	SetNormalItem(gain_items[0] as vip_gift_item);
	gain_items.RemoveAt(0);
	SetSpecialItems(gain_items);
}
//--
function SetNormalItem(item : vip_gift_item){
	//
	var itm_cnt : int = item.count;
	var itm_id : int = item.item_id;
	var itm_row : ItemRow = _getItemRow(itm_id);
	normal_stuff_img.userData = itm_row;
	var itm_icon_name : String = itm_row.icon;
	normal_stuff_count.label.text = itm_cnt.ToString();
	_LoadItemImg(normal_stuff_img, itm_icon_name);
}
//--
function MouseOverCallback_ShowItemHint(caller : iGUIElement){
	if(caller.userData == null)
		return;
	var itm_row : ItemRow = caller.userData as ItemRow;
	var desc_str : String = ResManager.LgtMgr.getItemDescription(itm_row.sub_id);;
	SetItemHint(caller, itm_row.name, desc_str);
}
//--
function MouseOverCallback_uf_icon_label(caller : iGUIElement){
	var itm_row : ItemRow = ResManager.LgtMgr.getItemRow(whip_item_id1);
	var desc_str : String = ResManager.LgtMgr.getItemDescription(itm_row.sub_id);
	SetItemHint(caller, itm_row.name, desc_str);
}
//--
function SetItemHint(caller : iGUIElement, itm_name : String, desrc : String){
	var style : GUIStyle = new GUIStyle();
	style.normal.textColor = Color.white;
	style.fontStyle = FontStyle.Bold;
	style.wordWrap = true;
	Global.GetSysTooltip().Begin(caller);
	Global.GetSysTooltip().Add(GUIContent(itm_name), style);
	if(desrc != ""){
		Global.GetSysTooltip().Add(GUIContent(desrc), style);
	}
	Global.GetSysTooltip().Show(true);
}
//--
function SetSpecialItems(gain_items : ArrayList){
	for(var i:int=0; i < gain_items.Count; ++ i){
		if(i ==0){
			//special_stuff_img
			SetSpecialItemInfo(special_stuff_img, special_stuff_count, gain_items[0] as vip_gift_item);
		}
		else{
			//var opened_grid_count : int = grid_cnt - fixed_grid_count;
			var extend_grid_base_name : String = "extend_img_";
			//for(var i:int=0; i < opened_grid_count; ++ i){
			var extend_grid_name : String = extend_grid_base_name + i;
			var extend_count_name : String = "extend_" + i + "_count";
			var extend_grid_img : iGUIImage = FindExtendGridCtrl(extend_grid_name);
			var extend_count : iGUILabel = FindExtendCountCtrl(extend_count_name);
			if(extend_grid_img)
				SetSpecialItemInfo(extend_grid_img, extend_count, gain_items[i] as vip_gift_item);
			}
	}
}
//--
function SetSpecialItemInfo(ctrl : iGUIImage, count_ctrl : iGUILabel, item : vip_gift_item){
	var itm_cnt : int = item.count;
	var itm_id : int = item.item_id;
	var itm_row : ItemRow = _getItemRow(itm_id);
	var itm_icon_name : String = itm_row.icon;
	ctrl.userData = itm_row;
	if(count_ctrl)
		count_ctrl.label.text = itm_cnt.ToString();
	_LoadItemImg(ctrl, itm_icon_name);
}
//--
function _LoadItemImg(img_frm : iGUIImage, img_name : String){
	var _asynIcon : AsynIcon = new AsynIcon(function (tex : Texture){img_frm.image = tex; }, null);
	_asynIcon.load("Icon/" + img_name); 	
}
//--
private function _getItemRow(id : int) : ItemRow{
	return ResManager.LgtMgr.getItemRow(id);
}

//--
function OpenExtendGridGrade(grid_cnt : int){
	var opened_grid_count : int = grid_cnt - fixed_grid_count;
	var extend_grid_base_name : String = "extend_img_";
	for(var i:int=0; i < opened_grid_count; ++ i){
		var extend_grid_name : String = extend_grid_base_name + (i + 1);
		var extend_count_name : String = "extend_" + (i+1) + "_count";
		var extend_grid_img : iGUIImage = FindExtendGridCtrl(extend_grid_name);
		var extend_count : iGUILabel = FindExtendCountCtrl(extend_count_name);
		if(extend_grid_img)
			extend_grid_img.image = null;
		if(extend_count)
			extend_count.label.text = "";
	}
}
//--
function FindExtendCountCtrl(name : String) : iGUILabel{
	for(var i:int=0; i < collect_result_container.itemCount; ++ i){
		if(collect_result_container.items[i].variableName == name){
			return collect_result_container.items[i] as iGUILabel;
		}
	}
	return null;
}
//--
function FindExtendGridCtrl(name : String) : iGUIImage{
	for(var i:int=0; i < collect_result_container.itemCount; ++ i){
		if(collect_result_container.items[i].variableName == name){
			return collect_result_container.items[i] as iGUIImage;
		}
	}
	return null;
}
//--
function SetResultEmployeePhoto(account : String, is_npc : int){
	working_player_img.userData = is_npc;
	var headInfo : CollectEmployResultIcon = new CollectEmployResultIcon();
	headInfo.imageElement = working_player_img;
	headInfo.nameElement = working_player_img;
	var headInfoLoader : PlatResLoader = Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(account, headInfo);
	mHeadInfoLoaderArray.Add(headInfoLoader);
}
//--
function Callback_SetResultEmployeeInfo(obj : CollectEmployResultIcon){
	var is_npc : int = Convert.ToInt32(working_player_img.userData);
	var _head_name : String = "";
	if("" == obj.info.nickname){
		_head_name = Define.noname;
	}
	else{
		_head_name = obj.info.nickname;

	}
	
	if(is_npc == 0){
		if(obj.URLValid){
			obj.imageElement.image = obj.image;
		}
		else{
			obj.imageElement.image = Resources.Load("UISkins/Textures/Common1/default_avatar") as Texture2D;
		}
		obj.nameElement.label.tooltip = _head_name;
	}
	else{
		obj.nameElement.label.tooltip = Define.searchangle;
		obj.imageElement.image = Resources.Load("UISkins/Textures/collect/angel") as Texture2D;
	}
	
}
//--
function ClickCallback_end_collect_btn(caller : iGUIElement){
	CollectComp.collect_end_flag = false;
	CloseCollectResultUI();
	CloseCollectUI();
}
//--
function OpenCollectResultUI(){
	collect_result_container.setEnabled(true);
}
//--
function CloseCollectResultUI(){
	collect_result_container.setEnabled(false);
}
//--打开正在收集界面
function OpenCollectingUI(is_home : boolean){
	collecting_container.setEnabled(true);
	if(is_home){
		immediately_done_btn.setEnabled(true);
		view_help_players_btn.setEnabled(true);
		label17.setEnabled(true);
		help_count.setEnabled(true);
		whip_btn.setEnabled(false);
		if(start_collect_panel.enabled)
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_CUT_COLLECT_TIME_BTN));
	}
	else{
		immediately_done_btn.setEnabled(false);
		view_help_players_btn.setEnabled(false);
		label17.setEnabled(false);
		help_count.setEnabled(false);
		whip_btn.setEnabled(true);
		
	}
}
//--关闭正在收集界面
function CloseCollectingUI(){
	collecting_container.setEnabled(false);
	if(DataCenter.isInSelfHouse()){
		CollectComp.self_use_collect_flag = false;
	}
	else{
		CollectComp.other_use_collect_flag = false;
		CloseCollectUI();
	}
}
//--打开雇佣NPC的界面
function OpenSearchNpcUI(){
	null_friend_container.setEnabled(true);
	if(PlatformMgr.IsPlatYY()){
		invite_friend_img.setEnabled(false);
		image3.setEnabled(false);
		label20.setEnabled(false);
		npc_img.setX(0.5f);
		image4.setX(0.5f);
		label21.setX(0.5f);
	}
	else{
		//invite_friend_img.setEnabled(true);
		//image3.setEnabled(true);
		//label20.setEnabled(true);		
	}
}
//--关闭雇佣NPC的界面
function CloseSearchNpcUI(){
	null_friend_container.setEnabled(false);
}
//--打开好友选择列表
function OpenSearchFriendListUI(){
	search_friend_list_container.setEnabled(true);
}
//--
function CloseSearchFriendListUI(){
	search_friend_list_container.setEnabled(false);
}
//--打开开始收集界面
function OpenStartCollectUI(){
	start_collect_container.setEnabled(true);
	ClearEmployeeData();
	
	if(NewPlayGuideModule.collect_newhand_flag)
		ShowInNewHandPhase();
}
//--
function ShowInNewHandPhase(){
	SetNpcEmployeeData();
	var employee_data : EmployeeData = npc_img.userData as EmployeeData;
	_SetSelectResult(employee_data);
}
//--
function ClearEmployeeData(){
	selected_result_img.image = Resources.Load("UISkins/Textures/collect/touxiang2") as Texture2D;
	if(PlatformMgr.IsPlatYY()){
		selected_result_img.image = Resources.Load("UISkins/Textures/collect/touxiang") as Texture2D;
	}
	selected_result_img.userData = null;
	selected_result_img.label.tooltip = "";
}
//--关闭开始收集界面
function CloseStartCollectUI(){
	start_collect_container.setEnabled(false);
}
//--打开收集界面
function OpenCollectUI(){
	start_collect_panel.setEnabled(true);
	UI.getUI().SetModal("CollectRoot", true);
}
//--关闭收集界面
function CloseCollectUI(){
	start_collect_panel.setEnabled(false);
	UI.getUI().SetModal("CollectRoot", false);
}
//--打开Root，注册本界面事件
static function OpenCollectUIRoot(){
	if(!UI.getUI().GetUIRoot("CollectRoot"))
		UI.getUI().OpenUIRoot("CollectRoot");
	else{
		UI.getUI().EnableUIRoot("CollectRoot", true);
	}
}
//--
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
//--
function ClickCallback_view_help_players_btn(caller : iGUIElement){
	iGUICode_NoticeRoot.getInstance().OpenWin();
	if(iGUICode_NoticeRoot.getInstance().NoticeTypePanel.activePanel == 0)
		iGUICode_NoticeRoot.getInstance().ReqSelfMsgs();
	else
		iGUICode_NoticeRoot.getInstance().NoticeTypePanel.activePanel = 0;
}
//--
function HandleNotifyOpenStartSearchUI(evt : GameEvent, data : notify_open_search_items_ui){
	var rate : int = data.rate;
	var count : int = data.item_count;
	label6.label.text = count.ToString();
	label7.label.text = rate.ToString() + "%";
}