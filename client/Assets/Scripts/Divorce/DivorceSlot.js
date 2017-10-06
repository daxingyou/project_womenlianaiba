/*--------------------------------------------------
离婚物品格子(2012/7/2 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast
import iGUI;



class DivorceSlot
{
	private var mItemPanel : iGUIPanel = null;
	private var mIconImage : iGUIImage = null;
	private var mCountLabel : iGUILabel = null;
	private var mAsynIcon : AsynIcon = null;
	private var mPackGrid : PackGrid = null;
	//--------------------------------------------------
	function DivorceSlot(item_panel : iGUIPanel, icon_image : iGUIImage, count_label : iGUILabel)
	{
		mItemPanel = item_panel;
		mIconImage = icon_image;
		mCountLabel = count_label;
		mAsynIcon = new AsynIcon(setIcon, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
		// 事件注册
		icon_image.clickCallback = System.Delegate.Combine(icon_image.clickCallback, ClickCallback_icon_image as iGUIEventCallback);
		icon_image.mouseOverCallback = System.Delegate.Combine(icon_image.mouseOverCallback, MouseOverCallback_icon_image as iGUIEventCallback);
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
		// 清空
		if (null == pg)
		{
			Global.SysTooltip.Hide(mIconImage);
			mAsynIcon.cancel();
			mIconImage.image = null;
			mCountLabel.label.text = "";
			mPackGrid = null;
			return;
		}
		// 填充
		mAsynIcon.load("Icon/" + pg._item._itemInfo.icon);
		mCountLabel.label.text = pg._count.ToString();
		mPackGrid = pg;
	}
	//--------------------------------------------------
	// 显示/隐藏
	public function setVisible(visible : boolean) : void
	{
		mIconImage.setEnabled(visible);
		mCountLabel.setEnabled(visible);
	}
	//--------------------------------------------------
	// 鼠标点击物品图片
	private function ClickCallback_icon_image(caller : iGUIElement) : void
	{
		if (null == mPackGrid)
			return;
		
		Divorce.publishEvent("event_click_divorce_slot", mPackGrid);
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


