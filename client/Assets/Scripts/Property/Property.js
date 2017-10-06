/*--------------------------------------------------
属性(2012/6/11 create by hezhr)
--------------------------------------------------*/
#pragma strict



private static var mInstance : Property = null;			// 实例
private var mCharm : int = 0;							// 魅力值
private var mDecoration : int = 0;						// 房屋装饰度


//--------------------------------------------------
function Awake()
{
	mInstance = this;
	// 事件注册
	NetHelper.RegistHandler(new notify_player_info(), handleNotifyPlayerInfo);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOUSE_CREATED), handleNotifyHouseInfo);
	
	// alter by zlj 刷新人物魅力值事件
	NetHelper.RegistHandler(new notify_calc_player_charm(), handleNotifyRefreshCharm);
}
public static function getInstance() : Property
{
	if (null == mInstance)
	{
		throw Exception("Property -> instance is null!");
	}
	return mInstance;
}
//--------------------------------------------------
// 请求玩家数据
public static function requestPlayerInfo(account : String) : void
{
	var packet : req_player_info = new req_player_info();
	packet.account = account;
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 通知玩家数据
private function handleNotifyPlayerInfo(evt : GameEvent, pack : notify_player_info) : void
{
	// 改变玩家魅力值
	var pObj : GameObject = ScenePlayerMgr.getPlayer(pack.player.account);
	if (pObj)
	{
		var p : Player = pObj.GetComponent("Player") as Player;
		if (p)
		{
			p.setBasicData(pack.player);
		}
	}
	// 玩家房屋的魅力值显示
	if (DataCenter.getCurHouseID() == DataCenter.getHouseID(pack.player.account))
	{
		setPlayerCharm(pack.player.charm);
	}
}
//--------------------------------------------------
// 通知房屋信息
private function handleNotifyHouseInfo(evt : GameEvent, info : house_info) : void
{
	if(!info)
		return;
	
	setDecoration(info.decoration);
	var account : String = DataCenter.getMainPlayerAccount();
	if (false == DataCenter.isInSelfHouse())
	{
		account = Global.GetCurVisitHouseAccount();
	}
	
	if ("" == account)
		throw Exception("Property -> handleNotifyHouseInfo(GameEvent, house_info) -> account is null.");
	
	requestPlayerInfo(account);
}
//--------------------------------------------------
// 设置人物魅力值
public function setPlayerCharm(charm : int) : void
{
//	Debug.LogWarning("=== property -> charm: "+charm);
	mCharm = charm;
	var charm_label : iGUILabel = iGUICode_MainUI.getInstance().diamond_text;
	charm_label.label.text = charm.ToString();
}
//--------------------------------------------------
// 设置当前房屋装饰度
public function setDecoration(decoration : int) : void
{
//	Debug.LogWarning("=== property -> decoration: "+decoration);
	mDecoration = decoration;
	var decoration_label : iGUILabel = iGUICode_MainUI.getInstance().diamond_text2;
	decoration_label.label.text = decoration.ToString();
}
//--------------------------------------------------
// 获取魅力值
public function getCharm() : int
{
	return mCharm;
}
//--------------------------------------------------
// 获取房屋装饰度
public function getDecoration() : int
{
	return mDecoration;
}
//--------------------------------------------------
// 获取最大家具数量
public function getMaxFurniNum() : int
{
	var data : house_info = EQGameSceneMgr.getSingleton().getHouseData();
	if (null == data)
		throw Exception("Property -> getMaxFurniNum() -> data is null.");
	
	var house_row : PlayerHouseRow = ResManager.LgtMgr.PlayerHouseTable[data.template_id] as PlayerHouseRow;
	if (null == house_row)
		throw Exception("Property -> getMaxFurniNum() -> can't find row[" + data.template_id + "].");
	
	return house_row.max_furniture;
}
//--------------------------------------------------
// 获取当前家具数量
public function getCurFurniNum() : int
{
	var ph : PlayerHouse = EQGameSceneMgr.getSingleton().getHouse();
	if (null == ph)
		throw Exception("Property -> getCurFurniNum() -> house is null.");
	
	var table : Hashtable = ph.getFurnitures();
	return table.Count;
}
//--------------------------------------------------
// 从属性列表里获取属性值
private function getProperty(property : ArrayList, type : ItemType) : int
{
	if (null == property)
		return -1;
	
	var type_str : String = "";
	if (ItemType.Furniture == type)		// 家具
	{
		type_str = "decoration";
	}
	if (ItemType.Clothes == type)		// 衣服
	{
		type_str = "charm";
	}
	for (var pr : Object in property)
	{
		var prop : item_property = pr as item_property;
		if (type_str == prop.key)
			return prop.value;
	}
	return -1;
}
//--------------------------------------------------
// 获取属性值
public function getProperty(ir : ItemRow) : int
{
	if (null == ir)
		throw Exception("Property -> getProperty(ItemRow) -> row is null.");
	
	// 家具
	if (ItemType.Furniture == ir.type)
	{
		return ResManager.LgtMgr.getFurniturePropertyRow(ir.property_id).decoration;
	}
	// 衣服
	if (ItemType.Clothes == ir.type)
	{
		var cpr : ClothesPropertyRow = ResManager.LgtMgr.getClothesPropertyRow(ir.property_id);
		if (-1 == cpr.charm)
			throw Exception("Property -> getProperty(ItemRow) -> item id[" + ir.id + "], clothes property row[" + ir.property_id + "] is wrong.");
		
		return cpr.charm;
	}
	throw Exception("Property -> getProperty(ItemRow) -> item id[" + ir.id + "], item type[" + ir.type + "] isn't furniture or clothes.");
}
//--------------------------------------------------
// 获取属性值
public function getProperty(comp : HouseSceneComponent) : int
{
	if (null == comp)
		throw Exception("Property -> getProperty(HouseSceneComponent) -> comp is null.");
	
	var val : int = getProperty(comp.Property, ItemType.Furniture);
	if (-1 == val)
	{
		var row : ItemRow = ResManager.LgtMgr.getItemRow(comp.ItemId);
		return getProperty(row);
	}
	return val;
}
//--------------------------------------------------
// 获取属性值
public function getProperty(it : Item) : int
{
	if (null == it)
		throw Exception("Property -> getProperty(Item) -> item is null.");
	
	var val : int = getProperty(it._property, it._itemInfo.type);
	if (-1 == val)
		return getProperty(it._itemInfo);
	
	return val;
}
//--------------------------------------------------

// aleter by zlj 刷新人物魅力值事件
private function handleNotifyRefreshCharm(evt : GameEvent, pack : notify_calc_player_charm)
{
    var charm : int = pack.charm;
    setPlayerCharm(charm);
}
