import iGUI;

private static var instance : iGUICode_PropBuyCommonUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var total_num_label : iGUILabel;
@HideInInspector
var total_icon_label : iGUILabel;
@HideInInspector
var tip_label2 : iGUILabel;
@HideInInspector
var tip_label1 : iGUILabel;
@HideInInspector
var price_num_label : iGUILabel;
@HideInInspector
var price_icon_label : iGUILabel;
@HideInInspector
var diamond_num_label : iGUILabel;
@HideInInspector
var diamond_icon_label : iGUILabel;
@HideInInspector
var prop_name_label : iGUILabel;
@HideInInspector
var prop_icon_label : iGUILabel;
@HideInInspector
var count_minus_btn : iGUIButton;
@HideInInspector
var count_low_label : iGUILabel;
@HideInInspector
var count_high_label : iGUILabel;
@HideInInspector
var count_add_btn : iGUIButton;
@HideInInspector
var close_btn : iGUIButton;
@HideInInspector
var buy_btn : iGUIButton;
@HideInInspector
var frame : iGUIPanel;
@HideInInspector
var root : iGUIRoot;



//--------------------------------------------------
function Start()
{
	// 界面事件注册
	buy_btn.clickCallback = ClickCallback_buy_btn;
	close_btn.clickCallback = ClickCallback_close_btn;
	count_add_btn.clickCallback = ClickCallback_count_add_btn;
	count_minus_btn.clickCallback = ClickCallback_count_minus_btn;
	prop_icon_label.mouseOverCallback = MouseOverCallback_prop_icon_label;
	// 初始
	init();
}
//--------------------------------------------------
function OnDestroy()
{
	if (mPropAsynIcon)
	{
		mPropAsynIcon.cancel();
	}
}
//--------------------------------------------------



/***************************************************
*** 界面事件回调
***************************************************/
//--------------------------------------------------
// 点击购买按钮
function ClickCallback_buy_btn(caller : iGUIElement)
{
	SelfItemLogic.ReqBuySysShopGoods(mShopCenterInfo.goods_id, mBuyItemCount);
	PropBuyCommonLogic.getInstance().closePropBuyCommonUI();
}
//--------------------------------------------------
// 点击关闭按钮
function ClickCallback_close_btn(caller : iGUIElement)
{
	PropBuyCommonLogic.getInstance().closePropBuyCommonUI();
}
//--------------------------------------------------
// 点击数量增加按钮
function ClickCallback_count_add_btn(caller : iGUIElement)
{
	if (!controlClickBuyCountBtnTime() || mBuyItemCount >= BUY_MAX_COUNT)
		return;
	
	setBuyCountLabel(++mBuyItemCount);
}
//--------------------------------------------------
// 点击数量减少按钮
function ClickCallback_count_minus_btn(caller : iGUIElement)
{
	if (!controlClickBuyCountBtnTime() || mBuyItemCount <= 1)
		return;
	
	setBuyCountLabel(--mBuyItemCount);
}
//--------------------------------------------------
// 鼠标移到道具图标上
function MouseOverCallback_prop_icon_label(caller : iGUIElement)
{
	ItemHint.ShowPackItemHint(caller, mShopCenterInfo);
}
//--------------------------------------------------



/***************************************************
*** 界面逻辑
***************************************************/
public var ClickTimeGap : float = 0.12f;					// 长时间按住增加/减少数量按钮,数字增加的间隔
private var BUY_MAX_COUNT : int = 99;						// 购买上限
private var mBuyItemCount : int = 1;						// 当前要购买的物品数量
private var mPropAsynIcon : AsynIcon = null;				// 购买物品图片异步加载器
private var mClickCountBtnTime : float = 0;					// 点击增加/减少数量按钮的时间
private var mShopCenterInfo : ShopCenterRow = null;			//
private var mItemInfo : ItemRow = null;						// 
private var mUnitPrice : int = 0;							// 单价



//--------------------------------------------------
// 初始
private function init() : void
{
	// 数据获取
	var goods_id : int = PropBuyCommonLogic.getInstance().Ctrl.Get("goods_id");
	mShopCenterInfo = ResManager.LgtMgr.getShopCenterRow(goods_id);
	mItemInfo = ResManager.LgtMgr.getItemRow(mShopCenterInfo.item_id);
	// 界面内容设置
	setBuyCountLabel(mBuyItemCount);
	setPropInfo();
}
//--------------------------------------------------
// 控制鼠标点击增加/减少数量按钮时间(为了防止不能精确定位到某个数字)
private function controlClickBuyCountBtnTime() : boolean
{
	if (Time.time - mClickCountBtnTime < ClickTimeGap)
		return false;
	
	mClickCountBtnTime = Time.time;
	return true;
}
//--------------------------------------------------
// 设置购买数量
private function setBuyCountLabel(count : int) : void
{
	count_high_label.style.normal.background = getNumImage(count/10);
	count_low_label.style.normal.background = getNumImage(count%10);
	setTotalPrice(count);
}
//--------------------------------------------------
// 获取数字图片名
private function getNumImage(num : int) : Texture
{
	var name : String = "number_" + num.ToString();
	return Resources.Load("UISkins/Textures/Common1/" + name);
}
//--------------------------------------------------
// 设置道具信息
private function setPropInfo() : void
{
	if (null == mPropAsynIcon)
	{
		mPropAsynIcon =  new AsynIcon(setPropIcon, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	}
	mPropAsynIcon.load("Icon/" + mItemInfo.icon);
	prop_name_label.label.text = mItemInfo.name;
	// 设置价格信息
	if (money_type.mt_diamond == mShopCenterInfo.money_type)			// 水晶
	{
		crystal();
	}
	else if (money_type.mt_love_coin == mShopCenterInfo.money_type)		// 爱情币
	{
		qqCoin();
	}
	setTotalPrice(mBuyItemCount);
}
//--------------------------------------------------
// 回调,设置购买物品图片
private function setPropIcon(tex : Texture) : void
{
	prop_icon_label.style.normal.background = tex;
}
//--------------------------------------------------
// 水晶
private function crystal() : void
{
	diamond_icon_label.setEnabled(true);
	diamond_num_label.setEnabled(true);
	price_icon_label.setEnabled(false);
	price_num_label.setEnabled(false);
	total_icon_label.setEnabled(false);
	total_num_label.setEnabled(false);
	
	mUnitPrice = mShopCenterInfo.price;
	diamond_icon_label.style.normal.background = Resources.Load("UISkins/Textures/Common1/Qcrystal");
	diamond_num_label.label.text = mUnitPrice.ToString();
}
//--------------------------------------------------
// Q点
private function qqCoin() : void
{
	diamond_icon_label.setEnabled(false);
	diamond_num_label.setEnabled(false);
	price_icon_label.setEnabled(true);
	price_num_label.setEnabled(true);
	total_icon_label.setEnabled(true);
	total_num_label.setEnabled(true);
	
	mUnitPrice = DataCenter.getCostByPlatform(mShopCenterInfo.price);
	price_icon_label.style.normal.background = Resources.Load("UISkins/Textures/Common1/aib");
	price_num_label.label.text = mUnitPrice.ToString();
}
//--------------------------------------------------
// 总价格
private function setTotalPrice(count : int) : void
{
	total_num_label.label.text = (count*mUnitPrice).ToString();
}
//--------------------------------------------------


