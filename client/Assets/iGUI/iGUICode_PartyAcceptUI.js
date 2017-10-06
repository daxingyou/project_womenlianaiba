import iGUI;

private static var instance : iGUICode_PartyAcceptUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var cancel_btn : iGUIButton;
@HideInInspector
var ok_btn : iGUIButton;
@HideInInspector
var content_label : iGUILabel;
@HideInInspector
var frame : iGUIPanel;
@HideInInspector
var root : iGUIRoot;



private var mInvitationInfo : notify_invitation = null;					// 邀请信息
//--------------------------------------------------
function Start()
{
	// step1:界面事件注册
	ok_btn.clickCallback = ClickCallback_ok_btn;
	cancel_btn.clickCallback = ClickCallback_cancel_btn;
	// step2:初始操作
	mInvitationInfo = Party.Ctrl.Get("invitation");
	var msg : SysMsgRow = Global.GetSysMsgHandler().getSysMsgRow(500);
	content_label.label.text = msg.msg_content.Replace("{0}", mInvitationInfo.invitor_name);
}
//--------------------------------------------------
// 点击关闭按钮
function ClickCallback_ok_btn(caller : iGUIElement)
{
	if (mInvitationInfo)
	{
		Party.request_agree_invitation(mInvitationInfo.invitor, invitation_type.ivt_private_party);
	}
	ClickCallback_cancel_btn(null);
}
//--------------------------------------------------
// 点击首页按钮
function ClickCallback_cancel_btn(caller : iGUIElement)
{
	UI.getUI().SetModal("PartyAcceptUI", false);
	UI.getUI().CloseUIRoot("PartyAcceptUI");
}
//--------------------------------------------------


