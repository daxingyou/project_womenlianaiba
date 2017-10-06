//-----------------------------------------------------------
//--接受系统消息处理函数
//--
#pragma strict
import iGUI;

class SysMsg_PlayerName extends PlatResInfoCtrl {
	var msg_content : String;
	var msg_type : int = 0;
	var params : String[];
	var param_id : int = 0;
	//overwrite
	public function Callback() {
	 	SysMsgHandler.getInstance().Callback_GetSysMsgPlayerName(this);
	 }
}

private var has_get_name_cnt : int = 0;
private var get_player_name_cnt : int = 0;
private var mMsgHandlerFunList:Array = new Array();
private var mMsgCallbackFuncList:Hashtable = new Hashtable();
private var mMsgCallbackUserDataList : Hashtable = new Hashtable();
private var mCurMsgID:int = -1;
private var need_new_txt : boolean = false;
private static var instaince : SysMsgHandler;

function Callback_GetSysMsgPlayerName(obj : SysMsg_PlayerName){
	var name : String = "";
	if(obj.info == null || "" == obj.info.nickname){
		name = Define.noname;
	}
	else{
		name = obj.info.nickname;
		name = name.Trim();
		name = name.Replace("\n", "");
		name = name.Replace(" ", "");
	}
	obj.params[obj.param_id] = name;
	++ has_get_name_cnt;
	if(has_get_name_cnt == get_player_name_cnt){
		obj.msg_content = String.Format(obj.msg_content,obj.params as Object[]);
		excuteFunc(obj.msg_type,obj.msg_content);		
	}
}

function Awake(){
	instaince = this;
}

static function getInstance() : SysMsgHandler{
	return instaince;
}

function Start(){
 	mMsgHandlerFunList.Add(OnHandleMsgFuncStyle2);
	mMsgHandlerFunList.Add(OnHandleMsgFuncStyle1);
	mMsgHandlerFunList.Add(OnHandleMsgFuncStyle3);
	mMsgHandlerFunList.Add(OnHandleMsgFuncStyle4);
	mMsgHandlerFunList.Add(OnHandleMsgFuncStyle5);
	mMsgHandlerFunList.Add(OnHandleMsgFuncStyle6);
	//
	RegistMsgCallback(536,iGUICode_HouseUpdateRoot.confirmBuySpecialHouse, iGUICode_HouseUpdateRoot.cancelBuySpecialHouse,null);
	RegistMsgCallback(338,WishListComp._ConfirmSatisfyWish, WishListComp._ConcelSatisfyWish,null);
	RegistMsgCallback(532,WishListComp._ConfirmSatisfyWish, WishListComp._ConcelSatisfyWish,null);
	RegistMsgCallback(533,iGUICode_DaliyActiveRoot.confirmCallback, iGUICode_DaliyActiveRoot.cancelCallback,null);
	RegistMsgCallback(534,Task.confirmCallback, Task.cancelCallback,null);
	RegistMsgCallback(405,ShowError.RefrashGame, ShowError.ShowErrorMsg,null);
	RegistMsgCallback(406,ShowError.RefrashGame, ShowError.ShowErrorMsg,ShowError.ClearCache);
	//RegistMsgCallback(420,iGUICode_HouseUpdateRoot.okCallback, iGUICode_HouseUpdateRoot.cancelCallback, null);
	RegistMsgCallback(422,HouseUpdateComp.ConfirmMoveHouse, null, null);
	RegistMsgCallback(441,iGUICode_CollectRoot.ConfirmUseWhip, iGUICode_CollectRoot.CancelUseWhip, null);
	RegistMsgCallback(568,PhyPowerMgr.confirmRecover, PhyPowerMgr.cancelRecover, null);
	RegistMsgCallback(324,PhyPowerMgr.confirmNeedRecover, PhyPowerMgr.cancelNeedRecover, null);
	RegistMsgCallback(5141,BartenderSys.confirmImmediateCompleteCallback, BartenderSys.cancelCallback, null);
	RegistMsgCallback(591,iGUISmartPrefab_foodReservesItem.confirmUnlockFoodCallback, iGUISmartPrefab_foodReservesItem.cancelUnlockFoodCallback, null);
	RegistMsgCallback(590,iGUISmartPrefab_foodReservesItem.confirmExpandCallback, iGUISmartPrefab_foodReservesItem.cancelExpandCallback, null);
}
//--
public function RegistCallbackUserData(msg_id : int, userdata : Object){
	if(mMsgCallbackUserDataList.ContainsKey(msg_id))
	{
		mMsgCallbackUserDataList.Remove(msg_id);
	}
	mMsgCallbackUserDataList.Add(msg_id, userdata);
}
//--注册特定消息的回调函数
public function RegistMsgCallback(msg_id:int,okCallback : iGUIEventCallback,cancelCallback : iGUIEventCallback, extendCallback : iGUIEventCallback)
{
	if(mMsgCallbackFuncList.ContainsKey(msg_id))
	{
		Debug.LogError("the CallbackFunc of msgID"+msg_id+"is already registed!");
		return;
	}
	var callBackTable:Hashtable = new Hashtable();
	callBackTable.Add(1,okCallback);
	callBackTable.Add(2,cancelCallback);
	callBackTable.Add(3,extendCallback);
	mMsgCallbackFuncList.Add(msg_id,callBackTable);
}
//--取消注册特定消息
public function UnregistMsgCallback(msg_id:int)
{
	if(mMsgCallbackFuncList.ContainsKey(msg_id))
	{
		mMsgCallbackFuncList.Remove(msg_id);
	}
}

//
public function notifySysMsg(msg_code:int,msg_params:ArrayList)
{
	mCurMsgID = msg_code;
	var msg_row:SysMsgRow = getSysMsgRow(msg_code);
	var msg_content:String = msg_row.msg_content;
	var msg_type:int = msg_row.msg_type;
	var openid_cnt : int = 0;
	if(msg_params != null && msg_params.Count != 0)
	{
		var paramsArrray : Object[] = msg_params.ToArray();
		var paramsArrray_Strs : String[] = new String[paramsArrray.Length];
		for(var i:int=0; i < paramsArrray.Length; ++ i){
			var p_str : String = paramsArrray[i].ToString();
			paramsArrray_Strs.SetValue(p_str, i);
		}
		get_player_name_cnt = 0;
		has_get_name_cnt = 0;
		for(var k:int=0; k < paramsArrray_Strs.Length; ++ k){
			if(paramsArrray_Strs[k].Contains("@")){
				++ get_player_name_cnt;
			}
		}
		for(var j:int=0; j < paramsArrray_Strs.Length; ++ j){
			if(paramsArrray_Strs[j].Contains("@")){
				++ openid_cnt;
				paramsArrray_Strs[j] = paramsArrray_Strs[j].Replace("@", "");
				var info : SysMsg_PlayerName = new SysMsg_PlayerName();
				info.account = paramsArrray_Strs[j];
				info.params = paramsArrray_Strs;
				info.param_id = j;
				info.msg_content = msg_content;
				info.msg_type = msg_type;
				var nameInfoLoader : PlatResLoader = Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(paramsArrray_Strs[j],info);
			}
		}
		if(openid_cnt == 0){
			msg_content = String.Format(msg_content,paramsArrray_Strs as Object[]);
		}
	}
	if(openid_cnt == 0){
		excuteFunc(msg_type,msg_content);
	}
}
//--
function ShowSysMsg(msg_code:int)
{
	need_new_txt = false;
	notifySysMsg(msg_code,null);
}
//--
function ShowSysMsg(msg_code:int, f:boolean)
{
	need_new_txt = f;
	notifySysMsg(msg_code,null);
}
//--
function ShowSysMsg(msg_code:int,params : ArrayList)
{
	need_new_txt = false;
	notifySysMsg(msg_code,params);
}
//
public function getSysMsgRow(id:int):SysMsgRow
{
	return ResManager.LgtMgr.getSysMsgRow(id);
}
//
private function excuteFunc(type:int,content:String)
{
	var func:Function = matchHandlerFunc(type) as Function;
	func(content);
}
//
private function OnHandleMsgFuncStyle1(content:String)
{
	UI.getUI().OpenMsgbox(Define.msgtip + "1",content,true);
	resetCurMsgID();
}
//
private function OnHandleMsgFuncStyle2(content:String)
{
	var okCallback:iGUIEventCallback = null;
	var cancelCallback:iGUIEventCallback = null;
	if(mMsgCallbackFuncList.ContainsKey(mCurMsgID)){
		var _t : Hashtable = mMsgCallbackFuncList.Item[mCurMsgID] as Hashtable;
		okCallback = _t.Item[1] as iGUIEventCallback;
		cancelCallback = _t.Item[2] as iGUIEventCallback;
	}
	var userdata : Object = null;
	if(mMsgCallbackUserDataList.ContainsKey(mCurMsgID)){
		userdata = mMsgCallbackUserDataList.Item[mCurMsgID];
	}
	/*暂时不删，以确保新的没错后再删
	for(var itm:DictionaryEntry in mMsgCallbackFuncList)
	{
		if(mCurMsgID == itm.Key)
		{
			var _t : Hashtable = itm.Value as Hashtable;
			okCallback = _t.Item[1] as iGUIEventCallback;
			cancelCallback = _t.Item[2] as iGUIEventCallback;
			break;
		}
	}
	*/
	if(userdata){
		UI.getUI().OpenMsgbox(Define.msgtip + "2",content,"", okCallback, "", cancelCallback, userdata);
	}
	else{
		if(!need_new_txt)
			UI.getUI().OpenMsgbox(Define.msgtip + "2",content,"", okCallback, "", cancelCallback);
		else
			UI.getUI().OpenMsgbox(Define.msgtip + "2",content,Define.refresh, okCallback, Define.showlog, cancelCallback);
	}
	resetCurMsgID();
}
//
private function OnHandleMsgFuncStyle3(content:String)
{
	UI.getUI().OpenNoModalMsgbox(content);
	resetCurMsgID();
}
//
private function OnHandleMsgFuncStyle4(content:String)
{
	var okCallback:iGUIEventCallback = null;
	var cancelCallback:iGUIEventCallback = null;
	var extendCallback:iGUIEventCallback = null;
	
	if(mMsgCallbackFuncList.ContainsKey(mCurMsgID)){
		var _t : Hashtable = mMsgCallbackFuncList.Item[mCurMsgID] as Hashtable;
		okCallback = _t.Item[1] as iGUIEventCallback;
		cancelCallback = _t.Item[2] as iGUIEventCallback;
		extendCallback = _t.Item[3] as iGUIEventCallback;
	}
	
	/*暂时不删，以确保新的没错后再删
	for(var itm:DictionaryEntry in mMsgCallbackFuncList)
	{
		if(mCurMsgID == itm.Key)
		{
			var _t : Hashtable = itm.Value as Hashtable;
			okCallback = _t.Item[1] as iGUIEventCallback;
			cancelCallback = _t.Item[2] as iGUIEventCallback;
			extendCallback = _t.Item[3] as iGUIEventCallback;
			break;
		}
	}
	*/
	UI.getUI().OpenMsgbox(Define.msgtip+"4",content,Define.refresh, okCallback, Define.showlog, cancelCallback,Define.clearcache,extendCallback);
	resetCurMsgID();
}
//
private function OnHandleMsgFuncStyle5(content:String) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_SHOW_POWER_DIALOG),null);
	resetCurMsgID();
}
//
private function OnHandleMsgFuncStyle6(content:String){
	if(iGUICode_VoiceChannelUI.getInstance()){
		if(iGUICode_VoiceChannelUI.getInstance().getChannelChatLogic()){
			iGUICode_VoiceChannelUI.getInstance().getChannelChatLogic().setPrimitiveContent(content, Color(255.0f/255.0f, 242/255.0f, 0.0f/255.0f));
		}
	}
	if(iGUICode_YYPubUI.getInstance()){
		if(iGUICode_YYPubUI.getInstance().getChannelChatLogic()){
			iGUICode_YYPubUI.getInstance().getChannelChatLogic().setPrimitiveContent(content, Color(255.0f/255.0f, 242/255.0f, 0.0f/255.0f));
		}
	}
	resetCurMsgID();
}
//--
private function resetCurMsgID(){
	mCurMsgID = -1;
	need_new_txt = false;
}
//
private function matchHandlerFunc(type:int) : Object
{
	if(mMsgHandlerFunList.Count == 0)
	{
		Debug.Log("mMsgHandlerFunList is empty!");
		return null;
	}
	var idx:int = type - 1;
	if(idx<mMsgHandlerFunList.Count)
		return mMsgHandlerFunList[idx];
	else
	{
		Debug.Log("idx overflow!");
		return null;
	}
}