import iGUI;

private static var instance : iGUICode_TaskSelectUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}

@HideInInspector
var TaskSelectSlot20 : iGUIButton;
@HideInInspector
var TaskSelectSlot19 : iGUIButton;
@HideInInspector
var TaskSelectSlot18 : iGUIButton;
@HideInInspector
var TaskSelectSlot17 : iGUIButton;
@HideInInspector
var TaskSelectSlot16 : iGUIButton;
@HideInInspector
var TaskSelectSlot15 : iGUIButton;
@HideInInspector
var TaskSelectSlot14 : iGUIButton;
@HideInInspector
var TaskSelectSlot13 : iGUIButton;
@HideInInspector
var TaskSelectSlot12 : iGUIButton;
@HideInInspector
var TaskSelectSlot11 : iGUIButton;
@HideInInspector
var TaskSelectSlot10 : iGUIButton;
@HideInInspector
var TaskSelectSlot9 : iGUIButton;
@HideInInspector
var TaskSelectSlot8 : iGUIButton;
@HideInInspector
var TaskSelectSlot7 : iGUIButton;
@HideInInspector
var TaskSelectSlot6 : iGUIButton;
@HideInInspector
var TaskSelectSlot5 : iGUIButton;
@HideInInspector
var TaskSelectSlot4 : iGUIButton;
@HideInInspector
var TaskSelectSlot3 : iGUIButton;
@HideInInspector
var TaskSelectSlot2 : iGUIButton;
@HideInInspector
var TaskSelectSlot1 : iGUIButton;
@HideInInspector
var TaskSelectClose : iGUIButton;
@HideInInspector
var TaskSelectPanel : iGUIPanel;
@HideInInspector
var root : iGUIRoot;

private var SLOT_NUM : int = 20;

function Start()
{
	TaskSelectClose.clickCallback = Click_TaskSelectClose;
	for (var i=0; i<SLOT_NUM; ++i)
	{
		var btn : iGUIButton = getTaskSelectSlot(i);
		btn.userData = i;
		btn.clickCallback = ClickCallback_TaskSelectSlot;
	}
}

function Click_TaskSelectClose(caller : iGUIElement)
{
	Task.getInstance().closeTaskSelectUI();
}

function ClickCallback_TaskSelectSlot(caller : iGUIElement)
{
	var num : int = caller.userData;
	Task.getInstance().clickTaskSelectSlot(num);
}

public function getTaskSelectSlot(i : int) : iGUIButton
{
	if (0 == i) return TaskSelectSlot1;
	if (1 == i) return TaskSelectSlot2;
	if (2 == i) return TaskSelectSlot3;
	if (3 == i) return TaskSelectSlot4;
	if (4 == i) return TaskSelectSlot5;
	if (5 == i) return TaskSelectSlot6;
	if (6 == i) return TaskSelectSlot7;
	if (7 == i) return TaskSelectSlot8;
	if (8 == i) return TaskSelectSlot9;
	if (9 == i) return TaskSelectSlot10;
	if (10 == i) return TaskSelectSlot11;
	if (11 == i) return TaskSelectSlot12;
	if (12 == i) return TaskSelectSlot13;
	if (13 == i) return TaskSelectSlot14;
	if (14 == i) return TaskSelectSlot15;
	if (15 == i) return TaskSelectSlot16;
	if (16 == i) return TaskSelectSlot17;
	if (17 == i) return TaskSelectSlot18;
	if (18 == i) return TaskSelectSlot19;
	// 19 == i
	return TaskSelectSlot20;
}
