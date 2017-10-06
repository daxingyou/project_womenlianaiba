import iGUI;

@HideInInspector
var frame : iGUIPanel;
@HideInInspector
var entertainUIRoot : iGUIRoot;
@HideInInspector
var makeFoodBtn : iGUIButton;
@HideInInspector
var changeWaiterBtn : iGUIButton;

private static var instance : iGUICode_EntertainUIRoot;
private var mAutoClosed : boolean = true;
private var mIsOpened : boolean = false;

function Start(){
	init();
}
function Awake(){
	instance=this;
	registEvt();
}

function Update()
{
	if (mAutoClosed && Input.GetMouseButtonUp(0))
	{
		mIsOpened = false;
		frame.setEnabled(false);
	}
	else
	{
		mAutoClosed = true;
	}
}

function init(){
	RegistCallback();
}

private function registEvt()
{

}

private function RegistCallback(){

	makeFoodBtn.clickCallback = clickCallback_makeFoodBtn;
	changeWaiterBtn.clickCallback = clickCallback_changeWaiterBtn;
}

private function clickCallback_makeFoodBtn(caller : iGUIElement){
	destroy();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_BARTENDER_BTN));
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLOSE_ENTERTAINUI));
}

private function clickCallback_changeWaiterBtn(caller : iGUIElement){
	mAutoClosed = false;
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLOSE_ENTERTAINUI));
	openWaiterUIRoot();
}

private function destroy(){

}


private function openWaiterUIRoot(){
	WaiterLogicCenter.GetInstance().OpenWaiterUIRoot();
}

private function openFrame() : void
{
	mAutoClosed = false;
	if (mIsOpened)
	{
		mIsOpened = false;
		frame.setEnabled(false);
	}
	else
	{
		mIsOpened = true;
		frame.setEnabled(true);
	}
}

public static function openEntertainPanel(init : boolean) : void
{
	if (false == UI.isUIRootOpen("EntertainUIRoot"))
	{
		UI.getUI().OpenUIRoot("EntertainUIRoot");
	}
	if (init)
	{
		iGUICode_EntertainUIRoot.getInstance().frame.setEnabled(false);
	}
	else
	{
		iGUICode_EntertainUIRoot.getInstance().openFrame();
	}
}

static function getInstance(){
	return instance;
}
