/*
	闯关任务
	by huangdj 2012-09-19
*/
#pragma strict
//--
class LevelRewardRow{
	var level : int = 0;
	var items : Array = new Array();
	var item_counts : Array = new Array();
	var diamond : int = 0;
	var exp : int = 0;
}

//--
class QuestionRow{
	var id : int = 0;
	var q_desc : String = "";
	var right_answer : String = "";
	var answer1 : String = "";
	var answer2 : String = "";
	var answer3 : String = "";
}

//--
class CurLevelData{
	var cur_level : int = 0;
	var cur_ques_row : 	QuestionRow = null;
	var cur_level_reward : LevelRewardRow = null;
	var next_level_reward : LevelRewardRow = null;
	function CurLevelData(lv : int, q_desc_row : QuestionRow, reward : LevelRewardRow, next_reward : LevelRewardRow){
		cur_level = lv;
		cur_ques_row = q_desc_row;
		cur_level_reward = reward;
		next_level_reward = next_reward;
	}
}

var interval : int = 1000;
var cur_remain_tm : int = 30;
var total_level : int = 10;
private var remain_timer : Timer = null;
static var cur_level : int = 0;
private var has_load_q_bank : boolean = false;
private var question_bank_table : Hashtable = new Hashtable();
private var level_reward_table : Hashtable = new Hashtable();
private var cur_question_bank_idx_array : ArrayList = new ArrayList();

function Awake(){
	RegistEvt();
}

function Start () {
	RegistNetEvent();
}

function RegistNetEvent(){
	NetHelper.RegistHandler(new notify_start_mind_quiz(), Handle_notify_start_chuangguan);
	NetHelper.RegistHandler(new notify_mind_quiz_reward(), Handle_notify_mind_quiz_reward);
	NetHelper.RegistHandler(new notify_mind_quiz_count(), Handle_notify_mind_quiz_count);
}

function RegistEvt() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_RESULT_BTN), HandleClickResultBtn);	
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CONTINUE_CHUANGGUAN), HandleContinueChuangguan);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.ANSWER_RIGHT), HandleAnswerRight);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.ANSWER_TIME_UP), HandleRemainTimeUp);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.INIT_REMAIN_TM), HandleInitRemainTime);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_START_CHUANGGUAN), HandleStartChuangguan);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.EXIT_CHUANGGUAN), HandleExitChuangguan);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.LOAD_Q_BANK_OK), HandleLoadQuesBankOk);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CHUANGGUAN_BTN), HandleClickChuangguanBtn);
}

//--
function Handle_notify_mind_quiz_count(evt : GameEvent, pack : notify_mind_quiz_count){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.UPDATE_MIND_QUIZ_COUNT), pack);
}

//--
function Handle_notify_mind_quiz_reward(evt : GameEvent, pack : notify_mind_quiz_reward){

}

//--
function HandleClickResultBtn(evt : GameEvent, obj : Object){
	if(remain_timer){
		remain_timer.Reset();
	}
}

//--
function HandleContinueChuangguan(evt : GameEvent, obj : Object){
	++ cur_level;
	var q_row : QuestionRow = RandomSelectQuestion();
	var reward : LevelRewardRow = GetRewardRow(cur_level);
	var next_reward : LevelRewardRow = null;
	if(cur_level < total_level){
		var next_level : int = cur_level + 1;
		next_reward = GetRewardRow(next_level);
	}
	UpdateChuangguanData(cur_level, q_row, reward, next_reward);	
}

//--
function HandleAnswerRight(evt : GameEvent, obj : Object){
	
}

//--
function HandleRemainTimeUp(evt : GameEvent, obj : Object){
	//重置数据
	cur_level = 1;
}

//--
function HandleStartChuangguan(evt : GameEvent, obj : Object){
	cur_level = 1;
	var next_level : int = cur_level + 1;
	var q_row : QuestionRow = RandomSelectQuestion();
	var reward : LevelRewardRow = GetRewardRow(cur_level);
	var next_reward : LevelRewardRow = GetRewardRow(next_level);
	iGUICode_ChuangguanRoot.getInstance().CloseWrongAnswerPanel();
	UpdateChuangguanData(cur_level, q_row, reward, next_reward);
}

//--
function UpdateChuangguanData(lv : int, q_row : QuestionRow, reward : LevelRewardRow , next_reward : LevelRewardRow){
	var cur_data : CurLevelData = new CurLevelData(lv, q_row, reward, next_reward);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.UPDATE_QUESTION_DESC), cur_data);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.INIT_REMAIN_TM), cur_remain_tm);
}

//--
function HandleInitRemainTime(evt : GameEvent, obj : Object){
	var remain_tm : int = Convert.ToInt32(obj);
	remain_timer = new Timer(interval,remain_tm);
	remain_timer.addEventListener(TimerEvent.TIMER,OnTimerTrigger);
	remain_timer.addEventListener(TimerEvent.TIMER_COMPLETE,OnTimerStop);
	remain_timer.Start();	
}

//--
function OnTimerTrigger(_timer : Timer,obj : Object){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.UPDATE_REMAIN_TM));
}

//--
function OnTimerStop(_timer : Timer,obj : Object){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.ANSWER_TIME_UP));
}

//--
function RandomSelectQuestion() : QuestionRow{
	var count : int = cur_question_bank_idx_array.Count;
	if(count == 0){
		return null;
	}
	Random.seed = Time.realtimeSinceStartup;
	var ran_idx : int = Random.Range(0, count - 1);
	var row : QuestionRow = question_bank_table.Item[cur_question_bank_idx_array[ran_idx]] as QuestionRow;
	cur_question_bank_idx_array.Remove(cur_question_bank_idx_array[ran_idx]);
	return row;
}

//--
function Handle_notify_start_chuangguan(evt : GameEvent, pack : notify_start_mind_quiz){
	var result : int = pack.result;
	switch(result){
		case common_bool.cb_true:
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_START_CHUANGGUAN));
			break;
		case common_bool.cb_false:
			//EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_SHOW_POWER_DIALOG),null);
			break;
	}
}

//--点击主界面的按钮后，开始加载闯关相关的表格
//--表格加载完后发出完成加载事件
function HandleClickChuangguanBtn(evt : GameEvent, obj : Object){
	if(!has_load_q_bank){
		LoadQuestionBankTable();
		LoadLevelRewardTable();
		InitCurQuesBank();
		has_load_q_bank = true;
	}
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.LOAD_Q_BANK_OK));
}

//--
function InitCurQuesBank(){
	var cnt : int = question_bank_table.Count;
	for(var i:int=1; i <= cnt; ++i){
		if(question_bank_table.ContainsKey(i)){
			cur_question_bank_idx_array.Add(i);
		}
	}
}

//--加载题库表格
function LoadQuestionBankTable(){
	var dt:XmlDataTable = new XmlDataTable();
	dt.LoadFromString(ResManager.LgtMgr.GetTable("question_bank").text);
	for(var obj:Object in dt.Table)
	{
		var row : Hashtable = obj as Hashtable;
		var r:QuestionRow = new QuestionRow();
		
		if(row.ContainsKey("id"))
			r.id = ResManager.LgtMgr.ParseInt(row["id"].ToString());
		if(row.ContainsKey("desc"))
			r.q_desc = row["desc"].ToString();
		if(row.ContainsKey("right_answer"))
			r.right_answer = row["right_answer"].ToString();
		if(row.ContainsKey("answer1"))
			r.answer1 = row["answer1"].ToString();
		if(row.ContainsKey("answer2"))
			r.answer2 = row["answer2"].ToString();
		if(row.ContainsKey("answer3"))
			r.answer3 = row["answer3"].ToString();
		
		question_bank_table.Add(r.id, r);
	}
}

//--
function LoadLevelRewardTable(){
	var dt:XmlDataTable = new XmlDataTable();
	dt.LoadFromString(ResManager.LgtMgr.GetTable("mind_quiz_tplt").text);
	for(var obj:Object in dt.Table)
	{
		var row : Hashtable = obj as Hashtable;
		var r:LevelRewardRow = new LevelRewardRow();
		
		if(row.ContainsKey("level"))
			r.level = ResManager.LgtMgr.ParseInt(row["level"].ToString());
		if(row.ContainsKey("reward_items"))
			ResManager.LgtMgr.ParseIntArray(row["reward_items"].ToString(), r.items);
		if(row.ContainsKey("reward_items_count"))
			ResManager.LgtMgr.ParseIntArray(row["reward_items_count"].ToString(), r.item_counts);
		if(row.ContainsKey("reward_diamond"))
			r.diamond = ResManager.LgtMgr.ParseInt(row["reward_diamond"].ToString());
		if(row.ContainsKey("reward_exp"))
			r.exp = ResManager.LgtMgr.ParseInt(row["reward_exp"].ToString());
		
		level_reward_table.Add(r.level, r);
	}
}

//--
function GetRewardRow(lv : int) : LevelRewardRow{
	var row : LevelRewardRow = null;
	if(level_reward_table.ContainsKey(lv)){
		row = level_reward_table.Item[lv] as LevelRewardRow;
	}
	return row;
}

//--
function HandleLoadQuesBankOk(evt : GameEvent, obj : Object){
	OpenChuangguanRoot();
}

//--
function HandleExitChuangguan(evt : GameEvent, obj : Object){
	ClearQuestionBank();
	ClearCurQuesBank();
	has_load_q_bank = false;
}

//--
function ClearCurQuesBank(){
	cur_question_bank_idx_array.Clear();
}

//--
function ClearQuestionBank(){
	question_bank_table.Clear();
	level_reward_table.Clear();
}
//--
function OpenChuangguanRoot(){
	iGUICode_ChuangguanRoot.OpenRoot();
}