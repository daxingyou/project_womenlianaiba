/*--------------------------------------------------
礼物逻辑(2012/3/14 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast
import iGUI;


private static var mInstance : GiftLogic = null;
private var mHideUIArray : Array;									// 被隐藏的界面
var OpenGiftMakeUINotHideRoot : String[];							// 打开礼物制作界面不隐藏得root
var OpenGiftReceiveUINotHideRoot : String[];						// 打开收礼界面不隐藏得root
public static var Ctrl : Controller = new Controller();				// 控制器
public static var FreeGiftBoxPage : Page = new Page();				// 免费的礼盒
public static var ChargeGiftBoxPage : Page = new Page();			// 收费的礼盒
public static var GiftListArray : Array = new Array();				// 礼物清单
public static var GiftRecordArray : Array = new Array();			// 收礼记录
private var mGiftBoxArray : Array = new Array();					// 礼物盒子
private var mGiftBoxRandomGrids : Hashtable = new Hashtable();		// 场景中礼盒模型对应的格子
private var mGiftBoxModels : Hashtable = new Hashtable();			// 场景中的礼盒模型
private var GIFT_BOX_MAX : int = 30;								// 场景中最多几个礼盒
private var mGiftPareObj : GameObject;								// 所有礼物模型的父节点
private var mGiftBoxModelVisible : boolean = true;					// 所有礼盒可见的标识
public var HEIGHT : float = 0.0f;									// 礼盒在场景中的高度


//--------------------------------------------------
function Awake()
{
	mInstance = this;
	_registEvents();
	mGiftPareObj = new GameObject("Gift");
}
//--------------------------------------------------
public static function getInstance() : GiftLogic
{
	return mInstance;
}
//--------------------------------------------------
// 事件注册
private function _registEvents()
{
	// 网络事件注册
	NetHelper.RegistHandler(new notify_send_gift(), handle_notify_send_gift);
	NetHelper.RegistHandler(new notify_house_gift_box_list(), handle_notify_house_gift_box_list);
	NetHelper.RegistHandler(new notify_add_house_gift_box(), handle_notify_add_house_gift_box);
	NetHelper.RegistHandler(new notify_del_house_gift_box(), handle_notify_del_house_gift_box);
	NetHelper.RegistHandler(new notify_receive_gift(), handle_notify_receive_gift);
	NetHelper.RegistHandler(new notify_receive_gift_list(), handle_notify_receive_gift_list);
	NetHelper.RegistHandler(new notify_received_gift_list(), handle_notify_received_gift_list);
	// 普通事件注册
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LEAVE_SCENE), handleEnterHouseScene);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_PUB_SCENE), handleEnterPubScene);
	// 其他事件注册
	Ctrl.Register("click_gift_btn", clickGiftBtn);
	Ctrl.Register("open_gift_make_ui", openGiftMakeUI);
	Ctrl.Register("close_gift_make_ui", closeGiftMakeUI);
	Ctrl.Register("open_gift_box_ui", openGiftBoxUI);
	Ctrl.Register("close_gift_box_ui", closeGiftBoxUI);
	Ctrl.Register("open_gift_receive_ui", openGiftReceiveUI);
	Ctrl.Register("close_gift_receive_ui", closeGiftReceiveUI);
	Ctrl.Register("set_gift_box_visible", setGiftBoxModelVisible);
}
//--------------------------------------------------
// 初始
public function init()
{
	FreeGiftBoxPage.reset(getGiftBoxByType(1), 5, 0);
	ChargeGiftBoxPage.reset(getGiftBoxByType(2), 5, 0);
}
//--------------------------------------------------
// 获取某一类的礼盒
public function getGiftBoxByType(type : int) : Array
{
	var arr : Array = new Array();
	for (var kv : DictionaryEntry in ResManager.LgtMgr.GiftBoxTable)
	{
		var gbr : GiftBoxRow = kv.Value;
		if (type == gbr.type)
		{
			arr.Add(gbr);
		}
	}
	return arr;
}
//--------------------------------------------------
// 获取礼盒
public function getGiftBoxRow(id : int) : GiftBoxRow
{
	if (ResManager.LgtMgr.GiftBoxTable.ContainsKey(id))
	{
		return ResManager.LgtMgr.GiftBoxTable[id];
	}
	throw "Error: GiftLogic -> getGiftBoxRow(int) -> not exist box which id is '" + id + "'!";
}
//--------------------------------------------------
// 请求发送礼物
public static function request_send_gift(gift_instid:UInt64, gift_id:int, receiver:String, sender:String, gift_box:int)
{
	var gift : item = new item();
	gift.instance_id = gift_instid;
	gift.template_id = gift_id;
	var gi : gift_info = new gift_info();
	gi.gift_id = gift_instid;
	gi.receiver = receiver;
	gi.sender = sender;
	gi.gift_box = gift_box;
	gi.gift = gift;
	var packet:req_send_gift = new req_send_gift();
	packet.gift = gi;
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 处理通知请求发送礼物消息
private function handle_notify_send_gift(evt:GameEvent, pack:notify_send_gift)
{
	// type:1.ok,2.fail
	Ctrl.Excute("send_gift_result", pack.type);
}
//--------------------------------------------------
// 处理通知房屋接收所有礼盒消息
private function handle_notify_house_gift_box_list(evt:GameEvent, pack:notify_house_gift_box_list)
{
	// 清除礼盒及模型
	_clearGiftBoxList();
	// 合并男女礼盒列表
	for (var boy_hgi : house_gift_info in pack.boy_boxes)
	{
		mGiftBoxArray.Add(new GiftBoxInfo(boy_hgi, pack.boy));
	}
	for (var girl_hgi : house_gift_info in pack.girl_boxes)
	{
		mGiftBoxArray.Add(new GiftBoxInfo(girl_hgi, pack.girl));
	}
	// 排序,此时最晚收到的礼盒在最后面
	_sortGiftBoxList(mGiftBoxArray);
	// 创建模型,取最早收到的礼盒
	var arr : Array = CommFunc.getArrayFromBegin(mGiftBoxArray, 0, GIFT_BOX_MAX);
	for (var gbi : GiftBoxInfo in arr)
	{
		_createGiftBoxModel(gbi.gift_id, getGiftBoxRow(gbi.gift_box).model);
	}
}
//--------------------------------------------------
// 处理通知玩家接收新礼盒消息
private function handle_notify_add_house_gift_box(evt:GameEvent, pack:notify_add_house_gift_box)
{
	// 添加到礼盒列表,由于传过来的是按最新的礼物排最上面,所以这里需要反转
	for (var i:int=pack.boxes.Count-1; i>=0; --i)
	{
		mGiftBoxArray.Add(new GiftBoxInfo(pack.boxes[i], pack.account));
	}
	// 补满礼物模型
	_fillGiftBoxModel(GIFT_BOX_MAX);
}
//--------------------------------------------------
// 处理通知玩家删除礼盒消息
private function handle_notify_del_house_gift_box(evt:GameEvent, pack:notify_del_house_gift_box)
{
	// 删除礼盒
	for (var hgi : house_gift_info in pack.boxes)
	{
		_delGiftBox(hgi.gift_id);
	}
	// 补满礼物模型
	_fillGiftBoxModel(GIFT_BOX_MAX);
}
//--------------------------------------------------
// 请求收礼
public static function request_receive_gift(gift_list : Array)
{
	var packet:req_receive_gift = new req_receive_gift();
	for (var gift_instance_id : UInt64 in gift_list)
	{
		packet.gift_ids.Add(gift_instance_id);
	}
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 处理通知请求收礼消息
private function handle_notify_receive_gift(evt:GameEvent, pack:notify_receive_gift)
{
	// type:1.ok,2.fail
	Ctrl.Excute("receive_gift_result", pack.type);
}
//--------------------------------------------------
// 请求未接收的礼物列表
public static function request_receive_gift_list()
{
	var packet:req_receive_gift_list = new req_receive_gift_list();
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 处理通知请求未接收礼物列表消息
private function handle_notify_receive_gift_list(evt:GameEvent, pack:notify_receive_gift_list)
{
	GiftListArray.Clear();
	for (var gi : gift_info in pack.gift)
	{
		GiftListArray.Add(gi);
	}
	Ctrl.Excute("receive_gift_list_result", null);
}
//--------------------------------------------------
// 请求已接收的礼物列表
public static function request_received_gift_list()
{
	var packet:req_received_gift_list = new req_received_gift_list();
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 处理通知请求已接受礼物列表消息
private function handle_notify_received_gift_list(evt:GameEvent, pack:notify_received_gift_list)
{
	GiftRecordArray.Clear();
	for (var gi : gift_info in pack.gift)
	{
		GiftRecordArray.Add(gi);
	}
	Ctrl.Excute("receive_gift_record_result", null);
}
//--------------------------------------------------
// 根据时间排序礼盒列表
private function _sortGiftBoxList(arr : Array)
{
	for (var i:int=arr.Count-1; i>0; --i)
	{
		var temp_hgi : GiftBoxInfo = null;
		for (var j:int=0; j<i; ++j)
		{
			var pre_gbi : GiftBoxInfo = arr[j];
			var suf_gbi : GiftBoxInfo = arr[j+1];
			if (Global.compareStime(pre_gbi.date, suf_gbi.date) > 0)
			{
				temp_hgi = pre_gbi;
				pre_gbi = suf_gbi;
				suf_gbi = temp_hgi;
			}
		}
	}	
}
//--------------------------------------------------
// 删除单个礼盒
private function _delGiftBox(instance_id : UInt64)
{
	// 销毁模型
	_destroyGiftBoxModel(instance_id);
	// 删除数据
	var temp : GiftBoxInfo = null;
	for (var gbi : GiftBoxInfo in mGiftBoxArray)
	{
		if (instance_id == gbi.gift_id)
		{
			temp = gbi;
			break;
		}
	}
	if (temp)
	{
		mGiftBoxArray.Remove(temp);
	}
}
//--------------------------------------------------
// 清除礼盒列表
private function _clearGiftBoxList()
{
	// 清除模型
	_clearGiftBoxModel();
	// 清除数据
	mGiftBoxArray.Clear();
}
//--------------------------------------------------
// 补充礼盒模型
private function _fillGiftBoxModel(max_num : int)
{
	// 场景中模型已达最大数,则不需再创建模型
	var cur_num : int = mGiftBoxModels.Count;
	if (cur_num >= max_num)
		return;
	
	// 获取最早收到的礼盒并创建
	var arr : Array = CommFunc.getArrayFromBegin(mGiftBoxArray, cur_num, max_num - cur_num);
	for (var gbi : GiftBoxInfo in arr)
	{
		_createGiftBoxModel(gbi.gift_id, getGiftBoxRow(gbi.gift_box).model);
	}
}
//--------------------------------------------------
// 创建礼盒模型
private function _createGiftBoxModel(instance_id : UInt64, model : String)
{
	// 获取不重复的随机格子
	var ignore_grids : Array = new Array();
	for (var kv : DictionaryEntry in mGiftBoxRandomGrids)
	{
		ignore_grids.Add(kv.Value);
	}
	var random_grid : HouseSceneGrid = HouseSceneGrid.getRandomGridInWalkArea(ignore_grids);
	if (null == random_grid)
		throw "Error: GiftLogic -> createGiftBoxModel(UInt64, String) -> ramdom grid is null!";
	
	var pos : Vector3 = random_grid.GetPosition(Space.World) + Vector3(0.0f, HEIGHT, 0.0f);
	// 创建和保存礼盒模型
	mGiftBoxRandomGrids.Add(instance_id, random_grid);
	mGiftBoxModels.Add(instance_id, new GiftBoxModel(model, pos, mGiftPareObj));
}
//--------------------------------------------------
// 删除礼盒模型
private function _destroyGiftBoxModel(instance_id : UInt64)
{
	if (mGiftBoxModels.ContainsKey(instance_id))
	{
		var gbm : GiftBoxModel = mGiftBoxModels[instance_id];
		gbm.destroy();
		mGiftBoxModels.Remove(instance_id);
		mGiftBoxRandomGrids.Remove(instance_id);
	}
}
//--------------------------------------------------
// 清除礼盒模型
private function _clearGiftBoxModel()
{
	for (var kv : DictionaryEntry in mGiftBoxModels)
	{
		var gbm : GiftBoxModel = kv.Value;
		gbm.destroy();
	}
	mGiftBoxModels.Clear();
	mGiftBoxRandomGrids.Clear();
}
//--------------------------------------------------
// 显示/隐藏礼盒模型
public function setGiftBoxModelVisible(param : System.Object) : void
{
	mGiftBoxModelVisible = param;
	for (var kv : DictionaryEntry in mGiftBoxModels)
	{
		var gbm : GiftBoxModel = kv.Value;
	 	gbm.setVisible(param);
	}
}
//--------------------------------------------------
// 设置二楼礼盒显示/隐藏
public function setUpStairsGiftBoxModelsVisible(visible : boolean) : void
{
	// 被强制设置为所有礼盒隐藏,故不能设置显示,除非被解除强制设置为隐藏
	if (false == mGiftBoxModelVisible)
		return;
	
	var arr : Array = getGiftBoxModelsByFloorNum(2);
	for (var gbm : GiftBoxModel in arr)
	{
		gbm.setVisible(visible);
	}
}
//--------------------------------------------------
// 获取某一层的所有礼盒模型
public function getGiftBoxModelsByFloorNum(num : int) : Array
{
	var arr : Array = new Array();
	for (var kv : DictionaryEntry in mGiftBoxRandomGrids)
	{
		var grid : HouseSceneGrid = kv.Value;
		if (num == grid.Creator.FloorNO)
		{
			arr.Add(mGiftBoxModels[kv.Key]);
		}
	}
	return arr;
}
//--------------------------------------------------
// 处理进入房屋场景事件
public function handleEnterHouseScene(evt:GameEvent, obj:System.Object)
{
	_clearGiftBoxList();
}
//--------------------------------------------------
// 处理进入酒吧场景事件
public function handleEnterPubScene()
{
	_clearGiftBoxList();
}
//--------------------------------------------------
// 点击礼物按钮
public function clickGiftBtn(param : System.Object) : void
{
	// 自己家打开收礼界面,别人家打开制作礼物界面
	if (DataCenter.isInSelfHouse())
	{
		openGiftReceiveUI(true);
	}
	else
	{
	/*
		// 房屋主人单身,直接打开制作界面,否则打开选择性别界面
		if (DataCenter.isHostSingle())
		{
			var account : String = DataCenter.getMaleHostAccount();
			if ("" == account)
			{
				account = DataCenter.getFemaleHostAccount();
			}
			Ctrl.Set("receive_account", account);
		}
		else
		{
			Ctrl.Set("open_select_ui", true);
		}
	*/
		Ctrl.Set("open_select_ui", true);
		openGiftMakeUI(true);
	}
}
//--------------------------------------------------
// 背包是否已打开
public function isStorageUIOpen() : boolean
{
	var ui : iGUICode_StorageBoxUI = iGUICode_StorageBoxUI.getInstance();
	if (ui && true==ui.root.enabled && true==ui.storage.enabled)
		return true;
	
	return false;
}
//--------------------------------------------------
// 礼物制作界面是否打开
public function isGiftMakeUIOpen() : boolean
{
	var ui : iGUICode_GiftMakeUI = iGUICode_GiftMakeUI.getInstance();
	if (ui && true==ui.root.enabled)
		return true;
	
	return false;
}
//--------------------------------------------------
// 打开礼物制作界面
public function openGiftMakeUI(param : System.Object) : void
{
	if (isStorageUIOpen())
	{
		iGUICode_StorageBoxUI.getInstance().exitStorage();
	}
	_openUI("GiftMakeUI", param, OpenGiftMakeUINotHideRoot);
}
//--------------------------------------------------
// 关闭礼物制作界面
public function closeGiftMakeUI(param : System.Object) : void
{
	if (isStorageUIOpen())
	{
		iGUICode_StorageBoxUI.getInstance().exitStorageForMakeGift();
	}
	_closeUI("GiftMakeUI", param);
}
//--------------------------------------------------
// 打开礼盒界面
public function openGiftBoxUI(param : System.Object) : void
{
	UI.getUI().EnableUIRoot("GiftMakeUI", false);
	_openUI("GiftBoxUI", false, null);
}
//--------------------------------------------------
// 关闭礼盒界面
public function closeGiftBoxUI(param : System.Object) : void
{
	_closeUI("GiftBoxUI", false);
	UI.getUI().EnableUIRoot("GiftMakeUI", true);
}
//--------------------------------------------------
// 打开收礼界面
public function openGiftReceiveUI(param : System.Object) : void
{
	_openUI("GiftReceiveUI", param, OpenGiftReceiveUINotHideRoot);
}
//--------------------------------------------------
// 关闭收礼界面
public function closeGiftReceiveUI(param : System.Object) : void
{
	_closeUI("GiftReceiveUI", param);
}
//--------------------------------------------------
// 打开界面
private function _openUI(ui : String, hide : boolean, hide_arr : Array) : void
{
	if (hide)	// 隐藏其他root
	{
		mHideUIArray = UI.getUI().EnableUIRootIgnore(hide_arr, false);
	}
	UI.getUI().OpenUIRoot(ui);
	UI.getUI().SetModal(ui, true);
}
//--------------------------------------------------
// 关闭界面
private function _closeUI(ui : String, recover_hided : boolean) : void
{
	UI.getUI().SetModal(ui, false);
	UI.getUI().CloseUIRoot(ui);
	if (recover_hided)	// 还原被隐藏得root
	{
		UI.getUI().EnableUIRoot(mHideUIArray, true);
		mHideUIArray.Clear();
	}
	Global.GetSysTooltip().Hide();
}
//--------------------------------------------------




/*--------------------------------------------------
*** 礼盒选项(制作礼物时用到)
--------------------------------------------------*/
class GiftBoxSlot
{
	private var mRow : GiftBoxRow = null;				// 礼盒内容
	private var mImage : iGUIImage = null;				// 图片控件
	private var mAsynIcon : AsynIcon = null;			// 图片异步加载管理器
	
	// 构造
	public function GiftBoxSlot(image : iGUIImage)
	{
		mImage = image;
		mAsynIcon = new AsynIcon(setIcon, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	}
	// 回调
	function setIcon(tex:Texture)
	{
		mImage.image = tex;
	}
	// 设置选项
	function setContent(row : GiftBoxRow)
	{
		if(null == row)
		{
			mRow = null;
			mImage.image = null;
			mAsynIcon.cancel();
			return;
		}
		mRow = row;
		mAsynIcon.load("Icon/" + row.icon); 
	}
	// 显示tip
	function showTooltip()
	{
		if (null == mRow)
			return;
		
		var style : GUIStyle = new GUIStyle(); 	
		style.alignment = TextAnchor.MiddleCenter;
		style.normal.textColor = Color(1.0f, 1.0f, 1.0f);
		style.fontStyle = FontStyle.Bold;
		Global.SysTooltip.Begin(mImage);
		Global.SysTooltip.Add(GUIContent(mRow.name), style); 	
		Global.SysTooltip.Show(true);
	}
	// 获取图片控件
	function getImage() : iGUIImage
	{
		return mImage;
	}
}





/*--------------------------------------------------
*** 礼盒标签(制作礼物时用到)
--------------------------------------------------*/
class GiftBoxTag
{
	private var mPage : Page = null;				// 每个标签对应的页管理器
	public var CurPage : Array = null;				// 当前页的内容
	public var CurSelectBox : GiftBoxRow = null;	// 当前选中的内容
	
	// 构造
	public function GiftBoxTag(pg : Page)
	{
		mPage = pg;
		CurPage = mPage.moveFirstPage();
		select(0);
	}
	// 是否可左移
	public function canMoveLeft() : boolean
	{
		return mPage.canPreMove();
	}
	// 是否可右移
	public function canMoveRight() : boolean
	{
		return mPage.canNextMove();
	}
	// 左移一个
	public function moveLeft() : Array
	{
		CurPage = mPage.movePreOne();
		return CurPage;
	}
	// 右移一个
	public function moveRight() : Array
	{
		CurPage = mPage.moveNextOne();
		return CurPage;
	}
	// 选中
	public function select(index : int) : boolean
	{
		if (index<0 || index>=CurPage.Count)
			return false;
		
		if (CurSelectBox == CurPage[index])
			return false;
		
		CurSelectBox = CurPage[index];
		return true;
	}
}




/*--------------------------------------------------
*** 礼物选项(收礼时用到)
--------------------------------------------------*/
class GiftItemSlot
{
	private var mImage : iGUILabel = null;			// 图片控件
	private var mDate : iGUILabel = null;			// 日期控件
	private var mText : iGUILabel = null;			// 文本控件
	private var mAsynIcon : AsynIcon = null;		// 图片异步加载器
	private var mTipText : String = "";				// tip文字
	private var mState : int = 1;					//
	private var mCancelToken : int = -1;			// 
	public var gift : gift_info = null;				// 礼物信息
	
	// 构造
	public function GiftItemSlot(image : iGUILabel, date : iGUILabel, text : iGUILabel)
	{
		mImage = image;
		mDate = date;
		mText = text;
		mAsynIcon = new AsynIcon(setIcon, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	}
	// 回调
	function setIcon(tex:Texture)
	{
		mImage.style.normal.background = tex;
	}
	// 设置选项
	function setContent(gi : gift_info, icon : String, date : String, state : int, tip : String)
	{
		if(null == gi)
		{
			mImage.style.normal.background = null;
			mDate.label.text = "";
			if (-1 != mCancelToken)
			{
				DataCenter.cancelGetPlayerBasicInfo(mCancelToken);
			}
			mText.label.text = "";
			mAsynIcon.cancel();
			return;
		}
		gift = gi;
		mDate.label.text = date;
		mState = state;
		mCancelToken = DataCenter.getPlayerBasicInfo(gi.sender, setNameCallback);
		mAsynIcon.load("Icon/" + icon);
		mTipText = tip;
	}
	// 设置名字回调
	function setNameCallback(data : Hashtable) : void
	{
		var name : String = (data[gift.sender] as player_basic_information).nickname;
		mText.label.text = getText(name, mState);
	}
	// 获取文本
	private function getText(name : String, state : int) : String
	{
		name = Global.limitTextLength(name, 6, Define.unknow, "...");
		var text : String = "";
		if (1 == state)
		{
			text = Define.getContent(5103, [name]);
		}
		if (2 == state)
		{
			text = Define.getContent(5104, [name]);
		}
		return text;
	}
	// 显示tip
	function showTooltip()
	{
		if ("" == mTipText)
			return;
		
		var style : GUIStyle = new GUIStyle(); 	
		style.alignment = TextAnchor.MiddleCenter;
		style.normal.textColor = Color(1.0f, 1.0f, 1.0f);
		style.fontStyle = FontStyle.Bold;
		Global.SysTooltip.Begin(mImage);
		Global.SysTooltip.Add(GUIContent(mTipText), style); 	
		Global.SysTooltip.Show(true);
	}
	// 获取图片控件
	function getImage() : iGUILabel
	{
		return mImage;
	}
}





/*--------------------------------------------------
*** 礼物分页管理器(收礼时用到)
--------------------------------------------------*/
class GiftItemPage
{
	private var mTotalArray : Array = null;		// 全部数据,引用外部数组
	private var mUseArray : Array = null;		// 使用的数组
	private var mUseNum : int = 0;				// 使用几个
	private var mNumPerPage : int = 0;			// 每页几个
	private var mTotalPageNum : int = 1;		// 总页数
	private var mCurPageNum : int = 1;			// 当前页号
	
	// 构造
	public function GiftItemPage(arr : Array, use_num : int, num_per_page : int)
	{
		mTotalArray = arr;
		mUseNum = use_num;
		mNumPerPage = num_per_page;
		refresh();
	}
	// 刷新
	public function refresh()
	{
		if (0 == mUseNum)	// use_num为0时,使用全部数据
		{
			mUseArray = mTotalArray;
		}
		else
		{
			mUseArray = CommFunc.getArrayFromBegin(mTotalArray, 0, mUseNum);
		}
		mTotalPageNum = Page.getPageCountA(mUseArray.Count, mNumPerPage);
		if (mCurPageNum > mTotalPageNum)
		{
			mCurPageNum = mTotalPageNum;
		}
	}
	// 获取总页数
	public function getTotalPageNum() : int
	{
		if (0 == mTotalPageNum)
			return 1;
		
		return mTotalPageNum;
	}
	// 获取当前页号
	public function getCurPageNum() : int
	{
		if (0 == mTotalPageNum)
			mTotalPageNum = 1;
		
		return mCurPageNum;
	}
	// 获取使用的所有数据
	public function getUseArray() : Array
	{
		return mUseArray;
	}
	// 获取当前页的内容
	public function getCurPage() : Array
	{
		return Page.getPageA(mUseArray, mNumPerPage, mCurPageNum);
	}
	// 第一页
	public function firstPage() : boolean
	{
		if (1 == mCurPageNum)
			return false;
		
		mCurPageNum = 1;
		return true;
	}
	// 前一页
	public function prePage() : boolean
	{
		if (mCurPageNum <= 1)
			return false;
		
		--mCurPageNum;
		return true;
	}
	// 后一页
	public function nextPage() : boolean
	{
		if (mCurPageNum >= mTotalPageNum)
			return false;
		
		++mCurPageNum;
		return true;
	}
}





/*--------------------------------------------------
*** 礼盒模型
--------------------------------------------------*/
class GiftBoxModel
{
	private var mPareObj : GameObject = null;				// 模型父节点
	private var mPos : Vector3;								// 坐标
	private var mVisible : boolean = true;					// 是否可见
	private var mGiftBoxLoader : ModelLoader = null;		// 异步加载器
	
	// 构造
	public function GiftBoxModel(model : String, pos : Vector3, pare : GameObject)
	{
		mPareObj = pare;
		mPos = pos;
		var fullDir : String = "Model/GiftBox/" + model;		// 礼盒模型的完整路径
		mGiftBoxLoader = Global.GetModelLoaderMgr().AsynLoadModel(fullDir, OnLoadFinished, false, false);
	}
	// 回调
	function OnLoadFinished(obj : ModelLoader) : void
	{
		obj.mModelObj.transform.position = mPos;
		if (obj.mModelObj.animation)
		{
			obj.mModelObj.animation.playAutomatically = true;
			obj.mModelObj.animation.wrapMode = WrapMode.Loop;
		}
		obj.mModelObj.transform.parent = mPareObj.transform;
		// 家装下不显示
		if (FitmentLogic.getInstance().inFitmenting)
			return;
		
		setVisible(mVisible);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_GIFT_BOX_LOAD_FINISHED), obj.mModelObj);
	}
	// 销毁
	function destroy() : void
	{
		mGiftBoxLoader.Destroy();
		mGiftBoxLoader = null;
	}
	// 显示/隐藏
	function setVisible(visible : boolean) : void
	{
		mVisible = visible;
		if (null==mGiftBoxLoader || null==mGiftBoxLoader.mModelObj)
			return;
		
		CommFunc.setGameObjVisible(mGiftBoxLoader.mModelObj, visible);
	}
	// 是否显示/隐藏
	function isVisible() : boolean
	{
		return mVisible;
	}
}





/*--------------------------------------------------
*** 礼盒信息
--------------------------------------------------*/
class GiftBoxInfo
{
    public var gift_id : UInt64;		// 礼物实例id
    public var gift_box : int;			// 礼盒模板id
    public var date : stime;			// 收礼日期
	public var account : String;		// 礼物接收者账号
	
	// 构造
	public function GiftBoxInfo(hgi : house_gift_info, receiver : String)
	{
		gift_id = hgi.gift_id;
		gift_box = hgi.gift_box;
		date = hgi.date;
		account = receiver;
	}
}



