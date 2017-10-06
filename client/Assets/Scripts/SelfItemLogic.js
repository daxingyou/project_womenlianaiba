#pragma strict
#pragma downcast

/* create by Y3
 *
 */
public var Package : ItemPackage = new ItemPackage();	// 真正的背包(只有接收到服务器消息时才进行添加和删除操作)
@HideInInspector
var _loverPackage : ItemPack = new ItemPack();			// 假的背包,主要用于表现,可以进行假的操作(添加和删除物品)
@HideInInspector
var _loverDiamond : int = 0;

private static var instance : SelfItemLogic;
static function getInstance(){
	return instance;
}

public static function ReqDeleteLoverItem(uid_arr : Array) {
	var packet:req_delete_lover_item = new req_delete_lover_item();
	for (var uid : UInt64 in uid_arr)
	{
		packet.item_inst_ids.Add(uid);
	}
	NetHelper.Send(packet);
}

public static function ReqBuySysShopGoods(goods_id : int, count : int) {
	var packet:req_buy_sys_shop_goods = new req_buy_sys_shop_goods();
	packet.goods_id = goods_id;
	packet.count = count;
	NetHelper.Send(packet);
}

public static function ReqMutliBuySysShopGoods(goods_arr : Array) {
	var packet:req_mutli_buy_sys_shop_goods = new req_mutli_buy_sys_shop_goods();
	for (var goods : goods_atom in goods_arr)
	{
		packet.goods_list.Add(goods);
	}
	NetHelper.Send(packet);
}

//////////////////////////////////////////////////////////
function Awake(){
	instance=this;
	
	RegistNetMsg();
}

function Start () {
	Package.Ctrl.Register("INIT_ITEM_PACK", initItemPack);
	Package.Ctrl.Register("ADD_ITEM_PACK", addItemPack);
	Package.Ctrl.Register("DEL_ITEM_PACK", delItemPack);
	Package.Ctrl.Register("UPDATE_ITEM_PACK", updateItemPack);
}

function RegistNetMsg() {
	NetHelper.RegistHandler(new notify_lover_diamond(), handle_notify_lover_diamond);
	NetHelper.RegistHandler(new notify_lover_package(), handle_notify_lover_package);
	NetHelper.RegistHandler(new notify_add_lover_items(), handle_notify_add_lover_items);
	NetHelper.RegistHandler(new notify_update_items_count(), handle_notify_update_items_count);
}

private static var first=true;
function handle_notify_lover_diamond(evt:GameEvent, pack:notify_lover_diamond)
{
	if(first)
		first = false; //登录时不跳
	else
	{
		if(pack.amount != _loverDiamond)
			UIAnimation.createNumberAnimation(Rect(0.5,0.4,0,0), Rect(0.5,0.1,0,0), "crystal_big", pack.amount-_loverDiamond);
			//UIAnimation.createNumberAnimation(Rect(35,135,0,0), Rect(35,35,0,0), "crystal_big", pack.amount-_loverDiamond);
	}
	
	_loverDiamond = pack.amount;
	iGUICode_MainUI.getInstance().crystal_text.label.text = pack.amount.ToString();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.LOVER_DIAMOND_CHANGE), pack.amount);
}

function handle_notify_lover_package(evt:GameEvent, pack:notify_lover_package)
{
	Package.init(pack.grid_vec);
}

function handle_notify_add_lover_items(evt:GameEvent, msg:notify_add_lover_items)
{
	for (var pg : pack_grid in msg.items)
	{
		Package.addItemPack(pg);
	}
}


function handle_notify_update_items_count(evt:GameEvent, msg:notify_update_items_count)
{
	for (var pg : pair_item_count in msg.items)
	{
	    if (0 == pg.count)
	    {
		    Package.delItemPack(pg.item_inst_id);
	    }
	    else
	    {
		    Package.updateItemPack(pg);
		}
	}
}
//--------------------------------------------------
// 回调,内部调用
function initItemPack(param : ArrayList)
{
	_loverPackage.init(param);
}
//--------------------------------------------------
// 回调,内部调用
function addItemPack(param : System.Object)
{
	addToPack(new PackGrid(param));
	PropShopLogic.Ctrl.Excute("buy_prop_result", null);
}
//--------------------------------------------------
// 回调,内部调用
function delItemPack(param : UInt64)
{
	delFromPack(param);
}
//--------------------------------------------------
// 回调,内部调用
function updateItemPack(param : pair_item_count)
{
	updatePack(param.item_inst_id, param.count);
	PropShopLogic.Ctrl.Excute("buy_prop_result", null);
}
//--------------------------------------------------
// 是否存在物品(实例id)
public function existItemPack(instance_id : UInt64) : boolean
{
	if (null == Package.getItemPack(instance_id))
		return false;
	
	return true;
}
//--------------------------------------------------
// 是否存在物品(模板id)
public function existItemPackEx(template_id : int) : boolean
{
	var _itm_num : int = getItemNum(template_id);
	if (0 == _itm_num)
		return false;
	
	return true;
}
//--------------------------------------------------
// 获取物品数量
public function getItemNum(template_id : int) : int
{
	var arr : Array = Package.getItemPack(template_id);
	var count : int = 0;
	for (var pg : PackGrid in arr)
	{
		count += pg._count;
	}
	return count;
}
//--------------------------------------------------
// 获取格子
public function getPackGrid(instance_id : UInt64) : PackGrid
{
	return _loverPackage.getPackGridByInstID(instance_id);
}
//--------------------------------------------------
// 获取类型物品
public function getPackGridList(type : ItemType) : ArrayList
{
	var list : ArrayList = new ArrayList();
	
	var pack : ItemPack = SelfItemLogic.getInstance()._loverPackage;
	for(var i=0; i<pack.count(); ++i) {
		var grid : PackGrid = pack.getPackGrid(i);
		if (type == grid._item._itemInfo.type) {
			list.Add(grid);
		}
	}
	return list;
}
//--------------------------------------------------
// 增加物品到背包
public function addToPack(pack : PackGrid) : void
{
	_loverPackage.addPackGrid(pack);
}
//--------------------------------------------------
// 增加物品到背包
public function addToPack(instance_id : UInt64, template_id : int, property : ArrayList) : void
{
	var ie : item = new item();
	ie.instance_id = instance_id;
	ie.template_id = template_id;
	ie.property = property;
	var pg : pack_grid = new pack_grid();
	pg.count = 1;
	pg.Lock = 0;
	pg.item_data = ie;
	addToPack(new PackGrid(pg));
}
//--------------------------------------------------
// 从背包删除物品
public function delFromPack(instance_id : UInt64) : void
{
	_loverPackage.delPackGrid(instance_id);
}
//--------------------------------------------------
// 更细背包物品
public function updatePack(instance_id : UInt64, count : int) : void
{
	_loverPackage.updatePackGrid(instance_id, count);
}
//--------------------------------------------------
public function GetCurDiamond(){
	return _loverDiamond;
}

