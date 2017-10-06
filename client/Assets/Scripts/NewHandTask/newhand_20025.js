#pragma strict

//1,箭头指向桃子
var arrow_direct : String = "toleft";
var img_name : String = "tip-28.png.u3d";
var arrow_pos : Vector2 = Vector2(659, 276);
var img_pos : Vector2 = Vector2(-5000, 383);
var lbl_pos_size : Rect = Rect(-5000, 450, 119, 35);

var imgset : String[] = new String[1]; 
imgset[0] = "newguide-16.png.u3d";

var timer : Timer = null;
var match_crop_id : int = 220002;

function Awake(){
	RegistEvt();
	timer = new Timer(1000f, 10);
	timer.addEventListener(TimerEvent.TIMER,timerTrigger);
	timer.addEventListener(TimerEvent.TIMER_COMPLETE,timerStop);	
}

function RegistEvt(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CHECK_SEED_CROP_ID), HandleCheckSeedCropId);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_SEED), HandleClickSeed);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_BACKPACKUI), HandleClickCloseBackPackUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_PLANT), HandleClickPlant);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_FLOWERPOT), HandleClickFlowerPot);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICKON_FURNITURE), HandleClickOnFurniture);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.START_NEWHANDTASK_GUIDE), HandleStartNewHandTaskGuide);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
}

//--
private function timerTrigger(_timer:Timer,obj:Object){

}

//--
private function timerStop(_timer:Timer,obj:Object){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.EXTENAL_CLOSE_NEWGUIDEWIN));
}

function HandleCheckSeedCropId(evt : GameEvent, obj : Object){
	//match_crop_id
	var has_match_crop : boolean = false;
	var list : ArrayList = obj as ArrayList;
	if(list == null || list.Count == 0)
		return;
	for(var i=0; i<list.Count; i++) {
		var data : PlantSeedRow = list[i] as PlantSeedRow;
		if(data == null) 
			continue;
		if(data.crop_id == match_crop_id){
			has_match_crop = true;
			break;
		}
	}
	if(has_match_crop){
		UI.getUI().CloseNewGuideLeadRoot();
		UI.getUI().OpenNewGuideLeadRoot();
		iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos, img_pos, lbl_pos_size, arrow_direct, img_name, 80);	
	}else{
		UI.getUI().CloseNewGuideLeadRoot();
	}
}

function HandleClickSeed(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
	//UI.getUI().OpenNewGuideLeadRoot();
	//iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos6, img_pos6, lbl_pos_size6, arrow_direct6, img_name6, 1);	
}

function HandleClickCloseBackPackUI(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
}

function HandleClickPlant(evt : GameEvent, obj : Object){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.EXTENAL_CLOSE_NEWGUIDEWIN));
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos, img_pos, lbl_pos_size, arrow_direct, img_name, 80);
}

function HandleClickFlowerPot(evt : GameEvent, obj : Object){
	//EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.EXTENAL_CLOSE_NEWGUIDEWIN));
	//has_click_pot = true;
	//UI.getUI().CloseNewGuideLeadRoot();
	//UI.getUI().OpenNewGuideLeadRoot();
	//iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos, img_pos, lbl_pos_size, arrow_direct, img_name, 80);
}

function HandleClickOnFurniture(evt : GameEvent, obj : Object){
	if(!DataCenter.isInSelfHouse())
		return;
	
	if(!obj){
		//UI.getUI().CloseNewGuideLeadRoot();
		return;
	}
		
	var hsc : HouseSceneComponent = obj as HouseSceneComponent;
	var idx : int = hsc.CompId;
	var hscompRow : HouseCompRow = ResManager.LgtMgr.getHouseCompRow(idx);
	var type : int = 0;
	if(hscompRow)
		type = hscompRow.type;
	
	if(type == 2){
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_FLOWERPOT));
	}
	else{
		//has_click_pot = false;
		//UI.getUI().CloseNewGuideLeadRoot();
	}
}

function HandleStartNewHandTaskGuide(evt : GameEvent, obj : Object){
	var param : NewGuideRootParam = obj as NewGuideRootParam;
	var imgset : String[] = param.imgset;
	var need_pos : boolean = param.need_pos;
	var pos : Vector2 = param.pos;
	var btn_visible : boolean = param.btn_visible;
	iGUICode_NewhandTaskGuide.OpenNewhandTaskGuideRoot(param.flag, param.model);
	iGUICode_NewhandTaskGuide.getInstance().NewhandTaskGuide_ShowPic(imgset, need_pos, pos, btn_visible, param.need_tex_anim);
	if(timer)
		timer.Start();
}

function HandleClickSpeakerBtn(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
}

function HandleCloseNewHandTaskUI(evt : GameEvent, obj : Object){
	var ins_task_id : UInt64 = Convert.ToUInt64(obj);
	var t : task_info = Task.getInstance().allTasks[Task.getInstance().findTaskIndexByInstID(ins_task_id)] as task_info;
	if(t.complete_date.year != 0 && t.reward_date.year == 0){	//已经完成任务, 且未领取
	
	}
	else if(t.complete_date.year == 0){
		var param : NewGuideRootParam = new NewGuideRootParam(true, imgset, false, true, Vector2(0,0), false, false);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.START_NEWHANDTASK_GUIDE), param);
	}
}

function UnRegistEvt(){
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CHECK_SEED_CROP_ID), HandleCheckSeedCropId);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_SEED), HandleClickSeed);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_BACKPACKUI), HandleClickCloseBackPackUI);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_PLANT), HandleClickPlant);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_FLOWERPOT), HandleClickFlowerPot);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICKON_FURNITURE), HandleClickOnFurniture);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.START_NEWHANDTASK_GUIDE), HandleStartNewHandTaskGuide);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
}

function OnDestroy(){
	UnRegistEvt();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.EXTENAL_CLOSE_NEWGUIDEWIN));
	if(timer){
		timer.removeEventListener(TimerEvent.TIMER);
		timer.removeEventListener(TimerEvent.TIMER_COMPLETE);
		timer = null;
	}
}