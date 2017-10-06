/*--------------------------------------------------
物品图片,其实是对AsynIcon做进一步封装,方便使用(2012/9/7 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast
import iGUI;


class ItemIcon
{
	private var mAsynIcon : AsynIcon = null;		// 异步加载图标
	protected var mIcon : iGUILabel = null;			// 图标控件
	protected var mImage : iGUIImage = null;		// 图像控件(可点击)
	protected var mRow : ItemRow = null;			// 数据
	//--------------------------------------------------
	// 构造函数
	public function ItemIcon(icon : iGUILabel)
	{
		mIcon = icon;
		mAsynIcon = new AsynIcon(setTexture, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	}
	//--------------------------------------------------
	// 构造函数
	public function ItemIcon(image : iGUIImage)
	{
		mImage = image;
		mAsynIcon = new AsynIcon(setTexture, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	}
	//--------------------------------------------------
	// 回调
	private function setTexture(tex : Texture) : void
	{
		if (mIcon)
			mIcon.style.normal.background = tex;
		
		if (mImage)
			mImage.image = tex;
	}
	//--------------------------------------------------
	// 设置内容
	public function setContent(row : ItemRow) : void
	{
		setVisible(row ? true : false);
		mRow = row;
		if (null == row)
		{
			mAsynIcon.cancel();
			setTexture(null);
			return;
		}
		mAsynIcon.load("Icon/" + row.icon);
	}
	//--------------------------------------------------
	// 显示/隐藏
	public function setVisible(visible : boolean) : void
	{
		if (mIcon)
			mIcon.setEnabled(visible);
		
		if (mImage)
			mImage.setEnabled(visible);
	}
	//--------------------------------------------------
	// 获取数据
	public function getRow() : ItemRow
	{
		return mRow;
	}
	//--------------------------------------------------
	// 判断控件是否一致
	public function isBelong(icon : iGUILabel) : boolean
	{
		if (null == mIcon || null == icon)
			return false;
		
		return icon == mIcon;
	}
	//--------------------------------------------------
	// 判断控件是否一致
	public function isBelong(image : iGUIImage) : boolean
	{
		if (null == mImage || null == image)
			return false;
		
		return image == mImage;
	}
	//--------------------------------------------------
}


