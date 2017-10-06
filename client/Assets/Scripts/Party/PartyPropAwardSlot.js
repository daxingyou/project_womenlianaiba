/*--------------------------------------------------
派对道具奖励(2013/1/7 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast
import iGUI;


class PartyPropAwardSlot
{
	private var mPropIcon : iGUILabel = null;
	private var mPropImage : iGUIImage = null;
	private var mPropNum : iGUILabel = null;
	private var mAsynIcon : AsynIcon = null;
	private var mPackGrid : PackGrid = null;
	//--------------------------------------------------
	public function PartyPropAwardSlot(icon : iGUILabel, image : iGUIImage, num : iGUILabel)
	{
		mPropIcon = icon;
		mPropImage = image;
		mPropNum = num;
		mAsynIcon = new AsynIcon(setIcon, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
		if (icon)
		{
			icon.mouseOverCallback = MouseOverCallback_prop;
		}
		if (image)
		{
			image.mouseOverCallback = MouseOverCallback_prop;
			image.clickCallback = ClickCallback_image;
		}
	}
	//--------------------------------------------------
	private function setIcon(tex : Texture) : void
	{
		if (mPropIcon)
			mPropIcon.style.normal.background = tex;
		
		if (mPropImage)
			mPropImage.image = tex;
	}
	//--------------------------------------------------
	public function setContent(pg : pack_grid) : void
	{
		if (null == pg)
		{
			setVisible(false);
			mPackGrid = null;
			setIcon(null);
			mPropNum.label.text = "";
			mAsynIcon.cancel();
			return;
		}
		mPackGrid = new PackGrid(pg);
		mAsynIcon.load("Icon/" + mPackGrid._item._itemInfo.icon);
		mPropNum.label.text = pg.count.ToString();
		setVisible(true);
	}
	//--------------------------------------------------
	public function update(pg : pack_grid) : void
	{
		if (null == pg)
			return;
		
		if (null == mPackGrid)
		{
			setContent(pg);
			return;
		}
		else if (pg.item_data.instance_id != mPackGrid._item._instanceID)
		{
			return;
		}
		
		mPackGrid._count = pg.count;
		mPropNum.label.text = pg.count.ToString();
	}
	//--------------------------------------------------
	public function getPackGrid() : PackGrid
	{
		return mPackGrid;
	}
	//--------------------------------------------------
	private function setVisible(visible : boolean) : void
	{
		if (mPropIcon)
			mPropIcon.setEnabled(visible);
		
		if (mPropImage)
			mPropImage.setEnabled(visible);
		
		mPropNum.setEnabled(visible);
	}
	//--------------------------------------------------
	private function MouseOverCallback_prop(caller : iGUIElement) : void
	{
		if (null == mPackGrid)
			return;
		
		ItemHint.ShowPackItemHint(caller, mPackGrid, false);
	}
	//--------------------------------------------------
	private function ClickCallback_image(caller : iGUIElement) : void
	{
		if (null == mPackGrid || 0 == mPackGrid._count)
			return;
		
		PropUseLogic.Ctrl.Excute("click_prop_item", mPackGrid);
	}
	//--------------------------------------------------
}


