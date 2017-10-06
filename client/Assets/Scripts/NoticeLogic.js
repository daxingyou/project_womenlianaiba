#pragma strict
#pragma downcast

/*--------------------------------------------------
公告逻辑(2012/3/13 create by hezhr)
--------------------------------------------------*/


/*--------------------------------------------------
*** 公告表
--------------------------------------------------*/
class NoticeRow
{
	function NoticeRow(n_id : int, n_title : String, n_image : String, n_imageYY : String, n_type : int, n_time : int)
	{
		id = n_id;
		title = n_title;
		if (PlatformMgr.IsPlatQZone() || PlatformMgr.IsPlatPY() || PlatformMgr.IsPlatQTwiter())		// qzone,朋友网,微博
		{
			image = "UI/" + n_image + ".png.u3d";
		}
		else if (PlatformMgr.IsPlatYY())	// YY
		{
			image = "UI/" + n_imageYY + ".png.u3d";
		}
		type = n_type;
		time = n_time;
	}
	
	var id : int;			// 唯一标识
	var title : String;		// 标题,如: "标题"
	var image : String;		// 图片名称(不包含后缀,目录在AssetBundles\UI),如: "notice1"
	var type : int;			// 公告类型,0.公告不在公告界面内的任何一页显示
							//		   1.公告放在更新公告一页
							//		   2.公告放在活动公告一页
	var time : int;			// 显示时刻,0.通过点击公告标题弹出的公告
							//		   1.玩家创建人物后,第一次登陆需要出现的公告
							//		   2.非第一次登陆后需要出现图片
							//		   3.玩家配对成功后,第一次登陆需要出现的公告
}
//--------------------------------------------------





/*--------------------------------------------------
*** 公告逻辑
--------------------------------------------------*/
private var mTable : Array = new Array();
private var mIsOpened : boolean = false;
//--------------------------------------------------
private static var _instance : NoticeLogic = null;
function Awake()
{
	_instance = this;
}
static function getInstance() : NoticeLogic
{
	return _instance;
}
//--------------------------------------------------
// 初始公告表格
public function initTable() : void
{
	/* 
		表内容,策划填写,例: 		(id, title, image, imageYY, type, time)
		mTable.Add(new NoticeRow(1, "标题", "notice", "noticeYY", 1, 1));
	*/
 	mTable.Add(new NoticeRow(1, Define.getContent(5117), "UpdateImage", "UpdateImage_yy", 1, 2));
 	mTable.Add(new NoticeRow(2, Define.getContent(5118), "UpdateImage2", "UpdateImage2", 0, 1));
}
//--------------------------------------------------
// 获取表
public function getTable() : Array
{
	return mTable;
}
//--------------------------------------------------
// 获取行
public function getRow(id : int) : NoticeRow
{
	for (var row : NoticeRow in mTable)
	{
		if (id == row.id)
			return row;
	}
	throw "Error: NoticeLogic -> getRow(int) -> can't find row which id is '" + id + "'!";
}
//--------------------------------------------------
// 获取行
public function getRows(id_arr : Array) : Array
{
	var arr : Array = new Array();
	for (var id : int in id_arr)
	{
		var row : NoticeRow = getRow(id);
		arr.Add(row);
	}
	return arr;
}
//--------------------------------------------------
// 根据所属类别获取所有行
public function getRowsByType(type : int) : Array
{
	var arr : Array = new Array();
	for (var row : NoticeRow in mTable)
	{
		if (type == row.type)
			arr.Add(row);
	}
	return arr;
}
//--------------------------------------------------
// 根据显示时刻获取所有行
public function getRowsByTime(show_time : int) : Array
{
	var arr : Array = new Array();
	for (var row : NoticeRow in mTable)
	{
		if (show_time == row.time)
			arr.Add(row);
	}
	return arr;
}
//--------------------------------------------------
// 打开公告
private function _open(arr : Array, show_time : int) : void
{
	if (0==mTable.Count || 0==arr.Count)
		return;
	
	if (false == mIsOpened)
	{
		mIsOpened = true;
		UI.getUI().OpenUIRoot("NoticeUpdateUI");
		UI.getUI().SetModal("NoticeUpdateUI", true);
		iGUICode_NoticeUpdateUI.getInstance().show(arr, show_time);
	}
	else
	{
		iGUICode_NoticeUpdateUI.getInstance().addNotice(arr, show_time);
	}
}
//--------------------------------------------------
// 关闭公告
public function close() : void
{
	if (false == mIsOpened)
		return;
	
	UI.getUI().SetModal("NoticeUpdateUI", false);
	UI.getUI().CloseUIRoot("NoticeUpdateUI");
	mIsOpened = false;
}
//--------------------------------------------------
// 打开单个公告
public function openSingleNotice(id : int) : void
{
	var arr : Array = new Array();
	arr.Add(id);
	openMultiNotice(arr);
}
//--------------------------------------------------
// 打开多个公告
public function openMultiNotice(id_arr : Array) : void
{
	_open(getRows(id_arr), 0);
}
//--------------------------------------------------
// 玩家创建人物后,第一次登陆需要出现的公告
public function openOnceAfterCreatePlayer() : void
{
	_open(getRowsByTime(1), 1);
}
//--------------------------------------------------
// 非第一次登陆后需要出现图片
public function openAfterNotFirstLogin() : void
{
	_open(getRowsByTime(2), 2);
}
//--------------------------------------------------
// 玩家配对成功后,第一次登陆需要出现的公告
public function openOnceAfterPair() : void
{
	_open(getRowsByTime(3), 3);
}
//--------------------------------------------------


