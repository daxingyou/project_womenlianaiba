/*--------------------------------------------------
控制器,主要作为界面和逻辑间的消息和数据传递(2012/2/7 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast



class Controller
{
	private var mEvents : Hashtable = new Hashtable();
	private var mDatas : Hashtable = new Hashtable();	// 数据中转中心
	
	/*--------------------------------------------------
	*** handler格式:
	*	function handler(param : System.Object);
	*/
	//--------------------------------------------------
	// 注册事件
	public function Register(event : String, handler : Function) : void
	{
		if (mEvents.ContainsKey(event))
		{
			if (_checkRegister(event, handler))
			{
				return;
			}
			var handler_arr : Array = mEvents[event];
			handler_arr.Add(handler);
		}
		else
		{
			var handles : Array = new Array();
			handles.Add(handler);
			mEvents.Add(event, handles);
		}
	}
	// 取消注册事件
	public function Unregister(event : String) : void
	{
		if (mEvents.ContainsKey(event))
		{
			var handler_arr : Array = mEvents[event];
			handler_arr.Clear();
			mEvents.Remove(event);
		}
	}
	// 取消注册事件
	public function Unregister(event : String, handler : Function) : void
	{
		if (_checkRegister(event, handler))
		{
			var handler_arr : Array = mEvents[event];
			handler_arr.Remove(handler);
		}
	}
	// 执行事件
	public function Excute(event : String, param : System.Object) : void
	{
		if (mEvents.ContainsKey(event))
		{
			var handlers : Array = mEvents[event];
			CommFunc.removeArrayNull(handlers);
			
			for (var handler : Function in handlers)
			{
				if (null == handler)
					continue;
				handler(param);
			}	
		}
	}
	// 判断是否注册
	private function _checkRegister(event : String, handler : Function) : boolean
	{
		if (mEvents.ContainsKey(event))
		{
			for (var h : Function in mEvents[event])
			{
				if (h == handler)
					return true;
			}
		}
		return false;
	}
	//--------------------------------------------------
	// 设置中转数据
	public function Set(event : String, param : System.Object) : void
	{
		if (mDatas.ContainsKey(event))
		{
			mDatas[event] = param;
		}
		else
		{
			mDatas.Add(event, param);
		}
	}
	// 取消中转数据
	public function Recover(event : String) : void
	{
		if (mDatas.ContainsKey(event))
		{
			mDatas.Remove(event);
		}
	}
	// 获取中转数据
	public function Get(event : String) : System.Object
	{
		if (mDatas.ContainsKey(event))
		{
			return mDatas[event];
		}
		return null;
	}
	//--------------------------------------------------
	// 清除
	public function Clear() : void
	{
		mEvents.Clear();
		mDatas.Clear();
	}
	//--------------------------------------------------
}


