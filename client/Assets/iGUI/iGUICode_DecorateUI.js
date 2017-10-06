#pragma strict
#pragma downcast
import iGUI;

private var mInit : boolean = false;

function Start() {
	Init();
}

public function Init() {
	BtnClose.clickCallback = CallbackMouseClickClose;
	BtnVote.clickCallback = CallbackMouseClickVote;
	
	mInit = true;
}

public function Enable(enable : boolean) {
	UI.getUI().EnableUIRoot("VoteUI",enable);
	
	if(enable) {
		if(!mInit) {
			Init();
		}
		UI.getUI().SetModal("VoteUI", true);
	} else {
		UI.getUI().SetModal("VoteUI", false);
	}
}

//callback
private function CallbackMouseClickClose(callback : iGUIElement) {
	Enable(false);
}

private function CallbackMouseClickVote(callback : iGUIElement) {
	//Enable(false);
	
	ExternalFlatform.OpenUrl("http://contest.open.qq.com/vote/pc#35398");
}

private static var instance : iGUICode_DecorateUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var BtnVote : iGUIButton;
@HideInInspector
var BtnClose : iGUIButton;
@HideInInspector
var PanFunction : iGUIPanel;
@HideInInspector
var root1 : iGUIRoot;
