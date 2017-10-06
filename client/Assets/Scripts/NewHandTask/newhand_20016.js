#pragma strict

//1,箭头指向积分任务
var arrow_direct : String = "toleft";
var img_name : String = "tip-26.png.u3d";
var arrow_pos : Vector2 = Vector2(54, 158);
var img_pos : Vector2 = Vector2(-5000, 383);
var lbl_pos_size : Rect = Rect(-5000, 450, 119, 35);

//1,箭头指向领取奖励
var arrow_direct1 : String = "toleft";
var img_name1 : String = "tip-26.png.u3d";
var arrow_pos1 : Vector2 = Vector2(254, 151);
var img_pos1 : Vector2 = Vector2(-5000, 383);
var lbl_pos_size1 : Rect = Rect(-5000, 450, 119, 35);

function Awake(){
	RegistEvt();
}

function RegistEvt(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_DAILY_ACTIVE), HandleClickCloseJiFenTaskBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.OPEN_ACTIVE_AWARD_UI), HandleOpenJiFenTaskBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
}

function HandleClickCloseJiFenTaskBtn(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
}

function HandleOpenJiFenTaskBtn(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos1, img_pos1, lbl_pos_size1, arrow_direct1, img_name1, 3);	

}

function HandleCloseNewHandTaskUI(evt : GameEvent, obj : Object){
	var ins_task_id : UInt64 = Convert.ToUInt64(obj);
	var t : task_info = Task.getInstance().allTasks[Task.getInstance().findTaskIndexByInstID(ins_task_id)] as task_info;
	if(t.complete_date.year != 0 && t.reward_date.year == 0){	//已经完成任务, 且未领取
	
	}
	else if(t.complete_date.year == 0){
		UI.getUI().CloseNewGuideLeadRoot();
		UI.getUI().OpenNewGuideLeadRoot();
		iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos, img_pos, lbl_pos_size, arrow_direct, img_name, 3);	
	}
}

function UnRegistEvt(){
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_DAILY_ACTIVE), HandleClickCloseJiFenTaskBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.OPEN_ACTIVE_AWARD_UI), HandleOpenJiFenTaskBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
}

function OnDestroy(){
	UnRegistEvt();
}