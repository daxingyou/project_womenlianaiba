#pragma strict

class YYChannelChatUserInfoClass extends PlatResInfoCtrl{
	var chat_itm : iGUIContainer = null;
	
	public function Callback(){
		if( iGUICode_VoiceChannelUI.getInstance() && 
			iGUICode_VoiceChannelUI.getInstance().getChannelChatLogic()){
			
			iGUICode_VoiceChannelUI.getInstance().getChannelChatLogic().loadUserInfoCallback(chat_itm, info);
		}
		//
		if( iGUICode_YYPubUI.getInstance() && 
			iGUICode_YYPubUI.getInstance().getChannelChatLogic()){
			
			iGUICode_YYPubUI.getInstance().getChannelChatLogic().loadUserInfoCallback(chat_itm, info);
		}
	}
}


class YYChannelChatLogic{
	public var ScrollbarWidth : float = 15.0f;
	private var mChannelID : UInt64 = 0;
	private var input_box : iGUITextfield =null;
	private var imputbox_parent : iGUIPanel = null;
	private var output_listbox : iGUIListBox = null;
	private var chat_panel : iGUIPanel = null;
	private var cancel_private_btn : iGUIButton = null;
	private var private_name_label : iGUILabel = null;
	private var chat_menu_panel : iGUIPanel = null;
	private var cmp_attention_btn : iGUIButton = null;
	private var cmp_priavte_chat_btn : iGUIButton = null;
	private var cmp_visit_btn : iGUIButton = null;
	private var chat_input_panel : iGUIPanel = null;
	private var send_btn : iGUIButton = null;
	private var cmp_kickout_btn : iGUIButton = null;
	private var mChatItemOrder : int = 0;
	private var mCurChatToPlayerAccount : String = "";
	private var mUIType : int = 0;
	function YYChannelChatLogic(){
		init();
	}
	
	function init(){
		RegistNetEvt();
		RegistEvt();
	}
	
	function Update(){
		handleKeyCodeEnter();
		// 鼠标左键按下
		if (Input.GetMouseButtonDown(0))
		{
			hideFunctionMenu(false);
		}
	}
	
	private function handleKeyCodeEnter() : void
	{
		if (Input.GetKey(KeyCode.Return))
		{
			if(!input_box)
				return;
			
			if (input_box.hasFocus())
			{
				input_box.unFocus();
			}
			else
			{
				input_box.userData = private_name_label.enabled ? INPUT_CHAT_TYPE.PRIVATE_INPUT : INPUT_CHAT_TYPE.PUBLIC_INPUT;
				input_box.focus();
			}
		}
	}

	function OnDestroy(){
		if (input_box){
			input_box.enterKeyCallback = null;
		}
		//NetHelper.UnregistHandler(NetMsgType.msg_notify_chat_channel);
		//NetHelper.UnregistHandler(NetMsgType.msg_notify_channel_tell);
		EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CHANNEL_SENDBTN), handleClickSendBtn);
		EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_SPEAKERWORD), HandleNotifySpeakerWord);
	}
	
	function setCtrls(input_box : iGUITextfield, 
						output_box : iGUIListBox, 
						chat_panel : iGUIPanel, 
						private_name_label : iGUILabel,
						cancel_private_btn : iGUIButton, 
						imputbox_parent : iGUIPanel,
						chat_menu_panel : iGUIPanel,
						cmp_attention_btn : iGUIButton,
						cmp_priavte_chat_btn : iGUIButton,
						cmp_visit_btn : iGUIButton,
						cmp_kickout_btn : iGUIButton,
						chat_input_panel : iGUIPanel,
						send_btn : iGUIButton,
						uitype : int){
		
		this.input_box = input_box;
		this.output_listbox = output_box;
		this.chat_panel = chat_panel;
		this.cancel_private_btn = cancel_private_btn;
		this.private_name_label = private_name_label;
		this.imputbox_parent = imputbox_parent;
		this.cmp_attention_btn = cmp_attention_btn;
		this.chat_menu_panel = chat_menu_panel;
		this.cmp_priavte_chat_btn = cmp_priavte_chat_btn;
		this.cmp_visit_btn = cmp_visit_btn;
		this.chat_input_panel = chat_input_panel;
		this.send_btn = send_btn;
		this.cmp_kickout_btn = cmp_kickout_btn;
		mUIType = uitype;
		this.input_box.enterKeyCallback = CallbackEnterKey;
		this.cancel_private_btn.clickCallback = ClickCallback_CancelPrivateChat;
		this.cmp_attention_btn.clickCallback = ClickCallback_AttentionBtn;
		this.cmp_priavte_chat_btn.clickCallback = ClickCallback_ChatPrivate;
		this.cmp_visit_btn.clickCallback = ClickCallback_VisitBtn;
		this.cmp_kickout_btn.clickCallback = ClickCallback_cmp_kickout_btn;
		ChangeInputChatType(INPUT_CHAT_TYPE.PUBLIC_INPUT);
	}
	
	function RegistNetEvt(){
		NetHelper.UnregistHandler(NetMsgType.msg_notify_chat_channel);
		NetHelper.UnregistHandler(NetMsgType.msg_notify_channel_tell);

		NetHelper.RegistHandler(new notify_chat_channel(), handle_notify_chat_channel);
		NetHelper.RegistHandler(new notify_channel_tell(), handle_notify_channel_tell);
	}
	
	function RegistEvt(){
		EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_CHANNEL_SENDBTN), handleClickSendBtn);
		EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_SPEAKERWORD), HandleNotifySpeakerWord);
	}
	
	function setChannelID(id : UInt64){
		mChannelID = id;
	}
	
	function handle_notify_chat_channel(evt : GameEvent, pack : notify_chat_channel){
		var talk_account : String = pack.account;
		var talk_name : String = pack.player_name;
		var content : String = pack.content;
		
		//
		setChatContent(talk_account, talk_name, content, CHAT_TYPE.CHAT_AROUND);
	}
	
	function handle_notify_channel_tell(evt : GameEvent, pack : notify_channel_tell){
		var talk_account : String = pack.speaker;
		var talk_name : String = pack.speaker_name;
		var content : String = pack.content;
		setChatContent(talk_account, talk_name, content, CHAT_TYPE.CHAT_PRIVATE);
	}
	
	function loadUserChatInfo(account : String, chat_itm : iGUIContainer){
		var user_info : YYChannelChatUserInfoClass = new YYChannelChatUserInfoClass();
		user_info.account = account;
		user_info.chat_itm = chat_itm;
		Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(account, user_info);
	}
	
	function loadUserInfoCallback(chat_itm : iGUIContainer, info : player_basic_information){
		var talk_name : String = "";
		if (null == info || "" == info.nickname)
		{
			talk_name = Define.noname;
		}
		else
		{
			talk_name = info.nickname.Trim();
			talk_name = talk_name.Replace("\n", "");
			talk_name = talk_name.Replace(" ", "");
		}
		
		var chat_data : ChatItemClass = chat_itm.userData as ChatItemClass;
		chat_data.name = talk_name;
		
		var private_content_container : iGUIContainer = chat_itm.items[0] as iGUIContainer;
		var private_content_lbl : iGUILabel = private_content_container.items[0] as iGUILabel;
		var reply_btn : iGUIButton = private_content_container.items[1] as iGUIButton;
		//
		reply_btn.userData = chat_data;
		reply_btn.clickCallback = showFunctionMenu;
		reply_btn.setPosition(Vector2(0, 0));
		
		talk_name = "[" + talk_name + "]";
		
		switch (chat_data.type)
		{
		case CHAT_TYPE.SPEAKER:
			talk_name = "[" + Define.speaker + "]" + talk_name + ":";
			private_content_lbl.labelColor = ChatLogic.getInstance().SpeakerChatOuputColor;
			break;
		case CHAT_TYPE.CHAT_AROUND:
			talk_name += Define.say + ":";
			private_content_lbl.labelColor = ChatLogic.getInstance().PublicChatOutputColor;
			break;
		case CHAT_TYPE.CHAT_PRIVATE:
			talk_name += Define.secret + ":";
			private_content_lbl.labelColor = ChatLogic.getInstance().PrivateChatInputColor;
			break;
		case CHAT_TYPE.CHAT_TO_OTHER_PRIVATE:
			talk_name = Define.secret + talk_name + ":";
			private_content_lbl.labelColor = ChatLogic.getInstance().PrivateChatInputColor;
			break;
		}
		
		var content : String = chat_data.content.Replace(" ", ".");
		content = talk_name + content;
		private_content_container.setPosition(Vector2(0, 0));
		private_content_container.setWidth(chat_panel.positionAndSize.width - ChatLogic.getInstance().ScrollbarWidth);
		//
		var content_lbl_max_len : float = 0;
		var content_lbl_x : float = 0;
		if (ScenePlayerMgr.isMainPlayer(chat_data.account))
		{
			content_lbl_max_len = private_content_container.positionAndSize.width;
			content_lbl_x = 0;
		}
		else
		{
			content_lbl_max_len = private_content_container.positionAndSize.width - reply_btn.positionAndSize.width;
			content_lbl_x = reply_btn.positionAndSize.x + reply_btn.positionAndSize.width;
		}
		var content_size : Vector2 = private_content_lbl.style.CalcSize(GUIContent(content));
		if (content_size.x > content_lbl_max_len)
		{
			content_size.x = content_lbl_max_len;
			content_size.y = private_content_lbl.style.CalcHeight(GUIContent(content), content_lbl_max_len);
		}
		private_content_lbl.setPositionAndSize(Rect(content_lbl_x, 0, content_size.x, content_size.y));
		private_content_lbl.style.wordWrap = true;
		private_content_lbl.label.text = content;
		//
		private_content_container.setHeight(private_content_lbl.positionAndSize.height);
		//
		chat_itm.setWidth(private_content_container.positionAndSize.width);
		chat_itm.setHeight(private_content_container.positionAndSize.height);
		output_listbox.scrollToBottom(0);
		output_listbox.refreshRect();
	}
	
	function showFunctionMenu(caller : iGUIElement){
		chat_menu_panel.setEnabled(true);
		cmp_attention_btn.userData = caller.userData;
		cmp_priavte_chat_btn.userData = caller.userData;
		cmp_visit_btn.userData = caller.userData;
		cmp_kickout_btn.userData = caller.userData;
		// 设置位置
		var y : float = Screen.height - Input.mousePosition.y;
		if (y + chat_menu_panel.rect.height > chat_input_panel.rect.y)
		{
			y = chat_input_panel.rect.y - chat_menu_panel.rect.height;
		}
		if(mUIType == 0){
			chat_menu_panel.setPosition(Vector2(226, y));
		}
		else{
			chat_menu_panel.setPosition(Vector2(caller.rect.xMax + 5, y));
		}
		
	}
	// 隐藏聊天菜单面板
	private function hideFunctionMenu(direct_hide : boolean) : void
	{
		if (false == chat_menu_panel.enabled)
			return;
		
		var hide : boolean = false;
		if (direct_hide)
		{
			hide = true;
		}
		else
		{
			if (!(cmp_attention_btn.isMouseOver || cmp_priavte_chat_btn.isMouseOver || cmp_visit_btn.isMouseOver || cmp_kickout_btn.isMouseOver))
			{
				hide = true;
			}
		}
		if (hide)
		{
			chat_menu_panel.setEnabled(false);
			cmp_attention_btn.userData = null;
			cmp_priavte_chat_btn.userData = null;
			cmp_visit_btn.userData = null;
			cmp_kickout_btn.userData = null;
		}
	}

	// 点击私聊按钮回调
	public function ClickCallback_ChatPrivate(caller : iGUIElement) : void
	{
		var chat_data : ChatItemClass = caller.userData;
		var extend_short_name : String = "密[" + ChatLogic.getInstance().GetChatPlayerShortName(caller, chat_data.name) + "]:";
		private_name_label.label.text = extend_short_name;
		private_name_label.label.tooltip = chat_data.name;
		var short_name_len : float = private_name_label.style.CalcSize(GUIContent(extend_short_name)).x;
		private_name_label.setWidth(short_name_len);
		mCurChatToPlayerAccount = chat_data.account;
		ChangeInputChatType(INPUT_CHAT_TYPE.PRIVATE_INPUT);
		input_box.focus();
		hideFunctionMenu(true);
	}
	
	//
	function ClickCallback_cmp_kickout_btn(caller : iGUIElement){
		var chat_data : ChatItemClass = caller.userData;
		YYChannelListLogic.getInstance().reqKickChannelPlayer(chat_data.account);
		hideFunctionMenu(true);
	}
	
	// 点击拜访按钮回调
	private function ClickCallback_VisitBtn(caller : iGUIElement) : void
	{
		Global.GetSysMsgHandler().ShowSysMsg(242);
		/*
		var chat_data : ChatItemClass = caller.userData;
		PlayerFriend.GetInstance().ReqEnterFriendHouse(chat_data.account, enter_house_type.eht_menu);
		hideFunctionMenu(true);
		*/
	}
	
	// 点击关注按钮回调
	private function ClickCallback_AttentionBtn(caller : iGUIElement) : void
	{
		var chat_data : ChatItemClass = caller.userData;
		FollowLogic.GetInstance().AddAttention(chat_data.account);
		hideFunctionMenu(true);
	}
	
	//聊天输出
	function setChatContent(talk_account : String, talk_name : String, content : String, type : CHAT_TYPE){
		if(!output_listbox)
			return;
		
		//if(talk_name == ""){
			var chat_itm : iGUIContainer = createChatContentItem(talk_account);
			chat_itm.userData = new ChatItemClass(talk_account, talk_name, content, type);
			loadUserChatInfo(talk_account, chat_itm);
		//}
		//else{
		//	content = "[" + talk_name + "]:" + content;
		//	setPrimitiveContent(content, Color.white);
		//}
	}
	
	function createChatContentItem(account : String) : iGUIContainer{
		var chat_itm : iGUIContainer = output_listbox.addSmartObject("PrivateChatItemContainer") as iGUIContainer;
		if (null == chat_itm || null == chat_itm.gameObject)
			return;
		
		chat_itm.setOrder(mChatItemOrder ++);
		var private_content_container : iGUIContainer = chat_itm.items[0];
		var reply_btn : iGUIButton = private_content_container.items[1];
		reply_btn.setEnabled(!ScenePlayerMgr.isMainPlayer(account));
		output_listbox.scrollToBottom(0);
		output_listbox.refreshRect();
		
		return chat_itm;
	}
	
	//输出文字
	function setPrimitiveContent(content : String, color : Color){
		var chat_lbl : iGUILabel = output_listbox.addElement("iGUILabel") as iGUILabel;
		chat_lbl.setOrder(mChatItemOrder ++);
		chat_lbl.style.wordWrap = true;
		chat_lbl.style.font = ChatLogic.getInstance().ChatLineFont;
		chat_lbl.style.fontStyle = FontStyle.Bold;
		chat_lbl.labelColor = color;
		var height : float = chat_lbl.style.CalcHeight(new GUIContent(content), output_listbox.rect.width - ScrollbarWidth);
		chat_lbl.setHeight(height);
		chat_lbl.label.text = content;
		output_listbox.scrollToBottom(0);
		output_listbox.refreshRect();
		
	}
	
	function HandleNotifySpeakerWord(evt : GameEvent, obj : Object){
		var _obj : notify_chat_world = obj as notify_chat_world;
		var account : String = _obj.account;
		var speaker_word : String = _obj.content;
		setChatContent(account, "", speaker_word, CHAT_TYPE.SPEAKER);
	}
	
	function handleClickSendBtn(evt : GameEvent, obj : Object){
		
		if(mChannelID == 0)
			return;
			
		var btn : iGUIButton = obj as iGUIButton;
		var content : String = Convert.ToString(btn.userData);
		sendContent(content);
	}
	
	function CallbackEnterKey(caller : iGUIElement){
		
		sendContent(input_box.value);
	}
	
	// 点击取消私聊按钮回调
	private function ClickCallback_CancelPrivateChat(caller : iGUIElement) : void
	{
		ChangeInputChatType(INPUT_CHAT_TYPE.PUBLIC_INPUT);
	}
	
	private function ChangeInputChatType(type : INPUT_CHAT_TYPE) : void
	{
		if (INPUT_CHAT_TYPE.PRIVATE_INPUT == type)
		{
			cancel_private_btn.setEnabled(true);
			private_name_label.setEnabled(true);
			input_box.style.normal.textColor = ChatLogic.getInstance().PrivateChatInputColor;
			input_box.setX(private_name_label.positionAndSize.x + private_name_label.positionAndSize.width);
			input_box.setWidth(imputbox_parent.positionAndSize.width - private_name_label.positionAndSize.width - cancel_private_btn.positionAndSize.width);
		}
		else if (INPUT_CHAT_TYPE.PUBLIC_INPUT == type)
		{
			cancel_private_btn.setEnabled(false);
			private_name_label.setEnabled(false);
			input_box.style.normal.textColor = ChatLogic.getInstance().PublicChatInputColor;
			input_box.setX(0);
			input_box.setWidth(imputbox_parent.positionAndSize.width);
		}
		input_box.setValue("");
		input_box.focus();
		input_box.userData = type;
	}

	function sendContent(content : String){
		content = content.Replace("\n", "").Trim();
		if(content == ""){
			ChangeInputChatType(INPUT_CHAT_TYPE.PUBLIC_INPUT);
			return;
		}
		content = Global.GetKeyWordShield().Search(content);
		var chatType : INPUT_CHAT_TYPE = input_box.userData;
		if (INPUT_CHAT_TYPE.PUBLIC_INPUT == chatType)			// 公共聊天
		{
			reqChannelChat(mChannelID, content);
		}
		else if (INPUT_CHAT_TYPE.PRIVATE_INPUT == chatType)		// 私聊
		{
			setChatContent(mCurChatToPlayerAccount, "", content, CHAT_TYPE.CHAT_TO_OTHER_PRIVATE);
			reqChatPrivate(mCurChatToPlayerAccount, content);
			ChangeInputChatType(INPUT_CHAT_TYPE.PUBLIC_INPUT);
		}

		input_box.value = "";
		input_box.focus();	
	}
	
	function reqChannelChat(channelID : UInt64, content : String){
		var req : req_chat_channel = new req_chat_channel();
		req.channel_id = channelID;
		req.content = content;
		NetHelper.Send(req);
	}
	
	function reqChatPrivate(account : String, content : String){
		var req : req_channel_tell = new req_channel_tell();
		req.target_player = account;
		req.content = content;
		NetHelper.Send(req);
	}
}
