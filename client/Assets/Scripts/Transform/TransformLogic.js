#pragma strict
#pragma downcast
/*
//transform logic
//creat by fullzhu 2012.5.15
//last edit at 2012.5.15 by fullzhu
*/

private var mTargetAccount : String = "";
private var mEffectAvatar : EffectAvatarRow = null;
private static var instance : TransformLogic;
function Awake(){
	instance=this;
	
	RegistNetMsg();
	RegistEventMsg();
}
static function GetInstance(){
	return instance;
}

function Start () {
}

//net event regist
function RegistNetMsg() {
	NetHelper.RegistHandler(new notify_polymorph_result(), HandleNotifyTransformResult);
}

function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_TRANSFORM_INIT), HandleNotifyTransformInit);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_TRANSFORM_CANCEL), HandleNotifyCancelTransform);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_USE_ITEM_WITH_PRO), HandleNotifyUseTransform);
}

//handle net event
function HandleNotifyTransformResult(evt:GameEvent, pack:notify_polymorph_result) {
	var player_obj : GameObject = ScenePlayerMgr.getPlayer(pack.account);
	var user_obj : GameObject = ScenePlayerMgr.getPlayer(pack.user);
	if(player_obj == null) {
		Debug.Log("player level!!!");
		return;
	}
	var plr : Player = player_obj.GetComponent("Player");
	plr.play("walk", WrapMode.Once);
	
	TriggerTransform(pack.account,pack.alter_body);
	
	var msg : String = pack.message;
	var targetName = plr.getName();
	var userName : String = "";
	if(user_obj != null) {
		userName = (user_obj.GetComponent("Player") as Player).getName();
	}
	if(userName == "") {
		userName = Define.unknow;
	}
	if(targetName == "") {
		targetName = Define.unknow;
	}
	msg = msg.Replace("%%%user%%%",userName).Replace("%%%target%%%",targetName);
	ChatLogic.getInstance().setTextItemOnListbox(msg, Color.white);
}

//handle game event
function HandleNotifyTransformInit(evt:GameEvent, obj:player_basic_data) {
	if(obj.alter_body.id == 0) return ;
	
	var buff : BuffRow = GetBuff(obj.alter_body.id);
	if(buff == null) {
		Debug.Log("buff is not exsit!!!");
	 	return ;
	}
	
	var span : System.TimeSpan = Global.subtractStime(obj.alter_body.start_at, SysTimer.getCurTime());
	var tsecs : int = span.TotalSeconds;
	if(Mathf.Abs(tsecs) < obj.alter_body.duration) {
		TriggerTransform(obj.account,obj.alter_body);
	}
}

function HandleNotifyCancelTransform(evt:GameEvent, obj:System.Object) {
	//ReqTransformCancel(obj);
	
	if(obj == DataCenter.getMainPlayerAccount()) {
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_USE_PROP_END));
	}
}

function HandleNotifyUseTransform(evt:GameEvent, obj:GameObject) {
	if(obj == null || obj.GetComponent(Player) == null) {
		Debug.LogWarning("transfrom pick object is null!!!");
		return ;
	}
	var account : String = obj.GetComponent(Player).getAccount();
	if(account == "") {
		Debug.LogWarning("transform invalid account!!");
		return ;
	}
	
	mTargetAccount = account;
	
	// 还原鼠标状态
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MOUSE_NORMARL_STATE));
	
	var plrName : String = obj.GetComponent(Player).getName();
	UI.getUI().OpenMsgbox("", Define.getContent(5115, [plrName]), Define.ok, CallbackUseSure as iGUIEventCallback, Define.cancel, CallbackUseCancel as iGUIEventCallback);
}

//client request
function ReqTransformCancel(account: String) {
	var packet:req_purify_polymorph = new req_purify_polymorph();
	packet.target_account = account;
	NetHelper.Send(packet);
}

//logic function for external interface
function TriggerTransform(account : String, trans : polymorph) {
	var player_obj : GameObject = ScenePlayerMgr.getPlayer(account);
	if(player_obj == null) {
		Debug.Log("player level!!!");
		return;
	}
	var transform : PlayerTransform = player_obj.GetComponent("PlayerTransform");
	if(transform == null) {
		Debug.Log("transform is not exsit!!!");
		return;
	}
	var buff : BuffRow = GetBuff(trans.id);
	if(buff == null) {
		Debug.Log("buff is not exsit!!!");
	 	return ;
	}
	
	var span : System.TimeSpan = Global.subtractStime(trans.start_at, SysTimer.getCurTime());
	var tsecs : int = span.TotalSeconds;
	transform.Add(trans.id,Mathf.Abs(trans.duration-Mathf.Abs(tsecs)));
	
	if(account == DataCenter.getMainPlayerAccount()) {
		var effect : EffectAvatarRow = GetModelEffect(buff.effect_id);
		if(effect == null) return ;
		mEffectAvatar = effect;
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_USE_PROP_INIT_UI),effect);
	}
}

function getEffect() : EffectAvatarRow
{
	return mEffectAvatar;
}
//logic function for interal

//callback
private function CallbackUseSure(callback : iGUIElement) {
	var plr : GameObject = ScenePlayerMgr.getPlayer(mTargetAccount);
	if(plr != null) {
		var targetArray : Array = new Array();
		targetArray.Add(mTargetAccount);
		PropUseLogic.request_use_item((PropShopLogic.Ctrl.Get("prop_item") as PackGrid)._item._instanceID, targetArray);
	} else {
		Global.GetSysMsgHandler().ShowSysMsg(414);
	}
}

private function CallbackUseCancel(callback : iGUIElement) {
	mTargetAccount = "";
}
//data operate
private function GetBuff(id : int) : BuffRow {
	return ResManager.LgtMgr.BuffTable[id];
}
	
private function GetModelEffect(id : int) : EffectAvatarRow {
	return ResManager.LgtMgr.EffectAvatarTable[id];
}