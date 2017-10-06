#pragma strict

var root_wide : int = 760;
var btn_w : int = 100;
var btn_h : int = 50;
var btn_img:Texture2D;
var labelStyle : GUIStyle;
var buttonSytle : GUIStyle;
var error_msg : String = "";
static var error_type : int = 0;
static var showErrorMsgFlag : boolean = false;
// Use this for initialization
function Start ()
{
	error_msg = "  ************ " + Define.gameexception + " ************  \n" + Global.ErrorMsg;
	//--
	if(error_type == 0)
    	UI.getUI().OpenMsgbox("",Define.gameexception, Define.refresh, RefrashGame, Define.showlog, ShowErrorMsg);
    else if(error_type == 1)
    	UI.getUI().OpenMsgbox("",Define.getContent(5084),Define.refresh, RefrashGame, Define.showlog, ShowErrorMsg,Define.clearcache,ClearCache);
}

function OnGUI()
{
	if(showErrorMsgFlag){
		Screen.showCursor = true;
		var lbl_h : float = labelStyle.CalcHeight(new GUIContent(error_msg),root_wide);
		GUI.Label(Rect(0,0,root_wide,lbl_h), error_msg, labelStyle);
		if(GUI.Button(Rect(330, lbl_h + 10,btn_w, btn_h), btn_img, buttonSytle)){
			ExternalFlatform.ReloadPage();
		}
	}
}
//--
static function ShowErrorMsg(caller : iGUIElement){
	showErrorMsgFlag = true;
}
//--
static function RefrashGame(caller : iGUIElement){
	ExternalFlatform.ReloadPage();
}
//--
static function ClearCache(caller : iGUIElement){
	ExternalFlatform.OpenUrl("http://sobar.soso.com/t/87189157");
}