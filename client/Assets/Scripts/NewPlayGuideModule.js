#pragma strict
#pragma downcast

/*--新手引导模块
分为两个阶段，第一阶段为新玩家初次进入游戏都要运行的游戏介绍，当此阶段运行完毕后不会再出现，若玩家在还没完成第一阶段就退出游戏时，判定为
第一阶段未完成，下次进入游戏时还需重新执行此阶段；
第二阶段，为触发式教程，当执行某一步骤时，触发执行引导，引导执行后则不会再执行，
在此阶段，每个触发点都需要加入是否执行过的标志位，以判断执行状态。若没有执行完一个触发教程就退出，则判定为未完成，下次触发得重新执行一遍。


*/
import iGUI;
import System.IO;

//--是否第一次进入游戏
static var new_play:boolean = true; //每次进入游戏都会根据服务端发送的标志位来设置，在执行完新手第一阶段后要将此标志设置为false传给服务端
//--是否执行新手第一阶段
static var is_run_first:boolean = true;
//--是否执行引导第二阶段
static var is_run_second:boolean = true;

//--第二阶段分两种类型,一种是每步引导，一种是张贴说明图片
public static var LEADTYPE = 0; //--每步引导
public static var TUTORIALTYPE = 1; //显示图片式

//--存储按钮对应的引导类型
public static var btn_match_type_table:Hashtable = new Hashtable(); 
//--存储按钮对应新手标志位
private static var btn_match_flag_table:Hashtable = new Hashtable();
static var imgSet1:Array = new Array();

//1,箭头指向领取奖励按钮 “新手引导”
var arrow_direct : String = "tobottom";
var img_name : String = "tip-1.png.u3d";
var arrow_pos : Vector2 = Vector2(470, 415);
var img_pos : Vector2 = Vector2(400, 265);
var lbl_pos_size : Rect = Rect(-5000, 450, 119, 35);

//--指向关闭任务界面按钮
var arrow_direct1 : String = "totop";
var img_name1 : String = "task-tip.png.u3d";
var arrow_pos1 : Vector2 = Vector2(-5000, 415);
var img_pos1 : Vector2 = Vector2(-5000, 265);
var lbl_pos_size1 : Rect = Rect(-5000, 450, 119, 35);

var newhandtask_pp_interval : int = 60;
var newhandtask_pp_time_length : int = 2;
var newhand_task_start_id : int;
var newhand_task_end_id : int;
var newhand_need_script_start_id : int;
var newhand_need_script_end_id : int;
var need_hide_btns_start_id : int;
var need_hide_btns_end_id : int;
var need_pop_newhandtask_ui_startId : int;
var need_pop_newhandtask_ui_endId : int;

var old_newhand_task_start_id : int;
var old_newhand_task_end_id : int;
var old_newhand_need_script_start_id : int;
var old_newhand_need_script_end_id : int;
var old_need_hide_btns_start_id : int;
var old_need_hide_btns_end_id : int;
var old_need_pop_newhandtask_ui_startId : int;
var old_need_pop_newhandtask_ui_endId : int;

static  var is_notify_newhand_task : boolean = false;
static var cur_newhand_task_id : UInt64 = 0;
public static var CurNewHandSuffix : int = 0;		// 当前新手任务名的后缀
private var newhandscr_prefix : String = "newhand_";
private var newhand_task_go : GameObject = null;
private var had_logon_flag : boolean = false;
var newhand_object_task_go_name : String = "newhand_task_go";
static var complete_newguide_tasks_f : boolean = false;
private var click_home_btn_f : boolean = false;
static var flowerpot_obj : GameObject = null;
//static var flowerpotObjArray : ArrayList = new ArrayList();
static var one_newhand_task_complete_noreward : boolean = false;
static var collect_newhand_flag : boolean = false;
//在更新公告后面打开标识,防止玩家在游戏里手动打开更新公告后重新触发
private var mOpenAfterNoticeUpdateUI : boolean = true;

private static var instance : NewPlayGuideModule = null;
private static var first = true;

static function getInstance() : NewPlayGuideModule{
	return instance;
}

class NewGuideRootParam{
	var flag : boolean;
	var imgset : String[];
	var need_pos : boolean;
	var pos : Vector2;
	var model : boolean;
	var btn_visible : boolean;
	var need_tex_anim : boolean;
	
	function NewGuideRootParam(f : boolean, imgset : String[], m : boolean, need_pos : boolean, p : Object, v : boolean, need_tex_anim : boolean){
		flag = f;
		this.imgset = imgset;
		model = m;
		this.need_pos = need_pos;
		if(need_pos){
			this.pos = p;
		}
		btn_visible = v;
		this.need_tex_anim = need_tex_anim;
	}
}
//--
function Awake()
{
	instance = this;
	RegisetEvt();
	btn_match_type_table.Add("first_start_game",TUTORIALTYPE);
	btn_match_type_table.Add("new_anniversary",TUTORIALTYPE);
	btn_match_type_table.Add("old_anniversary_btn",TUTORIALTYPE);
	btn_match_type_table.Add("love_btn",TUTORIALTYPE);
	btn_match_type_table.Add("goods_btn",TUTORIALTYPE);
	btn_match_type_table.Add("record_btn",TUTORIALTYPE); 
	btn_match_type_table.Add("decorate_btn",TUTORIALTYPE); 
	btn_match_type_table.Add("dress_btn",TUTORIALTYPE);
	btn_match_type_table.Add("action_btn",TUTORIALTYPE);
	btn_match_type_table.Add("marry_btn",TUTORIALTYPE);
	btn_match_type_table.Add("gift_btn",TUTORIALTYPE);
	btn_match_type_table.Add("setting_btn",TUTORIALTYPE);
	//
	btn_match_flag_table.Add("first_start_game",0);
	btn_match_flag_table.Add("new_anniversary",1);
	btn_match_flag_table.Add("old_anniversary_btn",2);
	btn_match_flag_table.Add("love_btn",3);
	btn_match_flag_table.Add("goods_btn",4);
	btn_match_flag_table.Add("record_btn",5); 
	btn_match_flag_table.Add("decorate_btn",6);
	btn_match_flag_table.Add("dress_btn",10);
	btn_match_flag_table.Add("action_btn",11);
	btn_match_flag_table.Add("marry_btn",12);
	btn_match_flag_table.Add("gift_btn",13);
	btn_match_flag_table.Add("setting_btn",14);
}
//--
function RegisetEvt(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOUSE_CREATED), HandleCheckSelfHouseHasFlowerPot);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.ONE_NEWHAND_TASK_COMPLETE_NOREWARD), HandleNewhandTaskCompleteNoreward);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_HOUSE_COMP_LOAD_FINISHED), HandleLoadedFlowerPot);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_FRIEND_HOUSE), HandleEnterFriendHouse);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_RETURN_HOUSE), HandleClickHomeBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_PHOTOFRIENDUI), HandleClosePhotoFriendUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_SELF_HOUSE), HandleEnterSelfHouse);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.COMPLETE_NEWGUIDE_TASKS), HandleCompleteNewGuideTasks);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_TASK_BTN), HandleClickTaskBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.START_NEWHAND_TASK), HandleStartNewHandTask);	
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_ADD_TASK), HandleNotifyAddTask);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_CHAIN_TASK_COMPLETE), HandleNotifyCompleteTask);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_SHOW_NOTICE_OVER), HandleShowNoticeOver);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.POST_lOGONAWARDUI_CLOSE), HandleLogonAwardUIClose);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.COMPLETE_NEWHAND_TASK), HandleCompleteNewhandTask);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_CHAIN_TASK_REWARD), HandleNotifyChainTaskReward);
}

function HandleCheckSelfHouseHasFlowerPot(evt:GameEvent, obj:Object){
	if(!DataCenter.isInSelfHouse())
		return;
	
	if(!obj)
		return;
	
	var hs_info : house_info = obj as house_info;
	var type : int = 0;
	for (var fur : house_furniture in hs_info.furniture_vec){
		if(fur.template_id > 0){
			var itemRow : ItemRow = ResManager.LgtMgr.getItemRow(fur.item_tempid);
			var sub_id : int = itemRow.sub_id;
			var hscompRow : HouseCompRow = ResManager.LgtMgr.getHouseCompRow(sub_id);
			if(hscompRow)
				type = hscompRow.type;
		}
		if(type == 2){
			Task.task_target1_complete_f = true;
			//Send_NewGuideFlags(1, 16);
			break;
		}
		else{
			Task.task_target1_complete_f = false;
			//Send_NewGuideFlags(0, 16);		
		}
	}

}

function HandleNewhandTaskCompleteNoreward(evt:GameEvent, obj:System.Object){
	one_newhand_task_complete_noreward = true;
}

function HandleLoadedFlowerPot(evt:GameEvent, obj:HouseSceneComponent){
	if (2 == obj.CompRow.type){
		flowerpot_obj = obj.ModelObj;
		//flowerpotObjArray.Add(obj.ModelObj);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.POST_NEWFLOWERPOT), flowerpot_obj);
		//EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.POST_NEWFLOWERPOT), flowerpotObjArray);
	}
}

//--
function HandleClickHomeBtn(evt:GameEvent, obj:System.Object){
	click_home_btn_f = true;
}
//--
function HandleEnterFriendHouse(evt:GameEvent, obj:System.Object){
	if(!complete_newguide_tasks_f && cur_newhand_task_id > 0){
		var t : task_info = Task.getInstance().allTasks[Task.getInstance().findTaskIndexByInstID(cur_newhand_task_id)];
		var task_id : int =t.task_id;
		//if(NeedHideBtns(task_id))
			HideFuncBtns(true);
	}		
}
//--
function HandleEnterSelfHouse(evt:GameEvent, obj:System.Object){
	if(!complete_newguide_tasks_f && click_home_btn_f){
		HandleLogonAwardUIClose(evt, obj);
		if(cur_newhand_task_id > 0){
			var t : task_info = Task.getInstance().allTasks[Task.getInstance().findTaskIndexByInstID(cur_newhand_task_id)];
			var task_id : int =t.task_id;
			if(NeedHideBtns(task_id))
			HideFuncBtns(false);
		}
	}
	click_home_btn_f = false;
}
//--
function HandleClosePhotoFriendUI(evt:GameEvent, obj:System.Object){
	
}
//--
private function HandleCloseNewHandTaskUI(evt : GameEvent, obj : Object) {
	UI.getUI().CloseNewGuideLeadRoot();
	/*
	var ins_task_id : UInt64 = Convert.ToUInt64(obj);
	var t : task_info = Task.getInstance().allTasks[Task.getInstance().findTaskIndexByInstID(ins_task_id)] as task_info;
	var task_id : int = t.task_id;
	if(task_id >= need_hide_btns_start_id && first){
		YYChannelListLogic.getInstance().initChannelList();
		first = false;	
	} 
	*/
}
//--
function HandleCompleteNewGuideTasks(evt : GameEvent, obj : Object){
	HandleAfterLogin.playerGuideFlags[15] = 1;
	Send_NewGuideFlags(1, 15);
	complete_newguide_tasks_f = true;
}
//--
function HandleClickTaskBtn(evt : GameEvent, obj : Object){
	//if(DataCenter.isInSelfHouse()){
		var ins_task_id : UInt64 = Convert.ToUInt64(obj);
		var t : task_info = Task.getInstance().allTasks[Task.getInstance().findTaskIndexByInstID(ins_task_id)];
		var task_id : int =t.task_id;
		var type : int = t.type;
		if(IsNewHandTask(task_id, type)){
			CreateNewHandGameObject(task_id);
		}
	
		if(/*(task_id >= newhand_task_start_id || task_id >= old_newhand_task_start_id ) && (task_id < need_hide_btns_start_id || task_id < old_need_hide_btns_start_id) && */type == task_type.tt_chain){
			if(t.complete_date.year != 0 && t.reward_date.year == 0){	//已经完成任务, 且未领取
				UI.getUI().CloseNewGuideLeadRoot();
				UI.getUI().OpenNewGuideLeadRoot();
				iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos, img_pos, lbl_pos_size, arrow_direct, img_name, 3);		
			}
			else if(t.complete_date.year == 0){
				UI.getUI().CloseNewGuideLeadRoot();
				UI.getUI().OpenNewGuideLeadRoot();
				iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos1, img_pos1, lbl_pos_size1, arrow_direct1, img_name1, 3);		
			}
		}
	//}
}
//--
function HandleNotifyChainTaskReward(evt : GameEvent, ins_task_id : UInt64){
	var t : task_info = Task.getInstance().allTasks[Task.getInstance().findTaskIndexByInstID(ins_task_id)];
	var task_id : int =t.task_id;
	var type : int = t.type;
	if(IsNewHandTask(task_id, type)){
		var newhand_scr : String = newhandscr_prefix + task_id.ToString();
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLOSE_STEP_LEAD_UI));
		//
		iGUICode_TaskUI.getInstance().CommTaskClose.passive = false;
		UI.getUI().CloseNewGuideLeadRoot();
		
		RemoveNewhandTaskScr(newhand_scr);
		var pp : PaoPaoControl = PaoPaoControl.GetPpCtrol(iGUICode_MainUI.getInstance().taskTipPP_Newhand);
		if(pp)
			pp.StopPpTimer();
	}
}
//--
function HandleShowNoticeOver(evt : GameEvent, obj : Object){
	if (!mOpenAfterNoticeUpdateUI || 0 == HandleAfterLogin.playerGuideFlags.Count)
		return;
	
	mOpenAfterNoticeUpdateUI = false;
	if(obj != 1 && HandleAfterLogin.playerGuideFlags[0] == 0){
		Run_GuideFirst(true);
	}

	if((obj != 1 && obj != 2) && HandleAfterLogin.playerGuideFlags[0] != 0 && is_notify_newhand_task){
		//还要判断是否已经接到新手任务
		//新手任务事件
		if(cur_newhand_task_id > 0)
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.START_NEWHAND_TASK), cur_newhand_task_id);
	}
}
//--
function HandleLogonAwardUIClose(evt : GameEvent, obj : Object){
	if (0 == HandleAfterLogin.playerGuideFlags.Count)
		return;
	
	had_logon_flag = true;
	if(HandleAfterLogin.playerGuideFlags[0] == 0){
		Run_GuideFirst(true);
	}
	if(HandleAfterLogin.playerGuideFlags[0] != 0 && is_notify_newhand_task){
		//还要判断是否已经接到新手任务
		//新手任务事件
		if(cur_newhand_task_id > 0)
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.START_NEWHAND_TASK), cur_newhand_task_id);
	}
}
//--
static function IsInNewHandTasks() : boolean{
	return is_notify_newhand_task && !complete_newguide_tasks_f;
}

//--
function HandleNotifyAddTask(evt : GameEvent, obj : Object){
	var ins_task_id : UInt64 = Convert.ToUInt64(obj);
	var t : task_info = Task.getInstance().allTasks[Task.getInstance().findTaskIndexByInstID(ins_task_id)];
	var task_id : int =t.task_id;
	var type : int = t.type;
	var task_id_desc : String = task_id.ToString();
	if(task_id_desc.StartsWith("1")){
		if(task_id >= old_need_hide_btns_start_id && type == task_type.tt_chain){
			complete_newguide_tasks_f = true;
		}	
	}
	else{
		if(task_id >= need_hide_btns_start_id && type == task_type.tt_chain){
			complete_newguide_tasks_f = true;
		}
	}
	if(IsNewHandTask(task_id, type)){
		is_notify_newhand_task = true;
		if(t.complete_date.year == 0){
			if(PaoPaoControl.GetPpCtrol(iGUICode_MainUI.getInstance().noCompletedtaskTipPP_Newhand) == null)
				new PaoPaoControl(90000,0,2000,1,iGUICode_MainUI.getInstance().noCompletedtaskTipPP_Newhand, iGUICode_MainUI.getInstance().TaskBtn1);
		}
		if(t.complete_date.year != 0 && t.reward_date.year == 0){
			if(PaoPaoControl.GetPpCtrol(iGUICode_MainUI.getInstance().taskTipPP_Newhand) == null)
				new PaoPaoControl(newhandtask_pp_interval * 1000,0,newhandtask_pp_time_length * 1000,1,iGUICode_MainUI.getInstance().taskTipPP_Newhand, iGUICode_MainUI.getInstance().TaskBtn1);
		}
		cur_newhand_task_id = ins_task_id;
		if(!complete_newguide_tasks_f){
			if(NeedHideBtns(task_id) && DataCenter.isInSelfHouse())
				HideFuncBtns(false);
		}
		var task_id_str : String = cur_newhand_task_id.ToString();
		if(task_id_str.StartsWith("2") && cur_newhand_task_id < 20018){
			iGUICode_MainUI.getInstance().party_btn.setEnabled(false);
		}

		if(had_logon_flag && cur_newhand_task_id > 0){
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.START_NEWHAND_TASK), cur_newhand_task_id);
		}
	}
}
//--
function NeedHideBtns(task_id : int):boolean{
	var task_id_desc : String = task_id.ToString();
	if(task_id_desc.StartsWith("1")){
		if(task_id >= old_need_hide_btns_start_id && task_id <= old_need_hide_btns_end_id){
			return false;
		}
	}
	else{
		if(task_id >= need_hide_btns_start_id && task_id <= need_hide_btns_end_id){
			return false;
		}	
	}
	return true;
}
//--
function HandleNotifyCompleteTask(evt : GameEvent, obj : Object){
	var ins_task_id : UInt64 = Convert.ToUInt64(obj);
	var t : task_info = Task.getInstance().allTasks[Task.getInstance().findTaskIndexByInstID(ins_task_id)];
	var task_id : int =t.task_id;
	var type : int = t.type;
	var pp : PaoPaoControl = PaoPaoControl.GetPpCtrol(iGUICode_MainUI.getInstance().noCompletedtaskTipPP_Newhand);
	if(pp)
		pp.StopPpTimer();
	if((task_id == 20010 || task_id == 10005) && type == 2){
		CompleteNewGuideTasks();
	}
	if(IsNewHandTask(task_id, type) && (t.complete_date.year != 0 && t.reward_date.year == 0)){
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.COMPLETE_NEWHAND_TASK), ins_task_id);
		if(PaoPaoControl.GetPpCtrol(iGUICode_MainUI.getInstance().taskTipPP_Newhand) == null)
			new PaoPaoControl(newhandtask_pp_interval * 1000,0,newhandtask_pp_time_length * 1000,1,iGUICode_MainUI.getInstance().taskTipPP_Newhand, iGUICode_MainUI.getInstance().TaskBtn1);
	}
}

function CompleteNewGuideTasks(){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.COMPLETE_NEWGUIDE_TASKS));
}
//--
function HandleCompleteNewhandTask(evt : GameEvent, obj : Object){
	var ins_task_id : UInt64 = Convert.ToUInt64(obj);
	var t : task_info = Task.getInstance().allTasks[Task.getInstance().findTaskIndexByInstID(ins_task_id)];
	var task_id : int =t.task_id;
	var type : int = t.type;
	if(t.complete_date.year != 0 && t.reward_date.year == 0){
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.ONE_NEWHAND_TASK_COMPLETE_NOREWARD));
	}
	if(NeedPopNewhandTaskUI(task_id)){
		Task.getInstance().openCommTaskUI(ins_task_id);
		//EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.OPEN_STEP_LEAD_UI));
		
		if((task_id >= newhand_task_start_id || task_id >= old_newhand_task_start_id ) && (task_id < need_hide_btns_start_id || task_id < old_need_hide_btns_start_id) && type == task_type.tt_chain){
			iGUICode_TaskUI.getInstance().CommTaskClose.passive = true;
			UI.getUI().CloseNewGuideLeadRoot();
			UI.getUI().OpenNewGuideLeadRoot();
			iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos, img_pos, lbl_pos_size, arrow_direct, img_name, 3);
		}
	}
}
//--
function NeedPopNewhandTaskUI(id : int):boolean{
	if((id >= need_pop_newhandtask_ui_startId || id >= old_need_pop_newhandtask_ui_startId) && (id <= need_pop_newhandtask_ui_endId || id <= old_need_pop_newhandtask_ui_endId))
		return true;
	
	return false;
}
//--
function IsNewHandTask(task_id : int, type : int) : boolean{
	if((task_id >= newhand_task_start_id || task_id >= old_newhand_task_start_id) && (task_id <= newhand_task_end_id || task_id <= old_newhand_task_end_id) && type == task_type.tt_chain){
		return true;
	}
	else{
		return false;
	}
}
//--
function HandleStartNewHandTask(evt : GameEvent, obj : Object){
	//if(DataCenter.isInSelfHouse()){
		//自动弹出任务描述窗口
		var ins_task_id : UInt64 = Convert.ToUInt64(obj);
		var t : task_info = Task.getInstance().allTasks[Task.getInstance().findTaskIndexByInstID(ins_task_id)];
		var task_id : int =t.task_id;
		var type : int = t.type;
		Task.getInstance().openCommTaskUI(ins_task_id);
		one_newhand_task_complete_noreward = false;
		//抛出新手任务目标完成但未领取奖励事件
		if(t.complete_date.year != 0 && t.reward_date.year == 0){
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.ONE_NEWHAND_TASK_COMPLETE_NOREWARD));
		}
		//寻找新手任务ID相应的脚本
		if(t.complete_date.year == 0 ||(t.complete_date.year != 0 && t.reward_date.year == 0)){
			CreateNewHandGameObject(task_id);
		}
		//
		if(/*(task_id >= newhand_task_start_id || task_id >= old_newhand_task_start_id ) && (task_id < need_hide_btns_start_id || task_id < old_need_hide_btns_start_id) &&*/ type == task_type.tt_chain){
			if(t.complete_date.year != 0 && t.reward_date.year == 0){	//已经完成任务, 且未领取
				UI.getUI().CloseNewGuideLeadRoot();
				UI.getUI().OpenNewGuideLeadRoot();
				iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos, img_pos, lbl_pos_size, arrow_direct, img_name, 3);		
			}
			else if(t.complete_date.year == 0){
				UI.getUI().CloseNewGuideLeadRoot();
				UI.getUI().OpenNewGuideLeadRoot();
				iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos1, img_pos1, lbl_pos_size1, arrow_direct1, img_name1, 3);		
			}
		}
	//}
}
//--
private function _NeedNewhandScript(task_id : int):boolean{
	if((task_id >=newhand_need_script_start_id || task_id >=old_newhand_need_script_start_id) && (task_id <= newhand_need_script_end_id || task_id <= old_newhand_need_script_end_id))
		return true;
	
	return false;
}
//--
function CreateNewHandGameObject(task_id : int){
	if(!_NeedNewhandScript(task_id))
		return;
	
	if(newhand_task_go == null){
		newhand_task_go = new GameObject(newhand_object_task_go_name);
	}
	var newhand_scr : String = newhandscr_prefix + task_id.ToString();
	AddNewhandTaskScr(newhand_scr);
	CurNewHandSuffix = task_id;
}
//--
function RemoveNewhandTaskScr(scr_name : String){
	if(newhand_task_go){
		var scr : Component = newhand_task_go.GetComponent(scr_name);
		if(scr != null){
			Destroy(scr);
			CurNewHandSuffix = 0;
		}
	}
}
//--
function AddNewhandTaskScr(scr_name : String){
	if(newhand_task_go){
		if(newhand_task_go.GetComponent(scr_name) == null)
			newhand_task_go.AddComponent(scr_name);
	}
}
//--第一阶段入口，flag:是否第一次进入游戏，参数如果为false，则表示不用执行新手第一阶段，直接跳入判断第二阶段
function Run_GuideFirst(flag:boolean)
{
	new_play = flag;
	if(!new_play)//不是新手不用执行引导
	{
		return;
	}
	else
	{
		RunNewGuide(null);
	}
}
//--确认框回调,执行新手回调
private function RunNewGuide(caller:iGUIElement)
{
	is_run_first = false;
	if(!is_run_first)//如果设置成不用执行此阶段，也跳过。
		return;
	else
	{
		//进入执行新手第一阶段步骤
		//_LoadIcons();
		StartNewGUideFrist();
		//EndNewGuideSecondTutorial("first_start_game");
	}
}
/*
//--不执行新手回调
private function cancelRunNewGuide(caller:iGUIElement)
{
	Debug.Log("=======================跳过第一阶段===========================");
	EndNewGuideFirst();
}
//--执行完新手第一阶段要运行的函数接口
function NewGuideFrist_RunOk()
{
		new_play = false;
		//向服务端发送新手第一阶段完成的标志
		var flag:int = 1;
		Send_NewGuideFlags(flag,0);
}
*/
//--服务端发送新手阶段完成的标志
function Send_NewGuideFlags(flag:int,pos:int)
{
	if(pos < HandleAfterLogin.playerGuideFlags.Count)
		HandleAfterLogin.playerGuideFlags[pos] = flag;
	
	var req:req_update_player_guide = new req_update_player_guide();
	req.flags = HandleAfterLogin.playerGuideFlags;
	NetHelper.Send(req);
}
//--开始进入新手引导第一阶段
public function StartNewGUideFrist()
{
	UI.getUI().OpenNewGuideModalRoot();
	//iGUICode_NewGuideModalRoot.getInstance().OpenNewGuideWin();
	StartNewGuideSecond("first_start_game");
}
/*
//--结束新手引导第一阶段
public function EndNewGuideFirst()
{
	UI.getUI().CloseNewGuideModalRoot();
	NewGuideFrist_RunOk();
}
*/
//--结束新手引导第二阶段某个按钮的引导
public function EndNewGuideSecondTutorial(name:String)
{
	UI.getUI().CloseNewGuideModalRoot();
	if(name != null && name != ""){
		if(name != "dress_btn" && name != "action_btn" && name != "marry_btn" && name != "gift_btn" && name != "setting_btn")
		{
			var pos:int = btn_match_flag_table.Item[name];
			if(pos == null)
			{
				Debug.LogWarning("***********没有找到相应按钮的新手类型************");
				return;
			}
			Send_NewGuideFlags(1,pos);
		}
	}
}
//
public function EndNewGuideSecondLead(name:String)
{
	UI.getUI().SetElementPassive(false,"shop_goods1_cover","StorageBoxUI",false);
	UI.getUI().CloseNewGuideLeadRoot();
	if(name != null && name != ""){
		var pos:int = btn_match_flag_table.Item[name];
		if(pos == null)
		{
			Debug.LogWarning("***********没有找到相应按钮的新手类型************");
			return;
		}
		Send_NewGuideFlags(1,pos);
	}
}
//--开始进入第二阶段
public function StartNewGuideSecond(name:String)
{
	if(name == "shop_goods9_cover")
		return;
	if(btn_match_type_table.Item[name] == null){
		return;
	}
	var guide_type = btn_match_type_table.Item[name];
	var _idx : int = btn_match_flag_table.Item[name];
	if(_idx >= HandleAfterLogin.playerGuideFlags.Count){
		Debug.LogWarning("IDX OUT OF RANGE ---playerGuideFlags");
		return;
	}
	var guide_flag = HandleAfterLogin.playerGuideFlags[_idx];
	if(guide_flag == 1)
	{
		 return;
	}
	if(guide_type == null)
	{
		Debug.LogWarning("***************新手第二阶段引导类型匹配表对应数据为空*****************");	
		return;
	}
	switch(guide_type)
	{
		case TUTORIALTYPE:
			UI.getUI().OpenNewGuideModalRoot();
			iGUICode_NewGuideModalRoot.getInstance().Tutorial_ShowPic(name);
			break;
		case LEADTYPE:
			UI.getUI().OpenNewGuideModalRoot();
			iGUICode_NewGuideModalRoot.getInstance().Tutorial_ShowPic(name);
			break;
	}
}

static function HideFuncBtns(flag : boolean){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.HIDE_FUNC_BTNS), flag);
}