
//指向资料
var arrow_direct : String = "tobottom";
var img_name : String = "tip-21.png.u3d";
var arrow_pos : Vector2 = Vector2(135, 535);
var img_pos : Vector2 = Vector2(-5000, 362);
var lbl_pos_size : Rect = Rect(-5000, 168, 51, 59);

//指向修改资料
var arrow_direct1 : String = "tobottom";
var img_name1 : String = "tip-21.png.u3d";
var arrow_pos1 : Vector2 = Vector2(165, 374);
var img_pos1 : Vector2 = Vector2(-5000, 362);
var lbl_pos_size1 : Rect = Rect(-5000, 168, 51, 59);

function Awake () {
	RegisetEvt();
}

function RegisetEvt(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_MODIFY_PERSONALINFO), HandleClickModifyPersonalInfo);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.OPEN_PERSONALINFO_UI), HandleOpenPersonalInfoUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_PERSONAL_INFO_UI), HandleClosePersonalInfoUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
}

function HandleClickModifyPersonalInfo(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
}

function HandleOpenPersonalInfoUI(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos1, img_pos1, lbl_pos_size1, arrow_direct1, img_name1, 80);
}

function HandleClosePersonalInfoUI (evt : GameEvent, obj : Object) {
	var req : req_close_person_info = new req_close_person_info();
	NetHelper.Send(req);
}

function HandleCloseNewHandTaskUI(evt : GameEvent, obj : Object){
	var ins_task_id : UInt64 = Convert.ToUInt64(obj);
	var t : task_info = Task.getInstance().allTasks[Task.getInstance().findTaskIndexByInstID(ins_task_id)] as task_info;
	if(t.complete_date.year != 0 && t.reward_date.year == 0){	//已经完成任务, 且未领取
	
	}
	else if(t.complete_date.year == 0){
		UI.getUI().CloseNewGuideLeadRoot();
		UI.getUI().OpenNewGuideLeadRoot();
		iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos, img_pos, lbl_pos_size, arrow_direct, img_name, 80);
	}
}

function OnDestroy(){
	UnRegisetEvt();
}

function UnRegisetEvt(){
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_MODIFY_PERSONALINFO), HandleClickModifyPersonalInfo);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.OPEN_PERSONALINFO_UI), HandleOpenPersonalInfoUI);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_PERSONAL_INFO_UI), HandleClosePersonalInfoUI);
}