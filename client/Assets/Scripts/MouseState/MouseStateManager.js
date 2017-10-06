/*--------------------------------------------------
鼠标状态管理器(2012/4/20 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast
import iGUI;



// 鼠标状态
enum MouseState
{
	MS_NONE,				// 空状态
	MS_NORMAL,				// 正常状态
	MS_HOVER_FURNI,			// 鼠标在家具上
	MS_PICK_FURNI,			// 鼠标拾取家具
	MS_USE_PROP,			// 使用道具状态
}



//--------------------------------------------------
private static var mInstance : MouseStateManager = null;		// 实例
private var mRootTable : Hashtable = new Hashtable();			// 界面表
private var mMouseState : MouseState = MouseState.MS_NONE;		// 当前鼠标状态
private var mMouseCursor : Texture2D = null;					// 当前鼠标图标
public var NormalCursor : Texture2D;		// 正常图标
public var HandShapeCursor : Texture2D;		// 手型图标



//--------------------------------------------------
function Awake()
{
	mInstance = this;
	mMouseState = MouseState.MS_NORMAL;
	mMouseCursor = NormalCursor;
	_registEvents();
}
//--------------------------------------------------
// 获取实例
public static function getInstance() : MouseStateManager
{
	return mInstance;
}
//--------------------------------------------------
// 事件注册
private function _registEvents() : void
{
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MOUSE_NORMARL_STATE), handleMouseNormalState);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.PICKMGR_MOVEIN_FURNI), handleMouseInFurni);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.PICKMGR_MOVEOUT_FURNI), handleMouseOutFurni);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MOUSE_PICKED_FURNI), handlePickFurni);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MOUSE_USE_PROP_STATE), handleUseProp);
}
//--------------------------------------------------
// 改变当前鼠标状态
private function changeMouseState(mouse_state : MouseState, tex : Texture2D) : void
{
	if (RuntimePlatform.WindowsEditor == Application.platform)
		return;
	
	mMouseState = mouse_state;
	if (tex)
	{
		setMouseState(tex);
		return;
	}
	
	var cursor : Texture2D = null;
	switch (mouse_state)
	{
	case MouseState.MS_NORMAL:
		cursor = NormalCursor;
		break;
	case MouseState.MS_HOVER_FURNI:
		cursor = HandShapeCursor;
		break;
	case MouseState.MS_PICK_FURNI:
		cursor = HandShapeCursor;
		break;
	default:		// MS_NONE
		break;
	}
	setMouseState(cursor);
}
//--------------------------------------------------
// 设置鼠标状态
private function setMouseState(cursor : Texture2D) : void
{
	for (var kv : DictionaryEntry in mRootTable)
	{
		var root : iGUIRoot = kv.Value;
		if (null == root)
			continue;
		
		root.mouseCursor = cursor;
	}
	mMouseCursor = cursor;
}
//--------------------------------------------------
// 添加一个界面(销毁一个界面后调用)
public function addRoot(root : iGUIRoot) : void
{
	if (null == root || mRootTable.ContainsKey(root.gameObject.name))
		return;
	
	mRootTable.Add(root.gameObject.name, root);
	changeMouseState(mMouseState, mMouseCursor);
}
//--------------------------------------------------
// 移除一个界面(销毁一个界面后调用)
public function removeRoot(root_name : String) : void
{
	if (mRootTable.ContainsKey(root_name))
	{
		mRootTable.Remove(root_name);
	}
}
//--------------------------------------------------
// 获取当前鼠标状态
public function getMouseState() : MouseState
{
	return mMouseState;
}
//--------------------------------------------------





/*--------------------------------------------------
*** 事件响应
--------------------------------------------------*/



// 鼠标正常状态
public function handleMouseNormalState(evt : GameEvent, cursor : Texture2D) : void
{
	changeMouseState(MouseState.MS_NORMAL, null);
}
// 鼠标移进家具
public function handleMouseInFurni(evt : GameEvent, cursor : Texture2D) : void
{
	if (false == FitmentLogic.getInstance().inFitmenting)
		return;
	
	changeMouseState(MouseState.MS_HOVER_FURNI, null);
}
// 鼠标引出家具
public function handleMouseOutFurni(evt : GameEvent, cursor : Texture2D) : void
{
	if (false == FitmentLogic.getInstance().inFitmenting)
		return;
	
	if (FitmentEventMgr.getSingleton().getFitment())
		return;
	
	changeMouseState(MouseState.MS_NORMAL, null);
}
// 鼠标点击家具
public function handlePickFurni(evt : GameEvent, click : boolean) : void
{
	if (false == FitmentLogic.getInstance().inFitmenting)
		return;
	
	if (click)
		changeMouseState(MouseState.MS_PICK_FURNI, null);
	else
		changeMouseState(MouseState.MS_NORMAL, null);
}
// 使用道具
public function handleUseProp(evt : GameEvent, cursor : Texture2D) : void
{
	changeMouseState(MouseState.MS_USE_PROP, cursor);
}


