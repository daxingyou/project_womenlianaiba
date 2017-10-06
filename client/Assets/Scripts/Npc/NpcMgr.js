#pragma strict
#pragma downcast
/*
//player npc manager
//creat by fullzhu 2012.9.5
//last edit at 2012.9.5 by fullzhu
*/

class NpcCommandFunc {
	var btn : String;
	var func : String;
}

class NpcCommand {
	var id : int;
	var dialog : String;
	var funcList : ArrayList = new ArrayList();				//strunct NpcCommandFunc
}

public var mInteractDis : int = 1;
public var mIngoreHideUI : String[];

private var mCommand : NpcCommand = new NpcCommand();
private var mNpcList : ArrayList = new ArrayList();			//struct gameObject
private var mNpc : GameObject = null;						//communicate npc
private var mBCommunicate : boolean = false;				//state communicate

private static var instance : NpcMgr;
function Awake(){
	instance=this;
	
	RegistEventMsg();
}
static function GetInstance(){
	return instance;
}

function Start () {
}

function Update() {
	if (Input.GetMouseButtonUp(0) && !UI.getUI().IsMouseOverUI()) {
		var obj : GameObject = PickMgr.getSingleton().getPickObject();
		if(obj != null) {
			Trigger(obj);
		}
	}
}

//game event regist()
function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LEAVE_SCENE), HandleNotifyLeaveScene);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_NPC_ADD), HandleNotifyNpcAdd);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_NPC_DIALOG_CLOSE), HandleNotifyDialogClose);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_NPC_DIALOG_OPEN), HandleNotifyDialogOpen);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_MAIN_PLAYER_STOP_WALK), HandleNotifyStopWalk);
}

//handle game event
function HandleNotifyLeaveScene(evt:GameEvent, obj:System.Object) {
	for(var npc : GameObject in mNpcList) {
		var ins : NpcIns = npc.GetComponent(NpcIns);
		if(ins != null) {
			ins.Destroy();
		}
	}
	mNpcList.Clear();
}

function HandleNotifyNpcAdd(evt:GameEvent, obj:System.Object) {
	if(obj != null) {
		mNpcList.Add(obj);
		
		/*
		var ins : NpcIns = (obj as GameObject).GetComponent(NpcIns);
		if(ins == null) return ;
		
		var info : NpcRow = GetNpcData(ins.GetNpcID());
		if(info == null) return ;
		if(info.anim == "") return ;
		if(info.mode == 0) {
			ins.DoAnim(info.anim,WrapMode.Loop);
		} else {
			ins.DoAnim(info.anim,WrapMode.Once);
		}
		*/
	}
}

function HandleNotifyDialogClose(evt:GameEvent, obj:System.Object) {
	EnableUI(false);
}

function HandleNotifyDialogOpen(evt:GameEvent, obj:notify_npc_open_dialog) {
	Open(obj.npc_id,obj.talk,obj.button_list);
}

function HandleNotifyStopWalk(evt:GameEvent, obj:System.Object) {
	if(mNpc == null) return ;
	
	var mainPlr : GameObject = ScenePlayerMgr.getMainPlayer();
	if(CheckDistance(mNpc) && mBCommunicate) {
		//mNpc.transform.LookAt(mainPlr.transform);
		
		var ins : NpcIns = mNpc.GetComponent(NpcIns);
		if(ins != null) {
			Communicate(ins.GetNpcID(),null);
		}
	}
	
	mNpc = null;
	mBCommunicate = false;
}

//extern function
function Open(id : int, dialog : String, funcs : ArrayList) {
	UpdateCommand(id,dialog,funcs);
	
	EnableUI(true);
	RefreshDialog();
}

private var mHideUIArray : Array;
function EnableUI(enable : boolean) {
	if(enable == UI.getUI().isUIRootOpen("NpcDialogUI")) return ;
	
	if (enable) {
		mHideUIArray = UI.getUI().EnableUIRootIgnore(mIngoreHideUI, false);
	} else {
		UI.getUI().EnableUIRoot(mHideUIArray, true);
	}
	
	UI.getUI().OpenUIRoot("NpcDialogUI");
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_NPC_DIALOG_UI_ENABLE),enable);
}

function Trigger(npc : GameObject) {
	if(npc == null) return ;
	
	var ins : NpcIns = npc.GetComponent(NpcIns);
	if(ins == null) return ;
	
	var mainPlr : GameObject = ScenePlayerMgr.getMainPlayer();
	var npc_grid : HouseSceneGrid = GetNearestGrid(npc.transform.position, mainPlr.transform.position);
	
	if (CheckDistance(npc)) {
		npc.transform.LookAt(mainPlr.transform);
		
		Communicate(ins.GetNpcID(),null);
		
		return ;
	}
	
	var player_floor : int = UpDownStair.getFloorNumByPos(mainPlr.transform.position);
	var npc_floor : int = UpDownStair.getFloorNumByPos(npc.transform.position);
	if (player_floor != npc_floor) {
		UI.getUI().OpenMsgbox("", Define.getContent(5089), true);
		return;
	}
	
	(ScenePlayerMgr.getMainPlayer().GetComponent("MainPlayer") as MainPlayer).setMoveTarget(npc_grid.GameObj.transform.position);
	
	mNpc = npc;
	mBCommunicate = true;
}

function Communicate(id : int, func : String) {
	if(func == null) {
		func = "";
	}
	NpcNet.GetInstance().ReqNpcCommand(id,func);
}

function Communicate(func : String) {
	Communicate(mCommand.id,func);
}

function IsNpc(obj : GameObject) : boolean {
	if(obj == null) return false;
	if(obj.GetComponent(NpcIns)) return true;
	if(obj.GetComponentInChildren(NpcIns) != null) return true;
	
	if (null == obj.transform.parent) return false;
	var parent : GameObject = obj.transform.parent.gameObject;
	if(parent != null && parent.GetComponent(NpcIns)) return true;
	
	return false;
}

//interal function
private function UpdateCommand(id : int, dialog : String, funcs : ArrayList) {
	mCommand.id = id;
	mCommand.dialog = dialog;
	mCommand.funcList.Clear();
	for(var func : button in funcs) {
		var commandFunc : NpcCommandFunc = new NpcCommandFunc();
		commandFunc.btn = func.name;
		commandFunc.func = func.function_name;
		
		mCommand.funcList.Add(commandFunc);
	}
}

private function RefreshDialog() {
	if(!mCommand) return ;
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_NPC_DIALOG_UI_REFRESH),mCommand);
}

private function CheckDistance(npc : GameObject) {
	if(npc == null) return false ;
	
	var mainPlr : GameObject = ScenePlayerMgr.getMainPlayer();
	var hs : HouseScene = EQSceneManager.getSingleton().HouseSceneObj;
	
	var player_grid : HouseSceneGrid = hs.gridByPosition(mainPlr.transform.position);
	var npc_grid : HouseSceneGrid = GetNearestGrid(npc.transform.position, mainPlr.transform.position);
	
	if(npc_grid == null) return false;
	
	return Mathf.Abs(player_grid.X - npc_grid.X) <= mInteractDis && Mathf.Abs(player_grid.Z - npc_grid.Z) <= mInteractDis ;
}

//data operate
function GetNpcData(id : int) : NpcRow {
	return ResManager.LgtMgr.NpcTable[id];
}

function GetNpcCommandFunc(btn : String) : String {
	for(var func : NpcCommandFunc in mCommand.funcList) {
		if(func.btn == btn) {
			return func.func;
		}
	}
	return "";
} 

private function GetNearestGrid(npc_pos : Vector3, mplayer_pos : Vector3) : HouseSceneGrid
{
	var around_arr : Array = HouseSceneGrid.getAroundGridsInWalkArea(npc_pos);
	return HouseSceneGrid.getNearestGrid(around_arr, mplayer_pos);
}

/*
private function IsInAroundGrids(npc_pos : Vector3, mplayer_pos : Vector3) : boolean
{
	var around_arr : Array = HouseSceneGrid.getAroundGridsInWalkArea(npc_pos);
	var mplayer_grid : HouseSceneGrid = HouseSceneGrid.getGridByPos(mplayer_pos);
	return -1 == CommFunc.indexOfArray(around_arr, mplayer_grid) ? false : true;
}
*/