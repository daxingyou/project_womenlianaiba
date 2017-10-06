#pragma strict
#pragma downcast
/*
//transform logic
//creat by fullzhu 2012.5.31
//last edit at 2012.5.31 by fullzhu
*/

enum BoardType {
	BT_System = 1,
	BT_ServerNotice = 2
}

class BoardInfo {
	public var type : BoardType;
	public var content : String = "";
}

public var mScrollCount : int = 3;
public var mScrollInternal : float = 30;
public var mScrollSpeed : float = 200;

public var mNoticeCount : int = 3;
public var mNoticeInternal : float = 3;

private static var instance : SysBoardLogic;
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

//net event regist
function RegistNetMsg() {
	NetHelper.RegistHandler(new notify_del_broadcast(), HandleNotifySystemDelBroadcast);
}

function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOUSE_CREATED), HandleNotifyHouseCreated);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_SYSBOARD_UPDATE), HandleNotifySysBoardUpdate);
}

//handle net event
function HandleNotifySystemDelBroadcast(evt:GameEvent, pack:notify_del_broadcast) {
	var data : notify_del_broadcast = pack as notify_del_broadcast;
	if(data.type == 2) {
		CloseBoard(BoardType.BT_System);
	}
}


//handle game event
function HandleNotifyHouseCreated(evt:GameEvent, obj:System.Object) {
	ReqSysBoard();
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_SYSBOARD_SHOW_NOTICE));
}

function HandleNotifySysBoardUpdate(evt:GameEvent, obj:System.Object) {
	var data : notify_sys_broadcast = obj as notify_sys_broadcast;
	if(data.type == 2 && data.content != "") {
		SendBoard(data.content, BoardType.BT_System);
	} else if(data.type == 3 && data.content != "") {
		SendBoard(data.content, BoardType.BT_ServerNotice);
	}
}

//client request
function ReqSysBoard() {
	var req:req_fixed_broadcast = new req_fixed_broadcast();
	req.type = 2;
	NetHelper.Send(req);
}

//logic function for external interface
function SendBoard(content : String, type : BoardType) {
	var info : BoardInfo = new BoardInfo();
	info.type = type;
	info.content = content;
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_SYSBOARD_UPDATE_CONTENT), info);
}

function CloseBoard(type : BoardType) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_SYSBOARD_STOP), type);
}

//logic function for interal
function Init() : void {
	UI.getUI().OpenUIRoot("SysBoardUI");
}

//callback

//data operate
function GetScrollCount() : float {
	return mScrollCount;
}

function GetScrollInternal() : float {
	return mScrollInternal;
}

function GetScrollSpeed() : float {
	return mScrollSpeed;
}

function GetNoticeCount() : float {
	return mNoticeCount;
}

function GetNoticeInternal() : float {
	return mNoticeInternal;
}
