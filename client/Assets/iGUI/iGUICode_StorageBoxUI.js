#pragma strict
#pragma downcast
import iGUI;

private static var instance : iGUICode_StorageBoxUI;
private var isMultiSelectState : boolean = false;
private var mMultiSelectFrmList : Hashtable = new Hashtable();
function Awake()
{
	instance=this;

	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.TO_RESET_MULTISELECTFRAME), HandlerResetMultiSelectFrames);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.PACKITEM_SELECTSTATE_CHANGED), HandlePackItemSelectStateChanged);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.POST_MULTISELECTSTATE), NotifyMultiSelectStateChanged);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.PHYPOWER_TOMAX), NotifyPhyPower_toMax);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.PHYPOWER_NOTTOMAX), NotifyPhyPower_NotToMax);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_FURNI_INVALID), NotifySlotInvalid);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_FURNI_VALID), NotifySlotValid);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_CHANGE_FITMENT_TYPE), NotifyChangeFitmentType);
	
	Global.GetSysMsgHandler().RegistMsgCallback(457,ShopBuyOkCallback,emptyCallback, null);
	Global.GetSysMsgHandler().RegistMsgCallback(458,SaveOkCallback,emptyCallback, null);
}
static function getInstance()
{
	return instance;
}


@HideInInspector
var fdp_nextpage_btn : iGUIButton;
@HideInInspector
var fdp_prepage_btn : iGUIButton;
@HideInInspector
var fd_container : iGUIContainer;
@HideInInspector
var fdp_close_btn : iGUIButton;
@HideInInspector
var foodReservesPanel : iGUIPanel;
@HideInInspector
var BtnMultiUpgrade : iGUIButton;
@HideInInspector
var multiStateLabel : iGUILabel;
@HideInInspector
var multiSaleBtn : iGUIButton;
@HideInInspector
var multiSelectBtn : iGUIButton;
// 装饰度面板
@HideInInspector
var decoration_value : iGUILabel;
@HideInInspector
var decoration_text : iGUILabel;
@HideInInspector
var furniture_max_count : iGUILabel;
@HideInInspector
var furniture_cur_count : iGUILabel;
@HideInInspector
var furniture_count_text : iGUILabel;
@HideInInspector
var decoration_panel : iGUIPanel;
// 背包物品时效图标
@HideInInspector
var storage_goods11_timeout : iGUILabel;
@HideInInspector
var storage_goods10_timeout : iGUILabel;
@HideInInspector
var storage_goods9_timeout : iGUILabel;
@HideInInspector
var storage_goods8_timeout : iGUILabel;
@HideInInspector
var storage_goods7_timeout : iGUILabel;
@HideInInspector
var storage_goods6_timeout : iGUILabel;
@HideInInspector
var storage_goods5_timeout : iGUILabel;
@HideInInspector
var storage_goods4_timeout : iGUILabel;
@HideInInspector
var storage_goods3_timeout : iGUILabel;
@HideInInspector
var storage_goods2_timeout : iGUILabel;
@HideInInspector
var storage_goods1_timeout : iGUILabel;
// 商城背包物品时效图标
@HideInInspector
var shop_goods1_visible : iGUIImage;
@HideInInspector
var shop_goods2_visible : iGUIImage;
@HideInInspector
var shop_goods3_visible : iGUIImage;
@HideInInspector
var shop_goods4_visible : iGUIImage;
@HideInInspector
var shop_goods5_visible : iGUIImage;
@HideInInspector
var shop_goods6_visible : iGUIImage;
@HideInInspector
var shop_goods7_visible : iGUIImage;
@HideInInspector
var shop_goods8_visible : iGUIImage;
@HideInInspector
var shop_goods9_visible : iGUIImage;
@HideInInspector
var shop_goods10_visible : iGUIImage;
@HideInInspector
var shop_goods11_visible : iGUIImage;
// 点击背包物品面板
@HideInInspector
var cip_delay_btn : iGUIButton;
@HideInInspector
var cip_upgrade_btn : iGUIButton;
@HideInInspector
var cip_use_btn : iGUIButton;
@HideInInspector
var cip_recovr_btn : iGUIButton;
@HideInInspector
var click_item_panel : iGUIPanel;
// 镜头控制面板
@HideInInspector
var move_right_btn : iGUIButton;
@HideInInspector
var move_left_btn : iGUIButton;
@HideInInspector
var move_down_btn : iGUIButton;
@HideInInspector
var move_up_btn : iGUIButton;
@HideInInspector
var move_btn : iGUIButton;
var camera_operate : iGUIPanel;
// 家具摆放面板
@HideInInspector
var control_rotate_btn : iGUIButton;
@HideInInspector
var control_put_btn : iGUIButton;
@HideInInspector
var control_take_btn : iGUIButton;
@HideInInspector
var control_functions : iGUIPanel;
// 商城界面
@HideInInspector
var auto_fitment_btn : iGUIButton;
@HideInInspector
var shop_exit_btn : iGUIButton;
@HideInInspector
var shop_save_btn : iGUIButton;
@HideInInspector
var shop_money_text : iGUILabel;
@HideInInspector
var shop_money_icon : iGUILabel;
@HideInInspector
var shop_crystal_text : iGUILabel;
@HideInInspector
var shop_day_night_btn : iGUIButton;
@HideInInspector
var shop_pack_btn : iGUIButton;
@HideInInspector
var shop_mall_btn : iGUIButton;
@HideInInspector
var shop_right_button_page : iGUIButton;
@HideInInspector
var shop_right_button_one : iGUIButton;
@HideInInspector
var shop_left_button_page : iGUIButton;
@HideInInspector
var shop_left_button_one : iGUIButton;
@HideInInspector
var shop_goods11_cover : iGUIImage;
@HideInInspector
var shop_goods11_cost_text : iGUILabel;
@HideInInspector
var shop_goods11_cost_image : iGUILabel;
@HideInInspector
var shop_goods11_image : iGUIImage;
@HideInInspector
var shop_goods11 : iGUIContainer;
@HideInInspector
var shop_goods10_cover : iGUIImage;
@HideInInspector
var shop_goods10_cost_text : iGUILabel;
@HideInInspector
var shop_goods10_cost_image : iGUILabel;
@HideInInspector
var shop_goods10_image : iGUIImage;
@HideInInspector
var shop_goods10 : iGUIContainer;
@HideInInspector
var shop_goods9_cover : iGUIImage;
@HideInInspector
var shop_goods9_cost_text : iGUILabel;
@HideInInspector
var shop_goods9_cost_image : iGUILabel;
@HideInInspector
var shop_goods9_image : iGUIImage;
@HideInInspector
var shop_goods9 : iGUIContainer;
@HideInInspector
var shop_goods8_cover : iGUIImage;
@HideInInspector
var shop_goods8_cost_text : iGUILabel;
@HideInInspector
var shop_goods8_cost_image : iGUILabel;
@HideInInspector
var shop_goods8_image : iGUIImage;
@HideInInspector
var shop_goods8 : iGUIContainer;
@HideInInspector
var shop_goods7_cover : iGUIImage;
@HideInInspector
var shop_goods7_cost_text : iGUILabel;
@HideInInspector
var shop_goods7_cost_image : iGUILabel;
@HideInInspector
var shop_goods7_image : iGUIImage;
@HideInInspector
var shop_goods7 : iGUIContainer;
@HideInInspector
var shop_goods6_cover : iGUIImage;
@HideInInspector
var shop_goods6_cost_text : iGUILabel;
@HideInInspector
var shop_goods6_cost_image : iGUILabel;
@HideInInspector
var shop_goods6_image : iGUIImage;
@HideInInspector
var shop_goods6 : iGUIContainer;
@HideInInspector
var shop_goods5_cover : iGUIImage;
@HideInInspector
var shop_goods5_cost_text : iGUILabel;
@HideInInspector
var shop_goods5_cost_image : iGUILabel;
@HideInInspector
var shop_goods5_image : iGUIImage;
@HideInInspector
var shop_goods5 : iGUIContainer;
@HideInInspector
var shop_goods4_cover : iGUIImage;
@HideInInspector
var shop_goods4_cost_text : iGUILabel;
@HideInInspector
var shop_goods4_cost_image : iGUILabel;
@HideInInspector
var shop_goods4_image : iGUIImage;
@HideInInspector
var shop_goods4 : iGUIContainer;
@HideInInspector
var shop_goods3_cover : iGUIImage;
@HideInInspector
var shop_goods3_cost_text : iGUILabel;
@HideInInspector
var shop_goods3_cost_image : iGUILabel;
@HideInInspector
var shop_goods3_image : iGUIImage;
@HideInInspector
var shop_goods3 : iGUIContainer;
@HideInInspector
var shop_goods2_cover : iGUIImage;
@HideInInspector
var shop_goods2_cost_text : iGUILabel;
@HideInInspector
var shop_goods2_cost_image : iGUILabel;
@HideInInspector
var shop_goods2_image : iGUIImage;
@HideInInspector
var shop_goods2 : iGUIContainer;
@HideInInspector
var shop_goods1_cover : iGUIImage;
@HideInInspector
var shop_goods1_cost_text : iGUILabel;
@HideInInspector
var shop_goods1_cost_image : iGUILabel;
@HideInInspector
var shop_goods1_image : iGUIImage;
@HideInInspector
var shop_goods1 : iGUIContainer;
@HideInInspector
var shop_goods_list : iGUIContainer;
@HideInInspector
var shop : iGUIPanel;
@HideInInspector
var shop_tip : iGUILabel;
// 背包界面
@HideInInspector
var storage_close_btn : iGUIButton;
@HideInInspector
var storage_seed_btn : iGUIButton;
@HideInInspector
var storage_compose_material_btn : iGUIButton;
@HideInInspector
var storage_compose_paper_btn : iGUIButton;
@HideInInspector
var storage_house_btn : iGUIButton;
@HideInInspector
var storage_person_btn : iGUIButton;
@HideInInspector
var storage_prop_btn : iGUIButton;
@HideInInspector
var storage_right_button_page : iGUIButton;
@HideInInspector
var storage_right_button_one : iGUIButton;
@HideInInspector
var storage_left_button_page : iGUIButton;
@HideInInspector
var storage_left_button_one : iGUIButton;
@HideInInspector
var storage_goods11_count : iGUILabel;
@HideInInspector
var storage_goods11_text : iGUILabel;
@HideInInspector
var storage_goods11_image : iGUILabel;
@HideInInspector
var storage_goods11_background : iGUIImage;
@HideInInspector
var storage_goods11 : iGUIContainer;
@HideInInspector
var storage_goods10_count : iGUILabel;
@HideInInspector
var storage_goods10_text : iGUILabel;
@HideInInspector
var storage_goods10_image : iGUILabel;
@HideInInspector
var storage_goods10_background : iGUIImage;
@HideInInspector
var storage_goods10 : iGUIContainer;
@HideInInspector
var storage_goods9_count : iGUILabel;
@HideInInspector
var storage_goods9_text : iGUILabel;
@HideInInspector
var storage_goods9_image : iGUILabel;
@HideInInspector
var storage_goods9_background : iGUIImage;
@HideInInspector
var storage_goods9 : iGUIContainer;
@HideInInspector
var storage_goods8_count : iGUILabel;
@HideInInspector
var storage_goods8_text : iGUILabel;
@HideInInspector
var storage_goods8_image : iGUILabel;
@HideInInspector
var storage_goods8_background : iGUIImage;
@HideInInspector
var storage_goods8 : iGUIContainer;
@HideInInspector
var storage_goods7_count : iGUILabel;
@HideInInspector
var storage_goods7_text : iGUILabel;
@HideInInspector
var storage_goods7_image : iGUILabel;
@HideInInspector
var storage_goods7_background : iGUIImage;
@HideInInspector
var storage_goods7 : iGUIContainer;
@HideInInspector
var storage_goods6_count : iGUILabel;
@HideInInspector
var storage_goods6_text : iGUILabel;
@HideInInspector
var storage_goods6_image : iGUILabel;
@HideInInspector
var storage_goods6_background : iGUIImage;
@HideInInspector
var storage_goods6 : iGUIContainer;
@HideInInspector
var storage_goods5_count : iGUILabel;
@HideInInspector
var storage_goods5_text : iGUILabel;
@HideInInspector
var storage_goods5_image : iGUILabel;
@HideInInspector
var storage_goods5_background : iGUIImage;
@HideInInspector
var storage_goods5 : iGUIContainer;
@HideInInspector
var storage_goods4_count : iGUILabel;
@HideInInspector
var storage_goods4_text : iGUILabel;
@HideInInspector
var storage_goods4_image : iGUILabel;
@HideInInspector
var storage_goods4_background : iGUIImage;
@HideInInspector
var storage_goods4 : iGUIContainer;
@HideInInspector
var storage_goods3_count : iGUILabel;
@HideInInspector
var storage_goods3_text : iGUILabel;
@HideInInspector
var storage_goods3_image : iGUILabel;
@HideInInspector
var storage_goods3_background : iGUIImage;
@HideInInspector
var storage_goods3 : iGUIContainer;
@HideInInspector
var storage_goods2_count : iGUILabel;
@HideInInspector
var storage_goods2_text : iGUILabel;
@HideInInspector
var storage_goods2_image : iGUILabel;
@HideInInspector
var storage_goods2_background : iGUIImage;
@HideInInspector
var storage_goods2 : iGUIContainer;
@HideInInspector
var storage_goods1_count : iGUILabel;
@HideInInspector
var storage_goods1_text : iGUILabel;
@HideInInspector
var storage_goods1_image : iGUILabel;
@HideInInspector
var storage_goods1_background : iGUIImage;
@HideInInspector
var storage_goods1 : iGUIContainer;
@HideInInspector
var storage_goods_list : iGUIContainer;
@HideInInspector
var storage : iGUIPanel;
// 根节点
@HideInInspector
var root : iGUIRoot;



//--------------------------------------------------
function Start()
{
	registerCallbacks();
}
function Update()
{
	closeClickItemPanel(false);
	// 实时更新旋转界面位置
	updateControlUIPos();
}
//--------------------------------------------------
private function registerCallbacks() : void
{
	// 背包界面事件注册
	BtnMultiUpgrade.clickCallback = ClickCallback_multiUpgradeBtn;
	multiSaleBtn.clickCallback = ClickCallback_multiSaleBtn;
	multiSelectBtn.clickCallback = ClickCallback_multiSelectBtn;
	storage_goods1_background.clickCallback = ClickCallback_storage_goods;
	storage_goods2_background.clickCallback = ClickCallback_storage_goods;
	storage_goods3_background.clickCallback = ClickCallback_storage_goods;
	storage_goods4_background.clickCallback = ClickCallback_storage_goods;
	storage_goods5_background.clickCallback = ClickCallback_storage_goods;
	storage_goods6_background.clickCallback = ClickCallback_storage_goods;
	storage_goods7_background.clickCallback = ClickCallback_storage_goods;
	storage_goods8_background.clickCallback = ClickCallback_storage_goods;
	storage_goods9_background.clickCallback = ClickCallback_storage_goods;
	storage_goods10_background.clickCallback = ClickCallback_storage_goods;
	storage_goods11_background.clickCallback = ClickCallback_storage_goods;
	storage_goods1_background.mouseOverCallback = MouseOverCallback_storage_goods;
	storage_goods2_background.mouseOverCallback = MouseOverCallback_storage_goods;
	storage_goods3_background.mouseOverCallback = MouseOverCallback_storage_goods;
	storage_goods4_background.mouseOverCallback = MouseOverCallback_storage_goods;
	storage_goods5_background.mouseOverCallback = MouseOverCallback_storage_goods;
	storage_goods6_background.mouseOverCallback = MouseOverCallback_storage_goods;
	storage_goods7_background.mouseOverCallback = MouseOverCallback_storage_goods;
	storage_goods8_background.mouseOverCallback = MouseOverCallback_storage_goods;
	storage_goods9_background.mouseOverCallback = MouseOverCallback_storage_goods;
	storage_goods10_background.mouseOverCallback = MouseOverCallback_storage_goods;
	storage_goods11_background.mouseOverCallback = MouseOverCallback_storage_goods;
	storage_left_button_one.clickCallback = ClickCallback_storage_left_button_one;
	storage_left_button_page.clickCallback = ClickCallback_storage_left_button_page;
	storage_right_button_one.clickCallback = ClickCallback_storage_right_button_one;
	storage_right_button_page.clickCallback = ClickCallback_storage_right_button_page;
	storage_prop_btn.clickCallback = ClickCallback_storage_prop_btn;
	storage_person_btn.clickCallback = ClickCallback_storage_person_btn;
	storage_house_btn.clickCallback = ClickCallback_storage_house_btn;
	storage_compose_paper_btn.clickCallback = ClickCallback_storage_compose_paper_btn;
	storage_compose_material_btn.clickCallback = ClickCallback_storage_compose_material_btn;
	storage_seed_btn.clickCallback = ClickCallback_storage_seed_btn;
	storage_close_btn.clickCallback = ClickCallback_storage_close_btn;
	// 商城界面事件注册
	shop_goods1_cover.clickCallback = ClickCallback_shop_goods;
	shop_goods2_cover.clickCallback = ClickCallback_shop_goods;
	shop_goods3_cover.clickCallback = ClickCallback_shop_goods;
	shop_goods4_cover.clickCallback = ClickCallback_shop_goods;
	shop_goods5_cover.clickCallback = ClickCallback_shop_goods;
	shop_goods6_cover.clickCallback = ClickCallback_shop_goods;
	shop_goods7_cover.clickCallback = ClickCallback_shop_goods;
	shop_goods8_cover.clickCallback = ClickCallback_shop_goods;
	shop_goods9_cover.clickCallback = ClickCallback_shop_goods;
	shop_goods10_cover.clickCallback = ClickCallback_shop_goods;
	shop_goods11_cover.clickCallback = ClickCallback_shop_goods;
	shop_left_button_one.clickCallback = ClickCallback_shop_left_button_one;
	shop_left_button_page.clickCallback = ClickCallback_shop_left_button_page;
	shop_right_button_one.clickCallback = ClickCallback_shop_right_button_one;
	shop_right_button_page.clickCallback = ClickCallback_shop_right_button_page;
	shop_mall_btn.clickCallback = ClickCallback_shop_mall_btn;
	shop_pack_btn.clickCallback = ClickCallback_shop_pack_btn;
	shop_day_night_btn.clickCallback = ClickCallback_shop_day_night_btn;
	shop_save_btn.clickCallback = ClickCallback_shop_save_btn;
	shop_exit_btn.clickCallback = ClickCallback_shop_exit_btn;
	auto_fitment_btn.clickCallback = ClickCallback_auto_fitment_btn;
	// 镜头控制面板事件注册
	move_btn.clickCallback = ClickCallback_move_btn;
	move_up_btn.clickCallback = ClickCallback_move_up_btn;
	move_down_btn.clickCallback = ClickCallback_move_down_btn;
	move_left_btn.clickCallback = ClickCallback_move_left_btn;
	move_right_btn.clickCallback = ClickCallback_move_right_btn;
	// 家具摆放面板事件注册
	control_take_btn.clickCallback = ClickCallback_control_take_btn;
	control_put_btn.clickCallback = ClickCallback_control_put_btn;
	control_put_btn.clickCallback = System.Delegate.Combine(control_put_btn.clickCallback,ClickCallback_control_put_btn_firstClick as iGUIEventCallback);	
	control_rotate_btn.clickCallback = ClickCallback_control_rotate_btn;
	control_rotate_btn.clickCallback = System.Delegate.Combine(control_rotate_btn.clickCallback,ClickCallback_control_rotate_btns as iGUIEventCallback);
	// 点击背包物品面板事件注册
	cip_recovr_btn.clickCallback = System.Delegate.Combine(cip_recovr_btn.clickCallback, ClickCallback_cip_recovr_btn as iGUIEventCallback);
	cip_use_btn.clickCallback = System.Delegate.Combine(cip_use_btn.clickCallback, ClickCallback_cip_use_btn as iGUIEventCallback);
	cip_delay_btn.clickCallback = System.Delegate.Combine(cip_delay_btn.clickCallback, ClickCallback_cip_delay_btn as iGUIEventCallback);
	cip_upgrade_btn.clickCallback = System.Delegate.Combine(cip_upgrade_btn.clickCallback, ClickCallback_cip_upgrade_btn as iGUIEventCallback);
}
//--------------------------------------------------
// 选中框
private var mSelectFrame : SelectFrame = null;
public function getSelectFrame() : SelectFrame
{
	if (null == mSelectFrame)
	{
		mSelectFrame = new SelectFrame(root, 72, 88, 5, "UISkins/Textures/storage_box/select_frame");
	}
	return mSelectFrame;
}
//--------------------------------------------------
// 家装摄像头
public var delta : float = 1.0f;
private var mCamera : EQCamera = null;

private function initCameraOperate() : void
{
	mCamera = EQCamera.getInstance();
	move_up_btn.isRepeat = true;
	move_down_btn.isRepeat = true;
	move_left_btn.isRepeat = true;
	move_right_btn.isRepeat = true;
}
//--------------------------------------------------
// 家装,背包部分界面的隐藏
public var ShopIgnoreMainUIElement : String[];					// 家装下不被隐藏的主界面元素
public var ShopIgnoreRoot : String[];							// 家装下不被隐藏得root
public var StorageIgnoreMainUIElement : String[];				// 背包下不被隐藏得主界面元素
public var StorageIgnoreRoot : String[];						// 背包下不被隐藏得root
public var StorageIgnoreMainUIElementForMakeGift : String[];	// 背包下不被隐藏得主界面元素,为制作礼物特殊处理
public var StorageIgnoreRootForMakeGift : String[];				// 背包下不被隐藏得root,为制作礼物特殊处理
public var disableElementArr : Array = null;					// 被隐藏的主界面元素
public var disableRootArr : Array = null;						// 被隐藏的root
private var mIsPhyPowerToMax : boolean;
public static var canFitment : boolean = false;

private function enableUI(ignore_element : String[], ignore_root : String[], enable : boolean) : void
{
	// for element
	if (enable && disableElementArr)
	{
		for (var ele : iGUIElement in disableElementArr)
		{
			if (ele.name == "RestoreTm")
			{
				if (!mIsPhyPowerToMax)
					ele.setEnabled(true);
				else
					ele.setEnabled(false);
			}
			else if (ele.name == "NoticeBtn" || ele.name == "SpeakerBtn" ||
					ele.name == "FullWallBtn" || ele.name == "HalfWallBtn" ||
					ele.name =="NowallBtn" || ele.name == "RoofBtn")
			{
				if (iGUICode_MainUI.getInstance().disableDlgBtn.enabled)
				{
					ele.setEnabled(true);
				}
			}
			else
			{
				ele.setEnabled(true);
			}
		}
		disableElementArr.Clear();
	}
	else
	{
		var root : iGUIRoot = iGUICode_MainUI.getInstance().root;
		disableElementArr = UI.getUI().EnableElementIgnore(root, ignore_element, false);
	}
	// for root
	if (enable && disableRootArr)
	{
		UI.getUI().EnableUIRoot(disableRootArr, true);
		disableRootArr.Clear();
	}
	else
	{
		disableRootArr = UI.getUI().EnableUIRootIgnore(ignore_root, false);
	}
}
//--------------------------------------------------
// 游戏事件回调
private function NotifyPhyPower_toMax(evt:GameEvent, obj:Object)
{
	mIsPhyPowerToMax = true;
}

private function NotifyPhyPower_NotToMax(evt:GameEvent, obj:Object)
{
	mIsPhyPowerToMax = false;
}

private function NotifySlotInvalid(evt:GameEvent, obj:Object)
{
	setSlotVisible(obj,true);
}

private function NotifySlotValid(evt:GameEvent, obj:Object)
{
	setSlotVisible(obj,false);
}

private function NotifyChangeFitmentType(evt:GameEvent, obj:Object)
{
	var fitmentType : int = obj;
	var sccr : ShopCenterClassRow = FitmentLogic.getInstance().getCurClass();
	if (2 == fitmentType && null != sccr && sccr.auto_fitment)
	{
		setAutoFitmentBtn(true, sccr.type);
	}
	else
	{
		setAutoFitmentBtn(false, 0);
	}
}

//--------------------------------------------------
// 背包界面回调
function ClickCallback_storage_goods(caller : iGUIElement)
{
	StorageLogic.getInstance().clickSlot(caller);
}

function MouseOverCallback_storage_goods(caller : iGUIElement)
{
	StorageLogic.getInstance().mouseMoveSlot(caller);
}

function ClickCallback_storage_left_button_one(caller : iGUIElement)
{
	StorageLogic.getInstance().pageMove(0);
}

function ClickCallback_storage_left_button_page(caller : iGUIElement)
{
	StorageLogic.getInstance().pageMove(2);
}

function ClickCallback_storage_right_button_one(caller : iGUIElement)
{
	StorageLogic.getInstance().pageMove(1);
}

function ClickCallback_storage_right_button_page(caller : iGUIElement)
{
	StorageLogic.getInstance().pageMove(3);
}

function ClickCallback_storage_prop_btn(caller : iGUIElement)
{
	if (false == caller.userData)
	{
		openPropStorage();
	}
}

function ClickCallback_storage_person_btn(caller : iGUIElement)
{
	if (false == caller.userData)
	{
		openPersonStorage();
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_OPEN_STORAGE_PERSON_BTN));
	}
}

function ClickCallback_storage_house_btn(caller : iGUIElement)
{
	if (false == caller.userData)
	{
		openHouseStorage();
	}
}

function ClickCallback_storage_compose_paper_btn(caller : iGUIElement)
{
	if (false == caller.userData)
	{
		openComposePaperStorage();
	}
}

function ClickCallback_storage_compose_material_btn(caller : iGUIElement)
{
	if (false == caller.userData)
	{
		openComposeMaterialStorage();
	}
}

function ClickCallback_storage_seed_btn(caller : iGUIElement)
{
	if (false == caller.userData)
	{
		openSeedStorage();
	}
}

function ClickCallback_storage_close_btn(caller : iGUIElement)
{
	if (null == UI.getUI().GetUIRoot("GiftMakeUI"))
	{
		exitStorage();
	}
	else
	{
		exitStorageForMakeGift();
	}
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_GOODS_BTN));
}
//--------------------------------------------------
// 商城界面回调
function ClickCallback_shop_goods(caller : iGUIElement)
{
	FitmentLogic.getInstance().clickSlot(caller);
}

function ClickCallback_shop_left_button_one(caller : iGUIElement)
{
	FitmentLogic.getInstance().pageMove(0);
}

function ClickCallback_shop_left_button_page(caller : iGUIElement)
{
	FitmentLogic.getInstance().pageMove(2);
}

function ClickCallback_shop_right_button_one(caller : iGUIElement)
{
	FitmentLogic.getInstance().pageMove(1);
}

function ClickCallback_shop_right_button_page(caller : iGUIElement)
{
	FitmentLogic.getInstance().pageMove(3);
}

function ClickCallback_shop_mall_btn(caller : iGUIElement)
{
	// 已经被选中
	if (caller.userData)
		return;
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_SHOP_MALL_BTN));
	setShoppingTypeBtn(true);
	setStorageTypeBtn(false);
	FitmentLogic.getInstance().shopMode();
}

function ClickCallback_shop_pack_btn(caller : iGUIElement)
{
	// 已经被选中
	if (caller.userData)
		return;
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_SHOP_PACK_BTN));
	setShoppingTypeBtn(false);
	setStorageTypeBtn(true);
	FitmentLogic.getInstance().packageMode();
}

function ClickCallback_shop_day_night_btn(caller : iGUIElement)
{
	if (caller.userData)	// 当前白天,切换为黑夜的图标
	{
		if (AmbientMgr.getSingleton().changeDayNight(false, false))
		{
			setDayNightBtn(false);
		}
	}
	else					// 当前黑夜,切换为白天的图标
	{
		if (AmbientMgr.getSingleton().changeDayNight(true, false))
		{
			setDayNightBtn(true);
		}
	}
}

function ClickCallback_shop_save_btn(caller : iGUIElement)
{
	FitmentLogic.getInstance().handleCurPickComp();
	var content : String = "";
	// 判断花盆数量是否超过
	if (FitmentLogic.getInstance().isFlowerpotOverTop())
	{
		var param : ArrayList = new ArrayList();
		param.Add(PlantLogic.GetInstance().GetLimitCount());
		Global.GetSysMsgHandler().ShowSysMsg(459,param);
		return;
	}
	canFitment = false;
	if (FitmentLogic.getInstance().checkBuyOperate())		// 有购买物品
	{
		var params : ArrayList = new ArrayList();
		params.Add(FitmentLogic.getInstance().getTotalDiamondCost());
		params.Add(FitmentLogic.getInstance().getTotalMoneyCost());
		Global.GetSysMsgHandler().ShowSysMsg(457,params);
	}
	else													// 无购买商品
	{
		Global.GetSysMsgHandler().ShowSysMsg(458);
	}
}

function ShopBuyOkCallback(caller : iGUIElement)
{
	var diamond_enough : boolean = FitmentLogic.getInstance().checkDiamondEnough();
	var money_enough : boolean = FitmentLogic.getInstance().checkMoneyEnough();
	if (diamond_enough && money_enough)			// 水晶和恋爱币足够
	{
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_SAVE_FITMENT));
		FitmentLogic.getInstance().requestAllOperate();
		setLockShopUI(true);
	}
	else										// 不足
	{
		var content : String = "";
		if (false == diamond_enough && false == money_enough)	// 水晶和恋爱币都不足
		{
			content = Define.getContent(5204);
		}
		else if (false == diamond_enough)						// 水晶不足
		{
			content = Define.getContent(5205);;
		}
		else if (false == money_enough)							// 恋爱币不足
		{
			content = Define.getContent(5206);;
		}
		UI.getUI().OpenMsgbox("", content, true);
		canFitment = true;
	}
}

function SaveOkCallback()
{
	if (FitmentLogic.getInstance().checkChangeLayOperate())	// 有摆放操作
	{
		FitmentLogic.getInstance().requestAllOperate();
		setLockShopUI(true);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.UNDO_RECYCLE_FURNI), false);
	}
	else													// 无摆放操作
	{
		FitmentLogic.getInstance().clearCarts();
		FitmentLogic.getInstance().ReqEndEditHouse();
	}
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_SAVE_FITMENT));
}

function ClickCallback_shop_exit_btn(caller : iGUIElement)
{
	FitmentLogic.getInstance().handleCurPickComp();
	if (FitmentLogic.getInstance().checkBuyOperate() ||
		FitmentLogic.getInstance().checkChangeLayOperate())	// 有家装操作
	{
		UI.getUI().OpenMsgbox("", Define.getContent(5207), Define.ok, ShopExitOkCallback as iGUIEventCallback, Define.cancel, emptyCallback as iGUIEventCallback);
	}
	else													// 无家装操作
	{
		FitmentLogic.getInstance().ReqEndEditHouse();
		setLockShopUI(true);
	}
}

function ShopExitOkCallback(caller : iGUIElement)
{
	FitmentLogic.getInstance().recoverAllOperate();			// 还原所有家装操作
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.UNDO_RECYCLE_FURNI), true);
	FitmentLogic.getInstance().ReqEndEditHouse();
}

function emptyCallback(caller : iGUIElement)
{
	if (storage.enabled)
	{
		StorageLogic.getInstance().unselectPackGrid();
	}
	if (shop.enabled)
	{
		canFitment = true;
	}
}

function ClickCallback_auto_fitment_btn(caller : iGUIElement)
{
	Global.GetSysMsgHandler().ShowSysMsg(497);
	AutoFitmentLogic.getInstance().autoFitment(mAutoFitmentScheme);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_AUTO_FITMENT_BTN));
}
//--------------------------------------------------
// 镜头控制面板回调
function ClickCallback_move_btn(caller : iGUIElement)
{
	// 这个函数用来生成家具表(给策划用)
	if (RuntimePlatform.WindowsEditor != Application.platform)
		return;
	
	var arr : Array = new Array();
	for (var comp : HouseSceneComponent in EQSceneManager.getSingleton().HouseSceneObj.HouseComps)
	{
		if (false == comp.IsFrame)
		{
			arr.Add(comp);
		}
	}
	
	var writer : HouseEditorWritter = new HouseEditorWritter("default");
	writer.createFurnitureXml(arr);
}

function ClickCallback_move_up_btn(caller : iGUIElement)
{
	mCamera.move(0.0f, -delta);
}

function ClickCallback_move_down_btn(caller : iGUIElement)
{
	mCamera.move(0.0f, delta);
}

function ClickCallback_move_left_btn(caller : iGUIElement)
{
	mCamera.move(delta, 0.0f);
}

function ClickCallback_move_right_btn(caller : iGUIElement)
{
	mCamera.move(-delta, 0.0f);
}
//--------------------------------------------------
// 家具摆放面板回调
function ClickCallback_control_take_btn(caller : iGUIElement)
{
	FitmentEventMgr.getSingleton().handleFitmentLogic(true);
	FitmentLogic.getInstance().clearSelect();				// 清除物品选中状态
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_RECYCLEFURNI_BTN));
}

function ClickCallback_control_put_btn(caller : iGUIElement)
{
	FitmentEventMgr.getSingleton().putFitment();
}

function ClickCallback_control_put_btn_firstClick(caller:iGUIElement)
{
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.PUTDOWNEND));
}

function ClickCallback_control_rotate_btn(caller : iGUIElement)
{
	FitmentEventMgr.getSingleton().rotateFitmentRight();
}

function ClickCallback_control_rotate_btns(caller:iGUIElement)
{
}
//--------------------------------------------------
// 背包物品面板回调
function ClickCallback_cip_recovr_btn(caller : iGUIElement)
{
	if (false == caller.userData)
		return;
	
	// step1:
	closeClickItemPanel(true);
	// step2:
	var fpg : FitmentPackGrid = StorageLogic.getInstance().getSelectPackGrid();
	if (null == fpg)
		return;
	if (fpg.packGrid._item._itemInfo.sell_price <= 0) {
		var params : ArrayList = new ArrayList();
		params.Add(fpg.packGrid._item._itemInfo.name);
		Global.GetSysMsgHandler().ShowSysMsg(518, params);
		return ;
	}
	
	// step3:
	var name : String = fpg.packGrid._item._itemInfo.name;
	var price : String = (fpg.packGrid._item._itemInfo.sell_price * fpg.packGrid._count).ToString();
	var content : String = Define.getContent(5208, [name, name, price.ToString()]);
	UI.getUI().OpenMsgbox("", content, Define.ok, StorageOkCallback as iGUIEventCallback, Define.cancel, emptyCallback as iGUIEventCallback);
}

function StorageOkCallback(caller : iGUIElement)
{
	var fpg : FitmentPackGrid = StorageLogic.getInstance().getSelectPackGrid();
	if (null == fpg)									// 改物品已经不存在(被摆放或删除)
	{
		UI.getUI().OpenMsgbox("", Define.getContent(5209), Define.ok, emptyCallback as iGUIEventCallback);
		return;
	}
	var arr : Array = new Array();
	arr.Add(fpg.packGrid._item._instanceID);
	SelfItemLogic.ReqDeleteLoverItem(arr);
}

function ClickCallback_cip_use_btn(caller : iGUIElement)
{
	if (false == caller.userData)
		return;
	
	// step1:
	closeClickItemPanel(true);
	// step2:
	var fpg : FitmentPackGrid = StorageLogic.getInstance().getSelectPackGrid();
	PropUseLogic.Ctrl.Excute("click_prop_item", fpg.packGrid);
}

function ClickCallback_cip_delay_btn(caller : iGUIElement) {
	if (false == caller.userData)
		return;
	
	var fpg : FitmentPackGrid = StorageLogic.getInstance().getSelectPackGrid();
	if (null == fpg) return;
		
	ItemUpgradeLogic.GetInstance().OpenItemDelay(fpg.packGrid._item);
}

function ClickCallback_cip_upgrade_btn(caller : iGUIElement) {
	var fpg : FitmentPackGrid = StorageLogic.getInstance().getSelectPackGrid();
	if (null == fpg) return;
	
	ItemUpgradeLogic.GetInstance().OpenUpgrade(fpg.packGrid._item, false);
}

/*--------------------------------------------------
** 家装部分
--------------------------------------------------*/
private var mShopTipTimer : Timer = null;				// 家装提示控件的定时器
private var mCullEanbled : boolean = false;				// 保存剔除开关
private var mAutoFitmentScheme : int = 0;				// 自动家装类型
public var ShopTipLife : float = 3000;					// 家装提示显示的时间
public static var ExitFlag : boolean = false;			// 退出家装标识
// 进入家装
public function enterFitment() : void
{
	// 设置镜头操作
	initCameraOperate();
	// 设置灯光
	AmbientMgr.getSingleton().setMode(AmbientMode.AM_GRADUAL);
	EQGameSceneMgr.getSingleton().getHouse().turnAllLightsForFitment(AmbientMgr.getSingleton().isDayNight());
	setDayNightBtn(AmbientMgr.getSingleton().isDayNight());
	// 设置家装界面
	storage.setEnabled(false);
	shop.setEnabled(true);
	shop_tip.setEnabled(true);
	camera_operate.setEnabled(true);
	setShoppingTypeBtn(true);
	setStorageTypeBtn(false);
	setLockShopUI(false);
	closeClickItemPanel(true);
	initDecoration();
	enableUI(ShopIgnoreMainUIElement, ShopIgnoreRoot, false);
	mShopTipTimer = new Timer(ShopTipLife, 0);
	mShopTipTimer.addEventListener(TimerEvent.TIMER, shopTimeOver);
	mShopTipTimer.addEventListener(TimerEvent.TIMER_COMPLETE, shopTimeOver);
	mShopTipTimer.Start();
	setDlgContainer(true);
	AutoFitmentLogic.getInstance().initAutoFitment();
	setAutoFitmentBtn(false, 0);
	canFitment = true;
	//
	mCullEanbled = ObjectCull.CullEnable;
	ObjectCull.CullEnable = false;
	NewHandGuideLogic.excuteEvent("OPEN_FITMENT_UI", null);
}
// 退出家装
public function exitFitment() : void
{
	// 设置镜头操作
	mCamera.FollowMe = true;
	// 设置灯光
	ExitFlag = true;
	AmbientMgr.getSingleton().setMode(AmbientMode.AM_NORMAL);
	// 设置界面
	UI.getUI().EnableUIRoot("StorageBoxUI", false);
	enableUI(ShopIgnoreMainUIElement, ShopIgnoreRoot, true);
	mShopTipTimer.Stop();
	setDlgContainer(false);
	
	if (PropUseLogic.getInstance().IsFitmentStatus())
	{
		UI.getUI().OpenUIRoot("StorageBoxUI");
		enterStorage();
		PropUseLogic.getInstance().ExitFitment();
	}
	canFitment = false;
	//
	ObjectCull.CullEnable = mCullEanbled;
}
// 家装提示结束回调
private function shopTimeOver(_timer : Timer, obj : System.Object) : void
{
	shop_tip.setEnabled(false);
}
// 设置是否锁定家装界面
public function setLockShopUI(lock_ui : boolean) : void
{
	shop.passive = lock_ui;
}
// 设置昼夜按钮
private function setDayNightBtn(daynight : boolean) : void
{
	var btn = shop_day_night_btn;
	btn.userData = daynight;
	btn.style.normal.background = Resources.Load("UISkins/Textures/Common1/" + (daynight ? "pointing_day" : "pointing_night"));
}
// 设置商城按钮
private function setShoppingTypeBtn(use : boolean) : void
{
	var btn = shop_mall_btn;
	btn.userData = use;
	var normal : String = use ? "shopping_type_pick" : "shopping_type_normal";
	var hover : String = use ? "shopping_type_pick" : "shopping_type_normal_hover";
	var active : String = use ? "shopping_type_pick" : "shopping_type_normal";
	
	btn.style.normal.background = Resources.Load("UISkins/Textures/housefit/" + normal);
	btn.style.hover.background = Resources.Load("UISkins/Textures/housefit/" + hover);
	btn.style.active.background = Resources.Load("UISkins/Textures/housefit/" + active);
}
// 设置背包按钮
private function setStorageTypeBtn(use : boolean) : void
{
	var btn = shop_pack_btn;
	btn.userData = use;
	var normal : String = use ? "storage_box_type_pick" : "storage_box_type_normal";
	var hover : String = use ? "storage_box_type_pick" : "storage_box_type_normal_hover";
	var active : String = use ? "storage_box_type_pick" : "storage_box_type_normal";
	
	btn.style.normal.background = Resources.Load("UISkins/Textures/housefit/" + normal);
	btn.style.hover.background = Resources.Load("UISkins/Textures/housefit/" + hover);
	btn.style.active.background = Resources.Load("UISkins/Textures/housefit/" + active);
}
// set slot visible
private function setSlotVisible(idx : int , bVisible : boolean) : void
{
	switch (idx)
	{
		case 0:	shop_goods1_visible.setEnabled(bVisible);	break;
		case 1:	shop_goods2_visible.setEnabled(bVisible);	break;
		case 2:	shop_goods3_visible.setEnabled(bVisible);	break;
		case 3:	shop_goods4_visible.setEnabled(bVisible);	break;
		case 4:	shop_goods5_visible.setEnabled(bVisible);	break;
		case 5:	shop_goods6_visible.setEnabled(bVisible);	break;
		case 6:	shop_goods7_visible.setEnabled(bVisible);	break;
		case 7:	shop_goods8_visible.setEnabled(bVisible);	break;
		case 8:	shop_goods9_visible.setEnabled(bVisible);	break;
		case 9:	shop_goods10_visible.setEnabled(bVisible);	break;
		case 10: shop_goods11_visible.setEnabled(bVisible);	break;
	}
}
// 打开/关闭旋转界面
public function openControlUI(open : boolean) : void
{
	control_functions.enabled = open;
	if (open)
	{
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.PutdownStart));
	}
}
// 判断旋转界面是否打开
public function isControlUIOpen() : boolean
{
	return control_functions.enabled;
}
// 设置旋转界面的位置,家装模式下实时更新
private function updateControlUIPos() : void
{
	if (false == isControlUIOpen())
		return;
	
	var comp : HouseSceneComponent = FitmentEventMgr.getSingleton().getFitment();
	if (null == comp || null == comp.GameObj)
		return;
	
	var pos : Vector3 = Camera.main.WorldToScreenPoint(comp.GameObj.transform.position);
	pos.y = Screen.height - pos.y;
	var x : float = pos.x - control_functions.rect.width/2.0f;
	var y : float = pos.y - control_functions.rect.height/2.0f - 70.0f;
	control_functions.setX(x);
	control_functions.setY(y);
}
// 更新购买清单里的花费
public function updateTotalText(diamond : int, money : int) : void
{
	// 水晶足够,白色;水晶不足,红色
	var diamond_col : Color = FitmentLogic.getInstance().checkDiamondEnough() ? Color.white : Color.red;
	shop_crystal_text.style.normal.textColor =  diamond_col;
	shop_crystal_text.label.text = 0 == diamond ? "" : diamond.ToString();
	// 恋爱币足够,白色;水晶不足,红色
	var money_col : Color = FitmentLogic.getInstance().checkMoneyEnough() ? Color.white : Color.red;
	shop_money_text.style.normal.textColor =  money_col;
	shop_money_text.label.text = 0 == money ? "" : money.ToString();
}
// 初始装饰度
private function initDecoration() : void
{
	updateDecoration(Property.getInstance().getCurFurniNum(), Property.getInstance().getDecoration());
	furniture_max_count.label.text = "/" + Property.getInstance().getMaxFurniNum().ToString();
	decoration_panel.setEnabled(true);
}
// 更新装饰度
public function updateDecoration(cur : int, deco : int) : void
{
	furniture_cur_count.label.text = cur.ToString();
	// 数量超过上限,字体颜色改变
	var col : Color = cur > Property.getInstance().getMaxFurniNum() ? Color(255.0f, 0.0f, 0.0f) : Color(255.0f, 255.0f, 255.0f);
	furniture_cur_count.style.normal.textColor = col;
	
	decoration_value.label.text = deco.ToString();
}
// 获取家装格子控件
public function getFitmentSlotControls(index : int) : iGUIElement[]
{
	if (0 == index)	return [shop_goods1_image, shop_goods1_cost_image, shop_goods1_cost_text, shop_goods1_cover];
	if (1 == index)	return [shop_goods2_image, shop_goods2_cost_image, shop_goods2_cost_text, shop_goods2_cover];
	if (2 == index)	return [shop_goods3_image, shop_goods3_cost_image, shop_goods3_cost_text, shop_goods3_cover];
	if (3 == index)	return [shop_goods4_image, shop_goods4_cost_image, shop_goods4_cost_text, shop_goods4_cover];
	if (4 == index)	return [shop_goods5_image, shop_goods5_cost_image, shop_goods5_cost_text, shop_goods5_cover];
	if (5 == index)	return [shop_goods6_image, shop_goods6_cost_image, shop_goods6_cost_text, shop_goods6_cover];
	if (6 == index)	return [shop_goods7_image, shop_goods7_cost_image, shop_goods7_cost_text, shop_goods7_cover];
	if (7 == index)	return [shop_goods8_image, shop_goods8_cost_image, shop_goods8_cost_text, shop_goods8_cover];
	if (8 == index)	return [shop_goods9_image, shop_goods9_cost_image, shop_goods9_cost_text, shop_goods9_cover];
	if (9 == index)	return [shop_goods10_image, shop_goods10_cost_image, shop_goods10_cost_text, shop_goods10_cover];
	// 10 == index
	return [shop_goods11_image, shop_goods11_cost_image, shop_goods11_cost_text, shop_goods11_cover];
}
// 设置自动家装按钮
public function setAutoFitmentBtn(enable : boolean, scheme : int) : void
{
	auto_fitment_btn.setEnabled(enable);
	mAutoFitmentScheme = scheme;
}
/*--------------------------------------------------
** 背包部分
--------------------------------------------------*/
// 进入背包
public function enterStorage() : void
{
	camera_operate.setEnabled(false);
	shop.setEnabled(false);
	shop_tip.setEnabled(false);
	decoration_panel.setEnabled(false);
	storage.setEnabled(true);
	closeClickItemPanel(true);
	enableUI(StorageIgnoreMainUIElement, StorageIgnoreRoot, false);
	StorageLogic.getInstance().enterStorage();
	setDlgContainer(true);
}
// 退出背包
public function exitStorage() : void
{
	isMultiSelectState = false;
	multiSaleBtn.setEnabled(false);
	BtnMultiUpgrade.setEnabled(false);
	multiStateLabel.setEnabled(false);
	UI.getUI().EnableUIRoot("StorageBoxUI", false);
	enableUI(StorageIgnoreMainUIElement, StorageIgnoreRoot, true);
	StorageLogic.getInstance().exitStorage();
	setDlgContainer(false);
}
// 进入背包,为制作礼物特殊处理
public function enterStorageForMakeGift() : void
{
	UI.getUI().SetModal("GiftMakeUI", false);
	//
	camera_operate.setEnabled(false);
	shop.setEnabled(false);
	shop_tip.setEnabled(false);
	decoration_panel.setEnabled(false);
	storage.setEnabled(true);
	enableUI(StorageIgnoreMainUIElementForMakeGift, StorageIgnoreRootForMakeGift, false);
	if (!DataCenter.isInSelfHouse())
	{
		iGUICode_MainUI.getInstance().crystal.setEnabled(true);
	}
	StorageLogic.getInstance().enterStorage();
	setDlgContainer(true);
}
// 退出背包,为制作礼物特殊处理
public function exitStorageForMakeGift() : void
{
	UI.getUI().EnableUIRoot("StorageBoxUI", false);
	enableUI(StorageIgnoreMainUIElementForMakeGift, StorageIgnoreRootForMakeGift, true);
	if (!DataCenter.isInSelfHouse())
	{
		iGUICode_MainUI.getInstance().crystal.setEnabled(false);
	}
	StorageLogic.getInstance().exitStorage();
	setDlgContainer(false);
	//
	UI.getUI().SetModal("GiftMakeUI", true);
	GiftLogic.Ctrl.Excute("set_gift_item_default_icon", null);
}
// 打开背包,打开默认的分栏
public function openDefaultStorage(type) : void
{
	switch (type)
	{
	case 0:	openPropStorage();	break;								// 道具
	case 1:	openPersonStorage();	break;							// 人物装饰
	case 2:	openHouseStorage();	break;								// 家居装饰
	case 3:	openComposePaperStorage();	break;						// 炼金图纸
	case 4:	openComposeMaterialStorage();	break;					// 炼金材料
	case 5:	openSeedStorage();	break;								// 种子
	}
}
// 打开道具分栏
private function openPropStorage() : void
{
	clickClassifyButton(storage_prop_btn, true);					// 道具
	clickClassifyButton(storage_person_btn, false);					// 人物装饰
	clickClassifyButton(storage_house_btn, false);					// 家居装饰
	clickClassifyButton(storage_compose_paper_btn, false);			// 炼金图纸
	clickClassifyButton(storage_compose_material_btn, false);		// 炼金材料
	clickClassifyButton(storage_seed_btn, false);					// 种子材料
	
	StorageLogic.getInstance().propMode();
}
// 打开人物装饰分栏
private function openPersonStorage() : void
{
	clickClassifyButton(storage_prop_btn, false);
	clickClassifyButton(storage_person_btn, true);
	clickClassifyButton(storage_house_btn, false);
	clickClassifyButton(storage_compose_paper_btn, false);
	clickClassifyButton(storage_compose_material_btn, false);
	clickClassifyButton(storage_seed_btn, false);
	
	StorageLogic.getInstance().personMode();
}
// 打开家居装饰分栏
private function openHouseStorage() : void
{
	clickClassifyButton(storage_prop_btn, false);
	clickClassifyButton(storage_person_btn, false);
	clickClassifyButton(storage_house_btn, true);
	clickClassifyButton(storage_compose_paper_btn, false);
	clickClassifyButton(storage_compose_material_btn, false);
	clickClassifyButton(storage_seed_btn, false);
	
	StorageLogic.getInstance().houseMode();
}
// 打开炼金图纸分栏
private function openComposePaperStorage() : void
{
	clickClassifyButton(storage_prop_btn, false);
	clickClassifyButton(storage_person_btn, false);
	clickClassifyButton(storage_house_btn, false);
	clickClassifyButton(storage_compose_paper_btn, true);
	clickClassifyButton(storage_compose_material_btn, false);
	clickClassifyButton(storage_seed_btn, false);
	
	StorageLogic.getInstance().composePaperMode();
}
// 打开炼金材料分栏
private function openComposeMaterialStorage() : void
{
	clickClassifyButton(storage_prop_btn, false);
	clickClassifyButton(storage_person_btn, false);
	clickClassifyButton(storage_house_btn, false);
	clickClassifyButton(storage_compose_paper_btn, false);
	clickClassifyButton(storage_compose_material_btn, true);
	clickClassifyButton(storage_seed_btn, false);
	
	StorageLogic.getInstance().composeMaterialMode();
}
// 打开种子分栏
private function openSeedStorage() : void
{
	clickClassifyButton(storage_prop_btn, false);
	clickClassifyButton(storage_person_btn, false);
	clickClassifyButton(storage_house_btn, false);
	clickClassifyButton(storage_compose_paper_btn, false);
	clickClassifyButton(storage_compose_material_btn, false);
	clickClassifyButton(storage_seed_btn, true);
	
	StorageLogic.getInstance().seedMode();
}
// 点击三个分类按钮,设置按钮状态
private function clickClassifyButton(button : iGUIButton, click : boolean) : void
{
	button.userData = click;
	var state_image = getTabBtnStateImage(button);
	var normal : String = click ? state_image[1] : state_image[0];
	var hover : String = click ? state_image[1] : state_image[1];
	var push : String = click ? state_image[1] : state_image[2];
	
	button.style.normal.background = Resources.Load("UISkins/Textures/" + normal);
	button.style.hover.background = Resources.Load("UISkins/Textures/" + hover);
	button.style.active.background = Resources.Load("UISkins/Textures/" + push);
}
// 获取标签各状态的图片
private function getTabBtnStateImage(tab : iGUIButton) : String[]
{
	if (storage_prop_btn == tab) return ["Common1/type_button_normal", "Common1/type_button_2", "Common1/type_button_normal"];
	if (storage_person_btn == tab) return ["Common1/type_button_normal", "Common1/type_button_2", "Common1/type_button_normal"];
	if (storage_house_btn == tab) return ["Common1/type_button_normal", "Common1/type_button_2", "Common1/type_button_normal"];
	if (storage_compose_paper_btn == tab) return ["Common1/type_button_normal", "Common1/type_button_2", "Common1/type_button_normal"];
	if (storage_compose_material_btn == tab) return ["Common1/type_button_normal", "Common1/type_button_2", "Common1/type_button_normal"];
	// storage_seed_btn == tab
	return ["Common1/type_button_normal", "Common1/type_button_2", "Common1/type_button_normal"];
}
// 设置物品是否可以使用
private function setClickItemPanelUseBtn(btn : iGUIButton, can_use : boolean) : void
{
	btn.userData = can_use;
	var normal : String = can_use ? "use" : "use_gray";
	var hover : String = can_use ? "use_hover" : "use_gray";
	var active : String = can_use ? "use" : "use_gray";
	
	var dir : String = "storage_box/";
	UI.SetButtonState(btn, dir + normal, dir + hover, dir + active);
}
// 设置物品是否可以回收
private function setClickItemPanelRecoverBtn(btn : iGUIButton, can_recover : boolean) : void
{
	btn.userData = can_recover;
	var normal : String = can_recover ? "recovr" : "recovr_gray";
	var hover : String = can_recover ? "recovr_hover" : "recovr_gray";
	var active : String = can_recover ? "recovr" : "recovr_gray";
	
	var dir : String = "storage_box/";
	UI.SetButtonState(btn, dir + normal, dir + hover, dir + active);
}
// 设置物品是否可以延迟
private function setClickItemPanelDelayBtn(btn : iGUIButton, can_delay : boolean) : void
{
	btn.userData = can_delay;
	var normal : String = can_delay ? "lengthen" : "lengthen_gray";
	var hover : String = can_delay ? "lengthen_hover" : "lengthen_gray";
	var active : String = can_delay ? "lengthen" : "lengthen_gray";
	
	var dir : String = "storage_box/";
	UI.SetButtonState(btn, dir + normal, dir + hover, dir + active);
}
// 设置时效图标是否显示
public function setStorageTimeoutVisible(idx : int , bVisible : boolean) : void
{
	switch (idx)
	{
		case 0: storage_goods1_timeout.setEnabled(bVisible); break;
		case 1: storage_goods2_timeout.setEnabled(bVisible); break;
		case 2: storage_goods3_timeout.setEnabled(bVisible); break;
		case 3: storage_goods4_timeout.setEnabled(bVisible); break;
		case 4: storage_goods5_timeout.setEnabled(bVisible); break;
		case 5: storage_goods6_timeout.setEnabled(bVisible); break;
		case 6: storage_goods7_timeout.setEnabled(bVisible); break;
		case 7: storage_goods8_timeout.setEnabled(bVisible); break;
		case 8: storage_goods9_timeout.setEnabled(bVisible); break;
		case 9: storage_goods10_timeout.setEnabled(bVisible); break;
		case 10: storage_goods11_timeout.setEnabled(bVisible); break;
	}
}
//--------------------------------------------------
// 打开点击物品面板
public function openClickItemPanel(goods : iGUIElement, fpg : FitmentPackGrid) : void
{
	if (GiftLogic.getInstance().isGiftMakeUIOpen())					// 在送礼
		return;
	
	if (null == goods || null == fpg)
		return;
	
	// 设置使用按钮
	if (ItemType.Prop == fpg.packGrid._item._itemInfo.type ||		// 道具,服装礼包,家具礼包,材料礼包
		ItemType.ClothesGift == fpg.packGrid._item._itemInfo.type ||
		ItemType.FurnitureGift == fpg.packGrid._item._itemInfo.type ||
		ItemType.MaterialGift == fpg.packGrid._item._itemInfo.type ||
		ItemType.Clothes == fpg.packGrid._item._itemInfo.type ||
		ItemType.Furniture == fpg.packGrid._item._itemInfo.type)
	{
		setClickItemPanelUseBtn(cip_use_btn, true);
	}
	else
	{
		setClickItemPanelUseBtn(cip_use_btn, false);
	}
	// 设置回收按钮
	setClickItemPanelRecoverBtn(cip_recovr_btn, 0 != fpg.packGrid._item._itemInfo.sell_price);
	// 设置延迟按钮
	if(fpg.packGrid._item._itemInfo.effect_time_id == 0 || Global.isStimeNull(fpg.packGrid._item._delTime)) {
		setClickItemPanelDelayBtn(cip_delay_btn, false);
	} else {
		//TODO:delay
		setClickItemPanelDelayBtn(cip_delay_btn, false);
	}
	// 
	click_item_panel.setLayer(6);
	var left_bottom_x : float = goods.rect.x + 50;
	var left_bottom_y : float = goods.rect.y + 35;
	click_item_panel.setPosition(Vector2(left_bottom_x, left_bottom_y - goods.rect.height));
	click_item_panel.refreshLayers();
	click_item_panel.setEnabled(true);
}
// 关闭点击物品面板
public function closeClickItemPanel(direct_close : boolean) : void
{
	if (false == click_item_panel.enabled)
		return;
	
	if (direct_close)
	{
		click_item_panel.setEnabled(false);
		return;
	}
	if (Input.GetMouseButtonDown(0) && false == click_item_panel.isMouseOver)
	{
		click_item_panel.setEnabled(false);
		StorageLogic.getInstance().unselectPackGrid();
	}
}
//--------------------------------------------------
// 设置聊天框高度
private var mOldDlgContainerY : float = 0.0f;
private var mOldDisableDlgBtnY : float = 0.0f;
private var mOldEnableDlgBtnY : float = 0.0f;
private var mOldWallBtnY : float = 0.0f;
private var mOldUpDownStairsBtnY : float = 0.0f;

private function setDlgContainer(change : boolean) : void
{
	if (change)
	{
		mOldDlgContainerY = iGUICode_MainUI.getInstance().DlgContainer.rect.y;
		mOldDisableDlgBtnY = iGUICode_MainUI.getInstance().disableDlgBtn.rect.y;
		mOldEnableDlgBtnY = iGUICode_MainUI.getInstance().enableDlgBtn.rect.y;
		mOldWallBtnY = iGUICode_MainUI.getInstance().fullWallBtn.rect.y;
		mOldUpDownStairsBtnY = iGUICode_MainUI.getInstance().UpDownStairsBtn.rect.y;
		iGUICode_MainUI.getInstance().DlgContainer.setY(mOldDlgContainerY - 90);
		iGUICode_MainUI.getInstance().disableDlgBtn.setY(mOldDisableDlgBtnY - 90);
		iGUICode_MainUI.getInstance().enableDlgBtn.setY(mOldEnableDlgBtnY - 90);
		iGUICode_MainUI.getInstance().fullWallBtn.setY(mOldWallBtnY - 90);
		iGUICode_MainUI.getInstance().halfWallBtn.setY(mOldWallBtnY - 90);
		iGUICode_MainUI.getInstance().nowallBtn.setY(mOldWallBtnY - 90);
		iGUICode_MainUI.getInstance().roofBtn.setY(mOldWallBtnY - 90);
		iGUICode_MainUI.getInstance().UpDownStairsBtn.setY(mOldUpDownStairsBtnY - 90);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.LEAVE_MAINUI), true);
	}
	else
	{
		iGUICode_MainUI.getInstance().DlgContainer.setY(mOldDlgContainerY);
		iGUICode_MainUI.getInstance().disableDlgBtn.setY(mOldDisableDlgBtnY);
		iGUICode_MainUI.getInstance().enableDlgBtn.setY(mOldEnableDlgBtnY);
		iGUICode_MainUI.getInstance().fullWallBtn.setY(mOldWallBtnY);
		iGUICode_MainUI.getInstance().halfWallBtn.setY(mOldWallBtnY);
		iGUICode_MainUI.getInstance().nowallBtn.setY(mOldWallBtnY);
		iGUICode_MainUI.getInstance().roofBtn.setY(mOldWallBtnY);
		iGUICode_MainUI.getInstance().UpDownStairsBtn.setY(mOldUpDownStairsBtnY);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.LEAVE_MAINUI), false);
	}
}
//--------------------------------------------------
function ClickCallback_multiSelectBtn(caller : iGUIElement){
	isMultiSelectState = !isMultiSelectState;
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.POST_MULTISELECTSTATE), isMultiSelectState);
}
//--------------------------------------------------
function ClickCallback_multiSaleBtn(caller : iGUIElement){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_MULTISALE_BTN));
}
//--------------------------------------------------
function ClickCallback_multiUpgradeBtn(caller : iGUIElement) {
	ItemUpgradeLogic.GetInstance().OpenMultiUpgrade();
}
//--------------------------------------------------
function NotifyMultiSelectStateChanged(evt : GameEvent, obj : Object){
	var state : boolean = Convert.ToBoolean(obj);
	if(state){
		multiSelectBtn.style.normal.background = Resources.Load("UISkins/Textures/MainUI/pitch_up_cancel_h") as Texture;
		multiSelectBtn.style.hover.background = Resources.Load("UISkins/Textures/MainUI/pitch_up_cancel_h") as Texture;
		multiSelectBtn.style.active.background = Resources.Load("UISkins/Textures/MainUI/pitch_up_cancel_h") as Texture;
		multiSaleBtn.setEnabled(true);
		multiStateLabel.setEnabled(true);
		BtnMultiUpgrade.setEnabled(true);
	}
	else{
		multiSelectBtn.style.normal.background = Resources.Load("UISkins/Textures/MainUI/pitch_up_all_n") as Texture;
		multiSelectBtn.style.hover.background = Resources.Load("UISkins/Textures/MainUI/pitch_up_all_h") as Texture;
		multiSelectBtn.style.active.background = Resources.Load("UISkins/Textures/MainUI/pitch_up_all_n") as Texture;
		multiSaleBtn.setEnabled(false);
		multiStateLabel.setEnabled(false);
		BtnMultiUpgrade.setEnabled(false);
		RemoveAllMultiSelectedFrame();
	}
}
//---------------------------------------------------
function HandlePackItemSelectStateChanged(evt : GameEvent, obj : Object){
	var fpg : FitmentPackGrid = obj as FitmentPackGrid;
}
//---------------------------------------------------
public function CreateMultiSelectFrame(corres_ele : iGUIElement){
	if(!IsMultiSelectFrameInList(corres_ele.variableName + "_multiselectfrm")){
		var img : Texture = Resources.Load("UISkins/Textures/MainUI/selected") as Texture;
		var sel_frm : iGUIImage = root.addElement("iGUIImage") as iGUIImage;
		sel_frm.name = corres_ele.variableName + "_multiselectfrm";
		sel_frm.setVariableName(corres_ele.variableName + "_multiselectfrm");
		sel_frm.setLayer(5);
		sel_frm.ignoreClicks = true;
		sel_frm.setWidth(img.width);
		sel_frm.setHeight(img.height);
		sel_frm.setX(corres_ele.rect.x - 10);
		sel_frm.setY(corres_ele.rect.y + 15);
		sel_frm.image = img;
		mMultiSelectFrmList.Add(sel_frm.variableName, sel_frm);
		
	}
}
//----------------------------------------------------
public function DeleteMultiSelectFrame(corres_ele : iGUIElement){
	var vname : String = corres_ele.variableName + "_multiselectfrm";
	if(IsMultiSelectFrameInList(vname)){
		if(mMultiSelectFrmList.Item[vname]){
			var frm : iGUIElement = mMultiSelectFrmList.Item[vname] as iGUIElement;
			root.removeElement(frm);
		}
		mMultiSelectFrmList.Remove(vname);
	}
}
//----------------------------------------------------
private function IsMultiSelectFrameInList(vname : String) : boolean{
	return mMultiSelectFrmList.ContainsKey(vname);
}
//----------------------------------------------------
private function RemoveAllMultiSelectedFrame(){
	if(mMultiSelectFrmList.Count <= 0)
		return;
	
	for(var de : DictionaryEntry in mMultiSelectFrmList){
		var frm : iGUIElement = de.Value as iGUIElement;
		root.removeElement(frm);
	}
	
	mMultiSelectFrmList.Clear();
}
//-----------------------------------------------------
function HandlerResetMultiSelectFrames(evt : GameEvent, obj : Object){
	RemoveAllMultiSelectedFrame();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.TO_UPDATE_MULTISELECTFRAME));
}