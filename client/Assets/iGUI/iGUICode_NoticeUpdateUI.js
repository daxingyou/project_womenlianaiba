#pragma strict
#pragma downcast
import iGUI;

private static var instance : iGUICode_NoticeUpdateUI;
function Awake(){
	instance=this;
	// 放在这里初始化
	mAsynIcon = new AsynIcon(_setIcon, null);
}
static function getInstance(){
	return instance;
}
@HideInInspector
var close_btn : iGUIButton;
@HideInInspector
var image : iGUILabel;
@HideInInspector
var background : iGUILabel;
@HideInInspector
var root : iGUIRoot;



private var mAsynIcon : AsynIcon = null;		// 异步图像加载
private var mImageArr : Array = new Array();	// 要显示的图片集
private var mCurrIndex : int = 0;				// 当前图片索引


function Start()
{
	close_btn.clickCallback = ClickCallback_close_btn;
}

function ClickCallback_close_btn(caller : iGUIElement)
{
	mAsynIcon.cancel();
	if (false == _setImage())	// 图标播放结束
	{
		mImageArr.Clear();
		mCurrIndex = 0;
		NoticeLogic.getInstance().close();
		// 删除图片资源,减小内存的使用
		for (var image:String in mImageArr)
		{
			Global.GetAsynResMgr().destroyLoader(image, true);
		}
		var show_time : int = caller.userData;
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_SHOW_NOTICE_OVER), show_time);
	}
}
//--------------------------------------------------
// 回调
private function _setIcon(tex : Texture) : void
{
	image.style.normal.background = tex;
}
//--------------------------------------------------
// 切换图片
private function _setImage() : boolean
{
	if (mCurrIndex<0 || mCurrIndex>=mImageArr.Count)
		return false;
	
	Debug.Log("===== notice update image: " + mImageArr[mCurrIndex]);
	mAsynIcon.load(mImageArr[mCurrIndex]);
	++mCurrIndex;
	return true;
}
//--------------------------------------------------
// 增加公告
public function addNotice(row_arr : Array, show_time : int) : void
{
	for (var row : NoticeRow in row_arr)
	{
		mImageArr.Add(row.image);
	}
	close_btn.userData = show_time;
}
//--------------------------------------------------
// 显示
public function show(row_arr : Array, show_time : int) : void
{
	addNotice(row_arr, show_time);
	_setImage();
}
//--------------------------------------------------

