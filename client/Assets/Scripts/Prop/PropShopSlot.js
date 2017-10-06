/*--------------------------------------------------
道具选项(2012/8/9 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast
import iGUI;



class PropShopSlot
{
	private var mItemPanel : iGUIPanel = null;			// 选项控件
	private var mNameLabel : iGUILabel = null;			// 名字控件
	private var mIconLabel : iGUILabel = null;			// 图片控件
	private var mCostIconLabel : iGUILabel = null;		// 价格图片控件
	private var mCostTextLabel : iGUILabel = null;		// 价格控件
	private var mSpecIconLabel : iGUILabel = null;		// 黄砖图片控件
	private var mSpecTextLabel : iGUILabel = null;		// 黄砖价格控件
	private var mWishBtn : iGUIButton = null;			// 许愿按钮
	private var mBuyBtn : iGUIButton = null;			// 购买按钮
	private var mAsynIcon : AsynIcon = null;			// 图片异步加载器
	private var mTipText : String = "";					// 提示文本
	public var ShopCenterInfo : ShopCenterRow = null;
	public var ItemInfo : ItemRow = null;
	//--------------------------------------------------
	// 构造
	public function PropShopSlot(item : iGUIPanel, name : iGUILabel, icon : iGUILabel, cost_icon : iGUILabel, cost : iGUILabel, spec_icon : iGUILabel, spec : iGUILabel, wish : iGUIButton, buy : iGUIButton)
	{
		mItemPanel = item;
		mNameLabel = name;
		mIconLabel = icon;
		mCostIconLabel = cost_icon;
		mCostTextLabel = cost;
		mSpecIconLabel = spec_icon;
		mSpecTextLabel = spec;
		mWishBtn = wish;
		mBuyBtn = buy;
		mAsynIcon = new AsynIcon(setIcon, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
		icon.mouseOverCallback = System.Delegate.Combine(icon.mouseOverCallback, MouseOverCallback_icon as iGUIEventCallback);
		wish.clickCallback = System.Delegate.Combine(wish.clickCallback, ClickCallback_wish as iGUIEventCallback);
		buy.clickCallback = System.Delegate.Combine(buy.clickCallback, ClickCallback_buy as iGUIEventCallback);
	}
	//--------------------------------------------------
	// 回调
	function setIcon(tex : Texture) : void
	{
		mIconLabel.style.normal.background = tex;
	}
	//--------------------------------------------------
	// 设置选项
	public function setContent(info : ShopCenterRow) : void
	{
		if (null == info)
		{
			ShopCenterInfo = null;
			ItemInfo = null;
			mNameLabel.label.text = "";
			mIconLabel.style.normal.background = null;
			mCostTextLabel.label.text = "";
			mSpecTextLabel.label.text = "";
			mAsynIcon.cancel();
			return;
		}
		ShopCenterInfo = info;
		ItemInfo = ResManager.LgtMgr.getItemRow(info.item_id);
		mNameLabel.label.text = ItemInfo.name;
		mAsynIcon.load("Icon/" + ItemInfo.icon);
		mTipText = ItemInfo.name;//info.intro;
		if (money_type.mt_diamond == info.money_type)		// 水晶
		{
			crystal();
		}
		else if (money_type.mt_love_coin == info.money_type)	// 爱情币
		{
			qqCoin();
		}
	}
	//--------------------------------------------------
	// 水晶
	private function crystal() : void
	{
		mCostIconLabel.setEnabled(false);
		mCostTextLabel.setEnabled(false);
		//
		mSpecIconLabel.setEnabled(true);
		mSpecIconLabel.style.normal.background = Resources.Load("UISkins/Textures/Common1/Qcrystal");
		mSpecTextLabel.setEnabled(true);
		mSpecTextLabel.label.text = ShopCenterInfo.price.ToString();
	}
	//--------------------------------------------------
	// Q点
	private function qqCoin() : void
	{
		mSpecIconLabel.setEnabled(false);
		mSpecTextLabel.setEnabled(false);
		//
		mCostIconLabel.setEnabled(true);
		mCostIconLabel.style.normal.background = Resources.Load("UISkins/Textures/Common1/aib");
		mCostTextLabel.setEnabled(true);
		mCostTextLabel.label.text = ShopCenterInfo.price.ToString();
	}
	//--------------------------------------------------
	// 显示/隐藏
	public function setVisible(visible : boolean) : void
	{
		mItemPanel.setEnabled(visible);
	}
	//--------------------------------------------------
	// 鼠标移到物品图片上
	private function MouseOverCallback_icon(caller : iGUIElement) : void
	{
		if (null == ShopCenterInfo)
			return;
		
		ItemHint.ShowPackItemHint(mIconLabel, ShopCenterInfo);
	}
	//--------------------------------------------------
	// 鼠标点击许愿按钮
	private function ClickCallback_wish(caller : iGUIElement) : void
	{
		if (null == ShopCenterInfo)
			return;
		
		WishListComp.ReqAddWish(ShopCenterInfo.goods_id, 1);
	}
	//--------------------------------------------------
	// 鼠标点击购买按钮
	private function ClickCallback_buy(caller : iGUIElement) : void
	{
		if (null == ItemInfo)
			return;
		
		iGUICode_PropShopUI.getInstance().openBuyUI(this);
	}
	//--------------------------------------------------
}


