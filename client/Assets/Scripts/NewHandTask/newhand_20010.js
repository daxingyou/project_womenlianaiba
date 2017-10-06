//点击房屋，选择我的种植标签，解锁一个花盆
//	任务条件：解锁一个花盆
#pragma strict

//1,箭头指向房产
var arrow_direct : String = "tobottom";
var img_name : String = "tip-26.png.u3d";
var arrow_pos : Vector2 = Vector2(83, 528);
var img_pos : Vector2 = Vector2(28, 383);
var lbl_pos_size : Rect = Rect(-5000, 450, 119, 35);

//2,箭头指向我的种植
var arrow_direct1 : String = "toleft";
var img_name1 : String = "tip-1.png.u3d";
var arrow_pos1 : Vector2 = Vector2(480, 83);
var img_pos1 : Vector2 = Vector2(-5000, 265);
var lbl_pos_size1 : Rect = Rect(405, 92, 82, 41);

//3,箭头指向解锁花盘按钮
var arrow_direct2 : String = "toleft";
var img_name2 : String = "tip-1.png.u3d";
var arrow_pos2 : Vector2 = Vector2(517, 185);
var img_pos2 : Vector2 = Vector2(-5000, 265);
var lbl_pos_size2 : Rect = Rect(-5000, 450, 119, 35);

//4,箭头指向解锁界面的解锁按钮
var arrow_direct3 : String = "tobottom";
var img_name3 : String = "tip-1.png.u3d";
var arrow_pos3 : Vector2 = Vector2(360, 391);
var img_pos3 : Vector2 = Vector2(-5000, 265);
var lbl_pos_size3 : Rect = Rect(-5000, 450, 119, 35);

function Awake(){
	RegistEvt();
	iGUICode_MainUI.getInstance().house_btn.setEnabled(true);
}

function RegistEvt(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASKGUIDEROOT), HandleCloseNewhandTaskGuideRoot);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_MYPLANT_TABBTN), HandleClickMyPlantTabBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_HOUSE_BTN), HandleClickHouseBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_UNLOCKFLOWERPOT_BTN), HandleClickUnLockFlowerPotBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.UNLOCKFLOWERPOT), HandleUnLockFlowerPot);
}

function HandleUnLockFlowerPot(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
}

function HandleClickUnLockFlowerPotBtn(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos3, img_pos3, lbl_pos_size3, arrow_direct3, img_name3, 3);
}

function HandleClickHouseBtn(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos1, img_pos1, lbl_pos_size1, arrow_direct1, img_name1, 3);
}

function HandleClickMyPlantTabBtn(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos2, img_pos2, lbl_pos_size2, arrow_direct2, img_name2, 3);
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

function HandleCloseNewhandTaskGuideRoot(evt : GameEvent, obj : Object){
	
}

function UnRegistEvt(){
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_MYPLANT_TABBTN), HandleClickMyPlantTabBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASKGUIDEROOT), HandleCloseNewhandTaskGuideRoot);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_HOUSE_BTN), HandleClickHouseBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_UNLOCKFLOWERPOT_BTN), HandleClickUnLockFlowerPotBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.UNLOCKFLOWERPOT), HandleUnLockFlowerPot);
}

function OnDestroy(){
	UnRegistEvt();
	NewPlayGuideModule.HideFuncBtns(true);
	iGUICode_MainUI.getInstance().party_btn.setEnabled(false);
}