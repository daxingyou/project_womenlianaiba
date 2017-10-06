//-----------------------------------------------------------
//--
//--
//--
//-----------------------------------------------------------
#pragma strict
#pragma downcast
import iGUI;
var confirmbtn_Img:Texture2D;
var cancelbtn_Img:Texture2D;
var refreshbtn_Img:Texture2D;
var clearCachebtn_Img:Texture2D;
var viewlogbtn_Img:Texture2D;
public var msgwinStyle:GUIStyle;
public var msgLabelStyel:GUIStyle;
var btnStyle:GUIStyle;
private static var instance : iGUICode_ModalRoot;
private var alertWinList:Array = new Array();
private static var alertWin_interval:float = 40.0f; 
private var close_all_flag:boolean = false;
private var mLayer : int = 3;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var image1 : iGUIImage;
@HideInInspector
var modalRoot : iGUIRoot;

//创建消息框窗口...只带一个默认按钮
private function _createAlertWindow(title:String,msg:String):iGUIPanel
{
	//消息框窗口
	var alert_panel:iGUIPanel = modalRoot.addElement("iGUIPanel") as iGUIPanel;
	alert_panel.setPositionAndSize(new Rect(0.5f,0.3f,225f,155f));
	alert_panel.padding = RectOffset(8,10,10,8);
	alert_panel.style = msgwinStyle;//modalRoot.alertWindowStyle;
	//暂时决定不显示标题
	//alert_panel.label.text = title;
	alert_panel.layout = iGUILayout.VerticalDenseFromBottom;
	//按钮容器
	var pos_size:Rect = new Rect();
	pos_size.x = 0.5f;
	pos_size.y = 0.9f;
	/*
	var vector2:Vector2 = modalRoot.alertButtonStyle.CalcSize(GUIContent("确定"));
	if(modalRoot.alertButtonStyle.fixedHeight > 0)
	{
		pos_size.height = modalRoot.alertButtonStyle.fixedHeight;
	}
	else
	{
		pos_size.height = vector2.y;
	}*/
	pos_size.height = 24;
	pos_size.width = 1f;
	var container:iGUIContainer = alert_panel.addElement("iGUIContainer") as iGUIContainer;
	container.setPositionAndSize(pos_size);
	//container.layout = iGUILayout.Horizontal;
	//消息文本框
	var msg_lbl:iGUILabel = alert_panel.addElement("iGUILabel") as iGUILabel;
	msg_lbl.setPositionAndSize(new Rect(0f,0f,1f,0.9f));
	msg_lbl.style = msgLabelStyel;//modalRoot.alertLabelStyle;
	msg_lbl.label.text = msg;	
	//确定按钮
	var ok_button:iGUIButton = container.addElement("iGUIButton") as iGUIButton;
	ok_button.setPositionAndSize(new Rect(0.5f,0f,0.3f,1f));
	ok_button.style = btnStyle;//modalRoot.alertButtonStyle;
	ok_button.label.image = confirmbtn_Img;
	ok_button.clickCallback = System.Delegate.Combine(_DefaultCloseCallback as iGUIEventCallback,ok_button.clickCallback);//_DefaultCloseCallback as iGUIEventCallback;
	//alert_panel.scaleTo(0f,1f,0f,0.4f,iTweeniGUI.EaseType.spring);
	return alert_panel;
}
//创建消息框窗口...带一个按钮，可以自定义按钮回调函数和按钮名称
private function _createAlertWindow(title:String,msg:String,okTxt:String,okCallback:iGUIEventCallback):iGUIPanel
{
	var alert_panel:iGUIPanel = _createAlertWindow(title,msg);
	var container:iGUIContainer = alert_panel.items[0] as iGUIContainer;
	var ok_btn:iGUIButton = container.items[0] as iGUIButton;
	if(okTxt == Define.ok || okTxt == "")
		ok_btn.label.image = confirmbtn_Img;
	else if(okTxt == Define.refresh){
		ok_btn.label.text = "";
		ok_btn.label.image = refreshbtn_Img;
	}
	else{
		ok_btn.label.text = okTxt;
		ok_btn.label.image = null;
	}
	ok_btn.clickCallback = System.Delegate.Combine(closeMsgbox as iGUIEventCallback,ok_btn.clickCallback);
	ok_btn.clickCallback = System.Delegate.Combine(ok_btn.clickCallback,okCallback as iGUIEventCallback);
	return alert_panel;
}
//--创建消息框窗口...带二个按钮，可以自定义按钮名称和回调函数
private function _createAlertWindow(title:String,msg:String,okTxt:String,okCallback:iGUIEventCallback,cancelTxt:String,cancelCallback:iGUIEventCallback,userdata : Object):iGUIPanel
{
	var alert_panel:iGUIPanel = _createAlertWindow(title,msg,okTxt,okCallback);
	var container:iGUIContainer = alert_panel.items[0] as iGUIContainer;
	var ok_btn:iGUIButton = container.items[0] as iGUIButton;
	ok_btn.userData = userdata;
	ok_btn.setPositionAndSize(Rect(0.2f,0f,0.3f,1f));
	var cancel_btn:iGUIButton = container.addElement("iGUIButton") as iGUIButton;
	cancel_btn.setPositionAndSize(new Rect(0.8f,0f,0.3f,1f));
	cancel_btn.style = btnStyle;
	if(cancelTxt == Define.cancel || cancelTxt == "")
		cancel_btn.label.image = cancelbtn_Img;
	else if(cancelTxt == Define.showlog){
		cancel_btn.label.text = "";
		cancel_btn.label.image = viewlogbtn_Img;
	}
	else{
		cancel_btn.label.text = cancelTxt;
		cancel_btn.label.image = null;
	}
	cancel_btn.clickCallback = System.Delegate.Combine(_DefaultCloseCallback as iGUIEventCallback,cancel_btn.clickCallback);
	cancel_btn.clickCallback = System.Delegate.Combine(closeMsgbox as iGUIEventCallback,cancel_btn.clickCallback);
	cancel_btn.clickCallback = System.Delegate.Combine(cancel_btn.clickCallback,cancelCallback as iGUIEventCallback);
	return alert_panel;
}
//--创建消息框窗口...带三个按钮，可以自定义按钮名称和回调函数
private function _createAlertWindow(title:String,msg:String,okTxt:String,okCallback:iGUIEventCallback,cancelTxt:String,cancelCallback:iGUIEventCallback, extendTxt:String, extendCallback:iGUIEventCallback):iGUIPanel
{
	var alert_panel:iGUIPanel = _createAlertWindow(title,msg,okTxt,okCallback,cancelTxt,cancelCallback, null);
	var container:iGUIContainer = alert_panel.items[0] as iGUIContainer;
	var ok_btn:iGUIButton = container.items[0] as iGUIButton;
	ok_btn.setPositionAndSize(Rect(0.1f,0f,0.25f,1f));
	var cancel_btn:iGUIButton = container.items[1] as iGUIButton;
	cancel_btn.setPositionAndSize(new Rect(0.9f,0f,0.25f,1f));
	
	var extend_btn:iGUIButton = container.addElement("iGUIButton") as iGUIButton;
	extend_btn.setPositionAndSize(new Rect(0.5f,0f,0.25f,1f));
	extend_btn.style = btnStyle;
	if(extendTxt == Define.cancel || extendTxt == "")
		extend_btn.label.image = cancelbtn_Img;
	else if(extendTxt == Define.clearcache){
		extend_btn.label.text = "";
		extend_btn.label.image = clearCachebtn_Img;
	}
	else{
		extend_btn.label.text = extendTxt;
		extend_btn.label.image = null;
	}
	//extend_btn.clickCallback = System.Delegate.Combine(_DefaultCloseCallback as iGUIEventCallback,cancel_btn.clickCallback);
	//extend_btn.clickCallback = System.Delegate.Combine(closeMsgbox as iGUIEventCallback,cancel_btn.clickCallback);
	extend_btn.clickCallback = System.Delegate.Combine(extend_btn.clickCallback,extendCallback as iGUIEventCallback);
	return alert_panel;
}
//消息框默认关闭回调函数，只关闭消息窗口本身
private function _DefaultCloseCallback(caller:iGUIElement):void
{
	modalRoot.removeElement(caller.container.container); 
	if(alertWinList.length == 0)
	{
		close_all_flag = true;
		UI.getUI().CloseModalRoot();
	}
}
//创建显示只显示消息的窗口
private function showMsgbox(title:String,msg:String,is_showBtn:boolean):iGUIPanel
{
	var alert_win:iGUIPanel = _createAlertWindow(title,msg);
	var container:iGUIContainer = alert_win.items[0] as iGUIContainer;
	var button:iGUIButton = container.items[0] as iGUIButton; 
	if(is_showBtn)
	{
		button.clickCallback = System.Delegate.Combine(closeMsgbox as iGUIEventCallback,button.clickCallback);
		button.setEnabled(is_showBtn);
	}
	else
		button.setEnabled(is_showBtn);
	return alert_win;
}
//--创建带一个回调函数的消息窗口
private function showMsgbox(title:String,msg:String,okTxt:String,okCallback:iGUIEventCallback):iGUIPanel
{
	var alert_win:iGUIPanel = _createAlertWindow(title,msg,okTxt,okCallback);
	return alert_win;
}
//--创建带二个回调函数的消息窗口
private function showMsgbox(title:String,msg:String,okTxt:String,cancelTxt:String,okCallback:iGUIEventCallback,cancelCallback:iGUIEventCallback,userdata : Object):iGUIPanel
{
	var alert_win:iGUIPanel = _createAlertWindow(title,msg,okTxt,okCallback,cancelTxt,cancelCallback,userdata);
	return alert_win;
}
//--创建带三个回调函数的消息窗口
private function showMsgbox(title:String,msg:String,okTxt:String,cancelTxt:String,extendTxt:String,okCallback:iGUIEventCallback,cancelCallback:iGUIEventCallback,extendCallback:iGUIEventCallback):iGUIPanel
{
	var alert_win:iGUIPanel = _createAlertWindow(title,msg,okTxt,okCallback,cancelTxt,cancelCallback,extendTxt,extendCallback);
	return alert_win;
}
//--对外接口，创建消息窗口，所得窗口样式由调用者填入的参数决定
//okTxt,cancelTxt,title,okCallback域,cancelCallback域均可填null，表示使用函数内自带的默认参数
public function showMsgboxInterface(msg:String,okTxt:String,cancelTxt:String,extendTxt:String,title:String,okCallback:iGUIEventCallback,cancelCallback:iGUIEventCallback,userdata : Object,extendCallback:iGUIEventCallback,is_showBtn:boolean):iGUIPanel
{
	//
	var alert_win:iGUIPanel= null;
	var def_title:String = Define.msgtip;
	var def_okTxt:String = Define.ok;
	var def_cancelTxt:String = Define.cancel;
	var def_msg:String = "";
	
	if(title == null)
		title = def_title;
	if(okTxt == null)
		okTxt = def_okTxt;
	if(cancelTxt == null)
		cancelTxt = def_cancelTxt;
	if(msg == null)
		msg = def_msg;
	if(is_showBtn == null)
		is_showBtn = true;
	
	if(okCallback != null && cancelCallback != null && extendCallback != null ){
		alert_win = showMsgbox(title,msg,okTxt,cancelTxt,extendTxt,okCallback,cancelCallback,extendCallback);
	}
	if(okCallback != null && cancelCallback != null && extendCallback == null)
	{
		alert_win = showMsgbox(title,msg,okTxt,cancelTxt,okCallback,cancelCallback, userdata);
	}
	else if(okCallback != null && cancelCallback == null && extendCallback == null)
		alert_win = showMsgbox(title,msg,okTxt,okCallback);
	else if(okCallback == null && cancelCallback == null && extendCallback == null)
		alert_win = showMsgbox(title,msg,is_showBtn);
	
	if(alert_win != null)
		PushAlertWin(alert_win);
	return alert_win;
}
//--将创建好的消息窗口压入数组，以便管理
private function PushAlertWin(win:iGUIPanel)
{
	if(alertWinList.length > 0)
	{
		var last_win_rect:Rect = (alertWinList[alertWinList.length-1] as iGUIPanel).getAbsoluteRect();
		var new_rect:Rect = new Rect(last_win_rect.x+alertWin_interval,last_win_rect.y+alertWin_interval,last_win_rect.width,last_win_rect.height);
		win.setPositionAndSize(new_rect);
	}
	alertWinList.Add(win);
	win.layer = ++mLayer;
	win.refreshLayers();
	for (var i:int=0; i<alertWinList.length-1; ++i)
	{
		(alertWinList[i] as iGUIPanel).passive = true;
	}
}
//--关闭窗口的同时必须删除对应的数组成员
private function DeleteAlertWin(param:iGUIPanel)
{
	for(var i:int=0; i<alertWinList.length; ++i)
	{
		if((alertWinList[i] as iGUIPanel).gameObject.name == param.gameObject.name)
		{
			alertWinList.RemoveAt(i);
			--mLayer;
			break;
		}
	}
	if (alertWinList.length > 0)
	{
		(alertWinList[alertWinList.length - 1] as iGUIPanel).passive = false;
	}
}
//--关闭消息窗口回调，这里只做从消息框数组中删除关闭的消息框
 function closeMsgbox(caller : iGUIElement):void
{ 
	DeleteAlertWin(caller.container.container as iGUIPanel);
}
//--当模态根窗口中不存在任何窗口时，关闭删除模态Root
function OnGUI()
{
//	if(alertWinList.length <= 0 && close_all_flag == true)
//	{
//		//UI.getUI().CloseModalRoot();
//	}
//	else
//	{
//		//Debug.Log(alertWinList[alertWinList.length-1].gameObject.name);
//		(alertWinList[alertWinList.length-1]as iGUIWindow).bringToFrontLate();
//	}
}