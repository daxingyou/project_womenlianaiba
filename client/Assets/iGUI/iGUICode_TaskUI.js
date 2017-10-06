import iGUI;

private static var instance : iGUICode_TaskUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}


@HideInInspector
var CommTaskClose : iGUIButton;
@HideInInspector
var CommTaskImmediatelyNum: iGUILabel;
@HideInInspector
var CommTaskImmediately: iGUIButton;
@HideInInspector
var CommTaskComplete: iGUIButton;
@HideInInspector
var CommTaskItem3: iGUILabel;
@HideInInspector
var CommTaskItem2: iGUILabel;
@HideInInspector
var CommTaskItem1: iGUILabel;
@HideInInspector
var CommTaskExp : iGUILabel;
@HideInInspector
var CommTaskGold : iGUILabel;
@HideInInspector
var CommTaskTargetStep3 : iGUILabel;
@HideInInspector
var CommTaskTargetContent3 : iGUILabel;
@HideInInspector
var CommTaskTargetPanel3 : iGUIPanel;
@HideInInspector
var CommTaskTargetStep2 : iGUILabel;
@HideInInspector
var CommTaskTargetContent2 : iGUILabel;
@HideInInspector
var CommTaskTargetPanel2 : iGUIPanel;
@HideInInspector
var CommTaskTargetStep1 : iGUILabel;
@HideInInspector
var CommTaskTargetContent1 : iGUILabel;
@HideInInspector
var CommTaskTargetPanel1 : iGUIPanel;
@HideInInspector
var CommTaskMainContent : iGUILabel;
@HideInInspector
var CommTaskTitle : iGUILabel;
@HideInInspector
var CommTaskPanel : iGUIPanel;
@HideInInspector
var root : iGUIRoot;



private var mTaskInfo : task_info = null;
//--------------------------------------------------
function Start()
{
	CommTaskClose.clickCallback = Click_CommTaskClose;
//	CommTaskComplete.clickCallback = Click_CommTaskComplete;
	CommTaskImmediately.clickCallback = Click_CommTaskImmediately;
}
//--------------------------------------------------
function OnDestroy()
{
	Task.getInstance().clearAsynTaskItemCtrls();
}
//--------------------------------------------------
// 点击关闭按钮
private function Click_CommTaskClose(caller : iGUIElement) : void
{
//	Task.getInstance().closeCommTaskUI();
	UI.getUI().SetModal("TaskUI", false);
	UI.getUI().CloseUIRoot("TaskUI");
}
//--------------------------------------------------
private function Click_CommTaskComplete(caller : iGUIElement) : void
{
	Task.getInstance().clickCommTaskCompleteBtn();
}
//--------------------------------------------------
// 点击立即完成按钮
private function Click_CommTaskImmediately(caller : iGUIElement) : void
{
	Task.getInstance().requestImmediatelyTask(mTaskInfo.task_id);
}
//--------------------------------------------------
public function init(taskInfo : task_info, taskRow : PlayerTaskRow) : void
{
	mTaskInfo = taskInfo;
	//
	Task.getInstance().createAsynTaskItemCtrls();
	Task.getInstance().refreshTaskPanel(taskInfo, taskRow);
}
//--------------------------------------------------
