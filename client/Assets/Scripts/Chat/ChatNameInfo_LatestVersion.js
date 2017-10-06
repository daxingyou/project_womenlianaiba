#pragma strict
#pragma downcast
import iGUI;



class ChatNameInfo_LatestVersion extends PlatResInfoCtrl
{
	public var ChatItemContainer : iGUIContainer = null;
	public var DialogContainer : iGUIContainer = null;
	public var output_listBox : iGUIListBox = null;
	//--------------------------------------------------
	//overwrite
	public function Callback()
	{
	 	Callback_SetChatNameInfo_LatestVersion();
	}
	//--------------------------------------------------
	private function Callback_SetChatNameInfo_LatestVersion() : void
	{
		var name : String = "";
		if (null == info || "" == info.nickname)
		{
			name = Define.noname;
		}
		else
		{
			name = info.nickname.Trim();
			name = name.Replace("\n", "");
			name = name.Replace(" ", "");
		}
		
		var chat_data : ChatItemClass = ChatItemContainer.userData;
		chat_data.name = name;
		
		var private_content_container : iGUIContainer = ChatItemContainer.items[0];
		var private_content_lbl : iGUILabel = private_content_container.items[0];
		var reply_btn : iGUIButton = private_content_container.items[1];
		//
		reply_btn.userData = chat_data;
		reply_btn.clickCallback = ChatLogic.getInstance().showChatMenu;
		reply_btn.setPosition(Vector2(0, 0));
		
		name = "[" + name + "]";
		
		switch (chat_data.type)
		{
		case CHAT_TYPE.SPEAKER:
			name = "[" + Define.speaker + "]" + name + ":";
			private_content_lbl.labelColor = ChatLogic.getInstance().SpeakerChatOuputColor;
			break;
		case CHAT_TYPE.CHAT_AROUND:
			name += Define.say + ":";
			private_content_lbl.labelColor = ChatLogic.getInstance().PublicChatOutputColor;
			break;
		case CHAT_TYPE.CHAT_PRIVATE:
			name += Define.secret + ":";
			private_content_lbl.labelColor = ChatLogic.getInstance().PrivateChatInputColor;
			break;
		case CHAT_TYPE.CHAT_TO_OTHER_PRIVATE:
			name = Define.secret + name + ":";
			private_content_lbl.labelColor = ChatLogic.getInstance().PrivateChatInputColor;
			break;
		}
		
		var content : String = chat_data.content.Replace(" ", ".");
		content = name + content;
		private_content_container.setPosition(Vector2(0, 0));
		private_content_container.setWidth(DialogContainer.positionAndSize.width - ChatLogic.getInstance().ScrollbarWidth);
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
		ChatItemContainer.setWidth(private_content_container.positionAndSize.width);
		ChatItemContainer.setHeight(private_content_container.positionAndSize.height);
		output_listBox.scrollToBottom(0);
		output_listBox.refreshRect();
	}
	//--------------------------------------------------
}


