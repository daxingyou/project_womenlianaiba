import iGUI;

private static var instance : iGUICode_VoiceChannelUI;
function Awake(){
	instance=this;
	// step1:
	init();
	// step2:
	registerEvents();
	mYYChannelChatLogic = new YYChannelChatLogic();
}
static function getInstance(){
	return instance;
}
@HideInInspector
var gift_display_image : iGUIImage;
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
@HideInInspector
var send_gift_btn : iGUIButton;
@HideInInspector
var num_select_list : iGUIDropDownList;
@HideInInspector
var tip_label5 : iGUILabel;
@HideInInspector
var gift_reciver_label : iGUILabel;
@HideInInspector
var tip_label4 : iGUILabel;
@HideInInspector
var recharge_btn : iGUIButton;
@HideInInspector
var balance_label : iGUILabel;
@HideInInspector
var tip_label1 : iGUILabel;
@HideInInspector
var gift_next_page_btn : iGUIButton;
@HideInInspector
var gift_pre_page_btn : iGUIButton;
@HideInInspector
var gift_item6_kuan : iGUILabel;
@HideInInspector
var gift_item6 : iGUIImage;
@HideInInspector
var gift_item5_kuan : iGUILabel;
@HideInInspector
var gift_item5 : iGUIImage;
@HideInInspector
var gift_item4_kuan : iGUILabel;
@HideInInspector
var gift_item4 : iGUIImage;
@HideInInspector
var gift_item3_kuan : iGUILabel;
@HideInInspector
var gift_item3 : iGUIImage;
@HideInInspector
var gift_item2_kuan : iGUILabel;
@HideInInspector
var gift_item2 : iGUIImage;
@HideInInspector
var gift_item1_kuan : iGUILabel;
@HideInInspector
var gift_item1 : iGUIImage;
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
var rank_mic_btn : iGUIButton;
@HideInInspector
var rank_speker_btn : iGUIButton;
@HideInInspector
var gift_panel : iGUIPanel;
@HideInInspector
var people_num_label3 : iGUILabel;
@HideInInspector
var people_num_label2 : iGUILabel;
@HideInInspector
var people_num_label1 : iGUILabel;
@HideInInspector
var guest_Level_label12 : iGUILabel;
@HideInInspector
var guest_kick_btn12 : iGUIButton;
@HideInInspector
var guest_info_btn12 : iGUIButton;
@HideInInspector
var guest_follow_btn12 : iGUIButton;
@HideInInspector
var guest_visit_btn12 : iGUIButton;
@HideInInspector
var guest_name_label12 : iGUILabel;
@HideInInspector
var guest_photo_label12 : iGUILabel;
@HideInInspector
var guest_click_image12 : iGUIImage;
@HideInInspector
var guest_item_panel12 : iGUIPanel;
@HideInInspector
var guest_Level_label11 : iGUILabel;
@HideInInspector
var guest_kick_btn11 : iGUIButton;
@HideInInspector
var guest_info_btn11 : iGUIButton;
@HideInInspector
var guest_follow_btn11 : iGUIButton;
@HideInInspector
var guest_visit_btn11 : iGUIButton;
@HideInInspector
var guest_name_label11 : iGUILabel;
@HideInInspector
var guest_photo_label11 : iGUILabel;
@HideInInspector
var guest_click_image11 : iGUIImage;
@HideInInspector
var guest_item_panel11 : iGUIPanel;
@HideInInspector
var guest_Level_label10 : iGUILabel;
@HideInInspector
var guest_kick_btn10 : iGUIButton;
@HideInInspector
var guest_info_btn10 : iGUIButton;
@HideInInspector
var guest_follow_btn10 : iGUIButton;
@HideInInspector
var guest_visit_btn10 : iGUIButton;
@HideInInspector
var guest_name_label10 : iGUILabel;
@HideInInspector
var guest_photo_label10 : iGUILabel;
@HideInInspector
var guest_click_image10 : iGUIImage;
@HideInInspector
var guest_item_panel10 : iGUIPanel;
@HideInInspector
var guest_Level_label9 : iGUILabel;
@HideInInspector
var guest_kick_btn9 : iGUIButton;
@HideInInspector
var guest_info_btn9 : iGUIButton;
@HideInInspector
var guest_follow_btn9 : iGUIButton;
@HideInInspector
var guest_visit_btn9 : iGUIButton;
@HideInInspector
var guest_name_label9 : iGUILabel;
@HideInInspector
var guest_photo_label9 : iGUILabel;
@HideInInspector
var guest_click_image9 : iGUIImage;
@HideInInspector
var guest_item_panel9 : iGUIPanel;
@HideInInspector
var guest_Level_label8 : iGUILabel;
@HideInInspector
var guest_kick_btn8 : iGUIButton;
@HideInInspector
var guest_info_btn8 : iGUIButton;
@HideInInspector
var guest_follow_btn8 : iGUIButton;
@HideInInspector
var guest_visit_btn8 : iGUIButton;
@HideInInspector
var guest_name_label8 : iGUILabel;
@HideInInspector
var guest_photo_label8 : iGUILabel;
@HideInInspector
var guest_click_image8 : iGUIImage;
@HideInInspector
var guest_item_panel8 : iGUIPanel;
@HideInInspector
var guest_Level_label7 : iGUILabel;
@HideInInspector
var guest_kick_btn7 : iGUIButton;
@HideInInspector
var guest_info_btn7 : iGUIButton;
@HideInInspector
var guest_follow_btn7 : iGUIButton;
@HideInInspector
var guest_visit_btn7 : iGUIButton;
@HideInInspector
var guest_name_label7 : iGUILabel;
@HideInInspector
var guest_photo_label7 : iGUILabel;
@HideInInspector
var guest_click_image7 : iGUIImage;
@HideInInspector
var guest_item_panel7 : iGUIPanel;
@HideInInspector
var guest_Level_label6 : iGUILabel;
@HideInInspector
var guest_kick_btn6 : iGUIButton;
@HideInInspector
var guest_info_btn6 : iGUIButton;
@HideInInspector
var guest_follow_btn6 : iGUIButton;
@HideInInspector
var guest_visit_btn6 : iGUIButton;
@HideInInspector
var guest_name_label6 : iGUILabel;
@HideInInspector
var guest_photo_label6 : iGUILabel;
@HideInInspector
var guest_click_image6 : iGUIImage;
@HideInInspector
var guest_item_panel6 : iGUIPanel;
@HideInInspector
var guest_Level_label5 : iGUILabel;
@HideInInspector
var guest_kick_btn5 : iGUIButton;
@HideInInspector
var guest_info_btn5 : iGUIButton;
@HideInInspector
var guest_follow_btn5 : iGUIButton;
@HideInInspector
var guest_visit_btn5 : iGUIButton;
@HideInInspector
var guest_name_label5 : iGUILabel;
@HideInInspector
var guest_photo_label5 : iGUILabel;
@HideInInspector
var guest_click_image5 : iGUIImage;
@HideInInspector
var guest_item_panel5 : iGUIPanel;
@HideInInspector
var guest_Level_label4 : iGUILabel;
@HideInInspector
var guest_kick_btn4 : iGUIButton;
@HideInInspector
var guest_info_btn4 : iGUIButton;
@HideInInspector
var guest_follow_btn4 : iGUIButton;
@HideInInspector
var guest_visit_btn4 : iGUIButton;
@HideInInspector
var guest_name_label4 : iGUILabel;
@HideInInspector
var guest_photo_label4 : iGUILabel;
@HideInInspector
var guest_click_image4 : iGUIImage;
@HideInInspector
var guest_item_panel4 : iGUIPanel;
@HideInInspector
var guest_Level_label3 : iGUILabel;
@HideInInspector
var guest_kick_btn3 : iGUIButton;
@HideInInspector
var guest_info_btn3 : iGUIButton;
@HideInInspector
var guest_follow_btn3 : iGUIButton;
@HideInInspector
var guest_visit_btn3 : iGUIButton;
@HideInInspector
var guest_name_label3 : iGUILabel;
@HideInInspector
var guest_photo_label3 : iGUILabel;
@HideInInspector
var guest_click_image3 : iGUIImage;
@HideInInspector
var guest_item_panel3 : iGUIPanel;
@HideInInspector
var guest_Level_label2 : iGUILabel;
@HideInInspector
var guest_kick_btn2 : iGUIButton;
@HideInInspector
var guest_info_btn2 : iGUIButton;
@HideInInspector
var guest_follow_btn2 : iGUIButton;
@HideInInspector
var guest_visit_btn2 : iGUIButton;
@HideInInspector
var guest_name_label2 : iGUILabel;
@HideInInspector
var guest_photo_label2 : iGUILabel;
@HideInInspector
var guest_click_image2 : iGUIImage;
@HideInInspector
var guest_item_panel2 : iGUIPanel;
@HideInInspector
var guest_Level_label1 : iGUILabel;
@HideInInspector
var guest_kick_btn1 : iGUIButton;
@HideInInspector
var guest_info_btn1 : iGUIButton;
@HideInInspector
var guest_follow_btn1 : iGUIButton;
@HideInInspector
var guest_visit_btn1 : iGUIButton;
@HideInInspector
var guest_name_label1 : iGUILabel;
@HideInInspector
var guest_photo_label1 : iGUILabel;
@HideInInspector
var guest_click_image1 : iGUIImage;
@HideInInspector
var guest_item_panel1 : iGUIPanel;
@HideInInspector
var guest_page_label : iGUILabel;
@HideInInspector
var guest_next_page_btn : iGUIButton;
@HideInInspector
var guest_pre_page_btn : iGUIButton;
@HideInInspector
var guest_first_page_btn : iGUIButton;
@HideInInspector
var guest_list : iGUIPanel;
@HideInInspector
var assist_name_label2 : iGUILabel;
@HideInInspector
var assist_name_label1 : iGUILabel;
@HideInInspector
var compere_name_label : iGUILabel;
@HideInInspector
var compere_photo_backgroud : iGUILabel;
@HideInInspector
var compere_online_label : iGUILabel;
@HideInInspector
var compere_photo_label : iGUILabel;
@HideInInspector
var store_btn : iGUIButton;
@HideInInspector
var report_btn : iGUIButton;
@HideInInspector
var host_btn : iGUIButton;
@HideInInspector
var enter_bar_btn : iGUIButton;
@HideInInspector
var bar_list_btn : iGUIButton;
@HideInInspector
var tip_label3 : iGUILabel;
@HideInInspector
var tip_label2 : iGUILabel;
@HideInInspector
var function_panel : iGUIPanel;
@HideInInspector
var system_board_label : iGUILabel;
@HideInInspector
var system_board_panel : iGUIPanel;
@HideInInspector
var private_name_label : iGUILabel;
@HideInInspector
var chat_input_box : iGUITextfield;
@HideInInspector
var cancel_private_btn : iGUIButton;
@HideInInspector
var chat_input_box_panel : iGUIPanel;
@HideInInspector
var send_btn : iGUIButton;
@HideInInspector
var expression_btn : iGUIButton;
@HideInInspector
var chat_input_panel : iGUIPanel;
@HideInInspector
var chat_output_list : iGUIListBox;
@HideInInspector
var chat_output_panel : iGUIPanel;
@HideInInspector
var chat_panel : iGUIPanel;
@HideInInspector
var min_btn : iGUIButton;
@HideInInspector
var close_btn : iGUIButton;
@HideInInspector
var frame : iGUIPanel;
@HideInInspector
var root : iGUIRoot;



//--------------------------------------------------
private var GUEST_SLOT_NUM : int = 12;					// 客人列表每页的个数
private var mGuestSlotArray : Array = new Array();
private var mGuestTotalPage : int = 1;
private var mGuestCurPage : int = 1;
private var mPubInfo : pub_info = null;
private var mOwnerAsynInfo : PartySlotIcon = new PartySlotIcon(12, Define.unknow, "...");	// 主持人
private var mOwnerResLoader : PlatResLoader = null;
private var mAssistAsynInfo1 : PartySlotIcon = new PartySlotIcon(12, Define.unknow, "...");	// 协管员1
private var mAssistResLoader1 : PlatResLoader = null;
private var mAssistAsynInfo2 : PartySlotIcon = new PartySlotIcon(12, Define.unknow, "...");	// 协管员2
private var mAssistResLoader2 : PlatResLoader = null;
private var mYYChannelChatLogic : YYChannelChatLogic = null;
private var GIFT_SLOT_NUM : int = 6;					// 礼物列表每页个数
private var mGiftSlotArray : Array = new Array();
private var mGiftPage : YYChannelGiftPage = new YYChannelGiftPage();
private var mGiftReceiver : String = "";
private var mYYGiftScene : GameObject = null;
public var YYGiftScenePrefab : GameObject = null;
//--------------------------------------------------
function Start()
{
	close_btn.clickCallback = ClickCallback_close_btn;
	min_btn.clickCallback = ClickCallback_min_btn;
	expression_btn.clickCallback = ClickCallback_expression_btn;
	send_btn.clickCallback = ClickCallback_send_btn;
	cancel_private_btn.clickCallback = ClickCallback_cancel_private_btn;
	bar_list_btn.clickCallback = ClickCallback_bar_list_btn;
	enter_bar_btn.clickCallback = ClickCallback_enter_bar_btn;
	host_btn.clickCallback = ClickCallback_host_btn;
	report_btn.clickCallback = ClickCallback_report_btn;
	store_btn.clickCallback = ClickCallback_store_btn;
	guest_first_page_btn.clickCallback = ClickCallback_guest_first_page_btn;
	guest_pre_page_btn.clickCallback = ClickCallback_guest_pre_page_btn;
	guest_next_page_btn.clickCallback = ClickCallback_guest_next_page_btn;
	gift_tab_btn1.clickCallback = ClickCallback_gift_tab_btn;
	gift_tab_btn2.clickCallback = ClickCallback_gift_tab_btn;
	gift_tab_btn3.clickCallback = ClickCallback_gift_tab_btn;
	gift_tab_btn4.clickCallback = ClickCallback_gift_tab_btn;
	gift_tab_btn5.clickCallback = ClickCallback_gift_tab_btn;
	gift_pre_page_btn.clickCallback = ClickCallback_gift_pre_page_btn;
	gift_next_page_btn.clickCallback = ClickCallback_gift_next_page_btn;
	rank_speker_btn.clickCallback = ClickCallback_rank_speker_btn;
	rank_mic_btn.clickCallback = ClickCallback_rank_mic_btn;
	recharge_btn.clickCallback = ClickCallback_recharge_btn;
	send_gift_btn.clickCallback = ClickCallback_send_gift_btn;
	num_select_list.valueChangeCallback = ValueChangeCallback_num_select_list;
	//
	initChannelChat();
	mYYGiftScene = GameObject.Instantiate(YYGiftScenePrefab);
	YYGiftDisplayLogic.getInstance().init(root);
}
//--------------------------------------------------
public function getChannelChatLogic() : YYChannelChatLogic {
	return mYYChannelChatLogic;
}
//--------------------------------------------------
private function initChannelChat(){
	if(mYYChannelChatLogic){
		mYYChannelChatLogic.setCtrls(chat_input_box, 
										chat_output_list, 
										chat_panel, 
										private_name_label, 
										cancel_private_btn, 
										chat_input_box_panel,
										chat_menu_panel,
										cmp_attention_btn,
										cmp_priavte_chat_btn,
										cmp_visit_btn,
										cmp_kickout_btn,
										chat_input_panel,
										send_btn,
										0);
		mYYChannelChatLogic.setChannelID(mPubInfo.pub_id);
	}
}
//--------------------------------------------------
function OnGUI(){
	if(mYYChannelChatLogic){
		mYYChannelChatLogic.Update();
	}
}
//--------------------------------------------------
function OnDestroy()
{
	YYChannelListLogic.Ctrl.Unregister("CHANNEL_ADD_GUEST", addGuestAccount);
	YYChannelListLogic.Ctrl.Unregister("CHANNEL_DEL_GUEST", delGuestAccount);
	YYChannelListLogic.Ctrl.Unregister("UPDATE_PUB_PLAYER_COUNT", updatePubPlayerCount);
	YYChannelListLogic.Ctrl.Unregister("BROADCAST_YY_GIFT", broadcastYYGift);
	YYChannelGuestSlot.Ctrl.Unregister("CLICK_GUEST_SLOT", handleGiftReceiver);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_UPDATE_DIAMOND), updateMoneyDiamond);
	clearPubInfo();
	clearGuestList();
	clearGiftList();
	if(mYYChannelChatLogic){
		mYYChannelChatLogic.OnDestroy();
		mYYChannelChatLogic = null;
	}
	if (mYYGiftScene)
	{
		GameObject.Destroy(mYYGiftScene);
	}
}
//--------------------------------------------------
// 关闭按钮
function ClickCallback_close_btn(caller : iGUIElement)
{
	YYChannelListLogic.getInstance().reqLeavePubChannel(mPubInfo.pub_id);
	YYChannelListLogic.getInstance().closeVoiceChannelUI();
	YYGiftDisplayLogic.getInstance().clearGift2D();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_VoiceChannelUI));
}
//--------------------------------------------------
// 最小化按钮
function ClickCallback_min_btn(caller : iGUIElement)
{
	YYChannelListLogic.getInstance().minimizeVoiceChannelUI();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_MINI_VoiceChannelUI));
}
//--------------------------------------------------
// 聊天表情按钮
function ClickCallback_expression_btn(caller : iGUIElement)
{
}
//--------------------------------------------------
// 发送聊天内容按钮
function ClickCallback_send_btn(caller : iGUIElement)
{
	if(!mPubInfo || chat_input_box.value == "")
		return;
	
	caller.userData = chat_input_box.value;
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_CHANNEL_SENDBTN), caller);
}
//--------------------------------------------------
// 取消私聊按钮
function ClickCallback_cancel_private_btn(caller : iGUIElement)
{
}
//--------------------------------------------------
// 酒吧列表按钮
function ClickCallback_bar_list_btn(caller : iGUIElement)
{
	ClickCallback_min_btn(null);
	YYChannelListLogic.getInstance().initChannelList();
}
//--------------------------------------------------
// 进入酒吧按钮
function ClickCallback_enter_bar_btn(caller : iGUIElement)
{
	YYChannelListLogic.getInstance().reqEnterPubScene();
}
//--------------------------------------------------
// 主持按钮
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
	setHostBtnState(!startHost);
}
//--------------------------------------------------
// 举报按钮
function ClickCallback_report_btn(caller : iGUIElement)
{
}
//--------------------------------------------------
// 收藏按钮
function ClickCallback_store_btn(caller : iGUIElement)
{
}
//--------------------------------------------------
// 玩家列表首页按钮
function ClickCallback_guest_first_page_btn(caller : iGUIElement)
{
	if (1 == mGuestCurPage)
		return;
	
	mGuestCurPage = 1;
	refreshGuestPage();
}
//--------------------------------------------------
// 玩家列表前一页按钮
function ClickCallback_guest_pre_page_btn(caller : iGUIElement)
{
	if (1 == mGuestCurPage)
		return;
	
	--mGuestCurPage;
	refreshGuestPage();
}
//--------------------------------------------------
// 玩家列表后一页按钮
function ClickCallback_guest_next_page_btn(caller : iGUIElement)
{
	if (mGuestCurPage == mGuestTotalPage)
		return;
	
	++mGuestCurPage;
	refreshGuestPage();
}
//--------------------------------------------------
// 标签按钮
function ClickCallback_gift_tab_btn(caller : iGUIElement)
{
	changeGiftTab(caller);
}
//--------------------------------------------------
// 礼物前一页
function ClickCallback_gift_pre_page_btn(caller : iGUIElement)
{
	if (mGiftPage.canMoveLeft())
	{
		refreshGiftList();
	}
}
//--------------------------------------------------
// 礼物后一页
function ClickCallback_gift_next_page_btn(caller : iGUIElement)
{
	if (mGiftPage.canMoveRight())
	{
		refreshGiftList();
	}
}
//--------------------------------------------------
// 喇叭按钮
function ClickCallback_rank_speker_btn(caller : iGUIElement)
{
	SpeakerComp.OpenSpeakerRoot();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_OPENSPEAKER_BTN));
}
//--------------------------------------------------
// 排麦按钮
function ClickCallback_rank_mic_btn(caller : iGUIElement)
{
}
//--------------------------------------------------
// 充值按钮
function ClickCallback_recharge_btn(caller : iGUIElement)
{
	DiamondLogic.GetInstance().OpenRecharge();
}
//--------------------------------------------------
// 送礼按钮
function ClickCallback_send_gift_btn(caller : iGUIElement)
{
	mGiftPage.sendGift(mGiftReceiver);
}
//--------------------------------------------------
// 数量列表
function ValueChangeCallback_num_select_list(caller : iGUIElement)
{
	mGiftPage.setSelectCount((caller as iGUIDropDownList).selectedIndex);
}
//--------------------------------------------------
// 注册事件
private function registerEvents() : void
{
	YYChannelListLogic.Ctrl.Register("CHANNEL_ADD_GUEST", addGuestAccount);
	YYChannelListLogic.Ctrl.Register("CHANNEL_DEL_GUEST", delGuestAccount);
	YYChannelListLogic.Ctrl.Register("UPDATE_PUB_PLAYER_COUNT", updatePubPlayerCount);
	YYChannelListLogic.Ctrl.Register("BROADCAST_YY_GIFT", broadcastYYGift);
	YYChannelGuestSlot.Ctrl.Register("CLICK_GUEST_SLOT", handleGiftReceiver);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_UPDATE_DIAMOND), updateMoneyDiamond);
}
//--------------------------------------------------
// 初始函数
private function init() : void
{
	// step1:
	assist_name_label1.setEnabled(false);
	assist_name_label2.setEnabled(false);
	// step2:
	setPubInfo();
	// step3:
	setGuestList();
	// step4:
	setGiftList();
	// step5:
	if (YYChannelListLogic.getInstance().isAnchor())
	{
		YYAudioLogic.CreateRoom();
		host_btn.enabled = true;
		setHostBtnState(true);
	}
	else
	{
		host_btn.enabled = false;
	}
}
//--------------------------------------------------
// 设置酒吧信息
private function setPubInfo() : void
{
	var info : pub_info = YYChannelListLogic.getInstance().getPubInfo();
	mPubInfo = info;
	// 主持人
	compere_name_label.label.text = Global.limitTextLength(info.owner_info.name, 12, "未知", "...");
	mOwnerAsynInfo.ImageElement = compere_photo_label;
	mOwnerResLoader = Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(info.owner_info.account, mOwnerAsynInfo);
	setCompereOnlineState(info.status);
	// 协管员1
	if (info.admin_list.Count >= 1)		// 至少有一个管理员
	{
		assist_name_label1.setEnabled(true);
		mAssistAsynInfo1.NameElement = assist_name_label1;
		mAssistResLoader1 = Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(info.admin_list[0].account, mAssistAsynInfo1);
	}
	// 协管员2
	if (info.admin_list.Count >= 2)		// 至少有两个管理员
	{
		assist_name_label2.setEnabled(true);
		mAssistAsynInfo2.NameElement = assist_name_label2;
		mAssistResLoader2 = Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(info.admin_list[1].account, mAssistAsynInfo2);
	}
}
//--------------------------------------------------
// 清除酒吧信息
private function clearPubInfo() : void
{
	if (mOwnerResLoader)
	{
		Global.GetPlatResLoaderMgr().Remove(mOwnerResLoader);
		mOwnerResLoader = null;
	}
	if (mAssistResLoader1)
	{
		Global.GetPlatResLoaderMgr().Remove(mAssistResLoader1);
		mAssistResLoader1 = null;
	}
	if (mAssistResLoader2)
	{
		Global.GetPlatResLoaderMgr().Remove(mAssistResLoader2);
		mAssistResLoader2 = null;
	}
}
//--------------------------------------------------
// 设置客人列表
private function setGuestList() : void
{
	for (var j:int = 0; j<GUEST_SLOT_NUM; ++j)
	{
		var elements : iGUIElement[] = getGuestControls(j);
		mGuestSlotArray.Add(new YYChannelGuestSlot(elements[0], elements[1], elements[2], elements[3], elements[4], elements[5], elements[6], elements[7], elements[8]));
	}
	mGuestCurPage = 1;
	refreshGuestPage();
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
// 添加客人
private function addGuestAccount(account : String) : void
{
	// 根据帐号判断主持人是否在线
	if (YYChannelListLogic.getInstance().isAnchor(account))
	{
		setCompereOnlineState(1);
	}
	refreshGuestPage();
}
//--------------------------------------------------
// 移除客人
private function delGuestAccount(account : String) : void
{
	// 自己被踢掉
	if (account == DataCenter.getMainPlayerAccount())
	{
		YYChannelListLogic.getInstance().closeVoiceChannelUI();
		YYGiftDisplayLogic.getInstance().clearGift2D();
		return;
	}
	// 根据帐号判断主持人是否在线
	if (YYChannelListLogic.getInstance().isAnchor(account))
	{
		setCompereOnlineState(0);
	}
	refreshGuestPage();
}
//--------------------------------------------------
// 刷新客人列表当前页
private function refreshGuestPage() : void
{
	// step1:清空
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
// 更新玩家数量
private function updatePubPlayerCount(pack : notify_update_pub_player_count) : void
{
	var side_person_count : int = pack.person_count2 - pack.person_count1;
	var total_max_count : int = pack.max_count1 + pack.max_count2;
	people_num_label1.label.text = Define.live + "： " + pack.person_count1.ToString() + "/" + pack.max_count1.ToString();
	people_num_label2.label.text = Define.side + "： " + side_person_count.ToString() + "/" + pack.max_count2.ToString();
	people_num_label3.label.text = Define.all + "： " + pack.person_count2.ToString() + "/" + total_max_count.ToString();
}
//--------------------------------------------------
// 获取客人选项
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
	if (8 == index) return [guest_item_panel9, guest_click_image9, guest_photo_label9, guest_name_label9, guest_visit_btn9, guest_follow_btn9, guest_info_btn9, guest_kick_btn9, guest_Level_label9];
	if (9 == index) return [guest_item_panel10, guest_click_image10, guest_photo_label10, guest_name_label10, guest_visit_btn10, guest_follow_btn10, guest_info_btn10, guest_kick_btn10, guest_Level_label10];
	if (10 == index) return [guest_item_panel11, guest_click_image11, guest_photo_label11, guest_name_label11, guest_visit_btn11, guest_follow_btn11, guest_info_btn11, guest_kick_btn11, guest_Level_label11];
	// 11 == index
	return [guest_item_panel12, guest_click_image12, guest_photo_label12, guest_name_label12, guest_visit_btn12, guest_follow_btn12, guest_info_btn12, guest_kick_btn12, guest_Level_label12];
}
//--------------------------------------------------
// 设置主持按钮状态
private function setHostBtnState(start : boolean) : void
{
	host_btn.userData = start;
	var normal : String = start ? "star_live_n" : "end_live_n";
	var hover : String = start ? "star_live_h" : "end_live_h";
	var dir : String = "YYChanne/";
	UI.SetButtonState(host_btn, dir + normal, dir + hover, dir + normal);
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
// 设置主持人在线状态
private function setCompereOnlineState(status : int) : void
{
	var bg : String = 0 == status ? "offline" : "online";
	compere_online_label.style.normal.background = Resources.Load("UISkins/Textures/YYChanne/" + bg);
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
// 设置礼物列表
private function setGiftList() : void
{
	mGiftPage.init();
	var select_frame : SelectFrame = new SelectFrame(root, 64, 64, 5, "UISkins/Textures/YYChanne/kuan");
	for (var i:int = 0; i<GIFT_SLOT_NUM; ++i)
	{
		mGiftSlotArray.Add(new YYChannelGiftSlot(i, getGiftControls(i), select_frame, mGiftPage));
	}
	changeGiftTab(gift_tab_btn1);
	balance_label.label.text = DataCenter.GetPlayerDiamond().ToString();
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
// 设置收礼人信息
private function handleGiftReceiver(info : pub_account_info) : void
{
	mGiftReceiver = info.account;
	gift_reciver_label.label.text = Global.limitTextLength(info.name, 6, Define.unknow, "...");
}
//--------------------------------------------------
// 更新第二货币
private function updateMoneyDiamond(evt:GameEvent, obj:System.Object) : void
{
	var diamond : int = obj;
	balance_label.label.text = diamond.ToString();
}
//--------------------------------------------------
public function getChannelSystomBoardLabel() : iGUILabel{
	return system_board_label;
}

