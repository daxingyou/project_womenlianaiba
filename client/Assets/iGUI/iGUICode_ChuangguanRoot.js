import iGUI;

var enter_btn_bgs : String[];
var MAX_LEVEL : int = 10;
private var cur_select_result : int = 0;
private var cur_level_reward : LevelRewardRow = null;
private static var instance : iGUICode_ChuangguanRoot;
function Awake(){
	instance=this;
	RegistEvt();
}
static function getInstance(){
	return instance;
}

@HideInInspector
var pass_item1_num : iGUILabel;
@HideInInspector
var pass_item2_num : iGUILabel;
@HideInInspector
var pass_item3_num : iGUILabel;
@HideInInspector
var per_item1_num : iGUILabel;
@HideInInspector
var per_item2_num : iGUILabel;
@HideInInspector
var per_item3_num : iGUILabel;
@HideInInspector
var remainCntLbl : iGUILabel;
@HideInInspector
var next_item3_num : iGUILabel;
@HideInInspector
var next_item2_num : iGUILabel;
@HideInInspector
var next_item1_num : iGUILabel;
@HideInInspector
var pre_item1_num : iGUILabel;
@HideInInspector
var pre_item3_num : iGUILabel;
@HideInInspector
var container1 : iGUIContainer;

@HideInInspector
var next_item1 : iGUIImage;
@HideInInspector
var next_item2 : iGUIImage;
@HideInInspector
var next_item3 : iGUIImage;
@HideInInspector
var next_panel1 : iGUIPanel;
@HideInInspector
var next_panel2 : iGUIPanel;
@HideInInspector
var next_panel3 : iGUIPanel;
@HideInInspector
var next_item_container : iGUIPanel;
@HideInInspector
var next_exp_lbl : iGUILabel;
@HideInInspector
var next_diamond_lbl : iGUILabel;
@HideInInspector
var image7 : iGUIImage;
@HideInInspector
var image6 : iGUIImage;
@HideInInspector
var pass_item3 : iGUIImage;
@HideInInspector
var passpanel5 : iGUIPanel;
@HideInInspector
var pass_item2 : iGUIImage;
@HideInInspector
var passpanel4 : iGUIPanel;
@HideInInspector
var pass_item1 : iGUIImage;
@HideInInspector
var passpanel1 : iGUIPanel;
@HideInInspector
var pass_item_container : iGUIPanel;
@HideInInspector
var pass_exp_lbl : iGUILabel;
@HideInInspector
var passimage5 : iGUIImage;
@HideInInspector
var pass_diamond_lbl : iGUILabel;
@HideInInspector
var passimage4 : iGUIImage;
@HideInInspector
var per_item3 : iGUIImage;
@HideInInspector
var panel5 : iGUIPanel;
@HideInInspector
var per_item2 : iGUIImage;
@HideInInspector
var panel4 : iGUIPanel;
@HideInInspector
var per_item1 : iGUIImage;
@HideInInspector
var panel1 : iGUIPanel;
@HideInInspector
var per_item_container : iGUIPanel;
@HideInInspector
var per_level_exp_lbl : iGUILabel;
@HideInInspector
var image5 : iGUIImage;
@HideInInspector
var per_level_diamond_lbl : iGUILabel;
@HideInInspector
var image4 : iGUIImage;
@HideInInspector
var image3 : iGUILabel;
@HideInInspector
var pre_item3 : iGUIImage;
@HideInInspector
var panel3 : iGUIPanel;
@HideInInspector
var pre_item2 : iGUIImage;
@HideInInspector
var panel2 : iGUIPanel;
@HideInInspector
var pre_item1 : iGUIImage;
@HideInInspector
var item_panel1 : iGUIPanel;
@HideInInspector
var pre_exp_lbl : iGUILabel;
@HideInInspector
var pre_diamond_lbl : iGUILabel;
@HideInInspector
var image2 : iGUIImage;
@HideInInspector
var image1 : iGUIImage;
@HideInInspector
var select_frm : iGUIPanel;
@HideInInspector
var answers_container : iGUIContainer;
@HideInInspector
var get_pass_rewards_btn : iGUIButton;
@HideInInspector
var pass_rewards : iGUILabel;
@HideInInspector
var label19 : iGUILabel;
@HideInInspector
var label18 : iGUILabel;
@HideInInspector
var pass_all_level_panel : iGUIPanel;
@HideInInspector
var label17 : iGUILabel;
@HideInInspector
var get_reward_restart_btn : iGUIButton;
@HideInInspector
var continue_btn : iGUIButton;
@HideInInspector
var label16 : iGUILabel;
@HideInInspector
var cur_reward : iGUILabel;
@HideInInspector
var label15 : iGUILabel;
@HideInInspector
var label14 : iGUILabel;
@HideInInspector
var right_panel : iGUIPanel;
@HideInInspector
var end_btn : iGUIButton;
@HideInInspector
var restart_btn : iGUIButton;
@HideInInspector
var label13 : iGUILabel;
@HideInInspector
var pre_item2_num : iGUILabel;
@HideInInspector
var wrong_panel : iGUIPanel;
@HideInInspector
var result_btn : iGUIButton;
@HideInInspector
var pre_item_container : iGUIPanel;
@HideInInspector
var answer4 : iGUIButton;
@HideInInspector
var label11 : iGUILabel;
@HideInInspector
var answer_container4 : iGUIContainer;
@HideInInspector
var answer3 : iGUIButton;
@HideInInspector
var label10 : iGUILabel;
@HideInInspector
var answer_container3 : iGUIContainer;
@HideInInspector
var answer2 : iGUIButton;
@HideInInspector
var label9 : iGUILabel;
@HideInInspector
var answer_container2 : iGUIContainer;
@HideInInspector
var answer1 : iGUIButton;
@HideInInspector
var label8 : iGUILabel;
@HideInInspector
var answer_container1 : iGUIContainer;
@HideInInspector
var label7 : iGUILabel;
@HideInInspector
var remain_tm : iGUILabel;
@HideInInspector
var label6 : iGUILabel;
@HideInInspector
var question : iGUILabel;
@HideInInspector
var label5 : iGUILabel;
@HideInInspector
var level_num : iGUILabel;
@HideInInspector
var label4 : iGUILabel;
@HideInInspector
var label3 : iGUILabel;
@HideInInspector
var chuangguan_panel : iGUIPanel;
@HideInInspector
var exit_btn : iGUIButton;
@HideInInspector
var enter_btn : iGUIButton;
@HideInInspector
var label2 : iGUILabel;
@HideInInspector
var label1 : iGUILabel;
@HideInInspector
var enter_panel : iGUIPanel;
@HideInInspector
var chuangguanRoot : iGUIRoot;

function Start(){
	RegistCallback();
}

function RegistEvt(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.UPDATE_MIND_QUIZ_COUNT), HandleUpdateMindQuizCnt);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.TO_MAX_LEVEL), HandleToMaxLevel);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.ANSWER_RIGHT), HandleAnswerRight);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.ANSWER_WRONG), HandleAnswerWrong);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.ANSWER_TIME_UP), HandleRemainTimeUp);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.UPDATE_REMAIN_TM), HandleUpdateRemainTime);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.INIT_REMAIN_TM), HandleInitRemainTime);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.UPDATE_QUESTION_DESC), HandleUpdateQuestion);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_START_CHUANGGUAN), HandleStartChuangguan);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.EXIT_CHUANGGUAN), HandleExitChuangguan);
}

function RegistCallback(){
	get_pass_rewards_btn.clickCallback = ClickCallback_get_pass_rewards_btn;
	get_reward_restart_btn.clickCallback = ClickCallback_get_reward_restart_btn;
	continue_btn.clickCallback = ClickCallback_continue_btn;
	result_btn.clickCallback = ClickCallback_result_btn;
	restart_btn.clickCallback = ClickCallback_restart_btn;
	end_btn.clickCallback = ClickCallback_end_btn;
	exit_btn.clickCallback = ClickCallback_exit_btn;
	enter_btn.clickCallback = ClickCallback_enter_btn;
}

function HandleUpdateMindQuizCnt(evt : GameEvent, obj : Object){
	var pack : notify_mind_quiz_count = obj as notify_mind_quiz_count;
	var cnt : int = pack.count;
	var love_cnt : int = pack.love_coin_count;
	remainCntLbl.label.text = cnt.ToString();
	if(cnt != 0){
		setEnterBtnStyle(enter_btn_bgs[0], enter_btn_bgs[1]);
	}
	else{
		if(love_cnt != 0)
			setEnterBtnStyle(enter_btn_bgs[2], enter_btn_bgs[3]);
		else{
			setEnterBtnStyle(enter_btn_bgs[4], enter_btn_bgs[4]);
			enter_btn.clickCallback = null;
			restart_btn.clickCallback = null;
		}
	}
}

function setEnterBtnStyle(n_bg : String, h_bg : String){
	enter_btn.style.normal.background = Resources.Load("UISkins/Textures/IQlevel/" + n_bg);
	enter_btn.style.hover.background = Resources.Load("UISkins/Textures/IQlevel/" + h_bg);
	enter_btn.style.active.background = Resources.Load("UISkins/Textures/IQlevel/" + n_bg);
	restart_btn.style.normal.background = Resources.Load("UISkins/Textures/IQlevel/" + n_bg);
	restart_btn.style.hover.background = Resources.Load("UISkins/Textures/IQlevel/" + h_bg);
	restart_btn.style.active.background = Resources.Load("UISkins/Textures/IQlevel/" + n_bg);	
}

function HandleToMaxLevel(evt : GameEvent, obj : Object){
	CloseChuangguanPanel();
	OpenPassLevelPanel();
	ClearRewardUIData(pass_diamond_lbl, pass_exp_lbl, pass_item_container);
	ShowCurLevelReward(cur_level_reward, pass_diamond_lbl, pass_exp_lbl, pass_item_container);
}

//--
function HandleAnswerRight(evt : GameEvent, obj : Object){
	CloseChuangguanPanel();
	OpenRightPanel();
	ClearRewardUIData(per_level_diamond_lbl, per_level_exp_lbl, per_item_container);
	ShowCurLevelReward(cur_level_reward, per_level_diamond_lbl, per_level_exp_lbl, per_item_container);
}

//--
function HandleAnswerWrong(evt : GameEvent, obj : Object){
	cur_select_result = 2;
	Global.GetSysTooltip().Hide();
	CloseChuangguanPanel();
	OpenWrongAnswerPanel();
}

function HandleRemainTimeUp(evt : GameEvent, obj : Object){
	//关闭答题界面，开启回答错误界面
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.ANSWER_WRONG));
}

function HandleUpdateRemainTime(evt : GameEvent, obj : Object){
	var txt : String = remain_tm.label.text;
	var _tm : int = Convert.ToInt32(txt);
	-- _tm;
	remain_tm.label.text = _tm.ToString();
}

function HandleInitRemainTime(evt : GameEvent, obj : Object){
	var _tm : int = Convert.ToInt32(obj);
	remain_tm.label.text = _tm.ToString();
}

function HandleUpdateQuestion(evt : GameEvent, obj : Object){
	cur_select_result = 0;
	var cur_data : CurLevelData = obj as CurLevelData;
	result_btn.userData = cur_data.cur_level;
	level_num.label.text = cur_data.cur_level.ToString();
	question.label.text = cur_data.cur_ques_row.q_desc;
	var answer_list : ArrayList = new ArrayList();
	answer_list.Add(cur_data.cur_ques_row.right_answer);
	answer_list.Add(cur_data.cur_ques_row.answer1);
	answer_list.Add(cur_data.cur_ques_row.answer2);
	answer_list.Add(cur_data.cur_ques_row.answer3);

	var answer_btn_cnt : int = answers_container.itemCount;
	for(var i:int=0; i < answer_btn_cnt; ++ i){
		Random.seed = Time.realtimeSinceStartup;
		var idx : int = Random.Range(0, answer_list.Count - 1);
		var ans : String = Convert.ToString(answer_list[idx]);
		var ans_btn : iGUIButton = answers_container.items[i].items[1] as iGUIButton;
		ans_btn.label.text = ans;
		if(ans.Equals(cur_data.cur_ques_row.right_answer)){
			answers_container.items[i].userData = 1;
		}
		else{
			answers_container.items[i].userData = 2;
		}
		ans_btn.clickCallback = ClickCallback_AnswerBtn;
		answer_list.RemoveAt(idx);
	}
	//显示当前关的奖励
	SetCurLevelRewardData(cur_data.cur_level_reward);
	ClearRewardUIData(pre_diamond_lbl, pre_exp_lbl, pre_item_container);
	ShowCurLevelReward(cur_data.cur_level_reward, pre_diamond_lbl, pre_exp_lbl, pre_item_container);
	//显示下一关增加的奖励
	var deltaReward : LevelRewardRow = calculateDeltaReward(cur_data.cur_level_reward, cur_data.next_level_reward);
	
	ClearRewardUIData(next_diamond_lbl, next_exp_lbl, next_item_container);
	ShowCurLevelReward(deltaReward, next_diamond_lbl, next_exp_lbl, next_item_container);
}

function calculateDeltaReward(cur_reward : LevelRewardRow, next_reward : LevelRewardRow) : LevelRewardRow {
	if(!cur_reward || !next_reward)
		return null;
	
	var delta_row : LevelRewardRow = new LevelRewardRow();
	var delta_diamond : int = next_reward.diamond - cur_reward.diamond;
	var delta_exp : int = next_reward.exp - cur_reward.exp;
	delta_row.diamond = delta_diamond;
	delta_row.exp = delta_exp;
	var delta_items : Array = new Array();
	var delta_itemCounts : Array = new Array();
	
	for(var i : int=0; i < next_reward.items.Count; ++ i){
		var exist : int = eleExists(cur_reward.items, Convert.ToInt32(next_reward.items[i]));
		if(exist == -1){	// not exist
			delta_items.Push(next_reward.items[i]);
			delta_itemCounts.Push(next_reward.item_counts[i]);
		}
		else{ //exist
			var same_cur_cnt : int = cur_reward.item_counts[exist];
			var same_next_cnt : int = next_reward.item_counts[i];
			var delta_cnt : int = same_next_cnt - same_cur_cnt;
			if(delta_cnt > 0){
				delta_items.Push(next_reward.items[i]);
				delta_itemCounts.Push(delta_cnt);
			}
		}
	}
	delta_row.items = delta_items;
	delta_row.item_counts = delta_itemCounts;
	return delta_row;
}

function eleExists(array : Array, test_ele : int) : int {
	var exist : int = -1;
	for(var i : int=0; i < array.Count; ++ i){
		var arr_ele : int = Convert.ToInt32(array[i]);
		if(test_ele == arr_ele){
			exist = i;
			break;
		}
	}
	
	return exist;
}

function SetCurLevelRewardData(reward_row : LevelRewardRow){
	cur_level_reward = reward_row;
}

function ClearRewardUIData(diamond_lbl : iGUILabel, exp_lbl : iGUILabel, item_container : iGUIPanel){
	diamond_lbl.label.text = "0";
	exp_lbl.label.text = "0";
	for(var i:int=0; i < item_container.itemCount; ++ i){
		var img_frm : iGUIImage = item_container.items[i].items[0] as iGUIImage;
		if(item_container.items[i].itemCount > 1){
			var num_lbl : iGUILabel = item_container.items[i].items[1] as iGUILabel;
			num_lbl.label.text = "";
		}
		img_frm.image = null;
		img_frm.userData = null;
		img_frm.mouseOverCallback = null;
	}
}

function ShowCurLevelReward(reward_row : LevelRewardRow, diamond_lbl : iGUILabel, exp_lbl : iGUILabel, item_container : iGUIPanel){
	if(!reward_row)
		return;
	
	if(reward_row.diamond > 0){
		diamond_lbl.label.text = reward_row.diamond.ToString();
		
	}
	if(reward_row.exp > 0){
		exp_lbl.label.text = reward_row.exp.ToString();
	}
	
	if(reward_row.items.Count > 0){
		for(var i:int=0; i < reward_row.items.Count; ++ i){
			var item_id : int = Convert.ToInt32(reward_row.items[i]);
			if(item_id != 0){
				var num : int = Convert.ToInt32(reward_row.item_counts[i]);
				var name : String = ResManager.LgtMgr.getItemRow(item_id).name;
				var item_icon : String = ResManager.LgtMgr.getItemRow(item_id).icon;
				var img_frm : iGUIImage = item_container.items[i].items[0] as iGUIImage;
				if(item_container.items[i].itemCount > 1){
					var num_lbl : iGUILabel = item_container.items[i].items[1] as iGUILabel;
					num_lbl.label.text = num.ToString();
				}
				img_frm.mouseOverCallback = MouseOverCallback_Item;
				img_frm.userData = name;
				_LoadItemImg(img_frm, item_icon);
			}
		}
	}
}

function MouseOverCallback_Item(caller : iGUIElement){
	var name : String = caller.userData.ToString();
	var style : GUIStyle = new GUIStyle();
	style.normal.textColor = Color.white;
	style.fontStyle = FontStyle.Bold;
	Global.GetSysTooltip().Begin(caller);
	Global.GetSysTooltip().Add(GUIContent(name), style);
	Global.GetSysTooltip().Show(true);

}

function _LoadItemImg(img_frm : iGUIImage, img_name : String){
	var _asynIcon : AsynIcon = new AsynIcon(function (img : Texture){img_frm.image = img;
																	 img_frm.setHeight(img.height);},
											null);
	_asynIcon.load("Icon/" + img_name); 	
}

function ClickCallback_AnswerBtn(caller : iGUIElement){
	if(caller.getTargetContainer().userData == null){
		return;
	}
	var result : int = Convert.ToInt32(caller.getTargetContainer().userData);
	cur_select_result = result;
	//todo 选中框
	SetSelectFrm(true, caller.getTargetContainer().positionAndSize.x, caller.getTargetContainer().positionAndSize.y);
}

function SetSelectFrm(flag : boolean,posx : float, posy : float){
	var p_x : float = answers_container.positionAndSize.x;
	var p_y : float = answers_container.positionAndSize.y;
	select_frm.setEnabled(flag);
	select_frm.setX(p_x + posx - 3);
	select_frm.setY(p_y + posy - 10);
}

function HandleStartChuangguan(evt : GameEvent, obj : Object){
	CloseEnterPanel();
	OpenChuangguanPanel();
}

function HandleExitChuangguan(evt : GameEvent, obj : Object){
	UI.getUI().SetModal("ChuangguanRoot", false);
}

function ClickCallback_continue_btn(caller : iGUIElement){
	CloseRightPanel();
	OpenChuangguanPanel();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CONTINUE_CHUANGGUAN));
}

function ClickCallback_get_reward_restart_btn(caller : iGUIElement){
	CloseRightPanel();
	ReqGetReward();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.EXIT_CHUANGGUAN));
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_CHUANGGUAN_BTN));
}

function ClickCallback_get_pass_rewards_btn(caller : iGUIElement){
	ReqGetReward();
	ClosePassLevelPanel();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.EXIT_CHUANGGUAN));
}

function ReqGetReward(){
	var req : req_mind_quiz_reward = new req_mind_quiz_reward();
	req.level = ChuangguanComp.cur_level;
	NetHelper.Send(req);
}

function ClickCallback_result_btn(caller : iGUIElement){
	var result : int = cur_select_result;
	var cur_lv : int = Convert.ToInt32(caller.userData);
	if(result == 1){
		if(cur_lv == MAX_LEVEL){
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.TO_MAX_LEVEL));
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_RESULT_BTN));
		}
		else{
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.ANSWER_RIGHT));
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_RESULT_BTN));
		}
	}
	else if(result == 2){
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.ANSWER_WRONG));
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_RESULT_BTN));
	}	
}

function ClickCallback_enter_btn(caller : iGUIElement){
	ReqStartChuangguan();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_ENTER_BTN));
}

function ClickCallback_restart_btn(caller : iGUIElement){
	ReqStartChuangguan();
}

function ClickCallback_end_btn(caller : iGUIElement){
	CloseWrongAnswerPanel();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.EXIT_CHUANGGUAN));
}

function ClickCallback_exit_btn(caller : iGUIElement){
	CloseEnterPanel();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.EXIT_CHUANGGUAN));
}

function ReqStartChuangguan(){
	var req : req_start_mind_quiz = new req_start_mind_quiz();
	NetHelper.Send(req);
}

function OpenWrongAnswerPanel(){
	wrong_panel.setEnabled(true);
	reqMindQuizCnt();
}

function CloseWrongAnswerPanel(){
	wrong_panel.setEnabled(false);
}

function OpenChuangguanPanel(){
	chuangguan_panel.setEnabled(true);
}

function CloseChuangguanPanel(){
	SetSelectFrm(false, 0, 0);
	chuangguan_panel.setEnabled(false);
}

function OpenEnterPanel(){
	enter_panel.setEnabled(true);
	reqMindQuizCnt();
}

function reqMindQuizCnt(){
	var req : req_mind_quiz_count = new req_mind_quiz_count();
	NetHelper.Send(req);
}

function CloseEnterPanel(){
	enter_panel.setEnabled(false);
}

function OpenRightPanel(){
	right_panel.setEnabled(true);
}

function CloseRightPanel(){
	right_panel.setEnabled(false);
}

function OpenPassLevelPanel(){
	pass_all_level_panel.setEnabled(true);
}

function ClosePassLevelPanel(){
	pass_all_level_panel.setEnabled(false);
}

static function OpenRoot(){
	return;
	if(!UI.getUI().GetUIRoot("ChuangguanRoot"))
		UI.getUI().OpenUIRoot("ChuangguanRoot");
	iGUICode_ChuangguanRoot.getInstance().OpenEnterPanel();
	UI.getUI().SetModal("ChuangguanRoot", true);
}

static function CloseRoot(){
	if(UI.getUI().GetUIRoot("ChuangguanRoot"))
		UI.getUI().CloseUIRoot("ChuangguanRoot");

}