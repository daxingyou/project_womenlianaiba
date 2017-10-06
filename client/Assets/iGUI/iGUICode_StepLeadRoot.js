#pragma strict
import iGUI;

var imgPanel_pos:Vector2;
var arrow_pos:Vector2; 
var lbl_posAndSz:Rect;
var img_arrow:Texture;
var labelSytle:GUIStyle;
var panelSytle:GUIStyle;
private var mLabel : iGUILabel; 
private var mImgContainer:iGUIPanel;

private static var instance : iGUICode_StepLeadRoot;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var arrowContainer : iGUIContainer;
@HideInInspector
var arrowFrm : iGUIImage;
@HideInInspector
var stepLeadRoot : iGUIRoot;

//--创建文字说明框
private function _CreateLabel(txt:String,txt_color:Color,pos_sz:Rect):iGUILabel
{
	var lbl:iGUILabel = stepLeadRoot.addElement("iGUILabel") as iGUILabel;
	lbl.setPositionAndSize(pos_sz);
	lbl.style = labelSytle;
	lbl.style.wordWrap = true;
	lbl.style.clipping = TextClipping.Overflow;
	lbl.label.text = txt;
	if(txt_color == null)
		lbl.labelColor = Color.black;
	lbl.labelColor = txt_color;
	return lbl;
}

//--设置标签文本框的位置
//function SetLabelPosition(vector2:Vector2)
//{
//	if(mLabel == null)
//	{
//		Debug.Log("-------------StepLeadRoot mLabel is null---------------");
//		return;
//	}
//	mLabel.setX(vector2.x);
//	mLabel.setY(vector2.y);
//}
//--
//function SetLabelTxt(txt:String)
//{
//	mLabel.label.text = txt;
//}
//--创建说明图片窗口
private function _CreateImgContainer(pos_sz:Rect):iGUIPanel
{
	var p:iGUIPanel = stepLeadRoot.addElement("iGUIPanel") as iGUIPanel;
	p.setType(iGUIPanelType.Box); 
	p.style = panelSytle;
	p.padding = RectOffset(0,0,0,0);
	p.style.alignment = TextAnchor.MiddleCenter;
	p.setPositionAndSize(pos_sz);
	var img_frm:iGUIImage = p.addElement("iGUIImage") as iGUIImage;
	img_frm.setPositionAndSize(Rect(0,0,1,1));
	img_frm.scaleMode = ScaleMode.ScaleToFit;
	img_frm.ignoreClicks = true;
	return p;
}
//--在图片窗口添加图片
private function _fillImgInContainer(img_name : String)
{
	if(mImgContainer == null)
		return;
	
	var img_frm:iGUIImage = mImgContainer.items[0] as iGUIImage;
	_LoadItemImg(img_frm, mImgContainer, img_name);
}
//--
public function FillImgInContainer(img_name : String)
{
	_fillImgInContainer(img_name);
}
//--
function _LoadItemImg(img_frm : iGUIImage, parentPanel : iGUIPanel, img_name : String){
	var _asynIcon : AsynIcon = new AsynIcon(function (tex : Texture){img_frm.image = tex; img_frm.setWidth(tex.width);
											img_frm.setX(-15);
											img_frm.setHeight(tex.height);
											if(!parentPanel){
												return;
											}
											parentPanel.setWidth(tex.width);
											parentPanel.setHeight(tex.height);
											},
											null);
	_asynIcon.load("UI/" + img_name); 	
}
//--
function SetImgContainerPosition(vector2:Vector2)
{
	if(mImgContainer == null)
	{
		Debug.Log("-------------StepLeadRoot mImgContainer is null---------------");
		return;
	}
	mImgContainer.setX(vector2.x);
	mImgContainer.setY(vector2.y);
}
//--
function SetArrowPositionAndSize(x:float,y:float)
{
	arrowContainer.setX(x);
	arrowContainer.setY(y);
} 
//--开始引导
public function StartLead(arrow_pos : Vector2, imgPanel_pos : Vector2, lbl_posAndSz : Rect, arrow_direct : String, img_name : String, depth : int)
{
	UI.getUI().SetTopDepth("StepLeadRoot");
	SetArrowPositionAndSize(arrow_pos.x,arrow_pos.y);
	ShowArrow(true);
	SetArrowPointTo(arrow_direct);
	mLabel = _CreateLabel("",Color.blue,lbl_posAndSz);
	mImgContainer = _CreateImgContainer(Rect(imgPanel_pos.x,imgPanel_pos.y,232,156));
	FillImgInContainer(img_name);
}
//--
function ShowArrow(flag:boolean)
{
	arrowFrm.setEnabled(flag);
}
//--
function SetArrowPointTo(direction:String)
{
	switch(direction)
	{
		case "toleft":
			arrowFrm.setRotation(90);
			break;
		case "toright":
			arrowFrm.setRotation(270);
			break;
		case "totop":
			arrowFrm.setRotation(180);
			break;
		case "tobottom":
			arrowFrm.setRotation(0);
			break;
	}
	//arrowFrm.setRotation(90.0f);
}