import iGUI;

private static var instance : iGUICode_PartyInviteUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var tip_label2 : iGUILabel;
@HideInInspector
var friend_select_image8 : iGUILabel;
@HideInInspector
var friend_photo_image8 : iGUILabel;
@HideInInspector
var friend_name_label8 : iGUILabel;
@HideInInspector
var friend_level_label8 : iGUILabel;
@HideInInspector
var friend_bg_image8 : iGUIImage;
@HideInInspector
var friend_item8 : iGUIPanel;
@HideInInspector
var friend_select_image7 : iGUILabel;
@HideInInspector
var friend_photo_image7 : iGUILabel;
@HideInInspector
var friend_name_label7 : iGUILabel;
@HideInInspector
var friend_level_label7 : iGUILabel;
@HideInInspector
var friend_bg_image7 : iGUIImage;
@HideInInspector
var friend_item7 : iGUIPanel;
@HideInInspector
var friend_select_image6 : iGUILabel;
@HideInInspector
var friend_photo_image6 : iGUILabel;
@HideInInspector
var friend_name_label6 : iGUILabel;
@HideInInspector
var friend_level_label6 : iGUILabel;
@HideInInspector
var friend_bg_image6 : iGUIImage;
@HideInInspector
var friend_item6 : iGUIPanel;
@HideInInspector
var friend_select_image5 : iGUILabel;
@HideInInspector
var friend_photo_image5 : iGUILabel;
@HideInInspector
var friend_name_label5 : iGUILabel;
@HideInInspector
var friend_level_label5 : iGUILabel;
@HideInInspector
var friend_bg_image5 : iGUIImage;
@HideInInspector
var friend_item5 : iGUIPanel;
@HideInInspector
var friend_select_image4 : iGUILabel;
@HideInInspector
var friend_photo_image4 : iGUILabel;
@HideInInspector
var friend_name_label4 : iGUILabel;
@HideInInspector
var friend_level_label4 : iGUILabel;
@HideInInspector
var friend_bg_image4 : iGUIImage;
@HideInInspector
var friend_item4 : iGUIPanel;
@HideInInspector
var friend_select_image3 : iGUILabel;
@HideInInspector
var friend_photo_image3 : iGUILabel;
@HideInInspector
var friend_name_label3 : iGUILabel;
@HideInInspector
var friend_level_label3 : iGUILabel;
@HideInInspector
var friend_bg_image3 : iGUIImage;
@HideInInspector
var friend_item3 : iGUIPanel;
@HideInInspector
var friend_select_image2 : iGUILabel;
@HideInInspector
var friend_photo_image2 : iGUILabel;
@HideInInspector
var friend_name_label2 : iGUILabel;
@HideInInspector
var friend_level_label2 : iGUILabel;
@HideInInspector
var friend_bg_image2 : iGUIImage;
@HideInInspector
var friend_item2 : iGUIPanel;
@HideInInspector
var friend_select_image1 : iGUILabel;
@HideInInspector
var friend_photo_image1 : iGUILabel;
@HideInInspector
var friend_name_label1 : iGUILabel;
@HideInInspector
var friend_level_label1 : iGUILabel;
@HideInInspector
var friend_bg_image1 : iGUIImage;
@HideInInspector
var friend_item1 : iGUIPanel;
@HideInInspector
var friend_list : iGUIPanel;
@HideInInspector
var tip_label1 : iGUILabel;
@HideInInspector
var select_all_label : iGUILabel;
@HideInInspector
var select_all_image : iGUILabel;
@HideInInspector
var select_all_bg_image : iGUIImage;
@HideInInspector
var next_page_btn : iGUIButton;
@HideInInspector
var page_label : iGUILabel;
@HideInInspector
var pre_page_btn : iGUIButton;
@HideInInspector
var first_page_btn : iGUIButton;
@HideInInspector
var invite_friend_btn : iGUIButton;
@HideInInspector
var close_btn : iGUIButton;
@HideInInspector
var frame : iGUIPanel;
@HideInInspector
var root : iGUIRoot;



//--------------------------------------------------
function Start()
{
	// step1:界面事件注册
	close_btn.clickCallback = ClickCallback_close_btn;
	first_page_btn.clickCallback = ClickCallback_first_page_btn;
	pre_page_btn.clickCallback = ClickCallback_pre_page_btn;
	next_page_btn.clickCallback = ClickCallback_next_page_btn;
	invite_friend_btn.clickCallback = ClickCallback_invite_friend_btn;
	select_all_bg_image.clickCallback = ClickCallback_select_all_bg_image;
	// step2:创建slots
	createSlots();
	// step3:初始操作
	init();
}
//--------------------------------------------------
function OnDestroy()
{
	clearSlots();
	mSlotArray.Clear();
	mFriendDatas.Clear();
}
//--------------------------------------------------





/***************************************************
*** 界面事件回调
***************************************************/
//--------------------------------------------------
// 点击关闭按钮
function ClickCallback_close_btn(caller : iGUIElement)
{
	UI.getUI().SetModal("PartyInviteUI", false);
	UI.getUI().CloseUIRoot("PartyInviteUI");
}
//--------------------------------------------------
// 点击首页按钮
function ClickCallback_first_page_btn(caller : iGUIElement)
{
	if (1 == mCurPage)
		return;
	
	mCurPage = 1;
	refreshList();
}
//--------------------------------------------------
// 点击向前翻页按钮
function ClickCallback_pre_page_btn(caller : iGUIElement)
{
	if (1 == mCurPage)
		return;
	
	--mCurPage;
	refreshList();
}
//--------------------------------------------------
// 点击向后翻页按钮
function ClickCallback_next_page_btn(caller : iGUIElement)
{
	if (mCurPage == mTotalPageCount)
		return;
	
	++mCurPage;
	refreshList();
}
//--------------------------------------------------
// 点击发送邀请按钮
function ClickCallback_invite_friend_btn(caller : iGUIElement)
{
	// step1:获取邀请帐号
	var invite_friends : Array = new Array();
	for (var data : PartyInviteData in mFriendDatas)
	{
		if (data.select)
		{
			invite_friends.Add(data.info.account);
		}
	}
	// step2:没有邀请帐号
	if (0 == invite_friends.Count)
	{
		UI.getUI().OpenMsgbox("", Define.getContent(5190), true);
		return;
	}
	// step3:关闭界面
	ClickCallback_close_btn(null);
	// step4:发送请求
	Party.request_invite_someone(invite_friends, invitation_type.ivt_private_party);
}
//--------------------------------------------------
// 点击全选图标
function ClickCallback_select_all_bg_image(caller : iGUIElement)
{
	if (0 == mFriendDatas.Count)
		return;
	
	setAllSelected(!select_all_image.enabled, true);
}
//--------------------------------------------------





/***************************************************
*** 界面逻辑
***************************************************/
private var SLOT_NUM : int = 8;							// 每页物品数量
private var mSlotArray : Array = new Array();			// 列表
private var mTotalPageCount : int = 1;					// 总页数
private var mCurPage : int = 1;							// 当前派对页
private var mFriendDatas : Array = new Array();			// 好友数据
//--------------------------------------------------
// 初始操作
private function init() : void
{
	// 数据接收
	var friend_list : ArrayList = Party.Ctrl.Get("invite_list");
	for (var fi : friend_item in friend_list)
	{
		mFriendDatas.Add(new PartyInviteData(fi, false));
	}
	mFriendDatas.Sort(levelCompareFunction);
	// 分页设置
	mTotalPageCount = Page.getPageCountA(mFriendDatas.Count, SLOT_NUM);
	if (0 == mTotalPageCount)
	{
		mTotalPageCount = 1;
	}
	mCurPage = 1;
	refreshList();
	setAllSelected(isAllSelected(), true);
}
//--------------------------------------------------
// 按等级从高到低排序
private function levelCompareFunction(data1 : PartyInviteData, data2 : PartyInviteData) : int
{
	if (data1.info.house_level == data2.info.house_level)
		return 0;
	
	if (data1.info.house_level < data2.info.house_level)
		return 1;
	
	return -1;
}
//--------------------------------------------------
// 创建列表
private function createSlots() : void
{
	for (var i:int=0; i<SLOT_NUM; ++i)
	{
		var element : iGUIElement[] = getItemCtrl(i);
		mSlotArray.Add(new PartyInviteSlot(element[0], element[1], element[2], element[3], element[4], element[5]));
	}
}
//--------------------------------------------------
// 清除列表
private function clearSlots() : void
{
	for (var slot : PartyInviteSlot in mSlotArray)
	{
		slot.setVisible(false);
		slot.setContent(null);
	}
}
//--------------------------------------------------
// 获取物品控件
private function getItemCtrl(index : int) : iGUIElement[]
{
	if (0 == index) return [friend_item1, friend_bg_image1, friend_level_label1, friend_name_label1, friend_photo_image1, friend_select_image1];
	if (1 == index) return [friend_item2, friend_bg_image2, friend_level_label2, friend_name_label2, friend_photo_image2, friend_select_image2];
	if (2 == index) return [friend_item3, friend_bg_image3, friend_level_label3, friend_name_label3, friend_photo_image3, friend_select_image3];
	if (3 == index) return [friend_item4, friend_bg_image4, friend_level_label4, friend_name_label4, friend_photo_image4, friend_select_image4];
	if (4 == index) return [friend_item5, friend_bg_image5, friend_level_label5, friend_name_label5, friend_photo_image5, friend_select_image5];
	if (5 == index) return [friend_item6, friend_bg_image6, friend_level_label6, friend_name_label6, friend_photo_image6, friend_select_image6];
	if (6 == index) return [friend_item7, friend_bg_image7, friend_level_label7, friend_name_label7, friend_photo_image7, friend_select_image7];
	// 7 == index
	return [friend_item8, friend_bg_image8, friend_level_label8, friend_name_label8, friend_photo_image8, friend_select_image8];
}
//--------------------------------------------------
// 设置全选
public function setAllSelected(select_all : boolean, update_all : boolean) : void
{
	select_all_image.setEnabled(select_all);
	if (update_all)		// 更新所有
	{
		// 设置所有数据
		for (var data : PartyInviteData in mFriendDatas)
		{
			data.select = select_all;
		}
		// 设置当前页的界面
		for (var slot : PartyInviteSlot in mSlotArray)
		{
			slot.setSelected(select_all, false);
		}
	}
}
//--------------------------------------------------
// 是否全选
public function isAllSelected() : boolean
{
	if (0 == mFriendDatas.Count)
		return false;
	
	for (var data : PartyInviteData in mFriendDatas)
	{
		if (false == data.select)
			return false;
	}
	return true;
}
//--------------------------------------------------
// 刷新列表
private function refreshList() : void
{
	clearSlots();
	var list : Array = Page.getPageA(mFriendDatas, SLOT_NUM, mCurPage);
	for (var i:int=0; i<list.Count; ++i)
	{
		var slot : PartyInviteSlot = mSlotArray[i] as PartyInviteSlot;
		slot.setVisible(true);
		slot.setContent(list[i]);
	}
	page_label.label.text = mCurPage + "/" + mTotalPageCount;
}
//--------------------------------------------------
// 设置选择好友
public function selectFriend(account : String, select : boolean) : void
{
	for (var data : PartyInviteData in mFriendDatas)
	{
		if (account == data.info.account)
			data.select = select;
	}
}
//--------------------------------------------------


