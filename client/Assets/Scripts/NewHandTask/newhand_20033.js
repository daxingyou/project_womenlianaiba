#pragma strict

//1,箭头指向物品栏
var arrow_direct : String = "tobottom";
var img_name : String = "tip-28.png.u3d";
var arrow_pos : Vector2 = Vector2(181, 537);
var img_pos : Vector2 = Vector2(-5000, 383);
var lbl_pos_size : Rect = Rect(-5000, 450, 119, 35);

var imgset : String[] = new String[1];
imgset[0] = "newguide-11.png.u3d";

function Awake(){
	RegistEvt();
}

function RegistEvt(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.COMPLETE_NEWHAND_TASK), HandleCompleteNewhandTask);	
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_GOODS_BTN), HandleClickCloseGoodsBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.START_NEWHANDTASK_GUIDE), HandleStartNewHandTaskGuide);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_GOODS_BTN), HandleClickGoodsBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
}

function HandleCompleteNewhandTask(evt : GameEvent, obj : Object){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.EXTENAL_CLOSE_NEWGUIDEWIN));
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

function HandleClickCloseGoodsBtn(evt : GameEvent, obj : Object){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.EXTENAL_CLOSE_NEWGUIDEWIN));
}

function HandleClickGoodsBtn(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
	//
	var param : NewGuideRootParam = new NewGuideRootParam(true, imgset, false, true, Vector2(0,0), false, false);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.START_NEWHANDTASK_GUIDE), param);
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
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.COMPLETE_NEWHAND_TASK), HandleCompleteNewhandTask);	
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_GOODS_BTN), HandleClickCloseGoodsBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.START_NEWHANDTASK_GUIDE), HandleStartNewHandTaskGuide);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_GOODS_BTN), HandleClickGoodsBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
}

function OnDestroy(){
	UnRegistEvt();
}