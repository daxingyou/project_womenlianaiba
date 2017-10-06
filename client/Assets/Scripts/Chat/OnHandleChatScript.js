#pragma strict
#pragma downcast


//--
enum CHAT_TYPE
{
	NORMAL,
	SPEAKER,
	CHAT_PRIVATE,
	CHAT_AROUND,
	CHAT_TO_OTHER_PRIVATE,
}
//--
enum INPUT_CHAT_TYPE
{
	PUBLIC_INPUT,
	PRIVATE_INPUT,
}
//--
class ChatItemClass
{
	public var account : String = "";
	public var name : String = "";
	public var content : String = "";
	public var type : CHAT_TYPE = CHAT_TYPE.CHAT_AROUND;
	//
	public function ChatItemClass(account : String, name : String, content : String, type : CHAT_TYPE)
	{
		this.account = account;
		this.name = name;
		this.content = content;
		this.type = type;
	}
}
//--------------------------------------------------
function Start()
{
	NetHelper.RegistHandler(new notify_chat_tell(), handle_notify_chat_tell);
	NetHelper.RegistHandler(new notify_chat_around(), handle_notify_chat_around);
}
//--------------------------------------------------
// 处理通知私聊内容
private function handle_notify_chat_tell(evt:GameEvent, pack:notify_chat_tell) : void
{
	ChatLogic.getInstance().SetTextItemOnDlgBox(pack.speaker, pack.content, CHAT_TYPE.CHAT_PRIVATE);
	iGUICode_MainUI.getInstance().PlayHideBtnFlash();
}
//--------------------------------------------------
// 处理通知公共聊天内容
private function handle_notify_chat_around(evt:GameEvent, pack:notify_chat_around) : void
{
	ChatLogic.getInstance().SetTextItemOnDlgBox(pack.account, pack.content, CHAT_TYPE.CHAT_AROUND);
	var player_obj : GameObject = ScenePlayerMgr.getPlayer(pack.account);
	if (player_obj)
	{
		var chat_bubble : PlayerChatBubble = player_obj.GetComponent("PlayerChatBubble");
		chat_bubble.show(pack.player_name, pack.content, 0);
	}
	iGUICode_MainUI.getInstance().PlayHideBtnFlash();
}
//--------------------------------------------------
// 请求公共聊天
public function reqChatAround(content : String) : void
{
	if (null == content || "" == content)
		return;
	
	var req_chatAround : req_chat_around = new req_chat_around();
	req_chatAround.content = content;
	NetHelper.Send(req_chatAround);
}
//--------------------------------------------------
// 请求私聊
public function reqChatPrivate(account : String, content : String) : void
{
	if (null == account || "" == account || null == content || "" == content)
		return;
	
	var req : req_chat_tell = new req_chat_tell();
	req.target_player = account;
	req.content = content;
	NetHelper.Send(req);
}
//--------------------------------------------------


