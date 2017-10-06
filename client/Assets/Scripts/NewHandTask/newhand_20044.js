#pragma strict

//1,箭头指向回家按钮
var arrow_direct : String = "tobottom";
var img_name : String = "tip-28.png.u3d";
var arrow_pos : Vector2 = Vector2(513, 532);
var img_pos : Vector2 = Vector2(-5000, 383);
var lbl_pos_size : Rect = Rect(-5000, 450, 119, 35);

function Awake(){
	RegistEvt();
}

function RegistEvt(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_COMMON_SCENE), HandleNoInSelfHouse);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_FRIEND_HOUSE), HandleNoInSelfHouse);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_SELF_HOUSE), HandleEnterSelfHouse);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_RETURN_HOUSE), HandleClickOReturnHomeBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
}

function HandleNoInSelfHouse(evt : GameEvent, obj : Object){
	if(NewPlayGuideModule.one_newhand_task_complete_noreward){
		UI.getUI().CloseNewGuideLeadRoot();
	}
	else{
		UI.getUI().CloseNewGuideLeadRoot();
		UI.getUI().OpenNewGuideLeadRoot();
		iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos, img_pos, lbl_pos_size, arrow_direct, img_name, 80);
	}
}

function HandleEnterSelfHouse(evt : GameEvent, obj : Object) {
	UI.getUI().CloseNewGuideLeadRoot();
}

function HandleClickOReturnHomeBtn(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
}

function HandleCloseNewHandTaskUI(evt : GameEvent, obj : Object){
	var ins_task_id : UInt64 = Convert.ToUInt64(obj);
	var t : task_info = Task.getInstance().allTasks[Task.getInstance().findTaskIndexByInstID(ins_task_id)] as task_info;
	if(t.complete_date.year != 0 && t.reward_date.year == 0){	//已经完成任务, 且未领取
	
	}
	else if(t.complete_date.year == 0){
		if(!DataCenter.isInSelfHouse()){
			UI.getUI().CloseNewGuideLeadRoot();
			UI.getUI().OpenNewGuideLeadRoot();
			iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos, img_pos, lbl_pos_size, arrow_direct, img_name, 80);
		}
	}
}

function UnRegistEvt(){
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_COMMON_SCENE), HandleNoInSelfHouse);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_FRIEND_HOUSE), HandleNoInSelfHouse);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_SELF_HOUSE), HandleEnterSelfHouse);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_RETURN_HOUSE), HandleClickOReturnHomeBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
}

function OnDestroy(){
	UnRegistEvt();
}