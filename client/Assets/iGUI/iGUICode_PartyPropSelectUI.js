// alter by zlj

//import iGUI;
//
private static var instance : iGUICode_PartyPropSelectUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
//@HideInInspector
//var prop_select5 : iGUILabel;
//@HideInInspector
//var prop_bg5 : iGUIImage;
//@HideInInspector
//var prop_icon5 : iGUILabel;
//@HideInInspector
//var prop_item5 : iGUIPanel;
//@HideInInspector
//var prop_select4 : iGUILabel;
//@HideInInspector
//var prop_bg4 : iGUIImage;
//@HideInInspector
//var prop_icon4 : iGUILabel;
//@HideInInspector
//var prop_item4 : iGUIPanel;
//@HideInInspector
//var prop_select3 : iGUILabel;
//@HideInInspector
//var prop_bg3 : iGUIImage;
//@HideInInspector
//var prop_icon3 : iGUILabel;
//@HideInInspector
//var prop_item3 : iGUIPanel;
//@HideInInspector
//var prop_select2 : iGUILabel;
//@HideInInspector
//var prop_bg2 : iGUIImage;
//@HideInInspector
//var prop_icon2 : iGUILabel;
//@HideInInspector
//var prop_item2 : iGUIPanel;
//@HideInInspector
//var prop_select1 : iGUILabel;
//@HideInInspector
//var prop_bg1 : iGUIImage;
//@HideInInspector
//var prop_icon1 : iGUILabel;
//@HideInInspector
//var prop_item1 : iGUIPanel;
//@HideInInspector
//var prop_list : iGUIPanel;
//@HideInInspector
//var tip_label2 : iGUILabel;
//@HideInInspector
//var tip_label1 : iGUILabel;
//@HideInInspector
//var frame : iGUIPanel;
//@HideInInspector
//var root : iGUIRoot;
//
//
//
////--------------------------------------------------
function Start()
{
	registerEvents(); 
//	init();
}
////--------------------------------------------------
function OnDestroy()
{
	unregisterEvents();
//	clear();
}
////--------------------------------------------------
public function ClickCallback_create_btn(caller : iGUIElement) : void
{
	var house_id : UInt64 = DataCenter.getSelfHouseID();
	var house_name : String = DataCenter.getSelfHouseData().name;
	var player_name : String = DataCenter.getCurPlayerName();
	var type : int = Party.Ctrl.Get("party_type");
	var title : String = Party.Ctrl.Get("party_title");
	var describe : String = Party.Ctrl.Get("party_describe");

//	var select_items : Array = getSelectItems(); 
//	if ("" == mLackItemString)	// 没有缺少物品
//	{   
//		Party.request_create_party(house_id, house_name, player_name, type, title, describe, select_items);
//		return;
//	}
   
//	var msg : SysMsgRow = Global.GetSysMsgHandler().getSysMsgRow(507);
//	var content : String = msg.msg_content.Replace("{0}", mLackItemString);
//	UI.getUI().OpenMsgbox("", content, "", CallbackOk, "", CallbackEmpty);

    // alter by zlj
    // 因为特权卡功能没有了，直接使用一个空的数组
    var select_items : Array = new Array();
    // 派对食物ID(id为0时:表示创建普通派对,非食物类型派对)
	var foodID : int = iGUICode_PartyCreateUI.getInstance().GetPartyFoodID();
    var food_ids : Array = new Array();
    if(foodID > 0)
    {
       food_ids.Add(foodID);
    }
    Party.request_create_party(house_id, house_name, player_name, type, title, describe, select_items, food_ids);
}
////--------------------------------------------------
//private function CallbackOk(caller : iGUIElement) : void
//{
//	iGUICode_PartyCreateUI.getInstance().closePartyCreateUI();
//	Party.Ctrl.Excute("SHOW_HIDE_UI", true);
//	PropShopLogic.getInstance().openPropShopUI(1);		// 打开商城道具界面
//}
////--------------------------------------------------
//
//
//
//
//
//private var SLOT_NUM : int = 5;
//private var mSlotArray : Array = new Array();
private var mLackItemString : String = "";
//// 一些消息框里的文字描述,提供给策划方便在编辑器里修改
//public var PropItemId : int[];							// 道具id,数量要设为SLOT_NUM个
public var SharePicture : String;						// 可选,图片的URL
////--------------------------------------------------
private function registerEvents() : void
{
	Party.Ctrl.Register("CREATE_PARTY_RESULT", createPartyResult);
	Party.Ctrl.Register("PRIVATE_PARTY_NEED_ITEM", privatePartyNeedItem); // alter by zlj
}
////--------------------------------------------------
private function unregisterEvents() : void
{
	Party.Ctrl.Unregister("CREATE_PARTY_RESULT", createPartyResult);
	Party.Ctrl.Unregister("PRIVATE_PARTY_NEED_ITEM", privatePartyNeedItem);
}
////--------------------------------------------------// alter by zlj
//private function init() : void
//{
//	if (SLOT_NUM != PropItemId.Length)
//		throw "iGUICode_PartyPropSelectUI -> init() -> prop item num ["+PropItemId.Length+"] is wrong.";
//	
//	for (var i:int = 0; i<SLOT_NUM; ++i)
//	{
//		var res : iGUIElement[] = getPropCtrls(i);
//		var slot : PartyPropSelectSlot = new PartyPropSelectSlot(res[0], res[1], res[2], res[3]);
//		slot.setContent(PropItemId[i]);
//		mSlotArray.Add(slot);
//	}
//}
////--------------------------------------------------
//private function clear() : void
//{
//	for (var slot : PartyPropSelectSlot in mSlotArray)
//	{
//		slot.setContent(0);
//	}
//	mSlotArray.Clear();
//}
////--------------------------------------------------
//private function getSelectItems() : Array
//{
//	mLackItemString = "";
//	var selectArr : Array = new Array();
//	for (var slot : PartyPropSelectSlot in mSlotArray)
//	{
//		if (slot.IsSelected)
//		{
//			selectArr.Add(slot.ItemInfo.id);
//			if (false == slot.isExistInPackage())
//			{
//				if ("" == mLackItemString)
//					mLackItemString += "“" + slot.ItemInfo.name + "”";
//				else
//					mLackItemString += "，“" + slot.ItemInfo.name + "”";
//			}
//		}
//	}
//	return selectArr;
//}
////--------------------------------------------------
//private function getPropCtrls(index : int) : iGUIElement[]
//{
//	if (0 == index) return [prop_item1, prop_icon1, prop_bg1, prop_select1];
//	if (1 == index) return [prop_item2, prop_icon2, prop_bg2, prop_select2];
//	if (2 == index) return [prop_item3, prop_icon3, prop_bg3, prop_select3];
//	if (3 == index) return [prop_item4, prop_icon4, prop_bg4, prop_select4];
//	// 4 == idnex
//	return [prop_item5, prop_icon5, prop_bg5, prop_select5];
//}
////--------------------------------------------------
private function createPartyResult(result : int) : void
{
	var content : String = "";
	var privatePartyCreatedSuccess : boolean = false;
	if (0 == result)		// 创建派对成功
	{
		var type : int = Party.Ctrl.Get("party_type");
		if (1 == type)			// 普通派对
		{
			content = Define.getContent(5191);
		}
		else if (2 == type)		// 私人派对
		{
			content = Define.getContent(5191);
			privatePartyCreatedSuccess = true;
		}
		if (RuntimePlatform.WindowsWebPlayer == Application.platform)
		{
			ExternalFlatform.Share(share_type.st_party, "", Define.getContent(5192), Define.getContent(5193), SharePicture);
		}
		// 打开派对功能面板
		UI.getUI().OpenUIRoot("PartyFunctionUI");
		GuestLogic.getInstance().clearGuestList();
	}
	else					// 创建派对失败,派对最大上限
	{
		content = Define.getContent(5194, [result.ToString()]);
	}
	UI.getUI().OpenMsgbox("", content, true);
	iGUICode_PartyCreateUI.getInstance().closePartyCreateUI();
	Party.Ctrl.Excute("SHOW_HIDE_UI", true);
	if (privatePartyCreatedSuccess)
	{
		Party.request_invite_list();
	}
}
//--------------------------------------------------
private function privatePartyNeedItem(param : System.Object) : void
{
	UI.getUI().OpenMsgbox("", Define.getContent(5195), "", CallbackBuy, "", CallbackEmpty);
}
//--------------------------------------------------
private function CallbackBuy(caller : iGUIElement) : void
{
	PropBuyCommonLogic.getInstance().openPropBuyCommonUI(796);	// 私人许可证
}
//--------------------------------------------------
private function CallbackEmpty(caller : iGUIElement) : void
{
}
//--------------------------------------------------


