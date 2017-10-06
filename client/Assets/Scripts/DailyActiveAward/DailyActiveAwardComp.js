#pragma strict

class DailyActiveRewardRow{
	var score : int = 0;
	var items : Array = new Array();
	var item_counts : Array = new Array();
	var diamond : int = 0;
	var exp : int = 0;
	var point : int = 0;
}

private var has_load_table : boolean = false;
private var daily_active_reward_table : Hashtable = new Hashtable();
private static var instance : DailyActiveAwardComp = null;

function Awake () {
	instance = this;
	RegistEvt();
}

static function GetInstance(){
	return instance;
}

function Start(){
	RegistNetEvt();
}

function RegistEvt () {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_DAILY_ACTIVE), HandleExitDailyActive);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_ACTIVE_AWARD_BTN), HandleClickActiveAwardBtn);
}

function RegistNetEvt(){
	NetHelper.RegistHandler(new notify_daily_reward_ui(), Handle_notify_daily_reward_ui);
	NetHelper.RegistHandler(new notify_daily_active_can_reward(), Handle_notify_can_reward);
}

function HandleClickActiveAwardBtn(evt : GameEvent, obj : Object){
	ReqOpenActiveAwardUI();
}

function ReqOpenActiveAwardUI(){
	var req : req_daily_reward_ui = new req_daily_reward_ui();
	NetHelper.Send(req);
}

function Handle_notify_can_reward(evt : GameEvent, pack : notify_daily_active_can_reward){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_CAN_REWARD));
}

function Handle_notify_daily_reward_ui(evt:GameEvent, pack:notify_daily_reward_ui){
	if(!has_load_table){
		LoadDailyActiveRewardTable();
		has_load_table = true;
	}
	OpenDailyRewardUI();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_HAS_REWARD_LIST), pack.has_reward_list);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_ACTIVE_ITEMS_DATA), pack.progress_list);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_ACTIVE_SCORES), pack.reward_score_list);
}

function GetRewardRow(score : int){
	var row : DailyActiveRewardRow = null;
	if(daily_active_reward_table.ContainsKey(score)){
		row = daily_active_reward_table.Item[score] as DailyActiveRewardRow;
	}
	
	return row;
}

function LoadDailyActiveRewardTable(){
	var dt:XmlDataTable = new XmlDataTable();
	dt.LoadFromString(ResManager.LgtMgr.GetTable("daily_active_score_tplt").text);
	for(var obj:Object in dt.Table)
	{
		var row : Hashtable = obj as Hashtable;
		var r:DailyActiveRewardRow = new DailyActiveRewardRow();
		
		if(row.ContainsKey("score"))
			r.score = ResManager.LgtMgr.ParseInt(row["score"].ToString());
		if(row.ContainsKey("reward_items"))
			ResManager.LgtMgr.ParseIntArray(row["reward_items"].ToString(), r.items);
		if(row.ContainsKey("reward_items_count"))
			ResManager.LgtMgr.ParseIntArray(row["reward_items_count"].ToString(), r.item_counts);
		if(row.ContainsKey("diamond"))
			r.diamond = ResManager.LgtMgr.ParseInt(row["diamond"].ToString());
		if(row.ContainsKey("exp"))
			r.exp = ResManager.LgtMgr.ParseInt(row["exp"].ToString());
		if(row.ContainsKey("point"))
			r.point = ResManager.LgtMgr.ParseInt(row["point"].ToString());
		
		daily_active_reward_table.Add(r.score, r);
	}
}

function HandleExitDailyActive(evt : GameEvent, obj : Object){
	ClearTable();
}

function ClearTable(){
	daily_active_reward_table.Clear();
	has_load_table = false;
}

function OpenDailyRewardUI(){
	iGUICode_DaliyActiveRoot.OpenRoot();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.OPEN_ACTIVE_AWARD_UI));
}