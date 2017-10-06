/******************************************************************************
模型初使化注册
	RegLoad：注册下载列表和回调
		@urls：下载文件url列表
		@autoDel：是否自动删除资源，参考AsynResourceMgr
		@callbackFun：下载完成通知，会在所有资源下载完成会调用
			格式：function OnLoadFinished()
		 	 {
		 		//TODO..........
		 	 }
******************************************************************************/
#pragma strict
#pragma downcast



//只能有一个实例
class ResManager extends MonoBehaviour
{
	class ResLoadInfo
	{
		public function ResLoadInfo(urls : Array, autoDel : boolean)
		{
			Files.AddRange(urls);
			AutoDel = autoDel;
		}
		public var Files : Array = new Array();
		public var AutoDel : boolean = true;
	}
	//--------------------------------------------------
	// 编辑器里设置初始文件
	public var InitFiles : TextAsset = null;
	public var Models : ObjectManager = new ObjectManager();
	public var HouseFiles : XmlManager = new XmlManager();
	public var LogicTables : LogicTableManager = new LogicTableManager();
	public var CurLoadedUrl : String = "";
	// 
	private var mTotalLoadCount : int = 0;					// 总共需要下载数量
	private var mCurLoadCount : int = 0;					// 当前已下载数量
	private var mLoadList : Array = new Array();			// 下载列表
	private var mCallbackList : Array = new Array();		// 下载结束回调列表
	private var mOnBeforeInit : Function = null;			// 下载前回调
	private var mOnLoadState : Function = null;				// 下载中回调
	private var mOnLoadFinished : Function = null;			// 下载后回调
	//
	private static var mInstance : ResManager = null;
	private static var mAsyResMgr : AsynResourceMgr = null;
	public static var ObjMgr : ObjectManager = null;
	public static var HfsMgr : XmlManager = null;
	public static var LgtMgr : LogicTableManager = null;
	public static var platformResMgr : PlatformResMgr = new PlatformResMgr();
	//--------------------------------------------------
	function Start()
	{
		ObjMgr = Models;
		HfsMgr = HouseFiles;
		LgtMgr = LogicTables;
	}
	//--------------------------------------------------
	public static function getInstance() : ResManager
	{
		if (null == mInstance)
		{
			mInstance = GameObject.Find("ResManager").GetComponent("ResManager");
		}
		return mInstance;
	}
	//--------------------------------------------------
	public static function getAsyResMgr() : AsynResourceMgr
	{
		if (null == mAsyResMgr)
		{
			mAsyResMgr = GameObject.Find("Global").GetComponent("AsynResourceMgr");
		}
		return mAsyResMgr;
	}
	//--------------------------------------------------
	// 获取已下载数量
	public function GetLoadCount() : int
	{
		return mCurLoadCount;
	}
	//--------------------------------------------------
	// 获取总共需要下载数量
	public function GetLoadTotal() : int
	{
		return mTotalLoadCount;
	}
	//--------------------------------------------------
	// 是否完成下载
	public function LoadFinished() : boolean
	{
		return mCurLoadCount == mTotalLoadCount;
	}
	//--------------------------------------------------
	// 注册下载列表和回调
	public function RegLoad(urls : Array, callbackFun : Function, autoDel : boolean) : void
	{
		// step1:添加下载文件列表
		mLoadList.Add(new ResLoadInfo(urls, autoDel));
		// step2:注册下载完成回调
		if (callbackFun)
		{
			mCallbackList.Add(callbackFun);
		}
	}
	//--------------------------------------------------
	// 开始下载前准备,解析各下载资源
	public function BeforeStartLoad() : void
	{
		var urls : Array = new Array();
		var sls : String[] = InitFiles.text.Split(["\n", "\r\n"], StringSplitOptions.RemoveEmptyEntries);
		for (var f : String in sls)
		{
			urls.Add(Global.UrlRoot + f);
		}
		RegLoad(urls, null, false);
		Models.RegLoad(this, getAsyResMgr());
		HouseFiles.RegLoad(this, getAsyResMgr());
		LogicTables.RegLoad(this, getAsyResMgr());
	}
	//--------------------------------------------------
	// 开始下载
	public function StartLoad(beforeInitCallback : Function, loadStateCallback : Function, loadFinishCallback : Function) : void
	{
		// step1:
		mCurLoadCount = 0;
		mTotalLoadCount = 0;
		mOnBeforeInit = beforeInitCallback;
		mOnLoadState = loadStateCallback;
		mOnLoadFinished = loadFinishCallback;
		// step2:计算下载总数
		for (var info : ResLoadInfo in mLoadList)
		{
			mTotalLoadCount += info.Files.length;
		}
		// step3:下载
		for (var load : ResLoadInfo in mLoadList)
		{
			for (var url : String in load.Files)
			{
				getAsyResMgr().asynLoad(url, OnLoadFinished, load.AutoDel);
			}
		}
	}
	//--------------------------------------------------
	private function OnLoadFinished(loader : IURLLoader, deleCount : int) : void
	{
		mCurLoadCount += deleCount;
		CurLoadedUrl = loader.getUrl();
		
		if (mOnLoadState)
		{
			mOnLoadState(loader.getFullUrl(), mCurLoadCount, mTotalLoadCount);
		}
		
		if (!LoadFinished())
			return;
		
		if (mOnBeforeInit)
		{
			mOnBeforeInit();
			// 在保证界面刷新完毕在调用数据初使化和结束回调
			Invoke("OnLoadFinishedCall", 0.1);
		}
		else
		{
			OnLoadFinishedCall();
		}
	}
	//--------------------------------------------------
	private function OnLoadFinishedCall() : void
	{
		for (var callback : Function in mCallbackList)
		{
			if (callback)
			{
				callback();
			}
		}
		
		mCallbackList.clear();
		mLoadList.clear();
		
		if (mOnLoadFinished)
		{
			mOnLoadFinished();
		}
	}
	//--------------------------------------------------
}

