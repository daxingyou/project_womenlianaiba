#pragma strict
#pragma downcast
/*--------------------------------------------------
Item hint (2012/5/12 create by Y3)
--------------------------------------------------*/



//--------------------------------------------------
// 用来显示包裹里的item hint. showSellPrice为是否显示价格
public static function ShowPackItemHint(element : iGUIElement, pack : pack_grid, showSellPrice : boolean) : void
{
	ShowPackItemHint(element, new PackGrid(pack), showSellPrice);
}
public static function ShowPackItemHint(element : iGUIElement, pack : PackGrid, showSellPrice : boolean) : void
{
	ShowPackItemHint(element, pack._item, showSellPrice);
}
public static function ShowPackItemHint(element : iGUIElement, item : Item, showSellPrice : boolean) : void
{
	Global.SysTooltip.Begin(element);
	
	displayName(item._itemInfo);
	displayType(item._itemInfo);
	displayProperty(item);
	displayUseLevel(item._itemInfo);
	displayItemLevel(item._itemInfo);
	displayCanUpgrade(item._itemInfo);
	displayEffectTime(item);
	displayBind(item._itemInfo);
	displayDescription(item._itemInfo);
	if (showSellPrice)
	{
		displaySellPrice(item._itemInfo);
	}
	
	Global.SysTooltip.Show(true);
}
//--------------------------------------------------
// 目前只有在换装时的栏位显示
public static function ShowPackItemHint(element : iGUIElement, row : ItemRow, showEffectTime : boolean) : void
{
	Global.SysTooltip.Begin(element);
	
	displayName(row);
	displayType(row);
	displayProperty(row);
	displayUseLevel(row);
	displayItemLevel(row);
	displayCanUpgrade(row);
	if (showEffectTime)
	{
		displayEffectTime(row.id);
	}
	displayBind(row);
	displayDescription(row);
	
	Global.SysTooltip.Show(true);
}
//--------------------------------------------------
// 用来显示商城的物品
public static function ShowPackItemHint(element : iGUIElement, scr : ShopCenterRow) : void
{
	var row : ItemRow = ResManager.LgtMgr.getItemRow(scr.item_id);
	
	Global.SysTooltip.Begin(element);
	
	displayName(row);
	displayType(row);
	displayProperty(row);
	displayUseLevel(row);
	displayItemLevel(row);
	displayCanUpgrade(row);
	displayPlayLevel(scr);
	displayEffectTime(row.id);
	displayBind(row);
	displayDescription(row);
	
	Global.SysTooltip.Show(true);
}
//--------------------------------------------------
// 显示名字
private static function displayName(info : ItemRow) : void
{
	var style : GUIStyle = new GUIStyle();
	style.alignment = TextAnchor.MiddleCenter;
	style.normal.textColor = Color(255/255.0f, 255/255.0f, 255/255.0f);
	style.fontStyle = FontStyle.Bold;
	style.wordWrap = false;
	
	Global.SysTooltip.Add(GUIContent(info.name), style);
}
// 显示类型
private static function displayType(info : ItemRow) : void
{
	var style : GUIStyle = new GUIStyle();
	style.alignment = TextAnchor.MiddleCenter;
	style.normal.textColor = Color(255/255.0f, 228/255.0f, 0/255.0f);
	style.fontStyle = FontStyle.Bold;
	style.wordWrap = false;
	
	var type : String = Define.unknowtype;
	if (info.type == ItemType.Clothes)
		type = Define.clothes;
	else if (info.type == ItemType.Furniture)
		type = Define.furniture;
	else if (info.type == ItemType.Prop)
		type = Define.canuseprop;
	else if (info.type == ItemType.PropCantUse)
		type = Define.specialprop;
	else if (info.type == ItemType.ClothesGift)
		type = Define.clothesbag;
	else if (info.type == ItemType.ComposePaper)
		type = Define.composepaper;
	else if (info.type == ItemType.ComposeMaterial)
		type = Define.composematerial;
	else if (info.type == ItemType.FurnitureGift)
		type = Define.furniturebag;
	else if (info.type == ItemType.MaterialGift)
		type = Define.materialbag;
	else
		type = "其他";
	
	Global.SysTooltip.Add(GUIContent(type), style);
}
// 显示购买等级
private static function displayPlayLevel(shop : ShopCenterRow) : void
{
	if (0 == shop.limit_level)
		return;
	
	var style : GUIStyle = new GUIStyle();
	style.alignment = TextAnchor.MiddleCenter;
	style.normal.textColor = Color(0/255.0f, 252/255.0f, 255/255.0f);
	style.fontStyle = FontStyle.Bold;
	style.wordWrap = false;
	
	Global.SysTooltip.Add(GUIContent(Define.getContent(5116) + " " + shop.limit_level.ToString()), style);
}
// 显示已购买物品的剩余时效,如背包
private static function displayEffectTime(it : Item) : void
{
	var effect : String = TimeEffect.getInstance().getEffectTimeStr(it);
	if ("" == effect)
		return;

	var style : GUIStyle = new GUIStyle();
	style.alignment = TextAnchor.MiddleCenter;
	style.normal.textColor = Color(0/255.0f, 252/255.0f, 255/255.0f);
	style.fontStyle = FontStyle.Bold;
	style.wordWrap = false;

	Global.SysTooltip.Add(GUIContent(effect), style);
}
// 显示未购买物品的剩余时效,如商城
private static function displayEffectTime(item_id : int) : void
{
	var effect : String = TimeEffect.getInstance().getEffectTimeStr(item_id);
	if ("" == effect)
		return;
	
	var style : GUIStyle = new GUIStyle();
	style.alignment = TextAnchor.MiddleCenter;
	style.normal.textColor = Color(0/255.0f, 252/255.0f, 255/255.0f);
	style.fontStyle = FontStyle.Bold;
	style.wordWrap = false;
	
	Global.SysTooltip.Add(GUIContent(effect), style);
}
// 显示是否可赠送
private static function displayBind(info : ItemRow) : void
{
	var style : GUIStyle = new GUIStyle();
	style.alignment = TextAnchor.MiddleCenter;
	style.normal.textColor = Color(0/255.0f, 255/255.0f, 168/255.0f);
	style.fontStyle = FontStyle.Bold;
	style.wordWrap = false;
	
	var bind : String = 0 == info.bind ? Define.cansend : Define.cannotsend;
	Global.SysTooltip.Add(GUIContent(bind), style);
}
// 显示描述内容
private static function displayDescription(info : ItemRow) : void
{
	var descr : String = ResManager.LgtMgr.getItemDescription(info.id);
	if ("" == descr)
		return;
	
	var style : GUIStyle = new GUIStyle();
	style.alignment = TextAnchor.MiddleCenter;
	style.normal.textColor = Color(255/255.0f, 255/255.0f, 255/255.0f);
	style.fontStyle = FontStyle.Bold;
	style.wordWrap = true;
	
	Global.SysTooltip.Add(GUIContent(descr), style);
}
// 显示回收价格
private static function displaySellPrice(info : ItemRow) : void
{
	var style : GUIStyle = new GUIStyle();
	style.alignment = TextAnchor.MiddleCenter;
	style.normal.textColor = Color(255/255.0f, 255/255.0f, 255/255.0f);
	style.fontStyle = FontStyle.Bold;
	style.wordWrap = false;
	
	var str : String = 0 == info.sell_price ? Define.cannotrecover : Define.recoverprice + "：" + info.sell_price.ToString();
	Global.SysTooltip.Add(GUIContent(str), style);
}
// 显示属性值
private static function displayProperty(info : ItemRow) : void
{
	var prop : int = info.property_id;
	if (0 == prop)
		return;
	
	var propStr : String;
	var color : Color;
	if (1 == info.type)
	{
		propStr = Define.charm + "：";
		color = Color(50/255.0f, 255/255.0f, 0/255.0f);
	}
	else if (2 == info.type)
	{
		propStr = Define.luxury + "：";
		color = Color(240/255.0f, 255/255.0f, 0/255.0f);
	}
	else
		return;
	
	var style : GUIStyle = new GUIStyle();
	style.alignment = TextAnchor.MiddleCenter;
	style.normal.textColor = color;
	style.fontStyle = FontStyle.Bold;
	style.wordWrap = false;
	
	var propety : int = Property.getInstance().getProperty(info);
	Global.SysTooltip.Add(GUIContent(propStr + propety.ToString()), style);
}
// 显示属性值
private static function displayProperty(item : Item) : void
{
	if (0 == item._property.Count)
	{
		displayProperty(item._itemInfo);
		return;
	}
	
	var val : int = Property.getInstance().getProperty(item);
	//找到
	var info : ItemRow = item._itemInfo;
	var propStr : String;
	var color : Color;
	if (1 == info.type)
	{
		propStr = Define.charm + "：";
		color = Color(50/255.0f, 255/255.0f, 0/255.0f);
	}
	else if (2 == info.type)
	{
		propStr = Define.luxury + "：";
		color = Color(240/255.0f, 255/255.0f, 0/255.0f);
	}
	else
		return;
	

	var style : GUIStyle = new GUIStyle();
	style.alignment = TextAnchor.MiddleCenter;
	style.normal.textColor = color;
	style.fontStyle = FontStyle.Bold;
	style.wordWrap = false;
	
	Global.SysTooltip.Add(GUIContent(propStr + val.ToString()), style);
}
// 显示使用等级
private static function displayUseLevel(info : ItemRow) : void
{
	if (ItemType.Clothes != info.type && ItemType.Furniture != info.type)
		return;
	
	var style : GUIStyle = new GUIStyle();
	style.alignment = TextAnchor.MiddleCenter;
	style.normal.textColor = Color(248/255.0f, 165/255.0f, 4/255.0f);
	style.fontStyle = FontStyle.Bold;
	style.wordWrap = false;
	
	var str : String = Define.uselevel + "：" + info.use_level.ToString() + Define.level;
	Global.SysTooltip.Add(GUIContent(str), style);
}
// 显示物品星级
private static function displayItemLevel(info : ItemRow) : void
{
	var style : GUIStyle = new GUIStyle();
	style.alignment = TextAnchor.MiddleCenter;
	style.normal.textColor = Color(0, 1, 0);
	style.fontStyle = FontStyle.Bold;
	style.wordWrap = false;
	
	var str : String = Define.itemlevel + "：" + info.level.ToString();
	Global.SysTooltip.Add(GUIContent(str), style);
}
// 显示是否可以升级
private static function displayCanUpgrade(info : ItemRow) : void
{
	var style : GUIStyle = new GUIStyle();
	style.alignment = TextAnchor.MiddleCenter;
	style.normal.textColor = Color(0, 1, 0);
	style.fontStyle = FontStyle.Bold;
	style.wordWrap = false;
	
	var str : String = ItemUpgradeLogic.GetInstance().IsCanUpgrade(info.id) ? Define.canupgrade : Define.cannotupgrade;
	Global.SysTooltip.Add(GUIContent(str), style);
}
