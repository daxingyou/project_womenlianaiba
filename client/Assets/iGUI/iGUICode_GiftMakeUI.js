#pragma strict
#pragma downcast
import iGUI;

class GiftMakeIcon extends PlatResInfoCtrl {
	public var imageElement : iGUIImage;
	public var nameElement : iGUILabel;
	
	//overwrite
	public function Callback() {
		if(URLValid) {
			imageElement.image = image;
		} else {
			imageElement.image = Resources.Load("UISkins/Textures/Common1/default_avatar");
		}
		nameElement.label.text = Global.limitTextLength(info.nickname, 6, "未知", "...");
	}
}

private static var instance : iGUICode_GiftMakeUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var ssf_look_selfGift_btn : iGUIButton;
@HideInInspector
var ssf_p_btn : iGUIButton;
@HideInInspector
var p_name : iGUILabel;
@HideInInspector
var p_img : iGUIImage;
@HideInInspector
var ssf_close_btn : iGUIButton;
@HideInInspector
var singleSelectFrm : iGUIPanel;
@HideInInspector
var lookSelfGiftBtn : iGUIButton;
// 选择送礼性别界面
@HideInInspector
var sf_female_btn : iGUIButton;
@HideInInspector
var sf_female_name : iGUILabel;
@HideInInspector
var sf_female_image : iGUIImage;
@HideInInspector
var sf_male_btn : iGUIButton;
@HideInInspector
var sf_male_name : iGUILabel;
@HideInInspector
var sf_male_image : iGUIImage;
@HideInInspector
var sf_close_btn : iGUIButton;
@HideInInspector
var select_frame : iGUIPanel;
// 礼物制作界面
@HideInInspector
var send_btn : iGUIButton;
@HideInInspector
var cost : iGUILabel;
@HideInInspector
var gift_box_item : iGUIImage;
@HideInInspector
var gift_box : iGUILabel;
@HideInInspector
var tip : iGUILabel;
@HideInInspector
var gift_item_timeout : iGUILabel;
@HideInInspector
var gift_item : iGUIImage;
@HideInInspector
var gift : iGUILabel;
@HideInInspector
var receive_name : iGUILabel;
@HideInInspector
var receive : iGUILabel;
@HideInInspector
var title : iGUILabel;
@HideInInspector
var close_btn : iGUIButton;
@HideInInspector
var background : iGUILabel;
@HideInInspector
var frame : iGUIPanel;
@HideInInspector
var root : iGUIRoot;


//--------------------------------------------------
function Start()
{
	// 礼物制作界面事件注册
	close_btn.clickCallback = System.Delegate.Combine(close_btn.clickCallback, ClickCallback_close_btn as iGUIEventCallback);
	gift_item.clickCallback = System.Delegate.Combine(gift_item.clickCallback, ClickCallback_gift_item as iGUIEventCallback);
	gift_box_item.clickCallback = System.Delegate.Combine(gift_box_item.clickCallback, ClickCallback_gift_box_item as iGUIEventCallback);
	send_btn.clickCallback = System.Delegate.Combine(send_btn.clickCallback, ClickCallback_send_btn as iGUIEventCallback);
	gift_item.mouseOverCallback = System.Delegate.Combine(gift_item.mouseOverCallback, MouseOverCallback_gift_item as iGUIEventCallback);
	gift_box_item.mouseOverCallback = System.Delegate.Combine(gift_box_item.mouseOverCallback, MouseOverCallback_gift_box_item as iGUIEventCallback);
	// 选择性别界面事件注册
	sf_close_btn.clickCallback = System.Delegate.Combine(sf_close_btn.clickCallback, ClickCallback_sf_close_btn as iGUIEventCallback);
	sf_male_image.clickCallback = System.Delegate.Combine(sf_male_image.clickCallback, ClickCallback_sf_male_btn as iGUIEventCallback);
	sf_male_btn.clickCallback = System.Delegate.Combine(sf_male_btn.clickCallback, ClickCallback_sf_male_btn as iGUIEventCallback);
	sf_female_image.clickCallback = System.Delegate.Combine(sf_female_image.clickCallback, ClickCallback_sf_female_btn as iGUIEventCallback);
	sf_female_btn.clickCallback = System.Delegate.Combine(sf_female_btn.clickCallback, ClickCallback_sf_female_btn as iGUIEventCallback);
	lookSelfGiftBtn.clickCallback = ClickCallback_lookSelfGiftBtn;
	ssf_p_btn.clickCallback = ClickCallback_ssf_p_btn;
	p_img.clickCallback = ClickCallback_ssf_p_btn;
	ssf_look_selfGift_btn.clickCallback = ClickCallback_lookSelfGiftBtn;
	ssf_close_btn.clickCallback = ClickCallback_ssf_close_btn;
	// 其他事件注册
	Ctrl.Register("select_gift_item", setGiftItem);
	Ctrl.Register("select_gift_box", setGiftBoxItem);
	Ctrl.Register("send_gift_result", sendGiftResult);
	Ctrl.Register("set_gift_item_default_icon", setGiftDefaultItem);
	Ctrl.Register("set_gift_box_item_default_icon", setGiftBoxDefaultItem);
	// 初始操作
	_init();
}

function OnDestroy()
{
	// 取消事件注册
	Ctrl.Unregister("select_gift_item", setGiftItem);
	Ctrl.Unregister("select_gift_box", setGiftBoxItem);
	Ctrl.Unregister("send_gift_result", sendGiftResult);
	Ctrl.Unregister("set_gift_item_default_icon", setGiftDefaultItem);
	Ctrl.Unregister("set_gift_box_item_default_icon", setGiftBoxDefaultItem);
	Ctrl.Recover("receive_account");
	Ctrl.Recover("open_select_ui");
	// 清除操作
	_clear();
}



/***************************************************
*** 界面事件回调
***************************************************/


//--------------------------------------------------
// 点击关闭按钮
function ClickCallback_close_btn(caller : iGUIElement)
{
	_recoverToPackage();
	Ctrl.Excute("close_gift_make_ui", true);
}
//--------------------------------------------------
// 点击礼物选项
function ClickCallback_gift_item(caller : iGUIElement)
{
	if (GiftLogic.getInstance().isStorageUIOpen())
		return;
	
	if (null == mPackGrid)
	{
		(caller as iGUIImage).image = Resources.Load("UISkins/Textures/gift/xuanze_hover");
	}
	UI.getUI().OpenUIRoot("StorageBoxUI");
	iGUICode_StorageBoxUI.getInstance().enterStorageForMakeGift();
}
//--------------------------------------------------
// 点击礼盒选项
function ClickCallback_gift_box_item(caller : iGUIElement)
{
	if (null == mGiftBoxRow)
	{
		(caller as iGUIImage).image = Resources.Load("UISkins/Textures/gift/xuanze_hover");
	}
	Ctrl.Excute("open_gift_box_ui", null);
}
//--------------------------------------------------
// 点击发送按钮
function ClickCallback_send_btn(caller : iGUIElement)
{
	var content : String = "";
	if (null == mPackGrid)
	{
		content = Define.getContent(5144);
		UI.getUI().OpenMsgbox("", content, true);
		return;
	}
	if (null == mGiftBoxRow)
	{
		content = Define.getContent(5145);
		UI.getUI().OpenMsgbox("", content, true);
		return;
	}
	if (false == _existItem())
	{
		gift_item.image = Resources.Load("UISkins/Textures/gift/xuanze_normal");
		gift_item_timeout.setEnabled(false);
		content = Define.getContent(5146);
		UI.getUI().OpenMsgbox("", content, true);
		return;
	}
	if (money_type.mt_diamond == mGiftBoxRow.type)
	{
		CallbackOk(null);
		return;
	}
	var msg : SysMsgRow = Global.GetSysMsgHandler().getSysMsgRow(537);
	content = msg.msg_content.Replace("{0}", mGiftBoxRow.price.ToString());
	UI.getUI().OpenMsgbox("", content, Define.ok, CallbackOk, Define.cancel, CallbackCancel);
}
//--------------------------------------------------
function CallbackOk(caller : iGUIElement)
{
	// 这里物品不还原到背包
	var gift_instance_id : UInt64 = mPackGrid._item._instanceID;
	var gift_template_id : int = mPackGrid._item._itemInfo.id;
	var reveiver : String = Ctrl.Get("receive_account");
	var sender : String = ScenePlayerMgr.getMainPlayerAccount();
	var gift_box_template_id : int = mGiftBoxRow.id;
	GiftLogic.request_send_gift(gift_instance_id, gift_template_id, reveiver, sender, gift_box_template_id);
}
//--------------------------------------------------
function CallbackCancel(caller : iGUIElement)
{
}
//--------------------------------------------------
// 鼠标移到礼物上
function MouseOverCallback_gift_item(caller : iGUIElement)
{
	if (null == mPackGrid)
		return;
	
	var style : GUIStyle = new GUIStyle(); 	
	style.alignment = TextAnchor.MiddleCenter;
	style.normal.textColor = Color(1.0f, 1.0f, 1.0f);
	style.fontStyle = FontStyle.Bold;
	Global.SysTooltip.Begin(caller);
	Global.SysTooltip.Add(GUIContent(mPackGrid._item._itemInfo.name), style); 	
	Global.SysTooltip.Show(true);
}
//--------------------------------------------------
// 鼠标移到礼盒上
function MouseOverCallback_gift_box_item(caller : iGUIElement)
{
	if (null == mGiftBoxRow)
		return;
	
	var style : GUIStyle = new GUIStyle(); 	
	style.alignment = TextAnchor.MiddleCenter;
	style.normal.textColor = Color(1.0f, 1.0f, 1.0f);
	style.fontStyle = FontStyle.Bold;
	Global.SysTooltip.Begin(caller);
	Global.SysTooltip.Add(GUIContent(mGiftBoxRow.name), style); 	
	Global.SysTooltip.Show(true);
}
//--------------------------------------------------
// 点击关闭按钮
function ClickCallback_sf_close_btn(caller : iGUIElement)
{
	_clearImageLoder();
	Ctrl.Excute("close_gift_make_ui", true);
}
//--------------------------------------------------
// 点击男性按钮
function ClickCallback_sf_male_btn(caller : iGUIElement)
{
	_clearImageLoder();
	Ctrl.Set("receive_account", DataCenter.getMaleHostAccount());
	_openMakeUI();
}
//--------------------------------------------------
// 点击女性按钮
function ClickCallback_sf_female_btn(caller : iGUIElement)
{
	_clearImageLoder();
	Ctrl.Set("receive_account", DataCenter.getFemaleHostAccount());
	_openMakeUI();
}
//---------------------------------------------------
//点击单身选择界面的按钮
function ClickCallback_ssf_p_btn(caller : iGUIElement){
	_clearImageLoder();
	var account : String = DataCenter.getMaleHostAccount();
	if ("" == account)
	{
		account = DataCenter.getFemaleHostAccount();
	}
	Ctrl.Set("receive_account", account);
	_openMakeUI();	
}
//---------------------------------------------------
//
function ClickCallback_ssf_close_btn(caller : iGUIElement){
	_clearImageLoder();
	Ctrl.Excute("close_gift_make_ui", true);	
}




/***************************************************
*** 界面逻辑
***************************************************/
private var Ctrl : Controller = GiftLogic.Ctrl;
private var mGiftItemAsynIcon : AsynIcon = null;
private var mGiftBoxItemAsynIcon : AsynIcon = null;
private var mPackGrid : PackGrid = null;
private var mPackGridCount : int = 0;
private var mGiftBoxRow : GiftBoxRow = null;
private var mImageLoaderArr : Array = new Array();


//--------------------------------------------------
// 初始
private function _init() : void
{
	if (true == Ctrl.Get("open_select_ui"))
	{
		if (DataCenter.isHostSingle()){
			_openSingleSelectUI();
		}
		else{
			_openSelectUI();
		}
	}
	else
	{
		_openMakeUI();
	}
}
//--------------------------------------------------
// 清除
private function _clear() : void
{
	_clearGiftItem();
	_clearGiftBoxItem();
	mGiftItemAsynIcon = null;
	mGiftBoxItemAsynIcon = null;
	mPackGrid = null;
	mPackGridCount = 0;
	mGiftBoxRow = null;
}
//--------------------------------------------------
// 打开选择界面
private function _openSelectUI()
{
	frame.setEnabled(false);
	singleSelectFrm.setEnabled(false);
	select_frame.setEnabled(true);
	// 设置控件
	var male : GiftMakeIcon = new GiftMakeIcon();
	male.imageElement = sf_male_image;
	male.nameElement = sf_male_name;
	var maleLoader : PlatResLoader = Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(DataCenter.getMaleHostAccount(),male);
	mImageLoaderArr.Add(maleLoader);
	
	var female : GiftMakeIcon = new GiftMakeIcon();
	female.imageElement = sf_female_image;
	female.nameElement = sf_female_name;
	var femaleLoader : PlatResLoader = Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(DataCenter.getFemaleHostAccount(),female);
	mImageLoaderArr.Add(femaleLoader);
}
//--------------------------------------------------
//
private function _openSingleSelectUI(){
	frame.setEnabled(false);
	select_frame.setEnabled(false);
	singleSelectFrm.setEnabled(true);
	
	var account : String = DataCenter.getMaleHostAccount();
	if ("" == account)
	{
		account = DataCenter.getFemaleHostAccount();
	}
	var p_info : GiftMakeIcon = new GiftMakeIcon();
	p_info.imageElement = p_img;
	p_info.nameElement = p_name;
	var maleLoader : PlatResLoader = Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(account,p_info);
	mImageLoaderArr.Add(maleLoader);
	
}
//--------------------------------------------------
// 打开制作界面
private function _openMakeUI()
{
	singleSelectFrm.setEnabled(false);
	select_frame.setEnabled(false);
	frame.setEnabled(true);
	// 设置控件
	var account : String = Ctrl.Get("receive_account");
	var name : String = "";
	if (account)
	{
		name = DataCenter.getPlayerName(account);
	}
	receive_name.label.text = Global.limitTextLength(name, 6, Define.unknow, "...");
	cost.label.text = "";
	
	gift_item.image = Resources.Load("UISkins/Textures/gift/xuanze_normal");
	gift_box_item.image = Resources.Load("UISkins/Textures/gift/xuanze_normal");
	gift_item_timeout.setEnabled(false);
}
//--------------------------------------------------
// 清除异步加载图片
private function _clearImageLoder()
{
	for (var loader : PlatResLoader in mImageLoaderArr)
	{
		loader.Cancel();
	}
	mImageLoaderArr.Clear();
}
//--------------------------------------------------
// 清除礼物图标
private function _clearGiftItem()
{
	if (mGiftItemAsynIcon)
	{
		mGiftItemAsynIcon.cancel();
	}
}
//--------------------------------------------------
// 设置礼物图标
function setGiftItem(param : PackGrid) : void
{
	// 设置礼物
	if (1 == param._item._itemInfo.bind)	// 绑定
	{
		Global.GetSysMsgHandler().ShowSysMsg(341);
		return;
	}
	// 清空
	_clearGiftItem();
	_recoverToPackage();
	// 设置格子 
	mPackGrid = param;
	iGUICode_StorageBoxUI.getInstance().exitStorageForMakeGift();
	if (null == mGiftItemAsynIcon)
	{
		mGiftItemAsynIcon = new AsynIcon(setGiftItemIcon, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	}
	mGiftItemAsynIcon.load("Icon/" + mPackGrid._item._itemInfo.icon);
	if (TimeEffect.getInstance().isMature(mPackGrid._item._delTime))
	{
		gift_item_timeout.setEnabled(true);
	}
	_removeFromPackage(1);	// 从背包删除
}
//--------------------------------------------------
// 回调
function setGiftItemIcon(tex : Texture)
{
	gift_item.image = tex;
}
//--------------------------------------------------
// 设置礼物默认图标
function setGiftDefaultItem(param : System.Object) : void
{
	Global.GetSysTooltip().Hide();
	if (null == mPackGrid)
	{
		gift_item.image = Resources.Load("UISkins/Textures/gift/xuanze_normal");
		gift_item_timeout.setEnabled(false);
	}
}
//--------------------------------------------------
// 清除礼盒图标
private function _clearGiftBoxItem()
{
	if (mGiftBoxItemAsynIcon)
	{
		mGiftBoxItemAsynIcon.cancel();
	}
}
//--------------------------------------------------
// 设置礼盒图标
function setGiftBoxItem(param : System.Object) : void
{
	_clearGiftBoxItem();
	mGiftBoxRow = param as GiftBoxRow;
	if (null == mGiftBoxRow)
	{
		setGiftBoxDefaultItem(null);
		return;
	}
	
	if (null == mGiftBoxItemAsynIcon)
	{
		mGiftBoxItemAsynIcon = new AsynIcon(setGiftBoxItemIcon, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	}
	mGiftBoxItemAsynIcon.load("Icon/" + mGiftBoxRow.icon);
	cost.label.text = Define.getContent(5147, [mGiftBoxRow.price.ToString()]);
}
//--------------------------------------------------
// 回调
function setGiftBoxItemIcon(tex : Texture)
{
	gift_box_item.image = tex;
}
//--------------------------------------------------
// 设置礼盒默认图标
function setGiftBoxDefaultItem(param : System.Object)
{
	if (null == mGiftBoxRow)
	{
		gift_box_item.image = Resources.Load("UISkins/Textures/gift/xuanze_normal");
		cost.label.text = "";
	}
}
//--------------------------------------------------
// 发送礼物结果
function sendGiftResult(param : System.Object) : void
{
	// param:1.成功,2.失败
	Ctrl.Excute("close_gift_make_ui", true);
	if (2 == param)
	{
		UI.getUI().OpenMsgbox("", Define.getContent(5148), true);
	}
}
//--------------------------------------------------
// 物品是否存在
private function _existItem() : boolean
{
	if (null == mPackGrid)
		return false;
	
	if (false == SelfItemLogic.getInstance().existItemPack(mPackGrid._item._instanceID))
	{
		mPackGrid = null;
		mPackGridCount = 0;
		return false;
	}
	
	return true;
}
//--------------------------------------------------
// 从背包拿出
private function _removeFromPackage(count : int) : void
{
	if (false == _existItem())
		return;
	
	mPackGridCount = count;
	var remain_count : int = mPackGrid._count - count;
	if (remain_count <= 0)	// 删除
	{
		SelfItemLogic.getInstance().delFromPack(mPackGrid._item._instanceID);
	}
	else	// 更新
	{
		SelfItemLogic.getInstance().updatePack(mPackGrid._item._instanceID, remain_count);
	}
}
//--------------------------------------------------
// 还原到背包
private function _recoverToPackage() : void
{
	if (false == _existItem())
		return;
	
	var pg : PackGrid = SelfItemLogic.getInstance().getPackGrid(mPackGrid._item._instanceID);
	if (null == pg)		// 添加
	{
		mPackGrid._count = mPackGridCount;
		SelfItemLogic.getInstance().addToPack(mPackGrid);
	}
	else	// 更新
	{
		SelfItemLogic.getInstance().updatePack(pg._item._instanceID, pg._count + mPackGridCount);
	}
}
//--------------------------------------------------
//
function ClickCallback_lookSelfGiftBtn(caller : iGUIElement){
	if(GiftLogic.getInstance()){
		Ctrl.Excute("close_gift_make_ui", true);
		GiftLogic.getInstance().openGiftReceiveUI(true);
	}
}

