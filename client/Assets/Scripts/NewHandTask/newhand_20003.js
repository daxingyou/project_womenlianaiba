#pragma strict

//指向换装按钮“新手引导”
var arrow_direct : String = "tobottom";
var img_name : String = "tip-17.png.u3d";
var arrow_pos : Vector2 = Vector2(-10, 532);
var img_pos : Vector2 = Vector2(14, 374);
var lbl_pos_size : Rect = Rect(-5000, 85, 56, 80);

//指向衣服
var arrow_direct1 : String = "totop";
var img_name1 : String = "tip-4.png.u3d";
var arrow_pos1 : Vector2 = Vector2(196, 187);
var img_pos1 : Vector2 = Vector2(203, 239);
var lbl_pos_size1 : Rect = Rect(-5000, 85, 56, 80);

//指向保存
var arrow_direct2 : String = "tobottom";
var img_name2 : String = "tip-5.png.u3d";
var arrow_pos2 : Vector2 = Vector2(708, 447);
var img_pos2 : Vector2 = Vector2(650, 299);
var lbl_pos_size2 : Rect = Rect(-5000, 85, 56, 80);

//指向积分复选框
var arrow_direct3 : String = "toleft";
var img_name3 : String = "tip-23.png.u3d";
var arrow_pos3 : Vector2 = Vector2(433, 289);
var img_pos3 : Vector2 = Vector2(-5000, 157);
var lbl_pos_size3 : Rect = Rect(-5000, 85, 56, 80);

//指向确认按钮
var arrow_direct4 : String = "toleft";
var img_name4 : String = "tip-23.png.u3d";
var arrow_pos4 : Vector2 = Vector2(428, 289);
var img_pos4 : Vector2 = Vector2(-5000, 157);
var lbl_pos_size4 : Rect = Rect(-5000, 85, 56, 80);

function Awake(){
	RegistEvt();
	iGUICode_MainUI.getInstance().dress_btn.setEnabled(true);
}

function RegistEvt(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CONFIRM_QUIT_DRESS), HandleQuitDress);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_SAVE_DRESS), HandleClickSaveDress);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_MALL_SLOT), HandleClickMallSlot);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_ENABLE), HandleClickDressBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CHECKBUY_CHOOSE1), HandleClickCheckBuyChoose1);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CHECKBUY_SUREBTN), HandleClickCheckBuySureBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CHECKBUY_CANCELBTN), HandleClickCheckBuyCancelBtn);
}

function HandleClickCheckBuyCancelBtn(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos2, img_pos2, lbl_pos_size2, arrow_direct2, img_name2, 3);
}

function HandleClickCheckBuySureBtn(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
}

function HandleClickCheckBuyChoose1(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos4, img_pos4, lbl_pos_size4, arrow_direct4, img_name4, 3);	
}

function HandleCloseNewHandTaskUI(evt : GameEvent, obj : Object){
	var ins_task_id : UInt64 = Convert.ToUInt64(obj);
	var t : task_info = Task.getInstance().allTasks[Task.getInstance().findTaskIndexByInstID(ins_task_id)] as task_info;
	if(t.complete_date.year != 0 && t.reward_date.year == 0){	//已经完成任务, 且未领取
	
	}
	else if(t.complete_date.year == 0){
		iGUICode_MainUI.getInstance().dress_btn.setEnabled(true);
		UI.getUI().CloseNewGuideLeadRoot();
		UI.getUI().OpenNewGuideLeadRoot();
		iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos, img_pos, lbl_pos_size, arrow_direct, img_name, 80);
	}
}

function HandleQuitDress(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos, img_pos, lbl_pos_size, arrow_direct, img_name, 80);
}

function HandleClickSaveDress(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos3, img_pos3, lbl_pos_size3, arrow_direct3, img_name3, 80);
}

function HandleClickMallSlot(evt : GameEvent, obj : Object){
	//todo 调整箭头指向
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos2, img_pos2, lbl_pos_size2, arrow_direct2, img_name2, 3);
}

function HandleClickDressBtn(evt : GameEvent, obj : Object){
	var enable : boolean = Convert.ToBoolean(obj);
	if(enable){
		//UI.getUI().SetElementPassive(false,"dress_btn","MainUI",false);
		UI.getUI().CloseNewGuideLeadRoot();
		UI.getUI().OpenNewGuideLeadRoot();
		iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos1, img_pos1, lbl_pos_size1, arrow_direct1, img_name1, 3);
		//todo 调整箭头指向
	}
}

function UnRegistEvt(){
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CONFIRM_QUIT_DRESS), HandleQuitDress);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_ENABLE), HandleClickDressBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_SAVE_DRESS), HandleClickSaveDress);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_MALL_SLOT), HandleClickMallSlot);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CHECKBUY_CHOOSE1), HandleClickCheckBuyChoose1);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CHECKBUY_SUREBTN), HandleClickCheckBuySureBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CHECKBUY_CANCELBTN), HandleClickCheckBuyCancelBtn);
}

function OnDestroy(){
	UnRegistEvt();
}