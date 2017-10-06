/******************************************************************************
模型加载类
	提供对模型的异步和同步加载方法，加载完结果保存在LoadObj变量中。
******************************************************************************/
//@remark.	clear old code:	Last edit by fullzhu(2012.3.19)
//@remark.
//@remark.
//@remark.
#pragma strict
#pragma downcast



class ModelLoader
{
	//ModelLoader (by fullzhu)
	class LoadModelItem {
		var url : String;
		var callBack : AsynResourceMgr.ListenDelegate;
	}
	
	private var LoadItems : Array = new Array();
	private var mRootDir : String;
	private var mCallbackLoadFinish : Function;
	private var mLoaderState : URLLoaderState = URLLoaderState.unload;
	private var mVisible : boolean = true;
	
	var State : URLLoaderState = URLLoaderState.unload;
	
	public var mModelObj : GameObject;
	public var mMaterialObj : Material;
	public var mAnimationClipObj : Array = new Array();
	public var AsyResMgr : AsynResourceMgr;
	
	function ModelLoader(asyResMgr : AsynResourceMgr) {
		AsyResMgr = asyResMgr;
	}
	
	function ModelLoader() {
	}
	
	public function Update() {
	}
	
	//extern call
	
	//Part Model
	public function AsynLoadModel(name : String, CallbackLoadFinish : Function, autoDel : boolean, visible : boolean) {
		mCallbackLoadFinish = CallbackLoadFinish;
		mLoaderState = URLLoaderState.unload;
		mVisible = visible;
		
		if(name.LastIndexOf("/") != -1)
			mRootDir = name.Substring(0, name.LastIndexOf("/") + 1);
		else
			mRootDir = "";
		
		AsynLoadEvt(Global.UrlRoot + name,new AsynResourceMgr.ListenDelegate(CallbackAsynLoadModel),autoDel,true);
	}
	
	public function SyncLoadModel(name : String, visible : boolean) {
		if(name.LastIndexOf("/") != -1)
			mRootDir = name.Substring(0, name.LastIndexOf("/") + 1);
		else
			mRootDir = "";
			
		var loader : IURLLoader = AsyResMgr.getLoader(Global.UrlRoot + name);
		if(null == loader)
			return null;
		if(null == loader.getWWW().assetBundle)
			return null;
		
		mModelObj = GameObject.Instantiate(loader.getWWW().assetBundle.mainAsset);
		mModelObj.name = loader.getWWW().assetBundle.mainAsset.name;
		CommFunc.setGameObjVisible(mModelObj, visible);
		
		return mModelObj;
	}
	
	//Part Material
	public function AsynLoadMaterial(name : String, CallbackLoadFinish : Function, autoDel : boolean) {
		mCallbackLoadFinish = CallbackLoadFinish;
		mLoaderState = URLLoaderState.unload;
		
		if(name.LastIndexOf("/") != -1)
			mRootDir = name.Substring(0, name.LastIndexOf("/") + 1);
		else
			mRootDir = "";
			
		AsynLoadEvt(Global.UrlRoot + name,new AsynResourceMgr.ListenDelegate(CallbackAsynLoadMateral), autoDel, true);
	}
	
	public function SyncLoadMaterial(name : String) {
		if(name.LastIndexOf("/") != -1)
			mRootDir = name.Substring(0, name.LastIndexOf("/") + 1);
		else
			mRootDir = "";
			
		var loader : IURLLoader = AsyResMgr.getLoader(Global.UrlRoot + name);
		
		mMaterialObj = GameObject.Instantiate(loader.getWWW().assetBundle.mainAsset);
		mMaterialObj.name = loader.getWWW().assetBundle.mainAsset.name;
		
		return mMaterialObj;
	}
	
	//Part Animation
	public function AsynLoadAnimation(name : String, CallbackLoadFinish : Function, autoDel : boolean) {
		mCallbackLoadFinish = CallbackLoadFinish;
		mLoaderState = URLLoaderState.unload;
		
		if(name.LastIndexOf("/") != -1)
			mRootDir = name.Substring(0, name.LastIndexOf("/") + 1);
		else
			mRootDir = "";
			
		AsynLoadEvt(Global.UrlRoot + name,new AsynResourceMgr.ListenDelegate(CallbackAsynLoadAnimation), autoDel, true);
	}
	
	public function SyncLoadAnimation(name : String) : AnimationClip[] {
		if(name.LastIndexOf("/") != -1)
			mRootDir = name.Substring(0, name.LastIndexOf("/") + 1);
		else
			mRootDir = "";
			
		var loader : IURLLoader = AsyResMgr.getLoader(Global.UrlRoot + name);
		
		for(var ani in loader.getWWW().assetBundle.LoadAll(AnimationClip)) {
			mAnimationClipObj.Push(ani);
		}
		
		return mAnimationClipObj.ToBuiltin(AnimationClip);;
	}
	
	//callback
	private function CallbackAsynLoadModel(loader : IURLLoader, delCount : int) {
		if(CheckLoadError(loader)) {
			mCallbackLoadFinish(this);
		} else {
			mModelObj = GameObject.Instantiate(loader.getWWW().assetBundle.mainAsset);
			mModelObj.name = loader.getWWW().assetBundle.mainAsset.name;
			State = URLLoaderState.loaded;
			CommFunc.setGameObjVisible(mModelObj, mVisible);
			
			mCallbackLoadFinish(this);
		}
	}
	
	private function CallbackAsynLoadMateral(loader : IURLLoader, delCount : int) {
		if(CheckLoadError(loader)) {
			mCallbackLoadFinish(this);
		} else {
			mMaterialObj = GameObject.Instantiate(loader.getWWW().assetBundle.mainAsset);
			mMaterialObj.name = loader.getWWW().assetBundle.mainAsset.name;
			State = URLLoaderState.loaded;
			
			mCallbackLoadFinish(this);
		}
	}
	
	private function CallbackAsynLoadAnimation(loader : IURLLoader, delCount : int) {
		if(CheckLoadError(loader)) {
			mCallbackLoadFinish(this);
		} else {
			for(var ani in loader.getWWW().assetBundle.LoadAll(AnimationClip)) {
				mAnimationClipObj.Push(ani);
			}
			State = URLLoaderState.loaded;
			
			mCallbackLoadFinish(this);
		}
	}
	
	//internal function
	private function CheckLoadError(loader : IURLLoader) : boolean {
		if(loader.getState() != URLLoaderState.loaded /*|| loader.www.assetBundle == null*/) {
			//mLoaderState = loader.getState();
			
			//if(loader.www.assetBundle == null)
			//	mLoaderState = URLLoaderState.error;
		
			//return true;
			
			mLoaderState = loader.getState();
			if(loader.getState() != URLLoaderState.error)
                throw new ArgumentOutOfRangeException("CheckLoadError", "CheckLoadError had an error state");
            Debug.LogWarning("CheckLoadError: " + loader.getWWW().error);
            return true;
		}
		
		return false;
	}
	
	private function AsynLoadEvt(url : String, callBack : AsynResourceMgr.ListenDelegate, autoDel : boolean, errNotify : boolean) {
		var lmi : LoadModelItem = new LoadModelItem();
		lmi.url = url;
		lmi.callBack = callBack;
		LoadItems.Add(lmi);
		
		return AsyResMgr.asynLoad(url, lmi.callBack, autoDel, false);
	}
	
	//destroy current and cancel all load process and callback
	//用完不要在用本对象，新建一个。
	//
	function Destroy()
	{
		for(var lit : LoadModelItem in LoadItems)
		{
			AsyResMgr.removeDelegate(lit.url, lit.callBack);
		}
		LoadItems.Clear();
		
		if(mMaterialObj)
			UnityEngine.Object.Destroy(mMaterialObj);
			
		if(mModelObj)
			UnityEngine.Object.Destroy(mModelObj);
	}
	
	
	//data operate
	public function GetModelObj() : GameObject {
		return mModelObj;
	}
	
	public function GetMaterialObj() : Material {
		return mMaterialObj;
	}
	
	public function GetAnimationClip() : AnimationClip[] {
		return mAnimationClipObj.ToBuiltin(AnimationClip);
	}
}
