/*
//bubble manager
//creat by fullzhu 2012.3.28
//last edit at 2012.3.28 by fullzhu
*/
#pragma strict
#pragma downcast
import iGUI;

class PPItemClass{
	var pp_ele : iGUIElement;
	var host_ele : iGUIElement;
	
	function PPItemClass(pp : iGUIElement, host : iGUIElement){
		pp_ele = pp;
		host_ele = host;
	}
}
//var randomBubbleArray : GameObject[];

private var mVisible : boolean = false;
private var mInit : boolean = false;
private var mRandomArray : Array = new Array();				//struct gameobject
private var mBubblectrl : PaoPaoControl;

private static var instance : BubbleTipMgr;
function Awake(){
	instance=this;
	//DAIYLY_TASK_REWARD
	//DAIYLY_TASK_COMPLETE
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.DAIYLY_TASK_REWARD), HandlePopTaskTipPp);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.DAIYLY_TASK_COMPLETE), HandlePopNoCompleteTaskTipPp);
}
static function GetInstance(){
	return instance;
}

public function Init() {
	mRandomArray.Add(PPItemClass(iGUICode_MainUI.getInstance().wishTipPP, iGUICode_MainUI.getInstance().wishing_btn));
	mRandomArray.Add(PPItemClass(iGUICode_MainUI.getInstance().TipPPNote, iGUICode_MainUI.getInstance().love_btn));
	mRandomArray.Add(PPItemClass(iGUICode_MainUI.getInstance().TipPPMessage, iGUICode_MainUI.getInstance().record_btn));
	//mRandomArray.Add(iGUICode_MainUI.getInstance().TipPPFollow);
	
	mInit = true;
}

public function IsVisible() : boolean {
	return mVisible;
}

public function ShowRandom() {
	if(mBubblectrl) {
		DisableCtrl();
		mBubblectrl.ResetPpTimer();
		mBubblectrl = null;
	}
	if(mRandomArray.Count >0) {
		var random_num : int = Random.Range(0,mRandomArray.Count);
		var pp_item : PPItemClass = mRandomArray[random_num] as PPItemClass;
		mBubblectrl = new PaoPaoControl(2000, 1, 10000, 1, pp_item.pp_ele, pp_item.host_ele);
	}
}

//--
function DisableCtrl(){
	for(var obj : Object in mRandomArray){
		var ele : iGUIElement = obj as iGUIElement;
		if(ele && ele.enabled){
			ele.setWidth(0);
			ele.setHeight(0);
			ele.setEnabled(false);
		}
	}
}

//data operator
function SetVisible(visible : boolean) {
	mVisible = visible;
}
//--
function HandlePopTaskTipPp(evt : GameEvent, obj : Object){
	var has_reward : boolean = obj;
	if(has_reward){
		if(PaoPaoControl.GetPpCtrol(iGUICode_MainUI.getInstance().taskTipPP))
			PaoPaoControl.GetPpCtrol(iGUICode_MainUI.getInstance().taskTipPP).StopPpTimer();
	}
	else{
		if(!PaoPaoControl.GetPpCtrol(iGUICode_MainUI.getInstance().taskTipPP))
			new PaoPaoControl(3000,0,2000,1,iGUICode_MainUI.getInstance().taskTipPP, iGUICode_MainUI.getInstance().DailyTaskBtn);
		if(PaoPaoControl.GetPpCtrol(iGUICode_MainUI.getInstance().noCompletedtaskTipPP))
			PaoPaoControl.GetPpCtrol(iGUICode_MainUI.getInstance().noCompletedtaskTipPP).StopPpTimer();
	}
}
//--
function HandlePopNoCompleteTaskTipPp(evt : GameEvent, flag : boolean){
	if(flag){
		if(!PaoPaoControl.GetPpCtrol(iGUICode_MainUI.getInstance().noCompletedtaskTipPP))
			new PaoPaoControl(120000,0,5000,1,iGUICode_MainUI.getInstance().noCompletedtaskTipPP, iGUICode_MainUI.getInstance().DailyTaskBtn);
		if(PaoPaoControl.GetPpCtrol(iGUICode_MainUI.getInstance().taskTipPP))
			PaoPaoControl.GetPpCtrol(iGUICode_MainUI.getInstance().taskTipPP).StopPpTimer();
	}
	else{
		if(PaoPaoControl.GetPpCtrol(iGUICode_MainUI.getInstance().noCompletedtaskTipPP))
			PaoPaoControl.GetPpCtrol(iGUICode_MainUI.getInstance().noCompletedtaskTipPP).StopPpTimer();
	}
}