/*--------------------------------------------------
派对道具选择(2013/1/7 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast
import iGUI;


class PartyPropSelectSlot
{
	private var mPropPanel : iGUIPanel = null;
	private var mPropIcon : iGUILabel = null;
	private var mBgImage : iGUIImage = null;
	private var mSelectIcon : iGUILabel = null;
	private var mAsynIcon : AsynIcon = null;			// 图片异步加载器
	public var ItemInfo : ItemRow = null;
	public var IsSelected : boolean = false;
	//--------------------------------------------------
	public function PartyPropSelectSlot(panel : iGUIPanel, icon : iGUILabel, bg : iGUIImage, select : iGUILabel)
	{
		mPropPanel = panel;
		mPropIcon = icon;
		mBgImage = bg;
		mSelectIcon = select;
		mAsynIcon = new AsynIcon(setIcon, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
		icon.mouseOverCallback = MouseOverCallback_icon;
		bg.clickCallback = ClickCallback_bg;
		setSelect(IsSelected);
	}
	//--------------------------------------------------
	private function setIcon(tex : Texture) : void
	{
		mPropIcon.style.normal.background = tex;
	}
	//--------------------------------------------------
	public function setContent(id : int) : void
	{
		setSelect(false);
		if (0 == id)
		{
			ItemInfo = null;
			mPropIcon.style.normal.background = null;
			mAsynIcon.cancel();
			return;
		}
		ItemInfo = ResManager.LgtMgr.getItemRow(id);
		mAsynIcon.load("Icon/" + ItemInfo.icon);
	}
	//--------------------------------------------------
	public function isExistInPackage() : boolean
	{
		if (null == ItemInfo)
			return false;
		
		return SelfItemLogic.getInstance().existItemPackEx(ItemInfo.id);
	}
	//--------------------------------------------------
	private function setSelect(select : boolean) : void
	{
		IsSelected = select;
		mSelectIcon.setEnabled(select);
	}
	//--------------------------------------------------
	private function MouseOverCallback_icon(caller : iGUIElement) : void
	{
		if (null == ItemInfo)
			return;
		
		ItemHint.ShowPackItemHint(mPropIcon, ItemInfo, false);
	}
	//--------------------------------------------------
	private function ClickCallback_bg(caller : iGUIElement) : void
	{
		setSelect(!IsSelected);
	}
	//--------------------------------------------------
}


