#pragma strict
//--喇叭组件
//var content_color : Color;
//--喇叭内容
class SpeakerContentRow{
	var id : int;
	var content : String;
}
var SpeakerContentTable : Hashtable = new Hashtable();
private var content_color : Color = new Color(255,246,0);
private var had_load : boolean = false;
private static var instance : SpeakerComp;

//--
static function getInstance() : SpeakerComp{
	return instance;
}
//--
function Awake(){
	instance = this;
	
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.SPEAKER_EDITER_UNFOCUS), HandleUnFocusSpeakerEditer);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_SPEAKERWORD), HandleNotifySpeakerWord);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_OPENSPEAKER_BTN), HandleClickSpeakerBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.LOAD_SPEAKERCONTENT_OK), HandleLoadSpeakerContentOK);
}
//--
function HandleUnFocusSpeakerEditer(evt : GameEvent, obj : Object){
	var content : String = RandSpeakerContent();
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.FILL_RAND_TEXT), content);
}
//--
function HandleNotifySpeakerWord(evt : GameEvent, obj : Object){
	var _obj : notify_chat_world = obj as notify_chat_world;
	//var p_name :String = "[" + _obj.player_name + "]:";
	var account : String = _obj.account;
	var speaker_word : String = _obj.content;
	ChatLogic.getInstance().SetTextItemOnDlgBox(account, speaker_word, CHAT_TYPE.SPEAKER);
	iGUICode_MainUI.getInstance().PlayHideBtnFlash();
	//
	var player_obj:GameObject = ScenePlayerMgr.getPlayer(_obj.account);
	if(player_obj){
		var chat_bubble:PlayerChatBubble = player_obj.GetComponent("PlayerChatBubble") as PlayerChatBubble;
		chat_bubble.show("[" + Define.speaker + "][" + _obj.player_name + "]", speaker_word, 1);
	}
	//--记录进列表中，下线后清空了
	_AddtoRecordList(_obj);
}
//--
private function _AddtoRecordList(obj : notify_chat_world){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.ADD_SPEAKERRECORD),obj);
}
static function OpenSpeakerRoot () {
	iGUICode_SpeakerRoot.OpenSpeakerRoot();
}
//--
static function CloseSpeakerRoot(){
	iGUICode_SpeakerRoot.CloseSpeakerRoot();
}
//--
private function HandleClickSpeakerBtn(evt : GameEvent, obj : Object){
	if(!had_load){
		LoadSpeakerContentTable();
		had_load = true;
	}
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.LOAD_SPEAKERCONTENT_OK));
}
//--
private function HandleLoadSpeakerContentOK(evt : GameEvent, obj : Object){
	RandSpeakerContent();
}
//--
function RandSpeakerContent() : String{
	var cnt : int = SpeakerContentTable.Count;
	if(cnt <= 0){
		return "";
	}
	
	Random.seed = Time.realtimeSinceStartup;
	var ran_idx : int = Random.Range(1, cnt);
	var ran_row : SpeakerContentRow = SpeakerContentTable.Item[ran_idx] as SpeakerContentRow;
	if(!ran_row){
		throw new Exception("----SpeakerContentTable--RowID--" + ran_idx + "is not exist!");
	}
	return ran_row.content;
}
//--------------------------------------------------
private function LoadSpeakerContentTable(){
	var dt:XmlDataTable = new XmlDataTable();
	dt.LoadFromString(ResManager.LgtMgr.GetTable("SpeakerContent").text);
	for(var obj:Object in dt.Table){
		var row : Hashtable = obj as Hashtable;
		var r:SpeakerContentRow = new SpeakerContentRow();
		
		if(row.ContainsKey("id"))
			r.id = ResManager.LgtMgr.ParseInt(row["id"].ToString());
		if(row.ContainsKey("content"))
			r.content = row["content"].ToString();
		
		SpeakerContentTable.Add(r.id, r);
	}
}