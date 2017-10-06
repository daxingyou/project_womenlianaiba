#pragma strict

//自身动作组件  2012-04-21

enum SELF_ANI_EXTEND_TYPE{
	FREE_TYPE = 0,
}
//
class StartSelfAniTimeInfo{
	var start_time : float;
	var ani_length : float;
	public function StartSelfAniTimeInfo(s_t : float, ani_len : float){
		start_time = s_t;
		ani_length = ani_len;
	}
}
static var is_playing_self_ani : boolean = false;
private var self_ani_start_time : float = 0;
private var self_ani_length : float = 0;
private static var is_load_self_ani_table : boolean = false;
private var cur_ani_struct : AniStruct = null;
private var free_ani_array : Array = new Array();
function Awake(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.START_PLAY_SELF_ANI), HandleStartPlaySelfAni);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_END_SANI), HandleNotifyEndSanim);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.SELF_ANIM_END), HandleReqEndSelfAnim);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_PLAY_ANIMAITON), HandleNotifyPlayAnimation);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.SUBMIT_REQ_START_PLAY_SANI), HandleSubmitReqStartPlaySani);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_PLAY_SANI), HandleClickPlaySani);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_START_WALK), HandleNotifyStartWalk);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_STOP_WALK), HandleNotifyStopWalk);
}
//--
function HandleNotifyStopWalk(evt : GameEvent, obj : Object){
	var MainPlayer:GameObject = ScenePlayerMgr.getMainPlayer();
	var com : Player = MainPlayer.GetComponent("Player") as Player;
	if(cur_ani_struct != null){
		com.play(cur_ani_struct.ani, cur_ani_struct.loop_type);
		_ReqStartBodyAnimation(cur_ani_struct.ani, cur_ani_struct.loop_type);
		cur_ani_struct = null;
	}
}
//--
function HandleNotifyStartWalk(evt : GameEvent, obj : Object){
	if(is_playing_self_ani){
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.SELF_ANIM_END));
		self_ani_start_time = 0;
		self_ani_length = 0;
	}
}
//--
function HandleClickPlaySani(evt : GameEvent, obj : AniStruct){
	cur_ani_struct = obj;
}
//--
function HandleSubmitReqStartPlaySani(evt : GameEvent, obj : Object){
	var _obj : AniStruct = obj as AniStruct;
	_ReqStartBodyAnimation(_obj.ani, _obj.loop_type);
}
//--
function _ReqStartBodyAnimation(ani : String, loop_type : WrapMode){
	is_playing_self_ani = true;
	var req : req_start_body_action = new req_start_body_action();
	req.action_status = ani;
	if(loop_type == WrapMode.Loop){
		req.action_type = "loop";
	}
	else
		req.action_type = "once";
	NetHelper.Send(req);
}
//--
function HandleNotifyPlayAnimation(evt : GameEvent, obj : Object){
	var pack : notify_start_body_action = obj as notify_start_body_action;
	var loop_type : WrapMode;
	if(pack.action_type == "loop"){
		loop_type = WrapMode.Loop;
	}
	else{
		loop_type = WrapMode.Once;
	}
	var player_obj:GameObject = ScenePlayerMgr.getPlayer(pack.account);
		if(player_obj){
			var com : Player = player_obj.GetComponent("Player") as Player;
			com.play(pack.action_status, loop_type);
		}
}
//--
public function LoadSelfAnimations()
{
	if(is_load_self_ani_table)
		return;
	
	var self_ani_table:Hashtable = ResManager.LgtMgr.SelfAnimationTable;
	for(var obj:Object in self_ani_table.Values)
	{
		var row : SelfAnimationRow = obj as SelfAnimationRow;
		if(SELF_ANI_EXTEND_TYPE.FREE_TYPE == row.extend_type)
		{
			free_ani_array.Add(row);
		}
	}
	//LOAD_FREE_SELF_ANI_ARRAY_OK
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.LOAD_FREE_SELF_ANI_ARRAY_OK), free_ani_array);
	is_load_self_ani_table = true;
}
//--
function HandleReqEndSelfAnim(evt : GameEvent, obj : Object){
	is_playing_self_ani = false;
	var req : req_end_body_action = new req_end_body_action();
	NetHelper.Send(req);
}
//--
function HandleNotifyEndSanim(evt : GameEvent, obj : Object){
	var data : notify_end_body_action = obj as notify_end_body_action;
}
//--
function HandleStartPlaySelfAni(evt : GameEvent, obj : Object){
	var data : StartSelfAniTimeInfo = obj as StartSelfAniTimeInfo;
	self_ani_start_time = data.start_time;
	self_ani_length = data.ani_length;
}
//--
function OnGUI(){
	if(self_ani_start_time != 0 && self_ani_length != 0){
		var now = Time.time;
		if(now - self_ani_start_time >= self_ani_length){
			//SELF_ANIM_END
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.SELF_ANIM_END));
			self_ani_start_time = 0;
			self_ani_length = 0;
		}
	}
}