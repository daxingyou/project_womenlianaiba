import iGUI;

class WaiterItem
{
	private var mIndex : int = 0;
	private var mData : WaiterRow = null;
	private var mPanel : iGUIPanel = null;
	private var mIconImage : iGUIImage = null;
	private var mPriceText : iGUILabel = null;
	private var mNameText : iGUILabel = null;
	private var mLevelText : iGUILabel = null;
	private var mSpecialityText : iGUILabel = null;
	private var mDescriptionText : iGUILabel = null;
	
	private var mIsSelected : boolean = false;	
	
	private var mAsynIcon : AsynIcon = null;
	
	public function WaiterItem(itemPanel:iGUIPanel, iconImage:iGUIImage, priceText:iGUILabel, nameText:iGUILabel, levelText:iGUILabel, specialityText : iGUILabel, descriptionText : iGUILabel, selected:boolean)
	{
		mIndex = itemPanel.userData;
		mData = iconImage.userData;
		mPanel = itemPanel;
		mIconImage = iconImage;
		mPriceText = priceText;
		mNameText = nameText;
		mLevelText = levelText;
		mSpecialityText = specialityText;
		mDescriptionText = descriptionText;
		
		mIconImage.clickCallback = ClickCallback_icon_image;
		setSelect(selected);
		setImage();
	}
	
	private function ClickCallback_icon_image(caller : iGUIElement) : void
	{
		setSelect(true);
	}
	
	public function setSelect(selected : boolean)
	{
		mIsSelected = selected;
		if(mIsSelected)
		{
			mPanel.style.normal.background = Resources.Load("UISkins/Textures/IQlevel/kuankuan");
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_WAITER_FACE),mIndex);
		}
		else
		{
			mPanel.style.normal.background = Resources.Load("UISkins/Textures/collect/beijing_2");
		}
	}
	
	public function getData()
	{
		return mData;
	}
	
	private function setImage()
	{
		if(mAsynIcon == null)
			mAsynIcon = new AsynIcon(setFaceIcon, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
		mAsynIcon.load("Icon/" + mData.picture);
	}
	
	private function setFaceIcon(tex : Texture)
	{
		mIconImage.image = tex;
	}
}
