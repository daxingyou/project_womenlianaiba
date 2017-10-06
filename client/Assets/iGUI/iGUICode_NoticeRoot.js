#pragma strict

import iGUI;
private static var MAX_VISITLOGROW:int = 60;
private static var visitlogitem_order:int = 0;
private var mHeadInfoLoaderArray : Array = new Array();
private var mHeadInfoLoaderArray2 : Array = new Array();
private static var self_msg_itm_order:int = 0;
private static var instance : iGUICode_NoticeRoot;
private var mNameInfoLoaderArray : Array = new Array();
//--
class VisitNameInfo extends PlatResInfoCtrl {
	public var nameElement : iGUILabel;
	
	//overwrite
	public function Callback() {
	 	iGUICode_NoticeRoot.getInstance().Callback_SetVisitNameInfo(this);
	 } 
}
//--
class NoticeIcon extends PlatResInfoCtrl {
	public var imageElement : iGUIImage;
	public var nameElement : iGUILabel;
	
	//overwrite
	public function Callback() {
		iGUICode_NoticeRoot.getInstance().Callback_SetHeadInfo(this);
	}
}
//--
class NoticeWhipIcon extends PlatResInfoCtrl {
	public var imageElement : iGUIImage;
	public var nameElement : iGUILabel;
	
	//overwrite
	public function Callback() {
		iGUICode_NoticeRoot.getInstance().Callback_SetWhipPlayerInfo(this);
	}
}

//--
enum SELF_MSG_TYPE{
	HIRE,
	BE_HIRED,
	WHIP,
	BE_WHIPED,
}
//--
class SelfMsgsClass implements System.IComparable{
	var tm : stime;
	var is_npc : int =0;
	var whip_account : String = "";
	var account : String = "";
	var name : String = "";
	var gain_exp :int = 0;
	var cost_money : int = 0;
	var whip_count : int = 0;
	var self_msg_type : SELF_MSG_TYPE;
	var combine_msg : String = ""; 
	function SelfMsgsClass(tm : stime, is_npc : int, whip_account : String, account : String, gain_exp : int, cost_money : int, whip_count : int, type : SELF_MSG_TYPE){
		this.tm = tm;
		this.is_npc = is_npc;
		this.whip_account = whip_account;
		this.account = account;
		this.gain_exp = gain_exp;
		this.cost_money = cost_money;
		this.whip_count = whip_count;
		this.self_msg_type = type;
	}
	//--
	public final function CompareTo(_val : Object) : int{
		var val : SelfMsgsClass = _val as SelfMsgsClass;
		if(this.tm.year < val.tm.year){
			return -1;
		}
		if(this.tm.year > val.tm.year){
			return 1;
		}
		if(this.tm.month < val.tm.month){
			return -1;
		}
		if(this.tm.month > val.tm.month){
			return 1;
		}
		if(this.tm.day < val.tm.day){
			return -1;
		}
		if(this.tm.day > val.tm.day){
			return 1;
		}
		if(this.tm.hour < val.tm.hour){
			return -1;
		}
		if(this.tm.hour > val.tm.hour){
			return 1;
		}
		if(this.tm.minute < val.tm.minute){
			return -1;
		}
		if(this.tm.minute > val.tm.minute){
			return 1;
		}
		if(this.tm.second < val.tm.second){
			return -1;
		}
		if(this.tm.second > val.tm.second){
			return 1;
		}
		
		return 0;
	}
}
function Awake(){
	instance=this;
	RegistEvt();
}
static function getInstance(){
	return instance;
}

//
@HideInInspector
var UpdateListBox : iGUIListBox;
@HideInInspector
var UpdateNotice : iGUIPanel;
@HideInInspector
var visitListBox : iGUIListBox;
@HideInInspector
var visitNotice : iGUIPanel;
@HideInInspector
var self_msgs_listBox : iGUIListBox;
@HideInInspector
var self_msgs_notice : iGUIPanel;
@HideInInspector
var NoticeTypePanel : iGUITabPanel;
@HideInInspector
var closeBtn : iGUIButton;
@HideInInspector
var NoticeWin : iGUIWindow;
@HideInInspector
var NoticeRoot : iGUIRoot;


function Start()
{
	NoticeTypePanel.tabChangeCallback = TabChangeCallback;
	
	_initNoticeListBox();
}
//--
function RegistEvt(){
	//
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.UPDATE_SELF_MSGS), HandleUpdateSelfMsgs);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_SELF_MSGS), HandleNotifySelfMsgs);
}
function OnGUI()
{
	if(visitListBox.itemCount > MAX_VISITLOGROW)
	{
		visitListBox.removeElement(visitListBox.items[visitListBox.itemCount-1]);
		visitListBox.removeElement(visitListBox.items[visitListBox.itemCount-1]);
	}
}
//--
function TabChangeCallback(caller:iGUIElement):void
{
	var tabpanel:iGUITabPanel = caller as iGUITabPanel;
	if(tabpanel.activePanel == 1)
		ReqVisitLogs();
	if(tabpanel.activePanel == 0)
		ReqSelfMsgs();
}
//--
function ReqSelfMsgs(){
	var req : req_self_msgs = new req_self_msgs();
	NetHelper.Send(req);
}
//--
function ReqVisitLogs() {
	var packet:req_house_visit_log = new req_house_visit_log();
	NetHelper.Send(packet);
}
//--
function AddVisitLogs(visit_list:ArrayList)
{
	visitListBox.removeAll();
	clearNameInfoLoder();
	for(var i:int=0;i<visit_list.Count;++i)
	{
		var v_log : visit_log = visit_list[i] as visit_log;
		var p_account : String = v_log.openid;
		var visit_time:String = CombineTime(v_log.visit_time);
		SetVisitItemOnListbox(visit_time, p_account);
	}
}
//--
function Callback_SetVisitNameInfo(info : VisitNameInfo){
	var name : String = "";
	var ctrl : iGUILabel = info.nameElement;
	if("" == info.info.nickname){
		name = Define.noname;
	}
	else{
		name = info.info.nickname;
	}
	name = "[" + name + "]";
	var content : String = Define.getContent(5180, [name]);
	ctrl.label.text = content;
}
//--
function ReqVisitPlayerName(account : String, ctrl : iGUILabel){
	var info : VisitNameInfo = new VisitNameInfo();
	info.nameElement = ctrl;
	var nameInfoLoader : PlatResLoader = Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(account,info);
	mNameInfoLoaderArray.Add(nameInfoLoader);
}
//--
function clearNameInfoLoder()
{
	for (var obj : Object in mNameInfoLoaderArray)
	{
		var loader : PlatResLoader = obj as PlatResLoader;
		loader.Cancel();
	}
	mNameInfoLoaderArray.Clear();
}
//--
function CombineTime(tm : stime) : String{
	var visit_time_list:String[] = new String[11];
	visit_time_list[0] = FormatDateString(tm.year);
	visit_time_list[1] = Define.year;
	visit_time_list[2] = FormatDateString(tm.month);
	visit_time_list[3] = Define.month;
	visit_time_list[4] = FormatDateString(tm.day);
	visit_time_list[5] = Define.date;
	visit_time_list[6] = FormatDateString(tm.hour);
	visit_time_list[7] = ":";
	visit_time_list[8] = FormatDateString(tm.minute);
	visit_time_list[9] = ":";
	visit_time_list[10] = FormatDateString(tm.second);
	var visit_time:String = String.Concat(visit_time_list);
	return visit_time;
}
//--
public static function FormatDateString(num:int):String
{
	if(num < 10)
	{
		var format:String = "0"+System.Convert.ToString(num);
		return format;
	}
	return System.Convert.ToString(num);
}
//--
function SetVisitItemOnListbox(time:String, p_account : String)
{
	var visit_itm : iGUIElement = visitListBox.addSmartObject("VisitItem");
	visit_itm.setWidth(345);
	visit_itm.setOrder(visitlogitem_order);
	ReqVisitPlayerName(p_account, (visit_itm.items[0] as iGUILabel));
	(visit_itm.items[1] as iGUILabel).label.text = time;
	//visit_itm.items[2].setEnabled(false);
	if(p_account == ""){
		visit_itm.items[2].setEnabled(false);
	}
	(visit_itm.items[2] as iGUIButton).userData = p_account;
	(visit_itm.items[2] as iGUIButton).clickCallback = ClickCallback_visitBtn;
	++visitlogitem_order;
	visitListBox.refreshRect();
	//visitListBox.scrollToBottom(0);
}
//--
function ClickCallback_visitBtn(caller : iGUIElement){
	var v_acc : String = caller.userData as String;
	if(v_acc != ""){
		PlayerFriend.GetInstance().ReqEnterFriendHouse(v_acc,enter_house_type.eht_visit_log);
	}
}
//--
function closeBtn_Click(caller : iGUIButton)
{
	clearNameInfoLoder();
	ClearOldSelfMsgs();
	clearHeadInfoLoder();
	ClearWhipPlayerInfoLoader();
	NoticeWin.setEnabled(false);
	//UI.getUI().CloseUIRoot("NoticeRoot");
	UI.getUI().SetModal("NoticeRoot", false);
}
//--
function OpenWin(){
	NoticeWin.setEnabled(true);
	UI.getUI().SetModal("NoticeRoot", true);
}
//--
static function OpenNoticeRoot(){
	if (!UI.getUI().GetUIRoot("NoticeRoot")){
		UI.getUI().OpenUIRoot("NoticeRoot");
	}
}
//--------------------------------------------------
// 初始公告列表
public var UpdateStyle : GUIStyle;
public var ActivityStyle : GUIStyle;
public var UpdateHeight : float = 25.0f;
public var ActivityHeight : float = 25.0f;
private function _initNoticeListBox()
{
	_setNoticeListBox(UpdateListBox, 1, UpdateStyle, UpdateHeight);
}
private function _setNoticeListBox(list_box : iGUIListBox, type : int, style : GUIStyle, height : float)
{
	var notice_arr : Array = NoticeLogic.getInstance().getRowsByType(type);
	for (var obj : Object in notice_arr)
	{
		var row : NoticeRow = obj as NoticeRow;
		var notice : iGUIButton = list_box.addElement("iGUIButton") as iGUIButton;
		notice.style = style;
		notice.userData = row.id;
		notice.clickCallback = ClickCallbakc_notice;
		notice.label.text = row.title;
		// 属性
		notice.setWidth(1.0f);
		notice.setHeight(height);
		notice.setX(0.0f);
	}
	list_box.refreshRect();
}
function ClickCallbakc_notice(caller : iGUIElement)
{
	NoticeWin.setEnabled(false);
	UI.getUI().SetModal("NoticeRoot", false);
	NoticeLogic.getInstance().openSingleNotice(Convert.ToInt32(caller.userData));
}
//--------------------------------------------------
function HandleNotifySelfMsgs(evt : GameEvent, data : notify_self_msgs){
	var merge_list : ArrayList = new ArrayList();
	var hire_source_list : ArrayList = data.hire_msgs;
	var be_hired_sourec_list : ArrayList = data.be_hire_msgs;
	var whip_source_list : ArrayList = data.whip_msgs;
	var be_whiped_source_list : ArrayList = data.be_whip_msgs;
	for(var i:int=0; i < hire_source_list.Count; ++ i){
		var hire_source_msg : hire_msg = hire_source_list[i] as hire_msg;
		var hire_target_msg : SelfMsgsClass = new SelfMsgsClass(hire_source_msg.time, hire_source_msg.is_npc, "", hire_source_msg.friend_account, 0, hire_source_msg.cost_money, 0, SELF_MSG_TYPE.HIRE);
		merge_list.Add(hire_target_msg);
	}
	for(var j:int=0; j < be_hired_sourec_list.Count; ++ j){
		var be_hired_source_msg : be_hire_msg = be_hired_sourec_list[j] as be_hire_msg;
		var be_hired_target_msg : SelfMsgsClass = new SelfMsgsClass(be_hired_source_msg.time, 0, "", be_hired_source_msg.friend_account, be_hired_source_msg.gain_exp, 0, 0, SELF_MSG_TYPE.BE_HIRED);
		merge_list.Add(be_hired_target_msg);
	}
	for(var k:int=0; k < whip_source_list.Count; ++ k){
		var whip_source_msg : whip_msg = whip_source_list[k] as whip_msg;
		var whip_target_msg : SelfMsgsClass = new SelfMsgsClass(whip_source_msg.time, whip_source_msg.is_npc, whip_source_msg.account, whip_source_msg.friend_account, 0, 0, whip_source_msg.whip_count, SELF_MSG_TYPE.WHIP);
		merge_list.Add(whip_target_msg);
	}
	for(var m:int=0; m < be_whiped_source_list.Count; ++ m){
		var be_whiped_source_msg : be_whip_msg = be_whiped_source_list[m] as be_whip_msg;
		var be_whiped_target_msg : SelfMsgsClass = new SelfMsgsClass(be_whiped_source_msg.time, 0, "", be_whiped_source_msg.friend_account, 0, 0, 0, SELF_MSG_TYPE.BE_WHIPED);
		merge_list.Add(be_whiped_target_msg);
	}
	ClearOldSelfMsgs();
	if(merge_list.Count <= 0){
		return;
	}
	merge_list.Sort();
	merge_list.Reverse();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.UPDATE_SELF_MSGS), merge_list);
}
//--
function HandleUpdateSelfMsgs(evt : GameEvent, list : ArrayList){
	CreateSelfMsgList(list);
	
}
//--
function CollectPlayerName(account : String, ctrl : iGUILabel){
	var headInfo : NoticeIcon = new NoticeIcon();
	headInfo.imageElement = null;
	headInfo.nameElement = ctrl;
	var headInfoLoader : PlatResLoader = Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(account, headInfo);
	mHeadInfoLoaderArray.Add(headInfoLoader);
}
//--
function CollectWhipPlayerName(account : String, ctrl : iGUILabel){
	var headInfo : NoticeWhipIcon = new NoticeWhipIcon();
	headInfo.imageElement = null;
	headInfo.nameElement = ctrl;
	var headInfoLoader : PlatResLoader = Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(account, headInfo);
	mHeadInfoLoaderArray2.Add(headInfoLoader);
}
//--
function Callback_SetWhipPlayerInfo(obj : NoticeWhipIcon){
	var _head_name : String = "";
	
	//
	var content_lbl : iGUILabel = obj.nameElement;
	var msg : SelfMsgsClass = content_lbl.userData as SelfMsgsClass;
	if("" == obj.info.nickname){
		_head_name = Define.noname;
	}
	else{
		_head_name = obj.info.nickname;
	}

	var pre_lbl_h : float = content_lbl.positionAndSize.height;
	var whip_name : String = " [" + _head_name + "] ";
	var friend_name : String = " [" + msg.account + "] ";
	var content : String = CombineSelfMsg(whip_name, friend_name, msg);
	var content_h : float = content_lbl.style.CalcHeight(GUIContent(content), 345);
	content_lbl.setHeight(content_h);
	content_lbl.label.text = content;
	var delta_h : float = content_h - pre_lbl_h;
	var parent : iGUIElement = content_lbl.getTargetContainer();
	var p_pre_h : float = parent.positionAndSize.height;
	var new_p_h : float = p_pre_h + delta_h + 10;
	parent.setHeight(new_p_h);
}
//--
function Callback_SetHeadInfo(obj : NoticeIcon){
	var _head_name : String = "";
	
	//
	var content_lbl : iGUILabel = obj.nameElement;
	var msg : SelfMsgsClass = content_lbl.userData as SelfMsgsClass;
	if(msg.is_npc == 0){
		if("" == obj.info.nickname){
			_head_name = Define.noname;
		}
		else{
			_head_name = obj.info.nickname;
		}
	}
	else{
		_head_name = Define.searchangle;
	}
	if(msg.self_msg_type == SELF_MSG_TYPE.WHIP && !ScenePlayerMgr.isMainPlayer(msg.whip_account)){
		msg.account = _head_name;
		content_lbl.userData = msg;
		return;
	}
	
	var pre_lbl_h : float = content_lbl.positionAndSize.height;
	var friend_name : String = " [" + _head_name + "] ";
	var content : String = CombineSelfMsg("", friend_name, msg);
	var content_h : float = content_lbl.style.CalcHeight(GUIContent(content), 345);
	content_lbl.setHeight(content_h);
	content_lbl.label.text = content;
	var delta_h : float = content_h - pre_lbl_h;
	var parent : iGUIElement = content_lbl.getTargetContainer();
	var p_pre_h : float = parent.positionAndSize.height;
	var new_p_h : float = p_pre_h + delta_h + 10;
	parent.setHeight(new_p_h);
}
//--
function CombineSelfMsg(whip_name : String, whiped_name : String, msg : SelfMsgsClass): String{
	var combine_str : String = "";
	if(msg.self_msg_type == SELF_MSG_TYPE.HIRE){
		combine_str = Define.getContent(5181, [whiped_name, msg.cost_money.ToString()]);
	}
	else if(msg.self_msg_type == SELF_MSG_TYPE.BE_HIRED){
		combine_str = Define.getContent(5182, [whiped_name, msg.gain_exp.ToString()]);
	}
	else if(msg.self_msg_type == SELF_MSG_TYPE.BE_WHIPED){
		combine_str = Define.getContent(5183, [whiped_name]);
	}
	else{
		var str4_3 : String = "" + msg.whip_count * 10;
		var str4_3_1 : String = "" + msg.whip_count * 5;
		if(whip_name == "")
			combine_str = Define.getContent(5184, [whiped_name, msg.whip_count.ToString(), str4_3]);
		else
			combine_str = Define.getContent(5185, [whip_name, whiped_name, msg.whip_count.ToString(), str4_3_1]);
	}
	return combine_str;
}
//--
function CreateSelfMsgList(list : ArrayList){
	clearHeadInfoLoder();
	for(var i:int=0; i < list.Count; ++ i){
		var msg : SelfMsgsClass = list[i] as SelfMsgsClass;
		var self_msg_itm : iGUIElement = self_msgs_listBox.addSmartObject("VisitItem");
		self_msg_itm.setWidth(345);
		self_msg_itm.items[2].setEnabled(false);
		var msg_tm : String = CombineTime(msg.tm);
		(self_msg_itm.items[1] as iGUILabel).label.text = msg_tm;
		var p_account : String = msg.account; 
		var content_lbl : iGUILabel = self_msg_itm.items[0] as iGUILabel;
		content_lbl.style.wordWrap = true;
		content_lbl.userData = msg;
		CollectPlayerName(p_account, content_lbl);
		self_msg_itm.setOrder(self_msg_itm_order);
		++ self_msg_itm_order;
		self_msgs_listBox.refreshRect();
	}
	ClearWhipPlayerInfoLoader();
	for(var j:int=0; j < self_msgs_listBox.itemCount; ++ j){
		var _itm_panel : iGUIPanel = self_msgs_listBox.items[j] as iGUIPanel;
		var cotent_lbl : iGUILabel = _itm_panel.items[0] as iGUILabel;
		var msg_data : SelfMsgsClass = cotent_lbl.userData as SelfMsgsClass;
		if(msg_data.self_msg_type == SELF_MSG_TYPE.WHIP  && !ScenePlayerMgr.isMainPlayer(msg_data.whip_account)){
			CollectWhipPlayerName(msg_data.whip_account, cotent_lbl);
		}
		self_msgs_listBox.refreshRect();
	}
}
//--
function ClearOldSelfMsgs(){
	self_msgs_listBox.removeAll();
}

//--清除异步加载图片
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
function ClearWhipPlayerInfoLoader(){
	//mHeadInfoLoaderArray2
	for (var obj : Object in mHeadInfoLoaderArray2)
	{
		var loader : PlatResLoader = obj as PlatResLoader;
		loader.Cancel();
	}
	mHeadInfoLoaderArray2.Clear();
}
//--
function OnDestroy(){
	clearHeadInfoLoder();
	ClearWhipPlayerInfoLoader();
}