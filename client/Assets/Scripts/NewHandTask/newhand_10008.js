#pragma strict

//指向合成按钮“新手引导”
var arrow_direct : String = "tobottom";
var img_name : String = "tip-21.png.u3d";
var arrow_pos : Vector2 = Vector2(339, 510);
var img_pos : Vector2 = Vector2(220, 362);
var lbl_pos_size : Rect = Rect(-5000, 168, 51, 59);

//指向图纸
var arrow_direct1 : String = "toleft";
var img_name1 : String = "task-tip.png.u3d";
var arrow_pos1 : Vector2 = Vector2(500, 177);
var img_pos1 : Vector2 = Vector2(-5000, 85);
var lbl_pos_size1 : Rect = Rect(-5000, 168, 51, 59);

//指向合成按钮
var arrow_direct2 : String = "toleft";
var img_name2 : String = "task-tip.png.u3d";
var arrow_pos2 : Vector2 = Vector2(352, 383);
var img_pos2 : Vector2 = Vector2(-5000, 85);
var lbl_pos_size2 : Rect = Rect(-5000, 168, 51, 59);

function Awake () {
	RegistEvt();
}

function RegistEvt () {
	
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_BACKPACKUI), HandleClickCloseBackPackUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_ClOSE_MAKEUI), HandleClickCloseMakeUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_MAKE), HandleClickMake);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_RECIPE), HandleClickRecipe);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.OPEN_ITEMSMAKEUI), HandleOpenItemsMakeUI);
	
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_ITEMS_MAKE_BTN), HandleClickItemsMakeBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
}

function HandleClickCloseBackPackUI(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
}

function HandleClickCloseMakeUI(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
}

function HandleClickMake(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
}

function HandleClickRecipe(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos2, img_pos2, lbl_pos_size2, arrow_direct2, img_name2, 3);	
}

function HandleOpenItemsMakeUI(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos1, img_pos1, lbl_pos_size1, arrow_direct1, img_name1, 3);	
}

function HandleClickItemsMakeBtn(evt : GameEvent, obj : Object){
	//UI.getUI().CloseNewGuideLeadRoot();
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

function OnDestroy(){
	UnRegistEvt();
}

function UnRegistEvt(){
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_ITEMS_MAKE_BTN), HandleClickItemsMakeBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_BACKPACKUI), HandleClickCloseBackPackUI);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_ClOSE_MAKEUI), HandleClickCloseMakeUI);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_MAKE), HandleClickMake);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_RECIPE), HandleClickRecipe);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.OPEN_ITEMSMAKEUI), HandleOpenItemsMakeUI);

}