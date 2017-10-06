#pragma strict

//1,箭头指向排行榜按钮
var arrow_direct : String = "tobottom";
var img_name : String = "tip-28.png.u3d";
var arrow_pos : Vector2 = Vector2(374, 534);
var img_pos : Vector2 = Vector2(-5000, 383);
var lbl_pos_size : Rect = Rect(-5000, 450, 119, 35);

//1,箭头指向拜访
var arrow_direct1 : String = "toleft";
var img_name1 : String = "tip-28.png.u3d";
var arrow_pos1 : Vector2 = Vector2(727, 138);
var img_pos1 : Vector2 = Vector2(-5000, 383);
var lbl_pos_size1 : Rect = Rect(-5000, 450, 119, 35);

//1,箭头指向回家
var arrow_direct2 : String = "tobottom";
var img_name2 : String = "tip-28.png.u3d";
var arrow_pos2 : Vector2 = Vector2(513, 532);
var img_pos2 : Vector2 = Vector2(-5000, 383);
var lbl_pos_size2 : Rect = Rect(-5000, 450, 119, 35);

function Awake(){
	RegistEvt();
}

function RegistEvt(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_RETURN_HOUSE), HandleClickOReturnHomeBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_FRIEND_HOUSE), HandleEnterFriendHouse);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_RANKLIST_VISIT_BTN), HandleClickRankListVisitBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_OPEN_PAIHANGBANG), HandleClickOpenPaiHangBang);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
}

function HandleClickOReturnHomeBtn(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
}

function HandleEnterFriendHouse(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos2, img_pos2, lbl_pos_size2, arrow_direct2, img_name2, 80);		
}

function HandleClickRankListVisitBtn(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
}

function HandleClickOpenPaiHangBang(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos1, img_pos1, lbl_pos_size1, arrow_direct1, img_name1, 80);	
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

function UnRegistEvt(){
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_RETURN_HOUSE), HandleClickOReturnHomeBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_FRIEND_HOUSE), HandleEnterFriendHouse);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_RANKLIST_VISIT_BTN), HandleClickRankListVisitBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_OPEN_PAIHANGBANG), HandleClickOpenPaiHangBang);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
}

function OnDestroy(){
	UnRegistEvt();
}