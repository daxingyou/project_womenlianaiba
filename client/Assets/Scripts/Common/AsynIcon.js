#pragma strict
/* 异步图标加载方案 --Y3
 * 概述: 由于我们的图标都是.u3d的资源, 这就涉及到异步加载的问题. 所以就有了这个便捷方案
 * 
 * 构造函数
 * callback 回调函数  格式为function callbackFunc(tex:Texture) 在设置图片时候调用, 参数为要设置的图片.
 * loadingIcon loading时候的图片, 可以为null
 * function AsynIcon(callback, loadingIcon:Texture)
 *
 * 加载icon资源. 可以重复调用, 也可以重复换资源.
 * function load(iconName:String):void
 *
 * 取消icon加载. 确保在中断和废弃图标的时候调用它. 否则, 可能继续回调.
 * function cancel():void
 */
class AsynIcon
{
	private var _callback : Function;		// function callback(tex : Texture) : void
	//
	function AsynIcon(callback : Function, loadingIcon:Texture)
	{
		_callback = callback;
		_loadingIcon = loadingIcon;
	}
	
	function load(iconName:String):void
	{
		var spts : String[] = iconName.Split(["."], StringSplitOptions.RemoveEmptyEntries);
		if (3 != spts.Length || (3 == spts.Length && "png" != spts[1]))
			throw ("AsynIcon -> load(String) -> icon name [" + iconName + "] is wrong.");
		
		var iconPath:String = iconName;
		var needLoad:boolean = false;
		if(_loading)		
		{
			if(_iconPath!=iconPath)
			{
				//如果正在加载, 且文件路径不一致. 则取消当前加载, 再加载新的.
				cancel();
				needLoad = true;
			}
			else
			{
				//如果正在加载, 且文件路径一致. 啥都不做.
			}
		}
		else
		{
			//如果没加载, 就加载他. 如是是同一个文件被重复加载, 会从缓存中取数据, 不用担心网络性能问题.
			needLoad = true;
		}
	
		//
		if(needLoad)
		{
			_iconPath = iconPath;
			var loader:IURLLoader = Global.GetAsynResMgr().asynLoad(_iconPath, downloadOK);
			_loading = true;
			
			//如果有loading图标, 且资源未加载完成. 则设置当前图标为loading图标.
			if(_loadingIcon!=null && loader.getState()!=URLLoaderState.loaded)
				if(_callback!=null)
					_callback(_loadingIcon);
		}
	}
	
	function cancel():void
	{
		if(_loading)
		{
			Global.GetAsynResMgr().removeDelegate(_iconPath, downloadOK);
			_loading = false;
		}
	}
	
	private function downloadOK(loader:IURLLoader, deleCount:int) : void
	{
		_loading = false;
		
		if(_callback!=null)
			_callback(loader.getWWW().assetBundle.mainAsset);
	}
	
	private var _loadingIcon:Texture;
	private var _iconPath:String = "";
	private var _loading:boolean = false;
}



class AsynIconEx extends AsynIcon
{
	private var mCallback : Function = null;		// function callback(tex : Texture, param : System.Object) : void
	public var param : System.Object = null;
	//
	public function AsynIconEx(callback : Function, loadingIcon : Texture)
	{
		mCallback = callback;
		super(finishCallback, loadingIcon);
	}
	//
	private function finishCallback(tex : Texture) : void
	{
		if (mCallback)
		{
			mCallback(tex, param);
		}
	}
}

