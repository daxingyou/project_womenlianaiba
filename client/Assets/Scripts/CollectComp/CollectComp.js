/*
	收集系统
	2012-07-02
	by huangdj
*/
#pragma strict

static var self_use_collect_flag : boolean = false;
static var other_use_collect_flag : boolean = false;
static var collect_end_flag : boolean = false;
function Awake(){
	// 
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_COLLECT_RESULT), HandleNotifyCollectResult);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_SEARCHING_ITEMS), HandleNotifySearchingItems);
}

function Start () {
	iGUICode_CollectRoot.OpenCollectUIRoot();
}

function HandleNotifySearchingItems(evt : GameEvent, data : notify_searching_items){
	if(data.remain_seconds <= 0){
		iGUICode_MainUI.getInstance().setCollectingStateEnabled(false);
		if(DataCenter.isInSelfHouse()){
			self_use_collect_flag = false;
		}
		else{
			other_use_collect_flag = false;
		}
	}
	else{
		if(!FitmentLogic.getInstance().inFitmenting){
			iGUICode_MainUI.getInstance().setCollectingStateEnabled(true);
		}
		if(DataCenter.isInSelfHouse()){
			self_use_collect_flag = true;
		}
		else{
			other_use_collect_flag = true;
		}
	}
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.UPDATE_SEARCHING_ITEMS), data);
}
//--
function HandleNotifyCollectResult(evt : GameEvent, data : notify_search_items_result){
	self_use_collect_flag = false;
	collect_end_flag = true;
	iGUICode_MainUI.getInstance().setCollectingStateEnabled(false);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.UPDATE_COLLECT_RESULT), data);
}
//--
static function ReqOpenStartSearchUI(){
	var req : req_open_search_items_ui = new req_open_search_items_ui();
	NetHelper.Send(req);
}
//--
static function ReqUpdateSearchItems(){
	var req : req_update_search_items = new req_update_search_items();
	NetHelper.Send(req);
}