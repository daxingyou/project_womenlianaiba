#pragma strict
#pragma downcast
	
private static var UIAnimationList:Array = new Array();
private static var mRoot : iGUIRoot = null;
class UIElement
{
	public var element:iGUIElement;
	public var start:float;
	public var life:int;
}

private static var numberImage : String[] = 
["number_0",
"number_1",
"number_2",
"number_3",
"number_4",
"number_5",
"number_6",
"number_7",
"number_8",
"number_9",
"add",
"sub"];
//--
function Awake(){
	RegisetEvt();
}
//--
function RegisetEvt(){

}
//--
function Update () {
	if (null == mRoot)
		return;
	
	var now = Time.time;
	var index = 0;
	for(var ele:UIElement in UIAnimationList)
	{
		if(now - ele.start >= ele.life)
		{
			mRoot.removeElement(ele.element);
			UIAnimationList.RemoveAt(index);
			break;
		}
		index++;
	}
	if (mRoot.enabled && 0 == UIAnimationList.Count)
	{
		mRoot.enabled = false;
	}
}

public static function createNumberAnimation(from:Rect, to:Rect, image:String, number:int, life:float)
{
	mRoot = UI.getUI().OpenUIRoot("UIAnimationRoot");
	UI.getUI().SetTopDepth("UIAnimationRoot");
	var panel:iGUIPanel = mRoot.addElement("iGUIPanel", Rect(from.x,from.y,0,34));
	panel.padding = RectOffset(0,0,0,0);
	panel.style.border = RectOffset(0,0,0,0);
	panel.style.padding = RectOffset(0,0,0,0);
	panel.style.normal.background = null;
	panel.style.alignment = TextAnchor.MiddleCenter;
	panel.refreshStyle();
	panel.refreshRect();
	
	var width = 0;
	var asynIcon : AsynIcon = null;
	
	if(image != "")
	{
		var img:iGUIImage = panel.addElement("iGUIImage", Rect(width,0,34,33));
		img.image = Resources.Load("UISkins/Textures/Common1/" + image);
		img.ignoreClicks = true;
		img.ignoreMouseOver = true;
		width += 34;
	}
	
	var sign:iGUIImage = panel.addElement("iGUIImage", Rect(width,0,20,20));
	sign.scaleMode = ScaleMode.ScaleToFit;
	sign.ignoreClicks = true;
	sign.ignoreMouseOver = true;
	asynIcon = new AsynIcon(function(tex) { sign.image=tex; }, null);
	if(number > 0)
		sign.image = Resources.Load("UISkins/Textures/Common1/" + numberImage[10]);
	else
		sign.image = Resources.Load("UISkins/Textures/Common1/" + numberImage[11]);
		
	width += 20;
	
	if(number < 0)
		number = -number;
	var sn = number.ToString();
	var n:int;
	var num:iGUIImage;
	for(var i=0; i<sn.Length; i++)
	{
		n = Convert.ToInt32( sn.Substring(i, 1) );
		num = panel.addElement("iGUIImage", Rect(width,0,20,20));
		num.ignoreClicks = true;
		num.ignoreMouseOver = true;
		num.image = Resources.Load("UISkins/Textures/Common1/" + numberImage[n]);
		num.scaleMode = ScaleMode.ScaleToFit;
		width += 20;
	}
	
	panel.setWidth(width);
	
	panel.moveTo(Rect(to.x,to.y,width,34), life);
	
	var ele:UIElement = new UIElement();
	ele.element = panel;
	ele.start = Time.time;
	ele.life = life;
	UIAnimationList.Add(ele);
}

public static function createNumberAnimation(from:Rect, to:Rect, image:String, number:int)
{
	createNumberAnimation(from, to, image, number, 4);
}