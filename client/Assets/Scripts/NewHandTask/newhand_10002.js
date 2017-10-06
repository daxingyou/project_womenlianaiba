#pragma strict

//指向家装按钮“新手引导”
var arrow_direct : String = "tobottom";
var img_name : String = "tip-16.png.u3d";
var arrow_pos : Vector2 = Vector2(53, 510);
var img_pos : Vector2 = Vector2(14, 345);
var lbl_pos_size : Rect = Rect(-5000, 550, 40, 40);

//指向家具分类
var arrow_direct1 : String = "tobottom";
var img_name1 : String = "tip-2.png.u3d";
var arrow_pos1 : Vector2 = Vector2(100, 460);
var img_pos1 : Vector2 = Vector2(80, 305);
var lbl_pos_size1 : Rect = Rect(-5000, 515, 140, 80);

//指向家具
var img_name2 : String = "tip-3.png.u3d";
var lbl_pos_size2 : Rect = Rect(-5000, 515, 665, 80);

//指向保存按钮
var arrow_direct3 : String = "tobottom";
var img_name3 : String = "task-tip.png.u3d";
var arrow_pos3 : Vector2 = Vector2(575, 420);
var img_pos3 : Vector2 = Vector2(-5000, 85);
var lbl_pos_size3 : Rect = Rect(-5000, 550, 40, 40);

private var this_task_complete_f : boolean = false;

function Awake(){
	RegistEvt();
	this_task_complete_f = false;
	iGUICode_MainUI.getInstance().fitment_btn.setEnabled(true);
}

function RegistEvt(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.COMPLETE_NEWHAND_TASK), HandleCompleteNewhandTask);	
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.OPEN_STEP_LEAD_UI), HandleOpenStepLeadUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_SHOP_PACK_BTN), HandleClickShopPackBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_SHOP_MALL_BTN), HandleClickShopMallBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.RETURN_TO_TYPE_LIST), HandleReturnToType);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.EXIT_EDIT_HOUSE), HandleExitEditHouse);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.PUTDOWNEND), HandlePutdownEnd);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.PutdownStart), HandlePutdownStart);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_SAVE_FITMENT), HandleClickSaveFitment);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.SELECT_FURNI), HandleSelectFurni);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.SELECT_FURNI_TYPE), HandleSelectFurniType);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.ENTER_FITMENT_UI), HandleEnterFitmentUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_FITMENT_BTN), HandleClickFitmentBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.START_NEWHANDTASK_GUIDE), HandleStartNewHandTaskGuide);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASKGUIDEROOT), HandleCloseNewhandTaskGuideRoot);
}

function HandleCompleteNewhandTask(evt : GameEvent, obj : Object){
	this_task_complete_f = true;
}

function HandleCloseNewHandTaskUI(evt : GameEvent, obj : Object){
	var ins_task_id : UInt64 = Convert.ToUInt64(obj);
	var t : task_info = Task.getInstance().allTasks[Task.getInstance().findTaskIndexByInstID(ins_task_id)] as task_info;
	if(t.complete_date.year != 0 && t.reward_date.year == 0){	//已经完成任务, 且未领取
	
	}
	else if(t.complete_date.year == 0){
		iGUICode_MainUI.getInstance().fitment_btn.setEnabled(true);
		UI.getUI().CloseNewGuideLeadRoot();
		UI.getUI().OpenNewGuideLeadRoot();
		iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos, img_pos, lbl_pos_size, arrow_direct, img_name, 80);
	}
}

function HandleOpenStepLeadUI(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
}

function HandleClickShopPackBtn(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
}

function HandleClickShopMallBtn(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos1, img_pos1, lbl_pos_size1, arrow_direct1, img_name1, 80);		
}

function HandleReturnToType(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos1, img_pos1, lbl_pos_size1, arrow_direct1, img_name1, 80);	
}

function HandleExitEditHouse(evt : GameEvent, obj : Object){
	if(!this_task_complete_f){
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.EXTENAL_CLOSE_NEWGUIDEWIN));
		UI.getUI().CloseNewGuideLeadRoot();
		UI.getUI().OpenNewGuideLeadRoot();
		iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos, img_pos, lbl_pos_size, arrow_direct, img_name, 80);
	}
}

function HandlePutdownEnd(evt : GameEvent, obj : Object){
	var imgset : String[] = new String[1];
	imgset[0] = "newguide-7.png.u3d";
	var param : NewGuideRootParam = new NewGuideRootParam(true, imgset, false, false, null, false, false);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.START_NEWHANDTASK_GUIDE), param);
	HandleCloseNewhandTaskGuideRoot(evt, obj);
}

function HandlePutdownStart(evt : GameEvent, obj : Object){
	var imgset : String[] = new String[1];
	imgset[0] = "newguide-6.png.u3d";
	var param : NewGuideRootParam = new NewGuideRootParam(false, imgset, false, true, Vector2(0,0), false, false);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.START_NEWHANDTASK_GUIDE), param);
}

function HandleClickSaveFitment(evt : GameEvent, obj : Object){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.EXTENAL_CLOSE_NEWGUIDEWIN));
	UI.getUI().CloseNewGuideLeadRoot();
}

function HandleCloseNewhandTaskGuideRoot(evt : GameEvent, obj : Object){
	//iGUICode_StorageBoxUI.getInstance().shop_exit_btn.setEnabled(true);
	iGUICode_StorageBoxUI.getInstance().shop_save_btn.setEnabled(true);

	//UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos3, img_pos3, lbl_pos_size3, arrow_direct3, img_name3, 80);
}

function HandleStartNewHandTaskGuide(evt : GameEvent, obj : Object){
	var param : NewGuideRootParam = obj as NewGuideRootParam;
	var imgset : String[] = param.imgset;
	var need_pos : boolean = param.need_pos;
	var pos : Vector2 = param.pos;
	var btn_visible : boolean = param.btn_visible;
	iGUICode_NewhandTaskGuide.OpenNewhandTaskGuideRoot(param.flag, param.model);
	iGUICode_NewhandTaskGuide.getInstance().NewhandTaskGuide_ShowPic(imgset, need_pos, pos, btn_visible, param.need_tex_anim);
}

function HandleSelectFurni(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
	var imgset : String[] = new String[1];
	imgset[0] = "newguide-5.png.u3d";
	var param : NewGuideRootParam = new NewGuideRootParam(false, imgset, false, true, Vector2(0,0), false, false);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.START_NEWHANDTASK_GUIDE), param);

}

function HandleSelectFurniType(evt : GameEvent, obj : Object){
	//改变箭头的位置
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos1, img_pos1, lbl_pos_size2, arrow_direct1, img_name2, 80);
}

function HandleEnterFitmentUI(evt : GameEvent, obj : Object){
	iGUICode_StorageBoxUI.getInstance().shop_exit_btn.setEnabled(false);
	iGUICode_StorageBoxUI.getInstance().shop_save_btn.setEnabled(false);
	iGUICode_StorageBoxUI.getInstance().auto_fitment_btn.setEnabled(false);
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos1, img_pos1, lbl_pos_size1, arrow_direct1, img_name1,80);
}

function HandleClickFitmentBtn(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
	//UI.getUI().SetElementPassive(false,"fitment_btn","MainUI",false);
}

function UnRegistEvt(){
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.COMPLETE_NEWHAND_TASK), HandleCompleteNewhandTask);	
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.OPEN_STEP_LEAD_UI), HandleOpenStepLeadUI);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_SHOP_PACK_BTN), HandleClickShopPackBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_SHOP_MALL_BTN), HandleClickShopMallBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.RETURN_TO_TYPE_LIST), HandleReturnToType);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.EXIT_EDIT_HOUSE), HandleExitEditHouse);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.PUTDOWNEND), HandlePutdownEnd);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.PutdownStart), HandlePutdownStart);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_SAVE_FITMENT), HandleClickSaveFitment);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.SELECT_FURNI), HandleSelectFurni);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.SELECT_FURNI_TYPE), HandleSelectFurniType);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.ENTER_FITMENT_UI), HandleEnterFitmentUI);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_FITMENT_BTN), HandleClickFitmentBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.START_NEWHANDTASK_GUIDE), HandleStartNewHandTaskGuide);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASKGUIDEROOT), HandleCloseNewhandTaskGuideRoot);
}

function OnDestroy(){
	if(iGUICode_StorageBoxUI.getInstance()){
		iGUICode_StorageBoxUI.getInstance().auto_fitment_btn.setEnabled(true);
		iGUICode_StorageBoxUI.getInstance().shop_exit_btn.setEnabled(true);
	}
	UnRegistEvt();
}