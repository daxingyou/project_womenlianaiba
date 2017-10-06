#pragma strict
#pragma downcast
/*--------------------------------------------------
配对(2012/2/21 create by Y3)
--------------------------------------------------*/
enum PeiduiStep {
	None,
	HoldLove,		//牵手爱情阶段
	WaitHoldLove,	//等待牵手返回阶段
	LeaveHold,		//取消牵手阶段
	FindLover,		//寻找爱人阶段
	WaitFindLover	//等待寻找爱人阶段
};
private var step : PeiduiStep = PeiduiStep.None;
var maleQQ:String = "";
var femaleQQ:String = "";
//配对列表
var mateup_list:ArrayList = null;
//配对的头像列表
var mateupHeadList1:Array = null;
//配对列表索引
var mateListIndex:int = -1;
//配对UI的Slot引用
var slotBase:Array = new Array();
var slotName:Array = new Array();
var slotImage:Array = new Array();
private var mSelectDiaOk : boolean = false;
//--------------------------------------------------
private static var instance : Peidui;
function Awake()
{
	instance = this;
	registerEvents();
}
static function getInstance()
{
	return instance;
}
function gui():iGUICode_Peidui
{
	return iGUICode_Peidui.getInstance();
}
//--------------------------------------------------
// 注册事件
public function registerEvents()
{
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_SELF_HOUSE), HandleEnterSelfHouse);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_FRIEND_HOUSE), HandleEnterFriendHouse);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LEAVE_SCENE), HandleLeaveScene);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_SHOW_DIAMOND_BUY_UI), HandleShowDiamondBuyUI);

	//net event
	NetHelper.RegistHandler(new notify_mateup_number(), notifyMateupNumber);
	NetHelper.RegistHandler(new notify_mateup_wait(), notifyMateupWait);
	NetHelper.RegistHandler(new notify_mateup_list(), notifyMateupList);
	NetHelper.RegistHandler(new notify_mateup_success(), notifyMateupSuccess);
	NetHelper.RegistHandler(new notify_mateup_fail(), notifyMateupFail);
	NetHelper.RegistHandler(new notify_house_warming(), notifyHouseWarming);
}


function HandleEnterSelfHouse(evt:GameEvent, obj:System.Object) {
	var data : house_info = EQGameSceneMgr.getSingleton().getHouse().getHouseInfo();
	//如果没用户, 且已经配对. 测试阶段, 让自己也能用
	if(data.boy == "" && data.girl == "" ||
		data.boy != "" && data.girl != "")
		return;
	
	//创建UI
    if(UI.getUI().GetUIRoot("PeiduiUI") == null)
    {
        UI.getUI().OpenUIRoot("PeiduiUI");
        slotBase.Add(gui().spSlotBase1);
        slotBase.Add(gui().spSlotBase2);
        slotBase.Add(gui().spSlotBase3);
        slotName.Add(gui().spSlotName1);
        slotName.Add(gui().spSlotName2);
        slotName.Add(gui().spSlotName3);
        slotImage.Add(gui().spSlotImage1);
        slotImage.Add(gui().spSlotImage2);
        slotImage.Add(gui().spSlotImage3);
    }
        
	
	//
	var gui:iGUICode_Peidui = gui();

	//清除状态
	step = PeiduiStep.None;
	//复位所有状态
	UI.getUI().EnableUIRoot("PeiduiUI",true);
	//判定是否显示男女头像
	if(data.boy == "")
	{
		gui.MalePanel.setEnabled(true);
		gui.FemalePanel.setEnabled(false);
		iGUICode_MainUI.getInstance().male_photo.setEnabled(false);
	}
	else
	{
		gui.MalePanel.setEnabled(false);
		gui.FemalePanel.setEnabled(true);
		iGUICode_MainUI.getInstance().female_photo.setEnabled(false);
	}
	updateProfilePanel();
	showAndUpdatePeiduiPanel();
}

function HandleEnterFriendHouse(evt:GameEvent, obj:System.Object) {
	//Debug.Log("HandleEnterFriendHouse call!");
	if(UI.getUI().GetUIRoot("PeiduiUI") == null)
		return;

	//删除组件
	slotBase.Clear();
	slotName.Clear();
	slotImage.Clear();
	UI.getUI().CloseUIRoot("PeiduiUI");
	Debug.Log("HandleEnterFriendHouse: PeiduiUI CloseUIRoot!");
}

function HandleLeaveScene(evt:GameEvent, obj:System.Object) {
	if(UI.getUI().GetUIRoot("PeiduiUI") == null)
		return;
		
	//离开配对
	leavePeidui();
	//恢复头像
	iGUICode_MainUI.getInstance().female_photo.setEnabled(true);
	iGUICode_MainUI.getInstance().male_photo.setEnabled(true);
	//
	UI.getUI().EnableUIRoot("PeiduiUI",false);
}

//点击配对头像
function ClickPeiduiProfile()
{
//	UI.getUI().OpenMsgbox("", "配对功能暂时关闭", true);
//	return;
	if(step != PeiduiStep.None)
		return;
		
	//等级限制
//	if(DataCenter.getMainPlayerCurLv() < 20)
//	{
//		UI.getUI().OpenMsgbox("", Define.getContent(5119), true);
//		return;
//	}
		
	//设置目标状态
	if(!isInWaitingPeuduiQueue())
		step = PeiduiStep.HoldLove;
	else
		step = PeiduiStep.LeaveHold;

	//设置模态
	UI.getUI().SetModal("PeiduiUI", true);

	//同步页面	
	showAndUpdatePeiduiPanel();
}



//更新头像那里的gui表现效果
private function updateProfilePanel()
{
	if(!isInWaitingPeuduiQueue())	
	{
		gui().MaleImage.image = Resources.Load("UISkins/Textures/Peidui/find_her");
		gui().MaleImage.hoverImage = Resources.Load("UISkins/Textures/Peidui/find_her_hover");
		gui().FemaleImage.image = Resources.Load("UISkins/Textures/Peidui/find_her");
		gui().FemaleImage.hoverImage = Resources.Load("UISkins/Textures/Peidui/find_her_hover");
	}
	else
	{
		gui().MaleImage.image = Resources.Load("UISkins/Textures/Peidui/wait_her");
		gui().MaleImage.hoverImage = Resources.Load("UISkins/Textures/Peidui/wait_her_hover");
		gui().FemaleImage.image = Resources.Load("UISkins/Textures/Peidui/wait_her");
		gui().FemaleImage.hoverImage = Resources.Load("UISkins/Textures/Peidui/wait_her_hover");
	}
}

//显示和更新面板
private function showAndUpdatePeiduiPanel()
{
	if(step == PeiduiStep.HoldLove)
	{
		gui().SelectPanel.setEnabled(false);
		gui().Peidui1Panel.setEnabled(true);
		gui().p1MaleQQ.readOnly = false;
		gui().p1MaleQQ.style.normal.textColor = Color(0,0,0,1);
		gui().p1MaleQQ.value = maleQQ;
		gui().p1FemaleQQ.readOnly = false;
		gui().p1FemaleQQ.style.normal.textColor = Color(0,0,0,1);
		gui().p1FemaleQQ.value = femaleQQ;
		gui().p1OK.style.normal.background = Resources.Load("UISkins/Textures/Peidui/hold_love_btn");
		gui().p1OK.style.hover.background = Resources.Load("UISkins/Textures/Peidui/hold_love_btn_hover");
	}
	else if(step == PeiduiStep.WaitHoldLove)
	{
		gui().SelectPanel.setEnabled(false);
		gui().Peidui1Panel.setEnabled(true);
		gui().p1MaleQQ.readOnly = true;
		gui().p1MaleQQ.style.normal.textColor = Color(0.5,0.5,0.5,1);
		gui().p1MaleQQ.value = maleQQ;
		gui().p1FemaleQQ.readOnly = true;
		gui().p1FemaleQQ.style.normal.textColor = Color(0.5,0.5,0.5,1);
		gui().p1FemaleQQ.value = femaleQQ;
		gui().p1OK.style.normal.background = Resources.Load("UISkins/Textures/Peidui/hold_love_btn_hover");
		gui().p1OK.style.hover.background = Resources.Load("UISkins/Textures/Peidui/hold_love_btn_hover");
	}
	else if(step == PeiduiStep.LeaveHold)
	{
		gui().SelectPanel.setEnabled(false);
		gui().Peidui1Panel.setEnabled(true);
		gui().p1MaleQQ.readOnly = true;
		gui().p1MaleQQ.style.normal.textColor = Color(0.5,0.5,0.5,1);
		gui().p1MaleQQ.value = maleQQ;
		gui().p1FemaleQQ.readOnly = true;
		gui().p1FemaleQQ.style.normal.textColor = Color(0.5,0.5,0.5,1);
		gui().p1FemaleQQ.value = femaleQQ;
		gui().p1OK.style.normal.background = Resources.Load("UISkins/Textures/Peidui/cancel_hold_btn");
		gui().p1OK.style.hover.background = Resources.Load("UISkins/Textures/Peidui/cancel_hold_btn_hover");
	}
	else if(step == PeiduiStep.FindLover)
	{
		gui().Peidui1Panel.setEnabled(false);
		gui().PanCost.setEnabled(false);
		gui().PanCheckMerry.setEnabled(false);
		gui().SelectPanel.setEnabled(true);
	}
	else if(step == PeiduiStep.WaitFindLover)
	{
		gui().Peidui1Panel.setEnabled(false);
		gui().PanCost.setEnabled(false);
		gui().PanCheckMerry.setEnabled(false);
		gui().SelectPanel.setEnabled(true);
	}
	else
	{
		gui().Peidui1Panel.setEnabled(false);
		gui().SelectPanel.setEnabled(false);
		gui().PanCost.setEnabled(false);
		gui().PanCheckMerry.setEnabled(false);
	}
}

final var QQPattern:String = "^\\d{5,14}$";

function validateQQNumber(number:String)
{
		if(String.IsNullOrEmpty(number))
		{
			return false;
		}
		var number1 : String = number.Trim();
		return Regex.IsMatch(number1, QQPattern);
}

//牵手爱情或者取消牵手
function holdLeaveLove()
{
	if(step == PeiduiStep.HoldLove)
	{
		var m:String = gui().p1MaleQQ.value;
		m = m.Trim();
		var f:String = gui().p1FemaleQQ.value;
		f = f.Trim();
		if(!validateQQNumber(m) || !validateQQNumber(f))
		{
			UI.getUI().OpenMsgbox("", Define.getContent(5120), true);
			return;
		}
		if(m==f)
		{
		    UI.getUI().OpenMsgbox("", Define.getContent(5121), true);
		    return;
		}
		
		gui().EnableMerryCheck(true);
	}
	else if(step == PeiduiStep.LeaveHold)
	{
		step = PeiduiStep.HoldLove;
		
		showAndUpdatePeiduiPanel();
	}
}

function CheckSureMerry() {
	step = PeiduiStep.WaitHoldLove;
	
	var m:String = gui().p1MaleQQ.value;
	m = m.Trim();
	var f:String = gui().p1FemaleQQ.value;
	f = f.Trim();
				
	//赋值qq
	gui().p1MaleQQ.value = m;
	maleQQ = m;
	gui().p1FemaleQQ.value = f;
	femaleQQ = f;

	showAndUpdatePeiduiPanel();
		
	//发送给服务器
	var packet:req_mateup = new req_mateup();
	packet.boy_number = maleQQ;
	packet.girl_number = femaleQQ;
	NetHelper.Send(packet);
}

//关闭配对1面板1的页面
function closePeidui1()
{
	if(step != PeiduiStep.HoldLove && step != PeiduiStep.LeaveHold)
		return;
		
	leavePeidui();
}

//关闭选择配对玩家的页面
function closeSelectPanel(delaymMat:boolean)
{
	if(step == PeiduiStep.WaitFindLover)
		return;
	
	leavePeidui();
	updateProfilePanel();
}

//离开配对页面
private function leavePeidui()
{
	//设置状态
	step = PeiduiStep.None;
	
	//
	showAndUpdatePeiduiPanel();
	
	//清除配对列表数据
	clearMateList();

	//取消模态
	UI.getUI().SetModal("PeiduiUI", false);
}

//是否在等待配对队列
function isInWaitingPeuduiQueue()
{
	if(maleQQ == "" && femaleQQ == "")
		return false;
	else
		return true;
}


//点击配对的头像
function clickMateSlot(ix:int)
{
	if(mateListIndex == -1)
		return;
	
	//只有在寻找爱人阶段可以点击
	if(step == PeiduiStep.WaitFindLover)
		return;
	
	var index:int = mateListIndex + ix;
	if(index >= mateup_list.Count)
		return;
	
	peiduiIndex = index;
	
	//对话框确认
	UI.getUI().OpenMsgbox("", Define.getContent(5122, [(mateup_list[index] as player_basic_information).nickname]), 
		Define.ok, callback_selectDiaOK as iGUIEventCallback, Define.cancel, callback_selectDiaCancel as iGUIEventCallback);	
}

var peiduiIndex:int = -1;
//选择配对角色对话框确认回调
function callback_selectDiaOK(caller:iGUIElement)
{
	var packet:req_mateup_select = new req_mateup_select();
	packet.match_account = (mateup_list[peiduiIndex] as player_basic_information).account;
	NetHelper.Send(packet);
	
	step = PeiduiStep.WaitFindLover;
	mSelectDiaOk = true;
}

function HandleShowDiamondBuyUI(evt:GameEvent, obj:boolean)
{
	if (obj && mSelectDiaOk)
	{
		mSelectDiaOk = false;
		step = PeiduiStep.FindLover;
	}
}

//选择配对角色对话框取消回调
function callback_selectDiaCancel(caller:iGUIElement)
{
}

//--------------------网络消息-----------------------
//收到配对的qq
function notifyMateupNumber(evt:GameEvent, pack:notify_mateup_number)
{
	maleQQ = pack.boy_number;
	femaleQQ = pack.girl_number;
}

//收到情侣等待的通知
function notifyMateupWait(evt:GameEvent, pack:notify_mateup_wait)
{
	if(step != PeiduiStep.WaitHoldLove)	//必定为这种状态. 防御性编程
		return;
		
	step = PeiduiStep.LeaveHold;
	
	showAndUpdatePeiduiPanel();
	updateProfilePanel();
	closePeidui1();
}

//收到可以配对的情侣列表
function notifyMateupList(evt:GameEvent, pack:notify_mateup_list)
{
	if(step != PeiduiStep.WaitHoldLove)	//必定为这种状态. 防御性编程
		return;

	step = PeiduiStep.FindLover;
	
	showAndUpdatePeiduiPanel();
	beginMateList(pack.mateup_list);
}

function notifyMateupSuccess(vt:GameEvent, pack:notify_mateup_success)
{
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.SENDMSGTOYYSUBCHANNEL), 
												new MsgToYYParams(SENDTO_YYSUBCHANNEL_MSGTYPE.FROM_PEIDUI, 
												pack.boy.nickname, pack.girl.nickname));
	//离开配对页面
	if(step == PeiduiStep.WaitFindLover)
	{
		step = PeiduiStep.FindLover;
		closeSelectPanel(false);
	}

	//不显示重复登录
	Login.m_avoidRepeatLoginDia = true;
	
    if(UI.getUI().GetUIRoot("PeiduiSuccessOK") == null)
    {
        UI.getUI().OpenUIRoot("PeiduiSuccessOK");
        UI.getUI().SetModal("PeiduiSuccessOK", true);
	}
}

function notifyMateupFail(vt:GameEvent, pack:notify_mateup_fail)
{
	if(step == PeiduiStep.WaitFindLover)
		step = PeiduiStep.FindLover;
	
	UI.getUI().OpenMsgbox("", pack.message, true);
}

function notifyHouseWarming(vt:GameEvent, pack:notify_house_warming)
{
	// 玩家完成新手后,每次登陆需要出现的公告
	NoticeLogic.getInstance().openOnceAfterPair();
	//分享
	ExternalFlatform.Share(share_type.st_pair, pack.desc, pack.title, pack.summary, null);
}

//--------------------翻页处理相关---------------------
function beginMateList(data:ArrayList)
{
	mateListIndex = 0;
	mateup_list = data;
	//创建头像的容器
	mateupHeadList1 = new Array(mateup_list.Count);
	
	updateMateSlot();
}

//清除配对数据
function clearMateList()
{
	mateListIndex = -1;
	mateup_list = null;
	//删除头像对应的数据
	for(var headSlot : PeiduiHeadSlot in mateupHeadList1)
	{
		if (headSlot)
		{
			headSlot.clear();
		}
	}
	mateupHeadList1 = null;
}

function prevPage()
{
	if(mateListIndex == -1)
		return;

	var ix:int = mateListIndex - 3;
	if(ix>=0)
	{
		mateListIndex = ix;
	}
	updateMateSlot();
}

function nextPage()
{
	if(mateListIndex == -1)
		return;

	var ix:int = mateListIndex + 3;
	if(ix<mateup_list.Count)
	{
		mateListIndex = ix;
	}
	updateMateSlot();
}

private function updateMateSlot()
{
	var i:int;
	var ix:int;
	if(mateListIndex == -1)	//如果没数据
	{
		for(i=0; i<3; i++)
		{
			(slotBase[i] as iGUIElement).setEnabled(false);
			(slotName[i] as iGUIElement).setEnabled(false);
			(slotImage[i] as iGUIElement).setEnabled(false);
		}
	}
	else
	{
		for(i=0; i<3; i++)
		{
			ix = i + mateListIndex;
			if(ix < mateup_list.Count)		//如果有数据
			{
				(slotBase[i] as iGUIElement).setEnabled(true);
				(slotName[i] as iGUIElement).setEnabled(true);
				(slotImage[i] as iGUIElement).setEnabled(true);
				
				//设置头像
				setHead(i, ix);
			}
			else							//这个slot没数据
			{
				(slotBase[i] as iGUIElement).setEnabled(false);
				(slotName[i] as iGUIElement).setEnabled(false);
				(slotImage[i] as iGUIElement).setEnabled(false);
			}
		}
	}
}

//在第i个slot设置ix索引的头像
private function setHead(i:int, ix:int)
{
	if(null == mateupHeadList1[ix])	//如果没数据, 请求获取数据
	{
		var pbi : player_basic_information = mateup_list[ix] as player_basic_information;
		
		var headSlot : PeiduiHeadSlot = new PeiduiHeadSlot();
		headSlot.head = slotImage[i];
		headSlot.reqHead(pbi.account);
		mateupHeadList1[ix] = headSlot;
		
		(slotName[i] as iGUILabel).label.text = pbi.nickname;
	}
}

//table merry cost
public function GetMerryCost(lv : int) : int {
	var r : MerryCostRow = ResManager.LgtMgr.MerryCostTable[lv];
	if(r != null) return r.diamond;
		
	return 0;
}


//-------------头像请求相关------------------
class PeiduiHeadSlot extends PlatResInfoCtrl
{
	private var mImageLoader : PlatResLoader = null;
	public var head : iGUILabel = null;
	
	//请求头像
	public function reqHead(acc : String) : void
	{
		mImageLoader = Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(acc, this);
	}
	// 清除事件
	public function clear() : void
	{
		if (mImageLoader)
		{
			mImageLoader.Cancel();
		}
	}
	//overwrite
	public function Callback() : void
	{
		if (null == head)
			return;
		
		if (URLValid)
			head.style.normal.background = image;
		else
			head.style.normal.background = Resources.Load("UISkins/Textures/Common1/default_avatar");
	}
}


