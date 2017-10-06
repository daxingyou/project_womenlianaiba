/*
	房屋升级组件
	2012-05-14	huangdj

*/
//-
#pragma strict
private static var instance : HouseUpdateComp = null;
private static var had_load_table : boolean = false;
private var mHouseRightTable : ArrayList = new ArrayList();
static var mFirst_in : boolean = true;
static var mCur_grade : int = 0;
static var is_single : int = 0;
//--

function Awake(){
	instance = this;
	RegistEvt();
}
static function getInstance() : HouseUpdateComp {
	return instance;
}
function Start() {
	NetHelper.RegistHandler(new notify_unlock_special_house(), handle_notify_unlock_special_house);
	NetHelper.RegistHandler(new notify_unlock_special_house_info(), handle_notify_unlock_special_house_info);
	NetHelper.RegistHandler(new notify_get_free_count_for_moving_special_house(), handle_notify_get_free_count_for_moving_special_house);
}
//--
function RegistEvt(){
	//NOTIFY_HOUSE_RIGHT_GRADE
	//MOVE_HOUSE_SUCCESS
	//NOTIFY_SPECIAL_HOUSE_LIST
	//NOTIFY_MY_SPECIAL_HOUSE_LIST
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOUSE_CREATED), HandleCheckIsSingle);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_HOUSE_RIGHT_GRADE), HandleNotifyHouseRightGrade);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MOVE_HOUSE_SUCCESS), HandleNotifyMoveHouseSucc);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_SPECIAL_HOUSE_LIST), HandleNotifySpecialHouseList);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_MY_SPECIAL_HOUSE_LIST), HandleNotifyMySpecialHouseList);
}

function getCurHouseRight() : int{
	return mCur_grade;
}
//--
function LoadHouseRightData(){
	if(had_load_table){
		return;
	}
	
	var houseRight_t : Hashtable = ResManager.LgtMgr.HouseRightTable;
	for(var obj : Object in houseRight_t.Values){
		var row : HouseRightRow = obj as HouseRightRow;
		mHouseRightTable.Add(row);
	}
	//LOAD_HOUSERIGHTDATA_OK
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.LOAD_HOUSERIGHTDATA_OK), mHouseRightTable);
	had_load_table = true;
}
//--
function HandleNotifyHouseRightGrade(evt : GameEvent, data : notify_house_right_grade){
	//UPDATE_HOUSE_RIGHT_GRADE
	if(data.grade != 0){
		mCur_grade = data.grade;
	}
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.UPDATE_HOUSE_RIGHT_GRADE), data.grade);
}
//--
function HandleNotifyMoveHouseSucc(evt : GameEvent, obj : Object){
	//ExternalFlatform.ReloadPage();
	//不显示重复登录
	Login.m_avoidRepeatLoginDia = true;

	Global.GetSysMsgHandler().ShowSysMsg(422);
}
//--
static function ConfirmMoveHouse(caller : iGUIElement){
	ExternalFlatform.ReloadPage();
}
//--
function HandleCheckIsSingle(evt:GameEvent, obj:System.Object){
	if(!obj)
		return;
	
	var h_info : house_info = obj as house_info;
	if(h_info.boy == "" || h_info.girl == ""){
		is_single = 1;
	}
	else{
		is_single = 0;
	}
}
//--
function HandleNotifySpecialHouseList(evt : GameEvent, data : notify_special_house_list){
	//UPDATE_SPECIAL_HOUSE_LIST
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.UPDATE_SPECIAL_HOUSE_LIST), data.house_list);
}
//--
function HandleNotifyMySpecialHouseList(evt : GameEvent, data : notify_self_special_house_list){
	//UPDATE_SPECIAL_HOUSE_LIST
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.UPDATE_MY_SPECIAL_HOUSE_LIST), data.house_list);
}
//--------------------------------------------------
// 请求解锁特殊房屋
public static function request_unlock_special_house(id : int) : void
{
	var req : req_unlock_special_house = new req_unlock_special_house();
	req.id = id;	// 特权房屋类型id
	NetHelper.Send(req);
}
//--------------------------------------------------
// 处理通知解锁特殊房屋消息
private function handle_notify_unlock_special_house(evt:GameEvent, pack:notify_unlock_special_house) : void
{
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_UNLOCK_SPECIAL_HOUSE), pack.id);
}
//--------------------------------------------------
// 请求已解锁特殊房屋信息
public static function request_unlock_special_house_info() : void
{
	var req : req_unlock_special_house_info = new req_unlock_special_house_info();
	NetHelper.Send(req);
}
//--------------------------------------------------
// 处理通知已解锁特殊房屋信息消息
private function handle_notify_unlock_special_house_info(evt:GameEvent, pack:notify_unlock_special_house_info) : void
{
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_UNLOCK_SPECIAL_HOUSE_INFO), pack.ids);
}
//--------------------------------------------------
// 请求免费搬家次数
public static function request_get_free_count_for_moving_special_house() : void
{
	var req : req_get_free_count_for_moving_special_house = new req_get_free_count_for_moving_special_house();
	NetHelper.Send(req);
}
//--------------------------------------------------
// 处理通知免费搬家次数
private function handle_notify_get_free_count_for_moving_special_house(evt:GameEvent, pack:notify_get_free_count_for_moving_special_house) : void
{
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_GET_FREE_COUNT_FOR_MOVING_SPECIAL_HOUSE), pack.count);
}
//--------------------------------------------------


