#pragma strict

//指向家装按钮“新手引导”
var arrow_direct : String = "tobottom";
var img_name : String = "tip-22.png.u3d";
var arrow_pos : Vector2 = Vector2(53, 510);
var img_pos : Vector2 = Vector2(25, 358);
var lbl_pos_size : Rect = Rect(-5000, 550, 40, 40);

//指向物品按钮
var arrow_direct1 : String = "tobottom";
var img_name1 : String = "tip-14.png.u3d";
var arrow_pos1 : Vector2 = Vector2(16, 507);
var img_pos1 : Vector2 = Vector2(25, 358);
var lbl_pos_size1 : Rect = Rect(-5000, 168, 51, 59);

//指向花盆图标
var arrow_direct2 : String = "tobottom";
var img_name2 : String = "tip-15.png.u3d";
var arrow_pos2 : Vector2 = Vector2(693, 507);
var img_pos2 : Vector2 = Vector2(532, 358);
var lbl_pos_size2 : Rect = Rect(-5000, 168, 51, 59);

//指向保存按钮
var arrow_direct3 : String = "tobottom";
var img_name3 : String = "task-tip.png.u3d";
var arrow_pos3 : Vector2 = Vector2(575, 420);
var img_pos3 : Vector2 = Vector2(-5000, 85);
var lbl_pos_size3 : Rect = Rect(-5000, 550, 40, 40);

//指向环形菜单 种植按钮
var arrow_direct4 : String = "tobottom";
var img_name4 : String = "plant.png.u3d";
var arrow_pos4 : Vector2 = Vector2(-5000, 420);
var img_pos4 : Vector2 = Vector2(14, 0);
var lbl_pos_size4 : Rect = Rect(-5000, 550, 40, 40);

//指向种子
var arrow_direct5 : String = "toleft";
var img_name5 : String = "task-tip.png.u3d";
var arrow_pos5 : Vector2 = Vector2(227, 253);
var img_pos5 : Vector2 = Vector2(-5000, 85);
var lbl_pos_size5 : Rect = Rect(-5000, 550, 40, 40);

//指向确定种植按钮
var arrow_direct6 : String = "tobottom";
var img_name6 : String = "task-tip.png.u3d";
var arrow_pos6 : Vector2 = Vector2(-5000, 188);
var img_pos6 : Vector2 = Vector2(-5000, 85);
var lbl_pos_size6 : Rect = Rect(-5000, 550, 40, 40);

static var flowerpot_obj : GameObject = null;
private var attachEffect_Pot : FlowerPot = null;
private var loaded_effect : boolean = false;
private var has_selected_pot : boolean = false;
private var has_putdown_pot : boolean = false;
private var has_putdown_saved : boolean = false;
public static var PLANT_DIR:String = "Model/Plant/";
private var has_click_pot : boolean = false;
private var has_complete_this_task : boolean = false;
private var undo_recycle_furni_flag : boolean = false;
private var has_click_plant_btn : boolean = false;
private var has_click_seed : boolean = false;
private var backpack_opened : boolean = false;
function Awake () {
	RegistEvt();
	iGUICode_MainUI.getInstance().fitment_btn.setEnabled(true);
}

function RegistEvt () {
	//MSG_NOTIFY_LEAVE_SCENE
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.BACKPACK_OPENDED), HandleOpenBackPack);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICKON_OUTSIDEHOUSE), HandleClickOutSideHouse);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.UNDO_RECYCLE_FURNI), HandleUndoRecycleFurni);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.ROTATE_CAMERA), HandleClickPlantFuncBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.POST_NEWFLOWERPOT), HandlePostNewFlowerPot);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.FURNIINTERACTUI_UNENABLED), HandleUnenableFurniInteractUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_RECYCLEFURNI_BTN), HandleClickRecycleFurniBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.EXIT_EDIT_HOUSE), HandleExitEditHouse);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.UNSELECT_PACK_FURNI), HandleUnSelectPackFurni);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.SELECT_PACK_FLOWERPOT), HandleSelectPackFlowerPot);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.SELECT_PACK_FURNI), HandleSelectPackFurni);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_SHOP_PACK_BTN), HandleClickShopPackBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_BACKPACKUI), HandleClickCloseBackPackUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CANCEL_PLANT), HandleClickCancelPlant);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_SurePlant), HandleClickSurePlant);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_SEED), HandleClickSeed);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.BACKPACK_CLICKED), HandleClickBackPack);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_PLANT), HandleClickPlant);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_REMOVEPLANT), HandleClickPlantFuncBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_HARVEST), HandleClickPlantFuncBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_WATER), HandleClickPlantFuncBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_FERTILIZE), HandleClickPlantFuncBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICKON_FURNITURE), HandleClickOnFurniture);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_FLOWERPOT), HandleClickFlowerPot);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_SELF_HOUSE), HandleLeaveSelfHouse);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_COMMON_SCENE), HandleLeaveSelfHouse);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_FRIEND_HOUSE), HandleLeaveSelfHouse);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_SAVE_FITMENT), HandleClickSaveFitment);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.PUTDOWNEND), HandlePutdownEnd);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.START_NEWHANDTASK_GUIDE), HandleStartNewHandTaskGuide);
	//EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.SELECT_FURNI), HandleSelectFurni);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.ENTER_FITMENT_UI), HandleEnterFitmentUI);
	//EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.SELECT_FURNI_TYPE), HandleSelectFurniType);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_FITMENT_BTN), HandleClickFitmentBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_ITEMS_MAKE_BTN), HandleClickItemsMakeBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
}

function HandleOpenBackPack(evt : GameEvent, obj : Object){
	backpack_opened = true;
}

function HandleUnenableFurniInteractUI(evt : GameEvent, obj : Object){
	if(!DataCenter.isInSelfHouse())
		return;
	
	//has_click_pot = false;
	has_click_plant_btn = false;
}

function HandleClickOutSideHouse(evt : GameEvent, obj : Object){
	if(!DataCenter.isInSelfHouse())
		return;
	
	if(!Task.task_target1_complete_f)
		return;
		
	if(has_click_plant_btn || has_click_seed || backpack_opened)
		return;
	
	has_click_pot = false;
	UI.getUI().CloseNewGuideLeadRoot();
}

function HandleUndoRecycleFurni(evt : GameEvent, obj : Object){
	var _flag : boolean = Convert.ToBoolean(obj);
	undo_recycle_furni_flag = _flag;
}

function HandlePostNewFlowerPot(evt : GameEvent, obj : Object){
	if(!flowerpot_obj)
		flowerpot_obj = obj as GameObject;
}

function HandleClickRecycleFurniBtn(evt : GameEvent, obj : Object){
	has_selected_pot = false;
	RemoveEffect();
}

function HandleExitEditHouse(evt : GameEvent, obj : Object){
	if(has_selected_pot && has_putdown_pot && has_putdown_saved){
		Task.task_target1_complete_f = true;
		NewPlayGuideModule.getInstance().Send_NewGuideFlags(1, 16);
	}
	else{
		if(!flowerpot_obj && !undo_recycle_furni_flag){
			Task.task_target1_complete_f = false;
			NewPlayGuideModule.getInstance().Send_NewGuideFlags(0, 16);
			undo_recycle_furni_flag = false;
		}
	}
	if(Task.task_target1_complete_f || HandleAfterLogin.playerGuideFlags[16] == 1){
		UI.getUI().CloseNewGuideLeadRoot();
	}
	else{
		UI.getUI().CloseNewGuideLeadRoot();
		UI.getUI().OpenNewGuideLeadRoot();
		iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos, img_pos, lbl_pos_size, arrow_direct, img_name, 80);	
	}
	
	//has_selected_pot = false;
	//has_putdown_pot = false;
	//has_putdown_saved = false;
}

function HandleUnSelectPackFurni(evt : GameEvent, obj : Object){
	has_selected_pot = false;
	RemoveEffect();
}

function HandleSelectPackFlowerPot(evt : GameEvent, obj : Object){
	has_selected_pot = true;
}

function HandleSelectPackFurni(evt : GameEvent, obj : Object){
	var select_itm : FitmentPackGrid = obj as FitmentPackGrid;
	var select_pg : PackGrid = select_itm.packGrid;
	var pg_itm : Item = select_pg._item;
	var sub_id : int = pg_itm._itemInfo.sub_id;
	var hscompRow : HouseCompRow = ResManager.LgtMgr.getHouseCompRow(sub_id);
	var type : int = 0;
	if(hscompRow)
		type = hscompRow.type;
	
	if(type == 2){
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.SELECT_PACK_FLOWERPOT));
	}
	else{
		has_selected_pot = false;
	}
}

function HandleClickShopPackBtn(evt : GameEvent, obj : Object){
	if(!Task.task_target1_complete_f){
		UI.getUI().CloseNewGuideLeadRoot();
		UI.getUI().OpenNewGuideLeadRoot();
		iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos2, img_pos2, lbl_pos_size2, arrow_direct2, img_name2, 80);
	}
}

function HandleClickCloseBackPackUI(evt : GameEvent, obj : Object){
	has_click_pot = false;
	has_click_seed = false;
	backpack_opened = false;
	UI.getUI().CloseNewGuideLeadRoot();
}

function HandleClickCancelPlant(evt : GameEvent, obj : Object){
	//has_click_seed = false;
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos5, img_pos5, lbl_pos_size5, arrow_direct5, img_name5, 3);	
}

function HandleClickSurePlant(evt : GameEvent, obj : Object){
	has_complete_this_task = true;
	UI.getUI().CloseNewGuideLeadRoot();
}

function HandleClickSeed(evt : GameEvent, obj : Object){
	has_click_seed = true;
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos6, img_pos6, lbl_pos_size6, arrow_direct6, img_name6, 1);	
}

function HandleClickBackPack(evt : GameEvent, _obj : Object){
	/*
	var obj : BackpackClass = _obj as BackpackClass;
	if(!obj.pg)
		return;
	var pg : PackGrid = obj.pg as PackGrid;
	var itm : Item = pg._item;
	if(!itm)
		return;
	var type : int = itm._itemInfo.type;
	if(type == 10){
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_SEED));
	}
	*/
}

function HandleClickPlant(evt : GameEvent, obj : Object){
	has_click_pot = true;
	has_click_plant_btn = true;
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos5, img_pos5, lbl_pos_size5, arrow_direct5, img_name5, 3);	
}

function HandleClickPlantFuncBtn(evt : GameEvent, obj : Object){
	if(!DataCenter.isInSelfHouse())
		return;
	
	has_click_pot = false;
	UI.getUI().CloseNewGuideLeadRoot();
}

function HandleClickOnFurniture(evt : GameEvent, obj : Object){
	if(!DataCenter.isInSelfHouse())
		return;
	
	if(!Task.task_target1_complete_f){
		return;	
	}
	
	if(!obj){
		has_click_pot = false;
		UI.getUI().CloseNewGuideLeadRoot();
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
		has_click_pot = false;
		UI.getUI().CloseNewGuideLeadRoot();
	}
}

function HandleClickFlowerPot(evt : GameEvent, obj : Object){
	has_click_pot = true;
	RemoveEffect();
	UI.getUI().CloseNewGuideLeadRoot();
	UI.getUI().OpenNewGuideLeadRoot();
	iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos4, img_pos4, lbl_pos_size4, arrow_direct4, img_name4, 80);
}

function RemoveEffect(){
	if(attachEffect_Pot){
		attachEffect_Pot.Destroy();
		attachEffect_Pot = null;
		loaded_effect = false;
	}		
}

function HandleLeaveSelfHouse(evt : GameEvent, obj : Object){
	RemoveEffect();
}

function Update(){
	if(!Task.task_target1_complete_f || has_complete_this_task || NewPlayGuideModule.one_newhand_task_complete_noreward){
		return;
	}
	
	if(flowerpot_obj == null){
		if(NewPlayGuideModule.flowerpot_obj){
			flowerpot_obj = NewPlayGuideModule.flowerpot_obj;
		}
	}
	
	if(((DataCenter.isInSelfHouse() && !FitmentLogic.getInstance().inFitmenting && Task.task_target1_complete_f && flowerpot_obj && !has_click_pot) || (DataCenter.isInSelfHouse() && !FitmentLogic.getInstance().inFitmenting && has_putdown_saved && has_putdown_pot && has_selected_pot && flowerpot_obj && !has_click_pot)/* || (!has_click_pot && flowerpot_obj && DataCenter.isInSelfHouse() && Task.task_target1_complete_f)*/) && !loaded_effect){
		var inst_flowerpot : FlowerPot = new FlowerPot(flowerpot_obj);
		inst_flowerpot.LoadEffect();
		attachEffect_Pot = inst_flowerpot;
		loaded_effect = true;
	}
	else if((!has_click_pot && flowerpot_obj && DataCenter.isInSelfHouse() && Task.task_target1_complete_f && !FitmentLogic.getInstance().inFitmenting) && !loaded_effect){
		var inst_flowerpot1 : FlowerPot = new FlowerPot(flowerpot_obj);
		inst_flowerpot1.LoadEffect();
		attachEffect_Pot = inst_flowerpot1;
		loaded_effect = true;	
	}
}

function HandleClickSaveFitment(evt : GameEvent, obj : Object){
	has_putdown_saved = true;	
	iGUICode_StorageBoxUI.getInstance().shop_exit_btn.setEnabled(true);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.EXTENAL_CLOSE_NEWGUIDEWIN));
	UI.getUI().CloseNewGuideLeadRoot();
}

function HandleCloseNewhandTaskGuideRoot(evt : GameEvent, obj : Object){
	if(!Task.task_target1_complete_f){
		//iGUICode_StorageBoxUI.getInstance().shop_save_btn.setEnabled(true);
	
		UI.getUI().CloseNewGuideLeadRoot();
		UI.getUI().OpenNewGuideLeadRoot();
		iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos3, img_pos3, lbl_pos_size3, arrow_direct3, img_name3, 80);
	}
}

function HandlePutdownEnd(evt : GameEvent, obj : Object){
	has_putdown_pot = true;
	UI.getUI().CloseNewGuideLeadRoot();
	HandleCloseNewhandTaskGuideRoot(evt, obj);
	/*
	if(!Task.task_target1_complete_f){
		var imgset : String[] = new String[1];
		imgset[0] = "newguide-7.png.u3d";
		var param : NewGuideRootParam = new NewGuideRootParam(true, imgset, false, false, null, false, false);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.START_NEWHANDTASK_GUIDE), param);
		HandleCloseNewhandTaskGuideRoot(evt, obj);
	}
	*/
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

/*
function HandleSelectFurni(evt : GameEvent, obj : Object){
	has_selected_pot = true;
	if(!Task.task_target1_complete_f){
		UI.getUI().CloseNewGuideLeadRoot();
		var imgset : String[] = new String[1];
		imgset[0] = "newguide-5.png.u3d";
		var param : NewGuideRootParam = new NewGuideRootParam(false, imgset, false, true, Vector2(0,0), false, false);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.START_NEWHANDTASK_GUIDE), param);
	}
}

function HandleSelectFurniType(evt : GameEvent, obj : Object){
	if(!Task.task_target1_complete_f){
		//改变箭头的位置
		UI.getUI().CloseNewGuideLeadRoot();
		UI.getUI().OpenNewGuideLeadRoot();
		iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos2, img_pos2, lbl_pos_size2, arrow_direct2, img_name2, 80);
	}
}
*/

function HandleEnterFitmentUI(evt : GameEvent, obj : Object){
	has_click_pot = false;
	if(!Task.task_target1_complete_f){
		//iGUICode_StorageBoxUI.getInstance().shop_exit_btn.setEnabled(false);
		//iGUICode_StorageBoxUI.getInstance().shop_save_btn.setEnabled(false);
		UI.getUI().CloseNewGuideLeadRoot();
		UI.getUI().OpenNewGuideLeadRoot();
		iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos1, img_pos1, lbl_pos_size1, arrow_direct1, img_name1,80);
	}
}

function HandleClickFitmentBtn(evt : GameEvent, obj : Object){
	UI.getUI().CloseNewGuideLeadRoot();
	//UI.getUI().SetElementPassive(false,"fitment_btn","MainUI",false);
}

function HandleClickItemsMakeBtn(evt : GameEvent, obj : Object){
	//UI.getUI().CloseNewGuideLeadRoot();
}

function HandleCloseNewHandTaskUI(evt : GameEvent, obj : Object){
	var ins_task_id : UInt64 = Convert.ToUInt64(obj);
	var t : task_info = Task.getInstance().allTasks[Task.getInstance().findTaskIndexByInstID(ins_task_id)] as task_info;
	if(t.complete_date.year != 0 && t.reward_date.year == 0){	//已经完成任务, 且未领取
	
	}
	else if(t.complete_date.year == 0 && !Task.task_target1_complete_f){
		UI.getUI().CloseNewGuideLeadRoot();
		UI.getUI().OpenNewGuideLeadRoot();
		iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos, img_pos, lbl_pos_size, arrow_direct, img_name, 80);
	}
}

function OnDestroy(){
	RemoveEffect();
	UnRegistEvt();
	//iGUICode_MainUI.getInstance().fitment_btn.setEnabled(false);
}

function UnRegistEvt(){
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_ITEMS_MAKE_BTN), HandleClickItemsMakeBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASK_UI), HandleCloseNewHandTaskUI);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_SAVE_FITMENT), HandleClickSaveFitment);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.PUTDOWNEND), HandlePutdownEnd);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.START_NEWHANDTASK_GUIDE), HandleStartNewHandTaskGuide);
	//EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.SELECT_FURNI), HandleSelectFurni);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.ENTER_FITMENT_UI), HandleEnterFitmentUI);
	//EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.SELECT_FURNI_TYPE), HandleSelectFurniType);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_FITMENT_BTN), HandleClickFitmentBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CANCEL_PLANT), HandleClickCancelPlant);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_SurePlant), HandleClickSurePlant);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_SEED), HandleClickSeed);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.BACKPACK_CLICKED), HandleClickBackPack);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_PLANT), HandleClickPlant);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_REMOVEPLANT), HandleClickPlantFuncBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_HARVEST), HandleClickPlantFuncBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_WATER), HandleClickPlantFuncBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_FERTILIZE), HandleClickPlantFuncBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICKON_FURNITURE), HandleClickOnFurniture);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_FLOWERPOT), HandleClickFlowerPot);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_SELF_HOUSE), HandleLeaveSelfHouse);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_COMMON_SCENE), HandleLeaveSelfHouse);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_FRIEND_HOUSE), HandleLeaveSelfHouse);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_BACKPACKUI), HandleClickCloseBackPackUI);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_RECYCLEFURNI_BTN), HandleClickRecycleFurniBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.EXIT_EDIT_HOUSE), HandleExitEditHouse);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.UNSELECT_PACK_FURNI), HandleUnSelectPackFurni);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.SELECT_PACK_FLOWERPOT), HandleSelectPackFlowerPot);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.SELECT_PACK_FURNI), HandleSelectPackFurni);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_SHOP_PACK_BTN), HandleClickShopPackBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.POST_NEWFLOWERPOT), HandlePostNewFlowerPot);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.FURNIINTERACTUI_UNENABLED), HandleClickPlantFuncBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.ROTATE_CAMERA), HandleClickPlantFuncBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICKON_OUTSIDEHOUSE), HandleClickOutSideHouse);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.UNDO_RECYCLE_FURNI), HandleUndoRecycleFurni);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.BACKPACK_OPENDED), HandleOpenBackPack);

}
/*
class PotNewHandParticleLoad extends MainLoadModelCtrlEvent {
	private var mObj : GameObject = null;
	private var mLoader : ModelLoader = null;
	private static var mAttachObj : GameObject = null;
	private var mName : String = "";
	private var mAutoDel : boolean = false;
	
	function PotNewHandParticleLoad(name : String, res : String, attach : GameObject, autoDel : boolean) {
		clearReady();
		
		mLoader = Global.GetModelLoaderMgr().AsynLoadModel(res, OnLoadFinished);
		mAttachObj = attach;
		mName = name;
	}
	private function OnLoadFinished(loader : ModelLoader) : void {
		mObj = loader.mModelObj;
		
		complete();
	}
	function complete()
	{
		setReady();
	}
	function Destroy()
	{
		if (mObj)
		{
			GameObject.Destroy(mObj);
		}
			
		mLoader.Destroy();
	}
	// override
	function exce():void
	{
		mObj.name = mName;
		if(mAttachObj == null)
			mAttachObj = newhand_20009.flowerpot_obj; //NewPlayGuideModule.flowerpot_obj;
			
		if(mAttachObj != null) {
			mObj.transform.parent = mAttachObj.transform;
			mObj.transform.position = mAttachObj.transform.position;
			
			var mesh : MeshRenderer = mAttachObj.GetComponentInChildren(MeshRenderer);
			if(mesh != null) {
				mObj.transform.position.y += mesh.bounds.size.y + 1.5;
			}
		}
		if(mAutoDel) {
			mObj.AddComponent(ParticleDestroy);
		}
		
		var _inst : FlowerPot = mAsynModel as FlowerPot;
		_inst.SetEffectObject(mObj);
	}
	function cancel():void
	{
		Destroy();
	}
}

class FlowerPot extends AsynModel {
	var mpot : GameObject;
	var mEffectObj : GameObject;
	private var mAsynCtrl:AsynModelCtrl = new AsynModelCtrl(this);
	
	function FlowerPot(pot : GameObject){
		mpot = pot;
	}
	
	function LoadEffect(){
		mAsynCtrl.addOrProcessEvent(new PotNewHandParticleLoad("PotNewhandEffect", newhand_20009.PLANT_DIR + "Click.prefab.u3d", mpot, false));
	}
	
	function SetEffectObject(obj : GameObject){
		mEffectObj = obj;
	}
	
	function Destroy() {
		mAsynCtrl.clearEvent();
		
		if(mpot) {
			mpot = null;
		}
		
		if(mEffectObj) {
			GameObject.Destroy(mEffectObj);
			mEffectObj = null;
		}
	}
}
*/