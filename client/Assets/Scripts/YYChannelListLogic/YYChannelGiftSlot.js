#pragma strict
#pragma downcast
import iGUI;


class YYChannelGiftSlot
{
	private var mIndex : int = 0;
	private var mIconImage : iGUIImage = null;
	private var mItemIcon : ItemIcon = null;
	private var mSelectFrame : SelectFrame = null;
	private var mGiftRow : YYGiftRow = null;
	private var mGiftPage : YYChannelGiftPage = null;
	//--------------------------------------------------
	public function YYChannelGiftSlot(index : int, icon : iGUIImage, select_frame : SelectFrame, page : YYChannelGiftPage)
	{
		mIndex = index;
		mIconImage = icon;
		mItemIcon = new ItemIcon(icon);
		mSelectFrame = select_frame;
		mGiftPage = page;
		icon.clickCallback = ClickCallback_icon;
		icon.mouseOverCallback = MouseOverCallback_icon;
	}
	//--------------------------------------------------
	public function setContent(row : YYGiftRow) : void
	{
		mGiftRow = row;
		if (null == row)
		{
			mItemIcon.setContent(null);
			setSelect(false);
			return;
		}
		mItemIcon.setContent(ResManager.LgtMgr.getItemRow(row.id));
		if (mGiftPage.isGiftSelected(mIndex))
		{
			setSelect(true);
		}
	}
	//--------------------------------------------------
	private function setSelect(select : boolean) : void
	{
		mSelectFrame.setSelect(mIconImage, -8, -8, select);
	}
	//--------------------------------------------------
	private function ClickCallback_icon(caller : iGUIElement) : void
	{
		if (null == mGiftRow)
			return;
		
		setSelect(true);
		mGiftPage.setSelectGift(mGiftRow.id, mIndex);
	}
	//--------------------------------------------------
	private function MouseOverCallback_icon(caller : iGUIElement) : void
	{
		if (null == mGiftRow)
			return;
		
		var descr : String = ResManager.LgtMgr.getItemDescription(mGiftRow.id);
		if ("" == descr)
			return;
		
		var style : GUIStyle = new GUIStyle();
		style.alignment = TextAnchor.MiddleCenter;
		style.normal.textColor = Color(255/255.0f, 255/255.0f, 255/255.0f);
		style.fontStyle = FontStyle.Bold;
		style.wordWrap = true;
		
		Global.SysTooltip.Begin(caller);
		Global.SysTooltip.Add(GUIContent(descr), style);
		Global.SysTooltip.Show(true);
	}
	//--------------------------------------------------
}


