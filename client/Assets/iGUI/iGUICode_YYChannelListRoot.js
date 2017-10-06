#pragma strict

import iGUI;

public var mListCulNum : int = 2;
public var mChannelItemWide : int = 100;
public var mChannelItemHeight : int = 50;
public var mCulSpace : float = 10f;
public var mRowSpace : float = 10f;
private static var instance : iGUICode_YYChannelListRoot;
private var mCurPage : int = 1;
private var mTotalPage : int = 1;
private var mListRowNum : int = 0;
private var mMyChannelId : UInt64 = 0;
function Awake(){
	instance=this;
	registEvt();
}

function Start(){
	registCallback();
}

static function getInstance(){
	return instance;
}
@HideInInspector
var recommond_bg : iGUILabel;
@HideInInspector
var firstPageBtn : iGUIButton;
@HideInInspector
var myChannelBtn : iGUIButton;

@HideInInspector
var closeChannelListPanelBtn : iGUIButton;
@HideInInspector
var pageNumLbl : iGUILabel;
@HideInInspector
var nextPageBtn : iGUIButton;
@HideInInspector
var prePageBtn : iGUIButton;
@HideInInspector
var nChannelListcontainer : iGUIContainer;
@HideInInspector
var myFavoriteBtn : iGUIButton;
@HideInInspector
var reqHireBtn : iGUIButton;
@HideInInspector
var label3 : iGUILabel;
@HideInInspector
var label2 : iGUILabel;
@HideInInspector
var label1 : iGUILabel;
@HideInInspector
var channelListPanel : iGUIPanel;
@HideInInspector
var yyChannelListRoot : iGUIRoot;

function init(){
	if(mMyChannelId != 0){
		myChannelBtn.setEnabled(true);
	}
	else{
		myChannelBtn.setEnabled(false);
	}
}

function registCallback(){
	closeChannelListPanelBtn.clickCallback = clickCallback_closeChannelListPanelBtn;
	prePageBtn.clickCallback = clickCallback_prePageBtn;
	nextPageBtn.clickCallback = clickCallback_nextPageBtn;
	myChannelBtn.clickCallback = clickCallback_myChannelBtn;
}

function registEvt(){
	//NOTIFY_PUB_LIST
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_PUB_LIST), HandleNotifyChannelList);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CHANNEL_LIST_PAGE_CHANGE), handlePageChange);
}

function HandleNotifyChannelList(evt : GameEvent, obj : Object){
	var pack : notify_pub_list = obj as notify_pub_list;
	mMyChannelId = pack.my_channel_id;
	if(mTotalPage != pack.max_page){
		mTotalPage = pack.max_page;
		setPageNum(mCurPage, mTotalPage);
	}
	init();
	createChannelItems(pack);
}

function createChannelItems(pack : notify_pub_list){
	var  t : ArrayList = pack.pubs;
	var channel_cnt : float = t.Count;
	nChannelListcontainer.removeAll();
	var _result : float = channel_cnt / mListCulNum;
	mListRowNum = System.Math.Ceiling(_result);
	for(var _r_cnt:int=0; _r_cnt < mListRowNum; ++ _r_cnt){
		for(var _c_cnt:int=0; _c_cnt < mListCulNum; ++ _c_cnt){
			var posx : float = _c_cnt * mChannelItemWide;
			var posy : float = _r_cnt * mChannelItemHeight;
			var idx : int = mListCulNum * _r_cnt + _c_cnt;
			if(idx >= 0 && idx < channel_cnt){
				var _channel_info : pub_info = t[idx] as pub_info;
				createChannelItem(_channel_info, mChannelItemWide, mChannelItemHeight, posx, posy, _r_cnt, _c_cnt);
			}
		}
	}

}

function createChannelItem(channel_info : pub_info, wide : int, height : int, posx : float, posy : float, cur_r : int, cur_c : int){
	var channel_panel : iGUIPanel = nChannelListcontainer.addSmartObject("ChannelItemSO") as iGUIPanel;
	channel_panel.setWidth(wide);
	channel_panel.setHeight(height);
	posx = posx + cur_c * mCulSpace;
	posy = posy + cur_r * mRowSpace;
	channel_panel.setX(posx);
	channel_panel.setY(posy);
	var anchorImgFrm : iGUILabel = channel_panel.items[0] as iGUILabel;
	var anchorNameLbl : iGUILabel = channel_panel.items[1] as iGUILabel;
	var channelDescr : iGUILabel = channel_panel.items[2] as iGUILabel;
	var enterChannelBtn : iGUIButton = channel_panel.items[3] as iGUIButton;
	var memberNumLbl : iGUILabel = channel_panel.items[4] as iGUILabel;
	var onlineFlagLbl : iGUILabel = channel_panel.items[5] as iGUILabel;
	var manyuanFlagLbl : iGUILabel = channel_panel.items[6] as iGUILabel;
	
	loadUserInfo(channel_info.owner_info.account, anchorNameLbl, anchorImgFrm);
	setOnlineFlag(onlineFlagLbl, channel_info.status);
	setChannelMemberNums(memberNumLbl, manyuanFlagLbl, channel_info.person_count1, channel_info.person_count2, channel_info.max_person);
	enterChannelBtn.userData = channel_info.pub_id;
	enterChannelBtn.clickCallback = clickCallback_EnterChannelBtn;
}

function setChannelMemberNums(lbl : iGUILabel, manyuanLbl : iGUILabel, num1 : int, num2 : int, max : int){
	lbl.label.text = num1.ToString() + "/" + num2.ToString() + "/" + max.ToString();
	if(num2 == max){
		manyuanLbl.setEnabled(true);
	}
	else{
		manyuanLbl.setEnabled(false);
	}
}

function setOnlineFlag(lbl : iGUILabel, on : int){
	var flag_img : Texture2D = null;
	if(on == 1){ //online
		flag_img = Resources.Load("UISkins/Textures/YYChanne/online") as Texture2D;
	}
	else if(on == 0){ //offline
		flag_img = Resources.Load("UISkins/Textures/YYChanne/offline") as Texture2D;
	}
	
	lbl.style.normal.background = flag_img;
}

function loadUserInfo(account : String, nameLbl : iGUILabel, imgLbl : iGUILabel){
	var user_info : YYUserInfoClass = new YYUserInfoClass();
	user_info.nameElement = nameLbl;
	user_info.imageElement = imgLbl;
	user_info.imageType = IMAGE_TYPE.IMGTYPE_BIG;
	Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(account, user_info);	//281875398	634034620
}

function clickCallback_EnterChannelBtn(caller : iGUIElement){
	var channel_id : UInt64 = Convert.ToUInt64(caller.userData);
	// 进入的是当前的频道,则不必再请求
	if (YYChannelListLogic.getInstance().inPubChannel(channel_id)) {
		YYChannelListLogic.getInstance().closeChannelListRoot();
		// 界面被最小化,则还原为最大化
		if (YYChannelListLogic.getInstance().isVoiceChannelUIMinimize()) {
			YYChannelListLogic.getInstance().maximizeVoiceChannelUI();
		}
	} else {
		reqEnterChannel(channel_id);
	}
}

function reqEnterChannel(channel_id : UInt64){
	var req : req_enter_pub_channel = new req_enter_pub_channel();
	req.pub_id = channel_id;
	NetHelper.Send(req);
}

function clickCallback_closeChannelListPanelBtn(caller : iGUIElement){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_ROOT));
}

function clickCallback_myChannelBtn(caller : iGUIElement){
	if(mMyChannelId != 0){
		reqEnterChannel(mMyChannelId);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_ROOT));
	}
}

function clickCallback_prePageBtn(caller : iGUIElement){
	if(mCurPage <= 1)
		mCurPage = 1;
	else
		-- mCurPage;
	
	changePage(mCurPage);
}

function clickCallback_nextPageBtn(caller : iGUIElement){
	if(mCurPage < mTotalPage)
		++ mCurPage;
	else
		mCurPage = mTotalPage;
	
	changePage(mCurPage);
}

function changePage(page : int){
	YYChannelListLogic.getInstance().reqPubList(page);
}

function setPageNum(curPage : int, totalPage : int){
	pageNumLbl.label.text = curPage.ToString() + "/" + totalPage.ToString();
}

function handlePageChange(evt : GameEvent, obj : Object){
	var page : int = Convert.ToInt32(obj);
	mCurPage = page;
	setPageNum(mCurPage, mTotalPage);
}