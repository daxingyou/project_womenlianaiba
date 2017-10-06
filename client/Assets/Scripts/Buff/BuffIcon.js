#pragma strict
#pragma downcast

import iGUI;

class BuffIcon
{
	private var mAsynIcon : AsynIcon = null;
	private var mIconImage : iGUIImage = null;
	private var mIconButton : iGUIButton = null;
	private var mBuffIconType : BuffIconType = BuffIconType.BUFF_ICON_IMAGE;
	
	enum BuffIconType
	{
		BUFF_ICON_IMAGE,
		BUFF_ICON_BUTTON
	}
	
	public function BuffIcon(iconImage : iGUIImage, iconRes : String)
	{
		mBuffIconType = BuffIconType.BUFF_ICON_IMAGE;
		mIconImage = iconImage;
		var resPath = "Icon/" + iconRes;
		if(mAsynIcon == null)
			mAsynIcon = new AsynIcon(LoadIconFinish, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
		mAsynIcon.load(resPath);
	}
	
	public function BuffIcon(iconButton : iGUIButton, iconRes : String)
	{
		mBuffIconType = BuffIconType.BUFF_ICON_BUTTON;
		mIconButton = iconButton;
		var resPath = "Icon/" + iconRes;
		if(mAsynIcon == null)
			mAsynIcon = new AsynIcon(LoadIconFinish, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
		mAsynIcon.load(resPath);
	}
	
	private function LoadIconFinish(tex : Texture) : void
	{
		switch(mBuffIconType)
		{
		case BuffIconType.BUFF_ICON_IMAGE:
			mIconImage.image = tex;
			break;
		case BuffIconType.BUFF_ICON_BUTTON:
			mIconButton.style.normal.background = tex;
			break;
		}
	}
	
}