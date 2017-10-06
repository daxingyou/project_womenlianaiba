#pragma strict
#pragma downcast
/*
//yy audio logic
//creat by fullzhu 2013.2.20
//last edit at 2013.2.20 by fullzhu
*/

private static var mRoomID : UInt64;

private static var instance : YYAudioLogic;
function Awake(){
	instance=this;
	
	RegistNetMsg();
	RegistEventMsg();
}
static function GetInstance(){
	return instance;
}

function Start () {
	Init();
}

function OnDestroy() {
}

//net event regist
function RegistNetMsg() {
	NetHelper.RegistHandler(new notify_update_pub_voice_id(), HandleNotifyUpdateRoomID);
}

function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOUSE_CREATED), HandleNotifyHouseCreated);
}

//handle game event
function HandleNotifyHouseCreated(evt:GameEvent, obj:house_info) {
	//LeaveRoom();
}

//handle net event
function HandleNotifyUpdateRoomID(evt:GameEvent, packet:notify_update_pub_voice_id) {
	mRoomID = packet.voice_id;
	
	if(mRoomID == 0) {
		LeaveRoom();
	} else {
		EnterRoom();
	}
}


//handle game event
function HandleNotifyHouseCreated(evt:GameEvent, obj:System.Object) {
}

//client request
function ReqUpdateRoomID(pid : UInt64, id : UInt64) : void {
	var packet : req_update_pub_voice_id = new req_update_pub_voice_id();
	packet.pub_id = pid;
	packet.voice_id = id;
	NetHelper.Send(packet);
}

//logic function for external interface
public static function CreateRoom() : void {
	Debug.Log("CreateRoom---------Begin");
	ExternalFlatform.CreateRoom();
}

public static function EnterRoom() : void {
	//TEMP
	Debug.Log("EnterRoom---------Begin");
	ExternalFlatform.EnterRoom(mRoomID.ToString());
	//ExternalFlatform.EnterRoom(id);
}

public static function LeaveRoom() : void {
	Debug.Log("LeaveRoom---------Begin");
	ExternalFlatform.LeaveRoom();
}

public static function StartSpeak() : void {
	Debug.Log("StartSpeak---------Begin");
	ExternalFlatform.StartSpeak();
}

public static function StopSpeak() : void {
	Debug.Log("StopSpeak---------Begin");
	ExternalFlatform.StopSpeak();
}

public static function EnableAudioMixing() : void {
	Debug.Log("EnableAudioMixing---------Begin");
	ExternalFlatform.EnableAudioMixing();
}

public static function DisableAudioMixing() : void {
	Debug.Log("DisableAudioMixing---------Begin");
	ExternalFlatform.DisableAudioMixing();
} 

//logic function for interal
function Init() : void {
}
//callback
//--external function callback
function OnCreateRoom(result : String) : void {
	if(result == "0") {
		//create failure
	} else {
		mRoomID = UInt64.Parse(result);
	}
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.YY_AUDIO_CREATE_ROOM));
	
	var info : pub_info = YYChannelListLogic.getInstance().getPubInfo();
	var pubId : UInt64 = info.pub_id;
	ReqUpdateRoomID(pubId,mRoomID);
	Debug.Log(result);
}

function OnEnterRoom(result : Number) : void {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.YY_AUDIO_ENTER_ROOM));
	Debug.Log("OnEnterRoom"+result);
}

function OnLeaveRoom(result : Number) : void {	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.YY_AUDIO_LEAVE_ROOM));
	
	mRoomID = 0;
	Debug.Log("OnLeaveRoom"+result);
}

function OnStartSpeak(result : Number) : void {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.YY_AUDIO_START_SPEAK));
	Debug.Log("OnStartSpeak"+result);
}

function OnStopSpeak(result : Number) : void {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.YY_AUDIO_STOP_SPEAK));
	Debug.Log("OnStopSpeak"+result);
}

function OnEnableAudioMixing(result : Number) : void {
	Debug.Log("OnEnableAudioMixing"+result);
}

function OnDisableAudioMixing(result : Number) : void {
	Debug.Log("OnDisableAudioMixing"+result);
}
//data operate
function GetmRoomID() : UInt64 {
	return mRoomID;
}
