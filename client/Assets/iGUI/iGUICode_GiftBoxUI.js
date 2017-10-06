#pragma strict
#pragma downcast
import iGUI;

private static var instance : iGUICode_GiftBoxUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var cancel_btn : iGUIButton;
@HideInInspector
var ok_btn : iGUIButton;
@HideInInspector
var gift_box_describe : iGUILabel;
@HideInInspector
var gift_box_preview : iGUILabel;
@HideInInspector
var gift_box_name : iGUILabel;
@HideInInspector
var right_one_btn : iGUIButton;
@HideInInspector
var left_one_btn : iGUIButton;
@HideInInspector
var gift_box5 : iGUIImage;
@HideInInspector
var gift_box4 : iGUIImage;
@HideInInspector
var gift_box3 : iGUIImage;
@HideInInspector
var gift_box2 : iGUIImage;
@HideInInspector
var gift_box1 : iGUIImage;
@HideInInspector
var charge_tag : iGUIButton;
@HideInInspector
var free_tag : iGUIButton;
@HideInInspector
var background : iGUILabel;
@HideInInspector
var close_btn : iGUIButton;
@HideInInspector
var title : iGUILabel;
@HideInInspector
var frame : iGUIPanel;
@HideInInspector
var root : iGUIRoot;


//--------------------------------------------------
function Start()
{
	// 界面事件注册
	close_btn.clickCallback = System.Delegate.Combine(close_btn.clickCallback, ClickCallback_close_btn as iGUIEventCallback);
	free_tag.clickCallback = System.Delegate.Combine(free_tag.clickCallback, ClickCallback_free_tag as iGUIEventCallback);
	charge_tag.clickCallback = System.Delegate.Combine(charge_tag.clickCallback, ClickCallback_charge_tag as iGUIEventCallback);
	gift_box1.clickCallback = System.Delegate.Combine(gift_box1.clickCallback, ClickCallback_gift_box as iGUIEventCallback);
	gift_box2.clickCallback = System.Delegate.Combine(gift_box2.clickCallback, ClickCallback_gift_box as iGUIEventCallback);
	gift_box3.clickCallback = System.Delegate.Combine(gift_box3.clickCallback, ClickCallback_gift_box as iGUIEventCallback);
	gift_box4.clickCallback = System.Delegate.Combine(gift_box4.clickCallback, ClickCallback_gift_box as iGUIEventCallback);
	gift_box5.clickCallback = System.Delegate.Combine(gift_box5.clickCallback, ClickCallback_gift_box as iGUIEventCallback);
	gift_box1.mouseOverCallback = System.Delegate.Combine(gift_box1.mouseOverCallback, MouseOverCallback_gift_box as iGUIEventCallback);
	gift_box2.mouseOverCallback = System.Delegate.Combine(gift_box2.mouseOverCallback, MouseOverCallback_gift_box as iGUIEventCallback);
	gift_box3.mouseOverCallback = System.Delegate.Combine(gift_box3.mouseOverCallback, MouseOverCallback_gift_box as iGUIEventCallback);
	gift_box4.mouseOverCallback = System.Delegate.Combine(gift_box4.mouseOverCallback, MouseOverCallback_gift_box as iGUIEventCallback);
	gift_box5.mouseOverCallback = System.Delegate.Combine(gift_box5.mouseOverCallback, MouseOverCallback_gift_box as iGUIEventCallback);
	left_one_btn.clickCallback = System.Delegate.Combine(left_one_btn.clickCallback, ClickCallback_left_one_btn as iGUIEventCallback);
	right_one_btn.clickCallback = System.Delegate.Combine(right_one_btn.clickCallback, ClickCallback_right_one_btn as iGUIEventCallback);
	ok_btn.clickCallback = System.Delegate.Combine(ok_btn.clickCallback, ClickCallback_ok_btn as iGUIEventCallback);
	cancel_btn.clickCallback = System.Delegate.Combine(cancel_btn.clickCallback, ClickCallback_cancel_btn as iGUIEventCallback);
	// 初始操作
	_init();
}
function OnDestroy()
{
	_clear();
}



/***************************************************
*** 界面事件回调
***************************************************/
function ClickCallback_close_btn(caller : iGUIElement)
{
	Ctrl.Excute("set_gift_box_item_default_icon", null);
	Ctrl.Excute("close_gift_box_ui", null);
}
function ClickCallback_free_tag(caller : iGUIElement)
{
	if (true == caller.userData)
		return;
	
	changeToFreeTag();
}
function ClickCallback_charge_tag(caller : iGUIElement)
{
	if (true == caller.userData)
		return;
	
	changeToChargeTag();
}
function ClickCallback_gift_box(caller : iGUIElement)
{
	var index : int = 4;
	if (gift_box1 == caller) index = 0;
	if (gift_box2 == caller) index = 1;
	if (gift_box3 == caller) index = 2;
	if (gift_box4 == caller) index = 3;
	
	if (mCurGiftBoxTag.select(index))
	{
		setPreviewGiftBox();
	}
}
function MouseOverCallback_gift_box(caller : iGUIElement)
{
	for (var slot : GiftBoxSlot in mSlotArray)
	{
		if (slot.getImage() == caller)
		{
			slot.showTooltip();
		}
	}
}
function ClickCallback_left_one_btn(caller : iGUIElement)
{
	if (false == mCurGiftBoxTag.canMoveLeft())
		return;
	
	mCurGiftBoxTag.moveLeft();
	refreshGiftSlot();
}
function ClickCallback_right_one_btn(caller : iGUIElement)
{
	if (false == mCurGiftBoxTag.canMoveRight())
		return;
	
	mCurGiftBoxTag.moveRight();
	refreshGiftSlot();
}
function ClickCallback_ok_btn(caller : iGUIElement)
{
	Ctrl.Excute("select_gift_box", mCurGiftBoxTag.CurSelectBox);
	Ctrl.Excute("close_gift_box_ui", null);
}
function ClickCallback_cancel_btn(caller : iGUIElement)
{
	Ctrl.Excute("set_gift_box_item_default_icon", null);
	Ctrl.Excute("close_gift_box_ui", null);
}



/***************************************************
*** 界面逻辑
***************************************************/
private var Ctrl : Controller = GiftLogic.Ctrl;
private var SLOT_NUM : int = 5;
private var mSlotArray : Array = new Array();
private var mCurGiftBoxTag : GiftBoxTag = null;
private var mFreeGiftBoxTag : GiftBoxTag = new GiftBoxTag(GiftLogic.FreeGiftBoxPage);
private var mChargeGiftBoxTag : GiftBoxTag = new GiftBoxTag(GiftLogic.ChargeGiftBoxPage);
private var mPreviewBoxAsynIcon : AsynIcon = null;

//--------------------------------------------------
// 初始
private function _init() : void
{
	for (var i:int=0; i<SLOT_NUM; ++i)
	{
		mSlotArray.Add(new GiftBoxSlot(getGiftBox(i)));
	}
	changeToChargeTag();
}
//--------------------------------------------------
// 清除
private function _clear() : void
{
	clearPreviewGiftBox();
	clearGiftSlot();
	mSlotArray.Clear();
	mPreviewBoxAsynIcon = null;
}
//--------------------------------------------------
// 转换到免费标签
function changeToFreeTag()
{
	activeTag(free_tag, true);
	activeTag(charge_tag, false);
	mCurGiftBoxTag = mFreeGiftBoxTag;
	refreshGiftSlot();
	setPreviewGiftBox();
}
//--------------------------------------------------
// 转换到收费标签
function changeToChargeTag()
{
	activeTag(charge_tag, true);
	activeTag(free_tag, false);
	mCurGiftBoxTag = mChargeGiftBoxTag;
	refreshGiftSlot();
	setPreviewGiftBox();
}
//--------------------------------------------------
// 激活标签
function activeTag(tag : iGUIButton, active : boolean) : void
{
	tag.userData = active;
	var state_image = getTagIcon(tag);
	var normal : String = "UISkins/Textures/gift/" + state_image[0];
	var hover : String = "UISkins/Textures/gift/" + state_image[1];
	var push : String = "UISkins/Textures/gift/" + state_image[2];
	if (active)
	{
		tag.style.normal.background = Resources.Load(push);
		tag.style.hover.background = Resources.Load(push);
		tag.style.active.background = Resources.Load(push);
	}
	else
	{
		tag.style.normal.background = Resources.Load(normal);
		tag.style.hover.background = Resources.Load(hover);
		tag.style.active.background = Resources.Load(push);
	}
}
//--------------------------------------------------
// 获取标签图标
private function getTagIcon(tag : iGUIButton) : String[]
{
	if (free_tag == tag) return ["jingxuanlihe_n", "jingxuanlihe_h", "jingxuanlihe_p"];
	// charge_tag == tag
	return ["haohualihe_n", "haohualihe_h", "haohualihe_p"];
}
//--------------------------------------------------
// 获取礼盒控件
function getGiftBox(index : int) : iGUIImage
{
	if (0 == index) return gift_box1;
	if (1 == index) return gift_box2;
	if (2 == index) return gift_box3;
	if (3 == index) return gift_box4;
	
	return gift_box5;
}
//--------------------------------------------------
// 清除礼盒
function clearGiftSlot()
{
	for (var slot : GiftBoxSlot in mSlotArray)
	{
		slot.setContent(null);
	}
}
//--------------------------------------------------
// 刷新礼盒
function refreshGiftSlot()
{
	clearGiftSlot();
	for (var i:int=0; i<mCurGiftBoxTag.CurPage.Count; ++i)
	{
		(mSlotArray[i] as GiftBoxSlot).setContent(mCurGiftBoxTag.CurPage[i]);
	}
}
//--------------------------------------------------
// 清除预览礼盒
function clearPreviewGiftBox()
{
	if (mPreviewBoxAsynIcon)
	{
		mPreviewBoxAsynIcon.cancel();
	}
	gift_box_preview.style.normal.background = null;
	gift_box_name.label.text = "";
	gift_box_describe.label.text = "";
}
//--------------------------------------------------
// 设置预览礼盒
function setPreviewGiftBox()
{
	clearPreviewGiftBox();
	var row : GiftBoxRow = mCurGiftBoxTag.CurSelectBox;
	if (null == row)
		return;
	
	if (null == mPreviewBoxAsynIcon)
	{
		mPreviewBoxAsynIcon = new AsynIcon(setPreivewIcon, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	}
	mPreviewBoxAsynIcon.load("Icon/" + row.icon);
	gift_box_name.label.text = row.name;
	gift_box_describe.label.text = row.intro + "  " + Define.aibi + "：" + row.price.ToString();
}
//--------------------------------------------------
// 回调
function setPreivewIcon(tex : Texture)
{
	gift_box_preview.style.normal.background = tex;
}
//--------------------------------------------------



function gift_box_describe_MouseOver(caller : iGUILabel){
	
}