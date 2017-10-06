#pragma strict
#pragma downcast
/*
//player RemedyLogic manager
//creat by fullzhu 2012.8.9
//last edit at 2013.1.17 by fullzhu
*/

class RemedyAwardInfo {
	public var id : int = 0;
	public var num : int = 0;
}

private var mRemedyLevel : int = 20;
private var mMatch : MatchCollection;

private static var instance : RemedyLogic;
function Awake(){
	instance=this;
	
	RegistEventMsg();
}
static function GetInstance(){
	return instance;
}

function Start () {
}

//game event regist()
function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REMEDY_DATA), HandleNotifyRemedyData);
}

//handle game event
function HandleNotifyRemedyData(evt:GameEvent, obj:notify_make_up_info) {
	mRemedyLevel = obj.level;
	
	//EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REMEDY_BUTTON_ENABLE_UI),true);
}

//extern function
function Open() {
	UI.getUI().OpenUIRoot("RemedyUI");
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REMEDY_ENABLE_UI),true);
}

//data operate
function GetAwardList() : ArrayList {
	var row : RemedyRow = ResManager.LgtMgr.RemedyTable[mRemedyLevel];
	if(row == null) return null;
	
	var list : ArrayList = new ArrayList();
	var reg : Regex = new Regex("(\\{(\\d+),(\\d+)})");
	
	mMatch = reg.Matches(row.awards);
	
	for(var i : int = 0; i < mMatch.Count; i++) {
		var award : RemedyAwardInfo = new RemedyAwardInfo();
		var str : String = mMatch[i].Value.Replace("\r\n", "").Replace("{", "").Replace("}", "").Trim();
		var separator : String = ",";
		var wordArray : String[] = str.Split(separator[0]);
		
		award.id = ResManager.LgtMgr.ParseInt(wordArray[0]);
		award.num = ResManager.LgtMgr.ParseInt(wordArray[1]);
		
		list.Add(award);
	}
	return list;
}