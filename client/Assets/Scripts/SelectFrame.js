/*--------------------------------------------------
选中框(2012/12/5 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast
import iGUI;



class SelectFrame
{
	private var mFrame : iGUILabel;						// 选中框
	private var mSelectElement : iGUIElement;			// 选中项
	//--------------------------------------------------
	public function SelectFrame(root : iGUIRoot, width : float, height : float, layer : int, icon : String)
	{
		mFrame = root.addElement("iGUILabel") as iGUILabel;
		mFrame.setWidth(width);
		mFrame.setHeight(height);
		mFrame.style.normal.background = Resources.Load(icon);
		mFrame.setLayer(layer);
		mFrame.setEnabled(false);
	}
	//--------------------------------------------------
	// 显示选中框
	private function show(element : iGUIElement, xOffset : float, yOffset : float) : void
	{
		if (null == element)
			return;
		
		mFrame.setX(element.rect.x + xOffset);
		mFrame.setY(element.rect.y + yOffset);
		mFrame.setEnabled(true);
		mSelectElement = element;
	}
	//--------------------------------------------------
	// 隐藏选中框
	private function hide() : void
	{
		mFrame.setEnabled(false);
	}
	//--------------------------------------------------
	// 显示/隐藏选中框
	public function setSelect(element : iGUIElement, xOffset : float, yOffset : float, select : boolean) : void
	{
		if (select)
		{
			show(element, xOffset, yOffset);
		}
		else if (isSelected(element))
		{
			hide();
		}
	}
	//--------------------------------------------------
	// 是否已被选中
	public function isSelected(element : iGUIElement) : boolean
	{
		return element == mSelectElement;
	}
	//--------------------------------------------------
}


