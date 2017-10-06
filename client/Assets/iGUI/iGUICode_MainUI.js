import iGUI;

private static var instance : iGUICode_MainUI;
private var is_in_self_home : boolean = true;
private var is_leave_mainui : boolean = false;

function Awake(){
	instance=this;
	RegistEventMsg();
}

function RegistEventMsg() {
	//EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_PARTY_SCORE_COIN), HandleNotifyPartyScoreCoin);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.GET_FIRSTPAYMENT_REWARD), HandleAfterGetFirstPaymentReward);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_FIRST_PAYMENT_STATUS), HandleNotifyFirstPaymentStatus);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CANT_REWARD), HandleCantReward);			
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_CAN_REWARD), HandleNotifyCanReward);		
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.LEAVE_MAINUI), HandleLeaveMainUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.HIDE_FUNC_BTNS), HandleHideFuncBtns);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.ENABLEWATERPP_TIMECOMPLETE), HandleEnablePp_TimerComplete);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.DISABLEWATERPP_TIMECOMPLETE), HandleDisablePp_TimerComplete);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.ENABLEWATERPP_ONTIMER), HandleEnablePp_OnTimer);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.PHYPOWER_TOMAX), HandlePhyPower_toMax);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.RESTORE_TIMEUP), HandleUpdateRestoreTmUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.UPDATE_HP), HandleUpdateHpUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.UPDATE_LV_EXP), HandleUpdateLvExpUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOUSE_CREATED), HandleNotifyHouseCreated);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_SELF_HOUSE), HandleEnterSelfHouse);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_FRIEND_HOUSE), HandleEnterFriendHouse);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_COMMON_SCENE), HandleEnterCommonScene);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LEAVE_SCENE), HandleLeaveScene);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_UPDATE_OWNER_INFO), HandleUpdateOwnerInfo);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_UPDATE_LOVER_INFO), HandleUpdateLoverInfo);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_CLICK_PLAYER), HandleNotifyAssistEnable);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LOGON_AWARD_ENTRANCE), HandleNotifyLogonEnteranceEnable);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_USE_PROP_INIT_UI), NotifyPropUseStart);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_USE_PROP_END), NotifyPropUseEnd);
//	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_TRANSFORM_REFRESH_REMAIN_TIME), HandleNotifyRefreshTransform);
//	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLANT_SPEED_INIT_UI), NotifyPlantSpeedStart);
//	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLANT_SPEED_END), NotifyPlantSpeedEnd);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLANT_SPEED_REMAIN_TIME), HandleNotifyRefreshPlantSpeed);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENABLE_CANCEL_USE_PROP), HandleNotifyBtnCancelUsePropEnable);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REMEDY_BUTTON_ENABLE_UI), HandleNotifyRemedyEnable);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_UPDATE_DIAMOND), HandleNotifyUpdateMoneyDiamond);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_UPDATE_CREDIT), HandleNotifyPartyScoreCoin);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.COMPLETE_MAKE_ONE_PRODUCT), HandleNotifyCompleteMakeOneProduct);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.COMPLITE_MAKE_FOOD_TIP_TIMER), HandleCompleteMakeFoodTipTimerEnd);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.REFRESH_BUFF_ICON), HandleRefreshBuffIcon);
}
static function getInstance(){
	return instance;
}

@HideInInspector
var refreshCharmBtn : iGUIButton;
@HideInInspector
var buyTheDrinkBtn : iGUIButton;
@HideInInspector
var STP_down_btn1 : iGUIButton;
@HideInInspector
var STP_up_btn1 : iGUIButton;
@HideInInspector
var STP_task_btn3 : iGUIButton;
@HideInInspector
var STP_task_btn2 : iGUIButton;
@HideInInspector
var STP_task_btn1 : iGUIButton;
@HideInInspector
var SeriesTaskPanel : iGUIPanel;
@HideInInspector
var runSwitchBtn : iGUIButton;
@HideInInspector
var completeFoodLbl : iGUILabel;
@HideInInspector
var completeFoodImg : iGUIImage;
@HideInInspector
var completeMakeFoodTipPanel : iGUIPanel;
@HideInInspector
var SAPCurSellPrice : iGUILabel;
@HideInInspector
var SAPTotalSellPrice : iGUILabel;
@HideInInspector
var SettleAccountPanel : iGUIPanel;
@HideInInspector
var SPProgressLabel : iGUILabel;
@HideInInspector
var SPProgress : iGUILabel;
@HideInInspector
var SPProgressPanel : iGUIPanel;
@HideInInspector
var SPSpriteIcon : iGUIImage;
@HideInInspector
var SPSpriteName : iGUILabel;
@HideInInspector
var SummonPanel : iGUIPanel;
@HideInInspector
var addPhyPowerBtn : iGUIButton;
@HideInInspector
var jiFentaskTipPP : iGUILabel;
@HideInInspector
var exchangBtn : iGUIButton;
@HideInInspector
var makeFoodBtn : iGUIButton;
@HideInInspector
var changeWaiterBtn : iGUIButton;
@HideInInspector
var TestAudio : iGUIPanel;
@HideInInspector
var TestAudio1 : iGUIButton;
@HideInInspector
var TestAudio2 : iGUIButton;
@HideInInspector
var TestAudio3 : iGUIButton;
@HideInInspector
var TestAudio4 : iGUIButton;
@HideInInspector
var TestAudio5 : iGUIButton;
@HideInInspector
var PartyScoreCoinbg : iGUIButton;
@HideInInspector
var PartyScoreCoin_text : iGUILabel;
@HideInInspector
var PanMoneyDiamond : iGUIPanel;
@HideInInspector
var PartyScoreCoin : iGUIPanel;
@HideInInspector
var BtnDiamondRecharge : iGUIButton;
@HideInInspector
var SocialPlantPP : iGUILabel;
@HideInInspector
var BtnRemedy : iGUIButton;
@HideInInspector
var yy_invite_btn : iGUIButton;
@HideInInspector
var BtnCancelUseProp : iGUIButton;
@HideInInspector
var AccumulatePayBtn : iGUIButton;
@HideInInspector
var SinglePayBtn : iGUIButton;
@HideInInspector
var firstPayBtn : iGUIButton;
@HideInInspector
var cmp_visit_btn : iGUIButton;
@HideInInspector
var cmp_priavte_chat_btn : iGUIButton;
@HideInInspector
var cmp_attention_btn : iGUIButton;
@HideInInspector
var chat_menu_panel : iGUIPanel;
@HideInInspector
var cancelPrivateChat : iGUIButton;
@HideInInspector
var BtnOpenHttp : iGUIButton;
@HideInInspector
var chuangguan_btn : iGUIButton;
@HideInInspector
var ChainTaskTipPP2 : iGUIImage;
@HideInInspector
var ChainTaskTipPP1 : iGUIImage;
@HideInInspector
var BtnChainTask : iGUIButton;
@HideInInspector
var active_award_btn : iGUIButton;
@HideInInspector
var UpDownStairsBtn : iGUIButton;
@HideInInspector
var BtnLottery : iGUIButton;
@HideInInspector
var private_to_name : iGUILabel;
@HideInInspector
var inputBoxParent : iGUIPanel;
@HideInInspector
var BtnPlantHelp : iGUIButton;
@HideInInspector
var collecting_state : iGUIImage;
@HideInInspector
var BtnRankList : iGUIButton;
@HideInInspector
var collect_btn : iGUIButton;
@HideInInspector
var itemsmake_btn : iGUIButton;
@HideInInspector
var noCompletedtaskTipPP : iGUILabel;
@HideInInspector
var roofBtn : iGUIButton;
@HideInInspector
var size_chatbox_btn : iGUIButton;
@HideInInspector
var BtnLogonAward : iGUIButton;
@HideInInspector
var BtnFriendInvite : iGUIButton;
@HideInInspector
var Messageflashpp : iGUIImage;
@HideInInspector
var PartyExpBuffTime : iGUILabel;
@HideInInspector
var PartyExpBuffIcon : iGUIImage;
@HideInInspector
var LabBuffTime : iGUILabel;
@HideInInspector
var ImgBuffIcon : iGUIImage;
@HideInInspector
var LabPlantBuffTime : iGUILabel;
@HideInInspector
var ImgPlantBuffIcon : iGUIImage;
@HideInInspector
var BtnQQHomeNewer : iGUIButton;
@HideInInspector
var BtnQQHomeDaily : iGUIButton;
@HideInInspector
var BtnQQHomeGot : iGUIButton;
@HideInInspector
var DailyTaskBtn : iGUIButton;
@HideInInspector
var TaskBtn1 : iGUIButton;
@HideInInspector
var TaskBtn2 : iGUIButton;
@HideInInspector
var TaskBtn3 : iGUIButton;
@HideInInspector
var TaskBtn4 : iGUIButton;
@HideInInspector
var speakerBtn : iGUIButton;
@HideInInspector
var BtnPropShop : iGUIButton;
@HideInInspector
var taskTipPP : iGUILabel;
@HideInInspector
var wishTipPP : iGUILabel;
@HideInInspector
var TipPPNote : iGUILabel;
@HideInInspector
var TipPPMessage : iGUILabel;
@HideInInspector
var BtnVote : iGUIButton;
@HideInInspector
var dress_btn : iGUIButton;
@HideInInspector
var fitment_btn : iGUIButton;
@HideInInspector
var house_btn : iGUIButton;
@HideInInspector
var wishing_btn : iGUIButton;
@HideInInspector
var phypowerfenge : iGUILabel;
@HideInInspector
var maxPhyPower_text : iGUILabel;
@HideInInspector
var curPhyPower_text : iGUILabel;
@HideInInspector
var lv_maskpanel : iGUIPanel;
@HideInInspector
var ep_maskpanel : iGUIPanel;
@HideInInspector
var exp_progressbar_fill : iGUILabel;
@HideInInspector
var exp_progressbar_empty : iGUIContainer;
@HideInInspector
var phypow_progressbar_fill : iGUILabel;
@HideInInspector
var phypow_progressbar_empty : iGUIContainer;
@HideInInspector
var restoreTm : iGUILabel;
@HideInInspector
var power_text_container : iGUIContainer;
@HideInInspector
var power : iGUIPanel;
@HideInInspector
var crystal_text : iGUILabel;
@HideInInspector
var crystal : iGUIPanel;
@HideInInspector
var chatflashpp : iGUIImage;
@HideInInspector
var waterTipPP : iGUILabel;
@HideInInspector
var taskTipPP_Newhand : iGUILabel;
@HideInInspector
var noCompletedtaskTipPP_Newhand : iGUILabel;
@HideInInspector
var disableDlgBtn : iGUIButton;
@HideInInspector
var enableDlgBtn : iGUIButton;
@HideInInspector
var fullWallBtn : iGUIButton;
@HideInInspector
var nowallBtn : iGUIButton;
@HideInInspector
var houseNameMdWinIcon : iGUIImage;
@HideInInspector
var houseNameLenLtdTxt : iGUILabel;
@HideInInspector
var houseNameModifyWinTitle : iGUILabel;
@HideInInspector
var closeModifyHousenameBtn : iGUIButton;
@HideInInspector
var submitModifyHnBtn : iGUIButton;
@HideInInspector
var modifyHousenameEditor : iGUITextfield;
@HideInInspector
var modifyHousenameWin : iGUIPanel;
@HideInInspector
var HouseName : iGUIButton;
@HideInInspector
var BtnGift : iGUIButton;
@HideInInspector
var halfWallBtn : iGUIButton;
@HideInInspector
var headportrait : iGUILabel;
@HideInInspector
var male_qqhome : iGUIButton;
@HideInInspector
var male_qqhomeYear : iGUIButton;
@HideInInspector
var female_qqhome : iGUIButton;
@HideInInspector
var female_qqhomeYear : iGUIButton;
@HideInInspector
var NoticeBtn : iGUIButton;
@HideInInspector
var OutputListbox : iGUIListBox;
@HideInInspector
var OutputContainer : iGUIContainer;
@HideInInspector
var DlgContainer : iGUIContainer;
@HideInInspector
var InputContainer : iGUIPanel;
@HideInInspector
var SendBtn : iGUIButton;
@HideInInspector
var InputBox : iGUITextfield;
@HideInInspector
var ExpressionBtn : iGUIButton;
@HideInInspector
var OutputListboxBg : iGUIPanel;
@HideInInspector
var flower : iGUIImage;
@HideInInspector
var describe : iGUIPanel;
@HideInInspector
var old_anniversary_btn : iGUIButton;
@HideInInspector
var old_anniversary : iGUIPanel;
@HideInInspector
var diamond_text2 : iGUILabel;
@HideInInspector
var MoneyDiamond : iGUIButton;
@HideInInspector
var MD_text : iGUILabel;
@HideInInspector
var diamond2 : iGUIPanel;
@HideInInspector
var diamond_text : iGUILabel;
@HideInInspector
var diamond : iGUIPanel;
@HideInInspector
var level_text : iGUILabel;
@HideInInspector
var level_image : iGUILabel;
@HideInInspector
var level : iGUIPanel;
@HideInInspector
var new_anniversary : iGUIButton;
@HideInInspector
var upgrade_btn : iGUIButton;
@HideInInspector
var party_btn : iGUIButton;
@HideInInspector
var datum_btn : iGUIButton;
@HideInInspector
var home_btn : iGUIButton;
@HideInInspector
var bar_btn : iGUIButton;
@HideInInspector
var setting_btn : iGUIButton;
@HideInInspector
var ourdoor_btn : iGUIButton;
@HideInInspector
var record_btn : iGUIButton;
@HideInInspector
var goods_btn : iGUIButton;
@HideInInspector
var gift_btn : iGUIButton;
@HideInInspector
var love_btn : iGUIButton;
@HideInInspector
var social_btn : iGUIButton;
@HideInInspector
var marry_btn : iGUIButton;
@HideInInspector
var action_btn : iGUIButton;
@HideInInspector
var photofriend_btn : iGUIButton;
@HideInInspector
var function_button_list : iGUIContainer;
@HideInInspector
var female_name : iGUILabel;
@HideInInspector
var female_photo : iGUIImage;
@HideInInspector
var female : iGUIContainer;
@HideInInspector
var male_name : iGUILabel;
@HideInInspector
var male_photo : iGUIImage;
@HideInInspector
var male : iGUIContainer;
@HideInInspector
var root : iGUIRoot;
@HideInInspector
var LoveDay_day : iGUIDropDownList;
@HideInInspector
var LoveDay_month : iGUIDropDownList;
@HideInInspector
var LoveDay_year : iGUIDropDownList;
@HideInInspector
var LoveDay_win : iGUIPanel;
@HideInInspector
var LoveDay_image : iGUIImage;
@HideInInspector
var LoveDay_close : iGUIButton;
@HideInInspector
var LoveDay_label : iGUILabel;
@HideInInspector
var LoveDay_commit : iGUIButton;
@HideInInspector
var CDV_HouseName : iGUILabel;
@HideInInspector
var CommemorationDayView_scrollview : iGUIScrollView;
@HideInInspector
var CommemorationDayView_close : iGUIButton;
@HideInInspector
var CommemorationDayView_new : iGUIButton;
@HideInInspector
var CommemorationDayView_image : iGUIImage;
@HideInInspector
var CommemorationDayView_panel : iGUIPanel;
@HideInInspector
var CommemorationDayView_lastpage : iGUIButton;
@HideInInspector
var CommemorationDayView_nextpage : iGUIButton;
@HideInInspector
var CommemorationDayView_pages : iGUILabel;
@HideInInspector
var CommemorationDayModify_save : iGUIButton;
@HideInInspector
var CommemorationDayModify_label : iGUILabel;
@HideInInspector
var CommemorationDayModify_lock : iGUICheckboxGroup;
@HideInInspector
var CommemorationDayModify_day : iGUIDropDownList;
@HideInInspector
var CommemorationDayModify_month : iGUIDropDownList;
@HideInInspector
var CommemorationDayModify_year : iGUIDropDownList;
@HideInInspector
var CommemorationDayModify_close : iGUIButton;
@HideInInspector
var CommemorationDayModify_title : iGUILabel;
@HideInInspector
var CommemorationDayModify_panel : iGUIPanel;
@HideInInspector
var CommemorationDayModify_log : iGUITextarea;
@HideInInspector
var CommemorationDayModify_Words : iGUILabel;
@HideInInspector
var CommemorationDayModify_WordsLimit : iGUILabel;

@HideInInspector
var buffList : iGUIPanel;
@HideInInspector
var buff1 : iGUIButton;
@HideInInspector
var buff2 : iGUIButton;
@HideInInspector
var buff3 : iGUIButton;
@HideInInspector
var buff4 : iGUIButton;
@HideInInspector
var buff5 : iGUIButton;
@HideInInspector
var buff6 : iGUIButton;
@HideInInspector
var buff7 : iGUIButton;

private static var houseNameLengthLtd:int = 11;
private static var DlgContainer_visible = true;
public static var MainUICtrl : Controller = new Controller();


// alter by zlj 刷新魅力时间的CD时间和定时器
private var mCdTime : int   = 10;
private var mTimer  : Timer = null;

//--
function Start()
{
	RegisterCallbacks();
	YYInviteBtnAvailable();
	iGUICode_NoticeRoot.OpenNoticeRoot();
	BubbleTipMgr.GetInstance().Init();
	if(PlatformMgr.IsPlatYY()){
		bar_btn.setEnabled(true);
		BtnDiamondRecharge.setEnabled(true);
	}
	else{
		bar_btn.setEnabled(false);
		BtnDiamondRecharge.setEnabled(true);
	}
	TaskBtn1.setEnabled(false);
	TaskBtn2.setEnabled(false);
	TaskBtn3.setEnabled(false);
	TaskBtn4.setEnabled(false);
	buyTheDrinkBtn.setEnabled(false);  // alter by zlj 派对请喝酒按钮 
	
	if(PlatformMgr.IsPlatYY()) {
		BtnQQHomeNewer.setEnabled(false);
		BtnFriendInvite.setEnabled(false);
		photofriend_btn.setEnabled(true);
		BtnVote.setEnabled(false);
	} else {
		BtnQQHomeNewer.setEnabled(true);
		BtnFriendInvite.setEnabled(true);
		photofriend_btn.setEnabled(true);
		BtnVote.setEnabled(false);
	}
	BtnChainTask.setEnabled(false);
	initChatModule();
	playTaskPp();
}

function playTaskPp(){
	if(!PaoPaoControl.GetPpCtrol(iGUICode_MainUI.getInstance().jiFentaskTipPP))
		new PaoPaoControl(120000,0,3000,1,iGUICode_MainUI.getInstance().jiFentaskTipPP, iGUICode_MainUI.getInstance().active_award_btn);
	if(!PaoPaoControl.GetPpCtrol(iGUICode_MainUI.getInstance().taskTipPP))
		new PaoPaoControl(180000,0,3000,1,iGUICode_MainUI.getInstance().taskTipPP, iGUICode_MainUI.getInstance().DailyTaskBtn);
}

//--
function HandleLeaveMainUI(evt : GameEvent, obj : Object){
	var f : boolean = Convert.ToBoolean(obj);
	is_leave_mainui = f;
}
//--
function RegisterCallbacks()
{
	runSwitchBtn.clickCallback = ClickCallback_runSwitchBtn;
	addPhyPowerBtn.clickCallback = ClickCallback_addPhyPowerBtn;
	exchangBtn.clickCallback = ClickCallback_exchangBtn;
	makeFoodBtn.clickCallback = clickCallback_makeFoodBtn;
	changeWaiterBtn.clickCallback = clickCallback_changeWaiterBtn;
	firstPayBtn.clickCallback = ClickCallback_firstPayBtn;
	chuangguan_btn.clickCallback = Clickcallback_chuangguan_btn;
	active_award_btn.clickCallback = ClickCallback_active_award_btn;
	collecting_state.clickCallback = ClickCallback_collecting_state;
	MoneyDiamond.clickCallback = MouseClickCallback_MoneyDiamond;
	BtnRankList.clickCallback = System.Delegate.Combine(BtnRankList.clickCallback,ClickCallback_BtnRankList as iGUIEventCallback);
	collect_btn.clickCallback = ClickCallback_collect_btn;
	DailyTaskBtn.clickCallback = ClickCallback_DailyTaskBtn;
	TaskBtn1.clickCallback = ClickCallback_TaskBtn1;
	TaskBtn2.clickCallback = ClickCallback_TaskBtn2;
	TaskBtn3.clickCallback = ClickCallback_TaskBtn3;
	TaskBtn4.clickCallback = ClickCallback_TaskBtn4;
	speakerBtn.clickCallback = ClickCallback_speaker_btn;
	BtnPropShop.clickCallback = System.Delegate.Combine(BtnPropShop.clickCallback, ClickCallbackBtnPropShop as iGUIEventCallback);
	wishing_btn.clickCallback = ClickCallback_wishing_btn;
	level.mouseOverCallback = MouseOverCallback_level;
	power.mouseOverCallback = MouseOverCallback_power;
	crystal.mouseOverCallback = MouseOverCallback_crystal;
	PanMoneyDiamond.mouseOverCallback = MouseOverCallback_PanMoneyDiamond;
	PartyScoreCoin.mouseOverCallback = MouseOverCallback_PartyScoreCoin;
	diamond.mouseOverCallback = MouseOverCallback_diamond;
	diamond2.mouseOverCallback = MouseOverCallback_diamond2;
	enableDlgBtn.clickCallback = ClickCallback_enableDlgBtn;
	disableDlgBtn.clickCallback = ClickCallback_disableDlgBtn;
	modifyHousenameEditor.valueChangeCallback = ValueChangeCallback_modifyHousenameEditor;
	closeModifyHousenameBtn.clickCallback = ClickCallback_closeModifyHousenameBtn;
	submitModifyHnBtn.clickCallback = ClickCallback_submitModifyHnBtn;
	HouseName.clickCallback = ClickCallback_houseName;
	photofriend_btn.clickCallback = ClickCallback_photofriend_btn;
	action_btn.clickCallback = ClickCallback_action_btn;
	action_btn.clickCallback = System.Delegate.Combine(action_btn.clickCallback,HandleClickIntoNewGuideCallback as iGUIEventCallback);
	marry_btn.clickCallback = ClickCallback_marry_btn;
	marry_btn.clickCallback = System.Delegate.Combine(marry_btn.clickCallback,HandleClickIntoNewGuideCallback as iGUIEventCallback);
	love_btn.clickCallback = ClickCallback_love_btn;
	love_btn.clickCallback = System.Delegate.Combine(love_btn.clickCallback,HandleClickIntoNewGuideCallback as iGUIEventCallback);
	gift_btn.clickCallback = ClickCallback_gift_btn;
	social_btn.clickCallback = ClickCallbackSocial;
	goods_btn.clickCallback = ClickCallback_goods_btn;
	goods_btn.clickCallback = System.Delegate.Combine(goods_btn.clickCallback,HandleClickIntoNewGuideCallback as iGUIEventCallback);
	record_btn.clickCallback = ClickCallback_record_btn;
	record_btn.clickCallback = System.Delegate.Combine(record_btn.clickCallback,HandleClickIntoNewGuideCallback as iGUIEventCallback);
	setting_btn.clickCallback = ClickCallback_setting_btn;
	ourdoor_btn.clickCallback = ClickCallback_ourdoor_btn;
	home_btn.clickCallback = ClickCallback_home_btn;
	bar_btn.clickCallback = ClickCallback_bar_btn;
	party_btn.clickCallback = ClickCallback_party_btn;
	datum_btn.clickCallback = ClickCallback_datum_btn;
	upgrade_btn.clickCallback = ClickCallback_upgrade_btn;

	new_anniversary.clickCallback = System.Delegate.Combine(new_anniversary.clickCallback,HandleClickIntoNewGuideCallback as iGUIEventCallback);
	old_anniversary_btn.clickCallback = System.Delegate.Combine(old_anniversary_btn.clickCallback,HandleClickIntoNewGuideCallback as iGUIEventCallback);
	flower.clickCallback = ClickCallback_flower;
	BtnGift.clickCallback = ClickCallback_gift;
	halfWallBtn.clickCallback = ClickCallback_changeWatchMode;
	nowallBtn.clickCallback = ClickCallback_changeWatchMode;
	fullWallBtn.clickCallback = ClickCallback_changeWatchMode;
	roofBtn.clickCallback = ClickCallback_changeWatchMode;
	BtnVote.clickCallback = ClickCallback_Vote;
	dress_btn.clickCallback = ClickCallbackDress;
	fitment_btn.clickCallback = ClickCallbackFitment;
	house_btn.clickCallback = ClickCallbackHouse;
	itemsmake_btn.clickCallback = ClickCallbackItemsMake;

	BtnQQHomeNewer.clickCallback = ClickCallback_qqhome;
	BtnQQHomeDaily.clickCallback = ClickCallback_qqhome;
	BtnQQHomeGot.clickCallback = ClickCallback_qqhome;

	BtnFriendInvite.clickCallback = ClickCallback_friendInvite;
	BtnLogonAward.clickCallback = ClickCallback_logonAward;

	male_qqhome.clickCallback = ClickCallback_qqhomePrivilege;
	male_qqhomeYear.clickCallback = ClickCallback_qqhomePrivilege;
	female_qqhome.clickCallback = ClickCallback_qqhomePrivilege;
	female_qqhomeYear.clickCallback = ClickCallback_qqhomePrivilege;

	BtnPlantHelp.clickCallback = ClickCallback_plantHelp;

	BtnLottery.clickCallback = ClickCallback_Lottery;
	UpDownStairsBtn.clickCallback = ClickCallback_UpDownStairsBtn;
	BtnChainTask.clickCallback = ClickCallback_BtnChainTask;
	
	BtnOpenHttp.clickCallback = ClickCallback_OpenHttp;
	SinglePayBtn.clickCallback = ClickCallback_SinglePayBtn;
	AccumulatePayBtn.clickCallback = ClickCallback_AccumulatePayBtn;
	BtnCancelUseProp.clickCallback = ClickCallback_BtnCancelUseProp;
	BtnRemedy.clickCallback = ClickCallbackRemedy;
	BtnDiamondRecharge.clickCallback = ClickCallbackDiamondRecharge;
	
	//TEMP fullzhu
	TestAudio1.clickCallback = ClickTestAudio1;
	TestAudio2.clickCallback = ClickTestAudio2;
	TestAudio3.clickCallback = ClickTestAudio3;
	TestAudio4.clickCallback = ClickTestAudio4;
	TestAudio5.clickCallback = ClickTestAudio5;
	
	//BUFF 
	buff1.clickCallback = clickCallback_buffButton;
	buff2.clickCallback = clickCallback_buffButton;
	buff3.clickCallback = clickCallback_buffButton;
	buff4.clickCallback = clickCallback_buffButton;
	buff5.clickCallback = clickCallback_buffButton;
	buff6.clickCallback = clickCallback_buffButton;
	buff7.clickCallback = clickCallback_buffButton;
	buff1.mouseOverCallback = mouseOverCallback_buffButton;
	buff2.mouseOverCallback = mouseOverCallback_buffButton;
	buff3.mouseOverCallback = mouseOverCallback_buffButton;
	buff4.mouseOverCallback = mouseOverCallback_buffButton;
	buff5.mouseOverCallback = mouseOverCallback_buffButton;
	buff6.mouseOverCallback = mouseOverCallback_buffButton;
	buff7.mouseOverCallback = mouseOverCallback_buffButton;
	
	// alter by zlj 派对请喝酒按钮
	buyTheDrinkBtn.clickCallback  = ClickCallback_buyTheDrinkBtn;
	// 刷新人物魅力值
	refreshCharmBtn.clickCallback = ClickCallback_refreshCharmBtn;
}
//--
function ClickCallback_male_photo(caller : iGUIElement)
{
	Global.GetSysMsgHandler().ShowSysMsg(242);
}
//--
function ClickCallback_female_photo(caller : iGUIElement)
{
	Global.GetSysMsgHandler().ShowSysMsg(242);
}
//--
function ClickCallback_photofriend_btn(caller : iGUIElement)
{
	PhotoFriend.getInstance().clickPhotoFriend();
}
//--
public static function OpenDressUI(){
	UI.getUI().OpenUIRoot("DressUI");
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_ENABLE),true);
}
//--
function ClickCallback_decorate_btn_impl()
{
	UI.getUI().OpenUIRoot("StorageBoxUI");
	iGUICode_StorageBoxUI.getInstance().enterFitment();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.ENTER_FITMENT_UI));
}
//--
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
//--
function ClickCallback_marry_btn(caller : iGUIElement)
{
}
//--
function ClickCallback_love_btn(caller : iGUIElement)
{
	UI.getUI().OpenUIRoot("CheckinUI");
	UI.getUI().SetModal("CheckinUI", true);
	iGUICode_CheckinUI.getInstance().ActiveMain(true);
	iGUICode_CheckinUI.getInstance().ActiveSmart(false);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_OPENLOVENOTE_BTN));
}
//--
function ClickCallbackSocial(caller : iGUIElement) {
	UI.getUI().OpenUIRoot("SocialUI");
	iGUICode_SocialUI.getInstance().Enable(true);
	// 隐藏派对功能界面
	if (UI.getUI().isUIRootOpen("PartyFunctionUI"))
	{
		iGUICode_PartyFunctionUI.getInstance().setEnableBtnState(false);
	}
}
//--
function ClickCallback_gift_btn(caller : iGUIElement)
{
	if(EQGameSceneMgr.getSingleton().gameSceneType() == SceneType.COMM_SCENE)
		return;

	GiftLogic.Ctrl.Excute("click_gift_btn", null);
}
//--
function ClickCallback_goods_btn(caller : iGUIElement)
{
	if (caller.userData == true)
	{
		UI.getUI().OpenUIRoot("StorageBoxUI");
		iGUICode_StorageBoxUI.getInstance().enterStorage();
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_GOODS_BTN));
	}
}
//--
function ClickCallback_record_btn(caller : iGUIElement)
{
	if(EQGameSceneMgr.getSingleton().gameSceneType() == SceneType.COMM_SCENE)
		return;

	UI.getUI().OpenUIRoot("MessageUI");
	iGUICode_MessageUI.getInstance().Active(true);

	MessageMgr.GetInstance().SetNewMessageStatue(false);
	SetMessageBtnFlash(false);
}
//--
function ClickCallback_setting_btn(caller : iGUIElement)
{
	var x : float = caller.positionAndSize.x;
	var y : float = caller.getTargetContainer().positionAndSize.y - 10;
	iGUICode_SettingPanelUI.openSettingPanel(x, y, false);
}
//--
function ClickCallback_ourdoor_btn(caller : iGUIElement)
{
    CommSceneLogic.getInstance().openUI();
}
//--
function ClickCallback_home_btn(caller : iGUIElement)
{
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_RETURN_HOUSE));
}
//--
function ClickCallback_bar_btn(caller : iGUIElement)
{
	if (YYChannelListLogic.getInstance().isVoiceChannelUIMinimize())
	{
		YYChannelListLogic.getInstance().maximizeVoiceChannelUI();
	}
	else
	{
		YYChannelListLogic.getInstance().initChannelList();
	}
}
//--
function ClickCallback_party_btn(caller : iGUIElement)
{
	Party.Ctrl.Excute("OPEN_PARTY_UI", true);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_PARTY_BTN));
}
//--
function ClickCallback_datum_btn(caller : iGUIElement)
{
	if(EQGameSceneMgr.getSingleton().gameSceneType() == SceneType.COMM_SCENE)
		return;

	PersonalInfo.getInstance().clickPersonalInfo();
}
//--
function ClickCallback_upgrade_btn(caller : iGUIElement)
{
	ItemUpgradeLogic.GetInstance().oneKeyUpgrageFurs();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_UPGRADE_BTN));
}
//--
function ClickCallback_flower(caller : iGUIElement)
{
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.REQUEST_GET_FLOWER));
}
//--
function ClickCallback_gift(caller : iGUIElement) {
	caller.setEnabled(false);
	UI.getUI().OpenUIRoot("GiftUI");
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_GIFT_ACTIVE),true);
}
//--
function ClickCallback_Lottery(caller : iGUIElement) {
	HolidayLogic.GetInstance().Open();
}
//--
function ClickCallbackBtnPropShop(caller : iGUIElement)
{
	PropShopLogic.Ctrl.Excute("open_prop_shop_ui", 0);
}
//--
function ClickCallback_UpDownStairsBtn(caller : iGUIElement)
{
	UpDownStair.getInstance().changeUpDownStairs();
//	FitmentLogic.getInstance().setCameraPos();
}
//--
function ClickCallback_BtnChainTask(caller : iGUIElement)
{
	ChainTaskLogic.getInstance().openChainTaskUI();
}
//--
function ClickCallback_OpenHttp(caller : iGUIElement) {
	ExternalFlatform.gotoVideo();
}
//--
public function setUpDownStairsBtnStatus(visible : boolean, floor_num : int) : void
{
	UpDownStairsBtn.setEnabled(visible);
	if (false == visible)
		return;
	
	// 1 == floor_num, 默认当前楼下
	var normal : String = "louxia";
	var hover : String = "louxia_hover";
	if (2 == floor_num)		// 当前楼上
	{
		normal = "loushang";
		hover = "loushang_hover";
	}
	var dir : String = "MainUI/";
	UI.SetButtonState(UpDownStairsBtn, dir+normal, dir+hover, dir+normal);
}
//--等级
function MouseOverCallback_level(caller : iGUIElement){
	var style : GUIStyle = new GUIStyle();
	style.normal.textColor = Color.white;
	style.fontStyle = FontStyle.Bold;
	Global.SysTooltip.Begin(caller);
	Global.SysTooltip.Add(GUIContent(caller.userData as String),style);
	Global.SysTooltip.Show(true);
}
//--体力值
function MouseOverCallback_power(caller : iGUIElement) {
	var style : GUIStyle = new GUIStyle();
	style.normal.textColor = Color.white;
	style.fontStyle = FontStyle.Bold;
	Global.GetSysTooltip().Begin(caller);
	Global.GetSysTooltip().Add(GUIContent(Define.getContent(5155)), style);
	Global.GetSysTooltip().Add(GUIContent(Define.getContent(5156)), style);
	Global.GetSysTooltip().Add(GUIContent(Define.getContent(5157)), style);
	Global.GetSysTooltip().Show(true);
}
//--水晶
function MouseOverCallback_crystal(caller : iGUIElement) {
	var style : GUIStyle = new GUIStyle();
	style.normal.textColor = Color.white;
	style.fontStyle = FontStyle.Bold;
	Global.GetSysTooltip().Begin(caller);
	Global.GetSysTooltip().Add(GUIContent(Define.getContent(5158)), style);
	Global.GetSysTooltip().Add(GUIContent(Define.getContent(5159)), style);
	Global.GetSysTooltip().Show(true);
}
//--恋爱币
function MouseOverCallback_PanMoneyDiamond(caller : iGUIElement) {
	var style : GUIStyle = new GUIStyle();
	style.normal.textColor = Color.white;
	style.fontStyle = FontStyle.Bold;
	Global.GetSysTooltip().Begin(caller);
	Global.GetSysTooltip().Add(GUIContent(Define.getContent(5160)), style);
	Global.GetSysTooltip().Add(GUIContent(Define.getContent(5161)), style);
	Global.GetSysTooltip().Add(GUIContent(Define.getContent(5162)), style);
	Global.GetSysTooltip().Show(true);
}
//--积分
function MouseOverCallback_PartyScoreCoin(caller : iGUIElement) {
	var style : GUIStyle = new GUIStyle();
	style.normal.textColor = Color.white;
	style.fontStyle = FontStyle.Bold;
	Global.GetSysTooltip().Begin(caller);
	Global.GetSysTooltip().Add(GUIContent(Define.getContent(5163)), style);
	Global.GetSysTooltip().Add(GUIContent(Define.getContent(5164)), style);
	Global.GetSysTooltip().Show(true);
}
//--魅力值
function MouseOverCallback_diamond(caller : iGUIElement){
	var style : GUIStyle = new GUIStyle();
	style.normal.textColor = Color.white;
	style.fontStyle = FontStyle.Bold;
	Global.GetSysTooltip().Begin(caller);
	Global.GetSysTooltip().Add(GUIContent(Define.getContent(5165)), style);
	Global.GetSysTooltip().Add(GUIContent(Define.getContent(5166)), style);
	Global.GetSysTooltip().Add(GUIContent(Define.getContent(5218)), style);
	Global.GetSysTooltip().Show(true);
}
//--豪华度
function MouseOverCallback_diamond2(caller : iGUIElement){
	var style : GUIStyle = new GUIStyle();
	style.normal.textColor = Color.white;
	style.fontStyle = FontStyle.Bold;
	Global.GetSysTooltip().Begin(caller);
	if(BuffLogic.isExistDecorateCard() && DataCenter.isInSelfHouse())	// 有豪华卡buff并且在自己家里
	{
		var style2 : GUIStyle = new GUIStyle();
		style2.normal.textColor = Color.green;
		style2.fontStyle = FontStyle.Bold;
		var buff : NewBuffRow = BuffLogic.getBuffRowByType(1);
		var decoration : int = Property.getInstance().getDecoration() - int.Parse(buff.param);
		var content : String = Define.getContent(5219,[decoration.ToString(), buff.param.ToString()]);
		Global.GetSysTooltip().Add(GUIContent(content), style2);
	}
	Global.GetSysTooltip().Add(GUIContent(Define.getContent(5167)), style);
	Global.GetSysTooltip().Add(GUIContent(Define.getContent(5168)), style);
	Global.GetSysTooltip().Add(GUIContent(Define.getContent(5169)), style);
	Global.GetSysTooltip().Show(true);
}
//--
function MouseClickCallback_MoneyDiamond(caller : iGUIElement) {
	DiamondLogic.GetInstance().OpenRecharge();
}
//--
function SetHolidayGiftBtnEnable(acitve : boolean) {
	BtnGift.setEnabled(acitve);
}
//--
function SetHolidayLotteryBtnEnable(acitve : boolean) {
	BtnLottery.setEnabled(acitve);
}
//--
function SetMessageBtnFlash(active) {
	Messageflashpp.setEnabled(active);
	var animation : iGUITextureAnimation = Messageflashpp.getTextureAnimation("MessageAnim");
	if(active) {
		animation.playFromStart();
	} else {
		animation.stop();
	}

	var animation1 : iGUITextureAnimation = record_btn.getTextureAnimation("animation1");
	if(active) {
		animation1.playFromStart();
	} else {
		animation1.stop();
	}
}
//--
function HandleNotifyAssistEnable(evt:GameEvent, obj:GameObject) {
	if(obj == null || obj.GetComponent(Player) == null) {
		Debug.LogWarning("pick object is null!!!");
		return ;
	}
	var account : String = obj.GetComponent(Player).getAccount();
	if(account == "") {
		Debug.LogWarning("invalid account!!");
		return ;
	}
	if(account != ScenePlayerMgr.getMainPlayerAccount() && !NewPlayGuideModule.IsInNewHandTasks()) {
		UI.getUI().OpenUIRoot("RoleAssistUI");
		iGUICode_RoleAssist.getInstance().Enable(true,obj,true);
	}
}
//--
function HandleNotifyLogonEnteranceEnable(evt:GameEvent, obj:System.Object) {
	BtnLogonAward.setEnabled(obj);
}
//--
private var mEffectAvatar : EffectAvatarRow = null;
public function getEffectAvatar() : EffectAvatarRow
{
	return mEffectAvatar;
}
private function NotifyPropUseStart(evt:GameEvent, obj:EffectAvatarRow) {
	buff7.setEnabled(true);
	buff7.style.normal.background = Resources.Load("UISkins/Textures/MainUI/"+obj.icon);
	mEffectAvatar = obj;
}
//--
private function NotifyPropUseEnd(evt:GameEvent, obj:Object) {
	buff7.setEnabled(false);
	buff7.style.normal.background = null;
	mEffectAvatar = null;
}
//--
function HandleNotifyRefreshTransform(evt:GameEvent, obj:int) {

	if(UI.getUI().isUIRootOpen("BuffUIRoot"))
	{
		LabBuffTime.setEnabled(true);
		ImgBuffIcon.setEnabled(true);
		LabBuffTime.label.text = BuffLogic.convertSecondToString(obj);
	}
	else
	{
		LabBuffTime.setEnabled(false);
		ImgBuffIcon.setEnabled(false);
	}	
	
	/*	
	var minutes : int = System.Math.Floor(obj/60);
	var second:int = obj % 60;
	if(second < 10) {
		LabBuffTime.label.text = minutes.ToString()+":0"+second.ToString();
	} else {
		LabBuffTime.label.text = minutes.ToString()+":"+second.ToString();
	}*/
}
//--
private function NotifyPlantSpeedStart(evt:GameEvent, obj:EffectAvatarRow) {
	LabPlantBuffTime.setEnabled(true);
	ImgPlantBuffIcon.setEnabled(true);
	LabPlantBuffTime.label.text = "";
	ImgPlantBuffIcon.image = Resources.Load("UISkins/Textures/MainUI/"+obj.icon);
}
//--
private function NotifyPlantSpeedEnd(evt:GameEvent, obj:Object) {
	LabPlantBuffTime.setEnabled(false);
	ImgPlantBuffIcon.setEnabled(false);
	LabPlantBuffTime.label.text = "";
	ImgPlantBuffIcon.image = null;
}
//--
function HandleNotifyRefreshPlantSpeed(evt:GameEvent, obj:int) {
	var hour : int = System.Math.Floor(obj/3600);
	var minutes : int = System.Math.Floor((obj-hour*3600)/60);
	var second:int = obj-hour*3600-minutes*60;
	
	var minutesStr : String = "";
	var secondStr : String = "";
	if(minutes < 10) {
		minutesStr = "0"+minutes.ToString();
	} else {
		minutesStr = minutes.ToString();
	}
	if(second < 10) {
		secondStr = "0"+second.ToString();
	} else {
		secondStr = second.ToString();
	}
	LabPlantBuffTime.label.text = hour.ToString()+":"+minutesStr+":"+secondStr;
}
//--
function HandleEnterSelfHouse(evt:GameEvent, obj:System.Object) {
	is_in_self_home = true;
	CollectComp.self_use_collect_flag = false;
	UI.getUI().SetElementPassive(false,"CommemorationDayView","MainUI",true);
	if(Peidui.getInstance().gui()) {
		Peidui.getInstance().gui().MalePanel.passive = false;
		Peidui.getInstance().gui().FemalePanel.passive = false;
	}

	makeFoodBtn.setEnabled(true);
	changeWaiterBtn.setEnabled(true);	
	home_btn.setEnabled(false);
	crystal.setEnabled(true);
	diamond.setEnabled(true);
	diamond2.setEnabled(true);
	upgrade_btn.setEnabled(true);
	if(disableDlgBtn.enabled)
		NoticeBtn.setEnabled(true);
		
    // alter by zlj 显示刷新魅力按钮
	refreshCharmBtn.setEnabled(true);	

	/*
	decorate_btn.style.normal.background = Resources.Load("UISkins/Textures/MainUI/adorn_btn");
	decorate_btn.style.hover.background = Resources.Load("UISkins/Textures/MainUI/adorn_btn_hover");
	decorate_btn.style.active.background = Resources.Load("UISkins/Textures/MainUI/adorn_btn");
	decorate_btn.userData = true;
	*/

	goods_btn.style.normal.background = Resources.Load("UISkins/Textures/MainUI/goods_btn");
	goods_btn.style.hover.background = Resources.Load("UISkins/Textures/MainUI/goods_btn_hover");
	goods_btn.style.active.background = Resources.Load("UISkins/Textures/MainUI/goods_btn");
	goods_btn.userData = true;

	LoveDay_win.enabled = false;
	CommemorationDayView_panel.enabled = false;
	CommemorationDayModify_panel.enabled = false;
	old_anniversary_btn.passive = false;
	CommemorationDayMgr.getSingleton().reqLoveDay();

	if(MessageMgr.GetInstance().IsNewMessageUnread()) {
		SetMessageBtnFlash(true);
	}

	if(iGUICode_MessageUI.getInstance()) {
		iGUICode_MessageUI.getInstance().Active(false);
	}
	if(iGUICode_CheckinUI.getInstance()) {
		iGUICode_CheckinUI.getInstance().ActiveMain(false);
	}
	if(UI.getUI().GetUIRoot("StepLeadRoot"))
		UI.getUI().EnableUIRoot("StepLeadRoot",true);
	if(iGUICode_RoleAssist.getInstance()) {
		iGUICode_RoleAssist.getInstance().Enable(false,null,false);
	}
	var animation : iGUITextureAnimation = home_btn.getTextureAnimation("gohome_anim");
	if(animation) {
		animation.stop();
	}
}
//--
function HandleEnterFriendHouse(evt:GameEvent, obj:System.Object) {
	is_in_self_home = false;
	CollectComp.other_use_collect_flag = false;
	UI.getUI().SetElementPassive(false,"CommemorationDayView","MainUI",true);
	if(Peidui.getInstance().gui()) {
		Peidui.getInstance().gui().MalePanel.passive = false;
		Peidui.getInstance().gui().FemalePanel.passive = false;
	}

	makeFoodBtn.setEnabled(false);
	changeWaiterBtn.setEnabled(false);
	home_btn.setEnabled(true);
	crystal.setEnabled(false);
	diamond.setEnabled(true);
	diamond2.setEnabled(true);
	NoticeBtn.setEnabled(false);
	upgrade_btn.setEnabled(false);
	
	// alter by zlj 隐藏刷新魅力按钮
	refreshCharmBtn.setEnabled(false);
	
	/*
	decorate_btn.style.normal.background = Resources.Load("UISkins/Textures/MainUI/adorn_btn_gray");
	decorate_btn.style.hover.background = Resources.Load("UISkins/Textures/MainUI/adorn_btn_gray");
	decorate_btn.style.active.background = Resources.Load("UISkins/Textures/MainUI/adorn_btn_gray");
	decorate_btn.userData = false;
	*/

	/*
	goods_btn.style.normal.background = Resources.Load("UISkins/Textures/MainUI/goods_btn_gray");
	goods_btn.style.hover.background = Resources.Load("UISkins/Textures/MainUI/goods_btn_gray");
	goods_btn.style.active.background = Resources.Load("UISkins/Textures/MainUI/goods_btn_gray");
	goods_btn.userData = false;
	*/

	LoveDay_win.enabled = false;
	CommemorationDayView_panel.enabled = false;
	CommemorationDayModify_panel.enabled = false;
	old_anniversary_btn.passive = true;
	CommemorationDayMgr.getSingleton().reqLoveDay();

	SetMessageBtnFlash(false);

	if(BubbleTipMgr.GetInstance() && !BubbleTipMgr.GetInstance().IsVisible()) {
		BubbleTipMgr.GetInstance().ShowRandom();
		//BubbleTipMgr.GetInstance().SetVisible(true);
	}

	if(iGUICode_MessageUI.getInstance()) {
		iGUICode_MessageUI.getInstance().Active(false);
	}
	if(iGUICode_CheckinUI.getInstance()) {
		iGUICode_CheckinUI.getInstance().ActiveMain(false);
	}
	if(UI.getUI().GetUIRoot("StepLeadRoot"))
		UI.getUI().EnableUIRoot("StepLeadRoot",false);
	if(modifyHousenameWin.enabled)
		modifyHousenameWin.setEnabled(false);

	/*
	if(iGUICode_FollowUI.getInstance()) {
		iGUICode_FollowUI.getInstance().Enable(false);
	}
	*/

	if(iGUICode_RoleAssist.getInstance()) {
		iGUICode_RoleAssist.getInstance().Enable(false,null,false);
	}
	if(iGUICode_WishListRoot.getInstance()){
		if(iGUICode_WishListRoot.getInstance().singleWishListWin.enabled)
			iGUICode_WishListRoot.getInstance().CloseSingleSelfWishUI();
		if(iGUICode_WishListRoot.getInstance().loversWishListWin.enabled)
			iGUICode_WishListRoot.getInstance().CloseLoversSelfWishUI();
		if(iGUICode_WishListRoot.getInstance().otherWishListWin.enabled)
			iGUICode_WishListRoot.getInstance().CloseOtherWishUI();
		if(iGUICode_WishListRoot.getInstance().helpWin.enabled)
			iGUICode_WishListRoot.getInstance().helpWin.setEnabled(false);
	}
	var animation : iGUITextureAnimation = home_btn.getTextureAnimation("gohome_anim");
	if(animation) {
		animation.playFromStart();
	}
}
//--
function HandleEnterCommonScene(evt:GameEvent, obj:System.Object) {
    //UI.getUI().SetElementPassive(false,"CommemorationDayView","MainUI",true);
    is_in_self_home = false;
    setCollectingStateEnabled(false);
	makeFoodBtn.setEnabled(false);
	changeWaiterBtn.setEnabled(false);
    home_btn.setEnabled(true);
    crystal.setEnabled(false);
   	diamond.setEnabled(false);
	diamond2.setEnabled(false);
	NoticeBtn.setEnabled(false);
	// alter by zlj 隐藏刷新魅力按钮
	refreshCharmBtn.setEnabled(false);
	
	LoveDay_win.enabled = false;
	CommemorationDayView_panel.enabled = false;
	CommemorationDayModify_panel.enabled = false;
	
    SetMessageBtnFlash(false);
	
	if(iGUICode_MessageUI.getInstance()) {
		iGUICode_MessageUI.getInstance().Active(false);
	}
	if(iGUICode_CheckinUI.getInstance()) {
		iGUICode_CheckinUI.getInstance().ActiveMain(false);
	}
	if(UI.getUI().GetUIRoot("StepLeadRoot"))
		UI.getUI().EnableUIRoot("StepLeadRoot",true);
	if(iGUICode_RoleAssist.getInstance()) {
		iGUICode_RoleAssist.getInstance().Enable(false,null,false);
	}
	
	//额外需要屏蔽的东西
	old_anniversary_btn.setEnabled(false);
	
	datum_btn.style.normal.background = Resources.Load("UISkins/Textures/MainUI/datum_btn_gray");
	datum_btn.style.hover.background = Resources.Load("UISkins/Textures/MainUI/datum_btn_gray");
	datum_btn.style.active.background = Resources.Load("UISkins/Textures/MainUI/datum_btn_gray");
	fitment_btn.style.normal.background = Resources.Load("UISkins/Textures/MainUI/decorate_btn_gray");
	fitment_btn.style.hover.background = Resources.Load("UISkins/Textures/MainUI/decorate_btn_gray");
	fitment_btn.style.active.background = Resources.Load("UISkins/Textures/MainUI/decorate_btn_gray");
	gift_btn.style.normal.background = Resources.Load("UISkins/Textures/MainUI/gift_btn_gray");
	gift_btn.style.hover.background = Resources.Load("UISkins/Textures/MainUI/gift_btn_gray");
	gift_btn.style.active.background = Resources.Load("UISkins/Textures/MainUI/gift_btn_gray");
	record_btn.style.normal.background = Resources.Load("UISkins/Textures/MainUI/record_btn_gray");
	record_btn.style.hover.background = Resources.Load("UISkins/Textures/MainUI/record_btn_gray");
	record_btn.style.active.background = Resources.Load("UISkins/Textures/MainUI/record_btn_gray");
	wishing_btn.style.normal.background = Resources.Load("UISkins/Textures/MainUI/wishing_btn_gray");
	wishing_btn.style.hover.background = Resources.Load("UISkins/Textures/MainUI/wishing_btn_gray");
	wishing_btn.style.active.background = Resources.Load("UISkins/Textures/MainUI/wishing_btn_gray");
	house_btn.style.normal.background = Resources.Load("UISkins/Textures/MainUI/house_gray");
	house_btn.style.hover.background = Resources.Load("UISkins/Textures/MainUI/house_gray");
	house_btn.style.active.background = Resources.Load("UISkins/Textures/MainUI/house_gray");
	collect_btn.style.normal.background = Resources.Load("UISkins/Textures/collect/zhutubiao_1_gray");
	collect_btn.style.hover.background = Resources.Load("UISkins/Textures/collect/zhutubiao_1_gray");
	collect_btn.style.active.background = Resources.Load("UISkins/Textures/collect/zhutubiao_1_gray");
	
	upgrade_btn.setEnabled(false);
	love_btn.setEnabled(false);
	new_anniversary.setEnabled(false);
	flower.setEnabled(false);
	
	headportrait.setEnabled(false);
	male.setEnabled(false);
	female.setEnabled(false);
	//额外增加的东西.
	InitChangeWatchMode();
	InitUpDownWatchMode();
	//房屋名字--
	setCommSceneName();
	// 关闭loading界面
	LoadingUIMgr.closeLoadingUI();
	
	var animation : iGUITextureAnimation = home_btn.getTextureAnimation("gohome_anim");
	if(animation) {
		animation.playFromStart();
	}
}
//--
private function setCommSceneName()
{
	var rowid : int = CommSceneLogic.getInstance()._currCommSceneInfo.template_id;
	var row : CommSceneRow = ResManager.LgtMgr.getCommonSceneRow(rowid);

	var copyid : int = CommSceneLogic.getInstance()._currCommSceneInfo.copy_id;
	copyid++;
	var name : String = row.name + "(" + copyid.ToString() + ")";

	HouseName.label.text = name;
	HouseName.label.tooltip = name;
}
// 初始更改房屋观察模式
private function InitChangeWatchMode() : void
{
	if (null == EQSceneManager.getSingleton().HouseSceneObj)
		return;
	
	var born : BornRow = EQGameSceneMgr.getSingleton().getSceneBornRow();
	if (disableDlgBtn.enabled)
	{
		ChangeWatchModeBtn(born.watch_mode);
	}
	EQSceneManager.getSingleton().HouseSceneObj.ChangeWatchMode(born.watch_mode);
}
// 初始观察楼上楼下模式
private function InitUpDownWatchMode() : void
{
	var scene : HouseScene = UpDownStair.getHouseScene();
	if (null == scene)
		return;
	
	if (2 != UpDownStair.getFloorNums())	// 单层
	{
		setUpDownStairsBtnStatus(false, UpDownStair.getViewFloorNum());
		return;
	}
	
	var born : BornRow = EQGameSceneMgr.getSingleton().getSceneBornRow();
	if (1 == born.view_floor)		// 显示楼下
	{
		scene.RootView();
	}
	else							// 显示楼上
	{
		if (scene.UpView())
		{
			scene.ChangeWatchMode(HouseWatchMode.HW_MODE_4);
			ChangeWatchModeBtn(HouseWatchMode.HW_MODE_4);
		}
	}
	setUpDownStairsBtnStatus(true, UpDownStair.getViewFloorNum());
}
//--
function HandleLeaveScene(evt:GameEvent, obj:System.Object) {
    if(EQGameSceneMgr.getSingleton().gameSceneType() == SceneType.COMM_SCENE)
    {
         //恢复屏蔽的东西
	    old_anniversary_btn.setEnabled(true);

		datum_btn.style.normal.background = Resources.Load("UISkins/Textures/MainUI/datum_btn");
		datum_btn.style.hover.background = Resources.Load("UISkins/Textures/MainUI/datum_btn_hover");
		datum_btn.style.active.background = Resources.Load("UISkins/Textures/MainUI/datum_btn");
		fitment_btn.style.normal.background = Resources.Load("UISkins/Textures/MainUI/decorate_btn");
		fitment_btn.style.hover.background = Resources.Load("UISkins/Textures/MainUI/decorate_btn_hover");
		fitment_btn.style.active.background = Resources.Load("UISkins/Textures/MainUI/decorate_btn");
		gift_btn.style.normal.background = Resources.Load("UISkins/Textures/MainUI/gift_btn");
		gift_btn.style.hover.background = Resources.Load("UISkins/Textures/MainUI/gift_btn_hover");
		gift_btn.style.active.background = Resources.Load("UISkins/Textures/MainUI/gift_btn");
		record_btn.style.normal.background = Resources.Load("UISkins/Textures/MainUI/record_btn");
		record_btn.style.hover.background = Resources.Load("UISkins/Textures/MainUI/record_btn_hover");
		record_btn.style.active.background = Resources.Load("UISkins/Textures/MainUI/record_btn");
		wishing_btn.style.normal.background = Resources.Load("UISkins/Textures/MainUI/wishing_btn");
		wishing_btn.style.hover.background = Resources.Load("UISkins/Textures/MainUI/wishing_btn_hover");
		wishing_btn.style.active.background = Resources.Load("UISkins/Textures/MainUI/wishing_btn");
		house_btn.style.normal.background = Resources.Load("UISkins/Textures/MainUI/house");
		house_btn.style.hover.background = Resources.Load("UISkins/Textures/MainUI/house_hover");
		house_btn.style.active.background = Resources.Load("UISkins/Textures/MainUI/house");
		collect_btn.style.normal.background = Resources.Load("UISkins/Textures/collect/zhutubiao_1");
		collect_btn.style.hover.background = Resources.Load("UISkins/Textures/collect/zhutubiao_1_h");
		collect_btn.style.active.background = Resources.Load("UISkins/Textures/collect/zhutubiao_1");

	    love_btn.setEnabled(true);
	    new_anniversary.setEnabled(true);
	    flower.setEnabled(true);

   		headportrait.setEnabled(true);
		male.setEnabled(true);
		female.setEnabled(true);
   	}
}
//--
public var ownerLoader : PlatResLoader = null;
public var loverLoader : PlatResLoader = null;
function HandleUpdateOwnerInfo(evt:GameEvent, obj:System.Object) {
	if(obj == "") {
		male_photo.image = null;
		male_name.label.text = "";
		male_qqhome.setEnabled(false);
		male_qqhomeYear.setEnabled(false);
	} else {
		Global.GetPlatResLoaderMgr().Remove(ownerLoader);
		male_photo.image = null;
		male_name.label.text = Define.unknow;

		var slotData : OwnerIcon = new OwnerIcon();
		slotData.account = obj;
		slotData.imageType = IMAGE_TYPE.IMGTYPE_BIG;
		slotData.imageElement = male_photo;
		slotData.nameElement = male_name;
		slotData.qqhzElement = male_qqhome;
		slotData.qqhzYearElement = male_qqhomeYear;
		ownerLoader = Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(obj,slotData);
	}
}
//--
function HandleUpdateLoverInfo(evt:GameEvent, obj:System.Object) {
	if(obj == "") {
		female_photo.image = null;
		female_name.label.text = "";
		female_qqhome.setEnabled(false);
		female_qqhomeYear.setEnabled(false);
	} else {
		Global.GetPlatResLoaderMgr().Remove(loverLoader);
		female_photo.image = null;
		female_name.label.text = Define.unknow;

		var slotData : OwnerIcon = new OwnerIcon();
		slotData.account = obj;
		slotData.imageType = IMAGE_TYPE.IMGTYPE_BIG;
		slotData.imageElement = female_photo;
		slotData.nameElement = female_name;
		slotData.qqhzElement = female_qqhome;
		slotData.qqhzYearElement = female_qqhomeYear;
		loverLoader = Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(obj,slotData);
	}
}
//--
function GetOwnerImage() : Texture {
	return male_photo.image;
}
//--
function GetLoverImage() : Texture {
	return female_photo.image;
}
//--响应发送输入文本按钮点击事件
function SendBtn_Click(caller : iGUIButton)
{
	ChatLogic.getInstance().sendChatContent();
}
//--响应表情按钮
function ExpressionBtn_Click(caller:iGUIButton)
{
	UI.getUI().OpenMsgbox("",Define.getContent(5092),true);
}
//--
function ClickCallback_disableDlgBtn(caller:iGUIElement){
	DlgContainer.setEnabled(false);
	enableDlgBtn.setEnabled(true);
	caller.setEnabled(false);
	NoticeBtn.setEnabled(false);
	speakerBtn.setEnabled(false);
	halfWallBtn.setEnabled(false);
	fullWallBtn.setEnabled(false);
	nowallBtn.setEnabled(false);
	roofBtn.setEnabled(false);
	runSwitchBtn.setEnabled(false);
	UpDownStairsBtn.setEnabled(false);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.POST_DLGSHOW_EVENT), false);
}
//-- 播放隐藏按钮的闪烁动画
function PlayHideBtnFlash()
{
	if(!DlgContainer.enabled){
		var hidebtn_ani:iGUITextureAnimation = enableDlgBtn.getTextureAnimation("Dlgmsgflashani");
		hidebtn_ani.playFromStart();
		chatflashpp.setEnabled(true);
		var chat_tipflash:iGUITextureAnimation = chatflashpp.getTextureAnimation("ChatTipFlashAni");
		chat_tipflash.playFromStart();
	}
}
//--响应显示按钮对话框
function ClickCallback_enableDlgBtn(caller:iGUIElement)
{
	DlgContainer.setEnabled(true);
	enableDlgBtn.setEnabled(false);
	disableDlgBtn.setEnabled(true);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.POST_DLGSHOW_EVENT), true);
	
	if(NewPlayGuideModule.IsInNewHandTasks()){
		return;
	}
	
	var cast_caller:iGUIButton = caller as iGUIButton;
	var hidebtn_ani:iGUITextureAnimation = cast_caller.getTextureAnimation("Dlgmsgflashani");
	if(hidebtn_ani != null && hidebtn_ani.state == iGUITextureAnimationState.Playing)
	{
		hidebtn_ani.stop();
	}
	if(chatflashpp.enabled){
		var chat_tipflash:iGUITextureAnimation = chatflashpp.getTextureAnimation("ChatTipFlashAni");
		if(chat_tipflash != null && chat_tipflash.state == iGUITextureAnimationState.Playing)
			chat_tipflash.stop();
		chatflashpp.setEnabled(false);
	}

	if(!is_leave_mainui && is_in_self_home){
		NoticeBtn.setEnabled(true);	
	}
	if(!is_leave_mainui){
		speakerBtn.setEnabled(true);
		runSwitchBtn.setEnabled(true);
	}
	var watchMode:HouseWatchMode = EQSceneManager.getSingleton().HouseSceneObj.WatchMode;
	switch(watchMode){
		case HouseWatchMode.HW_MODE_1:
			nowallBtn.setEnabled(true);
			break;
		case HouseWatchMode.HW_MODE_2:
			halfWallBtn.setEnabled(true);
			break;
		case HouseWatchMode.HW_MODE_3:
			fullWallBtn.setEnabled(true);
			break;
		case HouseWatchMode.HW_MODE_4:
			roofBtn.setEnabled(true);
			break;
	}
	if (UpDownStair.getFloorNums() > 1)
	{
		UpDownStairsBtn.setEnabled(true);
	}
}
//--响应公告按钮
function NoticeBtn_Click(caller : iGUIButton){
	//打开公告界面
	iGUICode_NoticeRoot.OpenNoticeRoot();
	OpenNoticeWin();
}
//--打开公告界面
function OpenNoticeWin()
{
	iGUICode_NoticeRoot.getInstance().OpenWin();
	if(iGUICode_NoticeRoot.getInstance().NoticeTypePanel.activePanel == 1)
		iGUICode_NoticeRoot.getInstance().ReqVisitLogs();
	else
		iGUICode_NoticeRoot.getInstance().NoticeTypePanel.activePanel = 1;
	//请求公告数据
	var req:req_fixed_broadcast = new req_fixed_broadcast();
	req.type = 1;
	NetHelper.Send(req);
}
//------------------------------------------------纪念日---------------------------------------------
function old_anniversary_btn_Click(caller : iGUIButton){
	LoveDay_win.enabled = true;
	if(modifyHousenameWin.enabled)
		modifyHousenameWin.setEnabled(false);
}
//--
function setLoveTime(lovetime:int)
{
	if(lovetime < 0)
		lovetime = 0;
	old_anniversary_btn.label.text = Define.getContent(5170, [lovetime.ToString()]);
}
//--
function LoveDay_RefrestDays()
{
	if(LoveDay_year.selectedIndex<0 || LoveDay_month.selectedIndex<0)
		return;

	var year = Convert.ToInt32(LoveDay_year.options[LoveDay_year.selectedIndex].text);
	var month = Convert.ToInt32(LoveDay_month.options[LoveDay_month.selectedIndex].text);
	var days = System.DateTime.DaysInMonth(year, month);

	LoveDay_day.removeAll();
	for(var i=1; i<=days; i++)
		LoveDay_day.addOption(i.ToString());
	LoveDay_day.selectedIndex = -1;
}
//--
function LoveDay_close_Click(caller : iGUIButton){
	LoveDay_win.enabled = false;
}
//--
function LoveDay_year_Init(caller : iGUIDropDownList){
	LoveDay_year.removeAll();
	for(var i=1970; i<=SysTimer.getCurTime().Year; i++)
		LoveDay_year.addOption(i.ToString());
}
//--
function LoveDay_day_Init(caller : iGUIDropDownList){
	LoveDay_day.removeAll();
}
//--
function LoveDay_year_ValueChange(caller : iGUIDropDownList){
	LoveDay_RefrestDays();
}
//--
function LoveDay_month_ValueChange(caller : iGUIDropDownList){
	LoveDay_RefrestDays();
}
//--
function LoveDay_commit_Click(caller : iGUIButton){
	if(LoveDay_year.selectedIndex<0 || LoveDay_month.selectedIndex<0 || LoveDay_day.selectedIndex<0)
	{
		UI.getUI().OpenMsgbox("", Define.getContent(5171),true);
		return;
	}

	var req:req_modify_love_time = new req_modify_love_time();
	req.house_id = DataCenter.getSelfHouseID();
	req.love_time.year = Convert.ToInt32(LoveDay_year.options[LoveDay_year.selectedIndex].text);
	req.love_time.month = Convert.ToInt32(LoveDay_month.options[LoveDay_month.selectedIndex].text);
	req.love_time.day = Convert.ToInt32(LoveDay_day.options[LoveDay_day.selectedIndex].text);
	NetHelper.Send(req);

	LoveDay_win.enabled = false;
}
//--
function new_anniversary_Click(caller : iGUIButton){
	root.depth = 20;
	CommemorationDayView_panel.enabled = true;
	UI.getUI().SetElementPassive(true,"CommemorationDayView","MainUI",true);
	if(Peidui.getInstance().gui()) {
		Peidui.getInstance().gui().MalePanel.passive = true;
		Peidui.getInstance().gui().FemalePanel.passive = true;
	}
	CommemorationDayView_new.enabled = DataCenter.isInSelfHouse();

	CommemorationDayMgr.getSingleton().mCurPage = 1;
	if(UI.getUI().GetUIRoot("StepLeadRoot"))
		UI.getUI().EnableUIRoot("StepLeadRoot",false);

	CommemorationDayMgr.getSingleton().reqCommemorationDay();
	SetHouseName();
}
//--
function CommemorationDayView_close_Click(caller : iGUIButton){
	root.depth = 200;
	CommemorationDayView_panel.enabled = false;
	UI.getUI().SetElementPassive(false,"CommemorationDayView","MainUI",true);
	if(Peidui.getInstance().gui()) {
		Peidui.getInstance().gui().MalePanel.passive = false;
		Peidui.getInstance().gui().FemalePanel.passive = false;
	}
	if(DataCenter.isInSelfHouse()){
		if(UI.getUI().GetUIRoot("StepLeadRoot"))
			UI.getUI().EnableUIRoot("StepLeadRoot",true);
	}
}
//--
function CommemorationDayView_new_Click(caller : iGUIButton){
	CommemorationDayModify_panel.enabled = true;
	CommemorationDayModify_panel.passive = false;
	CommemorationDayView_panel.passive = true;
	CommemorationDayMgr.getSingleton().mModifyingDayID = 0;

	CommemorationDayModify_log.value = "";
	CommemorationDayModify_year.selectedIndex = -1;
	CommemorationDayModify_month.selectedIndex = -1;
	CommemorationDayModify_day.selectedIndex = -1;
	CommemorationDayModify_lock.values[0] = false;
	CommemorationDayModify_WordsLimit.label.text = "140";
}
//--
function CommemorationDayView_lastpage_Click(caller : iGUIButton){
	if(CommemorationDayMgr.getSingleton().mCurPage == 1)
		return;

	CommemorationDayMgr.getSingleton().mCurPage--;
	CommemorationDayView_nextpage.passive = false;

	if(CommemorationDayMgr.getSingleton().mCurPage == 1)
		CommemorationDayView_lastpage.passive = true;

	CommemorationDayMgr.getSingleton().reqCommemorationDay();
}
//--
function CommemorationDayView_nextpage_Click(caller : iGUIButton){
	if(CommemorationDayMgr.getSingleton().mCurPage == CommemorationDayMgr.getSingleton().mMaxPage)
		return;

	CommemorationDayMgr.getSingleton().mCurPage++;
	CommemorationDayView_lastpage.passive = false;

	if(CommemorationDayMgr.getSingleton().mCurPage == CommemorationDayMgr.getSingleton().mMaxPage)
		CommemorationDayView_nextpage.passive = true;

	CommemorationDayMgr.getSingleton().reqCommemorationDay();
}
//--
function CommemorationDayModify_close_Click(caller : iGUIButton){
	CommemorationDayModify_panel.enabled = false;
	CommemorationDayView_panel.passive = false;
}
//--
function CommemorationDayModify_lock_ValueChange(caller : iGUICheckboxGroup){

}
//--
function CommemorationDayModify_save_Click(caller : iGUIButton){
	if(CommemorationDayModify_year.selectedIndex == -1 ||
		CommemorationDayModify_month.selectedIndex == -1 ||
		CommemorationDayModify_day.selectedIndex == -1)
	{
		UI.getUI().OpenMsgbox("", Define.getContent(5172),true);
		return;
	}

	if(CommemorationDayModify_log.value == "")
	{
		UI.getUI().OpenMsgbox("", Define.getContent(5173),true);
		return;
	}

	CommemorationDayModify_panel.enabled = false;
	CommemorationDayView_panel.passive = false;

	if(CommemorationDayMgr.getSingleton().mModifyingDayID == 0)
	{
		var reqa:req_add_commemoration = new req_add_commemoration();
		reqa.house_id = DataCenter.getSelfHouseID();
		reqa.time.year = Convert.ToInt32(CommemorationDayModify_year.options[CommemorationDayModify_year.selectedIndex].text);
		reqa.time.month = Convert.ToInt32(CommemorationDayModify_month.options[CommemorationDayModify_month.selectedIndex].text);
		reqa.time.day = Convert.ToInt32(CommemorationDayModify_day.options[CommemorationDayModify_day.selectedIndex].text);
		reqa.show_other = CommemorationDayModify_lock.values[0]?0:1;
		reqa.content = CommemorationDayModify_log.value;//Global.GetKeyWordShield().Search( CommemorationDayModify_log.value );
		NetHelper.Send(reqa);
	}
	else
	{
		var day:commemoration_day = CommemorationDayMgr.getSingleton().getModifyingCommemorationDay();

		if(day != null){
			var reqm:req_modify_commemoration = new req_modify_commemoration();
			reqm.house_id = DataCenter.getSelfHouseID();
			reqm.id = day.id;
			reqm.time.year = Convert.ToInt32(CommemorationDayModify_year.options[CommemorationDayModify_year.selectedIndex].text);
			reqm.time.month = Convert.ToInt32(CommemorationDayModify_month.options[CommemorationDayModify_month.selectedIndex].text);
			reqm.time.day = Convert.ToInt32(CommemorationDayModify_day.options[CommemorationDayModify_day.selectedIndex].text);
			reqm.show_other = CommemorationDayModify_lock.values[0]?0:1;
			reqm.content = CommemorationDayModify_log.value;//Global.GetKeyWordShield().Search( CommemorationDayModify_log.value );
			NetHelper.Send(reqm);
		}
	}
	var reqg:req_get_commemoration = new req_get_commemoration();
	reqg.house_id = DataCenter.getSelfHouseID();
	reqg.my_house_id = DataCenter.getSelfHouseID();
	reqg.page = 1;
	NetHelper.Send(reqg);
}
//--
function CommemorationDayModify_year_Init(caller : iGUIDropDownList){
	CommemorationDayModify_year.removeAll();
	for(var i=1970; i<=SysTimer.getCurTime().Year; i++)
		CommemorationDayModify_year.addOption(i.ToString());
}
//--
function CommemorationDayModify_day_Init(caller : iGUIDropDownList){
	CommemorationDayModify_day.removeAll();
}
//--
function CommemorationDayModify_RefrestDays()
{
	if(CommemorationDayModify_year.selectedIndex<0 || CommemorationDayModify_month.selectedIndex<0)
		return;

	var year = Convert.ToInt32(CommemorationDayModify_year.options[CommemorationDayModify_year.selectedIndex].text);
	var month = Convert.ToInt32(CommemorationDayModify_month.options[CommemorationDayModify_month.selectedIndex].text);
	var days = System.DateTime.DaysInMonth(year, month);

	CommemorationDayModify_day.removeAll();
	for(var i=1; i<=days; i++)
		CommemorationDayModify_day.addOption(i.ToString());
	CommemorationDayModify_day.selectedIndex = -1;
}
//--
function CommemorationDayModify_year_ValueChange(caller : iGUIDropDownList){
	CommemorationDayModify_RefrestDays();
}
//--
function CommemorationDayModify_month_ValueChange(caller : iGUIDropDownList){
	CommemorationDayModify_RefrestDays();
}
//--
function CommemorationDayModify_log_ValueChange(caller : iGUITextarea){
	var length : int = 140 - caller.value.Length;
	CommemorationDayModify_WordsLimit.label.text = length.ToString();
}
//--
function SetHouseName()
{
	var house_name : String = MainUICtrl.Get("house_name") as String;
	if (null == house_name)
		return;
	if (PlayerFriend.GetInstance().IsInSelfHouse())
	{
		CDV_HouseName.setEnabled(false);
		return;
	}
	CDV_HouseName.setEnabled(true);
	CDV_HouseName.label.text = house_name;
	CDV_HouseName.label.tooltip = house_name;
}
//--
function ClickCallback_changeWatchMode(caller:iGUIElement){
	var watchMode : HouseWatchMode = EQSceneManager.getSingleton().HouseSceneObj.WatchMode;
	// step1:计算模式
	switch (watchMode)
	{
	case HouseWatchMode.HW_MODE_1:		// 无墙
		watchMode = HouseWatchMode.HW_MODE_2;
		break;
	case HouseWatchMode.HW_MODE_2:		// 半墙
		watchMode = HouseWatchMode.HW_MODE_3;
		break;
	case HouseWatchMode.HW_MODE_3:		// 全墙
		watchMode = HouseWatchMode.HW_MODE_4;
		break;
	case HouseWatchMode.HW_MODE_4:		// 屋顶
		watchMode = HouseWatchMode.HW_MODE_1;
		break;
	}
	// step2:改变模式
	EQSceneManager.getSingleton().HouseSceneObj.ChangeWatchMode(watchMode);
	ChangeWatchModeBtn(watchMode);
}
//--
private function EnableHalfWallBtn(flag:boolean){
	halfWallBtn.setEnabled(flag);
}
//--
private function EnableNoWallBtn(flag:boolean){
	nowallBtn.setEnabled(flag);
}
//--
private function EnableFullWallBtn(flag:boolean){
	fullWallBtn.setEnabled(flag);
}
//--
private function EnableRoofBtn(flag : boolean){
	roofBtn.setEnabled(flag);
}
private function ChangeWatchModeBtn(mode : HouseWatchMode) : void
{
	switch (mode)
	{
	case HouseWatchMode.HW_MODE_1:		// 无墙
		EnableNoWallBtn(true);
		EnableHalfWallBtn(false);
		EnableFullWallBtn(false);
		EnableRoofBtn(false);
		break;
	case HouseWatchMode.HW_MODE_2:		// 半墙
		EnableNoWallBtn(false);
		EnableHalfWallBtn(true);
		EnableFullWallBtn(false);
		EnableRoofBtn(false);
		break;
	case HouseWatchMode.HW_MODE_3:		// 全墙
		EnableNoWallBtn(false);
		EnableHalfWallBtn(false);
		EnableFullWallBtn(true);
		EnableRoofBtn(false);
		break;
	case HouseWatchMode.HW_MODE_4:		// 屋顶
		EnableNoWallBtn(false);
		EnableHalfWallBtn(false);
		EnableFullWallBtn(false);
		EnableRoofBtn(true);
		break;
	}
}
//--
function ClickCallback_Vote(caller : iGUIElement)
{
	//if(caller.userData == true) {
		UI.getUI().OpenUIRoot("VoteUI");
		iGUICode_DecorateUI.getInstance().Enable(true);
	//}
}
//--
function ClickCallbackDress(caller : iGUIElement) {
	OpenDressUI();
}
//--
function ClickCallbackFitment(caller : iGUIElement) {
	if(EQGameSceneMgr.getSingleton().gameSceneType() == SceneType.COMM_SCENE)
		return;

	if(DataCenter.isInSelfHouse()) {
		EQCamera.getInstance().FollowMe = false;
		FitmentLogic.getInstance().ReqStartEditHouse();
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_FITMENT_BTN));
	} else {
		UI.getUI().OpenMsgbox("", Define.getContent(5093),true);
	}
}
//--
function ClickCallbackHouse(caller : iGUIElement) {
	if(EQGameSceneMgr.getSingleton().gameSceneType() == SceneType.COMM_SCENE)
		return;

	if(DataCenter.isInSelfHouse()) {
		iGUICode_HouseUpdateRoot.OpenHouseUpdateRoot();
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_HOUSE_BTN));
	}
	else{
		Global.GetSysMsgHandler().ShowSysMsg(419);
	}
}
//--
function ClickCallback_qqhome(caller : iGUIElement) {
	iGUICode_QQHomeUI.getInstance().Enable(true);
}
//--
function ClickCallback_friendInvite(caller : iGUIElement) {
	UI.getUI().OpenUIRoot("FriendInviteUI");
	iGUICode_FriendInviteUI.getInstance().Enable(true);
}
//--
function ClickCallback_logonAward(caller : iGUIElement) {
	iGUICode_LogonAwardUI.getInstance().Enable(true);
}
//--
function ClickCallback_qqhomePrivilege(caller : iGUIElement) {
	if(UI.getUI().GetUIRoot("QQHomeUI")) {
		iGUICode_QQHomeUI.getInstance().EnablePrivilege(true);
	}
}
//--
function ClickCallback_plantHelp(caller : iGUIElement) {
	UI.getUI().OpenUIRoot("PlantUI");
	iGUICode_PlantUI.getInstance().Enable(true);
}
//--
function ClickCallbackItemsMake(caller : iGUIElement) {
	ItemsMakeLogic.GetInstance().Open();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_ITEMS_MAKE_BTN));
}
//--
function HandleUpdateRestoreTmUI(evt:GameEvent, rt:RemainTimeStruct){
	if(power.enabled && !restoreTm.enabled)
		restoreTm.setEnabled(true);
	var show_tm:String = rt.min + ":" + rt.sec;
	restoreTm.label.text = show_tm;
}
//--
function HandleUpdateHpUI(evt:GameEvent, hp:PhyPowerClass){
	UpdateHpUIVal(hp.mCurPhyPower,hp.mCurMaxPhyPower);
}
//--
function UpdateHpUIVal(curHp:int,MaxHp:int){
	var show_cur_power:String = System.Convert.ToString(curHp);
	var show_max_power:String = System.Convert.ToString(MaxHp);
	curPhyPower_text.label.text = show_cur_power;
	maxPhyPower_text.label.text = show_max_power;
	if(curHp > MaxHp)
		curPhyPower_text.labelColor = Color(0.6317,0.0784,0.1569);
	else
		curPhyPower_text.labelColor = Color.white;
	//
	var _val:float = System.Convert.ToDouble(curHp)/System.Convert.ToDouble(MaxHp);
	if(_val > 1)
		_val = 1;
	phypow_progressbar_fill.setWidth(_val);
}
//--
function HandlePhyPower_toMax(evt:GameEvent, obj:Object){
	restoreTm.label.text = "";
	restoreTm.setEnabled(false);
}
//--
function HandleUpdateLvExpUI(evt:GameEvent, LvExp:LvExpClass){
	var show_cur_exp:String = System.Convert.ToString(LvExp.mCurExp);
	level_text.label.text = show_cur_exp;
	var full_exp:String = System.Convert.ToString(LvExp.mCurExp) + "/" + System.Convert.ToString(LvExp.mCurMaxExp);
	var show_lv:String = "";
	if(LvExp.mCurLv < 10){
		show_lv = "0" + System.Convert.ToString(LvExp.mCurLv);
	}
	else{
		show_lv = System.Convert.ToString(LvExp.mCurLv);
	}
	level_image.label.text = show_lv;
	level.userData = Define.getContent(5174, [show_lv, full_exp]);
	//
	var _val:float = System.Convert.ToDouble(LvExp.mCurExp)/System.Convert.ToDouble(LvExp.mCurMaxExp);
	exp_progressbar_fill.setWidth(_val);
}
//--
function HandleIsTwoPlayer(boy_name:String,girl_name:String){
	 if(boy_name == ""){
	 	if(DataCenter.isInSelfHouse()){
		 	 male_photo.image = Resources.Load("UISkins/Textures/Peidui/find_her");
		 	 male_photo.hoverImage = Resources.Load("UISkins/Textures/Peidui/find_her_hover");
		 	 male_photo.clickCallback = ClickCallback_male_photo;
	 	 }
	 	 else{
	 	 	male_photo.image = Resources.Load("UISkins/Textures/Peidui/single_instead");
		 	male_photo.hoverImage = null;
		 	male_photo.clickCallback = null;
		 }
	 }
	 else{
		 male_photo.hoverImage = null;
		 male_photo.clickCallback = null;
	 }
	 if(girl_name == ""){
	 	if(DataCenter.isInSelfHouse()){
		 	 female_photo.image = Resources.Load("UISkins/Textures/Peidui/find_her");
		 	 female_photo.hoverImage = Resources.Load("UISkins/Textures/Peidui/find_her_hover");
		 	 female_photo.clickCallback = ClickCallback_female_photo;
		 }
		 else{
		 	 female_photo.image = Resources.Load("UISkins/Textures/Peidui/single_instead");
		 	 female_photo.hoverImage = null;
		 	 female_photo.clickCallback = null;
		 }
	 }
	 else{
		 female_photo.hoverImage = null;
		 female_photo.clickCallback = null;
	 }
}
//--
function HandleNotifyHouseCreated(evt:GameEvent, obj:house_info){
	if(!obj)
		return;
	
	var house_id:UInt64 = obj.house_id;
	var house_name:String = obj.name;
	HouseName.label.text = house_name;
	HouseName.label.tooltip = house_name;
	var house_name_pixlength:float = HouseName.style.CalcSize(GUIContent(house_name)).x;
	var CDV_HouseName_BtnLen:float = HouseName.positionAndSize.width-HouseName.label.image.width-30;
	if(house_name_pixlength > CDV_HouseName_BtnLen){
		var match_string:String = _MatchHouseNameLength(house_name,CDV_HouseName_BtnLen);
		HouseName.label.text = match_string+"...";
	}
	CanStartTimer1(house_id);
	//
	MainUICtrl.Set("house_name", house_name);
	HandleFlower();
	//
	HandleIsTwoPlayer(obj.boy,obj.girl);
	//
	InitChangeWatchMode();
	InitUpDownWatchMode();
	//
	setCollectingStateEnabled(false);
}
//--
function ReqIsWatered(house_id:UInt64){
	var req:req_ask_today_water_flower = new req_ask_today_water_flower();
	req.owner_house_id = house_id;
	NetHelper.Send(req);
}
//--
function CanStartTimer1(house_id:UInt64){
	var house : PlayerHouse = EQGameSceneMgr.getSingleton().getHouse();
	if(DataCenter.isInSelfHouse()){
		if(house.hasTwoOwner())
			ReqIsWatered(house_id);
	}
	else{
		if(PaoPaoControl.GetPpCtrol(waterTipPP))
			PaoPaoControl.GetPpCtrol(waterTipPP).StopPpTimer();
	}
}
//--
function HandleFlower()
{
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.REQUEST_CLEAR_STATUS));
	flower.enabled = true;
	var house : PlayerHouse = EQGameSceneMgr.getSingleton().getHouse();
	//if(house.hasTwoOwner())
	//{
	flower.label.tooltip = Define.getContent(5175);
	flower.image = Resources.Load("UISkins/Textures/MainUI/love_flower_vine");
	flower.hoverImage = Resources.Load("UISkins/Textures/MainUI/love_flower_vine_hover");
	//}
	//else
	//{
		//flower.label.tooltip = "单身无法领养爱情树";
		//flower.image = Resources.Load("UISkins/Textures/MainUI/love_flower_vine_gray");
		//flower.hoverImage = Resources.Load("UISkins/Textures/MainUI/love_flower_vine_gray");
	//}
}
//--
public function _MatchHouseNameLength(house_name:String, Max_Len : int):String{
	var house_name_pixlength:float = HouseName.style.CalcSize(GUIContent(house_name)).x;
	var CDV_HouseName_BtnLen:float = HouseName.positionAndSize.width-HouseName.label.image.width-30;
	if(house_name_pixlength > Max_Len){
		return _MatchHouseNameLength(house_name.Substring(0,house_name.Length-2), Max_Len);
	}
	else{
		return house_name;
	}
}
//--
function ClickCallback_houseName(caller:iGUIElement){
	if(DataCenter.isInSelfHouse()){
		if(!modifyHousenameWin.enabled){
			_InitHouseNameLtdLenTxt(houseNameLengthLtd);
			modifyHousenameWin.setEnabled(true);
			if(LoveDay_win.enabled)
				LoveDay_win.setEnabled(false);
		}
	}
}
//--
function ValueChangeCallback_modifyHousenameEditor(caller:iGUIElement){
	var _editor:iGUITextfield = caller as iGUITextfield;
	var _inputs:String = _editor.value;
	var _inputs_len:int = _inputs.Length;
	var _curLtdLen:int = houseNameLengthLtd - _inputs_len;
	_InitHouseNameLtdLenTxt(_curLtdLen);
	if(_curLtdLen <= 0){
		modifyHousenameEditor.value = modifyHousenameEditor.value.Substring(0,houseNameLengthLtd);
	}
}
//--
function _InitHouseNameLtdLenTxt(ltd_len:int){
	if(ltd_len<=0)
		ltd_len = 0;
	houseNameLenLtdTxt.label.text = Define.getContent(5176, [ltd_len.ToString()]);
}
//--
function ClickCallback_submitModifyHnBtn(caller:iGUIElement){
	var input_house_name:String = modifyHousenameEditor.value;
	input_house_name = input_house_name.Trim();
	if(input_house_name == ""){
		UI.getUI().OpenMsgbox("",Define.getContent(5177),true);
	}
	else{
		HouseName.label.text = input_house_name;
		HouseName.label.tooltip = input_house_name;
		var house_name_pixlength:float = HouseName.style.CalcSize(GUIContent(input_house_name)).x;
		var CDV_HouseName_BtnLen:float = HouseName.positionAndSize.width-HouseName.label.image.width-30;
		if(house_name_pixlength > CDV_HouseName_BtnLen){
			var match_string:String = _MatchHouseNameLength(input_house_name, CDV_HouseName_BtnLen);
			HouseName.label.text = match_string + "...";
		}

		if(modifyHousenameWin.enabled)
			ClickCallback_closeModifyHousenameBtn(null);
		var req_modify:req_update_house_name = new req_update_house_name();
		req_modify.name = input_house_name;
		req_modify.account = ScenePlayerMgr.getMainPlayerAccount();
		NetHelper.Send(req_modify);
	}
}
//--
function ClickCallback_closeModifyHousenameBtn(caller:iGUIElement){
	modifyHousenameEditor.value = "";
	modifyHousenameWin.setEnabled(false);
}
//---------------------------------------------------------------------------------------
//--点击图标进入新手引导的回调函数
function HandleClickIntoNewGuideCallback(caller:iGUIElement)
{
	var name:String = caller.gameObject.name;
	var is_self_home:boolean = DataCenter.isInSelfHouse();
	if(name != "action_btn" && name != "marry_btn" && name != "gift_btn")
	{
		if(is_self_home){
			Global.GetNewPlayGuideMgr().StartNewGuideSecond(name);
		}
	}
}
//--
function HandleEnablePp_OnTimer(evt:GameEvent, obj:Object){
	var ele:iGUIElement = obj as iGUIElement;
	//Debug.Log(ele.variableName);
	if(root.enabled && !ele.enabled)
		ele.setEnabled(true);
	else{
		ele.setWidth(0);
		ele.setHeight(0);
		ele.setEnabled(false);
	}
}
//--
function HandleDisablePp_TimerComplete(evt:GameEvent, obj:Object){
	var ele : iGUIElement = obj as iGUIElement;
	//if(ele.enabled){
		ele.setWidth(0);
		ele.setHeight(0);
		ele.setEnabled(false);
	//}
}
//--
function HandleEnablePp_TimerComplete(evt:GameEvent, obj:Object){
	var ele : iGUIElement = obj as iGUIElement;
	//if(ele.enabled){
		ele.setWidth(0);
		ele.setHeight(0);
		ele.setEnabled(false);
	//}
}
//--
function ClickCallback_wishing_btn(caller : iGUIElement){
	if(EQGameSceneMgr.getSingleton().gameSceneType() == SceneType.COMM_SCENE)
		return;

	//1.打开许愿单root
	UI.getUI().OpenWishListUI("WishListRoot");
}
//--
function ClickCallback_speaker_btn(caller : iGUIElement){
	SpeakerComp.OpenSpeakerRoot();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_OPENSPEAKER_BTN));
}
//--
function ClickCallback_DailyTaskBtn(caller : iGUIElement){
	Task.getInstance().openDailyUI();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_DAILYTASK_BTN));
}
//--
function ClickCallback_TaskBtn1(caller : iGUIElement){
	UI.getUI().SetElementPassive(false,"TaskBtn1","MainUI",true);
	Task.getInstance().clickMainUITaskBtn(1);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_TASK_BTN1));
	//var idx : int = 15;
	//if(idx < HandleAfterLogin.playerGuideFlags.Count){
	//	Global.GetNewPlayGuideMgr().Send_NewGuideFlags(1,15);
	//}
}
//--
function ClickCallback_TaskBtn2(caller : iGUIElement){
	Task.getInstance().clickMainUITaskBtn(2);
}
//--
function ClickCallback_TaskBtn3(caller : iGUIElement){
	Task.getInstance().clickMainUITaskBtn(3);
}
//--
function ClickCallback_TaskBtn4(caller : iGUIElement){
	Task.getInstance().clickMainUITaskBtn(4);
}
//--
function ClickCallback_collect_btn(caller : iGUIElement){
	if(EQGameSceneMgr.getSingleton().gameSceneType() == SceneType.COMM_SCENE)
		return;
	
	if(FitmentLogic.getInstance().inFitmenting)
		return;
	
	iGUICode_CollectRoot.OpenCollectUIRoot();
	if(DataCenter.isInSelfHouse()){
		if(CollectComp.self_use_collect_flag){
			iGUICode_CollectRoot.getInstance().OpenCollectUI();
			iGUICode_CollectRoot.getInstance().CloseCollectResultUI();
			CollectComp.ReqUpdateSearchItems();
			iGUICode_CollectRoot.getInstance().OpenCollectingUI(true);
		}
		else{
			if(!CollectComp.collect_end_flag){
				iGUICode_CollectRoot.getInstance().OpenCollectUI();
				iGUICode_CollectRoot.getInstance().CloseCollectingUI();
				iGUICode_CollectRoot.getInstance().CloseCollectResultUI();
				CollectComp.ReqOpenStartSearchUI();
				iGUICode_CollectRoot.getInstance().OpenStartCollectUI();
				EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_COLLECT_BTN));
			}
			else{
				iGUICode_CollectRoot.getInstance().OpenCollectUI();
				iGUICode_CollectRoot.getInstance().CloseCollectingUI();
				iGUICode_CollectRoot.getInstance().CloseStartCollectUI();
				iGUICode_CollectRoot.getInstance().OpenCollectResultUI();
			}
		}
	}
	else{
		if(CollectComp.other_use_collect_flag){
			iGUICode_CollectRoot.getInstance().OpenCollectUI();
			iGUICode_CollectRoot.getInstance().CloseCollectResultUI();
			iGUICode_CollectRoot.getInstance().CloseStartCollectUI();
			CollectComp.ReqUpdateSearchItems();
			iGUICode_CollectRoot.getInstance().OpenCollectingUI(false);
		}
		else{
			UI.getUI().OpenMsgbox("",Define.getContent(5178),true);
		}
	}
}
//--
function ClickCallback_BtnRankList(caller : iGUIElement)
{
	RankListLogic.getInstance().openRankListUI();
}
//--
function setCollectingStateEnabled(flag : boolean){
	collecting_state.setEnabled(flag);
}
//--
function ClickCallback_collecting_state(caller : iGUIElement){
	ClickCallback_collect_btn(caller);
}
//--
function HandleHideFuncBtns(evt : GameEvent, obj : Object){
	var enable : boolean = Convert.ToBoolean(obj);
	action_btn.setEnabled(enable);
	datum_btn.setEnabled(enable);
	//decorate_btn.setEnabled(enable);
	dress_btn.setEnabled(enable);
	fitment_btn.setEnabled(enable);
	gift_btn.setEnabled(enable);
	goods_btn.setEnabled(enable);
	//home_btn.setEnabled(enable);
	house_btn.setEnabled(enable);
	itemsmake_btn.setEnabled(enable);
	love_btn.setEnabled(enable);
	//marry_btn.setEnabled(enable);
	ourdoor_btn.setEnabled(enable);
	party_btn.setEnabled(enable);
	photofriend_btn.setEnabled(PlatformMgr.IsPlatYY() ? false : enable);
	record_btn.setEnabled(enable);
	//setting_btn.setEnabled(enable);
	social_btn.setEnabled(enable);
	wishing_btn.setEnabled(enable);
	collect_btn.setEnabled(enable);
	BtnRankList.setEnabled(enable);
	//BtnPlantHelp.setEnabled(enable);
	NoticeBtn.setEnabled(enable);
	speakerBtn.setEnabled(enable);
	halfWallBtn.setEnabled(enable);
	new_anniversary.setEnabled(enable);
	BtnFriendInvite.setEnabled(enable);
	flower.setEnabled(enable);
	BtnPropShop.setEnabled(enable);
	active_award_btn.setEnabled(enable);
	chuangguan_btn.setEnabled(enable);
	firstPayBtn.setEnabled(enable);
	SinglePayBtn.setEnabled(enable);
	AccumulatePayBtn.setEnabled(enable);
	DailyTaskBtn.setEnabled(enable);
	exchangBtn.setEnabled(enable);
	upgrade_btn.setEnabled(enable);
	addPhyPowerBtn.setEnabled(enable);
	runSwitchBtn.setEnabled(enable);
}
//--
function ClickCallback_active_award_btn(caller : iGUIElement){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_ACTIVE_AWARD_BTN));
}
//--
function HandleNotifyCanReward(evt : GameEvent, obj : Object){
	var animation : iGUITextureAnimation = active_award_btn.getTextureAnimation("can_reward_anim");
	animation.playFromStart();
}
//--
function HandleCantReward(evt : GameEvent, obj : Object){
	var animation : iGUITextureAnimation = active_award_btn.getTextureAnimation("can_reward_anim");
	animation.stop();
}
//--
function Clickcallback_chuangguan_btn(caller : iGUIElement){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_CHUANGGUAN_BTN));
}
// 初始聊天模块
private function initChatModule() : void
{
	var ui_arr : Array = new Array(14);
	ui_arr[0] = DlgContainer;
	ui_arr[1] = OutputContainer;
	ui_arr[2] = OutputListboxBg;
	ui_arr[3] = OutputListbox;
	ui_arr[4] = InputContainer;
	ui_arr[5] = inputBoxParent;
	ui_arr[6] = InputBox;
	ui_arr[7] = private_to_name;
	ui_arr[8] = cancelPrivateChat;
	ui_arr[9] = chat_menu_panel;
	ui_arr[10] = cmp_attention_btn;
	ui_arr[11] = cmp_priavte_chat_btn;
	ui_arr[12] = cmp_visit_btn;
	ui_arr[13] = size_chatbox_btn;
	ChatLogic.getInstance().setChatControls(ui_arr);
}
//--
function ClickCallback_SinglePayBtn(caller : iGUIElement)
{
	PayLogic.request_single_payment_return();
}
//--
function ClickCallback_AccumulatePayBtn(caller : iGUIElement)
{
	PayLogic.request_total_payment_return();
}
//--
function ClickCallback_firstPayBtn(caller : iGUIElement){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_FIRSTPAYMENTBTN));
}
//--
function HandleNotifyFirstPaymentStatus(evt : GameEvent, obj : Object){
	var pack : notify_first_payment_return_status = obj as notify_first_payment_return_status;
	var result : int = pack.returned;
	if(!GameObject.Find("FirstPaymentGameObject")){
		var fp_obj : GameObject = new GameObject("FirstPaymentGameObject");
		if(!fp_obj.GetComponent("FirstPayComp"))
			fp_obj.AddComponent("FirstPayComp");
	}
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.POST_FIRSTPAYMENTSTATUS), result);
	
	if(result == 0){ //没有
		
	}
	else if(result == 1){
		
	}
}
//--
function HandleAfterGetFirstPaymentReward(evt : GameEvent, obj : Object){
	firstPayBtn.clickCallback = null;
	//firstPayBtn.setEnabled(false);
}
//--
function ClickCallback_BtnCancelUseProp(caller : iGUIElement)
{
	PropUseLogic.Ctrl.Excute("cancel_use_item", null);
}
//---
function ClickCallbackRemedy(caller : iGUIElement)
{
	RemedyLogic.GetInstance().Open();
}
//---
function ClickCallbackDiamondRecharge(caller : iGUIElement) {
	DiamondLogic.GetInstance().OpenRecharge();
}
//TEMP fullzhu
function ClickTestAudio1(caller : iGUIElement) {
	YYAudioLogic.GetInstance().CreateRoom();
}

function ClickTestAudio2(caller : iGUIElement) {
	//YYAudioLogic.GetInstance().EnterRoom(1);
}

function ClickTestAudio3(caller : iGUIElement) {
	YYAudioLogic.GetInstance().LeaveRoom();
}

function ClickTestAudio4(caller : iGUIElement) {
	YYAudioLogic.GetInstance().StartSpeak();
}

function ClickTestAudio5(caller : iGUIElement) {
	YYAudioLogic.GetInstance().StopSpeak();
}
//
//--
function HandleNotifyBtnCancelUsePropEnable(evt:GameEvent, visible:boolean)
{
	BtnCancelUseProp.setEnabled(visible);
}
//--
function HandleNotifyRemedyEnable(evt:GameEvent, enable:boolean) {
	if(!PlatformMgr.IsPlatYY()){
		BtnRemedy.setEnabled(enable);
	}
}
//--
function HandleNotifyUpdateMoneyDiamond(evt:GameEvent, diamond:int) {
	MD_text.label.text = diamond.ToString();
}
//--
private function YYInviteBtnAvailable(){
	if(PlatformMgr.IsPlatYY()){
		yy_invite_btn.setEnabled(true);
		yy_invite_btn.clickCallback = ClickCallback_yy_invite_btn;
	}
}
//--
private function ClickCallback_yy_invite_btn(caller : iGUIElement){
	ExternalFlatform.InviteFriends();
}
//--
function HandleNotifyPartyScoreCoin(evt : GameEvent, obj : Object){
	//var pack : notify_party_score_coin = obj as notify_party_score_coin;
	//PartyScoreCoin_text.label.text = pack.coin.ToString();
	PartyScoreCoin_text.label.text = obj.ToString();
}
//---
function ClickCallback_exchangBtn(caller : iGUIElement){
if(!GameObject.Find("ExchangeGameObject")){
		var exchange_obj : GameObject = new GameObject("ExchangeGameObject");
		if(!exchange_obj.GetComponent("ExchangeComp")){
			exchange_obj.AddComponent("ExchangeComp");
		}
	}	
}
//--
function ClickCallback_addPhyPowerBtn(caller : iGUIElement){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_ADDPHYPOWER_BTN));
}

function clickCallback_makeFoodBtn(caller : iGUIElement){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_BARTENDER_BTN));
}

function clickCallback_changeWaiterBtn(caller : iGUIElement){
	mAutoClosed = false;
	WaiterLogicCenter.GetInstance().OpenWaiterUIRoot();
}

function HandleNotifyCompleteMakeOneProduct(evt : GameEvent, obj : Object){
	if(!BartenderSys.barTenderUI_IsOpened){
		var info : ProductInfoStruct = obj as ProductInfoStruct;
		var food_id : int = info.food_id;
		var baseInfo : BartenderFoodBaseInfoRow = 
						BartenderSys.getInstance().getBartenderSysTableMgr().getFoodBaseInfoRow(food_id);
		var food_productRow : BartenderFoodProductInfoRow = 
							BartenderSys.getInstance().getBartenderSysTableMgr().getProductInfoRow(baseInfo.upgrade_id);
		var icon : String = food_productRow.icon;
		loadCompleteFoodIcon(completeFoodImg, icon);
		completeMakeFoodTipPanel.setEnabled(true);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.START_COMPLETEFOOD_TIP_TIMER));
	}
}

function loadCompleteFoodIcon(img_frm : iGUIImage, img_name : String){
	BartenderSys.getInstance().loadIcon(img_frm, img_name);
}

function HandleCompleteMakeFoodTipTimerEnd(evt : GameEvent, obj : Object){
	completeFoodImg.image = null;
	completeMakeFoodTipPanel.setEnabled(false);
}

function clickCallback_buffButton(caller : iGUIElement)
{
	UI.getUI().OpenUIRoot("BuffUIRoot");
	UI.getUI().SetModal("BuffUIRoot", true);
	}

function mouseOverCallback_buffButton(caller : iGUIElement)
{
	var style : GUIStyle = new GUIStyle();
	style.normal.textColor = Color.white;
	style.fontStyle = FontStyle.Bold;
	var str : String  = Define.getContent(5220);;
	Global.GetSysTooltip().Begin(caller);
	Global.GetSysTooltip().Add(GUIContent(str), style);
	Global.GetSysTooltip().Show(true);
}

function ClickCallback_runSwitchBtn(caller : iGUIElement){
	var normal : String = "MainUI/Btn_run_n";
	var hover : String = "MainUI/Btn_run_h";
	if (null == caller.userData || false == caller.userData) {
		caller.userData = true;
	} else {
		caller.userData = false;
		normal = "MainUI/Btn_walk_n";
		hover = "MainUI/Btn_walk_h";
	}
	UI.SetButtonState(caller, normal, hover, normal);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_RUNSWITCH_BTN));
}

function HandleRefreshBuffIcon(evt:GameEvent, obj:GameObject)
{
	initBuffIcon();
	// 处理豪华卡buff
	BuffLogic.handleDecorateCardBuff();
	
	if(UI.getUI().isUIRootOpen("BuffUIRoot"))
	{
		iGUICode_BuffUIRoot.getInstance().RefreshBuffIcon();
	}
}

private function initBuffIcon() : void
{
	var buffIcon : iGUIElement[] = [buff1, buff2, buff3, buff4, buff5, buff6, buff7];
	var buffIconRes : String[] = ["buff_1.png.u3d", "buff_2.png.u3d", "buff_3.png.u3d", "buff_4.png.u3d", "buff_5.png.u3d", "buff_6.png.u3d", "buff_7.png.u3d"];
	for(var i : int = 0;i < 6; i++)
	{
		var icon : BuffIcon = new BuffIcon(buffIcon[i] as iGUIButton, buffIconRes[i]);
	}
	
	var buffList : Array = BuffLogic.getBuffList();
	var mBuffIcon : Array = new Array();
	for(i = 0;i < buffList.length; i++)
	{
		var buff : BuffInfo = buffList[i];
		var second : int = BuffLogic.getLeftSecond(buff);		
		var buffRow : NewBuffRow = BuffLogic.getBuffRow(buff.data.id);
		var iconRes = "";
		if(second <= buff.data.rest_time)
		{
			iconRes = buffRow.normal_icon;
			icon = new BuffIcon(buffIcon[buffRow.type - 1] as iGUIButton, iconRes);
		}		
	}
	// 处理变身buff图标
	mEffectAvatar = TransformLogic.GetInstance().getEffect();
	if(mEffectAvatar != null)
	{
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_USE_PROP_INIT_UI),mEffectAvatar);
	}
}

// alter by zlj 派对请喝酒按钮回调
private function ClickCallback_buyTheDrinkBtn(caller : iGUIElement)
{
    var x : float = caller.positionAndSize.x;
	var y : float = caller.positionAndSize.y - 85;
	//iGUICode_BuyTheDrinksUI.openBuyTheDrinksPanel(x, y);
}
// 派对请喝酒按钮状态
public function showPartyDrinkBtn(bShow : boolean)
{
    buyTheDrinkBtn.setEnabled(bShow); 
}

// 刷新人物魅力值
private function ClickCallback_refreshCharmBtn(caller : iGUIElement)
{
    refreshCharmBtn.passive = true;
    refreshCharmBtn.style.normal.background = Resources.Load("UISkins/Textures/MainUI/refresh_charm_g");
   
    // 向服务器请求刷新魅力值
    var req : req_calc_player_charm = new req_calc_player_charm();
    NetHelper.Send(req);
    
    createTimer();
}

// 创建定时器
private function createTimer()
{
    --mCdTime;
    if(null == mTimer)
    {
        mTimer = new Timer(1000, mCdTime); 
	    mTimer.addEventListener(TimerEvent.TIMER_COMPLETE, overTime);
		mTimer.Start();
    }
}

// 定时结束触发
private function overTime(_timer : Timer, obj : System.Object)
{
	refreshCharmBtn.passive = false;
    refreshCharmBtn.style.normal.background = Resources.Load("UISkins/Textures/MainUI/refresh_charm_n");
    destroyTimer();
}

// 销毁定时器
private function destroyTimer()
{
    if(mTimer)
    {   
        mTimer.removeEventListener(TimerEvent.TIMER);
        mTimer = null;
    }
}

