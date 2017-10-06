/*有好多等级限制吗？不用为升级而烦恼，快快开始日常任务吧！
点击日常任务，完成任意的一个任务
任务条件：打开日常任务界面*/
#pragma strict

//指向日常按钮“新手引导”
var arrow_direct : String = "toleft";
var img_name : String = "tip-25.png.u3d";
var arrow_pos : Vector2 = Vector2(37, 207);
var img_pos : Vector2 = Vector2(110, 122);
var lbl_pos_size : Rect = Rect(-5000, 168, 51, 59);

//指向关闭每日活跃界面按钮
var arrow_direct1 : String = "totop";
var img_name1 : String = "tip-24.png.u3d";
var arrow_pos1 : Vector2 = Vector2(749, 72);
var img_pos1 : Vector2 = Vector2(671, 71);
var lbl_pos_size1 : Rect = Rect(-5000, 168, 51, 59);

function Awake(){
	RegistEvt();
	iGUICode_MainUI.getInstance().DailyTaskBtn.setEnabled(true);
}

function RegistEvt(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_DAILYTASK_BTN), HandleClickDailyTaskBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_DAILY_TASKUI), HandleClickCloseDailyTaskUI);
	
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASKGUIDEROOT), HandleCloseNewhandTaskGuideRoot);
	//EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.START_NEWHANDTASK_GUIDE), HandleStartNewHandTaskGuide);
}

function HandleClickCloseDailyTaskUI(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
	var req : req_close_daily_task_ui = new req_close_daily_task_ui();
	NetHelper.Send(req);
}

function HandleClickDailyTaskBtn(evt : GameEvent, obj : Object){
	var req : req_open_daily_task_ui = new req_open_daily_task_ui();
	NetHelper.Send(req);	
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
		iGUICode_MainUI.getInstance().DailyTaskBtn.setEnabled(true);
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
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_ACTIVE_AWARD_BTN), HandleClickDailyTaskBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_DAILY_ACTIVE), HandleClickCloseDailyTaskUI);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASKGUIDEROOT), HandleCloseNewhandTaskGuideRoot);
	//EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.START_NEWHANDTASK_GUIDE), HandleStartNewHandTaskGuide);
}

function OnDestroy(){
	UnRegistEvt();
	//NewPlayGuideModule.HideFuncBtns(true);
}