#pragma strict
#pragma downcast
import iGUI;

@HideInInspector
var CommemorationDay_panel : iGUIPanel;
@HideInInspector
var CommemorationDay_canlendar : iGUIPanel;
@HideInInspector
var CommemorationDay_year : iGUILabel;
@HideInInspector
var CommemorationDay_month : iGUILabel;
@HideInInspector
var CommemorationDay_day : iGUILabel;
@HideInInspector
var CommemorationDay_log : iGUILabel;
@HideInInspector
var CommemorationDay_edit : iGUIButton;
@HideInInspector
var CommemorationDay_del : iGUIButton;
@HideInInspector
var CommemorationDay_lock : iGUIImage;


function CommemorationDay_del_Click(caller : iGUIButton){
	UI.getUI().OpenMsgbox("", Define.getContent(5214), Define.ok, CommemorationDay_del_confirm as iGUIEventCallback, Define.cancel, CommemorationDay_del_cancel as iGUIEventCallback);
}

function CommemorationDay_del_confirm()
{
	Debug.Log("req_delete_commemoration");
	var req:req_delete_commemoration = new req_delete_commemoration();
	req.house_id = DataCenter.getSelfHouseID();
	req.id = CommemorationDay_panel.userData;
	NetHelper.Send(req);
	
	CommemorationDayMgr.getSingleton().mCurPage = 1;
	CommemorationDayMgr.getSingleton().reqCommemorationDay();
}

function CommemorationDay_del_cancel()
{
	
}

function CommemorationDay_edit_Click(caller : iGUIButton){
	iGUICode_MainUI.getInstance().CommemorationDayModify_panel.enabled = true;
	iGUICode_MainUI.getInstance().CommemorationDayModify_panel.passive = false;
	iGUICode_MainUI.getInstance().CommemorationDayView_panel.passive = true;
	CommemorationDayMgr.getSingleton().mModifyingDayID = CommemorationDay_panel.userData;
	
	iGUICode_MainUI.getInstance().CommemorationDayModify_title.label.text = Define.getContent(5215);
	iGUICode_MainUI.getInstance().CommemorationDayModify_log.value = CommemorationDay_log.label.text;
	
	var day:commemoration_day = CommemorationDayMgr.getSingleton().getModifyingCommemorationDay();
	if(day != null){
		iGUICode_MainUI.getInstance().CommemorationDayModify_year.selectedIndex = day.time.year-1970;
		iGUICode_MainUI.getInstance().CommemorationDayModify_month.selectedIndex = day.time.month-1;
		iGUICode_MainUI.getInstance().CommemorationDayModify_RefrestDays();
		iGUICode_MainUI.getInstance().CommemorationDayModify_day.selectedIndex = day.time.day-1;
		iGUICode_MainUI.getInstance().CommemorationDayModify_lock.values[0] = day.show_other>0?false:true;
	}
	
	var length : int = 140 - iGUICode_MainUI.getInstance().CommemorationDayModify_log.value.Length;
	iGUICode_MainUI.getInstance().CommemorationDayModify_WordsLimit.label.text = length.ToString();
}

function CommemorationDay_log_MouseOver(caller : iGUILabel){
	//CommemorationDay_edit.enabled = DataCenter.isInSelfHouse();
	//CommemorationDay_del.enabled = DataCenter.isInSelfHouse();
}

function CommemorationDay_log_MouseOut(caller : iGUILabel){
	//CommemorationDay_edit.enabled = false;
	//CommemorationDay_del.enabled = false;
}
