#pragma strict

//指向日常按钮“新手引导”
var arrow_direct : String = "toleft";
var img_name : String = "tip-18.png.u3d";
var arrow_pos : Vector2 = Vector2(54, 170);
var img_pos : Vector2 = Vector2(110, 85);
var lbl_pos_size : Rect = Rect(-5000, 168, 51, 59);

//指向关闭每日活跃界面按钮
var arrow_direct1 : String = "tobottom";
var img_name1 : String = "tip-10.png.u3d";
var arrow_pos1 : Vector2 = Vector2(361, 468);
var img_pos1 : Vector2 = Vector2(279, 321);
var lbl_pos_size1 : Rect = Rect(-5000, 168, 51, 59);

function Awake(){
	RegistEvt();
	iGUICode_MainUI.getInstance().active_award_btn.setEnabled(true);
}

function RegistEvt(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_ACTIVE_AWARD_BTN), HandleClickDailyActiveBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_DAILY_ACTIVE), HandleClickCloseDailyActive);
	
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASKGUIDEROOT), HandleCloseNewhandTaskGuideRoot);
	//EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.START_NEWHANDTASK_GUIDE), HandleStartNewHandTaskGuide);
}

function HandleClickCloseDailyActive(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
	var req : req_close_daily_reward_ui = new req_close_daily_reward_ui();
	NetHelper.Send(req);
}

function HandleClickDailyActiveBtn(evt : GameEvent, obj : Object){
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
		iGUICode_MainUI.getInstance().active_award_btn.setEnabled(true);
		UI.getUI().CloseNewGuideLeadRoot();
		UI.getUI().OpenNewGuideLeadRoot();
		iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos, img_pos, lbl_pos_size, arrow_direct, img_name, 80);	
	}
}

/*
function HandleStartNewHandTaskGuide(evt : GameEvent, obj : Object){
	var param : NewGuideRootParam = obj as NewGuideRootParam;
	var imgset : String[] = param.imgset;
	iGUICode_NewhandTaskGuide.OpenNewhandTaskGuideRoot(param.flag);
	iGUICode_NewhandTaskGuide.getInstance().NewhandTaskGuide_ShowPic(imgset);
}
*/

function HandleCloseNewhandTaskGuideRoot(evt : GameEvent, obj : Object){
	
}

function UnRegistEvt(){
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_ACTIVE_AWARD_BTN), HandleClickDailyActiveBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_DAILY_ACTIVE), HandleClickCloseDailyActive);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASKGUIDEROOT), HandleCloseNewhandTaskGuideRoot);
	//EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.START_NEWHANDTASK_GUIDE), HandleStartNewHandTaskGuide);
}

function OnDestroy(){
	UnRegistEvt();
	NewPlayGuideModule.HideFuncBtns(true);
}