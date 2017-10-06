#pragma strict

//1,箭头指向完成旋转镜头操作领取奖励按钮 “新手引导”
var arrow_direct : String = "tobottom";
var img_name : String = "tip-1.png.u3d";
var arrow_pos : Vector2 = Vector2(470, 415);
var img_pos : Vector2 = Vector2(400, 265);
var lbl_pos_size : Rect = Rect(-5000, 450, 119, 35);

private var start_req_rotate_camera_flag : boolean = false;

function Awake(){
	RegistEvt();
	UI.getUI().CloseNewGuideLeadRoot();
}

function RegistEvt(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.ONE_NEWHAND_TASK_COMPLETE_NOREWARD), HandleCopleteNoReward);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.START_NEWHANDTASK_GUIDE), HandleStartNewHandTaskGuide);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASKGUIDEROOT), HandleCloseNewhandTaskGuideRoot);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.REACH_ROTATE_LEN), HandleReqMoveCamera);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.OPEN_STEP_LEAD_UI), HandleOpenStepLeadUI);
	//EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_STEP_LEAD_UI), HandleCloseStepLeadUI);
}

// HandleCloseStepLeadUI(evt : GameEvent, obj : Object){
//	iGUICode_TaskUI.getInstance().CommTaskClose.passive = false;
//	UI.getUI().CloseNewGuideLeadRoot();
//}

function HandleCopleteNoReward(evt : GameEvent, obj : Object){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.EXTENAL_CLOSE_NEWGUIDEWIN));
}

function HandleOpenStepLeadUI(evt : GameEvent, obj : Object){
	iGUICode_TaskUI.getInstance().CommTaskClose.passive = true;
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos, img_pos, lbl_pos_size, arrow_direct, img_name, 3);
}

private function HandleCloseNewHandTaskUI(evt : GameEvent, obj : Object) {
	var ins_task_id : UInt64 = Convert.ToUInt64(obj);
	var t : task_info = Task.getInstance().allTasks[Task.getInstance().findTaskIndexByInstID(ins_task_id)] as task_info;
	if(t.complete_date.year != 0 && t.reward_date.year == 0){	//已经完成任务, 且未领取
	
	}
	else if(t.complete_date.year == 0){
		var imgset : String[] = new String[2];
		imgset[0] = "newguide-2.png.u3d";
		imgset[1] = "newguide-3.png.u3d";
		var param : NewGuideRootParam = new NewGuideRootParam(true, imgset, false, true, Vector2(0,0), false, true);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.START_NEWHANDTASK_GUIDE), param);
		HandleCloseNewhandTaskGuideRoot(evt, obj);
	}	
}

function HandleStartNewHandTaskGuide(evt : GameEvent, obj : Object){
	var param : NewGuideRootParam = obj as NewGuideRootParam;
	var imgset : String[] = param.imgset;
	var need_pos = param.need_pos;
	var pos : Vector2 = param.pos;
	var btn_visible : boolean = param.btn_visible;
	iGUICode_NewhandTaskGuide.OpenNewhandTaskGuideRoot(param.flag, param.model);
	iGUICode_NewhandTaskGuide.getInstance().NewhandTaskGuide_ShowPic(imgset, need_pos, pos, btn_visible, param.need_tex_anim);
}

function HandleCloseNewhandTaskGuideRoot(evt : GameEvent, obj : Object){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.START_REQ_ROTATE_CAMERA));
}


function HandleReqMoveCamera(evt : GameEvent, obj : Object){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.EXTENAL_CLOSE_NEWGUIDEWIN));
	ReqMoveCamera();
}

function ReqMoveCamera(){
	var req : req_move_camera = new req_move_camera();
	NetHelper.Send(req);
}

function UnRegistEvt(){
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.ONE_NEWHAND_TASK_COMPLETE_NOREWARD), HandleCopleteNoReward);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.START_NEWHANDTASK_GUIDE), HandleStartNewHandTaskGuide);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASKGUIDEROOT), HandleCloseNewhandTaskGuideRoot);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.REACH_ROTATE_LEN), HandleReqMoveCamera);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.OPEN_STEP_LEAD_UI), HandleOpenStepLeadUI);
	//EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_STEP_LEAD_UI), HandleCloseStepLeadUI);
}

function OnDestroy(){
	UnRegistEvt();
}