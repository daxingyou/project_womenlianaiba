/*--------------------------------------------------
端午节抽奖逻辑(2012/6/16 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast

import iGUI;



private static var mInstance : DragonBoatFestival = null;
private var mItems : List.<lottery_item> = new List.<lottery_item>();
private var mHitIndex : int = 0;
private var mDragonItem : UInt64 = 0;


//--------------------------------------------------
function Awake()
{
	mInstance = this;
	registEvents();
}
public static function getInstance() : DragonBoatFestival
{
	if (null == mInstance)
	{
		throw Exception("DragonBoatFestival -> instance is null!");
	}
	return mInstance;
}
//--------------------------------------------------
// 事件注册
private function registEvents() : void
{
	NetHelper.RegistHandler(new notify_use_lottery_item_result(), handle_notify_use_lottery_item_result);
}
//--------------------------------------------------
// 处理通知使用抽奖物品结果
private function handle_notify_use_lottery_item_result(evt : GameEvent, pack : notify_use_lottery_item_result) : void
{
	var bNormal : boolean = false;
	if(pack.items.Count == 20) {
		bNormal = true;
	} else {
		bNormal = false;
	}
	// 保存数据
	mDragonItem = pack.item_inst_id;
	mItems.Clear();
	for (var row : lottery_item in pack.items)
	{
		mItems.Add(row);
	}
	mHitIndex = pack.hit_index;
	//
	if (GiftLogic.getInstance().isStorageUIOpen())
	{
		iGUICode_StorageBoxUI.getInstance().exitStorage();
	}
	UI.getUI().OpenUIRoot("DragonBoatFestivalUI");
	
	if(bNormal) {
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_DRAGON_NORMAL_UI), true);
	} else {
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_DRAGON_SMALL_UI), true);
	}
}
//--------------------------------------------------
// 获取抽奖物品
public function getItems() : List.<lottery_item>
{
	return mItems;
}
//--------------------------------------------------
// 获取获奖序号
public function getHitIndex() : int
{
	return mHitIndex;
}
//--------------------------------------------------
//batch dragonboat
public function UseDragonBoat() : boolean {
	var pg : PackGrid = SelfItemLogic.getInstance().Package.getItemPack(mDragonItem);
	if(pg == null || pg._item == null) return false;
	
	PropUseLogic.request_use_item(pg._item._instanceID,new Array());
	
	return true;
}

public function IsAutoDragonSmall() : boolean {
	var pg : PackGrid = SelfItemLogic.getInstance().Package.getItemPack(mDragonItem);
	if(pg == null || pg._item == null)
		return false;
	
	return true;
}
//





class DragonBoatFestivalSlot
{
	private var mIconLabel : iGUILabel = null;
	private var mCountLabel : iGUILabel = null;
	private var mCoverLabel : iGUILabel = null;
	private var mAsynIcon : AsynIcon = null;
	private var mInfo : ItemRow = null;
	public var ItemID : int = 0;		// 物品id
	public var ItemNum : int = 0;		// 物品数量
	//--------------------------------------------------
	public function DragonBoatFestivalSlot(icon_label : iGUILabel, count_label : iGUILabel, cover_label : iGUILabel)
	{
		mIconLabel = icon_label;
		mCountLabel = count_label;
		mCoverLabel = cover_label;
		mAsynIcon = new AsynIcon(setIcon, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
		icon_label.mouseOverCallback = MouseOverCallback_icon_label;
		setSelect(false);
	}
	//--------------------------------------------------
	private function setIcon(tex : Texture) : void
	{
		mIconLabel.style.normal.background = tex;
	}
	//--------------------------------------------------
	public function setContent(item_id : int, num : int) : void
	{
		ItemID = item_id;
		ItemNum = num;
		if (0==item_id && 0==num)
		{
			mAsynIcon.cancel();
			mIconLabel.style.normal.background = null;
			mCountLabel.label.text = "";
			mInfo = null;
			return;
		}
		//
		mInfo = ResManager.LgtMgr.getItemRow(item_id);
		mAsynIcon.load("Icon/" + mInfo.icon);
		mCountLabel.label.text = num.ToString();
	}
	//--------------------------------------------------
	public function setSelect(select : boolean) : void
	{
		if(mCoverLabel != null) {
			mCoverLabel.setEnabled(!select);
		}
	}
	//--------------------------------------------------
	private function MouseOverCallback_icon_label(caller : iGUIElement) : void
	{
		if (null == mInfo)
			return;
		
		ItemHint.ShowPackItemHint(mIconLabel, mInfo, true);
	}
	//--------------------------------------------------
}


