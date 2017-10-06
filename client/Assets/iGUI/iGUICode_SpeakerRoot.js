#pragma strict

import iGUI;

var speaker_item_id : int = 2200004;
var speaker_item_id2 : int = 2200000;
var record_name_lbl_style : GUIStyle;
var record_content_itm_style : GUIStyle;
var MAX_INPUT_NUM : int = 100;
var content_lbl_offset : int = 15;
private static var itm_order = 1;
private static var instance : iGUICode_SpeakerRoot;

@HideInInspector
var speakerRecordList : iGUIListBox;
@HideInInspector
var titleImg : iGUIImage;
@HideInInspector
var buySpeakerBtn : iGUIButton;
@HideInInspector
var closeWinBtn : iGUIButton;
@HideInInspector
var speakerCnt : iGUILabel;
@HideInInspector
var tipLabel5 : iGUILabel;
@HideInInspector
var tipLabel4 : iGUILabel;
@HideInInspector
var tipLabel3 : iGUILabel;

@HideInInspector
var limitNumTip : iGUILabel;
@HideInInspector
var tipLabel2 : iGUILabel;
@HideInInspector
var tipLabel1 : iGUILabel;
@HideInInspector
var sendBtn : iGUIButton;
@HideInInspector
var speakerEditArea : iGUITextarea;
@HideInInspector
var speakerRecordPanel : iGUIPanel;
@HideInInspector
var speakerEditPanel : iGUIPanel;
@HideInInspector
var speakerEditTabPanel : iGUITabPanel;
@HideInInspector
var speakerEditWin : iGUIPanel;
@HideInInspector
var speakerRoot : iGUIRoot;

//--
function Awake(){
	instance=this;
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.FILL_RAND_TEXT), HandleFillRandText);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.LOAD_SPEAKERCONTENT_OK), HandleLoadSpeakerContentComplete);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.ADD_SPEAKERRECORD), HandleAddSpeakerRecord);
	//EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_OPENSPEAKER_BTN), HandleClickSpeakerBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_SPEAKERWORD), HandleSetSpeakerRemainCnt);
}
//--
static function getInstance(){
	return instance;
}
@HideInInspector
var tipImage1 : iGUIImage;
//--
function Start(){
	buySpeakerBtn.clickCallback = ClickCallback_buySpeakerBtn;
	speakerEditArea.valueChangeCallback = Callback_ValueChange;
	speakerEditArea.focusCallback = Callback_EditAreaFocus;
	closeWinBtn.clickCallback = ClickCallback_closeWinBtn;
	sendBtn.clickCallback = ClickCallback_sendBtn;
}
//--
function ClickCallback_closeWinBtn(caller : iGUIElement){
	CloseSpeakerEditWin();
	CloseSpeakerRoot();
}
//--
function ClickCallback_buySpeakerBtn(caller : iGUIElement){
	PropBuyCommonLogic.getInstance().openPropBuyCommonUI(374);	// 爱情小喇叭
}
//--
function Callback_ValueChange(caller : iGUIElement){
	var _editor:iGUITextarea = caller as iGUITextarea;
	var _inputs:String = _editor.value;
	var _inputs_len:int = _inputs.Length;
	var _curLtdLen:int = MAX_INPUT_NUM - _inputs_len;
	SetLimitNum(_curLtdLen);
}
//--
function SetLimitNum(limit_num : int){
	limitNumTip.label.text = "" + limit_num;
	_ReSetLabelLength(limitNumTip ,tipLabel2);
}
//--
function ClickCallback_sendBtn(caller : iGUIElement){
	if(false == IsSpeakerExist()){
		UI.getUI().OpenMsgbox(	"",
								Define.getContent(5201),
								"",
								Callback_gotoBuy as iGUIEventCallback,
								"",
								Callback_cancelBuy as iGUIEventCallback);
		return;
	}
	ReqSendWords(speakerEditArea.value);
}
//--
function GetSpeakerNum() : int{
	return SelfItemLogic.getInstance().getItemNum(speaker_item_id)
			+ SelfItemLogic.getInstance().getItemNum(speaker_item_id2);
}
//--
function HandleSetSpeakerRemainCnt(evt : GameEvent, obj : Object){
	SetSpeakerRemainNum();
}
//--style.CalcSize(GUIContent(_head_name)).x;
function SetSpeakerRemainNum(){
	speakerCnt.label.text = "" + GetSpeakerNum();
	_ReSetLabelLength(speakerCnt ,tipLabel4);
}
//--
private function _ReSetLabelLength(ele : iGUIElement, ele1 : iGUIElement){
	var _lbl : iGUILabel = ele as iGUILabel;
	var content : String = _lbl.label.text;
	var content_len : float = _lbl.style.CalcSize(GUIContent(content)).x;
	_lbl.setWidth(content_len + 3);
	
	if(ele1){
		var _posx : float = _lbl.positionAndSize.x + _lbl.positionAndSize.width;
		ele1.setX(_posx);
	}
}
//--
function IsSpeakerExist() : boolean{
	var speaker_cnt : int = GetSpeakerNum();
	if(speaker_cnt == 0){
		return false;
	}
	return true;
}
//--
function Callback_gotoBuy(caller : iGUIElement){
	ClickCallback_buySpeakerBtn(null);
}
//--
function Callback_cancelBuy(caller : iGUIElement){

}
//--
function ReqSendWords(words : String){
	if(words == ""){
		UI.getUI().OpenMsgbox("",Define.getContent(5202),true);
		speakerEditArea.focus();
		return;
	}
	var req : req_chat_world = new req_chat_world();
	req.content = words;
	NetHelper.Send(req);
	speakerEditArea.value = "";
	//ClickCallback_closeWinBtn(null);
}
//--
function OpenSeakerRecordList(){
	speakerEditTabPanel.activePanel = 1;
}
//--
function OpenSpeakerEditArea(){
	speakerEditTabPanel.activePanel = 0;
	speakerEditArea.value = "";
}
//--
function OpenSpeakerEditWin(){
	speakerEditWin.setEnabled(true);
}
//--
function CloseSpeakerEditWin(){
	speakerEditWin.setEnabled(false);
}
//--
function HandleLoadSpeakerContentComplete(evt : GameEvent, obj : Object){
	UI.getUI().SetModal("SpeakerRoot", true);
	OpenSpeakerEditWin();
	OpenSpeakerEditArea();
	SetSpeakerRemainNum();
	SetLimitNum(MAX_INPUT_NUM);
}
//--
static function OpenSpeakerRoot(){
	if(!UI.getUI().GetUIRoot("SpeakerRoot"))
		UI.getUI().OpenUIRoot("SpeakerRoot");
}

//--
static function CloseSpeakerRoot(){
	UI.getUI().SetModal("SpeakerRoot", false);
	//if(UI.getUI().GetUIRoot("SpeakerRoot"))
	//	UI.getUI().CloseUIRoot("SpeakerRoot");
}
//--
function HandleAddSpeakerRecord(evt : GameEvent, obj : notify_chat_world){
	var _p_name : String = "[" + obj.player_name + "]";
	var _s_content : String = obj.content;
	//speakerRecordList
	var total_container : iGUIContainer = speakerRecordList.addElement("iGUIContainer") as iGUIContainer;
	total_container.setOrder(itm_order ++);
	//名字标签容器
	var container1 : iGUIContainer = total_container.addElement("iGUIContainer") as iGUIContainer;
	//container1.setOrder(itm_order ++);
	//名字标签
	var name_lbl : iGUILabel = container1.addElement("iGUILabel") as iGUILabel;
	name_lbl.style = record_name_lbl_style;
	name_lbl.refreshStyle();
	var name_txt_size : Vector2 = name_lbl.style.CalcSize(GUIContent(_p_name));
	name_lbl.label.text = _p_name;
	name_lbl.setPositionAndSize(Rect(0f, 0.5f, name_txt_size.x, name_txt_size.y));
	//时间标签
	var dNow : System.DateTime = System.DateTime.Now;
	var dNow_str : String = dNow.ToString();
	var _str : String = Define.getContent(5202, [dNow_str]);
	var tm_lbl : iGUILabel = container1.addElement("iGUILabel") as iGUILabel;
	tm_lbl.style = record_name_lbl_style;
	tm_lbl.label.text = _str;
	var tm_lbl_size : Vector2 = tm_lbl.style.CalcSize(GUIContent(_str));
	tm_lbl.setPositionAndSize(Rect(name_lbl.positionAndSize.width, 0f, tm_lbl_size.x, tm_lbl_size.y));
	container1.setHeight(name_txt_size.y);
	container1.setX(0);
	container1.setY(0);
	
	//喇叭内容
	var content_lbl : iGUILabel = total_container.addElement("iGUILabel") as iGUILabel;	
	//content_lbl.setOrder(itm_order ++);
	content_lbl.style.wordWrap = true;
	content_lbl.style = record_content_itm_style;
	content_lbl.refreshStyle();
	//content_lbl.setX(content_lbl_offset);
	var content_lbl_h : float = content_lbl.style.CalcHeight(new GUIContent(_s_content),speakerRecordList.rect.width - content_lbl_offset);
	content_lbl.setHeight(content_lbl_h);
	content_lbl.setX(0);
	content_lbl.setY(container1.positionAndSize.height);
	content_lbl.label.text = _s_content;
	total_container.setHeight(container1.positionAndSize.height + content_lbl.positionAndSize.height);
	speakerRecordList.refreshRect();
}
//--
function Callback_EditAreaFocus(caller : iGUIElement){
	var ea : iGUITextarea = caller as iGUITextarea;
	if(ea.hasFocus()){
		ea.value = "";
	}
}
//--
function OnGUI(){
	if(speakerEditWin.enabled && speakerEditTabPanel.activePanel == 0){
		if(GUI.GetNameOfFocusedControl() != "speakerEditArea" && speakerEditArea.value == "" && !sendBtn.isMouseOver){
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.SPEAKER_EDITER_UNFOCUS));
		}
	}
}
//--
function HandleFillRandText(evt : GameEvent, obj : Object){
	speakerEditArea.value = obj.ToString();
}