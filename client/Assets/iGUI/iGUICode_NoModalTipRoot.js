#pragma strict

import iGUI;

var lbl_pos:Vector2;
var lbl_width:float;
var lbl_style:GUIStyle;
private var msg_lbl1:iGUIElement;
private var msg_lbl2:iGUIElement;
private var msg_lbl3:iGUIElement;
private var msg_lbl_list:Array = new Array();
private var msg_lbl_count:int = 3;
private var msgLbl_life:float = 2.0;
private static var lbl_order:int = 0;
private static var lblInfo_list:Array = new Array();
private static var instance : iGUICode_NoModalTipRoot; 

private var msg_lbl1_oldtxt:String = "";
private var msg_lbl2_oldtxt:String = "";
private var msg_lbl3_oldtxt:String = "";

class LblInfo
{
	var ele:iGUIElement;
	var create_tm:float;
	var life:float;
	
	public function LblInfo(ele:iGUIElement,create_tm:float,life:float){
		this.ele = ele;
		this.create_tm = create_tm;
		this.life = life;
	}
}

function Awake(){
	instance=this;
}

static function getInstance(){
	return instance; 
}
@HideInInspector
var noModalTipRoot : iGUIRoot;

//--create simple style msg tip
private function _createMsgLabel(msg:String):iGUILabel{
	var lbl:iGUILabel = noModalTipRoot.addElement("iGUILabel") as iGUILabel;
	lbl.setOrder(lbl_order);
	++ lbl_order;
	lbl.style = lbl_style;
	lbl.setPosition(lbl_pos);
	var lbl_height:float = lbl.style.CalcHeight(GUIContent(msg),lbl_width);
	lbl.setWidth(lbl_width);
	lbl.setHeight(lbl_height);
	lbl.label.text = "";
	return lbl;
} 
//--
private function _relocateAllLabelsPos(){
	for(var idx:int=1; idx < msg_lbl_count; ++idx){
	 	(msg_lbl_list[idx] as iGUILabel).setY((msg_lbl_list[idx-1] as iGUILabel).positionAndSize.y-(msg_lbl_list[idx] as iGUILabel).positionAndSize.height);
	}
	
}
//--
public function CreateMsgLabel(msg:String){
	Debug.Log("----++ Log Msg content ++--------"+msg);
	 if(msg_lbl_list.Count == 0){
		 for(var i:int=0; i<msg_lbl_count;++ i){
		 	var lbl:iGUILabel = _createMsgLabel(msg);
		 	lbl.setEnabled(false);
		 	msg_lbl_list.Add(lbl);
		 	var lbl_info:LblInfo = new LblInfo(lbl,0,msgLbl_life);
			lblInfo_list.Add(lbl_info);
		 }
		 _relocateAllLabelsPos();
	 }
	 if(msg != ""){
	 	var msg_lbl1:iGUIElement = msg_lbl_list[0] as iGUIElement;
		 if(msg_lbl1.enabled == false){
		 	var lbl_height:float = (msg_lbl_list[0] as iGUILabel).style.CalcHeight(GUIContent(msg),lbl_width);
		 	(msg_lbl_list[0] as iGUIElement).setHeight(lbl_height);
		 	(msg_lbl_list[0] as iGUILabel).label.text = msg;
		 	_UpdateLblShowTime(0);
		 }
		 else{
		 	var msg_lbl2:iGUIElement = msg_lbl_list[1] as iGUIElement;
		 	if(msg_lbl2.enabled == false){
			 	(msg_lbl_list[1] as iGUILabel).label.text = (msg_lbl_list[0] as iGUILabel).label.text;
		 		var lbl_height1:float = (msg_lbl_list[1] as iGUILabel).style.CalcHeight(GUIContent((msg_lbl_list[0] as iGUILabel).label.text),lbl_width);
		 		(msg_lbl_list[1] as iGUIElement).setHeight(lbl_height1);
			 	_UpdateLblShowTime(1);
		 		var lbl_height0:float = (msg_lbl_list[0] as iGUILabel).style.CalcHeight(GUIContent(msg),lbl_width);
		 		(msg_lbl_list[0] as iGUIElement).setHeight(lbl_height0);
			 	(msg_lbl_list[0] as iGUILabel).label.text = msg;
			 	_UpdateLblShowTime(0);
		 	}
		 	else{
		 		var lbl_height22:float = (msg_lbl_list[0] as iGUILabel).style.CalcHeight(GUIContent((msg_lbl_list[1] as iGUILabel).label.text),lbl_width);
		 		(msg_lbl_list[2] as iGUIElement).setHeight(lbl_height22);
		 		(msg_lbl_list[2] as iGUILabel).label.text = (msg_lbl_list[1] as iGUILabel).label.text;
		 		_UpdateLblShowTime(2);
		 		(msg_lbl_list[1] as iGUILabel).label.text = (msg_lbl_list[0] as iGUILabel).label.text;
		 		var lbl_height11:float = (msg_lbl_list[0] as iGUILabel).style.CalcHeight(GUIContent((msg_lbl_list[0] as iGUILabel).label.text),lbl_width);
		 		(msg_lbl_list[1] as iGUIElement).setHeight(lbl_height11);
		 		_UpdateLblShowTime(1);
		 		var lbl_height00:float = (msg_lbl_list[0] as iGUILabel).style.CalcHeight(GUIContent(msg),lbl_width);
		 		(msg_lbl_list[0] as iGUIElement).setHeight(lbl_height00);
			 	(msg_lbl_list[0] as iGUILabel).label.text = msg;
			 	_UpdateLblShowTime(0);
			 	
			 	
		 	}
		 }
		 _relocateAllLabelsPos();
	 }
}
//--
function _UpdateLblShowTime(idx:int){
	var _win : iGUILabel = msg_lbl_list[idx] as iGUILabel;
	noModalTipRoot.setEnabled(true);
	_win.setEnabled(true);
	if(idx == 1)
		(lblInfo_list[idx] as LblInfo).create_tm = (lblInfo_list[idx-1] as LblInfo).create_tm + msgLbl_life;
	else if(idx == 2)
		(lblInfo_list[idx] as LblInfo).create_tm = (lblInfo_list[idx-1] as LblInfo).create_tm + msgLbl_life;
	else
		(lblInfo_list[idx] as LblInfo).create_tm = Time.time;
}
//--
function _SetMsgLblEnable(ele:iGUIElement){
	if(!ele.enabled)
		ele.setEnabled(true);
	var lbl_info:LblInfo = new LblInfo(ele,Time.time,msgLbl_life);
	lblInfo_list.Add(lbl_info);
}
//--
function OnGUI(){
	if(lblInfo_list.Count == 0)
	{
		return;
	}
	for(var i:int=0; i<lblInfo_list.Count; ++i)
	{
		if((lblInfo_list[i] as LblInfo).create_tm != 0){
		 	if(Time.time - (lblInfo_list[i] as LblInfo).create_tm >= (lblInfo_list[i] as LblInfo).life)
		 	{
		 	 	(lblInfo_list[i] as LblInfo).ele.setEnabled(false);
		 	 	(lblInfo_list[i] as LblInfo).create_tm = 0;
		 	}
		 }
	}
}