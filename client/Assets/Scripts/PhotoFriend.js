#pragma strict
#pragma downcast
/*--------------------------------------------------
照片交友(2012/3/15 create by Y3)
--------------------------------------------------*/
//交友列表
var photo_list:ArrayList = null;
//交友UI的Slot引用
var slotImage:Array = new Array();
var slotName:Array = new Array();
var btnVisit:Array = new Array();
var btnFocus:Array = new Array();

//头像控制类
var shlc:ShowHeadListClass = new ShowHeadListClass();

//是否回家时候要自动弹出交友界面
var autoOpenUI:boolean = false;

//计时器, 计算照片刷新的时间
var lastChangeFriendTime:float = 0;


//照片显示的数量
private static var SLOT_NUM : int = 10;
//刷新照片交友的间隔时间
private static var CHANGE_TIME : float = 10.0f;

//--------------------------------------------------
private static var instance : PhotoFriend;
function Awake()
{
	instance = this;
	autoOpenUI = false;	//初始化设置无效, 日
	registerEvents();
}
static function getInstance()
{
	return instance;
}
function gui():iGUICode_PhotoFriend
{
	return iGUICode_PhotoFriend.getInstance();
}

function Update() {
	shlc.update();
	
	//计算换一换倒计时
	var root:iGUIRoot = UI.getUI().GetUIRoot("PhotoFriendUI");
	if(root && root.enabled)
	{
		var curr = Time.time;
		if( curr - lastChangeFriendTime > CHANGE_TIME)	//大于间隔时间后才可以请求
		{
			enableChnageFriend(true);
		}
		
		updateCountdown();
	}

}
//--------------------------------------------------
// 注册事件
public function registerEvents()
{
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_SELF_HOUSE), HandleEnterSelfHouse);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_FRIEND_HOUSE), HandleEnterFriendHouse);

	//net event
	NetHelper.RegistHandler(new notify_opposite_sex_photos(), notifyOppositeSexPhotos);
}

function HandleEnterSelfHouse(evt:GameEvent, obj:System.Object)
{
	closeUI();
	
	//根据需求还需要打开界面
	if(autoOpenUI)
		clickPhotoFriend();
}

function HandleEnterFriendHouse(evt:GameEvent, obj:System.Object) {
	closeUI();
}

function reqOppositeSexPhotos()
{
	var packet:req_opposite_sex_photos = new req_opposite_sex_photos();
	NetHelper.Send(packet);
	
	enableChnageFriend(false);
}

function notifyOppositeSexPhotos(vt:GameEvent, pack:notify_opposite_sex_photos)
{
	photo_list = pack.photos;
	//Debug.Log("Photo count"+photo_list.Count);
	//设置新的头像数据
	shlc.setNewDataList(photo_list, callbackHeadSlot, IMAGE_TYPE.IMGTYPE_BIG);
	updatePhotoSlot();
}

//更新显示照片列表
function updatePhotoSlot()
{
	if(photo_list == null)
		return;
		
	var i:int;
	var num:int = photo_list.Count;
	
	if(num > SLOT_NUM)
		num = SLOT_NUM;
	
	//更新照片
	for(i = 0; i < num; i++)
	{
		//更新照片
		shlc.downloadByIndex(i);
		if((photo_list[i] as player_basic_information).nickname == "")
			(slotName[i] as iGUILabel).label.text = Define.unknow;
		else
			(slotName[i] as iGUILabel).label.text = Global.limitTextLength((photo_list[i] as player_basic_information).nickname, 5, "未知", "...");
		(slotImage[i] as iGUIElement).setEnabled(true);
		(slotName[i] as iGUIElement).setEnabled(true);
		(btnVisit[i] as iGUIElement).setEnabled(true);
		(btnFocus[i] as iGUIElement).setEnabled(true);
	}
	
	//清空多余的slot
	for(i = num; i < SLOT_NUM; i++)
	{
		(slotImage[i] as iGUILabel).style.normal.background = null;
		(slotName[i] as iGUILabel).label.text = "";
		(slotImage[i] as iGUIElement).setEnabled(false);
		(slotName[i] as iGUIElement).setEnabled(false);
		(btnVisit[i] as iGUIElement).setEnabled(false);
		(btnFocus[i] as iGUIElement).setEnabled(false);
	}
}

//显示头像的回调
function callbackHeadSlot(index:int, www:WWW):void
{
	(slotImage[index] as iGUILabel).style.normal.background = www.texture;
}


//-------------UI事件------------------
//点击照片交友按钮
function clickPhotoFriend()
{
	//如果没有UI就创建他
	if(UI.getUI().GetUIRoot("PhotoFriendUI") == null)
    {
        UI.getUI().OpenUIRoot("PhotoFriendUI");
        UI.getUI().EnableUIRoot("PhotoFriendUI",false);
        gui().syncToList();
	}

	//打开界面, 设置模态
	UI.getUI().EnableUIRoot("PhotoFriendUI",true);
	UI.getUI().SetModal("PhotoFriendUI", true);
	
	//如果目前没数据, 请求新照片
	if(photo_list == null || photo_list.Count == 0)
		reqOppositeSexPhotos();
		
	//
	autoOpenUI = true;
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_OPEN_POTOFRIEND));
}

//点击界面关闭按钮
function clickCloseBtn()
{
	closeUI();
	
	autoOpenUI = false;
}

//关闭UI
function closeUI()
{
	//如果界面不存在, 则返回
	if(UI.getUI().GetUIRoot("PhotoFriendUI") == null)
		return;
		
	UI.getUI().EnableUIRoot("PhotoFriendUI",false);
	UI.getUI().SetModal("PhotoFriendUI", false);
}

//点击拜访按钮
function clickVisitBtn(i:int)
{
	//按钮可以按, photo_list就不会越界
	PlayerFriend.GetInstance().ReqEnterFriendHouse((photo_list[i] as player_basic_information).account,enter_house_type.eht_photo_friend);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_VISIT_PHOTOFRIEND));	
}

//点击关注按钮
function clickFocusBtn(i:int)
{
	FollowLogic.GetInstance().AddAttention((photo_list[i] as player_basic_information).account);
}

//点击换一换按钮
function clickChangeFriendBtn()
{
	//需要时间限制
	var curr = Time.time;
	if( curr - lastChangeFriendTime > CHANGE_TIME)	//大于间隔时间后才可以请求
	{
		reqOppositeSexPhotos();
	}
}

//
function enableChnageFriend(b:boolean)
{
	if(b)
	{
		gui().changeFriend.style.normal.background = Resources.Load("UISkins/Textures/photofriend/chose_btn");
		gui().changeFriend.style.hover.background = Resources.Load("UISkins/Textures/photofriend/chose_btn_hover");
		gui().changeFriend.style.active.background = Resources.Load("UISkins/Textures/photofriend/chose_btn");
	}
	else
	{
		gui().changeFriend.style.normal.background = Resources.Load("UISkins/Textures/photofriend/chose_btn_gray");
		gui().changeFriend.style.hover.background = Resources.Load("UISkins/Textures/photofriend/chose_btn_gray");
		gui().changeFriend.style.active.background = Resources.Load("UISkins/Textures/photofriend/chose_btn_gray");
	
		lastChangeFriendTime = Time.time;
	}
}

function updateCountdown()
{
	var curr = Time.time;
	if( curr - lastChangeFriendTime > CHANGE_TIME)
	{
		gui().countdown.setEnabled(false);
		gui().countdown_txt.setEnabled(false);
	}
	else
	{
		gui().countdown.setEnabled(true);
		gui().countdown_txt.setEnabled(true);
		gui().countdown.label.text = calcCountdownTime();
	}
}

function calcCountdownTime():String
{
	var curr:float = Time.time;
	var left:float = lastChangeFriendTime + CHANGE_TIME - curr;
	var leftInt:int = left;
	//Debug.Log(left.ToString());
	return leftInt.ToString();
}


//-------------头像请求类------------------
//类似配对的头像请求类的功能. 不过没修改peidui部分的代码, 防止重构导致bug
class HeadClass {
	var www:WWW = null;
	var notify:boolean = false;
	var isRelocation : boolean = false;
}

//显示头像列表的类
class ShowHeadListClass {
	//设置新的数据. data是player_basic_information的数组. callback是成功后的回调函数fun(index:int, www:WWW):void. imageType图片类型,大中小.
	function setNewDataList(dataList:ArrayList, callback : Function, imageType:IMAGE_TYPE)
	{
		clear();
		
		_callback = callback;
		_imageType = imageType;
		_dataList = dataList;
		_headList = new Array(_dataList.Count);
	}
	
	//下载所有头像
	function downloadAll()
	{
		if(_headList == null)
			return;
			
		for(var i:int = 0; i < _dataList.Count; i++)
			downloadByIndex(i);
	}
	
	//下载索引指定的头像
	function downloadByIndex(ix:int)
	{
		if(_headList == null)
			return;
			
		if(_headList[ix])	//有数据
		{
			//加载完成则通知
			if(	(_headList[ix] as HeadClass).www.isDone 
				&& (_headList[ix] as HeadClass).www.error == null 
				&& (_headList[ix] as HeadClass).isRelocation == false )
			{
				_callback(ix, (_headList[ix] as HeadClass).www);
			}
		}
		else				//如果没数据, 请求获取数据
		{
			if((_dataList[ix] as player_basic_information).imageurl == "")
				_headList[ix] = null;
			else
			{	
				//测试用地址	var url : String = "http://image.open.yy.com/avatarurl/281875398";
				var url : String = (_dataList[ix] as player_basic_information).imageurl;
				if(!PlatformMgr.IsPlatYY()){
					url = PlatResLoaderMgr.ImageURLReplace(url, _imageType);
				}
				var head:HeadClass = new HeadClass();
				if(PlatformMgr.IsPlatYY()){
					head.isRelocation = true;
				}
				var www:WWW = new WWW(url);	//下载
				head.www = www;
				_headList[ix] = head;
			}
		}
	}

	//清除列表数据
	function clear()
	{
		_callback = null;
		_dataList = null;
		for(var head in _headList)
		{
	    	if (!head)
	        	continue;
			(head as HeadClass).www.Dispose();
		}
		_headList = null;
	}
	
	function update()
	{
		if(_headList == null)
			return;
	
		for(var i = 0; i < _headList.Count; i++)
		{
			var head:HeadClass = _headList[i];
		    if (!head)
		        continue;
		        
			//如果下载完成未通知则通知
			if(head.www.isDone && head.www.error == null && !head.notify)
			{
				if(!head.isRelocation){
					head.notify = true;
					_callback(i, head.www);
				}
				else{
					ReLocationCallback(head);
				}
			}
		}
	}
	
	//
	function ReLocationCallback(head : HeadClass) : void{
		var url : String = head.www.text;
		head.isRelocation = false;
		if(url != ""){
			url = PlatResLoaderMgr.ImageURLReplace(url, _imageType);
			head.www = new WWW(url);
		}
	}
	//
	var _headList:Array = null;
	var _dataList:ArrayList = null;
	var _callback : Function;
	var _imageType:IMAGE_TYPE = IMAGE_TYPE.IMGTYPE_NORMAL;
}
