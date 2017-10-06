import iGUI;

private static var instance : iGUICode_FurnitureUnlockUI;
function Awake(){
	instance=this;
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_BUY_SYS_SHOP_GOODS), handleBuySysShopGoods);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.LOVER_DIAMOND_CHANGE), handleDimondChange);
}
static function getInstance(){
	return instance;
}
@HideInInspector
var all_add_btn : iGUIButton;
@HideInInspector
var unlock_btn : iGUIButton;
@HideInInspector
var money_num_label : iGUILabel;
@HideInInspector
var money_icon_label : iGUILabel;
@HideInInspector
var furni_backgound : iGUILabel;
@HideInInspector
var furni_icon_label : iGUILabel;
@HideInInspector
var furni_name_label : iGUILabel;
@HideInInspector
var level_tip_label : iGUILabel;
@HideInInspector
var mat_add_btn4 : iGUIButton;
@HideInInspector
var mat_num_label4 : iGUILabel;
@HideInInspector
var mat_icon_label4 : iGUILabel;
@HideInInspector
var mat_background4 : iGUILabel;
@HideInInspector
var mat_name_label4 : iGUILabel;
@HideInInspector
var mat_item4 : iGUIPanel;
@HideInInspector
var mat_add_btn3 : iGUIButton;
@HideInInspector
var mat_num_label3 : iGUILabel;
@HideInInspector
var mat_icon_label3 : iGUILabel;
@HideInInspector
var mat_background3 : iGUILabel;
@HideInInspector
var mat_name_label3 : iGUILabel;
@HideInInspector
var mat_item3 : iGUIPanel;
@HideInInspector
var mat_add_btn2 : iGUIButton;
@HideInInspector
var mat_num_label2 : iGUILabel;
@HideInInspector
var mat_icon_label2 : iGUILabel;
@HideInInspector
var mat_background2 : iGUILabel;
@HideInInspector
var mat_name_label2 : iGUILabel;
@HideInInspector
var mat_item2 : iGUIPanel;
@HideInInspector
var mat_add_btn1 : iGUIButton;
@HideInInspector
var mat_num_label1 : iGUILabel;
@HideInInspector
var mat_icon_label1 : iGUILabel;
@HideInInspector
var mat_background1 : iGUILabel;
@HideInInspector
var mat_name_label1 : iGUILabel;
@HideInInspector
var mat_item1 : iGUIPanel;
@HideInInspector
var close_btn : iGUIButton;
@HideInInspector
var title_label : iGUILabel;
@HideInInspector
var frame : iGUIPanel;
@HideInInspector
var root : iGUIRoot;


private var mSccr : ShopCenterClassRow = null;
private var mScrrIcon : AsynIcon = null;
private var SLOT_NUM : int = 4;
private var mSlotArray : Array = new Array();
private var mFillMaterials : Array = new Array();
public var MoneyEnoughColor : Color = Color.white;
public var MoneyLackColor : Color = Color.red;
//--------------------------------------------------
function Start()
{
	close_btn.clickCallback = ClickCallback_click_btn;
	unlock_btn.clickCallback = ClickCallback_unlock_btn;
	all_add_btn.clickCallback = ClickCallback_all_add_btn;
	furni_icon_label.mouseOverCallback = MouseOverCallback_furni_icon_label;
	frame.setEnabled(true);
	init();
}
//--------------------------------------------------
function OnDestroy()
{
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_BUY_SYS_SHOP_GOODS), handleBuySysShopGoods);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.LOVER_DIAMOND_CHANGE), handleDimondChange);
	mSccr = null;
	mScrrIcon.cancel();
	mScrrIcon = null;
	clearMaterialSlots();
}
//--------------------------------------------------
function ClickCallback_click_btn(caller : iGUIElement)
{
	FurnitureUnlockLogic.getInstance().closeUnlockUI();
}
//--------------------------------------------------
function ClickCallback_unlock_btn(caller : iGUIElement)
{
	FurnitureUnlockLogic.getInstance().request_unlock_furniture(mSccr.id);
}
//--------------------------------------------------
function ClickCallback_all_add_btn(caller : iGUIElement)
{
	FurnitureUnlockLogic.getInstance().requestFillMaterial(mFillMaterials);
}
//--------------------------------------------------
function MouseOverCallback_furni_icon_label(caller : iGUIElement)
{
	if (null == mSccr || "" == mSccr.description)
		return;
	
	var style : GUIStyle = new GUIStyle();
	style.alignment = TextAnchor.MiddleCenter;
	style.normal.textColor = Color(1.0f, 1.0f, 1.0f);
	style.fontStyle = FontStyle.Bold;
	Global.SysTooltip.Begin(caller);
	Global.SysTooltip.Add(GUIContent(mSccr.description), style); 	
	Global.SysTooltip.Show(true);
}
//--------------------------------------------------
private function init() : void
{
	mSccr = FurnitureUnlockLogic.getInstance().getShopCenterClass();
	if (null == mSccr)
		throw "iGUICode_FurnitureUnlockUI -> init() -> shop center class is null.";
	
	initFurnitureUI();
	initMaterialUI();
	initMoneyLabel();
	initAllAddBtn();
}
//--------------------------------------------------
private function initFurnitureUI() : void
{
	var cur_level : int = DataCenter.getMainPlayerCurLv();
	level_tip_label.style.normal.textColor = cur_level >= mSccr.unlock_level ? MoneyEnoughColor : MoneyLackColor;
	level_tip_label.label.text = Define.getContent(5143, [mSccr.unlock_level.ToString()]);
	furni_name_label.label.text = Global.limitTextLength(mSccr.description, 12, Define.unknow, "...");
	mScrrIcon = new AsynIcon(setScrrIcon, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	mScrrIcon.load("Icon/" + mSccr.icon);
}
//--------------------------------------------------
private function setScrrIcon(tex : Texture) : void
{
	furni_icon_label.style.normal.background = tex;
}
//--------------------------------------------------
private function initMaterialUI() : void
{
	if (mSccr.unlock_material_shop_id.Count > SLOT_NUM)
		throw "iGUICode_FurnitureUnlockUI -> initMaterialUI() -> material count["+mSccr.unlock_material_shop_id.Count+"] out of range 4.";
	
	for (var i:int = 0; i<SLOT_NUM; ++i)
	{
		var eles : iGUIElement[] = getMaterialCtrls(i);
		mSlotArray.Add(new FurnitureUnlockSlot(eles[0], eles[1], eles[2], eles[3], eles[4], eles[5]));
	}
	for (var slot : FurnitureUnlockSlot in mSlotArray)
	{
		slot.setContent(0, 0);
	}
	for (var j:int =0; j<mSccr.unlock_material_shop_id.Count; ++j)
	{
		var id : int = mSccr.unlock_material_shop_id[j];
		var count : int = mSccr.unlock_material_count[j];
		(mSlotArray[j] as FurnitureUnlockSlot).setContent(id, count);
	}
}
//--------------------------------------------------
private function clearMaterialSlots() : void
{
	for (var slot : FurnitureUnlockSlot in mSlotArray)
	{
		slot.setContent(0, 0);
	}
	mSlotArray.Clear();
}
//--------------------------------------------------
private function getMaterialCtrls(index : int) : iGUIElement[]
{
	if (0 == index) return [mat_item1, mat_name_label1, mat_background1, mat_icon_label1, mat_num_label1, mat_add_btn1];
	if (1 == index) return [mat_item2, mat_name_label2, mat_background2, mat_icon_label2, mat_num_label2, mat_add_btn2];
	if (2 == index) return [mat_item3, mat_name_label3, mat_background3, mat_icon_label3, mat_num_label3, mat_add_btn3];
	// 3 == index
	return [mat_item4, mat_name_label4, mat_background4, mat_icon_label4, mat_num_label4, mat_add_btn4];
}
//--------------------------------------------------
private function initMoneyLabel() : void
{
	var cur_diamond : int = SelfItemLogic.getInstance().GetCurDiamond();
	money_num_label.style.normal.textColor = cur_diamond >= mSccr.unlock_money ? MoneyEnoughColor : MoneyLackColor;
	money_num_label.label.text = mSccr.unlock_money.ToString();
}
//--------------------------------------------------
private function initAllAddBtn() : void
{
	mFillMaterials.Clear();
	for (var i:int = 0; i<mSccr.unlock_material_shop_id.Count; ++i)
	{
		var goods_id : int = mSccr.unlock_material_shop_id[i];
		var need_count : int = mSccr.unlock_material_count[i];
		var scr : ShopCenterRow = ResManager.LgtMgr.getShopCenterRow(goods_id);
		var cur_count : int = SelfItemLogic.getInstance().getItemNum(scr.item_id);
		if (cur_count < need_count)		// 缺少材料
		{
			var mat : goods_atom = new goods_atom();
			mat.goods_id = goods_id;
			mat.count = need_count - cur_count;
			mFillMaterials.Add(mat);
		}
	}
	all_add_btn.passive = 0 == mFillMaterials.Count ? true : false;
}
//--------------------------------------------------
private function handleBuySysShopGoods(evt : GameEvent, obj : System.Object) : void
{
	initAllAddBtn();
	for (var slot : FurnitureUnlockSlot in mSlotArray)
	{
		slot.updateNum();
	}
}
//--------------------------------------------------
private function handleDimondChange(evt : GameEvent, obj : System.Object) : void
{
	initMoneyLabel();
}
//--------------------------------------------------





class FurnitureUnlockSlot
{
	private var mPanel : iGUIPanel = null;
	private var mNamelLabel : iGUILabel = null;
	private var mBackground : iGUILabel = null;
	private var mIconLabel : iGUILabel = null;
	private var mNumLabel : iGUILabel = null;
	private var mAddBtn : iGUIButton = null;
	private var mMaterialIcon : AsynIcon = null;
	private var mShopRow : ShopCenterRow = null;
	private var mItemRow : ItemRow = null;
	private var mCurCount : int = 0;
	private var mMaxCount : int = 0;
	//--------------------------------------------------
	public function FurnitureUnlockSlot(panel:iGUIPanel, name:iGUILabel, bg:iGUILabel, icon:iGUILabel, num:iGUILabel, btn:iGUIButton)
	{
		mPanel = panel;
		mNamelLabel = name;
		mBackground = bg;
		mIconLabel = icon;
		mNumLabel = num;
		mAddBtn = btn;
		icon.mouseOverCallback = MouseOver_icon;
		btn.clickCallback = ClickCallback_add;
	}
	//--------------------------------------------------
	public function setContent(id : int, count : int) : void
	{
		mMaxCount = count;
		setVisible(0 != id);
		if (0 == id)
		{
			mShopRow = null;
			mItemRow = null;
			if (mMaterialIcon)
			{
				mMaterialIcon.cancel();
				mMaterialIcon = null;
			}
			setMaterialIcon(null);
			updateNum();
			return;
		}
		mShopRow = ResManager.LgtMgr.getShopCenterRow(id);
		mItemRow = ResManager.LgtMgr.getItemRow(mShopRow.item_id);
		mMaterialIcon = new AsynIcon(setMaterialIcon, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
		mMaterialIcon.load("Icon/" + mItemRow.icon);
		mNamelLabel.label.text = Global.limitTextLength(mItemRow.name, 12, Define.unknow, "...");
		updateNum();
	}
	//--------------------------------------------------
	private function setMaterialIcon(tex : Texture) : void
	{
		mIconLabel.style.normal.background = tex;
	}
	//--------------------------------------------------
	private function setVisible(visible : boolean) : void
	{
		mPanel.setEnabled(visible);
	}
	//--------------------------------------------------
	public function updateNum() : void
	{
		if (null == mItemRow)
		{
			mNumLabel.label.text = "";
			return;
		}
		mCurCount = SelfItemLogic.getInstance().getItemNum(mItemRow.id);
		mNumLabel.style.normal.textColor = mCurCount >= mMaxCount ? Color.white : Color.red;
		mNumLabel.label.text = mCurCount.ToString() + "/" + mMaxCount.ToString();
		// 
		mAddBtn.passive = mCurCount < mMaxCount ? false : true;
	}
	//--------------------------------------------------
	private function MouseOver_icon(caller : iGUIElement) : void
	{
		if (null == mShopRow)
			return;
		
		ItemHint.ShowPackItemHint(caller, mShopRow);
	}
	//--------------------------------------------------
	private function ClickCallback_add(caller : iGUIElement) : void
	{
		if (null == mShopRow || mCurCount >= mMaxCount)
			return;
		
		var mat : goods_atom = new goods_atom();
		mat.goods_id = mShopRow.goods_id;
		mat.count = mMaxCount - mCurCount;
		var mat_arr : Array = new Array();
		mat_arr.Add(mat);
		FurnitureUnlockLogic.getInstance().requestFillMaterial(mat_arr);
	}
	//--------------------------------------------------
}


