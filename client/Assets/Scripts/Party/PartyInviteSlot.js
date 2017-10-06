/*--------------------------------------------------
邀请派对(2012/12/7 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast
import iGUI;



class PartyInviteData
{
	public var info : friend_item = null;		// 数据
	public var select : boolean = false;		// 是否被选中
	//--------------------------------------------------
	public function PartyInviteData(fi : friend_item, s : boolean)
	{
		info = fi;
		select = s;
	}
	//--------------------------------------------------
}


class PartyInviteSlot
{
	private var mItemPanel : iGUIPanel = null;
	private var mBgImage : iGUIImage = null;
	private var mLevelLabel : iGUILabel = null;
	private var mNameLabel : iGUILabel = null;
	private var mPhotoImage : iGUILabel = null;
	private var mSelectImage : iGUILabel = null;
	private var mAsynInfo : PartySlotIcon = new PartySlotIcon();
	private var mResLoader : PlatResLoader = null;
	private var mItemData : PartyInviteData = null;
	//--------------------------------------------------
	public function PartyInviteSlot(item_panel : iGUIPanel, bg_image : iGUIImage, level_label : iGUILabel, name_label : iGUILabel, photo_image : iGUILabel, select_image : iGUILabel)
	{
		mItemPanel = item_panel;
		mBgImage = bg_image;
		mLevelLabel = level_label;
		mNameLabel = name_label;
		mPhotoImage = photo_image;
		mSelectImage = select_image;
		bg_image.clickCallback = ClickCallback_bg_image;
		mAsynInfo.ImageElement = photo_image;
		mAsynInfo.NameElement = name_label;
	}
	//--------------------------------------------------
	// 设置内容
	public function setContent(data : PartyInviteData) : void
	{
		mItemData = data;
		// 清空
		if (null == data)
		{
			if (mResLoader)
			{
				Global.GetPlatResLoaderMgr().Remove(mResLoader);
				mResLoader = null;
			}
			mLevelLabel.label.text = "";
			mNameLabel.label.text = "";
			mPhotoImage.style.normal.background = null;
			return;
		}
		// 填充
		mResLoader = Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(data.info.account, mAsynInfo);
		mLevelLabel.label.text = "LV-" + data.info.house_level.ToString();
		setSelected(data.select, true);
	}
	//--------------------------------------------------
	// 设置显示/隐藏
	public function setVisible(visible : boolean) : void
	{
		mItemPanel.setEnabled(visible);
	}
	//--------------------------------------------------
	// 设置选中
	public function setSelected(select : boolean, initiative : boolean) : void
	{
		if (null == mItemData)
			return;
		
		mItemData.select = select;
		mSelectImage.setEnabled(select);
		if (initiative)		// 主动选择,设置到数据列表,更新全选图标
		{
			var gui : iGUICode_PartyInviteUI = iGUICode_PartyInviteUI.getInstance();
			gui.selectFriend(mItemData.info.account, select);
			gui.setAllSelected(gui.isAllSelected(), false);
		}
	}
	//--------------------------------------------------
	// 点击选择图标
	private function ClickCallback_bg_image(caller : iGUIElement)
	{
		if (null == mItemData)
			return;
		
		setSelected(!mItemData.select, true);
	}
	//--------------------------------------------------
}


