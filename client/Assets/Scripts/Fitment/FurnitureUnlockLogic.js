#pragma strict
#pragma downcast
import iGUI;


private static var mInstance : FurnitureUnlockLogic = null;
private var mShopCenterClass : ShopCenterClassRow = null;
private var mUnlockArray : Array = new Array();		// 已经解锁的类型
//--------------------------------------------------
function Awake()
{
	mInstance = this;
	NetHelper.RegistHandler(new notify_unlock_furniture_list(), handle_notify_unlock_furniture_list);
	NetHelper.RegistHandler(new notify_unlock_furniture(), handle_notify_unlock_furniture);
	Global.GetSysMsgHandler().RegistMsgCallback(554, fillOkCallback, fillCancelCallback, null);
}
//--------------------------------------------------
public static function getInstance() : FurnitureUnlockLogic
{
	return mInstance;
}
//--------------------------------------------------
private function handle_notify_unlock_furniture_list(evt:GameEvent, pack:notify_unlock_furniture_list):void
{
	mUnlockArray = pack.unlock_list.ToArray();	// 保存的是type
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_FURNI_TYPE_UNLOCK_LIST));
}
//--------------------------------------------------
public function request_unlock_furniture(id : int):void
{
	var req : req_unlock_furniture = new req_unlock_furniture();
	req.id = id;
	NetHelper.Send(req);
}
//--------------------------------------------------
private function handle_notify_unlock_furniture(evt:GameEvent, pack:notify_unlock_furniture):void
{
	closeUnlockUI();
}
//--------------------------------------------------
public function getShopCenterClass() : ShopCenterClassRow
{
	return mShopCenterClass;
}
//--------------------------------------------------
public function isUnlock(sccr : ShopCenterClassRow) : boolean
{
	if (null == sccr || false == sccr.unlock)	// 该类型不需要解锁
		return false;
	
	for (var unlock_type : int in mUnlockArray)
	{
		if (unlock_type == sccr.type)	// 该类型已经解锁了
			return false;
	}
	return true;
}
//--------------------------------------------------
public function openUnlockUI(sccr : ShopCenterClassRow) : void
{
	mShopCenterClass = sccr;
	UI.getUI().OpenUIRoot("FurnitureUnlockUI");
	UI.getUI().SetModal("FurnitureUnlockUI", true);
}
//--------------------------------------------------
public function closeUnlockUI() : void
{
	UI.getUI().SetModal("FurnitureUnlockUI", false);
	UI.getUI().CloseUIRoot("FurnitureUnlockUI");
	mShopCenterClass = null;
	FitmentLogic.getInstance().setCurClass(null);
}
//--------------------------------------------------
public function requestFillMaterial(mat_arr : Array) : void
{
	if (null == mat_arr || 0 == mat_arr.Count)
		return;
	
	var total_cost = 0;
	for (var mat : goods_atom in mat_arr)
	{
		var scr : ShopCenterRow = ResManager.LgtMgr.getShopCenterRow(mat.goods_id);
		total_cost += mat.count * scr.price;
	}
	Global.GetSysMsgHandler().RegistCallbackUserData(554, mat_arr);
	var params : ArrayList = new ArrayList();
	params.Add(total_cost);
	Global.GetSysMsgHandler().ShowSysMsg(554, params);
}
//--------------------------------------------------
private function fillOkCallback(caller : iGUIElement) : void
{
	var materials_arr : Array = caller.userData as Array;
	SelfItemLogic.ReqMutliBuySysShopGoods(materials_arr);
}
//--------------------------------------------------
private function fillCancelCallback(caller : iGUIElement) : void
{
}
//--------------------------------------------------


