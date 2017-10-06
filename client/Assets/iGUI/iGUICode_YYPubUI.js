import iGUI;

private static var instance : iGUICode_YYPubUI;
private var mYYChannelChatLogic : YYChannelChatLogic = null;
function Awake(){
	instance=this;
	// step1: 注册事件
	registEvents();
	// step2: 初始化
	initialize();
	//
	mYYChannelChatLogic = new YYChannelChatLogic();
}
static function getInstance(){
	return instance;
}
@HideInInspector
var guest_enable_btn : iGUIButton;
@HideInInspector
var watch_mode_btn : iGUIButton;
@HideInInspector
var speaker_btn : iGUIButton;
@HideInInspector
var dlg_enable_btn : iGUIButton;
@HideInInspector
var notice_label : iGUILabel;
// 聊天菜单
@HideInInspector
var cmp_kickout_btn : iGUIButton;
@HideInInspector
var cmp_visit_btn : iGUIButton;
@HideInInspector
var cmp_priavte_chat_btn : iGUIButton;
@HideInInspector
var cmp_attention_btn : iGUIButton;
@HideInInspector
var chat_menu_panel : iGUIPanel;
// 主持人头像
@HideInInspector
var compere_online_label : iGUILabel;
@HideInInspector
var compere_name_label : iGUILabel;
@HideInInspector
var compere_photo_label : iGUILabel;
@HideInInspector
var compere_frame : iGUIPanel;
// 客人列表
@HideInInspector
var guest_kick_btn9 : iGUIButton;
@HideInInspector
var guest_kick_btn8 : iGUIButton;
@HideInInspector
var guest_kick_btn7 : iGUIButton;
@HideInInspector
var guest_kick_btn6 : iGUIButton;
@HideInInspector
var guest_kick_btn5 : iGUIButton;
@HideInInspector
var guest_kick_btn4 : iGUIButton;
@HideInInspector
var guest_kick_btn3 : iGUIButton;
@HideInInspector
var guest_kick_btn2 : iGUIButton;
@HideInInspector
var guest_kick_btn1 : iGUIButton;
@HideInInspector
var guest_info_btn9 : iGUIButton;
@HideInInspector
var guest_info_btn8 : iGUIButton;
@HideInInspector
var guest_info_btn7 : iGUIButton;
@HideInInspector
var guest_info_btn6 : iGUIButton;
@HideInInspector
var guest_info_btn5 : iGUIButton;
@HideInInspector
var guest_info_btn4 : iGUIButton;
@HideInInspector
var guest_info_btn3 : iGUIButton;
@HideInInspector
var guest_info_btn2 : iGUIButton;
@HideInInspector
var guest_info_btn1 : iGUIButton;
@HideInInspector
var guest_follow_btn9 : iGUIButton;
@HideInInspector
var guest_follow_btn8 : iGUIButton;
@HideInInspector
var guest_follow_btn7 : iGUIButton;
@HideInInspector
var guest_follow_btn6 : iGUIButton;
@HideInInspector
var guest_follow_btn5 : iGUIButton;
@HideInInspector
var guest_follow_btn4 : iGUIButton;
@HideInInspector
var guest_follow_btn3 : iGUIButton;
@HideInInspector
var guest_follow_btn2 : iGUIButton;
@HideInInspector
var guest_follow_btn1 : iGUIButton;
@HideInInspector
var guest_visit_btn9 : iGUIButton;
@HideInInspector
var guest_visit_btn8 : iGUIButton;
@HideInInspector
var guest_visit_btn7 : iGUIButton;
@HideInInspector
var guest_visit_btn6 : iGUIButton;
@HideInInspector
var guest_visit_btn5 : iGUIButton;
@HideInInspector
var guest_visit_btn4 : iGUIButton;
@HideInInspector
var guest_visit_btn3 : iGUIButton;
@HideInInspector
var guest_visit_btn2 : iGUIButton;
@HideInInspector
var guest_visit_btn1 : iGUIButton;
@HideInInspector
var guest_click_image9 : iGUIImage;
@HideInInspector
var guest_click_image8 : iGUIImage;
@HideInInspector
var guest_click_image7 : iGUIImage;
@HideInInspector
var guest_click_image6 : iGUIImage;
@HideInInspector
var guest_click_image5 : iGUIImage;
@HideInInspector
var guest_click_image4 : iGUIImage;
@HideInInspector
var guest_click_image3 : iGUIImage;
@HideInInspector
var guest_click_image2 : iGUIImage;
@HideInInspector
var guest_click_image1 : iGUIImage;
@HideInInspector
var guest_Level_label9 : iGUILabel;
@HideInInspector
var guest_Level_label8 : iGUILabel;
@HideInInspector
var guest_Level_label7 : iGUILabel;
@HideInInspector
var guest_Level_label6 : iGUILabel;
@HideInInspector
var guest_Level_label5 : iGUILabel;
@HideInInspector
var guest_Level_label4 : iGUILabel;
@HideInInspector
var guest_Level_label3 : iGUILabel;
@HideInInspector
var guest_Level_label2 : iGUILabel;
@HideInInspector
var guest_Level_label1 : iGUILabel;
@HideInInspector
var guest_name_label9 : iGUILabel;
@HideInInspector
var guest_name_label8 : iGUILabel;
@HideInInspector
var guest_name_label7 : iGUILabel;
@HideInInspector
var guest_name_label6 : iGUILabel;
@HideInInspector
var guest_name_label5 : iGUILabel;
@HideInInspector
var guest_name_label4 : iGUILabel;
@HideInInspector
var guest_name_label3 : iGUILabel;
@HideInInspector
var guest_name_label2 : iGUILabel;
@HideInInspector
var guest_name_label1 : iGUILabel;
@HideInInspector
var guest_photo_label9 : iGUILabel;
@HideInInspector
var guest_photo_label8 : iGUILabel;
@HideInInspector
var guest_photo_label7 : iGUILabel;
@HideInInspector
var guest_photo_label6 : iGUILabel;
@HideInInspector
var guest_photo_label5 : iGUILabel;
@HideInInspector
var guest_photo_label4 : iGUILabel;
@HideInInspector
var guest_photo_label3 : iGUILabel;
@HideInInspector
var guest_photo_label2 : iGUILabel;
@HideInInspector
var guest_photo_label1 : iGUILabel;
@HideInInspector
var guest_item_panel9 : iGUIPanel;
@HideInInspector
var guest_item_panel8 : iGUIPanel;
@HideInInspector
var guest_item_panel7 : iGUIPanel;
@HideInInspector
var guest_item_panel6 : iGUIPanel;
@HideInInspector
var guest_item_panel5 : iGUIPanel;
@HideInInspector
var guest_item_panel4 : iGUIPanel;
@HideInInspector
var guest_item_panel3 : iGUIPanel;
@HideInInspector
var guest_item_panel2 : iGUIPanel;
@HideInInspector
var guest_item_panel1 : iGUIPanel;
@HideInInspector
var people_num_label3 : iGUILabel;
@HideInInspector
var people_num_label2 : iGUILabel;
@HideInInspector
var people_num_label1 : iGUILabel;
@HideInInspector
var guest_page_label : iGUILabel;
@HideInInspector
var guest_next_page_btn : iGUIButton;
@HideInInspector
var guest_pre_page_btn : iGUIButton;
@HideInInspector
var guest_first_page_btn : iGUIButton;
@HideInInspector
var guest_frame : iGUIPanel;
// 聊天框
@HideInInspector
var PrivateToNameLabel : iGUILabel;
@HideInInspector
var CancelPrivateChatBtn : iGUIButton;
@HideInInspector
var InputBox : iGUITextfield;
@HideInInspector
var InputBoxParent : iGUIPanel;
@HideInInspector
var SendBtn : iGUIButton;
@HideInInspector
var ExpressionBtn : iGUIButton;
@HideInInspector
var InputContainer : iGUIPanel;
@HideInInspector
var OutputListbox : iGUIListBox;
@HideInInspector
var OutputListboxBg : iGUIPanel;
@HideInInspector
var OutputContainer : iGUIContainer;
@HideInInspector
var SizeBtn : iGUIButton;
@HideInInspector
var DlgContainer : iGUIPanel;
// 礼物列表
@HideInInspector
var gift_item6_kuan : iGUILabel;
@HideInInspector
var gift_item5_kuan : iGUILabel;
@HideInInspector
var gift_item4_kuan : iGUILabel;
@HideInInspector
var gift_item3_kuan : iGUILabel;
@HideInInspector
var gift_item2_kuan : iGUILabel;
@HideInInspector
var gift_item1_kuan : iGUILabel;
@HideInInspector
var gift_item6 : iGUIImage;
@HideInInspector
var gift_item5 : iGUIImage;
@HideInInspector
var gift_item4 : iGUIImage;
@HideInInspector
var gift_item3 : iGUIImage;
@HideInInspector
var gift_item2 : iGUIImage;
@HideInInspector
var gift_item1 : iGUIImage;
@HideInInspector
var gift_next_page_btn : iGUIButton;
@HideInInspector
var gift_pre_page_btn : iGUIButton;
@HideInInspector
var gift_tab_btn5 : iGUIButton;
@HideInInspector
var gift_tab_btn4 : iGUIButton;
@HideInInspector
var gift_tab_btn3 : iGUIButton;
@HideInInspector
var gift_tab_btn2 : iGUIButton;
@HideInInspector
var gift_tab_btn1 : iGUIButton;
@HideInInspector
var gift_frame : iGUIPanel;
// 顶部控件
@HideInInspector
var host_btn : iGUIButton;
@HideInInspector
var store_btn : iGUIButton;
@HideInInspector
var close_btn : iGUIButton;
@HideInInspector
var money_text_label : iGUILabel;
@HideInInspector
var money_panel : iGUIPanel;
@HideInInspector
var crystal_text_label : iGUILabel;
@HideInInspector
var crystal_panel : iGUIPanel;
@HideInInspector
var power_progress_fill : iGUILabel;
@HideInInspector
var power_progress_empty : iGUIPanel;
@HideInInspector
var max_power_text_label : iGUILabel;
@HideInInspector
var power_fenge_label : iGUILabel;
@HideInInspector
var cur_power_text_label : iGUILabel;
@HideInInspector
var power_text_container : iGUIPanel;
@HideInInspector
var power_mask_label : iGUILabel;
@HideInInspector
var power_panel : iGUIPanel;
@HideInInspector
var level_progress_fill : iGUILabel;
@HideInInspector
var level_progress_empty : iGUIPanel;
@HideInInspector
var level_progress_text_label : iGUILabel;
@HideInInspector
var level_text_label : iGUILabel;
@HideInInspector
var level_mask_label : iGUILabel;
@HideInInspector
var level_panel : iGUIPanel;
@HideInInspector
var top_frame : iGUIPanel;
// 底部控件
@HideInInspector
var num_select_list : iGUIDropDownList;
@HideInInspector
var num_select_tip_label : iGUILabel;
@HideInInspector
var gift_reciver_label : iGUILabel;
@HideInInspector
var gift_reciver_tip_label : iGUILabel;
@HideInInspector
var send_btn : iGUIButton;
@HideInInspector
var shop_btn : iGUIButton;
@HideInInspector
var setting_btn : iGUIButton;
@HideInInspector
var home_btn : iGUIButton;
@HideInInspector
var pub_btn : iGUIButton;
@HideInInspector
var wish_btn : iGUIButton;
@HideInInspector
var rank_btn : iGUIButton;
@HideInInspector
var action_btn : iGUIButton;
@HideInInspector
var goods_btn : iGUIButton;
@HideInInspector
var datum_btn : iGUIButton;
@HideInInspector
var dress_btn : iGUIButton;
@HideInInspector
var bottom_frame : iGUIPanel;
@HideInInspector
var root : iGUIRoot;




private var mPubInfo : pub_info = null;					// 频道信息
private var mCompereAsynInfo : PartySlotIcon = new PartySlotIcon(12, Define.unknow, "...");
private var mCompereResLoader : PlatResLoader = null;
//
private var GIFT_SLOT_NUM : int = 6;					// 礼物列表每页个数
private var mGiftSlotArray : Array = new Array();
private var mGiftReceiver : String = "";				// 收礼人帐号
private var mGiftPage : YYChannelGiftPage = new YYChannelGiftPage();
//
private var GUEST_SLOT_NUM : int = 9;					// 客人列表每页个数
private var mGuestSlotArray : Array = new Array();
private var mGuestTotalPage : int = 1;
private var mGuestCurPage : int = 1;
//
private var mGoodsPanel : iGUIPanel = null;
private var mGoods : PackGrid = null;
// 编辑器可控制
public var DlgEnableBtnX : float = 353f;
public var DlgDisableBtnX : float = 5;
public var DlgBigHeight : float = 345;									// 聊天框变大时的高度
public var DlgSmallHeight : float = 123;								// 聊天框变小时的高度
public var DlgBigNoticeLabelY : float = 150;
public var DlgSmallNoticeLabelY : float = 372;
public var DlgBigSpeakerBtnY : float = 111;
public var DlgSmallSpeakerBtnY : float = 333;
public var DlgBigWatchModeBtnY : float = 114;
public var DlgSmallWatchModeBtnY : float = 336;
public var GuestEnableBtnX : float = 550;
public var GuestDisableBtnX : float = 735;
//--------------------------------------------------
function Start()
{
	// 底部控件
	dress_btn.clickCallback = ClickCallback_dress_btn;
	datum_btn.clickCallback = ClickCallback_datum_btn;
	goods_btn.clickCallback = ClickCallback_goods_btn;
	action_btn.clickCallback = ClickCallback_action_btn;
	rank_btn.clickCallback = ClickCallback_rank_btn;
	wish_btn.clickCallback = ClickCallback_wish_btn;
	pub_btn.clickCallback = ClickCallback_pub_btn;
	home_btn.clickCallback = ClickCallback_home_btn;
	setting_btn.clickCallback = ClickCallback_setting_btn;
	shop_btn.clickCallback = ClickCallback_shop_btn;
	send_btn.clickCallback = ClickCallback_send_btn;
	num_select_list.valueChangeCallback = ValueChangeCallback_num_select_list;
	// 顶部控件
	close_btn.clickCallback = ClickCallback_close_btn;
	store_btn.clickCallback = ClickCallback_store_btn;
	host_btn.clickCallback = ClickCallback_host_btn;
	// 礼物控件
	gift_tab_btn1.clickCallback = ClickCallback_gift_tab_btn;
	gift_tab_btn2.clickCallback = ClickCallback_gift_tab_btn;
	gift_tab_btn3.clickCallback = ClickCallback_gift_tab_btn;
	gift_tab_btn4.clickCallback = ClickCallback_gift_tab_btn;
	gift_tab_btn5.clickCallback = ClickCallback_gift_tab_btn;
	gift_pre_page_btn.clickCallback = ClickCallback_gift_pre_page_btn;
	gift_next_page_btn.clickCallback = ClickCallback_gift_next_page_btn;
	// 客人控件
	guest_first_page_btn.clickCallback = ClickCallback_guest_first_page_btn;
	guest_pre_page_btn.clickCallback = ClickCallback_guest_pre_page_btn;
	guest_next_page_btn.clickCallback = ClickCallback_guest_next_page_btn;
	// 聊天框控件
	SendBtn.clickCallback = ClickCallback_SendBtn;
	ExpressionBtn.clickCallback = ClickCallback_ExpressionBtn;
	SizeBtn.clickCallback = ClickCallback_SizeBtn;
	// 其他控件
	dlg_enable_btn.clickCallback = ClickCallback_dlg_enable_btn;
	speaker_btn.clickCallback = ClickCallback_speaker_btn;
	watch_mode_btn.clickCallback = ClickCallback_watch_mode_btn;
	guest_enable_btn.clickCallback = ClickCallback_guest_enable_btn;
	//
	UI.getUI().SetIgnoreMouseOver(notice_label, true);
	YYGiftDisplayLogic.getInstance().init(root);
	//
	initChannelChat();
}
//--------------------------------------------------
private function initChannelChat(){
	if(mYYChannelChatLogic){
		mYYChannelChatLogic.setCtrls(InputBox, 
										OutputListbox, 
										DlgContainer, 
										PrivateToNameLabel, 
										CancelPrivateChatBtn, 
										InputBoxParent,
										chat_menu_panel,
										cmp_attention_btn,
										cmp_priavte_chat_btn,
										cmp_visit_btn,
										cmp_kickout_btn,
										InputContainer,
										SendBtn,
										1);
		mYYChannelChatLogic.setChannelID(mPubInfo.pub_id);
	}
}
//--------------------------------------------------
function OnGUI(){
	if(mYYChannelChatLogic){
		mYYChannelChatLogic.Update();
	}
	closeGoodsPanel(false);
}
//--------------------------------------------------
function OnDestroy()
{
	unregistEvents();
	clearGiftList();
	clearGuestList();
	clearCompereFrame();
	if(mYYChannelChatLogic){
		mYYChannelChatLogic.OnDestroy();
		mYYChannelChatLogic = null;
	}
}
//--------------------------------------------------
public function getChannelChatLogic() : YYChannelChatLogic {
	return mYYChannelChatLogic;
}
//--------------------------------------------------
// 换装按钮
function ClickCallback_dress_btn(caller : iGUIElement)
{
	iGUICode_MainUI.OpenDressUI();
}
//--------------------------------------------------
// 资料按钮
function ClickCallback_datum_btn(caller : iGUIElement)
{
	PersonalInfo.getInstance().openUIByAccount(DataCenter.getMainPlayerAccount());
}
//--------------------------------------------------
// 物品按钮
function ClickCallback_goods_btn(caller : iGUIElement)
{
	Backpack.getInstance().openBackpackUI(1, true, true);
}
//--------------------------------------------------
// 动作按钮
function ClickCallback_action_btn(caller : iGUIElement)
{
	var self_posx : float = caller.positionAndSize.x;
	var direct_parent : iGUIElement = caller.getTargetContainer();
	var direct_parent_posx : float = direct_parent.positionAndSize.x;
	var posy : float = direct_parent.positionAndSize.y;
	var posx : float = self_posx + direct_parent_posx;
	var caller_w : float = caller.positionAndSize.width;
	iGUICode_SelfAnimationRoot.OpenSelfAnimaitionRoot(posx, posy, caller_w);
}
//--------------------------------------------------
// 排行按钮
function ClickCallback_rank_btn(caller : iGUIElement)
{
	RankListLogic.getInstance().openRankListUI();
}
//--------------------------------------------------
// 许愿按钮
function ClickCallback_wish_btn(caller : iGUIElement)
{
	UI.getUI().OpenWishListUI("WishListRoot");
}
//--------------------------------------------------
// 酒吧按钮
function ClickCallback_pub_btn(caller : iGUIElement)
{
	YYChannelListLogic.getInstance().initChannelList();
}
//--------------------------------------------------
// 回家按钮
function ClickCallback_home_btn(caller : iGUIElement)
{
	ClickCallback_close_btn(null);
}
//--------------------------------------------------
// 设置按钮
function ClickCallback_setting_btn(caller : iGUIElement)
{
	var x : float = caller.positionAndSize.x;
	var y : float = caller.getTargetContainer().positionAndSize.y - 10;
	iGUICode_SettingPanelUI.openSettingPanel(x, y, false);
}
//--------------------------------------------------
// 商城按钮
function ClickCallback_shop_btn(caller : iGUIElement)
{
	PropShopLogic.Ctrl.Excute("open_prop_shop_ui", 0);
}
//--------------------------------------------------
// 赠送按钮
function ClickCallback_send_btn(caller : iGUIElement)
{
	mGiftPage.sendGift(mGiftReceiver);
}
//--------------------------------------------------
// 数量选择列表
function ValueChangeCallback_num_select_list(caller : iGUIElement)
{
	mGiftPage.setSelectCount((caller as iGUIDropDownList).selectedIndex);
}
//--------------------------------------------------
// 退出按钮
function ClickCallback_close_btn(caller : iGUIElement)
{
	YYChannelListLogic.getInstance().reqLeavePubChannel(mPubInfo.pub_id);
	YYChannelListLogic.getInstance().closeYYPubUI();
	YYGiftDisplayLogic.getInstance().clearGift2D();
	YYGiftDisplayLogic.getInstance().clearGift3D();
}
//--------------------------------------------------
// 收藏按钮
function ClickCallback_store_btn(caller : iGUIElement)
{
}
//--------------------------------------------------
// 开始直播按钮
function ClickCallback_host_btn(caller : iGUIElement)
{
	var startHost : boolean = caller.userData;
	if (startHost)
	{
		YYAudioLogic.StartSpeak();
	}
	else
	{
		YYAudioLogic.StopSpeak();
	}
	setHostBtn(!startHost);
}
//--------------------------------------------------
// 礼物标签按钮
function ClickCallback_gift_tab_btn(caller : iGUIElement)
{
	changeGiftTab(caller);
}
//--------------------------------------------------
// 礼物前一页按钮
function ClickCallback_gift_pre_page_btn(caller : iGUIElement)
{
	if (mGiftPage.canMoveLeft())
	{
		refreshGiftList();
	}
}
//--------------------------------------------------
// 礼物后一页按钮
function ClickCallback_gift_next_page_btn(caller : iGUIElement)
{
	if (mGiftPage.canMoveRight())
	{
		refreshGiftList();
	}
}
//--------------------------------------------------
// 客人首页按钮
function ClickCallback_guest_first_page_btn(caller : iGUIElement)
{
	if (1 == mGuestCurPage)
		return;
	
	mGuestCurPage = 1;
	refreshGuestList();
}
//--------------------------------------------------
// 客人前一页按钮
function ClickCallback_guest_pre_page_btn(caller : iGUIElement)
{
	if (1 == mGuestCurPage)
		return;
	
	--mGuestCurPage;
	refreshGuestList();
}
//--------------------------------------------------
// 客人后一页按钮
function ClickCallback_guest_next_page_btn(caller : iGUIElement)
{
	if (mGuestCurPage == mGuestTotalPage)
		return;
	
	++mGuestCurPage;
	refreshGuestList();
}
//--------------------------------------------------
// 发送聊天内容按钮
function ClickCallback_SendBtn(caller : iGUIElement)
{
}
//--------------------------------------------------
// 聊天表情按钮
function ClickCallback_ExpressionBtn(caller : iGUIElement)
{
}
//--------------------------------------------------
// 聊天框缩放按钮
function ClickCallback_SizeBtn(caller : iGUIElement)
{
	sizeDlg(!caller.userData);
}
//--------------------------------------------------
// 隐藏/显示聊天框按钮
function ClickCallback_dlg_enable_btn(caller : iGUIElement)
{
	enableDlg(!caller.userData);
}
//--------------------------------------------------
// 喇叭按钮
function ClickCallback_speaker_btn(caller : iGUIElement)
{
	SpeakerComp.OpenSpeakerRoot();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_OPENSPEAKER_BTN));
}
//--------------------------------------------------
// 观察模式按钮
function ClickCallback_watch_mode_btn(caller : iGUIElement)
{
	var mode : HouseWatchMode = EQSceneManager.getSingleton().HouseSceneObj.WatchMode;
	switch (mode)
	{
	case HouseWatchMode.HW_MODE_1:		// 无墙
		mode = HouseWatchMode.HW_MODE_2;
		break;
	case HouseWatchMode.HW_MODE_2:		// 半墙
		mode = HouseWatchMode.HW_MODE_3;
		break;
	case HouseWatchMode.HW_MODE_3:		// 全墙
		mode = HouseWatchMode.HW_MODE_4;
		break;
	case HouseWatchMode.HW_MODE_4:		// 屋顶
		mode = HouseWatchMode.HW_MODE_1;
		break;
	}
	changeWatchMode(mode);
}
//--------------------------------------------------
// 显示/隐藏客人列表按钮
function ClickCallback_guest_enable_btn(caller : iGUIElement)
{
	enableGuestList(!caller.userData);
}
//--------------------------------------------------
// 注册事件
private function registEvents() : void
{
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_PUB_SCENE), enterPubScene);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LEAVE_SCENE), leavePubScene);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.UPDATE_LV_EXP), updateLevelPanel);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.UPDATE_HP), updatePowerPanel);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.LOVER_DIAMOND_CHANGE), updateCrystalPanel);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_UPDATE_DIAMOND), updateMoneyPanel);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_UI_MODAL_STATE), handleModalState);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.BACKPACK_CLICKED), clickBackpackSlot);
	YYChannelListLogic.Ctrl.Register("CHANNEL_ADD_GUEST", handleAddGuest);
	YYChannelListLogic.Ctrl.Register("CHANNEL_DEL_GUEST", handleDelGuest);
	YYChannelListLogic.Ctrl.Register("UPDATE_PUB_PLAYER_COUNT", handleGuestCount);
	YYChannelListLogic.Ctrl.Register("BROADCAST_YY_GIFT", broadcastYYGift);
	YYChannelGuestSlot.Ctrl.Register("CLICK_GUEST_SLOT", handleGiftReceiver);
}
//--------------------------------------------------
// 取消事件
private function unregistEvents() : void
{
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_PUB_SCENE), enterPubScene);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LEAVE_SCENE), leavePubScene);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.UPDATE_LV_EXP), updateLevelPanel);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.UPDATE_HP), updatePowerPanel);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.LOVER_DIAMOND_CHANGE), updateCrystalPanel);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_UPDATE_DIAMOND), updateMoneyPanel);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.MSG_UI_MODAL_STATE), handleModalState);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.BACKPACK_CLICKED), clickBackpackSlot);
	YYChannelListLogic.Ctrl.Unregister("CHANNEL_ADD_GUEST", handleAddGuest);
	YYChannelListLogic.Ctrl.Unregister("CHANNEL_DEL_GUEST", handleDelGuest);
	YYChannelListLogic.Ctrl.Unregister("UPDATE_PUB_PLAYER_COUNT", handleGuestCount);
	YYChannelListLogic.Ctrl.Unregister("BROADCAST_YY_GIFT", broadcastYYGift);
	YYChannelGuestSlot.Ctrl.Unregister("CLICK_GUEST_SLOT", handleGiftReceiver);
}
//--------------------------------------------------
// 初始化
private function initialize() : void
{
	// step1: 保存数据
	initPubInfo();
	// step2: 初始界面相关
	initLevelPanel();
	initPowerPanel();
	initCrystalPanel();
	initMoneyPanel();
	initGiftList();
	initGuestList();
	initCompereFrame();
	initHostBtn();
	initDlgFrame();
}
//--------------------------------------------------
// 初始等级
private function initLevelPanel() : void
{
	updateLevelPanel(null, LvExpMgr.GetInstance().GetLevelExp());
}
//--------------------------------------------------
// 更新等级
private function updateLevelPanel(evt : GameEvent, obj : System.Object) : void
{
	var lv : LvExpClass = obj as LvExpClass;
	var cur_level : String = lv.mCurLv < 10 ? "0" + lv.mCurLv.ToString() : lv.mCurLv.ToString();
	level_text_label.label.text = cur_level;
	level_progress_text_label.label.text = lv.mCurExp.ToString();
	var width : float = System.Convert.ToDouble(lv.mCurExp)/System.Convert.ToDouble(lv.mCurMaxExp);
	level_progress_fill.setWidth(width);
	// 
	var full_exp : String = lv.mCurExp.ToString() + "/" + lv.mCurMaxExp.ToString();
	level_panel.userData = Define.getContent(5174, [cur_level, full_exp]);
}
//--------------------------------------------------
// 初始体力
private function initPowerPanel() : void
{
	updatePowerPanel(null, PhyPowerMgr.getInstance().GetPhyPower());
}
//--------------------------------------------------
// 更新体力
private function updatePowerPanel(evt : GameEvent, obj : System.Object) : void
{
	var power : PhyPowerClass = obj as PhyPowerClass;
	var cur_power : int = power.mCurPhyPower;
	var max_power : int = power.mCurMaxPhyPower;
	cur_power_text_label.label.text = cur_power.ToString();
	max_power_text_label.label.text = max_power.ToString();
	cur_power_text_label.labelColor = cur_power > max_power ?  Color(0.6317, 0.0784, 0.1569) : Color.white;
	//
	var width : float = System.Convert.ToDouble(cur_power)/System.Convert.ToDouble(max_power);
	power_progress_fill.setWidth(width > 1 ? 1 : width);
}
//--------------------------------------------------
// 初始水晶
private function initCrystalPanel() : void
{
	updateCrystalPanel(null, SelfItemLogic.getInstance()._loverDiamond);
}
//--------------------------------------------------
// 更新水晶
private function updateCrystalPanel(evt : GameEvent, obj : System.Object) : void
{
	var total : int = obj;
	crystal_text_label.label.text = total.ToString();
}
//--------------------------------------------------
// 初始第二货币
private function initMoneyPanel() : void
{
	updateMoneyPanel(null, DataCenter.GetPlayerDiamond());
}
//--------------------------------------------------
// 更新第二货币
private function updateMoneyPanel(evt : GameEvent, obj : System.Object) : void
{
	var money : int = obj;
	money_text_label.label.text = money.ToString();
}
//--------------------------------------------------
// 初始礼物列表
private function initGiftList() : void
{
	mGiftPage.init();
	var select_frame : SelectFrame = new SelectFrame(root, 64, 64, 5, "UISkins/Textures/YYChanne/kuan");
	for (var i:int = 0; i<GIFT_SLOT_NUM; ++i)
	{
		mGiftSlotArray.Add(new YYChannelGiftSlot(i, getGiftControls(i), select_frame, mGiftPage));
	}
	changeGiftTab(gift_tab_btn1);
	handleGiftReceiver(mPubInfo.owner_info);
}
//--------------------------------------------------
// 清除礼物列表
private function clearGiftList() : void
{
	for (var slot : YYChannelGiftSlot in mGiftSlotArray)
	{
		slot.setContent(null);
	}
	mGiftSlotArray.Clear();
}
//--------------------------------------------------
// 刷新礼物列表
private function refreshGiftList() : void
{
	// step1:清空
	for (var slot : YYChannelGiftSlot in mGiftSlotArray)
	{
		slot.setContent(null);
	}
	// step2:填充当前页
	var curArr : Array = mGiftPage.getCurPage();
	for (var i:int = 0; i<curArr.Count; ++i)
	{
		(mGiftSlotArray[i] as YYChannelGiftSlot).setContent(curArr[i]);
	}
}
//--------------------------------------------------
// 获取礼物选项
private function getGiftControls(index : int) : iGUIImage
{
	if (0 == index) return gift_item1;
	if (1 == index) return gift_item2;
	if (2 == index) return gift_item3;
	if (3 == index) return gift_item4;
	if (4 == index) return gift_item5;
	// 5 == index
	return gift_item6;
}
//--------------------------------------------------
// 改变礼物标签
private function changeGiftTab(tab : iGUIButton) : void
{
	if (true == tab.userData)
		return;
	
	// step1:
	setTabBtnState(tab);
	// step2:
	if (gift_tab_btn1 == tab)
		mGiftPage.changeTab(0);
	else if (gift_tab_btn2 == tab)
		mGiftPage.changeTab(1);
	else if (gift_tab_btn3 == tab)
		mGiftPage.changeTab(2);
	else if (gift_tab_btn4 == tab)
		mGiftPage.changeTab(3);
	else	// gift_tab_btn5 == tab
		mGiftPage.changeTab(4);
	// step3:
	refreshGiftList();
}
//--------------------------------------------------
// 设置标签按钮状态
private function setTabBtnState(tab : iGUIButton) : void
{
	setTabBtnActive(gift_tab_btn1, false);
	setTabBtnActive(gift_tab_btn2, false);
	setTabBtnActive(gift_tab_btn3, false);
	setTabBtnActive(gift_tab_btn4, false);
	setTabBtnActive(gift_tab_btn5, false);
	setTabBtnActive(tab, true);
}
//--------------------------------------------------
// 设置标签按钮选中状态
private function setTabBtnActive(tab : iGUIButton, active : boolean) : void
{
	tab.userData = active;
	var state_image = getTabBtnStateImage(tab);
	var normal : String = active ? state_image[1] : state_image[0];
	var hover : String = active ? state_image[1] : state_image[1];
	var dir : String = "YYChanne/";
	UI.SetButtonState(tab, dir + normal, dir + hover, dir + normal);
}
//--------------------------------------------------
// 获取标签按钮各种状态的图片
private function getTabBtnStateImage(tab : iGUIButton) : String[]
{
	if (gift_tab_btn1 == tab) return ["gift_hot_n", "gift_hot_h", "gift_hot_n"];
	if (gift_tab_btn2 == tab) return ["gift_normal_n", "gift_normal_h", "gift_normal_n"];
	if (gift_tab_btn3 == tab) return ["gift_advanced_n", "gift_advanced_h", "gift_advanced_n"];
	if (gift_tab_btn4 == tab) return ["gift_luxury_n", "gift_luxury_h", "gift_luxury_n"];
	// gift_tab_btn5 == tab
	return ["gift_item_n", "gift_item_h", "gift_item_n"];
}
//--------------------------------------------------
// 设置收礼人
private function handleGiftReceiver(info : pub_account_info) : void
{
	mGiftReceiver = info.account;
	gift_reciver_label.label.text = Global.limitTextLength(info.name, 6, Define.unknow, "...");
}
//--------------------------------------------------
// 广播礼物
private function broadcastYYGift(pack : broadcast_send_yy_gift) : void
{
	var level1 : String = pack.sender_info.level.ToString();
	var name1 : String = pack.sender_info.name;
	var identify : String = YYChannelListLogic.getInstance().isAnchor(pack.recver_info.account) ? Define.anchor : Define.guest;
	var level2 : String = pack.recver_info.level.ToString();
	var name2 : String = pack.recver_info.name;
	var gift_count : String = pack.gift_count.ToString();
	var gift_name : String = ResManager.LgtMgr.getItemRow(pack.gift_id).name;
	var content : String = Define.getContent(5210, [name1, name2, gift_count, gift_name]);
	mYYChannelChatLogic.setPrimitiveContent(content, Color(255.0f/255.0f, 242/255.0f, 0.0f/255.0f));
	YYGiftDisplayLogic.getInstance().displayGift(pack.gift_id, pack.gift_count);
}
//--------------------------------------------------
// 初始频道信息
private function initPubInfo() : void
{
	var info : pub_info = YYChannelListLogic.getInstance().getPubInfo();
	mPubInfo = info;
}
//--------------------------------------------------
// 初始客人列表
private function initGuestList() : void
{
	for (var i:int = 0; i<GUEST_SLOT_NUM; ++i)
	{
		var elements : iGUIElement[] = getGuestControls(i);
		mGuestSlotArray.Add(new YYChannelGuestSlot(elements[0], elements[1], elements[2], elements[3], elements[4], elements[5], elements[6], elements[7], elements[8]));
	}
	refreshGuestList();
	enableGuestList(true);
}
//--------------------------------------------------
// 清除客人列表
private function clearGuestList() : void
{
	for (var slot : YYChannelGuestSlot in mGuestSlotArray)
	{
		slot.setContent(null);
	}
	mGuestSlotArray.Clear();
}
//--------------------------------------------------
// 刷新客人列表
private function refreshGuestList() : void
{
	// step1: 清空
	for (var slot : YYChannelGuestSlot in mGuestSlotArray)
	{
		slot.setContent(null);
	}
	// step2:
	var guests : Array = YYChannelListLogic.getInstance().getGuestArray();
	var totalPage : int = Page.getPageCountA(guests.Count, GUEST_SLOT_NUM);
	mGuestTotalPage = 0 == totalPage ? 1 : totalPage;
	if (mGuestCurPage > mGuestTotalPage)
	{
		mGuestCurPage = mGuestTotalPage;
	}
	// step3:填充当前页
	var curPage : Array = Page.getPageA(guests, GUEST_SLOT_NUM, mGuestCurPage);
	for (var i:int = 0; i<curPage.Count; ++i)
	{
		(mGuestSlotArray[i] as YYChannelGuestSlot).setContent(curPage[i]);
	}
	guest_page_label.label.text = mGuestCurPage.ToString() + "/" + mGuestTotalPage.ToString();
}
//--------------------------------------------------
// 获取客人控件
private function getGuestControls(index : int) : iGUIElement[]
{
	if (0 == index) return [guest_item_panel1, guest_click_image1, guest_photo_label1, guest_name_label1, guest_visit_btn1, guest_follow_btn1, guest_info_btn1, guest_kick_btn1, guest_Level_label1];
	if (1 == index) return [guest_item_panel2, guest_click_image2, guest_photo_label2, guest_name_label2, guest_visit_btn2, guest_follow_btn2, guest_info_btn2, guest_kick_btn2, guest_Level_label2];
	if (2 == index) return [guest_item_panel3, guest_click_image3, guest_photo_label3, guest_name_label3, guest_visit_btn3, guest_follow_btn3, guest_info_btn3, guest_kick_btn3, guest_Level_label3];
	if (3 == index) return [guest_item_panel4, guest_click_image4, guest_photo_label4, guest_name_label4, guest_visit_btn4, guest_follow_btn4, guest_info_btn4, guest_kick_btn4, guest_Level_label4];
	if (4 == index) return [guest_item_panel5, guest_click_image5, guest_photo_label5, guest_name_label5, guest_visit_btn5, guest_follow_btn5, guest_info_btn5, guest_kick_btn5, guest_Level_label5];
	if (5 == index) return [guest_item_panel6, guest_click_image6, guest_photo_label6, guest_name_label6, guest_visit_btn6, guest_follow_btn6, guest_info_btn6, guest_kick_btn6, guest_Level_label6];
	if (6 == index) return [guest_item_panel7, guest_click_image7, guest_photo_label7, guest_name_label7, guest_visit_btn7, guest_follow_btn7, guest_info_btn7, guest_kick_btn7, guest_Level_label7];
	if (7 == index) return [guest_item_panel8, guest_click_image8, guest_photo_label8, guest_name_label8, guest_visit_btn8, guest_follow_btn8, guest_info_btn8, guest_kick_btn8, guest_Level_label8];
	// 8 == index
	return [guest_item_panel9, guest_click_image9, guest_photo_label9, guest_name_label9, guest_visit_btn9, guest_follow_btn9, guest_info_btn9, guest_kick_btn9, guest_Level_label9];}
//--------------------------------------------------
// 处理添加客人消息
private function handleAddGuest(account : String) : void
{
	// 根据帐号判断主持人是否在线
	if (YYChannelListLogic.getInstance().isAnchor(account))
	{
		setCompereOnline(1);
	}
	refreshGuestList();
}
//--------------------------------------------------
// 处理移除客人消息
private function handleDelGuest(account : String) : void
{
	// 自己被踢掉
	if (account == DataCenter.getMainPlayerAccount())
	{
		YYChannelListLogic.getInstance().closeYYPubUI();
		YYGiftDisplayLogic.getInstance().clearGift2D();
		YYGiftDisplayLogic.getInstance().clearGift3D();
		return;
	}
	// 根据帐号判断主持人是否在线
	if (YYChannelListLogic.getInstance().isAnchor(account))
	{
		setCompereOnline(0);
	}
	refreshGuestList();
}
//--------------------------------------------------
// 处理客人数量
private function handleGuestCount(pack : notify_update_pub_player_count) : void
{
	var side_person_count : int = pack.person_count2 - pack.person_count1;
	var total_max_count : int = pack.max_count1 + pack.max_count2;
	people_num_label1.label.text = Define.live + "： " + pack.person_count1.ToString() + "/" + pack.max_count1.ToString();
	people_num_label2.label.text = Define.side + "： " + side_person_count.ToString() + "/" + pack.max_count2.ToString();
	people_num_label3.label.text = Define.all + "： " + pack.person_count2.ToString() + "/" + total_max_count.ToString();
}
//--------------------------------------------------
// 显示/隐藏客人列表
private function enableGuestList(enable : boolean) : void
{
	guest_frame.setEnabled(enable);
	guest_enable_btn.userData = enable;
	guest_enable_btn.setX(enable ? GuestEnableBtnX : GuestDisableBtnX);
}
//--------------------------------------------------
// 初始主持人信息
private function initCompereFrame() : void
{
	compere_name_label.label.text = Global.limitTextLength(mPubInfo.owner_info.name, 6, Define.unknow, "...");
	mCompereAsynInfo.ImageElement = compere_photo_label;
	mCompereResLoader = Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(mPubInfo.owner_info.account, mCompereAsynInfo);
	setCompereOnline(mPubInfo.status);
}
//--------------------------------------------------
// 设置主持人在线状态
private function setCompereOnline(status : int) : void
{
	var bg : String = 0 == status ? "offline" : "online";
	compere_online_label.style.normal.background = Resources.Load("UISkins/Textures/YYChanne/" + bg);
}
//--------------------------------------------------
// 清除主持人信息
private function clearCompereFrame() : void
{
	if (mCompereResLoader)
	{
		Global.GetPlatResLoaderMgr().Remove(mCompereResLoader);
		mCompereResLoader = null;
	}
}
//--------------------------------------------------
// 初始直播按钮
private function initHostBtn() : void
{
	if (YYChannelListLogic.getInstance().isAnchor())
	{
		YYAudioLogic.CreateRoom();
		host_btn.enabled = true;
		setHostBtn(true);
	}
	else
	{
		host_btn.enabled = false;
	}
}
//--------------------------------------------------
// 设置直播按钮
private function setHostBtn(start : boolean) : void
{
	host_btn.userData = start;
	var normal : String = start ? "Btn_star_speak_n" : "Btn_over_speak_n";
	var hover : String = start ? "Btn_star_speak_h" : "Btn_over_speak_h";
	var dir : String = "YYChanne/";
	UI.SetButtonState(host_btn, dir + normal, dir + hover, dir + normal);
}
//--------------------------------------------------
// 初始聊天框
private function initDlgFrame() : void
{
	enableDlg(true);
	sizeDlg(false);
}
//--------------------------------------------------
// 隐藏/显示聊天框
private function enableDlg(enable : boolean) : void
{
	DlgContainer.setEnabled(enable);
	setDlgEnableBtn(enable, enable ? DlgEnableBtnX : DlgDisableBtnX);
	// 
	notice_label.setEnabled(enable);
	speaker_btn.setEnabled(enable);
	watch_mode_btn.setEnabled(enable);
}
//--------------------------------------------------
// 设置隐藏/显示聊天框按钮
private function setDlgEnableBtn(enable : boolean, x : float) : void
{
	dlg_enable_btn.userData = enable;	// 聊天框当前显示状态,true:显示状态
	dlg_enable_btn.setX(x);
	var normal : String = enable ? "close_left" : "open_right";
	var hover : String = enable ? "close_left_hover" : "open_right_hover";
	var dir : String = "Common1/";
	UI.SetButtonState(dlg_enable_btn, dir + normal, dir + hover, dir + normal);
}
//--------------------------------------------------
// 变大/变小聊天框
private function sizeDlg(big : boolean) : void
{
	var height : float = big ? DlgBigHeight : DlgSmallHeight;
	var height_differ : float = OutputContainer.rect.height - height;
	OutputContainer.setHeight(height);
	var rct : Rect = DlgContainer.positionAndSize;
	DlgContainer.setPositionAndSize(Rect(rct.x, rct.y + height_differ, rct.width, rct.height - height_differ));
	rct = InputContainer.positionAndSize;
	InputContainer.setPosition(Vector2(rct.x, rct.y - height_differ));
	rct = SizeBtn.positionAndSize;
	setDlgSizeBtn(big, Vector2(rct.x, rct.y - height_differ));
	// 
	notice_label.setY(big ? DlgBigNoticeLabelY : DlgSmallNoticeLabelY);
	speaker_btn.setY(big ? DlgBigSpeakerBtnY : DlgSmallSpeakerBtnY);
	watch_mode_btn.setY(big ? DlgBigWatchModeBtnY : DlgSmallWatchModeBtnY);
}
//--------------------------------------------------
// 设置变大/变小聊天框按钮
private function setDlgSizeBtn(big : boolean, pos : Vector2) : void
{
	SizeBtn.userData = big;			// 聊天框当前大小状态,true:大的状态
	SizeBtn.setPosition(pos);
	var normal : String = big ? "talk_down" : "talk_up";
	var hover : String = big ? "talk_down_hover" : "talk_up_hover";
	var dir : String = "MainUI/";
	UI.SetButtonState(SizeBtn, dir + normal, dir + hover, dir + normal);
}
//--------------------------------------------------
// 进入酒吧场景
function enterPubScene(evt : GameEvent, obj : System.Object)
{
	var born : BornRow = EQGameSceneMgr.getSingleton().getSceneBornRow();
	changeWatchMode(born.watch_mode);
}
//--------------------------------------------------
// 离开酒吧场景
function leavePubScene(evt : GameEvent, obj : System.Object)
{
	ClickCallback_close_btn(null);
}
//--------------------------------------------------
// 改变观察模式
private function changeWatchMode(mode : HouseWatchMode) : void
{
	EQSceneManager.getSingleton().HouseSceneObj.ChangeWatchMode(mode);
	setWatchModeBtn(mode);
}
//--------------------------------------------------
// 设置观察模式按钮
private function setWatchModeBtn(mode : HouseWatchMode) : void
{
	watch_mode_btn.userData = mode;
	var normal : String = "";
	var hover : String = "";
	switch (mode)
	{
	case HouseWatchMode.HW_MODE_1:
		normal = "no_wall_normal";
		hover = "no_wall_hover";
		break;
	case HouseWatchMode.HW_MODE_2:
		normal = "half_wall_normal";
		hover = "half_wall_hover";
		break;
	case HouseWatchMode.HW_MODE_3:
		normal = "the_wall_normal";
		hover = "the_wall_hover";
		break;
	case HouseWatchMode.HW_MODE_4:
		normal = "wuding";
		hover = "wuding_hover";
		break;
	}
	var dir : String = "MainUI/";
	UI.SetButtonState(watch_mode_btn, dir + normal, dir + hover, dir + normal);
}
//--------------------------------------------------
// 处理界面模态事件
private function handleModalState(evt : GameEvent, obj : System.Object) : void
{
	var modal : boolean = obj;
	if (false == modal && root.passive && false == UI.getUI().IsModal())
	{
		UI.getUI().SetPassive("YYPubUI", false);
	}
}
//--------------------------------------------------
// 点击背包格子
private function clickBackpackSlot(evt : GameEvent, obj : System.Object) : void
{
	var bc : BackpackClass = obj as BackpackClass;
	mGoods = bc.pg;
	if (null == mGoodsPanel)
	{
		mGoodsPanel = createGoodsPanel(bc.root);
	}
	setGoodsPanelBtns(bc.pg._item._itemInfo, mGoodsPanel.items[0], mGoodsPanel.items[1]);
	//
	mGoodsPanel.setLayer(6);
	var left_bottom_x : float = bc.panel.rect.x + 50;
	var left_bottom_y : float = bc.panel.rect.y + 35;
	mGoodsPanel.setPosition(Vector2(left_bottom_x, left_bottom_y - bc.panel.rect.height));
	mGoodsPanel.refreshLayers();
	mGoodsPanel.setEnabled(true);
}
//--------------------------------------------------
// 关闭物品面板
private function closeGoodsPanel(direct_close : boolean) : void
{
	if (null == mGoodsPanel || false == mGoodsPanel.enabled)
		return;
	
	if (direct_close)
	{
		mGoodsPanel.setEnabled(false);
		return;
	}
	if (Input.GetMouseButtonDown(0) && false == mGoodsPanel.isMouseOver)
	{
		mGoodsPanel.setEnabled(false);
	}
}
//--------------------------------------------------
// 创建物品面板
private function createGoodsPanel(root : iGUIRoot) : iGUIPanel
{
	if (null == root)
		return null;
	
	var panel : iGUIPanel = root.addElement("iGUIPanel");
	panel.setWidth(94);
	panel.setHeight(60);
	panel.padding = RectOffset(0, 0, 0, 0);
	panel.style.border = RectOffset(0, 0, 0, 0);
	panel.style.padding = RectOffset(0, 0, 0, 0);
	panel.style.normal.background = Resources.Load("UISkins/Textures/gift/visit_gift_master");
	var useBtn : iGUIButton = panel.addElement("iGUIButton");
	useBtn.setPositionAndSize(Rect(30, 7, 46, 22));
	useBtn.clickCallback = ClickCallback_useBtn;
	var recoverBtn : iGUIButton = panel.addElement("iGUIButton");
	recoverBtn.setPositionAndSize(Rect(30, 29, 46, 22));
	recoverBtn.clickCallback = ClickCallback_recoverBtn;
	return panel;
}
//--------------------------------------------------
// 设置物品面板按钮
private function setGoodsPanelBtns(row : ItemRow, useBtn : iGUIButton, recoverBtn : iGUIButton) : void
{
	// 设置使用按钮
	if (ItemType.Prop == row.type ||		// 道具,服装礼包,家具礼包,材料礼包
		ItemType.ClothesGift == row.type ||
		ItemType.FurnitureGift == row.type ||
		ItemType.MaterialGift == row.type ||
		ItemType.Clothes == row.type ||
		ItemType.Furniture == row.type)
	{
		setGoodsPanelUseBtn(useBtn, true);
	}
	else
	{
		setGoodsPanelUseBtn(useBtn, false);
	}
	// 设置回收按钮
	setGoodsPanelRecoverBtn(recoverBtn, 0 != row.sell_price);
}
//--------------------------------------------------
// 设置物品是否可以使用
private function setGoodsPanelUseBtn(btn : iGUIButton, can_use : boolean) : void
{
	btn.userData = can_use;
	var normal : String = can_use ? "use" : "use_gray";
	var hover : String = can_use ? "use_hover" : "use_gray";
	var active : String = can_use ? "use" : "use_gray";
	
	var dir : String = "storage_box/";
	UI.SetButtonState(btn, dir + normal, dir + hover, dir + active);
}
//--------------------------------------------------
// 设置物品是否可以回收
private function setGoodsPanelRecoverBtn(btn : iGUIButton, can_recover : boolean) : void
{
	btn.userData = can_recover;
	var normal : String = can_recover ? "recovr" : "recovr_gray";
	var hover : String = can_recover ? "recovr_hover" : "recovr_gray";
	var active : String = can_recover ? "recovr" : "recovr_gray";
	
	var dir : String = "storage_box/";
	UI.SetButtonState(btn, dir + normal, dir + hover, dir + active);
}
//--------------------------------------------------
// 使用按钮
function ClickCallback_useBtn(caller : iGUIElement)
{
	if (false == caller.userData)
		return;
	
	closeGoodsPanel(true);
	PropUseLogic.Ctrl.Excute("click_prop_item", mGoods);
}
//--------------------------------------------------
// 回收按钮
function ClickCallback_recoverBtn(caller : iGUIElement)
{
	if (false == caller.userData)
		return;
	
	closeGoodsPanel(true);
	if (mGoods._item._itemInfo.sell_price <= 0)
	{
		var params : ArrayList = new ArrayList();
		params.Add(mGoods._item._itemInfo.name);
		Global.GetSysMsgHandler().ShowSysMsg(518, params);
		return;
	}
	var name : String = mGoods._item._itemInfo.name;
	var price : String = (mGoods._item._itemInfo.sell_price * mGoods._count).ToString();
	var content : String = Define.getContent(5208, [name, name, price.ToString()]);
	UI.getUI().OpenMsgbox("", content, Define.ok, CallbackRecoverOk, Define.cancel, CallbackRecoverCancel);
}
//--------------------------------------------------
// 确定回收
function CallbackRecoverOk(caller : iGUIElement)
{
	if (null == SelfItemLogic.getInstance().getPackGrid(mGoods._item._instanceID))
	{
		UI.getUI().OpenMsgbox("", Define.getContent(5209), true);
		return;
	}
	var arr : Array = new Array();
	arr.Add(mGoods._item._instanceID);
	SelfItemLogic.ReqDeleteLoverItem(arr);
}
//--------------------------------------------------
// 取消回收
function CallbackRecoverCancel(caller : iGUIElement)
{
}
//--------------------------------------------------


