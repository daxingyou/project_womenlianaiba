#pragma strict

//指向收集按钮“新手引导”
var arrow_direct : String = "tobottom";
var img_name : String = "tip-20.png.u3d";
var arrow_pos : Vector2 = Vector2(273, 539);
var img_pos : Vector2 = Vector2(220, 394);
var lbl_pos_size : Rect = Rect(-5000, 168, 51, 59);

//指向缩短时间的按钮
var arrow_direct1 : String = "tobottom";
var img_name1 : String = "tip-9.png.u3d";
var arrow_pos1 : Vector2 = Vector2(402, 323);
var img_pos1 : Vector2 = Vector2(351, 165);
var lbl_pos_size1 : Rect = Rect(-5000, 168, 51, 59);

//指向选择好友框
var arrow_direct2 : String = "toleft";
var img_name2 : String = "tip-13.png.u3d";
var arrow_pos2 : Vector2 = Vector2(476, 399);
var img_pos2 : Vector2 = Vector2(553, 323);
var lbl_pos_size2 : Rect = Rect(-5000, 168, 51, 59);

//指向选择NPC框
var arrow_direct3 : String = "tobottom";
var img_name3 : String = "tip-9.png.u3d";
var arrow_pos3 : Vector2 = Vector2(-5000, 302);
var img_pos3 : Vector2 = Vector2(-5000, 154);
var lbl_pos_size3 : Rect = Rect(-5000, 168, 51, 59);

//指向开始收集按钮
var arrow_direct4 : String = "toleft";
var img_name4 : String = "tip-13.png.u3d";
var arrow_pos4 : Vector2 = Vector2(-5000, 377);
var img_pos4 : Vector2 = Vector2(-5000, 301);
var lbl_pos_size4 : Rect = Rect(-5000, 168, 51, 59);
private var this_task_complete_f : boolean = false;

function Awake () {
	RegistEvt();
	this_task_complete_f = false;
	NewPlayGuideModule.collect_newhand_flag = true;
}

function RegistEvt () {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.COMPLETE_NEWHAND_TASK), HandleCompleteNewhandTask);	
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_START_COLLECT_BTN), HandleClickStartCollectBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_NPC_IMG), HandleClickNpcImg);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.POINTTO_NPC), HandlePointToNpc);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_COLLECT_UI), HandleCloseCollectUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.START_NEWHANDTASK_GUIDE), HandleStartNewHandTaskGuide);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_IMMEDIATE_DONE_BTN), HandleClickImmediateDoneBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CUT_COLLECT_TIME_BTN), HandleClickCutCollectTimeBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_COLLECT_BTN), HandleClickCllectBtn);
}

function HandleCompleteNewhandTask(evt : GameEvent, obj : Object){
	this_task_complete_f = true;
}

function HandleClickStartCollectBtn(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
}

function HandleClickNpcImg(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos4, img_pos4, lbl_pos_size4, arrow_direct4, img_name4, 3);			
}

function HandlePointToNpc(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos3, img_pos3, lbl_pos_size3, arrow_direct3, img_name3, 3);		
}

function HandleCloseCollectUI(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
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

function HandleStartNewHandTaskGuide(evt : GameEvent, obj : Object){
	var param : NewGuideRootParam = obj as NewGuideRootParam;
	var imgset : String[] = param.imgset;
	var need_pos : boolean = param.need_pos;
	var pos : Vector2 = param.pos;
	var btn_visible : boolean = param.btn_visible;
	iGUICode_NewhandTaskGuide.OpenNewhandTaskGuideRoot(param.flag, true);
	iGUICode_NewhandTaskGuide.getInstance().NewhandTaskGuide_ShowPic(imgset, need_pos, pos, btn_visible, param.need_tex_anim);
}

function HandleClickCllectBtn(evt : GameEvent, obj : Object){
	if(NewPlayGuideModule.one_newhand_task_complete_noreward || this_task_complete_f)
		return;
	
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos2, img_pos2, lbl_pos_size2, arrow_direct2, img_name2, 3);	
}

function HandleClickCutCollectTimeBtn(evt : GameEvent, obj : Object){
	if(NewPlayGuideModule.one_newhand_task_complete_noreward || this_task_complete_f)
		return;

	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos1, img_pos1, lbl_pos_size1, arrow_direct1, img_name1, 3);	
}

function HandleClickImmediateDoneBtn(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
}

function OnDestroy(){
	UnRegistEvt();
	NewPlayGuideModule.collect_newhand_flag = false;
}

function UnRegistEvt(){
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_COLLECT_UI), HandleCloseCollectUI);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.START_NEWHANDTASK_GUIDE), HandleStartNewHandTaskGuide);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_IMMEDIATE_DONE_BTN), HandleClickImmediateDoneBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CUT_COLLECT_TIME_BTN), HandleClickCutCollectTimeBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_COLLECT_BTN), HandleClickCllectBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_START_COLLECT_BTN), HandleClickStartCollectBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_NPC_IMG), HandleClickNpcImg);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.POINTTO_NPC), HandlePointToNpc);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.COMPLETE_NEWHAND_TASK), HandleCompleteNewhandTask);	

}