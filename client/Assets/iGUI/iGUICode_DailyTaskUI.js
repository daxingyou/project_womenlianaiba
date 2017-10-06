#pragma strict
#pragma downcast
import iGUI;

private var is_in_newguide : boolean = false;
private static var instance : iGUICode_DailyTaskUI;
function Awake(){
	instance=this;
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_DALIYTASKBTN), HandleClickDaliyTaskBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_STEP_LEAD_UI), HandleResetFlag);
}
static function getInstance(){
	return instance;
}
@HideInInspector
var label1 : iGUILabel;

@HideInInspector
var taskStep5 : iGUILabel;
@HideInInspector
var taskCompleteImm5 : iGUIButton;
@HideInInspector
var taskChange5 : iGUIButton;
@HideInInspector
var taskGetPrize5 : iGUIButton;
@HideInInspector
var taskPrizeDiamond5 : iGUILabel;
@HideInInspector
var taskPrizeExp5 : iGUILabel;
@HideInInspector
var tsakContent5 : iGUILabel;
@HideInInspector
var taskTitle5 : iGUILabel;
@HideInInspector
var taskImgMark5 : iGUILabel;
@HideInInspector
var taskImg5 : iGUILabel;
@HideInInspector
var basePanel5 : iGUIPanel;

@HideInInspector
var taskStep4 : iGUILabel;
@HideInInspector
var taskCompleteImm4 : iGUIButton;
@HideInInspector
var taskChange4 : iGUIButton;
@HideInInspector
var taskGetPrize4 : iGUIButton;
@HideInInspector
var taskPrizeDiamond4 : iGUILabel;
@HideInInspector
var taskPrizeExp4 : iGUILabel;
@HideInInspector
var tsakContent4 : iGUILabel;
@HideInInspector
var taskTitle4 : iGUILabel;
@HideInInspector
var taskImgMark4 : iGUILabel;
@HideInInspector
var taskImg4 : iGUILabel;
@HideInInspector
var basePanel4 : iGUIPanel;

@HideInInspector
var taskStep3 : iGUILabel;
@HideInInspector
var taskCompleteImm3 : iGUIButton;
@HideInInspector
var taskChange3 : iGUIButton;
@HideInInspector
var taskGetPrize3 : iGUIButton;
@HideInInspector
var taskPrizeDiamond3 : iGUILabel;
@HideInInspector
var taskPrizeExp3 : iGUILabel;
@HideInInspector
var tsakContent3 : iGUILabel;
@HideInInspector
var taskTitle3 : iGUILabel;
@HideInInspector
var taskImgMark3 : iGUILabel;
@HideInInspector
var taskImg3 : iGUILabel;
@HideInInspector
var basePanel3 : iGUIPanel;

@HideInInspector
var taskStep2 : iGUILabel;
@HideInInspector
var taskCompleteImm2 : iGUIButton;
@HideInInspector
var taskChange2 : iGUIButton;
@HideInInspector
var taskGetPrize2 : iGUIButton;
@HideInInspector
var taskPrizeDiamond2 : iGUILabel;
@HideInInspector
var taskPrizeExp2 : iGUILabel;
@HideInInspector
var tsakContent2 : iGUILabel;
@HideInInspector
var taskTitle2 : iGUILabel;
@HideInInspector
var taskImgMark2 : iGUILabel;
@HideInInspector
var taskImg2 : iGUILabel;
@HideInInspector
var basePanel2 : iGUIPanel;

@HideInInspector
var taskStep1 : iGUILabel;
@HideInInspector
var taskCompleteImm1 : iGUIButton;
@HideInInspector
var taskChange1 : iGUIButton;
@HideInInspector
var taskGetPrize1 : iGUIButton;
@HideInInspector
var taskPrizeDiamond1 : iGUILabel;
@HideInInspector
var taskPrizeExp1 : iGUILabel;
@HideInInspector
var tsakContent1 : iGUILabel;
@HideInInspector
var taskTitle1 : iGUILabel;
@HideInInspector
var taskImgMark1 : iGUILabel;
@HideInInspector
var taskImg1 : iGUILabel;
@HideInInspector
var basePanel1 : iGUIPanel;

@HideInInspector
var huangzuan : iGUIButton;
@HideInInspector
var close : iGUIButton;
@HideInInspector
var gndPanel : iGUIPanel;
@HideInInspector
var root : iGUIRoot;

@HideInInspector
var background1 : iGUILabel;
@HideInInspector
var background2 : iGUILabel;
@HideInInspector
var background3 : iGUILabel;
@HideInInspector
var background4 : iGUILabel;
@HideInInspector
var background5 : iGUILabel;


//temp
@HideInInspector
var tempicon5 : iGUILabel;
@HideInInspector
var tempx5 : iGUILabel;
@HideInInspector
var tempPrize5 : iGUILabel;
@HideInInspector
var tempicon4 : iGUILabel;
@HideInInspector
var tempx4 : iGUILabel;
@HideInInspector
var tempPrize4 : iGUILabel;
@HideInInspector
var tempicon3 : iGUILabel;
@HideInInspector
var tempx3 : iGUILabel;
@HideInInspector
var tempPrize3 : iGUILabel;
@HideInInspector
var tempicon2 : iGUILabel;
@HideInInspector
var tempx2 : iGUILabel;
@HideInInspector
var tempPrize2 : iGUILabel;
@HideInInspector
var tempicon1 : iGUILabel;
@HideInInspector
var tempx1 : iGUILabel;
@HideInInspector
var tempPrize1 : iGUILabel;


function sysnControl(arr:Array)
{
	arr.clear();
	var a1 : DailyTaskCtrl = new DailyTaskCtrl();
	a1.basePanel = basePanel1;
	a1.taskImg = taskImg1;
	a1.taskImgMark = taskImgMark1;
	a1.taskTitle = taskTitle1;
	a1.tsakContent = tsakContent1;
	a1.taskPrizeDiamond = taskPrizeDiamond1;
	a1.taskPrizeExp = taskPrizeExp1;
	a1.taskGetPrize = taskGetPrize1;
	a1.taskChange = taskChange1;
	a1.taskCompleteImm = taskCompleteImm1;
	a1.taskStep = taskStep1;
	a1.background = background1;
	arr.Add(a1);

	var a2 : DailyTaskCtrl = new DailyTaskCtrl();
	a2.basePanel = basePanel2;
	a2.taskImg = taskImg2;
	a2.taskImgMark = taskImgMark2;
	a2.taskTitle = taskTitle2;
	a2.tsakContent = tsakContent2;
	a2.taskPrizeDiamond = taskPrizeDiamond2;
	a2.taskPrizeExp = taskPrizeExp2;
	a2.taskGetPrize = taskGetPrize2;
	a2.taskChange = taskChange2;
	a2.taskCompleteImm = taskCompleteImm2;
	a2.taskStep = taskStep2;
	a2.background = background2;
	arr.Add(a2);
	
	var a3 : DailyTaskCtrl = new DailyTaskCtrl();
	arr.Add(a3);
	a3.basePanel = basePanel3;
	a3.taskImg = taskImg3;
	a3.taskImgMark = taskImgMark3;
	a3.taskTitle = taskTitle3;
	a3.tsakContent = tsakContent3;
	a3.taskPrizeDiamond = taskPrizeDiamond3;
	a3.taskPrizeExp = taskPrizeExp3;
	a3.taskGetPrize = taskGetPrize3;
	a3.taskChange = taskChange3;
	a3.taskCompleteImm = taskCompleteImm3;
	a3.taskStep = taskStep3;
	a3.background = background3;

	var a4 : DailyTaskCtrl = new DailyTaskCtrl();
	arr.Add(a4);
	a4.basePanel = basePanel4;
	a4.taskImg = taskImg4;
	a4.taskImgMark = taskImgMark4;
	a4.taskTitle = taskTitle4;
	a4.tsakContent = tsakContent4;
	a4.taskPrizeDiamond = taskPrizeDiamond4;
	a4.taskPrizeExp = taskPrizeExp4;
	a4.taskGetPrize = taskGetPrize4;
	a4.taskChange = taskChange4;
	a4.taskCompleteImm = taskCompleteImm4;
	a4.taskStep = taskStep4;
	a4.background = background4;

	var a5 : DailyTaskCtrl = new DailyTaskCtrl();
	arr.Add(a5);
	a5.basePanel = basePanel5;
	a5.taskImg = taskImg5;
	a5.taskImgMark = taskImgMark5;
	a5.taskTitle = taskTitle5;
	a5.tsakContent = tsakContent5;
	a5.taskPrizeDiamond = taskPrizeDiamond5;
	a5.taskPrizeExp = taskPrizeExp5;
	a5.taskGetPrize = taskGetPrize5;
	a5.taskChange = taskChange5;
	a5.taskCompleteImm = taskCompleteImm5;
	a5.taskStep = taskStep5;
	a5.background = background5;
	
	//temp
	a1.tempicon = tempicon1;
	a1.tempx = tempx1;
	a1.tempPrize = tempPrize1;
	a2.tempicon = tempicon2;
	a2.tempx = tempx2;
	a2.tempPrize = tempPrize2;
	a3.tempicon = tempicon3;
	a3.tempx = tempx3;
	a3.tempPrize = tempPrize3;
	a4.tempicon = tempicon4;
	a4.tempx = tempx4;
	a4.tempPrize = tempPrize4;
	a5.tempicon = tempicon5;
	a5.tempx = tempx5;
	a5.tempPrize = tempPrize5;
	
}

function Start()
{
	close.clickCallback = Click_close;
	huangzuan.clickCallback = Click_huangzuan;
	
	taskGetPrize1.clickCallback = Click_taskGetPrize1;
	taskGetPrize2.clickCallback = Click_taskGetPrize2;
	taskGetPrize3.clickCallback = Click_taskGetPrize3;
	taskGetPrize4.clickCallback = Click_taskGetPrize4;
	taskGetPrize5.clickCallback = Click_taskGetPrize5;
	
	taskCompleteImm1.clickCallback = Click_taskCompleteImm1;
	taskCompleteImm2.clickCallback = Click_taskCompleteImm2;
	taskCompleteImm3.clickCallback = Click_taskCompleteImm3;
	taskCompleteImm4.clickCallback = Click_taskCompleteImm4;
	taskCompleteImm5.clickCallback = Click_taskCompleteImm5;
	
	taskChange1.clickCallback = Click_taskChange1;
	taskChange2.clickCallback = Click_taskChange2;
	taskChange3.clickCallback = Click_taskChange3;
	taskChange4.clickCallback = Click_taskChange4;
	taskChange5.clickCallback = Click_taskChange5;

}

function Click_close(caller : iGUIElement)
{
	Task.getInstance().closeDailyUI();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_DAILY_TASKUI));
}

function Click_huangzuan(caller : iGUIElement)
{
	DiamondLogic.GetInstance().OpenRecharge();
}

function Click_taskGetPrize1(caller : iGUIElement)
{
	Task.getInstance().clickGetPrizeButton(0);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_GETPRIZE_BTN));
}
function Click_taskGetPrize2(caller : iGUIElement)
{
	Task.getInstance().clickGetPrizeButton(1);
}
function Click_taskGetPrize3(caller : iGUIElement)
{
	Task.getInstance().clickGetPrizeButton(2);
}
function Click_taskGetPrize4(caller : iGUIElement)
{
	Task.getInstance().clickGetPrizeButton(3);
}
function Click_taskGetPrize5(caller : iGUIElement)
{
	Task.getInstance().clickGetPrizeButton(4);
}
function Click_taskCompleteImm1(caller : iGUIElement)
{
	if(is_in_newguide){
		return;
	}
	Task.getInstance().clickImmdiateCompleteButton(0);
}
function Click_taskCompleteImm2(caller : iGUIElement)
{
	Task.getInstance().clickImmdiateCompleteButton(1);
}
function Click_taskCompleteImm3(caller : iGUIElement)
{
	Task.getInstance().clickImmdiateCompleteButton(2);
}
function Click_taskCompleteImm4(caller : iGUIElement)
{
	Task.getInstance().clickImmdiateCompleteButton(3);
}
function Click_taskCompleteImm5(caller : iGUIElement)
{
	Task.getInstance().clickImmdiateCompleteButton(4);
}
function Click_taskChange1(caller : iGUIElement)
{
	if(is_in_newguide){
		return;
	}
	
	Task.getInstance().clickChangeTaskButton(0);
}
function Click_taskChange2(caller : iGUIElement)
{
	Task.getInstance().clickChangeTaskButton(1);
}
function Click_taskChange3(caller : iGUIElement)
{
	Task.getInstance().clickChangeTaskButton(2);
}
function Click_taskChange4(caller : iGUIElement)
{
	Task.getInstance().clickChangeTaskButton(3);
}
function Click_taskChange5(caller : iGUIElement)
{
	Task.getInstance().clickChangeTaskButton(4);
}


function taskImgMark1_MouseOver(caller : iGUILabel){
	
}

function taskImgMark4_MouseOver(caller : iGUILabel){
	
}

function HandleClickDaliyTaskBtn(evt : GameEvent, obj : Object){
	is_in_newguide = true;
}

function HandleResetFlag(evt : GameEvent, obj : Object){
	is_in_newguide = false;
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_DALIYTASKBTN), HandleClickDaliyTaskBtn);
}