/*
	--Physical Power Mgr

*/
#pragma strict
#pragma downcast

private static var instance : PhyPowerMgr;

class PhyPowerClass{
	public var mCurPhyPower:int;
	public var mCurMaxPhyPower:int;
	public var mRestore_cnt:int;
	public var mTotal_secs:int;
	
	public function PhyPowerClass(){
		mCurPhyPower = 0;
		mCurMaxPhyPower = 0;
		mRestore_cnt = 0;
		mTotal_secs = 0;
	}
}

class RemainTimeStruct{
	public var day : String;
	public var hour : String;
	public var min:String;
	public var sec:String;
}

private var mInterval:float = 1000f;
private var mTimerList:Array = new Array();
private var mPhyPowerVal:PhyPowerClass = new PhyPowerClass();

function Awake(){
	instance = this;
	RegistEvent();
}
//--
function Start(){
	registNetEvent();
}
//--
static function getInstance():PhyPowerMgr{
	return instance;
}
//--
private function registNetEvent(){
	NetHelper.RegistHandler(new notify_start_recover_hp(), handleNotityStartRecoverHp);
}
//--
private function RegistEvent(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_ADDPHYPOWER_BTN), handleClickAddPhyPowerBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HP), HandleNotifyHp);
}
//--
private function _AddTimer2TimerList(t:Timer){
	mTimerList.Add(t);
}
//--
private function _ClearTimerList(){
	mTimerList.Clear();
}
//--
private function _ResetAllTimer(){
	for(var t:Timer in mTimerList){
		if(t)
			t.Reset();
	}
}
//--
private function _InitPhyPowerVal(obj:notify_hp){
	mPhyPowerVal.mCurMaxPhyPower = obj.max_hp;
	_SetCurPhyPowerVal(obj.hp);
	mPhyPowerVal.mRestore_cnt = obj.restore_seconds;
	mPhyPowerVal.mTotal_secs = obj.total_seconds;
}
//--
private static var first=true;
private function _SetCurPhyPowerVal(val : int) : boolean {
	//
	if(first)
		first = false; //登录时不跳
	else{
		if(val != mPhyPowerVal.mCurPhyPower){
			UIAnimation.createNumberAnimation(Rect(0.5, 0.45, 0, 0), Rect(0.5, 0.1, 0, 0), "HP_big", val - mPhyPowerVal.mCurPhyPower);
		}
	}
	
	mPhyPowerVal.mCurPhyPower = val;
	 return _IsPhyPowerToMax();
}
//--
public function GetCurPhyPowerVal():int{
	return mPhyPowerVal.mCurPhyPower;
}
//--
public function GetPhyPower():PhyPowerClass{
	return mPhyPowerVal;
}
//--
private function HandleNotifyHp(evt:GameEvent, obj:notify_hp){
	_InitPhyPowerVal(obj);
	_UpdateVal();
	_ResetAllTimer();
	_ClearTimerList();
	if(_NeedStartTimer())
		StartPowerTimer(mPhyPowerVal.mRestore_cnt);
}
//--
private function _NeedStartTimer():boolean{
	if(mPhyPowerVal.mRestore_cnt != 0)
		return true;
		
	return false;
}
//--
private function StartPowerTimer(cnt:int){
	var s_timer:Timer = new Timer(mInterval,cnt);
	s_timer.addEventListener(TimerEvent.TIMER,PowerTimerTrigger);
	s_timer.addEventListener(TimerEvent.TIMER_COMPLETE,PowerTimerStop);
	s_timer.Start();
	_AddTimer2TimerList(s_timer);
}
//--
private function PowerTimerTrigger(_timer:Timer,obj:Object){
	var remain_tm:RemainTimeStruct = CalculateRemainTime(mPhyPowerVal.mRestore_cnt);
	mPhyPowerVal.mRestore_cnt = mPhyPowerVal.mRestore_cnt - 1;
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.RESTORE_TIMEUP),remain_tm);
}
//--
static function CalculateRemainTime(total_secs:int):RemainTimeStruct{
	var _day : int = total_secs / (24 * 3600);
	var _hour : int = (total_secs % (24 * 3600)) / 3600;
	var _min:int = ((total_secs % (24 * 3600)) % 3600) / 60;
	var _sec:int = ((total_secs % (24 * 3600)) % 3600) % 60;
	var _remain_tm:RemainTimeStruct = new RemainTimeStruct();
	_remain_tm.day = _format(_day);
	_remain_tm.hour = _format(_hour);
	_remain_tm.min = _format(_min);
	_remain_tm.sec = _format(_sec);
	return _remain_tm;
}
//--
static function _format(data:int):String{
	var _data:String = System.Convert.ToString(data);
	var _fmt_str:String = _data;
	if(data < 10){
		_fmt_str = "0"+_data;
	}
	return _fmt_str;
}
//--
static function CalculateRemainTime(total_secs:int, trimZero : boolean):RemainTimeStruct{
	var _day : int = total_secs / (24 * 3600);
	var _hour : int = (total_secs % (24 * 3600)) / 3600;
	var _min:int = ((total_secs % (24 * 3600)) % 3600) / 60;
	var _sec:int = ((total_secs % (24 * 3600)) % 3600) % 60;
	var _remain_tm:RemainTimeStruct = new RemainTimeStruct();
	_remain_tm.day = _format1(_day);
	_remain_tm.hour = _format1(_hour);
	_remain_tm.min = _format1(_min);
	_remain_tm.sec = _format1(_sec);
	return _remain_tm;
}
//--
//--
static function _format1(data:int):String{
	var _data:String = data.ToString();
	var _fmt_str:String = _data;
	//if(data < 10){
	//	_fmt_str = "0"+_data;
	//}
	return _fmt_str;
}
//--
private function PowerTimerStop(_timer:Timer,obj:Object){
	Restore();
}
//--
private function Restore(){
	var is_tomax : boolean = _AddPhyPower();
	_UpdateVal();
	if(is_tomax)
		return;
	_StartNewTimer();
}
//--
private function _AddPhyPower() : boolean {
	var _val : int = mPhyPowerVal.mCurPhyPower + 1;
	return _SetCurPhyPowerVal(_val);
}
//--
private function _UpdateVal(){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.UPDATE_HP),mPhyPowerVal);
}
//--
private function _IsPhyPowerToMax():boolean{
	if(mPhyPowerVal.mCurPhyPower >= mPhyPowerVal.mCurMaxPhyPower){
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.PHYPOWER_TOMAX),null);
		return true;
	}
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.PHYPOWER_NOTTOMAX),null);
	return false;
}
//--
private function _StartNewTimer(){
	var c_timer:Timer = new Timer(mInterval,mPhyPowerVal.mTotal_secs);
	mPhyPowerVal.mRestore_cnt = mPhyPowerVal.mTotal_secs;
	c_timer.addEventListener(TimerEvent.TIMER,PowerTimerTrigger);
	c_timer.addEventListener(TimerEvent.TIMER_COMPLETE,PowerTimerStop);
	c_timer.Start();
	_AddTimer2TimerList(c_timer);
}
//--
private function handleClickAddPhyPowerBtn(evt : GameEvent, obj : Object){
	var req : req_start_recover_hp = new req_start_recover_hp();
	NetHelper.Send(req);
}
//-
private function handleNotityStartRecoverHp(evt : GameEvent, pack : notify_start_recover_hp){
	var remainCnt : int = pack.count;
	var need_love_coin : int = pack.love_coin;
	var recoverPhyPowerPoints : int = pack.hp;
	var params : ArrayList = new ArrayList();
	params.Add(recoverPhyPowerPoints);
	params.Add(need_love_coin);
	Global.GetSysMsgHandler().ShowSysMsg(568, params);
}
//--
public static function confirmRecover(caller : iGUIElement){
	var req : req_recover_hp = new req_recover_hp();
	NetHelper.Send(req);
}
//--
public static function cancelRecover(caller : iGUIElement){
	
}
//--
public static function confirmNeedRecover(caller : iGUIElement){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_ADDPHYPOWER_BTN));
}
//--
public static function cancelNeedRecover(caller : iGUIElement){
	
}
