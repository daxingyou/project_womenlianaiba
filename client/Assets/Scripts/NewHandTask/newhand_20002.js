//爱的小精灵

function Awake(){
	RegistEvt();
}

function RegistEvt(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.ONE_NEWHAND_TASK_COMPLETE_NOREWARD), HandleCopleteNoReward);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_SPRITE), HandleClickSprite);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.START_NEWHANDTASK_GUIDE), HandleStartNewHandTaskGuide);
}

function HandleCopleteNoReward(evt : GameEvent, obj : Object){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.EXTENAL_CLOSE_NEWGUIDEWIN));
}

function HandleClickSprite(evt : GameEvent, obj : Object){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.EXTENAL_CLOSE_NEWGUIDEWIN));
}

function HandleCloseNewHandTaskUI(evt : GameEvent, obj : Object){
	var ins_task_id : UInt64 = Convert.ToUInt64(obj);
	var t : task_info = Task.getInstance().allTasks[Task.getInstance().findTaskIndexByInstID(ins_task_id)] as task_info;
	if(t.complete_date.year != 0 && t.reward_date.year == 0){	//已经完成任务, 且未领取
	
	}
	else if(t.complete_date.year == 0){
		var imgset : String[] = new String[1];
		imgset[0] = "newguide-9.png.u3d";
		var param : NewGuideRootParam = new NewGuideRootParam(true, imgset, false, true, Vector2(0,0), false, true);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.START_NEWHANDTASK_GUIDE), param);
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
}

function UnRegistEvt(){
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.ONE_NEWHAND_TASK_COMPLETE_NOREWARD), HandleCopleteNoReward);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_SPRITE), HandleClickSprite);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.START_NEWHANDTASK_GUIDE), HandleStartNewHandTaskGuide);
}

function OnDestroy(){
	UnRegistEvt();
}