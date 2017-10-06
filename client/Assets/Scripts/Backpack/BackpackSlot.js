/*--------------------------------------------------
背包物品格子(2012/7/2 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast
import iGUI;



class BackpackClass
{
	public var pg : PackGrid = null;
	public var root : iGUIRoot = null;
	public var panel : iGUIPanel = null;
	//--------------------------------------------------
	public function BackpackClass(pg : PackGrid, root : iGUIRoot, panel : iGUIPanel)
	{
		this.pg = pg;
		this.root = root;
		this.panel = panel;
	}
	//--------------------------------------------------
}



class BackpackSlot
{
	private var mRoot : iGUIRoot = null;
	private var mItemPanel : iGUIPanel = null;
	private var mIconImage : iGUIImage = null;
	private var mCountLabel : iGUILabel = null;
	private var mSelectLabel : iGUILabel = null;
	private var mAsynIcon : AsynIcon = null;
	private var mPackGrid : PackGrid = null;
	//--------------------------------------------------
	public function BackpackSlot(root : iGUIRoot, itemPanel : iGUIPanel, iconImage : iGUIImage, countLabel : iGUILabel, selectLabel : iGUILabel)
	{
		mRoot = root;
		mItemPanel = itemPanel;
		mIconImage = iconImage;
		mCountLabel = countLabel;
		mSelectLabel = selectLabel;
		mAsynIcon = new AsynIcon(setIcon, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
		// 事件注册
		iconImage.clickCallback = ClickCallback_icon_image;
		iconImage.mouseOverCallback = MouseOverCallback_icon_image;
	}
	//--------------------------------------------------
	// 回调
	private function setIcon(tex : Texture) : void
	{
		mIconImage.image = tex;
	}
	//--------------------------------------------------
	// 设置内容
	public function setContent(pg : PackGrid) : void
	{
		setVisible(null == pg ? false : true);
		// 清空
		if (null == pg)
		{
			mAsynIcon.cancel();
			mIconImage.image = null;
			mCountLabel.label.text = "";
			mPackGrid = null;
			setSelect(false);
			return;
		}
		// 填充
		mAsynIcon.load("Icon/" + pg._item._itemInfo.icon);
		mCountLabel.label.text = pg._count.ToString();
		mPackGrid = pg;
	}
	//--------------------------------------------------
	// 显示/隐藏
	private function setVisible(visible : boolean) : void
	{
		mIconImage.setEnabled(visible);
		mCountLabel.setEnabled(visible);
	}
	//--------------------------------------------------
	// 设置选中
	private function setSelect(select : boolean) : void
	{
		if (select)
		{
			mSelectLabel.setX(mItemPanel.positionAndSize.x - 7.0f);
			mSelectLabel.setY(mItemPanel.positionAndSize.y - 7.0f);
		}
		mSelectLabel.setEnabled(select);
	}
	//--------------------------------------------------
	// 鼠标点击物品图片
	private function ClickCallback_icon_image(caller : iGUIElement) : void
	{
		if (null == mPackGrid)
			return;
		
		setSelect(true);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.BACKPACK_CLICKED), new BackpackClass(mPackGrid, mRoot, mItemPanel));
	}
	//--------------------------------------------------
	// 鼠标移到物品图片上
	private function MouseOverCallback_icon_image(caller : iGUIElement) : void
	{
		if (null == mPackGrid)
			return;
		
		ItemHint.ShowPackItemHint(mIconImage, mPackGrid, true);
	}
	//--------------------------------------------------
}


