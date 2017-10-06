#pragma strict
#pragma downcast
import iGUI;

private static var instance : iGUICode_PeiduiSuccess;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var shutdown : iGUIButton;
@HideInInspector
var gnd : iGUIWindow;
@HideInInspector
var root : iGUIRoot;

private var asynIcon : AsynIcon;

function Start () {
	asynIcon = new AsynIcon(function (tex){
								 	gnd.style.normal.background = tex; 
							}, null);	
	asynIcon.load("UI/banjia.png.u3d");
}

function OnDestroy () {
    asynIcon.cancel();
}

function shutdown_Click(caller : iGUIButton){
	ExternalFlatform.ReloadPage();
}

function OnGUI(){
	gnd.bringToFrontLate();
}