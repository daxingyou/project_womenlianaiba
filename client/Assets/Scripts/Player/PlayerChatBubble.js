/*--------------------------------------------------
聊天泡泡(2012/3/7 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast
import iGUI;



var chat_bubble_style : GUIStyle;						// 泡泡风格
var chat_bubble_name_style : GUIStyle;					// 玩家名字控件风格
var chat_bubble_content_style : GUIStyle;				// 聊天内容控件风格
var male_background : Texture2D;						// 男性泡泡皮肤
var female_background : Texture2D;						// 女性泡泡皮肤
var speaker_word_background : Texture2D;
//var speaker_word_text_color : Color;
private var speaker_word_text_color : Color = new Color(255,246,0);
//var content_text_color : Color;
private var content_text_color : Color = Color.white;
var male_text_color : Color;							// 男性泡泡名字颜色
var female_text_color : Color;							// 女性泡泡名字颜色
var chat_bubble_life : float = 5.0f;					// 泡泡显示时长(秒)
var chat_bubble_offset_y : float = 20.0f;				// 泡泡在玩家头顶的y轴偏移
var chat_bubble_max_pixel : float = 145.0f;				// 文本的最大宽度
var chat_bubble_padding : float = 14.0f;				// 

private var mChatRoot : iGUIRoot = null;
private var mChatBubble : iGUIPanel = null;
private var mShowStartTime : float = 0.0f;
//--------------------------------------------------
function Awake()
{
	mChatRoot = UI.getUI().OpenUIRoot("ChatPaoPaoRoot");
	mChatBubble = _create(mChatRoot);	// 放在Awake()里面
	UI.getUI().SetIgnoreMouseOver(mChatBubble, true);
	for (var ele : iGUIElement in mChatBubble.items)
	{
		UI.getUI().SetIgnoreMouseOver(ele, true);
	}
}
function OnGUI()
{
	_updatePos();
	_hide();
}
//--------------------------------------------------
// 显示聊天泡泡
public function show(name : String, content : String, type : int)
{
	/*
		1.参数判断
		2.设置泡泡的皮肤 -> 设置玩家名字控件 -> 设置聊天内容控件 -> 设置泡泡 -> 显示泡泡
		3.记录当前时间
	*/
	if (null == mChatBubble)
		throw "Error: PlayerChatBubble -> show(String, String) -> chat bubble is null!";
	if(type == 0){
		if (this.gameObject.GetComponent(Player).isMale())
			_setChatBubbleSkin(male_background);
		else
			_setChatBubbleSkin(female_background);
	}
	else if(type == 1){
		_setChatBubbleSkin(speaker_word_background);
	}
	
	content = content.Replace(" ", ".");
	if(type == 0){
		if (this.gameObject.GetComponent(Player).isMale())
			_setNameLabel(name, chat_bubble_max_pixel, male_text_color);
		else
			_setNameLabel(name, chat_bubble_max_pixel, female_text_color);
		_setContentLabel(content, chat_bubble_max_pixel,content_text_color);
	}
	else if(type == 1){
		_setNameLabel(name, chat_bubble_max_pixel, speaker_word_text_color);
		_setContentLabel(content, chat_bubble_max_pixel,speaker_word_text_color);
	}
	_setBubbleRect(chat_bubble_padding);
	mChatBubble.setEnabled(true);
	
	mShowStartTime = Time.time;
}
//--------------------------------------------------
// 隐藏聊天泡泡
private function _hide()
{
	if (mChatBubble && mChatBubble.enabled && (Time.time - mShowStartTime >= chat_bubble_life))
	{
		mChatBubble.setEnabled(false);
	}
}
//--------------------------------------------------
// 更新泡泡位置
private function _updatePos()
{
	var chat_bubble : iGUIPanel = mChatBubble;
	// 坑爹啊,这里对root的enabled进行真判断必须用==true的格式,否则有时会判断不了
	if (true==mChatRoot.enabled && chat_bubble && chat_bubble.enabled)
	{
		var player_pos : Vector3 = this.gameObject.GetComponent(PlayerMove).getPos();
		var pos : Vector3 = Camera.main.WorldToScreenPoint(player_pos + Vector3(0.0f, 1.8f, 0.0f));
		var x : float = pos.x - chat_bubble.positionAndSize.width/2;
		var y : float = Camera.main.pixelHeight - pos.y - chat_bubble.positionAndSize.height - chat_bubble_offset_y;
		if( x > 0 && x < 2)
			x = 2;
		if(y > 0 && y < 2)
			y = 2;
		chat_bubble.setX(x);
		chat_bubble.setY(y);
	}
}
//--------------------------------------------------
// 创建聊天泡泡
private function _create(root : iGUIRoot) : iGUIPanel
{
	/*
		1.先获取聊天泡泡的root,进行非空判断
		2.创建泡泡面板 -> 创建玩家名字控件 -> 创建聊天内容控件
	*/
	if (null == root)
		throw "Error: PlayerChatBubble -> _create() -> can't get chat bubble root!";
	
	var chat_panel : iGUIPanel = root.addElement("iGUIPanel") as iGUIPanel;
	chat_panel.setType(iGUIPanelType.Box);
	chat_panel.padding = RectOffset(6.0f, 6.0f, 6.0f, 0.0f);
	chat_panel.style = chat_bubble_style;
	
	chat_panel.refreshRect();
	chat_panel.refreshStyle();
	
	var name_label : iGUILabel = chat_panel.addElement("iGUILabel") as iGUILabel;
	name_label.style = chat_bubble_name_style;
	
	var content_lable : iGUILabel = chat_panel.addElement("iGUILabel") as iGUILabel;
	content_lable.style = chat_bubble_content_style;
	
	chat_panel.setEnabled(false);
	
	return chat_panel;
}
//--------------------------------------------------
// 销毁聊天泡泡
function destroy()
{
	if (mChatRoot && mChatBubble)
	{
		mChatRoot.removeElement(mChatBubble);
	}
}
//--------------------------------------------------
// 设置泡泡的皮肤
private function _setChatBubbleSkin(background : Texture2D)
{
	var chat_bubble : iGUIPanel = mChatBubble;
	var name_label : iGUILabel = chat_bubble.items[0] as iGUILabel;
	chat_bubble.style.normal.background = background;
	chat_bubble.refreshStyle();
	name_label.refreshStyle();
}
//--------------------------------------------------
// 设置名字控件
private function _setNameLabel(name : String, max_width : float, text_color : Color)
{
	if ("" == name)
		name = Define.unknow;
	
	_setLabel(mChatBubble.items[0] as iGUILabel, name + ":", max_width, text_color);
}
//--------------------------------------------------
// 设置内容控件
private function _setContentLabel(content : String, max_width : float, text_color : Color)
{
	_setLabel(mChatBubble.items[1] as iGUILabel, content, max_width, text_color);
	mChatBubble.items[1].setPosition(Vector2(0.0f, mChatBubble.items[0].rect.height));
}
//--------------------------------------------------
// 设置文本控件的文本,宽高
private function _setLabel(label : iGUILabel, text : String, max_width : float, text_color : Color)
{
	var size : Vector2 = label.style.CalcSize(GUIContent(text));
	if (size.x > max_width)
	{
		size.x = max_width;
		size.y = label.style.CalcHeight(GUIContent(text), max_width);
	}
	label.setPositionAndSize(Rect(0.0f, 0.0f, size.x, size.y));
	label.label.text = text;
	label.labelColor = text_color;
	label.refreshRect();
}
//--------------------------------------------------
// 设置泡泡的宽高
private function _setBubbleRect(padding : float)
{
	var chat_bubble : iGUIPanel = mChatBubble;
	var name_label : iGUILabel = chat_bubble.items[0] as iGUILabel;
	var content_label : iGUILabel = chat_bubble.items[1] as iGUILabel;
	
	var bubble_width : float = name_label.rect.width;
	if (bubble_width < content_label.rect.width)
	{
		bubble_width = content_label.rect.width;
	}
	chat_bubble.setWidth(bubble_width + padding);
	chat_bubble.setHeight(name_label.rect.height + content_label.rect.height + padding);
	chat_bubble.refreshRect();
}
//--------------------------------------------------
