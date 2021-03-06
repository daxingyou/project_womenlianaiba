#pragma strict

//1,箭头指向派对
var arrow_direct : String = "tobottom";
var img_name : String = "tip-26.png.u3d";
var arrow_pos : Vector2 = Vector2(462, 491);
var img_pos : Vector2 = Vector2(-5000, 383);
var lbl_pos_size : Rect = Rect(-5000, 450, 119, 35);

function Awake(){
	RegistEvt();
	iGUICode_MainUI.getInstance().party_btn.setEnabled(true);
}

function RegistEvt(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_PARTY_BTN), HandleClickPartyBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
}

function HandleClickPartyBtn(evt : GameEvent, obj : Object){
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
		iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos, img_pos, lbl_pos_size, arrow_direct, img_name, 3);	
	}
}

function UnRegistEvt(){
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_PARTY_BTN), HandleClickPartyBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
}

function OnDestroy(){
	UnRegistEvt();
}