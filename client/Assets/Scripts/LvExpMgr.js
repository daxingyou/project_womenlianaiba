/*
	Level Exp Mgr
	@huangdj

*/
#pragma strict
class LvExpClass{
	public var mCurLv:int ;
	public var mCurExp:float;
	public var mCurMaxExp:float;
	
	public function LvExpClass(){
		mCurLv = 1;
		mCurExp = 0f;
		mCurMaxExp = 0f;
	}
}
var aim_lv : int = 5;
private var mLvExp:LvExpClass = new LvExpClass();
private static var instance : LvExpMgr;
//--
function Awake(){
	instance=this;
	
	RegistEvent();
}
//--
function Start() {
	
}
//--
static function GetInstance(){
	return instance;
}
//--
function RegistEvent(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LV_EXP), HandleNotifyLvExp);
}
//--
private static var first=true;
function HandleNotifyLvExp(evt:GameEvent, obj:notify_level_exp){
	//
	if(first)
		first = false; //登录时不跳
	else{
		if(mLvExp.mCurLv != obj.level){
			Global.GetSysMsgHandler().ShowSysMsg(412);
			UIAnimation.createNumberAnimation(Rect(0.5, 0.5, 0, 0), Rect(0.5, 0.1, 0, 0), "EXP_big", obj.exp + (mLvExp.mCurMaxExp - mLvExp.mCurExp));
			if(obj.level == 50){
				//EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.LV_UPDATETO_AIM));
				EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.SENDMSGTOYYSUBCHANNEL), new MsgToYYParams(SENDTO_YYSUBCHANNEL_MSGTYPE.FROM_LEVEL, "", ""));
			}
		}
		else{
			if(mLvExp.mCurExp != obj.exp){
				UIAnimation.createNumberAnimation(Rect(0.5, 0.5, 0, 0), Rect(0.5, 0.1, 0, 0), "EXP_big", obj.exp - mLvExp.mCurExp);
			}
		}
	}
	EQGameSceneMgr.getSingleton().updateHouseDataLevel(obj.level);
	mLvExp.mCurLv = obj.level;
	mLvExp.mCurExp = obj.exp;
	mLvExp.mCurMaxExp = obj.max_exp;	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.UPDATE_LV_EXP),mLvExp);
}
//--
function GetCurLevel():int {
	return mLvExp.mCurLv;
}
//--
function GetCurExp():float {
	return mLvExp.mCurExp;
}
//--
function GetCurMaxExp():float {
	return mLvExp.mCurMaxExp;
}
//--
function GetLevelExp():LvExpClass {
	return mLvExp;
}