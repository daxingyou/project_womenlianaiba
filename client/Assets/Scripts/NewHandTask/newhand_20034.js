#pragma strict

var imgset : String[] = new String[1]; 
imgset[0] = "newguide-14.png.u3d";

var timer : Timer = null;

function Awake(){
	RegistEvt();
	timer = new Timer(1000f, 10);
	timer.addEventListener(TimerEvent.TIMER,timerTrigger);
	timer.addEventListener(TimerEvent.TIMER_COMPLETE,timerStop);	
}

function RegistEvt(){
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