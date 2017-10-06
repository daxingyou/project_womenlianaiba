using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;
using System.Xml;


public enum URLLoaderState
{
	unload		= 0,
	waiting,
	loading,
	loaded,
	error,
	destroyed,			//remove from AsynResourceMgr. can't use later
}

/* 资源实例的接口.
 * getState()获取资源加载的状态. 特殊情况, 你需要它.
 * getWWW()资源加载完成回调后, 调用这个函数, 获取你需要的资源. 这个是最重要的函数.
 * getUrl()这是你一开始下载传入的地址.
 * getFullUrl()完整的地址, 已经由系统解析补全, 下载时也是用这个地址.
 * isAutoDelete()允许这个资源由AsynResourceMgr.resourceAutoDelete自动删除.
 * removeListener()解除回调, 一般由于AsynResourceMgr.removeDelegate实现.
*/
public interface IURLLoader
{
	URLLoaderState getState();
	WWW getWWW();
	string getUrl();
	string getFullUrl();
	bool isAutoDelete();
	
	void setAutoDelete(bool b);
	int removeListener(AsynResourceMgr.ListenDelegate dele);
}


/* 异步资源管理器
 * 概述: 游戏内的外部资源读取都通过这个类来实现. 这个类实现的主要功能如下.
 * 1. 资源的文件管理, 缓存, 查询.
 * 2. 资源的下载, 通知, 删除. 限定最大的资源下载个数.
 * 3. 资源下载的版本管理, 过期资源需要重新下载.
 * 4. 可自动删除资源来降低内存占用.
 * 5. 简单的错误处理
 * 6. 资源下载不能保证先下载, 先得到通知.
 * 7. url地址由系统自动补全.
 * 
 * 注意:
 * 1. 不要加载非assert bandle的资源(比如jpg). 因为这样做在删除资源的时候会出错.(u3d搓啊) 
 * 
 * 成员方法和属性================================================================
 * 查找有木有下载好的资源
 * public bool hasCompleteLoader(string url)
 * 
 * 查找有木有这个资源. 这个资源可能正在下载或者错误之类的.
 * public bool hasLoader(string url)
 * 
 * 获取指定的资源. 找不到返回空
 * public IURLLoader getLoader(string url)
 * 
 * 异步加载资源
 *   如果资源已经加载, 在下个循环会得到通知, 而不会重复下载同一个资源.
 *   如果同一时间多次调用函数的参数url和dele完全相同, 到时的通知只会有一次, 而不是多次通知. 而通知委托函数的deleCount告诉你
 *   之前调用了asynLoad几次
 * url			url地址
 * dele			回调函数. 只有加载成功或者加载失败会产生回调. 加载失败的回调受到errNotify影响. 通知后, 自动解除这个回调函数.
 * autoDelete	允许自动删除资源. 设置为true, 系统会在一定条件下回收资源, 减少内存占用. 默认值true
 * errNotify 	加载资源失败时, 回调函数dele也会得到通知. 默认值false
 * 返回值		IURLLoader的接口. 
 * public IURLLoader asynLoad(string url, ListenDelegate dele)
 * public IURLLoader asynLoad(string url, ListenDelegate dele, bool autoDelete)
 * public IURLLoader asynLoad(string url, ListenDelegate dele, bool autoDelete = true, bool errNotify = false)
 * 
 * 删除资源
 * unloadAllLoadedObjects	如果为true. 连同资源对应引用资源的实例一并删除. 比如, 资源是一颗树, 且在游戏中有实例可见. 调用
 * 							这方法. 连游戏中的树都没了. 如果为false, 就是单纯的删除资源.
 * omitNotify				如果为false. 则还有用户未被通知时删除这个物件会扔出异常. 这个数值一般情况为false, 除非你明确知道
 * 							其他通知可以忽略. 默认值false.
 * public void destroyLoader(string url, bool unloadAllLoadedObjects)
 * public void destroyLoader(string url, bool unloadAllLoadedObjects, bool omitNotify)
 * 
 * 删除对资源的回调
 *   一般来说, 不需要这个方法, 资源在通知后会自动解除回调. 特定情况需要, 比如. 对正在下载的资源不需要, 且又不删除这个资源.
 *   另外, 如果如果这个资源在还等待状态, 又是可以自动删除, 且调用函数后没有任何通知回调. 则这个资源会被删除, 防止进入下载队列.
 *   就算同一时间多次调用asynLoad函数的参数url和dele完全相同. 解除这个回调只需要调用一次此函数.
 * 返回值		表示解除回调函数时, 之前被asynLoad注册过的次数. 如果没有没注册, 返回0.
 * public int removeDelegate(string url, ListenDelegate dele)
 * 
 * 延迟删除可自动删除的资源, 降低资源的内存占用
 *   用户一般不调用这函数. 在特定情况调用, 比如过场景. 
 *   这个函数会在之前的所有下载请求完成后才执行自动删除工作.
 *   之所以这么做是为了防止用户在多个资源请求期内资源被删除.
 * public void resourceAutoDelete()
 * 
 * 分发回调的消息
 *   用户一般不调用这函数. 一般由管理器调用. 特殊情况. 调用asynLoad加载已经存在的资源, 为了马上获得回调消息
 * public void distribute()
 * 
 * 
 * 可以同时下载资源的最大连接数. 默认是1
 * public int MaxDownloadCount
 * 
 * 获取完整的资源路径. 如果url是以file://或者http://开头. 则认为已经是完整的.
 * static public string fullUrl(string url)
 * 
 * 
 * 回调函数=====================================================================
 * 资源加载完成或者加载错误会得到回调.
 * deleCount表示之前调用asynLoad(string url, ListenDelegate dele)的次数. 当然多次调用中, 参数url和dele一样. 则
 * 每次重复+1. 如果没重复, 这个数值是1.
 * 同一个类的不同实例, delegate函数是不一致的.
 * public delegate void ListenDelegate(IURLLoader loader, int deleCount);
 * 注意delegate关键字. 可以把类的成员函数当参数传入. 比如:
 * class AAA {public void myListen(IURLLoader loader, int deleCount) {} }
 * AAA aaa = new AAA();
 * asynLoad(url, aaa.myListen);  //注意aaa.myListen
 * 
 * 
 * url地址规范==================================================================
 * 一般情况下url地址为逻辑路径就可以.
 * 用fullUrl的把逻辑路径转换为完整路径.
 * 资源存放的路径:
 * web版的路径为/../AssetBundles/ 即webplay的上级目录下的AssetBundles目录.
 * 编辑器版的路径为/../AssetBundles/ 即AssetBundles和Assets目录同级
 * 
 * 
*/
public class AsynResourceMgr : MonoBehaviour
{
	public delegate void ListenDelegate(IURLLoader loader, int deleCount);
	
	public Dictionary<string, int> fileVers = new Dictionary<string, int>();
	
	//
	public bool hasCompleteLoader(string url)
	{
		if(_URLLoaders.ContainsKey(url))
		{
			URLLoader loader = _URLLoaders[url] as URLLoader;
			if(loader.state == URLLoaderState.loaded)
				return true;
		}
		return false;
	}
	
	public bool hasLoader(string url)
	{
		if(_URLLoaders.ContainsKey(url))
			return true;
		else
			return false;
	}
	
	public IURLLoader getLoader(string url)
	{
		if(_URLLoaders.ContainsKey(url))
			return _URLLoaders[url] as URLLoader;
		return null;
	}

	public IURLLoader asynLoad(string url, ListenDelegate dele)
	{
		return asynLoad(url, dele, true, false);
	}
	
	public IURLLoader asynLoad(string url, ListenDelegate dele, bool autoDelete)
	{
		return asynLoad(url, dele, autoDelete, false);
	}
	                           
	public IURLLoader asynLoad(string url, ListenDelegate dele, bool autoDelete, bool errNotify)
	{
		url = url.Trim();
		if("" == url || false == url.EndsWith(".u3d"))
			throw new Exception("AsynResourceMgr -> ansynLoad() -> url["+url+"] is empty or not end with .u3d");
		
		//
		if(!_URLLoaders.ContainsKey(url))
		{
			URLLoader lo = new URLLoader();
			lo.url = url;
			if(fileVers.ContainsKey(url))
			{
				lo.fileVersion = fileVers[url];
			}
			lo.fullUrl = fullUrl(url, lo.fileVersion);
			_URLLoaders.Add(url, lo);
//			Debug.Log("=============== url: "+url+"   verson: "+lo.fileVersion+" =============");
		}
		
		URLLoader loader = _URLLoaders[url] as URLLoader;
		
		// add listener
		loader.addListener(dele, errNotify);
		
		// auto delete
		if(loader.autoDelete == true)
			loader.autoDelete = autoDelete;
		if(_delayAutoDelete)
			loader.preventAutoDelete = true;
		
		URLLoaderState state = loader.state;
		if(state == URLLoaderState.unload)
		{
			putinWaitingList(loader);
			fullDownload();
		}
		else if(state == URLLoaderState.waiting || state == URLLoaderState.loading)
		{
			//nothing
		}
		else if(state == URLLoaderState.loaded || state == URLLoaderState.error)
		{
			//enter to notify list, next update to notify user
			_notifyList.Add(loader);
		}

		return loader;
	}
	
	public void destroyLoader(string url, bool unloadAllLoadedObjects)
	{
		destroyLoader(url, unloadAllLoadedObjects, false);
	}
	
	public void destroyLoader(string url, bool unloadAllLoadedObjects, bool omitNotify)
	{
		if(!_URLLoaders.ContainsKey(url))
			return;
		
		URLLoader loader = _URLLoaders[url] as URLLoader;
		
		destroyLoader(loader, unloadAllLoadedObjects, omitNotify);
		
		//full download
		fullDownload();
	}
	
	public int removeDelegate(string url, ListenDelegate dele)
	{
		if(!_URLLoaders.ContainsKey(url))
			return 0;
		
		URLLoader loader = _URLLoaders[url] as URLLoader;
		int count = loader.removeListener(dele);
		
		//no listener, auto delete, in waiting list.  Destroy immediately, Avoid to download! 
		if(loader.listeners.Count == 0 && loader.isAutoDelete() && loader.state == URLLoaderState.waiting)
			destroyLoader(loader, false, false);
		
		return count;
	}
	
	public void resourceAutoDelete()
	{
		_delayAutoDelete = true;
	}
	
		
	// distribute to user that resource is loaded 
	// General, it calls by manager.
	public void distribute()
	{
		while(_notifyList.Count != 0)
		{
			URLLoader loader = _notifyList[0] as URLLoader;
			
			// This laoder is out of relation with _notifyList, first. 
			// In "ls.dele(loader);", you may destroy this loader, this way, you could not raise an error. 
			_notifyList.RemoveAt(0);	
										
			
			if(loader.state != URLLoaderState.loaded && loader.state != URLLoaderState.error)
				throw new ArgumentOutOfRangeException("loader.state", "state must be loaded or error");
			
			//foreach(URLLoader.Listener ls in loader.listeners)
			// "ls.dele(loader);" may be destroy this loader;
			while(loader.state != URLLoaderState.destroyed && loader.listeners.Count != 0)
			{
				URLLoader.Listener ls = loader.listeners[0] as URLLoader.Listener;
				
				// "ls.dele(loader);" may be remove this delegate, it's incorrect. so, romve it first befor dele() call.
				loader.listeners.RemoveAt(0);
				
				// user do not deal with error. then throw this error
				if(loader.state == URLLoaderState.error && !ls.errNotify)
					throw new Exception("AsynResourceMgr -> distribute() -> url["+loader.fullUrl+"] load error: "+loader.www.error);
				
				if (null==loader.www.assetBundle && !ls.errNotify)
					throw new Exception("AsynResourceMgr -> distribute() -> url["+loader.fullUrl+"] asset bundle is null");
				
				// notify to user
				ls.dele(loader, ls.deleCount);
			}
		}
	}

	
	
	public int MaxDownloadCount
	{
		get
		{
			return _maxDownloadCount;
		}
		set
		{
			if(value > 0)
				_maxDownloadCount = value;
		}
	}
	
	static public string fullUrl(string url)
	{
		return fullUrl(url, -1);
	}
	
	static public string fullUrl(string url, int ver)
	{
		if (url.IndexOf ("file://") == 0 || url.IndexOf ("http://") == 0)
			return url;

		if(ver == -1)
		{
			if (Application.platform == RuntimePlatform.OSXWebPlayer || Application.platform == RuntimePlatform.WindowsWebPlayer)
				return Application.dataPath+"/../AssetBundles/" + url;
			else if (Application.platform == RuntimePlatform.OSXEditor || Application.platform == RuntimePlatform.WindowsEditor)
				return "file://" + Application.dataPath + "/../AssetBundles/" + url;
		}
		else
		{
			if (Application.platform == RuntimePlatform.OSXWebPlayer || Application.platform == RuntimePlatform.WindowsWebPlayer)
				return Application.dataPath+"/../AssetBundles_ver/" + url + "." + ver.ToString();
			else if (Application.platform == RuntimePlatform.OSXEditor || Application.platform == RuntimePlatform.WindowsEditor)
				return "file://" + Application.dataPath + "/../AssetBundles_ver/" + url + "." + ver.ToString();
		}
		return null;
	}
	
	static public string fullUrlWebPlayer(string url)
	{
		if (url.IndexOf ("file://") == 0 || url.IndexOf ("http://") == 0)
			return url;
		
		if (Application.platform == RuntimePlatform.OSXWebPlayer || Application.platform == RuntimePlatform.WindowsWebPlayer)
			return Application.dataPath+"/../WebPlayer/" + url;
		else if (Application.platform == RuntimePlatform.OSXEditor || Application.platform == RuntimePlatform.WindowsEditor)
			return "file://" + Application.dataPath + "/../WebPlayer/" + url;
		
		return null;
	}
	
	
	
	// private --------------------------------
	//
	void update()
	{
		distribute();
		autoDelete();
	}
	
	void autoDelete()
	{
		if(!_delayAutoDelete)
			return;
		
		
		// all downloads prevent auto delete is true, or nothing, will continue.
		bool del = true;
		foreach(URLLoader loader in _downloadList)
		{
			if(loader.preventAutoDelete == false)
			{
				del = false;
				break;
			}
		}
		if(!del)
			return;
		
		// all waitingQueue prevent auto delete is true, or nothing, will continue.
		foreach(URLLoader loader in _waitingQueue)
		{
			if(loader.preventAutoDelete == false)
			{
				del = false;
				break;
			}
		}
		if(!del)
			return;
		
		
		// Ensure all event is distribute
		distribute();
		
		//
		int count0 = _URLLoaders.Count;
		
		string[] keys = new string[_URLLoaders.Keys.Count];
		_URLLoaders.Keys.CopyTo(keys,0);
		foreach(string key in keys)
		{
			URLLoader loader = _URLLoaders[key] as URLLoader;
			
			bool prevent = loader.preventAutoDelete;
			loader.preventAutoDelete = false;	// !!
			
			if(!loader.autoDelete)
				continue;
			
			if(prevent == true)	//prevent auto delete
				continue;
			
			if(loader.state != URLLoaderState.loaded && loader.state != URLLoaderState.error)
				continue;
			
			if(loader.listeners.Count != 0)
				continue;
			
			destroyLoader(loader, false, false);
		}
		
		// very important here
		_delayAutoDelete = false;
		
		Debug.Log("AsynResourceMgr.autoDelete call! Loader Num:" + count0.ToString() + " -> " + _URLLoaders.Count.ToString() );
	}
	
	void destroyLoader(URLLoader loader, bool unloadAllLoadedObjects, bool omitNotify)
	{
		if(!omitNotify && loader.listeners.Count != 0)
		{
			throw new InvalidOperationException("destroyLoader error: url '" + loader.url + "' has some user to notify!"); 
		}
		
		_waitingQueue.Remove(loader);
		_downloadList.Remove(loader);
		_notifyList.Remove(loader);
		//
		_URLLoaders.Remove(loader.getUrl());
		
		//destroy self
		loader.destroySelf(unloadAllLoadedObjects);		
	}
	
	//
	void putinWaitingList(URLLoader loader)
	{
		if(loader.state != URLLoaderState.unload)
			throw new ArgumentOutOfRangeException("loader.state", "state must be URLLoaderState.unload");

		loader.state = URLLoaderState.waiting;
		_waitingQueue.Add(loader);
	}
	
	// call by loader response create, delete
	void fullDownload()
	{
		while(downloadNextOrNot())
		{
		}
	}
	
	//
	bool downloadNextOrNot()
	{
		// if download count is greater than max count, return
		if(_downloadList.Count >= _maxDownloadCount)
			return false;
		
		// nothing to download, return
		if(_waitingQueue.Count == 0)
			return false;
		
		//
		StartCoroutine(asynDownload());
		return true;
	}
	
	
	// async download from _waitingQueue
	IEnumerator asynDownload()
	{
		URLLoader loader = _waitingQueue[0] as URLLoader;
		
		if(loader.state != URLLoaderState.waiting)
			throw new ArgumentOutOfRangeException("loader.state", "state must be URLLoaderState.waiting");
		
		loader.state = URLLoaderState.loading;
		_waitingQueue.Remove(loader);
		_downloadList.Add(loader);

		if(loader.fileVersion == -1)
		{
			//nnd, "File Not Found"  will return true;
			loader.www = new WWW(loader.fullUrl);
		}
		else
		{
			loader.www = new WWW(loader.fullUrl);
			//loader.www = WWW.LoadFromCacheOrDownload(loader.fullUrl, loader.fileVersion);
		}
		
		yield return loader.www;
		
		
		bool downagain = false;
		//may be loader had reomve. so need to check
		if(loader.state != URLLoaderState.destroyed)
		{
			//download error? download once again?
			if(loader.www.error != null)
			{
				downagain = true;
			}
		}
		
		if(downagain)
		{
			//destroy error www
			loader.www.Dispose();
			
			//copy from up
			if(loader.fileVersion == -1)
			{
				//nnd, "File Not Found"  will return true;
				loader.www = new WWW(loader.fullUrl);
			}
			else
			{
				loader.www = new WWW(loader.fullUrl);
				//loader.www = WWW.LoadFromCacheOrDownload(loader.fullUrl, loader.fileVersion);
			}
			
			yield return loader.www;
		}
	
		
		//---------------------------
		// downloaded or error
		
		//may be loader had reomve. so need to check
		if(loader.state != URLLoaderState.destroyed)
		{
			if(loader.state != URLLoaderState.loading)
				throw new ArgumentOutOfRangeException("loader.state", "state must be URLLoaderState.loading");
			
			_downloadList.Remove(loader);
			if(loader.www.error == null)
				loader.state = URLLoaderState.loaded;
			else
				loader.state = URLLoaderState.error;
			
			//notify user
			_notifyList.Add(loader);
			distribute();
			
			//donwload next
			downloadNextOrNot();
		}
	}
	
	
	// vorride --------------------------------
	//
	void Update()
	{
		update();
	}
	
	// URLLoader container
	Hashtable _URLLoaders = new Hashtable();
	
	// waiting for download queue
	ArrayList _waitingQueue = new ArrayList();
	
	// donwloading list
	ArrayList _downloadList = new ArrayList();
	
	// max concurrent download link count
	int _maxDownloadCount = 4;
	
	// list to notify user URL loader is complete or error
	ArrayList _notifyList = new ArrayList();
	
	// delay auto delete
	bool _delayAutoDelete = false;
	
	
	// debug --------------------------------
	//
//	public Hashtable debugURLLoaders()
//	{
//		return _URLLoaders;
//	}
//	
//	public ArrayList debugWaitingQueue()
//	{
//		return _waitingQueue;
//	}	
//
//	public ArrayList debugDownloadList()
//	{
//		return _downloadList;
//	}
//	
//	public ArrayList debugNotifyList()
//	{
//		return _notifyList;
//	}	
//	
//	void Start()
//	{
//		TestAsynResourceMgr mgr = new TestAsynResourceMgr();
//		mgr.test(this);
//	}
}


public class URLLoader : IURLLoader
{
	public URLLoaderState state = URLLoaderState.unload;
	public WWW www;
	public string url;
	public string fullUrl;
	public int fileVersion = -1;
	public bool autoDelete = true;
	public bool preventAutoDelete = false;
	//public int failCount = 0;
	public ArrayList listeners = new ArrayList();
	
	public class Listener
	{
		public bool errNotify = false;
		public int deleCount = 1;
		public AsynResourceMgr.ListenDelegate dele = null;
	}
	
	public void addListener(AsynResourceMgr.ListenDelegate dele, bool errNotify)
	{
		//Here is some problem of efficiency
		foreach(Listener ls in listeners)
		{
			if ( ls.dele == dele )
			{
				ls.deleCount++; // add dele count
				if(ls.errNotify == true)
					ls.errNotify = errNotify;
				return;
			}
		}
		
		//create a new one
		Listener l = new Listener();
		l.errNotify = errNotify;
		l.deleCount = 1; // once
		l.dele = dele;
		listeners.Add(l);
	}
	
	public void destroySelf(bool unloadAllLoadedObjects)
	{
		listeners.Clear();
		
		if(state == URLLoaderState.loading)
		{
			www.Dispose();
		}
		else if(state == URLLoaderState.loaded)
		{
			//if(www.assetBundle != null) 		//you can't access 'www.assetBundle' here, it will raise an error
			www.assetBundle.Unload(unloadAllLoadedObjects);
			www.Dispose();
		}
		else if(state == URLLoaderState.error)
		{
			www.Dispose();
		}
		
		www = null;
		
		state = URLLoaderState.destroyed;
	}
	
	
	// interface --------------------------------------
	//
	public URLLoaderState getState()
	{
		return state;
	}
	
	public WWW getWWW()
	{
		return www;
	}
	
	public string getUrl()
	{
		return url;
	}
	
	public string getFullUrl()
	{
		return fullUrl;
	}
	
	public bool isAutoDelete()
	{
		return autoDelete;
	}
	
	public void setAutoDelete(bool b)
	{
		autoDelete = b;
	}
	
	public int removeListener(AsynResourceMgr.ListenDelegate dele)
	{
		foreach(Listener ls in listeners)
		{
			if ( ls.dele == dele )	// different instance of the same class, delegate is different!
			{
				listeners.Remove(ls);
				return ls.deleCount;
			}
		}
		return 0;
	}
}


//public class TestAsynResourceMgr
//{
//	static int _ix = 0;
//	int testFindLoaderValue = 0;
//	int testDestroyLoaderValue = 0;
//	public AsynResourceMgr _mgr = null;
//	public string urlNull = "null.u3d";
//	public string url1 = "00000001.dds.u3d";
//	public string url2 = "00000001.mat.u3d";
//	public string url3 = "00000003.dds.u3d";
//	public string url4 = "00000003.mat.u3d";
//	public string url5 = "00000008_00.dds.u3d";
//	public string url6 = "00000008_00.mat.u3d";
//	
//	public string urlLarge1 = "10130003_00.dds.u3d";
//	
//	public string urlWeb1 = "http://www.173113.com/uploads/allimg/110331/1-110331132009.jpg";
//	public string urlWeb2 = "http://hiphotos.baidu.com/huyangdiy/pic/item/979e5ec3b6cdaeaed00060dc.jpg";
//	
//	
//	public void test(AsynResourceMgr mgr)
//	{
//		_mgr = mgr;
//		
//		//testLoadSameFileSameTime(); 
//		//testLoadFileNotFound();
//		//testLoadFileNotFoundAndRaiseError();
//		//testLoadMoreThanMaxDownloadCount();
//		//testLoadManyFile();
//		//testFindLoader();
//		//testDestroyLoader();
//		//testDestroyLoaderAndRaiseException1();
//		//testDestroyLoaderAndRaiseException2();
//		//testAutoDelete();
//		//testRemoveDelegate();
//		testDelayAutoDelete();
//	}
//	
//	public void testLoadSameFileSameTime()
//	{
//		printInfo("testLoadSameFileSameTime");
//		
//		_mgr.asynLoad(url1, testLoadSameFileSameTimeDelegate);
//		_mgr.asynLoad(url1, this.testLoadSameFileSameTimeDelegate);
//		_mgr.asynLoad(url1, this.testLoadSameFileSameTimeDelegate);
//	}
//	
//	public void testLoadFileNotFound()
//	{
//		// an InvalidOperationException raise
//		printInfo("testLoadFileNotFound");
//		
//		_mgr.asynLoad(urlNull, commDelegate);
//	}
//	
//	public void testLoadFileNotFoundAndRaiseError()
//	{
//		printInfo("testLoadFileNotFoundAndRaiseError");
//		_mgr.asynLoad(url1, commDelegate);
//		_mgr.asynLoad(urlNull, this.commDelegate, true, true);
//	}
//	
//	public void testLoadMoreThanMaxDownloadCount()
//	{
//		printInfo("testLoadMoreThanMaxDownloadCount");
//		printInfo("MaxDownloadCount = 2  loader = 4");
//		
//		_mgr.MaxDownloadCount = 2;
//		_mgr.asynLoad(url1, testLoadMoreThanMaxDownloadCountDelegate);
//		_mgr.asynLoad(url2, testLoadMoreThanMaxDownloadCountDelegate);
//		_mgr.asynLoad(url3, testLoadMoreThanMaxDownloadCountDelegate);
//		_mgr.asynLoad(url4, testLoadMoreThanMaxDownloadCountDelegate);
//		
//		printMgrContainCount(_mgr);
//	}		
//	
//	public void testLoadManyFile()
//	{
//		printInfo("testLoadManyFile  6");
//		
//		_mgr.asynLoad(url1, commDelegate);
//		_mgr.asynLoad(url2, commDelegate);
//		_mgr.asynLoad(url3, commDelegate);
//		_mgr.asynLoad(url4, commDelegate);
//		_mgr.asynLoad(url5, commDelegate);
//		_mgr.asynLoad(url6, commDelegate);
//	}
//	
//	public void testFindLoader()
//	{
//		printInfo("testFindLoader");
//		
//		testFindLoaderValue = 0;
//		_mgr.asynLoad(url1, testFindLoaderDelegate);
//		_mgr.asynLoad(url2, testFindLoaderDelegate);
//		_mgr.asynLoad(url3, testFindLoaderDelegate);
//		_mgr.asynLoad(url4, testFindLoaderDelegate);
//		_mgr.asynLoad(url5, testFindLoaderDelegate);
//		_mgr.asynLoad(url6, testFindLoaderDelegate);
//		_mgr.asynLoad(urlNull, testFindLoaderDelegate, true, true);
//	}
//	
//	public void testDestroyLoader()
//	{
//		printInfo("testDestroyLoader");
//		
//		testDestroyLoaderValue = 0;
//		_mgr.asynLoad(url1, testDestroyLoaderDelegate);
//		_mgr.asynLoad(url2, testDestroyLoaderDelegate);
//		_mgr.asynLoad(url3, testDestroyLoaderDelegate);
//	}
//	
//	public void testDestroyLoaderAndRaiseException1()
//	{
//		printInfo("testDestroyLoaderAndRaiseException1");
//		
//		IURLLoader loader = _mgr.asynLoad(url1, testDestroyLoaderAndRaiseExceptionDelegate1);
//		string str = "destroy '" + loader.getUrl() + "' with omitNotify = true";
//		printInfo(str);
//		_mgr.destroyLoader(loader.getUrl(), true, true);	//no error
//		printMgrContainCount(_mgr);
//	}
//	
//	public void testDestroyLoaderAndRaiseException2()
//	{
//		printInfo("testDestroyLoaderAndRaiseException2");
//		
//		IURLLoader loader = _mgr.asynLoad(url2, testDestroyLoaderAndRaiseExceptionDelegate2);
//		string str = "destroy '" + loader.getUrl() + "' with omitNotify = false";
//		printInfo(str);
//		_mgr.destroyLoader(loader.getUrl(), true);	//raise error
//		printMgrContainCount(_mgr);
//	}
//	
//	int testAutoDeleteValue = 0;
//	public void testAutoDelete()
//	{
//		printInfo("testAutoDelete");
//		
//		testAutoDeleteValue = 0;
//		_mgr.asynLoad(url1, testAutoDeleteDelegate);
//		_mgr.asynLoad(url2, testAutoDeleteDelegate);
//		_mgr.asynLoad(url3, testAutoDeleteDelegate, false);
//		_mgr.asynLoad(url3, testAutoDeleteDelegate);
//		_mgr.asynLoad(url4, testAutoDeleteDelegate);
//		_mgr.asynLoad(url5, testAutoDeleteDelegate);
//		_mgr.asynLoad(url6, testAutoDeleteDelegate, false);
//
//	}
//	
//	public void testRemoveDelegate()
//	{
//		printInfo("testRemoveDelegate");
//		_mgr.MaxDownloadCount = 1;   // let download queue
//		_mgr.asynLoad(url1, removeDelegateDelegate1);
//		_mgr.asynLoad(url1, removeDelegateDelegate1);
//		_mgr.asynLoad(url2, removeDelegateDelegate2);
//		_mgr.removeDelegate(url1, removeDelegateDelegate1);
//	}
//	
//	int testDelayAutoDeleteValue;
//	public void testDelayAutoDelete()
//	{
//		printInfo("testDelayAutoDelete");
//		
//		testDelayAutoDeleteValue = 0;
//		_mgr.MaxDownloadCount = 2;
//		
//		_mgr.asynLoad(url1, testDelayAutoDeleteDelegate1);
//		_mgr.asynLoad(url2, testDelayAutoDeleteDelegate1);
//		//_mgr.asynLoad(url2, testDelayAutoDeleteDelegate1);
//		_mgr.asynLoad(url3, testDelayAutoDeleteDelegate1);
//		_mgr.asynLoad(url4, testDelayAutoDeleteDelegate1);
//		_mgr.asynLoad(url5, testDelayAutoDeleteDelegate1);
//		_mgr.resourceAutoDelete();
//		
//		_mgr.asynLoad(url2, testDelayAutoDeleteDelegate3);
//		_mgr.asynLoad(url6, testDelayAutoDeleteDelegate3);
//		//_mgr.resourceAutoDelete();	//nouse here. also 3 resource left
//		_mgr.asynLoad(urlWeb1, testDelayAutoDeleteDelegate2);
//		
//		printInfo("1 step:");
//		printMgrContainCount(_mgr);
//	}
//	
//	
//	//
//	IURLLoader testDelayAutoDeleteLoader2;
//	public void testDelayAutoDeleteDelegate1(IURLLoader loader, int deleCount)
//	{
//		testDelayAutoDeleteValue += deleCount;
//		if(testDelayAutoDeleteValue == 5)
//		{
//			printInfo("5 dele 4 res collect");
//			printMgrContainCount(_mgr);
//			testDelayAutoDeleteLoader2 = loader;
//		}
//	}
//	
//	public void testDelayAutoDeleteDelegate2(IURLLoader loader, int deleCount)
//	{
//		printInfo("2 step:");
//		printMgrContainCount(_mgr);
//		printLoader(testDelayAutoDeleteLoader1);	//laoded
//		printLoader(testDelayAutoDeleteLoader2);	//destroy
//		_mgr.resourceAutoDelete();	// will raise an error! becouse it has .jpg here, not an assert bundle.
//		
//		_mgr.asynLoad(urlWeb2, testDelayAutoDeleteDelegate4);
//	}
//	
//	IURLLoader testDelayAutoDeleteLoader1;
//	public void testDelayAutoDeleteDelegate3(IURLLoader loader, int deleCount)
//	{
//		testDelayAutoDeleteLoader1 = loader;
//	}
//	
//	public void testDelayAutoDeleteDelegate4(IURLLoader loader, int deleCount)
//	{
//		printInfo("3 step:");
//		printMgrContainCount(_mgr);
//	}
//		
//	public void removeDelegateDelegate1(IURLLoader loader, int deleCount)
//	{
//		//can't do here
//		printInfo("removeDelegateDelegate1 done");
//	}
//	
//	public void removeDelegateDelegate2(IURLLoader loader, int deleCount)
//	{
//		printInfo("removeDelegateDelegate2 done");
//		
//		printInfo("print all mgr loader");
//		Hashtable t = _mgr.debugURLLoaders();
//		foreach(DictionaryEntry de in t)
//		{
//			IURLLoader l = de.Value as IURLLoader;
//			printLoader(l); 
//		}
//	}
//	
//	public void testAutoDeleteDelegate(IURLLoader loader, int deleCount)
//	{
//		testAutoDeleteValue += deleCount;
//		if(testAutoDeleteValue != 7)
//			return;
//		
//		printMgrContainCount(_mgr);
//		_mgr.resourceAutoDelete();
//		printMgrContainCount(_mgr);	// 2
//	}
//	
//	public void testDestroyLoaderAndRaiseExceptionDelegate1(IURLLoader loader, int deleCount)
//	{
//		printLoader(loader);
//
//	}
//	
//	public void testDestroyLoaderAndRaiseExceptionDelegate2(IURLLoader loader, int deleCount)
//	{
//		printLoader(loader);
//	}
//	
//	public void testDestroyLoaderDelegate(IURLLoader loader, int deleCount)
//	{
//		testDestroyLoaderValue+=deleCount;
//		if ( testDestroyLoaderValue != 3 )
//			return;
//		 
//		printMgrContainCount(_mgr);
//		
//		_mgr.destroyLoader("dfd", true);
//		_mgr.destroyLoader(url2, true);
//		
//		printMgrContainCount(_mgr);
//		string str = url2 + " ->hasLoader ->" + _mgr.hasLoader(url2).ToString();
//		printInfo(str);
//	}
//	
//	public void testFindLoaderDelegate(IURLLoader loader, int deleCount)
//	{
//		testFindLoaderValue+=deleCount;
//		if ( testFindLoaderValue != 7 )
//			return;
//		
//		string str;
//		str = url4 + " ->hasCompleteLoader ->" + _mgr.hasCompleteLoader(url1).ToString();
//		printInfo(str);
//		IURLLoader l1 = _mgr.getLoader(url4);
//		str = url4 + " -> " + l1.getFullUrl();
//		printInfo(str);
//		
//		str = urlNull + " ->hasCompleteLoader ->" + _mgr.hasCompleteLoader(urlNull).ToString();
//		printInfo(str);
//		str = urlNull + " ->hasLoader ->" + _mgr.hasLoader(urlNull).ToString();
//		printInfo(str);
//		
//		str = "asddf.u3d ->hasLoader ->" + _mgr.hasLoader("asddf.u3d").ToString();
//		printInfo(str);
//	}
//	
//	public void testLoadSameFileSameTimeDelegate(IURLLoader loader, int deleCount)
//	{
//		printInfo("deleCount=" + deleCount.ToString());
//		printLoader(loader);
//	}
//	
//	
//	public void commDelegate(IURLLoader loader, int deleCount)
//	{
//		printLoader(loader);
//	}
//	
//	public void testLoadMoreThanMaxDownloadCountDelegate(IURLLoader loader, int deleCount)
//	{
//		printLoader(loader);
//		printMgrContainCount(_mgr);
//	}
//	
//	static public void printInfo(string info)
//	{
//		_ix++;
//		string str = _ix.ToString() + ". ";
//		str += info;
//		Debug.Log(str);
//	}
//	
//	static public void printMgrContainCount(AsynResourceMgr mgr)
//	{
//		Hashtable urls = mgr.debugURLLoaders();
//		ArrayList wait = mgr.debugWaitingQueue();
//		ArrayList down = mgr.debugDownloadList();
//		ArrayList notify = mgr.debugNotifyList();
//	
//		_ix++;
//		string str = _ix.ToString() + ". " + "AsynResourceMgr. all:" + urls.Count.ToString() 
//			+ "  wait:" + wait.Count.ToString() + "  down:" + down.Count.ToString() 
//			+ "  notify:" + notify.Count.ToString();
//		Debug.Log(str);
//	}
//	
//	static public void printLoader(IURLLoader loader)
//	{
//		_ix++;
//		string str = _ix.ToString() + ".";
//		
//		str += " @url:";
//		str += loader.getUrl();
//		
//		str += " @state:";
//		str += loader.getState().ToString();
//		
//		str += " @WWWErr:";
//		if(loader.getWWW() != null && loader.getWWW().error != null )
//			str += loader.getWWW().error.ToString();
//		else
//			str += "(null)"; 
//		
//		str += " @autoDel:";
//		str += loader.isAutoDelete().ToString();
//		
//		str += " @fullUrl:";
//		str += loader.getFullUrl();		
//		
//		
//		Debug.Log(str);
//	}
//}
