#pragma strict
//指向房产按钮“新手引导”
var arrow_direct : String = "tobottom";
var img_name : String = "tip-19.png.u3d";
var arrow_pos : Vector2 = Vector2(100, 530);
var img_pos : Vector2 = Vector2(35, 385);
var lbl_pos_size : Rect = Rect(-5000, 168, 51, 59);

//指向购买产权按钮
var arrow_direct1 : String = "toleft";
var img_name1 : String = "tip-11.png.u3d";
var arrow_pos1 : Vector2 = Vector2(310, 164);
var img_pos1 : Vector2 = Vector2(365, 95);
var lbl_pos_size1 : Rect = Rect(-5000, 168, 51, 59);

//指向一级产权按钮
var arrow_direct2 : String = "toleft";
var img_name2 : String = "tip-11.png.u3d";
var arrow_pos2 : Vector2 = Vector2(310, 164);
var img_pos2 : Vector2 = Vector2(365, 95);
var lbl_pos_size2 : Rect = Rect(-5000, 168, 51, 59);

//指向第二个房产
var arrow_direct3 : String = "toleft";
var img_name3 : String = "tip-12.png.u3d";
var arrow_pos3 : Vector2 = Vector2(361, 180);
var img_pos3 : Vector2 = Vector2(415, 109);
var lbl_pos_size3 : Rect = Rect(-5000, 168, 51, 59);

function Awake () {
	RegistEvt();
	iGUICode_MainUI.getInstance().house_btn.setEnabled(true);
}

function RegistEvt () {
	
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_HOUSELIST), HandleClickCloseHouseList);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_RETURN_RIGHT), HandleClickReturnRight);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_MOVEHOUSE), HandleClickMoveHouse);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_CONFIRMWIN), HandleClickCloseConfirmWin);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.BUY_HOUSE_RIGHT_DIAMOND_LIMITED), HandleBugHouseRightDiamondLimited);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.BUY_HOUSE_RIGHT_LV_LIMITED), HandleBugHouseRightLvLimited);	
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.BUY_HOUSE_RIGHT), HandleClickBugHouseRight);	
	
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_RIGHT_ITM_IMG), HandleClickRightItmImg);	
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_RIGHT_LOCK), HandleClickRightLock);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_HOUSERIGHTLISTUI), HandleCloseHouseRightListUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_HOUSE_BTN), HandleClickHouseBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.LV_UPDATETO_AIM), HandleLvUpdateToAim);
}

function HandleClickCloseHouseList(evt : GameEvent, obj : Object){
	HandleCloseHouseRightListUI(evt, obj);
}

function HandleClickReturnRight(evt : GameEvent, obj : Object){
	HandleClickBugHouseRight(evt, obj);
}

function HandleClickMoveHouse(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
}

function HandleClickCloseConfirmWin(evt : GameEvent, obj : Object){
	HandleClickHouseBtn(evt, obj);
}

function HandleBugHouseRightDiamondLimited(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
}

function HandleBugHouseRightLvLimited(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
}

function HandleClickBugHouseRight(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos2, img_pos2, lbl_pos_size2, arrow_direct2, img_name2, 3);
}

function HandleClickRightItmImg(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos3, img_pos3, lbl_pos_size3, arrow_direct3, img_name3, 3);
}

function HandleClickRightLock(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
}

function HandleCloseHouseRightListUI(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
}

function HandleCloseNewHandTaskUI(evt : GameEvent, obj : Object){
	var ins_task_id : UInt64 = Convert.ToUInt64(obj);
	var t : task_info = Task.getInstance().allTasks[Task.getInstance().findTaskIndexByInstID(ins_task_id)] as task_info;
	if(t.complete_date.year != 0 && t.reward_date.year == 0){	//已经完成任务, 且未领取
	
	}
	else if(t.complete_date.year == 0){
		if(DataCenter.getMainPlayerCurLv() >= 5){
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.LV_UPDATETO_AIM));
		}
	}
}

function HandleLvUpdateToAim(evt : GameEvent, obj : Object){
	if(DataCenter.isInSelfHouse()){
		UI.getUI().CloseNewGuideLeadRoot();
		UI.getUI().OpenNewGuideLeadRoot();
		iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos, img_pos, lbl_pos_size, arrow_direct, img_name, 80);
	}
}

function HandleClickHouseBtn(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos1, img_pos1, lbl_pos_size1, arrow_direct1, img_name1, 3);
}

function OnDestroy(){
	UnRegistEvt();
	//iGUICode_MainUI.getInstance().house_btn.setEnabled(false);
}

function UnRegistEvt(){
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_RIGHT_ITM_IMG), HandleClickRightItmImg);	
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_RIGHT_LOCK), HandleClickRightLock);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_HOUSERIGHTLISTUI), HandleCloseHouseRightListUI);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_HOUSE_BTN), HandleClickHouseBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.LV_UPDATETO_AIM), HandleLvUpdateToAim);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_HOUSELIST), HandleClickCloseHouseList);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_RETURN_RIGHT), HandleClickReturnRight);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_MOVEHOUSE), HandleClickMoveHouse);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_CONFIRMWIN), HandleClickCloseConfirmWin);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.BUY_HOUSE_RIGHT_DIAMOND_LIMITED), HandleBugHouseRightDiamondLimited);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.BUY_HOUSE_RIGHT_LV_LIMITED), HandleBugHouseRightLvLimited);	
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.BUY_HOUSE_RIGHT), HandleClickBugHouseRight);	
}