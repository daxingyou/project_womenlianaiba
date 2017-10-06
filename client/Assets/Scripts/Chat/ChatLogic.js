#pragma strict
#pragma downcast
import iGUI;

private var MAX_CHAT_ROW : int = 50;
private var mChatHistory : ChatHistory = new ChatHistory(5);
private var mChatItemOrder : int = 0;
private var mCurChatToPlayerAccount : String = "";
private var mIsChatboxBig : boolean = false;
// 可在编辑面板编辑
public var ScrollbarWidth : float = 15.0f;
public var ChatLineFont : Font;
public var PublicChatOutputColor : Color = Color(1, 1, 1);
public var SpeakerChatOuputColor : Color = Color(255, 246, 0);
public var PublicChatInputColor : Color = Color(0.3, 0.3, 0.3);
public var PrivateChatInputColor : Color = Color(1, 0.35294118, 0);
public var PlayerNameLabelMaxLength : float = 200.0f;
public var ChatBoxSmallSizeHeight : float = 123;
public var ChatBoxLargeSizeHeight : float = 345;
//--------------------------------------------------
private static var instance : ChatLogic;
public static function getInstance() : ChatLogic
{
	return instance;
}
//--------------------------------------------------
function Awake()
{
	instance = this;
}
//--------------------------------------------------
private function CheckIsGmCommand(input : String) : boolean
{
	return input.StartsWith(GmCtrl.gm_tag);
}
//--------------------------------------------------
private function SendGmCommand(input : String) : void
{
	GmCtrl.AnalysisCommand(input);
}
//--------------------------------------------------





/***************************************************
*** 界面逻辑
***************************************************/
private var mSetChatControls : boolean = false;
private var mDlgContainer : iGUIContainer = null;
private var mOutputContainer : iGUIContainer = null;
private var mOutputBackground : iGUIPanel = null;
private var mOutputListbox : iGUIListBox = null;
private var mInputContainer : iGUIPanel = null;
private var mInputBoxParent : iGUIPanel = null;
private var mInputBox : iGUITextfield = null;
private var mPrivateToName : iGUILabel = null;
private var mCancelPrivateChat : iGUIButton = null;
private var mChatMenuPanel : iGUIPanel = null;
private var mAttentionBtn : iGUIButton = null;
private var mPrivateChatBtn : iGUIButton = null;
private var mVisitBtn : iGUIButton = null;
private var mSizeChatBoxBtn : iGUIButton = null;
//--------------------------------------------------
function OnGUI()
{
	if (false == mSetChatControls)
		return;
	
	handleKeyCodeEnter();
	handleKeyCodeUpDown();
	handleRemoveOverFlowRow();
	handleChatMenu();
}
//--------------------------------------------------
// 初始设置聊天框控件
public function setChatControls(ui_arr : Array) : void
{
	mSetChatControls = true;
	mDlgContainer = ui_arr[0];
	mOutputContainer = ui_arr[1];
	mOutputBackground = ui_arr[2];
	mOutputListbox = ui_arr[3];
	mInputContainer = ui_arr[4];
	mInputBoxParent = ui_arr[5];
	mInputBox = ui_arr[6];
	mPrivateToName = ui_arr[7];
	mCancelPrivateChat = ui_arr[8];
	mChatMenuPanel = ui_arr[9];
	mAttentionBtn = ui_arr[10];
	mPrivateChatBtn = ui_arr[11];
	mVisitBtn = ui_arr[12];
	mSizeChatBoxBtn = ui_arr[13];
	// 事件注册
	mChatMenuPanel.setEnabled(false);
	mInputBox.enterKeyCallback = EnterKeyCallback_InputBox;
	mInputBox.focusCallback = FocusCallback_InputBox;
	mCancelPrivateChat.clickCallback = ClickCallback_CancelPrivateChat;
	mAttentionBtn.clickCallback = ClickCallback_AttentionBtn;
	mPrivateChatBtn.clickCallback = ClickCallback_ChatPrivate;
	mVisitBtn.clickCallback = ClickCallback_VisitBtn;
	mSizeChatBoxBtn.clickCallback = ClickCallback_SizeChatBoxBtn;
	//
	ChangeInputChatColor(INPUT_CHAT_TYPE.PUBLIC_INPUT);
}
//--------------------------------------------------
private function handleKeyCodeEnter() : void
{
	if (Input.GetKey(KeyCode.Return))
	{
		if (mInputBox.hasFocus())
		{
			mInputBox.unFocus();
		}
		else
		{
			mInputBox.userData = mPrivateToName.enabled ? INPUT_CHAT_TYPE.PRIVATE_INPUT : INPUT_CHAT_TYPE.PUBLIC_INPUT;
			mInputBox.focus();
		}
	}
}
//--------------------------------------------------
private function handleKeyCodeUpDown() : void
{
	if (null == mChatHistory || !mInputBox.hasFocus())
		return;
	
	var content : String = mChatHistory.handleKeyCodeUpDown();
	if ("" == content)
		return;
	
	mInputBox.value = content;
}
//--------------------------------------------------
private function handleRemoveOverFlowRow() : void
{
	// 删除超过50行的行
	if (mOutputListbox.itemCount > MAX_CHAT_ROW)
	{
		mOutputListbox.removeElement(mOutputListbox.items[0]);
	}
}
//--------------------------------------------------
private function handleChatMenu() : void
{
	// 鼠标左键按下
	if (Input.GetMouseButtonDown(0))
	{
		hideChatMenu(false);
	}
}
//--------------------------------------------------
private function ReqChateNameInfo_LatestVersion(account : String, ctrl : iGUIContainer) : void
{
	var info : ChatNameInfo_LatestVersion = new ChatNameInfo_LatestVersion();
	info.account = account;
	info.ChatItemContainer = ctrl;
	info.DialogContainer = mDlgContainer;
	info.output_listBox = mOutputListbox;
	Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(account, info);
}
//--------------------------------------------------
// 在对话框中显示聊天内容
public function SetTextItemOnDlgBox(account : String, content : String, type : CHAT_TYPE) : void
{
	if (null == account || "" == account || null == content || "" == content)
		return;
	
	var chat_itm : iGUIContainer = mOutputListbox.addSmartObject("PrivateChatItemContainer") as iGUIContainer;
	if (null == chat_itm || null == chat_itm.gameObject)
		return;
	
	chat_itm.setOrder(mChatItemOrder++);
	chat_itm.userData = new ChatItemClass(account, "", content, type);
	var private_content_container : iGUIContainer = chat_itm.items[0];
	var reply_btn : iGUIButton = private_content_container.items[1];
	reply_btn.setEnabled(!ScenePlayerMgr.isMainPlayer(account));
	ReqChateNameInfo_LatestVersion(account, chat_itm);
	mOutputListbox.scrollToBottom(0);
	mOutputListbox.refreshRect();
}
//--------------------------------------------------
// 改变输入框颜色
private function ChangeInputChatColor(type : INPUT_CHAT_TYPE) : void
{
	if (INPUT_CHAT_TYPE.PRIVATE_INPUT == type)
	{
		mCancelPrivateChat.setEnabled(true);
		mPrivateToName.setEnabled(true);
		mInputBox.style.normal.textColor = PrivateChatInputColor;
		mInputBox.setX(mPrivateToName.positionAndSize.x + mPrivateToName.positionAndSize.width);
		mInputBox.setWidth(mInputBoxParent.positionAndSize.width - mPrivateToName.positionAndSize.width - mCancelPrivateChat.positionAndSize.width);
	}
	else if (INPUT_CHAT_TYPE.PUBLIC_INPUT == type)
	{
		mCancelPrivateChat.setEnabled(false);
		mPrivateToName.setEnabled(false);
		mInputBox.style.normal.textColor = PublicChatInputColor;
		mInputBox.setX(0);
		mInputBox.setWidth(mInputBoxParent.positionAndSize.width);
	}
	mInputBox.setValue("");
	mInputBox.userData = type;
}
//--------------------------------------------------
// 发送私聊内容
private function SendPrivateContent(account : String, content : String) : void
{
	if ("" != account && "" != content)
	{
		var filter_input_string : String = Global.GetKeyWordShield().Search(content);
		SetTextItemOnDlgBox(account, filter_input_string, CHAT_TYPE.CHAT_TO_OTHER_PRIVATE);
		Global.GetHandleChatMgr().reqChatPrivate(account, filter_input_string);
	}
	//
	mCurChatToPlayerAccount = "";
	ChangeInputChatColor(INPUT_CHAT_TYPE.PUBLIC_INPUT);
}
//--------------------------------------------------
// 发送公共聊天内容
private function SendChatAroundContent(account : String, content : String) : void
{
	if ("" == account || "" == content)
		return;
	
	var filter_input_string : String = Global.GetKeyWordShield().Search(content);
	SetTextItemOnDlgBox(account, filter_input_string, CHAT_TYPE.CHAT_AROUND);
	Global.GetHandleChatMgr().reqChatAround(filter_input_string);
	// 主玩家聊天泡泡
	var chat_bubble : PlayerChatBubble = ScenePlayerMgr.getMainPlayer().GetComponent("PlayerChatBubble");
	chat_bubble.show(DataCenter.getCurPlayerName(), filter_input_string, 0);
}
//--------------------------------------------------
// 发送聊天内容
public function sendChatContent() : void
{
	var inputContent : String = mInputBox.value.Replace("\n", "").Trim();
	var chatType : INPUT_CHAT_TYPE = mInputBox.userData;
	mInputBox.setValue("");
	if ("" == inputContent)		// 无输入内容
	{
		if (INPUT_CHAT_TYPE.PRIVATE_INPUT == chatType)
		{
			SendPrivateContent("", "");
		}
		return;
	}
	// 有输入内容
	if (CheckIsGmCommand(inputContent))		// GM指令
	{
		SendGmCommand(inputContent);
	}
	else
	{
		if (INPUT_CHAT_TYPE.PUBLIC_INPUT == chatType)			// 公共聊天
		{
			SendChatAroundContent(DataCenter.getMainPlayerAccount(), inputContent);
		}
		else if (INPUT_CHAT_TYPE.PRIVATE_INPUT == chatType)		// 私聊
		{
			SendPrivateContent(mCurChatToPlayerAccount, inputContent);
		}
	}
	// 保存到聊天历史记录
	mChatHistory.pushChatHistory(inputContent);
}
//--------------------------------------------------
// 在对话框中显示文本内容
public function setTextItemOnListbox(content : String, text_color : Color) : void
{
	if (null == content || "" == content)
		return;
	
	// 在Listbox里创建文本显示标签元素
	var newTxtLabel : iGUILabel = mOutputListbox.addElement("iGUILabel");
	if (null == newTxtLabel || null == newTxtLabel.gameObject)
		return;
	
	// 设置标签元素属性
	newTxtLabel.setOrder(mChatItemOrder++);
	newTxtLabel.style.wordWrap = true;
	newTxtLabel.style.font = ChatLineFont;
	newTxtLabel.style.fontStyle = FontStyle.Bold;
	newTxtLabel.labelColor = text_color;
	newTxtLabel.refreshStyle();
	var height : float = newTxtLabel.style.CalcHeight(new GUIContent(content), mOutputListbox.rect.width - ScrollbarWidth);
	newTxtLabel.setHeight(height);
	newTxtLabel.label.text = content;
	// 
	mOutputListbox.scrollToBottom(0);
	mOutputListbox.refreshRect();
}
//--------------------------------------------------
public function GetChatPlayerShortName(ctrl : iGUIButton, name : String) : String
{
	var prefix : String = "[...]";
	var prefix_width : float = ctrl.style.CalcSize(GUIContent(prefix)).x;
	var match_max_len_name : float = PlayerNameLabelMaxLength - prefix_width;
	var name_len : float = ctrl.style.CalcSize(GUIContent(name)).x;
	
	if (name_len > match_max_len_name)
		return Global.limitTextLength(name, match_max_len_name, Define.noname, "...");
	
	return name;
}
//--------------------------------------------------
// 响应输入框的回车按键事件
private function EnterKeyCallback_InputBox(caller : iGUIElement) : void
{
	sendChatContent();
	mInputBox.focus();
}
//--------------------------------------------------
// 响应输入框的聚焦事件
private function FocusCallback_InputBox(caller : iGUIElement) : void
{
	mChatHistory.openChatHistory();
}
//--------------------------------------------------
// 点击取消私聊按钮回调
private function ClickCallback_CancelPrivateChat(caller : iGUIElement) : void
{
	ChangeInputChatColor(INPUT_CHAT_TYPE.PUBLIC_INPUT);
}
//--------------------------------------------------
// 点击私聊按钮回调
public function ClickCallback_ChatPrivate(caller : iGUIElement) : void
{
	var chat_data : ChatItemClass = caller.userData;
	var extend_short_name : String = Define.secret + "[" + GetChatPlayerShortName(caller, chat_data.name) + "]:";
	mPrivateToName.label.text = extend_short_name;
	mPrivateToName.label.tooltip = chat_data.name;
	var short_name_len : float = mPrivateToName.style.CalcSize(GUIContent(extend_short_name)).x;
	mPrivateToName.setWidth(short_name_len);
	mCurChatToPlayerAccount = chat_data.account;
	ChangeInputChatColor(INPUT_CHAT_TYPE.PRIVATE_INPUT);
	mInputBox.focus();
	hideChatMenu(true);
}
//--------------------------------------------------
// 点击关注按钮回调
private function ClickCallback_AttentionBtn(caller : iGUIElement) : void
{
	var chat_data : ChatItemClass = caller.userData;
	FollowLogic.GetInstance().AddAttention(chat_data.account);
	hideChatMenu(true);
}
//--------------------------------------------------
// 点击拜访按钮回调
private function ClickCallback_VisitBtn(caller : iGUIElement) : void
{
	var chat_data : ChatItemClass = caller.userData;
	PlayerFriend.GetInstance().ReqEnterFriendHouse(chat_data.account, enter_house_type.eht_menu);
	hideChatMenu(true);
}
//--------------------------------------------------
// 显示聊天菜单面板
public function showChatMenu(caller : iGUIElement) : void
{
	mChatMenuPanel.setEnabled(true);
	mAttentionBtn.userData = caller.userData;
	mPrivateChatBtn.userData = caller.userData;
	mVisitBtn.userData = caller.userData;
	// 设置位置
	var y : float = Screen.height - Input.mousePosition.y;
	if (y + mChatMenuPanel.rect.height > mInputContainer.rect.y)
	{
		y = mInputContainer.rect.y - mChatMenuPanel.rect.height;
	}
	mChatMenuPanel.setPosition(Vector2(caller.rect.xMax + 5, y));
}
//--------------------------------------------------
// 隐藏聊天菜单面板
private function hideChatMenu(direct_hide : boolean) : void
{
	if (false == mChatMenuPanel.enabled)
		return;
	
	var hide : boolean = false;
	if (direct_hide)
	{
		hide = true;
	}
	else
	{
		if (!(mAttentionBtn.isMouseOver || mPrivateChatBtn.isMouseOver || mVisitBtn.isMouseOver))
		{
			hide = true;
		}
	}
	if (hide)
	{
		mChatMenuPanel.setEnabled(false);
		mAttentionBtn.userData = null;
		mPrivateChatBtn.userData = null;
		mVisitBtn.userData = null;
	}
}
//--------------------------------------------------
// 点击缩放聊天框按钮
private function ClickCallback_SizeChatBoxBtn(caller : iGUIElement) : void
{
	// step1:
	mIsChatboxBig = !mIsChatboxBig;
	// step2:
	changeSizeChatboxBtnStyle(mIsChatboxBig);
	var new_height : float = mIsChatboxBig ? ChatBoxLargeSizeHeight : ChatBoxSmallSizeHeight;
	var height_differ : float = mOutputContainer.rect.height - new_height;
	mOutputContainer.setHeight(new_height);
	var rct : Rect = mDlgContainer.positionAndSize;
	mDlgContainer.setPositionAndSize(Rect(rct.x, rct.y + height_differ, rct.width, rct.height - height_differ));
	rct = mInputContainer.positionAndSize;
	mInputContainer.setPosition(Vector2(rct.x, rct.y - height_differ));
	rct = mSizeChatBoxBtn.positionAndSize;
	mSizeChatBoxBtn.setPosition(Vector2(rct.x, rct.y - height_differ));
}
//--------------------------------------------------
// 修改缩放聊天框按钮图标
private function changeSizeChatboxBtnStyle(isBig : boolean) : void
{
	var normal : String = isBig ? "talk_down" : "talk_up";
	var hover : String = isBig ? "talk_down_hover" : "talk_up_hover";
	var dir : String = "MainUI/";
	UI.SetButtonState(mSizeChatBoxBtn, dir + normal, dir + hover, dir + normal);
}
//--------------------------------------------------


