#pragma strict
#pragma downcast

/*--------------------------------------------------
道具商城逻辑(2012/4/10 create by hezhr)
--------------------------------------------------*/
import iGUI;



private static var mInstance : PropUseLogic = null;
public static var Ctrl : Controller = PropShopLogic.Ctrl;		// 控制器
private var mUsePropToOtherFlag : boolean = false;				// 对他人使用标识
private var mUsePropToSelfFlag : boolean = false;				// 对自己使用标识
private var mUsePropToAll : boolean = false;					// 对所有人使用标识



//--------------------------------------------------
function Awake()
{
	mInstance = this;
	_registEvents();
}
//--------------------------------------------------
function Update()
{
	_mouseClickDownUI();
}
//--------------------------------------------------
public static function getInstance() : PropUseLogic
{
	return mInstance;
}
//--------------------------------------------------
// 事件注册
private function _registEvents() : void
{
	// 网络事件注册
	NetHelper.RegistHandler(new notify_use_item_result(), handle_notify_use_item_resultt);
	NetHelper.RegistHandler(new notiy_use_item_by_scene(), handle_notiy_use_item_by_scene);
	// 普通事件注册
	// 其他事件注册
	Ctrl.Register("click_prop_item", clickPropItem);
	Ctrl.Register("cancel_use_item", _cancelUseProp);
}
//--------------------------------------------------
// 初始
public function init() : void
{
}
//--------------------------------------------------
// 点击道具选项
public function clickPropItem(pg : PackGrid) : void
{
	if (null == pg)
		return;
	
	var type : int = pg._item._itemInfo.type;
	if (ItemType.Prop!=type && ItemType.ClothesGift!=type && ItemType.FurnitureGift!=type && ItemType.MaterialGift!=type && ItemType.Clothes!=type && ItemType.Furniture!=type)
		return;
	
	_useProp(pg);
}
//--------------------------------------------------
// 使用道具
private function _useProp(pg : PackGrid) : void
{
	// step1:对特殊道具进行处理
	if (handleSpecialProp(pg))
		return;
	if(handleDecorate(pg))
		return;
	
	// step2:
	Ctrl.Set("prop_item", pg);
	var pur : PropUseRow = ResManager.LgtMgr.getPropUseRow(pg._item._itemInfo.id);
	// step3:
	if (1 == pur.target) {_usePropToSelf(pg, pur);}
	if (2 == pur.target) {_usePropToOther(pg, pur);}
	if (3 == pur.target) {_usePropToArea(pg, pur);}
	if (4 == pur.target) {_usePropToAll(pg, pur);}
}
//--------------------------------------------------
// 对自己使用
private function _usePropToSelf(pg : PackGrid, pur : PropUseRow) : void
{
	if ("(null)" == pur.intro)	// 直接使用
	{
		request_use_item(pg._item._instanceID, new Array());
	}
	else	// 经过确认后再使用
	{
		mUsePropToSelfFlag = true;
		Ctrl.Excute("open_prop_use_ui", null);
	}
}
//--------------------------------------------------
// 对其他人/家具使用
private function _usePropToOther(pg : PackGrid, pur : PropUseRow) : void
{
	mUsePropToOtherFlag = true;
	var cursor : Texture2D = Resources.Load("UISkins/Textures/Mouse/arrow_magicwand");
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MOUSE_USE_PROP_STATE), cursor);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENABLE_CANCEL_USE_PROP),true);
}
//--------------------------------------------------
// 取消使用道具
private function _cancelUseProp(param : System.Object) : void
{
	mUsePropToOtherFlag = false;
	mUsePropToSelfFlag = false;
	mUsePropToAll = false;
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MOUSE_NORMARL_STATE));
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENABLE_CANCEL_USE_PROP),false);
}
//--------------------------------------------------
// 对范围使用
private function _usePropToArea(pg : PackGrid, pur : PropUseRow) : void
{
	request_use_item(pg._item._instanceID, new Array());
}
//--------------------------------------------------
// 对所有人使用
private function _usePropToAll(pg : PackGrid, pur : PropUseRow) : void
{
	mUsePropToAll = true;
	var cursor : Texture2D = Resources.Load("UISkins/Textures/Mouse/arrow_magicwand");
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MOUSE_USE_PROP_STATE), cursor);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENABLE_CANCEL_USE_PROP),true);
}
//--------------------------------------------------
// 处理鼠标点击界面
private function _mouseClickDownUI() : void
{
	if (false == Input.GetMouseButtonDown(0))
		return;
	
	if (false == UI.getUI().IsMouseOverUI())
		return;
	
	_cancelUseProp(null);
}
//--------------------------------------------------
// 请求使用物品
public static function request_use_item(instance_id : UInt64, target_list : Array) : void
{
	var packet : req_use_item = new req_use_item();
	packet.item_inst_id = instance_id;
	for (var i:int=0; i<target_list.Count; ++i)
	{
		packet.target_list.Add(target_list[i]);
	}
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 处理通知请求使用物品消息(本条消息只通知主玩家)
private function handle_notify_use_item_resultt(evt:GameEvent, pack:notify_use_item_result)
{
	// result:1成功,0失败
	Ctrl.Excute("close_prop_use_ui", null);
	StorageLogic.getInstance().unselectPackGrid();
}
//------------------------------------------------
// 处理通知请求使用物品消息(本条消息通知当前场景的所有玩家,包括主玩家)
private function handle_notiy_use_item_by_scene(evt:GameEvent, pack:notiy_use_item_by_scene)
{
	// result:1成功,0失败
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_USE_ITEM_BY_SCENE), pack.item_id);
}
//------------------------------------------------
//check use state
public function IsProUseToOther() : boolean {
	return mUsePropToOtherFlag;
}

public function IsProUseToSelf() : boolean {
	return mUsePropToSelfFlag;
}

public function IsProUseToAll() : boolean {
	return mUsePropToAll;
}
//------------------------------------------------
// 对特殊道具进行处理
private function handleSpecialProp(pg : PackGrid) : boolean
{
	var item_id : int = pg._item._itemInfo.id;
	if (2200000==item_id || 2200004==item_id)		// 喇叭道具,打开喇叭界面
	{
		if (GiftLogic.getInstance().isStorageUIOpen())
		{
			iGUICode_StorageBoxUI.getInstance().exitStorage();
		}
		SpeakerComp.OpenSpeakerRoot();
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_OPENSPEAKER_BTN));
		return true;
	}
	return false;
}
//------------------------------------------------

// 处理家装及服装部分(by fullzhu 2012.7.31)
private var IsEnterFitmentPorp : boolean = false;
private function handleDecorate(pg : PackGrid) : boolean
{
	var type : int = pg._item._itemInfo.type;
	if(ItemType.Clothes == type) {
		iGUICode_MainUI.OpenDressUI();
		return true;
	}
	if(ItemType.Furniture == type) {
		if(EQGameSceneMgr.getSingleton().gameSceneType() == SceneType.COMM_SCENE || 
		   EQGameSceneMgr.getSingleton().gameSceneType() == SceneType.PUB_SCENE || 
		   !DataCenter.isInSelfHouse()) {
			UI.getUI().OpenMsgbox("", Define.getContent(5093),true);
		} else {
			iGUICode_StorageBoxUI.getInstance().exitStorage();
			
			EQCamera.getInstance().FollowMe = false;
			FitmentLogic.getInstance().ReqStartEditHouse();
			
			IsEnterFitmentPorp = true;
		}
		return true;
	}
	
	return false;
}

public function ExitFitment() {
	IsEnterFitmentPorp = false;
}

public function IsFitmentStatus() : boolean {
	return IsEnterFitmentPorp;
}
//------------------------------------------------


