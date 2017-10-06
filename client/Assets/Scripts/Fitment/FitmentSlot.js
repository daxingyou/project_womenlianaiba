/*--------------------------------------------------
*** 家装格子(2012/12/4 created by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast



/*--------------------------------------------------
*** 家装里背包的格子(只适用于背包)
--------------------------------------------------*/
class FitmentPackGrid
{
	public var packGrid : PackGrid;			// 格子
	public var using : boolean = false;		// 是否被使用
	public var select : boolean = false;	// 是否被选中
	public var multi_selected : boolean = false;	//是否在多选时被选中
	//--------------------------------------------------
	// 构造函数
	public function FitmentPackGrid(pg : PackGrid)
	{
		packGrid = pg;
	}
	//--------------------------------------------------
}





/*--------------------------------------------------
*** 家装物品列表里的物品选项(适用于商城)
--------------------------------------------------*/
class FitmentSlot
{
	private var SLOT_NUM : int = 11;			// 每页的物品数
	private var mIndex : int = 0;				// 物品在每页的索引,从0开始
	private var mImage : iGUIImage = null;		// icon
	private var mCostIcon : iGUILabel = null;	// 价格类型图片(水晶,金币)
	private var mCostText : iGUILabel = null;	// 价格
	private var mCoverImage : iGUIImage = null;	// 选项被覆盖的图片
	private var mAsynIcon : AsynIcon = null;	// 异步家装icon的管理器
	private var mIsSelect : boolean = false;	// 是否被选中
	private var mFitmentType : int = -1;
	//--------------------------------------------------
	// 构造函数(物品在每页的索引)
	public function FitmentSlot(n : int)
	{
		if (n < 0 || n >= SLOT_NUM)
			throw "FitmentSlot -> n["+n+"] is out of range [0, "+SLOT_NUM+").";
		
		mIndex = n;
		var elements : iGUIElement[] = iGUICode_StorageBoxUI.getInstance().getFitmentSlotControls(n);
		mImage = elements[0];
		mCostIcon = elements[1];
		mCostText = elements[2];
		mCoverImage = elements[3];
		mAsynIcon = new AsynIcon(setIcon, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
		mCoverImage.mouseOverCallback = MouseOverCallback_cover;
	}
	//--------------------------------------------------
	// 设置选项内容(icon名,价格类型,价格),基本上内部调用
	private function setContent(imageName : String, costType : int, costValue : int) : void
	{
		// 设置icon
		if (null == imageName || "" == imageName)
		{
			mAsynIcon.cancel();
			mImage.image = null;
		}
		else
		{
			mAsynIcon.load("Icon/" + imageName);
		}
		// 设置价格类型图片
		if (1 == costType)			// 水晶
		{
			mCostIcon.style.normal.background = Resources.Load("UISkins/Textures/Common1/plant_sj");
		}
		else if (2 == costType)		// 恋爱币
		{
			mCostIcon.style.normal.background = Resources.Load("UISkins/Textures/Common1/plant_aib");
		}
		else
		{
			mCostIcon.style.normal.background = null;
		}
		// 设置价格
		mCostText.label.text = (0 == costValue) ? "" : costValue.ToString();
	}
	//--------------------------------------------------
	// 清除选项内容
	private function clearContent() : void
	{
		setContent(null, 0, 0);
		setSelect(false);
		updateLockedFlag(false);
		mFitmentType = -1;
	}
	//--------------------------------------------------
	// 异步加载icon的回调函数,内部调用
	private function setIcon(tex : Texture) : void
	{
		mImage.image = tex;
	}
	//--------------------------------------------------
	// 设置选项是否被选中
	public function setSelect(b : boolean) : void
	{
		mIsSelect = b;
		iGUICode_StorageBoxUI.getInstance().getSelectFrame().setSelect(mCoverImage, -3, -5, b);
	}
	//--------------------------------------------------
	// 是否被选中
	public function isSelected() : boolean
	{
		return mIsSelect;
	}
	//--------------------------------------------------
	// 鼠标是否在上面
	public function isMouseOver() : boolean
	{
		return null != mImage.image && mCoverImage.isMouseOver;
	}
	//--------------------------------------------------
	// 是否为当前格子
	public function isSlot(caller : iGUIImage) : boolean
	{
		return caller == mCoverImage;
	}
	//--------------------------------------------------
	// 更新选项里的内容,外部调用
	public function updateToUI(type : int) : void
	{
		mFitmentType = type;
		var logic : FitmentLogic = FitmentLogic.getInstance();	
		var index : int = 0;
		
		switch (type)
		{
		case -1:		// none
			clearContent();
			break;
		case 0:			// 商城背包
			index = logic.pageFitmentPack.getBeginIndex() + mIndex;
			if (index < logic.fitmentPackGrids.Count)
			{
				var fpg : FitmentPackGrid = logic.fitmentPackGrids[index];
				setContent(fpg.packGrid._item._itemInfo.icon, 0, 0);
				setSelect(fpg.select);
				updateLockedFlag(false);
			}
			else
			{
				clearContent();
			}
			break;
		case 1:			// 商城分类
			index = logic.pageClass.getBeginIndex() + mIndex;
			var sccr : ShopCenterClassRow = null;
			if (index < logic.shopClasses.Count)
			{
				sccr = logic.shopClasses[index];
				setContent(sccr.icon, 0, 0);
				setSelect(false);
				updateLockedFlag(FurnitureUnlockLogic.getInstance().isUnlock(sccr));
			}
			else
			{
				clearContent();
			}
			break;
		case 2:			// 商城物品
			if (SLOT_NUM - 1 == mIndex)		// 返回按钮
			{
				setContent("icon_return_01.png.u3d", 0, 0);
				updateLockedFlag(false);
				return;
			}
			index = logic.pageShopItem.getBeginIndex() + mIndex;
			if (index < logic.shopItems.Count)
			{
				var scr : ShopCenterRow = logic.shopItems[index];
				var ir : ItemRow = ResManager.LgtMgr.getItemRow(scr.item_id);
				setContent(ir.icon, scr.money_type, scr.price);
				setSelect(index == logic.getCurItemIndex());
				updateLockedFlag(scr.limit_level > DataCenter.getMainPlayerCurLv());
			}
			else
			{
				clearContent();
			}
			break;
		}
	}
	//--------------------------------------------------
	private function updateLockedFlag(locked : boolean) : void
	{
		if (locked)
		{
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_FURNI_INVALID), mIndex);
		}
		else
		{
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_FURNI_VALID), mIndex);
		}
	}
	//--------------------------------------------------
	private function MouseOverCallback_cover(caller : iGUIElement) : void
	{
		var logic : FitmentLogic = FitmentLogic.getInstance();	
		var index : int = 0;
		
		switch (mFitmentType)
		{
		case 0:			// 商城背包
			index = logic.pageFitmentPack.getBeginIndex() + mIndex;
			if (index < logic.fitmentPackGrids.Count)
			{
				var fpg : FitmentPackGrid = logic.fitmentPackGrids[index];
				ItemHint.ShowPackItemHint(mCoverImage, fpg.packGrid, false);
			}
			break;
		case 1:			// 商城分类
			index = logic.pageClass.getBeginIndex() + mIndex;
			if (index < logic.shopClasses.Count)
			{
				var sccr : ShopCenterClassRow = logic.shopClasses[index];
				if ("" != sccr.description)
				{
					var style : GUIStyle = new GUIStyle();
					style.alignment = TextAnchor.MiddleCenter;
					style.normal.textColor = Color(1.0f, 1.0f, 1.0f);
					style.fontStyle = FontStyle.Bold;
					Global.SysTooltip.Begin(mCoverImage);
					Global.SysTooltip.Add(GUIContent(sccr.description), style); 	
					Global.SysTooltip.Show(true);
				}
			}
			break;
		case 2:			// 商城物品
			if (SLOT_NUM - 1 == mIndex)		// 返回按钮
				return;
			
			index = logic.pageShopItem.getBeginIndex() + mIndex;
			if (index < logic.shopItems.Count)
			{
				ItemHint.ShowPackItemHint(mCoverImage, logic.shopItems[index]);
			}
			break;
		}
	}
	//--------------------------------------------------
}


