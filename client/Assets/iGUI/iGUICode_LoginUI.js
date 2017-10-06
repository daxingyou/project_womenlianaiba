#pragma strict
import iGUI;

private static var instance : iGUICode_LoginUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var login_btn : iGUIButton;
@HideInInspector
var port_input : iGUITextfield;
@HideInInspector
var port : iGUILabel;
@HideInInspector
var ip_address_input : iGUITextfield;
@HideInInspector
var ip_address : iGUILabel;
@HideInInspector
var password_input : iGUIPasswordField;
@HideInInspector
var password : iGUILabel;
@HideInInspector
var user_name_input : iGUITextfield;
@HideInInspector
var user_name : iGUILabel;
@HideInInspector
var root : iGUIRoot;


function Start()
{
	login_btn.clickCallback = ClickCallback_login_btn;
}

function ClickCallback_login_btn(caller : iGUIElement)
{
	var username : String = user_name_input.value;
	var password : String = password_input.value;
	var ip : String = ip_address_input.value;
	var port : String = port_input.value;
	Login.connect(username, password, ip, port, "pengyou", "", "", 0, 0);
}